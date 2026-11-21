import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "tabla-calendario-power-bi-dax",
  title: "Tabla calendario en Power BI con DAX (código listo)",
  meta: "Crea una tabla calendario en Power BI con DAX o Power Query, márcala como tabla de fechas y úsala en un modelo estrella. Incluye feriados de Chile.",
  h1: "Cómo crear una tabla calendario en Power BI (DAX y Power Query)",
  subtitle:
    "Código listo para copiar en DAX y en lenguaje M, configuración correcta en español de Chile, ordenamiento de meses y manejo profesional de feriados y días hábiles.",
  keywordPrincipal: "tabla calendario Power BI",
  keywords: [
    "tabla calendario Power BI",
    "tabla calendario DAX",
    "modelo estrella Power BI",
    "feriados de Chile Power BI",
  ],
  curso: "power-bi",
  herramienta: "Power BI",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Implementar una tabla de fechas continua en Power BI usando DAX o Power Query, configurarla como tabla de fechas oficial y sumar columnas útiles en español más una marca de días hábiles de Chile.",
    herramienta: "Power BI Desktop (DAX / Power Query)",
    tiempo: "20 minutos",
    bullets: [
      "Entender por qué las funciones de Inteligencia de Tiempo exigen una tabla calendario dedicada.",
      "Copiar el script DAX seguro compatible con cualquier configuración regional.",
      "Comparar cuándo conviene crear la tabla calendario en DAX vs Power Query (M).",
      "Integrar una tabla auxiliar de feriados de Chile para calcular días hábiles reales.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Por qué es obligatoria",
      resumen: "Cómo exige Time Intelligence fechas continuas.",
      anchorId: "para-que-sirve",
      icono: "calendar",
    },
    {
      numero: 2,
      titulo: "Opción DAX",
      resumen: "Genera la tabla con ADDCOLUMNS y CALENDAR.",
      anchorId: "opcion-dax",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "Opción Power Query",
      resumen: "Alternativa en M y comparativa frente a DAX.",
      anchorId: "opcion-power-query",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Columnas y orden",
      resumen: "Etiquetas en español y orden cronológico.",
      anchorId: "columnas-espanol",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "Marcar tabla y feriados",
      resumen: "Declara la tabla de fechas y calcula días hábiles.",
      anchorId: "marcar-tabla-fechas",
      icono: "check",
    },
    {
      numero: 6,
      titulo: "Modelo estrella",
      resumen: "Conecta la dimensión tiempo a tus hechos.",
      anchorId: "encaje-modelo-estrella",
      icono: "layers",
    },
  ],
  requisitos: {
    version: "Power BI Desktop (Windows) o modelo tabular compatible",
    lista: [
      "Power BI Desktop abierto con al menos una tabla de hechos que contenga una columna de fecha (por ejemplo, Ventas[Fecha]).",
      "Desactivar la opción global 'Fecha y hora automáticas' si quieres evitar tablas ocultas duplicadas.",
      "Lista oficial de feriados de Chile si tu reporte mide días hábiles bancarios o comerciales.",
    ],
    compatibilidadMacWeb:
      "La creación de tablas calculadas en DAX y consultas M se realiza en Power BI Desktop sobre Windows. Una vez publicado el modelo en Power BI Service, las columnas y filtros de la tabla calendario funcionan normalmente en cualquier navegador web.",
  },
  herramientasHowTo: ["Power BI Desktop", "Editor DAX", "Power Query"],
  insumosHowTo: ["Columna de fecha en tabla de hechos", "Tabla auxiliar de feriados"],
  secciones: [
    {
      id: "para-que-sirve",
      titulo: "1. Para qué sirve una tabla calendario y por qué Time Intelligence la exige",
      esPasoHowTo: true,
      resumenHowTo:
        "Comprende el requisito de fechas continuas sin huecos que necesitan funciones como SAMEPERIODLASTYEAR o TOTALYTD.",
      parrafos: [
        "Cuando cargas una tabla de ventas o asistencias en Power BI, lo primero que suele hacer la herramienta es crear jerarquías automáticas escondidas detrás de cada columna de fecha. Aunque parece cómodo al comienzo, ese mecanismo infla el peso del archivo y falla en cuanto quieres comparar períodos entre distintas tablas de hechos, como Ventas reales contra Presupuesto.",
        "Las funciones de Inteligencia de Tiempo de DAX —como TOTALYTD, SAMEPERIODLASTYEAR, DATESINPERIOD o PARALLELPERIOD— están diseñadas bajo una regla matemática estricta: requieren una columna de fechas única y continua, con absolutamente todos los días desde el 1 de enero del primer año hasta el 31 de diciembre del último año, sin días saltados.",
        "En la práctica comercial, rara vez vendes o registras movimientos todos los días del año (por ejemplo, domingos o feriados irrenunciables). Si aplicas SAMEPERIODLASTYEAR directamente sobre Ventas[Fecha], faltarán días y los totales interanuales quedarán incompletos. Una tabla calendario dedicada resuelve ese problema para todo tu modelo.",
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-1",
        alt: "Configuración en Power BI Desktop desactivando la opción Fecha y hora automáticas para nuevos archivos",
        caption:
          "Recomendación inicial: desactiva Fecha y hora automáticas en Archivo > Opciones para mantener el modelo liviano.",
        ratio: "16/9",
      },
    },
    {
      id: "opcion-dax",
      titulo: "2. Opción DAX: código listo con ADDCOLUMNS y variante segura",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una tabla calculada en DAX con CALENDAR, ADDCOLUMNS y una alternativa con SWITCH para evitar problemas de idioma.",
      parrafos: [
        "La forma más rápida de generar la tabla calendario es mediante DAX desde Herramientas de tablas > Nueva tabla. Puedes usar CALENDAR con fechas fijas o con MIN y MAX sobre tu tabla de hechos, envolviendo ambos extremos en DATE(YEAR(...), 1, 1) y DATE(YEAR(...), 12, 31) para garantizar años completos.",
        "Un detalle técnico importante que genera confusión: muchos tutoriales usan FORMAT([Date], \"mmmm\", \"es-CL\") para obtener el nombre del mes en español. Sin embargo, el tercer parámetro de cultura en FORMAT no siempre está disponible en versiones antiguas o en ciertos entornos de análisis tabulares, o puede ignorarse si el servicio tiene otra configuración regional. Por eso te mostramos primero la variante 100 % segura con SWITCH(MONTH([Date]), ...), que siempre devuelve español sin depender de la configuración del servidor.",
      ],
      codigos: [
        {
          titulo: "Tabla Calendario DAX (variante segura con SWITCH en español)",
          lenguaje: "dax",
          codigo: `Calendario =
VAR FechaMin = DATE ( YEAR ( MIN ( Ventas[Fecha] ) ), 1, 1 )
VAR FechaMax = DATE ( YEAR ( MAX ( Ventas[Fecha] ) ), 12, 31 )
RETURN
ADDCOLUMNS (
    CALENDAR ( FechaMin, FechaMax ),
    "Anio", YEAR ( [Date] ),
    "MesNum", MONTH ( [Date] ),
    "Mes", SWITCH (
        MONTH ( [Date] ),
        1, "Enero", 2, "Febrero", 3, "Marzo", 4, "Abril",
        5, "Mayo", 6, "Junio", 7, "Julio", 8, "Agosto",
        9, "Septiembre", 10, "Octubre", 11, "Noviembre", 12, "Diciembre"
    ),
    "MesCorto", SWITCH (
        MONTH ( [Date] ),
        1, "Ene", 2, "Feb", 3, "Mar", 4, "Abr",
        5, "May", 6, "Jun", 7, "Jul", 8, "Ago",
        9, "Sep", 10, "Oct", 11, "Nov", 12, "Dic"
    ),
    "AnioMesNum", YEAR ( [Date] ) * 100 + MONTH ( [Date] ),
    "AnioMes", FORMAT ( [Date], "yyyy-MM" ),
    "Trimestre", "T" & QUARTER ( [Date] ),
    "DiaSemanaNum", WEEKDAY ( [Date], 2 ),
    "DiaSemana", SWITCH (
        WEEKDAY ( [Date], 2 ),
        1, "Lunes", 2, "Martes", 3, "Miércoles", 4, "Jueves",
        5, "Viernes", 6, "Sábado", 7, "Domingo"
    ),
    "EsFinDeSemana", IF ( WEEKDAY ( [Date], 2 ) >= 6, TRUE (), FALSE () )
)`,
          nota: "WEEKDAY([Date], 2) asigna 1 al lunes y 7 al domingo, que es el estándar laboral usado en Chile y Latinoamérica.",
        },
        {
          titulo: "Alternativa corta con FORMAT y cultura es-CL (verificar compatibilidad)",
          lenguaje: "dax",
          codigo: `"MesLocal", FORMAT ( [Date], "mmmm", "es-CL" )`,
          nota: "El tercer parámetro de cultura en FORMAT funciona en Power BI Desktop moderno y Power BI Service, pero puede fallar si migras el modelo a Analysis Services antiguo o si cambias de motor.",
        },
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-2",
        alt: "Vista de datos de Power BI Desktop mostrando la tabla Calendario generada por DAX con columnas en español",
        caption:
          "Resultado en Vista de tabla: fechas continuas con columnas de año, mes numérico, mes texto y día de semana.",
        ratio: "16/9",
      },
    },
    {
      id: "opcion-power-query",
      titulo: "3. Opción Power Query (M) y comparativa DAX vs M",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera la tabla calendario en Power Query cuando necesites cruzar feriados o reutilizar la lógica en Dataflows.",
      parrafos: [
        "La segunda gran alternativa es construir la tabla calendario en Power Query usando lenguaje M. Aunque requiere un par de clics adicionales, tiene una ventaja enorme: la tabla se materializa durante la actualización de datos antes de entrar al motor VertiPaq, por lo que puedes combinarla fácilmente con una tabla de feriados o empaquetarla en un Dataflow reutilizable para toda tu empresa.",
        "¿Cuál elegir entonces? En la siguiente tabla comparativa resumimos cuándo conviene DAX y cuándo Power Query.",
      ],
      tabla: {
        caption: "Comparativa técnica: tabla calendario en DAX vs Power Query (M).",
        encabezados: ["Criterio", "DAX (Tabla calculada)", "Power Query (Lenguaje M)"],
        filas: [
          [
            "Velocidad de implementación",
            "Muy rápida (pegar código y listo)",
            "Media (consulta en blanco + pasos)",
          ],
          [
            "Rango dinámico con la tabla de hechos",
            "Nativo con MIN/MAX de Ventas[Fecha]",
            "Posible, pero requiere referenciar la consulta de hechos",
          ],
          [
            "Cruce con API o Excel de feriados",
            "Limitado a LOOKUPVALUE después de cargar",
            "Ideal: permite Merge directo antes de cargar",
          ],
          [
            "Reutilización en Dataflows / Fabric",
            "No portable a Dataflows Gen1/Gen2",
            "100 % portable entre Dataflows y Excel",
          ],
          [
            "Compresión en memoria",
            "Excelente (se calcula al procesar)",
            "Excelente (llega comprimida al modelo)",
          ],
        ],
      },
      codigos: [
        {
          titulo: "Script M en Power Query (Consulta en blanco > Editor avanzado)",
          lenguaje: "m",
          codigo: `let
    FechaInicio = #date(2024, 1, 1),
    FechaFin = #date(2026, 12, 31),
    CantidadDias = Duration.Days(FechaFin - FechaInicio) + 1,
    ListaFechas = List.Dates(FechaInicio, CantidadDias, #duration(1, 0, 0, 0)),
    Tabla = Table.FromList(ListaFechas, Splitter.SplitByNothing(), {"Date"}),
    TipoFecha = Table.TransformColumnTypes(Tabla, {{"Date", type date}}),
    ConAnio = Table.AddColumn(TipoFecha, "Anio", each Date.Year([Date]), Int64.Type),
    ConMesNum = Table.AddColumn(ConAnio, "MesNum", each Date.Month([Date]), Int64.Type),
    ConMes = Table.AddColumn(ConMesNum, "Mes", each Date.MonthName([Date], "es-CL"), type text),
    ConDiaSemana = Table.AddColumn(ConMes, "DiaSemana", each Date.DayOfWeekName([Date], "es-CL"), type text)
in
    ConDiaSemana`,
          nota: "En Power Query, Date.MonthName([Date], \"es-CL\") acepta la cultura de forma nativa y consistente.",
        },
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-3",
        alt: "Editor avanzado de Power Query mostrando el código M para generar la lista de fechas entre 2024 y 2026",
        caption:
          "Consulta calendario en Power Query: ideal cuando deseas cruzar feriados antes de cargar al modelo.",
        ratio: "16/9",
      },
    },
    {
      id: "columnas-espanol",
      titulo: "4. Columnas en español y ordenamiento cronológico",
      esPasoHowTo: true,
      resumenHowTo:
        "Ordena las columnas de texto como Mes y DiaSemana por su equivalente numérico para evitar orden alfabético.",
      parrafos: [
        "Tener el nombre del mes en español no sirve de mucho si en tus gráficos aparece Abril antes que Enero. Power BI ordena cualquier columna de texto alfabéticamente a menos que le indiques explícitamente qué columna numérica define su jerarquía.",
        "Ve a la Vista de tabla, haz clic en la columna Mes, abre Herramientas de columnas > Ordenar por columna y selecciona MesNum. Repite exactamente el mismo procedimiento para MesCorto (ordenar por MesNum), AnioMes (ordenar por AnioMesNum) y DiaSemana (ordenar por DiaSemanaNum). Por último, oculta las columnas puramente auxiliares (como MesNum o AnioMesNum) en la vista de informe para que los usuarios no las arrastren por error a un gráfico.",
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-4",
        alt: "Menú Ordenar por columna en Power BI Desktop seleccionando MesNum para ordenar la columna Mes",
        caption:
          "Ordenar por columna: paso indispensable para que los ejes de tiempo respeten el orden de Enero a Diciembre.",
        ratio: "16/9",
      },
    },
    {
      id: "marcar-tabla-fechas",
      titulo: "5. Marcar como tabla de fechas y validar requisitos",
      esPasoHowTo: true,
      resumenHowTo:
        "Declara oficialmente la tabla como tabla de fechas en Power BI para habilitar el motor de Inteligencia de Tiempo.",
      parrafos: [
        "Este paso toma cinco segundos y es obligatorio si desactivaste Fecha y hora automáticas o si quieres asegurar que CALCULATE y SAMEPERIODLASTYEAR operen sin ambigüedad. Haz clic derecho sobre la tabla Calendario en el panel Datos y selecciona Marcar como tabla de fechas > Marcar como tabla de fechas.",
        "En el cuadro de diálogo, selecciona la columna Date. Power BI validará al instante cuatro condiciones: que la columna sea de tipo Fecha, que no contenga valores nulos, que no tenga duplicados y que forme una secuencia continua sin días faltantes. Si pasa la validación, verás un pequeño ícono de calendario sobre el campo Date.",
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-5",
        alt: "Cuadro de diálogo Marcar como tabla de fechas en Power BI validando correctamente la columna Date",
        caption:
          "Validación exitosa al marcar Calendario[Date] como columna oficial de fechas del modelo.",
        ratio: "16/9",
      },
    },
    {
      id: "feriados-chile",
      titulo: "6. Feriados y días hábiles de Chile sin hardcodear fechas móviles",
      esPasoHowTo: true,
      resumenHowTo:
        "Integra una tabla auxiliar de feriados de Chile desde fuente oficial para calcular días hábiles reales en DAX.",
      parrafos: [
        "En reportes financieros, logísticos o de recursos humanos en Chile, contar días hábiles excluyendo solo sábados y domingos da un resultado impreciso por los feriados legales. Sin embargo, nunca debes escribir a mano dentro de tu código DAX las fechas de feriados móviles como Semana Santa o elecciones legales, porque cambian cada año y requieren mantenimiento manual.",
        "La práctica profesional consiste en mantener una tabla auxiliar llamada FeriadosChile (en un Excel corporativo, SharePoint o consultando la lista oficial publicada en el portal del Gobierno de Chile https://www.gob.cl/feriados/ o en https://www.feriados.cl) con dos columnas: Fecha y DescripcionFeriado. Luego agregas una columna calculada en tu Calendario usando RELATED o LOOKUPVALUE para saber si ese día es hábil.",
      ],
      codigos: [
        {
          titulo: "Columna calculada y medida de días hábiles usando tabla auxiliar FeriadosChile",
          lenguaje: "dax",
          codigo: `EsFeriado =
NOT ISBLANK ( LOOKUPVALUE ( FeriadosChile[Fecha], FeriadosChile[Fecha], Calendario[Date] ) )

EsDiaHabil =
IF ( Calendario[DiaSemanaNum] <= 5 && NOT Calendario[EsFeriado], 1, 0 )

-- Medida para contar días hábiles del período seleccionado:
Dias Habiles = SUM ( Calendario[EsDiaHabil] )`,
          nota: "Mantén actualizados los feriados del año en tu tabla FeriadosChile consultando las fuentes oficiales antes de cada cierre anual.",
        },
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-paso-6",
        alt: "Tabla Calendario con las columnas EsFeriado y EsDiaHabil marcando días hábiles en Chile",
        caption:
          "Integración con tabla auxiliar de feriados: evita hardcodear fechas móviles en fórmulas DAX.",
        ratio: "16/9",
      },
    },
    {
      id: "encaje-modelo-estrella",
      titulo: "7. Dónde encaja la tabla calendario en el modelo estrella",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta la tabla calendario con relación 1 a muchos hacia todas tus tablas de hechos y úsala en tus segmentadores.",
      parrafos: [
        "En la Vista de modelo, ubica la tabla Calendario en la fila superior junto a tus demás dimensiones (Productos, Clientes, Sucursales). Arrastra Calendario[Date] sobre la columna de fecha de tu tabla de hechos (por ejemplo, Ventas[Fecha]) y repite el enlace si tienes una tabla de Presupuesto o Metas.",
        "Una vez conectadas, aplica una regla de oro en todo tu informe: oculta los campos de fecha de las tablas de hechos y construye todos tus filtros, ejes de gráficos y medidas DAX usando únicamente las columnas de Calendario. Así garantizas que un solo filtro de Año o Mes controle al unísono ventas, costos, metas y comparaciones contra el año anterior. Para ver esta tabla en acción dentro de un proyecto completo, revisa la guía de dashboard de ventas en Power BI (/guias/dashboard-de-ventas-en-power-bi-paso-a-paso) y profundiza en nuestra guía de funciones DAX más importantes (/guias/funciones-dax-mas-importantes).",
      ],
      captura: {
        id: "tabla-calendario-power-bi-dax-modelo-estrella",
        alt: "Diagrama de modelo estrella en Power BI con la tabla Calendario conectada 1 a muchos hacia Ventas y Presupuesto",
        caption:
          "Modelo estrella limpio: Calendario actúa como dimensión compartida para filtrar múltiples tablas de hechos.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "CALENDAR falla indicando que el rango contiene valores en blanco",
      causa:
        "La tabla de hechos tiene filas con la columna Fecha vacía (BLANK), haciendo que MIN(Ventas[Fecha]) devuelva nulo.",
      solucion:
        "Filtra o corrige los nulos en Power Query antes de cargar, o usa MINX / fechas explícitas limpias.",
    },
    {
      error: "Al conectar Calendario[Date] con Ventas[Fecha] la relación queda como muchos a muchos",
      causa:
        "La columna Ventas[Fecha] incluye componente de hora (DateTime), o la tabla Calendario quedó con fechas duplicadas.",
      solucion:
        "Cambia el tipo de Ventas[Fecha] a Fecha pura (sin hora) en Power Query y verifica que Calendario tenga un registro por día.",
    },
    {
      error: "La función TOTALYTD ignora los filtros del año anterior",
      causa:
        "Se usó Ventas[Fecha] en lugar de Calendario[Date] dentro de la fórmula DAX, o la tabla no está marcada como tabla de fechas.",
      solucion:
        "Sustituye cualquier referencia a fechas de hechos por Calendario[Date] y confirma la marca de tabla de fechas.",
    },
    {
      error: "Los nombres de meses aparecen en inglés al publicar en Power BI Service",
      causa:
        "Se usó FORMAT([Date], \"mmmm\") sin cultura o el servidor en la nube tiene configuración en inglés.",
      solucion:
        "Usa la variante explícita con SWITCH(MONTH([Date]), ...) para garantizar nombres en español en cualquier entorno.",
    },
  ],
  plantilla: {
    titulo: "Snippet DAX y M + Plantilla Calendario Chile",
    descripcion:
      "Próximamente podrás descargar aquí el archivo .pbix base con la tabla calendario en DAX y Power Query ya configurada y lista para copiar en tus proyectos.",
  },
  faqs: [
    {
      q: "¿Puedo usar CALENDARAUTO() en lugar de CALENDAR()?",
      a: "CALENDARAUTO() escanea todas las columnas de fecha de tu modelo (incluidas fechas de nacimiento de clientes o fechas de vencimiento lejanas) y suele crear rangos innecesariamente gigantes de 80 o 100 años. Por eso en producción es mejor usar CALENDAR con el MIN y MAX de tu tabla de ventas.",
    },
    {
      q: "¿Qué pasa si mi tabla de ventas tiene fecha y hora?",
      a: "Si conectas una columna Fecha/Hora contra Calendario[Date] (que tiene hora 00:00:00), las ventas de las 14:30 no coincidirán con ningún día en la relación. Separa la fecha de la hora en Power Query antes de cargar al modelo.",
    },
    {
      q: "¿Debo tener una tabla calendario distinta para fecha de pedido y fecha de despacho?",
      a: "No necesariamente. Puedes crear una relación activa entre Calendario[Date] y FechaPedido, y una relación inactiva hacia FechaDespacho, activándola en medidas puntuales mediante USERELATIONSHIP.",
    },
    {
      q: "¿Cómo actualizo los feriados de Chile cada año sin romper el reporte?",
      a: "Guarda los feriados en un archivo Excel o lista de SharePoint externa al .pbix, actualízala una vez al año desde la fuente oficial y conecta esa tabla por Power Query.",
    },
  ],
  relacionadas: [
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
    "conectar-power-bi-api-banco-central",
    "automatizar-reportes-con-power-bi",
  ],
  enlacesExternos: [
    {
      label: "Diseño de tablas de fechas en Power BI",
      url: "https://learn.microsoft.com/es-es/power-bi/guidance/model-date-tables",
      fuente: "Microsoft Learn",
    },
    {
      label: "Feriados oficiales de Chile",
      url: "https://www.feriados.cl",
      fuente: "Feriados.cl",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Funciones DAX más importantes",
      href: "/guias/funciones-dax-mas-importantes",
      descripcion: "Aprende CALCULATE, SAMEPERIODLASTYEAR y TOTALYTD usando tu nueva tabla calendario.",
    },
  ],
};

export default guia;
