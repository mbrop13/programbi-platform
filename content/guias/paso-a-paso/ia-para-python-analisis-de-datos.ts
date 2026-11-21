import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-python-analisis-de-datos",
  title: "IA para Python: analiza datos con ChatGPT, Claude o Gemini",
  meta: "Usa IA para escribir y depurar código Python de análisis de datos con pandas: prompts, buenas prácticas y cómo verificar que el código hace lo correcto.",
  h1: "Cómo usar IA para programar análisis de datos en Python",
  subtitle:
    "Aprende a usar ChatGPT, Claude o Gemini como copiloto técnico en Python 3.11+ y pandas 2.2+: elige tu entorno, entrega un esquema de CSV ficticio, genera scripts de limpieza, agrupación y gráficos, depura tracebacks y valida los resultados con pruebas automáticas.",
  keywordPrincipal: "ia para python",
  keywords: [
    "ia para python",
    "ChatGPT Python",
    "IA para programar en Python",
    "mejor IA para Python",
    "Claude Python",
  ],
  curso: "python",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Nunca subas archivos CSV o Excel con datos reales de clientes, RUT, correos o remuneraciones a chats públicos de IA. Para escribir y depurar scripts en Python, la IA solo necesita las primeras 5 filas de un CSV sintético con los mismos nombres y tipos de columnas; ejecuta siempre el script final en tu propio computador sobre los datos reales.",
  en30Segundos: {
    queLogras:
      "Pasar de una pregunta de negocio a un script funcional en Python 3.11+ con pandas y matplotlib usando prompts estructurados, y blindar el código con aserciones simples para detectar errores silenciosos.",
    herramienta: "Python 3.11+ (pandas 2.2+, matplotlib) + ChatGPT / Claude / Gemini",
    tiempo: "30 minutos",
    bullets: [
      "Elegir entre Google Colab, JupyterLab o VS Code según tu computador y nivel de privacidad.",
      "Trabajar con un dataset CSV ficticio incluido para probar cada prompt sin riesgo.",
      "Generar código moderno de pandas para leer, limpiar, agrupar y graficar datos.",
      "Depurar tracebacks y validar el script con pruebas assert de conteo de filas, nulos y totales.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Elegir entorno",
      resumen: "Compara Google Colab, JupyterLab y VS Code.",
      anchorId: "entorno-python",
      icono: "terminal",
    },
    {
      numero: 2,
      titulo: "Dataset ejemplo",
      resumen: "Usa un CSV sintético de ventas para probar prompts.",
      anchorId: "dataset-ejemplo",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Prompts pandas",
      resumen: "Lee, limpia, agrupa y grafica con código Python 3.11+.",
      anchorId: "prompts-pandas",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Depurar errores",
      resumen: "Entrega tracebacks completos y contexto de versiones.",
      anchorId: "depurar-errores",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Validar con assert",
      resumen: "Comprueba filas, nulos y cuadratura antes de confiar.",
      anchorId: "pruebas-validacion",
      icono: "check",
    },
    {
      numero: 6,
      titulo: "Límites de la IA",
      resumen: "Reconoce cuándo no delegar sin revisar cada línea.",
      anchorId: "cuando-no-confiar",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Python 3.11 o superior, pandas 2.2+, matplotlib 3.8+",
    lista: [
      "Entorno local (VS Code con extensión Python o JupyterLab) o entorno en la nube (Google Colab).",
      "Paquetes instalados: pandas y matplotlib (opcionalmente openpyxl si lees archivos .xlsx).",
      "Cuenta en ChatGPT, Claude o Gemini para generar y revisar fragmentos de código.",
    ],
    compatibilidadMacWeb:
      "Python, JupyterLab y VS Code funcionan de manera idéntica en Windows, macOS y Linux. Google Colab corre directamente en cualquier navegador web sin instalar nada, aunque para datos confidenciales de empresa se recomienda ejecución local.",
  },
  herramientasHowTo: ["Python 3.11+ / pandas 2.2+", "VS Code / Jupyter / Colab", "ChatGPT / Claude / Gemini"],
  insumosHowTo: ["Archivo ventas_muestra.csv sintético", "Prompts estructurados"],
  secciones: [
    {
      id: "entorno-python",
      titulo: "1. Entorno: Jupyter, VS Code o Google Colab",
      parrafos: [
        "Antes de pedirle una sola línea de código a la IA, define dónde la vas a ejecutar. Muchos principiantes copian un script en el bloc de notas y no saben cómo correrlo, o mezclan entornos en la nube con archivos guardados en su disco C: sin entender por qué Python dice FileNotFoundError.",
        "La buena noticia es que hoy tienes tres opciones sólidas y gratuitas. Si estás partiendo y quieres probar con datos ficticios en dos minutos, Google Colab te da un cuaderno en el navegador con pandas y matplotlib preinstalados. Si trabajas con archivos corporativos que no deben salir de tu equipo o quieres construir scripts automatizados reutilizables, conviene usar JupyterLab local o Visual Studio Code.",
        "Al elegir tu entorno, fíjate también en cómo gestionar las librerías: en local conviene crear un entorno virtual (venv) por proyecto para que una actualización de pandas no rompa scripts antiguos. Cuando trabajes en VS Code, puedes abrir tanto archivos .py para automatizaciones programadas como notebooks .ipynb para explorar datos celda por celda e inspeccionar las primeras filas de cada tabla intermedia antes de avanzar al siguiente cálculo.",
      ],
      tabla: {
        caption: "Comparativa de entornos para análisis de datos con Python e IA",
        encabezados: [
          "Entorno",
          "Instalación",
          "Privacidad de archivos",
          "Cuándo elegirlo",
        ],
        filas: [
          [
            "Google Colab",
            "Cero instalación (navegador)",
            "El archivo sube temporalmente a la nube de Google",
            "Para aprender, prototipar y probar datasets sintéticos rápidos",
          ],
          [
            "JupyterLab / Notebook local",
            "Python + pip install jupyterlab",
            "100 % local en tu disco",
            "Para exploración interactiva paso a paso con datos de empresa",
          ],
          [
            "VS Code (con .py y .ipynb)",
            "VS Code + extensión oficial de Python",
            "100 % local en tu disco",
            "Para scripts en producción, control de versiones Git y notebooks combinados",
          ],
        ],
      },
    },
    {
      id: "dataset-ejemplo",
      titulo: "2. Dataset de ejemplo incluido (CSV ficticio)",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea el archivo ventas_muestra.csv con datos sintéticos sucios a propósito (espacios, nulos y formatos mixtos) para probar los prompts sin exponer datos reales.",
      parrafos: [
        "Para que puedas probar todos los prompts de esta guía sin riesgo de privacidad, trabajaremos con un pequeño CSV sintético llamado ventas_muestra.csv. Incluye intencionalmente los problemas reales que aparecen en exportaciones comerciales: espacios extra en sucursales, una fila con monto nulo y fechas en formato ISO.",
        "Guarda este contenido en un archivo ventas_muestra.csv dentro de la misma carpeta de tu notebook o script. Cuando le pidas código a ChatGPT o Claude, pega únicamente el encabezado y estas seis filas ficticias como referencia de esquema.",
      ],
      codigos: [
        {
          titulo: "Archivo ventas_muestra.csv (datos 100 % ficticios)",
          lenguaje: "bash",
          codigo: `fecha,sucursal,categoria,unidades,precio_unitario,estado
2026-10-01, Santiago Centro ,Accesorios,3,15990,Pagada
2026-10-02,santiago centro,Computación,1,450000,Pagada
2026-10-03,Valparaíso,Accesorios,2,,Pagada
2026-10-04,Concepción,Oficina,5,24990,Anulada
2026-10-05,Valparaíso,Computación,2,380000,Pagada
2026-10-06, Santiago Centro ,Oficina,4,19990,Pagada`,
          nota: "Nota que la fila 3 tiene precio_unitario vacío (NaN) y la fila 4 tiene estado 'Anulada'.",
        },
      ],
      captura: {
        id: "ia-para-python-analisis-de-datos-paso-1",
        alt: "Archivo ventas_muestra.csv abierto en VS Code junto a una celda de notebook lista para importar pandas",
        caption:
          "Mantén el CSV sintético en la misma carpeta que tu script para evitar errores de ruta al probar el código de la IA.",
        ratio: "16/9",
      },
    },
    {
      id: "prompts-pandas",
      titulo: "3. Prompts para pandas: leer, limpiar, agrupar y graficar",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa prompts específicos declarando Python 3.11+ y pandas 2.2+ para obtener un pipeline limpio de lectura, limpieza, agregación y visualización.",
      parrafos: [
        "Cuando pides código Python sin especificar versiones, es frecuente que la IA mezcle sintaxis antigua de pandas (como append o inplace=True innecesario) con advertencias de deprecación en pandas 2.2+. Declarar desde el inicio «Python 3.11+, pandas 2.2+, sin inplace=True y usando encadenamiento o asignaciones explícitas» mejora de inmediato la calidad del código.",
        "Divide tu pedido en cuatro etapas claras: lectura tipada del CSV, limpieza determinista, agrupación de métricas y gráfico legible con matplotlib. A continuación tienes los prompts copiables y el código Python completo verificado en sintaxis.",
      ],
      codigos: [
        {
          titulo: "Prompt 1 — Leer y limpiar el CSV con pandas 2.2+",
          lenguaje: "prompt",
          codigo: `Actúa como desarrollador senior de Python para análisis de datos.
Entorno: Python 3.11+, pandas 2.2+. Evita inplace=True y avisos de SettingWithCopyWarning.
Tengo el archivo "ventas_muestra.csv" con columnas: fecha, sucursal, categoria, unidades, precio_unitario, estado.
Escribe el código para:
1) Leer el CSV parseando "fecha" como datetime.
2) Normalizar "sucursal" quitando espacios laterales y aplicando formato título (.str.strip().str.title()).
3) Filtrar solo filas donde estado == "Pagada" y eliminar filas con precio_unitario nulo, guardando copia limpia en df_limpio.
4) Crear la columna "venta_total" = unidades * precio_unitario.`,
        },
        {
          titulo: "Prompt 2 — Agrupar ventas por sucursal y categoría",
          lenguaje: "prompt",
          codigo: `Usando df_limpio del paso anterior en pandas 2.2+:
Agrupa por "sucursal" y "categoria" calculando:
- total_unidades (suma de unidades)
- venta_total_clp (suma de venta_total)
- ticket_promedio (promedio de venta_total)
Ordena el resultado de mayor a menor según venta_total_clp y reinicia el índice.`,
        },
        {
          titulo: "Prompt 3 — Gráfico de barras horizontales claro en matplotlib",
          lenguaje: "prompt",
          codigo: `Con el resumen agrupado por sucursal (suma de venta_total_clp), genera un gráfico de barras horizontales en matplotlib 3.8+.
Requisitos:
- Ordena las barras de menor a mayor para que la sucursal líder quede arriba.
- Agrega título claro, etiqueta del eje X en CLP y valores numéricos al final de cada barra.
- Usa plt.tight_layout() y plt.show().`,
        },
        {
          titulo: "Código Python 3.11+ / pandas 2.2+ / matplotlib verificado",
          lenguaje: "python",
          codigo: `import pandas as pd
import matplotlib.pyplot as plt

# 1. Lectura con parseo de fecha
df = pd.read_csv("ventas_muestra.csv", parse_dates=["fecha"])

# 2. Limpieza y normalización sin inplace=True
df_limpio = (
    df.loc[df["estado"].eq("Pagada")]
    .dropna(subset=["precio_unitario"])
    .copy()
)
df_limpio["sucursal"] = df_limpio["sucursal"].str.strip().str.title()
df_limpio["venta_total"] = df_limpio["unidades"] * df_limpio["precio_unitario"]

# 3. Agrupación por sucursal y categoría
resumen = (
    df_limpio.groupby(["sucursal", "categoria"], as_index=False)
    .agg(
        total_unidades=("unidades", "sum"),
        venta_total_clp=("venta_total", "sum"),
        ticket_promedio=("venta_total", "mean"),
    )
    .sort_values("venta_total_clp", ascending=False)
    .reset_index(drop=True)
)
print(resumen)

# 4. Gráfico de barras horizontales por sucursal
por_sucursal = (
    df_limpio.groupby("sucursal", as_index=False)["venta_total"]
    .sum()
    .sort_values("venta_total", ascending=True)
)

fig, ax = plt.subplots(figsize=(8, 4))
barras = ax.barh(por_sucursal["sucursal"], por_sucursal["venta_total"], color="#2563EB")
ax.set_title("Venta total pagada por sucursal (CLP)")
ax.set_xlabel("Venta total (CLP)")
ax.bar_label(barras, fmt="%.0f", padding=4)
plt.tight_layout()
plt.show()`,
        },
      ],
      captura: {
        id: "ia-para-python-analisis-de-datos-paso-2",
        alt: "Notebook ejecutando script de pandas 2.2 y mostrando tabla resumen junto al gráfico de barras horizontales",
        caption:
          "Ejecuta el código por bloques en tu notebook para inspeccionar df_limpio y resumen antes de graficar.",
        ratio: "16/9",
      },
      verificaResultado:
        "Para el dataset de muestra, df_limpio debe conservar exactamente 4 filas (se excluyen la fila Anulada y la fila sin precio_unitario), y Santiago Centro debe sumar 577.930 CLP en total.",
    },
    {
      id: "depurar-errores",
      titulo: "4. Depurar errores con IA usando tracebacks completos",
      esPasoHowTo: true,
      resumenHowTo:
        "Copia el traceback completo junto a df.dtypes y df.shape (sin datos personales) para que la IA diagnostique la causa raíz exacta en un solo intento.",
      parrafos: [
        "Cuando un script falla, el peor hábito es decirle a la IA «me da error, arréglalo». Sin ver la línea exacta ni el tipo de dato real de tus columnas, el modelo adivinará causas genéricas.",
        "Para depurar en segundos, pega tres cosas: el fragmento de código que falló, el mensaje completo del traceback (desde la última llamada hacia abajo) y la salida de df.dtypes. Nunca pegues filas con datos confidenciales en el mensaje de error.",
        "Además, revisa siempre la última línea del traceback antes de copiar el código corregido: en Python, la causa real suele aparecer abajo del todo (por ejemplo, KeyError: 'Monto' cuando la columna en el archivo se llama 'monto_neto', o ValueError al intentar convertir fechas mixtas). Si le pides a la IA que imprima df.columns.tolist() y df.head(3) como diagnóstico previo, detectarás en segundos diferencias de mayúsculas, tildes o espacios ocultos en los encabezados del CSV.",
      ],
      codigos: [
        {
          titulo: "Prompt 4 — Diagnóstico preciso de traceback",
          lenguaje: "prompt",
          codigo: `Al ejecutar este fragmento en Python 3.11 / pandas 2.2 obtengo el error de abajo.
Fragmento:
df["venta_total"] = df["unidades"] * df["precio_unitario"]

Tipos de columna (df.dtypes):
unidades           int64
precio_unitario   object

Traceback:
TypeError: can't multiply sequence by non-int of type 'float' (o similar al mezclar string con número)

Explica por qué ocurre según los dtypes y dame la corrección segura con pd.to_numeric(..., errors="coerce") reportando cuántos valores no numéricos quedaron como NaN.`,
        },
      ],
      captura: {
        id: "ia-para-python-analisis-de-datos-paso-3",
        alt: "Salida de terminal mostrando TypeError en pandas y la corrección usando pd.to_numeric",
        caption:
          "Incluir df.dtypes en el prompt permite a la IA detectar al instante si una columna numérica vino leída como texto (object).",
        ratio: "16/9",
      },
      verificaResultado:
        "Después de aplicar pd.to_numeric(errors='coerce'), imprime el conteo de nulos nuevos para asegurarte de que no convertiste silenciosamente miles de filas válidas con coma decimal en NaN.",
    },
    {
      id: "pruebas-validacion",
      titulo: "5. Pruebas simples para validar el código generado",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrega sentencias assert al final de tu script para verificar conteo de filas, ausencia de nulos críticos y conservación de totales tras agrupar.",
      parrafos: [
        "Un script de Python puede correr sin lanzar ni un solo error rojo y aun así estar calculando mal: por ejemplo, duplicar filas tras un merge mal especificado o descartar la mitad de las sucursales por un filtro mal escrito. La forma más rápida de blindarte es pedirle a la IA tres o cuatro aserciones (assert) de control de calidad.",
        "Las aserciones detienen el script inmediatamente si una regla matemática básica se rompe, obligándote a revisar qué cambió en los datos de entrada.",
        "Piensa en estas comprobaciones como el equivalente en Python a cuadrar el total general de una tabla dinámica contra la suma de la base original en Excel. Antes de exportar un archivo procesado o generar gráficos para gerencia, valida siempre cuatro invariantes: el rango de fechas cargado coincide con el período esperado, el conteo de filas filtradas tiene sentido frente al archivo crudo, no quedan valores nulos en columnas clave de agrupación y la suma monetaria total antes y después de agrupar coincide exactamente.",
      ],
      codigos: [
        {
          titulo: "Prompt 5 — Generar bloque de pruebas assert de cuadratura",
          lenguaje: "prompt",
          codigo: `Escribe un bloque de validaciones con assert en Python para ejecutar después de crear df_limpio y resumen.
Debe comprobar:
1) Que df_limpio no esté vacío y tenga menos o igual filas que df original.
2) Que no existan valores nulos en "sucursal", "categoria" ni "venta_total".
3) Que la suma de venta_total en df_limpio sea igual a la suma de venta_total_clp en resumen (tolerancia 1e-6).
4) Que no queden espacios al inicio o final en "sucursal".`,
        },
        {
          titulo: "Bloque de validación con assert listo para usar",
          lenguaje: "python",
          codigo: `assert not df_limpio.empty, "df_limpio quedó vacío tras los filtros"
assert len(df_limpio) <= len(df), "Aparecieron filas inesperadas"
assert df_limpio[["sucursal", "categoria", "venta_total"]].isna().sum().sum() == 0, "Hay nulos críticos"
assert (df_limpio["sucursal"] == df_limpio["sucursal"].str.strip()).all(), "Quedaron espacios sin limpiar"
assert abs(df_limpio["venta_total"].sum() - resumen["venta_total_clp"].sum()) < 1e-6, "El resumen no cuadra con el detalle"
print("Todas las validaciones pasaron correctamente.")`,
        },
      ],
      captura: {
        id: "ia-para-python-analisis-de-datos-paso-4",
        alt: "Celda de Python ejecutando cinco sentencias assert e imprimiendo mensaje de validación exitosa",
        caption:
          "Incluye siempre una aserción de cuadratura entre la tabla limpia y la tabla agrupada antes de exportar resultados.",
        ratio: "16/9",
      },
      verificaResultado:
        "Prueba cambiar intencionalmente un valor en resumen o dejar un espacio para confirmar que el assert falla y te avisa cuando algo no cuadra.",
    },
    {
      id: "cuando-no-confiar",
      titulo: "6. Cuándo no confiar en el código generado por la IA",
      parrafos: [
        "Saber cuándo frenar y auditar línea por línea es la habilidad que separa a un analista confiable de alguien que copia código a ciegas. Si quieres comparar qué asistente responde mejor en Python frente a otros lenguajes, revisa nuestra comparativa de Claude vs ChatGPT para análisis de datos o la guía de cómo usar Claude para análisis de datos.",
      ],
      lista: [
        "Cruces (merge / join) con claves duplicadas: si la IA escribe pd.merge(a, b, on='id') sin especificar validate='many_to_one', una clave repetida en b multiplicará tus ventas sin lanzar error.",
        "Manejo de zonas horarias y formatos de fecha ambiguos: cuando mezclas '03/04/2026' (3 de abril vs 4 de marzo), la IA puede elegir dayfirst=False por defecto y voltear meses y días.",
        "Eliminación silenciosa de datos con dropna() global: nunca aceptes un df.dropna() sin parámetro subset=[...], porque borrará toda la fila si falta un dato secundario irrelevante.",
        "Lectura de archivos con separador decimal coma o encoding latin-1: en exportaciones de sistemas locales en Chile, si no especificas encoding='utf-8-sig' o 'latin-1' y sep=';', el script puede fallar o corromper tildes.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "FileNotFoundError: [Errno 2] No such file or directory: 'ventas_muestra.csv'",
      causa:
        "El script se ejecuta desde una carpeta de trabajo distinta a donde guardaste el CSV, o en Google Colab olvidaste subir el archivo a la sesión.",
      solucion:
        "Usa pathlib.Path(__file__).parent (en scripts .py) o verifica os.getcwd() en tu notebook para confirmar la ruta exacta.",
    },
    {
      error: "UnicodeDecodeError al leer un CSV exportado desde Excel o un ERP en Chile",
      causa:
        "El archivo fue guardado con codificación Windows-1252 / Latin-1 (con tildes y eñes), pero pandas intenta leerlo en UTF-8 por defecto.",
      solucion:
        "Indica encoding='latin-1' (o 'cp1252') en pd.read_csv() y especifica sep=';' si el CSV usa punto y coma.",
    },
    {
      error: "La IA sugiere código con FutureWarning o SettingWithCopyWarning en pandas 2.2+",
      causa:
        "El modelo mezcló patrones antiguos de pandas 1.x como df[condicion]['col'] = valor o inplace=True.",
      solucion:
        "Usa .copy() al crear subconjuntos filtrados y asigna con df_limpio.loc[filas, 'col'] = valor o asignación directa sobre la copia.",
    },
    {
      error: "Los totales se duplican después de hacer un pd.merge() sugerido por la IA",
      causa:
        "La tabla derecha del merge tenía registros duplicados en la clave de unión, generando un producto cartesiano parcial.",
      solucion:
        "Agrega siempre el parámetro validate='many_to_one' en pd.merge() para que pandas lance un error explícito si hay duplicados en la tabla de referencia.",
    },
  ],
  plantilla: {
    titulo: "Notebook .ipynb base con dataset sintético y validaciones",
    descripcion:
      "Próximamente podrás descargar aquí el notebook listo con ventas_muestra.csv, el pipeline limpio en pandas 2.2+ y las pruebas assert integradas.",
  },
  faqs: [
    {
      q: "¿Necesito saber programar en Python antes de usar IA para analizar datos?",
      a: "No necesitas memorizar toda la sintaxis de pandas, pero sí debes entender conceptos básicos: qué es un DataFrame, qué diferencia hay entre texto y número, qué hace un filtro y qué significa agrupar o cruzar tablas. Sin esa base no podrás detectar si el código hace algo distinto a lo que pediste.",
    },
    {
      q: "¿Qué IA es mejor para escribir código Python con pandas: ChatGPT o Claude?",
      a: "Ambos generan código sólido en Python 3.11+ y pandas 2.2+ cuando les entregas el esquema de columnas y las versiones. Muchos analistas prefieren Claude para scripts largos de limpieza y refactorización, y ChatGPT cuando necesitan iterar rápido sobre gráficos o explorar ideas en formato interactivo.",
    },
    {
      q: "¿Es seguro subir un Excel de mi empresa a Google Colab o ChatGPT?",
      a: "Si contiene datos personales, clientes, RUT, sueldos o información financiera confidencial, no lo subas a chats públicos ni a entornos gratuitos sin autorización de seguridad de tu empresa. Prueba siempre el código con un CSV sintético de 5 filas y corre el script final en tu computador local.",
    },
    {
      q: "¿Cómo hago si quiero automatizar archivos Excel directamente con Python?",
      a: "Puedes combinar pandas con openpyxl para leer múltiples hojas, limpiar datos y exportar reportes formateados automáticamente. Revisa nuestra guía específica sobre cómo automatizar Excel con Python.",
    },
  ],
  relacionadas: [
    "automatizar-excel-con-python",
    "python-para-analisis-de-datos",
    "chatgpt-para-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de pandas",
      url: "https://pandas.pydata.org/docs/",
      fuente: "pandas",
    },
    {
      label: "Documentación oficial de Matplotlib",
      url: "https://matplotlib.org/stable/users/index.html",
      fuente: "Matplotlib",
    },
    {
      label: "Tutorial oficial de Python 3",
      url: "https://docs.python.org/es/3/tutorial/",
      fuente: "Python.org",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende flujos avanzados de análisis y generación de scripts con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa práctica en Python, SQL, Excel y Power BI.",
    },
  ],
};

export default guia;
