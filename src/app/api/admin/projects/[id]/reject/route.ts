import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
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

    const { reason } = await request.json();

    if (!reason || reason.trim() === "") {
      return NextResponse.json(
        { message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Update project status to rejected
    project.status = "rejected";
    project.rejectionReason = reason;
    project.reviewedBy = session.user.id;
    project.reviewedAt = new Date();

    // Clear any existing change request
    project.changeRequest = undefined;

    // Add to review history
    project.reviewHistory.push({
      action: "reject",
      adminId: session.user.id,
      timestamp: new Date(),
      notes: reason,
    });

    await project.save();

    return NextResponse.json({
      message: "Project rejected successfully",
      project: {
        _id: project._id,
        status: project.status,
        rejectionReason: project.rejectionReason,
        reviewedAt: project.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Error rejecting project:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
