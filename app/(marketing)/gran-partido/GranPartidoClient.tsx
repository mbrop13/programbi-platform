"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gift,
  Users,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  GraduationCap,
  Star,
  Ticket,
  ChevronDown,
  Crown,
  Flame,
  Target,
} from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/shared/AuthModal";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { courses } from "@/lib/data/courses";

type TeamId = "espana" | "argentina";

interface Stats {
  espana: number;
  argentina: number;
  total: number;
}

interface UserVote {
  team: string;
  preferred_course_slug: string;
  preferred_course_title: string;
  created_at: string;
}

const TEAMS: {
  id: TeamId;
  name: string;
  short: string;
  flag: string;
  gradient: string;
  soft: string;
  ring: string;
  bar: string;
  accent: string;
  glow: string;
}[] = [
  {
    id: "espana",
    name: "España",
    short: "ESP",
    flag: "🇪🇸",
    gradient: "from-red-600 via-red-500 to-amber-400",
    soft: "bg-red-50 border-red-200/70",
    ring: "ring-red-400/50",
    bar: "from-red-500 to-amber-400",
    accent: "text-red-600",
    glow: "shadow-red-500/25",
  },
  {
    id: "argentina",
    name: "Argentina",
    short: "ARG",
    flag: "🇦🇷",
    gradient: "from-sky-500 via-sky-400 to-slate-100",
    soft: "bg-sky-50 border-sky-200/70",
    ring: "ring-sky-400/50",
    bar: "from-sky-500 to-blue-300",
    accent: "text-sky-600",
    glow: "shadow-sky-500/25",
  },
];

const STEPS = [
  {
    icon: Users,
    title: "Únete como miembro",
    desc: "Regístrate o inicia sesión en ProgramBI. Solo los miembros pueden participar.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Target,
    title: "Elige tu predicción",
    desc: "Selecciona quién crees que se llevará el gran partido: España o Argentina.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: GraduationCap,
    title: "Elige tu curso premio",
    desc: "Indica el curso que te gustaría ganar si aciertas y sales sorteado.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Gift,
    title: "Sorteo entre acertantes",
    desc: "Cuando se conozca el resultado, entre quienes acertaron se sortea un curso.",
    color: "from-violet-500 to-purple-600",
  },
];

const FAQS = [
  {
    q: "¿Quién puede participar?",
    a: "Solo los miembros registrados de ProgramBI. Si aún no tienes cuenta, puedes crearla en segundos y luego registrar tu predicción.",
  },
  {
    q: "¿Puedo cambiar mi predicción después?",
    a: "No. Cada miembro puede registrar una sola predicción. Elige con cuidado: tu voto es definitivo.",
  },
  {
    q: "¿Cómo funciona el premio?",
    a: "Cuando se conozca el resultado del gran partido, entre todas las personas que acertaron el equipo ganador se realizará un sorteo. El afortunado recibe el curso que eligió al votar.",
  },
  {
    q: "¿El curso es gratis para el ganador?",
    a: "Sí. El miembro sorteado entre los acertantes recibe el acceso al curso que seleccionó al momento de su predicción.",
  },
  {
    q: "¿Cuándo se anuncia el ganador?",
    a: "Tras conocerse el resultado del gran partido, revisaremos las predicciones acertadas y comunicaremos el ganador del sorteo por correo y en la comunidad.",
  },
  {
    q: "¿Hay algún costo por participar?",
    a: "No. Participar es 100% gratuito para los miembros de la plataforma.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        open
          ? "border-[#1890FF]/30 bg-blue-50/40 shadow-[0_12px_40px_-12px_rgba(24,144,255,0.08)]"
          : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left p-5 group outline-none"
      >
        <span
          className={`text-sm md:text-base font-bold pr-4 tracking-tight ${
            open ? "text-[#1890FF]" : "text-slate-800"
          }`}
        >
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            open
              ? "bg-[#1890FF] text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          }`}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="px-5 pb-5 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed pt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function pct(part: number, total: number) {
  if (total <= 0) return 50;
  return Math.round((part / total) * 100);
}

export default function GranPartidoClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats>({ espana: 0, argentina: 0, total: 0 });
  const [userVote, setUserVote] = useState<UserVote | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.slug ?? "analisis-de-datos");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    tab: "login" | "register";
  }>({ isOpen: false, tab: "register" });

  const prizeCourses = useMemo(
    () => [...courses].sort((a, b) => a.sortOrder - b.sortOrder),
    []
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/match-prediction", { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setAuthenticated(!!data.authenticated);
      if (data.stats) setStats(data.stats);
      if (data.userVote) {
        setUserVote(data.userVote);
        setSelectedTeam(data.userVote.team as TeamId);
        setSelectedCourse(data.userVote.preferred_course_slug);
      }
    } catch {
      // Página usable aunque falle la API (sin stats en vivo)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-cargar al cerrar el modal de auth (por si se registró/logueó)
  useEffect(() => {
    if (!authModal.isOpen) {
      load();
    }
  }, [authModal.isOpen, load]);

  const handleVote = async () => {
    setError("");
    setSuccessMsg("");

    if (!authenticated) {
      setAuthModal({ isOpen: true, tab: "register" });
      return;
    }
    if (!selectedTeam) {
      setError("Elige un equipo para tu predicción.");
      return;
    }
    if (!selectedCourse) {
      setError("Selecciona el curso que te gustaría ganar.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/match-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: selectedTeam, courseSlug: selectedCourse }),
      });
      const data = await res.json();

      if (res.status === 401) {
        setAuthModal({ isOpen: true, tab: "register" });
        setError(data.error || "Debes iniciar sesión para participar.");
        return;
      }
      if (res.status === 409) {
        setUserVote(data.userVote || userVote);
        if (data.userVote) {
          setSelectedTeam(data.userVote.team);
          setSelectedCourse(data.userVote.preferred_course_slug);
        }
        setSuccessMsg(data.error || "Ya registraste tu predicción.");
        await load();
        return;
      }
      if (!res.ok) {
        setError(data.error || "No se pudo guardar tu predicción.");
        return;
      }

      setUserVote(data.userVote);
      if (data.stats) setStats(data.stats);
      setSuccessMsg(
        data.message ||
          "¡Predicción registrada! Si aciertas, entras al sorteo del curso."
      );
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const espPct = pct(stats.espana, stats.total);
  const argPct = pct(stats.argentina, stats.total);
  const hasVoted = !!userVote;
  const selectedTeamData = TEAMS.find((t) => t.id === selectedTeam);
  const selectedCourseData = prizeCourses.find((c) => c.slug === selectedCourse);

  return (
    <div className="bg-[#070B14] text-white min-h-screen relative overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full bg-[#1890FF]/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                Exclusivo para miembros · Sorteo de curso
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5"
            >
              ¿Quién ganará el{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Gran Partido
              </span>
              ?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto"
            >
              Predice el resultado entre{" "}
              <strong className="text-white font-semibold">España</strong> y{" "}
              <strong className="text-white font-semibold">Argentina</strong>.
              Si aciertas, entras al sorteo de un{" "}
              <strong className="text-amber-300 font-semibold">
                curso a tu elección
              </strong>
              .
            </motion.p>
          </div>

          {/* VS cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch max-w-4xl mx-auto mb-10"
          >
            {TEAMS.flatMap((team, idx) => {
              const isSelected = selectedTeam === team.id;
              const count = team.id === "espana" ? stats.espana : stats.argentina;
              const share = team.id === "espana" ? espPct : argPct;
              const locked = hasVoted;

              const card = (
                <button
                  key={team.id}
                  type="button"
                  disabled={locked || submitting}
                  onClick={() => {
                    if (!authenticated) {
                      setAuthModal({ isOpen: true, tab: "register" });
                      return;
                    }
                    setSelectedTeam(team.id);
                    setError("");
                  }}
                  className={`group relative flex-1 text-left rounded-3xl border p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? `bg-white/10 border-white/30 ring-2 ${team.ring} shadow-2xl ${team.glow}`
                      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                  } ${locked && !isSelected ? "opacity-50" : ""} ${
                    locked || submitting ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`absolute inset-0 transition-opacity bg-gradient-to-br ${team.gradient} ${
                      isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10"
                    } mix-blend-overlay`}
                  />
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="text-emerald-400" size={22} />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="text-5xl sm:text-6xl mb-4 drop-shadow-lg">
                      {team.flag}
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">
                      {team.short}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight mb-4">
                      {team.name}
                    </h2>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black tabular-nums">
                          {loading ? "—" : `${share}%`}
                        </p>
                        <p className="text-xs text-white/45 mt-0.5">
                          {loading
                            ? "Cargando…"
                            : `${count.toLocaleString("es")} predicciones`}
                        </p>
                      </div>
                      {!locked && (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                            isSelected
                              ? "bg-white text-slate-900 border-white"
                              : "border-white/20 text-white/70 group-hover:border-white/40"
                          }`}
                        >
                          {isSelected ? "Elegido" : "Elegir"}
                        </span>
                      )}
                    </div>
                    <div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${share}%` }}
                        transition={{ duration: 0.9, delay: 0.3 + idx * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${team.bar}`}
                      />
                    </div>
                  </div>
                </button>
              );

              if (idx === 0) {
                return [
                  card,
                  <div
                    key="vs-badge"
                    className="flex items-center justify-center -my-1 sm:my-0"
                  >
                    <div className="relative z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.45)] border-4 border-[#070B14]">
                      VS
                    </div>
                  </div>,
                ];
              }
              return [card];
            })}
          </motion.div>

          {/* Live bar comparison */}
          {!loading && stats.total > 0 && (
            <FadeIn className="max-w-4xl mx-auto mb-12">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3 text-white/50">
                  <span className="text-red-300">España {espPct}%</span>
                  <span className="flex items-center gap-1.5 text-white/40 normal-case tracking-normal font-medium">
                    <Flame size={12} className="text-amber-400" />
                    {stats.total.toLocaleString("es")} predicciones en vivo
                  </span>
                  <span className="text-sky-300">Argentina {argPct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${espPct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-red-600 to-amber-400"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${argPct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-200"
                  />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Vote panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            id="votar"
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              {hasVoted ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 mb-4">
                    <Trophy className="text-amber-300" size={32} />
                  </div>
                  <h3 className="text-2xl font-black font-display mb-2">
                    ¡Predicción registrada!
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
                    Apostaste por{" "}
                    <strong className="text-white">
                      {userVote.team === "espana" ? "España" : "Argentina"}
                    </strong>
                    . Si aciertas, entras al sorteo de{" "}
                    <strong className="text-amber-300">
                      {userVote.preferred_course_title}
                    </strong>
                    .
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-4 py-2 text-sm text-emerald-300 font-semibold">
                    <CheckCircle2 size={16} />
                    Estás en el bolillero si tu equipo gana
                  </div>
                </div>
              ) : !authenticated ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
                    <Lock className="text-amber-300" size={28} />
                  </div>
                  <h3 className="text-2xl font-black font-display mb-2">
                    Solo para miembros
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
                    Regístrate o inicia sesión para registrar tu predicción y
                    participar por un curso a tu elección.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setAuthModal({ isOpen: true, tab: "register" })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1890FF] to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_-8px_rgba(24,144,255,0.55)] hover:brightness-110 transition"
                    >
                      Crear cuenta gratis
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAuthModal({ isOpen: true, tab: "login" })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
                    >
                      Ya soy miembro
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                      <Ticket className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black font-display">
                        Completa tu predicción
                      </h3>
                      <p className="text-sm text-white/55 mt-0.5">
                        Elige equipo y el curso que te gustaría ganar si aciertas.
                      </p>
                    </div>
                  </div>

                  {/* Selected team summary */}
                  <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
                      Tu equipo
                    </p>
                    {selectedTeamData ? (
                      <div
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${selectedTeamData.soft} text-slate-900`}
                      >
                        <span className="text-2xl">{selectedTeamData.flag}</span>
                        <div>
                          <p className="font-bold">{selectedTeamData.name}</p>
                          <p className="text-xs text-slate-500">
                            Predicción lista · un solo voto por miembro
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-amber-200/90 bg-amber-500/10 border border-amber-400/20 rounded-2xl px-4 py-3">
                        Arriba, toca la tarjeta de España o Argentina para
                        elegir.
                      </p>
                    )}
                  </div>

                  {/* Course picker */}
                  <div className="mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
                      Curso que quieres ganar
                    </p>
                    <div className="relative">
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/15 bg-[#0c1220] text-white px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1890FF]/50"
                      >
                        {prizeCourses.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      />
                    </div>
                    {selectedCourseData && (
                      <p className="text-xs text-white/45 mt-2 leading-relaxed">
                        {selectedCourseData.shortDescription}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}
                  {successMsg && (
                    <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {successMsg}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVote}
                    disabled={submitting || !selectedTeam}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-6 py-4 text-sm font-black text-slate-950 shadow-[0_16px_40px_-10px_rgba(251,191,36,0.55)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Registrando…
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Confirmar predicción
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-white/35 text-center mt-3">
                    Un voto por miembro. No se puede modificar después.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1890FF] mb-3">
              Cómo funciona
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
              Cuatro pasos. Un premio real.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <step.icon size={22} className="text-white" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-2">
                    Paso {i + 1}
                  </p>
                  <h3 className="font-bold text-lg mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRIZE ═══════ */}
      <section className="relative py-16 lg:py-20">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="rounded-[32px] border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent p-8 sm:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[80px] pointer-events-none" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 mb-4">
                  <Crown size={14} className="text-amber-300" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    Premio del sorteo
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4">
                  Un curso a tu elección
                </h2>
                <p className="text-white/60 leading-relaxed mb-6">
                  Entre quienes acierten el equipo ganador del gran partido,
                  sortearemos el acceso a uno de nuestros cursos. Tú eliges cuál
                  al momento de votar: Power BI, Python, SQL, IA, Excel y más.
                </p>
                <ul className="space-y-3">
                  {[
                    "Solo miembros con predicción acertada participan del sorteo",
                    "El ganador recibe el curso que seleccionó al votar",
                    "Participación 100% gratuita",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-white/75"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-emerald-400 mt-0.5 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="grid grid-cols-2 gap-3">
                  {prizeCourses.slice(0, 6).map((c) => (
                    <div
                      key={c.slug}
                      className="rounded-2xl border border-white/10 bg-[#0a101c]/80 p-4 hover:border-white/20 transition"
                    >
                      <div
                        className="w-8 h-1 rounded-full mb-3"
                        style={{ backgroundColor: c.accentColor }}
                      />
                      <p className="text-sm font-bold leading-snug mb-1 line-clamp-2">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-white/40 line-clamp-2">
                        {c.techStack.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/35 mt-3 text-center">
                  + {Math.max(0, prizeCourses.length - 6)} cursos más disponibles
                  al votar
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section className="relative py-12">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Un voto por miembro",
                desc: "Sistema autenticado: solo cuentas reales, sin duplicados.",
              },
              {
                icon: Star,
                title: "Transparente",
                desc: "Las predicciones quedan registradas. El sorteo es entre acertantes.",
              },
              {
                icon: Gift,
                title: "Premio de valor real",
                desc: "Un curso profesional de ProgramBI a elección del ganador.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1890FF]/15 border border-[#1890FF]/20 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#1890FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="relative py-16 lg:py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1890FF] mb-3">
              Preguntas frecuentes
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight">
              Todo lo que necesitas saber
            </h2>
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <FadeIn key={f.q}>
                <FaqItem q={f.q} a={f.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <FadeIn>
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-[#1890FF]/15 to-transparent p-10 sm:p-14">
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4">
                ¿Listo para predecir?
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                El gran partido se decide una vez. Tu predicción también. Sé
                miembro, elige tu equipo y pelea por un curso.
              </p>
              {hasVoted ? (
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 px-7 py-3.5 text-sm font-bold hover:bg-slate-100 transition"
                >
                  Explorar cursos
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <a
                  href="#votar"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-7 py-3.5 text-sm font-black shadow-[0_12px_40px_-8px_rgba(251,191,36,0.5)] hover:brightness-105 transition"
                >
                  Ir a predecir
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((p) => ({ ...p, isOpen: false }))}
        defaultTab={authModal.tab}
        redirectUrl="/gran-partido"
      />
    </div>
  );
}
