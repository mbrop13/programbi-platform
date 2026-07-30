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
    <div className="group canvas-preview-bg relative h-full overflow-auto">
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
      className="absolute top-4 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-150 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" aria-hidden />
      ) : (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 dark:text-gray-400">
          <path d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667Z" fill="currentColor"></path>
          <path d="M18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.50551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z" fill="currentColor" fillOpacity="0.3"></path>
        </svg>
      )}
      <span>{copied ? "Copiado" : "Copy"}</span>
    </button>
  );
}
