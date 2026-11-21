import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "macros-vba-excel-desde-cero",
  title: "Macros y VBA en Excel desde cero: ejemplos útiles",
  meta: "Aprende a grabar y escribir macros VBA en Excel con 6 ejemplos útiles: consolidar hojas, exportar PDF, limpiar datos y más. Código comentado y seguro.",
  h1: "Macros y VBA en Excel desde cero (con ejemplos reales)",
  subtitle:
    "Activa la pestaña Programador, domina el Editor de Visual Basic y copia seis procedimientos VBA completos con manejo de errores para automatizar tareas repetitivas en la oficina.",
  keywordPrincipal: "macros en Excel",
  keywords: [
    "macros en Excel",
    "VBA Excel",
    "macros Excel ejemplos",
    "grabar macro Excel",
    "consolidar archivos con macro",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Activar el entorno de desarrollo en Excel, grabar tu primera macro, entender la estructura de un módulo VBA seguro y contar con 6 macros listas para consolidar hojas, exportar PDF, limpiar textos, enviar correos y actualizar Power Query.",
    herramienta: "Microsoft Excel (VBA)",
    tiempo: "35 minutos",
    bullets: [
      "Saber cuándo conviene usar VBA frente a Power Query o Python.",
      "Habilitar la pestaña Programador y guardar correctamente como .xlsm.",
      "Usar Option Explicit y On Error GoTo en 6 macros reales de oficina.",
      "Entender cómo desbloquear macros seguras según las políticas de Microsoft.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Cuándo usar VBA",
      resumen: "Compara macros frente a Power Query y Python.",
      anchorId: "que-es-macro",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Programador y .xlsm",
      resumen: "Activa la pestaña oculta y guarda con macros.",
      anchorId: "activar-programador",
      icono: "settings",
    },
    {
      numero: 3,
      titulo: "Grabar primera macro",
      resumen: "Genera código automático observando tus clics.",
      anchorId: "grabar-primera-macro",
      icono: "sparkles",
    },
    {
      numero: 4,
      titulo: "Editor VBA",
      resumen: "Conoce módulos, Option Explicit y On Error GoTo.",
      anchorId: "editor-vba",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "6 macros reales",
      resumen: "Copia ejemplos comentados para tareas diarias.",
      anchorId: "seis-ejemplos-vba",
      icono: "terminal",
    },
    {
      numero: 6,
      titulo: "Seguridad de macros",
      resumen: "Evita el bloqueo de archivos descargados de internet.",
      anchorId: "seguridad-macros",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Microsoft Excel de escritorio (Microsoft 365, Excel 2021, 2019 o 2016)",
    lista: [
      "Excel instalado en Windows o macOS (Excel en la web no permite ejecutar ni editar macros VBA).",
      "Permiso para guardar archivos habilitados para macros (.xlsm).",
      "Outlook clásico de escritorio instalado si deseas probar la macro de envío de correos.",
    ],
    compatibilidadMacWeb:
      "Las macros VBA funcionan en Excel para Windows y en Excel para Mac (con algunas diferencias en controles ActiveX y automatización de Outlook). Sin embargo, Excel para la web no ejecuta código VBA: si tu equipo trabaja 100 % en navegador o SharePoint, evalúa Office Scripts o Power Automate.",
  },
  herramientasHowTo: ["Microsoft Excel de escritorio", "Editor de Visual Basic (VBE)"],
  insumosHowTo: ["Libro habilitado para macros (.xlsm)"],
  secciones: [
    {
      id: "que-es-macro",
      titulo: "1. Qué es una macro y cuándo conviene usar VBA",
      esPasoHowTo: true,
      resumenHowTo:
        "Identifica en qué tareas de oficina VBA sigue siendo insustituible y cuándo es mejor usar Power Query o Python.",
      parrafos: [
        "Una macro es una secuencia de instrucciones escritas en Visual Basic for Applications (VBA), el lenguaje integrado dentro de Microsoft Excel que permite controlar hojas, celdas, gráficos, archivos y ventanas mediante código. En lugar de repetir veinte clics cada lunes por la mañana, presionas un botón y Excel ejecuta la rutina exacta en segundos.",
        "Aunque hoy existen herramientas modernas como Power Query (para transformar datos) y Python (para procesar grandes volúmenes), VBA sigue siendo la mejor opción cuando necesitas automatizar acciones de interfaz dentro del propio libro de Excel: dar formato específico, crear pestañas dinámicas, exportar rangos a PDF con nombre personalizado o entregar un botón amigable a usuarios que no saben programar.",
      ],
      tabla: {
        caption: "Comparativa de automatización en Excel: VBA vs Power Query vs Python.",
        encabezados: ["Criterio", "Macros VBA", "Power Query", "Python (pandas/openpyxl)"],
        filas: [
          [
            "Control de interfaz y formato Excel",
            "Total (hojas, PDF, botones, eventos)",
            "Solo carga tablas estructuradas",
            "Alto sobre archivos .xlsx nuevos",
          ],
          [
            "Limpieza y cruce de bases grandes",
            "Lento si recorre miles de celdas",
            "Muy rápido y visual sin código complejo",
            "Ultra rápido incluso con cientos de miles de filas",
          ],
          [
            "Ejecución en Excel Web",
            "No soportado",
            "Parcial (actualización limitada)",
            "Se ejecuta fuera de Excel (servidor/PC)",
          ],
          [
            "Distribución a colegas",
            "Basta enviar un único archivo .xlsm",
            "Incluido en el propio .xlsx",
            "Requiere instalar Python o empaquetar .exe",
          ],
        ],
      },
      captura: {
        id: "macros-vba-excel-desde-cero-paso-1",
        alt: "Esquema de decisión entre Macros VBA, Power Query y Python según el tipo de tarea en Excel",
        caption:
          "Usa VBA para automatizar acciones dentro del libro (PDF, hojas, botones) y Power Query o Python para ETL pesado.",
        ratio: "16/9",
      },
    },
    {
      id: "activar-programador",
      titulo: "2. Activar la pestaña Programador y guardar como .xlsm",
      esPasoHowTo: true,
      resumenHowTo:
        "Habilita la pestaña Programador en la cinta de opciones y guarda el libro en formato habilitado para macros (.xlsm).",
      parrafos: [
        "Por defecto, Excel oculta las herramientas de macros para no abrumar a usuarios básicos. Para activarlas en Windows, ve a Archivo > Opciones > Personalizar cinta de opciones. En la columna derecha busca y marca la casilla Programador (o Desarrollador según la versión) y presiona Aceptar. En Mac, ve a Excel > Preferencias > Barra de herramientas y cinta de opciones.",
        "El segundo paso crítico antes de escribir una sola línea es guardar el archivo correctamente. Un libro estándar .xlsx elimina cualquier código VBA al cerrarse. Ve a Archivo > Guardar como y elige el tipo Libro de Excel habilitado para macros (*.xlsm). Acostúmbrate a verificar la extensión .xlsm cada vez que crees un proyecto nuevo.",
      ],
      captura: {
        id: "macros-vba-excel-desde-cero-paso-2",
        alt: "Ventana Opciones de Excel mostrando la casilla Programador activada y el formato de guardado Libro habilitado para macros .xlsm",
        caption:
          "Pestaña Programador activada en la cinta y guardado obligatorio como .xlsm para conservar el código.",
        ratio: "16/9",
      },
    },
    {
      id: "grabar-primera-macro",
      titulo: "3. Grabar tu primera macro sin escribir código",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa la grabadora de macros para registrar una secuencia de formato y observar cómo Excel la traduce a VBA.",
      parrafos: [
        "La grabadora de macros es el mejor profesor para empezar: traduce tus acciones en pantalla a código VBA real que luego puedes leer y limpiar. Haz clic en Programador > Grabar macro, escribe un nombre sin espacios (por ejemplo, FormatoEncabezado), elige guardar en 'Este libro' y presiona Aceptar.",
        "Mientras la grabadora está activa, selecciona la fila 1 de tu tabla, pon negrita, fondo azul y ajusta el ancho de columnas. Al terminar, presiona Detener grabación en la pestaña Programador. Aunque el código grabado suele ser verboso (lleno de .Select innecesarios), te enseña de inmediato qué propiedades usa Excel para cada botón.",
      ],
      captura: {
        id: "macros-vba-excel-desde-cero-paso-3",
        alt: "Cuadro de diálogo Grabar macro en Excel con el nombre FormatoEncabezado y almacenamiento en Este libro",
        caption:
          "Grabadora de macros: ideal para descubrir propiedades y métodos de Excel sin memorizarlos.",
        ratio: "16/9",
      },
    },
    {
      id: "editor-vba",
      titulo: "4. El Editor de VBA en 5 minutos (Option Explicit y On Error GoTo)",
      esPasoHowTo: true,
      resumenHowTo:
        "Abre el Editor VBA con Alt + F11, inserta un módulo estándar y aplica buenas prácticas de declaración y manejo de errores.",
      parrafos: [
        "Presiona Alt + F11 (Option + F11 en Mac) para abrir el Editor de Visual Basic (VBE). En el panel izquierdo (Explorador de proyectos) verás tu libro; haz clic derecho sobre él y elige Insertar > Módulo. Nunca escribas macros de uso general dentro del objeto Hoja1 a menos que sean eventos automáticos de esa hoja.",
        "Antes de copiar los ejemplos de la siguiente sección, adopta dos reglas de oro profesionales. Primero, escribe siempre Option Explicit en la primera línea de cada módulo: obliga a declarar todas las variables con Dim y evita errores silenciosos por tipear mal un nombre. Segundo, envuelve tus procedimientos con On Error GoTo ManejoError y restaura Application.ScreenUpdating = True al salir, para que Excel no quede congelado si algo falla a mitad de camino.",
      ],
      captura: {
        id: "macros-vba-excel-desde-cero-paso-4",
        alt: "Editor de Visual Basic de Excel mostrando el Explorador de proyectos a la izquierda y un Módulo nuevo con Option Explicit",
        caption:
          "Editor VBA (Alt + F11): usa siempre módulos estándar e inicia con Option Explicit.",
        ratio: "16/9",
      },
    },
    {
      id: "seis-ejemplos-vba",
      titulo: "5. Seis procedimientos VBA completos listos para usar",
      esPasoHowTo: true,
      resumenHowTo:
        "Copia y adapta seis macros de oficina comentadas: consolidar hojas, exportar a PDF, limpiar texto, enviar por Outlook, separar por categoría y actualizar Power Query.",
      parrafos: [
        "A continuación tienes seis procedimientos completos, probados y escritos con Option Explicit y manejo de errores. Cada uno resuelve una necesidad real de administración, finanzas o control de gestión. Puedes copiarlos en un módulo estándar y asignarlos a botones o formas dentro de tu hoja.",
      ],
      subsecciones: [
        {
          id: "macro-consolidar-hojas",
          titulo: "Ejemplo 1: Consolidar todas las hojas en una hoja Maestra",
          parrafos: [
            "Recorre todas las hojas del libro (excepto la hoja destino llamada 'Consolidado'), copia sus filas de datos saltando la fila 1 de encabezados y las apila una debajo de otra.",
          ],
          codigo: {
            titulo: "ConsolidarHojas() — Apilar hojas en 'Consolidado'",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub ConsolidarHojas()
    Dim wsDestino As Worksheet
    Dim ws As Worksheet
    Dim ultimaFilaOrigen As Long
    Dim ultimaFilaDestino As Long

    On Error GoTo ManejoError
    Application.ScreenUpdating = False

    Set wsDestino = ThisWorkbook.Worksheets("Consolidado")
    wsDestino.Cells.Clear

    For Each ws In ThisWorkbook.Worksheets
        If ws.Name <> wsDestino.Name Then
            ultimaFilaOrigen = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
            If ultimaFilaOrigen >= 2 Then
                If wsDestino.Range("A1").Value = "" Then
                    ws.Rows("1:" & ultimaFilaOrigen).Copy Destination:=wsDestino.Range("A1")
                Else
                    ultimaFilaDestino = wsDestino.Cells(wsDestino.Rows.Count, 1).End(xlUp).Row + 1
                    ws.Rows("2:" & ultimaFilaOrigen).Copy Destination:=wsDestino.Range("A" & ultimaFilaDestino)
                End If
            End If
        End If
    Next ws

    Application.ScreenUpdating = True
    MsgBox "Consolidación completada correctamente.", vbInformation
    Exit Sub

ManejoError:
    Application.ScreenUpdating = True
    MsgBox "Error al consolidar (" & Err.Number & "): " & Err.Description, vbCritical
End Sub`,
          },
        },
        {
          id: "macro-exportar-pdf",
          titulo: "Ejemplo 2: Exportar la hoja activa a PDF en la misma carpeta",
          parrafos: [
            "Genera un archivo PDF limpio con la fecha del día en el nombre dentro de la misma carpeta donde está guardado el libro .xlsm.",
          ],
          codigo: {
            titulo: "ExportarHojaAPDF() — PDF automático con fecha",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub ExportarHojaAPDF()
    Dim rutaSalida As String
    Dim nombreArchivo As String

    On Error GoTo ManejoError

    If ThisWorkbook.Path = "" Then
        MsgBox "Guarda primero el libro antes de exportar a PDF.", vbExclamation
        Exit Sub
    End If

    nombreArchivo = ActiveSheet.Name & "_" & Format(Date, "yyyy-mm-dd") & ".pdf"
    rutaSalida = ThisWorkbook.Path & Application.PathSeparator & nombreArchivo

    ActiveSheet.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=rutaSalida, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False, _
        OpenAfterPublish:=False

    MsgBox "PDF exportado en: " & rutaSalida, vbInformation
    Exit Sub

ManejoError:
    MsgBox "No se pudo exportar a PDF: " & Err.Description, vbCritical
End Sub`,
          },
        },
        {
          id: "macro-limpiar-espacios",
          titulo: "Ejemplo 3: Limpiar espacios extra y saltos de línea de la selección",
          parrafos: [
            "Ideal cuando pegas tablas desde ERP o páginas web que traen espacios dobles, tabulaciones o saltos de línea ocultos (Chr(10) y Chr(13)) dentro de las celdas.",
          ],
          codigo: {
            titulo: "LimpiarTextoSeleccionado() — Trim y Clean masivo",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub LimpiarTextoSeleccionado()
    Dim celda As Range
    Dim textoLimpio As String

    On Error GoTo ManejoError
    If TypeName(Selection) <> "Range" Then Exit Sub

    Application.ScreenUpdating = False
    For Each celda In Selection.Cells
        If Not IsError(celda.Value) And VarType(celda.Value) = vbString Then
            textoLimpio = Replace(celda.Value, Chr(10), " ")
            textoLimpio = Replace(textoLimpio, Chr(13), " ")
            celda.Value = Application.WorksheetFunction.Trim(textoLimpio)
        End If
    Next celda

    Application.ScreenUpdating = True
    MsgBox "Limpieza finalizada.", vbInformation
    Exit Sub

ManejoError:
    Application.ScreenUpdating = True
    MsgBox "Error al limpiar celdas: " & Err.Description, vbCritical
End Sub`,
          },
        },
        {
          id: "macro-enviar-outlook",
          titulo: "Ejemplo 4: Enviar el libro actual por correo usando Outlook",
          parrafos: [
            "Crea un borrador en Outlook adjuntando el libro guardado y usando .Display (puedes cambiarlo a .Send si quieres envío directo). Advertencia importante: esta automatización COM funciona únicamente con Outlook clásico de escritorio en Windows (no con el 'Nuevo Outlook' ni Outlook Web) y puede mostrar avisos de seguridad si tu empresa exige confirmación programática.",
          ],
          codigo: {
            titulo: "EnviarReportePorOutlook() — Borrador con adjunto",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub EnviarReportePorOutlook()
    Dim outlookApp As Object
    Dim correo As Object

    On Error GoTo ManejoError

    If ThisWorkbook.Path = "" Then
        MsgBox "Guarda el libro antes de enviarlo por correo.", vbExclamation
        Exit Sub
    End If

    Set outlookApp = CreateObject("Outlook.Application")
    Set correo = outlookApp.CreateItem(0)

    With correo
        .To = "destinatario@empresa-ejemplo.cl"
        .Subject = "Reporte actualizado al " & Format(Date, "dd-mm-yyyy")
        .Body = "Hola," & vbCrLf & vbCrLf & "Adjunto el reporte actualizado en Excel."
        .Attachments.Add ThisWorkbook.FullName
        .Display ' Usa .Send para enviar sin previsualizar
    End With

    Set correo = Nothing
    Set outlookApp = Nothing
    Exit Sub

ManejoError:
    MsgBox "No se pudo conectar con Outlook clásico de escritorio: " & Err.Description, vbCritical
End Sub`,
          },
        },
        {
          id: "macro-hojas-categoria",
          titulo: "Ejemplo 5: Crear una hoja separada por cada categoría única",
          parrafos: [
            "Toma una tabla en la hoja 'Base' (asumiendo la categoría en la columna B) y genera automáticamente una pestaña por cada valor único usando AutoFilter.",
          ],
          codigo: {
            titulo: "SepararPorCategoria() — Crear pestañas dinámicas",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub SepararPorCategoria()
    Dim wsBase As Worksheet
    Dim wsNueva As Worksheet
    Dim dict As Object
    Dim ultimaFila As Long
    Dim i As Long
    Dim cat As Variant

    On Error GoTo ManejoError
    Application.ScreenUpdating = False

    Set wsBase = ThisWorkbook.Worksheets("Base")
    Set dict = CreateObject("Scripting.Dictionary")
    ultimaFila = wsBase.Cells(wsBase.Rows.Count, 2).End(xlUp).Row

    For i = 2 To ultimaFila
        cat = Trim(CStr(wsBase.Cells(i, 2).Value))
        If cat <> "" And Not dict.Exists(cat) Then dict.Add cat, True
    Next i

    For Each cat In dict.Keys
        On Error Resume Next
        Application.DisplayAlerts = False
        ThisWorkbook.Worksheets(CStr(cat)).Delete
        Application.DisplayAlerts = True
        On Error GoTo ManejoError

        Set wsNueva = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        wsNueva.Name = Left(CStr(cat), 31)

        wsBase.Range("A1").AutoFilter Field:=2, Criteria1:=CStr(cat)
        wsBase.UsedRange.SpecialCells(xlCellTypeVisible).Copy Destination:=wsNueva.Range("A1")
    Next cat

    wsBase.AutoFilterMode = False
    Application.ScreenUpdating = True
    MsgBox "Hojas por categoría creadas.", vbInformation
    Exit Sub

ManejoError:
    wsBase.AutoFilterMode = False
    Application.ScreenUpdating = True
    MsgBox "Error al separar categorías: " & Err.Description, vbCritical
End Sub`,
          },
        },
        {
          id: "macro-actualizar-power-query",
          titulo: "Ejemplo 6: Botón para actualizar todas las consultas Power Query",
          parrafos: [
            "Permite ofrecer a un usuario final un botón gigante en la portada que actualiza todas las conexiones de Power Query y tablas dinámicas del libro de una sola vez.",
          ],
          codigo: {
            titulo: "ActualizarTodoElLibro() — Refrescar Power Query y dinámicas",
            lenguaje: "vba",
            codigo: `Option Explicit

Sub ActualizarTodoElLibro()
    On Error GoTo ManejoError
    Application.ScreenUpdating = False

    ' Asegura que Power Query termine antes de seguir si desactivas carga en segundo plano
    ThisWorkbook.RefreshAll
    DoEvents

    Application.ScreenUpdating = True
    MsgBox "Consultas y tablas dinámicas actualizadas.", vbInformation
    Exit Sub

ManejoError:
    Application.ScreenUpdating = True
    MsgBox "Error al actualizar conexiones: " & Err.Description, vbCritical
End Sub`,
          },
        },
      ],
      captura: {
        id: "macros-vba-excel-desde-cero-paso-5",
        alt: "Módulo VBA en Excel mostrando el código comentado de ConsolidarHojas con Option Explicit y manejo de errores",
        caption:
          "Los seis procedimientos listos en un módulo estándar con control de errores y restauración de pantalla.",
        ratio: "16/9",
      },
    },
    {
      id: "seguridad-macros",
      titulo: "6. Seguridad de macros y archivos bloqueados de internet",
      esPasoHowTo: true,
      resumenHowTo:
        "Comprende por qué Microsoft bloquea las macros descargadas de internet y cómo habilitar solo libros de confianza.",
      parrafos: [
        "Desde las actualizaciones recientes de seguridad de Microsoft 365 y Office, Excel bloquea de forma predeterminada las macros VBA en cualquier archivo que provenga de internet (correo electrónico, descarga web o OneDrive/SharePoint externo), mostrando una barra roja que dice: 'RIESGO DE SEGURIDAD: Microsoft bloqueó la ejecución de macros porque el origen de este archivo no es de confianza'.",
        "Nunca desactives todas las defensas eligiendo 'Habilitar todas las macros' en el Centro de confianza, ya que quedarías expuesto a código malicioso. Si descargaste una plantilla legítima de tu empresa o de una fuente verificada, cierra el archivo en Excel, haz clic derecho sobre el archivo .xlsm en el Explorador de archivos de Windows > Propiedades y marca la casilla Desbloquear al final de la pestaña General (o muévelo a una carpeta marcada como Ubicación de confianza en Excel).",
      ],
      captura: {
        id: "macros-vba-excel-desde-cero-paso-6",
        alt: "Propiedades de archivo en Windows mostrando la casilla Desbloquear en la parte inferior para habilitar macros seguras",
        caption:
          "Método oficial recomendado por Microsoft para habilitar macros legítimas en un archivo descargado.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Al cerrar y volver a abrir el archivo, mis macros desaparecieron",
      causa:
        "El archivo se guardó con extensión estándar .xlsx en lugar de .xlsm.",
      solucion:
        "Usa Guardar como y selecciona 'Libro de Excel habilitado para macros (*.xlsm)'.",
    },
    {
      error: "Error de compilación: No se ha definido la variable",
      causa:
        "Tienes Option Explicit activo (lo cual es bueno) y usaste una variable sin declararla con Dim, o escribiste mal su nombre.",
      solucion:
        "Declara la variable al principio del Sub (por ejemplo, Dim fila As Long) o corrige el nombre mal escrito.",
    },
    {
      error: "Error 1004 en tiempo de ejecución al copiar o seleccionar hojas",
      causa:
        "La macro intenta acceder a una hoja con un nombre distinto al escrito en el código (por ejemplo, 'Base' vs 'Hoja1') o la hoja está protegida.",
      solucion:
        "Verifica los nombres exactos de las pestañas en tu libro y desprotege la hoja antes de modificarla.",
    },
    {
      error: "La macro de Outlook falla con error 429: El componente ActiveX no puede crear el objeto",
      causa:
        "Estás usando el 'Nuevo Outlook' de Windows o Outlook Web, o estás en macOS, donde CreateObject('Outlook.Application') no está disponible.",
      solucion:
        "Cambia al Outlook clásico de escritorio en Windows o usa Power Automate para enviar correos desde la nube.",
    },
  ],
  plantilla: {
    titulo: "Libro .xlsm con las 6 macros instaladas y botones de prueba",
    descripcion:
      "Próximamente podrás descargar aquí el archivo de práctica con los 6 procedimientos VBA ya montados en módulos y listos para probar con datos ficticios.",
  },
  faqs: [
    {
      q: "¿Deshacer (Ctrl + Z) funciona después de ejecutar una macro?",
      a: "No. En Excel, ejecutar código VBA borra la pila de Deshacer. Por eso es buena práctica hacer una copia del archivo o probar tus macros nuevas sobre una copia de respaldo.",
    },
    {
      q: "¿Dónde guardo una macro si quiero usarla en todos mis archivos de Excel?",
      a: "Al grabarla, elige 'Libro de macros personal' (PERSONAL.XLSB). Ese libro oculto se abre automáticamente cada vez que inicias Excel en tu equipo.",
    },
    {
      q: "¿Las macros VBA funcionan en Excel de Mac?",
      a: "La mayoría sí (bucles, rangos, PDF, fórmulas), pero las macros que usan Scripting.Dictionary o CreateObject('Outlook.Application') son exclusivas de Windows.",
    },
    {
      q: "¿Qué diferencia hay entre VBA y Office Scripts?",
      a: "VBA es el lenguaje clásico de escritorio para Windows/Mac. Office Scripts usa TypeScript y funciona en Excel para la web y Power Automate, pensado para flujos en la nube de Microsoft 365.",
    },
  ],
  relacionadas: [
    "automatizar-excel-con-power-query",
    "automatizar-excel-con-python",
    "como-hacer-dashboard-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Referencia oficial de VBA para Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/overview/excel",
      fuente: "Microsoft Learn",
    },
    {
      label: "Bloqueo de macros descargadas de internet",
      url: "https://learn.microsoft.com/es-es/deployoffice/security/internet-macros-blocked",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
