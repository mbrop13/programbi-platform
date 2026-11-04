---
slug: curso-excel-uruguay
ruta_sugerida: /uy/guias/curso-excel-uruguay
pais: uy
hreflang: es-UY
curso: excel
url_curso: https://www.programbi.com/uy/cursos/excel
title: "Curso de Excel en Uruguay en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Uruguay: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, 19:30. Temario y ejemplos con datos uruguayos."
h1: "Curso de Excel en Uruguay: planillas online, en vivo y sin errores"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/excel
  - https://www.programbi.com/uy/cursos/power-bi
  - https://www.programbi.com/uy/cursos/sql-server
  - https://www.programbi.com/uy/cursos/analisis-de-datos
  - https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/son-bienes-servicios-gravados-tasa-basica-del-22
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + tabla comparativa «planilla manual vs. Power Query» (tiempo, errores, actualización).
  Intención: "curso Excel online en vivo Uruguay", "curso Excel Uruguay", "aprender Excel desde cero" → click_registro en /uy/cursos/excel. country=uy, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × uy. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 19:30 a 21:30, hora de Uruguay sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Uruguay en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Uruguay: planillas online, en vivo y sin errores

**Respuesta corta:** el [curso de Excel de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **19:30 a 21:30, hora de Uruguay**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendés?** De lo básico a lo que piden las búsquedas administrativas en Uruguay: BUSCARX para traer datos de clientes, tablas dinámicas para ventas, cobros y gastos, funciones de fecha y texto, y Power Query para unificar las planillas de vendedores o sucursales. En la oficina: informes que se actualizan solos y no dependen de una sola persona.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Uruguay · «Ver el curso».

## Por qué vale la pena dominar Excel en Uruguay

En Uruguay, la planilla es parte del día a día de casi cualquier oficina: administración concilia cobros, comercial sigue ventas por departamento, logística controla movimientos y finanzas arma presupuestos. En empresas chicas y medianas, muchas veces una sola persona lleva varias de esas tareas, y cada hora que pierde copiando y pegando es una hora menos para analizar.

Dominar Excel —tablas bien armadas, BUSCARX, tablas dinámicas y Power Query— es una de las inversiones de formación con retorno más rápido: se nota en la primera semana.

## Lo que más se usa en oficinas uruguayas

En empresas chicas y medianas, una misma persona cubre varias áreas, así que lo que más rinde es una base ordenada y varias tablas dinámicas sobre ella. Sumale BUSCARX para traer datos de clientes y Power Query para unificar planillas de vendedores o sucursales, y tenés resuelto casi todo el trabajo de reportes de una oficina. Es también lo que suelen pedir los llamados y las búsquedas administrativas.

## Fórmulas clave, con ejemplos de Uruguay

- **Ventas de un departamento**: `=SUMAR.SI.CONJUNTO(Ventas[Importe];Ventas[Departamento];"Canelones")`
- **Traer la razón social por RUT**: `=BUSCARX([@RUT];Clientes[RUT];Clientes[Razón social];"No encontrado")`
- **Marcar cobros pendientes**: `=SI(Y([@Vencimiento]<HOY();[@Cobrado]="No");"Atrasado";"")`
- **Calcular el IVA de un neto** (tasa básica del 22 %, según la [DGI](https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/son-bienes-servicios-gravados-tasa-basica-del-22)): `=[@Neto]*22%`
- **Promedio de días de permanencia por cliente**: `=PROMEDIO.SI.CONJUNTO(Mov[Días];Mov[Cliente];[@Cliente])`

**Un detalle local: el RUT y la cédula.** El RUT de empresas tiene 12 dígitos y la cédula incluye un dígito verificador; según el sistema, llegan con puntos, guiones o espacios. Normalizalos con `=SUSTITUIR(SUSTITUIR(A2;".";"");"-";"")` y guardalos como texto antes de cruzar tablas.

## Proteger y compartir planillas sin perder el control

En oficinas donde varias personas tocan el mismo archivo, la seguridad de la planilla importa tanto como las fórmulas:

- **Protegé las hojas** que tienen fórmulas y dejá editables solo las celdas de carga.
- **Usá validación de datos** con listas desplegables para departamento, vendedor o rubro.
- **Separá datos, cálculos e informes** en hojas distintas: es más fácil revisar y corregir.
- **Guardá versiones con fecha** antes de cambios grandes, o usá el historial de versiones si trabajás en la nube.
- **Documentá en una hoja «Léame»** de dónde salen los datos y cómo se actualiza el informe.

Esa última práctica es clave en equipos chicos: si te vas de licencia, otra persona puede actualizar el informe sin llamarte. Y si el informe llega a la dirección o a un auditor, poder mostrar de dónde sale cada cifra genera confianza en tu trabajo y en el área. Es un hábito simple que, en empresas chicas, marca la diferencia entre un informe personal y un proceso del equipo.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos uruguayos.

## Caso: el reporte que se arma solo con Power Query

Una administrativa de una distribuidora de Montevideo recibe cada semana las planillas de venta de sus vendedores del interior, cada una con un formato un poco distinto. Antes las unificaba a mano. Con Power Query, la consulta toma la carpeta, estandariza nombres de columnas, corrige fechas y combina todo. Una tabla dinámica muestra ventas por departamento y vendedor, y un gráfico se actualiza solo. El informe que le llevaba una tarde ahora sale en minutos.

## Tablas dinámicas para administración y comercial

En una empresa uruguaya mediana, la misma persona puede necesitar ventas por departamento el lunes, cobros atrasados el miércoles y gastos por rubro el viernes. Con una base bien armada como Tabla, las tres respuestas salen de tablas dinámicas distintas sobre los mismos datos. Agrupá fechas por mes, sumá segmentaciones por vendedor o departamento y guardá cada tabla en una hoja con nombre claro. Así respondés en minutos sin tocar fórmulas.

## Errores frecuentes en planillas uruguayas

- **RUT y cédula con puntos y guiones** mezclados entre sistemas.
- **Fechas mal interpretadas** al importar archivos exportados en otro formato regional.
- **Planillas de vendedores con columnas distintas** unificadas a mano.
- **Celdas combinadas** en tablas que después se quieren filtrar.
- **Informes que dependen de una sola persona** porque nadie documentó cómo se arman.

## De Excel a Power BI: el paso siguiente

Cuando tus planillas ya se combinan con Power Query, Power BI te permite publicar un tablero con ventas por departamento y cobros atrasados que la dirección consulta cuando quiere. Mirá el [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi) y la [guía de Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay). Para consultar bases de datos, el [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server); y para todo junto, el [curso de Análisis de datos](https://www.programbi.com/uy/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Tomá la planilla de ventas de un mes, convertila en Tabla y armá una tabla dinámica por departamento y semana. Agregá con BUSCARX el vendedor de cada cliente desde el maestro, con el RUT normalizado. Sumá un gráfico que se actualice solo. Si el total cuadra con el informe oficial, tenés un reporte reutilizable y un caso concreto para mostrar en una entrevista o en un llamado.

## Dónde se pide Excel en Uruguay

En BuscoJobs, Gallito Trabajo, LinkedIn y Uruguay Concursa, Excel aparece en llamados y búsquedas de administrativo contable, asistente de finanzas, analista comercial, auxiliar de logística y cargos de oficina en general. En los llamados públicos, las bases suelen detallar qué herramientas evalúan: revisalas antes de estudiar.

## Plan de práctica de cuatro semanas

- **Semana 1:** ordená una planilla de ventas como Tabla y normalizá RUT y cédulas.
- **Semana 2:** cruzá con BUSCARX contra el maestro de clientes.
- **Semana 3:** armá tablas dinámicas de ventas, cobros y gastos con segmentaciones.
- **Semana 4:** combiná con Power Query las planillas de todos los vendedores.

## Qué mirar al elegir un curso de Excel en Uruguay

Que sea en vivo y en hora uruguaya, que incluya Power Query, que trabaje con casos de oficina reales, que tenga grabaciones de por vida y que termine con un proyecto que puedas mostrar.

## El curso de Excel en vivo de ProgramBI (Uruguay)

Datos de la [ficha del curso para Uruguay](https://www.programbi.com/uy/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **19:30 a 21:30, hora de Uruguay**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Uruguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Uruguay?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 19:30 a 21:30, hora de Uruguay. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para tareas administrativas y contables?**
Sí. Tablas dinámicas, BUSCARX y Power Query son las herramientas que más se usan en administración, cobros y presupuestos.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tenés una anterior, el temario incluye INDICE-COINCIDIR.

**¿Sirve para preparar un llamado público?**
Muchos llamados piden manejo de planillas; revisá siempre las bases para ver qué evalúan.
