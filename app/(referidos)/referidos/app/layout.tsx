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
  if (!user) redirect("/login?next=/referidos/app");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  let referrer = null;
  let setupPending = false;
  try {
    referrer = await ensureReferrer({
      userId: user.id,
      email: user.email || profile?.email,
      name: profile?.full_name || user.email?.split("@")[0],
      phone: profile?.phone,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    setupPending =
      msg.includes("migración") || msg.includes("does not exist") || msg.includes("schema cache");
    console.error("ensureReferrer:", err);
  }

  return (
    <ReferrerShell
      referrer={referrer}
      email={user.email || referrer?.email || ""}
      setupPending={setupPending}
    >
      {children}
    </ReferrerShell>
  );
}
