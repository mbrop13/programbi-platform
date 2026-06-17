import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    // ─── 2. FETCH PROFILE TO CHECK ROLE ───
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Perfil de usuario no encontrado" }, { status: 404 });
    }

    const isHost = profile.role === "admin";
    const displayName = profile.full_name || user.email?.split("@")[0] || "Estudiante";

    // ─── 3. GENERATE LIVEKIT TOKEN ───
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
        role: profile.role,
        email: user.email
      })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true, // Allow students to unmute/participate if allowed client-side
      canPublishData: true, // Allow chat usage
      canSubscribe: true,
      roomAdmin: isHost // Grants admin power only to hosts
    });

    const token = await at.toJwt();

    return NextResponse.json({ token, isHost, displayName });
  } catch (err: any) {
    console.error("Error generating LiveKit token:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
