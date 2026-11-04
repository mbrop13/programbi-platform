---
slug: curso-power-automate-peru
ruta_sugerida: /pe/guias/curso-power-automate-peru
pais: pe
hreflang: es-PE
curso: power-automate
url_curso: https://www.programbi.com/pe/cursos/power-automate
title: "Curso de Power Automate en Perú: guía 2026 | ProgramBI"
meta: "Curso de Power Automate en Perú en vivo por Zoom: 20 h para automatizar correo, Teams, SharePoint y Excel sin programar, 17:30 hora de Lima. Aprobaciones y RPA."
h1: "Curso de Power Automate en Perú: menos copiar y pegar, más chamba que importa"
updated: 2026-11-04
sources:
  - https://www.programbi.com/pe/cursos/power-automate
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta del flujo «Excel de planta en SharePoint → lectura → condición fuera de rango → correo con tabla HTML → aviso en Teams» + bloque «En 30 segundos».
  Intención: "curso power automate perú", "curso power automate lima online" → click_registro en /pe/cursos/power-automate. country=pe, course=power-automate.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave power-automate × pe. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La guía menciona que el módulo 2 cubre licencia M365 sin afirmar qué plan se necesita.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Power Automate para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de Power Automate en Perú: menos copiar y pegar, más chamba que importa

**Respuesta corta:** el [curso de Power Automate de ProgramBI en Perú](https://www.programbi.com/pe/cursos/power-automate) es un programa **en vivo por Zoom de 20 horas**, de **17:30 a 19:30, hora de Perú**, con 10 módulos para automatizar tareas **sin programar**: flujos de nube automatizados, instantáneos y programados; integración con Outlook, Teams, OneDrive y SharePoint; expresiones; aprobaciones; RPA de escritorio con Power Automate Desktop; y Copilot para diseñar flujos con IA. El precio es **{precio_local}**, con grabaciones de por vida y certificado digital.

Según la ficha, revisada el 4 de noviembre de 2026, hay **cupos abiertos con fecha por confirmar**. Se paga en soles con Mercado Pago Perú, Yape, Plin o transferencia.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30 (Lima) · «Ver el curso».

## Dónde se va el tiempo en una oficina peruana

La ficha de ProgramBI para Perú describe un escenario frecuente: se parte de los comprobantes electrónicos de SUNAT, los reportes de planta y las planillas de campo. Cada una de esas fuentes trae trabajo manual alrededor:

- Descargar del correo los comprobantes de proveedores y archivarlos.
- Recibir el reporte diario de planta y reenviarlo a cinco personas.
- Juntar las planillas que mandan los supervisores de campo.
- Conseguir el visto bueno de una requisición, que pasa de correo en correo.

Son tareas que no requieren criterio, solo constancia y buena memoria todos los días del año. Y la constancia es justamente lo que mejor hace un flujo automático bien diseñado. Con Power Automate, esas tareas se configuran una vez dentro de Microsoft 365 y se ejecutan solas.

## Caso práctico: el reporte de planta que se distribuye solo

Supongamos que el jefe de turno guarda cada mañana un Excel con la producción del día en una carpeta de SharePoint. Hoy, alguien tiene que abrirlo, revisar los números y reenviarlo. Con un flujo:

1. **Desencadenador:** se crea un archivo nuevo en la carpeta "Reportes de planta".
2. **Lectura:** el flujo lee la tabla del Excel y toma los indicadores clave.
3. **Condición:** si algún indicador está fuera del rango esperado, marca el correo como prioritario.
4. **Envío:** manda un correo con una tabla HTML de resumen a la lista de distribución.
5. **Teams:** publica un aviso en el canal de operaciones con el enlace al archivo.

Todo eso cabe en lo que se ve en los módulos 3 (flujos y condiciones), 5 (expresiones y tablas HTML), 6 (bibliotecas de documentos) y 8 (Teams y correo). El jefe de turno sigue guardando su archivo como siempre; lo demás ocurre solo.

## Temario de 20 horas

- **Módulo 1 · 1 h** — Automatización y NoCode: qué se puede automatizar y por qué importa.
- **Módulo 2 · 2 h** — Primeros pasos: Power Platform, nube vs. Desktop, tipos de flujo, licencia M365, plantillas y conexiones.
- **Módulo 3 · 3 h** — Flujo desde cero: automático, instantáneo y programado; contenido dinámico, condiciones, errores y ejecuciones paralelas.
- **Módulo 4 · 1 h** — IA generativa: Copilot como asistente para crear flujos.
- **Módulo 5 · 3 h** — Expresiones y variables: textos, fechas, `split`, `substring`, tablas CSV y HTML, Parse JSON y bucles.
- **Módulo 6 · 2 h** — Bibliotecas de documentos: adjuntos a OneDrive y notificaciones.
- **Módulo 7 · 2 h** — Aprobaciones.
- **Módulo 8 · 2 h** — Teams y correo electrónico.
- **Módulo 9 · 2 h** — RPA con Power Automate Desktop: grabadora, selectores, Excel y aplicaciones de escritorio.
- **Módulo 10 · 2 h** — Proyecto final con un proceso real, publicado y documentado.

## Otros flujos útiles

**Planillas de campo.** Cada supervisor sube su planilla a una carpeta compartida. El flujo las ordena por fecha y zona, y si a cierta hora falta alguna, manda un recordatorio por Teams.

**Requisiciones y compras.** El solicitante completa un formulario; el flujo envía la aprobación a quien corresponda según el monto, registra la respuesta y avisa a logística.

**Comprobantes de proveedores.** Los adjuntos del correo se guardan solos en SharePoint, por proveedor y mes, y contabilidad recibe un resumen diario.

**Sistemas que no tienen conector.** Si un sistema de planta o un portal solo se usa desde el escritorio, el RPA del módulo 9 puede copiar datos desde Excel imitando el teclado y el mouse.

## Elegir bien el tipo de flujo

| Quiero que… | Uso |
|---|---|
| Algo pase cuando llega un correo o se crea un archivo | Flujo de nube automatizado |
| Algo pase cada día a la misma hora | Flujo programado |
| Algo pase al presionar un botón | Flujo instantáneo |
| Se carguen datos en un programa sin conector | RPA de escritorio |

## ¿Necesitas saber programar?

No. La ficha define el curso para profesionales **sin experiencia previa en programación**. Si usas Excel, Outlook y Teams todos los días, ya tienes la base. Las expresiones del módulo 5 se parecen a las fórmulas de Excel y se aprenden con ejemplos. Para practicar necesitarás una cuenta de Microsoft 365; el módulo 2 revisa la licencia y cómo dejar lista la herramienta.

## Para quién rinde más

Aunque cualquier persona que use Microsoft 365 puede aprovecharlo, el curso rinde especialmente en estas áreas:

- **Administración y contabilidad:** comprobantes, conciliaciones, cierres y recordatorios.
- **Operaciones y planta:** reportes diarios, alertas por indicadores fuera de rango y control de turnos.
- **Logística y compras:** requisiciones, órdenes de compra y seguimiento a proveedores.
- **Recursos humanos:** ingresos de personal, solicitudes de vacaciones y comunicaciones internas.
- **Áreas comerciales:** consolidado de reportes de tiendas o vendedores y seguimiento de pedidos.

En todas se repite el mismo patrón: información que llega por correo o en Excel, que alguien tiene que mover, revisar o reenviar. Ese patrón es el que el curso enseña a automatizar, módulo a módulo, hasta terminar con un flujo propio publicado y documentado.

## Cómo saber si valió la pena

Antes de automatizar, anota cuánto tiempo toma la tarea, cuántas veces se hace a la semana y cuántas personas participan. Después, mide cuánto toma revisar el resultado del flujo. Esa diferencia es el ahorro, y es la mejor forma de convencer a tu jefatura de seguir automatizando. El proyecto final del curso termina justamente con la presentación del ahorro logrado.

## Errores que conviene evitar

- **Automatizar un proceso que nadie entiende del todo.** Dibuja el proceso antes de construirlo.
- **No prever excepciones.** Un archivo que no llega, un correo sin adjunto, un valor vacío: el flujo debe saber qué hacer.
- **Depender de una persona.** Documenta y comparte cada flujo.
- **Saturar con avisos.** Prefiere resúmenes a notificaciones sueltas.

## Ruta de 30 días

**Semana 1:** escoge una tarea frecuente y sencilla. **Semana 2:** constrúyela como flujo de nube y pruébala. **Semana 3:** agrega condiciones, manejo de errores y un resumen. **Semana 4:** ponla en marcha, documéntala y presenta el ahorro. Luego pasa a la siguiente tarea de tu lista.

## De la automatización al análisis

Con los archivos llegando ordenados, armar un tablero es mucho más simple. Para esa parte puedes revisar el [curso de Power BI en Perú](https://www.programbi.com/pe/cursos/power-bi) y la [guía para aprender Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru). Y si trabajas mucho con planillas, el [curso de Excel](https://www.programbi.com/pe/cursos/excel) complementa bien.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Horario desde Perú

Las clases son de 17:30 a 19:30 en Lima. Perú se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano, por eso la ficha indica que la clase se ve a las 17:30 cuando Chile está en verano y a las 18:30 en invierno. La ficha de cada cohorte muestra la hora exacta, y las sesiones quedan grabadas para siempre.

## Resumen

- 20 horas, 10 módulos, sin programar.
- En vivo por Zoom; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida, certificado digital y proyecto final real.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Power Automate en Perú?**
{precio_local}, en soles con Mercado Pago Perú, Yape, Plin o transferencia.

**¿Es necesario saber programar?**
No. Es un curso no-code para quienes usan Excel, Outlook y Teams.

**¿Puedo automatizar el envío de reportes de planta?**
Sí. Con un flujo que detecta el archivo nuevo, arma un resumen y lo envía por correo y Teams.

**¿Qué es el RPA de escritorio?**
Automatización que imita a una persona usando programas sin conector. Se ve en el módulo 9 con Power Automate Desktop.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos con fecha por confirmar; consulta por WhatsApp.

**¿Hay certificado?**
Sí, certificado digital de ProgramBI al completar el curso.

**¿Puedo usar Copilot para diseñar los flujos?**
Sí. En el módulo 4 aprendes a describir lo que quieres en lenguaje natural para que Copilot proponga el flujo, y luego lo revisas y ajustas a tu proceso.
