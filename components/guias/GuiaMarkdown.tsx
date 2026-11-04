"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render del cuerpo Markdown de una guía con los tokens del sitio
 * (papel/tinta). Los encabezados `#####` del texto original se mapean a H2/H3
 * para que la jerarquía semántica de la página quede correcta: un solo H1 y
 * secciones H2.
 */
export default function GuiaMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink first:mt-0">{children}</h2>
        ),
        h2: ({ children }) => (
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 text-xl font-bold tracking-tight text-ink first:mt-0">{children}</h3>
        ),
        h4: ({ children }) => (
          <h3 className="mt-8 text-lg font-bold tracking-tight text-ink first:mt-0">{children}</h3>
        ),
        h5: ({ children }) => (
          <h2 className="mt-10 text-xl font-bold tracking-tight text-ink first:mt-0">{children}</h2>
        ),
        h6: ({ children }) => (
          <h3 className="mt-8 text-lg font-bold tracking-tight text-ink first:mt-0">{children}</h3>
        ),
        p: ({ children }) => <p className="mt-4 leading-relaxed text-mute first:mt-0">{children}</p>,
        ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5 text-mute">{children}</ul>,
        ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-mute">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
        a: ({ href, children }) => (
          <a
            href={href}
            {...(/^https?:/i.test(href || "") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-ink underline underline-offset-4"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-5 border-l-2 border-line-strong pl-4 italic text-mute">{children}</blockquote>
        ),
        pre: ({ children }) => (
          <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-wash p-4 text-[13px] leading-relaxed text-ink">
            {children}
          </pre>
        ),
        code: ({ children, className }) =>
          className ? (
            <code className="font-mono text-[13px] text-ink">{children}</code>
          ) : (
            <code className="rounded-md bg-wash px-1.5 py-0.5 font-mono text-[13px] text-ink">{children}</code>
          ),
        table: ({ children }) => (
          <div className="mt-5 overflow-x-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-wash">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-line px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top text-mute">{children}</td>,
        hr: () => <hr className="my-8 border-line" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
