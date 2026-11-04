---
slug: curso-power-automate-chile
ruta_sugerida: /guias/curso-power-automate-chile
pais: cl
hreflang: es-CL
curso: power-automate
url_curso: https://www.programbi.com/cursos/power-automate
title: "Curso de Power Automate en Chile: guía 2026 | ProgramBI"
meta: "Curso de Power Automate en Chile en vivo por Zoom: 20 h para automatizar Outlook, Teams, Excel y SharePoint sin programar, por $169.000 CLP. Incluye RPA y Copilot."
h1: "Curso de Power Automate en Chile: automatiza tu pega sin programar"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/power-automate
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «nube vs. programado vs. instantáneo vs. RPA de escritorio» (cuándo usar cada uno) + bloque «En 30 segundos».
  Intención: "curso power automate chile", "cursos power automate en vivo" → click_registro en /cursos/power-automate. country=cl, course=power-automate.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026). Léelo igual como {precio_local} desde config/pricing.ts (clave power-automate × cl) para no desalinear guía, ficha, Offer y checkout.
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La guía menciona que el módulo 2 cubre licencia M365 sin afirmar qué plan se necesita.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Power Automate para Chile en programbi.com y quiero info del curso en vivo".
---

# Curso de Power Automate en Chile: automatiza tu pega sin programar

**Respuesta corta:** el [curso de Power Automate de ProgramBI](https://www.programbi.com/cursos/power-automate) es un programa **en vivo por Zoom de 20 horas en 10 módulos** para automatizar tareas repetitivas **sin escribir código**: flujos de nube automatizados, instantáneos y programados; conectores con Outlook, Teams, OneDrive y SharePoint; aprobaciones; RPA de escritorio con Power Automate Desktop y Copilot para diseñar flujos con IA. Cuesta **$169.000 CLP** y las clases son de **19:30 a 21:30, hora de Chile**.

Está pensado para **profesionales sin experiencia en programación** que pierden horas copiando datos entre Excel, Outlook y Teams. La ficha, revisada el 4 de noviembre de 2026, muestra **cupos abiertos con fecha por confirmar**, e incluye grabaciones de por vida y certificado.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Chile) · «Ver el curso».

## El problema que resuelve

Haz la prueba: anota durante una semana cada tarea que repites igual. Descargar el adjunto de un correo y guardarlo en una carpeta. Avisarle al jefe que llegó una solicitud. Copiar una fila de Excel a otro sistema. Mandar el mismo recordatorio todos los lunes. Pedir la firma de una cotización por correo y perseguirla tres días.

Ninguna toma mucho, pero juntas se comen horas de la semana. Power Automate existe para eso: le dices a Microsoft 365 "cuando pase esto, haz aquello" y lo hace solo, todas las veces, sin olvidarse. Si en tu pega usas Outlook, Teams, Excel y SharePoint, ya tienes casi todo lo necesario.

## Los 10 módulos, en simple

1. **Automatización y NoCode (1 h).** Qué se puede automatizar y por qué el NoCode cambió las reglas.
2. **Primeros pasos (2 h).** La Power Platform, diferencias entre Power Automate en la nube y Desktop, tipos de flujo, licencia de Microsoft 365, plantillas y conexiones.
3. **Crear un flujo desde cero (3 h).** Flujos automáticos, instantáneos y programados; contenido dinámico, condiciones, manejo de errores, ejecuciones en paralelo.
4. **IA generativa en Power Automate (1 h).** Crear flujos describiéndolos en lenguaje natural con Copilot.
5. **Expresiones, variables y funciones lógicas (3 h).** Manipular textos y fechas, `split`, `substring`, tablas CSV y HTML, Parse JSON y bucles.
6. **Bibliotecas de documentos (2 h).** Guardar adjuntos en OneDrive y avisar cuando cambia un archivo.
7. **Aprobaciones (2 h).** Flujos de aprobación sobre documentos y solicitudes.
8. **Teams y correo (2 h).** Notificaciones automáticas, extraer texto de mensajes y obtener datos de destinatarios.
9. **RPA con Power Automate Desktop (2 h).** Grabadora, selectores, automatizar Excel y aplicaciones de escritorio, y el caso típico: traspasar datos de Excel a un ERP o una web.
10. **Proyecto final (2 h).** Eliges un proceso real de tu trabajo, lo automatizas de punta a punta y lo publicas con monitoreo y documentación.

## Tres flujos que podrías tener funcionando en un mes

**Facturas que llegan por correo.** Cada vez que entra un correo con adjunto PDF de un proveedor, el flujo guarda el archivo en una carpeta de SharePoint ordenada por mes, registra remitente, fecha y asunto en una lista de Excel y avisa a contabilidad por Teams. Nadie más tiene que bajar adjuntos a mano.

**Aprobación de compras.** Alguien completa un formulario con la solicitud; el flujo le manda la aprobación a la jefatura correspondiente, espera la respuesta, anota el resultado y avisa al solicitante. Se acabó el "¿viste mi correo?".

**El reporte del lunes.** Un flujo programado toma el Excel actualizado, arma una tabla HTML con los números clave y la envía por correo al equipo todos los lunes a las 8:00.

## Cómo se ve un flujo por dentro

Un flujo de Power Automate tiene siempre la misma estructura:

- **Desencadenador:** el evento que lo inicia. Llega un correo, se crea un archivo, es lunes a las 8:00, alguien aprieta un botón.
- **Acciones:** lo que hace. Guardar, copiar, enviar, pedir aprobación.
- **Condiciones:** las reglas. Si el monto supera cierto valor, va a gerencia; si no, a jefatura.

Todo se arma en un diseñador visual, arrastrando bloques. Cuando necesitas algo más fino, como extraer el número de una orden desde el asunto de un correo, entran las expresiones del módulo 5, que funcionan de forma parecida a las fórmulas de Excel.

## Nube o escritorio: cuál usar

| Situación | Herramienta |
|---|---|
| El proceso vive en Outlook, Teams, SharePoint o OneDrive | Flujo de nube |
| Necesitas que pase solo, a una hora fija | Flujo programado |
| Quieres lanzarlo con un botón | Flujo instantáneo |
| El sistema no tiene conector y solo se usa desde el PC | RPA con Power Automate Desktop |

Esa última fila es clave en muchas empresas chilenas que conviven con sistemas antiguos: si un ERP o un portal solo se puede usar "a mano", el RPA de escritorio puede imitar los clics y el tecleo.

## ¿Es para ti?

Sí, si cumples al menos dos de estas:

- Usas Outlook, Teams o Excel todo el día.
- Haces las mismas tareas cada semana.
- Persigues aprobaciones por correo.
- Copias datos de un sistema a otro.

No necesitas saber programar: la ficha lo define como un curso no-code. Lo que sí necesitas es una cuenta de Microsoft 365 para practicar; el módulo 2 explica la licencia y cómo inicializar Power Automate.

## Cómo elegir el primer proceso a automatizar

No todos los procesos valen la pena. Un buen candidato cumple estas cuatro condiciones:

1. **Se repite seguido.** Diario o semanal, no una vez al año.
2. **Sigue reglas claras.** Si la decisión depende de "ver cómo viene la cosa", es difícil automatizarla.
3. **Usa herramientas digitales.** Correo, Excel, Teams, SharePoint o un sistema al que se pueda llegar por RPA.
4. **Duele.** Alguien se queja de él, o se olvida y genera problemas.

Un ejercicio útil antes del curso: haz una lista de cinco tareas que repites, estima cuánto tiempo te toma cada una a la semana y ordénalas. La primera de la lista es probablemente tu proyecto final. Llegar con eso definido hace que cada módulo tenga un uso inmediato, porque vas aplicando lo que aprendes sobre un caso tuyo.

## Errores típicos al automatizar

- **Automatizar un proceso desordenado.** Si nadie sabe bien cómo se hace a mano, el flujo heredará el desorden. Primero dibuja el proceso.
- **No manejar errores.** Un flujo que falla en silencio es peor que no tenerlo. El curso ve revisión de errores, reintentos y monitoreo.
- **Depender de una sola cuenta personal.** Si el flujo vive en tu cuenta y te vas de vacaciones, nadie sabe cómo arreglarlo. Documenta y comparte.
- **Querer automatizar todo de una vez.** Empieza con un flujo pequeño que ahorre tiempo real y crece desde ahí.

## Power Automate y Power BI, una buena dupla

Muchas veces el dato que alimenta un tablero llega por correo o en un Excel que alguien sube a mano. Power Automate puede encargarse de esa parte: guardar el archivo en el lugar correcto para que el tablero se actualice. Si además quieres construir esos tableros, mira el [curso de Power BI](https://www.programbi.com/cursos/power-bi) y la [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile). Y si trabajas mucho con planillas, el [curso de Excel](https://www.programbi.com/cursos/excel) es buen complemento.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Lo que te llevas

Al terminar no sales con una demo suelta: sales con una automatización real, publicada, de tu propio trabajo, con monitoreo y documentación. En la entrevista o en la evaluación de desempeño, poder decir "automaticé este proceso y ahora toma minutos en vez de horas" pesa mucho más que un certificado.

## Ficha del curso en Chile

Según la [ficha](https://www.programbi.com/cursos/power-automate), consultada el 4 de noviembre de 2026:

- **20 horas en 10 módulos**, no-code.
- **En vivo por Zoom**, de 19:30 a 21:30, hora de Chile; cupos abiertos y fecha por confirmar.
- **Grabaciones de por vida** y **certificado digital**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Valor: **$169.000 CLP**.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — $169.000 CLP · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Power Automate en Chile?**
$169.000 CLP por las 20 horas en vivo, con grabaciones de por vida y certificado.

**¿Necesito saber programar?**
No. Es un curso no-code: conectores, condiciones y Copilot.

**¿Power Automate es lo mismo que RPA?**
Power Automate incluye flujos en la nube y RPA de escritorio; en el curso ves ambos.

**¿Qué necesito para practicar?**
Una cuenta de Microsoft 365. En el módulo 2 se revisa la licencia y cómo activar Power Automate.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos con fecha por confirmar; puedes consultarla por WhatsApp.

**¿Sirve si mi empresa usa un ERP antiguo sin conectores?**
Sí. El módulo 9 enseña RPA con Power Automate Desktop, que imita clics y tecleo, justamente para traspasar datos de Excel a un ERP o a una web.
