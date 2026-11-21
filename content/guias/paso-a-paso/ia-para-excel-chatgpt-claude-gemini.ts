import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-excel-chatgpt-claude-gemini",
  title: "IA para Excel: cómo usar ChatGPT, Claude y Gemini (2026)",
  meta: "Usa ChatGPT, Claude y Gemini con Excel: crear fórmulas, limpiar datos, analizar tablas y escribir macros. Comparativa honesta y prompts listos para copiar.",
  h1: "Cómo usar IA en Excel: ChatGPT, Claude y Gemini paso a paso",
  subtitle:
    "Domina el trabajo diario con hojas de cálculo apoyándote en ChatGPT, Claude y Gemini: redacta fórmulas complejas en español sin errores de punto y coma, limpia bases sucias, genera macros VBA o código M de Power Query, conoce los complementos oficiales y protege tus datos confidenciales.",
  keywordPrincipal: "chatgpt excel",
  keywords: [
    "chatgpt excel",
    "claude excel",
    "gemini excel",
    "ia para excel",
    "ia gratis para excel",
    "automatizar excel con ia",
  ],
  curso: "excel",
  cursoSecundario: "ia-productividad",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  esInsignia: true,
  esGuiaIA: true,
  avisoPrivacidad:
    "Las planillas de gestión en Chile suelen contener RUT, remuneraciones, márgenes comerciales o datos de clientes. Antes de subir un libro .xlsx a ChatGPT, Claude o Gemini en cuentas personales gratuitas o de consumo, verifica tus controles de privacidad y desactiva el entrenamiento cuando corresponda, o utiliza un plan empresarial con exclusión contractual. Para pedir fórmulas, macros o Power Query, nunca necesitas subir el archivo completo: basta con describir los nombres de tus columnas o pegar 5 filas ficticias.",
  en30Segundos: {
    queLogras:
      "Elegir la IA adecuada para cada tarea de Excel, obtener fórmulas en español con punto y coma listas para pegar, analizar archivos .xlsx externos, generar código VBA o Power Query M y validar cada resultado antes de enviarlo.",
    herramienta: "Excel + ChatGPT / Claude / Gemini",
    tiempo: "30 minutos",
    bullets: [
      "Comparar de forma honesta ChatGPT, Claude, Gemini y Copilot en Excel según documentación oficial.",
      "Generar y depurar fórmulas reales (BUSCARX, SUMAR.SI.CONJUNTO, SI.CONJUNTO, INDICE/COINCIDIR) con toggle español/inglés.",
      "Subir un libro .xlsx para resumirlo o escribir código VBA y Power Query M sin partir desde cero.",
      "Instalar complementos oficiales desde Microsoft AppSource y proteger RUT y sueldos al trabajar con IA.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Alcance y comparativa",
      resumen: "Distingue qué resuelve la IA externa frente a Copilot nativo.",
      anchorId: "que-puede-hacer-ia-excel",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Fórmulas con prompts",
      resumen: "Pide fórmulas en español con `;` y depura errores comunes.",
      anchorId: "generar-explicar-formulas",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "Subir y analizar .xlsx",
      resumen: "Carga planillas limpias y audita totales por hoja.",
      anchorId: "subir-excel-analizar",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Complementos y tablas",
      resumen: "Explora AppSource oficial y diseña plantillas estructuradas.",
      anchorId: "complementos-tablas-plantillas",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "VBA, M y privacidad",
      resumen: "Genera macros o Power Query M cuidando datos sensibles.",
      anchorId: "vba-power-query-privacidad",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Excel 2016, 2021, 2024 o Microsoft 365 (Windows, Mac o Web) + cuenta gratuita o de pago en ChatGPT, Claude o Gemini",
    lista: [
      "Microsoft Excel instalado (o Excel para la Web) con idioma configurado en español o inglés.",
      "Acceso a al menos un asistente de IA: ChatGPT, Claude o Gemini en su versión web.",
      "Para macros VBA: Excel de escritorio en Windows o macOS (Excel Web no ejecuta el editor clásico de VBA).",
    ],
    compatibilidadMacWeb:
      "Las fórmulas generadas por IA funcionan en Excel para Windows, macOS y Excel Web siempre que respetes el idioma de funciones y el separador de argumentos (; en español regional de Chile/Latam, , en inglés). Power Query M avanzado y las macros VBA requieren la versión de escritorio.",
  },
  herramientasHowTo: ["Microsoft Excel", "ChatGPT", "Claude", "Google Gemini"],
  insumosHowTo: ["Libro .xlsx con estructura de tabla", "Prompts de fórmulas, limpieza, VBA y Power Query"],
  secciones: [
    {
      id: "que-puede-hacer-ia-excel",
      titulo: "1. Qué puede y qué no puede hacer la IA con Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Identifica qué tareas de Excel delegar a ChatGPT, Claude o Gemini y cuándo conviene usar Copilot integrado.",
      parrafos: [
        "Cuando buscas cómo usar IA en Excel, conviene separar dos mundos muy distintos: los asistentes externos en el navegador (ChatGPT, Claude y Gemini) y los asistentes integrados dentro de la cuadrícula (como Microsoft Copilot en Excel). Los primeros no ven tu libro abierto en tiempo real a menos que subas el archivo o pegues la estructura de columnas; el segundo vive dentro de la cinta de opciones, pero exige licencias específicas de Microsoft 365.",
        "En la práctica diaria de oficina en Chile, las herramientas externas gratuitas o de pago individual resuelven cerca del noventa por ciento de los cuellos de botella: traducir una regla de negocio en una fórmula anidada sin equivocarse de paréntesis, diagnosticar por qué un BUSCARV devuelve #N/D, redactar una macro VBA para exportar PDFs por sucursal o escribir los pasos en lenguaje M de Power Query.",
        "Lo que ninguna IA externa hace de forma mágica es actualizar tus conexiones locales a SQL Server, reparar referencias circulares ocultas en veinte hojas interconectadas sin ver todo el modelo, ni garantizar que una fórmula escrita en inglés funcione al pegarla directamente en un Excel configurado en español de Chile (donde además cambian los nombres de función y el punto y coma).",
        "Por eso, el secreto de productividad no está en pedirle «hazme el reporte entero», sino en darle contexto exacto de tu versión de Excel, idioma de interfaz, nombres de tabla y formato esperado de salida.",
      ],
      tabla: {
        caption:
          "Comparativa cualitativa de asistentes de IA para Excel (según documentación oficial de OpenAI, Anthropic, Google y Microsoft, consultado el 21 de noviembre de 2026).",
        encabezados: [
          "Criterio",
          "ChatGPT (OpenAI)",
          "Claude (Anthropic)",
          "Gemini (Google)",
          "Copilot en Excel (Microsoft)",
        ],
        filas: [
          [
            "Integración directa en Excel",
            "Externa (subir archivo o copiar fórmulas/código)",
            "Externa (subir archivo o crear descargables según ajustes)",
            "Externa para .xlsx; nativa dentro de Google Sheets",
            "Nativa en la cinta de opciones de Microsoft 365",
          ],
          [
            "Ejecución real de datos (.xlsx/.csv)",
            "Ejecuta Python (pandas/openpyxl) y devuelve archivos",
            "Lee hojas/CSV y ejecuta análisis cuando la función está activa",
            "Analiza archivos subidos o desde Google Drive",
            "Opera directo sobre Tablas de Excel seleccionadas",
          ],
          [
            "Fórmulas, VBA y Power Query M",
            "Muy sólido para fórmulas, VBA y scripts Python",
            "Destaca en código largo limpio (VBA, M y Office Scripts)",
            "Muy práctico para fórmulas y conversión hacia Sheets",
            "Genera columnas calculadas y tablas dinámicas en la hoja",
          ],
          [
            "Acceso gratuito de entrada",
            "Sí, con cuotas acotadas según plan Free",
            "Sí, con cuotas acotadas según plan Free",
            "Sí, en gemini.google.com con cuenta Google",
            "No incluido en cuentas gratuitas; requiere licencia elegible",
          ],
          [
            "Fuente oficial",
            "help.openai.com",
            "support.claude.com",
            "support.google.com/gemini",
            "learn.microsoft.com",
          ],
        ],
      },
      captura: {
        id: "ia-para-excel-chatgpt-claude-gemini-paso-1",
        ratio: "16/9",
        alt: "Vista comparativa de una hoja de Excel junto a un asistente de IA en el navegador generando una fórmula en español.",
        caption:
          "Flujo habitual sin licencia corporativa de Copilot: describes la estructura de tu Tabla de Excel y la IA devuelve la fórmula exacta en español.",
      },
      verificaResultado:
        "Antes de elegir herramienta, define tu tarea: si necesitas operar directamente sobre celdas seleccionadas dentro de Microsoft 365 corporativo usa Copilot; si necesitas diseñar fórmulas, depurar errores, escribir VBA/M o analizar un CSV puntual, ChatGPT, Claude o Gemini resuelven el problema desde el navegador.",
    },
    {
      id: "generar-explicar-formulas",
      titulo: "2. Generar y explicar fórmulas de Excel con prompts precisos",
      esPasoHowTo: true,
      resumenHowTo:
        "Redacta prompts que obliguen a la IA a respetar tu versión de Excel, el idioma español y el separador de punto y coma.",
      parrafos: [
        "El motivo número uno por el que una fórmula copiada desde ChatGPT, Claude o Gemini falla al pegarla en Excel en Chile es la mezcla de idiomas y separadores. Por defecto, los modelos suelen responder en inglés (`XLOOKUP`, `SUMIFS`, `IF`) y usando coma `,` entre argumentos, lo que provoca un error de sintaxis inmediato en un Excel configurado en español.",
        "La solución consiste en incluir siempre cuatro datos en tu prompt: versión de Excel (por ejemplo, Microsoft 365 o Excel 2019), idioma de las funciones (español), separador de listas (`;`) y rango o nombres exactos de columnas. A continuación tienes un prompt maestro y ocho casos reales con sus fórmulas verificadas tanto en español como en inglés.",
      ],
      codigos: [
        {
          titulo: "Prompt maestro para pedir cualquier fórmula de Excel sin errores de sintaxis",
          lenguaje: "prompt",
          codigo: `Necesito una fórmula para Microsoft Excel en español (configuración regional Chile: separador de argumentos punto y coma ";").
Versión que uso: Microsoft 365 (o indica Excel 2019/2021).
Estructura de mi hoja "Ventas":
- Columna A: Fecha (A2:A500)
- Columna B: Sucursal (B2:B500)
- Columna C: SKU (C2:C500)
- Columna D: Monto Neto CLP (D2:D500)
- Columna E: Estado (E2:E500)

Objetivo: [describe aquí la regla de negocio].
Entrégame:
1. La fórmula exacta lista para copiar en español con ";".
2. La explicación paso a paso de cada argumento.
3. Qué error podría aparecer si hay celdas vacías y cómo blindarla.`,
        },
        {
          titulo: "1) Buscar precio por SKU con respaldo si no existe (BUSCARX / XLOOKUP)",
          lenguaje: "excel",
          codigo: `=BUSCARX(C2; Productos!$A$2:$A$200; Productos!$C$2:$C$200; "SKU no encontrado")`,
          codigoEn: `=XLOOKUP(C2, Productos!$A$2:$A$200, Productos!$C$2:$C$200, "SKU no encontrado")`,
          nota: "Prompt corto: «Dame un BUSCARX en español con ; que busque C2 en Productos!A2:A200 y devuelva C2:C200 o 'SKU no encontrado'.»",
        },
        {
          titulo: "2) Suma condicional múltiple por sucursal y estado Pagado (SUMAR.SI.CONJUNTO / SUMIFS)",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(D2:D500; B2:B500; "Santiago Centro"; E2:E500; "Pagado")`,
          codigoEn: `=SUMIFS(D2:D500, B2:B500, "Santiago Centro", E2:E500, "Pagado")`,
          nota: "Prompt corto: «Suma D2:D500 solo cuando B2:B500 sea 'Santiago Centro' y E2:E500 sea 'Pagado'.»",
        },
        {
          titulo: "3) Clasificación de tramos comerciales sin anidar SI (SI.CONJUNTO / IFS)",
          lenguaje: "excel",
          codigo: `=SI.CONJUNTO(D2>=500000; "Alto"; D2>=150000; "Medio"; D2>0; "Bajo"; VERDADERO; "Sin venta")`,
          codigoEn: `=IFS(D2>=500000, "Alto", D2>=150000, "Medio", D2>0, "Bajo", TRUE, "Sin venta")`,
          nota: "Prompt corto: «Clasifica D2 en Alto (>=500.000), Medio (>=150.000), Bajo (>0) o Sin venta usando SI.CONJUNTO.»",
        },
        {
          titulo: "4) Extraer el dominio de un correo corporativo (DESPUES.TEXTO / TEXTAFTER)",
          lenguaje: "excel",
          codigo: `=MINUSC(DESPUES.TEXTO(F2; "@"))`,
          codigoEn: `=LOWER(TEXTAFTER(F2, "@"))`,
          nota: "Prompt corto: «Extrae en minúsculas todo lo que viene después de la arroba en F2 usando funciones de Excel 365 en español.»",
        },
        {
          titulo: "5) Calcular días hábiles entre emisión y pago (DIAS.LAB / NETWORKDAYS)",
          lenguaje: "excel",
          codigo: `=SI.ERROR(DIAS.LAB(A2; G2; Feriados!$A$2:$A$20); "")`,
          codigoEn: `=IFERROR(NETWORKDAYS(A2, G2, Feriados!$A$2:$A$20), "")`,
          nota: "Prompt corto: «Calcula días hábiles entre A2 y G2 descontando la lista de feriados en Feriados!A2:A20 y ocultando errores.»",
        },
        {
          titulo: "6) Búsqueda clásica compatible con Excel 2016/2019 (INDICE + COINCIDIR)",
          lenguaje: "excel",
          codigo: `=SI.ERROR(INDICE(Productos!$C$2:$C$200; COINCIDIR(C2; Productos!$A$2:$A$200; 0)); 0)`,
          codigoEn: `=IFERROR(INDEX(Productos!$C$2:$C$200, MATCH(C2, Productos!$A$2:$A$200, 0)), 0)`,
          nota: "Prompt corto: «Necesito buscar C2 sin usar BUSCARX porque mi equipo usa Excel 2019; dame INDICE y COINCIDIR blindado con SI.ERROR.»",
        },
        {
          titulo: "7) Filtrar registros activos dinámicamente (FILTRAR / FILTER)",
          lenguaje: "excel",
          codigo: `=FILTRAR(A2:E500; (B2:B500="Concepción")*(E2:E500="Pagado"); "Sin registros")`,
          codigoEn: `=FILTER(A2:E500, (B2:B500="Concepción")*(E2:E500="Pagado"), "Sin registros")`,
          nota: "Prompt corto: «Genera una tabla dinámica con fórmula FILTRAR para traer filas de Concepción con estado Pagado.»",
        },
        {
          titulo: "8) Unir texto limpio eliminando espacios extra (UNIRCADENAS + ESPACIOS)",
          lenguaje: "excel",
          codigo: `=UNIRCADENAS(" - "; VERDADERO; ESPACIOS(B2); ESPACIOS(C2))`,
          codigoEn: `=TEXTJOIN(" - ", TRUE, TRIM(B2), TRIM(C2))`,
          nota: "Prompt corto: «Une sucursal (B2) y SKU (C2) con guion eliminando espacios sobrantes e ignorando vacíos.»",
        },
      ],
      captura: {
        id: "ia-para-excel-chatgpt-claude-gemini-paso-2",
        ratio: "16/9",
        alt: "Barra de fórmulas de Excel mostrando BUSCARX en español con punto y coma junto al prompt utilizado en el navegador.",
        caption:
          "Cuando especificas versión, idioma español y punto y coma en el prompt, la fórmula se pega directo sin errores de sintaxis.",
      },
      verificaResultado:
        "Prueba siempre la fórmula generada en las primeras 3 filas de tu planilla comparando contra un caso manual conocido (por ejemplo, suma con la barra de estado de Excel o filtra manualmente la sucursal) antes de arrastrarla a toda la columna.",
    },
    {
      id: "subir-excel-analizar",
      titulo: "3. Subir un archivo Excel y analizarlo con ChatGPT, Claude o Gemini",
      esPasoHowTo: true,
      resumenHowTo:
        "Prepara un libro .xlsx con nombres de hoja claros, súbelo al asistente elegido y audita las cifras devueltas.",
      parrafos: [
        "Más allá de pedir fórmulas sueltas, los tres principales asistentes permiten adjuntar un libro `.xlsx` o `.csv` directamente en la conversación. Según la documentación oficial de Anthropic (https://support.claude.com/), OpenAI (https://help.openai.com/) y Google (https://support.google.com/gemini/), consultados el 21 de noviembre de 2026, cada plataforma procesa las hojas con matices distintos.",
        "ChatGPT ejecuta Python (`pandas` y `openpyxl`) en un entorno aislado, lo que resulta ideal para cruzar múltiples pestañas, limpiar fechas mixtas y devolver un nuevo `.xlsx` descargable. Claude permite cargar archivos `.xlsx` cuando las herramientas de ejecución de código y creación de archivos están habilitadas en la configuración de la cuenta, destacando por explicaciones muy claras de anomalías y scripts ordenados. Gemini, por su parte, destaca cuando tu planilla vive en Google Drive o cuando quieres explorar tendencias rápidas y luego abrir el análisis en Google Sheets.",
        "Para que ninguno de los tres se pierda dentro de un libro complejo, evita subir archivos con diez hojas de cálculo llenas de gráficos, macros antiguas o fórmulas rotas. Crea una copia limpia con solo las pestañas de datos crudos, usa nombres de hoja simples sin espacios raros (`Ventas_2026`, `Catalogo`) y especifica en el prompt qué pestaña y qué columnas debe leer.",
      ],
      codigos: [
        {
          titulo: "Prompt para analizar un libro Excel con múltiples hojas",
          lenguaje: "prompt",
          codigo: `Acabo de adjuntar un archivo .xlsx con dos hojas: "Ventas" y "Catalogo".
Por favor:
1. Confirma el nombre exacto de las hojas detectadas y la cantidad de filas en cada una.
2. Cruza "Ventas"[SKU] contra "Catalogo"[SKU] e identifica si existen SKU vendidos que no aparezcan en el catálogo.
3. Calcula el margen bruto total por categoría (Venta Neta menos Costo Unitario * Unidades), excluyendo filas con Estado = "Anulado".
4. Si encuentras celdas con error (#N/D, #DIV/0!, #VALOR!) o fechas en texto, lístalas antes de resumir.`,
        },
      ],
      captura: {
        id: "ia-para-excel-chatgpt-claude-gemini-paso-3",
        ratio: "16/9",
        alt: "Asistente de IA mostrando el cruce entre dos hojas de un archivo Excel adjunto y el listado de SKU faltantes en el catálogo.",
        caption:
          "Pedir primero el conteo de filas por hoja y la detección de errores (#N/D, #VALOR!) evita resúmenes basados en lecturas parciales.",
      },
      verificaResultado:
        "Verifica en tu Excel original la cantidad total de filas de la hoja «Ventas» y la suma de la columna de montos usando `Autosuma` o la barra inferior. Si la cifra del chat difiere aunque sea en un peso, revisa si filtró filas ocultas o interpretó mal una columna de texto.",
    },
    {
      id: "complementos-tablas-plantillas",
      titulo: "4. Complementos oficiales en AppSource y diseño de plantillas",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa cuándo instalar complementos verificados desde Microsoft AppSource y cómo usar la IA para estructurar tablas y plantillas desde cero.",
      parrafos: [
        "Si prefieres invocar un modelo de lenguaje sin salir de Excel y no tienes Microsoft Copilot, en el catálogo oficial de Microsoft AppSource (accesible desde Excel en Insertar → Obtener complementos) existen complementos de terceros que conectan la hoja mediante tu propia clave API o suscripción externa. Según la documentación oficial de desarrolladores de Office en Microsoft Learn (https://learn.microsoft.com/es-es/office/dev/add-ins/excel/), consultado el 21 de noviembre de 2026, estos complementos web funcionan tanto en Excel de escritorio como en Excel para la Web dentro de un entorno aislado.",
        "Antes de instalar cualquier complemento de IA desde AppSource en un computador de trabajo, revisa tres puntos críticos: quién es el editor verificado, si exige permisos de lectura sobre todo el libro o solo la selección actual, y si el equipo de TI de tu empresa autoriza el envío de celdas hacia APIs externas. En ambientes corporativos con datos sensibles, suele ser más seguro diseñar la estructura en el chat con datos ficticios y copiar únicamente las fórmulas hacia tu libro local.",
        "Un uso excelente y libre de riesgos es pedirle a ChatGPT, Claude o Gemini que diseñe la arquitectura completa de una plantilla de Excel antes de abrir una hoja en blanco: qué columnas debe llevar la tabla de entrada, qué reglas de validación de datos aplicar (listas desplegables, fechas válidas) y qué hoja de resumen alimentará un tablero mensual.",
      ],
      codigos: [
        {
          titulo: "Prompt para diseñar una plantilla profesional de control en Excel",
          lenguaje: "prompt",
          codigo: `Diseña la arquitectura de un libro de Excel para controlar presupuestos vs gastos reales mensuales de una pyme en Chile.
No generes código VBA todavía; entrégame:
1. Lista de hojas recomendadas (Parametros, Registro_Gastos, Resumen_Mensual).
2. Columnas exactas de cada tabla con su tipo de dato y regla de Validación de Datos (por ejemplo, lista desplegable de centros de costo).
3. Las fórmulas en español con punto y coma ";" para la hoja Resumen_Mensual usando SUMAR.SI.CONJUNTO y formatos numéricos sugeridos para CLP.`,
        },
      ],
      captura: {
        id: "ia-para-excel-chatgpt-claude-gemini-paso-4",
        ratio: "16/9",
        alt: "Panel de Complementos de Office en Excel mostrando la búsqueda en Microsoft AppSource junto a una plantilla estructurada en tres hojas.",
        caption:
          "Desde Insertar → Complementos puedes revisar herramientas verificadas en AppSource o usar prompts para planificar plantillas limpias.",
      },
      verificaResultado:
        "Revisa en la ficha Insertar → Mis complementos que cualquier herramienta instalada provenga de Microsoft AppSource verificado, y prueba cualquier diseño de plantilla ingresando al menos 5 movimientos ficticios (incluyendo un gasto por sobre el presupuesto) para comprobar las fórmulas de desviación.",
    },
    {
      id: "vba-power-query-privacidad",
      titulo: "5. Escribir macros VBA, Power Query M y resguardar la privacidad",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera código VBA y transformaciones en lenguaje M con prompts acotados, aplicando reglas estrictas de anonimización.",
      parrafos: [
        "Escribir macros VBA o editar consultas en el Editor avanzado de Power Query suele frenar a muchos usuarios intermedios de Excel porque requiere recordar sintaxis exacta (`WorksheetFunction`, `ListObject`, `Table.TransformColumnTypes`). Aquí es donde Claude y ChatGPT brillan como asistentes técnicos: puedes describir el flujo manual que repites cada viernes y obtener el script comentado en segundos.",
        "Para VBA, exige siempre manejo de errores (`On Error GoTo`), variables declaradas con `Option Explicit` y que nunca dependa de `ActiveCell` o `Select` innecesarios, ya que eso hace que las macros fallen cuando el usuario hace clic en otra hoja. Para Power Query, copia el código M actual de tu paso anterior desde Vista → Editor avanzado y pídele a la IA que agregue exactamente la transformación faltante sin romper los nombres de pasos previos.",
        "Por último, mantén una frontera firme con la privacidad. Si tu planilla contiene RUT de trabajadores, liquidaciones de sueldo, fichas médicas o listados de clientes con teléfono, jamás la subas a cuentas personales gratuitas o sin exclusión de entrenamiento. Para pedir una macro o una consulta de Power Query nunca hace falta entregar los datos reales: solo necesitas compartir los nombres de las columnas y un ejemplo inventado de dos filas.",
      ],
      codigos: [
        {
          titulo: "Prompt para generar una macro VBA robusta y segura",
          lenguaje: "prompt",
          codigo: `Escribe una macro VBA para Excel de escritorio que recorra cada valor único de la columna "Sucursal" en la hoja "Resumen" (Tabla llamada "tbResumen"), filtre la tabla por esa sucursal y exporte un archivo PDF en la carpeta del mismo libro llamado "Reporte_<Sucursal>_<YYYYMMDD>.pdf".
Requisitos técnicos:
- Incluye Option Explicit y manejo de errores limpio.
- Desactiva ScreenUpdating durante la ejecución y restáuralo al final.
- Evita usar .Select o .Activate.`,
        },
        {
          titulo: "Prompt para modificar código M en Power Query sin romper pasos",
          lenguaje: "prompt",
          codigo: `Tengo este código M en Power Query que carga un CSV de ventas:
[pega aquí tu código desde Editor avanzado]

Necesito agregar dos pasos antes del cierre "in":
1. Convertir la columna "Fecha" desde texto DD/MM/AAAA usando cultura "es-CL".
2. Filtrar para excluir filas donde "Estado" sea igual a "Anulado".
Devuélveme el bloque completo let ... in listo para pegar en el Editor avanzado.`,
        },
      ],
      captura: {
        id: "ia-para-excel-chatgpt-claude-gemini-paso-5",
        ratio: "16/9",
        alt: "Editor de Visual Basic para Aplicaciones (VBA) en Excel con un módulo comentado generado por IA y Option Explicit al inicio.",
        caption:
          "Antes de ejecutar cualquier macro generada por IA, revisa las rutas de guardado y pruébala sobre una copia del libro.",
      },
      verificaResultado:
        "Guarda siempre una copia de respaldo de tu archivo `.xlsm` antes de correr una macro VBA nueva (las acciones de VBA no se pueden deshacer con Ctrl+Z). Ejecuta el código paso a paso con `F8` en el editor VBA la primera vez para verificar que apunta a las hojas y carpetas correctas.",
    },
  ],
  erroresComunes: [
    {
      error: "Excel muestra el error «Hay un problema con esta fórmula» al pegar la respuesta de la IA",
      causa:
        "La IA respondió con nombres de función en inglés (SUMIFS, XLOOKUP) o usó coma ',' en lugar de punto y coma ';' como separador de argumentos.",
      solucion:
        "Indica en el prompt «Excel en español con punto y coma (;)» o pega la fórmula en el traductor de funciones y reemplaza comas de separación por punto y coma.",
    },
    {
      error: "La macro VBA falla con Error 9: El subíndice está fuera del intervalo",
      causa:
        "El código generado asume que tu hoja se llama 'Hoja1' o 'Datos', pero en tu archivo tiene otro nombre o un espacio extra al final.",
      solucion:
        "Pasa siempre los nombres exactos de hojas y Tablas de Excel (Ctrl+T) dentro del prompt antes de pedir la macro.",
    },
    {
      error: "Claude o ChatGPT no ven los cambios que acabas de hacer en tu Excel abierto",
      causa:
        "Los chats web analizan una copia estática del archivo que subiste en ese momento; no tienen lectura en vivo de tu escritorio.",
      solucion:
        "Guarda el libro en Excel y vuelve a adjuntarlo en el chat, o usa Copilot integrado si necesitas interacción directa dentro de Microsoft 365.",
    },
    {
      error: "Power Query devuelve Error de expresión al pegar el código M generado",
      causa:
        "La IA inventó el nombre del paso anterior o olvidó la coma al final de una línea dentro del bloque let ... in.",
      solucion:
        "Pega siempre tu bloque completo del Editor avanzado en el prompt para que la IA respete los nombres exactos de cada paso previo.",
    },
  ],
  plantilla: {
    titulo: "Guía rápida de prompts para Excel (Fórmulas, VBA y Power Query)",
    descripcion:
      "Próximamente podrás descargar aquí el recetario completo de prompts y un libro .xlsx de práctica con errores preparados para depurar.",
  },
  faqs: [
    {
      q: "¿Cuál es la mejor IA gratuita para Excel?",
      a: "Depende de la tarea: ChatGPT destaca si necesitas subir un archivo y ejecutar limpieza o gráficos en Python; Claude es muy cómodo para redactar fórmulas largas, macros VBA limpias y explicar errores; y Gemini resulta muy práctico si combinas Excel con Google Drive y Google Sheets. Las tres cuentan con acceso gratuito de entrada con cuotas acotadas.",
    },
    {
      q: "¿Puedo usar ChatGPT o Claude dentro de Excel sin pagar Copilot?",
      a: "No de forma nativa dentro de la barra oficial de Microsoft, pero sí copiando y pegando fórmulas o código desde el navegador, subiendo el archivo .xlsx al chat, o evaluando complementos de terceros verificados en Microsoft AppSource si tu empresa lo autoriza.",
    },
    {
      q: "¿Cómo hago para que la IA no se equivoque con el punto y coma en Excel?",
      a: "Declara al inicio de tu prompt: «Excel en español, configuración regional Chile, separador de argumentos punto y coma (;)». Si además indicas tu versión exacta (por ejemplo, Excel 2019 vs Microsoft 365), evitarás que sugiera funciones que tu equipo no tiene.",
    },
    {
      q: "¿Es seguro subir una planilla de sueldos o clientes con RUT a la IA?",
      a: "No en cuentas personales gratuitas o de consumo sin exclusión de entrenamiento. Antes de subir cualquier planilla real, elimina RUT, nombres, correos y datos sensibles, o trabaja únicamente bajo un entorno empresarial con contrato de privacidad vigente.",
    },
    {
      q: "¿Qué funciones de Excel 365 conviene pedirle a la IA en lugar de fórmulas antiguas?",
      a: "Pide BUSCARX en vez de BUSCARV, SI.CONJUNTO en vez de múltiples SI anidados, FILTRAR y UNICOS para extraer listas dinámicas, y UNIRCADENAS para concatenar rangos sin arrastrar celdas vacías.",
    },
  ],
  relacionadas: [
    "prompts-para-excel",
    "macros-vba-excel-desde-cero",
    "automatizar-excel-con-power-query",
  ],
  enlacesExternos: [
    {
      label: "Centro de ayuda oficial de OpenAI (ChatGPT)",
      url: "https://help.openai.com/",
      fuente: "OpenAI",
    },
    {
      label: "Centro de ayuda oficial de Anthropic (Claude y carga de archivos)",
      url: "https://support.claude.com/",
      fuente: "Anthropic",
    },
    {
      label: "Ayuda oficial de Gemini Apps (subir hojas de cálculo)",
      url: "https://support.google.com/gemini/",
      fuente: "Google",
    },
    {
      label: "Documentación oficial de complementos de Excel en Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/office/dev/add-ins/excel/",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende a subir planillas y generar resúmenes limpios paso a paso con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa directa de precisión, manejo de archivos y código entre ambos.",
    },
    {
      label: "Cómo usar Copilot en Excel",
      href: "/guias/como-usar-copilot-en-excel",
      descripcion: "Cuándo conviene la integración nativa de Microsoft 365 dentro de tus hojas.",
    },
  ],
};

export default guia;
