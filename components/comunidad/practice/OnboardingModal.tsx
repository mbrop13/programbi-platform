"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import Confetti from "./Confetti";
import ChromaVideo from "./ChromaVideo";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (unitId: string, dailyGoalXP: number) => void;
  onClose?: () => void;
}

const BIT_VIDEO_URL = "https://mail.programbi.com/uploads/Mapache_saludando_a_c%C3%A1mara_con_202607222213.mp4";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
};

// Niveles de conocimiento estilo Duolingo con Barras de Señal (📶)
const KNOWLEDGE_LEVELS = [
  {
    id: "zero",
    title: "Estoy empezando a aprender desde cero",
    desc: "Nunca he usado esta herramienta antes.",
    bars: 1,
  },
  {
    id: "basic",
    title: "Conozco algunos conceptos básicos",
    desc: "Sé qué es y he realizado consultas o fórmulas simples.",
    bars: 2,
  },
  {
    id: "intermediate",
    title: "Puedo desarrollar proyectos intermedios",
    desc: "Trabajo habitualmente con esto en mi trabajo o estudios.",
    bars: 3,
  },
  {
    id: "advanced",
    title: "Nivel avanzado / Profesional",
    desc: "Quiero perfeccionar mis habilidades y resolver retos complejos.",
    bars: 4,
  },
];

// Metas de tiempo diario
const DAILY_GOALS = [
  { id: 10, title: "Relajado", time: "5 min / día", desc: "A tu propio ritmo sin presiones." },
  { id: 20, title: "Normal", time: "10 min / día", desc: "Recomendado para un avance constante." },
  { id: 30, title: "Intenso", time: "15 min / día", desc: "Acelera tu dominio técnico." },
  { id: 50, title: "Pro", time: "25 min / día", desc: "Inmersión total diaria en proyectos reales." },
];

export default function OnboardingModal({
  isOpen,
  onComplete,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(20);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const activeUnit = PRACTICE_UNITS.find((u) => u.id === selectedUnitId) || PRACTICE_UNITS[0];
  const activeGoal = DAILY_GOALS.find((g) => g.id === selectedGoalId) || DAILY_GOALS[1];

  const handleNext = () => {
    if (step === 1 && selectedUnitId) {
      setStep(2);
    } else if (step === 2 && selectedLevelId) {
      setStep(3);
    } else if (step === 3 && selectedGoalId) {
      setShowConfetti(true);
      setStep(4);
    } else if (step === 4) {
      onComplete(selectedUnitId || PRACTICE_UNITS[0].id, selectedGoalId || 20);
    }
  };

  const isNextDisabled =
    (step === 1 && !selectedUnitId) ||
    (step === 2 && !selectedLevelId) ||
    (step === 3 && !selectedGoalId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-text overflow-hidden">
      {showConfetti && <Confetti />}

      {/* ── TOP BAR (Exacta a Duolingo): 'X' a la izquierda, Barra de Avance centrada ── */}
      <div className="w-full relative flex items-center justify-center px-6 py-6 z-30 shrink-0">
        {/* 'X' colocada exactamente a la izquierda */}
        <button
          onClick={onClose}
          className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 p-2 rounded-2xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          title="Cerrar tutorial"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Barra de Progreso PERFECCIONADA Y CENTRADA en el medio de la pantalla */}
        <div className="flex items-center gap-3 w-full max-w-xl justify-center">
          <div className="w-full sm:w-[420px] h-3.5 rounded-full bg-surface-hover border border-border shadow-inner overflow-hidden relative p-0.5">
            <motion.div
              className="h-full bg-accent rounded-full relative shadow-sm"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            >
              <span className="absolute inset-y-0 right-0 w-2 bg-white/40 rounded-full blur-[1px]" />
            </motion.div>
          </div>
          <span className="text-xs font-bold text-text-muted hidden sm:inline whitespace-nowrap">
            {step} / 4
          </span>
        </div>
      </div>

      {/* ── CABECERA CON MASCOTA BIT Y GLOBO DE DIÁLOGO (Idéntico a Duolingo) ── */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-2 pb-4 flex items-center justify-start gap-4 shrink-0 z-20">
        {/* BIT el Mapache en video Chromakey Transparente */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
          <ChromaVideo
            src={BIT_VIDEO_URL}
            className="w-full h-full object-cover"
            width={320}
            height={320}
          />
        </div>

        {/* Globo de Diálogo Estilo Duolingo con Puntero a la Izquierda */}
        <div className="relative bg-surface border-2 border-border p-4 sm:p-5 rounded-2xl shadow-xl max-w-md flex-1">
          {/* Triángulo del globo apuntando a BIT */}
          <div className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-4 h-4 bg-surface border-l-2 border-b-2 border-border rotate-45" />

          <h2 className="font-display font-black text-base sm:text-xl text-text leading-tight">
            {step === 1 && "¡Hola! Soy Bit 🦝 ¿Qué tecnología quieres aprender?"}
            {step === 2 && `¿Cuánto ${activeUnit.title} sabes?`}
            {step === 3 && "¿Cuánto tiempo quieres practicar al día?"}
            {step === 4 && "¡Tu Módulo de Práctica está listo! 🎉"}
          </h2>
        </div>
      </div>

      {/* ── ÁREA CENTRADA DE OPCIONES (Cuestionario estilo Duolingo) ──────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center justify-start w-full">
        <div className="w-full max-w-[580px] mx-auto">
          <AnimatePresence mode="wait">
            {/* PASO 1: SELECCIONAR TECNOLOGÍA */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-3"
              >
                {PRACTICE_UNITS.map((unit) => {
                  const Icon = ICON_MAP[unit.icon] ?? Database;
                  const isSelected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left shadow-sm",
                        isSelected
                          ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent/20"
                          : "border-border bg-surface hover:bg-surface-hover hover:border-border-strong"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ background: unit.accentColor }}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="font-bold text-sm sm:text-base text-text flex items-center gap-2">
                            <span>{unit.emoji}</span>
                            <span>{unit.title}</span>
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {unit.levels.length} lecciones interactivas
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* PASO 2: EVALUACIÓN DE NIVEL CON BARRAS DE SEÑAL (📶) */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-3"
              >
                {KNOWLEDGE_LEVELS.map((lvl) => {
                  const isSelected = lvl.id === selectedLevelId;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedLevelId(lvl.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left shadow-sm",
                        isSelected
                          ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent/20"
                          : "border-border bg-surface hover:bg-surface-hover hover:border-border-strong"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {/* Barras de Señal (📶) exactas a Duolingo */}
                        <div className="flex items-end gap-1 h-6 w-7 justify-center shrink-0">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "w-1.5 rounded-full transition-colors",
                                i < lvl.bars
                                  ? isSelected
                                    ? "bg-accent"
                                    : "bg-accent"
                                  : "bg-border"
                              )}
                              style={{ height: `${(i + 1) * 25}%` }}
                            />
                          ))}
                        </div>

                        <div>
                          <div className="font-bold text-sm sm:text-base text-text leading-tight">
                            {lvl.title}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                            {lvl.desc}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* PASO 3: COMPROMISO DE TIEMPO DIARIO */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DAILY_GOALS.map((goal) => {
                    const isSelected = goal.id === selectedGoalId;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoalId(goal.id)}
                        className={cn(
                          "flex flex-col p-4 rounded-2xl border-2 transition-all text-left relative shadow-sm",
                          isSelected
                            ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent/20"
                            : "border-border bg-surface hover:bg-surface-hover"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-text">{goal.title}</span>
                          <span className="text-xs font-bold text-accent">{goal.time}</span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                          {goal.desc}
                        </p>

                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PASO 4: CONFIRMACIÓN DE COMPROMISO */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center text-center space-y-4 py-4"
              >
                <div className="p-6 rounded-2xl bg-surface border-2 border-border w-full max-w-md flex items-center justify-around shadow-lg">
                  <div className="text-center">
                    <span className="text-xs text-text-muted uppercase font-bold">Tecnología</span>
                    <div className="font-black text-base text-text mt-1">{activeUnit.title}</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <span className="text-xs text-text-muted uppercase font-bold">Meta Diaria</span>
                    <div className="font-black text-base text-accent mt-1">{activeGoal.time}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTÓN "CONTINUAR" SOBREPUESTO A LA DERECHA (Idéntico a la captura) ── */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-10 z-50 pointer-events-auto">
        <motion.button
          whileHover={!isNextDisabled ? { scale: 1.04 } : {}}
          whileTap={!isNextDisabled ? { scale: 0.96 } : {}}
          onClick={handleNext}
          disabled={isNextDisabled}
          className={cn(
            "px-9 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xl flex items-center gap-2 backdrop-blur-md",
            isNextDisabled
              ? "bg-surface-hover/80 text-text-muted cursor-not-allowed shadow-none border border-border"
              : "bg-accent text-white shadow-accent/40 hover:bg-accent/90 ring-2 ring-accent/30"
          )}
        >
          {step === 4 ? "¡Empezar a Practicar!" : "Continuar"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
