import type { ContenidoPais } from "./tipos";

const contenido: ContenidoPais = {
  iso: "uy",
  seo: {
    title: "Cursos de datos en vivo Uruguay | ProgramBI",
    description:
      "Cursos en vivo de análisis de datos, Power BI y Power Automate para profesionales de Uruguay. Clases por Zoom en horario de Montevideo y precios en UYU.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en Uruguay | ProgramBI",
      description:
        "Catálogo en vivo para Uruguay: Power BI, SQL, Python y análisis de datos. Horario de Montevideo, precios en UYU y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Uruguay | ProgramBI",
      description:
        "Horarios de Montevideo, pagos en UYU con Mercado Pago, certificados y requisitos de los cursos en vivo de ProgramBI en Uruguay.",
    },
    implementacion: {
      title: "Implementación Power BI en Uruguay | ProgramBI",
      description:
        "Tableros Power BI con datos de agro, frigorífico o servicios y capacitación del equipo en Uruguay. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en Uruguay | ProgramBI",
      description:
        "De planillas de campo y faena a tableros Power BI en Uruguay. Curso abierto o proyecto in-company con los datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Uruguay | ProgramBI",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto Power BI en Uruguay y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Uruguay",
      description:
        "Quiénes somos, cómo se dictan las clases en horario de Montevideo y qué encuentra un profesional uruguayo en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Uruguay",
    parrafo:
      "Academia en vivo por Zoom, en horario de Montevideo: análisis de datos, Power BI y Power Automate para agro, frigoríficos, servicios y turismo.",
    nota: "Clases en vivo · Horario de Montevideo · Precios en UYU",
  },
  intro: {
    kicker: "Datos para el mercado uruguayo",
    titulo: "Trazabilidad y margen: dos preguntas que ordenan todo",
    parrafos: [
      "Uruguay es un mercado pequeño, exportador y muy conectado. Agro, frigoríficos, servicios financieros y turismo necesitan ver el margen por operación y la trazabilidad de cada lote, cliente o reserva sin depender de planillas paralelas.",
      "El curso enseña a construir ese control con datos que la empresa ya genera: facturación electrónica, planillas de campo, sistemas de faena y reservas. Las clases se siguen en horario de Montevideo y el proyecto final se arma sobre un proceso que el alumno reconoce de su trabajo.",
    ],
  },
  casos: [
    {
      sector: "Agro y ganadería",
      titulo: "Costo por hectárea y margen por potrero",
      descripcion:
        "Cruzar costo por hectárea, rinde y margen por potrero o categoría para decidir la próxima zafra con números.",
      fuente: "Planillas de campo, DICOSE y facturación electrónica.",
    },
    {
      sector: "Frigoríficos y exportación",
      titulo: "Rendimiento por faena y destino",
      descripcion:
        "Comparar rendimiento por faena, costo y margen por destino de exportación en un solo tablero.",
      fuente: "ERP frigorífico, certificados y facturación de exportación.",
    },
    {
      sector: "Servicios financieros y fintech",
      titulo: "Cartera, cobranza y venta cruzada",
      descripcion:
        "Segmentar cartera por producto y canal para priorizar cobranza y detectar oportunidades de venta cruzada.",
      fuente: "Core financiero, pasarelas y bases de cobranza.",
    },
    {
      sector: "Turismo y logística",
      titulo: "Ocupación, tarifas y costo por ruta",
      descripcion:
        "Cruzar ocupación, tarifas y costos operativos para decidir capacidad y precios de temporada.",
      fuente: "PMS, reservas, TMS y facturación.",
    },
  ],
  referencias: [
    {
      nombre: "DGI",
      detalle: "Facturación electrónica y obligaciones tributarias que ordenan ventas y compras.",
    },
    {
      nombre: "INE",
      detalle: "Actividad, precios, empleo y turismo para contextualizar el mercado.",
    },
    {
      nombre: "BCU",
      detalle: "Tipo de cambio, tasas e inflación para leer costos y márgenes.",
    },
    {
      nombre: "Zonas francas y servicios",
      detalle: "Operaciones exportables y regímenes especiales que conviene entender al reportar.",
    },
  ],
  moneda: {
    titulo: "Pesos uruguayos y pagos con Mercado Pago",
    resumen:
      "El catálogo de Uruguay se publica en pesos uruguayos (UYU): la ficha de cada curso distingue el precio de lista del monto vigente.",
    nota: "El checkout procesa el pago con Mercado Pago y muestra tarjeta o wallet cuando están habilitados. Si la cuenta local no está disponible, informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Uruguay el dato vive en la facturación electrónica de DGI, las planillas de campo y los sistemas de faena. El primer tablero suele mostrar margen por lote o por destino de exportación, con una definición común para todas las áreas.",
    horario:
      "Uruguay mantiene UTC-3 todo el año, igual que Argentina. Como Chile cambia entre UTC-3 y UTC-4, la clase de 19:30 en Chile se ve a las 19:30 o a las 20:30 en Montevideo. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se pagan en pesos uruguayos con Mercado Pago Uruguay. Los servicios in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales uruguayos de agro, frigoríficos, servicios y turismo que necesitan trazabilidad y margen sin depender de planillas paralelas. Las clases se siguen en horario de Montevideo y quedan grabadas para consultarlas después.",
  },
  faqs: [
    {
      q: "¿Los casos incluyen agro y frigoríficos?",
      a: "Sí. Los escenarios de Uruguay trabajan costos por hectárea, trazabilidad, rendimiento por faena y margen por destino. Son ejercicios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿Cómo se ve el horario desde Montevideo?",
      a: "Las clases se dictan desde Chile y se muestran en horario de Montevideo. Uruguay comparte UTC-3 con Argentina y Chile alterna entre UTC-3 y UTC-4, por eso la equivalencia puede correrse una hora. La ficha de cada curso indica el horario exacto.",
      categoria: "cursos",
    },
    {
      q: "¿Necesito experiencia previa en estadística?",
      a: "No. El enfoque es aplicado: aprender a ordenar datos, calcular indicadores y explicarlos. La estadística aparece cuando hace falta, sin convertirse en un curso teórico.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo pagar en pesos uruguayos?",
      a: "El catálogo se muestra en UYU y el pago se procesa por Mercado Pago. Si la cuenta local no está habilitada, el checkout informa el equivalente en CLP antes de confirmar.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: "Las promociones vigentes se muestran en el checkout y en la ficha de cada curso. El precio tachado indica el valor de lista; el precio final es el que ves al momento de pagar.",
      categoria: "pagos",
    },
    {
      q: "¿Puedo hacer el curso si trabajo en el interior?",
      a: "Sí. Las clases son por Zoom y quedan grabadas. Solo necesitas conexión estable y una computadora para practicar; no hay que trasladarse a Montevideo.",
      categoria: "general",
    },
  ],
};

export default contenido;
