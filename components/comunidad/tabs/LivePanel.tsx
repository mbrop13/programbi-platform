"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Radio,
  VideoOff,
  Play,
  Calendar,
  Clock,
  AlertCircle,
  Film,
  ChevronRight,
  ChevronLeft,
  Lock,
  Sparkles,
  NotebookPen,
  Info,
  LogOut,
  Square,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

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

type DetailTab = "about" | "notes";

// ─── Constants ───────────────────────────────────────────────────────────────

const POLL_INTERVAL_ACTIVE = 10_000;
const POLL_INTERVAL_IDLE = 30_000;
const UNLOCK_WINDOW_MS = 10 * 60 * 1000;

// ─── Date helpers ────────────────────────────────────────────────────────────

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── YouTube thumbnail with maxres → hq fallback ─────────────────────────────

function YtThumb({
  youtubeId,
  alt = "",
  className = "",
}: {
  youtubeId: string | null;
  alt?: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null
  );
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setSrc(youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);
    setErrored(false);
  }, [youtubeId]);

  const handleError = () => {
    if (!errored && youtubeId) {
      setErrored(true);
      setSrc(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
    }
  };

  if (!src) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-neutral-900 ${className}`}>
        <Film className="w-10 h-10 text-white/20" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      onError={handleError}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}

// ─── Countdown ───────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[4.25rem] sm:min-w-[5rem] px-2.5 sm:px-3 py-3 sm:py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800">
      <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-neutral-900 dark:text-white leading-none tracking-tight">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500 font-semibold mt-1.5">
        {label}
      </span>
    </div>
  );
}

function LiveCountdown({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      <CountdownUnit value={days} label="Días" />
      <CountdownUnit value={hours} label="Horas" />
      <CountdownUnit value={minutes} label="Mins" />
      <CountdownUnit value={seconds} label="Segs" />
    </div>
  );
}

// ─── Meta chips ──────────────────────────────────────────────────────────────

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof Calendar;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 px-3 py-1.5 rounded-full">
      <Icon className="w-3.5 h-3.5 text-brand-blue shrink-0" />
      {children}
    </span>
  );
}

// ─── Status badges ───────────────────────────────────────────────────────────

function LiveBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const pad = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${pad} font-bold uppercase tracking-wider rounded-full bg-rose-500 text-white shadow-sm`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      En vivo
    </span>
  );
}

function StatusBadge({
  variant,
}: {
  variant: "scheduled" | "recording" | "recommended";
}) {
  const styles = {
    scheduled:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20",
    recording:
      "bg-neutral-900/80 text-white border-white/10 backdrop-blur-sm",
    recommended:
      "bg-brand-blue/10 text-brand-blue border-brand-blue/15",
  };
  const labels = {
    scheduled: "Programada",
    recording: "Grabación",
    recommended: "Recomendada",
  };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[variant]}`}
    >
      {labels[variant]}
    </span>
  );
}

// ─── Primary / secondary buttons ─────────────────────────────────────────────

function PrimaryButton({
  onClick,
  disabled,
  children,
  className = "",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${
        disabled
          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800"
          : "bg-brand-blue hover:bg-brand-blue-dark text-white shadow-glow-brand"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({
  onClick,
  children,
  className = "",
  danger,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer border ${
        danger
          ? "border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 bg-transparent"
          : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-950"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────

function LiveSectionHeader({
  hasLiveNow,
  nextHint,
}: {
  hasLiveNow: boolean;
  nextHint?: string | null;
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue">
            <Radio className="w-3.5 h-3.5" />
            En vivo
          </span>
          {hasLiveNow && <LiveBadge size="sm" />}
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight">
          Masterclasses
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
          Clases en directo y grabaciones con el equipo ProgramBI. Power BI, SQL,
          Python, Excel y más — en vivo y a tu ritmo.
        </p>
      </div>
      {nextHint && !hasLiveNow && (
        <div className="shrink-0 self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span className="font-medium">{nextHint}</span>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function LiveSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pt-1 animate-pulse">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-56 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        <div className="h-4 w-full max-w-md bg-neutral-100 dark:bg-neutral-900 rounded" />
      </div>
      <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-2 aspect-video md:aspect-auto md:min-h-[280px] bg-neutral-200 dark:bg-neutral-900" />
          <div className="md:col-span-3 p-6 sm:p-8 space-y-4">
            <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-900 rounded" />
            <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-900 rounded" />
            <div className="flex gap-2 pt-4">
              <div className="h-14 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
              <div className="h-14 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
              <div className="h-14 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
              <div className="h-14 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
            </div>
            <div className="h-11 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-xl mt-4" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950"
          >
            <div className="aspect-video bg-neutral-200 dark:bg-neutral-900" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-[80%] bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-3 w-1/3 bg-neutral-100 dark:bg-neutral-900 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── YouTube embed ───────────────────────────────────────────────────────────

function YoutubePlayer({
  videoId,
  title,
}: {
  videoId: string | null;
  title: string;
}) {
  if (!videoId) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-500">
        <VideoOff className="w-10 h-10 text-neutral-600" />
        <p className="text-xs font-medium text-center px-6 max-w-sm">
          El video de esta clase aún no está disponible.
        </p>
      </div>
    );
  }

  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="absolute inset-0 w-full h-full border-0"
    />
  );
}

// ─── Classroom (live + playback) ─────────────────────────────────────────────

function LiveClassroom({
  session,
  isLive,
  isAdmin,
  completedClasses,
  notes,
  onSaveNote,
  onBack,
  onSelectRecording,
  onCompleteClass,
}: {
  session: LiveClass;
  isLive: boolean;
  isAdmin: boolean;
  completedClasses: LiveClass[];
  notes: Record<string, string>;
  onSaveNote: (classId: string, val: string) => void;
  onBack: () => void;
  onSelectRecording: (cls: LiveClass) => void;
  onCompleteClass?: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>("about");
  const playlist = completedClasses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="max-w-6xl mx-auto space-y-6 pt-1"
    >
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer shadow-sm active:scale-95"
            aria-label="Volver"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isLive ? (
                <LiveBadge size="sm" />
              ) : (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/15">
                  Clase grabada
                </span>
              )}
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                {isLive
                  ? "Transmisión en curso"
                  : `Emitida el ${formatDateShort(session.scheduled_at)}`}
              </span>
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white leading-snug truncate">
              {session.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:pl-4">
          {isLive && isAdmin && onCompleteClass && (
            <GhostButton onClick={onCompleteClass} danger>
              <Square className="w-3.5 h-3.5" />
              Finalizar
            </GhostButton>
          )}
          <GhostButton onClick={onBack}>
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </GhostButton>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-5">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
            <YoutubePlayer videoId={session.youtube_video_id} title={session.title} />
          </div>

          {/* Tabs card */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-1 px-4 sm:px-5 pt-3 border-b border-neutral-100 dark:border-neutral-900">
              {(
                [
                  { id: "about" as const, label: "Descripción", icon: Info },
                  { id: "notes" as const, label: "Mis apuntes", icon: NotebookPen },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer border-none bg-transparent ${
                      active
                        ? "text-brand-blue"
                        : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="classroom-tab"
                        className="absolute left-2 right-2 -bottom-px h-0.5 bg-brand-blue rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-5 sm:p-6">
              {tab === "about" ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                    Acerca de esta clase
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {session.description?.trim() ||
                      "Esta masterclass no tiene descripción adicional. Concéntrate en el contenido y toma apuntes en la pestaña de al lado."}
                  </p>
                  {isLive && (
                    <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                      <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                        Estás en una sesión en vivo. Puedes hacer preguntas al instructor
                        por el canal que indiquen en la transmisión.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                      Notas personales
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 rounded-full">
                      Solo en este dispositivo
                    </span>
                  </div>
                  <textarea
                    value={notes[session.id] || ""}
                    onChange={(e) => onSaveNote(session.id, e.target.value)}
                    placeholder="Ideas clave, fórmulas, dudas o pasos a practicar después de la clase…"
                    className="w-full min-h-[160px] text-sm bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all resize-y"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="px-0.5">
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
              {isLive ? "Biblioteca" : "Índice de grabaciones"}
            </h3>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
              {isLive
                ? "Repasa clases anteriores cuando quieras"
                : "Elige otra sesión del historial"}
            </p>
          </div>

          {playlist.length > 0 ? (
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
              {playlist.map((item) => {
                const isCurrent = !isLive && session.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectRecording(item)}
                    className={`w-full flex gap-3 p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isCurrent
                        ? "bg-brand-blue/[0.06] border-brand-blue/40 shadow-sm"
                        : "bg-white dark:bg-neutral-950 border-neutral-200/70 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                    }`}
                  >
                    <div className="relative w-[5.5rem] aspect-video shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
                      <YtThumb youtubeId={item.youtube_video_id} alt={item.title} />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-brand-blue/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                      <h4
                        className={`font-semibold text-[11px] leading-snug line-clamp-2 ${
                          isCurrent
                            ? "text-brand-blue"
                            : "text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
                        {formatDateShort(item.scheduled_at)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-6 text-center">
              <Film className="w-7 h-7 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Aún no hay grabaciones en la biblioteca.
              </p>
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
}

// ─── Hero: live now ──────────────────────────────────────────────────────────

function HeroLiveNow({
  liveClass,
  onJoin,
}: {
  liveClass: LiveClass;
  onJoin: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden border border-rose-200/60 dark:border-rose-900/40 bg-white dark:bg-neutral-950 shadow-sm"
    >
      {/* Soft live glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/80 via-transparent to-transparent dark:from-rose-950/30 dark:via-transparent" />

      <div className="relative grid md:grid-cols-5 gap-0">
        <button
          type="button"
          onClick={onJoin}
          className="relative md:col-span-2 aspect-video md:aspect-auto md:min-h-[300px] overflow-hidden group cursor-pointer border-none p-0 bg-neutral-900"
          aria-label="Unirse a la clase en vivo"
        >
          <YtThumb youtubeId={liveClass.youtube_video_id} alt={liveClass.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
          <div className="absolute top-4 left-4">
            <LiveBadge />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-neutral-900 fill-neutral-900 ml-0.5" />
            </span>
          </div>
        </button>

        <div className="relative md:col-span-3 p-6 sm:p-8 flex flex-col">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-500 mb-2">
            Transmisión en curso
          </p>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight tracking-tight">
            {liveClass.title}
          </h2>
          {liveClass.description && (
            <p className="mt-2.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
              {liveClass.description}
            </p>
          )}

          <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <PrimaryButton onClick={onJoin} className="w-full sm:w-auto">
              <Radio className="w-4 h-4" />
              Unirse ahora
            </PrimaryButton>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 sm:ml-1">
              La clase ya está en emisión
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Hero: scheduled ─────────────────────────────────────────────────────────

function HeroScheduled({
  liveClass,
  countdown,
  nowMs,
  isAdmin,
  onJoin,
  onStart,
}: {
  liveClass: LiveClass;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  nowMs: number;
  isAdmin: boolean;
  onJoin: () => void;
  onStart: () => void;
}) {
  const isUnlocked =
    nowMs >= new Date(liveClass.scheduled_at).getTime() - UNLOCK_WINDOW_MS;
  const started = nowMs >= new Date(liveClass.scheduled_at).getTime();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden"
    >
      <div className="grid md:grid-cols-5 gap-0">
        {/* Visual */}
        <div className="relative md:col-span-2 aspect-video md:aspect-auto md:min-h-[300px] bg-neutral-900 overflow-hidden">
          {liveClass.youtube_video_id ? (
            <>
              <YtThumb youtubeId={liveClass.youtube_video_id} alt={liveClass.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-blue/40 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <Radio className="w-7 h-7 text-white/90" />
              </div>
              <span className="text-xs font-medium text-white/50 tracking-wide">
                Próxima masterclass
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <StatusBadge variant="scheduled" />
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500 mb-2">
            Próxima clase
          </p>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight tracking-tight">
            {liveClass.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <MetaChip icon={Calendar}>
              {capitalize(formatDateLong(liveClass.scheduled_at))}
            </MetaChip>
            <MetaChip icon={Clock}>{formatTime(liveClass.scheduled_at)} hrs</MetaChip>
          </div>

          {liveClass.description && (
            <p className="mt-3.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
              {liveClass.description}
            </p>
          )}

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500 mb-2.5">
              {started ? "La clase debería comenzar" : "Comienza en"}
            </p>
            <LiveCountdown {...countdown} />
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            {isUnlocked ? (
              <PrimaryButton onClick={onJoin} className="w-full sm:w-auto">
                <Radio className="w-4 h-4" />
                Unirse a la clase
              </PrimaryButton>
            ) : (
              <PrimaryButton disabled className="w-full sm:w-auto">
                <Lock className="w-3.5 h-3.5" />
                Disponible 10 min antes
              </PrimaryButton>
            )}
            {isAdmin && (
              <GhostButton onClick={onStart}>
                <Play className="w-3.5 h-3.5" />
                Iniciar transmisión
              </GhostButton>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Hero: no upcoming — highlight latest recording ──────────────────────────

function HeroIdle({
  latest,
  onPlay,
}: {
  latest: LiveClass | null;
  onPlay: (cls: LiveClass) => void;
}) {
  if (!latest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 px-6 py-12 sm:py-14 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
          <Radio className="w-7 h-7 text-brand-blue" />
        </div>
        <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-1.5">
          Sin clase programada
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
          Cuando se agende la próxima masterclass aparecerá aquí con fecha, hora y
          cuenta regresiva.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden"
    >
      <div className="px-5 sm:px-6 pt-5 pb-0">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>No hay una masterclass programada en este momento</span>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-0 p-5 sm:p-6 pt-4">
        <button
          type="button"
          onClick={() => latest.youtube_video_id && onPlay(latest)}
          disabled={!latest.youtube_video_id}
          className={`relative md:col-span-2 aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 group ${
            latest.youtube_video_id ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <YtThumb youtubeId={latest.youtube_video_id} alt={latest.title} />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
          <div className="absolute top-3 left-3">
            <StatusBadge variant="recommended" />
          </div>
          {latest.youtube_video_id && (
            <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100">
              <span className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-neutral-900 fill-neutral-900 ml-0.5" />
              </span>
            </div>
          )}
        </button>

        <div className="md:col-span-3 flex flex-col justify-center md:pl-7 pt-5 md:pt-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500 mb-2">
            Última masterclass
          </p>
          <h2 className="font-display font-bold text-xl text-neutral-900 dark:text-white leading-tight tracking-tight">
            {latest.title}
          </h2>
          <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            Emitida el {formatDateShort(latest.scheduled_at)}
          </p>
          {latest.description && (
            <p className="mt-2.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
              {latest.description}
            </p>
          )}
          {latest.youtube_video_id && (
            <div className="mt-5">
              <PrimaryButton onClick={() => onPlay(latest)} className="w-full sm:w-auto">
                <Play className="w-4 h-4 fill-white/30" />
                Ver grabación
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Recording card ──────────────────────────────────────────────────────────

function RecordingCard({
  recording,
  index,
  onPlay,
  featured,
}: {
  recording: LiveClass;
  index: number;
  onPlay: (cls: LiveClass) => void;
  featured?: boolean;
}) {
  const hasVideo = !!recording.youtube_video_id;

  return (
    <motion.button
      type="button"
      onClick={() => hasVideo && onPlay(recording)}
      disabled={!hasVideo}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
      className={`group text-left rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 flex flex-col h-full ${
        hasVideo
          ? "hover:shadow-lift hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer active:scale-[0.99]"
          : "opacity-75 cursor-default"
      } ${featured ? "md:col-span-2 md:flex-row" : ""}`}
    >
      <div
        className={`relative overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900 ${
          featured ? "md:w-[46%] aspect-video md:aspect-auto md:min-h-[200px]" : "aspect-video w-full"
        }`}
      >
        <YtThumb youtubeId={recording.youtube_video_id} alt={recording.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        <div className="absolute top-3 left-3">
          <StatusBadge variant="recording" />
        </div>
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 text-neutral-900 fill-neutral-900 ml-0.5" />
            </span>
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-1 ${featured ? "p-5 sm:p-6 justify-center" : "p-4 sm:p-5"}`}>
        <h3
          className={`font-semibold text-neutral-900 dark:text-white leading-snug group-hover:text-brand-blue transition-colors ${
            featured ? "text-base sm:text-lg line-clamp-2" : "text-sm line-clamp-2"
          }`}
        >
          {recording.title}
        </h3>
        {recording.description && (
          <p
            className={`text-neutral-400 dark:text-neutral-500 leading-relaxed mt-1.5 ${
              featured ? "text-sm line-clamp-2" : "text-xs line-clamp-2"
            }`}
          >
            {recording.description}
          </p>
        )}
        <div className="mt-auto pt-3.5 flex items-center justify-between gap-2 border-t border-neutral-100 dark:border-neutral-900/80">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateShort(recording.scheduled_at)}
          </span>
          {hasVideo ? (
            <span className="text-[11px] font-semibold text-brand-blue inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
              Ver <ChevronRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-full">
              Sin video
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export default function LivePanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatchingLive, setIsWatchingLive] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [playbackClass, setPlaybackClass] = useState<LiveClass | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [nowMs, setNowMs] = useState(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock
  useEffect(() => {
    const clock = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Notes from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("live_classes_notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveNote = (classId: string, val: string) => {
    const next = { ...notes, [classId]: val };
    setNotes(next);
    localStorage.setItem("live_classes_notes", JSON.stringify(next));
  };

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

      const { data: completed, error: completedError } = await supabase
        .from("live_classes")
        .select("*")
        .eq("status", "completed")
        .order("scheduled_at", { ascending: false })
        .limit(24);

      if (completedError) throw completedError;
      setCompletedClasses(completed || []);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching live classes:", err);
      setError("No se pudieron cargar las clases en vivo.");
    }
  }, []);

  // Countdown for scheduled
  useEffect(() => {
    if (!activeClass || activeClass.status !== "scheduled") return;

    const tick = () => {
      const diff = new Date(activeClass.scheduled_at).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        fetchClassInfo();
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activeClass, fetchClassInfo]);

  // Init
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([checkAdmin(), fetchClassInfo()]);
      setLoading(false);
    };
    init();
  }, [checkAdmin, fetchClassInfo]);

  // Polling
  useEffect(() => {
    if (isWatchingLive) return;

    const interval =
      activeClass?.status === "scheduled" ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_IDLE;

    const onVisibility = () => {
      if (document.visibilityState === "visible" && !isWatchingLive) {
        fetchClassInfo();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    pollRef.current = setInterval(() => {
      if (document.visibilityState === "visible") fetchClassInfo();
    }, interval);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
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

  const handleJoinClass = () => setIsWatchingLive(true);

  const handleCompleteClass = async () => {
    if (
      !activeClass ||
      !confirm(
        "¿Finalizar la clase? Se moverá al historial de grabaciones."
      )
    ) {
      return;
    }
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

  // ── Loading
  if (loading && !adminChecked) {
    return <LiveSkeleton />;
  }

  // ── Classroom: live
  if (isWatchingLive && activeClass) {
    return (
      <LiveClassroom
        session={activeClass}
        isLive
        isAdmin={isAdmin}
        completedClasses={completedClasses}
        notes={notes}
        onSaveNote={handleSaveNote}
        onBack={() => setIsWatchingLive(false)}
        onSelectRecording={(cls) => {
          setIsWatchingLive(false);
          setPlaybackClass(cls);
        }}
        onCompleteClass={handleCompleteClass}
      />
    );
  }

  // ── Classroom: recording
  if (playbackClass) {
    return (
      <LiveClassroom
        session={playbackClass}
        isLive={false}
        isAdmin={isAdmin}
        completedClasses={completedClasses}
        notes={notes}
        onSaveNote={handleSaveNote}
        onBack={() => setPlaybackClass(null)}
        onSelectRecording={setPlaybackClass}
      />
    );
  }

  // ── Main lobby
  const isLiveNow = activeClass?.status === "active";
  const isScheduled = activeClass?.status === "scheduled";
  const nextHint =
    isScheduled && activeClass
      ? `Próxima: ${capitalize(
          new Date(activeClass.scheduled_at).toLocaleDateString("es-CL", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        )} · ${formatTime(activeClass.scheduled_at)}`
      : null;

  // Recordings shown in grid: if idle hero already highlights first, skip duplicating as first featured only when no scheduled/active
  const showFeaturedRecording = !isLiveNow && !isScheduled && completedClasses.length > 0;
  const gridRecordings = showFeaturedRecording
    ? completedClasses.slice(1)
    : completedClasses;

  return (
    <div className="max-w-6xl mx-auto space-y-9 sm:space-y-10 pt-1">
      <LiveSectionHeader hasLiveNow={!!isLiveNow} nextHint={nextHint} />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 text-xs font-semibold shrink-0 cursor-pointer border-none bg-transparent"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      {isLiveNow && activeClass ? (
        <HeroLiveNow liveClass={activeClass} onJoin={handleJoinClass} />
      ) : isScheduled && activeClass ? (
        <HeroScheduled
          liveClass={activeClass}
          countdown={countdown}
          nowMs={nowMs}
          isAdmin={isAdmin}
          onJoin={handleJoinClass}
          onStart={handleStartClass}
        />
      ) : (
        <HeroIdle
          latest={completedClasses[0] ?? null}
          onPlay={setPlaybackClass}
        />
      )}

      {/* Recordings library */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 px-0.5">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white tracking-tight">
              Biblioteca de grabaciones
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Repasa las masterclasses anteriores cuando quieras.
            </p>
          </div>
          {completedClasses.length > 0 && (
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 tabular-nums">
              {completedClasses.length}{" "}
              {completedClasses.length === 1 ? "clase" : "clases"}
            </span>
          )}
        </div>

        {completedClasses.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6 py-14 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-4">
              <Film className="w-7 h-7 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-1.5">
              Sin grabaciones aún
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
              Las clases finalizadas aparecerán aquí para que las revises a tu ritmo.
            </p>
          </div>
        ) : gridRecordings.length === 0 && showFeaturedRecording ? (
          // Only one recording and it is already in the hero
          <p className="text-sm text-neutral-400 dark:text-neutral-500 px-0.5">
            La grabación más reciente está destacada arriba. Las siguientes sesiones
            se listarán aquí.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {gridRecordings.map((recording, index) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                index={index}
                onPlay={setPlaybackClass}
                featured={index === 0 && gridRecordings.length >= 3 && !showFeaturedRecording}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
