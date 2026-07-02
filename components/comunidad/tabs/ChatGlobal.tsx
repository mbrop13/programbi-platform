"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Hash,
  MessageSquare,
  Plus,
  Search,
  Send,
  Smile,
  Pin,
  Bell,
  User,
  Lock,
  Loader2,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  getChatChannels,
  getChatMessages,
  sendChatMessage,
  getActiveUsers,
  getCurrentUserProfile,
} from "@/lib/supabase/comunidad";

interface ChatGlobalProps {
  isRestricted?: boolean;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  author?: {
    id: string;
    full_name: string;
    role: string;
    avatar_url?: string | null;
  } | null;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  category: string;
}

interface OnlineUser {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  status: "online" | "idle" | "offline";
}

const AVATAR_COLORS = [
  "bg-gradient-to-br from-brand-blue to-indigo-600",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
];

function getColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ChatGlobal({ isRestricted }: ChatGlobalProps = {}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  /* ── Scroll to bottom ── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    async function load() {
      try {
        const [chans, users, profile] = await Promise.all([
          getChatChannels(),
          getActiveUsers(),
          getCurrentUserProfile(),
        ]);
        setChannels(chans as Channel[]);
        setOnlineUsers(users as OnlineUser[]);
        setUserProfile(profile);

        // Default to first channel
        if (chans.length > 0) {
          setActiveChannelId((chans[0] as Channel).id);
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Load messages when channel changes ── */
  useEffect(() => {
    if (!activeChannelId) return;
    setLoadingMessages(true);

    getChatMessages(activeChannelId)
      .then((msgs) => {
        setMessages(msgs as unknown as Message[]);
        setTimeout(scrollToBottom, 100);
      })
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [activeChannelId, scrollToBottom]);

  /* ── Supabase Realtime subscription ── */
  useEffect(() => {
    if (!activeChannelId) return;

    const channel = supabase
      .channel(`chat_${activeChannelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${activeChannelId}`,
        },
        async (payload) => {
          // Fetch the full message with author join
          const { data } = await supabase
            .from("chat_messages")
            .select(
              "id, content, created_at, author:profiles(id, full_name, role, avatar_url)"
            )
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, data as unknown as Message];
            });
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannelId, supabase, scrollToBottom]);

  /* ── Active channel object ── */
  const activeChannel = channels.find((c) => c.id === activeChannelId);

  /* ── Group channels by category ── */
  const channelGroups = channels.reduce<Record<string, Channel[]>>((acc, ch) => {
    if (!acc[ch.category]) acc[ch.category] = [];
    acc[ch.category].push(ch);
    return acc;
  }, {});

  /* ── Send message ── */
  const handleSend = async () => {
    if (!messageInput.trim() || !activeChannelId || sending) return;
    const content = messageInput.trim();
    setMessageInput("");
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `opt_${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      author: {
        id: userProfile?.id || "",
        full_name: userProfile?.full_name || "Tú",
        role: userProfile?.role || "student",
        avatar_url: userProfile?.avatar_url,
      },
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      await sendChatMessage(activeChannelId, content);
      // Real message will come via Realtime subscription
    } catch (err) {
      console.error("Send error:", err);
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  /* ── Format message time ── */
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  };

  /* ── Date divider logic ── */
  const getMessageDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Hoy";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Ayer";
    return d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* ── Group messages by date ── */
  const messagesWithDividers: { type: "divider" | "message"; data: any }[] = [];
  let lastDate = "";
  messages.forEach((msg) => {
    const msgDate = getMessageDate(msg.created_at);
    if (msgDate !== lastDate) {
      messagesWithDividers.push({ type: "divider", data: msgDate });
      lastDate = msgDate;
    }
    messagesWithDividers.push({ type: "message", data: msg });
  });

  /* ── Filter messages by search ── */
  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messagesWithDividers;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      {/* ─── CHANNEL SIDEBAR ─── */}
      <div className="w-[260px] bg-gray-50/80 border-r border-gray-200/60 flex-col hidden md:flex shrink-0">
        {/* Server Header */}
        <div className="h-[60px] flex items-center px-5 border-b border-gray-200/60 shrink-0 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              ProgramBI
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">
              Comunidad de Data
            </p>
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide space-y-4">
          {Object.entries(channelGroups).map(([category, chans]) => (
            <div key={category}>
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                <span>{category}</span>
                <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
              <div className="space-y-0.5">
                {chans.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all
                      ${
                        activeChannelId === channel.id
                          ? "bg-brand-blue/10 text-brand-blue font-semibold"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {channel.type === "announcement" ? (
                        <Volume2 className="w-4 h-4 opacity-50" />
                      ) : (
                        <Hash className="w-4 h-4 opacity-50" />
                      )}
                      {channel.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Direct Messages */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
              <span>Mensajes Directos</span>
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600 transition-colors" />
            </div>
            <div className="space-y-0.5">
              {onlineUsers
                .filter((u) => u.status === "online")
                .slice(0, 3)
                .map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all"
                  >
                    <div className="relative">
                      <div
                        className={`w-6 h-6 rounded-md ${user.color || getColorForId(user.id)} text-white flex items-center justify-center text-[9px] font-bold`}
                      >
                        {user.initials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-[1.5px] ring-gray-50" />
                    </div>
                    {user.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Active User Bar */}
        <div className="p-3 bg-gray-100/80 border-t border-gray-200/60 shrink-0">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                {userProfile?.full_name
                  ? userProfile.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "??"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-tight">
                {userProfile?.full_name?.split(" ")[0] || "Tu Usuario"}
              </div>
              <div className="text-[10px] text-emerald-500 font-bold">
                En línea
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Restriction overlay */}
        {isRestricted && (
          <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 border-l border-white/20">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-blue">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Comunidad Premium
            </h3>
            <p className="text-gray-600 text-center max-w-sm mb-6">
              Suscríbete para leer el historial completo y conectar en tiempo
              real con otros estudiantes y expertos.
            </p>
            <a
              href="/comunidad"
              className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Ver Planes
            </a>
          </div>
        )}

        {/* Channel Header */}
        <div className="h-[60px] border-b border-gray-200/60 flex items-center justify-between px-5 bg-white/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-300" />
              <h3 className="font-bold text-gray-900">
                {activeChannel?.name || "general"}
              </h3>
            </div>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              Canal de la comunidad
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
              <Pin className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
              <Bell className="w-4 h-4" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm w-44 focus:outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 transition-all"
              />
            </div>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors lg:hidden">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1 scrollbar-hide">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                Canal vacío
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Este es el inicio de #{activeChannel?.name}. ¡Envía el primer
                mensaje!
              </p>
            </div>
          ) : (
            (searchQuery
              ? messages
                  .filter(
                    (m) =>
                      m.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      m.author?.full_name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((msg) => ({ type: "message" as const, data: msg }))
              : messagesWithDividers
            ).map((item, i) => {
              if (item.type === "divider") {
                return (
                  <div
                    key={`div-${item.data}-${i}`}
                    className="flex items-center gap-4 my-4"
                  >
                    <div className="h-px bg-gray-100 flex-1" />
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {item.data}
                    </span>
                    <div className="h-px bg-gray-100 flex-1" />
                  </div>
                );
              }

              const msg = item.data as Message;
              const authorName = msg.author?.full_name || "Usuario";
              const authorInitials = authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              const authorColor = msg.author
                ? getColorForId(msg.author.id)
                : "bg-gray-400";
              const isAdmin = msg.author?.role === "admin";
              const isOptimistic = msg.id.startsWith("opt_");

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 group hover:bg-gray-50/50 -mx-3 px-3 py-2 rounded-xl transition-colors
                    ${isOptimistic ? "opacity-60" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${authorColor} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm`}
                  >
                    {authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900 hover:underline cursor-pointer">
                        {authorName}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] font-black bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded-md tracking-wide">
                          ADMIN
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 font-medium">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-0.5 pt-1">
                    <button className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 shrink-0">
          <div className="bg-gray-50/80 border border-gray-200 rounded-2xl px-4 py-2 flex items-end gap-2 focus-within:border-brand-blue/40 focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:bg-white transition-all">
            <button className="text-gray-300 hover:text-brand-blue p-1 mb-1 transition-colors rounded-lg hover:bg-blue-50">
              <Plus className="w-5 h-5" />
            </button>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Mensaje en #${activeChannel?.name || "general"}`}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[28px] py-1 scrollbar-hide text-[15px] text-gray-700 placeholder:text-gray-400"
              rows={1}
            />
            <div className="flex items-center gap-0.5 mb-1">
              <button className="text-gray-300 hover:text-gray-500 p-1 transition-colors rounded-lg hover:bg-gray-100">
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!messageInput.trim() || sending}
                className="text-gray-300 hover:text-brand-blue disabled:hover:text-gray-300 p-1 transition-colors rounded-lg hover:bg-blue-50 disabled:hover:bg-transparent"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MEMBERS SIDEBAR ─── */}
      <div className="w-[240px] bg-gray-50/50 border-l border-gray-200/60 hidden lg:flex flex-col shrink-0 p-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
          En línea —{" "}
          {onlineUsers.filter((u) => u.status !== "offline").length}
        </div>
        <div className="space-y-1">
          {onlineUsers
            .filter((u) => u.status !== "offline")
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-colors group"
              >
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-lg ${user.color || getColorForId(user.id)} text-white flex items-center justify-center font-bold text-[10px] shadow-sm`}
                  >
                    {user.initials}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-gray-50
                      ${user.status === "online" ? "bg-emerald-500" : "bg-amber-400"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate block transition-colors">
                    {user.name}
                  </span>
                  {user.role === "admin" && (
                    <span className="text-[9px] text-brand-blue font-bold">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-1">
          Desconectados —{" "}
          {onlineUsers.filter((u) => u.status === "offline").length}
        </div>
        <div className="space-y-1">
          {onlineUsers
            .filter((u) => u.status === "offline")
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-colors opacity-50 hover:opacity-100"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gray-300 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-400 rounded-full ring-2 ring-gray-50" />
                </div>
                <span className="text-sm font-medium text-gray-500 truncate">
                  {user.name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
