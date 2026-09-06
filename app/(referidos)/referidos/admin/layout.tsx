import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isReferralAdmin } from "@/lib/referrals/auth";
import { AdminShell } from "@/components/referrals/admin/admin-shell";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ReferralAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/referidos/login?next=/referidos/admin");
  const admin = await isReferralAdmin(user.id);
  if (!admin) redirect("/referidos/app");

  return <AdminShell email={user.email || ""}>{children}</AdminShell>;
}
