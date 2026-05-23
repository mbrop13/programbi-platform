import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import ChatbotAdminClient from "./ChatbotAdminClient";
import { getChatbotConversations, getChatbotStats } from "@/lib/supabase/comunidad-ai";

export const metadata = {
  title: "Chatbot IA - Admin | ProgramBI",
};

export default async function ChatbotAdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect("/comunidad/inicio");
  }

  // Obtener estadísticas iniciales y la primera página de conversaciones
  const stats = await getChatbotStats();
  const initialData = await getChatbotConversations({ page: 1, limit: 20 });

  return (
    <ChatbotAdminClient 
      initialStats={stats}
      initialConversations={initialData.conversations}
      initialTotal={initialData.total}
    />
  );
}
