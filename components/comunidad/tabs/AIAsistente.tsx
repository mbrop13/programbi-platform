"use client";

import { useChat } from "@ai-sdk/react";
import { 
  Plus, Search, MessageSquare, Trash2, 
  PanelLeftClose, PanelLeft, Loader2, Lock,
  Edit3, Bot
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
import { ChatMessage } from "../ai/ChatMessage";
import { ChatInput } from "../ai/ChatInput";
import { ModelSelector } from "../ai/ModelSelector";

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

  const chatHook: any = useChat({
    endpoint: "/api/chat",
    body: { conversationId: activeConversationId, model: selectedModel },
    id: activeConversationId || "new",
  } as any);
  
  const { messages, input = '', handleInputChange, handleSubmit, isLoading, error, setMessages } = chatHook;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
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

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("programbi_chat_model", modelId);
  };

  // Paywall overlay
  if (isRestricted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
            Asistente IA Premium
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Accede a nuestro asistente de IA con múltiples modelos (Llama, Gemini, GPT-4o, Claude) para resolver dudas de Data Science, Python, SQL y más.
          </p>
          <a
            href="/comunidad"
            className="inline-block bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-blue-dark transition-colors shadow-sm"
          >
            Ver Planes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 h-full relative font-sans bg-white">
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

      {/* ─── SIDEBAR ─── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full border-r border-gray-200 flex flex-col overflow-hidden absolute md:relative z-50 shrink-0 bg-gray-50"
          >
            {/* Header */}
            <div className="p-3.5 flex items-center justify-between shrink-0 border-b border-gray-200">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-2 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors"
                title="Cerrar barra lateral"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNewChat} 
                className="p-2 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors"
                title="Nuevo chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3.5 py-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:border-brand-blue/50 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* New Chat Button */}
            <div className="px-3.5 mb-3 shrink-0">
              <button 
                onClick={handleNewChat} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue-dark transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Nuevo Chat
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  Sin historial de chat
                </div>
              ) : (
                Object.entries(grouped).map(([date, chats]) => (
                  <div key={date} className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider px-3 mb-2 text-gray-500">
                      {date}
                    </div>
                    <div className="space-y-1">
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
                          className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-all relative cursor-pointer ${
                            activeConversationId === chat.id
                              ? "bg-brand-blue/10 text-brand-blue font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                          
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
                              className="bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 w-full focus:outline-none focus:border-brand-blue"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate flex-1 font-medium">{chat.title}</span>
                          )}

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={(e) => startRenaming(chat.id, chat.title, e)}
                              className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                              title="Renombrar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteConversation(chat.id, e)}
                              className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
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

            {/* Footer */}
            <div className="p-3.5 border-t border-gray-200 shrink-0">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Bot className="w-4 h-4" />
                <span className="font-semibold">ProgramBI AI</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 bg-white/95 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                title="Abrir barra lateral"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={handleSelectModel}
            />
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm text-gray-700 font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Chat</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                ¡Hola! Soy tu Asistente IA
              </h2>
              <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
                Puedo ayudarte con Python, SQL, Power BI, Excel, estadística y más. Pregúntame lo que necesites.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {[
                  "¿Cómo hago un join en SQL?",
                  "Explícame pandas en Python",
                  "¿Qué es DAX en Power BI?",
                  "Dame tips para visualización de datos",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleInputChange({ target: { value: suggestion } } as any);
                      setTimeout(() => handleSubmit({ preventDefault: () => {} } as any), 100);
                    }}
                    className="text-left p-4 rounded-xl border border-gray-200 hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all text-sm text-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-1">
              {messages.map((message: any) => (
                <ChatMessage
                  key={message.id}
                  message={{
                    id: message.id,
                    role: message.role,
                    content: message.content,
                    isStreaming: isLoading && message.id === messages[messages.length - 1]?.id && message.role === "assistant",
                  }}
                  onRegenerate={message.role === "assistant" ? () => chatHook.reload() : undefined}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
            <ChatInput
              value={input}
              onChange={(value) => handleInputChange({ target: { value } } as any)}
              onSubmit={() => handleSubmit({ preventDefault: () => {} } as any)}
              onStop={() => chatHook.stop()}
              isLoading={isLoading}
              placeholder="Pregunta sobre Python, SQL, Power BI..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
