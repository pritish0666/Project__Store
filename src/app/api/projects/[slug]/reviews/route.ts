import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
import { createReviewSchema } from "@/lib/validations";
import { authOptions } from "@/lib/auth";
import { trackEvent } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort =
      (searchParams.get("sort") as "recent" | "helpful" | "rating") || "recent";

    const project = await Project.findOne({ slug: params.slug });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;

    let sortQuery: any = {};
    switch (sort) {
      case "helpful":
        sortQuery = { helpfulVotes: -1, createdAt: -1 };
        break;
      case "rating":
        sortQuery = { rating: -1, createdAt: -1 };
        break;
      case "recent":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const [reviews, total] = await Promise.all([
      Review.find({
        projectId: project._id,
        status: "approved",
      })
        .populate("userId", "name image")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .exec(),
      Review.countDocuments({
        projectId: project._id,
        status: "approved",
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const project = await Project.findOne({ slug: params.slug });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Check if user already reviewed this project
    const existingReview = await Review.findOne({
      projectId: project._id,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this project" },
        { status: 400 }
      );
    }

    // Create review
    const review = new Review({
      projectId: project._id,
      userId: session.user.id,
      ...validatedData,
    });

    await review.save();

    // Update project rating
    const reviews = await Review.find({
      projectId: project._id,
      status: "approved",
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Project.findByIdAndUpdate(project._id, {
      avgRating: Math.round(avgRating * 10) / 10,
      ratingsCount: reviews.length,
    });

    // Track event
    trackEvent("submit_review", {
      projectId: project._id.toString(),
      rating: validatedData.rating,
      reviewLength: validatedData.body.length,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
