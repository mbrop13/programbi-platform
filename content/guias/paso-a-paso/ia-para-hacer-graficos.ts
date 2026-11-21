import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-hacer-graficos",
  title: "IA para hacer gráficos: ChatGPT, Gemini y Excel paso a paso",
  meta: "Crea gráficos con IA: desde un Excel o CSV con ChatGPT o Gemini, o con Copilot en Excel. Qué gráfico elegir, prompts y cómo evitar gráficos engañosos.",
  h1: "Cómo hacer gráficos con IA (y que comuniquen bien)",
  subtitle:
    "Pasa de una planilla CSV o Excel a visualizaciones claras en minutos usando ChatGPT, Gemini o Excel, eligiendo el tipo de gráfico correcto y evitando distorsiones visuales.",
  keywordPrincipal: "ia para hacer gráficos",
  keywords: [
    "ia para hacer gráficos",
    "IA para hacer gráficos de Excel",
    "ChatGPT gráficos",
    "IA para gráficos estadísticos gratis",
    "crear gráficos con ChatGPT",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de subir archivos Excel o CSV a ChatGPT, Gemini o cualquier herramienta de IA, elimina o anonimiza columnas con datos personales o confidenciales (RUT, nombres completos de clientes, correos, teléfonos o sueldos individuales). Trabaja siempre con resúmenes agregados por categoría o con muestras ficticias.",
  en30Segundos: {
    queLogras:
      "Elegir el gráfico adecuado para tu pregunta de negocio y generarlo con ayuda de ChatGPT (Python/imagen), Gemini en Google Sheets o Excel, asegurando una lectura honesta de los datos.",
    herramienta: "ChatGPT / Gemini / Excel",
    tiempo: "25 minutos",
    bullets: [
      "Decidir entre barras, líneas, dispersión o boxplot según lo que necesitas comparar.",
      "Generar gráficos limpios desde un CSV en ChatGPT y obtener su código matplotlib reproducible.",
      "Crear gráficos nativos en Google Sheets con Gemini y en Excel con asistencia de IA.",
      "Detectar y corregir gráficos engañosos (ejes truncados, doble eje confuso o efectos 3D).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Elegir el gráfico",
      resumen: "Asocia cada pregunta de negocio con la visual correcta.",
      anchorId: "que-grafico-elegir",
      icono: "chart",
    },
    {
      numero: 2,
      titulo: "Gráficos en ChatGPT",
      resumen: "Sube tu CSV anonimizado y genera imágenes + Python.",
      anchorId: "graficos-con-chatgpt",
      icono: "sparkles",
    },
    {
      numero: 3,
      titulo: "Gemini y Sheets",
      resumen: "Pide gráficos editables directo en tu hoja de cálculo.",
      anchorId: "graficos-gemini-sheets",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Excel con IA",
      resumen: "Prepara tabla limpia y genera gráficos nativos en Excel.",
      anchorId: "graficos-en-excel-ia",
      icono: "layers",
    },
    {
      numero: 5,
      titulo: "Exportar a PPT",
      resumen: "Lleva imágenes nítidas y editables a tus presentaciones.",
      anchorId: "exportar-presentaciones",
      icono: "file",
    },
    {
      numero: 6,
      titulo: "Evitar engaños",
      resumen: "Corrige ejes truncados, 3D y dobles escalas confusas.",
      anchorId: "graficos-enganosos",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "ChatGPT / Gemini web, Google Sheets o Microsoft Excel 365",
    lista: [
      "Un archivo CSV o Excel limpio (una fila de encabezados, sin celdas combinadas ni subtotales mezclados).",
      "Cuenta en ChatGPT (help.openai.com) o Google Gemini / Google Sheets (support.google.com).",
      "Opcional: Python 3.11+ con matplotlib si deseas ejecutar localmente el código generado.",
    ],
    compatibilidadMacWeb:
      "Tanto ChatGPT como Gemini y Google Sheets funcionan directamente desde el navegador en Windows y macOS. En Excel, las funciones de IA integradas dependen de tu licencia vigente de Microsoft 365.",
    avisoEducativo:
      "Los datos de ventas y márgenes utilizados en los prompts y scripts de ejemplo son ficticios y están pensados para practicar de forma segura.",
  },
  herramientasHowTo: ["ChatGPT", "Google Gemini", "Microsoft Excel"],
  insumosHowTo: ["Archivo CSV o planilla tabular limpia"],
  secciones: [
    {
      id: "que-grafico-elegir",
      titulo: "1. Qué gráfico usar según la pregunta de negocio",
      esPasoHowTo: true,
      resumenHowTo:
        "Define primero la pregunta que quieres responder antes de pedirle un gráfico a la IA.",
      parrafos: [
        "El error más común al pedir gráficos a una inteligencia artificial es escribir un prompt vago como «hazme el mejor gráfico para esta tabla». Cuando no especificas qué decisión quieres facilitar, la IA suele recurrir a gráficos de torta con diez categorías ilegibles o barras desordenadas alfabéticamente.",
        "Antes de abrir el chat, define tu pregunta en una frase: ¿quieres comparar magnitudes entre sucursales, mostrar una tendencia mes a mes, revisar la relación entre descuento y margen, o entender cómo se distribuyen los tiempos de entrega? Con esa definición clara, puedes exigir en el prompt el tipo exacto de visualización y su criterio de ordenamiento.",
      ],
      tabla: {
        caption: "Guía rápida para elegir el tipo de gráfico según la pregunta analítica",
        encabezados: [
          "Pregunta de negocio",
          "Gráfico recomendado",
          "Regla clave para pedirlo a la IA",
        ],
        filas: [
          [
            "¿Qué sucursal o categoría vende más?",
            "Barras horizontales ordenadas",
            "Ordenar de mayor a menor y comenzar el eje de valor en cero.",
          ],
          [
            "¿Cómo evolucionaron las ventas durante el año?",
            "Gráfico de líneas",
            "Eje X cronológico continuo y máximo 4 o 5 series simultáneas.",
          ],
          [
            "¿Cómo se distribuyen los montos o tiempos?",
            "Histograma o diagrama de caja (boxplot)",
            "Definir intervalos (bins) claros y destacar mediana o valores atípicos.",
          ],
          [
            "¿Existe relación entre dos variables numéricas?",
            "Gráfico de dispersión (scatter)",
            "Etiquetar ejes con unidades reales y evitar líneas que unan puntos sin orden temporal.",
          ],
          [
            "¿Cuánto aporta cada parte al total?",
            "Barras apiladas 100% o torta (máx. 3–4 partes)",
            "Agrupar categorías pequeñas en «Otros» para no saturar etiquetas.",
          ],
        ],
      },
      captura: {
        id: "ia-para-hacer-graficos-paso-1",
        alt: "Tabla comparativa de selección de gráficos según la pregunta de negocio",
        caption:
          "Define la pregunta analítica antes de escribir el prompt para evitar gráficos circulares ilegibles.",
        ratio: "16/9",
      },
    },
    {
      id: "graficos-con-chatgpt",
      titulo: "2. Gráficos con ChatGPT desde un archivo Excel o CSV",
      esPasoHowTo: true,
      resumenHowTo:
        "Carga tu archivo CSV anonimizado en ChatGPT, solicita un gráfico específico con reglas de diseño y guarda el código Python equivalente.",
      parrafos: [
        "Según la documentación oficial de OpenAI (help.openai.com, consultado el 21 de noviembre de 2026), ChatGPT permite adjuntar archivos tabulares como CSV o libros Excel para analizarlos mediante ejecución de código en Python y devolver gráficos descargables en PNG.",
        "Para obtener resultados profesionales y no imágenes genéricas con texto superpuesto, incluye en tu prompt instrucciones explícitas de formato: título orientado a la conclusión, subtítulo con la unidad (por ejemplo, «Miles de CLP»), etiquetas de datos legibles, sin bordes superiores ni derechos innecesarios, y el eje numérico partiendo en cero cuando uses barras.",
        "Además de descargar la imagen generada por el chat, pídele siempre el script de Python (matplotlib) utilizado. Así puedes auditar exactamente cómo agrupó las filas y reproducir o ajustar el gráfico en tu computador cuando lleguen nuevos datos.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Gráfico de barras horizontales ordenado con jerarquía visual",
          lenguaje: "prompt",
          codigo: `Adjunto un archivo CSV con columnas: Categoria, Region, Ventas_MCLP, Margen_Pct.
Crea un gráfico de barras horizontales con las ventas totales (Ventas_MCLP) por Categoria:
- Ordena las barras de mayor a menor (la mayor arriba).
- Inicia el eje X en 0.
- Agrega etiqueta numérica al final de cada barra sin decimales.
- Usa un título que resuma el hallazgo principal y un subtítulo indicando "Cifras en millones de CLP".
- Elimina los bordes superior y derecho (spines) y usa un solo color sobrio destacando la categoría líder.
Entrega la imagen PNG y el código Python completo con matplotlib.`,
        },
        {
          titulo: "Prompt 2: Serie temporal limpia sin saturación de etiquetas",
          lenguaje: "prompt",
          codigo: `Con el mismo archivo CSV, genera un gráfico de líneas con la evolución mensual de Ventas_MCLP para las 3 regiones principales.
Reglas:
- Agrupa por Mes en orden cronológico real (no alfabético).
- Coloca el nombre de cada región directamente al final de su línea en vez de usar una leyenda separada.
- Usa líneas suaves pero sin suavizado artificial (sin splines que inventen picos).
- Formato del eje Y en miles de CLP con separador de miles.`,
        },
        {
          titulo: "Código Python 3.11+ equivalente con matplotlib (probado en sintaxis)",
          lenguaje: "python",
          codigo: `import matplotlib.pyplot as plt

categorias = ["Equipos", "Servicios", "Insumos", "Soporte"]
ventas_mclp = [420, 315, 190, 95]

# Ordenar de menor a mayor para que la barra mayor quede arriba en barh
pares = sorted(zip(ventas_mclp, categorias))
valores_ord, cats_ord = zip(*pares)

fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
colores = ["#cbd5e1"] * (len(cats_ord) - 1) + ["#0f766e"]
barras = ax.barh(cats_ord, valores_mclp if False else valores_ord, color=colores)

ax.set_xlim(0, max(valores_ord) * 1.15)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.bar_label(barras, padding=5, fmt="%.0f")

ax.set_title("Equipos lidera las ventas acumuladas del trimestre", loc="left", fontsize=13, fontweight="bold")
ax.set_xlabel("Millones de CLP")
plt.tight_layout()
plt.savefig("ventas_por_categoria.png", dpi=300)
plt.close()`,
          nota: "Código de referencia en Python 3.11+ con matplotlib. Puedes ejecutarlo localmente tras ajustar tus listas o DataFrame.",
        },
      ],
      captura: {
        id: "ia-para-hacer-graficos-paso-2",
        alt: "Gráfico de barras horizontales generado por ChatGPT junto con su código Python matplotlib",
        caption:
          "Solicita tanto la imagen PNG como el script matplotlib para verificar que la agregación de tus datos sea exacta.",
        ratio: "16/9",
      },
      verificaResultado:
        "Suma manualmente o en Excel una categoría clave de tu CSV y compárala contra la etiqueta de la barra generada por ChatGPT. Si los números no calzan, revisa el código Python para detectar si filtró nulos o interpretó mal el separador decimal (punto vs coma).",
    },
    {
      id: "graficos-gemini-sheets",
      titulo: "3. Gráficos con Gemini y Google Sheets",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa el panel lateral de Gemini en Google Sheets o pide un análisis en Gemini web para obtener gráficos editables.",
      parrafos: [
        "Si tu equipo ya colabora en Google Drive, exportar un CSV para subirlo a otro chat agrega pasos innecesarios y rompe el vínculo con la fuente viva. Según la documentación oficial de Google (support.google.com, consultado el 21 de noviembre de 2026), en cuentas habilitadas con Gemini en Google Sheets puedes abrir el panel lateral de Gemini desde la esquina superior derecha para pedir la creación de gráficos a partir de un rango seleccionado.",
        "La gran ventaja de generar el gráfico dentro de Google Sheets es que el objeto resultante es un gráfico nativo de la hoja de cálculo: si actualizas una celda de ventas mañana, las barras o líneas se actualizan automáticamente y puedes editar títulos, colores o rangos sin regenerar un prompt.",
      ],
      codigos: [
        {
          titulo: "Prompt 3: Crear gráfico nativo desde el panel de Gemini en Sheets",
          lenguaje: "prompt",
          codigo: `Con los datos del rango A1:D25 de esta hoja, crea un gráfico de barras agrupadas que compare Ventas_MCLP por Region y Trimestre.
Asegúrate de usar la fila 1 como encabezados y coloca la leyenda en la parte superior.`,
        },
      ],
      captura: {
        id: "ia-para-hacer-graficos-paso-3",
        alt: "Panel lateral de Gemini en Google Sheets generando un gráfico nativo sobre un rango de tabla",
        caption:
          "Los gráficos generados dentro de Google Sheets permanecen vinculados a tus celdas y se actualizan en vivo.",
        ratio: "16/9",
      },
      verificaResultado:
        "Haz doble clic sobre el gráfico insertado en Google Sheets y revisa en la pestaña Configuración que el rango de datos, el eje X y las series correspondan exactamente a las columnas que querías graficar.",
    },
    {
      id: "graficos-en-excel-ia",
      titulo: "4. Gráficos en Excel con ayuda de IA",
      esPasoHowTo: true,
      resumenHowTo:
        "Estructura tu tabla como Tabla de Excel (Ctrl+T) y apóyate en IA para resumir o generar el gráfico nativo correcto.",
      parrafos: [
        "En Microsoft Excel, el obstáculo habitual no es insertar el gráfico sino preparar la tabla previa. Si tienes columnas desordenadas, fechas guardadas como texto o filas de subtotales intercaladas, ningún asistente podrá graficar bien a la primera.",
        "Si cuentas con Copilot en Excel (según las capacidades documentadas por Microsoft en learn.microsoft.com, consultado el 21 de noviembre de 2026), debes convertir primero tu rango en una Tabla oficial de Excel con Ctrl + T. Si trabajas en una versión de Excel sin Copilot, puedes pedirle a ChatGPT o Claude la fórmula resumen exacta (por ejemplo con SUMAR.SI.CONJUNTO o tabla dinámica) y luego insertar el gráfico nativo en dos clics.",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Preparar tabla resumen en Excel antes de graficar",
          lenguaje: "prompt",
          codigo: `Tengo una Tabla de Excel llamada Ventas con columnas: Fecha, Sucursal, Categoria, MontoCLP.
Quiero hacer un gráfico combinado de columnas (MontoCLP) y línea (% Participación acumulada) por Categoria, ordenado de mayor a menor.
Indícame:
1. Qué campos poner exactamente en Filas y Valores de la Tabla Dinámica.
2. Cómo ordenar de mayor a menor y agregar el campo calculado o mostrar valores como % acumulado.
3. Qué tipo de gráfico combinado insertar en Excel.`,
        },
      ],
      captura: {
        id: "ia-para-hacer-graficos-paso-4",
        alt: "Tabla dinámica en Excel acompañada de un gráfico combinado de columnas y línea ordenada",
        caption:
          "Combina Tablas Dinámicas ordenadas con instrucciones de IA para obtener gráficos nativos listos para directorio.",
        ratio: "16/9",
      },
      verificaResultado:
        "Confirma que el gráfico dinámico en Excel no incluye filas en blanco ni un total general graficado como si fuera una categoría más.",
    },
    {
      id: "exportar-presentaciones",
      titulo: "5. Exportar y llevar tus gráficos a presentaciones sin perder calidad",
      esPasoHowTo: false,
      parrafos: [
        "De nada sirve diseñar un buen gráfico si al pegarlo en PowerPoint o Google Slides queda pixelado o con letras minúsculas imposibles de leer desde una sala de reuniones.",
        "Si generaste el gráfico en ChatGPT con matplotlib, pide siempre la exportación a 300 DPI o en formato SVG si tu editor lo soporta, y especifica el tamaño de figura (figsize) proporcional al espacio de la diapositiva (por ejemplo, 8x4,5 pulgadas) para no deformar las tipografías al estirar la imagen.",
        "Si el gráfico proviene de Excel o Google Sheets, evita pegarlo como captura de pantalla recortada: copia el gráfico nativo o expórtalo en alta resolución, y aumenta el tamaño de fuente de ejes y etiquetas a al menos 11–12 pt antes de presentarlo.",
      ],
    },
    {
      id: "graficos-enganosos",
      titulo: "6. Gráficos engañosos: cómo detectarlos y corregirlos con IA",
      esPasoHowTo: true,
      resumenHowTo:
        "Audita tus visualizaciones frente a ejes truncados, dobles escalas arbitrarias y efectos 3D que distorsionan la magnitud real.",
      parrafos: [
        "La IA puede producir gráficos estéticamente bonitos pero estadísticamente engañosos si los datos tienen rangos estrechos o escalas dispares. Un ejemplo clásico ocurre cuando matplotlib recorta automáticamente el eje Y en un gráfico de barras o cuando un usuario pide efectos 3D que alteran la percepción de las áreas.",
        "Los tres errores de integridad visual que debes revisar siempre antes de publicar son: el eje truncado en gráficos de barras (hace parecer que una diferencia de 2% es el triple de grande), el doble eje Y con escalas manipuladas para sugerir una correlación inexistente, y los gráficos circulares o de columnas en 3D donde la perspectiva favorece a los segmentos delanteros.",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Auditar un gráfico antes de enviarlo a gerencia",
          lenguaje: "prompt",
          codigo: `Actúa como revisor crítico de visualización de datos.
Te adjunto el código/descripción de mi gráfico actual. Evalúa y corrige:
1. ¿El eje de magnitud parte en cero en gráficos de barras o áreas?
2. ¿Hay doble eje Y que pueda sugerir causalidad falsa?
3. ¿Existen más de 6 categorías en un gráfico circular o efectos 3D innecesarios?
4. ¿El título describe el dato o exagera una variación mínima?
Propón la versión corregida más honesta y clara.`,
        },
      ],
      captura: {
        id: "ia-para-hacer-graficos-paso-5",
        alt: "Comparación lado a lado entre un gráfico de barras con eje truncado engañoso y su versión corregida desde cero",
        caption:
          "Un eje Y que no parte en cero exagera visualmente diferencias pequeñas entre categorías.",
        ratio: "16/9",
      },
      verificaResultado:
        "Revisa visualmente que la altura o largo de cada barra sea estrictamente proporcional a su valor numérico (una barra de 200 debe medir exactamente el doble que una de 100).",
    },
  ],
  erroresComunes: [
    {
      error: "ChatGPT ordena los meses alfabéticamente (Abril, Agosto, Diciembre...)",
      causa:
        "La columna Mes venía como texto sin una fecha completa o sin orden categórico explícito.",
      solucion:
        "Incluye la columna Fecha en formato ISO (YYYY-MM-DD) o indica en el prompt el orden cronológico exacto de enero a diciembre.",
    },
    {
      error: "Etiquetas de texto superpuestas e ilegibles en el eje X",
      causa:
        "Demasiadas categorías en un gráfico de columnas verticales.",
      solucion:
        "Cambia a barras horizontales (barh) o agrupa las categorías menores en «Otros».",
    },
    {
      error: "La IA cambia la escala o inventa valores suavizados",
      causa:
        "Uso de interpolación tipo spline o ejes truncados por defecto.",
      solucion:
        "Exige líneas rectas entre puntos reales y fija explícitamente ylim(0, ...) o xlim(0, ...) en gráficos de barras.",
    },
    {
      error: "El gráfico en Excel se rompe al agregar filas nuevas",
      causa:
        "El origen de datos apuntaba a un rango fijo en lugar de una Tabla de Excel o Tabla Dinámica.",
      solucion:
        "Convierte los datos con Ctrl + T antes de crear el gráfico para que crezca automáticamente.",
    },
  ],
  plantilla: {
    titulo: "Guía de bolsillo de gráficos y prompts matplotlib",
    descripcion:
      "Próximamente: plantilla descargable con ejemplos de datasets limpios y prompts listos para barras, líneas, dispersión y Pareto.",
  },
  faqs: [
    {
      q: "¿Se pueden hacer gráficos estadísticos gratis con IA?",
      a: "Sí. Tanto ChatGPT como Gemini ofrecen niveles gratuitos en la web donde puedes describir datos resumidos o pedir código en Python (matplotlib/seaborn) o pasos para Excel/Sheets, respetando los límites de uso vigentes de cada plataforma.",
    },
    {
      q: "¿Qué herramienta es mejor para hacer gráficos con IA: ChatGPT, Gemini o Excel?",
      a: "Si buscas gráficos rápidos desde un CSV o visualizaciones estadísticas como boxplots y heatmaps con Python, ChatGPT resulta muy práctico. Si tus datos viven en Google Sheets o Excel y quieres gráficos editables vinculados a celdas, conviene usar Gemini en Sheets o las herramientas nativas de Excel.",
    },
    {
      q: "¿Puedo subir una planilla de ventas completa de mi empresa a ChatGPT?",
      a: "No es recomendable subir archivos con información confidencial o datos personales de clientes (RUT, correos, nombres, sueldos). Anonimiza o agrega los datos primero en una tabla resumen por categoría y mes.",
    },
    {
      q: "¿Cómo evito que la IA haga un gráfico de torta con 15 categorías?",
      a: "Nunca dejes el tipo de gráfico abierto. Especifica en el prompt «usa barras horizontales ordenadas de mayor a menor» y reserva los gráficos circulares solo para 2 a 4 categorías.",
    },
  ],
  relacionadas: [
    "como-hacer-dashboard-en-excel",
    "ia-para-excel-chatgpt-claude-gemini",
    "chatgpt-para-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Centro de ayuda de OpenAI (ChatGPT)",
      url: "https://help.openai.com",
      fuente: "OpenAI Help Center",
    },
    {
      label: "Centro de ayuda de Google (Gemini y Sheets)",
      url: "https://support.google.com",
      fuente: "Google Support",
    },
    {
      label: "Documentación de Microsoft Learn",
      url: "https://learn.microsoft.com",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende a analizar tablas y generar visualizaciones claras con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Compara qué modelo entrega mejores gráficos, código Python y análisis tabular.",
    },
  ],
};

export default guia;
