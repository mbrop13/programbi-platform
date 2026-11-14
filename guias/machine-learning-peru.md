---
slug: curso-machine-learning-peru
ruta_sugerida: /pe/guias/curso-machine-learning-peru
pais: pe
hreflang: es-PE
curso: machine-learning
url_curso: https://www.programbi.com/pe/cursos/machine-learning
title: "Curso de Machine Learning en Perú: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Perú en vivo por Zoom: 20 h de modelos predictivos, clustering y anomalías con Python de 17:30 a 19:30 Lima."
h1: "Curso de Machine Learning en Perú: modelos predictivos para tu chamba"
updated: 2026-11-04
sources:
  - https://www.programbi.com/pe/cursos/machine-learning
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta «comprobantes SUNAT + reportes de planta + planillas de campo → limpieza → modelo → alertas en Power BI» + bloque «En 30 segundos».
  Intención: "curso machine learning perú", "curso machine learning lima online" → click_registro en /pe/cursos/machine-learning. country=pe, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × pe. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Perú: modelos predictivos para tu chamba

**Respuesta corta:** el [curso de Machine Learning de ProgramBI en Perú](https://www.programbi.com/pe/cursos/machine-learning) es un programa **en vivo por Zoom de 20 horas**, de **17:30 a 19:30, hora de Perú**, dirigido a personas que ya manejan Python y quieren construir modelos predictivos para el negocio. Se divide en dos módulos: aprendizaje supervisado (regresión, clasificación, árboles, ensembles y validación) y no supervisado (K-Means, PCA, t-SNE, detección de anomalías y reglas de asociación). El precio es **{precio_local}**, con grabaciones de por vida y certificado digital.

La ficha, revisada el 4 de noviembre de 2026, indica **cupos abiertos · calendario mensual activo**. El pago se hace en soles con Mercado Pago Perú, Yape, Plin o transferencia.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30 (Lima) · «Ver el curso».

## De dónde salen los datos en una empresa peruana

La ficha del curso para Perú describe un escenario que muchos reconocerán: se parte de los comprobantes electrónicos de SUNAT, los reportes de planta y las planillas de campo. Son fuentes distintas, a veces desordenadas, pero con algo en común: registran lo que pasó con fecha, lugar y cantidad. Una vez limpias y unidas, se convierten en historia suficiente para entrenar modelos.

¿Qué tipo de preguntas se pueden responder?

- En una planta: ¿qué combinación de condiciones de operación anticipa un mayor costo por unidad?
- En campo: ¿qué lotes o cuadrillas rinden distinto al resto y por qué?
- En ventas: ¿cuánto venderá cada tienda por categoría en las próximas semanas?
- En finanzas: ¿qué clientes tienen más riesgo de pagar tarde?

## Temario del curso

**Módulo 1 — Machine learning supervisado.** Trabajas con datos que ya tienen la respuesta y entrenas modelos para predecirla:

- **Regresión lineal y polinómica** para estimar valores continuos, como costo, producción o ventas.
- **Clasificación con regresión logística y SVM** para asignar casos a categorías.
- **Árboles de decisión y métodos ensemble** para relaciones no lineales y muchas variables.
- **Validación cruzada y métricas** para medir el desempeño real del modelo.

**Módulo 2 — Machine learning no supervisado.** Buscas patrones sin una respuesta previa:

- **K-Means** para agrupar casos parecidos.
- **PCA y t-SNE** para reducir la cantidad de variables y visualizar.
- **Detección de anomalías** para encontrar lo que se sale de lo normal.
- **Reglas de asociación** para descubrir productos que se compran juntos.

## Ejemplo: anomalías en reportes de planta

```python
from sklearn.ensemble import IsolationForest

vars_ = ["consumo_energia", "tonelaje", "horas_operacion", "costo_unitario"]
iso = IsolationForest(contamination=0.02, random_state=7)
planta["anomalia"] = iso.fit_predict(planta[vars_])

revisar = planta[planta["anomalia"] == -1].sort_values("fecha")
print(revisar[["fecha", "turno"] + vars_].head(20))
```

Este modelo no necesita que alguien haya marcado antes qué días fueron "malos". Aprende cómo luce un día normal y señala los que se alejan del patrón. El resultado es una lista corta de turnos para revisar con el jefe de planta: quizás un error de digitación, quizás un problema real de operación. En el curso se discute cómo elegir el porcentaje de anomalías esperado y cómo validar con el equipo que las alertas tengan sentido.

## Cuatro aplicaciones que encajan en Perú

**Producción y costos.** Un modelo de regresión o de árboles relaciona el costo por unidad con variables de operación —horas, insumos, turno, equipo— y muestra cuáles pesan más. Es un primer paso para pasar de explicar el costo del mes pasado a anticiparlo.

**Agroexportación y campo.** Con las planillas de campo digitalizadas, K-Means agrupa lotes o cuadrillas con rendimientos parecidos y la detección de anomalías marca registros fuera de rango, útiles para revisar antes de consolidar.

**Retail por tienda y categoría.** Pronosticar ventas por tienda y categoría ayuda a planificar inventario y personal, sobre todo en temporadas altas.

**Cobranza.** Con historial de pagos, un clasificador ordena a los clientes por probabilidad de atraso para que el equipo empiece por los de mayor riesgo.

## ¿Estás listo? Haz esta prueba

El curso es para quienes ya manejan Python. Antes de inscribirte, intenta esto en un notebook:

1. Carga un archivo de Excel con pandas.
2. Elimina filas vacías y convierte una columna de texto a fecha.
3. Calcula el total por mes con `groupby`.
4. Grafica el resultado.

Si lo logras sin mayor problema, estás listo. Si te trabaste, el [curso de Python para datos en Perú](https://www.programbi.com/pe/cursos/python) cubre exactamente esa base.

## Errores que conviene evitar desde el inicio

- **Unir fuentes sin una llave común.** Si los reportes de planta y las planillas de campo usan códigos distintos, el modelo aprende sobre datos mal cruzados. Antes de modelar, normaliza.
- **Ignorar los valores faltantes.** Un registro de campo sin dato no es lo mismo que un cero.
- **Usar solo la exactitud.** Con eventos poco frecuentes, como fallas o atrasos, hay que mirar precisión y sensibilidad.
- **Entrenar una vez y olvidarse.** Las condiciones cambian por temporada; define cada cuánto reentrenas.
- **Presentar números sin contexto.** "El modelo tiene 0,82 de AUC" no le dice nada al gerente; "con esta lista recuperamos más pagos llamando a la mitad de clientes" sí.

## Glosario mínimo

- **Etiqueta:** la respuesta que quieres predecir.
- **Atributos:** las columnas que usas para predecir.
- **Sobreajuste:** el modelo memoriza el pasado y falla con lo nuevo.
- **Ensemble:** muchos modelos simples combinados en uno más robusto.
- **Clúster:** grupo de casos parecidos encontrado sin etiqueta.
- **Anomalía:** registro que se aleja del patrón habitual.

## Un mes para llevarlo a tu trabajo

**Semana 1 — Elegir el problema.** Busca una pregunta que hoy se responda "a ojo" y que tenga historia registrada: costo por unidad en planta, ventas por tienda, atrasos de pago. Escribe en una línea quién usará la predicción y para qué.

**Semana 2 — Ordenar los datos.** Une los comprobantes, reportes o planillas en una sola tabla con una fila por caso. Revisa fechas, códigos y faltantes. Esta etapa suele tomar más tiempo del esperado, y está bien.

**Semana 3 — Modelo base y mejora.** Parte con una regresión o una logística, mide con validación cruzada y luego prueba un árbol o un ensemble. Quédate con el que mejore la métrica que importa para la decisión.

**Semana 4 — Presentarlo.** Lleva los resultados a una reunión corta con el área usuaria: qué predice el modelo, cuánto se equivoca y qué cambiaría en su día a día. Si se entusiasman, el siguiente paso es el tablero.

## Cómo sacarle el jugo a las clases en vivo

Llega a cada sesión con tu propio dataset en mente y aplica la técnica del día sobre él en la semana. Pregunta en vivo cuando algo no cuadre con tus datos: esas dudas suelen ser las más útiles para todo el grupo. Y usa las grabaciones para repasar el código con calma el fin de semana.

## Machine learning y tu chamba

En LinkedIn, Computrabajo y Bumeran Perú, las ofertas de científico de datos, analista de datos o analista de riesgos suelen pedir Python y, con frecuencia, experiencia en modelos predictivos. Lo que más ayuda a destacar es un proyecto propio bien explicado: el problema, los datos, el modelo base, las mejoras, la métrica elegida y la recomendación final. El proyecto con datos reales del curso puede ser el primero de ese portafolio.

## Cuando el modelo tiene que llegar al gerente

La última milla casi siempre es un tablero. Guardas las predicciones o las alertas en una tabla y las muestras en Power BI, filtrables por planta, tienda o zona. Para esa parte está el [curso de Power BI en Perú](https://www.programbi.com/pe/cursos/power-bi) y la [guía para aprender Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru).

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Horario y pago desde Perú

Las clases son de 17:30 a 19:30 en Lima. Perú se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano, por eso la ficha aclara que la clase se ve a las 17:30 cuando Chile está en verano y a las 18:30 en invierno; la ficha de cada cohorte muestra la hora exacta. El pago es en soles con Mercado Pago Perú (tarjeta de crédito o débito), Yape, Plin o transferencia bancaria.

## Datos clave

- 20 horas en 2 módulos.
- En vivo por Zoom; cupos abiertos · consulta de fechas al día.
- Grabaciones de por vida, certificado digital y proyectos con datos reales.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Machine Learning en Perú?**
{precio_local}, en soles. Puedes pagar con Mercado Pago Perú, Yape, Plin o transferencia.

**¿Necesito saber programar?**
Sí, en Python. El curso es para quienes ya lo manejan.

**¿Cuándo inicia?**
La ficha muestra cupos abiertos con nuevas sesiones pronto; consulta la próxima fecha por WhatsApp.

**¿Puedo ver las clases grabadas?**
Sí, con acceso de por vida en el campus virtual.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
