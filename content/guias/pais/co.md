---
title: Cómo aprender Power BI en Colombia: guía 2026 | ProgramBI
description: Salarios de analista de datos en Colombia, dónde buscar empleo, ruta de 8 semanas y DAX en COP para Bogotá, Medellín y Cali.
h1: Cómo aprender Power BI en Colombia y conseguir trabajo como analista
country: co
lang: es-CO
slug: como-aprender-power-bi-en-colombia
path: /co/guias/como-aprender-power-bi-en-colombia
updated: 2026-11-14
course: power-bi
url_curso: https://www.programbi.com/co/cursos/power-bi
sources:
  - https://co.computrabajo.com/salarios/analista-de-datos
  - https://co.computrabajo.com/trabajo-de-analista-de-datos
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/co/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI para el mercado colombiano.
---
En Colombia hay un dato que dice mucho: si buscas hoy «analista de datos» en Computrabajo aparecen más de mil ofertas abiertas, y una buena parte menciona Power BI en los requisitos. Bancos en Bogotá, empresas de servicios en Medellín, operadores logísticos en Barranquilla y BPO en Cali necesitan gente que convierta datos en decisiones. Esta guía te explica cómo aprender Power BI con un orden lógico, cuánto se paga como referencia y qué te hace destacar frente a otros candidatos.

<!-- CTA-TOP -->

##### Por qué aprender Power BI en Colombia

El mercado colombiano combina sectores muy intensivos en datos: banca y seguros, salud (EPS e IPS), telecomunicaciones, retail, logística y una industria grande de servicios para el exterior (BPO y centros de servicios compartidos). En todos se repite el mismo problema: el reporte depende de alguien que pega datos en Excel. Las vacantes que piden Power BI suelen pedir también Excel avanzado y SQL, y valoran la capacidad de explicar el resultado al negocio. Quien domina modelo de datos y DAX tiene una ventaja clara.

##### Cuánto gana un analista de datos en Colombia (referencia)

- **Computrabajo Colombia**: sueldo medio de **$2.416.855 COP al mes** para «analista de datos», con 7.156 salarios de los últimos 12 meses (consultado el 4 nov 2026). [co.computrabajo.com/salarios/analista-de-datos](https://co.computrabajo.com/salarios/analista-de-datos)
- **Avisos vigentes**: en [co.computrabajo.com/trabajo-de-analista-de-datos](https://co.computrabajo.com/trabajo-de-analista-de-datos) puedes filtrar por ciudad y ver los que publican sueldo.

La media incluye cargos muy distintos (desde reportería operativa hasta análisis avanzado). Los avisos con Power BI + SQL tienden a la parte alta del rango.

##### Dónde buscar empleo con Power BI en Colombia

- **Computrabajo** y **elempleo.com**: los portales con más volumen local.
- **Magneto Empleos**: muy usado por empresas grandes y cajas de compensación.
- **LinkedIn Empleos**: corporativos y trabajos remotos para empresas extranjeras.
- **Servicio Público de Empleo** (serviciodeempleo.gov.co): vacantes registradas oficialmente.
- **Bolsa de ProgramBI** (`/co/empleos`).

Consejo: en el perfil escribe «Power BI (Power Query, modelado, DAX)» en lugar de solo «Power BI». Los reclutadores filtran por esas palabras.

##### Industrias donde más se usa

- **Banca y seguros**: colocación, cartera, mora y metas por oficina.
- **Salud**: autorizaciones, glosas, tiempos de atención.
- **BPO y servicios compartidos**: niveles de servicio (SLA), productividad por agente.
- **Logística y puertos**: tiempos de despacho, ocupación de bodegas.
- **Retail y consumo masivo**: rotación de inventario, ventas por canal.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Primeros tableros y Power Query.** Importa un Excel de ventas, une varios meses desde una carpeta y limpia datos.
2. **Semana 3 · Modelo estrella.** Ventas, clientes, productos, ciudades y calendario. Relaciones de uno a varios.
3. **Semanas 4–5 · DAX.** Medidas básicas, CALCULATE, FILTER, DIVIDE.
4. **Semana 6 · Tiempo.** Acumulado del año, comparación con el año anterior, promedio móvil.
5. **Semana 7 · Diseño para el negocio.** KPIs, alertas visuales, navegación con botones.
6. **Semana 8 · Proyecto.** Un tablero de un caso colombiano (por ejemplo, con datos abiertos de datos.gov.co) para tu portafolio.

<!-- CTA-MID --> — Descarga la plantilla de dashboard de ventas en pesos colombianos.

##### Funciones clave, con ejemplos colombianos

Una comercializadora con sedes en Bogotá, Medellín, Cali y Barranquilla, que vende en COP:

- `Ventas = SUM(Ventas[Valor_COP])`
- `Ventas Medellín = CALCULATE([Ventas], Sede[Ciudad] = "Medellín")`
- `Ticket promedio = DIVIDE([Ventas], DISTINCTCOUNT(Ventas[Factura]))`
- `Ventas año anterior = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- `Crecimiento % = DIVIDE([Ventas] - [Ventas año anterior], [Ventas año anterior])`
- Para un BPO: `% SLA cumplido = DIVIDE(CALCULATE(COUNTROWS(Llamadas), Llamadas[Segundos_espera] <= 20), COUNTROWS(Llamadas))`

Un detalle muy colombiano: las cifras en COP son grandes. Usa formato «$#,0» o muestra en millones («2,3 M») en las tarjetas para que el tablero se lea de un vistazo.

##### Errores comunes

- **Tildes y mayúsculas inconsistentes** («Bogota», «BOGOTÁ», «Bogotá D.C.»): normaliza en Power Query o las ciudades se duplican en los gráficos.
- **Usar columnas calculadas para totales** en lugar de medidas.
- **Ignorar la tabla calendario**, lo que rompe las comparaciones por mes.
- **Tableros con 20 gráficos.** Menos es más: una pregunta por página.
- **Compartir el archivo .pbix por correo** en lugar de publicarlo en el servicio con permisos.

##### Tres casos reales de uso en empresas colombianas

**1. BPO en Medellín o Cali: nivel de servicio por campaña.** El cliente extranjero paga según el SLA. El tablero cruza llamadas, tiempos de espera y abandono por hora, y alerta cuando una campaña baja del objetivo.

`Tasa de abandono = DIVIDE(CALCULATE(COUNTROWS(Llamadas), Llamadas[Abandonada] = TRUE()), COUNTROWS(Llamadas))`
`AHT (seg) = AVERAGEX(Llamadas, Llamadas[Seg_conversacion] + Llamadas[Seg_postllamada])`

Con un mapa de calor por hora y día, el coordinador ve en qué franja falta personal.

**2. IPS en Bogotá: glosas y facturación a EPS.** En salud, una parte del ingreso se pierde en glosas (objeciones de las EPS a la factura). Un tablero por EPS, tipo de glosa y servicio permite atacar las causas.
`% Glosado = DIVIDE(SUM(Facturas[Valor_glosado_COP]), SUM(Facturas[Valor_facturado_COP]))`
`Días promedio de radicación = AVERAGEX(Facturas, DATEDIFF(Facturas[Fecha_servicio], Facturas[Fecha_radicacion], DAY))`

**3. Comercializadora en Barranquilla: rotación de inventario.** Comercio exterior y bodega necesitan saber qué referencias se quedan quietas.
`Días de inventario = DIVIDE(SUM(Inventario[Valor_COP]), DIVIDE([Costo de ventas], 365))`
Ordenado de mayor a menor, muestra dónde está la plata inmovilizada.

##### Certificación PL-300 en Colombia

La certificación oficial es **Microsoft Certified: Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país, y el valor para Colombia se ve al registrarte en la [página oficial de la certificación](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Muchas vacantes la mencionan como deseable, rara vez como obligatoria: un proyecto bien presentado suele pesar igual o más.

##### Comunidad para seguir aprendiendo

En el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) hay grupos de usuarios por ciudad y sección en español. Busca en Meetup y LinkedIn «Power BI Bogotá» o «Power BI Medellín» y únete al que tenga eventos recientes. Ir a un par de encuentros te da contactos y te muestra qué problemas resuelven otros analistas.

##### Cómo armar un portafolio que convenza en Colombia

Elige un tema que el reclutador entienda en 10 segundos: por ejemplo, un tablero de **siniestralidad vial por departamento** o de **contratación pública** con datos de datos.gov.co. Publica capturas y una explicación breve en LinkedIn: qué pregunta respondes, qué fuentes usaste y qué medidas DAX creaste. Eso vale más que una lista de cursos.

Un último detalle para Colombia: si postulas a cargos en Bogotá con clientes internacionales, prepara tu tablero también en inglés; es un filtro frecuente.

##### ¿Aprender solo o en un curso en vivo?

Hay mucho material gratis, y si eres constante puedes avanzar solo. Pero la mayoría se estanca en DAX y en el modelo, justo lo que más piden las vacantes. Un curso en vivo te da un calendario, alguien que responde tus dudas en el momento y un proyecto terminado. Con el horario adecuado, se puede hacer después del trabajo.

##### El curso Power BI en vivo de ProgramBI (versión Colombia)

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30, hora de Colombia**.
- **20 horas, 8 módulos**, básico-intermedio. Abrimos grupos cada mes; consulta la próxima fecha en la ficha del programa.
- Valores en COP y medios de pago locales incluidos al abrir el temario del [curso de Power BI para Colombia](/co/cursos/power-bi).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), más de 5.000 profesionales formados.
- Si estás migrando desde hojas de cálculo, revisa [Power BI vs Excel](/guias/power-bi-vs-excel) y la ruta de [Análisis de datos en Colombia](/co/cursos/analisis-de-datos).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en Colombia?**
Lunes y miércoles de 17:30 a 19:30, hora de Colombia. Si un día no puedes, la clase queda grabada.

**¿Cómo pago desde Colombia?**
Con tarjeta internacional de crédito o débito. Ves el precio en pesos colombianos y el cargo final lo define tu banco.

**¿Necesito ser ingeniero para aprender Power BI?**
No. Muchas personas que lo usan vienen de administración, contaduría, economía o áreas comerciales. Lo importante es entender el negocio y practicar.

**¿Qué piden las ofertas de analista de datos en Colombia?**
Con frecuencia Excel avanzado, Power BI, SQL y, en algunos casos, Python. Las de mayor salario suelen pedir además experiencia en un sector (banca, salud o retail).

**¿Sirve el certificado de ProgramBI?**
Es un certificado digital que acredita las 20 horas y el temario. Úsalo junto con un proyecto en tu portafolio; eso es lo que más convence en una entrevista.

**¿Puedo aprender Power BI con un computador sencillo?**
Para practicar con datos medianos basta un equipo con Windows y 8 GB de RAM. Con 16 GB trabajas más cómodo con modelos grandes.
