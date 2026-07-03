import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { getModel } from "@/lib/ai/models";
import { getLanguageModel } from "@/lib/ai/provider";
import { loadChatContext, buildSystemPrompt } from "@/lib/ai/system-prompt";
import { webSearchTool } from "@/lib/ai/tools";
import { saveMessage, maybeAutoTitleChat } from "@/lib/supabase/ai";

export const maxDuration = 60;

const BodySchema = z.object({
  chatId: z.string().uuid().optional().nullable(),
  model: z.string().optional(),
  webSearch: z.boolean().optional(),
  messages: z.array(z.any()).min(1),
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  // ─── 1. Auth ───
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "No autorizado" }, 401);
  }

  // ─── 2. Rate limit (20 mensajes/min por usuario) ───
  const rl = isRateLimited(user.id, "ai-chat", 20, 60_000);
  if (rl.limited) {
    return json(
      { error: "Has enviado demasiados mensajes. Espera un momento e inténtalo de nuevo." },
      429
    );
  }

  // ─── 3. Parse + validate ───
  let parsed;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch {
    return json({ error: "Solicitud inválida." }, 400);
  }
  const { chatId, model: modelId, webSearch: wantWebSearch, messages } = parsed;
  const model = getModel(modelId);

  // ─── 4. Contexto + gate de premium ───
  const ctx = await loadChatContext(supabase, user.id);
  const isPremium = !!ctx.plan || ctx.role === "admin";

  // Safety net: usuarios sin plan solo pueden usar el modelo gratuito
  if (model.premium && !isPremium) {
    return json(
      { error: "Este modelo requiere un plan de la comunidad. Usa Llama 3 8B (gratis) o suscríbete." },
      403
    );
  }

  // ─── 5. System prompt personalizado ───
  const system = buildSystemPrompt(ctx);

  // ─── 5b. Resolver chatId: si no viene (chat nuevo), crear la fila ───
  const uiMessages = messages as UIMessage[];
  const lastUserMsg = [...uiMessages].reverse().find((m) => m.role === "user");
  const firstUserText = ((lastUserMsg?.parts ?? []) as { type: string; text?: string }[])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  let effectiveChatId: string | null = chatId ?? null;
  if (!effectiveChatId) {
    const title = firstUserText.slice(0, 60) || "Nueva conversación";
    const { data: newChat, error: createErr } = await supabase
      .from("ai_chats")
      .insert({ profile_id: user.id, title })
      .select("id")
      .single();
    if (createErr) {
      console.error("create chat error:", createErr);
    } else {
      effectiveChatId = newChat.id;
    }
  }

  // ─── 6. Persistir mensaje del usuario (pre-stream) + auto-título ───
  if (effectiveChatId && lastUserMsg) {
    saveMessage({
      chatId: effectiveChatId,
      role: "user",
      parts: lastUserMsg.parts ?? [],
      model: model.id,
      attachments: [],
    }).catch((e) => console.error("saveMessage(user):", e));
    // Auto-título solo si el chat ya existía (no recién creado)
    if (chatId && firstUserText) {
      maybeAutoTitleChat(chatId, firstUserText).catch((e) =>
        console.error("maybeAutoTitleChat:", e)
      );
    }
  }

  // ─── 7. Convertir UIMessage[] → ModelMessage[] ───
  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(messages as UIMessage[]);
  } catch (e) {
    console.error("convertToModelMessages error:", e);
    return json({ error: "No se pudo procesar el mensaje." }, 400);
  }

  // ─── 8. Tools (búsqueda web solo si está habilitada + premium + API key) ───
  const useWebSearch =
    !!wantWebSearch && isPremium && !!process.env.TAVILY_API_KEY;
  const tools = useWebSearch ? { webSearch: webSearchTool } : undefined;

  // ─── 9. streamText ───
  const result = streamText({
    model: getLanguageModel(model),
    system,
    messages: modelMessages,
    tools,
    stopWhen: stepCountIs(useWebSearch ? 4 : 1),
    maxOutputTokens: 4096,
    temperature: 0.7,
    onError: ({ error }) => {
      console.error("streamText error:", error);
    },
  });

  // ─── 10. Respuesta stream + persistencia del asistente en onFinish ───
  // messageMetadata envía el chatId (para que el cliente adopte chats nuevos)
  // y el nombre del modelo para mostrarlo en la UI.
  return result.toUIMessageStreamResponse({
    generateMessageId: () => crypto.randomUUID(),
    sendReasoning: true,
    messageMetadata: () => ({
      chatId: effectiveChatId,
      model: { id: model.id, name: model.label },
    }),
    onFinish: async ({ responseMessage }) => {
      if (!effectiveChatId) return;
      // Filtrar partes que no queremos persistir (ej. step-start)
      const persistableParts = (responseMessage.parts ?? []).filter(
        (p) => p.type !== "step-start"
      );
      await saveMessage({
        chatId: effectiveChatId,
        role: "assistant",
        parts: persistableParts,
        model: model.id,
        attachments: [],
      }).catch((e) => console.error("saveMessage(assistant):", e));
    },
  });
}
