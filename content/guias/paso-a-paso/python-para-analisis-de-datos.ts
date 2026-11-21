import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "python-para-analisis-de-datos",
  title: "Python para análisis de datos: guía desde cero con pandas",
  meta: "Aprende Python para análisis de datos: instalar, Jupyter, pandas, limpieza, agrupaciones y gráficos con un caso real. Código explicado y probado.",
  h1: "Python para análisis de datos desde cero",
  subtitle:
    "Da el salto desde planillas manuales hacia análisis reproducibles: instala Python 3.11+ y Jupyter, domina DataFrames con pandas 2.2+, limpia datos sucios, calcula resúmenes con groupby y construye gráficos claros con matplotlib sobre un caso comercial completo.",
  keywordPrincipal: "python para análisis de datos",
  keywords: [
    "python para análisis de datos",
    "Python para análisis de datos desde cero",
    "pandas Python guía",
    "libro Wes McKinney Python",
  ],
  curso: "python",
  herramienta: "Python",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT45M",
  esInsignia: true,
  en30Segundos: {
    queLogras:
      "Configurar un entorno profesional de análisis de datos en Python 3.11+, cargar un CSV comercial con pandas 2.2+, corregir fechas, textos y nulos, generar tablas dinámicas en código y exportar gráficos listos para un informe.",
    herramienta: "Python 3.11+ · Jupyter · pandas · matplotlib",
    tiempo: "45 minutos",
    bullets: [
      "Entender cuándo conviene usar Python frente a Excel o SQL en proyectos reales.",
      "Instalar Python, crear un entorno aislado con uv o Anaconda y abrir Jupyter Notebook.",
      "Manipular DataFrames en pandas: lectura, filtros booleanos, columnas calculadas y limpieza.",
      "Agrupar métricas con groupby y pivot_table, visualizar con matplotlib y ejecutar un flujo completo reproducible.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Por qué Python",
      resumen: "Compara Python frente a Excel y SQL.",
      anchorId: "por-que-python-datos",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Entorno y Jupyter",
      resumen: "Instala Python 3.11+, uv/Anaconda y Notebook.",
      anchorId: "instalacion-jupyter",
      icono: "terminal",
    },
    {
      numero: 3,
      titulo: "Dataset comercial",
      resumen: "Crea el CSV ficticio para practicar.",
      anchorId: "dataset-comercial-ejemplo",
      icono: "file",
    },
    {
      numero: 4,
      titulo: "pandas básico",
      resumen: "Lee, filtra y crea columnas calculadas.",
      anchorId: "pandas-basico-filtrar",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "Limpieza de datos",
      resumen: "Corrige nulos, fechas y espacios en texto.",
      anchorId: "limpieza-datos-pandas",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Agrupar y graficar",
      resumen: "Usa groupby, pivot_table y matplotlib.",
      anchorId: "agrupar-pivotear-graficar",
      icono: "chart",
    },
    {
      numero: 7,
      titulo: "Caso completo",
      resumen: "Script integrado de punta a punta y bibliografía.",
      anchorId: "caso-completo-referencias",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Python 3.11 o superior, pandas >= 2.2 y matplotlib >= 3.8",
    lista: [
      "Computador con Windows 10/11, macOS o Linux y conexión a internet para descargar paquetes.",
      "Editor de código (Visual Studio Code con la extensión de Jupyter) o navegador para JupyterLab / Notebook.",
      "No necesitas experiencia previa programando, aunque ayuda haber trabajado con tablas en Excel.",
    ],
    compatibilidadMacWeb:
      "Todo el código de esta guía funciona de manera idéntica en Windows, macOS y Linux, así como en entornos en la nube como Google Colab o GitHub Codespaces.",
  },
  secciones: [
    {
      id: "por-que-python-datos",
      titulo: "Por qué usar Python para análisis de datos (frente a Excel y SQL)",
      esPasoHowTo: true,
      resumenHowTo:
        "Identifica en qué escenarios Python supera a las planillas manuales y cómo se complementa con SQL y Power BI.",
      parrafos: [
        "Quien comienza en análisis de datos suele preguntarse si aprender Python significa abandonar Excel o SQL. En la práctica profesional ocurre lo contrario: cada herramienta ocupa un lugar distinto en el flujo de trabajo. Excel brilla para exploración rápida, presupuestos y entrega visual a usuarios de negocio; SQL es el lenguaje nativo para consultar bases de datos relacionales donde viven millones de registros.",
        "Python entra en escena cuando el volumen de información supera la comodidad de una hoja de cálculo, cuando los datos llegan sucios en formatos heterogéneos (CSV con codificaciones rotas, JSON de APIs, decenas de planillas mensuales) o cuando necesitas repetir exactamente la misma limpieza y modelado cada semana sin errores humanos de copiar y pegar.",
        "Además, al trabajar en código obtienes trazabilidad completa. Si un gerente pregunta cómo se calculó un margen o por qué se excluyeron ciertos pedidos anulados, cada transformación queda documentada línea por línea en un cuaderno o script ejecutable en segundos.",
      ],
      tabla: {
        caption: "Comparativa práctica: Python (pandas) vs Excel vs SQL",
        encabezados: ["Criterio", "Python (pandas)", "Microsoft Excel", "SQL (T-SQL / PostgreSQL)"],
        filas: [
          [
            "Volumen cómodo en equipo estándar",
            "Cientos de miles a millones de filas en memoria",
            "Hasta ~100.000–300.000 filas con fórmulas complejas",
            "Decenas de millones a miles de millones en servidor",
          ],
          [
            "Limpieza de datos sucios",
            "Muy alta: regex, fechas mixtas, APIs, JSON, texto",
            "Media-alta con Power Query; manual sin él",
            "Media: ideal para tipos definidos, más rígido en texto libre",
          ],
          [
            "Reproducibilidad y auditoría",
            "Total: script versionado en Git",
            "Baja si hay ediciones manuales en celdas",
            "Alta para vistas y procedimientos almacenados",
          ],
          [
            "Curva de aprendizaje inicial",
            "Moderada (requiere sintaxis y entorno)",
            "Baja (interfaz visual inmediata)",
            "Baja-moderada (lenguaje declarativo cercano al inglés)",
          ],
          [
            "Visualización y estadística avanzada",
            "Matplotlib, seaborn, plotly y machine learning",
            "Gráficos estándar y tablas dinámicas rápidas",
            "Nula de forma nativa (requiere BI o Python encima)",
          ],
        ],
      },
      captura: {
        id: "python-para-analisis-de-datos-paso-1",
        alt: "Diagrama comparativo del flujo de análisis de datos combinando SQL para extracción, Python para limpieza y modelado, y Excel o Power BI para entrega.",
        caption: "Rol complementario de SQL, Python y herramientas de reporte en un flujo analítico moderno.",
        ratio: "16/9",
      },
    },
    {
      id: "instalacion-jupyter",
      titulo: "Instalación recomendada (uv o Anaconda) y Jupyter Notebook",
      esPasoHowTo: true,
      resumenHowTo:
        "Instala Python 3.11+, crea un entorno aislado con uv o Anaconda e inicia Jupyter para ejecutar código por celdas.",
      parrafos: [
        "Antes de escribir una línea de pandas conviene preparar un entorno limpio para evitar conflictos entre versiones de librerías. Hoy existen dos caminos principales para quienes trabajan en datos: usar uv (el gestor ultrarrápido moderno para Python) junto con Visual Studio Code, o instalar Anaconda/Miniconda si prefieres un paquete todo en uno con navegador incluido.",
        "Si eliges el enfoque liviano con uv, instalas Python y creas una carpeta de proyecto con su propio entorno virtual (.venv). Esta es la práctica estándar en equipos de ingeniería y análisis porque mantiene cada proyecto independiente y pesa una fracción de una distribución completa.",
        "Jupyter Notebook (o JupyterLab) divide tu trabajo en celdas interactivas. Puedes ejecutar una celda para cargar un archivo, inspeccionar las primeras cinco filas en formato tabla justo debajo y luego escribir la celda siguiente para probar un filtro sin volver a cargar todo el archivo desde cero.",
      ],
      codigos: [
        {
          titulo: "Opción moderna recomendada: crear proyecto y entorno con uv en PowerShell o terminal",
          lenguaje: "bash",
          codigo: `mkdir analisis_ventas
cd analisis_ventas
uv venv --python 3.12
# En Windows PowerShell:
.venv\\Scripts\\Activate.ps1
# En macOS / Linux:
# source .venv/bin/activate
uv pip install pandas matplotlib jupyterlab`,
          nota: "Si aún no tienes uv instalado, puedes descargarlo desde python.org o usar python -m venv .venv seguido de pip install pandas matplotlib jupyterlab.",
        },
        {
          titulo: "Iniciar JupyterLab en tu navegador desde el entorno activado",
          lenguaje: "bash",
          codigo: `jupyter lab`,
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-2",
        alt: "Terminal mostrando la creación del entorno virtual con uv, la instalación de pandas y matplotlib, y JupyterLab abierto en el navegador.",
        caption: "Entorno virtual activado con pandas y matplotlib listos dentro de JupyterLab.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "info",
        titulo: "Alternativa sin instalar nada local",
        texto:
          "Si estás en un computador corporativo sin permisos de administrador, puedes practicar todos los ejemplos de esta guía en Google Colab o dentro de VS Code conectado a un entorno remoto.",
      },
    },
    {
      id: "dataset-comercial-ejemplo",
      titulo: "Dataset comercial de ejemplo incluido (CSV ficticio)",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea el archivo ventas_chile.csv con datos realistas e imperfecciones intencionales para practicar limpieza real.",
      parrafos: [
        "Aprender pandas con tablas perfectamente limpias da una falsa sensación de seguridad. En la vida real, los archivos exportados desde un ERP o una tienda en línea traen espacios sobrantes en los nombres, fechas con formatos mezclados, valores faltantes y registros duplicados.",
        "Para que puedas replicar exactamente cada paso de esta guía en tu equipo, crearemos primero un archivo llamado ventas_chile.csv directamente desde Python. Contiene 12 registros ficticios de ventas en pesos chilenos con sucursales, categorías, cantidades, precios unitarios y errores típicos listos para depurar.",
      ],
      codigos: [
        {
          titulo: "Generar el archivo ventas_chile.csv en tu carpeta de trabajo",
          lenguaje: "python",
          codigo: `from pathlib import Path

csv_contenido = """id_pedido,fecha,sucursal,categoria,producto,cantidad,precio_unitario,estado
1001,2026-10-02, Santiago ,Electrónica,Mouse Inalámbrico,2,18990,Completado
1002,2026-10-03,Valparaíso,Oficina,Silla Ergonómica,1,149990,Completado
1003,04/10/2026,santiago,Electrónica,Teclado Mecánico,1,54990,Completado
1004,2026-10-05,Concepción,Accesorios,Hub USB-C,3,22990,Completado
1005,2026-10-06,Santiago,Oficina,Escritorio Plegable,,89990,Completado
1006,2026-10-07,Valparaíso,Electrónica,Monitor 24 Pulgadas,2,139990,Anulado
1007,2026-10-08,Concepción ,Accesorios,Soporte Notebook,4,14990,Completado
1008,2026-10-09,Santiago,Electrónica,Mouse Inalámbrico,5,18990,Completado
1009,10/10/2026,Valparaíso,Oficina,Lámpara LED,2,19990,Completado
1010,2026-10-11,Santiago,Accesorios,Cable HDMI 2m,6,7990,Pendiente
1011,2026-10-12,Concepción,Electrónica,Teclado Mecánico,2,54990,Completado
1012,2026-10-12,Concepción,Electrónica,Teclado Mecánico,2,54990,Completado
"""

Path("ventas_chile.csv").write_text(csv_contenido.strip(), encoding="utf-8")
print("Archivo ventas_chile.csv creado correctamente.")`,
          nota: "Fíjate en los problemas reales del archivo: espacios en ' Santiago ', minúsculas en 'santiago', fechas mezcladas YYYY-MM-DD y DD/MM/YYYY, una cantidad vacía en el pedido 1005 y el pedido 1012 duplicado.",
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-3",
        alt: "Celda de Jupyter Notebook ejecutando la creación de ventas_chile.csv y mostrando el archivo listado en el explorador lateral.",
        caption: "Archivo CSV de práctica generado localmente con imperfecciones controladas para limpiar con pandas.",
        ratio: "16/9",
      },
    },
    {
      id: "pandas-basico-filtrar",
      titulo: "pandas básico: leer archivos, inspeccionar y filtrar DataFrames",
      esPasoHowTo: true,
      resumenHowTo:
        "Carga el CSV con pd.read_csv, revisa tipos de datos con info() y aplica filtros booleanos junto con columnas calculadas.",
      parrafos: [
        "La librería pandas introduce dos estructuras centrales: Series (una columna con índice) y DataFrame (una tabla bidimensional completa con filas y columnas etiquetadas). Por convención universal en toda la comunidad de datos, se importa bajo el alias pd.",
        "El primer hábito de todo analista al abrir un archivo nuevo no es graficar de inmediato, sino inspeccionar la forma de la tabla: cuántas filas y columnas tiene (shape), qué nombres y tipos asignó pandas a cada columna (info) y cómo lucen las primeras filas (head). Detectar que una fecha fue leída como texto (object o str) o que un número tiene nulos te ahorra dolores de cabeza más adelante.",
        "Para seleccionar subconjuntos de filas usamos máscaras booleanas, que equivalen a aplicar un filtro en Excel pero de manera explícita. Si quieres combinar dos condiciones, recuerda usar el operador & (y) o | (o) encerrando cada comparación entre paréntesis.",
      ],
      codigos: [
        {
          titulo: "Leer el CSV, inspeccionar estructura y filtrar pedidos completados",
          lenguaje: "python",
          codigo: `import pandas as pd

df = pd.read_csv("ventas_chile.csv")

# 1. Inspección inicial
print("Dimensiones (filas, columnas):", df.shape)
print(df.info())
display(df.head())

# 2. Filtrar pedidos completados de Electrónica
filtro_elec = df[(df["estado"] == "Completado") & (df["categoria"] == "Electrónica")]
display(filtro_elec)`,
          nota: "En Jupyter, display() muestra los DataFrames como tablas HTML formateadas; en un script .py tradicional usa print().",
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-4",
        alt: "Salida de Jupyter mostrando df.info() con los tipos de datos y la tabla filtrada de pedidos completados en Electrónica.",
        caption: "Inspección rápida de tipos de datos y filtrado booleano sobre el DataFrame.",
        ratio: "16/9",
      },
    },
    {
      id: "limpieza-datos-pandas",
      titulo: "Limpieza de datos: nulos, fechas mixtas, duplicados y texto",
      esPasoHowTo: true,
      resumenHowTo:
        "Normaliza textos con str.strip y str.title, convierte fechas con dayfirst=True, elimina duplicados y trata los valores nulos.",
      parrafos: [
        "Entre el 60% y el 80% del tiempo en análisis de datos se invierte en preparar la información antes de calcular métricas. Si agrupáramos nuestro dataset tal como llegó, ' Santiago ', 'santiago' y 'Santiago' aparecerían como tres sucursales distintas, y el monto total ignoraría o fallaría frente a la cantidad nula.",
        "pandas resuelve estas tareas de forma vectorizada, es decir, aplicando la operación sobre toda la columna de una sola vez sin escribir bucles for lentos. Para texto, el descriptor .str da acceso a métodos como strip() para quitar espacios laterales y title() para estandarizar mayúsculas iniciales.",
        "Para fechas en Chile y Latinoamérica, un detalle crítico de pd.to_datetime es especificar format='mixed' junto con dayfirst=True cuando conviven formatos ISO (2026-10-02) y locales (04/10/2026). De lo contrario, pandas podría interpretar el 04/10 como 10 de abril en lugar de 4 de octubre.",
      ],
      lista: [
        "drop_duplicates(): elimina filas idénticas (como el pedido 1012 repetido).",
        "str.strip().str.title(): unifica ' Santiago ' y 'santiago' en 'Santiago'.",
        "fillna() o dropna(): decide si rellenar un nulo (por ejemplo, cantidad faltante con 1 o mediana) o descartar la fila incompleta.",
        "pd.to_datetime(..., format='mixed', dayfirst=True): convierte fechas heterogéneas en tipo datetime64 real.",
      ],
      codigos: [
        {
          titulo: "Pipeline de limpieza y creación de columna calculada total_venta",
          lenguaje: "python",
          codigo: `# Trabajamos sobre una copia explícita para mantener intacto el original
df_limpio = df.copy()

# 1. Eliminar duplicados exactos
df_limpio = df_limpio.drop_duplicates()

# 2. Normalizar texto en sucursal y categoria
df_limpio["sucursal"] = df_limpio["sucursal"].str.strip().str.title()
df_limpio["categoria"] = df_limpio["categoria"].str.strip()

# 3. Parsear fechas mixtas respetando día/mes/año
df_limpio["fecha"] = pd.to_datetime(
    df_limpio["fecha"], format="mixed", dayfirst=True
)

# 4. Tratar nulos en cantidad (descartamos filas sin cantidad válida para no inventar ventas)
df_limpio = df_limpio.dropna(subset=["cantidad"]).copy()
df_limpio["cantidad"] = df_limpio["cantidad"].astype(int)

# 5. Filtrar solo ventas válidas (excluir anulados) y calcular monto total
df_validas = df_limpio[df_limpio["estado"] == "Completado"].copy()
df_validas["total_venta"] = df_validas["cantidad"] * df_validas["precio_unitario"]

display(df_validas[["id_pedido", "fecha", "sucursal", "categoria", "total_venta"]])`,
          nota: "Usar .copy() después de filtrar evita la clásica advertencia SettingWithCopyWarning al crear columnas nuevas.",
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-5",
        alt: "Tabla limpia en Jupyter mostrando las sucursales unificadas, fechas en formato datetime estándar y la nueva columna total_venta calculada.",
        caption: "Resultado tras eliminar duplicados, limpiar espacios, normalizar fechas y calcular total_venta.",
        ratio: "16/9",
      },
    },
    {
      id: "agrupar-pivotear-graficar",
      titulo: "Agrupar con groupby, pivot_table y graficar con matplotlib",
      esPasoHowTo: true,
      resumenHowTo:
        "Resume ingresos y unidades por sucursal o categoría y genera un gráfico de barras horizontal limpio con matplotlib.",
      parrafos: [
        "Con la tabla depurada llega el momento de responder preguntas de negocio: qué sucursal vende más, qué categoría concentra el mayor ingreso y cuál es el ticket promedio por pedido. En pandas existen dos herramientas estrella para esto: groupby (el equivalente a GROUP BY de SQL) y pivot_table (el equivalente a una tabla dinámica de Excel).",
        "Al usar groupby con el método .agg(), puedes calcular múltiples métricas en una sola instrucción y asignarles nombres claros directamente, evitando índices jerárquicos incómodos. Agregar .reset_index() al final convierte el resultado nuevamente en un DataFrame plano listo para graficar o exportar.",
        "Para visualizar los resultados sin salir de Python, matplotlib sigue siendo la base estándar. Aunque su sintaxis inicial parece verbosa, bastan seis o siete líneas para producir un gráfico de barras claro con título descriptivo, etiquetas en pesos y sin bordes innecesarios.",
      ],
      codigos: [
        {
          titulo: "Resúmenes con groupby y pivot_table",
          lenguaje: "python",
          codigo: `# Resumen por sucursal ordenado de mayor a menor venta
resumen_sucursal = (
    df_validas.groupby("sucursal", as_index=False)
    .agg(
        pedidos=("id_pedido", "count"),
        unidades=("cantidad", "sum"),
        venta_total=("total_venta", "sum"),
        ticket_promedio=("total_venta", "mean"),
    )
    .sort_values("venta_total", ascending=False)
)
display(resumen_sucursal)

# Matriz cruzada: sucursal en filas, categoría en columnas
matriz = pd.pivot_table(
    df_validas,
    values="total_venta",
    index="sucursal",
    columns="categoria",
    aggfunc="sum",
    fill_value=0,
)
display(matriz)`,
        },
        {
          titulo: "Gráfico de barras horizontales con matplotlib",
          lenguaje: "python",
          codigo: `import matplotlib.pyplot as plt

resumen_ordenado = resumen_sucursal.sort_values("venta_total", ascending=True)

fig, ax = plt.subplots(figsize=(8, 4))
barras = ax.barh(resumen_ordenado["sucursal"], resumen_ordenado["venta_total"], color="#2563eb")

ax.set_title("Ventas completadas por sucursal (CLP)", fontsize=13, pad=12)
ax.set_xlabel("Venta total ($)")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)

for barra in barras:
    valor = barra.get_width()
    ax.text(valor + 3000, barra.get_y() + barra.get_height() / 2, f"\${valor:,.0f}", va="center")

plt.tight_layout()
plt.savefig("ventas_por_sucursal.png", dpi=150)
plt.show()`,
          nota: "plt.savefig guarda el gráfico en alta resolución (150 dpi) listo para pegar en presentaciones o informes.",
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-6",
        alt: "Gráfico de barras horizontales generado con matplotlib mostrando las ventas totales por sucursal con etiquetas en pesos.",
        caption: "Visualización limpia con matplotlib y etiquetas directas sobre cada barra.",
        ratio: "16/9",
      },
    },
    {
      id: "caso-completo-referencias",
      titulo: "Caso completo paso a paso y referencia recomendada",
      esPasoHowTo: true,
      resumenHowTo:
        "Integra carga, limpieza, análisis y exportación a Excel/PNG en un solo script reproducible para Python 3.11+ y pandas 2.2+.",
      parrafos: [
        "En la práctica diaria, una vez que exploraste los datos en Jupyter Notebook, conviene encapsular la lógica estable en un script Python (.py) que puedas ejecutar de principio a fin con un solo comando. Así aseguras que cualquier persona del equipo obtenga exactamente los mismos números y archivos de salida.",
        "El siguiente script integra todo lo aprendido sobre Python 3.11+ y pandas 2.2+: lee el CSV comercial, aplica la limpieza de texto, fechas y duplicados, calcula el resumen ejecutivo por sucursal y categoría, guarda el gráfico PNG y exporta un archivo Excel con dos hojas listas para compartir.",
        "Si quieres profundizar más allá de esta guía introductoria, la referencia por excelencia en la industria es el libro 'Python for Data Analysis' (3.ª edición) de Wes McKinney, creador original de pandas. Su versión en inglés está disponible de forma oficial y gratuita en línea en wesmckinney.com/book, cubriendo desde NumPy y manipulación avanzada de series temporales hasta casos reales de limpieza.",
      ],
      codigos: [
        {
          titulo: "Script completo reproducible: analizar_ventas.py",
          lenguaje: "python",
          codigo: `from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt


def cargar_y_limpiar(ruta_csv: str) -> pd.DataFrame:
    df = pd.read_csv(ruta_csv)
    df = df.drop_duplicates().copy()
    df["sucursal"] = df["sucursal"].str.strip().str.title()
    df["categoria"] = df["categoria"].str.strip()
    df["fecha"] = pd.to_datetime(df["fecha"], format="mixed", dayfirst=True)
    df = df.dropna(subset=["cantidad"]).copy()
    df["cantidad"] = df["cantidad"].astype(int)

    validas = df[df["estado"] == "Completado"].copy()
    validas["total_venta"] = validas["cantidad"] * validas["precio_unitario"]
    return validas


def main() -> None:
    ruta = Path("ventas_chile.csv")
    df_validas = cargar_y_limpiar(str(ruta))

    resumen = (
        df_validas.groupby("sucursal", as_index=False)
        .agg(
            pedidos=("id_pedido", "count"),
            unidades=("cantidad", "sum"),
            venta_total=("total_venta", "sum"),
        )
        .sort_values("venta_total", ascending=False)
    )

    matriz = pd.pivot_table(
        df_validas,
        values="total_venta",
        index="sucursal",
        columns="categoria",
        aggfunc="sum",
        fill_value=0,
    )

    # Exportar gráfico
    fig, ax = plt.subplots(figsize=(8, 4))
    ordenado = resumen.sort_values("venta_total", ascending=True)
    ax.barh(ordenado["sucursal"], ordenado["venta_total"], color="#2563eb")
    ax.set_title("Ventas completadas por sucursal")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()
    plt.savefig("ventas_por_sucursal.png", dpi=150)
    plt.close()

    # Exportar Excel resumen (requiere openpyxl instalado si exportas .xlsx)
    resumen.to_csv("resumen_sucursales.csv", index=False)
    matriz.to_csv("matriz_sucursal_categoria.csv")
    print("Análisis completado. Archivos generados:")
    print(resumen.to_string(index=False))


if __name__ == "__main__":
    main()`,
          nota: "Si instalas openpyxl (uv pip install openpyxl), puedes cambiar to_csv por pd.ExcelWriter('reporte.xlsx') para entregar un único libro multihoja.",
        },
      ],
      captura: {
        id: "python-para-analisis-de-datos-paso-7",
        alt: "Ejecución del script analizar_ventas.py en terminal imprimiendo la tabla resumen y generando los archivos CSV y PNG en la carpeta.",
        caption: "Ejecución completa del pipeline desde terminal produciendo tablas limpias y gráfico PNG.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Siguientes pasos recomendados en tu aprendizaje",
        texto:
          "Una vez domines este flujo básico, practica combinar tablas con pd.merge (equivalente a JOIN en SQL y BUSCARX en Excel), validar esquemas con aserciones de filas y nulos antes de exportar, explorar gráficos estadísticos con seaborn y automatizar reportes multihoja en Excel usando openpyxl.",
      },
      lista: [
        "Verifica siempre el shape inicial y final del DataFrame (df.shape vs df_validas.shape) para documentar cuántas filas se excluyeron por duplicados, nulos críticos o pedidos anulados.",
        "Confirma que el tipo de dato de fechas (datetime64[ns]) y montos (int64 o float64) sea consistente antes de calcular totales o promedios ponderados.",
        "Si el resultado alimentará un tablero en Power BI o Excel, guarda el archivo resumen en una carpeta fija y evita cambiar los nombres de columnas entre corridas.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "UnicodeDecodeError al leer un CSV exportado desde Excel o un ERP en Chile",
      causa:
        "Muchos sistemas locales exportan CSV con codificación latin-1 (cp1252) y separador punto y coma (;) en lugar de UTF-8 con coma.",
      solucion:
        "Pasa los parámetros explícitos en pd.read_csv('archivo.csv', sep=';', encoding='latin-1') para leer tildes y ñ sin errores.",
    },
    {
      error: "ValueError o fechas invertidas (mes y día cambiados) al usar pd.to_datetime",
      causa:
        "Por defecto, pandas interpreta 04/10/2026 bajo formato estadounidense (10 de abril) o falla si hay formatos mixtos en la misma columna.",
      solucion:
        "Agrega format='mixed' y dayfirst=True dentro de pd.to_datetime() y usa errors='coerce' si necesitas convertir textos inválidos en NaT sin detener el script.",
    },
    {
      error: "SettingWithCopyWarning al crear o modificar una columna después de filtrar",
      causa:
        "pandas no tiene certeza de si estás editando una vista temporal del DataFrame original o una tabla independiente.",
      solucion:
        "Agrega .copy() inmediatamente después de filtrar, por ejemplo: df_validas = df[df['estado'] == 'Completado'].copy().",
    },
    {
      error: "ModuleNotFoundError: No module named 'pandas'",
      causa:
        "Jupyter o VS Code está usando el intérprete global del sistema en lugar del entorno virtual donde instalaste pandas.",
      solucion:
        "Verifica en la esquina superior derecha de Jupyter o VS Code que el kernel seleccionado apunte a tu carpeta .venv.",
    },
  ],
  plantilla: {
    titulo: "Notebook inicial: Limpieza y análisis comercial en pandas",
    descripcion:
      "Próximamente podrás descargar aquí el archivo .ipynb listo para abrir en JupyterLab o Google Colab junto con el dataset ventas_chile.csv.",
  },
  faqs: [
    {
      q: "¿Necesito saber programar antes de aprender Python para análisis de datos?",
      a: "No es requisito previo. En análisis de datos utilizas un subconjunto muy acotado de Python (variables, listas, funciones simples) y pasas el 90% del tiempo usando métodos expresivos de pandas como read_csv, groupby y merge.",
    },
    {
      q: "¿Qué versión de Python y pandas debería usar en 2026?",
      a: "Se recomienda Python 3.11 o 3.12 junto con pandas 2.2 o superior, ya que incorporan mejoras importantes de velocidad, manejo de nulos y mejor soporte de tipos.",
    },
    {
      q: "¿Es mejor usar Jupyter Notebook o scripts .py en VS Code?",
      a: "Ambos cumplen roles distintos: Jupyter Notebook es ideal para explorar datos, probar limpiezas y ver gráficos paso a paso; los archivos .py son mejores cuando el análisis ya está validado y quieres automatizarlo.",
    },
    {
      q: "¿Python reemplaza a Power BI o Tableau?",
      a: "No necesariamente. Python se usa mucho para preparar, limpiar y modelar los datos antes de cargarlos a Power BI, o incluso dentro de Power BI como origen de datos o script de transformación, mientras que la herramienta de BI se encarga de la distribución interactiva.",
    },
    {
      q: "¿Cuánto tiempo toma llegar a un nivel laboral básico en pandas?",
      a: "Si ya manejas tablas dinámicas en Excel o consultas básicas en SQL, con 3 a 4 semanas de práctica constante sobre datasets reales puedes dominar lectura, limpieza, cruces con merge y resúmenes con groupby.",
    },
  ],
  relacionadas: [
    "automatizar-excel-con-python",
    "ia-para-python-analisis-de-datos",
    "consultas-sql-ejemplos",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de pandas (Getting Started)",
      url: "https://pandas.pydata.org/docs/getting_started/index.html",
      fuente: "pandas",
    },
    {
      label: "Documentación oficial de JupyterLab",
      url: "https://jupyter.org/documentation",
      fuente: "Project Jupyter",
    },
    {
      label: "Libro Python for Data Analysis (3.ª ed.) de Wes McKinney",
      url: "https://wesmckinney.com/book/",
      fuente: "Wes McKinney",
    },
    {
      label: "Descarga oficial de Python",
      url: "https://www.python.org/downloads/",
      fuente: "Python.org",
    },
  ],
};

export default guia;
