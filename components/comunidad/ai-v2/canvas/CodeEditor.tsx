"use client";

import { useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useCanvas } from "./CanvasStore";

/**
 * Editor de código del Canvas con columna de números de línea sticky.
 *
 * - Vista: resaltado Prism + gutter.
 * - Edición: <textarea> monospace + gutter (sin overlay, scroll sincronizado).
 * Las métricas (font-size 0.8125rem, line-height 1.6, padding) se comparten
 * vía las clases `.canvas-code-area` / `.canvas-line-gutter` para que las
 * líneas del gutter calcen exactamente con las del código.
 */
interface CodeEditorProps {
  editing: boolean;
}

export function CodeEditor({ editing }: CodeEditorProps) {
  const { activeFile, updateCode } = useCanvas();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const code = activeFile?.code ?? "";
  const language = (activeFile?.language ?? "text").toLowerCase();

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  if (!activeFile) return null;

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="canvas-preview-bg relative h-full overflow-auto">
      <div className="flex min-h-full min-w-max">
        {/* Gutter de números de línea */}
        <div
          className="canvas-line-gutter canvas-code-area sticky left-0 z-10 select-none"
          aria-hidden
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Código: vista o edición */}
        <div className="canvas-code-area flex-1">
          {editing ? (
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                updateCode(e.target.value);
                // auto-resize vertical del textarea para que coincida con el gutter
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
              spellCheck={false}
              wrap="off"
              className="w-full resize-none border-0 bg-transparent px-4 py-3.5 text-text-primary outline-none"
              style={{
                minHeight: "100%",
                fontFamily: "var(--font-mono), ui-monospace, monospace",
                fontSize: "0.8125rem",
                lineHeight: "1.6",
                whiteSpace: "pre",
                overflow: "visible",
              }}
              rows={lineCount}
            />
          ) : (
            <SyntaxHighlighter
              language={language}
              style={oneLight}
              customStyle={{
                margin: 0,
                background: "transparent",
                padding: "0.875rem 1rem",
                fontSize: "0.8125rem",
                lineHeight: "1.6",
                minHeight: "100%",
              }}
              codeTagProps={{
                style: { fontFamily: "var(--font-mono), ui-monospace, monospace" },
              }}
              wrapLongLines={false}
            >
              {code}
            </SyntaxHighlighter>
          )}
        </div>
      </div>

      {/* Botón flotante de copiado rápido (solo en vista) */}
      {!editing && <CopyButton code={code} />}
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <button
      onClick={handle}
      aria-label={copied ? "Código copiado" : "Copiar código"}
      className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-border bg-surface-0/90 px-2 py-1 text-[11px] text-text-muted shadow-float backdrop-blur transition-colors hover:bg-surface-2 hover:text-text-primary"
    >
      {copied ? <Check className="h-3 w-3 text-accent-emerald" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
