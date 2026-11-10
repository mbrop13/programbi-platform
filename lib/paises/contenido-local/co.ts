import type { DatosBloqueLocal } from "./tipos";

/**
 * Bloque local de Colombia.
 *
 * Datos duros y su fuente:
 * - Moneda, zona horaria y medios de pago: `config/paises.ts` (entrada `co`).
 * - Precio: tabla `precios(299900, 599900)` y `listas(440000)` en
 *   `config/paises.ts`; el monto visible se descarga en el brochure por la
 *   regla de `lib/pricing-gate.ts`.
 * - Cuotas: `config/cuotas.ts` (3, sin interés, todos los mercados).
 * - Horario base: `lib/paises/horarios.ts` (19:30–21:30 hora Chile).
 * - Contexto sectorial: `lib/data/contenido-paises/co.ts` (sin inventar casos).
 */
const datos: DatosBloqueLocal = {
  iso: "co",
  nombre: "Colombia",
  moneda: "COP",
  zonaHoraria: "America/Bogota",
  datos: {
    precioTitulo: "Precio en pesos colombianos",
    precioDetalle:
      "El catálogo de Colombia se publica en COP. Consulta el valor vigente de cada curso en su PDF de temario y precios: ahí están el monto, los descuentos y las fechas. El checkout confirma el importe antes de pagar.",
    horarioDetalle:
      "Colombia se mantiene en UTC-5 todo el año, sin horario de verano. La clase de 19:30 en Chile se ve a las 17:30 en Bogotá cuando Chile está en UTC-3 y a las 18:30 cuando Chile vuelve a UTC-4. La ficha de la cohorte muestra la equivalencia.",
    pagoDetalle:
      "El checkout procesa el pago con Mercado Pago Colombia y muestra PSE o Nequi cuando están habilitados. Si la cuenta local no está disponible, informa el equivalente en pesos chilenos antes de confirmar.",
    cuotasDetalle: "Sin recargo por financiamiento. La pasarela confirma las cuotas disponibles al pagar.",
    claseGratis:
      "Hay clase gratis para conocer la modalidad. La fecha se avisa cuando está confirmada; no se publican cupos que todavía no existen.",
    certificado:
      "Certificado digital de ProgramBI al completar el curso, con código de verificación para LinkedIn o un proceso de selección.",
  },
  paginas: {
    hub: {
      kicker: "Colombia · datos del mercado",
      titulo: "Estudiar datos en vivo desde Colombia",
      intro:
        "La clase se dicta desde Chile y se sigue en hora de Bogotá. El programa y el certificado son los mismos; cambian la moneda, los medios de pago y la conversión horaria.",
      parrafos: [
        "Colombia combina sectores muy intensivos en datos: banca y seguros, salud, telecomunicaciones, retail, logística y una industria grande de servicios para el exterior. En todos se repite el mismo problema: el reporte depende de alguien que pega datos en Excel. El curso apunta a que ese reporte tenga dueño, fuente y una actualización previsible.",
        "El catálogo tiene trece fichas: Power BI, análisis de datos, SQL Server, Python, Excel, Access, Copilot, Claude, IA en productividad, Power Automate, machine learning, mercado financiero y análisis para minería. Cada una declara duración, nivel y contenido, y su PDF de temario y precios en pesos colombianos reúne el valor y las fechas de la cohorte.",
        "El punto de partida habitual es Excel para ordenar, SQL para extraer y Power BI para modelar y publicar. No se pide experiencia en programación para empezar. Las clases quedan grabadas en el campus, así que quien tiene turnos o viaja puede recuperar la sesión y traer las dudas al encuentro siguiente.",
        "Si trabajas en Bogotá, Medellín, Cali o Barranquilla, el horario de referencia sigue siendo el de Bogotá (UTC-5). La conversión desde Chile se calcula en cada ficha; no hay que hacer cuentas a mano ni depender de una tabla fija, porque Chile sí cambia de horario.",
      ],
      faqs: [
        {
          q: "¿A qué hora son las clases en Colombia?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Colombia mantiene UTC-5 todo el año: con Chile en horario de verano se ve de 17:30 a 19:30 y, con Chile en UTC-4, de 18:30 a 20:30. La ficha de la cohorte confirma la hora local.",
        },
        {
          q: "¿El precio está en pesos colombianos?",
          a: "Sí. El catálogo de Colombia se publica en COP y el valor vigente de cada curso se descarga en su PDF de temario y precios. El checkout confirma el monto antes de pagar y, si la cuenta local no está habilitada, muestra el equivalente en CLP.",
        },
        {
          q: "¿Cómo puedo pagar desde Colombia?",
          a: "Con Mercado Pago Colombia (tarjeta de crédito o débito), PSE, Nequi o transferencia bancaria en pesos, según los medios habilitados en el checkout. Si pagas con una tarjeta del exterior, el cargo final lo define tu banco.",
        },
        {
          q: "¿Hay cuotas sin interés?",
          a: "Sí: todos los cursos se pueden pagar en {cuotas}, sin recargo por financiamiento. La disponibilidad final la confirma la pasarela en el checkout.",
        },
        {
          q: "¿El certificado es oficial de Microsoft?",
          a: "No. Es un certificado digital de ProgramBI al completar el curso, con código de verificación. La certificación oficial de Microsoft es el examen PL-300, que se paga aparte si decides rendirlo.",
        },
        {
          q: "¿Puedo tomar el curso desde otra ciudad?",
          a: "Sí. Las clases son en vivo por Zoom y quedan grabadas en el campus; solo necesitas conexión estable. El horario de referencia es el de Bogotá (UTC-5) y aplica para todo el país.",
        },
      ],
    },
    cursos: {
      kicker: "Catálogo para Colombia",
      titulo: "Qué curso de datos conviene según tu rol",
      intro:
        "Trece fichas y tres recorridos: reportes y tableros, extracción y programación, o automatización e IA. Todos en vivo, con grabaciones y certificado.",
      parrafos: [
        "Si tu trabajo es consolidar ventas, cartera o indicadores de área, el recorrido corto es Excel y después Power BI. Si los datos viven en varias tablas o en un sistema corporativo, suma SQL Server. Si necesitas limpiar archivos grandes, automatizar cierres o trabajar con Python, ese es el siguiente paso. No hace falta hacer todo: el orden depende del problema que tengas hoy.",
        "Para administración y procesos, Access resuelve la base de un área y Power Automate el circuito de tareas repetitivas. Para análisis avanzado o finanzas, machine learning y mercado financiero tienen ficha propia. Copilot, Claude e IA en productividad cubren el uso diario de asistentes; análisis para minería aplica el programa de análisis de datos a turnos, flota y mantenimiento.",
        "Cada ficha declara duración, nivel y temario antes de inscribirte. El PDF de temario y precios de Colombia incluye el valor en pesos, las fechas y las {cuotas}. La tabla de precios muestra la duración de todos los cursos en una sola vista para comparar antes de elegir.",
        "Si dudas entre dos cursos, piensa en el entregable: un tablero, una consulta, un script o una base. Esa respuesta ordena mejor el recorrido que la lista de herramientas. Admisiones también puede revisar tu caso antes de que pagues.",
      ],
      faqs: [
        {
          q: "¿Por dónde empiezo si vengo de Excel?",
          a: "Por Power BI si tu objetivo es un tablero, o por Excel si primero necesitas ordenar tablas y fórmulas. Si buscas el oficio completo de analista, el programa de análisis de datos combina SQL, Power BI y Python.",
        },
        {
          q: "¿Las clases son en vivo o grabadas?",
          a: "Son en vivo por Zoom, con dos encuentros por semana. Quedan grabadas en el campus para repasar o recuperar una sesión, y las dudas se trabajan en la clase siguiente.",
        },
        {
          q: "¿Puedo tomar dos cursos a la vez?",
          a: "Sí, siempre que los horarios no se crucen. El checkout permite elegir más de un curso y admisiones ayuda a ordenar el recorrido para no pagar dos veces por contenidos que se solapan.",
        },
        {
          q: "¿Necesito Windows para tomar los cursos?",
          a: "Para Power BI Desktop, Access y SQL Server conviene Windows: son las versiones que se usan en clase. Python y las herramientas de IA funcionan también en macOS o Linux. Power BI tiene versión web para consultar informes publicados.",
        },
        {
          q: "¿Los ejercicios usan datos reales de empresas colombianas?",
          a: "Los ejercicios usan datasets de práctica y plantillas del campus, con estructuras habituales en retail, cartera, salud o logística. No se comparten datos de clientes ni de empresas; los casos se trabajan con información de ejemplo o anonimizada.",
        },
        {
          q: "¿Cómo se paga desde Colombia?",
          a: "Con Mercado Pago Colombia, PSE, Nequi o transferencia bancaria en pesos, según los medios habilitados. Todos los cursos admiten {cuotas} y el checkout confirma el monto final.",
        },
      ],
    },
    "curso:power-bi": {
      kicker: "Power BI · Colombia",
      titulo: "Power BI en vivo para analistas colombianos",
      intro:
        "El curso abierto es básico-intermedio: veinte horas para pasar de Power Query a un tablero con DAX, con el valor en pesos y la hora de Bogotá.",
      parrafos: [
        "El programa cubre Power Query y M para limpiar y combinar archivos, el modelo estrella, las medidas con CALCULATE y FILTER, inteligencia de tiempo, RANKX e iteradores como SUMX. Cierra con una introducción a IA en Power BI y un tablero propio que se puede mostrar en una entrevista o en el comité de área.",
        "En Colombia los ejercicios usan estructuras habituales del mercado local: ventas por sede y canal, cartera por producto, recaudo con PSE o Nequi y reportes de servicio. También se practica el formato de cifras grandes en COP —mostrar millones en las tarjetas— para que el tablero se lea de un vistazo y no dependa de zoom.",
        "El curso avanzado, también de veinte horas, cubre publicación en Power BI Service y seguridad a nivel de fila. El curso abierto es el básico-intermedio; si la empresa necesita los tres niveles para un equipo, se cotiza la vista in-company con los datos de la organización.",
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
          q: "¿Se trabaja con cartera y recaudo?",
          a: "Sí. Los ejercicios incluyen cartera por producto y canal, y cruces de recaudo con medios de pago. Son estructuras de práctica, no datos de una empresa real.",
        },
        {
          q: "¿A qué hora se ve desde Colombia?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Colombia está en UTC-5 todo el año: en verano chileno se ve de 17:30 a 19:30 y en invierno chileno, de 18:30 a 20:30. La ficha de la cohorte confirma la hora.",
        },
        {
          q: "¿Cuánto cuesta y cómo se paga?",
          a: "El valor vigente está en el PDF de temario y precios del curso, en pesos colombianos. Se paga con Mercado Pago Colombia, PSE, Nequi o transferencia, y todos los cursos admiten {cuotas}.",
        },
        {
          q: "¿Qué certificado recibo?",
          a: "Un certificado digital de ProgramBI al completar el curso, con código de verificación. Es distinto del examen PL-300 de Microsoft, que se paga aparte si decides rendirlo.",
        },
      ],
    },
    "curso:analisis-de-datos": {
      kicker: "Análisis de datos · Colombia",
      titulo: "Análisis de datos: de Excel a SQL y Power BI",
      intro:
        "Dos niveles de 60 horas cada uno para cubrir el recorrido del analista: SQL Server, Power BI y Python, con un proyecto final aplicado.",
      parrafos: [
        "El nivel básico-intermedio junta las tres herramientas con 20 horas por cada una: SQL Server para extraer y consultar, Power BI para modelar y visualizar, y Python con Pandas para limpiar y automatizar. El nivel avanzado, también de 60 horas, profundiza automatización, inteligencia de tiempo y modelos. El programa completo suma 120 horas.",
        "En Colombia el proyecto final puede armarse con datos abiertos de datos.gov.co o con un caso del trabajo con información anonimizada. La consigna es que el tablero responda una pregunta de negocio y que cada cifra se pueda rastrear hasta su fuente. En sectores regulados, esa trazabilidad es parte del entregable.",
        "Si ya trabajas en un área de datos y solo te falta el tablero, Power BI es el atajo. Si además necesitas extraer, modelar y automatizar, este programa evita aprender cada herramienta por separado y las conecta en un mismo flujo.",
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
          q: "¿Qué proyecto final puedo hacer desde Colombia?",
          a: "Un tablero sobre datos abiertos de datos.gov.co o un caso de tu trabajo con datos anonimizados. La condición es que la pregunta de negocio, las fuentes y las transformaciones queden documentadas.",
        },
        {
          q: "¿Es lo mismo que el curso de análisis para minería?",
          a: "Es el mismo programa, con los ejemplos puestos en faena: turnos, flota, OEE y mantenimiento. El certificado y la carga horaria son los mismos; cambia el contexto de los ejercicios.",
        },
        {
          q: "¿A qué hora se dicta desde Colombia?",
          a: "La referencia es 19:30 a 21:30, hora de Chile. Colombia mantiene UTC-5, así que la clase se ve de 17:30 a 19:30 en verano chileno y de 18:30 a 20:30 en invierno chileno. La ficha confirma la hora local.",
        },
        {
          q: "¿Cómo se consulta el valor?",
          a: "El valor vigente del nivel que elijas se descarga en el PDF de temario y precios, en pesos colombianos. El checkout confirma el monto y permite pagar en {cuotas}.",
        },
      ],
    },
    "curso:python": {
      kicker: "Python · Colombia",
      titulo: "Python para datos: automatización y análisis",
      intro:
        "Pandas, visualización y automatización de reportes con casos de negocio, en vivo y en hora de Colombia. Sin convertirte en desarrollador de software.",
      parrafos: [
        "Python para Datos está enfocado en el trabajo de análisis: leer archivos, limpiar tablas, calcular indicadores y automatizar reportes con Pandas. El recorrido va de los fundamentos del lenguaje a la visualización y a la automatización, con el criterio puesto en el dato y no en la ingeniería de software.",
        "En Colombia se practica con archivos de ventas, cartera y operación, y con series de precios. Se trabajan detalles del formato local —separadores, tildes y mayúsculas inconsistentes en ciudades— porque un tablero que duplica Bogotá por escribirla de tres formas no sirve para decidir. La meta es que el script reemplace el copiar y pegar mensual.",
        "Si vienes de Excel, el curso arranca desde cero y no exige programar antes. Si ya usas SQL, puedes combinar ambas herramientas en el proyecto final: extraer con consultas, transformar con Python y dejar el resultado listo para Power BI.",
      ],
      faqs: [
        {
          q: "¿Necesito saber programar antes?",
          a: "No. El curso parte desde los fundamentos de Python y avanza hacia Pandas, visualización y automatización. Está pensado para analistas, no para desarrolladores.",
        },
        {
          q: "¿Cuántas horas tiene el curso?",
          a: "La ficha del curso declara la duración vigente: 16 horas en el catálogo. Antes de inscribirte, revisa esa ficha porque la carga horaria y el nivel son los que se muestran al momento de pagar.",
        },
        {
          q: "¿Se aplica a datos de una empresa colombiana?",
          a: "Sí. Los ejercicios usan archivos de ventas, cartera y operación, y trabajan con separadores y formatos locales. También se practica normalizar nombres de ciudades y dejar parámetros para no repetir la limpieza en cada reporte.",
        },
        {
          q: "¿Python reemplaza a Power BI o a Excel?",
          a: "No. Python sirve para limpiar, automatizar y analizar; Power BI para modelar y publicar tableros; Excel sigue siendo útil para cálculos puntuales. El curso muestra cómo pasarse datos entre las tres herramientas.",
        },
        {
          q: "¿A qué hora se ve desde Colombia?",
          a: "La clase se dicta de 19:30 a 21:30, hora de Chile. En Colombia se ve de 17:30 a 19:30 durante el verano chileno y de 18:30 a 20:30 durante el invierno chileno. La ficha de la cohorte muestra la conversión.",
        },
        {
          q: "¿Cómo se paga el curso?",
          a: "El valor vigente se consulta en el PDF de temario y precios, en pesos colombianos. Se paga con Mercado Pago Colombia, PSE, Nequi o transferencia, y el curso admite {cuotas}.",
        },
      ],
    },
    empresas: {
      kicker: "Empresas · Colombia",
      titulo: "Capacitación in-company con datos colombianos",
      intro:
        "Cursos cerrados para equipos: Power BI, Excel, SQL, Python, automatización e IA, con los datos de la empresa, en vivo y con factura corporativa.",
      parrafos: [
        "En Colombia, una capacitación in-company suele partir de una operación con varias sedes: ventas por tienda o canal, cartera por producto, recaudo con PSE o Nequi y reportes de servicio que se consolidan a mano. El objetivo no es sumar otra herramienta, sino dejar ese circuito en un tablero o un flujo que el equipo pueda sostener después del curso.",
        "El formato es en vivo por Zoom, con el mismo instructor del curso abierto y ejercicios sobre datos de la empresa —anonimizados— o sobre datasets de práctica cuando la información es sensible. Se puede trabajar por grupos: un grupo base de Excel y Power BI, un grupo de SQL para quienes extraen datos y un grupo de automatización con Power Automate o Python.",
        "La propuesta define alcance, cantidad de participantes, horas, modalidad y moneda. La facturación corporativa se coordina con el equipo de admisiones; el pago puede hacerse en pesos colombianos o en la moneda que indique la propuesta. No se publican precios de in-company en la web porque dependen del alcance.",
        "Los sectores con los que se trabaja son retail y consumo (venta por canal, rotación, margen), fintech y banca (cartera, mora, originación), energía y servicios públicos (consumo, facturación, cartera por zona) y agro y café (costos por finca, precio de referencia). También aparecen equipos de salud, logística y BPO con problemas de indicadores por sede o por campaña. Son escenarios de trabajo por industria, no casos de clientes ni resultados prometidos.",
        "Antes de cotizar se hace un diagnóstico breve: qué datos existen, quién los usa y qué decisión falta. Con eso se propone un alcance realista. Si el problema se resuelve con un tablero puntual, se dice; si conviene un programa más largo o sumar una base de datos, también. La capacitación no reemplaza un proyecto de implementación, pero puede preparar al equipo para sostenerlo.",
        "La modalidad permite trabajar con el equipo de datos interno o con el área dueña del proceso. En la primera sesión se acuerdan alcance, entregables y forma de trabajo; al cierre se revisa el tablero o el flujo construido y se deja documentado para que el equipo pueda repetirlo sin el instructor.",
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
          a: "La propuesta indica alcance, moneda y condiciones de facturación. La factura corporativa se coordina con admisiones y el pago puede hacerse en pesos colombianos o en la moneda que defina la propuesta.",
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
      kicker: "Precios · Colombia",
      titulo: "Cómo se publica el precio en Colombia",
      intro:
        "Moneda COP, PDF de temario y precios de cada curso, y checkout con Mercado Pago. El monto se confirma antes de pagar y las {cuotas} aplican a todos los cursos.",
      parrafos: [
        "Todos los cursos tienen un precio publicado en pesos colombianos. El valor vigente, los descuentos y las {cuotas} se descargan en el PDF de temario y precios de cada curso; la tabla de esta página muestra duración y nivel, y el checkout confirma el monto antes de pagar. No hay un precio distinto por comprar desde otra ciudad: la moneda es la del mercado colombiano.",
        "El pago se procesa con Mercado Pago Colombia: tarjeta de crédito o débito, PSE, Nequi o transferencia bancaria en pesos, según los medios habilitados en el checkout. Si la cuenta local no está disponible, el checkout informa el equivalente en pesos chilenos (CLP) antes de confirmar. Esa conversión es informativa: el cargo final depende del medio de pago y de tu banco.",
        "Pagar desde el exterior es posible. El checkout muestra los medios disponibles y, si usas una tarjeta emitida en otro país, el cargo final lo define tu banco, incluidos los impuestos o comisiones que aplique. ProgramBI no fija ese cargo. Si necesitas factura corporativa, admisiones coordina los datos antes del pago.",
        "El precio incluye clases en vivo por Zoom, grabaciones en el campus y certificado digital al completar. No incluye licencias de pago de Microsoft ni el examen PL-300, que se pagan aparte si decides rendirlos. Las licencias de Power BI Pro solo hacen falta para publicar y compartir informes dentro de una organización.",
        "Antes de pagar puedes revisar la ficha del curso, el PDF de temario y precios, y la fecha de la cohorte. Si el curso que buscas no tiene una cohorte abierta, admisiones confirma cuándo se publica la siguiente. No se anuncia una fecha ni cupos que no estén confirmados.",
      ],
      faqs: [
        {
          q: "¿Cómo consulto el valor de un curso?",
          a: "El valor vigente se descarga en el PDF de temario y precios de cada curso, en pesos colombianos. Ahí también están los descuentos y las fechas de la cohorte; el checkout confirma el importe antes de pagar.",
        },
        {
          q: "¿Los precios están en COP?",
          a: "Sí. El catálogo de Colombia se publica en pesos colombianos. Si el checkout usa la cuenta de Chile porque la cuenta local no está habilitada, muestra el equivalente en CLP antes de confirmar.",
        },
        {
          q: "¿Las {cuotas} aplican a todos los cursos?",
          a: "Sí: todos los cursos admiten {cuotas}, sin recargo por financiamiento. La pasarela confirma las cuotas disponibles según el medio de pago y el banco.",
        },
        {
          q: "¿Puedo pagar con PSE o Nequi?",
          a: "Sí, cuando están habilitados en el checkout de Mercado Pago Colombia. También puedes pagar con tarjeta de crédito o débito, o coordinar una transferencia bancaria en pesos.",
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
