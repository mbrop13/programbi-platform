import type { ContenidoPais } from "./tipos";
import type { DefinicionBloqueLocal } from "./bloque";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "es",
  seo: {
    title: "Cursos de Power BI, datos e IA en España | ProgramBI",
    description:
      "Formación online en Power BI, Excel, SQL, Python e IA para España: clases en directo y grabaciones HD en campus virtual. Precios directos en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos de Power BI, SQL y Python en España | ProgramBI",
      description:
        "Catálogo de formación online para España: Power BI, Excel, SQL Server, Python e IA. Cursos de 20 h y 60 h con grabaciones HD, precio en USD y certificado.",
    },
    faq: {
      title: "Preguntas frecuentes sobre cursos en España | ProgramBI",
      description:
        "Horario peninsular y de Canarias, acceso a grabaciones HD, factura internacional sin FUNDAE, RGPD, pago con tarjeta en USD y requisitos de ordenador.",
    },
    implementacion: {
      title: "Implantación de Power BI para empresas en España",
      description:
        "Cuadros de mando en Power BI con datos de Holded, Sage, A3ERP o Dynamics 365 y formación en horario CET/CEST. Alcance, plazos y presupuesto por escrito.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en pymes de España",
      description:
        "Pasa tus cierres de Excel, Holded, Sage o A3ERP a cuadros de mando automáticos en Power BI. Formación in-company para equipos en horario laboral español.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos de Power BI en España",
      description:
        "Gobierno del dato, adopción por el equipo y errores habituales al implantar Power BI en empresas españolas. Cuándo conviene formación abierta o in-company.",
    },
    nosotros: {
      title: "Sobre ProgramBI: formación de datos para España",
      description:
        "Academia especializada en analítica e IA para profesionales y empresas de España. Clases en directo desde Chile, campus con grabaciones HD e in-company CET.",
    },
  },
  hero: {
    h1: "Cursos de Power BI, análisis de datos e IA online para España",
    parrafo:
      "Formación práctica en Power BI, Excel, SQL Server, Python e IA con profesorado en activo desde Chile. Las cohortes abiertas incluyen sesiones en directo por Zoom y grabaciones en HD disponibles al instante en el campus virtual para seguirlo a tu ritmo; para empresas en España ofrecemos programas in-company en horario laboral peninsular (CET/CEST).",
    nota: "Clases en directo + grabaciones · Precio directo en USD · Certificado digital",
  },
  intro: {
    kicker: "Analítica aplicada al tejido empresarial español",
    titulo: "De hojas de cálculo manuales a cuadros de mando fiables",
    parrafos: [
      "En muchas pymes y departamentos financieros de España, el cierre mensual sigue dependiendo de exportar ficheros de Holded, Sage, A3ERP o Dynamics 365 Business Central y cruzarlos a mano en Excel. El problema no es la falta de datos, sino el tiempo que se pierde consolidando tablas cada semana y el riesgo de presentar cifras distintas según quién haya actualizado el libro.",
      "Nuestros cursos trabajan el flujo completo con casos propios del mercado español: series del INE, tipos del Banco de España, conjuntos de datos abiertos de datos.gob.es y obligaciones de reporting ligadas a la AEAT o al SEPE. Aprendes a limpiar datos, modelar relaciones y construir cuadros de mando que se actualizan solos y resisten la revisión de dirección.",
      "Conviene ser transparentes con el huso horario: las cohortes abiertas se imparten de 19:30 a 21:30 hora de Chile (23:30–01:30 CET en invierno europeo y 01:30–03:30 CEST en verano; una hora menos en Canarias). Por eso, la mayoría de alumnos en España sigue las clases mediante las grabaciones en HD en el campus virtual y resuelve dudas con el docente en el campus. Si buscas formación en directo durante la jornada laboral española, nuestros programas in-company en /es/empresas se adaptan al 100 % a horario CET/CEST.",
    ],
  },
  casos: [
    {
      sector: "Banca y seguros",
      titulo: "Control de cartera, morosidad y solvencia en Madrid y Bilbao",
      descripcion:
        "Seguimiento diario de riesgo de crédito, tasa de mora por segmento, siniestralidad de pólizas y cumplimiento de márgenes financieros con series macroeconómicas de referencia.",
      fuente:
        "Extractos de core bancario, pólizas de seguros, contabilidad analítica y series del Banco de España.",
    },
    {
      sector: "Turismo y hostelería",
      titulo: "Ocupación, RevPAR y estacionalidad por destino",
      descripcion:
        "Comparativa de ocupación, ADR, RevPAR y coste de plantilla por establecimiento en Baleares, Canarias, Costa del Sol y Cataluña para ajustar tarifas entre temporada alta y baja.",
      fuente:
        "PMS hotelero, motores de reservas, agencias online (OTAs), nóminas y coyuntura turística del INE.",
    },
    {
      sector: "Retail, moda y e-commerce",
      titulo: "Rotación de tallas, stock omnicanal y margen neto",
      descripcion:
        "Control de sell-through por colección, roturas de stock entre tienda física y canal online, devoluciones y margen por SKU en centros logísticos de Madrid, Barcelona o A Coruña.",
      fuente:
        "TPV de tienda, plataformas e-commerce, ERP comercial, inventario de almacén y campañas de marketing.",
    },
    {
      sector: "Energía y renovables",
      titulo: "Generación, curvas de carga y liquidación en mercado",
      descripcion:
        "Seguimiento de producción fotovoltaica y eólica por planta, desvíos frente a previsión, disponibilidad de activos y márgenes de comercialización frente al precio horario.",
      fuente:
        "Lecturas SCADA, contadores inteligentes, precios horarios de OMIE y registros de mantenimiento.",
    },
    {
      sector: "Logística y puertos",
      titulo: "Tiempos de tránsito, ocupación de muelles y coste por envío",
      descripcion:
        "Control de expediciones, puntualidad de entrega, ocupación de almacén y rentabilidad por ruta en corredores intermodales de Valencia, Algeciras, Barcelona y Zaragoza.",
      fuente:
        "TMS, SGA de almacén, albaranes de transporte, ficheros de aduanas y facturación de operadores.",
    },
    {
      sector: "Consultoría y control de gestión en pymes",
      titulo: "Cuenta de resultados, tesorería y fiscalidad automatizada",
      descripcion:
        "Consolidación de balances, desviaciones presupuestarias, previsión de tesorería y control de IVA e IRPF sin depender de hojas de cálculo frágiles al cierre trimestral.",
      fuente:
        "Exportaciones de Holded, Sage, A3ERP, Dynamics 365 Business Central y libros registro de la AEAT.",
    },
  ],
  referencias: [
    {
      nombre: "INE (Instituto Nacional de Estadística)",
      detalle:
        "IPC, Encuesta de Población Activa, ocupación hotelera y cifras de negocio por comunidad autónoma para contextualizar demanda y costes.",
    },
    {
      nombre: "Banco de España",
      detalle:
        "Tipos de interés oficiales, estadísticas de crédito, morosidad y balanza de pagos listas para cruzar con modelos financieros.",
    },
    {
      nombre: "datos.gob.es",
      detalle:
        "Catálogo nacional de datos abiertos de administraciones públicas en CSV y JSON para practicar limpieza y modelado real.",
    },
    {
      nombre: "Agencia Tributaria (AEAT) / SEPE",
      detalle:
        "Estadísticas fiscales, estructura de declaraciones y datos de contratación laboral útiles en análisis financiero y de RR. HH.",
    },
  ],
  moneda: {
    titulo: "Precios directos en USD y pago internacional",
    resumen:
      "El catálogo para España muestra el precio final en dólares (USD) directamente en la ficha de cada curso, sin formularios previos ni precios tachados.",
    nota: "Pago único con tarjeta internacional Visa/Mastercard o transferencia bancaria internacional para empresas. ProgramBI SPA opera desde Chile: los cursos no son bonificables por FUNDAE, pero emitimos factura o recibo corporativo internacional en USD válido como gasto deducible de formación.",
  },
  mercado: {
    ejemplo:
      "En una pyme española el punto de partida habitual es exportar facturas de Holded, Sage, A3ERP o Dynamics 365 Business Central y cruzarlas en Excel con la previsión de tesorería. Un primer cuadro de mando en Power BI unifica ventas, margen y cobros pendientes para todo el equipo de dirección.",
    horario:
      "Las cohortes abiertas se dictan de 19:30 a 21:30 hora de Chile, lo que equivale a 23:30–01:30 CET en invierno europeo y 01:30–03:30 CEST en verano (una hora menos en Canarias). Todas las sesiones quedan grabadas en HD en el campus virtual para verlas a tu ritmo, mientras que la formación in-company se imparte 100 % en horario laboral español (CET/CEST).",
    facturacion:
      "Las inscripciones individuales se abonan en un pago único en USD con tarjeta internacional. Para empresas en España aceptamos tarjeta corporativa o transferencia internacional y emitimos factura internacional en USD. Los cursos no son bonificables mediante FUNDAE.",
  },
  nosotros: {
    parrafo:
      "ProgramBI SPA es una academia especializada en Power BI, SQL, Python e inteligencia artificial aplicada a negocio que opera desde Santiago de Chile para profesionales y empresas de España y América. Las cohortes abiertas combinan clases en directo por Zoom con grabaciones en HD en el campus virtual y soporte docente; los programas in-company para equipos españoles se programan íntegramente en jornada laboral CET/CEST.",
  },
  faqs: [
    {
      q: "¿Cuánto cuesta un curso y qué duración tiene?",
      a: `${resumenPreciosCatalogo("es")} Los cursos individuales tienen una duración de 20 horas lectivas y el programa completo de Análisis de datos (SQL Server, Power BI y Python) es de 60 horas por nivel. El precio se muestra directamente en la ficha, sin formularios previos.`,
      categoria: "pagos",
    },
    {
      q: "¿A qué hora son las clases en España peninsular y en Canarias?",
      a: "Las cohortes abiertas se imparten en directo desde Chile de 19:30 a 21:30 (hora chilena), lo que corresponde a 23:30–01:30 CET en invierno europeo y 01:30–03:30 CEST en verano en la Península y Baleares (una hora menos en Canarias: 22:30–00:30 WET o 00:30–02:30 WEST). Como es horario nocturno en España, todas las sesiones quedan grabadas en HD en el campus virtual nada más terminar para que las sigas a tu ritmo con soporte del profesor.",
      categoria: "cursos",
    },
    {
      q: "¿Los cursos son bonificables por FUNDAE?",
      a: "No. ProgramBI SPA es una entidad radicada en Chile y nuestra formación no está acreditada ni es bonificable a través de FUNDAE. Sin embargo, emitimos factura o recibo corporativo internacional en USD con el detalle del temario y las horas para que tu empresa pueda registrarlo como gasto deducible de formación.",
      categoria: "pagos",
    },
    {
      q: "¿Cómo se realiza el pago desde España?",
      a: "Mediante pago único en dólares (USD) con tarjeta de crédito o débito internacional (Visa o Mastercard). Para inscripciones de empresa también habilitamos transferencia bancaria internacional. Tu entidad bancaria aplicará su tipo de cambio habitual a euros.",
      categoria: "pagos",
    },
    {
      q: "¿Cómo tratáis la privacidad y el cumplimiento del RGPD y la LOPDGDD?",
      a: "En los cursos abiertos trabajamos exclusivamente con conjuntos de datos sintéticos y fuentes públicas como el INE, el Banco de España o datos.gob.es. Nunca pedimos subir datos reales de clientes o empleados. En proyectos in-company aplicamos acuerdos de confidencialidad y pautas de anonimización de DNI/NIE y nóminas conformes al RGPD y la LOPDGDD.",
      categoria: "general",
    },
    {
      q: "¿El curso de Power BI prepara para la certificación oficial Microsoft PL-300?",
      a: "Sí, el temario de Power BI cubre los bloques principales del examen PL-300 (Power BI Data Analyst): modelado en estrella, Power Query (M), medidas DAX y visualización. El examen oficial se contrata y se rinde por separado directamente en Microsoft Learn / Pearson VUE.",
      categoria: "cursos",
    },
    {
      q: "¿Qué ordenador necesito y funciona en Mac?",
      a: "Necesitas un ordenador con conexión a internet. SQL Server y Power BI Desktop están diseñados de forma nativa para Windows; si utilizas Mac, en el campus te indicamos cómo trabajar mediante máquina virtual (Parallels, UTM) o entorno en la nube. Python, Excel y los cursos de IA funcionan tanto en Windows como en macOS.",
      categoria: "cursos",
    },
    {
      q: "¿Qué ocurre si no puedo conectarme al directo por la diferencia horaria?",
      a: "No pierdes ninguna clase. Las grabaciones en HD, los ficheros de práctica y los scripts están disponibles en el campus virtual durante todo el programa, y puedes dejar tus consultas al profesorado en los canales del campus para recibir respuesta.",
      categoria: "cursos",
    },
    {
      q: "¿Ofrecéis formación in-company en horario laboral español?",
      a: "Sí. En la modalidad para empresas (/es/empresas) diseñamos programas cerrados para tu equipo que se imparten en directo en horario laboral de España (CET/CEST), adaptados a vuestros propios sistemas como Holded, Sage, A3ERP, Dynamics 365 o SAP.",
      categoria: "general",
    },
    {
      q: "¿Qué certificado se entrega al finalizar?",
      a: "Al completar el curso obtienes un certificado digital verificable emitido por ProgramBI SPA con el desglose de horas y competencias cursadas. Es un título propio de formación privada, no un título universitario oficial ni una certificación de fabricante.",
      categoria: "general",
    },
    {
      q: "¿Es necesario saber programar antes de empezar?",
      a: "No. Tanto Power BI como Excel y SQL Server empiezan desde cero. En el caso de Python para análisis de datos, no hace falta experiencia previa en desarrollo, aunque conviene manejar hojas de cálculo con soltura.",
      categoria: "general",
    },
  ],
};

export default contenido;

/**
 * Bloque local de España: datos duros, FAQ y metadata de las siete rutas.
 * Los montos y el horario los resuelve `bloque.ts` desde la fuente única.
 * Asume que `es` existe en `config/paises.ts` (USD, es-ES, Europe/Madrid).
 */
export const bloqueLocal: DefinicionBloqueLocal = {
  iso: "es",
  titulo: "Formación online en datos e IA desde España",
  parrafos: [
    "Si trabajas en Madrid, Barcelona, Valencia, Bilbao o cualquier punto de España y quieres dominar Power BI, SQL, Python o IA aplicada a negocio sin depender de vídeos genéricos, aquí trabajas sobre casos reales de empresa: cuadros de mando financieros, rotación en retail, ocupación turística y exportaciones de Holded, Sage, A3ERP o Dynamics 365.",
    "Las cohortes abiertas se dictan en directo desde Chile a las {horarioChile} ({horaLocal}, una hora menos en Canarias). Como coincide con la noche en España, todas las sesiones quedan grabadas en HD en el campus virtual con los ficheros de práctica y soporte docente para que avances a tu ritmo. Si buscas clases en directo durante tu jornada laboral, la modalidad in-company se programa 100 % en horario CET/CEST.",
    "Los precios se publican directamente en dólares (USD), sin formularios previos ni descuentos ficticios, y se abonan en un pago único con tarjeta internacional. ProgramBI SPA opera desde Chile, por lo que los cursos no son bonificables por FUNDAE, aunque entregamos factura corporativa internacional en USD válida como gasto deducible de formación.",
  ],
  empresas:
    "Para equipos en España, la capacitación in-company se imparte en directo en horario laboral peninsular (CET/CEST), con vuestros propios datos y ERPs (Holded, Sage, A3ERP, Dynamics 365 Business Central o SAP). Entregamos propuesta cerrada en USD, factura internacional para gasto deducible y reporte de asistencia; no aplica bonificación FUNDAE.",
  notas: {
    precio:
      "Precio directo publicado en dólares (USD) en cada ficha, sin formularios previos ni precios tachados. El importe final aparece antes de confirmar el pago.",
    horario:
      "Las cohortes abiertas son de {horarioChile} en Chile ({horario} en España peninsular; 1 h menos en Canarias). Incluye grabaciones HD en el campus virtual. La formación in-company se adapta al horario laboral español (CET/CEST).",
    pago:
      "Pago único en USD con tarjeta internacional (Visa o Mastercard) o transferencia internacional para empresas. Tu banco aplica el cambio a euros según sus condiciones.",
    cuotas:
      "En España la inscripción individual se realiza en un único cargo con tarjeta internacional, sin fraccionamiento en cuotas sin interés.",
    "clase-gratis":
      "Sesión abierta por Zoom sin coste ni registro previo. Se anuncia cuando hay fecha confirmada indicando la equivalencia horaria en España y el acceso posterior a la grabación.",
    certificado:
      "Certificado digital verificable emitido por ProgramBI SPA y acceso al campus virtual con grabaciones HD. Formación privada no bonificable por FUNDAE; en Power BI el temario está alineado con el examen oficial PL-300.",
  },
  preguntas: [
    {
      q: "¿A qué hora son las clases en España y qué pasa si no puedo conectarme en directo?",
      a: "Las cohortes abiertas se dictan a las {horarioChile} en Chile, lo que equivale a {horario} ({horaLocal}; 1 h menos en Canarias). Todas las sesiones quedan grabadas en HD en el campus virtual junto con los archivos y soporte del profesor para cursarlas cómodamente al día siguiente. Para grupos de empresa, el horario in-company es 100 % jornada laboral CET/CEST.",
    },
    {
      q: "¿Cuánto cuestan los cursos en España?",
      a: "{resumenPrecios}",
    },
    {
      q: "¿Cómo se paga desde España y en qué moneda?",
      a: "El precio está fijado en dólares (USD) y se abona en un pago único con tarjeta internacional Visa o Mastercard (o transferencia internacional en empresas). {notaPago}",
    },
    {
      q: "¿Se pueden bonificar los cursos por FUNDAE?",
      a: "No. Al ser ProgramBI SPA una entidad chilena, los cursos no son bonificables mediante FUNDAE. No obstante, emitimos factura corporativa internacional en USD con desglose de temario y horas para que la empresa pueda deducirlo como gasto de formación.",
    },
    {
      q: "¿Qué software y fuentes de datos se trabajan?",
      a: "Trabajamos con Power BI Desktop, SQL Server, Python (Pandas, Matplotlib, Seaborn, Plotly), Excel e IA aplicada sobre escenarios españoles: Holded, Sage, A3ERP, Dynamics 365, además de fuentes públicas como el INE, el Banco de España, datos.gob.es y la AEAT.",
    },
    {
      q: "¿El certificado sirve en España y prepara para el PL-300?",
      a: "Recibes un certificado digital propio de ProgramBI SPA con código de verificación que acredita las horas y contenidos completados. Además, el curso de Power BI cubre las competencias evaluadas en el examen oficial Microsoft PL-300, que se rinde por separado.",
    },
  ],
  seo: {
    hub: {
      title: "Cursos de Power BI, datos e IA en España | ProgramBI",
      description:
        "Formación online en Power BI, Excel, SQL, Python e IA para España. Clases en directo y grabaciones HD en campus virtual. Precios directos en USD.",
    },
    cursos: {
      title: "Catálogo de cursos de datos en España | ProgramBI",
      description:
        "Cursos de Power BI, SQL Server, Python, Excel e IA para profesionales en España. 20 h y 60 h con grabaciones HD, precio en USD y certificado digital.",
    },
    "power-bi": {
      title: "Curso de Power BI online para España | ProgramBI",
      description:
        "Aprende Power Query, modelado en estrella y DAX en 20 horas desde España. Directos + grabaciones HD, alineado con PL-300 y precio directo de $249 USD.",
    },
    "analisis-de-datos": {
      title: "Curso de Análisis de Datos online en España | ProgramBI",
      description:
        "Programa de 60 horas para España: SQL Server, Power BI y Python con casos de finanzas, retail y logística. Campus con grabaciones HD por $498 USD.",
    },
    python: {
      title: "Curso de Python para análisis de datos en España",
      description:
        "Curso práctico de Python en España: Pandas, limpieza de datos, visualización y automatización en 20 horas. Grabaciones HD y precio directo de $249 USD.",
    },
    empresas: {
      title: "Formación Power BI in-company en España | ProgramBI",
      description:
        "Cursos de Power BI, SQL, Python e IA para empresas en España en horario CET/CEST. Con datos de Holded, Sage o Dynamics 365 y factura internacional.",
    },
    precios: {
      title: "Precios de cursos de datos para España | ProgramBI",
      description:
        "Tarifas transparentes en USD para España: $249 USD en cursos de 20 h y $498 USD en programas de 60 h. Pago con tarjeta internacional, sin FUNDAE.",
    },
  },
};
