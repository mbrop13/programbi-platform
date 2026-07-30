import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/check-limits";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ tier: "free", role: "user" }, { status: 401 });
    }

    // getUserTier already returns "ultra" for admins
    const tier = await getUserTier(user.id);

    const serviceClient = createServiceClient();
    // Prefer ProgramBI profiles.role; fall back to Maverlang admin_users if present
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    let role: "admin" | "user" = profile?.role === "admin" ? "admin" : "user";
    if (role !== "admin") {
      const { data: adminRow } = await serviceClient
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (adminRow?.role === "admin") role = "admin";
    }

    return NextResponse.json({ tier, role });
  } catch (error) {
    return NextResponse.json({ tier: "free", role: "user" }, { status: 500 });
  }
}
