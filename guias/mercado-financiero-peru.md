---
slug: curso-mercado-financiero-peru
ruta_sugerida: /pe/guias/curso-mercado-financiero-peru
pais: pe
hreflang: es-PE
curso: mercado-financiero
url_curso: https://www.programbi.com/pe/cursos/mercado-financiero
title: "Curso de Mercado Financiero en Perú: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Perú en vivo: carteras con Python, SQL, Power BI e IA en 30 h a las 17:30 Lima. Riesgo, retorno y dashboards."
h1: "Curso de Mercado Financiero en Perú: analiza portafolios con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/pe/cursos/mercado-financiero
  - https://www.bcrp.gob.pe/
  - https://www.smv.gob.pe/
  - https://www.bvl.com.pe/
nota_hermes: |
  ELEMENTO VISUAL: diagrama del flujo «BCRP / Yahoo Finance → Python → SQL → Power BI» + bloque «En 30 segundos».
  Intención: "curso mercado financiero Perú", "curso análisis de carteras / finanzas con Python Perú" → click_registro en /pe/cursos/mercado-financiero. country=pe, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × pe. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 17:30 a 19:30, hora de Perú sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Perú: analiza portafolios con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Perú](https://www.programbi.com/pe/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **17:30 a 19:30, hora de Perú**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**¿A quién apunta?** La ficha lo dirige a profesionales financieros y contables. Encaja si pasas horas actualizando planillas de inversiones y quieres que ese trabajo corra solo.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30, hora de Perú · «Ver el curso».

## Por qué este curso tiene sentido en Perú

En Perú, el análisis de portafolios se hace en AFP, sociedades agentes de bolsa, administradoras de fondos, aseguradoras, bancos y tesorerías corporativas que manejan soles y dólares. En muchos equipos el reporte de cartera todavía se arma en Excel: precios descargados, tipo de cambio copiado, rendimientos recalculados y gráficos pegados en una presentación. Con carteras que combinan renta fija, acciones locales y extranjeras, ese proceso es lento y frágil.

Este curso te enseña a automatizarlo con Python, SQL y Power BI, y a usar IA para detectar anomalías y redactar la narrativa del informe.

## Instituciones y fuentes clave

- **Banco Central de Reserva del Perú** ([bcrp.gob.pe](https://www.bcrp.gob.pe/)): publica estadísticas económicas y series de tipo de cambio.
- **Superintendencia del Mercado de Valores** ([smv.gob.pe](https://www.smv.gob.pe/)): el regulador del mercado de valores.
- **Bolsa de Valores de Lima** ([bvl.com.pe](https://www.bvl.com.pe/)): información del mercado local.

Citar la fuente y la fecha de cada serie es parte de un informe profesional.

## Lo que cubre el programa

Las 30 horas se reparten en cinco bloques. Los primeros cuatro horas sientan las bases: entorno técnico, tipos de datos financieros y cómo se organiza una cartera. Le siguen cinco horas de **SQL**, donde modelas carteras, posiciones y operaciones y construyes vistas de exposición con funciones de ventana. El bloque más largo, ocho horas, es **Python**: descarga de precios con yfinance, tipos de cambio de bancos centrales, retornos, volatilidad, VaR, drawdown, beta, correlaciones, rebalanceo y usos de IA para detectar anomalías. Luego vienen siete horas de **Power BI**, con DAX aplicado a finanzas, P&L, mapas de calor y narrativa automática. Las últimas seis horas son para el **Trabajo Aplicado Integrador**, requisito de la certificación.

## Un ejemplo de código como los del curso

```python
import yfinance as yf

# Acciones de la BVL en Yahoo Finance llevan el sufijo .LM
tickers = ["BAP", "SCCO", "BVN"]   # también puedes probar emisoras locales con .LM
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
correl = retornos.corr()
```

Con el tipo de cambio del BCRP conviertes posiciones en dólares a soles y dejas todo en SQL para el tablero.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Una analista de inversiones de una aseguradora en Lima prepara cada semana el informe de la cartera de inversiones para el comité. Antes: archivos de custodios, precios copiados y tipo de cambio pegado a mano. Con el flujo del curso, Python actualiza precios y tipo de cambio, calcula retornos, volatilidad y correlaciones; SQL guarda posiciones; y Power BI muestra composición por moneda, emisor y sector con una narrativa automática. El comité recibe el informe a tiempo y con trazabilidad de cada dato.

## Las métricas que te va a pedir el comité

En las AFP, aseguradoras y SAB peruanas, el informe de inversiones combina rendimiento y riesgo. El curso cubre ambos lados. Calcularás **retornos** diarios y acumulados, **volatilidad** anualizada, **VaR** histórico y paramétrico, **drawdown** máximo, **beta** frente a un índice y **correlaciones** entre activos. Además, aprenderás a mostrar la **exposición por moneda**, clave cuando la cartera mezcla soles y dólares.

En Power BI, esas métricas se convierten en tarjetas, mapas de calor y gráficos de desempeño contra benchmark, con filtros por emisor, sector y moneda. Y la IA redacta un primer borrador del comentario del periodo, que tú revisas y ajustas.

## Errores comunes en reportes de inversiones

- **Precios de distintas fuentes** sin conciliar, que generan diferencias con el custodio.
- **Tipo de cambio mal fechado** al convertir posiciones en dólares a soles.
- **Emisoras locales con poca liquidez** cuyos precios no se actualizan a diario y afectan la volatilidad.
- **Informes sin trazabilidad**: nadie sabe qué versión del archivo se presentó.
- **Gráficos estáticos** que obligan a rehacer la presentación cuando el comité pide otro corte.

## Dónde se usa esto en Perú

En LinkedIn, Computrabajo, Bumeran y los portales de AFP, bancos, SAB y aseguradoras aparecen vacantes de analista de inversiones, analista de riesgos, analista de tesorería y analista financiero. Las más técnicas piden Python, SQL o Power BI, además de Excel avanzado.

## Ruta para aplicar lo aprendido en tu chamba

1. **Escoge un informe** recurrente que hoy armes en Excel.
2. **Lleva sus datos** a SQL Server con tablas de carteras, posiciones, operaciones y precios.
3. **Automatiza** con Python la descarga de precios y tipo de cambio, y el cálculo de métricas.
4. **Publica** el tablero en Power BI y agrega la narrativa automática.

Usar ese informe como Trabajo Aplicado Integrador te permite terminar el curso con una solución lista para tu equipo.

## Cómo te ayuda la IA en el día a día

El curso integra inteligencia artificial en todos sus módulos. En una AFP, SAB o aseguradora peruana, eso significa: revisar automáticamente las series cargadas para encontrar precios atípicos; generar consultas SQL a partir de una pregunta escrita; agrupar activos por comportamiento para evaluar la diversificación; y preparar un primer borrador del comentario de inversiones del mes.

Nada de eso reemplaza tu revisión. Se trabaja con una regla clara: cada sugerencia de la IA se verifica contra los datos y cada texto se corrige antes de presentarlo. Así el informe llega antes al comité y con la misma calidad.

## El tablero que construirás

En el módulo 4 diseñas un tablero de Power BI listo para un comité de inversiones peruano. La primera página resume valor, rendimiento y diferencia contra benchmark. La segunda muestra el riesgo: volatilidad, VaR y drawdown, con su historia. La tercera desglosa la exposición por moneda (soles y dólares), emisor y sector, con mapas de calor. La cuarta presenta el P&L del periodo. Y la quinta reúne la narrativa generada con IA, que revisas antes de publicar.

Gracias a las plantillas incluidas, adaptas esa estructura a tus propios datos en lugar de diseñar desde cero.

## Antes de inscribirte

Te irá mejor si manejas Excel con soltura y conoces conceptos básicos de inversiones. No necesitas ser programador, porque el curso entrega scripts base, pero sí conviene repasar fundamentos de Python antes de empezar: en 30 horas se recorren cuatro herramientas y el ritmo es intenso.

## Cómo se conecta con otros cursos

Si quieres reforzar una pieza antes de este programa, tienes el [curso de Python](https://www.programbi.com/pe/cursos/python), el [curso de SQL Server](https://www.programbi.com/pe/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/pe/cursos/power-bi), además de la [guía de Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru).

## El curso en vivo de ProgramBI (Perú)

Según la [ficha del curso para Perú](https://www.programbi.com/pe/cursos/mercado-financiero), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **17:30 a 19:30, hora de Perú**. Cupos abiertos · consulta de fechas al día.
- **30 horas en 5 módulos**, con Trabajo Aplicado Integrador obligatorio para certificar.
- Datasets, scripts base, plantillas de Power BI y prompts de IA incluidos.
- **Grabaciones de por vida** y **certificado**.
- Valor: **{precio_local}**. Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30, hora de Perú · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Perú?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 17:30 a 19:30, hora de Perú, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Me sirve si trabajo en una AFP o una SAB?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros, aplicables a AFP y sociedades agentes de bolsa.

**¿Se trabaja con soles y dólares?**
Sí. El temario incluye valorizar carteras con caja en varias monedas y medir la exposición por moneda.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
