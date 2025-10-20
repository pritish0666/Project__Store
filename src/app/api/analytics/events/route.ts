import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import { analyticsEventSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = analyticsEventSchema.parse(body);

    const event = new AnalyticsEvent({
      ...validatedData,
      timestamp: new Date(validatedData.timestamp || Date.now()),
    });

    await event.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid event data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
