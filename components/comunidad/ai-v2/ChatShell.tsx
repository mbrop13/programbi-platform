"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, MessageSquarePlus, PanelLeft, PanelLeftClose, Wand2, Copy, FileCode, Check, Database, X, BookOpen, GitFork } from "lucide-react";
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

const CHEAT_SHEETS = [
  {
    category: "DAX (Power BI)",
    items: [
      { id: "dax_calc", name: "CALCULATE Condicional", desc: "Evalúa una métrica bajo un filtro específico.", code: "CALCULATE(\n  [VentasTotales],\n  DimClientes[Pais] = \"España\"\n)" },
      { id: "dax_div", name: "DIVIDE Seguro", desc: "Realiza división segura controlando divisiones por cero.", code: "DIVIDE( [Ventas], [Cantidad], 0 )" },
      { id: "dax_ytd", name: "DATESYTD Acumulado", desc: "Calcula el acumulado del año actual hasta la fecha.", code: "TOTALYTD( [VentasTotales], DimFechas[Fecha] )" }
    ]
  },
  {
    category: "Pandas (Python)",
    items: [
      { id: "py_fillna", name: "Rellenar Nulos", desc: "Reemplaza los valores nulos con la media de la columna.", code: "df['ventas'].fillna(df['ventas'].mean(), inplace=True)" },
      { id: "py_group", name: "Agrupar y Sumar", desc: "Agrupa registros y resume sus valores numéricos.", code: "df.groupby('categoria')['total'].sum().reset_index()" },
      { id: "py_filter", name: "Filtrar por Condiciones", desc: "Filtra registros que coinciden con ciertos criterios.", code: "df_filtrado = df[(df['edad'] > 18) & (df['pais'] == 'España')]" }
    ]
  },
  {
    category: "SQL Server",
    items: [
      { id: "sql_cte", name: "Common Table Expression (CTE)", desc: "Crea una vista temporal organizada para simplificar consultas.", code: ";WITH VentasRecientes AS (\n  SELECT ClienteID, SUM(Total) as TotalVentas\n  FROM Ventas\n  WHERE Fecha >= '2026-01-01'\n  GROUP BY ClienteID\n)\nSELECT ClienteID, TotalVentas \nFROM VentasRecientes;" },
      { id: "sql_row", name: "Enumerar Filas (ROW_NUMBER)", desc: "Asigna un número secuencial único a las filas de un grupo.", code: "ROW_NUMBER() OVER(PARTITION BY DepartamentoID ORDER BY Salario DESC)" }
    ]
  }
];

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

  // Analyst Hub states & utilities
  const [analystHubOpen, setAnalystHubOpen] = useState(false);
  const [hubTab, setHubTab] = useState<'formatter' | 'cheatsheet' | 'schema'>('formatter');
  const [formatInput, setFormatInput] = useState("");
  const [formatOutput, setFormatOutput] = useState("");
  const [formatLang, setFormatLang] = useState<'dax' | 'sql'>('dax');
  const [copiedText, setCopiedText] = useState("");
  const [schemaTables, setSchemaTables] = useState<string[]>(["FactSales", "DimCustomers", "DimProducts", "DimDates"]);

  const handleFormat = useCallback(() => {
    let code = formatInput.trim();
    if (!code) return;
    if (formatLang === 'sql') {
      const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "AND", "OR"];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        code = code.replace(regex, `\n${keyword}`);
      });
      code = code.split('\n')
        .map(line => {
          const l = line.trim();
          if (l.startsWith("ON") || l.startsWith("AND") || l.startsWith("OR")) return "  " + l;
          return l;
        })
        .filter(Boolean)
        .join('\n');
    } else {
      const keywords = ["CALCULATE", "FILTER", "ALL", "RELATED", "SUMX", "AVERAGEX", "VALUES", "ADDCOLUMNS", "SUMMARIZE", "DIVIDE", "USERELATIONSHIP", "DATESYTD", "DATEADD"];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        code = code.replace(regex, `\n${keyword}`);
      });
      let indentLevel = 0;
      code = code.split('\n').map(line => {
        let l = line.trim();
        if (l.includes(")")) indentLevel = Math.max(0, indentLevel - 1);
        const indentStr = "  ".repeat(indentLevel);
        if (l.includes("(")) indentLevel++;
        return indentStr + l;
      }).join('\n');
    }
    setFormatOutput(code);
  }, [formatInput, formatLang]);

  const handleCopySnippet = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(id);
    setTimeout(() => setCopiedText(""), 2000);
  }, []);

  const toggleSchemaTable = useCallback((table: string) => {
    setSchemaTables(prev => 
      prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
    );
  }, []);

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
          width: sidebarOpen ? 200 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "absolute z-50 h-full shrink-0 md:relative",
          sidebarOpen ? "overflow-visible" : "overflow-hidden"
        )}
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
          userName={userName}
          avatarUrl={avatarUrl}
          subscriptionPlan={subscriptionPlan}
          isAdmin={isAdmin}
          onClose={() => setSidebarOpen(false)}
        />
      </motion.aside>

      {/* Main (sin barra superior) */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Toggle flotante para abrir/cerrar el sidebar (solo cuando está cerrado) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-0/80 text-text-muted shadow-premium backdrop-blur-md transition-colors hover:bg-surface-2 hover:text-text-primary"
            title="Mostrar historial"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}

        {/* Analyst Hub Floating Toggle Button */}
        <button
          onClick={() => setAnalystHubOpen(!analystHubOpen)}
          className={cn(
            "absolute right-3 top-3 z-20 flex h-9 gap-1.5 items-center justify-center rounded-xl border px-3 text-xs font-bold transition-all shadow-premium cursor-pointer backdrop-blur-md",
            analystHubOpen
              ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              : "bg-surface-0/80 border-border text-text-secondary hover:bg-surface-2 hover:text-text-primary"
          )}
          title="Herramientas de Analista"
        >
          <Wand2 className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Hub de Datos</span>
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

      {/* Analyst Hub Right Slide-Over Panel */}
      <AnimatePresence>
        {analystHubOpen && (
          <>
            {/* Backdrop to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnalystHubOpen(false)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white border-l border-stone-200 shadow-2xl flex flex-col text-stone-900 overflow-hidden"
            >
              {/* Header */}
              <div className="flex h-14 shrink-0 items-center justify-between px-6 border-b border-stone-150 bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-black tracking-wider uppercase text-stone-900">Hub de Analista ⚡</span>
                </div>
                <button
                  onClick={() => setAnalystHubOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex shrink-0 border-b border-stone-150 p-2 gap-1 bg-stone-50/20">
                {[
                  { id: 'formatter' as const, label: 'Formateador', icon: FileCode },
                  { id: 'cheatsheet' as const, label: 'Cheat Sheets', icon: BookOpen },
                  { id: 'schema' as const, label: 'Esquema Estrella', icon: GitFork },
                ].map(t => {
                  const Icon = t.icon;
                  const active = hubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setHubTab(t.id)}
                      className={cn(
                        "flex-1 py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold transition-all border-0 bg-transparent cursor-pointer",
                        active 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                          : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {hubTab === 'formatter' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Pega tu consulta</h4>
                      <textarea
                        value={formatInput}
                        onChange={e => setFormatInput(e.target.value)}
                        placeholder={formatLang === 'dax' ? "CALCULATE(SUM(Sales[Amount]), FILTER(All(Products), Products[Category] = \"Audio\"))" : "SELECT id, name, sum(amount) FROM sales JOIN customers ON sales.customer_id = customers.id GROUP BY id, name"}
                        rows={6}
                        className="w-full text-xs font-mono p-3 rounded-xl border border-stone-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-stone-50/50 resize-none text-stone-805"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {['dax', 'sql'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setFormatLang(lang as 'dax' | 'sql')}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border cursor-pointer bg-transparent",
                              formatLang === lang
                                ? "border-blue-600 text-blue-600"
                                : "border-stone-200 text-stone-500 hover:border-stone-300"
                            )}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleFormat}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl border-0 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        Formatear
                      </button>
                    </div>

                    {formatOutput && (
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Resultado Limpio</h4>
                          <button
                            onClick={() => handleCopySnippet(formatOutput, 'formatter')}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer font-bold"
                          >
                            {copiedText === 'formatter' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 bg-stone-900 text-green-400 rounded-xl text-xs overflow-x-auto font-mono max-h-60 leading-relaxed border border-stone-850">
                          {formatOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {hubTab === 'cheatsheet' && (
                  <div className="space-y-6">
                    {CHEAT_SHEETS.map(section => (
                      <div key={section.category} className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-stone-550 border-b border-stone-150 pb-1.5">{section.category}</h4>
                        <div className="space-y-2.5">
                          {section.items.map(item => (
                            <div key={item.id} className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/20 hover:border-stone-300 transition-colors flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-black text-stone-850">{item.name}</span>
                                <button
                                  onClick={() => handleCopySnippet(item.code, item.id)}
                                  className="text-stone-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer"
                                >
                                  {copiedText === item.id ? (
                                    <Check className="w-4 h-4 text-green-600 animate-scale" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-normal">{item.desc}</p>
                              <pre className="p-2.5 bg-stone-50 border border-stone-150 text-[11px] font-mono rounded-lg text-stone-750 overflow-x-auto">
                                {item.code}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hubTab === 'schema' && (
                  <div className="space-y-5">
                    <p className="text-xs text-stone-500 leading-relaxed">
                      El **Esquema de Estrella** es la base del modelado en Power BI. Selecciona las tablas para ver cómo se relacionan:
                    </p>

                    <div className="flex flex-wrap gap-2 font-bold">
                      {["FactSales", "DimCustomers", "DimProducts", "DimDates", "DimStores"].map(table => {
                        const active = schemaTables.includes(table);
                        return (
                          <button
                            key={table}
                            onClick={() => toggleSchemaTable(table)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs border cursor-pointer bg-transparent transition-all",
                              active
                                ? "border-blue-600 bg-blue-50/20 text-blue-700 font-bold"
                                : "border-stone-200 text-stone-500 hover:border-stone-300"
                            )}
                          >
                            {table === "FactSales" ? "📊 FactSales" : `🔑 ${table}`}
                          </button>
                        );
                      })}
                    </div>

                    {schemaTables.length > 0 && (
                      <div className="space-y-4 pt-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Diagrama Relacional</h4>
                        <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col gap-4 text-white overflow-x-auto min-h-[220px] items-center justify-center relative">
                          
                          {/* Fact Table */}
                          {schemaTables.includes("FactSales") ? (
                            <div className="flex flex-col items-center gap-6 w-full">
                              
                              {/* Dimensions Row */}
                              <div className="flex flex-wrap items-center justify-center gap-4">
                                {schemaTables.filter(t => t !== "FactSales").map(dim => (
                                  <div key={dim} className="flex flex-col items-center">
                                    <div className="px-2.5 py-1.5 bg-blue-900/50 border border-blue-500 rounded-lg text-[10px] font-bold text-blue-200 font-mono">
                                      {dim}
                                    </div>
                                    <div className="text-[10px] text-blue-400 font-mono font-bold leading-none mt-1">
                                      1 : *
                                    </div>
                                    <div className="h-4 w-px bg-gradient-to-b from-blue-500 to-transparent" />
                                  </div>
                                ))}
                              </div>

                              {/* Fact table central box */}
                              <div className="px-5 py-2.5 bg-emerald-950/40 border-2 border-emerald-500 rounded-xl text-center shadow-lg">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">📊 FactSales</span>
                                <div className="text-[9px] text-stone-400 mt-1 space-y-0.5 text-left font-mono">
                                  <div>- SalesAmount</div>
                                  <div>- Quantity</div>
                                  <div>- CustomerKey</div>
                                  <div>- ProductKey</div>
                                  <div>- DateKey</div>
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div className="text-xs text-stone-500 italic text-center">
                              Selecciona FactSales para iniciar el modelo
                            </div>
                          )}

                        </div>

                        {/* Best practice callout */}
                        <div className="p-4 bg-blue-50/50 border border-blue-150 rounded-xl">
                          <h5 className="text-xs font-black text-blue-955 mb-1">💡 Regla del Analista</h5>
                          <p className="text-[11px] text-blue-800 leading-normal">
                            Las relaciones deben fluir de **1 (Dimensión) a Varios (Hechos)**. DimFechas y DimProductos filtran a FactSales. ¡Nunca uses relaciones bidireccionales innecesarias!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
