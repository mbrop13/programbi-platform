import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "ve",
  seo: {
    title: "Cursos de datos en vivo en Venezuela | ProgramBI",
    description:
      "Cursos en vivo de Power BI, SQL, Excel e IA para profesionales de Venezuela. Clases por Zoom en hora de Caracas, grabadas y con precios en dólares.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Venezuela | ProgramBI",
      description:
        "Catálogo en vivo para Venezuela: Power BI, SQL, Excel, Python e IA aplicada. Hora de Caracas, precios en USD, clases grabadas y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Venezuela | ProgramBI",
      description:
        "Horario de Caracas, pago en dólares, equivalente en CLP, conexión y certificados de los cursos en vivo de ProgramBI para profesionales en Venezuela.",
    },
    implementacion: {
      title: "Implementación Power BI en Venezuela | ProgramBI",
      description:
        "Tableros Power BI para petróleo, distribución y servicios en Venezuela, con reportes en dólares y bolívares y capacitación del equipo a medida.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Venezuela | ProgramBI",
      description:
        "De planillas de despacho, inventario y ventas a tableros Power BI en Venezuela. Curso abierto o proyecto in-company con los datos de tu empresa.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Venezuela | ProgramBI",
      description:
        "Qué revisar antes de un proyecto Power BI en Venezuela: moneda de reporte, tipo de cambio y adopción del equipo. Cuándo conviene curso o consultora.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Venezuela",
      description:
        "Quiénes somos, cómo se siguen las clases en hora de Caracas con grabaciones de respaldo y qué encuentra un profesional venezolano en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Venezuela",
    parrafo:
      "Academia en vivo por Zoom, en hora de Caracas: Power BI, SQL, Excel e IA aplicada para petróleo, distribución, comercio y servicios.",
    nota: "Clases en vivo · Horario de Caracas · Precios en USD",
  },
  intro: {
    kicker: "Datos para el mercado venezolano",
    titulo: "Dos monedas, un solo número que defender",
    parrafos: [
      "En Venezuela muchas empresas facturan o reportan en dólares mientras sus obligaciones tributarias y parte de sus costos siguen en bolívares. El resultado es conocido: el mismo margen da distinto según quién arme la planilla y con qué tipo de cambio. Un buen analista no solo arma el tablero, deja explícito en qué moneda está cada cifra y con qué tasa se convirtió.",
      "El curso enseña a construir ese modelo con lo que la empresa ya tiene: comprobantes ante el SENIAT, el sistema de inventario y las planillas de despacho. Las clases se siguen en hora de Caracas, quedan grabadas para cuando la conexión falla y el proyecto final se arma sobre un proceso real del alumno.",
    ],
  },
  casos: [
    {
      sector: "Petróleo y servicios petroleros",
      titulo: "Producción, despacho y costo por contrato",
      descripcion:
        "Seguir producción, despacho y costo operativo por contrato o pozo para explicar desvíos con una sola fuente de verdad.",
      fuente: "Reportes de operación, sistema de mantenimiento y ERP.",
    },
    {
      sector: "Comercio y distribución",
      titulo: "Margen por línea en dólares y bolívares",
      descripcion:
        "Comparar venta, rotación y margen por línea y por zona, mostrando cada cifra en dólares y en bolívares con la tasa usada en cada fecha.",
      fuente: "Sistema de facturación, inventario y tabla de tipos de cambio.",
    },
    {
      sector: "Consumo masivo",
      titulo: "Quiebres de stock y cobertura por cliente",
      descripcion:
        "Detectar quiebres, días de cobertura y cumplimiento de pedidos por cliente o ruta de distribución.",
      fuente: "Pedidos, despachos y planillas de la fuerza de venta.",
    },
    {
      sector: "Servicios",
      titulo: "Costo por atención y rentabilidad por contrato",
      descripcion:
        "Medir horas, costo por atención y rentabilidad por contrato de servicio para decidir precios y priorizar clientes.",
      fuente: "Registro de horas, órdenes de trabajo y facturación.",
    },
  ],
  referencias: [
    {
      nombre: "SENIAT",
      detalle: "Obligaciones tributarias y facturación que ordenan el registro de ventas y compras.",
    },
    {
      nombre: "BCV",
      detalle: "Tipo de cambio oficial publicado: la tasa de referencia que conviene guardar por fecha en el modelo.",
    },
    {
      nombre: "INE Venezuela",
      detalle: "Estadísticas oficiales de población, empleo y actividad para contextualizar el mercado.",
    },
    {
      nombre: "SUDEBAN",
      detalle: "Información del sector bancario, útil para equipos de banca, cobranza y tesorería.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta internacional",
    resumen:
      "El catálogo para Venezuela se publica en dólares (USD): la ficha de cada curso muestra el precio vigente y el total aparece antes de pagar.",
    nota: "Puedes pagar con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El cobro se procesa desde la cuenta de Chile: el checkout informa el equivalente en CLP antes de confirmar y el cargo final en tu tarjeta lo define tu banco.",
  },
  mercado: {
    ejemplo:
      "En Venezuela el primer tablero suele resolver la doble moneda: venta y margen en dólares y en bolívares, con la tasa del BCV registrada por fecha, para que comercial y finanzas discutan decisiones y no conversiones.",
    horario:
      "Venezuela se mantiene en UTC-4 todo el año. La clase de 19:30 en Chile se ve a las 18:30 en Caracas cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se pagan en dólares con tarjeta internacional o transferencia; el checkout informa el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales venezolanos de petróleo, distribución y servicios que necesitan reportes claros en dos monedas. Las clases se siguen en hora de Caracas y quedan grabadas para repasarlas si la conexión o la electricidad fallan.",
  },
  faqs: [
    {
      q: "¿El curso enseña a trabajar con dólares y bolívares a la vez?",
      a: "Sí. En Power BI y Excel trabajamos una tabla de tipos de cambio por fecha y medidas que muestran la misma cifra en ambas monedas, sin rehacer la planilla. Los datos de los ejercicios son de práctica, no de clientes.",
      categoria: "cursos",
    },
    {
      q: "¿A qué hora son las clases en Venezuela?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. Venezuela está en UTC-4 todo el año, así que en Caracas empiezan a las 18:30 cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada curso indica la hora exacta.",
      categoria: "cursos",
    },
    {
      q: "¿Qué pasa si se va la luz o el internet durante una clase?",
      a: "Cada clase queda grabada en el campus. Puedes verla después, seguir la práctica con los mismos archivos y hacer tus consultas en la clase siguiente o en el canal del curso.",
      categoria: "general",
    },
    {
      q: "¿Cómo pago desde Venezuela?",
      a: "Con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El precio se publica en USD y el cobro se procesa desde la cuenta de Chile: el checkout muestra el equivalente en CLP antes de confirmar y tu banco define el cargo final.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("ve")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Sirve si vivo fuera de Venezuela?",
      a: "Sí. El curso es en vivo por Zoom y el horario publicado se ajusta a tu zona. Si trabajas desde otro país, revisa la versión de tu país para ver la hora y el precio que corresponden.",
      categoria: "general",
    },
  ],
};

export default contenido;
