"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Radio,
  PlayCircle,
  Users,
  Clock,
  Search,
  Download,
  RefreshCw,
  Loader2,
  Calendar,
  Eye,
  X,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Filter,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  adminGetTrackingStats,
  adminGetLiveClassAttendees,
  LiveClassTrackingSummary,
  LessonTrackingSummary,
  StudentActivityItem,
  LiveAttendanceRecord,
} from "@/lib/supabase/tracking";

export default function ClassTrackingTab() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subTab, setSubTab] = useState<"lives" | "lessons" | "students">("lives");

  const [kpis, setKpis] = useState({
    totalLiveAttendees: 0,
    totalLiveMinutes: 0,
    totalLessonViews: 0,
    totalLessonWatchMinutes: 0,
  });

  const [liveSummaries, setLiveSummaries] = useState<LiveClassTrackingSummary[]>([]);
  const [lessonSummaries, setLessonSummaries] = useState<LessonTrackingSummary[]>([]);
  const [activityTimeline, setActivityTimeline] = useState<StudentActivityItem[]>([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClassTrackingSummary | null>(null);
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [attendeesList, setAttendeesList] = useState<LiveAttendanceRecord[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await adminGetTrackingStats();
      setKpis(data.kpis);
      setLiveSummaries(data.liveSummaries);
      setLessonSummaries(data.lessonSummaries);
      setActivityTimeline(data.activityTimeline);
    } catch (err) {
      console.error("Error loading tracking stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenLiveAttendees = async (liveClass: LiveClassTrackingSummary) => {
    setSelectedLiveClass(liveClass);
    setAttendeesModalOpen(true);
    setLoadingAttendees(true);
    try {
      const attendees = await adminGetLiveClassAttendees(liveClass.id);
      setAttendeesList(attendees);
    } catch (err) {
      console.error("Error loading attendees list:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tipo,Titulo,Usuario,Email,Minutos,Fecha\n";

    activityTimeline.forEach((item) => {
      const row = [
        item.type === "live_attendance" ? "Clase en Vivo" : "Leccion Grabada",
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.user_name.replace(/"/g, '""')}"`,
        item.user_email,
        item.duration_minutes,
        new Date(item.timestamp).toLocaleString("es-CL"),
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_asistencia_programbi_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTimeline = activityTimeline.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.user_name.toLowerCase().includes(q) ||
      item.user_email.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  });

  const filteredLessons = lessonSummaries.filter((ls) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return ls.lesson_title.toLowerCase().includes(q) || ls.course_title.toLowerCase().includes(q);
  });

  const filteredLives = liveSummaries.filter((ls) => {
    if (!searchQuery.trim()) return true;
    return ls.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-neutral-500">Cargando métricas de asistencia y reproducciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-brand-blue flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Asistencia y Métricas de Clases
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Monitoreo en tiempo real de asistencia a clases en vivo y reproducciones de lecciones por estudiante.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-xl transition-all flex items-center gap-2 border-none cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#1890FF] to-[#0050b3] hover:opacity-95 rounded-xl shadow-sm transition-all flex items-center gap-2 border-none cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Reporte (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Asistentes Lives</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
            {kpis.totalLiveAttendees}
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">Alumnos únicos en clases en vivo</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Horas Lives Vistas</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
            {Math.round((kpis.totalLiveMinutes / 60) * 10) / 10} hrs
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">{kpis.totalLiveMinutes} minutos acumulados</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Vistas de Lecciones</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-brand-blue flex items-center justify-center">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
            {kpis.totalLessonViews}
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">Reproducciones de clases grabadas</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Horas Lecciones Vistas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
            {Math.round((kpis.totalLessonWatchMinutes / 60) * 10) / 10} hrs
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">Tiempo total de aprendizaje</span>
        </div>
      </div>

      {/* Subtabs & Controls */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab("lives")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 ${
                subTab === "lives"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> Clases en Vivo ({liveSummaries.length})
            </button>
            <button
              onClick={() => setSubTab("lessons")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 ${
                subTab === "lessons"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" /> Lecciones Grabadas ({lessonSummaries.length})
            </button>
            <button
              onClick={() => setSubTab("students")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 ${
                subTab === "students"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Timeline de Estudiantes ({activityTimeline.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por clase, lección o alumno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>

        {/* Tab 1: Live Classes Breakdown */}
        {subTab === "lives" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Clase en Vivo</th>
                  <th className="py-3 px-4">Fecha Programada</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Asistentes</th>
                  <th className="py-3 px-4 text-center">Duración Acumulada</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                {filteredLives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No se encontraron registros de clases en vivo.
                    </td>
                  </tr>
                ) : (
                  filteredLives.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {new Date(item.scheduled_at).toLocaleString("es-CL", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "active"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse"
                              : item.status === "completed"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          }`}
                        >
                          {item.status === "active" ? "EN VIVO" : item.status === "completed" ? "FINALIZADA" : "PROGRAMADA"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900 dark:text-white">
                        {item.attendees_count} alumnos
                      </td>
                      <td className="py-3.5 px-4 text-center text-neutral-600 dark:text-neutral-300">
                        {item.total_duration_minutes} min
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenLiveAttendees(item)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-brand-blue hover:bg-blue-100 rounded-lg font-bold text-[11px] transition-colors border-none cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Asistentes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Lesson Videos Breakdown */}
        {subTab === "lessons" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Lección</th>
                  <th className="py-3 px-4">Curso</th>
                  <th className="py-3 px-4 text-center">Vistas Totales</th>
                  <th className="py-3 px-4 text-center">Completadas</th>
                  <th className="py-3 px-4 text-center">Promedio Visto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No se encontraron reproducciones de lecciones.
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <PlayCircle className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                        {item.lesson_title}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 font-medium">
                        {item.course_title}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900 dark:text-white">
                        {item.views_count}
                      </td>
                      <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.completed_count}
                      </td>
                      <td className="py-3.5 px-4 text-center text-neutral-600 dark:text-neutral-300">
                        {item.avg_watch_minutes} min
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Student Timeline */}
        {subTab === "students" && (
          <div className="space-y-3">
            {filteredTimeline.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No se encontraron actividades registradas.
              </div>
            ) : (
              filteredTimeline.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 hover:border-brand-blue/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {item.user_avatar ? (
                        <img src={item.user_avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        item.user_name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {item.user_name}
                        </span>
                        <span className="text-[11px] text-neutral-400">({item.user_email})</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-0.5 flex items-center gap-1.5">
                        {item.type === "live_attendance" ? (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                            <Radio className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-brand-blue font-semibold">
                            <PlayCircle className="w-3 h-3" /> Lección
                          </span>
                        )}
                        <span>{item.title}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {item.duration_minutes} min conectados
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(item.timestamp).toLocaleString("es-CL", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Attendees Detail Modal */}
      <AnimatePresence>
        {attendeesModalOpen && selectedLiveClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                    <Radio className="w-3 h-3" /> Asistencia a Clase en Vivo
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                    {selectedLiveClass.title}
                  </h3>
                </div>
                <button
                  onClick={() => setAttendeesModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-600 flex items-center justify-center border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loadingAttendees ? (
                <div className="py-16 text-center text-neutral-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                  <span className="text-xs">Cargando lista de alumnos asistentes...</span>
                </div>
              ) : attendeesList.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  No hay asistencias registradas para esta clase aún.
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
                  {attendeesList.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
                          {record.profile?.avatar_url ? (
                            <img src={record.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (record.profile?.full_name || record.profile?.email || "U").substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {record.profile?.full_name || "Estudiante"}
                          </p>
                          <p className="text-[11px] text-neutral-400">{record.profile?.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                          {Math.max(1, Math.round(record.duration_seconds / 60))} min conectados
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Ingreso: {new Date(record.joined_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
