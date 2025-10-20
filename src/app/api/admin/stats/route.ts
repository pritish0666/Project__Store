import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";
import Review from "@/lib/models/Review";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get basic stats
    const [
      totalProjects,
      totalUsers,
      totalReviews,
      totalViews,
      pendingReviews,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: "$viewCount" } } },
      ]).then((result) => result[0]?.total || 0),
      Review.countDocuments({ status: "pending" }),
      Project.find()
        .select("title status avgRating ratingsCount createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({
      totalProjects,
      totalUsers,
      totalReviews,
      totalViews,
      pendingReviews,
      recentProjects,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
