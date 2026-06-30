import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { getFeedbackAnalytics } from "@/lib/supabase/feedback";
import FeedbackAdminClient from "./FeedbackAdminClient";

export const metadata = {
  title: "Encuesta de satisfacción - Admin | ProgramBI",
};

export default async function FeedbackAdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect("/comunidad/inicio");
  }

  const analytics = await getFeedbackAnalytics();

  return <FeedbackAdminClient analytics={analytics} />;
}
