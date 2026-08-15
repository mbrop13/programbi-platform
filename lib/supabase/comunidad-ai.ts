"use server";

import { createClient, createAdminClient } from "./server";
import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "./comunidad";

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

export async function adminDeleteLead(leadId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("course_leads").delete().eq("id", leadId);
  if (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/(admin)", "layout");
  return { success: true };
}

export async function adminBulkDeleteLeads(leadIds: string[]) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  if (!leadIds || leadIds.length === 0) return { success: true, count: 0 };

  const { error } = await adminDb.from("course_leads").delete().in("id", leadIds);
  if (error) {
    console.error("Error bulk deleting leads:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/(admin)", "layout");
  return { success: true, count: leadIds.length };
}

// ─── ADMIN: COURSE MANAGEMENT ───

export async function adminGetCourses() {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("courses")
    .select("id, slug, title, description, short_description, category, level, is_published, is_hidden, is_featured, image_url, accent_color, badge_label, duration_hours, tech_stack, created_at, lessons(id)")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  const courses = (data || []).map((c: any) => ({ ...c, lesson_count: c.lessons?.length || 0, lessons: undefined, enrollment_count: 0 }));

  const slugs = courses.map((c: { slug: string }) => c.slug).filter(Boolean);
  if (slugs.length === 0) return courses;

  const counts: Record<string, number> = {};
  for (let i = 0; i < slugs.length; i += 80) {
    const chunk = slugs.slice(i, i + 80);
    const { data: enrolls } = await adminDb
      .from("enrollments")
      .select("course_slug")
      .in("course_slug", chunk)
      .eq("status", "active");
    for (const e of enrolls || []) {
      if (!e.course_slug) continue;
      counts[e.course_slug] = (counts[e.course_slug] || 0) + 1;
    }
  }

  return courses.map((c: any) => ({ ...c, enrollment_count: counts[c.slug] || 0 }));
}

export async function adminCreateCourse(courseData: {
  title: string;
  slug: string;
  description: string;
  category: string;
  level?: string;
  image_url?: string;
  short_description?: string;
  is_hidden?: boolean;
  is_published?: boolean;
  tech_stack?: string[];
  accent_color?: string;
  badge_label?: string;
  duration_hours?: number;
}) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const title = (courseData.title || "").trim();
  const slug = (courseData.slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const description = (courseData.description || "").trim() || title;
  const category = (courseData.category || "Campus Virtual").trim();

  if (!title) throw new Error("El título del curso es obligatorio.");
  if (!slug) throw new Error("El slug del curso es obligatorio.");

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("courses")
    .insert({
      title,
      slug,
      description,
      category,
      short_description: (courseData.short_description || "").trim() || `Grabaciones y material de ${title}`,
      level: courseData.level || "principiante",
      image_url: courseData.image_url || null,
      is_hidden: courseData.is_hidden ?? true,
      is_published: courseData.is_published ?? false,
      tech_stack: courseData.tech_stack || [],
      accent_color: courseData.accent_color || "#1890FF",
      badge_label: courseData.badge_label || "Campus",
      duration_hours: courseData.duration_hours ?? 0,
      sort_order: 999,
    })
    .select("id, slug, title, category, is_hidden, is_published, short_description, level, accent_color, badge_label, duration_hours, tech_stack, description, created_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error(`Ya existe un curso con el slug "${slug}".`);
    throw new Error(error.message);
  }

  revalidatePath("/(comunidad)", "layout");
  return { ...data, lesson_count: 0 };
}

export async function adminUpdateCourseMeta(
  courseId: string,
  updates: {
    title?: string;
    short_description?: string;
    category?: string;
    level?: string;
    badge_label?: string | null;
    accent_color?: string;
    tech_stack?: string[];
    duration_hours?: number;
  }
) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const adminDb = createAdminClient();
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.short_description !== undefined) payload.short_description = updates.short_description.trim();
  if (updates.category !== undefined) payload.category = updates.category.trim();
  if (updates.level !== undefined) payload.level = updates.level;
  if (updates.badge_label !== undefined) payload.badge_label = updates.badge_label;
  if (updates.accent_color !== undefined) payload.accent_color = updates.accent_color;
  if (updates.tech_stack !== undefined) payload.tech_stack = updates.tech_stack;
  if (updates.duration_hours !== undefined) payload.duration_hours = updates.duration_hours;

  const { error } = await adminDb.from("courses").update(payload).eq("id", courseId);
  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
  return { success: true };
}

export async function adminAddLesson(lessonData: {
  course_id: string; title: string; module_name: string;
  module_order: number; lesson_order: number; video_url: string;
  duration_minutes?: number; is_free_preview?: boolean;
  superclass_language?: string | null;
  resources?: any[];
  description?: string;
}) {
  try {
    const admin = await isCurrentUserAdmin();
    if (!admin) return { success: false, error: "Permiso denegado: solo administradores." };

    const adminDb = createAdminClient();
    // La descripción del admin se persiste en content_markdown (columna real en BD).
    // No usamos lessons.description: esa columna no existe aún en producción.
    const { data, error } = await adminDb
      .from("lessons")
      .insert({
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
        resources: lessonData.resources || [],
        content_markdown: lessonData.description || "",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error in adminAddLesson Supabase insert:", error);
      return { success: false, error: error.message };
    }
    try { revalidatePath("/comunidad", "layout"); } catch {}
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in adminAddLesson exception:", err);
    return { success: false, error: err?.message || "Ocurrió un error al crear la lección." };
  }
}

export async function adminUpdateLesson(lessonId: string, lessonData: {
  title: string; module_name: string;
  module_order: number; lesson_order: number; video_url: string;
  duration_minutes?: number; is_free_preview?: boolean;
  superclass_language?: string | null;
  resources?: any[];
  description?: string;
}) {
  try {
    const admin = await isCurrentUserAdmin();
    if (!admin) return { success: false, error: "Permiso denegado: solo administradores." };

    const adminDb = createAdminClient();
    const { error } = await adminDb
      .from("lessons")
      .update({
        title: lessonData.title,
        module_name: lessonData.module_name,
        module_order: lessonData.module_order,
        lesson_order: lessonData.lesson_order,
        video_url: lessonData.video_url,
        duration_minutes: lessonData.duration_minutes || 0,
        is_free_preview: lessonData.is_free_preview || false,
        superclass_language: lessonData.superclass_language || null,
        resources: lessonData.resources || [],
        content_markdown: lessonData.description || "",
      })
      .eq("id", lessonId);

    if (error) {
      console.error("Error in adminUpdateLesson Supabase update:", error);
      return { success: false, error: error.message };
    }
    try { revalidatePath("/comunidad", "layout"); } catch {}
    return { success: true };
  } catch (err: any) {
    console.error("Error in adminUpdateLesson exception:", err);
    return { success: false, error: err?.message || "Ocurrió un error al actualizar la lección." };
  }
}

export async function adminGetLessons(courseId: string) {
  try {
    const admin = await isCurrentUserAdmin();
    if (!admin) return [];

    const adminDb = createAdminClient();
    const { data, error } = await adminDb
      .from("lessons")
      .select("id, title, module_name, module_order, lesson_order, video_url, duration_minutes, is_free_preview, superclass_language, resources, description, content_markdown")
      .eq("course_id", courseId)
      .order("module_order", { ascending: true })
      .order("lesson_order", { ascending: true });

    if (error) { console.error("Error fetching lessons:", error); return []; }
    // Exponemos description en la UI a partir de content_markdown
    return (data || []).map((l: any) => ({
      ...l,
      description: l.content_markdown || "",
    }));
  } catch (err) {
    console.error("Exception in adminGetLessons:", err);
    return [];
  }
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

export async function adminUpdateCourseDescription(courseId: string, description: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");
  
  await adminDb.from("courses").update({ description }).eq("id", courseId);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminUpdateCourseShortDescription(courseId: string, shortDescription: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");
  
  await adminDb.from("courses").update({ short_description: shortDescription }).eq("id", courseId);
  revalidatePath("/(comunidad)", "layout");
}

export async function adminUploadCourseResource(formData: FormData) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No se proporcionó ningún archivo.");

  const ext = file.name.split(".").pop() || "bin";
  const path = `lessons/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminDb.storage
    .from("course-resources")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw new Error(uploadError.message);
  }

  const { data: { publicUrl } } = adminDb.storage
    .from("course-resources")
    .getPublicUrl(path);

  return {
    name: file.name,
    url: publicUrl,
    size: file.size,
    path: path,
  };
}

export async function getMarketingDescription(slug: string) {
  const adminDb = createAdminClient();
  const { data } = await adminDb.from("courses").select("description").eq("slug", slug).single();
  return data?.description || null;
}

export async function getCourseDescriptions() {
  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("courses")
    .select("slug, description, short_description");
  if (error) {
    console.error("Error fetching course descriptions:", error);
    return [];
  }
  return data || [];
}

// ─── ADMIN: ENROLLMENT MANAGEMENT ───

export async function adminGetAllUsers() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: profiles, error } = await adminDb
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, created_at, phone, registration_source, subscription_plan, subscription_expires_at")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }

  // Auto-backfill missing emails or phones from auth.users
  const profilesMissingData = (profiles || []).filter(p => !p.email || !p.phone);
  if (profilesMissingData.length > 0) {
    try {
      const { data: authData } = await adminDb.auth.admin.listUsers({ perPage: 1000 });
      if (authData && authData.users) {
        const authMap = Object.fromEntries(authData.users.map(u => [u.id, u]));
        for (const p of (profiles || [])) {
          const authUser = authMap[p.id];
          if (authUser) {
            let updated = false;
            let updates: any = {};
            if (!p.email && authUser.email) {
               p.email = authUser.email;
               updates.email = authUser.email;
               updated = true;
            }
            const phone = authUser.phone || authUser.user_metadata?.whatsapp || authUser.user_metadata?.phone;
            if (!p.phone && phone) {
               p.phone = phone;
               updates.phone = phone;
               updated = true;
            }
            if (updated) {
               adminDb.from("profiles").update(updates).eq("id", p.id).then();
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to backfill missing data:", err);
    }
  }

  return profiles || [];
}

export async function adminDeleteUser(userId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // Prevent self-deletion if current user is admin
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser?.id === userId) {
    return { success: false, error: "No puedes eliminar tu propia cuenta de administrador." };
  }

  try {
    // 1. Delete associated data to clean up FK relationships
    await Promise.allSettled([
      adminDb.from("enrollments").delete().eq("user_id", userId),
      adminDb.from("user_subscriptions").delete().eq("user_id", userId),
      adminDb.from("user_progress").delete().eq("user_id", userId),
      adminDb.from("certificates").delete().eq("user_id", userId),
      adminDb.from("support_tickets").delete().eq("user_id", userId),
    ]);

    // 2. Delete profile
    const { error: profileErr } = await adminDb.from("profiles").delete().eq("id", userId);
    if (profileErr) console.error("Error deleting user profile:", profileErr);

    // 3. Delete auth user
    const { error: authErr } = await adminDb.auth.admin.deleteUser(userId);
    if (authErr) console.error("Error deleting user from Auth:", authErr);

    revalidatePath("/(admin)", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Error in adminDeleteUser:", err);
    return { success: false, error: err.message || "Error al eliminar miembro." };
  }
}

export async function adminBulkDeleteUsers(userIds: string[]) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  if (!userIds || userIds.length === 0) return { success: true, count: 0 };

  // Prevent self-deletion if current user is admin
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const safeUserIds = userIds.filter(id => id !== currentUser?.id);

  if (safeUserIds.length === 0) {
    return { success: false, error: "No se puede eliminar la propia cuenta de administrador." };
  }

  try {
    // 1. Delete associated data for all selected user IDs
    await Promise.allSettled([
      adminDb.from("enrollments").delete().in("user_id", safeUserIds),
      adminDb.from("user_subscriptions").delete().in("user_id", safeUserIds),
      adminDb.from("user_progress").delete().in("user_id", safeUserIds),
      adminDb.from("certificates").delete().in("user_id", safeUserIds),
      adminDb.from("support_tickets").delete().in("user_id", safeUserIds),
    ]);

    // 2. Delete profiles
    const { error: profileErr } = await adminDb.from("profiles").delete().in("id", safeUserIds);
    if (profileErr) console.error("Error bulk deleting profiles:", profileErr);

    // 3. Delete auth users
    await Promise.allSettled(
      safeUserIds.map(id => adminDb.auth.admin.deleteUser(id))
    );

    revalidatePath("/(admin)", "layout");
    return { success: true, count: safeUserIds.length };
  } catch (err: any) {
    console.error("Error in adminBulkDeleteUsers:", err);
    return { success: false, error: err.message || "Error al eliminar miembros en lote." };
  }
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

/** Lista de alumnos con acceso a un curso (campus virtual / cohorte). */
export async function adminGetCourseEnrollments(courseSlug: string) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("enrollments")
    .select("id, user_id, course_slug, status, access_type, enrolled_at")
    .eq("course_slug", courseSlug)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching course enrollments:", error);
    return [];
  }
  if (!data || data.length === 0) return [];

  const userIds = [...new Set(data.map((e: any) => e.user_id))];
  const { data: profiles } = await adminDb
    .from("profiles")
    .select("id, full_name, email, avatar_url, role")
    .in("id", userIds);

  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
  return data.map((e: any) => ({
    ...e,
    profile: profileMap[e.user_id] || { id: e.user_id, full_name: "Usuario", email: "", avatar_url: null, role: "student" },
  }));
}

/**
 * Otorga acceso masivo a un curso por lista de emails (uno por línea o separados por coma).
 * Ideal para cohortes tipo "SQL Server Junio".
 */
export async function adminBulkEnrollByEmails(
  courseSlug: string,
  emailsInput: string,
  accessType: string = "full"
) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const adminDb = createAdminClient();
  const slug = (courseSlug || "").trim();
  if (!slug) return { success: 0, failed: 0, notFound: [] as string[], errors: ["Falta el slug del curso."] };

  const { data: course } = await adminDb.from("courses").select("id, slug, title").eq("slug", slug).maybeSingle();
  if (!course) {
    return { success: 0, failed: 1, notFound: [] as string[], errors: [`Curso no encontrado: ${slug}`] };
  }

  const rawEmails = emailsInput
    .split(/[\n,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e.includes("@"));

  const uniqueEmails = [...new Set(rawEmails)];
  if (uniqueEmails.length === 0) {
    return { success: 0, failed: 0, notFound: [] as string[], errors: ["No se encontraron emails válidos."] };
  }

  // Fetch matching profiles in chunks (case-insensitive)
  const profileByEmail = new Map<string, { id: string; email: string }>();
  const chunkSize = 40;
  for (let i = 0; i < uniqueEmails.length; i += chunkSize) {
    const chunk = uniqueEmails.slice(i, i + chunkSize);
    // PostgREST: email.ilike."user@domain.com" for special characters
    const orFilter = chunk
      .map((e) => `email.ilike."${e.replace(/"/g, "")}"`)
      .join(",");
    const { data: profiles, error: profileErr } = await adminDb
      .from("profiles")
      .select("id, email")
      .or(orFilter);
    if (profileErr) {
      // Fallback: exact match (lowercase list)
      const { data: fallback } = await adminDb
        .from("profiles")
        .select("id, email")
        .in("email", chunk);
      for (const p of fallback || []) {
        if (p.email) profileByEmail.set(p.email.toLowerCase(), { id: p.id, email: p.email });
      }
    } else {
      for (const p of profiles || []) {
        if (p.email) profileByEmail.set(p.email.toLowerCase(), { id: p.id, email: p.email });
      }
    }
  }

  const notFound: string[] = [];
  const enrollRows: { user_id: string; course_slug: string; status: string; access_type: string }[] = [];

  for (const email of uniqueEmails) {
    const profile = profileByEmail.get(email);
    if (!profile) {
      notFound.push(email);
      continue;
    }
    enrollRows.push({
      user_id: profile.id,
      course_slug: slug,
      status: "active",
      access_type: accessType || "full",
    });
  }

  let success = 0;
  const errors: string[] = [];

  // Upsert in batches
  for (let i = 0; i < enrollRows.length; i += 200) {
    const batch = enrollRows.slice(i, i + 200);
    const { error } = await adminDb
      .from("enrollments")
      .upsert(batch, { onConflict: "user_id,course_slug" });
    if (error) {
      errors.push(error.message);
    } else {
      success += batch.length;
    }
  }

  revalidatePath("/(comunidad)", "layout");
  return {
    success,
    failed: notFound.length + (errors.length > 0 ? Math.max(0, enrollRows.length - success) : 0),
    notFound,
    errors,
    courseTitle: course.title,
  };
}

/** Busca miembros registrados por nombre o email para otorgar acceso. */
export async function adminSearchMembers(query: string) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const q = (query || "").trim().replace(/[%_,()]/g, " ").replace(/\s+/g, " ");
  if (q.length < 2) return [];

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
    .order("full_name", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Error searching members:", error);
    return [];
  }
  return data || [];
}

/** Otorga acceso a un curso a varios usuarios ya identificados. */
export async function adminBulkEnrollByUserIds(
  courseSlug: string,
  userIds: string[],
  accessType: string = "full"
) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const slug = (courseSlug || "").trim();
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if (!slug || ids.length === 0) return { success: 0 };

  const adminDb = createAdminClient();
  const rows = ids.map((user_id) => ({
    user_id,
    course_slug: slug,
    status: "active",
    access_type: accessType || "full",
  }));

  const { error } = await adminDb
    .from("enrollments")
    .upsert(rows, { onConflict: "user_id,course_slug" });

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
  return { success: ids.length };
}

/** Revoca acceso a un curso para varios usuarios a la vez. */
export async function adminBulkRemoveCourseEnrollments(courseSlug: string, userIds: string[]) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  if (!userIds || userIds.length === 0) return { success: true, count: 0 };

  const adminDb = createAdminClient();
  const { error } = await adminDb
    .from("enrollments")
    .delete()
    .eq("course_slug", courseSlug)
    .in("user_id", userIds);

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
  return { success: true, count: userIds.length };
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

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp")
    .eq("is_published", true)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true });

  if (error || !courses || courses.length === 0) {
    if (error) console.error("Error fetching published courses:", error);
    return [];
  }

  // Obtener lecciones para contar y detectar si tienen clase gratuita activada desde admin
  const { data: lessons } = await supabase
    .from("lessons")
    .select("course_id, is_free_preview")
    .in("course_id", courses.map(c => c.id));

  const lessonStats: Record<string, { count: number; hasFreePreview: boolean }> = {};
  (lessons || []).forEach((l: any) => {
    if (!lessonStats[l.course_id]) lessonStats[l.course_id] = { count: 0, hasFreePreview: false };
    lessonStats[l.course_id].count++;
    if (l.is_free_preview === true) lessonStats[l.course_id].hasFreePreview = true;
  });

  return courses
    .filter((c: any) => (lessonStats[c.id]?.count || 0) > 0)
    .map((c: any) => ({
      ...c,
      lesson_count: lessonStats[c.id]?.count || 0,
      has_free_preview: lessonStats[c.id]?.hasFreePreview || false,
    }));
}

export async function getMyEnrollments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { enrollments: [], programSiblings: [] };

  const adminDb = createAdminClient();

  const [enrollmentsRes, profileRes, isAdmin, publishedCoursesRes, allLessonsRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("course_slug, status, access_type, enrolled_at")
      .eq("user_id", user.id)
      .eq("status", "active"),
    adminDb
      .from("profiles")
      .select("is_on_trial, subscription_plan, subscription_expires_at, role")
      .eq("id", user.id)
      .maybeSingle(),
    isCurrentUserAdmin().catch(() => false),
    adminDb
      .from("courses")
      .select("id, slug")
      .eq("is_published", true)
      .eq("is_hidden", false),
    adminDb
      .from("lessons")
      .select("course_id")
  ]);

  const dbEnrollments = enrollmentsRes.data || [];
  const profile = profileRes.data;

  const hasActiveSubscription = (profile?.subscription_plan && 
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) >= new Date())) || isAdmin;
  const isOnTrial = profile?.is_on_trial === true;

  let data = [...dbEnrollments];

  // Obtener únicamente los slugs de cursos verdaderamente publicados y que tienen al menos 1 lección creada
  const validCourseIds = new Set((allLessonsRes.data || []).map((l: any) => l.course_id));
  const validPublishedCourses = (publishedCoursesRes.data || []).filter((c: any) => validCourseIds.has(c.id));
  const communitySlugs = validPublishedCourses.map((c: any) => c.slug);

  if (hasActiveSubscription || isOnTrial) {
    const requiredAccess = hasActiveSubscription ? "full" : "trial";

    communitySlugs.forEach(slug => {
      const existingIdx = data.findIndex(e => e.course_slug === slug);
      if (existingIdx !== -1) {
        if (requiredAccess === "full" && data[existingIdx].access_type !== "full") {
          data[existingIdx] = {
            ...data[existingIdx],
            access_type: "full"
          };
        }
      } else {
        data.push({
          course_slug: slug,
          status: "active",
          access_type: requiredAccess,
          enrolled_at: user.created_at || new Date().toISOString()
        });
      }
    });
  } else {
    // Free preview mode: logged-in users can browse community courses and watch
    // lessons marked as free preview from the admin panel.
    const { FREE_PREVIEW_ACCESS_ENABLED } = await import("@/lib/data/community-flags");
    if (FREE_PREVIEW_ACCESS_ENABLED) {
      communitySlugs.forEach(slug => {
        if (!data.some(e => e.course_slug === slug)) {
          data.push({
            course_slug: slug,
            status: "active",
            access_type: "free",
            enrolled_at: user.created_at || new Date().toISOString()
          });
        }
      });
    }
  }

  if (enrollmentsRes.error) { console.error("Error:", enrollmentsRes.error); return { enrollments: [], programSiblings: [] }; }
  if (!data || data.length === 0) return { enrollments: [], programSiblings: [] };

  const slugs = data.map((e: any) => e.course_slug);

  // Get full course data for enrolled courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp")
    .in("slug", slugs);

  // Count lessons per course and check for free preview lessons
  const { data: lessonCounts } = await supabase
    .from("lessons")
    .select("course_id, created_at, is_free_preview")
    .in("course_id", (courses || []).map(c => c.id));

  // Build lesson stats per course id
  const lessonStats: Record<string, { count: number; latest: string | null; hasFreePreview: boolean }> = {};
  (lessonCounts || []).forEach((l: any) => {
    if (!lessonStats[l.course_id]) lessonStats[l.course_id] = { count: 0, latest: null, hasFreePreview: false };
    lessonStats[l.course_id].count++;
    if (l.is_free_preview === true) {
      lessonStats[l.course_id].hasFreePreview = true;
    }
    if (!lessonStats[l.course_id].latest || l.created_at > lessonStats[l.course_id].latest!) {
      lessonStats[l.course_id].latest = l.created_at;
    }
  });

  const enrichedEnrollments = data.map((e: any) => {
    const c = courses?.find(c => c.slug === e.course_slug);
    const stats = c ? lessonStats[c.id] : null;
    return {
      ...e,
      course: c ? {
        ...c,
        lesson_count: stats?.count || 0,
        latest_lesson_at: stats?.latest || null,
        has_free_preview: stats?.hasFreePreview || false,
      } : null
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
      .select("id, slug, title, short_description, category, badge_label, badge_color, tech_stack, duration_hours, level, image_url, icon, accent_color, is_featured, sort_order, price_clp, is_hidden")
      .in("category", enrolledCategories)
      .eq("is_published", true)
      .eq("is_hidden", false);

    // Enrich siblings with lesson counts too
    const siblingIds = (siblings || []).map(s => s.id);
    const { data: sibLessonCounts } = await supabase
      .from("lessons")
      .select("course_id, created_at, is_free_preview")
      .in("course_id", siblingIds);

    const sibStats: Record<string, { count: number; latest: string | null; hasFreePreview: boolean }> = {};
    (sibLessonCounts || []).forEach((l: any) => {
      if (!sibStats[l.course_id]) sibStats[l.course_id] = { count: 0, latest: null, hasFreePreview: false };
      sibStats[l.course_id].count++;
      if (l.is_free_preview === true) {
        sibStats[l.course_id].hasFreePreview = true;
      }
      if (!sibStats[l.course_id].latest || l.created_at > sibStats[l.course_id].latest!) {
        sibStats[l.course_id].latest = l.created_at;
      }
    });

    programSiblings = (siblings || []).map(s => ({
      ...s,
      lesson_count: sibStats[s.id]?.count || 0,
      latest_lesson_at: sibStats[s.id]?.latest || null,
      has_free_preview: sibStats[s.id]?.hasFreePreview || false,
    }));
  }

  // Mostrar TODOS los cursos con enrollment real (incluye cohortes de campus
  // virtual como "sql-server-junio"), no solo el catálogo principal.
  // Los siblings de programa se limitan a cursos públicos no ocultos.
  const filteredSiblings = programSiblings.filter((s: any) => !s.is_hidden);

  return {
    enrollments: enrichedEnrollments.filter((e: any) => e.course),
    programSiblings: filteredSiblings,
  };
}

export async function getCourseLessons(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { lessons: [], access: null, completedLessonIds: [] };

  const adminDb = createAdminClient();

  const [profileRes, courseDataRes, lessonsRes, progressDataRes] = await Promise.all([
    adminDb.from("profiles").select("is_on_trial, subscription_plan, subscription_expires_at, role").eq("id", user.id).maybeSingle(),
    adminDb.from("courses").select("slug, is_hidden").eq("id", courseId).maybeSingle(),
    adminDb.from("lessons")
      .select("id, title, module_name, module_order, lesson_order, video_url, duration_minutes, is_free_preview, superclass_language, resources, description, content_markdown")
      .eq("course_id", courseId)
      .order("module_order", { ascending: true })
      .order("lesson_order", { ascending: true }),
    adminDb.from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("completed", true)
  ]);

  const profile = profileRes.data;
  const courseData = courseDataRes.data;
  // Map content_markdown -> description para la UI (columna description puede no existir aún)
  const lessons = (lessonsRes.data || []).map((l: any) => ({
    ...l,
    description: l.description || l.content_markdown || "",
  }));
  const progressData = progressDataRes.data || [];
  const completedLessonIds = progressData.map((p) => p.lesson_id);

  // Cursos de campus (is_hidden) solo se desbloquean con enrollment explícito.
  // Suscripción/trial/preview NO abren cohortes tipo "SQL Server Junio".
  const isCampusCourse = courseData?.is_hidden === true;

  let enrollment = null;
  if (courseData?.slug) {
    const { data } = await adminDb
      .from("enrollments")
      .select("access_type")
      .eq("user_id", user.id)
      .eq("course_slug", courseData.slug)
      .eq("status", "active")
      .maybeSingle();
    enrollment = data;
  }

  const isAdmin = profile?.role === "admin" || (await isCurrentUserAdmin().catch(() => false));
  const isOnTrial = profile?.is_on_trial === true;
  let finalAccess = enrollment?.access_type || null;
  const hasActiveSubscription = !!(profile?.subscription_plan &&
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) >= new Date())) || isAdmin;

  if (!finalAccess && !isCampusCourse && hasActiveSubscription) finalAccess = "full";
  // Trial solo si no hay enrollment y el curso no es de campus privado
  if (!finalAccess && !isCampusCourse && isOnTrial) finalAccess = "trial";

  // Free-preview solo en catálogo público (no campus oculto)
  if ((!finalAccess || finalAccess === "free") && !isCampusCourse) {
    const { FREE_PREVIEW_ACCESS_ENABLED } = await import("@/lib/data/community-flags");
    if (FREE_PREVIEW_ACCESS_ENABLED && !hasActiveSubscription && !isOnTrial) {
      finalAccess = "free";
    }
  }

  const sanitizedLessons = lessons.map((l: any, index: number) => {
    let isUnlocked = false;
    if (isAdmin || finalAccess === "full") {
      isUnlocked = true;
    } else if (!isCampusCourse && hasActiveSubscription) {
      isUnlocked = true;
    } else if (finalAccess === "trial") {
      isUnlocked = index < 2;
    } else if (finalAccess === "free" || !finalAccess) {
      isUnlocked = !isCampusCourse && l.is_free_preview === true;
    }

    return {
      ...l,
      video_url: isUnlocked ? (l.video_url || "") : "",
    };
  });

  return {
    lessons: sanitizedLessons,
    access: finalAccess,
    isOnTrial,
    completedLessonIds,
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
  promo_price?: number;
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
  const supabase = createAdminClient();
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

// ─── COUPONS ───

export async function adminGetCoupons() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Error:", error); return []; }
  return data || [];
}

export async function adminCreateCoupon(coupon: {
  code: string;
  discount_percentage: number;
  max_uses?: number | null;
  is_active: boolean;
  valid_until?: string | null;
  allow_stacking?: boolean;
  applicable_courses?: string[] | null;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const cleanCoupon = {
    code: coupon.code.trim().toUpperCase(),
    discount_percentage: coupon.discount_percentage,
    max_uses: coupon.max_uses || null,
    is_active: coupon.is_active,
    valid_until: coupon.valid_until || null,
    allow_stacking: coupon.allow_stacking ?? false,
    applicable_courses: (coupon.applicable_courses && coupon.applicable_courses.length > 0) ? coupon.applicable_courses : null
  };

  const { data, error } = await adminDb
    .from("coupons")
    .insert(cleanCoupon)
    .select("id")
    .single();

  if (error) {
    if (error.message?.includes("applicable_courses") || error.code === "PGRST204" || error.code === "42703") {
      throw new Error("La columna 'applicable_courses' no existe en la tabla 'coupons' de Supabase. Ejecuta en el SQL Editor de Supabase:\n\nALTER TABLE coupons ADD COLUMN IF NOT EXISTS applicable_courses text[];");
    }
    throw new Error(error.message);
  }
  return data;
}

export async function adminUpdateCoupon(couponId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const cleanUpdates: any = { ...updates, updated_at: new Date().toISOString() };
  if (cleanUpdates.code) {
    cleanUpdates.code = cleanUpdates.code.trim().toUpperCase();
  }
  if (cleanUpdates.applicable_courses !== undefined) {
    cleanUpdates.applicable_courses = (Array.isArray(cleanUpdates.applicable_courses) && cleanUpdates.applicable_courses.length > 0)
      ? cleanUpdates.applicable_courses
      : null;
  }

  const { error } = await adminDb
    .from("coupons")
    .update(cleanUpdates)
    .eq("id", couponId);

  if (error) {
    if (error.message?.includes("applicable_courses") || error.code === "PGRST204" || error.code === "42703") {
      throw new Error("La columna 'applicable_courses' no existe en la tabla 'coupons' de Supabase. Ejecuta en el SQL Editor de Supabase:\n\nALTER TABLE coupons ADD COLUMN IF NOT EXISTS applicable_courses text[];");
    }
    throw new Error(error.message);
  }
}

export async function adminToggleCoupon(couponId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("coupons").select("is_active").eq("id", couponId).single();
  if (!current) throw new Error("Cupón no encontrado");

  const { error } = await adminDb.from("coupons").update({
    is_active: !current.is_active,
    updated_at: new Date().toISOString()
  }).eq("id", couponId);
  
  if (error) throw new Error(error.message);
}

export async function adminDeleteCoupon(couponId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb.from("coupons").delete().eq("id", couponId);
  if (error) throw new Error(error.message);
}

export async function validateCouponAction(code: string, itemSlugs?: string[]) {
  const supabase = createAdminClient();
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "Ingresa un código de descuento" };
  }

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", cleanCode)
    .maybeSingle();

  if (error) {
    console.error("Error validating coupon:", error);
    return { valid: false, message: "Error al validar el cupón" };
  }

  if (!coupon) {
    return { valid: false, message: "Código de cupón no válido" };
  }

  if (!coupon.is_active) {
    return { valid: false, message: "Este cupón está inactivo" };
  }

  if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
    return { valid: false, message: "Este cupón ha vencido" };
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, message: "Este cupón ha agotado sus usos disponibles" };
  }

  // Check course restriction if specified
  if (coupon.applicable_courses && Array.isArray(coupon.applicable_courses) && coupon.applicable_courses.length > 0) {
    if (itemSlugs && itemSlugs.length > 0) {
      const hasMatchingCourse = itemSlugs.some((slug: string) => coupon.applicable_courses.includes(slug));
      if (!hasMatchingCourse) {
        return { valid: false, message: "Este cupón no es válido para los cursos seleccionados" };
      }
    }
  }

  return {
    valid: true,
    code: coupon.code,
    discount_percentage: coupon.discount_percentage,
    id: coupon.id,
    allow_stacking: coupon.allow_stacking,
    applicable_courses: coupon.applicable_courses || null
  };
}

export async function adminIncrementCouponUsedCount(code: string) {
  const adminDb = createAdminClient();
  const cleanCode = code.trim().toUpperCase();
  
  const { data: coupon, error: selectErr } = await adminDb
    .from("coupons")
    .select("id, used_count")
    .eq("code", cleanCode)
    .single();

  if (selectErr || !coupon) {
    console.error("Coupon not found for incrementing:", selectErr);
    return;
  }

  const { error: updateErr } = await adminDb
    .from("coupons")
    .update({ used_count: (coupon.used_count || 0) + 1, updated_at: new Date().toISOString() })
    .eq("id", coupon.id);

  if (updateErr) {
    console.error("Error updating coupon used count:", updateErr);
  }
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
  const supabase = createAdminClient();

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
    .select("id, slug")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  if (data?.slug) {
    revalidatePath(`/blog/${data.slug}`);
  }
  return data;
}

export async function adminUpdateArticle(articleId: string, updates: Record<string, any>) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: oldArticle } = await adminDb.from("newsletter_articles").select("slug").eq("id", articleId).single();

  const updateData: any = { ...updates, updated_at: new Date().toISOString() };
  if (updates.status === "published" && !updates.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await adminDb
    .from("newsletter_articles")
    .update(updateData)
    .eq("id", articleId);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  if (oldArticle?.slug) {
    revalidatePath(`/blog/${oldArticle.slug}`);
  }
  if (updates.slug && updates.slug !== oldArticle?.slug) {
    revalidatePath(`/blog/${updates.slug}`);
  }
}

export async function adminDeleteArticle(articleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: article } = await adminDb.from("newsletter_articles").select("slug").eq("id", articleId).single();

  const { error } = await adminDb.from("newsletter_articles").delete().eq("id", articleId);
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  if (article?.slug) {
    revalidatePath(`/blog/${article.slug}`);
  }
}

export async function adminToggleArticlePublish(articleId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data: current } = await adminDb.from("newsletter_articles").select("status, slug").eq("id", articleId).single();
  if (!current) throw new Error("Artículo no encontrado");

  const newStatus = current.status === "published" ? "draft" : "published";
  const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
  if (newStatus === "published") updates.published_at = new Date().toISOString();

  const { error } = await adminDb.from("newsletter_articles").update(updates).eq("id", articleId);
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  if (current.slug) {
    revalidatePath(`/blog/${current.slug}`);
  }
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

// ════════════════════════════════════════════
// CHATBOT ADMIN FUNCTIONS
// ════════════════════════════════════════════

/**
 * Obtiene conversaciones del chatbot público con filtros, búsqueda y paginación.
 * Incluye el conteo de mensajes por conversación y el primer mensaje del usuario.
 */
export async function getChatbotConversations(filters?: {
  status?: string;
  isLead?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  // Construir query base para conversaciones
  let query = adminDb
    .from("chatbot_conversations")
    .select("*", { count: "exact" });

  // Aplicar filtros
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.isLead !== undefined && filters.isLead !== null) {
    query = query.eq("is_lead", filters.isLead);
  }
  if (filters?.dateFrom) {
    query = query.gte("created_at", filters.dateFrom);
  }
  if (filters?.dateTo) {
    // Agregar un día completo para incluir todo el día seleccionado
    const endDate = new Date(filters.dateTo);
    endDate.setDate(endDate.getDate() + 1);
    query = query.lt("created_at", endDate.toISOString());
  }
  if (filters?.search) {
    // Buscar en nombre, email del visitante
    query = query.or(
      `visitor_name.ilike.%${filters.search}%,visitor_email.ilike.%${filters.search}%`
    );
  }

  // Ordenar y paginar
  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: conversations, error, count } = await query;

  if (error) {
    console.error("Error fetching chatbot conversations:", error);
    return { conversations: [], total: 0 };
  }

  // Obtener IDs para buscar mensajes relacionados
  const conversationIds = (conversations || []).map((c: any) => c.id);

  if (conversationIds.length === 0) {
    return { conversations: [], total: count || 0 };
  }

  // Obtener conteo de mensajes y primer mensaje de usuario por conversación
  const { data: messages } = await adminDb
    .from("chatbot_messages")
    .select("conversation_id, role, content, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: true });

  // Agrupar datos de mensajes por conversación
  const messageStats: Record<string, { count: number; firstUserMessage: string | null }> = {};
  (messages || []).forEach((m: any) => {
    if (!messageStats[m.conversation_id]) {
      messageStats[m.conversation_id] = { count: 0, firstUserMessage: null };
    }
    messageStats[m.conversation_id].count++;
    if (m.role === "user" && !messageStats[m.conversation_id].firstUserMessage) {
      messageStats[m.conversation_id].firstUserMessage = m.content;
    }
  });

  // Enriquecer conversaciones con stats de mensajes
  const enriched = (conversations || []).map((c: any) => ({
    ...c,
    message_count: messageStats[c.id]?.count || 0,
    first_user_message: messageStats[c.id]?.firstUserMessage || null,
  }));

  return { conversations: enriched, total: count || 0 };
}

/**
 * Obtiene el detalle completo de una conversación del chatbot con todos sus mensajes.
 */
export async function getChatbotConversationDetail(conversationId: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // Obtener conversación
  const { data: conversation, error: convError } = await adminDb
    .from("chatbot_conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (convError) {
    console.error("Error fetching conversation:", convError);
    return { conversation: null, messages: [] };
  }

  // Obtener todos los mensajes de la conversación
  const { data: messages, error: msgError } = await adminDb
    .from("chatbot_messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("Error fetching messages:", msgError);
    return { conversation, messages: [] };
  }

  return { conversation, messages: messages || [] };
}

/**
 * Actualiza campos de una conversación del chatbot (estado, tags, lead, info visitante).
 */
export async function updateChatbotConversation(id: string, data: {
  status?: string;
  tags?: string[];
  is_lead?: boolean;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb
    .from("chatbot_conversations")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Obtiene estadísticas globales del chatbot: totales, hoy, semana, mes, leads y promedios.
 */
export async function getChatbotStats() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Obtener todas las conversaciones para cálculos
  const { count: totalConversations } = await adminDb
    .from("chatbot_conversations")
    .select("id", { count: "exact", head: true });

  const { count: conversationsToday } = await adminDb
    .from("chatbot_conversations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfToday);

  const { count: conversationsThisWeek } = await adminDb
    .from("chatbot_conversations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfWeek);

  const { count: conversationsThisMonth } = await adminDb
    .from("chatbot_conversations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfMonth);

  const { count: totalLeads } = await adminDb
    .from("chatbot_conversations")
    .select("id", { count: "exact", head: true })
    .eq("is_lead", true);

  // Calcular promedio de mensajes por conversación
  const { count: totalMessages } = await adminDb
    .from("chatbot_messages")
    .select("id", { count: "exact", head: true });

  const avgMessagesPerConversation =
    totalConversations && totalConversations > 0
      ? Math.round(((totalMessages || 0) / totalConversations) * 10) / 10
      : 0;

  // Top páginas de origen (source_page)
  const { data: allConvs } = await adminDb
    .from("chatbot_conversations")
    .select("source_page")
    .not("source_page", "is", null);

  const pageCount: Record<string, number> = {};
  (allConvs || []).forEach((c: any) => {
    if (c.source_page) {
      pageCount[c.source_page] = (pageCount[c.source_page] || 0) + 1;
    }
  });
  const topPages = Object.entries(pageCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));

  return {
    totalConversations: totalConversations || 0,
    conversationsToday: conversationsToday || 0,
    conversationsThisWeek: conversationsThisWeek || 0,
    conversationsThisMonth: conversationsThisMonth || 0,
    totalLeads: totalLeads || 0,
    avgMessagesPerConversation,
    topPages,
  };
}

/**
 * Guarda o actualiza el progreso de lección del usuario.
 */
export async function toggleLessonProgress(courseId: string, lessonId: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const adminDb = createAdminClient();

  const { error } = await adminDb
    .from("user_progress")
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,lesson_id" });

  if (error) {
    console.error("Error updating lesson progress:", error);
    throw new Error(error.message);
  }
}

/**
 * Obtiene la nota guardada de código de una clase (Super Clase).
 */
export async function getLessonNote(courseId: string, lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";

  const { data, error } = await supabase
    .from("super_class_notes")
    .select("content")
    .eq("profile_id", user.id)
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching lesson note:", error);
    return "";
  }

  return data?.content || "";
}

/**
 * Guarda o actualiza la nota de código de una clase (Super Clase).
 */
export async function saveLessonNote(courseId: string, lessonId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { error } = await supabase
    .from("super_class_notes")
    .upsert({
      profile_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
      content,
      updated_at: new Date().toISOString()
    }, { onConflict: "profile_id,lesson_id" });

  if (error) {
    console.error("Error saving lesson note:", error);
    throw new Error(error.message);
  }
}

/**
 * Obtener todos los certificados emitidos de la base de datos (para administración).
 */
export async function adminGetCertificates() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { data, error } = await adminDb
    .from("certificates")
    .select("id, email, student_name, course_title, certificate_code, issued_at, user_id, course_id")
    .order("issued_at", { ascending: false });

  if (error) {
    console.error("Error fetching certificates in admin:", error);
    return [];
  }

  return data || [];
}

/**
 * Agregar un certificado manualmente.
 */
export async function adminAddCertificate(cert: {
  email: string;
  student_name: string;
  course_title: string;
  certificate_code: string;
  issued_at?: string;
  course_id?: string;
}) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // Validate fields
  if (!cert.email || !cert.student_name || !cert.course_title || !cert.certificate_code) {
    throw new Error("Campos obligatorios faltantes");
  }

  // 1. Try to find user profile by email
  const { data: profile } = await adminDb
    .from("profiles")
    .select("id")
    .eq("email", cert.email.trim().toLowerCase())
    .maybeSingle();

  // 2. Try to find course by title if course_id is not specified
  let finalCourseId = cert.course_id || null;
  if (!finalCourseId) {
    const { data: course } = await adminDb
      .from("courses")
      .select("id")
      .eq("title", cert.course_title.trim())
      .limit(1)
      .maybeSingle();
    if (course) {
      finalCourseId = course.id;
    }
  }

  // 3. Upsert certificate
  const { data, error } = await adminDb
    .from("certificates")
    .upsert({
      email: cert.email.trim().toLowerCase(),
      student_name: cert.student_name.trim(),
      course_title: cert.course_title.trim(),
      certificate_code: cert.certificate_code.trim().toUpperCase(),
      issued_at: cert.issued_at || new Date().toISOString(),
      user_id: profile?.id || null,
      course_id: finalCourseId
    }, { onConflict: "email,course_title" })
    .select()
    .single();

  if (error) {
    console.error("Error inserting certificate:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Importar certificados de forma masiva desde filas procesadas.
 */
export async function adminImportCertificates(rows: {
  email: string;
  student_name: string;
  course_title: string;
  certificate_code: string;
  issued_at?: string;
}[]) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      if (!row.email || !row.student_name || !row.course_title || !row.certificate_code) {
        errors.push(`Campos incompletos en la fila para: ${row.email || 'desconocido'}`);
        failed++;
        continue;
      }

      // Check if user profile exists
      const { data: profile } = await adminDb
        .from("profiles")
        .select("id")
        .eq("email", row.email.trim().toLowerCase())
        .maybeSingle();

      // Check if course exists
      const { data: course } = await adminDb
        .from("courses")
        .select("id")
        .eq("title", row.course_title.trim())
        .limit(1)
        .maybeSingle();

      const { error } = await adminDb
        .from("certificates")
        .upsert({
          email: row.email.trim().toLowerCase(),
          student_name: row.student_name.trim(),
          course_title: row.course_title.trim(),
          certificate_code: row.certificate_code.trim().toUpperCase(),
          issued_at: row.issued_at || new Date().toISOString(),
          user_id: profile?.id || null,
          course_id: course?.id || null
        }, { onConflict: "email,course_title" });

      if (error) {
        errors.push(`${row.email} (${row.course_title}): ${error.message}`);
        failed++;
      } else {
        success++;
      }
    } catch (err: any) {
      errors.push(`${row.email} (${row.course_title}): ${err.message}`);
      failed++;
    }
  }

  return { success, failed, errors };
}

/**
 * Eliminar un certificado emitido.
 */
export async function adminDeleteCertificate(id: string) {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  const { error } = await adminDb
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting certificate:", error);
    throw new Error(error.message);
  }

  return true;
}

/**
 * Obtener estadísticas detalladas del dashboard para la administración.
 */
export async function adminGetDetailedDashboardStats() {
  const adminDb = createAdminClient();
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Solo administradores");

  // 1. Obtener estadísticas básicas (ingresos, transacciones recientes, etc.)
  const basicStats = await adminGetDashboardStats();

  // 2. Obtener usuarios con suscripciones activas
  const { data: subscribers } = await adminDb
    .from("profiles")
    .select("id, full_name, email, subscription_plan, subscription_expires_at, created_at")
    .not("subscription_plan", "is", null)
    .neq("subscription_plan", "none");

  const activeSubscribers = (subscribers || []).filter(p => {
    if (!p.subscription_expires_at) return true; // permanente
    return new Date(p.subscription_expires_at) >= new Date();
  });

  // 3. Progreso de los usuarios y estadísticas de actividad
  const { data: progressList } = await adminDb
    .from("user_progress")
    .select("user_id, lesson_id, course_id, completed, progress_percent, updated_at");

  const totalProgressRecords = progressList?.length || 0;
  const avgProgressPercent = totalProgressRecords > 0
    ? Math.round(progressList!.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / totalProgressRecords)
    : 0;

  const completedClassesCount = progressList?.filter(p => p.completed).length || 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const watchedLastMonthCount = progressList?.filter(p => p.updated_at && new Date(p.updated_at) >= thirtyDaysAgo).length || 0;

  // 4. Ranking de estudiantes (Progreso acumulado por curso)
  const { data: courses } = await adminDb
    .from("courses")
    .select("id, title");

  const { data: lessons } = await adminDb
    .from("lessons")
    .select("id, course_id");

  const courseLessonsCount: Record<string, number> = {};
  (lessons || []).forEach(l => {
    if (l.course_id) {
      courseLessonsCount[l.course_id] = (courseLessonsCount[l.course_id] || 0) + 1;
    }
  });

  const { data: allProfiles } = await adminDb
    .from("profiles")
    .select("id, full_name, email");

  const profileMap = new Map<string, { name: string; email: string }>();
  (allProfiles || []).forEach(p => {
    profileMap.set(p.id, { name: p.full_name || "Estudiante", email: p.email || "" });
  });

  const courseMap = new Map<string, string>();
  (courses || []).forEach(c => {
    courseMap.set(c.id, c.title);
  });

  const studentCourseProgress: Record<string, { completedCount: number; totalCount: number; maxPercent: number; lastUpdated: string }> = {};

  (progressList || []).forEach(p => {
    const key = `${p.user_id}_${p.course_id}`;
    if (!studentCourseProgress[key]) {
      studentCourseProgress[key] = { completedCount: 0, totalCount: 0, maxPercent: 0, lastUpdated: p.updated_at };
    }
    if (p.completed) {
      studentCourseProgress[key].completedCount += 1;
    }
    studentCourseProgress[key].totalCount += 1;
    if (p.progress_percent > studentCourseProgress[key].maxPercent) {
      studentCourseProgress[key].maxPercent = p.progress_percent;
    }
    if (p.updated_at && (!studentCourseProgress[key].lastUpdated || new Date(p.updated_at) > new Date(studentCourseProgress[key].lastUpdated))) {
      studentCourseProgress[key].lastUpdated = p.updated_at;
    }
  });

  const leaderboard = Object.entries(studentCourseProgress).map(([key, val]) => {
    const [userId, courseId] = key.split("_");
    const prof = profileMap.get(userId);
    const courseTitle = courseMap.get(courseId) || "Curso Desconocido";
    const totalLessons = courseLessonsCount[courseId] || val.totalCount || 1;
    const completionPercent = Math.min(100, Math.round((val.completedCount / totalLessons) * 100));

    return {
      userId,
      courseId,
      studentName: prof?.name || "Estudiante",
      studentEmail: prof?.email || "",
      courseTitle,
      completedLessons: val.completedCount,
      totalLessons,
      completionPercent,
      lastUpdated: val.lastUpdated,
    };
  }).sort((a, b) => b.completionPercent - a.completionPercent);

  return {
    ...basicStats,
    subscribers: activeSubscribers,
    activity: {
      avgProgressPercent,
      completedClassesCount,
      watchedLastMonthCount,
    },
    leaderboard,
  };
}
