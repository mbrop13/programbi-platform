---
title: Cómo aprender Power BI en México: guía 2026 | ProgramBI
description: Qué pide el mercado mexicano, sueldos de analista BI en CDMX con fuente, ruta de 8 semanas y DAX con ejemplos en pesos de Monterrey, Guadalajara y CDMX.
h1: Cómo aprender Power BI en México: de reportes en Excel a analista BI
country: mx
lang: es-MX
slug: como-aprender-power-bi-en-mexico
path: /mx/guias/como-aprender-power-bi-en-mexico
updated: 2026-11-04
course: power-bi
url_curso: https://www.programbi.com/mx/cursos/power-bi
sources:
  - https://www.occ.com.mx/empleos/de-data-analyst/
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/mx/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI para equipos en México.
---
Si trabajas en una planta en Querétaro, en un corporativo en Santa Fe o en una distribuidora en Guadalajara, seguramente conoces la escena: cada cierre de mes alguien junta cinco archivos, los cruza con BUSCARV y entrega un reporte que ya está viejo cuando llega. En México, Power BI se volvió la herramienta con la que las áreas de finanzas, operaciones y comercial dejan de «armar reportes» y empiezan a analizar. Aquí tienes una ruta concreta para aprenderlo, lo que pagan hoy los avisos y cómo diferenciarte.

<!-- CTA-TOP -->

##### Por qué Power BI está tan presente en México

México tiene una base industrial enorme —automotriz, manufactura de exportación, logística, consumo masivo— y un sector financiero y de servicios que concentra corporativos en CDMX y Monterrey. Ese tipo de empresa mide todo: producción por turno, scrap, OTIF, cartera vencida, venta por canal. Además, muchas operan con ecosistema Microsoft, así que Power BI es la opción natural para conectar Excel, SQL Server y el ERP. Con el crecimiento de operaciones que atienden a Estados Unidos, también aparecen equipos que reportan a casas matrices y necesitan tableros estándar, en tiempo casi real.

##### Cuánto gana un analista de datos o BI en México (referencia)

- **OCC Mundial**: los avisos vigentes de «data analyst» con sueldo visible mostraban, el 4 de noviembre de 2026, rangos mensuales como **$13,000–$15,000**, **$18,000–$22,000**, **$22,000–$25,000** y **$25,000–$30,000 MXN**. [occ.com.mx/empleos/de-data-analyst](https://www.occ.com.mx/empleos/de-data-analyst/)

Lectura práctica: el rango es amplio porque el título «data analyst» cubre desde reportería operativa hasta análisis comercial avanzado. Los avisos de la parte alta piden modelado, SQL y DAX, no solo gráficos. Es una foto de un día: revisa el portal antes de negociar.

##### Dónde buscar empleo con Power BI en México

- **OCC Mundial**: el portal con más volumen local; filtra por «Power BI» y por estado.
- **Computrabajo México** e **Indeed México**: muchos avisos de manufactura, logística y retail.
- **LinkedIn Empleos**: corporativos y empresas que contratan remoto para EE. UU.
- **Bolsa de ProgramBI** (`/mx/empleos`).

Tip: en manufactura busca también «analista de mejora continua» y «analista de planeación»; muchas vacantes piden Power BI sin ponerlo en el título.

##### Industrias que más lo usan

- **Automotriz y manufactura** (Bajío, Nuevo León, Coahuila): OEE, scrap, producción por línea.
- **Logística y comercio exterior**: tiempos de cruce, OTIF, costos de flete.
- **Retail y consumo masivo**: sell-out, inventario por CEDIS, promociones.
- **Banca y fintech** (CDMX, Monterrey): cartera, originación y cobranza.
- **Gobierno**: transparencia y tableros de indicadores públicos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Conecta los reportes del ERP (CSV o Excel), une archivos de una carpeta y limpia fechas en formato día/mes/año.
2. **Semana 3 · Modelo estrella.** Hechos de ventas o producción; dimensiones de planta, producto, cliente y calendario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, ALL. Medidas de margen, cumplimiento de meta y participación.
4. **Semana 6 · Inteligencia de tiempo.** Mes contra mes, año contra año, acumulado anual.
5. **Semana 7 · Storytelling.** Un tablero por audiencia: director, gerente de planta, supervisor.
6. **Semana 8 · Proyecto de portafolio.** Un caso de producción o ventas con datos públicos (por ejemplo, de datos abiertos de gobierno) que puedas presentar en entrevistas.

<!-- CTA-MID --> — Descarga la plantilla de dashboard de ventas en pesos mexicanos.

##### Funciones clave, con ejemplos mexicanos

Una distribuidora con CEDIS en Monterrey, Guadalajara y CDMX, que factura en MXN:

- `Ventas = SUM(Ventas[Importe_MXN])`
- `Ventas Monterrey = CALCULATE([Ventas], CEDIS[Ciudad] = "Monterrey")`
- `% Cumplimiento = DIVIDE([Ventas], [Meta])`
- `Ventas MoM % = DIVIDE([Ventas] - CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH)), CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH)))`
- `Top clientes = RANKX(ALL(Cliente[Razón social]), [Ventas])`
- Para manufactura: `Scrap % = DIVIDE(SUM(Produccion[Piezas_scrap]), SUM(Produccion[Piezas_totales]))`

Si reportas a una matriz en Estados Unidos y necesitas ver montos en dólares, crea una tabla de tipo de cambio diario y una medida `Ventas USD = SUMX(Ventas, Ventas[Importe_MXN] / RELATED(TipoCambio[MXN_por_USD]))`. Así no conviertes a mano cada mes.

##### Errores comunes

- **Mezclar formatos de fecha** (mes/día del sistema en inglés con día/mes del archivo local). Fija la configuración regional en Power Query.
- **Montos con coma de miles importados como texto.** Corrige el tipo de dato antes de cargar.
- **Un tablero para todos.** El director quiere 5 KPIs; el supervisor quiere el detalle por turno. Son páginas distintas.
- **Calcular el tipo de cambio con un promedio mensual cuando el negocio usa el diario.** Pregunta a finanzas cuál es el oficial.
- **Saltarse el modelo estrella** y depender de una tabla gigante exportada.

##### Tres casos reales de uso en empresas mexicanas

**1. Planta automotriz en el Bajío: OEE por turno.** Un supervisor necesita saber cada mañana qué línea perdió eficiencia en el turno de noche. Con Power BI, los registros de paros del MES (o la planilla que llenan los operadores) se cargan solos y el tablero muestra disponibilidad, rendimiento y calidad por línea y turno.

`Disponibilidad = DIVIDE(SUM(Turnos[Min_operando]), SUM(Turnos[Min_planeados]))`
`Rendimiento = DIVIDE(SUM(Produccion[Piezas]), SUMX(Turnos, Turnos[Min_operando] * RELATED(Linea[Piezas_por_min])))`
`Calidad = DIVIDE(SUM(Produccion[Piezas]) - SUM(Produccion[Piezas_scrap]), SUM(Produccion[Piezas]))`
`OEE = [Disponibilidad] * [Rendimiento] * [Calidad]`

Con un segmentador por turno (matutino, vespertino, nocturno), la junta diaria de producción pasa de discutir cifras a decidir acciones.

**2. Distribuidora en Guadalajara: cartera y días de cobro.** Finanzas quiere ver qué clientes están por encima de 60 días. La medida clave:
`Cartera vencida >60 = CALCULATE(SUM(CxC[Saldo_MXN]), CxC[Dias_vencido] > 60)`
y una matriz por vendedor y cliente. Con seguridad a nivel de fila, cada vendedor ve solo su cartera.

**3. Retail en CDMX: venta por tienda contra meta, con fines de semana.** Muchas cadenas comparan la venta del día contra el mismo día de la semana del año anterior, no contra la misma fecha. Se resuelve con una columna «Semana del año» y «Día de la semana» en la tabla calendario y una medida con `DATEADD(Calendario[Fecha], -364, DAY)`, que cae siempre en el mismo día de la semana.

##### Certificación PL-300 en México

La certificación oficial de Microsoft para analistas de Power BI es **Microsoft Certified: Power BI Data Analyst Associate**, que se obtiene aprobando el examen **PL-300**. Microsoft fija el precio según el país donde rindes el examen; el monto exacto para México aparece al registrarte en la página oficial: [learn.microsoft.com — Power BI Data Analyst Associate](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Si eres estudiante, revisa los precios académicos. Consejo práctico: primero domina modelado y DAX con proyectos; la certificación pesa más cuando la acompaña un portafolio.

##### Comunidad para seguir aprendiendo

El foro oficial de la comunidad de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español y grupos de usuarios por ciudad. Busca «Power BI» en Meetup o LinkedIn con el nombre de tu ciudad (CDMX, Monterrey, Guadalajara) para encontrar los grupos que estén activos hoy.

##### ¿Aprender solo o en un curso en vivo?

Con disciplina, se puede aprender solo con la documentación de Microsoft y práctica. Lo que suele fallar es DAX: los errores no son obvios y sin alguien que revise tu modelo puedes pasar semanas con números que «casi» cuadran. En un curso en vivo preguntas en el momento, avanzas con fechas fijas y terminas un proyecto. Si ya tienes base, puedes saltar directo a DAX y modelado.

##### El curso Power BI en vivo de ProgramBI (versión México)

- **En vivo por Zoom**, lunes y miércoles de **16:30 a 18:30, hora de México**.
- **20 horas, 8 módulos**, nivel básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Consulta aranceles vigentes en pesos mexicanos al descargar el PDF en la ficha del [curso de Power BI en México](/mx/cursos/power-bi).
- Temario: Power Query y funciones M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado** al completar.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Lecturas recomendadas: [fórmulas DAX más usadas](/guias/funciones-dax-mas-importantes), [Power BI vs Excel](/guias/power-bi-vs-excel) y el programa integral de [Análisis de datos](/mx/cursos/analisis-de-datos).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en México?**
De 16:30 a 18:30, hora del centro de México, lunes y miércoles. Si estás en otra zona (por ejemplo, Tijuana o Cancún), ajusta según tu huso; si no puedes conectarte, quedan las grabaciones.

**¿Puedo pagar desde México?**
Sí, con tarjeta internacional. El precio se muestra en pesos mexicanos; el cargo final lo define tu banco.

**¿El certificado sirve en México?**
Es un certificado digital de ProgramBI que acredita las horas y el temario. No es un título oficial de la SEP; sirve como evidencia en tu CV y LinkedIn, sobre todo junto a un proyecto.

**¿Qué piden las vacantes de Power BI en México además de la herramienta?**
Excel avanzado, SQL y, cada vez más, inglés para reportar a matrices. En manufactura también valoran conocer indicadores como OEE y scrap.

**¿Power BI o Tableau para trabajar en México?**
Ambos se usan; Power BI suele aparecer más en empresas con Microsoft 365 y SQL Server. Lo que aprendas de modelado y DAX te sirve como base para cualquier herramienta.

**¿Necesito una licencia para empezar?**
No. Power BI Desktop es gratuito en Windows. Para publicar y compartir dentro de una empresa se usa una licencia Pro u otra que defina tu área de TI.
