import type { SupabaseClient } from "@supabase/supabase-js";

export interface ChatContext {
  fullName: string;
  plan: string | null;
  role: string;
  studyStreak: number | null;
  xpPoints: number | null;
  courses: string[]; // títulos de cursos activos
}

/**
 * Carga el contexto del usuario desde Supabase para personalizar el prompt.
 * Consulta directa (sin pasar por server actions) para controlar la shape.
 */
export async function loadChatContext(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatContext> {
  const [{ data: profile }, { data: enrollments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, subscription_plan, role, study_streak, xp_points")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("enrollments")
      .select("course_slug, status, access_type, courses(title)")
      .eq("user_id", userId)
      .eq("status", "active"),
  ]);

  // La relación courses(title) puede tiparse como objeto o array según el cliente
  const enrollmentsTyped = (enrollments ?? []) as Array<{
    courses?: { title?: string } | Array<{ title?: string }>;
  }>;
  const titles = enrollmentsTyped
    .map((e) => {
      const c = e.courses;
      if (Array.isArray(c)) return c[0]?.title;
      return c?.title;
    })
    .filter((t): t is string => typeof t === "string" && t.length > 0);
  const courses = ([...new Set(titles)] as string[]).slice(0, 12);

  return {
    fullName: profile?.full_name || "estudiante",
    plan: profile?.subscription_plan ?? null,
    role: profile?.role ?? "student",
    studyStreak: profile?.study_streak ?? null,
    xpPoints: profile?.xp_points ?? null,
    courses,
  };
}

/**
 * Construye el system prompt del mentor IA de ProgramBI, personalizado.
 */
export function buildSystemPrompt(ctx: ChatContext): string {
  const greeting = `Hablas con ${ctx.fullName}, ${
    ctx.plan ? `miembro ${ctx.plan}` : "estudiante"
  } de ProgramBI.`;

  const coursesBlock =
    ctx.courses.length > 0
      ? `Cursos que estoy cursando actualmente:\n${ctx.courses
          .map((c) => `- ${c}`)
          .join("\n")}\nCuando sea relevante, conecta tus respuestas con estos cursos.`
      : "Aún no estoy inscrito en cursos, pero quiero aprender Data Science y BI.";

  const streakBlock =
    ctx.studyStreak && ctx.studyStreak > 0
      ? `Llevo una racha de ${ctx.studyStreak} días de estudio.`
      : "";

  return `Eres el Mentor IA de ProgramBI, una plataforma de formación en Data Science, Business Intelligence y Analytics. Eres didáctico, cercano y profesional.

**Contexto del estudiante:**
${greeting}
${streakBlock}
${coursesBlock}

**Tus áreas de expertise:**
- Python (pandas, numpy, matplotlib, seaborn, scikit-learn)
- SQL (consultas, optimización, bases de datos relacionales)
- Power BI (DAX, Power Query, modelado de datos, visualizaciones)
- Excel avanzado (fórmulas, tablas dinámicas, macros)
- Estadística y análisis de datos
- Visualización de datos y storytelling

**Estilo de respuesta:**
- Sé didáctico y claro, explica paso a paso.
- Usa bloques de código con triple backticks y el lenguaje especificado.
- Usa markdown para estructurar (headings, listas, tablas) y LaTeX para fórmulas matemáticas.
- Fomenta buenas prácticas y patrones profesionales.
- Si pregunto algo fuera de tu expertise, responde honestamente pero intenta relacionarlo con data/analytics.
- Responde SIEMPRE en español.

**Formato de código:**
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
\`\`\`

Sé conciso pero completo. Prioriza la claridad sobre la exhaustividad. Si la pregunta es ambigua, haz una pregunta de aclaración breve antes de responder.`;
}
