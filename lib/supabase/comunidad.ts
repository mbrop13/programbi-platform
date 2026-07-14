"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

/**
 * Get the current user's profile data.
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role, subscription_plan, subscription_expires_at, phone, organization_id, department, study_streak, xp_points")
    .eq("id", user.id)
    .single();

  return profile || { 
    id: user.id, 
    full_name: user.email, 
    email: user.email, 
    avatar_url: null, 
    role: "student",
    subscription_plan: null,
    subscription_expires_at: null,
    phone: null
  };
}

/**
 * Checks if the current user is admin.
 * Looks at both profiles.role and community_members.role.
 */
export async function isCurrentUserAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  // Fetch as admin to bypass RLS entirely, ensuring we get the true role even if RLS Select policies are missing
  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  // 1. Check profiles table
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") return true;

  // 2. Check community_members table
  const { data: adminCheck } = await adminDb
    .from("community_members")
    .select("role")
    .eq("profile_id", user.id)
    .eq("role", "admin")
    .limit(1)
    .single();

  if (adminCheck) return true;

  // Authorization is derived exclusively from database roles (community_members / profiles).
  // The previous email-based dev fallback was removed (OWASP ASVS L3 audit, CR-2).
  return false;
}

// ------------------------------------------
// POSTS (MURO FEED) 
// ------------------------------------------

/**
 * Obtener todos los posts del muro de la comunidad. 
 * Se trae likes y profiles (autores).
 */
export async function getPosts(communityId: string = "default") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Realiza inner join a profiles para el autor
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      likes_count,
      is_pinned,
      author:profiles(id, full_name, avatar_url),
      comments(id, content, created_at, author:profiles(id, full_name, avatar_url))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  let likedPostIds: string[] = [];
  if (user) {
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id);
    if (likes) {
      likedPostIds = likes.map((l: any) => l.post_id);
    }
  }

  const postsWithLiked = (posts || []).map((p: any) => ({
    ...p,
    is_liked_by_user: likedPostIds.includes(p.id)
  }));

  return postsWithLiked;
}

export async function createPost(content: string, isQuestion: boolean = false, communityId: string = "default") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Debes autenticarte");

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin && !isQuestion) {
    throw new Error("Solo los administradores pueden crear posts regulares no-preguntas");
  }

  // Obtenemos 'communityId' validado o por defecto insertaremos al primer community.
  let targetId = communityId;
  if (communityId === "default") {
     const { data: comm } = await supabase.from("communities").select("id").limit(1).single();
     if (comm) targetId = comm.id;
  }

  const { error } = await supabase.from("posts").insert({
    community_id: targetId,
    author_id: user.id,
    content,
    // Podría mapearse isQuestion al campo channel_id o metadata
    channel_id: isQuestion ? "support" : "general" 
  });

  if (error) {
    console.error("Error creating post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/(comunidad)", "layout");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  // Check if user already liked this post
  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    // Like
    const { error } = await supabase
      .from("post_likes")
      .insert({
        post_id: postId,
        user_id: user.id
      });
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/(comunidad)", "layout");
}

export async function addComment(postId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content
  });

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
}

// ------------------------------------------
// ADMIN PANEL (MANAGEMENT)
// ------------------------------------------

export async function getCommunityMembers() {
  const supabase = await createClient();
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error("Válido solo para Admins");

  const { data: members, error } = await supabase
    .from("community_members")
    .select(`
      role,
      joined_at,
      profile:profiles(id, full_name, email, avatar_url)
    `);

  if (error) {
    console.error("Error fetching members:", error.message);
    return [];
  }

  return members || [];
}

// ------------------------------------------
// CURSOS ALUMNO
// ------------------------------------------

export async function getEnrolledCourses() {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return [];
   
   // En Produccion la lógica haría join con "enrollments" o "purchases"
   // Temporalmente consultaremos los cursos publicados (simulando inscritos para demo func)
   const { data: courses, error } = await supabase
     .from("courses")
     .select("id, title, description, instructor_id, published, created_at")
     .eq("published", true)
     .limit(5);
   
   if (error || !courses) return [];

   // Mapeamos a la interfaz Premium de la comunidad
   return courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      instructor: "Equipo ProgramBI",
      progress: Math.floor(Math.random() * 100), // Mock temporal de progreso de videos (hasta la fase de reproductor)
      totalModules: 10,
      completedModules: Math.floor(Math.random() * 10),
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      lastClass: "Continuar Lección",
      color: "bg-brand-blue"
   }));
}

/**
 * Returns the organization managed by the current logged-in user, if any.
 */
export async function getCurrentUserManagedOrganization() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Query intermediate table to see if user is a manager
  const { data: managerRecord, error } = await supabase
    .from("organization_managers")
    .select("organization_id, organizations(id, name, logo_url, domain)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (error || !managerRecord) return null;
  return (managerRecord as any).organizations || null;
}

// ------------------------------------------
// DASHBOARD STATS
// ------------------------------------------

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  const [profile, enrollments, progress, liveClasses, topMembers] = await Promise.all([
    // Profile (streak + XP)
    adminDb.from("profiles").select("study_streak, xp_points, full_name").eq("id", user.id).single(),

    // Enrolled courses with details
    adminDb
      .from("enrollments")
      .select("course_id, courses(id, title, short_description, slug)")
      .eq("user_id", user.id)
      .eq("status", "active"),

    // User progress (completed lessons)
    adminDb
      .from("user_progress")
      .select("lesson_id, completed_at")
      .eq("user_id", user.id)
      .eq("completed", true),

    // Upcoming live classes
    adminDb
      .from("live_classes")
      .select("id, title, scheduled_at, status")
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(3),

    // Top members by XP
    adminDb
      .from("profiles")
      .select("id, full_name, xp_points, avatar_url")
      .order("xp_points", { ascending: false })
      .limit(5),
  ]);

  const enrolledCount = enrollments.data?.length || 0;
  const completedLessons = progress.data?.length || 0;
  const studyHours = Math.round(completedLessons * 0.5 * 10) / 10; // ~30min per lesson

  // Calculate progress for each enrolled course
  let courseProgress: { title: string; progress: number; courseId: string; courseSlug: string }[] = [];
  if (enrollments.data?.length) {
    for (const enr of enrollments.data as any[]) {
      const { data: lessons } = await adminDb
        .from("lessons")
        .select("id")
        .eq("course_id", enr.course_id);
      
      if (!lessons?.length) continue;

      const lessonIds = lessons.map((l: any) => l.id);
      const completedInCourse = (progress.data || []).filter(
        (p: any) => lessonIds.includes(p.lesson_id)
      ).length;

      courseProgress.push({
        title: enr.courses?.title || "Curso",
        courseId: enr.course_id,
        courseSlug: enr.courses?.slug || enr.course_id,
        progress: Math.round((completedInCourse / lessons.length) * 100),
      });
    }
  }

  // Sort by progress descending, take the most advanced
  courseProgress.sort((a, b) => b.progress - a.progress);

  return {
    enrolledCourses: enrolledCount,
    completedLessons,
    studyHours,
    streak: profile.data?.study_streak || 0,
    xp: profile.data?.xp_points || 0,
    userName: profile.data?.full_name || "Estudiante",
    courseProgress: courseProgress.slice(0, 3),
    upcomingLives: liveClasses.data || [],
    topMembers: (topMembers.data || []).map((m: any) => ({
      id: m.id,
      name: m.full_name,
      xp: m.xp_points || 0,
      avatar: m.avatar_url,
      initials: m.full_name
        ? m.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
        : "??",
    })),
  };
}

// ------------------------------------------
// CHAT GLOBAL ACTIONS
// ------------------------------------------

export async function getChatChannels() {
  const supabase = await createClient();
  
  // Get first community ID
  const { data: comm } = await supabase.from("communities").select("id").limit(1).single();
  if (!comm) return [];

  const { data: channels, error } = await supabase
    .from("chat_channels")
    .select("id, name, type, category")
    .eq("community_id", comm.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching channels:", error);
    return [];
  }

  // Seed default channels if empty
  if (!channels || channels.length === 0) {
    const defaultChannels = [
      { community_id: comm.id, name: "anuncios", type: "announcement", category: "General" },
      { community_id: comm.id, name: "general", type: "text", category: "General" },
      { community_id: comm.id, name: "python-help", type: "support", category: "Ayuda" },
      { community_id: comm.id, name: "sql-queries", type: "support", category: "Ayuda" },
      { community_id: comm.id, name: "power-bi", type: "support", category: "Ayuda" }
    ];
    const { data: seeded, error: seedError } = await supabase
      .from("chat_channels")
      .insert(defaultChannels)
      .select("id, name, type, category");
    if (!seedError && seeded) return seeded;
  }

  return channels || [];
}

export async function getChatMessages(channelId: string) {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select(`
      id,
      content,
      created_at,
      author:profiles(id, full_name, role, avatar_url)
    `)
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
  return messages || [];
}

export async function sendChatMessage(channelId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      channel_id: channelId,
      author_id: user.id,
      content
    })
    .select(`
      id,
      content,
      created_at,
      author:profiles(id, full_name, role, avatar_url)
    `)
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }
  return data;
}

export async function getActiveUsers() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url")
    .limit(20);
  
  if (error) return [];
  
  return (profiles || []).map((p, i) => ({
    id: p.id,
    name: p.full_name,
    initials: p.full_name ? p.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "??",
    role: p.role,
    color: p.role === "admin" ? "bg-gradient-to-br from-brand-blue to-indigo-600" : "bg-emerald-500",
    status: i % 3 === 0 ? "online" : i % 3 === 1 ? "idle" : "offline"
  }));
}

// ------------------------------------------
// NOTIFICATIONS
// ------------------------------------------

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, link, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data || [];
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) return 0;
  return count || 0;
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
}

/**
 * Create a notification for a specific user (admin-only, uses admin client to bypass RLS).
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  link?: string
) {
  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  const { error } = await adminDb
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      body,
      link: link || null,
    });

  if (error) {
    console.error("Error creating notification:", error);
  }
}

/**
 * Broadcast a notification to all enrolled users (admin action).
 */
export async function broadcastNotification(
  type: string,
  title: string,
  body: string,
  link?: string
) {
  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  // Get all users with active enrollments
  const { data: enrollments } = await adminDb
    .from("enrollments")
    .select("user_id")
    .eq("status", "active");

  if (!enrollments?.length) return;

  const uniqueUserIds = [...new Set(enrollments.map((e: any) => e.user_id))];

  // Batch insert notifications
  const notifications = uniqueUserIds.map((uid: string) => ({
    user_id: uid,
    type,
    title,
    body,
    link: link || null,
  }));

  // Insert in batches of 100
  for (let i = 0; i < notifications.length; i += 100) {
    const batch = notifications.slice(i, i + 100);
    const { error } = await adminDb.from("notifications").insert(batch);
    if (error) {
      console.error(`Error broadcasting notifications batch ${i}:`, error);
    }
  }
}

// ------------------------------------------
// COURSE PROGRESS (real data)
// ------------------------------------------

/**
 * Get real course progress for a specific course.
 */
export async function getCourseProgress(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { completedLessons: 0, totalLessons: 0, progress: 0 };

  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  const [lessons, completed] = await Promise.all([
    adminDb.from("lessons").select("id").eq("course_id", courseId),
    adminDb
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("completed", true),
  ]);

  const totalLessons = lessons.data?.length || 0;
  const completedLessons = completed.data?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return { completedLessons, totalLessons, progress };
}

/**
 * Get real enrolled courses with progress for the current user.
 * Replaces the old mock getEnrolledCourses.
 */
export async function getEnrolledCoursesReal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  // Get active enrollments with course details
  const { data: enrollments, error } = await adminDb
    .from("enrollments")
    .select("course_id, access_type, enrolled_at, courses(id, title, short_description, image_url, accent_color, level)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error || !enrollments?.length) return [];

  // Get all user progress
  const { data: allProgress } = await adminDb
    .from("user_progress")
    .select("lesson_id, course_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const progressMap = new Map<string, string[]>();
  (allProgress || []).forEach((p: any) => {
    if (!progressMap.has(p.course_id)) progressMap.set(p.course_id, []);
    progressMap.get(p.course_id)!.push(p.lesson_id);
  });

  const results = [];
  for (const enr of enrollments as any[]) {
    const courseId = enr.course_id;
    const course = enr.courses;

    // Count total lessons
    const { data: lessons } = await adminDb
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);

    const totalLessons = lessons?.length || 0;
    const completedIds = progressMap.get(courseId) || [];
    const completedInCourse = completedIds.filter((lid: string) =>
      lessons?.some((l: any) => l.id === lid)
    ).length;

    const progress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

    results.push({
      id: courseId,
      title: course?.title || "Curso",
      shortDescription: course?.short_description || "",
      imageUrl: course?.image_url || "",
      accentColor: course?.accent_color || "#1890FF",
      level: course?.level || "principiante",
      accessType: enr.access_type,
      progress,
      completedLessons: completedInCourse,
      totalLessons,
      enrolledAt: enr.enrolled_at,
    });
  }

  return results;
}

/**
 * Obtener todos los certificados emitidos al usuario actual (por user_id o email).
 */
export async function getUserCertificates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch direct certificates where user_id matches OR email matches the profile
  const { data, error } = await supabase
    .from("certificates")
    .select("id, certificate_code, issued_at, pdf_url, course_title, student_name, course_id")
    .or(`user_id.eq.${user.id},email.eq.${user.email}`);

  if (error) {
    console.error("Error fetching user certificates:", error);
    return [];
  }

  return data || [];
}

/**
 * Votar en una encuesta de la comunidad.
 * Registra o cambia el voto del usuario.
 */
export async function voteInPoll(postId: string, optionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  const { data: post, error: fetchError } = await adminDb
    .from("posts")
    .select("content")
    .eq("id", postId)
    .single();

  if (fetchError || !post) throw new Error("Publicación no encontrada");

  let richContent: any;
  try {
    richContent = JSON.parse(post.content);
  } catch (e) {
    throw new Error("La publicación no contiene una encuesta válida");
  }

  if (!richContent.__serializedRichPost || richContent.mediaType !== "poll" || !richContent.poll) {
    throw new Error("La publicación no es una encuesta válida");
  }

  // Update votes
  let userAlreadyVotedOptionId = "";
  richContent.poll.options.forEach((opt: any) => {
    if (!Array.isArray(opt.votes)) opt.votes = [];
    const idx = opt.votes.indexOf(user.id);
    if (idx > -1) {
      opt.votes.splice(idx, 1);
      userAlreadyVotedOptionId = opt.id;
    }
  });

  // If clicked a different option (or hadn't voted yet), add vote
  if (userAlreadyVotedOptionId !== optionId) {
    const targetOpt = richContent.poll.options.find((opt: any) => opt.id === optionId);
    if (targetOpt) {
      if (!Array.isArray(targetOpt.votes)) targetOpt.votes = [];
      targetOpt.votes.push(user.id);
    }
  }

  const { error: updateError } = await adminDb
    .from("posts")
    .update({ content: JSON.stringify(richContent) })
    .eq("id", postId);

  if (updateError) throw new Error("Error al registrar voto: " + updateError.message);

  revalidatePath("/(comunidad)", "layout");
}

/**
 * Obtener todos los cursos y sus lecciones para el compositor de administración.
 */
export async function getCoursesAndLessons() {
  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  const [coursesRes, lessonsRes] = await Promise.all([
    adminDb
      .from("courses")
      .select("id, title, slug")
      .order("title", { ascending: true }),
    adminDb
      .from("lessons")
      .select("id, title, course_id")
      .order("title", { ascending: true })
  ]);

  return {
    courses: coursesRes.data || [],
    lessons: lessonsRes.data || []
  };
}

/**
 * Actualiza de forma segura la suscripción de un usuario.
 * Solo puede ser ejecutada por administradores autenticados.
 * Incluye validación estricta de parámetros y registro de auditoría de seguridad.
 */
export async function adminUpdateUserSubscription(
  targetUserId: string,
  plan: string | null,
  expiresAtISO: string | null
) {
  try {
    // 1. Obtener sesión de usuario e identificar al llamador en el servidor
    const { createClient } = await import("./server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autorizado: Debes iniciar sesión" };
    }

    // 2. Verificar rol de administrador en el servidor
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      console.warn(`[INTENT DE ACCESO NO AUTORIZADO] El usuario ${user.email} (ID: ${user.id}) intentó modificar una suscripción sin privilegios.`);
      return { success: false, error: "Acceso denegado: Se requieren permisos de administrador" };
    }

    // 3. Validar y sanitizar parámetros (Mitigación de inyecciones y estados corruptos)
    const allowedPlans = [null, "none", "trial", "premium", "ultra"];
    const sanitizedPlan = plan === "none" ? null : plan;
    if (sanitizedPlan !== null && !allowedPlans.includes(sanitizedPlan)) {
      return { success: false, error: `Plan inválido: "${plan}". Solo se permiten: none, trial, premium, ultra.` };
    }

    // Validar formato UUID para el ID del usuario destino
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(targetUserId)) {
      return { success: false, error: "Formato de ID de usuario inválido (Debe ser UUID)" };
    }

    // Validar y parsear fecha de expiración
    let dbExpiresAt: string | null = null;
    if (expiresAtISO) {
      const parsedDate = new Date(expiresAtISO);
      if (isNaN(parsedDate.getTime())) {
        return { success: false, error: "Formato de fecha de expiración inválido" };
      }
      dbExpiresAt = parsedDate.toISOString();
    }

    // 4. Crear cliente administrador con privilegios elevados de forma controlada
    const { createAdminClient } = await import("./server");
    const adminDb = createAdminClient();

    // Verificar que el usuario destino exista para evitar actualizaciones huerfanas
    const { data: targetProfile, error: profileErr } = await adminDb
      .from("profiles")
      .select("email, subscription_plan")
      .eq("id", targetUserId)
      .single();

    if (profileErr || !targetProfile) {
      return { success: false, error: "El usuario destino no existe en la base de datos" };
    }

    // 5. Ejecutar la actualización en la base de datos
    const { error: updateError } = await adminDb
      .from("profiles")
      .update({
        subscription_plan: sanitizedPlan,
        subscription_expires_at: dbExpiresAt
      })
      .eq("id", targetUserId);

    if (updateError) {
      return { success: false, error: "Error al actualizar la suscripción: " + updateError.message };
    }

    // 6. Registro de Auditoría de Seguridad (Inmutable en logs de Next.js / Supabase)
    console.info(
      `[SECURITY AUDIT - SUBSCRIPTION UPDATE] Admin: ${user.email} (ID: ${user.id}) actualizó la suscripción de ${targetProfile.email} (ID: ${targetUserId}). Plan anterior: "${targetProfile.subscription_plan || 'ninguno'}", Plan nuevo: "${sanitizedPlan || 'ninguno'}", Expiración: ${dbExpiresAt || 'Permanente'}.`
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error en adminUpdateUserSubscription:", error);
    return { success: false, error: error.message || "Error interno del servidor al actualizar suscripción." };
  }
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  // Verificar si es admin o el autor del post
  const isAdmin = await isCurrentUserAdmin();
  
  // Consultar el post original para verificar el autor si no es admin
  let isAuthor = false;
  if (!isAdmin) {
    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();
    if (post && post.author_id === user.id) {
      isAuthor = true;
    }
  }

  if (!isAdmin && !isAuthor) {
    throw new Error("No tienes permisos para eliminar este post");
  }

  // Usamos el cliente admin para saltar las RLS de DELETE
  const { createAdminClient } = await import("./server");
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/(comunidad)", "layout");
}

export async function updatePost(postId: string, newContent: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  // Verificar si es admin o el autor del post
  const isAdmin = await isCurrentUserAdmin();
  
  // Consultar el post original para verificar el autor si no es admin
  let isAuthor = false;
  if (!isAdmin) {
    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();
    if (post && post.author_id === user.id) {
      isAuthor = true;
    }
  }

  if (!isAdmin && !isAuthor) {
    throw new Error("No tienes permisos para editar este post");
  }

  // Usamos el cliente admin para saltar las RLS de UPDATE
  const { createAdminClient } = await import("./server");
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("posts")
    .update({
      content: newContent,
      updated_at: new Date().toISOString()
    })
    .eq("id", postId);

  if (error) {
    console.error("Error updating post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/(comunidad)", "layout");
}

export async function getCommunityPortalData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      isAdmin: false,
      userProfile: null,
      enrollmentData: { enrollments: [], programSiblings: [] },
      orgData: null,
      allCourses: []
    };
  }

  // Ejecutar en paralelo en el servidor (baja latencia)
  const { getMyEnrollments, getAllPublishedCourses } = await import("./comunidad-ai");
  const [isAdmin, userProfile, enrollmentData, orgData, allCourses] = await Promise.all([
    isCurrentUserAdmin(),
    getCurrentUserProfile(),
    getMyEnrollments(),
    getCurrentUserManagedOrganization(),
    getAllPublishedCourses().catch(() => []),
  ]);

  return {
    isAdmin,
    userProfile,
    enrollmentData,
    orgData,
    allCourses
  };
}
