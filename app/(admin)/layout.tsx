import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | ProgramBI",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminDb = createAdminClient();
  const { data: profile } = await adminDb.from("profiles").select("role").eq("id", user.id).single();

  const isAdmin = profile?.role === "admin";
  if (!isAdmin) {
    redirect("/comunidad/inicio");
  }

  return <AdminShell>{children}</AdminShell>;
}
