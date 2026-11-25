"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CourseImage from "@/components/shared/CourseImage";
import CourseGallery from "@/components/marketing/CourseGallery";
import { hasCourseGallery } from "@/lib/data/course-gallery";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  FileText,
  MessageCircle,
} from "lucide-react";
import { type Course, courses } from "@/lib/data/courses";
import {
  advancedHeading,
  checkoutLevelName,
  empresaQuotePath,
  isTieredCourse,
  offerSyllabusLevel,
  OPEN_LEVEL_NAME,
  levelsForView,
  levelIntro,
  syllabusIndexForLevel,
  type CourseOfferView,
} from "@/lib/data/course-views";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";
import TuProfesor from "@/components/equipo/TuProfesor";
import TemarioSection from "@/components/marketing/temario/TemarioSection";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import {
  type CourseSchedule,
  OPEN_COHORT_LABEL,
  convertSchedule,
  getAllActiveSchedules,
} from "@/lib/data/course-schedules";
import { conHoraPais, zonaDe } from "@/lib/paises/horarios";
import {
  trackClickRegistro,
  trackCourseView,
  trackCtaClick,
  trackLeadSubmit,
  trackTemario,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";
import { readClientPricingVariant } from "@/lib/experiments/cookie";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import ExpandibleMovil from "@/components/marketing/ExpandibleMovil";
import { CourseCohortFacts, CourseCohortStrip } from "@/components/marketing/CourseCohortStrip";
import {
  CourseAudienceAndResults,
  CourseFaq,
  isCourseCroSlug,
} from "@/components/marketing/CourseLeadSections";
import { COURSE_SEO } from "@/lib/seo/money";
import { etiquetaBoton } from "@/config/textos";
import { usePaisRuta } from "@/lib/paises/cliente";
import { rutaLocal } from "@/lib/paises/rutas";
import {
  descuentoPublico,
  formatMoneda,
  localizarMercado,
  precioListaVenta,
  precioVenta,
  type PromocionAplicable,
} from "@/lib/paises/precios";
import { whatsappHref } from "@/lib/whatsapp";
import { monedaPublica } from "@/config/pricing";
import type { DetalleCursoLocal } from "@/lib/paises/detalle-curso";
import CourseLocalSeo from "@/components/marketing/CourseLocalSeo";
import { getPais, ISO_CHILE, muestraPrecioDirecto } from "@/config/paises";
import {
  OFERTA_CLASE_GRATIS_CURSO_ACTIVA,
  OFERTA_CLASE_GRATIS_CURSO_TEXTO,
} from "@/config/flags";
import { cuotasSinInteres, textoCuotas } from "@/config/cuotas";
import { COUNTRIES } from "@/lib/context/CountryContext";
import { usePriceUnlock } from "@/hooks/usePriceUnlock";
import { courseBrochureUrl } from "@/lib/pricing-gate";
import { BrochureGateForm } from "@/components/marketing/BrochureGateForm";
import { getIntroFichaAr } from "@/lib/paises/contenido-local/ar";
import { getIntroFichaPe } from "@/lib/data/contenido-paises/pe";

function phoneCodeFor(iso: string) {
  return COUNTRIES.find((country) => country.iso === iso)?.phoneCode || "+56";
}

function withDialCode(raw: string, code: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return trimmed.replace(/\s/g, "");
  return `${code}${trimmed.replace(/\D/g, "")}`;
}

function calcularMontoCuotaPais(iso: string, precio: number, numCuotas: number): number {
  if (numCuotas <= 0) return precio;
  if (precio % numCuotas === 0) return precio / numCuotas;
  const { decimales } = getPais(iso);
  return decimales > 0
    ? Math.round((precio / numCuotas) * 100) / 100
    : Math.round(precio / numCuotas);
}

type CourseLeadType = "personal" | "empresa";

/**
 * POST compartido por el formulario completo (#cotizar) y por el mini form de la
 * tarjeta lateral: mismo endpoint (`/api/leads/create`), mismo payload y mismo
 * evento de medición. No inventar campos nuevos.
 */
async function submitCourseLead({
  course,
  pais,
  leadType,
  name,
  email,
  whatsapp = null,
  message = null,
  company = null,
  position = null,
  selectedCourses,
  formLoadedAt,
  honeypot = "",
  source,
}: {
  course: Course;
  pais: string;
  leadType: CourseLeadType;
  name: string;
  email: string;
  whatsapp?: string | null;
  message?: string | null;
  company?: string | null;
  position?: string | null;
  selectedCourses?: string[];
  formLoadedAt: number;
  honeypot?: string;
  source: string;
}) {
  const payload: Record<string, unknown> = {
    name,
    email,
    whatsapp: whatsapp || null,
    message: message || null,
    sourceCourse: course.title,
    selectedCourses:
      selectedCourses && selectedCourses.length > 0 ? selectedCourses : [course.title],
    leadType,
    pricingVariant: readClientPricingVariant(),
    pais,
    ...captureAndReadAttribution(),
    ...getAntiBotFields(formLoadedAt, honeypot),
  };
  if (leadType === "empresa") {
    payload.company = company || null;
    payload.position = position || null;
  }
  const res = await fetch("/api/leads/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error submitting form");
  trackLeadSubmit(leadType, source, course.slug, {
    form_name: source,
    country: pais,
  });
}

function courseCheckoutUrl(slug: string, levelName?: string, pais?: string) {
  const params = new URLSearchParams({ curso: slug });
  if (levelName) params.set("nivel", levelName);
  if (pais && pais !== ISO_CHILE) params.set("pais", pais);
  return `/pago?${params.toString()}`;
}

/**
 * H1 de la vista `?para=empresas`. Nombra la capacitación in-company y el
 * curso; el país se localiza después con `localizarMercado`.
 */
function empresaHeading(course: Course): string {
  return course.slug === "power-bi"
    ? "Capacitación Power BI para empresas en Chile"
    : `Capacitación en ${course.title} para empresas en Chile`;
}

function formatSchedule(
  sch: CourseSchedule,
  timeZone: string,
  pais: string
): { date: string; days: string; time: string } {
  const conv = convertSchedule(sch.start_date, sch.schedule_time, sch.schedule_days, timeZone);
  return {
    date: conv.dateFormatted.charAt(0).toUpperCase() + conv.dateFormatted.slice(1),
    days: conv.days,
    time: conHoraPais(pais, conv.time),
  };
}

function LevelOvals({
  levels,
  selectedLevel,
  onLevel,
}: {
  levels: { name: string }[];
  selectedLevel: number;
  onLevel: (index: number) => void;
}) {
  if (levels.length < 2) return null;
  return (
    <div className="mb-5">
      <div className="flex gap-1 rounded-full border border-line bg-wash p-1">
        {levels.map((level, idx) => (
          <button
            key={`${level.name}-${idx}`}
            type="button"
            onClick={() => onLevel(idx)}
            className={`flex-1 rounded-full px-2 py-2 text-xs font-semibold sm:text-sm ${
              selectedLevel === idx ? "bg-ink text-canvas" : "text-mute hover:text-ink"
            }`}
          >
            {level.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function levelIndex(course: Course, audience: CourseOfferView, levelName?: string) {
  const levels = levelsForView(course, audience);
  if (!levelName) return 0;
  const index = levels.findIndex((level) => level.name === levelName);
  return index >= 0 ? index : 0;
}

/**
 * Vista que pide la URL (`?para=empresas`, `?nivel=Intermedio`).
 *
 * La ficha se sirve como HTML estático cacheado, así que `page.tsx` ya no lee
 * `searchParams`: estos parámetros se aplican acá, una vez hidratada, con el
 * mismo resultado visible que tenían cuando los resolvía el servidor.
 *
 * Se lee `window.location.search` a propósito: `useSearchParams()` obligaría a
 * un bail-out del contenido SEO a render en cliente. El mapeo de `para` es el
 * mismo que hacía `page.tsx`: solo `empresas` cambia la audiencia.
 */
function readOfferFromUrl(): { para: CourseOfferView | null; nivel: string | null } {
  if (typeof window === "undefined") return { para: null, nivel: null };
  const params = new URLSearchParams(window.location.search);
  const para = params.get("para");
  const nivel = params.get("nivel");
  return {
    para: para === null ? null : para === "empresas" ? "empresas" : "publico",
    nivel: nivel ? nivel : null,
  };
}

const PRIORIDAD_RELACIONADOS: Record<string, readonly string[]> = {
  chatgpt: ["gemini", "claude", "ia-productividad"],
  gemini: ["chatgpt", "claude", "ia-productividad"],
  claude: ["chatgpt", "gemini", "ia-productividad"],
  "ia-productividad": ["chatgpt", "gemini", "claude"],
};

function whatsappTextoCursoIA(course: Course, pais: string): string | undefined {
  if (course.slug !== "chatgpt" && course.slug !== "gemini") return undefined;
  const nombrePais = getPais(pais).nombre;
  return `Hola, quiero info del curso ${course.title} (${rutaLocal(pais, `/cursos/${course.slug}`)}) desde ${nombrePais} [ref:${course.slug}]`;
}

export default function CourseDetailClient({
  course,
  initialSchedules,
  initialView = "publico",
  initialLevelName,
  detalleLocal,
  promotions = [],
  referenceDateIso,
  resumen,
  testimonios,
  comparativa,
  h1Override,
}: {
  course: Course;
  initialSchedules: CourseSchedule[];
  /**
   * Compatibilidad: la ficha se genera estática, así que el servidor ya no
   * deriva esta vista de `?para=`. Si llega, se usa como estado inicial; una
   * vez hidratada manda la URL (ver `readOfferFromUrl`).
   */
  initialView?: CourseOfferView;
  /** Igual que `initialView`, para `?nivel=`. */
  initialLevelName?: string;
  detalleLocal?: DetalleCursoLocal;
  promotions?: readonly PromocionAplicable[];
  /** Fecha de referencia YYYY-MM-DD para evaluar la regla de inicio lejano (> 21 días). */
  referenceDateIso?: string;
  /** Bloque «En resumen» renderizado en el servidor (100% SSR HTML). */
  resumen?: ReactNode;
  /** Citas de alumnos, renderizadas en el servidor. Van tras el profesor. */
  testimonios?: ReactNode;
  /** Tabla comparativa de cursos de IA (Server Component), para ChatGPT y Gemini. */
  comparativa?: ReactNode;
  /** H1 específico de mercado para evitar canibalización en vistas públicas. */
  h1Override?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const startingView: CourseOfferView = initialView === "avanzado" ? "publico" : initialView;
  const [audience, setAudience] = useState<CourseOfferView>(startingView);
  const [selectedLevel, setSelectedLevel] = useState(() =>
    levelIndex(course, startingView, initialView === "avanzado" ? "Avanzado" : initialLevelName)
  );
  const view = audience;

  const chooseAudience = (next: CourseOfferView) => {
    setAudience(next);
    setSelectedLevel(0);
    const params = new URLSearchParams(window.location.search);
    if (next === "empresas") params.set("para", "empresas");
    else params.delete("para");
    params.delete("nivel");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirect, setAuthRedirect] = useState(`/cursos/${course.slug}`);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [schedules, setSchedules] = useState<CourseSchedule[]>(initialSchedules);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const pais = usePaisRuta();
  const esChatgptOGemini = course.slug === "chatgpt" || course.slug === "gemini";
  const whatsappTextoIA = whatsappTextoCursoIA(course, pais);
  const relatedCourses = useMemo(() => {
    const disponibles = courses.filter((c) => c.slug !== course.slug);
    const prioridad = PRIORIDAD_RELACIONADOS[course.slug];
    if (!prioridad) return disponibles.slice(0, 3);
    const priorizados = prioridad
      .map((s) => disponibles.find((c) => c.slug === s))
      .filter((c): c is Course => Boolean(c));
    const restantes = disponibles.filter((c) => !prioridad.includes(c.slug));
    return [...priorizados, ...restantes].slice(0, 3);
  }, [course.slug]);
  const scheduleZone = zonaDe(pais);
  const tiered = isTieredCourse(course);
  const isEmpresa = view === "empresas";
  const levels = levelsForView(course, view);
  const catalogLevelCount = course.levels?.length ?? 0;

  // Gate de precios: antes de desbloquear no se muestran montos numéricos,
  // solo el porcentaje de descuento vigente; el desglose completo (arancel,
  // cuotas, valor por hora y Brochure PDF) recién aparece con `canSeePrice`.
  const { unlocked: priceUnlocked, unlock } = usePriceUnlock();
  const precioDirecto = muestraPrecioDirecto(pais);
  const canSeePrice = isLoggedIn || priceUnlocked || precioDirecto;
  const precioLocalCliente = precioVenta(pais, course.slug, promotions);
  const precioListaCliente = precioListaVenta(pais, course.slug, promotions);
  const descuentoLocalCliente = descuentoPublico(pais, course.slug, promotions);
  const brochureUrl = courseBrochureUrl(course.slug, pais);
  const numCuotas = cuotasSinInteres(pais);
  // Sin fecha futura en la BD, el CTA ofrece aviso por WhatsApp (intent `fechas`).
  const avisameFechaHref = whatsappHref({
    page: `/cursos/${course.slug}`,
    intent: "fechas",
    course: course.title,
    country: pais,
  });

  // Particular: la compra siempre está disponible (haya o no fecha publicada),
  // tanto con sesión iniciada como en modo invitado directamente en /pago.
  const checkoutLabel = isLoggedIn
    ? etiquetaBoton(pais, "Comprar ahora")
    : etiquetaBoton(pais, "Inscribirse");

  const handleCheckoutCTA = () => {
    const picked = levels[selectedLevel];
    const levelName = checkoutLevelName(course, picked?.name);
    const dest = courseCheckoutUrl(course.slug, levelName, pais);
    trackCtaClick(checkoutLabel, "course_detail_sidebar", {
      course_slug: course.slug,
    });

    router.push(dest);
  };

  useEffect(() => {
    const valor = precioVenta(pais, course.slug, promotions);
    trackCourseView(
      course.slug,
      course.title,
      valor ?? undefined,
      pais,
      monedaPublica(pais)
    );
  }, [course.slug, course.title, pais, promotions]);

  // `?para=` y `?nivel=` se aplican una sola vez, ya hidratada la ficha: el
  // HTML cacheado es el de la vista pública y el cliente ajusta audiencia y
  // nivel sin volver a pedir la página. El ref evita que un refresh de props
  // (misma ficha) pise el nivel que eligió el visitante.
  const urlOfferApplied = useRef(false);
  useEffect(() => {
    if (urlOfferApplied.current) return;
    urlOfferApplied.current = true;
    const fromUrl = readOfferFromUrl();
    if (fromUrl.para === null && fromUrl.nivel === null) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    const nextAudience = fromUrl.para ?? startingView;
    if (fromUrl.para !== null) setAudience(nextAudience);
    if (fromUrl.nivel !== null) {
      setSelectedLevel(levelIndex(course, nextAudience, fromUrl.nivel));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [course, startingView]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_plan, subscription_start_at")
            .eq("id", data.user.id)
            .single();
          if (profile) {
            if (profile.subscription_start_at) {
              const daysSinceStart =
                (Date.now() - new Date(profile.subscription_start_at).getTime()) / (1000 * 60 * 60 * 24);
              if (daysSinceStart <= 7) setIsFreeTrial(true);
            }
          }
        } catch {
          /* profile optional */
        }
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setShowAuthModal(false);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  const nextCheckoutUrl = courseCheckoutUrl(
    course.slug,
    checkoutLevelName(course, levels[selectedLevel]?.name),
    pais
  );
  useEffect(() => {
    if (!isLoggedIn) return;
    router.prefetch(nextCheckoutUrl);
  }, [isLoggedIn, nextCheckoutUrl, router]);

  const activeLevel = levels[selectedLevel] || null;
  const syllabusIndex = syllabusIndexForLevel(course, activeLevel?.name);
  const offerSyllabus =
    tiered && view !== "empresas"
      ? offerSyllabusLevel(course, activeLevel?.name === "Avanzado" ? "avanzado" : "publico")
      : null;

  const levelSchedules = useMemo(() => {
    if (!activeLevel) return [];
    const storedLevel = activeLevel.name === OPEN_LEVEL_NAME ? "Básico" : activeLevel.name;
    const openCohorts = view !== "empresas" && activeLevel.name === OPEN_LEVEL_NAME;
    if (course.slug === "analisis-de-datos") {
      const adSchedules = schedules.filter(
        (s) =>
          ["sql-server", "power-bi", "python"].includes(s.course_slug) &&
          (openCohorts ? s.level_name === "Básico" || s.level_name === "Intermedio" : s.level_name === storedLevel)
      );
      return getAllActiveSchedules(adSchedules);
    }
    const matched = schedules.filter((s) => {
      if (s.course_slug !== course.slug) return false;
      if (catalogLevelCount <= 1) return true;
      if (openCohorts) return s.level_name === "Básico" || s.level_name === "Intermedio";
      return s.level_name === storedLevel;
    });
    return getAllActiveSchedules(matched);
  }, [schedules, activeLevel, course.slug, catalogLevelCount, view]);

  // Solo fechas reales que llegan por props desde la BD (`schedules`). Nunca
  // fechas estáticas ni inventadas: si no hay ninguna futura, la tarjeta ofrece
  // «Avísame cuando abra la próxima fecha».
  const activeSchedulesList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return levelSchedules.filter((s) => new Date(`${s.start_date}T12:00:00`) >= today);
  }, [levelSchedules]);

  const levelSchedule = activeSchedulesList[selectedScheduleIndex] || activeSchedulesList[0] || null;
  const esInicioLejano =
    pais === ISO_CHILE &&
    view !== "empresas" &&
    new Set(["power-bi", "python", "analisis-de-datos", "sql-server"]).has(course.slug) &&
    Boolean(levelSchedule?.start_date) &&
    Date.parse(`${levelSchedule!.start_date}T12:00:00Z`) -
      Date.parse(`${referenceDateIso ?? new Date().toISOString().slice(0, 10)}T12:00:00Z`) >
      21 * 86_400_000;
  const whatsappClaseGratisTexto = `Hola, quiero la clase gratis del curso ${course.title} (${rutaLocal(pais, `/cursos/${course.slug}`)}) desde Chile [ref:${course.slug}]`;

  useEffect(() => {
    setSelectedScheduleIndex(0);
  }, [selectedLevel, activeSchedulesList.length]);

  const hours = activeLevel?.durationHours || course.durationHours;
  // Precio por hora de clase: mismo criterio que la calculadora pública.
  const precioHora =
    precioLocalCliente != null && hours > 0 ? Math.round(precioLocalCliente / hours) : null;
  const outcomes = activeLevel?.whatYouLearn?.length ? activeLevel.whatYouLearn : course.whatYouLearn;
  const nextStart = levelSchedule ? formatSchedule(levelSchedule, scheduleZone, pais) : null;
  const isCroTemplate = isCourseCroSlug(course.slug) && view === "publico";
  const seo = COURSE_SEO[course.slug];
  const h1Base = (pais === ISO_CHILE && seo?.h1Cl) || seo?.h1 || course.title;
  const heading =
    view === "publico" && h1Override
      ? h1Override
      : localizarMercado(
          view === "empresas"
            ? empresaHeading(course)
            : view === "avanzado"
              ? advancedHeading(h1Base)
              : h1Base,
          pais
        );
  const introLocalAr = view === "publico" && pais === "ar" ? getIntroFichaAr(course.slug) : null;
  const introLocalPe = view === "publico" && pais === "pe" ? getIntroFichaPe(course.slug) : null;
  const introParagraphs =
    view === "publico"
      ? (introLocalAr ?? introLocalPe ?? (localizarMercado(seo?.intro || "", pais).split("\n\n").filter(Boolean) ?? []))
      : [];
  const offerLead =
    view === "avanzado"
      ? levelIntro(course, "Avanzado") || course.shortDescription
      : view === "empresas"
        ? tiered
          ? `Capacitación de ${course.title} para equipos. Básico, intermedio y avanzado, en vivo.`
          : course.slug === "analisis-de-datos"
            ? "Capacitación de Análisis de Datos para tu equipo. Dos niveles de 60 horas —básico-intermedio y avanzado— con SQL Server, Power BI y Python, y el tamaño de equipo que necesites."
            : `Capacitación de ${course.title} para equipos. ${course.shortDescription}`
        : introLocalPe?.[0] || course.shortDescription?.trim() || introParagraphs[0] || "";
  const offerMore =
    view === "publico" && introLocalPe
      ? introLocalPe.slice(1)
      : view === "publico" && course.shortDescription?.trim()
        ? introParagraphs
        : view === "publico"
          ? introParagraphs.slice(1)
          : [];
  const quoteHref = rutaLocal(pais, empresaQuotePath(course.slug, activeLevel?.name));
  // Vista de cotización de empresas (sin nivel): es el destino de «Factura
  // disponible para empresas» del bloque de precio.
  const facturaHref = rutaLocal(pais, empresaQuotePath(course.slug));
  const includes = [
    "Clases en vivo por Zoom",
    hours ? `${hours} horas de formación` : "Formación en vivo",
    "Campus virtual con clases y material para practicar durante el curso",
    "Certificado al completar",
    "Proyectos con datos reales",
  ];

  const hasGallery = hasCourseGallery(course.slug);

  // Estados Unidos muestra el precio sin formulario y arriba del PDF de
  // temario; el resto de los mercados lo muestra debajo, tras el gate.
  const bloquePrecio =
    !isEmpresa && canSeePrice && precioLocalCliente != null ? (
      <div className="mb-5 space-y-1 leading-snug">
        {precioListaCliente != null && precioListaCliente > precioLocalCliente ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-faint line-through">{formatMoneda(pais, precioListaCliente)}</span>
            {descuentoLocalCliente > 0 ? (
              <span className="rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-ink">
                {descuentoLocalCliente}% off
              </span>
            ) : null}
          </div>
        ) : null}
        <p className="flex items-baseline gap-2">
          <span className={`${precioDirecto ? "text-3xl" : "text-lg"} font-bold tracking-tight text-ink`}>
            {formatMoneda(pais, precioLocalCliente)}
          </span>
          <span className="text-[11px] text-faint">
            {precioDirecto
              ? `${monedaPublica(pais)} · precio del curso`
              : precioListaCliente != null && precioListaCliente > precioLocalCliente
                ? "arancel del curso"
                : "precio normal"}
          </span>
        </p>
        {numCuotas > 0 ? (
          <p className="text-xs text-mute">
            {formatMoneda(pais, calcularMontoCuotaPais(pais, precioLocalCliente, numCuotas))} en{" "}
            {textoCuotas(pais)}
          </p>
        ) : null}
        {precioHora != null ? (
          <p className="text-xs text-mute">
            ≈ {formatMoneda(pais, precioHora)} por hora de clase
          </p>
        ) : null}
        {!precioDirecto ? (
          <p className="text-xs text-mute">
            Clase gratis · sesión abierta por Zoom sin costo
          </p>
        ) : null}
        <p className="text-xs text-mute">
          <Link
            href={facturaHref}
            className="font-semibold text-ink underline decoration-line underline-offset-2 hover:decoration-ink"
          >
            Factura disponible para empresas
          </Link>
        </p>
      </div>
    ) : null;

  return (
    <>
      <section className="bg-canvas px-4 pt-3 sm:px-6 sm:pt-8 lg:px-8 lg:pt-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="contents lg:col-span-7 lg:block lg:min-w-0">
            <div className="min-w-0">
              <nav
                aria-label="Ruta de navegación"
                className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-mute lg:mb-4"
              >
                <Link href={rutaLocal(pais, "/")} className="no-underline hover:text-ink">
                  Inicio
                </Link>
                <span aria-hidden>/</span>
                <Link href={rutaLocal(pais, "/cursos")} className="no-underline hover:text-ink">
                  Cursos
                </Link>
                <span aria-hidden>/</span>
                <span aria-current="page" className="text-ink">
                  {heading}
                </span>
              </nav>
              {view === "empresas" ? (
                <p className="mb-3 text-sm font-semibold text-mute">Para empresas</p>
              ) : view === "avanzado" ? (
                <p className="mb-3 text-sm font-semibold text-mute">Curso avanzado</p>
              ) : null}
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl lg:leading-[1.12]">
                {heading}
              </h1>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute lg:mt-6">
                <li className="inline-flex items-center gap-1.5">
                  <Clock size={15} /> {hours} h
                </li>
                <li>En vivo por Zoom</li>
                <li>Certificado</li>
                {activeLevel ? <li>{activeLevel.name}</li> : null}
              </ul>

              {/* En móvil los CTA del curso viven en la barra fija inferior
                  (BarraFijaFicha). La vista empresas no tiene barra: conserva
                  sus dos botones aquí. */}
              {isEmpresa ? (
                <div
                  data-testid="ficha-hero-cta-mobile"
                  className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:hidden"
                >
                  <Link
                    href={quoteHref}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
                  >
                    Cotizar para mi empresa
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <WhatsAppCta
                    page={rutaLocal(pais, `/cursos/${course.slug}?para=empresas`)}
                    intent="empresas"
                    course={`${course.title} (${rutaLocal(pais, `/cursos/${course.slug}`)})`}
                    courseSlug={course.slug}
                    country={pais}
                    ctaPosition="curso_hero"
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
                  >
                    <MessageCircle size={16} aria-hidden />
                    Hablar por WhatsApp
                  </WhatsAppCta>
                </div>
              ) : null}

              {hasGallery ? (
                <CourseGallery
                  slug={course.slug}
                  title={course.title}
                  coverSrc={course.imageUrl}
                  coverAlt={course.title}
                />
              ) : (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[26px] border border-line bg-wash">
                  <CourseImage
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    preload
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="order-2 min-w-0 max-lg:-mt-10 lg:hidden">
              <CourseCohortStrip
                pending={false}
                startLabel={nextStart?.date ?? OPEN_COHORT_LABEL}
                days={nextStart?.days ?? null}
                time={nextStart?.time ?? null}
              />
            </div>

            <div className="order-4 min-w-0 max-lg:-mt-12 lg:order-none">
              {resumen}
              <CourseAudienceAndResults
                course={course}
                selectedLevel={syllabusIndex}
                results={outcomes}
                levelLabel={
                  view === "avanzado" ? "Curso avanzado" : offerSyllabus ? offerSyllabus.label : undefined
                }
                levelContent={offerSyllabus ?? undefined}
                showLadderNote={view === "empresas" || !tiered}
              />
            </div>
          </div>

          <aside id="inscripcion" className="order-3 min-w-0 scroll-mt-24 lg:order-none lg:col-span-5 lg:row-span-2">
            <span id="precios" className="scroll-mt-24" aria-hidden="true" />
            <div className="rounded-[26px] border border-line bg-paper p-5 shadow-[0_20px_60px_rgba(23,23,22,0.06)] sm:p-6 lg:sticky lg:top-[var(--sticky-below-nav,6rem)] lg:max-h-[calc(100vh_-_var(--sticky-below-nav,6rem)_-_1.5rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin] lg:transition-[top] lg:duration-300 lg:ease-out motion-reduce:transition-none">
              <div className="mb-4 flex justify-start">
                {isEmpresa ? (
                  <button
                    type="button"
                    onClick={() => chooseAudience("publico")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-mute hover:text-ink"
                  >
                    <span aria-hidden>←</span> Ver curso individual
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => chooseAudience("empresas")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-mute hover:text-ink"
                  >
                    Ver {course.title} como empresa <span aria-hidden>→</span>
                  </button>
                )}
              </div>
              <LevelOvals
                levels={levels}
                selectedLevel={selectedLevel}
                onLevel={setSelectedLevel}
              />

              <div className="relative mb-4">
                <p className="mb-2 text-sm font-medium text-ink">Próxima fecha</p>
                {activeSchedulesList.length === 0 ? (
                  // Sin fecha futura en la BD no se inventa ninguna: se ofrece
                  // aviso por WhatsApp (intent `fechas`).
                  <a
                    href={avisameFechaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-tracked="1"
                    onClick={() =>
                      trackWhatsAppClick({
                        cta_position: "curso_ayuda",
                        course: course.slug,
                        course_slug: course.slug,
                        country: pais,
                        page: typeof window !== "undefined" ? window.location.pathname : `/cursos/${course.slug}`,
                        page_path: typeof window !== "undefined" ? window.location.pathname : `/cursos/${course.slug}`,
                        href: avisameFechaHref,
                      })
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-line-strong bg-canvas px-3 py-3 text-left no-underline transition-colors hover:bg-wash"
                  >
                    <span className="flex min-w-0 items-start gap-2.5">
                      <Calendar size={16} className="mt-0.5 shrink-0 text-ink" />
                      <span className="text-sm font-semibold leading-snug text-ink">
                        Avísame cuando abra la próxima fecha
                      </span>
                    </span>
                    <MessageCircle size={16} className="shrink-0 text-mute" aria-hidden />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsScheduleDropdownOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl border border-line-strong bg-canvas px-3 py-3 text-left"
                  >
                    <span className="flex min-w-0 items-start gap-2.5">
                      <Calendar size={16} className="mt-0.5 shrink-0 text-ink" />
                      {nextStart ? (
                        <span>
                          <span className="block text-sm font-semibold text-ink">{nextStart.date}</span>
                          <span className="mt-0.5 block text-xs text-mute">
                            {nextStart.days} · {nextStart.time}
                            {view === "publico" && tiered && levelSchedule?.level_name
                              ? ` · ${levelSchedule.level_name}`
                              : ""}
                          </span>
                          {levelSchedule?.max_students ? (
                            <span className="mt-0.5 block text-xs text-faint">
                              Grupo de máximo {levelSchedule.max_students} alumnos
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </span>
                    {activeSchedulesList.length > 1 ? (
                      <ChevronDown size={16} className={`shrink-0 text-faint ${isScheduleDropdownOpen ? "rotate-180" : ""}`} />
                    ) : null}
                  </button>
                )}

                <AnimatePresence>
                  {isScheduleDropdownOpen && activeSchedulesList.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsScheduleDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-line bg-paper py-1 shadow-[0_16px_40px_rgba(23,23,22,0.10)]"
                      >
                        {activeSchedulesList.map((sch, idx) => {
                          const conv = formatSchedule(sch, scheduleZone, pais);
                          return (
                            <button
                              key={sch.id || idx}
                              type="button"
                              onClick={() => {
                                setSelectedScheduleIndex(idx);
                                setIsScheduleDropdownOpen(false);
                              }}
                              className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm ${
                                selectedScheduleIndex === idx ? "bg-wash" : "hover:bg-wash"
                              }`}
                            >
                              <Clock size={14} className="mt-0.5 shrink-0" />
                              <span>
                                <span className="block font-semibold text-ink">{conv.date}</span>
                                <span className="text-xs text-mute">
                                  {conv.days} · {conv.time}
                                  {view === "publico" && tiered && sch.level_name ? ` · ${sch.level_name}` : ""}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {precioDirecto && bloquePrecio ? (
                <div className="border-t border-line pt-5">{bloquePrecio}</div>
              ) : null}

              <div className="mb-5 border-t border-line pt-5">
                {/* Antes del gate mostramos solo el porcentaje de descuento
                    vigente cuando el país tiene arancel publicado; el monto, el
                    desglose completo y el Brochure PDF quedan detrás de
                    `canSeePrice`. Aquí se distingue empresa, país sin arancel
                    aprobado (Paraguay) y venta individual con formulario. */}
                {isEmpresa ? (
                  <p className="text-sm leading-relaxed text-mute">
                    {tiered
                      ? "La cotización incluye básico, intermedio y avanzado. Eliges los niveles y el tamaño del equipo."
                      : course.slug === "analisis-de-datos"
                        ? "La cotización incluye los dos niveles de 60 horas. Eliges el nivel y el tamaño del equipo."
                        : "Armamos la cotización según el equipo y el calendario de tu empresa."}
                  </p>
                ) : (
                  <>
                    {esInicioLejano ? (
                      <div className="mb-4">
                        <WhatsAppCta
                          page={rutaLocal(pais, `/cursos/${course.slug}`)}
                          intent="curso"
                          course={`${course.title} (${rutaLocal(pais, `/cursos/${course.slug}`)})`}
                          courseSlug={course.slug}
                          country={pais}
                          ctaPosition="curso_inscripcion_top"
                          customText={whatsappClaseGratisTexto}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
                        >
                          <MessageCircle size={16} aria-hidden />
                          Agenda tu clase gratis
                        </WhatsAppCta>
                      </div>
                    ) : null}
                    {!canSeePrice || precioLocalCliente == null ? (
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs">
                        {!canSeePrice && descuentoLocalCliente > 0 ? (
                          <span className="w-full text-base font-bold tracking-tight text-ink">
                            {descuentoLocalCliente}% de descuento
                          </span>
                        ) : !canSeePrice && precioLocalCliente != null && !precioDirecto ? (
                          <span className="w-full text-sm font-bold tracking-tight text-ink">
                            Precio normal en {monedaPublica(pais)}
                          </span>
                        ) : null}
                        {numCuotas > 0 ? (
                          <span className="font-semibold text-ink">
                            Pago en {textoCuotas(pais)}
                          </span>
                        ) : null}
                        {!precioDirecto ? (
                          <span className="w-full text-[11px] text-mute">
                            Clase gratis · sesión abierta por Zoom sin costo
                          </span>
                        ) : null}
                        <Link
                          href={facturaHref}
                          className="font-semibold text-mute underline decoration-line underline-offset-2 hover:text-ink hover:decoration-ink"
                        >
                          Factura disponible para empresas
                        </Link>
                      </div>
                    ) : null}
                    {precioLocalCliente == null ? (
                      // Paraguay todavía no tiene monto aprobado: se consulta por WhatsApp.
                      <div>
                        <p className="text-sm leading-relaxed text-mute">
                          El valor de este curso se confirma por WhatsApp según tu país.
                        </p>
                        <WhatsAppCta
                          page={`/cursos/${course.slug}`}
                          intent="curso"
                          course={course.title}
                          courseSlug={course.slug}
                          country={pais}
                          ctaPosition="curso_ayuda"
                          customText={whatsappTextoIA}
                          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas no-underline"
                        >
                          <MessageCircle size={16} />
                          Consultar el valor
                        </WhatsAppCta>
                      </div>
                    ) : (
                      <div>
                        <BrochureGateForm
                          slug={course.slug}
                          courseTitle={course.title}
                          pais={pais}
                          source="course_detail_gate"
                          buttonLabel={precioDirecto ? "Descargar temario (PDF)" : "Ver temario y precios"}
                          idPrefix="brochure-gate"
                          onUnlocked={() => unlock()}
                        />
                        <div className="mt-4 text-center">
                          <p className="text-xs font-medium text-mute">
                            {precioDirecto ? "¿Listo para empezar?" : "¿Ya viste el temario y los precios?"}
                          </p>
                          <button
                            type="button"
                            onClick={handleCheckoutCTA}
                            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-canvas text-sm font-semibold text-ink hover:bg-wash"
                          >
                            Inscribirme ahora
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {esChatgptOGemini && OFERTA_CLASE_GRATIS_CURSO_ACTIVA && !isEmpresa ? (
                  <WhatsAppCta
                    page={`/cursos/${course.slug}`}
                    intent="curso"
                    course={course.title}
                    courseSlug={course.slug}
                    country={pais}
                    ctaPosition="curso_ayuda"
                    customText={whatsappTextoIA}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
                  >
                    <MessageCircle size={16} aria-hidden />
                    {OFERTA_CLASE_GRATIS_CURSO_TEXTO}
                  </WhatsAppCta>
                ) : null}
              </div>

              {precioDirecto ? null : bloquePrecio}

              {isEmpresa ? (
                <>
                  <Link
                    href={quoteHref}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
                  >
                    Cotizar para mi empresa
                    <ArrowRight size={16} />
                  </Link>
                  <WhatsAppCta
                    page={`/cursos/${course.slug}?para=empresas`}
                    intent="empresas"
                    course={course.title}
                    courseSlug={course.slug}
                    country={pais}
                    ctaPosition="curso_ayuda"
                    className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-canvas text-sm font-medium text-ink no-underline hover:bg-wash"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </WhatsAppCta>
                </>
              ) : null}

              <CourseCardDescription lead={offerLead} more={offerMore} />

              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-line pt-4 text-[13px] leading-snug text-ink">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <Check size={13} className="mt-0.5 shrink-0" strokeWidth={2.4} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-ink">
                <a href="#temario" className="inline-flex items-center gap-1.5 no-underline hover:text-mute">
                  <BookOpen size={15} /> Temario
                </a>
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackTemario({
                      action: "view",
                      course: course.slug,
                      country: pais,
                      location: "ficha_sidebar",
                    })
                  }
                  className="inline-flex items-center gap-1.5 no-underline hover:text-mute"
                >
                  <FileText size={15} /> Temario y precios (PDF)
                </a>
                {course.slug === "power-bi" ? (
                  <Link
                    href="#plantilla-power-bi"
                    className="inline-flex items-center gap-1.5 no-underline hover:text-mute"
                  >
                    <FileText size={15} /> Plantilla CSV gratis
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>

          <div className="order-5 min-w-0 lg:order-none lg:col-span-7">
            <TemarioSection
              course={course}
              selectedLevel={syllabusIndex}
              isFreeTrial={isFreeTrial}
              embedded
              levelOverride={offerSyllabus ?? undefined}
            />
            {comparativa}
          </div>
        </div>
      </section>

      <ExpandibleMovil etiqueta="Ver todo el equipo">
        <TuProfesor />
      </ExpandibleMovil>

      {testimonios}

      {isCroTemplate ? (
        <CourseFaq slug={course.slug} extra={detalleLocal?.faqs} pais={pais} />
      ) : detalleLocal && detalleLocal.faqs.length > 0 ? (
        <CourseLocalSeo detalle={detalleLocal} />
      ) : null}

      <CourseContactForm course={course} />

      {relatedCourses.length > 0 && (
        <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Otros cursos</h2>
            {/* En celular, carrusel horizontal: tres tarjetas apiladas ocupaban
                casi dos pantallas. */}
            <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {relatedCourses.map((rc) => {
                return (
                  <Link
                    key={rc.slug}
                    href={rutaLocal(pais, `/cursos/${rc.slug}`)}
                    className="group w-[82%] shrink-0 snap-start overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20 sm:w-auto"
                  >
                    <div className="relative aspect-[16/10] bg-wash">
                      <CourseImage src={rc.imageUrl} alt={rc.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <div className="px-4 pt-4">
                      <CourseCohortFacts
                        slug={rc.slug}
                        schedules={schedules}
                        timeZone={scheduleZone}
                        pais={pais}
                        loaded
                        compact
                      />
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-lg font-bold tracking-tight text-ink">{rc.title}</p>
                      <p className="mt-1 text-sm text-mute">{rc.shortDescription}</p>
                      <span className="mt-2 block text-sm font-semibold text-ink">Ver temario y precios →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!isEmpresa ? (
        <BarraFijaFicha
          curso={course.title}
          cursoSlug={course.slug}
          pais={pais}
          resumen={[
            descuentoLocalCliente > 0 ? `${descuentoLocalCliente}% dcto.` : null,
            // "Lunes, 7 de diciembre de 2026" → "Inicia 7 dic": la barra es angosta.
            nextStart
              ? `Inicia ${nextStart.date.replace(/^[^,]+,\s*/, "").replace(/\s+de\s+\d{4}$/, "").replace(/\s+de\s+([a-záéíóú]{3})[a-záéíóú]*$/i, " $1").toLowerCase()}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
          brochureUrl={canSeePrice ? brochureUrl : null}
          whatsappCustomText={whatsappTextoIA}
        />
      ) : null}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
        redirectUrl={authRedirect}
      />
    </>
  );
}

function CourseCardDescription({ lead, more }: { lead: string; more: string[] }) {
  if (!lead && more.length === 0) return null;
  // En la tarjeta fija: entrada recortada (con «Ver más» para el resto) y
  // tipografía un punto más chica para que el formulario quede a la vista.
  return (
    <div className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-mute">
      {lead ? <p className={more.length > 0 ? "line-clamp-3" : undefined}>{lead}</p> : null}
      {more.length > 0 ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-[13px] font-semibold text-ink">Ver más</summary>
          <div className="mt-2 space-y-2">
            {more.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function CourseContactForm({ course }: { course: Course }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [contactType, setContactType] = useState<"personal" | "empresa">("personal");
  const [selectedServices, setSelectedServices] = useState<string[]>(["Capacitación In-Company"]);
  const [honeypot, setHoneypot] = useState("");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const pais = usePaisRuta();
  const { unlock } = usePriceUnlock();
  const [phonePrefix, setPhonePrefix] = useState(() => phoneCodeFor(pais));

  useEffect(() => {
    setPhonePrefix(phoneCodeFor(pais));
  }, [pais]);

  const COUNTRIES = [
    { code: "+56", iso: "cl", name: "Chile" },
    { code: "+52", iso: "mx", name: "México" },
    { code: "+54", iso: "ar", name: "Argentina" },
    { code: "+57", iso: "co", name: "Colombia" },
    { code: "+51", iso: "pe", name: "Perú" },
    { code: "+593", iso: "ec", name: "Ecuador" },
    { code: "+507", iso: "pa", name: "Panamá" },
    { code: "+58", iso: "ve", name: "Venezuela" },
    { code: "+598", iso: "uy", name: "Uruguay" },
    { code: "+595", iso: "py", name: "Paraguay" },
    { code: "+591", iso: "bo", name: "Bolivia" },
    { code: "+502", iso: "gt", name: "Guatemala" },
    { code: "+506", iso: "cr", name: "Costa Rica" },
    { code: "+503", iso: "sv", name: "El Salvador" },
    { code: "+504", iso: "hn", name: "Honduras" },
    { code: "+505", iso: "ni", name: "Nicaragua" },
    { code: "+1", iso: "do", name: "Rep. Dominicana" },
    { code: "+34", iso: "es", name: "España" },
    { code: "+1", iso: "us", name: "EE.UU." },
  ];

  const enterpriseServices = [
    "Capacitación In-Company",
    "Dashboards Personalizados",
    "Automatización de Procesos",
    "Consultoría en Datos",
    "Mentoría Corporativa",
  ];

  const fieldClass =
    "h-12 w-full rounded-xl border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-faint";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const rawWhatsapp = String(formData.get("whatsapp") || "").trim();
      const whatsapp = rawWhatsapp ? withDialCode(rawWhatsapp, phonePrefix) : "";
      const nombre = String(formData.get("name") || "");
      const email = String(formData.get("email") || "");

      // Particular: abrir el brochure y desbloquear precios de inmediato, de
      // forma sincrónica dentro del handler para que el navegador no lo trate
      // como popup.
      if (contactType === "personal") {
        window.open(courseBrochureUrl(course.slug, pais), "_blank", "noopener,noreferrer");
        unlock({ name: nombre, email, whatsapp });
      }

      await submitCourseLead({
        course,
        pais,
        leadType: contactType,
        name: nombre,
        email,
        whatsapp: whatsapp || null,
        message: formData.get("message")
          ? String(formData.get("message"))
          : contactType === "personal"
            ? "Descargó Brochure PDF con precios"
            : null,
        company: formData.get("company") ? String(formData.get("company")) : null,
        position: formData.get("position") ? String(formData.get("position")) : null,
        selectedCourses: contactType === "personal" ? [course.title] : selectedServices,
        formLoadedAt: formLoadedAt.current,
        honeypot,
        source: "course_detail_cotizar",
      });
      setSubmittedEmail(email);
      setIsSuccess(true);
    } catch {
      alert("Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPersonal = contactType === "personal";

  return (
    <section id="cotizar" className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="px-4 py-16 sm:px-6 lg:px-16 lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {isPersonal ? "¿Necesitas ayuda?" : "Para empresas"}
          </h2>
          <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-mute">
            {isPersonal
              ? "Escríbenos si tienes dudas del curso. Al enviar el formulario abrimos el temario con precios, fechas y docentes, y te llega el detalle por correo."
              : "Programas in-company, dashboards y automatización para tu equipo."}
          </p>
        </div>

        <div className="border-t border-line px-4 py-16 sm:px-6 lg:border-t-0 lg:border-l lg:px-16 lg:py-24">
          {isSuccess ? (
            <div className="rounded-2xl border border-line bg-paper px-5 py-6">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                {isPersonal ? "Correo enviado" : "Cotización enviada"}
              </p>
              <p className="mt-2 text-base font-semibold text-ink">
                {isPersonal ? "Te enviamos un correo" : "Revisa tu correo"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {isPersonal
                  ? `Revisa ${submittedEmail || "tu correo"}. Ahí va la información del curso.`
                  : `Te enviamos la confirmación${submittedEmail ? ` a ${submittedEmail}` : ""}. Un asesor te escribe con la propuesta para tu equipo.`}
              </p>
              {isPersonal ? (
                <>
                  <a
                    href={courseBrochureUrl(course.slug, pais)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackTemario({
                        action: "view",
                        course: course.slug,
                        country: pais,
                        location: "ficha_contacto",
                      })
                    }
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas no-underline"
                  >
                    <FileText size={16} /> Abrir temario y precios (PDF)
                  </a>
                  <Link
                    href={courseCheckoutUrl(course.slug, undefined, pais)}
                    className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-canvas text-sm font-medium text-ink no-underline hover:bg-wash"
                  >
                    Ir a Inscripción / Pago <ArrowRight size={16} />
                  </Link>
                </>
              ) : null}
              <WhatsAppCta
                page={`/cursos/${course.slug}`}
                intent={isPersonal ? "curso" : "empresas"}
                course={course.title}
                courseSlug={course.slug}
                country={pais}
                ctaPosition="curso_ayuda"
                customText={isPersonal ? whatsappTextoCursoIA(course, pais) : undefined}
                className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
              >
                Escribir por WhatsApp
              </WhatsAppCta>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-[36rem] space-y-5" noValidate>
              <div className="flex gap-1 rounded-full border border-line bg-wash p-1">
                <button
                  type="button"
                  onClick={() => setContactType("personal")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${isPersonal ? "bg-ink text-canvas" : "text-mute"}`}
                >
                  Particular
                </button>
                <button
                  type="button"
                  onClick={() => setContactType("empresa")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${!isPersonal ? "bg-ink text-canvas" : "text-mute"}`}
                >
                  Empresa
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-name" className="text-sm font-medium text-ink">
                    Nombre
                  </label>
                  <input id="course-name" name="name" required autoComplete="name" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-email" className="text-sm font-medium text-ink">
                    Email
                  </label>
                  <input id="course-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="course-whatsapp" className="text-sm font-medium text-ink">
                  Teléfono o WhatsApp{" "}
                  {muestraPrecioDirecto(pais) ? (
                    <span className="font-normal text-mute">(opcional)</span>
                  ) : null}
                </label>
                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPrefixDropdown((v) => !v)}
                      className="inline-flex h-12 items-center gap-1.5 rounded-l-xl border border-r-0 border-line-strong bg-paper px-3 text-sm text-ink"
                    >
                      {phonePrefix}
                      <ChevronDown size={14} className="text-faint" />
                    </button>
                    {showPrefixDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowPrefixDropdown(false)} />
                        <div className="absolute top-full left-0 z-20 mt-1 max-h-56 w-52 overflow-y-auto rounded-xl border border-line bg-paper py-1">
                          {COUNTRIES.map((c, idx) => (
                            <button
                              key={`${c.iso}-${idx}`}
                              type="button"
                              onClick={() => {
                                setPhonePrefix(c.code);
                                setShowPrefixDropdown(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink hover:bg-wash"
                            >
                              <span>{c.name}</span>
                              <span className="text-mute">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    id="course-whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    className="h-12 min-w-0 flex-1 rounded-r-xl border border-line-strong bg-paper px-3 text-base text-ink"
                  />
                </div>
                {muestraPrecioDirecto(pais) ? (
                  <p className="text-xs text-mute">
                    En {getPais(pais).nombre} te respondemos por email; déjalo solo si prefieres WhatsApp.
                  </p>
                ) : null}
              </div>

              {!isPersonal && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-sm font-medium text-ink">
                        Empresa
                      </label>
                      <input id="company" name="company" required className={fieldClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="position" className="text-sm font-medium text-ink">
                        Cargo <span className="font-normal text-mute">(opcional)</span>
                      </label>
                      <input id="position" name="position" className={fieldClass} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-ink">Servicios <span className="font-normal text-mute">(opcional)</span></p>
                    <div className="flex flex-wrap gap-2">
                      {enterpriseServices.map((service) => {
                        const selected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() =>
                              setSelectedServices((prev) =>
                                prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              selected ? "bg-ink text-canvas" : "border border-line bg-paper text-ink"
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {!isPersonal ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-message" className="text-sm font-medium text-ink">
                    Mensaje <span className="font-normal text-mute">(opcional)</span>
                  </label>
                  <textarea
                    id="course-message"
                    name="message"
                    rows={4}
                    className="rounded-xl border border-line-strong bg-paper px-3 py-3 text-base text-ink"
                  />
                </div>
              ) : null}

              <div style={honeypotStyle} aria-hidden>
                <input
                  type="text"
                  name="_website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Enviando…" : isPersonal ? "Enviar" : "Solicitar propuesta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Barra fija inferior de la ficha, solo en móvil y tablet (en escritorio la
 * columna derecha ya es fija). Está visible desde que se abre la ficha y solo
 * se esconde al llegar el footer o mientras se escribe en un formulario (el
 * teclado del teléfono la empujaría sobre los campos).
 *
 * Sin precio desbloqueado lleva al formulario; con precio, abre el brochure.
 * Como la barra ya trae WhatsApp, la burbuja flotante no se muestra en las
 * fichas que la tienen (regla `:has()` en `globals.css`).
 */
function BarraFijaFicha({
  curso,
  cursoSlug,
  pais,
  resumen,
  brochureUrl,
  whatsappCustomText,
}: {
  curso: string;
  cursoSlug: string;
  pais: string;
  resumen: string;
  /** URL del brochure si el visitante ya puede ver precios; si no, null. */
  brochureUrl: string | null;
  whatsappCustomText?: string;
}) {
  const [footerVisible, setFooterVisible] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const esCampo = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]), textarea, select");
    const alEnfocar = (e: FocusEvent) => setEscribiendo(esCampo(e.target));
    const alSalir = (e: FocusEvent) => {
      if (!esCampo(e.relatedTarget)) setEscribiendo(false);
    };
    document.addEventListener("focusin", alEnfocar);
    document.addEventListener("focusout", alSalir);
    return () => {
      document.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("focusout", alSalir);
    };
  }, []);

  // Arranca abajo y sube apenas carga la ficha, como una hoja que se asoma.
  const [entro, setEntro] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setEntro(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  const visible = entro && !footerVisible && !escribiendo;

  const principal =
    "inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98]";
  const secundario =
    "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold no-underline transition-transform active:scale-[0.98]";

  return (
    <div
      role="region"
      aria-label="Temario y precios del curso"
      data-testid="ficha-barra-fija"
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 rounded-t-[28px] border-t border-line bg-paper px-4 pb-[calc(0.875rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(23,23,22,0.14)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-xl">
      <div aria-hidden className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-line-strong" />
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[15px] font-bold tracking-tight text-ink">{curso}</p>
        {resumen ? (
          <p className="inline-flex max-w-[62%] shrink-0 items-center gap-1.5 truncate rounded-full bg-[#15803D]/10 px-2.5 py-1 text-xs font-semibold text-[#126c34]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#15803D]" />
            <span className="truncate">{resumen}</span>
          </p>
        ) : null}
      </div>
      <div className="flex items-stretch gap-2">
        {brochureUrl ? (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackTemario({ action: "view", course: cursoSlug, country: pais, location: "ficha_barra_fija" })
            }
            className={principal}
          >
            <FileText size={16} aria-hidden /> Ver temario y precios
          </a>
        ) : (
          <a href="#inscripcion" className={principal}>
            <FileText size={16} aria-hidden /> Ver temario y precios
          </a>
        )}
        <WhatsAppCta
          page={`/cursos/${cursoSlug}`}
          intent="curso"
          course={curso}
          courseSlug={cursoSlug}
          country={pais}
          ctaPosition="curso_hero"
          customText={whatsappCustomText}
          className={`${secundario} bg-[#15803D] text-white shadow-[0_6px_16px_rgba(21,128,61,0.30)] hover:bg-[#126c34]`}
        >
          <MessageCircle size={17} aria-hidden />
          WhatsApp
        </WhatsAppCta>
      </div>
      </div>
    </div>
  );
}
