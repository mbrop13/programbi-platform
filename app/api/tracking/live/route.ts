import { NextResponse } from "next/server";
import { recordLiveClassAttendance } from "@/lib/supabase/tracking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, incrementSeconds } = body;

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    const result = await recordLiveClassAttendance(classId, incrementSeconds || 30);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
