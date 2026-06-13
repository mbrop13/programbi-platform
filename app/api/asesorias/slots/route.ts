import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start"); // YYYY-MM-DD
    const end = searchParams.get("end");     // YYYY-MM-DD

    if (!start || !end) {
      return NextResponse.json({ error: "start and end dates required" }, { status: 400 });
    }

    const adminDb = createAdminClient();
    const isAdmin = await isCurrentUserAdmin();
    
    const { data, error } = await adminDb
      .from("asesoria_slots")
      .select("slot_date, slot_time, status, user_email, flow_order")
      .gte("slot_date", start)
      .lte("slot_date", end);

    if (error) throw error;

    // Sanitize response to prevent data leaks to non-admin users
    const sanitizedSlots = (data || []).map((slot: any) => {
      if (isAdmin) return slot;
      return {
        slot_date: slot.slot_date,
        slot_time: slot.slot_time,
        status: slot.status,
      };
    });

    return NextResponse.json({ slots: sanitizedSlots });
  } catch (err: any) {
    console.error("GET /api/asesorias/slots error:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Ocurrió un error al obtener los slots." : err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { action, slot_date, slot_time } = body;
    const adminDb = createAdminClient();

    if (action === "block") {
      const { error } = await adminDb.from("asesoria_slots").insert({
        slot_date,
        slot_time,
        status: "blocked"
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    } 
    
    if (action === "release") {
      // Allow deleting blocked or booked slots
      const { error } = await adminDb.from("asesoria_slots").delete().match({
        slot_date,
        slot_time
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "block_day") {
      const { times } = body; // Array of times to block
      if (times && Array.isArray(times)) {
        const inserts = times.map((t: string) => ({ slot_date, slot_time: t, status: "blocked" }));
        const { error } = await adminDb.from("asesoria_slots").insert(inserts);
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }

    if (action === "reject_lead") {
      const { user_email, lead_id } = body;
      if (user_email) {
        await adminDb.from("asesoria_slots").delete().match({ user_email });
      }
      if (lead_id) {
        await adminDb.from("course_leads").delete().match({ id: lead_id });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/asesorias/slots error:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Ocurrió un error al procesar la acción." : err.message },
      { status: 500 }
    );
  }
}
