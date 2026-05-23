"use client";

import React, { Component, ErrorInfo, ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  BookOpen,
  Calendar,
  Tag,
  Phone,
  Star,
  ChevronDown,
  Bot,
  User,
  Minus,
  RotateCcw,
  Zap,
} from "lucide-react";

/* ─── Constantes ───────────────────────────────────────────────── */
const VISITOR_ID_KEY = "programbi_visitor_id";
const CHAT_OPEN_KEY = "programbi_chat_open";
const CHAT_HISTORY_KEY = "programbi_chat_history";
const CONVERSATION_ID_KEY = "programbi_conversation_id";

const WELCOME_MESSAGE = `¡Hola! 👋 Soy **Programbi**, tu asistente virtual.

Puedo ayudarte con información sobre nuestros **cursos de Data Analytics**, horarios, precios, promociones y más.

¿En qué te puedo ayudar hoy?`;

const QUICK_ACTIONS = [
  { label: "Ver cursos", icon: BookOpen, message: "¿Qué cursos tienen disponibles?" },
  { label: "Horarios", icon: Calendar, message: "¿Cuándo empiezan los próximos cursos?" },
  { label: "Promociones", icon: Tag, message: "¿Tienen alguna promoción activa?" },
  { label: "Contactar", icon: Phone, message: "Quiero hablar con un asesor" },
];

/* ─── Utils ────────────────────────────────────────────────────── */
const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch {}
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch {}
  }
};

let memoryVisitorId = "";
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = safeStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        id = crypto.randomUUID();
      } else {
        // Fallback robusto e inofensivo
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      safeStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch (err) {
    console.error("Error retrieving or generating visitor ID:", err);
    if (!memoryVisitorId) {
      memoryVisitorId = "anonymous-" + Math.random().toString(36).substring(7);
    }
    return memoryVisitorId;
  }
}

function renderSimpleMarkdown(text: string) {
  if (!text) return "";
  // Convierte markdown básico a HTML seguro
  let html = text
    // Escapar HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-blue-300 text-[12px] font-mono">$1</code>')
    // Links
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">$1</a>'
    )
    // Line breaks
    .replace(/\n/g, "<br />");

  // Bullet points
  html = html.replace(
    /(?:^|<br \/>)(?:[-•]|\d+\.)\s+(.+?)(?=<br \/>|$)/g,
    '<div class="flex gap-2 mt-1"><span class="text-blue-400 flex-shrink-0">•</span><span>$1</span></div>'
  );

  return html;
}

/* ─── Typing Indicator ─────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.06]">
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

/* ─── Rating Stars ─────────────────────────────────────────────── */
function RatingStars({ onRate }: { onRate: (rating: number) => void }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2 py-3"
    >
      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
        ¿Te fue útil esta conversación?
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setSelected(star);
              onRate(star);
            }}
            className="p-1 transition-all cursor-pointer bg-transparent border-none"
          >
            <Star
              className={`w-5 h-5 transition-all ${
                star <= (hover || selected)
                  ? "text-yellow-400 fill-yellow-400 scale-110"
                  : "text-white/20"
              }`}
            />
          </button>
        ))}
      </div>
      {selected > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[12px] text-emerald-400 font-medium"
        >
          ¡Gracias por tu feedback! 🎉
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Message Bubble ───────────────────────────────────────────── */
function MessageBubble({
  role,
  content,
  isLast,
}: {
  role: string;
  content: string;
  isLast: boolean;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-4 py-2.5 text-[13.5px] leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-blue-500/20"
            : "bg-white/[0.06] text-white/85 rounded-2xl rounded-tl-md border border-white/[0.06]"
        }`}
      >
        {isUser ? (
          <span>{content}</span>
        ) : (
          <div
            className="chatbot-markdown"
            dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content || "") }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN CHAT WIDGET INNER                                         */
/* ═══════════════════════════════════════════════════════════════ */
function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  // Visitor ID
  const [visitorId, setVisitorId] = useState("");
  useEffect(() => {
    setVisitorId(getVisitorId());
    // Restaurar conversation ID si existe
    const savedConvId = safeStorage.getItem(CONVERSATION_ID_KEY);
    if (savedConvId) setConversationId(savedConvId);
  }, []);

  // Vercel AI SDK useChat
  const chatHook: any = useChat({
    api: "/api/chatbot",
    body: {
      conversationId,
      visitorId,
      sourcePage: pathname,
    },
    onResponse: (response: any) => {
      // Capturar el conversation ID del header
      const newConvId = response?.headers?.get("X-Conversation-Id");
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
        safeStorage.setItem(CONVERSATION_ID_KEY, newConvId);
      }
    },
    onFinish: () => {
      // Guardar historial en localStorage
      setTimeout(() => {
        saveMessagesToStorage();
      }, 100);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
    },
  } as any);

  const {
    messages = [],
    input = "",
    handleInputChange = () => {},
    handleSubmit: originalHandleSubmit = (e: any) => e?.preventDefault(),
    isLoading = false,
    setMessages = () => {},
    append = () => {},
    reload = () => {},
  } = chatHook || {};
  
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Guardar mensajes en localStorage
  const saveMessagesToStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      if (!Array.isArray(safeMessages)) return;
      const toSave = safeMessages.slice(-50); // Últimos 50 mensajes
      safeStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
    } catch {
      // Storage full, no pasa nada
    }
  }, [safeMessages]);

  // Restaurar historial al montar
  useEffect(() => {
    try {
      const saved = safeStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setShowQuickActions(false);
          setIsFirstOpen(false);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [setMessages]);

  // Auto-scroll al final
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [safeMessages, isLoading]);

  // Focus input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Notificación visual si llega mensaje mientras está cerrado
  useEffect(() => {
    if (!isOpen && safeMessages.length > 0) {
      const lastMsg = safeMessages[safeMessages.length - 1];
      if (lastMsg?.role === "assistant") {
        setHasNewMessage(true);
      }
    }
  }, [safeMessages, isOpen]);

  // Abrir chat
  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  // Cerrar/minimizar
  const handleClose = () => {
    setIsOpen(false);
    saveMessagesToStorage();
  };

  // Enviar mensaje
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;
    setShowQuickActions(false);
    setIsFirstOpen(false);
    try {
      originalHandleSubmit(e);
    } catch (err) {
      console.error("Error submitting message:", err);
    }
  };

  // Quick action click
  const handleQuickAction = (message: string) => {
    setShowQuickActions(false);
    setIsFirstOpen(false);
    append({ role: "user", content: message });
  };

  // Nueva conversación
  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowQuickActions(true);
    setShowRating(false);
    setIsFirstOpen(true);
    safeStorage.removeItem(CHAT_HISTORY_KEY);
    safeStorage.removeItem(CONVERSATION_ID_KEY);
  };

  // Rating
  const handleRate = async (rating: number) => {
    if (!conversationId) return;
    try {
      // Enviar rating al servidor (simple fetch)
      await fetch("/api/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, rating }),
      });
    } catch {
      // Silent fail
    }
  };

  // Enter para enviar, Shift+Enter para nueva línea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <>
      {/* ─── Botón Flotante ─────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[9998] group cursor-pointer border-none bg-transparent"
            aria-label="Abrir chat"
            id="chatbot-trigger"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity scale-110" />

            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400/30"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Button */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-110 group-active:scale-95">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>

            {/* Badge */}
            {hasNewMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center"
              >
                <span className="text-[9px] font-black text-white">1</span>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Panel del Chat ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9998] w-[380px] h-[600px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/40
              max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:left-0 max-[480px]:top-0 max-[480px]:w-full max-[480px]:h-full max-[480px]:max-h-full max-[480px]:rounded-none"
            style={{
              background: "linear-gradient(160deg, #0c1220 0%, #111827 40%, #0f172a 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            id="chatbot-panel"
          >
            {/* ─── Header ───────────────────────────────────── */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              {/* Gradient accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, #1890FF, #6366F1, transparent)",
                }}
              />

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white leading-tight">
                    Programbi
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    En línea
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* New chat */}
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="p-2 rounded-xl bg-transparent hover:bg-white/[0.06] border-none cursor-pointer transition-colors group"
                  title="Nueva conversación"
                >
                  <RotateCcw className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
                {/* Minimize */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-transparent hover:bg-white/[0.06] border-none cursor-pointer transition-colors group"
                  title="Minimizar"
                >
                  <Minus className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    setShowRating(true);
                    handleClose();
                  }}
                  className="p-2 rounded-xl bg-transparent hover:bg-white/[0.06] border-none cursor-pointer transition-colors group"
                  title="Cerrar"
                >
                  <X className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
              </div>
            </div>

            {/* ─── Messages Area ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4 scrollbar-hide">
              {/* Welcome message */}
              {(safeMessages.length === 0 || isFirstOpen) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4"
                >
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="max-w-[82%] px-4 py-2.5 text-[13.5px] leading-relaxed bg-white/[0.06] text-white/85 rounded-2xl rounded-tl-md border border-white/[0.06]">
                      <div
                        className="chatbot-markdown"
                        dangerouslySetInnerHTML={{
                          __html: renderSimpleMarkdown(WELCOME_MESSAGE),
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <AnimatePresence>
                {showQuickActions && safeMessages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.3 }}
                    className="px-4 grid grid-cols-2 gap-2"
                  >
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button
                        key={action.label}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        onClick={() => handleQuickAction(action.message)}
                        className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-blue-500/30 text-white/60 hover:text-white/90 text-[12px] font-medium transition-all cursor-pointer group text-left"
                      >
                        <action.icon className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              {safeMessages
                .filter((m: any) => m?.role !== "system")
                .map((message: any, index: number) => (
                  <MessageBubble
                    key={message?.id || index}
                    role={message?.role}
                    content={message?.content || ""}
                    isLast={index === safeMessages.length - 1}
                  />
                ))}

              {/* Typing Indicator */}
              {isLoading && <TypingIndicator />}

              {/* Rating */}
              {showRating && safeMessages.length > 2 && (
                <RatingStars onRate={handleRate} />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Powered By Badge ────────────────────────── */}
            <div className="flex items-center justify-center py-1.5 border-t border-white/[0.03]">
              <span className="text-[9px] text-white/15 font-medium flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                Powered by ProgramBI AI
              </span>
            </div>

            {/* ─── Input Area ───────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="relative px-4 pb-4 pt-2"
            >
              <div className="flex items-end gap-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-blue-500/40 focus-within:bg-white/[0.07] transition-all">
                <textarea
                  ref={inputRef}
                  value={input || ""}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu consulta..."
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-white/90 placeholder:text-white/25 resize-none max-h-24 leading-relaxed font-sans"
                  style={{ fontFamily: "inherit" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input?.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all border-none cursor-pointer flex-shrink-0 ${
                    input?.trim() && !isLoading
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
                      : "bg-white/[0.05] text-white/20 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ERROR BOUNDARY WRAPPER                                         */
/* ═══════════════════════════════════════════════════════════════ */
class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ChatWidget Error Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // Si el widget falla, simplemente no lo renderizamos para no romper toda la página en producción
      return null;
    }
    return this.props.children;
  }
}

export default function ChatWidget() {
  return (
    <ChatErrorBoundary>
      <ChatWidgetInner />
    </ChatErrorBoundary>
  );
}
