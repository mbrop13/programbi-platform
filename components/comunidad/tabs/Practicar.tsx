"use client";

// =============================================================================
// Pestaña "Practicar" · Página principal del clon de Duolingo.
//
// Vista:
//  1) Header con XP global + vidas.
//  2) Selector de Units (Power BI, SQL Server, IA, Python, Excel…).
//  3) Cabecera de Unit con anillo de progreso circular.
//  4) Path serpenteante con sendero SVG conector (estilo Duolingo):
//     cada nodo es un círculo (lesson/bonus/checkpoint/trophy).
//  5) Al pulsar un nodo: abre LessonPlayer a pantalla completa.
//
// Estados visuales de cada nodo:
//   - completed  (verde ✓, con leve bounce al completar)
//   - active/siguiente (color de acento del Unit, bounce continuo, chip "EMPEZAR")
//   - locked     (gris, candado)
// =============================================================================

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import type { Level, LevelKind, Unit } from "@/lib/practice/types";
import { usePracticeProgress } from "@/lib/practice/progress";
import LessonPlayer from "../practice/LessonPlayer";

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

// Posiciones horizontales en % para el zig-zag (path estilo Duolingo).
// Cada nivel ocupa su propia "fila".
const LANE_POSITIONS = [50, 30, 20, 35, 55, 70, 75, 60, 35, 20, 30, 50];

export default function Practicar() {
  const { progress, maxHearts, isLevelCompleted, markLevelComplete } =
    usePracticeProgress();

  const [activeUnitId, setActiveUnitId] = useState<string>(PRACTICE_UNITS[0].id);
  const [openLevel, setOpenLevel] = useState<{ unit: Unit; level: Level } | null>(null);

  const activeUnit = PRACTICE_UNITS.find((u) => u.id === activeUnitId)!;

  const completedCount = activeUnit.levels.filter((l) =>
    isLevelCompleted(activeUnit.id, l.id)
  ).length;
  const nextIdx = Math.min(completedCount, activeUnit.levels.length - 1);

  const isLocked = (idx: number) => idx > nextIdx;
  const isDone = (id: string) => isLevelCompleted(activeUnit.id, id);

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-text">
            Practica
          </h1>
          <p className="text-text-secondary mt-1">
            Micro-lecciones gamificadas. Gana XP y mantén tu racha.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatBadge
            icon={<Star className="w-4 h-4 fill-text text-text" />}
            label={`${progress.xpTotal}`}
            sub="XP"
            color="amber"
          />
          <StatBadge
            icon={<Heart className="w-4 h-4 fill-rose-500 text-rose-500" />}
            label={`${maxHearts}`}
            sub="vidas"
            color="rose"
          />
        </div>
      </div>

      {/* ── Selector de Units ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-8">
        {PRACTICE_UNITS.map((u) => {
          const Icon = ICON_MAP[u.icon] ?? Database;
          const completedInUnit = u.levels.filter((l) =>
            isLevelCompleted(u.id, l.id)
          ).length;
          const total = u.levels.length;
          const pct = total ? Math.round((completedInUnit / total) * 100) : 0;
          const isActive = u.id === activeUnitId;
          return (
            <motion.button
              key={u.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveUnitId(u.id)}
              className={cn(
                "group relative flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-xl border-2 transition-all",
                isActive
                  ? "shadow-sm"
                  : "border-border bg-surface hover:border-border-strong"
              )}
              style={
                isActive
                  ? { borderColor: u.accentColor, background: `${u.accentColor}10` }
                  : undefined
              }
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: u.accentColor }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-semibold text-sm text-text leading-tight">
                  {u.emoji ? `${u.emoji} ` : ""}
                  {u.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-text-muted">
                    {completedInUnit}/{total}
                  </span>
                  <span className="w-12 h-1 rounded-full bg-surface-hover overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${pct}%`, background: u.accentColor }}
                    />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Cabecera del Unit con anillo de progreso ──────────────────────── */}
      <UnitHeader unit={activeUnit} completed={completedCount} />

      {/* ── Path serpenteante ─────────────────────────────────────────────── */}
      <div className="relative pb-16 mt-4">
        <PathBoard
          unit={activeUnit}
          isDone={isDone}
          isLocked={isLocked}
          onOpen={(lvl) => setOpenLevel({ unit: activeUnit, level: lvl })}
          nextIdx={nextIdx}
        />
      </div>

      {/* ── Player ─────────────────────────────────────────────────────────── */}
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
// Cabecera de Unit con anillo circular de progreso.
// ─────────────────────────────────────────────────────────────────────────────
function UnitHeader({ unit, completed }: { unit: Unit; completed: number }) {
  const total = unit.levels.length;
  const pct = total ? completed / total : 0;
  const R = 28;
  const C = 2 * Math.PI * R;

  const Icon = ICON_MAP[unit.icon] ?? Database;

  return (
    <motion.div
      key={unit.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-6 mb-2 border border-border bg-surface flex items-center gap-5"
    >
      {/* anillo */}
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
          <motion.circle
            cx="35"
            cy="35"
            r={R}
            fill="none"
            stroke={unit.accentColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - pct) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-white rounded-full"
          style={{ background: unit.accentColor }}
        >
          <Icon className="w-8 h-8" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{unit.emoji}</span>
          <h2 className="font-display font-bold text-xl text-text">
            {unit.title}
          </h2>
        </div>
        <p className="text-text-secondary text-sm mb-2">{unit.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary">
            {completed} de {total} niveles
          </span>
          <span className="text-xs font-semibold text-text-muted">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tablero con path serpenteante + sendero SVG conector.
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

  return (
    <div className="flex flex-col items-center gap-0">
      {/* path conector SVG */}
      <PathConnector
        count={levels.length}
        accent={unit.accentColor}
        nextIdx={nextIdx}
      />

      {/* nodos */}
      {levels.map((lvl, i) => (
        <PathNode
          key={lvl.id}
          level={lvl}
          index={i}
          done={isDone(lvl.id)}
          locked={isLocked(i)}
          isActive={i === nextIdx}
          onClick={() => !isLocked(i) && onOpen(lvl)}
          accent={unit.accentColor}
        />
      ))}
    </div>
  );
}

// Sendero SVG que conecta los nodos. Dibuja una curva suave (smooth) a través
// de los puntos (x en lane%, y en el centro de cada fila).
function PathConnector({
  count,
  accent,
  nextIdx,
}: {
  count: number;
  accent: string;
  nextIdx: number;
}) {
  if (count < 2) return null;

  // Construimos puntos en un viewBox 100 x (count*100) → un nodo cada 100u.
  const ROW_H = 100;
  const pts = Array.from({ length: count }).map((_, i) => ({
    x: LANE_POSITIONS[i % LANE_POSITIONS.length],
    y: i * ROW_H + ROW_H / 2,
  }));

  // Curva suave usando comandos cúbicos.
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cy = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  const h = count * ROW_H;
  // Sendero completado (en color): repetimos los comandos C hasta nextIdx.
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
      className="absolute left-0 top-0 w-full h-full pointer-events-none"
      style={{ height: `${h}px` }}
      viewBox={`0 0 100 ${h}`}
      preserveAspectRatio="none"
    >
      {/* sendero gris base */}
      <path
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* sendero completado en color */}
      {nextIdx > 0 && (
        <motion.path
          d={dDone}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

// Un nodo individual del path.
function PathNode({
  level,
  index,
  done,
  locked,
  isActive,
  onClick,
  accent,
}: {
  level: Level;
  index: number;
  done: boolean;
  locked: boolean;
  isActive: boolean;
  onClick: () => void;
  accent: string;
}) {
  const kindIcon = (kind: LevelKind) => {
    switch (kind) {
      case "bonus":
        return <Star className="w-7 h-7" />;
      case "checkpoint":
        return <Shield className="w-7 h-7" />;
      case "trophy":
        return <Trophy className="w-7 h-7" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 18 }}
      className="relative flex flex-col items-center"
      style={{ marginBottom: 56, marginTop: index === 0 ? 0 : undefined }}
    >
      {/* chip "EMPEZAR" estilo Duolingo */}
      <AnimatePresence>
        {isActive && !done && level.kind === "lesson" && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute -top-10"
          >
            <span
              className="px-3 py-1 rounded-lg text-[11px] font-bold text-white shadow-md whitespace-nowrap"
              style={{ background: accent }}
            >
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
            : { scale: done ? [1, 1.15, 1] : 1 }
        }
        transition={
          isActive && !done
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
        }
        whileHover={!locked ? { scale: 1.1 } : {}}
        whileTap={!locked ? { scale: 0.9 } : {}}
        onClick={onClick}
        disabled={locked}
        className={cn(
          "relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-bold text-white shadow-lg",
          locked && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: locked ? "#94a3b8" : done ? "#10B981" : accent,
          boxShadow:
            done || locked
              ? undefined
              : `0 12px 24px -8px ${accent}, 0 0 0 6px ${accent}25`,
        }}
      >
        {/* halo animado para el nodo activo */}
        {isActive && !done && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: accent }}
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <span className="relative z-10">
          {locked ? (
            <Lock className="w-7 h-7" />
          ) : done ? (
            <Check className="w-8 h-8" strokeWidth={3} />
          ) : (
            kindIcon(level.kind) ?? (
              <span className="text-2xl font-black">{index + 1}</span>
            )
          )}
        </span>
      </motion.button>

      <span
        className={cn(
          "mt-3 text-xs font-semibold text-center max-w-[150px]",
          locked ? "text-text-muted" : "text-text-secondary"
        )}
      >
        {level.title}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatBadge (XP / vidas).
// ─────────────────────────────────────────────────────────────────────────────
function StatBadge({
  icon,
  label,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: "amber" | "rose";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3.5 h-10 rounded-full border text-sm font-bold",
        color === "amber"
          ? "border-border bg-surface-hover text-text"
          : "border-border bg-surface-hover text-text"
      )}
    >
      {icon}
      <span className="tabular-nums">{label}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {sub}
      </span>
    </div>
  );
}
