import {
  getRankingCarreras,
  tipoPrincipalDeCarrera,
  type CarreraRecord,
  type RankingItem,
  type TipoIesKey,
} from "./carreras";
import { semestres } from "./formato";

export interface CarreraParecida {
  slug: string;
  nombre: string;
  area: string;
  tipo: TipoIesKey;
  ing4: number | null;
  emp1: number | null;
  dur_real: number | null;
  arancel_med: number | null;
  diferencias: string[];
}

function calcularDiferencias(ref: RankingItem, cand: RankingItem): string[] {
  const diffs: string[] = [];
  if (ref.dur_real && cand.dur_real) {
    const dSem = Math.round((cand.dur_real - ref.dur_real) * 10) / 10;
    if (Math.abs(dSem) >= 0.5) {
      diffs.push(`${dSem > 0 ? "+" : "−"}${semestres(Math.abs(dSem))}`);
    }
  }
  if (ref.arancel_med && cand.arancel_med) {
    const pct = Math.round(((cand.arancel_med - ref.arancel_med) / ref.arancel_med) * 100);
    if (Math.abs(pct) >= 5) {
      diffs.push(`arancel ${pct > 0 ? "+" : "−"}${Math.abs(pct)} %`);
    }
  }
  if (ref.emp1 !== null && cand.emp1 !== null) {
    const pp = Math.round((cand.emp1 - ref.emp1) * 1000) / 10;
    if (Math.abs(pp) >= 2) {
      diffs.push(`${pp > 0 ? "+" : "−"}${Math.abs(pp).toFixed(1).replace(".", ",")} pp. empleo`);
    }
  }
  return diffs.slice(0, 2);
}

/**
 * 4–6 carreras de la misma área y tipo con ingreso 4.º año dentro de ±15 %,
 * ordenadas por cercanía de ingreso y empleabilidad (§5.0).
 * Si no hay suficientes en ±15 % dentro de la misma área, amplía manteniendo área+tipo para evitar fichas huérfanas.
 */
export function carrerasParecidas(carrera: CarreraRecord, tipoForzado?: TipoIesKey): {
  similares: CarreraParecida[];
  menosAnos: CarreraParecida[];
} {
  const principal = tipoPrincipalDeCarrera(carrera);
  const tipo = tipoForzado ?? principal?.key ?? "u";
  const ranking = getRankingCarreras();
  const ref = ranking.find((r) => r.slug === carrera.slug && r.tipo === tipo)
    ?? ranking.find((r) => r.slug === carrera.slug);

  if (!ref) return { similares: [], menosAnos: [] };

  const candidatosArea = ranking.filter(
    (r) => r.slug !== ref.slug && r.tipo === ref.tipo && r.area === ref.area && r.ing4 !== null
  );
  const candidatosAreaOtrosTipos = ranking.filter(
    (r) => r.slug !== ref.slug && r.tipo !== ref.tipo && r.area === ref.area && r.ing4 !== null
  );

  const scoreDist = (c: RankingItem) => {
    const ingDiff = ref.ing4 && c.ing4 ? Math.abs(c.ing4 - ref.ing4) / ref.ing4 : 1;
    const empDiff = ref.emp1 !== null && c.emp1 !== null ? Math.abs(c.emp1 - ref.emp1) : 0.3;
    return ingDiff * 0.7 + empDiff * 0.3;
  };

  let dentro15 = candidatosArea
    .filter((c) => ref.ing4 && c.ing4 && Math.abs(c.ing4 - ref.ing4) / ref.ing4 <= 0.15)
    .sort((a, b) => scoreDist(a) - scoreDist(b));

  if (dentro15.length < 5) {
    const extraCross = candidatosAreaOtrosTipos
      .filter(
        (c) =>
          !dentro15.some((d) => d.slug === c.slug) &&
          ref.ing4 &&
          c.ing4 &&
          Math.abs(c.ing4 - ref.ing4) / ref.ing4 <= 0.12
      )
      .sort((a, b) => scoreDist(a) - scoreDist(b));
    dentro15 = [...dentro15, ...extraCross];
  }

  if (dentro15.length < 4) {
    const extra = candidatosArea
      .filter((c) => !dentro15.some((d) => d.slug === c.slug))
      .sort((a, b) => scoreDist(a) - scoreDist(b));
    dentro15 = [...dentro15, ...extra];
  }
  if (dentro15.length < 4) {
    const extraAreaOtros = candidatosAreaOtrosTipos
      .filter((c) => !dentro15.some((d) => d.slug === c.slug))
      .sort((a, b) => scoreDist(a) - scoreDist(b));
    dentro15 = [...dentro15, ...extraAreaOtros];
  }
  if (dentro15.length < 4) {
    const mismoTipo = ranking
      .filter((r) => r.slug !== ref.slug && r.tipo === ref.tipo && r.ing4 !== null && !dentro15.some((d) => d.slug === r.slug))
      .sort((a, b) => scoreDist(a) - scoreDist(b));
    dentro15 = [...dentro15, ...mismoTipo];
  }

  const similares: CarreraParecida[] = dentro15.slice(0, 6).map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
    area: c.area,
    tipo: c.tipo,
    ing4: c.ing4,
    emp1: c.emp1,
    dur_real: c.dur_real,
    arancel_med: c.arancel_med,
    diferencias: calcularDiferencias(ref, c),
  }));

  // "Mismo sueldo, menos años": ingreso ±10 % y duración real estrictamente menor
  const menosAnos: CarreraParecida[] =
    ref.ing4 && ref.dur_real
      ? ranking
          .filter(
            (c) =>
              c.slug !== ref.slug &&
              c.ing4 !== null &&
              c.dur_real !== null &&
              c.dur_real < ref.dur_real! - 0.4 &&
              Math.abs(c.ing4 - ref.ing4!) / ref.ing4! <= 0.1
          )
          .sort((a, b) => (a.dur_real ?? 99) - (b.dur_real ?? 99))
          .slice(0, 4)
          .map((c) => ({
            slug: c.slug,
            nombre: c.nombre,
            area: c.area,
            tipo: c.tipo,
            ing4: c.ing4,
            emp1: c.emp1,
            dur_real: c.dur_real,
            arancel_med: c.arancel_med,
            diferencias: calcularDiferencias(ref, c),
          }))
      : [];

  return { similares, menosAnos };
}
