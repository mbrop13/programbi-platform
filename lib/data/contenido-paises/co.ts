import type { ContenidoPais } from "./tipos";

const contenido: ContenidoPais = {
  iso: "co",
  seo: {
    title: "Cursos de datos en vivo Colombia | ProgramBI",
    description:
      "Formación en vivo de Power BI, análisis de datos y Python para profesionales de Colombia. Clases por Zoom en horario de Bogotá y precios en COP.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en Colombia | ProgramBI",
      description:
        "Catálogo en vivo para Colombia: Power BI, SQL, Python y análisis de datos. Horario de Bogotá, precios en COP y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Colombia | ProgramBI",
      description:
        "Horarios de Bogotá, pagos en COP con PSE o Nequi, certificados y requisitos de los cursos en vivo de ProgramBI en Colombia.",
    },
    implementacion: {
      title: "Implementación Power BI en Colombia | ProgramBI",
      description:
        "Tableros Power BI con datos de retail, energía o cartera y capacitación del equipo en Colombia. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en Colombia | ProgramBI",
      description:
        "De reportes de sedes y POS a tableros Power BI en Colombia. Curso abierto o proyecto in-company con los datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Colombia | ProgramBI",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto Power BI en Colombia y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Colombia",
      description:
        "Quiénes somos, cómo se dictan las clases en horario de Bogotá y qué encuentra un profesional colombiano en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Colombia",
    parrafo:
      "Formación en vivo por Zoom, en horario de Bogotá: Power BI, SQL y Python para retail, fintech, energía y agro.",
    nota: "Clases en vivo · Horario de Bogotá · Precios en COP",
  },
  intro: {
    kicker: "Datos para empresas colombianas",
    titulo: "Menos reportes sueltos, más decisiones compartidas",
    parrafos: [
      "Colombia tiene un ecosistema activo de retail, fintech y servicios, con facturación electrónica y pagos digitales que generan datos todos los días. El reto es convertir ese volumen en indicadores que operaciones y finanzas puedan usar sin discutir la fuente.",
      "La ruta es práctica y acumulativa: Excel para ordenar, SQL para extraer y Power BI para modelar y publicar. Los casos vienen de retail, energía, agro y servicios financieros, con un proyecto final que se puede mostrar en una entrevista o en la reunión de área.",
    ],
  },
  casos: [
    {
      sector: "Retail y consumo",
      titulo: "Venta por canal, tienda y margen",
      descripcion:
        "Unificar tiendas, e-commerce y mayoristas para comparar rotación, margen y devoluciones con la misma definición.",
      fuente: "Punto de venta, facturación electrónica e inventarios.",
    },
    {
      sector: "Fintech y banca",
      titulo: "Cartera, mora y recaudo",
      descripcion:
        "Seguir cartera por producto y canal, y cruzar recaudo con PSE o Nequi para ver dónde se pierde el pago.",
      fuente: "Pasarelas de pago, billeteras digitales y bases de cobranza.",
    },
    {
      sector: "Energía y servicios públicos",
      titulo: "Consumo, facturación y cartera por zona",
      descripcion:
        "Consolidar consumo, facturación y cartera por zona para detectar desvíos y priorizar mantenimiento.",
      fuente: "Sistemas comerciales, medidores y facturación.",
    },
    {
      sector: "Agro y café",
      titulo: "Costos por finca y precio de referencia",
      descripcion:
        "Cruzar costos de insumos, rendimiento y precio interno para ver el margen por finca o lote.",
      fuente: "Planillas de campo, compras y registros de comercialización.",
    },
  ],
  referencias: [
    {
      nombre: "DIAN",
      detalle: "Facturación electrónica y obligaciones tributarias que ordenan ventas y compras.",
    },
    {
      nombre: "DANE",
      detalle: "Actividad, precios y empleo para contextualizar el mercado.",
    },
    {
      nombre: "Banco de la República",
      detalle: "Tipo de cambio, tasas e inflación para leer costos y márgenes.",
    },
    {
      nombre: "Superintendencia Financiera",
      detalle: "Información del sistema financiero para benchmarks de cartera y riesgo.",
    },
  ],
  moneda: {
    titulo: "Pesos colombianos y pagos con PSE o Nequi",
    resumen:
      "El catálogo de Colombia se publica en pesos colombianos (COP): la ficha de cada curso muestra el precio de lista y el valor vigente.",
    nota: "El checkout procesa el pago con Mercado Pago y muestra tarjeta, PSE o Nequi cuando están habilitados. Si la cuenta local no está disponible, informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Colombia el dato suele estar repartido entre el POS, la facturación electrónica de la DIAN y las bases de recaudo. Un primer tablero compara ventas por tienda y canal con cartera y recaudo, sin duplicar la definición de cliente.",
    horario:
      "Colombia se mantiene en UTC-5 todo el año, mientras Chile cambia por horario de verano. La clase de 19:30 en Chile se ve a las 17:30 en Bogotá en verano chileno y a las 18:30 en invierno. La ficha de la cohorte muestra la equivalencia exacta.",
    facturacion:
      "Los cursos se pagan en pesos colombianos con Mercado Pago Colombia. Los proyectos in-company se cotizan con alcance y moneda en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a analistas y jefes de área colombianos que necesitan unir retail, cartera y operación en un mismo tablero. Las clases se dictan desde Chile y se siguen en horario de Bogotá, con grabaciones y material de práctica en el campus.",
  },
  faqs: [
    {
      q: "¿Sirve para el sector retail y consumo masivo?",
      a: "Sí. Los ejercicios de retail trabajan ventas por tienda, canal y categoría, inventario, margen y devoluciones. Es el tipo de reporte que suelen pedir las áreas comerciales y de operaciones.",
      categoria: "general",
    },
    {
      q: "¿Cómo se ajusta el horario para Bogotá?",
      a: "La clase se dicta desde Chile y se muestra en horario de Bogotá. Colombia no cambia la hora, así que la diferencia depende del horario de verano chileno. En la ficha de cada curso ves la hora exacta y las fechas disponibles.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo aplicar lo aprendido a datos de varias sedes?",
      a: "Sí. Uno de los problemas habituales es comparar sedes o canales con definiciones distintas. En el curso aprendes a unificar tablas, crear una dimensión común y construir indicadores comparables.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo pagar con PSE o Nequi?",
      a: "Sí, cuando la cuenta de Mercado Pago de Colombia está habilitada. También puedes pagar con tarjeta o coordinar una transferencia con el equipo de admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿El catálogo está en pesos colombianos?",
      a: "Sí. El catálogo de Colombia se muestra en COP y el checkout informa el monto antes de pagar. Si la cuenta local no está habilitada, aparece el equivalente en CLP para confirmar con el valor a la vista.",
      categoria: "pagos",
    },
    {
      q: "¿Qué pasa si falto a una clase?",
      a: "No pierdes el contenido: la sesión queda grabada y disponible en el campus. Puedes retomar los ejercicios con el material y consultar tus dudas en la siguiente clase.",
      categoria: "general",
    },
  ],
};

export default contenido;
