"use server";

import { createClient, createAdminClient } from "./server";

export interface LiveAttendanceRecord {
  id: string;
  class_id: string;
  user_id: string;
  joined_at: string;
  last_heartbeat_at: string;
  duration_seconds: number;
  profile?: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

export interface LiveClassTrackingSummary {
  id: string;
  title: string;
  scheduled_at: string;
  status: "scheduled" | "active" | "completed";
  attendees_count: number;
  total_duration_minutes: number;
}

export interface LessonTrackingSummary {
  lesson_id: string;
  lesson_title: string;
  course_id: string;
  course_title: string;
  views_count: number;
  completed_count: number;
  avg_watch_minutes: number;
}

export interface StudentActivityItem {
  id: string;
  type: "live_attendance" | "lesson_view";
  title: string;
  subtitle?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string | null;
  duration_minutes: number;
  timestamp: string;
  completed?: boolean;
}

/**
 * Record or update a student's attendance in a live class.
 * Called automatically every 30s while student stays on active stream.
 */
export async function recordLiveClassAttendance(classId: string, incrementSeconds: number = 30) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthenticated" };

    const adminDb = createAdminClient();

    // Check if record exists
    const { data: existing } = await adminDb
      .from("live_class_attendance")
      .select("id, duration_seconds")
      .eq("class_id", classId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const newDuration = (existing.duration_seconds || 0) + incrementSeconds;
      await adminDb
        .from("live_class_attendance")
        .update({
          duration_seconds: newDuration,
          last_heartbeat_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await adminDb.from("live_class_attendance").insert({
        class_id: classId,
        user_id: user.id,
        duration_seconds: Math.max(incrementSeconds, 30),
        joined_at: new Date().toISOString(),
        last_heartbeat_at: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in recordLiveClassAttendance:", error);
    return { success: false, error: error?.message };
  }
}

/**
 * Record or update a student's video lesson view log.
 */
export async function recordLessonView(
  lessonId: string,
  courseId: string,
  incrementWatchSeconds: number = 10,
  lastPositionSeconds: number = 0,
  isCompleted: boolean = false
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthenticated" };

    const adminDb = createAdminClient();

    const { data: existing } = await adminDb
      .from("lesson_view_logs")
      .select("id, watch_duration_seconds, completed")
      .eq("lesson_id", lessonId)
      .eq("user_id", user.id)
      .maybeSingle();

    const shouldMarkComplete = existing?.completed || isCompleted;

    if (existing) {
      const newWatchDuration = (existing.watch_duration_seconds || 0) + incrementWatchSeconds;
      await adminDb
        .from("lesson_view_logs")
        .update({
          watch_duration_seconds: newWatchDuration,
          last_position_seconds: lastPositionSeconds,
          completed: shouldMarkComplete,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await adminDb.from("lesson_view_logs").insert({
        lesson_id: lessonId,
        course_id: courseId,
        user_id: user.id,
        watch_duration_seconds: incrementWatchSeconds,
        last_position_seconds: lastPositionSeconds,
        completed: shouldMarkComplete,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Sync into user_progress table for overall course completion metrics
    await adminDb.from("user_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      completed: shouldMarkComplete,
      last_position_seconds: lastPositionSeconds,
      updated_at: new Date().toISOString(),
      ...(shouldMarkComplete ? { completed_at: new Date().toISOString() } : {}),
    }, { onConflict: "user_id,lesson_id" });

    return { success: true };
  } catch (error: any) {
    console.error("Error in recordLessonView:", error);
    return { success: false, error: error?.message };
  }
}

/**
 * Fetch detailed attendee list for a specific Live Class (Admin only).
 */
export async function adminGetLiveClassAttendees(classId: string) {
  try {
    const adminDb = createAdminClient();

    const { data: attendance, error } = await adminDb
      .from("live_class_attendance")
      .select(`
        id,
        class_id,
        user_id,
        joined_at,
        last_heartbeat_at,
        duration_seconds,
        profile:profiles(id, full_name, email, avatar_url)
      `)
      .eq("class_id", classId)
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("Error fetching live attendance:", error);
      return [];
    }

    return (attendance || []).map((item: any) => ({
      id: item.id,
      class_id: item.class_id,
      user_id: item.user_id,
      joined_at: item.joined_at,
      last_heartbeat_at: item.last_heartbeat_at,
      duration_seconds: item.duration_seconds || 0,
      profile: Array.isArray(item.profile) ? item.profile[0] : item.profile,
    }));
  } catch (err) {
    console.error("Error in adminGetLiveClassAttendees:", err);
    return [];
  }
}

/**
 * Fetch high-level analytics & tracking metrics for the Admin Dashboard.
 */
export async function adminGetTrackingStats() {
  try {
    const adminDb = createAdminClient();

    const [
      liveClassesRes,
      liveAttendanceRes,
      lessonLogsRes,
      coursesRes,
      lessonsRes,
      profilesRes
    ] = await Promise.all([
      adminDb.from("live_classes").select("id, title, scheduled_at, status").order("scheduled_at", { ascending: false }),
      adminDb.from("live_class_attendance").select("id, class_id, user_id, joined_at, duration_seconds, profiles(id, full_name, email, avatar_url)"),
      adminDb.from("lesson_view_logs").select("id, lesson_id, course_id, user_id, watch_duration_seconds, completed, updated_at, profiles(id, full_name, email, avatar_url)"),
      adminDb.from("courses").select("id, title"),
      adminDb.from("lessons").select("id, title, course_id"),
      adminDb.from("profiles").select("id, full_name, email, avatar_url")
    ]);

    const liveClasses = liveClassesRes.data || [];
    const liveAttendance = liveAttendanceRes.data || [];
    const lessonLogs = lessonLogsRes.data || [];
    const courses = coursesRes.data || [];
    const lessons = lessonsRes.data || [];
    const profiles = profilesRes.data || [];

    const courseMap = new Map<string, string>(courses.map(c => [c.id, c.title]));
    const lessonMap = new Map<string, { title: string; courseId: string }>(lessons.map(l => [l.id, { title: l.title, courseId: l.course_id }]));
    const profileMap = new Map<string, any>(profiles.map(p => [p.id, p]));

    // Summary KPIs
    const totalLiveAttendees = new Set(liveAttendance.map((a: any) => a.user_id)).size;
    const totalLiveMinutes = Math.round(liveAttendance.reduce((acc: number, a: any) => acc + (a.duration_seconds || 0), 0) / 60);
    const totalLessonViews = lessonLogs.length;
    const totalLessonWatchMinutes = Math.round(lessonLogs.reduce((acc: number, l: any) => acc + (l.watch_duration_seconds || 0), 0) / 60);

    // Live Classes Breakdown
    const liveSummaries: LiveClassTrackingSummary[] = liveClasses.map((lc) => {
      const classAttendance = liveAttendance.filter((a: any) => a.class_id === lc.id);
      const totalSecs = classAttendance.reduce((acc: number, a: any) => acc + (a.duration_seconds || 0), 0);
      return {
        id: lc.id,
        title: lc.title,
        scheduled_at: lc.scheduled_at,
        status: lc.status,
        attendees_count: classAttendance.length,
        total_duration_minutes: Math.round(totalSecs / 60),
      };
    });

    // Lesson View Breakdown
    const lessonSummaryMap = new Map<string, { lesson_id: string; course_id: string; views: number; completed: number; totalSecs: number }>();

    lessonLogs.forEach((log: any) => {
      const existing = lessonSummaryMap.get(log.lesson_id) || {
        lesson_id: log.lesson_id,
        course_id: log.course_id,
        views: 0,
        completed: 0,
        totalSecs: 0,
      };
      existing.views += 1;
      if (log.completed) existing.completed += 1;
      existing.totalSecs += log.watch_duration_seconds || 0;
      lessonSummaryMap.set(log.lesson_id, existing);
    });

    const lessonSummaries: LessonTrackingSummary[] = Array.from(lessonSummaryMap.values()).map((ls) => {
      const lessonInfo = lessonMap.get(ls.lesson_id);
      return {
        lesson_id: ls.lesson_id,
        lesson_title: lessonInfo?.title || "Lección",
        course_id: ls.course_id,
        course_title: courseMap.get(ls.course_id) || "Curso",
        views_count: ls.views,
        completed_count: ls.completed,
        avg_watch_minutes: Math.round((ls.totalSecs / (ls.views || 1)) / 60),
      };
    }).sort((a, b) => b.views_count - a.views_count);

    // Activity Feed Timeline
    const activityTimeline: StudentActivityItem[] = [];

    liveAttendance.forEach((la: any) => {
      const liveClass = liveClasses.find(c => c.id === la.class_id);
      const prof = profileMap.get(la.user_id) || (Array.isArray(la.profiles) ? la.profiles[0] : la.profiles);
      if (liveClass && prof) {
        activityTimeline.push({
          id: la.id,
          type: "live_attendance",
          title: `Asistió a Clase en Vivo: "${liveClass.title}"`,
          user_id: la.user_id,
          user_name: prof.full_name || prof.email.split("@")[0],
          user_email: prof.email,
          user_avatar: prof.avatar_url,
          duration_minutes: Math.max(1, Math.round((la.duration_seconds || 0) / 60)),
          timestamp: la.joined_at,
        });
      }
    });

    lessonLogs.forEach((ll: any) => {
      const lessonInfo = lessonMap.get(ll.lesson_id);
      const prof = profileMap.get(ll.user_id) || (Array.isArray(ll.profiles) ? ll.profiles[0] : ll.profiles);
      if (lessonInfo && prof) {
        activityTimeline.push({
          id: ll.id,
          type: "lesson_view",
          title: `Vio lección: "${lessonInfo.title}"`,
          subtitle: courseMap.get(ll.course_id) || undefined,
          user_id: ll.user_id,
          user_name: prof.full_name || prof.email.split("@")[0],
          user_email: prof.email,
          user_avatar: prof.avatar_url,
          duration_minutes: Math.max(1, Math.round((ll.watch_duration_seconds || 0) / 60)),
          timestamp: ll.updated_at || ll.created_at,
          completed: ll.completed,
        });
      }
    });

    activityTimeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      kpis: {
        totalLiveAttendees,
        totalLiveMinutes,
        totalLessonViews,
        totalLessonWatchMinutes,
      },
      liveSummaries,
      lessonSummaries,
      activityTimeline: activityTimeline.slice(0, 100), // top 100 most recent activities
    };
  } catch (error: any) {
    console.error("Error in adminGetTrackingStats:", error);
    return {
      kpis: { totalLiveAttendees: 0, totalLiveMinutes: 0, totalLessonViews: 0, totalLessonWatchMinutes: 0 },
      liveSummaries: [],
      lessonSummaries: [],
      activityTimeline: [],
    };
  }
}
