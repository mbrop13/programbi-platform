import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false, authenticated: false }, { status: 200 });
    }

    // Use admin client to bypass RLS — guarantees reliable role detection
    const adminDb = createAdminClient();

    // 1. Check profiles table
    const { data: profile } = await adminDb
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.json({
        isAdmin: true,
        authenticated: true,
        displayName: profile.full_name || user.email?.split("@")[0] || "Admin"
      });
    }

    // 2. Check community_members table (secondary admin source)
    const { data: communityAdmin } = await adminDb
      .from("community_members")
      .select("role")
      .eq("profile_id", user.id)
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (communityAdmin) {
      return NextResponse.json({
        isAdmin: true,
        authenticated: true,
        displayName: profile?.full_name || user.email?.split("@")[0] || "Admin"
      });
    }

    return NextResponse.json({
      isAdmin: false,
      authenticated: true,
      displayName: profile?.full_name || user.email?.split("@")[0] || "Estudiante"
    });
  } catch (err: any) {
    console.error("Error in check-admin endpoint:", err);
    return NextResponse.json({ isAdmin: false, authenticated: false, error: err.message }, { status: 500 });
  }
}
