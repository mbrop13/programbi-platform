"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, MessageSquarePlus, PanelLeft, PanelLeftClose } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatList } from "./ChatList";
import { ComposerInput, type Attachment } from "./ComposerInput";
import { Landing } from "./Landing";
import { ChatError } from "./ChatError";
import { CanvasProvider, useCanvas } from "./canvas/CanvasStore";
import { CanvasPanel } from "./canvas/CanvasPanel";
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
import { cn } from "@/lib/utils";
import { FAVICON_URL, MODEL_KEY } from "./constants";

interface ChatShellProps {
  isRestricted?: boolean;
  userName?: string;
  avatarUrl?: string | null;
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
}

export default function ChatShell({
  isRestricted = false,
  userName,
  avatarUrl,
  subscriptionPlan,
  isAdmin = false,
}: ChatShellProps) {
  const isPremium = !isRestricted;

  // Vista restringida (freemium upsell) — no necesita Canvas
  if (isRestricted) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-surface-1 to-brand-blue-light/30 p-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface-0 p-8 text-center shadow-lift">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 shadow-glow-brand">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Mentor IA Premium
          </h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Accede a tu mentor IA con múltiples modelos, razonamiento paso a paso
            y dictado por voz. Resuelve tus dudas de Data Science, Python, SQL y Power BI.
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

  return (
    <CanvasProvider>
      <ChatShellInner
        isPremium={isPremium}
        userName={userName}
        avatarUrl={avatarUrl ?? null}
        subscriptionPlan={subscriptionPlan}
        isAdmin={isAdmin}
      />
    </CanvasProvider>
  );
}

function ChatShellInner({
  isPremium,
  userName,
  avatarUrl,
  subscriptionPlan,
  isAdmin = false,
}: {
  isPremium: boolean;
  userName?: string;
  avatarUrl: string | null;
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
}) {
  const canvas = useCanvas();

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
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Split workspace
  const [chatWidthPct, setChatWidthPct] = useState(38);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Refs para que prepareSendMessagesRequest lea valores actuales al enviar
  const chatIdRef = useRef<string | null>(null);
  const modelRef = useRef(selectedModel);

  useEffect(() => { chatIdRef.current = activeChatId; }, [activeChatId]);
  useEffect(() => { modelRef.current = selectedModel; localStorage.setItem(MODEL_KEY, selectedModel); }, [selectedModel]);

  // Detectar móvil para el sheet vs split
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  // ─── Resizer del split (desktop) ───
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const onMove = (ev: MouseEvent) => {
      const row = workspaceRef.current;
      if (!row) return;
      const rect = row.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setChatWidthPct(Math.min(55, Math.max(20, pct)));
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const selectedModelMeta = getModel(selectedModel);
  const showLanding = messages.length === 0 && !loadingMessages;
  const canvasOpenDesktop = canvas.isOpen && !isMobile;
  const canvasOpenMobile = canvas.isOpen && isMobile;

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

      {/* Sidebar de historial: se acopla a la izquierda (rail) al cerrar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 240 : isMobile ? 0 : 64,
          opacity: sidebarOpen || !isMobile ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute z-50 h-full shrink-0 overflow-hidden border-r border-border md:relative"
      >
        {sidebarOpen ? (
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
            userName={userName}
            avatarUrl={avatarUrl}
            subscriptionPlan={subscriptionPlan}
            isAdmin={isAdmin}
            onClose={() => setSidebarOpen(false)}
          />
        ) : (
          /* Rail colapsado (solo desktop; en móvil el ancho es 0) */
          <div className="hidden h-full w-16 flex-col items-center gap-3 py-3 md:flex">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              title="Abrir historial"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-0 text-text-muted shadow-premium transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
            >
              <PanelLeft className="h-5 w-5" />
            </motion.button>
            <button
              onClick={newChat}
              title="Nuevo chat"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-0 text-brand-blue shadow-premium transition-colors hover:bg-surface-2"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main (sin barra superior) */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Toggle flotante para abrir/cerrar el sidebar */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-0/80 text-text-muted shadow-premium backdrop-blur-md transition-colors hover:bg-surface-2 hover:text-text-primary"
          title={sidebarOpen ? "Ocultar historial" : "Mostrar historial"}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </button>

        {/* Workspace: chat (resizable) + canvas (split / sheet) */}
        <div ref={workspaceRef} className="flex min-h-0 flex-1">
          {/* Panel de chat */}
          <div
            className={cn(
              "relative flex min-w-0 flex-col",
              canvasOpenDesktop ? "shrink-0" : "flex-1"
            )}
            style={canvasOpenDesktop ? { width: `${chatWidthPct}%` } : undefined}
          >
            {loadingMessages ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-3 border-t-brand-blue" />
              </div>
            ) : showLanding ? (
              <Landing onSuggestionClick={(prompt) => submit(prompt)}>
                <ComposerInput
                  value={input}
                  onChange={setInput}
                  onSubmit={() => submit()}
                  onStop={stop}
                  isStreaming={isStreaming}
                  isPremium={isPremium}
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                  modelId={selectedModel}
                  onSelectModel={setSelectedModel}
                />
              </Landing>
            ) : (
              <>
                <ChatList
                  messages={messages}
                  status={status}
                  modelName={selectedModelMeta.label}
                  onRegenerate={() => regenerate()}
                />
                {/* Composer flotante: se sobrepone sobre el chat */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-surface-1 via-surface-1/95 to-transparent px-3 pb-3 pt-12 sm:px-4 sm:pb-4">
                  <div className="pointer-events-auto mx-auto w-full max-w-3xl">
                    {errorMsg && (
                      <div className="mb-2">
                        <ChatError
                          message={errorMsg}
                          onRetry={() => { setErrorMsg(null); regenerate(); }}
                          onDismiss={() => setErrorMsg(null)}
                        />
                      </div>
                    )}
                    <ComposerInput
                      value={input}
                      onChange={setInput}
                      onSubmit={() => submit()}
                      onStop={stop}
                      isStreaming={isStreaming}
                      isPremium={isPremium}
                      attachments={attachments}
                      onAttachmentsChange={setAttachments}
                      modelId={selectedModel}
                      onSelectModel={setSelectedModel}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Manija divisora + Canvas (desktop) */}
          {canvasOpenDesktop && (
            <>
              <div
                onMouseDown={startResize}
                className={cn(
                  "canvas-resizer-handle hidden w-3 shrink-0 md:flex",
                  isDragging && "is-dragging"
                )}
              />
              <div className="hidden min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface-0 shadow-float md:mr-8 md:mt-8 md:mb-4 md:flex">
                <CanvasPanel key={canvas.activeFile?.id ?? "empty"} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Canvas: bottom sheet (móvil) */}
      <AnimatePresence>
        {canvasOpenMobile && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[94dvh] flex-col overflow-hidden rounded-t-[1.5rem] border-t border-border bg-surface-0 shadow-lift md:hidden"
          >
            {/* Grab handle */}
            <div className="flex shrink-0 justify-center py-2">
              <div className="h-1.5 w-10 rounded-full bg-surface-3" />
            </div>
            <div className="min-h-0 flex-1">
              <CanvasPanel key={canvas.activeFile?.id ?? "empty"} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
