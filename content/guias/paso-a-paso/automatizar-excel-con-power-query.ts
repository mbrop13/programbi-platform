import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "automatizar-excel-con-power-query",
  title: "Automatizar Excel con Power Query: guía paso a paso",
  meta: "Automatiza tareas repetitivas en Excel con Power Query: combina archivos de una carpeta, limpia datos y actualiza todo con un clic. Con código M.",
  h1: "Cómo automatizar Excel con Power Query (sin macros)",
  subtitle:
    "Reemplaza horas de copiar, pegar, limpiar texto y cruzar planillas con BUSCARV por un flujo repetible en Power Query que consolida carpetas enteras y se actualiza con un solo clic.",
  keywordPrincipal: "automatizar Excel",
  keywords: [
    "automatizar Excel",
    "Power Query Excel",
    "combinar archivos Excel Power Query",
    "consolidar archivos Excel",
    "limpiar datos automaticamente Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT40M",
  esInsignia: true,
  en30Segundos: {
    queLogras:
      "Un libro maestro en Excel capaz de leer decenas de archivos de una carpeta, limpiar columnas sucias, cruzar tablas sin BUSCARV y actualizarse completo presionando Actualizar todo.",
    herramienta: "Power Query integrado en Microsoft Excel (lenguaje M)",
    tiempo: "40 minutos",
    bullets: [
      "Ubicar Power Query según tu versión de Excel en Windows, Microsoft 365 o Mac.",
      "Consolidar automáticamente todos los Excel de una carpeta con Folder.Files y Table.Combine.",
      "Limpiar duplicados, espacios, tipos y anular dinamización (Unpivot) de columnas.",
      "Cruzar tablas con Combinar consultas (Merge) y parametrizar rutas relativas.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Ubicar Power Query",
      resumen: "Encuentra los conectores en tu versión de Excel.",
      anchorId: "que-es-power-query-versiones",
      icono: "settings",
    },
    {
      numero: 2,
      titulo: "Consolidar carpeta",
      resumen: "Une múltiples archivos mensuales con Folder.Files.",
      anchorId: "caso-1-combinar-carpeta",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Limpiar datos",
      resumen: "Divide textos, quita duplicados y aplica Unpivot.",
      anchorId: "caso-2-limpiar-datos-sucios",
      icono: "sparkles",
    },
    {
      numero: 4,
      titulo: "Datos de la web",
      resumen: "Conecta tablas públicas desde URL sin copiar a mano.",
      anchorId: "caso-3-datos-de-la-web",
      icono: "database",
    },
    {
      numero: 5,
      titulo: "Cruzar tablas",
      resumen: "Reemplaza BUSCARV con Combinar consultas (Merge).",
      anchorId: "combinar-consultas-merge",
      icono: "code",
    },
    {
      numero: 6,
      titulo: "Rutas dinámicas",
      resumen: "Parametriza la ruta desde una celda para mover carpetas.",
      anchorId: "parametros-rutas-relativas",
      icono: "file",
    },
    {
      numero: 7,
      titulo: "Actualizar y comparar",
      resumen: "Refresca en un clic y decide entre Power Query, VBA o Python.",
      anchorId: "actualizar-todo-comparativa",
      icono: "refresh",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior / Microsoft 365 (Windows recomendado para todos los conectores)",
    lista: [
      "Microsoft Excel 2016, 2019, 2021 o Microsoft 365 (en Excel 2010/2013 requería complemento aparte).",
      "Una carpeta de prueba con dos o más archivos .xlsx o .csv con estructura similar para consolidar.",
      "Conocimientos básicos de tablas de Excel (Ctrl + T) y tipos de datos (texto, número, fecha).",
    ],
    compatibilidadMacWeb:
      "En Excel para Windows (2016+ y Microsoft 365) Power Query viene completo. En Excel para Mac, la compatibilidad ha ido creciendo en Microsoft 365 pero algunos conectores (como Carpeta de SharePoint o ciertos orígenes corporativos) siguen limitados frente a Windows. En Excel para la Web solo se pueden actualizar consultas compatibles creadas previamente en escritorio.",
  },
  herramientasHowTo: [
    "Microsoft Excel con Power Query integrado",
    "Editor avanzado de Power Query (lenguaje M)",
  ],
  insumosHowTo: [
    "Carpeta con archivos mensuales en formato .xlsx o .csv",
    "Tabla de catálogo o maestro para cruces (Merge)",
  ],
  secciones: [
    {
      id: "que-es-power-query-versiones",
      titulo: "1. Qué es Power Query y dónde encontrarlo según tu versión de Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Ubica el grupo Obtener y transformar datos en la pestaña Datos de Excel y verifica los conectores disponibles en tu sistema operativo.",
      parrafos: [
        "Si alguna vez pensaste que para automatizar Excel necesitabas aprender programación en VBA desde el primer día, Power Query cambia por completo esa regla. Es un motor de extracción, transformación y carga (ETL) integrado de forma nativa dentro de Excel que graba cada limpieza que haces con el ratón como una receta reutilizable.",
        "A diferencia de grabar una macro de VBA, Power Query no imita clics ciegos sobre celdas como 'seleccionar B2 y bajar hasta B400'. En su lugar, trabaja sobre columnas completas y tablas enteras, generando código en lenguaje M que se adapta automáticamente cuando el archivo del mes siguiente trae 50 filas o 50.000 filas.",
        "Lo encuentras en la pestaña Datos dentro del bloque llamado Obtener y transformar datos (botón Obtener datos). Dependiendo de si usas Windows, Mac o la versión web, tendrás disponibles distintas capacidades:",
      ],
      tabla: {
        caption: "Disponibilidad de Power Query según versión de Microsoft Excel",
        encabezados: [
          "Plataforma / Versión",
          "Ubicación en la cinta",
          "Capacidad de creación y edición",
        ],
        filas: [
          [
            "Excel 2016 / 2019 / 2021 (Windows)",
            "Datos > Obtener y transformar datos",
            "Editor completo, lenguaje M y conectores locales/carpeta.",
          ],
          [
            "Microsoft 365 (Windows)",
            "Datos > Obtener datos",
            "Completa, con conectores modernos, tipos de datos y mejoras continuas.",
          ],
          [
            "Microsoft 365 (macOS)",
            "Datos > Obtener datos (Power Query)",
            "Soporta editor y conectores principales (Excel, CSV, Web, SQL); conectores avanzados aún limitados respecto a Windows.",
          ],
          [
            "Excel para la Web",
            "Datos > Actualizar",
            "Permite actualizar consultas compatibles, pero no ofrece el editor completo de creación.",
          ],
        ],
      },
      captura: {
        id: "automatizar-excel-con-power-query-paso-1",
        alt: "Cinta de opciones de Excel en la pestaña Datos mostrando el menú desplegable Obtener datos y Iniciar editor de Power Query",
        caption:
          "Acceso nativo a Power Query desde Datos > Obtener datos sin instalar complementos adicionales.",
        ratio: "16/9",
      },
    },
    {
      id: "caso-1-combinar-carpeta",
      titulo: "2. Caso 1: combinar todos los archivos de una carpeta automáticamente",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta una carpeta completa mediante Obtener datos > De una carpeta, filtra archivos temporales y combina las hojas o tablas en una sola consulta maestra.",
      parrafos: [
        "Consolidar doce archivos mensuales de ventas, sucursales o cartolas bancarias copiando y pegando hoja por hoja es probablemente la tarea que más horas consume en oficinas. Con Power Query apuntas a la carpeta donde guardas esos archivos y el sistema los apila todos en una sola tabla maestra.",
        "Desde Excel ve a Datos > Obtener datos > De un archivo > De una carpeta. Selecciona la carpeta que contiene tus reportes (por ejemplo C:\\Reportes\\Mensuales) y haz clic en Transformar datos (evita presionar Combinar de inmediato si quieres filtrar primero archivos temporales o elegir con precisión qué hoja leer).",
        "En la vista previa verás una fila por cada archivo de la carpeta con su nombre, extensión y columna binaria Content. Filtra Extension igual a .xlsx (o .csv), excluye archivos cuyo Name empiece por ~$ (archivos temporales que crea Excel cuando alguien tiene un libro abierto) y usa Excel.Workbook([Content], true) o el asistente Combinar archivos para extraer la hoja objetivo y apilarlas con Table.Combine.",
      ],
      codigos: [
        {
          titulo: "Consolidación limpia de carpeta en código M (Folder.Files + Excel.Workbook + Table.Combine)",
          lenguaje: "m",
          codigo: `let
    Origen = Folder.Files("C:\\Reportes\\Mensuales"),
    ArchivosValidos = Table.SelectRows(
        Origen,
        each Text.Lower([Extension]) = ".xlsx" and not Text.StartsWith([Name], "~$")
    ),
    LeerLibros = Table.AddColumn(
        ArchivosValidos,
        "Contenido",
        each Excel.Workbook([Content], true)
    ),
    ExpandirObjetos = Table.ExpandTableColumn(
        LeerLibros,
        "Contenido",
        {"Name", "Data", "Kind"},
        {"Objeto", "Datos", "Tipo"}
    ),
    SoloHojaVentas = Table.SelectRows(
        ExpandirObjetos,
        each [Tipo] = "Sheet" and [Objeto] = "Ventas"
    ),
    ConservarOrigen = Table.AddColumn(
        SoloHojaVentas,
        "DatosConArchivo",
        each Table.AddColumn([Datos], "ArchivoOrigen", (r) => [Name])
    ),
    TablaUnificada = Table.Combine(ConservarOrigen[DatosConArchivo])
in
    TablaUnificada`,
          nota: "Agregar la columna ArchivoOrigen antes de Table.Combine es una buena práctica para auditar exactamente de qué archivo vino cada fila.",
        },
      ],
      captura: {
        id: "automatizar-excel-con-power-query-paso-2",
        alt: "Editor de Power Query mostrando la consulta consolidada de carpeta con la columna ArchivoOrigen y los pasos aplicados a la derecha",
        caption:
          "Todos los archivos de la carpeta combinados en una sola tabla con trazabilidad del archivo de origen.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Mantén encabezados coherentes entre archivos",
        texto:
          "Table.Combine empareja las columnas por su nombre exacto (respetando mayúsculas y tildes). Si enero dice 'Monto' y febrero dice 'Monto Total', aparecerán dos columnas separadas con nulos cruzados. Normaliza los nombres antes de combinar si tus orígenes varían.",
      },
    },
    {
      id: "caso-2-limpiar-datos-sucios",
      titulo: "3. Caso 2: limpiar datos sucios (dividir, duplicados y anular dinamización)",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica limpieza estructural en el Editor de Power Query: recorta espacios, elimina duplicados, tipa columnas y transforma matrices de meses en filas con Anular dinamización.",
      parrafos: [
        "Los archivos exportados desde sistemas contables o ERPs rara vez llegan listos para analizar: traen espacios en blanco invisibles al final de los códigos, fechas guardadas como texto en formato estadounidense, filas repetidas y reportes cruzados con los doce meses repartidos en columnas.",
        "En Power Query puedes encadenar estas limpiezas en segundos usando los botones de la pestaña Transformar y Agregar columna. Por ejemplo, clic derecho sobre una columna de texto > Transformar > Recortar (Text.Trim) y Limpiar (Text.Clean) elimina espacios sobrantes y saltos de línea ocultos; Quitar filas > Quitar duplicados deja registros únicos.",
        "Pero la transformación más poderosa para automatizar Excel es Anular dinamización de otras columnas (Table.UnpivotOtherColumns). Cuando recibes una planilla con Sucursal en la columna A y columnas para Ene, Feb, Mar... hasta Dic, seleccionas la columna Sucursal, haces clic derecho > Anular dinamización de otras columnas, y Power Query convierte automáticamente esos doce encabezados en dos columnas limpias: Atributo (Mes) y Valor (Monto). Si el próximo año agregan trece columnas nuevas, no tienes que cambiar nada.",
      ],
      listaOrdenada: [
        "Elimina filas superiores de título basura con Inicio > Quitar filas > Quitar filas superiores y luego usa Usar la primera fila como encabezado.",
        "Selecciona las columnas de texto clave y aplica Transformar > Formato > Recortar y Limpiar.",
        "Selecciona las columnas identificadoras fijas (ej. Sucursal y Categoría), haz clic derecho y elige Anular dinamización de otras columnas.",
        "Renombra las columnas resultantes 'Atributo' y 'Valor' a 'Mes' y 'Monto' y asigna el tipo de dato correcto (Número entero o Decimal) al final.",
      ],
      codigos: [
        {
          titulo: "Limpieza completa y anulación de dinamización (Table.UnpivotOtherColumns) en M",
          lenguaje: "m",
          codigo: `let
    Origen = Excel.CurrentWorkbook(){[Name="TablaMatriz"]}[Content],
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
    AnularDinamizacion = Table.UnpivotOtherColumns(
        Encabezados,
        {"Sucursal", "Categoria"},
        "Mes",
        "Monto"
    ),
    LimpiarTexto = Table.TransformColumns(
        AnularDinamizacion,
        {
            {"Sucursal", each Text.Trim(Text.Clean(_)), type text},
            {"Categoria", each Text.Trim(Text.Clean(_)), type text}
        }
    ),
    SinDuplicados = Table.Distinct(LimpiarTexto),
    Tipos = Table.TransformColumnTypes(
        SinDuplicados,
        {{"Mes", type text}, {"Monto", Int64.Type}}
    )
in
    Tipos`,
          nota: "Al usar Table.UnpivotOtherColumns sobre las columnas fijas, cualquier nuevo mes agregado a la derecha entrará automáticamente como nuevas filas.",
        },
      ],
      captura: {
        id: "automatizar-excel-con-power-query-paso-3",
        alt: "Editor de Power Query ejecutando Anular dinamización de otras columnas para convertir columnas de meses en filas normalizadas",
        caption:
          "Table.UnpivotOtherColumns transforma matrices horizontales rígidas en tablas largas listas para tablas dinámicas.",
        ratio: "16/9",
      },
    },
    {
      id: "caso-3-datos-de-la-web",
      titulo: "4. Caso 3: traer datos actualizados directamente desde la web",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa el conector De la Web en Excel para leer tablas HTML o feeds JSON públicos sin copiar y pegar indicadores desde el navegador.",
      parrafos: [
        "Muchas planillas de finanzas, presupuestos o importaciones dependen de indicadores que cambian todos los días, como el dólar observado, la UF o listas de precios públicas. Copiar esos valores desde el navegador cada mañana introduce errores humanos y consume tiempo.",
        "Con Datos > Obtener datos > De otras fuentes > De la Web, puedes pegar la URL de una página con tablas HTML limpias o de una API abierta en formato JSON. Power Query detecta la estructura de la página, extrae la tabla que necesitas y aplica los filtros de fecha o moneda.",
        "Cada vez que presionas Actualizar todo en tu libro, Excel consulta la web en segundo plano y actualiza tu tabla de tipo de cambio. Si quieres ver un ejemplo práctico completo paso a paso aplicado a Chile, revisa nuestra guía /guias/dolar-observado-en-excel-automatico.",
      ],
      captura: {
        id: "automatizar-excel-con-power-query-paso-4",
        alt: "Asistente Navegador del conector De la Web en Excel mostrando la vista previa de una tabla extraída desde una URL",
        caption:
          "El conector Web extrae tablas HTML o respuestas JSON y las deja vinculadas para refrescar con un clic.",
        ratio: "16/9",
      },
    },
    {
      id: "combinar-consultas-merge",
      titulo: "5. Cruzar tablas con Combinar consultas (Merge) en lugar de BUSCARV",
      esPasoHowTo: true,
      resumenHowTo:
        "Une tu tabla de transacciones con el catálogo de clientes o productos dentro de Power Query usando Table.NestedJoin para evitar miles de fórmulas BUSCARV.",
      parrafos: [
        "Llenar una hoja de 40.000 filas con fórmulas BUSCARV o BUSCARX vuelve pesado el archivo de Excel, aumenta el tiempo de recálculo cada vez que editas una celda y corre el riesgo de romperse si alguien borra una fila de la fórmula.",
        "La alternativa profesional es hacer el cruce antes de que los datos lleguen a la hoja de cálculo, usando Combinar consultas (Merge) en Power Query. En la pestaña Inicio > Combinar > Combinar consultas, eliges tu tabla principal arriba, la tabla de catálogo abajo, haces clic en la columna llave común en ambas (por ejemplo, CodigoProducto) y seleccionas el tipo de unión (habitualmente Externa izquierda, equivalente a BUSCARV).",
        "Luego expandes únicamente las columnas que necesitas del catálogo (como NombreProducto y MargenObjetivo) sin traer columnas innecesarias. El resultado se carga en Excel como valores limpios, sin una sola fórmula pesada en las celdas.",
      ],
      codigos: [
        {
          titulo: "Cruce Left Outer Join entre Ventas y Productos con Table.NestedJoin",
          lenguaje: "m",
          codigo: `let
    Union = Table.NestedJoin(
        VentasLimpias, {"CodigoProducto"},
        DimProductos, {"CodigoProducto"},
        "ProductoInfo",
        JoinKind.LeftOuter
    ),
    Expandir = Table.ExpandTableColumn(
        Union,
        "ProductoInfo",
        {"NombreProducto", "Categoria"},
        {"NombreProducto", "Categoria"}
    )
in
    Expandir`,
          nota: "JoinKind.LeftOuter conserva todas las filas de VentasLimpias aunque un código nuevo aún no exista en DimProductos (devolverá null en lugar de #N/A).",
        },
      ],
      captura: {
        id: "automatizar-excel-con-power-query-paso-5",
        alt: "Ventana Combinar en Power Query seleccionando la columna CodigoProducto en dos tablas con tipo de combinación Externa izquierda",
        caption:
          "Combinar consultas reemplaza miles de fórmulas BUSCARV por un cruce limpio ejecutado en memoria.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Evita duplicar filas al hacer Merge",
        texto:
          "Si la tabla derecha (el catálogo) tiene códigos repetidos, la combinación izquierda multiplicará las filas de tu tabla principal. Aplica Table.Distinct sobre la llave del catálogo antes de combinar.",
      },
    },
    {
      id: "parametros-rutas-relativas",
      titulo: "6. Usar parámetros y rutas relativas para que el libro no se rompa al moverlo",
      esPasoHowTo: true,
      resumenHowTo:
        "Lee la ruta de la carpeta desde una celda con fórmula CELDA(\"filename\") o desde un parámetro de Power Query para compartir el libro con colegas sin editar código M.",
      parrafos: [
        "Uno de los problemas clásicos al compartir un libro automatizado con otro colega —o al moverlo de tu computador a OneDrive o a una carpeta de red— es que la ruta fija escrita en el paso Origen ('C:\\Users\\Manuel\\Documentos\\...') deja de existir en el equipo del otro usuario.",
        "La solución en Excel consiste en crear una pequeña hoja llamada Config con una Tabla llamada tblConfig (o una celda con nombre RutaDatos). Usando la fórmula de Excel =IZQUIERDA(CELDA(\"filename\"; A1); HALLAR(\"[\"; CELDA(\"filename\"; A1))-1) obtienes automáticamente la carpeta donde está guardado el libro actual.",
        "Luego, en Power Query lees esa celda con Excel.CurrentWorkbook(){[Name=\"tblConfig\"]}[Content]{0}[Valor] y la pasas como argumento a Folder.Files(RutaDinamica). De esta forma, si mueves toda la carpeta del proyecto a otro computador o disco, el flujo sigue funcionando sin abrir el Editor.",
      ],
      codigos: [
        {
          titulo: "Fórmula en Excel para obtener la carpeta actual del libro",
          lenguaje: "excel",
          codigo: "=IZQUIERDA(CELDA(\"filename\"; A1); HALLAR(\"[\"; CELDA(\"filename\"; A1))-1) & \"Datos\\\"",
          codigoEn: "=LEFT(CELL(\"filename\", A1), SEARCH(\"[\", CELL(\"filename\", A1))-1) & \"Data\\\"",
          nota: "El libro debe estar guardado al menos una vez en disco para que CELDA(\"filename\") devuelva la ruta.",
        },
        {
          titulo: "Leer la ruta dinámica desde Power Query en M",
          lenguaje: "m",
          codigo: `let
    TablaConfig = Excel.CurrentWorkbook(){[Name="tblConfig"]}[Content],
    RutaCarpeta = Text.From(TablaConfig{0}[Valor]),
    Archivos = Folder.Files(RutaCarpeta)
in
    Archivos`,
          nota: "Si el libro está sincronizado en OneDrive/SharePoint con formato URL https://..., recuerda usar SharePoint.Files en lugar de Folder.Files.",
        },
      ],
      captura: {
        id: "automatizar-excel-con-power-query-paso-6",
        alt: "Hoja Config en Excel con tabla tblConfig mostrando la ruta calculada dinámicamente y consulta de Power Query leyéndola",
        caption:
          "Parametrizar la ruta desde una celda evita errores de 'No se encuentra la ruta' al compartir el archivo.",
        ratio: "16/9",
      },
    },
    {
      id: "actualizar-todo-comparativa",
      titulo: "7. Cargar, actualizar con un clic y comparar Power Query vs VBA vs Python",
      esPasoHowTo: true,
      resumenHowTo:
        "Elige Cerrar y cargar en (Tabla o Solo crear conexión), actualiza con Datos > Actualizar todo y evalúa cuándo complementar con VBA o Python.",
      parrafos: [
        "Cuando termines tus transformaciones, haz clic en Inicio > Cerrar y cargar > Cerrar y cargar en.... Si es una consulta intermedia que solo sirve para alimentar un cruce (como el catálogo DimProductos), elige 'Crear únicamente conexión' para no llenar el libro con hojas innecesarias. Para tu tabla final consolidada, elige 'Tabla' en una hoja nueva o 'Informe de tabla dinámica' directo desde la conexión.",
        "A partir de ese momento, cada vez que lleguen archivos nuevos a la carpeta solo abres el libro maestro y presionas Datos > Actualizar todo (o Ctrl + Alt + F5). También puedes configurar en Propiedades de conexión que se actualice automáticamente al abrir el archivo.",
        "¿Significa esto que Power Query reemplaza por completo a las macros VBA o a Python? No necesariamente: cada herramienta brilla en un terreno distinto. Revisa esta comparativa para elegir la pieza correcta o combinarlas (por ejemplo, profundizando en /guias/macros-vba-excel-desde-cero o /guias/automatizar-excel-con-python):",
      ],
      tabla: {
        caption: "Comparativa práctica: Power Query vs Macros VBA vs Python en Excel",
        encabezados: [
          "Criterio",
          "Power Query (M)",
          "Macros (VBA)",
          "Python (pandas / openpyxl)",
        ],
        filas: [
          [
            "Fuerte principal",
            "Extraer, limpiar, consolidar y cruzar datos de múltiples fuentes.",
            "Automatizar clics de interfaz, botones, formatos, exportar PDF y Outlook.",
            "Procesamiento masivo de datos, estadística, ML y automatización externa sin abrir Excel.",
          ],
          [
            "Curva de aprendizaje",
            "Baja a media (90% con interfaz visual + M opcional).",
            "Media (requiere aprender objetos Workbook, Worksheet, Range).",
            "Media a alta (requiere sintaxis Python y manejo de librerías).",
          ],
          [
            "Seguridad / bloqueos",
            "No requiere habilitar macros (.xlsx estándar, sin alertas de seguridad).",
            "Exige guardar como .xlsm y suele ser bloqueado por políticas de correo.",
            "Se ejecuta en entorno local o nube; Python en Excel requiere Microsoft 365.",
          ],
          [
            "Escalabilidad de filas",
            "Muy alta (maneja cientos de miles de filas cargando al Modelo de Datos).",
            "Lenta sobre rangos grandes si no se trabaja con arrays en memoria.",
            "Muy alta (millones de filas con pandas en segundos).",
          ],
        ],
      },
      captura: {
        id: "automatizar-excel-con-power-query-paso-7",
        alt: "Cuadro de diálogo Importar datos en Excel mostrando opciones Tabla, Informe de tabla dinámica y Crear únicamente conexión",
        caption:
          "Carga únicamente la tabla final o envíala directo a tabla dinámica para mantener el archivo liviano.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Error 'Formula.Firewall: la consulta hace referencia a otras consultas o pasos'",
      causa:
        "Power Query bloquea por privacidad combinar en una misma consulta datos de dos orígenes externos distintos (o de una celda local y una carpeta/web).",
      solucion:
        "Separa la lectura de cada origen en consultas base de 'Solo conexión' y haz el cruce en una consulta intermedia aparte, o ajusta el nivel de privacidad en Opciones de consulta.",
    },
    {
      error: "Falla la carga porque cambió el nombre de una hoja en uno de los Excel de la carpeta",
      causa:
        "Se filtró explícitamente por [Item] = 'Hoja1', pero uno de los archivos nuevos trae la pestaña llamada 'Enero'.",
      solucion:
        "Si cada archivo tiene una sola hoja de datos, selecciona siempre la primera hoja por posición ({0}[Data]) o estandariza los archivos usando Tablas de Excel (Kind = 'Table').",
    },
    {
      error: "Las fechas llegan invertidas (mes por día) o con Error al convertir tipo",
      causa:
        "El archivo CSV o Excel de origen viene en formato estadounidense (MM/DD/AAAA) mientras tu computador está configurado en español de Chile (DD-MM-AAAA).",
      solucion:
        "Haz clic en el ícono de tipo de la columna > Usar configuración regional > Fecha > Inglés (Estados Unidos) para que Power Query interprete correctamente el origen.",
    },
    {
      error: "El archivo queda demasiado pesado después de consolidar muchos meses",
      causa:
        "Se cargaron en hojas visibles del libro tanto las consultas intermedias como millones de celdas innecesarias.",
      solucion:
        "Deja las consultas intermedias en 'Solo conexión' y carga el resultado final directamente al Modelo de Datos (Power Pivot) o a una Tabla Dinámica.",
    },
  ],
  plantilla: {
    titulo: "Libro maestro de Power Query con ruta relativa y consolidación de carpeta",
    descripcion:
      "Plantilla .xlsx sin macros con hoja Config de ruta dinámica, consulta M lista para consolidar archivos .xlsx/.csv, limpieza automática y tabla dinámica conectada.",
  },
  faqs: [
    {
      q: "¿Power Query funciona sin saber programar en lenguaje M?",
      a: "Sí. Alrededor del 90% de las transformaciones (conectar carpetas, quitar filas, dividir columnas, anular dinamización, combinar consultas) se hacen desde los menús visuales. Solo entras al Editor avanzado cuando quieres parametrizar rutas o optimizar pasos.",
    },
    {
      q: "¿Necesito guardar el archivo como .xlsm (habilitado para macros) para usar Power Query?",
      a: "No. Power Query se guarda dentro de archivos .xlsx normales, por lo que no dispara advertencias de seguridad de macros ni es bloqueado por filtros de correo corporativos.",
    },
    {
      q: "¿Se pierden mis columnas con fórmulas agregadas en Excel cuando actualizo la consulta?",
      a: "Si agregas columnas de fórmulas de Excel al costado derecho de una tabla verde generada por Power Query, Excel las conserva al actualizar siempre que mantengas activada la opción 'Conservar el orden/diseño de columnas' en Propiedades de la tabla. Aun así, es más limpio crear esos cálculos dentro de Power Query como Columna personalizada.",
    },
    {
      q: "¿Puedo conectar Power Query a archivos que están en SharePoint o OneDrive?",
      a: "Sí. En Excel para Windows puedes usar Obtener datos > De la Web (para un archivo específico copiando su ruta directa) o De SharePoint Folder para consolidar todos los archivos de una biblioteca en la nube.",
    },
    {
      q: "¿Cuándo conviene pasar de Power Query en Excel a Python o Power BI?",
      a: "Pasa a Power BI cuando el objetivo es compartir dashboards interactivos en la web con actualización automática en la nube. Pasa a Python cuando necesitas procesar millones de filas, generar múltiples archivos Excel formateados por cliente o automatizar tareas fuera de Office.",
    },
  ],
  relacionadas: [
    "automatizar-reportes-con-power-bi",
    "macros-vba-excel-desde-cero",
    "automatizar-excel-con-python",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de Power Query — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-query/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia del lenguaje de fórmulas M de Power Query — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/powerquery-m/",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Dólar observado automático en Excel",
      href: "/guias/dolar-observado-en-excel-automatico",
      descripcion:
        "Caso práctico del conector Web de Power Query trayendo el tipo de cambio actualizado.",
    },
    {
      label: "Automatizar Excel con Python (pandas y openpyxl)",
      href: "/guias/automatizar-excel-con-python",
      descripcion:
        "Alternativa cuando necesitas procesar volúmenes masivos o generar reportes automáticos desde scripts.",
    },
    {
      label: "Macros y VBA en Excel desde cero",
      href: "/guias/macros-vba-excel-desde-cero",
      descripcion:
        "Complementa Power Query con macros para exportar PDF, enviar correos o crear botones.",
    },
  ],
};

export default guia;
