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

// GET /api/admin/reviews - List all reviews with admin controls
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

    const query: any = {};
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate("projectId", "title slug")
      .populate("userId", "name email image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
