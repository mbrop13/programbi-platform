import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EgressClient, StreamOutput } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomName, action, streamKey, classId } = body;

    if (!roomName || !action || !classId) {
      return NextResponse.json({ error: "Parámetros roomName, action y classId son requeridos." }, { status: 400 });
    }

    if (action !== "start" && action !== "stop") {
      return NextResponse.json({ error: "La acción debe ser 'start' o 'stop'." }, { status: 400 });
    }

    // ─── 1. AUTHENTICATE USER ───
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // ─── 2. VERIFY ADMIN STATUS ───
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado. Se requiere rol de administrador." }, { status: 403 });
    }

    // ─── 3. INITIALIZE LIVEKIT EGRESS CLIENT ───
    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      console.error("LiveKit config missing for Egress Client.");
      return NextResponse.json({ error: "Configuración de servidor incompleta." }, { status: 500 });
    }

    // Clean protocol if necessary (EgressClient sometimes expects host without https://)
    const host = livekitUrl.replace(/^https?:\/\//, "");
    const egressClient = new EgressClient(`https://${host}`, apiKey, apiSecret);

    if (action === "start") {
      if (!streamKey) {
        return NextResponse.json({ error: "El streamKey de YouTube es obligatorio para iniciar." }, { status: 400 });
      }

      // Check if there is already an active egress
      const { data: currentClass } = await supabase
        .from("live_classes")
        .select("livekit_egress_id")
        .eq("id", classId)
        .single();

      if (currentClass?.livekit_egress_id) {
        return NextResponse.json({ error: "La transmisión ya está activa para esta clase." }, { status: 400 });
      }

      const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

      // Start the Room Composite Egress (retransmitting the class layout to YouTube)
      const egressInfo = await egressClient.startRoomCompositeEgress(
        roomName,
        {
          stream: new StreamOutput({
            urls: [rtmpUrl]
          })
        },
        {
          layout: "grid"
        }
      );

      const egressId = egressInfo.egressId;

      // Update database state
      const { error: dbError } = await supabase
        .from("live_classes")
        .update({
          livekit_egress_id: egressId,
          status: "active",
          started_at: new Date().toISOString()
        })
        .eq("id", classId);

      if (dbError) {
        // Attempt to clean up egress if DB update fails to avoid zombie streams
        try {
          await egressClient.stopEgress(egressId);
        } catch {}
        throw dbError;
      }

      return NextResponse.json({ success: true, egressId });
    } else {
      // action === "stop"
      const { data: currentClass, error: classError } = await supabase
        .from("live_classes")
        .select("livekit_egress_id")
        .eq("id", classId)
        .single();

      if (classError || !currentClass) {
        return NextResponse.json({ error: "Clase no encontrada." }, { status: 404 });
      }

      const egressId = currentClass.livekit_egress_id;

      if (!egressId) {
        // The class might be marked inactive but egress is already stopped
        await supabase
          .from("live_classes")
          .update({
            status: "completed",
            ended_at: new Date().toISOString()
          })
          .eq("id", classId);
        return NextResponse.json({ success: true, message: "La clase ya estaba detenida." });
      }

      try {
        await egressClient.stopEgress(egressId);
      } catch (err: any) {
        console.warn("Egress stop command failed, proceeding to clean database anyway:", err);
      }

      // Update database state
      await supabase
        .from("live_classes")
        .update({
          livekit_egress_id: null,
          status: "completed",
          ended_at: new Date().toISOString()
        })
        .eq("id", classId);

      return NextResponse.json({ success: true });
    }
  } catch (err: any) {
    console.error("Error in LiveKit egress route:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
