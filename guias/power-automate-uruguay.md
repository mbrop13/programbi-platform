---
slug: curso-power-automate-uruguay
ruta_sugerida: /uy/guias/curso-power-automate-uruguay
pais: uy
hreflang: es-UY
curso: power-automate
url_curso: https://www.programbi.com/uy/cursos/power-automate
title: "Curso de Power Automate Uruguay: guía 2026 | ProgramBI"
meta: "Curso de Power Automate en Uruguay en vivo: 20 h para automatizar mails, Teams, SharePoint y Excel de 19:30 a 21:30 h con RPA."
h1: "Curso de Power Automate en Uruguay: automatizá Microsoft 365 sin escribir código"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/power-automate
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta del flujo de documentos de embarque «mail → número de embarque en el asunto → carpeta SharePoint → lista de control → aviso en Teams» + bloque «En 30 segundos».
  Intención: "curso power automate uruguay", "curso power automate montevideo" → click_registro en /uy/cursos/power-automate. country=uy, course=power-automate.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave power-automate × uy. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La guía menciona que el módulo 2 cubre licencia M365 sin afirmar qué plan se necesita.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Power Automate para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Power Automate en Uruguay: automatizá Microsoft 365 sin escribir código

**Respuesta corta:** el [curso de Power Automate de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/power-automate) son **20 horas en vivo por Zoom**, de **19:30 a 21:30, hora de Uruguay**, en 10 módulos pensados para automatizar tareas repetitivas **sin programar**. Vas a crear flujos de nube automatizados, instantáneos y programados; integrar Outlook, Teams, OneDrive y SharePoint; trabajar con expresiones y variables; armar aprobaciones; usar RPA de escritorio con Power Automate Desktop; y apoyarte en Copilot para diseñar flujos. El precio es **{precio_local}**, con grabaciones de por vida y certificado digital.

La ficha, consultada el 4 de noviembre de 2026, indica **cupos abiertos · nueva cohorte por abrir**. Se paga en pesos uruguayos con Mercado Pago Uruguay o transferencia bancaria.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Montevideo) · «Ver el curso».

## Equipos chicos, muchas tareas

En muchas empresas uruguayas, una misma persona lleva la administración, arma los reportes, persigue firmas y responde mails de proveedores. Con equipos chicos, cada hora cuenta, y las tareas repetitivas se comen una parte grande de la semana sin que nadie lo note del todo.

La ficha de ProgramBI para Uruguay describe dónde vive el dato: la facturación electrónica de DGI, las planillas de campo y los sistemas de faena, con un primer tablero que suele mostrar margen por lote o por destino de exportación. Alrededor de esas fuentes hay mucho movimiento manual de archivos, avisos y aprobaciones. Ese es justamente el terreno donde Power Automate rinde más.

## Caso: la documentación de cada embarque

Pensá en una empresa que exporta y tiene que reunir, para cada embarque, varios documentos que llegan por mail de distintas personas y proveedores. Hoy alguien los baja, los renombra, los guarda y avisa cuando está todo. Con un flujo:

1. **Desencadenador:** llega un mail con adjuntos a la casilla de comercio exterior.
2. **Clasificación:** con expresiones, el flujo busca el número de embarque en el asunto.
3. **Guardado:** los adjuntos van a la carpeta de SharePoint de ese embarque.
4. **Control:** se actualiza una lista con qué documento llegó y cuándo.
5. **Aviso:** cuando la carpeta está completa, se publica un mensaje en Teams para el equipo.

Ese caso combina contenido dinámico y condiciones (módulo 3), funciones de texto como `split` e `indexOf` (módulo 5), bibliotecas de documentos (módulo 6) y Teams y correo (módulo 8).

## El temario completo

| Módulo | Horas | Contenido |
|---|---|---|
| 1. Automatización y NoCode | 1 | Tendencias, beneficios, casos de uso |
| 2. Primeros pasos | 2 | Power Platform, nube vs. Desktop, tipos de flujo, licencia M365 |
| 3. Un flujo desde cero | 3 | Automático, instantáneo y programado; condiciones y errores |
| 4. IA generativa | 1 | Copilot para diseñar flujos |
| 5. Expresiones y variables | 3 | Texto, fechas, tablas CSV/HTML, Parse JSON, bucles |
| 6. Bibliotecas de documentos | 2 | Adjuntos a OneDrive, notificaciones |
| 7. Aprobaciones | 2 | Circuitos de aprobación |
| 8. Teams y correo | 2 | Avisos automáticos y extracción de datos |
| 9. RPA de escritorio | 2 | Power Automate Desktop; Excel a ERP o web |
| 10. Proyecto final | 2 | Proceso real automatizado y publicado |

## Más ideas para tu día a día

**Planillas de campo.** Cada encargado sube su planilla a una carpeta compartida; el flujo la ordena por fecha y establecimiento, y si falta alguna a cierta hora, manda el recordatorio.

**Facturas de proveedores.** Los comprobantes que llegan por mail se guardan solos por proveedor y mes, y administración recibe un resumen diario de lo que entró.

**Firmas y aprobaciones.** Un contrato o una orden de compra se envía para aprobación; el flujo espera, registra la respuesta y avisa a quien corresponde.

**Sistemas sin conector.** Si el sistema de gestión o de faena solo se usa desde el escritorio, el RPA del módulo 9 puede cargar datos desde Excel imitando lo que harías vos.

## ¿Qué tipo de flujo usar?

- **Automatizado:** cuando algo tiene que pasar al llegar un mail o cambiar un archivo.
- **Programado:** cuando tiene que pasar todos los días o semanas a la misma hora.
- **Instantáneo:** cuando querés dispararlo con un botón.
- **RPA de escritorio:** cuando el programa no tiene conector y solo se usa desde la PC.

## No hace falta programar

La ficha lo dirige a profesionales **sin experiencia previa en programación**. Si usás Excel, Outlook y Teams, tenés la base. Las expresiones del módulo 5 se parecen mucho a las fórmulas de Excel y se aprenden de a poco. Para practicar vas a necesitar una cuenta de Microsoft 365; en el módulo 2 se ve la licencia y cómo dejar Power Automate listo.

## Antes de arrancar: tu lista de tareas

Durante una semana, anotá cada tarea que repetís igual. Para cada una, poné cuántas veces la hacés, cuánto te lleva y qué herramientas usa. Multiplicá y ordená. Las primeras, si siguen reglas claras y usan herramientas de Microsoft 365, son tus candidatas para el proyecto final. Llegar con esa lista hace que cada módulo tenga aplicación inmediata.

## Dónde se nota más el cambio

En una empresa uruguaya mediana, las áreas que más ganan con Power Automate suelen ser:

- **Administración:** comprobantes, pagos a proveedores, conciliaciones y cierres de mes.
- **Comercio exterior:** documentación de embarques, seguimiento de despachos y avisos a clientes.
- **Producción y campo:** planillas diarias, controles y reportes de faena o de establecimiento.
- **Recursos humanos:** licencias, ingresos y comunicaciones internas.
- **Servicios y zonas francas:** solicitudes de clientes, tickets y reportes periódicos.

En todas aparece la misma escena: alguien recibe información por mail o en Excel y la tiene que mover, ordenar o reenviar. Ese movimiento es lo que el curso te enseña a delegar en un flujo.

## Cómo demostrar el ahorro

Elegí una tarea y cronometrala durante una semana: cuántas veces, cuántos minutos, cuántas personas. Repetí la medición un mes después de automatizarla, contando solo el tiempo de revisión. La diferencia, llevada a horas por mes, es el número que vas a mostrar en la presentación del proyecto final y el que te abre la puerta para automatizar lo siguiente.

## Errores típicos

- **Automatizar sin entender el proceso.** Dibujalo antes.
- **Olvidarse de las excepciones.** ¿Qué pasa si el mail no trae adjunto o el número de embarque viene mal escrito?
- **Flujos que solo entiende una persona.** Documentá y compartí.
- **Demasiados avisos.** Un resumen diario funciona mejor que veinte notificaciones.

## Un mes después del curso

**Semana 1:** elegí la tarea. **Semana 2:** armá el flujo y probalo con datos de ejemplo. **Semana 3:** sumá condiciones, errores y resumen. **Semana 4:** ponelo en marcha, documentalo y medí el ahorro. Después, la siguiente.

## Cómo se aprovechan mejor las clases

Lo ideal es llegar con tu lista de tareas y aplicar cada módulo a una de ellas durante la semana. Cuando algo no funcione con tu caso real, traelo a la clase siguiente: en vivo se resuelve rápido y suele servirle al resto del grupo. Las grabaciones quedan para repasar los pasos con calma cuando estés armando tu flujo.

## Automatizar y analizar

Con los archivos llegando ordenados, armar tableros encima es mucho más simple. Si te interesa esa parte, mirá el [curso de Power BI en Uruguay](https://www.programbi.com/uy/cursos/power-bi) y la [guía para aprender Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay). Para reforzar planillas, está el [curso de Excel](https://www.programbi.com/uy/cursos/excel).

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Horario

Las clases son de 19:30 a 21:30 en Montevideo. Uruguay mantiene UTC-3 todo el año, igual que Argentina; como Chile cambia entre UTC-3 y UTC-4, la ficha aclara que la clase puede verse a las 19:30 o a las 20:30 según la época. La ficha de cada cohorte muestra la hora exacta, y todo queda grabado en el campus.

## Resumen

- 20 horas, 10 módulos, sin programar.
- En vivo por Zoom; cupos abiertos · edición siguiente en espera.
- Grabaciones de por vida, certificado digital y proyecto final real.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Power Automate en Uruguay?**
{precio_local}, en pesos uruguayos con Mercado Pago Uruguay o transferencia.

**¿Necesito saber programar?**
No. Es no-code; alcanza con manejar Excel, Outlook y Teams.

**¿Se pueden ordenar automáticamente los adjuntos de los mails?**
Sí. Guardar adjuntos en OneDrive o SharePoint y clasificarlos con expresiones se ve en los módulos 5 y 6.

**¿Qué hago si el sistema de la empresa no tiene conector?**
El módulo 9 enseña RPA con Power Automate Desktop para automatizar programas de escritorio.

**¿Copilot me ayuda a crear los flujos?**
Sí, en el módulo 4 se usa Copilot como asistente de diseño; vos revisás y ajustás lo que propone.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos para la edición entrante. Consultá por WhatsApp.
