import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Terminal } from "lucide-react";
import CopyButton from "@/components/guias/CopyButton";
import { slugAncla, textoDeNodos } from "@/lib/guias/anclas";

function esPromptEstructurado(texto: string): boolean {
  const limpio = texto.trim();
  return /^(?:Contexto:|Rol:|Prompt:|Instrucci[oó]n:|===|\d\.\s*(?:Rol|Contexto|Tarea))/i.test(limpio) ||
    (/(?:Contexto:|Tarea:|Formato:)/i.test(limpio) && /(?:Restricciones:|Tono:|Criterio:|Rol:)/i.test(limpio));
}

function etiquetaLenguaje(clase?: string): string {
  const raw = (clase || "").replace(/^language-/, "").trim().toLowerCase();
  const etiquetas: Record<string, string> = {
    sql: "SQL Server",
    dax: "DAX · Power BI",
    python: "Python",
    py: "Python",
    excel: "Fórmula Excel",
    prompt: "Prompt",
    bash: "Terminal",
    sh: "Terminal",
    json: "JSON",
    csv: "CSV",
  };
  return etiquetas[raw] || (raw ? raw.toUpperCase() : "Código / Ejemplo");
}

/**
 * Cuerpo Markdown de la guía, con bloques de prompts copiables en 1 clic,
 * fragmentos de código con etiqueta de lenguaje, tablas legibles y anclas
 * para el índice lateral. Renderiza en el servidor salvo el botón de copiar.
 */
export default function GuiaMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h2
              id={id || undefined}
              className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-ink first:mt-0"
            >
              {children}
            </h2>
          );
        },
        h2: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h2
              id={id || undefined}
              className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-ink first:mt-0"
            >
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h3
              id={id || undefined}
              className="mt-8 scroll-mt-24 text-xl font-bold tracking-tight text-ink first:mt-0"
            >
              {children}
            </h3>
          );
        },
        h4: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h4
              id={id || undefined}
              className="mt-8 scroll-mt-24 text-lg font-bold tracking-tight text-ink first:mt-0"
            >
              {children}
            </h4>
          );
        },
        h5: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h2
              id={id || undefined}
              className="mt-10 scroll-mt-24 border-b border-line/70 pb-2 text-xl font-bold tracking-tight text-ink first:mt-0 sm:text-2xl"
            >
              {children}
            </h2>
          );
        },
        h6: ({ children }) => {
          const id = slugAncla(textoDeNodos(children));
          return (
            <h3
              id={id || undefined}
              className="mt-8 scroll-mt-24 text-lg font-bold tracking-tight text-ink first:mt-0"
            >
              {children}
            </h3>
          );
        },
        p: ({ children }) => <p className="mt-4 leading-relaxed text-mute first:mt-0">{children}</p>,
        ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5 text-mute">{children}</ul>,
        ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-mute">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") && !href.includes("programbi.com") ? "_blank" : undefined}
            rel={href?.startsWith("http") && !href.includes("programbi.com") ? "noopener noreferrer" : undefined}
            className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => {
          const textoPlano = textoDeNodos(children).replace(/\s+\n/g, "\n").trim();
          if (esPromptEstructurado(textoPlano)) {
            return (
              <div className="my-6 overflow-hidden rounded-2xl border border-[#D97757]/40 bg-paper shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-[#D97757]/20 bg-[#D97757]/10 px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3F20]">
                    <Sparkles size={13} aria-hidden /> Prompt listo para copiar
                  </span>
                  <CopyButton text={textoPlano} label="Copiar prompt" />
                </div>
                <blockquote className="space-y-2 px-4 py-4 text-sm leading-relaxed text-ink">
                  {children}
                </blockquote>
              </div>
            );
          }
          return (
            <blockquote className="my-6 rounded-r-2xl border-l-4 border-ink bg-wash/70 px-5 py-4 text-sm leading-relaxed text-ink">
              {children}
            </blockquote>
          );
        },
        pre: ({ children }) => {
          const childEl = children as ReactElement<{ className?: string; children?: unknown }> | undefined;
          const className = childEl?.props?.className;
          const textoPlano = textoDeNodos(childEl?.props?.children ?? children).trim();
          const etiqueta = etiquetaLenguaje(className);
          const esPrompt = (className || "").includes("prompt") || esPromptEstructurado(textoPlano);

          return (
            <div className="my-6 overflow-hidden rounded-2xl border border-line-strong bg-[#171716] text-[#F7F7F4] shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">
                  {esPrompt ? <Sparkles size={12} className="text-[#D97757]" aria-hidden /> : <Terminal size={12} aria-hidden />}
                  {esPrompt ? "Prompt de ejemplo" : etiqueta}
                </span>
                <CopyButton text={textoPlano} label={esPrompt ? "Copiar prompt" : "Copiar"} variant="dark" />
              </div>
              <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed text-[#F7F7F4]">
                {children}
              </pre>
            </div>
          );
        },
        code: ({ children, className }) =>
          className ? (
            <code className="font-mono text-[13px] text-inherit">{children}</code>
          ) : (
            <code className="rounded-md border border-line bg-wash px-1.5 py-0.5 font-mono text-[13px] text-ink">
              {children}
            </code>
          ),
        img: ({ src, alt }) => (
          <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt || ""}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
            {alt ? (
              <figcaption className="border-t border-line bg-wash/50 px-4 py-2 text-xs text-mute">
                {alt}
              </figcaption>
            ) : null}
          </figure>
        ),
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-2xl border border-line bg-paper shadow-sm">
            <table className="w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-wash">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-line px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-line px-3.5 py-2.5 align-top text-mute">{children}</td>
        ),
        hr: () => <hr className="my-8 border-line" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
