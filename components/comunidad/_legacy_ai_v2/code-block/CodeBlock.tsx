"use client";

import { useState, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Maximize2, Sparkles, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvas } from "../canvas/CanvasStore";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

// Mapa ligero de lenguaje → etiqueta legible
const LANG_LABELS: Record<string, string> = {
  py: "Python",
  python: "Python",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  sql: "SQL",
  bash: "Bash",
  sh: "Shell",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  md: "Markdown",
  html: "HTML",
  css: "CSS",
  r: "R",
  go: "Go",
  java: "Java",
  cpp: "C++",
  c: "C",
  cs: "C#",
  php: "PHP",
  ruby: "Ruby",
  text: "Texto",
  plaintext: "Texto",
};

function getFilename(lang: string): string {
  switch (lang) {
    case "html": return "index.html";
    case "css": return "styles.css";
    case "javascript":
    case "js": return "main.js";
    case "typescript":
    case "ts": return "main.ts";
    case "python":
    case "py": return "main.py";
    case "sql": return "query.sql";
    case "json": return "data.json";
    default: return "codigo.txt";
  }
}

function CodeBlockBase({ code, language, className }: CodeBlockProps) {
  const { openCanvas, canvasModeActive } = useCanvas();
  const [copied, setCopied] = useState(false);
  const lang = (language || "text").toLowerCase();
  const label = LANG_LABELS[lang] ?? lang.toUpperCase();
  const filename = getFilename(lang);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handleOpenCanvas = () => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    openCanvas({ id, title: filename, code, language: lang });
  };

  // ─── IF CANVAS MODE ACTIVE: Render a beautiful minimalist artifact card ───
  if (canvasModeActive) {
    return (
      <div
        onClick={handleOpenCanvas}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenCanvas();
          }
        }}
        className={cn(
          "group/card my-4 w-full max-w-[280px] bg-neutral-50/50 dark:bg-neutral-900/30 hover:bg-neutral-100/50 dark:hover:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98] select-none flex flex-col gap-3.5 relative overflow-hidden",
          className
        )}
      >
        {/* Glow Hover effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full filter blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Header: Icon + Language */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/50 shrink-0 group-hover/card:border-brand-blue/30 group-hover/card:text-brand-blue transition-colors">
            <Code className="w-4 h-4 shrink-0" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-neutral-850 dark:text-neutral-100 text-[13px] tracking-wide uppercase leading-tight">
              {label}
            </span>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="border-b border-neutral-200/80 dark:border-neutral-800/60 w-full" />

        {/* Footer Actions: Concentric Circle Indicator + Filename */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Concentric Circle Icon mimicking the user request design */}
            <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 group-hover/card:border-brand-blue transition-all duration-250">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-350 dark:bg-neutral-600 group-hover/card:bg-brand-blue transition-all duration-250" />
            </div>
            <span className="text-[12px] font-semibold text-neutral-500 dark:text-neutral-400 group-hover/card:text-brand-blue transition-colors duration-200 truncate">
              Generar {filename}
            </span>
          </div>

          {/* Sparkle icon at the right to highlight AI generation */}
          <Sparkles className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover/card:text-brand-blue/70 transition-colors shrink-0" />
        </div>
      </div>
    );
  }

  // ─── IF CANVAS MODE INACTIVE: Render full code block ───
  return (
    <div
      role="region"
      aria-label={`Bloque de código ${label}`}
      className={cn(
        "group relative my-4 overflow-hidden rounded-xl border border-border bg-surface-0 shadow-premium",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-3 py-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleOpenCanvas}
            aria-label="Abrir en editor Canvas"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-muted transition-colors hover:bg-surface-3 hover:text-brand-blue cursor-pointer border-none bg-transparent"
            title="Abrir en editor Canvas"
          >
            <Maximize2 className="h-3 w-3" aria-hidden /> Abrir en Canvas
          </button>
          <button
            onClick={handleCopy}
            aria-label={copied ? "Código copiado" : "Copiar código"}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary cursor-pointer border-none bg-transparent"
            title="Copiar código"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent-emerald" aria-hidden /> Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden /> Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={oneLight}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "0.875rem 1rem",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
          }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono), monospace" } }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export const CodeBlock = memo(CodeBlockBase);
