import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "licencias-power-bi-precio-chile",
  title: "Licencias de Power BI: precios, ¿es gratis? y cuál elegir",
  meta: "¿Power BI es gratis? Diferencias entre Free, Pro, Premium por usuario y Fabric, qué permite cada licencia y cómo elegir. Precios oficiales con su fecha.",
  h1: "Licencias de Power BI: qué incluye cada una y cuál te conviene",
  subtitle:
    "Despeja todas las dudas sobre el licenciamiento de Power BI en Chile y Latinoamérica: qué puedes hacer gratis con Power BI Desktop, cuándo necesitas pagar Pro, qué aporta Premium por usuario (PPU), cómo entra Microsoft Fabric y qué licencia requiere quien solo consulta tableros.",
  keywordPrincipal: "licencia power bi precio chile",
  keywords: [
    "licencia power bi precio chile",
    "Power BI es gratis",
    "Power BI Pro precio",
    "Power BI Premium por usuario",
    "Microsoft Fabric licencia",
  ],
  curso: "power-bi",
  herramienta: "Power BI",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  omitirHowTo: true,
  en30Segundos: {
    queLogras:
      "Entender exactamente qué incluye cada tipo de licencia de Power BI según la documentación oficial de Microsoft, evitar pagos innecesarios en tu equipo y saber dónde verificar la tarifa vigente en Chile.",
    herramienta: "Microsoft Power BI · Microsoft Fabric",
    tiempo: "20 minutos de lectura",
    bullets: [
      "Power BI Desktop es gratuito para diseñar modelos y reportes localmente, pero compartir de forma privada en la nube exige licencias pagadas.",
      "Diferencias clave entre Free, Power BI Pro, Premium por usuario (PPU) y capacidades de Microsoft Fabric.",
      "Cómo consultar la tarifa oficial vigente por usuario o capacidad sin depender de cifras desactualizadas ni conversiones informales.",
      "Regla clara para lectores de informes y ejemplos reales para pymes y empresas medianas en Chile.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "¿Es gratis?",
      resumen: "Desktop local frente a publicación privada en Service.",
      anchorId: "power-bi-es-gratis",
      icono: "check",
    },
    {
      numero: 2,
      titulo: "Comparativa oficial",
      resumen: "Free, Pro, PPU y capacidades Microsoft Fabric.",
      anchorId: "comparativa-free-pro-ppu-fabric",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Precios vigentes",
      resumen: "Dónde consultar tarifas oficiales por país.",
      anchorId: "consultar-precios-oficiales",
      icono: "settings",
    },
    {
      numero: 4,
      titulo: "Solo lectores",
      resumen: "Qué licencia necesita quien únicamente ve reportes.",
      anchorId: "licencia-quien-solo-ve-informes",
      icono: "shield",
    },
    {
      numero: 5,
      titulo: "Casos en Chile",
      resumen: "Escenarios típicos para pymes y áreas de datos.",
      anchorId: "escenarios-pymes-chile",
      icono: "layers",
    },
  ],
  requisitos: {
    version: "Modelo de licenciamiento Microsoft Power BI y Microsoft Fabric (consultado el 21 de noviembre de 2026)",
    lista: [
      "Cuenta laboral o educativa (Microsoft Entra ID / Microsoft 365) si deseas acceder a Power BI Service en la nube.",
      "No se requiere licencia pagada para descargar Power BI Desktop en Windows y practicar localmente.",
    ],
    compatibilidadMacWeb:
      "Power BI Service (visualización web, administración de áreas de trabajo y licencias) funciona en cualquier navegador en Windows, Mac o Linux. Power BI Desktop se instala de forma nativa solo en Windows.",
  },
  secciones: [
    {
      id: "power-bi-es-gratis",
      titulo: "¿Power BI es gratis? Desktop local vs publicación privada en Service",
      parrafos: [
        "La respuesta corta es sí y no, dependiendo de si trabajas solo en tu computador o si necesitas compartir informes de forma privada con otras personas de tu empresa. Esta distinción es la fuente número uno de confusión en equipos que recién adoptan la herramienta.",
        "Power BI Desktop —la aplicación de escritorio para Windows donde te conectas a Excel, SQL Server o APIs, transformas datos en Power Query, creas relaciones y escribes medidas DAX— es completamente gratuita para descargar y usar sin límite de tiempo ni de cantidad de archivos .pbix.",
        "Sin embargo, en cuanto quieres publicar ese informe en la nube (Power BI Service, en app.powerbi.com) para que gerencia, finanzas o ventas lo revisen con seguridad de acceso y actualización automática programada, entra en juego el licenciamiento por usuario o por capacidad. Con una cuenta gratuita (Free) puedes publicar en tu propia sección 'Mi área de trabajo' para uso estrictamente personal, pero no puedes compartir de manera privada con colegas ni consumir contenido alojado en áreas de trabajo estándar sin capacidad dedicada.",
      ],
      lista: [
        "Gratis sin cuenta corporativa: usar Power BI Desktop en tu PC y enviar el archivo .pbix por correo (poco seguro y sin control de versiones).",
        "Gratis con cuenta Microsoft laboral/educativa (licencia Free): subir reportes a 'Mi área de trabajo' para verlos tú mismo en la web o móvil.",
        "Pagado (Pro, PPU o capacidad Fabric): colaborar en áreas de trabajo compartidas, restringir datos por usuario (RLS) y distribuir reportes privados en la organización.",
      ],
      captura: {
        id: "licencias-power-bi-precio-chile-paso-1",
        alt: "Esquema diferenciando el uso gratuito de Power BI Desktop en local frente al uso colaborativo y seguro en Power BI Service.",
        caption: "Límite práctico entre la capa gratuita (Desktop + Mi área de trabajo) y la colaboración empresarial.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Cuidado con 'Publicar en la Web' para evitar pagar licencias",
        texto:
          "Power BI Service ofrece la opción 'Publicar en la Web (público)', que genera un enlace abierto sin pedir licencia al lector. Nunca uses esa opción con datos de clientes, ventas o finanzas de tu empresa: cualquier persona en internet o buscadores podría acceder a esa información.",
      },
    },
    {
      id: "comparativa-free-pro-ppu-fabric",
      titulo: "Free, Pro, Premium por usuario (PPU) y Microsoft Fabric",
      parrafos: [
        "Según la documentación oficial de Microsoft Learn y la página oficial de precios de Microsoft Power BI (consultado el 21 de noviembre de 2026), el ecosistema de licencias se organiza en dos grandes lógicas: licencias por usuario nombrado (Free, Pro, PPU) y licencias por capacidad organizacional (Microsoft Fabric F-SKU, que unificó el modelo clásico de Power BI Premium por capacidad).",
        "Power BI Pro es el estándar para crear, publicar y compartir tableros en organizaciones pequeñas y medianas. Incluye las capacidades esenciales de colaboración, conexión a orígenes locales mediante puerta de enlace (Gateway) y programación de hasta 8 actualizaciones automáticas al día por modelo semántico.",
        "Premium por usuario (PPU) desbloquea características avanzadas pensadas para modelos más exigentes —mayor límite de tamaño de modelo, hasta 48 actualizaciones programadas al día, flujos de datos avanzados, canalizaciones de implementación (deployment pipelines) e informes paginados— manteniendo un cobro por usuario, con la restricción de que quien consume contenido en un área PPU también necesita licencia PPU.",
        "Por último, Microsoft Fabric reúne Power BI junto con ingeniería de datos, data warehouse, lagos de datos (OneLake) y ciencia de datos bajo una capacidad compartida (SKU F). En capacidades F64 o superiores, los usuarios que únicamente visualizan informes en áreas asignadas a esa capacidad pueden hacerlo con una licencia gratuita (Free), mientras quienes publican y administran siguen requiriendo licencia Pro o PPU.",
      ],
      tabla: {
        caption: "Comparativa de licencias Power BI y Microsoft Fabric (según Microsoft Learn, consultado el 21 de noviembre de 2026)",
        encabezados: [
          "Característica",
          "Power BI Free",
          "Power BI Pro",
          "Premium por usuario (PPU)",
          "Capacidad Microsoft Fabric",
        ],
        filas: [
          [
            "Uso en Power BI Desktop",
            "Sí (completo en local)",
            "Sí",
            "Sí",
            "Sí (quien publica usa Pro/PPU)",
          ],
          [
            "Publicar y compartir en áreas de trabajo",
            "Solo uso personal en 'Mi área de trabajo'",
            "Sí, con otros usuarios Pro o PPU",
            "Sí, pero solo otros usuarios PPU pueden ver",
            "Sí (creadores requieren Pro/PPU)",
          ],
          [
            "Actualizaciones programadas al día",
            "Limitado a uso personal (hasta 8/día)",
            "Hasta 8 al día por modelo",
            "Hasta 48 al día por modelo",
            "Hasta 48 al día por modelo",
          ],
          [
            "Límite típico de tamaño de modelo",
            "1 GB por modelo",
            "1 GB por modelo",
            "Hasta 100 GB (según capacidades PPU)",
            "Escalable según el SKU F contratado",
          ],
          [
            "Lectores sin licencia pagada",
            "No aplica para compartir privado",
            "No (todos deben tener Pro)",
            "No (todos deben tener PPU)",
            "Sí en capacidades F64 o superiores (lectores usan Free)",
          ],
          [
            "Inclusión en Microsoft 365 E5",
            "No",
            "Incluida en Microsoft 365 E5",
            "Requiere complemento adicional",
            "Capacidad independiente (Azure / Fabric)",
          ],
        ],
      },
      captura: {
        id: "licencias-power-bi-precio-chile-paso-2",
        alt: "Tabla comparativa visual de licencias Power BI Free, Pro, Premium por usuario y capacidades Microsoft Fabric.",
        caption: "Diferencias funcionales entre licenciamiento por usuario (Pro/PPU) y por capacidad (Fabric).",
        ratio: "16/9",
      },
    },
    {
      id: "consultar-precios-oficiales",
      titulo: "Cómo consultar los precios oficiales vigentes en Chile sin cifras desactualizadas",
      parrafos: [
        "En internet abundan artículos con precios desactualizados en dólares o conversiones aproximadas a pesos chilenos que omiten impuestos locales (IVA), ajustes anuales de Microsoft o diferencias entre contratación directa en web, facturación vía partner CSP en Chile o convenios corporativos Enterprise Agreement.",
        "Para evitar tomar decisiones presupuestarias con números vencidos o estimaciones informales, verifica siempre la tarifa vigente directamente en la página oficial de precios de Microsoft Power BI (powerbi.microsoft.com/es-es/pricing/) y en la sección de precios de Microsoft Fabric en Azure según la página oficial de Microsoft, consultada el 21 de noviembre de 2026.",
        "Al entrar en la página oficial podrás seleccionar tu país o moneda de facturación, comparar el valor mensual por usuario (con compromiso anual) entre Pro y Premium por usuario, y revisar si tu empresa ya cuenta con suscripciones de Microsoft 365 E5 que incluyan Power BI Pro sin costo extra por licencia individual.",
      ],
      listaOrdenada: [
        "Ingresa a la página oficial de precios de Microsoft Power BI y confirma el país/región en el selector inferior.",
        "Revisa primero en tu centro de administración de Microsoft 365 si algún ejecutivo ya tiene asignada una licencia E5 (que incluye Power BI Pro).",
        "Si compras en Chile a través de un distribuidor autorizado (CSP), solicita cotización formal en UF o CLP más IVA considerando el ciclo de facturación anual o mensual.",
      ],
      captura: {
        id: "licencias-power-bi-precio-chile-paso-3",
        alt: "Página oficial de precios de Microsoft Power BI mostrando los planes Pro, Premium por usuario y enlace a Microsoft Fabric.",
        caption: "Consulta directa de tarifas vigentes en el portal oficial de precios de Microsoft Power BI.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "info",
        titulo: "Ojo con los planes de prueba gratuita",
        texto:
          "Microsoft suele ofrecer una prueba gratuita temporal de Power BI Pro o Fabric dentro del propio portal app.powerbi.com para evaluar funcionalidades antes de asignar presupuesto. Úsala en un proyecto piloto controlado.",
      },
    },
    {
      id: "licencia-quien-solo-ve-informes",
      titulo: "Qué licencia necesita quien solo ve informes (sin crear ni editar)",
      parrafos: [
        "Esta es la pregunta más frecuente en gerencia y finanzas: 'Si somos 25 personas en la empresa, pero solo 2 arman los tableros y las otras 23 únicamente entran a mirar filtros y gráficos, ¿tenemos que pagar 25 licencias?'.",
        "Cuando trabajas en un entorno estándar sin capacidad dedicada (es decir, usando áreas de trabajo Pro), la respuesta es sí: tanto quien publica como quien visualiza un informe privado necesita al menos una licencia Power BI Pro. Lo mismo aplica en un área de trabajo Premium por usuario (PPU): cada lector debe tener licencia PPU.",
        "La única excepción oficial dentro del servicio en la nube ocurre cuando la organización contrata una capacidad Microsoft Fabric de nivel F64 o superior y aloja el área de trabajo dentro de esa capacidad. En ese escenario, los 2 creadores siguen necesitando licencia Pro (o PPU) para publicar, pero decenas o cientos de lectores internos pueden consumir los reportes usando una licencia gratuita (Free). Por eso, para equipos pequeños (de 5 a 40 usuarios), casi siempre resulta mucho más económico pagar licencias Pro individuales que contratar una capacidad F64.",
      ],
      captura: {
        id: "licencias-power-bi-precio-chile-paso-4",
        alt: "Flujo de decisión mostrando cuándo conviene pagar licencias Pro para cada lector y cuándo se justifica una capacidad Fabric F64+.",
        caption: "Regla de licenciamiento para lectores según si el área de trabajo es Pro, PPU o capacidad F64+.",
        ratio: "16/9",
      },
    },
    {
      id: "escenarios-pymes-chile",
      titulo: "Escenarios típicos para pymes y empresas medianas en Chile",
      parrafos: [
        "Para aterrizar la teoría a decisiones concretas, veamos cuatro configuraciones habituales en empresas chilenas y qué esquema de licencias suele funcionar mejor en cada caso.",
        "Caso 1 — Analista independiente o estudiante aprendiendo: No necesitas pagar nada. Descarga Power BI Desktop en Windows, conecta tus archivos locales o bases de prueba y usa tu cuenta gratuita si quieres probar cómo se ve en la web.",
        "Caso 2 — Pyme de 8 a 20 personas con un equipo gerencial que revisa ventas y flujo de caja: Asigna licencia Power BI Pro únicamente a quienes realmente crean y consumen los tableros privados (por ejemplo, 1 analista y 4 jefaturas = 5 licencias Pro). No compres licencias para toda la nómina si no ingresan al servicio.",
        "Caso 3 — Empresa mediana con modelos grandes (>1 GB) o necesidad de actualizar datos cada 30 minutos: Evalúa pasar al grupo de analistas y lectores frecuentes a Premium por usuario (PPU), manteniendo siempre en mente que todos los consumidores de esa área de trabajo deberán contar con PPU.",
        "Caso 4 — Corporativo con cientos de lectores y necesidad de bodega de datos unificada: Evalúa capacidades Microsoft Fabric (y verifica si ya poseen licencias Microsoft 365 E5 para los autores) comparando el costo total mensual frente al paquete de licencias Pro.",
      ],
      captura: {
        id: "licencias-power-bi-precio-chile-paso-5",
        alt: "Resumen visual de cuatro escenarios empresariales en Chile con la combinación recomendada de licencias Power BI.",
        caption: "Recomendación práctica según tamaño del equipo lector y frecuencia de actualización.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Comprar una sola licencia Power BI Pro esperando compartir reportes privados con 15 colegas gratuitos",
      causa:
        "Se asume que solo quien diseña o publica necesita licencia pagada y que los lectores entran gratis con cualquier cuenta.",
      solucion:
        "En áreas de trabajo Pro, todo usuario que abre un informe privado necesita su propia licencia Pro (salvo que uses una capacidad Fabric F64+).",
    },
    {
      error: "Mezclar un área de trabajo Premium por usuario (PPU) con lectores que solo tienen licencia Pro",
      causa:
        "El administrador activa características PPU en el área de trabajo sin advertir que eso bloquea el acceso a usuarios con licencia Pro estándar.",
      solucion:
        "Mantén en áreas Pro los tableros de consumo masivo y reserva las áreas PPU solo para audiencias donde todos tengan PPU.",
    },
    {
      error: "Usar 'Publicar en la Web' para ahorrar licencias en reportes internos de la empresa",
      causa:
        "Desconocimiento de que el enlace generado es público e indexable sin autenticación.",
      solucion:
        "Revoca de inmediato cualquier código de inserción público con datos sensibles desde el portal de administración y comparte mediante áreas de trabajo privadas con licencias asignadas.",
    },
  ],
  plantilla: {
    titulo: "Calculadora de licencias Power BI para tu equipo",
    descripcion:
      "Próximamente podrás descargar aquí una planilla en Excel para ingresar cantidad de creadores, cantidad de lectores y requisitos técnicos (tamaño y refrescos/día) y comparar escenarios.",
  },
  faqs: [
    {
      q: "¿Si tengo Microsoft 365 Empresa Estándar o Básico ya viene incluido Power BI Pro?",
      a: "No. Power BI Pro solo viene incluido por defecto en el plan corporativo Microsoft 365 E5 (y Office 365 E5). En los planes Microsoft 365 Empresa Básico, Estándar o Premium se contrata como licencia adicional aparte.",
    },
    {
      q: "¿Puedo abrir un archivo .pbix sin tener cuenta pagada?",
      a: "Sí. Cualquier persona con Windows puede descargar Power BI Desktop gratis, abrir archivos .pbix locales y actualizar los datos desde orígenes a los que tenga acceso.",
    },
    {
      q: "¿Qué pasa con mis informes si dejo de pagar Power BI Pro?",
      a: "No pierdes tus archivos locales (.pbix), pero en Power BI Service pierdes la capacidad de compartir en áreas de trabajo colaborativas y otros usuarios no podrán ver los reportes privados que publicaste hasta reasignar las licencias.",
    },
    {
      q: "¿Las licencias de Power BI se pueden pagar en pesos chilenos (CLP) o con factura local?",
      a: "Sí, contratando mediante tarjeta corporativa en el portal de Microsoft o a través de un partner Microsoft Cloud Solution Provider (CSP) en Chile que emite factura electrónica local en CLP o UF más IVA.",
    },
    {
      q: "¿Dónde reviso si Microsoft actualizó los precios de Power BI Pro o PPU?",
      a: "Siempre en la página oficial de precios de Microsoft Power BI (powerbi.microsoft.com/es-es/pricing/) y en la documentación oficial de licenciamiento de Microsoft Learn.",
    },
  ],
  relacionadas: [
    "power-bi-vs-excel",
    "copilot-en-power-bi",
    "automatizar-reportes-con-power-bi",
  ],
  enlacesExternos: [
    {
      label: "Página oficial de precios de Microsoft Power BI",
      url: "https://powerbi.microsoft.com/es-es/pricing/",
      fuente: "Microsoft Power BI",
    },
    {
      label: "Licencias del servicio Power BI para usuarios (documentación oficial)",
      url: "https://learn.microsoft.com/es-es/power-bi/fundamentals/service-features-license-type",
      fuente: "Microsoft Learn",
    },
    {
      label: "Licencias y capacidades en Microsoft Fabric",
      url: "https://learn.microsoft.com/es-es/fabric/enterprise/licenses",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
