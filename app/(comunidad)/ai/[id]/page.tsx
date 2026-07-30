import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import { AiChatShell } from "@/components/ai-chat-shell";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Deep-link to a chat id. ChatLanding + store load history from the URL / store;
 * Maverlang also uses /ai/chat/[id] — we keep ProgramBI /ai/[id] and let the client hydrate.
 */
export default async function AiChatPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    const { id } = await params;
    redirect(`/auth/login?next=/ai/${id}`);
  }

  // Ensure params are resolved (Next 15+) without blocking shell
  await params;

  return <AiChatShell />;
}
