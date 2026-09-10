import { cache } from "react";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCampusSession } from "./session";
import { communityAccess, lessonUnlocked, type Access } from "./access";
import { FREE_PREVIEW_ACCESS_ENABLED } from "@/lib/data/community-flags";
import { slugifyLessonTitle } from "./aula-utils";

export type LiteCourse = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category: string | null;
  image_url: string | null;
  icon: string | null;
  accent_color: string | null;
  badge_label: string | null;
  badge_color: string | null;
  tech_stack: string[] | null;
  duration_hours: number | null;
  level: string | null;
  is_featured: boolean | null;
  sort_order: number | null;
  price_clp: number | null;
  lesson_count: number;
  has_free_preview: boolean;
};

export type LiteEnrollment = {
  course_slug: string;
  access_type: Access | null;
  course: LiteCourse | null;
};

async function lessonStatsForCourseIds(courseIds: string[]) {
  const stats: Record<string, { count: number; hasFreePreview: boolean; latest: string | null }> = {};
  if (courseIds.length === 0) return stats;

  const adminDb = createAdminClient();
  const { data: lessons } = await adminDb
    .from("lessons")
    .select("course_id, is_free_preview, created_at")
    .in("course_id", courseIds);

  for (const l of lessons || []) {
    if (!stats[l.course_id]) stats[l.course_id] = { count: 0, hasFreePreview: false, latest: null };
    stats[l.course_id].count++;
    if (l.is_free_preview === true) stats[l.course_id].hasFreePreview = true;
    if (!stats[l.course_id].latest || (l.created_at && l.created_at > stats[l.course_id].latest!)) {
      stats[l.course_id].latest = l.created_at;
    }
  }
  return stats;
}

export const getPublishedCoursesLite = cache(async (): Promise<LiteCourse[]> => {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, slug, title, short_description, category, image_url, icon, accent_color, badge_label, badge_color, tech_stack, duration_hours, level, is_featured, sort_order, price_clp"
    )
    .eq("is_published", true)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true });

  if (error || !courses?.length) return [];

  const stats = await lessonStatsForCourseIds(courses.map((c) => c.id));
  return courses
    .filter((c) => (stats[c.id]?.count || 0) > 0)
    .map((c) => ({
      ...c,
      lesson_count: stats[c.id]?.count || 0,
      has_free_preview: stats[c.id]?.hasFreePreview || false,
    }));
});

export const getCourseIdBySlug = cache(async (slug: string): Promise<string | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
});

export const getMyEnrollmentsLite = cache(async (): Promise<{
  enrollments: LiteEnrollment[];
  programSiblings: LiteCourse[];
}> => {
  const session = await getCampusSession();
  if (!session.user) return { enrollments: [], programSiblings: [] };

  const supabase = await createClient();
  const adminDb = createAdminClient();

  const [enrollmentsRes, profileRes, publishedRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("course_slug, status, access_type, enrolled_at")
      .eq("user_id", session.user.id)
      .eq("status", "active"),
    adminDb
      .from("profiles")
      .select("is_on_trial, subscription_plan, subscription_expires_at, role")
      .eq("id", session.user.id)
      .maybeSingle(),
    adminDb.from("courses").select("id, slug").eq("is_published", true).eq("is_hidden", false),
  ]);

  const published = publishedRes.data || [];
  const stats = await lessonStatsForCourseIds(published.map((c) => c.id));
  const communitySlugs = published.filter((c) => (stats[c.id]?.count || 0) > 0).map((c) => c.slug);

  const profile = profileRes.data;
  const accessForCommunity = communityAccess({
    isAdmin: session.isAdmin,
    profile,
  });

  const data = [...(enrollmentsRes.data || [])];
  if (accessForCommunity === "full" || accessForCommunity === "trial" || (accessForCommunity === "free" && FREE_PREVIEW_ACCESS_ENABLED)) {
    const required = accessForCommunity === "full" ? "full" : accessForCommunity === "trial" ? "trial" : "free";
    for (const slug of communitySlugs) {
      const existingIdx = data.findIndex((e) => e.course_slug === slug);
      if (existingIdx !== -1) {
        if (required === "full" && data[existingIdx].access_type !== "full") {
          data[existingIdx] = { ...data[existingIdx], access_type: "full" };
        }
      } else {
        data.push({
          course_slug: slug,
          status: "active",
          access_type: required,
          enrolled_at: new Date().toISOString(),
        });
      }
    }
  }

  if (data.length === 0) return { enrollments: [], programSiblings: [] };

  const slugs = data.map((e) => e.course_slug);
  const { data: courses } = await supabase
    .from("courses")
    .select(
      "id, slug, title, short_description, category, image_url, icon, accent_color, badge_label, badge_color, tech_stack, duration_hours, level, is_featured, sort_order, price_clp"
    )
    .in("slug", slugs);

  const enrolledStats = await lessonStatsForCourseIds((courses || []).map((c) => c.id));
  const enrollments: LiteEnrollment[] = data
    .map((e) => {
      const c = courses?.find((course) => course.slug === e.course_slug);
      return {
        course_slug: e.course_slug,
        access_type: (e.access_type as Access) || null,
        course: c
          ? {
              ...c,
              lesson_count: enrolledStats[c.id]?.count || 0,
              has_free_preview: enrolledStats[c.id]?.hasFreePreview || false,
            }
          : null,
      };
    })
    .filter((e) => e.course);

  return { enrollments, programSiblings: [] };
});

export async function getPostsPage({ offset = 0, limit = 10 }: { offset?: number; limit?: number } = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      likes_count,
      is_pinned,
      author:profiles(id, full_name, avatar_url),
      comments(id, content, created_at, author:profiles(id, full_name, avatar_url))
    `
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching posts page:", error);
    return [];
  }

  const page = posts || [];
  const ids = page.map((p) => p.id);
  let liked = new Set<string>();
  if (user && ids.length > 0) {
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", ids);
    liked = new Set((likes || []).map((l) => l.post_id));
  }

  return page.map((p) => ({
    ...p,
    comments: Array.isArray(p.comments) ? p.comments.slice(0, 3) : [],
    comments_count: Array.isArray(p.comments) ? p.comments.length : 0,
    is_liked_by_user: liked.has(p.id),
  }));
}

export async function getPostComments(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, author:profiles(id, full_name, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  return data || [];
}

export async function getInicioRail() {
  const session = await getCampusSession();
  if (!session.user) return { continueCourse: null, nextLive: null, xp: 0, streak: 0 };

  const supabase = await createClient();
  const adminDb = createAdminClient();

  const [progressRes, liveRes, profileRes] = await Promise.all([
    adminDb
      .from("user_progress")
      .select("course_id, lesson_id, updated_at")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("live_classes")
      .select("id, title, scheduled_at, status")
      .in("status", ["scheduled", "active"])
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    adminDb.from("profiles").select("xp_points, study_streak").eq("id", session.user.id).maybeSingle(),
  ]);

  let continueCourse: { slug: string; title: string; image_url: string | null } | null = null;
  if (progressRes.data?.course_id) {
    const { data: course } = await supabase
      .from("courses")
      .select("slug, title, image_url")
      .eq("id", progressRes.data.course_id)
      .maybeSingle();
    if (course) continueCourse = course;
  }

  return {
    continueCourse,
    nextLive: liveRes.data,
    xp: profileRes.data?.xp_points || 0,
    streak: profileRes.data?.study_streak || 0,
  };
}

export const getLiveNow = cache(async () => {
  const supabase = await createClient();
  const [activeRes, recordingsRes] = await Promise.all([
    supabase
      .from("live_classes")
      .select("id, title, description, scheduled_at, status, youtube_url, thumbnail_url")
      .in("status", ["scheduled", "active"])
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("live_classes")
      .select("id, title, description, scheduled_at, status, youtube_url, thumbnail_url")
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false })
      .limit(12),
  ]);
  return { current: activeRes.data, recordings: recordingsRes.data || [] };
});

export type SyllabusLesson = {
  id: string;
  title: string;
  slug: string;
  module_name: string;
  module_order: number;
  lesson_order: number;
  duration_minutes: number;
  is_free_preview: boolean;
  superclass_language: string | null;
  resources: { name: string; url: string; size?: number }[];
  unlocked: boolean;
};

export type SyllabusModule = {
  name: string;
  order: number;
  lessons: SyllabusLesson[];
};

export type CourseSyllabus = {
  courseId: string;
  slug: string;
  title: string;
  access: Access;
  completedLessonIds: string[];
  modules: SyllabusModule[];
};

export type LessonDetail = SyllabusLesson & {
  video_url: string;
  content_markdown: string;
  description: string;
};

async function resolveCourseAccess(courseId: string) {
  const session = await getCampusSession();
  if (!session.user) {
    return { session, access: "locked" as Access, course: null as { slug: string; title: string; is_hidden: boolean } | null, completedLessonIds: [] as string[] };
  }
  const adminDb = createAdminClient();
  const [profileRes, courseRes, progressRes, enrollRes] = await Promise.all([
    adminDb
      .from("profiles")
      .select("is_on_trial, subscription_plan, subscription_expires_at, role")
      .eq("id", session.user.id)
      .maybeSingle(),
    adminDb.from("courses").select("slug, title, is_hidden").eq("id", courseId).maybeSingle(),
    adminDb
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .eq("completed", true),
    adminDb
      .from("enrollments")
      .select("access_type, course_slug")
      .eq("user_id", session.user.id)
      .eq("status", "active"),
  ]);

  const course = courseRes.data;
  const enrollment = (enrollRes.data || []).find((e) => e.course_slug === course?.slug);
  const access = communityAccess({
    isAdmin: session.isAdmin,
    profile: profileRes.data,
    enrollmentAccess: enrollment?.access_type,
    isHiddenCourse: course?.is_hidden === true,
  });

  return {
    session,
    access,
    course,
    completedLessonIds: (progressRes.data || []).map((p) => p.lesson_id),
  };
}

export const getCourseSyllabus = cache(async (courseId: string): Promise<CourseSyllabus | null> => {
  const { access, course, completedLessonIds } = await resolveCourseAccess(courseId);
  if (!course) return null;

  const adminDb = createAdminClient();
  const { data: rows } = await adminDb
    .from("lessons")
    .select("id, title, module_name, module_order, lesson_order, duration_minutes, is_free_preview, superclass_language, resources")
    .eq("course_id", courseId)
    .order("module_order", { ascending: true })
    .order("lesson_order", { ascending: true });

  const seen = new Set<string>();
  const lessons: SyllabusLesson[] = [];
  (rows || []).forEach((l, index) => {
    const key = (l.title || "").trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    lessons.push({
      id: l.id,
      title: l.title,
      slug: slugifyLessonTitle(l.title),
      module_name: l.module_name,
      module_order: l.module_order,
      lesson_order: l.lesson_order,
      duration_minutes: l.duration_minutes || 0,
      is_free_preview: l.is_free_preview === true,
      superclass_language: l.superclass_language || null,
      resources: Array.isArray(l.resources) ? l.resources : [],
      unlocked: lessonUnlocked(access, l, index),
    });
  });

  const moduleMap = new Map<string, SyllabusModule>();
  for (const lesson of lessons) {
    const existing = moduleMap.get(lesson.module_name);
    if (existing) existing.lessons.push(lesson);
    else moduleMap.set(lesson.module_name, { name: lesson.module_name, order: lesson.module_order, lessons: [lesson] });
  }

  return {
    courseId,
    slug: course.slug,
    title: course.title,
    access,
    completedLessonIds,
    modules: [...moduleMap.values()].sort((a, b) => a.order - b.order),
  };
});

export async function getLessonDetail(courseId: string, lessonId: string): Promise<LessonDetail | null> {
  const syllabus = await getCourseSyllabus(courseId);
  if (!syllabus) return null;
  const lesson = syllabus.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!lesson) return null;

  const adminDb = createAdminClient();
  const { data } = await adminDb
    .from("lessons")
    .select("video_url, content_markdown, description")
    .eq("id", lessonId)
    .maybeSingle();

  return {
    ...lesson,
    video_url: lesson.unlocked ? data?.video_url || "" : "",
    content_markdown: lesson.unlocked ? data?.content_markdown || data?.description || "" : "",
    description: lesson.unlocked ? data?.description || data?.content_markdown || "" : "",
  };
}
