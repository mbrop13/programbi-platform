"""Actualiza la ficha SP. Requiere Python 3 y pypdf (pip install pypdf)."""

import hashlib
import io
import json
import re
import urllib.request
from pathlib import Path

from pypdf import PdfReader

INDEX = "https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-10102.html"
BASE = "https://www.spensiones.cl/portal/institucional/594/"
MONTHS = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]


def get(url):
    request = urllib.request.Request(url, headers={"User-Agent": "ProgramBI datos/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


html = get(INDEX).decode("utf-8")
pattern = (
    r'href="(articles-\d+_recurso_1\.pdf)(?:\?[^"]*)?" '
    r'title="Ir a Ficha Estadística del Seguro de Cesantía N°\s*(\d+),\s*('
    + "|".join(MONTHS)
    + r')\s+(\d{4})"'
)
entries = re.findall(pattern, html, re.I)
if not entries:
    raise ValueError("No se encontró una ficha oficial en el índice")
file, edition, issue_month, issue_year = max(
    entries, key=lambda item: (int(item[3]), MONTHS.index(item[2].lower()))
)
url = BASE + file
raw = get(url)
text = "\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(raw)).pages)
# La ficha de junio de 2026 informa beneficiarios de mayo: los períodos se leen
# por separado. No se supone que todos los cuadros tengan el mes de la portada.
match = re.search(
    r"Tabla N°\s*9\s+Seguro de Cesantía y Seguro de Lagunas: Beneficiarios y montos de\s+"
    r"beneficio promedio según sexo, tipo de contrato y tipo de prestación\s*\(1\)\s+("
    + "|".join(MONTHS)
    + r")\s+de\s+(\d{4})(.*?)\(1\)",
    text,
    re.I | re.S,
)
if not match:
    raise ValueError("Ficha SP: estructura de tabla 9 cambió; no se escribe ningún dato")
period_month, period_year, table = match.groups()


def count(label):
    found = re.search(r"(?:^|\s)" + re.escape(label) + r"\s+([\d.]+)\s+[\d,]+%", table)
    if not found:
        raise ValueError("Ficha SP: falta fila " + label)
    return int(found.group(1).replace(".", ""))


data = {
    "periodo": f"{period_year}-{MONTHS.index(period_month.lower()) + 1:02}",
    "periodo_label": f"{period_month.lower()} {period_year}",
    "ficha": f"{issue_month.lower()} {issue_year}",
    "edicion": int(edition),
    "source": url,
    "index": INDEX,
    "sha256": hashlib.sha256(raw).hexdigest(),
    "total": count("Total"),
    "cic": count("CIC"),
    "fcs": count("FCS"),
    "sexo": {"hombres": count("Hombres"), "mujeres": count("Mujeres")},
    "contrato": {
        "indefinido": count("Indefinido"),
        "plazo_fijo": count("Plazo Fijo"),
        "casa_particular": count("T. Casa Particular"),
    },
}
for label, subtotal in (
    ("CIC + FCS", data["cic"] + data["fcs"]),
    ("sexo", sum(data["sexo"].values())),
    ("contrato", sum(data["contrato"].values())),
):
    if data["total"] <= 0 or subtotal != data["total"]:
        raise ValueError(f"Ficha SP: desglose {label} no coincide con total")

path = Path("data/datos-fase3/seguro.json")
if path.exists() and json.loads(path.read_text(encoding="utf-8"))["periodo"] > data["periodo"]:
    raise ValueError("Ficha SP: el periodo retrocede")
path.parent.mkdir(parents=True, exist_ok=True)
tmp = path.with_suffix(".tmp")
tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
tmp.replace(path)
print(
    f"SP {data['periodo_label']} (ficha {data['ficha']}): {data['total']} beneficiarios; "
    "CIC + FCS, sexo y contrato coinciden con total."
)
