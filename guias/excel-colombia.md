---
slug: curso-excel-colombia
ruta_sugerida: /co/guias/curso-excel-colombia
pais: co
hreflang: es-CO
curso: excel
url_curso: https://www.programbi.com/co/cursos/excel
title: "Curso de Excel en Colombia en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Colombia: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, 17:30. Temario y ejemplos con datos colombianos."
h1: "Curso de Excel en Colombia: Excel online y en vivo para el trabajo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/excel
  - https://www.programbi.com/co/cursos/power-bi
  - https://www.programbi.com/co/cursos/sql-server
  - https://www.programbi.com/co/cursos/analisis-de-datos
  - https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1489_2017.htm
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «BUSCARV vs. BUSCARX vs. INDICE+COINCIDIR» + bloque «En 30 segundos».
  Intención: "curso Excel online en vivo Colombia", "curso Excel Colombia", "aprender Excel desde cero" → click_registro en /co/cursos/excel. country=co, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × co. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 17:30 a 19:30, hora de Colombia sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Colombia en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Colombia: Excel online y en vivo para el trabajo

**Respuesta corta:** el [curso de Excel de ProgramBI para Colombia](https://www.programbi.com/co/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **17:30 a 19:30, hora de Colombia**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendes?** De las bases a lo que filtran los reclutadores en Colombia: BUSCARX e INDICE-COINCIDIR, tablas dinámicas para cartera y facturación, funciones de fecha y texto, y Power Query para importar planos sin dañar cédulas ni NIT. En el trabajo diario, eso significa informes semanales que se actualizan solos y menos errores de copiado.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30, hora de Colombia · «Ver el curso».

## Por qué vale la pena dominar Excel en Colombia

En Colombia, Excel es la herramienta común entre áreas que casi no se hablan: cartera lo usa para seguir la mora, facturación para cuadrar glosas, talento humano para la nómina y comercial para el presupuesto de ventas. En bancos, EPS, cajas de compensación y empresas de servicios, la diferencia entre una persona que «sabe Excel» y otra que lo domina se mide en horas por semana.

Las vacantes lo saben: «Excel intermedio» o «avanzado» aparece en la mayoría de los avisos administrativos y financieros, y muchos procesos de selección incluyen una prueba práctica.

## Lo que más se pide en oficinas colombianas

En una prueba de Excel para un cargo administrativo o financiero en Colombia, lo habitual es pedir una tabla dinámica, un cruce con BUSCARV o BUSCARX y una fórmula condicional. Quien además importa planos con Power Query sin romper las cédulas, y deja el informe listo para actualizarse, se diferencia claramente. Es una habilidad muy valorada en bancos, EPS, cajas de compensación y empresas de servicios.

## Fórmulas clave, con ejemplos de Colombia

- **Cartera vencida de una ciudad**: `=SUMAR.SI.CONJUNTO(Cartera[Saldo];Cartera[Ciudad];"Medellín";Cartera[Días mora];">30")`
- **Traer el nombre del afiliado por cédula**: `=BUSCARX([@Cédula];Afiliados[Cédula];Afiliados[Nombre];"No existe")`
- **Clasificar por rango de mora**: `=SI([@Días]<=30;"0-30";SI([@Días]<=60;"31-60";SI([@Días]<=90;"61-90";"+90")))`
- **Calcular el IVA de un valor** (tarifa general del 19 %, según el [Oficio 1489 de 2017 de la DIAN](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_1489_2017.htm)): `=[@Base]*19%`
- **Contar autorizaciones por EPS**: `=CONTAR.SI.CONJUNTO(Autorizaciones[EPS];[@EPS])`

**Un detalle local: cédulas y NIT.** Si una columna de cédulas se guarda como número, Excel puede mostrarla en notación científica o quitarle ceros; y el NIT a veces llega con el dígito de verificación pegado («900123456-7»). Guárdalos como texto y separa el dígito con `=IZQUIERDA(A2;HALLAR("-";A2)-1)` antes de cruzar.

## Funciones de fecha que salvan el cierre

En cartera, nómina y facturación, las fechas mandan. Estas funciones resuelven la mayoría de los casos:

- **HOY()** para calcular días de mora sin actualizar la fecha a mano.
- **DIAS.LAB()** para contar días hábiles entre radicación y respuesta, excluyendo una lista de festivos que mantienes en otra hoja.
- **FIN.MES()** para obtener el último día del mes y armar cortes de cartera.
- **TEXTO(fecha;"mmmm")** para mostrar el nombre del mes en un informe.
- **SIFECHA()** para calcular antigüedad en años o meses, útil en talento humano.

Combinadas con una tabla dinámica, te permiten responder «¿cuánto llevamos vencido a corte de mes?» sin rehacer el informe. Vale la pena mantener la lista de festivos colombianos actualizada en una hoja aparte para que DIAS.LAB no cuente días que no se trabajan.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos colombianos.

## Caso: el reporte que se arma solo con Power Query

Una analista de cartera en una cooperativa de Bogotá arma cada semana el informe de mora por oficina. Antes descargaba el plano del sistema, lo pegaba en Excel, corregía cédulas y armaba la tabla dinámica a mano. Con Power Query, la consulta lee el plano directamente, convierte las cédulas a texto, separa columnas y carga la tabla limpia. La tabla dinámica de mora por oficina y rango se actualiza con un clic. El informe que tomaba medio día ahora sale en minutos, sin errores de copiado.

## Tablas dinámicas para cartera y facturación

En cartera y facturación, la tabla dinámica responde las preguntas del comité: saldo por rango de mora, facturación por EPS, glosas por causal. Para que funcione bien, la base tiene que tener una fila por registro y las cédulas como texto. Agrupa los días de mora en rangos, agrega segmentaciones por oficina o ciudad y muestra el resultado como porcentaje del total cuando el comité quiera ver participación. Una tabla dinámica bien armada reemplaza decenas de SUMAR.SI.

## Errores frecuentes en planillas colombianas

- **Cédulas en notación científica** porque se guardaron como número.
- **NIT con el dígito de verificación pegado** que no cruza con otras tablas.
- **Planos mal separados** al abrirlos con doble clic en vez de importarlos.
- **Rangos de mora calculados a mano** en lugar de una fórmula o un agrupamiento.
- **Informes semanales rehechos desde cero** cuando Power Query podría actualizarlos.

## De Excel a Power BI: el paso siguiente

Cuando el informe de cartera o facturación ya se actualiza con Power Query, Power BI te permite llevarlo a un tablero que el comité consulta en línea, con filtros por oficina y ciudad. Revisa el [curso de Power BI](https://www.programbi.com/co/cursos/power-bi) y la [guía de Power BI para Colombia](/co/guias/como-aprender-power-bi-en-colombia). Si quieres extraer datos tú mismo, el [curso de SQL Server](https://www.programbi.com/co/cursos/sql-server); y para el perfil completo, el [curso de Análisis de datos](https://www.programbi.com/co/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Toma el informe de cartera de un mes, conviértelo en Tabla y arma una tabla dinámica por oficina y rango de mora. Agrega con BUSCARX el nombre del asesor desde el maestro, con las cédulas como texto. Si el total cuadra con el reporte oficial, tienes un informe que se actualiza en minutos y una prueba concreta de lo que sabes hacer para mostrar en una entrevista.

## Dónde se pide Excel en Colombia

En Computrabajo, elempleo.com, Magneto y LinkedIn, Excel aparece en vacantes de auxiliar contable, analista de cartera, analista de facturación, auxiliar de nómina y asistente administrativo. Escribe en tu hoja de vida qué sabes hacer («tablas dinámicas, BUSCARX, Power Query») en lugar de solo «Excel avanzado»: los filtros buscan esas palabras.

## Plan de práctica de cuatro semanas

- **Semana 1:** importa un plano con Power Query y deja las cédulas como texto.
- **Semana 2:** clasifica la cartera por rango de mora y suma por oficina.
- **Semana 3:** arma la tabla dinámica del comité con segmentaciones por ciudad.
- **Semana 4:** automatiza el informe semanal completo y compáralo con el manual.

## Qué revisar al elegir un curso de Excel en Colombia

Que sea en vivo y en hora colombiana, que incluya Power Query y tablas dinámicas avanzadas, que trabaje con casos como cartera o facturación, que deje las clases grabadas y que termine con un proyecto para tu hoja de vida.

## El curso de Excel en vivo de ProgramBI (Colombia)

Datos de la [ficha del curso para Colombia](https://www.programbi.com/co/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **17:30 a 19:30, hora de Colombia**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30, hora de Colombia · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Colombia?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 17:30 a 19:30, hora de Colombia. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para cartera o facturación en salud?**
Sí. Tablas dinámicas, BUSCARX y Power Query son las herramientas que más se usan para seguir mora, glosas y facturación.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tu empresa usa una anterior, se trabaja con INDICE-COINCIDIR, incluido en el temario.

**¿Después puedo pasar a Power BI?**
Sí. Power Query funciona igual en Excel y en Power BI.
