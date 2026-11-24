import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "py",
  seo: {
    title: "Cursos de datos y Power BI en Paraguay | ProgramBI",
    description:
      "Cursos en vivo de Power BI, Excel y análisis de datos para Paraguay: agronegocio, ganadería y comercio. Clases en hora de Asunción y precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Paraguay | ProgramBI",
      description:
        "Catálogo en vivo para Paraguay: Power BI, SQL, Excel y Python con proyecto final y clases grabadas. Horario de Asunción y precios publicados en USD.",
    },
    faq: {
      title: "Preguntas frecuentes: cursos en Paraguay | ProgramBI",
      description:
        "Horario en Asunción, pagos en dólares y equivalente en CLP, certificado y requisitos de los cursos en vivo de ProgramBI para profesionales de Paraguay.",
    },
    implementacion: {
      title: "Implementación de Power BI en Paraguay | ProgramBI",
      description:
        "Tableros Power BI para agronegocio, frigoríficos, comercio y logística en Paraguay, con capacitación del equipo que los usa. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Paraguay | ProgramBI",
      description:
        "De la planilla de zafra, acopio o sucursal a tableros Power BI que se actualizan con la factura electrónica. Curso abierto o in-company en Paraguay.",
    },
    porQueFallan: {
      title: "Por qué fallan los proyectos Power BI en Paraguay",
      description:
        "Qué revisar antes de un proyecto Power BI en Paraguay: fuentes, definiciones y adopción. Cuándo conviene curso abierto, consultora o Pack de adopción.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Paraguay",
      description:
        "Quiénes somos, cómo se siguen las clases en vivo desde Asunción, Ciudad del Este o el Chaco y qué encuentra un profesional paraguayo en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Paraguay",
    parrafo:
      "Clases en vivo por Zoom en hora de Asunción: Power BI, Excel y análisis de datos para agronegocio, ganadería, comercio y logística.",
    nota: "Clases en vivo · Horario de Asunción · Precios en USD",
  },
  intro: {
    kicker: "Datos para el agronegocio y el comercio paraguayo",
    titulo: "De la zafra al despacho: el dato que cruza varias áreas",
    parrafos: [
      "En Paraguay la soja, la ganadería y el comercio mueven gran parte de la economía, y en los tres casos el número atraviesa varias áreas: campo o acopio, planta, logística fluvial o terrestre y finanzas. Cada una suele tener su propia planilla, y el cierre se arma juntando archivos.",
      "El curso enseña a unir esas fuentes en un modelo que se actualiza solo: comprobantes de la factura electrónica (SIFEN), registros de acopio y planta, y la planilla de despacho. Con eso el tablero responde por zafra, lote, sucursal o barcaza, en guaraníes o en dólares según la reunión. Las clases se siguen en hora de Asunción y el proyecto final usa un proceso del trabajo del alumno.",
    ],
  },
  casos: [
    {
      sector: "Soja y agronegocio",
      titulo: "Acopio, humedad y margen por zafra",
      descripcion:
        "Cruzar toneladas recibidas, descuentos por humedad o impurezas y precio de venta para comparar margen por zafra, silo y productor.",
      fuente: "Sistema de acopio, balanzas, contratos de venta y comprobantes electrónicos.",
    },
    {
      sector: "Ganadería y frigoríficos",
      titulo: "Rendimiento por faena y precio por mercado",
      descripcion:
        "Comparar rendimiento en canal, costo por kilo y precio obtenido por mercado de destino para decidir compras y cupos.",
      fuente: "Sistema de faena, báscula y facturación de exportación.",
    },
    {
      sector: "Comercio y frontera",
      titulo: "Venta por sucursal, rotación y tipo de cambio",
      descripcion:
        "Ordenar venta y rotación por sucursal y categoría, con la conversión entre guaraníes y dólares resuelta en una sola tabla.",
      fuente: "Punto de venta, inventario y facturas electrónicas.",
    },
    {
      sector: "Logística fluvial y transporte",
      titulo: "Viajes, carga y costo por tonelada",
      descripcion:
        "Medir carga transportada, tiempos de viaje y costo por tonelada por ruta o convoy para planificar la capacidad de la temporada.",
      fuente: "Planillas de despacho, TMS y facturación de fletes.",
    },
  ],
  referencias: [
    {
      nombre: "DNIT",
      detalle:
        "Administración tributaria (ex SET) y factura electrónica SIFEN (e-Kuatia), base para ordenar ventas y compras.",
    },
    {
      nombre: "INE Paraguay",
      detalle: "Estadísticas de población, empleo y actividad para contextualizar el mercado.",
    },
    {
      nombre: "BCP",
      detalle: "Tipo de cambio del guaraní, precios e indicadores de actividad para leer costos y ventas.",
    },
    {
      nombre: "Energía (ANDE e Itaipú)",
      detalle: "Contexto de costo energético útil para industrias intensivas en consumo eléctrico.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para Paraguay se publica en dólares (USD), que evita convertir montos largos en guaraníes: cada ficha muestra el precio vigente del curso.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile y el checkout informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Paraguay el dato vive en los comprobantes de SIFEN, en el sistema de acopio o de planta y en la planilla de despacho. El primer tablero suele mostrar margen por zafra o por sucursal, con la conversión entre guaraníes y dólares definida una sola vez.",
    horario:
      "Paraguay se mantiene en UTC-3 todo el año desde octubre de 2024. Cuando Chile está en horario de verano, la clase de 19:30 se ve a la misma hora en Asunción; el resto del año se ve a las 20:30. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se publican en dólares y se pagan con tarjeta o transferencia; el checkout muestra el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales paraguayos de agronegocio, ganadería, comercio y logística que necesitan unir campo, planta y finanzas en un mismo reporte. Las clases se siguen en vivo en hora de Asunción y quedan grabadas para quienes trabajan lejos de la capital.",
  },
  faqs: [
    {
      q: "¿Los ejercicios incluyen soja, acopio o frigoríficos?",
      a: "Sí. Hay escenarios de acopio y margen por zafra, de rendimiento por faena y de logística por tonelada. Son ejercicios de práctica con datos de ejemplo, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿Cómo queda el horario en Asunción?",
      a: "Las clases empiezan a las 19:30 de Chile. Paraguay está en UTC-3 todo el año desde octubre de 2024: durante el verano chileno la clase es a las 19:30 en Asunción y el resto del año a las 20:30. La ficha de cada curso indica el horario exacto.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo usar comprobantes de la factura electrónica en el proyecto?",
      a: "Sí, si los exportas desde tu sistema. El curso muestra cómo llevar un archivo de comprobantes a Power BI, limpiarlo y cruzarlo con otras fuentes. Conviene anonimizar datos de clientes antes de compartir el proyecto.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo pago desde Paraguay?",
      a: "Con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile y el checkout muestra el equivalente en CLP antes de confirmar; el cargo final en guaraníes lo define tu banco.",
      categoria: "pagos",
    },
    {
      q: "¿Cuánto cuesta un curso?",
      a: `${resumenPreciosCatalogo("py")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Sirve si vivo en el interior o en el Chaco?",
      a: "Sí. Las clases son por Zoom y quedan grabadas, así que puedes verlas cuando tengas buena conexión. Solo necesitas una computadora para practicar.",
      categoria: "general",
    },
  ],
};

export default contenido;
