"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Radio,
  RadioTower,
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
  ChevronRight,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  room_name: string;
  status: "scheduled" | "active" | "completed";
  youtube_stream_key: string | null;
  youtube_video_id: string | null;
  livekit_egress_id: string | null;
  scheduled_at: string;
}

// Polling interval when there's a scheduled class (check more often for status changes)
const POLL_INTERVAL_ACTIVE = 10_000; // 10s — detect when admin starts class
const POLL_INTERVAL_IDLE = 30_000; // 30s — idle background refresh
const UNLOCK_WINDOW_MS = 10 * 60 * 1000; // join button unlocks 10 min before start

const getTimeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `Hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;
  if (diffHours > 0) return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`;
  if (diffMins > 0) return `Hace ${diffMins} minuto${diffMins === 1 ? "" : "s"}`;
  return "Hace unos instantes";
};

// ─── Reusable: countdown digit ───
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-3 sm:px-5 py-2.5 first:pl-0">
      <span className="font-display text-3xl sm:text-4xl font-black tabular-nums text-neutral-900 dark:text-white leading-none tracking-tight">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500 font-bold mt-2">
        {label}
      </span>
    </div>
  );
}

// ─── Reusable: secondary meta pill (date / time) ───
function MetaPill({ icon: Icon, children }: { icon: typeof Calendar; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-3 py-1.5 rounded-full select-none">
      <Icon className="w-3.5 h-3.5 text-brand-blue" />
      {children}
    </span>
  );
}

// ─── Reusable: hero thumbnail with auto fallback (maxres → hq) ───
function HeroThumbnail({
  youtubeId,
  placeholderIcon: Icon,
}: {
  youtubeId: string | null;
  placeholderIcon: typeof Film;
}) {
  const [src, setSrc] = useState(youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);
  const [errored, setErrored] = useState(false);
  const handleError = () => {
    if (!errored && youtubeId) {
      setErrored(true);
      setSrc(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
    }
  };
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
        <Icon className="w-12 h-12 text-white/25" />
      </div>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        onError={handleError}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </>
  );
}

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
  const [playbackClass, setPlaybackClass] = useState<LiveClass | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "notes">("about");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [nowMs, setNowMs] = useState(Date.now());

  // Clock ticker to reactively update countdowns and join buttons
  useEffect(() => {
    const clock = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Load notes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("live_classes_notes");
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleSaveNote = (classId: string, val: string) => {
    const nextNotes = { ...notes, [classId]: val };
    setNotes(nextNotes);
    localStorage.setItem("live_classes_notes", JSON.stringify(nextNotes));
  };

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Reliable admin check via server API (bypasses RLS) ───
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

  // ─── Fetch active/scheduled live classes ───
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

  // ─── Initial load: check admin + fetch classes ───
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

    const interval =
      activeClass?.status === "scheduled" ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_IDLE;

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
    if (
      !activeClass ||
      !confirm("¿Estás seguro de finalizar la clase? Esto la moverá al historial de clases grabadas.")
    )
      return;
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

  // ─── Loading state ───
  if (loading && !adminChecked) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-neutral-400 font-medium">Cargando transmisión...</span>
      </div>
    );
  }

  // ─── CASE 1: ACTIVE WATCHING WORKSPACE (YouTube Live Broadcast) ───
  if (isWatchingLive && activeClass) {
    return (
      <div className="max-w-5xl mx-auto px-1 select-none">
        <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                En Vivo
              </span>
              <h2 className="font-bold text-sm text-white truncate">{activeClass.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && (
                <button
                  onClick={handleCompleteClass}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  Finalizar
                </button>
              )}
              <button
                onClick={() => setIsWatchingLive(false)}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video w-full bg-black">
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
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
                <VideoOff className="w-10 h-10 text-neutral-600" />
                <span className="text-xs font-semibold px-6 text-center">
                  El administrador no ha especificado un ID de video de YouTube para el Live.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── CASE 2: PLAYBACK CLASSROOM (watch a recording) ───
  if (playbackClass) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6 pt-2 select-none"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaybackClass(null)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer text-neutral-600 dark:text-neutral-400 active:scale-95 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm"
              aria-label="Volver"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-brand-blue/10 text-brand-blue text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Clase Grabada
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                  Emitido el{" "}
                  {new Date(playbackClass.scheduled_at).toLocaleDateString("es-CL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-neutral-900 dark:text-white leading-tight mt-1">
                {playbackClass.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Classroom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Video & Details Panel */}
          <div className="lg:col-span-8 space-y-5">
            {/* Player Container */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-200 dark:border-neutral-800 shadow-sm relative">
              {playbackClass.youtube_video_id ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${playbackClass.youtube_video_id}?autoplay=1&rel=0`}
                  title={playbackClass.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 bg-neutral-950 gap-2">
                  <VideoOff className="w-10 h-10" />
                  <span className="text-xs font-semibold">Video no disponible</span>
                </div>
              )}
            </div>

            {/* Tabs & Details */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex gap-5 border-b border-neutral-100 dark:border-neutral-900 pb-3 mb-4">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 ${
                    activeTab === "about"
                      ? "text-brand-blue border-b-2 border-brand-blue -mb-[13px]"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  Descripción general
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 ${
                    activeTab === "notes"
                      ? "text-brand-blue border-b-2 border-brand-blue -mb-[13px]"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  Mis apuntes
                </button>
              </div>

              {activeTab === "about" ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Acerca de esta clase
                  </h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {playbackClass.description || "Esta clase no tiene descripción adicional."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Notas personales
                    </h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 rounded-full">
                      Guardado localmente
                    </span>
                  </div>
                  <textarea
                    value={notes[playbackClass.id] || ""}
                    onChange={(e) => handleSaveNote(playbackClass.id, e.target.value)}
                    placeholder="Escribe aquí tus ideas, notas clave o apuntes de esta clase para tenerlos siempre a mano..."
                    className="w-full min-h-[140px] text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-y"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Playlist of Recordings */}
          <div className="lg:col-span-4 space-y-3 select-none">
            <div className="px-1">
              <h4 className="font-display font-black text-xs text-neutral-900 dark:text-white uppercase tracking-wider mb-1">
                Índice de Grabaciones
              </h4>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Selecciona otra clase del historial para reproducirla
              </p>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1.5 custom-scrollbar">
              {completedClasses.map((item) => {
                const isActive = playbackClass.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPlaybackClass(item)}
                    className={`w-full flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all border text-left ${
                      isActive
                        ? "bg-brand-blue/5 dark:bg-brand-blue/5 border-brand-blue shadow-sm"
                        : "bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800/80"
                    }`}
                  >
                    <div className="w-24 aspect-[16/10] shrink-0 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden relative border border-neutral-200/60 dark:border-neutral-800/60">
                      {item.youtube_video_id ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://img.youtube.com/vi/${item.youtube_video_id}/hqdefault.jpg`}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h5
                        className={`font-bold text-[11px] leading-snug line-clamp-2 ${
                          isActive ? "text-brand-blue" : "text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        {item.title}
                      </h5>
                      <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold block mt-1">
                        {new Date(item.scheduled_at).toLocaleDateString("es-CL", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── MAIN VIEW ───
  return (
    <div className="max-w-5xl mx-auto space-y-10 pt-2 select-none">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl p-4 flex items-start gap-3"
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

      {/* ─── FEATURED CARD: Próxima clase o última clase ─── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-1"
        >
          <span className="font-display font-black text-lg text-neutral-900 dark:text-white">
            Destacado
          </span>
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        {activeClass ? (
          activeClass.status === "active" ? (
            /* ─── ACTIVE: tarjeta destacada de la clase en vivo ─── */
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* Thumbnail + LIVE badge */}
              <div className="relative md:w-[42%] shrink-0 aspect-video md:aspect-auto cursor-pointer overflow-hidden">
                <HeroThumbnail youtubeId={activeClass.youtube_video_id} placeholderIcon={Film} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    En Vivo Ahora
                  </span>
                </div>
                <button
                  onClick={handleJoinClass}
                  className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                  aria-label="Unirse a la clase"
                >
                  <span className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Tv className="w-6 h-6 text-neutral-900" />
                  </span>
                </button>
              </div>

              {/* Info + actions */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col">
                <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight">
                  {activeClass.title}
                </h2>
                {activeClass.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-2">
                    {activeClass.description}
                  </p>
                )}
                <div className="mt-auto pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleJoinClass}
                    className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-glow-brand flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <Tv className="w-4 h-4" />
                    Unirse a la Clase
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleStartClass}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Iniciar Clase
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ) : (
            /* ─── SCHEDULED: tarjeta destacada de la próxima clase ─── */
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row"
            >
              {/* Designed placeholder for scheduled state */}
              <div className="relative md:w-[42%] shrink-0 aspect-video md:aspect-auto bg-neutral-900 dot-pattern overflow-hidden flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(24,144,255,0.18) 0%, rgba(15,23,42,0) 60%)",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center backdrop-blur-sm">
                    <RadioTower className="w-8 h-8 text-brand-blue" />
                  </div>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">
                    Próxima transmisión
                  </span>
                </div>
              </div>

              {/* Info + countdown + actions */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Clase Programada
                  </span>
                  <MetaPill icon={Calendar}>
                    {new Date(activeClass.scheduled_at).toLocaleDateString("es-CL", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </MetaPill>
                  <MetaPill icon={Clock}>
                    {new Date(activeClass.scheduled_at).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </MetaPill>
                </div>

                <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight">
                  {activeClass.title}
                </h2>
                {activeClass.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-2">
                    {activeClass.description}
                  </p>
                )}

                {/* Countdown — horizontal broadcast-style */}
                <div className="mt-5 flex items-center divide-x divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-100 dark:border-neutral-900 py-3">
                  <CountdownUnit value={countdown.days} label="Días" />
                  <CountdownUnit value={countdown.hours} label="Horas" />
                  <CountdownUnit value={countdown.minutes} label="Mins" />
                  <CountdownUnit value={countdown.seconds} label="Segs" />
                </div>

                <div className="mt-auto pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {(() => {
                    const isUnlocked =
                      nowMs >= new Date(activeClass.scheduled_at).getTime() - UNLOCK_WINDOW_MS;
                    return isUnlocked ? (
                      <button
                        onClick={handleJoinClass}
                        className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark active:scale-[0.98] text-white font-black text-xs rounded-xl transition-all shadow-glow-brand flex items-center justify-center gap-2 border-none cursor-pointer"
                      >
                        <Tv className="w-4 h-4" />
                        Unirse a la Clase
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Disponible 10 min antes
                      </button>
                    );
                  })()}

                  {isAdmin && (
                    <button
                      onClick={handleStartClass}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Iniciar Clase
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          )
        ) : completedClasses[0] ? (
          /* ─── COMPLETED: tarjeta destacada de la última clase emitida ─── */
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row ${
              completedClasses[0].youtube_video_id ? "cursor-pointer active:scale-[0.99]" : ""
            }`}
            onClick={() =>
              completedClasses[0].youtube_video_id && setPlaybackClass(completedClasses[0])
            }
          >
            {/* Thumbnail */}
            <div className="relative md:w-[42%] shrink-0 aspect-video md:aspect-auto overflow-hidden">
              <HeroThumbnail
                youtubeId={completedClasses[0].youtube_video_id}
                placeholderIcon={Film}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                  <Video className="w-3 h-3 text-brand-blue" />
                  Última Clase
                </span>
              </div>
              {completedClasses[0].youtube_video_id && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-7 h-7 text-neutral-900" />
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold bg-neutral-100/70 dark:bg-neutral-900 px-3 py-1.5 rounded-full">
                  {getTimeAgo(completedClasses[0].scheduled_at)}
                </span>
              </div>

              <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight">
                {completedClasses[0].title}
              </h2>
              {completedClasses[0].description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-2">
                  {completedClasses[0].description}
                </p>
              )}

              {completedClasses[0].youtube_video_id && (
                <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-blue group-hover:gap-2 transition-all">
                  <Play className="w-4 h-4 fill-brand-blue/30" />
                  Ver Grabación
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </motion.article>
        ) : (
          /* ─── EMPTY: no hay transmisiones ─── */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm overflow-hidden"
          >
            <div className="px-6 sm:px-8 py-16 text-center">
              <div className="bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-5 w-16 h-16">
                <Radio className="w-8 h-8 text-brand-blue" />
              </div>
              <h2 className="font-display font-black text-xl text-neutral-900 dark:text-white mb-2">
                No hay transmisiones registradas
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                Las próximas clases en vivo y grabaciones aparecerán en esta sección.
              </p>
            </div>
          </motion.div>
        )}
      </section>

      {/* ─── COMPLETED CLASSES (RECORDINGS) SECTION ─── */}
      <section className="space-y-5">
        <div className="px-1">
          <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white mb-1">
            Clases Grabadas
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Revisa las clases anteriores cuando quieras.
          </p>
        </div>

        {/* Recordings grid */}
        {completedClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedClasses.map((recording, index) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                index={index}
                onPlay={(cls) => setPlaybackClass(cls)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 p-12 text-center shadow-sm">
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-5 w-16 h-16">
              <Film className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h4 className="font-display font-black text-lg text-neutral-900 dark:text-white mb-1.5">
              Sin grabaciones aún
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
              Las clases grabadas aparecerán aquí para que las revises cuando quieras.
            </p>
          </div>
        )}
      </section>

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
              className="bg-neutral-950 rounded-2xl border border-neutral-800/80 w-full max-w-4xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white hover:bg-black/80 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                aria-label="Cerrar"
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
function RecordingCard({
  recording,
  index,
  onPlay,
}: {
  recording: LiveClass;
  index: number;
  onPlay: (cls: LiveClass) => void;
}) {
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
      onPlay(recording);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`group bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 transition-all duration-300 flex flex-col h-full ${
        hasVideo ? "hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer active:scale-[0.99]" : ""
      }`}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-colors" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
            <Film className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
          </div>
        )}

        {/* Play overlay */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <PlayCircle className="w-7 h-7 text-neutral-900" />
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-neutral-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider border border-white/10">
            <Video className="w-2.5 h-2.5 text-brand-blue" />
            Grabación
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
          {recording.title}
        </h4>

        {recording.description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2 mt-1.5">
            {recording.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(recording.scheduled_at).toLocaleDateString("es-CL", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {hasVideo ? (
            <span className="text-[11px] font-bold text-brand-blue flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
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
