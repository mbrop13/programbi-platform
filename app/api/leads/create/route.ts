import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/security/rate-limiter";
import {
  sendQuoteConfirmationToLead,
  sendEnterpriseQuoteToLead,
  sendNewLeadNotificationToAdmin,
} from "@/lib/email/mailersend";

// ─── Input Validation Schema ───
const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  selectedCourses: z.array(z.string()).optional().nullable(),
  sourceCourse: z.string().max(100).optional().nullable(),
  leadType: z.string().max(50).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  position: z.string().max(120).optional().nullable(),
  employeeCount: z.string().max(50).optional().nullable(),
  pricingVariant: z.enum(["gate", "direct"]).optional().nullable(),
  _website: z.string().optional().nullable(),
  _company_url: z.string().optional().nullable(),
  _fax: z.string().optional().nullable(),
  _t: z.any().optional(),
});

// ─── Anti-Bot Helpers ───

/** Honeypot: if a hidden field is filled, it's a bot */
function isHoneypotFilled(body: any): boolean {
  return !!(body._website || body._company_url || body._fax);
}

/** Heuristic: detect gibberish names/emails */
function looksLikeSpam(name: string, email: string, message?: string): boolean {
  // 1. Excessive non-latin / non-space characters in name (allow accented chars)
  const nonLatinRatio = (name.replace(/[\p{L}\p{M}\s.'-]/gu, "").length) / Math.max(name.length, 1);
  if (nonLatinRatio > 0.3) return true;

  // 2. Name is too short or too long
  if (name.length < 2 || name.length > 120) return true;

  // 3. Email domain has no dot (e.g. user@localhost)
  const domain = email.split("@")[1] || "";
  if (!domain.includes(".")) return true;

  // 4. Excessive URLs in message (spam)
  if (message) {
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount >= 3) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ───
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "leads-create", 5, 60 * 1000); // Max 5 requests per minute
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos. Por favor intente más tarde." }, { status: 429 });
    }

    const body = await req.json();

    // ─── Input Validation ───
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos" }, { status: 400 });
    }

    const data = validation.data;

    // ─── Anti-Bot Checks (silent reject → 200 to avoid bot retries) ───
    if (isHoneypotFilled(data)) {
      console.log("🤖 Bot blocked (honeypot):", data.email);
      return NextResponse.json({ success: true }); // fake success
    }

    // Timing: el _t llega como timestamp de carga del form (o elapsed en ms).
    // Un humano tarda >1,5 s en llenar; envíos instantáneos son bots.
    const t = data._t;
    if (typeof t === "number" && Number.isFinite(t)) {
      const elapsed = t > 1e11 ? Date.now() - t : t;
      if (elapsed >= 0 && elapsed < 1500) {
        console.log("🤖 Bot blocked (timing):", data.email, `${elapsed}ms`);
        return NextResponse.json({ success: true });
      }
    }

    const whatsappClean = data.whatsapp || data.phone;
    const { name, email, message, selectedCourses, sourceCourse, leadType, company, position, employeeCount } = data;
    const whatsapp = whatsappClean;

    if (looksLikeSpam(name, email, message || undefined)) {
      console.log("🤖 Bot blocked (spam heuristic):", name, email);
      return NextResponse.json({ success: true });
    }

    const adminDb = createAdminClient();

    const insertData: Record<string, any> = {
      name,
      email,
      whatsapp: whatsapp || null,
      message: message || null,
      selected_courses: selectedCourses || [],
      source_course: sourceCourse || null,
      lead_type: leadType || "contact",
    };
    if (data.pricingVariant === "gate" || data.pricingVariant === "direct") {
      insertData.pricing_variant = data.pricingVariant;
    }

    // If enterprise lead, append company info to message
    if (leadType === "enterprise" && (company || position || employeeCount)) {
      const extraInfo = [
        company ? `Empresa: ${company}` : null,
        position ? `Cargo: ${position}` : null,
        employeeCount ? `Empleados a capacitar: ${employeeCount}` : null,
      ].filter(Boolean).join(" | ");
      insertData.message = extraInfo + (message ? ` — ${message}` : "");
    }

    let { error } = await adminDb.from("course_leads").insert(insertData);

    if (error && insertData.pricing_variant) {
      console.error("Error inserting lead (retry without variant):", error);
      delete insertData.pricing_variant;
      const retry = await adminDb.from("course_leads").insert(insertData);
      error = retry.error;
    }

    if (error) {
      console.error("Error inserting lead:", error);
      return NextResponse.json({ error: "Error al guardar el contacto" }, { status: 500 });
    }

    // ─── Disparar emails ───
    const courses = selectedCourses || (sourceCourse ? [sourceCourse] : []);

    // 1. Notificación interna al equipo de ventas
    try {
      await sendNewLeadNotificationToAdmin({
        name, email, phone: whatsapp ?? undefined, courses, message: message ?? undefined,
        leadType: leadType ?? undefined, company: company ?? undefined, position: position ?? undefined, employeeCount: employeeCount ?? undefined,
      });
      console.log("✅ Admin notification sent");
    } catch (err: any) {
      console.error("❌ Admin email error:", err?.message, err?.stack);
    }

    // 2. Confirmación al lead (diferente para empresa vs. individual, se omite para webinar)
    if (leadType !== "webinar") {
      try {
        if ((leadType === "empresa" || leadType === "enterprise") && company) {
          await sendEnterpriseQuoteToLead({ name, email, company, courses, employeeCount: employeeCount ?? undefined });
        } else {
          await sendQuoteConfirmationToLead({ name, email, courses, message: message ?? undefined });
        }
        console.log("✅ Quote email sent to:", email);
      } catch (err: any) {
        console.error("❌ Quote email error:", err?.message, err?.stack);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("API Error in leads/create:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
