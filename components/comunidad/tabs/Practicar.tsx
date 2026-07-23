"use client";

// =============================================================================
// Pestaña "Practicar" · Módulo de lecciones interactivas tipo Duolingo.
//
// Flujo de Usuario Nivel Producción / Empresarial:
//  1) Detección automática de primera visita -> Tutorial Onboarding Modal.
//  2) Barra Superior Estilo Juego (Game Header):
//     - Desplegable de Ruta Activa (Power BI, SQL, Python, Excel, IA).
//     - Medidor de Meta Diaria de XP.
//     - Contador de Racha (Streak) & Vidas.
//     - Botón de Configuración de Metas (⚙️).
//  3) Banner de Inicio de Sección con Botón "Continuar Siguiente Lección".
//  4) Ruta Serpenteante (Path Board) sincronizada con precisión SVG/HTML.
//  5) LessonPlayer modal para responder las preguntas.
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

// Secuencia suave y simétrica de posiciones % para la ruta de niveles.
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
    <div className="w-full max-w-[1200px] mx-auto pb-16">
      {/* ── BARRA SUPERIOR ESTILO DUOLINGO (Game Header Bar) ───────────────────── */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 mb-8 rounded-b-2xl shadow-sm flex items-center justify-between gap-3">
        {/* Selector Desplegable de Ruta Activa */}
        <div className="relative">
          <button
            onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-surface-hover border border-border hover:border-border-strong transition-all text-left group"
          >
            <span
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 text-xs shadow-sm"
              style={{ background: activeUnit.accentColor }}
            >
              {activeUnit.emoji || "🎯"}
            </span>
            <div className="hidden xs:block">
              <div className="text-[10px] uppercase font-bold text-text-muted leading-none">
                Ruta Actual
              </div>
              <div className="font-bold text-xs sm:text-sm text-text leading-tight flex items-center gap-1">
                {activeUnit.title}
                <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-text transition-colors" />
              </div>
            </div>
          </button>

          {/* Menu Desplegable de Rutas */}
          <AnimatePresence>
            {trackDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-64 bg-surface border border-border rounded-2xl shadow-xl p-2 z-40 space-y-1"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-text-muted">
                  Cambiar Ruta de Aprendizaje
                </div>
                {PRACTICE_UNITS.map((u) => {
                  const Icon = ICON_MAP[u.icon] ?? Database;
                  const isCurrent = u.id === activeUnit.id;
                  const completedInU = u.levels.filter((l) =>
                    isLevelCompleted(u.id, l.id)
                  ).length;
                  const pct = Math.round((completedInU / u.levels.length) * 100);

                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectTrack(u.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors text-xs font-semibold",
                        isCurrent
                          ? "bg-accent/10 text-accent font-bold"
                          : "hover:bg-surface-hover text-text"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 text-[10px]"
                          style={{ background: u.accentColor }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate">{u.title}</span>
                      </div>
                      <span className="text-[11px] text-text-muted font-normal">
                        {pct}%
                      </span>
                    </button>
                  );
                })}
                <div className="pt-1 border-t border-border mt-1">
                  <button
                    onClick={() => {
                      setTrackDropdownOpen(false);
                      setShowOnboarding(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-hover text-xs font-bold text-accent transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Ajustar Meta & Tutorial
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats & Game Widgets */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Medidor de Meta Diaria */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-hover border border-border text-xs">
            <Target className="w-4 h-4 text-accent" />
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                <span>Meta Diaria</span>
                <span className="text-accent">{progress.todayXPEarned}/{progress.dailyGoalXP || 20} XP</span>
              </div>
              <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden mt-0.5">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${todayXpPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Racha */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>{progress.streakDays || 1} {progress.streakDays === 1 ? "Día" : "Días"}</span>
          </div>

          {/* XP Total */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-surface-hover border border-border text-xs font-bold text-text">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{progress.xpTotal} XP</span>
          </div>

          {/* Vidas */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>{maxHearts}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="p-2 rounded-2xl bg-surface-hover border border-border hover:border-border-strong text-text-secondary hover:text-text transition-colors"
            title="Configurar Meta Diaria"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CABECERA DE INICIO DE SECCIÓN DUOLINGO (Section Home Banner) ────────── */}
      <div className="mb-8">
        <UnitHeader
          unit={activeUnit}
          completed={completedCount}
          activeLevel={activeLevel}
          onStartActiveLevel={() => setOpenLevel({ unit: activeUnit, level: activeLevel })}
        />
      </div>

      {/* ── TABLERO DE RUTA DE NIVELES (Path Board) ─────────────────────────── */}
      <div className="relative">
        <PathBoard
          unit={activeUnit}
          isDone={isDone}
          isLocked={isLocked}
          onOpen={(lvl) => setOpenLevel({ unit: activeUnit, level: lvl })}
          nextIdx={nextIdx}
        />
      </div>

      {/* ── ONBOARDING TUTORIAL MODAL ─────────────────────────────────────── */}
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
// Banner de Inicio de Unidad con Botón "Continuar Siguiente Lección".
// ─────────────────────────────────────────────────────────────────────────────
function UnitHeader({
  unit,
  completed,
  activeLevel,
  onStartActiveLevel,
}: {
  unit: Unit;
  completed: number;
  activeLevel?: Level;
  onStartActiveLevel: () => void;
}) {
  const total = unit.levels.length;
  const pct = total ? completed / total : 0;
  const R = 32;
  const C = 2 * Math.PI * R;

  const Icon = ICON_MAP[unit.icon] ?? Database;

  return (
    <motion.div
      key={unit.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl p-6 sm:p-8 border border-border bg-surface shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left flex-1 min-w-0">
        {/* Anillo Circular SVG */}
        <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
          <svg className="w-22 h-22 -rotate-90 absolute" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
            <motion.circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke={unit.accentColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg z-10"
            style={{ background: unit.accentColor }}
          >
            <Icon className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-2xl">{unit.emoji}</span>
            <h2 className="font-display font-black text-2xl text-text">
              {unit.title}
            </h2>
          </div>
          <p className="text-text-secondary text-sm max-w-xl leading-relaxed">
            {unit.description}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-hover text-text">
              {completed} de {total} lecciones completadas
            </span>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ background: unit.accentColor }}
            >
              {Math.round(pct * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      {activeLevel && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartActiveLevel}
          className="w-full md:w-auto px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-3 shrink-0"
          style={{
            background: unit.accentColor,
            boxShadow: `0 12px 28px -6px ${unit.accentColor}50`,
          }}
        >
          <Play className="w-5 h-5 fill-white" />
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">
              Siguiente Lección
            </div>
            <div className="text-sm font-black leading-tight">
              {activeLevel.title}
            </div>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tablero de Ruta de Niveles.
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
// Conector SVG con curvas Bezier precisas.
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

  // Sendero completo
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cy = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  // Sendero completado
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
// Nodo individual en (xPct%, yPx).
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
