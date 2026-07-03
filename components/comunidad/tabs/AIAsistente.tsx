"use client";

import { useChat } from "@ai-sdk/react";
import {
  Bot,
  Plus,
  Search,
  MessageSquare,
  Loader2,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import {
  getAIConversations,
  getAIMessages,
  createAIConversation,
  deleteAIConversation,
  updateAIConversationTitle,
} from "@/lib/supabase/comunidad-ai";
import { ChatMessage } from "../ai/ChatMessage";
import { ChatInput } from "../ai/ChatInput";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIAsistenteProps {
  isRestricted?: boolean;
}

export default function AIAsistente({ isRestricted = false }: AIAsistenteProps) {
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const chatHook: any = useChat({
    endpoint: "/api/chat",
    body: { conversationId: activeConversationId, model: selectedModel },
    id: activeConversationId || "new",
  } as any);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = chatHook;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    loadConversations();
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setError(null);
    try {
      const msgs = await getAIMessages(convId);
      const formatted = msgs.map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: new Date(m.created_at),
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("No se pudieron cargar los mensajes.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setError(null);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await deleteAIConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      setError("No se pudo eliminar la conversación.");
    }
  };

  const startRenaming = (convId: string, title: string, _e?: MouseEvent) => {
    setEditingId(convId);
    setEditingTitle(title);
  };

  const saveRename = async (convId: string) => {
    if (!editingTitle.trim()) return;
    try {
      await updateAIConversationTitle(convId, editingTitle);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: editingTitle } : c))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating title:", err);
      setError("No se pudo actualizar el título.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = (input || "").trim();
    if (!currentInput) return;

    setError(null);

    if (!activeConversationId) {
      try {
        const title = currentInput.substring(0, 60) || "Nueva Conversación";
        const newId = await createAIConversation(title);
        setActiveConversationId(newId);
        setConversations((prev) => [
          {
            id: newId,
            title,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        chatHook.handleSubmit(e, {
          body: { conversationId: newId, model: selectedModel },
        });
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError("No se pudo crear la conversación. Intenta de nuevo.");
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

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("programbi_chat_model", modelId);
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped: Record<string, Conversation[]> = {};
  filteredConversations.forEach((c) => {
    const key = getRelativeDate(c.updated_at || c.created_at);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  const isEmpty = messages.length === 0 && !loadingMessages && !isLoading;

  const suggestions = [
    "¿Cómo hago un join en SQL?",
    "Explícame pandas en Python",
    "¿Qué es DAX en Power BI?",
    "Dame tips para visualización de datos",
  ];


  if (isRestricted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-zinc-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-zinc-100">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Asistente IA Premium</h2>
          <p className="text-zinc-600 leading-relaxed mb-6">
            Accede al asistente de IA con múltiples modelos (Llama, Gemini, GPT-4o y Claude)
            para resolver dudas de Data Science, Python, SQL y Power BI.
          </p>
          <a
            href="/comunidad/planes"
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue-dark transition-colors"
          >
            Ver Planes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] min-h-0 bg-white relative overflow-hidden">
      {/* Mobile sidebar backdrop */}
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

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full border-r border-zinc-200 bg-zinc-900 flex flex-col overflow-hidden absolute md:relative z-50 shrink-0"
          >
            {/* Sidebar header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Nuevo chat
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors md:hidden"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 py-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 rounded-lg pl-9 pr-3 py-2 text-sm border border-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 custom-scrollbar">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  Sin historial de chat
                </div>
              ) : (
                Object.entries(grouped).map(([date, chats]) => (
                  <div key={date} className="space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 mb-1">
                      {date}
                    </div>
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          if (editingId !== chat.id) {
                            loadConversation(chat.id);
                            if (window.innerWidth < 768) setSidebarOpen(false);
                          }
                        }}
                        onDoubleClick={(e) => startRenaming(chat.id, chat.title, e)}
                        className={cn(
                          "group flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                          activeConversationId === chat.id
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        )}
                      >
                        <MessageSquare className="w-4 h-4 shrink-0 text-zinc-400" />
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
                            className="flex-1 bg-zinc-700 text-white rounded px-1 py-0.5 text-sm focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="flex-1 truncate text-sm">{chat.title}</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-opacity"
                          title="Eliminar conversación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-zinc-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              title={sidebarOpen ? "Ocultar historial" : "Mostrar historial"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>
            <h1 className="font-semibold text-zinc-900">Asistente IA</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg px-3 py-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo chat
            </button>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-brand-blue/20 relative">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-zinc-900 mb-3 relative">Hola, soy tu Asistente IA</h2>
              <p className="text-zinc-500 max-w-md mb-10 relative">
                Puedo ayudarte con Python, SQL, Power BI, Excel, estadística y visualización de datos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleInputChange({ target: { value: suggestion } } as any);
                      setTimeout(() => handleFormSubmit({ preventDefault: () => {} } as any), 100);
                    }}
                    className="text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm transition-all text-sm text-zinc-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((message: any, idx: number) => (
                <ChatMessage
                  key={message.id || idx}
                  message={{
                    id: message.id || idx,
                    role: message.role,
                    content: message.content,
                    isStreaming:
                      isLoading &&
                      message.id === messages[messages.length - 1]?.id &&
                      message.role === "assistant",
                  }}
                  onRegenerate={message.role === "assistant" ? () => chatHook.reload() : undefined}
                />
              ))}
              {error && (
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-red-700 hover:underline"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input dock */}
        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-t border-zinc-100 p-4">
          <div className="max-w-3xl mx-auto w-full">
            <ChatInput
              value={input}
              onChange={(value) => handleInputChange({ target: { value } } as any)}
              onSubmit={() => handleFormSubmit({ preventDefault: () => {} } as any)}
              onStop={() => chatHook.stop?.()}
              isLoading={isLoading}
              selectedModel={selectedModel}
              onModelChange={handleSelectModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
