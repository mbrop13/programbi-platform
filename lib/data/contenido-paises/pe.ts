import type { ContenidoPais } from "./tipos";
import type { DefinicionBloqueLocal } from "./bloque";
import { resumenDescuentoCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "pe",
  seo: {
    title: "Cursos de datos en vivo Perú | ProgramBI",
    description:
      "Cursos en vivo de análisis de datos, Power BI y SQL para profesionales de Perú. Clases por Zoom en horario de Lima y valor referencial en soles.",
  },
  seoPaginas: {
    cursos: {
      title: "Curso de Power BI y datos en vivo en Perú | ProgramBI",
      description:
        "Cursos en vivo de análisis de datos, Power BI, Excel, SQL, Python e IA en Perú: horario de Lima, valor referencial en soles (PEN), 3 cuotas sin interés y certificado.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Perú | ProgramBI",
      description:
        "Horarios de Lima, pago con tarjeta internacional vía Mercado Pago o transferencia internacional, certificados y requisitos de los cursos en vivo de ProgramBI en Perú.",
    },
    implementacion: {
      title: "Implementación Power BI en Perú | ProgramBI",
      description:
        "Tableros Power BI con datos de minería, agro o retail y capacitación del equipo en Perú. Diagnóstico y propuesta con alcance.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en Perú | ProgramBI",
      description:
        "De planillas de campo y reportes de planta a tableros Power BI en Perú. Curso abierto o proyecto in-company con tus datos.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Perú | ProgramBI",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto Power BI en Perú y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Perú",
      description:
        "Quiénes somos, cómo se dictan las clases en horario de Lima y qué encuentra un profesional peruano en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Perú",
    parrafo:
      "Academia en vivo por Zoom, en horario de Lima: análisis de datos, Power BI y automatización para minería, agroexportación, retail y banca.",
    nota: "Clases en vivo · Horario de Lima · Precios en PEN",
  },
  intro: {
    kicker: "Datos para la operación peruana",
    titulo: "De la mina al mercado, con la misma data",
    parrafos: [
      "Perú combina operaciones intensivas en activos con un retail y una agroindustria que crecen rápido. En ambos mundos el problema se repite: reportes que llegan tarde, en formatos distintos y sin una definición común de lo que significa cada indicador.",
      "La formación conecta esos mundos con datos que ya existen: comprobantes electrónicos, sistemas de planta, cuadernos de campo y registros comerciales. Los casos de minería, agroexportación, retail y microfinanzas se trabajan en clase, en horario de Lima, y terminan en un tablero con dueño y reglas claras.",
    ],
  },
  casos: [
    {
      sector: "Minería",
      titulo: "Producción, leyes y costo por unidad",
      descripcion:
        "Consolidar producción, leyes y costos por tajo, planta o unidad para comparar el plan con la operación real.",
      fuente: "Sistemas de mina y planta, reportes de producción y facturación electrónica.",
    },
    {
      sector: "Agroexportación",
      titulo: "Campaña, rendimiento y destino",
      descripcion:
        "Ver rendimiento por fundo y lote, costos de packing y margen por destino de exportación en un solo modelo.",
      fuente: "Cuadernos de campo, ERP agroindustrial y guías de remisión.",
    },
    {
      sector: "Retail y consumo masivo",
      titulo: "Venta por tienda y margen",
      descripcion:
        "Comparar venta, inventario y margen por tienda y categoría para ajustar reposición, surtido y precios.",
      fuente: "Punto de venta, almacenes y comprobantes electrónicos.",
    },
    {
      sector: "Banca y microfinanzas",
      titulo: "Cartera y cobranza por zona",
      descripcion:
        "Analizar cartera por producto, zona y asesor para priorizar cobranza y detectar oportunidades de originación.",
      fuente: "Core bancario, billeteras digitales y bases de cobranza.",
    },
  ],
  referencias: [
    {
      nombre: "SUNAT",
      detalle: "Comprobantes electrónicos, detracciones y declaraciones que ordenan la operación tributaria.",
    },
    {
      nombre: "INEI",
      detalle: "Actividad, precios y empleo para contextualizar los indicadores del negocio.",
    },
    {
      nombre: "BCRP",
      detalle: "Tipo de cambio, tasas e inflación para leer costos y márgenes.",
    },
    {
      nombre: "SBS",
      detalle: "Información del sistema financiero para benchmarks de cartera y riesgo.",
    },
  ],
  moneda: {
    titulo: "Valor referencial en soles (PEN) y pago internacional",
    resumen:
      "El catálogo de Perú muestra valores referenciales en soles (PEN) en el PDF de temario y precios de cada ficha.",
    nota: "El pago se procesa con tarjeta internacional vía Mercado Pago (el cobro se realiza en CLP desde Chile y tu banco efectúa la conversión a soles) o mediante transferencia internacional.",
  },
  mercado: {
    ejemplo:
      "En Perú es habitual partir de los comprobantes electrónicos de SUNAT, los reportes de planta y las planillas de campo. El primer tablero suele unir producción y costo por unidad, o ventas por tienda y margen por categoría.",
    horario:
      "Perú se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano. La clase de 19:30 en Chile se ve a las 17:30 en Lima cuando Chile está en verano y a las 18:30 en invierno. La ficha de la cohorte muestra la equivalencia exacta.",
    facturacion:
      "Los cursos se pagan con tarjeta internacional vía Mercado Pago (procesado en CLP desde Chile con conversión bancaria a soles) o transferencia internacional. Los proyectos in-company se cotizan aparte y la propuesta indica moneda, alcance y condiciones de facturación.",
  },
  nosotros: {
    parrafo:
      "Trabajamos con profesionales peruanos de minería, agroexportación, retail y banca que necesitan conectar la operación con el reporte de gestión. Las clases se siguen en horario de Lima y el material queda disponible para repetir los ejercicios con calma.",
  },
  faqs: [
    {
      q: "¿Los ejemplos incluyen minería y agroexportación?",
      a: "Sí. Los casos de uso de Perú incluyen producción minera, campañas agrícolas, retail y cartera financiera. No son casos de clientes: son escenarios de trabajo para practicar con datos verosímiles.",
      categoria: "general",
    },
    {
      q: "¿Cómo se calcula el horario desde Lima?",
      a: "Las clases se dictan desde Chile y se publican convertidas a la hora de Lima. Perú no aplica horario de verano, así que la diferencia cambia cuando Chile entra o sale de su horario de verano. La ficha de cada curso muestra el horario de la próxima cohorte.",
      categoria: "cursos",
    },
    {
      q: "¿Necesito llevar una laptop con Power BI instalado?",
      a: "Sí, para practicar conviene tener una computadora con Power BI Desktop. Las clases quedan grabadas y los archivos de trabajo se comparten en el campus para que puedas repetir los ejercicios.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo puedo pagar desde Perú?",
      a: "Con tarjeta de crédito o débito internacional vía Mercado Pago (en 3 cuotas sin interés cuando tu banco lo habilita) o mediante transferencia internacional coordinada con el equipo de admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿En qué moneda se procesa el cobro si el valor referencial está en soles?",
      a: `${resumenDescuentoCatalogo("pe")} El cobro con tarjeta vía Mercado Pago se procesa en pesos chilenos (CLP) desde Chile y tu banco realiza la conversión a soles (PEN) según su tipo de cambio.`,
      categoria: "pagos",
    },
    {
      q: "¿El certificado sirve para buscar trabajo?",
      a: "Es un certificado digital de ProgramBI con código de verificación. Puedes agregarlo a LinkedIn y usarlo como respaldo de tu portafolio, junto con el proyecto final del curso.",
      categoria: "general",
    },
  ],
};

export default contenido;

/**
 * Bloque local de Perú: datos duros, FAQ y metadata de las siete rutas.
 * Los montos y el horario los resuelve `bloque.ts` desde la fuente única.
 */
export const bloqueLocal: DefinicionBloqueLocal = {
  iso: "pe",
  titulo: "Estudiar datos en vivo desde Perú",
  parrafos: [
    "Perú combina operaciones mineras y agroindustriales con un retail y una banca que crecen rápido. En esos sectores el reporte suele llegar tarde, en formatos distintos y sin una definición común de cada indicador. Tanto en el curso de Power BI en Perú como en los programas de SQL Server, Python y análisis de datos, la formación trabaja con la lógica de esas industrias: producción y costo por unidad, rendimiento por fundo, venta por tienda y cartera por zona.",
    "Las clases se siguen por Zoom en hora de Perú, sin viajar y sin instalar nada más que Power BI Desktop. El PDF de temario y precios incluye el valor referencial en soles (PEN) y el pago se realiza con tarjeta internacional vía Mercado Pago (procesado en CLP desde Chile) o transferencia internacional.",
    "Cada cohorte combina la sesión en vivo con trabajo entre clases: los ejercicios se resuelven sobre archivos de práctica y el proyecto final se presenta al grupo. Las grabaciones quedan en el campus para quienes trabajan en turnos o viajan, y la ficha del curso indica duración, nivel y requisitos antes de inscribirse.",
  ],
  empresas:
    "Para equipos en Perú, la capacitación in-company se arma con los datos de la empresa (ERP, comprobantes electrónicos, reportes de planta). Los ejercicios usan esos archivos y los casos de minería, agroexportación, retail o banca que el equipo reconoce en su día a día. Se dicta en vivo por Zoom, con grabaciones en el campus para quienes no pueden asistir a una sesión, y la cotización se emite en soles con factura corporativa; cada participante cierra el programa con su certificado y su código de verificación. La propuesta indica moneda, alcance y condiciones de facturación; el programa se cotiza aparte de los cursos abiertos.",
  notas: {
    precio:
      "El valor referencial en soles (PEN) y los descuentos vigentes están en el PDF de temario y precios del curso; el checkout muestra el total antes de pagar.",
    horario:
      "Perú no aplica horario de verano. En Chile la clase es de {horarioChile}; cuando Chile cambia de hora, la diferencia con Lima se mueve una hora. La ficha de la cohorte muestra la equivalencia exacta.",
    pago:
      "Pago con tarjeta internacional vía Mercado Pago (el cobro se procesa en CLP desde Chile y tu banco realiza la conversión a soles) o transferencia internacional coordinada con admisiones.",
    cuotas:
      "Disponibles en la pasarela según las condiciones de tu tarjeta y banco emisor, sin recargo por financiamiento.",
    "clase-gratis":
      "Clase gratis: coordínala por WhatsApp con el equipo de admisiones según tu disponibilidad.",
    certificado:
      "El certificado lleva código de verificación y se suma al campus virtual con las clases y material usado para practicar durante el curso. Es un certificado de ProgramBI, no la certificación oficial PL-300 de Microsoft.",
  },
  preguntas: [
    {
      q: "¿A qué hora son las clases en Perú y qué días?",
      a: "Las clases en vivo por Zoom son de {horario}, {horaLocal}, lunes y miércoles o martes y jueves según la cohorte. En Chile son de {horarioChile}. Perú no cambia de horario, así que la diferencia se ajusta cuando Chile entra o sale del horario de verano.",
    },
    {
      q: "¿Cuánto cuesta un curso en Perú y en qué moneda se paga?",
      a: "{resumenPrecios}",
    },
    {
      q: "¿Puedo pagar desde Perú con tarjeta o transferencia?",
      a: "Sí. Aceptamos tarjeta internacional vía Mercado Pago (el cobro se procesa en CLP desde Chile y tu banco realiza la conversión a soles) o transferencia internacional coordinada por WhatsApp. {notaPago}",
    },
    {
      q: "¿Hay cuotas sin interés para Perú?",
      a: "Sí: {cuotas} con tarjeta vía Mercado Pago, según la disponibilidad de tu banco emisor, sin recargo por financiamiento.",
    },
    {
      q: "¿Hay clase gratis antes de inscribirme?",
      a: "Sí. Puedes coordinar una clase gratis por WhatsApp antes de inscribirte para conocer nuestra metodología en vivo.",
    },
    {
      q: "¿Qué certificado recibo al terminar?",
      a: "Un certificado digital de ProgramBI con código de verificación y acceso al campus virtual con las clases y el material usado durante el curso. Es un certificado de la academia: la certificación PL-300 de Microsoft se rinde y se paga aparte.",
    },
  ],
  seo: {
    hub: {
      title: "Cursos de datos en vivo para Perú | ProgramBI",
      description:
        "Cursos en vivo por Zoom para Perú: análisis de datos, Power BI, SQL y Python. Horario de Lima, valor referencial en soles, 3 cuotas sin interés y certificado.",
    },
    cursos: {
      title: "Curso de Power BI y datos en vivo en Perú | ProgramBI",
      description:
        "Cursos en vivo de análisis de datos, Power BI, Excel, SQL, Python e IA en Perú: horario de Lima, valor referencial en soles, 3 cuotas sin interés y certificado.",
    },
    "power-bi": {
      title: "Curso de Power BI en Perú: en vivo y certificado | ProgramBI",
      description:
        "Curso de Power BI en Perú en vivo por Zoom: horario de Lima, valor referencial en soles (PEN), 3 cuotas sin interés, clase gratis y certificado digital de ProgramBI.",
    },
    "analisis-de-datos": {
      title: "Curso de Analista de Datos en Perú (en vivo, 60 h) | ProgramBI",
      description:
        "Curso de Analista de Datos en Perú en vivo: SQL Server, Power BI y Python, 60 horas por nivel en horario de Lima. Valor referencial en soles y certificado digital.",
    },
    python: {
      title: "Curso de Python para datos en vivo Perú | ProgramBI",
      description:
        "Curso Python para datos en vivo para Perú: Pandas, visualización y automatización. Horario de Lima, precio en soles y 3 cuotas sin interés.",
    },
    empresas: {
      title: "Capacitación Power BI para empresas Perú | ProgramBI",
      description:
        "Capacitación in-company en Perú: Power BI, SQL, Python y automatización con los datos de tu empresa. En vivo, con factura corporativa.",
    },
    precios: {
      title: "Precios de cursos en vivo en Perú | ProgramBI",
      description:
        "Precios de los cursos en vivo para Perú, publicados en soles: duración, qué incluye, medios de pago y 3 cuotas sin interés.",
    },
  },
};

const INTRO_FICHA_PE: Record<string, string[]> = {
  "power-bi": [
    "Este es un curso de Power BI en Perú, en vivo por Zoom, pensado para analistas, control de gestión, finanzas y operaciones que hoy consolidan reportes en Excel y necesitan construir tableros que se actualicen solos.",
    "El programa abierto de nivel básico-intermedio dura 20 horas en horario de Lima, con grabaciones en el campus virtual: parte desde cero con Power Query (lenguaje M), sigue con el modelo estrella y profundiza en medidas DAX. El nivel avanzado suma otras 20 horas con inteligencia de tiempo, seguridad a nivel de fila (RLS) e integración de IA en Power BI.",
    "Los valores referenciales para Perú en soles (PEN) se consultan en el PDF de temario y precios de esta ficha, con 3 cuotas sin interés y pago con tarjeta internacional vía Mercado Pago (cobro procesado en CLP desde Chile) o transferencia internacional. Si prefieres reforzar fórmulas y tablas dinámicas antes, revisa el curso de Excel para Perú; para capacitar a un equipo con factura corporativa, cotiza en la pestaña Empresas de esta ficha.",
  ],
};

export function getIntroFichaPe(slug: string): string[] | null {
  return INTRO_FICHA_PE[slug] ?? null;
}

