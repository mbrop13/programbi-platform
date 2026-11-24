import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "gemini-para-analisis-de-datos",
  title: "Gemini para análisis de datos: cómo usarlo paso a paso",
  meta: "Usa Gemini de Google para analizar datos: subir archivos, trabajar con Google Sheets, crear gráficos y validar resultados. Prompts y límites reales.",
  h1: "Cómo usar Gemini para análisis de datos",
  subtitle:
    "Aprovecha el ecosistema de Google para inspeccionar planillas Excel o CSV directamente en Gemini, conectar tus hojas desde Google Drive, usar fórmulas en Google Sheets, generar gráficos exploratorios y comprobar cada cálculo con rigor.",
  keywordPrincipal: "gemini para análisis de datos",
  keywords: [
    "gemini para análisis de datos",
    "cómo usar Gemini para análisis de datos",
    "prompt Gemini datos",
    "Gemini con Google Sheets",
  ],
  curso: "gemini",
  cursoSecundario: "analisis-de-datos",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Al igual que con cualquier asistente en la nube, si usas Gemini con una cuenta personal de Gmail revisa tu configuración de Actividad en las aplicaciones de Gemini antes de subir archivos. Nunca cargues bases con RUT, remuneraciones nominales, correos de clientes ni información financiera confidencial sin contar con un plan corporativo de Google Workspace con protecciones de privacidad empresariales. Anonimiza nombres y códigos sensibles antes de adjuntar planillas.",
  en30Segundos: {
    queLogras:
      "Cargar un archivo Excel o CSV en Gemini, conectarlo con Google Drive y Google Sheets, extraer tablas resumen y gráficos exploratorios con prompts claros y verificar los totales en tu hoja.",
    herramienta: "Google Gemini + Google Sheets",
    tiempo: "20 minutos",
    bullets: [
      "Elegir entre Gemini gratuito, planes Google AI personales y Google Workspace empresarial.",
      "Subir archivos .xlsx/.csv o importarlos directo desde Google Drive en gemini.google.com.",
      "Combinar Gemini en la web con fórmulas nativas de Google Sheets (QUERY, FILTER, =AI()).",
      "Validar cifras y decidir cuándo conviene Gemini frente a ChatGPT o Claude.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Versión y planes",
      resumen: "Distingue acceso gratuito, Google AI y Workspace corporativo.",
      anchorId: "que-version-gemini-usar",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Subir Excel o CSV",
      resumen: "Carga planillas locales o desde Google Drive en el chat.",
      anchorId: "subir-excel-csv-gemini",
      icono: "file",
    },
    {
      numero: 3,
      titulo: "Gemini + Sheets",
      resumen: "Trabaja directo en hojas de Google y prepara prompts de análisis.",
      anchorId: "gemini-en-google-sheets",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Gráficos y validación",
      resumen: "Genera tablas, fórmulas de Sheets y audita cada cifra.",
      anchorId: "graficos-validar-resultados",
      icono: "chart",
    },
    {
      numero: 5,
      titulo: "Comparativa de IA",
      resumen: "Contrasta Gemini frente a ChatGPT y Claude para archivos.",
      anchorId: "comparativa-gemini-chatgpt-claude",
      icono: "layers",
    },
  ],
  requisitos: {
    version: "Cuenta de Google personal o Google Workspace con acceso a gemini.google.com",
    lista: [
      "Navegador web actualizado y sesión iniciada en gemini.google.com.",
      "Archivo .xlsx, .csv o .tsv limpio con una fila de encabezados, o una hoja en Google Drive.",
      "Opcional: cuenta elegible de Google Workspace o Google AI para probar funciones integradas dentro de Google Sheets.",
    ],
    compatibilidadMacWeb:
      "Gemini y Google Sheets funcionan íntegramente en la nube desde cualquier navegador en Windows, macOS, Linux o Chromebook sin instalar programas adicionales.",
  },
  herramientasHowTo: ["Google Gemini (gemini.google.com)", "Google Drive", "Google Sheets"],
  insumosHowTo: ["Archivo CSV o Excel limpio", "Prompts secuenciales de análisis y validación"],
  secciones: [
    {
      id: "que-version-gemini-usar",
      titulo: "1. Qué versión de Gemini usar para analizar datos",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa las diferencias entre Gemini gratuito, planes Google AI individuales y Google Workspace antes de cargar tus planillas.",
      parrafos: [
        "Antes de subir una hoja de cálculo a Gemini, conviene entender cómo organiza Google sus distintos niveles de acceso. Según la documentación oficial de ayuda de Google para Gemini, consultado el 21 de noviembre de 2026 (https://support.google.com/gemini/), la experiencia varía según si ingresas con una cuenta personal gratuita, una suscripción individual de pago o una cuenta corporativa de Google Workspace.",
        "La versión gratuita en gemini.google.com ya permite adjuntar hojas de cálculo y archivos CSV para hacer consultas exploratorias, detectar tendencias y redactar fórmulas. Sin embargo, sus cuotas de carga de archivos y la capacidad para sostener análisis extensos son más acotadas que en los planes superiores.",
        "Los planes de pago individuales orientados a consumidores amplían el acceso a modelos más capaces, mayor ventana de contexto para documentos largos y mejor integración con aplicaciones personales de Google. No obstante, para trabajar con datos comerciales reales de una empresa en Chile, la opción recomendada es Google Workspace en ediciones corporativas elegibles: allí la información procesada en Gemini y dentro de Google Sheets opera bajo compromisos empresariales donde tus archivos no se usan para entrenar modelos públicos ni son revisados por revisores humanos para mejorar productos de consumo. Y si tu objetivo principal no es calcular planillas sino consultar varios PDFs o manuales internos con citas exactas, te conviene revisar [qué es NotebookLM y cómo entrar](/guias/notebooklm-que-es-y-como-usarlo) (hoy renombrado a Gemini Notebook).",
      ],
      captura: {
        id: "gemini-para-analisis-de-datos-paso-1",
        ratio: "16/9",
        alt: "Pantalla principal de gemini.google.com mostrando el botón de agregar archivos desde el equipo o desde Google Drive.",
        caption:
          "Desde gemini.google.com puedes subir planillas locales o conectar directamente archivos alojados en Google Drive.",
      },
      verificaResultado:
        "Revisa en la esquina superior derecha de gemini.google.com con qué cuenta iniciaste sesión (personal `@gmail.com` vs corporativa de Workspace) antes de adjuntar cualquier archivo con datos reales.",
    },
    {
      id: "subir-excel-csv-gemini",
      titulo: "2. Subir un archivo Excel o CSV y hacer la inspección inicial",
      esPasoHowTo: true,
      resumenHowTo:
        "Adjunta tu archivo desde el computador o Google Drive y ejecuta el primer prompt de auditoría de columnas y valores.",
      parrafos: [
        "En la barra inferior de Gemini haz clic en el botón + (Agregar archivos) y elige «Subir archivos» para cargar un `.csv`, `.tsv` o `.xlsx` desde tu disco, o «Agregar desde Drive» si tu planilla ya está en la nube (para usar Drive debes tener activada la extensión de Google Workspace en Gemini).",
        "Al igual que ocurre en otras plataformas de IA, nunca pidas conclusiones de negocio en el primer mensaje. Empieza pidiendo una auditoría estructural para confirmar que Gemini leyó todas las filas, reconoció los encabezados y detectó celdas vacías o fechas con formato mixto.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Auditoría inicial del archivo en Gemini",
          lenguaje: "prompt",
          codigo: `Acabo de adjuntar un archivo de ventas. Antes de resumir cifras de negocio, realiza una inspección técnica y dime:
1. Nombres exactos de las columnas y tipo de dato que detectas en cada una.
2. Cantidad total de filas de datos leídas.
3. Si existen celdas vacías, filas duplicadas o valores de texto mezclados en columnas numéricas o de fecha.
No calcules totales todavía; confirma primero la estructura.`,
        },
        {
          titulo: "Prompt 2: Reglas de limpieza y normalización",
          lenguaje: "prompt",
          codigo: `Considerando la estructura anterior, aplica estas reglas:
- Excluye filas con estado "Anulado" o donde el monto esté vacío.
- Interpreta fechas con barra como día/mes/año (formato Chile).
- Elimina duplicados exactos.
Muéstrame cuántas filas quedaron válidas y qué registros específicos quedaron fuera.`,
        },
      ],
      captura: {
        id: "gemini-para-analisis-de-datos-paso-2",
        ratio: "16/9",
        alt: "Conversación en Gemini mostrando un archivo CSV adjunto y el listado de columnas, filas leídas y registros excluidos.",
        caption:
          "Confirmar la cantidad de filas leídas y los registros excluidos evita que un cálculo omita parte de la tabla.",
      },
      verificaResultado:
        "Abre tu CSV o Excel en paralelo y verifica que el total de filas reportado en el Prompt 1 coincida exactamente con el número de registros de tu hoja (descontando la fila de encabezado).",
    },
    {
      id: "gemini-en-google-sheets",
      titulo: "3. Trabajar con Gemini dentro de Google Sheets",
      esPasoHowTo: true,
      resumenHowTo:
        "Combina el panel lateral de Gemini y la función =AI() en Google Sheets para categorizar textos, resumir rangos y generar tablas.",
      parrafos: [
        "La ventaja diferencial de Gemini frente a otros asistentes aparece cuando tus datos ya viven en Google Sheets. En cuentas elegibles de Google Workspace o Google AI, puedes abrir el panel lateral («Preguntar a Gemini») directamente sobre tu hoja seleccionada para solicitar tablas estructuradas, detectar valores atípicos o pedir fórmulas adaptadas a tus rangos reales sin cambiar de pestaña.",
        "Además, Google Sheets incorporó la función nativa `=AI()`, pensada para aplicar instrucciones de lenguaje natural celda por celda —por ejemplo, clasificar comentarios de clientes en categorías o estandarizar descripciones de productos— directamente dentro de la cuadrícula. Si quieres profundizar en cada botón del panel lateral y casos avanzados dentro de las hojas de cálculo de Google, revisa nuestra guía dedicada de [Gemini en Google Sheets](/guias/gemini-en-google-sheets).",
      ],
      codigos: [
        {
          titulo: "Prompt 3: Analizar tendencias y anomalías desde un rango de datos",
          lenguaje: "prompt",
          codigo: `Con las filas válidas del archivo, identifica:
1. Los 3 segmentos (sucursal + categoría) con mayor venta acumulada y su participación porcentual sobre el total.
2. Si existe algún monto atípico (muy por encima o por debajo de la mediana de su categoría).
Presenta el resultado en una tabla ordenada de mayor a menor.`,
        },
        {
          titulo: "Prompt 4: Clasificar texto libre o feedback en categorías operativas",
          lenguaje: "prompt",
          codigo: `Tengo una columna con observaciones de clientes sobre despachos. Clasifica cada fila en una sola categoría de esta lista cerrada: "Demora", "Producto dañado", "Error de cobro", "Felicitación" u "Otro".
Devuelve una tabla con la observación original, la categoría asignada y un conteo final por categoría.`,
        },
      ],
      captura: {
        id: "gemini-para-analisis-de-datos-paso-3",
        ratio: "16/9",
        alt: "Google Sheets con el panel lateral de Gemini abierto analizando un rango de ventas y proponiendo una tabla resumen.",
        caption:
          "En cuentas elegibles, el panel lateral de Gemini lee el rango activo de Google Sheets y sugiere tablas o fórmulas.",
      },
      verificaResultado:
        "Si usas `=AI()` o el panel lateral para categorizar textos, revisa una muestra aleatoria de al menos 10 filas para confirmar que no asignó etiquetas ambiguas antes de resumir los conteos.",
    },
    {
      id: "graficos-validar-resultados",
      titulo: "4. Gráficos, tablas resumen en Sheets y validación final",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera visualizaciones rápidas en Gemini, traslada los resúmenes a fórmulas nativas de Google Sheets y audita cada total.",
      parrafos: [
        "Gemini puede generar gráficos interactivos y tablas comparativas directamente en la conversación cuando analizas planillas adjuntas. Sin embargo, para reportes recurrentes que vas a compartir con tu equipo, la práctica más segura es pedirle a Gemini la fórmula exacta de Google Sheets (`QUERY` o `FILTER`) para que el resumen viva calculado en tu propia hoja y se actualice solo.",
        "Recuerda que las fórmulas de Google Sheets en configuración regional de Chile o España también usan punto y coma `;` como separador de argumentos (o coma `,` si tu hoja está configurada en Estados Unidos). Pide la versión que coincida con la configuración de tu hoja en Archivo → Configuración.",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Pedir gráfico exploratorio y fórmula QUERY equivalente para Sheets",
          lenguaje: "prompt",
          codigo: `1. Crea un gráfico de barras comparando la venta total por sucursal ordenado de mayor a menor.
2. Además, escríbeme la fórmula exacta de Google Sheets usando QUERY() para generar esa misma tabla resumen automáticamente desde la hoja "Ventas" (rango A1:G500, excluyendo Estado = "Anulado"). Usa punto y coma ";" como separador.`,
        },
        {
          titulo: "Fórmula QUERY verificada para Google Sheets (configuración regional Chile/ES)",
          lenguaje: "sheets",
          codigo: `=QUERY(Ventas!A1:G500; "SELECT B, COUNT(E), SUM(F) WHERE G <> 'Anulado' GROUP BY B ORDER BY SUM(F) DESC LABEL COUNT(E) 'Transacciones', SUM(F) 'Venta Total'"; 1)`,
          codigoEn: `=QUERY(Ventas!A1:G500, "SELECT B, COUNT(E), SUM(F) WHERE G <> 'Anulado' GROUP BY B ORDER BY SUM(F) DESC LABEL COUNT(E) 'Transacciones', SUM(F) 'Venta Total'", 1)`,
          nota: "Asume B = Sucursal, E = Unidades, F = Monto y G = Estado. Ajusta las letras de columna según tu hoja.",
        },
      ],
      captura: {
        id: "gemini-para-analisis-de-datos-paso-4",
        ratio: "16/9",
        alt: "Gráfico generado en Gemini junto a una pestaña de Google Sheets ejecutando la fórmula QUERY para validar los mismos totales.",
        caption:
          "Trasladar el cálculo a una fórmula QUERY o tabla dinámica en Sheets te permite auditar cada cifra al peso.",
      },
      verificaResultado:
        "Compara la suma total del gráfico o tabla de Gemini contra el resultado de `=SUMAR.SI(Ventas!G2:G500; \"<>Anulado\"; Ventas!F2:F500)` en Google Sheets. Ambas cifras deben coincidir exactamente.",
    },
    {
      id: "comparativa-gemini-chatgpt-claude",
      titulo: "5. Gemini vs ChatGPT vs Claude para analizar archivos de datos",
      parrafos: [
        "Cada herramienta tiene fortalezas claras según dónde estén tus archivos y qué tipo de entregable necesites. Si trabajas todo el día en Google Drive y Google Sheets, Gemini reduce la fricción de descargar y subir archivos. Si necesitas limpieza compleja con scripts de Python descargables o gráficos listos en PNG con matplotlib, ChatGPT suele ser más cómodo. Y si analizas documentos extensos con tablas o necesitas código limpio comentado, Claude es una excelente alternativa.",
        "Para profundizar en las otras opciones, puedes revisar [cómo usar Claude para análisis de datos](/guias/como-usar-claude-para-analisis-de-datos) y la comparativa directa en [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos).",
      ],
      tabla: {
        caption:
          "Comparativa cualitativa para análisis de archivos (según documentación oficial de Google, OpenAI y Anthropic, consultado el 21 de noviembre de 2026).",
        encabezados: ["Criterio", "Gemini (Google)", "ChatGPT (OpenAI)", "Claude (Anthropic)"],
        filas: [
          [
            "Conexión con Google Drive y Sheets",
            "Nativa (importa desde Drive y opera dentro de Sheets en planes elegibles)",
            "Vía conector de Drive o carga manual del archivo",
            "Vía integraciones habilitadas o carga manual del archivo",
          ],
          [
            "Formatos tabulares soportados",
            "CSV, TSV, XLS, XLSX y Google Sheets",
            "CSV, XLS, XLSX, JSON y múltiples formatos en Python",
            "CSV y XLSX (con ejecución de código habilitada)",
          ],
          [
            "Fortaleza principal",
            "Flujo fluido dentro del ecosistema Google Workspace",
            "Ejecución iterativa en Python y exportación de archivos limpios",
            "Lectura cuidadosa de contexto largo, explicaciones y código claro",
          ],
          [
            "Documentación oficial",
            "support.google.com/gemini",
            "help.openai.com",
            "support.claude.com",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "No aparece la opción «Agregar desde Drive» en Gemini",
      causa:
        "La extensión de Google Workspace no está activada en tu cuenta de Gemini o la actividad está desactivada.",
      solucion:
        "Entra a Configuración / Extensiones dentro de gemini.google.com y habilita Google Workspace, o descarga el archivo como .xlsx/.csv y súbelo manualmente.",
    },
    {
      error: "La fórmula QUERY sugerida por Gemini arroja #ERROR! de análisis en Google Sheets",
      causa:
        "Mezcló comas y punto y coma según la configuración regional de tu hoja, o escribió nombres de columna en lugar de letras (A, B, C) dentro de QUERY.",
      solucion:
        "Recuerda que QUERY en Google Sheets exige letras de columna (SELECT B, SUM(F)) cuando el primer argumento es un rango directo, y respeta el separador ';' si tu hoja está en configuración regional de Chile.",
    },
    {
      error: "Gemini resume solo una parte de una planilla grande o con varias pestañas",
      causa:
        "Los libros .xlsx con múltiples hojas, fórmulas complejas o filas ocultas pueden provocar lecturas parciales.",
      solucion:
        "Exporta solo la hoja de datos limpios a formato CSV UTF-8 antes de subirla y verifica en el Prompt 1 que el conteo total de filas coincida.",
    },
    {
      error: "Confundir montos con formato chileno ($ 125.000) como si fueran decimales (125,0)",
      causa:
        "El punto como separador de miles en un CSV puede interpretarse como punto decimal si no se limpia previamente.",
      solucion:
        "Antes de exportar a CSV, quita el formato de puntos de miles dejando números puros sin símbolo de moneda.",
    },
  ],
  plantilla: {
    titulo: "Checklist de prompts para Gemini + plantilla de validación en Google Sheets",
    descripcion:
      "Próximamente podrás descargar aquí una hoja base en Google Sheets con fórmulas QUERY listas y el set de prompts secuenciales.",
  },
  faqs: [
    {
      q: "¿Gemini gratuito sirve para analizar archivos Excel o CSV?",
      a: "Sí. La versión gratuita en gemini.google.com permite subir hojas de cálculo y CSV para explorar datos y hacer preguntas, aunque con cuotas más acotadas que los planes de pago Google AI o Google Workspace.",
    },
    {
      q: "¿Cuál es la diferencia entre subir un archivo a Gemini web y usar Gemini en Google Sheets?",
      a: "En Gemini web subes una copia estática del archivo para analizarla en el chat. Dentro de Google Sheets (en planes elegibles), Gemini opera directo sobre tus pestañas vivas y te permite usar fórmulas como =AI() sin salir de la hoja.",
    },
    {
      q: "¿Gemini puede crear archivos Excel descargables?",
      a: "Puede generar tablas listas para exportar directamente a Google Sheets con un clic (desde el botón «Exportar a Hojas de cálculo» debajo de las tablas en el chat) y desde ahí puedes descargarlas como .xlsx.",
    },
    {
      q: "¿Cómo valido que Gemini no inventó una suma?",
      a: "No confíes solo en el texto: exporta la tabla resumen a Google Sheets o contrasta los totales clave usando =SUMA(), =SUMAR.SI.CONJUNTO() o =QUERY() sobre tu hoja original.",
    },
    {
      q: "¿Es seguro analizar planillas de trabajo con Gemini?",
      a: "Solo si usas una cuenta corporativa de Google Workspace con protecciones empresariales activas. En cuentas personales gratuitas o de consumo, anonimiza siempre RUT, nombres, correos y remuneraciones antes de subir cualquier archivo.",
    },
  ],
  relacionadas: [
    "chatgpt-para-analisis-de-datos",
    "gemini-en-google-sheets",
    "ia-para-analizar-pdf",
  ],
  enlacesExternos: [
    {
      label: "Ayuda oficial de Gemini Apps (cargar y analizar archivos)",
      url: "https://support.google.com/gemini/",
      fuente: "Google",
    },
    {
      label: "Gemini web app",
      url: "https://gemini.google.com/",
      fuente: "Google",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Gemini en Google Sheets: guía práctica",
      href: "/guias/gemini-en-google-sheets",
      descripcion: "Aprende a usar el panel lateral y la función =AI() directamente en tus hojas.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Alternativa sólida de Anthropic para revisar planillas y código.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa práctica entre los dos principales competidores de Gemini.",
    },
  ],
};

export default guia;
