"use client";

import React, { Component, ErrorInfo, ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  ExternalLink,
  ArrowRight,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  cards?: string[];
  scheduleCards?: boolean;
  isStreaming?: boolean;
}

/* ─── Course Card Data ─────────────────────────────────────────── */
const COURSE_CARDS: Record<string, {
  slug: string;
  title: string;
  shortDesc: string;
  techStack: string[];
  hours: number;
  color: string;
  imageUrl: string;
}> = {
  "analisis-de-datos": {
    slug: "analisis-de-datos", title: "Análisis de Datos",
    shortDesc: "Programa integral: SQL + Power BI + Python",
    techStack: ["SQL", "Power BI", "Python"], hours: 144, color: "#1890FF",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  },
  "power-bi": {
    slug: "power-bi", title: "Power BI",
    shortDesc: "Dashboards interactivos y DAX avanzado",
    techStack: ["Power Query", "DAX", "Dashboards"], hours: 48, color: "#F2C811",
    imageUrl: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Tamano_personalizado_1_9d2f2efd-3f0e-40d7-a62b-fb7a0ba08d83.png?v=1720500191",
  },
  "python": {
    slug: "python", title: "Python para Datos",
    shortDesc: "Análisis avanzado con Pandas y visualización",
    techStack: ["Python", "Pandas", "Matplotlib"], hours: 48, color: "#3776AB",
    imageUrl: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-95e6ef6f-0d9e-4e69-a5a7-1a3f7a4c0c45_7bda5e0b-a12a-4293-81c0-8c8fb3c345aa.png?v=1736654931",
  },
  "sql-server": {
    slug: "sql-server", title: "SQL Server",
    shortDesc: "Consultas, stored procedures y optimización",
    techStack: ["T-SQL", "SSMS", "Stored Procedures"], hours: 48, color: "#64748B",
    imageUrl: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Tamano_personalizado_1.png?v=1720132741",
  },
  "excel": {
    slug: "excel", title: "Excel Avanzado",
    shortDesc: "Tablas dinámicas, Power Query y VBA",
    techStack: ["Excel", "Power Query", "VBA"], hours: 36, color: "#217346",
    imageUrl: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Image_202511180217.png?v=1763443093",
  },
  "ia-productividad": {
    slug: "ia-productividad", title: "IA en Productividad",
    shortDesc: "Prompt Engineering, Vibe Coding y Agentes IA",
    techStack: ["ChatGPT", "Copilot", "Agentes IA"], hours: 24, color: "#7C3AED",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop",
  },
  "machine-learning": {
    slug: "machine-learning", title: "Machine Learning",
    shortDesc: "Modelos predictivos y redes neuronales",
    techStack: ["Python", "Scikit-learn", "TensorFlow"], hours: 48, color: "#9333EA",
    imageUrl: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-f5cacc2d-9ca1-4d23-8361-fb8a615a8943.png?v=1739059469",
  },
  "power-automate": {
    slug: "power-automate", title: "Power Automate & RPA",
    shortDesc: "Automatiza procesos sin código con IA",
    techStack: ["RPA", "Cloud Flows", "Copilot IA"], hours: 48, color: "#0078D4",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
  },
  "analitica-mineria": {
    slug: "analitica-mineria", title: "Analítica para Minería",
    shortDesc: "Optimización y toma de decisiones en minería",
    techStack: ["Excel", "Power BI", "SQL", "Python"], hours: 144, color: "#B45309",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&auto=format&fit=crop",
  },
  "analitica-financiera": {
    slug: "analitica-financiera", title: "Analítica Financiera",
    shortDesc: "Reportes contables, riesgo y dashboards",
    techStack: ["Excel", "SQL", "Power BI", "Python"], hours: 144, color: "#1E3A8A",
    imageUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=400&auto=format&fit=crop",
  },
};

/* ─── Pre-built responses ──────────────────────────────────────── */
const PREBUILT_RESPONSES: Record<string, { text: string; cards: string[]; scheduleCards?: boolean }> = {
  "¿Qué cursos tienen disponibles?": {
    text: `¡Tenemos una variedad de cursos diseñados para impulsar tu carrera en **Data Analytics**! 🚀\n\nAquí te muestro nuestros cursos principales:`,
    cards: ["analisis-de-datos", "power-bi", "python", "sql-server", "excel", "ia-productividad", "machine-learning", "power-automate"],
  },
  "¿Cuándo empiezan los próximos cursos?": {
    text: `📅 Los horarios se actualizan constantemente. Normalmente tenemos clases **Martes y Jueves** o **Lunes y Miércoles**.\n\nAquí puedes ver los horarios según tu zona horaria 👇`,
    cards: [],
    scheduleCards: true,
  },
  "¿Tienen alguna promoción activa?": {
    text: `🏷️ ¡Sí! Nuestro programa más completo es el **Curso de Análisis de Datos**, que tiene **3 niveles** (SQL, Power BI y Python), cada uno de **48 horas**.\n\nTambién tenemos cursos individuales de **48 horas** con excelentes descuentos.\n\nPara conocer los precios y ofertas actuales, regístrate en la página del curso que te interese 👇`,
    cards: ["analisis-de-datos"],
  },
  "Quiero hablar con un asesor": {
    text: `¡Por supuesto! 😊 Puedes contactar a nuestro equipo:\n\n📱 **WhatsApp**: [+56 9 3540 9699](https://wa.me/56935409699)\n📧 **Email**: contacto@programbi.cl\n\n¿Hay algo más en lo que pueda ayudarte?`,
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
  getItem: (key: string) => { if (typeof window === "undefined") return null; try { return window.localStorage.getItem(key); } catch { return null; } },
  setItem: (key: string, value: string) => { if (typeof window === "undefined") return; try { window.localStorage.setItem(key, value); } catch {} },
  removeItem: (key: string) => { if (typeof window === "undefined") return; try { window.localStorage.removeItem(key); } catch {} },
};

let memoryVisitorId = "";
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = safeStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });
      safeStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch { if (!memoryVisitorId) memoryVisitorId = "anon-" + Math.random().toString(36).substring(7); return memoryVisitorId; }
}

let messageCounter = 0;
function generateId(): string { return `msg-${Date.now()}-${++messageCounter}`; }

function renderSimpleMarkdown(text: string) {
  if (!text) return "";
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br />");
  html = html.replace(/(?:^|<br \/>)(?:[-•]|\d+\.)\s+(.+?)(?=<br \/>|$)/g,
    '<div style="display:flex;gap:8px;margin-top:6px"><span style="color:#3b82f6;font-weight:700">•</span><span>$1</span></div>');
  return html;
}

function extractCourseWidgets(text: string): { cleanText: string; cardSlugs: string[] } {
  const slugs: string[] = [];
  const cleanText = text.replace(/\(\(([a-z0-9-]+)\)\)/g, (_m, slug) => {
    if (COURSE_CARDS[slug] && !slugs.includes(slug)) slugs.push(slug);
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
            <Star className={`w-5 h-5 transition-all ${star <= (hover || selected) ? "text-yellow-400 fill-yellow-400 scale-110" : "text-slate-300"}`} />
          </button>
        ))}
      </div>
      {selected > 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full mt-1">¡Gracias! 🎉</motion.p>}
    </motion.div>
  );
}

/* ─── Course Card Widget ───────────────────────────────────────── */
function CourseCard({ slug }: { slug: string }) {
  const course = COURSE_CARDS[slug];
  if (!course) return null;

  return (
    <motion.a href={`/cursos/${course.slug}`} target="_blank" rel="noopener"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="block rounded-xl border border-slate-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden cursor-pointer group no-underline">
      <div className="flex items-stretch">
        {/* Course Image */}
        <div className="w-[72px] flex-shrink-0 relative overflow-hidden">
          <img src={course.imageUrl} alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 p-2.5">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-[12px] font-bold text-slate-900 truncate leading-tight">{course.title}</h4>
            <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors group-hover:translate-x-0.5" />
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{course.shortDesc}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{course.hours}h</span>
            <div className="flex flex-wrap gap-1">
              {course.techStack.slice(0, 3).map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 leading-none">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Schedule Card with Timezone ──────────────────────────────── */
const TIMEZONES = [
  { label: "Chile", offset: -4, flag: "🇨🇱" },
  { label: "Colombia / Perú / Ecuador", offset: -5, flag: "🇨🇴" },
  { label: "México Centro", offset: -6, flag: "🇲🇽" },
  { label: "Argentina", offset: -3, flag: "🇦🇷" },
  { label: "Bolivia / Venezuela", offset: -4, flag: "🇧🇴" },
  { label: "República Dominicana", offset: -4, flag: "🇩🇴" },
  { label: "España", offset: 2, flag: "🇪🇸" },
];

const SCHEDULE_DATA = [
  { course: "Análisis de Datos (SQL)", days: "Martes y Jueves", chileTime: "19:30 - 21:30", slug: "analisis-de-datos" },
  { course: "Power BI", days: "Lunes y Miércoles", chileTime: "19:30 - 21:30", slug: "power-bi" },
  { course: "SQL Server", days: "Martes y Jueves", chileTime: "19:30 - 21:30", slug: "sql-server" },
  { course: "Python para Datos", days: "Lunes y Miércoles", chileTime: "19:30 - 21:30", slug: "python" },
];

function convertTime(chileTime: string, targetOffset: number): string {
  const chileOffset = -4;
  const diff = targetOffset - chileOffset;
  return chileTime.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => {
    let hour = (parseInt(h) + diff + 24) % 24;
    return `${hour.toString().padStart(2, "0")}:${m}`;
  });
}

function ScheduleCards() {
  const [tz, setTz] = useState(0);
  const selected = TIMEZONES[tz];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 mt-1">
      {/* Timezone selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500 font-medium flex-shrink-0">🌎 Zona:</span>
        <select value={tz} onChange={(e) => setTz(Number(e.target.value))}
          className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium flex-1 cursor-pointer"
          style={{ outline: "none" }}>
          {TIMEZONES.map((t, i) => (
            <option key={t.label} value={i}>{t.flag} {t.label}</option>
          ))}
        </select>
      </div>

      {/* Schedule cards */}
      {SCHEDULE_DATA.map((s) => (
        <a key={s.slug} href={`/cursos/${s.slug}`} target="_blank" rel="noopener"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all no-underline group">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-800 truncate">{s.course}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">📆 {s.days}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-[12px] font-bold" style={{ color: "#1890ff" }}>
              {convertTime(s.chileTime, selected.offset)}
            </p>
            <p className="text-[9px] text-slate-400">{selected.flag} {selected.label.split(" / ")[0]}</p>
          </div>
        </a>
      ))}

      <p className="text-[10px] text-slate-400 text-center italic">Los horarios pueden variar. Consulta la web para fechas exactas de inicio.</p>
    </motion.div>
  );
}

/* ─── Message Bubble ─────────────────────────────────────── */
function MessageBubble({ role, content, cards, scheduleCards, isStreaming }: { role: string; content: string; cards?: string[]; scheduleCards?: boolean; isStreaming?: boolean }) {
  const isUser = role === "user";
  const { cleanText, cardSlugs } = isUser ? { cleanText: content, cardSlugs: [] } : extractCourseWidgets(content || "");
  const allCards = [...cardSlugs, ...(cards || [])];

  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
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
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-md"
              : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60"
          }`}>
            {isUser ? (
              <span className="whitespace-pre-wrap">{cleanText}</span>
            ) : (
              <div className={`chatbot-markdown space-y-2 ${isStreaming ? "chat-streaming-msg" : "chat-streaming-msg done"}`}
                dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(cleanText) }} />
            )}
          </div>
        )}
        {allCards.length > 0 && !isStreaming && (
          <div className="flex flex-col gap-1.5">
            {allCards.map((s) => <CourseCard key={s} slug={s} />)}
          </div>
        )}
        {scheduleCards && !isStreaming && <ScheduleCards />}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN CHAT WIDGET                                                */
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

  const [visitorId, setVisitorId] = useState("");
  useEffect(() => { setVisitorId(getVisitorId()); const s = safeStorage.getItem(CONVERSATION_ID_KEY); if (s) setConversationId(s); }, []);

  useEffect(() => {
    try { const s = safeStorage.getItem(CHAT_HISTORY_KEY); if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) { setMessages(p.map((m: ChatMessage) => ({ ...m, isStreaming: false }))); setShowQuickActions(false); setIsFirstOpen(false); } } } catch {}
  }, []);

  const saveMessages = useCallback((msgs: ChatMessage[]) => {
    try { const clean = msgs.map(({ isStreaming, ...rest }) => rest).slice(-50); safeStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(clean)); } catch {}
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen]);
  useEffect(() => { if (!isOpen && messages.length > 0 && messages[messages.length - 1]?.role === "assistant") setHasNewMessage(true); }, [messages, isOpen]);

  /* ─── Handle pre-built quick action response with typing delay ── */
  const handlePrebuilt = useCallback((userContent: string) => {
    const prebuilt = PREBUILT_RESPONSES[userContent]; if (!prebuilt) return false;

    const userMsg: ChatMessage = { id: generateId(), role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setShowQuickActions(false); setIsFirstOpen(false); setIsLoading(true);

    // Simulate a 3-second typing delay
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: generateId(), role: "assistant", content: prebuilt.text,
        cards: prebuilt.cards, scheduleCards: prebuilt.scheduleCards,
      };
      setMessages((prev) => { const upd = [...prev, assistantMsg]; saveMessages(upd); return upd; });
      setIsLoading(false);
    }, 3000);

    return true;
  }, [messages, saveMessages]);

  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim() || isLoading) return;
    if (handlePrebuilt(userContent)) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController(); abortControllerRef.current = controller;

    const userMsg: ChatMessage = { id: generateId(), role: "user", content: userContent.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setIsLoading(true); setShowQuickActions(false); setIsFirstOpen(false);
    if (inputRef.current) inputRef.current.style.height = "auto";

    const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }));

    try {
      const timeoutId = setTimeout(() => controller.abort(), 55000);
      const response = await fetch("/api/chatbot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, conversationId, visitorId, sourcePage: pathname }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== "pending" && newConvId !== conversationId) {
        setConversationId(newConvId); safeStorage.setItem(CONVERSATION_ID_KEY, newConvId);
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const aMsg: ChatMessage = { id: generateId(), role: "assistant", content: "", isStreaming: true };
      setMessages([...updated, aMsg]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No body");
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const c = [...prev]; const li = c.length - 1;
          if (li >= 0 && c[li].role === "assistant") c[li] = { ...c[li], content: fullText, isStreaming: true };
          return c;
        });
      }

      // Mark as done streaming
      setMessages((prev) => {
        const c = [...prev]; const li = c.length - 1;
        if (li >= 0 && c[li].role === "assistant") {
          c[li] = { ...c[li], isStreaming: false,
            content: fullText.trim() || "Disculpa, no pude generar una respuesta. 😔 Contáctanos por **WhatsApp** al [+56 9 3540 9699](https://wa.me/56935409699)."
          };
        }
        saveMessages(c); return c;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);
      const errMsg: ChatMessage = { id: generateId(), role: "assistant",
        content: "Lo siento, hubo un error. 😔 Por favor, intenta nuevamente o contáctanos por **WhatsApp** al [+56 9 3540 9699](https://wa.me/56935409699)." };
      setMessages((prev) => { const u = [...prev, errMsg]; saveMessages(u); return u; });
    } finally { setIsLoading(false); abortControllerRef.current = null; }
  }, [messages, isLoading, conversationId, visitorId, pathname, saveMessages, handlePrebuilt]);

  const handleOpen = () => { setIsOpen(true); setHasNewMessage(false); };
  const handleClose = () => { setIsOpen(false); saveMessages(messages); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleNewChat = () => {
    abortControllerRef.current?.abort();
    setMessages([]); setInput(""); setConversationId(null); setShowQuickActions(true);
    setShowRating(false); setIsFirstOpen(true); setIsLoading(false);
    safeStorage.removeItem(CHAT_HISTORY_KEY); safeStorage.removeItem(CONVERSATION_ID_KEY);
    inputRef.current?.focus();
  };
  const handleRate = async (r: number) => { if (!conversationId) return; try { await fetch("/api/chatbot", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, rating: r }) }); } catch {} };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; };

  return (
    <>
      {/* FAB Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button type="button" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }} onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[9998] group cursor-pointer border-none bg-transparent" aria-label="Abrir chat">

            {/* Animated pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(24,144,255,0.4)", width: 64, height: 64, top: -2, left: -2 }}
              animate={{ scale: [1, 1.35, 1.35], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Glow */}
            <div className="absolute inset-0 rounded-full blur-xl scale-150 group-hover:scale-[1.8] transition-transform duration-500" style={{ background: "rgba(24,144,255,0.2)" }} />

            {/* Main button */}
            <div className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 group-active:scale-95 group-active:translate-y-0"
              style={{ background: "#1890ff", boxShadow: "0 8px 24px rgba(24,144,255,0.4)" }}>
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-white/20 to-transparent" />
              <Sparkles className="w-6 h-6 text-white drop-shadow relative z-10" />
            </div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className="absolute right-[72px] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
            >
              ¿Tienes dudas? 💬
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45" />
            </motion.div>

            {/* Notification Badge */}
            {hasNewMessage && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-md z-20">
                <span className="text-[10px] font-bold text-white leading-none">1</span>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9998] w-[400px] h-[650px] max-h-[85vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15 border border-slate-200/60
              max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:left-0 max-[480px]:w-full max-[480px]:h-[85dvh] max-[480px]:max-h-[85dvh] max-[480px]:rounded-b-none">

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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />En línea
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleNewChat} className="p-2 rounded-lg bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors text-slate-400 hover:text-blue-600" title="Reiniciar">
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5"><Bot className="w-3.5 h-3.5 text-white" /></div>
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
                    {QUICK_ACTIONS.map((a, i) => (
                      <motion.button key={a.label} type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                        onClick={() => handleQuickAction(a.message)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:shadow-md text-[12px] font-medium transition-all cursor-pointer group text-left">
                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors flex-shrink-0">
                          <a.icon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        {a.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {messages.filter((m) => m.role !== "system").map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} cards={m.cards} scheduleCards={m.scheduleCards} isStreaming={m.isStreaming} />
              ))}
              {isLoading && <TypingIndicator />}
              {showRating && messages.length > 2 && <RatingStars onRate={handleRate} />}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-100 z-10">
              <form onSubmit={handleSubmit} className="p-3">
                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 transition-all shadow-sm" style={{ outline: "none" }}>
                  <textarea ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta aquí..." rows={1}
                    className="flex-1 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 resize-none max-h-[120px] min-h-[24px] px-2 py-1.5 leading-relaxed"
                    style={{ fontFamily: "inherit", border: "none", outline: "none", boxShadow: "none" }} disabled={isLoading} />
                  <button type="submit" disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-lg transition-all flex-shrink-0 flex items-center justify-center h-[40px] w-[40px] ${
                      input.trim() && !isLoading ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`} style={{ border: "none", outline: "none" }}>
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

  function handleQuickAction(message: string) { sendMessage(message); }
}

class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("ChatWidget Error:", error, errorInfo); }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function ChatWidget() {
  return <ChatErrorBoundary><ChatWidgetInner /></ChatErrorBoundary>;
}
