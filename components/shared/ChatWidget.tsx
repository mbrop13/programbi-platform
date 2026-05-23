"use client";

import React, { Component, ErrorInfo, ReactNode, useState, useEffect, useRef, useCallback } from "react";
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
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

/* ─── Constantes ───────────────────────────────────────────────── */
const VISITOR_ID_KEY = "programbi_visitor_id";
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
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
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

let messageCounter = 0;
function generateId(): string {
  messageCounter++;
  return `msg-${Date.now()}-${messageCounter}`;
}

function renderSimpleMarkdown(text: string) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#1890ff]">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[12px] font-mono">$1</code>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 font-medium underline underline-offset-2 hover:text-blue-700 transition-colors">$1</a>'
    )
    .replace(/\n/g, "<br />");

  html = html.replace(
    /(?:^|<br \/>)(?:[-•]|\d+\.)\s+(.+?)(?=<br \/>|$)/g,
    '<div class="flex gap-2 mt-1.5"><span class="text-blue-500 flex-shrink-0 font-bold">•</span><span>$1</span></div>'
  );

  return html;
}

/* ─── Typing Indicator ─────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-md bg-slate-100 border border-slate-200/60 shadow-sm">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-blue-500/60"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-blue-500/60"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-blue-500/60"
          animate={{ y: [0, -4, 0] }}
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
      className="flex flex-col items-center gap-2 py-4"
    >
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        ¿Te fue útil esta conversación?
      </p>
      <div className="flex gap-1.5">
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
            className="p-1 transition-all cursor-pointer bg-transparent border-none outline-none"
          >
            <Star
              className={`w-5 h-5 transition-all ${
                star <= (hover || selected)
                  ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-sm"
                  : "text-slate-300 hover:text-slate-400"
              }`}
            />
          </button>
        ))}
      </div>
      {selected > 0 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[12px] text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full mt-1"
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
}: {
  role: string;
  content: string;
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
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-slate-500" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-blue-500/10"
            : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60"
        }`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{content}</span>
        ) : (
          <div
            className="chatbot-markdown space-y-2"
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  // Visitor ID
  const [visitorId, setVisitorId] = useState("");
  useEffect(() => {
    setVisitorId(getVisitorId());
    const savedConvId = safeStorage.getItem(CONVERSATION_ID_KEY);
    if (savedConvId) setConversationId(savedConvId);
  }, []);

  // Restore saved messages
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
      // Ignorar
    }
  }, []);

  const saveMessagesToStorage = useCallback((msgs: ChatMessage[]) => {
    if (typeof window === "undefined") return;
    try {
      const toSave = msgs.slice(-50);
      safeStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Notification badge
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "assistant") {
        setHasNewMessage(true);
      }
    }
  }, [messages, isOpen]);

  /* ─── Core: send a message and stream the response ───────────── */
  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim() || isLoading) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: userContent.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);
    setIsFirstOpen(false);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Build the messages array for the API (simple {role, content} format)
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          conversationId,
          visitorId,
          sourcePage: pathname,
        }),
        signal: controller.signal,
      });

      // Pick up conversation ID from response header
      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== "pending" && newConvId !== conversationId) {
        setConversationId(newConvId);
        safeStorage.setItem(CONVERSATION_ID_KEY, newConvId);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Create the assistant message placeholder
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
      };

      const withAssistant = [...updatedMessages, assistantMsg];
      setMessages(withAssistant);

      // Stream the text response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Update the assistant message content in-place
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === "assistant") {
            copy[lastIdx] = { ...copy[lastIdx], content: fullText };
          }
          return copy;
        });
      }

      // Save to storage after completion
      setMessages((prev) => {
        saveMessagesToStorage(prev);
        return prev;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled, ignore
        return;
      }
      console.error("Chat error:", err);

      // Add error message
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente. Si el problema persiste, contáctanos por WhatsApp al +56 9 3677 6614.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, conversationId, visitorId, pathname, saveMessagesToStorage]);

  /* ─── Event Handlers ─────────────────────────────────────────── */
  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    saveMessagesToStorage(messages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  const handleNewChat = () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setInput("");
    setConversationId(null);
    setShowQuickActions(true);
    setShowRating(false);
    setIsFirstOpen(true);
    setIsLoading(false);
    safeStorage.removeItem(CHAT_HISTORY_KEY);
    safeStorage.removeItem(CONVERSATION_ID_KEY);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRate = async (rating: number) => {
    if (!conversationId) return;
    try {
      await fetch("/api/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, rating }),
      });
    } catch {
      // Silencioso
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <>
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
          >
            {/* Soft Shadow Base */}
            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-lg group-hover:bg-blue-600/30 transition-all scale-110" />

            {/* Clean Premium Button */}
            <div className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:shadow-blue-900/40 transition-all group-hover:-translate-y-1 group-active:translate-y-0 group-active:scale-95">
              <MessageCircle className="w-7 h-7 text-white drop-shadow-sm" />
            </div>

            {/* Notification Badge */}
            {hasNewMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-sm"
              >
                <span className="text-[10px] font-bold text-white leading-none">1</span>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9998] w-[400px] h-[650px] max-h-[85vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15 border border-slate-200/60
              max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:left-0 max-[480px]:w-full max-[480px]:h-[85dvh] max-[480px]:max-h-[85dvh] max-[480px]:rounded-b-none"
          >
            {/* ─── Header ───────────────────────────────────── */}
            <div className="relative flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
                    Programbi AI
                  </h3>
                  <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En línea ahora
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="p-2 rounded-lg bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors text-slate-400 hover:text-blue-600"
                  title="Reiniciar chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (messages.length > 2) setShowRating(true);
                    handleClose();
                  }}
                  className="p-2 rounded-lg bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors text-slate-400 hover:text-slate-700"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ─── Messages Area ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 space-y-5 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              {(messages.length === 0 || isFirstOpen) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4"
                >
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="max-w-[85%] px-4 py-3 text-[14px] leading-relaxed bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60 shadow-sm">
                      <div
                        className="chatbot-markdown space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: renderSimpleMarkdown(WELCOME_MESSAGE),
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {showQuickActions && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.3 }}
                    className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
                  >
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button
                        key={action.label}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        onClick={() => handleQuickAction(action.message)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 text-[13px] font-medium transition-all cursor-pointer group text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <action.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        </div>
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {messages
                .filter((m) => m.role !== "system")
                .map((message) => (
                  <MessageBubble
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}

              {isLoading && <TypingIndicator />}

              {showRating && messages.length > 2 && (
                <RatingStars onRate={handleRate} />
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* ─── Input Area ───────────────────────────────── */}
            <div className="bg-white border-t border-slate-100 z-10">
              <form
                onSubmit={handleSubmit}
                className="p-3"
              >
                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta aquí..."
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-800 placeholder:text-slate-400 resize-none max-h-[120px] min-h-[24px] px-2 py-1.5 leading-relaxed"
                    style={{ fontFamily: "inherit" }}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-lg transition-all border-none flex-shrink-0 flex items-center justify-center h-[40px] w-[40px] ${
                      input.trim() && !isLoading
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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
