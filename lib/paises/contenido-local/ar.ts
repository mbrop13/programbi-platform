import type { DatosBloqueLocal } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { resumenDescuentoCatalogo, resumenDescuentoCursoTexto } from "@/lib/paises/detalle-curso";

const resumenCatalogo = resumenDescuentoCatalogo("ar");
const cuotasAr = textoCuotas("ar");

/**
 * Resumen local para la tarjeta lateral de `CourseDetailClient.tsx` en Argentina.
 * Evita mostrar `COURSE_SEO[slug].intro` de Chile con un simple reemplazo de
 * «Chile» por «Argentina» en `/ar/cursos/power-bi`, `/ar/cursos/analisis-de-datos`
 * y `/ar/cursos/python`.
 */
const INTRO_FICHA_AR: Record<string, string[]> = {
  "power-bi": [
    "Curso de Power BI en vivo por Zoom para analistas financieros, control de gestión y equipos de pymes, agro, fintech, retail e industria en Argentina que necesitan transformar extractos del ERP y comprobantes de ARCA (ex AFIP) en un tablero mantenible.",
    `El nivel abierto es básico-intermedio (20 horas en 8 módulos) y se cursa en horario de Buenos Aires: de 19:30 a 21:30 durante el verano chileno y de 20:30 a 22:30 en invierno chileno. Practicás Power Query, modelo estrella y DAX aplicando el IPC del INDEC y parámetros cambiarios del BCRA.`,
    `El valor referencial en pesos argentinos (ARS) se descarga en el PDF «Temario y precios» de esta ficha, con pago con tarjeta internacional vía Mercado Pago (cobro procesado en CLP desde Chile) en ${cuotasAr} o transferencia internacional. Para capacitar a un equipo en los niveles básico-intermedio y avanzado, podés cotizar desde la pestaña Empresas.`,
  ],
  "analisis-de-datos": [
    "Programa de Análisis de Datos en vivo por Zoom para profesionales de finanzas, operaciones y comercial en Argentina que buscan dominar el flujo completo del analista: consultas en SQL Server, modelado en Power BI y automatización con Python.",
    `Consta de dos niveles de 60 horas cada uno (20 horas por herramienta; 120 horas el recorrido completo) en horario de Buenos Aires (UTC-3): 19:30 a 21:30 en verano chileno y 20:30 a 22:30 en invierno chileno. Los proyectos integradores trabajan con bases de ARCA (ex AFIP), series del INDEC, indicadores del BCRA y datos abiertos de datos.gob.ar.`,
    `El valor referencial por nivel en pesos argentinos (ARS) figura en el PDF «Temario y precios» y se abona con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en ${cuotasAr} o transferencia internacional. Incluye grabaciones en el campus virtual durante la cursada y certificado digital de ProgramBI.`,
  ],
  python: [
    "Curso de Python para Datos en vivo por Zoom orientado a analistas financieros, administrativos de pymes y equipos de agro, fintech, retail e industria en Argentina que buscan automatizar reportes con Pandas y Matplotlib sin experiencia previa en programación.",
    `Son 20 horas prácticas en horario de Buenos Aires: de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno. Se trabaja la limpieza de listas de precios con coma decimal, normalización de CUIT de ARCA (ex AFIP) y ajuste de series con datos del INDEC y del BCRA.`,
    `Consultá el valor referencial vigente en pesos argentinos (ARS) descargando el PDF «Temario y precios» de la ficha; el pago se procesa con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en ${cuotasAr} o transferencia internacional.`,
  ],
};

export function getIntroFichaAr(slug: string): string[] | null {
  return INTRO_FICHA_AR[slug] ?? null;
}

/**
 * Bloque local de Argentina.
 *
 * Datos duros y su fuente:
 * - Moneda, zona horaria y medios de pago: `config/paises.ts` (entrada `ar`).
 * - Precio: `PRECIOS_ARS` / `PRECIOS_LISTA_ARS` en `config/paises.ts`; el monto
 *   visible se descarga en el brochure por la regla de `lib/pricing-gate.ts`.
 * - Cuotas: `config/cuotas.ts` (3, sin interés, todos los mercados).
 * - Horario base: `lib/paises/horarios.ts` (19:30–21:30 hora Chile).
 * - Contexto sectorial: `lib/data/contenido-paises/ar.ts` (sin inventar casos).
 */
const datos: DatosBloqueLocal = {
  iso: "ar",
  nombre: "Argentina",
  moneda: "ARS",
  zonaHoraria: "America/Argentina/Buenos_Aires",
  datos: {
    precioTitulo: "Precio en pesos argentinos",
    precioDetalle:
      "El catálogo de Argentina se publica en ARS con {cuotas}. Consulta el valor vigente de cada curso en su PDF de temario y precios.",
    horarioDetalle:
      "Argentina mantiene la misma hora todo el año. La clase de 19:30 a 21:30 en Chile se cursa de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno.",
    pagoDetalle:
      "El pago se procesa con tarjeta internacional vía Mercado Pago (el cobro se realiza en CLP desde Chile y tu banco efectúa la conversión) en {cuotas} o mediante transferencia internacional.",
    cuotasDetalle: "Sin recargo por financiamiento con tarjeta vía Mercado Pago. La pasarela confirma las cuotas disponibles al pagar.",
    claseGratis:
      "Hay clase gratis para conocer la modalidad. La fecha se avisa cuando está confirmada; no se publican cupos que todavía no existen.",
    certificado:
      "Certificado digital de ProgramBI al completar el curso, con código de verificación para LinkedIn o una búsqueda laboral.",
  },
  paginas: {
    hub: {
      kicker: "Argentina · datos del mercado",
      titulo: "Estudiar datos en vivo desde Argentina",
      intro:
        "Clases en vivo por Zoom seguidas en horario de Buenos Aires, con valores en pesos argentinos (ARS).",
      parrafos: [
        "La franja de 19:30 a 21:30 en Chile se ve en Argentina de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno, ya que el país mantiene UTC-3 todo el año. Cada curso publica su valor referencial en ARS dentro del PDF «Temario y precios» y se abona con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.",
        "Los programas están orientados a analistas financieros, pymes, agro y exportación, fintech, retail e industria que consolidan comprobantes de ARCA (ex AFIP), datos del ERP y tesorería. En clase se trabaja con el IPC del INDEC y series del BCRA para expresar márgenes y ventas en moneda constante.",
        "Las sesiones quedan grabadas en el campus virtual junto con los datasets de práctica y entregan certificado digital de ProgramBI. En las guías de Argentina para Power BI, Análisis de Datos y Python podés consultar el recorrido sugerido y las referencias salariales de Sysarmy.",
      ],
      faqs: [
        {
          q: "¿A qué hora son las clases en Argentina?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Argentina mantiene la misma hora todo el año: cuando Chile está en horario de verano la clase se ve de 19:30 a 21:30 y, cuando Chile vuelve a UTC-4 en invierno, se ve de 20:30 a 22:30. La ficha de la cohorte confirma la hora exacta.",
        },
        {
          q: "¿El precio está en pesos argentinos?",
          a: `${resumenCatalogo} Si la cuenta local no está habilitada, el checkout muestra el equivalente en CLP.`,
        },
        {
          q: "¿Puedo pagar desde Argentina?",
          a: "Sí: con tarjeta de crédito o débito internacional vía Mercado Pago en {cuotas} (el cobro se procesa en CLP desde Chile y tu banco realiza la conversión) o mediante transferencia internacional coordinada con admisiones.",
        },
        {
          q: "¿Hay cuotas sin interés?",
          a: "Sí: los cursos se pueden pagar en {cuotas} con tarjeta vía Mercado Pago, según la disponibilidad de tu banco emisor, sin recargo por financiamiento.",
        },
        {
          q: "¿El certificado sirve para LinkedIn?",
          a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI con código de verificación, que puedes adjuntar a tu perfil o presentar en una búsqueda laboral. No reemplaza una certificación oficial de Microsoft.",
        },
        {
          q: "¿Puedo tomar el curso si vivo en el interior?",
          a: "Sí. Todas las clases son en vivo por Zoom y quedan grabadas en el campus; solo necesitas una conexión estable. El horario de referencia es el de Buenos Aires (UTC-3), y la conversión desde Chile se muestra en cada ficha.",
        },
      ],
    },
    cursos: {
      kicker: "Catálogo para Argentina",
      titulo: "Qué curso de datos conviene según tu rol",
      intro:
        "Trece fichas y tres recorridos posibles: reportes y tableros, datos y programación, o automatización e IA. Todos en vivo, con grabaciones y certificado.",
      parrafos: [
        "Si tu trabajo es armar reportes de gestión, el recorrido corto es Excel y después Power BI. Si necesitas extraer datos de varias tablas o sistemas, suma SQL Server. Si el volumen, la limpieza o la automatización lo piden, entra Python. No hace falta hacer los tres: el orden depende del problema que tengas hoy en tu área.",
        "Para administración y procesos, Access resuelve la base de un área y Power Automate el circuito de tareas repetitivas. Para análisis avanzado o finanzas, machine learning y mercado financiero tienen ficha propia. Copilot, Claude e IA en productividad cubren el uso diario de asistentes; análisis para minería aplica el mismo programa de análisis de datos a turnos, flota y mantenimiento.",
        "Cada ficha declara duración, nivel y temario antes de inscribirte. El PDF de temario y precios de Argentina incluye el valor en pesos, las fechas de la cohorte y las {cuotas}. La tabla de precios muestra la duración de todos los cursos en una sola vista para comparar antes de elegir.",
        "Si dudas entre dos cursos, la pregunta útil es qué entregable necesitas: un tablero, una consulta, un script o una base. Esa respuesta ordena el recorrido mejor que la lista de herramientas. El equipo de admisiones también puede revisar tu caso antes de que pagues.",
      ],
      faqs: [
        {
          q: "¿Por dónde empiezo si nunca usé Power BI?",
          a: "Por Power BI o por Excel, según lo que uses hoy. Power BI parte de Power Query y no exige DAX previo; Excel te da la base para ordenar tablas y fórmulas. Si tu objetivo es el oficio completo de analista, el programa de análisis de datos combina SQL, Power BI y Python.",
        },
        {
          q: "¿Los cursos son en vivo o grabados?",
          a: "Las clases son en vivo por Zoom, con dos encuentros por semana. Quedan grabadas en el campus para repasar o recuperar una sesión. Las dudas se trabajan en la clase siguiente.",
        },
        {
          q: "¿Puedo combinar dos cursos?",
          a: "Sí. Puedes tomar más de un curso y el checkout permite elegir; el equipo de admisiones ayuda a ordenar el recorrido para no pagar dos veces por contenidos que se solapan. No hay un pack obligatorio.",
        },
        {
          q: "¿Necesito una computadora con Windows?",
          a: "Para Power BI Desktop, Access y SQL Server conviene Windows: son las versiones que se usan en clase. Python y las herramientas de IA funcionan también en macOS o Linux. Power BI tiene versión web para consultar informes publicados.",
        },
        {
          q: "¿Incluye datos para practicar?",
          a: "Sí. Los ejercicios usan datasets de práctica y plantillas provistas en el campus. No se comparten datos de clientes ni de empresas; los casos se trabajan con información de ejemplo o anonimizada.",
        },
        {
          q: "¿Cómo se paga desde Argentina?",
          a: `${resumenCatalogo} El pago se procesa con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) o transferencia internacional.`,
        },
      ],
    },
    "curso:power-bi": {
      kicker: "Power BI · Argentina",
      titulo: "Power BI en vivo para analistas argentinos",
      intro:
        "Veinte horas en vivo por Zoom para pasar de Power Query a un tablero con DAX en horario de Buenos Aires (UTC-3).",
      parrafos: [
        "El curso básico-intermedio se dicta en la franja de 19:30 a 21:30 de Chile, que en Argentina corresponde a 19:30 a 21:30 durante el verano chileno y a 20:30 a 22:30 en invierno chileno. El valor referencial en pesos argentinos (ARS) se descarga en el PDF «Temario y precios» de esta ficha y se paga con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.",
        "Está diseñado para analistas financieros, responsables de control de gestión y equipos de pymes, agro y exportación, fintech, retail e industria que hoy cruzan en Excel la facturación electrónica de ARCA (ex AFIP) con el ERP. El programa cubre Power Query, modelo estrella y medidas DAX como CALCULATE, FILTER, SUMX y RANKX.",
        "Los ejercicios resuelven la comparación interanual con inflación vinculando el IPC mensual del INDEC al calendario y parametrizando el tipo de cambio del BCRA para separar variación nominal y real. Si tu empresa requiere básico-intermedio y avanzado para un equipo, se cotiza en modalidad in-company.",
      ],
      faqs: [
        {
          q: "¿Cuántas horas y módulos tiene el curso?",
          a: "El curso abierto es básico-intermedio, de 20 horas y 8 módulos, en vivo por Zoom. El avanzado también dura 20 horas y cubre publicación en Power BI Service y seguridad a nivel de fila.",
        },
        {
          q: "¿Necesito saber DAX antes de inscribirme?",
          a: "No. El curso parte en Power Query y sigue con el modelo y DAX desde cero. La publicación y el RLS quedan para el nivel avanzado.",
        },
        {
          q: "¿Se trabaja la inflación en el tablero?",
          a: "Sí. Los ejercicios usan el IPC mensual del INDEC como tabla relacionada con el calendario y calculan ventas en moneda constante con iteradores. También se practica dejar el tipo de cambio del BCRA como parámetro del modelo.",
        },
        {
          q: "¿A qué hora se ve desde Argentina?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Argentina mantiene la misma hora todo el año: en verano chileno se cursa de 19:30 a 21:30 y en invierno chileno de 20:30 a 22:30. La ficha de la cohorte muestra la hora exacta.",
        },
        {
          q: "¿Cuánto cuesta y cómo se paga?",
          a: `${resumenDescuentoCursoTexto("ar", "power-bi", "Power BI")} Se paga con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.`,
        },
        {
          q: "¿Qué certificado recibo?",
          a: "Un certificado digital de ProgramBI al completar el curso, con código de verificación. Es distinto del examen PL-300 de Microsoft, que se paga aparte si decides rendirlo.",
        },
      ],
    },
    "curso:analisis-de-datos": {
      kicker: "Análisis de datos · Argentina",
      titulo: "Análisis de datos: de Excel a SQL, Power BI y Python",
      intro:
        "Dos niveles de 60 horas cada uno (120 horas el programa completo) integrando SQL Server, Power BI y Python para profesionales de Argentina.",
      parrafos: [
        "Cada nivel combina 20 horas de SQL Server, 20 de Power BI y 20 de Python en vivo por Zoom. La clase de 19:30 a 21:30 en Chile se sigue en Argentina de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno. Consultá el valor referencial en pesos argentinos (ARS) en el PDF «Temario y precios»; se abona con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.",
        "Apunta a analistas financieros, profesionales de pymes, agro y exportación, fintech, retail e industria que buscan cubrir el flujo completo del dato sin depender de archivos sueltos: extraer comprobantes de ARCA (ex AFIP) y ventas con SQL, limpiar con Pandas y publicar el modelo en Power BI.",
        "El proyecto integrador permite trabajar con series del INDEC, indicadores cambiarios y monetarios del BCRA o datasets abiertos de datos.gob.ar, armando un portafolio alineado con las búsquedas locales relevadas por Sysarmy.",
      ],
      faqs: [
        {
          q: "¿Son 60 horas por nivel o 120 en total?",
          a: "Cada nivel dura 60 horas: 20 de SQL Server, 20 de Power BI y 20 de Python. Si haces los dos niveles, el programa completo suma 120 horas. Se paga por nivel.",
        },
        {
          q: "¿Sirve si vengo de Excel y no programé nunca?",
          a: "Sí. El nivel básico-intermedio parte de fundamentos y avanza hacia consultas, modelado y visualización. No se exige experiencia previa en programación; sí conviene manejar Excel con soltura.",
        },
        {
          q: "¿Qué proyecto final puedo hacer desde Argentina?",
          a: "Un tablero sobre datos públicos argentinos —por ejemplo, IPC del INDEC, datos abiertos de datos.gob.ar o series del BCRA— o un caso de tu trabajo con datos anonimizados. La condición es que la pregunta de negocio y las fuentes queden documentadas.",
        },
        {
          q: "¿Es lo mismo que el curso de análisis para minería?",
          a: "Es el mismo programa de 60 horas por nivel, con los ejemplos puestos en faena: turnos, flota, OEE y mantenimiento. El certificado y la carga horaria son los mismos; cambia el contexto de los ejercicios.",
        },
        {
          q: "¿A qué hora se dicta desde Argentina?",
          a: "La referencia es 19:30 a 21:30, hora de Chile. Argentina mantiene la misma hora todo el año, así que la clase se cursa de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno. La ficha de la cohorte confirma la hora local.",
        },
        {
          q: "¿Cómo se consulta el valor y hay cuotas?",
          a: `${resumenDescuentoCursoTexto("ar", "analisis-de-datos", "Análisis de Datos")} El pago se procesa con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.`,
        },
      ],
    },
    "curso:python": {
      kicker: "Python · Argentina",
      titulo: "Python para datos: automatización y análisis con Pandas",
      intro:
        "Veinte horas en vivo desde cero para limpiar tablas, cruzar listas de precios y automatizar reportes con Pandas y Matplotlib.",
      parrafos: [
        "Las clases se dictan de 19:30 a 21:30 en hora de Chile y se siguen desde Argentina de 19:30 a 21:30 durante el verano chileno o de 20:30 a 22:30 en el invierno chileno. El valor referencial en pesos argentinos (ARS) está disponible en el PDF «Temario y precios» de la ficha, con pago por tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.",
        "Está enfocado en analistas financieros, administrativos de pymes y equipos de agro y exportación, fintech, retail e industria que pierden horas consolidando listas de proveedores, normalizando números de CUIT de ARCA (ex AFIP) o corrigiendo separadores de miles y coma decimal antes de cada cierre.",
        "En las prácticas se automatizan cruces con Pandas, se deflactan series nominales usando el IPC del INDEC y variables del BCRA, y se exportan bases listas para SQL Server o Power BI sin requerir experiencia previa en programación.",
      ],
      faqs: [
        {
          q: "¿Necesito saber programar antes?",
          a: "No. El curso parte desde los fundamentos de Python y avanza hacia Pandas, visualización y automatización. Está pensado para analistas, no para desarrolladores.",
        },
        {
          q: "¿Cuántas horas tiene el curso?",
          a: "El nivel básico-intermedio dura 20 horas en 8 módulos en vivo por Zoom. Antes de inscribirte puedes descargar el PDF de temario y precios con el detalle módulo por módulo.",
        },
        {
          q: "¿Se aplica a datos de una empresa argentina?",
          a: "Sí. Los ejercicios usan archivos de ventas, costos, normalización de CUIT de ARCA (ex AFIP) y series de precios del INDEC, trabajando con separadores de miles y fechas locales. También se practica dejar el tipo de cambio del BCRA como parámetro.",
        },
        {
          q: "¿Python reemplaza a Power BI o a Excel?",
          a: "No. Python sirve para limpiar, automatizar y analizar; Power BI para modelar y publicar tableros; Excel sigue siendo útil para cálculos puntuales. El curso muestra cómo pasarse datos entre las tres herramientas.",
        },
        {
          q: "¿A qué hora se ve desde Argentina?",
          a: "La clase se dicta de 19:30 a 21:30, hora de Chile. En Argentina se cursa de 19:30 a 21:30 durante el verano chileno y de 20:30 a 22:30 durante el invierno chileno. La ficha de la cohorte muestra la conversión.",
        },
        {
          q: "¿Cómo se paga el curso?",
          a: `${resumenDescuentoCursoTexto("ar", "python", "Python para Datos")} Se paga con tarjeta internacional vía Mercado Pago (cobro en CLP desde Chile) en {cuotas} o transferencia internacional.`,
        },
      ],
    },
    empresas: {
      kicker: "Empresas · Argentina",
      titulo: "Capacitación in-company con datos argentinos",
      intro:
        "Cursos cerrados para equipos: Power BI, Excel, SQL, Python, automatización e IA, con los datos de la empresa, en vivo y con factura corporativa.",
      parrafos: [
        "Una capacitación in-company no empieza por el temario: empieza por el reporte que el equipo arma cada mes. En una empresa argentina ese reporte suele cruzar ventas del ERP, comprobantes de ARCA (ex AFIP), stock, tesorería y algún archivo de campo. El objetivo del programa es que ese circuito quede en un tablero que el propio equipo pueda mantener, no en una dependencia nueva de una consultora.",
        "El formato es en vivo por Zoom, con el mismo instructor del curso abierto y ejercicios sobre datos de la empresa —anonimizados— o sobre datasets de práctica cuando la información es sensible. Se puede trabajar por grupos: un grupo base de Excel y Power BI, un grupo de SQL para quienes extraen datos y un grupo de automatización con Power Automate o Python.",
        "La propuesta define alcance, cantidad de participantes, horas, modalidad y moneda. La facturación corporativa se coordina con el equipo de admisiones; el pago puede hacerse en pesos argentinos o en la moneda que indique la propuesta. No se publican precios de in-company en la web porque dependen del alcance.",
        "Los sectores con los que se trabaja son agro y exportación (costos por campaña, margen por lote), fintech y servicios financieros (cartera, mora, originación), retail y e-commerce (venta por canal, margen por categoría) e industria y energía (producción, paradas, costo por planta). Son escenarios de trabajo por industria, no casos de clientes ni resultados prometidos.",
        "Antes de cotizar se hace un diagnóstico breve: qué datos existen, quién los usa y qué decisión falta. Con eso se propone un alcance realista. Si el problema se resuelve con un tablero puntual, se dice; si conviene un programa más largo o sumar una base de datos, también. La capacitación no reemplaza un proyecto de implementación, pero puede preparar al equipo para sostenerlo.",
        "La modalidad permite trabajar con el equipo de datos interno o con el área dueña del proceso. En la primera sesión se acuerdan el alcance, los entregables y la forma de trabajo; al cierre se revisa el tablero o el flujo construido y se deja documentado para que el equipo pueda repetirlo sin el instructor.",
      ],
      faqs: [
        {
          q: "¿La capacitación es presencial o por Zoom?",
          a: "Se dicta en vivo por Zoom, con el mismo formato del curso abierto. Se puede coordinar un grupo cerrado para la empresa y ajustar el calendario a la operación del equipo.",
        },
        {
          q: "¿Usan nuestros datos reales?",
          a: "Se puede trabajar con datos de la empresa anonimizados o con datasets de práctica cuando la información es sensible. El alcance y las condiciones de confidencialidad se acuerdan en la propuesta antes de empezar.",
        },
        {
          q: "¿Cómo se factura y en qué moneda?",
          a: "La propuesta indica alcance, moneda y condiciones de facturación. La factura corporativa se coordina con admisiones y el pago puede hacerse en pesos argentinos o en la moneda que defina la propuesta.",
        },
        {
          q: "¿Qué cursos se pueden combinar?",
          a: "Power BI, Excel, SQL Server, Python, Power Automate, Access, IA en productividad, Copilot y Claude se pueden combinar según el rol del equipo. El diagnóstico previo define qué combinación tiene sentido y cuál sería redundante.",
        },
        {
          q: "¿Incluye certificado para los participantes?",
          a: "Sí. Cada participante recibe el certificado digital de ProgramBI al completar el programa, con código de verificación. El certificado es de ProgramBI, no una certificación oficial de Microsoft.",
        },
        {
          q: "¿Se puede pagar en cuotas?",
          a: "Los cursos abiertos admiten {cuotas}. En in-company, las condiciones de pago se acuerdan en la propuesta según el alcance y la modalidad de facturación.",
        },
      ],
    },
    precios: {
      kicker: "Precios · Argentina",
      titulo: "Cómo se publica el precio en Argentina",
      intro:
        "Moneda ARS, PDF de temario y precios de cada curso, y checkout con Mercado Pago. El monto se confirma antes de pagar y las {cuotas} aplican a todos los cursos.",
      parrafos: [
        "Todos los cursos tienen un precio publicado en pesos argentinos. El valor vigente y las {cuotas} se descargan en el PDF de temario y precios de cada curso; la tabla de esta página muestra duración y nivel, y el checkout confirma el monto antes de pagar. No hay un precio distinto por comprar desde otra ciudad: la moneda es la del mercado argentino.",
        "El pago se procesa con tarjeta internacional vía Mercado Pago (el cobro se realiza en CLP desde Chile y tu banco efectúa la conversión) o mediante transferencia internacional coordinada con admisiones. El valor referencial en ARS figura en el PDF «Temario y precios» de cada ficha.",
        "Pagar desde el exterior es posible. El checkout muestra los medios disponibles y, si usas una tarjeta emitida en otro país, el cargo final lo define tu banco, incluidos los impuestos o comisiones que aplique. ProgramBI no fija ese cargo. Si necesitas una factura corporativa, el equipo de admisiones coordina los datos antes del pago.",
        "El precio incluye clases en vivo por Zoom, grabaciones en el campus y certificado digital al completar. No incluye licencias de pago de Microsoft ni el examen PL-300, que se pagan aparte si decides rendirlos. Las licencias de Power BI Pro solo hacen falta para publicar y compartir informes dentro de una organización.",
        "Antes de pagar puedes revisar la ficha del curso, el PDF de temario y precios, y la fecha de la cohorte. Si el curso que buscas no tiene una cohorte abierta, admisiones confirma cuándo se publica la siguiente. No se anuncia una fecha ni cupos que no estén confirmados.",
      ],
      faqs: [
        {
          q: "¿Cómo consulto el valor de un curso?",
          a: `${resumenCatalogo} El checkout confirma el importe final antes de pagar.`,
        },
        {
          q: "¿Los precios están en ARS?",
          a: "Sí. El catálogo de Argentina se publica en pesos argentinos. Si el checkout usa la cuenta de Chile porque la cuenta local no está habilitada, muestra el equivalente en CLP antes de confirmar.",
        },
        {
          q: "¿Las {cuotas} aplican a todos los cursos?",
          a: "Sí: todos los cursos admiten {cuotas}, sin recargo por financiamiento. La pasarela confirma las cuotas disponibles según el medio de pago y el banco.",
        },
        {
          q: "¿Puedo pagar con una tarjeta del exterior?",
          a: "Sí. El checkout muestra los medios disponibles y, si la tarjeta fue emitida en otro país, el cargo final lo define tu banco, incluidos los impuestos o comisiones que aplique. ProgramBI no fija ese cargo.",
        },
        {
          q: "¿El certificado y el examen PL-300 están incluidos?",
          a: "El certificado digital de ProgramBI está incluido al completar el curso. El examen PL-300 se paga directamente a Microsoft y su precio depende del país donde lo rindes; no está incluido.",
        },
        {
          q: "¿Dónde veo las fechas y los cupos?",
          a: "En la ficha del curso y en el PDF de temario y precios. Cuando no hay una cohorte confirmada, la fecha se publica recién cuando está cerrada; no se anuncian cupos que todavía no existen.",
        },
      ],
    },
  },
};

export default datos;
