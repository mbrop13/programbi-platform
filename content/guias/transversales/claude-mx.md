---
title: Cómo usar Claude para análisis de datos en México
description: Prompts listos para conciliar reportes, limpiar bases de clientes y explicar variaciones con Claude. Ejemplos en pesos mexicanos y cuidados de privacidad.
h1: Claude para análisis de datos: guía práctica para equipos en México
country: mx
lang: es-MX
slug: como-usar-claude-para-analisis-de-datos
path: /mx/guias/como-usar-claude-para-analisis-de-datos
updated: 2026-11-04
course: claude
---
En muchas oficinas de México el cierre de mes significa lo mismo: conciliar reportes de distintas áreas, explicar por qué no cuadra una cifra y preparar la presentación para la dirección. Claude, el asistente de IA de Anthropic, no hace el cierre por ti, pero sí te ahorra horas en las tareas que lo rodean. Esta guía va directo a los usos que más tiempo liberan en equipos de finanzas, administración y comercial.

<!-- CTA-TOP -->

##### Tres usos con impacto inmediato

**1. Conciliar dos reportes.** Sube el reporte de ventas del ERP y el de facturación, y pide: «Compara ambos por número de factura. Lista las facturas que están en uno y no en el otro, y las que tienen importes distintos en MXN. Al final, dame el total de diferencias.» Luego valida una muestra a mano.

**2. Limpiar una base de clientes.** «Esta base tiene clientes repetidos con distintas escrituras de la razón social (por ejemplo, con y sin "S.A. de C.V."). Propón una regla para unificarlos y muéstrame los casos dudosos en una tabla.»

**3. Explicar variaciones.** «Te adjunto ventas por CEDIS (CDMX, Guadalajara, Monterrey) de septiembre y octubre. Explica en 6 líneas para la dirección qué cambió y qué datos adicionales necesitaría para confirmar las causas.»

##### El método: contexto, tarea, formato, tono y restricciones

Claude responde mucho mejor cuando sabe quién eres, qué necesitas y en qué formato. Agrega siempre una restricción clave: **«No inventes datos; si falta información, dímelo.»** Y pide que muestre el criterio que usó, para que puedas revisarlo.

<!-- CTA-MID --> — Descarga la plantilla de prompts para cierres de mes.

##### De Claude a Excel y Power BI

- Pide fórmulas de Excel explicadas («dame la fórmula y explícame cada argumento»).
- Pide que convierta una explicación en una tabla lista para pegar.
- Si tu empresa usa Power BI, pídele que te explique una medida DAX existente en lenguaje simple antes de modificarla.

##### Caso completo: el paquete de cierre para la dirección

Un equipo de finanzas en Monterrey debe entregar cada mes el comparativo de gastos por centro de costos contra presupuesto. Así se ve el flujo con Claude:

1. **Ordenar.** Adjunta la balanza o el reporte de gastos y pide: «Agrupa estas cuentas en las categorías de este catálogo (te lo adjunto). Lista las cuentas que no sepas clasificar.» Nunca dejes que adivine una clasificación contable: que te pregunte.
2. **Comparar.** «Calcula real contra presupuesto por centro de costos en MXN y en %. Marca las desviaciones mayores a 10 %.»
3. **Explicar.** «Para cada desviación marcada, redacta una línea con la explicación que dan los comentarios del archivo. Si no hay comentario, escribe "pendiente de explicar".» Así no se inventan causas.
4. **Presentar.** «Convierte esto en 3 láminas: resumen, desviaciones principales y acciones.» Con Slides o Artifacts tienes el borrador en minutos.
5. **Revisar.** Cuadra el total de gastos con la contabilidad antes de enviar.

##### Prompts listos para copiar

- **Formato de fechas y montos**: «Este archivo mezcla fechas mm/dd/aaaa y dd/mm/aaaa y montos con y sin comas. Dime qué filas tienen cada formato y cómo unificarlas en Excel.»
- **Comparativo de proveedores**: «Compara estas tres cotizaciones en una tabla: precio unitario en MXN, IVA, tiempo de entrega y condiciones de pago. Señala lo que no sea comparable.»
- **Minuta**: «A partir de estas notas desordenadas de la junta, redacta una minuta con acuerdos, responsables y fechas. No agregues acuerdos que no estén en las notas.»
- **Fórmula explicada**: «Necesito una fórmula que sume las ventas de la región Norte en el trimestre. Dámela con SUMAR.SI.CONJUNTO y explica cada argumento.»
- **Revisión de un reporte**: «Revisa este reporte como si fueras el director financiero: ¿qué preguntas me haría y qué cifras se ven inconsistentes?»

##### Projects para equipos

Si varias personas del área hacen tareas parecidas, un **Project** con el catálogo de cuentas, las políticas de gastos y un ejemplo de cierre anterior hace que todos obtengan respuestas consistentes. Es uno de los temas del módulo 3 del curso.

##### Lo que conviene acordar con TI

Antes de usar Claude con datos de la empresa, confirma con tu área de TI o de cumplimiento qué tipo de cuenta usar, qué datos se pueden subir y qué no (datos personales de clientes y empleados, por ejemplo). En el módulo 1 del curso vemos planes y privacidad para empresas, y en el módulo 5, seguridad, verificación y uso responsable.

##### Errores típicos

- **Pedir conclusiones sin datos suficientes.** Exige que diga qué le falta.
- **Pegar tablas enormes en el chat.** Mejor adjunta el archivo.
- **No guardar el prompt que funcionó.** Arma tu biblioteca de prompts del área; el curso te deja plantillas reutilizables.

##### Cuidados que no son opcionales

- **Verifica totales** contra el sistema antes de enviar cualquier cosa.
- **Datos personales**: antes de subir bases con datos de clientes, revisa la política de tu empresa y el tipo de cuenta que usan.
- **Trazabilidad**: guarda el prompt y la versión del archivo que usaste.

##### El curso Claude en vivo de ProgramBI (versión México)

- **En vivo por Zoom**, lunes y miércoles de **16:30 a 18:30, hora de México**. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para México: **{{precio}}**
- **20 horas, 5 módulos**: primeros pasos y privacidad; prompting práctico; Projects, Artifacts, Docs y Slides; Claude para Excel y tareas administrativas; automatización ligera y proyecto final con un proceso real de tu trabajo.
- **Grabaciones de por vida** y **certificado**. Instructor: **Manuel Oliva**.

<!-- CTA-END --> — «Ver el curso Claude» (`/mx/cursos/claude`) · WhatsApp.

##### Preguntas frecuentes

**¿A qué hora son las clases en México?** Lunes y miércoles de 16:30 a 18:30, hora del centro de México.
**¿Cómo pago desde México?** Con tarjeta internacional; el precio se muestra en MXN y el cargo final lo define tu banco.
**¿Sirve si no sé nada de IA?** Sí. El curso parte desde crear la cuenta y la primera conversación.
**¿Puedo usar Claude con archivos del trabajo?** Sí, con los cuidados de privacidad que defina tu empresa; lo vemos en el módulo 1.
**¿Claude hace fórmulas de Excel?** Sí, y las explica. Revisa siempre el resultado con un caso conocido.
**¿Queda grabado?** Sí, todas las clases quedan en el campus de por vida.
