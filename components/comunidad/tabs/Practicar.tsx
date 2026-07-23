"use client";

// =============================================================================
// Pestaña "Practicar" · Módulo de lecciones interactivas.
//
// 100% Adaptado a dispositivos móviles (smartphones) y monitores de escritorio.
// Discos 3D circulares, barra superior flotante estilo juego AAA y
// mascota BIT transparente.
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
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import type { Level, LevelKind, Unit } from "@/lib/practice/types";
import { usePracticeProgress } from "@/lib/practice/progress";
import LessonPlayer from "../practice/LessonPlayer";
import OnboardingModal from "../practice/OnboardingModal";
import ChromaVideo from "../practice/ChromaVideo";

const BIT_VIDEO_URL = "https://mail.programbi.com/uploads/Mapache_saludando_a_c%C3%A1mara_con_202607222213.mp4";

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

// Mapeo de tiempo objetivo por ID de meta
const TIME_GOAL_MAP: Record<number, string> = {
  10: "5 min",
  20: "10 min",
  30: "15 min",
  50: "25 min",
};

// Secuencia suave de posiciones % optimizada para evitar recortes en celulares.
const LANE_POSITIONS = [50, 34, 22, 34, 50, 66, 78, 66];

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

  const dailyTimeGoal = TIME_GOAL_MAP[progress.dailyGoalXP] || "10 min";

  return (
    <div className="w-full max-w-[1300px] mx-auto pb-16 px-1 sm:px-4">
      {/* ── BARRA SUPERIOR FLOTANTE FLUIDA (En móviles se muestra primero) ─────── */}
      <div className="w-full flex items-center justify-between gap-2 py-2 mb-4">
        {/* Dropdown Ruta Flotante */}
        <div className="relative">
          <button
            onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface/80 hover:bg-surface border border-border/80 text-xs font-bold text-text transition-all shadow-sm backdrop-blur-md"
          >
            <span className="text-sm">{activeUnit.emoji}</span>
            <span className="truncate max-w-[110px] sm:max-w-[160px]">{activeUnit.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
          </button>

          <AnimatePresence>
            {trackDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-60 bg-surface border border-border rounded-2xl shadow-xl p-2 z-40 space-y-1"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase">
                  Cambiar Tecnología
                </div>
                {PRACTICE_UNITS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectTrack(u.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors",
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

        {/* Racha & Vidas Pro Flotantes */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Racha */}
          <div className="flex items-center gap-1.5 text-amber-500" title="Racha Diaria">
            <Flame className="w-5 h-5 fill-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] animate-pulse" />
            <span className="font-black text-xs sm:text-sm text-text">{progress.streakDays || 1}</span>
          </div>

          {/* Corazón Pro AAA */}
          <div className="flex items-center gap-1.5 text-rose-500" title="Vidas">
            <motion.div
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500 drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)]" />
            </motion.div>
            <span className="font-black text-xs sm:text-base text-text">{maxHearts}</span>
          </div>
        </div>
      </div>

      {/* ── LAYOUT RESPONSIVO DE 2 COLUMNAS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA / CENTRAL: Ruta 3D de Balderas */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center w-full">
          
          {/* Banner de Sección Superior (Verde/Acento) */}
          <motion.div
            key={activeUnit.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[620px] rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between gap-3 mb-6 relative overflow-hidden"
            style={{ background: activeUnit.accentColor }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
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
                <h2 className="font-display font-black text-base sm:text-xl truncate leading-tight">
                  {activeUnit.emoji} {activeUnit.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => activeLevel && setOpenLevel({ unit: activeUnit, level: activeLevel })}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm shrink-0 transition-all border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden xs:inline">GUÍA</span>
            </button>
          </motion.div>

          {/* Tablero Serpenteante 3D (Sin línea conectora) */}
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

        {/* COLUMNA DERECHA: Widgets Laterales */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6 w-full">
          
          {/* Tarjeta 1: Meta Diaria de Práctica */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Meta Diaria de Práctica
              </h3>
              <span className="text-xs font-bold text-accent">{dailyTimeGoal} / día</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-hover border border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-text flex items-center justify-between">
                  <span>Práctica de Hoy</span>
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Completa tu lección diaria para mantener tu racha activa.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Avance en la Unidad */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
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

          {/* Tarjeta 3: Configuración de Meta */}
          <div className="p-4 rounded-2xl bg-surface-hover border border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent/15 text-accent">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-text">Meta: {dailyTimeGoal} / día</div>
                <div className="text-[11px] text-text-muted">Ajusta tu rutina diaria</div>
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
// Tablero de Baldosas Circulares 3D.
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
  const ROW_HEIGHT = 130;
  const totalHeight = levels.length * ROW_HEIGHT + 40;

  return (
    <div
      className="relative w-full max-w-[620px] mx-auto"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Nodos de Nivel Circulares 3D */}
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
// Nodo Circular 3D adaptado a móviles.
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
        return <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-300 text-amber-300 drop-shadow-sm" />;
      case "checkpoint":
        return <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300 drop-shadow-sm" />;
      case "trophy":
        return <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow-sm" />;
      default:
        return null;
    }
  };

  // Coordenada adaptativa para posicionar a BIT sin desbordar pantallas pequeñas
  const mascotOffset = xPct > 50 ? -68 : 68;
  const shadowRimColor = done ? "#059669" : locked ? "rgba(0,0,0,0.25)" : `${accent}bb`;

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
      {/* Chip "EMPEZAR" para el nivel activo */}
      <AnimatePresence>
        {isActive && !done && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute -top-11 sm:-top-12 z-20 pointer-events-none"
          >
            <span
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap"
              style={{ background: accent }}
            >
              <Sparkles className="w-3 h-3" />
              EMPEZAR
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 rotate-45"
                style={{ background: accent }}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BIT el Mapache junto al nodo activo */}
      {isActive && !done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { duration: 0.3 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${mascotOffset}px`,
            top: "-14px",
          }}
        >
          <div className="relative w-18 h-18 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center">
            <ChromaVideo
              src={BIT_VIDEO_URL}
              className="w-full h-full object-cover"
              width={220}
              height={220}
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/40 rounded-full blur-[3px]" />
          </div>
        </motion.div>
      )}

      {/* BOTÓN CIRCULAR 3D TIPO FICHA/TORTA */}
      <motion.div
        animate={isActive && !done ? { y: [0, -6, 0] } : { y: 0 }}
        transition={isActive && !done ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        className="relative group cursor-pointer"
      >
        {/* Halo Suave Concéntrico para Nodo Activo */}
        {isActive && !done && (
          <motion.div
            className="absolute -inset-2 rounded-full pointer-events-none"
            style={{ background: accent }}
            animate={{ scale: [1, 1.25], opacity: [0.35, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Base 3D de Profundidad */}
        <div
          className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full pt-1.5 px-0.5 pb-2.5 transition-transform active:translate-y-1 shadow-xl"
          style={{
            background: shadowRimColor,
            boxShadow: isActive && !done ? `0 12px 28px -4px ${accent}60` : undefined,
          }}
        >
          {/* Cara Frontal del Botón 3D */}
          <button
            onClick={onClick}
            disabled={locked}
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center font-black text-white transition-all border-t border-white/30",
              locked && "opacity-60 cursor-not-allowed border-none"
            )}
            style={{
              background: locked
                ? "var(--surface-hover)"
                : done
                ? "#10B981"
                : accent,
            }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {locked ? (
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-text-muted" />
              ) : done ? (
                <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              ) : (
                kindIcon(level.kind) ?? (
                  <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow-md" />
                )
              )}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Título de Nivel */}
      <div className="mt-2.5 flex flex-col items-center text-center max-w-[130px] sm:max-w-[140px]">
        <span
          className={cn(
            "text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2",
            locked ? "text-text-muted" : "text-text"
          )}
        >
          {level.title}
        </span>
      </div>
    </motion.div>
  );
}
