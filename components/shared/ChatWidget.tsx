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
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

/* ─── Course Card Data (static, avoids API calls) ──────────────── */
const COURSE_CARDS: Record<string, {
  slug: string;
  title: string;
  shortDesc: string;
  techStack: string[];
  hours: number;
  price: string;
  color: string;
  icon: string;
}> = {
  "analisis-de-datos": {
    slug: "analisis-de-datos",
    title: "Análisis de Datos",
    shortDesc: "Programa integral: SQL + Power BI + Python",
    techStack: ["SQL", "Power BI", "Python"],
    hours: 144,
    price: "Desde $299.000",
    color: "#1890FF",
    icon: "📊",
  },
  "power-bi": {
    slug: "power-bi",
    title: "Power BI",
    shortDesc: "Dashboards interactivos y DAX avanzado",
    techStack: ["Power Query", "DAX", "Dashboards"],
    hours: 48,
    price: "Desde $249.000",
    color: "#F2C811",
    icon: "📈",
  },
  "python": {
    slug: "python",
    title: "Python para Datos",
    shortDesc: "Análisis avanzado con Pandas y visualización",
    techStack: ["Python", "Pandas", "Matplotlib"],
    hours: 48,
    price: "Desde $249.000",
    color: "#3776AB",
    icon: "🐍",
  },
  "sql-server": {
    slug: "sql-server",
    title: "SQL Server",
    shortDesc: "Consultas, stored procedures y optimización",
    techStack: ["T-SQL", "SSMS", "Stored Procedures"],
    hours: 48,
    price: "Desde $249.000",
    color: "#64748B",
    icon: "🗄️",
  },
  "excel": {
    slug: "excel",
    title: "Excel Avanzado",
    shortDesc: "Tablas dinámicas, Power Query y VBA",
    techStack: ["Excel", "Power Query", "VBA"],
    hours: 36,
    price: "Desde $249.000",
    color: "#217346",
    icon: "📗",
  },
  "ia-productividad": {
    slug: "ia-productividad",
    title: "IA en Productividad",
    shortDesc: "Prompt Engineering, Vibe Coding y Agentes IA",
    techStack: ["ChatGPT", "Copilot", "Agentes IA"],
    hours: 24,
    price: "Desde $249.000",
    color: "#7C3AED",
    icon: "🤖",
  },
  "machine-learning": {
    slug: "machine-learning",
    title: "Machine Learning",
    shortDesc: "Modelos predictivos y redes neuronales",
    techStack: ["Python", "Scikit-learn", "TensorFlow"],
    hours: 48,
    price: "Desde $249.000",
    color: "#9333EA",
    icon: "🧠",
  },
  "power-automate": {
    slug: "power-automate",
    title: "Power Automate & RPA",
    shortDesc: "Automatiza procesos sin código con IA",
    techStack: ["RPA", "Cloud Flows", "Copilot IA"],
    hours: 48,
    price: "Desde $249.000",
    color: "#0078D4",
    icon: "⚡",
  },
  "analitica-mineria": {
    slug: "analitica-mineria",
    title: "Analítica para Minería",
    shortDesc: "Optimización y toma de decisiones en minería",
    techStack: ["Excel", "Power BI", "SQL", "Python"],
    hours: 144,
    price: "Desde $498.000",
    color: "#B45309",
    icon: "⛏️",
  },
  "analitica-financiera": {
    slug: "analitica-financiera",
    title: "Analítica Financiera",
    shortDesc: "Reportes contables, riesgo y dashboards",
    techStack: ["Excel", "SQL", "Power BI", "Python"],
    hours: 144,
    price: "Desde $498.000",
    color: "#1E3A8A",
    icon: "💰",
  },
};

/* ─── Pre-built responses for quick actions (saves tokens) ─────── */
const PREBUILT_RESPONSES: Record<string, { text: string; cards: string[] }> = {
  "¿Qué cursos tienen disponibles?": {
    text: `¡Tenemos una variedad de cursos diseñados para impulsar tu carrera en **Data Analytics**! 🚀

Aquí te muestro nuestros cursos principales:`,
    cards: ["analisis-de-datos", "power-bi", "python", "sql-server", "excel", "ia-productividad", "machine-learning", "power-automate"],
  },
  "¿Cuándo empiezan los próximos cursos?": {
    text: `📅 Los horarios de nuestros cursos se actualizan constantemente. Te recomiendo revisar directamente en nuestra web para ver las fechas exactas de inicio.

📌 Normalmente tenemos clases **Martes y Jueves** o **Lunes y Miércoles**, en horario de **19:30 a 21:30 hrs (Chile)**.

¿Te interesa algún curso en particular? Puedo darte más detalles 👇`,
    cards: ["analisis-de-datos", "power-bi", "sql-server"],
  },
  "¿Tienen alguna promoción activa?": {
    text: `🏷️ ¡Sí! Actualmente tenemos promociones activas en varios cursos.

Nuestro programa más completo, el **Curso de Análisis de Datos** (144 horas), tiene un precio especial desde **$299.000 CLP** (precio original $747.000).

Los cursos individuales de **48 horas** están desde **$249.000 CLP**.

¿Quieres más información sobre algún curso en particular?`,
    cards: ["analisis-de-datos"],
  },
  "Quiero hablar con un asesor": {
    text: `¡Por supuesto! 😊 Puedes contactar a nuestro equipo de asesores por estos medios:

📱 **WhatsApp**: [+56 9 3677 6614](https://wa.me/56936776614)
📧 **Email**: contacto@programbi.com

Nuestro equipo está disponible para resolver todas tus dudas sobre cursos, horarios, precios y métodos de pago.

¿Hay algo más en lo que pueda ayudarte mientras tanto?`,
    cards: [],
  },
};

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
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1890ff">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="padding:2px 6px;border-radius:4px;background:#e2e8f0;color:#475569;font-size:12px;font-family:monospace">$1</code>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color:#2563eb;font-weight:500;text-decoration:underline">$1</a>'
    )
    .replace(/\n/g, "<br />");

  html = html.replace(
    /(?:^|<br \/>)(?:[-•]|\d+\.)\s+(.+?)(?=<br \/>|$)/g,
    '<div style="display:flex;gap:8px;margin-top:6px"><span style="color:#3b82f6;flex-shrink:0;font-weight:700">•</span><span>$1</span></div>'
  );

  return html;
}

/** Extract ((slug)) patterns from text and return the cleaned text + card slugs */
function extractCourseWidgets(text: string): { cleanText: string; cardSlugs: string[] } {
  const slugs: string[] = [];
  const cleanText = text.replace(/\(\(([a-z0-9-]+)\)\)/g, (_match, slug) => {
    if (COURSE_CARDS[slug] && !slugs.includes(slug)) {
      slugs.push(slug);
    }
    return "";
  });
  return { cleanText: cleanText.trim(), cardSlugs: slugs };
}

/* ─── Typing Indicator ─────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-md bg-slate-100 border border-slate-200/60 shadow-sm">
        <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
        <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
        <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
      </div>
    </div>
  );
}

/* ─── Rating Stars ─────────────────────────────────────────────── */
function RatingStars({ onRate }: { onRate: (rating: number) => void }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2 py-4">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">¿Te fue útil esta conversación?</p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
            onClick={() => { setSelected(star); onRate(star); }}
            className="p-1 transition-all cursor-pointer bg-transparent border-none outline-none">
            <Star className={`w-5 h-5 transition-all ${star <= (hover || selected) ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-sm" : "text-slate-300 hover:text-slate-400"}`} />
          </button>
        ))}
      </div>
      {selected > 0 && (
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[12px] text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full mt-1">
          ¡Gracias por tu feedback! 🎉
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Course Card Widget ───────────────────────────────────────── */
function CourseCard({ slug }: { slug: string }) {
  const course = COURSE_CARDS[slug];
  if (!course) return null;

  return (
    <motion.a
      href={`/cursos/${course.slug}`}
      target="_blank"
      rel="noopener"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="block rounded-xl border border-slate-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden cursor-pointer group no-underline"
    >
      <div className="flex items-start gap-3 p-3">
        <div className="text-2xl flex-shrink-0 mt-0.5">{course.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[13px] font-bold text-slate-900 truncate leading-tight">{course.title}</h4>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{course.shortDesc}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />{course.hours}h
            </span>
            <span className="text-[11px] font-semibold" style={{ color: course.color }}>{course.price}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {course.techStack.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 leading-none">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Message Bubble ───────────────────────────────────────────── */
function MessageBubble({ role, content, cards }: { role: string; content: string; cards?: string[] }) {
  const isUser = role === "user";
  const { cleanText, cardSlugs } = isUser ? { cleanText: content, cardSlugs: [] } : extractCourseWidgets(content || "");
  const allCards = [...cardSlugs, ...(cards || [])];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
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

      <div className="max-w-[85%] flex flex-col gap-2">
        {cleanText && (
          <div className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-blue-500/10"
              : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60"
          }`}>
            {isUser ? (
              <span className="whitespace-pre-wrap">{cleanText}</span>
            ) : (
              <div className="chatbot-markdown space-y-2" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(cleanText) }} />
            )}
          </div>
        )}

        {/* Course Cards */}
        {allCards.length > 0 && (
          <div className="flex flex-col gap-1.5 ml-0">
            {allCards.map((slug) => (
              <CourseCard key={slug} slug={slug} />
            ))}
          </div>
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
  const [messages, setMessages] = useState<(ChatMessage & { cards?: string[] })[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  const [visitorId, setVisitorId] = useState("");
  useEffect(() => {
    setVisitorId(getVisitorId());
    const savedConvId = safeStorage.getItem(CONVERSATION_ID_KEY);
    if (savedConvId) setConversationId(savedConvId);
  }, []);

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
    } catch { /* Ignorar */ }
  }, []);

  const saveMessagesToStorage = useCallback((msgs: (ChatMessage & { cards?: string[] })[]) => {
    if (typeof window === "undefined") return;
    try {
      const toSave = msgs.slice(-50);
      safeStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
    } catch { /* Ignorar */ }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "assistant") setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  /* ─── Handle pre-built quick action response ─────────────────── */
  const handlePrebuiltResponse = useCallback((userContent: string) => {
    const prebuilt = PREBUILT_RESPONSES[userContent];
    if (!prebuilt) return false;

    const userMsg: ChatMessage & { cards?: string[] } = {
      id: generateId(),
      role: "user",
      content: userContent,
    };

    const assistantMsg: ChatMessage & { cards?: string[] } = {
      id: generateId(),
      role: "assistant",
      content: prebuilt.text,
      cards: prebuilt.cards,
    };

    const updated = [...messages, userMsg, assistantMsg];
    setMessages(updated);
    setShowQuickActions(false);
    setIsFirstOpen(false);
    saveMessagesToStorage(updated);
    return true;
  }, [messages, saveMessagesToStorage]);

  /* ─── Core: send a message and stream the response ───────────── */
  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim() || isLoading) return;

    // Check for pre-built responses first
    if (handlePrebuiltResponse(userContent)) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg: ChatMessage = { id: generateId(), role: "user", content: userContent.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);
    setIsFirstOpen(false);
    if (inputRef.current) inputRef.current.style.height = "auto";

    const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      // Add a 55-second timeout to match the API's maxDuration of 60s
      const timeoutId = setTimeout(() => controller.abort(), 55000);

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

      clearTimeout(timeoutId);

      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== "pending" && newConvId !== conversationId) {
        setConversationId(newConvId);
        safeStorage.setItem(CONVERSATION_ID_KEY, newConvId);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const assistantMsg: ChatMessage = { id: generateId(), role: "assistant", content: "" };
      const withAssistant = [...updatedMessages, assistantMsg];
      setMessages(withAssistant);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === "assistant") {
            copy[lastIdx] = { ...copy[lastIdx], content: fullText };
          }
          return copy;
        });
      }

      // If the response was completely empty, show a fallback
      if (!fullText.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === "assistant") {
            copy[lastIdx] = {
              ...copy[lastIdx],
              content: "Disculpa, no pude generar una respuesta en este momento. 😔 ¿Podrías intentar reformular tu pregunta? Si el problema persiste, contáctanos por **WhatsApp** al [+56 9 3677 6614](https://wa.me/56936776614).",
            };
          }
          return copy;
        });
      }

      setMessages((prev) => { saveMessagesToStorage(prev); return prev; });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. 😔 Por favor, intenta nuevamente. Si el problema persiste, contáctanos por **WhatsApp** al [+56 9 3677 6614](https://wa.me/56936776614).",
      };
      setMessages((prev) => { const updated = [...prev, errorMsg]; saveMessagesToStorage(updated); return updated; });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, conversationId, visitorId, pathname, saveMessagesToStorage, handlePrebuiltResponse]);

  const handleOpen = () => { setIsOpen(true); setHasNewMessage(false); };
  const handleClose = () => { setIsOpen(false); saveMessagesToStorage(messages); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleQuickAction = (message: string) => { sendMessage(message); };
  const handleNewChat = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setMessages([]); setInput(""); setConversationId(null);
    setShowQuickActions(true); setShowRating(false); setIsFirstOpen(true); setIsLoading(false);
    safeStorage.removeItem(CHAT_HISTORY_KEY); safeStorage.removeItem(CONVERSATION_ID_KEY);
    if (inputRef.current) inputRef.current.focus();
  };
  const handleRate = async (rating: number) => {
    if (!conversationId) return;
    try { await fetch("/api/chatbot", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, rating }) }); } catch { /* silent */ }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target; target.style.height = "auto"; target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <>
      {/* ─── FAB Button ───────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button type="button" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }} onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[9998] group cursor-pointer border-none bg-transparent" aria-label="Abrir chat">
            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-lg group-hover:bg-blue-600/30 transition-all scale-110" />
            <div className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:shadow-blue-900/40 transition-all group-hover:-translate-y-1 group-active:translate-y-0 group-active:scale-95">
              <MessageCircle className="w-7 h-7 text-white drop-shadow-sm" />
            </div>
            {hasNewMessage && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-white leading-none">1</span>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Chat Panel ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9998] w-[400px] h-[650px] max-h-[85vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15 border border-slate-200/60
              max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:left-0 max-[480px]:w-full max-[480px]:h-[85dvh] max-[480px]:max-h-[85dvh] max-[480px]:rounded-b-none"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 leading-tight">Programbi AI</h3>
                  <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />En línea ahora
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleNewChat} className="p-2 rounded-lg bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors text-slate-400 hover:text-blue-600" title="Reiniciar chat">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => { if (messages.length > 2) setShowRating(true); handleClose(); }}
                  className="p-2 rounded-lg bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors text-slate-400 hover:text-slate-700" title="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 space-y-5 bg-white">
              {(messages.length === 0 || isFirstOpen) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4">
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="max-w-[85%] px-4 py-3 text-[14px] leading-relaxed bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60 shadow-sm">
                      <div className="chatbot-markdown space-y-2" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(WELCOME_MESSAGE) }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {showQuickActions && messages.length === 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.3 }}
                    className="px-4 grid grid-cols-2 gap-2 mt-2">
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button key={action.label} type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                        onClick={() => handleQuickAction(action.message)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:shadow-md text-[12px] font-medium transition-all cursor-pointer group text-left">
                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors flex-shrink-0">
                          <action.icon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.filter((m) => m.role !== "system").map((message) => (
                <MessageBubble key={message.id} role={message.role} content={message.content} cards={message.cards} />
              ))}

              {isLoading && <TypingIndicator />}
              {showRating && messages.length > 2 && <RatingStars onRate={handleRate} />}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-100 z-10">
              <form onSubmit={handleSubmit} className="p-3">
                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 transition-all shadow-sm" style={{ outline: "none" }}>
                  <textarea
                    ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta aquí..." rows={1}
                    className="flex-1 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 resize-none max-h-[120px] min-h-[24px] px-2 py-1.5 leading-relaxed"
                    style={{ fontFamily: "inherit", border: "none", outline: "none", boxShadow: "none" }}
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-lg transition-all flex-shrink-0 flex items-center justify-center h-[40px] w-[40px] ${
                      input.trim() && !isLoading
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                    style={{ border: "none", outline: "none" }}>
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
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("ChatWidget Error Boundary Caught:", error, errorInfo); }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function ChatWidget() {
  return (
    <ChatErrorBoundary>
      <ChatWidgetInner />
    </ChatErrorBoundary>
  );
}
