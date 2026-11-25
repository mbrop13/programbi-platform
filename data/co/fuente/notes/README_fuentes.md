# Fuentes derivadas de Colombia (OLE, SNIES, DANE, BanRep)

Paquete para implementar `/co/datos` y `/co/datos/carreras` en programbi.com.
**No incluye** la base completa del OLE (`ole_ibc_2023.pkl`, 80 MB, 786.458 filas) ni los XLSX oficiales (OLE 47,7 MB, SNIES 8,7 MB, GEIH, IPC). Esos archivos viven en el box de Radar (`/workspace/radar-co/`) y el script puede volver a generar los CSV si se le pasan.

## Contenido

| Archivo | Qué es |
|---|---|
| `scripts/build_fuentes_co.py` | Script reproducible. Entradas opcionales: `--ole-pkl`, `--snies`, `--ipc-ind`, `--geih-nac`, `--geih-ciu`. |
| `out/carreras_ole_cohorte_2020_2022.csv` | 982 programas de pregrado (Universitario, Tecnológico, Formación técnica profesional) con ≥30 graduados cotizantes en la cohorte de grado 2020–2022, seguimiento OLE 2023. Incluye los 7 rangos de SMMLV, mediana interpolada, equivalente en COP 2026 (SMMLV $1.750.905), % con ≥4 SMMLV, n de IES y banderas `sugerido_ranking` / `sugerido_ficha`. |
| `out/carreras_ole_ies_cohorte_2020_2022.csv` | El mismo corte, desagregado por IES, solo celdas con ≥30 cotizantes (2.970 filas). |
| `out/snies_graduados_2025.csv` | Graduados 2025 de pregrado agregados por programa y nivel, con NBC y n de IES (1.833 filas). |
| `out/desempleo_nacional.csv` | Tasa de desocupación nacional mensual DANE GEIH, 2001–sep-2026 (8,0 % en septiembre de 2026). |
| `out/desempleo_ciudades_jul_sep_2026.csv` | 23 ciudades y áreas metropolitanas, trimestre móvil jul–sep 2026, más 3 totales oficiales (13 ciudades 8,7 %, 23 ciudades 8,9 %, 10 ciudades 10,7 %). No mezclar el 8,9 % trimestral de 23 ciudades con el 8,0 % nacional de septiembre. |
| `out/ipc_nacional.csv` | IPC DANE nacional, base dic-2018=100, con variación a 12 meses calculada desde el índice. Octubre 2026: índice 161,32, variación anual 6,30 %. Actualizado el 9 de noviembre de 2026. |
| `out/parametros_laborales_2026.json` | SMMLV, auxilio, TRM, tasa de intervención, IPC y notas de licencia. |

## Método de la mediana (OLE)

El OLE publica ingresos en 7 rangos de SMMLV, no un salario puntual. La mediana se interpola de forma lineal dentro del tramo que contiene el percentil 50, usando estos extremos:

| Tramo OLE | Mín. | Punto medio | Máx. |
|---|---|---|---|
| 1 SMMLV | 1,00 | 1,00 | 1,00 |
| Entre 1 y 1,5 SMMLV | 1,00 | 1,25 | 1,50 |
| Entre 1,5 y 2,5 SMMLV | 1,50 | 2,00 | 2,50 |
| Entre 2,5 y 4 SMMLV | 2,50 | 3,25 | 4,00 |
| Entre 4 y 6 SMMLV | 4,00 | 5,00 | 6,00 |
| Entre 6 y 9 SMMLV | 6,00 | 7,50 | 9,00 |
| Más de 9 SMMLV | 9,00 | 10,50 | 12,00 |

El tramo abierto «Más de 9» se cierra en 12 **solo para interpolar**. No es un salario oficial puntual. El equivalente en pesos usa el SMMLV 2026 ($1.750.905; Decreto 1469 de 2025, mantenido por el Decreto transitorio 0159/2026). El % con ≥4 SMMLV suma los tres tramos superiores.

Umbrales sugeridos (columnas `sugerido_ranking` y `sugerido_ficha`, ajustables):
- Ranking: ≥500 cotizantes en Universitario, ≥100 en Tecnológico o Formación técnica profesional (335 programas).
- Ficha: ≥200 cotizantes (354 programas).

El OLE solo observa egresados que cotizan a seguridad social (empleo formal). Los tableros BI de tasa de cotizantes del OLE devolvieron HTTP 500 el 25-nov-2026: **no hay una tasa de «empleabilidad»** en este paquete, y esa palabra no debe usarse en las páginas de Colombia.

Algunos nombres de programa llegan con el carácter `¿` en lugar de una letra acentuada. El script los repara cuando existe un nombre limpio equivalente en la misma base. Quedan unos pocos nombres únicos sin contraparte limpia; se publican tal cual y no entran a los rankings grandes.

## Licencias (al 25 nov 2026)

- TRM en datos.gov.co (`32sa-8pi3`): **CC BY-SA 4.0** (verificada).
- DANE GEIH, DANE IPC, OLE (MEN) y SNIES (MEN): **licencia de reuso no verificada**. Citar al organismo con enlace; no declarar licencia abierta en el JSON-LD `Dataset` hasta que Manu lo confirme.

## Cómo citar

- OLE — Ministerio de Educación Nacional, Base IBC, año de seguimiento 2023, cohorte de grado 2020–2022. https://ole.mineducacion.gov.co
- SNIES — Ministerio de Educación Nacional, graduados 2025. https://snies.mineducacion.gov.co
- DANE, Gran Encuesta Integrada de Hogares (GEIH), anex-GEIH-sep2026, actualizado el 30 de octubre de 2026.
- DANE, Índice de Precios al Consumidor (IPC), anex-IPC-Indices-oct2026, base diciembre de 2018=100, actualizado el 9 de noviembre de 2026.
- Banco de la República, API SDMX (TRM y tasa de intervención) y Superintendencia Financiera en datos.gov.co `32sa-8pi3`.
- MinTrabajo, Decreto 1469 de 2025 y Decreto transitorio 0159/2026 (SMMLV); Decreto 1470 de 2025 (auxilio de transporte).

## Valores de control (deben coincidir con los CSV)

- SMMLV 2026: 1.750.905 COP. Auxilio de transporte 2026: 249.095 COP.
- Desempleo nacional, septiembre 2026: 8,0 %. Bogotá D.C. jul–sep 2026: 7,6 %. Quibdó: 23,4 %.
- IPC octubre 2026: índice 161,32; variación a 12 meses 6,30 %.
- TRM 25 nov 2026: 3.592,03 COP/USD. Tasa de intervención 24 nov 2026: 12,25 %.
- Ingeniería de Sistemas y Computación (Universitario): 1.550 cotizantes, 49,8 % con ≥4 SMMLV, mediana 3,99 SMMLV.
- Ingeniería Informática (Universitario): 1.132; 47,5 %; 3,87 SMMLV.
- Ingeniería de Software (Universitario): 1.175; 43,5 %; 3,65 SMMLV.
- Ingeniería de Sistemas (Universitario): 14.422; 32,3 %; 3,08 SMMLV.
- Economía (Universitario): 5.237; 19,1 %; 2,47 SMMLV.
- Ingeniería Industrial (Universitario): 27.339; 14,3 %; 2,21 SMMLV.
- Estadística (Universitario): 391 cotizantes (bajo el umbral de ranking de 500; sí supera el de ficha de 200), 42,2 %; mediana 3,70 SMMLV.
