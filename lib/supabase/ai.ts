"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

export interface AiChat {
  id: string;
  title: string | null;
  model: string | null;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiChatMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  parts: unknown[];
  model: string | null;
  tokens: number | null;
  attachments: unknown[];
  created_at: string;
}

// ─── Lectura (cliente) ───

export async function getChats(): Promise<AiChat[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("ai_chats")
    .select("id, title, model, pinned, archived, created_at, updated_at")
    .eq("profile_id", user.id)
    .eq("archived", false)
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching ai_chats:", error);
    return [];
  }
  return (data ?? []) as AiChat[];
}

export async function getChatMessages(chatId: string): Promise<AiChatMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Verificar pertenencia (RLS ya protege, pero hacemos check explícito)
  const { data: chat } = await supabase
    .from("ai_chats")
    .select("id")
    .eq("id", chatId)
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!chat) return [];

  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("id, chat_id, role, parts, model, tokens, attachments, created_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("Error fetching ai_chat_messages:", error);
    return [];
  }
  return (data ?? []) as AiChatMessage[];
}

// ─── Mutaciones (cliente) ───

export async function createChat(title = "Nueva conversación"): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { data, error } = await supabase
    .from("ai_chats")
    .insert({ profile_id: user.id, title })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/comunidad", "layout");
  return data.id;
}

export async function deleteChat(chatId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase
    .from("ai_chats")
    .delete()
    .eq("id", chatId)
    .eq("profile_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/comunidad", "layout");
}

export async function renameChat(chatId: string, title: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase
    .from("ai_chats")
    .update({ title: title.substring(0, 100) })
    .eq("id", chatId)
    .eq("profile_id", user.id);
  if (error) throw new Error(error.message);
}

export async function togglePinChat(chatId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { data: chat } = await supabase
    .from("ai_chats")
    .select("pinned")
    .eq("id", chatId)
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!chat) return;

  const { error } = await supabase
    .from("ai_chats")
    .update({ pinned: !chat.pinned })
    .eq("id", chatId)
    .eq("profile_id", user.id);
  if (error) throw new Error(error.message);
}

export async function archiveChat(chatId: string, archived = true): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase
    .from("ai_chats")
    .update({ archived })
    .eq("id", chatId)
    .eq("profile_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/comunidad", "layout");
}

// ─── Persistencia (usada por la API route en onFinish) ───

export async function saveMessage(params: {
  chatId: string;
  role: "user" | "assistant";
  parts: unknown[];
  model?: string | null;
  tokens?: number | null;
  attachments?: unknown[];
}): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Verificar pertenencia
  const { data: chat } = await supabase
    .from("ai_chats")
    .select("id")
    .eq("id", params.chatId)
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!chat) return;

  const { error } = await supabase.from("ai_chat_messages").insert({
    chat_id: params.chatId,
    role: params.role,
    parts: params.parts,
    model: params.model ?? null,
    tokens: params.tokens ?? null,
    attachments: params.attachments ?? [],
  });

  if (error) {
    console.error("Error saving ai_chat_message:", error);
    return;
  }

  // touch updated_at (lo hace el trigger, pero forzamos un update para garantizar orden)
  await supabase
    .from("ai_chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", params.chatId);
}

/**
 * Auto-título: si el chat sigue con título por defecto, lo actualiza
 * con un resumen del primer mensaje del usuario.
 */
export async function maybeAutoTitleChat(chatId: string, firstUserText: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: chat } = await supabase
    .from("ai_chats")
    .select("title")
    .eq("id", chatId)
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!chat) return;

  // Solo renombra si el título sigue siendo el por defecto
  if (chat.title && chat.title !== "Nueva conversación") return;

  const title = firstUserText.replace(/\s+/g, " ").trim().slice(0, 60) || "Nueva conversación";
  await supabase.from("ai_chats").update({ title }).eq("id", chatId).eq("profile_id", user.id);
}
