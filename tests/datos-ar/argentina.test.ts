import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import carrerasArJson from "../../data/ar/carreras.json";
import desempleoArJson from "../../data/ar/desempleo.json";
import inflacionArJson from "../../data/ar/inflacion.json";
import {
  getAnuarioDiu2024,
  getCarrerasAr,
  getDisciplinaPorSlugAr,
  getDisciplinasPublicablesAr,
} from "../../lib/datos-ar/carreras";
import {
  ARAUCANO_CC_BY_4_URL,
  datasetAraucanoJsonLd,
  datasetFuenteOficialJsonLd,
  metadataDatosAr,
} from "../../lib/datos-ar/seo";
import {
  metadataHubCarreras,
  metadataPreset,
  metadataSimpleDatos,
} from "../../lib/datos/seo-carreras";
import {
  PARES_HREFLANG_DATOS,
  alternatesSitemapDatosDe,
  hreflangDatosDe,
} from "../../lib/seo/datos-hreflang";

const ROOT = process.cwd();

test("Araucano sin diccionario: diccionarioDisponible=false, 0 nombres inventados y 36 disciplinas publicables_n100", () => {
  const data = getCarrerasAr();
  assert.equal(data.diccionarioDisponible, false);
  assert.equal(data.fichasPublicadas, 0);
  assert.equal(carrerasArJson.diccionarioDisponible, false);

  const disciplinas = getDisciplinasPublicablesAr();
  assert.equal(disciplinas.length, 36);
  assert.equal(data.totalDisciplinasPublicables, 36);

  for (const d of disciplinas) {
    assert.equal(d.nombreOficial, null, `Disciplina ${d.disciplinaId} no debe inventar nombreOficial`);
    assert.equal(d.slug, null, `Disciplina ${d.disciplinaId} no debe inventar slug`);
    assert.ok(d.nConSalarioSipa >= 100, `Disciplina ${d.disciplinaId} bajo umbral n>=100`);
  }

  const excluidasIds = data.disciplinasExcluidasPorUmbral.map((e) => e.disciplinaId).sort((a, b) => a - b);
  assert.deepEqual(excluidasIds, [36, 38]);
  assert.equal(disciplinas.some((d) => d.disciplinaId === 36 || d.disciplinaId === 38), false);
  assert.equal(getDisciplinaPorSlugAr("sistemas"), null);
});

test("DIU 2024 tiene 6 ramas y macro Argentina tiene IPC 2026-10 y desempleo 7.9 %", () => {
  const diu = getAnuarioDiu2024();
  assert.ok(diu, "Falta anuarioDiu2024");
  assert.equal(diu.anio, 2024);
  assert.equal(diu.ramas.length, 6);

  assert.equal(inflacionArJson.actual.mes, "2026-10");
  assert.equal(desempleoArJson.actual.tasaPct, 7.9);
});

test("0 ocurrencias de 'empleabilidad' en lib/datos-ar y data/ar/*.json", () => {
  const archivos: string[] = [];
  for (const dir of ["lib/datos-ar", "data/ar"]) {
    const absDir = path.join(ROOT, dir);
    for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
      if (entry.isFile() && /\.(ts|tsx|json)$/.test(entry.name)) {
        archivos.push(path.join(absDir, entry.name));
      }
    }
  }

  assert.ok(archivos.length >= 8, "Se esperaban archivos en lib/datos-ar y data/ar");
  for (const file of archivos) {
    const content = fs.readFileSync(file, "utf8");
    assert.equal(
      /empleabilidad/i.test(content),
      false,
      `Término prohibido 'empleabilidad' encontrado en ${path.relative(ROOT, file)}`
    );
  }
});

test("Canonicales absolutos /ar/... y licencia CC BY 4.0 solo en Araucano (sin license en INDEC/DIU/BCRA)", () => {
  const subpaths = [
    "",
    "carreras",
    "carreras/mejor-pagadas",
    "carreras/salida-laboral",
    "carreras/mas-demandadas",
    "inflacion",
    "desempleo",
  ];

  for (const subpath of subpaths) {
    const meta = metadataDatosAr({
      subpath,
      title: "Título de prueba Argentina",
      description: "Descripción de prueba para datos públicos de Argentina en ProgramBI.",
    });
    const esperado = subpath
      ? `https://www.programbi.com/ar/datos/${subpath}`
      : "https://www.programbi.com/ar/datos";
    assert.equal(meta.alternates?.canonical, esperado);
  }

  const araucano = datasetAraucanoJsonLd({
    subpath: "carreras",
    name: "Salarios Araucano",
    description: "Salarios de graduados universitarios",
    temporalCoverage: "2019/2021",
    dateModified: "2026-10-01",
  });
  assert.equal(araucano.license, ARAUCANO_CC_BY_4_URL);

  const indecIpc = datasetFuenteOficialJsonLd({
    subpath: "inflacion",
    idSuffix: "dataset-indec-ipc",
    name: "IPC INDEC",
    description: "Índice de Precios al Consumidor",
    organismoNombre: "INDEC",
    organismoUrl: "https://www.indec.gob.ar/",
    temporalCoverage: "2016-12/2026-10",
    dateModified: "2026-10-01",
  });
  assert.equal("license" in indecIpc, false);

  const indecEph = datasetFuenteOficialJsonLd({
    subpath: "desempleo",
    idSuffix: "dataset-indec-eph",
    name: "Desocupación INDEC",
    description: "Tasa de desocupación EPH",
    organismoNombre: "INDEC",
    organismoUrl: "https://www.indec.gob.ar/",
    temporalCoverage: "2025-04/2026-04",
    dateModified: "2026-04-01",
  });
  assert.equal("license" in indecEph, false);

  const diu = datasetFuenteOficialJsonLd({
    subpath: "carreras/mas-demandadas",
    idSuffix: "dataset-diu",
    name: "Anuario DIU 2024",
    description: "Estadísticas universitarias",
    organismoNombre: "SPU / DIU",
    organismoUrl: "https://www.argentina.gob.ar/educacion/universidades/informacion/publicaciones/anuarios",
    temporalCoverage: "2024",
    dateModified: "2026-10-01",
  });
  assert.equal("license" in diu, false);

  const bcra = datasetFuenteOficialJsonLd({
    subpath: "inflacion",
    idSuffix: "dataset-bcra",
    name: "Variables BCRA",
    description: "Series monetarias BCRA",
    organismoNombre: "BCRA",
    organismoUrl: "https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias",
    temporalCoverage: "2026",
    dateModified: "2026-10-01",
  });
  assert.equal("license" in bcra, false);
});

test("Reciprocidad 100 % de los 5 pares es-CL <-> es-AR y x-default = Chile", () => {
  const paresAr = PARES_HREFLANG_DATOS.filter((par) => Boolean(par.ar));
  assert.equal(paresAr.length, 5);

  const paresEsperados: Array<[string, string]> = [
    ["/datos/carreras", "/ar/datos/carreras"],
    ["/datos/carreras/mejor-pagadas", "/ar/datos/carreras/mejor-pagadas"],
    ["/datos/carreras/mas-empleabilidad", "/ar/datos/carreras/salida-laboral"],
    ["/datos/inflacion", "/ar/datos/inflacion"],
    ["/datos/desempleo", "/ar/datos/desempleo"],
  ];

  for (const [cl, ar] of paresEsperados) {
    const langCl = hreflangDatosDe(cl);
    const langAr = hreflangDatosDe(ar);
    assert.ok(langCl, `Falta hreflang para ${cl}`);
    assert.ok(langAr, `Falta hreflang para ${ar}`);
    assert.deepEqual(langCl, langAr, `No hay reciprocidad entre ${cl} y ${ar}`);
    assert.equal(langCl["es-CL"], `https://www.programbi.com${cl}`);
    assert.equal(langCl["es-AR"], `https://www.programbi.com${ar}`);
    assert.equal(langCl["x-default"], `https://www.programbi.com${cl}`);

    assert.deepEqual(alternatesSitemapDatosDe(cl), { languages: langCl });
    assert.deepEqual(alternatesSitemapDatosDe(ar), { languages: langAr });
  }

  for (const noEmparejada of [
    "/ar/datos",
    "/ar/datos/carreras/mas-demandadas",
    "/ar/guias/calcular-aguinaldo-excel",
  ]) {
    assert.equal(hreflangDatosDe(noEmparejada), undefined, `${noEmparejada} no debe tener par hreflang`);
    assert.equal(alternatesSitemapDatosDe(noEmparejada), undefined);
  }
  assert.equal(hreflangDatosDe("/datos/carreras/medicina")?.["es-AR"], undefined);

  // Verificar integración en metadata de Chile y Argentina
  assert.deepEqual(metadataHubCarreras().alternates?.languages, hreflangDatosDe("/datos/carreras"));
  assert.deepEqual(
    metadataPreset("mejor-pagadas").alternates?.languages,
    hreflangDatosDe("/datos/carreras/mejor-pagadas")
  );
  assert.deepEqual(
    metadataPreset("mas-empleabilidad").alternates?.languages,
    hreflangDatosDe("/datos/carreras/mas-empleabilidad")
  );
  assert.deepEqual(
    metadataSimpleDatos({
      path: "/datos/inflacion",
      title: "Inflación e IPC en Chile 2026",
      description:
        "Revisa la variación mensual e interanual del IPC oficial en Chile según el INE y descarga la serie histórica actualizada para analizar precios.",
    }).alternates?.languages,
    hreflangDatosDe("/datos/inflacion")
  );
  assert.deepEqual(
    metadataDatosAr({
      subpath: "desempleo",
      title: "Desempleo en Argentina 2026",
      description: "Tasa de desocupación INDEC EPH.",
    }).alternates?.languages,
    hreflangDatosDe("/ar/datos/desempleo")
  );
});
