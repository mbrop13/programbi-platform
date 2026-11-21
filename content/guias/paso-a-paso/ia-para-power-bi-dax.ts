import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-power-bi-dax",
  title: "IA para Power BI: crea DAX y dashboards con ChatGPT o Claude",
  meta: "Usa ChatGPT, Claude o Gemini para escribir DAX, transformar datos en Power Query y diseñar dashboards en Power BI. Prompts probados y cómo validarlos.",
  h1: "Cómo usar IA para Power BI: DAX, Power Query y diseño",
  subtitle:
    "Flujo completo para acelerar el desarrollo de modelos en Power BI con ChatGPT, Claude, Gemini o Copilot: cómo entregar el esquema de tu modelo sin filtrar datos, escribir y auditar medidas DAX, transformar en lenguaje M y generar temas JSON válidos.",
  keywordPrincipal: "ia para power bi",
  keywords: [
    "ia para power bi",
    "mejor IA para Power BI",
    "IA para DAX",
    "ChatGPT Power BI",
    "Claude Power BI",
  ],
  curso: "power-bi",
  herramienta: "IA",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  esInsignia: true,
  esGuiaIA: true,
  avisoPrivacidad:
    "No subas archivos .pbix con datos reales ni pegues tablas de clientes, RUT, sueldos o márgenes confidenciales en chats web de IA. Para obtener DAX o Power Query exacto, la IA solo necesita los nombres de tus tablas, columnas, tipos de dato y cardinalidad de relaciones; nunca necesita los registros reales del negocio.",
  en30Segundos: {
    queLogras:
      "Construir medidas DAX robustas, scripts de Power Query (M) sin errores de plegado y temas visuales JSON válidos apoyándote en IA generativa, sabiendo exactamente cómo detectar y corregir los fallos clásicos de contexto de filtro.",
    herramienta: "Power BI Desktop + ChatGPT / Claude / Gemini / Copilot",
    tiempo: "35 minutos",
    bullets: [
      "Elegir la IA adecuada según trabajes en DAX complejo, Power Query M, temas JSON o Copilot nativo.",
      "Exportar únicamente el esquema del modelo (tablas, columnas y relaciones) sin exponer datos sensibles.",
      "Detectar por qué una medida DAX generada por IA falla en totales o comparaciones interanuales y corregirla con CALCULATE, DIVIDE y SAMEPERIODLASTYEAR.",
      "Generar un archivo de tema JSON válido para importar en Power BI Desktop sin errores de sintaxis.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Qué IA usar",
      resumen: "Compara ChatGPT, Claude, Gemini y Copilot por tarea.",
      anchorId: "que-ia-usar",
      icono: "sparkles",
    },
    {
      numero: 2,
      titulo: "Contexto del modelo",
      resumen: "Entrega esquema y relaciones sin exponer filas reales.",
      anchorId: "dar-contexto-modelo",
      icono: "shield",
    },
    {
      numero: 3,
      titulo: "DAX y validación",
      resumen: "Detecta errores clásicos y corrige medidas paso a paso.",
      anchorId: "dax-con-ia",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Power Query M",
      resumen: "Escribe transformaciones limpias y entiende folding.",
      anchorId: "power-query-con-ia",
      icono: "database",
    },
    {
      numero: 5,
      titulo: "Diseño y tema JSON",
      resumen: "Define layout ejecutivo y genera un JSON importable.",
      anchorId: "diseno-tema-json",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Copilot y errores",
      resumen: "Cuándo usar IA integrada y qué fallos evitar en DAX.",
      anchorId: "ia-en-power-bi-copilot",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Power BI Desktop (Windows) + acceso a ChatGPT, Claude, Gemini o Copilot",
    lista: [
      "Power BI Desktop instalado en Windows con un modelo estrella básico (por ejemplo, tabla de hechos Ventas y dimensiones Calendario, Clientes y Productos).",
      "Vista de modelo o herramienta externa/DMV básica para copiar nombres de tablas y columnas sin copiar filas de datos.",
      "Cuenta activa en el asistente de IA de tu preferencia (ChatGPT, Claude o Gemini; para Copilot nativo revisa los requisitos de capacidad Fabric según la documentación oficial de Microsoft Learn, consultado el 21 de noviembre de 2026).",
    ],
    compatibilidadMacWeb:
      "La edición de modelos, medidas DAX, consultas Power Query M e importación de archivos de tema JSON requiere Power BI Desktop en Windows. Los prompts pueden ejecutarse desde cualquier navegador en Mac, Windows o Linux, y los informes ya publicados funcionan en Power BI Service desde cualquier sistema operativo.",
  },
  herramientasHowTo: ["Power BI Desktop", "Asistente de IA (Claude / ChatGPT / Gemini)", "Editor de DAX y Power Query"],
  insumosHowTo: ["Esquema de modelo estrella anonimizado", "Tabla Calendario marcada como fecha"],
  secciones: [
    {
      id: "que-ia-usar",
      titulo: "1. Qué IA usar para cada tarea en Power BI",
      parrafos: [
        "No todas las herramientas de inteligencia artificial rinden igual dentro del ecosistema de Power BI. Mientras un modelo generalista como ChatGPT o Claude brilla al razonar sobre contexto de evaluación en DAX, refactorizar funciones en lenguaje M o redactar un archivo JSON de paleta corporativa, Microsoft Copilot juega con ventaja cuando necesitas operar directamente sobre el lienzo del informe o resumir un modelo ya publicado en Power BI Service.",
        "Antes de abrir un chat, define qué tipo de entregable buscas. Si estás atascado en una medida que mezcla filtros de varias tablas o necesitas explicar por qué un total general no coincide con la suma de las filas, conviene usar un modelo con alta capacidad de razonamiento paso a paso y ventana de contexto amplia para entregarle el esquema completo del modelo. Si solo quieres acelerar la creación inicial de páginas visuales dentro de tu espacio de trabajo corporativo con capacidad Fabric habilitada, Copilot te ahorra el ir y venir entre pestañas.",
        "También vale considerar la integración directa mediante protocolos modernos como MCP (Model Context Protocol) cuando trabajas en escritorio, tema que puedes revisar en nuestra guía sobre MCP para Power BI y Claude, o profundizar en nuestra comparativa general de Claude vs ChatGPT para análisis de datos.",
      ],
      tabla: {
        caption: "Comparativa práctica de asistentes de IA según la tarea en Power BI",
        encabezados: [
          "Tarea en Power BI",
          "Asistente recomendado",
          "Fortaleza principal",
          "Limitación que debes vigilar",
        ],
        filas: [
          [
            "Medidas DAX complejas (Time Intelligence, contexto de filtro)",
            "Claude o ChatGPT",
            "Explican paso a paso CALCULATE, transiciones de contexto y variables VAR/RETURN",
            "Pueden asumir relaciones que no existen si no entregas el esquema exacto",
          ],
          [
            "Transformaciones Power Query (lenguaje M)",
            "Claude o ChatGPT",
            "Generan funciones reutilizables y pasos encadenados sin depender de clics",
            "A veces proponen pasos que rompen el Query Folding hacia SQL Server",
          ],
          [
            "Temas JSON corporativos y layout de dashboard",
            "ChatGPT, Claude o Gemini",
            "Crean estructuras JSON válidas con paleta hex, tipografía y tarjetas consistentes",
            "Pueden incluir propiedades obsoletas o inventar nombres de claves visuales",
          ],
          [
            "Crear páginas de informe y resúmenes dentro del servicio",
            "Copilot en Power BI",
            "Lee el modelo semántico directamente sin salir de Power BI ni copiar código",
            "Requiere capacidad Fabric paga y preparación previa del modelo semántico",
          ],
        ],
      },
    },
    {
      id: "dar-contexto-modelo",
      titulo: "2. Dar contexto del modelo a la IA sin filtrar datos",
      esPasoHowTo: true,
      resumenHowTo:
        "Documenta en texto plano las tablas, columnas, tipos de dato y relaciones de tu modelo estrella para que la IA escriba DAX exacto sin ver datos reales.",
      parrafos: [
        "El error número uno al pedir DAX a una IA es escribir: «Dame una medida para calcular las ventas del mismo mes del año pasado». Sin saber cómo se llama tu tabla de hechos, si tu tabla calendario está marcada como tabla de fechas o si la relación entre ambas es activa, la IA inventará nombres genéricos como Sales[Date] que luego tendrás que editar uno por uno, aumentando el riesgo de introducir errores.",
        "La solución profesional consiste en mantener un pequeño bloque de contexto del esquema (schema prompt) en un archivo de texto local. Ese bloque no contiene ni una sola fila de ventas, ningún RUT, ningún nombre de cliente ni ningún monto real: solo enumera la arquitectura del modelo estrella, la dirección de los filtros y la granularidad de cada tabla.",
        "Si tu modelo tiene más de diez tablas, no pegues las cincuenta columnas de una tabla maestra que no intervienen en el cálculo. Entrega únicamente las tablas involucradas en el KPI que quieres construir, indicando explícitamente qué columnas son claves primarias o foráneas y cuál es la columna de fecha continua de tu tabla Calendario.",
      ],
      lista: [
        "Indica la tabla de hechos y su granularidad (por ejemplo: una fila por línea de boleta o factura).",
        "Especifica las dimensiones conectadas y su cardinalidad (por ejemplo: Calendario[Date] 1 -> * Ventas[Fecha]).",
        "Aclara si la tabla Calendario cubre años completos sin huecos y está marcada como tabla de fechas oficial.",
        "Menciona las medidas base ya existentes (por ejemplo, [Venta Neta] = SUM(Ventas[MontoNeto])) para que la IA las reutilice en lugar de repetir agregaciones.",
      ],
      codigos: [
        {
          titulo: "Prompt para fijar el contexto del modelo sin exponer datos",
          lenguaje: "prompt",
          codigo: `Trabaja como arquitecto senior de Power BI y DAX.
Usa EXCLUSIVAMENTE este esquema de modelo estrella (no inventes tablas ni columnas):
- Tabla de hechos: Ventas (Fecha, SucursalID, ProductoID, ClienteID, Unidades, MontoNeto, CostoTotal)
- Dimensión Calendario (marcada como tabla de fechas): Date, Anio, MesNum, MesNombre, Trimestre
- Dimensión Productos: ProductoID, Categoria, Subcategoria
- Dimensión Sucursales: SucursalID, Region, NombreSucursal
Relaciones activas (dirección única 1:*):
- Calendario[Date] -> Ventas[Fecha]
- Productos[ProductoID] -> Ventas[ProductoID]
- Sucursales[SucursalID] -> Ventas[SucursalID]
Medidas base ya creadas:
- [Venta Neta] = SUM(Ventas[MontoNeto])
- [Costo Total] = SUM(Ventas[CostoTotal])

Confirma que entendiste el modelo y espera mi primer pedido de medida DAX.`,
        },
      ],
      captura: {
        id: "ia-para-power-bi-dax-paso-1",
        alt: "Vista de modelo en Power BI Desktop mostrando modelo estrella con Calendario, Productos, Sucursales y Ventas",
        caption:
          "Describe exactamente las relaciones 1 a muchos de tu vista de modelo antes de pedir cualquier fórmula DAX.",
        ratio: "16/9",
      },
      verificaResultado:
        "Asegúrate de que en tu prompt de contexto no haya valores de ejemplo reales de clientes ni montos confidenciales; basta con nombres de tablas, columnas y tipos de datos.",
    },
    {
      id: "dax-con-ia",
      titulo: "3. Escribir medidas DAX con IA y validarlas",
      esPasoHowTo: true,
      resumenHowTo:
        "Pide medidas usando variables VAR/RETURN y funciones seguras como DIVIDE, y aprende a detectar errores típicos de contexto de filtro generados por IA.",
      parrafos: [
        "Una vez entregado el esquema, pide las medidas de a una o en grupos pequeños exigiendo el uso de variables VAR y RETURN. Las variables en DAX hacen dos cosas muy valiosas cuando trabajas con IA: vuelven el código legible para auditarlo en treinta segundos y evitan que la expresión se evalúe dos veces dentro de una división o una comparación condicional.",
        "Sin embargo, incluso con un buen prompt, los modelos de lenguaje cometen errores recurrentes en DAX porque mezclan patrones de Excel con lógica tabular. Un fallo clásico ocurre al pedir variaciones interanuales o porcentajes condicionales: la IA puede usar división directa con la barra diagonal sin proteger denominadores en cero, aplicar funciones de Inteligencia de Tiempo sobre la columna de hechos Ventas[Fecha] en lugar de Calendario[Date], o envolver mal un filtro dentro de CALCULATE sin respetar el contexto actual.",
        "Observa el siguiente contraste didáctico. Primero verás un patrón defectuoso típico que suele aparecer en respuestas rápidas cuando el prompt no es estricto; luego verás la versión corregida con CALCULATE, DIVIDE y SAMEPERIODLASTYEAR sobre la tabla calendario oficial. Si quieres repasar la teoría detrás de cada función, revisa nuestra guía de funciones DAX más importantes.",
      ],
      codigos: [
        {
          titulo: "Prompt para generar medidas interanuales auditables",
          lenguaje: "prompt",
          codigo: `Sobre el esquema anterior, crea dos medidas DAX en formato limpio usando VAR y RETURN:
1) [Venta Anio Anterior]: calcula [Venta Neta] para el mismo período del año anterior usando Calendario[Date].
2) [Variacion YoY %]: calcula el crecimiento porcentual frente al año anterior usando DIVIDE y devolviendo BLANK() si no hay venta en el año anterior.
Explica brevemente cómo se comporta cada medida en la fila de Total de una matriz.`,
        },
        {
          titulo: "Ejemplo didáctico de error típico generado por IA (NO usar en producción)",
          lenguaje: "dax",
          codigo: `// EJEMPLO DIDÁCTICO CON ERRORES TÍPICOS DE IA — NO USAR
Variacion YoY Defectuosa =
VAR VentaActual = SUM(Ventas[MontoNeto])
VAR VentaAnterior = CALCULATE(SUM(Ventas[MontoNeto]), SAMEPERIODLASTYEAR(Ventas[Fecha]))
RETURN
(VentaActual - VentaAnterior) / VentaAnterior`,
          nota: "Falla por tres razones: referencia Ventas[Fecha] en vez de Calendario[Date], usa división directa que arroja Infinito/NaN cuando VentaAnterior es 0 y no reutiliza la medida base [Venta Neta].",
        },
        {
          titulo: "Medida DAX corregida y validada para producción",
          lenguaje: "dax",
          codigo: `Venta Anio Anterior =
CALCULATE(
    [Venta Neta],
    SAMEPERIODLASTYEAR(Calendario[Date])
)

Variacion YoY % =
VAR _VentaActual = [Venta Neta]
VAR _VentaAnterior = [Venta Anio Anterior]
VAR _Diferencia = _VentaActual - _VentaAnterior
RETURN
IF(
    NOT ISBLANK(_VentaActual) && NOT ISBLANK(_VentaAnterior),
    DIVIDE(_Diferencia, _VentaAnterior)
)`,
          nota: "Usa la columna continua Calendario[Date], protege divisiones por cero con DIVIDE y evita mostrar -100% en meses futuros sin ventas.",
        },
      ],
      captura: {
        id: "ia-para-power-bi-dax-paso-2",
        alt: "Matriz en Power BI Desktop validando Venta Neta, Venta Anio Anterior y Variacion YoY % por mes",
        caption:
          "Valida siempre la medida DAX en una matriz simple por Año y Mes antes de llevarla a tarjetas o gráficos.",
        ratio: "16/9",
      },
      verificaResultado:
        "Crea una matriz de prueba con Calendario[Anio] y Calendario[MesNombre] en filas. Verifica manualmente dos meses consecutivos y el total anual para confirmar que [Venta Anio Anterior] coincide con el total del año previo.",
    },
    {
      id: "power-query-con-ia",
      titulo: "4. Power Query M con IA: limpieza sin perder rendimiento",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera pasos limpios en lenguaje M para normalizar columnas, manejar errores de tipo y evitar transformaciones que rompan el plegado de consultas.",
      parrafos: [
        "El editor de Power Query es un candidato ideal para trabajar con IA porque muchas transformaciones repetitivas —como limpiar textos de múltiples columnas, crear columnas condicionales con manejo de nulos o desdinamizar encabezados de meses— se resuelven en tres líneas de lenguaje M si sabes qué función pedir.",
        "Cuando le pidas código M a ChatGPT o Claude, pega el fragmento del Editor Avanzado alrededor del paso donde quieres intervenir (especialmente el nombre exacto del paso anterior, por ejemplo #\"Tipo cambiado\"). Si no entregas el nombre del último paso, el código que devuelva la IA fallará al pegarlo porque hará referencia a una variable inexistente.",
        "Un aspecto crítico al conectar bases SQL Server o PostgreSQL es el Query Folding (plegado de consultas). Si la IA te sugiere usar funciones personalizadas fila a fila o Table.Buffer demasiado temprano, Power Query dejará de delegar el filtro al motor de base de datos y descargará millones de filas a tu computador. Pídele siempre que primero filtre filas y seleccione columnas antes de aplicar funciones de texto complejas.",
      ],
      codigos: [
        {
          titulo: "Prompt para agregar transformación limpia en lenguaje M",
          lenguaje: "prompt",
          codigo: `En Power Query (lenguaje M), mi consulta termina en el paso #"Tipo cambiado" con las columnas: Fecha (date), Sucursal (text), MontoNeto (number) y Estado (text).
Necesito agregar dos pasos:
1) Limpiar espacios extra y pasar a mayúsculas iniciales la columna Sucursal, manejando posibles valores null sin error.
2) Filtrar para conservar solo filas donde Estado sea "Emitida" y MontoNeto sea mayor que 0.
Devuelve únicamente los dos pasos nuevos listos para insertar antes de la cláusula "in", respetando la referencia #"Tipo cambiado".`,
        },
        {
          titulo: "Pasos en lenguaje M revisados para insertar en Editor Avanzado",
          lenguaje: "m",
          codigo: `    #"Sucursal normalizada" = Table.TransformColumns(
        #"Tipo cambiado",
        {{"Sucursal", each if _ = null then null else Text.Proper(Text.Trim(_)), type text}}
    ),
    #"Filas válidas" = Table.SelectRows(
        #"Sucursal normalizada",
        each [Estado] = "Emitida" and [MontoNeto] <> null and [MontoNeto] > 0
    )`,
          nota: "Recuerda actualizar la línea final después de 'in' para que apunte a #\"Filas válidas\".",
        },
      ],
      captura: {
        id: "ia-para-power-bi-dax-paso-3",
        alt: "Editor avanzado de Power Query mostrando los pasos Sucursal normalizada y Filas válidas en lenguaje M",
        caption:
          "En el Editor Avanzado, confirma que el nombre después de 'in' coincida exactamente con el último paso agregado.",
        ratio: "16/9",
      },
      verificaResultado:
        "Haz clic derecho sobre el último paso en Power Query y revisa si la opción «Ver consulta nativa» sigue disponible cuando trabajas contra SQL; luego confirma en la vista previa que no queden celdas con Error.",
    },
    {
      id: "diseno-tema-json",
      titulo: "5. Diseño del dashboard: layout y tema JSON válido",
      esPasoHowTo: true,
      resumenHowTo:
        "Solicita una propuesta de grilla visual y genera un archivo de tema .json con sintaxis verificada para estandarizar colores y tipografías en un clic.",
      parrafos: [
        "Además del cálculo, la IA ayuda muchísimo a acelerar el acabado visual de un reporte. Muchos analistas pierden horas ajustando manualmente tamaños de fuente, bordes redondeados y colores de tarjetas en cada página. Con un tema JSON bien estructurado, defines la identidad visual una sola vez y la importas desde Ver > Temas > Explorar temas.",
        "Antes de pedir el JSON, pídele a la IA una propuesta de arquitectura de página en tres zonas: cabecera con título, fecha de actualización y segmentadores globales; fila superior con máximo cuatro tarjetas de KPI principales; y cuerpo central con dos o tres gráficos complementarios (tendencia temporal, desglose por categoría y tabla de detalle accionable).",
        "Cuando generes el archivo JSON, valida siempre su sintaxis antes de importarlo a Power BI Desktop. Basta una coma sobrante al final de un objeto o una comilla mal cerrada para que Power BI rechace el archivo completo con un mensaje genérico.",
      ],
      codigos: [
        {
          titulo: "Prompt para generar tema JSON corporativo limpio",
          lenguaje: "prompt",
          codigo: `Genera un archivo de tema JSON válido para Power BI Desktop con estilo sobrio corporativo.
Requisitos:
- Nombre del tema: "Corporativo Claro 2026"
- Paleta dataColors con 6 colores hexadecimales con alto contraste (azul marino, azul medio, verde esmeralda, ámbar, gris pizarra, terracota).
- Fondo de página #F8FAFC y fondo de visuales #FFFFFF.
- Tipografía Segoe UI, títulos en #0F172A y etiquetas en #475569.
- Borde sutil #E2E8F0 con radio de esquina de 8 px para tarjetas y gráficos.
Entrega únicamente el JSON válido sin comentarios.`,
        },
        {
          titulo: "Tema JSON válido listo para guardar como tema-powerbi.json",
          lenguaje: "json",
          codigo: `{
  "name": "Corporativo Claro 2026",
  "dataColors": [
    "#0F3D5E",
    "#2563EB",
    "#059669",
    "#D97706",
    "#64748B",
    "#DC2626"
  ],
  "background": "#FFFFFF",
  "foreground": "#0F172A",
  "tableAccent": "#0F3D5E",
  "textClasses": {
    "title": {
      "fontFace": "Segoe UI Semibold",
      "fontSize": 12,
      "color": "#0F172A"
    },
    "label": {
      "fontFace": "Segoe UI",
      "fontSize": 10,
      "color": "#475569"
    },
    "callout": {
      "fontFace": "Segoe UI Bold",
      "fontSize": 26,
      "color": "#0F172A"
    }
  },
  "visualStyles": {
    "*": {
      "*": {
        "background": [
          {
            "color": { "solid": { "color": "#FFFFFF" } },
            "transparency": 0
          }
        ],
        "border": [
          {
            "show": true,
            "color": { "solid": { "color": "#E2E8F0" } },
            "radius": 8
          }
        ]
      }
    },
    "page": {
      "*": {
        "background": [
          {
            "color": { "solid": { "color": "#F8FAFC" } },
            "transparency": 0
          }
        ]
      }
    }
  }
}`,
        },
      ],
      captura: {
        id: "ia-para-power-bi-dax-paso-4",
        alt: "Importación exitosa de tema JSON en Power BI Desktop desde la pestaña Ver > Temas",
        caption:
          "Importa el archivo .json desde Ver > Temas > Explorar temas para aplicar tipografía, paleta y bordes a todas las páginas.",
        ratio: "16/9",
      },
      verificaResultado:
        "Al importar el archivo .json en Power BI Desktop debe aparecer el aviso «El tema se importó correctamente». Si aparece error de esquema, valida el JSON eliminando comas finales o propiedades no soportadas.",
    },
    {
      id: "ia-en-power-bi-copilot",
      titulo: "6. IA dentro de Power BI: Copilot",
      parrafos: [
        "Si tu organización trabaja en el ecosistema Microsoft Fabric, no siempre necesitas copiar y pegar prompts en herramientas externas. Copilot integrado en Power BI permite crear páginas de informe completas, redactar narrativas ejecutivas que responden a los filtros del usuario y sugerir medidas DAX directamente desde la vista de consulta DAX.",
        "Según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026), el uso de Copilot exige que el área de trabajo esté asignada a una capacidad paga de Microsoft Fabric (F2 o superior, o Premium P1 o superior; las capacidades de prueba no están habilitadas para Copilot) y que el administrador del inquilino haya activado la opción correspondiente en el portal de administración. Si quieres revisar en detalle la configuración, licenciamiento y casos de uso dentro de la interfaz, consulta nuestra guía dedicada a Copilot en Power BI.",
      ],
      lista: [
        "Usa Copilot nativo cuando el modelo ya esté limpio y quieras acelerar la creación de visuales o resúmenes narrativos para usuarios finales.",
        "Usa Claude o ChatGPT cuando estés diseñando arquitectura, depurando DAX avanzado, escribiendo scripts largos en Power Query M o armando temas JSON personalizados.",
        "En ambos casos, prepara nombres claros de columnas, oculta claves técnicas y agrega descripciones en el modelo semántico: tanto los analistas como la IA trabajan mejor sobre modelos ordenados.",
      ],
    },
    {
      id: "errores-tipicos-dax-ia",
      titulo: "7. Errores típicos del DAX generado por IA",
      parrafos: [
        "Incluso los mejores modelos de lenguaje caen en trampas repetidas cuando escriben DAX sin supervisión humana. Conocer estos cinco patrones de fallo te permite auditar cualquier código generado en menos de un minuto.",
      ],
      lista: [
        "Confundir columnas calculadas con medidas: la IA a veces escribe expresiones de fila (como Ventas[Monto] * 1.19) sin función agregadora ni SUMX cuando en realidad pediste una medida dinámica.",
        "Pasar filtros complejos de tabla completa dentro de CALCULATE: escribir FILTER(Ventas, ...) sobre toda la tabla de hechos en lugar de filtrar la columna específica o la tabla de dimensión destruye el rendimiento en modelos grandes.",
        "Usar fechas de la tabla de hechos en Time Intelligence: aplicar TOTALYTD o SAMEPERIODLASTYEAR sobre Ventas[Fecha] en lugar de Calendario[Date] produce totales incompletos cuando hay días sin ventas.",
        "Ignorar el orden de evaluación en totales de matriz: cuando la medida usa IF o divisiones sin iterador, el total general evalúa la fórmula sobre el agregado total en lugar de sumar las filas visibles; si necesitas sumar fila a fila, debes usar SUMX.",
        "Inventar funciones de Excel o SQL en DAX: ocasionalmente aparecen nombres inexistentes o sintaxis de VLOOKUP/CASE WHEN en lugar de LOOKUPVALUE o SWITCH.",
      ],
      codigos: [
        {
          titulo: "Prompt para auditar y corregir una medida DAX que falla en totales",
          lenguaje: "prompt",
          codigo: `Revisa esta medida DAX que no cuadra en la fila Total de una matriz por Categoría:
[Pega aquí tu medida actual]
Usando el esquema de modelo estrella ya entregado:
1) Explica qué está evaluando DAX en el contexto de filtro del Total general.
2) Reescríbela usando SUMX(VALUES(Productos[Categoria]), ...) si corresponde sumar por categoría, o dime si el total debe ser un promedio ponderado.
3) Evita usar FILTER() sobre la tabla de hechos completa.`,
        },
      ],
      verificaResultado:
        "Compara el total general de tu matriz contra la suma manual de las filas exportadas o contra una medida base de control para confirmar que el iterador SUMX resolvió la diferencia.",
    },
  ],
  erroresComunes: [
    {
      error: "La medida DAX generada por IA arroja error de sintaxis por comas o punto y coma",
      causa:
        "Tu Power BI Desktop está configurado con separador de lista punto y coma (;) por configuración regional de Chile, pero la IA entregó el código con comas (,).",
      solucion:
        "Pide en tu prompt que use el separador acorde a tu equipo o utiliza la vista de consulta DAX / formato automático para convertir separadores.",
    },
    {
      error: "El total de la matriz no coincide con la suma de las filas en una medida creada por IA",
      causa:
        "La IA escribió una lógica condicional o de multiplicación directa a nivel de medida sin envolver el cálculo por granularidad en SUMX(VALUES(...), ...).",
      solucion:
        "Pídele explícitamente a la IA: «Necesito que el total general sea la suma exacta de los valores mostrados por cada fila de Categoría usando SUMX».",
    },
    {
      error: "Power Query devuelve 'Token Eof expected' o 'No se reconoce el nombre' al pegar código M",
      causa:
        "El bloque copiado desde el chat no respetó el nombre exacto del paso anterior ni la referencia final después de 'in', o faltó una coma al final del paso previo.",
      solucion:
        "Pega siempre los 2 últimos pasos de tu Editor Avanzado en el prompt para que la IA mantenga exactamente los identificadores #\"Paso\".",
    },
    {
      error: "Power BI rechaza el tema JSON generado por la IA al importarlo",
      causa:
        "El JSON contiene comentarios // (no válidos en JSON estándar), comas finales sobrantes o claves de propiedades visuales inventadas.",
      solucion:
        "Exige «JSON estricto sin comentarios» y valídalo con JSON.parse o un validador antes de importarlo.",
    },
  ],
  plantilla: {
    titulo: "Pack de Prompts para Power BI + Tema JSON base",
    descripcion:
      "Próximamente podrás descargar aquí el archivo de texto con la plantilla de contexto de modelo estrella y el tema JSON corporativo listo para importar.",
  },
  faqs: [
    {
      q: "¿Cuál es la mejor IA para escribir código DAX complejo?",
      a: "Claude y ChatGPT suelen ofrecer las respuestas más sólidas en DAX cuando les entregas el esquema exacto del modelo estrella, las relaciones y las medidas base ya creadas. Más importante que la marca del modelo es darle el contexto de tablas y exigir variables VAR/RETURN.",
    },
    {
      q: "¿Necesito subir mi archivo .pbix completo para que la IA me ayude?",
      a: "No. De hecho, evitar subir el .pbix con datos reales protege la privacidad de tu empresa. Copia únicamente los nombres de tablas, columnas, tipos de dato y relaciones en texto plano para obtener medidas DAX o consultas M precisas.",
    },
    {
      q: "¿La IA reemplaza aprender modelado estrella y contexto de filtro?",
      a: "No. La IA acelera la escritura y propone alternativas, pero si no entiendes cómo fluyen los filtros desde las dimensiones hacia la tabla de hechos o por qué se requiere una tabla calendario continua, no podrás detectar cuándo una medida DAX está entregando un número equivocado.",
    },
    {
      q: "¿Puedo usar Copilot en Power BI con una licencia Power BI Pro individual?",
      a: "No basta solo con Power BI Pro. Según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026), Copilot requiere que el área de trabajo esté alojada en una capacidad paga de Microsoft Fabric (F2 o superior) o Power BI Premium (P1 o superior), además de habilitar la configuración de inquilino.",
    },
  ],
  relacionadas: [
    "copilot-en-power-bi",
    "mcp-power-bi-claude",
    "tabla-calendario-power-bi-dax",
  ],
  enlacesExternos: [
    {
      label: "Referencia de funciones DAX",
      url: "https://learn.microsoft.com/es-es/dax/dax-function-reference",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia de funciones de Power Query M",
      url: "https://learn.microsoft.com/es-es/powerquery-m/power-query-m-function-reference",
      fuente: "Microsoft Learn",
    },
    {
      label: "Usar temas de informe en Power BI Desktop",
      url: "https://learn.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Funciones DAX más importantes",
      href: "/guias/funciones-dax-mas-importantes",
      descripcion: "Repasa CALCULATE, SUMX, DIVIDE y Time Intelligence para auditar cualquier medida generada por IA.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Guía práctica para estructurar prompts de análisis y código con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa de rendimiento entre ambos asistentes para DAX, SQL, Excel y Python.",
    },
  ],
};

export default guia;
