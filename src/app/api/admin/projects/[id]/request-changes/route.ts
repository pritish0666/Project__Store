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

    const { feedback, deadline } = await request.json();

    if (!feedback || feedback.trim() === "") {
      return NextResponse.json(
        { message: "Feedback is required" },
        { status: 400 }
      );
    }

    if (!deadline) {
      return NextResponse.json(
        { message: "Deadline is required" },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (deadlineDate <= now) {
      return NextResponse.json(
        { message: "Deadline must be in the future" },
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

    // Update project status to needs-changes
    project.status = "needs-changes";
    project.changeRequest = {
      feedback: feedback.trim(),
      deadline: deadlineDate,
      requestedBy: session.user.id,
      requestedAt: new Date(),
    };
    project.reviewedBy = session.user.id;
    project.reviewedAt = new Date();

    // Clear any existing rejection reason
    project.rejectionReason = undefined;

    // Add to review history
    project.reviewHistory.push({
      action: "request-changes",
      adminId: session.user.id,
      timestamp: new Date(),
      notes: feedback.trim(),
    });

    await project.save();

    return NextResponse.json({
      message: "Change request sent successfully",
      project: {
        _id: project._id,
        status: project.status,
        changeRequest: project.changeRequest,
        reviewedAt: project.reviewedAt,
      },
    });
  } catch (error) {
    console.error("Error requesting changes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
