import type { ContenidoPais } from "./tipos";
import type { DefinicionBloqueLocal } from "./bloque";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "us",
  seo: {
    title: "Cursos de datos en español en EE.UU. | ProgramBI",
    description:
      "Cursos en vivo de Power BI, Excel, SQL, Python e IA en español para profesionales en Estados Unidos. Clases por Zoom en horario de la tarde del Este y precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos de Power BI y Excel en español | EE.UU.",
      description:
        "Catálogo en vivo en español para Estados Unidos: Power BI, Excel, SQL, Python e IA. Cursos de 20 horas, horario ET, precios en USD y certificado digital.",
    },
    faq: {
      title: "Preguntas sobre cursos en español en EE.UU.",
      description:
        "Hora de las clases en ET, CT y PT, reembolso del empleador, certificado, idioma del software y pago con tarjeta en USD para alumnos en Estados Unidos.",
    },
    implementacion: {
      title: "Implementación Power BI en español para EE.UU.",
      description:
        "Tableros Power BI con los datos de tu empresa en Estados Unidos y capacitación del equipo en español. Diagnóstico y propuesta con alcance por escrito.",
    },
    migrar: {
      title: "De Excel a Power BI en español, empresas de EE.UU.",
      description:
        "Pasa los reportes de QuickBooks, Salesforce o ADP en Excel a tableros Power BI. Capacitación en español para equipos en Estados Unidos, con tus datos.",
    },
    porQueFallan: {
      title: "Por qué fallan los proyectos de Power BI en EE.UU.",
      description:
        "Adopción antes que dashboard: qué revisar en un proyecto de Power BI en una empresa de Estados Unidos y cuándo conviene un curso en español o un in-company.",
    },
    nosotros: {
      title: "Academia de datos en español para EE.UU.",
      description:
        "Quiénes somos, cómo se dictan las clases en vivo en horario del Este y qué encuentra un profesional hispanohablante en EE.UU. en el campus virtual.",
    },
  },
  hero: {
    h1: "Cursos de datos e IA en vivo y en español para profesionales en Estados Unidos",
    parrafo:
      "Power BI, Excel, SQL, Python e IA con profesor real por Zoom. La clase empieza al salir del trabajo en Miami y Nueva York; el software y los términos se enseñan en inglés, tal como los usas en la oficina.",
    nota: "Clases en vivo · Tarde en Miami (ET) · Precios en USD",
  },
  intro: {
    kicker: "Datos para equipos hispanohablantes en EE.UU.",
    titulo: "Aprende en español lo que tu empresa te pide en inglés",
    parrafos: [
      "Muchos profesionales en Estados Unidos ya piensan en español pero entregan reportes en inglés: dashboards, payroll, cuentas por cobrar, inventario. El obstáculo rara vez es la capacidad; suele ser que el curso disponible o está en inglés a un ritmo difícil de seguir, o es un video grabado sin nadie a quien preguntar.",
      "Aquí la explicación es en español y la herramienta se ve como en tu trabajo: menús de Power BI, funciones de Excel y consultas SQL en inglés, con el vocabulario técnico que vas a usar con tu jefe o tu cliente. Los ejercicios parten de lo que se encuentra en una empresa estadounidense: exportaciones de QuickBooks o NetSuite, reportes de Salesforce o ADP, y datos públicos del Census Bureau, el BLS y FRED.",
      "Las sesiones son de 2 horas y caen entre las 17:30 y las 19:30 hora del Este, según la época del año; una hora antes en Central y tres antes en Pacífico. No exige saber programar. Si tu empresa tiene un programa de asistencia educativa, la academia entrega recibo en USD y la descripción del curso para que la solicites.",
    ],
  },
  casos: [
    {
      sector: "Logística y comercio exterior",
      titulo: "Tiempos de tránsito y costo por contenedor",
      descripcion:
        "Seguir embarques que pasan por el puerto o el aeropuerto de Miami: demoras en aduana, costo por contenedor o kilo y cumplimiento de cada transportista, para saber dónde se pierde tiempo y dinero.",
      fuente: "TMS, hojas de los agentes de carga, órdenes de compra y facturas en QuickBooks o NetSuite.",
    },
    {
      sector: "Hotelería y turismo",
      titulo: "Ocupación, tarifa promedio y RevPAR",
      descripcion:
        "Comparar ocupación, tarifa diaria y RevPAR por propiedad y por temporada, y cruzarlos con el costo de personal para decidir turnos y precios en meses de alta y baja.",
      fuente: "Sistema de reservas (PMS), reportes de canales de venta y nómina en ADP.",
    },
    {
      sector: "Bienes raíces",
      titulo: "Inventario, días en el mercado y cartera de alquileres",
      descripcion:
        "Medir cuánto tarda cada propiedad en venderse o alquilarse, el precio por pie cuadrado por zona y la morosidad de la cartera, en un solo tablero para el equipo comercial y el administrativo.",
      fuente: "CRM, listados MLS exportados, contratos de alquiler y contabilidad.",
    },
    {
      sector: "Salud",
      titulo: "Citas, ausencias y facturación por consultorio",
      descripcion:
        "Revisar tasa de ausencias, tiempo de espera y cobros pendientes por clínica y por proveedor de servicios, sin exponer datos personales de pacientes en el reporte.",
      fuente: "Agenda de citas, sistema de facturación y reportes administrativos agregados.",
    },
    {
      sector: "Construcción",
      titulo: "Presupuesto contra costo real por obra",
      descripcion:
        "Comparar el presupuesto de cada proyecto con el costo real de materiales, subcontratistas y horas de cuadrilla, para detectar desvíos mientras todavía se pueden corregir.",
      fuente: "Contabilidad en QuickBooks, órdenes de cambio, planillas de horas y facturas de proveedores.",
    },
    {
      sector: "Banca y finanzas (sedes regionales)",
      titulo: "Consolidación para la casa matriz en Latinoamérica",
      descripcion:
        "Unir los reportes de varios países y monedas en un modelo común para la oficina regional: cartera, cumplimiento de metas y conciliación con lo que pide la matriz.",
      fuente: "Extractos de core bancario, archivos de las filiales, hojas de Excel y reportes de SEC EDGAR para comparar con pares.",
    },
  ],
  referencias: [
    {
      nombre: "U.S. Census Bureau",
      detalle:
        "Población, ingresos y datos por condado o código postal para dimensionar un mercado local.",
    },
    {
      nombre: "Bureau of Labor Statistics (BLS)",
      detalle:
        "Empleo, salarios por ocupación e índice de precios para contextualizar costos de personal y márgenes.",
    },
    {
      nombre: "FRED (Reserva Federal de St. Louis)",
      detalle:
        "Series de tasas de interés, inflación y actividad económica listas para graficar en Power BI.",
    },
    {
      nombre: "SEC EDGAR",
      detalle:
        "Estados financieros públicos de empresas que cotizan en bolsa, útiles para comparar indicadores entre pares.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta",
    resumen:
      "El catálogo para Estados Unidos se publica en dólares (USD): la ficha de cada curso muestra el precio vigente y el total aparece antes de pagar.",
    nota: "El pago es con tarjeta de crédito o débito. Las empresas pueden pedir factura o recibo en USD, y los alumnos reciben recibo y descripción del curso para solicitar el reembolso de su empleador.",
  },
  mercado: {
    ejemplo:
      "En una empresa de Estados Unidos el punto de partida suele ser un export de QuickBooks, NetSuite o Salesforce y un Excel que alguien arma cada mes. Un primer tablero útil cruza ventas, costos y cobros por cliente o por proyecto, y reemplaza la reunión donde cada uno trae su propia cifra.",
    horario:
      "EE.UU. y Chile cambian la hora en fechas distintas, así que la clase de 19:30 en Chile cae entre las 17:30 y las 19:30 en Miami y Nueva York según la época del año. En Central (Texas, Chicago) es una hora antes y en Pacífico (California) tres horas antes. La ficha muestra la hora exacta de tu cohorte.",
    facturacion:
      "Los cursos se pagan en dólares con tarjeta de crédito o débito. Las empresas pueden solicitar factura o recibo en USD, y los proyectos in-company se cotizan por separado, con alcance y condiciones por escrito.",
  },
  nosotros: {
    parrafo:
      "Enseñamos datos en español a profesionales y equipos de Estados Unidos que trabajan con herramientas e informes en inglés. Las clases son en vivo por Zoom, con profesor real, y se dictan desde Santiago de Chile; no tenemos oficina en EE.UU. Cada alumno recibe un certificado digital propio de la academia y acceso al campus virtual con las grabaciones durante el curso.",
  },
  faqs: [
    {
      q: "¿El certificado tiene validez en Estados Unidos?",
      a: "Es un certificado digital propio de la academia, con código de verificación. No es una certificación de Microsoft ni una acreditación universitaria estadounidense. Sirve para mostrar en tu perfil y a tu empleador qué aprendiste y cuántas horas cursaste; si necesitas una credencial reconocida por Microsoft, existe el examen PL-300, que se rinde por separado.",
      categoria: "general",
    },
    {
      q: "¿Mi empresa me puede reembolsar el curso?",
      a: "Muchas empresas en EE.UU. tienen un programa de asistencia educativa. Según el IRS, un empleador puede dar hasta $5,250 al año por empleado libres de impuesto bajo un programa calificado (Sección 127). Cada empresa define sus propias reglas y no podemos asegurar que apruebe tu solicitud. Te entregamos recibo en USD y la descripción del curso, con temario y duración, para que la presentes a tu área de recursos humanos.",
      categoria: "pagos",
    },
    {
      q: "¿A qué hora es la clase en Miami, Texas o California?",
      a: "La sesión es de 2 horas y se dicta a las 19:30 hora de Chile. En Miami y Nueva York (hora del Este) cae entre las 17:30 y las 19:30 según la época del año, porque EE.UU. y Chile cambian la hora en fechas distintas. En Texas y Chicago (Central) es una hora antes, y en California (Pacífico) tres horas antes. La ficha de cada curso muestra la hora exacta de la cohorte.",
      categoria: "cursos",
    },
    {
      q: "¿El software y los términos se enseñan en inglés o en español?",
      a: "La explicación es en español y el software se usa con la interfaz en inglés, que es la que verás en tu trabajo. Los términos técnicos (dashboard, measure, merge, join, payroll) se mantienen en inglés y se explican la primera vez que aparecen, para que puedas hablar con tu equipo en cualquiera de los dos idiomas.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo se paga el curso desde Estados Unidos?",
      a: "Con tarjeta de crédito o débito, en dólares. Si pagas por tu empresa, puedes pedir factura o recibo en USD. El total se muestra antes de confirmar.",
      categoria: "pagos",
    },
    {
      q: "¿Cuánto cuesta un curso y cuánto dura?",
      a: `${resumenPreciosCatalogo("us")} Los cursos individuales son de 20 horas y el programa de Análisis de datos (SQL Server, Power BI y Python) es de 60 horas.`,
      categoria: "pagos",
    },
    {
      q: "¿Qué pasa si falto a una clase?",
      a: "Las clases quedan grabadas en el campus virtual junto con el material, así que puedes verlas después y retomar con el grupo. Durante el curso puedes consultar tus dudas al profesor en la siguiente sesión en vivo.",
      categoria: "cursos",
    },
    {
      q: "¿Sirve para preparar el examen PL-300 de Microsoft?",
      a: "El curso de Power BI cubre contenidos alineados con el examen PL-300 (Power BI Data Analyst). El examen lo rindes y lo pagas por tu cuenta en Microsoft, y rendirlo no está incluido ni garantizado por el curso. Para practicar la certificación en inglés, usa la interfaz en inglés desde la primera clase.",
      categoria: "cursos",
    },
    {
      q: "¿Necesito saber programar?",
      a: "No. Power BI, Excel y SQL Server se aprenden desde cero en los cursos iniciales. Python para datos es más técnico: si nunca programaste, conviene empezar por Excel o Power BI y la ficha del curso indica los requisitos.",
      categoria: "general",
    },
    {
      q: "¿Dan capacitación para el equipo de mi empresa?",
      a: "Sí. La capacitación in-company se dicta en vivo, en español, con los datos de tu empresa y en el horario que acuerden, por ejemplo en ET, CT o PT. La propuesta indica alcance, duración, moneda y condiciones de facturación antes de empezar.",
      categoria: "general",
    },
    {
      q: "¿Qué incluye el curso además de las clases?",
      a: "Campus virtual con las clases grabadas y el material durante el curso, archivos de práctica, el proyecto final y un certificado digital propio de la academia al terminar.",
      categoria: "general",
    },
  ],
};

export default contenido;

/**
 * Bloque local de Estados Unidos: datos duros, FAQ y metadata de las siete rutas.
 * Los montos y el horario los resuelve `bloque.ts` desde la fuente única.
 * Asume que `us` existe en `config/paises.ts` (USD, es-US, America/New_York).
 */
export const bloqueLocal: DefinicionBloqueLocal = {
  iso: "us",
  titulo: "Estudiar datos en vivo y en español desde Estados Unidos",
  parrafos: [
    "Si trabajas en Miami, Houston, Nueva York o Los Ángeles y tu equipo habla español, estas clases están pensadas para ti. Son en vivo por Zoom, con profesor real, y la hora del Este queda al salir de la oficina: {horaLocal}.",
    "El software se usa en inglés, como lo verás en el trabajo, y la explicación es en español. Los ejercicios parten de datos como los de QuickBooks, Salesforce, ADP o NetSuite, y de fuentes públicas como el U.S. Census Bureau, el BLS, FRED y SEC EDGAR.",
    "Los precios se publican en dólares y el pago es con tarjeta de crédito o débito. Muchas empresas en EE.UU. tienen programas de asistencia educativa: te damos recibo en USD y la descripción del curso para que lo solicites, aunque la aprobación depende de tu empleador. Las clases quedan grabadas en el campus durante el curso y al final recibes un certificado digital de la academia.",
  ],
  empresas:
    "Para equipos en Estados Unidos, la capacitación in-company se dicta en vivo y en español, con los datos de la empresa (QuickBooks, NetSuite, Salesforce, ADP o reportes de Excel). Los ejercicios usan escenarios de logística, hotelería, bienes raíces, salud, construcción o finanzas, y el horario se acuerda en ET, CT o PT. La propuesta indica alcance, duración, moneda y condiciones de facturación en USD; se cotiza aparte de los cursos abiertos.",
  notas: {
    precio:
      "El precio se publica en dólares (USD) en la ficha de cada curso, sin formularios. Es el precio final del curso; el checkout muestra el total antes de pagar.",
    horario:
      "La clase es a las {horarioChile} en Chile. En la hora del Este (Miami, Nueva York) cae entre las 17:30 y las 19:30 según la época del año; en Central es una hora antes y en Pacífico, tres horas antes. La ficha de la cohorte muestra la hora exacta.",
    pago:
      "Tarjeta de crédito o débito, en dólares. Las empresas pueden pedir factura o recibo en USD. Si tu banco cobra comisión por pagos internacionales, la define el emisor de la tarjeta.",
    cuotas:
      "El curso se paga en un solo cargo a tu tarjeta de crédito o débito. Si necesitas otra alternativa, escríbenos antes de inscribirte.",
    "clase-gratis":
      "La clase abierta se dicta por Zoom, sin costo y sin crear cuenta. La fecha se publica cuando está confirmada, y se indica la hora del Este.",
    certificado:
      "Certificado digital propio de la academia, con código de verificación, y campus virtual con las clases grabadas y el material durante el curso. No es una certificación de Microsoft ni una acreditación estadounidense; el examen PL-300 se rinde por separado.",
  },
  preguntas: [
    {
      q: "¿A qué hora son las clases en Miami, Texas y California?",
      a: "Las clases en vivo por Zoom son de {horario}, {horaLocal}, según la cohorte. En Chile son de {horarioChile}. En Texas y Chicago (Central) es una hora antes, y en California (Pacífico), tres horas antes. EE.UU. y Chile cambian la hora en fechas distintas, por eso la ficha muestra la hora exacta de cada cohorte.",
    },
    {
      q: "¿Cuánto cuesta un curso de Power BI en español en EE.UU.?",
      a: "{resumenPrecios}",
    },
    {
      q: "¿Cómo pago desde Estados Unidos?",
      a: "Con tarjeta de crédito o débito, en dólares. Si pagas por tu empresa, puedes pedir factura o recibo en USD. {notaPago}",
    },
    {
      q: "¿Mi empleador puede reembolsarme el curso?",
      a: "Muchas empresas en EE.UU. tienen un programa de asistencia educativa. Según el IRS, un empleador puede dar hasta $5,250 al año por empleado libres de impuesto bajo un programa calificado. Cada empresa decide si aprueba el reembolso; nosotros entregamos recibo en USD y la descripción del curso con temario y duración para que lo solicites.",
    },
    {
      q: "¿El certificado sirve en Estados Unidos?",
      a: "Es un certificado digital de la academia, con código de verificación y acceso al campus virtual durante el curso. No es una certificación de Microsoft ni una acreditación estadounidense. El curso de Power BI cubre contenidos alineados con el examen PL-300, que rindes por tu cuenta.",
    },
    {
      q: "¿Los cursos son en inglés o en español?",
      a: "La clase y las explicaciones son en español. El software se usa con la interfaz en inglés y los términos técnicos se mantienen en inglés, para que puedas trabajar con tu equipo y tus reportes sin traducir.",
    },
  ],
  seo: {
    hub: {
      title: "Cursos de datos en español en Estados Unidos | ProgramBI",
      description:
        "Cursos en vivo en español para Estados Unidos: Power BI, Excel, SQL, Python e IA. Clases por Zoom al salir del trabajo (ET), precios en USD y certificado.",
    },
    cursos: {
      title: "Cursos de Power BI y Excel en español online | EE.UU.",
      description:
        "Catálogo de cursos de 20 horas en vivo y en español: Power BI, Excel, SQL, Python e IA. Horario del Este, precios en USD y pago con tarjeta.",
    },
    "power-bi": {
      title: "Curso de Power BI en español, en vivo | EE.UU.",
      description:
        "Curso de Power BI en español por Zoom: Power Query, modelo y DAX en 20 horas. Interfaz en inglés, horario ET, precio en USD y contenidos alineados con PL-300.",
    },
    "analisis-de-datos": {
      title: "Curso de análisis de datos en español | Miami y EE.UU.",
      description:
        "Programa de análisis de datos en español de 60 horas: SQL Server, Power BI y Python. En vivo por Zoom, hora del Este, precio en USD y certificado digital.",
    },
    python: {
      title: "Curso de Python para datos en español | Estados Unidos",
      description:
        "Python para análisis de datos en español, en vivo por Zoom: Pandas, gráficos y automatización en 20 horas. Horario del Este, precio en USD y certificado.",
    },
    empresas: {
      title: "Capacitación Power BI en español para empresas en EE.UU.",
      description:
        "Capacitación in-company en español para equipos en Estados Unidos: Power BI, Excel, SQL e IA con tus datos. En vivo en ET, CT o PT, con factura en USD.",
    },
    precios: {
      title: "Precios de cursos de Power BI y Excel en español | EE.UU.",
      description:
        "Precios en dólares de los cursos en vivo y en español: duración, qué incluye, pago con tarjeta, recibo para reembolso del empleador y horario del Este.",
    },
  },
};
