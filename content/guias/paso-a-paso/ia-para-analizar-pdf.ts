import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-analizar-pdf",
  title: "IA para resumir y analizar PDF: Gemini, ChatGPT y Claude",
  meta: "Resume, consulta y extrae tablas de PDF con Gemini, ChatGPT, Claude o NotebookLM. Paso a paso, límites de tamaño y cómo pasar los datos a Excel.",
  h1: "Cómo resumir y analizar PDF con IA (y pasar las tablas a Excel)",
  subtitle:
    "Deja de copiar cuadros a mano desde memorias anuales, informes técnicos o bases de licitación. Aprende qué herramienta elegir entre Gemini, ChatGPT, Claude y NotebookLM, cómo resumir documentos largos con citas verificables y cómo llevar sus tablas limpias a Excel usando prompts o Power Query.",
  keywordPrincipal: "ia para resumir pdf",
  keywords: [
    "ia para resumir pdf",
    "Gemini PDF",
    "ChatGPT para leer PDF",
    "resumir PDF gratis",
    "extraer tablas de un PDF a Excel con IA",
  ],
  curso: "ia-productividad",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Los archivos PDF suelen contener información altamente sensible: contratos firmados, balances tributarios, liquidaciones de sueldo, cartolas bancarias o escrituras con RUT y domicilios. Nunca subas PDFs confidenciales a cuentas personales gratuitas o de consumo sin revisar antes los controles de entrenamiento de la plataforma, ni a herramientas web desconocidas. Para documentos internos de trabajo, usa cuentas empresariales con exclusión de entrenamiento (Workspace, ChatGPT Business/Enterprise o Claude Team/Enterprise) o redacta/censura los datos personales antes de cargar el PDF.",
  en30Segundos: {
    queLogras:
      "Resumir documentos extensos en minutos, hacer preguntas puntuales exigiendo número de página o sección exacta, extraer cuadros financieros a Excel mediante prompts o Power Query (`Pdf.Tables`) y verificar que ninguna cifra haya sido alterada.",
    herramienta: "Gemini / ChatGPT / Claude / NotebookLM + Excel Power Query",
    tiempo: "20 minutos",
    bullets: [
      "Elegir entre Gemini, ChatGPT, Claude y NotebookLM según largo del PDF, presencia de gráficos o necesidad de citas.",
      "Ejecutar prompts estructurados para obtener resúmenes ejecutivos y respuestas ancladas a página.",
      "Extraer tablas de un PDF a CSV/Excel con IA o de forma nativa y auditable con `Pdf.Tables` en Power Query.",
      "Comprobar cifras críticas y proteger contratos, balances o liquidaciones antes de subirlas.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Elegir herramienta",
      resumen: "Compara Gemini, ChatGPT, Claude y NotebookLM para PDF.",
      anchorId: "que-herramienta-usar-pdf",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Resumir PDF largo",
      resumen: "Extrae estructura, decisiones y puntos clave sin perder detalle.",
      anchorId: "resumir-pdf-largo",
      icono: "file",
    },
    {
      numero: 3,
      titulo: "Preguntar con citas",
      resumen: "Exige sección, página y cita textual para auditar cada dato.",
      anchorId: "preguntas-con-citas",
      icono: "check",
    },
    {
      numero: 4,
      titulo: "Tablas PDF a Excel",
      resumen: "Convierte cuadros a CSV con IA o usa Pdf.Tables en Power Query.",
      anchorId: "extraer-tablas-pdf-excel",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "Verificar y privacidad",
      resumen: "Audita cifras clave y protege contratos o liquidaciones.",
      anchorId: "verificar-cifras-privacidad",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Navegador web actualizado + archivo PDF (idealmente PDF con texto seleccionable) + Excel opcional",
    lista: [
      "Documento PDF de prueba (por ejemplo, un informe público, memoria anual o manual técnico).",
      "Cuenta en al menos una herramienta: Gemini, ChatGPT, Claude o NotebookLM.",
      "Opcional: Microsoft Excel (Microsoft 365 o escritorio) para importar tablas directamente con Power Query.",
    ],
    compatibilidadMacWeb:
      "La carga y lectura de PDF en Gemini, ChatGPT, Claude y NotebookLM funciona igual en navegadores de Windows, macOS y Linux. La extracción nativa con Power Query (`Datos > Obtener datos > Desde un archivo > Desde un PDF`) está disponible en Excel de escritorio para Windows (Microsoft 365 / Excel 2021+).",
  },
  herramientasHowTo: ["Google Gemini", "ChatGPT", "Claude", "NotebookLM", "Excel Power Query"],
  insumosHowTo: ["Archivo PDF con texto o tablas", "Prompts de resumen, citas y extracción"],
  secciones: [
    {
      id: "que-herramienta-usar-pdf",
      titulo: "1. Qué herramienta usar para leer PDFs: Gemini, ChatGPT, Claude o NotebookLM",
      esPasoHowTo: true,
      resumenHowTo:
        "Selecciona el asistente más adecuado según si necesitas leer gráficos visuales, trabajar con múltiples documentos o extraer tablas.",
      parrafos: [
        "No todos los lectores de PDF con inteligencia artificial procesan los archivos de la misma manera. Un documento de diez páginas con texto limpio se lee sin problemas en cualquiera, pero cuando enfrentas una memoria anual con gráficos insertados como imagen, unas bases de licitación extensas o diez anexos distintos, la elección de herramienta marca la diferencia.",
        "Según las fuentes oficiales de Google (https://support.google.com/gemini/ y https://notebooklm.google/), OpenAI (https://help.openai.com/) y Anthropic (https://support.claude.com/), consultadas el 21 de noviembre de 2026, cada plataforma maneja los PDF con un enfoque particular:",
      ],
      tabla: {
        caption:
          "Comparativa cualitativa para analizar PDFs (según documentación oficial de Google, OpenAI y Anthropic, consultado el 21 de noviembre de 2026).",
        encabezados: [
          "Criterio",
          "Claude (Anthropic)",
          "ChatGPT (OpenAI)",
          "Gemini (Google)",
          "NotebookLM (Google)",
        ],
        filas: [
          [
            "Lectura visual (gráficos e imágenes en PDF)",
            "Lee texto y elementos visuales hasta 100 páginas; desde 101 a 1.000 páginas procesa solo texto",
            "Combina lectura de texto y análisis visual o extracción vía Python",
            "Procesa documentos extensos de texto y contexto largo desde Drive o subida local",
            "Enfocado en lectura de fuentes subidas con citas clicables al pasaje exacto",
          ],
          [
            "Múltiples PDFs cruzados",
            "Hasta 20 archivos por chat (o más dentro de un Proyecto)",
            "Múltiples archivos adjuntos en la conversación según plan",
            "Múltiples archivos por consulta o carpeta desde Drive",
            "Diseñado específicamente para cruzar cuadernos con varias fuentes simultáneas",
          ],
          [
            "Exportación de tablas a Excel",
            "Excelente para tablas Markdown limpias y código Python/CSV",
            "Muy sólido extrayendo con Python (pdfplumber) y generando .xlsx descargable",
            "Permite exportar tablas directo a Google Sheets con un clic",
            "No exporta archivos .xlsx directamente; orientado a síntesis y citas",
          ],
          [
            "Mejor caso de uso",
            "PDFs técnicos con diagramas/tablas complejas hasta 100 págs. y redacción precisa",
            "Extraer tablas difíciles vía Python y descargar CSV/Excel listo",
            "Documentos largos integrados con Google Drive y Google Sheets",
            "Estudiar varios reglamentos, leyes o informes con citas verificables",
          ],
        ],
      },
      captura: {
        id: "ia-para-analizar-pdf-paso-1",
        ratio: "16/9",
        alt: "Cuadro comparativo en pantalla mostrando un informe PDF cargado en NotebookLM con citas clicables junto a la interfaz de carga de Claude.",
        caption:
          "Usa NotebookLM cuando necesites citas exactas entre varias fuentes; usa ChatGPT o Claude cuando necesites transformar tablas.",
      },
      verificaResultado:
        "Comprueba antes de empezar si tu PDF permite seleccionar el texto con el mouse. Si no puedes seleccionar letras, es un PDF escaneado como imagen: en ese caso evita herramientas que solo leen texto plano en documentos largos y realiza una prueba corta de lectura en las primeras dos páginas.",
    },
    {
      id: "resumir-pdf-largo",
      titulo: "2. Resumir un PDF largo sin perder lo importante",
      esPasoHowTo: true,
      resumenHowTo:
        "Pide primero el mapa de secciones y luego resúmenes enfocados en decisiones, riesgos o cifras clave.",
      parrafos: [
        "El error más común al resumir un PDF extenso es pedir «resume este archivo en cinco líneas». Cuando haces eso, el modelo comprime cien páginas en generalidades obvias y omite cláusulas críticas, excepciones o cifras que estaban en el anexo final.",
        "La técnica profesional funciona en dos pasadas: primero le pides un índice estructurado de lo que realmente contiene el PDF (para verificar que lo leyó de principio a fin) y luego solicitas un resumen ejecutivo orientado a tu rol (finanzas, operaciones, legal o comercial).",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Mapa estructural para comprobar lectura completa",
          lenguaje: "prompt",
          codigo: `Acabo de adjuntar un documento PDF. Antes de resumirlo, dime:
1. Cuál es el título, fecha o período del documento y cuántas páginas detectas.
2. Un esquema con los títulos principales de cada sección o capítulo que encontraste, indicando brevemente qué tema cubre cada uno.
Si alguna parte del documento parece ilegible o escaneada sin texto claro, adviértemelo ahora.`,
        },
        {
          titulo: "Prompt 2: Resumen ejecutivo orientado a acción y riesgos",
          lenguaje: "prompt",
          codigo: `Con base en el documento completo, redacta un resumen ejecutivo estructurado en:
1. Objetivo principal del documento (máximo 3 líneas).
2. Los 5 hallazgos, obligaciones o métricas más relevantes (con sus valores exactos tal como aparecen en el texto).
3. Riesgos, plazos límite, multas o excepciones mencionadas.
No agregues interpretaciones externas; usa únicamente información presente en el PDF.`,
        },
      ],
      captura: {
        id: "ia-para-analizar-pdf-paso-2",
        ratio: "16/9",
        alt: "Respuesta de asistente de IA mostrando el esquema por capítulos del PDF y un resumen ejecutivo con plazos y métricas.",
        caption:
          "Pedir primero el mapa de capítulos confirma que la IA no cortó la lectura a mitad del documento.",
      },
      verificaResultado:
        "Revisa el último capítulo o anexo listado en el Prompt 1 y compáralo con el índice real de tu PDF. Si el asistente no menciona las páginas finales, divide el PDF en partes más pequeñas antes de resumirlo.",
    },
    {
      id: "preguntas-con-citas",
      titulo: "3. Hacer preguntas al documento exigiendo citas exactas",
      esPasoHowTo: true,
      resumenHowTo:
        "Interroga el PDF con reglas estrictas de citación por página y fragmento textual para evitar alucinaciones.",
      parrafos: [
        "Una vez que tienes el panorama general, lo más útil es consultar detalles específicos: un requisito de garantía en una licitación, una definición en una circular normativa o una variación de ingresos en un estado financiero.",
        "Para eliminar el riesgo de que la IA complete lagunas con conocimiento general, obliga al prompt a responder siempre con tres elementos: la respuesta directa, el número de página o sección donde aparece y una cita breve entre comillas. Si el dato no existe en el PDF, debe responder explícitamente «No consta en el documento».",
      ],
      codigos: [
        {
          titulo: "Prompt 3: Consulta estricta con cita literal y página",
          lenguaje: "prompt",
          codigo: `Responde la siguiente pregunta usando EXCLUSIVAMENTE el PDF adjunto:
Pregunta: [escribe tu pregunta específica aquí]

Formato obligatorio de respuesta:
- Respuesta directa: (clara y concisa)
- Ubicación: (número de página y nombre de sección o tabla)
- Cita literal: (copia textual breve del párrafo o fila que respalda la respuesta)
Si el documento no contiene esta información, responde únicamente: "No consta en el documento".`,
        },
      ],
      captura: {
        id: "ia-para-analizar-pdf-paso-3",
        ratio: "16/9",
        alt: "Chat mostrando una pregunta puntual sobre un PDF respondida con número de página, sección y cita literal entre comillas.",
        caption:
          "Exigir ubicación y cita literal te permite verificar la respuesta en cinco segundos usando Ctrl+F en tu lector de PDF.",
      },
      verificaResultado:
        "Abre el PDF en tu navegador o visor, presiona `Ctrl+F` y pega unas pocas palabras de la «Cita literal» entregada por la IA. Debes aterrizar exactamente en la página indicada.",
    },
    {
      id: "extraer-tablas-pdf-excel",
      titulo: "4. Extraer tablas de un PDF a Excel (con IA o con Power Query)",
      esPasoHowTo: true,
      resumenHowTo:
        "Convierte cuadros de un PDF a CSV limpio usando prompts o automatiza la extracción repetible en Excel con Power Query (Pdf.Tables).",
      parrafos: [
        "Pasar cuadros numéricos desde un PDF a Excel es una de las tareas que más tiempo consume en contabilidad, control de gestión y estudios de mercado. Tienes dos caminos complementarios: usar IA para tablas puntuales o desordenadas, o usar el conector nativo de Excel Power Query (`Pdf.Tables`) cuando el PDF tiene estructura limpia y necesitas repetir el proceso cada mes.",
        "Si optas por la IA (por ejemplo ChatGPT o Claude), pídele que extraiga la tabla respetando exactamente los encabezados, separando los montos de los símbolos de moneda y entregando el resultado en formato CSV listo para copiar o descargar. Si el PDF tiene decenas de páginas con el mismo formato tabular, Power Query en Excel de escritorio es más confiable y auditable porque no depende de un modelo probabilístico.",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Extraer tabla específica de un PDF a CSV limpio",
          lenguaje: "prompt",
          codigo: `Extrae únicamente la tabla titulada "[nombre exacto de la tabla]" ubicada alrededor de la página [N].
Reglas de formato:
1. Entrega el resultado como bloque de código CSV usando coma "," como separador de columnas y codificación UTF-8.
2. Mantén los números puros sin símbolo "$" ni puntos de miles (por ejemplo 1450000 en vez de $1.450.000).
3. No resumas ni omitas filas intermedias; incluye una fila final de control con la suma que reporta el PDF si existe.`,
        },
        {
          titulo: "Alternativa nativa en Excel: Power Query con Pdf.Tables (Lenguaje M)",
          lenguaje: "m",
          mostrarLineas: true,
          codigo: `let
    // Conecta al PDF local (en Excel: Datos > Obtener datos > Desde un archivo > Desde un PDF)
    Origen = Pdf.Tables(File.Contents("C:\\Reportes\\informe_mensual.pdf"), [Implementation="1.3"]),
    // Filtra la primera tabla detectada (ajusta Id según tu archivo: "Table001", "Page001", etc.)
    TablaObjetivo = Origen{[Id="Table001"]}[Data],
    EncabezadosPromovidos = Table.PromoteHeaders(TablaObjetivo, [PromoteAllScalars=true])
in
    EncabezadosPromovidos`,
          nota: "Según la documentación oficial de Microsoft Learn (https://learn.microsoft.com/es-es/powerquery-m/pdf-tables), consultado el 21 de noviembre de 2026, Pdf.Tables extrae tablas y páginas de un PDF directamente hacia Excel sin depender de IA externa.",
        },
      ],
      captura: {
        id: "ia-para-analizar-pdf-paso-4",
        ratio: "16/9",
        alt: "Navegador de Power Query en Excel mostrando las tablas detectadas dentro de un archivo PDF junto a la vista previa limpia.",
        caption:
          "En Excel de escritorio, Datos → Obtener datos → Desde un archivo → Desde un PDF ejecuta Pdf.Tables de forma visual y repetible.",
      },
      verificaResultado:
        "En Excel, compara la suma de cada columna numérica extraída contra la fila de «Total» impresa en el PDF original. Si hay diferencia de un solo peso, revisa si dos columnas se fusionaron o si un signo negativo quedó como paréntesis.",
    },
    {
      id: "verificar-cifras-privacidad",
      titulo: "5. Verificar cifras y proteger documentos confidenciales",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica una auditoría rápida de totales y resguarda contratos, balances o liquidaciones antes de cargarlas.",
      parrafos: [
        "Incluso cuando una IA lee bien un PDF, los errores sutiles ocurren en saltos de página (cuando una tabla continúa en la página siguiente sin repetir encabezados), en notas al pie confundidas con filas de datos o en cifras negativas expresadas entre paréntesis como `(45.200)`.",
        "Por eso, adopta siempre un prompt final de verificación cruzada o suma los totales en Excel apenas descargues los datos. Y en materia de privacidad, aplica sentido común corporativo: los balances tributarios, contratos laborales, anexos con RUT y liquidaciones de sueldo jamás deben subirse a cuentas personales gratuitas sin exclusión de entrenamiento. Si necesitas resumir un contrato en una cuenta personal, reemplaza primero los nombres, RUT, montos salariales y direcciones por marcadores genéricos.",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Auditoría de consistencia sobre cifras extraídas",
          lenguaje: "prompt",
          codigo: `Revisa la tabla CSV que acabas de extraer y haz una auditoría matemática:
1. Suma cada columna numérica de las filas de detalle y compárala contra la fila de Total impresa en el PDF.
2. Indica explícitamente si existe alguna diferencia (aunque sea de 1 unidad) o si alguna fila quedó partida entre dos páginas del PDF.`,
        },
      ],
      captura: {
        id: "ia-para-analizar-pdf-paso-5",
        ratio: "16/9",
        alt: "Hoja de Excel con una columna de verificación comparando la suma calculada de filas extraídas frente al total oficial del PDF.",
        caption:
          "Una simple fórmula =SUMA(...) comparada contra el total impreso del documento detecta al instante filas saltadas entre páginas.",
      },
      verificaResultado:
        "Confirma dos cosas antes de cerrar: que la diferencia entre tu `=SUMA()` en Excel y el total del PDF sea exactamente `0`, y que no hayas dejado archivos confidenciales guardados en cuentas personales con historial o entrenamiento activo.",
    },
  ],
  erroresComunes: [
    {
      error: "La IA responde «el PDF está vacío» o devuelve texto sin sentido",
      causa:
        "El archivo es un PDF escaneado (solo imágenes sin capa de texto OCR), o está protegido con contraseña de copia/lectura.",
      solucion:
        "Aplica primero OCR con una herramienta local o prueba en un modelo con lectura visual sobre pocas páginas a la vez.",
    },
    {
      error: "Faltan filas cuando una tabla del PDF ocupa tres o cuatro páginas seguidas",
      causa:
        "El asistente extrajo solo la primera página donde aparecía el título de la tabla y se detuvo en el salto de página.",
      solucion:
        "Indica el rango exacto de páginas (por ejemplo, «desde la página 14 hasta la 17») o utiliza `Pdf.Tables` en Power Query consolidando las tablas de cada página.",
    },
    {
      error: "Los números con paréntesis como (12.500) aparecen en Excel como texto o positivos",
      causa:
        "En estados financieros se usan paréntesis para negativos y puntos para miles, lo que confunde la conversión a CSV.",
      solucion:
        "Pide explícitamente en el prompt convertir valores entre paréntesis a signo negativo (`-12500`) antes de generar el CSV.",
    },
    {
      error: "El resumen mezcla reglas de dos versiones distintas o inventa un artículo",
      causa:
        "Se subieron varios PDFs sin especificar cuál manda o se hizo una pregunta abierta sin exigir cita literal ni página.",
      solucion:
        "Usa el formato de Prompt 3 exigiendo nombre de archivo, página y cita literal, y valida siempre con `Ctrl+F`.",
    },
  ],
  plantilla: {
    titulo: "Prompts para resumir PDFs + plantilla de auditoría en Excel",
    descripcion:
      "Próximamente podrás descargar aquí el set de prompts para contratos/informes y un archivo Excel con la consulta Power Query `Pdf.Tables` preconfigurada.",
  },
  faqs: [
    {
      q: "¿Cuál es la mejor IA gratis para resumir PDFs?",
      a: "Para estudiar o consultar varios PDFs largos con citas exactas al pasaje original, NotebookLM es una de las opciones gratuitas más prácticas. Si además necesitas extraer tablas a hojas de cálculo, Gemini (exportando a Google Sheets), ChatGPT y Claude ofrecen acceso gratuito de entrada con cuotas acotadas.",
    },
    {
      q: "¿ChatGPT o Claude leen gráficos e imágenes dentro de un PDF?",
      a: "Sí, ambos pueden interpretar elementos visuales dentro de PDFs, aunque con límites según el largo del documento. Por ejemplo, según la documentación oficial de Anthropic, Claude analiza texto y elementos visuales en PDFs de hasta 100 páginas, mientras que entre 101 y 1.000 páginas procesa únicamente el texto.",
    },
    {
      q: "¿Cómo paso una tabla de un PDF a Excel sin pagar programas externos?",
      a: "Si usas Excel de escritorio (Microsoft 365 o Excel 2021+), ve a Datos → Obtener datos → Desde un archivo → Desde un PDF: Power Query detecta las tablas nativamente sin costo adicional. Para PDFs más irregulares, extrae la tabla en formato CSV con ChatGPT o Claude y verifica la suma en Excel.",
    },
    {
      q: "¿Qué hago si el PDF supera el límite de tamaño o páginas de mi plan?",
      a: "Divide el PDF por capítulos o extrae únicamente las páginas relevantes usando la impresora PDF de tu sistema («Imprimir páginas 12-25 como PDF») antes de subirlo. Así además obtienes respuestas más rápidas y precisas.",
    },
    {
      q: "¿Es seguro subir contratos o liquidaciones de sueldo a una IA para resumirlos?",
      a: "Solo dentro de cuentas empresariales con exclusión de entrenamiento y políticas de seguridad aprobadas por tu organización. En cuentas personales gratuitas o estándar, anonimiza siempre nombres, RUT, direcciones y sueldos antes de cargar el documento.",
    },
  ],
  relacionadas: [
    "notebooklm-que-es-y-como-usarlo",
    "automatizar-excel-con-power-query",
    "gemini-para-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de Pdf.Tables en Power Query M (Microsoft Learn)",
      url: "https://learn.microsoft.com/es-es/powerquery-m/pdf-tables",
      fuente: "Microsoft Learn",
    },
    {
      label: "Centro de ayuda oficial de Anthropic (límites de PDF en Claude)",
      url: "https://support.claude.com/",
      fuente: "Anthropic",
    },
    {
      label: "NotebookLM oficial de Google",
      url: "https://notebooklm.google/",
      fuente: "Google",
    },
    {
      label: "Centro de ayuda oficial de OpenAI (ChatGPT)",
      url: "https://help.openai.com/",
      fuente: "OpenAI",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende a trabajar con documentos, CSV y planillas paso a paso en Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Compara precisión, límites y flujo de trabajo entre Claude y ChatGPT.",
    },
  ],
};

export default guia;
