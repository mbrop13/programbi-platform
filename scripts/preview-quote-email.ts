/**
 * Generates local HTML previews of the quote email (no SMTP).
 * Run: npx tsx scripts/preview-quote-email.ts
 */

import fs from "node:fs";
import path from "node:path";
import { buildQuoteModel, resolveCourseSlug, calculateQuotePrice } from "../lib/email/quote-data";
import { buildQuoteEmailHtml } from "../lib/email/quote-template";

const outDir = path.join(process.cwd(), "scripts", "previews");
fs.mkdirSync(outDir, { recursive: true });

const futureSchedules = [
  {
    course_slug: "power-bi",
    level_name: "Básico",
    start_date: "2026-10-06",
    schedule_days: "Martes y Jueves",
    schedule_time: "19:30 a 21:30",
    is_active: true,
  },
  {
    course_slug: "sql-server",
    level_name: "Básico",
    start_date: "2026-10-13",
    schedule_days: "Lunes y Miércoles",
    schedule_time: "19:30 a 21:30",
    is_active: true,
  },
  {
    course_slug: "python",
    level_name: "Básico",
    start_date: "2026-10-20",
    schedule_days: "Lunes y Miércoles",
    schedule_time: "19:30 a 21:30",
    is_active: true,
  },
  {
    course_slug: "copilot",
    level_name: "Intermedio-Avanzado",
    start_date: "2026-10-08",
    schedule_days: "Martes y Jueves",
    schedule_time: "19:30 a 21:30",
    is_active: true,
  },
];

const cases: Array<{ file: string; name: string; courses: string[] }> = [
  { file: "quote-analisis.html", name: "Camila Soto", courses: ["Análisis de Datos"] },
  { file: "quote-copilot.html", name: "Diego Pérez", courses: ["Copilot"] },
  { file: "quote-powerbi.html", name: "Ana Torres", courses: ["Power BI"] },
  { file: "quote-ml.html", name: "Ignacio Martínez", courses: ["Machine Learning"] },
];

console.log("— Matching —");
for (const raw of [
  "Análisis de Datos",
  "Copilot",
  "Machine Learning",
  "IA en Productividad",
  "Power Automate",
  "Minería",
  "analisis-de-datos",
  "copilot",
]) {
  console.log(`  ${raw} → ${resolveCourseSlug(raw)}`);
}

console.log("\n— Catalog prices (no promo/override) —");
for (const slug of ["analisis-de-datos", "copilot", "power-bi", "python", "machine-learning"]) {
  const p = calculateQuotePrice(slug, slug === "copilot" ? "Intermedio-Avanzado" : "Básico", [], []);
  console.log(
    `  ${slug}: ${p.finalPrice} (orig ${p.originalPrice}) discount=${p.hasDiscount} ${p.discountPercent}%`
  );
}

for (const c of cases) {
  const model = buildQuoteModel(c.courses, futureSchedules, [], []);
  const html = buildQuoteEmailHtml(c.name.split(" ")[0], model.selected, model.related, model.pack);
  const dest = path.join(outDir, c.file);
  fs.writeFileSync(dest, html, "utf8");
  console.log(`\nWrote ${dest}`);
  console.log(
    "  selected:",
    model.selected.map((x) => `${x.title} ${x.finalPrice}${x.hasDiscount ? ` (was ${x.originalPrice}, -${x.discountPercent}%)` : ""}`).join(" | ")
  );
  console.log(
    "  related:",
    model.related.map((x) => `${x.title} ${x.finalPrice}${x.hasDiscount ? ` -${x.discountPercent}%` : ""}`).join(" | ")
  );
  console.log("  pack:", model.pack.showPackRecommendation ? `${model.pack.offerPrice} vs ${model.pack.origPrice}` : "no");
}

console.log("\nDone.");
