"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  GraduationCap,
  Loader2,
  Search,
  Award,
  FileText,
  Calendar,
  Filter,
  Sparkles,
  Clock,
  TrendingUp,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminGetDetailedDashboardStats } from "@/lib/supabase/comunidad-ai";
import PricingExperimentCard from "./PricingExperimentCard";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Tabs: 'overview' | 'subscribers' | 'progress'
  const [dashTab, setDashTab] = useState<"overview" | "subscribers" | "progress">("overview");

  // Filters and searches
  const [subscriberPlanFilter, setSubscriberPlanFilter] = useState<string>("all");
  const [subscriberSearch, setSubscriberSearch] = useState<string>("");
  
  const [progressCourseFilter, setProgressCourseFilter] = useState<string>("all");
  const [progressSearch, setProgressSearch] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetDetailedDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatCLP = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3 font-semibold">Cargando métricas de primer nivel...</span>
      </div>
    );
  }

  // Cards for Overview
  const cards = [
    {
      label: "Ingresos este mes",
      value: formatCLP(stats?.revenue?.thisMonth || 0),
      change: `${stats?.revenue?.change || 0}%`,
      positive: parseFloat(stats?.revenue?.change || '0') >= 0,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450",
    },
    {
      label: "Suscriptores Activos",
      value: String(stats?.subscribers?.length || 0),
      change: `Planes activos`,
      positive: true,
      icon: Users,
      color: "bg-blue-50 text-brand-blue dark:bg-blue-950/20 dark:text-blue-450",
    },
    {
      label: "Matrículas Activas",
      value: String(stats?.enrollments?.total || 0),
      change: "En cursos",
      positive: true,
      icon: GraduationCap,
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-450",
    },
    {
      label: "Promedio de Avance",
      value: `${stats?.activity?.avgProgressPercent || 0}%`,
      change: "Clases completadas",
      positive: true,
      icon: Activity,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450",
    },
  ];

  // Filtering Subscribers
  const filteredSubscribers = (stats?.subscribers || []).filter((sub: any) => {
    const matchesPlan = subscriberPlanFilter === "all" || sub.subscription_plan?.toLowerCase() === subscriberPlanFilter.toLowerCase();
    const searchLower = subscriberSearch.toLowerCase().trim();
    const matchesSearch = !subscriberSearch || 
      sub.full_name?.toLowerCase().includes(searchLower) ||
      sub.email?.toLowerCase().includes(searchLower);
    return matchesPlan && matchesSearch;
  });

  // Unique courses list in leaderboard for progress filtering
  const coursesInLeaderboard = Array.from(new Set((stats?.leaderboard || []).map((l: any) => l.courseTitle)));

  // Filtering Leaderboard
  const filteredLeaderboard = (stats?.leaderboard || []).filter((item: any) => {
    const matchesCourse = progressCourseFilter === "all" || item.courseTitle === progressCourseFilter;
    const searchLower = progressSearch.toLowerCase().trim();
    const matchesSearch = !progressSearch ||
      item.studentName?.toLowerCase().includes(searchLower) ||
      item.studentEmail?.toLowerCase().includes(searchLower);
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header section with professional subtab switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-6 shrink-0">
        <div>
          <h2 className="font-display font-black text-2xl text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-blue" />
            Panel de Gestión y Analíticas
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
            Métricas de primer nivel, control de suscriptores y avance de alumnos
          </p>
        </div>

        {/* Dynamic subtab layout */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shadow-sm self-start md:self-center">
          <button
            onClick={() => setDashTab("overview")}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              dashTab === "overview"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Visión General
          </button>
          <button
            onClick={() => setDashTab("subscribers")}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              dashTab === "subscribers"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Suscriptores Activos
          </button>
          <button
            onClick={() => setDashTab("progress")}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              dashTab === "progress"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Progreso de Clases
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: OVERVIEW */}
        {dashTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {stat.change && (
                        <div
                          className={`flex items-center gap-0.5 text-xs font-bold ${
                            stat.positive ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {stat.positive ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {stat.change}
                        </div>
                      )}
                    </div>
                    <div className="text-3xl font-black text-neutral-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <PricingExperimentCard />

            {/* Income + Best Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Grand Total Revenue */}
              <div className="bg-gradient-to-br from-brand-blue to-indigo-700 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 text-white/5 opacity-10 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">
                    Ingresos Acumulados
                  </div>
                  <div className="text-4xl font-black">{formatCLP(stats?.revenue?.total || 0)}</div>
                </div>
                <div className="text-xs text-white/60 font-semibold relative z-10 mt-4">
                  Suma total de transacciones completadas
                </div>
              </div>

              {/* Best Course */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Curso Más Vendido
                  </div>
                  <div className="text-xl font-black text-neutral-900 dark:text-white line-clamp-2">
                    {stats?.bestCourse || "—"}
                  </div>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-4">
                  Basado en el volumen de transacciones de compra
                </div>
              </div>

              {/* Quick Activity Stats */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div className="space-y-3">
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-blue" /> Actividad Reciente (30 días)
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Lecciones vistas:</span>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">
                      {stats?.activity?.watchedLastMonthCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Completadas:</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">
                      {stats?.activity?.completedClassesCount || 0}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2">
                  Interacciones de avance registradas
                </div>
              </div>
            </div>

            {/* Recent Payments List */}
            {stats?.recentPayments?.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-neutral-50 dark:border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base">Últimas Transacciones</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Últimos 10 pagos recibidos en la plataforma.</p>
                  </div>
                  <Calendar className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50 dark:bg-neutral-900/50">
                        <th className="py-3 px-6">Cliente</th>
                        <th className="py-3 px-6">Curso Adquirido</th>
                        <th className="py-3 px-6">Estado</th>
                        <th className="py-3 px-6">Fecha</th>
                        <th className="py-3 px-6 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
                      {stats.recentPayments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-neutral-50/20 dark:hover:bg-neutral-800/10 transition-colors">
                          <td className="py-3 px-6 font-bold text-neutral-800 dark:text-white">
                            {p.payer_email}
                          </td>
                          <td className="py-3 px-6 text-neutral-600 dark:text-neutral-300">
                            {p.course?.title || "Curso"}
                          </td>
                          <td className="py-3 px-6">
                            <span
                              className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                p.status === "paid"
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                  : p.status === "pending"
                                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                                  : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {p.status === "paid" ? "Pagado" : p.status}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-neutral-500 dark:text-neutral-400">
                            {p.paid_at
                              ? new Date(p.paid_at).toLocaleDateString("es-CL", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                          <td className="py-3 px-6 text-right font-black text-neutral-900 dark:text-white">
                            {formatCLP(p.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: SUBSCRIBERS */}
        {dashTab === "subscribers" && (
          <motion.div
            key="subscribers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-sm shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar suscriptor por nombre o email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all dark:text-white"
                />
              </div>

              {/* Plan filter pills */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 mr-1" />
                {["all", "basic", "premium"].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSubscriberPlanFilter(plan)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer border border-none ${
                      subscriberPlanFilter === plan
                        ? "bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm"
                        : "bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {plan === "all" ? "Todos" : plan}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-50 dark:border-neutral-800/60">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Alumnos con Suscripción Activa</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Total filtrado: {filteredSubscribers.length} suscriptor{filteredSubscribers.length !== 1 ? "es" : ""}
                </p>
              </div>

              <div className="overflow-x-auto">
                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
                    <Users className="w-12 h-12 mx-auto text-neutral-250 dark:text-neutral-755 mb-3" />
                    <p className="font-bold text-xs">No se encontraron suscriptores activos</p>
                    <p className="text-[11px] mt-0.5">Ajusta el filtro o busca con otros parámetros.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50 dark:bg-neutral-900/50">
                        <th className="py-3 px-6">Nombre Alumno</th>
                        <th className="py-3 px-6">Correo</th>
                        <th className="py-3 px-6">Plan Suscrito</th>
                        <th className="py-3 px-6">Vencimiento</th>
                        <th className="py-3 px-6 text-right">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
                      {filteredSubscribers.map((sub: any) => (
                        <tr key={sub.id} className="hover:bg-neutral-50/20 dark:hover:bg-neutral-800/10 transition-colors">
                          <td className="py-4 px-6 font-bold text-neutral-800 dark:text-white">
                            {sub.full_name || "Sin nombre"}
                          </td>
                          <td className="py-4 px-6 font-mono text-neutral-600 dark:text-neutral-400">
                            {sub.email}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                sub.subscription_plan?.toLowerCase() === "premium"
                                  ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                                  : "bg-blue-50 dark:bg-blue-950/30 text-brand-blue dark:text-blue-400"
                              }`}
                            >
                              {sub.subscription_plan}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-neutral-650 dark:text-neutral-350">
                            {sub.subscription_expires_at ? (
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                <span>
                                  {new Date(sub.subscription_expires_at).toLocaleDateString("es-CL", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-450 font-bold uppercase text-[9px] tracking-wider">
                                Permanente
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right text-neutral-500 dark:text-neutral-400">
                            {sub.created_at
                              ? new Date(sub.created_at).toLocaleDateString("es-CL", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: PROGRESS & LEADERBOARD */}
        {dashTab === "progress" && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Progress indicators row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Promedio de Avance Clases
                </div>
                <div className="text-3xl font-black text-neutral-900 dark:text-white">
                  {stats?.activity?.avgProgressPercent || 0}%
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-relaxed">
                  Porcentaje promedio de reproducción en todas las clases iniciadas.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Clases Completadas
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats?.activity?.completedClassesCount || 0}
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-relaxed">
                  Total de clases marcadas con 100% de reproducción completada.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Clases Vistas (Este mes)
                </div>
                <div className="text-3xl font-black text-brand-blue dark:text-brand-blue">
                  {stats?.activity?.watchedLastMonthCount || 0}
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-relaxed">
                  Lecciones en las que se registró avance en los últimos 30 días.
                </p>
              </div>
            </div>

            {/* Leaderboard filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-sm shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar alumno..."
                  value={progressSearch}
                  onChange={(e) => setProgressSearch(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all dark:text-white"
                />
              </div>

              {/* Course filter select */}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mr-1" />
                <select
                  value={progressCourseFilter}
                  onChange={(e) => setProgressCourseFilter(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-brand-blue transition-all dark:text-white max-w-[240px]"
                >
                  <option value="all">Todos los Cursos</option>
                  {coursesInLeaderboard.map((course: any) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaderboard/Ranking Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-50 dark:border-neutral-800/60">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Ranking de Avance por Alumno y Curso</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Alumnos ordenados de mayor a menor porcentaje de clases completadas.
                </p>
              </div>

              <div className="overflow-x-auto">
                {filteredLeaderboard.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
                    <Award className="w-12 h-12 mx-auto text-neutral-250 dark:text-neutral-750 mb-3" />
                    <p className="font-bold text-xs">No hay datos de avance disponibles</p>
                    <p className="text-[11px] mt-0.5">Ajusta el filtro o busca con otros parámetros.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50 dark:bg-neutral-900/50">
                        <th className="py-3 px-6">Alumno</th>
                        <th className="py-3 px-6">Curso</th>
                        <th className="py-3 px-6">Progreso Clases</th>
                        <th className="py-3 px-6">Avance %</th>
                        <th className="py-3 px-6 text-right">Última Actividad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
                      {filteredLeaderboard.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-neutral-50/20 dark:hover:bg-neutral-800/10 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                              {idx < 3 && (
                                <span
                                  className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-[9px] font-black text-white ${
                                    idx === 0
                                      ? "bg-amber-400"
                                      : idx === 1
                                      ? "bg-slate-400"
                                      : "bg-amber-600"
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              )}
                              <span>{item.studentName}</span>
                            </div>
                            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.studentEmail}</div>
                          </td>
                          <td className="py-4 px-6 text-neutral-700 dark:text-neutral-300 font-medium">
                            {item.courseTitle}
                          </td>
                          <td className="py-4 px-6 font-mono text-neutral-600 dark:text-neutral-400">
                            {item.completedLessons} / {item.totalLessons} completadas
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shrink-0">
                                <div
                                  className={`h-full rounded-full ${
                                    item.completionPercent === 100
                                      ? "bg-emerald-500"
                                      : item.completionPercent > 50
                                      ? "bg-brand-blue"
                                      : "bg-amber-500"
                                  }`}
                                  style={{ width: `${item.completionPercent}%` }}
                                />
                              </div>
                              <span className="font-black text-neutral-900 dark:text-white">
                                {item.completionPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right text-neutral-500 dark:text-neutral-400">
                            {item.lastUpdated
                              ? new Date(item.lastUpdated).toLocaleDateString("es-CL", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
