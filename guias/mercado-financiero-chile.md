---
slug: curso-mercado-financiero-chile
ruta_sugerida: /guias/curso-mercado-financiero-chile
pais: cl
hreflang: es-CL
curso: mercado-financiero
url_curso: https://www.programbi.com/cursos/mercado-financiero
title: "Curso de Mercado Financiero en Chile: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Chile en vivo: carteras con Python, SQL, Power BI e IA en 30 h. Riesgo, retorno, dólar observado y dashboards."
h1: "Curso de Mercado Financiero en Chile: analiza carteras con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/mercado-financiero
  - https://www.bcentral.cl/
  - https://www.cmfchile.cl/
  - https://www.bolsadesantiago.com/
nota_hermes: |
  ELEMENTO VISUAL: diagrama del flujo «Banco Central / Yahoo Finance → Python → SQL → Power BI con narrativa IA» + bloque «En 30 segundos».
  Intención: "curso mercado financiero Chile", "curso análisis de carteras / finanzas con Python Chile" → click_registro en /cursos/mercado-financiero. country=cl, course=mercado-financiero.
  - PRECIO: 349.000 CLP confirmado por Manu (4 nov 2026). Léelo igual como {precio_local} desde config/pricing.ts (clave mercado-financiero × cl) para no desalinear guía, ficha, Offer y checkout.
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 19:30 a 21:30, hora de Chile sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Chile en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Chile: analiza carteras con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Chile](https://www.programbi.com/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **19:30 a 21:30, hora de Chile**, el valor es **$349.000 CLP** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**¿Para quién es?** Para profesionales del área financiera y contable, o que quieren trabajar en control de gestión financiera, según la ficha. Si hoy armas reportes de cartera en Excel, aquí aprendes a automatizarlos de punta a punta.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Chile · «Ver el curso».

## Por qué este curso tiene sentido en Chile

En Chile, el análisis de carteras vive en AGF, corredoras de bolsa, compañías de seguros, family offices y en las tesorerías de empresas grandes. Buena parte de ese trabajo sigue siendo manual: descargar precios, pegar el dólar del día, recalcular la valorización en una planilla y armar el informe para el comité de inversiones. Cuando la cartera mezcla acciones locales, fondos extranjeros y caja en pesos y dólares, la planilla se vuelve frágil y cualquier error de fecha o de tipo de cambio cambia el resultado.

Este curso existe para automatizar ese flujo: que los precios y el tipo de cambio se actualicen solos, que el riesgo se calcule con métricas estándar y que el dashboard cuente la historia sin que tengas que reescribirla cada mes.

## El ecosistema que vas a consultar

- **Banco Central de Chile** ([bcentral.cl](https://www.bcentral.cl/)): publica series económicas y financieras, incluido el tipo de cambio, que en el curso se usan como fuente diaria.
- **Comisión para el Mercado Financiero** ([cmfchile.cl](https://www.cmfchile.cl/)): el regulador; publica información de entidades fiscalizadas, fondos y emisores.
- **Bolsa de Santiago** ([bolsadesantiago.com](https://www.bolsadesantiago.com/)): información de instrumentos y mercado local.

Conocer de dónde sale cada dato es parte del trabajo: en un informe al comité, cada cifra debe poder rastrearse hasta su fuente.

## El temario en cinco etapas

1. **Arranque (4 h).** Preparas el entorno de trabajo con Python, Jupyter, SQL y Power BI, repasas tipos de activos y fuentes de datos financieros, y ves casos de banca, corredoras, fondos y seguros.
2. **Base de datos de carteras (5 h).** Diseñas tablas de carteras, posiciones y operaciones; consultas con joins y funciones de ventana; vistas de exposición por activo, sector y moneda.
3. **Análisis cuantitativo en Python (8 h).** pandas, numpy y yfinance para retornos, volatilidad, VaR histórico y paramétrico, drawdown, beta, correlaciones, introducción a derivados y rebalanceo; la IA apoya con anomalías y clustering.
4. **Visualización (7 h).** Power BI con medidas DAX financieras, mapas de calor, treemaps, desempeño contra benchmark, P&L y narrativa generada con IA.
5. **Proyecto final (6 h).** Un Trabajo Aplicado Integrador, individual o en dupla, obligatorio para certificar.

## Un ejemplo de código como los del curso

```python
import yfinance as yf
import pandas as pd

# Acciones locales en Yahoo Finance llevan el sufijo .SN
tickers = ["SQM-B.SN", "CHILE.SN", "FALABELLA.SN"]
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
vol_anual = retornos.std() * (252 ** 0.5)
```

Después cruzas esas series con el tipo de cambio del Banco Central para valorizar en pesos una cartera que tiene posiciones en dólares, y guardas todo en SQL para que Power BI lo lea.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Una analista de middle office en una AGF de Santiago prepara cada mañana la valorización de diez carteras de clientes. Antes: bajar precios, copiar el dólar, actualizar fórmulas y revisar que nada se rompiera; casi dos horas. Con el flujo del curso, un script de Python baja precios y tipo de cambio, los carga en SQL Server, una vista calcula la valorización por cartera y Power BI muestra P&L, exposición por moneda y top holdings, con una narrativa generada por IA que resume qué movió el resultado. Su mañana ahora empieza revisando alertas, no pegando datos.

## Las métricas de riesgo, explicadas para el comité

Cuando presentes una cartera ante un comité de inversiones en Santiago, te van a preguntar lo mismo de siempre: cuánto rindió, cuánto se movió y cuánto podría perder. El curso traduce esas preguntas a métricas concretas. La **volatilidad** anualizada resume cuánto oscilan los retornos. El **VaR** (histórico o paramétrico) estima la pérdida que no debería superarse con cierto nivel de confianza en un horizonte dado. El **drawdown** mide la caída desde el último máximo, algo que un cliente entiende de inmediato. La **beta** indica cuánto se mueve una acción respecto de un índice de referencia, y la matriz de **correlaciones** muestra si la diversificación es real o solo aparente.

Lo valioso es calcularlas siempre igual, con la misma ventana y la misma fuente, para que el informe de este mes sea comparable con el del mes pasado.

## Errores típicos en los reportes de cartera

- **Mezclar fechas**: precios de cierre de un día con un tipo de cambio de otro. En un flujo automatizado la fecha es una columna, no una suposición.
- **Valorizar todo en una sola moneda** sin mostrar la exposición al dólar, lo que esconde el riesgo cambiario de la cartera.
- **Copiar y pegar gráficos** en la presentación cada mes en lugar de conectar Power BI a la base.
- **Calcular retornos simples y logarítmicos indistintamente**, lo que hace que las cifras no cuadren entre informes.
- **No documentar las fuentes**: si la CMF o un auditor pregunta de dónde salió un dato, la respuesta debe estar en el modelo.

## Dónde se usa esto en Chile

En LinkedIn, Laborum y en los sitios de carrera de bancos, AGF, corredoras y aseguradoras aparecen cargos como analista de inversiones, analista de riesgo financiero, analista de middle office, analista de control de gestión financiera y analista de tesorería. Muchos piden Excel avanzado más Python, SQL o Power BI: justo la combinación del curso.

## Plan para aplicar el curso en tu pega

1. **Semana 1:** identifica el reporte que más tiempo te consume (valorización diaria, informe mensual o control de límites).
2. **Semana 2:** lleva sus datos a SQL con la estructura de carteras, posiciones y operaciones que se ve en el módulo 2.
3. **Semana 3:** automatiza con Python la descarga de precios y del dólar, y calcula retornos y volatilidad.
4. **Semana 4:** publica el dashboard en Power BI y suma la narrativa con IA.

Si eliges ese reporte como tu Trabajo Aplicado Integrador, terminas el curso con algo que ya funciona en tu trabajo.

## Dónde entra la IA (y dónde no)

La ficha incluye IA en cada módulo, pero con un rol claro: asistir, no decidir. En el flujo de una AGF o corredora chilena, la IA sirve para tres cosas concretas. Primero, **detectar anomalías**: un precio que saltó por un error de carga o una posición que no cuadra con el custodio. Segundo, **agrupar activos** con comportamiento similar mediante clustering, útil para revisar si la diversificación es real. Tercero, **redactar el primer borrador** del comentario mensual a partir de las métricas del tablero.

Lo que la IA no hace es reemplazar tu criterio: cada alerta se revisa y cada párrafo se edita antes de llegar al comité o al cliente. Esa disciplina es la que se practica en el curso.



## Cómo se conecta con otros cursos

Si quieres reforzar una pieza antes de este programa, tienes el [curso de Python](https://www.programbi.com/cursos/python), el [curso de SQL Server](https://www.programbi.com/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/cursos/power-bi), además de la [guía de Power BI en Chile](/guias/como-aprender-power-bi-en-chile).

## El curso en vivo de ProgramBI (Chile)

Según la [ficha del curso para Chile](https://www.programbi.com/cursos/mercado-financiero), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **19:30 a 21:30, hora de Chile**. Cupos abiertos · próxima fecha en consulta.
- **30 horas en 5 módulos**, con Trabajo Aplicado Integrador obligatorio para certificar.
- Datasets, scripts base, plantillas de Power BI y prompts de IA incluidos.
- **Grabaciones de por vida** y **certificado**.
- Valor: **$349.000 CLP**. Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Chile · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Chile?**
El valor es $349.000 CLP por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 19:30 a 21:30, hora de Chile, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Me sirve si trabajo en una AGF, corredora o compañía de seguros?**
Sí. Los casos del curso incluyen banca, corredoras, AGF y seguros, según la ficha.

**¿Se usa el tipo de cambio oficial?**
El curso trabaja con tipos de cambio diarios de bancos centrales; en Chile, la fuente es el Banco Central de Chile.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
