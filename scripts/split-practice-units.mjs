import fs from "fs";
import path from "path";

const src = fs.readFileSync("lib/practice/levels.ts", "utf8");
const lines = src.split(/\n/);
const units = [
  { id: "power-bi", start: 16, end: 1704 },
  { id: "sql-server", start: 1705, end: 3393 },
  { id: "inteligencia-artificial", start: 3394, end: 5082 },
  { id: "python", start: 5083, end: 6771 },
  { id: "excel", start: 6772, end: 8460 },
];
const dir = "lib/practice/units";
fs.mkdirSync(dir, { recursive: true });
for (const u of units) {
  let body = lines.slice(u.start - 1, u.end).join("\n").trim();
  if (body.endsWith(",")) body = body.slice(0, -1);
  const out = `import type { Unit } from "../types";\n\nconst unit: Unit = ${body};\n\nexport default unit;\n`;
  fs.writeFileSync(path.join(dir, `${u.id}.ts`), out);
  console.log(u.id, "ok", u.end - u.start + 1);
}
