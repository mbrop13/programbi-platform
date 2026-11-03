import type { ContenidoPais } from "./tipos";

const contenido: ContenidoPais = {
  iso: "mx",
  seo: {
    title: "Cursos de datos en vivo México | ProgramBI",
    description:
      "Formación en vivo de Power BI, análisis de datos y Python para profesionales de México. Clases por Zoom en horario de CDMX y precios en MXN.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, SQL y datos en México | ProgramBI",
      description:
        "Catálogo en vivo para México: Power BI, SQL, Python y análisis de datos. Horario de Ciudad de México, precios en MXN y proyecto final.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en México | ProgramBI",
      description:
        "Horarios de CDMX, pagos en MXN con SPEI u OXXO, certificados y requisitos de los cursos en vivo de ProgramBI en México.",
    },
    implementacion: {
      title: "Implementación Power BI en México | ProgramBI",
      description:
        "Tableros Power BI con datos de planta, retail o finanzas y capacitación del equipo en México. Diagnóstico y propuesta con alcance.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en México | ProgramBI",
      description:
        "De reportes de tienda y ERP a tableros Power BI en México. Curso abierto o proyecto in-company con los datos de tu área.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en México | ProgramBI",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto Power BI en México y cuándo conviene curso, consultora o Pack.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de México",
      description:
        "Quiénes somos, cómo se dictan las clases en horario de Ciudad de México y qué encuentra un profesional mexicano en el campus.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para México",
    parrafo:
      "Formación en vivo por Zoom, en horario de Ciudad de México: Power BI, SQL Server y Python aplicados a manufactura, retail y servicios.",
    nota: "Clases en vivo · Horario de Ciudad de México · Precios en MXN",
  },
  intro: {
    kicker: "Datos para operaciones en México",
    titulo: "Una sola cifra para la planta, la tienda y la dirección",
    parrafos: [
      "En México el dato convive con el CFDI, el ERP, los puntos de venta y las plataformas de e-commerce. El desafío no es generar más reportes, sino que producción, retail y finanzas miren la misma cifra y sepan de dónde sale.",
      "La práctica sigue el flujo de una operación mexicana: extraer del sistema, limpiar la tabla, modelar en Power BI y publicar. Los escenarios vienen de manufactura y nearshoring, retail, logística y servicios financieros. La clase se sigue en horario de Ciudad de México y no exige saber programar de antemano.",
    ],
  },
  casos: [
    {
      sector: "Manufactura y nearshoring",
      titulo: "OEE, inventario y costo por turno",
      descripcion:
        "Medir disponibilidad, rendimiento y calidad por línea y por turno para ver dónde se pierde capacidad y qué corregir primero.",
      fuente: "ERP/MES, registros de producción y CFDI.",
    },
    {
      sector: "Retail y consumo",
      titulo: "Sell-out por tienda y categoría",
      descripcion:
        "Comparar venta, inventario y margen por tienda, canal y categoría para decidir surtido, reposición y promociones.",
      fuente: "Punto de venta, inventarios y facturación electrónica.",
    },
    {
      sector: "Fintech y banca",
      titulo: "Cartera, cobranza y señales de fraude",
      descripcion:
        "Segmentar cartera por producto y región, y revisar transacciones para detectar patrones fuera de lo habitual.",
      fuente: "Registros de SPEI, pasarelas de pago y bases de cobranza.",
    },
    {
      sector: "Logística y comercio exterior",
      titulo: "Nivel de servicio y costo por ruta",
      descripcion:
        "Cruzar entregas, tiempos y costo por ruta para encontrar dónde se rompe el servicio al cliente.",
      fuente: "TMS, rastreo, pedimentos y facturación.",
    },
  ],
  referencias: [
    {
      nombre: "SAT",
      detalle: "CFDI, facturación electrónica y obligaciones fiscales que ordenan ventas y compras.",
    },
    {
      nombre: "INEGI",
      detalle: "Actividad económica, precios y demografía para contextualizar el mercado.",
    },
    {
      nombre: "Banxico",
      detalle: "Tipo de cambio, tasas e inflación para leer el efecto en costos y márgenes.",
    },
    {
      nombre: "E-commerce y marketplaces",
      detalle: "Órdenes, devoluciones y sell-out de los canales digitales.",
    },
  ],
  moneda: {
    titulo: "Pesos mexicanos y pagos con SPEI u OXXO",
    resumen:
      "El catálogo de México se muestra en pesos mexicanos (MXN): la ficha de cada curso separa el precio de lista del precio vigente.",
    nota: "El pago se procesa con Mercado Pago y el checkout ofrece tarjeta, SPEI, OXXO o wallet cuando están disponibles. Si la cuenta local no está habilitada, muestra el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En México el punto de partida suele ser el CFDI, el ERP y los reportes de tienda. Un primer tablero útil cruza ventas por sucursal con inventario y margen, y deja de lado la discusión sobre qué archivo tiene la cifra buena.",
    horario:
      "México dejó el horario de verano en la mayor parte del país y Chile sí lo aplica. Por eso la clase de 19:30 en Chile se ve a las 16:30 o a las 17:30 en Ciudad de México según la época. La ficha muestra la hora exacta de tu cohorte.",
    facturacion:
      "Los cursos se pagan en pesos mexicanos con Mercado Pago México. Los proyectos in-company se cotizan por separado, con alcance y moneda en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a equipos mexicanos de manufactura, retail y logística que necesitan una sola cifra entre la planta, la tienda y la dirección. La formación se dicta desde Chile y se sigue en horario de Ciudad de México, con las grabaciones disponibles en el campus.",
  },
  faqs: [
    {
      q: "¿Sirve para alguien que trabaja en una planta o en operaciones?",
      a: "Sí. Los ejemplos de manufactura y logística están pensados para supervisores, analistas de producción y responsables de costos que necesitan explicar qué pasó en el turno con datos, no con impresiones.",
      categoria: "general",
    },
    {
      q: "¿A qué hora se ve la clase desde México?",
      a: "La sesión se dicta desde Chile y se muestra en horario de Ciudad de México. Como México ya no cambia la hora en la mayor parte del país, la equivalencia depende del horario de verano chileno: la ficha de la cohorte indica la hora exacta.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo tomar el curso si mi empresa usa Excel y un ERP antiguo?",
      a: "Sí. Justamente esos son los escenarios habituales: datos que vienen de un ERP, planillas paralelas y reportes que nadie puede auditar. Aprendes a integrarlos y a dejar una versión confiable.",
      categoria: "cursos",
    },
    {
      q: "¿Qué medios de pago aceptan?",
      a: "Mercado Pago con tarjeta de crédito o débito, SPEI, OXXO y Mercado Pago Wallet, según lo disponible en tu cuenta. Si prefieres transferencia, el equipo de admisiones coordina el detalle.",
      categoria: "pagos",
    },
    {
      q: "¿Cómo se confirma el precio en pesos mexicanos?",
      a: "El catálogo de México se muestra en MXN y el checkout presenta el monto final antes de pagar. Si la cuenta local de Mercado Pago no está habilitada, se informa el equivalente en CLP para comparar antes de confirmar.",
      categoria: "pagos",
    },
    {
      q: "¿Qué incluye el curso además de las clases?",
      a: "Grabaciones de por vida, sets de datos, plantillas de Power BI, el proyecto final y un certificado digital con código de verificación.",
      categoria: "general",
    },
  ],
};

export default contenido;
