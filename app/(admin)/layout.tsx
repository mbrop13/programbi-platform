import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check admin role
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminDb = createAdminClient();
  const { data: profile } = await adminDb.from("profiles").select("role").eq("id", user.id).single();
  
  const isAdmin = profile?.role === "admin" || user.email === "manuel@programbi.com";
  if (!isAdmin) {
    redirect("/comunidad/inicio");
  }

  return <>{children}</>;
}
