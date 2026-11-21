export type SyntaxTokenType =
  | "plain"
  | "keyword"
  | "function"
  | "string"
  | "number"
  | "comment"
  | "operator";

export interface SyntaxToken {
  type: SyntaxTokenType;
  value: string;
}

export type SyntaxLanguage =
  | "dax"
  | "sql"
  | "python"
  | "excel"
  | "m"
  | "bash"
  | "plain";

interface LanguageSpec {
  caseInsensitive: boolean;
  lineComments: string[];
  blockComments: boolean;
  tripleQuotes: boolean;
  keywords: Set<string>;
  functions: Set<string>;
}

const DAX_SPEC: LanguageSpec = {
  caseInsensitive: true,
  lineComments: ["--", "//"],
  blockComments: true,
  tripleQuotes: false,
  keywords: new Set([
    "VAR",
    "RETURN",
    "EVALUATE",
    "DEFINE",
    "MEASURE",
    "COLUMN",
    "TABLE",
    "ORDER",
    "BY",
    "ASC",
    "DESC",
    "IN",
    "NOT",
    "AND",
    "OR",
    "TRUE",
    "FALSE",
    "BLANK",
  ]),
  functions: new Set([
    "CALCULATE",
    "CALCULATETABLE",
    "SUM",
    "SUMX",
    "AVERAGE",
    "AVERAGEX",
    "COUNT",
    "COUNTA",
    "COUNTROWS",
    "DISTINCTCOUNT",
    "DIVIDE",
    "FILTER",
    "ALL",
    "ALLEXCEPT",
    "ALLSELECTED",
    "VALUES",
    "DISTINCT",
    "RELATED",
    "RELATEDTABLE",
    "USERELATIONSHIP",
    "DATEADD",
    "DATESYTD",
    "TOTALYTD",
    "SAMEPERIODLASTYEAR",
    "DATESBETWEEN",
    "IF",
    "SWITCH",
    "COALESCE",
    "SELECTEDVALUE",
    "HASONEVALUE",
    "KEEPFILTERS",
    "REMOVEFILTERS",
    "TREATAS",
    "SUMMARIZE",
    "SUMMARIZECOLUMNS",
    "ADDCOLUMNS",
    "SELECTCOLUMNS",
    "RANKX",
    "TOPN",
    "ISBLANK",
    "FORMAT",
    "MIN",
    "MAX",
  ]),
};

const SQL_SPEC: LanguageSpec = {
  caseInsensitive: true,
  lineComments: ["--"],
  blockComments: true,
  tripleQuotes: false,
  keywords: new Set([
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP",
    "BY",
    "HAVING",
    "ORDER",
    "ASC",
    "DESC",
    "LIMIT",
    "OFFSET",
    "TOP",
    "JOIN",
    "INNER",
    "LEFT",
    "RIGHT",
    "FULL",
    "OUTER",
    "CROSS",
    "ON",
    "AS",
    "AND",
    "OR",
    "NOT",
    "IN",
    "IS",
    "NULL",
    "TRUE",
    "FALSE",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "WITH",
    "UNION",
    "ALL",
    "DISTINCT",
    "INSERT",
    "INTO",
    "VALUES",
    "UPDATE",
    "SET",
    "DELETE",
    "CREATE",
    "ALTER",
    "DROP",
    "TABLE",
    "VIEW",
    "INDEX",
    "OVER",
    "PARTITION",
    "ROWS",
    "RANGE",
    "BETWEEN",
    "LIKE",
    "ILIKE",
    "EXISTS",
    "CAST",
    "CONVERT",
  ]),
  functions: new Set([
    "COUNT",
    "SUM",
    "AVG",
    "MIN",
    "MAX",
    "COALESCE",
    "NULLIF",
    "ROW_NUMBER",
    "RANK",
    "DENSE_RANK",
    "LAG",
    "LEAD",
    "FIRST_VALUE",
    "LAST_VALUE",
    "DATE_TRUNC",
    "DATEADD",
    "DATEDIFF",
    "EXTRACT",
    "CONCAT",
    "SUBSTRING",
    "TRIM",
    "LOWER",
    "UPPER",
    "ROUND",
    "ABS",
    "STRING_AGG",
  ]),
};

const PYTHON_SPEC: LanguageSpec = {
  caseInsensitive: false,
  lineComments: ["#"],
  blockComments: false,
  tripleQuotes: true,
  keywords: new Set([
    "def",
    "return",
    "import",
    "from",
    "as",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "in",
    "not",
    "and",
    "or",
    "is",
    "None",
    "True",
    "False",
    "class",
    "with",
    "try",
    "except",
    "finally",
    "raise",
    "pass",
    "break",
    "continue",
    "lambda",
    "yield",
    "async",
    "await",
  ]),
  functions: new Set([
    "print",
    "len",
    "range",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sum",
    "min",
    "max",
    "sorted",
    "list",
    "dict",
    "set",
    "tuple",
    "str",
    "int",
    "float",
    "bool",
    "read_csv",
    "read_excel",
    "DataFrame",
    "groupby",
    "agg",
    "merge",
    "concat",
    "pivot_table",
    "fillna",
    "dropna",
    "apply",
    "head",
    "tail",
    "info",
    "describe",
    "value_counts",
    "sort_values",
    "reset_index",
    "rename",
    "astype",
    "to_datetime",
  ]),
};

const EXCEL_SPEC: LanguageSpec = {
  caseInsensitive: true,
  lineComments: [],
  blockComments: false,
  tripleQuotes: false,
  keywords: new Set([
    "SI",
    "Y",
    "O",
    "NO",
    "VERDADERO",
    "FALSO",
    "IF",
    "AND",
    "OR",
    "NOT",
    "TRUE",
    "FALSE",
  ]),
  functions: new Set([
    "BUSCARX",
    "XLOOKUP",
    "BUSCARV",
    "VLOOKUP",
    "INDICE",
    "INDEX",
    "COINCIDIR",
    "MATCH",
    "SUMAR.SI",
    "SUMAR.SI.CONJUNTO",
    "SUMIF",
    "SUMIFS",
    "CONTAR.SI",
    "CONTAR.SI.CONJUNTO",
    "COUNTIF",
    "COUNTIFS",
    "PROMEDIO.SI",
    "AVERAGEIF",
    "SI.ERROR",
    "IFERROR",
    "FILTRAR",
    "FILTER",
    "ORDENAR",
    "SORT",
    "UNICOS",
    "UNIQUE",
    "LET",
    "LAMBDA",
    "SUMA",
    "SUM",
    "PROMEDIO",
    "AVERAGE",
    "CONTARA",
    "COUNTA",
    "TEXTO",
    "TEXT",
    "FECHA",
    "DATE",
    "HOY",
    "TODAY",
    "ESPACIOS",
    "TRIM",
    "CONCAT",
    "UNIRCADENAS",
    "TEXTJOIN",
  ]),
};

const M_SPEC: LanguageSpec = {
  caseInsensitive: false,
  lineComments: ["//"],
  blockComments: true,
  tripleQuotes: false,
  keywords: new Set([
    "let",
    "in",
    "each",
    "if",
    "then",
    "else",
    "and",
    "or",
    "not",
    "true",
    "false",
    "null",
    "as",
    "is",
    "try",
    "otherwise",
    "type",
    "section",
    "shared",
    "meta",
  ]),
  functions: new Set([
    "Table.SelectRows",
    "Table.AddColumn",
    "Table.TransformColumns",
    "Table.TransformColumnTypes",
    "Table.Group",
    "Table.NestedJoin",
    "Table.ExpandTableColumn",
    "Table.RemoveColumns",
    "Table.RenameColumns",
    "Table.Sort",
    "Table.Distinct",
    "Table.Combine",
    "Table.PromoteHeaders",
    "Excel.Workbook",
    "Csv.Document",
    "File.Contents",
    "Web.Contents",
    "Text.Trim",
    "Text.Clean",
    "Text.Upper",
    "Text.Lower",
    "Text.Split",
    "Date.Year",
    "Date.Month",
    "List.Sum",
    "List.Average",
    "List.Count",
  ]),
};

const BASH_SPEC: LanguageSpec = {
  caseInsensitive: false,
  lineComments: ["#"],
  blockComments: false,
  tripleQuotes: false,
  keywords: new Set([
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "for",
    "in",
    "do",
    "done",
    "while",
    "case",
    "esac",
    "export",
    "local",
    "return",
    "exit",
    "cd",
    "ls",
    "mkdir",
    "rm",
    "cp",
    "mv",
    "cat",
    "grep",
    "rg",
    "sed",
    "awk",
    "curl",
    "git",
    "npm",
    "npx",
    "pip",
    "python",
    "python3",
    "docker",
    "psql",
    "sqlite3",
    "echo",
    "chmod",
  ]),
  functions: new Set(),
};

const PLAIN_SPEC: LanguageSpec = {
  caseInsensitive: false,
  lineComments: [],
  blockComments: false,
  tripleQuotes: false,
  keywords: new Set(),
  functions: new Set(),
};

const SPECS: Record<SyntaxLanguage, LanguageSpec> = {
  dax: DAX_SPEC,
  sql: SQL_SPEC,
  python: PYTHON_SPEC,
  excel: EXCEL_SPEC,
  m: M_SPEC,
  bash: BASH_SPEC,
  plain: PLAIN_SPEC,
};

const MULTI_OPERATORS = [":=", "<>", "!=", "<=", ">=", "=>", "->", "&&", "||"];
const SINGLE_OPERATORS = new Set(["=", "+", "-", "*", "/", "%", "<", ">", "&", "|", "!", "^"]);

export function normalizeSyntaxLanguage(lang?: string): SyntaxLanguage {
  const normalized = (lang ?? "").trim().toLowerCase();
  if (normalized === "dax") return "dax";
  if (normalized === "sql" || normalized === "tsql" || normalized === "postgres" || normalized === "postgresql") {
    return "sql";
  }
  if (normalized === "python" || normalized === "py") return "python";
  if (normalized === "excel" || normalized === "formula" || normalized === "sheets") return "excel";
  if (normalized === "m" || normalized === "powerquery" || normalized === "power-query" || normalized === "pq") {
    return "m";
  }
  if (normalized === "bash" || normalized === "sh" || normalized === "shell" || normalized === "zsh" || normalized === "powershell") {
    return "bash";
  }
  return "plain";
}

function pushToken(tokens: SyntaxToken[], type: SyntaxTokenType, value: string): void {
  if (!value) return;
  const last = tokens[tokens.length - 1];
  if (last && last.type === "plain" && type === "plain") {
    last.value += value;
    return;
  }
  tokens.push({ type, value });
}

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_\u00C0-\u024F]/.test(ch);
}

function isIdentChar(ch: string, lang: SyntaxLanguage): boolean {
  if (/[A-Za-z0-9_\u00C0-\u024F]/.test(ch)) return true;
  if ((lang === "excel" || lang === "m") && ch === ".") return true;
  return false;
}

function readQuotedString(code: string, start: number, quote: string): number {
  let i = start + 1;
  while (i < code.length) {
    const ch = code[i];
    if (ch === "\\" && i + 1 < code.length) {
      i += 2;
      continue;
    }
    if (ch === quote) {
      // DAX/SQL/Excel permiten comillas duplicadas como escape ("" o '')
      if (code[i + 1] === quote) {
        i += 2;
        continue;
      }
      return i + 1;
    }
    i += 1;
  }
  return code.length;
}

export function tokenizeCode(code: string, language?: string): SyntaxToken[] {
  if (!code) return [];
  const lang = normalizeSyntaxLanguage(language);
  if (lang === "plain") {
    return [{ type: "plain", value: code }];
  }

  const spec = SPECS[lang];
  const tokens: SyntaxToken[] = [];
  let i = 0;

  while (i < code.length) {
    // Comentario de bloque /* ... */
    if (spec.blockComments && code.startsWith("/*", i)) {
      const end = code.indexOf("*/", i + 2);
      const next = end === -1 ? code.length : end + 2;
      pushToken(tokens, "comment", code.slice(i, next));
      i = next;
      continue;
    }

    // Comentario de línea (--, //, #)
    const linePrefix = spec.lineComments.find((prefix) => code.startsWith(prefix, i));
    if (linePrefix) {
      const nl = code.indexOf("\n", i + linePrefix.length);
      const next = nl === -1 ? code.length : nl;
      pushToken(tokens, "comment", code.slice(i, next));
      i = next;
      continue;
    }

    // Cadenas multilínea de Python ("""...""" o '''...''')
    if (spec.tripleQuotes && (code.startsWith('"""', i) || code.startsWith("'''", i))) {
      const delim = code.slice(i, i + 3);
      const end = code.indexOf(delim, i + 3);
      const next = end === -1 ? code.length : end + 3;
      pushToken(tokens, "string", code.slice(i, next));
      i = next;
      continue;
    }

    // Cadenas simples ("...", '...', `...`)
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const next = readQuotedString(code, i, ch);
      pushToken(tokens, "string", code.slice(i, next));
      i = next;
      continue;
    }

    // Números (solo si no forman parte de un identificador)
    if (/[0-9]/.test(ch) && (i === 0 || !isIdentChar(code[i - 1], lang))) {
      const match = code.slice(i).match(/^\d+(?:[.,_]\d+)*(?:[eE][+-]?\d+)?%?/);
      if (match) {
        pushToken(tokens, "number", match[0]);
        i += match[0].length;
        continue;
      }
    }

    // Identificadores, palabras clave y funciones
    if (isIdentStart(ch)) {
      let end = i + 1;
      while (end < code.length && isIdentChar(code[end], lang)) {
        end += 1;
      }
      const raw = code.slice(i, end);
      const lookup = spec.caseInsensitive ? raw.toUpperCase() : raw;
      const followedByParen = code.slice(end).match(/^\s*\(/) !== null;

      if (spec.keywords.has(lookup)) {
        pushToken(tokens, "keyword", raw);
      } else if (spec.functions.has(lookup) || followedByParen) {
        pushToken(tokens, "function", raw);
      } else {
        pushToken(tokens, "plain", raw);
      }
      i = end;
      continue;
    }

    // Operadores compuestos
    const multiOp = MULTI_OPERATORS.find((op) => code.startsWith(op, i));
    if (multiOp) {
      pushToken(tokens, "operator", multiOp);
      i += multiOp.length;
      continue;
    }

    // Operadores simples
    if (SINGLE_OPERATORS.has(ch)) {
      pushToken(tokens, "operator", ch);
      i += 1;
      continue;
    }

    // Espacios, saltos de línea y puntuación
    pushToken(tokens, "plain", ch);
    i += 1;
  }

  return tokens;
}

export const SYNTAX_TOKEN_COLOR: Record<SyntaxTokenType, string> = {
  plain: "var(--g-syn-plain)",
  keyword: "var(--g-syn-keyword)",
  function: "var(--g-syn-function)",
  string: "var(--g-syn-string)",
  number: "var(--g-syn-number)",
  comment: "var(--g-syn-comment)",
  operator: "var(--g-syn-operator)",
};
