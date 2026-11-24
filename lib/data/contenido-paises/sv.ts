import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "sv",
  seo: {
    title: "Cursos de datos en vivo en El Salvador | ProgramBI",
    description:
      "Power BI, Excel, SQL e IA aplicada en vivo para profesionales de El Salvador. Clases por Zoom en hora de San Salvador y precios en dólares sin conversión.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI y Excel en El Salvador | ProgramBI",
      description:
        "Catálogo en vivo para El Salvador: Power BI, Excel, SQL, Python e IA aplicada. Hora de San Salvador, precios en USD y proyecto final con datos reales.",
    },
    faq: {
      title: "Preguntas frecuentes cursos en El Salvador | ProgramBI",
      description:
        "Horario de San Salvador, pago en dólares, certificado y requisitos de los cursos en vivo de ProgramBI para profesionales y empresas salvadoreñas.",
    },
    implementacion: {
      title: "Implementación Power BI en El Salvador | ProgramBI",
      description:
        "Tableros Power BI para comercio, maquila y banca en El Salvador, con datos del DTE, del inventario y del sistema de planta. Diagnóstico y capacitación.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en El Salvador | ProgramBI",
      description:
        "Del archivo de ventas por sucursal que se rehace cada semana a un modelo Power BI que se actualiza solo. Curso abierto o in-company en El Salvador.",
    },
    porQueFallan: {
      title: "Proyectos Power BI que fallan en El Salvador | ProgramBI",
      description:
        "Qué revisar antes de un proyecto Power BI en El Salvador: fuentes, definiciones y adopción del equipo, y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de El Salvador",
      description:
        "Quiénes somos, cómo se dictan las clases en hora de San Salvador y qué encuentra en el campus un profesional de comercio, maquila, banca o servicios.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para El Salvador",
    parrafo:
      "Clases en vivo por Zoom en hora de San Salvador: Power BI, Excel, SQL e IA aplicada para comercio, maquila, banca, remesas y centros de servicios.",
    nota: "Clases en vivo · Horario de San Salvador · Precios en USD",
  },
  intro: {
    kicker: "Datos para la operación salvadoreña",
    titulo: "Sucursal, línea y cliente: medir lo que pasa cada día",
    parrafos: [
      "En El Salvador el día a día de muchas empresas se mide en la sucursal, en la línea de producción o en la cola de atención. La venta queda registrada en el Documento Tributario Electrónico, el inventario en otro sistema y el informe de la semana en una planilla que alguien reconstruye cada lunes.",
      "El curso enseña a unir esas piezas en un modelo que se actualiza solo y responde por tienda, por línea o por cliente sin rehacer el archivo. Los ejercicios vienen de comercio, maquila, banca y centros de servicios, y el precio se publica en dólares, la misma moneda con la que trabajas.",
    ],
  },
  casos: [
    {
      sector: "Comercio y retail",
      titulo: "Venta por sucursal y quiebre de inventario",
      descripcion:
        "Comparar venta diaria, inventario disponible y rotación por sucursal para detectar quiebres antes del fin de semana y ajustar la reposición.",
      fuente: "Punto de venta, DTE y sistema de inventario.",
    },
    {
      sector: "Maquila textil",
      titulo: "Eficiencia por línea y cumplimiento de pedido",
      descripcion:
        "Seguir piezas por hora, eficiencia por línea y avance de cada orden para anticipar atrasos frente a la fecha de embarque.",
      fuente: "Sistema de planta, tickets de producción y órdenes de compra.",
    },
    {
      sector: "Banca y remesas",
      titulo: "Flujo de envíos y conciliación de pagos",
      descripcion:
        "Ordenar envíos recibidos por canal y agencia, conciliar pagos y revisar cartera y mora en un mismo tablero.",
      fuente: "Core financiero, bases transaccionales y reportes de corresponsales.",
    },
    {
      sector: "Centros de contacto y servicios",
      titulo: "Tiempo de atención y productividad por campaña",
      descripcion:
        "Medir tiempo de atención, resolución al primer contacto y productividad por campaña para planificar turnos con datos.",
      fuente: "Plataforma de contact center, CRM y planillas de turnos.",
    },
  ],
  referencias: [
    {
      nombre: "Ministerio de Hacienda",
      detalle: "Documento Tributario Electrónico (DTE) y obligaciones que dejan trazada cada venta.",
    },
    {
      nombre: "BCR",
      detalle: "Series de actividad, comercio exterior y remesas para dar contexto a las cifras propias.",
    },
    {
      nombre: "Superintendencia del Sistema Financiero",
      detalle: "Información del sistema financiero útil para comparar cartera y tendencias.",
    },
    {
      nombre: "Superintendencia de Competencia",
      detalle: "Estudios de mercado por sector que ayudan a entender cómo compite cada industria.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares, sin tipo de cambio",
    resumen:
      "El catálogo para El Salvador se publica en dólares (USD). Como es la moneda oficial, el precio que ves es el que comparas con tu presupuesto, sin conversión.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; tu banco define el cargo final en la tarjeta.",
  },
  mercado: {
    ejemplo:
      "En El Salvador el dato de venta vive en el DTE y el resto se cruza con el inventario, el sistema de planta o el CRM. El primer tablero suele mostrar venta y quiebre por sucursal o eficiencia por línea, con una sola definición para operaciones, comercial y finanzas.",
    horario:
      "El Salvador se mantiene en UTC-6 todo el año. La clase de 19:30 en Chile se ve a las 16:30 en San Salvador cuando Chile está en horario de verano, y a las 17:30 el resto del año. La ficha de cada cohorte muestra la hora exacta y las sesiones quedan grabadas.",
    facturacion:
      "Los cursos se publican en USD y se pagan con tarjeta o transferencia en dólares; el cobro se procesa con la cuenta de Chile y muestra el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan en dólares, con alcance y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales salvadoreños de comercio, maquila, banca y centros de servicios que necesitan medir la operación diaria sin rehacer planillas. Como la clase en vivo cae en la tarde de San Salvador, todas las sesiones quedan grabadas para verlas después del turno.",
  },
  faqs: [
    {
      q: "¿A qué hora son las clases en El Salvador?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. En San Salvador eso equivale a 16:30 cuando Chile está en horario de verano y a 17:30 el resto del año. Si ese horario choca con tu jornada, puedes ver la grabación y llevar tus dudas a la siguiente clase en vivo.",
      categoria: "cursos",
    },
    {
      q: "¿Tengo que convertir el precio a otra moneda?",
      a: "No. El catálogo para El Salvador está en dólares, la moneda oficial. Al pagar, el checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; el cargo final en la tarjeta lo define tu banco.",
      categoria: "pagos",
    },
    {
      q: "¿Qué medios de pago acepta ProgramBI desde El Salvador?",
      a: "Mercado Pago con tarjeta de crédito o débito, tarjeta internacional o transferencia bancaria en dólares. La transferencia se coordina con admisiones antes de confirmar el cupo.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("sv")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Me sirve si trabajo en una maquila o en un centro de llamadas?",
      a: "Sí. Los escenarios de El Salvador trabajan eficiencia por línea, cumplimiento de pedidos, tiempos de atención y productividad por campaña. Son ejercicios de práctica, no casos de clientes, y el proyecto final puedes armarlo con datos de tu área.",
      categoria: "general",
    },
    {
      q: "¿Empiezo por Excel o por Power BI?",
      a: "Si hoy armas reportes copiando y pegando, Excel con Power Query es un buen primer paso. Si ya manejas tablas dinámicas y quieres tableros que se actualicen solos, conviene empezar por Power BI. Ambos cursos parten con lo necesario para seguir el ritmo.",
      categoria: "cursos",
    },
  ],
};

export default contenido;
