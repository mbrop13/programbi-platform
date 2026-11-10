import type { DatosBloqueLocal } from "./tipos";

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
      "El catálogo de Argentina se publica en ARS. Consulta el valor vigente de cada curso en su brochure PDF: ahí están el monto, los descuentos y las fechas. El checkout confirma el importe antes de pagar.",
    horarioDetalle:
      "Argentina usa UTC-3 todo el año. Cuando Chile está en horario de verano, la clase se ve a la misma hora; cuando Chile vuelve a UTC-4, se ve una hora más tarde. La ficha de la cohorte muestra la conversión exacta.",
    pagoDetalle:
      "El checkout procesa el pago con Mercado Pago Argentina. Si la cuenta local no está habilitada, muestra el equivalente en pesos chilenos antes de confirmar.",
    cuotasDetalle: "Sin recargo por financiamiento. La pasarela confirma las cuotas disponibles al pagar.",
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
        "Las clases se dictan desde Chile y se siguen en hora de Buenos Aires. El programa, las grabaciones y el certificado son los mismos; cambian la moneda, el medio de pago y la conversión horaria.",
      parrafos: [
        "Argentina tiene una particularidad que atraviesa casi todos los tableros: los precios cambian dentro del año. Por eso los ejercicios trabajan con moneda constante, actualización de precios y tipo de cambio, además de los reportes habituales de ventas, costos y cartera. El objetivo es que el número que llega a la reunión sea comparable, no solo que esté actualizado.",
        "El catálogo reúne trece fichas: Power BI, análisis de datos, SQL Server, Python, Excel, Access, Copilot, Claude, IA en productividad, Power Automate, machine learning, mercado financiero y análisis para minería. Cada ficha declara duración, nivel y temario, y su brochure en pesos argentinos concentra el valor y las fechas de la próxima cohorte.",
        "Si trabajas en una pyme o en un área de finanzas, operaciones o comercial, el punto de partida suele ser el mismo: ordenar los datos que hoy viven en Excel, aprender a consultarlos y recién después armar el tablero. No se pide experiencia en programación para empezar; sí constancia para sostener dos clases por semana.",
        "Las clases quedan grabadas en el campus. Eso importa en un país con husos y rutinas distintas: quien no llega a la hora puede recuperar la sesión y traer las dudas a la clase siguiente. El campus también guarda las plantillas y los datasets de práctica.",
      ],
      faqs: [
        {
          q: "¿A qué hora son las clases en Argentina?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Argentina mantiene UTC-3 todo el año: cuando Chile está en horario de verano la clase se ve a la misma hora y, cuando Chile vuelve a UTC-4, se ve una hora más tarde (20:30 a 22:30). La ficha de la cohorte confirma la hora exacta.",
        },
        {
          q: "¿El precio está en pesos argentinos?",
          a: "Sí. El catálogo de Argentina se publica en ARS y el valor vigente de cada curso se descarga en su brochure PDF. El checkout confirma el monto antes de pagar y, si la cuenta local no está habilitada, muestra el equivalente en CLP.",
        },
        {
          q: "¿Puedo pagar desde Argentina?",
          a: "Sí: con Mercado Pago Argentina (tarjeta de crédito o débito), Mercado Pago Wallet o transferencia bancaria en pesos. Si pagas con una tarjeta emitida en el exterior, el cargo final lo define tu banco, incluidos los impuestos o comisiones que aplique.",
        },
        {
          q: "¿Hay cuotas sin interés?",
          a: "Sí: todos los cursos se pueden pagar en 3 cuotas sin interés, sin recargo por financiamiento. La disponibilidad final de las cuotas la confirma la pasarela en el checkout.",
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
        "Cada ficha declara duración, nivel y temario antes de inscribirte. El brochure PDF de Argentina incluye el valor en pesos, las fechas de la cohorte y las tres cuotas sin interés. La tabla de precios muestra la duración de todos los cursos en una sola vista para comparar antes de elegir.",
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
          a: "Con Mercado Pago Argentina, Mercado Pago Wallet o transferencia bancaria en pesos. Todos los cursos se pueden pagar en 3 cuotas sin interés y el checkout confirma el monto final antes de pagar.",
        },
      ],
    },
    "curso:power-bi": {
      kicker: "Power BI · Argentina",
      titulo: "Power BI en vivo para analistas argentinos",
      intro:
        "El curso abierto es básico-intermedio: veinte horas para pasar de Power Query a un tablero con DAX, con el valor en pesos y la hora de Buenos Aires.",
      parrafos: [
        "El programa cubre Power Query y M para limpiar y combinar archivos, el modelo estrella, las medidas con CALCULATE y FILTER, inteligencia de tiempo, RANKX e iteradores como SUMX. Cierra con una introducción a IA en Power BI y un tablero propio que se puede mostrar en una entrevista o en la reunión de área.",
        "En Argentina los ejercicios suman dos problemas que casi no aparecen en otros mercados: la actualización de precios dentro del año y la comparación en moneda constante. Se practica con el IPC del INDEC como tabla de índices y con el tipo de cambio como parámetro del modelo, para que el tablero muestre el resultado nominal y el real sin mezclarlos.",
        "El curso avanzado, también de veinte horas, cubre publicación en Power BI Service y seguridad a nivel de fila. El curso abierto es el básico-intermedio; si tu empresa necesita los tres niveles para un equipo, se cotiza la vista in-company con los datos de la organización.",
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
          a: "Sí. Los ejercicios usan el IPC mensual del INDEC como tabla relacionada con el calendario y calculan ventas en moneda constante con iteradores. También se practica dejar el tipo de cambio como parámetro del modelo.",
        },
        {
          q: "¿A qué hora se ve desde Argentina?",
          a: "La clase base es de 19:30 a 21:30, hora de Chile. Argentina mantiene UTC-3: en verano chileno coincide y en invierno chileno se ve de 20:30 a 22:30. La ficha de la cohorte muestra la hora exacta.",
        },
        {
          q: "¿Cuánto cuesta y cómo se paga?",
          a: "El valor vigente está en el brochure PDF del curso, en pesos argentinos. Se paga con Mercado Pago Argentina, Mercado Pago Wallet o transferencia, y todos los cursos admiten 3 cuotas sin interés.",
        },
        {
          q: "¿Qué certificado recibo?",
          a: "Un certificado digital de ProgramBI al completar el curso, con código de verificación. Es distinto del examen PL-300 de Microsoft, que se paga aparte si decides rendirlo.",
        },
      ],
    },
    "curso:analisis-de-datos": {
      kicker: "Análisis de datos · Argentina",
      titulo: "Análisis de datos: de Excel a SQL y Power BI",
      intro:
        "Dos niveles de 60 horas cada uno para cubrir el recorrido completo del analista: SQL Server, Power BI y Python, con un proyecto final aplicado.",
      parrafos: [
        "El nivel básico-intermedio junta las tres herramientas con 20 horas por cada una: SQL Server para extraer y consultar, Power BI para modelar y visualizar, y Python con Pandas para limpiar y automatizar. El nivel avanzado, también de 60 horas, profundiza automatización, inteligencia de tiempo y modelos. El programa completo suma 120 horas.",
        "En Argentina el proyecto final puede armarse con datos públicos: series del INDEC, datos abiertos de datos.gob.ar o indicadores del BCRA. La consigna es que el tablero responda una pregunta de negocio concreta y que cada cifra se pueda rastrear hasta su fuente, algo que se vuelve crítico cuando hay que explicar el número en un comité.",
        "Si ya trabajas en un área de datos y solo te falta el tablero, Power BI es el atajo. Si además necesitas extraer, modelar y automatizar, este programa evita aprender cada herramienta por separado y las conecta en un mismo flujo de trabajo.",
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
          a: "Es el mismo programa, con los ejemplos puestos en faena: turnos, flota, OEE y mantenimiento. El certificado y la carga horaria son los mismos; cambia el contexto de los ejercicios.",
        },
        {
          q: "¿A qué hora se dicta desde Argentina?",
          a: "La referencia es 19:30 a 21:30, hora de Chile. Argentina mantiene UTC-3 todo el año, así que la clase coincide en verano chileno y se corre una hora en invierno chileno. La ficha de la cohorte confirma la hora local.",
        },
        {
          q: "¿Cómo se consulta el valor?",
          a: "El valor vigente del nivel que elijas se descarga en el brochure PDF del curso, en pesos argentinos. El checkout confirma el monto y permite pagar en 3 cuotas sin interés.",
        },
      ],
    },
    "curso:python": {
      kicker: "Python · Argentina",
      titulo: "Python para datos: automatización y análisis",
      intro:
        "Pandas, visualización y automatización de reportes con casos de negocio, en vivo y en hora de Argentina. Sin convertirte en desarrollador de software.",
      parrafos: [
        "Python para Datos está enfocado en el trabajo de análisis: leer archivos, limpiar tablas, calcular indicadores y automatizar reportes con Pandas. El recorrido va de los fundamentos del lenguaje a la visualización y a la automatización, con el criterio puesto en el dato y no en la ingeniería de software.",
        "En Argentina se practica con extractos de ventas, archivos de campo y series de precios. La meta es que el script reemplace el copiar y pegar mensual y que el resultado se pueda revisar: qué archivo entró, qué se limpió y qué indicador salió. Ese orden es el que hace que un informe se pueda mantener.",
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
          q: "¿Se aplica a datos de una empresa argentina?",
          a: "Sí. Los ejercicios usan archivos de ventas, costos y series de precios, y trabajan con separadores de miles y fechas locales. También se practica dejar el tipo de cambio como parámetro para no repetir la conversión en cada reporte.",
        },
        {
          q: "¿Python reemplaza a Power BI o a Excel?",
          a: "No. Python sirve para limpiar, automatizar y analizar; Power BI para modelar y publicar tableros; Excel sigue siendo útil para cálculos puntuales. El curso muestra cómo pasarse datos entre las tres herramientas.",
        },
        {
          q: "¿A qué hora se ve desde Argentina?",
          a: "La clase se dicta de 19:30 a 21:30, hora de Chile. En Argentina se ve a la misma hora durante el verano chileno y una hora más tarde durante el invierno chileno. La ficha de la cohorte muestra la conversión.",
        },
        {
          q: "¿Cómo se paga el curso?",
          a: "El valor vigente se consulta en el brochure PDF, en pesos argentinos. Se paga con Mercado Pago Argentina o transferencia, y el curso admite 3 cuotas sin interés.",
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
          a: "Los cursos abiertos admiten 3 cuotas sin interés. En in-company, las condiciones de pago se acuerdan en la propuesta según el alcance y la modalidad de facturación.",
        },
      ],
    },
    precios: {
      kicker: "Precios · Argentina",
      titulo: "Cómo se publica el precio en Argentina",
      intro:
        "Moneda ARS, brochure por curso y checkout con Mercado Pago. El monto se confirma antes de pagar y las tres cuotas sin interés aplican a todos los cursos.",
      parrafos: [
        "Todos los cursos tienen un precio publicado en pesos argentinos. El valor vigente, los descuentos y las tres cuotas sin interés se descargan en el brochure PDF de cada curso; la tabla de esta página muestra duración y nivel, y el checkout confirma el monto antes de pagar. No hay un precio distinto por comprar desde otra ciudad: la moneda es la del mercado argentino.",
        "El pago se procesa con Mercado Pago Argentina: tarjeta de crédito o débito, Mercado Pago Wallet o transferencia bancaria en pesos. Si la cuenta local no está habilitada, el checkout muestra el equivalente en pesos chilenos (CLP) antes de confirmar. Esa conversión es informativa: el cargo final depende del medio de pago y de tu banco.",
        "Pagar desde el exterior es posible. El checkout muestra los medios disponibles y, si usas una tarjeta emitida en otro país, el cargo final lo define tu banco, incluidos los impuestos o comisiones que aplique. ProgramBI no fija ese cargo. Si necesitas una factura corporativa, el equipo de admisiones coordina los datos antes del pago.",
        "El precio incluye clases en vivo por Zoom, grabaciones en el campus y certificado digital al completar. No incluye licencias de pago de Microsoft ni el examen PL-300, que se pagan aparte si decides rendirlos. Las licencias de Power BI Pro solo hacen falta para publicar y compartir informes dentro de una organización.",
        "Antes de pagar puedes revisar la ficha del curso, el brochure y la fecha de la cohorte. Si el curso que buscas no tiene una cohorte abierta, admisiones confirma cuándo se publica la siguiente. No se anuncia una fecha ni cupos que no estén confirmados.",
      ],
      faqs: [
        {
          q: "¿Cómo consulto el valor de un curso?",
          a: "El valor vigente se descarga en el brochure PDF de cada curso, en pesos argentinos. Ahí también están los descuentos y las fechas de la cohorte; el checkout confirma el importe antes de pagar.",
        },
        {
          q: "¿Los precios están en ARS?",
          a: "Sí. El catálogo de Argentina se publica en pesos argentinos. Si el checkout usa la cuenta de Chile porque la cuenta local no está habilitada, muestra el equivalente en CLP antes de confirmar.",
        },
        {
          q: "¿Las 3 cuotas sin interés aplican a todos los cursos?",
          a: "Sí: todos los cursos admiten 3 cuotas sin interés, sin recargo por financiamiento. La pasarela confirma las cuotas disponibles según el medio de pago y el banco.",
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
          a: "En la ficha del curso y en el brochure PDF. Cuando no hay una cohorte confirmada, la fecha se publica recién cuando está cerrada; no se anuncian cupos que todavía no existen.",
        },
      ],
    },
  },
};

export default datos;
