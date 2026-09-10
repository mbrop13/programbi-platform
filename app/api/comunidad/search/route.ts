import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LIMIT = 8;

function excerptFromContent(content: unknown): string {
  if (typeof content === "string") return content.slice(0, 120);
  if (content && typeof content === "object" && "text" in content) {
    return String((content as { text?: string }).text || "").slice(0, 120);
  }
  try {
    return JSON.stringify(content).slice(0, 120);
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({ courses: [], lessons: [], posts: [] });
  }

  const like = `%${q}%`;

  const [coursesRes, lessonsRes, postsRes] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, slug")
      .eq("is_published", true)
      .ilike("title", like)
      .limit(LIMIT),
    supabase.from("lessons").select("id, title, course_id").ilike("title", like).limit(LIMIT),
    supabase.from("posts").select("id, content").ilike("content", like).limit(LIMIT),
  ]);

  const lessons = lessonsRes.data || [];
  const courseIds = [...new Set(lessons.map((l) => l.course_id).filter(Boolean))];
  let courseById: Record<string, string> = {};
  if (courseIds.length > 0) {
    const { data: lessonCourses } = await supabase.from("courses").select("id, slug").in("id", courseIds);
    courseById = Object.fromEntries((lessonCourses || []).map((c) => [c.id, c.slug]));
  }

  return NextResponse.json({
    courses: coursesRes.data || [],
    lessons: lessons
      .map((l) => ({
        id: l.id,
        title: l.title,
        course_slug: courseById[l.course_id] || "",
      }))
      .filter((l) => l.course_slug),
    posts: (postsRes.data || []).map((p) => ({
      id: p.id,
      excerpt: excerptFromContent(p.content),
    })),
  });
}
