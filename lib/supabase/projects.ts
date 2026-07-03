"use server";

import { createClient } from "./server";
import { createAdminClient } from "./server";

/**
 * Obtener proyectos publicados de cursos donde el usuario tiene acceso activo
 */
export async function getUserProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const adminDb = createAdminClient();

  // Get user's enrolled courses
  const { data: enrollments } = await adminDb
    .from("enrollments")
    .select("course_slug")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!enrollments?.length) return [];

  const courseSlugs = enrollments.map((e: any) => e.course_slug);

  // Get course IDs from slugs
  const { data: courses } = await adminDb
    .from("courses")
    .select("id, title, slug")
    .in("slug", courseSlugs);

  if (!courses?.length) return [];

  const courseIds = courses.map((c: any) => c.id);

  // Get published projects for these courses
  const { data: projects } = await adminDb
    .from("projects")
    .select(`
      *,
      course:courses(id, title, slug, image_url, accent_color)
    `)
    .in("course_id", courseIds)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (!projects?.length) return [];

  const projectIds = projects.map((p: any) => p.id);

  // Get user's submissions for these projects
  const { data: submissions } = await adminDb
    .from("project_submissions")
    .select("project_id, status, score")
    .eq("user_id", user.id)
    .in("project_id", projectIds);

  const submissionMap = new Map(submissions?.map((s: any) => [s.project_id, s]) || []);

  return projects.map((p: any) => ({
    ...p,
    submission: submissionMap.get(p.id) || null,
  }));
}

/**
 * Obtener detalle de un proyecto + submission del usuario
 */
export async function getProjectDetail(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const adminDb = createAdminClient();

  // Get project
  const { data: project, error } = await adminDb
    .from("projects")
    .select(`
      *,
      course:courses(id, title, slug, image_url, accent_color)
    `)
    .eq("id", projectId)
    .eq("is_published", true)
    .single();

  if (error || !project) throw new Error("Proyecto no encontrado");

  // Get user's submission
  const { data: submission } = await adminDb
    .from("project_submissions")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { project, submission: submission || null };
}

/**
 * Enviar código y ejecutar tests via Piston API
 */
export async function submitProjectCode(projectId: string, code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const adminDb = createAdminClient();

  // Get project details
  const { data: project } = await adminDb
    .from("projects")
    .select("id, language, test_cases")
    .eq("id", projectId)
    .single();

  if (!project) throw new Error("Proyecto no encontrado");

  // Execute tests via Piston API
  let executionResult = null;
  let status = "submitted";

  if (project.test_cases && project.language) {
    executionResult = await runTestCases(code, project.language, project.test_cases);
    status = executionResult.passed_tests === executionResult.total_tests ? "completed" : "auto_graded";
  }

  // Upsert submission
  const { error } = await adminDb
    .from("project_submissions")
    .upsert({
      project_id: projectId,
      user_id: user.id,
      code,
      execution_result: executionResult,
      status,
      score: executionResult ? Math.round((executionResult.passed_tests / executionResult.total_tests) * 100) : null,
    }, {
      onConflict: "project_id,user_id"
    });

  if (error) throw new Error(`Error guardando submission: ${error.message}`);

  return { executionResult, status };
}

/**
 * Subir archivo de proyecto
 */
export async function submitProjectFile(projectId: string, file: File) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const adminDb = createAdminClient();

  // Verify project exists and accepts files
  const { data: project } = await adminDb
    .from("projects")
    .select("id, accepts_files, allowed_file_types, max_file_size_mb")
    .eq("id", projectId)
    .single();

  if (!project || !project.accepts_files) {
    throw new Error("Este proyecto no acepta archivos");
  }

  // Validate file type
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (project.allowed_file_types?.length && !project.allowed_file_types.includes(ext)) {
    throw new Error(`Tipo de archivo no permitido. Permitidos: ${project.allowed_file_types.join(", ")}`);
  }

  // Validate file size
  const maxSize = (project.max_file_size_mb || 10) * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`Archivo demasiado grande. Máximo: ${project.max_file_size_mb || 10}MB`);
  }

  // Upload to storage
  const fileName = `${user.id}/${projectId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-submissions")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw new Error(`Error subiendo archivo: ${uploadError.message}`);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("project-submissions")
    .getPublicUrl(fileName);

  // Upsert submission
  const { error } = await adminDb
    .from("project_submissions")
    .upsert({
      project_id: projectId,
      user_id: user.id,
      file_url: publicUrl,
      file_name: file.name,
      status: "submitted",
    }, {
      onConflict: "project_id,user_id"
    });

  if (error) throw new Error(`Error guardando submission: ${error.message}`);

  return { fileUrl: publicUrl, fileName: file.name };
}

/**
 * Ejecutar código via Piston API
 */
async function runTestCases(code: string, language: string, testCases: any[]) {
  const results = [];
  let passed = 0;

  for (const tc of testCases) {
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version: "*",
          files: [{ name: "main", content: code }],
          stdin: tc.input || "",
        }),
      });

      const data = await response.json();
      const output = data.run?.output?.trim() || "";
      const expected = (tc.expected_output || "").trim();

      const isPass = output === expected;
      if (isPass) passed++;

      results.push({
        description: tc.description || "Test",
        input: tc.input,
        expected,
        output,
        passed: isPass,
        error: data.run?.stderr || data.compile?.stderr || null,
      });
    } catch (err: any) {
      results.push({
        description: tc.description || "Test",
        input: tc.input,
        expected: tc.expected_output,
        output: null,
        passed: false,
        error: err.message,
      });
    }
  }

  return {
    passed_tests: passed,
    total_tests: testCases.length,
    results,
  };
}

// ========== ADMIN FUNCTIONS ==========

/**
 * Admin: obtener todos los proyectos con stats
 */
export async function adminGetAllProjects() {
  const adminDb = createAdminClient();

  const { data: projects, error } = await adminDb
    .from("projects")
    .select(`
      *,
      course:courses(id, title, slug)
    `)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Error: ${error.message}`);

  // Get submission counts
  const projectIds = projects?.map((p: any) => p.id) || [];
  if (projectIds.length > 0) {
    const { data: submissions } = await adminDb
      .from("project_submissions")
      .select("project_id, status")
      .in("project_id", projectIds);

    const countMap = new Map<string, { total: number; completed: number }>();
    submissions?.forEach((s: any) => {
      const current = countMap.get(s.project_id) || { total: 0, completed: 0 };
      current.total++;
      if (s.status === "completed") current.completed++;
      countMap.set(s.project_id, current);
    });

    return projects.map((p: any) => ({
      ...p,
      stats: countMap.get(p.id) || { total: 0, completed: 0 },
    }));
  }

  return projects.map((p: any) => ({ ...p, stats: { total: 0, completed: 0 } }));
}

/**
 * Admin: crear proyecto
 */
export async function adminCreateProject(project: {
  course_id: string;
  title: string;
  description?: string;
  instructions?: string;
  difficulty?: string;
  language?: string;
  starter_code?: string;
  test_cases?: any[];
  accepts_files?: boolean;
  allowed_file_types?: string[];
  max_file_size_mb?: number;
  xp_reward?: number;
  sort_order?: number;
}) {
  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw new Error(`Error: ${error.message}`);
  return data;
}

/**
 * Admin: actualizar proyecto
 */
export async function adminUpdateProject(id: string, updates: Partial<{
  title: string;
  description: string;
  instructions: string;
  difficulty: string;
  language: string;
  starter_code: string;
  test_cases: any[];
  accepts_files: boolean;
  allowed_file_types: string[];
  max_file_size_mb: number;
  xp_reward: number;
  sort_order: number;
  is_published: boolean;
}>) {
  const adminDb = createAdminClient();

  const { error } = await adminDb
    .from("projects")
    .update(updates)
    .eq("id", id);

  if (error) throw new Error(`Error: ${error.message}`);
}

/**
 * Admin: eliminar proyecto
 */
export async function adminDeleteProject(id: string) {
  const adminDb = createAdminClient();

  const { error } = await adminDb
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Error: ${error.message}`);
}

/**
 * Admin: obtener submissions de un proyecto
 */
export async function adminGetSubmissions(projectId: string) {
  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("project_submissions")
    .select(`
      *,
      user:profiles(id, full_name, email, avatar_url)
    `)
    .eq("project_id", projectId)
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(`Error: ${error.message}`);
  return data || [];
}

/**
 * Admin: calificar submission
 */
export async function adminGradeSubmission(submissionId: string, score: number, feedback: string) {
  const adminDb = createAdminClient();

  const { error } = await adminDb
    .from("project_submissions")
    .update({
      score,
      feedback,
      status: score >= 70 ? "completed" : "reviewed",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) throw new Error(`Error: ${error.message}`);
}
