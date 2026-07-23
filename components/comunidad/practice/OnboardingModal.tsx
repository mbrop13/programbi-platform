"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  ArrowRight,
  Check,
  Trophy,
  Star,
  Flame,
  Clock,
  ChevronLeft,
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import Confetti from "./Confetti";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (unitId: string, dailyGoalXP: number) => void;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
};

const DAILY_GOALS = [
  {
    id: 10,
    title: "Relajado",
    time: "5 min / día",
    xp: 10,
    desc: "Perfecto para practicar sin presiones.",
    badge: "Fácil",
    color: "emerald",
  },
  {
    id: 20,
    title: "Normal",
    time: "10 min / día",
    xp: 20,
    desc: "Recomendado para mantener un ritmo constante.",
    badge: "Recomendado",
    color: "blue",
  },
  {
    id: 30,
    title: "Intenso",
    time: "15 min / día",
    xp: 30,
    desc: "Acelera tu dominio técnico en datos.",
    badge: "Avanzado",
    color: "amber",
  },
  {
    id: 50,
    title: "Pro",
    time: "25 min / día",
    xp: 50,
    desc: "Inmersión profesional completa diaria.",
    badge: "Experto",
    color: "rose",
  },
];

export default function OnboardingModal({
  isOpen,
  onComplete,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(PRACTICE_UNITS[0].id);
  const [selectedGoalXP, setSelectedGoalXP] = useState<number>(20);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const selectedUnit = PRACTICE_UNITS.find((u) => u.id === selectedUnitId)!;
  const selectedGoal = DAILY_GOALS.find((g) => g.xp === selectedGoalXP)!;

  const handleFinish = () => {
    onComplete(selectedUnitId, selectedGoalXP);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-surface-hover h-2">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Header Controls */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="w-4 h-4" />
              Onboarding Práctica
            </div>
          )}

          <span className="text-xs font-bold text-text-muted">Paso {step} de 4</span>
        </div>

        {/* Content Slides */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* PASO 1: BIENVENIDA & GAMIFICACIÓN */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative w-20 h-20 rounded-3xl bg-accent/15 flex items-center justify-center text-accent shadow-inner">
                  <Target className="w-10 h-10" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    XP
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-text">
                    ¡Bienvenido a la Ruta de Práctica! 🚀
                  </h2>
                  <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
                    Aprende Power BI, SQL, Python, Excel e IA respondiendo micro-lecciones gamificadas diseñadas por expertos en datos.
                  </p>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-2">
                  <div className="p-3.5 rounded-2xl bg-surface-hover border border-border flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-text">Micro-Lecciones</div>
                      <div className="text-[11px] text-text-muted">Desafíos rápidos de 3 min</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-hover border border-border flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500 shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-text">Mantén tu Racha</div>
                      <div className="text-[11px] text-text-muted">Practica a diario</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-hover border border-border flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500 shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-text">Gana XP y Niveles</div>
                      <div className="text-[11px] text-text-muted">Domina cada módulo</div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
                >
                  ¡Configurar Mi Ruta!
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* PASO 2: SELECCIÓN DE RUTA DE APRENDIZAJE */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="font-display font-black text-2xl text-text">
                    ¿Qué quieres dominar primero?
                  </h2>
                  <p className="text-text-secondary text-xs">
                    Elige tu tecnología principal. Podrás cambiar o explorar otras en cualquier momento.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {PRACTICE_UNITS.map((unit) => {
                    const Icon = ICON_MAP[unit.icon] ?? Database;
                    const isSelected = unit.id === selectedUnitId;
                    return (
                      <button
                        key={unit.id}
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={cn(
                          "relative flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all text-left",
                          isSelected
                            ? "bg-surface shadow-md"
                            : "border-border bg-surface-hover/50 hover:bg-surface-hover hover:border-border-strong"
                        )}
                        style={
                          isSelected
                            ? { borderColor: unit.accentColor }
                            : undefined
                        }
                      >
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ background: unit.accentColor }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{unit.emoji}</span>
                            <span className="font-bold text-sm text-text truncate">
                              {unit.title}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                            {unit.levels.length} lecciones disponibles
                          </p>
                        </div>
                        {isSelected && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: unit.accentColor }}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    className="px-7 py-3 rounded-2xl bg-accent text-white font-bold text-sm shadow-md flex items-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* PASO 3: SELECCIÓN DE META DIARIA (XP) */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="font-display font-black text-2xl text-text">
                    ¿Cuál es tu meta diaria?
                  </h2>
                  <p className="text-text-secondary text-xs">
                    Define tu compromiso diario de XP para mantener tu racha activa.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DAILY_GOALS.map((goal) => {
                    const isSelected = goal.xp === selectedGoalXP;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoalXP(goal.xp)}
                        className={cn(
                          "relative flex flex-col p-4 rounded-2xl border-2 transition-all text-left",
                          isSelected
                            ? "border-accent bg-accent/5 shadow-md ring-1 ring-accent"
                            : "border-border bg-surface-hover/50 hover:bg-surface-hover"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-text">
                            {goal.title}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-surface-hover text-text-muted">
                            {goal.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-accent mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          {goal.time} · <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" /> {goal.xp} XP
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-snug">
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

                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowConfetti(true);
                      setStep(4);
                    }}
                    className="px-7 py-3 rounded-2xl bg-accent text-white font-bold text-sm shadow-md flex items-center gap-2"
                  >
                    Guardar Meta
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* PASO 4: CELEBRACIÓN Y CONFIRMACIÓN */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center space-y-6 py-2"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-text">
                    ¡Tu Ruta de Aprendizaje está Lista! 🎉
                  </h2>
                  <p className="text-text-secondary text-sm max-w-md mx-auto">
                    Has elegido dominar <span className="font-bold text-text">{selectedUnit.emoji} {selectedUnit.title}</span> con una meta de <span className="font-bold text-accent">{selectedGoal.xp} XP diarios</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-hover border border-border w-full max-w-md flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-xs text-text-muted">Ruta Inicial</span>
                    <div className="font-bold text-sm text-text">{selectedUnit.title}</div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <span className="text-xs text-text-muted">Meta Diaria</span>
                    <div className="font-bold text-sm text-accent">{selectedGoal.xp} XP / día</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  ¡Empezar a Practicar Ahora!
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
