---
slug: curso-power-automate-colombia
ruta_sugerida: /co/guias/curso-power-automate-colombia
pais: co
hreflang: es-CO
curso: power-automate
url_curso: https://www.programbi.com/co/cursos/power-automate
title: "Curso de Power Automate Colombia: guía 2026 | ProgramBI"
meta: "Curso de Power Automate en Colombia en vivo: 20 h para automatizar correo, Teams, SharePoint y Excel sin código, 17:30 hora de Bogotá. Aprobaciones y RPA."
h1: "Curso de Power Automate en Colombia: automatiza procesos de oficina sin código"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/power-automate
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta del flujo de recordatorios de cartera «Excel en SharePoint → filtro por vencimiento → correo con tabla HTML → resumen en Teams» + bloque «En 30 segundos».
  Intención: "curso power automate colombia", "curso power automate bogotá online" → click_registro en /co/cursos/power-automate. country=co, course=power-automate.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave power-automate × co. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La guía menciona que el módulo 2 cubre licencia M365 sin afirmar qué plan se necesita.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Power Automate para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de Power Automate en Colombia: automatiza procesos de oficina sin código

**Respuesta corta:** el [curso de Power Automate de ProgramBI en Colombia](https://www.programbi.com/co/cursos/power-automate) es un programa **en vivo por Zoom de 20 horas**, de **17:30 a 19:30, hora de Colombia**, con 10 módulos para eliminar tareas repetitivas **sin escribir código**. Cubre flujos de nube automatizados, instantáneos y programados; integración con Outlook, Teams, OneDrive y SharePoint; expresiones y variables; aprobaciones; RPA de escritorio con Power Automate Desktop; y Copilot para diseñar flujos con IA. El valor es **{precio_local}**, con grabaciones de por vida y certificado digital.

La ficha, revisada el 4 de noviembre de 2026, muestra **cupos abiertos con fecha por confirmar**. Se paga en pesos colombianos con Mercado Pago Colombia, PSE, Nequi o transferencia.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30 (Bogotá) · «Ver el curso».

## Dónde se pierde el tiempo en una oficina colombiana

La ficha de ProgramBI para Colombia lo describe así: el dato suele estar repartido entre el POS, la facturación electrónica de la DIAN y las bases de recaudo. En el día a día, eso se traduce en tareas manuales que se repiten sin fin:

- Bajar del correo las facturas electrónicas de proveedores y archivarlas.
- Enviar recordatorios de pago a clientes con cartera vencida.
- Reunir los reportes de ventas que cada tienda manda en su propio Excel.
- Perseguir la aprobación de una orden de compra por correo y por WhatsApp.

Cada una parece pequeña. Sumadas, son horas cada semana que podrían dedicarse a analizar en lugar de copiar y pegar. Power Automate permite convertirlas en flujos que se ejecutan solos dentro de Microsoft 365.

## Ejemplo: recordatorios de cartera sin intervención manual

Imagina que el área de cartera mantiene en Excel, dentro de SharePoint, una tabla con clientes, facturas, valores y fechas de vencimiento. Un flujo programado puede hacer esto cada mañana:

1. **Leer la tabla** de cartera.
2. **Filtrar** las facturas que vencen en tres días o que ya están vencidas.
3. **Armar un correo** personalizado para cada cliente con una tabla HTML de sus facturas pendientes.
4. **Enviarlo** desde el buzón de cartera.
5. **Registrar** la fecha de envío en la misma tabla.
6. **Resumir** en Teams cuántos recordatorios salieron y cuál es el valor total.

Las piezas de ese flujo están en el temario: flujos programados (módulo 3), expresiones de fecha y tablas HTML (módulo 5) e integración con correo y Teams (módulo 8). El resultado: nadie tiene que acordarse de enviar recordatorios, y todos los clientes reciben el aviso a tiempo.

## Los 10 módulos

| Módulo | Horas | Qué aprendes |
|---|---|---|
| 1. Automatización y NoCode | 1 | Tendencias, beneficios y casos de uso |
| 2. Primeros pasos | 2 | Power Platform, nube vs. Desktop, tipos de flujo, licencia M365 |
| 3. Flujo desde cero | 3 | Automáticos, instantáneos y programados; condiciones y errores |
| 4. IA generativa | 1 | Crear flujos con Copilot |
| 5. Expresiones y variables | 3 | Texto, fechas, `split`, tablas CSV/HTML, Parse JSON, bucles |
| 6. Bibliotecas de documentos | 2 | Adjuntos a OneDrive y notificaciones |
| 7. Aprobaciones | 2 | Flujos de aprobación sobre documentos |
| 8. Teams y correo | 2 | Notificaciones y extracción de datos |
| 9. RPA de escritorio | 2 | Power Automate Desktop, Excel a ERP o web |
| 10. Proyecto final | 2 | Un proceso real automatizado y publicado |

## Más casos con sabor local

**Facturas electrónicas de proveedores.** Un flujo detecta los correos con adjuntos, guarda los archivos en una carpeta de SharePoint organizada por proveedor y mes, y avisa a contabilidad. Si algo no llega con el formato esperado, se envía a una carpeta de revisión.

**Consolidado de tiendas.** Cada administrador sube su reporte diario a una carpeta compartida. El flujo lo mueve al consolidado y, si a cierta hora falta alguna tienda, le envía un recordatorio automático.

**Órdenes de compra.** El solicitante llena un formulario; el flujo envía la aprobación a la persona que corresponde según el valor, guarda la respuesta y notifica a compras.

**Datos que viven en el escritorio.** Si un sistema contable o un portal no tiene conector, el RPA del módulo 9 puede capturar datos desde Excel imitando lo que harías con mouse y teclado.

## Pequeño glosario de Power Automate

- **Flujo:** la automatización completa.
- **Desencadenador:** el evento que la inicia (un correo, un archivo nuevo, una hora fija, un botón).
- **Acción:** cada paso que ejecuta el flujo.
- **Conector:** el puente con una aplicación, como Outlook o SharePoint.
- **Contenido dinámico:** datos que el flujo toma de pasos anteriores, como el asunto de un correo.
- **Expresión:** una fórmula para transformar datos, parecida a las de Excel.
- **RPA:** automatización que imita a una persona usando programas de escritorio.

## ¿Quién debería tomarlo?

La ficha lo dirige a profesionales sin experiencia en programación que quieren eliminar tareas repetitivas. Encaja especialmente bien si trabajas en:

- Administración, contabilidad o cartera.
- Compras y abastecimiento.
- Talento humano.
- Operaciones comerciales y de tiendas.

Necesitarás una cuenta de Microsoft 365 para practicar; el módulo 2 explica la licencia y cómo activar Power Automate.

## Cómo calcular cuánto tiempo vas a ahorrar

Antes de automatizar, mide. Toma una tarea y anota tres cosas: cuántas veces la haces a la semana, cuántos minutos te toma cada vez y cuántas personas la hacen. Por ejemplo, si tres analistas descargan y archivan facturas diez minutos al día, cinco días a la semana, son dos horas y media semanales del equipo dedicadas solo a eso.

Después de automatizar, vuelve a medir: cuánto tiempo toma ahora revisar lo que el flujo hizo. La diferencia es tu ahorro, y es el argumento más fuerte para pedir apoyo a la siguiente automatización. En el proyecto final del curso se presenta justamente el resultado y el ahorro logrado.

## Un plan de 30 días después del curso

- **Semana 1:** elige una tarea repetitiva, sencilla y frecuente, y dibuja el proceso en papel: qué la inicia, qué pasos tiene, qué decisiones toma.
- **Semana 2:** construye el flujo en la nube y pruébalo con datos de ejemplo.
- **Semana 3:** agrega condiciones, manejo de errores y una notificación de resumen.
- **Semana 4:** ponlo en marcha, documenta cómo funciona y comparte el resultado con tu jefatura.

Luego repite con la siguiente tarea de tu lista. En pocos meses, el cambio se nota en toda el área.

## Errores frecuentes

1. **Empezar por el proceso más complejo.** Mejor un flujo sencillo que funcione a la primera semana.
2. **No pensar en las excepciones.** ¿Qué pasa si el archivo no llega o llega duplicado? Para eso están las condiciones y el manejo de errores.
3. **Dejar flujos sin documentar.** Si solo tú sabes cómo funcionan, el día que faltes nadie podrá corregirlos.
4. **Llenar de notificaciones a todos.** Un buen resumen diario vale más que cincuenta avisos sueltos.

## Automatización y análisis van de la mano

Cuando los archivos llegan ordenados y a tiempo, construir un tablero encima es mucho más simple. Si te interesa esa parte, revisa el [curso de Power BI en Colombia](https://www.programbi.com/co/cursos/power-bi) y la [guía para aprender Power BI en Colombia](/co/guias/como-aprender-power-bi-en-colombia). Para fortalecer la base en hojas de cálculo, tienes el [curso de Excel](https://www.programbi.com/co/cursos/excel).

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## El horario

Las clases son de 17:30 a 19:30 en Bogotá. Colombia se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano, por eso la ficha indica que la clase de 19:30 en Chile se ve a las 17:30 en Bogotá en verano chileno y a las 18:30 en invierno. La ficha de la cohorte muestra la equivalencia exacta, y todas las sesiones quedan grabadas.

## Resumen

- 20 horas, 10 módulos, sin programar.
- En vivo por Zoom; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida, certificado digital y proyecto final con un proceso real.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Valor: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de Power Automate en Colombia?**
{precio_local}, en pesos colombianos con Mercado Pago Colombia, PSE, Nequi o transferencia.

**¿Necesito saber programar?**
No. Es un curso no-code; si usas Excel, Outlook y Teams, tienes la base.

**¿Se pueden enviar recordatorios de cartera automáticos?**
Sí. Con un flujo programado, expresiones de fecha y el conector de correo, que se ven en los módulos 3, 5 y 8.

**¿Qué pasa si mi sistema contable no tiene conector?**
El módulo 9 enseña RPA con Power Automate Desktop para automatizar aplicaciones de escritorio.

**¿Cuándo es la próxima cohorte?**
La ficha muestra cupos abiertos con fecha por confirmar; consúltala por WhatsApp.

**¿Puedo usar Copilot para crear los flujos?**
Sí. El módulo 4 enseña a describir el flujo en lenguaje natural y dejar que Copilot proponga el diseño, que luego ajustas tú.
