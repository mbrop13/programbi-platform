import type { ContenidoPais } from "./tipos";

const contenido: ContenidoPais = {
  iso: "pe",
  seo: {
    title: "Cursos de datos en vivo Perú | ProgramBI",
    description:
      "Cursos en vivo de análisis de datos, Power BI y SQL para profesionales de Perú. Clases por Zoom en horario de Lima y precios en soles.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en Perú | ProgramBI",
      description:
        "Catálogo en vivo para Perú: Power BI, SQL, Python y análisis de datos. Horario de Lima, precios en soles y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Perú | ProgramBI",
      description:
        "Horarios de Lima, pagos en soles con Yape o Plin, certificados y requisitos de los cursos en vivo de ProgramBI en Perú.",
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
    titulo: "Soles peruanos y pagos con Yape, Plin o tarjeta",
    resumen:
      "El catálogo de Perú se publica en soles (PEN): cada curso muestra su precio de lista y el monto que se cobra en la cohorte vigente.",
    nota: "El checkout procesa el pago con Mercado Pago y muestra tarjeta, Yape o Plin cuando están habilitados. Si la cuenta local no está disponible, informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Perú es habitual partir de los comprobantes electrónicos de SUNAT, los reportes de planta y las planillas de campo. El primer tablero suele unir producción y costo por unidad, o ventas por tienda y margen por categoría.",
    horario:
      "Perú se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano. La clase de 19:30 en Chile se ve a las 17:30 en Lima cuando Chile está en verano y a las 18:30 en invierno. La ficha de la cohorte muestra la equivalencia exacta.",
    facturacion:
      "Los cursos se pagan en soles con Mercado Pago Perú. Los proyectos in-company se cotizan aparte y la propuesta indica moneda, alcance y condiciones de facturación.",
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
      q: "¿Puedo pagar con Yape o Plin?",
      a: "Sí, cuando la cuenta de Mercado Pago de Perú está habilitada. También puedes pagar con tarjeta o coordinar una transferencia con el equipo de admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿Cómo se cobra si elijo pagar en soles?",
      a: "El catálogo de Perú se muestra en PEN y el checkout informa el monto antes de pagar. Si la cuenta local no está habilitada, aparece el equivalente en CLP para que confirmes con el valor a la vista.",
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
