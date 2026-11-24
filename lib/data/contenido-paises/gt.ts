import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "gt",
  seo: {
    title: "Cursos de datos en vivo en Guatemala | ProgramBI",
    description:
      "Power BI, SQL y análisis de datos en vivo para profesionales de Guatemala. Clases por Zoom en hora de Guatemala, casos de agroexportación y retail.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y Excel en Guatemala | ProgramBI",
      description:
        "Catálogo en vivo para Guatemala: Power BI, SQL, Python, Excel e IA aplicada. Hora de Guatemala, precios en USD y proyecto final con datos reales.",
    },
    faq: {
      title: "Preguntas frecuentes cursos en Guatemala | ProgramBI",
      description:
        "Horario de Guatemala, pago en dólares desde quetzales, certificado y requisitos de los cursos en vivo de ProgramBI para profesionales guatemaltecos.",
    },
    implementacion: {
      title: "Implementación Power BI en Guatemala | ProgramBI",
      description:
        "Tableros Power BI para agroexportación, distribución y manufactura en Guatemala, con datos de la FEL y del ERP. Diagnóstico, modelo y capacitación.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Guatemala | ProgramBI",
      description:
        "De la planilla de cosecha y del reporte de ruta a un modelo Power BI que se actualiza solo. Curso abierto o proyecto in-company en Guatemala.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Guatemala | ProgramBI",
      description:
        "Fuentes sin ordenar y definiciones que cambian por área: qué revisar antes de un proyecto Power BI en Guatemala y cuándo conviene curso o consultora.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Guatemala",
      description:
        "Quiénes somos, cómo se dictan las clases en hora de Guatemala y qué encuentra en el campus un profesional de agro, distribución o manufactura.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Guatemala",
    parrafo:
      "Clases en vivo por Zoom en hora de Guatemala: Power BI, SQL, Excel e IA aplicada para agroexportación, distribución, manufactura y servicios financieros.",
    nota: "Clases en vivo · Horario de Guatemala · Precios en USD",
  },
  intro: {
    kicker: "Datos para la empresa guatemalteca",
    titulo: "De la finca a la ruta: el margen en quetzales y en dólares",
    parrafos: [
      "En Guatemala es común que una misma empresa venda afuera en dólares y opere adentro en quetzales: el café, el banano, el cardamomo o el azúcar se exportan, mientras la distribución y el retail se mueven por rutas y tiendas en todo el país. El número de gestión queda repartido entre la FEL de la SAT, el ERP y las planillas de finca o de ruta.",
      "El curso enseña a ordenar ese material en un modelo que se actualiza solo y que separa con claridad lo que se mide en quetzales y lo que se mide en dólares. Los tableros responden por finca, por ruta o por categoría, y el proyecto final se construye sobre un proceso de tu propio trabajo.",
    ],
  },
  casos: [
    {
      sector: "Agroexportación",
      titulo: "Costo por quintal y margen por contrato",
      descripcion:
        "Cruzar producción por finca, costo de cosecha y precio de cada contrato para ver qué lote y qué comprador dejan margen en café, banano o cardamomo.",
      fuente: "Planillas de finca, registros de beneficio o empaque y facturas de exportación.",
    },
    {
      sector: "Distribución y retail",
      titulo: "Venta por ruta y cobertura de tiendas",
      descripcion:
        "Medir venta, devoluciones y cobertura por ruta y por tienda para ajustar frecuencias de visita y surtido por región.",
      fuente: "Sistema de preventa, ERP comercial y documentos de la FEL.",
    },
    {
      sector: "Manufactura y maquila",
      titulo: "Rendimiento por línea y costo por turno",
      descripcion:
        "Seguir producción, merma y horas por turno para comparar líneas y detectar dónde se va el costo antes de cerrar el mes.",
      fuente: "Sistema de planta, órdenes de producción y planillas de turno.",
    },
    {
      sector: "Servicios financieros y remesas",
      titulo: "Pagos recibidos y cartera por agencia",
      descripcion:
        "Ordenar pagos de remesas por agencia y canal, conciliarlos y revisar cartera y mora en el mismo modelo.",
      fuente: "Core financiero, bases transaccionales y reportes de corresponsales.",
    },
  ],
  referencias: [
    {
      nombre: "SAT",
      detalle: "Factura Electrónica en Línea (FEL) y obligaciones que dejan trazada cada venta y compra.",
    },
    {
      nombre: "INE Guatemala",
      detalle: "Precios, empleo y estadísticas económicas para dar contexto a las cifras propias.",
    },
    {
      nombre: "Banguat",
      detalle: "Tipo de cambio de referencia, comercio exterior e ingreso de divisas por remesas.",
    },
    {
      nombre: "SIB",
      detalle: "Información del sistema bancario útil para comparar cartera y tendencias.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para Guatemala se publica en dólares (USD). Si tu tarjeta está en quetzales, el banco convierte el cargo al tipo de cambio que aplique ese día.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; el cargo final en quetzales lo define tu banco.",
  },
  mercado: {
    ejemplo:
      "En Guatemala el dato vive en la FEL de la SAT, en el ERP y en las planillas de finca o de ruta. El primer tablero suele mostrar margen por contrato de exportación o venta por ruta, con quetzales y dólares separados y una definición común para todas las áreas.",
    horario:
      "Guatemala se mantiene en UTC-6 todo el año. La clase de 19:30 en Chile se ve a las 16:30 en Ciudad de Guatemala cuando Chile está en horario de verano, y a las 17:30 el resto del año. La ficha de cada cohorte muestra la hora exacta y las sesiones quedan grabadas.",
    facturacion:
      "Los cursos se publican en USD y se pagan con tarjeta o transferencia en dólares; el cobro se procesa con la cuenta de Chile y muestra el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda, alcance y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales guatemaltecos de agroexportación, distribución, manufactura y servicios financieros que manejan quetzales y dólares en el mismo reporte. Las clases se siguen en hora de Guatemala y quedan grabadas para quien trabaja en finca, en ruta o en turnos de planta.",
  },
  faqs: [
    {
      q: "¿A qué hora son las clases en Guatemala?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. En Guatemala eso equivale a 16:30 cuando Chile está en horario de verano y a 17:30 el resto del año, porque Guatemala no cambia la hora. Todas las sesiones quedan grabadas en el campus.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo pagar en quetzales?",
      a: "El precio se publica en dólares. Si pagas con una tarjeta en quetzales, tu banco convierte el cargo. El checkout procesa el cobro con la cuenta de ProgramBI en Chile y muestra el equivalente en pesos chilenos antes de confirmar; también puedes pagar por transferencia en dólares coordinada con admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("gt")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Cómo se manejan quetzales y dólares en los ejercicios?",
      a: "Los escenarios de Guatemala separan lo que se vende afuera en dólares de lo que se opera adentro en quetzales, con una tabla de tipo de cambio que el modelo usa en todas las medidas. Es una práctica clave para leer el margen real de una exportación.",
      categoria: "cursos",
    },
    {
      q: "¿Los casos incluyen agro y distribución?",
      a: "Sí. Los ejercicios trabajan costo por quintal, margen por contrato, venta por ruta y cobertura de tiendas, además de rendimiento por línea. Son escenarios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿Puedo seguir el curso desde Quetzaltenango o desde una finca?",
      a: "Sí. Las clases son por Zoom y quedan grabadas. Necesitas una conexión estable para la clase en vivo y una computadora para practicar; no hace falta viajar a la capital.",
      categoria: "general",
    },
  ],
};

export default contenido;
