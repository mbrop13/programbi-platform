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
  Ticket,
  ChevronDown,
  Crown,
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

/** Base artificial para que al inicio no salten tanto los %. No se muestran conteos. */
const SEED_VOTES = 10;

const TEAMS: {
  id: TeamId;
  name: string;
  short: string;
  iso: string;
  flagUrl: string;
  flagUrlLg: string;
  soft: string;
  ring: string;
  bar: string;
  accent: string;
  borderSel: string;
  badge: string;
}[] = [
  {
    id: "espana",
    name: "España",
    short: "ESP",
    iso: "es",
    flagUrl: "https://flagcdn.com/w160/es.png",
    flagUrlLg: "https://flagcdn.com/w320/es.png",
    soft: "bg-red-50",
    ring: "ring-red-400",
    bar: "from-red-600 via-red-500 to-amber-400",
    accent: "text-red-700",
    borderSel: "border-red-400 shadow-red-200/60",
    badge: "bg-red-600 text-white",
  },
  {
    id: "argentina",
    name: "Argentina",
    short: "ARG",
    iso: "ar",
    flagUrl: "https://flagcdn.com/w160/ar.png",
    flagUrlLg: "https://flagcdn.com/w320/ar.png",
    soft: "bg-sky-50",
    ring: "ring-sky-400",
    bar: "from-sky-500 via-sky-400 to-blue-200",
    accent: "text-sky-700",
    borderSel: "border-sky-400 shadow-sky-200/60",
    badge: "bg-sky-600 text-white",
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
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    icon: GraduationCap,
    title: "Elige tu curso premio",
    desc: "Marca el curso que te gustaría ganar si aciertas y sales sorteado.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: Gift,
    title: "Sorteo entre acertantes",
    desc: "Solo quienes votaron al país ganador entran al sorteo de cursos.",
    color: "bg-violet-50 text-violet-700 border-violet-100",
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
          ? "border-[#1890FF]/35 bg-blue-50/50 shadow-sm"
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
  const [selectedCourse, setSelectedCourse] = useState(
    courses[0]?.slug ?? "analisis-de-datos"
  );
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

  return (
    <div className="bg-[#F7F9FC] text-slate-900 min-h-screen relative overflow-hidden font-sans">
      {/* Pitch / field pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[520px] bg-gradient-to-b from-emerald-50 via-[#F7F9FC] to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #0F172A 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, #0F172A 0 1px, transparent 1px 48px)",
          }}
        />
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-red-200/30 blur-[100px]" />
        <div className="absolute -top-16 -right-24 w-[420px] h-[420px] rounded-full bg-sky-200/40 blur-[100px]" />
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-28 pb-10 lg:pt-32 lg:pb-16">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6">
          {/* Stadium ticket banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Trophy size={13} className="text-emerald-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-800">
                Predicción oficial · Solo miembros · Sorteo de cursos
              </span>
            </div>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.08] mb-4 text-slate-950"
            >
              ¿Quién ganará el{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-[#1890FF]">
                  Gran Partido
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-emerald-400/50 to-sky-400/50" />
              </span>
              ?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Predice el resultado entre{" "}
              <strong className="text-red-700">España</strong> y{" "}
              <strong className="text-sky-700">Argentina</strong>.{" "}
              <span className="text-slate-800 font-semibold">
                Entre quienes acierten al país ganador se sortearán cursos
              </span>{" "}
              a elección.
            </motion.p>
          </div>

          {/* Highlight prize strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-5 py-4 shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pl-2">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 shrink-0">
                  <Trophy className="text-amber-600" size={22} />
                </div>
                <div className="text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    Solo quienes voten al país ganador entran al sorteo
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Si tu predicción es correcta, participas por un curso de
                    ProgramBI a tu elección. Si no aciertas, no entras al bolillero.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VS match card — stadium style */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="relative rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
              {/* Top jersey stripes */}
              <div className="h-1.5 flex">
                <div className="flex-1 bg-gradient-to-r from-red-600 to-amber-400" />
                <div className="flex-1 bg-gradient-to-r from-sky-400 to-sky-200" />
              </div>

              {/* Pitch green header */}
              <div className="relative bg-gradient-to-b from-emerald-700 to-emerald-800 px-5 py-4 text-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.08) 28px, rgba(255,255,255,0.08) 56px)",
                  }}
                />
                <p className="relative text-[11px] font-black uppercase tracking-[0.22em] text-emerald-100">
                  Gran Partido · Elige tu predicción
                </p>
              </div>

              <div className="p-5 sm:p-8">
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
                        className={`group relative flex-1 text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-300 bg-white ${
                          isSelected
                            ? `${team.borderSel} shadow-lg ring-2 ${team.ring}/30 ${team.soft}`
                            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                        } ${locked && !isSelected ? "opacity-45" : ""} ${
                          locked || submitting ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="text-emerald-500" size={22} />
                          </div>
                        )}

                        <div className="flex flex-col items-center text-center">
                          <TeamFlag team={team} size="lg" />
                          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {team.short}
                          </p>
                          <h2
                            className={`text-2xl sm:text-3xl font-black font-display tracking-tight mt-1 ${team.accent}`}
                          >
                            {team.name}
                          </h2>

                          {/* Solo % — sin cantidad de votos */}
                          <div className="mt-4 w-full">
                            <p className="text-3xl font-black tabular-nums text-slate-900">
                              {loading ? "—" : `${share}%`}
                            </p>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                              de las predicciones
                            </p>
                            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: loading ? "50%" : `${share}%` }}
                                transition={{ duration: 0.9, delay: 0.25 + idx * 0.08 }}
                                className={`h-full rounded-full bg-gradient-to-r ${team.bar}`}
                              />
                            </div>
                          </div>

                          {!locked && (
                            <span
                              className={`mt-5 inline-flex text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition ${
                                isSelected
                                  ? team.badge + " border-transparent"
                                  : "border-slate-200 text-slate-600 group-hover:border-slate-300 bg-slate-50"
                              }`}
                            >
                              {isSelected ? "Tu predicción" : "Elegir equipo"}
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
                          className="flex items-center justify-center sm:px-1 -my-1 sm:my-0"
                        >
                          <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-xl border-4 border-white ring-2 ring-slate-200">
                            VS
                          </div>
                        </div>,
                      ];
                    }
                    return [card];
                  })}
                </div>

                {/* Comparative bar */}
                {!loading && (
                  <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-red-600">España {espPct}%</span>
                      <span className="text-slate-400 normal-case tracking-normal font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Tendencia en vivo
                      </span>
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
              </div>
            </div>
          </motion.div>

          {/* Vote panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            id="votar"
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_-28px_rgba(15,23,42,0.2)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 via-emerald-500 to-sky-400" />

              <div className="p-6 sm:p-8">
                {hasVoted ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4">
                      <Trophy className="text-amber-500" size={30} />
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900 mb-2">
                      ¡Predicción registrada!
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-5 max-w-md mx-auto leading-relaxed">
                      Apostaste por{" "}
                      <strong className="text-slate-900">
                        {userVote.team === "espana" ? "España" : "Argentina"}
                      </strong>
                      . Si ese es el país ganador, entras al sorteo de{" "}
                      <strong className="text-emerald-700">
                        {userVote.preferred_course_title}
                      </strong>
                      .
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-800 font-semibold">
                      <CheckCircle2 size={16} />
                      Estás en el bolillero solo si tu equipo gana
                    </div>
                  </div>
                ) : !authenticated ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                      <Lock className="text-slate-500" size={26} />
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900 mb-2">
                      Solo para miembros
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                      Regístrate o inicia sesión para registrar tu predicción.
                      Entre quienes acierten al país ganador se sortearán cursos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setAuthModal({ isOpen: true, tab: "register" })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1890FF] to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-10px_rgba(24,144,255,0.55)] hover:brightness-110 transition"
                      >
                        Crear cuenta gratis
                        <ArrowRight size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAuthModal({ isOpen: true, tab: "login" })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Ya soy miembro
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md">
                        <Ticket className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-display text-slate-900">
                          Completa tu boleto
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Equipo + curso premio. Si aciertas, entras al sorteo.
                        </p>
                      </div>
                    </div>

                    {/* Selected team */}
                    <div className="mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        1. Tu equipo
                      </p>
                      {selectedTeamData ? (
                        <div
                          className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${selectedTeamData.soft} ${selectedTeamData.borderSel.split(" ")[0]}`}
                        >
                          <TeamFlag team={selectedTeamData} size="sm" />
                          <div>
                            <p className={`font-bold ${selectedTeamData.accent}`}>
                              {selectedTeamData.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Un solo voto por miembro · no se puede cambiar
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                          Arriba, toca la tarjeta de España o Argentina para elegir.
                        </p>
                      )}
                    </div>

                    {/* Course cards */}
                    <div className="mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        2. Curso que quieres ganar
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                        {prizeCourses.map((c) => {
                          const selected = selectedCourse === c.slug;
                          return (
                            <button
                              key={c.slug}
                              type="button"
                              onClick={() => setSelectedCourse(c.slug)}
                              className={`group relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                                selected
                                  ? "border-[#1890FF] shadow-md ring-2 ring-[#1890FF]/15 bg-blue-50/40"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                                <Image
                                  src={c.imageUrl}
                                  alt={c.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, 280px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                                {selected && (
                                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1890FF] text-white flex items-center justify-center shadow">
                                    <CheckCircle2 size={15} />
                                  </div>
                                )}
                                <div
                                  className="absolute bottom-0 left-0 right-0 h-1"
                                  style={{ backgroundColor: c.accentColor }}
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                  {c.title}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                  {c.techStack.join(" · ")}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {selectedCourseData && (
                        <p className="text-xs text-slate-500 mt-3 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                          <span className="font-semibold text-slate-700">
                            Premio elegido:{" "}
                          </span>
                          {selectedCourseData.title} —{" "}
                          {selectedCourseData.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Reminder raffle */}
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 flex gap-3">
                      <Gift className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                      <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        <strong>Importante:</strong> entre todos los miembros que
                        voten al país que resulte ganador se sortearán cursos. Si
                        tu equipo no gana, no participas del sorteo.
                      </p>
                    </div>

                    {error && (
                      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    {successMsg && (
                      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {successMsg}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleVote}
                      disabled={submitting || !selectedTeam}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-sm font-black text-white shadow-[0_14px_36px_-12px_rgba(5,150,105,0.55)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                    <p className="text-[11px] text-slate-400 text-center mt-3">
                      Un voto por miembro. No se puede modificar después.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-16 lg:py-20 border-t border-slate-200/80 bg-white">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3">
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
                <div className="h-full rounded-3xl border border-slate-200 bg-[#F7F9FC] p-6 hover:border-slate-300 hover:shadow-sm transition">
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
      <section className="relative py-16 lg:py-20">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="rounded-[32px] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-8 sm:p-12 overflow-hidden relative shadow-sm">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/30 blur-[90px] pointer-events-none" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-white px-3 py-1.5 mb-4 shadow-sm">
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
                  entran al bolillero. Entre ellos se sortean cursos de ProgramBI:
                  Power BI, Python, SQL, IA, Excel y más.
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
                <p className="text-xs text-slate-400 mt-3 text-center">
                  + {Math.max(0, prizeCourses.length - 6)} cursos más al
                  completar tu boleto
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section className="relative py-10 bg-white border-y border-slate-200/80">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Un voto por miembro",
                desc: "Solo cuentas autenticadas. Sin duplicados ni bots visibles.",
              },
              {
                icon: Star,
                title: "Sorteo entre acertantes",
                desc: "Únicamente quienes elijan al país ganador entran al bolillero.",
              },
              {
                icon: Gift,
                title: "Premio de valor real",
                desc: "Un curso profesional de ProgramBI a elección del ganador.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-slate-200 bg-[#F7F9FC] p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-emerald-600" />
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
      <section className="relative py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3">
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
      <section className="relative py-14 lg:py-20 pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <FadeIn>
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 sm:p-14 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-emerald-500 to-sky-400" />
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mb-5">
                <Trophy className="text-emerald-600" size={26} />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4 text-slate-950">
                ¿Listo para predecir?
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Elige tu equipo. Elige tu curso. Si aciertas al país ganador,
                entras al sorteo de cursos de ProgramBI.
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-7 py-3.5 text-sm font-black shadow-[0_12px_32px_-10px_rgba(5,150,105,0.5)] hover:brightness-105 transition"
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
