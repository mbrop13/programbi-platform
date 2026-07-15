"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Database,
  HandCoins,
  Layers,
  ListChecks,
  Lock,
  Network,
  Play,
  Server,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Course } from "@/lib/data/courses";
import {
  getCourseSyllabus,
  getSyllabusLevel,
  levelHours,
  normalizeTopic,
  type BenefitItem,
  type SyllabusModule,
  type SyllabusModuleIcon,
  type SyllabusTopic,
} from "@/lib/data/syllabuses";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<SyllabusModuleIcon, LucideIcon> = {
  powerbi: BarChart3,
  sql: Database,
  python: Code2,
  excel: ListChecks,
  generic: Layers,
  star: Star,
  bot: Bot,
  chart: TrendingUp,
  server: Server,
  network: Network,
  bolt: Zap,
  finance: HandCoins,
  trending: TrendingUp,
};

const ICON_COLORS: Partial<Record<SyllabusModuleIcon, string>> = {
  powerbi: "#F2C811",
  sql: "#1890FF",
  python: "#6366F1",
  excel: "#107C41",
  star: "#1890FF",
  bot: "#6366F1",
  chart: "#F59E0B",
  server: "#1890FF",
  network: "#6366F1",
  bolt: "#F59E0B",
  finance: "#1D4ED8",
  trending: "#059669",
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return `rgba(24, 144, 255, ${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function benefitParts(item: BenefitItem): { title: string; description?: string } {
  if (typeof item === "string") return { title: item };
  return { title: item.title, description: item.description };
}

function topicBadge(topic: SyllabusTopic): string | null {
  if (topic.kind === "project") return "Proyecto";
  if (topic.kind === "ai") return "IA";
  if (topic.kind === "lab") return "Lab";
  if (topic.kind === "objective") return "Objetivo";
  if (topic.kind === "functions") return "Funciones";
  if (topic.kind === "problems") return "Práctica";
  return null;
}

function TopicRow({
  topic,
  accent,
  locked,
  delay,
}: {
  topic: SyllabusTopic;
  accent: string;
  locked?: boolean;
  delay: number;
}) {
  const badge = topicBadge(topic);
  const isSpecial = topic.kind === "objective" || topic.kind === "functions" || topic.kind === "problems";

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={cn(
        "group/topic flex items-start gap-3 text-sm",
        locked ? "text-gray-400" : "text-slate-600"
      )}
    >
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: locked ? "#F1F5F9" : hexToRgba(accent, 0.1),
          color: locked ? "#94A3B8" : accent,
        }}
      >
        {locked ? (
          <Lock className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3 fill-current" />
        )}
      </span>
      <span className="min-w-0 flex-1 leading-relaxed pt-0.5">
        {locked ? (
          <span className="italic">Bloqueado por Prueba Gratuita</span>
        ) : isSpecial && badge ? (
          <>
            <strong className="text-slate-900 font-bold">{badge}: </strong>
            {topic.title}
          </>
        ) : (
          topic.title
        )}
      </span>
      {!locked && badge && !isSpecial && (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: hexToRgba(accent, 0.1), color: accent }}
        >
          {badge}
        </span>
      )}
    </motion.li>
  );
}

function ModuleCard({
  module,
  index,
  isOpen,
  onToggle,
  accent,
  isFreeTrial,
  isPowerBiTrial,
}: {
  module: SyllabusModule;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  accent: string;
  isFreeTrial?: boolean;
  isPowerBiTrial?: boolean;
}) {
  const Icon = module.icon ? ICON_MAP[module.icon] : null;
  const iconColor = (module.icon && ICON_COLORS[module.icon]) || accent;
  const topics = module.topics.map(normalizeTopic);
  const hours = module.hours;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white transition-all duration-300",
        module.highlight
          ? "border-transparent shadow-md"
          : "border-slate-200/80 hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)]"
      )}
      style={
        module.highlight
          ? {
              borderColor: hexToRgba(accent, 0.35),
              background: `linear-gradient(135deg, ${hexToRgba(accent, 0.06)} 0%, #FFFFFF 55%)`,
              boxShadow: isOpen ? `0 12px 40px -12px ${hexToRgba(accent, 0.25)}` : undefined,
            }
          : {
              borderColor: isOpen ? hexToRgba(accent, 0.45) : undefined,
              boxShadow: isOpen ? `0 12px 40px -12px ${hexToRgba(accent, 0.2)}` : undefined,
            }
      }
    >
      {module.highlight && (
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: hexToRgba(accent, 0.15) }}
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative z-10 flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-4 text-left sm:gap-4 sm:p-5 lg:px-6"
      >
        {/* Journey node */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black transition-all duration-300 sm:h-12 sm:w-12 sm:rounded-2xl",
              isOpen ? "text-white shadow-md" : "text-slate-700"
            )}
            style={{
              background: isOpen
                ? iconColor
                : module.highlight
                  ? "#FFFFFF"
                  : hexToRgba(iconColor, 0.1),
              color: isOpen ? "#FFFFFF" : iconColor,
              border: !isOpen && module.highlight ? `1px solid ${hexToRgba(iconColor, 0.25)}` : undefined,
            }}
          >
            {Icon ? <Icon className={cn("h-5 w-5", module.icon === "star" && "fill-current")} /> : index + 1}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-sm font-bold leading-snug text-slate-900 sm:text-base">
              {module.title}
            </h4>
            {module.highlight && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: hexToRgba(accent, 0.12), color: accent }}
              >
                <Sparkles className="h-3 w-3" /> Destacado
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-400 sm:text-xs">
            {hours != null && hours > 0 && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
                style={{ background: hexToRgba(accent, 0.08), color: accent }}
              >
                <Clock className="h-3 w-3" />
                {hours}h
              </span>
            )}
            {module.subtitle && (
              <span className="truncate" style={{ color: hours ? undefined : accent }}>
                {hours != null && hours > 0
                  ? module.subtitle
                      .replace(/^\d+\s*Horas?\s*•\s*/i, "")
                      .replace(/^\d+h\s*·\s*/i, "")
                  : module.subtitle}
              </span>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="shrink-0"
        >
          <ChevronDown
            className="h-5 w-5"
            style={{ color: isOpen ? accent : "#94A3B8" }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="overflow-hidden"
          >
            <ul className="relative z-10 space-y-2.5 border-t border-slate-100/80 px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
              {topics.map((topic, ti) => {
                const locked =
                  isFreeTrial &&
                  isPowerBiTrial &&
                  (index > 0 || ti > 1);
                return (
                  <TopicRow
                    key={`${module.id}-${ti}`}
                    topic={topic}
                    accent={iconColor}
                    locked={locked}
                    delay={ti * 0.03}
                  />
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ContextCards({
  audience,
  audienceNote,
  benefits,
  accent,
}: {
  audience?: string;
  audienceNote?: string;
  benefits?: BenefitItem[];
  accent: string;
}) {
  if (!audience && (!benefits || benefits.length === 0)) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-5">
      {audience && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:rounded-[1.75rem] sm:p-7 md:col-span-2">
          <div
            className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-2xl"
            style={{ background: hexToRgba(accent, 0.12) }}
          />
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
            <Target className="h-5 w-5 shrink-0" style={{ color: accent }} />
            Dirigido a
          </h3>
          <p className="relative z-10 text-sm leading-relaxed text-slate-600">{audience}</p>
          {audienceNote && (
            <div
              className="relative z-10 mt-5 rounded-xl border p-3.5 text-xs font-medium leading-relaxed sm:text-sm"
              style={{
                background: hexToRgba(accent, 0.06),
                borderColor: hexToRgba(accent, 0.15),
                color: "#0F172A",
              }}
            >
              {audienceNote}
            </div>
          )}
        </div>
      )}

      {benefits && benefits.length > 0 && (
        <div
          className={cn(
            "rounded-2xl border p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] sm:rounded-[1.75rem] sm:p-7",
            audience ? "md:col-span-3" : "md:col-span-5"
          )}
          style={{
            background: `linear-gradient(145deg, ${hexToRgba(accent, 0.06)} 0%, #FFFFFF 60%)`,
            borderColor: hexToRgba(accent, 0.18),
          }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold sm:mb-5 sm:text-lg" style={{ color: accent }}>
            <Trophy className="h-5 w-5 shrink-0" />
            Beneficios principales
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
            {benefits.map((b, i) => {
              const { title, description } = benefitParts(b);
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: hexToRgba(accent, 0.12), color: accent }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-snug pt-0.5">
                    {description ? (
                      <>
                        <strong className="block text-slate-900">{title}</strong>
                        <span className="text-xs text-slate-500 sm:text-[13px]">{description}</span>
                      </>
                    ) : (
                      title
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TemarioSection({
  course,
  selectedLevel,
  isFreeTrial,
}: {
  course: Course;
  selectedLevel: number;
  isFreeTrial?: boolean;
}) {
  const syllabus = useMemo(() => getCourseSyllabus(course), [course]);
  const level = useMemo(
    () => getSyllabusLevel(syllabus, selectedLevel),
    [syllabus, selectedLevel]
  );

  const accent = level.theme || syllabus.accent || course.accentColor || "#1890FF";
  const hours = levelHours(level) || course.levels?.[selectedLevel]?.durationHours || course.durationHours;
  const modules = level.modules;

  const audience = level.audience || syllabus.audience;
  const benefits = level.benefits || syllabus.benefits;
  const audienceNote = syllabus.audienceNote;

  const [openIds, setOpenIds] = useState<string[]>([]);

  // Open first module when level changes
  useEffect(() => {
    const first = level.modules[0];
    if (first) setOpenIds([first.id]);
  }, [level]);

  const allOpen = modules.length > 0 && modules.every((m) => openIds.includes(m.id));

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const expandAll = () => setOpenIds(modules.map((m) => m.id));
  const collapseAll = () => setOpenIds([]);

  const whatYouLearn =
    course.levels?.[selectedLevel]?.whatYouLearn ?? course.whatYouLearn;

  return (
    <section
      id="temario"
      className="relative z-10 overflow-hidden border-t border-slate-100 bg-[#F8FAFC] py-12 lg:py-24"
    >
      {/* Background décor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,144,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(24,144,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {course.slug === "copilot" ? (
        <>
          {/* Copilot Brand Spectrum Ambient Glow Lights */}
          <div className="pointer-events-none absolute -top-20 left-1/4 h-[450px] w-[500px] rounded-full bg-gradient-to-tr from-[#00A4EF]/20 to-[#8661C5]/20 blur-[130px]" />
          <div className="pointer-events-none absolute top-1/3 right-1/4 h-[400px] w-[450px] rounded-full bg-gradient-to-bl from-[#C239B3]/15 via-[#F25022]/10 to-transparent blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[600px] rounded-full bg-gradient-to-r from-[#0078D4]/15 to-[#00A4EF]/15 blur-[120px]" />
        </>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: hexToRgba(accent, 0.12) }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <span
            className="mb-4 inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm"
            style={{
              background: hexToRgba(accent, 0.08),
              borderColor: hexToRgba(accent, 0.2),
              color: accent,
            }}
          >
            Plan de estudios {syllabus.programYear || "2026"}
          </span>
          <h2 className="font-display text-2xl font-black tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            Temario y Plan de Estudios
          </h2>
          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm font-medium text-slate-500 sm:mt-4 sm:text-lg">
            Recorrido estructurado del nivel actual: domina cada módulo a tu ritmo con contenido 100% práctico.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mb-8 grid max-w-4xl grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-3 sm:gap-4">
          {[
            { icon: Clock, label: "Horas del nivel", value: `${hours}h` },
            { icon: Layers, label: "Módulos", value: String(modules.length) },
            { icon: Award, label: "Al completar", value: "Certificado" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-4"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: hexToRgba(accent, 0.1), color: accent }}
              >
                <stat.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-black leading-none text-slate-900 sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
            {/* Outcomes */}
            {whatYouLearn && whatYouLearn.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:rounded-3xl sm:p-8">
                <h3 className="mb-5 flex items-start gap-2.5 font-display text-lg font-black text-[#0F172A] sm:mb-6 sm:text-xl">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: hexToRgba(accent, 0.12), color: accent }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span>¿Qué aprenderás en este nivel?</span>
                </h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLevel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    {whatYouLearn.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-2.5 rounded-xl border border-transparent bg-slate-50/80 p-3 transition-colors hover:border-slate-200 hover:bg-white sm:gap-3"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-[13px] font-semibold leading-relaxed text-slate-700 sm:text-sm">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Context: Dirigido a / Beneficios */}
            <ContextCards
              audience={audience}
              audienceNote={audienceNote}
              benefits={benefits}
              accent={accent}
            />

            {/* Journey */}
            <div>
              {level.intro && (
                <p className="mb-6 text-center text-sm italic leading-relaxed text-slate-500 sm:mb-8 sm:text-base">
                  {level.intro}
                </p>
              )}

              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-800 sm:text-lg">
                  <span className="h-5 w-1.5 rounded-full" style={{ background: accent }} />
                  Ruta de módulos
                </h3>
                <button
                  type="button"
                  onClick={allOpen ? collapseAll : expandAll}
                  className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800 sm:text-xs"
                >
                  {allOpen ? "Colapsar todo" : "Expandir todo"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="relative space-y-3"
                >
                  {/* Vertical rail */}
                  <div
                    className="absolute bottom-6 left-[1.85rem] top-6 w-0.5 sm:left-[2.1rem]"
                    style={{
                      background: `linear-gradient(180deg, ${hexToRgba(accent, 0.35)} 0%, ${hexToRgba(accent, 0.08)} 100%)`,
                    }}
                  />
                  <div className="relative z-10 space-y-3">
                    {modules.map((mod, idx) => (
                      <ModuleCard
                        key={mod.id}
                        module={mod}
                        index={idx}
                        isOpen={openIds.includes(mod.id)}
                        onToggle={() => toggle(mod.id)}
                        accent={accent}
                        isFreeTrial={isFreeTrial}
                        isPowerBiTrial={course.slug === "power-bi"}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
}
