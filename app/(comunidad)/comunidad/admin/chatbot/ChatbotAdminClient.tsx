"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Search,
  Sparkles,
  Calendar,
  Tag,
  Phone,
  Star,
  Bot,
  User,
  RotateCcw,
  Zap,
  ArrowLeft,
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Compass,
  Plus
} from "lucide-react";
import {
  getChatbotConversations,
  getChatbotConversationDetail,
  updateChatbotConversation,
  getChatbotStats
} from "@/lib/supabase/comunidad-ai";

interface Stats {
  totalConversations: number;
  conversationsToday: number;
  conversationsThisWeek: number;
  conversationsThisMonth: number;
  totalLeads: number;
  avgMessagesPerConversation: number;
  topPages: { page: string; count: number }[];
}

interface Conversation {
  id: string;
  visitor_id: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  source_page: string | null;
  status: string;
  tags: string[] | null;
  is_lead: boolean;
  message_count: number;
  created_at: string;
  updated_at: string;
  first_user_message: string | null;
}

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ChatbotAdminClientProps {
  initialStats: Stats;
  initialConversations: Conversation[];
  initialTotal: number;
}

export default function ChatbotAdminClient({
  initialStats,
  initialConversations,
  initialTotal
}: ChatbotAdminClientProps) {
  // ─── States ───
  const [stats, setStats] = useState<Stats>(initialStats);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [total, setTotal] = useState<number>(initialTotal);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [leadFilter, setLeadFilter] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Selected Conversation details
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Edit visitor info state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [newTag, setNewTag] = useState("");
  const [savingDetail, setSavingDetail] = useState(false);

  const [isPending, startTransition] = useTransition();

  // ─── Fetch Conversations ───
  const loadConversations = () => {
    startTransition(async () => {
      try {
        const filters = {
          status: statusFilter,
          isLead: leadFilter === null ? undefined : leadFilter,
          search: searchQuery || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          page,
          limit
        };
        const data = await getChatbotConversations(filters);
        setConversations(data.conversations);
        setTotal(data.total);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    });
  };

  // Re-fetch when filters or page changes
  useEffect(() => {
    loadConversations();
  }, [statusFilter, leadFilter, page, dateFrom, dateTo]);

  // Handle search with debouncing or manual trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadConversations();
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setLeadFilter(null);
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  // ─── Fetch Conversation Details ───
  const handleSelectConversation = async (id: string) => {
    setSelectedConvId(id);
    setLoadingDetail(true);
    try {
      const data = await getChatbotConversationDetail(id);
      setSelectedConv(data.conversation);
      setMessages(data.messages);
      
      // Initialize edit fields
      setEditName(data.conversation?.visitor_name || "");
      setEditEmail(data.conversation?.visitor_email || "");
      setEditPhone(data.conversation?.visitor_phone || "");
    } catch (err) {
      console.error("Error loading conversation details:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Refresh stats
  const handleRefreshStats = async () => {
    try {
      const newStats = await getChatbotStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  };

  // ─── Update Conversation fields ───
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedConv) return;
    setSavingDetail(true);
    try {
      await updateChatbotConversation(selectedConv.id, { status: newStatus });
      setSelectedConv(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Update in list
      setConversations(prev =>
        prev.map(c => (c.id === selectedConv.id ? { ...c, status: newStatus } : c))
      );
      handleRefreshStats();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setSavingDetail(false);
    }
  };

  const handleToggleLead = async () => {
    if (!selectedConv) return;
    setSavingDetail(true);
    const newIsLead = !selectedConv.is_lead;
    try {
      await updateChatbotConversation(selectedConv.id, { is_lead: newIsLead });
      setSelectedConv(prev => prev ? { ...prev, is_lead: newIsLead } : null);
      
      // Update in list
      setConversations(prev =>
        prev.map(c => (c.id === selectedConv.id ? { ...c, is_lead: newIsLead } : c))
      );
      handleRefreshStats();
    } catch (err) {
      console.error("Error toggling lead:", err);
    } finally {
      setSavingDetail(false);
    }
  };

  const handleSaveVisitorInfo = async () => {
    if (!selectedConv) return;
    setSavingDetail(true);
    try {
      await updateChatbotConversation(selectedConv.id, {
        visitor_name: editName || undefined,
        visitor_email: editEmail || undefined,
        visitor_phone: editPhone || undefined
      });
      setSelectedConv(prev =>
        prev
          ? {
              ...prev,
              visitor_name: editName || null,
              visitor_email: editEmail || null,
              visitor_phone: editPhone || null
            }
          : null
      );
      
      // Update in list
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConv.id
            ? {
                ...c,
                visitor_name: editName || null,
                visitor_email: editEmail || null,
                visitor_phone: editPhone || null
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error saving visitor info:", err);
    } finally {
      setSavingDetail(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !newTag.trim()) return;
    setSavingDetail(true);
    const currentTags = selectedConv.tags || [];
    if (currentTags.includes(newTag.trim())) {
      setNewTag("");
      setSavingDetail(false);
      return;
    }
    const updatedTags = [...currentTags, newTag.trim()];
    try {
      await updateChatbotConversation(selectedConv.id, { tags: updatedTags });
      setSelectedConv(prev => prev ? { ...prev, tags: updatedTags } : null);
      setNewTag("");
      
      // Update in list
      setConversations(prev =>
        prev.map(c => (c.id === selectedConv.id ? { ...c, tags: updatedTags } : c))
      );
    } catch (err) {
      console.error("Error adding tag:", err);
    } finally {
      setSavingDetail(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!selectedConv) return;
    setSavingDetail(true);
    const updatedTags = (selectedConv.tags || []).filter(t => t !== tagToRemove);
    try {
      await updateChatbotConversation(selectedConv.id, { tags: updatedTags });
      setSelectedConv(prev => prev ? { ...prev, tags: updatedTags } : null);
      
      // Update in list
      setConversations(prev =>
        prev.map(c => (c.id === selectedConv.id ? { ...c, tags: updatedTags } : c))
      );
    } catch (err) {
      console.error("Error removing tag:", err);
    } finally {
      setSavingDetail(false);
    }
  };

  // ─── Helpers ───
  const formatChileanDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRelativeTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "Ahora mismo";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} d`;
  };

  const renderSimpleMarkdown = (text: string) => {
    // Basic formatting for timeline view.
    // IMPORTANT: visitor messages are untrusted (stored in chatbot_messages) and
    // are rendered inside the admin panel — without sanitization this would be a
    // stored XSS that escalates to admin. Sanitize the result before returning.
    // (OWASP ASVS L3 audit, CR-6)
    const html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-600">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n/g, "<br />");
    return html;
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ─── Header & Breadcrumb ─── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link href="/comunidad/admin" className="hover:text-blue-400 transition-colors flex items-center gap-1 text-slate-500 no-underline font-semibold">
                <ArrowLeft className="w-3 h-3" /> Panel Admin
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Chatbot IA</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              💬 Chatbot IA <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Admin</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Supervisa y optimiza las dudas de visitantes públicos recopiladas por Programbi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshStats}
              className="flex items-center gap-2 bg-slate-100 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Actualizar Stats
            </button>
            <Link
              href="/comunidad/admin"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold text-white no-underline transition-all"
            >
              Volver al Panel
            </Link>
          </div>
        </div>

        {/* ─── Stats KPI Row ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Chats</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalConversations}</h3>
              <p className="text-[10px] text-blue-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Todo el tiempo
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Conversaciones Hoy</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.conversationsToday}</h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                Actividad reciente
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Leads Generados</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalLeads}</h3>
              <p className="text-[10px] text-indigo-400 font-semibold mt-1">
                Tasa conv: {stats.totalConversations > 0 ? Math.round((stats.totalLeads / stats.totalConversations) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Mensajes / Chat</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.avgMessagesPerConversation}</h3>
              <p className="text-[10px] text-purple-400 font-semibold mt-1">
                Promedio de engagement
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ─── Main Content Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Conversations List & Filters */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            
            {/* Filters Bar */}
            <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, email o mensaje..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 text-slate-800 placeholder:text-slate-500 transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-slate-100 border border-slate-700 hover:bg-slate-200 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Filter className="w-4 h-4" /> Buscar
                  </button>

                  {/* Clear Button */}
                  {(statusFilter !== "all" || leadFilter !== null || searchQuery || dateFrom || dateTo) && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="bg-transparent border border-dashed border-slate-200 text-slate-500 hover:text-slate-900 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-950/40">
                  {/* Status filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="active">🟢 Activo</option>
                      <option value="resolved">🔵 Resuelto</option>
                      <option value="flagged">🔴 Marcado/Pendiente</option>
                    </select>
                  </div>

                  {/* Lead filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads</label>
                    <select
                      value={leadFilter === null ? "all" : leadFilter ? "leads" : "non-leads"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLeadFilter(val === "all" ? null : val === "leads");
                        setPage(1);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                      <option value="all">Todos</option>
                      <option value="leads">⭐ Solo Leads</option>
                      <option value="non-leads">No Leads</option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desde</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 "
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hasta</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 "
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Conversations Table */}
            <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {isPending ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm text-slate-500 mt-3 font-semibold">Cargando conversaciones...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <h3 className="text-slate-900 font-bold text-base mb-1">No se encontraron chats</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Prueba cambiando los filtros o buscando otro término.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visitante</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Último Mensaje</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Msg</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40">
                      {conversations.map((conv) => {
                        const isSelected = selectedConvId === conv.id;
                        return (
                          <tr
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                            className={`hover:bg-blue-50/60 transition-all cursor-pointer ${
                              isSelected ? "bg-blue-50/60 border-l-4 border-l-blue-500" : ""
                            }`}
                          >
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900 text-sm">
                                {conv.visitor_name || <span className="text-slate-500 italic font-normal">Anon_#{conv.visitor_id?.substring(0, 5) || conv.id.substring(0, 5)}</span>}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                {conv.visitor_email ? (
                                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {conv.visitor_email}</span>
                                ) : (
                                  <span className="text-slate-600">Sin datos de contacto</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 max-w-xs">
                              <p className="text-xs text-slate-700 truncate leading-relaxed">
                                {conv.first_user_message || <span className="text-slate-500 italic">No user messages</span>}
                              </p>
                              {conv.tags && conv.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {conv.tags.slice(0, 3).map((t, idx) => (
                                    <span key={idx} className="bg-slate-100 text-[9px] font-bold text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                      {t}
                                    </span>
                                  ))}
                                  {conv.tags.length > 3 && (
                                    <span className="text-[9px] text-slate-500 font-bold px-1 py-0.5">+{conv.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="bg-slate-50 text-slate-700 text-xs font-bold px-2 py-0.8 rounded-full border border-slate-200">
                                {conv.message_count}
                              </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  conv.status === "active"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : conv.status === "resolved"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                              >
                                {conv.status === "active" ? "🟢 Activo" : conv.status === "resolved" ? "🔵 Resuelto" : "🔴 Flagged"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {conv.is_lead ? (
                                <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.8 rounded-md">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Lead
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">—</span>
                              )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="text-xs font-semibold text-slate-700">
                                {getRelativeTime(conv.created_at)}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {formatChileanDate(conv.created_at).split(" ")[0]}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">
                    Mostrando <strong className="text-slate-700 font-bold">{(page - 1) * limit + 1}</strong> a{" "}
                    <strong className="text-slate-700 font-bold">{Math.min(page * limit, total)}</strong> de{" "}
                    <strong className="text-slate-700 font-bold">{total}</strong> conversaciones
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-500 self-center px-1 font-bold">
                      Pág. {page} de {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Conversation Details timeline */}
          <div className="lg:col-span-12 xl:col-span-4 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px] h-full sticky top-4">
            <AnimatePresence mode="wait">
              {!selectedConvId ? (
                <motion.div
                  key="empty-detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-650 mb-4">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h4 className="text-slate-900 font-bold text-base mb-1">Detalle del chat</h4>
                  <p className="text-slate-500 text-xs max-w-[220px]">
                    Selecciona una conversación de la tabla para revisar los mensajes del chatbot en tiempo real.
                  </p>
                </motion.div>
              ) : loadingDetail ? (
                <motion.div
                  key="loading-detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                >
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-xs text-slate-500 mt-3 font-semibold">Descargando mensajes...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="active-detail"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex-1 flex flex-col h-full min-h-[600px]"
                >
                  {/* Detail Header */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                        {selectedConv?.visitor_name || `Anon_#${selectedConv?.visitor_id?.substring(0, 5)}`}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {selectedConv && formatChileanDate(selectedConv.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedConvId(null); setSelectedConv(null); }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tab options / actions sidebar */}
                  <div className="p-4 bg-slate-50/50 border-b border-slate-200 space-y-4">
                    {/* Status Toggle & Lead switch */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Status select buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus("active")}
                          disabled={savingDetail}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none flex items-center gap-1 ${
                            selectedConv?.status === "active"
                              ? "bg-blue-600 text-white shadow shadow-blue-500/10"
                              : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          🟢 Activo
                        </button>
                        <button
                          onClick={() => handleUpdateStatus("resolved")}
                          disabled={savingDetail}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none flex items-center gap-1 ${
                            selectedConv?.status === "resolved"
                              ? "bg-emerald-600 text-white shadow shadow-emerald-500/10"
                              : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          🔵 Resuelto
                        </button>
                        <button
                          onClick={() => handleUpdateStatus("flagged")}
                          disabled={savingDetail}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none flex items-center gap-1 ${
                            selectedConv?.status === "flagged"
                              ? "bg-rose-600 text-white shadow shadow-rose-500/10"
                              : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          🔴 Flagged
                        </button>
                      </div>

                      {/* Lead Star */}
                      <button
                        onClick={handleToggleLead}
                        disabled={savingDetail}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                          selectedConv?.is_lead
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${selectedConv?.is_lead ? "fill-amber-400 text-amber-400" : "text-slate-450"}`} />
                        {selectedConv?.is_lead ? "Es Lead" : "Hacer Lead"}
                      </button>
                    </div>

                    {/* Metadata view: Source page */}
                    {selectedConv?.source_page && (
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 text-xs">
                        <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Página Origen</p>
                          <a
                            href={selectedConv.source_page}
                            target="_blank"
                            rel="noopener"
                            className="text-blue-400 underline truncate block max-w-[260px] hover:text-blue-300 mt-0.5"
                          >
                            {selectedConv.source_page}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messaging Area timeline */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px] bg-slate-50/50 chatbot-messages-scroll">
                    {messages.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs italic">
                        Sin mensajes registrados
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isBot = msg.role === "assistant";
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-2.5 ${isBot ? "flex-row" : "flex-row-reverse"}`}
                          >
                            {/* Icon */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5 text-white ${
                                isBot
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                  : "bg-slate-400"
                              }`}
                            >
                              {isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            </div>

                            {/* Bubble */}
                            <div
                              className={`max-w-[85%] px-3.5 py-2 text-[12.5px] leading-relaxed rounded-2xl shadow-sm ${
                                isBot
                                  ? "bg-slate-100 text-slate-800 rounded-tl-md border border-slate-200"
                                  : "bg-blue-600 text-white rounded-tr-md"
                              }`}
                            >
                              <div
                                className="chatbot-markdown-admin"
                                dangerouslySetInnerHTML={{
                                  __html: renderSimpleMarkdown(msg.content)
                                }}
                              />
                              <div className="text-[9px] text-slate-500 text-right mt-1.5 flex items-center justify-end gap-1">
                                <Clock className="w-2.5 h-2.5 text-slate-500" />
                                {formatChileanDate(msg.created_at).split(" ")[1]}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Visitor Info & Tags panel */}
                  <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-4">
                    {/* Tags block */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Tags de Clasificación
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedConv?.tags || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.8 rounded-lg flex items-center gap-1"
                          >
                            {t}
                            <button
                              onClick={() => handleRemoveTag(t)}
                              className="text-slate-500 hover:text-slate-700 p-0 hover:bg-transparent border-none bg-transparent cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        
                        {/* Add tag form */}
                        <form onSubmit={handleAddTag} className="inline-flex">
                          <input
                            type="text"
                            placeholder="+ tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            disabled={savingDetail}
                            className="bg-slate-100 border border-slate-200 text-slate-350 text-[10px] px-2 py-0.8 rounded-lg outline-none max-w-[65px] focus:border-blue-500/40"
                          />
                        </form>
                      </div>
                    </div>

                    {/* Visitor Contact Card - Editable */}
                    <div className="border-t border-slate-200/60 pt-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        📞 Datos de Contacto del Visitante
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-slate-450 uppercase">Nombre</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nombre del visitante"
                            className="w-full mt-0.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:border-blue-500/40 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-semibold text-slate-450 uppercase">Email</label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              placeholder="correo@ejemplo.com"
                              className="w-full mt-0.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:border-blue-500/40 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-semibold text-slate-450 uppercase">Teléfono</label>
                            <input
                              type="text"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="+56912345678"
                              className="w-full mt-0.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:border-blue-500/40 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleSaveVisitorInfo}
                          disabled={savingDetail || (!editName && !editEmail && !editPhone)}
                          className="bg-slate-100 border border-slate-700 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1"
                        >
                          {savingDetail ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          Guardar Datos
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
