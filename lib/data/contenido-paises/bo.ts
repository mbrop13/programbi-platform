import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "bo",
  seo: {
    title: "Cursos de datos en vivo en Bolivia | ProgramBI",
    description:
      "Cursos en vivo de Power BI, SQL y análisis de datos para profesionales de Bolivia. Clases por Zoom en hora de La Paz, grabadas y con precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Bolivia | ProgramBI",
      description:
        "Catálogo en vivo para Bolivia: Power BI, SQL, Excel, Python e IA aplicada. Hora de La Paz, precios en dólares, grabaciones y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Bolivia | ProgramBI",
      description:
        "Horario en La Paz y Santa Cruz, pago en dólares, equivalente en CLP, certificados y requisitos de los cursos en vivo de ProgramBI en Bolivia.",
    },
    implementacion: {
      title: "Implementación Power BI en Bolivia | ProgramBI",
      description:
        "Tableros Power BI para minería, hidrocarburos, agro cruceño y comercio en Bolivia, con capacitación del equipo. Diagnóstico y propuesta a medida.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Bolivia | ProgramBI",
      description:
        "De planillas de producción, campaña agrícola y ventas a tableros Power BI en Bolivia. Curso abierto o proyecto in-company con datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Bolivia | ProgramBI",
      description:
        "Qué revisar antes de un proyecto Power BI en Bolivia: datos del SIAT, definiciones comunes y adopción del equipo. Cuándo conviene curso o consultora.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Bolivia",
      description:
        "Quiénes somos, cómo se siguen las clases en vivo desde La Paz, Santa Cruz o Cochabamba y qué encuentra un profesional boliviano en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Bolivia",
    parrafo:
      "Academia en vivo por Zoom, en hora de La Paz: Power BI, SQL, Excel e IA aplicada para equipos de minería, hidrocarburos, agro y comercio.",
    nota: "Clases en vivo · Horario de La Paz · Precios en USD",
  },
  intro: {
    kicker: "Datos para la operación boliviana",
    titulo: "Producción, campaña y margen: del parte diario al tablero",
    parrafos: [
      "En Bolivia buena parte de la gestión se mide en operación física: toneladas procesadas en minería, volumen y despacho en hidrocarburos, hectáreas sembradas y rendimiento por campaña en el agro de Santa Cruz. El dato existe, pero suele quedar repartido entre el parte diario, el sistema contable y la planilla que cada área mantiene por su cuenta.",
      "El curso enseña a juntar esas piezas en un modelo que se actualiza solo: la facturación registrada en el SIAT del SIN, los registros de producción y las bases comerciales. Las clases se siguen desde La Paz, Santa Cruz o Cochabamba, quedan grabadas y el proyecto final se arma sobre un proceso que el alumno conoce de su trabajo.",
    ],
  },
  casos: [
    {
      sector: "Minería",
      titulo: "Producción por turno y costo por tonelada",
      descripcion:
        "Comparar toneladas procesadas, ley del mineral y costo por tonelada por turno y por frente de trabajo, con una definición única para operaciones y finanzas.",
      fuente: "Partes de producción, sistema de mantenimiento y contabilidad.",
    },
    {
      sector: "Hidrocarburos y energía",
      titulo: "Volumen despachado y costo operativo",
      descripcion:
        "Seguir volumen, despacho y costo operativo por planta o contrato para explicar en el comité qué cambió respecto del mes anterior.",
      fuente: "Registros de planta, sistema de despacho y ERP.",
    },
    {
      sector: "Agro cruceño",
      titulo: "Rendimiento por campaña y por lote",
      descripcion:
        "Cruzar hectáreas, rendimiento y costo de insumos por campaña de soya, invierno o verano, para planificar la siguiente siembra con números comparables.",
      fuente: "Planillas de campo, acopio y facturación en el SIAT.",
    },
    {
      sector: "Comercio y distribución",
      titulo: "Rotación de inventario y margen por línea",
      descripcion:
        "Medir rotación, quiebres y margen por línea de producto y sucursal en La Paz, El Alto, Santa Cruz y Cochabamba.",
      fuente: "Sistema de ventas, inventario y facturas emitidas.",
    },
  ],
  referencias: [
    {
      nombre: "SIN (SIAT)",
      detalle: "Facturación electrónica y en línea que registra ventas y compras: la fuente base del cierre mensual.",
    },
    {
      nombre: "INE Bolivia",
      detalle: "Estadísticas de producción, comercio exterior, precios y empleo para dar contexto a los indicadores.",
    },
    {
      nombre: "BCB",
      detalle: "Tipo de cambio, tasas y series monetarias que conviene tener a mano al reportar en bolivianos y en dólares.",
    },
    {
      nombre: "ASFI",
      detalle: "Información del sistema financiero, útil para equipos de banca, microfinanzas y cooperativas.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para Bolivia se publica en dólares (USD): la ficha de cada curso muestra el precio vigente y el total aparece antes de pagar.",
    nota: "Puedes pagar con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El cobro se procesa desde la cuenta de Chile: el checkout informa el equivalente en CLP antes de confirmar y el cargo final en tu tarjeta lo define tu banco.",
  },
  mercado: {
    ejemplo:
      "En Bolivia el dato vive en la facturación del SIAT, los partes de producción y las planillas de campaña. El primer tablero suele mostrar producción y costo por unidad de operación, con una sola definición para operaciones, comercial y finanzas.",
    horario:
      "Bolivia se mantiene en UTC-4 todo el año. La clase de 19:30 en Chile se ve a las 18:30 en La Paz cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se pagan en dólares con tarjeta o transferencia; el checkout informa el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales bolivianos de minería, hidrocarburos, agro y comercio que necesitan pasar del parte diario a un tablero confiable. Las clases se siguen en hora de La Paz y quedan grabadas para repasarlas después del turno.",
  },
  faqs: [
    {
      q: "¿Los ejercicios sirven para minería o agro?",
      a: "Sí. Los escenarios de Bolivia trabajan producción por turno, costo por tonelada, rendimiento por campaña y margen por línea de venta. Son ejercicios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿A qué hora son las clases en Bolivia?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. Bolivia está en UTC-4 todo el año, así que en La Paz, Santa Cruz y Cochabamba empiezan a las 18:30 cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada curso indica la hora exacta.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo usar los datos de facturación del SIAT?",
      a: "Sí, como fuente de práctica. Exportar ventas y compras del sistema de facturación y modelarlas en Power BI o SQL es uno de los ejercicios más útiles. Recomendamos anonimizar NIT y nombres de clientes antes de trabajar con datos reales.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo pago desde Bolivia?",
      a: "Con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El precio se publica en USD y el cobro se procesa desde la cuenta de Chile: el checkout muestra el equivalente en CLP antes de confirmar y tu banco define el cargo final en tu tarjeta.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("bo")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Qué pasa si se corta la conexión durante la clase?",
      a: "Todas las clases quedan grabadas en el campus. Si la conexión falla o un turno te impide conectarte, repites la sesión después y haces las consultas en la siguiente clase o en el canal del curso.",
      categoria: "general",
    },
  ],
};

export default contenido;
