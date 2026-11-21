import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "conectar-power-bi-api-banco-central",
  title: "Conectar Power BI a la API del Banco Central de Chile",
  meta: "Lleva el dólar, la UF y otras series del BCCh a Power BI con Web.Contents, parámetros y actualización programada. Código M listo para copiar y probado.",
  h1: "Cómo conectar Power BI a la API del Banco Central (BDE) paso a paso",
  subtitle:
    "Integra series económicas oficiales directamente en tu modelo semántico de Power BI usando RelativePath y Query en Web.Contents para que el servicio en la nube refresque sin errores de fuente dinámica.",
  keywordPrincipal: "conectar Power BI a una API",
  keywords: [
    "conectar Power BI a una API",
    "Power BI API REST",
    "Power BI Banco Central",
    "dolar en Power BI",
    "Web.Contents Power BI",
  ],
  curso: "power-bi",
  herramienta: "Power BI",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Un modelo en Power BI Desktop conectado a la Base de Datos Estadísticos (BDE) del Banco Central de Chile, relacionado con una tabla calendario y listo para actualizarse automáticamente en Power BI Service.",
    herramienta: "Power BI Desktop + Power Query (M) + DAX",
    tiempo: "30 minutos",
    bullets: [
      "Configuras parámetros pUsuario y pClave y separas la URL base con RelativePath y Query para evitar el bloqueo de orígenes dinámicos en Power BI Service.",
      "Descargas la serie F073.TCO.PRE.Z.D (dólar observado) y aprendes a descubrir códigos de UF, UTM o IPC usando SearchSeries sin adivinar.",
      "Creas medidas DAX de último dólar, variación diaria y variación mensual conectadas a tu tabla calendario.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "API BDE y registro",
      resumen: "Qué ofrece el servicio y cómo obtener usuario y clave.",
      anchorId: "que-ofrece-api-bde",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Parámetros seguros",
      resumen: "Crea pUsuario y pClave en Power Query.",
      anchorId: "parametros-seguros-power-query",
      icono: "shield",
    },
    {
      numero: 3,
      titulo: "Serie dólar en M",
      resumen: "Usa RelativePath + Query en Web.Contents para refresco en la nube.",
      anchorId: "consulta-dolar-relativepath",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Función y SearchSeries",
      resumen: "Generaliza con fnSerieBDE y busca series DAILY/MONTHLY.",
      anchorId: "funcion-y-busqueda-series",
      icono: "layers",
    },
    {
      numero: 5,
      titulo: "Calendario y DAX",
      resumen: "Relaciona con DimCalendario y calcula variaciones.",
      anchorId: "calendario-y-medidas-dax",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Publicar y programar",
      resumen: "Configura credenciales anónimas y refresco programado.",
      anchorId: "publicar-y-programar-refresco",
      icono: "refresh",
    },
  ],
  requisitos: {
    version: "Power BI Desktop (actualizado en Windows).",
    lista: [
      "Cuenta gratuita registrada en los Web Services estadísticos (BDE) del Banco Central de Chile.",
      "Cuenta de Power BI Service (licencia Free o Pro) si deseas publicar y programar la actualización automática.",
      "Una tabla calendario en tu modelo para habilitar inteligencia de tiempo en DAX.",
    ],
    compatibilidadMacWeb:
      "Power BI Desktop funciona únicamente en Windows (en Mac requiere máquina virtual o Parallels). Una vez publicado el informe en Power BI Service, cualquier usuario puede visualizarlo desde navegador en Windows, Mac o móvil.",
  },
  herramientasHowTo: [
    "Power BI Desktop",
    "Power Query Editor y lenguaje M",
    "Power BI Service",
  ],
  insumosHowTo: [
    "Usuario y clave gratuitos de la API BDE del Banco Central de Chile",
  ],
  secciones: [
    {
      id: "que-ofrece-api-bde",
      titulo: "Qué ofrece la API BDE del Banco Central y cómo registrarse",
      esPasoHowTo: false,
      parrafos: [
        "La Base de Datos Estadísticos (BDE / SIETE) del Banco Central de Chile expone miles de series macroeconómicas oficiales mediante un servicio web REST gratuito: tipos de cambio diarios, tasas de interés, cuentas nacionales, balanza comercial, precios e indicadores monetarios. Al consumirla directamente desde Power BI eliminas archivos Excel intermedios y aseguras que tu reporte gerencial muestre exactamente la misma cifra que publica el instituto emisor.",
        "Para usarla necesitas solicitar credenciales en el portal oficial de Web Services del Banco Central (encontrarás el enlace en la sección de fuentes al final). El sistema te asigna un usuario (pUsuario) y una contraseña (pClave) exclusivos para llamadas al endpoint SieteRestWS.ashx. Nunca incluyas esas credenciales reales en repositorios públicos ni en capturas compartidas.",
        "A diferencia de una planilla local que solo se actualiza cuando alguien abre el archivo, conectar Power BI directamente a la API BDE permite centralizar el tipo de cambio y otros indicadores en un único modelo semántico corporativo. Así, los equipos de finanzas, control de gestión y comercial consultan siempre la misma serie histórica sin discrepancias entre reportes.",
      ],
    },
    {
      id: "parametros-seguros-power-query",
      titulo: "Paso 1: Crear los parámetros pUsuario y pClave en Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Abre Transformar datos en Power BI Desktop y crea dos parámetros de texto llamados pUsuario y pClave para aislar tus credenciales del código M.",
      parrafos: [
        "En Power BI Desktop ve a Inicio > Transformar datos para abrir el Editor de Power Query. Luego entra a Administrar parámetros > Nuevo parámetro y crea el primero con nombre pUsuario, tipo Texto y tu usuario en Valor actual. Repite el proceso para pClave.",
        "Separar las credenciales en parámetros tiene dos ventajas inmediatas: puedes editar la contraseña desde la configuración del conjunto de datos en Power BI Service sin volver a abrir el .pbix, y puedes limpiar los valores antes de compartir la plantilla con colegas.",
      ],
      captura: {
        id: "conectar-power-bi-api-banco-central-paso-1",
        alt: "Ventana Administrar parámetros en Power Query de Power BI Desktop con pUsuario y pClave configurados como tipo Texto",
        caption: "Parámetros pUsuario y pClave creados en Power Query para autenticar las consultas BDE.",
        ratio: "16/9",
      },
    },
    {
      id: "consulta-dolar-relativepath",
      titulo: "Paso 2: Consultar el dólar observado usando RelativePath y Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta Web.Contents separando la URL base de RelativePath y Query para evitar el error de origen de datos dinámico al programar la actualización en Power BI Service.",
      parrafos: [
        "Este es el detalle técnico más importante de toda la guía. Si concatenas los parámetros directamente en una cadena de URL dentro de Web.Contents(\"https://si3.bcentral.cl/...user=\" & pUsuario), Power BI Desktop funcionará sin problemas en tu PC, pero al publicar en Power BI Service aparecerá el temido bloqueo: «Este conjunto de datos incluye un origen de datos dinámico. Dado que los orígenes de datos dinámicos no se actualizan en el servicio Power BI...».",
        "La solución oficial consiste en pasarle a Web.Contents únicamente el dominio raíz estático (\"https://si3.bcentral.cl\") como primer argumento, y mover la ruta del endpoint a la opción RelativePath y los parámetros de consulta al registro Query. De ese modo Power BI Service valida el dominio base estático y habilita el botón de actualización programada.",
      ],
      codigos: [
        {
          titulo: "Consulta M para dólar observado (F073.TCO.PRE.Z.D) compatible con refresco en la nube",
          lenguaje: "m",
          mostrarLineas: true,
          codigo: `let
    Respuesta = Json.Document(
        Web.Contents(
            "https://si3.bcentral.cl",
            [
                RelativePath = "SieteRestWS/SieteRestWS.ashx",
                Query = [
                    user = pUsuario,
                    pass = pClave,
                    firstdate = "2024-01-01",
                    timeseries = "F073.TCO.PRE.Z.D",
                    function = "GetSeries"
                ]
            ]
        )
    ),
    Obs = Respuesta[Series][Obs],
    Tabla = Table.FromList(Obs, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(Tabla, "Column1", {"indexDateString", "value"}, {"FechaTxt", "ValorTxt"}),
    SinNaN = Table.SelectRows(Expandido, each [ValorTxt] <> null and [ValorTxt] <> "NaN"),
    Tipado = Table.TransformColumns(
        SinNaN,
        {
            {"FechaTxt", each Date.FromText(_, "es-CL"), type date},
            {"ValorTxt", each Number.FromText(_, "en-US"), type number}
        }
    ),
    Renombrado = Table.RenameColumns(Tipado, {{"FechaTxt", "Fecha"}, {"ValorTxt", "Valor"}}),
    Ordenado = Table.Sort(Renombrado, {{"Fecha", Order.Ascending}})
in
    Ordenado`,
          nota: "El filtro SinNaN descarta los días inhábiles donde la API devuelve \"NaN\", y Number.FromText(_, \"en-US\") asegura que el punto decimal se lea correctamente sin importar la configuración regional de tu equipo.",
        },
      ],
      captura: {
        id: "conectar-power-bi-api-banco-central-paso-2",
        alt: "Editor avanzado de Power Query en Power BI mostrando Web.Contents con RelativePath y Query consultando F073.TCO.PRE.Z.D",
        caption: "Uso de RelativePath y Query en Web.Contents para habilitar la actualización programada en Power BI Service.",
        ratio: "16/9",
      },
    },
    {
      id: "funcion-y-busqueda-series",
      titulo: "Paso 3: Generalizar con fnSerieBDE y buscar códigos con SearchSeries",
      esPasoHowTo: true,
      resumenHowTo:
        "Convierte la consulta en una función fnSerieBDE(codigo, desde) y utiliza el endpoint SearchSeries (DAILY o MONTHLY) para descubrir los códigos exactos de UF, UTM o IPC sin adivinar.",
      parrafos: [
        "En lugar de copiar y pegar el código anterior para cada indicador nuevo, conviértelo en una función reutilizable fnSerieBDE(codigo as text, desde as text). Así podrás traer cualquier serie del Banco Central invocando la función con su código oficial y la fecha de inicio.",
        "¿Y cómo averiguas el código exacto de la UF diaria, la UTM mensual o el IPC vigente sin inventarlo ni depender de blogs desactualizados? La misma API BDE incluye la operación SearchSeries, que devuelve el catálogo oficial filtrado por frecuencia (DAILY, MONTHLY, QUARTERLY o ANNUAL). Ejecuta una consulta rápida con function = \"SearchSeries\" y frequency = \"DAILY\" (o \"MONTHLY\"), filtra por título en Power Query y copia el seriesId exacto que devuelve el Banco Central.",
      ],
      codigos: [
        {
          titulo: "Función M fnSerieBDE(codigo, desde)",
          lenguaje: "m",
          mostrarLineas: true,
          codigo: `(codigo as text, desde as text) as table =>
let
    Respuesta = Json.Document(
        Web.Contents(
            "https://si3.bcentral.cl",
            [
                RelativePath = "SieteRestWS/SieteRestWS.ashx",
                Query = [
                    user = pUsuario,
                    pass = pClave,
                    firstdate = desde,
                    timeseries = codigo,
                    function = "GetSeries"
                ]
            ]
        )
    ),
    Obs = Respuesta[Series][Obs],
    Tabla = Table.FromList(Obs, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(Tabla, "Column1", {"indexDateString", "value"}, {"FechaTxt", "ValorTxt"}),
    SinNaN = Table.SelectRows(Expandido, each [ValorTxt] <> null and [ValorTxt] <> "NaN"),
    Tipado = Table.TransformColumns(
        SinNaN,
        {
            {"FechaTxt", each Date.FromText(_, "es-CL"), type date},
            {"ValorTxt", each Number.FromText(_, "en-US"), type number}
        }
    ),
    Renombrado = Table.RenameColumns(Tipado, {{"FechaTxt", "Fecha"}, {"ValorTxt", "Valor"}})
in
    Renombrado`,
        },
        {
          titulo: "Consulta M para descubrir códigos oficiales con SearchSeries",
          lenguaje: "m",
          mostrarLineas: true,
          codigo: `let
    Respuesta = Json.Document(
        Web.Contents(
            "https://si3.bcentral.cl",
            [
                RelativePath = "SieteRestWS/SieteRestWS.ashx",
                Query = [
                    user = pUsuario,
                    pass = pClave,
                    frequency = "DAILY",
                    function = "SearchSeries"
                ]
            ]
        )
    ),
    Lista = Respuesta[Infos],
    Tabla = Table.FromList(Lista, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(Tabla, "Column1", {"seriesId", "spanishTitle", "firstDate", "lastDate"}, {"Codigo", "Nombre", "Inicio", "Fin"})
in
    Expandido`,
          nota: "Cambia frequency = \"DAILY\" por \"MONTHLY\" cuando busques series mensuales como UTM o índices de precios.",
        },
      ],
      captura: {
        id: "conectar-power-bi-api-banco-central-paso-3",
        alt: "Resultado de SearchSeries en Power Query listando códigos oficiales seriesId y nombres en español de series diarias del Banco Central",
        caption: "Catálogo devuelto por SearchSeries para identificar los códigos exactos de cada serie antes de invocar fnSerieBDE.",
        ratio: "16/9",
      },
    },
    {
      id: "calendario-y-medidas-dax",
      titulo: "Paso 4: Relacionar con la tabla calendario y crear medidas DAX",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta la columna Fecha de la serie a DimCalendario[Fecha] (relación 1 a muchos) y crea medidas DAX para el último dólar observado, variación diaria y variación mensual.",
      parrafos: [
        "Una vez cargada la tabla DolarObservado en el modelo, no trabajes directamente sobre su columna Fecha en los filtros de página. Crea una tabla calendario dedicada (si aún no tienes una, revisa nuestra guía de [tabla calendario en Power BI con DAX](/guias/tabla-calendario-power-bi-dax)) y establece una relación de uno a muchos (1:*) desde DimCalendario[Fecha] hacia DolarObservado[Fecha].",
        "Con esa relación activa ya puedes escribir medidas DAX limpias. Ten en cuenta un detalle importante: como los fines de semana y feriados no tienen fila en DolarObservado, una medida simple como LASTDATE(DolarObservado[Fecha]) o PREVIOUSDAY sobre la tabla calendario podría devolver blanco en días inhábiles si no filtramos primero las fechas que sí tienen dato publicado.",
      ],
      codigos: [
        {
          titulo: "Medidas DAX: Último dólar, Variación % diaria y Variación % mensual",
          lenguaje: "dax",
          mostrarLineas: true,
          codigo: `Último dólar = 
VAR UltimaFechaConDato = LASTDATE(DolarObservado[Fecha])
RETURN
CALCULATE(
    SELECTEDVALUE(DolarObservado[Valor]),
    DolarObservado[Fecha] = UltimaFechaConDato
)

Var % diaria = 
VAR FechaActual = LASTDATE(DolarObservado[Fecha])
VAR ValorActual = CALCULATE(SELECTEDVALUE(DolarObservado[Valor]), DolarObservado[Fecha] = FechaActual)
VAR FechaAnterior = CALCULATE(MAX(DolarObservado[Fecha]), FILTER(ALL(DolarObservado), DolarObservado[Fecha] < FechaActual))
VAR ValorAnterior = CALCULATE(SELECTEDVALUE(DolarObservado[Valor]), FILTER(ALL(DolarObservado), DolarObservado[Fecha] = FechaAnterior))
RETURN
DIVIDE(ValorActual - ValorAnterior, ValorAnterior)

Var % mensual = 
VAR ValorActual = [Último dólar]
VAR ValorMesAnterior = CALCULATE([Último dólar], PREVIOUSMONTH(DimCalendario[Fecha]))
RETURN
DIVIDE(ValorActual - ValorMesAnterior, ValorMesAnterior)`,
          nota: "Aplica formato de moneda ($ #.##0,00) a Último dólar y formato Porcentaje (0,00%) a ambas medidas de variación. Por ejemplo, sobre un dólar de referencia al 20-nov-2026 de $1.008,79, estas medidas responden dinámicamente al filtro de mes o año.",
        },
      ],
      captura: {
        id: "conectar-power-bi-api-banco-central-paso-4",
        alt: "Vista de modelo en Power BI Desktop mostrando la relación uno a muchos entre DimCalendario y DolarObservado junto a tarjetas con las medidas DAX",
        caption: "Modelo relacional con DimCalendario y medidas DAX de tipo de cambio y variación.",
        ratio: "16/9",
      },
    },
    {
      id: "publicar-y-programar-refresco",
      titulo: "Paso 5: Publicar en Power BI Service y programar la actualización",
      esPasoHowTo: true,
      resumenHowTo:
        "Publica el informe en tu área de trabajo de Power BI Service, autentica el origen web como Anónimo y programa el refresco diario sin puerta de enlace.",
      parrafos: [
        "Cuando termines el reporte en Power BI Desktop, haz clic en Publicar y selecciona tu área de trabajo en Power BI Service. Entra al servicio web, busca el modelo semántico recién subido y abre Configuración > Credenciales de origen de datos. Aunque la API BDE pide usuario y clave, estos viajan dentro del parámetro Query de la URL, por lo que el método de autenticación HTTP en Power BI Service debe configurarse como Anónimo y el nivel de privacidad en Público u Organizacional.",
        "Con eso resuelto, despliega la sección Actualizar, activa la programación diaria (por ejemplo a las 09:30 hora de Chile, después de la publicación matinal del Banco Central) y guarda. Al haber usado RelativePath y Query, Power BI Service no te pedirá puerta de enlace local (gateway).",
        "Si estás evaluando si usar la API oficial BDE o el servicio comunitario mindicador.cl para un proyecto específico, la siguiente tabla resume cuándo conviene cada uno:",
      ],
      tabla: {
        caption: "API oficial BDE del Banco Central vs mindicador.cl en Power BI",
        encabezados: [
          "Aspecto",
          "API BDE Banco Central",
          "Alternativa mindicador.cl",
        ],
        filas: [
          [
            "Cobertura de series",
            "Miles de series oficiales (diarias, mensuales, trimestrales)",
            "Indicadores principales (dólar, UF, UTM, euro, IPC)",
          ],
          [
            "Autenticación",
            "Requiere pUsuario y pClave gratuitos en Query",
            "Sin autenticación",
          ],
          [
            "Historial disponible",
            "Configurable con firstdate desde años anteriores",
            "Últimos ~30 días (o por año en URL)",
          ],
          [
            "Trazabilidad corporativa",
            "Fuente primaria oficial del Banco Central de Chile",
            "Servicio comunitario que replica datos públicos",
          ],
        ],
      },
      captura: {
        id: "conectar-power-bi-api-banco-central-paso-5",
        alt: "Configuración del modelo semántico en Power BI Service mostrando credenciales Anónimo y programación diaria de actualización habilitada",
        caption: "Configuración de credenciales anónimas y actualización programada activa en Power BI Service.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Alternativa rápida con mindicador.cl en Power BI",
        texto:
          "Si solo necesitas un prototipo rápido de los últimos 30 días sin crear cuenta en el Banco Central, puedes usar Web.Contents(\"https://mindicador.cl\", [RelativePath = \"api/dolar\"]) con la misma técnica de RelativePath para mantener el refresco programado en Power BI Service.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Power BI Service bloquea la actualización programada por «origen de datos dinámico»",
      causa:
        "Concatenaste parámetros o variables directamente en el primer argumento URL de Web.Contents en lugar de usar RelativePath y Query.",
      solucion:
        "Deja \"https://si3.bcentral.cl\" fijo como primer argumento de Web.Contents y pasa la ruta y parámetros dentro de [RelativePath = ..., Query = [...]].",
    },
    {
      error: "La API devuelve un registro de error o lista vacía en Respuesta[Series][Obs]",
      causa:
        "El código de serie (timeseries) no existe o tiene un espacio oculto, o bien las credenciales pUsuario / pClave tienen un error tipográfico.",
      solucion:
        "Verifica el código exacto ejecutando la consulta SearchSeries incluida en el Paso 3 y revisa que pUsuario y pClave no tengan espacios al inicio o al final.",
    },
    {
      error: "Valores multiplicados por 100 al cargar la tabla al modelo",
      causa:
        "Power Query convirtió la columna de texto a número usando configuración regional es-CL (coma decimal) sobre un JSON que trae punto decimal.",
      solucion:
        "Mantén Number.FromText(_, \"en-US\") en la transformación de la columna ValorTxt.",
    },
    {
      error: "La medida Var % diaria devuelve blanco los lunes o después de un feriado",
      causa:
        "Se usó PREVIOUSDAY(DimCalendario[Fecha]) directamente, pero el domingo o feriado anterior no tiene publicación de dólar observado.",
      solucion:
        "Calcula FechaAnterior buscando el MAX(DolarObservado[Fecha]) estrictamente menor a FechaActual, como en la medida DAX del Paso 4.",
    },
  ],
  plantilla: {
    titulo: "Archivo .pbix base conectado a la API BDE del Banco Central",
    descripcion:
      "Modelo de Power BI Desktop con los parámetros pUsuario/pClave vacíos, la función fnSerieBDE, DimCalendario y medidas DAX de tipo de cambio. Próximamente disponible para descarga.",
  },
  faqs: [
    {
      q: "¿Necesito instalar un On-premises data gateway para actualizar la API del Banco Central?",
      a: "No. Al tratarse de un origen web público HTTPS y estar construido con URL base estática más RelativePath y Query, Power BI Service se conecta directamente desde la nube sin necesidad de gateway.",
    },
    {
      q: "¿Puedo descargar varias series en una sola tabla desde la API BDE?",
      a: "Sí. Puedes crear una tabla pequeña con los códigos que te interesan (por ejemplo dólar y otra serie diaria), agregar una columna personalizada invocando fnSerieBDE([Codigo], \"2024-01-01\") y expandir las columnas resultantes.",
    },
    {
      q: "¿Qué nivel de privacidad debo elegir al publicar?",
      a: "Si vas a combinar datos de la API BDE con archivos internos de tu empresa (por ejemplo ventas en SQL o Excel) en la misma consulta, selecciona Organizacional tanto en Desktop como en Power BI Service para evitar errores de firewall de privacidad.",
    },
    {
      q: "¿Puedo usar mindicador.cl en Power BI Service si necesito más de un mes de historia?",
      a: "El endpoint base de mindicador.cl entrega alrededor de un mes, mientras que agregando el año (/api/dolar/2026) entrega el año completo. Para series multi-anuales continuas sin depender de múltiples llamadas por año, la API BDE del Banco Central con firstdate es más limpia.",
    },
    {
      q: "¿Cómo convierto una tabla de ventas en USD a CLP dentro del modelo usando la serie del Banco Central?",
      a: "Una vez que DimCalendario filtra tanto a Ventas como a DolarObservado, puedes crear una medida DAX que multiplique SUM(Ventas[MontoUSD]) por el último dólar del día o iterar con SUMX(Ventas, Ventas[MontoUSD] * RELATED(DolarObservado[Valor])) si completaste los días inhábiles en Power Query con Table.FillDown.",
    },
  ],
  relacionadas: [
    "dolar-observado-en-excel-automatico",
    "automatizar-reportes-con-power-bi",
    "tabla-calendario-power-bi-dax",
  ],
  enlacesExternos: [
    {
      label: "Portal oficial Base de Datos Estadísticos (BDE / SIETE)",
      url: "https://si3.bcentral.cl/siete",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Información oficial de la Base de Datos Estadísticos (BDE)",
      url: "https://www.bcentral.cl/areas/estadisticas/base-de-datos-estadisticos-bde",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Documentación de Web.Contents en Power Query M",
      url: "https://learn.microsoft.com/es-es/powerquery-m/web-contents",
      fuente: "Microsoft Learn",
    },
    {
      label: "Configurar la actualización programada en Power BI",
      url: "https://learn.microsoft.com/es-es/power-bi/connect-data/refresh-scheduled-refresh",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
