---
slug: curso-machine-learning-chile
ruta_sugerida: /guias/curso-machine-learning-chile
pais: cl
hreflang: es-CL
curso: machine-learning
url_curso: https://www.programbi.com/cursos/machine-learning
title: "Curso de Machine Learning en Chile: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Chile, en vivo por Zoom: 20 h de modelos supervisados y no supervisados con Python, por $169.000 CLP. Para quienes ya saben Python."
h1: "Curso de Machine Learning en Chile: modelos predictivos con Python"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/machine-learning
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «supervisado vs. no supervisado» (pregunta que responde, técnicas, ejemplo chileno) + bloque «En 30 segundos».
  Intención: "curso machine learning chile", "curso machine learning online en vivo" → click_registro en /cursos/machine-learning. country=cl, course=machine-learning.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026). Léelo igual como {precio_local} desde config/pricing.ts (clave machine-learning × cl) para no desalinear guía, ficha, Offer y checkout.
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Chile en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Chile: modelos predictivos con Python

**Respuesta corta:** el [curso de Machine Learning de ProgramBI](https://www.programbi.com/cursos/machine-learning) es un programa **en vivo por Zoom de 20 horas** para quienes ya manejan Python y quieren construir modelos predictivos aplicados a negocios. Cuesta **$169.000 CLP**, las clases son de **19:30 a 21:30, hora de Chile**, y se divide en dos módulos: aprendizaje supervisado (regresión, clasificación, árboles, validación) y no supervisado (clustering, PCA, anomalías, reglas de asociación). Incluye grabaciones de por vida y certificado.

La próxima cohorte figura con **cupos abiertos y fecha por confirmar** en la ficha, revisada el 4 de noviembre de 2026. Si ya escribes código en pandas y quieres dar el paso de describir datos a predecir con ellos, este es el curso siguiente natural.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Chile) · «Ver el curso».

## Qué problema resuelve en una empresa chilena

En Chile hay muchísima data guardada y poca convertida en decisiones anticipadas. El retail sabe cuánto vendió ayer, pero le cuesta estimar cuánto venderá la próxima semana por tienda. Una compañía de servicios conoce a los clientes que se fueron, pero no tiene una lista de los que están por irse. Una faena registra miles de lecturas de sensores, pero la alerta llega cuando el equipo ya falló.

Machine learning sirve justamente para eso: aprender patrones de la historia y aplicarlos a casos nuevos. No se trata de inteligencia artificial mágica, sino de modelos estadísticos bien validados que responden preguntas concretas: ¿cuánto?, ¿cuál?, ¿a qué grupo pertenece?, ¿esto es raro?

## El temario, explicado sin jerga

**Módulo 1 — Aprendizaje supervisado.** Tienes datos con la respuesta conocida y entrenas un modelo para predecirla.

- **Regresión lineal y polinómica**: estimar un número, como la venta semanal de un local o el tiempo de despacho de un pedido.
- **Regresión logística y SVM**: clasificar en categorías, por ejemplo si un cliente renovará o no su plan.
- **Árboles de decisión y métodos ensemble**: modelos más flexibles, que combinan muchos árboles y suelen rendir bien con datos tabulares de negocio.
- **Validación cruzada y métricas**: la parte que separa un modelo serio de uno que solo se ve bien en el notebook.

**Módulo 2 — Aprendizaje no supervisado.** No hay respuesta conocida; el objetivo es encontrar estructura.

- **K-Means**: segmentar clientes o productos en grupos con comportamiento parecido.
- **PCA y t-SNE**: reducir muchas variables a pocas para visualizar y entender los datos.
- **Detección de anomalías**: marcar transacciones, lecturas o registros fuera de lo normal.
- **Reglas de asociación**: descubrir qué productos se compran juntos.

## Un ejemplo en código, como los del curso

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

X = clientes[["meses_antiguedad", "reclamos_90d", "uso_mensual", "plan"]]
y = clientes["se_fue"]

modelo = RandomForestClassifier(n_estimators=300, random_state=42)
auc = cross_val_score(modelo, pd.get_dummies(X), y, cv=5, scoring="roc_auc")
print(auc.mean())
```

Cinco líneas útiles: eliges variables, defines el modelo y lo evalúas con validación cruzada en vez de confiar en una sola partición. En clase se discute qué significa ese número y qué decisión de negocio se puede tomar con él.

## Tres casos que encajan con la realidad chilena

**Retail y supermercados.** Con el historial de ventas por local, día y categoría, un modelo de regresión o de árboles estima la demanda de la semana siguiente. El área de abastecimiento deja de pedir "lo mismo que el año pasado" y empieza a ajustar por promociones, feriados y estacionalidad.

**Servicios con suscripción.** Telcos, isapres, gimnasios o software: todos pierden clientes. Un clasificador entrenado con antigüedad, reclamos y uso entrega cada mes una lista priorizada de clientes en riesgo para que el equipo de retención llame primero a quien más importa.

**Minería e industria.** Los sensores de equipos generan series enormes. Un modelo de detección de anomalías marca comportamientos fuera de patrón antes de una falla, y PCA ayuda a resumir decenas de variables en pocos indicadores que mantenimiento puede seguir.

## ¿Estás listo para este curso?

La ficha es clara: el curso es para quienes **ya manejan Python**. Un autodiagnóstico rápido:

- ¿Sabes cargar un CSV con pandas, filtrar filas y agrupar con `groupby`?
- ¿Has hecho un gráfico con matplotlib o seaborn?
- ¿Entiendes qué es una variable categórica y qué es una numérica?

Si respondiste que sí a las tres, estás listo. Si no, el camino recomendado es partir por el [curso de Python para datos](https://www.programbi.com/cursos/python), que cubre esas bases, y luego volver acá.

## Errores típicos al empezar con machine learning

- **Evaluar con los mismos datos de entrenamiento.** El modelo parece perfecto y fracasa con casos nuevos. La validación cruzada del módulo 1 existe para evitar esto.
- **Usar variables que no estarán disponibles al predecir.** Si entrenas el modelo de fuga con una columna que se llena cuando el cliente ya se fue, el modelo "adivina" con trampa.
- **Mirar solo la exactitud.** Si el 95 % de los clientes no se va, un modelo que dice "nadie se va" tiene 95 % de exactitud y no sirve para nada. Por eso se trabajan otras métricas.
- **Segmentar sin interpretar.** K-Means siempre entrega grupos; el trabajo es ponerles nombre y decidir qué hacer con cada uno.

## Cómo se ve esto en tu pega

En Chile, los avisos de analista de datos, data scientist o analista de riesgo publicados en LinkedIn, Laborum o Chiletrabajos suelen pedir Python y, cada vez más, experiencia con modelos predictivos. Tener un proyecto propio —un modelo de fuga, una segmentación de clientes, un pronóstico de demanda— con código ordenado y métricas bien explicadas es la mejor carta de presentación.

Y el modelo no termina en el notebook. Lo habitual es guardar las predicciones en una tabla y mostrarlas en un tablero: la lista de clientes en riesgo o la demanda estimada por local, filtrable por gerente. Para esa última milla sirve el [curso de Power BI](https://www.programbi.com/cursos/power-bi) o la [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile).

## Supervisado o no supervisado: cómo elegir

| Pregunta de negocio | Tipo | Técnica del curso |
|---|---|---|
| ¿Cuánto venderá este local la próxima semana? | Supervisado | Regresión lineal, polinómica o árboles |
| ¿Este cliente renovará su plan? | Supervisado | Logística, SVM, ensemble |
| ¿Qué tipos de clientes tengo? | No supervisado | K-Means |
| ¿Esta lectura del sensor es normal? | No supervisado | Detección de anomalías |
| ¿Qué productos se llevan juntos? | No supervisado | Reglas de asociación |

La regla práctica: si tienes una columna con la respuesta que quieres predecir, es supervisado; si no, buscas estructura y es no supervisado.

## Cómo aprovechar las clases en vivo

Las 20 horas pasan rápido. Lo que más rinde es llegar con un dataset propio en mente —anonimizado si viene de tu empresa— e ir aplicando cada técnica sobre él mientras avanza el curso. Como las clases son de 19:30 a 21:30, muchos alumnos reservan una hora el fin de semana para repetir el ejercicio con la grabación. Y vale la pena preguntar en vivo: los mejores aprendizajes salen de los errores que aparecen con datos reales, no con los de ejemplo.

## Plan de 4 semanas después del curso

1. **Semana 1:** elige un problema real de tu área con historia de al menos un año.
2. **Semana 2:** limpia los datos y arma un modelo base simple (regresión o árbol).
3. **Semana 3:** compara con un ensemble y valida con validación cruzada.
4. **Semana 4:** presenta resultados en lenguaje de negocio: qué decisión mejora y cuánto.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## El curso en vivo de ProgramBI en Chile

Según la [ficha del curso](https://www.programbi.com/cursos/machine-learning), consultada el 4 de noviembre de 2026:

- **Nivel básico-intermedio, 20 horas en 2 módulos**: supervisado y no supervisado.
- **En vivo por Zoom**, de 19:30 a 21:30, hora de Chile. Cupos abiertos; fecha por confirmar.
- **Grabaciones de por vida** en el campus y **certificado digital** al completar.
- Proyectos con datos reales.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Valor: **$169.000 CLP**.

**[CTA-END]** — $169.000 CLP · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Machine Learning en Chile?**
$169.000 CLP por las 20 horas en vivo, con grabaciones de por vida y certificado.

**¿Necesito saber Python?**
Sí. La ficha lo indica para quienes ya manejan Python. Si estás partiendo, conviene tomar antes el curso de Python para datos.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos con fecha por confirmar. Puedes consultarla por WhatsApp.

**¿Qué librerías se usan?**
El temario cubre técnicas clásicas de machine learning en Python; scikit-learn es la librería estándar para regresión, clasificación, clustering y PCA.

**¿Si me pierdo una clase?**
Todas quedan grabadas y tienes acceso de por vida en el campus.

**¿Sirve si trabajo en Excel y no en Python?**
No directamente. Primero necesitas una base en Python; con ella, este curso te permite construir modelos que en Excel serían inviables de mantener.
