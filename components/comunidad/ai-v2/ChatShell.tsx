"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, PanelLeft, PanelLeftClose, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatList } from "./ChatList";
import { ComposerInput, type Attachment } from "./ComposerInput";
import { ModelBar } from "./ModelBar";
import { Landing } from "./Landing";
import { ChatError } from "./ChatError";
import { getModel, DEFAULT_MODEL_ID } from "@/lib/ai/models";
import {
  getChats,
  getChatMessages,
  deleteChat,
  renameChat,
  togglePinChat,
  archiveChat,
  type AiChat,
} from "@/lib/supabase/ai";

interface ChatShellProps {
  isRestricted?: boolean;
  userName?: string;
}

const MODEL_KEY = "programbi_chat_model";

export default function ChatShell({ isRestricted = false, userName }: ChatShellProps) {
  const isPremium = !isRestricted;

  // ─── Estado ───
  const [chats, setChats] = useState<AiChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL_ID;
    }
    return DEFAULT_MODEL_ID;
  });
  const [webSearch, setWebSearch] = useState(false);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs para que prepareSendMessagesRequest lea valores actuales al enviar
  const chatIdRef = useRef<string | null>(null);
  const modelRef = useRef(selectedModel);
  const webSearchRef = useRef(webSearch);

  useEffect(() => { chatIdRef.current = activeChatId; }, [activeChatId]);
  useEffect(() => { modelRef.current = selectedModel; localStorage.setItem(MODEL_KEY, selectedModel); }, [selectedModel]);
  useEffect(() => { webSearchRef.current = webSearch; }, [webSearch]);

  // ─── Transport estable (lee de refs) ───
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            chatId: chatIdRef.current,
            model: modelRef.current,
            webSearch: webSearchRef.current,
          },
        }),
      }),
    []
  );

  const chat = useChat({
    id: "programbi-chat",
    transport,
    onError: (err) => {
      setErrorMsg(err.message || "Ocurrió un error.");
    },
    onFinish: ({ message }) => {
      // Adoptar chat nuevo si el servidor lo creó
      const meta = (message as { metadata?: { chatId?: string } }).metadata;
      if (meta?.chatId && !chatIdRef.current) {
        setActiveChatId(meta.chatId);
      }
      refreshChats();
    },
  });

  const { messages, status, sendMessage, regenerate, stop, setMessages } = chat;
  const isStreaming = status === "streaming" || status === "submitted";

  // ─── Carga de lista de chats ───
  const refreshChats = useCallback(async () => {
    try {
      const list = await getChats();
      setChats(list);
    } catch (e) {
      console.error("refreshChats:", e);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    refreshChats();
    // Cerrar sidebar en móvil al iniciar
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [refreshChats]);

  // Sync cross-tab
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bc = new BroadcastChannel("ai-chats");
    bc.onmessage = () => refreshChats();
    return () => bc.close();
  }, [refreshChats]);

  // ─── Selección / carga de un chat ───
  const selectChat = useCallback(
    async (id: string) => {
      setActiveChatId(id);
      setMessages([]);
      setInput("");
      setAttachments([]);
      setErrorMsg(null);
      setLoadingMessages(true);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
      try {
        const msgs = await getChatMessages(id);
        setMessages(
          msgs.map((m) => ({
            id: m.id,
            role: m.role,
            parts: m.parts ?? [],
          })) as UIMessage[]
        );
      } catch (e) {
        console.error("load messages:", e);
        setErrorMsg("No se pudieron cargar los mensajes.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [setMessages]
  );

  const newChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setAttachments([]);
    setErrorMsg(null);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setMessages]);

  // ─── Mutaciones del sidebar ───
  const handleDelete = useCallback(
    async (id: string) => {
      const prev = chats;
      setChats((c) => c.filter((x) => x.id !== id));
      if (activeChatId === id) newChat();
      try {
        await deleteChat(id);
      } catch (e) {
        console.error(e);
        setChats(prev);
      }
      refreshChats();
    },
    [chats, activeChatId, newChat, refreshChats]
  );

  const handleRename = useCallback(
    async (id: string, title: string) => {
      setChats((c) => c.map((x) => (x.id === id ? { ...x, title } : x)));
      try {
        await renameChat(id, title);
      } catch (e) {
        console.error(e);
        refreshChats();
      }
    },
    [chats, refreshChats]
  );

  const handlePin = useCallback(
    async (id: string) => {
      setChats((c) => c.map((x) => (x.id === id ? { ...x, pinned: !x.pinned } : x)));
      try {
        await togglePinChat(id);
      } catch (e) {
        console.error(e);
        refreshChats();
      }
    },
    [chats, refreshChats]
  );

  const handleArchive = useCallback(
    async (id: string) => {
      setChats((c) => c.filter((x) => x.id !== id));
      if (activeChatId === id) newChat();
      try {
        await archiveChat(id, true);
      } catch (e) {
        console.error(e);
        refreshChats();
      }
    },
    [chats, activeChatId, newChat, refreshChats]
  );

  // ─── Envío ───
  const submit = useCallback(
    (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isStreaming) return;
      setErrorMsg(null);

      // Imágenes → file parts para modelos vision
      const files = attachments
        .filter((a) => a.isImage && a.url)
        .map((a) => ({
          type: "file" as const,
          mediaType: a.mediaType,
          url: a.url,
          filename: a.name,
        }));

      // Archivos textuales → inlinear su texto en el prompt
      const textAtts = attachments.filter((a) => !a.isImage && a.text);
      let fullText = text;
      if (textAtts.length > 0) {
        fullText +=
          "\n\n" +
          textAtts
            .map((a) => `--- ${a.name} ---\n${a.text}`)
            .join("\n\n");
      }

      sendMessage({
        text: fullText,
        files: files.length > 0 ? files : undefined,
      });
      setInput("");
      setAttachments([]);
    },
    [input, attachments, isStreaming, sendMessage]
  );

  // ─── Vista restringida (freemium upsell) ───
  if (isRestricted) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-surface-1 to-brand-blue-light/30 p-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface-0 p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 shadow-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Mentor IA Premium
          </h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Accede a tu mentor IA con múltiples modelos (Llama, Gemini, GPT-4o y
            Claude), razonamiento paso a paso, búsqueda web y dictado por voz.
            Resuelve tus dudas de Data Science, Python, SQL y Power BI.
          </p>
          <Link
            href="/comunidad/planes"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-blue px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark"
          >
            Ver Planes
          </Link>
        </div>
      </div>
    );
  }

  const selectedModelMeta = getModel(selectedModel);
  const showLanding = messages.length === 0 && !loadingMessages;

  return (
    <div className="flex h-[100dvh] flex-1 overflow-hidden bg-surface-1">
      {/* Backdrop móvil */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar de historial */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute z-50 h-full shrink-0 overflow-hidden border-r border-border md:relative"
          >
            <ConversationSidebar
              chats={chats}
              activeChatId={activeChatId}
              loading={loadingChats}
              onSelect={selectChat}
              onNew={newChat}
              onDelete={handleDelete}
              onRename={handleRename}
              onPin={handlePin}
              onArchive={handleArchive}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface-0/80 px-3 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
            title={sidebarOpen ? "Ocultar historial" : "Mostrar historial"}
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-purple" />
            <h1 className="font-semibold text-text-primary">Mentor IA</h1>
          </div>
          <div className="ml-auto">
            <ModelBar
              selectedId={selectedModel}
              onSelect={setSelectedModel}
              isPremium={isPremium}
            />
          </div>
        </header>

        {/* Cuerpo */}
        {loadingMessages ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-3 border-t-brand-blue" />
          </div>
        ) : showLanding ? (
          <div className="flex flex-1 flex-col">
            <Landing userName={userName} onSuggestion={(t) => submit(t)} />
            <div className="border-t border-border bg-surface-0/60 p-3 sm:p-4">
              <ComposerInput
                value={input}
                onChange={setInput}
                onSubmit={() => submit()}
                onStop={stop}
                isStreaming={isStreaming}
                isPremium={isPremium}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                webSearch={webSearch}
                onWebSearchChange={setWebSearch}
                voiceActive={voiceActive}
                onToggleVoice={() => setVoiceActive((v) => !v)}
                voiceEnabled={false}
              />
            </div>
          </div>
        ) : (
          <>
            <ChatList
              messages={messages}
              status={status}
              modelName={selectedModelMeta.label}
              onRegenerate={() => regenerate()}
            />
            {errorMsg && (
              <div className="pb-2">
                <ChatError
                  message={errorMsg}
                  onRetry={() => { setErrorMsg(null); regenerate(); }}
                  onDismiss={() => setErrorMsg(null)}
                />
              </div>
            )}
            <div className="border-t border-border bg-surface-0/60 p-3 sm:p-4">
              <ComposerInput
                value={input}
                onChange={setInput}
                onSubmit={() => submit()}
                onStop={stop}
                isStreaming={isStreaming}
                isPremium={isPremium}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                webSearch={webSearch}
                onWebSearchChange={setWebSearch}
                voiceActive={voiceActive}
                onToggleVoice={() => setVoiceActive((v) => !v)}
                voiceEnabled={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
