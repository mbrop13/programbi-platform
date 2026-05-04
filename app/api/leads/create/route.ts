import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendQuoteConfirmationToLead,
  sendEnterpriseQuoteToLead,
  sendNewLeadNotificationToAdmin,
} from "@/lib/email/mailersend";

// ─── Anti-Bot Helpers ───

/** Honeypot: if a hidden field is filled, it's a bot */
function isHoneypotFilled(body: any): boolean {
  return !!(body._website || body._company_url || body._fax);
}

/** Timestamp: reject submissions faster than MIN_SECONDS */
function isTooFast(body: any, minSeconds = 3): boolean {
  if (!body._t) return false; // no timestamp sent — skip check (backwards compat)
  const elapsed = (Date.now() - Number(body._t)) / 1000;
  return elapsed < minSeconds;
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
    const body = await req.json();

    // ─── Anti-Bot Checks (silent reject → 200 to avoid bot retries) ───
    if (isHoneypotFilled(body)) {
      console.log("🤖 Bot blocked (honeypot):", body.email);
      return NextResponse.json({ success: true }); // fake success
    }
    if (isTooFast(body)) {
      console.log("🤖 Bot blocked (too fast):", body.email);
      return NextResponse.json({ success: true });
    }

    const whatsappClean = body.whatsapp || body.phone;
    const { name, email, message, selectedCourses, sourceCourse, leadType, company, position, employeeCount } = body;
    const whatsapp = whatsappClean;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
    }

    if (looksLikeSpam(name, email, message)) {
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

    // If enterprise lead, append company info to message
    if (leadType === "enterprise" && (company || position || employeeCount)) {
      const extraInfo = [
        company ? `Empresa: ${company}` : null,
        position ? `Cargo: ${position}` : null,
        employeeCount ? `Empleados a capacitar: ${employeeCount}` : null,
      ].filter(Boolean).join(" | ");
      insertData.message = extraInfo + (message ? ` — ${message}` : "");
    }

    const { error } = await adminDb.from("course_leads").insert(insertData);

    if (error) {
      console.error("Error inserting lead:", error);
      return NextResponse.json({ error: "Error al guardar el contacto" }, { status: 500 });
    }

    // ─── Disparar emails ───
    const courses = selectedCourses || (sourceCourse ? [sourceCourse] : []);

    // 1. Notificación interna al equipo de ventas
    try {
      await sendNewLeadNotificationToAdmin({
        name, email, phone: whatsapp, courses, message,
        leadType, company, position, employeeCount,
      });
      console.log("✅ Admin notification sent");
    } catch (err: any) {
      console.error("❌ Admin email error:", err?.message, err?.stack);
    }

    // 2. Confirmación al lead (diferente para empresa vs. individual)
    try {
      if ((leadType === "empresa" || leadType === "enterprise") && company) {
        await sendEnterpriseQuoteToLead({ name, email, company, courses, employeeCount });
      } else {
        await sendQuoteConfirmationToLead({ name, email, courses, message });
      }
      console.log("✅ Quote email sent to:", email);
    } catch (err: any) {
      console.error("❌ Quote email error:", err?.message, err?.stack);
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("API Error in leads/create:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
