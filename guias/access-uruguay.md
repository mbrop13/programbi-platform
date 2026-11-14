---
slug: curso-access-uruguay
ruta_sugerida: /uy/guias/curso-access-uruguay
pais: uy
hreflang: es-UY
curso: access
url_curso: https://www.programbi.com/uy/cursos/access
title: "Curso de Access en Uruguay en vivo | ProgramBI"
meta: "Curso de Microsoft Access en Uruguay: 20 h en vivo por Zoom, 7 módulos de tablas, SQL, formularios, informes y macros a las 19:30 h."
h1: "Curso de Access en Uruguay: del archivo de Excel a una base de datos ordenada"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/access
  - https://www.impo.com.uy/bases/leyes/18331-2008
nota_hermes: |
  ELEMENTO VISUAL: tabla «El recorrido, en siete etapas» (Entender → Diseñar → Preguntar → Cargar → Mostrar → Automatizar → Integrar).
  Intención: "curso access uruguay", "curso microsoft access montevideo" (transaccional) → click_registro en /uy/cursos/access. country=uy, course=access.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave access × uy. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha indica «Cupos abiertos — consulta fecha»; días y horario «Por confirmar» en la cabecera, aunque la FAQ de la misma ficha dice 19:30–21:30 Chile (cadena 16:30 MX, 17:30 PE/CO, 19:30 AR/UY). No publicar fecha; usar «cupos abiertos». Si se fija cohorte, actualizar.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Access para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Access en Uruguay: del archivo de Excel a una base de datos ordenada

**Para ir al grano:** el [curso de Microsoft Access de ProgramBI en Uruguay](https://www.programbi.com/uy/cursos/access) es una formación **en vivo por Zoom de 20 horas, organizada en 7 módulos**, para administrativos que necesitan guardar, ordenar y consultar información de distintas áreas: diseñás tablas relacionadas, escribís consultas con SQL básico, armás formularios con validaciones, generás informes que exportás a PDF y Excel, y automatizás tareas con macros. Cuesta **{precio_local}** y la ficha marca **cupos abiertos · nueva cohorte por abrir**.

Quedan las grabaciones de por vida en el campus, recibís certificado al completar y cerrás con un proyecto integrador sobre un proceso de empresa. Las preguntas frecuentes de la ficha ubican la clase a las 19:30, hora de Uruguay. Se paga en pesos uruguayos con Mercado Pago Uruguay o transferencia. Fuente: ficha del curso, consultada el 4 de noviembre de 2026.

**[CTA-TOP]** — Cupos abiertos · {precio_local} · «Consultar fecha».

## Tres preguntas para saber si es tu curso

**¿Cuántas personas tocan tu archivo?** Si sos la única, Excel probablemente alcance. Si son tres o cuatro cargando a la vez, empiezan los problemas de versiones y Access tiene mucho para aportar.

**¿Cuánto tardás en sacar el reporte del mes?** Si la respuesta se mide en horas y consiste en filtrar, copiar y pegar, un informe basado en una consulta lo resuelve con un clic.

**¿Qué pasa cuando alguien escribe mal un dato?** Si un error de tipeo en el nombre de un proveedor arruina un subtotal, necesitás formularios con listas desplegables y reglas de validación.

## El recorrido, en siete etapas

| Etapa | Módulo | Qué te llevás |
|---|---|---|
| Entender | 1. Introducción a Access | Conceptos de bases de datos, cuándo Excel y cuándo Access, interfaz, creación de la base, tipos de datos, propiedades de campos, importación desde Excel y otros archivos |
| Diseñar | 2. Diseño y construcción | Modelo relacional, tablas, claves primarias y foráneas, relaciones, integridad referencial, normalización básica y una base de gestión de práctica |
| Preguntar | 3. Consultas | Asistente y vista diseño, selección, criterios avanzados, múltiples tablas, agrupación, campos calculados, SUMA, PROMEDIO, CONTAR, MÁXIMO y MÍNIMO, parámetros y SQL: SELECT, WHERE, ORDER BY, GROUP BY, JOIN |
| Cargar | 4. Formularios | Diseño y controles, listas desplegables, cuadros combinados, formularios sobre tablas y consultas, subformularios, validación |
| Mostrar | 5. Informes | Formato, agrupación, totales y subtotales, informes sobre consultas, exportación a PDF y Excel, reportes de gestión |
| Automatizar | 6. Herramientas avanzadas | Macros, botones de navegación, apertura de formularios e informes, SQL en Access, consultas de acción, buenas prácticas |
| Integrar | 7. Proyecto | Base completa para un proceso de empresa, con indicadores, formularios, informes y presentación |

## Desarmando una planilla: un ejemplo de normalización

Supongamos una planilla de compras con estas columnas: fecha, número de orden, proveedor, RUT del proveedor, teléfono del proveedor, artículo, descripción del artículo, cantidad, precio unitario y sector que pidió. Si un proveedor aparece en doscientas órdenes, su RUT y su teléfono se repiten doscientas veces. Cuando cambia el teléfono, hay que corregirlo en doscientas filas, y alguna siempre se escapa.

En el módulo 2 aprendés a separarla así:

- **Proveedores:** código, razón social, RUT, teléfono. Cada proveedor una sola vez.
- **Artículos:** código, descripción. Cada artículo una sola vez.
- **Sectores:** código, nombre.
- **Órdenes:** número, fecha, código de proveedor, código de sector.
- **Detalle de órdenes:** número de orden, código de artículo, cantidad, precio unitario.

Las tablas se conectan por los códigos, que funcionan como claves. El teléfono del proveedor se corrige en un único lugar y todas las órdenes lo muestran actualizado. Esa idea, sencilla pero poderosa, es la base de todo lo que viene después: consultas, formularios e informes.

## Cómo prepararte

Antes de la primera clase, elegí un proceso de tu oficina que hoy viva en Excel. Hacé el ejercicio de arriba con tu propia planilla: listá las columnas y marcá cuáles se repiten fila tras fila. Ese borrador te va a ahorrar tiempo en el módulo 2 y puede convertirse en tu proyecto final.

## Dónde rinde Access en una oficina uruguaya

**Padrón de socios.** En una cooperativa o una asociación, socios, categorías, cuotas y pagos en tablas relacionadas. Una consulta lista quién está atrasado y un informe con subtotales por categoría se exporta a PDF para la comisión directiva.

**Préstamo de equipos.** Notebooks, proyectores o herramientas que se prestan a funcionarios. Un formulario registra salida y devolución, y una consulta muestra lo que sigue afuera después de la fecha prevista.

**Agenda de mantenimiento.** Instalaciones, tareas periódicas y proveedores. La consulta de parámetros pregunta "¿qué vence este mes?" y devuelve la lista con responsable.

**Seguimiento de expedientes.** Número, asunto, oficina actual y fecha de ingreso; cada pase entre oficinas queda como un registro, así sabés por dónde anduvo cada expediente y cuánto tiempo estuvo en cada lugar.

## Así luce el SQL del módulo 3

Esta consulta suma cuotas impagas por categoría de socio:

```sql
SELECT Categorias.Nombre, SUM(Cuotas.Importe) AS Impago
FROM (Cuotas INNER JOIN Socios ON Cuotas.IdSocio = Socios.IdSocio)
INNER JOIN Categorias ON Socios.IdCategoria = Categorias.IdCategoria
WHERE Cuotas.Pagada = False
GROUP BY Categorias.Nombre;
```

No se programa en el sentido clásico: son unas pocas palabras clave que se aprenden desde cero y que te sirven igual si después pasás al [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server).

## Un proyecto integrador posible

Alguien de secretaría en una institución educativa de Montevideo podría armar el registro de inscripciones a talleres: tablas de alumnos, talleres, docentes e inscripciones; un formulario de inscripción que impide anotar a alguien en un taller sin cupo; consultas de inscriptos por taller y de talleres con lugares libres; un informe para cada docente con su lista, exportable a PDF, y un menú con botones. Como hay datos de personas, el diseño contempla guardar solo lo necesario y restringir el acceso, según la [Ley 18.331](https://www.impo.com.uy/bases/leyes/18331-2008) y las reglas de la institución.

## Quiénes lo aprovechan

La ficha lo orienta al **personal administrativo que necesita almacenar, organizar, consultar y analizar información de distintas áreas de una organización**. En la práctica: secretarías, administrativos de cooperativas y empresas, responsables de compras, personal, inventario o mantenimiento.

## Tropiezos clásicos del principiante

- **Una tabla para todo.** Repetís el mismo dato en cientos de filas y cualquier cambio hay que hacerlo cientos de veces.
- **Sin clave primaria.** Los duplicados aparecen solos.
- **Escribir en la tabla.** Sin formulario no hay validación.
- **Consultas de acción sin respaldo.** Una eliminación mal filtrada no tiene vuelta atrás sin copia.
- **Informes hechos a mano.** Si dependen de una consulta, se actualizan solos.

## Lo que viene después

- **Más volumen y más usuarios:** [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server).
- **Indicadores en tableros:** [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi), que puede leer los datos de tu base. Para empezar, tenés la [guía para aprender Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay).

## Datos de la cohorte

- **Carga horaria:** 20 horas, 7 módulos.
- **Modalidad:** en vivo por Zoom, grabaciones de por vida.
- **Fecha:** cupos abiertos, a confirmar.
- **Horario:** según la FAQ de la ficha, 19:30 a 21:30, hora de Uruguay.
- **Certificado:** al completar.
- **Docente:** Manuel Oliva, Magíster en Data Science (UAI).
- **Precio:** {precio_local}. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descargá el temario completo.

**[CTA-END]** — {precio_local} · Cupos abiertos · «Inscribirme» · «Escribinos por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Access en Uruguay?**
{precio_local}, en pesos uruguayos con Mercado Pago Uruguay o transferencia.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos para la edición entrante. Escribinos por WhatsApp para saber cuándo arranca la próxima cohorte.

**¿Hace falta experiencia previa?**
No. Se parte desde los conceptos básicos de bases de datos y el SQL se aprende desde cero, paso a paso, con ejemplos de oficina.

**¿Puedo traer mis planillas?**
Sí. La importación desde Excel y otros archivos se ve en el módulo 1.

**¿Qué tengo que tener instalado?**
Microsoft Access en tu equipo; confirmalo con informática antes de la primera clase.

**¿Access o directamente Power BI?**
Son cosas distintas y complementarias: Access guarda, ordena y controla la información que se carga todos los días; Power BI la toma y la visualiza en tableros que el equipo consulta. Muchas veces van juntos en la misma oficina, y entender tablas y relaciones en Access te deja mucho mejor parado para modelar datos en Power BI.

**¿Es lo mismo que un curso de Excel avanzado?**
No. En Excel avanzado trabajás fórmulas, tablas dinámicas y análisis dentro de la hoja. Acá aprendés a guardar la información en tablas relacionadas, a controlar la carga con formularios y a generar informes que se regeneran solos cada vez que los abrís.

**¿Y si falto a una clase?**
Queda grabada en el campus con acceso de por vida, así que podés ponerte al día antes del módulo siguiente.

**¿Qué recibo al final?**
Certificado digital de ProgramBI y grabaciones de por vida.
