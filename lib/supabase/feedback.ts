"use server";

import { createClient, createAdminClient } from "./server";
import { isCurrentUserAdmin } from "./comunidad";
import { z } from "zod";

// ============================================
// Tipos
// ============================================
export interface FeedbackInput {
  name?: string;
  email: string;
  courses_taken: string[];
  courses_other?: string;
  last_course_year?: string;
  nps_score?: number;
  overall_rating?: number;
  rating_content_quality?: number;
  rating_instructor_clarity?: number;
  rating_practical_use?: number;
  rating_materials?: number;
  rating_support?: number;
  rating_platform?: number;
  rating_value_price?: number;
  applied_knowledge?: string;
  concrete_results?: string;
  desired_courses: string[];
  desired_courses_other?: string;
  preferred_formats: string[];
  open_feedback?: string;
}

export interface FeedbackRow extends FeedbackInput {
  id: string;
  submitted_at: string;
}

export interface FeedbackAnalytics {
  total: number;
  totalUniqueEmails: number;
  // NPS
  npsScore: number; // -100..100
  npsPromoters: number;
  npsPassives: number;
  npsDetractors: number;
  npsBreakdown: { score: number; count: number }[];
  // Satisfacción
  avgOverall: number;
  // Rating promedio por dimensión
  avgRatings: { label: string; value: number | null }[];
  // Cursos tomados
  coursesTakenCounts: { name: string; count: number }[];
  lastCourseYearCounts: { year: string; count: number }[];
  // Impacto
  appliedCounts: { label: string; value: string; count: number }[];
  // Cursos deseados
  desiredCoursesCounts: { name: string; count: number }[];
  preferredFormatsCounts: { name: string; count: number }[];
  // Comentarios abiertos / resultados
  testimonials: { name: string | null; email: string; submittedAt: string; result: string | null; feedback: string | null; nps: number | null; rating: number | null }[];
  recent: FeedbackRow[];
  last7Days: number;
  trend: { date: string; count: number }[];
}

// ============================================
// Validación (zod)
// ============================================
const ratingField = z.number().int().min(1).max(5).optional();
const npsField = z.number().int().min(0).max(10).optional();

const FeedbackSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  courses_taken: z.array(z.string()).default([]),
  courses_other: z.string().trim().max(300).optional().or(z.literal("")),
  last_course_year: z.enum(["2023", "2024", "2025", "2026"]).optional().or(z.literal("")),
  nps_score: npsField,
  overall_rating: z.number().int().min(1).max(5).optional(),
  rating_content_quality: ratingField,
  rating_instructor_clarity: ratingField,
  rating_practical_use: ratingField,
  rating_materials: ratingField,
  rating_support: ratingField,
  rating_platform: ratingField,
  rating_value_price: ratingField,
  applied_knowledge: z.enum(["mucho", "algo", "poco", "no"]).optional().or(z.literal("")),
  concrete_results: z.string().trim().max(2000).optional().or(z.literal("")),
  desired_courses: z.array(z.string()).default([]),
  desired_courses_other: z.string().trim().max(300).optional().or(z.literal("")),
  preferred_formats: z.array(z.string()).default([]),
  open_feedback: z.string().trim().max(3000).optional().or(z.literal("")),
});

// ============================================
// Acción: Enviar feedback (público / anónimo)
// ============================================
export async function submitCourseFeedback(input: FeedbackInput) {
  // Validar
  const parsed = FeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Datos inválidos: " + parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  const data = parsed.data;

  const supabase = await createClient();
  // Identificar usuario si está logueado (opcional)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row = {
    name: data.name || null,
    email: data.email,
    courses_taken: data.courses_taken,
    courses_other: data.courses_other || null,
    last_course_year: data.last_course_year || null,
    nps_score: data.nps_score ?? null,
    overall_rating: data.overall_rating ?? null,
    rating_content_quality: data.rating_content_quality ?? null,
    rating_instructor_clarity: data.rating_instructor_clarity ?? null,
    rating_practical_use: data.rating_practical_use ?? null,
    rating_materials: data.rating_materials ?? null,
    rating_support: data.rating_support ?? null,
    rating_platform: data.rating_platform ?? null,
    rating_value_price: data.rating_value_price ?? null,
    applied_knowledge: data.applied_knowledge || null,
    concrete_results: data.concrete_results || null,
    desired_courses: data.desired_courses,
    desired_courses_other: data.desired_courses_other || null,
    preferred_formats: data.preferred_formats,
    open_feedback: data.open_feedback || null,
    user_id: user?.id || null,
    source: "web",
    is_anon: !user,
  };

  const { error } = await supabase.from("course_feedback").insert(row);

  if (error) {
    console.error("Error saving feedback:", error);
    const isProd = process.env.NODE_ENV === "production";
    return {
      success: false,
      error: isProd ? "No pudimos guardar tu respuesta. Inténtalo de nuevo." : error.message,
    };
  }

  return { success: true };
}

// ============================================
// Lectura: Analítica (SOLO admin)
// ============================================
export async function getFeedbackAnalytics(): Promise<FeedbackAnalytics> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error("Acceso denegado");
  }

  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("course_feedback")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback analytics:", error);
    throw new Error("No se pudo cargar la analítica");
  }

  const rows = (data ?? []) as FeedbackRow[];

  // ----- Helpers -----
  const total = rows.length;
  const uniqueEmails = new Set(rows.map((r) => r.email.toLowerCase())).size;

  // NPS
  const npsRows = rows.filter((r) => typeof r.nps_score === "number");
  const promoters = npsRows.filter((r) => (r.nps_score ?? 0) >= 9).length;
  const passives = npsRows.filter((r) => (r.nps_score ?? 0) >= 7 && (r.nps_score ?? 0) <= 8).length;
  const detractors = npsRows.filter((r) => (r.nps_score ?? 0) <= 6).length;
  const npsScore = npsRows.length
    ? Math.round(((promoters - detractors) / npsRows.length) * 100)
    : 0;

  const npsBreakdown: { score: number; count: number }[] = [];
  for (let s = 0; s <= 10; s++) {
    npsBreakdown.push({ score: s, count: npsRows.filter((r) => r.nps_score === s).length });
  }

  // Satisfacción general
  const overallRows = rows.filter((r) => typeof r.overall_rating === "number");
  const avgOverall = overallRows.length
    ? overallRows.reduce((a, r) => a + (r.overall_rating ?? 0), 0) / overallRows.length
    : 0;

  const dimFields: { key: keyof FeedbackRow; label: string }[] = [
    { key: "rating_content_quality", label: "Calidad del contenido" },
    { key: "rating_instructor_clarity", label: "Claridad del instructor" },
    { key: "rating_practical_use", label: "Utilidad práctica" },
    { key: "rating_materials", label: "Materiales y ejercicios" },
    { key: "rating_support", label: "Soporte y dudas" },
    { key: "rating_platform", label: "Plataforma" },
    { key: "rating_value_price", label: "Relación calidad-precio" },
  ];

  const avgRatings = dimFields.map(({ key, label }) => {
    const vals = rows
      .map((r) => r[key])
      .filter((v): v is number => typeof v === "number");
    return {
      label,
      value: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null,
    };
  });

  // Cursos tomados
  const coursesTakenCounts = countArrayField(rows, "courses_taken");
  const desiredCoursesCounts = countArrayField(rows, "desired_courses");
  const preferredFormatsCounts = countArrayField(rows, "preferred_formats");

  // Año del último curso
  const yearMap = new Map<string, number>();
  rows.forEach((r) => {
    if (r.last_course_year) yearMap.set(r.last_course_year, (yearMap.get(r.last_course_year) ?? 0) + 1);
  });
  const lastCourseYearCounts = [...yearMap.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Impacto profesional
  const appliedLabels: Record<string, string> = {
    mucho: "Sí, mucho",
    algo: "Sí, algo",
    poco: "Poco",
    no: "Todavía no",
  };
  const appliedMap = new Map<string, number>();
  rows.forEach((r) => {
    if (r.applied_knowledge) appliedMap.set(r.applied_knowledge, (appliedMap.get(r.applied_knowledge) ?? 0) + 1);
  });
  const appliedCounts = [...appliedMap.entries()].map(([value, count]) => ({
    value,
    label: appliedLabels[value] ?? value,
    count,
  }));

  // Testimonios / comentarios con valor
  const testimonials = rows
    .filter((r) => (r.open_feedback && r.open_feedback.trim().length > 0) || (r.concrete_results && r.concrete_results.trim().length > 0))
    .slice(0, 60)
    .map((r) => ({
      name: r.name ?? null,
      email: r.email,
      submittedAt: r.submitted_at,
      result: r.concrete_results ?? null,
      feedback: r.open_feedback ?? null,
      nps: r.nps_score ?? null,
      rating: r.overall_rating ?? null,
    }));

  // Últimos 7 días + trend (últimos 30 días)
  const now = new Date();
  const sevenAgo = new Date(now);
  sevenAgo.setDate(now.getDate() - 7);
  const last7Days = rows.filter((r) => new Date(r.submitted_at) >= sevenAgo).length;

  const trendMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    trendMap.set(d.toISOString().slice(0, 10), 0);
  }
  rows.forEach((r) => {
    const key = new Date(r.submitted_at).toISOString().slice(0, 10);
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  });
  const trend = [...trendMap.entries()].map(([date, count]) => ({ date, count }));

  return {
    total,
    totalUniqueEmails: uniqueEmails,
    npsScore,
    npsPromoters: promoters,
    npsPassives: passives,
    npsDetractors: detractors,
    npsBreakdown,
    avgOverall,
    avgRatings,
    coursesTakenCounts,
    lastCourseYearCounts,
    appliedCounts,
    desiredCoursesCounts,
    preferredFormatsCounts,
    testimonials,
    recent: rows.slice(0, 50),
    last7Days,
    trend,
  };
}

function countArrayField(
  rows: FeedbackRow[],
  field: "courses_taken" | "desired_courses" | "preferred_formats"
): { name: string; count: number }[] {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    (r[field] ?? []).forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
  });
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
