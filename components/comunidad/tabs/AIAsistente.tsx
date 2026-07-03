"use client";

import { useChat } from "@ai-sdk/react";
import { 
  Bot, User, Sparkles, AlertCircle, Copy, Check, 
  RotateCcw, Plus, Search, MessageSquare, Trash2, 
  PanelLeftClose, PanelLeft, Zap, Code, BookOpen, 
  ArrowUp, Paperclip, X, FileText, FileSpreadsheet, 
  FileCode, Image as ImageIcon, File, Loader2, Lock,
  ChevronDown, Edit3, Globe, Terminal, Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  getAIConversations, 
  getAIMessages, 
  createAIConversation, 
  deleteAIConversation, 
  updateAIConversationTitle 
} from "@/lib/supabase/comunidad-ai";

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
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("programbi_chat_model") || "llama-3-8b";
    }
    return "llama-3-8b";
  });
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Feature indicators (mock OpenChat capability toggles)
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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
    setUploadedFiles([]);
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
    if (!currentInput && uploadedFiles.length === 0) return;

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

    setUploadedFiles([]);
  };

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

  return (
    <div className="flex flex-1 min-h-0 h-full relative text-slate-800">
      
      {/* ─── SIDEBAR BACKDROP (Mobile) ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full bg-slate-50/90 backdrop-blur-md border-r border-slate-200/50 flex flex-col overflow-hidden absolute md:relative z-50 shrink-0 shadow-sm"
          >
            <div className="p-3.5 flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors border-none bg-transparent cursor-pointer">
                  <PanelLeftClose className="w-5 h-5" />
                </button>
                <button onClick={handleNewChat} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors border-none bg-transparent cursor-pointer" title="Nuevo chat">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/40 focus:ring-4 focus:ring-brand-blue/5 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="px-3.5 mb-2 shrink-0">
              <button 
                onClick={handleNewChat} 
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all border border-slate-200/80 hover:border-slate-300 bg-white shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-brand-blue" />
                Nuevo Asistente Chat
              </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-4 pb-4">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Sin historial de chat
                </div>
              ) : (
                Object.entries(grouped).map(([date, chats]) => (
                  <div key={date} className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">{date}</div>
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
                          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all relative cursor-pointer border-none bg-transparent outline-none
                            ${activeConversationId === chat.id
                              ? "bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold"
                              : "text-slate-600 hover:bg-slate-200/30 hover:text-slate-900 border border-transparent"}`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          
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
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-900 w-full focus:outline-none focus:border-brand-blue"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate flex-1 font-medium">{chat.title}</span>
                          )}

                          {editingId !== chat.id && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                              <button 
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors border-none bg-transparent cursor-pointer" 
                                onClick={(e) => startRenaming(chat.id, chat.title, e)}
                                title="Renombrar"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button 
                                className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer" 
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

            {/* Footer */}
            <div className="p-3.5 shrink-0 mt-auto border-t border-slate-200/50 bg-slate-100/50">
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  IA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">Asistente OpenChat</div>
                  <div className="text-[10px] text-slate-400 font-medium">ProgramBI v2.0</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {isRestricted && (
          <div className="absolute inset-0 z-30 border-l border-slate-100 bg-white/50 backdrop-blur-[8px] flex flex-col items-center justify-center p-6">
             <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 text-brand-blue border border-slate-100">
               <Lock className="w-6 h-6" />
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-1">Asistente IA Premium</h3>
             <p className="text-xs text-slate-500 text-center max-w-xs mb-5">Suscríbete a un plan de la comunidad para hacer preguntas, generar consultas SQL o depurar código.</p>
             <a href="/comunidad" className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-none">Ver Planes de Suscripción</a>
          </div>
        )}

        {/* HEADER bar */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0 bg-white z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="w-9 h-9 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border-none bg-transparent cursor-pointer"
              >
                <PanelLeft className="w-[18px] h-[18px]" />
              </button>
            )}
            
            {/* Model Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 bg-white cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-blue animate-pulse" />
                <span>{currentModelObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                  >
                    <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-1.5">
                      Seleccionar Inteligencia
                    </div>
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        className={`w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left transition-colors border-none bg-transparent cursor-pointer
                          ${selectedModel === m.id ? "bg-slate-50" : "hover:bg-slate-50/65"}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{m.name}</span>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider
                              ${m.id === 'claude-3-5-sonnet' 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-slate-100 text-slate-500'}`}>
                              {m.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{m.desc}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* OpenChat Style Capabilities Indicators */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors
                ${webSearchEnabled ? 'text-brand-blue bg-blue-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              title="Buscar en la Web (Simulado)"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCodeInterpreterEnabled(!codeInterpreterEnabled)}
              className={`p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors
                ${codeInterpreterEnabled ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              title="Intérprete de Código (Simulado)"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-xl flex items-center justify-center border-none bg-transparent cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Modo de Voz (Simulado)"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <div className="w-px h-5 bg-slate-200 mx-1.5" />

            <button 
              onClick={handleNewChat}
              className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all border-none flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </button>
          </div>
        </div>

        {/* Messages / Welcome */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
          {loadingMessages ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl w-full">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-brand-blue/10">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5">¿En qué te puedo apoyar hoy?</h1>
                <p className="text-slate-400 mb-8 text-xs max-w-xs mx-auto">
                  Tu asistente personal especializado en SQL, Python, Power BI, Excel y análisis de datos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto">
                  {[
                    { icon: Code, label: "Funciones Ventana en SQL", desc: "Consultas avanzadas con ejemplos" },
                    { icon: Zap, label: "Optimizar código en Python", desc: "Mejores prácticas de rendimiento" },
                    { icon: BookOpen, label: "Dashboard financiero PBI", desc: "Consejos de diseño y modelamiento" },
                    { icon: Sparkles, label: "Esquema estrella vs copo de nieve", desc: "Modelamiento de base de datos" },
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
                        className="group flex flex-col items-start gap-1 p-3.5 rounded-2xl bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-all text-left cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-blue transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{s.label}</span>
                        <span className="text-[10px] text-slate-400">{s.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
              {messages.map((m: any) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm
                    ${m.role === "user"
                      ? "bg-slate-100 text-slate-600 border border-slate-200/50"
                      : "bg-gradient-to-br from-brand-blue to-indigo-600 text-white"}`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0 group">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{m.role === "user" ? "Tú" : "Asistente IA"}</div>
                    
                    {/* Rich Markdown Parser rendering Native React Components */}
                    <div className="text-[14px] text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                      {m.role === "user" ? (
                        <p className="text-slate-800 font-medium">{m.content}</p>
                      ) : (
                        renderMessageContent(m.content)
                      )}
                    </div>

                    {m.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyToClipboard(m.content, m.id)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer">
                          {copiedId === m.id ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                        </button>
                        <button onClick={() => reload()} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer">
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
                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Asistente IA</div>
                    <div className="flex items-center gap-1 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-4">
                  <div className="bg-red-50 text-red-600 border border-red-200/60 px-4 py-3 rounded-2xl text-xs flex items-center gap-3 max-w-md shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-bold">Error de conexión</div>
                      <div className="text-[10px] text-red-400 mt-0.5">Ocurrió un error al contactar al modelo. Reintenta.</div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* ─── INPUT (Floating Pill OpenChat style) ─── */}
        <div className="shrink-0 pb-5 pt-2 px-4 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto w-full">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".py,.js,.ts,.sql,.csv,.xlsx,.pdf,.png,.jpg,.jpeg,.gif,.txt,.json,.md"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5 focus-within:bg-white focus-within:shadow-lg transition-all overflow-hidden shadow-sm">
              {/* File Previews */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                    <div className="px-4 pt-4 pb-1 flex flex-wrap gap-2">
                      {uploadedFiles.map((file) => {
                        const Icon = getFileIcon(file.type, file.name);
                        const colorClass = getFileColor(file.type, file.name);
                        return (
                          <motion.div key={file.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} layout className="group relative">
                            {file.preview ? (
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <button onClick={() => removeFile(file.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 border-none cursor-pointer">
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1 py-0.5">
                                  <div className="text-[8px] text-white font-medium truncate">{file.name}</div>
                                </div>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-xl border shadow-sm ${colorClass} bg-opacity-50`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 max-w-[100px]">
                                  <div className="text-[10px] font-bold text-slate-800 truncate">{file.name}</div>
                                  <div className="text-[8px] text-slate-400 font-medium">{formatFileSize(file.size)}</div>
                                </div>
                                <button onClick={() => removeFile(file.id)} className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 border-none bg-transparent cursor-pointer">
                                  <X className="w-3 h-3" />
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
                  className="p-2 ml-2.5 mb-2 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-colors shrink-0 border-none bg-transparent cursor-pointer"
                  title="Adjuntar archivos"
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
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-3.5 px-2 pr-16 text-xs custom-scrollbar text-slate-700 placeholder:text-slate-400 max-h-[160px] min-h-[46px] border-none"
                  rows={1}
                />
                
                <div className="absolute right-3.5 bottom-2.5 flex items-center gap-2">
                  {/* Selected Model Pill indicator inside input */}
                  <span className="text-[9px] font-extrabold text-slate-400 px-2 py-1 bg-slate-200/60 rounded-lg select-none">
                    {currentModelObj.badge}
                  </span>
                  
                  <button
                    type="submit"
                    disabled={isLoading || (!(input || '').trim() && uploadedFiles.length === 0)}
                    className="p-1.5 bg-brand-blue text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm active:scale-95 border-none cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-2 text-center text-[9px] text-slate-400">
              El Asistente IA puede cometer errores. Verifica el código e información importante.
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
    <div className="relative rounded-2xl overflow-hidden my-4 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between px-5 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px]">
        <span className="font-mono font-semibold uppercase tracking-wider text-[9px] text-slate-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-slate-950 overflow-x-auto text-xs leading-relaxed">
        <pre className="font-mono text-slate-200 whitespace-pre">{code}</pre>
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
        <ListTag key={elements.length} className={`${listStyle} list-inside pl-4 my-2 space-y-1 text-slate-700`}>
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
        <h3 key={elements.length} className="text-sm font-bold text-slate-900 mt-4 mb-2">
          {renderInlineStyles(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      pushList();
      elements.push(
        <h2 key={elements.length} className="text-base font-black text-slate-900 mt-5 mb-2">
          {renderInlineStyles(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      pushList();
      elements.push(
        <h1 key={elements.length} className="text-lg font-black text-slate-900 mt-6 mb-3">
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
          <p key={elements.length} className="mb-2 leading-relaxed text-xs text-slate-700">
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
  // Split on bold (**bold**) and inline code (`code`)
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
    } else if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-indigo-600 font-semibold">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
