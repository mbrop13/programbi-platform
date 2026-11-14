import type { Metadata } from "next";
import { ISO_CHILE } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { getCourseBySlug } from "@/lib/data/courses";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import {
  SITE_URL,
  absoluteUrl,
  pageOg,
  tituloSeo,
} from "@/lib/seo";
import { hreflangDe } from "@/lib/paises/rutas";

/**
 * Contenido de las landings de nicho de la fase 5.
 *
 * Reglas de esta fuente:
 * - Los montos, horas y niveles NO se escriben acá: se leen de
 *   `config/pricing.ts`, `config/cuotas.ts` y `lib/data/courses.ts`.
 * - No hay alumnos, clientes, reseñas, cupos, fechas de cohorte ni cifras de
 *   resultados inventadas. Los ejemplos son ejercicios de clase.
 * - Las guías enlazadas existen en `lib/guias/generado.ts`.
 */

export type LandingLink = {
  href: string;
  label: string;
  description?: string;
};

export type LandingSection = {
  id?: string;
  eyebrow?: string;
  h2: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: { title: string; text: string }[];
  steps?: { title: string; text: string }[];
};

export type LandingPricing =
  | { mode: "catalog"; intro: string; slugs: string[] }
  | { mode: "quote"; intro: string; bullets: string[] };

export type NicheLanding = {
  path: string;
  kicker: string;
  h1: string;
  /** Sin la marca: `tituloSeo` agrega « | ProgramBI» y respeta el tope de 60. */
  title: string;
  description: string;
  lead: string;
  tags: string[];
  parentCrumb: LandingLink;
  courseSlug?: string;
  /** Fichas individuales del stack, para el ItemList y los enlaces visibles. */
  stack?: { name: string; href: string; note: string }[];
  primaryCta: LandingLink;
  secondaryCta: LandingLink;
  facts?: { label: string; value: string }[];
  sections: LandingSection[];
  pricing: LandingPricing;
  faqs: { q: string; a: string }[];
  guides: LandingLink[];
  related: LandingLink[];
  closing: { title: string; text: string; label: string; href: string };
  showLogos?: boolean;
  contact?: boolean;
};

export const LANDING_KEYS = [
  "power-bi-para-finanzas",
  "power-bi-sql-server-python",
  "analisis-de-datos-mineria",
  "capacitacion-empresas",
] as const;

export type LandingKey = (typeof LANDING_KEYS)[number];

const FINANZAS: NicheLanding = {
  path: "/power-bi-para-finanzas",
  kicker: "Power BI · Finanzas y control de gestión",
  h1: "Analítica financiera con Power BI",
  title: "Analítica financiera con Power BI: curso en vivo",
  description:
    "Analítica financiera con Power BI en vivo: modelo de datos, DAX y tableros de margen, presupuesto y variación. Curso en Chile, con certificado.",
  lead: "El cierre de mes no debería depender de tres planillas y de la persona que se acuerda de las fórmulas. Este curso enseña a modelar los datos financieros y a construir el tablero de control en Power BI, con el criterio de quien reporta a gerencia.",
  tags: ["Power BI", "Finanzas", "Control de gestión"],
  parentCrumb: { href: "/cursos", label: "Cursos" },
  courseSlug: "power-bi",
  primaryCta: { href: "/cursos/power-bi", label: "Ver el curso Power BI" },
  secondaryCta: { href: "/test-nivel", label: "Test de nivel" },
  sections: [
    {
      id: "a-quien-sirve",
      eyebrow: "Perfil",
      h2: "A quién sirve este curso",
      paragraphs: [
        "Está pensado para analistas financieros, controllers, jefaturas de administración y contabilidad, y profesionales que hoy consolidan presupuesto, real y forecast en Excel. También sirve a quien ya armó tablas dinámicas y quiere dar el paso a un modelo de datos que no se rompa cuando cambia el mes.",
        "No es un curso de modelación financiera en Excel ni de estadística avanzada. Es Power BI aplicado a la reportería de gestión: conectar los datos, ordenarlos, medir y publicar. Si buscas machine learning o análisis predictivo con Python, la ruta está en otra ficha del catálogo.",
      ],
      bullets: [
        "Ya trabajas con centros de costo, cuentas contables o líneas de negocio.",
        "Te piden el informe de margen o la desviación de presupuesto cada mes.",
        "Quieres dejar de rehacer el mismo cuadro y dedicar ese tiempo a analizarlo.",
      ],
    },
    {
      id: "que-aprenderas",
      eyebrow: "Resultados",
      h2: "Qué aprenderás",
      paragraphs: [
        "El curso parte de la conexión y termina en un tablero publicado. Estos son los aprendizajes que declara la ficha de Power BI, ordenados para el trabajo de finanzas:",
      ],
      bullets: [
        "Conectar y limpiar extractos del ERP, del banco y del presupuesto con Power Query, sin pegar columnas a mano.",
        "Armar un modelo estrella con dimensiones de cuenta, centro de costo, sociedad y calendario.",
        "Escribir medidas DAX para ventas, costo, margen, desviación y acumulados.",
        "Resolver inteligencia de tiempo: mes anterior, mismo mes del año anterior y acumulado del año.",
        "Publicar el tablero en Power BI Service y programar su actualización con gateway.",
        "Aplicar seguridad a nivel de fila (RLS) cuando distintas gerencias ven distintos datos.",
      ],
    },
    {
      id: "temario",
      eyebrow: "Contenido",
      h2: "Temario resumido del curso Power BI",
      paragraphs: [
        "La ficha organiza el curso en tres bloques. El abierto es básico-intermedio y se dicta en vivo; el nivel avanzado tiene su propia página y su propio precio publicado.",
      ],
      cards: [
        {
          title: "Conexión y Power Query",
          text: "Conexión a múltiples fuentes, transformación de datos, parámetros y funciones M, y limpieza automatizada de los archivos que llegan cada mes.",
        },
        {
          title: "Modelado y DAX",
          text: "Modelo estrella y relaciones, medidas CALCULATE y FILTER, time intelligence, RANKX e iteradores. Es el bloque que define si los números cuadran.",
        },
        {
          title: "Dashboards y publicación",
          text: "Diseño UX de reportes, visuales nativos y personalizados, gateway y actualización programada, y seguridad a nivel de fila.",
        },
      ],
    },
    {
      id: "casos",
      eyebrow: "En clase",
      h2: "Los casos que vas a resolver",
      paragraphs: [
        "Los ejercicios usan archivos de ejemplo con la lógica de una empresa: no son tableros de clientes ni cifras de resultados. La idea es que reconozcas la estructura y puedas repetirla con tus propios extractos.",
      ],
      bullets: [
        "Presupuesto contra real por centro de costo, con la desviación en monto y en porcentaje.",
        "Margen por línea, canal o sucursal, separando costo directo de gasto de estructura.",
        "Cuentas por cobrar por tramo de vencimiento y evolución del saldo mes a mes.",
        "Comparación interanual y acumulado del año para las cuentas que reporta gerencia.",
      ],
    },
    {
      id: "salidas",
      eyebrow: "Mercado",
      h2: "Salidas laborales del perfil Power BI",
      paragraphs: [
        "El catálogo del curso declara tres categorías ocupacionales: Especialista en Power BI, Analista de Business Intelligence y BI Developer. En el mundo financiero, el uso típico aparece en control de gestión, FP&A y reportería de gerencia: personas que no programan pero sí necesitan dominar el modelo y las medidas.",
        "Este curso no promete un cargo ni un sueldo. Lo que entrega es una herramienta concreta y un proyecto de tablero que puedes mostrar en una entrevista o usar en tu trabajo actual.",
      ],
    },
    {
      id: "clases",
      eyebrow: "Formato",
      h2: "Cómo son las clases",
      paragraphs: [
        "Las sesiones son en vivo por Zoom, con el mentor compartiendo pantalla y los participantes practicando sobre los mismos archivos. No es un curso de videos pregrabados: puedes preguntar por qué una medida da distinto y corregirlo en el momento.",
        "Las clases quedan grabadas en el campus para que puedas repasar, y al completar el curso recibes el certificado de ProgramBI. El requisito de entrada es manejo de Excel y archivos; no se pide experiencia previa en DAX ni en programación.",
      ],
    },
    {
      id: "precio-detalle",
      eyebrow: "Valor",
      h2: "Cómo se compone el precio",
      paragraphs: [
        "Power BI se vende por nivel: el valor publicado corresponde a un nivel, no al programa completo. La ficha muestra los niveles disponibles y qué incluye cada uno.",
        `El curso se puede pagar en ${textoCuotas(ISO_CHILE)}. Los medios de pago y el valor vigente se confirman en el checkout y en la página de precios; esta landing no inventa descuentos, cupos ni fechas de inicio.`,
      ],
    },
  ],
  pricing: {
    mode: "catalog",
    intro:
      "Precio de lista publicado para el curso Power BI. Los niveles disponibles y el cupo se confirman en la ficha.",
    slugs: ["power-bi"],
  },
  faqs: [
    {
      q: "¿Qué es la analítica financiera?",
      a: "Es el análisis de los datos financieros de la empresa —presupuesto, costo, margen, cuentas por cobrar— para explicar qué pasó y decidir con esa base. En la práctica se apoya en un modelo de datos y tableros, no en planillas armadas a mano cada mes.",
    },
    {
      q: "¿Necesito saber programar?",
      a: "No. El curso parte desde cero en DAX y no pide experiencia previa en programación: las medidas se escriben dentro de Power BI. Sí conviene manejar Excel a nivel de tablas y fórmulas.",
    },
    {
      q: "¿Necesito saber DAX para tomar este curso?",
      a: "No. El curso parte desde cero en DAX y avanza hasta CALCULATE, FILTER, time intelligence, RANKX e iteradores. Sí conviene manejar Excel a nivel de tablas y fórmulas.",
    },
    {
      q: "¿Sirve si mi empresa usa SAP u otro ERP?",
      a: "Sí. El curso trabaja conexión a múltiples fuentes y limpieza con Power Query, así que puedes partir de extractos del ERP. No promete un conector específico ni una integración llave en mano: eso se revisa con el área de TI.",
    },
    {
      q: "¿El tablero queda actualizándose solo?",
      a: "Se enseña a programar la actualización con gateway y a publicar en Power BI Service. Que funcione sin intervención depende de la infraestructura y los permisos de la empresa.",
    },
    {
      q: "¿Entregan certificado?",
      a: "Sí, certificado de ProgramBI al completar el curso. No es una certificación de Microsoft ni reemplaza el examen PL-300.",
    },
    {
      q: "¿Las clases son en vivo o grabadas?",
      a: "En vivo por Zoom, con grabaciones disponibles en el campus para repasar. El curso se dicta en horario vespertino, hora de Chile.",
    },
    {
      q: "¿Puedo pagar en cuotas?",
      a: `Sí, el curso se puede pagar en ${textoCuotas(ISO_CHILE)}. La pasarela confirma el medio disponible al momento de pagar.`,
    },
  ],
  guides: [
    {
      href: "/guias/como-aprender-power-bi-en-chile",
      label: "Cómo aprender Power BI en Chile",
      description:
        "Ruta de ocho semanas, funciones DAX con ejemplos en pesos y dónde buscar trabajo en BI.",
    },
    {
      href: "/guias/funciones-dax-mas-importantes",
      label: "Las funciones DAX más importantes",
      description:
        "CALCULATE, FILTER, time intelligence y las medidas que más se usan en reportería.",
    },
    {
      href: "/guias/power-bi-vs-excel",
      label: "Power BI vs Excel",
      description:
        "Cuándo conviene cada herramienta y cómo conviven en un área de finanzas.",
    },
  ],
  related: [
    { href: "/cursos/power-bi", label: "Ficha del curso Power BI" },
    { href: "/cursos/power-bi?nivel=Avanzado", label: "Nivel avanzado de Power BI" },
    { href: "/power-bi-sql-server-python", label: "Ruta Power BI, SQL Server y Python" },
    { href: "/capacitacion-empresas", label: "Capacitación para empresas" },
    { href: "/precios", label: "Precios y medios de pago" },
    { href: "/faq", label: "Preguntas frecuentes" },
    { href: "/test-nivel", label: "Test de nivel" },
  ],
  closing: {
    title: "Lleva tu cierre de mes a un tablero que puedas mantener",
    text: "El curso Power BI trabaja Power Query, modelo estrella y DAX sobre casos de gestión. Revisa la ficha y elige el nivel que corresponde a tu punto de partida.",
    label: "Ver curso Power BI",
    href: "/cursos/power-bi",
  },
};

const STACK: NicheLanding = {
  path: "/power-bi-sql-server-python",
  kicker: "Ruta de datos · SQL, Power BI y Python",
  h1: "Power BI, SQL Server y Python: la ruta completa de datos",
  title: "Power BI, SQL Server y Python para datos",
  description:
    "Ruta de datos en Chile: SQL Server para consultar, Power BI para modelar y Python para automatizar. Curso de Análisis de Datos en vivo y fichas por herramienta.",
  lead: "SQL Server para sacar el dato, Power BI para modelarlo y Python para automatizar lo que se repite. La ruta completa es el curso de Análisis de Datos; las fichas individuales sirven si solo necesitas una pieza del stack.",
  tags: ["SQL Server", "Power BI", "Python"],
  parentCrumb: { href: "/cursos", label: "Cursos" },
  courseSlug: "analisis-de-datos",
  stack: [
    {
      name: "SQL Server",
      href: "/cursos/sql-server",
      note: "Consultas, joins, CTEs, window functions y procedimientos almacenados.",
    },
    {
      name: "Power BI",
      href: "/cursos/power-bi",
      note: "Power Query, modelo estrella, DAX y publicación de tableros.",
    },
    {
      name: "Python",
      href: "/cursos/python",
      note: "Pandas, visualización y automatización de procesos de datos.",
    },
  ],
  primaryCta: { href: "/cursos/analisis-de-datos", label: "Ver la ruta completa" },
  secondaryCta: { href: "/test-nivel", label: "Test de nivel" },
  sections: [
    {
      id: "por-que",
      eyebrow: "El stack",
      h2: "Por qué las tres herramientas, en ese orden",
      paragraphs: [
        "En una empresa el dato suele vivir en una base SQL Server. Alguien tiene que saber consultarlo sin depender del área de TI; ese es el primer eslabón. Después ese dato necesita un modelo, relaciones y medidas: ahí entra Power BI. Y cuando el proceso se repite todas las semanas, o el análisis no cabe en DAX, entra Python.",
        "No son tres cursos sueltos puestos uno al lado del otro. En la ruta de Análisis de Datos las tres herramientas se usan en el mismo proyecto: consultas a bases reales, modelo y dashboards, y automatización con Pandas. Esa es la diferencia entre saber tres programas y saber resolver un problema de datos.",
      ],
    },
    {
      id: "a-quien-sirve",
      eyebrow: "Perfil",
      h2: "A quién sirve la ruta",
      paragraphs: [
        "Sirve a quien ya trabaja con Excel y quiere pasar a un flujo profesional de datos, a analistas junior que necesitan cubrir la brecha entre la consulta y el tablero, y a profesionales de operaciones o finanzas que reciben datos de sistemas y los consolidan a mano.",
        "No es para quien solo quiere hacer gráficos bonitos. La ruta incluye SQL y Python porque el trabajo real de análisis no termina en el visual: empieza en la fuente y sigue en la automatización.",
      ],
      bullets: [
        "Quieres entender de dónde sale el número, no solo mostrarlo.",
        "Necesitas consultar la base sin pedir un reporte nuevo cada semana.",
        "Buscas un perfil híbrido: análisis, modelado y algo de automatización.",
      ],
    },
    {
      id: "herramientas",
      eyebrow: "Cada pieza",
      h2: "Qué cubre cada herramienta",
      cards: [
        {
          title: "SQL Server",
          text: "SELECT, WHERE, JOIN, GROUP BY, subqueries, CTEs y funciones de ventana. Después procedimientos almacenados, triggers, índices y diseño de esquemas. Se trabaja con T-SQL y SSMS.",
        },
        {
          title: "Power BI",
          text: "Power Query para ETL, modelo estrella con relaciones, DAX desde cero a avanzado, dashboards interactivos, publicación en Power BI Service y seguridad a nivel de fila.",
        },
        {
          title: "Python",
          text: "Fundamentos del lenguaje, estructuras de datos, Pandas para limpiar y transformar, Matplotlib y Seaborn para visualizar, y automatización de reportes y conexiones.",
        },
      ],
    },
    {
      id: "temario",
      eyebrow: "La ruta",
      h2: "Temario de Análisis de Datos",
      paragraphs: [
        "La ficha del curso lo declara como dos niveles de 60 horas cada uno: básico-intermedio y avanzado. El programa completo son 120 horas y cada nivel se vende por separado.",
      ],
      cards: [
        {
          title: "Básico-Intermedio · 60 horas",
          text: "SQL Server con SELECT, JOIN, GROUP BY y consultas a bases reales; Power BI con Power Query, modelo estrella y DAX; Python con Pandas, Matplotlib y limpieza; dashboards y reportes automatizados.",
        },
        {
          title: "Avanzado · 60 horas",
          text: "Procedimientos almacenados y automatización en SQL; inteligencia de tiempo, RLS y publicación en Power BI; Plotly, funciones propias y análisis predictivo con Python; proyecto final integrador.",
        },
      ],
    },
    {
      id: "como-se-combinan",
      eyebrow: "En la práctica",
      h2: "Cómo se combinan en un proyecto",
      paragraphs: [
        "El flujo de trabajo que se practica en clase tiene cinco pasos. No es una receta rígida: en cada empresa cambia la fuente y el nivel de automatización, pero el orden ayuda a no construir un tablero sobre datos que nadie entiende.",
      ],
      steps: [
        {
          title: "Extraer",
          text: "Consultar la base con SQL o tomar un extracto. La pregunta de negocio define qué columnas y qué período se necesitan.",
        },
        {
          title: "Limpiar",
          text: "Transformar en Power Query o en Pandas: tipos, nulos, duplicados y nombres consistentes.",
        },
        {
          title: "Modelar",
          text: "Separar hechos y dimensiones, crear el calendario y definir las relaciones.",
        },
        {
          title: "Medir",
          text: "Escribir las medidas DAX que responden a las preguntas de gerencia.",
        },
        {
          title: "Publicar y automatizar",
          text: "Subir el tablero a Power BI Service y dejar en Python lo que se repite fuera de la herramienta.",
        },
      ],
    },
    {
      id: "salidas",
      eyebrow: "Mercado",
      h2: "Salidas laborales de la ruta",
      paragraphs: [
        "La ficha declara tres categorías ocupacionales: Analista de Datos, Business Intelligence Analyst y Data Analyst. Son roles que combinan consulta, modelado y visualización, justo el centro de esta ruta.",
        "No prometemos un cargo ni un sueldo. La ventaja de cubrir las tres herramientas es que puedes moverte entre la fuente y la entrega: no dependes de que alguien más te prepare el dato ni de que otro arme el tablero.",
      ],
    },
    {
      id: "clases",
      eyebrow: "Formato",
      h2: "Cómo son las clases",
      paragraphs: [
        "Las clases son en vivo por Zoom, con ejercicios sobre bases y archivos de ejemplo. Cada nivel dura 60 horas y termina con un proyecto que integra las tres herramientas. Las grabaciones quedan en el campus y al completar recibes el certificado de ProgramBI.",
        "No se exige experiencia previa en programación. Python parte desde los fundamentos y SQL desde la primera consulta; lo que sí ayuda es tener método para trabajar con archivos y planillas.",
      ],
    },
    {
      id: "precio-detalle",
      eyebrow: "Valor",
      h2: "Cómo se compone el precio",
      paragraphs: [
        "La ruta completa se publica en la ficha de Análisis de Datos. Las fichas de SQL Server, Power BI y Python tienen su propio valor y también se venden por nivel. Todos los montos salen de la tabla de precios del sitio.",
        `El pago se puede dividir en ${textoCuotas(ISO_CHILE)}. No hay un descuento de pack en esta página: pagas el valor publicado de la ruta o de la ficha individual que elijas.`,
      ],
    },
  ],
  pricing: {
    mode: "catalog",
    intro:
      "Valores publicados para la ruta completa y para cada ficha individual. La ruta se vende por nivel, igual que las fichas de herramienta.",
    slugs: ["analisis-de-datos", "power-bi", "sql-server", "python"],
  },
  faqs: [
    {
      q: "¿Puedo tomar solo Power BI y no toda la ruta?",
      a: "Sí. La ficha de Power BI cubre Power Query, modelo y DAX. La ruta de Análisis de Datos es para quien necesita también SQL Server y Python en el mismo programa.",
    },
    {
      q: "¿Necesito saber programar para entrar?",
      a: "No. Python parte desde los fundamentos y SQL desde la primera consulta. Si ya programaste, puedes avanzar más rápido, pero no es requisito.",
    },
    {
      q: "¿Cuánto dura la ruta completa?",
      a: "Dos niveles de 60 horas cada uno: 120 horas en total. Cada nivel se vende por separado y tiene su propio proyecto final.",
    },
    {
      q: "¿SQL Server o SQL genérico?",
      a: "El curso usa SQL Server y T-SQL, con SQL Server Management Studio. Lo que aprendes de consultas, joins y modelado se transfiere a otros motores, pero la sintaxis específica es la de SQL Server.",
    },
    {
      q: "¿La ruta incluye certificaciones de Microsoft?",
      a: "No. Entrega certificado de ProgramBI al completar. No prometemos certificaciones externas ni exámenes de Microsoft incluidos.",
    },
    {
      q: "¿Puedo pagar en cuotas?",
      a: `Sí, tanto la ruta como las fichas individuales se pueden pagar en ${textoCuotas(ISO_CHILE)}. El medio disponible se confirma al pagar.`,
    },
  ],
  guides: [
    {
      href: "/guias/curso-sql-server-chile",
      label: "Curso SQL Server en Chile",
      description:
        "Qué se aprende, para qué sirve T-SQL y cómo se conecta con el análisis de datos.",
    },
    {
      href: "/guias/curso-python-chile",
      label: "Curso Python para datos en Chile",
      description:
        "Pandas, visualización y automatización: la ruta de Python aplicada al trabajo.",
    },
    {
      href: "/guias/curso-analisis-de-datos-chile",
      label: "Curso de análisis de datos en Chile",
      description:
        "La ruta completa de SQL Server, Power BI y Python, con niveles y temario.",
    },
  ],
  related: [
    { href: "/cursos/analisis-de-datos", label: "Ficha de Análisis de Datos" },
    { href: "/cursos/power-bi", label: "Ficha de Power BI" },
    { href: "/cursos/sql-server", label: "Ficha de SQL Server" },
    { href: "/cursos/python", label: "Ficha de Python para Datos" },
    { href: "/power-bi-para-finanzas", label: "Power BI para finanzas" },
    { href: "/analisis-de-datos-mineria", label: "Análisis de datos para minería" },
    { href: "/precios", label: "Precios y medios de pago" },
    { href: "/faq", label: "Preguntas frecuentes" },
    { href: "/test-nivel", label: "Test de nivel" },
  ],
  closing: {
    title: "Empieza por la ruta completa",
    text: "Análisis de Datos une SQL Server, Power BI y Python en dos niveles de 60 horas, con un proyecto final que integra las tres herramientas.",
    label: "Ver Análisis de Datos",
    href: "/cursos/analisis-de-datos",
  },
};

const MINERIA: NicheLanding = {
  path: "/analisis-de-datos-mineria",
  kicker: "Análisis de datos · Minería",
  h1: "Análisis de datos para minería: del turno al tablero",
  title: "Análisis de datos para minería en Chile",
  description:
    "Curso de análisis de datos para minería en Chile: Power BI, SQL y Python aplicados a turnos, OEE y mantenimiento. Dos niveles, en vivo.",
  lead: "En faena el dato existe, pero llega tarde y en tres formatos distintos. Este curso trabaja con Power BI, SQL y Python sobre los reportes de turno, la flota y el mantenimiento, para que el tablero lo mantenga alguien del área.",
  tags: ["Minería", "Power BI", "SQL", "Python"],
  parentCrumb: { href: "/cursos/analitica-mineria", label: "Curso minería" },
  courseSlug: "analitica-mineria",
  primaryCta: { href: "/cursos/analitica-mineria", label: "Ver curso de minería" },
  secondaryCta: { href: "/power-bi-mineria-chile", label: "Power BI en minería" },
  sections: [
    {
      id: "a-quien-sirve",
      eyebrow: "Perfil",
      h2: "A quién sirve este curso",
      paragraphs: [
        "Está dirigido a supervisores e ingenieros de mina, planta, mantenimiento y planificación; a analistas de operaciones que consolidan reportes de turno; y a profesionales de seguridad o medio ambiente que reportan indicadores a la gerencia. Si trabajas en faena y el reporte te consume el día, el curso apunta a ese problema.",
        "No se exige experiencia previa en programación. Se recomienda manejar Excel a nivel de tablas y fórmulas, porque los ejercicios parten de archivos y consultas. El enfoque es minero: los casos hablan de turnos, equipos, leyes, consumo y mantenimiento, no de retail ni de banca.",
      ],
      bullets: [
        "Consolidas información de turno, flota o mantenimiento en planillas.",
        "Necesitas cruzar datos de distintas áreas sin pedir un reporte nuevo.",
        "Quieres que el tablero de faena se actualice sin rehacerlo cada semana.",
      ],
    },
    {
      id: "que-aprenderas",
      eyebrow: "Resultados",
      h2: "Qué aprenderás",
      paragraphs: [
        "La ficha del curso de minería declara cinco aprendizajes. Están redactados en lenguaje de operación, no de herramienta, porque el objetivo es resolver el reporte de faena:",
      ],
      bullets: [
        "Dashboards de producción, seguridad y mantenimiento de flotas con visibilidad operativa.",
        "Conexión mediante SQL a servidores de la mina, incluidos PI System y SCADA según la ficha del curso.",
        "Modelado de vida útil de activos con Python, usando Pandas y Plotly.",
        "Automatización de la consolidación de reportes de turno para no depender de copiar y pegar.",
        "Uso de inteligencia artificial en cada nivel, desde consultas en lenguaje natural hasta medidas DAX asistidas.",
      ],
    },
    {
      id: "temario",
      eyebrow: "Contenido",
      h2: "Temario del curso",
      paragraphs: [
        "Para particulares, la ficha vende dos niveles de 20 horas: Básico-Intermedio y Avanzado. El temario se organiza en tres bloques que recorren desde los fundamentos operativos hasta la predictividad. El contenido que sigue sale de la ficha publicada; no incluye datos confidenciales de ninguna faena ni resultados de clientes.",
      ],
      cards: [
        {
          title: "Bloque I · Fundamentos operativos",
          text: "Power BI para reportes de turno y limpieza de datos de minería; SQL Server con consultas esenciales a bases de la mina; Python para automatizar logs de sensores con Pandas; IA para consultas en lenguaje natural de faena.",
        },
        {
          title: "Bloque II · Análisis de faena",
          text: "DAX avanzado para eficiencia de equipos y OEE; cruce de flota, combustible y personal en SQL; análisis de tendencias y visualizaciones industriales con Python; medidas DAX complejas asistidas por IA.",
        },
        {
          title: "Bloque III · Predictividad y servidores",
          text: "Inteligencia de tiempo y RLS dinámico por área en Power BI; procedimientos almacenados para Data Warehouse; modelos predictivos de fallas y dashboards interactivos con Plotly; procesos ETL predictivos.",
        },
      ],
    },
    {
      id: "casos",
      eyebrow: "En clase",
      h2: "Del reporte de turno al tablero",
      paragraphs: [
        "Los ejercicios replican la lógica de una operación minera con datos de ejemplo. No son tableros de una mina real ni cifras de producción de un cliente: son casos para practicar el cruce, el modelo y la visualización.",
      ],
      bullets: [
        "Producción por guardia, equipo y operador, con la comparación contra el turno anterior.",
        "OEE: disponibilidad, rendimiento y calidad, separando la causa de la pérdida.",
        "Flota y combustible: consumo por equipo y ruta, cruzado con la asignación de personal.",
        "Mantenimiento: fallas, vida útil de activos y señales para un modelo predictivo.",
      ],
    },
    {
      id: "salidas",
      eyebrow: "Mercado",
      h2: "Para qué te prepara (y qué no promete)",
      paragraphs: [
        "Este curso no declara una certificación de cargo ni promete un sueldo. Te prepara para funciones de análisis de operaciones, reportería de faena y control de gestión minero: el tipo de trabajo que existe en una operación y que hoy suele resolverse con planillas separadas.",
        "Si lo que buscas es una certificación internacional de minería o un curso de geología, este no es el lugar. Si buscas que tu tablero de turno, flota o mantenimiento esté bien modelado y se pueda mantener, sí.",
      ],
    },
    {
      id: "clases",
      eyebrow: "Formato",
      h2: "Cómo son las clases",
      paragraphs: [
        "Las clases son en vivo por Zoom, con ejercicios sobre archivos y bases de ejemplo. Cada nivel público dura 20 horas según la ficha del curso, y el participante practica con la misma secuencia que usaría en faena: extraer, limpiar, modelar, medir y publicar.",
        "Las sesiones quedan grabadas en el campus y al completar recibes el certificado de ProgramBI. No se cargan datos confidenciales de la empresa en clase: si quieres trabajar con un caso propio, se revisa antes con el mentor.",
      ],
    },
    {
      id: "precio-detalle",
      eyebrow: "Valor",
      h2: "Cómo se compone el precio",
      paragraphs: [
        "Análisis de Datos para la Minería comparte el precio publicado de Análisis de Datos y se vende por nivel. El monto sale de la tabla de precios del sitio, no de esta página.",
        `El curso se puede pagar en ${textoCuotas(ISO_CHILE)}. La ficha confirma el valor vigente y la disponibilidad; acá no hay cupos, fechas de cohorte ni descuentos inventados.`,
      ],
    },
  ],
  pricing: {
    mode: "catalog",
    intro:
      "Precio publicado para Análisis de Datos para la Minería. El curso se vende por nivel y el cupo se confirma en la ficha.",
    slugs: ["analitica-mineria"],
  },
  faqs: [
    {
      q: "¿Este curso es solo para minería?",
      a: "Sí. Los casos, el temario y los datos de ejemplo están planteados para operación minera: turnos, flota, OEE, mantenimiento y servidores de faena. No es un curso genérico de Power BI.",
    },
    {
      q: "¿Necesito experiencia en minería?",
      a: "No es obligatoria, pero ayuda. Si ya trabajas en faena, vas a reconocer los reportes y las preguntas de gerencia; si vienes de otra industria, el curso te muestra el contexto con ejercicios guiados.",
    },
    {
      q: "¿Necesito saber programar?",
      a: "No. Python se trabaja desde los fundamentos aplicados a datos y SQL parte de consultas esenciales. Lo que sí conviene es manejar Excel a nivel de tablas y fórmulas.",
    },
    {
      q: "¿Cuántos niveles tiene?",
      a: "Se organiza en dos niveles de 20 horas: Básico-Intermedio y Avanzado. Cubre fundamentos operativos, análisis de faena y predictividad, y las empresas también cotizan ambos niveles para su equipo.",
    },
    {
      q: "¿Puedo usar datos de mi empresa en clase?",
      a: "En clase se usan datos de ejemplo. Si quieres trabajar con un caso propio, se revisa antes con el mentor para evitar cargar información confidencial en una sesión grupal.",
    },
    {
      q: "¿Entregan certificado?",
      a: "Sí, certificado de ProgramBI al completar el nivel. No es una certificación internacional de minería ni de Microsoft.",
    },
  ],
  guides: [
    {
      href: "/guias/curso-analitica-mineria-chile",
      label: "Curso de analítica para minería en Chile",
      description:
        "Temario, niveles y aplicación de Power BI, SQL y Python en operación minera.",
    },
    {
      href: "/guias/como-aprender-power-bi-en-chile",
      label: "Cómo aprender Power BI en Chile",
      description:
        "La ruta de Power BI desde Power Query hasta DAX y publicación de tableros.",
    },
    {
      href: "/guias/sueldo-analista-de-datos-latinoamerica",
      label: "Sueldo de analista de datos en Latinoamérica",
      description:
        "Referencias de mercado para entender el rango del perfil, sin promesas de sueldo.",
    },
  ],
  related: [
    { href: "/cursos/analitica-mineria", label: "Ficha del curso de minería" },
    { href: "/power-bi-mineria-chile", label: "Power BI para minería en Chile" },
    { href: "/power-bi-sql-server-python", label: "Ruta Power BI, SQL Server y Python" },
    { href: "/capacitacion-empresas", label: "Capacitación para empresas" },
    { href: "/precios", label: "Precios y medios de pago" },
    { href: "/faq", label: "Preguntas frecuentes" },
    { href: "/test-nivel", label: "Test de nivel" },
  ],
  closing: {
    title: "Lleva el reporte de turno a un tablero que se mantenga",
    text: "Dos niveles de 20 horas (Básico-Intermedio y Avanzado) con Power BI, SQL y Python aplicados a faena, con ejercicios de turno, OEE, flota y mantenimiento.",
    label: "Ver curso de minería",
    href: "/cursos/analitica-mineria",
  },
};

const EMPRESAS: NicheLanding = {
  path: "/capacitacion-empresas",
  kicker: "Capacitación · Empresas",
  h1: "Capacitación en datos para empresas: programas in-company",
  title: "Capacitación en datos para empresas en Chile",
  description:
    "Capacitación in-company en Chile: Power BI, SQL, Python, Excel e IA con los datos de tu equipo. Propuesta a medida, en vivo y con factura.",
  lead: "Un programa cerrado para tu equipo, con los datos y los reportes que ya usan. No es el curso abierto: se arma según el área, el tamaño del grupo y lo que necesitan saber hacer.",
  tags: ["Capacitación", "Empresas", "Power BI"],
  parentCrumb: { href: "/empresas", label: "Empresas" },
  primaryCta: { href: "#contacto", label: "Pedir una propuesta" },
  secondaryCta: { href: "/empresas", label: "Ver solución de empresas" },
  facts: [
    { label: "Formato", value: "In-company, grupo cerrado" },
    { label: "Modalidad", value: "Online en vivo" },
    { label: "Facturación", value: "Factura a la empresa" },
    { label: "Propuesta", value: "Según alcance y equipo" },
  ],
  sections: [
    {
      id: "a-quien-sirve",
      eyebrow: "Perfil",
      h2: "A quién sirve",
      paragraphs: [
        "Sirve a gerencias de finanzas, operaciones, comercial y personas que necesitan que su equipo deje de depender de una planilla manual. También a responsables de capacitación que buscan un proveedor con propuesta, factura y reporte de asistencia, no un video suelto.",
        "Si lo que buscas es un cupo individual en un curso abierto, esta no es la página: ve al catálogo de cursos. Acá se trabaja con un grupo de la misma empresa y un alcance definido entre ambas partes.",
      ],
      bullets: [
        "El área reporta en Excel y el cierre depende de una sola persona.",
        "Necesitan capacitar a un equipo completo, no a un individuo.",
        "La empresa pide factura, orden de compra y respaldo de asistencia.",
      ],
    },
    {
      id: "temas",
      eyebrow: "Contenido",
      h2: "Qué se puede capacitar",
      paragraphs: [
        "Los temas salen del catálogo real de ProgramBI. No hay cursos inventados para esta landing: cada programa se arma con el contenido de una ficha existente y se adapta al nivel del equipo.",
      ],
      cards: [
        {
          title: "Power BI",
          text: "Power Query, modelo estrella, DAX y dashboards. El programa puede incluir publicación en Power BI Service y seguridad a nivel de fila.",
        },
        {
          title: "SQL Server",
          text: "Consultas, joins, CTEs, funciones de ventana, procedimientos almacenados y optimización. Para equipos que necesitan llegar a la fuente del dato.",
        },
        {
          title: "Python para datos",
          text: "Pandas, limpieza, visualización y automatización de reportes. Útil cuando el proceso se repite o el análisis no cabe en una planilla.",
        },
        {
          title: "Excel",
          text: "Tablas dinámicas, fórmulas avanzadas, Power Query y dashboards. La base para ordenar el trabajo antes de saltar a BI.",
        },
        {
          title: "IA y automatización",
          text: "Copilot, Claude y Power Automate aplicados a tareas de oficina. Para equipos administrativos que quieren ganar tiempo sin programar.",
        },
      ],
    },
    {
      id: "como-funciona",
      eyebrow: "Proceso",
      h2: "Cómo se arma un programa",
      paragraphs: [
        "El proceso es corto y concreto. No hay un cuestionario eterno ni una propuesta genérica: se conversa el caso, se define el alcance y se capacita en vivo.",
      ],
      steps: [
        {
          title: "Nos cuentas el caso",
          text: "Área, tamaño del grupo y qué necesitan saber hacer. Una primera conversación para entender el caso y definir el alcance.",
        },
        {
          title: "Armamos el programa",
          text: "Temas, nivel, fechas y valor. Te llega una propuesta concreta con el alcance y la forma de trabajo.",
        },
        {
          title: "Capacitamos en vivo",
          text: "El equipo practica con sus datos. Quedan grabaciones y material para repasar después de la sesión.",
        },
      ],
    },
    {
      id: "incluye",
      eyebrow: "Alcance",
      h2: "Qué incluye una capacitación in-company",
      paragraphs: [
        "La capacitación está pensada para que el equipo quede haciendo el trabajo, no para que dependa de un consultor para cada filtro. Estos son los puntos que ya forman parte de la oferta de empresas de ProgramBI:",
      ],
      bullets: [
        "Sesiones en vivo con mentor, no un curso masivo de videos.",
        "Ejercicios sobre las planillas, sistemas y KPIs que el equipo ya usa.",
        "Factura a la empresa y orden de compra si hace falta.",
        "Reporte de asistencia para el área de capacitación.",
        "Grabaciones y material para que el equipo repase.",
        "El equipo sale armando reportes y consultas por su cuenta.",
      ],
    },
    {
      id: "casos",
      eyebrow: "Áreas",
      h2: "Casos de uso por área",
      paragraphs: [
        "No son casos de clientes ni cifras de resultados: son los tipos de reporte que se pueden trabajar en clase con los datos de cada área. La propuesta define cuáles se incluyen.",
      ],
      cards: [
        {
          title: "Finanzas y control de gestión",
          text: "Presupuesto contra real, margen por línea, cuentas por cobrar y cierre mensual.",
        },
        {
          title: "Operaciones",
          text: "Reportes de turno, productividad por equipo, mantenimiento y consumo de insumos.",
        },
        {
          title: "Comercial",
          text: "Ventas por canal, cartera de clientes, metas y seguimiento de la fuerza de ventas.",
        },
        {
          title: "Personas y administración",
          text: "Dotación, ausentismo, indicadores de gestión y reportes recurrentes de oficina.",
        },
      ],
    },
    {
      id: "capacitacion-o-implementacion",
      eyebrow: "Dos caminos",
      h2: "Capacitación o implementación",
      paragraphs: [
        "Si el problema es que el equipo no sabe usar la herramienta, la respuesta es capacitación. Si el problema es que además falta el tablero en producción, eso se conversa como implementación Power BI: se construyen los dashboards con los datos del área y se acompaña la adopción.",
        "Los dos caminos se pueden combinar. La diferencia está en el entregable: en capacitación el entregable es la capacidad del equipo; en implementación, el tablero funcionando con tus datos.",
      ],
    },
    {
      id: "precio-detalle",
      eyebrow: "Valor",
      h2: "Cómo se cotiza",
      paragraphs: [
        "La capacitación in-company no tiene un precio de lista porque el alcance cambia con el tamaño del equipo, las horas, el nivel y los datos que se usan. El valor llega en la propuesta, junto con los temas y las fechas.",
        "La factura es a la empresa. Si el área de compras necesita orden de compra o un documento específico, se coordina al aceptar la propuesta. No hay cupos ni promociones inventadas en esta landing.",
      ],
    },
  ],
  pricing: {
    mode: "quote",
    intro:
      "La capacitación in-company se cotiza según el alcance. El formulario de abajo pide lo mínimo para armar una propuesta.",
    bullets: [
      "Área y tamaño del equipo.",
      "Temas y nivel que necesitan.",
      "Si se usan datos de la empresa o archivos de ejemplo.",
      "Factura, orden de compra y reporte de asistencia.",
    ],
  },
  faqs: [
    {
      q: "¿Es el mismo curso que el abierto?",
      a: "No. El curso abierto tiene fechas y un grupo mixto. La capacitación in-company es un grupo cerrado de la empresa, con los datos y los reportes del área, y un alcance acordado en la propuesta.",
    },
    {
      q: "¿Se puede facturar a la empresa?",
      a: "Sí. La propuesta incluye factura a la empresa y, si el área de compras lo pide, orden de compra. También se entrega reporte de asistencia.",
    },
    {
      q: "¿Las clases son online o presenciales?",
      a: "Online en vivo, con mentor y práctica sobre archivos. El horario se coordina con la empresa según la disponibilidad del equipo.",
    },
    {
      q: "¿Usan los datos reales de la empresa?",
      a: "Se puede trabajar con los datos que la empresa decida compartir. El alcance y las condiciones de uso se definen en la propuesta; si no se pueden sacar datos de los sistemas, se usan extractos o archivos de ejemplo.",
    },
    {
      q: "¿Cuánto dura el programa?",
      a: "Depende del alcance: no hay una duración única. En la propuesta se definen las horas, los temas y el calendario según el equipo y el objetivo.",
    },
    {
      q: "¿También hacen implementación de tableros?",
      a: "Sí. La implementación Power BI es un camino distinto: se construyen dashboards con los datos del área y se acompaña la adopción. Se puede combinar con la capacitación.",
    },
  ],
  guides: [
    {
      href: "/guias/curso-online-vs-presencial-power-bi",
      label: "Curso online vs presencial de Power BI",
      description:
        "Ventajas y límites de cada formato para decidir cómo capacitar a un equipo.",
    },
    {
      href: "/guias/power-bi-vs-excel",
      label: "Power BI vs Excel",
      description:
        "Cuándo el equipo puede quedarse en Excel y cuándo conviene dar el paso a BI.",
    },
    {
      href: "/guias/curso-analisis-de-datos-chile",
      label: "Curso de análisis de datos en Chile",
      description:
        "La ruta de SQL Server, Power BI y Python que se puede adaptar a un grupo cerrado.",
    },
  ],
  related: [
    { href: "/empresas", label: "Soluciones para empresas" },
    { href: "/implementacion-power-bi", label: "Implementación Power BI" },
    { href: "/power-bi-para-finanzas", label: "Power BI para finanzas" },
    { href: "/power-bi-sql-server-python", label: "Ruta Power BI, SQL Server y Python" },
    { href: "/precios", label: "Precios de cursos abiertos" },
    { href: "/faq", label: "Preguntas frecuentes" },
    { href: "/test-nivel", label: "Test de nivel" },
  ],
  closing: {
    title: "Cuéntanos del equipo y armamos la propuesta",
    text: "Área, tamaño del grupo y qué necesitan saber hacer. Con eso definimos temas, nivel y valor.",
    label: "Pedir una propuesta",
    href: "#contacto",
  },
  showLogos: true,
  contact: true,
};

export const LANDINGS: Record<LandingKey, NicheLanding> = {
  "power-bi-para-finanzas": FINANZAS,
  "power-bi-sql-server-python": STACK,
  "analisis-de-datos-mineria": MINERIA,
  "capacitacion-empresas": EMPRESAS,
};

export function getLanding(key: LandingKey): NicheLanding {
  return LANDINGS[key];
}

/** Metadata propia: título ≤60 con marca, canonical y tarjeta OG del sitio. */
export function landingMetadata(landing: NicheLanding): Metadata {
  const title = tituloSeo(landing.title);
  const share = pageOg({
    title,
    description: landing.description,
    path: landing.path,
    kicker: landing.kicker,
    tags: landing.tags,
  });

  return {
    title: { absolute: title },
    description: landing.description,
    alternates: {
      canonical: absoluteUrl(landing.path),
      // Mismo juego de hreflang que el resto del sitio. Las landings todavía
      // no tienen carpetas por país, así que todas las variantes apuntan a la
      // versión chilena (ver TODO_MANU en docs/fase5/WS3.md).
      languages: hreflangDe(landing.path),
    },
    openGraph: {
      title,
      description: landing.description,
      url: absoluteUrl(landing.path),
      type: "article",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

/**
 * JSON-LD coherente con el texto visible: Course cuando la landing vende un
 * curso, ItemList para las fichas del stack, Service para in-company, más FAQ
 * y breadcrumbs. Los precios vienen de `getCourseJsonLd`, no de esta data.
 */
export function buildLandingJsonLd(landing: NicheLanding) {
  const graph: Record<string, unknown>[] = [];

  if (landing.courseSlug) {
    const course = getCourseBySlug(landing.courseSlug);
    if (course) graph.push(getCourseJsonLd(course, "publico", ISO_CHILE));
  }

  if (landing.contact) {
    graph.push({
      "@type": "Service",
      name: landing.h1,
      description: landing.description,
      url: absoluteUrl(landing.path),
      provider: {
        "@type": "Organization",
        name: "ProgramBI SPA",
        url: SITE_URL,
        "@id": `${SITE_URL}/#organization`,
      },
      serviceType: "Capacitación in-company en datos, BI y automatización",
      areaServed: { "@type": "Country", name: "Chile" },
    });
  }

  if (landing.stack?.length) {
    graph.push({
      "@type": "ItemList",
      name: "Fichas de la ruta de datos",
      itemListElement: landing.stack.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.href),
      })),
    });
  }

  graph.push({
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  });

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: landing.parentCrumb.label,
        item: absoluteUrl(landing.parentCrumb.href),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: landing.h1,
        item: absoluteUrl(landing.path),
      },
    ],
  });

  return { "@context": "https://schema.org", "@graph": graph };
}
