import { getPais, ISO_CHILE, type Pais } from "@/config/paises";
import { precioPublico, tienePrecioPublico } from "@/config/pricing";
import { dispositivo } from "@/config/textos";
import {
  etiquetaHoraLocal,
  etiquetaUtc,
  horaEnZona,
  HORA_CLASE_CHILE,
  zonaDe,
} from "@/lib/paises/horarios";
import { formatMoneda } from "@/lib/paises/precios";
import { whatsappHref } from "@/lib/whatsapp";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";

/** Texto único de cuotas, derivado de config/cuotas.ts. */
const CUOTAS = `${CUOTAS_SIN_INTERES} cuotas sin interés`;

/**
 * Contenido de las preguntas frecuentes, en una sola fuente para Chile y para
 * las versiones por país.
 *
 * Reglas de redacción:
 * - Cada respuesta abre con una frase autocontenida y citable: qué, cuánto,
 *   cuándo o cómo, sin rodeos ni marketing.
 * - Ningún monto se escribe ni se calcula acá: el arancel vigente por país,
 *   los descuentos y las 3 cuotas sin interés se descargan en el brochure PDF
 *   de cada curso.
 * - Las horas salen de `lib/paises/horarios.ts` (conversión IANA real desde
 *   el horario base de Chile), no de números fijos por país.
 * - Paraguay no tiene precio público: se muestra «consulta por WhatsApp».
 */

export const ACTUALIZADO = "2026-11-14";

export const PROXIMO_INICIO = "Nuevos inicios cada mes; consulta la fecha exacta al inscribirte";

/** Cursos con columna propia en la tabla de precios. */
export const CURSOS_TABLA = [
  { slug: "power-bi", nombre: "Power BI" },
  { slug: "analisis-de-datos", nombre: "Análisis de datos" },
] as const;

/** Países de la tabla: los seis mercados con precio propio más Paraguay. */
export const PAISES_TABLA: Pais[] = ["cl", "ar", "mx", "co", "pe", "uy", "py"].map(
  (iso) => getPais(iso)
);

export type FaqEnlace = { href: string; texto: string };

export type FaqItem = {
  id: string;
  pregunta: string;
  respuesta: string;
  enlace?: FaqEnlace;
};

export type FaqSeccion = {
  id: string;
  titulo: string;
  resumen: string;
  pasos?: string[];
  tabla?: "precios" | "horarios" | "pagos";
  items: FaqItem[];
};

export type FilaPrecio = {
  iso: string;
  pais: string;
  celdas: string[];
  actual: boolean;
};

export type FilaHorario = {
  iso: string;
  pais: string;
  dias: string;
  hora: string;
};

export type FilaPago = {
  iso: string;
  pais: string;
  medios: string;
};

export type FaqContenido = {
  iso: string;
  pais: Pais;
  /** Ruta canónica de la página en esta versión (con prefijo de país si aplica). */
  path: string;
  /** Home de la versión: "/" en Chile, "/ar" en Argentina. */
  inicioHref: string;
  h1: string;
  intro: string[];
  ficha: { dato: string; detalle: string }[];
  secciones: FaqSeccion[];
  precios: { columnas: string[]; filas: FilaPrecio[]; nota: string };
  horarios: { filas: FilaHorario[]; nota: string };
  pagos: { filas: FilaPago[]; nota: string };
  guias: FaqEnlace[];
  whatsapp: string;
  actualizado: string;
  /** Fecha ISO de revisión del contenido; alimenta `dateModified` del JSON-LD. */
  actualizadoIso: string;
};

/**
 * Helper de formato para superficies con precio (brochure, checkout, emails).
 * El HTML público de la FAQ no lo usa: acá el arancel va en el brochure PDF.
 */
export function precioTexto(iso: string, slug: string): string {
  const valor = precioPublico(iso, slug);
  if (valor == null) return "Consulta por WhatsApp";
  return formatMoneda(iso, valor);
}

/** "A, B y C" — para listas de medios de pago dentro de una frase. */
function listaNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function fechaActualizado(): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santiago",
  }).format(new Date(`${ACTUALIZADO}T12:00:00-03:00`));
}

function homeDe(iso: string): string {
  return iso === ISO_CHILE ? "/" : `/${iso}`;
}

function rutaDe(iso: string, path: string): string {
  return iso === ISO_CHILE ? path : `/${iso}${path}`;
}

/** Tabla de precios: indica dónde se descarga el arancel, sin publicar montos. */
function tablaPrecios(iso: string): FaqContenido["precios"] {
  return {
    columnas: CURSOS_TABLA.map((curso) => curso.nombre),
    filas: PAISES_TABLA.map((pais) => ({
      iso: pais.iso,
      pais: pais.nombre,
      celdas: CURSOS_TABLA.map(() => "En el PDF de temario y precios"),
      actual: pais.iso === iso,
    })),
    nota:
      "El arancel vigente de cada curso, los descuentos y las 3 cuotas sin interés se descargan en el PDF de temario y precios de la ficha del curso. En Paraguay el PDF se pide por WhatsApp porque todavía no hay un precio público aprobado.",
  };
}

/** Tabla de horarios: Chile manda y cada país se calcula con su zona IANA. */
function tablaHorarios(iso: string, referencia: Date): FaqContenido["horarios"] {
  const filas: FilaHorario[] = PAISES_TABLA.map((pais) => {
    if (pais.iso === ISO_CHILE) {
      return {
        iso: pais.iso,
        pais: pais.nombre,
        dias: "Lunes y miércoles, o martes y jueves",
        hora: `${HORA_CLASE_CHILE.inicio}–${HORA_CLASE_CHILE.fin} (UTC${etiquetaUtc(referencia, pais.zonaHoraria).replace("UTC", "")})`,
      };
    }
    const inicio = horaEnZona(HORA_CLASE_CHILE.inicio, pais.zonaHoraria, referencia);
    const fin = horaEnZona(HORA_CLASE_CHILE.fin, pais.zonaHoraria, referencia);
    return {
      iso: pais.iso,
      pais: pais.nombre,
      dias: "Lunes y miércoles",
      hora: `${inicio}–${fin} (${etiquetaUtc(referencia, pais.zonaHoraria)})`,
    };
  });

  return {
    filas,
    nota:
      "La clase es la misma para todos los países y se dicta desde Chile: cambia la hora local. México corresponde al centro del país (CDMX). Los horarios se recalculan con el huso y el horario de verano de cada país.",
  };
}

function tablaPagos(): FaqContenido["pagos"] {
  return {
    filas: PAISES_TABLA.map((pais) => ({
      iso: pais.iso,
      pais: pais.nombre,
      medios:
        pais.iso === "py"
          ? "Se confirman por WhatsApp"
          : listaNatural(pais.mediosPago),
    })),
    nota:
      `En todos los países el curso se puede pagar en ${CUOTAS}. Si pagas con tarjeta emitida en el exterior, el cargo final lo define tu banco.`,
  };
}

function guiasRelacionadas(iso: string): FaqEnlace[] {
  const lista: FaqEnlace[] = [
    {
      href: "/guias/certificacion-pl-300-power-bi",
      texto: "Certificación PL-300: qué evalúa y cómo se rinde",
    },
    {
      href: "/guias/curso-online-vs-presencial-power-bi",
      texto: "Curso online en vivo vs. curso presencial",
    },
    {
      href: "/guias/power-bi-vs-tableau",
      texto: "Power BI vs. Tableau, con fuentes",
    },
    {
      href: "/guias/sueldo-analista-de-datos-latinoamerica",
      texto: "Sueldo de analista de datos por país",
    },
  ];
  if (iso !== ISO_CHILE) {
    lista.push({
      href: rutaDe(iso, "/guias"),
      texto: `Todas las guías para ${getPais(iso).nombre}`,
    });
  }
  return lista;
}

/**
 * Contenido completo de la página para un país. Chile usa la raíz; el resto,
 * su carpeta. Paraguay entra sin precios y con la invitación a WhatsApp.
 */
export function faqDePais(isoPais: string | null | undefined): FaqContenido {
  const iso = getPais(isoPais).iso;
  const pais = getPais(iso);
  const nombre = pais.nombre;
  const esChile = iso === ISO_CHILE;
  const hoy = new Date();
  const zona = zonaDe(iso);
  const inicioLocal = horaEnZona(HORA_CLASE_CHILE.inicio, zona, hoy);
  const finLocal = horaEnZona(HORA_CLASE_CHILE.fin, zona, hoy);
  const etiquetaLocal = etiquetaHoraLocal(iso, hoy);
  const href = (path: string) => rutaDe(iso, path);
  const comp = dispositivo(iso);

  const sinPrecio = !tienePrecioPublico(iso);

  const introPrecio = sinPrecio
    ? `En ${nombre} el arancel vigente se consulta por WhatsApp, porque todavía no hay un monto público publicado, y se puede pagar en ${CUOTAS}.`
    : `En ${nombre}, el arancel vigente de cada curso, los descuentos y las 3 cuotas sin interés se descargan en el PDF de temario y precios de la ficha del curso.`;

  const introHorario = esChile
    ? `Abrimos cohortes cada mes, con clases de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin} (hora de Chile) los lunes y miércoles o los martes y jueves; la fecha exacta de inicio se confirma al inscribirte.`
    : `Abrimos cohortes cada mes, con clases de ${inicioLocal} a ${finLocal}, ${etiquetaLocal}, los lunes y miércoles; la fecha exacta de inicio se confirma al inscribirte.`;

  const fichaHorario = esChile
    ? `${HORA_CLASE_CHILE.inicio}–${HORA_CLASE_CHILE.fin} (hora de Chile)`
    : `${inicioLocal}–${finLocal} (${etiquetaLocal})`;

  const secciones: FaqSeccion[] = [
    {
      id: "clases-en-vivo",
      titulo: "Clases en vivo, campus virtual y modalidad",
      resumen:
        "Las clases son en vivo por Zoom, con un docente que responde en el momento, y cuentas con el campus virtual con las clases y material usado para que puedas practicar durante el curso.",
      items: [
        {
          id: "que-es-programbi",
          pregunta: "¿Qué es ProgramBI?",
          respuesta:
            "ProgramBI es una escuela online de inteligencia de negocios y análisis de datos que dicta cursos en vivo por Zoom, desde Chile, para alumnos de todo Latinoamérica. Sus programas principales son Power BI y Análisis de datos (SQL, Power BI y Python), y el catálogo incluye además Excel, SQL Server, Python, Claude, Copilot e IA para productividad.",
        },
        {
          id: "online-o-grabado",
          pregunta: "¿Los cursos son en vivo o son solo videos grabados?",
          respuesta:
            "Los cursos son en vivo por Zoom: cada clase tiene un docente en tiempo real y además cuentas con acceso al campus virtual con las clases y el material usado durante el curso. No son cursos solo de video sin fecha ni profesor.",
          enlace: { href: href("/guias/curso-online-vs-presencial-power-bi"), texto: "Ver la diferencia entre curso online y presencial" },
        },
        {
          id: "grabaciones-de-por-vida",
          pregunta: "¿Qué incluye el campus virtual del curso?",
          respuesta:
            "Tendrás acceso al campus virtual con las clases y el material usado para que puedas practicar durante el curso y repasar entre sesiones.",
        },
        {
          id: "falto-a-clase",
          pregunta: "¿Qué pasa si no puedo asistir a una clase en vivo?",
          respuesta:
            "Si no puedes asistir a una sesión en vivo, puedes revisarla en el campus virtual junto con el material usado para que puedas practicar durante el curso y ponerte al día.",
        },
        {
          id: "idioma",
          pregunta: "¿En qué idioma son las clases?",
          respuesta:
            "Las clases son en español, dictadas desde Chile, y el material y las grabaciones también están en español. No se exige inglés para cursar ni para rendir las actividades del curso.",
        },
        {
          id: "desde-que-paises",
          pregunta: "¿Desde qué países puedo tomar los cursos?",
          respuesta:
            "Puedes tomar los cursos desde cualquier país con conexión a internet, porque las clases son en vivo por Zoom y se muestran en la hora local de cada país. ProgramBI publica precios y páginas propias para Chile, Argentina, México, Colombia, Perú, Uruguay y Paraguay.",
        },
      ],
    },
    {
      id: "cursos",
      titulo: "Cursos, niveles y duración",
      resumen:
        "ProgramBI dicta dos programas principales: Power BI, de 20 horas por nivel, y Análisis de datos, de 60 horas por nivel con SQL, Power BI y Python.",
      items: [
        {
          id: "que-cursos",
          pregunta: "¿Qué cursos ofrece ProgramBI?",
          respuesta:
            "Los cursos principales son Power BI, con nivel básico-intermedio y avanzado, y Análisis de datos, con dos niveles que combinan SQL, Power BI y Python. El catálogo completo, con Excel, SQL Server, Python, Claude, Copilot e IA para productividad, está en la página de cursos.",
          enlace: { href: href("/cursos"), texto: "Ver el catálogo de cursos" },
        },
        {
          id: "duracion-power-bi",
          pregunta: "¿Cuántas horas tiene el curso de Power BI?",
          respuesta:
            "El curso de Power BI tiene 20 horas en 8 módulos en el nivel básico-intermedio y otras 20 horas en el nivel avanzado. El nivel avanzado incluye Power BI Service y seguridad a nivel de fila (RLS).",
        },
        {
          id: "duracion-analisis",
          pregunta: "¿Cuánto dura el curso de Análisis de datos?",
          respuesta:
            "El curso de Análisis de datos tiene dos niveles de 60 horas cada uno: en cada nivel se ven 20 horas de SQL, 20 de Power BI y 20 de Python. Cada nivel se cobra y se cursa por separado.",
        },
        {
          id: "que-curso-me-conviene",
          pregunta: "¿Qué curso me conviene: Power BI o Análisis de datos?",
          respuesta:
            "Si tu objetivo es crear reportes y tableros en tu trabajo actual, empieza por Power BI; si quieres el perfil completo de analista de datos, con consultas SQL y análisis en Python, el curso de Análisis de datos cubre las tres herramientas. Power BI son 20 horas por nivel y Análisis de datos, 60 horas por nivel.",
        },
        {
          id: "power-bi-vs-tableau",
          pregunta: "¿Por qué Power BI y no Tableau?",
          respuesta:
            "Power BI Desktop es una descarga gratuita de Microsoft y se integra con Microsoft 365, que es el ecosistema que ya usan la mayoría de las empresas de la región. Tableau también es una herramienta de inteligencia de negocios válida, pero se licencia aparte.",
          enlace: { href: href("/guias/power-bi-vs-tableau"), texto: "Ver la comparación Power BI vs. Tableau" },
        },
      ],
    },
    {
      id: "horarios",
      titulo: "Fechas y horarios por país",
      resumen: esChile
        ? "Las clases son dos veces por semana: de 19:30 a 21:30, hora de Chile, los lunes y miércoles o los martes y jueves."
        : `Las clases son dos veces por semana y en ${nombre} se ven de ${inicioLocal} a ${finLocal}, ${etiquetaLocal}.`,
      tabla: "horarios",
      items: [
        {
          id: "proximo-inicio",
          pregunta: "¿Cuándo empieza el próximo curso?",
          respuesta: `${PROXIMO_INICIO}. Las clases son dos veces por semana y la fecha vigente de cada cohorte se confirma en la página de Inscripción al momento de pagar.`,
        },
        {
          id: "a-que-hora",
          pregunta: `¿A qué hora son las clases en ${nombre}?`,
          respuesta: esChile
            ? `Las clases son de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}, hora de Chile, los lunes y miércoles o los martes y jueves.`
            : `Las clases son de ${inicioLocal} a ${finLocal}, ${etiquetaLocal}, los lunes y miércoles. La clase se dicta desde Chile, donde empieza a las ${HORA_CLASE_CHILE.inicio}.`,
        },
        {
          id: "que-dias",
          pregunta: "¿Qué días son las clases?",
          respuesta: esChile
            ? "Las clases son los lunes y miércoles, y también hay una segunda opción de martes y jueves. Ambas opciones cubren el mismo temario."
            : `Las clases son los lunes y miércoles en ${nombre}. En Chile también se dicta la opción de martes y jueves; si necesitas esa alternativa, escríbenos por WhatsApp.`,
        },
        {
          id: "horario-mi-pais",
          pregunta: "¿Cómo sé el horario de mi país?",
          respuesta:
            "La tabla de horarios de esta página muestra la hora local de Chile, Argentina, México, Colombia, Perú, Uruguay y Paraguay. Si tu país no aparece, escríbenos por WhatsApp y te confirmamos la hora exacta.",
        },
      ],
    },
    {
      id: "precios",
      titulo: "Precios por país y qué incluye",
      resumen:
        `El arancel se publica en la moneda de cada país y se paga en ${CUOTAS}. El monto vigente, los descuentos y las 3 cuotas sin interés se descargan en el PDF de temario y precios de cada curso; en Paraguay se consulta por WhatsApp.`,
      tabla: "precios",
      items: [
        {
          id: "cuanto-cuestan",
          pregunta: "¿Cuánto cuestan los cursos?",
          respuesta: sinPrecio
            ? "En Paraguay el arancel vigente se consulta por WhatsApp, porque todavía no hay un monto público publicado. El PDF de temario y precios de cada curso y la fecha del próximo inicio se piden por el mismo canal."
            : "El arancel vigente de cada curso, los descuentos y las 3 cuotas sin interés se descargan en su PDF de temario y precios. El PDF se pide con tu nombre, email y WhatsApp, y tanto el precio de venta de tu país como la fecha de inicio vigente se confirman en el checkout.",
        },
        {
          id: "moneda-local",
          pregunta: "¿Los precios están en moneda local?",
          respuesta:
            "Sí: cada país tiene su precio publicado en su moneda. La tabla de esta página muestra Chile en pesos chilenos (CLP), Argentina en pesos argentinos (ARS), México en pesos mexicanos (MXN), Colombia en pesos colombianos (COP), Perú en soles (PEN) y Uruguay en pesos uruguayos (UYU); Paraguay se consulta por WhatsApp.",
        },
        {
          id: "precio-que-veo",
          pregunta: "¿El precio que veo es el que voy a pagar?",
          respuesta:
            "El arancel del PDF de temario y precios es el precio de venta publicado para tu país y es el que toma el checkout al momento de pagar. Si pagas con tarjeta internacional, tu banco puede agregar impuestos o comisiones, y ese cargo final no lo define ProgramBI.",
        },
        {
          id: "licencia-power-bi",
          pregunta: "¿Tengo que pagar una licencia de Power BI para el curso?",
          respuesta:
            "No para aprender: Power BI Desktop es una descarga gratuita de Microsoft y alcanza para hacer todo el curso. Las licencias de pago, como Power BI Pro, se necesitan para publicar y compartir informes dentro de una organización.",
        },
        {
          id: "precio-examen-pl300",
          pregunta: "¿El examen PL-300 está incluido en el curso?",
          respuesta:
            "No: el examen PL-300 se paga directamente a Microsoft y su precio depende del país donde lo rindes. El certificado de ProgramBI, en cambio, está incluido en el valor del curso.",
        },
      ],
    },
    {
      id: "pagos",
      titulo: "Formas de pago y cuotas",
      resumen:
        `Todos los cursos se pueden pagar en ${CUOTAS} y los medios de pago disponibles dependen del país.`,
      tabla: "pagos",
      items: [
        {
          id: "cuotas-sin-interes",
          pregunta: "¿Hay cuotas sin interés?",
          respuesta:
            `Sí: los cursos se pueden pagar en ${CUOTAS} en todos los países, sin recargo por financiamiento.`,
        },
        {
          id: "formas-de-pago",
          pregunta: "¿Qué medios de pago puedo usar?",
          respuesta:
            iso === "py"
              ? `En Paraguay los medios de pago se confirman por WhatsApp, porque el precio todavía no está publicado. El curso se puede pagar en ${CUOTAS}.`
              : `En ${nombre} puedes pagar con ${listaNatural(pais.mediosPago)}.`,
        },
        {
          id: "pagar-desde-otro-pais",
          pregunta: "¿Puedo pagar desde otro país?",
          respuesta:
            "Sí: puedes tomar el curso desde cualquier país y el checkout muestra los medios de pago disponibles. Si pagas con una tarjeta emitida en el extranjero, el cargo final lo define tu banco.",
        },
      ],
    },
    {
      id: "inscripcion",
      titulo: "Cómo inscribirse paso a paso",
      resumen:
        "La inscripción es en línea: creas tu cuenta, confirmas el correo, eliges curso y nivel, y pagas. También puedes escribir por WhatsApp antes de decidir.",
      pasos: [
        "Elige el curso y el nivel: Power BI básico-intermedio o avanzado; Análisis de datos nivel 1 o nivel 2.",
        "Crea tu cuenta en el sitio con tu nombre, correo y contraseña.",
        "Confirma tu correo con el enlace que llega a tu bandeja; si no aparece, revisa spam o pide reenviarlo.",
        "Entra a Inscripción, elige el curso y revisa las fechas disponibles.",
        `Paga en ${CUOTAS} con los medios de pago de tu país.`,
        "Quedas dentro con acceso a las clases en vivo por Zoom y al campus virtual del curso.",
      ],
      items: [
        {
          id: "como-me-inscribo",
          pregunta: "¿Cómo me inscribo en un curso?",
          respuesta:
            `Te inscribes en línea: creas tu cuenta con tu correo, confirmas el enlace de confirmación, eliges el curso y el nivel en la página de Inscripción, y pagas en ${CUOTAS}. Si prefieres, puedes escribir por WhatsApp y el equipo te guía en el mismo proceso.`,
          enlace: { href: href("/pago"), texto: "Ir a Inscripción" },
        },
        {
          id: "necesito-cuenta",
          pregunta: "¿Necesito crear una cuenta para pagar?",
          respuesta:
            "Sí: el checkout pide una cuenta con el correo confirmado, porque ahí queda asociada tu inscripción y el acceso al campus virtual del curso. Crear la cuenta es gratis y no obliga a comprar.",
        },
        {
          id: "info-antes-de-pagar",
          pregunta: "¿Puedo pedir información antes de pagar?",
          respuesta:
            "Sí: puedes escribir por WhatsApp para resolver dudas de temario, horario, requisitos o precio antes de inscribirte, sin compromiso.",
        },
        {
          id: "un-solo-nivel",
          pregunta: "¿Puedo inscribirme a un solo nivel?",
          respuesta:
            "Sí: cada nivel se cursa y se cobra por separado, con su propio temario y horario. Puedes empezar por el básico-intermedio de Power BI o por el nivel 1 de Análisis de datos y decidir después si sigues.",
        },
      ],
    },
    {
      id: "certificado",
      titulo: "Certificado y certificación PL-300",
      resumen:
        "Al completar el curso recibes un certificado de ProgramBI. La certificación PL-300 es un examen de Microsoft distinto, que se rinde y se paga aparte.",
      items: [
        {
          id: "recibo-certificado",
          pregunta: "¿Recibo un certificado al terminar?",
          respuesta:
            "Sí: al completar el curso recibes un certificado de ProgramBI, incluido en el valor del curso. Es un certificado de finalización de ProgramBI; la certificación oficial de Microsoft es la PL-300, que se rinde aparte.",
        },
        {
          id: "certificado-vs-pl300",
          pregunta: "¿El certificado de ProgramBI es lo mismo que la PL-300?",
          respuesta:
            "No: el certificado de ProgramBI acredita que completaste el curso, mientras que la PL-300 es una certificación de Microsoft que se obtiene aprobando su examen.",
        },
        {
          id: "curso-prepara-pl300",
          pregunta: "¿El curso prepara para la certificación PL-300?",
          respuesta:
            "El curso de Power BI cubre las áreas que evalúa la PL-300 —preparar y modelar los datos, visualizar y analizar, y administrar el servicio—, pero no es un curso oficial de Microsoft ni incluye el examen. Para rendirlo, te inscribes directamente con Microsoft.",
          enlace: { href: "/guias/certificacion-pl-300-power-bi", texto: "Ver la guía de la certificación PL-300" },
        },
        {
          id: "que-es-pl300",
          pregunta: "¿Qué es la PL-300?",
          respuesta:
            "La PL-300 es el examen de la certificación Microsoft Certified: Power BI Data Analyst Associate. Según Microsoft Learn, es de nivel intermedio, dura 100 minutos, requiere 700 puntos para aprobar, se puede rendir en español y se renueva gratis cada año.",
        },
      ],
    },
    {
      id: "requisitos",
      titulo: "Requisitos y equipo",
      resumen: `Para Power BI no necesitas saber programar: el nivel básico-intermedio parte desde cero. Necesitas un ${comp} con internet estable; si usas Mac, trabajas con Power BI web.`,
      items: [
        {
          id: "saber-programar",
          pregunta: "¿Necesito saber programar?",
          respuesta:
            "No para empezar con Power BI: el nivel básico-intermedio parte desde los fundamentos. En el curso de Análisis de datos aprenderás SQL y Python dentro del mismo programa, sin conocimientos previos.",
        },
        {
          id: "computador",
          pregunta: `¿Qué ${comp} necesito para el curso?`,
          respuesta: `Para Power BI Desktop necesitas un ${comp} con Windows, porque el programa se instala solo en Windows. Además necesitas una conexión estable a internet para las clases por Zoom.`,
        },
        {
          id: "mac",
          pregunta: "¿Sirve si tengo Mac?",
          respuesta:
            "Sí: si usas Mac, trabajas con Power BI web desde el navegador, porque Power BI Desktop no se instala en macOS. En el curso quienes tienen Mac siguen las clases con Power BI web.",
        },
        {
          id: "excel",
          pregunta: "¿Necesito saber Excel?",
          respuesta:
            "Ayuda tener familiaridad con planillas, pero no es requisito: el curso parte desde los fundamentos de datos. Si tienes dudas sobre tu nivel de entrada, consulta por WhatsApp antes de inscribirte.",
        },
      ],
    },
    {
      id: "despues-del-curso",
      titulo: "Después del curso",
      resumen:
        "Al terminar puedes seguir con el nivel avanzado. El curso entrega la base técnica y práctica, pero no garantiza empleo.",
      items: [
        {
          id: "nivel-avanzado",
          pregunta: "¿Puedo seguir con el nivel avanzado?",
          respuesta:
            "Sí: Power BI tiene un nivel avanzado de 20 horas y Análisis de datos tiene un segundo nivel de 60 horas. Cada nivel se inscribe y se paga por separado.",
        },
        {
          id: "garantiza-empleo",
          pregunta: "¿El curso garantiza empleo?",
          respuesta:
            "No: ningún curso puede garantizar un empleo. Lo que entrega es la base técnica y práctica para postular a roles de análisis de datos o para mejorar en tu trabajo actual.",
        },
        {
          id: "sueldo-analista",
          pregunta: "¿Cuánto gana un analista de datos?",
          respuesta:
            "Depende del país: según Computrabajo, el sueldo medio de un analista de datos es de $13.098 al mes en México y de $2.416.855 al mes en Colombia (consultado el 4 de noviembre de 2026). Las cifras con fuente y por país están en la guía de sueldos.",
          enlace: {
            href: "/guias/sueldo-analista-de-datos-latinoamerica",
            texto: "Ver sueldos de analista de datos por país",
          },
        },
      ],
    },
    {
      id: "glosario",
      titulo: "Glosario rápido",
      resumen: "Términos que aparecen en las clases y en las fichas de los cursos.",
      items: [
        {
          id: "que-es-power-bi",
          pregunta: "¿Qué es Power BI?",
          respuesta:
            "Power BI es la plataforma de inteligencia de negocios de Microsoft: Power BI Desktop sirve para conectar datos, modelarlos y crear informes, y el servicio de Power BI permite publicarlos y compartirlos.",
        },
        {
          id: "que-es-power-bi-service",
          pregunta: "¿Qué es Power BI Service?",
          respuesta:
            "Power BI Service es la parte en la nube de Power BI, donde se publican, comparten y actualizan los informes. Se estudia en el nivel avanzado del curso.",
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
            "DAX es el lenguaje de fórmulas de Power BI, con el que se crean medidas y cálculos sobre el modelo de datos.",
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
            "Escríbenos por WhatsApp con tu país y el curso que te interesa: te respondemos con la fecha, el horario local y el valor vigente. También puedes escribir a contacto@programbi.cl.",
        },
      ],
    },
  ];

  return {
    iso,
    pais,
    path: href("/preguntas-frecuentes"),
    inicioHref: homeDe(iso),
    h1: esChile
      ? "Preguntas frecuentes sobre los cursos de ProgramBI"
      : `Preguntas frecuentes de ProgramBI en ${nombre}`,
    intro: [
      "ProgramBI es una escuela online de inteligencia de negocios y análisis de datos: dicta cursos en vivo por Zoom de Power BI y de Análisis de datos (SQL, Power BI y Python), con campus virtual con las clases y material del curso y certificado al completar.",
      `${introPrecio} ${introHorario}`,
    ],
    ficha: [
      { dato: "Formato", detalle: "Clases en vivo por Zoom, con campus virtual con clases y material" },
      { dato: "Power BI", detalle: "Básico-intermedio: 20 h en 8 módulos · Avanzado: 20 h" },
      { dato: "Análisis de datos", detalle: "2 niveles de 60 h: 20 h SQL + 20 h Power BI + 20 h Python" },
      { dato: "Próximo inicio", detalle: PROXIMO_INICIO },
      { dato: "Días", detalle: esChile ? "Lunes y miércoles, o martes y jueves" : "Lunes y miércoles" },
      { dato: "Horario", detalle: fichaHorario },
      { dato: "Precio", detalle: sinPrecio ? "Se consulta por WhatsApp" : "Arancel vigente, descuentos y 3 cuotas sin interés en el PDF de temario y precios de cada curso" },
      { dato: "Certificado", detalle: "ProgramBI al completar; la PL-300 se rinde aparte con Microsoft" },
    ],
    secciones,
    precios: tablaPrecios(iso),
    horarios: tablaHorarios(iso, hoy),
    pagos: tablaPagos(),
    guias: guiasRelacionadas(iso),
    whatsapp: whatsappHref({
      page: href("/preguntas-frecuentes"),
      country: iso,
      intent: "general",
      extra: "Revisé las preguntas frecuentes y tengo una consulta sobre los cursos.",
    }),
    actualizado: fechaActualizado(),
    actualizadoIso: ACTUALIZADO,
  };
}

/** Todas las preguntas visibles, en orden. Es la lista que alimenta el FAQPage. */
export function preguntasDe(contenido: FaqContenido): FaqItem[] {
  return contenido.secciones.flatMap((seccion) => seccion.items);
}
