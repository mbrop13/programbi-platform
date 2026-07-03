"use client";

import { useState, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Maximize2 } from "lucide-react";
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

function CodeBlockBase({ code, language, className }: CodeBlockProps) {
  const { openCanvas } = useCanvas();
  const [copied, setCopied] = useState(false);
  const lang = (language || "text").toLowerCase();
  const label = LANG_LABELS[lang] ?? lang.toUpperCase();

  const handleCopy = async () => {
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
    openCanvas({ id, title: "codigo", code, language: lang });
  };

  return (
    <div
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
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-muted transition-colors hover:bg-surface-3 hover:text-brand-blue"
            title="Abrir en editor Canvas"
          >
            <Maximize2 className="h-3 w-3" /> Canvas
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary"
            title="Copiar código"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent-emerald" /> Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code: dual light/dark via CSS show/hide */}
      <div className="relative">
        <div className="dark:hidden">
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
        <div className="hidden dark:block">
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
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
    </div>
  );
}

export const CodeBlock = memo(CodeBlockBase);
