#!/usr/bin/env node
/**
 * Auditoría integral de las guías paso a paso (Tanda 1 + Tanda 2) + power-bi-vs-excel.
 * Valida SEO, conteo de palabras, solapamiento de shingles de 8 palabras (<10%),
 * capturas en CAPTURAS.md, ausencia de datos inventados/credenciales,
 * prompts y verificación IA, enlaces externos e internos, endpoints mindicador/BCCh y sintaxis de código.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const DIR_PASO = join(ROOT, "content", "guias", "paso-a-paso");
const DIR_GUIAS_CONTENT = join(ROOT, "content", "guias");
const PATH_VS_EXCEL = join(ROOT, "content", "guias", "transversales", "power-bi-vs-excel.md");
const OUT_JSON = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : null;
const NO_NET = process.argv.includes("--no-net");

const INSIGNIA = new Set([
  // Tanda 1
  "automatizar-reportes-con-power-bi",
  "automatizar-excel-con-power-query",
  "enviar-reportes-automaticos-con-power-automate",
  "dashboard-de-ventas-en-power-bi-paso-a-paso",
  // Tanda 2
  "chatgpt-para-analisis-de-datos",
  "ia-para-excel-chatgpt-claude-gemini",
  "ia-para-power-bi-dax",
  "python-para-analisis-de-datos",
  "consultas-sql-ejemplos",
]);

function loadTsGuia(filePath) {
  const source = readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const mod = { exports: {} };
  const fn = new Function("exports", "require", "module", transpiled.outputText);
  fn(mod.exports, (id) => {
    if (id.startsWith("@/")) {
      return {};
    }
    return require(id);
  }, mod);
  return mod.exports.default || mod.exports.guia;
}

function loadLegacyGuias() {
  const raw = readFileSync(join(ROOT, "lib", "guias", "generado.ts"), "utf8");
  const json = raw.slice(raw.indexOf("= [") + 2, raw.lastIndexOf(";"));
  return JSON.parse(json);
}

function parseMarkdownFile(filePath) {
  const raw = readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      if (!line.trim() || /^\s/.test(line)) continue;
      const idx = line.indexOf(":");
      if (idx > 0) fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  const body = m ? raw.slice(m[0].length) : raw;
  return { fm, body };
}

function extractPlainTextFromGuia(g) {
  const parts = [
    g.h1,
    g.subtitle,
    g.en30Segundos.queLogras,
    g.en30Segundos.herramienta,
    g.en30Segundos.tiempo,
    ...g.en30Segundos.bullets,
    g.requisitos.version,
    ...g.requisitos.lista,
    g.requisitos.compatibilidadMacWeb,
    g.requisitos.avisoEducativo || "",
    g.avisoPrivacidad || "",
  ];
  for (const s of g.secciones) {
    parts.push(s.titulo, ...s.parrafos);
    if (s.lista) parts.push(...s.lista);
    if (s.listaOrdenada) parts.push(...s.listaOrdenada);
    if (s.alerta) parts.push(s.alerta.titulo, s.alerta.texto);
    if (s.verificaResultado) parts.push(s.verificaResultado);
    if (s.tabla) {
      if (s.tabla.caption) parts.push(s.tabla.caption);
      parts.push(...s.tabla.encabezados, ...s.tabla.filas.flat());
    }
    if (s.subsecciones) {
      for (const sub of s.subsecciones) {
        parts.push(sub.titulo, ...sub.parrafos);
        if (sub.lista) parts.push(...sub.lista);
        if (sub.tabla) {
          if (sub.tabla.caption) parts.push(sub.tabla.caption);
          parts.push(...sub.tabla.encabezados, ...sub.tabla.filas.flat());
        }
      }
    }
  }
  for (const err of g.erroresComunes) {
    parts.push(err.error, err.causa, err.solucion);
  }
  for (const f of g.faqs) {
    parts.push(f.q, f.a);
  }
  return parts.filter(Boolean).join(" ");
}

function normalizeWords(text) {
  return text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function buildShingles(words, n = 8) {
  const set = new Set();
  for (let i = 0; i + n <= words.length; i++) {
    set.add(words.slice(i, i + n).join(" "));
  }
  return set;
}

function collectCapturas(g) {
  const caps = [];
  for (const s of g.secciones) {
    if (s.captura) caps.push(s.captura);
    if (s.subsecciones) {
      for (const sub of s.subsecciones) {
        if (sub.captura) caps.push(sub.captura);
      }
    }
  }
  return caps;
}

function collectCodes(g) {
  const codes = [];
  for (const s of g.secciones) {
    if (s.codigos) codes.push(...s.codigos);
    if (s.subsecciones) {
      for (const sub of s.subsecciones) {
        if (sub.codigo) codes.push(sub.codigo);
      }
    }
  }
  return codes;
}

function checkBalancedParens(code) {
  let depth = 0;
  let inDouble = false;
  let inSingle = false;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (!inDouble && !inSingle) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(t);
    return { url, status: res.status, finalUrl: res.url, ok: res.status >= 200 && res.status < 400 };
  } catch (err) {
    return { url, status: 0, error: err?.message || String(err), ok: false };
  }
}

async function main() {
  const files = readdirSync(DIR_PASO)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();
  const guias = files.map((f) => loadTsGuia(join(DIR_PASO, f)));
  const legacyGuias = loadLegacyGuias();
  const rootLegacySlugs = new Set(
    legacyGuias.filter((g) => g.path.startsWith("/guias/")).map((g) => g.slug)
  );
  const newSlugs = new Set(guias.map((g) => g.slug));
  const indexSource = readFileSync(join(DIR_PASO, "index.ts"), "utf8");
  const vsExcel = parseMarkdownFile(PATH_VS_EXCEL);

  const errors = [];
  const warnings = [];
  const summary = [];

  const textDocs = [];

  for (const g of guias) {
    const plain = extractPlainTextFromGuia(g);
    const words = normalizeWords(plain);
    const minWords = INSIGNIA.has(g.slug) ? 2000 : 1500;
    const caps = collectCapturas(g);
    const codes = collectCodes(g);
    const sectionIds = new Set(g.secciones.map((s) => s.id));
    const hasTable = g.secciones.some(
      (s) => Boolean(s.tabla) || Boolean(s.subsecciones?.some((sub) => Boolean(sub.tabla)))
    );
    const howToSteps = g.secciones.filter((s) => s.esPasoHowTo);

    if (g.title.length > 60) errors.push(`${g.slug}: title length ${g.title.length} > 60`);
    if (g.meta.length < 140 || g.meta.length > 155) {
      errors.push(`${g.slug}: meta length ${g.meta.length} not in [140, 155]`);
    }
    if (words.length < minWords) {
      errors.push(`${g.slug}: ${words.length} words < ${minWords}`);
    }
    if (g.en30Segundos.bullets.length < 3 || g.en30Segundos.bullets.length > 5) {
      errors.push(`${g.slug}: en30Segundos.bullets=${g.en30Segundos.bullets.length}`);
    }
    if (g.rutaVisual.length < 4 || g.rutaVisual.length > 7) {
      errors.push(`${g.slug}: rutaVisual=${g.rutaVisual.length}`);
    }
    for (const p of g.rutaVisual) {
      if (!sectionIds.has(p.anchorId)) {
        errors.push(`${g.slug}: rutaVisual anchor #${p.anchorId} missing in secciones`);
      }
    }
    if (!hasTable) errors.push(`${g.slug}: missing comparison table`);
    if (!g.omitirHowTo && howToSteps.length < 3) {
      errors.push(`${g.slug}: howToSteps=${howToSteps.length} < 3`);
    }
    if (!indexSource.includes(`./${g.slug}`)) {
      errors.push(`${g.slug}: missing import/export in content/guias/paso-a-paso/index.ts`);
    }
    if (g.erroresComunes.length < 3 || g.erroresComunes.length > 6) {
      errors.push(`${g.slug}: erroresComunes=${g.erroresComunes.length}`);
    }
    if (g.faqs.length < 4 || g.faqs.length > 8) {
      errors.push(`${g.slug}: faqs=${g.faqs.length}`);
    }
    if (g.relacionadas.length !== 3) {
      errors.push(`${g.slug}: relacionadas=${g.relacionadas.length}`);
    }
    for (const r of g.relacionadas) {
      if (r === g.slug || (!newSlugs.has(r) && !rootLegacySlugs.has(r))) {
        errors.push(`${g.slug}: invalid relacionada "${r}"`);
      }
    }
    for (const extra of g.enlacesInternosExtra || []) {
      if (extra.href.startsWith("/guias/")) {
        const targetSlug = extra.href.slice("/guias/".length);
        if (targetSlug && !newSlugs.has(targetSlug) && !rootLegacySlugs.has(targetSlug)) {
          errors.push(`${g.slug}: invalid enlacesInternosExtra href "${extra.href}"`);
        }
      }
    }
    if (g.esGuiaIA) {
      const promptBlocks = codes.filter((c) => c.lenguaje === "prompt").length;
      const verificaCount = g.secciones.filter((s) => Boolean(s.verificaResultado)).length;
      if (promptBlocks < 5) {
        errors.push(`${g.slug}: esGuiaIA has only ${promptBlocks} prompt blocks (< 5)`);
      }
      if (verificaCount < 1) {
        errors.push(`${g.slug}: esGuiaIA missing verificaResultado box`);
      }
    }
    for (const ext of g.enlacesExternos || []) {
      if (/support\.microsoft\.com|Web_Services\/index_EN\.htm/i.test(ext.url)) {
        errors.push(`${g.slug}: blocked/broken official URL pattern (${ext.url})`);
      }
    }

    // Check CAPTURAS.md
    const capturasPath = join(DIR_GUIAS_CONTENT, g.slug, "CAPTURAS.md");
    if (!existsSync(capturasPath)) {
      errors.push(`${g.slug}: missing CAPTURAS.md`);
    } else {
      const capMd = readFileSync(capturasPath, "utf8");
      for (const c of caps) {
        if (!c.id || !c.alt || !c.caption) {
          errors.push(`${g.slug}: captura missing id/alt/caption`);
        }
        if (!capMd.includes(c.id)) {
          errors.push(`${g.slug}: captura "${c.id}" not listed in CAPTURAS.md`);
        }
      }
    }

    // Check code blocks
    let codeWarnings = 0;
    for (const c of codes) {
      if (c.lenguaje === "json") {
        try {
          JSON.parse(c.codigo);
        } catch (e) {
          errors.push(`${g.slug}: invalid JSON block "${c.titulo}": ${e.message}`);
        }
      }
      if (c.lenguaje === "excel") {
        if (!checkBalancedParens(c.codigo)) {
          errors.push(`${g.slug}: unbalanced parens in Excel ES "${c.titulo}"`);
        }
        if (c.codigoEn && !checkBalancedParens(c.codigoEn)) {
          errors.push(`${g.slug}: unbalanced parens in Excel EN "${c.titulo}"`);
        }
        if (c.codigo.includes("(") && c.codigo.includes(";") && !c.codigoEn) {
          warnings.push(`${g.slug}: Excel formula "${c.titulo}" missing codigoEn`);
          codeWarnings++;
        }
      }
      if (c.lenguaje === "vba" && !/Option Explicit/i.test(c.codigo)) {
        warnings.push(`${g.slug}: VBA block "${c.titulo}" without Option Explicit`);
      }
    }

    // Check forbidden strings (hardcoded prices, ratings, fake testimonials)
    const rawTs = readFileSync(join(DIR_PASO, `${g.slug}.ts`), "utf8");
    if (/aggregateRating|reviewCount|"review"\s*:/i.test(rawTs)) {
      errors.push(`${g.slug}: forbidden schema rating/review`);
    }
    if (/(?:169|338|349|249)[.,]000\b/.test(rawTs)) {
      errors.push(`${g.slug}: hardcoded course price detected`);
    }
    if (
      (g.slug === "liquidacion-de-sueldo-en-excel-chile" ||
        g.slug === "calcular-finiquito-chile-excel") &&
      !g.requisitos.avisoEducativo
    ) {
      errors.push(`${g.slug}: missing avisoEducativo`);
    }

    textDocs.push({
      slug: g.slug,
      words: words.length,
      shingles: buildShingles(words, 8),
    });

    summary.push({
      slug: g.slug,
      curso: g.curso,
      herramienta: g.herramienta,
      nivel: g.nivel,
      esInsignia: Boolean(g.esInsignia || INSIGNIA.has(g.slug)),
      title: g.title,
      titleLen: g.title.length,
      metaLen: g.meta.length,
      keywordPrincipal: g.keywordPrincipal,
      words: words.length,
      minWords,
      howToSteps: howToSteps.length,
      capturas: caps.length,
      codigos: codes.length,
      faqs: g.faqs.length,
      erroresComunes: g.erroresComunes.length,
      maxOverlapPct: 0,
      maxOverlapWith: "",
    });
  }

  // Also include power-bi-vs-excel in shingle check and metadata check
  const vsTitle = vsExcel.fm.title || "";
  const vsDesc = vsExcel.fm.description || "";
  if (vsTitle.length > 60) errors.push(`power-bi-vs-excel: title length ${vsTitle.length} > 60`);
  if (vsDesc.length < 140 || vsDesc.length > 155) {
    errors.push(`power-bi-vs-excel: description length ${vsDesc.length} not in [140, 155]`);
  }
  const vsWords = normalizeWords(vsExcel.body);
  textDocs.push({
    slug: "power-bi-vs-excel",
    words: vsWords.length,
    shingles: buildShingles(vsWords, 8),
  });

  // Pairwise 8-word shingle overlap (< 10%)
  let worstOverlap = { pct: 0, pair: "" };
  for (let i = 0; i < textDocs.length; i++) {
    for (let j = i + 1; j < textDocs.length; j++) {
      const a = textDocs[i];
      const b = textDocs[j];
      const [small, big] = a.shingles.size <= b.shingles.size ? [a, b] : [b, a];
      let common = 0;
      for (const s of small.shingles) if (big.shingles.has(s)) common++;
      const pct = small.shingles.size ? (common / small.shingles.size) * 100 : 0;
      if (pct > worstOverlap.pct) {
        worstOverlap = { pct, pair: `${a.slug} <-> ${b.slug} (${common} shingles)` };
      }
      const sA = summary.find((x) => x.slug === a.slug);
      const sB = summary.find((x) => x.slug === b.slug);
      if (sA && pct > sA.maxOverlapPct) {
        sA.maxOverlapPct = Number(pct.toFixed(2));
        sA.maxOverlapWith = b.slug;
      }
      if (sB && pct > sB.maxOverlapPct) {
        sB.maxOverlapPct = Number(pct.toFixed(2));
        sB.maxOverlapWith = a.slug;
      }
      if (pct >= 10) {
        errors.push(`Shingle overlap ${pct.toFixed(2)}% >= 10%: ${a.slug} <-> ${b.slug}`);
      }
    }
  }

  // Keyword uniqueness check across all new guides
  const kwMap = new Map();
  for (const s of summary) {
    const k = s.keywordPrincipal.toLowerCase().trim();
    if (kwMap.has(k)) {
      errors.push(`Duplicate keywordPrincipal "${s.keywordPrincipal}" in ${kwMap.get(k)} and ${s.slug}`);
    }
    kwMap.set(k, s.slug);
  }

  // External link check
  const allExtUrls = new Set();
  for (const g of guias) {
    for (const ext of g.enlacesExternos) allExtUrls.add(ext.url);
  }
  for (const m of vsExcel.body.matchAll(/https?:\/\/[^\s)>"]+/g)) {
    allExtUrls.add(m[0]);
  }
  // Also add sources from frontmatter of power-bi-vs-excel
  allExtUrls.add("https://learn.microsoft.com/es-es/power-bi/fundamentals/power-bi-overview");

  let urlResults = [];
  let brokenUrls = [];
  const endpoints = {};
  let servicioWebTest = null;
  let bcchTest = null;

  if (!NO_NET) {
    console.log(`Checking ${allExtUrls.size} external URLs...`);
    urlResults = await Promise.all([...allExtUrls].map((u) => checkUrl(u)));
    brokenUrls = urlResults.filter((r) => !r.ok);

    // Live mindicador & BCCh endpoint tests
    for (const ind of ["dolar", "uf", "utm", "ipc"]) {
      try {
        const r = await fetch(`https://mindicador.cl/api/${ind}`, { signal: AbortSignal.timeout(10000) });
        const data = await r.json();
        endpoints[`mindicador_${ind}`] = {
          status: r.status,
          count: data?.serie?.length ?? 0,
          latest: data?.serie?.[0] ?? null,
        };
      } catch (e) {
        endpoints[`mindicador_${ind}`] = { status: 0, error: e?.message || String(e) };
      }
    }

    // Test Excel SERVICIOWEB extraction logic on live mindicador dolar JSON
    try {
      const rawDolar = await fetch("https://mindicador.cl/api/dolar", { signal: AbortSignal.timeout(10000) }).then((r) =>
        r.text()
      );
      const marker = '"valor":';
      const after = rawDolar.slice(rawDolar.indexOf(marker) + marker.length);
      const before = after.slice(0, after.indexOf("}"));
      servicioWebTest = { parsedValue: Number(before.trim()), rawSnippet: before.trim() };
    } catch (e) {
      servicioWebTest = { error: e?.message || String(e) };
    }

    // Reachability of BCCh REST endpoint (without real credentials)
    try {
      const r = await fetch(
        "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=DEMO&pass=DEMO&function=GetSeries&timeseries=F073.TCO.PRE.Z.D&firstdate=2026-11-01",
        { signal: AbortSignal.timeout(12000) }
      );
      const txt = await r.text();
      bcchTest = { status: r.status, responseSnippet: txt.slice(0, 180) };
    } catch (e) {
      bcchTest = { status: 0, error: e?.message || String(e) };
    }
  } else {
    console.log(`--no-net activo: se omiten verificaciones de red (${allExtUrls.size} URLs externas).`);
  }

  const report = {
    totalGuias: summary.length,
    vsExcel: {
      title: vsTitle,
      titleLen: vsTitle.length,
      descriptionLen: vsDesc.length,
      words: vsWords.length,
    },
    worstOverlap: {
      pct: Number(worstOverlap.pct.toFixed(2)),
      pair: worstOverlap.pair,
    },
    errors,
    warnings,
    brokenUrls,
    urlResults,
    endpoints,
    servicioWebTest,
    bcchTest,
    summary,
  };

  if (OUT_JSON) {
    mkdirSync(dirname(OUT_JSON), { recursive: true });
    writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");
  }

  console.log(`\n=== RESUMEN AUDITORÍA (${summary.length} guías + power-bi-vs-excel) ===`);
  console.log(`Peor solapamiento (shingles 8 palabras): ${report.worstOverlap.pct}% — ${report.worstOverlap.pair}`);
  console.log(`Errores estructurales/SEO: ${errors.length}`);
  for (const e of errors) console.log(`  [ERROR] ${e}`);
  console.log(`Avisos: ${warnings.length}`);
  for (const w of warnings) console.log(`  [WARN]  ${w}`);
  console.log(`URLs externas fallidas: ${brokenUrls.length} / ${urlResults.length}`);
  for (const b of brokenUrls) console.log(`  [URL ${b.status}] ${b.url} (${b.error || ""})`);
  console.log(`Endpoints mindicador:`, JSON.stringify(endpoints));
  console.log(`SERVICIOWEB test:`, JSON.stringify(servicioWebTest));
  console.log(`BCCh reachability:`, JSON.stringify(bcchTest));

  if (errors.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
