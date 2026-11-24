import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "hn",
  seo: {
    title: "Cursos de datos en vivo en Honduras | ProgramBI",
    description:
      "Power BI, Excel y análisis de datos en vivo para Honduras: casos de maquila, café y banca, clases por Zoom en hora de Tegucigalpa y precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, Excel y SQL en Honduras | ProgramBI",
      description:
        "Catálogo en vivo para Honduras: Power BI, Excel, SQL y Python con proyecto final. Clases en hora de Tegucigalpa, grabadas y con precios en dólares.",
    },
    faq: {
      title: "Preguntas frecuentes: cursos en Honduras | ProgramBI",
      description:
        "Horario en Tegucigalpa y San Pedro Sula, pago en dólares, equivalente en CLP, certificado y requisitos de los cursos en vivo de ProgramBI en Honduras.",
    },
    implementacion: {
      title: "Implementación de Power BI en Honduras | ProgramBI",
      description:
        "Tableros Power BI para maquila, agroexportación, banca y centros de contacto en Honduras, con capacitación del equipo. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Honduras | ProgramBI",
      description:
        "De la planilla de producción por línea o de cosecha a tableros Power BI que se actualizan solos. Curso abierto o proyecto in-company en Honduras.",
    },
    porQueFallan: {
      title: "Por qué fallan los proyectos Power BI en Honduras",
      description:
        "Antes del tablero, la definición: qué revisar en un proyecto Power BI en Honduras y cuándo conviene curso abierto, consultora o un Pack de adopción.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Honduras",
      description:
        "Quiénes somos, cómo se siguen las clases en vivo desde Tegucigalpa o San Pedro Sula y qué encuentra un profesional hondureño en el campus virtual.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Honduras",
    parrafo:
      "Clases en vivo por Zoom en hora de Honduras: Power BI, Excel y análisis de datos para maquila, agroexportación, banca y centros de contacto.",
    nota: "Clases en vivo · Horario de Tegucigalpa · Precios en USD",
  },
  intro: {
    kicker: "Datos para la operación hondureña",
    titulo: "Eficiencia por línea y por turno: el número que se discute cada semana",
    parrafos: [
      "En Honduras buena parte del trabajo de análisis gira alrededor de la producción y la atención: la maquila de San Pedro Sula mide eficiencia por línea y por turno, el café y el camarón siguen lotes hasta el embarque, y los centros de contacto viven de tiempos de atención y niveles de servicio. En todos los casos el dato existe, pero se consolida a mano.",
      "El curso enseña a llevar esos registros a un modelo que se actualiza solo: la planilla de producción, el sistema de planta, las facturas con CAI y las bases de atención alimentan un tablero que responde qué línea, qué lote o qué campaña se desvió. Las clases se siguen en hora de Honduras y el proyecto final usa un proceso que el alumno conoce de su trabajo.",
    ],
  },
  casos: [
    {
      sector: "Maquila textil",
      titulo: "Eficiencia por línea, operario y orden",
      descripcion:
        "Comparar minutos producidos contra minutos disponibles por línea y turno, y seguir cada orden hasta el despacho para anticipar atrasos.",
      fuente: "Sistema de planta, boletas de producción y planillas de despacho.",
    },
    {
      sector: "Café y agroexportación",
      titulo: "Lotes, calidad y destino de exportación",
      descripcion:
        "Seguir el café o el camarón por lote, calidad y destino para comparar costo, precio obtenido y margen de cada embarque.",
      fuente: "Registros de acopio, beneficio o planta, contratos y facturación de exportación.",
    },
    {
      sector: "Banca y remesas",
      titulo: "Remesas pagadas, cartera y canal",
      descripcion:
        "Ordenar remesas pagadas por agencia y canal, y cruzar cartera y mora por producto para priorizar cobranza.",
      fuente: "Core bancario, sistema de remesadoras y bases de cobranza.",
    },
    {
      sector: "Centros de contacto y BPO",
      titulo: "Tiempo de atención y nivel de servicio",
      descripcion:
        "Medir tiempo promedio de atención, abandono y nivel de servicio por campaña y por hora para ajustar la dotación de agentes.",
      fuente: "Plataforma de telefonía, CRM y planillas de turnos.",
    },
  ],
  referencias: [
    {
      nombre: "SAR",
      detalle:
        "Régimen de facturación con Código de Autorización de Impresión (CAI) que identifica ventas y compras en los registros contables.",
    },
    {
      nombre: "INE Honduras",
      detalle: "Encuestas de hogares, empleo y precios para contextualizar el mercado.",
    },
    {
      nombre: "BCH",
      detalle: "Tipo de cambio del lempira, remesas e indicadores de actividad para leer costos y ventas.",
    },
    {
      nombre: "CNBS",
      detalle: "Información del sistema financiero útil para reportes de cartera y riesgo en banca.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para Honduras se publica en dólares (USD), una referencia habitual para comparar con la planilla en lempiras: cada ficha muestra el precio vigente.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile y el checkout informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Honduras el dato vive en el sistema de planta, en las facturas emitidas con CAI y en la planilla que supervisión actualiza por turno. El primer tablero suele mostrar eficiencia por línea o margen por lote, con una sola definición para producción y finanzas.",
    horario:
      "Honduras se mantiene en UTC-6 todo el año. La clase de 19:30 en Chile se ve a las 16:30 en Tegucigalpa cuando Chile está en horario de verano y a las 17:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se publican en dólares y se pagan con tarjeta o transferencia; el checkout muestra el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales hondureños de maquila, agroexportación, banca y centros de contacto que necesitan dejar de consolidar reportes a mano. Las clases se siguen en vivo en hora de Honduras y quedan grabadas para repasarlas después del turno.",
  },
  faqs: [
    {
      q: "¿Los casos sirven si trabajo en una maquila?",
      a: "Sí. Uno de los escenarios trabaja eficiencia por línea, turno y orden de producción, igual que en las plantas de San Pedro Sula. Son ejercicios de práctica con datos de ejemplo, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿A qué hora son las clases en Honduras?",
      a: "Las clases empiezan a las 19:30 de Chile. Como Honduras está en UTC-6 todo el año y Chile cambia de hora, en Tegucigalpa se ven a las 16:30 durante el verano chileno y a las 17:30 el resto del año. La ficha de cada curso muestra el horario exacto.",
      categoria: "cursos",
    },
    {
      q: "¿Y si salgo tarde del trabajo y no llego a la clase en vivo?",
      a: "Cada clase queda grabada en el campus virtual. Puedes verla después y enviar tus dudas al profesor; el proyecto final se entrega igual.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo pago desde Honduras?",
      a: "Con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile, por eso el checkout muestra el equivalente en CLP antes de confirmar; el cargo final en tu tarjeta lo define tu banco.",
      categoria: "pagos",
    },
    {
      q: "¿Cuánto cuestan los cursos?",
      a: `${resumenPreciosCatalogo("hn")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Necesito saber programar o tener licencia de Power BI?",
      a: "No. Se parte desde Excel y Power BI Desktop, que es gratuito en Windows. Si usas Mac, sigues el curso con Power BI web desde el navegador.",
      categoria: "general",
    },
  ],
};

export default contenido;
