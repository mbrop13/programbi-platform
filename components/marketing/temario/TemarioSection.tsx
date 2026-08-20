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
  locked,
  delay,
}: {
  topic: SyllabusTopic;
  accent?: string;
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
        locked ? "text-faint" : "text-mute"
      )}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
          locked ? "bg-wash text-faint" : "bg-wash text-ink"
        }`}
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
            <strong className="text-ink font-semibold">{badge}: </strong>
            {topic.title}
          </>
        ) : (
          topic.title
        )}
      </span>
      {!locked && badge && !isSpecial && (
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold text-mute">
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
  const topics = module.topics.map(normalizeTopic);
  const hours = module.hours;
  const isIa = module.highlight || module.icon === "star" || module.icon === "bot";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`group/module relative overflow-hidden rounded-[22px] border bg-paper transition-colors ${
        isOpen ? "border-ink" : "border-line hover:border-ink"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative z-10 flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-4 text-left sm:gap-4 sm:p-5 lg:px-6"
      >
        <div className="relative shrink-0">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold sm:h-12 sm:w-12 ${
              isOpen ? "bg-ink text-canvas" : "border border-line bg-wash text-ink"
            }`}
          >
            {Icon ? <Icon className="h-5 w-5" /> : index + 1}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold leading-snug text-ink sm:text-base">
              {module.title}
            </h4>
            {isIa && (
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold text-mute">
                IA
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-mute sm:text-xs">
            {hours != null && hours > 0 && (
              <span className="inline-flex items-center gap-1">
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
        <div className="relative overflow-hidden rounded-[22px] border border-line bg-paper p-5 sm:p-7 md:col-span-2">
          <div
            className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-2xl"
            style={{ background: hexToRgba(accent, 0.12) }}
          />
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-ink sm:text-lg">
            <Target className="h-5 w-5 shrink-0" style={{ color: accent }} />
            Dirigido a
          </h3>
          <p className="relative z-10 text-sm leading-relaxed text-mute">{audience}</p>
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

  const accent = "#171716";
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
    <section id="temario" className="border-t border-line bg-canvas py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Temario</h2>
        <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-mute">
          {hours} horas · {modules.length} módulos · certificado al completar.
        </p>

        <div className="mt-12 max-w-[860px] space-y-10">
            {whatYouLearn && whatYouLearn.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-tight text-ink">En este nivel</h3>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {whatYouLearn.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
                      {item}
                    </li>
                  ))}
                </ul>
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
                <p className="mb-6 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">
                  {level.intro}
                </p>
              )}

              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight text-ink">Módulos</h3>
                <button
                  type="button"
                  onClick={allOpen ? collapseAll : expandAll}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {allOpen ? "Cerrar todos" : "Abrir todos"}
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
