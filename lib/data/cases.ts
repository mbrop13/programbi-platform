export interface CaseStudy {
  slug: string;
  category: string;
  title: string;
  description: string;
  linkText: string;
  brand: string;
  theme: "runway" | "supabase" | "linear" | "elevenlabs";
  techBadge: string;
  fullTitle: string;
  intro: string;
  problem: string;
  solution: string;
  results: string;
  quote: string;
  quoteAuthor: string;
  productsUsed: string[];
  metrics: { value: string; label: string }[];
  videoUrl?: string;
  posterUrl?: string;
}


export const casesOfUse: CaseStudy[] = [
  {
    slug: "automatizacion-conciliaciones",
    category: "Automatización de Reportes",
    title: "Ahorro de 15 horas semanales en conciliación de cobros",
    description: "Cómo un analista financiero automatizó la extracción y cruce de datos bancarios con facturas del SII mediante Python, reduciendo errores manuales a cero y evitando multas por desfase.",
    linkText: "Lee la historia de automatización",
    brand: "runway.flow",
    theme: "runway",
    techBadge: "Python + SQL Server",
    videoUrl: "https://mail.programbi.com/uploads/Video_VS_Code_Python_code_202606021556.mp4",
    fullTitle: "Optimización del flujo financiero: Cómo un Analista automatizó el control de cobros con Python y SQL Server",
    intro: "El equipo de finanzas lidiaba con miles de facturas y transferencias cruzadas semanalmente, un proceso manual propenso a errores humanos que tomaba días completos y generaba multas fiscales recurrentes. Mediante un script automatizado en Python conectado a su servidor de base de datos, consolidaron y cuadraron toda la información en minutos.",
    problem: "Semana a semana, los analistas debían descargar manualmente las cartolas de 4 bancos diferentes y cruzarlas celda por celda contra las facturas emitidas en la plataforma del SII en archivos Excel de más de 50.000 filas. El retraso promedio en identificar facturas impagas era de 12 días, lo que afectaba gravemente el flujo de caja e incrementaba la cartera vencida de la compañía.",
    solution: "Se desarrolló un script programado en Python (ejecutado automáticamente en un servidor local cada noche) que extrae mediante APIs las cartolas bancarias y las almacena en una base de datos relacional en SQL Server. Utilizando la librería Pandas de Python, el script ejecuta un algoritmo de cruce exacto y aproximado (DAX y lógica de coincidencia difusa) que concilia automáticamente el 95% de los cobros en segundos. El 5% restante se reporta en una tabla de excepciones para revisión manual del analista.",
    results: "La automatización liberó por completo al analista de la digitación manual y cruces visuales repetitivos, ahorrando más de 15 horas a la semana. La velocidad de cobranza aumentó, reduciendo la cartera vencida en un 34% en los primeros 60 días, y eliminando por completo los errores de duplicidad de registros.",
    quote: "La automatización liberó a nuestro equipo de tareas repetitivas de digitación, permitiéndonos enfocar el 100% de nuestro tiempo en el análisis financiero estratégico y de proyecciones.",
    quoteAuthor: "Carolina Méndez, Jefa de Finanzas & Control de Gestión",
    productsUsed: ["Python", "Pandas", "SQL Server", "Procesos ETL", "Modelado de Datos"],
    metrics: [
      { value: "15 horas", label: "liberadas semanalmente para análisis de datos" },
      { value: "95.0%", label: "de conciliaciones procesadas de forma 100% autónoma" },
      { value: "-34%", label: "de reducción en cartera vencida de cobros a clientes" },
      { value: "0 errores", label: "humanos o de duplicidad registrados en los reportes" }
    ]
  },
  {
    slug: "dashboards-ventas-bi",
    category: "Business Intelligence",
    title: "Monitoreo estratégico con dashboards de ventas en vivo",
    description: "Creación de reportes ejecutivos en Power BI conectados directamente al sistema de ventas, permitiendo al directorio ajustar stock y precios en minutos.",
    linkText: "Lee la historia de Power BI",
    brand: "elevenlabs.bi",
    theme: "elevenlabs",
    techBadge: "Power BI + DAX",
    videoUrl: "https://mail.programbi.com/uploads/Power_BI_dashboards_functioning_%E2%80%A6_202606021612.mp4",
    fullTitle: "Power BI en Acción: Automatización del Monitoreo Comercial de Sucursales",
    intro: "El directorio recibía reportes comerciales estáticos en archivos PDF desactualizados generados al final del mes. Desarrollamos un ecosistema de dashboards interactivos en Power BI conectados en vivo a su base de datos transaccional SQL Server.",
    problem: "La toma de decisiones comerciales era lenta y se basaba en intuiciones o datos históricos desactualizados por 30 días. Si un producto tenía bajas ventas en una zona geográfica, la gerencia se enteraba demasiado tarde para aplicar ofertas o redistribuir el inventario a tiendas con mayor demanda.",
    solution: "Se diseñó un modelo dimensional estrella directo en Power BI que se conecta mediante DirectQuery a la base de datos SQL Server central. Utilizando expresiones DAX complejas, se crearon indicadores clave en tiempo real, tales como margen de ganancia neto, ticket promedio por cliente, cumplimiento de metas anuales e inventario disponible.",
    results: "Se eliminó por completo el proceso de redactar informes comerciales estáticos en PDF. El equipo ejecutivo ahora cuenta con acceso a dashboards interactivos desde el móvil y ordenadores, reduciendo el tiempo de toma de decisiones estratégicas de semanas a solo minutos.",
    quote: "La visualización interactiva en Power BI transformó nuestras reuniones de directorio en discusiones ágiles orientadas a resultados basados en datos en vivo.",
    quoteAuthor: "Roberto González, CEO & Cofundador",
    productsUsed: ["Power BI", "DAX Avanzado", "Modelado de Datos", "DirectQuery SQL", "Dashboards"],
    metrics: [
      { value: "85%", label: "de tiempo ahorrado en la preparación de reportes mensuales" },
      { value: "50+ KPIs", label: "comerciales monitoreados en vivo en un solo panel gerencial" },
      { value: "3 clics", label: "máximos para explorar desde la vista nacional hasta la tienda" },
      { value: "100%", label: "adopción del monitoreo basado en datos por la plana gerencial" }
    ]
  },
  {
    slug: "consolidacion-multi-sucursal",
    category: "Data Warehousing",
    title: "Consolidación de datos multi-sucursal en tiempo real",
    description: "Integración de 12 bases de datos fragmentadas a un servidor SQL Server centralizado, logrando consultas en milisegundos y un punto de verdad único para la toma de decisiones comerciales.",
    linkText: "Lee la historia de base de datos",
    brand: "supabase.stack",
    theme: "supabase",
    techBadge: "SQL Server + ETL",
    videoUrl: "https://mail.programbi.com/uploads/SQL_Server_databases_functioning%E2%80%A6_202606021620.mp4",
    fullTitle: "De bases de datos fragmentadas a un Data Warehouse unificado y veloz en SQL Server",
    intro: "Con sucursales operando en sistemas aislados y servidores locales fragmentados, generar un reporte de ventas consolidadas tardaba hasta 5 días hábiles. Creamos una arquitectura ETL centralizada en SQL Server para unificar la verdad del negocio y agilizar el monitoreo comercial.",
    problem: "La empresa posee 12 sucursales de retail, cada una con un servidor local de bases de datos que no se comunicaba con la oficina central. Al final de cada mes, los jefes de local enviaban planillas Excel por correo. El analista de datos central debía unificar a mano los formatos heterogéneos, resolver IDs duplicados y lidiar con archivos corruptos, perdiendo valioso tiempo de análisis.",
    solution: "Implementamos un proceso de extracción, transformación y carga (ETL) utilizando scripts SQL y tareas programadas en SQL Server Agent. El flujo extrae automáticamente las transacciones del día de cada sucursal en horario nocturno, limpia y normaliza los nombres de productos, y los inserta en un esquema estrella (tabla de hechos de ventas y dimensiones de sucursales, clientes y productos) en un Data Warehouse centralizado.",
    results: "El tiempo para generar reportes consolidados pasó de 5 días a solo 15 minutos (latencia de sincronización). Las consultas de análisis complejos que antes congelaban los servidores locales ahora se ejecutan en menos de un segundo en el servidor centralizado, permitiendo monitorear el inventario y stock de forma integrada.",
    quote: "Antes operábamos a ciegas hasta fin de mes. Hoy tomamos decisiones comerciales basándonos en datos consolidados que se actualizan automáticamente cada 15 minutos en nuestro panel central.",
    quoteAuthor: "Andrés Silva, Director de Operaciones Retail",
    productsUsed: ["SQL Server", "Procedimientos Almacenados", "Procesos ETL", "Modelado Dimensional", "SQL Server Agent"],
    metrics: [
      { value: "99.8%", label: "de reducción en el tiempo de preparación de informes SQL" },
      { value: "12 locales", label: "unificados bajo un mismo catálogo maestro de productos" },
      { value: "15 min", label: "de latencia máxima en la actualización del stock nacional" },
      { value: "100%", label: "de consistencia en informes de auditoría interna de fin de año" }
    ]
  },
  {
    slug: "reduccion-fuga-ml",
    category: "Analítica Predictiva",
    title: "Reducción de fuga de clientes mediante modelos en Python",
    description: "Modelos predictivos en Python para anticipar comportamientos de compra y lanzar ofertas de retención automatizadas a clientes con riesgo de abandono.",
    linkText: "Lee la historia de predicción",
    brand: "linear.predict",
    theme: "linear",
    techBadge: "Python + Scikit-Learn",
    videoUrl: "https://mail.programbi.com/uploads/VS_Code_Python_code_202606021616.mp4",
    fullTitle: "Predicción de Churn: Cómo un Analista de Clientes programó modelos predictivos en Python",
    intro: "Identificar qué clientes iban a dar de baja el servicio requería análisis descriptivos tardíos y manuales sobre clientes que ya se habían ido. Entrenamos un modelo predictivo en Python que detecta patrones de inactividad antes de que ocurra la fuga.",
    problem: "La empresa experimentaba una tasa de fuga (churn) mensual del 4.2%, impactando directamente los ingresos recurrentes (ARR). El equipo de retención de clientes actuaba de manera reactiva: llamaban a ofrecer descuentos una vez que el cliente ya había solicitado la baja, logrando rescatar a menos del 5% de ellos.",
    solution: "Un analista de retención aplicó modelos de clasificación binaria utilizando Scikit-Learn y Python. Se estructuró un conjunto de datos en SQL Server que unificaba variables de uso del servicio, número de reclamos y días desde la última compra. El analista entrenó un modelo de Bosques Aleatorios (Random Forest) que calcula la probabilidad de fuga diaria de cada cliente y exporta automáticamente la lista de alta probabilidad al equipo de ventas.",
    results: "El modelo predice con un 94.2% de precisión qué clientes abandonarán el servicio en los próximos 30 días. Esto permitió lanzar campañas preventivas automáticas por correo y WhatsApp, logrando retener al 22% de los clientes en riesgo y recuperando capital ARR muy significativo.",
    quote: "Python nos permitió pasar de un enfoque netamente descriptivo y reactivo a anticipar la fuga de clientes de forma inteligente con un modelo altamente predictivo.",
    quoteAuthor: "Mariana Rojas, Subgerente de Fidelización & Clientes",
    productsUsed: ["Python", "Pandas", "Scikit-Learn", "Machine Learning", "Modelado Predictivo"],
    metrics: [
      { value: "22% menos", label: "fuga (churn) voluntaria de clientes en el primer trimestre" },
      { value: "94.2%", label: "de precisión (F1-score) en el modelo predictivo de Python" },
      { value: "180k+", label: "usuarios analizados de manera automática cada fin de semana" },
      { value: "+14% ARR", label: "recuperado gracias a la intervención temprana de retención" }
    ]
  },
  {
    slug: "pronostico-demanda-stock",
    category: "Optimización de Inventario",
    title: "Predicción de demanda y quiebre de stock en tiendas retail",
    description: "Algoritmos en Python conectados a bases SQL de inventario para pronosticar ventas semanales, automatizando el reabastecimiento en más de 50 sucursales.",
    linkText: "Lee la historia de retail",
    brand: "runway.retail",
    theme: "runway",
    techBadge: "Python + SQL + Forecasting",
    videoUrl: "https://mail.programbi.com/uploads/Python_SQL_Server_stock_demand_202606021626.mp4",
    fullTitle: "Cadena de Suministro Inteligente: Predicción de Demanda Automatizada con Python y SQL",
    intro: "Calcular el stock óptimo para evitar bodegas saturadas o vitrinas vacías dependía enteramente de la intuición del supervisor de local. Desarrollamos modelos de series temporales en Python que analizan tendencias históricas y automatizan la orden de compra.",
    problem: "El sobrestock en las tiendas de retail inmovilizaba un capital de trabajo equivalente a millones de dólares anuales, mientras que el quiebre de stock de productos de alta demanda generaba pérdidas de ventas estimadas en un 12% mensual.",
    solution: "Un analista de supply chain unificó el historial de ventas diarias de 4 años desde SQL Server y entrené modelos autorregresivos de predicción (Forecasting) en Python. El algoritmo calcula de manera semanal la demanda esperada de cada producto por sucursal, considerando estacionalidades y promociones, y genera un listado de reabastecimiento automático sugerido para el centro de distribución.",
    results: "Se redujo el exceso de inventario inmovilizado en bodegas en un 34%, optimizando el capital de trabajo de la firma. Los quiebres de stock en tiendas disminuyeron a menos del 1.5%, asegurando que los productos siempre estén disponibles para el cliente final.",
    quote: "Logramos reducir el inventario inmovilizado en bodegas principales a la mitad, liberando capital de trabajo crítico para la apertura de nuevas tiendas.",
    quoteAuthor: "Javier Espinoza, Gerente de Logística & Supply Chain",
    productsUsed: ["Python", "Modelos de Forecasting", "SQL Server", "Pandas", "Análisis Estadístico"],
    metrics: [
      { value: "34% menos", label: "capital inmovilizado en bodegas por exceso de stock" },
      { value: "98.5%", label: "de disponibilidad de productos en góndolas y vitrinas" },
      { value: "50 locales", label: "reabastecidos de manera automatizada semanalmente" },
      { value: "1.5% error", label: "de desviación media absoluta en predicciones de alta estacionalidad" }
    ]
  },
  {
    slug: "atribucion-marketing-ads",
    category: "Marketing Analytics",
    title: "Atribución de canales y optimización de presupuesto publicitario",
    description: "Cruce de datos de Google Ads, Meta Ads y CRM en SQL Server para atribuir correctamente el origen de leads, reduciendo el costo de adquisición de clientes.",
    linkText: "Lee la historia de marketing",
    brand: "supabase.marketing",
    theme: "supabase",
    techBadge: "SQL Server + Power BI",
    videoUrl: "https://mail.programbi.com/uploads/Power_BI_dashboards_functioning_%E2%80%A6_202606021614.mp4",
    fullTitle: "Optimización del Retorno de Inversión: Atribución de Canales de Adquisición en SQL",
    intro: "Saber qué campaña publicitaria (Google, Meta o email) generó realmente la venta final en el CRM era imposible debido a datos aislados. Unificamos las APIs publicitarias y el CRM de la empresa en una base SQL Server única para auditar el ROI exacto.",
    problem: "La empresa invertía miles de dólares mensuales en pauta digital sin saber qué anuncios generaban conversiones reales. Las plataformas (Google Ads y Facebook Ads) se duplicaban la atribución de una misma venta, reportando ingresos inflados y erróneos a los analistas de marketing.",
    solution: "Diseñamos un pipeline de carga diaria (ETL) que descarga mediante Python los logs de clics de las APIs de Google y Meta y los consolida en SQL Server junto al registro histórico de compras del CRM corporativo. A través de consultas SQL avanzadas, unificamos el ID de usuario mediante cookies de navegación, aplicando un modelo de atribución 'First-Touch' y 'Linear' para repartir el valor de conversión.",
    results: "El equipo de crecimiento obtuvo visibilidad absoluta de los canales eficientes, lo que permitió reducir la inversión en anuncios inútiles en un 30% y reasignar dicho capital a pautas publicitarias con conversiones reales de alto ticket.",
    quote: "Redujimos la inversión en publicidad ineficiente en un 30% redireccionando el presupuesto a las campañas de conversión real auditadas directamente en nuestra base SQL.",
    quoteAuthor: "Daniela Castro, Growth Marketing Lead",
    productsUsed: ["SQL Server", "Procesos ETL", "Modelado de Atribución", "Power BI", "APIs de Anuncios"],
    metrics: [
      { value: "-28% CAC", label: "reducción en el Costo de Adquisición de Clientes en un trimestre" },
      { value: "+45% ROI", label: "incremento en el retorno real de la inversión publicitaria" },
      { value: "3 orígenes", label: "de datos unificados (Google, Meta y CRM) en una misma consulta" },
      { value: "100%", label: "de transparencia en la medición del embudo de ventas" }
    ]
  },
  {
    slug: "optimizacion-rutas-despacho",
    category: "Automatización de Procesos",
    title: "Ruteo logístico óptimo para despacho de última milla",
    description: "Script de optimización en Python para diseñar rutas de entrega diarias de camiones de despacho, reduciendo el consumo de combustible en un 18%.",
    linkText: "Lee la historia de logística",
    brand: "linear.ops",
    theme: "linear",
    techBadge: "Python + Geopandas",
    videoUrl: "https://mail.programbi.com/uploads/Python_Geopandas_route_optimization_202606021628.mp4",
    fullTitle: "Última Milla Eficiente: Optimización de Rutas con Algoritmos y Geopandas",
    intro: "Los despachadores logísticos planificaban las rutas de despacho diarias basándose en mapas estáticos de la ciudad y criterio personal, resultando en traslapes, camiones subutilizados y constantes retrasos en entregas.",
    problem: "Planificar los despachos diarios de más de 800 pedidos comerciales tomaba 3 horas a los supervisores cada mañana, retrasando la salida de los camiones. El consumo de combustible se elevaba un 20% sobre lo óptimo y un 15% de los despachos terminaban fuera del horario prometido al cliente.",
    solution: "Estructuramos un script de optimización de rutas (ruteo de vehículos VRP) en Python utilizando coordenadas de geolocalización extraídas de la base de datos de ventas en SQL Server. Mediante librerías de análisis geográfico como Geopandas y algoritmos heurísticos, el script calcula paradas secuenciales óptimas para cada vehículo considerando capacidad y horario de entrega.",
    results: "El script en Python realiza la asignación y diseño de rutas para 45 camiones en solo 3 minutos de forma automática. El kilometraje recorrido se redujo sustancialmente, logrando un ahorro inmediato del 18% en consumo de combustible y asegurando que las entregas ocurran en el tiempo pactado.",
    quote: "La automatización con Python calcula el despacho diario óptimo en 3 minutos, liberando a los supervisores de horas de planificación manual e intuitiva.",
    quoteAuthor: "Mauricio Valenzuela, Jefe de Operaciones & Logística",
    productsUsed: ["Python", "Geopandas", "Optimización de Algoritmos", "SQL Server", "Geolocalización"],
    metrics: [
      { value: "18% menos", label: "gastos de combustible mensuales en la flota de camiones" },
      { value: "95.8%", label: "de entregas exitosas a tiempo en el bloque horario acordado" },
      { value: "3 minutos", label: "de ejecución del algoritmo frente a 3 horas de planificación manual" },
      { value: "-25% CO2", label: "de reducción estimada en huella de carbono de la operación" }
    ]
  },
  {
    slug: "people-analytics-rrhh",
    category: "People Analytics",
    title: "People Analytics: Predicción de rotación y clima laboral",
    description: "Dashboard dinámico en Power BI que analiza encuestas de clima laboral y patrones de salida históricos en SQL Server, identificando áreas con alto riesgo de fuga.",
    linkText: "Lee la historia de personas",
    brand: "elevenlabs.people",
    theme: "elevenlabs",
    techBadge: "SQL Server + Power BI",
    videoUrl: "https://mail.programbi.com/uploads/Power_BI_SQL_Server_dashboards_202606021632.mp4",
    fullTitle: "Fidelización del Talento: People Analytics con Power BI y SQL Server",
    intro: "La rotación voluntaria imprevista de perfiles clave generaba costos de reclutamiento elevados y baja productividad. El equipo de Recursos Humanos unificó datos de desempeño, ausentismo y encuestas de clima para crear un modelo predictivo descriptivo.",
    problem: "Con más de 3.000 empleados, RRHH no tenía visibilidad consolidada del bienestar y compromiso del personal. La información residía en planillas Excel dispersas y encuestas anuales guardadas en carpetas, impidiendo detectar la fuga de perfiles estratégicos.",
    solution: "Un analista de RRHH normalizó las bases de datos de personal y las conectó a SQL Server. Diseñó un dashboard integral en Power BI que cruza indicadores de días de ausentismo, nivel de satisfacción de clima, años en el cargo y variaciones salariales, alertando automáticamente de áreas u oficinas con tendencias anómalas de abandono.",
    results: "RRHH ahora cuenta con alertas tempranas en su panel de Power BI, logrando implementar planes de retención y aumentos a tiempo. La rotación voluntaria disminuyó en un 15% en el primer año y el costo de reclutamiento se redujo considerablemente.",
    quote: "Logramos retener a más del 80% del personal clave identificado con riesgo alto de rotación voluntaria antes de recibir su carta de renuncia.",
    quoteAuthor: "Sofía Vergara, Gerente de Gestión de Personas",
    productsUsed: ["Power BI", "SQL Server", "Análisis Descriptivo", "DAX", "People Analytics"],
    metrics: [
      { value: "-15% Rotación", label: "disminución de la salida voluntaria de empleados clave" },
      { value: "80% Éxito", label: "en la retención preventiva de talentos con alto riesgo de salida" },
      { value: "5 variables", label: "clave (ausentismo, clima, salario) integradas en el panel" },
      { value: "100%", label: "migración total de datos de personas a una base de datos segura" }
    ]
  }
];
