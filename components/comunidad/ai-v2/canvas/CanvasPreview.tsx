"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
import { useCanvas } from "./CanvasStore";

/**
 * Vista previa en vivo del archivo activo del Canvas.
 *
 * - HTML: renderizado en <iframe> sandbox (allow-scripts, sin same-origin).
 * - SVG:  HTML sanitizado con DOMPurify en un contenedor centrado.
 * - MD:   ReactMarkdown + clase `prose-chat`.
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
      <div className="canvas-preview-bg h-full">
        <iframe
          title="preview"
          srcDoc={code}
          sandbox="allow-scripts"
          className="h-full w-full border-0 bg-white"
        />
      </div>
    );
  }

  if (language === "svg") {
    return (
      <div className="canvas-preview-bg flex h-full items-center justify-center p-6">
        <div
          className="max-h-full max-w-full [&>svg]:max-h-[70vh] [&>svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        />
      </div>
    );
  }

  // markdown
  return (
    <div className="canvas-preview-bg h-full overflow-auto p-6">
      <div className="prose-chat mx-auto max-w-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{code}</ReactMarkdown>
      </div>
    </div>
  );
}
