import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import Review from "@/lib/models/Review";
import { trackEvent } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const project = await Project.findOne({ slug: params.slug })
      .populate("categoryId", "name slug color")
      .populate("tagIds", "name slug color");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Increment view count
    await Project.findByIdAndUpdate(project._id, {
      $inc: { viewCount: 1 },
    });

    // Get reviews
    const reviews = await Review.find({
      projectId: project._id,
      status: "approved",
    })
      .populate("userId", "name image")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get similar projects
    const similarProjects = await Project.find({
      _id: { $ne: project._id },
      categoryId: project.categoryId,
      status: "live",
    })
      .populate("categoryId", "name slug color")
      .populate("tagIds", "name slug color")
      .sort({ avgRating: -1 })
      .limit(4);

    // Track view event
    trackEvent("view_project", {
      projectId: project._id.toString(),
      projectSlug: project.slug,
    });

    return NextResponse.json({
      ...project.toObject(),
      reviews,
      similarProjects,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
