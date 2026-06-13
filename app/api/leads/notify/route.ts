import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNotifyMeConfirmation } from "@/lib/email/mailersend";
import { z } from "zod";
import { isRateLimited } from "@/lib/security/rate-limiter";

const notifySchema = z.object({
  name: z.string().min(2).max(120).optional().nullable(),
  email: z.string().email(),
  courseSlug: z.string().min(2).max(100),
  levelName: z.string().max(50).optional().nullable(),
  courseName: z.string().max(120).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ───
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "leads-notify", 5, 60 * 1000); // Max 5 requests per minute
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos. Por favor intente más tarde." }, { status: 429 });
    }

    const body = await req.json();

    // ─── Input Validation ───
    const validation = notifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos" }, { status: 400 });
    }

    const { name, email, courseSlug, levelName, courseName } = validation.data;

    const adminDb = createAdminClient();

    const { error } = await adminDb.from("course_leads").insert({
      name: name || "Sin nombre",
      email,
      whatsapp: null,
      message: `Interesado en próxima fecha de ${courseSlug} (${levelName || "General"})`,
      selected_courses: [courseSlug],
      source_course: courseSlug,
      lead_type: "notify",
    });

    if (error) {
      console.error("Error inserting notify lead:", error);
      return NextResponse.json({ error: "Error al registrar interés" }, { status: 500 });
    }

    // Enviar email de confirmación al usuario
    sendNotifyMeConfirmation({
      name: name || "Estudiante",
      email,
      courseName: courseName || courseSlug,
      levelName: levelName ?? undefined,
    }).catch(err => console.error("MailerSend notify email error:", err));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in leads/notify:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Ocurrió un error inesperado." : err.message },
      { status: 500 }
    );
  }
}
