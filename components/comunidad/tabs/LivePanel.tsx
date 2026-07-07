"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Radio, 
  Video, 
  VideoOff, 
  Tv, 
  Play, 
  PlayCircle,
  Loader2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Film,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  room_name: string;
  status: 'scheduled' | 'active' | 'completed';
  youtube_stream_key: string | null;
  youtube_video_id: string | null;
  livekit_egress_id: string | null;
  scheduled_at: string;
}

// Polling interval when there's a scheduled class (check more often for status changes)
const POLL_INTERVAL_ACTIVE = 10_000;   // 10s â€” detect when admin starts class
const POLL_INTERVAL_IDLE = 30_000;     // 30s â€” idle background refresh

export default function LivePanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isWatchingLive, setIsWatchingLive] = useState(false);

  // Form states for creating a class
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomName, setRoomName] = useState("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form for adding completed class recording
  const [showAddRecording, setShowAddRecording] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingDescription, setRecordingDescription] = useState("");
  const [recordingVideoId, setRecordingVideoId] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [submittingRecording, setSubmittingRecording] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // â”€â”€â”€ Reliable admin check via server API (bypasses RLS) â”€â”€â”€
  const checkAdmin = useCallback(async () => {
    try {
      const res = await fetch("/api/live/check-admin");
      const data = await res.json();
      setIsAdmin(!!data.isAdmin);
      setAdminChecked(true);
      return !!data.isAdmin;
    } catch (err) {
      console.error("Error checking admin status:", err);
      setAdminChecked(true);
      return false;
    }
  }, []);

  // â”€â”€â”€ Fetch active/scheduled live classes â”€â”€â”€
  const fetchClassInfo = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: classes, error: classError } = await supabase
        .from("live_classes")
        .select("*")
        .in("status", ["active", "scheduled"])
        .order("status", { ascending: false })
        .order("scheduled_at", { ascending: true })
        .limit(1);

      if (classError) throw classError;
      setActiveClass(classes && classes.length > 0 ? classes[0] : null);

      // Fetch completed classes (recordings)
      const { data: completed, error: completedError } = await supabase
        .from("live_classes")
        .select("*")
        .eq("status", "completed")
        .order("scheduled_at", { ascending: false })
        .limit(10);

      if (completedError) throw completedError;
      setCompletedClasses(completed || []);

      setError(null);
    } catch (err: any) {
      console.error("Error fetching live classes:", err);
      setError("No se pudieron cargar las clases en vivo.");
    }
  }, []);

  // ——— Initial load: check admin + fetch classes ———
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([checkAdmin(), fetchClassInfo()]);
      setLoading(false);
    };
    init();
  }, [checkAdmin, fetchClassInfo]);

  // ─── Auto-polling to detect class status changes ───
  useEffect(() => {
    if (isWatchingLive) return; // Don't poll while watching stream

    const interval = activeClass?.status === "scheduled" ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_IDLE;

    pollRef.current = setInterval(() => {
      fetchClassInfo();
    }, interval);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isWatchingLive, activeClass?.status, fetchClassInfo]);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([checkAdmin(), fetchClassInfo()]);
    setLoading(false);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !roomName.trim() || !scheduledAt) return;
    setSubmitting(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data, error: insertError } = await supabase
        .from("live_classes")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          room_name: roomName.trim().replace(/\s+/g, "-").toLowerCase(),
          youtube_stream_key: youtubeKey.trim() || null,
          scheduled_at: new Date(scheduledAt).toISOString(),
          status: "scheduled"
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Broadcast notification to all enrolled users
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

      setActiveClass(data);
      setTitle("");
      setDescription("");
      setRoomName("");
      setYoutubeKey("");
      setScheduledAt("");
    } catch (err: any) {
      setError("Error al agendar clase: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartClass = async () => {
    if (!activeClass) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: startError } = await supabase
        .from("live_classes")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", activeClass.id);

      if (startError) throw startError;
      await fetchClassInfo();
      setIsWatchingLive(true);
    } catch (err: any) {
      setError("Error al iniciar clase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = () => {
    setIsWatchingLive(true);
  };

  const handleCompleteClass = async () => {
    if (!activeClass || !confirm("¿Estás seguro de finalizar la clase? Esto la moverá al historial de clases grabadas.")) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: completeError } = await supabase
        .from("live_classes")
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("id", activeClass.id);

      if (completeError) throw completeError;
      setIsWatchingLive(false);
      await fetchClassInfo();
    } catch (err: any) {
      setError("Error al finalizar clase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€â”€ Add completed class recording (admin only) â”€â”€â”€
  const handleAddRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingTitle.trim() || !recordingVideoId.trim() || !recordingDate) return;
    setSubmittingRecording(true);
    setError(null);

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

      // Refresh completed classes list
      await fetchClassInfo();
      
      // Reset form
      setRecordingTitle("");
      setRecordingDescription("");
      setRecordingVideoId("");
      setRecordingDate("");
      setShowAddRecording(false);
    } catch (err: any) {
      setError("Error al agregar grabación: " + err.message);
    } finally {
      setSubmittingRecording(false);
    }
  };

  // â”€â”€â”€ Loading state â”€â”€â”€
  if (loading && !adminChecked) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Cargando transmisión...</span>
      </div>
    );
  }

  // ─── CASE 1: ACTIVE WATCHING WORKSPACE (YouTube Live Broadcast) ───
  if (isWatchingLive && activeClass) {
    return (
      <div className="max-w-4xl mx-auto p-2 sm:p-4 select-none">
        {/* Immersive YouTube Live Workspace */}
        <div className="w-full bg-neutral-950 rounded-3xl border border-neutral-900 overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col gap-4">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4 select-none">
            <div className="flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                En Vivo
              </span>
              <h2 className="font-bold text-base text-white truncate max-w-[280px] sm:max-w-[450px]">
                {activeClass.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={handleCompleteClass}
                  className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all active:scale-[0.98] select-none"
                >
                  Finalizar Clase
                </button>
              )}
              <button
                onClick={() => setIsWatchingLive(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-all active:scale-[0.98] select-none"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-neutral-900">
            {activeClass.youtube_video_id ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeClass.youtube_video_id}?autoplay=1&rel=0`}
                title="YouTube Live Broadcast"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="border-0"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 gap-2">
                <VideoOff className="w-10 h-10 text-neutral-600" />
                <span className="text-xs font-semibold">El administrador no ha especificado un ID de video de YouTube para el Live.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-2 select-none">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 cursor-pointer"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refresh button (top right) */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-350 transition-colors disabled:opacity-40 cursor-pointer bg-transparent border-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Active or Scheduled class banner */}
      {activeClass ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 shadow-sm overflow-hidden"
        >
          {/* Hero area with gradient background */}
          <div className={`relative px-6 sm:px-8 py-8 overflow-hidden ${
            activeClass.status === "active" 
              ? "bg-gradient-to-br from-red-500/5 via-rose-500/5 to-neutral-50/10 dark:from-red-950/10 dark:via-rose-950/5 dark:to-neutral-950/20" 
              : "bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-neutral-50/10 dark:from-sky-950/10 dark:via-blue-950/5 dark:to-neutral-950/20"
          }`}>
            {/* Decorative blur circle */}
            <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.15] blur-3xl ${
              activeClass.status === "active" ? "bg-red-500" : "bg-[#1890ff]"
            }`} />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Status + meta */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {activeClass.status === "active" ? (
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      En Vivo Ahora
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3 h-3" />
                      Programada
                    </span>
                  )}
                  <span className="text-xs text-neutral-650 dark:text-neutral-350 font-bold flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-800/30 px-2.5 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-[#1890ff]" />
                    {new Date(activeClass.scheduled_at).toLocaleDateString("es-CL", { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs text-neutral-650 dark:text-neutral-350 font-bold flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/30 dark:border-neutral-800/30 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#1890ff]" />
                    {new Date(activeClass.scheduled_at).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2">{activeClass.title}</h2>
                {activeClass.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">{activeClass.description}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                {isAdmin && activeClass.status === "scheduled" && (
                  <button 
                    onClick={handleStartClass}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <Play className="w-4 h-4" /> Iniciar Clase
                  </button>
                )}
                {activeClass.status === "active" && (
                  <button 
                    onClick={handleJoinClass}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1890ff] hover:bg-blue-600 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer active:scale-95 transition-transform"
                  >
                    <Tv className="w-4 h-4" />
                    Unirse a la Clase
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 shadow-sm overflow-hidden"
        >
          <div className="relative px-6 sm:px-8 py-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1890ff]/5 via-white to-transparent dark:from-[#1890ff]/5 dark:via-neutral-950 dark:to-transparent" />
            <div className="absolute top-6 left-8 w-24 h-24 bg-blue-200 rounded-full opacity-[0.07] blur-2xl" />
            <div className="absolute bottom-6 right-8 w-32 h-32 bg-indigo-200 rounded-full opacity-[0.07] blur-2xl" />
            
            <div className="relative z-10">
              <div className="bg-[#1890ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm w-[72px] h-[72px]">
                <Radio className="w-9 h-9 text-[#1890ff]" />
              </div>
              <h2 className="font-display font-black text-xl text-neutral-900 dark:text-white mb-2">No hay clases en vivo</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                Cuando haya una clase programada, podrás unirte a la transmisión en directo desde aquí.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Admin Panel to schedule live class */}
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white mb-1">Agendar Nueva Masterclass</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Programa una sesión en vivo para los alumnos.</p>
          </div>

          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Título de la Clase *</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Ej. Masterclass SQL Server Avanzado" 
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Nombre de Sala de LiveKit (Única) *</label>
                <input 
                  type="text" 
                  required 
                  value={roomName} 
                  onChange={e => setRoomName(e.target.value)} 
                  placeholder="ej. masterclass-sql-01" 
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Indica de qué tratará la clase..." 
                className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all resize-none min-h-[60px]" 
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Clave de Transmisión de YouTube Live (Opcional)</label>
                <input 
                  type="password" 
                  value={youtubeKey} 
                  onChange={e => setYoutubeKey(e.target.value)} 
                  placeholder="Clave de stream RTMP" 
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Fecha y Hora Programada *</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={scheduledAt} 
                  onChange={e => setScheduledAt(e.target.value)} 
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 bg-[#1890ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                {submitting ? "Agendando..." : "Agendar Masterclass"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ─── COMPLETED CLASSES (RECORDINGS) SECTION ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white mb-1">Clases Grabadas</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Revisa las masterclasses anteriores cuando quieras.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddRecording(!showAddRecording)}
              className="px-4 py-2 bg-[#1890ff] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
            >
              {showAddRecording ? "Cancelar" : "Agregar Grabación"}
            </button>
          )}
        </div>

        {/* Admin form to add recording */}
        <AnimatePresence>
          {isAdmin && showAddRecording && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddRecording}
              className="mb-6 p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Título de la Grabación *</label>
                  <input 
                    type="text" 
                    required 
                    value={recordingTitle} 
                    onChange={e => setRecordingTitle(e.target.value)} 
                    placeholder="Ej. Masterclass SQL Server - Sesión 1" 
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">ID de Video de YouTube *</label>
                  <input 
                    type="text" 
                    required 
                    value={recordingVideoId} 
                    onChange={e => setRecordingVideoId(e.target.value)} 
                    placeholder="Ej. dQw4w9WgXcQ" 
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                <textarea 
                  value={recordingDescription} 
                  onChange={e => setRecordingDescription(e.target.value)} 
                  placeholder="Breve descripción del contenido de la clase..." 
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all resize-none min-h-[60px]" 
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mb-1.5">Fecha de la Clase *</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={recordingDate} 
                  onChange={e => setRecordingDate(e.target.value)} 
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-sm focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/20 text-neutral-900 dark:text-white outline-none transition-all" 
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={submittingRecording}
                  className="px-6 py-3 bg-[#1890ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
                >
                  {submittingRecording ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  {submittingRecording ? "Agregando..." : "Agregar Grabación"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Recordings grid */}
        {completedClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedClasses.map((recording, index) => (
              <RecordingCard key={recording.id} recording={recording} index={index} onPlay={(videoId) => setActiveVideoId(videoId)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative mx-auto mb-5 w-[72px] h-[72px]">
              <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Film className="w-8 h-8 text-neutral-350 dark:text-neutral-700" />
              </div>
            </div>
            <h4 className="font-display font-black text-lg text-neutral-900 dark:text-white mb-1.5">Sin grabaciones aún</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
              Las masterclasses grabadas aparecerán aquí para que las revises cuando quieras.
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddRecording(true)}
                className="mt-5 px-5 py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all mx-auto border-none cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Agregar primera grabación
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Immersive Video Modal */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideoId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-neutral-950 rounded-3xl border border-neutral-800/80 w-full max-w-4xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white hover:bg-black/80 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video w-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                  title="Reproductor de Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── RECORDING CARD ───
function RecordingCard({ recording, index, onPlay }: { recording: LiveClass; index: number; onPlay: (id: string) => void }) {
  const hasVideo = !!recording.youtube_video_id;
  const [imgSrc, setImgSrc] = useState(
    recording.youtube_video_id 
      ? `https://img.youtube.com/vi/${recording.youtube_video_id}/maxresdefault.jpg`
      : null
  );
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (!imgError && recording.youtube_video_id) {
      setImgError(true);
      setImgSrc(`https://img.youtube.com/vi/${recording.youtube_video_id}/hqdefault.jpg`);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasVideo && recording.youtube_video_id) {
      e.preventDefault();
      onPlay(recording.youtube_video_id);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-850/80 shadow-sm hover:shadow-xl hover:border-[#1890ff]/20 transition-all duration-300 flex flex-col h-full cursor-pointer select-none"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900">
        {imgSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgSrc}
              alt={recording.title}
              onError={handleImgError}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 group-hover:from-black/20 transition-colors" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-850 flex items-center justify-center">
            <Film className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
          </div>
        )}

        {/* Play overlay */}
        {hasVideo && (
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <PlayCircle className="w-7 h-7 text-[#1890ff]" />
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Video className="w-3 h-3 text-[#1890ff]" />
            Grabación
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-bold text-[15px] text-neutral-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#1890ff] transition-colors">
          {recording.title}
        </h4>
        
        {recording.description && (
          <p className="text-xs text-neutral-550 dark:text-neutral-450 leading-relaxed line-clamp-2 mb-3">
            {recording.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(recording.scheduled_at).toLocaleDateString("es-CL", { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
          
          {hasVideo ? (
            <span className="text-[10px] font-bold text-[#1890ff] flex items-center gap-0.5 group-hover:gap-1.5 transition-all bg-blue-500/10 dark:bg-blue-500/5 px-2.5 py-1 rounded-full">
              Ver ahora <ExternalLink className="w-3 h-3" />
            </span>
          ) : (
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-full">
              Sin video
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
