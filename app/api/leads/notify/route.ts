import { NextRequest, NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNotifyMeConfirmation } from "@/lib/email/mailersend";
import { z } from "zod";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { normalizarPais } from "@/config/paises";

const notifySchema = z
  .object({
    name: z.string().min(2).max(120).optional().nullable(),
    email: z.string().trim().email().optional().nullable().or(z.literal("")),
    whatsapp: z.string().trim().max(30).optional().nullable(),
    courseSlug: z.string().min(2).max(100),
    levelName: z.string().max(50).optional().nullable(),
    courseName: z.string().max(120).optional().nullable(),
    pais: z.string().max(8).optional().nullable(),
  })
  .refine(
    (data) => {
      const hasEmail = Boolean(data.email && data.email.trim().length > 0);
      const waDigits = (data.whatsapp || "").replace(/\D/g, "");
      return hasEmail || waDigits.length >= 7;
    },
    { message: "Ingresa un correo válido o un WhatsApp con al menos 7 dígitos." }
  );

function isEmailNotNullError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return error.code === "23502" || (msg.includes("null value") && msg.includes("email"));
}

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
      return NextResponse.json(
        { error: "Ingresa un correo válido o un WhatsApp con al menos 7 dígitos." },
        { status: 400 }
      );
    }

    const { name, courseSlug, levelName, courseName, pais } = validation.data;
    const cleanEmail = validation.data.email?.trim() || null;
    const cleanWhatsapp = validation.data.whatsapp?.trim() || null;
    const waDigits = (cleanWhatsapp || "").replace(/\D/g, "");
    const paisIso = normalizarPais(pais);

    const adminDb = createAdminClient();

    const baseRow = {
      name: name?.trim() || "Sin nombre",
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
      message: `Avísame próxima fecha: ${courseName || courseSlug} (${levelName || "General"}) | pais=${paisIso}`,
      selected_courses: [courseSlug],
      source_course: courseSlug,
      lead_type: "avisame_proxima_fecha",
    };

    let { error } = await adminDb.from("course_leads").insert(baseRow);

    // Si `course_leads.email` tiene restricción NOT NULL en este entorno, reintenta
    // con un placeholder determinístico basado en el número de WhatsApp.
    if (error && !cleanEmail && isEmailNotNullError(error)) {
      ({ error } = await adminDb.from("course_leads").insert({
        ...baseRow,
        email: `wa-${waDigits}@whatsapp.programbi.local`,
      }));
    }

    if (error) {
      console.error("Error inserting notify lead:", error);
      return NextResponse.json({ error: "Error al registrar interés" }, { status: 500 });
    }

    // Enviar email de confirmación en segundo plano solo si hay correo real
    if (cleanEmail) {
      after(async () => {
        try {
          await sendNotifyMeConfirmation({
            name: name?.trim() || "Estudiante",
            email: cleanEmail,
            courseName: courseName || courseSlug,
            levelName: levelName ?? undefined,
          });
        } catch (err) {
          console.error("MailerSend notify email error:", err);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("API Error in leads/notify:", err);
    const isProd = process.env.NODE_ENV === "production";
    const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
    return NextResponse.json(
      { error: isProd ? "Ocurrió un error inesperado." : msg },
      { status: 500 }
    );
  }
}
