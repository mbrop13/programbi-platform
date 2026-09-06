import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureReferrer } from "@/lib/referrals/auth";
import { ReferrerShell } from "@/components/referrals/app/referrer-shell";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ReferrerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/referidos/login?next=/referidos/app");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  const referrer = await ensureReferrer({
    userId: user.id,
    email: user.email || profile?.email,
    name: profile?.full_name || user.email?.split("@")[0],
    phone: profile?.phone,
  });

  return (
    <ReferrerShell referrer={referrer} email={user.email || referrer.email}>
      {children}
    </ReferrerShell>
  );
}
