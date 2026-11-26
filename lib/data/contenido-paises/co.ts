import type { ContenidoPais } from "./tipos";
import type { DefinicionBloqueLocal } from "./bloque";
import { resumenDescuentoCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "co",
  seo: {
    title: "Cursos de datos en vivo Colombia | ProgramBI",
    description:
      "Formación en vivo de Power BI, análisis de datos y Python para profesionales de Colombia. Clases por Zoom en horario de Bogotá y precios en COP.",
  },
  seoPaginas: {
    cursos: {
      title: "Catálogo de cursos de datos en Colombia | ProgramBI",
      description:
        "Cursos de datos en vivo en Colombia: Power BI, SQL, Python y análisis de datos. Horario de Bogotá, precios en COP, clase gratis y certificado.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Colombia | ProgramBI",
      description:
        "Horarios de Bogotá, pago con tarjeta internacional vía Mercado Pago o transferencia internacional, certificados y requisitos de los cursos en vivo de ProgramBI en Colombia.",
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
    titulo: "Valor referencial en COP y pago internacional",
    resumen:
      "El catálogo de Colombia muestra valores referenciales en pesos colombianos (COP) en el PDF «Temario y precios» de cada ficha.",
    nota: "El pago se procesa con tarjeta internacional vía Mercado Pago (el cobro se realiza en CLP desde Chile y tu banco efectúa la conversión a COP) o mediante transferencia internacional.",
  },
  mercado: {
    ejemplo:
      "En Colombia el dato suele estar repartido entre el POS, la facturación electrónica de la DIAN y las bases de recaudo. Un primer tablero compara ventas por tienda y canal con cartera y recaudo, sin duplicar la definición de cliente.",
    horario:
      "Colombia se mantiene en UTC-5 todo el año, mientras Chile cambia por horario de verano. La clase de 19:30 en Chile se ve a las 17:30 en Bogotá en verano chileno y a las 18:30 en invierno. La ficha de la cohorte muestra la equivalencia exacta.",
    facturacion:
      "Los cursos se pagan con tarjeta internacional vía Mercado Pago (cobro procesado en CLP desde Chile con conversión bancaria a COP) o transferencia internacional. Los proyectos in-company se cotizan con alcance y moneda en la propuesta.",
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
      q: "¿Cómo puedo pagar desde Colombia?",
      a: "Con tarjeta de crédito o débito internacional vía Mercado Pago (en 3 cuotas sin interés cuando tu banco lo habilita) o mediante transferencia internacional coordinada con el equipo de admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿En qué moneda se procesa el cobro si el valor referencial está en COP?",
      a: `${resumenDescuentoCatalogo("co")} El cobro con tarjeta vía Mercado Pago se procesa en pesos chilenos (CLP) desde Chile y tu banco realiza la conversión a COP según su tipo de cambio.`,
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

/**
 * Bloque local de Colombia: datos duros, FAQ y metadata de las siete rutas.
 * Los montos y el horario los resuelve `bloque.ts` desde la fuente única.
 */
export const bloqueLocal: DefinicionBloqueLocal = {
  iso: "co",
  titulo: "Estudiar datos en vivo desde Colombia",
  parrafos: [
    "Colombia combina sectores muy intensivos en datos: retail y consumo masivo, fintech y banca, energía y servicios públicos, y agro. En esas operaciones el reporte suele quedar repartido entre el POS, la facturación electrónica y planillas de área. Tanto en el curso de Power BI en Colombia como en los programas de SQL Server, Python y análisis de datos, los ejercicios trabajan ventas por sede y canal, cartera, recaudo y márgenes con una definición común.",
    "Las clases son en vivo por Zoom en horario de Bogotá (America/Bogota, UTC-5 todo el año), con cobertura para profesionales en Bogotá, Medellín, Cali y Barranquilla y grabaciones en el campus virtual. El catálogo se publica en pesos colombianos (COP) y cada ficha incluye su PDF de Temario y precios, clase gratis y 3 cuotas sin interés.",
    "El pago se procesa con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile con conversión bancaria a COP) o transferencia internacional, con valor referencial en COP en el PDF «Temario y precios» y 3 cuotas sin interés. Cada cohorte cierra con un proyecto práctico y certificado digital de ProgramBI con código de verificación.",
  ],
  empresas:
    "Para equipos en Colombia (Bogotá, Medellín, Cali, Barranquilla y otras ciudades), la capacitación in-company se arma con los datos de la empresa: POS, facturación electrónica, cartera o reportes operativos. Se dicta en vivo por Zoom en horario de Bogotá, con grabaciones en el campus, factura corporativa y certificado con código de verificación para cada participante.",
  notas: {
    precio:
      "El valor referencial en pesos colombianos (COP) y los descuentos están en el PDF «Temario y precios» de cada curso; el checkout muestra el total antes de pagar.",
    horario:
      "Colombia se mantiene en UTC-5 todo el año (America/Bogota), sin horario de verano. En Chile la clase es de {horarioChile}; cuando Chile cambia de hora, la diferencia con Bogotá se mueve una hora. La ficha de la cohorte muestra la equivalencia exacta.",
    pago:
      "Pago con tarjeta internacional vía Mercado Pago (el cobro se procesa en CLP desde Chile y tu banco realiza la conversión a COP) o transferencia internacional coordinada con admisiones.",
    cuotas:
      "Aplican en la pasarela según las condiciones de tu tarjeta y banco emisor: 3 cuotas sin interés, sin recargo por financiamiento.",
    "clase-gratis":
      "Clase gratis: coordínala por WhatsApp con el equipo de admisiones según tu disponibilidad.",
    certificado:
      "El certificado digital de ProgramBI lleva código de verificación y se suma al campus virtual con las clases y el material usado durante el curso. Es un certificado de ProgramBI, distinto de la certificación PL-300 de Microsoft.",
  },
  preguntas: [
    {
      q: "¿A qué hora son las clases en Colombia y qué días?",
      a: "Las clases en vivo por Zoom son de {horario}, {horaLocal} (horario de Bogotá, UTC-5 todo el año), lunes y miércoles o martes y jueves según la cohorte. En Chile son de {horarioChile}. Aplica igual si te conectas desde Bogotá, Medellín, Cali o Barranquilla.",
    },
    {
      q: "¿Cuánto cuesta un curso en Colombia y en qué moneda se paga?",
      a: "{resumenPrecios}",
    },
    {
      q: "¿Puedo pagar desde Colombia con tarjeta o transferencia?",
      a: "Sí. Aceptamos tarjeta internacional vía Mercado Pago (el cobro se procesa en CLP desde Chile y tu banco realiza la conversión a COP) o transferencia internacional coordinada con admisiones. {notaPago}",
    },
    {
      q: "¿Hay 3 cuotas sin interés para Colombia?",
      a: "Sí: {cuotas} con tarjeta vía Mercado Pago, según la disponibilidad de tu banco emisor, sin recargo por financiamiento.",
    },
    {
      q: "¿Hay clase gratis antes de inscribirme?",
      a: "Sí. Puedes coordinar una clase gratis por WhatsApp antes de inscribirte para conocer cómo trabajamos en vivo.",
    },
    {
      q: "¿Qué certificado recibo al terminar?",
      a: "Un certificado digital de ProgramBI con código de verificación y acceso al campus virtual con las clases grabadas y el material de práctica. La certificación PL-300 de Microsoft se rinde y se paga aparte.",
    },
  ],
  enlacesExtras: [
    { href: "/co/cursos/power-bi-bogota", label: "Power BI en Bogotá" },
    { href: "/co/cursos/power-bi-medellin", label: "Power BI en Medellín" },
  ],
  seo: {
    hub: {
      title: "Cursos de datos en vivo en Colombia | ProgramBI",
      description:
        "Formación en vivo en Power BI, análisis de datos y Python para profesionales de Colombia: horario de Bogotá, valor referencial en COP y 3 cuotas sin interés.",
    },
    cursos: {
      title: "Catálogo de cursos de datos en Colombia | ProgramBI",
      description:
        "Cursos de datos en vivo en Colombia: Power BI, SQL, Python y análisis de datos. Horario de Bogotá, valor referencial en COP, clase gratis y certificado.",
    },
    "power-bi": {
      title: "Curso de Power BI en vivo en Colombia (COP y 3 cuotas) | ProgramBI",
      description:
        "Curso de Power BI en vivo para Colombia: Power Query, modelo estrella y DAX en 20 horas. Horario de Bogotá, valor referencial en COP en el PDF «Temario y precios» y 3 cuotas sin interés.",
    },
    "analisis-de-datos": {
      title: "Curso de análisis de datos en Colombia | ProgramBI",
      description:
        "Análisis de datos en vivo para Colombia: SQL Server, Power BI y Python en dos niveles de 60 horas. Horario de Bogotá, valor referencial en COP y certificado.",
    },
    python: {
      title: "Curso de Python para datos en Colombia | ProgramBI",
      description:
        "Python para datos en vivo para Colombia (20 h): Pandas, visualización y automatización. Horario de Bogotá, valor referencial en COP y 3 cuotas sin interés.",
    },
    empresas: {
      title: "Capacitación in-company en Colombia | ProgramBI",
      description:
        "Capacitación in-company para empresas de Colombia: Power BI, SQL, Python e IA con los datos del equipo, en vivo y con factura corporativa.",
    },
    precios: {
      title: "Precios de cursos en Colombia | ProgramBI",
      description:
        "Información de aranceles para Colombia: valor referencial en COP en el PDF «Temario y precios», pago con tarjeta internacional vía Mercado Pago o transferencia internacional y 3 cuotas sin interés.",
    },
  },
};
