/**
 * Texto propio de la ficha de curso por país.
 *
 * Cada entrada son párrafos editoriales del mercado, escritos para la ficha y
 * no reutilizados de la home. Todo lo que afirman sale de `config/paises.ts`,
 * de `lib/data/contenido-paises` o de las guías por país: no hay cifras ni
 * empresas inventadas. El resto del bloque (precio, medios de pago, horario,
 * caso de industria y referencias) se arma en runtime con esos mismos datos.
 *
 * Chile no tiene archivo en `contenido-paises` porque su mercado vive en la
 * configuración y en las guías chilenas: por eso su texto es más largo y cubre
 * lo que en los demás países aportan el caso y la moneda.
 */

export type FichaPais = {
  /** Párrafos únicos del mercado, en orden de lectura. */
  parrafos: string[];
  /** Párrafos propios por curso para evitar repetir el mismo texto entre fichas del país. */
  porCurso?: Record<string, string[]>;
};

/**
 * Párrafos regionales genéricos para ChatGPT y Gemini en mercados sin normativa
 * local específica (`bo`, `cr`, `ec`, `sv`, `gt`, `do`, `ve`, `pa`, `ni`, `hn`, `py`).
 */
export function parrafosGenericosIA(
  slug: "chatgpt" | "gemini",
  nombrePais: string
): string[] {
  if (slug === "chatgpt") {
    return [
      `En ${nombrePais}, ChatGPT aplicado al trabajo diario permite resumir documentos extensos, limpiar planillas de Excel y CSV, redactar informes y automatizar tareas repetitivas con ChatGPT Work, sin escribir código. El programa parte desde cero y trabaja con casos reales de oficina y control de gestión.`,
      `Las 20 horas en vivo por Zoom (5 módulos de 4 horas) se adaptan al horario local de ${nombrePais}, con acceso a las grabaciones y materiales en el campus virtual y certificado digital al completar. Consulta los medios de pago y el detalle del programa en el PDF de temario y precios de esta ficha.`,
    ];
  }
  return [
    `Para profesionales y equipos de ${nombrePais} que trabajan con Google Workspace, este curso de Gemini cubre en vivo Gmail, Docs, Slides, Google Sheets, extracción de datos desde PDF, Gemini Notebook (NotebookLM) y Deep Research, sin programar.`,
    `Son 20 horas en vivo por Zoom (5 módulos de 4 horas) ajustadas a la hora local de ${nombrePais}, con grabaciones en el campus virtual y certificado digital de ProgramBI. Revisa las opciones de pago y el detalle completo en el PDF de temario y precios.`,
  ];
}

function porCursoRegional(nombrePais: string): Record<string, string[]> {
  return {
    chatgpt: parrafosGenericosIA("chatgpt", nombrePais),
    gemini: parrafosGenericosIA("gemini", nombrePais),
  };
}

export const FICHA_PAIS: Record<string, FichaPais> = {
  cl: {
    parrafos: [
      "En Chile el dato de gestión suele vivir en tres lugares a la vez: el ERP, la planilla que alguien actualiza cada lunes y el informe que llega a gerencia a mitad de semana. Este curso se dicta en vivo por Zoom desde Santiago y trabaja ese recorrido completo: conectar la fuente, ordenar el modelo, escribir las medidas y dejar una actualización que no dependa de una persona. Las clases quedan grabadas en el campus, así que quien trabaja en región o tiene turnos puede repetirlas.",
      "Los ejercicios usan lo que ya existe en las empresas chilenas: Microsoft 365, que muchas compañías ya pagan; reportes de producción y disponibilidad de equipos en minería y energía; venta por tienda y quiebres de stock en retail; cartera y control de gestión en banca, salud y servicios. La meta no es sumar gráficos, sino que el tablero responda una pregunta de negocio y aguante la reunión del comité.",
      "El precio se publica en pesos chilenos y se paga con los medios habilitados en el checkout. Los proyectos para empresas se cotizan aparte, con alcance y moneda en la propuesta.",
    ],
    porCurso: {
      chatgpt: [
        "En Chile el trabajo de oficina con ChatGPT se nota rápido en tareas concretas: revisar IVA y boletas de honorarios en planillas, ordenar liquidaciones de sueldo, hacer conciliación bancaria, resumir bases de licitación de Mercado Público y preparar reportes para gerencia en pesos y UF sin perder horas copiando datos a mano.",
        "Este curso de 20 horas en vivo por Zoom desde Santiago parte desde cero, sin programar: trabajas prompting profesional, análisis de Excel y CSV, Projects, plugins y ChatGPT Work con criterio de privacidad para datos de empresa. Las clases quedan grabadas en el campus virtual y el precio vigente en pesos chilenos se paga con los medios habilitados en el checkout.",
      ],
      gemini: [
        "Para equipos en Chile que trabajan en Google Workspace, Gemini permite acelerar correos, actas de Meet, documentos en Docs y planillas en Sheets con casos locales: control de IVA y boletas de honorarios, liquidaciones de sueldo, conciliación bancaria, lectura de bases de licitación de Mercado Público y reportes para gerencia en pesos y UF.",
        "En 20 horas en vivo por Zoom desde Santiago recorres Gmail, Docs, Slides, Google Sheets, extracción desde PDF, Gemini Notebook (NotebookLM) y Deep Research sin escribir código. Las sesiones quedan grabadas en el campus virtual y el valor en pesos chilenos se abona directamente en el checkout.",
      ],
    },
  },
  ar: {
    parrafos: [
      "En Argentina el número casi nunca está en un solo sistema: se reparte entre la facturación electrónica de ARCA (ex AFIP), el ERP, las planillas de campo y el archivo que finanzas arma a mano. El curso parte de ese desorden real para analistas financieros, pymes y equipos de agro y exportación, fintech, retail e industria, y muestra cómo construir un modelo que contemple inflación con el IPC del INDEC y tipo de cambio del BCRA sin rehacer la planilla cada mes.",
      "La clase base de 19:30 a 21:30 en Chile se sigue en vivo por Zoom en horario de Buenos Aires (America/Argentina/Buenos_Aires, UTC-3): de 19:30 a 21:30 durante el verano chileno y de 20:30 a 22:30 en invierno chileno. El arancel en pesos argentinos (ARS) se consulta en el PDF de temario y precios de la ficha y se abona con Mercado Pago Argentina en 3 cuotas sin interés.",
    ],
    porCurso: {
      "power-bi": [
        "En las empresas argentinas los reportes de gestión suelen depender de cruzar comprobantes de ARCA (ex AFIP), ventas del ERP y listas de precios que cambian varias veces en el año. Este curso de Power BI (20 horas en vivo por Zoom) está pensado para analistas financieros, control de gestión y equipos de pymes, agro y exportación, fintech, retail e industria que necesitan armar un modelo estrella con Power Query y medidas DAX ajustadas por el IPC del INDEC y el tipo de cambio del BCRA.",
        "La cohorte se dicta en la franja de 19:30 a 21:30 de Chile, que en hora de Buenos Aires (America/Argentina/Buenos_Aires, UTC-3) equivale a 19:30 a 21:30 en verano chileno y a 20:30 a 22:30 en invierno chileno. El valor en pesos argentinos (ARS) se descarga en el PDF de temario y precios y se paga con Mercado Pago Argentina en 3 cuotas sin interés.",
      ],
      "analisis-de-datos": [
        "El programa de Análisis de Datos reúne en 60 horas por nivel (20 de SQL Server, 20 de Power BI y 20 de Python; 120 horas el recorrido completo) las tres herramientas que más piden las búsquedas de analista en Argentina relevadas por la encuesta de Sysarmy. Está orientado a profesionales de finanzas, pymes, agro y exportación, fintech, retail e industria que quieren consultar bases transaccionales y comprobantes de ARCA (ex AFIP), limpiar tablas con Pandas y publicar tableros deflactados con series del INDEC y del BCRA.",
        "Las sesiones en vivo de 19:30 a 21:30 (hora de Chile) se cursan desde Buenos Aires (America/Argentina/Buenos_Aires, UTC-3) de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno. Cada nivel publica su precio en pesos argentinos (ARS) en el PDF de temario y precios y admite pago por Mercado Pago Argentina en 3 cuotas sin interés.",
      ],
      python: [
        "Cuando las listas de proveedores, costos de reposición y cotizaciones cambiarias se actualizan cada semana, consolidar planillas a mano deja de escalar. El curso de Python para Datos (20 horas en vivo por Zoom) entrena a analistas financieros, administrativos de pymes y equipos de agro y exportación, fintech, retail e industria en Argentina para automatizar la lectura de archivos con Pandas, limpiar montos con punto de miles y coma decimal, normalizar el CUIT de ARCA (ex AFIP) y cruzar series del INDEC y del BCRA.",
        "El horario base de 19:30 a 21:30 en Chile corresponde en Argentina (America/Argentina/Buenos_Aires, UTC-3) a 19:30 a 21:30 durante el verano chileno y a 20:30 a 22:30 en el invierno chileno. Descargá el PDF de temario y precios para ver el arancel en pesos argentinos (ARS) y abonar con Mercado Pago Argentina en 3 cuotas sin interés.",
      ],
      chatgpt: [
        "En Argentina, usar ChatGPT en el trabajo diario ayuda a ordenar planillas, resumir contratos y armar reportes multimoneda (ARS/USD) sin rehacer cálculos cada semana. En 20 horas en vivo por Zoom, sin programar, aprendes a escribir prompts estructurados, analizar archivos CSV y Excel, armar Projects y automatizar tareas repetitivas con ChatGPT Work y criterio de privacidad.",
        "La cohorte se dicta en la franja de 19:30 a 21:30 de Chile, que en hora de Buenos Aires (America/Argentina/Buenos_Aires, UTC-3) equivale a 19:30 a 21:30 en verano chileno y a 20:30 a 22:30 en invierno chileno. El arancel en pesos argentinos (ARS) se consulta en el PDF de temario y precios de la ficha y se abona con Mercado Pago Argentina en 3 cuotas sin interés.",
      ],
      gemini: [
        "En empresas y estudios de Argentina que operan sobre Google Workspace, Gemini agiliza la redacción en Gmail y Docs, la limpieza y fórmulas en Google Sheets, la lectura de PDF y la preparación de reportes multimoneda (ARS/USD), además de investigar con Gemini Notebook (NotebookLM) y Deep Research.",
        "Las sesiones en vivo de 20 horas (5 módulos de 4 h, sin programar) se siguen desde Buenos Aires (America/Argentina/Buenos_Aires, UTC-3) de 19:30 a 21:30 en verano chileno y de 20:30 a 22:30 en invierno chileno. El valor en pesos argentinos (ARS) se descarga en el PDF de temario y precios y se paga con Mercado Pago Argentina en 3 cuotas sin interés.",
      ],
    },
  },
  mx: {
    parrafos: [
      "En México el cierre de mes suele empezar juntando reportes de varias áreas y terminar en una discusión sobre qué archivo tiene la cifra buena. El curso trabaja ese problema con un modelo común: ventas por sucursal con inventario y margen, producción por turno y costo por ruta, sin depender de un consolidado manual. Las prácticas usan manufactura y nearshoring, retail y consumo, fintech y banca, y logística y comercio exterior: OEE por línea, sell-out por tienda, cartera y cobranza, nivel de servicio por ruta.",
      "Las clases se ven en hora del centro de México: el país ya no cambia la hora en la mayor parte de su territorio y Chile sí, por eso la equivalencia se mueve entre 16:30 y 17:30 según la época del año. Además de manufactura y retail, los ejercicios incluyen cartera y cobranza en fintech y banca, y nivel de servicio por ruta en logística. Los datos salen del CFDI, del ERP y de los reportes de tienda.",
    ],
    porCurso: {
      chatgpt: [
        "En México, ChatGPT aplicado al trabajo de oficina permite acelerar tareas como revisar listados de CFDI, apoyar la conciliación con el SAT, limpiar planillas de Excel y preparar reportes en MXN sin depender de macros complejas ni programación. En 20 horas en vivo por Zoom cubres prompting profesional, análisis de archivos CSV y Excel, Projects, plugins y ChatGPT Work.",
        "Las clases se siguen en hora del centro de México (entre 16:30 y 17:30 según la época del año, ya que México no cambia la hora y Chile sí), con grabaciones en el campus virtual y certificado al terminar. El precio en pesos mexicanos (MXN) y las opciones de pago están en el PDF de temario y precios de esta ficha.",
      ],
      gemini: [
        "Para equipos en México que usan Google Workspace, Gemini ayuda a automatizar correos en Gmail, minutas en Meet, documentos en Docs, fórmulas en Google Sheets y extracción de datos desde PDF para revisar CFDI, conciliación con el SAT y reportes en MXN, sumando Gemini Notebook (NotebookLM) y Deep Research.",
        "El programa completo de 20 horas en vivo por Zoom (sin programar) se cursa en hora del centro de México (16:30 a 17:30 o 17:30 a 19:30 según la temporada) y queda grabado en el campus virtual. Consulta el arancel en pesos mexicanos (MXN) en el PDF de temario y precios.",
      ],
    },
  },
  pe: {
    parrafos: [
      "En Perú el reporte de gestión todavía se arma mucho a mano: se bajan los comprobantes de SUNAT, se cruzan con la planta y se pega todo en una planilla. El curso ordena ese flujo con SQL, un modelo en Power BI y, cuando hace falta, Python para lo que Excel no aguanta. Los casos de práctica vienen de minería, agroexportación, retail y consumo masivo, y banca y microfinanzas: producción y leyes por tajo, campaña y destino de exportación, venta por tienda, cartera por zona.",
      "El horario se publica en hora de Lima: Perú se mantiene en UTC-5 todo el año y Chile cambia con el verano, así que la clase de 19:30 en Chile se ve a las 17:30 o 18:30 en Perú según la fecha. Los casos incluyen además banca y microfinanzas, con cartera y cobranza por zona. Los datos de partida son comprobantes de SUNAT, reportes de planta y registros del sistema comercial.",
    ],
    porCurso: {
      "power-bi": [
        "Este curso de Power BI en Perú se dicta en vivo por Zoom (20 horas en el nivel básico-intermedio y 20 horas en el nivel avanzado) para profesionales y equipos que hoy arman reportes a mano en Excel —bajando comprobantes electrónicos de SUNAT, cruzándolos con reportes de planta o planillas de campo— y necesitan automatizar la limpieza con Power Query (lenguaje M), estructurar un modelo estrella y escribir medidas DAX en soles y dólares.",
        "Las clases se siguen en horario de Lima (America/Lima, UTC-5: de 17:30 a 19:30 cuando Chile está en horario de verano y de 18:30 a 20:30 en invierno chileno), con grabaciones y material de práctica en el campus virtual y certificado digital de ProgramBI al completar. Puedes empezar desde cero sin saber programar, y el precio en soles (PEN) con 3 cuotas sin interés se consulta en el PDF de temario y precios de esta ficha.",
      ],
      chatgpt: [
        "En Perú, ChatGPT te ayuda a dejar atrás el trabajo manual de bajar comprobantes y registros de SUNAT para ordenarlos en Excel o preparar reportes en soles. En 20 horas en vivo por Zoom aprendes a redactar prompts claros, analizar planillas CSV y Excel, organizar documentación en Projects y automatizar tareas repetitivas con ChatGPT Work, sin programar.",
        "Las clases se dictan en horario de Lima (America/Lima, UTC-5: de 17:30 a 19:30 en verano chileno y de 18:30 a 20:30 en invierno chileno), con grabaciones en el campus virtual y certificado digital. El precio en soles (PEN) con 3 cuotas sin interés se consulta en el PDF de temario y precios de esta ficha.",
      ],
      gemini: [
        "Si tu empresa u oficina en Perú trabaja con Google Workspace, este curso de Gemini de 20 horas en vivo te enseña a redactar en Gmail y Docs, extraer datos de comprobantes y PDF de SUNAT hacia Google Sheets, armar reportes en soles y usar Gemini Notebook (NotebookLM) y Deep Research con fuentes verificadas.",
        "Se cursa en horario de Lima (America/Lima, UTC-5: de 17:30 a 19:30 cuando Chile está en horario de verano y de 18:30 a 20:30 en invierno chileno), sin conocimientos previos de programación. Consulta el arancel en soles (PEN) y las 3 cuotas sin interés en el PDF de temario y precios.",
      ],
    },
  },
  co: {
    parrafos: [
      "En Colombia el informe semanal suele depender de una persona que junta archivos y los cuadra a mano; cuando esa persona no está, el informe no sale. El curso convierte ese trabajo en un proceso: la consulta se ejecuta sola, el modelo calcula las métricas y el tablero queda listo para el comité. Las prácticas usan retail y consumo, fintech y banca, energía y servicios públicos, y agro y café: venta por canal, cartera y recaudo, consumo y facturación por zona, costos por finca.",
      "Las clases se ven en hora de Bogotá: Colombia se mantiene en UTC-5 todo el año y Chile cambia por horario de verano, por eso la equivalencia se mueve entre 17:30 y 18:30. Los ejercicios cubren también energía y servicios públicos (consumo y facturación por zona) y agro y café (costos por finca). Los datos vienen del POS, de la facturación electrónica de la DIAN y de las bases de recaudo.",
    ],
    porCurso: {
      chatgpt: [
        "En Colombia, ChatGPT aplicado al trabajo diario permite revisar listados de facturación electrónica DIAN, limpiar planillas de Excel y preparar reportes en COP sin escribir código. En 20 horas en vivo por Zoom dominas prompting profesional, análisis de archivos CSV y Excel, Projects, plugins y ChatGPT Work con foco en verificación y privacidad.",
        "Las sesiones se ven en hora de Bogotá (UTC-5 todo el año; entre 17:30 y 18:30 según el horario de verano en Chile), con grabaciones en el campus virtual y certificado digital. El precio en pesos colombianos (COP) y los medios de pago están en el PDF de temario y precios.",
      ],
      gemini: [
        "Para equipos en Colombia que trabajan con Google Workspace, Gemini agiliza correos en Gmail, actas en Meet, documentos en Docs, fórmulas en Google Sheets y lectura de PDF de facturación electrónica DIAN para armar reportes en COP, además de investigar con Gemini Notebook (NotebookLM) y Deep Research.",
        "El curso completo de 20 horas en vivo por Zoom (sin programar) se sigue en hora de Bogotá (17:30 o 18:30 según la época del año) y queda grabado en el campus virtual. Consulta el arancel en pesos colombianos (COP) en el PDF de temario y precios de esta ficha.",
      ],
    },
  },
  uy: {
    parrafos: [
      "Uruguay es un mercado chico con una industria de software y servicios que exporta, y eso se nota en lo que se pide: tableros claros, trazabilidad y margen por operación. El curso trabaja con datos de facturación electrónica, planillas de campo y sistemas de faena, y deja un modelo que se puede explicar a la gerencia sin abrir cinco archivos. Los casos de práctica vienen de agro y ganadería, frigoríficos y exportación, servicios financieros y fintech, y turismo y logística: costo por hectárea y margen por potrero, rendimiento por faena y destino, cartera y venta cruzada, ocupación y costo por ruta.",
      "Las clases se ven en hora de Montevideo: Uruguay mantiene UTC-3 todo el año, igual que Argentina, así que la equivalencia con Chile cambia cuando este pasa a horario de verano. Los casos de práctica incluyen también servicios financieros y turismo: cartera, venta cruzada, ocupación y costo por ruta. Los datos salen de la facturación electrónica de DGI, de las planillas de campo y de los sistemas de faena.",
    ],
    porCurso: {
      chatgpt: [
        "En Uruguay, usar ChatGPT en la gestión diaria ayuda a ordenar planillas de operación, resumir contratos, cruzar reportes de facturación electrónica y preparar informes claros de margen para gerencia, sin programar. En 20 horas en vivo por Zoom aprendes prompting estructurado, análisis de Excel y CSV, Projects, plugins y ChatGPT Work.",
        "Las sesiones se ven en hora de Montevideo (UTC-3 todo el año, ajustando su equivalencia cuando Chile cambia al horario de verano) y quedan grabadas en el campus virtual. El precio local y los medios de pago se consultan en el PDF de temario y precios de esta ficha.",
      ],
      gemini: [
        "Para equipos en Uruguay que trabajan en Google Workspace, Gemini permite acelerar correos en Gmail, minutas en Meet, documentos en Docs, fórmulas en Google Sheets y análisis de PDF operativos, además de investigar con Gemini Notebook (NotebookLM) y Deep Research.",
        "El curso de 20 horas en vivo por Zoom (sin programar) se sigue en hora de Montevideo (UTC-3) y deja todas las grabaciones disponibles en el campus virtual. Consulta el arancel vigente y las opciones de pago en el PDF de temario y precios.",
      ],
    },
  },
  us: {
    parrafos: [
      "En Estados Unidos muchos profesionales hispanohablantes arman el reporte en inglés y lo piensan en español: el dato sale de QuickBooks, NetSuite, Salesforce o ADP y termina en un Excel que alguien rehace cada mes. El curso se dicta en vivo y en español, con el software en inglés tal como se usa en la oficina, y recorre el camino completo: conectar la fuente, ordenar el modelo, escribir las medidas y dejar una actualización que no dependa de una sola persona. Los ejercicios vienen de logística y comercio exterior, hotelería, bienes raíces, salud, construcción y finanzas.",
      "Las clases se ven en la hora del Este (Miami y Nueva York): caen entre las 17:30 y las 19:30 según la época del año, porque EE.UU. y Chile cambian la hora en fechas distintas; en Central es una hora antes y en Pacífico, tres. El precio se publica en dólares en esta misma ficha, sin formularios. Si tu empresa tiene un programa de asistencia educativa, recibes el recibo en USD y la descripción del curso para solicitar el reembolso; la aprobación depende de tu empleador.",
    ],
    porCurso: {
      chatgpt: [
        "En Estados Unidos muchos profesionales hispanohablantes trabajan todo el día con documentos, correos y planillas en inglés, pero prefieren dominar la herramienta en español. Este curso de ChatGPT (20 horas en vivo por Zoom, sin programar) cubre prompting profesional, análisis de Excel y CSV, Projects, plugins y ChatGPT Work con foco en verificación y privacidad.",
        "Las clases se siguen en hora del Este (Miami y Nueva York, entre 17:30 y 19:30 según la época del año; una hora menos en Central y tres en Pacífico) y quedan grabadas en el campus. El precio se publica en dólares (USD) en esta misma ficha, sin formularios, y recibes recibo en USD para programas de asistencia educativa.",
      ],
      gemini: [
        "Pensado para profesionales hispanohablantes en Estados Unidos que usan Google Workspace en inglés en su oficina y quieren dominar Gemini en español en vivo. En 20 horas prácticas cubres Gmail, Docs, Slides, Google Sheets, extracción de datos desde PDF, Gemini Notebook (NotebookLM) y Deep Research sin escribir código.",
        "La cohorte se dicta en hora del Este (entre 17:30 y 19:30 según el cambio horario) con grabaciones en el campus virtual. El valor en dólares (USD) aparece publicado directamente en esta ficha y entregamos recibo en USD por si tu empleador ofrece reembolso educativo.",
      ],
    },
  },
  es: {
    parrafos: [
      "En las pymes y departamentos financieros de España, el reporting mensual suele depender de exportar listados de Holded, Sage, A3ERP o Dynamics 365 Business Central y cuadrarlos a mano en Excel. Este curso recorre todo el proceso técnico para automatizar la ingesta, ordenar el modelo y generar cuadros de mando fiables con indicadores de banca, turismo, retail, energía o logística, integrando referencias como el INE, el Banco de España y datos.gob.es.",
      "Las cohortes abiertas se imparten en directo desde Chile de 19:30 a 21:30 (23:30–01:30 CET en invierno europeo y 01:30–03:30 CEST en verano; una hora menos en Canarias), por lo que todas las sesiones quedan grabadas en HD en el campus virtual para seguirlas a tu ritmo con soporte docente. El precio en dólares (USD) figura directamente en esta ficha sin formularios previos y se abona en pago único con tarjeta internacional; no es bonificable por FUNDAE, aunque entregamos factura internacional deducible.",
    ],
    porCurso: {
      "power-bi": [
        "Este curso de Power BI online (20 horas por nivel) está diseñado para analistas, controllers y responsables de área en España que necesitan dejar atrás los informes manuales de Excel alimentados desde Holded, Sage, A3ERP o Dynamics 365. Aprenderás a automatizar la transformación con Power Query (M), construir un modelo en estrella limpio y escribir medidas DAX en euros para cuadros de mando de ventas, tesorería, rotación de stock o márgenes.",
        "Las sesiones en directo se emiten desde Chile en horario nocturno español (23:30–01:30 CET en invierno / 01:30–03:30 CEST en verano, 1 h menos en Canarias), con acceso inmediato a las grabaciones en HD y materiales en el campus virtual. El temario cubre las competencias clave del examen oficial Microsoft PL-300 y se abona en un pago único en USD con tarjeta internacional, sin bonificación FUNDAE.",
      ],
      "analisis-de-datos": [
        "El programa de Análisis de Datos reúne en 60 horas por nivel (20 h de SQL Server, 20 h de Power BI y 20 h de Python) las tres herramientas más demandadas en las ofertas de Business Intelligence y Data Analyst en España. Partirás consultando bases transaccionales y registros de facturación, limpiarás ficheros complejos con Pandas y publicarás cuadros de mando ejecutivos con datos de retail, banca, turismo o energía.",
        "La modalidad abierta combina sesiones en directo desde Chile con grabaciones en HD en el campus virtual para estudiar cómodamente desde cualquier provincia española o Canarias, además de tutoría docente. El importe total en dólares (USD) se muestra sin formularios previos y se paga en un cargo único internacional; para equipos de empresa ofrecemos edición in-company en jornada laboral CET/CEST.",
      ],
      python: [
        "Cuando los ficheros de proveedores, los listados de TPV o las series de precios horarios de OMIE superan la capacidad de una hoja de cálculo, automatizar con Python marca la diferencia. En 20 horas prácticas aprenderás a cargar archivos Excel y CSV con Pandas, normalizar formatos españoles de fecha y decimales, cruzar tablas con merge y generar gráficos ejecutivos con Matplotlib, Seaborn y Plotly.",
        "Las clases en directo desde Chile quedan grabadas en HD en el campus virtual para que puedas seguirlas desde España en tu propio horario, replicando los cuadernos paso a paso en tu ordenador Windows o Mac. El precio directo en USD se abona con tarjeta internacional en un pago único (no bonificable por FUNDAE, con factura corporativa internacional disponible).",
      ],
      "sql-server": [
        "El curso de SQL Server y T-SQL (20 horas por nivel) prepara a profesionales de control de gestión, operaciones y finanzas en España para consultar directamente el ERP o el almacén de datos sin esperar a informática. Practicarás SELECT, filtros, INNER/LEFT JOIN, GROUP BY, vistas y procedimientos almacenados sobre tablas de pedidos, albaranes, inventarios y cobros.",
        "Al celebrarse en directo de noche en España (23:30–01:30 CET / 01:30–03:30 CEST), dispones de todas las grabaciones en HD en el campus virtual y guías para instalar SQL Server en Windows o trabajar desde Mac. Tarifa transparente en USD sin formularios previos y pago único con tarjeta internacional.",
      ],
      excel: [
        "Pensado para equipos administrativos, financieros y comerciales en España que viven dentro de hojas de cálculo pero pierden horas consolidando cierres mensuales, liquidaciones de IVA o cuadros de nóminas. Dominarás tablas dinámicas avanzadas, funciones de búsqueda, Power Query y automatización para reducir errores manuales en tus reportes diarios.",
        "Compatible al 100 % con ordenadores Windows y Mac. Si la franja en directo desde Chile (23:30–01:30 CET en invierno / 01:30–03:30 CEST en verano) no te encaja, cursas el programa con las grabaciones en HD del campus virtual y el soporte del profesorado. Precio publicado en USD en un único pago.",
      ],
      claude: [
        "Aprende a integrar Claude (Anthropic) en el análisis de datos, redacción de fórmulas complejas, generación de código Python/SQL y revisión de informes financieros en España con criterio de privacidad. Ponemos especial foco en el cumplimiento del RGPD y la LOPDGDD: anonimización previa de DNI/NIE, nóminas y datos personales antes de trabajar con modelos de IA.",
        "El curso de 20 horas incluye acceso a las grabaciones en HD en el campus virtual para seguirlo desde España sin depender del horario nocturno del directo. Se contrata en pago único en USD con tarjeta internacional; si buscas formar a todo un departamento bajo políticas corporativas, disponemos de formato in-company en horario CET/CEST.",
      ],
      chatgpt: [
        "Aprende a integrar ChatGPT en el análisis de hojas de cálculo, redacción de informes, revisión de documentos de facturación y AEAT y automatización ligera con ChatGPT Work en España, sin programar. Ponemos especial foco en el cumplimiento del RGPD y la LOPDGDD: anonimización previa de DNI/NIE, nóminas y datos personales antes de trabajar con modelos de IA.",
        "El curso de 20 horas incluye acceso a las grabaciones en HD en el campus virtual para seguirlo desde España sin depender del horario nocturno del directo (23:30–01:30 CET / 01:30–03:30 CEST). Se contrata en pago único en USD con tarjeta internacional (no bonificable por FUNDAE, con factura internacional deducible); para empresas ofrecemos formato in-company en horario CET/CEST.",
      ],
      gemini: [
        "Domina Gemini dentro de Google Workspace en España (Gmail, Docs, Slides, Google Sheets, extracción de PDF, Gemini Notebook y Deep Research) aplicado a informes de gestión, facturación y trámites ante la AEAT, sin programar. Trabajamos con criterio estricto de RGPD y LOPDGDD: anonimización previa de DNI/NIE, nóminas y datos personales.",
        "Las 20 horas del programa quedan grabadas en HD en el campus virtual para cursarlas a tu ritmo desde cualquier punto de España, sin depender del directo nocturno. El importe en USD se muestra en esta ficha en pago único con tarjeta internacional (no bonificable por FUNDAE, con factura internacional disponible), y contamos con edición in-company en horario CET/CEST.",
      ],
    },
  },
  bo: {
    parrafos: [
      "En Bolivia el cierre de mes suele empezar en la facturación electrónica en línea del SIN y terminar en una planilla que alguien rearma cada vez. El curso ordena ese recorrido con un modelo que se actualiza solo: la consulta trae los comprobantes, el modelo cruza volumen y costo, y el tablero responde sin depender de una persona. Los ejercicios vienen de minería e hidrocarburos, donde producción por turno y costo por operación pesan tanto como el margen final.",
      "Las clases se dictan desde Chile y se ven en hora de La Paz. Bolivia se mantiene en UTC-4 todo el año mientras Chile cambia entre UTC-3 y UTC-4 por el horario de verano, así que la equivalencia se mueve en parte del año y la hora se confirma en la ficha de cada cohorte. Los casos de práctica cubren también agro y comercio: campaña y rendimiento por hectárea, rotación de inventario y margen por línea de venta.",
    ],
    porCurso: porCursoRegional("Bolivia"),
  },
  cr: {
    parrafos: [
      "En Costa Rica el reporte de gestión convive con los comprobantes electrónicos del Ministerio de Hacienda, el sistema de reservas y la planilla de operaciones. El curso une esas fuentes en un modelo único, para que el tablero de ocupación, ingreso por servicio y costo por atención se actualice sin intervención manual y resista la pregunta de gerencia sobre qué cambió respecto del mes anterior. Los ejercicios usan servicios y turismo: temporada alta y baja, ocupación por propiedad y margen por paquete vendido.",
      "Las clases se ven en hora de San José: Costa Rica se mantiene en UTC-6 todo el año y Chile cambia con el horario de verano, por eso la equivalencia se corre en algunos meses y conviene revisar el horario publicado para cada cohorte. Los casos incluyen también dispositivos médicos y agro: rendimiento por línea, control de calidad, costo por hectárea y destino de exportación. Los datos salen de los comprobantes electrónicos, del sistema de producción y de las planillas de campo.",
    ],
    porCurso: porCursoRegional("Costa Rica"),
  },
  ec: {
    parrafos: [
      "En Ecuador el dato suele llegar tarde porque vive en los comprobantes electrónicos del SRI, en el sistema de planta y en la planilla que exportaciones actualiza a mano. El curso convierte ese flujo en un proceso repetible: la consulta se ejecuta sola, el modelo calcula costo y margen, y el tablero llega a la reunión sin retoques de último minuto. Las prácticas usan agroexportación de banano, cacao y flores, con campaña, calibre y destino como variables.",
      "Las clases se dictan desde Chile y se ven en hora de Quito: Ecuador se mantiene en UTC-5 todo el año y Chile cambia entre UTC-3 y UTC-4 por el horario de verano, así que la equivalencia se mueve según la fecha. Los ejercicios cubren también petróleo, retail y el crédito de cooperativas: producción y costo por operación, venta por local y cartera por socio. Los datos de partida son comprobantes del SRI, registros de planta y el sistema comercial.",
    ],
    porCurso: porCursoRegional("Ecuador"),
  },
  sv: {
    parrafos: [
      "En El Salvador el control de gestión se arma cerca del comercio: el Documento Tributario Electrónico del Ministerio de Hacienda marca la venta y el resto se cruza con el inventario y la planilla de sucursal. El curso deja ese cruce en un modelo que se actualiza solo y responde por tienda, por día y por margen, sin que nadie rehaga el archivo cada semana. Los ejercicios usan comercio y manufactura ligera: rotación de inventario, quiebre por local y costo por línea.",
      "Las clases se ven en hora de San Salvador: El Salvador se mantiene en UTC-6 todo el año y Chile cambia con el horario de verano, por eso la equivalencia se corre en algunos meses y la hora se confirma en la ficha de cada cohorte. Los casos de práctica incluyen banca y el flujo de remesas: cartera, mora, recaudo y conciliación de pagos. Los datos salen del DTE, del sistema de inventario y de las bases transaccionales del negocio.",
    ],
    porCurso: porCursoRegional("El Salvador"),
  },
  gt: {
    parrafos: [
      "En Guatemala la factura electrónica en línea de la SAT convive con el sistema de inventario y con la planilla que retail actualiza a diario. El curso ordena ese material en un modelo que se actualiza sin intervención: venta por tienda, inventario disponible y margen por categoría, con el detalle suficiente para explicar la variación en el comité. Los ejercicios vienen de agroexportación y retail, con campaña, calibre, destino y quiebre de stock como variables.",
      "Las clases se dictan desde Chile y se ven en hora de Guatemala: el país se mantiene en UTC-6 todo el año y Chile cambia por horario de verano, así que la equivalencia se mueve en parte del año y el horario se publica en la ficha de la cohorte. Las prácticas cubren también manufactura y remesas: rendimiento por línea, costo por turno y conciliación de pagos. Los datos de partida son los documentos de la FEL, los registros del ERP y los reportes de tienda.",
    ],
    porCurso: porCursoRegional("Guatemala"),
  },
  do: {
    parrafos: [
      "En República Dominicana el tablero de gestión suele mezclar turismo y zonas francas en la misma conversación: ocupación, ingreso por servicio, producción por línea y costo por turno. El curso toma el Comprobante Fiscal Electrónico de la DGII como punto de partida y lo cruza con el sistema de operación, para que el modelo se actualice solo y el área comercial discuta decisiones y no definiciones de campos. Los ejercicios usan turismo y zonas francas, con temporada, ocupación, rendimiento por línea y margen por contrato.",
      "Las clases se ven en hora de Santo Domingo: República Dominicana se mantiene en UTC-4 todo el año y Chile cambia entre UTC-3 y UTC-4 por el horario de verano, por eso la equivalencia se corre en algunos meses y el horario publicado se ajusta a esa diferencia. Los casos incluyen también retail y banca: venta por canal, inventario, cartera y recaudo. Los datos salen del e-CF, del sistema comercial y de las bases de operación.",
    ],
    porCurso: porCursoRegional("República Dominicana"),
  },
  ve: {
    parrafos: [
      "En Venezuela el reporte de gestión se arma con lo que hay: la facturación electrónica del SENIAT, el sistema de inventario y la planilla de operaciones. El curso convierte ese material disperso en un modelo que se actualiza solo, con venta por canal, costo por operación y margen visibles para quien decide, sin que el informe dependa de una persona. Los ejercicios usan petróleo y comercio: producción, despacho, rotación de inventario y margen por línea de venta.",
      "Las clases se dictan desde Chile y se ven en hora de Caracas: Venezuela se mantiene en UTC-4 todo el año, igual que Bolivia, mientras Chile cambia con el horario de verano, así que la equivalencia se mueve en parte del año. Los casos de práctica incluyen servicios: costo por atención, tiempo de respuesta y rentabilidad por contrato. Los datos de partida son los comprobantes del SENIAT, los registros del sistema comercial y las planillas de operación.",
    ],
    porCurso: porCursoRegional("Venezuela"),
  },
};

/** Texto de ficha del mercado. `null` para países sin ficha propia. */
export function getFichaPais(
  iso: string | null | undefined,
  cursoSlug?: string
): FichaPais | null {
  if (!iso) return null;
  const ficha = FICHA_PAIS[iso];
  if (!ficha) return null;
  const especificos = cursoSlug ? ficha.porCurso?.[cursoSlug] : undefined;
  return especificos ? { ...ficha, parrafos: especificos } : ficha;
}
