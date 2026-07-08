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
  Film,
  X,
  ChevronRight
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

const getTimeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
  if (diffHours > 0) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
  if (diffMins > 0) return `Hace ${diffMins} minuto${diffMins === 1 ? '' : 's'}`;
  return 'Hace unos instantes';
};

export default function LivePanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isWatchingLive, setIsWatchingLive] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    } catch (err: unknown) {
      console.error("Error fetching live classes:", err);
      setError("No se pudieron cargar las clases en vivo.");
    }
  }, []);

  // Countdown timer for scheduled classes
  useEffect(() => {
    if (!activeClass || activeClass.status !== "scheduled") return;

    const timer = setInterval(() => {
      const diff = new Date(activeClass.scheduled_at).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        fetchClassInfo();
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeClass, fetchClassInfo]);

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al iniciar clase: " + msg);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError("Error al finalizar clase: " + msg);
    } finally {
      setLoading(false);
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


      {/* Active, Scheduled or Last Emitted class banner */}
      {activeClass ? (
        activeClass.status === "active" ? (
          /* Scenario 1: Live Class is Streaming Right Now */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
          >
            {/* Left Section: Live Video Embed inside Glass Container */}
            <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full bg-neutral-800/80 p-1.5 rounded-2xl overflow-hidden border-2 border-black z-10">
              {activeClass.youtube_video_id ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeClass.youtube_video_id}?autoplay=1&mute=1&rel=0`}
                  title="YouTube Live Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none rounded-xl"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-neutral-900 rounded-xl">
                  <VideoOff className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Señal no disponible</span>
                </div>
              )}
            </div>

            {/* Right Section: Live Texts & Actions */}
            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    En Vivo Ahora
                  </span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2.5">
                  {activeClass.title}
                </h2>
                {activeClass.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {activeClass.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onClick={handleJoinClass}
                  className="w-full sm:w-auto px-6 py-3 bg-[#1890ff] hover:bg-blue-600 active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  Unirse a la Clase (Pantalla Completa)
                </button>
                {isAdmin && (
                  <button 
                    onClick={handleStartClass}
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Iniciar Clase
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Scenario 2: Upcoming Class Scheduled (Countdown) */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
          >
            {/* Left Section: Graphic Placeholder inside Glass Container */}
            <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full bg-neutral-800/80 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-black select-none z-10">
              <Calendar className="w-16 h-16 text-white/20 animate-pulse relative z-10" />
            </div>

            {/* Right Section: Countdown, Date & Texts */}
            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm select-none">
                    <Clock className="w-3 h-3 text-white" />
                    Clase Programada
                  </span>
                  <span className="text-xs text-neutral-650 dark:text-neutral-450 font-bold flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-2.5 py-1 rounded-full select-none">
                    <Calendar className="w-3.5 h-3.5 text-[#1890ff]" />
                    {new Date(activeClass.scheduled_at).toLocaleDateString("es-CL", { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs text-neutral-655 dark:text-neutral-455 font-bold flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-2.5 py-1 rounded-full select-none">
                    <Clock className="w-3.5 h-3.5 text-[#1890ff]" />
                    {new Date(activeClass.scheduled_at).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2.5">
                  {activeClass.title}
                </h2>
                {activeClass.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {activeClass.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col items-start gap-4">
                <div className="w-full">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2 select-none">Inicia en:</span>
                  <div className="grid grid-cols-4 gap-2.5 max-w-xs select-none">
                    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                      <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{countdown.days}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Días</span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                      <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{countdown.hours}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Horas</span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                      <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{countdown.minutes}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Mins</span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                      <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{countdown.seconds}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Segs</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <button 
                    onClick={handleStartClass}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 border-none cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Iniciar Clase
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )
      ) : completedClasses[0] ? (
        /* Scenario 3: No scheduled class. Show last broadcasted class details */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
        >
          {/* Left Section: YouTube Video Player Embed inside Glass Container */}
          <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full bg-neutral-800/80 rounded-2xl overflow-hidden border-2 border-black z-10 p-1.5">
            {completedClasses[0].youtube_video_id ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${completedClasses[0].youtube_video_id}?rel=0`}
                title={completedClasses[0].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none rounded-xl"
              />
            ) : (
              <div className="absolute inset-0 bg-white/10 flex items-center justify-center rounded-xl">
                <Film className="w-12 h-12 text-white/30" />
              </div>
            )}
          </div>

          {/* Right Section: Title, Description & Action */}
          <div className="flex-1 flex flex-col justify-between relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-550 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 border border-neutral-200/50 dark:border-neutral-800/50 select-none">
                  <Video className="w-3.5 h-3.5 text-[#1890ff]" />
                  Última Clase Emitida
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold bg-neutral-50 dark:bg-neutral-900/60 px-2.5 py-1 rounded-full select-none">
                  {getTimeAgo(completedClasses[0].scheduled_at)}
                </span>
              </div>

              <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2.5">
                {completedClasses[0].title}
              </h2>
              {completedClasses[0].description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {completedClasses[0].description}
                </p>
              )}
            </div>

            <div className="mt-6">
              {completedClasses[0].youtube_video_id && (
                <button 
                  onClick={() => setActiveVideoId(completedClasses[0].youtube_video_id!)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#1890ff] hover:bg-blue-600 active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white/20" />
                  Ver Grabación de la Clase
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        /* Scenario 4: No live classes at all */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 shadow-sm overflow-hidden"
        >
          <div className="relative px-6 sm:px-8 py-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1890ff]/5 via-white to-transparent dark:from-[#1890ff]/5 dark:via-neutral-950 dark:to-transparent" />
            <div className="relative z-10">
              <div className="bg-[#1890ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm w-[72px] h-[72px]">
                <Radio className="w-9 h-9 text-[#1890ff]" />
              </div>
              <h2 className="font-display font-black text-xl text-neutral-900 dark:text-white mb-2">No hay transmisiones registradas</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                Las próximas transmisiones y grabaciones aparecerán en esta sección.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── COMPLETED CLASSES (RECORDINGS) SECTION ─── */}
      {/* ─── COMPLETED CLASSES (RECORDINGS) SECTION ─── */}
      <div className="mt-12 space-y-6">
        <div className="px-1 flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white mb-1">Clases Grabadas</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Revisa las masterclasses anteriores cuando quieras.</p>
          </div>
        </div>

        {/* Recordings grid */}
        {completedClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedClasses.map((recording, index) => (
              <RecordingCard key={recording.id} recording={recording} index={index} onPlay={(videoId) => setActiveVideoId(videoId)} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-850/80 p-12 text-center shadow-sm">
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
          </div>
        )}
      </div>

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
      className="group bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col h-full cursor-pointer select-none active:scale-[0.99]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900">
        {imgSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgSrc}
              alt={recording.title}
              onError={handleImgError}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
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
            <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <PlayCircle className="w-6.5 h-6.5 text-neutral-900" />
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-neutral-900 text-white dark:bg-white dark:text-black text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider select-none">
            <Video className="w-2.5 h-2.5 text-[#1890ff]" />
            Grabación
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#0284c7] transition-colors">
          {recording.title}
        </h4>
        
        {recording.description && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2 mb-4">
            {recording.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between select-none">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(recording.scheduled_at).toLocaleDateString("es-CL", { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
          
          {hasVideo ? (
            <span className="text-[10px] font-bold text-neutral-900 dark:text-white flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
              Ver grabación <ChevronRight className="w-3 h-3" />
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
