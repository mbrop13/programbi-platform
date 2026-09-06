import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth/safe-next";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const dest = safeNextPath(next, "/referidos/app");
  redirect(`/login?next=${encodeURIComponent(dest)}`);
}
