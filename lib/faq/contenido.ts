import { getPais, type Pais } from "@/config/paises";
import { PRECIOS_VALID_FROM, precioPublico } from "@/config/pricing";
import { formatMoneda } from "@/lib/paises/precios";

export type FaqItem = {
  id: string;
  pregunta: string;
  respuesta: string;
};

export type FaqSeccion = {
  id: string;
  titulo: string;
  resumen: string;
  pasos?: string[];
  items: FaqItem[];
};

/**
 * Orden de la tabla: primero los mercados indexables y luego el resto.
 * Los montos salen siempre de config/pricing.ts; aquí no se escribe ninguno.
 */
const ORDEN_PAISES = [
  "cl",
  "ar",
  "mx",
  "pe",
  "co",
  "uy",
  "bo",
  "cr",
  "ec",
  "sv",
  "gt",
  "hn",
  "ni",
  "pa",
  "py",
  "do",
  "ve",
] as const;

export const PAISES_TABLA: Pais[] = ORDEN_PAISES.map((iso) => getPais(iso));

export const CURSOS_TABLA = [
  { slug: "power-bi", nombre: "Power BI" },
  { slug: "analisis-de-datos", nombre: "Análisis de datos" },
] as const;

export function precioTexto(iso: string, slug: string): string {
  const valor = precioPublico(iso, slug);
  if (valor == null) return "Consulta por WhatsApp";
  return formatMoneda(iso, valor);
}

export const PRECIOS_DESDE = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Santiago",
}).format(new Date(PRECIOS_VALID_FROM));

export const FICHA = [
  { dato: "Formato", detalle: "Clases en vivo por Zoom, con grabaciones" },
  {
    dato: "Power BI",
    detalle: "Básico-intermedio: 20 h, 8 módulos · Avanzado: 20 h",
  },
  {
    dato: "Análisis de datos",
    detalle: "2 niveles de 60 h: 20 h SQL + 20 h Power BI + 20 h Python",
  },
  { dato: "Próximo inicio", detalle: "Lunes 23 de noviembre de 2026" },
  { dato: "Días", detalle: "Lunes y miércoles" },
  { dato: "Precio", detalle: "En moneda local, según país (ver tabla)" },
  { dato: "Certificado", detalle: "Sí, al terminar el curso" },
  {
    dato: "Horario Chile",
    detalle: "19:30 a 21:30, lunes y miércoles o martes y jueves",
  },
];

export type HorarioPais = {
  iso: string;
  pais: string;
  dias: string;
  hora: string;
};

/**
 * Horarios publicados en las guías y en el contenido de Pluma.
 * Chile: 19:30–21:30. Cadena: 16:30 MX/SV/CR/GT, 17:30 PE/CO/EC,
 * 18:30 VE/DO/BO y 19:30 AR/UY/PY.
 */
export const HORARIOS: HorarioPais[] = [
  {
    iso: "cl",
    pais: "Chile",
    dias: "Lunes y miércoles, o martes y jueves",
    hora: "19:30–21:30",
  },
  { iso: "mx", pais: "México", dias: "Lunes y miércoles", hora: "16:30–18:30" },
  { iso: "pe", pais: "Perú", dias: "Lunes y miércoles", hora: "17:30–19:30" },
  { iso: "co", pais: "Colombia", dias: "Lunes y miércoles", hora: "17:30–19:30" },
  { iso: "ar", pais: "Argentina", dias: "Lunes y miércoles", hora: "19:30–21:30" },
  { iso: "uy", pais: "Uruguay", dias: "Lunes y miércoles", hora: "19:30–21:30" },
  { iso: "py", pais: "Paraguay", dias: "Lunes y miércoles", hora: "19:30–21:30" },
  { iso: "sv", pais: "El Salvador", dias: "Lunes y miércoles", hora: "16:30–18:30" },
  { iso: "cr", pais: "Costa Rica", dias: "Lunes y miércoles", hora: "16:30–18:30" },
  { iso: "gt", pais: "Guatemala", dias: "Lunes y miércoles", hora: "16:30–18:30" },
  { iso: "ec", pais: "Ecuador", dias: "Lunes y miércoles", hora: "17:30–19:30" },
  { iso: "ve", pais: "Venezuela", dias: "Lunes y miércoles", hora: "18:30–20:30" },
  {
    iso: "do",
    pais: "República Dominicana",
    dias: "Lunes y miércoles",
    hora: "18:30–20:30",
  },
  { iso: "bo", pais: "Bolivia", dias: "Lunes y miércoles", hora: "18:30–20:30" },
];

export const GUIAS_RELACIONADAS = [
  {
    href: "/guias/certificacion-pl-300-power-bi",
    etiqueta: "Certificación PL-300 de Power BI",
  },
  {
    href: "/guias/curso-online-vs-presencial-power-bi",
    etiqueta: "Curso online vs presencial",
  },
  {
    href: "/guias/power-bi-vs-tableau",
    etiqueta: "Power BI vs Tableau",
  },
  {
    href: "/guias/sueldo-analista-de-datos-latinoamerica",
    etiqueta: "Sueldo de analista de datos por país",
  },
];

export const SECCIONES: FaqSeccion[] = [
  {
    id: "curso-en-vivo",
    titulo: "Cómo funciona el curso en vivo",
    resumen:
      "Las clases son en vivo por Zoom, con un docente en tiempo real, y quedan grabadas para repasar. No son cursos solo grabados.",
    items: [
      {
        id: "que-es-programbi",
        pregunta: "¿Qué es ProgramBI?",
        respuesta:
          "ProgramBI es una escuela online especializada en inteligencia de negocios y análisis de datos. Sus cursos enseñan herramientas usadas en empresas, como Power BI, SQL y Python, mediante clases en vivo.",
      },
      {
        id: "online-o-presencial",
        pregunta: "¿Los cursos son online o presenciales?",
        respuesta:
          "Los cursos son online, con clases en vivo por Zoom. No son cursos solo grabados: hay un docente en tiempo real y además quedan grabaciones para repasar.",
      },
      {
        id: "clases-en-vivo",
        pregunta: "¿Las clases son en vivo de verdad?",
        respuesta:
          "Sí. Las clases son en vivo por Zoom: puedes preguntar en el momento y compartir tu pantalla cuando algo no funciona.",
      },
      {
        id: "falto-a-clase",
        pregunta: "¿Qué pasa si falto a una clase?",
        respuesta:
          "Las clases quedan grabadas, así que puedes ponerte al día viendo la grabación.",
      },
      {
        id: "idioma",
        pregunta: "¿En qué idioma son las clases?",
        respuesta: "Las clases son en español.",
      },
      {
        id: "desde-que-paises",
        pregunta: "¿Desde qué países puedo tomar los cursos?",
        respuesta:
          "Puedes participar desde cualquier país con conexión a internet. ProgramBI publica guías y horarios para Chile, México, Colombia, Perú, Argentina y otros países de Latinoamérica, como El Salvador, Venezuela, Costa Rica, República Dominicana, Bolivia, Ecuador y Guatemala.",
      },
    ],
  },
  {
    id: "cursos",
    titulo: "Cursos",
    resumen:
      "ProgramBI dicta Power BI (básico-intermedio y avanzado) y Análisis de datos (dos niveles que combinan SQL, Power BI y Python). El catálogo completo está en /cursos.",
    items: [
      {
        id: "que-cursos",
        pregunta: "¿Qué cursos ofrece ProgramBI?",
        respuesta:
          "Los cursos principales son Power BI (niveles básico-intermedio y avanzado) y Análisis de datos (dos niveles que combinan SQL, Power BI y Python). El catálogo completo está en la página de cursos.",
      },
      {
        id: "que-aprendo-power-bi",
        pregunta: "¿Qué aprendo en el curso de Power BI?",
        respuesta:
          "En el nivel básico-intermedio, de 20 horas en 8 módulos, aprendes a conectar y preparar datos, construir el modelo y crear informes. El nivel avanzado, también de 20 horas, incluye Power BI Service y seguridad a nivel de fila (RLS).",
      },
      {
        id: "que-aprendo-analisis",
        pregunta: "¿Qué aprendo en el curso de Análisis de datos?",
        respuesta:
          "El curso combina tres herramientas en cada nivel de 60 horas: 20 horas de SQL, 20 de Power BI y 20 de Python. La idea es cubrir el ciclo completo: extraer datos, analizarlos y comunicarlos.",
      },
      {
        id: "que-curso-me-conviene",
        pregunta: "¿Qué curso me conviene: Power BI o Análisis de datos?",
        respuesta:
          "Si tu objetivo es crear reportes y tableros en tu trabajo actual, empieza por Power BI. Si quieres un perfil completo de analista de datos, con consultas SQL y análisis en Python, el curso de Análisis de datos cubre las tres herramientas.",
      },
      {
        id: "duracion-power-bi",
        pregunta: "¿Cuánto dura el curso de Power BI?",
        respuesta:
          "El nivel básico-intermedio tiene 20 horas en 8 módulos y el nivel avanzado tiene otras 20 horas. El nivel avanzado incluye Power BI Service y seguridad a nivel de fila (RLS).",
      },
      {
        id: "duracion-analisis",
        pregunta: "¿Cuánto dura el curso de Análisis de datos?",
        respuesta:
          "Tiene dos niveles de 60 horas cada uno. En cada nivel se ven 20 horas de SQL, 20 de Power BI y 20 de Python.",
      },
      {
        id: "power-bi-vs-tableau",
        pregunta: "¿Por qué Power BI y no Tableau?",
        respuesta:
          "Ambas son herramientas de inteligencia de negocios. Power BI Desktop es una descarga gratuita de Microsoft y se integra con el ecosistema de Microsoft 365. Puedes ver una comparación con datos oficiales en la guía Power BI vs Tableau.",
      },
    ],
  },
  {
    id: "horarios",
    titulo: "Horarios por país",
    resumen:
      "El próximo inicio es el lunes 23 de noviembre de 2026, con clases los lunes y miércoles. El horario se adapta a cada país y se informa en hora local.",
    items: [
      {
        id: "proximo-inicio",
        pregunta: "¿Cuándo empieza el próximo curso?",
        respuesta:
          "El próximo inicio es el lunes 23 de noviembre de 2026, con clases los lunes y miércoles.",
      },
      {
        id: "a-que-hora",
        pregunta: "¿A qué hora son las clases?",
        respuesta:
          "El horario se adapta a cada país. En Chile, las clases son de 19:30 a 21:30, con dos opciones de días: lunes y miércoles, o martes y jueves. En el resto de los países, la tabla de horarios de esta página muestra la hora local. Confirma el horario de tu país por WhatsApp.",
      },
      {
        id: "que-dias",
        pregunta: "¿Qué días son las clases?",
        respuesta:
          "Las clases son los lunes y miércoles. En Chile también existe la opción de martes y jueves.",
      },
      {
        id: "horario-mi-pais",
        pregunta: "¿Cómo sé el horario de mi país?",
        respuesta:
          "La tabla de horarios por país de esta página lo muestra en hora local. Si tu país no aparece, escríbenos por WhatsApp y te confirmamos la hora.",
      },
    ],
  },
  {
    id: "precios",
    titulo: "Precios por país",
    resumen:
      "El valor de cada curso se publica en moneda local y se puede pagar en 3 cuotas sin interés en todos los países. La tabla muestra Power BI y Análisis de datos por país.",
    items: [
      {
        id: "cuanto-cuestan",
        pregunta: "¿Cuánto cuestan los cursos?",
        respuesta:
          "El valor de cada curso está en la tabla de precios por país de esta página, en moneda local. En todos los países puedes pagarlo en 3 cuotas sin interés. Para conocer el precio vigente en tu país y las formas de pago, escribe por WhatsApp.",
      },
      {
        id: "precio-que-veo",
        pregunta: "¿El precio que veo es el que voy a pagar?",
        respuesta:
          "La tabla muestra el precio de venta publicado para cada país. Para confirmar el valor vigente y la forma de pago, escribe por WhatsApp. El cargo final lo define tu banco.",
      },
      {
        id: "licencia-power-bi",
        pregunta: "¿Tengo que pagar una licencia de Power BI para el curso?",
        respuesta:
          "No para aprender. Según Microsoft, Power BI Desktop es una descarga gratuita para crear informes. Las licencias de pago, como Power BI Pro, se necesitan para publicar y compartir informes dentro de una organización.",
      },
      {
        id: "precio-examen-pl300",
        pregunta: "¿El precio del examen PL-300 está incluido?",
        respuesta:
          "No. El examen se paga directamente a Microsoft y su precio varía por país.",
      },
    ],
  },
  {
    id: "certificado",
    titulo: "Certificado y certificación PL-300",
    resumen:
      "Al terminar el curso recibes un certificado de ProgramBI. La certificación PL-300 es un examen de Microsoft distinto, que se rinde y se paga directamente con Microsoft.",
    items: [
      {
        id: "recibo-certificado",
        pregunta: "¿Recibo un certificado al terminar?",
        respuesta:
          "Sí. Al terminar el curso, los alumnos reciben un certificado de ProgramBI. Es distinto de la certificación PL-300, que se rinde directamente con Microsoft.",
      },
      {
        id: "certificado-vs-pl300",
        pregunta: "¿El certificado de ProgramBI es lo mismo que la PL-300?",
        respuesta:
          "No. El certificado de ProgramBI acredita que terminaste el curso; la PL-300 es una certificación de Microsoft con examen propio.",
      },
      {
        id: "curso-prepara-pl300",
        pregunta: "¿El curso prepara para la certificación PL-300?",
        respuesta:
          "El curso de Power BI trabaja contenidos relacionados con las áreas que evalúa el examen PL-300 de Microsoft (preparar, modelar y visualizar datos, y administrar el servicio), pero no es un curso oficial de Microsoft. El examen se rinde directamente con Microsoft.",
      },
      {
        id: "que-es-pl300",
        pregunta: "¿Qué es la PL-300?",
        respuesta:
          "Es el examen de la certificación Microsoft Certified: Power BI Data Analyst Associate. Según Microsoft Learn, es de nivel intermedio, dura 100 minutos, requiere 700 puntos para aprobar, se puede rendir en español y se renueva gratis cada año.",
      },
    ],
  },
  {
    id: "pagos",
    titulo: "Formas de pago y cuotas",
    resumen:
      "En todos los países puedes pagar en 3 cuotas sin interés. Los medios de pago publicados dependen de cada mercado y aparecen en la tabla de esta página.",
    items: [
      {
        id: "cuotas-sin-interes",
        pregunta: "¿Hay cuotas sin interés?",
        respuesta:
          "Sí. En todos los países, los cursos se pueden pagar en 3 cuotas sin interés.",
      },
      {
        id: "formas-de-pago",
        pregunta: "¿Qué formas de pago hay?",
        respuesta:
          "Cada país tiene sus medios de pago publicados. La tabla de medios de pago de esta página muestra el detalle por país. Si tienes dudas sobre el medio disponible en tu mercado, escribe por WhatsApp.",
      },
      {
        id: "pagar-desde-otro-pais",
        pregunta: "¿Puedo pagar desde otro país?",
        respuesta:
          "Sí. Puedes participar desde cualquier país con conexión a internet. Cada mercado tiene su pasarela local y, cuando no hay cobro local, el checkout confirma los medios disponibles y el monto final.",
      },
      {
        id: "moneda-local",
        pregunta: "¿Los precios están en moneda local?",
        respuesta:
          "Sí. La tabla de precios por país muestra el monto en la moneda de cada mercado: pesos chilenos en Chile, pesos argentinos en Argentina, pesos mexicanos en México, soles en Perú, pesos colombianos en Colombia y pesos uruguayos en Uruguay, entre otros. Paraguay se consulta por WhatsApp.",
      },
    ],
  },
  {
    id: "inscripcion",
    titulo: "Cómo inscribirse paso a paso",
    resumen:
      "Puedes inscribirte desde la página de cada curso o escribiendo por WhatsApp. El equipo confirma la fecha de inicio, el horario de tu país y la forma de pago.",
    pasos: [
      "Elige el curso: Power BI o Análisis de datos.",
      "Revisa la ficha del curso y elige el nivel.",
      "Inscríbete desde la página del curso o escribe por WhatsApp.",
      "Confirma la fecha de inicio, el horario de tu país y la forma de pago.",
      "Paga en 3 cuotas sin interés y recibe el acceso a las clases en vivo y a las grabaciones.",
    ],
    items: [
      {
        id: "como-me-inscribo",
        pregunta: "¿Cómo me inscribo?",
        respuesta:
          "Desde la página de cada curso o escribiendo por WhatsApp. Te confirmarán la fecha de inicio, el horario de tu país y la forma de pago. Si te inscribes en el sitio, creas tu cuenta, confirmas tu correo, eliges el curso y pagas en línea.",
      },
      {
        id: "info-antes-de-pagar",
        pregunta: "¿Puedo pedir información antes de pagar?",
        respuesta:
          "Sí. Puedes escribir por WhatsApp para resolver dudas sobre el temario, el horario de tu país, los requisitos y el valor antes de inscribirte, sin compromiso.",
      },
      {
        id: "un-solo-nivel",
        pregunta: "¿Puedo inscribirme a un solo nivel?",
        respuesta:
          "Sí. Cada curso se puede tomar por nivel y cada nivel se cobra por separado, con su propio temario y horario.",
      },
    ],
  },
  {
    id: "requisitos",
    titulo: "Requisitos",
    resumen:
      "Para Power BI no necesitas saber programar: el nivel básico-intermedio parte desde los fundamentos. Para las clases necesitas un computador con internet estable; si usas Mac, trabajas con Power BI web.",
    items: [
      {
        id: "saber-programar",
        pregunta: "¿Necesito saber programar?",
        respuesta:
          "No para empezar con Power BI: el nivel básico-intermedio parte desde los fundamentos. En el curso de Análisis de datos aprenderás SQL y Python dentro del mismo programa.",
      },
      {
        id: "computador",
        pregunta: "¿Qué computador necesito?",
        respuesta:
          "Para Power BI Desktop necesitas un computador con Windows, porque según Microsoft Learn se instala en Windows. Si usas Mac, trabajarás con Power BI web, directamente en el navegador. Además necesitas una conexión estable para las clases por Zoom.",
      },
      {
        id: "mac",
        pregunta: "¿Sirve si tengo Mac?",
        respuesta:
          "Sí. Power BI Desktop se instala solo en Windows, así que quienes usan Mac trabajan con Power BI web, directamente en el navegador.",
      },
      {
        id: "excel",
        pregunta: "¿Necesito saber Excel?",
        respuesta:
          "Ayuda tener familiaridad con planillas, pero si tienes dudas sobre tu nivel de entrada, consulta por WhatsApp antes de inscribirte.",
      },
    ],
  },
  {
    id: "despues-del-curso",
    titulo: "Después del curso",
    resumen:
      "Al terminar puedes continuar con el nivel avanzado. El curso entrega la base técnica y práctica, pero no garantiza empleo.",
    items: [
      {
        id: "nivel-avanzado",
        pregunta: "¿Puedo seguir con el nivel avanzado?",
        respuesta:
          "Sí. Power BI tiene un nivel avanzado de 20 horas y Análisis de datos tiene un segundo nivel de 60 horas.",
      },
      {
        id: "garantiza-empleo",
        pregunta: "¿El curso garantiza empleo?",
        respuesta:
          "No. Ningún curso puede garantizar un empleo. Lo que entrega es la base técnica y práctica para postular a roles de análisis o mejorar en tu trabajo actual.",
      },
      {
        id: "sueldo-analista",
        pregunta: "¿Cuánto gana un analista de datos?",
        respuesta:
          "Depende del país. Por ejemplo, según Computrabajo, el sueldo medio de un analista de datos en México es de $13,098 al mes y en Colombia de $2.416.855 al mes (consultado el 4 de noviembre de 2026). Revisa todas las cifras con fuente en la guía de sueldos por país.",
      },
    ],
  },
  {
    id: "glosario",
    titulo: "Glosario rápido",
    resumen:
      "Términos que aparecen en las clases y en las fichas de los cursos.",
    items: [
      {
        id: "que-es-power-bi",
        pregunta: "¿Qué es Power BI?",
        respuesta:
          "Power BI es la plataforma de inteligencia de negocios de Microsoft. Power BI Desktop sirve para conectar datos, modelarlos y crear informes; el servicio de Power BI permite publicarlos y compartirlos.",
      },
      {
        id: "que-es-power-bi-service",
        pregunta: "¿Qué es Power BI Service?",
        respuesta:
          "Es la parte en la nube de Power BI, donde se publican, comparten y actualizan los informes. Se estudia en el nivel avanzado del curso.",
      },
      {
        id: "que-es-rls",
        pregunta: "¿Qué es RLS?",
        respuesta:
          "RLS significa seguridad a nivel de fila (row-level security): permite que cada persona vea solo los datos que le corresponden dentro del mismo informe. También forma parte del nivel avanzado.",
      },
      {
        id: "que-es-dax",
        pregunta: "¿Qué es DAX?",
        respuesta:
          "DAX es el lenguaje de fórmulas de Power BI para crear medidas y cálculos sobre el modelo de datos.",
      },
      {
        id: "que-es-sql",
        pregunta: "¿Qué es SQL?",
        respuesta:
          "SQL es el lenguaje estándar para consultar bases de datos relacionales. En el curso de Análisis de datos se trabaja con SQL Server.",
      },
      {
        id: "python-analisis",
        pregunta: "¿Para qué sirve Python en análisis de datos?",
        respuesta:
          "Python permite limpiar, transformar y analizar datos con más flexibilidad que una planilla, y automatizar tareas repetitivas.",
      },
      {
        id: "que-es-fabric",
        pregunta: "¿Qué es Microsoft Fabric?",
        respuesta:
          "Es la plataforma de análisis de Microsoft que integra Power BI con otras cargas de trabajo de datos. Según la página de precios de Microsoft, incluye capacidades donde también está disponible Copilot.",
      },
    ],
  },
  {
    id: "soporte",
    titulo: "Soporte y contacto",
    resumen:
      "Si tu duda no está en esta página, escríbenos por WhatsApp con tu país y el curso que te interesa.",
    items: [
      {
        id: "no-encontraste",
        pregunta: "¿No encontraste tu respuesta?",
        respuesta:
          "Escríbenos por WhatsApp con tu país y el curso que te interesa. Te responderemos con la fecha, el horario local y el valor vigente.",
      },
    ],
  },
];
