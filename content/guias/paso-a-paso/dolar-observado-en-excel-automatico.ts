import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "dolar-observado-en-excel-automatico",
  title: "Dólar observado en Excel que se actualiza solo (2026)",
  meta: "Trae el dólar observado a Excel automáticamente con Power Query y la API del Banco Central o mindicador. Paso a paso, con el código listo para copiar.",
  h1: "Cómo traer el dólar observado a Excel automáticamente",
  subtitle:
    "Olvídate de copiar el tipo de cambio todos los días desde el diario o la web del Banco Central: conecta tu planilla a una fuente en línea y convierte montos de USD a CLP por fecha exacta.",
  keywordPrincipal: "dolar en Excel",
  keywords: [
    "dolar en Excel",
    "tipo de cambio en Excel",
    "dolar observado Excel",
    "actualizar dolar automaticamente",
    "API Banco Central Excel",
    "importar datos de la web a Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Una tabla histórica y diaria del dólar observado en CLP dentro de Excel que se refresca sola al abrir el archivo o cada cierto intervalo de minutos.",
    herramienta: "Excel con Power Query (o fórmula SERVICIOWEB en Microsoft 365)",
    tiempo: "20 minutos",
    bullets: [
      "Comparas tres formas reales de importar el dólar observado y eliges la que calza con tu versión de Excel.",
      "Conectas Power Query a mindicador.cl sin credenciales o a la API oficial BDE del Banco Central de Chile con parámetros.",
      "Dejas lista una fórmula BUSCARX con coincidencia aproximada (-1) para convertir facturas en USD incluso en fines de semana o feriados.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Entender el dato",
      resumen: "Qué es el dólar observado y cómo se publica en días hábiles.",
      anchorId: "que-es-dolar-observado",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Elegir método",
      resumen: "Compara mindicador.cl, API oficial del BCCh y SERVICIOWEB.",
      anchorId: "comparativa-metodos",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Power Query rápido",
      resumen: "Importa la serie desde mindicador.cl en minutos.",
      anchorId: "metodo-power-query-mindicador",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "API oficial BCCh",
      resumen: "Conecta la Base de Datos Estadísticos con parámetros seguros.",
      anchorId: "metodo-api-banco-central",
      icono: "shield",
    },
    {
      numero: 5,
      titulo: "Fórmula directa",
      resumen: "Opción sin Power Query con SERVICIOWEB y TEXTOANTES.",
      anchorId: "metodo-formula-servicioweb",
      icono: "terminal",
    },
    {
      numero: 6,
      titulo: "Refresco y BUSCARX",
      resumen: "Actualiza al abrir y cruza facturas USD→CLP por fecha.",
      anchorId: "programar-y-convertir",
      icono: "refresh",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior en Windows (Microsoft 365 recomendado para BUSCARX y TEXTOANTES).",
    lista: [
      "Conexión a internet activa para consultar el endpoint público o la API del Banco Central.",
      "Para el Método 2 (API BCCh): cuenta gratuita registrada en la Base de Datos Estadísticos del Banco Central de Chile.",
      "Para el Método 3: Excel en Windows con las funciones SERVICIOWEB, TEXTOANTES y TEXTODESPUES (Microsoft 365 o Excel 2021+).",
    ],
    compatibilidadMacWeb:
      "En Excel para Mac las consultas Power Query desde web (Web.Contents) funcionan en versiones recientes de Microsoft 365, aunque el editor M avanzado es más acotado que en Windows. La función SERVICIOWEB solo existe en Excel para Windows y no está disponible en Excel para Mac ni en Excel para la Web.",
  },
  herramientasHowTo: [
    "Excel 2016 o superior (Windows o Microsoft 365)",
    "Power Query integrado en la pestaña Datos",
  ],
  insumosHowTo: [
    "Conexión a internet",
    "Usuario y clave de la API BDE del Banco Central de Chile (solo para el Método 2)",
  ],
  secciones: [
    {
      id: "que-es-dolar-observado",
      titulo: "Qué es el dólar observado y de dónde sale el valor oficial",
      esPasoHowTo: false,
      parrafos: [
        "En Chile, el dólar observado es el tipo de cambio de referencia calculado y publicado cada día hábil bancario por el Banco Central de Chile (BCCh) a partir de las transacciones de compra y venta efectuadas por las empresas bancarias el día hábil anterior. No es un precio arbitrario ni una cotización de casa de cambios: es el indicador oficial que se utiliza en contabilidad, tributación ante el SII, facturación de exportaciones e importaciones y contratos pactados en moneda extranjera.",
        "Un detalle operativo clave al trabajar con planillas es que el Banco Central no publica dólar observado los sábados, domingos ni feriados bancarios. Por ejemplo, el valor de referencia verificado para el viernes 20 de noviembre de 2026 fue de $1.008,79 CLP (dato de ejemplo con fecha real verificada); si tu empresa emite una boleta o registra una orden de compra el sábado 21 o domingo 22, la tabla diaria no tendrá fila para esa fecha y necesitarás una fórmula capaz de tomar el último día hábil anterior.",
        "Además de la fuente primaria del Banco Central, en Chile existe el servicio comunitario gratuito mindicador.cl, que expone los indicadores económicos diarios (dólar observado, UF, UTM, euro) en formato JSON limpio y sin autenticación. Saber cuándo usar cada fuente te evita caídas en reportes críticos de cierre mensual.",
      ],
      lista: [
        "Banco Central de Chile (SIETE / BDE): fuente oficial primaria, requiere registro gratuito para consumir su API REST y permite pedir rangos históricos extensos.",
        "mindicador.cl: API REST abierta en JSON sin registro previo, ideal para prototipos rápidos o planillas personales, aunque entrega ventanas más acotadas por defecto.",
        "Feriados y fines de semana: ambos orígenes omiten días inhábiles, por lo que el cruce por fecha en Excel siempre debe contemplar coincidencia aproximada hacia atrás.",
      ],
      alerta: {
        tipo: "info",
        titulo: "Dato de referencia como ejemplo",
        texto:
          "En los ejemplos de esta guía usamos el valor de referencia verificado al 20 de noviembre de 2026 ($1.008,79 CLP por dólar) únicamente para ilustrar cálculos. Al conectar tu libro en vivo obtendrás siempre la serie actualizada.",
      },
    },
    {
      id: "comparativa-metodos",
      titulo: "Tres métodos para traer el dólar a Excel comparados",
      esPasoHowTo: false,
      parrafos: [
        "No existe un único camino válido para todas las oficinas. Si trabajas en una pyme y quieres tener el tipo de cambio en cinco minutos sin crear cuentas, mindicador.cl con Power Query es la ruta más directa. Si en cambio tu área de finanzas exige trazabilidad oficial del Banco Central y varios años de historia para auditoría, conviene configurar la API BDE desde el inicio.",
        "La tercera vía usa la función clásica SERVICIOWEB directamente en una celda, sin abrir Power Query. Es tentadora por su brevedad, pero tiene limitaciones importantes: solo funciona en Windows, no entrega tabla histórica y puede recalcularse de forma errática si el libro contiene cientos de filas.",
      ],
      tabla: {
        caption: "Comparación práctica de los 3 métodos para importar el dólar observado en Excel",
        encabezados: [
          "Criterio",
          "Método 1: Power Query + mindicador.cl",
          "Método 2: Power Query + API BCCh",
          "Método 3: Fórmula SERVICIOWEB",
        ],
        filas: [
          [
            "Requiere registro o clave",
            "No, acceso abierto",
            "Sí, usuario y clave BDE gratuitos",
            "No",
          ],
          [
            "Fuente oficial primaria",
            "No (replica datos del BCCh)",
            "Sí, Base de Datos Estadísticos del BCCh",
            "No (consulta mindicador.cl)",
          ],
          [
            "Entrega historial de fechas",
            "Sí, últimos ~30 días (o por año)",
            "Sí, rango desde cualquier fecha inicial",
            "No, solo el último valor del día",
          ],
          [
            "Compatibilidad Mac / Web",
            "Windows y Mac (Microsoft 365)",
            "Windows y Mac (Microsoft 365)",
            "Solo Excel para Windows",
          ],
          [
            "Estabilidad en reportes de cierre",
            "Alta para uso diario",
            "Muy alta (recomendada para empresas)",
            "Media (depende de recálculo de celda)",
          ],
        ],
      },
    },
    {
      id: "metodo-power-query-mindicador",
      titulo: "Paso 1 (Método 1): Conectar Power Query a mindicador.cl",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una consulta en blanco en Power Query, pega el código M que consulta el endpoint JSON de mindicador.cl, ajusta la zona horaria de Chile (-3) y carga la tabla al libro.",
      parrafos: [
        "Este método es el punto de partida más rápido porque no te pide crear usuarios ni tokens. A continuación verás el flujo completo dividido en cuatro subpasos: abrir el editor, pegar la transformación en lenguaje M, cargar la tabla en una hoja dedicada y verificar los tipos de datos.",
      ],
      subsecciones: [
        {
          id: "m1-conectar",
          titulo: "1.1 Crear la consulta en blanco y pegar el código M",
          parrafos: [
            "Abre un libro nuevo o tu archivo de trabajo, ve a la pestaña Datos en la cinta superior, haz clic en Obtener datos > De otras fuentes > Consulta en blanco. Se abrirá el Editor de Power Query. En la pestaña Inicio del editor, presiona Editor avanzado, borra las líneas por defecto y pega el siguiente código M.",
            "Fíjate en la línea que aplica DateTimeZone.SwitchZone(_, -3): el JSON de mindicador.cl entrega las fechas en formato UTC (medianoche o madrugada según el huso), lo que en horario de Chile continental (-03:00 en verano o -04:00 en invierno) puede correr la fecha un día hacia atrás si solo haces Date.From directo. Ajustar la zona horaria antes de extraer la fecha evita desfases silenciosos en tus cruces contables.",
          ],
          codigo: {
            titulo: "Consulta M: dólar observado desde mindicador.cl",
            lenguaje: "m",
            mostrarLineas: true,
            codigo: `let
    Origen = Json.Document(Web.Contents("https://mindicador.cl/api/dolar")),
    Serie = Origen[serie],
    ATabla = Table.FromList(Serie, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(ATabla, "Column1", {"fecha", "valor"}, {"FechaRaw", "ValorRaw"}),
    ConFecha = Table.TransformColumns(
        Expandido,
        {{"FechaRaw", each Date.From(DateTimeZone.SwitchZone(DateTimeZone.From(_), -3)), type date}}
    ),
    Renombrado = Table.RenameColumns(ConFecha, {{"FechaRaw", "Fecha"}, {"ValorRaw", "DolarObservado"}}),
    TipoFinal = Table.TransformColumnTypes(Renombrado, {{"Fecha", type date}, {"DolarObservado", type number}}),
    Ordenado = Table.Sort(TipoFinal, {{"Fecha", Order.Descending}})
in
    Ordenado`,
            nota: "Si Excel te pregunta por el nivel de privacidad o credenciales al ejecutar Web.Contents, selecciona Acceso anónimo y nivel Público.",
          },
        },
        {
          id: "m1-transformar",
          titulo: "1.2 Revisar tipos de datos y nombre de la consulta",
          parrafos: [
            "Una vez que aceptes el Editor avanzado, verás dos columnas limpias: Fecha (con ícono de calendario, tipo date) y DolarObservado (con ícono 1.2, tipo decimal). En el panel derecho Propiedades de la consulta, cámbiale el nombre de Consulta1 a tblDolarObservado para identificarla fácilmente al escribir fórmulas.",
          ],
        },
        {
          id: "m1-cargar",
          titulo: "1.3 Cargar a una tabla de Excel y dar formato",
          parrafos: [
            "Haz clic en Cerrar y cargar > Cerrar y cargar en... y elige Tabla en una nueva hoja de cálculo. Nombra esa hoja como TC_Dolar. Selecciona la columna DolarObservado y aplícale formato de moneda o número con 2 decimales ($ #.##0,00) para leer los valores con claridad.",
          ],
        },
      ],
      captura: {
        id: "dolar-observado-en-excel-automatico-paso-1",
        alt: "Editor avanzado de Power Query en Excel mostrando el código M conectado a mindicador.cl y la vista previa con columnas Fecha y DolarObservado",
        caption: "Consulta M en el Editor avanzado de Power Query obteniendo la serie diaria del dólar observado.",
        ratio: "16/9",
      },
    },
    {
      id: "metodo-api-banco-central",
      titulo: "Paso 2 (Método 2): Conectar la API oficial del Banco Central (BDE)",
      esPasoHowTo: true,
      resumenHowTo:
        "Regístrate en los Web Services del Banco Central, guarda tu usuario y clave en parámetros de Power Query y consulta la serie F073.TCO.PRE.Z.D limpiando los valores NaN.",
      parrafos: [
        "Cuando necesitas respaldo institucional del Banco Central de Chile o descargar el histórico completo desde años anteriores, la vía correcta es su API REST oficial de la Base de Datos Estadísticos (BDE). A diferencia de mindicador.cl, aquí controlas la fecha de inicio exacta con el parámetro firstdate y recibes el dato directamente de la fuente oficial.",
      ],
      subsecciones: [
        {
          id: "m2-registro",
          titulo: "2.1 Registro gratuito en la API del Banco Central",
          parrafos: [
            "Ingresa al portal de Web Services estadísticos del Banco Central de Chile (enlace oficial al final de la guía) y solicita tu cuenta de usuario. El registro es gratuito y te entrega un correo/usuario y una contraseña específica para consumir el endpoint GetSeries. No compartas ni subas ese archivo con tus credenciales escritas en texto plano dentro del código M si vas a distribuir la planilla fuera de tu equipo.",
          ],
        },
        {
          id: "m2-parametros",
          titulo: "2.2 Crear parámetros pUsuario y pClave en Power Query",
          parrafos: [
            "En el Editor de Power Query ve a Inicio > Administrar parámetros > Nuevo parámetro. Crea primero pUsuario (tipo Texto, valor actual tu usuario del BCCh) y luego pClave (tipo Texto, valor actual tu clave). Usar parámetros separados te permite cambiar la contraseña en un solo lugar si la renuevas, o dejarlos vacíos antes de enviar la plantilla por correo.",
          ],
        },
        {
          id: "m2-consulta",
          titulo: "2.3 Consultar la serie F073.TCO.PRE.Z.D y limpiar valores NaN",
          parrafos: [
            "El código oficial del dólar observado diario en la BDE es F073.TCO.PRE.Z.D. En los días inhábiles (fines de semana y feriados), la API devuelve la fila con el texto \"NaN\" en el campo value y puntos como separador decimal (formato estadounidense en-US). El siguiente código M filtra los NaN y convierte el número usando cultura \"en-US\" para que un Excel configurado en español de Chile no multiplique por cien ni arroje error.",
          ],
          codigo: {
            titulo: "Consulta M: API oficial BDE del Banco Central (serie F073.TCO.PRE.Z.D)",
            lenguaje: "m",
            mostrarLineas: true,
            codigo: `let
    Url = "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx",
    Respuesta = Json.Document(
        Web.Contents(
            Url,
            [
                Query = [
                    user = pUsuario,
                    pass = pClave,
                    firstdate = "2025-01-01",
                    timeseries = "F073.TCO.PRE.Z.D",
                    function = "GetSeries"
                ]
            ]
        )
    ),
    Obs = Respuesta[Series][Obs],
    Tabla = Table.FromList(Obs, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(Tabla, "Column1", {"indexDateString", "value"}, {"FechaTxt", "ValorTxt"}),
    SinNaN = Table.SelectRows(Expandido, each [ValorTxt] <> null and [ValorTxt] <> "NaN"),
    ConTipos = Table.TransformColumns(
        SinNaN,
        {
            {"FechaTxt", each Date.FromText(_, "es-CL"), type date},
            {"ValorTxt", each Number.FromText(_, "en-US"), type number}
        }
    ),
    Renombrado = Table.RenameColumns(ConTipos, {{"FechaTxt", "Fecha"}, {"ValorTxt", "DolarObservado"}}),
    Ordenado = Table.Sort(Renombrado, {{"Fecha", Order.Descending}})
in
    Ordenado`,
            nota: "Nunca pegues tu pUsuario o pClave reales dentro de capturas, repositorios ni plantillas compartidas; borra el valor actual de los parámetros antes de distribuir el libro.",
          },
        },
        {
          id: "m2-privacidad",
          titulo: "2.4 Privacidad de credenciales al compartir el libro",
          parrafos: [
            "Si otra persona de tu empresa va a abrir el archivo, evalúa si conviene que cada analista ingrese su propia credencial en los parámetros o si un proceso centralizado publica la tabla ya descargada en SharePoint/OneDrive para lectura interna. Recuerda que los parámetros de Power Query viajan dentro del archivo .xlsx a menos que los limpies antes de guardar una copia.",
          ],
        },
      ],
      captura: {
        id: "dolar-observado-en-excel-automatico-paso-2",
        alt: "Panel de Administrar parámetros en Power Query mostrando pUsuario y pClave junto a la consulta filtrada sin valores NaN de la API del Banco Central",
        caption: "Parámetros pUsuario y pClave configurados para consultar la serie F073.TCO.PRE.Z.D del Banco Central.",
        ratio: "16/9",
      },
    },
    {
      id: "metodo-formula-servicioweb",
      titulo: "Paso 3 (Método 3): Fórmula directa con SERVICIOWEB (solo Windows)",
      esPasoHowTo: true,
      resumenHowTo:
        "Extrae el último valor del dólar observado en una sola celda combinando SERVICIOWEB, TEXTODESPUES, TEXTOANTES y VALOR sin abrir Power Query.",
      parrafos: [
        "Si necesitas únicamente el último valor publicado hoy en una celda suelta —por ejemplo, para una cotización rápida en Excel para Windows— puedes evitar Power Query por completo usando la función SERVICIOWEB (WEBSERVICE en inglés). Esta función descarga el texto JSON de mindicador.cl y luego extraemos el número que aparece justo después de \"valor\": y antes de la llave de cierre }.",
        "Ten presente dos restricciones antes de adoptarla: primero, SERVICIOWEB no existe en Excel para Mac ni en Excel Web; segundo, si la API cambia el orden de sus campos o tarda en responder, la celda mostrará #¡VALOR!. Para modelos financieros serios, quédate con Power Query.",
      ],
      codigos: [
        {
          titulo: "Fórmula en celda para extraer el último dólar observado",
          lenguaje: "excel",
          codigo: `=VALOR(TEXTOANTES(TEXTODESPUES(SERVICIOWEB("https://mindicador.cl/api/dolar");"""valor"":");"}"))`,
          codigoEn: `=VALUE(TEXTBEFORE(TEXTAFTER(WEBSERVICE("https://mindicador.cl/api/dolar"),"""valor"":"),"}"))`,
          nota: "Las comillas triples alrededor de valor permiten insertar comillas dobles literales dentro de una cadena de texto en Excel.",
        },
      ],
      captura: {
        id: "dolar-observado-en-excel-automatico-paso-3",
        alt: "Barra de fórmulas de Excel en Windows mostrando la función SERVICIOWEB combinada con TEXTOANTES y TEXTODESPUES devolviendo el valor numérico del dólar",
        caption: "Extracción directa del último dólar observado en una celda usando SERVICIOWEB en Excel para Windows.",
        ratio: "16/9",
      },
    },
    {
      id: "programar-y-convertir",
      titulo: "Paso 4: Programar la actualización y convertir USD a CLP con BUSCARX",
      esPasoHowTo: true,
      resumenHowTo:
        "Configura la consulta para refrescarse al abrir el archivo y cada N minutos, y usa BUSCARX con modo de coincidencia -1 para cruzar facturas en USD incluso en días inhábiles.",
      parrafos: [
        "Tener la tabla conectada sirve de poco si hay que recordar presionar Actualizar todo cada mañana. En Excel puedes automatizar el refresco en dos niveles: cada vez que alguien abre el libro y de forma periódica mientras la planilla permanece abierta en pantalla.",
        "Para configurarlo, haz clic en cualquier celda de tu tabla de dólar, ve a la pestaña Datos > Consultas y conexiones, haz clic derecho sobre tblDolarObservado y entra a Propiedades. En la pestaña Uso, marca las casillas Actualizar al abrir el archivo y Actualizar cada (por ejemplo, 60 minutos si monitoreas variaciones intradía, aunque el dólar observado cambia solo una vez al día hábil).",
        "El paso final es el que resuelve el problema real de oficina: tienes una tabla tblFacturas con la fecha de emisión en B2 y el monto en dólares en C2, y necesitas convertirlo a pesos chilenos automáticamente. Como los sábados, domingos y feriados no tienen fila en tblDolarObservado, una búsqueda exacta devolvería #N/D. Al pasar -1 como quinto argumento (modo de coincidencia) en BUSCARX, Excel busca la fecha exacta y, si no existe, retrocede al valor inmediatamente menor, es decir, al último día hábil publicado.",
      ],
      codigos: [
        {
          titulo: "Convertir USD a CLP por fecha cubriendo fines de semana y feriados",
          lenguaje: "excel",
          codigo: `=C2*BUSCARX(B2;tblDolarObservado[Fecha];tblDolarObservado[DolarObservado];;-1)`,
          codigoEn: `=C2*XLOOKUP(B2,tblDolarObservado[Fecha],tblDolarObservado[DolarObservado],,-1)`,
          nota: "El cuarto argumento queda vacío (;; en español, ,, en inglés) y el quinto argumento -1 indica coincidencia exacta o el elemento menor más cercano.",
        },
      ],
      captura: {
        id: "dolar-observado-en-excel-automatico-paso-4",
        alt: "Ventana de Propiedades de conexión en Excel con la opción Actualizar al abrir el archivo marcada, y hoja de cálculo aplicando BUSCARX con -1 sobre una factura en fin de semana",
        caption: "Propiedades de actualización automática y fórmula BUSCARX resolviendo una fecha de fin de semana sin error.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Si usas una versión anterior a Excel 2021 sin BUSCARX",
        texto:
          "En Excel 2016 o 2019 puedes ordenar tblDolarObservado[Fecha] de forma ascendente (de la fecha más antigua a la más reciente) y usar =C2*BUSCARV(B2;tblDolarObservado[[Fecha]:[DolarObservado]];2;VERDADERO).",
      },
    },
  ],
  erroresComunes: [
    {
      error: "El dólar aparece multiplicado por 100 (por ejemplo 100879 en vez de 1008,79)",
      causa:
        "La API devuelve los decimales con punto (formato en-US) y Power Query los interpretó con la configuración regional de Chile, donde el punto es separador de miles.",
      solucion:
        "Convierte la columna de texto a número indicando explícitamente la cultura estadounidense: Number.FromText(_, \"en-US\"), o usa Cambiar tipo > Usando configuración regional > Inglés (Estados Unidos).",
    },
    {
      error: "La fecha de mindicador.cl aparece corrida un día hacia atrás",
      causa:
        "El campo fecha viene en formato ISO UTC y al convertirlo directo con Date.From se interpreta en otra zona horaria antes de la medianoche local.",
      solucion:
        "Aplica Date.From(DateTimeZone.SwitchZone(DateTimeZone.From(_), -3)) tal como aparece en el código M del Método 1.",
    },
    {
      error: "Error Expression.Error al expandir la serie de la API del Banco Central en días feriados",
      causa:
        "Los fines de semana y feriados bancarios la respuesta JSON trae el texto \"NaN\" en el campo value, lo que rompe la conversión numérica.",
      solucion:
        "Agrega el paso de filtrado previo Table.SelectRows(..., each [ValorTxt] <> null and [ValorTxt] <> \"NaN\") antes de transformar el tipo a número.",
    },
    {
      error: "BUSCARX devuelve #N/D en facturas emitidas a comienzos de enero o antes del rango descargado",
      causa:
        "La fecha buscada es anterior al registro más antiguo de tu tabla (por ejemplo, mindicador.cl sin parámetro de año solo trae el último mes).",
      solucion:
        "Si necesitas fechas de meses o años anteriores, usa el Método 2 (API BCCh) ajustando firstdate=\"2024-01-01\", o consulta el endpoint anual de mindicador.cl agregando el año a la URL.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de conversión USD a CLP con dólar observado automático",
    descripcion:
      "Libro .xlsx preconfigurado con las consultas Power Query (mindicador y API BDE con parámetros vacíos), tabla calendario de tipo de cambio y hoja de facturas con BUSCARX. Próximamente disponible para descarga.",
  },
  faqs: [
    {
      q: "¿Necesito pagar por usar la API del Banco Central de Chile?",
      a: "No. El servicio de Web Services estadísticos (BDE / SIETE) del Banco Central de Chile es completamente gratuito. Solo debes registrar tu correo en su portal para recibir un usuario y contraseña propios.",
    },
    {
      q: "¿Qué diferencia hay entre dólar observado y dólar acuerdo o aduanero?",
      a: "El dólar observado refleja el promedio ponderado de las operaciones bancarias del día hábil anterior y se publica diariamente; es el estándar para contabilidad general y conversiones diarias. El dólar aduanero se fija mensualmente para cálculos de importación en Aduanas.",
    },
    {
      q: "¿Puedo actualizar la consulta si comparto el archivo con alguien en Excel para la Web?",
      a: "Excel para la Web admite la actualización de ciertas consultas Power Query con acceso anónimo en Microsoft 365 empresarial, pero las consultas con parámetros personalizados o endpoints externos suelen requerir abrir el libro en la aplicación de escritorio (Windows o Mac) para refrescar.",
    },
    {
      q: "¿Por qué conviene usar una hoja separada para la tabla del tipo de cambio?",
      a: "Aislar la tabla descargada en su propia hoja (por ejemplo TC_Dolar) evita que Power Query sobrescriba fórmulas o formatos de tus hojas de cálculo comerciales cada vez que el número de filas crece.",
    },
    {
      q: "¿Qué pasa si el Banco Central cambia el formato o cae temporalmente su servidor?",
      a: "Mientras no presiones Actualizar todo con error, Excel conserva en la hoja los últimos datos descargados exitosamente. Nunca perderás el historial ya cargado por una caída momentánea de red.",
    },
  ],
  relacionadas: [
    "uf-utm-ipc-en-excel-automatico",
    "conectar-power-bi-api-banco-central",
    "automatizar-excel-con-power-query",
  ],
  enlacesExternos: [
    {
      label: "API pública de indicadores económicos en Chile",
      url: "https://mindicador.cl",
      fuente: "mindicador.cl",
    },
    {
      label: "Serie histórica oficial del Dólar Observado (SIETE)",
      url: "https://si3.bcentral.cl/siete/ES/Siete/Cuadro/CAP_TIPO_CAMBIO/MN_TIPO_CAMBIO4/DOLAR_OBS_ADO",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Portal oficial Base de Datos Estadísticos (BDE / SIETE)",
      url: "https://si3.bcentral.cl/siete",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Información oficial de la Base de Datos Estadísticos (BDE)",
      url: "https://www.bcentral.cl/areas/estadisticas/base-de-datos-estadisticos-bde",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Documentación oficial de Power Query",
      url: "https://learn.microsoft.com/es-es/power-query/",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Indicadores económicos y datos en ProgramBI",
      href: "/datos",
      descripcion: "Consulta valores de referencia de dólar, UF, UTM e inflación en Chile.",
    },
    {
      label: "Curso práctico de Excel",
      href: "/cursos/excel",
      descripcion: "Domina Power Query, BUSCARX y automatización de reportes en oficina.",
    },
  ],
};

export default guia;
