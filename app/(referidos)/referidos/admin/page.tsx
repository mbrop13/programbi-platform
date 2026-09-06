import { AdminQueue } from "@/components/referrals/admin/admin-queue";

export const metadata = { title: "Admin · Cola de intros", robots: { index: false, follow: false } };

export default function AdminReferralsPage() {
  return <AdminQueue />;
}
