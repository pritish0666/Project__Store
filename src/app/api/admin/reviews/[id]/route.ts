import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// Helper function to check admin role
async function checkAdminRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  return user?.role === "admin" ? user : null;
}

// PUT /api/admin/reviews/[id] - Update review status or content
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await checkAdminRole();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, body: reviewBody, rating } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewBody) updateData.body = reviewBody;
    if (rating) updateData.rating = rating;

    const review = await Review.findByIdAndUpdate(params.id, updateData, {
      new: true,
    })
      .populate("projectId", "title slug")
      .populate("userId", "name email image");

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // If review was approved/rejected, update project ratings
    if (status === "approved" || status === "rejected") {
      await updateProjectRatings(review.projectId);
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await checkAdminRole();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const projectId = review.projectId;
    await Review.findByIdAndDelete(params.id);

    // Update project ratings after deletion
    await updateProjectRatings(projectId);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

// Helper function to update project ratings
async function updateProjectRatings(projectId: any) {
  const reviews = await Review.find({
    projectId,
    status: "approved",
  });

  if (reviews.length > 0) {
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Project.findByIdAndUpdate(projectId, {
      avgRating: Math.round(avgRating * 10) / 10,
      ratingsCount: reviews.length,
    });
  } else {
    await Project.findByIdAndUpdate(projectId, {
      avgRating: 0,
      ratingsCount: 0,
    });
  }
}
