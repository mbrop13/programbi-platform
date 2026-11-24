import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "ec",
  seo: {
    title: "Cursos de datos en vivo en Ecuador | ProgramBI",
    description:
      "Power BI, SQL y análisis de datos en vivo para profesionales de Ecuador. Clases por Zoom en hora de Quito y precios en dólares, la misma moneda que usas.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Ecuador | ProgramBI",
      description:
        "Catálogo en vivo para Ecuador: Power BI, SQL, Python, Excel e IA aplicada. Hora de Quito y Guayaquil, precios en USD y proyecto final con datos reales.",
    },
    faq: {
      title: "Preguntas frecuentes cursos en Ecuador | ProgramBI",
      description:
        "Horario de Quito, pago en dólares, certificado y requisitos de los cursos en vivo de ProgramBI para profesionales y empresas de Ecuador.",
    },
    implementacion: {
      title: "Implementación Power BI en Ecuador | ProgramBI",
      description:
        "Tableros Power BI para agroexportación, retail y cooperativas en Ecuador, con datos del SRI y del ERP. Diagnóstico, modelo y capacitación del equipo.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Ecuador | ProgramBI",
      description:
        "De la planilla de embarques y del reporte de agencias a un modelo Power BI que se actualiza solo. Curso abierto o proyecto in-company en Ecuador.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Ecuador | ProgramBI",
      description:
        "Definiciones comunes, fuentes ordenadas y adopción: qué revisar antes de un proyecto Power BI en Ecuador y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Ecuador",
      description:
        "Quiénes somos, cómo se dictan las clases en hora de Quito y qué encuentra en el campus un profesional ecuatoriano de exportación, retail o finanzas.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Ecuador",
    parrafo:
      "Clases en vivo por Zoom en hora de Quito: Power BI, SQL, Excel e IA aplicada para agroexportación, petróleo, retail y cooperativas, con precios en dólares.",
    nota: "Clases en vivo · Horario de Quito · Precios en USD",
  },
  intro: {
    kicker: "Datos para la empresa ecuatoriana",
    titulo: "Del embarque al margen: el número que llega tarde",
    parrafos: [
      "En Ecuador muchas decisiones se toman con un reporte que llega una semana después de que pasó todo. El embarque ya salió, la cosecha ya se vendió y la agencia ya cerró el mes cuando alguien termina de pegar la planilla. El problema rara vez es la falta de datos: los comprobantes electrónicos del SRI, el sistema de planta y el sistema comercial ya registran casi todo.",
      "El curso enseña a conectar esas fuentes en un modelo que se actualiza solo y a construir indicadores que resisten la reunión: costo por caja, margen por destino, venta por agencia o mora por socio. Como la economía está dolarizada, los montos de tus tablas y el precio del curso están en la misma moneda, sin conversiones de por medio.",
    ],
  },
  casos: [
    {
      sector: "Agroexportación",
      titulo: "Costo por caja y margen por destino",
      descripcion:
        "Cruzar producción por finca, calibre y rechazo con el precio de cada embarque para ver qué destino y qué cliente dejan margen en banano, cacao o flores.",
      fuente: "Registros de finca, packing list, facturas de exportación y comprobantes del SRI.",
    },
    {
      sector: "Acuacultura",
      titulo: "Rendimiento por piscina y ciclo",
      descripcion:
        "Seguir alimento, sobrevivencia y talla por piscina para comparar el costo por libra entre ciclos y anticipar la cosecha.",
      fuente: "Bitácoras de campo, inventario de alimento y liquidaciones de planta.",
    },
    {
      sector: "Cooperativas de ahorro y crédito",
      titulo: "Cartera, mora y colocación por agencia",
      descripcion:
        "Segmentar la cartera por producto, agencia y antigüedad de mora para priorizar cobranza y decidir dónde colocar crédito nuevo.",
      fuente: "Core financiero, bases de cobranza y reportes regulatorios.",
    },
    {
      sector: "Retail y consumo masivo",
      titulo: "Venta por local y quiebre de stock",
      descripcion:
        "Comparar venta, inventario y rotación por local entre Sierra y Costa para ajustar reposición y surtido por temporada.",
      fuente: "Punto de venta, ERP de inventario y comprobantes electrónicos.",
    },
  ],
  referencias: [
    {
      nombre: "SRI",
      detalle: "Comprobantes electrónicos y declaraciones que dejan trazada cada venta y compra.",
    },
    {
      nombre: "INEC",
      detalle: "Precios, empleo y estadísticas empresariales para poner en contexto las cifras propias.",
    },
    {
      nombre: "Banco Central del Ecuador",
      detalle: "Comercio exterior, balanza y series macro útiles para leer exportaciones y demanda.",
    },
    {
      nombre: "Superintendencia de Compañías",
      detalle: "Estados financieros de empresas y sectores para comparar desempeño y tamaño.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares, la misma moneda que usas",
    resumen:
      "El catálogo para Ecuador se publica en dólares (USD). Como es la moneda local, el precio que ves es el que comparas con tu presupuesto, sin tipo de cambio de por medio.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; el cargo final en tu tarjeta lo define tu banco.",
  },
  mercado: {
    ejemplo:
      "En Ecuador el dato está repartido entre los comprobantes electrónicos del SRI, el sistema de planta o de agencias y la planilla que exportaciones actualiza a mano. El primer tablero suele mostrar costo por caja o margen por destino con una sola definición para producción, comercial y finanzas.",
    horario:
      "Ecuador continental se mantiene en UTC-5 todo el año. La clase de 19:30 en Chile se ve a las 17:30 en Quito y Guayaquil cuando Chile está en horario de verano, y a las 18:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se publican en USD y se pagan con tarjeta o transferencia en dólares; el cobro se procesa con la cuenta de Chile y muestra el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan en dólares, con alcance y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales ecuatorianos de exportación, acuacultura, retail y cooperativas que necesitan que el reporte llegue a tiempo y con una sola versión del número. Las clases se siguen en hora de Quito y quedan grabadas para repetirlas cuando la cosecha o el cierre no dejan conectarse.",
  },
  faqs: [
    {
      q: "¿A qué hora son las clases en Ecuador?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. En Quito y Guayaquil eso equivale a 17:30 cuando Chile está en horario de verano y a 18:30 el resto del año, porque Ecuador no cambia la hora. La ficha de cada cohorte muestra la hora local exacta y todas las sesiones quedan grabadas.",
      categoria: "cursos",
    },
    {
      q: "¿El precio en dólares incluye conversión?",
      a: "No hace falta convertir: el catálogo para Ecuador está en USD, la misma moneda que usas a diario. Al pagar, el checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; tu banco define el cargo final en la tarjeta.",
      categoria: "pagos",
    },
    {
      q: "¿Qué medios de pago puedo usar desde Ecuador?",
      a: "Mercado Pago con tarjeta de crédito o débito, tarjeta internacional o transferencia bancaria en dólares. La transferencia se coordina con admisiones y el cupo se confirma al recibir el pago.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("ec")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Los ejercicios sirven para empresas exportadoras?",
      a: "Sí. Los escenarios de Ecuador trabajan costo por caja, calibre, rechazo y margen por destino, además de cartera de cooperativas y venta por local. Son ejercicios de práctica, no casos de clientes, y el proyecto final puedes armarlo con un proceso de tu propio trabajo.",
      categoria: "general",
    },
    {
      q: "¿Puedo seguir el curso desde Cuenca, Manta o una finca?",
      a: "Sí. Las clases son por Zoom y quedan grabadas en el campus. Necesitas una conexión estable para la clase en vivo y una computadora para practicar; si un día no puedes conectarte, repasas la grabación y consultas tus dudas en la siguiente sesión.",
      categoria: "general",
    },
    {
      q: "¿Necesito saber programar para empezar?",
      a: "No. Los cursos de Power BI, Excel e IA aplicada parten desde cero. SQL y Python también empiezan por lo básico y avanzan con ejercicios sobre tablas de ventas, inventario y cartera.",
      categoria: "cursos",
    },
  ],
};

export default contenido;
