import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  checkExpiredChangeRequests,
  getChangeRequestStats,
} from "@/lib/deadline-monitor";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await checkExpiredChangeRequests();

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        expiredCount: result.expiredCount,
      });
    } else {
      return NextResponse.json(
        { message: "Failed to check expired requests", error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in deadline check endpoint:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const stats = await getChangeRequestStats();

    return NextResponse.json({
      stats,
      message: "Change request statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting change request stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
