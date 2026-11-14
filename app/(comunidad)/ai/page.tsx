import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import { AiChatShell } from "@/components/ai-chat-shell";

export default async function AiPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login?next=/ai");
  }

  return <AiChatShell />;
}
