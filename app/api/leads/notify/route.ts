import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNotifyMeConfirmation } from "@/lib/email/mailersend";

/**
 * POST /api/leads/notify
 * Registers interest in a course's next available date.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, courseSlug, levelName, courseName } = body;

    if (!email || !courseSlug) {
      return NextResponse.json({ error: "Email y curso requeridos" }, { status: 400 });
    }

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
      levelName,
    }).catch(err => console.error("MailerSend notify email error:", err));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in leads/notify:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
