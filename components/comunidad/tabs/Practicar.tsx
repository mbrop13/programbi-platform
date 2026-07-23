"use client";

// =============================================================================
// Pestaña "Practicar" · Módulo de lecciones interactivas tipo Duolingo.
//
// Fiel a la Imagen 1 de Duolingo (Ruta central + Panel de Widgets lateral derecho)
// y paleta de colores oficial de ProgramBI.
// =============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
  Table,
  Workflow,
  Cpu,
  Lock,
  Check,
  Star,
  Shield,
  Trophy,
  Heart,
  Target,
  Sparkles,
  Flame,
  Settings,
  ChevronDown,
  Play,
  BookOpen,
  ArrowLeft,
  Crown,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import type { Level, LevelKind, Unit } from "@/lib/practice/types";
import { usePracticeProgress } from "@/lib/practice/progress";
import LessonPlayer from "../practice/LessonPlayer";
import OnboardingModal from "../practice/OnboardingModal";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
  Table,
  Workflow,
  Cpu,
};

// Secuencia suave de posiciones % para la ruta de niveles.
const LANE_POSITIONS = [50, 32, 18, 32, 50, 68, 82, 68];

export default function Practicar() {
  const {
    progress,
    maxHearts,
    isLevelCompleted,
    markLevelComplete,
    completeOnboarding,
    setActiveUnit,
  } = usePracticeProgress();

  const [openLevel, setOpenLevel] = useState<{ unit: Unit; level: Level } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);

  // Sync active unit with saved state or default to first
  const activeUnitId = progress.activeUnitId || PRACTICE_UNITS[0].id;
  const activeUnit = PRACTICE_UNITS.find((u) => u.id === activeUnitId) || PRACTICE_UNITS[0];

  // Auto-trigger onboarding modal for first-time users
  useEffect(() => {
    if (!progress.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [progress.hasCompletedOnboarding]);

  const completedCount = activeUnit.levels.filter((l) =>
    isLevelCompleted(activeUnit.id, l.id)
  ).length;
  const nextIdx = Math.min(completedCount, activeUnit.levels.length - 1);

  const isLocked = (idx: number) => idx > nextIdx;
  const isDone = (id: string) => isLevelCompleted(activeUnit.id, id);

  const activeLevel = activeUnit.levels[nextIdx];

  const handleOnboardingComplete = (unitId: string, dailyGoalXP: number) => {
    completeOnboarding(unitId, dailyGoalXP);
    setShowOnboarding(false);
  };

  const handleSelectTrack = (unitId: string) => {
    setActiveUnit(unitId);
    setTrackDropdownOpen(false);
  };

  const todayXpPct = Math.min(
    100,
    Math.round((progress.todayXPEarned / (progress.dailyGoalXP || 20)) * 100)
  );

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-16">
      {/* ── LAYOUT DE 2 COLUMNAS (Estilo Duolingo Imagen 1) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA / CENTRAL: Ruta de Aprendizaje (Path Board) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
          
          {/* Banner de Sección Superior (Matching Duolingo Banner verde Imagen 1) */}
          <motion.div
            key={activeUnit.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[620px] rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between gap-4 mb-6 relative overflow-hidden"
            style={{ background: activeUnit.accentColor }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0 text-white"
                title="Cambiar Ruta"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  ETAPA 1, SECCIÓN {PRACTICE_UNITS.findIndex((u) => u.id === activeUnit.id) + 1}
                </div>
                <h2 className="font-display font-black text-lg sm:text-xl truncate leading-tight">
                  {activeUnit.emoji} {activeUnit.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => activeLevel && setOpenLevel({ unit: activeUnit, level: activeLevel })}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm shrink-0 transition-all border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>GUÍA</span>
            </button>
          </motion.div>

          {/* Tablero Serpenteante con Mascota junto al Nodo Activo */}
          <div className="w-full relative">
            <PathBoard
              unit={activeUnit}
              isDone={isDone}
              isLocked={isLocked}
              onOpen={(lvl) => setOpenLevel({ unit: activeUnit, level: lvl })}
              nextIdx={nextIdx}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Widgets Laterales Estilo Duolingo (Imagen 1 Panel Derecho) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5 sticky top-6">
          
          {/* Top Bar Right Stats Widget (Flag / Flame / Gems / Hearts) */}
          <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between gap-2">
            {/* Dropdown Ruta */}
            <div className="relative">
              <button
                onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-hover hover:border-border-strong border border-border text-xs font-bold text-text transition-all"
              >
                <span>{activeUnit.emoji}</span>
                <span className="truncate max-w-[90px]">{activeUnit.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              <AnimatePresence>
                {trackDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-56 bg-surface border border-border rounded-2xl shadow-xl p-2 z-40 space-y-1"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase">
                      Cambiar Tecnología
                    </div>
                    {PRACTICE_UNITS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelectTrack(u.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-colors",
                          u.id === activeUnit.id ? "bg-accent/10 text-accent font-bold" : "hover:bg-surface-hover text-text"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{u.emoji}</span>
                          <span className="truncate">{u.title}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Racha, XP, Vidas */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500" title="Racha Diaria">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{progress.streakDays || 1}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-text" title="XP Acumulado">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{progress.xpTotal}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-rose-500" title="Vidas">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{maxHearts}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 1: Desafíos del Día (Matching Duolingo Card "Desafíos del día" Imagen 1) */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-text flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Desafíos del Día
              </h3>
              <span className="text-[11px] font-bold text-accent uppercase">Ver Todos</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-hover border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-text flex items-center justify-between">
                  <span>Gana {progress.dailyGoalXP || 20} EXP</span>
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${todayXpPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-text-muted mt-1 text-right font-bold">
                  {progress.todayXPEarned} / {progress.dailyGoalXP || 20} EXP
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Nivel & Progreso de la Unidad */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-text flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Avance en {activeUnit.title}
              </h3>
              <span className="text-xs font-bold text-text-muted">
                {completedCount}/{activeUnit.levels.length}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Completa {activeUnit.levels.length - completedCount} lecciones más para desbloquear el trofeo final de esta unidad.
            </p>

            {activeLevel && (
              <button
                onClick={() => setOpenLevel({ unit: activeUnit, level: activeLevel })}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-md hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Siguiente: {activeLevel.title}
              </button>
            )}
          </div>

          {/* Tarjeta 3: Reconfigurar Meta Diaria */}
          <div className="p-4 rounded-2xl bg-surface-hover border border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent/15 text-accent">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-text">Meta Diaria: {progress.dailyGoalXP || 20} XP</div>
                <div className="text-[11px] text-text-muted">Ajusta tu ritmo cuando quieras</div>
              </div>
            </div>

            <button
              onClick={() => setShowOnboarding(true)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-hover transition-colors"
            >
              Cambiar
            </button>
          </div>

        </div>

      </div>

      {/* ── ONBOARDING TUTORIAL MODAL (Imagen 2) ──────────────────────────── */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => setShowOnboarding(false)}
      />

      {/* ── LESSON PLAYER MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {openLevel && (
          <LessonPlayer
            unit={openLevel.unit}
            level={openLevel.level}
            maxHearts={maxHearts}
            onClose={() => setOpenLevel(null)}
            onComplete={(heartsLeft) => {
              markLevelComplete(
                openLevel.unit.id,
                openLevel.level.id,
                openLevel.level.xp,
                heartsLeft
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tablero de Ruta de Niveles con Mascota Avatar en el Nodo Activo.
// ─────────────────────────────────────────────────────────────────────────────
function PathBoard({
  unit,
  isDone,
  isLocked,
  onOpen,
  nextIdx,
}: {
  unit: Unit;
  isDone: (id: string) => boolean;
  isLocked: (idx: number) => boolean;
  onOpen: (l: Level) => void;
  nextIdx: number;
}) {
  const levels = unit.levels;
  const ROW_HEIGHT = 135;
  const totalHeight = levels.length * ROW_HEIGHT + 40;

  return (
    <div
      className="relative w-full max-w-[620px] mx-auto"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Sendero SVG Conector */}
      <PathConnector
        count={levels.length}
        accent={unit.accentColor}
        nextIdx={nextIdx}
        rowHeight={ROW_HEIGHT}
        totalHeight={totalHeight}
      />

      {/* Nodos de Nivel en Coordenadas Exactas */}
      {levels.map((lvl, i) => {
        const xPct = LANE_POSITIONS[i % LANE_POSITIONS.length];
        const yPx = i * ROW_HEIGHT + 70;
        return (
          <PathNode
            key={lvl.id}
            level={lvl}
            index={i}
            done={isDone(lvl.id)}
            locked={isLocked(i)}
            isActive={i === nextIdx}
            onClick={() => !isLocked(i) && onOpen(lvl)}
            accent={unit.accentColor}
            xPct={xPct}
            yPx={yPx}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Conector SVG con curvas Bezier.
// ─────────────────────────────────────────────────────────────────────────────
function PathConnector({
  count,
  accent,
  nextIdx,
  rowHeight,
  totalHeight,
}: {
  count: number;
  accent: string;
  nextIdx: number;
  rowHeight: number;
  totalHeight: number;
}) {
  if (count < 2) return null;

  const pts = Array.from({ length: count }).map((_, i) => ({
    x: LANE_POSITIONS[i % LANE_POSITIONS.length],
    y: i * rowHeight + 70,
  }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cy = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  let dDone = `M ${pts[0].x} ${pts[0].y}`;
  const endIdx = Math.min(nextIdx, pts.length - 1);
  for (let i = 1; i <= endIdx; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cy = (p0.y + p1.y) / 2;
    dDone += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 100 ${totalHeight}`}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {nextIdx > 0 && (
        <motion.path
          d={dDone}
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#path-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nodo individual con Mascota / Avatar junto al nodo activo (Duolingo Style Imagen 1).
// ─────────────────────────────────────────────────────────────────────────────
function PathNode({
  level,
  index,
  done,
  locked,
  isActive,
  onClick,
  accent,
  xPct,
  yPx,
}: {
  level: Level;
  index: number;
  done: boolean;
  locked: boolean;
  isActive: boolean;
  onClick: () => void;
  accent: string;
  xPct: number;
  yPx: number;
}) {
  const kindIcon = (kind: LevelKind) => {
    switch (kind) {
      case "bonus":
        return <Star className="w-6 h-6 fill-amber-400 text-amber-400" />;
      case "checkpoint":
        return <Shield className="w-6 h-6 text-indigo-400" />;
      case "trophy":
        return <Trophy className="w-7 h-7 text-amber-300" />;
      default:
        return null;
    }
  };

  // Coordenada offset para posicionar la Mascota al lado derecho del nodo activo
  const mascotOffset = xPct > 50 ? -80 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 220, damping: 18 }}
      className="absolute flex flex-col items-center z-10"
      style={{
        left: `${xPct}%`,
        top: `${yPx}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Floating chip "EMPEZAR" para el nivel activo */}
      <AnimatePresence>
        {isActive && !done && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute -top-11 z-20 pointer-events-none"
          >
            <span
              className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-1 whitespace-nowrap"
              style={{ background: accent }}
            >
              <Sparkles className="w-3 h-3" />
              EMPEZAR
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                style={{ background: accent }}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascota / Avatar junto al nodo activo (Duolingo Style Imagen 1) */}
      {isActive && !done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 0.3 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${mascotOffset}px`,
            top: "-10px",
          }}
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center text-accent">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black/30 rounded-full blur-[2px]" />
          </div>
        </motion.div>
      )}

      {/* Botón del Nodo */}
      <motion.button
        animate={
          isActive && !done
            ? { y: [0, -6, 0] }
            : { scale: 1 }
        }
        transition={
          isActive && !done
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        whileHover={!locked ? { scale: 1.12 } : {}}
        whileTap={!locked ? { scale: 0.92 } : {}}
        onClick={onClick}
        disabled={locked}
        className={cn(
          "relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-white transition-all shadow-md",
          locked && "opacity-60 cursor-not-allowed border border-border bg-surface-hover"
        )}
        style={{
          background: locked
            ? "var(--surface-hover)"
            : done
            ? "#10B981"
            : accent,
          boxShadow:
            done
              ? "0 8px 20px -4px rgba(16, 185, 129, 0.4)"
              : locked
              ? "none"
              : `0 10px 24px -4px ${accent}60, 0 0 0 4px ${accent}20`,
        }}
      >
        {isActive && !done && (
          <motion.span
            className="absolute inset-0 rounded-2xl"
            style={{ background: accent }}
            animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <span className="relative z-10 flex flex-col items-center justify-center">
          {locked ? (
            <Lock className="w-6 h-6 text-text-muted" />
          ) : done ? (
            <Check className="w-7 h-7 stroke-[3]" />
          ) : (
            kindIcon(level.kind) ?? (
              <span className="text-xl sm:text-2xl font-black">{index + 1}</span>
            )
          )}
        </span>
      </motion.button>

      {/* Título de Nivel & Badge XP */}
      <div className="mt-2.5 flex flex-col items-center text-center max-w-[140px]">
        <span
          className={cn(
            "text-xs font-semibold leading-tight line-clamp-2",
            locked ? "text-text-muted" : "text-text"
          )}
        >
          {level.title}
        </span>
        {level.xp > 0 && !locked && (
          <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
            +{level.xp} XP
          </span>
        )}
      </div>
    </motion.div>
  );
}
