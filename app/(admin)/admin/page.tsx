import { redirect } from "next/navigation";
import AdminOverview from "@/components/comunidad/tabs/admin/AdminOverview";
import { ADMIN_TAB_REDIRECTS } from "@/components/admin/nav";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  if (tab && ADMIN_TAB_REDIRECTS[tab] && ADMIN_TAB_REDIRECTS[tab] !== "/admin") {
    redirect(ADMIN_TAB_REDIRECTS[tab]);
  }

  return <AdminOverview />;
}
