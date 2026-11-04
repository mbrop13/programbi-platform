---
slug: curso-power-automate-mexico
ruta_sugerida: /mx/guias/curso-power-automate-mexico
pais: mx
hreflang: es-MX
curso: power-automate
url_curso: https://www.programbi.com/mx/cursos/power-automate
title: "Curso de Power Automate en México: guía 2026 | ProgramBI"
meta: "Curso de Power Automate en México en vivo: 20 h para automatizar Outlook, Teams, SharePoint y Excel sin programar, 16:30 CDMX. Aprobaciones, RPA y Copilot."
h1: "Curso de Power Automate en México: deja que los flujos hagan la chamba repetitiva"
updated: 2026-11-04
sources:
  - https://www.programbi.com/mx/cursos/power-automate
  - https://www.sat.gob.mx/
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta del flujo «correo con CFDI → filtro .xml → SharePoint → registro → aviso en Teams» + bloque «En 30 segundos».
  Intención: "curso power automate méxico", "curso power automate en vivo" → click_registro en /mx/cursos/power-automate. country=mx, course=power-automate.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave power-automate × mx. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La guía menciona que el módulo 2 cubre licencia M365 sin afirmar qué plan se necesita.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Power Automate para México en programbi.com y quiero info del curso en vivo".
---

# Curso de Power Automate en México: deja que los flujos hagan la chamba repetitiva

**Respuesta corta:** el [curso de Power Automate de ProgramBI para México](https://www.programbi.com/mx/cursos/power-automate) son **20 horas en vivo por Zoom**, de **16:30 a 18:30, hora del centro de México**, repartidas en 10 módulos para automatizar procesos **sin programar**. Aprendes flujos de nube automatizados, instantáneos y programados, conectores de Outlook, Teams, OneDrive y SharePoint, expresiones, aprobaciones, RPA de escritorio con Power Automate Desktop y Copilot para diseñar flujos con IA. El precio es **{precio_local}**, con grabaciones de por vida y certificado.

Está dirigido a profesionales **sin experiencia en programación**. La ficha, revisada el 4 de noviembre de 2026, indica **cupos abiertos con fecha por confirmar**, y el pago es en pesos mexicanos con Mercado Pago México: tarjeta, SPEI u OXXO.

**[CTA-TOP]** — Cupos abiertos · 16:30 a 18:30 CDMX · «Ver el curso».

## La oficina mexicana tiene mucho que automatizar

La ficha de ProgramBI para México describe un punto de partida común: el CFDI, el ERP y los reportes de tienda. Cada uno de esos frentes genera trabajo manual que se repite: proveedores que mandan sus facturas por correo, reportes de sucursal que llegan en Excel, autorizaciones de gasto que viajan por cadenas de correos interminables.

Power Automate toma esas tareas y las convierte en flujos que corren solos. No es magia ni requiere un área de sistemas: si tu empresa trabaja con Microsoft 365, la herramienta ya está al alcance y se configura desde el navegador.

## Un caso muy mexicano: los CFDI que llegan por correo

Muchas áreas de cuentas por pagar reciben a diario correos de proveedores con el XML y el PDF de la factura. Alguien los descarga, los renombra, los guarda en una carpeta y registra los datos en una hoja de control. Con Power Automate, el flujo puede hacerlo así:

1. **Desencadenador:** llega un correo con adjuntos a la bandeja de facturas.
2. **Filtro:** solo continúa si hay un archivo con extensión `.xml`.
3. **Guardar:** copia XML y PDF en una carpeta de SharePoint organizada por año y mes.
4. **Registrar:** agrega una fila en un Excel o en una lista con remitente, fecha y nombre del archivo.
5. **Avisar:** publica un mensaje en el canal de Teams de cuentas por pagar.

Con las expresiones del módulo 5 y la acción Parse JSON se puede ir más lejos y extraer datos del contenido, pero incluso la versión básica ahorra mucho tiempo y elimina los archivos perdidos. Para entender la estructura de esos comprobantes, la referencia oficial es el [portal del SAT](https://www.sat.gob.mx/).

## El temario completo

- **Módulo 1 (1 h):** automatización de procesos y NoCode; tendencias y casos de uso.
- **Módulo 2 (2 h):** Power Platform, Power Automate en la nube frente a Desktop, tipos de flujo, licencia M365, plantillas y conexiones.
- **Módulo 3 (3 h):** flujos automáticos, instantáneos y programados; contenido dinámico, condiciones, errores y ejecuciones paralelas.
- **Módulo 4 (1 h):** IA generativa: crear flujos con Copilot como asistente de diseño.
- **Módulo 5 (3 h):** variables, expresiones de texto y fecha, `split`, `substring`, tablas CSV y HTML, Parse JSON y bucles.
- **Módulo 6 (2 h):** bibliotecas de documentos: adjuntos a OneDrive y notificaciones.
- **Módulo 7 (2 h):** flujos de aprobación.
- **Módulo 8 (2 h):** Teams y correo: notificaciones, extracción de texto, destinatarios.
- **Módulo 9 (2 h):** RPA con Power Automate Desktop: grabadora, selectores, Excel y aplicaciones de escritorio, traspaso de datos a un ERP o web.
- **Módulo 10 (2 h):** proyecto final con un proceso real, publicado y documentado.

## Otras ideas para tu área

**Reportes de sucursal.** Cada gerente sube su Excel a una carpeta; un flujo detecta el archivo nuevo, lo mueve a la carpeta consolidada y avisa a quien arma el reporte. Si faltan sucursales a cierta hora, manda un recordatorio automático por Teams.

**Autorización de gastos.** El colaborador llena un formulario; según el monto, el flujo envía la aprobación a la jefatura o a la dirección, registra la respuesta y notifica al solicitante y a tesorería.

**Altas de personal.** Cuando Recursos Humanos registra un ingreso nuevo, el flujo avisa a sistemas, crea las tareas de bienvenida y envía el correo de primer día.

**Captura en sistemas sin conector.** Si el ERP solo se usa desde el escritorio, el RPA del módulo 9 puede copiar datos desde Excel tecleando por ti.

## Nube, programado, instantáneo o RPA

| Necesito que… | Uso |
|---|---|
| Algo pase cuando llega un correo o cambia un archivo | Flujo de nube automatizado |
| Algo pase cada lunes a las 9:00 | Flujo programado |
| Algo pase cuando aprieto un botón | Flujo instantáneo |
| Se capture información en un programa sin conector | RPA con Power Automate Desktop |

## ¿Necesito saber programar?

No. La ficha describe el curso como no-code. Si sabes usar Excel, Outlook y Teams, tienes la base. Las expresiones del módulo 5 se parecen a las fórmulas de Excel y se aprenden paso a paso. Lo que sí necesitas es una cuenta de Microsoft 365 para practicar; el módulo 2 revisa el tema de licencia y cómo inicializar la herramienta.

## Antes del curso: haz tu inventario de tareas repetitivas

Un ejercicio de diez minutos que ayuda mucho: durante una semana, apunta cada tarea que haces igual que la vez anterior. Para cada una, anota tres datos:

- **Frecuencia:** ¿diaria, semanal, mensual?
- **Tiempo:** ¿cuántos minutos te toma cada vez?
- **Herramientas:** ¿correo, Excel, Teams, SharePoint, un sistema de escritorio?

Multiplica frecuencia por tiempo y ordena de mayor a menor. Las primeras de la lista, si usan herramientas de Microsoft 365 y siguen reglas claras, son candidatas perfectas para tu proyecto final. Llegar con ese inventario hace que cada clase tenga aplicación inmediata.

## Lo que te llevas al terminar

El módulo 10 no es un ejercicio de juguete: eliges un proceso real de tu trabajo, diseñas el flujo de principio a fin con nube, aprobación y aviso, configuras monitoreo y reintentos, y lo publicas con su documentación. Terminas con una automatización funcionando y con un dato concreto para tu jefe: cuántas horas ahorra al mes.

## Cuatro errores que se ven seguido

- **Automatizar sin dueño.** Todo flujo debe tener un responsable y estar documentado.
- **Olvidar los casos raros.** ¿Qué pasa si el proveedor manda dos facturas en un correo o ninguna? Las condiciones y el manejo de errores del módulo 3 sirven para eso.
- **Notificar de más.** Si el flujo manda 40 avisos al día, la gente los ignora. Mejor un resumen.
- **No medir el ahorro.** Anota cuánto tomaba la tarea antes; es tu mejor argumento para la siguiente automatización.

## El paso siguiente: datos y tableros

Cuando los archivos llegan ordenados a SharePoint, armar un tablero encima es mucho más fácil. Si te interesa esa parte, revisa el [curso de Power BI en México](https://www.programbi.com/mx/cursos/power-bi) y la [guía para aprender Power BI en México](/mx/guias/como-aprender-power-bi-en-mexico). Para reforzar la base de planillas, está el [curso de Excel](https://www.programbi.com/mx/cursos/excel).

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Horario desde México

La ficha indica clases de 16:30 a 18:30 en Ciudad de México. Como México dejó el horario de verano en la mayor parte del país y Chile sí lo aplica, la clase puede verse a las 16:30 o a las 17:30 según la época; la hora exacta aparece en la ficha de tu cohorte. Es un horario que permite conectarse desde la oficina al cierre de la jornada laboral, sin tener que salir corriendo, y las grabaciones quedan disponibles para siempre en el campus.

## Resumen

- 20 horas, 10 módulos, no-code.
- En vivo por Zoom; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida y certificado digital.
- Proyecto final con un proceso real publicado.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}, en pesos mexicanos.

**[CTA-END]** — {precio_local} · 16:30 a 18:30 CDMX · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Power Automate en México?**
{precio_local}. Se paga en pesos con Mercado Pago México: tarjeta, SPEI, OXXO o Wallet.

**¿Sirve si no sé programar?**
Sí. Es un curso no-code pensado para quien usa Excel, Outlook y Teams.

**¿Se puede automatizar la descarga de facturas por correo?**
Sí. Guardar adjuntos en OneDrive o SharePoint y notificar al equipo es parte de los módulos 6 y 8.

**¿Qué es Power Automate Desktop?**
La parte de RPA, para automatizar programas de escritorio sin conector. Se ve en el módulo 9.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos con fecha por confirmar; puedes preguntar por WhatsApp.

**¿Puedo automatizar reportes que mandan las sucursales?**
Sí. Un flujo puede detectar cada Excel nuevo en una carpeta, moverlo al consolidado y mandar recordatorios por Teams a las sucursales que no hayan enviado el suyo.
