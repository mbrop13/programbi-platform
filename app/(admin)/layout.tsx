import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import RootShell from "@/components/shared/RootShell";
import { METADATA_BASE } from "@/lib/seo/metadata-base";

export const metadata: Metadata = {
  ...METADATA_BASE,
  title: "Admin",
  alternates: { canonical: null },
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

  return (
    <RootShell lang="es-CL">
      <AdminShell>{children}</AdminShell>
    </RootShell>
  );
}
