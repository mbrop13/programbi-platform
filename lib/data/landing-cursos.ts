/**
 * Copy de las landings /curso-sql-online y /curso-python.
 *
 * Todo lo que se afirma aquí sale del catálogo (`lib/data/courses.ts` y
 * `lib/data/syllabuses/*`), de `lib/paises/*` o de la configuración del sitio.
 * No hay precios, fechas, horarios ni casos de clientes inventados.
 *
 * Los casos de uso y las FAQ por país se derivan de `lib/data/contenido-paises`:
 * se reutilizan los sectores y las fuentes de datos que ya describe cada
 * mercado, y se redactan para el temario de SQL o de Python. Chile usa el copy
 * base; los países sin contenido propio reciben el mismo copy localizado.
 */

import { normalizarPais } from "@/config/paises";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { localizarMercado } from "@/lib/paises/precios";

export type UsoLanding = {
  /** Sector local al que pertenece el caso, cuando viene de contenido-paises. */
  sector?: string;
  title: string;
  body: string;
  /** Sistemas o datos de partida descritos por el contenido del país. */
  fuente?: string;
};

export type LandingCursoCopy = {
  path: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  h1: string;
  lead: string;
  audience: string;
  intro: string;
  usos: UsoLanding[];
  faqs: { q: string; a: string }[];
};

export const LANDING_CURSOS = {
  "curso-sql-online": {
    path: "/curso-sql-online",
    slug: "sql-server",
    seoTitle: "Curso SQL online en vivo en Chile | ProgramBI",
    seoDescription:
      "Curso SQL online en vivo en Chile: SELECT, JOINs, GROUP BY, vistas y procedimientos almacenados. 20 horas por nivel, con grabaciones.",
    kicker: "Curso SQL online · Chile",
    h1: "Curso SQL online en vivo en Chile",
    lead:
      "Aprende a consultar bases SQL Server con tus propias consultas: SELECT, WHERE, JOINs, GROUP BY, vistas y procedimientos almacenados. Clases en vivo por Zoom, 20 horas por nivel.",
    audience:
      "Para analistas que salen de Excel y necesitan extraer datos de bases SQL Server con consultas propias, sin depender de TI para cada reporte.",
    intro:
      "El curso abierto (Básico-Intermedio) cubre SELECT, WHERE, filtros, INNER/LEFT JOIN, GROUP BY, ORDER BY, cruces de varias tablas y una introducción a IA aplicada a SQL. El nivel avanzado suma vistas complejas, tablas de reportes, procedimientos almacenados y un trabajo final aplicado. Se trabaja sobre SQL Server y T-SQL.",
    usos: [
      {
        title: "Reportes de ventas y stock",
        body:
          "Cruza ventas, productos y clientes con INNER/LEFT JOIN, GROUP BY y columnas calculadas para responder preguntas de negocio.",
      },
      {
        title: "Conciliaciones y control de gestión",
        body:
          "Usa filtros por fecha, ORDER BY, SUM y cruces de varias tablas para comparar períodos y detectar diferencias.",
      },
      {
        title: "Reportes reutilizables",
        body:
          "Crea vistas, tablas de reportes y procedimientos almacenados para dejar consultas reutilizables.",
      },
    ],
    faqs: [
      {
        q: "¿Necesito saber programar para tomar el curso SQL?",
        a: "No. El curso abierto (Básico-Intermedio) parte desde SELECT, WHERE y filtros, y sigue con JOINs, GROUP BY y cruces de tablas; el nivel avanzado cubre vistas complejas y procedimientos almacenados.",
      },
      {
        q: "¿Qué herramientas se usan?",
        a: "SQL Server y T-SQL. El temario incluye SELECT, WHERE, JOINs, GROUP BY, ORDER BY, vistas, tablas de reportes, procedimientos almacenados y un trabajo final aplicado.",
      },
      {
        q: "¿Entregan certificado?",
        a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI y acceso a las grabaciones en el campus virtual.",
      },
      {
        q: "¿El curso es para empresas?",
        a: "El curso abierto es cupo individual. Para cotizar los niveles de un equipo, usa la vista de empresas de la ficha del curso.",
      },
    ],
  },
  "curso-python": {
    path: "/curso-python",
    slug: "python",
    seoTitle: "Curso Python para datos online en Chile | ProgramBI",
    seoDescription:
      "Curso Python para datos online en vivo en Chile: fundamentos, Pandas, Matplotlib, Seaborn y Plotly. 20 horas por nivel, con grabaciones.",
    kicker: "Curso Python para datos · Chile",
    h1: "Curso Python para datos online en vivo en Chile",
    lead:
      "Aprende Python aplicado al análisis de datos: fundamentos, Pandas, visualización con Matplotlib y Seaborn, y automatización de reportes. Clases en vivo por Zoom, 20 horas por nivel.",
    audience:
      "Para profesionales que quieren analizar datos con Python y Pandas, sin un programa de ciencia de datos de meses.",
    intro:
      "El curso abierto (Básico-Intermedio) parte desde variables, tipos de datos, listas, tuplas, conjuntos y diccionarios, y sigue con Pandas, groupby, filtros, Matplotlib y Seaborn. El nivel avanzado cubre Plotnine, merge, Plotly y un proyecto aplicado. Está enfocado en análisis de datos, no en desarrollo de software genérico.",
    usos: [
      {
        title: "Limpieza y consolidación",
        body:
          "Carga archivos Excel con Pandas, filtra filas, transforma tipos y combina DataFrames para dejar una base de análisis consistente.",
      },
      {
        title: "Análisis y visualización",
        body:
          "Resume datos con groupby y agg, y crea gráficos con Matplotlib, Seaborn y Plotly.",
      },
      {
        title: "Automatización de reportes",
        body:
          "Usa Python e IA para generar extractores de datos y reportes repetibles desde servidores, web o APIs.",
      },
    ],
    faqs: [
      {
        q: "¿Necesito saber programar para tomar el curso Python?",
        a: "No. El curso abierto (Básico-Intermedio) parte desde variables, tipos de datos y estructuras básicas, y sigue con Pandas, groupby y visualización; el nivel avanzado cubre Plotnine, Plotly y un proyecto aplicado.",
      },
      {
        q: "¿Qué herramientas se usan?",
        a: "Python, Pandas, Matplotlib, Seaborn y Plotly. El temario incluye carga desde Excel, filtros, groupby, merge, visualización y un proyecto aplicado.",
      },
      {
        q: "¿Entregan certificado?",
        a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI y acceso a las grabaciones en el campus virtual.",
      },
      {
        q: "¿El curso es para empresas?",
        a: "El curso abierto es cupo individual. Para cotizar los niveles de un equipo, usa la vista de empresas de la ficha del curso.",
      },
    ],
  },
} satisfies Record<string, LandingCursoCopy>;

export type LandingCursoPath = keyof typeof LANDING_CURSOS;

export type LandingCursoSeo = {
  h1: string;
  seoTitle: string;
  seoDescription: string;
  kicker: string;
};

/**
 * Título, H1 y descripción propios de los mercados donde la landing compite.
 * Se escriben completos (no por reemplazo de «Chile») para controlar el largo
 * del <title> y para que cada país tenga una propuesta distinta. El resto de
 * los países cae al copy base localizado con `localizarMercado`.
 */
const SEO_PAIS: Record<string, Record<string, LandingCursoSeo>> = {
  "curso-sql-online": {
    ar: {
      h1: "Curso SQL online en vivo en Argentina",
      seoTitle: "Curso SQL online en vivo en Argentina | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para Argentina: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server, con ejemplos de agro, fintech y retail.",
      kicker: "Curso SQL online · Argentina",
    },
    mx: {
      h1: "Curso SQL online en vivo en México",
      seoTitle: "Curso SQL online en vivo en México | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para México: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server, con ejemplos de manufactura, retail y logística.",
      kicker: "Curso SQL online · México",
    },
    pe: {
      h1: "Curso SQL online en vivo en Perú",
      seoTitle: "Curso SQL online en vivo en Perú | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para Perú: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server, con ejemplos de minería, agroexportación y retail.",
      kicker: "Curso SQL online · Perú",
    },
    co: {
      h1: "Curso SQL online en vivo en Colombia",
      seoTitle: "Curso SQL online en vivo en Colombia | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para Colombia: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server, con ejemplos de retail, energía y fintech.",
      kicker: "Curso SQL online · Colombia",
    },
    uy: {
      h1: "Curso SQL online en vivo en Uruguay",
      seoTitle: "Curso SQL online en vivo en Uruguay | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para Uruguay: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server, con ejemplos de agro, frigoríficos y turismo.",
      kicker: "Curso SQL online · Uruguay",
    },
    py: {
      h1: "Curso SQL online en vivo en Paraguay",
      seoTitle: "Curso SQL online en vivo en Paraguay | ProgramBI",
      seoDescription:
        "Curso SQL online en vivo para Paraguay: JOINs, GROUP BY, vistas y procedimientos sobre SQL Server. Fechas y valor se consultan por WhatsApp.",
      kicker: "Curso SQL online · Paraguay",
    },
  },
  "curso-python": {
    ar: {
      h1: "Curso Python para datos online en vivo en Argentina",
      seoTitle: "Curso Python para datos online en Argentina | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en Argentina: fundamentos, Pandas, groupby, merge y visualización con Matplotlib, Seaborn y Plotly.",
      kicker: "Curso Python para datos · Argentina",
    },
    mx: {
      h1: "Curso Python para datos online en vivo en México",
      seoTitle: "Curso Python para datos online en México | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en México: fundamentos, Pandas, groupby, merge y gráficos con Matplotlib, Seaborn y Plotly.",
      kicker: "Curso Python para datos · México",
    },
    pe: {
      h1: "Curso Python para datos online en vivo en Perú",
      seoTitle: "Curso Python para datos online en Perú | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en Perú: fundamentos, Pandas, groupby, merge y visualización con Matplotlib, Seaborn y Plotly.",
      kicker: "Curso Python para datos · Perú",
    },
    co: {
      h1: "Curso Python para datos online en vivo en Colombia",
      seoTitle: "Curso Python para datos online en Colombia | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en Colombia: fundamentos, Pandas, groupby, merge y visualización con Matplotlib, Seaborn y Plotly.",
      kicker: "Curso Python para datos · Colombia",
    },
    uy: {
      h1: "Curso Python para datos online en vivo en Uruguay",
      seoTitle: "Curso Python para datos online en Uruguay | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en Uruguay: fundamentos, Pandas, groupby, merge y visualización con Matplotlib, Seaborn y Plotly.",
      kicker: "Curso Python para datos · Uruguay",
    },
    py: {
      h1: "Curso Python para datos online en vivo en Paraguay",
      seoTitle: "Curso Python para datos online en Paraguay | ProgramBI",
      seoDescription:
        "Curso Python para datos en vivo en Paraguay: fundamentos, Pandas, groupby, merge y visualización. Fechas y valor por WhatsApp.",
      kicker: "Curso Python para datos · Paraguay",
    },
  },
};

type UsoBase = { sector: string; title: string; body: string };

/**
 * Tres casos por país y por curso. El sector sale de `contenido-paises`; el
 * título y el cuerpo se redactan para las herramientas del temario (SQL Server
 * o Pandas) y la fuente se toma del mismo caso local, sin inventar sistemas.
 */
const USOS_PAIS: Record<string, Record<string, UsoBase[]>> = {
  ar: {
    "curso-sql-online": [
      {
        sector: "Agro y exportación",
        title: "Margen por lote y por campaña",
        body:
          "Cruza rindes, insumos, fletes y precios FOB con JOINs y GROUP BY para comparar el margen de cada lote antes de cerrar la campaña.",
      },
      {
        sector: "Fintech y servicios financieros",
        title: "Cartera y mora por producto",
        body:
          "Une registros de pasarelas, comprobantes y cobranza para ver con GROUP BY dónde se concentra la mora por producto y por canal.",
      },
      {
        sector: "Retail y e-commerce",
        title: "Ventas por canal con la misma regla",
        body:
          "Combina tienda física, e-commerce y marketplaces con JOINs y filtros por fecha para comparar sell-out y devoluciones sin duplicar operaciones.",
      },
    ],
    "curso-python": [
      {
        sector: "Agro y exportación",
        title: "Consolidar campañas con Pandas",
        body:
          "Carga planillas de campo y precios FOB en DataFrames, limpia tipos y usa merge y groupby para calcular el margen por lote.",
      },
      {
        sector: "Fintech y servicios financieros",
        title: "Cartera y mora en un solo DataFrame",
        body:
          "Une registros de pasarelas y cobranza con merge, resume la cartera por producto con groupby y grafica la evolución con Matplotlib.",
      },
      {
        sector: "Retail y e-commerce",
        title: "Comparar canales y devoluciones",
        body:
          "Consolida archivos de tienda, e-commerce y marketplaces, filtra por fecha y compara sell-out y devoluciones por categoría con Pandas y Seaborn.",
      },
    ],
  },
  mx: {
    "curso-sql-online": [
      {
        sector: "Manufactura y nearshoring",
        title: "OEE y costo por turno",
        body:
          "Cruza registros de producción, ERP y CFDI con JOINs y GROUP BY para comparar disponibilidad, rendimiento y costo por línea y turno.",
      },
      {
        sector: "Retail y consumo",
        title: "Sell-out por tienda y categoría",
        body:
          "Une punto de venta, inventarios y facturación para calcular venta, margen y rotación por tienda y categoría en una sola consulta.",
      },
      {
        sector: "Logística y comercio exterior",
        title: "Nivel de servicio por ruta",
        body:
          "Combina entregas, tiempos y pedimentos con filtros por fecha y GROUP BY para ver dónde se rompe el nivel de servicio en cada ruta.",
      },
    ],
    "curso-python": [
      {
        sector: "Manufactura y nearshoring",
        title: "Indicadores de planta con Pandas",
        body:
          "Carga los registros de producción y el ERP, limpia turnos y líneas, y resume disponibilidad y rendimiento por turno con groupby.",
      },
      {
        sector: "Retail y consumo",
        title: "Sell-out y margen por categoría",
        body:
          "Une punto de venta e inventarios con merge, calcula margen por categoría y compara tiendas con un gráfico de Seaborn.",
      },
      {
        sector: "Logística y comercio exterior",
        title: "Tiempos de entrega por ruta",
        body:
          "Consolida entregas y rastreo, calcula el tiempo por tramo y visualiza los desvíos por ruta con Plotly.",
      },
    ],
  },
  pe: {
    "curso-sql-online": [
      {
        sector: "Minería",
        title: "Producción y costo por unidad",
        body:
          "Cruza reportes de mina y planta con facturación para comparar producción, leyes y costo por tajo o unidad en una consulta.",
      },
      {
        sector: "Agroexportación",
        title: "Rendimiento por fundo y destino",
        body:
          "Une cuadernos de campo, ERP agroindustrial y guías de remisión para calcular rendimiento por lote y margen por destino.",
      },
      {
        sector: "Retail y consumo masivo",
        title: "Venta por tienda y margen",
        body:
          "Combina punto de venta, almacenes y comprobantes electrónicos para comparar venta, inventario y margen por tienda y categoría.",
      },
    ],
    "curso-python": [
      {
        sector: "Minería",
        title: "Consolidar mina y planta",
        body:
          "Carga reportes de mina y planta en DataFrames, limpia unidades y turnos, y resume producción y costo por tajo con groupby.",
      },
      {
        sector: "Agroexportación",
        title: "Campañas y destinos de exportación",
        body:
          "Une cuadernos de campo y guías de remisión con merge para comparar rendimiento por fundo y margen por destino.",
      },
      {
        sector: "Retail y consumo masivo",
        title: "Inventario y venta por tienda",
        body:
          "Combina punto de venta y almacenes, filtra por campaña y grafica venta y margen por categoría con Matplotlib.",
      },
    ],
  },
  co: {
    "curso-sql-online": [
      {
        sector: "Retail y consumo",
        title: "Venta por canal, tienda y margen",
        body:
          "Une POS, facturación electrónica e inventarios con JOINs y GROUP BY para comparar rotación y margen por tienda y canal.",
      },
      {
        sector: "Fintech y banca",
        title: "Cartera y recaudo por canal",
        body:
          "Cruza cartera, pasarelas y recaudo para ver por producto y canal dónde se pierde el pago.",
      },
      {
        sector: "Energía y servicios públicos",
        title: "Consumo y cartera por zona",
        body:
          "Consolida sistemas comerciales, medidores y facturación para comparar consumo, facturación y cartera por zona.",
      },
    ],
    "curso-python": [
      {
        sector: "Retail y consumo",
        title: "Rotación y margen por tienda",
        body:
          "Carga POS e inventarios, limpia categorías y usa groupby para comparar rotación y margen entre tiendas y canales.",
      },
      {
        sector: "Fintech y banca",
        title: "Cartera y recaudo en Pandas",
        body:
          "Une cartera y recaudo con merge, calcula la proporción pagada por producto y grafica la evolución con Plotly.",
      },
      {
        sector: "Energía y servicios públicos",
        title: "Consumo y facturación por zona",
        body:
          "Consolida medidores y facturación en un DataFrame, resume consumo por zona y detecta desvíos con Pandas.",
      },
    ],
  },
  uy: {
    "curso-sql-online": [
      {
        sector: "Agro y ganadería",
        title: "Costo por hectárea y margen por potrero",
        body:
          "Cruza planillas de campo, DICOSE y facturación para calcular costo por hectárea y margen por potrero con GROUP BY.",
      },
      {
        sector: "Frigoríficos y exportación",
        title: "Rendimiento por faena y destino",
        body:
          "Une el ERP frigorífico, certificados y facturación de exportación para comparar rendimiento por faena y margen por destino.",
      },
      {
        sector: "Turismo y logística",
        title: "Ocupación y tarifas por temporada",
        body:
          "Combina reservas, PMS y facturación para ver ocupación, tarifa promedio y costo por ruta en cada temporada.",
      },
    ],
    "curso-python": [
      {
        sector: "Agro y ganadería",
        title: "Margen por potrero en Pandas",
        body:
          "Carga planillas de campo y facturación, limpia categorías y usa groupby para comparar costo por hectárea y margen por potrero.",
      },
      {
        sector: "Frigoríficos y exportación",
        title: "Rendimiento y destino de exportación",
        body:
          "Une ERP, certificados y facturación con merge para calcular rendimiento por faena y margen por destino.",
      },
      {
        sector: "Turismo y logística",
        title: "Ocupación y tarifas de temporada",
        body:
          "Consolida reservas y PMS, resume ocupación y tarifa por temporada y grafica la evolución con Seaborn.",
      },
    ],
  },
};

type FaqBase = { q: string; a: string };

/** Dos preguntas propias de cada mercado y curso; el resto se arma con datos vivos. */
const FAQ_PAIS: Record<string, Record<string, FaqBase[]>> = {
  ar: {
    "curso-sql-online": [
      {
        q: "¿El curso SQL sirve si trabajo en agro o en una fintech argentina?",
        a: "Sí. Los ejercicios usan datos de agro y exportación, fintech y retail: rindes, costos y precios FOB, cartera y mora, y ventas por canal. No son casos de clientes: son escenarios para practicar consultas.",
      },
      {
        q: "¿Puedo llevar consultas de mi ERP o de ARCA a SQL Server?",
        a: "Sí, si tienes acceso de lectura a la base o a una copia de los datos. En clase se practica con tablas de ejemplo y la misma lógica de SELECT, JOIN y GROUP BY se aplica a comprobantes de ARCA o al ERP de tu empresa.",
      },
    ],
    "curso-python": [
      {
        q: "¿Python sirve para consolidar planillas de campo y ventas de Argentina?",
        a: "Sí. Los ejercicios cargan planillas de campo y archivos de ventas en Pandas, limpian tipos y cruzan tablas con merge para calcular margen por lote o por canal.",
      },
      {
        q: "¿Puedo automatizar reportes de fintech o retail con lo que enseña el curso?",
        a: "Sí. El temario incluye carga de archivos, groupby, merge y visualización; con eso puedes dejar un script que repita el reporte cada mes en lugar de armarlo a mano.",
      },
    ],
  },
  mx: {
    "curso-sql-online": [
      {
        q: "¿El curso SQL aplica a manufactura, retail y logística de México?",
        a: "Sí. Los ejercicios usan registros de producción, punto de venta, inventarios y entregas: JOINs para cruzar tablas y GROUP BY para comparar turnos, tiendas o rutas.",
      },
      {
        q: "¿Puedo cruzar CFDI, ERP y punto de venta en SQL Server?",
        a: "Sí, siempre que puedas acceder a una copia de esos datos. En clase se practica con tablas de ejemplo; la lógica de filtros, JOIN y agregaciones es la misma que necesitas para CFDI, ERP o el punto de venta.",
      },
    ],
    "curso-python": [
      {
        q: "¿Python sirve para analizar datos de producción?",
        a: "Sí. Los ejercicios cargan registros de producción y ERP en Pandas, limpian turnos y líneas, y resumen disponibilidad y rendimiento por turno con groupby.",
      },
      {
        q: "¿Puedo comparar tiendas y rutas con Python?",
        a: "Sí. El curso trabaja merge para unir archivos, groupby para resumir por tienda o ruta y Matplotlib, Seaborn o Plotly para visualizar las diferencias.",
      },
    ],
  },
  pe: {
    "curso-sql-online": [
      {
        q: "¿El curso SQL incluye ejemplos de minería y agroexportación?",
        a: "Sí. Los casos de Perú usan producción de mina y planta, campañas agrícolas, retail y cartera financiera. Son escenarios de práctica, no casos de clientes.",
      },
      {
        q: "¿Puedo consultar datos de SUNAT o del ERP desde SQL Server?",
        a: "Sí, si cuentas con acceso de lectura a la base o a una copia. En clase se usan tablas de ejemplo y se practica la misma lógica de SELECT, JOIN y GROUP BY que aplicarías a comprobantes electrónicos o al ERP.",
      },
    ],
    "curso-python": [
      {
        q: "¿Python sirve para datos de mina y de campo?",
        a: "Sí. Los ejercicios cargan reportes de mina y planta, y planillas de campo, en DataFrames; luego limpian unidades y turnos y resumen producción o rendimiento con groupby.",
      },
      {
        q: "¿Puedo automatizar reportes de retail o banca con Python?",
        a: "Sí. El temario cubre carga de archivos, filtros, merge, groupby y visualización, que es la base para repetir un reporte de ventas o de cartera sin rehacerlo a mano.",
      },
    ],
  },
  co: {
    "curso-sql-online": [
      {
        q: "¿El curso SQL sirve para retail con varias sedes en Colombia?",
        a: "Sí. Los ejercicios unen POS, facturación electrónica e inventarios para comparar venta, rotación y margen por tienda y canal con la misma definición.",
      },
      {
        q: "¿Puedo analizar cartera y recaudo desde SQL?",
        a: "Sí. Se practica con tablas de cartera, pasarelas y recaudo; con JOIN y GROUP BY puedes ver por producto y canal dónde se pierde el pago.",
      },
    ],
    "curso-python": [
      {
        q: "¿Python ayuda a comparar sedes y canales?",
        a: "Sí. Los ejercicios consolidan archivos de distintas sedes con merge, limpian categorías y comparan rotación y margen con groupby y gráficos.",
      },
      {
        q: "¿Puedo consolidar datos de energía y facturación?",
        a: "Sí. El curso enseña a cargar medidores y facturación en DataFrames, resumir consumo por zona y detectar desvíos con Pandas y visualizaciones.",
      },
    ],
  },
  uy: {
    "curso-sql-online": [
      {
        q: "¿El curso SQL aplica a agro y frigoríficos de Uruguay?",
        a: "Sí. Los casos de Uruguay trabajan costo por hectárea, margen por potrero, rendimiento por faena y margen por destino con JOINs y GROUP BY.",
      },
      {
        q: "¿Puedo analizar ocupación turística desde SQL?",
        a: "Sí. Los ejercicios combinan reservas, PMS y facturación para comparar ocupación, tarifa promedio y costo por ruta en cada temporada.",
      },
    ],
    "curso-python": [
      {
        q: "¿Python sirve para planillas de campo y faena?",
        a: "Sí. Los ejercicios cargan planillas de campo y datos del frigorífico en Pandas, limpian categorías y resumen costo o rendimiento con groupby.",
      },
      {
        q: "¿Puedo automatizar reportes de turismo y logística?",
        a: "Sí. El temario incluye carga de archivos, merge, groupby y visualización, que alcanza para repetir un reporte de ocupación o de costo por ruta.",
      },
    ],
  },
};

/** SEO y H1 del país, con fallback al copy base localizado. */
export function seoLandingCurso(
  copy: LandingCursoCopy,
  pais: string | null | undefined
): LandingCursoSeo {
  const iso = normalizarPais(pais);
  const propio = SEO_PAIS[copy.path]?.[iso];
  if (propio) return propio;
  return {
    h1: localizarMercado(copy.h1, iso),
    seoTitle: localizarMercado(copy.seoTitle, iso),
    seoDescription: localizarMercado(copy.seoDescription, iso),
    kicker: localizarMercado(copy.kicker, iso),
  };
}

/**
 * Casos de uso locales. Usa los sectores y las fuentes de `contenido-paises`;
 * si el país no tiene contenido propio, devuelve los casos base del curso.
 */
export function usosLandingCurso(
  copy: LandingCursoCopy,
  pais: string | null | undefined
): UsoLanding[] {
  const iso = normalizarPais(pais);
  const contenido = getContenidoPais(iso);
  const defs = USOS_PAIS[iso]?.[copy.path];
  if (!contenido || !defs) return copy.usos;

  return defs.map((def) => {
    const caso = contenido.casos.find((item) => item.sector === def.sector);
    return {
      sector: def.sector,
      title: def.title,
      body: def.body,
      ...(caso ? { fuente: caso.fuente } : {}),
    };
  });
}

/** FAQ propias del mercado y curso. Vacío si no hay contenido de país. */
export function faqsLandingCurso(
  copy: LandingCursoCopy,
  pais: string | null | undefined
): FaqBase[] {
  const iso = normalizarPais(pais);
  return FAQ_PAIS[iso]?.[copy.path] ?? [];
}
