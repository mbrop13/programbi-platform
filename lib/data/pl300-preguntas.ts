export type Pl300DominioId =
  | "preparar"
  | "modelar"
  | "visualizar"
  | "implementar";

export type Pl300Dificultad = "Base" | "Intermedia" | "Examen";

export interface Pl300Dominio {
  id: Pl300DominioId;
  nombre: string;
  peso: string;
  pesoMin: number;
  pesoMax: number;
  resumen: string;
}

export interface Pl300Pregunta {
  id: string;
  dominio: Pl300DominioId;
  dificultad: Pl300Dificultad;
  escenario: string;
  pregunta: string;
  codigo?: string;
  opciones: [string, string, string, string];
  correcta: 0 | 1 | 2 | 3;
  explicacion: string;
  temaClave: string;
}

export interface Pl300Faq {
  q: string;
  a: string;
}

export const PL300_DOMINIOS: readonly Pl300Dominio[] = [
  {
    id: "preparar",
    nombre: "Preparar los datos",
    peso: "25–30%",
    pesoMin: 25,
    pesoMax: 30,
    resumen:
      "Conexión a orígenes, Power Query, Query Folding, perfilado, limpieza, combinación y modos de almacenamiento.",
  },
  {
    id: "modelar",
    nombre: "Modelar los datos",
    peso: "25–30%",
    pesoMin: 25,
    pesoMax: 30,
    resumen:
      "Esquema en estrella, cardinalidad, filtros bidireccionales, DAX, inteligencia de tiempo y optimización de rendimiento.",
  },
  {
    id: "visualizar",
    nombre: "Visualizar y analizar los datos",
    peso: "25–30%",
    pesoMin: 25,
    pesoMax: 30,
    resumen:
      "Diseño de reportes, marcadores, drill-through, segmentaciones sincronizadas, visuales de IA, tooltips y accesibilidad.",
  },
  {
    id: "implementar",
    nombre: "Implementar y mantener activos",
    peso: "15–20%",
    pesoMin: 15,
    pesoMax: 20,
    resumen:
      "Áreas de trabajo, roles, RLS estático y dinámico, gateways, actualización incremental, licencias y canalizaciones.",
  },
] as const;

export const PL300_DOMINIO_MAP: Record<Pl300DominioId, Pl300Dominio> = {
  preparar: PL300_DOMINIOS[0],
  modelar: PL300_DOMINIOS[1],
  visualizar: PL300_DOMINIOS[2],
  implementar: PL300_DOMINIOS[3],
};

export const PL300_PREGUNTAS: readonly Pl300Pregunta[] = [
  // =========================================================================
  // DOMINIO 1: PREPARAR LOS DATOS (10 preguntas)
  // =========================================================================
  {
    id: "prep-01",
    dominio: "preparar",
    dificultad: "Examen",
    escenario:
      "Conectas Power BI Desktop a una tabla de 45 millones de filas en SQL Server mediante Power Query. Al final de tus transformaciones agregas una columna personalizada con Text.Combine y notas que la actualización tarda más de 40 minutos.",
    pregunta:
      "¿Qué acción te permite comprobar en qué paso exacto se rompió el Query Folding y mantener el procesamiento en SQL Server?",
    opciones: [
      "Hacer clic derecho sobre cada paso aplicado y verificar si la opción 'View Native Query' (Ver consulta nativa) está habilitada.",
      "Activar la opción 'Allow data preview to download in the background' en las opciones globales.",
      "Convertir la consulta de Import a DirectQuery desde la barra de estado inferior.",
      "Agregar un paso Table.Buffer al inicio de la consulta antes de aplicar los filtros.",
    ],
    correcta: 0,
    explicacion:
      "Cuando 'View Native Query' aparece habilitada en un paso, Power Query sigue traduciendo la transformación a SQL nativo (Query Folding). Si aparece deshabilitada, ese paso rompió el folding. El distractor Table.Buffer fuerza la carga en memoria del motor Mashup y rompe deliberadamente el Query Folding.",
    temaClave: "Query Folding y View Native Query",
  },
  {
    id: "prep-02",
    dominio: "preparar",
    dificultad: "Base",
    escenario:
      "Tienes dos consultas en Power Query con exactamente las mismas 12 columnas: Ventas_2025 y Ventas_2026. Necesitas consolidarlas en una sola tabla de hechos histórica.",
    pregunta: "¿Qué operación debes aplicar en Power Query?",
    opciones: [
      "Merge Queries (Combinar consultas) usando Left Outer Join.",
      "Append Queries (Anexar consultas) para apilar las filas de ambas tablas.",
      "Merge Queries usando Full Outer Join por la columna Fecha.",
      "Transpose (Transponer) y luego Promote Headers.",
    ],
    correcta: 1,
    explicacion:
      "Append Queries apila verticalmente filas de tablas con estructura equivalente (análogo a UNION ALL en SQL). Merge Queries une tablas horizontalmente por columnas clave (como un JOIN) y duplicaría o ensancharía columnas innecesariamente.",
    temaClave: "Append vs Merge en Power Query",
  },
  {
    id: "prep-03",
    dominio: "preparar",
    dificultad: "Intermedia",
    escenario:
      "Necesitas identificar qué clientes de tu tabla Maestra_Clientes nunca han realizado una compra registrada en la tabla Fact_Ventas usando Power Query.",
    pregunta: "¿Qué tipo de Join debes seleccionar en Merge Queries?",
    opciones: [
      "Inner Join (Coincidencia interna).",
      "Left Anti Join (Anti-combinación izquierda), manteniendo Maestra_Clientes como tabla superior.",
      "Right Outer Join (Externa derecha), manteniendo Maestra_Clientes como tabla superior.",
      "Full Outer Join (Externa completa) sin expandir columnas.",
    ],
    correcta: 1,
    explicacion:
      "Left Anti Join devuelve exclusivamente las filas de la tabla izquierda (Maestra_Clientes) que no tienen coincidencia en la tabla derecha (Fact_Ventas). Inner Join devolvería justo lo contrario: solo los clientes que sí compraron.",
    temaClave: "Tipos de Join en Merge Queries",
  },
  {
    id: "prep-04",
    dominio: "preparar",
    dificultad: "Intermedia",
    escenario:
      "En el Editor de Power Query habilitas Column Quality, Column Distribution y Column Profile sobre una tabla de 250.000 filas. La herramienta muestra 0% de errores en la columna Monto.",
    pregunta:
      "¿Por qué podría seguir fallando la actualización completa del modelo por errores de tipo en Monto?",
    opciones: [
      "Porque Column Quality solo analiza texto y no detecta errores numéricos.",
      "Porque por defecto el perfilado de datos en Power Query evalúa únicamente las primeras 1.000 filas.",
      "Porque Column Profile no se actualiza hasta publicar el reporte en Power BI Service.",
      "Porque los errores solo se evalúan cuando la columna está marcada como clave primaria.",
    ],
    correcta: 1,
    explicacion:
      "Por defecto, el pie del editor muestra 'Column profiling based on top 1000 rows'. Si los errores de formato están después de la fila 1.000, no aparecerán hasta cambiar esa opción a 'Column profiling based on entire data set'.",
    temaClave: "Data Profiling y límite de 1.000 filas",
  },
  {
    id: "prep-05",
    dominio: "preparar",
    dificultad: "Intermedia",
    escenario:
      "Recibes mensualmente un archivo Excel donde las columnas representan meses (Ene-2026, Feb-2026, Mar-2026...) y cada mes se agrega una nueva columna a la derecha. La primera columna es CentroCosto y la segunda Cuenta.",
    pregunta:
      "¿Qué transformación garantiza que el modelo siga funcionando sin editar la consulta cuando aparezca Abr-2026?",
    opciones: [
      "Seleccionar Ene-2026, Feb-2026 y Mar-2026 y elegir 'Unpivot Columns'.",
      "Seleccionar CentroCosto y Cuenta y elegir 'Unpivot Other Columns' (Anular dinamización de otras columnas).",
      "Aplicar 'Pivot Column' sobre la columna Cuenta usando valores sin agregar.",
      "Eliminar las columnas de meses y reconstruirlas con Merge Queries.",
    ],
    correcta: 1,
    explicacion:
      "'Unpivot Other Columns' genera en M la función Table.UnpivotOtherColumns, que referencia únicamente las columnas fijas (CentroCosto y Cuenta) y dinamiza automáticamente cualquier columna nueva que aparezca en el futuro. Seleccionar los meses uno a uno hardcodearía sus nombres.",
    temaClave: "Unpivot Other Columns para esquemas variables",
  },
  {
    id: "prep-06",
    dominio: "preparar",
    dificultad: "Examen",
    escenario:
      "Tienes tres consultas de preparación (Staging_A, Staging_B, Staging_C) que solo existen para combinarse en una tabla final Fact_Consolidada. No quieres que ocupen memoria RAM en el modelo ni aparezcan en la vista de Reporte.",
    pregunta: "¿Qué debes configurar en Staging_A, Staging_B y Staging_C?",
    opciones: [
      "Desmarcar 'Include in report refresh' en cada consulta intermedia.",
      "Desmarcar 'Enable load' (Habilitar carga) en cada consulta intermedia.",
      "Ocultar las tres tablas en la vista de Modelo.",
      "Cambiar su modo de almacenamiento a DirectQuery.",
    ],
    correcta: 1,
    explicacion:
      "Desmarcar 'Enable load' evita que la tabla se cargue al modelo VertiPaq (ahorrando memoria y evitando tablas sueltas), mientras sigue evaluándose al refrescar Fact_Consolidada. Si desmarcaras 'Include in report refresh', las tablas quedarían congeladas con datos antiguos.",
    temaClave: "Enable load vs Include in report refresh",
  },
  {
    id: "prep-07",
    dominio: "preparar",
    dificultad: "Examen",
    escenario:
      "Tu equipo desarrolla reportes en un servidor SQL de pruebas (SQL-DEV) y antes de publicar debe apuntar al servidor de producción (SQL-PROD) sin reescribir las consultas.",
    pregunta: "¿Cuál es la práctica recomendada en Power BI Desktop?",
    opciones: [
      "Crear parámetros de Power Query (pServidor, pBaseDatos), vincularlos al paso Source y modificarlos desde el Servicio o Deployment Pipelines.",
      "Duplicar el archivo .pbix y mantener una versión para DEV y otra para PROD.",
      "Usar tablas calculadas en DAX que lean dinámicamente el nombre del servidor.",
      "Cambiar el Nivel de Privacidad a 'Public' en ambos servidores.",
    ],
    correcta: 0,
    explicacion:
      "Los parámetros de Power Query permiten desacoplar el origen de datos de las transformaciones y cambiar servidor/base de datos desde Power BI Service o reglas de Deployment Pipelines. Duplicar el .pbix genera divergencia de código.",
    temaClave: "Parámetros de Power Query para entornos",
  },
  {
    id: "prep-08",
    dominio: "preparar",
    dificultad: "Base",
    escenario:
      "Un cliente exige que un tablero muestre transacciones de bodega con latencia máxima de segundos conforme ocurren en SQL Server, y el volumen supera los 800 millones de filas.",
    pregunta: "¿Qué modo de conectividad debes elegir para la tabla de hechos?",
    opciones: [
      "Import con actualización programada cada hora.",
      "DirectQuery, manteniendo las dimensiones pequeñas en modo Dual si es necesario.",
      "Live Connection hacia un archivo CSV local.",
      "Import con Auto Date/Time habilitado.",
    ],
    correcta: 1,
    explicacion:
      "DirectQuery consulta el origen en tiempo real sin importar los datos a memoria, resolviendo tanto la latencia de segundos como el límite de volumen. Import requiere cargar los datos al modelo y tiene límite de actualizaciones programadas.",
    temaClave: "Import vs DirectQuery vs Dual",
  },
  {
    id: "prep-09",
    dominio: "preparar",
    dificultad: "Examen",
    escenario:
      "Combinas una tabla local de Excel (presupuesto confidencial) con una API pública de tipos de cambio en Power Query. Al actualizar aparece el error 'Formula.Firewall: Query references other queries or steps, so it may not directly access a data source'.",
    pregunta:
      "¿Qué está causando este error y cómo se resuelve de forma segura sin deshabilitar controles globales?",
    opciones: [
      "Los niveles de privacidad incompatibles impiden enviar datos privados hacia una fuente externa; debes definir los Privacy Levels correctos (por ejemplo, Private/Organizational y Public) o separar la consulta en pasos intermedios.",
      "El firewall de Windows está bloqueando el puerto 443 de la API.",
      "Power Query no permite combinar archivos Excel con fuentes web en la misma sesión.",
      "Debes convertir ambas tablas a DirectQuery para evitar el motor Mashup.",
    ],
    correcta: 0,
    explicacion:
      "El Formula Firewall protege contra fugas de datos entre orígenes con distinto nivel de privacidad (por ejemplo, enviar claves de un Excel privado como parámetro a una API pública). Configurar correctamente los Privacy Levels y aislar la carga resuelve el bloqueo.",
    temaClave: "Formula Firewall y Privacy Levels",
  },
  {
    id: "prep-10",
    dominio: "preparar",
    dificultad: "Intermedia",
    escenario:
      "En Power Query agregas un paso de reemplazo de errores sobre una columna numérica que contiene valores de texto corruptos ('N/A') provenientes de un sistema legacy.",
    pregunta:
      "¿En qué orden deben ocurrir el cambio de tipo a Decimal y el reemplazo de errores para que el resultado sea limpio?",
    opciones: [
      "Primero Replace Values ('N/A' -> null) o primero Change Type a Decimal y luego Replace Errors (Error -> null); ambos funcionan, pero reemplazar 'N/A' antes evita generar errores.",
      "Primero Remove Duplicates y después Remove Errors sobre toda la tabla.",
      "Solo se puede corregir en DAX usando IFERROR después de cargar la tabla.",
      "Usar Fill Down antes de cambiar el tipo de datos.",
    ],
    correcta: 0,
    explicacion:
      "Si reemplazas 'N/A' por null antes de convertir a Decimal, nunca se produce un DataFormat.Error. Si ya convertiste a Decimal, 'N/A' se transforma en Error y entonces 'Replace Errors' (por null o 0) limpia la celda sin eliminar la fila completa como haría 'Remove Errors'.",
    temaClave: "Manejo de errores en Power Query",
  },

  // =========================================================================
  // DOMINIO 2: MODELAR LOS DATOS (10 preguntas)
  // =========================================================================
  {
    id: "mod-01",
    dominio: "modelar",
    dificultad: "Base",
    escenario:
      "Recibes una tabla plana única con 65 columnas que mezcla datos de ventas, descripción completa del producto, dirección del cliente y jerarquía del vendedor.",
    pregunta:
      "¿Por qué la guía oficial de Power BI recomienda transformar esta tabla en un Esquema en Estrella (Star Schema)?",
    opciones: [
      "Porque Power BI solo permite crear medidas DAX cuando hay al menos cuatro tablas.",
      "Porque reduce la redundancia de atributos repetidos, mejora la compresión VertiPaq, evita ambigüedad de filtros y simplifica las medidas DAX.",
      "Porque el esquema en estrella permite omitir la tabla de fechas.",
      "Porque las tablas planas no soportan formato condicional en matrices.",
    ],
    correcta: 1,
    explicacion:
      "Un Star Schema separa métricas numéricas (tabla de hechos estrecha y larga) de atributos descriptivos (dimensiones con baja cardinalidad y clave única). Esto maximiza la compresión columnar de VertiPaq y hace predecible la propagación de filtros.",
    temaClave: "Star Schema y arquitectura VertiPaq",
  },
  {
    id: "mod-02",
    dominio: "modelar",
    dificultad: "Examen",
    escenario:
      "Tu tabla Fact_Pedidos tiene dos columnas de fecha: FechaPedido y FechaEnvio. Ambas deben relacionarse con la única tabla Dim_Calendario. La relación activa está en FechaPedido.",
    pregunta:
      "¿Cómo escribes una medida para calcular las ventas según la fecha de envío sin duplicar la tabla Dim_Calendario?",
    codigo: `Ventas por Envío = ???`,
    opciones: [
      "CALCULATE(SUM(Fact_Pedidos[Monto]), RELATED(Dim_Calendario[Fecha]))",
      "CALCULATE(SUM(Fact_Pedidos[Monto]), USERELATIONSHIP(Dim_Calendario[Fecha], Fact_Pedidos[FechaEnvio]))",
      "CALCULATE(SUM(Fact_Pedidos[Monto]), CROSSFILTER(Dim_Calendario[Fecha], Fact_Pedidos[FechaEnvio], Both))",
      "SUMX(Fact_Pedidos, Fact_Pedidos[Monto] * RELATED(Fact_Pedidos[FechaEnvio]))",
    ],
    correcta: 1,
    explicacion:
      "USERELATIONSHIP activa temporalmente una relación inactiva dentro del contexto de evaluación de CALCULATE. Es el patrón estándar para dimensiones role-playing (como múltiples fechas). CROSSFILTER cambia la dirección del filtro, no activa relaciones inactivas.",
    temaClave: "Role-Playing Dimensions y USERELATIONSHIP",
  },
  {
    id: "mod-03",
    dominio: "modelar",
    dificultad: "Examen",
    escenario:
      "Tienes una matriz con Categoría de Producto en filas y necesitas mostrar el porcentaje que representa cada categoría respecto al total de todas las categorías, ignorando filtros de categoría pero respetando filtros de Año y País.",
    pregunta: "¿Cuál es la expresión DAX más limpia y precisa?",
    codigo: `Pct Categoría = DIVIDE([Ventas], ???)`,
    opciones: [
      "CALCULATE([Ventas], ALL(Dim_Producto[Categoría]))",
      "CALCULATE([Ventas], ALL())",
      "CALCULATE([Ventas], ALLEXCEPT(Dim_Producto, Dim_Producto[Categoría]))",
      "SUM(Fact_Ventas[Monto])",
    ],
    correcta: 0,
    explicacion:
      "ALL(Dim_Producto[Categoría]) (o REMOVEFILTERS(Dim_Producto[Categoría])) elimina únicamente el filtro sobre la columna Categoría, conservando los filtros externos de Año y País. ALL() sin argumentos borraría todo el contexto de filtro (incluido Año y País), y ALLEXCEPT haría justo lo opuesto.",
    temaClave: "CALCULATE, ALL / REMOVEFILTERS vs ALLEXCEPT",
  },
  {
    id: "mod-04",
    dominio: "modelar",
    dificultad: "Intermedia",
    escenario:
      "Creas una medida de inteligencia de tiempo usando SAMEPERIODLASTYEAR(Dim_Calendario[Fecha]), pero al arrastrarla a una tabla devuelve en blanco o un error de fechas no contiguas.",
    pregunta:
      "¿Qué requisito fundamental de Dim_Calendario suele faltar cuando fallan las funciones de Time Intelligence?",
    opciones: [
      "La tabla debe tener una columna de mes en formato texto y estar ordenada descendentemente.",
      "La columna de fecha debe contener todos los días continuos sin huecos (años completos) y estar marcada con 'Mark as date table'.",
      "La relación entre Dim_Calendario y Fact_Ventas debe ser bidireccional.",
      "Debe existir una columna calculada con YEAR() en Fact_Ventas.",
    ],
    correcta: 1,
    explicacion:
      "Las funciones clásicas de Time Intelligence en DAX exigen una tabla calendario con fechas continuas (sin días faltantes dentro de los años cubiertos) y una columna de fecha única marcada como tabla de fechas ('Mark as date table') para que el motor elimine filtros implícitos correctamente.",
    temaClave: "Requisitos de Time Intelligence y Mark as Date Table",
  },
  {
    id: "mod-05",
    dominio: "modelar",
    dificultad: "Examen",
    escenario:
      "En un modelo con Fact_Ventas y Fact_Presupuesto conectadas a Dim_Tienda y Dim_Fecha, un analista activa el filtro bidireccional (Both) en todas las relaciones para poder contar tiendas desde Fact_Ventas.",
    pregunta:
      "¿Por qué se desaconseja activar el filtrado bidireccional permanente en el modelo y cuál es la alternativa recomendada?",
    opciones: [
      "Porque el filtrado bidireccional impide publicar el reporte en Power BI Service.",
      "Porque introduce ambigüedad en rutas de filtro con múltiples tablas de hechos y degrada el rendimiento; conviene dejar relaciones 1:N unidireccionales y usar CROSSFILTER(..., Both) solo dentro de medidas específicas.",
      "Porque las relaciones bidireccionales solo funcionan en modo DirectQuery.",
      "Porque duplica el tamaño en disco del archivo .pbix.",
    ],
    correcta: 1,
    explicacion:
      "Las relaciones bidireccionales permanentes pueden crear caminos ambiguos (Power BI bloquea relaciones si detecta ciclos) y propagar filtros costosos entre tablas grandes. Usar CROSSFILTER dentro de CALCULATE limita el comportamiento bidireccional solo a la medida que lo necesita.",
    temaClave: "Filtros bidireccionales vs CROSSFILTER",
  },
  {
    id: "mod-06",
    dominio: "modelar",
    dificultad: "Intermedia",
    escenario:
      "En Fact_Ventas tienes las columnas Cantidad y PrecioUnitario, pero no existe una columna de VentaTotal.",
    pregunta:
      "¿Cuál es la diferencia clave entre crear una columna calculada (Cantidad * PrecioUnitario) y luego usar SUM, frente a usar una medida con SUMX?",
    opciones: [
      "SUMX evalúa fila a fila en tiempo de consulta sin consumir memoria RAM adicional para almacenar una columna precalculada.",
      "SUM es siempre más lento que SUMX porque escanea dos columnas a la vez.",
      "SUMX no respeta los filtros aplicados por segmentaciones en el reporte.",
      "La columna calculada se recalcula cada vez que el usuario cambia un slicer.",
    ],
    correcta: 0,
    explicacion:
      "SUMX(Fact_Ventas, Fact_Ventas[Cantidad] * Fact_Ventas[PrecioUnitario]) itera en tiempo de consulta sin aumentar el tamaño del modelo en memoria (en columnas de alta cardinalidad una columna calculada comprime mal). Las columnas calculadas solo se recalculan al actualizar los datos, nunca al mover un slicer.",
    temaClave: "SUMX vs SUM y costo de memoria",
  },
  {
    id: "mod-07",
    dominio: "modelar",
    dificultad: "Examen",
    escenario:
      "Un reporte tarda 12 segundos en renderizar una página con 10 tarjetas y 2 matrices. Quieres saber si el cuello de botella está en las consultas DAX o en la renderización visual.",
    pregunta: "¿Qué herramienta integrada en Power BI Desktop debes usar primero?",
    opciones: [
      "Performance Analyzer (Analizador de rendimiento) para desglosar el tiempo entre DAX Query, Visual Display y Other.",
      "Query Diagnostics en el Editor de Power Query.",
      "Manage Aggregations en la vista de Modelo.",
      "Sync Slicers en el panel de Vista.",
    ],
    correcta: 0,
    explicacion:
      "Performance Analyzer mide exactamente cuántos milisegundos tarda cada visual en 'DAX query' vs 'Visual display' vs 'Other' (espera en cola), y permite copiar la consulta DAX para analizarla luego en DAX Studio.",
    temaClave: "Performance Analyzer y DAX Studio",
  },
  {
    id: "mod-08",
    dominio: "modelar",
    dificultad: "Intermedia",
    escenario:
      "El archivo .pbix pesa 480 MB principalmente porque Fact_Logs tiene 30 millones de filas con una columna Timestamp de tipo Date/Time con precisión de milisegundos, además de tener habilitado Auto Date/Time.",
    pregunta:
      "¿Qué par de optimizaciones reduce drásticamente el tamaño del modelo en VertiPaq?",
    opciones: [
      "Desactivar 'Auto date/time' y dividir Timestamp en dos columnas separadas: Fecha y Hora (o redondear la hora al minuto).",
      "Convertir todas las columnas de texto a medidas DAX.",
      "Activar la compresión ZIP desde Opciones -> Carga de datos.",
      "Cambiar las relaciones 1:N a relaciones N:N.",
    ],
    correcta: 0,
    explicacion:
      "Auto date/time crea una tabla calendario oculta por cada columna fecha del modelo. Además, una columna Date/Time con milisegundos tiene cardinalidad altísima (casi tantos valores únicos como filas), destruyendo la compresión por diccionario de VertiPaq. Separar Fecha y Hora reduce drásticamente los valores únicos.",
    temaClave: "Reducción de cardinalidad y Auto Date/Time",
  },
  {
    id: "mod-09",
    dominio: "modelar",
    dificultad: "Examen",
    escenario:
      "Escribes la medida Ventas Rojas = CALCULATE([Ventas], Dim_Producto[Color] = \"Rojo\"). Al ponerla en una tabla por Color, notas que todas las filas (Azul, Verde, Rojo) muestran el valor de Rojo.",
    pregunta:
      "¿Qué función debes agregar para que solo la fila Rojo muestre su valor y las demás filas queden en blanco?",
    opciones: [
      "KEEPFILTERS(Dim_Producto[Color] = \"Rojo\") dentro de CALCULATE.",
      "REMOVEFILTERS(Dim_Producto[Color]) dentro de CALCULATE.",
      "ALLSELECTED(Dim_Producto[Color]) fuera de CALCULATE.",
      "VALUES(Dim_Producto[Color]) como primer argumento.",
    ],
    correcta: 0,
    explicacion:
      "Por defecto, un predicado simple en CALCULATE sobrescribe el filtro existente sobre esa columna. KEEPFILTERS realiza una intersección entre el filtro externo (ej. Color = Azul) y el filtro interno (Color = Rojo), devolviendo vacío cuando no coinciden.",
    temaClave: "KEEPFILTERS vs sobrescritura de CALCULATE",
  },
  {
    id: "mod-10",
    dominio: "modelar",
    dificultad: "Base",
    escenario:
      "En una matriz con jerarquía País -> Ciudad, quieres que una medida muestre el porcentaje respecto al total del País cuando el usuario está en nivel Ciudad, pero muestre 100% (o nada) cuando está en nivel País.",
    pregunta: "¿Qué función DAX detecta si una columna forma parte del nivel actual de la jerarquía?",
    opciones: [
      "ISINSCOPE(Dim_Geografia[Ciudad])",
      "HASONEVALUE(Dim_Geografia[País])",
      "ISBLANK(Dim_Geografia[Ciudad])",
      "SELECTEDVALUE(Dim_Geografia[Ciudad])",
    ],
    correcta: 0,
    explicacion:
      "ISINSCOPE devuelve TRUE específicamente cuando la columna indicada está agrupando filas en el nivel actual del visual jerárquico. HASONEVALUE puede devolver TRUE accidentalmente en un nivel superior si un país tiene una sola ciudad.",
    temaClave: "ISINSCOPE en matrices jerárquicas",
  },

  // =========================================================================
  // DOMINIO 3: VISUALIZAR Y ANALIZAR LOS DATOS (10 preguntas)
  // =========================================================================
  {
    id: "vis-01",
    dominio: "visualizar",
    dificultad: "Examen",
    escenario:
      "Creas un botón de 'Restablecer filtros' usando un Marcador (Bookmark), pero también tienes botones en la misma página que alternan entre mostrar un Gráfico o una Tabla (ocultando el otro visual). Al hacer clic en 'Restablecer filtros', el usuario vuelve inesperadamente al Gráfico aunque estaba viendo la Tabla.",
    pregunta: "¿Cómo configuras el marcador de 'Restablecer filtros' para que solo limpie los slicers sin cambiar la visibilidad de los visuales?",
    opciones: [
      "Mantener marcada la opción 'Data' y desmarcar 'Display' y 'Current page' en el marcador.",
      "Desmarcar 'Data' y mantener marcada 'Display'.",
      "Marcar 'All visuals' y desmarcar 'Data'.",
      "Convertir el botón en una acción de tipo Page navigation.",
    ],
    correcta: 0,
    explicacion:
      "En un Bookmark, 'Data' guarda el estado de filtros, segmentaciones y ordenación; 'Display' guarda qué visuales están visibles u ocultos (spotlight/selection pane). Al desmarcar 'Display', el botón limpia los filtros sin alterar qué visual está visible.",
    temaClave: "Bookmarks: Data vs Display",
  },
  {
    id: "vis-02",
    dominio: "visualizar",
    dificultad: "Base",
    escenario:
      "Tienes una página resumen con ventas por Sucursal y quieres que al hacer clic derecho sobre una sucursal específica el usuario pueda saltar a una página 'Detalle Sucursal' filtrada automáticamente por esa sucursal.",
    pregunta: "¿Qué funcionalidad debes configurar en la página 'Detalle Sucursal'?",
    opciones: [
      "Agregar el campo Sucursal en el pozo 'Drill through' (Obtener detalles) del panel de visualizaciones de la página destino.",
      "Configurar un Tooltip de página de informe con el campo Sucursal.",
      "Activar 'Cross-report' en las opciones de segmentación.",
      "Crear una jerarquía con Sucursal y Cliente.",
    ],
    correcta: 0,
    explicacion:
      "Colocar el campo en el área 'Drill through' de la página destino habilita el menú contextual 'Drill through' en cualquier visual que use ese campo y crea automáticamente un botón de regreso.",
    temaClave: "Drill-through entre páginas",
  },
  {
    id: "vis-03",
    dominio: "visualizar",
    dificultad: "Intermedia",
    escenario:
      "Tienes un slicer de Año en la Página 1. Quieres que su selección también filtre los gráficos de la Página 2 y la Página 3, pero NO quieres que el slicer sea visible en la Página 2 ni en la Página 3.",
    pregunta: "¿Qué debes configurar en el panel Sync Slicers (Sincronizar segmentaciones)?",
    opciones: [
      "Marcar la columna 'Sync' (Sincronizar) para las páginas 1, 2 y 3, y marcar la columna 'Visible' solo para la Página 1.",
      "Copiar y pegar el slicer en las 3 páginas y ocultarlo con el panel de Filtros.",
      "Usar un filtro a nivel de página en cada pestaña.",
      "Marcar tanto 'Sync' como 'Visible' en las tres páginas.",
    ],
    correcta: 0,
    explicacion:
      "El panel Sync Slicers separa dos casillas independientes por página: el icono de sincronización (propaga el filtro) y el icono de visibilidad (muestra u oculta el control visual).",
    temaClave: "Sync Slicers: sincronización vs visibilidad",
  },
  {
    id: "vis-04",
    dominio: "visualizar",
    dificultad: "Intermedia",
    escenario:
      "Agregas el visual Q&A (Preguntas y respuestas) para que gerentes escriban consultas en lenguaje natural. Muchos escriben 'facturación por tienda', pero en tu modelo la medida se llama 'Ventas Netas' y la tabla 'Dim_Sucursal'.",
    pregunta: "¿Cómo mejoras la comprensión de Q&A sin renombrar tus medidas?",
    opciones: [
      "Agregando sinónimos (por ejemplo 'facturación' y 'tienda') desde la vista de Modelo o en Q&A Setup -> Field synonyms.",
      "Creando medidas duplicadas con cada sinónimo posible.",
      "Cambiando el idioma del sistema operativo a inglés.",
      "Activando el formato condicional en el visual Q&A.",
    ],
    correcta: 0,
    explicacion:
      "Q&A permite definir sinónimos por tabla y campo tanto en la vista de Modelo (panel Propiedades -> Synonyms) como en Q&A Setup, sin ensuciar el modelo con medidas duplicadas.",
    temaClave: "Q&A y configuración de sinónimos",
  },
  {
    id: "vis-05",
    dominio: "visualizar",
    dificultad: "Examen",
    escenario:
      "Usas un Árbol de descomposición (Decomposition Tree) para analizar el Margen por País, Canal y Categoría. Quieres que Power BI encuentre automáticamente qué dimensión explica el valor más alto en cada clic del usuario.",
    pregunta: "¿Qué debes hacer al expandir un nodo en el Decomposition Tree?",
    opciones: [
      "Elegir la división de IA 'High value' (Valor alto), marcada con el icono de bombilla.",
      "Ordenar manualmente los campos en el pozo 'Explain by' de mayor a menor.",
      "Cambiar el visual a Key Influencers.",
      "Activar 'Small multiples' en el eje X.",
    ],
    correcta: 0,
    explicacion:
      "Las divisiones 'High value' y 'Low value' (con icono de bombilla) utilizan IA para evaluar todos los campos en 'Explain by' y encontrar automáticamente la ruta que maximiza o minimiza la métrica en 'Analyze'.",
    temaClave: "Decomposition Tree e IA splits",
  },
  {
    id: "vis-06",
    dominio: "visualizar",
    dificultad: "Intermedia",
    escenario:
      "Quieres que las barras de un gráfico cambien de color dinámicamente según una regla compleja de cumplimiento de meta vs año anterior definida en una medida DAX llamada [Color Cumplimiento] que devuelve códigos hexadecimales ('#10B981' o '#EF4444').",
    pregunta: "¿Qué estilo de formato condicional debes elegir en las propiedades de Color de las barras?",
    opciones: [
      "Field value (Valor de campo) apuntando a la medida [Color Cumplimiento].",
      "Gradient (Degradado) con valores mínimo y máximo.",
      "Rules (Reglas) comparando el texto hexadecimal.",
      "Theme colors automático.",
    ],
    correcta: 0,
    explicacion:
      "Cuando una medida DAX devuelve directamente nombres de colores CSS o códigos hexadecimales, el modo 'Field value' aplica ese color exacto a cada barra o celda.",
    temaClave: "Formato condicional con Field value",
  },
  {
    id: "vis-07",
    dominio: "visualizar",
    dificultad: "Intermedia",
    escenario:
      "Al pasar el cursor sobre un punto de un gráfico de ventas por mes, quieres mostrar un mini-gráfico de barras con el Top 5 productos de ese mes en lugar de la caja negra estándar.",
    pregunta: "¿Qué debes configurar?",
    opciones: [
      "Crear una nueva página, activar 'Allow use as tooltip' en Page information, ajustar el tamaño de lienzo a Tooltip y asignarla en las propiedades Tooltip del gráfico.",
      "Configurar un Drill through apuntando a la página de productos.",
      "Agregar los productos al campo 'Tooltips' del gráfico de barras.",
      "Insertar un Bookmark emergente.",
    ],
    correcta: 0,
    explicacion:
      "Los Report Page Tooltips permiten usar una página dedicada como ventana emergente dinámica. Al pasar el cursor, Power BI filtra automáticamente esa página por el punto de datos señalado.",
    temaClave: "Report Page Tooltips",
  },
  {
    id: "vis-08",
    dominio: "visualizar",
    dificultad: "Base",
    escenario:
      "Necesitas visualizar en un solo gráfico cómo cambia la posición de ranking (1°, 2°, 3°...) de 5 categorías de productos a lo largo de los cuatro trimestres del año.",
    pregunta: "¿Qué visual nativo de Power BI está diseñado específicamente para mostrar cambios de ranking en el tiempo?",
    opciones: [
      "Ribbon chart (Gráfico de cinta).",
      "Waterfall chart (Gráfico de cascada).",
      "Scatter chart (Gráfico de dispersión).",
      "Funnel chart (Gráfico de embudo).",
    ],
    correcta: 0,
    explicacion:
      "El Ribbon chart ordena automáticamente las categorías de arriba hacia abajo en cada período según su valor, mostrando mediante cintas cómo suben o bajan de posición. Waterfall explica variaciones positivas/negativas entre un inicio y un final.",
    temaClave: "Selección de visuales: Ribbon vs Waterfall",
  },
  {
    id: "vis-09",
    dominio: "visualizar",
    dificultad: "Base",
    escenario:
      "Tu empresa exige que los reportes publicados cumplan con estándares básicos de accesibilidad para usuarios que navegan con teclado y lectores de pantalla.",
    pregunta: "¿Qué dos configuraciones en Power BI Desktop atienden directamente este requisito?",
    opciones: [
      "Configurar el 'Tab order' en el panel Selection y redactar 'Alt text' descriptivo (estático o por medida) en cada visual.",
      "Cambiar el tamaño de página a 16:9 y activar la cuadrícula.",
      "Ocultar los encabezados de todos los visuales.",
      "Usar únicamente tablas en lugar de gráficos.",
    ],
    correcta: 0,
    explicacion:
      "Tab order define la secuencia lógica al pulsar Tab con el teclado, y Alt text proporciona descripciones leídas por lectores de pantalla (incluso dinámicas mediante expresiones DAX).",
    temaClave: "Accesibilidad: Tab order y Alt text",
  },
  {
    id: "vis-10",
    dominio: "visualizar",
    dificultad: "Examen",
    escenario:
      "Tienes un gráfico de líneas con Ventas diarias de los últimos 12 meses y quieres que Power BI señale automáticamente picos o caídas inusuales fuera del rango esperado junto con una explicación de posibles causas.",
    pregunta: "¿Qué función nativa debes habilitar en el panel Analytics del gráfico de líneas?",
    opciones: [
      "Find anomalies (Buscar anomalías).",
      "Forecast (Previsión).",
      "Trend line (Línea de tendencia).",
      "Average line (Línea de promedio).",
    ],
    correcta: 0,
    explicacion:
      "La característica 'Find anomalies' en el panel Analytics del gráfico de líneas detecta puntos fuera de la banda esperada según sensibilidad configurable y permite elegir campos en 'Explain by' para analizar posibles factores.",
    temaClave: "Detección de anomalías en gráfico de líneas",
  },

  // =========================================================================
  // DOMINIO 4: IMPLEMENTAR Y MANTENER ACTIVOS (10 preguntas)
  // =========================================================================
  {
    id: "imp-01",
    dominio: "implementar",
    dificultad: "Examen",
    escenario:
      "Implementas Seguridad a Nivel de Fila (RLS) dinámica en una tabla Dim_Vendedor que tiene la columna CorreoCorporativo. Necesitas que cada vendedor vea solo sus ventas al abrir el reporte en Power BI Service.",
    pregunta: "¿Qué expresión DAX debes usar en el rol y qué rol de Workspace debe tener el vendedor para que la seguridad se aplique?",
    opciones: [
      "[CorreoCorporativo] = USERPRINCIPALNAME() y el vendedor debe tener acceso como Viewer (Visor) o consumir mediante una App sin permisos de edición.",
      "[CorreoCorporativo] = USERNAME() y el vendedor debe ser Contributor del Workspace.",
      "[CorreoCorporativo] = USEROBJECTID() y el vendedor debe ser Member del Workspace.",
      "[CorreoCorporativo] = CUSTOMDATA() y el vendedor debe ser Admin del Workspace.",
    ],
    correcta: 0,
    explicacion:
      "En Power BI Service, USERPRINCIPALNAME() devuelve el UPN/correo del usuario autenticado (mientras USERNAME() suele coincidir en Service pero en Desktop devuelve DOMINIO\\usuario). Además, RLS solo se aplica a usuarios con rol Viewer (o consumidores de App); Admin, Member y Contributor omiten RLS.",
    temaClave: "RLS dinámico con USERPRINCIPALNAME() y rol Viewer",
  },
  {
    id: "imp-02",
    dominio: "implementar",
    dificultad: "Intermedia",
    escenario:
      "Un analista necesita publicar reportes en un Workspace, modificar modelos semánticos y programar actualizaciones, pero NO debe poder agregar ni eliminar miembros del Workspace ni actualizar la App del Workspace.",
    pregunta: "¿Qué rol de Workspace debes asignarle?",
    opciones: [
      "Contributor (Colaborador).",
      "Member (Miembro).",
      "Viewer (Visor).",
      "Admin (Administrador).",
    ],
    correcta: 0,
    explicacion:
      "Contributor puede publicar, editar contenido y programar refreshes, pero no puede administrar permisos del Workspace ni publicar/actualizar la App (a menos que un Admin/Member le delegue explícitamente la publicación de la App). Member sí puede agregar miembros con rol igual o inferior y publicar Apps.",
    temaClave: "Roles de Workspace en Power BI Service",
  },
  {
    id: "imp-03",
    dominio: "implementar",
    dificultad: "Intermedia",
    escenario:
      "Tu reporte en Power BI Service se conecta a un SQL Server on-premises y a un archivo en red local. Varios administradores de TI deben poder gestionar el origen y necesitas soportar DirectQuery además de actualizaciones programadas.",
    pregunta: "¿Qué puerta de enlace debes instalar en el servidor corporativo?",
    opciones: [
      "On-premises data gateway (Standard mode).",
      "On-premises data gateway (Personal mode).",
      "VNet Data Gateway sin configuración adicional.",
      "Ninguna, Power BI Service se conecta directo por IP pública local.",
    ],
    correcta: 0,
    explicacion:
      "El modo Standard permite múltiples administradores, soporta DirectQuery y Live Connection, y comparte orígenes entre usuarios. El modo Personal está ligado a un solo usuario, no soporta DirectQuery y se ejecuta como aplicación de usuario.",
    temaClave: "On-premises Data Gateway: Standard vs Personal",
  },
  {
    id: "imp-04",
    dominio: "implementar",
    dificultad: "Examen",
    escenario:
      "Configuras Actualización Incremental (Incremental Refresh) en una tabla Fact_Transacciones de 100 millones de filas para almacenar 5 años y refrescar solo los últimos 7 días.",
    pregunta:
      "¿Qué requisitos obligatorios debes cumplir en Power Query antes de configurar la política?",
    opciones: [
      "Crear exactamente dos parámetros tipo Date/Time llamados RangeStart y RangeEnd (sensibles a mayúsculas) y usarlos para filtrar la columna de fecha con Query Folding activo.",
      "Crear dos parámetros de tipo Texto llamados StartDate y EndDate.",
      "Deshabilitar 'Enable load' en la tabla Fact_Transacciones.",
      "Publicar el reporte primero y crear los parámetros en Power BI Service.",
    ],
    correcta: 0,
    explicacion:
      "Power BI exige exactamente los nombres RangeStart y RangeEnd en tipo Date/Time, aplicando un filtro >= RangeStart y < RangeEnd (o > y <= para evitar duplicados en los bordes) sobre una consulta que soporte Query Folding para particionar eficientemente.",
    temaClave: "Incremental Refresh: RangeStart y RangeEnd",
  },
  {
    id: "imp-05",
    dominio: "implementar",
    dificultad: "Intermedia",
    escenario:
      "Una empresa tiene 120 usuarios que solo consumen reportes (lectura e interacción) y 5 analistas que crean y publican reportes. Quieren que los 120 consumidores usen licencias gratuitas (Power BI Free) sin pagar 120 licencias Pro.",
    pregunta: "¿Qué licenciamiento resuelve este escenario?",
    opciones: [
      "Alojar el Workspace en una capacidad Premium / Microsoft Fabric (F64 o superior) y asignar licencia Pro únicamente a los 5 analistas creadores.",
      "Comprar 5 licencias Premium Per User (PPU) para los analistas; los usuarios Free podrán ver su contenido.",
      "Dar licencia Pro solo al administrador del tenant.",
      "Publicar los reportes internos usando 'Publish to web' (Publicar en la web).",
    ],
    correcta: 0,
    explicacion:
      "Una capacidad Premium / Fabric F64+ permite que usuarios con licencia Free consuman contenido en Apps/Workspaces asignados a esa capacidad, mientras los creadores siguen necesitando Pro (o PPU). Con PPU, todos los consumidores también deben tener PPU. 'Publish to web' expone datos confidenciales públicamente en internet.",
    temaClave: "Licenciamiento: Pro vs PPU vs Capacidad Fabric F64+",
  },
  {
    id: "imp-06",
    dominio: "implementar",
    dificultad: "Intermedia",
    escenario:
      "Usas Deployment Pipelines (Desarrollo -> Pruebas -> Producción) para gestionar el ciclo de vida de tus reportes. En Desarrollo el modelo apunta a DB_DEV, pero en Producción debe apuntar a DB_PROD automáticamente al desplegar.",
    pregunta: "¿Dónde se configura ese cambio automático de base de datos sin editar el archivo .pbix?",
    opciones: [
      "En las 'Deployment rules' (Reglas de implementación) de la etapa Test/Production sobre el modelo semántico.",
      "En el panel de formato del reporte en Power BI Desktop.",
      "Creando un rol de RLS para el servidor de producción.",
      "Cambiando el rol del Workspace a Viewer.",
    ],
    correcta: 0,
    explicacion:
      "Deployment Pipelines permite definir Data source rules o Parameter rules en las etapas Test y Production para que, tras cada despliegue, el modelo apunte automáticamente al origen o parámetro correspondiente a ese entorno.",
    temaClave: "Deployment Pipelines y reglas de parámetros",
  },
  {
    id: "imp-07",
    dominio: "implementar",
    dificultad: "Base",
    escenario:
      "Un modelo semántico oficial de Finanzas fue validado por el equipo de Gobierno de Datos para que toda la organización lo reutilice con confianza y aparezca destacado en el Data Hub.",
    pregunta: "¿Qué nivel de aprobación (Endorsement) debe aplicarse y quién puede asignarlo?",
    opciones: [
      "Certified (Certificado), asignado únicamente por revisores autorizados por el administrador de Power BI.",
      "Promoted (Promocionado), asignado automáticamente por cualquier usuario Viewer.",
      "Sensitivity Label 'Public', asignada desde Excel.",
      "Certified, asignado por cualquier usuario con licencia Free.",
    ],
    correcta: 0,
    explicacion:
      "Promoted puede ser asignado por cualquier propietario/contributor con permiso de escritura en el elemento, mientras que Certified está restringido a un grupo selecto de revisores autorizados en el portal de administración del tenant.",
    temaClave: "Endorsement: Promoted vs Certified",
  },
  {
    id: "imp-08",
    dominio: "implementar",
    dificultad: "Examen",
    escenario:
      "El gerente comercial quiere recibir una notificación automática por correo cuando el KPI de 'Margen Mensual' caiga por debajo del 18% tras cada actualización.",
    pregunta: "¿Dónde y cómo debes configurar esta alerta de datos?",
    opciones: [
      "Fijar (Pin) la tarjeta o KPI del Reporte en un Dashboard de Power BI Service y crear un 'Manage alert' sobre ese mosaico (tile).",
      "Configurar la alerta directamente sobre una tabla matriz dentro del Reporte.",
      "Crear una suscripción por correo desde Power BI Desktop.",
      "Usar Formato Condicional en la tarjeta y activar notificaciones en el navegador.",
    ],
    correcta: 0,
    explicacion:
      "Las alertas basadas en umbrales (Manage alerts) solo existen en Dashboards de Power BI Service y funcionan únicamente sobre mosaicos de tipo Card, KPI o Gauge. No se configuran directamente dentro de un Report.",
    temaClave: "Alertas de datos en Dashboards vs Reports",
  },
  {
    id: "imp-09",
    dominio: "implementar",
    dificultad: "Base",
    escenario:
      "Publicas una Power BI App desde un Workspace que contiene reportes para Ventas y reportes para Finanzas. Quieres que el equipo de Ventas solo vea las páginas/reportes comerciales y Finanzas solo los financieros, sin mantener dos Workspaces separados.",
    pregunta: "¿Qué funcionalidad de Power BI Apps resuelve esto?",
    opciones: [
      "Configurar múltiples Audiencias (Audiences) dentro de la App asignando distintos reportes y grupos de usuarios a cada audiencia.",
      "Crear dos Workspaces idénticos y duplicar el modelo semántico.",
      "Aplicar RLS sobre los nombres de las páginas del reporte.",
      "Compartir el archivo .pbix por correo a cada área.",
    ],
    correcta: 0,
    explicacion:
      "Las Audiencias (Audiences) en Power BI Apps permiten empaquetar distintos subconjuntos de reportes y dashboards desde un mismo Workspace hacia distintos grupos de usuarios sin duplicar activos.",
    temaClave: "Power BI Apps y Audiencias",
  },
  {
    id: "imp-10",
    dominio: "implementar",
    dificultad: "Intermedia",
    escenario:
      "Antes de eliminar una columna o cambiar una medida en un modelo semántico compartido, quieres saber exactamente qué otros reportes y dashboards en distintos Workspaces dependen de ese modelo.",
    pregunta: "¿Qué herramienta de Power BI Service debes revisar?",
    opciones: [
      "Lineage view (Vista de linaje) y la opción 'Impact analysis' (Análisis de impacto) del modelo semántico.",
      "Performance Analyzer en Power BI Desktop.",
      "Column Distribution en Power Query.",
      "El historial de descargas de la App.",
    ],
    correcta: 0,
    explicacion:
      "Lineage view muestra el flujo completo desde los orígenes de datos y gateways hasta modelos semánticos, reportes y dashboards; 'Impact analysis' lista todos los artefactos y workspaces downstream que se verán afectados por un cambio.",
    temaClave: "Lineage view e Impact analysis",
  },
];

export const PL300_FAQS: readonly Pl300Faq[] = [
  {
    q: "¿Con qué puntaje se aprueba el examen oficial Microsoft PL-300?",
    a: "Microsoft aprueba el examen PL-300 (Power BI Data Analyst Associate) con un puntaje mínimo de 700 sobre 1000 puntos. Las preguntas tienen distinto peso y no restan puntos por responder mal, por lo que conviene responder todas.",
  },
  {
    q: "¿Cuánto dura el examen PL-300 y cuántas preguntas trae?",
    a: "El examen otorga 100 minutos de tiempo de prueba (más tiempo previo para leer acuerdos y encuestas) y suele contener entre 45 y 60 preguntas, incluyendo opción múltiple, arrastrar y soltar, y al menos un caso de estudio con escenario empresarial.",
  },
  {
    q: "¿Se puede rendir el examen PL-300 en español?",
    a: "Sí. Al agendar el examen en Pearson VUE desde Microsoft Learn puedes elegir español como idioma de la interfaz y preguntas. Aun así, muchos términos técnicos (como nombres de funciones DAX o menús de Power Query) suelen estudiarse también con su nombre en inglés.",
  },
  {
    q: "¿El puntaje de este simulador equivale exactamente al puntaje oficial de Microsoft?",
    a: "Es un puntaje simulado de referencia escalado a 1000 según tu porcentaje de aciertos. Microsoft utiliza un modelo psicométrico interno (IRT) donde cada pregunta tiene un peso distinto, pero usar 700/1000 como umbral de referencia es la mejor guía práctica para medir si estás listo.",
  },
  {
    q: "¿Cuál es la diferencia entre el certificado de ProgramBI y la certificación oficial Microsoft PL-300?",
    a: "El certificado de ProgramBI acredita que completaste nuestra formación práctica con casos reales y proyectos aplicados. La certificación PL-300 es una credencial oficial emitida por Microsoft al aprobar su examen supervisado en Pearson VUE. Nuestro curso de Power BI cubre los cuatro dominios del examen para prepararte.",
  },
  {
    q: "¿Cuánto cuesta el examen PL-300 y cómo se renueva?",
    a: "El precio estándar de referencia es de USD 165 en Estados Unidos y varía según el país (en Latinoamérica suele ser menor). Una vez obtenida, la certificación dura 1 año y se renueva de forma gratuita mediante una evaluación corta online en Microsoft Learn.",
  },
  {
    q: "¿Qué porcentaje pesa cada dominio en el examen PL-300?",
    a: "Microsoft distribuye el examen en cuatro dominios oficiales: Preparar los datos (25–30%), Modelar los datos (25–30%), Visualizar y analizar los datos (25–30%) e Implementar y mantener activos (15–20%).",
  },
  {
    q: "¿Cómo prepararse en 4 semanas para aprobar el PL-300?",
    a: "Dedica la semana 1 a Power Query y Query Folding; la semana 2 a Star Schema, relaciones y DAX (CALCULATE, Time Intelligence, iteradores); la semana 3 a visuales, marcadores, drill-through y accesibilidad; y la semana 4 a Power BI Service (RLS, gateways, licencias, actualización incremental) junto con simulacros cronometrados.",
  },
] as const;

export type ModoSimulador = "rapido" | "completo" | "dominio";

/**
 * Selecciona preguntas según el modo elegido:
 * - rapido: 15 preguntas balanceadas (4 preparar, 4 modelar, 4 visualizar, 3 implementar)
 * - completo: las 40 preguntas (ordenadas por dominio)
 * - dominio: las 10 preguntas del dominio elegido
 */
export function seleccionarPreguntas(
  modo: ModoSimulador,
  dominio?: Pl300DominioId,
): Pl300Pregunta[] {
  if (modo === "dominio") {
    const objetivo = dominio ?? "preparar";
    return PL300_PREGUNTAS.filter((p) => p.dominio === objetivo);
  }
  if (modo === "completo") {
    return [...PL300_PREGUNTAS];
  }
  // Simulacro rápido balanceado según pesos oficiales (25-30%, 25-30%, 25-30%, 15-20%)
  const cuotas: Record<Pl300DominioId, number> = {
    preparar: 4,
    modelar: 4,
    visualizar: 4,
    implementar: 3,
  };
  const seleccion: Pl300Pregunta[] = [];
  for (const dom of PL300_DOMINIOS) {
    const delDominio = PL300_PREGUNTAS.filter((p) => p.dominio === dom.id);
    seleccion.push(...delDominio.slice(0, cuotas[dom.id]));
  }
  return seleccion;
}

export interface ResultadoDominioPl300 {
  dominio: Pl300Dominio;
  correctas: number;
  total: number;
  porcentaje: number;
  estado: "fortaleza" | "en-proceso" | "brecha";
}

export interface ResultadoSimulacroPl300 {
  correctas: number;
  total: number;
  porcentaje: number;
  puntajeEscala: number;
  aprobadoSimulado: boolean;
  porDominio: ResultadoDominioPl300[];
  brechas: ResultadoDominioPl300[];
}

export function evaluarSimulacroPl300(
  preguntas: readonly Pl300Pregunta[],
  respuestas: readonly (number | null)[],
): ResultadoSimulacroPl300 {
  let correctas = 0;
  const conteo = new Map<Pl300DominioId, { correctas: number; total: number }>();

  preguntas.forEach((preg, idx) => {
    const actual = conteo.get(preg.dominio) ?? { correctas: 0, total: 0 };
    actual.total += 1;
    if (respuestas[idx] === preg.correcta) {
      correctas += 1;
      actual.correctas += 1;
    }
    conteo.set(preg.dominio, actual);
  });

  const total = Math.max(1, preguntas.length);
  const porcentaje = Math.round((correctas / total) * 100);
  const puntajeEscala = Math.round((correctas / total) * 1000);
  const aprobadoSimulado = puntajeEscala >= 700;

  const porDominio: ResultadoDominioPl300[] = [];
  for (const dom of PL300_DOMINIOS) {
    const stats = conteo.get(dom.id);
    if (!stats || stats.total === 0) continue;
    const pct = Math.round((stats.correctas / stats.total) * 100);
    const estado: ResultadoDominioPl300["estado"] =
      pct >= 75 ? "fortaleza" : pct >= 60 ? "en-proceso" : "brecha";
    porDominio.push({
      dominio: dom,
      correctas: stats.correctas,
      total: stats.total,
      porcentaje: pct,
      estado,
    });
  }

  const brechas = porDominio.filter((d) => d.porcentaje < 70);

  return {
    correctas,
    total: preguntas.length,
    porcentaje,
    puntajeEscala,
    aprobadoSimulado,
    porDominio,
    brechas,
  };
}

/**
 * Cuatro preguntas representativas (una por dominio) que se renderizan en SSR
 * para SEO y GEO en /simulador-pl-300.
 */
export const PL300_MUESTRA_SSR: readonly Pl300Pregunta[] = [
  PL300_PREGUNTAS[0], // prep-01: Query Folding
  PL300_PREGUNTAS[11], // mod-02: USERELATIONSHIP
  PL300_PREGUNTAS[20], // vis-01: Bookmarks Data vs Display
  PL300_PREGUNTAS[30], // imp-01: Dynamic RLS USERPRINCIPALNAME()
] as const;
