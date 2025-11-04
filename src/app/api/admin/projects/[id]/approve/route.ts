import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Update project status to live
    project.status = "live";
    project.reviewedBy = session.user.id;
    project.reviewedAt = new Date();

    // Add to review history
    project.reviewHistory.push({
      action: "approve",
      adminId: session.user.id,
      timestamp: new Date(),
      notes: "Project approved and published",
    });

    await project.save();

    return NextResponse.json({
      message: "Project approved successfully",
      project: {
        _id: project._id,
        status: project.status,
        reviewedAt: project.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Error approving project:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
