import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomName = searchParams.get("roomName");

    if (!roomName) {
      return NextResponse.json({ error: "El nombre de la sala (roomName) es requerido" }, { status: 400 });
    }

    // ─── 1. AUTHENTICATE USER ───
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // ─── 2. VERIFY THE ROOM EXISTS AND IS ACTIVE ───
    const adminDb = createAdminClient();

    const { data: liveClass } = await adminDb
      .from("live_classes")
      .select("id, room_name, status")
      .eq("room_name", roomName)
      .in("status", ["active", "scheduled"])
      .maybeSingle();

    if (!liveClass) {
      return NextResponse.json({ error: "La sala no existe o la clase no está activa/programada." }, { status: 404 });
    }

    // ─── 3. FETCH PROFILE (BYPASS RLS) TO CHECK ROLE ───
    const { data: profile } = await adminDb
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    // Secondary admin check via community_members
    let isHost = profile?.role === "admin";
    if (!isHost) {
      const { data: communityAdmin } = await adminDb
        .from("community_members")
        .select("role")
        .eq("profile_id", user.id)
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();
      if (communityAdmin) isHost = true;
    }

    const displayName = profile?.full_name || user.email?.split("@")[0] || "Estudiante";

    // ─── 4. GENERATE LIVEKIT TOKEN ───
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("LiveKit API keys are missing in environment variables.");
      return NextResponse.json({ error: "Configuración de servidor incompleta." }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: displayName,
      metadata: JSON.stringify({
        role: isHost ? "admin" : "student",
        email: user.email
      })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      // Hosts get full publish; students only data (chat) + audio (mic)
      canPublish: isHost,
      canPublishData: true, // Everyone can use chat
      canSubscribe: true,
      roomAdmin: isHost // Admin powers (mute others, remove, etc.) only for hosts
    });

    const token = await at.toJwt();

    return NextResponse.json({ token, isHost, displayName });
  } catch (err: any) {
    console.error("Error generating LiveKit token:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
