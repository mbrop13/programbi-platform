import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "automatizar-excel-con-python",
  title: "Automatizar Excel con Python (pandas y openpyxl) paso a paso",
  meta: "Usa Python para leer, limpiar, consolidar y generar reportes de Excel con formato automáticamente. Código con pandas y openpyxl explicado línea a línea.",
  h1: "Cómo automatizar Excel con Python",
  subtitle:
    "Reemplaza horas de copiar y pegar en planillas: consolida decenas de archivos .xlsx con pandas, genera resúmenes limpios, aplica formato en pesos chilenos con openpyxl y programa la ejecución automática en Windows.",
  keywordPrincipal: "automatizar Excel con Python",
  keywords: [
    "automatizar Excel con Python",
    "Python Excel pandas",
    "openpyxl reporte Excel",
    "automatizar reportes Excel con Python",
  ],
  curso: "python",
  herramienta: "Python",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Escribir un script en Python 3.11+ con pandas y openpyxl que lee múltiples archivos Excel de una carpeta, limpia los datos, calcula un resumen comercial y exporta un reporte formateado listo para enviar, ejecutándose solo según horario.",
    herramienta: "Python + pandas + openpyxl",
    tiempo: "35 minutos",
    bullets: [
      "Decidir con criterio cuándo conviene Python frente a Power Query o macros VBA.",
      "Instalar Python, crear un entorno limpio e instalar pandas >= 2.2 y openpyxl >= 3.1.",
      "Consolidar archivos .xlsx con pathlib.Path.glob y pd.concat en pocas líneas.",
      "Dar formato profesional (anchos, encabezados y moneda CLP \"$ #,##0\") con openpyxl y automatizar en Windows.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Python vs PQ vs VBA",
      resumen: "Elige la herramienta correcta según tu flujo.",
      anchorId: "cuando-usar-python",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Instalar entorno",
      resumen: "Prepara Python 3.11+, pandas y openpyxl.",
      anchorId: "instalar-python-librerias",
      icono: "terminal",
    },
    {
      numero: 3,
      titulo: "Consolidar archivos",
      resumen: "Lee todos los .xlsx de una carpeta con pathlib.",
      anchorId: "leer-consolidar-excel",
      icono: "file",
    },
    {
      numero: 4,
      titulo: "Limpiar y resumir",
      resumen: "Normaliza columnas y agrupa con groupby y pivot_table.",
      anchorId: "limpiar-resumir",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "Exportar con formato",
      resumen: "Estiliza encabezados, anchos y formato CLP en openpyxl.",
      anchorId: "escribir-reporte-formato",
      icono: "sparkles",
    },
    {
      numero: 6,
      titulo: "Programar en Windows",
      resumen: "Ejecuta el script cada mañana sin abrir Excel.",
      anchorId: "programar-windows",
      icono: "settings",
    },
  ],
  requisitos: {
    version: "Python 3.11 o superior, pandas >= 2.2 y openpyxl >= 3.1",
    lista: [
      "Python 3.11+ instalado en Windows o Mac (marcando 'Add python.exe to PATH' en Windows).",
      "Editor de código como Visual Studio Code o terminal PowerShell.",
      "Una carpeta de trabajo con dos o más archivos .xlsx de estructura similar para probar.",
    ],
    compatibilidadMacWeb:
      "A diferencia de Power BI Desktop o ciertas macros VBA dependientes de controles ActiveX de Windows, Python con pandas y openpyxl funciona exactamente igual en Windows, macOS y Linux. Solo el último paso (Programador de tareas) es específico de Windows; en Mac puedes usar launchd o cron.",
  },
  herramientasHowTo: ["Python 3.11+", "pandas", "openpyxl", "Programador de tareas de Windows"],
  insumosHowTo: ["Carpeta con archivos .xlsx mensuales", "Script reporte_ventas.py"],
  secciones: [
    {
      id: "cuando-usar-python",
      titulo: "1. Cuándo usar Python vs Power Query vs VBA",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa si tu automatización encaja mejor en Python, Power Query o macros VBA antes de escribir código.",
      parrafos: [
        "Antes de programar un script, vale la pena hacerse una pregunta honesta: ¿realmente necesitas Python para este problema, o lo resuelves más rápido dentro de Excel? Cada herramienta brilla en un escenario distinto, y conocer sus límites te ahorra mantenimiento innecesario.",
        "Si el reporte vive dentro de un único archivo de Excel y solo necesitas limpiarlo con clics repetibles, Power Query suele ser la ruta más corta (puedes revisar nuestra guía de automatizar Excel con Power Query /guias/automatizar-excel-con-power-query). Si necesitas botones dentro de la interfaz de Excel o interacción con Outlook clásico, las macros VBA siguen vigentes.",
        "En cambio, Python domina cuando recibes decenas de planillas mensuales por sucursal, trabajas con bases de cientos de miles de filas, necesitas validaciones cruzadas contra APIs o bases SQL, o quieres que el informe se genere y se guarde automáticamente cada mañana en segundo plano sin tener Excel abierto en tu escritorio.",
        "Otro punto clave en equipos de control de gestión o finanzas en Chile es la reproducibilidad: con un script de Python tienes control de versiones en Git, trazabilidad exacta de cada transformación aplicada sobre las columnas y facilidad para generar alertas o logs si un archivo de entrada llegó sin datos o con encabezados alterados.",
      ],
      tabla: {
        caption: "Comparativa práctica: Python vs Power Query vs VBA para automatizar Excel.",
        encabezados: ["Criterio", "Python (pandas + openpyxl)", "Power Query", "Macros VBA"],
        filas: [
          [
            "Volumen y velocidad",
            "Excelente (cientos de miles de filas en segundos)",
            "Muy buena hasta cientos de miles de filas",
            "Lenta si recorre celdas una por una",
          ],
          [
            "Ejecución sin abrir Excel",
            "Nativa (scripts en segundo plano o servidor)",
            "Requiere abrir Excel o Power BI Service",
            "Requiere abrir Excel en Windows",
          ],
          [
            "Formato visual del archivo final",
            "Control total celda por celda con openpyxl",
            "Básico (tablas de Excel estándar)",
            "Control total nativo sobre Excel",
          ],
          [
            "Curva de aprendizaje inicial",
            "Media (sintaxis Python + pandas)",
            "Baja-Media (interfaz visual + algo de M)",
            "Media (modelo de objetos Excel)",
          ],
          [
            "Integración con APIs, PDF o correo",
            "Ilimitada (ecosistema completo)",
            "Buena para APIs REST simples",
            "Buena solo dentro del ecosistema Office",
          ],
        ],
      },
      captura: {
        id: "automatizar-excel-con-python-paso-1",
        alt: "Diagrama de flujo comparando entradas y salidas al automatizar Excel con Python frente a Power Query y VBA",
        caption:
          "Python sobresale cuando necesitas procesar múltiples archivos, aplicar lógica compleja y generar reportes sin abrir Excel.",
        ratio: "16/9",
      },
    },
    {
      id: "instalar-python-librerias",
      titulo: "2. Instalar Python 3.11+, pandas y openpyxl",
      esPasoHowTo: true,
      resumenHowTo:
        "Instala Python en Windows, crea un entorno virtual y descarga las versiones recomendadas de pandas y openpyxl.",
      parrafos: [
        "Descarga el instalador oficial desde python.org/downloads (versión 3.11 o superior). Al ejecutarlo en Windows, es fundamental marcar la casilla 'Add python.exe to PATH' en la primera pantalla antes de presionar Install Now. Si olvidas esa casilla, la terminal no reconocerá el comando python.",
        "Luego abre una terminal (PowerShell o Terminal de VS Code) en la carpeta de tu proyecto, crea un entorno virtual para aislar las dependencias y ejecuta pip install para instalar pandas (>= 2.2) y openpyxl (>= 3.1). pandas se encarga de leer, limpiar, agrupar y calcular a alta velocidad; openpyxl es el motor que permite a pandas leer/escribir .xlsx modernos y aplicar colores, fuentes y formatos numéricos.",
      ],
      codigos: [
        {
          titulo: "Comandos en PowerShell para crear entorno virtual e instalar librerías",
          lenguaje: "python",
          codigo: `# Verificar versión de Python
python --version

# Crear y activar entorno virtual en la carpeta del proyecto
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1

# Instalar versiones actualizadas de pandas y openpyxl
pip install "pandas>=2.2" "openpyxl>=3.1"`,
          nota: "Si PowerShell bloquea Activate.ps1 por política de ejecución, puedes ejecutar primero: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned",
        },
      ],
      captura: {
        id: "automatizar-excel-con-python-paso-2",
        alt: "Terminal de PowerShell mostrando la instalación exitosa de pandas y openpyxl dentro de un entorno virtual .venv",
        caption:
          "Entorno virtual activo e instalación limpia de pandas y openpyxl verificada en consola.",
        ratio: "16/9",
      },
    },
    {
      id: "leer-consolidar-excel",
      titulo: "3. Leer y consolidar múltiples archivos Excel de una carpeta",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa pathlib.Path.glob para descubrir todos los archivos .xlsx de una carpeta y combínalos con pd.concat.",
      parrafos: [
        "Uno de los casos de uso más rentables en cualquier área comercial o financiera es recibir archivos mensuales o por sucursal (por ejemplo, ventas_norte.xlsx, ventas_centro.xlsx, ventas_sur.xlsx) dentro de una carpeta llamada datos_entrada y tener que unirlos en un solo maestro.",
        "Con el módulo estándar pathlib recorremos la carpeta buscando todos los archivos que terminen en .xlsx (ignorando los archivos temporales ocultos que Excel crea cuando están abiertos, cuyo nombre empieza con ~$). Guardamos cada tabla en una lista, añadimos una columna con el nombre del archivo de origen para trazabilidad y unimos todo en un único DataFrame con pd.concat.",
      ],
      codigos: [
        {
          titulo: "Lectura y consolidación automática con pathlib y pd.concat",
          lenguaje: "python",
          codigo: `from pathlib import Path
import pandas as pd

carpeta_entrada = Path("datos_entrada")
archivos = [
    f for f in carpeta_entrada.glob("*.xlsx")
    if not f.name.startswith("~$")
]

if not archivos:
    raise FileNotFoundError("No se encontraron archivos .xlsx en datos_entrada")

tablas = []
for ruta in archivos:
    df_temp = pd.read_excel(ruta, sheet_name="Ventas", engine="openpyxl")
    df_temp["ArchivoOrigen"] = ruta.name
    tablas.append(df_temp)

df_consolidado = pd.concat(tablas, ignore_index=True)
print(f"Filas consolidadas: {len(df_consolidado)}")`,
          nota: "Filtrar not f.name.startswith('~$') evita que el script falle si alguien dejó un Excel abierto en la carpeta.",
        },
      ],
      captura: {
        id: "automatizar-excel-con-python-paso-3",
        alt: "Editor VS Code mostrando la carpeta datos_entrada con varios archivos xlsx y el script Python consolidándolos con pd.concat",
        caption:
          "Consolidación automática: basta depositar nuevos archivos en datos_entrada para que Python los incluya.",
        ratio: "16/9",
      },
    },
    {
      id: "limpiar-resumir",
      titulo: "4. Limpiar datos y generar resúmenes con groupby y pivot_table",
      esPasoHowTo: true,
      resumenHowTo:
        "Estandariza nombres de columnas, elimina filas nulas, convierte fechas y calcula tablas resumen ejecutivas.",
      parrafos: [
        "Los archivos que vienen de sucursales o sistemas antiguos casi siempre traen espacios extra en los textos, fechas guardadas como texto o filas de totales coladas al final. Con pandas limpiamos todo en bloque de forma determinista antes de resumir.",
        "En el ejemplo de abajo aplicamos cuatro pasos clave de higiene de datos: normalizar textos con .str.strip() y .str.title() para que 'santiago ' y 'Santiago' no queden separados; convertir la columna Fecha con pd.to_datetime(..., errors='coerce') y descartar filas sin fecha válida (como subtotales o notas al pie); transformar Monto a numérico rellenando vacíos con cero; y derivar la columna Mes con período YYYY-MM para poder agrupar mes contra mes.",
        "Una vez limpio el DataFrame consolidado, usamos groupby para obtener el resumen por categoría y sucursal (calculando ventas totales, cantidad de transacciones y ticket promedio en una sola operación .agg), y pivot_table para construir una matriz mensual idéntica a una tabla dinámica de Excel, lista para exportarse a una segunda hoja del libro final.",
      ],
      lista: [
        "Si tus archivos de origen vienen con fechas en formato chileno día/mes/año (DD-MM-AAAA), agrega dayfirst=True dentro de pd.to_datetime() para evitar que el 04-11 se interprete como 11 de abril.",
        "Si los montos incluyen símbolos como '$' o puntos de miles en formato texto, límpialos primero con .str.replace() antes de llamar a pd.to_numeric().",
        "Puedes agregar .drop_duplicates(subset=['ID_Venta']) si sospechas que dos sucursales subieron registros repetidos.",
      ],
      codigos: [
        {
          titulo: "Limpieza de datos y cálculo de resúmenes con pandas",
          lenguaje: "python",
          codigo: `# Limpiar espacios en columnas de texto y eliminar filas sin monto
df_consolidado["Categoria"] = df_consolidado["Categoria"].astype(str).str.strip().str.title()
df_consolidado["Sucursal"] = df_consolidado["Sucursal"].astype(str).str.strip()
df_consolidado["Fecha"] = pd.to_datetime(df_consolidado["Fecha"], errors="coerce")
df_consolidado["Monto"] = pd.to_numeric(df_consolidado["Monto"], errors="coerce").fillna(0)
df_consolidado = df_consolidado.dropna(subset=["Fecha"])
df_consolidado["Mes"] = df_consolidado["Fecha"].dt.to_period("M").astype(str)

# Resumen agrupado por Categoría y Sucursal
resumen_categoria = (
    df_consolidado
    .groupby(["Categoria", "Sucursal"], as_index=False)
    .agg(
        VentasTotales=("Monto", "sum"),
        Transacciones=("Monto", "count"),
        TicketPromedio=("Monto", "mean"),
    )
    .sort_values("VentasTotales", ascending=False)
)

# Tabla dinámica por Categoría (filas) y Mes (columnas)
matriz_mensual = pd.pivot_table(
    df_consolidado,
    values="Monto",
    index="Categoria",
    columns="Mes",
    aggfunc="sum",
    fill_value=0,
).reset_index()`,
        },
      ],
      captura: {
        id: "automatizar-excel-con-python-paso-4",
        alt: "Salida en consola mostrando las primeras filas del DataFrame resumen_categoria y matriz_mensual calculadas por pandas",
        caption:
          "Resumen limpio calculado en memoria: groupby entrega métricas exactas y pivot_table replica la tabla dinámica.",
        ratio: "16/9",
      },
    },
    {
      id: "escribir-reporte-formato",
      titulo: "5. Escribir el reporte Excel final con formato profesional en openpyxl",
      esPasoHowTo: true,
      resumenHowTo:
        "Exporta múltiples hojas con ExcelWriter(engine='openpyxl'), ajusta anchos de columna, aplica encabezados y formato de moneda CLP.",
      parrafos: [
        "Exportar un DataFrame con to_excel() a secas produce hojas grises con columnas angostas donde los números largos aparecen como ###. Para entregar un reporte presentable a gerencia sin tocar el archivo a mano, abrimos un bloque pd.ExcelWriter con engine='openpyxl' y estilizamos directamente las hojas generadas.",
        "Con openpyxl pintamos la fila de encabezados con relleno azul oscuro y texto blanco en negrita, aplicamos el formato numérico chileno \"$ #,##0\" a las columnas de dinero, congelamos la primera fila (freeze_panes = 'A2') y calculamos automáticamente el ancho óptimo de cada columna según el largo máximo de su contenido.",
      ],
      codigos: [
        {
          titulo: "Exportación y estilizado automático con ExcelWriter y openpyxl",
          lenguaje: "python",
          codigo: `from openpyxl.styles import Font, PatternFill, Alignment

archivo_salida = Path("reporte_ventas_final.xlsx")

with pd.ExcelWriter(archivo_salida, engine="openpyxl") as writer:
    resumen_categoria.to_excel(writer, sheet_name="Resumen", index=False)
    matriz_mensual.to_excel(writer, sheet_name="Matriz_Mensual", index=False)
    df_consolidado.to_excel(writer, sheet_name="Detalle", index=False)

    relleno_header = PatternFill(start_color="0F4C81", end_color="0F4C81", fill_type="solid")
    fuente_header = Font(color="FFFFFF", bold=True)

    for nombre_hoja in writer.sheets:
        ws = writer.sheets[nombre_hoja]
        ws.freeze_panes = "A2"

        # Estilizar encabezados
        for celda in ws[1]:
            celda.fill = relleno_header
            celda.font = fuente_header
            celda.alignment = Alignment(horizontal="center", vertical="center")

        # Ajustar ancho automático de columnas y formato moneda CLP
        for col in ws.columns:
            letra_col = col[0].column_letter
            encabezado = str(col[0].value or "")
            largo_max = max(len(str(c.value or "")) for c in col)
            ws.column_dimensions[letra_col].width = min(largo_max + 4, 40)

            if any(pal in encabezado for pal in ["Ventas", "Monto", "Ticket", "202"]):
                for celda in col[1:]:
                    if isinstance(celda.value, (int, float)):
                        celda.number_format = '"$" #,##0'

print(f"Reporte generado exitosamente en: {archivo_salida.resolve()}")`,
        },
      ],
      captura: {
        id: "automatizar-excel-con-python-paso-5",
        alt: "Archivo reporte_ventas_final.xlsx abierto en Excel mostrando encabezados azules, anchos ajustados y montos con formato $ #,##0",
        caption:
          "Archivo Excel final listo para enviar: tres hojas ordenadas, encabezados corporativos y formato moneda CLP.",
        ratio: "16/9",
      },
    },
    {
      id: "programar-windows",
      titulo: "6. Programar la ejecución automática en Windows",
      esPasoHowTo: true,
      resumenHowTo:
        "Configura una tarea programada en el Programador de tareas de Windows apuntando al Python de tu entorno virtual.",
      parrafos: [
        "El último paso para olvidarte de correr el script manualmente es programarlo en el Programador de tareas de Windows (Task Scheduler). Abre el menú Inicio, busca Programador de tareas y haz clic en Crear tarea básica en el panel derecho.",
        "Asigna un nombre descriptivo (por ejemplo, Reporte_Ventas_Python), elige la frecuencia (Diariamente a las 08:00 AM o semanalmente los lunes) y en la acción selecciona Iniciar un programa. Un detalle clave: en Programa o script apunta directamente al ejecutable python.exe dentro de tu carpeta .venv (por ejemplo, C:\\Proyectos\\Reportes\\.venv\\Scripts\\python.exe), en Agregar argumentos escribe el nombre de tu archivo (reporte_ventas.py) y en Iniciar en (opcional) pega la ruta completa de la carpeta del proyecto para que las rutas relativas como datos_entrada funcionen sin errores.",
        "Si trabajas en macOS o Linux, consigues exactamente el mismo resultado programando un cron job (crontab -e) que invoque la ruta completa del binario Python dentro de .venv/bin/python seguido de la ruta absoluta de reporte_ventas.py, redirigiendo la salida estándar y errores a un archivo registro.log para auditar cada corrida.",
      ],
      listaOrdenada: [
        "Prueba primero el comando completo en PowerShell usando la ruta absoluta de .venv\\Scripts\\python.exe.",
        "En el Programador de tareas marca 'Ejecutar tanto si el usuario inició sesión como si no' si corre en un servidor o equipo compartido.",
        "Activa el historial de tareas en el panel derecho para verificar el código de salida (0x0 significa ejecución exitosa).",
      ],
      captura: {
        id: "automatizar-excel-con-python-paso-6",
        alt: "Ventana Editar acción del Programador de tareas de Windows apuntando al python.exe del entorno virtual y a la carpeta del proyecto",
        caption:
          "Configuración en el Programador de tareas: recuerda llenar siempre el campo 'Iniciar en' con la ruta del proyecto.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "ImportError: Missing optional dependency 'openpyxl'",
      causa:
        "Instalaste pandas pero olvidaste instalar openpyxl, o estás ejecutando el script con el Python global en lugar del entorno virtual.",
      solucion:
        "Activa tu entorno .venv y ejecuta pip install openpyxl, o asegúrate de llamar a .venv\\Scripts\\python.exe.",
    },
    {
      error: "PermissionError: [Errno 13] Permission denied al guardar el Excel de salida",
      causa:
        "Tienes abierto el archivo reporte_ventas_final.xlsx en Excel mientras Python intenta sobrescribirlo.",
      solucion:
        "Cierra el archivo en Excel antes de correr el script, o guarda la salida con fecha y hora en el nombre del archivo.",
    },
    {
      error: "El Programador de tareas de Windows termina con código 0x1 o 0x2 sin generar el archivo",
      causa:
        "Falta definir la carpeta de trabajo en el campo 'Iniciar en', por lo que Python no encuentra datos_entrada.",
      solucion:
        "Edita la acción de la tarea programada y completa el campo 'Iniciar en (opcional)' con la ruta absoluta de la carpeta del proyecto (sin comillas).",
    },
    {
      error: "Algunas fechas quedan como NaT después de pd.to_datetime",
      causa:
        "Los archivos de origen mezclan formato día/mes/año (típico en Chile) con mes/día/año en inglés.",
      solucion:
        "Pasa el parámetro dayfirst=True dentro de pd.to_datetime(df['Fecha'], dayfirst=True, errors='coerce').",
    },
  ],
  plantilla: {
    titulo: "Proyecto base: Script Python + carpeta de archivos de ejemplo",
    descripcion:
      "Próximamente podrás descargar aquí el repositorio comprimido con reporte_ventas.py, requirements.txt y archivos Excel ficticios para probar al instante.",
  },
  faqs: [
    {
      q: "¿Python reemplaza a Excel para el usuario final?",
      a: "No. Python reemplaza el trabajo manual repetitivo de limpiar y consolidar, pero el resultado sigue siendo un libro de Excel limpio que gerencia o clientes pueden abrir sin tener Python instalado.",
    },
    {
      q: "¿Puedo proteger hojas o insertar gráficos de Excel desde openpyxl?",
      a: "Sí. openpyxl permite agregar gráficos nativos (BarChart, LineChart), validaciones de datos, fórmulas de Excel y protección con contraseña por hoja.",
    },
    {
      q: "¿Qué pasa si un archivo de entrada tiene las columnas en distinto orden?",
      a: "No hay problema: pd.concat alinea las columnas por su nombre de encabezado automáticamente, siempre que los nombres coincidan exactamente.",
    },
    {
      q: "¿Cómo puedo enviar ese Excel por correo automáticamente al terminar el script?",
      a: "Puedes usar la librería estándar smtplib + email de Python con una cuenta SMTP corporativa o conectar con Microsoft Graph API si tu empresa usa Microsoft 365.",
    },
  ],
  relacionadas: [
    "automatizar-excel-con-power-query",
    "macros-vba-excel-desde-cero",
    "automatizar-reportes-con-power-bi",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de pandas",
      url: "https://pandas.pydata.org/docs/",
      fuente: "pandas",
    },
    {
      label: "Documentación oficial de openpyxl",
      url: "https://openpyxl.readthedocs.io/en/stable/",
      fuente: "openpyxl",
    },
    {
      label: "Descarga oficial de Python",
      url: "https://www.python.org/downloads/",
      fuente: "Python.org",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Plantilla de limpieza de Excel con Python y pandas",
      href: "/plantillas/limpieza-excel-python-pandas",
      descripcion: "Descarga una estructura base lista para normalizar planillas sucias con pandas.",
    },
  ],
};

export default guia;
