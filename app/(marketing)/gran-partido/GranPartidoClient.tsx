"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  ChevronDown,
  Crown,
  Target,
} from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/shared/AuthModal";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { courses } from "@/lib/data/courses";

/** Cursos no disponibles como premio del sorteo */
const EXCLUDED_PRIZE_SLUGS = new Set([
  "analisis-de-datos",
  "analitica-financiera",
  "analitica-mineria",
]);

/** Orden preferido en el selector de premios */
const PRIZE_ORDER = [
  "power-bi",
  "sql-server",
  "python",
  "excel",
  "copilot",
  "power-automate",
  "ia-productividad",
  "machine-learning",
];

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

/** Base artificial para que al inicio no salten tanto los %. No se muestran conteos. */
const SEED_VOTES = 10;

const TEAMS: {
  id: TeamId;
  name: string;
  short: string;
  flagUrl: string;
  flagUrlLg: string;
  soft: string;
  ring: string;
  bar: string;
  accent: string;
  borderSel: string;
  badge: string;
  glow: string;
  cardBg: string;
}[] = [
  {
    id: "espana",
    name: "España",
    short: "ESP",
    flagUrl: "https://flagcdn.com/w160/es.png",
    flagUrlLg: "https://flagcdn.com/w320/es.png",
    soft: "bg-red-50",
    ring: "ring-red-400",
    bar: "from-red-600 via-red-500 to-amber-400",
    accent: "text-red-700",
    borderSel: "border-red-400 shadow-red-200/70",
    badge: "bg-red-600 text-white",
    glow: "from-red-500/20 to-amber-400/10",
    cardBg: "from-red-50 via-white to-amber-50/40",
  },
  {
    id: "argentina",
    name: "Argentina",
    short: "ARG",
    flagUrl: "https://flagcdn.com/w160/ar.png",
    flagUrlLg: "https://flagcdn.com/w320/ar.png",
    soft: "bg-sky-50",
    ring: "ring-sky-400",
    bar: "from-sky-500 via-sky-400 to-blue-200",
    accent: "text-sky-700",
    borderSel: "border-sky-400 shadow-sky-200/70",
    badge: "bg-sky-600 text-white",
    glow: "from-sky-400/25 to-blue-100/20",
    cardBg: "from-sky-50 via-white to-slate-50",
  },
];

const STEPS = [
  {
    icon: Users,
    title: "Únete como miembro",
    desc: "Regístrate o inicia sesión. Solo los miembros de ProgramBI pueden predecir.",
    color: "bg-blue-50 text-[#1890FF] border-blue-100",
  },
  {
    icon: Target,
    title: "Elige al ganador",
    desc: "Selecciona el equipo que crees se llevará el gran partido: España o Argentina.",
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    icon: GraduationCap,
    title: "Elige tu curso premio",
    desc: "Marca el curso que te gustaría ganar si aciertas y sales sorteado.",
    color: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    icon: Gift,
    title: "Sorteo entre acertantes",
    desc: "Solo quienes votaron al país ganador entran al sorteo de cursos.",
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
];

const FAQS = [
  {
    q: "¿Quién puede participar?",
    a: "Solo los miembros registrados de ProgramBI. Si aún no tienes cuenta, créala en segundos y luego registra tu predicción.",
  },
  {
    q: "¿Cómo se gana el curso?",
    a: "Cuando se conozca el resultado del gran partido, solo las personas que hayan votado por el país ganador entran al bolillero. Entre ellas se sortean cursos a elección.",
  },
  {
    q: "¿Puedo cambiar mi predicción?",
    a: "No. Cada miembro registra una sola predicción. Elige con cuidado: tu voto es definitivo.",
  },
  {
    q: "¿Qué curso puedo ganar?",
    a: "Al votar eliges el curso que quieres. Si aciertas el equipo ganador y sales sorteado, recibes ese curso.",
  },
  {
    q: "¿Hay costo por participar?",
    a: "No. Es 100% gratuito para los miembros de la plataforma.",
  },
  {
    q: "¿Cuándo se anuncia el ganador del sorteo?",
    a: "Tras conocerse el resultado del gran partido, revisamos las predicciones acertadas y comunicamos a los ganadores del sorteo por correo y en la comunidad.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        open
          ? "border-red-200 bg-red-50/30 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left p-5 group outline-none"
      >
        <span
          className={`text-sm md:text-base font-bold pr-4 tracking-tight ${
            open ? "text-red-700" : "text-slate-800"
          }`}
        >
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            open
              ? "bg-red-600 text-white"
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

function displayPct(part: number, other: number) {
  const a = part + SEED_VOTES;
  const b = other + SEED_VOTES;
  const total = a + b;
  if (total <= 0) return 50;
  return Math.round((a / total) * 100);
}

function TeamFlag({
  team,
  size = "md",
}: {
  team: (typeof TEAMS)[number];
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? "w-28 h-[72px] sm:w-36 sm:h-[92px]"
      : size === "sm"
        ? "w-12 h-8"
        : "w-20 h-[52px] sm:w-24 sm:h-16";

  return (
    <div
      className={`relative ${dims} rounded-lg overflow-hidden shadow-md ring-1 ring-black/10 bg-slate-100 shrink-0`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={size === "lg" ? team.flagUrlLg : team.flagUrl}
        alt={`Bandera de ${team.name}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export default function GranPartidoClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats>({ espana: 0, argentina: 0, total: 0 });
  const [userVote, setUserVote] = useState<UserVote | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const prizeCourses = useMemo(() => {
    const eligible = courses.filter((c) => !EXCLUDED_PRIZE_SLUGS.has(c.slug));
    return eligible.sort((a, b) => {
      const ai = PRIZE_ORDER.indexOf(a.slug);
      const bi = PRIZE_ORDER.indexOf(b.slug);
      const aRank = ai === -1 ? 1000 + a.sortOrder : ai;
      const bRank = bi === -1 ? 1000 + b.sortOrder : bi;
      return aRank - bRank;
    });
  }, []);

  const [selectedCourse, setSelectedCourse] = useState("power-bi");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    tab: "login" | "register";
  }>({ isOpen: false, tab: "register" });

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
      // UI usable sin API
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!authModal.isOpen) load();
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
          "¡Predicción registrada! Si aciertas, entras al sorteo de un curso."
      );
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const espPct = displayPct(stats.espana, stats.argentina);
  const argPct = 100 - espPct;
  const hasVoted = !!userVote;
  const selectedTeamData = TEAMS.find((t) => t.id === selectedTeam);
  const selectedCourseData = prizeCourses.find((c) => c.slug === selectedCourse);

  /** Tras elegir país (y estar logueado), mostrar selector de curso */
  const showCourseStep =
    authenticated && !!selectedTeam && !hasVoted;

  return (
    <div className="bg-white text-slate-900 min-h-screen relative overflow-hidden font-sans">
      {/* Fondos suaves con colores de equipos — sin cuadrícula */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-red-400/15 blur-[110px]" />
        <div className="absolute -top-24 -right-16 w-[460px] h-[460px] rounded-full bg-sky-400/20 blur-[110px]" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] rounded-full bg-amber-200/10 blur-[120px]" />
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-4 sm:pt-6 pb-10 lg:pb-14">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-3 text-slate-950"
            >
              ¿Quién ganará el{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-sky-500">
                Gran Partido
              </span>
              ?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              Elige entre{" "}
              <strong className="text-red-700">España</strong> y{" "}
              <strong className="text-sky-700">Argentina</strong>. Entre quienes
              acierten al país ganador se sortearán cursos a elección.
            </motion.p>
          </div>

          {/* VS — solo tarjetas de equipos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-6"
            id="votar"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch">
              {TEAMS.flatMap((team, idx) => {
                const isSelected = selectedTeam === team.id;
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
                    className={`group relative flex-1 text-left rounded-3xl border-2 p-5 sm:p-7 transition-all duration-300 overflow-hidden bg-gradient-to-br ${team.cardBg} ${
                      isSelected
                        ? `${team.borderSel} shadow-xl ring-2 ${team.ring}/25`
                        : "border-slate-200/90 hover:border-slate-300 hover:shadow-lg"
                    } ${locked && !isSelected ? "opacity-45" : ""} ${
                      locked || submitting ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${team.glow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10">
                        <CheckCircle2 className="text-emerald-500 drop-shadow" size={22} />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <TeamFlag team={team} size="lg" />
                      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {team.short}
                      </p>
                      <h2
                        className={`text-2xl sm:text-3xl font-black font-display tracking-tight mt-1 ${team.accent}`}
                      >
                        {team.name}
                      </h2>

                      <div className="mt-4 w-full">
                        <p className="text-3xl font-black tabular-nums text-slate-900">
                          {loading ? "—" : `${share}%`}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                          de las predicciones
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-white/80 border border-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: loading ? "50%" : `${share}%` }}
                            transition={{ duration: 0.9, delay: 0.2 + idx * 0.08 }}
                            className={`h-full rounded-full bg-gradient-to-r ${team.bar}`}
                          />
                        </div>
                      </div>

                      {!locked && (
                        <span
                          className={`mt-5 inline-flex text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition ${
                            isSelected
                              ? team.badge + " border-transparent shadow-sm"
                              : "border-slate-200/80 text-slate-600 group-hover:border-slate-300 bg-white/70"
                          }`}
                        >
                          {isSelected ? "Seleccionado" : "Elegir"}
                        </span>
                      )}
                    </div>
                  </button>
                );

                if (idx === 0) {
                  return [
                    card,
                    <div
                      key="vs-badge"
                      className="flex items-center justify-center sm:px-0.5 -my-1 sm:my-0"
                    >
                      <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-xl border-4 border-white">
                        VS
                      </div>
                    </div>,
                  ];
                }
                return [card];
              })}
            </div>

            {/* Barra comparativa simple */}
            {!loading && (
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-red-600">España {espPct}%</span>
                  <span className="text-sky-600">Argentina {argPct}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-white border border-slate-100">
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
            )}
          </motion.div>

          {/* Panel inferior: éxito / login / cursos */}
          <div className="max-w-4xl mx-auto">
            {hasVoted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border p-7 sm:p-9 text-center shadow-sm ${
                  userVote.team === "espana"
                    ? "border-red-200/60 bg-red-50/40"
                    : "border-sky-200/60 bg-sky-50/40"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-4 shadow-sm border ${
                    userVote.team === "espana"
                      ? "border-red-100"
                      : "border-sky-100"
                  }`}
                >
                  <Trophy className="text-amber-500" size={28} />
                </div>
                <h3 className="text-2xl font-black font-display text-slate-900 mb-2">
                  ¡Predicción registrada!
                </h3>
                <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Seleccionaste{" "}
                  <strong
                    className={
                      userVote.team === "espana"
                        ? "text-red-700"
                        : "text-sky-700"
                    }
                  >
                    {userVote.team === "espana" ? "España" : "Argentina"}
                  </strong>
                  . Si es el país ganador, entras al sorteo de{" "}
                  <strong className="text-slate-900">
                    {userVote.preferred_course_title}
                  </strong>
                  .
                </p>
              </motion.div>
            ) : !authenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 text-center shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                  <Lock className="text-slate-500" size={24} />
                </div>
                <h3 className="text-xl font-black font-display text-slate-900 mb-2">
                  Solo para miembros
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                  Regístrate o inicia sesión para elegir tu equipo y participar
                  por un curso.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setAuthModal({ isOpen: true, tab: "register" })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:brightness-110 transition"
                  >
                    Crear cuenta gratis
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthModal({ isOpen: true, tab: "login" })}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-6 py-3.5 text-sm font-bold text-sky-800 hover:bg-sky-100 transition"
                  >
                    Ya soy miembro
                  </button>
                </div>
              </motion.div>
            ) : showCourseStep ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="course-step"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`rounded-3xl border-2 overflow-hidden shadow-sm ${
                    selectedTeamData
                      ? selectedTeamData.id === "espana"
                        ? "border-red-200 bg-gradient-to-b from-red-50/80 to-white"
                        : "border-sky-200 bg-gradient-to-b from-sky-50/80 to-white"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="p-6 sm:p-8">
                    {/* Chip del equipo elegido */}
                    {selectedTeamData && (
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <TeamFlag team={selectedTeamData} size="sm" />
                        <span
                          className={`text-sm font-bold ${selectedTeamData.accent}`}
                        >
                          Vas con {selectedTeamData.name}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 text-center mb-1">
                      Elige el curso que te interesa
                    </h3>
                    <p className="text-sm text-slate-500 text-center mb-6">
                      Si aciertas, entras al sorteo de este curso.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      {prizeCourses.map((c) => {
                        const selected = selectedCourse === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setSelectedCourse(c.slug)}
                            className={`group relative text-left rounded-2xl border overflow-hidden bg-white flex flex-col h-full transition-all duration-300 ${
                              selected
                                ? selectedTeamData?.id === "argentina"
                                  ? "border-sky-500 shadow-[0_16px_40px_-12px_rgba(14,165,233,0.35)] ring-2 ring-sky-400/25"
                                  : "border-red-500 shadow-[0_16px_40px_-12px_rgba(220,38,38,0.3)] ring-2 ring-red-400/25"
                                : "border-gray-100 hover:border-[#BAE7FF] hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.1)] hover:-translate-y-1"
                            }`}
                          >
                            <div className="relative h-[160px] sm:h-[180px] w-full overflow-hidden bg-slate-50 shrink-0">
                              <Image
                                src={c.imageUrl}
                                alt={c.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, 400px"
                              />
                              {selected && (
                                <div
                                  className={`absolute top-3 right-3 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg ${
                                    selectedTeamData?.id === "argentina"
                                      ? "bg-sky-600"
                                      : "bg-red-600"
                                  }`}
                                >
                                  <CheckCircle2 size={17} />
                                </div>
                              )}
                              {c.badgeLabel && !selected && (
                                <div
                                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[10px] font-bold shadow-sm"
                                  style={{
                                    backgroundColor:
                                      c.badgeColor || c.accentColor,
                                  }}
                                >
                                  {c.badgeLabel}
                                </div>
                              )}
                            </div>
                            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                              <p
                                className={`font-display font-bold text-base sm:text-lg leading-snug mb-1.5 transition-colors ${
                                  selected
                                    ? selectedTeamData?.id === "argentina"
                                      ? "text-sky-700"
                                      : "text-red-700"
                                    : "text-slate-900 group-hover:text-[#1890FF]"
                                }`}
                              >
                                {c.title}
                              </p>
                              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                {c.shortDescription}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                {c.techStack.slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-100"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {selectedCourseData && (
                      <p className="text-sm text-slate-600 mt-5 leading-relaxed bg-white border border-slate-100 rounded-xl px-4 py-3 text-center">
                        <span className="font-semibold text-slate-800">
                          Curso elegido:{" "}
                        </span>
                        {selectedCourseData.title}
                      </p>
                    )}

                    {error && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    {successMsg && (
                      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {successMsg}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleVote}
                      disabled={submitting || !selectedTeam || !selectedCourse}
                      className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition ${
                        selectedTeamData?.id === "argentina"
                          ? "bg-gradient-to-r from-sky-500 to-sky-600 shadow-sky-500/25"
                          : "bg-gradient-to-r from-red-600 to-amber-500 shadow-red-500/25"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Registrando…
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Completar predicción
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-3">
                      Un voto por miembro. No se puede modificar después.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              /* Logueado pero aún sin equipo */
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-slate-500 py-2"
              >
                Toca un equipo para continuar y elegir tu curso premio.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-14 lg:py-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 mb-3">
              Cómo funciona
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Del silbato inicial al sorteo
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Solo entran al sorteo quienes acierten el país ganador del gran
              partido.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.07}>
                <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 hover:shadow-md transition">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${step.color}`}
                  >
                    <step.icon size={22} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Paso {i + 1}
                  </p>
                  <h3 className="font-bold text-lg mb-2 tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRIZE ═══════ */}
      <section className="relative py-14 lg:py-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12 overflow-hidden relative shadow-sm">
            <div className="absolute -right-20 top-10 w-72 h-72 bg-red-200/20 blur-[90px] pointer-events-none" />
            <div className="absolute -left-20 bottom-0 w-72 h-72 bg-sky-200/25 blur-[90px] pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 mb-4">
                  <Crown size={14} className="text-amber-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Premio del sorteo
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4 text-slate-950">
                  Cursos a elección entre acertantes
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Cuando se conozca el resultado del gran partido,{" "}
                  <strong className="text-slate-900">
                    solo quienes hayan votado por el país ganador
                  </strong>{" "}
                  entran al bolillero. Entre ellos se sortean cursos de ProgramBI.
                </p>
                <ul className="space-y-3">
                  {[
                    "Si aciertas el país ganador → entras al sorteo",
                    "Si no aciertas → no participas del premio",
                    "El ganador recibe el curso que eligió al votar",
                    "Participación 100% gratuita para miembros",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="grid grid-cols-2 gap-3">
                  {prizeCourses.slice(0, 6).map((c) => (
                    <div
                      key={c.slug}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <div className="relative h-20 w-full bg-slate-100">
                        <Image
                          src={c.imageUrl}
                          alt={c.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          {c.techStack.join(" · ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section className="relative py-10">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Un voto por miembro",
                desc: "Solo cuentas autenticadas. Sin duplicados.",
                iconBg: "bg-red-50 border-red-100 text-red-600",
              },
              {
                icon: Star,
                title: "Sorteo entre acertantes",
                desc: "Solo quienes elijan al país ganador entran al bolillero.",
                iconBg: "bg-amber-50 border-amber-100 text-amber-600",
              },
              {
                icon: Gift,
                title: "Premio de valor real",
                desc: "Un curso profesional de ProgramBI a elección del ganador.",
                iconBg: "bg-sky-50 border-sky-100 text-sky-600",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-4 shadow-sm">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
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
      <section className="relative py-14 lg:py-16">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600 mb-3">
              Preguntas frecuentes
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950">
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
      <section className="relative py-12 lg:py-16 pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <FadeIn>
            <div className="rounded-[28px] border border-slate-200 bg-white p-10 sm:p-12 shadow-sm overflow-hidden relative">
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4 text-slate-950">
                ¿Listo para predecir?
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Elige tu equipo, elige tu curso y, si aciertas, entras al sorteo.
              </p>
              {hasVoted ? (
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white px-7 py-3.5 text-sm font-bold hover:bg-slate-800 transition"
                >
                  Explorar cursos
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <a
                  href="#votar"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-sky-500 text-white px-7 py-3.5 text-sm font-black shadow-lg hover:brightness-105 transition"
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
