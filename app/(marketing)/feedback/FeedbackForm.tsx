"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Loader2,
  Send,
  Heart,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { submitCourseFeedback } from "@/lib/supabase/feedback";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// ============================================
// Catálogos de opciones (definitivos)
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
  { state: "support", label: "Soporte y respuestas a dudas" , hint: "Tiempo y calidad de respuesta" },
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

export default function FeedbackForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
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
  const toggle = (
    list: string[],
    setter: (v: string[]) => void,
    value: string
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const emailError = emailTouched && !emailValid && email.length > 0;

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
        <main className="min-h-screen bg-gradient-to-br from-brand-blue-light via-white to-surface-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-brand-blue/10 p-10 text-center border border-surface-3"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent-emerald/15 to-brand-blue/15 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-accent-emerald" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-text-primary font-display mb-3">
              ¡Gracias por tu opinión!
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Cada respuesta nos ayuda a crear cursos mejores y más útiles para ti y la
              comunidad de <span className="font-semibold text-brand-blue">ProgramBI</span>.
            </p>
            <div className="inline-flex items-center gap-2 text-brand-blue font-medium bg-brand-blue-light px-5 py-3 rounded-full mb-8">
              <Heart className="w-5 h-5 fill-brand-blue" />
              ¡Nos vemos en el próximo curso!
            </div>
            <div>
              <Link
                href="/"
                className="inline-block bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Volver al inicio
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
      <main className="min-h-screen bg-gradient-to-br from-brand-blue-light via-white to-surface-1 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-brand-blue/20 text-brand-blue px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Tu opinión vale mucho
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-display mb-3">
              Cuéntanos sobre tu experiencia
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Toma menos de 4 minutos. Tus respuestas son confidenciales y definen los
              próximos cursos que lanzaremos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ============ 1. Datos básicos ============ */}
            <Section index={1} title="Datos básicos" icon="👤">
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
                  className={`${inputCls} ${emailError ? "border-red-400 focus:border-red-500" : ""}`}
                  required
                />
                {emailError && (
                  <p className="mt-1.5 text-sm text-red-500">Introduce un correo válido.</p>
                )}
              </Field>

              <Field label="¿Qué cursos has tomado con nosotros?" hint="Puedes seleccionar varios">
                <CheckboxGroup
                  options={COURSES_TAKEN_OPTIONS}
                  selected={coursesTaken}
                  onToggle={(v) => toggle(coursesTaken, setCoursesTaken, v)}
                />
                <div className="mt-2">
                  <label className="text-sm text-text-secondary flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={coursesTaken.includes("Otros")}
                      onChange={() => toggle(coursesTaken, setCoursesTaken, "Otros")}
                      className="w-4 h-4 accent-brand-blue"
                    />
                    Otros (especificar)
                  </label>
                  {coursesTaken.includes("Otros") && (
                    <input
                      type="text"
                      value={coursesOther}
                      onChange={(e) => setCoursesOther(e.target.value)}
                      placeholder="Especifica cuál(es)"
                      className={inputCls}
                      maxLength={300}
                    />
                  )}
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
                <StarRating
                  value={overall ?? 0}
                  onChange={(v) => setOverall(v)}
                  size={36}
                />
              </Field>
            </Section>

            {/* ============ 3. Evaluación detallada ============ */}
            <Section index={3} title="Evaluación detallada" icon="📊" hint="1 = Muy malo · 5 = Excelente">
              <div className="space-y-5">
                {RATING_DIMENSIONS.map(({ state, label, hint }) => (
                  <div key={state} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-surface-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{label}</p>
                      {hint && <p className="text-sm text-text-muted">{hint}</p>}
                    </div>
                    <StarRating
                      value={ratings[state]}
                      onChange={(v) => setRatings((p) => ({ ...p, [state]: v }))}
                      size={26}
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* ============ 4. Impacto profesional ============ */}
            <Section index={4} title="Impacto profesional" icon="🚀">
              <Field label="¿Has aplicado lo aprendido en tu trabajo o proyectos?">
                <div className="grid grid-cols-2 gap-2">
                  {APPLIED_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setApplied(applied === o.value ? "" : o.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        applied === o.value
                          ? "border-brand-blue bg-brand-blue-light text-brand-blue-dark"
                          : "border-surface-3 bg-white text-text-secondary hover:border-brand-blue/40"
                      }`}
                    >
                      {o.label}
                    </button>
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
                <p className="font-semibold text-text-primary mb-1">Inteligencia Artificial y herramientas modernas</p>
                <CheckboxGroup
                  options={AI_COURSES}
                  selected={desiredAI}
                  onToggle={(v) => toggle(desiredAI, setDesiredAI, v)}
                  accent="purple"
                />
              </div>

              <div className="mt-4">
                <p className="font-semibold text-text-primary mb-1">Cursos técnicos avanzados</p>
                <CheckboxGroup
                  options={ADVANCED_COURSES}
                  selected={desiredAdvanced}
                  onToggle={(v) => toggle(desiredAdvanced, setDesiredAdvanced, v)}
                  accent="blue"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm text-text-secondary flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={desiredAdvanced.includes("Otros")}
                    onChange={() => toggle(desiredAdvanced, setDesiredAdvanced, "Otros")}
                    className="w-4 h-4 accent-brand-blue"
                  />
                  Otros (especificar)
                </label>
                {desiredAdvanced.includes("Otros") && (
                  <input
                    type="text"
                    value={desiredOther}
                    onChange={(e) => setDesiredOther(e.target.value)}
                    placeholder="¿Qué tema te gustaría?"
                    className={inputCls}
                    maxLength={300}
                  />
                )}
              </div>

              <div className="mt-4">
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

            {/* Error + submit */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn-gradient text-white font-semibold px-10 py-4 rounded-xl inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full sm:w-auto justify-center"
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
              <p className="text-xs text-text-faint">
                Al enviar, aceptas que usemos tu feedback para mejorar. No compartiremos tu correo.
              </p>
            </div>
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
  "w-full px-4 py-3 rounded-xl border border-surface-3 bg-white text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-colors";

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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-surface-3 p-6 sm:p-8"
    >
      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-surface-2">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white flex items-center justify-center font-bold text-sm">
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
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${
              active
                ? accentCls
                : "border-surface-3 bg-white text-text-secondary hover:border-brand-blue/40"
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
          </button>
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
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(value === star ? 0 : star)}
            className="transition-transform hover:scale-110"
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? "fill-accent-yellow text-accent-yellow" : "text-surface-3"}
              strokeWidth={2}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-text-secondary">{value}/5</span>
      )}
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
          if (n <= 6) color = active ? "bg-red-500 text-white border-red-500" : "hover:border-red-400";
          else if (n <= 8) color = active ? "bg-accent-yellow text-brand-dark border-accent-yellow" : "hover:border-accent-yellow";
          else color = active ? "bg-accent-emerald text-white border-accent-emerald" : "hover:border-accent-emerald/60";
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(n)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 font-semibold text-sm transition-all ${color} ${
                active ? "scale-110 shadow-md" : ""
              }`}
            >
              {n}
            </button>
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
