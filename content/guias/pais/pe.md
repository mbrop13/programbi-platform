---
title: Cómo aprender Power BI en Perú: guía 2026 | ProgramBI
description: Sueldo de analista de datos en Perú según Computrabajo, dónde buscar chamba, ruta de 8 semanas y DAX con ejemplos en soles de Lima, Arequipa y Trujillo.
h1: Cómo aprender Power BI en Perú: guía práctica para analistas
country: pe
lang: es-PE
slug: como-aprender-power-bi-en-peru
path: /pe/guias/como-aprender-power-bi-en-peru
updated: 2026-11-04
course: power-bi
url_curso: https://www.programbi.com/pe/cursos/power-bi
sources:
  - https://pe.computrabajo.com/salarios/analista-de-datos
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/pe/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI aplicada a Perú.
---
En Perú, la palabra que más se repite en los avisos de análisis es «reportes»: reportes comerciales, reportes de cobranza, reportes de campaña. Detrás de casi todos hay una persona que pasa horas en Excel. Las empresas que ya dieron el salto a Power BI —bancos, mineras, agroexportadoras, retail— buscan gente que sepa automatizar ese trabajo. Esta guía te da una ruta clara para aprender, lo que se paga hoy como referencia y los errores que conviene evitar desde el primer día.

<!-- CTA-TOP -->

##### Por qué Power BI en Perú

La economía peruana tiene sectores muy medidos: minería, agroexportación, banca y microfinanzas, consumo masivo y retail. En todos se necesitan tableros diarios: producción, envíos por campaña, colocaciones, cobranza, venta por canal. Además, gran parte del empleo calificado se concentra en Lima, pero cada vez más empresas trabajan en modalidad híbrida o remota, lo que abre oportunidades desde Arequipa, Trujillo o Piura. Power BI, integrado con Excel y con el ecosistema Microsoft que muchas empresas ya usan, se volvió el estándar para estos tableros.

##### Cuánto gana un analista de datos en Perú (referencia)

- **Computrabajo Perú**: sueldo medio de **S/ 2.224 al mes** para «analista de datos», con 467 salarios de los últimos 12 meses (consultado el 4 nov 2026). [pe.computrabajo.com/salarios/analista-de-datos](https://pe.computrabajo.com/salarios/analista-de-datos)
- El mismo portal muestra que el rango declarado va de S/ 500 a S/ 5.000: la media mezcla cargos muy distintos.

Lectura práctica: la media incluye puestos de reportería básica. Los avisos que piden DAX, SQL y modelado son los que se ubican en la parte alta del rango.

##### Dónde buscar chamba con Power BI en Perú

- **Computrabajo Perú** y **Bumeran Perú**: más volumen de avisos locales.
- **LinkedIn Empleos**: banca, consultoras y multinacionales.
- **Talento Perú** (talentoperu.servir.gob.pe): convocatorias del Estado, que publican cada vez más puestos de analista de datos y de gestión.
- **Bolsa de ProgramBI** (`/pe/empleos`).

Tip: muchas convocatorias públicas detallan el temario que evalúan; úsalas como checklist de estudio.

##### Industrias donde más se usa

- **Banca y microfinanzas**: colocaciones, mora por agencia, metas de asesores.
- **Minería**: producción, leyes de mineral, costos por tonelada.
- **Agroexportación** (arándano, palta, uva): kilos exportados por campaña, destino y calibre.
- **Retail y consumo masivo**: sell-out, cobertura y trade marketing.
- **Sector público**: ejecución presupuestal e indicadores de gestión.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Une reportes diarios en una carpeta, limpia fechas y montos en soles.
2. **Semana 3 · Modelo estrella.** Hechos de ventas o despachos; dimensiones de agencia, producto, cliente y calendario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, ALL.
4. **Semana 6 · Tiempo y campañas.** Acumulado del año y, para agro, acumulado por campaña (que no coincide con el año calendario).
5. **Semana 7 · Diseño.** Tablero ejecutivo y tablero operativo por separado.
6. **Semana 8 · Proyecto.** Un caso con datos públicos (por ejemplo, de la Plataforma Nacional de Datos Abiertos, datosabiertos.gob.pe).

<!-- CTA-MID --> — Descarga la plantilla de dashboard de ventas en soles.

##### Funciones clave, con ejemplos peruanos

Una distribuidora con almacenes en Lima, Arequipa y Trujillo, que vende en soles:

- `Ventas = SUM(Ventas[Importe_PEN])`
- `Ventas Arequipa = CALCULATE([Ventas], Almacen[Ciudad] = "Arequipa")`
- `% Mora = DIVIDE(CALCULATE(SUM(Cartera[Saldo]), Cartera[Dias_atraso] > 30), SUM(Cartera[Saldo]))`
- **Acumulado por campaña agrícola** (por ejemplo, de julio a junio): `Kilos campaña = TOTALYTD(SUM(Despachos[Kilos]), Calendario[Fecha], "30/6")`
- `Kilos campaña anterior = CALCULATE([Kilos campaña], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- `Top destinos = RANKX(ALL(Destino[Pais]), SUM(Despachos[Kilos]))`

El tercer argumento de `TOTALYTD` es el día de cierre: con «30/6» el acumulado se reinicia el 1 de julio. Ajusta el formato a la configuración regional de tu modelo.

##### Errores comunes

- **Mezclar soles y dólares en la misma columna.** En Perú muchas empresas facturan en ambas monedas: separa por moneda o convierte con un tipo de cambio diario definido por finanzas.
- **Medir la campaña agrícola con año calendario.** Te parte la temporada en dos.
- **Tableros que dependen de un archivo en el escritorio de alguien.** Usa una carpeta compartida o una base de datos como origen.
- **Columnas calculadas para todo.**
- **No validar contra el sistema contable.** Antes de publicar, cuadra un mes con finanzas.

##### Tres casos reales de uso en empresas peruanas

**1. Microfinanciera en provincias: mora por agencia y asesor.** La gerencia quiere ver cada mañana qué agencias empeoraron su mora y qué asesores concentran los créditos en riesgo.

`Cartera en riesgo % = DIVIDE(CALCULATE(SUM(Creditos[Saldo_PEN]), Creditos[Dias_atraso] > 30), SUM(Creditos[Saldo_PEN]))`
`Variación vs. mes anterior = [Cartera en riesgo %] - CALCULATE([Cartera en riesgo %], DATEADD(Calendario[Fecha], -1, MONTH))`

Con un mapa por región (Arequipa, Cusco, Piura, Junín…), se ve de un vistazo dónde actuar.

**2. Agroexportadora en Ica o La Libertad: kilos por destino y calibre.** Durante la campaña de arándano o uva, el área comercial sigue cuántos kilos salieron por destino y si se cumple el programa de embarques.
`Cumplimiento programa = DIVIDE(SUM(Despachos[Kilos]), SUM(Programa[Kilos_programados]))`
`Kilos por contenedor = DIVIDE(SUM(Despachos[Kilos]), DISTINCTCOUNT(Despachos[Contenedor]))`

**3. Minera en el sur: costo por tonelada.** Operaciones y finanzas comparan el costo real contra el presupuesto, por proceso.
`Costo por t (USD) = DIVIDE(SUM(Costos[Monto_USD]), SUM(Produccion[Toneladas]))`
Aquí casi todo se reporta en dólares: deja la moneda explícita en el nombre de cada medida.

##### Certificación PL-300 en Perú

La certificación oficial de Microsoft es **Power BI Data Analyst Associate** (examen **PL-300**). El precio lo fija Microsoft según el país; el valor para Perú aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). En banca y consultoras de Lima se menciona con frecuencia como deseable. Prepárala después de dominar las bases, no antes.

##### Comunidad para seguir aprendiendo

El foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español. Busca en Meetup y LinkedIn grupos de «Power BI Perú» o «Power BI Lima» y revisa cuáles tienen eventos recientes; también las universidades de Lima organizan charlas abiertas sobre analítica.

##### Un portafolio con datos peruanos

La Plataforma Nacional de Datos Abiertos (datosabiertos.gob.pe) publica conjuntos de datos de salud, educación y ejecución presupuestal. Un tablero de **ejecución del presupuesto por región** o de **matrícula escolar** muestra que sabes limpiar, modelar y comunicar. Acompáñalo de una explicación corta en LinkedIn.

Un detalle local que suma puntos en entrevistas: en Perú muchas empresas reportan en soles y dólares a la vez. Muestra en tu proyecto un selector de moneda hecho con SWITCH y explica qué tipo de cambio usaste y de dónde lo sacaste (por ejemplo, la serie publicada por el BCRP).

##### ¿Aprender solo o en un curso en vivo?

Solo es posible con constancia. Pero, como muestran los avisos, el diferencial está en DAX y en el modelo, que es donde más gente se traba. En vivo resuelves dudas en el momento, avanzas con un calendario y terminas un proyecto. Si solo puedes de noche o te cruza una reunión, las grabaciones cubren la clase.

##### El curso Power BI en vivo de ProgramBI (versión Perú)

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30, hora de Perú**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Revisa el costo en soles y opciones de pago descargando el PDF desde el [curso de Power BI en Perú](/pe/cursos/power-bi).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Complementa tu avance con la [guía práctica de DAX](/guias/funciones-dax-mas-importantes) o el programa de [SQL Server en vivo](/pe/cursos/sql-server).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en Perú?**
Lunes y miércoles de 17:30 a 19:30, hora de Perú. Quedan grabadas por si no puedes conectarte.

**¿Cómo pago desde Perú?**
Con tarjeta internacional. El precio se muestra en soles y el cargo final lo define tu banco.

**¿Conviene la certificación PL-300 de Microsoft?**
Es la certificación oficial de analista de datos con Power BI. Este curso cubre buena parte de las bases (Power Query, modelado, DAX), pero no es un curso de preparación de examen. Si apuntas a la PL-300, primero domina estas bases y luego practica con la guía oficial de Microsoft.

**¿Sirve para postular al Estado?**
Muchas convocatorias públicas piden manejo de herramientas de análisis o Power BI. El certificado de ProgramBI acredita horas y temario; revisa en cada convocatoria qué tipo de constancia aceptan.

**¿Necesito saber SQL antes?**
No para empezar. Pero los avisos mejor pagados lo piden, así que es un buen segundo paso. ProgramBI también tiene curso de SQL.

**¿Funciona Power BI en Mac?**
Power BI Desktop solo existe para Windows. En Mac se usa con una máquina virtual o un PC.
