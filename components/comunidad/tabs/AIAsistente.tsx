"use client";

import { useChat } from "@ai-sdk/react";
import { 
  Bot, User, Sparkles, AlertCircle, Copy, Check, 
  RotateCcw, Plus, Search, MessageSquare, Trash2, 
  PanelLeftClose, PanelLeft, Zap, Code, BookOpen, 
  ArrowUp, Paperclip, X, Loader2, Lock,
  ChevronDown, Edit3, Globe, Terminal, Mic, Sun, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { 
  getAIConversations, 
  getAIMessages, 
  createAIConversation, 
  deleteAIConversation, 
  updateAIConversationTitle 
} from "@/lib/supabase/comunidad-ai";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIAsistenteProps {
  isRestricted?: boolean;
}

const MODELS = [
  { id: "llama-3-8b", name: "Meta Llama 3 8B", desc: "Gratuito y veloz", badge: "Free" },
  { id: "gemini-1.5-flash", name: "Google Gemini 1.5 Flash", desc: "Multimodal y analítico", badge: "Flash" },
  { id: "gpt-4o-mini", name: "OpenAI GPT-4o Mini", desc: "Alta precisión y eficiente", badge: "Precise" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", desc: "Máximo nivel de programación", badge: "Premium" },
];

export default function AIAsistente({ isRestricted }: AIAsistenteProps = {}) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("programbi_chat_model") || "llama-3-8b";
    }
    return "llama-3-8b";
  });
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Capabilities toggles (OpenChat Style)
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [codeInterpreterEnabled, setCodeInterpreterEnabled] = useState(false);

  const chatHook: any = useChat({
    endpoint: "/api/chat",
    body: { conversationId: activeConversationId, model: selectedModel },
    id: activeConversationId || "new",
  } as any);
  
  const { messages, input = '', handleInputChange, handleSubmit, isLoading, error, setMessages } = chatHook;
  const reload = chatHook.reload;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const convs = await getAIConversations();
      setConversations(convs);
    } catch (err) {
      console.error("Error loading conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (convId: string) => {
    setActiveConversationId(convId);
    setLoadingMessages(true);
    setIsFirstMessage(false);
    try {
      const msgs = await getAIMessages(convId);
      const formatted: any[] = msgs.map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: new Date(m.created_at),
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (form) form.requestSubmit();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setIsFirstMessage(true);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteAIConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const startRenaming = (convId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(convId);
    setEditingTitle(title);
  };

  const saveRename = async (convId: string) => {
    if (!editingTitle.trim()) return;
    try {
      await updateAIConversationTitle(convId, editingTitle);
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: editingTitle } : c));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = (input || '').trim();
    if (!currentInput) return;

    if (!activeConversationId) {
      try {
        const title = currentInput.substring(0, 60) || "Nueva Conversación";
        const newId = await createAIConversation(title);
        setActiveConversationId(newId);
        setIsFirstMessage(false);
        
        setConversations(prev => [{
          id: newId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, ...prev]);

        chatHook.handleSubmit(e, {
          body: { conversationId: newId, model: selectedModel },
        });
      } catch (err) {
        console.error("Error creating conversation:", err);
      }
    } else {
      chatHook.handleSubmit(e, {
        body: { conversationId: activeConversationId, model: selectedModel },
      });
    }
  };

  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days <= 7) return "Esta semana";
    if (days <= 30) return "Este mes";
    return "Anteriores";
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped: Record<string, Conversation[]> = {};
  filteredConversations.forEach(c => {
    const key = getRelativeDate(c.updated_at || c.created_at);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  const isEmpty = messages.length === 0 && !loadingMessages;
  const currentModelObj = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("programbi_chat_model", modelId);
    setModelDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Color classes mapping based on active Theme (OpenChat styling)
  const colors = {
    bgMain: theme === "dark" ? "bg-[#212121]" : "bg-white",
    bgSidebar: theme === "dark" ? "bg-[#171717] border-zinc-800" : "bg-[#f9f9f9] border-zinc-200/80",
    textSidebarHeader: theme === "dark" ? "text-zinc-400" : "text-zinc-500",
    textSidebarItem: theme === "dark" ? "text-zinc-300 hover:text-white" : "text-zinc-700 hover:text-zinc-900",
    sidebarActive: theme === "dark" ? "bg-zinc-800 text-white" : "bg-zinc-200/60 text-zinc-900 font-semibold",
    textMain: theme === "dark" ? "text-zinc-100" : "text-zinc-800",
    borderHeader: theme === "dark" ? "border-zinc-800" : "border-zinc-100",
    headerBg: theme === "dark" ? "bg-[#212121]/95" : "bg-white/95",
    btnSecondary: theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800",
    pillBg: theme === "dark" ? "bg-[#2f2f2f] border-zinc-700/60" : "bg-[#f4f4f4] border-zinc-200/80",
    messageUserBg: "transparent",
    messageAssistantBg: theme === "dark" ? "bg-[#2f2f2f]/40 border-y border-zinc-800/40" : "bg-[#f9f9f9] border-y border-zinc-100",
    inputBg: theme === "dark" ? "bg-[#2f2f2f] border-zinc-700/60 focus-within:border-zinc-600 focus-within:bg-[#2f2f2f]" : "bg-[#f4f4f4] border-zinc-200/80 focus-within:border-zinc-300 focus-within:bg-white",
    inputText: theme === "dark" ? "text-zinc-100 placeholder-zinc-500" : "text-zinc-800 placeholder-zinc-400",
    cardBg: theme === "dark" ? "bg-[#2f2f2f]/40 border-zinc-800 hover:border-zinc-700 hover:bg-[#2f2f2f]/80" : "bg-white border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/60",
    scrollbarThumb: theme === "dark" ? "bg-zinc-800" : "bg-zinc-300",
  };

  return (
    <div className={`flex flex-1 min-h-0 h-full relative font-sans transition-colors duration-200 ${colors.bgMain} ${colors.textMain}`}>
      
      {/* ─── SIDEBAR BACKDROP (Mobile overlay) ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR (OpenChat Aesthetics) ─── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`h-full border-r flex flex-col overflow-hidden absolute md:relative z-50 shrink-0 ${colors.bgSidebar}`}
          >
            {/* Header Sidebar: Toggle Sidebar & New Chat */}
            <div className="p-3.5 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className={`p-2 rounded-xl border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
                title="Cerrar barra lateral"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNewChat} 
                className={`p-2 rounded-xl border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
                title="Nuevo chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Búsqueda en historial */}
            <div className="px-3.5 mb-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none transition-all ${colors.inputBg} ${colors.inputText}`}
                />
              </div>
            </div>

            <div className="px-3.5 mb-2 shrink-0">
              <button 
                onClick={handleNewChat} 
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm hover:shadow cursor-pointer bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 active:scale-[0.98]`}
              >
                <Plus className="w-4 h-4 text-purple-500" />
                Nuevo Chat
              </button>
            </div>

            {/* Listado de Historial */}
            <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4 custom-scrollbar">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-400 font-medium">
                  Sin historial de chat
                </div>
              ) : (
                Object.entries(grouped).map(([date, chats]) => (
                  <div key={date} className="space-y-1">
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-3 mb-1 ${colors.textSidebarHeader}`}>{date}</div>
                    <div className="space-y-0.5">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => { 
                            if (editingId !== chat.id) {
                              loadConversation(chat.id); 
                              if (window.innerWidth < 768) setSidebarOpen(false); 
                            }
                          }}
                          onDoubleClick={(e) => startRenaming(chat.id, chat.title, e)}
                          className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all relative cursor-pointer border-none bg-transparent outline-none
                            ${activeConversationId === chat.id
                              ? colors.sidebarActive
                              : `border border-transparent ${colors.textSidebarItem}`}`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                          
                          {editingId === chat.id ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={() => saveRename(chat.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(chat.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              autoFocus
                              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded px-1.5 py-0.5 text-xs text-zinc-900 dark:text-zinc-100 w-full focus:outline-none focus:border-purple-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate flex-1 font-medium">{chat.title}</span>
                          )}

                          {editingId !== chat.id && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1 ml-auto">
                              <button 
                                className="p-0.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-none bg-transparent cursor-pointer" 
                                onClick={(e) => startRenaming(chat.id, chat.title, e)}
                                title="Renombrar"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button 
                                className="p-0.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-none bg-transparent cursor-pointer" 
                                onClick={(e) => handleDeleteConversation(chat.id, e)}
                                title="Eliminar"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer de Sidebar */}
            <div className="p-3.5 shrink-0 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  IA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">ProgramBI OpenChat</div>
                  <div className="text-[10px] text-zinc-400 font-medium">Versión Integrada</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {isRestricted && (
          <div className="absolute inset-0 z-30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[8px] flex flex-col items-center justify-center p-6">
             <div className="w-14 h-14 bg-white dark:bg-zinc-850 rounded-2xl shadow-lg flex items-center justify-center mb-4 text-purple-500 border border-zinc-100 dark:border-zinc-800">
               <Lock className="w-6 h-6 animate-pulse" />
             </div>
             <h3 className="text-lg font-black mb-1">Asistente IA Premium</h3>
             <p className="text-xs text-zinc-500 text-center max-w-xs mb-5">Suscríbete a un plan de la comunidad para hacer preguntas, generar consultas SQL o depurar código.</p>
             <a href="/comunidad" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-none no-underline">Ver Planes de Suscripción</a>
          </div>
        )}

        {/* HEADER (Barra Superior de Control) */}
        <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 z-20 sticky top-0 ${colors.headerBg} ${colors.borderHeader}`}>
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* Selector de Modelos con estilo Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-xs font-bold cursor-pointer ${colors.pillBg}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>{currentModelObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-1.5 mb-1.5">
                      Seleccionar Inteligencia
                    </div>
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        className="w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left border-none bg-transparent cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{m.name}</span>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider
                              ${m.id === 'claude-3-5-sonnet' 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40' 
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                              {m.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">{m.desc}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Opciones y Toggles de Cabecera (OpenChat Style) */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors
                ${webSearchEnabled ? 'text-purple-500 bg-purple-500/10' : colors.btnSecondary}`}
              title="Buscar en la Web"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCodeInterpreterEnabled(!codeInterpreterEnabled)}
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors
                ${codeInterpreterEnabled ? 'text-emerald-500 bg-emerald-500/10' : colors.btnSecondary}`}
              title="Intérprete de Código"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button 
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
              title="Modo de Voz"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {/* Toggle Tema (Claro / Oscuro) */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
              title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <button 
              onClick={handleNewChat}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all border-none flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Chat
            </button>
          </div>
        </div>

        {/* Historial de Mensajes / Bienvenida */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingMessages ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl w-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-purple-500/10">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">¿Cómo puedo ayudarte hoy?</h1>
                <p className="text-zinc-400 mb-8 text-xs max-w-sm mx-auto font-medium">
                  Tu copiloto IA inteligente integrado en ProgramBI, especializado en SQL, Python, Power BI y análisis de datos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto">
                  {[
                    { icon: Code, label: "Funciones Ventana en SQL", desc: "Consultas avanzadas con ejemplos detallados" },
                    { icon: Zap, label: "Optimizar código en Python", desc: "Mejores prácticas para optimizar scripts" },
                    { icon: BookOpen, label: "Crear dashboard financiero PBI", desc: "Guía de modelamiento estrella y diseño" },
                    { icon: Sparkles, label: "Normalización de Base de Datos", desc: "Diferencia entre 1NF, 2NF y 3NF" },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => {
                          const ta = textareaRef.current;
                          if (ta) {
                            const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                            if (setter) { 
                              setter.call(ta, s.label); 
                              ta.dispatchEvent(new Event("input", { bubbles: true })); 
                              ta.focus(); 
                            }
                          }
                        }}
                        className={`group flex flex-col items-start gap-1 p-3.5 rounded-2xl text-left cursor-pointer transition-all ${colors.cardBg}`}
                      >
                        <Icon className="w-4 h-4 text-zinc-450 group-hover:text-purple-500 transition-colors" />
                        <span className="text-xs font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{s.label}</span>
                        <span className="text-[10px] text-zinc-400">{s.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {messages.map((m: any) => (
                <div key={m.id} className={`w-full py-6 flex justify-center border-b transition-colors border-zinc-100 dark:border-zinc-800/40 ${m.role === "assistant" ? colors.messageAssistantBg : colors.messageUserBg}`}>
                  <div className="max-w-3xl w-full px-4 flex gap-4">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm
                      ${m.role === "user"
                        ? "bg-zinc-150 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                        : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"}`}>
                      {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0 group">
                      <div className="text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">{m.role === "user" ? "Tú" : "Asistente IA"}</div>
                      
                      <div className="text-[13.5px] leading-relaxed font-normal whitespace-pre-wrap">
                        {m.role === "user" ? (
                          <p className="font-semibold text-zinc-850 dark:text-zinc-100">{m.content}</p>
                        ) : (
                          renderMessageContent(m.content)
                        )}
                      </div>

                      {/* Botones de acción del mensaje */}
                      {m.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => copyToClipboard(m.content, m.id)} 
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => reload()} 
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> 
                            <span>Regenerar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loader de streaming */}
              {isLoading && (
                <div className={`w-full py-6 flex justify-center border-b border-zinc-100 dark:border-zinc-800/40 ${colors.messageAssistantBg}`}>
                  <div className="max-w-3xl w-full px-4 flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><Bot className="w-4 h-4" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider font-semibold">Asistente IA</div>
                      <div className="flex items-center gap-1 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Errores */}
              {error && (
                <div className="w-full flex justify-center py-4">
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 px-4 py-3 rounded-2xl text-xs flex items-center gap-3 max-w-md shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-bold">Error de conexión</div>
                      <div className="text-[10px] text-red-400 dark:text-red-300 mt-0.5">Ocurrió un error al contactar al modelo. Intenta nuevamente.</div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-6" />
            </div>
          )}
        </div>

        {/* ─── INPUT (Píldora Flotante OpenChat style) ─── */}
        <div className="shrink-0 pb-5 pt-2 px-4 border-t border-zinc-100 dark:border-zinc-800/40">
          <div className="max-w-3xl mx-auto w-full">
            <div className={`border rounded-2xl transition-all overflow-hidden shadow-sm flex items-end ${colors.inputBg}`}>
              <form onSubmit={handleFormSubmit} className="relative flex items-end w-full">
                <button
                  type="button"
                  className={`p-2 ml-2.5 mb-2.5 rounded-xl border-none bg-transparent cursor-pointer transition-colors ${colors.btnSecondary}`}
                  title="Adjuntar archivos (Simulado)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <textarea
                  ref={textareaRef}
                  name="prompt"
                  value={input || ''}
                  onChange={handleInputChange}
                  onKeyDown={onKeyDown}
                  placeholder={`Escribe una pregunta para ${currentModelObj.name}...`}
                  className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-3.5 px-2.5 pr-20 text-xs custom-scrollbar max-h-[160px] min-h-[46px] border-none ${colors.inputText}`}
                  rows={1}
                />
                
                <div className="absolute right-3.5 bottom-2.5 flex items-center gap-2">
                  <span className="text-[8px] font-extrabold text-zinc-400 px-2 py-1 bg-zinc-200/50 dark:bg-zinc-800 rounded-lg select-none">
                    {currentModelObj.badge}
                  </span>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !(input || '').trim()}
                    className="p-1.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm active:scale-95 border-none cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-2 text-center text-[9px] text-zinc-400">
              El Asistente IA puede cometer errores. Verifica la información importante.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── NATIVE REACT MARKDOWN RENDERERS ─── */

function renderMessageContent(content: string): React.ReactNode {
  if (!content) return null;
  const parts = content.split("```");
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // Code block
      const lines = part.split("\n");
      const language = lines[0].trim() || "code";
      const code = lines.slice(1).join("\n").trim();
      return <CodeBlock key={index} language={language} code={code} />;
    } else {
      // Markdown Text
      return <TextBlock key={index} text={part} />;
    }
  });
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden my-4 border border-zinc-200/50 dark:border-zinc-800 shadow-sm max-w-full">
      <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900 border-b border-zinc-800 text-zinc-450 text-[10px]">
        <span className="font-mono font-semibold uppercase tracking-wider text-[9px] text-zinc-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-zinc-950 overflow-x-auto text-xs leading-relaxed max-w-full">
        <pre className="font-mono text-zinc-200 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol', items: string[] } | null = null;

  const pushList = () => {
    if (currentList) {
      const ListTag = currentList.type;
      const listStyle = currentList.type === 'ul' ? 'list-disc' : 'list-decimal';
      elements.push(
        <ListTag key={elements.length} className={`${listStyle} list-inside pl-4 my-2.5 space-y-1.5 text-zinc-650 dark:text-zinc-300`}>
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineStyles(item)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith("### ")) {
      pushList();
      elements.push(
        <h3 key={elements.length} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
          {renderInlineStyles(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      pushList();
      elements.push(
        <h2 key={elements.length} className="text-base font-black text-zinc-900 dark:text-zinc-50 mt-5 mb-2">
          {renderInlineStyles(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      pushList();
      elements.push(
        <h1 key={elements.length} className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-6 mb-3">
          {renderInlineStyles(trimmed.slice(2))}
        </h1>
      );
    }
    // Bullet lists
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.slice(2);
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(content);
      } else {
        pushList();
        currentList = { type: 'ul', items: [content] };
      }
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, "");
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(content);
      } else {
        pushList();
        currentList = { type: 'ol', items: [content] };
      }
    }
    // Regular paragraph
    else {
      if (trimmed === "") {
        pushList();
      } else {
        if (currentList) {
          pushList();
        }
        elements.push(
          <p key={elements.length} className="mb-2 leading-relaxed text-zinc-650 dark:text-zinc-300">
            {renderInlineStyles(line)}
          </p>
        );
      }
    }
  }
  pushList();
  return <>{elements}</>;
}

function renderInlineStyles(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-zinc-900 dark:text-zinc-105">{part.slice(2, -2)}</strong>;
    } else if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
