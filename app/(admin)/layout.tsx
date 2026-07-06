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
  
  // Authorization is derived exclusively from the role stored in the database.
  // Email-based bypasses were removed (OWASP ASVS L3 audit, CR-2).
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) {
    redirect("/comunidad/inicio");
  }

  return <>{children}</>;
}
