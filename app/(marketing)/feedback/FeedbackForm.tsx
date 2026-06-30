"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Loader2,
  Send,
  Heart,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { submitCourseFeedback } from "@/lib/supabase/feedback";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// ============================================
// Catálogos
// ============================================
const COURSES_TAKEN_OPTIONS = [
  "Power BI Básico",
  "Power BI Intermedio",
  "Power BI Avanzado",
  "Python para Data Analysis",
  "SQL para Data Analysis",
];

const LAST_COURSE_YEARS = ["2023", "2024", "2025", "2026"];

const APPLIED_OPTIONS: { value: string; label: string }[] = [
  { value: "mucho", label: "Sí, mucho" },
  { value: "algo", label: "Sí, algo" },
  { value: "poco", label: "Poco" },
  { value: "no", label: "Todavía no" },
];

const AI_COURSES = [
  "ChatGPT, Claude y OpenAI en Análisis de Datos",
  "Microsoft Copilot para Power BI, Excel y Office 365",
  "Prompt Engineering (prompts efectivos)",
  "Automatización Inteligente con IA (Python + IA)",
  "Generative AI para Business Intelligence",
  "Claude (Anthropic) para productividad y análisis",
  "Creación de Agentes IA y Automatizaciones avanzadas",
];

const ADVANCED_COURSES = [
  "Power BI + IA (Integración avanzada)",
  "Python para Data Science y Machine Learning",
  "SQL Avanzado + Optimización de consultas",
  "Storytelling y Dashboards Profesionales",
  "Preparación para certificaciones Microsoft",
];

const FORMAT_OPTIONS = [
  "Cursos grabados (a tu ritmo)",
  "Clases en vivo",
  "Mini-cursos / Talleres cortos",
  "Bootcamp intensivo",
];

const RATING_DIMENSIONS: {
  state: keyof RatingState;
  label: string;
  hint: string;
}[] = [
  { state: "content", label: "Calidad del contenido", hint: "Profundidad, relevancia y actualización" },
  { state: "instructor", label: "Claridad de las explicaciones", hint: "Del instructor/a" },
  { state: "practical", label: "Utilidad práctica", hint: "Lo aprendido lo puedes aplicar" },
  { state: "materials", label: "Materiales y ejercicios", hint: "Recursos descargables y prácticas" },
  { state: "support", label: "Soporte y respuestas a dudas", hint: "Tiempo y calidad de respuesta" },
  { state: "platform", label: "Plataforma de aprendizaje", hint: "Experiencia en la web" },
  { state: "value", label: "Relación calidad-precio", hint: "¿Valió la inversión?" },
];

interface RatingState {
  content: number;
  instructor: number;
  practical: number;
  materials: number;
  support: number;
  platform: number;
  value: number;
}

// Lista de campos "rellenables" para calcular progreso
const TOTAL_FILLABLE = 12;

export default function FeedbackForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll progress bar (premium touch)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [coursesTaken, setCoursesTaken] = useState<string[]>([]);
  const [coursesOther, setCoursesOther] = useState("");
  const [lastYear, setLastYear] = useState("");

  const [nps, setNps] = useState<number | null>(null);
  const [overall, setOverall] = useState<number | null>(null);

  const [ratings, setRatings] = useState<RatingState>({
    content: 0, instructor: 0, practical: 0, materials: 0, support: 0, platform: 0, value: 0,
  });

  const [applied, setApplied] = useState("");
  const [results, setResults] = useState("");

  const [desiredAI, setDesiredAI] = useState<string[]>([]);
  const [desiredAdvanced, setDesiredAdvanced] = useState<string[]>([]);
  const [desiredOther, setDesiredOther] = useState("");
  const [formats, setFormats] = useState<string[]>([]);

  const [openFeedback, setOpenFeedback] = useState("");

  // ----- helpers -----
  const toggle = (list: string[], setter: (v: string[]) => void, value: string) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const emailError = emailTouched && !emailValid && email.length > 0;

  // Progreso calculado (para barra visible en CTA)
  const filledCount = useMemo(() => {
    let c = 0;
    if (emailValid) c++;
    if (coursesTaken.length > 0) c++;
    if (lastYear) c++;
    if (nps !== null) c++;
    if (overall !== null) c++;
    c += Object.values(ratings).filter((v) => v > 0).length;
    if (applied) c++;
    if (desiredAI.length + desiredAdvanced.length > 0) c++;
    if (formats.length > 0) c++;
    return Math.min(c, TOTAL_FILLABLE);
  }, [emailValid, coursesTaken, lastYear, nps, overall, ratings, applied, desiredAI, desiredAdvanced, formats]);

  const progressPct = Math.round((filledCount / TOTAL_FILLABLE) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailValid) {
      setError("Necesitamos un correo válido para guardar tu respuesta.");
      return;
    }

    startTransition(async () => {
      const res = await submitCourseFeedback({
        name: name.trim() || undefined,
        email: email.trim().toLowerCase(),
        courses_taken: coursesTaken,
        courses_other: coursesOther.trim() || undefined,
        last_course_year: lastYear || undefined,
        nps_score: nps ?? undefined,
        overall_rating: overall ?? undefined,
        rating_content_quality: ratings.content || undefined,
        rating_instructor_clarity: ratings.instructor || undefined,
        rating_practical_use: ratings.practical || undefined,
        rating_materials: ratings.materials || undefined,
        rating_support: ratings.support || undefined,
        rating_platform: ratings.platform || undefined,
        rating_value_price: ratings.value || undefined,
        applied_knowledge: (applied || undefined) as "mucho" | "algo" | "poco" | "no" | undefined,
        concrete_results: results.trim() || undefined,
        desired_courses: [...desiredAI, ...desiredAdvanced],
        desired_courses_other: desiredOther.trim() || undefined,
        preferred_formats: formats,
        open_feedback: openFeedback.trim() || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.error || "Ocurrió un error. Inténtalo de nuevo.");
      }
    });
  };

  // ----- Pantalla de agradecimiento -----
  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface-1 flex items-center justify-center px-4 -mt-16 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.7, bounce: 0.4 }}
            className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl shadow-brand-blue/10 p-10 sm:p-12 text-center border border-surface-3 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl" />

            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-accent-emerald/15 to-brand-blue/15 flex items-center justify-center mb-7"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-emerald/20 to-brand-blue/20 animate-ping" style={{ animationDuration: "2.5s" }} />
              <CheckCircle2 className="w-14 h-14 text-accent-emerald relative" strokeWidth={2} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative text-3xl sm:text-4xl font-bold text-text-primary font-display mb-3"
            >
              ¡Gracias por tu opinión!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="relative text-text-secondary text-lg leading-relaxed mb-8"
            >
              Cada respuesta nos ayuda a crear cursos mejores y más útiles para ti y la
              comunidad de <span className="font-semibold text-gradient-brand">ProgramBI</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="relative inline-flex items-center gap-2 text-brand-blue font-medium bg-brand-blue-light px-5 py-3 rounded-full mb-8"
            >
              <Heart className="w-5 h-5 fill-brand-blue" />
              ¡Nos vemos en el próximo curso!
            </motion.div>

            <div className="relative">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                Volver al inicio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  // ----- Formulario -----
  return (
    <>
      <Navbar />

      {/* Barra de progreso de scroll (sticky premium) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-accent-purple to-brand-blue-dark origin-left z-[60]"
        style={{ scaleX: progress }}
      />

      {/* ===== HERO (fondo claro) ===== */}
      <section className="relative -mt-16 pt-32 pb-14 overflow-hidden bg-gradient-to-b from-brand-blue-light via-white to-surface-1">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 data-grid-pattern opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(24,144,255,0.18), transparent 70%)",
          }}
        />
        {/* Glows animados */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[5%] w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-[10%] w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-brand-blue/20 text-brand-blue-dark px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-accent-yellow" />
            Tu opinión define nuestros próximos cursos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-text-primary mb-5 leading-[1.05] tracking-tight"
          >
            Cuéntanos sobre tu
            <br />
            <span className="text-gradient-brand">experiencia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-8"
          >
            Tu feedback es confidencial y nos ayuda a mejorar cada curso. Toma menos de
            4 minutos — y construye el futuro de ProgramBI.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-text-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-blue" />
              ~4 minutos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-emerald" />
              100% confidencial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent-purple" />
              Impacto real
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===== FORMULARIO ===== */}
      <main className="bg-surface-1 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ============ 1. Datos básicos ============ */}
            <Section index={1} title="Datos básicos" icon="👤" hint="Para conocer a quién hablamos">
              <Field label="Nombre" optional>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className={inputCls}
                  maxLength={120}
                />
              </Field>

              <Field label="Correo electrónico" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="tu@correo.com"
                  className={`${inputCls} ${emailError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                  required
                />
                {emailError && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    Introduce un correo válido.
                  </p>
                )}
              </Field>

              <Field label="¿Qué cursos has tomado con nosotros?" hint="Puedes seleccionar varios">
                <CheckboxGroup
                  options={COURSES_TAKEN_OPTIONS}
                  selected={coursesTaken}
                  onToggle={(v) => toggle(coursesTaken, setCoursesTaken, v)}
                />
                <div className="mt-2">
                  <label className="text-sm text-text-secondary flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coursesTaken.includes("Otros")}
                      onChange={() => toggle(coursesTaken, setCoursesTaken, "Otros")}
                      className="w-4 h-4 accent-brand-blue"
                    />
                    Otros (especificar)
                  </label>
                  <AnimatePresence>
                    {coursesTaken.includes("Otros") && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        type="text"
                        value={coursesOther}
                        onChange={(e) => setCoursesOther(e.target.value)}
                        placeholder="Especifica cuál(es)"
                        className={inputCls}
                        maxLength={300}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </Field>

              <Field label="¿Cuándo terminaste tu último curso?">
                <div className="relative">
                  <select
                    value={lastYear}
                    onChange={(e) => setLastYear(e.target.value)}
                    className={`${inputCls} appearance-none pr-10 ${lastYear ? "text-text-primary" : "text-text-faint"}`}
                  >
                    <option value="">Selecciona un año</option>
                    {LAST_COURSE_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </Field>
            </Section>

            {/* ============ 2. Satisfacción general ============ */}
            <Section index={2} title="Satisfacción general" icon="⭐">
              <Field
                label="Del 0 al 10, ¿qué tan probable es que recomiendes ProgramBI.com?"
                hint="0 = nada probable · 10 = muy probable (NPS)"
              >
                <NpsScale value={nps} onChange={setNps} />
              </Field>

              <Field label="¿Cómo calificarías tu experiencia general con los cursos?">
                <StarRating value={overall ?? 0} onChange={(v) => setOverall(v)} size={40} />
              </Field>
            </Section>

            {/* ============ 3. Evaluación detallada ============ */}
            <Section index={3} title="Evaluación detallada" icon="📊" hint="1 = Muy malo · 5 = Excelente">
              <div className="space-y-1">
                {RATING_DIMENSIONS.map(({ state, label, hint }, idx) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 ${
                      idx !== RATING_DIMENSIONS.length - 1 ? "border-b border-surface-2" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{label}</p>
                      {hint && <p className="text-sm text-text-muted">{hint}</p>}
                    </div>
                    <StarRating
                      value={ratings[state]}
                      onChange={(v) => setRatings((p) => ({ ...p, [state]: v }))}
                      size={26}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* ============ 4. Impacto profesional ============ */}
            <Section index={4} title="Impacto profesional" icon="🚀">
              <Field label="¿Has aplicado lo aprendido en tu trabajo o proyectos?">
                <div className="grid grid-cols-2 gap-2">
                  {APPLIED_OPTIONS.map((o) => (
                    <motion.button
                      key={o.value}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setApplied(applied === o.value ? "" : o.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        applied === o.value
                          ? "border-brand-blue bg-brand-blue-light text-brand-blue-dark shadow-sm shadow-brand-blue/20"
                          : "border-surface-3 bg-white text-text-secondary hover:border-brand-blue/40 hover:bg-surface-1"
                      }`}
                    >
                      {o.label}
                    </motion.button>
                  ))}
                </div>
              </Field>

              <Field label="¿Lograste algún resultado concreto?" hint="Ascenso, nuevo empleo, aumento de ingresos, etc. (opcional)">
                <textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Cuéntanos tu logro..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  maxLength={2000}
                />
              </Field>
            </Section>

            {/* ============ 5. Cursos futuros ============ */}
            <Section index={5} title="Cursos futuros" icon="🔮" hint="¿Qué quieres que lancemos?">
              <div>
                <p className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-purple" />
                  Inteligencia Artificial y herramientas modernas
                </p>
                <CheckboxGroup
                  options={AI_COURSES}
                  selected={desiredAI}
                  onToggle={(v) => toggle(desiredAI, setDesiredAI, v)}
                  accent="purple"
                />
              </div>

              <div className="mt-5">
                <p className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-blue" />
                  Cursos técnicos avanzados
                </p>
                <CheckboxGroup
                  options={ADVANCED_COURSES}
                  selected={desiredAdvanced}
                  onToggle={(v) => toggle(desiredAdvanced, setDesiredAdvanced, v)}
                  accent="blue"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm text-text-secondary flex items-center gap-2 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={desiredAdvanced.includes("Otros")}
                    onChange={() => toggle(desiredAdvanced, setDesiredAdvanced, "Otros")}
                    className="w-4 h-4 accent-brand-blue"
                  />
                  Otros (especificar)
                </label>
                <AnimatePresence>
                  {desiredAdvanced.includes("Otros") && (
                    <motion.input
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      type="text"
                      value={desiredOther}
                      onChange={(e) => setDesiredOther(e.target.value)}
                      placeholder="¿Qué tema te gustaría?"
                      className={inputCls}
                      maxLength={300}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5">
                <Field label="¿Qué formato prefieres?" hint="Puedes elegir varios">
                  <CheckboxGroup
                    options={FORMAT_OPTIONS}
                    selected={formats}
                    onToggle={(v) => toggle(formats, setFormats, v)}
                  />
                </Field>
              </div>
            </Section>

            {/* ============ 6. Opinión abierta ============ */}
            <Section index={6} title="Opinión abierta" icon="💬">
              <Field
                label="Cuéntanos tu experiencia completa"
                hint="¿Qué te gustó más? ¿Qué podemos mejorar? Sugerencias, comentarios…"
              >
                <textarea
                  value={openFeedback}
                  onChange={(e) => setOpenFeedback(e.target.value)}
                  placeholder="Escribe aquí tu mensaje..."
                  rows={6}
                  className={`${inputCls} resize-none`}
                  maxLength={3000}
                />
                <div className="text-right text-xs text-text-faint mt-1">
                  {openFeedback.length}/3000
                </div>
              </Field>
            </Section>

            {/* ===== CTA con progreso ===== */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-2xl p-7 sm:p-9 text-center shadow-xl shadow-brand-blue/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative">
                <h3 className="text-white font-display font-bold text-xl mb-1">
                  {progressPct === 100 ? "¡Listo para enviar! 🎉" : "Casi terminamos"}
                </h3>
                <p className="text-white/70 text-sm mb-5">
                  {progressPct === 100
                    ? "Revisa tus respuestas y envía tu opinión."
                    : `Has completado el ${progressPct}% del formulario`}
                </p>

                {/* Barra de progreso */}
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-6 max-w-xs mx-auto">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-500/20 border border-red-300/30 text-white rounded-xl px-4 py-3 text-sm mb-4"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-brand-blue-dark font-bold px-10 py-4 rounded-xl transition-all w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar mi opinión
                    </>
                  )}
                </button>
                <p className="text-white/50 text-xs mt-4">
                  Al enviar, aceptas que usemos tu feedback para mejorar. No compartiremos tu correo.
                </p>
              </div>
            </motion.section>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ============================================
// Sub-componentes UI
// ============================================
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-surface-3 bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all";

function Section({
  index,
  title,
  icon,
  hint,
  children,
}: {
  index: number;
  title: string;
  icon?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="bg-white rounded-2xl shadow-sm border border-surface-3 p-6 sm:p-8 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-surface-2">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white flex items-center justify-center font-bold text-base shadow-md shadow-brand-blue/20">
          {index}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            {title}
          </h2>
          {hint && <p className="text-sm text-text-muted mt-0.5">{hint}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.section>
  );
}

function Field({
  label,
  hint,
  required,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-text-faint font-normal ml-1.5">(opcional)</span>}
      </label>
      {hint && <p className="text-xs text-text-muted mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onToggle,
  accent = "blue",
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  accent?: "blue" | "purple";
}) {
  const accentCls =
    accent === "purple"
      ? "border-accent-purple bg-accent-purple/10 text-accent-purple"
      : "border-brand-blue bg-brand-blue-light text-brand-blue-dark";
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <motion.button
            key={o}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onToggle(o)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${
              active
                ? accentCls
                : "border-surface-3 bg-white text-text-secondary hover:border-brand-blue/40 hover:bg-surface-1"
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                active ? "border-transparent" : "border-surface-3"
              }`}
            >
              {active && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
            </span>
            <span>{o}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function StarRating({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hover || value) >= star;
        return (
          <motion.button
            key={star}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(value === star ? 0 : star)}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? "fill-accent-yellow text-accent-yellow" : "text-surface-3"}
              strokeWidth={2}
            />
          </motion.button>
        );
      })}
      <AnimatePresence>
        {value > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="ml-2 text-sm font-semibold text-text-secondary"
          >
            {value}/5
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function NpsScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => {
          const active = display === n;
          let color = "border-surface-3 bg-white text-text-secondary hover:border-brand-blue/50";
          if (n <= 6) color = active ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30" : "hover:border-red-400";
          else if (n <= 8) color = active ? "bg-accent-yellow text-brand-dark border-accent-yellow shadow-md shadow-accent-yellow/30" : "hover:border-accent-yellow";
          else color = active ? "bg-accent-emerald text-white border-accent-emerald shadow-md shadow-accent-emerald/30" : "hover:border-accent-emerald/60";
          return (
            <motion.button
              key={n}
              whileHover={{ scale: active ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(n)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 font-semibold text-sm transition-colors ${color}`}
            >
              {n}
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-text-muted mt-2">
        <span>🔴 Nada probable</span>
        <span>🟡 Neutral</span>
        <span>🟢 Muy probable</span>
      </div>
    </div>
  );
}
