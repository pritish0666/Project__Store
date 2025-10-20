import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tag from "@/lib/models/Tag";

export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
