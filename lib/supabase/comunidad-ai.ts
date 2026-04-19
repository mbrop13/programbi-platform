"use server";

import { createClient, createAdminClient } from "./server";
import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "./comunidad";

// ─── AI CONVERSATIONS ───

export async function getAIConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("id, title, created_at, updated_at")
    .eq("profile_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) { console.error("Error fetching AI conversations:", error); return []; }
  return data || [];
}

export async function getAIMessages(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: conv } = await supabase
    .from("ai_conversations").select("id").eq("id", conversationId).eq("profile_id", user.id).single();
  if (!conv) return [];

  const { data, error } = await supabase
    .from("ai_messages").select("id, role, content, created_at")
    .eq("conversation_id", conversationId).order("created_at", { ascending: true });

  if (error) { console.error("Error fetching AI messages:", error); return []; }
  return data || [];
}

export async function createAIConversation(title: string = "Nueva Conversación") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { data, error } = await supabase
    .from("ai_conversations").insert({ profile_id: user.id, title }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

// ─── ADMIN: LEADS / CONTACTS ───

export async function adminGetLeads() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("course_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error fetching leads:", error); return []; }
  return data || [];
}

export async function deleteAIConversation(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { error } = await supabase
    .from("ai_conversations").delete().eq("id", conversationId).eq("profile_id", user.id);
  if (error) throw new Error(error.message);
}

export async function updateAIConversationTitle(conversationId: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  await supabase
    .from("ai_conversations").update({ title: title.substring(0, 80) })
    .eq("id", conversationId).eq("profile_id", user.id);
}

// ─── ADMIN: COURSE MANAGEMENT ───

export async function adminGetCourses() {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, category, level, is_published, is_featured, image_url, accent_color, badge_label, duration_hours, tech_stack, created_at, lessons(id)")
    .order("sort_order", { ascending: true });

  if (error) { console.error("Error:", error); return []; }
  return (data || []).map((c: any) => ({ ...c, lesson_count: c.lessons?.length || 0, lessons: undefined }));
}

export async function adminCreateCourse(courseData: {
  title: string; slug: string; description: string; category: string;
  level?: string; image_url?: string; short_description?: string;
}) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await supabase
    .from("courses").insert({ ...courseData, is_published: false }).select("id, slug").single();
  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
  return data;
}

export async function adminAddLesson(lessonData: {
  course_id: string; title: string; module_name: string;
  module_order: number; lesson_order: number; video_url: string;
  duration_minutes?: number; is_free_preview?: boolean;
  superclass_language?: string | null;
}) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await supabase
    .from("lessons").insert({
      course_id: lessonData.course_id,
      title: lessonData.title,
      module_name: lessonData.module_name,
      module_order: lessonData.module_order,
      lesson_order: lessonData.lesson_order,
      video_url: lessonData.video_url,
      duration_minutes: lessonData.duration_minutes || 0,
      content_type: "video",
      is_free_preview: lessonData.is_free_preview || false,
      superclass_language: lessonData.superclass_language || null,
    }).select("id").single();

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
  return data;
}

export async function adminGetLessons(courseId: string) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, module_name, module_order, lesson_order, video_url, duration_minutes, is_free_preview, superclass_language")
    .eq("course_id", courseId)
    .order("module_order", { ascending: true })
    .order("lesson_order", { ascending: true });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminTogglePublish(courseId: string) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: course } = await supabase.from("courses").select("is_published").eq("id", courseId).single();
  if (!course) throw new Error("Curso no encontrado");

  await supabase.from("courses").update({ is_published: !course.is_published }).eq("id", courseId);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminToggleHidden(courseId: string) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: course } = await supabase.from("courses").select("is_hidden").eq("id", courseId).single();
  if (!course) throw new Error("Curso no encontrado");

  await supabase.from("courses").update({ is_hidden: !course.is_hidden }).eq("id", courseId);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminDeleteLesson(lessonId: string) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  await supabase.from("lessons").delete().eq("id", lessonId);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminToggleFreePreview(lessonId: string) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: lesson } = await supabase.from("lessons").select("is_free_preview").eq("id", lessonId).single();
  if (!lesson) throw new Error("Lección no encontrada");

  await supabase.from("lessons").update({ is_free_preview: !lesson.is_free_preview }).eq("id", lessonId);
  revalidatePath("/(comunidad)", "layout");
}

// ─── ADMIN: ENROLLMENT MANAGEMENT ───

export async function adminGetAllUsers() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: profiles, error } = await adminDb
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, created_at")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }

  // Auto-backfill missing emails from auth.users (common after Firebase -> Supabase migration)
  const profilesMissingEmail = (profiles || []).filter(p => !p.email);
  if (profilesMissingEmail.length > 0) {
    try {
      const { data: authData } = await adminDb.auth.admin.listUsers({ perPage: 1000 });
      if (authData && authData.users) {
        const authMap = Object.fromEntries(authData.users.map(u => [u.id, u.email]));
        for (const p of (profiles || [])) {
          if (!p.email && authMap[p.id]) {
             p.email = authMap[p.id]; // Set locally for immediate display
             // Backfill in the database silently
             adminDb.from("profiles").update({ email: authMap[p.id] }).eq("id", p.id).then();
          }
        }
      }
    } catch (err) {
      console.error("Failed to backfill missing emails:", err);
    }
  }

  return profiles || [];
}

export async function adminGetUserEnrollments(userId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("enrollments")
    .select("id, course_slug, status, access_type, enrolled_at")
    .eq("user_id", userId);

  if (error) { console.error("Error:", error); return []; }
  
  // Enrich with course title
  if (data && data.length > 0) {
    const slugs = data.map((e: any) => e.course_slug);
    const { data: courses } = await adminDb.from("courses").select("slug, title").in("slug", slugs);
    const courseMap = Object.fromEntries((courses || []).map((c: any) => [c.slug, c.title]));
    return data.map((e: any) => ({ ...e, course: { title: courseMap[e.course_slug] || e.course_slug } }));
  }
  return data || [];
}

export async function adminEnrollUser(userId: string, courseSlug: string, accessType: string = "full") {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("enrollments").upsert({
    user_id: userId, course_slug: courseSlug, status: "active", access_type: accessType,
  }, { onConflict: "user_id,course_slug" });

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminRemoveEnrollment(userId: string, courseSlug: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("enrollments").delete()
    .eq("user_id", userId).eq("course_slug", courseSlug);
  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminUpdateUserRole(userId: string, role: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminGetExportData() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // Fetch all users with profile data
  const { data: users, error: usersErr } = await adminDb
    .from("profiles")
    .select("id, full_name, email, role, subscription_plan, created_at")
    .order("created_at", { ascending: false });

  if (usersErr) throw new Error(usersErr.message);

  // Fetch all enrollments
  const { data: enrollments, error: enrollErr } = await adminDb
    .from("enrollments")
    .select("user_id, course_slug, access_type, status");

  if (enrollErr) throw new Error(enrollErr.message);

  // Join them
  const result = (users || []).map((u: any) => {
    const userEnrollments = (enrollments || []).filter((e: any) => e.user_id === u.id);
    return {
      ...u,
      enrollments: userEnrollments
    };
  });

  return result;
}

// ─── ADMIN: CSV BULK IMPORT ───

export async function adminBulkImport(rows: { email: string; curso_slug: string; access_type: string }[]) {
  const supabase = await createClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      // Find user by email
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("email", row.email).single();

      if (!profile) {
        errors.push(`${row.email}: usuario no encontrado`);
        failed++;
        continue;
      }

      // Find course by slug
      const { data: course } = await supabase
        .from("courses").select("id").eq("slug", row.curso_slug).single();

      if (!course) {
        errors.push(`${row.curso_slug}: curso no encontrado`);
        failed++;
        continue;
      }

      // Create enrollment
      const { error } = await supabase.from("enrollments").upsert({
        user_id: profile.id,
        course_slug: row.curso_slug,
        status: "active",
        access_type: row.access_type || "full",
      }, { onConflict: "user_id,course_slug" });

      if (error) {
        errors.push(`${row.email}/${row.curso_slug}: ${error.message}`);
        failed++;
      } else {
        success++;
      }
    } catch (err: any) {
      errors.push(`${row.email}: ${err.message}`);
      failed++;
    }
  }

  revalidatePath("/(comunidad)", "layout");
  return { success, failed, errors };
}

// ─── STUDENT: COURSES ───

export async function getAllPublishedCourses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp")
    .eq("is_published", true)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function getMyEnrollments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { enrollments: [], programSiblings: [] };

  const { data, error } = await supabase
    .from("enrollments")
    .select("course_slug, status, access_type, enrolled_at")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) { console.error("Error:", error); return { enrollments: [], programSiblings: [] }; }
  if (!data || data.length === 0) return { enrollments: [], programSiblings: [] };

  const slugs = data.map((e: any) => e.course_slug);

  // Get full course data for enrolled courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp")
    .in("slug", slugs);

  // Count lessons per course
  const { data: lessonCounts } = await supabase
    .from("lessons")
    .select("course_id, created_at")
    .in("course_id", (courses || []).map(c => c.id));

  // Build lesson stats per course id
  const lessonStats: Record<string, { count: number; latest: string | null }> = {};
  (lessonCounts || []).forEach((l: any) => {
    if (!lessonStats[l.course_id]) lessonStats[l.course_id] = { count: 0, latest: null };
    lessonStats[l.course_id].count++;
    if (!lessonStats[l.course_id].latest || l.created_at > lessonStats[l.course_id].latest!) {
      lessonStats[l.course_id].latest = l.created_at;
    }
  });

  const enrichedEnrollments = data.map((e: any) => {
    const c = courses?.find(c => c.slug === e.course_slug);
    const stats = c ? lessonStats[c.id] : null;
    return {
      ...e,
      course: c ? { ...c, lesson_count: stats?.count || 0, latest_lesson_at: stats?.latest || null } : null
    };
  });

  // Discover program siblings: for each unique category among enrolled courses,
  // fetch ALL courses in that category (including unenrolled ones) so frontend
  // can render "Próximamente" cards for sub-courses not yet activated.
  const enrolledCategories = [...new Set(
    (courses || []).map(c => c.category).filter(Boolean)
  )];

  let programSiblings: any[] = [];
  if (enrolledCategories.length > 0) {
    const { data: siblings } = await supabase
      .from("courses")
      .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp")
      .in("category", enrolledCategories)
      .eq("is_published", true);

    // Enrich siblings with lesson counts too
    const siblingIds = (siblings || []).map(s => s.id);
    const { data: sibLessonCounts } = await supabase
      .from("lessons")
      .select("course_id, created_at")
      .in("course_id", siblingIds);

    const sibStats: Record<string, { count: number; latest: string | null }> = {};
    (sibLessonCounts || []).forEach((l: any) => {
      if (!sibStats[l.course_id]) sibStats[l.course_id] = { count: 0, latest: null };
      sibStats[l.course_id].count++;
      if (!sibStats[l.course_id].latest || l.created_at > sibStats[l.course_id].latest!) {
        sibStats[l.course_id].latest = l.created_at;
      }
    });

    programSiblings = (siblings || []).map(s => ({
      ...s,
      lesson_count: sibStats[s.id]?.count || 0,
      latest_lesson_at: sibStats[s.id]?.latest || null,
    }));
  }

  return { enrollments: enrichedEnrollments, programSiblings };
}

export async function getCourseLessons(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { lessons: [], access: null };

  const { data: profile } = await supabase.from("profiles").select("is_on_trial, subscription_plan").eq("id", user.id).single();
  const isOnTrial = profile?.is_on_trial === true;

  // Check enrollment - need to get slug from courseId first
  const { data: courseData } = await supabase.from("courses").select("slug").eq("id", courseId).single();
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("access_type")
    .eq("user_id", user.id)
    .eq("course_slug", courseData?.slug || '')
    .eq("status", "active")
    .single();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, module_name, module_order, lesson_order, video_url, duration_minutes, is_free_preview, superclass_language")
    .eq("course_id", courseId)
    .order("module_order", { ascending: true })
    .order("lesson_order", { ascending: true });

  let finalAccess = enrollment?.access_type || null;
  if (!finalAccess && profile?.subscription_plan) finalAccess = "full"; // Subscriptions grant full access
  if (isOnTrial) finalAccess = "trial";

  return {
    lessons: lessons || [],
    access: finalAccess,
    isOnTrial,
  };
}

// ─── ADMIN: DASHBOARD STATS ───

export async function adminGetDashboardStats() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  // Total revenue (all time paid payments)
  const { data: allPayments } = await adminDb
    .from("payments")
    .select("amount, paid_at, course_id")
    .eq("status", "paid");

  // Revenue this month
  const thisMonthPayments = (allPayments || []).filter(p => p.paid_at && p.paid_at >= startOfMonth);
  const lastMonthPayments = (allPayments || []).filter(p => p.paid_at && p.paid_at >= startOfLastMonth && p.paid_at <= endOfLastMonth);

  const revenueThisMonth = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const revenueLastMonth = lastMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const revenueChange = revenueLastMonth > 0 
    ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
    : revenueThisMonth > 0 ? "+100" : "0";

  // Total users
  const { count: totalUsers } = await adminDb
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // Active enrollments
  const { count: totalEnrollments } = await adminDb
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Sales this month
  const salesThisMonth = thisMonthPayments.length;
  const salesLastMonth = lastMonthPayments.length;
  const salesChange = salesLastMonth > 0 
    ? (((salesThisMonth - salesLastMonth) / salesLastMonth) * 100).toFixed(1) 
    : salesThisMonth > 0 ? "+100" : "0";

  // Best selling course
  const courseCount: Record<string, number> = {};
  (allPayments || []).forEach(p => {
    if (p.course_id) courseCount[p.course_id] = (courseCount[p.course_id] || 0) + 1;
  });
  const bestCourseId = Object.entries(courseCount).sort(([,a], [,b]) => b - a)[0]?.[0];
  let bestCourseName = "—";
  if (bestCourseId) {
    const { data: course } = await adminDb.from("courses").select("title").eq("id", bestCourseId).single();
    bestCourseName = course?.title || "—";
  }

  // Recent transactions
  const { data: recentPayments } = await adminDb
    .from("payments")
    .select("id, amount, status, payer_email, paid_at, created_at, course:courses(title)")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    revenue: {
      total: (allPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0),
      thisMonth: revenueThisMonth,
      change: revenueChange,
    },
    users: {
      total: totalUsers || 0,
    },
    enrollments: {
      total: totalEnrollments || 0,
    },
    sales: {
      thisMonth: salesThisMonth,
      change: salesChange,
    },
    bestCourse: bestCourseName,
    recentPayments: recentPayments || [],
  };
}

// ─── COURSE SCHEDULES ───

export async function getActiveSchedules() {
  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("course_schedules")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: true });

  if (error) { console.error("Error fetching schedules:", error); return []; }
  return data || [];
}

export async function adminGetSchedules() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("course_schedules")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) { console.error("Error fetching schedules:", error); return []; }
  return data || [];
}

export async function adminAddSchedule(schedule: {
  course_slug: string;
  level_name: string;
  start_date: string;
  schedule_days: string;
  schedule_time: string;
  duration_hours: number;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("course_schedules").insert(schedule);
  if (error) throw new Error(error.message);
}

export async function adminDeleteSchedule(scheduleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("course_schedules").delete().eq("id", scheduleId);
  if (error) throw new Error(error.message);
}

export async function adminToggleScheduleActive(scheduleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("course_schedules").select("is_active").eq("id", scheduleId).single();
  if (!current) throw new Error("Horario no encontrado");

  const { error } = await adminDb.from("course_schedules").update({ is_active: !current.is_active }).eq("id", scheduleId);
  if (error) throw new Error(error.message);
}

// ─── PROMO POPUPS ───

export async function getActivePopups() {
  const adminDb = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await adminDb
    .from("promo_popups")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("created_at", { ascending: false });

  if (error) { console.error("Error fetching popups:", error); return []; }
  return data || [];
}

export async function adminGetPopups() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("promo_popups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminCreatePopup(popup: {
  title: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  badge_text?: string | null;
  popup_type?: string;
  accent_color?: string;
  image_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  show_to?: string;
  display_delay_seconds?: number;
  dismissible?: boolean;
  show_once_per_session?: boolean;
  custom_html?: string | null;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("promo_popups")
    .insert(popup)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdatePopup(popupId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb
    .from("promo_popups")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", popupId);

  if (error) throw new Error(error.message);
}

export async function adminTogglePopup(popupId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("promo_popups").select("is_active").eq("id", popupId).single();
  if (!current) throw new Error("Popup no encontrado");

  const { error } = await adminDb.from("promo_popups").update({
    is_active: !current.is_active,
    updated_at: new Date().toISOString()
  }).eq("id", popupId);
  if (error) throw new Error(error.message);
}

export async function adminDeletePopup(popupId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("promo_popups").delete().eq("id", popupId);
  if (error) throw new Error(error.message);
}

// ─── PROMOTIONS ───

export async function adminGetPromotions() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminCreatePromotion(promo: {
  name: string;
  target_type: string;
  target_id?: string;
  discount_percentage: number;
  is_active: boolean;
  valid_until?: string | null;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // target_id must be null if empty string
  const cleanPromo = { ...promo, target_id: promo.target_id || null };

  const { data, error } = await adminDb
    .from("promotions")
    .insert(cleanPromo)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdatePromotion(promoId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb
    .from("promotions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", promoId);

  if (error) throw new Error(error.message);
}

export async function adminTogglePromotion(promoId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("promotions").select("is_active").eq("id", promoId).single();
  if (!current) throw new Error("Promoción no encontrada");

  const { error } = await adminDb.from("promotions").update({
    is_active: !current.is_active,
    updated_at: new Date().toISOString()
  }).eq("id", promoId);
  if (error) throw new Error(error.message);
}

export async function adminDeletePromotion(promoId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("promotions").delete().eq("id", promoId);
  if (error) throw new Error(error.message);
}

export async function getActivePromotions() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetches promotions that are active
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true);
    
  if (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
  
  return (data || []).filter((p: any) => !p.valid_until || p.valid_until > now);
}

// ─── PRICE OVERRIDES ───

export async function adminGetPriceOverrides() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("price_overrides")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminUpsertPriceOverride(override: {
  item_type: string;
  item_id: string;
  level_name: string;
  price: number;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // Check if exists
  const { data: existing } = await adminDb
    .from("price_overrides")
    .select("id")
    .eq("item_type", override.item_type)
    .eq("item_id", override.item_id)
    .eq("level_name", override.level_name)
    .maybeSingle();

  if (existing) {
    const { error } = await adminDb
      .from("price_overrides")
      .update({ price: override.price, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await adminDb
      .from("price_overrides")
      .insert(override);
    if (error) throw new Error(error.message);
  }
}

export async function getPriceOverrides() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("price_overrides")
    .select("*");

  if (error) {
    console.error("Error fetching price overrides:", error);
    return [];
  }

  return data || [];
}

// ─── NEWSLETTER ARTICLES ───

export async function getPublishedArticles(category?: string) {
  const adminDb = createAdminClient();

  let query = adminDb
    .from("newsletter_articles")
    .select("id, title, slug, excerpt, cover_image, category, tags, author_name, author_avatar, is_featured, reading_time_min, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) { console.error("Error fetching articles:", error); return []; }
  return data || [];
}

export async function getArticleBySlug(slug: string) {
  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("newsletter_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) { console.error("Error fetching article:", error); return null; }
  return data;
}

export async function adminGetArticles() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("newsletter_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminCreateArticle(article: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  author_avatar?: string;
  reading_time_min?: number;
  status?: string;
  is_featured?: boolean;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const insertData: any = { ...article };
  if (article.status === "published") {
    insertData.published_at = new Date().toISOString();
  }

  const { data, error } = await adminDb
    .from("newsletter_articles")
    .insert(insertData)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateArticle(articleId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const updateData: any = { ...updates, updated_at: new Date().toISOString() };
  if (updates.status === "published" && !updates.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await adminDb
    .from("newsletter_articles")
    .update(updateData)
    .eq("id", articleId);

  if (error) throw new Error(error.message);
}

export async function adminDeleteArticle(articleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("newsletter_articles").delete().eq("id", articleId);
  if (error) throw new Error(error.message);
}

export async function adminToggleArticlePublish(articleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("newsletter_articles").select("status").eq("id", articleId).single();
  if (!current) throw new Error("Artículo no encontrado");

  const newStatus = current.status === "published" ? "draft" : "published";
  const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
  if (newStatus === "published") updates.published_at = new Date().toISOString();

  const { error } = await adminDb.from("newsletter_articles").update(updates).eq("id", articleId);
  if (error) throw new Error(error.message);
}

export async function adminToggleArticleFeatured(articleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("newsletter_articles").select("is_featured").eq("id", articleId).single();
  if (!current) throw new Error("Artículo no encontrado");

  const { error } = await adminDb.from("newsletter_articles").update({
    is_featured: !current.is_featured,
    updated_at: new Date().toISOString(),
  }).eq("id", articleId);
  if (error) throw new Error(error.message);
}

// ─── NEWSLETTER CATEGORIES ───

export async function getNewsletterCategories() {
  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("newsletter_categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) { console.error("Error fetching newsletter categories:", error); return []; }

  // Fetch subcategories
  const parentIds = (data || []).map(c => c.id);
  if (parentIds.length > 0) {
    const { data: subs } = await adminDb
      .from("newsletter_categories")
      .select("*")
      .eq("is_active", true)
      .in("parent_id", parentIds)
      .order("sort_order", { ascending: true });

    return (data || []).map(cat => ({
      ...cat,
      subcategories: (subs || []).filter(s => s.parent_id === cat.id),
    }));
  }

  return (data || []).map(cat => ({ ...cat, subcategories: [] }));
}

export async function adminGetNewsletterCategories() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("newsletter_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminCreateNewsletterCategory(category: {
  name: string;
  slug: string;
  emoji?: string;
  sort_order?: number;
  parent_id?: string | null;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("newsletter_categories")
    .insert(category)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateNewsletterCategory(categoryId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb
    .from("newsletter_categories")
    .update(updates)
    .eq("id", categoryId);

  if (error) throw new Error(error.message);
}

export async function adminDeleteNewsletterCategory(categoryId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("newsletter_categories").delete().eq("id", categoryId);
  if (error) throw new Error(error.message);
}

export async function adminToggleNewsletterCategory(categoryId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("newsletter_categories").select("is_active").eq("id", categoryId).single();
  if (!current) throw new Error("Categoría no encontrada");

  const { error } = await adminDb.from("newsletter_categories").update({ is_active: !current.is_active }).eq("id", categoryId);
  if (error) throw new Error(error.message);
}

// ─── NEWSLETTER SUBSCRIPTIONS ───

export async function getNewsletterSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminDb = createAdminClient();
  const { data } = await adminDb
    .from("newsletter_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function subscribeToNewsletter(params: {
  categories: string[];
  frequency: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const adminDb = createAdminClient();

  // Check if already subscribed
  const { data: existing } = await adminDb
    .from("newsletter_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Update
    const { error } = await adminDb
      .from("newsletter_subscriptions")
      .update({
        categories: params.categories,
        frequency: params.frequency,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    // Insert
    const { error } = await adminDb
      .from("newsletter_subscriptions")
      .insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        categories: params.categories,
        frequency: params.frequency,
      });
    if (error) throw new Error(error.message);
  }
}

export async function unsubscribeFromNewsletter() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const adminDb = createAdminClient();
  const { error } = await adminDb
    .from("newsletter_subscriptions")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
}
