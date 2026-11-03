import type { ContenidoPais } from "./tipos";

const contenido: ContenidoPais = {
  iso: "ar",
  seo: {
    title: "Cursos de datos en vivo Argentina | ProgramBI",
    description:
      "Cursos en vivo de análisis de datos, Power BI y SQL para profesionales de Argentina. Clases por Zoom en horario de Buenos Aires y precios en ARS.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en Argentina | ProgramBI",
      description:
        "Catálogo en vivo para Argentina: Power BI, SQL, Python y análisis de datos. Horario de Buenos Aires, precios en ARS y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en Argentina | ProgramBI",
      description:
        "Horarios de Buenos Aires, pagos en ARS con Mercado Pago, certificados y requisitos de los cursos en vivo de ProgramBI en Argentina.",
    },
    implementacion: {
      title: "Implementación Power BI en Argentina | ProgramBI",
      description:
        "Tableros Power BI con datos de tu área y capacitación del equipo en Argentina. Diagnóstico por WhatsApp y propuesta con alcance y moneda.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en Argentina | ProgramBI",
      description:
        "De planillas de cierre a tableros Power BI en Argentina. Curso abierto o proyecto in-company con los datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en Argentina | ProgramBI",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto Power BI en Argentina y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Argentina",
      description:
        "Quiénes somos, cómo se dictan las clases en horario de Buenos Aires y qué encuentra un profesional argentino en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Argentina",
    parrafo:
      "Academia de datos en vivo por Zoom, en horario de Buenos Aires: análisis de datos, Power BI y Power Automate, con precios en pesos argentinos.",
    nota: "Clases en vivo · Horario de Buenos Aires · Precios en ARS",
  },
  intro: {
    kicker: "Datos para la economía argentina",
    titulo: "Del Excel de todos los días al tablero que se usa en la reunión",
    parrafos: [
      "En Argentina el dato suele estar repartido entre la facturación electrónica, el ERP, las planillas de campo y algún archivo que finanzas arma a mano. El problema no es la falta de información: es que cada área llega a la reunión con una versión distinta del mismo número.",
      "El recorrido arranca en Excel, sigue en SQL y termina en Power BI. Los ejercicios usan escenarios de agro, fintech, retail e industria, y contemplan lo que mueve el número en el mercado local: inflación, actualización de precios, cierre de mes y tipo de cambio. No se pide experiencia en programación.",
    ],
  },
  casos: [
    {
      sector: "Agro y exportación",
      titulo: "Costos por campaña y margen por lote",
      descripcion:
        "Cruzar rindes, insumos, fletes y precios FOB para ver el margen real de cada lote antes de cerrar la campaña.",
      fuente: "Facturación electrónica, planillas de campo y precios de exportación.",
    },
    {
      sector: "Fintech y servicios financieros",
      titulo: "Cartera, mora y originación",
      descripcion:
        "Un tablero de cartera por producto, canal y segmento para detectar dónde se concentra la mora y qué campañas convierten.",
      fuente: "Registros de pasarelas de pago, comprobantes y bases de cobranza.",
    },
    {
      sector: "Retail y e-commerce",
      titulo: "Venta por canal y margen por categoría",
      descripcion:
        "Unificar tienda física, e-commerce y marketplaces para comparar sell-out, devoluciones y margen con la misma regla.",
      fuente: "Órdenes de venta, stock, facturación y reportes de marketplaces.",
    },
    {
      sector: "Industria y energía",
      titulo: "Producción, paradas y costo por planta",
      descripcion:
        "Seguir paradas, consumos y costos por planta para priorizar mantenimiento con datos y no con urgencias.",
      fuente: "ERP, sistemas de producción y órdenes de trabajo.",
    },
  ],
  referencias: [
    {
      nombre: "ARCA (ex AFIP)",
      detalle: "Comprobantes, facturación electrónica y datos fiscales que alimentan ventas y compras.",
    },
    {
      nombre: "INDEC",
      detalle: "Precios, actividad y comercio exterior para contextualizar los tableros de negocio.",
    },
    {
      nombre: "BCRA",
      detalle: "Tipo de cambio, tasas y agregados monetarios para leer el efecto de la macro.",
    },
    {
      nombre: "Mercado Pago y bancos",
      detalle: "Cobros, conciliación y medios de pago usados por el comercio argentino.",
    },
  ],
  moneda: {
    titulo: "Pesos argentinos y pago con Mercado Pago",
    resumen:
      "El catálogo de Argentina se publica en pesos argentinos (ARS): cada ficha muestra el valor de lista y el precio vigente del curso.",
    nota: "El checkout procesa el pago con Mercado Pago. Si la cuenta local no está habilitada, antes de confirmar muestra el equivalente en pesos chilenos (CLP).",
  },
  mercado: {
    ejemplo:
      "Una empresa argentina típica llega con las ventas en el ERP, los comprobantes de ARCA y una planilla de tesorería para seguir el tipo de cambio. El primer tablero útil cruza ventas y margen por canal y se actualiza sin depender de un cierre manual.",
    horario:
      "Argentina usa UTC-3 todo el año. Chile pasa a UTC-3 en verano y UTC-4 en invierno, así que la clase de 19:30 en Chile se ve a las 19:30 o a las 20:30 en Buenos Aires. La ficha de la cohorte muestra la conversión exacta.",
    facturacion:
      "Los cursos se pagan en pesos argentinos por Mercado Pago. Los proyectos in-company se cotizan aparte; la propuesta indica alcance, moneda y condiciones de facturación.",
  },
  nosotros: {
    parrafo:
      "ProgramBI acompaña a profesionales argentinos que hoy reportan en Excel y necesitan ordenar datos de ARCA, del ERP y de tesorería en un mismo modelo. Las clases se siguen en horario de Buenos Aires y quedan grabadas en el campus para volver cuando haga falta.",
  },
  faqs: [
    {
      q: "¿Los cursos sirven si trabajo en una pyme argentina?",
      a: "Sí. Los ejercicios parten de problemas frecuentes en pymes y áreas de finanzas, operaciones y comercial: ventas, costos, stock, cobranzas y reportes de gestión. No necesitas un área de datos armada para aplicarlos.",
      categoria: "general",
    },
    {
      q: "¿Cómo se sigue la clase desde Buenos Aires?",
      a: "La clase se dicta desde Chile por Zoom y se muestra convertida a la hora de Buenos Aires. Argentina mantiene UTC-3 todo el año; Chile cambia en verano, por eso la equivalencia puede variar una hora según la fecha. La ficha de la cohorte indica el horario exacto.",
      categoria: "cursos",
    },
    {
      q: "¿Los ejemplos contemplan inflación y tipo de cambio?",
      a: "Sí. Los escenarios de práctica incluyen actualización de precios y conversión de moneda, para que el tablero no quede atado a un único valor del dólar. Se practica cómo dejar esas variables como parámetros del modelo, no una regla contable.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo pagar en cuotas?",
      a: "Sí. Mercado Pago permite pagar con tarjeta de crédito en las cuotas que habilite tu banco. También puedes coordinar una transferencia escribiendo al equipo de admisiones.",
      categoria: "pagos",
    },
    {
      q: "¿El precio final está en pesos argentinos?",
      a: "El catálogo de Argentina se muestra en ARS y el checkout confirma el monto antes de pagar. Si la cuenta local de Mercado Pago no está habilitada, el checkout informa el equivalente en CLP para que la decisión sea con el número a la vista.",
      categoria: "pagos",
    },
    {
      q: "¿Qué certificado recibo?",
      a: "Un certificado digital de ProgramBI al completar el proyecto final, con código de verificación para adjuntar a LinkedIn o presentar en una búsqueda laboral.",
      categoria: "general",
    },
  ],
};

export default contenido;
