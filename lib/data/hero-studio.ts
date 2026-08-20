export type StackId = "python" | "powerbi" | "sql";
export type TokenKind = "comment" | "string" | "keyword" | "fn" | "number" | "plain";
export type KpiId = "ventas" | "tickets" | "ticket" | "yoy";

export type RegionRow = {
  id: string;
  name: string;
  ventas: number;
  tickets: number;
  yoy: number;
  note: string;
};

export const REGIONS: RegionRow[] = [
  { id: "rm", name: "Metropolitana", ventas: 142.3, tickets: 18420, yoy: 14, note: "Retail + e-commerce" },
  { id: "vs", name: "Valparaíso", ventas: 48.1, tickets: 6104, yoy: 9, note: "Puertos y retail" },
  { id: "bi", name: "Biobío", ventas: 36.7, tickets: 4812, yoy: 11, note: "Industria y consumo" },
  { id: "an", name: "Antofagasta", ventas: 29.4, tickets: 3201, yoy: 16, note: "Minería y servicios" },
  { id: "ll", name: "Los Lagos", ventas: 18.9, tickets: 2447, yoy: 7, note: "Alimentos y turismo" },
];

export const MONTHS = [18, 21, 19, 24, 22, 26, 25, 28, 27, 31, 29, 33];

export type StudioStack = {
  id: StackId;
  label: string;
  file: string;
  lang: string;
  href: string;
  source: string;
  chips: { id: string; label: string }[];
};

export const STACKS: StudioStack[] = [
  {
    id: "python",
    label: "Python",
    file: "ventas.py",
    lang: "Python 3.12",
    href: "notebook",
    chips: [
      { id: "groupby", label: "groupby región" },
      { id: "top", label: "head(5)" },
      { id: "plot", label: "barras" },
    ],
    source: `df.groupby("region")["monto"].sum().sort_values(ascending=False).head(5)`,
  },
  {
    id: "powerbi",
    label: "Power BI",
    file: "medidas.dax",
    lang: "DAX",
    href: "reporte",
    chips: [
      { id: "ytd", label: "Ventas YTD" },
      { id: "slicer", label: "Slicer región" },
      { id: "yoy", label: "YoY %" },
    ],
    source: `Ventas YTD = CALCULATE(SUM(Ventas[Monto]), DATESYTD(Calendario[Fecha]))`,
  },
  {
    id: "sql",
    label: "SQL Server",
    file: "consulta.sql",
    lang: "T-SQL",
    href: "query",
    chips: [
      { id: "order", label: "ORDER BY ventas" },
      { id: "join", label: "JOIN regiones" },
      { id: "top", label: "TOP 5" },
    ],
    source: `SELECT r.nombre, SUM(v.monto) AS ventas FROM ventas v JOIN regiones r ON r.id = v.region_id GROUP BY r.nombre ORDER BY ventas DESC`,
  },
];

export function formatMillions(n: number) {
  return `$${n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
}

export function formatInt(n: number) {
  return n.toLocaleString("es-CL");
}

export function ticketMedio(row: { ventas: number; tickets: number }) {
  if (!row.tickets) return 0;
  return Math.round((row.ventas * 1_000_000) / row.tickets);
}

export function formatTicket(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

const PYTHON_KW =
  /^(import|from|as|def|class|return|if|elif|else|for|in|with|True|False|None)\b/;
const PYTHON_FN = /^(print|read_csv|groupby|sum|sort_values|head|pd)\b/;
const DAX_FN = /^(CALCULATE|SUM|DATESYTD|DIVIDE|DATEADD|GETDATE|COUNT)\b/;
const SQL_KW =
  /^(SELECT|AS|FROM|JOIN|ON|WHERE|GROUP|BY|ORDER|DESC|ASC|AND|OR|INNER|LEFT|TOP)\b/i;
const SQL_FN = /^(SUM|COUNT|DATEADD|GETDATE)\b/i;

function take(source: string, i: number, re: RegExp): string | null {
  const m = re.exec(source.slice(i));
  return m && m.index === 0 ? m[0] : null;
}

export function tokenize(id: StackId, source: string): { kind: TokenKind; text: string }[] {
  const tokens: { kind: TokenKind; text: string }[] = [];
  let i = 0;

  while (i < source.length) {
    let hit: string | null = null;

    if (id === "python") hit = take(source, i, /^#[^\n]*/);
    else if (id === "sql") hit = take(source, i, /^--[^\n]*/);
    else hit = take(source, i, /^\/\/[^\n]*/);
    if (hit) {
      tokens.push({ kind: "comment", text: hit });
      i += hit.length;
      continue;
    }

    hit = take(source, i, /^"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/);
    if (hit) {
      tokens.push({ kind: "string", text: hit });
      i += hit.length;
      continue;
    }

    if (id === "powerbi") {
      hit = take(source, i, /\[[^\]]+\]/);
      if (hit) {
        tokens.push({ kind: "string", text: hit });
        i += hit.length;
        continue;
      }
    }

    hit = take(source, i, /^\d[\d,]*\.?\d*/);
    if (hit) {
      tokens.push({ kind: "number", text: hit });
      i += hit.length;
      continue;
    }

    if (id === "python") {
      hit = take(source, i, PYTHON_KW);
      if (hit) {
        tokens.push({ kind: "keyword", text: hit });
        i += hit.length;
        continue;
      }
      hit = take(source, i, /^\.[A-Za-z_]\w*/);
      if (hit) {
        tokens.push({ kind: "fn", text: hit });
        i += hit.length;
        continue;
      }
      hit = take(source, i, PYTHON_FN);
      if (hit) {
        tokens.push({ kind: "fn", text: hit });
        i += hit.length;
        continue;
      }
    } else if (id === "sql") {
      hit = take(source, i, SQL_KW);
      if (hit) {
        tokens.push({ kind: "keyword", text: hit });
        i += hit.length;
        continue;
      }
      hit = take(source, i, SQL_FN);
      if (hit) {
        tokens.push({ kind: "fn", text: hit });
        i += hit.length;
        continue;
      }
    } else {
      hit = take(source, i, DAX_FN);
      if (hit) {
        tokens.push({ kind: "fn", text: hit });
        i += hit.length;
        continue;
      }
    }

    const rest = take(source, i, /^[A-Za-z_áéíóúñÁÉÍÓÚÑ%][\wáéíóúñÁÉÍÓÚÑ%]*/);
    if (rest) {
      tokens.push({ kind: "plain", text: rest });
      i += rest.length;
      continue;
    }

    tokens.push({ kind: "plain", text: source[i] });
    i += 1;
  }

  return tokens;
}
