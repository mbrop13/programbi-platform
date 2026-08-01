"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Users, Building, CreditCard, Settings, Plus, TrendingUp, Search, MoreHorizontal, ShieldCheck, Loader2, Activity, DollarSign, MessageSquare, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Ban, Mail, UserPlus, BarChart3, Palette, GraduationCap, Upload, Download, ChevronLeft, ChevronRight, Trash2, X, CheckCircle, AlertCircle, Globe, Lock, Play, FileText, Video, Megaphone, Sparkles, Tag, ArrowRight, Bell, Percent, ShoppingCart, Newspaper, Star, ExternalLink, Edit3, Code, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommunityMembers, adminUpdateUserSubscription } from "@/lib/supabase/comunidad";
import { adminGetCourses, adminUpdateCourseDescription, adminUpdateCourseShortDescription, adminGetLessons, adminAddLesson, adminUpdateLesson, adminTogglePublish, adminToggleHidden, adminDeleteLesson, adminToggleFreePreview, adminGetAllUsers, adminDeleteUser, adminBulkDeleteUsers, adminGetUserEnrollments, adminEnrollUser, adminRemoveEnrollment, adminUpdateUserRole, adminBulkImport, adminGetExportData, getAllPublishedCourses, adminGetDashboardStats, adminGetLeads, adminDeleteLead, adminBulkDeleteLeads, adminGetSchedules, adminAddSchedule, adminDeleteSchedule, adminToggleScheduleActive, adminGetPopups, adminCreatePopup, adminUpdatePopup, adminTogglePopup, adminDeletePopup, adminGetPromotions, adminCreatePromotion, adminTogglePromotion, adminDeletePromotion, adminGetPriceOverrides, adminUpsertPriceOverride, adminGetArticles, adminCreateArticle, adminUpdateArticle, adminDeleteArticle, adminToggleArticlePublish, adminToggleArticleFeatured, adminGetNewsletterCategories, adminCreateNewsletterCategory, adminUpdateNewsletterCategory, adminDeleteNewsletterCategory, adminToggleNewsletterCategory, adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminToggleCoupon, adminDeleteCoupon, adminGetCertificates, adminAddCertificate, adminImportCertificates, adminDeleteCertificate } from "@/lib/supabase/comunidad-ai";
import { Calendar, Radio, Film, Clock } from "lucide-react";
import { courses as allCourses } from "@/lib/data/courses";
import { communityPlans } from "@/lib/data/community_plans";
import ArticleBlockEditor from "@/components/shared/ArticleBlockEditor";
import AdminOverview from "./admin/AdminOverview";
import {
  formatRegistrationSource,
  matchesRegistrationSourceFilter,
  REGISTRATION_SOURCE_FILTERS,
  type RegistrationSourceCategory,
} from "@/lib/registration-source";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [unreadMembersCount, setUnreadMembersCount] = useState(0);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);
  const [unreadAsesoriasCount, setUnreadAsesoriasCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTab = new URLSearchParams(window.location.search).get("tab");
      if (urlTab) setActiveTab(urlTab);
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState(null, '', url.toString());
    }
  };

  useEffect(() => {
    async function checkUnreads() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: views } = await supabase.from("admin_views").select("*").eq("admin_id", user.id).single();
        const supportLast = views?.support_last_viewed_at || '1970-01-01T00:00:00.000Z';
        const membersLast = views?.members_last_viewed_at || '1970-01-01T00:00:00.000Z';

        const leadsLastStr = localStorage.getItem('admin_leads_last_viewed') || '1970-01-01T00:00:00.000Z';
        // Always try to use DB view first (if present), fallback to local storage
        const leadsLast = views?.leads_last_viewed_at && views.leads_last_viewed_at !== '1970-01-01T00:00:00.000Z' 
           ? views.leads_last_viewed_at 
           : leadsLastStr;

        const asesoriaLastStr = localStorage.getItem('admin_asesoria_last_viewed') || '1970-01-01T00:00:00.000Z';
        
        const [
          { count: supportCount },
          { count: membersCount },
          { count: leadsCount },
          { count: asesoriasCount }
        ] = await Promise.all([
          supabase.from("support_tickets").select("*", { count: 'exact', head: true }).gt("created_at", supportLast),
          supabase.from("profiles").select("*", { count: 'exact', head: true }).gt("created_at", membersLast),
          supabase.from("course_leads").select("*", { count: 'exact', head: true }).not("lead_type", "in", '("asesoria_schedule", "asesoria_b2b", "asesoria_b2c")').gt("created_at", leadsLast),
          supabase.from("course_leads").select("*", { count: 'exact', head: true }).in("lead_type", ["asesoria_schedule", "asesoria_b2b", "asesoria_b2c"]).gt("created_at", asesoriaLastStr)
        ]);

        setUnreadSupportCount(supportCount || 0);
        setUnreadMembersCount(membersCount || 0);
        setUnreadLeadsCount(leadsCount || 0);
        setUnreadAsesoriasCount(asesoriasCount || 0);

      } catch (e) {
        console.error(e);
      }
    }

    checkUnreads();
    window.addEventListener("adminViewsUpdated", checkUnreads);
    return () => window.removeEventListener("adminViewsUpdated", checkUnreads);
  }, []);

  const sidebarItems = [
    { id: "overview", label: "Estadísticas", icon: BarChart3 },
    { id: "support", label: "Soporte", icon: MessageSquare, badgeCount: unreadSupportCount },
    { id: "companies", label: "Empresas", icon: Building },
    { id: "members", label: "Miembros", icon: Users, badgeCount: unreadMembersCount },
    { id: "leads", label: "Contactos", icon: Mail, badgeCount: unreadLeadsCount },
    { id: "chatbot", label: "Chatbot IA", icon: Sparkles },
    { id: "prices", label: "Precios y Promos", icon: DollarSign },
    { id: "cart", label: "Carritos", icon: ShoppingCart },
    { id: "courses", label: "Cursos", icon: GraduationCap },
    { id: "asesorias", label: "Asesorías", icon: Video, badgeCount: unreadAsesoriasCount },
    { id: "live_admin", label: "Clases En Vivo", icon: Radio },
    { id: "schedules", label: "Horarios", icon: Calendar },
    { id: "export_csv", label: "Exportar Datos", icon: Download },
    { id: "import", label: "Importar CSV", icon: Upload },
    { id: "plans", label: "Planes", icon: CreditCard },
    { id: "popups", label: "Pop-ups", icon: Megaphone },
    { id: "newsletter", label: "Blog", icon: Newspaper },
    { id: "diplomas", label: "Diplomas", icon: Award },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto min-h-[600px]">
        <div className="w-full lg:w-60 flex flex-col gap-1.5 shrink-0">
           <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800/80 mb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Admin Panel</h3>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">Gestión de Plataforma</p>
                </div>
              </div>
           </div>
           
           {sidebarItems.map(item => {
             const Icon = item.icon;
             return (
               <button 
                 key={item.id}
                 onClick={() => {
                   if (item.id === "chatbot") {
                     window.location.href = "/comunidad/admin/chatbot";
                   } else {
                     handleTabChange(item.id);
                   }
                 }}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative border-none cursor-pointer
                   ${activeTab === item.id 
                     ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                     : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/60 hover:border-neutral-200 dark:hover:border-neutral-700"}
                 `}
               >
                  <Icon className="w-4 h-4" /> {item.label}
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black shadow-sm" style={{ paddingBottom: '0.5px' }}>
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </span>
                  ) : null}
               </button>
             )
           })}
        </div>

        <div className="flex-1 bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-250 dark:border-neutral-850/80 overflow-hidden min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              { activeTab === "overview" && <AdminOverview /> }
              { activeTab === "companies" && <AdminCompanies /> }
              { activeTab === "members" && <AdminMembers /> }
              { activeTab === "leads" && <AdminLeads /> }
              { activeTab === "cart" && <AdminAbandonedCarts /> }
              { activeTab === "courses" && <AdminCourses /> }
              { activeTab === "asesorias" && <AdminAsesorias /> }
              { activeTab === "live_admin" && <AdminLiveClasses /> }
              { activeTab === "schedules" && <AdminSchedules /> }
              { activeTab === "export_csv" && <AdminExportCsv /> }
              { activeTab === "import" && <AdminImport /> }
              { activeTab === "plans" && <AdminPlans /> }
              { activeTab === "settings" && <AdminSettings /> }
              { activeTab === "support" && <AdminSupport /> }
              { activeTab === "popups" && <AdminPopups /> }
              { activeTab === "prices" && <AdminPrices /> }
              { activeTab === "newsletter" && <AdminNewsletter /> }
              { activeTab === "diplomas" && <AdminDiplomas /> }
            </motion.div>
        </div>
    </div>
  );
}

// ─── ASESORIAS 1 A 1 (CALENDAR ADMIN) ───
const MONTH_NAMES_ADMIN = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAY_NAMES_ADMIN = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function AdminAsesorias() {
  const [activeView, setActiveView] = useState<"calendar" | "leads">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const formatDateYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      const res = await fetch(`/api/asesorias/slots?start=${start}&end=${end}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingSlots(false); }
  };

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("course_leads")
        .select("*")
        .in("lead_type", ["asesoria_schedule", "asesoria_b2b", "asesoria_b2c"])
        .order("created_at", { ascending: false });
      setLeads(data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingLeads(false); }
  };

  useEffect(() => {
    fetchSlots();
  }, [currentDate]);

  useEffect(() => {
    fetchLeads();
    localStorage.setItem('admin_asesoria_last_viewed', new Date().toISOString());
    window.dispatchEvent(new Event("adminViewsUpdated"));
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  })();

  const getSlotsForDate = (dateStr: string) => slots.filter(s => s.slot_date === dateStr);
  const getAvailableTimesForAdmin = (date: Date) => {
    const times = [];
    const dayOfWeek = date.getDay();
    const isMonToThu = dayOfWeek >= 1 && dayOfWeek <= 4;
    for (let h = 8; h <= 22; h++) {
      if (isMonToThu && h >= 19 && h <= 22) continue;
      times.push(`${String(h).padStart(2, "0")}:00`);
      times.push(`${String(h).padStart(2, "0")}:30`);
    }
    return times;
  };

  const handleBlockSlot = async (date: Date, time: string) => {
    const dateStr = formatDateYYYYMMDD(date);
    const key = `${dateStr}-${time}`;
    setActionLoading(key);
    try {
      await fetch("/api/asesorias/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block", slot_date: dateStr, slot_time: time })
      });
      await fetchSlots();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleReleaseSlot = async (date: Date, time: string) => {
    const dateStr = formatDateYYYYMMDD(date);
    const key = `${dateStr}-${time}`;
    setActionLoading(key);
    try {
      await fetch("/api/asesorias/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release", slot_date: dateStr, slot_time: time })
      });
      await fetchSlots();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleBlockDay = async (date: Date) => {
    const dateStr = formatDateYYYYMMDD(date);
    setActionLoading(`block-day-${dateStr}`);
    try {
      const times = getAvailableTimesForAdmin(date);
      await fetch("/api/asesorias/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block_day", slot_date: dateStr, times })
      });
      await fetchSlots();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleRejectLead = async (email: string, leadId: string) => {
    if (!confirm("¿Seguro que deseas rechazar este lead y liberar sus horas?")) return;
    setActionLoading(`reject-${leadId}`);
    try {
      await fetch("/api/asesorias/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_lead", user_email: email, lead_id: leadId })
      });
      await fetchLeads();
      await fetchSlots();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Asesorías 1 a 1</h2>
          <p className="text-sm text-gray-400">Gestiona disponibilidad y visualiza solicitudes.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setActiveView("calendar")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === "calendar" ? "bg-white text-brand-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Calendario
          </button>
          <button onClick={() => setActiveView("leads")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === "leads" ? "bg-white text-brand-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Solicitudes
          </button>
        </div>
      </div>

      {activeView === "calendar" ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg capitalize">
                {MONTH_NAMES_ADMIN[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES_ADMIN.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`e-${i}`} />;
                const dateStr = formatDateYYYYMMDD(date);
                const daySlots = getSlotsForDate(dateStr);
                const hasBlocked = daySlots.some(s => s.status === "blocked");
                const hasBooked = daySlots.some(s => s.status === "booked");
                const hasPending = daySlots.some(s => s.status === "pending_payment");
                const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                const isPast = date < today;

                return (
                  <button
                    key={dateStr}
                    onClick={() => !isPast && setSelectedDate(date)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all border-2
                      ${isPast ? "opacity-25 cursor-default border-transparent bg-transparent" : "cursor-pointer"}
                      ${isSelected && !isPast ? "bg-brand-blue text-white border-brand-blue shadow-md" : "bg-white text-gray-700 border-transparent hover:border-blue-200"}
                    `}
                  >
                    {date.getDate()}
                    {(hasBlocked || hasBooked || hasPending) && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {hasBooked && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {hasPending && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        {hasBlocked && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Reservado</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pendiente pago</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Bloqueado</span>
            </div>
          </div>

          {/* Time Slots Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">
                  {selectedDate
                    ? `${DAY_NAMES_ADMIN[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTH_NAMES_ADMIN[selectedDate.getMonth()]}`
                    : "Selecciona un día"}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Haz clic en un horario para bloquearlo o liberarlo.</p>
              </div>
              {selectedDate && (
                <button
                  onClick={() => handleBlockDay(selectedDate)}
                  disabled={actionLoading === `block-day-${formatDateYYYYMMDD(selectedDate)}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `block-day-${formatDateYYYYMMDD(selectedDate)}` ? "..." : "Bloquear Día"}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-5 max-h-[420px]">
              {!selectedDate ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">Elige un día en el calendario</div>
              ) : loadingSlots ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 text-brand-blue animate-spin" /></div>
              ) : (
                <div className="space-y-2">
                  {getAvailableTimesForAdmin(selectedDate).map(time => {
                    const dateStr = formatDateYYYYMMDD(selectedDate);
                    const slot = slots.find(s => s.slot_date === dateStr && s.slot_time === time);
                    const key = `${dateStr}-${time}`;
                    const isLoading = actionLoading === key;

                    const statusConfig = slot?.status === "booked"
                      ? { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", label: "Reservado", btn: "Liberar", btnClass: "bg-red-50 text-red-600 hover:bg-red-100" }
                      : slot?.status === "pending_payment"
                      ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Pago Pendiente", btn: "Liberar", btnClass: "bg-red-50 text-red-600 hover:bg-red-100" }
                      : slot?.status === "blocked"
                      ? { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Bloqueado", btn: "Liberar", btnClass: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" }
                      : { bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-500", label: "Disponible", btn: "Bloquear", btnClass: "bg-red-50 text-red-500 hover:bg-red-100" };

                    return (
                      <div key={time} className={`flex items-center justify-between p-3 rounded-xl border-2 ${statusConfig.bg} ${statusConfig.border}`}>
                        <div>
                          <span className={`font-bold text-sm ${statusConfig.text}`}>{time}</span>
                          <span className={`ml-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/70 ${statusConfig.text}`}>{statusConfig.label}</span>
                          {slot?.user_email && <div className="text-xs text-gray-500 mt-0.5">{slot.user_email}</div>}
                        </div>
                        <button
                          disabled={isLoading}
                          onClick={() => slot ? handleReleaseSlot(selectedDate, time) : handleBlockSlot(selectedDate, time)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusConfig.btnClass} disabled:opacity-50`}
                        >
                          {isLoading ? "..." : statusConfig.btn}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Leads view
        <div className="space-y-4">
          {loadingLeads ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No hay solicitudes de asesorías aún.</div>
          ) : leads.map(lead => (
            <div key={lead.id} className="bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    lead.lead_type === "asesoria_schedule" ? "bg-purple-100 text-purple-700" :
                    lead.lead_type === "asesoria_b2b" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {lead.lead_type === "asesoria_schedule" ? "Horario Solicitado" : lead.lead_type === "asesoria_b2b" ? "B2B Empresa" : "B2C Particular"}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleString("es-CL")}</span>
                </div>
                {lead.lead_type === "asesoria_schedule" && (
                  <button
                    onClick={() => handleRejectLead(lead.email, lead.id)}
                    disabled={actionLoading === `reject-${lead.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    {actionLoading === `reject-${lead.id}` ? "..." : "Rechazar"}
                  </button>
                )}
              </div>
              <h4 className="font-bold text-gray-900">{lead.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {lead.email}</span>
                {lead.whatsapp && lead.whatsapp !== "N/A" && <span>WhatsApp: {lead.whatsapp}</span>}
              </div>
              {lead.message && (
                <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 break-words whitespace-pre-wrap">{lead.message}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SOPORTE ───
function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We fetch tickets using a local supabase client, since admin checks its own view
  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        
        // Mark as viewed
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           await supabase.from("admin_views").upsert({
             admin_id: user.id,
             support_last_viewed_at: new Date().toISOString()
           });
           
           // Evitar recargar la página pero decirle a la UI que ya se vio (el badge)
           window.dispatchEvent(new Event("adminViewsUpdated"));
        }

        const { data } = await supabase
          .from("support_tickets")
          .select("*, profile:profiles(full_name, email)")
          .order("created_at", { ascending: false });
        
        setTickets(data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const markAsResolved = async (id: string, currentStatus: string) => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
      
      await supabase.from("support_tickets").update({
        status: newStatus,
        resolved_at: newStatus === "resolved" ? new Date().toISOString() : null
      }).eq("id", id);
      
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando tickets...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Soporte</h2>
           <p className="text-sm text-gray-400">Tickets de ayuda de la comunidad</p>
         </div>
       </div>

       {tickets.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">Todo en orden</h3>
           <p className="text-gray-400 text-sm">No hay tickets de soporte creados.</p>
         </div>
       ) : (
         <div className="space-y-4">
           {tickets.map(ticket => (
             <div key={ticket.id} className={`p-5 rounded-2xl border ${ticket.status === 'resolved' ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-100 shadow-sm'}`}>
               <div className="flex items-start gap-4">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                       {ticket.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                     </span>
                     <h4 className="font-bold text-gray-900 text-sm">{ticket.subject}</h4>
                   </div>
                   <p className="text-[11px] text-gray-400 font-medium mb-3">
                     De: {ticket.profile?.full_name || 'Desconocido'} ({ticket.profile?.email || 'Sin email'}) • {new Date(ticket.created_at).toLocaleString('es-CL')}
                   </p>
                   <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 whitespace-pre-wrap">
                     {ticket.message}
                   </div>
                 </div>
                 <button
                   onClick={() => markAsResolved(ticket.id, ticket.status)}
                   className={`p-2 rounded-xl transition-colors shrink-0 ${ticket.status === 'resolved' ? 'hover:bg-gray-200 text-gray-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                   title={ticket.status === 'resolved' ? 'Marcar Pendiente' : 'Marcar Resuelto'}
                 >
                   <CheckCircle className="w-5 h-5" />
                 </button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}

// ─── LEADS / CONTACTOS ───
function AdminLeads() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isExportingUnified, setIsExportingUnified] = useState(false);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetLeads();
        setAllLeads(data);
        
        // Mark as viewed
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const nowStr = new Date().toISOString();
           localStorage.setItem('admin_leads_last_viewed', nowStr);
           // Try to upsert to DB in case they ran the SQL artifact
           await supabase.from("admin_views").upsert({
             admin_id: user.id,
             leads_last_viewed_at: nowStr
           });
           
           window.dispatchEvent(new Event("adminViewsUpdated"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const leads = allLeads.filter(l => l.lead_type !== "abandoned_cart");
  const totalPages = Math.max(1, Math.ceil(leads.length / ITEMS_PER_PAGE));
  const displayedLeads = leads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelectLead = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllLeadsSelected = displayedLeads.length > 0 && displayedLeads.every(l => selectedLeadIds.includes(l.id));

  const toggleSelectAllLeads = () => {
    if (isAllLeadsSelected) {
      const currentIds = new Set(displayedLeads.map(l => l.id));
      setSelectedLeadIds(prev => prev.filter(id => !currentIds.has(id)));
    } else {
      const currentIds = displayedLeads.map(l => l.id);
      setSelectedLeadIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (deletingLeadId) return;
    setDeletingLeadId(leadId);
    try {
      const res = await adminDeleteLead(leadId);
      if (res && !res.success) {
        alert(res.error || "No se pudo eliminar el contacto.");
        return;
      }
      setAllLeads(prev => prev.filter(l => l.id !== leadId));
      setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
      alert("Contacto eliminado exitosamente.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al eliminar contacto.");
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleBulkDeleteLeads = async () => {
    if (selectedLeadIds.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);
    try {
      const res = await adminBulkDeleteLeads(selectedLeadIds);
      if (res && !res.success) {
        alert(res.error || "Error al eliminar contactos.");
        return;
      }
      const count = res.count || selectedLeadIds.length;
      setAllLeads(prev => prev.filter(l => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
      alert(`¡${count} contacto(s) eliminado(s) exitosamente!`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al eliminar contactos.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const exportUnifiedEmailsToCSV = async () => {
    if (isExportingUnified) return;
    setIsExportingUnified(true);
    try {
      const [membersData, leadsData] = await Promise.all([adminGetAllUsers(), adminGetLeads()]);
      
      // email (lower) -> name
      const emailMap = new Map<string, string>();

      // 1. Process members first
      for (const m of (membersData || [])) {
        const email = (m.email || '').trim().toLowerCase();
        if (!email) continue;
        const name = (m.full_name || '').trim();
        emailMap.set(email, name);
      }

      // 2. Process leads second (if member didn't have name or if lead has name)
      for (const l of (leadsData || [])) {
        const email = (l.email || '').trim().toLowerCase();
        if (!email) continue;
        const name = (l.name || '').trim();
        const existingName = emailMap.get(email);
        if (!emailMap.has(email) || (!existingName && name)) {
          emailMap.set(email, name);
        }
      }

      if (emailMap.size === 0) {
        alert("No se encontraron contactos para exportar.");
        return;
      }

      const rows: string[] = ["email,name"];
      emailMap.forEach((name, email) => {
        const cleanName = name ? `"${name.replace(/"/g, '""')}"` : '""';
        rows.push(`${email},${cleanName}`);
      });

      const csvContent = "\uFEFF" + rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const encodedUri = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = `programbi_todos_los_contactos_sin_duplicados_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error(err);
      alert("Error al exportar contactos unificados.");
    } finally {
      setIsExportingUnified(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return alert("No hay contactos para exportar.");
    const head = ["email", "name", "WhatsApp", "Cursos Interés", "Mensaje", "Origen", "Fecha"];
    const rows = leads.map(l => {
      const date = new Date(l.created_at).toLocaleDateString('es-CL');
      const courses = (l.selected_courses || []).join(" | ");
      return [
        l.email || '',
        `"${(l.name || '').replace(/"/g, '""')}"`,
        l.whatsapp || '',
        `"${courses}"`,
        `"${(l.message || '').replace(/"/g, '""')}"`,
        l.source_course || '',
        date
      ].join(',');
    });

    // UTF-8 BOM so Excel opens it with accents correctly
    const csvContent = "\uFEFF" + [head.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `programbi_leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando contactos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Contactos (Leads)</h2>
           <p className="text-sm text-gray-400">Solicitudes de información desde los cursos</p>
         </div>
         <div className="flex flex-wrap items-center gap-2.5">
           <button 
             onClick={exportUnifiedEmailsToCSV} 
             disabled={isExportingUnified}
             className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors border border-purple-100 cursor-pointer shadow-sm disabled:opacity-50"
             title="Exporta miembros + contactos en formato email,name sin duplicados"
           >
             {isExportingUnified ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             Exportar Todos (Sin Duplicados)
           </button>
           <button 
             onClick={exportToCSV} 
             className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 cursor-pointer shadow-sm"
           >
             <Download className="w-4 h-4" /> Exportar Leads CSV
           </button>
         </div>
       </div>

       {leads.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay contactos</h3>
           <p className="text-gray-400 text-sm">Aún no hay solicitudes de información.</p>
         </div>
       ) : (
         <div className="overflow-x-auto rounded-xl border border-gray-200">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-[#F8FAFC] border-b border-gray-200">
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-12 text-center">
                   <div className="flex items-center justify-center">
                     <button
                       type="button"
                       onClick={toggleSelectAllLeads}
                       className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                         isAllLeadsSelected
                           ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                           : "border-gray-300 hover:border-brand-blue bg-white"
                       }`}
                       title={isAllLeadsSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                     >
                       {isAllLeadsSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                     </button>
                   </div>
                 </th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Mensaje</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acción</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
                {displayedLeads.map(lead => (
                  <tr key={lead.id} className={`hover:bg-gray-50/50 transition-colors ${selectedLeadIds.includes(lead.id) ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => toggleSelectLead(lead.id, e)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                            selectedLeadIds.includes(lead.id)
                              ? "bg-brand-blue border-brand-blue text-white shadow-sm scale-110"
                              : "border-gray-300 hover:border-brand-blue bg-white"
                          }`}
                          title="Seleccionar contacto"
                        >
                          {selectedLeadIds.includes(lead.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-brand-blue">{lead.email}</div>
                      {lead.whatsapp && (
                        <a 
                         href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`} 
                         target="_blank" 
                         rel="noreferrer" 
                         className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1 hover:underline whitespace-nowrap"
                        >
                          <MessageSquare className="w-3 h-3" /> {lead.whatsapp}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                         lead.lead_type === 'enterprise' ? 'bg-indigo-50 text-indigo-600' :
                         lead.lead_type === 'notify' ? 'bg-amber-50 text-amber-600' :
                         'bg-blue-50 text-blue-600'
                       }`}>
                         {lead.lead_type === 'enterprise' ? '🏢 Empresa' : lead.lead_type === 'notify' ? '🔔 Notificar' : '📩 Contacto'}
                       </span>
                     </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(lead.selected_courses || []).map((c: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-blue border border-blue-100">{c}</span>
                        ))}
                      </div>
                      {lead.source_course && <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Origen: {lead.source_course}</div>}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell max-w-xs">
                      <div className="text-xs text-gray-600 whitespace-pre-wrap break-words">{lead.message || <span className="text-gray-300 italic">Sin mensaje</span>}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">{new Date(lead.created_at).toLocaleDateString('es-CL')}</div>
                      <div className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <HoldToDeleteButton
                        compact={true}
                        onConfirm={() => handleDeleteLead(lead.id)}
                        loading={deletingLeadId === lead.id}
                        disabled={deletingLeadId !== null || isBulkDeleting}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       )}
       {leads.length > ITEMS_PER_PAGE && (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1 pt-4 border-t border-gray-100">
           <span className="text-xs text-gray-500 font-medium">
             Mostrando {Math.min(leads.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(leads.length, currentPage * ITEMS_PER_PAGE)} de {leads.length} contactos
           </span>
           <div className="flex items-center gap-2">
             <button
               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
               disabled={currentPage === 1}
               className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             <span className="text-xs font-bold text-gray-700 min-w-[70px] text-center">
               Pág. {currentPage} de {totalPages}
             </span>
             <button
               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
               disabled={currentPage === totalPages}
               className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>
         </div>
       )}

       {/* Floating Bulk Actions Bar */}
       <AnimatePresence>
         {selectedLeadIds.length > 0 && (
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.95 }}
             className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-4 sm:gap-6 max-w-xl w-[92vw] sm:w-auto"
           >
             <div className="flex items-center gap-2.5 shrink-0">
               <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue/30 text-brand-blue font-black text-xs border border-brand-blue/50">
                 {selectedLeadIds.length}
               </span>
               <span className="text-xs sm:text-sm font-semibold text-gray-200">
                 {selectedLeadIds.length === 1 ? "1 contacto seleccionado" : `${selectedLeadIds.length} contactos seleccionados`}
               </span>
             </div>

             <div className="h-6 w-px bg-gray-800 hidden sm:block" />

             <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
               <HoldToDeleteButton
                 compact={false}
                 label={`Eliminar (${selectedLeadIds.length})`}
                 onConfirm={handleBulkDeleteLeads}
                 loading={isBulkDeleting}
                 disabled={isBulkDeleting}
               />

               <button
                 type="button"
                 onClick={() => setSelectedLeadIds([])}
                 className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
               >
                 Cancelar
               </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
  );
}

// ─── CARITOS ABANDONADOS ───
function AdminAbandonedCarts() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetLeads();
        setAllLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const carts = allLeads.filter(l => l.lead_type === "abandoned_cart");

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando carritos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Carritos Abandonados</h2>
            <p className="text-sm text-gray-400">Intenciones de compra de usuarios registrados</p>
          </div>
       </div>

       {carts.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay carritos</h3>
           <p className="text-gray-400 text-sm">Aún no se han registrado intenciones de compra.</p>
         </div>
       ) : (
         <div className="overflow-x-auto rounded-xl border border-gray-200">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-[#F8FAFC] border-b border-gray-200">
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Curso</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto Directo</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
               {carts.map(lead => (
                 <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-4 py-4">
                     <div className="font-bold text-gray-900 text-sm">{lead.name === "Usuario Logueado" ? "Estudiante Registrado" : lead.name}</div>
                     <div className="text-xs text-brand-blue font-medium">{lead.email}</div>
                   </td>
                   <td className="px-4 py-4">
                     <div className="flex flex-wrap gap-1">
                       {(lead.selected_courses || []).map((c: string, i: number) => (
                         <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">{c}</span>
                       ))}
                     </div>
                   </td>
                   <td className="px-4 py-4">
                     {lead.whatsapp ? (
                       <a 
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-100 float-left transition-colors"
                       >
                         <MessageSquare className="w-3 h-3" /> Chatear
                       </a>
                     ) : (
                       <a 
                        href={`mailto:${lead.email}`} 
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 float-left transition-colors"
                       >
                         <Mail className="w-3 h-3" /> Mail
                       </a>
                     )}
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap">
                     <div className="text-xs font-medium text-gray-900">{new Date(lead.created_at).toLocaleDateString('es-CL')}</div>
                     <div className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
    </div>
  );
}

// ─── HOLD TO DELETE BUTTON COMPONENT ───
function HoldToDeleteButton({
  onConfirm,
  label = "Mantén presionado para eliminar",
  compact = false,
  disabled = false,
  loading = false,
}: {
  onConfirm: () => void;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_DURATION = 1400; // 1.4 seconds

  const startHold = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (disabled || loading) return;
    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setIsHolding(false);
        setProgress(0);
        onConfirm();
      }
    }, 20);
  };

  const endHold = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (compact) {
    return (
      <div className="relative inline-block" title="Mantén presionado 1.5s para eliminar miembro">
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled || loading}
          className={`relative overflow-hidden p-2 rounded-xl border transition-all select-none touch-none ${
            isHolding
              ? "border-red-500 bg-red-50 text-red-600 scale-110 shadow-md"
              : "border-transparent text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
          } ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isHolding && (
            <div
              className="absolute inset-0 bg-red-500/20 transition-all duration-75 ease-linear pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          )}

          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500 relative z-10" />
          ) : (
            <Trash2 className={`w-4 h-4 relative z-10 transition-transform ${isHolding ? "scale-110 text-red-600" : ""}`} />
          )}
        </button>

        <AnimatePresence>
          {isHolding && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              className="absolute right-0 top-full mt-1.5 z-50 whitespace-nowrap bg-red-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-1.5 pointer-events-none border border-red-800"
            >
              <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
              <span>Mantén para eliminar ({Math.round(progress)}%)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled || loading}
        className={`relative overflow-hidden w-full py-2.5 px-4 rounded-xl border text-sm font-bold transition-all select-none touch-none flex items-center justify-center gap-2 ${
          isHolding
            ? "border-red-600 bg-red-600 text-white shadow-lg scale-[1.01]"
            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300"
        } ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isHolding && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-red-700/40 transition-all duration-75 ease-linear pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        )}

        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current relative z-10" />
            <span className="relative z-10">Eliminando...</span>
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4 relative z-10" />
            <span className="relative z-10">
              {isHolding ? `¡Mantén presionado! (${Math.round(progress)}%)` : label}
            </span>
          </>
        )}
      </button>
      <p className="text-[11px] text-gray-400 text-center mt-1.5 font-medium flex items-center justify-center gap-1">
        <span>🔥 Mantén presionado 1.5s para eliminar permanentemente.</span>
      </p>
    </div>
  );
}

// ─── MEMBERS ───
function AdminMembers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<RegistrationSourceCategory>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollType, setEnrollType] = useState("full");
  const [subPlan, setSubPlan] = useState("none");
  const [subExpiresAt, setSubExpiresAt] = useState("");
  const [updatingSub, setUpdatingSub] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isExportingUnified, setIsExportingUnified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      formatRegistrationSource(u.registration_source).toLowerCase().includes(q);
    const matchesSource = matchesRegistrationSourceFilter(u.registration_source, sourceFilter);
    return matchesSearch && matchesSource;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayedUsers = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelectUser = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = displayedUsers.length > 0 && displayedUsers.every(u => selectedUserIds.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = new Set(displayedUsers.map(u => u.id));
      setSelectedUserIds(prev => prev.filter(id => !currentIds.has(id)));
    } else {
      const currentIds = displayedUsers.map(u => u.id);
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (deletingUserId) return;
    setDeletingUserId(userId);
    try {
      const res = await adminDeleteUser(userId);
      if (res && !res.success) {
        alert(res.error || "No se pudo eliminar el miembro.");
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      alert("Miembro eliminado exitosamente.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al eliminar miembro.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);
    try {
      const res = await adminBulkDeleteUsers(selectedUserIds);
      if (res && !res.success) {
        alert(res.error || "Error al eliminar miembros.");
        return;
      }
      const deletedCount = res.count || selectedUserIds.length;
      setUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
      if (selectedUser && selectedUserIds.includes(selectedUser.id)) {
        setSelectedUser(null);
      }
      setSelectedUserIds([]);
      alert(`¡${deletedCount} miembro(s) eliminado(s) exitosamente!`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al eliminar miembros.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sourceFilter]);

  useEffect(() => {
    async function load() {
      try {
        const [userData, courseData] = await Promise.all([adminGetAllUsers(), adminGetCourses()]);
        setUsers(userData);
        setCourses(courseData);
        
        // Mark as viewed using a local client
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           await supabase.from("admin_views").upsert({
             admin_id: user.id,
             members_last_viewed_at: new Date().toISOString()
           });
           window.dispatchEvent(new Event("adminViewsUpdated"));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const selectUser = async (user: any) => {
    setSelectedUser(user);
    setSubPlan(user.subscription_plan || "none");
    setSubExpiresAt(user.subscription_expires_at ? user.subscription_expires_at.split('T')[0] : "");
    setLoadingEnrollments(true);
    try {
      const enrolls = await adminGetUserEnrollments(user.id);
      setUserEnrollments(enrolls);
    } catch (err) { console.error(err); }
    finally { setLoadingEnrollments(false); }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser || updatingSub) return;
    setUpdatingSub(true);
    try {
      const planVal = subPlan === "none" ? null : subPlan;
      const expiresVal = subExpiresAt ? new Date(subExpiresAt).toISOString() : null;
      
      const res = await adminUpdateUserSubscription(selectedUser.id, planVal, expiresVal);
      if (res && !res.success) {
        alert(res.error || "Error al actualizar suscripción.");
        return;
      }
      
      // Update local state
      const updatedUser = { 
        ...selectedUser, 
        subscription_plan: planVal, 
        subscription_expires_at: expiresVal 
      };
      setSelectedUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
      
      alert("Suscripción actualizada exitosamente.");
    } catch (err: any) { 
      console.error(err); 
      alert(err.message || "Error al actualizar suscripción.");
    } finally {
      setUpdatingSub(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedUser || !enrollCourseId) return;
    try {
      await adminEnrollUser(selectedUser.id, enrollCourseId, enrollType);
      const enrolls = await adminGetUserEnrollments(selectedUser.id);
      setUserEnrollments(enrolls);
      setEnrollCourseId("");
    } catch (err) { console.error(err); }
  };

  const handleRemoveEnrollment = async (courseSlug: string) => {
    if (!selectedUser) return;
    try {
      await adminRemoveEnrollment(selectedUser.id, courseSlug);
      setUserEnrollments(prev => prev.filter(e => e.course_slug !== courseSlug));
    } catch (err) { console.error(err); }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await adminUpdateUserRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) { console.error(err); }
  };

  const exportUnifiedEmailsToCSV = async () => {
    if (isExportingUnified) return;
    setIsExportingUnified(true);
    try {
      const [membersData, leadsData] = await Promise.all([adminGetAllUsers(), adminGetLeads()]);
      
      const emailMap = new Map<string, string>(); // email (lower) -> name

      for (const m of (membersData || [])) {
        const email = (m.email || '').trim().toLowerCase();
        if (!email) continue;
        const name = (m.full_name || '').trim();
        emailMap.set(email, name);
      }

      for (const l of (leadsData || [])) {
        const email = (l.email || '').trim().toLowerCase();
        if (!email) continue;
        const name = (l.name || '').trim();
        const existingName = emailMap.get(email);
        if (!emailMap.has(email) || (!existingName && name)) {
          emailMap.set(email, name);
        }
      }

      if (emailMap.size === 0) {
        alert("No se encontraron contactos para exportar.");
        return;
      }

      const rows: string[] = ["email,name"];
      emailMap.forEach((name, email) => {
        const cleanName = name ? `"${name.replace(/"/g, '""')}"` : '""';
        rows.push(`${email},${cleanName}`);
      });

      const csvContent = "\uFEFF" + rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const encodedUri = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = `programbi_todos_los_contactos_sin_duplicados_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error(err);
      alert("Error al exportar contactos unificados.");
    } finally {
      setIsExportingUnified(false);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return alert("No hay miembros para exportar.");
    const head = ["email", "name", "ID", "Teléfono", "Rol", "Origen Registro", "Ruta Origen", "Fecha Registro"];
    const rows = filtered.map(u => [
      u.email || '',
      `"${(u.full_name || '').replace(/"/g, '""')}"`,
      u.id,
      u.phone || '',
      u.role || 'student',
      `"${formatRegistrationSource(u.registration_source).replace(/"/g, '""')}"`,
      `"${(u.registration_source || '').replace(/"/g, '""')}"`,
      u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL") : ''
    ].join(','));

    // UTF-8 BOM so Excel opens it with accents correctly
    const csvContent = "\uFEFF" + [head.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `programbi_miembros_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Miembros</h2>
            <p className="text-sm text-gray-400">
              {filtered.length === users.length
                ? `${users.length} usuarios registrados`
                : `${filtered.length} de ${users.length} usuarios`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <button
               onClick={exportUnifiedEmailsToCSV}
               disabled={isExportingUnified}
               className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors border border-purple-100 cursor-pointer shadow-sm disabled:opacity-50"
               title="Exporta miembros + contactos en formato email,name sin duplicados"
             >
               {isExportingUnified ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
               Exportar Todos (Sin Duplicados)
             </button>
             <button onClick={exportToCSV} className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 hover:border-emerald-250 cursor-pointer shadow-sm">
               <Download className="w-4 h-4" /> Exportar Miembros
             </button>
             <select
               value={sourceFilter}
               onChange={(e) => setSourceFilter(e.target.value as RegistrationSourceCategory)}
               className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all cursor-pointer"
               title="Filtrar por origen de registro"
             >
               {REGISTRATION_SOURCE_FILTERS.map((f) => (
                 <option key={f.value} value={f.value}>{f.label}</option>
               ))}
             </select>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar usuario..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all w-full sm:w-64" />
             </div>
          </div>
       </div>


       {/* User detail panel */}
       <AnimatePresence>
         {selectedUser && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
             className="mb-6 overflow-hidden">
             <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                     {(selectedUser.full_name || '?')[0]}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900">{selectedUser.full_name || "Sin nombre"}</h3>
                     <p className="text-sm text-gray-400">{selectedUser.email}</p>
                     {selectedUser.phone && (
                       <p className="text-xs text-brand-blue font-medium mt-0.5">{selectedUser.phone}</p>
                     )}
                     <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                       <Globe className="w-3 h-3 text-gray-400" />
                       <span className="font-semibold text-gray-600">Origen:</span>
                       <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                         {formatRegistrationSource(selectedUser.registration_source)}
                       </span>
                       {selectedUser.registration_source && (
                         <span className="text-gray-400 font-mono text-[10px] truncate max-w-[200px]" title={selectedUser.registration_source}>
                           ({selectedUser.registration_source})
                         </span>
                       )}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <select value={selectedUser.role || 'student'} onChange={(e) => handleChangeRole(selectedUser.id, e.target.value)}
                     className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none">
                     <option value="student">Estudiante</option>
                     <option value="instructor">Instructor</option>
                     <option value="admin">Admin</option>
                   </select>
                   <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               </div>

               <h4 className="font-bold text-sm text-gray-700 mb-3">Cursos Activos</h4>
               {loadingEnrollments ? (
                 <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
               ) : (
                 <>
                   {userEnrollments.length === 0 ? (
                     <p className="text-sm text-gray-400 mb-4">Sin cursos asignados</p>
                   ) : (
                     <div className="space-y-2 mb-4">
                       {userEnrollments.map((e: any) => (
                         <div key={e.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                           <div className="flex items-center gap-3">
                             <GraduationCap className="w-4 h-4 text-brand-blue" />
                             <span className="text-sm font-semibold text-gray-800">{e.course?.title || e.course_slug}</span>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                               e.access_type === 'full' ? 'bg-emerald-100 text-emerald-700' :
                               e.access_type === 'trial' ? 'bg-amber-100 text-amber-700' :
                               'bg-blue-100 text-blue-700'}`}>
                               {e.access_type === 'full' ? 'Completo' : e.access_type === 'trial' ? 'Prueba' : 'Gratis'}
                             </span>
                           </div>
                           <button onClick={() => handleRemoveEnrollment(e.course_slug)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}

                   <div className="flex items-center gap-2">
                     <select value={enrollCourseId} onChange={e => setEnrollCourseId(e.target.value)}
                       className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-blue/40">
                       <option value="">Seleccionar curso...</option>
                       {courses.filter(c => !userEnrollments.some((e: any) => e.course_slug === c.slug)).map((c: any) => (
                         <option key={c.id} value={c.slug}>{c.title} {c.is_hidden ? '(Oculto)' : ''}</option>
                       ))}
                     </select>
                     <select value={enrollType} onChange={e => setEnrollType(e.target.value)}
                       className="text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none w-28">
                       <option value="full">Completo</option>
                       <option value="trial">Prueba</option>
                       <option value="free">Gratis</option>
                     </select>
                     <button onClick={handleEnroll} disabled={!enrollCourseId}
                       className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-30">
                       Activar
                     </button>
                   </div>
                 </>
               )}

               <hr className="my-5 border-gray-250" />
               <h4 className="font-bold text-sm text-gray-705 mb-3">Gestión de Suscripción (Segura)</h4>
               <div className="flex flex-col sm:flex-row items-center gap-3">
                 <div className="flex-1 w-full">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Plan de Suscripción:</label>
                   <select value={subPlan} onChange={e => setSubPlan(e.target.value)}
                     className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-blue/40">
                     <option value="none">Sin Suscripción (None)</option>
                     <option value="trial">Prueba (Trial)</option>
                     <option value="premium">Premium</option>
                     <option value="ultra">Ultra</option>
                   </select>
                 </div>
                 <div className="flex-1 w-full">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Expiración (Opcional - Vacío para Permanente):</label>
                   <input type="date" value={subExpiresAt} onChange={e => setSubExpiresAt(e.target.value)}
                     className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-blue/40" />
                 </div>
                 <div className="shrink-0 pt-5">
                   <button onClick={handleUpdateSubscription} disabled={updatingSub}
                     className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-30 flex items-center gap-1.5 shadow-sm">
                     {updatingSub && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                     Guardar Plan
                   </button>
                 </div>
               </div>

                <hr className="my-5 border-gray-250" />
                <div className="bg-red-50/60 border border-red-100 rounded-xl p-4">
                  <h4 className="font-bold text-xs text-red-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500" /> Eliminar Miembro
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Elimina permanentemente la cuenta de <span className="font-bold text-gray-800">{selectedUser.full_name || selectedUser.email}</span> y revoca todos sus accesos.
                  </p>
                  <HoldToDeleteButton
                    onConfirm={() => handleDeleteUser(selectedUser.id)}
                    label={`Mantén presionado para eliminar a ${selectedUser.full_name || selectedUser.email}`}
                    loading={deletingUserId === selectedUser.id}
                    disabled={deletingUserId !== null}
                  />
                </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <span className="text-sm text-gray-400">Cargando usuarios...</span>
          </div>
       ) : (
       <>
       <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
              <thead>
                 <tr className="bg-gray-50/80 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-4 py-3.5 w-12 text-center">
                       <div className="flex items-center justify-center">
                          <button
                             type="button"
                             onClick={toggleSelectAll}
                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                isAllSelected
                                   ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                                   : "border-gray-300 hover:border-brand-blue bg-white"
                             }`}
                             title={isAllSelected ? "Deseleccionar todos en esta página" : "Seleccionar todos en esta página"}
                          >
                             {isAllSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </button>
                       </div>
                    </th>
                    <th className="px-5 py-3.5">Usuario</th>
                    <th className="px-5 py-3.5">Contacto</th>
                    <th className="px-5 py-3.5">Rol</th>
                    <th className="px-5 py-3.5 hidden md:table-cell">Origen</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Registrado</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {displayedUsers.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedUserIds.includes(u.id) ? 'bg-blue-50/40' : ''}`}
                      onClick={() => selectUser(u)}>
                       <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                             <button
                                type="button"
                                onClick={(e) => toggleSelectUser(u.id, e)}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                   selectedUserIds.includes(u.id)
                                      ? "bg-brand-blue border-brand-blue text-white shadow-sm scale-110"
                                      : "border-gray-300 hover:border-brand-blue bg-white"
                                }`}
                                title="Seleccionar usuario"
                             >
                                {selectedUserIds.includes(u.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                             </button>
                          </div>
                       </td>
                       <td className="px-5 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                             {(u.full_name || '?')[0]}
                           </div>
                           <div>
                             <div className="font-semibold text-gray-900">{u.full_name || 'Sin Nombre'}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-5 py-4">
                          <div className="text-sm text-gray-600">{u.email}</div>
                          {u.phone && (
                            <div className="mt-1.5 flex items-center">
                              <a href={`https://wa.me/${u.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold hover:underline bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full transition-colors">
                                <MessageSquare className="w-3 h-3" /> {u.phone}
                              </a>
                            </div>
                          )}
                       </td>
                       <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                              u.role === 'instructor' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'}`}>
                             {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                             {(u.role || 'student').charAt(0).toUpperCase() + (u.role || 'student').slice(1)}
                          </span>
                       </td>
                       <td className="px-5 py-4 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center gap-1 max-w-[180px] px-2 py-1 rounded-lg text-[11px] font-bold truncate
                              ${u.registration_source
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                            title={u.registration_source || 'Sin origen registrado'}
                          >
                            <Globe className="w-3 h-3 shrink-0 opacity-70" />
                            <span className="truncate">{formatRegistrationSource(u.registration_source)}</span>
                          </span>
                       </td>
                       <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : '—'}
                       </td>
                       <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                             <HoldToDeleteButton
                                compact={true}
                                onConfirm={() => handleDeleteUser(u.id)}
                                loading={deletingUserId === u.id}
                                disabled={deletingUserId !== null || isBulkDeleting}
                             />
                             <button onClick={() => selectUser(u)} className="p-2 rounded-lg text-gray-300 hover:text-brand-blue hover:bg-blue-50 transition-colors" title="Ver detalles">
                                <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </motion.tr>
                 ))}
              </tbody>
          </table>
       </div>
       {filtered.length > ITEMS_PER_PAGE && (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1 pt-4 border-t border-gray-100">
           <span className="text-xs text-gray-500 font-medium">
             Mostrando {Math.min(filtered.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filtered.length, currentPage * ITEMS_PER_PAGE)} de {filtered.length} miembros
           </span>
           <div className="flex items-center gap-2">
             <button
               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
               disabled={currentPage === 1}
               className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             <span className="text-xs font-bold text-gray-700 min-w-[70px] text-center">
               Pág. {currentPage} de {totalPages}
             </span>
             <button
               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
               disabled={currentPage === totalPages}
               className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>
         </div>
       )}
       </>
       )}
    </div>
  )
}

// ─── COURSES ───
function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', module_name: '', video_url: '', module_order: 1, lesson_order: 1, is_free_preview: false, superclass_language: '', resources: [] as any[] });
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [showMarketingEdits, setShowMarketingEdits] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);

  const [editDescription, setEditDescription] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);
  const [editShortDescription, setEditShortDescription] = useState("");
  const [savingShortDescription, setSavingShortDescription] = useState(false);

  useEffect(() => {
    async function load() {
      try { const data = await adminGetCourses(); setCourses(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const selectCourse = async (course: any) => {
    setSelectedCourse(course);
    setEditDescription(course.description || "");
    setEditShortDescription(course.short_description || "");
    setLoadingLessons(true);
    try {
      const data = await adminGetLessons(course.id);
      setLessons(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setLoadingLessons(false); }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;

    setUploadingFile(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const ext = file.name.split(".").pop() || "bin";
      const path = `lessons/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("course-resources")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("course-resources")
        .getPublicUrl(path);

      const newResource = {
        name: file.name,
        url: publicUrl,
        size: file.size,
        path: path
      };

      setNewLesson(prev => ({
        ...prev,
        resources: [...(prev.resources || []), newResource]
      }));
    } catch (err: any) {
      console.error("Error uploading file:", err);
      alert(`Error al subir archivo: ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddLesson = async () => {
    if (!selectedCourse || !newLesson.title || !newLesson.video_url || savingLesson) return;
    setSavingLesson(true);
    const lessonPayload = {
      title: newLesson.title,
      module_name: newLesson.module_name,
      module_order: newLesson.module_order,
      lesson_order: newLesson.lesson_order,
      video_url: newLesson.video_url,
      is_free_preview: newLesson.is_free_preview,
      superclass_language: newLesson.superclass_language || null,
      resources: newLesson.resources || [],
    };

    try {
      if (editingLesson) {
        await adminUpdateLesson(editingLesson.id, lessonPayload);
      } else {
        await adminAddLesson({ ...lessonPayload, course_id: selectedCourse.id });
      }
      const data = await adminGetLessons(selectedCourse.id);
      setLessons(data);
      setNewLesson({ title: '', module_name: '', video_url: '', module_order: 1, lesson_order: 1, is_free_preview: false, superclass_language: '', resources: [] });
      setEditingLesson(null);
      setShowAddLesson(false);
    } catch (err) { 
      console.error(err); 
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await adminDeleteLesson(lessonId);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (err) { console.error(err); }
  };

  const handleStartEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title || '',
      module_name: lesson.module_name || '',
      video_url: lesson.video_url || '',
      module_order: lesson.module_order || 1,
      lesson_order: lesson.lesson_order || 1,
      is_free_preview: !!lesson.is_free_preview,
      superclass_language: lesson.superclass_language || '',
      resources: lesson.resources || [],
    });
    setShowAddLesson(true);
  };

  const handleTogglePreview = async (lessonId: string) => {
    try {
      await adminToggleFreePreview(lessonId);
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, is_free_preview: !l.is_free_preview } : l));
    } catch (err) { console.error(err); }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      await adminTogglePublish(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: !c.is_published } : c));
    } catch (err) { console.error(err); }
  };

  const handleToggleHidden = async (courseId: string) => {
    try {
      await adminToggleHidden(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_hidden: !c.is_hidden } : c));
    } catch (err) { console.error(err); }
  };

  const handleSaveDescription = async () => {
    if (!selectedCourse) return;
    setSavingDescription(true);
    try {
      await adminUpdateCourseDescription(selectedCourse.id, editDescription);
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, description: editDescription } : c));
      setSelectedCourse((prev: any) => prev ? { ...prev, description: editDescription } : null);
      alert("Descripción general actualizada. Se reflejará en la sección Hero de la página del curso.");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la descripción general.");
    } finally {
      setSavingDescription(false);
    }
  };

  const handleSaveShortDescription = async () => {
    if (!selectedCourse) return;
    setSavingShortDescription(true);
    try {
      await adminUpdateCourseShortDescription(selectedCourse.id, editShortDescription);
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, short_description: editShortDescription } : c));
      setSelectedCourse((prev: any) => prev ? { ...prev, short_description: editShortDescription } : null);
      alert("Descripción corta actualizada. Se reflejará en las tarjetas de la pantalla de pago.");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la descripción corta.");
    } finally {
      setSavingShortDescription(false);
    }
  };

  if (selectedCourse) {
    // Grouped lessons by module
    const modules: Record<string, any[]> = {};
    lessons.forEach(l => {
      if (!modules[l.module_name]) modules[l.module_name] = [];
      modules[l.module_name].push(l);
    });

    return (
      <div className="p-6 sm:p-8">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mb-4 transition-colors">
          ← Volver a cursos
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">{selectedCourse.title}</h2>
            <p className="text-sm text-gray-400">{lessons.length} lecciones · {selectedCourse.duration_hours || selectedCourse.duration_hours === 0 ? selectedCourse.duration_hours : 0}h</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMarketingEdits(!showMarketingEdits)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                showMarketingEdits 
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              {showMarketingEdits ? "Ocultar Descripciones" : "Configurar Descripciones"}
            </button>
            <button onClick={() => { setShowAddLesson(!showAddLesson); setEditingLesson(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Agregar Lección
            </button>
          </div>
        </div>

        {/* Marketing Description Editors */}
        {showMarketingEdits && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Description Card */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-950 text-base mb-1.5 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-blue-500" />
                  Descripción General (Sección Hero)
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Esta descripción detallada se muestra en la sección Hero de la página de detalles de este curso. Utiliza un estilo persuasivo y enfocado a ventas.
                </p>
                <div className="relative">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                    placeholder="Escribe la descripción general del curso..."
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    {editDescription.length} caracteres
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex justify-end">
                <button
                  onClick={handleSaveDescription}
                  disabled={savingDescription}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 border-none cursor-pointer shadow-sm"
                >
                  {savingDescription ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    "Guardar Descripción General"
                  )}
                </button>
              </div>
            </div>

            {/* Short Description Card */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-950 text-base mb-1.5 flex items-center gap-2">
                  <Edit3 className="w-4.5 h-4.5 text-indigo-500" />
                  Descripción Corta (Checkout / Tarjetas)
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Esta descripción breve aparece en las tarjetas de selección y el carrito de la pantalla de pago. Recomendado menor a 150 caracteres para un diseño limpio.
                </p>
                <div className="relative">
                  <textarea
                    value={editShortDescription}
                    onChange={(e) => setEditShortDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                    placeholder="Escribe una descripción corta e impactante..."
                  />
                  <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded border ${editShortDescription.length > 150 ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-gray-400 bg-gray-50 border-gray-100'}`}>
                    {editShortDescription.length} caracteres
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex justify-end">
                <button
                  onClick={handleSaveShortDescription}
                  disabled={savingShortDescription}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 border-none cursor-pointer shadow-sm"
                >
                  {savingShortDescription ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    "Guardar Descripción Corta"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Form */}
        <AnimatePresence>
          {showAddLesson && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900">{editingLesson ? "Editar Lección" : "Nueva Lección"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Título</label>
                    <input type="text" placeholder="Ej. Introducción a las variables" value={newLesson.title} onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Módulo</label>
                    <input type="text" placeholder="Ej. Módulo 1: Fundamentos" value={newLesson.module_name} onChange={e => setNewLesson(p => ({ ...p, module_name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">URL del video</label>
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-red-500 shrink-0" />
                      <input type="text" placeholder="https://youtube.com/watch?v=..." value={newLesson.video_url} onChange={e => setNewLesson(p => ({ ...p, video_url: e.target.value }))}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500">Módulo #</label>
                      <input type="number" min={1} value={newLesson.module_order} onChange={e => setNewLesson(p => ({ ...p, module_order: parseInt(e.target.value) || 1 }))}
                        className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500">Lección #</label>
                      <input type="number" min={1} value={newLesson.lesson_order} onChange={e => setNewLesson(p => ({ ...p, lesson_order: parseInt(e.target.value) || 1 }))}
                        className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-500">Super Clase:</label>
                    <select value={newLesson.superclass_language || ''} onChange={e => setNewLesson(p => ({ ...p, superclass_language: e.target.value }))}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-blue/40">
                      <option value="">Ninguno (Solo Video)</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL</option>
                      <option value="javascript">JavaScript</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Archivos / Recursos descargables</label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white/50 flex flex-col items-center justify-center gap-2">
                      {uploadingFile ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                          Subiendo archivo...
                        </div>
                      ) : (
                        <label className="flex items-center gap-1.5 px-4 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer active:scale-98 transition-all border border-gray-250">
                          <Upload className="w-3.5 h-3.5" />
                          Subir Archivo
                          <input type="file" onChange={handleUploadFile} className="hidden" />
                        </label>
                      )}
                      <p className="text-[10px] text-gray-400">PDF, Excel, Word, CSV, ZIP, etc. (Máx. 10MB)</p>
                    </div>

                    {/* Resources list */}
                    {newLesson.resources && newLesson.resources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {newLesson.resources.map((res: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100 text-xs">
                            <span className="font-semibold text-gray-700 truncate max-w-[200px]" title={res.name}>{res.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-450">{res.size ? `${(res.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
                              <button
                                onClick={async () => {
                                  if (res.path) {
                                    try {
                                      const { createClient } = await import("@/lib/supabase/client");
                                      const supabase = createClient();
                                      await supabase.storage.from("course-resources").remove([res.path]);
                                    } catch (err) {
                                      console.error("Error deleting from storage:", err);
                                    }
                                  }
                                  setNewLesson(prev => ({
                                    ...prev,
                                    resources: prev.resources.filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                title="Eliminar archivo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="free_preview" checked={newLesson.is_free_preview} onChange={e => setNewLesson(p => ({ ...p, is_free_preview: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                    <label htmlFor="free_preview" className="text-sm font-medium text-gray-700">Lección de prueba gratuita</label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => {
                    setShowAddLesson(false);
                    setEditingLesson(null);
                    setNewLesson({ title: '', module_name: '', video_url: '', module_order: 1, lesson_order: 1, is_free_preview: false, superclass_language: '', resources: [] });
                  }} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
                  <button onClick={handleAddLesson} disabled={!newLesson.title || !newLesson.video_url || savingLesson}
                    className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 flex items-center gap-1.5">
                    {savingLesson && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Guardar Lección
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lessons List */}
        {loadingLessons ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
        ) : lessons.length === 0 ? (
          <div className="py-12 text-center">
            <Play className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No hay lecciones. Agrega la primera.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(modules).map(([moduleName, moduleLessons]) => (
              <div key={moduleName} className="rounded-2xl overflow-hidden bg-gray-50/40">
                <div className="bg-gray-100/60 px-5 py-3 font-bold text-sm text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> {moduleName || "Sin módulo"}
                </div>
                <div className="divide-y divide-gray-100/60">
                  {moduleLessons.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100/60 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{lesson.lesson_order}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</span>
                          {lesson.resources && Array.isArray(lesson.resources) && lesson.resources.length > 0 && (
                            <span className="text-[9px] font-black bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 shrink-0" title={`${lesson.resources.length} recursos adjuntos`}>
                              <FileText className="w-2.5 h-2.5" /> {lesson.resources.length} {lesson.resources.length === 1 ? "archivo" : "archivos"}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">{lesson.video_url ? <><Video className="w-3 h-3" /> YouTube</> : "Sin video"}</div>
                      </div>
                      {lesson.is_free_preview && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">GRATIS</span>
                      )}
                      <button onClick={() => handleTogglePreview(lesson.id)} title={lesson.is_free_preview ? "Quitar preview" : "Hacer gratuita"}
                        className={`p-1.5 rounded-lg transition-colors ${lesson.is_free_preview ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleStartEditLesson(lesson)} title="Editar lección"
                        className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Cursos</h2>
           <p className="text-sm text-gray-400">{courses.length} cursos en la plataforma</p>
         </div>
       </div>

       {loading ? (
         <div className="py-20 flex flex-col items-center gap-3">
           <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
           <span className="text-sm text-gray-400">Cargando cursos...</span>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {courses.map((course: any) => (
             <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
               onClick={() => selectCourse(course)}
               className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
               <div className="absolute top-4 right-4 flex items-center gap-2">
                 {course.is_hidden ? (
                   <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <EyeOff className="w-3 h-3" /> Oculto Catálogo
                   </span>
                 ) : null}
                 {course.is_published ? (
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <Globe className="w-3 h-3" /> Publicado
                   </span>
                 ) : (
                   <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <Lock className="w-3 h-3" /> Borrador
                   </span>
                 )}
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.accent_color + '15' }}>
                   <GraduationCap className="w-6 h-6" style={{ color: course.accent_color }} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-blue transition-colors truncate">{course.title}</h3>
                   <p className="text-xs text-gray-400 mt-0.5">{course.duration_hours}h · {course.level}</p>
                   {course.tech_stack && (
                     <div className="flex flex-wrap gap-1 mt-2">
                       {course.tech_stack.slice(0, 3).map((t: string, i: number) => (
                         <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{t}</span>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
               <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                 <button onClick={(e) => { e.stopPropagation(); handleTogglePublish(course.id); }}
                   className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${course.is_published ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                   {course.is_published ? 'Borrador' : 'Publicar'}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleToggleHidden(course.id); }}
                   className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors border ${course.is_hidden ? 'bg-white border-blue-200 text-brand-blue hover:bg-blue-50' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                   {course.is_hidden ? 'Mostrar Catálogo' : 'Ocultar Catálogo'}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); selectCourse(course); }}
                   className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors">
                   <Play className="w-4 h-4" />
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       )}
    </div>
  )
}

// ─── EXPORT CSV ───
function AdminExportCsv() {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); // all, course, plan
  const [filterCourse, setFilterCourse] = useState('');
  const [filterPlan, setFilterPlan] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [uData, cData] = await Promise.all([adminGetExportData(), adminGetCourses()]);
        setUsers(uData);
        setCourses(cData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleExport = () => {
    let filtered = users;
    if (filterType === 'course' && filterCourse) {
      filtered = users.filter(u => u.enrollments?.some((e: any) => e.course_slug === filterCourse));
    } else if (filterType === 'plan' && filterPlan) {
      filtered = users.filter(u => u.subscription_plan === filterPlan);
    }

    if (filtered.length === 0) return alert("No hay usuarios que coincidan con estos filtros.");

    // UTF-8 BOM helps excel read accents properly
    const head = ["email", "name", "ID", "Rol", "Suscripción", "Cursos (Slugs)", "Fecha Registro"];
    const rows = filtered.map(u => {
      const coursesNames = (u.enrollments || []).map((e: any) => e.course_slug).join(' | ');
      return [
        u.email || '',
        `"${u.full_name || ''}"`,
        u.id,
        u.role || 'student',
        u.subscription_plan || 'ninguno',
        `"${coursesNames}"`,
        new Date(u.created_at).toLocaleDateString("es-MX")
      ].join(',');
    });

    const csvContent = "\uFEFF" + [head.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `alumnos_export_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-3" />
        <span className="text-sm text-gray-400">Calculando matriz de usuarios y ventas...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Exportador de Datos</h2>
         <p className="text-sm text-gray-400">Filtra y exporta tus usuarios en formato CSV, listos para campañas de correos.</p>
       </div>

       <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           <button onClick={() => setFilterType('all')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'all' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <Users className={`w-5 h-5 ${filterType==='all' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='all' ? 'text-brand-blue': 'text-gray-700'}`}>Todos</div><div className="text-[10px] text-gray-400 mt-0.5">La base completa</div></div>
           </button>
           <button onClick={() => setFilterType('plan')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'plan' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <CreditCard className={`w-5 h-5 ${filterType==='plan' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='plan' ? 'text-brand-blue': 'text-gray-700'}`}>Suscriptores</div><div className="text-[10px] text-gray-400 mt-0.5">Por plan activo</div></div>
           </button>
           <button onClick={() => setFilterType('course')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'course' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <GraduationCap className={`w-5 h-5 ${filterType==='course' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='course' ? 'text-brand-blue': 'text-gray-700'}`}>Estudiantes</div><div className="text-[10px] text-gray-400 mt-0.5">De un curso específico</div></div>
           </button>
         </div>

         <AnimatePresence mode="wait">
           {filterType === 'plan' && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Seleccionar Plan</label>
               <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue/50">
                 <option value="">-- Elige un plan --</option>
                 <option value="pro">Plan Pro</option>
                 <option value="max">Plan Max</option>
                 <option value="ultra">Plan Ultra</option>
               </select>
             </motion.div>
           )}
           {filterType === 'course' && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Seleccionar Curso</label>
               <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue/50">
                 <option value="">-- Elige un curso --</option>
                 {courses.map(c => <option key={c.id} value={c.slug}>{c.title} {c.is_hidden ? '(Oculto)' : ''}</option>)}
               </select>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button onClick={handleExport} className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2">
              <Download className="w-4 h-4" /> 
              Generar y Descargar CSV
            </button>
         </div>
       </div>
    </div>
  )
}

// ─── CSV IMPORT ───
function AdminImport() {
  const [csvData, setCsvData] = useState<{ email: string; curso_slug: string; access_type: string }[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [rawText, setRawText] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;
    
    // Skip header
    const rows = lines.slice(1).map(line => {
      const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
      return { email: parts[0] || '', curso_slug: parts[1] || '', access_type: parts[2] || 'full' };
    }).filter(r => r.email && r.curso_slug);

    setCsvData(rows);
  };

  const handleImport = async () => {
    if (csvData.length === 0) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await adminBulkImport(csvData);
      setResult(res);
    } catch (err) { console.error(err); }
    finally { setImporting(false); }
  };

  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Importar por CSV</h2>
         <p className="text-sm text-gray-400">Carga masiva de enrollments desde un archivo CSV</p>
       </div>

       <div className="bg-gray-50 rounded-2xl border border-gray-200 border-dashed p-8 text-center mb-6">
         <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
         <p className="text-sm text-gray-500 mb-4">Arrastra un archivo CSV o haz clic para seleccionar</p>
         <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
         <label htmlFor="csv-upload" className="inline-block px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm cursor-pointer transition-colors shadow-sm">
           Seleccionar CSV
         </label>
         <p className="text-[11px] text-gray-400 mt-3">
           Formato: <code className="bg-gray-200 px-1.5 py-0.5 rounded">email,curso_slug,access_type</code>
         </p>
         <p className="text-[11px] text-gray-400 mt-1">
           access_type: <code className="bg-gray-200 px-1 rounded">full</code> | <code className="bg-gray-200 px-1 rounded">trial</code> | <code className="bg-gray-200 px-1 rounded">free</code>
         </p>
       </div>

       {/* Preview */}
       {csvData.length > 0 && (
         <div className="mb-6">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-bold text-sm text-gray-700">{csvData.length} registros para importar</h3>
             <button onClick={handleImport} disabled={importing}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
               {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               {importing ? "Importando..." : "Ejecutar Importación"}
             </button>
           </div>
           <div className="overflow-x-auto rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
             <table className="w-full text-left text-sm">
               <thead className="sticky top-0 bg-gray-50">
                 <tr className="text-gray-400 text-xs uppercase font-semibold">
                   <th className="px-4 py-2.5">#</th>
                   <th className="px-4 py-2.5">Email</th>
                   <th className="px-4 py-2.5">Curso (slug)</th>
                   <th className="px-4 py-2.5">Tipo Acceso</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {csvData.map((row, i) => (
                   <tr key={i} className="text-gray-700">
                     <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                     <td className="px-4 py-2 font-medium">{row.email}</td>
                     <td className="px-4 py-2"><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{row.curso_slug}</code></td>
                     <td className="px-4 py-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                         row.access_type === 'full' ? 'bg-emerald-100 text-emerald-700' :
                         row.access_type === 'trial' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                         {row.access_type}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}

       {/* Results */}
       {result && (
         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 space-y-3"
           style={{ borderColor: result.failed > 0 ? '#fbbf24' : '#10b981', backgroundColor: result.failed > 0 ? '#fffbeb' : '#ecfdf5' }}>
           <div className="flex items-center gap-3">
             {result.failed === 0 ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-amber-500" />}
             <h3 className="font-bold text-gray-900">Importación completada</h3>
           </div>
           <p className="text-sm text-gray-700">
             <strong className="text-emerald-600">{result.success}</strong> exitosos · <strong className="text-red-500">{result.failed}</strong> fallidos
           </p>
           {result.errors.length > 0 && (
             <div className="bg-white/60 rounded-xl p-4 max-h-32 overflow-y-auto">
               {result.errors.map((err, i) => (
                 <div key={i} className="text-xs text-red-600 py-0.5">• {err}</div>
               ))}
             </div>
           )}
         </motion.div>
       )}
    </div>
  )
}

// ─── PLANS ───
function AdminPlans() {
  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Planes de Pago</h2>
            <p className="text-sm text-gray-400">Gestiona los planes de tu comunidad</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
             <Plus className="w-4 h-4" /> Crear Plan
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="border border-gray-200 rounded-2xl p-6 relative hover:shadow-md transition-all">
              <div className="absolute top-5 right-5"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Activo</span></div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4"><CreditCard className="w-6 h-6 text-brand-blue" /></div>
              <h3 className="font-black text-lg text-gray-900 mb-1">Premium Anual</h3>
              <div className="text-3xl font-black text-brand-blue mb-1">$199 <span className="text-sm text-gray-400 font-medium">/ año</span></div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Acceso completo a todas las clases, comunidad y Masterclasses.</p>
              <div className="flex items-center gap-2">
                 <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-gray-200">Editar</button>
              </div>
           </div>
           <div className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl p-6 relative hover:shadow-md transition-all">
              <div className="absolute top-5 right-5"><span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-lg">⭐ Popular</span></div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-indigo-600" /></div>
              <h3 className="font-black text-lg text-indigo-900 mb-1">Bootcamp Intensivo</h3>
              <div className="text-3xl font-black text-indigo-600 mb-1">$499 <span className="text-sm text-gray-400 font-medium">pago único</span></div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">4 semanas en vivo con revisión de código 1-a-1 y proyectos reales.</p>
              <div className="flex items-center gap-2">
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">Editar</button>
              </div>
           </div>
       </div>
    </div>
  )
}

// ─── SCHEDULES ───
function AdminSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    course_slug: '', level_name: 'Básico', start_date: '',
    schedule_days: 'Lunes y Miércoles', schedule_time: '19:30 a 21:30', duration_hours: 16,
  });

  useEffect(() => {
    async function load() {
      try { const data = await adminGetSchedules(); setSchedules(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleAdd = async () => {
    if (!newSchedule.course_slug || !newSchedule.start_date) return;
    try {
      await adminAddSchedule(newSchedule);
      const data = await adminGetSchedules();
      setSchedules(data);
      setShowAdd(false);
      setNewSchedule({ course_slug: '', level_name: 'Básico', start_date: '', schedule_days: 'Lunes y Miércoles', schedule_time: '19:30 a 21:30', duration_hours: 16 });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try { await adminDeleteSchedule(id); setSchedules(prev => prev.filter(s => s.id !== id)); }
    catch (err) { console.error(err); }
  };

  const handleToggle = async (id: string) => {
    try { await adminToggleScheduleActive(id); setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)); }
    catch (err) { console.error(err); }
  };

  // Catálogo completo (incluye copilot, copilot-studio, etc.)
  const courseOptions = allCourses
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, "es"))
    .map((c) => ({ slug: c.slug, name: c.title, levels: c.levels }));

  const selectedCourse = courseOptions.find((c) => c.slug === newSchedule.course_slug);
  const levelOptions = selectedCourse?.levels?.length
    ? selectedCourse.levels.map((l) => l.name)
    : ["Básico", "Intermedio", "Avanzado", "Único"];

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Horarios de Cursos</h2>
           <p className="text-sm text-gray-400">Gestiona fechas y horarios de inicio de cada curso</p>
         </div>
         <button onClick={() => setShowAdd(!showAdd)}
           className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm border-none cursor-pointer">
           <Plus className="w-4 h-4" /> Agregar Horario
         </button>
       </div>

       {/* Add form */}
       <AnimatePresence>
         {showAdd && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
             <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
               <h3 className="font-bold text-sm text-gray-900">Nuevo Horario</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <select
                   value={newSchedule.course_slug}
                   onChange={e => {
                     const slug = e.target.value;
                     const course = courseOptions.find((c) => c.slug === slug);
                     const defaultLevel = course?.levels?.[0]?.name || "Básico";
                     setNewSchedule(p => ({ ...p, course_slug: slug, level_name: defaultLevel }));
                   }}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   <option value="">Seleccionar curso...</option>
                   {courseOptions.map(c => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
                 </select>
                 <select value={newSchedule.level_name} onChange={e => setNewSchedule(p => ({ ...p, level_name: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   {levelOptions.map((level) => (
                     <option key={level} value={level}>{level}</option>
                   ))}
                 </select>
                 <input type="date" value={newSchedule.start_date} onChange={e => setNewSchedule(p => ({ ...p, start_date: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                 <select value={newSchedule.schedule_days} onChange={e => setNewSchedule(p => ({ ...p, schedule_days: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   <option value="Lunes y Miércoles">Lunes y Miércoles</option>
                   <option value="Martes y Jueves">Martes y Jueves</option>
                   <option value="Sábados">Sábados</option>
                 </select>
                 <input type="text" placeholder="Horario (ej: 19:30 a 21:30)" value={newSchedule.schedule_time}
                   onChange={e => setNewSchedule(p => ({ ...p, schedule_time: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                 <div className="flex items-center gap-2">
                   <label className="text-xs font-semibold text-gray-500">Duración (hrs)</label>
                   <input type="number" min={1} value={newSchedule.duration_hours} onChange={e => setNewSchedule(p => ({ ...p, duration_hours: parseInt(e.target.value) || 16 }))}
                     className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                 </div>
               </div>
               <div className="flex justify-end gap-2">
                 <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors border-none cursor-pointer bg-transparent">Cancelar</button>
                 <button onClick={handleAdd} disabled={!newSchedule.course_slug || !newSchedule.start_date}
                   className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 border-none cursor-pointer">
                   Guardar Horario
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {loading ? (
         <div className="py-20 flex flex-col items-center gap-3">
           <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
           <span className="text-sm text-gray-400">Cargando horarios...</span>
         </div>
       ) : schedules.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay horarios</h3>
           <p className="text-gray-400 text-sm">Agrega el primer horario de curso.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {schedules.map(sched => (
             <motion.div key={sched.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
               className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${sched.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
               <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                 <Calendar className="w-6 h-6 text-brand-blue" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-gray-900 text-sm">
                     {allCourses.find((c) => c.slug === sched.course_slug)?.title || sched.course_slug.replace(/-/g, " ")}
                   </span>
                   <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{sched.level_name}</span>
                   {!sched.is_active && <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Inactivo</span>}
                 </div>
                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                   <span>📅 {new Date(sched.start_date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span>📆 {sched.schedule_days} · {sched.schedule_time}</span>
                   <span>⏱ {sched.duration_hours}h</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                 <button onClick={() => handleToggle(sched.id)}
                   className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-colors border-none cursor-pointer ${sched.is_active ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                   {sched.is_active ? 'Desactivar' : 'Activar'}
                 </button>
                 <button onClick={() => handleDelete(sched.id)}
                   className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer bg-transparent">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       )}
    </div>
  )
}

// ─── SETTINGS ───
function AdminSettings() {
  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Configuración</h2>
         <p className="text-sm text-gray-400">Personaliza tu comunidad</p>
       </div>
       <div className="space-y-6 max-w-2xl">
         <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
           <h3 className="font-bold text-gray-900 text-sm mb-4">Información General</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre de la Comunidad</label>
               <input type="text" defaultValue="ProgramBI Community" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all" />
             </div>
             <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1.5">Descripción</label>
               <textarea defaultValue="Comunidad de Data Analytics, SQL, Python y Power BI" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all resize-none" rows={3} />
             </div>
           </div>
         </div>
         <button className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
           Guardar Cambios
         </button>
       </div>
    </div>
  )
}

// ─── PROMO POPUPS ───
const POPUP_TYPES = [
  { value: "promo", label: "Promoción", icon: Sparkles, color: "#1890FF" },
  { value: "course", label: "Curso Nuevo", icon: GraduationCap, color: "#10B981" },
  { value: "discount", label: "Descuento", icon: Percent, color: "#F59E0B" },
  { value: "announcement", label: "Anuncio", icon: Megaphone, color: "#7C3AED" },
];

const TARGETS = [
  { value: "all", label: "Todos" },
  { value: "guests", label: "Solo Visitantes" },
  { value: "members", label: "Solo Miembros" },
];

function AdminPopups() {
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [editingPopupId, setEditingPopupId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    cta_text: "Ver más",
    cta_url: "/",
    badge_text: "",
    popup_type: "promo",
    accent_color: "#1890FF",
    image_url: "",
    starts_at: "",
    ends_at: "",
    show_to: "all",
    display_delay_seconds: 3,
    dismissible: true,
    show_once_per_session: true,
    custom_html: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetPopups();
        setPopups(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: "", description: "", cta_text: "Ver más", cta_url: "/", badge_text: "",
      popup_type: "promo", accent_color: "#1890FF", image_url: "",
      starts_at: "", ends_at: "", show_to: "all",
      display_delay_seconds: 3, dismissible: true, show_once_per_session: true,
      custom_html: "",
    });
    setEditorMode("visual");
    setEditingPopupId(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        badge_text: form.badge_text || null,
        image_url: form.image_url || null,
        custom_html: form.custom_html || null,
      };
      
      if (editingPopupId) {
        await adminUpdatePopup(editingPopupId, payload);
      } else {
        await adminCreatePopup(payload);
      }
      
      const data = await adminGetPopups();
      setPopups(data);
      resetForm();
      setShowCreate(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleEdit = (popup: any) => {
    setForm({
      title: popup.title || "",
      description: popup.description || "",
      cta_text: popup.cta_text || "Ver más",
      cta_url: popup.cta_url || "/",
      badge_text: popup.badge_text || "",
      popup_type: popup.popup_type || "promo",
      accent_color: popup.accent_color || "#1890FF",
      image_url: popup.image_url || "",
      starts_at: popup.starts_at ? new Date(popup.starts_at).toISOString().slice(0, 16) : "",
      ends_at: popup.ends_at ? new Date(popup.ends_at).toISOString().slice(0, 16) : "",
      show_to: popup.show_to || "all",
      display_delay_seconds: popup.display_delay_seconds || 0,
      dismissible: popup.dismissible ?? true,
      show_once_per_session: popup.show_once_per_session ?? true,
      custom_html: popup.custom_html || "",
    });
    setEditingPopupId(popup.id);
    setEditorMode(popup.custom_html ? "code" : "visual");
    setShowCreate(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id: string) => {
    try {
      await adminTogglePopup(id);
      setPopups(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeletePopup(id);
      setPopups(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const selectedType = POPUP_TYPES.find(t => t.value === form.popup_type) || POPUP_TYPES[0];

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando pop-ups...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Pop-ups Promocionales</h2>
           <p className="text-sm text-gray-400">Configura pop-ups que aparecen en la esquina inferior de tu sitio web</p>
         </div>
         <button 
           onClick={() => setShowCreate(!showCreate)}
           className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
         >
           <Plus className="w-4 h-4" /> Crear Pop-up
         </button>
       </div>

       {/* Create Form */}
       <AnimatePresence>
         {showCreate && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
             <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-6 sm:p-8">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-brand-blue" /> {editingPopupId ? 'Editar Pop-up' : 'Nuevo Pop-up'}
                  </h3>
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setEditorMode("visual")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        editorMode === "visual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      onClick={() => setEditorMode("code")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        editorMode === "code" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Code className="w-3 h-3" /> HTML
                    </button>
                  </div>
                </div>

                {editorMode === "code" ? (
                  <div className="space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-800">💡 Usa HTML y CSS inline para crear tu popup personalizado. Tu código se renderizará directamente dentro del modal con fondo oscuro.</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título (para identificar en la lista) *</label>
                      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Ej: Promo SQL Server - Diseño Custom"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Código HTML</label>
                      <textarea
                        value={form.custom_html}
                        onChange={e => setForm(f => ({ ...f, custom_html: e.target.value }))}
                        placeholder={'<div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 24px; padding: 40px; color: white; text-align: center;">\n  <h2 style="font-size: 28px; font-weight: 900;">Tu Popup Aquí</h2>\n  <a href="/cursos/sql-server" style="display: inline-block; margin-top: 20px; padding: 14px 32px; background: #f59e0b; color: white; border-radius: 12px; font-weight: 700; text-decoration: none;">Ver Curso →</a>\n</div>'}
                        rows={16}
                        className="w-full px-4 py-3 bg-[#0f172a] text-green-400 rounded-xl border border-gray-700 text-sm font-mono focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none resize-y leading-relaxed"
                        spellCheck={false}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mostrar A</label>
                        <select value={form.show_to} onChange={e => setForm(f => ({ ...f, show_to: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none">
                          {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delay (seg)</label>
                        <input type="number" min={0} value={form.display_delay_seconds} onChange={e => setForm(f => ({ ...f, display_delay_seconds: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-center focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color</label>
                        <input type="color" value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                          className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.dismissible} onChange={e => setForm(f => ({ ...f, dismissible: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="text-xs font-semibold text-gray-700">Se puede cerrar</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.show_once_per_session} onChange={e => setForm(f => ({ ...f, show_once_per_session: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="text-xs font-semibold text-gray-700">Solo 1 vez por sesión</span>
                      </label>
                    </div>

                    {form.custom_html && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Vista Previa</label>
                        <div className="bg-black/80 rounded-2xl p-8 flex items-center justify-center min-h-[200px] overflow-hidden">
                          <div className="max-w-lg w-full" dangerouslySetInnerHTML={{ __html: form.custom_html }} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Form Fields */}
                  <div className="space-y-5">
                    {/* Type Selector */}
                    <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo</label>
                     <div className="grid grid-cols-2 gap-2">
                       {POPUP_TYPES.map(type => {
                         const Icon = type.icon;
                         return (
                           <button
                             key={type.value}
                             onClick={() => setForm(f => ({ ...f, popup_type: type.value, accent_color: type.color }))}
                             className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                               form.popup_type === type.value
                                 ? "border-brand-blue bg-blue-50 text-brand-blue shadow-sm"
                                 : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                             }`}
                           >
                             <Icon className="w-3.5 h-3.5" /> {type.label}
                           </button>
                         );
                       })}
                     </div>
                   </div>

                   {/* Title & Description */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título *</label>
                     <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                       placeholder="Ej: ¡50% de descuento en Power BI!"
                       className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción</label>
                     <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                       placeholder="Un breve texto motivador..."
                       rows={2}
                       className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none resize-none" />
                   </div>

                   {/* Badge */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Etiqueta / Badge</label>
                     <input type="text" value={form.badge_text} onChange={e => setForm(f => ({ ...f, badge_text: e.target.value }))}
                       placeholder="Ej: 🔥 OFERTA LIMITADA"
                       className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>

                   {/* CTA */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Texto del Botón</label>
                       <input type="text" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                         className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">URL Destino</label>
                       <input type="text" value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))}
                         placeholder="/cursos/power-bi"
                         className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Image URL */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">URL de Imagen (Opcional)</label>
                     <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                       placeholder="https://..."
                       className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>

                   {/* Color */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color de Acento</label>
                     <div className="flex items-center gap-3">
                       <input type="color" value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                         className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                       <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{form.accent_color}</span>
                     </div>
                   </div>

                   {/* Scheduling */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Inicio (Opcional)</label>
                       <input type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fin (Opcional)</label>
                       <input type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Target & Delay */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mostrar A</label>
                       <select value={form.show_to} onChange={e => setForm(f => ({ ...f, show_to: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none">
                         {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delay (seg)</label>
                       <input type="number" min={0} value={form.display_delay_seconds} onChange={e => setForm(f => ({ ...f, display_delay_seconds: parseInt(e.target.value) || 0 }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-center focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Toggles */}
                   <div className="flex items-center gap-6 pt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={form.dismissible} onChange={e => setForm(f => ({ ...f, dismissible: e.target.checked }))}
                         className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                       <span className="text-xs font-semibold text-gray-700">Se puede cerrar</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={form.show_once_per_session} onChange={e => setForm(f => ({ ...f, show_once_per_session: e.target.checked }))}
                         className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                       <span className="text-xs font-semibold text-gray-700">Solo 1 vez por sesión</span>
                     </label>
                   </div>
                 </div>

                 {/* Right: Live Preview */}
                 <div>
                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Vista Previa en Vivo</label>
                   <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 flex items-end justify-end min-h-[300px] relative overflow-hidden">
                     <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     
                     {/* Mini preview of the popup */}
                     <div 
                       className="w-[300px] bg-white rounded-[1.2rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] relative z-10"
                       style={{ borderLeft: `3px solid ${form.accent_color}` }}
                     >
                       <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${form.accent_color}, ${form.accent_color}AA)` }}></div>
                       <div className="p-4">
                         <div className="flex gap-3">
                           <div 
                             className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md -rotate-3"
                             style={{ background: `linear-gradient(135deg, ${form.accent_color}, ${form.accent_color}CC)` }}
                           >
                             <selectedType.icon className="w-5 h-5 text-white" />
                           </div>
                           <div className="flex-1 min-w-0">
                             {form.badge_text && (
                               <span 
                                 className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                                 style={{ backgroundColor: form.accent_color + "15", color: form.accent_color }}
                               >
                                 <Bell className="w-2 h-2" /> {form.badge_text}
                               </span>
                             )}
                             <h4 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-1 line-clamp-2">
                               {form.title || "Título del Pop-up"}
                             </h4>
                             {form.description && (
                               <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-2.5 line-clamp-2">{form.description}</p>
                             )}
                             <span
                               className="inline-flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-lg"
                               style={{ backgroundColor: form.accent_color + "10", color: form.accent_color }}
                             >
                               {form.cta_text || "Ver más"} <ArrowRight className="w-3 h-3" />
                             </span>
                           </div>
                         </div>
                         {form.image_url && (
                           <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 -mx-0.5">
                             <img src={form.image_url} alt="" className="w-full h-20 object-cover" />
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
                )}

               {/* Actions */}
               <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                 <button onClick={() => { resetForm(); setShowCreate(false); }}
                   className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">Cancelar</button>
                 <button onClick={handleSave} disabled={saving || !form.title.trim()}
                   className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-sm">
                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                   {saving ? "Guardando..." : (editingPopupId ? "Guardar Cambios" : "Crear Pop-up")}
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Popups List */}
       {popups.length === 0 ? (
         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
           <Megaphone className="w-14 h-14 text-gray-300 mx-auto mb-4" />
           <h3 className="text-gray-900 font-bold mb-2 text-lg">No hay pop-ups configurados</h3>
           <p className="text-gray-400 text-sm max-w-sm mx-auto">Crea tu primer pop-up promocional para atraer a tus visitantes con ofertas, descuentos o anuncios de nuevos cursos.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {popups.map((popup, i) => {
             const pType = POPUP_TYPES.find(t => t.value === popup.popup_type) || POPUP_TYPES[0];
             const PIcon = pType.icon;
             return (
               <motion.div key={popup.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                 className={`relative rounded-2xl border overflow-hidden group ${popup.is_active ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}
               >
                 {/* Color accent bar at top */}
                 <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${popup.accent_color || '#1890FF'}, ${popup.accent_color || '#1890FF'}88)` }}></div>
                 
                 <div className="p-5">
                   <div className="flex items-start gap-4">
                     <div 
                       className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md shrink-0"
                       style={{ background: `linear-gradient(135deg, ${popup.accent_color || '#1890FF'}, ${popup.accent_color || '#1890FF'}CC)` }}
                     >
                       <PIcon className="w-5 h-5 text-white" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <h4 className="text-sm font-bold text-gray-900 truncate">{popup.title}</h4>
                         <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${popup.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                           {popup.is_active ? 'Activo' : 'Inactivo'}
                         </span>
                       </div>
                       {popup.description && (
                         <p className="text-xs text-gray-500 line-clamp-1 mb-2">{popup.description}</p>
                       )}
                       <div className="flex flex-wrap items-center gap-2">
                         {popup.badge_text && (
                           <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{popup.badge_text}</span>
                         )}
                         <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                           {TARGETS.find(t => t.value === popup.show_to)?.label || 'Todos'}
                         </span>
                         <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                           {popup.display_delay_seconds}s delay
                         </span>
                       </div>
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                     <button onClick={() => handleToggle(popup.id)}
                       className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                         popup.is_active ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                       }`}>
                       {popup.is_active ? 'Desactivar' : 'Activar'}
                     </button>
                     <button onClick={() => handleEdit(popup)}
                       className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer" title="Editar">
                       <Edit3 className="w-3.5 h-3.5" />
                     </button>
                     <button onClick={() => handleDelete(popup.id)}
                       className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer" title="Eliminar">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 </div>
               </motion.div>
             );
           })}
         </div>
       )}
    </div>
  );
}

// ─── PRICES & PROMOTIONS ───
function AdminPrices() {
  const [promos, setPromos] = useState<any[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"prices" | "promos" | "coupons">("prices");

  // Promo form
  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<"courses" | "plans" | "all" | "specific_course" | "specific_plan">("courses");
  const [targetId, setTargetId] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [promoPrice, setPromoPrice] = useState<number | "">("");

  // Coupon form
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [couponMaxUses, setCouponMaxUses] = useState<number | "">("");
  const [couponValidUntil, setCouponValidUntil] = useState("");
  const [couponAllowStacking, setCouponAllowStacking] = useState(false);
  const [couponApplicableCourses, setCouponApplicableCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  // Price editing
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [promosData, overridesData, couponsData, coursesData] = await Promise.all([
        adminGetPromotions(),
        adminGetPriceOverrides(),
        adminGetCoupons(),
        adminGetCourses()
      ]);
      setPromos(promosData);
      setPriceOverrides(overridesData);
      setCoupons(couponsData);
      setAvailableCourses(coursesData || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const getOverriddenPrice = (itemType: string, itemId: string, levelName: string, basePrice: number) => {
    const override = priceOverrides.find((o: any) => o.item_type === itemType && o.item_id === itemId && o.level_name === levelName);
    return override ? override.price : basePrice;
  };

  const handleSavePrice = async (itemType: string, itemId: string, levelName: string) => {
    setSavingPrice(true);
    try {
      await adminUpsertPriceOverride({
        item_type: itemType,
        item_id: itemId,
        level_name: levelName,
        price: editPriceValue,
      });
      setEditingPrice(null);
      loadData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingPrice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorObj(null);
    try {
      if (viewMode === "coupons") {
        if (editingCoupon) {
          await adminUpdateCoupon(editingCoupon.id, {
            code: couponCode,
            discount_percentage: couponDiscount,
            max_uses: couponMaxUses === "" ? null : couponMaxUses,
            valid_until: couponValidUntil === "" ? null : new Date(couponValidUntil).toISOString(),
            allow_stacking: couponAllowStacking,
            applicable_courses: couponApplicableCourses.length > 0 ? couponApplicableCourses : null
          });
          setEditingCoupon(null);
        } else {
          await adminCreateCoupon({
            code: couponCode,
            discount_percentage: couponDiscount,
            max_uses: couponMaxUses === "" ? undefined : couponMaxUses,
            is_active: true,
            valid_until: couponValidUntil === "" ? undefined : new Date(couponValidUntil).toISOString(),
            allow_stacking: couponAllowStacking,
            applicable_courses: couponApplicableCourses.length > 0 ? couponApplicableCourses : null
          });
        }
        setShowAdd(false);
        setCouponCode("");
        setCouponDiscount(10);
        setCouponMaxUses("");
        setCouponValidUntil("");
        setCouponAllowStacking(false);
        setCouponApplicableCourses([]);
        loadData();
      } else {
        await adminCreatePromotion({
          name,
          target_type: targetType,
          target_id: targetType === 'specific_course' || targetType === 'specific_plan' ? targetId : undefined,
          discount_percentage: discountPercent,
          promo_price: promoPrice === "" ? undefined : promoPrice,
          is_active: true
        });
        setShowAdd(false);
        setName("");
        setTargetId("");
        setDiscountPercent(20);
        setPromoPrice("");
        setViewMode("promos");
        loadData();
      }
    } catch (err: any) {
      setErrorObj(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await adminTogglePromotion(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    try {
      await adminDeletePromotion(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleToggleCoupon = async (id: string) => {
    try {
      await adminToggleCoupon(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este cupón?")) return;
    try {
      await adminDeleteCoupon(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const startEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponDiscount(coupon.discount_percentage);
    setCouponMaxUses(coupon.max_uses === null ? "" : coupon.max_uses);
    setCouponValidUntil(coupon.valid_until ? new Date(coupon.valid_until).toISOString().substring(0, 16) : "");
    setCouponAllowStacking(!!coupon.allow_stacking);
    setCouponApplicableCourses(coupon.applicable_courses || []);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startPromo = (type: "specific_course" | "specific_plan", id: string) => {
    setTargetType(type);
    setTargetId(id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditPrice = (key: string, currentPrice: number) => {
    setEditingPrice(key);
    setEditPriceValue(currentPrice);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>;

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Precios y Promociones</h2>
           <p className="text-sm text-gray-400">Control maestro de precios y ofertas dinámicas</p>
         </div>
         <div className="flex bg-gray-100 p-1 rounded-xl self-start">
             <button onClick={() => { setViewMode("prices"); setShowAdd(false); setEditingCoupon(null); }} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${viewMode === "prices" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"} border-none cursor-pointer`}>
               Precios Base
             </button>
             <button onClick={() => { setViewMode("promos"); setShowAdd(false); setEditingCoupon(null); }} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${viewMode === "promos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"} border-none cursor-pointer flex items-center gap-2`}>
               Promos Activas
               {promos.filter(p => p.is_active).length > 0 && (
                 <span className="bg-brand-blue text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{promos.filter(p => p.is_active).length}</span>
               )}
             </button>
             <button onClick={() => { setViewMode("coupons"); setShowAdd(false); setEditingCoupon(null); }} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${viewMode === "coupons" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"} border-none cursor-pointer flex items-center gap-2`}>
               Cupones
               {coupons.filter(c => c.is_active).length > 0 && (
                 <span className="bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{coupons.filter(c => c.is_active).length}</span>
               )}
             </button>
         </div>
       </div>

       <AnimatePresence>
         {showAdd && (
           <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
             onSubmit={handleSubmit} className="mb-8 bg-gray-50 border border-gray-200 p-6 rounded-2xl overflow-hidden">
             
             {errorObj && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium">{errorObj}</div>}
             
             {viewMode === "coupons" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Código del Cupón (Ej: PROMO50)</label>
                    <input type="text" required value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Ej: PROMO50" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none font-mono tracking-wide" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descuento (%)</label>
                    <input type="number" min="1" max="100" required value={couponDiscount} onChange={e => setCouponDiscount(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Límite de Usos (Opcional - Vacío para ilimitado)</label>
                    <input type="number" min="1" placeholder="Ej: 100" value={couponMaxUses} onChange={e => setCouponMaxUses(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fecha de Vencimiento (Opcional)</label>
                    <input type="datetime-local" value={couponValidUntil} onChange={e => setCouponValidUntil(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>

                  <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                          Cursos Aplicables (Opcional)
                        </label>
                        <p className="text-xs text-gray-500">
                          Selecciona los cursos en los que funcionará este cupón. <span className="font-semibold text-gray-700">Si no seleccionas ninguno (vacío), funcionará para TODOS los cursos.</span>
                        </p>
                      </div>
                      <div className="text-xs font-bold shrink-0">
                        {couponApplicableCourses.length === 0 ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                            ✨ Aplica a TODOS los Cursos
                          </span>
                        ) : (
                          <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                            🎯 Solo {couponApplicableCourses.length} curso(s) seleccionado(s)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 max-h-48 overflow-y-auto p-1">
                      {availableCourses.map((course: any) => {
                        const isSelected = couponApplicableCourses.includes(course.slug);
                        return (
                          <button
                            key={course.id || course.slug}
                            type="button"
                            onClick={() => {
                              setCouponApplicableCourses(prev =>
                                isSelected
                                  ? prev.filter(s => s !== course.slug)
                                  : [...prev, course.slug]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                              isSelected
                                ? "bg-brand-blue border-brand-blue text-white shadow-sm scale-[1.02]"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                          >
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            <span>{course.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="coupon-allow-stacking"
                      checked={couponAllowStacking}
                      onChange={e => setCouponAllowStacking(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#0F172A] cursor-pointer"
                    />
                    <label htmlFor="coupon-allow-stacking" className="text-xs text-gray-600 font-semibold cursor-pointer select-none">
                      Permitir descuento sobre descuento (Acumulable con otras promociones de cursos)
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre (Ej: Black Friday)</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descuento Referencial (%)</label>
                    <input type="number" min="1" max="100" required value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Precio Fijo Promocional ($ Opcional)</label>
                    <input type="number" min="0" placeholder="Ej: 129000" value={promoPrice} onChange={e => setPromoPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Aplica a</label>
                    <select value={targetType} onChange={e => setTargetType(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none cursor-pointer">
                      <option value="courses">Todos los Cursos</option>
                      <option value="plans">Todas las Membresías</option>
                      <option value="all">Toda la Tienda (Cursos y Planes)</option>
                      <option value="specific_course">Curso Específico (Slug)</option>
                      <option value="specific_plan">Plan Específico (ID)</option>
                    </select>
                  </div>
                  {(targetType === 'specific_course' || targetType === 'specific_plan') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID del Objetivo</label>
                      <input type="text" required value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                    </motion.div>
                  )}
                </div>
              )}

             <div className="flex justify-end gap-3">
               <button type="button" onClick={() => { setShowAdd(false); setEditingCoupon(null); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors border-none cursor-pointer">Cancelar</button>
               <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-50 border-none cursor-pointer">
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                 {viewMode === "coupons" ? (editingCoupon ? "Guardar Cambios" : "Crear Cupón") : "Publicar Promoción"}
               </button>
             </div>
           </motion.form>
         )}
       </AnimatePresence>

       {viewMode === "prices" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-blue"><Percent className="w-5 h-5"/></div>
                 <div>
                   <h3 className="font-bold text-blue-900 text-sm">Descuento Global</h3>
                   <p className="text-xs text-blue-700">Aplica a todos los cursos y membresías</p>
                 </div>
              </div>
              <button onClick={() => { setTargetType("all"); setShowAdd(true); window.scrollTo(0,0); }} className="text-[11px] font-bold px-3 py-1.5 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5"><Plus className="w-3.5 h-3.5"/> Promoción Global</button>
            </div>

            {/* Courses Table */}
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-gray-400"/> Cursos</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr><th className="px-5 py-3">Curso</th><th className="px-5 py-3">Nivel</th><th className="px-5 py-3">Precio Actual</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allCourses.map(course => (
                      course.levels?.map((lvl, i) => {
                        const editKey = `course-${course.slug}-${lvl.name}`;
                        const currentPrice = getOverriddenPrice('course', course.slug, lvl.name, lvl.price || 0);
                        return (
                          <tr key={editKey} className="hover:bg-gray-50 transition-colors">
                            {i === 0 && (
                              <td className="px-5 py-3 align-top" rowSpan={course.levels!.length}>
                                <div className="font-bold text-gray-900 text-xs">{course.title}</div>
                                <div className="text-[10px] text-gray-400">{course.slug}</div>
                              </td>
                            )}
                            <td className="px-5 py-3 text-xs font-medium text-gray-600">{lvl.name}</td>
                            <td className="px-5 py-3">
                              {editingPrice === editKey ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">$</span>
                                  <input type="number" value={editPriceValue} onChange={e => setEditPriceValue(Number(e.target.value))} className="w-28 border border-blue-300 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none" autoFocus />
                                  <button disabled={savingPrice} onClick={() => handleSavePrice('course', course.slug, lvl.name)} className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 cursor-pointer border-none">
                                    {savingPrice ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                  </button>
                                  <button onClick={() => setEditingPrice(null)} className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 cursor-pointer border-none"><X className="w-3 h-3" /></button>
                                </div>
                              ) : (
                                <button onClick={() => startEditPrice(editKey, currentPrice)} className="font-bold text-gray-800 text-sm hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none p-0">
                                  ${currentPrice.toLocaleString('es-CL')}
                                </button>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button onClick={() => startPromo("specific_course", course.slug)} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer">Descuento</button>
                            </td>
                          </tr>
                        );
                      })
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Memberships Table */}
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400"/> Membresías</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Mensual</th><th className="px-5 py-3">Anual</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {communityPlans.map(plan => (
                      <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-bold text-gray-900 text-xs">{plan.name}</div>
                          <div className="text-[10px] text-gray-400">ID: {plan.id}</div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">${plan.price.toLocaleString('es-CL')}</td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">${(plan.priceAnnual || plan.price * 12 * 0.7).toLocaleString('es-CL')}</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => startPromo("specific_plan", plan.id)} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer">Descuento</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </motion.div>
       ) : viewMode === "promos" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {promos.length === 0 ? (
               <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                 <Percent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <h3 className="text-lg font-black text-gray-900 mb-1">Sin Promociones Activas</h3>
                 <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">No has configurado ningún descuento dinámico. Para agregar uno, ve a la pestaña "Precios Base" o crea uno manualmente.</p>
                 <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"><Plus className="w-4 h-4"/> Nueva Promoción</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {promos.map(promo => (
                   <div key={promo.id} className={`relative bg-white rounded-2xl border ${promo.is_active ? 'border-brand-blue ring-1 ring-brand-blue/20 shadow-md' : 'border-gray-200 shadow-sm opacity-70'} overflow-hidden flex flex-col`}>
                     {promo.is_active && (
                       <div className="absolute top-0 right-0 py-1 px-3 bg-brand-blue text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">Activa</div>
                     )}
                     <div className="p-5 flex-1">
                       <div className="flex items-start gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${promo.is_active ? 'bg-blue-50 text-brand-blue' : 'bg-gray-100 text-gray-400'}`}>
                           <Percent className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="font-bold text-gray-900 leading-tight">{promo.name}</h3>
                           <p className="text-xs text-gray-500 mt-1">Regla: {
                             promo.target_type === 'courses' ? 'Cursos' :
                             promo.target_type === 'plans' ? 'Membresías' :
                             promo.target_type === 'all' ? 'Toda la Tienda' :
                             promo.target_type === 'specific_course' ? `Curso: ${promo.target_id}` :
                             `Plan: ${promo.target_id}`
                           }</p>
                         </div>
                       </div>
                       <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Rebaja del:</span>
                            {promo.promo_price ? (
                              <span className="text-[10px] text-gray-400">Precio Fijo: ${promo.promo_price.toLocaleString('es-CL')}</span>
                            ) : null}
                          </div>
                          <span className="font-black text-xl text-emerald-600">{promo.discount_percentage}%</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto p-4 border-t border-gray-50 bg-gray-50/50">
                       <button onClick={() => handleToggle(promo.id)}
                         className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border-none ${
                           promo.is_active ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                         }`}>
                         {promo.is_active ? 'Pausar' : 'Reactivar'}
                       </button>
                       <button onClick={() => handleDelete(promo.id)}
                         className="py-2 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </motion.div>
       ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400"/> Cupones de Descuento
              </h3>
              {!showAdd && (
                <button onClick={() => { setEditingCoupon(null); setCouponCode(""); setCouponDiscount(10); setCouponMaxUses(""); setCouponValidUntil(""); setShowAdd(true); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-none flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5"/> Nuevo Cupón
                </button>
              )}
            </div>

            {coupons.length === 0 ? (
               <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                 <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <h3 className="text-lg font-black text-gray-900 mb-1">Sin Cupones Configurados</h3>
                 <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">No has configurado ningún cupón de descuento promocional.</p>
                 <button onClick={() => { setEditingCoupon(null); setCouponCode(""); setCouponDiscount(10); setCouponMaxUses(""); setCouponValidUntil(""); setShowAdd(true); }} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"><Plus className="w-4 h-4"/> Crear Cupón</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {coupons.map(coupon => (
                   <div key={coupon.id} className={`relative bg-white rounded-2xl border ${coupon.is_active ? 'border-emerald-500 ring-1 ring-emerald-500/20 shadow-md' : 'border-gray-200 shadow-sm opacity-70'} overflow-hidden flex flex-col`}>
                     {coupon.is_active && (
                       <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-600 text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">Activo</div>
                     )}
                     <div className="p-5 flex-1">
                       <div className="flex items-start gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${coupon.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                           <Tag className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="font-mono font-black text-lg text-gray-900 leading-tight tracking-wider">{coupon.code}</h3>
                           <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                             <span>Usos: <strong>{coupon.used_count}</strong> / {coupon.max_uses === null ? '∞' : coupon.max_uses}</span>
                             {coupon.max_uses !== null && coupon.used_count >= coupon.max_uses && (
                               <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[9px] uppercase">Agotado</span>
                             )}
                           </p>
                         </div>
                       </div>
                       
                       <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="flex items-center justify-between">
                           <div className="flex flex-col gap-0.5">
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Descuento</span>
                             <span className="font-black text-xl text-emerald-600">{coupon.discount_percentage}%</span>
                           </div>
                           <div className="text-right">
                             <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Vence</span>
                             <span className="text-xs font-semibold text-gray-600">
                               {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin vencimiento'}
                             </span>
                           </div>
                         </div>
                         <div className="mt-2 text-[10px] flex items-center justify-between border-t border-gray-200/60 pt-2">
                           <span className="text-gray-400 font-semibold uppercase tracking-wider">Acumulable con ofertas:</span>
                           <span className={`font-bold ${coupon.allow_stacking ? 'text-blue-600' : 'text-gray-500'}`}>
                             {coupon.allow_stacking ? 'Sí' : 'No'}
                           </span>
                         </div>
                       </div>

                       <div className="mt-3 text-[11px] px-1">
                         <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Cursos Permitidos:</span>
                         {(!coupon.applicable_courses || coupon.applicable_courses.length === 0) ? (
                           <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100 text-[10px]">
                             ✨ Todos los Cursos
                           </span>
                         ) : (
                           <div className="flex flex-wrap gap-1">
                             {coupon.applicable_courses.map((slug: string) => {
                               const courseObj = availableCourses.find((c: any) => c.slug === slug);
                               return (
                                 <span key={slug} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-100 text-[10px]">
                                   🎯 {courseObj?.title || slug}
                                 </span>
                               );
                             })}
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto p-4 border-t border-gray-50 bg-gray-50/50">
                       <button onClick={() => handleToggleCoupon(coupon.id)}
                         className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border-none ${
                           coupon.is_active ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                         }`}>
                         {coupon.is_active ? 'Pausar' : 'Reactivar'}
                       </button>
                       <button onClick={() => startEditCoupon(coupon)}
                         className="py-2 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors cursor-pointer border-none flex items-center justify-center" title="Editar">
                         <Edit3 className="w-3.5 h-3.5" />
                       </button>
                       <button onClick={() => handleDeleteCoupon(coupon.id)}
                         className="py-2 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none flex items-center justify-center" title="Eliminar">
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </motion.div>
       )}
    </div>
  );
}

// ─── NEWSLETTER ───

// ─── NEWSLETTER / BLOG ───

const blogCategoryNames: Record<string, string> = {
  "ia": "AI",
  "industria": "Economía",
  "general": "Cultura",
  "deporte": "Deporte",
  "power-bi": "Tecnología - Power BI",
  "sql": "Tecnología - SQL",
  "python": "Tecnología - Python",
  "tecnologia": "Tecnología - General",
};

function AdminNewsletter() {
  return (
    <AdminNewsletterArticles />
  );
}

// ─── NEWSLETTER: ARTICLES TAB ───

function parseMarkdownImport(text: string) {
  const metadata: Record<string, string> = {};
  let bodyContent = "";

  const lines = text.split("\n");
  let inFrontmatter = false;
  let hasParsedFrontmatter = false;
  const bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "---" && !hasParsedFrontmatter) {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        inFrontmatter = false;
        hasParsedFrontmatter = true;
      }
      continue;
    }

    if (inFrontmatter) {
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        const value = line.slice(colonIdx + 1).trim();
        metadata[key] = value;
      }
    } else {
      const match = trimmed.match(/^(?:#\s*)?(titulo|title|imagen|image|cover|categoria|category|autor|author|tiempo|reading_time|tags|tags_list|excerpt|resumen|description|descripcion|extracto|subtitulo|subtitle|ticker|tickers|tradingview|accion|ticket|tickets|poster|thumbnail|thumbnail_url|cover_poster|imagen_compartido|video|video_url|date|published_at|fecha)\s*:\s*(.+)$/i);
      
      if (match && !hasParsedFrontmatter) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        metadata[key] = value;
      } else {
        if (trimmed !== "" && !trimmed.startsWith("---") && Object.keys(metadata).length > 0) {
          hasParsedFrontmatter = true;
        }
        bodyLines.push(line);
      }
    }
  }

  bodyContent = bodyLines.join("\n").trim();

  const title = metadata.titulo || metadata.title || "";
  const cover_image = metadata.cover_image || metadata.cover_url || metadata.imagen || metadata.image || metadata.cover || "";
  const category = metadata.categoria || metadata.category || "";
  const author_name = metadata.autor || metadata.author || "";
  const reading_time = metadata.reading_time || metadata.tiempo || metadata.time || "";
  const tags = metadata.tags || metadata.tags_list || "";
  const excerpt = metadata.excerpt || metadata.resumen || metadata.description || metadata.descripcion || metadata.extracto || metadata.subtitulo || metadata.subtitle || "";
  const ticker = metadata.ticker || metadata.tickers || metadata.tradingview || metadata.accion || metadata.ticket || metadata.tickets || "";
  const poster = metadata.poster || metadata.thumbnail || metadata.thumbnail_url || metadata.cover_poster || metadata.imagen_compartido || metadata.imagen || metadata.image || "";
  const video = metadata.video || metadata.video_url || "";
  const publishedAt = metadata.date || metadata.published_at || metadata.fecha || "";

  return {
    title,
    cover_image,
    category,
    author_name,
    reading_time,
    tags,
    excerpt,
    ticker,
    poster,
    video,
    publishedAt,
    content: bodyContent
  };
}

const toLocalDateTimeString = (dateInput?: string) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

function AdminNewsletterArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Editor modes
  const [editorMode, setEditorMode] = useState<"visual" | "markdown">("markdown");
  const [formMarkdownText, setFormMarkdownText] = useState("");

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formBlocks, setFormBlocks] = useState<any[]>([]);
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formPoster, setFormPoster] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formCategory, setFormCategory] = useState("ia");
  const [formTags, setFormTags] = useState("");
  const [formAuthor, setFormAuthor] = useState("ProgramBI");
  const [formReadingTime, setFormReadingTime] = useState(5);
  const [formStatus, setFormStatus] = useState("draft");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [saving, setSaving] = useState(false);


  const loadArticles = useCallback(async () => {
    try {
      const arts = await adminGetArticles();
      setArticles(arts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const resetForm = () => {
    setFormTitle(""); setFormSlug(""); setFormExcerpt(""); setFormContent("");
    setFormBlocks([]);
    setFormCoverImage(""); setFormPoster(""); setFormVideo(""); setFormCategory("ia"); setFormTags("");
    setFormAuthor("ProgramBI"); setFormReadingTime(5); setFormStatus("draft");
    setFormFeatured(false); setFormPublishedAt(""); setEditingArticle(null);
    setFormMarkdownText(""); setEditorMode("markdown");
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (article: any) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormSlug(article.slug);
    setFormExcerpt(article.excerpt || "");
    setFormContent(article.content || "");
    
    let isJson = false;
    try {
      const parsed = JSON.parse(article.content || "[]");
      if (Array.isArray(parsed)) isJson = true;
    } catch {}

    const tagsStr = (article.tags || []).join(", ");
    setFormCoverImage(article.cover_image || "");
    setFormCategory(article.category || "ia");
    setFormTags(tagsStr);
    setFormAuthor(article.author_name || "ProgramBI");
    setFormReadingTime(article.reading_time_min || 5);
    setFormStatus(article.status);
    setFormFeatured(article.is_featured || false);
    setFormPublishedAt(article.published_at ? toLocalDateTimeString(article.published_at) : "");

    if (isJson) {
      setEditorMode("visual");
      setFormPoster("");
      setFormVideo("");
      try {
        const parsed = JSON.parse(article.content || "[]");
        setFormBlocks(parsed);
      } catch {
        setFormBlocks([{ type: "paragraph", text: article.content || "" }]);
      }
      setFormMarkdownText("");
    } else {
      setEditorMode("markdown");
      
      let contentBody = article.content || "";
      let parsedPoster = "";
      let parsedVideo = "";
      let parsedTicker = "";
      let parsedDate = "";

      // Extract poster if present in body
      const posterMatch = contentBody.match(/^(?:Poster|Thumbnail|Thumbnail_Url|Cover_Poster|Imagen_Compartido|Imagen|Image)\s*:\s*([^\n\r]+)/im);
      if (posterMatch) {
        parsedPoster = posterMatch[1].trim();
        contentBody = contentBody.replace(/^(?:Poster|Thumbnail|Thumbnail_Url|Cover_Poster|Imagen_Compartido|Imagen|Image)\s*:[^\n\r]*(?:\r?\n|$)/im, "");
      }
      setFormPoster(parsedPoster);

      // Extract video if present in body
      const videoMatch = contentBody.match(/^(?:Video|Video_Url)\s*:\s*([^\n\r]+)/im);
      if (videoMatch) {
        parsedVideo = videoMatch[1].trim();
        contentBody = contentBody.replace(/^(?:Video|Video_Url)\s*:[^\n\r]*(?:\r?\n|$)/im, "");
      }
      setFormVideo(parsedVideo);

      // Extract ticker if present in body
      const tickerMatch = contentBody.match(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets)\s*:\s*([^\n\r]+)/im);
      if (tickerMatch) {
        parsedTicker = tickerMatch[1].trim();
        contentBody = contentBody.replace(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets)\s*:[^\n\r]*(?:\r?\n|$)/im, "");
      }

      // Extract date if present in body
      const dateMatch = contentBody.match(/^(?:Date|Published_At|Fecha)\s*:\s*([^\n\r]+)/im);
      if (dateMatch) {
        parsedDate = dateMatch[1].trim();
        contentBody = contentBody.replace(/^(?:Date|Published_At|Fecha)\s*:[^\n\r]*(?:\r?\n|$)/im, "");
        setFormPublishedAt(toLocalDateTimeString(parsedDate));
      }

      contentBody = contentBody.trim();

      const fmLines = [
        "---",
        `title: ${article.title}`,
        `cover_image: ${article.cover_image || ""}`
      ];
      
      if (parsedPoster) {
        fmLines.push(`Poster: ${parsedPoster}`);
      }
      if (parsedVideo) {
        fmLines.push(`Video: ${parsedVideo}`);
      }
      if (parsedTicker) {
        fmLines.push(`Ticker: ${parsedTicker}`);
      }
      
      const dateVal = parsedDate || article.published_at;
      if (dateVal) {
        fmLines.push(`Date: ${dateVal}`);
      }
      
      fmLines.push(`category: ${article.category || "ia"}`);
      fmLines.push(`author: ${article.author_name || "ProgramBI"}`);
      fmLines.push(`reading_time: ${article.reading_time_min || 5}`);
      fmLines.push(`tags: ${tagsStr}`);
      fmLines.push("---");
      fmLines.push("");
      fmLines.push(contentBody);

      const fm = fmLines.join("\n");
      setFormMarkdownText(fm);
      setFormBlocks([]);
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editorMode === "visual" && (!formTitle || formBlocks.length === 0)) return;
    if (editorMode === "markdown" && !formMarkdownText.trim()) return;

    setSaving(true);
    try {
      let payload: any = {};

      if (editorMode === "markdown") {
        const parsed = parseMarkdownImport(formMarkdownText);
        const titleVal = parsed.title || formTitle;
        const slugVal = formSlug || generateSlug(titleVal);
        const excerptVal = formExcerpt || parsed.excerpt || (parsed.content.slice(0, 160) + "...");
        const tagsVal = (parsed.tags || formTags).split(",").map(t => t.trim()).filter(Boolean);

        let finalContent = parsed.content;
        if (parsed.ticker) {
          const hasTickerInBody = parsed.content.match(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets)\s*:/im);
          if (!hasTickerInBody) {
            finalContent = `${parsed.content}\n\nTicker: ${parsed.ticker}`;
          }
        }
        const posterVal = formPoster || parsed.poster;
        if (posterVal) {
          const hasPosterInBody = parsed.content.match(/^(?:Poster|Thumbnail|Thumbnail_Url|Cover_Poster|Imagen_Compartido|Imagen|Image)\s*:/im);
          if (!hasPosterInBody) {
            finalContent = `${finalContent}\n\nPoster: ${posterVal}`;
          }
        }
        const videoVal = formVideo || parsed.video;
        if (videoVal) {
          const hasVideoInBody = parsed.content.match(/^(?:Video|Video_Url)\s*:/im);
          if (!hasVideoInBody) {
            finalContent = `${finalContent}\n\nVideo: ${videoVal}`;
          }
        }
        const dateVal = formPublishedAt || parsed.publishedAt;
        if (dateVal) {
          const hasDateInBody = parsed.content.match(/^(?:Date|Published_At|Fecha)\s*:/im);
          if (!hasDateInBody) {
            finalContent = `${finalContent}\n\nDate: ${dateVal}`;
          }
        }

        payload = {
          title: titleVal,
          slug: slugVal,
          excerpt: excerptVal,
          content: finalContent, // Save raw Markdown string
          cover_image: parsed.cover_image || formCoverImage || undefined,
          category: parsed.category || formCategory,
          tags: tagsVal,
          author_name: parsed.author_name || formAuthor,
          reading_time_min: parseInt(parsed.reading_time) || formReadingTime,
          status: formStatus,
          is_featured: formFeatured,
          published_at: formPublishedAt ? new Date(formPublishedAt).toISOString() : (parsed.publishedAt ? new Date(parsed.publishedAt).toISOString() : (formStatus === "published" ? new Date().toISOString() : null)),
        };
      } else {
        const tagsVal = formTags.split(",").map(t => t.trim()).filter(Boolean);
        payload = {
          title: formTitle,
          slug: formSlug || generateSlug(formTitle),
          excerpt: formExcerpt,
          content: JSON.stringify(formBlocks),
          cover_image: formCoverImage || undefined,
          category: formCategory,
          tags: tagsVal,
          author_name: formAuthor,
          reading_time_min: formReadingTime,
          status: formStatus,
          is_featured: formFeatured,
          published_at: formPublishedAt ? new Date(formPublishedAt).toISOString() : (formStatus === "published" ? new Date().toISOString() : null),
        };
      }

      if (editingArticle) {
        await adminUpdateArticle(editingArticle.id, payload);
      } else {
        await adminCreateArticle(payload);
      }

      setShowForm(false);
      resetForm();
      await loadArticles();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    try {
      await adminDeleteArticle(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await adminToggleArticlePublish(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await adminToggleArticleFeatured(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando artículos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Blog</h2>
          <p className="text-sm text-gray-400">{articles.length} artículos · Gestiona tu blog</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors border-none cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">{editingArticle ? "Editar Artículo" : "Nuevo Artículo"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Editor Mode */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setEditorMode("markdown")}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                    editorMode === "markdown" ? "bg-brand-blue text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  📝 Editor Markdown (Un solo bloque)
                </button>
                <button
                  onClick={() => setEditorMode("visual")}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                    editorMode === "visual" ? "bg-brand-blue text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  🎨 Editor Visual (Bloques JSON)
                </button>
              </div>

              {editorMode === "markdown" ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Documento Completo (Markdown + Metadatos)</label>
                    <span className="text-[10px] text-gray-400 font-medium">Usa las cabeceras (entre ---) para metadatos. Para imágenes secundarias entre los textos, escribe `imagen2: URL [caption]` o `![caption](URL)` en su propia línea.</span>
                  </div>
                  <textarea
                    value={formMarkdownText}
                    onChange={(e) => {
                      setFormMarkdownText(e.target.value);
                      const parsed = parseMarkdownImport(e.target.value);
                      if (parsed.title) setFormTitle(parsed.title);
                      if (parsed.cover_image) setFormCoverImage(parsed.cover_image);
                      if (parsed.category) setFormCategory(parsed.category);
                      if (parsed.author_name) setFormAuthor(parsed.author_name);
                      if (parsed.reading_time) setFormReadingTime(parseInt(parsed.reading_time) || 5);
                      if (parsed.tags) setFormTags(parsed.tags);
                      if (parsed.poster) setFormPoster(parsed.poster);
                      if (parsed.video) setFormVideo(parsed.video);
                    }}
                    rows={20}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-mono text-sm focus:outline-none focus:border-brand-blue/40 resize-y"
                    placeholder={`---
title: Claude Fable 5: el modelo de IA más potente del año
cover_image: https://example.com/portada.png
category: ia
author: Por el equipo ProgramBI
reading_time: 5
tags: power-bi, ai
---

El pasado 9 de junio, Anthropic lanzó...

imagen2: https://example.com/grafico-analisis.png Gráfico explicativo de rendimiento de datos

Más texto del artículo...

![Captura de pantalla de la interfaz](https://example.com/interfaz.png)`}
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Título *</label>
                      <input
                        type="text" value={formTitle}
                        onChange={(e) => { setFormTitle(e.target.value); if (!editingArticle) setFormSlug(generateSlug(e.target.value)); }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                        placeholder="Título del artículo"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Slug (URL)</label>
                      <input
                        type="text" value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                        placeholder="titulo-del-articulo"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Extracto</label>
                    <textarea
                      value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40 resize-none"
                      placeholder="Breve resumen del artículo..."
                    />
                  </div>

                  <ArticleBlockEditor
                    blocks={formBlocks}
                    onChange={(blocks) => setFormBlocks(blocks)}
                  />
                </>
              )}

              {/* Form Metadata fields (always visible or collapsed) */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Campos de Metadatos Detectados / Adicionales</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Título</label>
                    <input
                      type="text" value={formTitle} onChange={(e) => { setFormTitle(e.target.value); if (!editingArticle) setFormSlug(generateSlug(e.target.value)); }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Slug (URL)</label>
                    <input
                      type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Imagen de Portada (URL)</label>
                    <input
                      type="text" value={formCoverImage} onChange={(e) => setFormCoverImage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Póster / Miniatura (URL)</label>
                    <input
                      type="text" value={formPoster} onChange={(e) => setFormPoster(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Video (URL)</label>
                    <input
                      type="text" value={formVideo} onChange={(e) => setFormVideo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Categoría</label>
                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                      <option value="ia">AI</option>
                      <option value="industria">Economía</option>
                      <option value="general">Cultura</option>
                      <option value="deporte">Deporte</option>
                      <option value="power-bi">Tecnología - Power BI</option>
                      <option value="sql">Tecnología - SQL</option>
                      <option value="python">Tecnología - Python</option>
                      <option value="tecnologia">Tecnología - General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Autor</label>
                    <input
                      type="text" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Lectura (min)</label>
                    <input
                      type="number" value={formReadingTime} onChange={(e) => setFormReadingTime(parseInt(e.target.value) || 5)}
                      min={1}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tags (separados por coma)</label>
                    <input
                      type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                      placeholder="power-bi, dashboard, tips"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Estado</label>
                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Extracto</label>
                    <textarea
                      value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40 resize-none"
                      placeholder="Breve resumen del artículo..."
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Fecha de Publicación</label>
                      <input
                        type="datetime-local"
                        value={formPublishedAt}
                        onChange={(e) => setFormPublishedAt(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                      />
                    </div>
                    <div className="flex items-center pb-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} className="w-4 h-4 rounded" />
                        <span className="text-sm font-bold text-gray-700">⭐ Artículo Destacado</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={(editorMode === "visual" && (!formTitle || formBlocks.length === 0)) || (editorMode === "markdown" && !formMarkdownText.trim()) || saving}
                  className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors border-none cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {editingArticle ? "Guardar Cambios" : "Crear Artículo"}
                </button>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-300 transition-colors border-none cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles Table */}
      {articles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold mb-1">Sin artículos</h3>
          <p className="text-gray-400 text-sm">Crea tu primer artículo para el blog.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                article.status === "published" ? "bg-white border-gray-100" : "bg-gray-50/50 border-gray-100"
              }`}
            >
              {/* Cover thumb */}
              {(() => {
                const cover = article.cover_image || "";
                const isVideo = /\.(mp4|webm|ogg|mov|m4v)(?:\?.*)?$/i.test(cover);
                let imageToShow = cover;

                // Try to find poster in content first if we have one
                let posterUrl = "";
                if (article.content) {
                  const match = article.content.match(/^(?:Poster|Thumbnail|Thumbnail_Url|Cover_Poster|Imagen_Compartido|Imagen|Image)\s*:\s*([^\n\r]+)/im);
                  if (match) {
                    posterUrl = match[1].trim();
                  }
                }

                if (posterUrl) {
                  imageToShow = posterUrl;
                } else if (isVideo) {
                  imageToShow = ""; // If it's a video but has no poster, don't try to render video URL inside <img> tag
                }

                if (imageToShow) {
                  return (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={imageToShow} alt="" className="w-full h-full object-cover" />
                    </div>
                  );
                }

                return (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-gray-300" />
                  </div>
                );
              })()}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    article.status === "published" ? "bg-emerald-100 text-emerald-700" :
                    article.status === "archived" ? "bg-gray-200 text-gray-500" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {article.status === "published" ? "Publicado" : article.status === "archived" ? "Archivado" : "Borrador"}
                  </span>
                  {article.is_featured && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">⭐ Destacado</span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                    {blogCategoryNames[article.category] || article.category}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 truncate">{article.title}</h4>
                <p className="text-[11px] text-gray-400 truncate">
                  {article.author_name} · {article.reading_time_min} min · {new Date(article.created_at).toLocaleDateString('es-CL')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleToggleFeatured(article.id)} title="Destacar" className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${article.is_featured ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-300'}`}>
                  <Star className="w-4 h-4" />
                </button>
                <button onClick={() => handleTogglePublish(article.id)} title={article.status === 'published' ? 'Despublicar' : 'Publicar'}
                  className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${article.status === 'published' ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' : 'hover:bg-gray-100 text-gray-400'}`}>
                  {article.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer" title="Ver" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => openEditForm(article)} title="Editar" className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(article.id)} title="Eliminar" className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEWSLETTER: CATEGORIES TAB ───

function AdminNewsletterCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  // Form
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catEmoji, setCatEmoji] = useState("📄");
  const [catOrder, setCatOrder] = useState(0);
  const [catParent, setCatParent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await adminGetNewsletterCategories();
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };

  const resetForm = () => {
    setCatName(""); setCatSlug(""); setCatEmoji("📄"); setCatOrder(0); setCatParent(null); setEditingCat(null);
  };

  const openEdit = (cat: any) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatEmoji(cat.emoji || "📄");
    setCatOrder(cat.sort_order || 0);
    setCatParent(cat.parent_id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!catName) return;
    setSaving(true);
    try {
      const slug = catSlug || generateSlug(catName);
      const payload = {
        name: catName,
        slug,
        emoji: catEmoji,
        sort_order: catOrder,
        parent_id: catParent || null,
      };

      if (editingCat) {
        await adminUpdateNewsletterCategory(editingCat.id, payload);
      } else {
        await adminCreateNewsletterCategory(payload);
      }

      setShowForm(false);
      resetForm();
      await loadCategories();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await adminDeleteNewsletterCategory(id);
      await loadCategories();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleToggle = async (id: string) => {
    try {
      await adminToggleNewsletterCategory(id);
      await loadCategories();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  // Separate parents and children
  const parents = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">{categories.length} categorías · Estas aparecen en la barra de navegación del Blog</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors border-none cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900 text-sm">{editingCat ? "Editar Categoría" : "Nueva Categoría"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nombre *</label>
                  <input
                    type="text" value={catName}
                    onChange={(e) => { setCatName(e.target.value); if (!editingCat) setCatSlug(generateSlug(e.target.value)); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="Power BI"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Slug</label>
                  <input
                    type="text" value={catSlug} onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="power-bi"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Emoji</label>
                  <input
                    type="text" value={catEmoji} onChange={(e) => setCatEmoji(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="📊"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Orden</label>
                  <input
                    type="number" value={catOrder} onChange={(e) => setCatOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Padre (subcategoría)</label>
                  <select value={catParent || ""} onChange={(e) => setCatParent(e.target.value || null)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                    <option value="">— Ninguno (principal) —</option>
                    {parents.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!catName || saving}
                  className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors border-none cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {editingCat ? "Guardar" : "Crear"}
                </button>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-5 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-300 transition-colors border-none cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories list */}
      {categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
          <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold mb-1 text-sm">Sin categorías</h3>
          <p className="text-gray-400 text-xs">Crea categorías para organizar tu blog.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {parents.map(cat => (
            <div key={cat.id}>
              {/* Parent category */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                  cat.is_active ? "bg-white border-gray-100" : "bg-gray-50/50 border-gray-100 opacity-60"
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">/{cat.slug}</span>
                    {!cat.is_active && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-500 uppercase">Oculta</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">Orden: {cat.sort_order}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(cat.id)} title={cat.is_active ? "Ocultar" : "Mostrar"}
                    className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${cat.is_active ? 'bg-emerald-50 text-emerald-500' : 'hover:bg-gray-100 text-gray-400'}`}>
                    {cat.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(cat)} title="Editar"
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} title="Eliminar"
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Subcategories */}
              {getChildren(cat.id).length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {getChildren(cat.id).map(sub => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:shadow-sm ${
                        sub.is_active ? "bg-white border-gray-50" : "bg-gray-50/50 border-gray-50 opacity-60"
                      }`}
                    >
                      <span className="text-sm">{sub.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-gray-700">{sub.name}</span>
                          <span className="text-[9px] text-gray-400 font-mono">/{sub.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggle(sub.id)} className={`p-1.5 rounded-lg transition-colors border-none cursor-pointer ${sub.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {sub.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => openEdit(sub)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          💡 <strong>Tip:</strong> Las categorías principales aparecen en la barra de navegación del Blog. 
          Las subcategorías sirven para organizar el contenido dentro de una categoría principal.
          Cambia el <strong>orden</strong> para controlar su posición en la barra. Usa el botón del ojo para <strong>ocultar/mostrar</strong> categorías sin eliminarlas.
        </p>
      </div>
    </div>
  );
}


// ─── DIPLOMAS ───
function AdminDiplomas() {
  const [subTab, setSubTab] = useState<"designer" | "manage">("designer");

  // Designer states
  const [studentName, setStudentName] = useState("Juan Pérez");
  const [studentRut, setStudentRut] = useState("12.345.678-9");
  const [courseName, setCourseName] = useState("Power BI");
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString("es-CL"));
  const [instructorName, setInstructorName] = useState("Manuel Oliva");
  
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const diplomaRef = useRef<HTMLDivElement>(null);
  const modalDiplomaRef = useRef<HTMLDivElement>(null);
  const hiddenDiplomaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Management states
  const [certsList, setCertsList] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add individual states
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [savingCert, setSavingCert] = useState(false);

  // CSV states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setScale(Math.min(1, width / 1123));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const loadCertificates = useCallback(async () => {
    setLoadingCerts(true);
    try {
      const list = await adminGetCertificates();
      setCertsList(list);
    } catch (err) {
      console.error("Error loading certificates", err);
    } finally {
      setLoadingCerts(false);
    }
  }, []);

  useEffect(() => {
    if (subTab === "manage") {
      loadCertificates();
    }
  }, [subTab, loadCertificates]);

  const generateRandomCode = () => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coursePrefix = newCourse ? newCourse.trim().substring(0, 3).replace(/\s+/g, "").toUpperCase() : "CRT";
    setNewCode(`PBI-${coursePrefix}-${rand}`);
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !newCourse || !newCode) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    setSavingCert(true);
    try {
      await adminAddCertificate({
        email: newEmail,
        student_name: newName,
        course_title: newCourse,
        certificate_code: newCode,
        issued_at: newDate ? new Date(newDate).toISOString() : undefined,
      });
      alert("Certificado emitido y guardado exitosamente");
      setNewEmail("");
      setNewName("");
      setNewCourse("");
      setNewCode("");
      loadCertificates();
    } catch (err: any) {
      alert("Error al guardar certificado: " + err.message);
    } finally {
      setSavingCert(false);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setImportResult(null);
    }
  };

  const handleImportCSV = async () => {
    if (!csvFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await csvFile.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert("El archivo CSV está vacío o no contiene cabecera.");
        setImporting(false);
        return;
      }
      
      const header = lines[0];
      const separator = header.includes(";") ? ";" : ",";
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(separator).map(v => v.replace(/^["']|["']$/g, "").trim());
        if (values.length < 3) continue;

        const nameVal = values[0];
        const emailVal = values[1];
        const courseVal = values[2];
        
        let codeVal = values[3];
        if (!codeVal) {
          const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
          codeVal = `PBI-CSV-${rand}`;
        }

        const dateVal = values[4];
        let issued_at = undefined;
        if (dateVal) {
          const parsed = new Date(dateVal);
          if (!isNaN(parsed.getTime())) {
            issued_at = parsed.toISOString();
          }
        }

        rows.push({
          student_name: nameVal,
          email: emailVal,
          course_title: courseVal,
          certificate_code: codeVal,
          issued_at
        });
      }

      if (rows.length === 0) {
        alert("No se encontraron filas con datos válidos en el CSV.");
        setImporting(false);
        return;
      }

      const res = await adminImportCertificates(rows);
      setImportResult(res);
      setCsvFile(null);
      
      const input = document.getElementById("csv-file-input") as HTMLInputElement;
      if (input) input.value = "";
      
      loadCertificates();
    } catch (err: any) {
      alert("Error al importar el archivo CSV: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = "Nombre Completo,Correo Electronico,Nombre Curso,Codigo Certificado,Fecha Emision\n";
    const example1 = "Juan Pérez,juan.perez@example.com,Power BI,PBI-PBB-883K1,2026-07-08\n";
    const example2 = "María Gómez,maria.gomez@example.com,SQL Server Avanzado,PBI-SQL-321L9,2026-07-07\n";
    const blob = new Blob([headers + example1 + example2], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_importacion_certificados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este certificado? El alumno ya no tendrá acceso para descargarlo.")) {
      return;
    }
    try {
      await adminDeleteCertificate(id);
      loadCertificates();
    } catch (err: any) {
      alert("Error al eliminar certificado: " + err.message);
    }
  };

  const filteredCerts = certsList.filter(c => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;
    return (
      c.student_name?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      c.course_title?.toLowerCase().includes(search) ||
      c.certificate_code?.toLowerCase().includes(search)
    );
  });

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');

      // Canvas dimensions (A4 landscape)
      const W = 2246, H = 1588;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // --- Background ---
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, W, H);

      // --- Gold Border ---
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 6;
      ctx.strokeRect(48, 48, W - 96, H - 96);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(60, 60, W - 120, H - 120);
      ctx.globalAlpha = 1;

      // --- White content area ---
      const cx = 84, cy = 84, cw = W - 168, ch = H - 168;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx, cy, cw, ch);

      // --- Logo ---
      try {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          logo.onload = () => resolve();
          logo.onerror = () => reject();
          logo.src = '/logo.png';
        });
        const logoH = 120;
        const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
        ctx.drawImage(logo, (W - logoW) / 2, cy + 50, logoW, logoH);
      } catch { /* logo failed, continue without it */ }

      // --- Title ---
      ctx.fillStyle = '#0f2c59';
      ctx.font = '900 84px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '14px';
      ctx.fillText('CERTIFICADO DE FINALIZACIÓN', W / 2, cy + 280);
      ctx.letterSpacing = '0px';

      // --- Subtitle ---
      ctx.fillStyle = '#c5a059';
      ctx.font = '700 24px system-ui, sans-serif';
      ctx.letterSpacing = '8px';
      ctx.fillText('ESTE DIPLOMA ES CONFERIDO CON HONORES A:', W / 2, cy + 370);
      ctx.letterSpacing = '0px';

      // --- Student Name ---
      ctx.fillStyle = '#0f2c59';
      ctx.font = 'italic 700 110px system-ui, sans-serif';
      ctx.fillText(studentName || 'Nombre del Alumno', W / 2, cy + 540);

      // --- Student RUT ---
      ctx.fillStyle = '#6b7280';
      ctx.font = '600 28px system-ui, sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText(`RUT: ${studentRut || '12.345.678-9'}`, W / 2, cy + 600);
      ctx.letterSpacing = '0px';

      // --- Gold decorative line under name ---
      const lineGrad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.5, '#c5a059');
      lineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W * 0.2, cy + 630);
      ctx.lineTo(W * 0.8, cy + 630);
      ctx.stroke();

      // --- Description ---
      ctx.fillStyle = '#6b7280';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('POR HABER COMPLETADO EXITOSAMENTE Y DEMOSTRADO UN DOMINIO ABSOLUTO EN:', W / 2, cy + 680);
      ctx.letterSpacing = '0px';

      // --- Course Name ---
      ctx.fillStyle = '#1e293b';
      ctx.font = '900 60px system-ui, sans-serif';
      ctx.fillText(courseName || 'Nombre del Curso', W / 2, cy + 770);

      // --- Footer ---
      const fy = cy + ch - 160;

      // Date
      ctx.fillStyle = '#1e293b';
      ctx.font = '700 28px system-ui, sans-serif';
      ctx.fillText(issueDate, W * 0.25, fy);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '700 16px system-ui, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('FECHA DE EMISIÓN', W * 0.25, fy + 40);
      ctx.letterSpacing = '0px';

      // Sign line
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.15, fy - 20);
      ctx.lineTo(W * 0.35, fy - 20);
      ctx.stroke();

      // Instructor Name
      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic 700 48px system-ui, sans-serif';
      ctx.fillText(instructorName, W * 0.75, fy);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '700 16px system-ui, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('INSTRUCTOR SENIOR', W * 0.75, fy + 40);
      ctx.letterSpacing = '0px';

      // Sign line
      ctx.beginPath();
      ctx.moveTo(W * 0.65, fy - 20);
      ctx.lineTo(W * 0.85, fy - 20);
      ctx.stroke();

      // Sello
      const drawStar = (x: number, y: number, r: number, p: number, m: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, 0 - r);
        for (let idx = 0; idx < p; idx++) {
          ctx.rotate(Math.PI / p);
          ctx.lineTo(0, 0 - (r * m));
          ctx.rotate(Math.PI / p);
          ctx.lineTo(0, 0 - r);
        }
        ctx.restore();
      };

      ctx.fillStyle = 'linear-gradient(to bottom right, #dfc27d, #b38836)';
      const sealGrad = ctx.createLinearGradient(W / 2 - 100, fy - 100, W / 2 + 100, fy + 100);
      sealGrad.addColorStop(0, '#dfc27d');
      sealGrad.addColorStop(1, '#b38836');

      ctx.fillStyle = sealGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 15;
      
      ctx.save();
      ctx.translate(W / 2, fy - 10);
      for (let angle = 0; angle < 180; angle += 15) {
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillRect(-64, -64, 128, 128);
      }
      ctx.restore();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fcf8f2';
      ctx.beginPath();
      ctx.arc(W / 2, fy - 10, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#b38836';
      ctx.font = '900 12px system-ui, sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('ACREDITADO', W / 2, fy - 20);
      ctx.letterSpacing = '0px';

      // Small ribbon draw
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.fillText('★ ★ ★', W / 2, fy + 10);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('l', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      pdf.save(`Certificado_${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    } finally {
      setIsExporting(false);
      setShowPreview(false);
    }
  };

  const DiplomaContent = ({ dRef, dynamicScale = 1 }: { dRef: any, dynamicScale?: number }) => (
    <div 
      ref={dRef}
      className="bg-[#fafafa] shadow-2xl relative shrink-0 overflow-hidden" 
      style={{ 
        width: '1123px', 
        height: '794px', 
        transform: `scale(${dynamicScale})`, 
        transformOrigin: 'top left' 
      }}
    >
       {/* Marco Exterior Dorado / Azul */}
       <div className="absolute inset-6 border-[3px] border-[#c5a059] z-10 pointer-events-none" />
       <div className="absolute inset-[30px] border-[1px] border-[#c5a059] z-10 pointer-events-none opacity-50" />
       
       {/* Fondo de patrón sutil */}
       <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

       {/* Contenido Central */}
       <div className="absolute inset-[42px] bg-white flex flex-col items-center justify-center text-center p-12 z-20 shadow-inner overflow-hidden">
          
          {/* Luces sutiles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-[100px] pointer-events-none" style={{ zIndex: -1 }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] pointer-events-none" style={{ zIndex: -1 }} />

          {/* Logo ProgramBI */}
          <div className="mb-6 flex flex-col items-center">
            <img src="/logo.png" alt="ProgramBI" className="h-16 object-contain" style={{ height: '64px' }} />
          </div>

          {/* Título */}
          <h1 className="text-[42px] font-black text-[#0f2c59] tracking-[0.15em] uppercase mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Certificado de Finalización
          </h1>
          
          {/* Otorgado a */}
          <p className="text-[#c5a059] uppercase tracking-[0.25em] text-xs mb-6 font-bold">
            Este diploma es conferido con honores a:
          </p>

          {/* Nombre */}
          <div className="w-full max-w-3xl mb-1 flex flex-col items-center justify-center relative">
             <span className="font-dancing text-[64px] italic text-[#0f2c59] font-bold px-12 leading-none whitespace-nowrap">
               {studentName || "Nombre del Alumno"}
             </span>
             <span className="text-gray-500 uppercase tracking-widest text-[12px] font-semibold mt-4">
               RUT: {studentRut || "12.345.678-9"}
             </span>
             <div className="absolute -bottom-4 left-1/2 w-3/4 h-[2px]" style={{ transform: 'translateX(-50%)', background: 'linear-gradient(to right, transparent, #c5a059, transparent)', opacity: 0.7 }} />
          </div>

          {/* Descripción */}
          <p className="text-gray-500 uppercase tracking-[0.15em] text-[11px] mb-4 font-semibold max-w-2xl leading-relaxed mt-4">
            Por haber completado exitosamente y demostrado un dominio absoluto en los contenidos de:
          </p>

          {/* Curso */}
          <h2 className="text-[28px] font-black text-slate-800 max-w-4xl leading-tight mb-14 px-8" style={{ fontFamily: 'var(--font-display)' }}>
            {courseName || "Nombre del Curso"}
          </h2>

          {/* Pie: Firmas y Sello */}
          <div className="w-full flex justify-between items-end px-16 mt-auto">
             <div className="flex flex-col items-center">
                <span className="text-base font-bold text-gray-800 mb-2 border-b border-gray-400 w-40 pb-2">{issueDate}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha de Emisión</span>
             </div>

             <div className="w-28 h-28 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #dfc27d, #b38836)', transform: 'rotate(45deg)' }} />
                <div className="absolute inset-0 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #dfc27d, #b38836)', transform: 'rotate(15deg)' }} />
                <div className="absolute inset-0 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #dfc27d, #b38836)', transform: 'rotate(75deg)' }} />
                <div className="absolute inset-2 bg-[#fcf8f2] rounded-full border border-[#c5a059] flex items-center justify-center flex-col shadow-inner z-10">
                   <Award className="w-8 h-8 text-[#b38836] mb-0.5" />
                   <span className="text-[8px] font-bold text-[#b38836] uppercase tracking-wider">Acreditado</span>
                </div>
             </div>

             <div className="flex flex-col items-center">
                <span className="font-dancing text-3xl italic text-gray-800 mb-2 border-b border-gray-400 w-48 pb-1 pt-4">{instructorName}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instructor Senior</span>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50/50 relative">
      {/* Sub-tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white px-6 py-2 shrink-0 gap-4">
        <button
          onClick={() => setSubTab("designer")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer border-none bg-transparent ${
            subTab === "designer" ? "border-brand-blue text-brand-blue border-b-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Diseñador de Diplomas (Manual)
        </button>
        <button
          onClick={() => setSubTab("manage")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer border-none bg-transparent ${
            subTab === "manage" ? "border-brand-blue text-brand-blue border-b-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Importación y Gestión de Alumnos
        </button>
      </div>

      {subTab === "designer" ? (
        <>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-xl font-black text-gray-900">Generador de Diplomas PDF</h2>
              <p className="text-sm text-gray-500">Crea certificados en PDF perfectos, de exactamente 1 página.</p>
            </div>
            <button 
              onClick={generatePDF}
              disabled={isExporting}
              className="bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer border-none"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Generando..." : "Descargar PDF"}
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-y-auto">
            {/* Form Panel */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <Edit3 className="w-4 h-4 text-brand-blue" /> Datos del Diploma
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre del Alumno</label>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">RUT</label>
                  <input type="text" value={studentRut} onChange={e => setStudentRut(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre del Curso</label>
                  <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Fecha de Emisión</label>
                  <input type="text" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Firma Instructor</label>
                  <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Scaled Preview Panel */}
            <div className="flex-1 overflow-hidden" ref={containerRef}>
              <div style={{ height: `${794 * scale}px`, width: `${1123 * scale}px` }} className="mx-auto transition-all">
                 <DiplomaContent dRef={diplomaRef} dynamicScale={scale} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-y-auto">
          {/* Left panel: Actions & Forms */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            
            {/* CSV Bulk Import Section */}
            <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
                <Upload className="w-4 h-4 text-brand-blue" /> Importación Masiva (CSV)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Sube un archivo CSV con las columnas correspondientes para registrar múltiples certificados.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadCSVTemplate}
                  className="w-full py-2 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-brand-blue text-neutral-600 dark:text-neutral-400 hover:text-brand-blue rounded-xl text-xs font-bold transition-all bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar Plantilla CSV
                </button>

                <div className="border-2 border-dashed border-neutral-250 dark:border-neutral-800 hover:border-brand-blue rounded-2xl p-4 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-850 hover:bg-blue-50/20 transition-all relative">
                  <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 text-center">
                    {csvFile ? csvFile.name : "Selecciona o arrastra el archivo CSV"}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Soporta archivos .csv UTF-8</span>
                </div>

                {csvFile && (
                  <button
                    onClick={handleImportCSV}
                    disabled={importing}
                    className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm disabled:opacity-50 transition-all cursor-pointer border-none"
                  >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Procesar e Importar CSV"}
                  </button>
                )}
              </div>

              {/* Import Results Box */}
              {importResult && (
                <div className={`p-4 rounded-xl border ${importResult.failed > 0 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/55 text-amber-900 dark:text-amber-300" : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/55 text-emerald-900 dark:text-emerald-300"} space-y-2`}>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {importResult.failed > 0 ? <AlertCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    <span>Resultado de Importación</span>
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p>✓ Creados/Actualizados: <strong>{importResult.success}</strong></p>
                    {importResult.failed > 0 && <p>✗ Fallidos: <strong>{importResult.failed}</strong></p>}
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2 text-[10px] max-h-24 overflow-y-auto bg-white/50 dark:bg-neutral-900/50 p-2 rounded-lg font-mono space-y-1">
                      {importResult.errors.map((err, idx) => (
                        <div key={idx} className="text-red-600 dark:text-red-400">• {err}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Individual Certificate Form */}
            <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
                <Plus className="w-4 h-4 text-brand-blue" /> Emitir Individualmente
              </h3>
              
              <form onSubmit={handleAddCertificate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">Nombre del Alumno *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. juan.perez@email.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">Nombre del Curso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bootcamp Data Analytics"
                    value={newCourse}
                    onChange={e => setNewCourse(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase flex items-center justify-between">
                    <span>Código Certificado *</span>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[9px] text-brand-blue hover:text-blue-700 font-black tracking-normal uppercase border-none bg-transparent cursor-pointer"
                    >
                      Generar Código
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. PBI-DATA-93K29"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">Fecha de Emisión</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingCert}
                  className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm hover:shadow-md disabled:opacity-50 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  {savingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Emitir y Guardar
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Registered Certificates List */}
          <div className="flex-1 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-sm flex flex-col min-w-0 min-h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/50 pb-4 mb-4 shrink-0">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Certificados en Base de Datos</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Certificados manuales e importados para visualización de los alumnos.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar alumno, correo, código..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all dark:text-white"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loadingCerts ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                </div>
              ) : filteredCerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-neutral-500">
                  <FileText className="w-10 h-10 mb-2 opacity-50 text-gray-300" />
                  <p className="text-xs font-bold">No se encontraron certificados</p>
                  <p className="text-[11px] mt-0.5">Agrega uno manualmente o sube un archivo CSV.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50 dark:bg-neutral-900/50">
                        <th className="py-3 px-4">Alumno</th>
                        <th className="py-3 px-4">Curso</th>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Fecha Emisión</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850/65">
                      {filteredCerts.map((cert) => (
                        <tr key={cert.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-850/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-neutral-800 dark:text-white">{cert.student_name}</div>
                            <div className="text-[10px] text-gray-400 dark:text-neutral-500">{cert.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-neutral-750 dark:text-neutral-300 max-w-[200px] truncate" title={cert.course_title}>
                              {cert.course_title}
                            </div>
                            {cert.user_id ? (
                              <span className="inline-block text-[8px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black mt-0.5">
                                Registrado
                              </span>
                            ) : (
                              <span className="inline-block text-[8px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-black mt-0.5" title="Se vinculará automáticamente cuando cree su cuenta con este correo">
                                Pendiente Registro
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-neutral-600 dark:text-neutral-400">
                            {cert.certificate_code}
                          </td>
                          <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400">
                            {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("es-MX", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCertificate(cert.id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/25 text-gray-400 hover:text-red-500 rounded-lg transition-colors border-none bg-transparent cursor-pointer inline-flex items-center"
                              title="Eliminar certificado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPANIES (EMPRESAS TAB) ───
function AdminCompanies() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Expanded company ID for showing employees
  const [expandedOrgId, setExpandedOrgId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const [orgsRes, usersRes, profilesRes, invitesRes] = await Promise.all([
        supabase
          .from("organizations")
          .select(`
            *,
            organization_managers(
              profile_id,
              profile:profiles(id, full_name, email, avatar_url)
            )
          `)
          .order("created_at", { ascending: false }),
        adminGetAllUsers(),
        supabase
          .from("profiles")
          .select("id, full_name, email, department, organization_id, role")
          .not("organization_id", "is", null),
        supabase
          .from("organization_invitations")
          .select("*")
      ]);

      if (orgsRes.error) throw orgsRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (invitesRes.error) throw invitesRes.error;

      setOrgs(orgsRes.data || []);
      setUsers(usersRes || []);
      setEmployees(profilesRes.data || []);
      setInvitations(invitesRes.data || []);
    } catch (err: any) {
      console.error("Error loading organizations data:", err);
      setError(err.message || "Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCsvFile(null);
      setCsvPreview([]);
      return;
    }
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSV(text);
        setCsvPreview(parsed);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    const result: any[] = [];
    if (lines.length === 0) return result;
    
    // Parse headers, support semicolon/comma separator
    let separator = ",";
    if (lines[0].includes(";")) separator = ";";
    
    const headers = lines[0].split(separator).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const currentline = lines[i].split(separator).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        const value = currentline[j];
        if (key) {
          // Normalize common headers
          if (key === 'email' || key === 'correo' || key === 'mail') {
            obj.email = value;
          } else if (key === 'full_name' || key === 'nombre' || key === 'name' || key === 'nombre completo') {
            obj.name = value;
            obj.full_name = value;
          } else if (key === 'department' || key === 'departamento' || key === 'area') {
            obj.department = value;
          } else {
            obj[key] = value;
          }
        }
      }
      if (obj.email) {
        if (!obj.name) {
          obj.name = obj.email.split('@')[0];
        }
        result.push(obj);
      }
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (!name.trim()) throw new Error("El nombre de la empresa es obligatorio.");
      if (!managerEmail.trim()) throw new Error("El email del manager es obligatorio.");
      if (!managerName.trim()) throw new Error("El nombre del manager es obligatorio.");

      // Combine manager into the employee list
      const cleanManagerEmail = managerEmail.trim().toLowerCase();
      const cleanManagerName = managerName.trim();

      // Ensure employees array contains the manager
      const listEmployees = [...csvPreview];
      const managerExists = listEmployees.some(emp => emp.email.toLowerCase() === cleanManagerEmail);
      if (!managerExists) {
        listEmployees.unshift({
          email: cleanManagerEmail,
          name: cleanManagerName
        });
      }

      // Call secure Superadmin B2B API
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          logoUrl: logoUrl.trim() || null,
          domain: domain.trim() || null,
          managerEmail: cleanManagerEmail,
          employees: listEmployees.map(emp => ({
            email: emp.email.trim().toLowerCase(),
            name: emp.name || emp.full_name || emp.email.split("@")[0]
          }))
        })
      });

      const resData = await response.json();
      if (!response.ok || resData.error) {
        throw new Error(resData.error || "Error al procesar la solicitud.");
      }

      const { results } = resData;
      setSuccess(`Empresa "${name.trim()}" creada con éxito. ` + 
        `Cuentas creadas: ${results.created}. Cuentas vinculadas: ${results.associated}. ` + 
        (results.failed > 0 ? `Fallaron: ${results.failed}.` : ""));
      
      // Reset form
      setName("");
      setDomain("");
      setLogoUrl("");
      setManagerEmail("");
      setManagerName("");
      setCsvFile(null);
      setCsvPreview([]);
      
      // Fetch updated data
      await fetchData();
      
      // Close modal after brief delay
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 4000);

    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrg = async (orgId: string, orgName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la empresa "${orgName}"? Esto desvinculará a todos sus empleados y eliminará a sus managers.`)) return;
    
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);

      if (deleteError) throw deleteError;

      // Refresh list
      await fetchData();
    } catch (err: any) {
      alert("Error al eliminar empresa: " + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Empresas</h2>
          <p className="text-sm text-gray-400">Gestiona las organizaciones corporativas y sus miembros.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Agregar Empresa
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm font-semibold mb-5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Cargando empresas...</span>
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold mb-1">No hay empresas</h3>
          <p className="text-gray-400 text-sm">Crea una empresa para habilitar ProgramBI Business.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Dominio</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Miembros</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orgs.map(org => {
                  const orgEmployees = employees.filter(e => e.organization_id === org.id);
                  const orgInvites = invitations.filter(i => i.organization_id === org.id);
                  const isExpanded = expandedOrgId === org.id;

                  // Find managers
                  const managerNames = org.organization_managers && org.organization_managers.length > 0
                    ? org.organization_managers.map((om: any) => om.profile?.full_name || om.profile?.email).join(", ")
                    : "Sin manager asignado";

                  return (
                    <React.Fragment key={org.id}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-black overflow-hidden border border-gray-200/50">
                              {org.logo_url ? (
                                <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                              ) : (
                                org.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{org.name}</div>
                              <div className="text-[10px] text-gray-400">Creado el {new Date(org.created_at).toLocaleDateString("es-CL")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                          {org.domain ? (
                            <span className="bg-blue-50 text-brand-blue border border-blue-100/50 px-2 py-0.5 rounded-md text-xs">@{org.domain}</span>
                          ) : (
                            <span className="text-gray-300 italic text-xs">Sin dominio</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                          {managerNames}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 font-bold">
                          <button 
                            onClick={() => setExpandedOrgId(isExpanded ? null : org.id)}
                            className="bg-transparent hover:underline text-brand-blue font-bold text-sm cursor-pointer p-0 border-none flex items-center gap-1"
                          >
                            {orgEmployees.length} activos
                            {orgInvites.length > 0 && <span className="text-amber-500 font-medium text-xs">({orgInvites.length} inv.)</span>}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setExpandedOrgId(isExpanded ? null : org.id)}
                              className="px-2.5 py-1 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              Ver detalles
                            </button>
                            <button 
                              onClick={() => handleDeleteOrg(org.id, org.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all border-none cursor-pointer"
                              title="Eliminar empresa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row for employees */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50/50 p-6 border-b border-gray-150">
                            <div className="space-y-4">
                              <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <Users className="w-4 h-4 text-brand-blue" />
                                Lista de Miembros Corporativos - {org.name}
                              </h4>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                {/* Active Employees */}
                                <div>
                                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Empleados Activos ({orgEmployees.length})</h5>
                                  {orgEmployees.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">No hay empleados activos en esta empresa.</p>
                                  ) : (
                                    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-60 overflow-y-auto">
                                      {orgEmployees.map(emp => (
                                        <div key={emp.id} className="p-2.5 flex items-center justify-between text-xs">
                                          <div>
                                            <div className="font-bold text-gray-900">{emp.full_name || emp.email}</div>
                                            <div className="text-gray-400 text-[10px]">{emp.email}</div>
                                          </div>
                                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 text-[10px] font-bold">{emp.department || 'General'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Pending Invitations */}
                                <div>
                                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Invitaciones Pendientes ({orgInvites.length})</h5>
                                  {orgInvites.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">No hay invitaciones pendientes.</p>
                                  ) : (
                                    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-60 overflow-y-auto">
                                      {orgInvites.map(invite => (
                                        <div key={invite.id} className="p-2.5 flex items-center justify-between text-xs">
                                          <div>
                                            <div className="font-bold text-amber-600">{invite.email}</div>
                                            <div className="text-gray-400 text-[10px]">Esperando registro</div>
                                          </div>
                                          <span className="bg-amber-50 border border-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold">{invite.department || 'General'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <h3 className="font-display font-black text-xl text-gray-900">Agregar Nueva Empresa</h3>
                <button 
                  onClick={() => { setShowModal(false); setError(null); setSuccess(null); }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none cursor-pointer bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success && (
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl p-3 text-sm font-semibold mb-5 text-center">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm font-semibold mb-5 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nombre de la Empresa *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Ej. Mercado Libre" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Dominio Email (Auto-asociación)</label>
                    <input 
                      type="text" 
                      value={domain} 
                      onChange={e => setDomain(e.target.value)} 
                      placeholder="mercadolibre.cl (sin @)" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">URL del Logo (Opcional)</label>
                    <input 
                      type="text" 
                      value={logoUrl} 
                      onChange={e => setLogoUrl(e.target.value)} 
                      placeholder="https://logo.com/image.png" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email del Manager *</label>
                    <input 
                      type="email" 
                      required
                      value={managerEmail} 
                      onChange={e => setManagerEmail(e.target.value)} 
                      placeholder="manager@empresa.com" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nombre del Manager *</label>
                    <input 
                      type="text" 
                      required
                      value={managerName} 
                      onChange={e => setManagerName(e.target.value)} 
                      placeholder="Juan Pérez" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="border border-dashed border-gray-200 rounded-xl p-5 bg-gray-50/50">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subir CSV de Empleados (Opcional)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileChange}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-blue file:cursor-pointer hover:file:bg-blue-100" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">El archivo debe tener las columnas: <code className="bg-gray-150 px-1 py-0.5 rounded text-gray-600">email</code>, <code className="bg-gray-150 px-1 py-0.5 rounded text-gray-600">full_name</code> (opcional) y <code className="bg-gray-150 px-1 py-0.5 rounded text-gray-600">department</code> (opcional).</p>
                  
                  {csvPreview.length > 0 && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 max-h-36 overflow-y-auto text-xs space-y-1.5">
                      <div className="font-bold text-gray-600 border-b border-gray-100 pb-1 flex justify-between">
                        <span>Previsualización ({csvPreview.length} filas)</span>
                        <button 
                          type="button" 
                          onClick={() => { setCsvFile(null); setCsvPreview([]); }} 
                          className="text-red-500 hover:underline p-0 border-none cursor-pointer bg-transparent"
                        >
                          Limpiar
                        </button>
                      </div>
                      {csvPreview.slice(0, 5).map((row, idx) => (
                        <div key={idx} className="flex justify-between text-gray-500">
                          <span className="truncate max-w-[150px]">{row.email}</span>
                          <span className="text-[10px] text-gray-400">{row.name || row.full_name || 'Sin nombre'} · {row.department || 'Sin area'}</span>
                        </div>
                      ))}
                      {csvPreview.length > 5 && (
                        <div className="text-[10px] text-gray-400 italic text-center pt-1 border-t border-gray-50">Y {csvPreview.length - 5} filas más...</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); setError(null); setSuccess(null); }}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {submitting ? "Creando..." : "Crear Empresa"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ADMIN LIVE CLASSES MANAGEMENT ───
interface AdminLiveClass {
  id: string;
  title: string;
  description: string | null;
  room_name: string;
  youtube_stream_key: string | null;
  youtube_video_id: string | null;
  status: "scheduled" | "active" | "completed";
  scheduled_at: string;
}

function AdminLiveClasses() {
  const [activeTab, setActiveTab] = useState<"schedule" | "recording" | "list">("schedule");
  const [classes, setClasses] = useState<AdminLiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Schedule class form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomName, setRoomName] = useState("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // Recording form states
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingDescription, setRecordingDescription] = useState("");
  const [recordingVideoId, setRecordingVideoId] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [submittingRecording, setSubmittingRecording] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from("live_classes")
        .select("*")
        .order("scheduled_at", { ascending: false });
      if (fetchErr) throw fetchErr;
      setClasses(data || []);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al cargar las clases: " + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleScheduleClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !roomName.trim() || !scheduledAt) return;
    setSubmittingSchedule(true);
    setError(null);
    setSuccess(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("live_classes")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          room_name: roomName.trim().replace(/\s+/g, "-").toLowerCase(),
          youtube_stream_key: youtubeKey.trim() || null,
          scheduled_at: new Date(scheduledAt).toISOString(),
          status: "scheduled"
        });

      if (insertError) throw insertError;

      // Broadcast notification to all enrolled users
      try {
        const { broadcastNotification } = await import("@/lib/supabase/comunidad");
        const scheduledDate = new Date(scheduledAt).toLocaleDateString("es-CL", { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        await broadcastNotification(
          "live",
          "Nueva clase en vivo programada",
          `"${title.trim()}" - ${scheduledDate}`,
          "/comunidad/live"
        );
      } catch (notifErr) {
        console.error("Error sending notification:", notifErr);
      }

      setSuccess(`Clase "${title}" agendada exitosamente.`);
      setTitle("");
      setDescription("");
      setRoomName("");
      setYoutubeKey("");
      setScheduledAt("");
      fetchClasses();
      setActiveTab("list");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al agendar clase: " + msg);
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleAddRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingTitle.trim() || !recordingVideoId.trim() || !recordingDate) return;
    setSubmittingRecording(true);
    setError(null);
    setSuccess(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("live_classes")
        .insert({
          title: recordingTitle.trim(),
          description: recordingDescription.trim() || null,
          room_name: `recording-${Date.now()}`,
          youtube_video_id: recordingVideoId.trim(),
          scheduled_at: new Date(recordingDate).toISOString(),
          status: "completed"
        });

      if (insertError) throw insertError;

      setSuccess(`Grabación "${recordingTitle}" agregada exitosamente.`);
      setRecordingTitle("");
      setRecordingDescription("");
      setRecordingVideoId("");
      setRecordingDate("");
      fetchClasses();
      setActiveTab("list");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al agregar grabación: " + msg);
    } finally {
      setSubmittingRecording(false);
    }
  };

  const handleStartClass = async (classId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: startError } = await supabase
        .from("live_classes")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", classId);

      if (startError) throw startError;
      setSuccess("Clase iniciada en vivo. Los estudiantes ya pueden unirse.");
      fetchClasses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al iniciar clase: " + msg);
    }
  };

  const handleDeleteClass = async (classId: string, classNameStr: string) => {
    if (!confirm(`¿Estás seguro de eliminar la clase "${classNameStr}"?`)) return;
    setError(null);
    setSuccess(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("live_classes")
        .delete()
        .eq("id", classId);

      if (deleteError) throw deleteError;
      setSuccess("Clase eliminada exitosamente.");
      fetchClasses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al eliminar clase: " + msg);
    }
  };

  return (
    <div className="p-6 space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
        <div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white font-display">Gestión de Clases en Vivo</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Programa transmisiones directas o añade grabaciones de sesiones pasadas.</p>
        </div>
        
        <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1 shrink-0 self-start sm:self-auto select-none">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === "schedule" 
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            Agendar Live
          </button>
          <button
            onClick={() => setActiveTab("recording")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === "recording" 
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            Agregar Grabación
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === "list" 
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            Ver Todas ({classes.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 rounded-xl p-4 text-xs font-bold border border-red-200/50 dark:border-red-900/50 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 rounded-xl p-4 text-xs font-bold border border-emerald-200/50 dark:border-emerald-900/50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {activeTab === "schedule" && (
        <form onSubmit={handleScheduleClass} className="space-y-6 max-w-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850/80 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-900 pb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/15 text-brand-blue flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Programar una Masterclass</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Título de la Clase *</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Ej. Masterclass SQL Avanzado" 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Sala de Directo (ID único) *</label>
              <input 
                type="text" 
                required 
                value={roomName} 
                onChange={e => setRoomName(e.target.value)} 
                placeholder="ej. masterclass-sql" 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 block">El ID de la sala se convertirá a minúsculas y guiones.</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Indica el contenido clave de la clase, temarios, o requisitos..." 
              className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15 resize-none min-h-[80px]" 
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Clave de Stream (Opcional)</label>
              <input 
                type="password" 
                value={youtubeKey} 
                onChange={e => setYoutubeKey(e.target.value)} 
                placeholder="Para transmitir con OBS Studio" 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Fecha y Hora Programada *</label>
              <input 
                type="datetime-local" 
                required 
                value={scheduledAt} 
                onChange={e => setScheduledAt(e.target.value)} 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submittingSchedule}
              className="px-6 py-3 bg-brand-blue hover:bg-blue-650 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-none cursor-pointer transition-all active:scale-[0.98]"
            >
              {submittingSchedule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
              {submittingSchedule ? "Agendando..." : "Agendar Masterclass"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "recording" && (
        <form onSubmit={handleAddRecording} className="space-y-6 max-w-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850/80 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-900 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50/80 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Video className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Agregar Grabación de Clase Pasada</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Título de la Grabación *</label>
              <input 
                type="text" 
                required 
                value={recordingTitle} 
                onChange={e => setRecordingTitle(e.target.value)} 
                placeholder="Ej. Masterclass SQL Server - Sesión 1" 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">ID de Video de YouTube *</label>
              <input 
                type="text" 
                required 
                value={recordingVideoId} 
                onChange={e => setRecordingVideoId(e.target.value)} 
                placeholder="Ej. dQw4w9WgXcQ" 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 block">Ingresa el ID de 11 caracteres del video de YouTube.</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
            <textarea 
              value={recordingDescription} 
              onChange={e => setRecordingDescription(e.target.value)} 
              placeholder="Escribe un breve resumen de los temas explicados, recursos o enlaces útiles..." 
              className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15 resize-none min-h-[80px]" 
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Fecha de la Clase *</label>
              <input 
                type="datetime-local" 
                required 
                value={recordingDate} 
                onChange={e => setRecordingDate(e.target.value)} 
                className="w-full bg-neutral-50 focus:bg-white dark:bg-neutral-900 dark:focus:bg-neutral-950 border border-neutral-200 focus:border-brand-blue dark:border-neutral-800 dark:focus:border-brand-blue rounded-xl p-3 text-xs text-neutral-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-brand-blue/15" 
              />
            </div>
            
            {/* Dynamic YouTube thumbnail preview */}
            <div className="flex flex-col justify-end">
              {recordingVideoId.trim().length === 11 && (
                <div className="rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-900 aspect-video relative max-w-[200px] shadow-sm select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${recordingVideoId.trim()}/hqdefault.jpg`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/75 text-[9px] text-white px-1.5 py-0.5 rounded font-bold">
                    Miniatura
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submittingRecording}
              className="px-6 py-3 bg-brand-blue hover:bg-blue-650 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-none cursor-pointer transition-all active:scale-[0.98]"
            >
              {submittingRecording ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
              {submittingRecording ? "Agregando..." : "Agregar Grabación"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "list" && (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200/70 dark:border-neutral-850/80 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : classes.length === 0 ? (
            <div className="p-16 text-center text-neutral-400 dark:text-neutral-500 text-xs">
              No hay clases registradas aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-neutral-500 dark:text-neutral-400">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-[10px] uppercase font-bold text-neutral-450 dark:text-neutral-500 border-b border-neutral-200/80 dark:border-neutral-800/80">
                  <tr>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Programada / Fecha</th>
                    <th className="px-6 py-4">Tipo/Estado</th>
                    <th className="px-6 py-4">Enlace YouTube</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white max-w-xs truncate">{cls.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(cls.scheduled_at).toLocaleDateString("es-CL", { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cls.status === "active" ? (
                          <span className="bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full font-black text-[9px] text-red-650 dark:text-red-400 flex items-center gap-1.5 w-max animate-pulse">
                            <span className="w-1.5 h-1.5 bg-red-650 dark:bg-red-400 rounded-full" />
                            En Vivo Ahora
                          </span>
                        ) : cls.status === "scheduled" ? (
                          <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold text-[9px] text-amber-600 dark:text-amber-450 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" />
                            Programada
                          </span>
                        ) : (
                          <span className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 px-2.5 py-1 rounded-full font-semibold text-[9px] text-neutral-600 dark:text-neutral-450 flex items-center gap-1 w-max">
                            <Film className="w-3 h-3" />
                            Grabación
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cls.youtube_video_id ? (
                          <a 
                            href={`https://youtu.be/${cls.youtube_video_id}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-brand-blue dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 w-max"
                          >
                            {cls.youtube_video_id} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : cls.youtube_stream_key ? (
                          <span className="font-mono text-[10px] text-neutral-400">Transmisión RTMP</span>
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-600">Sin enlace</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {cls.status === "scheduled" && (
                            <button
                              onClick={() => handleStartClass(cls.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg border-none cursor-pointer shadow-sm active:scale-95 transition-all flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-white" /> Iniciar Live
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClass(cls.id, cls.title)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-red-200/30 dark:border-red-900/30 cursor-pointer active:scale-95 transition-all"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

