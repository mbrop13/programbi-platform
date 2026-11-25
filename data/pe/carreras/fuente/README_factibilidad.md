# Carreras Perú (ProgramBI): factibilidad, 25-nov-2026

## Fuentes verificadas (descargadas y abiertas en esta carpeta)
| Fuente | Archivo | Qué tiene realmente | Estado |
|---|---|---|---|
| INEI ENAHO 2022-2024 mód. 300+500 (Stata) | raw/{784,906,966}-Modulo0{3,5}/ | p301a1 = código de carrera de 6 dígitos (Clasificador INEI 2014; último dígito 6=univ, 5=sup. no univ.), p301b1 = institución, p301a = nivel aprobado; mód. 500: ingresos laborales (i524a1, d529t, i530a, d536, i538a1, d540t, i541a, d543, d544t), ocu500, p507, p505r4 (CNO 2015), p558a* (pensiones), fac500a. NO trae la variable ocupinf (informalidad) en 2024 → aquí se usa la afiliación a pensiones como aproximación | OK, descarga directa de proyectos.inei.gob.pe (códigos 784/906/966) |
| Clasificador de carreras INEI | out/clasificador_carreras_inei.csv | 1.116 carreras de 6 dígitos, con grupo de 3 dígitos | OK |
| MTPE Planilla Electrónica dic-2025 | raw/planilla_202512.csv (1,9 GB) | 4.601.595 puestos; columnas: SEXO, RANGO_EDAD, NIVEL_EDUCATIVO (22 valores), TIPO_CONTRATO, REGIMEN_*, GRUPO_OCUPACION (solo 10 grandes grupos), SECTOR (18), TAMAÑO, DEPARTAMENTO (25), REMUNERACION por puesto (tope 18.144,8; 502.255 vacíos). SIN carrera ni profesión | OK, ODC-By |
| MTPE-DISEL PDFs de mejor pagadas (gob.pe pub. 5207826 y 4882782) | raw/mtpe_pdfs/, out/mtpe_mejor_pagadas_por_departamento_nov22_oct23.csv | Promedio, p10 y p90 de jóvenes de 18-29 años por familia de carrera (MISMO código INEI de 3 dígitos), nacional y 25 departamentos, univ. y técnicas, nov-22 a oct-23 | OK (PDF → CSV parseado) |
| MTPE EDO 2026 | raw/edo2026_peru_informe.pdf/.txt | Puestos demandados por carrera (top 10 por nivel), ocupación CNO 4 dígitos, competencias | OK, solo top 10 publicados |
| SUNEDU Programas académicos | out/sunedu_pregrado_programa_universidad.csv | 8.065 filas, 96 universidades licenciadas, 772 denominaciones de pregrado, local y departamento; corte 28-08-2024. SIN matrícula ni egresados | OK, ODC-By, latin-1, separado por `|` |
| SUNEDU Licenciamiento | raw/sunedu_licenciamiento.csv | 143 universidades, estado de licencia | OK |
| MINEDU SNU matriculados 2025 | raw/snu_matriculados_2025.csv | 998 institutos, total de matriculados por institución (sin carrera) | OK |
| Mi Carrera (micarrera.trabajo.gob.pe) | — | Desde el box: `curl: (35) TLS connect error ... unexpected eof`; http:// → 500; WebFetch → 504 | BLOQUEADO / caído |
| Ponte en Carrera | — | Responde con "Security Verification — Check Point" (página anti-bot) incluso para PDFs | BLOQUEADO (no se evadió) |
| ENEU 2014 INEI | — | Encuesta única (2014), publicación PDF; no hay serie posterior | Obsoleta |

## Método del POC (ENAHO)
Pool de 2022-2024, personas de 25-40 años con carrera universitaria completa (p301a 10-11, código terminado en 6) o técnica completa (p301a 8, código terminado en 5). Ingreso laboral mensual = suma de ingresos anuales de la ocupación principal y secundaria / 12, llevado a soles de 2024 con el IPC de Lima del BCRP (PN01271PM: 2022×1,0876; 2023×1,0235). Mediana ponderada con fac500a/3. IC90 y CV por bootstrap de conglomerados (300 réplicas). Criterio para publicar: n_con_ingreso≥100 y CV≤15% → "si"; n≥60 y CV≤20% → "con_advertencia".
Muestra total: 18.576 personas (10.573 universitarias y 8.003 técnicas).

Scripts: build_classifier.py, enaho_calc.py, enaho_pool.py, enaho_cv.py, parse_mtpe_regional.py, build_poc.py
