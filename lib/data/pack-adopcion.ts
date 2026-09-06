/**
 * Pack Adopción BI — oferta B2B oficial.
 * Precios y plazos son referenciales; editar aquí, no en copy suelto.
 */
export const PACK = {
  name: "Pack Adopción BI",
  headline: "No es un curso. Es el tablero en producción + tu equipo autónomo.",
  tagline: "De reportes eternos a decisiones en minutos.",
  dashboards: "1–3",
  trainingWeeks: "4–6",
  postGoLiveWeeks: "2–4",
  diagnosisMinutes: 30,
  proposalSlaHours: 24,
  /** Piso típico por área (CLP). */
  priceFromClp: 2_900_000,
  /** Rango referencial por área (CLP). */
  priceMinClp: 2_500_000,
  priceMaxClp: 5_000_000,
  priceLabel: "$2.5M–$5M CLP/área",
  priceFromLabel: "desde $2.9M",
  senceLine:
    "Factura directa; el valor es la adopción. Si después hay franquicia SENCE, te orientamos.",
  whatsappE164: "56935409699",
  officeNote: "Santiago, Chile",
} as const;

export type PackVariant = "empresas" | "implementacion" | "migrar-excel";

export const PACK_VARIANT_COPY: Record<
  PackVariant,
  { kicker: string; h1: string; sub: string; title: string; description: string }
> = {
  empresas: {
    kicker: "Pack Adopción BI · Power BI para empresas Chile",
    h1: "No es un curso. Es el tablero en producción + tu equipo autónomo.",
    sub: "Implementación y adopción Power BI en Chile: construimos 1–3 dashboards con los datos de tu área y capacitamos al equipo 4–6 semanas. Mentores de banca, retail y minería. Factura directa.",
    title: "Pack Adopción Power BI para empresas Chile | ProgramBI",
    description:
      "Power BI para empresas en Chile: 1–3 dashboards en producción y tu equipo autónomo en 4–6 semanas. Pack Adopción desde $2.9M CLP. Diagnóstico 30 min.",
  },
  implementacion: {
    kicker: "Implementación Power BI · Chile",
    h1: "Implementación Power BI en Chile, con adopción real.",
    sub: "No entregamos un archivo .pbix y desaparecemos. El Pack Adopción construye 1–3 tableros con tus datos y deja al equipo controlando el reporte. Control de gestión, minería, finanzas y retail.",
    title: "Implementación Power BI Chile | Pack Adopción BI",
    description:
      "Implementación Power BI en Chile para control de gestión: dashboards en producción + capacitación 4–6 semanas. Pack Adopción desde $2.9M CLP/área.",
  },
  "migrar-excel": {
    kicker: "Excel → Power BI · Chile",
    h1: "Migrar Excel a Power BI en control de gestión, sin dejar al analista héroe solo.",
    sub: "Pasamos el cierre y los reportes eternos de control de gestión a tableros en producción, y formamos al equipo para mantenerlos. Pack Adopción BI: construcción + 4–6 semanas de adopción + handoff post go-live.",
    title: "Migrar Excel a Power BI Chile | Control de gestión",
    description:
      "Migrar Excel a Power BI en control de gestión (Chile): tableros en producción y equipo autónomo en 4–6 semanas. Pack Adopción. Diagnóstico 30 min.",
  },
};

export const PACK_PAINS = [
  {
    title: "Excel eterno",
    text: "Cierres que tardan días, versiones cruzadas y el directorio mira datos de hace 2–4 semanas.",
  },
  {
    title: "El analista héroe",
    text: "Una sola persona arma los reportes críticos. Si se va o se enferma, el área se queda ciega.",
  },
  {
    title: "Cursos que se olvidan",
    text: "El equipo hizo un curso genérico y volvió a la planilla. Sin tablero propio, no hay hábito.",
  },
  {
    title: "Consultora que entrega y se va",
    text: "Queda un dashboard que nadie sabe actualizar. Cada filtro nuevo es otra orden de compra.",
  },
] as const;

export const PACK_STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "30 minutos: fuentes, KPIs del área y quién tiene que usar el tablero. Propuesta en menos de 24 h.",
  },
  {
    n: "02",
    title: "Construcción",
    desc: "1–3 dashboards con tus datos reales (Excel, ERP, SQL, cloud). No es un demo de laboratorio.",
  },
  {
    n: "03",
    title: "Adopción",
    desc: "4–6 semanas con el equipo: modelado, DAX útil, reglas del negocio y práctica sobre el tablero vivo.",
  },
  {
    n: "04",
    title: "Handoff + post go-live",
    desc: "Traspaso documentado y 2–4 semanas de acompañamiento después del go-live. Ahí se caen la mayoría de los proyectos BI.",
  },
] as const;

export const PACK_INCLUDES = [
  "1–3 dashboards en producción con datos del área",
  "Capacitación 4–6 semanas para que el equipo los mantenga",
  "Handoff documentado + 2–4 semanas post go-live",
  "Mentores con experiencia en banca, retail y minería",
  "Factura directa (sin SENCE por ahora)",
] as const;

export const PACK_VERTICALS = [
  { label: "Control de gestión", href: "/empresas" },
  { label: "Minería", href: "/cursos/analitica-mineria" },
  { label: "Finanzas", href: "/cursos/analitica-financiera" },
  { label: "Retail", href: "/empresas" },
] as const;

export const PACK_FAQS: { q: string; a: string }[] = [
  {
    q: "¿Es un curso?",
    a: "No. El Pack Adopción BI construye 1–3 dashboards con los datos de tu área y capacita al equipo 4–6 semanas para que los mantenga. El curso abierto de Power BI es otra cosa: es formación individual, no el tablero en producción.",
  },
  {
    q: "¿Puedo franquiciarlo con SENCE?",
    a: "Hoy facturamos directo. El valor del Pack es la adopción (tablero + equipo autónomo), no un código SENCE. Si después hay franquicia, te orientamos.",
  },
  {
    q: "¿Es online o presencial?",
    a: "Diagnóstico y trabajo remoto en vivo, con sesiones sobre tus datos. Si el área está en Santiago y hace sentido una sesión presencial, lo coordinamos en el diagnóstico.",
  },
  {
    q: "¿Cuánto demora la propuesta?",
    a: "Menos de 24 horas después del diagnóstico de 30 minutos, con alcance, plazos y valor referencial por área.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Referencial $2.5M–$5M CLP por área, con piso típico desde $2.9M, según fuentes, cantidad de tableros y tamaño del equipo. El diagnóstico no tiene costo.",
  },
  {
    q: "¿Qué pasa cuando ustedes se van?",
    a: "El proyecto BI típico falla en la adopción. Por eso el Pack incluye handoff y 2–4 semanas post go-live: tu equipo queda operando el modelo, no dependiendo de un consultor para cada filtro.",
  },
];

export const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "¿Qué es el Pack Adopción BI?",
    a: "La oferta para empresas: construimos 1–3 dashboards con los datos del área y capacitamos al equipo 4–6 semanas para que los mantenga. No es un curso abierto. Diagnóstico de 30 minutos, factura directa.",
  },
  {
    q: "¿Los cursos abiertos son lo mismo que el Pack?",
    a: "No. Los cursos (Power BI, SQL, Python) son formación en vivo para particulares o cupos sueltos. El Pack es tablero en producción + autonomía del equipo. Si eres Controller o jefe de área, parte por /empresas.",
  },
  {
    q: "¿Necesito saber programar para un curso?",
    a: "No. Partimos desde cero. La metodología está pensada para profesionales de finanzas, operaciones, minería y administración que quieren trabajar con datos sin depender de TI.",
  },
  {
    q: "¿Cómo son las clases de los cursos?",
    a: "En vivo por Zoom, dos horas por sesión, en horario vespertino Chile. Todas las clases quedan grabadas de por vida en el campus.",
  },
  {
    q: "¿Hay certificado?",
    a: "Sí. Al finalizar el curso abierto recibes un certificado digital. El Pack empresas entrega el tablero, la transferencia y el acompañamiento post go-live.",
  },
];

/** Logos ya presentes en /public/images/logos — no agregar marcas sin archivo. */
export const PACK_LOGO_NAMES = [
  "Tottus",
  "Pucobre",
  "Cencosud",
  "SQM",
  "BCI",
  "Deloitte",
  "CGE",
  "BASF",
] as const;

/** Nombres que ya aparecen en el sitio (copy de instructores / logos). */
export const PACK_CITED_CLIENTS = ["Tottus", "Pucobre", "CAP", "AngloAmerican", "SQM", "Deloitte"] as const;
