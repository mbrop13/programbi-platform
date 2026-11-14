---
title: Cómo aprender Power BI en Chile: guía 2026 | ProgramBI
description: Ruta de 8 semanas, sueldos reales de analista BI en Chile, DAX con ejemplos en pesos y dónde buscar pega. Guía práctica de ProgramBI.
h1: Cómo aprender Power BI en Chile (y llegar a usarlo en tu pega)
country: cl
lang: es-CL
slug: como-aprender-power-bi-en-chile
path: /guias/como-aprender-power-bi-en-chile
updated: 2026-11-04
course: power-bi
url_curso: https://www.programbi.com/cursos/power-bi
sources:
  - https://www.chiletrabajos.cl/sueldos/analista/bi
  - https://cl.indeed.com/career/analista-bi/salaries
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI aplicada al mercado chileno.
---
En Chile, buena parte del trabajo de control de gestión todavía vive en un Excel que alguien actualiza a mano cada lunes: se bajan reportes del ERP, se pegan en una hoja, se arreglan fórmulas que se rompieron y, con suerte, el informe llega a gerencia el miércoles. Power BI existe para que eso no pase. Esta guía te muestra cómo aprenderlo en serio, qué pide hoy el mercado chileno y cómo pasar de «sé hacer gráficos» a «mantengo el dashboard que usa mi empresa».

<!-- CTA-TOP -->

##### Por qué Power BI tiene tanto sentido en Chile

Hay tres razones muy chilenas. La primera: muchas empresas ya pagan Microsoft 365, así que Power BI entra «por la puerta de Excel» sin una compra nueva gigante. La segunda: los sectores que más pesan en la economía —minería, retail, banca, salud y servicios— generan datos operativos todos los días, y en ellos el reporte mensual hecho a mano ya no alcanza. La tercera: los cargos de control de gestión, finanzas y operaciones piden cada vez más «manejo de Power BI» como requisito, no como un plus.

En la práctica, lo que se valora no es saber dónde está el botón de un gráfico de barras, sino entender un modelo de datos, escribir medidas DAX correctas y dejar una actualización automática que no dependa de ti.

##### Cuánto gana un analista BI en Chile (referencia)

Las cifras varían mucho según experiencia, empresa y región, así que tómalas como referencia, no como promesa:

- **Chiletrabajos**: el sueldo **pretendido** promedio para «analista BI» es de **$1.147.226 al mes** (rango $990.898–$1.425.339), calculado con 16.005 postulaciones de los últimos 12 meses (consultado en noviembre 2026). [chiletrabajos.cl/sueldos/analista/bi](https://www.chiletrabajos.cl/sueldos/analista/bi)
- **Indeed Chile**: sueldo promedio de **$1.035.380 al mes** para analista BI en Chile (consultado el 4 nov 2026; la cifra cambia según los avisos publicados). [cl.indeed.com/career/analista-bi/salaries](https://cl.indeed.com/career/analista-bi/salaries)
- **Ejemplo real de aviso** (ya expirado): un cargo de «Analista Power BI» en San Bernardo publicado en febrero de 2026 ofrecía **$1.500.000** y pedía 3 años de experiencia con Power BI, SQL y deseable SAP. [Chiletrabajos, aviso 3787550](https://www.chiletrabajos.cl/trabajo/analista-power-bi-san-bernardo-3787550)

Fíjate en el último punto: el aviso no pedía «Power BI básico», pedía modelamiento, SQL e integración con un ERP. Esa es la brecha que conviene cerrar.

##### Dónde buscar pega con Power BI en Chile

- **LinkedIn Empleos**: busca «Power BI» + «control de gestión» o «analista BI» y filtra por Región Metropolitana o remoto.
- **Chiletrabajos** y **Laborum**: muchos avisos de pymes y medianas empresas con sueldo visible.
- **GetOnBoard**: avisos tech con rangos salariales publicados.
- **Empleos Públicos** (empleospublicos.cl): servicios y municipios contratan analistas de datos y de gestión.
- **Bolsa de ProgramBI** (`/empleos`): avisos que publicamos en el sitio.

Truco: guarda la búsqueda con la palabra «DAX». Los avisos que la mencionan suelen ser más técnicos y mejor pagados que los que solo dicen «Power BI».

##### Industrias donde más se usa

- **Minería y energía**: tableros de producción, disponibilidad de equipos y costos por faena.
- **Retail**: ventas por tienda, quiebres de stock y margen por categoría.
- **Banca, seguros y AFP**: cartera, mora y metas comerciales por sucursal.
- **Salud**: listas de espera, ocupación de camas y productividad de pabellones.
- **Sector público**: indicadores de gestión, presupuesto y ejecución.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Fundamentos y Power Query.** Conecta un Excel de ventas, limpia columnas, quita filas basura y aprende a «despivotar» una tabla. Meta: un informe que se actualice con un clic.
2. **Semana 3 · Modelo estrella.** Separa hechos (ventas) de dimensiones (producto, sucursal, calendario). Crea tu tabla calendario. Esta semana define si tus números van a cuadrar.
3. **Semanas 4–5 · DAX esencial.** SUM, DIVIDE, CALCULATE, FILTER y ALL. Medidas de margen y participación.
4. **Semana 6 · Inteligencia de tiempo.** Acumulado del año, mismo período del año anterior y variación.
5. **Semana 7 · Diseño.** Una página por pregunta de negocio, KPIs arriba, detalle abajo, segmentadores a la izquierda.
6. **Semana 8 · Proyecto.** Un tablero con tus propios datos (anonimizados) que puedas mostrar en una entrevista.

<!-- CTA-MID --> — Descarga la plantilla de dashboard de ventas en pesos chilenos.

##### Funciones clave, con ejemplos chilenos

Imagina una cadena con sucursales en Santiago, Concepción y Antofagasta, que vende en CLP.

- **Ventas totales**: `Ventas = SUM(Ventas[Monto_CLP])`
- **Ventas solo de Antofagasta**: `Ventas Antofagasta = CALCULATE([Ventas], Sucursal[Ciudad] = "Antofagasta")`
- **Margen %**: `Margen % = DIVIDE([Ventas] - [Costo], [Ventas])`. Usa DIVIDE y no «/»: si una sucursal no vendió, evitas el error de división por cero.
- **Acumulado del año**: `Ventas YTD = TOTALYTD([Ventas], Calendario[Fecha])`
- **Comparación con el año anterior**: `Ventas AA = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- **Ranking de sucursales**: `Ranking = RANKX(ALL(Sucursal[Ciudad]), [Ventas])`

Un consejo de control de gestión: si tu empresa cierra el año fiscal en diciembre, todo bien; si reportas por otro período, `TOTALYTD` acepta una fecha de cierre como tercer argumento.

##### Errores comunes al aprender

- **Usar Power BI como un Excel con colores.** Si importas una sola tabla gigante, el modelo crece y las medidas se vuelven lentas y confusas.
- **Columnas calculadas para todo.** Casi siempre lo correcto es una medida.
- **No tener tabla calendario.** Sin ella, la inteligencia de tiempo falla o da resultados raros.
- **Montos como texto.** Los reportes bajados de algunos sistemas traen «$1.234.567» como texto; corrígelo en Power Query, no en DAX.
- **Publicar sin pensar en quién ve qué.** Si el tablero tiene datos de remuneraciones o de clientes, necesitas seguridad a nivel de fila (RLS).

##### ¿Aprender solo o en un curso en vivo?

Solo se puede: la documentación de Microsoft es buena y hay mucho video. El problema es el orden y el feedback. La mayoría se queda en los gráficos y abandona en DAX, justo donde está el valor. Un curso en vivo te obliga a avanzar con un calendario, te deja preguntar «¿por qué mi medida da otro número?» en el momento y te empuja a terminar un proyecto. Si ya tienes disciplina y tiempo, empieza solo con esta ruta; si llevas meses «queriendo aprender», el curso en vivo es lo que suele destrabarlo.

##### El curso Power BI en vivo de ProgramBI

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Chile, después de la pega.
- **20 horas, 8 módulos**, nivel básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Temario: Power Query, parámetros y funciones M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH y funciones de IA de Power BI (preguntas en lenguaje natural e insights automáticos).
- **Grabaciones de por vida** en el campus y **certificado** al completar.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.
- Recursos y rutas relacionadas: ficha del [curso de Power BI en vivo](/cursos/power-bi), referencia práctica de [funciones DAX](/guias/funciones-dax-mas-importantes), comparativa [Power BI vs Excel](/guias/power-bi-vs-excel) y el programa de [Análisis de datos completo](/cursos/analisis-de-datos).
- Para equipos corporativos, revisa [capacitación para empresas](/empresas).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿Cuánto tiempo toma aprender Power BI?**
Para usarlo con soltura en un trabajo de análisis, unas 8 semanas con 4 a 5 horas semanales. Lo básico se aprende en días; el modelo de datos y DAX toman más.

**¿Necesito saber Excel avanzado?**
Ayuda, pero no es requisito. Si manejas tablas dinámicas y BUSCARV o BUSCARX, ya tienes la base mental. Power Query reemplaza buena parte del Excel «manual».

**¿Power BI es gratis?**
Power BI Desktop es gratuito para Windows. Para compartir informes en la nube dentro de una empresa normalmente se necesita una licencia Pro o que la empresa tenga capacidad Premium/Fabric; revisa con tu área de TI.

**¿Sirve Power BI en Mac?**
Power BI Desktop no tiene versión para Mac. Se usa con una máquina virtual con Windows o desde un PC. Avísanos antes de inscribirte y te orientamos.

**¿El curso de ProgramBI entrega certificado?**
Sí, un certificado digital de ProgramBI al completar el curso, además del acceso de por vida a las grabaciones.

**¿Qué pide un aviso de analista BI en Chile además de Power BI?**
Con frecuencia SQL, Excel avanzado y, en empresas grandes, experiencia con un ERP como SAP. Por eso el curso trabaja conexión a bases de datos y modelamiento, no solo visualización.
