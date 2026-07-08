"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Radio, 
  Video, 
  VideoOff, 
  Tv, 
  Play, 
  Loader2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Film,
  X,
  Lock
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
  const [selectedShowcaseClass, setSelectedShowcaseClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isWatchingLive, setIsWatchingLive] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-select showcase class when data loads
  useEffect(() => {
    if (!selectedShowcaseClass) {
      if (activeClass) {
        setSelectedShowcaseClass(activeClass);
      } else if (completedClasses.length > 0) {
        setSelectedShowcaseClass(completedClasses[0]);
      }
    }
  }, [activeClass, completedClasses, selectedShowcaseClass]);

  // ——— Reliable admin check via server API (bypasses RLS) ———
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

  // ——— Fetch active/scheduled live classes ———
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

  // Clock ticker to reactively update countdowns and join buttons
  useEffect(() => {
    const clock = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const getCountdown = (scheduledAt: string) => {
    const diff = new Date(scheduledAt).getTime() - nowMs;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

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
      {selectedShowcaseClass ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Main Showcase Card & Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Scenario 1: Live Class is Streaming Right Now */}
            {selectedShowcaseClass.status === "active" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
              >
                {/* Left Section: Live Video Embed */}
                <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full rounded-2xl overflow-hidden z-10">
                  {selectedShowcaseClass.youtube_video_id ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedShowcaseClass.youtube_video_id}?autoplay=1&mute=1&rel=0`}
                      title="YouTube Live Stream"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-none rounded-2xl"
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
                      {selectedShowcaseClass.title}
                    </h2>
                    {selectedShowcaseClass.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {selectedShowcaseClass.description}
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
            )}

            {/* Scenario 2: Upcoming Scheduled Class */}
            {selectedShowcaseClass.status === "scheduled" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
              >
                {/* Left Section: Graphic Placeholder */}
                <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center overflow-hidden border border-neutral-200/60 dark:border-neutral-800 select-none z-10">
                  <Calendar className="w-16 h-16 text-[#1890ff]/20 dark:text-[#1890ff]/10 animate-pulse relative z-10" />
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
                        {new Date(selectedShowcaseClass.scheduled_at).toLocaleDateString("es-CL", { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-xs text-neutral-655 dark:text-neutral-455 font-bold flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-2.5 py-1 rounded-full select-none">
                        <Clock className="w-3.5 h-3.5 text-[#1890ff]" />
                        {new Date(selectedShowcaseClass.scheduled_at).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2.5">
                      {selectedShowcaseClass.title}
                    </h2>
                    {selectedShowcaseClass.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {selectedShowcaseClass.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col items-start gap-4 w-full">
                    <div className="w-full">
                      <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2 select-none">Inicia en:</span>
                      {(() => {
                        const cd = getCountdown(selectedShowcaseClass.scheduled_at);
                        return (
                          <div className="grid grid-cols-4 gap-2.5 max-w-xs select-none">
                            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                              <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{cd.days}</span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Días</span>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                              <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{cd.hours}</span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Horas</span>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                              <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{cd.minutes}</span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Mins</span>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-center flex flex-col items-center min-w-[65px] rounded-xl p-2.5 shadow-sm">
                              <span className="text-xl font-black text-neutral-900 dark:text-white leading-none">{cd.seconds}</span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-1">Segs</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full">
                      {(() => {
                        const isUnlocked = nowMs >= (new Date(selectedShowcaseClass.scheduled_at).getTime() - 10 * 60 * 1000);
                        return isUnlocked ? (
                          <button 
                            onClick={handleJoinClass}
                            className="w-full sm:w-auto px-6 py-3 bg-[#1890ff] hover:bg-blue-600 active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
                          >
                            <Tv className="w-4 h-4" />
                            Unirse a la Clase (En Vivo)
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="w-full sm:w-auto px-6 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Unirse a la Clase (Disponible 10 min antes)
                          </button>
                        );
                      })()}

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
                </div>
              </motion.div>
            )}

            {/* Scenario 3: Completed Class Recording Showcase */}
            {selectedShowcaseClass.status === "completed" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-850/80 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 min-h-[300px]"
              >
                {/* Left Section: YouTube Thumbnail with Play Button Overlay */}
                <div 
                  onClick={() => selectedShowcaseClass.youtube_video_id && setActiveVideoId(selectedShowcaseClass.youtube_video_id)}
                  className="w-full md:w-[48%] lg:w-[45%] shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-full rounded-2xl overflow-hidden cursor-pointer group z-10"
                >
                  {selectedShowcaseClass.youtube_video_id ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://img.youtube.com/vi/${selectedShowcaseClass.youtube_video_id}/maxresdefault.jpg`}
                        alt={selectedShowcaseClass.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${selectedShowcaseClass.youtube_video_id!}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors z-10" />
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                          <Play className="w-5 h-5 text-[#1890ff] fill-[#1890ff]/20 ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center rounded-2xl">
                      <Film className="w-12 h-12 text-neutral-350 dark:text-neutral-700" />
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
                        {getTimeAgo(selectedShowcaseClass.scheduled_at)}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight mb-2.5">
                      {selectedShowcaseClass.title}
                    </h2>
                    {selectedShowcaseClass.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {selectedShowcaseClass.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    {selectedShowcaseClass.youtube_video_id && (
                      <button 
                        onClick={() => setActiveVideoId(selectedShowcaseClass.youtube_video_id!)}
                        className="w-full sm:w-auto px-6 py-3 bg-[#1890ff] hover:bg-blue-600 active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white/20" />
                        Ver Grabación de la Clase
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Classes Playlist (Sidebar) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="px-1">
              <h4 className="font-display font-black text-xs text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
                Índice de Clases
              </h4>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Selecciona una clase para reproducirla
              </p>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1.5 custom-scrollbar">
              {(() => {
                const allPlaylistClasses = [
                  ...(activeClass ? [activeClass] : []),
                  ...completedClasses.filter(c => c.id !== activeClass?.id)
                ];

                return allPlaylistClasses.map((item) => {
                  const isCurrentlyShowcased = selectedShowcaseClass.id === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedShowcaseClass(item)}
                      className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-all border select-none ${
                        isCurrentlyShowcased 
                          ? "bg-blue-500/5 dark:bg-blue-500/5 border-[#1890ff] shadow-sm animate-fade-in" 
                          : "bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 border-neutral-200/80 dark:border-neutral-850/80"
                      }`}
                    >
                      {/* Left Mini-Thumbnail */}
                      <div className="w-20 aspect-[16/10] shrink-0 bg-neutral-105 dark:bg-neutral-900 rounded-lg overflow-hidden relative border border-neutral-200/60 dark:border-neutral-800/60 select-none">
                        {item.youtube_video_id ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={`https://img.youtube.com/vi/${item.youtube_video_id}/hqdefault.jpg`}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                          </div>
                        )}
                        {/* Stream status tag */}
                        {item.status === "active" && (
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-[7px] font-black uppercase px-1 py-0.5 rounded tracking-wider flex items-center gap-0.5">
                            <span className="relative flex h-1 w-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-1 w-1 bg-white" />
                            </span>
                            LIVE
                          </span>
                        )}
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h5 className={`font-bold text-[11px] leading-snug line-clamp-2 ${isCurrentlyShowcased ? "text-[#1890ff]" : "text-neutral-800 dark:text-neutral-200"}`}>
                          {item.title}
                        </h5>
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold block mt-1">
                          {item.status === "active" 
                            ? "Transmitiendo ahora" 
                            : item.status === "scheduled" 
                              ? "Clase programada" 
                              : new Date(item.scheduled_at).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
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
