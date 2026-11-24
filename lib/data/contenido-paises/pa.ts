import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "pa",
  seo: {
    title: "Cursos de datos en vivo en Panamá | ProgramBI",
    description:
      "Power BI, SQL y análisis de datos en vivo para profesionales de Panamá: logística, banca y servicios. Clases por Zoom en hora de Panamá y precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en Panamá | ProgramBI",
      description:
        "Catálogo en vivo para Panamá: Power BI, SQL, Python, Excel e IA aplicada. Hora de Ciudad de Panamá, precios en dólares y proyecto final aplicado.",
    },
    faq: {
      title: "Preguntas frecuentes cursos en Panamá | ProgramBI",
      description:
        "Horario de Panamá, pago en dólares, certificado y requisitos de los cursos en vivo de ProgramBI para profesionales de logística, banca y servicios.",
    },
    implementacion: {
      title: "Implementación Power BI en Panamá | ProgramBI",
      description:
        "Tableros Power BI para logística, reexportación y banca en Panamá, con datos del ERP, del WMS y de la factura electrónica. Diagnóstico y capacitación.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Panamá | ProgramBI",
      description:
        "Del archivo de despachos y del reporte regional armado a mano a un modelo Power BI que se actualiza solo. Curso abierto o proyecto in-company en Panamá.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Panamá | ProgramBI",
      description:
        "Muchas fuentes, varias filiales y definiciones distintas: qué revisar antes de un proyecto Power BI en Panamá y cuándo conviene curso o consultora.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Panamá",
      description:
        "Quiénes somos, cómo se dictan las clases en hora de Panamá y qué encuentra en el campus un profesional de logística, banca o servicios corporativos.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Panamá",
    parrafo:
      "Clases en vivo por Zoom en hora de Panamá: Power BI, SQL, Excel e IA aplicada para logística, puertos, reexportación, banca y servicios corporativos.",
    nota: "Clases en vivo · Horario de Panamá · Precios en USD",
  },
  intro: {
    kicker: "Datos para un hub regional",
    titulo: "Carga, contenedores y filiales: un solo tablero",
    parrafos: [
      "Buena parte de la economía panameña mueve cosas y dinero de otros: carga que cruza el Canal, mercadería que entra y sale de la Zona Libre de Colón, operaciones bancarias y sedes regionales que reportan para varios países. Eso deja datos en muchos sistemas a la vez y un reporte que casi siempre se consolida a mano.",
      "El curso enseña a juntar esas fuentes en un modelo único: despachos, inventario en bodega, facturación y cartera, con definiciones que no cambian según quién arme el archivo. Las clases se siguen en hora de Panamá, el precio está en dólares y el proyecto final se construye sobre un proceso que reconoces de tu trabajo.",
    ],
  },
  casos: [
    {
      sector: "Logística y puertos",
      titulo: "Tiempo de permanencia y costo por movimiento",
      descripcion:
        "Medir permanencia de contenedores, movimientos por turno y costo por operación para encontrar dónde se pierde tiempo entre la llegada y el despacho.",
      fuente: "Sistema de terminal o TMS, registros de turno y facturación.",
    },
    {
      sector: "Reexportación y Zona Libre",
      titulo: "Rotación de inventario y margen por mercado",
      descripcion:
        "Cruzar inventario en bodega, pedidos y precio por cliente para ver qué líneas rotan y qué mercados de destino dejan margen después de flete.",
      fuente: "WMS, ERP comercial y documentos de despacho.",
    },
    {
      sector: "Banca y servicios financieros",
      titulo: "Cartera por segmento y alertas de mora",
      descripcion:
        "Segmentar cartera por producto, plazo y comportamiento de pago para anticipar mora y priorizar la gestión de cobranza.",
      fuente: "Core bancario, bases de cobranza y reportes regulatorios.",
    },
    {
      sector: "Sedes regionales y servicios corporativos",
      titulo: "Consolidado de filiales en un mismo modelo",
      descripcion:
        "Unir ventas y gastos de varias filiales con un mismo plan de cuentas y tipo de cambio para que la gerencia regional compare países sin rehacer el archivo.",
      fuente: "ERP de cada filial, planillas de cierre y tablas de tipo de cambio.",
    },
  ],
  referencias: [
    {
      nombre: "DGI",
      detalle: "Sistema de Factura Electrónica de Panamá y obligaciones tributarias que ordenan ventas y compras.",
    },
    {
      nombre: "INEC Panamá",
      detalle: "Comercio exterior, empleo y precios para dar contexto a las cifras de la empresa.",
    },
    {
      nombre: "Superintendencia de Bancos",
      detalle: "Información del sistema bancario útil para comparar cartera, depósitos y tendencias.",
    },
    {
      nombre: "Canal y Zona Libre de Colón",
      detalle: "Tránsitos y movimiento de mercadería que marcan el ritmo de la logística y la reexportación.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares, como pagas en Panamá",
    resumen:
      "El catálogo para Panamá se publica en dólares (USD), la moneda que circula a la par del balboa. El precio que ves es el que comparas con tu presupuesto, sin conversión.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; el cargo final en la tarjeta lo define tu banco.",
  },
  mercado: {
    ejemplo:
      "En Panamá el dato suele estar repartido entre el sistema de la terminal o la bodega, el ERP de cada filial y la factura electrónica de la DGI. El primer tablero suele mostrar tiempos y costos de la operación logística o un consolidado regional con una definición común para todos los países.",
    horario:
      "Panamá se mantiene en UTC-5 todo el año. La clase de 19:30 en Chile se ve a las 17:30 en Ciudad de Panamá cuando Chile está en horario de verano, y a las 18:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se publican en USD y se pagan con tarjeta o transferencia en dólares; el cobro se procesa con la cuenta de Chile y muestra el equivalente en CLP antes de confirmar. Los proyectos in-company para equipos locales o regionales se cotizan en dólares, con alcance y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales de Panamá que trabajan en logística, reexportación, banca y sedes regionales, donde el reporte junta varios sistemas y a veces varios países. Las clases se siguen en hora de Panamá y quedan grabadas para repetirlas cuando un cierre o un turno no dejan conectarse.",
  },
  faqs: [
    {
      q: "¿A qué hora son las clases en Panamá?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. En Panamá eso equivale a 17:30 cuando Chile está en horario de verano y a 18:30 el resto del año, porque Panamá no cambia la hora. La ficha de cada cohorte muestra la hora local exacta y las sesiones quedan grabadas.",
      categoria: "cursos",
    },
    {
      q: "¿Por qué el checkout muestra pesos chilenos si el precio está en dólares?",
      a: "El precio se publica en USD, pero el cobro se procesa con la cuenta de ProgramBI en Chile. Por eso, antes de confirmar, el checkout informa el equivalente en pesos chilenos. Tu banco define el cargo final en la tarjeta; la transferencia en dólares se coordina con admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("pa")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Sirve si trabajo en una sede regional que reporta varios países?",
      a: "Sí. Uno de los escenarios del curso es consolidar filiales con un mismo plan de cuentas y tipo de cambio, para comparar países en un solo modelo. Es un ejercicio de práctica, no un caso de cliente, y el proyecto final puedes armarlo con tu propio proceso.",
      categoria: "general",
    },
    {
      q: "¿Los casos incluyen logística y Zona Libre?",
      a: "Sí. Los escenarios de Panamá trabajan permanencia de contenedores, costo por movimiento, rotación de inventario en bodega y margen por mercado de destino, además de cartera bancaria.",
      categoria: "general",
    },
    {
      q: "¿La empresa puede pedir un curso cerrado para su equipo?",
      a: "Sí. Los cursos in-company se dictan con datos del área y en el horario que acuerde el equipo, incluso para personas en varios países. La propuesta indica alcance, moneda y condiciones.",
      categoria: "cursos",
    },
  ],
};

export default contenido;
