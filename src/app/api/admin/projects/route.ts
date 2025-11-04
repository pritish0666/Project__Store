import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
// Ensure schemas are registered for population
import "@/lib/models/Category";
import "@/lib/models/Tag";

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

// GET /api/admin/projects - List all projects with admin controls
export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdminRole();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query)
      .populate("categoryId", "name slug")
      .populate("tagIds", "name slug color")
      .populate("submittedBy", "name email")
      .populate("reviewedBy", "name email")
      .populate("changeRequest.requestedBy", "name email")
      .populate("reviewHistory.adminId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments(query);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdminRole();
    if (!admin) {
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
      status,
      heroImage,
      screenshots,
      features,
    } = body;

    // Validate required fields
    if (!title || !tagline || !description || !categoryId || !heroImage) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, tagline, description, categoryId, heroImage",
        },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this title already exists" },
        { status: 400 }
      );
    }

    const project = new Project({
      slug,
      title,
      tagline,
      description,
      categoryId,
      tagIds,
      techStack,
      repoUrl,
      demoUrl,
      version,
      status: status || "pending", // Use "pending" instead of "draft"
      heroImage,
      screenshots: screenshots || [],
      features: features || [],
      submittedBy: admin._id, // Admin is the submitter
      avgRating: 0,
      ratingsCount: 0,
      viewCount: 0,
    });

    await project.save();
    await project.populate("categoryId", "name slug");
    await project.populate("tagIds", "name slug color");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
