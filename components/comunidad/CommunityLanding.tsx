import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  Clock,
  Code2,
  Database,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Heart,
  MessageSquare,
  Play,
  Radio,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import LogoSlider from "@/components/marketing/LogoSlider";
import { SUBSCRIPTIONS_ENABLED } from "@/lib/data/community-flags";
import { communityPlans } from "@/lib/data/community_plans";
import { testimonials } from "@/lib/data/testimonials";
import { CampusCta } from "./campus-cta";

function ProductShot({
  src,
  alt,
  priority = false,
  chrome = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  chrome?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.22)]">
      {chrome && (
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="ml-2 text-[11px] font-semibold text-faint">Campus ProgramBI</span>
        </div>
      )}
      <div className="bg-zinc-50">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-auto w-full object-contain"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      </div>
    </div>
  );
}

const pillars = [
  { icon: Target, title: "Practica", body: "Ruta estilo Duolingo: niveles, XP, rachas y ejercicios interactivos de datos.", tone: "bg-[#171716] text-white" },
  { icon: Video, title: "Clases en vivo", body: "Masterclasses semanales con casos reales de SQL, Python y Power BI.", tone: "bg-white text-ink border border-line" },
  { icon: Bot, title: "Mentor IA", body: "Resuelve dudas de código y optimiza consultas cuando lo necesites.", tone: "bg-zinc-950 text-white" },
  { icon: Users, title: "Comunidad", body: "Networking, muro de proyectos y apoyo entre analistas de datos.", tone: "bg-zinc-100 text-ink" },
];

const practiceTracks = [
  { name: "Power BI", color: "#F2C811" },
  { name: "SQL Server", color: "#CC2927" },
  { name: "Python", color: "#3776AB" },
  { name: "Excel", color: "#217346" },
  { name: "IA", color: "#171716" },
];

const practiceFeatures = [
  { icon: Target, title: "Ruta de niveles", body: "Avanza lección a lección con desbloqueo progresivo." },
  { icon: Heart, title: "Corazones y feedback", body: "Feedback al instante y explicación de cada respuesta." },
  { icon: Flame, title: "Meta diaria y XP", body: "Elige tu ritmo (5 a 25 min) y construye hábito." },
  { icon: BookOpen, title: "Ejercicios reales", body: "Opción múltiple, emparejar, ordenar SQL y más." },
];

const stack = [
  { name: "Power BI", icon: BarChart3, color: "#F2C811" },
  { name: "SQL Server", icon: Database, color: "#CC2927" },
  { name: "Python", icon: Code2, color: "#3776AB" },
  { name: "Excel", icon: FileSpreadsheet, color: "#217346" },
];

const steps = [
  { n: "01", title: "Crea tu cuenta", body: "Regístrate en menos de un minuto. Sin tarjeta de crédito." },
  { n: "02", title: "Entra al campus", body: "Mira clases gratuitas y elige tu track de práctica." },
  { n: "03", title: "Practica y sube de nivel", body: "Completa ejercicios, gana XP y avanza en la ruta." },
];

const faqs = [
  { q: "¿Puedo entrar sin suscribirme?", a: "Sí. Las suscripciones estarán disponibles próximamente. Mientras tanto puedes crear tu cuenta, ver clases gratuitas y usar Practica." },
  { q: "¿Qué es Practica?", a: "Un módulo estilo Duolingo: rutas por Power BI, SQL, Python, Excel e IA, con niveles, XP y ejercicios interactivos." },
  { q: "¿Qué incluye la comunidad cuando abran las membresías?", a: "Clases en vivo, grabaciones, material, mentoría con IA, Practica, muro y descuentos en cursos." },
  { q: "¿Las clases gratuitas son de verdad gratuitas?", a: "Sí. Cualquier usuario con cuenta puede reproducirlas. El resto se desbloquea con la membresía." },
  { q: "¿Necesito experiencia previa?", a: "No. Hay caminos desde cero y también material avanzado." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Cuando las suscripciones estén activas, podrás gestionar o cancelar tu plan desde tu perfil." },
];

const btnPrimary =
  "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98] border-0 cursor-pointer";
const btnSecondary =
  "inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3.5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98] cursor-pointer";

export default function CommunityLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="bg-canvas text-ink">
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-20 sm:pt-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-20 lg:pt-28">
          <div className="lg:col-span-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#171716]" />
              Comunidad de datos
            </div>
            <h1 className="max-w-[16ch] text-[2.35rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              El campus para <span className="text-[#171716]">dominar los datos</span>
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-mute sm:text-lg">
              Clases reales, mentor IA y Practica estilo Duolingo para SQL, Power BI, Python y Excel.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/cursos" className={btnPrimary}>
                Acceder al campus
                <ArrowRight className="h-4 w-4" />
              </CampusCta>
              <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/practicar" className={btnSecondary}>
                <Target className="h-4 w-4 text-[#171716]" />
                Probar Practica
              </CampusCta>
            </div>
            {!SUBSCRIPTIONS_ENABLED && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-faint">
                <Clock className="h-3.5 w-3.5" />
                Suscripciones próximamente
              </p>
            )}
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-mute">
              {["Clases gratuitas", "Practica interactiva", "Sin tarjeta"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#171716]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <ProductShot
              src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053709.png"
              alt="Vista del campus y dashboard Power BI"
              priority
              chrome
            />
          </div>
        </div>
      </section>

      <LogoSlider />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Todo lo que necesitas en un solo lugar</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">Un ecosistema para aprender con práctica real, no con teoría suelta.</p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className={`rounded-2xl p-6 ${p.tone}`}>
                  <Icon className="h-5 w-5 mb-5" strokeWidth={1.75} />
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${p.tone.includes("text-white") ? "text-white/80" : "text-mute"}`}>{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#171716]">
              <Radio className="h-3.5 w-3.5" /> En vivo
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Clases 100% prácticas con casos de negocio</h2>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-mute">
              Practicas en tiempo real con las herramientas que usan las empresas y resuelves dudas al instante.
            </p>
            <ul className="mt-8 space-y-3">
              {["Masterclasses semanales con expertos", "SQL, Python y Power BI en vivo", "Feedback inmediato del profesor", "Grabaciones disponibles después"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-zinc-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#171716]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ProductShot src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053922.png" alt="Material y modelado de datos en el campus" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
              <Play className="h-4 w-4 text-[#171716]" />
              <span className="text-xs font-semibold text-zinc-800">Sesión y material del campus</span>
            </div>
          </div>
        </div>
      </section>

      <section id="practica" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                <Flame className="h-3.5 w-3.5" /> Nuevo en el campus
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Practica como un juego, <span className="text-[#171716]">aprende de verdad</span>
              </h2>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-mute">
                Elige un track, completa niveles, gana XP y refuerza SQL, Power BI, Python, Excel e IA.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {practiceFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="rounded-2xl border border-line bg-white p-4">
                      <Icon className="mb-2 h-4 w-4 text-[#171716]" />
                      <h3 className="text-sm font-bold text-ink">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-mute">{f.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {practiceTracks.map((t) => (
                  <span key={t.name} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                    {t.name}
                  </span>
                ))}
              </div>
              <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/practicar" className={`${btnPrimary} mt-8`}>
                Empezar a practicar
                <ArrowRight className="h-4 w-4" />
              </CampusCta>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Tu ruta</p>
                    <p className="text-lg font-bold text-ink">SQL Server · Nivel 3</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Zap className="h-3.5 w-3.5" /> 120 XP
                  </span>
                </div>
                <div className="relative mx-auto flex max-w-[280px] flex-col items-center gap-5 py-2">
                  {[
                    { label: "SELECT básico", kind: "done" },
                    { label: "WHERE y filtros", kind: "done" },
                    { label: "JOINs", kind: "active" },
                    { label: "GROUP BY", kind: "locked" },
                    { label: "Checkpoint", kind: "trophy" },
                  ].map((node, i) => (
                    <div key={node.label} className="relative flex w-full flex-col items-center">
                      {i > 0 && <div className="absolute -top-5 h-5 w-0.5 bg-zinc-200" />}
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border-4 ${
                          node.kind === "done"
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : node.kind === "active"
                              ? "border-[#171716] bg-[#171716] text-white"
                              : node.kind === "trophy"
                                ? "border-amber-300 bg-amber-100 text-amber-700"
                                : "border-line bg-zinc-100 text-faint"
                        }`}
                      >
                        {node.kind === "done" ? <Check className="h-6 w-6" strokeWidth={2.5} /> : node.kind === "trophy" ? <Trophy className="h-5 w-5" /> : node.kind === "active" ? <Star className="h-5 w-5 fill-white" /> : <span className="text-sm font-bold">{i + 1}</span>}
                      </div>
                      <p className={`mt-2 text-center text-xs font-semibold ${node.kind === "locked" ? "text-faint" : "text-zinc-800"}`}>{node.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#171716]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#171716]">
              <Sparkles className="h-3.5 w-3.5" /> Mentor IA 24/7
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Mentor IA especializado <span className="text-[#171716]">en datos</span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-mute">
              Entrenado para SQL, Python, Power BI y DAX: desbloquea ejercicios, corrige código y explica el porqué.
            </p>
            <ul className="mt-8 space-y-3">
              {["Genera y explica consultas SQL y scripts de Python", "Corrige errores y sugiere mejores prácticas", "Aclara modelado, DAX y visualización"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-zinc-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#171716]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
            <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/cursos" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white no-underline hover:bg-zinc-800 cursor-pointer border-0">
              Probar en el campus
              <ArrowRight className="h-4 w-4" />
            </CampusCta>
          </div>
          <div>
            <div className="overflow-hidden rounded-2xl border border-line bg-zinc-50">
              <Image
                src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-054229.png"
                alt="Mentor IA especializado en datos en el campus ProgramBI"
                width={1400}
                height={900}
                sizes="(max-width: 1024px) 100vw, 700px"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600">
                <MessageSquare className="h-3.5 w-3.5 text-[#171716]" /> Chat de estudio
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600">
                <Code2 className="h-3.5 w-3.5 text-[#171716]" /> SQL · Python · DAX
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1180px] px-5 lg:px-8">
          <div className="rounded-2xl border border-line bg-zinc-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <GraduationCap className="mb-2 h-5 w-5" />
                <h3 className="text-xl font-bold tracking-tight">Material completo a tu ritmo</h3>
                <p className="mt-2 text-sm leading-relaxed text-faint">Clases grabadas, guías, datasets y ejercicios.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {stack.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.name} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <Icon className="h-4 w-4 shrink-0" style={{ color: s.color }} strokeWidth={2} />
                      <span className="text-xs font-semibold text-zinc-200">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Cómo empezar</h2>
          <p className="mt-3 text-base text-mute">Tres pasos. Sin fricción.</p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.n} className="relative rounded-2xl border border-line bg-[#FAFBFC] p-6">
                <span className="text-3xl font-bold text-[#171716]/20">{step.n}</span>
                <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.body}</p>
                {i < steps.length - 1 && <ArrowRight className="absolute right-4 top-8 hidden h-4 w-4 text-zinc-300 md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="membresia" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold text-[#171716]">Suscripciones próximamente</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Membresía ProgramBI</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-mute">Elige el plan que se adapte a ti. Por ahora no se puede suscribir.</p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communityPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex h-full flex-col rounded-2xl border p-6 lg:p-8 ${
                  plan.highlight ? "border-[#171716] bg-white shadow-sm" : "border-line bg-zinc-50"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#171716] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {plan.highlight}
                  </div>
                )}
                <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
                <p className="mt-2 text-sm text-mute">{plan.description}</p>
                <p className="mt-4 text-sm font-semibold text-faint">Suscripción disponible próximamente</p>
                <ul className="mt-6 flex-grow space-y-2">
                  {plan.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-zinc-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#171716]" strokeWidth={2.5} />
                      {feature.replace(/^✓\s*|^💬\s*|^🎓\s*/u, "")}
                    </li>
                  ))}
                </ul>
                <button type="button" disabled className="mt-6 w-full cursor-not-allowed rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-mute">
                  Próximamente
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Lo que dicen nuestros alumnos</h2>
          <p className="mt-3 text-sm text-mute">Historias reales de profesionales que se formaron con ProgramBI.</p>
        </div>
        <div className="logo-slider-mask mt-10 overflow-hidden">
          <div className="flex w-max animate-scroll gap-4 px-5 hover:[animation-play-state:paused]">
            {doubled.map((t, i) => (
              <article key={`${t.name}-${i}`} className="w-[280px] shrink-0 rounded-2xl border border-line bg-white p-5">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-[11px] text-faint">{t.role}</p>
                <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed text-zinc-600">“{t.message}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <Image
                src="https://mail.programbi.com/uploads/gempages_519842279402243040-8ae05cd1-dc25-44fb-9a7b-f1a78a0f121a.webp_202606132329.jpeg"
                alt="Manuel Oliva, fundador de ProgramBI"
                width={560}
                height={680}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-[#171716]">Fundador</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Manuel Oliva</h2>
            <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-mute">
              Más de 15 años en banca, retail y minería. Diseñó ProgramBI para que profesionales de Latinoamérica aprendan datos con el mismo nivel de exigencia del mercado real.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Code2, label: "Consultor de datos" },
                { icon: Shield, label: "Casos reales de industria" },
                { icon: Users, label: "+5000 profesionales formados" },
              ].map((item) => (
                <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-zinc-600">
                  <item.icon className="h-3.5 w-3.5 text-[#171716]" />
                  {item.label}
                </div>
              ))}
            </div>
            <Link href="/nosotros" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-[#171716]">
              Conocer más sobre el equipo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[760px] px-5 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink">Preguntas frecuentes</h2>
          <div className="mt-10 divide-y divide-zinc-200 border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[15px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-lg leading-none group-open:border-[#171716] group-open:bg-[#171716] group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="pt-3 pr-12 text-sm leading-relaxed text-mute">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <div className="rounded-3xl bg-zinc-950 px-8 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Empieza hoy en la comunidad</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-faint">
              {SUBSCRIPTIONS_ENABLED
                ? "Accede al campus y elige el plan que mejor te acomode."
                : "Suscripciones próximamente. Mientras tanto: clases gratis y Practica interactiva."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/cursos" className={btnPrimary}>
                Acceder al campus
                <ArrowRight className="h-4 w-4" />
              </CampusCta>
              <CampusCta
                isLoggedIn={isLoggedIn}
                href="/comunidad/practicar"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white no-underline hover:bg-white/10 cursor-pointer"
              >
                <Target className="h-4 w-4" />
                Ir a Practica
              </CampusCta>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
