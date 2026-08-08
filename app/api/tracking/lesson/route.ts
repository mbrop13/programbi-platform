import { NextResponse } from "next/server";
import { recordLessonView } from "@/lib/supabase/tracking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lessonId, courseId, incrementWatchSeconds, lastPositionSeconds, isCompleted } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json({ error: "Missing lessonId or courseId" }, { status: 400 });
    }

    const result = await recordLessonView(
      lessonId,
      courseId,
      incrementWatchSeconds || 10,
      lastPositionSeconds || 0,
      !!isCompleted
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
