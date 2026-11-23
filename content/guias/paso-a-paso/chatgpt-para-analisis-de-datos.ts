import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "chatgpt-para-analisis-de-datos",
  title: "ChatGPT para análisis de datos: guía práctica con prompts",
  meta: "Analiza datos con ChatGPT paso a paso: subir Excel o CSV, limpiar, resumir, graficar y validar resultados. Prompts listos y límites que debes conocer.",
  h1: "Cómo usar ChatGPT para análisis de datos (paso a paso)",
  subtitle:
    "Convierte planillas sucias en resúmenes ejecutivos, tablas cruzadas y gráficos reproducibles sin pelearte con fórmulas complejas. Aprende a preparar tu archivo, aplicar un flujo en seis prompts, comprobar cada cálculo en Python/pandas y resguardar datos sensibles según tu plan.",
  keywordPrincipal: "chatgpt para análisis de datos",
  keywords: [
    "chatgpt para análisis de datos",
    "prompt chatgpt análisis de datos",
    "chatgpt análisis de datos excel",
    "análisis de datos avanzado ChatGPT",
  ],
  curso: "chatgpt",
  cursoSecundario: "analisis-de-datos",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  esInsignia: true,
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de subir cualquier planilla a ChatGPT, recuerda que en planes personales (Free, Plus o Pro) el contenido puede usarse para mejorar modelos salvo que desactives la opción en Controles de datos antes de iniciar la sesión. Nunca subas RUT, nombres completos de colaboradores, sueldos nominales, correos de clientes ni contratos confidenciales sin contar con un espacio de trabajo empresarial (Business o Enterprise) con exclusión de entrenamiento. Reemplaza identificadores reales por códigos correlativos (por ejemplo, CLI-001) y agrupa fechas o montos sensibles si trabajas en una cuenta personal.",
  en30Segundos: {
    queLogras:
      "Pasar de un archivo CSV o Excel desordenado a un diagnóstico limpio, tablas resumen por segmento, gráficos descargables y un script de Python con pandas para auditar cada cifra fuera del chat.",
    herramienta: "ChatGPT (Análisis de datos) + Python/pandas",
    tiempo: "25 minutos",
    bullets: [
      "Entender qué ejecuta ChatGPT en su entorno Python y dónde suele equivocarse.",
      "Estandarizar un archivo CSV/Excel y practicar con un dataset comercial ficticio listo para copiar.",
      "Aplicar un flujo secuencial de seis prompts: explorar, limpiar, resumir, segmentar, graficar y redactar conclusiones.",
      "Verificar cada cifra con un script equivalente en Python 3.11+ y pandas 2.2+, respetando límites de planes y privacidad.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Alcance real",
      resumen: "Distingue lo que ChatGPT ejecuta con Python de lo que infiere.",
      anchorId: "que-hace-chatgpt",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Preparar archivo",
      resumen: "Ordena encabezados, formatos y anonimiza columnas críticas.",
      anchorId: "preparar-archivo",
      icono: "file",
    },
    {
      numero: 3,
      titulo: "Flujo en 6 prompts",
      resumen: "Explora, limpia, resume, segmenta, grafica y concluye.",
      anchorId: "flujo-seis-prompts",
      icono: "sparkles",
    },
    {
      numero: 4,
      titulo: "Validar con pandas",
      resumen: "Audita los totales con un script local reproducible.",
      anchorId: "validar-con-python",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Planes y privacidad",
      resumen: "Revisa capacidades cualitativas y controles de entrenamiento.",
      anchorId: "limites-planes-privacidad",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Cuenta en ChatGPT (web o escritorio), navegador moderno y opcionalmente Python 3.11+ con pandas 2.2+",
    lista: [
      "Archivo de trabajo en formato .csv (UTF-8) o .xlsx con una tabla plana de encabezados en la primera fila.",
      "Acceso a ChatGPT en chatgpt.com con la carga de archivos habilitada según tu plan.",
      "Para la auditoría local: Python 3.11 o superior con pandas 2.2+ y openpyxl instalados, o Excel para contrastar totales.",
    ],
    compatibilidadMacWeb:
      "La carga y análisis de archivos en ChatGPT funciona igual desde navegador en Windows, macOS o Linux, así como en las aplicaciones oficiales de escritorio. La validación local en pandas también es multiplataforma.",
    avisoEducativo:
      "Esta guía trabaja con un set de datos ficticio de ventas minoristas para que puedas replicar cada prompt sin exponer información real de tu empresa.",
  },
  herramientasHowTo: ["ChatGPT", "Microsoft Excel o editor CSV", "Python 3.11+ con pandas 2.2+"],
  insumosHowTo: ["Archivo ventas_sucursales_ficticio.csv", "Seis prompts de análisis secuencial"],
  secciones: [
    {
      id: "que-hace-chatgpt",
      titulo: "1. Qué hace ChatGPT con tus datos y qué no",
      esPasoHowTo: true,
      resumenHowTo:
        "Comprende cómo el entorno de análisis de datos de ChatGPT ejecuta código Python real sobre tu archivo y qué tareas debes verificar manualmente.",
      parrafos: [
        "Cuando adjuntas una planilla en ChatGPT y le pides calcular promedios, cruzar categorías o generar un gráfico, el modelo no intenta hacer aritmética mental sobre miles de filas. En lugar de eso, levanta un entorno aislado con Python y librerías científicas como pandas y matplotlib, escribe un script, lo ejecuta sobre tu archivo y lee la salida estándar para redactar su respuesta.",
        "Esa distinción explica por qué el análisis de datos en ChatGPT es muchísimo más confiable que pegar texto suelto en un chat tradicional: las sumas, los conteos y las agrupaciones salen de código ejecutado, no de predicción probabilística de palabras. Sin embargo, el entorno sigue dependiendo de cómo interprete los encabezados, las fechas o los valores nulos antes de correr el script.",
        "Lo que ChatGPT no hace por sí solo es conocer las reglas contables o comerciales de tu negocio. Si una columna llamada Monto incluye IVA en algunas filas y valores netos en otras, o si hay notas de crédito con signo positivo mezcladas con boletas, el modelo sumará todo sin advertir la inconsistencia a menos que tú se la indiques en el prompt o la detectes en la inspección inicial.",
        "Tampoco mantiene una conexión viva con tu base de datos corporativa ni actualiza gráficos automáticamente cuando cambia tu ERP. Su rol ideal es el de copiloto exploratorio: acelerar la limpieza inicial, descubrir patrones en minutos, prototipar visualizaciones y entregarte el código reproducible que luego puedes llevar a Excel, Power BI o un script local.",
      ],
      lista: [
        "Sí hace bien: detectar columnas con nulos, unificar fechas mixtas, generar tablas dinámicas rápidas, calcular percentiles, exportar archivos limpios descargables y graficar distribuciones.",
        "No hace sin supervisión: validar reglas tributarias locales (como IVA o retenciones), inferir el significado de códigos internos sin diccionario o garantizar que un archivo gigante quepa completo en memoria temporal.",
      ],
      captura: {
        id: "chatgpt-para-analisis-de-datos-paso-1",
        ratio: "16/9",
        alt: "Interfaz de ChatGPT mostrando un archivo CSV adjunto y el bloque desplegable de código Python ejecutado para analizar las columnas.",
        caption:
          "En ChatGPT, el enlace «Analizando» despliega el script Python real que el entorno ejecutó sobre tu archivo.",
      },
      verificaResultado:
        "Haz clic siempre en el indicador de análisis o código ejecutado dentro de la respuesta de ChatGPT. Confirma que leyó la misma cantidad de filas y columnas que ves en tu archivo original antes de aceptar cualquier resumen.",
    },
    {
      id: "preparar-archivo",
      titulo: "2. Preparar el archivo antes de subirlo (con dataset de ejemplo)",
      esPasoHowTo: true,
      resumenHowTo:
        "Estructura tu CSV o Excel en formato tabular limpio, elimina celdas combinadas y anonimiza columnas sensibles usando nuestro dataset ficticio de práctica.",
      parrafos: [
        "El ochenta por ciento de los errores al analizar planillas con inteligencia artificial ocurren porque el archivo de origen tiene formato visual en lugar de estructura tabular. Si tu Excel trae un logotipo arriba, tres filas de título, subtotales intercalados al final de cada mes y celdas combinadas, el script de Python leerá encabezados como Unnamed: 0 y arrastrará totales duplicados.",
        "Antes de subir un libro .xlsx o .csv, deja una sola fila de encabezados claros en la fila 1, sin espacios al inicio ni caracteres ambiguos. Asegúrate de que cada columna represente una única variable (fecha, sucursal, categoría, unidades, monto neto) y elimina filas de totales generales al pie de la tabla.",
        "Si trabajas con datos reales en Chile, aplica una regla de higiene previa: elimina la columna de RUT, sustituye nombres de vendedores o clientes por identificadores neutros (VEND-01, CLI-104) y verifica que los montos no traigan el símbolo peso mezclado con puntos y comas inconsistentes. Para practicar todo el flujo de esta guía sin riesgos, copia el siguiente bloque CSV ficticio y guárdalo como ventas_sucursales_ficticio.csv.",
      ],
      codigos: [
        {
          titulo: "Dataset de práctica: ventas_sucursales_ficticio.csv",
          lenguaje: "bash",
          codigo: `fecha,sucursal,canal,categoria,unidades,monto_neto_clp,estado
2026-09-02,Santiago Centro,Web,Accesorios,3,89700,Pagado
2026-09-03,Concepción,Tienda,Periféricos,2,145000,Pagado
2026-09-04,Santiago Centro,Tienda,Monitores,1,219900,Pagado
05/09/2026,Viña del Mar,Web,Accesorios,5,112500,Pagado
2026-09-06,Concepción,Web,Almacenamiento,2,,Pendiente
2026-09-07,Santiago Centro,Web,Periféricos,1,79900,Anulado
2026-09-08,Viña del Mar,Tienda,Monitores,2,439800,Pagado
2026-09-09,Santiago Centro,Tienda,Accesorios,4,99600,Pagado
2026-09-10,Concepción,Tienda,Monitores,1,229900,Pagado
2026-09-11,Viña del Mar,Web,Almacenamiento,3,194700,Pagado
2026-09-12,Santiago Centro,Web,Accesorios,3,89700,Pagado
2026-09-12,Santiago Centro,Web,Accesorios,3,89700,Pagado`,
          nota: "Incluye a propósito una fecha en formato DD/MM/AAAA (05/09/2026), un monto vacío en estado Pendiente, una venta anulada y una fila duplicada el 2026-09-12 para probar la limpieza.",
        },
      ],
      captura: {
        id: "chatgpt-para-analisis-de-datos-paso-2",
        ratio: "16/9",
        alt: "Planilla CSV abierta mostrando encabezados limpios en la fila 1 y los registros ficticios con fechas mixtas y un registro duplicado.",
        caption:
          "Estructura tabular recomendada: una sola fila de encabezados, sin celdas combinadas ni filas de totales al final.",
      },
      verificaResultado:
        "Abre tu archivo en un editor de texto o en Excel y comprueba que tenga exactamente 12 filas de datos (13 líneas contando el encabezado), sin columnas vacías a la derecha ni caracteres extraños en tildes como Concepción o Viña del Mar.",
    },
    {
      id: "flujo-seis-prompts",
      titulo: "3. Flujo de análisis en 6 prompts paso a paso",
      esPasoHowTo: true,
      resumenHowTo:
        "Sube el archivo y ejecuta seis prompts encadenados para diagnosticar, limpiar, resumir, segmentar, graficar y redactar hallazgos accionables.",
      parrafos: [
        "El error más común al abrir ChatGPT con una base de datos es escribir un único prompt vago como «analiza este Excel y dime qué ves». Ese enfoque produce respuestas genéricas que mezclan filas anuladas con ventas válidas o ignoran fechas mal formateadas.",
        "En su lugar, trabaja en una misma conversación aplicando seis pasos cortos y verificables. Cada prompt construye sobre el estado limpio del paso anterior, de modo que nunca calculas promedios sobre datos sucios ni graficas registros duplicados.",
      ],
      subsecciones: [
        {
          id: "prompt-1-entender",
          titulo: "Paso 3.1 — Entender la estructura y auditar calidad",
          parrafos: [
            "Sube el archivo usando el botón + (Adjuntar archivos) junto a la barra de texto. Tu primer mensaje debe pedir una radiografía técnica antes de sacar cualquier conclusión de negocio.",
          ],
          codigo: {
            titulo: "Prompt 1: Diagnóstico inicial del archivo",
            lenguaje: "prompt",
            codigo: `Actúa como analista de datos senior. Acabo de adjuntar ventas_sucursales_ficticio.csv.
Antes de calcular métricas de negocio, inspecciona el archivo usando Python (pandas) y entrégame únicamente:
1. Cantidad exacta de filas y columnas.
2. Tipo de dato detectado por columna y ejemplo de 3 valores.
3. Conteo de valores nulos, filas exactamente duplicadas y formatos de fecha inconsistentes.
4. Valores únicos de las columnas "sucursal", "canal" y "estado".
No modifiques el archivo todavía; solo reporta el diagnóstico.`,
          },
        },
        {
          id: "prompt-2-limpiar",
          titulo: "Paso 3.2 — Limpiar fechas, duplicados y filtros de negocio",
          parrafos: [
            "Con el diagnóstico a la vista, define explícitamente las reglas de limpieza. Así evitas que la IA decida por su cuenta si eliminar o imputar un nulo o si incluir pedidos anulados en la facturación.",
          ],
          codigo: {
            titulo: "Prompt 2: Reglas explícitas de limpieza",
            lenguaje: "prompt",
            codigo: `Aplica estas reglas exactas de limpieza sobre el DataFrame:
1. Normaliza la columna "fecha" a formato YYYY-MM-DD interpretando las fechas con barra como día/mes/año (dayfirst=True).
2. Elimina filas exactamente duplicadas conservando la primera aparición.
3. Crea un DataFrame llamado df_valido que conserve solo filas con estado == "Pagado" y monto_neto_clp no nulo.
Muéstrame cuántas filas quedaron fuera por cada regla, imprime la tabla limpia completa y genera un enlace de descarga llamado ventas_limpias.csv.`,
          },
        },
        {
          id: "prompt-3-resumir",
          titulo: "Paso 3.3 — Resumir KPIs generales",
          parrafos: [
            "Una vez validado el dataset limpio, solicita los indicadores globales con formato numérico legible (separador de miles y sin inventar monedas distintas al peso chileno).",
          ],
          codigo: {
            titulo: "Prompt 3: Resumen ejecutivo de KPIs",
            lenguaje: "prompt",
            codigo: `Usando exclusivamente df_valido, calcula:
- Venta neta total en CLP y total de unidades vendidas.
- Ticket promedio por transacción y precio promedio ponderado por unidad.
- Rango de fechas cubierto (mínima y máxima).
Presenta los resultados en una tabla clara y muestra el código pandas que usaste.`,
          },
        },
        {
          id: "prompt-4-segmentar",
          titulo: "Paso 3.4 — Segmentar por sucursal, canal y categoría",
          parrafos: [
            "Los promedios globales esconden diferencias operativas. Pide una desagregación cruzada que muestre participación porcentual sobre el total para detectar dónde se concentra el ingreso.",
          ],
          codigo: {
            titulo: "Prompt 4: Tablas cruzadas y participación",
            lenguaje: "prompt",
            codigo: `Con df_valido, construye dos tablas ordenadas de mayor a menor venta neta:
1. Resumen por "sucursal" y "canal" con columnas: transacciones, unidades, venta_neta_clp y % participación sobre la venta total.
2. Resumen por "categoria" con las mismas métricas.
Verifica que la suma de las participaciones dé 100% y muéstralo en tabla Markdown.`,
          },
        },
        {
          id: "prompt-5-graficar",
          titulo: "Paso 3.5 — Graficar con criterio visual limpio",
          parrafos: [
            "ChatGPT genera gráficos con matplotlib en segundos, pero si no especificas títulos, etiquetas de datos y ordenamiento, suele producir barras desordenadas o ejes ilegibles.",
          ],
          codigo: {
            titulo: "Prompt 5: Gráfico descargable listo para presentación",
            lenguaje: "prompt",
            codigo: `Genera un gráfico de barras horizontales con matplotlib usando df_valido que compare la venta neta total (CLP) por sucursal, ordenado de mayor a menor.
Requisitos visuales:
- Sin leyenda redundante, fondo blanco limpio y cuadrícula sutil solo en el eje X.
- Etiqueta el valor exacto en CLP al costado de cada barra.
- Título descriptivo arriba y fuente de datos al pie ("Dataset ficticio de ventas").
Permíteme descargar la imagen en PNG de alta resolución.`,
          },
        },
        {
          id: "prompt-6-concluir",
          titulo: "Paso 3.6 — Concluir sin inventar causas",
          parrafos: [
            "Cierra el análisis pidiendo una síntesis ejecutiva estrictamente acotada a los números observados, evitando que el modelo fabrique explicaciones externas sobre estacionalidad o campañas que no están en el CSV.",
          ],
          codigo: {
            titulo: "Prompt 6: Síntesis ejecutiva basada solo en evidencia",
            lenguaje: "prompt",
            codigo: `Redacta 4 conclusiones ejecutivas y 2 próximos pasos de análisis basados únicamente en los resultados de df_valido y en los registros excluidos.
Regla estricta: no supongas causas externas (como clima, promociones o dotación) que no figuren en los datos; si falta información para explicar una diferencia, indícalo como pregunta abierta para el equipo comercial.`,
          },
        },
      ],
      captura: {
        id: "chatgpt-para-analisis-de-datos-paso-3",
        ratio: "16/9",
        alt: "Respuesta de ChatGPT mostrando la tabla resumen por sucursal y canal junto al gráfico de barras horizontales en PNG.",
        caption:
          "Secuencia de prompts ejecutada sobre el dataset limpio: tabla de participación y gráfico listo para descargar.",
      },
      verificaResultado:
        "Comprueba que en el Paso 3.2 se hayan excluido exactamente 3 filas (1 duplicado del 12 de septiembre, 1 anulado del 7 de septiembre y 1 pendiente con monto nulo del 6 de septiembre), dejando 9 transacciones pagadas válidas. Si la suma de participación en el Paso 3.4 no da 100%, pide revisar el redondeo.",
    },
    {
      id: "validar-con-python",
      titulo: "4. Validar los resultados con Python y pandas",
      esPasoHowTo: true,
      resumenHowTo:
        "Ejecuta localmente un script reproducible en Python 3.11+ y pandas 2.2+ para auditar los números obtenidos en ChatGPT antes de compartirlos.",
      parrafos: [
        "Aunque ChatGPT ejecute Python internamente, nunca debes enviar un informe a gerencia o a un cliente basándote solo en una captura del chat. La mejor práctica profesional es correr el cálculo equivalente en tu computador —o en Excel con tablas dinámicas— para confirmar que no hubo reinterpretaciones silenciosas de columnas.",
        "El siguiente script está escrito para Python 3.11+ y pandas 2.2+. Replica exactamente las reglas de limpieza y agregación de los prompts anteriores para que puedas contrastar fila por fila los resultados y conservar un proceso auditable en tu repositorio.",
      ],
      codigos: [
        {
          titulo: "Script de auditoría local (Python 3.11+ / pandas 2.2+)",
          lenguaje: "python",
          mostrarLineas: true,
          codigo: `import pandas as pd

# 1. Cargar el archivo CSV con codificación UTF-8
df = pd.read_csv("ventas_sucursales_ficticio.csv", encoding="utf-8")
print(f"Filas originales: {len(df)} | Columnas: {len(df.columns)}")

# 2. Normalizar fechas mixtas (YYYY-MM-DD y DD/MM/YYYY)
df["fecha"] = pd.to_datetime(
    df["fecha"], format="mixed", dayfirst=True, errors="coerce"
)

# 3. Eliminar duplicados exactos y filtrar solo ventas pagadas válidas
df_sin_dup = df.drop_duplicates(keep="first")
df_valido = df_sin_dup[
    (df_sin_dup["estado"] == "Pagado") & (df_sin_dup["monto_neto_clp"].notna())
].copy()

print(f"Filas válidas tras limpieza: {len(df_valido)}")

# 4. KPIs generales
venta_total = df_valido["monto_neto_clp"].sum()
unidades_total = df_valido["unidades"].sum()
ticket_promedio = df_valido["monto_neto_clp"].mean()

print(f"Venta neta total: $ {venta_total:,.0f} CLP")
print(f"Unidades totales: {unidades_total}")
print(f"Ticket promedio: $ {ticket_promedio:,.0f} CLP")

# 5. Resumen por sucursal y canal con porcentaje de participación
resumen_sucursal = (
    df_valido.groupby(["sucursal", "canal"], as_index=False)
    .agg(
        transacciones=("monto_neto_clp", "count"),
        unidades=("unidades", "sum"),
        venta_neta_clp=("monto_neto_clp", "sum"),
    )
    .sort_values("venta_neta_clp", ascending=False)
)
resumen_sucursal["participacion_pct"] = (
    resumen_sucursal["venta_neta_clp"] / venta_total * 100
).round(2)

print("\\nResumen por sucursal y canal:")
print(resumen_sucursal.to_string(index=False))`,
          nota: "El parámetro format='mixed' con dayfirst=True requiere pandas 2.0 o superior (probado para pandas 2.2+).",
        },
      ],
      captura: {
        id: "chatgpt-para-analisis-de-datos-paso-4",
        ratio: "16/9",
        alt: "Terminal ejecutando el script Python de validación y mostrando las 9 filas válidas, venta total y tabla por sucursal.",
        caption:
          "Ejecución local en Python 3.11+ y pandas 2.2+: la cifra de venta total y la participación deben coincidir exactamente con el chat.",
      },
      verificaResultado:
        "Contrasta la salida de tu terminal con la tabla del Paso 3.3 y 3.4: el script debe reportar 12 filas originales, 9 filas válidas tras limpieza y exactamente la misma suma de venta neta total y porcentajes por sucursal.",
    },
    {
      id: "limites-planes-privacidad",
      titulo: "5. Límites, planes y privacidad de tus datos",
      parrafos: [
        "La disponibilidad de análisis avanzado de archivos, la cuota de mensajes por ventana de tiempo y las garantías de privacidad cambian de manera relevante según el nivel de suscripción que utilices. Según la documentación oficial de OpenAI, consultado el 21 de noviembre de 2026 (https://help.openai.com/), los planes personales y corporativos se diferencian tanto en capacidad operativa como en el tratamiento de los archivos adjuntos.",
        "En el nivel gratuito (Free), el acceso al análisis de datos y carga de archivos existe con cuotas más acotadas y menor holgura para sesiones largas con múltiples iteraciones de gráficos o archivos pesados. Los planes de pago individuales (como Plus y Pro) amplían la capacidad de uso, permiten trabajar de forma más fluida con múltiples hojas o scripts iterativos y dan acceso prioritario a los modelos más recientes, aunque siguen sujetos a las políticas de cuentas de consumidor.",
        "La diferencia crítica para cualquier empresa en Chile está en el uso de tus datos para entrenamiento. En cuentas de consumidor (Free, Plus y Pro), OpenAI puede utilizar conversaciones y archivos subidos para mejorar sus modelos por defecto, salvo que desactives la opción «Mejorar el modelo para todos» en Configuración → Controles de datos antes de cargar el archivo (el cambio no es retroactivo). En cambio, en los planes ChatGPT Business y Enterprise, el contenido y los archivos cargados quedan excluidos del entrenamiento por defecto y operan bajo términos comerciales de seguridad y retención.",
        "Si necesitas contrastar cómo aborda la competencia este flujo, revisa nuestra guía de [cómo usar Claude para análisis de datos](/guias/como-usar-claude-para-analisis-de-datos) y la comparativa detallada en [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos).",
      ],
      tabla: {
        caption:
          "Comparativa cualitativa de privacidad y uso para datos según plan (según la documentación oficial de OpenAI, consultado el 21 de noviembre de 2026).",
        encabezados: [
          "Aspecto",
          "Plan Free",
          "Planes Plus / Pro (consumidor)",
          "Planes Business / Enterprise",
        ],
        filas: [
          [
            "Análisis de archivos con Python",
            "Disponible con cuotas limitadas de carga e iteración",
            "Mayor capacidad de mensajes, archivos y sesiones extendidas",
            "Capacidad ampliada con administración centralizada de espacio",
          ],
          [
            "Entrenamiento con tus archivos",
            "Sí por defecto; requiere desactivar Controles de datos antes de subir",
            "Sí por defecto; requiere desactivar Controles de datos antes de subir",
            "Excluido por defecto según términos comerciales de OpenAI",
          ],
          [
            "Recomendación para datos con RUT o sueldos",
            "Prohibido subir datos reales; anonimizar siempre",
            "No subir datos reales sin anonimización estricta",
            "Apto sujeto a política interna de TI y contrato vigente",
          ],
          [
            "Retención al borrar el chat",
            "El archivo puede persistir en biblioteca hasta eliminarlo aparte",
            "El archivo puede persistir en biblioteca hasta eliminarlo aparte",
            "Políticas configurables de retención y cumplimiento por organización",
          ],
        ],
      },
      alerta: {
        tipo: "warning",
        titulo: "Regla práctica de anonimización en Chile",
        texto:
          "Antes de subir un archivo a una cuenta personal, elimina columnas de RUT, nombre, correo, teléfono y dirección exacta. Si necesitas analizar antigüedad o comuna, quédate solo con esos atributos agregados y un ID numérico ficticio.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "ChatGPT mezcla fechas chilenas (DD/MM/AAAA) con estadounidenses (MM/DD/AAAA)",
      causa:
        "Por defecto, pandas interpreta fechas ambiguas como 05/09/2026 asumiendo mes primero (9 de mayo) si no se especifica dayfirst=True.",
      solucion:
        "Indica explícitamente en el prompt de limpieza que las fechas están en formato día/mes/año y exige que ejecute pd.to_datetime(..., dayfirst=True).",
    },
    {
      error: "Los montos aparecen como texto y no se pueden sumar",
      causa:
        "Las columnas exportadas desde ERP suelen incluir símbolos '$', puntos de miles o espacios invisibles que obligan a leer la columna como string.",
      solucion:
        "Pide limpiar caracteres no numéricos antes de convertir a float o int, y revisa que no haya confundido separador decimal con separador de miles.",
    },
    {
      error: "La sesión se reinicia y olvida el DataFrame limpio",
      causa:
        "El contenedor temporal de Python en ChatGPT expira tras un período de inactividad, borrando las variables en memoria.",
      solucion:
        "Descarga siempre tu archivo limpio (ventas_limpias.csv) en el Paso 3.2. Si la sesión caduca, vuelve a subir directamente esa versión limpia.",
    },
    {
      error: "El análisis incluye filas de subtotales o pedidos anulados",
      causa:
        "Se pidió resumir el archivo de inmediato sin auditar primero valores únicos de estado ni verificar filas resumen al pie de la hoja.",
      solucion:
        "Respeta el Prompt 1 de diagnóstico antes de calcular KPIs y fija reglas explícitas de filtrado por estado.",
    },
  ],
  plantilla: {
    titulo: "Pack de prompts + dataset limpio y script de validación",
    descripcion:
      "Próximamente podrás descargar aquí el archivo CSV de práctica, la plantilla de prompts en texto plano y el notebook de validación en pandas.",
  },
  faqs: [
    {
      q: "¿ChatGPT inventa los números cuando analiza un Excel o CSV?",
      a: "Cuando adjuntas el archivo y el chat ejecuta el entorno de análisis en Python, los cálculos provienen de código real de pandas y numpy. Sin embargo, puede equivocarse al interpretar encabezados, fechas o filtros si tu instrucción es ambigua, por eso siempre debes revisar el código desplegable y validar totales.",
    },
    {
      q: "¿Es mejor subir un archivo .csv o un .xlsx?",
      a: "Para análisis de datos tabulares, un .csv en UTF-8 con una sola fila de encabezados suele dar menos problemas porque elimina hojas ocultas, celdas combinadas y formatos visuales. Si subes un .xlsx con varias pestañas, indica en el primer prompt exactamente qué hoja debe leer.",
    },
    {
      q: "¿Cómo desactivo el uso de mis archivos para entrenamiento en una cuenta personal?",
      a: "Entra a Configuración → Controles de datos y desactiva «Mejorar el modelo para todos». Debes hacerlo antes de subir el archivo, ya que el cambio aplica hacia adelante y no borra historial previo.",
    },
    {
      q: "¿Puedo usar ChatGPT para limpiar una planilla y descargar el resultado en Excel?",
      a: "Sí. Puedes pedirle explícitamente que exporte el DataFrame limpio como archivo .xlsx o .csv y te entregue el enlace de descarga directo al final de la respuesta.",
    },
    {
      q: "¿Cuándo conviene pasar de ChatGPT a Python local o Power BI?",
      a: "Cuando el análisis deja de ser puntual y se vuelve semanal o mensual, cuando superas la comodidad de manipular archivos manualmente o cuando necesitas conectarte a bases SQL con datos confidenciales sin subir archivos a la nube pública.",
    },
  ],
  relacionadas: [
    "gemini-para-analisis-de-datos",
    "ia-para-excel-chatgpt-claude-gemini",
    "automatizar-excel-con-python",
  ],
  enlacesExternos: [
    {
      label: "Centro de ayuda oficial de OpenAI sobre ChatGPT y datos",
      url: "https://help.openai.com/",
      fuente: "OpenAI",
    },
    {
      label: "Información oficial de planes y privacidad empresarial de ChatGPT",
      url: "https://openai.com/chatgpt/pricing/",
      fuente: "OpenAI",
    },
    {
      label: "Documentación oficial de pandas (pd.to_datetime y groupby)",
      url: "https://pandas.pydata.org/docs/",
      fuente: "pandas",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Flujo alternativo en Claude con Artifacts interactivos y manejo de planillas.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa práctica para elegir entre ambos según tamaño de archivo y precisión.",
    },
    {
      label: "Curso de Análisis de Datos",
      href: "/cursos/analisis-de-datos",
      descripcion: "Ruta completa de SQL, Excel, Power BI y Python aplicado a datos reales.",
    },
  ],
};

export default guia;
