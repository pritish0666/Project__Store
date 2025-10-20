import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// Helper function to get current user
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  return user;
}

// GET /api/user/projects/[id] - Get user's project for editing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findOne({
      _id: params.id,
      submittedBy: user._id,
    })
      .populate("categoryId", "name slug")
      .populate("tagIds", "name slug color");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/user/projects/[id] - Update user's project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      tagline,
      description,
      categoryId,
      tagIds,
      techStack,
      repoUrl,
      demoUrl,
      version,
      heroImage,
      screenshots,
      features,
    } = body;

    // Check if project exists and belongs to user
    const existingProject = await Project.findOne({
      _id: params.id,
      submittedBy: user._id,
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate new slug if title changed
    let slug = existingProject.slug;
    if (title && title !== existingProject.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await Project.findOne({
        slug,
        _id: { $ne: params.id },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "A project with this title already exists" },
          { status: 400 }
        );
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(tagline && { tagline }),
      ...(description && { description }),
      ...(categoryId && { categoryId }),
      ...(tagIds && { tagIds }),
      ...(techStack && { techStack }),
      ...(repoUrl !== undefined && { repoUrl }),
      ...(demoUrl !== undefined && { demoUrl }),
      ...(version && { version }),
      ...(heroImage && { heroImage }),
      ...(screenshots && { screenshots }),
      ...(features && { features }),
      ...(slug !== existingProject.slug && { slug }),
      status: "pending", // Reset to pending after edit
      adminNotes: undefined, // Clear admin notes
      rejectionReason: undefined, // Clear rejection reason
    };

    const project = await Project.findByIdAndUpdate(params.id, updateData, {
      new: true,
    })
      .populate("categoryId", "name slug")
      .populate("tagIds", "name slug color");

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
