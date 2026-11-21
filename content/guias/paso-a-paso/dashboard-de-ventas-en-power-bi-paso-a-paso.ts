import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "dashboard-de-ventas-en-power-bi-paso-a-paso",
  title: "Cómo hacer un dashboard de ventas en Power BI (paso a paso)",
  meta: "Construye desde cero un dashboard de ventas en Power BI: carga desde Excel, modelo estrella, medidas DAX, visuales y diseño profesional. Guía completa.",
  h1: "Cómo hacer un dashboard de ventas en Power BI desde cero",
  subtitle:
    "De un archivo Excel transaccional a un tablero comercial interactivo con modelo estrella, medidas DAX de variación interanual, tema JSON corporativo y publicación en la nube.",
  keywordPrincipal: "como hacer un dashboard en Power BI",
  keywords: [
    "como hacer un dashboard en Power BI",
    "dashboard de ventas en Power BI",
    "dashboard Power BI paso a paso con Excel",
    "ejemplo dashboard Power BI desde cero",
  ],
  curso: "power-bi",
  herramienta: "Power BI",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT45M",
  esInsignia: true,
  en30Segundos: {
    queLogras:
      "Armar un dashboard de ventas completo en Power BI Desktop conectado a Excel, con modelo estrella, indicadores comerciales en DAX, filtros dinámicos, drill-through de detalle y publicación lista para compartir.",
    herramienta: "Power BI Desktop + Excel",
    tiempo: "45 minutos",
    bullets: [
      "Limpiar y tipar tablas de ventas, clientes y productos en Power Query.",
      "Construir un modelo estrella con tabla calendario y relaciones 1 a muchos.",
      "Programar medidas DAX esenciales: Ventas, Ventas AA, Var % AA, Margen % y Top N.",
      "Diseñar una página ejecutiva con tarjetas KPI, tendencias, tema JSON y página de detalle.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Preguntas clave",
      resumen: "Define qué decisiones comerciales debe responder el tablero.",
      anchorId: "preguntas-dashboard",
      icono: "chart",
    },
    {
      numero: 2,
      titulo: "Dataset y Power Query",
      resumen: "Revisa la estructura ficticia de Excel y limpia columnas.",
      anchorId: "limpiar-power-query",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Modelo estrella",
      resumen: "Separa hechos de dimensiones y conecta la tabla calendario.",
      anchorId: "modelo-estrella",
      icono: "layers",
    },
    {
      numero: 4,
      titulo: "Medidas DAX",
      resumen: "Calcula ventas, comparación año anterior, margen y ranking.",
      anchorId: "medidas-dax",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Visuales y tema",
      resumen: "Elige el gráfico correcto por KPI y aplica paleta JSON.",
      anchorId: "visuales-diseno",
      icono: "sparkles",
    },
    {
      numero: 6,
      titulo: "Interacción y publicación",
      resumen: "Configura segmentadores, drill-through y sube a Power BI Service.",
      anchorId: "publicar-compartir",
      icono: "settings",
    },
  ],
  requisitos: {
    version: "Power BI Desktop (Windows) actualizado y Microsoft Excel",
    lista: [
      "Power BI Desktop instalado gratis en Windows (versión de 64 bits recomendada).",
      "Un libro de Excel (.xlsx) con tablas estructuradas de ventas, productos y clientes.",
      "Cuenta corporativa o educativa de Microsoft 365 si deseas publicar en Power BI Service.",
    ],
    compatibilidadMacWeb:
      "Power BI Desktop solo corre de forma nativa en Windows. Si trabajas en Mac, necesitas una máquina virtual Windows (como Parallels) o un escritorio remoto para diseñar el archivo .pbix; luego cualquier usuario puede consultar el informe publicado desde el navegador web en macOS, Windows o móvil.",
    avisoEducativo:
      "Los nombres de columnas, montos en pesos chilenos y códigos de ejemplo de esta guía son ficticios y están pensados para practicar la metodología en tu propio negocio.",
  },
  herramientasHowTo: ["Power BI Desktop", "Microsoft Excel", "Power Query"],
  insumosHowTo: [
    "Libro Excel ficticio con hojas Ventas, Productos y Clientes",
    "Archivo JSON de tema visual básico",
  ],
  secciones: [
    {
      id: "preguntas-dashboard",
      titulo: "1. Qué preguntas debe responder tu dashboard de ventas",
      esPasoHowTo: true,
      resumenHowTo:
        "Define las cinco preguntas comerciales principales del tablero antes de importar datos o dibujar gráficos.",
      parrafos: [
        "El error más común al empezar un dashboard de ventas en Power BI es abrir el programa y arrastrar gráficos al azar sin haber definido qué decisiones necesita tomar quien lo va a mirar. Un tablero gerencial o comercial no es un repositorio de todas las columnas de tu ERP: es una herramienta de lectura rápida para detectar desviaciones, oportunidades y responsables en menos de treinta segundos.",
        "Antes de tocar Power Query o escribir una línea de DAX, siéntate con el equipo comercial o con la gerencia y acuerda cinco preguntas concretas. En empresas chilenas de distribución, retail o servicios B2B, casi siempre giran en torno al cumplimiento de metas, la comparación contra el mismo período del año anterior, la rentabilidad real después de descuentos y costos, y la concentración de ingresos en ciertos vendedores o categorías.",
        "Cuando cada visual del lienzo responde a una de esas preguntas, evitas llenar la pantalla de tablas gigantes y tortas ilegibles. Además, definir las preguntas primero te dice exactamente qué columnas necesitas traer desde Excel y qué cálculos requieren medidas explícitas.",
      ],
      lista: [
        "¿Cuánto vendimos este mes y este año acumulado frente al mismo período del año anterior (Var % AA)?",
        "¿Qué porcentaje de margen bruto estamos reteniendo después de costos y descuentos?",
        "¿Cuál es la evolución mensual de ingresos y cómo se compara con la estacionalidad histórica?",
        "¿Qué categorías de producto y qué canales de venta empujan el crecimiento o explican la caída?",
        "¿Quiénes son los 10 clientes o vendedores con mayor facturación y cuál es su ticket promedio?",
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-1",
        alt: "Bosquejo de arquitectura de un dashboard de ventas en Power BI dividido en tarjetas KPI, gráfico de tendencia y desglose por categoría",
        caption:
          "Estructura recomendada de una sola pantalla: resumen ejecutivo arriba, tendencia temporal al centro y desglose accionable abajo.",
        ratio: "16/9",
      },
    },
    {
      id: "dataset-ejemplo",
      titulo: "2. Dataset de ejemplo: estructura recomendada en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Organiza el archivo Excel de origen en tablas separadas de hechos (Ventas) y dimensiones (Productos y Clientes).",
      parrafos: [
        "Para seguir esta guía paso a paso trabajaremos con un dataset ficticio de ventas minoristas y mayoristas en Chile, guardado en un libro de Excel llamado ventas_demo.xlsx. En lugar de tener una sábana gigante con cincuenta columnas repetidas, el archivo viene separado en tres hojas con formato de Tabla de Excel (Ctrl + T): Ventas, Productos y Clientes.",
        "Separar las tablas desde el origen o en Power Query es la base para que Power BI funcione rápido y sin errores de agregación. La tabla Ventas registra cada línea de boleta o factura (muchas filas que crecen todos los días), mientras que Productos y Clientes guardan los atributos descriptivos únicos de cada código.",
      ],
      tabla: {
        caption:
          "Estructura del dataset de ejemplo (datos y columnas ficticios para práctica).",
        encabezados: ["Tabla (ficticia)", "Columnas clave", "Tipo de dato", "Rol en el modelo"],
        filas: [
          [
            "Ventas (Hechos)",
            "IdVenta, Fecha, IdProducto, IdCliente, Canal, Cantidad, Monto, Costo",
            "Texto, Fecha, Entero, Decimal",
            "Tabla de hechos transaccional",
          ],
          [
            "Productos (Dimensión)",
            "IdProducto, NombreProducto, Categoria, Subcategoria, Marca",
            "Texto / Entero único",
            "Tabla de dimensión descriptiva",
          ],
          [
            "Clientes (Dimensión)",
            "IdCliente, RazonSocial, Segmento, Region, VendedorAsignado",
            "Texto / Entero único",
            "Tabla de dimensión descriptiva",
          ],
        ],
      },
      alerta: {
        tipo: "info",
        titulo: "Convierte tus rangos en Tablas de Excel",
        texto:
          "Antes de conectar Power BI, selecciona tus datos en Excel y presiona Ctrl + T. Dale un nombre claro a cada tabla (por ejemplo, tblVentas) desde la pestaña Diseño de tabla. Así Power Query leerá el rango dinámico aunque agregues filas nuevas mañana.",
      },
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-2",
        alt: "Libro de Excel con tres hojas nombradas Ventas, Productos y Clientes formateadas como tablas estructuradas",
        caption:
          "Archivo Excel ficticio de origen: cada entidad en su propia hoja y con encabezados limpios en la primera fila.",
        ratio: "16/9",
      },
    },
    {
      id: "limpiar-power-query",
      titulo: "3. Cargar y limpiar los datos en Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Importa el libro Excel en Power BI Desktop, abre Transformar datos y verifica tipos de datos, nulos y duplicados.",
      parrafos: [
        "Abre Power BI Desktop y en la pestaña Inicio haz clic en Libro de Excel. Selecciona tu archivo ventas_demo.xlsx. En la ventana Navegador marca las tres tablas (tblVentas, tblProductos y tblClientes) y presiona Transformar datos en lugar de Cargar directamente. Entrar al Editor de Power Query siempre es obligatorio para auditar la calidad de los datos antes de modelar.",
        "Dentro de Power Query revisa que cada columna tenga el tipo de dato correcto en el ícono de su encabezado. La columna Fecha debe ser tipo Fecha (no Fecha/hora ni Texto), Cantidad debe ser Número entero, y Monto y Costo deben quedar como Número decimal fijo (moneda) o Número decimal. Si tu Excel mezcla puntos y comas por configuración regional, usa Clic derecho > Cambiar tipo > Usar configuración regional y elige Español (Chile).",
        "En las tablas de dimensiones (Productos y Clientes), selecciona la columna clave (IdProducto o IdCliente), ve a Inicio > Quitar filas > Quitar duplicados y asegúrate de eliminar filas en blanco. Si una clave aparece repetida en una dimensión, Power BI no te dejará crear una relación uno a muchos más adelante.",
      ],
      listaOrdenada: [
        "Conecta el archivo desde Inicio > Obtener datos > Libro de Excel y elige Transformar datos.",
        "Verifica que los encabezados estén promovidos (Usar la primera fila como encabezado) en las tres consultas.",
        "Ajusta tipos de datos: Fecha como Date, Monto y Costo como Decimal fijo, IDs como Texto o Entero consistente.",
        "En Productos y Clientes, aplica Quitar duplicados sobre el ID único y filtra valores nulos.",
        "Presiona Cerrar y aplicar en la esquina superior izquierda para cargar las tablas limpias al modelo.",
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-3",
        alt: "Editor de Power Query mostrando las consultas tblVentas, tblProductos y tblClientes con los pasos aplicados a la derecha",
        caption:
          "Editor de Power Query: tipos de datos validados y pasos aplicados limpios antes de cargar al modelo.",
        ratio: "16/9",
      },
    },
    {
      id: "modelo-estrella",
      titulo: "4. Construir el modelo estrella y la tabla calendario",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea la tabla calendario, márcala como tabla de fechas y relaciona las dimensiones hacia la tabla de hechos Ventas.",
      parrafos: [
        "Una vez cargadas las consultas, ve a la Vista de modelo (tercer ícono en la barra vertical izquierda de Power BI Desktop). Aquí es donde la mayoría de los principiantes comete errores silenciosos: dejar tablas sueltas o crear relaciones bidireccionales innecesarias. El estándar recomendado por Microsoft para inteligencia de negocios es el esquema en estrella: la tabla de hechos Ventas al centro y las dimensiones alrededor.",
        "Además de Productos y Clientes, todo dashboard de ventas necesita una tabla Calendario dedicada para calcular comparaciones interanuales, acumulados del año (YTD) y promedios móviles sin que DAX falle cuando faltan días sin ventas. Si quieres profundizar en todas las variantes en DAX y Power Query, revisa nuestra guía completa de tabla calendario en Power BI (/guias/tabla-calendario-power-bi-dax).",
        "Para crearla rápido en este proyecto, ve a la pestaña Herramientas de tablas > Nueva tabla y pega una fórmula DAX básica con CALENDAR. Luego marca la tabla como tabla de fechas (clic derecho sobre la tabla > Marcar como tabla de fechas) seleccionando la columna Date, y arrastra los campos clave para unir Calendario[Date] con Ventas[Fecha], Productos[IdProducto] con Ventas[IdProducto] y Clientes[IdCliente] con Ventas[IdCliente]. Todas las relaciones deben mostrar cardinalidad 1 a varios (1:*) y dirección de filtro único desde la dimensión hacia Ventas.",
      ],
      codigos: [
        {
          titulo: "Tabla Calendario mínima para el modelo de ventas",
          lenguaje: "dax",
          codigo: `Calendario =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2024, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Anio", YEAR ( [Date] ),
    "MesNum", MONTH ( [Date] ),
    "Mes", SWITCH (
        MONTH ( [Date] ),
        1, "Enero", 2, "Febrero", 3, "Marzo", 4, "Abril",
        5, "Mayo", 6, "Junio", 7, "Julio", 8, "Agosto",
        9, "Septiembre", 10, "Octubre", 11, "Noviembre", 12, "Diciembre"
    ),
    "Trimestre", "T" & QUARTER ( [Date] )
)`,
          nota: "Recuerda ordenar la columna Mes por MesNum desde Herramientas de columnas > Ordenar por columna para que Enero aparezca antes que Febrero y no en orden alfabético.",
        },
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-4",
        alt: "Vista de modelo de Power BI mostrando la tabla Ventas al centro conectada con relaciones 1 a muchos desde Calendario, Productos y Clientes",
        caption:
          "Esquema en estrella: dimensiones arriba apuntando con flecha única hacia la tabla de hechos Ventas.",
        ratio: "16/9",
      },
    },
    {
      id: "medidas-dax",
      titulo: "5. Escribir las medidas DAX clave del negocio",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una tabla dedicada para medidas y programa Ventas, Ventas AA, Var % AA, Margen %, Ticket promedio y Top N.",
      parrafos: [
        "Nunca arrastres columnas numéricas crudas directamente a los gráficos (las llamadas medidas implícitas). Crea una tabla vacía llamada _Medidas desde Inicio > Especificar datos y guarda ahí todas tus métricas explícitas en DAX. Así mantienes el modelo ordenado, reutilizable y compatible con herramientas de formato avanzado.",
        "Las seis medidas siguientes cubren el 90 % de lo que necesita cualquier gerencia comercial: facturación total, comparación contra el año anterior usando SAMEPERIODLASTYEAR, variación porcentual segura con DIVIDE, margen porcentual bruto, ticket promedio por transacción y ventas filtradas al Top 5 o Top 10 de productos. Si quieres dominar la lógica detrás de CALCULATE y el contexto de filtro, consulta nuestra guía de funciones DAX más importantes (/guias/funciones-dax-mas-importantes).",
      ],
      codigos: [
        {
          titulo: "Paquete de medidas DAX comerciales",
          lenguaje: "dax",
          codigo: `Ventas = SUM ( Ventas[Monto] )

Costo Total = SUM ( Ventas[Costo] )

Margen % =
DIVIDE ( [Ventas] - [Costo Total], [Ventas], 0 )

Ventas AA =
CALCULATE (
    [Ventas],
    SAMEPERIODLASTYEAR ( Calendario[Date] )
)

Var % AA =
DIVIDE ( [Ventas] - [Ventas AA], [Ventas AA] )

Ticket Promedio =
DIVIDE ( [Ventas], DISTINCTCOUNT ( Ventas[IdVenta] ), 0 )

Top 5 Productos Ventas =
CALCULATE (
    [Ventas],
    KEEPFILTERS (
        TOPN ( 5, ALLSELECTED ( Productos[NombreProducto] ), [Ventas], DESC )
    )
)

Ranking Producto =
RANKX ( ALLSELECTED ( Productos[NombreProducto] ), [Ventas], , DESC, Dense )`,
          nota: "Usa siempre DIVIDE(numerador, denominador) en lugar del operador / para evitar errores de división por cero cuando un producto no tuvo ventas el año anterior.",
        },
      ],
      alerta: {
        tipo: "tip",
        titulo: "Aplica formato de moneda y porcentaje a cada medida",
        texto:
          "Selecciona cada medida en el panel Datos y define su formato en Herramientas de medición: $ #,##0 sin decimales para Ventas, Ventas AA y Ticket Promedio; 0,0% para Margen % y Var % AA.",
      },
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-5",
        alt: "Barra de fórmulas DAX en Power BI Desktop mostrando la medida Var % AA y el panel Datos con la tabla _Medidas",
        caption:
          "Tabla _Medidas centralizada con formato de moneda chilena y porcentajes aplicados en cada métrica.",
        ratio: "16/9",
      },
    },
    {
      id: "visuales-diseno",
      titulo: "6. Elegir los visuales correctos y aplicar un tema JSON",
      esPasoHowTo: true,
      resumenHowTo:
        "Selecciona el gráfico adecuado para cada KPI siguiendo principios de lectura rápida e importa un tema JSON corporativo.",
      parrafos: [
        "Con el modelo y las medidas listos, pasamos a la Vista de informe. Un dashboard profesional respeta una jerarquía visual clara: arriba van las tarjetas KPI con las cifras grandes y su variación respecto al año anterior; en el tercio medio, la evolución temporal y el comparativo por categoría; y en la parte inferior, una matriz o gráfico de barras con el detalle por producto o cliente.",
        "Evita los gráficos circulares con más de cuatro categorías, los efectos 3D y las etiquetas redundantes. Para mantener coherencia tipográfica y de colores sin configurar cada gráfico a mano, importa un archivo JSON de tema desde Ver > Temas > Explorar temas.",
      ],
      tabla: {
        caption: "Guía de selección de visuales según la pregunta de negocio.",
        encabezados: ["KPI o pregunta", "Visual recomendado", "Por qué funciona mejor"],
        filas: [
          [
            "Ventas totales, Margen % y Ticket promedio",
            "Tarjeta (nueva) o Tarjeta de KPI",
            "Muestra el número principal y la etiqueta de comparación AA de un vistazo.",
          ],
          [
            "Evolución mensual Ventas vs Ventas AA",
            "Gráfico de líneas o columnas agrupadas",
            "Facilita comparar tendencia actual y estacionalidad mes a mes.",
          ],
          [
            "Desempeño por Categoría o Vendedor",
            "Gráfico de barras horizontales",
            "Los nombres largos se leen sin rotar el texto y el largo codifica el monto.",
          ],
          [
            "Participación por Canal (2 a 3 canales)",
            "Gráfico de anillos o barra 100 % apilada",
            "Útil solo cuando hay pocas categorías y suma un 100 % claro.",
          ],
          [
            "Detalle Top N de Productos o Clientes",
            "Matriz con barras de datos",
            "Permite cruzar monto, margen % y variación AA en una misma fila.",
          ],
        ],
      },
      codigos: [
        {
          titulo: "Tema JSON básico (tema-ventas.json) para importar en Power BI",
          lenguaje: "json",
          codigo: `{
  "name": "Tema Corporativo Ventas",
  "dataColors": ["#0F4C81", "#2E86AB", "#F18F01", "#C73E1D", "#6B7280"],
  "background": "#F8FAFC",
  "foreground": "#0F172A",
  "tableAccent": "#0F4C81",
  "visualStyles": {
    "*": {
      "*": {
        "background": [{ "color": { "solid": { "color": "#FFFFFF" } } }],
        "border": [{ "show": true, "color": { "solid": { "color": "#E2E8F0" } }, "radius": 8 }]
      }
    }
  }
}`,
          nota: "Guarda este bloque en un archivo .json con codificación UTF-8 e impórtalo en Ver > Temas > Explorar temas.",
        },
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-6",
        alt: "Lienzo de Power BI Desktop con tarjetas KPI arriba, gráfico de líneas mensual y barras horizontales aplicando el tema JSON azul corporativo",
        caption:
          "Diseño de lienzo con tarjetas blancas redondeadas sobre fondo gris suave (#F8FAFC) y paleta uniforme.",
        ratio: "16/9",
      },
    },
    {
      id: "interacciones-drillthrough",
      titulo: "7. Configurar segmentadores, interacciones y drill-through",
      esPasoHowTo: true,
      resumenHowTo:
        "Añade filtros de año, categoría y región, ajusta el filtrado cruzado y crea una página de obtención de detalles (drill-through).",
      parrafos: [
        "Lo que distingue a un dashboard de Power BI frente a una imagen estática es la exploración interactiva. Agrega en la parte superior o izquierda tres segmentadores clave: Año (desde la tabla Calendario), Categoría (desde Productos) y Región o Canal (desde Clientes). Usa el estilo menú desplegable para ahorrar espacio en pantalla.",
        "Revisa cómo interactúan los gráficos entre sí desde Formato > Editar interacciones. Por defecto, hacer clic en una barra resalta parcialmente los otros gráficos; en la mayoría de los tableros ejecutivos conviene cambiar esa opción a Filtrar (ícono de embudo) para que las tarjetas y tendencias muestren exactamente el subconjunto seleccionado.",
        "Finalmente, crea una segunda página llamada Detalle Cliente. Arrastra Clientes[RazonSocial] al pozo de Obtención de detalles (Drill-through) en el panel Visualizaciones. Agrega en esa página una tabla con las boletas, productos comprados y margen de ese cliente. Así, cualquier usuario podrá hacer clic derecho sobre un cliente en el resumen principal y saltar directo a su historial completo.",
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-7",
        alt: "Menú contextual en Power BI mostrando la opción Obtener detalles hacia la página Detalle Cliente",
        caption:
          "Drill-through configurado: clic derecho sobre cualquier cliente para inspeccionar sus facturas individuales.",
        ratio: "16/9",
      },
    },
    {
      id: "publicar-compartir",
      titulo: "8. Publicar en Power BI Service y automatizar actualizaciones",
      esPasoHowTo: true,
      resumenHowTo:
        "Guarda el archivo .pbix, publícalo en un área de trabajo de Power BI Service y configura la actualización programada.",
      parrafos: [
        "Cuando el tablero esté validado frente a tus cifras de Excel, guarda el archivo como dashboard-ventas.pbix. Haz clic en Inicio > Publicar, inicia sesión con tu cuenta organizacional y selecciona el área de trabajo de destino (evita publicar reportes de equipo dentro de Mi área de trabajo personal).",
        "En el servicio web de Power BI podrás generar un enlace seguro para el equipo, configurar permisos de lectura o incrustar el informe en Microsoft Teams. Si tu archivo Excel vive en OneDrive o SharePoint de la empresa, ni siquiera necesitarás instalar una puerta de enlace para programar actualizaciones diarias automáticas.",
        "Si el archivo sigue en una carpeta local o en un servidor interno, el siguiente paso natural es configurar la puerta de enlace y la actualización automática siguiendo nuestra guía de automatizar reportes con Power BI (/guias/automatizar-reportes-con-power-bi).",
      ],
      captura: {
        id: "dashboard-de-ventas-en-power-bi-paso-a-paso-paso-8",
        alt: "Cuadro de diálogo Publicar en Power BI Desktop seleccionando el área de trabajo Comercial",
        caption:
          "Publicación directa desde Power BI Desktop hacia el área de trabajo compartida en la nube.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Los meses aparecen ordenados alfabéticamente (Abril, Agosto, Diciembre...)",
      causa:
        "La columna Mes es texto y Power BI no sabe que Abril corresponde al mes 4.",
      solucion:
        "En la vista de datos, selecciona la columna Mes de tu tabla Calendario, ve a Herramientas de columnas > Ordenar por columna y elige MesNum.",
    },
    {
      error: "La medida Ventas AA devuelve en blanco para todos los meses",
      causa:
        "La tabla Calendario no está marcada como tabla de fechas o no cubre de forma continua todos los días del año anterior.",
      solucion:
        "Asegúrate de que Calendario tenga fechas continuas del 1 de enero al 31 de diciembre sin saltos, márcala como tabla de fechas y usa Calendario[Date] dentro de SAMEPERIODLASTYEAR.",
    },
    {
      error: "No puedo crear la relación 1 a muchos entre Productos y Ventas",
      causa:
        "Existen códigos IdProducto duplicados o valores nulos en la tabla de dimensión Productos.",
      solucion:
        "Vuelve a Power Query, selecciona IdProducto en la consulta Productos, elimina filas en blanco y aplica Quitar duplicados.",
    },
    {
      error: "Al dividir Ventas sobre Costo o Ventas AA aparece el texto Infinito o NaN",
      causa:
        "Se usó el operador matemático / y hubo filas con denominador igual a cero.",
      solucion:
        "Reemplaza la barra por la función DIVIDE(numerador, denominador, 0) para controlar el cero de forma limpia.",
    },
    {
      error: "Los montos de Excel entran como texto y no se dejan sumar",
      causa:
        "El archivo Excel tiene separadores de miles o decimales distintos a la configuración regional del equipo.",
      solucion:
        "En Power Query, usa Cambiar tipo > Usar configuración regional y selecciona el idioma de origen del archivo antes de cerrar y aplicar.",
    },
  ],
  plantilla: {
    titulo: "Plantilla descargable: Dashboard de Ventas + Excel de práctica",
    descripcion:
      "Próximamente podrás descargar aquí el archivo .pbix terminado, el libro Excel ficticio ventas_demo.xlsx y el tema JSON corporativo listo para adaptar a tu empresa.",
  },
  faqs: [
    {
      q: "¿Necesito pagar licencia para hacer este dashboard de ventas?",
      a: "No para construirlo. Power BI Desktop es gratuito en Windows y te permite conectar Excel, modelar, escribir DAX y diseñar el tablero completo. Solo necesitas licencia de pago (como Power BI Pro o capacidad Fabric) cuando quieras compartir el informe de forma privada en la nube con otros usuarios.",
    },
    {
      q: "¿Puedo conectar varios archivos de Excel mensuales en lugar de uno solo?",
      a: "Sí. En lugar de usar el conector Libro de Excel, usa Obtener datos > Carpeta. Power Query combinará automáticamente todos los archivos .xlsx que deposites en esa carpeta cada mes, siempre que mantengan los mismos nombres de columnas.",
    },
    {
      q: "¿Por qué no dejar todo en una sola tabla plana como en una tabla dinámica de Excel?",
      a: "Una tabla plana funciona en datasets pequeños, pero duplica textos millones de veces, vuelve lento el archivo y hace muy difíciles las comparaciones temporales con DAX. El modelo estrella reduce el peso del archivo y evita errores de totales.",
    },
    {
      q: "¿Qué hago si mis ventas vienen de un ERP o SQL Server en vez de Excel?",
      a: "La lógica del modelo estrella y las medidas DAX es exactamente la misma. Solo cambia el origen en Power Query usando el conector de SQL Server o la base de datos de tu ERP, manteniendo los mismos nombres de columnas finales.",
    },
    {
      q: "¿Cómo protejo que cada vendedor vea solo sus propias ventas?",
      a: "Debes configurar Seguridad a nivel de fila (RLS) en Power BI Desktop creando un rol sobre la tabla Clientes o Vendedores con la expresión [CorreoVendedor] = USERPRINCIPALNAME(), y luego asignar los correos en Power BI Service.",
    },
  ],
  relacionadas: [
    "tabla-calendario-power-bi-dax",
    "automatizar-reportes-con-power-bi",
    "control-de-ventas-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Referencia oficial de DAX",
      url: "https://learn.microsoft.com/es-es/dax/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Guía de esquema en estrella para Power BI",
      url: "https://learn.microsoft.com/es-es/power-bi/guidance/star-schema",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Funciones DAX más importantes",
      href: "/guias/funciones-dax-mas-importantes",
      descripcion: "Profundiza en CALCULATE, DIVIDE, SAMEPERIODLASTYEAR y RANKX.",
    },
    {
      label: "Plantilla Dashboard de Ventas en Power BI",
      href: "/plantillas/dashboard-ventas-power-bi",
      descripcion: "Revisa la estructura base y KPIs incluidos en nuestra plantilla.",
    },
  ],
};

export default guia;
