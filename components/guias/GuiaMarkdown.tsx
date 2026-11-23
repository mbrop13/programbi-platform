import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyButton from "@/components/guias/CopyButton";
import { GuiaCodeShell } from "@/components/guias/GuiaEditorialPrimitives";
import { slugAncla, textoDeNodos } from "@/lib/guias/anclas";

function esPromptEstructurado(texto: string): boolean {
  const limpio = texto.trim();
  return (
    /^(?:Contexto:|Rol:|Prompt:|Instrucci[oó]n:|===|\d\.\s*(?:Rol|Contexto|Tarea))/i.test(limpio) ||
    (/(?:Contexto:|Tarea:|Formato:)/i.test(limpio) && /(?:Restricciones:|Tono:|Criterio:|Rol:)/i.test(limpio))
  );
}

function normalizarLenguaje(clase?: string): string | undefined {
  const raw = (clase || "").replace(/^language-/, "").trim().toLowerCase();
  if (!raw) return undefined;
  const mapa: Record<string, string> = {
    py: "python",
    sh: "bash",
    shell: "bash",
    powerquery: "m",
    pq: "m",
  };
  return mapa[raw] || raw;
}

function etiquetaLenguaje(clase?: string): string {
  const raw = (clase || "").replace(/^language-/, "").trim().toLowerCase();
  const etiquetas: Record<string, string> = {
    sql: "SQL Server",
    dax: "DAX · Power BI",
    python: "Python",
    py: "Python",
    excel: "Fórmula Excel",
    m: "Power Query (M)",
    prompt: "Prompt",
    bash: "Terminal",
    sh: "Terminal",
    json: "JSON",
    csv: "CSV",
  };
  return etiquetas[raw] || (raw ? raw.toUpperCase() : "Código / Ejemplo");
}

/**
 * Cuerpo Markdown de la guía envuelto en una superficie de lectura cálida y
 * limpia, con bloques de prompts copiables en 1 clic, fragmentos de código con
 * resaltado sintáctico en modo IDE claro (`GuiaCodeShell`), tablas responsivas
 * en `.guias-table-wrap` y anclas para el índice lateral.
 */
export default function GuiaMarkdown({ content }: { content: string }) {
  return (
    <div className="my-6 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] sm:p-9">
      <div className="guias-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => {
              const id = slugAncla(textoDeNodos(children));
              return <h2 id={id || undefined}>{children}</h2>;
            },
            h2: ({ children }) => {
              const id = slugAncla(textoDeNodos(children));
              return <h2 id={id || undefined}>{children}</h2>;
            },
            h3: ({ children }) => {
              const id = slugAncla(textoDeNodos(children));
              return <h3 id={id || undefined}>{children}</h3>;
            },
            h4: ({ children }) => {
              const id = slugAncla(textoDeNodos(children));
              return (
                <h4
                  id={id || undefined}
                  className="mt-7 scroll-mt-24 text-base font-semibold tracking-tight text-[var(--g-ink)] first:mt-0"
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
                  className="border-b border-[var(--g-border)] pb-2"
                >
                  {children}
                </h2>
              );
            },
            h6: ({ children }) => {
              const id = slugAncla(textoDeNodos(children));
              return <h3 id={id || undefined}>{children}</h3>;
            },
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith("http") && !href.includes("programbi.com") ? "_blank" : undefined}
                rel={href?.startsWith("http") && !href.includes("programbi.com") ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => {
              const textoPlano = textoDeNodos(children).replace(/\s+\n/g, "\n").trim();
              if (esPromptEstructurado(textoPlano)) {
                return (
                  <div className="my-6 overflow-hidden rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-wash)]/45 shadow-[var(--g-card-shadow)]">
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--g-border)] bg-[var(--g-wash)] px-4 py-2.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
                        Prompt listo para copiar
                      </span>
                      <CopyButton text={textoPlano} label="Copiar prompt" variant="paper" />
                    </div>
                    <blockquote className="!m-0 !rounded-none !border-0 !bg-transparent !shadow-none px-4 py-3.5 text-sm leading-relaxed text-[var(--g-ink)]">
                      {children}
                    </blockquote>
                  </div>
                );
              }
              return <blockquote>{children}</blockquote>;
            },
            pre: ({ children }) => {
              const childEl = children as ReactElement<{ className?: string; children?: unknown }> | undefined;
              const className = childEl?.props?.className;
              const textoPlano = textoDeNodos(childEl?.props?.children ?? children).trim();
              const esPrompt = (className || "").includes("prompt") || esPromptEstructurado(textoPlano);
              const title = esPrompt ? "Prompt de ejemplo" : etiquetaLenguaje(className);
              const language = normalizarLenguaje(className);

              return (
                <GuiaCodeShell
                  code={textoPlano}
                  language={language}
                  title={title}
                  copyLabel={esPrompt ? "Copiar prompt" : "Copiar"}
                />
              );
            },
            code: ({ children, className }) =>
              className ? (
                <code className="font-mono text-[13px] text-inherit">{children}</code>
              ) : (
                <code>{children}</code>
              ),
            img: ({ src, alt }) => (
              <figure className="my-6 overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={typeof src === "string" ? src : ""}
                  alt={alt || ""}
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] h-auto w-full bg-[var(--g-wash)] object-contain"
                />
                {alt ? (
                  <figcaption className="border-t border-[var(--g-border)] bg-[var(--g-wash)] px-4 py-2.5 text-xs text-[var(--g-muted)]">
                    {alt}
                  </figcaption>
                ) : null}
              </figure>
            ),
            table: ({ children }) => (
              <div className="guias-table-wrap">
                <table>{children}</table>
              </div>
            ),
            hr: () => <hr className="my-8 border-[var(--g-border)]" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
