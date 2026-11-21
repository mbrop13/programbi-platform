import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "enviar-reportes-automaticos-con-power-automate",
  title: "Enviar reportes automáticos por correo con Power Automate",
  meta: "Crea un flujo en Power Automate que envía cada lunes tu reporte de Excel o Power BI por correo, con filtros y adjuntos. Paso a paso, con capturas.",
  h1: "Cómo enviar reportes automáticos por correo con Power Automate",
  subtitle:
    "Configura flujos programados en la nube para leer tablas de Excel desde OneDrive, exportar informes de Power BI a PDF, controlar errores y despachar correos cada lunes sin intervención manual.",
  keywordPrincipal: "Power Automate enviar correo con Excel",
  keywords: [
    "Power Automate enviar correo con Excel",
    "enviar reporte Power BI por correo",
    "envio automatico de reportes",
    "flujo programado Power Automate",
    "exportar Power BI a PDF",
  ],
  curso: "power-automate",
  herramienta: "Power Automate",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Dos flujos listos para producción en Power Automate: uno que lee una tabla de Excel en OneDrive y envía una tabla HTML por correo cada lunes, y otro que exporta un reporte de Power BI a PDF con manejo de errores.",
    herramienta: "Microsoft Power Automate (nube) + OneDrive/SharePoint + Outlook/Power BI",
    tiempo: "35 minutos",
    bullets: [
      "Distinguir qué conectores están incluidos en Microsoft 365 y cuáles requieren capacidad Premium/Fabric.",
      "Armar un flujo programado con Recurrence, List rows present in a table y Create HTML table.",
      "Exportar informes de Power BI a PDF con Export to File for Power BI Reports.",
      "Usar expresiones de fecha/hora para Chile y bloques de control de errores.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Licencias reales",
      resumen: "Valida qué conectores cubre Microsoft 365 vs Premium/Fabric.",
      anchorId: "licencias-power-automate-reportes",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Flujo Excel → Correo",
      resumen: "Lee una tabla en OneDrive y envía resumen HTML cada lunes.",
      anchorId: "flujo-1-excel-onedrive-correo",
      icono: "mail",
    },
    {
      numero: 3,
      titulo: "Flujo Power BI → PDF",
      resumen: "Exporta páginas filtradas a PDF o PPTX y adjúntalas.",
      anchorId: "flujo-2-exportar-power-bi",
      icono: "file",
    },
    {
      numero: 4,
      titulo: "Sin licencia extra",
      resumen: "Alternativas prácticas con suscripciones nativas o enlaces.",
      anchorId: "alternativa-sin-licencia-premium",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Errores y aprobación",
      resumen: "Captura fallos con Scope y agrega visto bueno previo.",
      anchorId: "manejo-errores-aprobacion",
      icono: "check",
    },
    {
      numero: 6,
      titulo: "Expresiones útiles",
      resumen: "Formatea fechas y convierte UTC a hora oficial de Chile.",
      anchorId: "expresiones-utiles-fechas-chile",
      icono: "code",
    },
  ],
  requisitos: {
    version: "Power Automate en la nube (make.powerautomate.com) con cuenta Microsoft 365",
    lista: [
      "Cuenta corporativa o educativa de Microsoft 365 con acceso a Power Automate, OneDrive/SharePoint y Outlook (Exchange Online).",
      "Para el Flujo 1: un libro de Excel guardado en OneDrive o SharePoint cuyos datos estén dentro de una Tabla oficial (Ctrl + T).",
      "Para el Flujo 2: un informe publicado en un Área de trabajo de Power BI respaldada por capacidad Premium o Fabric (requisito de Microsoft Learn para la acción de exportación).",
    ],
    compatibilidadMacWeb:
      "Power Automate en la nube funciona 100% desde el navegador en Windows y macOS, y los flujos programados se ejecutan en los servidores de Microsoft sin requerir que tu computador esté encendido.",
  },
  herramientasHowTo: [
    "Microsoft Power Automate (navegador web)",
    "OneDrive para la Empresa o SharePoint",
    "Office 365 Outlook",
  ],
  insumosHowTo: [
    "Archivo Excel con Tabla estructurada en OneDrive/SharePoint",
    "Informe de Power BI publicado (para el flujo de exportación PDF)",
  ],
  secciones: [
    {
      id: "licencias-power-automate-reportes",
      titulo: "1. Qué licencias necesitas realmente antes de construir el flujo",
      esPasoHowTo: true,
      resumenHowTo:
        "Verifica si tu escenario usa conectores estándar incluidos en Microsoft 365 (OneDrive, Excel Online, Outlook) o requiere capacidad Premium/Fabric para exportar reportes de Power BI.",
      parrafos: [
        "Antes de diseñar un flujo en Power Automate, conviene revisar qué conectores cubre tu plan actual de Microsoft 365 para no encontrarte con un bloqueo al momento de activarlo. La buena noticia es que enviar reportes desde Excel en OneDrive o SharePoint por Outlook utiliza únicamente conectores Estándar incluidos en la mayoría de las licencias Microsoft 365 comerciales.",
        "En cambio, cuando el objetivo es exportar automáticamente un informe de Power BI a PDF o PowerPoint mediante la acción oficial de Power Automate, la documentación de Microsoft Learn establece requisitos específicos de capacidad: el Área de trabajo donde vive el informe debe estar asignada a una capacidad Power BI Premium, Premium por usuario (PPU) o Microsoft Fabric (no basta con un espacio compartido estándar de Power BI Pro).",
        "La siguiente tabla resume las capacidades y requisitos documentados por Microsoft sin entrar en tarifas comerciales variables:",
      ],
      tabla: {
        caption: "Comparación de requisitos de licenciamiento según el tipo de flujo de reportería",
        encabezados: [
          "Escenario de automatización",
          "Conectores / acciones clave",
          "Requisito de licencia (según Microsoft)",
        ],
        filas: [
          [
            "Leer tabla de Excel en OneDrive/SharePoint y enviar correo HTML o adjunto",
            "Recurrence, Excel Online (Business), OneDrive/SharePoint, Office 365 Outlook",
            "Incluido en planes Microsoft 365 estándar (conectores Estándar).",
          ],
          [
            "Exportar informe de Power BI a PDF/PPTX/PNG y enviarlo por correo",
            "Export to File for Power BI Reports",
            "Workspace en capacidad Power BI Premium / PPU / Fabric (con límites de llamadas por minuto según capacidad).",
          ],
          [
            "Conectar Power Automate directo a SQL Server local o APIs privadas (HTTP)",
            "SQL Server / HTTP personalizado",
            "Requiere licencia Power Automate Premium (conectores Premium).",
          ],
        ],
      },
      captura: {
        id: "enviar-reportes-automaticos-con-power-automate-paso-1",
        alt: "Portal de Power Automate mostrando conectores estándar de Excel Online y Outlook frente a conectores marcados como Premium",
        caption:
          "Identifica desde el inicio si tus conectores son estándar de Microsoft 365 o requieren licencia/capacidad adicional.",
        ratio: "16/9",
      },
    },
    {
      id: "flujo-1-excel-onedrive-correo",
      titulo: "2. Flujo 1: leer Excel en OneDrive y enviar reporte semanal por correo",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea un flujo de nube programado con Recurrence (cada lunes), lee las filas con List rows present in a table, fíltralas, arma una tabla HTML con Create HTML table y envíala con Send an email (V2).",
      parrafos: [
        "Este es el flujo más utilizado para automatizar reportes con Power Automate usando únicamente conectores estándar. Supongamos que tienes un libro llamado ControlVentas.xlsx guardado en tu OneDrive para la Empresa (o en una biblioteca de SharePoint) con una Tabla oficial llamada tblResumenPendientes.",
        "Entra a make.powerautomate.com, haz clic en Crear > Flujo de nube programado. Asígnale un nombre claro (por ejemplo, 'Envio semanal pendientes lunes 08:00'), define el inicio, repite cada 1 Semana, marca solo Lunes y selecciona la zona horaria (UTC-04:00 / UTC-03:00 Santiago según corresponda). Power Automate creará el disparador Recurrence como primer bloque.",
        "A continuación agrega estas acciones en secuencia: primero, Excel Online (Business) > Enumerar filas presentes en una tabla (List rows present in a table). Selecciona la ubicación (OneDrive for Business), la biblioteca, el archivo ControlVentas.xlsx y la tabla tblResumenPendientes. Si solo quieres enviar filas con estado 'Pendiente', usa el parámetro Consulta de filtros (Filter Query) escribiendo Estado eq 'Pendiente'.",
        "Luego agrega Operación de datos > Crear tabla HTML (Create HTML table). En 'De' selecciona el valor dinámico value del paso anterior. Cambia 'Columnas' de Automático a Personalizado para elegir exactamente qué columnas mostrar en el correo y con qué encabezados legibles (evitando columnas internas de Power Automate como @odata.etag).",
        "Finalmente, agrega Office 365 Outlook > Enviar correo electrónico (V2) (Send an email (V2)). Pon los destinatarios, un asunto dinámico con la fecha del día, y en el cuerpo inserta la Salida de la tabla HTML. Si además quieres adjuntar el libro completo de Excel, inserta antes la acción OneDrive para la Empresa > Obtener contenido de archivo y pásalo en el apartado Datos adjuntos del correo.",
      ],
      listaOrdenada: [
        "Disparador: Recurrence configurado cada 1 semana los lunes a las 08:00 (zona horaria de Santiago).",
        "Acción 1: Excel Online (Business) — List rows present in a table (con Filter Query opcional, ej. Estado eq 'Pendiente').",
        "Acción 2 (opcional): Filter array o Condition para verificar que length(body('List_rows_present_in_a_table')?['value']) sea mayor a 0 y no enviar correos vacíos.",
        "Acción 3: Data Operation — Create HTML table con columnas personalizadas.",
        "Acción 4 (opcional): Compose con un bloque <style> CSS simple para darle bordes y encabezado limpio a la tabla HTML.",
        "Acción 5: Office 365 Outlook — Send an email (V2) insertando el estilo CSS + Output de la tabla HTML.",
      ],
      codigos: [
        {
          titulo: "Bloque CSS opcional en acción Compose para estilizar la tabla HTML en Outlook",
          lenguaje: "power-automate",
          codigo: `<style>
table { border-collapse: collapse; width: 100%; font-family: Segoe UI, Arial, sans-serif; font-size: 13px; }
th { background-color: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; }
td { padding: 7px 10px; border: 1px solid #cbd5e1; color: #1e293b; }
tr:nth-child(even) td { background-color: #f8fafc; }
</style>`,
          nota: "Inserta la salida de este Compose justo antes de la salida de Create HTML table dentro del cuerpo HTML del correo.",
        },
      ],
      captura: {
        id: "enviar-reportes-automaticos-con-power-automate-paso-2",
        alt: "Diseñador de Power Automate mostrando la secuencia Recurrence, List rows present in a table, Create HTML table y Send an email (V2)",
        caption:
          "Flujo semanal completo usando únicamente conectores estándar incluidos en Microsoft 365.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Límite de filas por defecto en List rows present in a table",
        texto:
          "Por defecto, Excel Online devuelve un máximo de 256 filas por llamada. Si tu tabla tiene más registros, haz clic en los tres puntos de la acción > Configuración > activa Paginación y define un umbral mayor (por ejemplo 5000).",
      },
    },
    {
      id: "flujo-2-exportar-power-bi",
      titulo: "3. Flujo 2: exportar un informe de Power BI a PDF y enviarlo por correo",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa la acción Export to File for Power BI Reports sobre un Workspace en capacidad Premium o Fabric para generar un PDF filtrado y enviarlo como adjunto.",
      parrafos: [
        "Cuando el reporte que quieres distribuir vive en Power BI y la gerencia necesita recibir un archivo PDF multipágina adjunto en el correo (por ejemplo, un reporte distinto por cada sucursal), el conector oficial de Power BI en Power Automate ofrece la acción Exportar a archivo para informes de Power BI (Export to File for Power BI Reports).",
        "De acuerdo con la documentación de Microsoft Learn, esta acción requiere que el informe esté publicado en un Área de trabajo asignada a capacidad Premium, Premium por usuario (PPU) o Microsoft Fabric. Además, la exportación se ejecuta de forma asíncrona, aunque el conector de Power Automate espera automáticamente hasta que el PDF queda listo para pasar al siguiente bloque.",
        "En la configuración de la acción seleccionas el Área de trabajo, el Informe y el Formato de exportación (PDF o PPTX). Si necesitas enviarle a cada jefe únicamente los datos de su sucursal sin crear diez informes distintos, puedes pasar un filtro en el campo ReportLevelFilters usando la sintaxis Tabla/Columna eq 'Valor' (por ejemplo, Sucursales/Region eq 'Zona Centro'). Luego conectas Send an email (V2), pones un nombre terminado en .pdf en Datos adjuntos - Nombre y asignas el contenido dinámico File Content de la exportación.",
      ],
      codigos: [
        {
          titulo: "Sintaxis de filtro dinámico en ReportLevelFilters (Export to File)",
          lenguaje: "power-automate",
          codigo: `Sucursales/CodigoSucursal eq 'SUC-01'`,
          nota: "Respeta exactamente el nombre de la tabla y columna del modelo semántico en Power BI. Si el nombre tiene espacios, reemplázalos por _x0020_.",
        },
      ],
      captura: {
        id: "enviar-reportes-automaticos-con-power-automate-paso-3",
        alt: "Acción Export to File for Power BI Reports en Power Automate con formato PDF y filtro de nivel de informe configurado",
        caption:
          "Exportación automatizada de Power BI a PDF con filtros dinámicos para adjuntar en Outlook.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Cuota de renderizado en capacidad compartida",
        texto:
          "Microsoft Learn documenta límites de solicitudes de exportación por minuto según el SKU de capacidad Premium/Fabric (y límites más estrictos en PPU). Si vas a enviar 30 PDFs distintos en un bucle Aplicar a cada uno, agrega una acción Retraso (Delay) de 15 a 30 segundos entre iteraciones para no saturar la capacidad.",
      },
    },
    {
      id: "alternativa-sin-licencia-premium",
      titulo: "4. Alternativas prácticas si no cuentas con capacidad Premium o Fabric",
      esPasoHowTo: true,
      resumenHowTo:
        "Combina suscripciones nativas de Power BI, enlaces directos con parámetros de filtro URL o el envío del archivo Excel actualizado desde SharePoint.",
      parrafos: [
        "Si tu organización trabaja exclusivamente con licencias Power BI Pro (sin capacidad Premium ni Fabric), la acción Export to File for Power BI Reports devolverá un error de capacidad no soportada. Sin embargo, no tienes que renunciar a la automatización de envíos.",
        "La primera alternativa es usar las Suscripciones nativas dentro de Power BI Service: no requieren Power Automate, envían un correo programado (por ejemplo, después de cada actualización de datos) con una imagen de vista previa de la página y el botón 'Ir al informe'. Si necesitas enviar un enlace filtrado por sucursal desde Power Automate sin exportar PDF, puedes armar un correo HTML en Outlook que incluya la URL del informe en Power BI Service concatenada con ?filter=Tabla/Columna eq 'Valor'.",
        "La segunda alternativa, muy usada para reportes operativos en Excel, es actualizar un libro maestro con Power Automate (o Power Query en SharePoint) y enviar un enlace directo al archivo en SharePoint o adjuntar una tabla HTML resumen con los indicadores clave directamente en el cuerpo del correo.",
      ],
      lista: [
        "Suscripción nativa de Power BI Service: ideal para enviar vista previa + enlace directo con licencia Pro.",
        "Correo HTML con enlace filtrado (?filter=...): permite personalizar el link por destinatario desde Power Automate usando solo conectores estándar.",
        "Resumen HTML desde Excel Online: extrae los KPIs de una tabla resumen en OneDrive/SharePoint y los envía tabulados en el cuerpo del correo.",
      ],
      captura: {
        id: "enviar-reportes-automaticos-con-power-automate-paso-4",
        alt: "Cuerpo de correo en Send an email (V2) combinando tabla HTML resumen y enlace directo filtrado a Power BI Service",
        caption:
          "Alternativa sin capacidad Premium: resumen ejecutivo en HTML más enlace directo al informe en la nube.",
        ratio: "16/9",
      },
    },
    {
      id: "manejo-errores-aprobacion",
      titulo: "5. Agregar manejo de errores (Try/Catch) y paso de aprobación opcional",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrupa los pasos críticos en un Ámbito (Scope), configura un segundo Scope con 'Ejecutar después' solo ante fallos para alertarte por correo, y añade aprobación previa si el reporte es sensible.",
      parrafos: [
        "Un flujo desatendido que falla en silencio es peor que no tener automatización, porque el lunes a las 08:30 nadie recibe el reporte y nadie se entera hasta que el gerente pregunta por él. Para evitarlo, utiliza el patrón Try / Catch nativo de Power Automate con el control Ámbito (Scope).",
        "Crea un primer Scope llamado 'Try - Generar y Enviar Reporte' y mete dentro todas las acciones de lectura, armado de tabla o exportación y envío. Debajo, crea un segundo Scope llamado 'Catch - Notificar Error'. Haz clic en los tres puntos del Scope Catch > Configurar ejecución posterior (Configure run after), desmarca 'Es correcto' y marca 'Error', 'Se agotó el tiempo de espera' y 'Se omitió'.",
        "Dentro del Scope Catch pon un Send an email (V2) dirigido a ti mismo (o a un canal de Teams de soporte) indicando qué flujo falló y la fecha. Además, si el reporte requiere revisión humana antes de salir a clientes o directorio (por ejemplo, cierre contable), puedes insertar la acción Aprobaciones > Iniciar y esperar una aprobación antes del envío final: el flujo se pausará hasta que hagas clic en Aprobar desde Outlook o Teams.",
      ],
      captura: {
        id: "enviar-reportes-automaticos-con-power-automate-paso-5",
        alt: "Configuración de Ejecutar después (Configure run after) en un Scope Catch de Power Automate marcando Error y Se agotó el tiempo de espera",
        caption:
          "Patrón Try/Catch con Scope para recibir una alerta inmediata si alguna acción del flujo falla.",
        ratio: "16/9",
      },
    },
    {
      id: "expresiones-utiles-fechas-chile",
      titulo: "6. Expresiones útiles de fecha y hora para Chile en Power Automate",
      esPasoHowTo: false,
      parrafos: [
        "Al igual que Power BI Service, los motores de Power Automate ejecutan la función utcNow() en hora universal coordinada (UTC). Si pones utcNow() directo en el asunto del correo cuando ejecutas un flujo a las 22:00 de Chile, el asunto mostrará la fecha del día siguiente.",
        "Para mostrar la fecha y hora local de Chile con formato dd-MM-yyyy, usa siempre convertFromUtc combinada con formatDateTime en la pestaña Expresión del editor de contenido dinámico:",
      ],
      codigos: [
        {
          titulo: "Fecha actual formateada en dd-MM-yyyy (UTC directo)",
          lenguaje: "power-automate",
          codigo: `formatDateTime(utcNow(), 'dd-MM-yyyy')`,
          nota: "Útil para referencias rápidas cuando el flujo corre durante la mañana en Chile (entre 04:00 y 20:00).",
        },
        {
          titulo: "Fecha y hora convertida a zona horaria oficial de Chile (Pacific SA Standard Time)",
          lenguaje: "power-automate",
          codigo: `formatDateTime(convertFromUtc(utcNow(), 'Pacific SA Standard Time'), 'dd-MM-yyyy HH:mm')`,
          nota: "'Pacific SA Standard Time' es el identificador oficial de Windows/Microsoft para Santiago de Chile y maneja automáticamente el cambio de horario.",
        },
        {
          titulo: "Asunto de correo dinámico listo para copiar en la pestaña Expresión",
          lenguaje: "power-automate",
          codigo: `concat('Reporte semanal de ventas — ', formatDateTime(convertFromUtc(utcNow(), 'Pacific SA Standard Time'), 'dd-MM-yyyy'))`,
          nota: "Produce por ejemplo: 'Reporte semanal de ventas — 23-11-2026'.",
        },
      ],
    },
  ],
  erroresComunes: [
    {
      error: "List rows present in a table no encuentra filas o falla con 'Table not found'",
      causa:
        "Los datos en el archivo Excel de OneDrive son un rango normal de celdas y no fueron convertidos en una Tabla oficial de Excel (Ctrl + T).",
      solucion:
        "Abre el archivo en Excel, selecciona los datos, presiona Ctrl + T para crear una Tabla con nombre claro (ej. tblVentas), guarda y vuelve a seleccionarla en Power Automate.",
    },
    {
      error: "Las fechas leídas desde Excel Online aparecen como números de serie (ej. 46347)",
      causa:
        "Por defecto, el conector de Excel Online devuelve las fechas en formato numérico interno de Excel (ISO serial).",
      solucion:
        "En la acción List rows present in a table, despliega Mostrar opciones avanzadas y cambia Formato de fecha y hora (DateTime Format) de Serial Number a ISO 8601.",
    },
    {
      error: "Export to File for Power BI Reports falla con error 403 o FeatureNotAvailable",
      causa:
        "El Área de trabajo donde está publicado el reporte usa licencia Pro estándar y no está asignada a una capacidad Premium, PPU o Fabric.",
      solucion:
        "Mueve el informe a un Workspace respaldado por capacidad Fabric/Premium o utiliza suscripciones nativas de Power BI / resumen HTML como alternativa.",
    },
    {
      error: "El flujo envía un correo vacío todos los lunes aunque no hay pendientes",
      causa:
        "No se validó si el arreglo devuelto por List rows present in a table contenía al menos un registro antes de llamar a Send an email (V2).",
      solucion:
        "Agrega una Condición evaluando length(outputs('List_rows_present_in_a_table')?['body/value']) es mayor que 0 antes de crear la tabla HTML y enviar el correo.",
    },
  ],
  plantilla: {
    titulo: "Guía de arquitectura y expresiones para flujos de reportería en Power Automate",
    descripcion:
      "Referencia lista para copiar con expresiones de hora Chile (Pacific SA Standard Time), plantilla CSS para tablas HTML en Outlook y estructura Try/Catch con Scope.",
  },
  faqs: [
    {
      q: "¿Mi computador tiene que estar prendido los lunes a las 08:00 para que salga el correo?",
      a: "No. Los flujos de nube programados de Power Automate se ejecutan íntegramente en los servidores de Microsoft en la nube, leyendo tus archivos desde OneDrive, SharePoint o Power BI Service.",
    },
    {
      q: "¿Puedo enviar el reporte a correos externos (clientes o proveedores) fuera de mi empresa?",
      a: "Sí, la acción Send an email (V2) permite destinatarios externos siempre que tu administrador de Microsoft 365 no haya restringido el envío automático hacia dominios externos.",
    },
    {
      q: "¿Cómo evito que el flujo se quede bloqueado porque alguien dejó abierto el archivo Excel?",
      a: "En OneDrive y SharePoint la coautoría permite leer tablas incluso si alguien tiene el archivo abierto. Sin embargo, evita que el archivo tenga ediciones de estructura pendientes o macros que bloqueen el archivo.",
    },
    {
      q: "¿Puedo disparar el envío apenas se actualiza un archivo en vez de esperar al lunes?",
      a: "Sí. En lugar de Recurrence, crea un flujo automatizado usando el disparador 'Cuando se crea o modifica un archivo (solo propiedades)' en SharePoint o OneDrive, aunque conviene agregar una condición para evitar envíos duplicados si alguien guarda varias veces seguidas.",
    },
    {
      q: "¿Qué pasa si la tabla de Excel tiene más de 256 filas?",
      a: "Por defecto Power Automate trae solo las primeras 256 filas. En la configuración de la acción List rows present in a table activa la Paginación e indica un límite mayor (por ejemplo 5.000 o 10.000).",
    },
  ],
  relacionadas: [
    "automatizar-reportes-con-power-bi",
    "automatizar-excel-con-power-query",
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de Microsoft Power Automate — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-automate/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Exportar y enviar por correo informes de Power BI con Power Automate — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-bi/collaborate-share/service-automate-power-bi-report-export",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
