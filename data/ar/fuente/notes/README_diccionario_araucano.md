# Diccionario Araucano: bloqueo (25 nov 2026)

`araucano.csv` trae `disciplina_id` del 1 al 38, sin el nombre de la disciplina.

El diccionario oficial (XLSX) y la metodología (PDF) están publicados en:
https://datos.produccion.gob.ar/dataset/graduados-universitarios-del-sistema-araucano-2016-2018

URLs directas probadas el 25 nov 2026 (todas fallaron desde el box):
- https://datos.produccion.gob.ar/dataset/46df1ebe-d0bb-49a1-96dd-fe9751930682/resource/2976f8e2-eb30-412f-a3cf-0a445452a037/download/diccionario.xlsx → 403
- https://datos.produccion.gob.ar/dataset/46df1ebe-d0bb-49a1-96dd-fe9751930682/resource/a2b14e98-9874-4b2a-b641-cdba6676de45/download/metodologia-araucano-da.pdf → 403
- https://cdn.produccion.gob.ar/cdn-cep/araucano/diccionario.xlsx → 403

**Condición para publicar fichas:** Manu (o el implementador, con un navegador) descarga el diccionario oficial, lo coloca en `data/ar/fuente/diccionario-araucano.xlsx` y completa `nombre_oficial` y `slug` en `araucano_por_disciplina.csv` solo con esos nombres. Sin ese archivo no se publican fichas ni se inventan nombres.

De las 38 disciplinas, 36 tienen n_con_salario_sipa ≥ 100 (publicables una vez haya nombre). Quedan fuera la 36 (n=83) y la 38 (n=49).
