"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { Bot, Send, User, Sparkles, AlertCircle, Copy, Check, RotateCcw, Plus, Search, MessageSquare, Trash2, MoreHorizontal, PanelLeftClose, PanelLeft, Zap, Code, BookOpen, ArrowUp, Paperclip, X, FileText, FileSpreadsheet, FileCode, Image as ImageIcon, File, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { getAIConversations, getAIMessages, createAIConversation, deleteAIConversation, updateAIConversationTitle } from "@/lib/supabase/comunidad-ai";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIAsistenteProps {
  isRestricted?: boolean;
}

export default function AIAsistente({ isRestricted }: AIAsistenteProps = {}) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const chatHook: any = useChat({
    endpoint: "/api/chat",
    body: { conversationId: activeConversationId },
    id: activeConversationId || "new",
  } as any);
  const { messages, input = '', handleInputChange, handleSubmit, isLoading, error, setMessages } = chatHook;
  const reload = chatHook.reload;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Load conversations on mount
  useEffect(() => {
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

  // Load messages when switching conversations
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
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
    setUploadedFiles([]);
    setIsFirstMessage(true);
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

  // Custom submit that creates conversation on first message
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = (input || '').trim();
    if (!currentInput && uploadedFiles.length === 0) return;

    // Create a new conversation if this is the first message
    if (!activeConversationId) {
      try {
        const title = currentInput.substring(0, 60) || "Nueva Conversación";
        const newId = await createAIConversation(title);
        setActiveConversationId(newId);
        setIsFirstMessage(false);
        
        // Add to local list
        setConversations(prev => [{
          id: newId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, ...prev]);

        // Now submit with the new conversation ID
        // We need to pass conversationId in the body
        chatHook.handleSubmit(e, {
          body: { conversationId: newId },
        });
      } catch (err) {
        console.error("Error creating conversation:", err);
      }
    } else {
      chatHook.handleSubmit(e);
    }

    setUploadedFiles([]);
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remainingSlots = 10 - uploadedFiles.length;
    let filesToAdd = Array.from(files);
    if (filesToAdd.length > remainingSlots) {
      alert(`Máximo 10 archivos. Se añadirán los ${remainingSlots} primeros.`);
      filesToAdd = filesToAdd.slice(0, remainingSlots);
    }
    if (filesToAdd.length === 0) { e.target.value = ''; return; }
    const newFiles: UploadedFile[] = filesToAdd.map(f => {
      const uf: UploadedFile = {
        id: Math.random().toString(36).slice(2, 9),
        name: f.name, size: f.size, type: f.type,
      };
      if (f.type.startsWith('image/')) uf.preview = URL.createObjectURL(f);
      return uf;
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string, name: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('spreadsheet') || name.endsWith('.csv') || name.endsWith('.xlsx')) return FileSpreadsheet;
    if (type.includes('javascript') || type.includes('python') || name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.sql')) return FileCode;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const getFileColor = (type: string, name: string) => {
    if (type.startsWith('image/')) return 'bg-pink-50 text-pink-500 border-pink-100';
    if (type.includes('spreadsheet') || name.endsWith('.csv') || name.endsWith('.xlsx')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (type.includes('javascript') || type.includes('python') || name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.sql')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (type.includes('pdf')) return 'bg-red-50 text-red-500 border-red-100';
    return 'bg-gray-50 text-gray-500 border-gray-200';
  };

  // Group conversations by relative date
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

  return (
    <div className="flex flex-1 min-h-0 h-full">
      
      {/* ─── SIDEBAR ─── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full bg-gray-50 border-r border-gray-200/80 flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-3 flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors">
                  <PanelLeftClose className="w-5 h-5" />
                </button>
                <button onClick={handleNewChat} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 transition-all"
                />
              </div>
            </div>

            <div className="px-3 mb-2">
              <button onClick={handleNewChat} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 bg-white shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Nuevo Chat
              </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-4 pb-2">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  No hay conversaciones aún
                </div>
              ) : (
                Object.entries(grouped).map(([date, chats]) => (
                  <div key={date}>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">{date}</div>
                    <div className="space-y-0.5">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => loadConversation(chat.id)}
                          className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all relative cursor-pointer
                            ${activeConversationId === chat.id
                              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"}`}
                        >
                          <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                          <span className="truncate flex-1 font-medium">{chat.title}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={(e) => handleDeleteConversation(chat.id, e)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* User Footer - pinned to bottom */}
            <div className="p-3 pt-2 shrink-0 mt-auto border-t border-gray-200/60">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">IA</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">Asistente IA</div>
                  <div className="text-[10px] text-gray-400 font-medium">ProgramBI</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {isRestricted && (
          <div className="absolute inset-0 z-50 border-l border-gray-100 bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center p-6">
             <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-blue">
               <Lock className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Asistente IA Premium</h3>
             <p className="text-gray-600 text-center max-w-sm mb-6">Suscríbete a un plan de la comunidad para hacer preguntas, generar consultas SQL, o recibir ayuda interactiva 24/7.</p>
             <a href="/comunidad" className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">Ver Planes</a>
          </div>
        )}

        {/* HEADER */}
        {/* Floating buttons when sidebar is closed */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-4 left-4 z-30 flex flex-col gap-2"
            >
              <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all hover:scale-105 active:scale-95">
                <PanelLeft className="w-[18px] h-[18px]" />
              </button>
              <button onClick={handleNewChat} className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all hover:scale-105 active:scale-95">
                <Plus className="w-[18px] h-[18px]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages / Welcome */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingMessages ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl w-full">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-blue/15">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">¿En qué puedo ayudarte?</h1>
                <p className="text-gray-400 mb-10 text-sm sm:text-base max-w-md mx-auto">
                  Tu asistente personal de Data Analytics, SQL, Python y Power BI.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {[
                    { icon: Code, label: "Explícame Window Functions", desc: "SQL avanzado paso a paso" },
                    { icon: Zap, label: "Optimiza mi script Python", desc: "Best practices de rendimiento" },
                    { icon: BookOpen, label: "Dashboard ejecutivo en PBI", desc: "Guía de diseño profesional" },
                    { icon: Sparkles, label: "Modelo de datos estrella", desc: "Star schema vs snowflake" },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => {
                          const ta = textareaRef.current;
                          if (ta) {
                            const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                            if (setter) { setter.call(ta, s.label); ta.dispatchEvent(new Event("input", { bubbles: true })); ta.focus(); }
                          }
                        }}
                        className="group flex flex-col items-start gap-1.5 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all text-left"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{s.label}</span>
                        <span className="text-xs text-gray-400">{s.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
              {messages.map((m: any) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm
                    ${m.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                      : "bg-gradient-to-br from-brand-blue to-indigo-600 text-white"}`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0 group">
                    <div className="text-xs font-bold text-gray-400 mb-1.5">{m.role === "user" ? "Tú" : "Asistente IA"}</div>
                    <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none
                      prose-p:mt-0 prose-p:mb-3
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl prose-pre:my-3 prose-pre:text-sm
                      prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                      prose-strong:text-gray-900 prose-strong:font-bold
                      prose-headings:text-gray-900">
                      {m.content}
                    </div>
                    {m.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyToClipboard(m.content, m.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                          {copiedId === m.id ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                        </button>
                        <button onClick={() => reload()} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Regenerar
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><Bot className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-1.5">Asistente IA</div>
                    <div className="flex items-center gap-1.5 py-2">
                      <div className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-4">
                  <div className="bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-xl text-sm flex items-center gap-3 max-w-md shadow-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-semibold">Error de conexión</div>
                      <div className="text-xs text-red-400 mt-0.5">Verifica la configuración de la API</div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* ─── INPUT ─── */}
        <div className="shrink-0 pb-5 pt-2 px-4">
          <div className="max-w-3xl mx-auto w-full">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".py,.js,.ts,.sql,.csv,.xlsx,.pdf,.png,.jpg,.jpeg,.gif,.txt,.json,.md"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5 focus-within:bg-white focus-within:shadow-lg transition-all overflow-hidden">
              {/* File Previews */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pt-4 pb-1 flex flex-wrap gap-2">
                      {uploadedFiles.map((file) => {
                        const Icon = getFileIcon(file.type, file.name);
                        const colorClass = getFileColor(file.type, file.name);
                        return (
                          <motion.div key={file.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} layout className="group relative">
                            {file.preview ? (
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <button onClick={() => removeFile(file.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10">
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1.5 py-1">
                                  <div className="text-[9px] text-white font-medium truncate">{file.name}</div>
                                </div>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-2.5 pl-2.5 pr-1.5 py-2 rounded-xl border shadow-sm ${colorClass} bg-opacity-50`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 max-w-[120px]">
                                  <div className="text-xs font-semibold text-gray-800 truncate">{file.name}</div>
                                  <div className="text-[10px] text-gray-400 font-medium">{formatFileSize(file.size)}</div>
                                </div>
                                <button onClick={() => removeFile(file.id)} className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Textarea + Buttons */}
              <form onSubmit={handleFormSubmit} className="relative flex items-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 ml-2 mb-2.5 rounded-xl text-gray-400 hover:text-brand-blue hover:bg-blue-50 transition-colors shrink-0"
                  title="Adjuntar archivo"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  name="prompt"
                  value={input || ''}
                  onChange={handleInputChange}
                  onKeyDown={onKeyDown}
                  placeholder="Envía un mensaje..."
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-4 px-2 pr-14 text-[15px] custom-scrollbar text-gray-800 placeholder:text-gray-400 max-h-[200px] min-h-[52px]"
                  rows={1}
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  disabled={isLoading || (!(input || '').trim() && uploadedFiles.length === 0)}
                  className="absolute right-3 bottom-3 p-2 bg-brand-blue text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </form>
            </div>
            <div className="mt-2.5 text-center text-[11px] text-gray-400">
              El asistente puede cometer errores. Verifica la información importante.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
