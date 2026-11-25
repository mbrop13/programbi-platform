#!/usr/bin/env python3
"""Genera los CSV derivados de Colombia a partir de las fuentes oficiales.

Entradas (opcionales; si faltan, el script no las regenera y avisa):
  --ole-pkl     ole_ibc_2023.pkl  (786.458 filas OLE Base IBC 2023)
  --snies       snies_grad2025.xlsx
  --ipc-ind     ipcind.xlsx  (índices DANE, base dic-2018=100)
  --geih-nac    td_nacional.json
  --geih-ciu    td_ciudades.json

Salidas en --out (por defecto ./out):
  carreras_ole_cohorte_2020_2022.csv
  carreras_ole_ies_cohorte_2020_2022.csv
  snies_graduados_2025.csv
  desempleo_nacional.csv
  desempleo_ciudades_jul_sep_2026.csv
  ipc_nacional.csv
  parametros_laborales_2026.json

Este script no inventa cifras: solo agrega y convierte rangos SMMLV a pesos
del SMMLV 2026 ($1.750.905). Licencias de OLE, SNIES y DANE: no verificadas.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

SMMLV_2026 = 1_750_905
AUXILIO_2026 = 249_095
COHORTE = {2020, 2021, 2022}
NIVELES_PREGRADO = {
    "Universitario",
    "Tecnológico",
    "Formación técnica profesional",
}

# Extremos y punto medio de cada tramo OLE, en SMMLV.
# El tramo abierto «Más de 9» se cierra en 12 (mismo tope de referencia
# documentado en la metodología; no es un salario oficial puntual).
RANGOS = {
    "1 SMMLV": (1.0, 1.0, 1.0),
    "Entre 1 y 1,5 SMMLV": (1.0, 1.25, 1.5),
    "Entre 1,5 y 2,5 SMMLV": (1.5, 2.0, 2.5),
    "Entre 2,5 y 4 SMMLV": (2.5, 3.25, 4.0),
    "Entre 4 y 6 SMMLV": (4.0, 5.0, 6.0),
    "Entre 6 y 9 SMMLV": (6.0, 7.5, 9.0),
    "Más de 9 SMMLV": (9.0, 10.5, 12.0),
}
RANGOS_ORDEN = list(RANGOS.keys())
RANGOS_4PLUS = {"Entre 4 y 6 SMMLV", "Entre 6 y 9 SMMLV", "Más de 9 SMMLV"}

MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]


def norm(texto: object) -> str:
    if texto is None or (isinstance(texto, float) and math.isnan(texto)):
        return ""
    s = str(texto).strip().upper()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"[^A-Z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slug(texto: str) -> str:
    s = norm(texto).lower().replace(" ", "-")
    return re.sub(r"-+", "-", s).strip("-")



def reparar_nombres(valores):
    """Reconstruye nombres con '¿' (acentos rotos) contra el diccionario de nombres limpios."""
    freq = defaultdict(int)
    for v in valores:
        if v and "¿" not in v and "\ufffd" not in v:
            freq[v] += 1
    mapa = {}
    for crudo in set(valores):
        if not crudo or ("¿" not in crudo and "\ufffd" not in crudo):
            mapa[crudo] = crudo
            continue
        pat = re.escape(crudo).replace("¿", ".")
        pat = pat.replace("\ufffd", ".")
        hits = [n for n in freq if re.fullmatch(pat, n)]
        if hits:
            mapa[crudo] = max(hits, key=lambda n: freq[n])
        else:
            mapa[crudo] = crudo
    return mapa


def mediana_interpolada(conteos: dict[str, float]) -> float | None:
    total = sum(conteos.values())
    if total <= 0:
        return None
    acum = 0.0
    for nombre in RANGOS_ORDEN:
        n = conteos.get(nombre, 0.0)
        if n <= 0:
            continue
        lo, _, hi = RANGOS[nombre]
        if acum + n >= total * 0.5:
            frac = (total * 0.5 - acum) / n
            return lo + frac * (hi - lo)
        acum += n
    return None


def promedio_ponderado(conteos: dict[str, float]) -> float | None:
    total = sum(conteos.values())
    if total <= 0:
        return None
    acc = 0.0
    for nombre, n in conteos.items():
        if nombre not in RANGOS or n <= 0:
            continue
        acc += n * RANGOS[nombre][1]
    return acc / total


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    import csv

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fields})


def build_ole(pkl_path: Path, out: Path) -> None:
    import pickle

    df = pickle.load(pkl_path.open("rb"))
    # Cohorte reciente de pregrado con ingreso informado.
    mask = (
        df["NIVEL ACADÉMICO"].eq("Pregrado")
        & df["NIVEL DE FORMACIÓN"].isin(NIVELES_PREGRADO)
        & df["AÑO DE GRADO"].isin(COHORTE)
        & df["INGRESO"].notna()
        & df["GRADUADOS"].notna()
    )
    sub = df.loc[mask].copy()
    sub["PROGRAMA ACADÉMICO"] = sub["PROGRAMA ACADÉMICO"].astype(str)
    mapa_prog = reparar_nombres(sub["PROGRAMA ACADÉMICO"].tolist())
    sub["PROGRAMA ACADÉMICO"] = sub["PROGRAMA ACADÉMICO"].map(mapa_prog)
    sub["PROG_N"] = sub["PROGRAMA ACADÉMICO"].map(norm)
    sub["IES_N"] = sub["INSTITUCIÓN DE EDUCACIÓN SUPERIOR (IES)"].map(norm)
    sub["GRADUADOS"] = sub["GRADUADOS"].astype(float)

    # Agregado nacional por programa + nivel (el área modal se anota, no parte la clave).
    grupos = sub.groupby(["PROG_N", "NIVEL DE FORMACIÓN"], dropna=False)
    rows = []
    for (prog, nivel), g in grupos:
        if not prog:
            continue
        conteos: dict[str, float] = defaultdict(float)
        for ing, n in zip(g["INGRESO"], g["GRADUADOS"]):
            conteos[str(ing)] += float(n)
        total = sum(conteos.values())
        if total < 30:
            continue
        area_counts = g["ÁREA DE CONOCIMIENTO"].dropna().astype(str).value_counts()
        area = area_counts.idxmax() if len(area_counts) else ""
        cot_4 = sum(conteos[r] for r in RANGOS_4PLUS)
        med = mediana_interpolada(conteos)
        prom = promedio_ponderado(conteos)
        n_ies = g["IES_N"].nunique()
        nombre_orig = (
            g["PROGRAMA ACADÉMICO"].dropna().astype(str).value_counts().idxmax()
        )
        row = {
            "programa_normalizado": prog,
            "programa": nombre_orig,
            "slug": slug(nombre_orig),
            "nivel_formacion": nivel,
            "area_conocimiento": area if isinstance(area, str) else "",
            "graduados_cotizantes": int(round(total)),
            "n_ies": int(n_ies),
            "pct_4plus_smmlv": round(100.0 * cot_4 / total, 1),
            "mediana_smmlv": None if med is None else round(med, 2),
            "mediana_cop_2026": None
            if med is None
            else int(round(med * SMMLV_2026)),
            "promedio_smmlv": None if prom is None else round(prom, 2),
            "promedio_cop_2026": None
            if prom is None
            else int(round(prom * SMMLV_2026)),
            "sugerido_ranking": (
                "si"
                if (
                    (nivel == "Universitario" and total >= 500)
                    or (nivel != "Universitario" and total >= 100)
                )
                else "no"
            ),
            "sugerido_ficha": "si" if total >= 200 else "no",
            "cohorte": "2020-2022",
            "anio_seguimiento": 2023,
            "smmlv_usado": SMMLV_2026,
        }
        for r in RANGOS_ORDEN:
            key = "n_" + slug(r).replace("entre-", "").replace("smmlv", "sm")
            row[key] = int(round(conteos.get(r, 0)))
        rows.append(row)

    rows.sort(
        key=lambda r: (
            0 if r["nivel_formacion"] == "Universitario" else 1,
            -r["pct_4plus_smmlv"],
            -r["graduados_cotizantes"],
        )
    )
    fields = [
        "programa_normalizado",
        "programa",
        "slug",
        "nivel_formacion",
        "area_conocimiento",
        "graduados_cotizantes",
        "n_ies",
        "pct_4plus_smmlv",
        "mediana_smmlv",
        "mediana_cop_2026",
        "promedio_smmlv",
        "promedio_cop_2026",
        "sugerido_ranking",
        "sugerido_ficha",
        "cohorte",
        "anio_seguimiento",
        "smmlv_usado",
        "n_1_sm",
        "n_1_y_1-5_sm",
        "n_1-5_y_2-5_sm",
        "n_2-5_y_4_sm",
        "n_4_y_6_sm",
        "n_6_y_9_sm",
        "n_mas_de_9_sm",
    ]
    # Ajustar claves de rangos a las realmente generadas.
    sample = rows[0] if rows else {}
    rango_keys = [k for k in sample if k.startswith("n_")]
    fields = [f for f in fields if not f.startswith("n_") or f in rango_keys] + [
        k for k in rango_keys if k not in fields
    ]
    write_csv(out / "carreras_ole_cohorte_2020_2022.csv", rows, fields)
    print(
        f"OLE programas: {len(rows)} "
        f"(ranking={sum(1 for r in rows if r['sugerido_ranking']=='si')}, "
        f"ficha={sum(1 for r in rows if r['sugerido_ficha']=='si')})"
    )

    # Agregado por IES (solo celdas con >= 30 cotizantes).
    ies_rows = []
    for (prog, nivel, ies, sector), g in sub.groupby(
        [
            "PROG_N",
            "NIVEL DE FORMACIÓN",
            "IES_N",
            "SECTOR IES",
        ],
        dropna=False,
    ):
        if not prog or not ies:
            continue
        conteos = defaultdict(float)
        for ing, n in zip(g["INGRESO"], g["GRADUADOS"]):
            conteos[str(ing)] += float(n)
        total = sum(conteos.values())
        if total < 30:
            continue
        med = mediana_interpolada(conteos)
        cot_4 = sum(conteos[r] for r in RANGOS_4PLUS)
        nombre_prog = (
            g["PROGRAMA ACADÉMICO"].dropna().astype(str).value_counts().idxmax()
        )
        nombre_ies = (
            g["INSTITUCIÓN DE EDUCACIÓN SUPERIOR (IES)"]
            .dropna()
            .astype(str)
            .value_counts()
            .idxmax()
        )
        ies_rows.append(
            {
                "programa_normalizado": prog,
                "programa": nombre_prog,
                "nivel_formacion": nivel,
                "ies": nombre_ies,
                "sector_ies": sector if isinstance(sector, str) else "",
                "graduados_cotizantes": int(round(total)),
                "pct_4plus_smmlv": round(100.0 * cot_4 / total, 1),
                "mediana_smmlv": None if med is None else round(med, 2),
                "mediana_cop_2026": None
                if med is None
                else int(round(med * SMMLV_2026)),
                "cohorte": "2020-2022",
                "anio_seguimiento": 2023,
                "smmlv_usado": SMMLV_2026,
            }
        )
    ies_rows.sort(key=lambda r: (-r["graduados_cotizantes"], r["programa"]))
    write_csv(
        out / "carreras_ole_ies_cohorte_2020_2022.csv",
        ies_rows,
        [
            "programa_normalizado",
            "programa",
            "nivel_formacion",
            "ies",
            "sector_ies",
            "graduados_cotizantes",
            "pct_4plus_smmlv",
            "mediana_smmlv",
            "mediana_cop_2026",
            "cohorte",
            "anio_seguimiento",
            "smmlv_usado",
        ],
    )
    print(f"OLE IES (n>=30): {len(ies_rows)}")


def build_snies(xlsx: Path, out: Path) -> None:
    import openpyxl

    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    ws = wb["1."]
    header = None
    acc: dict[tuple, dict] = {}
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i < 5:
            continue
        if i == 5:
            header = [str(c).strip() if c is not None else f"c{j}" for j, c in enumerate(row)]
            continue
        d = {header[j]: row[j] if j < len(row) else None for j in range(len(header))}
        if d.get("NIVEL ACADÉMICO") != "Pregrado":
            continue
        nivel = d.get("NIVEL DE FORMACIÓN")
        if nivel not in NIVELES_PREGRADO:
            continue
        prog = d.get("PROGRAMA ACADÉMICO")
        if not prog:
            continue
        n = d.get("GRADUADOS") or 0
        try:
            n = float(n)
        except (TypeError, ValueError):
            continue
        key = (norm(prog), str(nivel))
        rec = acc.setdefault(
            key,
            {
                "programa_normalizado": norm(prog),
                "programa": str(prog),
                "slug": slug(str(prog)),
                "nivel_formacion": str(nivel),
                "area_conocimiento": str(d.get("ÁREA DE CONOCIMIENTO") or ""),
                "nbc": str(d.get("NÚCLEO BÁSICO DEL CONOCIMIENTO (NBC)") or ""),
                "graduados_2025": 0,
                "n_ies": set(),
            },
        )
        rec["graduados_2025"] += n
        ies = d.get("INSTITUCIÓN DE EDUCACIÓN SUPERIOR (IES)")
        if ies:
            rec["n_ies"].add(norm(ies))
        # Conserva el nombre más frecuente.
        if rec["programa"] != str(prog):
            pass
    rows = []
    for rec in acc.values():
        rec["n_ies"] = len(rec["n_ies"])
        rec["graduados_2025"] = int(round(rec["graduados_2025"]))
        rows.append(rec)
    rows.sort(key=lambda r: -r["graduados_2025"])
    write_csv(
        out / "snies_graduados_2025.csv",
        rows,
        [
            "programa_normalizado",
            "programa",
            "slug",
            "nivel_formacion",
            "area_conocimiento",
            "nbc",
            "graduados_2025",
            "n_ies",
        ],
    )
    print(f"SNIES programas pregrado: {len(rows)}")


def build_ipc(xlsx: Path, out: Path) -> None:
    import openpyxl

    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    ws = wb.active
    years = None
    series: dict[tuple[int, int], float] = {}
    actualizado = ""
    for row in ws.iter_rows(values_only=True):
        vals = list(row)
        if not any(v is not None for v in vals):
            continue
        head = str(vals[0]).strip() if vals[0] is not None else ""
        if head == "Mes" and years is None:
            years = [int(y) for y in vals[1:] if y is not None]
            continue
        if head in MESES and years:
            mes = MESES.index(head) + 1
            for i, y in enumerate(years):
                v = vals[i + 1] if i + 1 < len(vals) else None
                if v is None:
                    continue
                series[(int(y), mes)] = float(v)
        if head.startswith("Actualizado"):
            actualizado = head
    rows = []
    for (y, m), idx in sorted(series.items()):
        prev = series.get((y - 1, m))
        var12 = None if prev is None or prev == 0 else f"{((idx / prev - 1) * 100):.2f}"
        rows.append(
            {
                "anio": y,
                "mes": m,
                "mes_nombre": MESES[m - 1],
                "indice_base_dic2018": f"{idx:.2f}",
                "var_12m_pct": "" if var12 is None else var12,
                "fuente": "DANE IPC, anex-IPC-Indices-oct2026.xlsx",
                "actualizado": actualizado or "Actualizado el 9 de Noviembre de 2026",
            }
        )
    write_csv(
        out / "ipc_nacional.csv",
        rows,
        [
            "anio",
            "mes",
            "mes_nombre",
            "indice_base_dic2018",
            "var_12m_pct",
            "fuente",
            "actualizado",
        ],
    )
    last = rows[-1] if rows else {}
    print(
        f"IPC puntos: {len(rows)}; último {last.get('anio')}-{last.get('mes')} "
        f"índice={last.get('indice_base_dic2018')} var12={last.get('var_12m_pct')}"
    )


def build_geih(nac: Path, ciu: Path, out: Path) -> None:
    nacional = json.loads(nac.read_text())
    ciudades = json.loads(ciu.read_text())
    mes_map = {
        "Ene": 1, "Feb": 2, "Mar": 3, "Abr": 4, "May": 5, "Jun": 6,
        "Jul": 7, "Ago": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dic": 12,
    }
    rows = []
    for anio, mes, tasa in nacional:
        rows.append(
            {
                "anio": anio,
                "mes": mes_map.get(mes, mes),
                "mes_nombre": mes,
                "tasa_desocupacion_pct": tasa,
                "fuente": "DANE GEIH, anex-GEIH-sep2026.xlsx (actualizado 30-oct-2026)",
            }
        )
    write_csv(
        out / "desempleo_nacional.csv",
        rows,
        ["anio", "mes", "mes_nombre", "tasa_desocupacion_pct", "fuente"],
    )
    crows = []
    for nombre, tasa in ciudades.items():
        if not isinstance(tasa, (int, float)) or (
            isinstance(tasa, float) and math.isnan(tasa)
        ):
            continue
        tipo = "agregado" if str(nombre).lower().startswith("total") else "ciudad"
        crows.append(
            {
                "ciudad": nombre,
                "tasa_desocupacion_pct": tasa,
                "tipo": tipo,
                "periodo": "jul-sep 2026",
                "cobertura": "23 ciudades y áreas metropolitanas, trimestre móvil",
                "fuente": "DANE GEIH, anex-GEIH-sep2026.xlsx (actualizado 30-oct-2026)",
            }
        )
    crows.sort(key=lambda r: (0 if r["tipo"] == "ciudad" else 1, -r["tasa_desocupacion_pct"]))
    write_csv(
        out / "desempleo_ciudades_jul_sep_2026.csv",
        crows,
        ["ciudad", "tasa_desocupacion_pct", "tipo", "periodo", "cobertura", "fuente"],
    )
    print(f"GEIH nacional: {len(rows)} meses; ciudades: {len(crows)}")


def write_params(out: Path) -> None:
    data = {
        "smmlv_2026_cop": SMMLV_2026,
        "auxilio_transporte_2026_cop": AUXILIO_2026,
        "smmlv_fuente": "Decreto 1469 de 2025, mantenido por Decreto transitorio 0159/2026 (MinTrabajo). El 1469 se confirmó con fuentes secundarias; citar como referencia normativa.",
        "auxilio_fuente": "Decreto 1470 de 2025 (MinTrabajo). Texto verificado.",
        "trm_2026_11_25": 3592.03,
        "trm_fuente": "datos.gov.co 32sa-8pi3 (Superfinanciera), CC BY-SA 4.0; también BanRep API SDMX.",
        "tasa_intervencion_pct_2026_11_24": 12.25,
        "tasa_intervencion_fuente": "Banco de la República, API SDMX, 24-nov-2026.",
        "desempleo_nacional_sep_2026_pct": 8.0,
        "ipc_indice_oct_2026": 161.32,
        "ipc_var_12m_oct_2026_pct": 6.30,
        "ipc_base": "dic-2018=100",
        "licencias": {
            "trm_datos_gov_co": "CC BY-SA 4.0",
            "dane_geih": "no verificada (citar DANE)",
            "dane_ipc": "no verificada (citar DANE)",
            "ole": "no verificada (citar MEN / OLE)",
            "snies": "no verificada (citar MEN / SNIES)",
        },
        "notas": [
            "El OLE publica ingresos en 7 rangos de SMMLV, solo de egresados que cotizan a seguridad social (empleo formal). Corte de seguimiento 2023, años de grado 2001-2022; el CSV de carreras usa la cohorte 2020-2022.",
            "Los tableros BI del OLE con la tasa de cotizantes dieron HTTP 500 el 25-nov-2026: no se publica una tasa de «empleabilidad».",
            "La mediana en SMMLV es una interpolación sobre los tramos agrupados; el tramo abierto «Más de 9 SMMLV» se cierra en 12 solo para interpolar. No es un salario puntual oficial.",
            "No usar las palabras «empleabilidad» ni «campo laboral» en las páginas de Colombia.",
        ],
    }
    path = out / "parametros_laborales_2026.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Parámetros: {path}")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--ole-pkl", type=Path)
    p.add_argument("--snies", type=Path)
    p.add_argument("--ipc-ind", type=Path)
    p.add_argument("--geih-nac", type=Path)
    p.add_argument("--geih-ciu", type=Path)
    p.add_argument("--out", type=Path, default=Path("out"))
    args = p.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    write_params(args.out)
    if args.ole_pkl and args.ole_pkl.exists():
        build_ole(args.ole_pkl, args.out)
    else:
        print("AVISO: no se encontró el pkl de OLE; no se regenera el ranking.")
    if args.snies and args.snies.exists():
        build_snies(args.snies, args.out)
    else:
        print("AVISO: no se encontró SNIES.")
    if args.ipc_ind and args.ipc_ind.exists():
        build_ipc(args.ipc_ind, args.out)
    else:
        print("AVISO: no se encontró IPC.")
    if args.geih_nac and args.geih_ciu and args.geih_nac.exists() and args.geih_ciu.exists():
        build_geih(args.geih_nac, args.geih_ciu, args.out)
    else:
        print("AVISO: no se encontraron series GEIH.")


if __name__ == "__main__":
    main()
