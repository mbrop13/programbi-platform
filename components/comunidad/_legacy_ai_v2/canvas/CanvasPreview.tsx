"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { useCanvas } from "./CanvasStore";
import { MarkdownRenderer } from "../MarkdownRenderer";

/**
 * Vista previa en vivo del archivo activo del Canvas.
 *
 * - HTML: renderizado en <iframe> sandbox (allow-scripts, sin same-origin).
 * - SVG:  HTML sanitizado con DOMPurify en un contenedor centrado.
 * - MD:   MarkdownRenderer (mismo renderizado que en el chat).
 *
 * Sólo se habilita la pestaña de preview para lenguajes soportados.
 */
export function isPreviewable(language: string): boolean {
  const lang = (language || "").toLowerCase();
  return lang === "html" || lang === "svg" || lang === "md" || lang === "markdown";
}

export function CanvasPreview() {
  const { activeFile } = useCanvas();
  const code = activeFile?.code ?? "";
  const language = (activeFile?.language ?? "").toLowerCase();

  const sanitizedSvg = useMemo(() => {
    if (language !== "svg") return "";
    if (typeof window === "undefined") return code;
    return DOMPurify.sanitize(code, { USE_PROFILES: { svg: true, svgFilters: true } });
  }, [code, language]);

  if (language === "html") {
    return (
      <div className="canvas-preview-bg h-full" role="region" aria-label="Vista previa HTML">
        <iframe
          title="Vista previa HTML"
          srcDoc={code}
          sandbox="allow-scripts"
          className="h-full w-full border-0 bg-surface-0"
        />
      </div>
    );
  }

  if (language === "svg") {
    return (
      <div
        className="canvas-preview-bg flex h-full items-center justify-center p-6"
        role="region"
        aria-label="Vista previa SVG"
      >
        <div
          className="max-h-full max-w-full [&>svg]:max-h-[70vh] [&>svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        />
      </div>
    );
  }

  // markdown — mismo renderizado que en el chat
  return (
    <div
      className="canvas-preview-bg h-full overflow-auto p-6"
      role="region"
      aria-label="Vista previa Markdown"
    >
      <div className="mx-auto max-w-3xl">
        <MarkdownRenderer content={code} />
      </div>
    </div>
  );
}
