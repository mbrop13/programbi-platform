---
slug: curso-excel-mexico
ruta_sugerida: /mx/guias/curso-excel-mexico
pais: mx
hreflang: es-MX
curso: excel
url_curso: https://www.programbi.com/mx/cursos/excel
title: "Curso de Excel en México en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en México: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, 16:30 CDMX. Temario, ejemplos con datos mexicanos."
h1: "Curso de Excel en México: Excel online, en vivo y para tu trabajo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/mx/cursos/excel
  - https://www.programbi.com/mx/cursos/power-bi
  - https://www.programbi.com/mx/cursos/sql-server
  - https://www.programbi.com/mx/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + diagrama «carpeta de archivos → Power Query → tabla única → tabla dinámica» del caso de CEDIS.
  Intención: "curso Excel online en vivo México", "curso Excel México", "aprender Excel desde cero" → click_registro en /mx/cursos/excel. country=mx, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × mx. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 16:30 a 18:30, hora del centro de México sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para México en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en México: Excel online, en vivo y para tu trabajo

**Respuesta corta:** el [curso de Excel de ProgramBI para México](https://www.programbi.com/mx/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **16:30 a 18:30, hora del centro de México**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendes?** Desde lo básico hasta lo que piden las vacantes administrativas y financieras en México: BUSCARX para cruzar contra catálogos, tablas dinámicas para el reporte semanal, funciones de fecha y texto, y Power Query para unir los reportes de cada sucursal o CEDIS. El resultado práctico: menos horas de copiar y pegar y reportes que no se rompen.

**[CTA-TOP]** — Cupos abiertos · 16:30 a 18:30, hora del centro de México · «Ver el curso».

## Por qué vale la pena dominar Excel en México

En México, Excel está en el centro de casi cualquier oficina: cuentas por pagar concilia facturas, planeación arma el pronóstico de demanda, ventas consolida el reporte por región y recursos humanos lleva la plantilla. Lo que cambia entre una persona y otra no es si usa Excel, sino cuánto tiempo pierde en él. Quien domina tablas dinámicas, BUSCARX y Power Query termina en una hora lo que a otros les toma el día.

Por eso, «Excel intermedio» o «avanzado» aparece como requisito en tantas vacantes administrativas, financieras y comerciales. No es un plus: es el piso.

## Lo que más te van a pedir en una oficina mexicana

En vacantes administrativas y financieras de México, el examen de Excel suele incluir tres pruebas: una tabla dinámica de ventas por región, un BUSCARV o BUSCARX contra un catálogo y una fórmula condicional con SI. Si además sabes usar Power Query para unir reportes de varias sucursales o CEDIS, destacas de inmediato frente a otros candidatos, porque es una habilidad que todavía pocos dominan.

## Fórmulas clave, con ejemplos de México

- **Venta de un estado**: `=SUMAR.SI.CONJUNTO(Ventas[Importe];Ventas[Estado];"Nuevo León")`
- **Traer el nombre del proveedor por RFC**: `=BUSCARX([@RFC];Proveedores[RFC];Proveedores[Razón social];"Sin registro")`
- **Marcar facturas vencidas**: `=SI(HOY()-[@Fecha]>30;"Vencida";"Al corriente")`
- **Calcular el IVA de un importe** con la tasa guardada en una celda con nombre (por ejemplo, `TasaIVA`), para no escribirla dentro de cada fórmula: `=[@Subtotal]*TasaIVA`
- **Ranking de sucursales por venta**: `=JERARQUIA.EQV([@Venta];[Venta];0)`

**Un detalle local: el RFC.** A veces viene con espacios, guiones o en minúsculas, según el sistema que lo exporte. Antes de cruzar facturas contra el catálogo de proveedores, normalízalo con `=MAYUSC(ESPACIOS(A2))`. Y si descargas reportes con acentos rotos («MÃ©xico»), impórtalos con Power Query eligiendo la codificación correcta en lugar de abrirlos con doble clic.

## Cinco atajos que te ahorran horas en la oficina

- **Ctrl + T** convierte un rango en Tabla: las fórmulas y tablas dinámicas crecen solas cuando agregas filas.
- **Ctrl + Mayús + L** activa o quita los filtros de una tabla en un segundo.
- **Alt + =** inserta una suma automática debajo de una columna de importes.
- **Ctrl + E** (relleno rápido) separa o une texto siguiendo un ejemplo: útil para separar nombre y apellido o extraer el RFC de una cadena larga.
- **F4** fija referencias ($A$1) mientras escribes una fórmula, para que no se muevan al copiarla.

Úsalos durante una semana en tu reporte de ventas o inventario y vas a notar la diferencia. Son pequeños, pero sumados te devuelven tiempo cada día, y en una prueba práctica de selección transmiten soltura frente a quien evalúa.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos mexicanos.

## Caso: el reporte que se arma solo con Power Query

Un analista de un CEDIS en Monterrey recibe cada lunes los reportes de inventario de cinco almacenes, cada uno con columnas en distinto orden. Antes, los acomodaba a mano y armaba la tabla dinámica de existencias por SKU. Con Power Query, la consulta combina la carpeta, renombra columnas, quita filas vacías y entrega una sola tabla. La tabla dinámica se actualiza con un clic. Lo que tomaba la mañana ahora toma minutos, y el analista puede dedicar ese tiempo a revisar los productos sin movimiento.

## Tablas dinámicas para el reporte de ventas

En México, el reporte semanal de ventas por estado, canal y sucursal es casi siempre una tabla dinámica. Para que no se vuelva un dolor de cabeza: arma la base como Tabla para que crezca sola; agrupa por semana o mes con la opción de agrupar fechas; usa segmentaciones por región y canal para que dirección filtre sin pedirte otra versión; y agrega un campo calculado para el margen. Con eso, el reporte que antes se rehacía cada lunes se actualiza en segundos.

## Errores comunes en oficinas mexicanas

- **RFC con espacios o minúsculas** que impiden cruzar facturas.
- **Archivos con acentos rotos** por abrirlos con la codificación equivocada.
- **Fechas en formato mes/día** cuando el archivo viene de un sistema en inglés.
- **Tablas dinámicas sobre rangos fijos** que no incluyen las filas nuevas.
- **Copiar y pegar reportes de cada CEDIS** que Power Query puede combinar solo.

## De Excel a Power BI: el paso siguiente

Si tu reporte semanal ya se arma con Power Query y tablas dinámicas, Power BI es el siguiente nivel: tableros que dirección consulta sin pedirte archivos y que combinan ventas, inventario y metas. Mira el [curso de Power BI](https://www.programbi.com/mx/cursos/power-bi) y la [guía de Power BI en México](/mx/guias/como-aprender-power-bi-en-mexico). Para extraer datos del ERP, el [curso de SQL Server](https://www.programbi.com/mx/cursos/sql-server); para todo junto, el [curso de Análisis de datos](https://www.programbi.com/mx/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Toma el reporte de ventas de un mes, conviértelo en Tabla y arma una tabla dinámica por estado y semana. Luego agrega con BUSCARX el nombre del vendedor desde el catálogo, normalizando el RFC. Compara el total contra el reporte oficial: si cuadra, acabas de construir un informe que puedes actualizar en minutos cada mes y que te servirá como ejemplo en tu próxima entrevista.

## Dónde se pide Excel en México

En OCC Mundial, Computrabajo, Indeed y LinkedIn, Excel aparece en vacantes de auxiliar contable, analista de cuentas por pagar, analista de planeación, ejecutivo de ventas y asistente administrativo. Muchas entrevistas incluyen un examen práctico: tabla dinámica, BUSCARV o BUSCARX y una fórmula condicional. Practica con tiempo límite.

## Plan de práctica en cuatro semanas

- **Semana 1:** limpia un reporte de ventas, conviértelo en Tabla y calcula ventas por estado.
- **Semana 2:** cruza con BUSCARX contra el catálogo de clientes o proveedores.
- **Semana 3:** arma la tabla dinámica semanal con segmentaciones por canal.
- **Semana 4:** automatiza con Power Query la unión de los archivos de todas las sucursales o CEDIS.

## Cómo elegir tu curso de Excel en México

Revisa que el horario sea en hora del centro de México, que el temario llegue a Power Query, que los ejemplos sean de negocio (ventas, inventario, facturación), que haya grabaciones y que el curso termine con un proyecto práctico.

## El curso de Excel en vivo de ProgramBI (México)

Datos de la [ficha del curso para México](https://www.programbi.com/mx/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **16:30 a 18:30, hora del centro de México**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**[CTA-END]** — {precio_local} · 16:30 a 18:30, hora del centro de México · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en México?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 16:30 a 18:30, hora del centro de México. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para cuentas por pagar o facturación?**
Sí. BUSCARX, tablas dinámicas y Power Query son las herramientas que más se usan para conciliar facturas y pagos.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tu empresa tiene una anterior, el temario incluye INDICE-COINCIDIR.

**¿Puedo seguir con Power BI después?**
Sí. Power Query es el mismo en ambos, así que el salto es directo.
