import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "cr",
  seo: {
    title: "Cursos de datos en vivo en Costa Rica | ProgramBI",
    description:
      "Cursos en vivo de Power BI, SQL, Excel e IA para profesionales de Costa Rica. Clases por Zoom en hora de San José, grabadas y con precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Costa Rica | ProgramBI",
      description:
        "Catálogo en vivo para Costa Rica: Power BI, SQL, Excel, Python e IA aplicada. Hora de San José, precios en dólares, grabaciones y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Costa Rica | ProgramBI",
      description:
        "Horario de San José, pago en dólares, equivalente en CLP, certificados y requisitos de los cursos en vivo de ProgramBI para profesionales en Costa Rica.",
    },
    implementacion: {
      title: "Implementación Power BI en Costa Rica | ProgramBI",
      description:
        "Tableros Power BI para dispositivos médicos, centros de servicios, turismo y agro en Costa Rica, con capacitación del equipo y propuesta a medida.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Costa Rica | ProgramBI",
      description:
        "De planillas de producción, reservas y servicios a tableros Power BI en Costa Rica. Curso abierto o proyecto in-company con los datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Costa Rica | ProgramBI",
      description:
        "Qué revisar antes de un proyecto Power BI en Costa Rica: fuentes, definiciones comunes y adopción del equipo. Cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Costa Rica",
      description:
        "Quiénes somos, cómo se siguen las clases en vivo en hora de San José y qué encuentra un profesional costarricense en el campus de ProgramBI.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Costa Rica",
    parrafo:
      "Academia en vivo por Zoom, en hora de San José: Power BI, SQL, Excel e IA aplicada para dispositivos médicos, centros de servicios, turismo y agro.",
    nota: "Clases en vivo · Horario de San José · Precios en USD",
  },
  intro: {
    kicker: "Datos para el mercado costarricense",
    titulo: "Del reporte para casa matriz al tablero que decide",
    parrafos: [
      "En Costa Rica muchos analistas trabajan en zonas francas: plantas de dispositivos médicos y centros de servicios compartidos que reportan a una casa matriz con indicadores definidos afuera. Saber Power BI y SQL ahí no es un extra; es lo que permite automatizar el reporte mensual y dedicar el tiempo a explicar los números en lugar de armarlos.",
      "El curso enseña a construir ese modelo con las fuentes que ya existen: comprobantes electrónicos de Hacienda, sistemas de producción, reservas y tickets de servicio. Las clases se siguen en hora de San José, en la tarde, quedan grabadas y el proyecto final se arma sobre un proceso del trabajo del alumno.",
    ],
  },
  casos: [
    {
      sector: "Dispositivos médicos y zonas francas",
      titulo: "Rendimiento por línea y control de calidad",
      descripcion:
        "Seguir rendimiento, rechazos y tiempos de ciclo por línea y turno, con la trazabilidad que exige un reporte regulado.",
      fuente: "MES, sistema de calidad y ERP.",
    },
    {
      sector: "Centros de servicios compartidos",
      titulo: "SLA, productividad y backlog por equipo",
      descripcion:
        "Medir cumplimiento de SLA, volumen procesado y backlog por cola o cliente interno, y dejar el reporte a casa matriz automatizado.",
      fuente: "Herramientas de tickets, registros de horas y bases de operación.",
    },
    {
      sector: "Turismo",
      titulo: "Ocupación y margen por temporada",
      descripcion:
        "Comparar ocupación, tarifa y margen por propiedad o paquete entre temporada alta y verde para decidir precios y personal.",
      fuente: "PMS, reservas y comprobantes electrónicos.",
    },
    {
      sector: "Agro exportador",
      titulo: "Costo por hectárea y destino en piña y café",
      descripcion:
        "Cruzar costo por hectárea, rendimiento y precio por destino de exportación para planificar la próxima cosecha.",
      fuente: "Planillas de finca, empaque y facturación de exportación.",
    },
  ],
  referencias: [
    {
      nombre: "Ministerio de Hacienda",
      detalle: "Comprobantes electrónicos que registran ventas y compras: la base del cierre contable.",
    },
    {
      nombre: "INEC",
      detalle: "Empleo, precios y actividad económica para contextualizar los indicadores del negocio.",
    },
    {
      nombre: "BCCR",
      detalle: "Tipo de cambio colón-dólar, tasas y series económicas para reportar en CRC y USD.",
    },
    {
      nombre: "SUGEF",
      detalle: "Información del sistema financiero, útil para equipos de banca, crédito y riesgo.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para Costa Rica se publica en dólares (USD), aunque tus reportes sigan en colones (CRC). La ficha de cada curso muestra el precio vigente y el total aparece antes de pagar.",
    nota: "Puedes pagar con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El cobro se procesa desde la cuenta de Chile: el checkout informa el equivalente en CLP antes de confirmar y tu banco define el cargo final en tu tarjeta.",
  },
  mercado: {
    ejemplo:
      "En Costa Rica el dato vive en los comprobantes electrónicos de Hacienda, el sistema de planta o de tickets y el reporte que pide la casa matriz. El primer tablero suele automatizar ese reporte mensual con una definición única de cada indicador.",
    horario:
      "Costa Rica se mantiene en UTC-6 todo el año. La clase de 19:30 en Chile se ve a las 16:30 en San José cuando Chile está en horario de verano y a las 17:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se pagan en dólares con tarjeta o transferencia; el checkout informa el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales costarricenses de zonas francas, centros de servicios, turismo y agro que necesitan automatizar sus reportes y explicarlos mejor. Las clases se siguen en hora de San José y quedan grabadas para repasarlas después.",
  },
  faqs: [
    {
      q: "¿Me sirve si trabajo en un centro de servicios o zona franca?",
      a: "Sí. Los escenarios de Costa Rica trabajan SLA y productividad por equipo, rendimiento por línea y control de calidad, que son los reportes más comunes en esos entornos. Son ejercicios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿A qué hora son las clases en Costa Rica?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. Costa Rica está en UTC-6 todo el año, así que en San José empiezan a las 16:30 cuando Chile está en horario de verano y a las 17:30 el resto del año. Si esa franja choca con tu jornada, todas las clases quedan grabadas.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo reportar en colones y en dólares?",
      a: "Sí. En Power BI y Excel trabajamos una tabla de tipo de cambio por fecha para mostrar la misma cifra en CRC y USD sin duplicar el reporte.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo pago desde Costa Rica?",
      a: "Con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El precio se publica en USD y el cobro se procesa desde la cuenta de Chile: el checkout muestra el equivalente en CLP antes de confirmar y tu banco define el cargo final.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("cr")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Mi empresa puede pagar el curso?",
      a: "Sí. Al pagar recibes el comprobante y la descripción del curso para gestionar el reembolso con tu empleador. Para grupos o formación in-company se prepara una propuesta aparte.",
      categoria: "pagos",
    },
  ],
};

export default contenido;
