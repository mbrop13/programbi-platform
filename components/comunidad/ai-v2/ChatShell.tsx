"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatList } from "./ChatList";
import { ComposerInput, type Attachment } from "./ComposerInput";
import { Landing } from "./Landing";
import { ChatError } from "./ChatError";
import { CanvasProvider, useCanvas } from "./canvas/CanvasStore";
import { CanvasPanel } from "./canvas/CanvasPanel";
import SubscriptionModal from "../SubscriptionModal";
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
import QuotaIndicator from "./QuotaIndicator";

interface ChatShellProps {
  isRestricted?: boolean;
  userName?: string;
  avatarUrl?: string | null;
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
  initialChatId?: string | null;
  isGuest?: boolean;
}

export default function ChatShell({
  isRestricted = false,
  userName,
  avatarUrl,
  subscriptionPlan,
  isAdmin = false,
  initialChatId = null,
  isGuest = false,
}: ChatShellProps) {
  const isPremium = !isRestricted && !isGuest;

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
        initialChatId={initialChatId}
        isGuest={isGuest}
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
  initialChatId = null,
  isGuest = false,
}: {
  isPremium: boolean;
  userName?: string;
  avatarUrl: string | null;
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
  initialChatId?: string | null;
  isGuest?: boolean;
}) {
  const canvas = useCanvas();
  const router = useRouter();

  const [canvasModeActive, setCanvasModeActive] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ─── Estado ───
  const [chats, setChats] = useState<AiChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
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
  const [quotaRefreshKey, setQuotaRefreshKey] = useState(0);

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
      // Si el error es de cuota (429), ofrecer upgrade
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("límite de tokens") || msg.includes("quota")) {
        setShowUpgradeModal(true);
      }
    },
    onFinish: ({ message }) => {
      // Adoptar chat nuevo si el servidor lo creó
      const meta = (message as { metadata?: { chatId?: string } }).metadata;
      if (meta?.chatId && !chatIdRef.current) {
        setActiveChatId(meta.chatId);
        router.push(`/ai/${meta.chatId}`);
      }
      refreshChats();
      // Refrescar el indicador de cuota tras cada respuesta
      setQuotaRefreshKey((k) => k + 1);
    },
  });

  const { messages, status, sendMessage, regenerate, stop, setMessages } = chat;
  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-open canvas when AI starts generating code block
  useEffect(() => {
    if (!isStreaming) return;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;

    // Extract text from parts
    const textChunks: string[] = [];
    for (const part of (lastMsg as any).parts ?? []) {
      if (part.type === "text") {
        textChunks.push(part.text ?? "");
      }
    }
    const content = textChunks.join("\n\n");

    // Matches markdown code block syntax with any language
    const match = content.match(/```([a-zA-Z0-9_-]+)\n([\s\S]*?)(?:```|$)/);

    if (match) {
      const lang = match[1];
      const code = match[2];

      if (!canvas.isOpen || canvas.activeFile?.id !== "canvas-auto-stream" || canvas.activeFile?.code !== code) {
        canvas.openCanvas({
          id: "canvas-auto-stream",
          title: "Código de la IA",
          code: code,
          language: lang,
        });
      }
    }
  }, [messages, isStreaming, canvas]);

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

  // Pre-fill query from URL if q is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const query = searchParams.get("q");
      if (query && !activeChatId && messages.length === 0) {
        setInput(query);
        // Clean URL to prevent re-triggering
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("q");
        window.history.replaceState(null, "", newUrl.toString());
      }
    }
  }, [activeChatId, messages.length, setInput]);

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

  // Sincronizar activeChatId con la prop initialChatId de la URL
  useEffect(() => {
    if (initialChatId) {
      if (activeChatId !== initialChatId) {
        selectChat(initialChatId);
      }
    } else {
      if (activeChatId !== null) {
        newChat();
      }
    }
  }, [initialChatId, activeChatId, selectChat, newChat]);

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
      if (isGuest) {
        setShowUpgradeModal(true);
        return;
      }
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
    [input, attachments, isStreaming, sendMessage, isGuest]
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

      {/* Sidebar de historial: se acopla a la izquierda (rail) al cerrar en desktop, cajón en móvil */}
      <motion.aside
        initial={isMobile ? { x: -280 } : false}
        animate={
          isMobile
            ? { x: sidebarOpen ? 0 : -280, width: 280 }
            : { width: sidebarOpen ? 240 : 60 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className={cn(
          isMobile
            ? "fixed top-0 left-0 bottom-0 z-50 flex flex-col shadow-2xl bg-[#F9F9FB] border-r border-stone-200"
            : "relative flex flex-col h-full shrink-0 bg-[#F9F9FB] border-r border-stone-200 overflow-hidden z-30"
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col shrink-0 w-full"
          )}
        >
        <ConversationSidebar
          chats={chats}
          activeChatId={activeChatId}
          loading={loadingChats}
          onSelect={(id) => {
            router.push(`/ai/${id}`);
            if (isMobile) setSidebarOpen(false);
          }}
          onNew={() => {
            router.push("/ai");
            if (isMobile) setSidebarOpen(false);
          }}
          onDelete={handleDelete}
          onRename={handleRename}
          onPin={handlePin}
          onArchive={handleArchive}
          userName={userName}
          avatarUrl={avatarUrl}
          subscriptionPlan={subscriptionPlan}
          isAdmin={isAdmin}
          onClose={isMobile ? () => setSidebarOpen(false) : undefined}
          collapsed={!isMobile && !sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
        />
        </div>
      </motion.aside>

      {/* Main (sin barra superior) */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Floating Quota Indicator (both mobile & desktop) */}
        <div className="absolute right-3 top-3 z-20">
          <QuotaIndicator
            refreshKey={quotaRefreshKey}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        </div>


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
                  canvasModeActive={canvasModeActive}
                  onCanvasModeChange={setCanvasModeActive}
                  isMobile={isMobile}
                  showMic={false}
                  placeholder={isGuest ? "Suscríbete a un plan Premium para chatear con el Mentor IA" : undefined}
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
                      canvasModeActive={canvasModeActive}
                      onCanvasModeChange={setCanvasModeActive}
                      isMobile={isMobile}
                      showMic={true}
                      placeholder={isGuest ? "Suscríbete a un plan Premium para chatear con el Mentor IA" : undefined}
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
              <div className="hidden min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface-0 shadow-float md:mr-8 md:mt-8 md:mb-4 md:flex">
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

      <SubscriptionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlanId={subscriptionPlan}
      />

    </div>
  );
}
