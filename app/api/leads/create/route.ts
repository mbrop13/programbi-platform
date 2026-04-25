import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendQuoteConfirmationToLead,
  sendEnterpriseQuoteToLead,
  sendNewLeadNotificationToAdmin,
} from "@/lib/email/mailersend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const whatsappClean = body.whatsapp || body.phone;
    const { name, email, message, selectedCourses, sourceCourse, leadType, company, position, employeeCount } = body;
    const whatsapp = whatsappClean;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
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
