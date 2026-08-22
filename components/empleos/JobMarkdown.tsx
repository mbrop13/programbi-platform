"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render de la descripción de una vacante (markdown del wizard),
 * con los estilos del sistema de diseño de marketing (papel/tinta).
 */
export default function JobMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mt-3 leading-relaxed text-mute first:mt-0">{children}</p>,
          h1: ({ children }) => <h3 className="mt-6 text-lg font-bold tracking-tight text-ink first:mt-0">{children}</h3>,
          h2: ({ children }) => <h3 className="mt-6 text-lg font-bold tracking-tight text-ink first:mt-0">{children}</h3>,
          h3: ({ children }) => <h4 className="mt-5 text-base font-bold tracking-tight text-ink first:mt-0">{children}</h4>,
          ul: ({ children }) => <ul className="mt-3 list-disc space-y-1.5 pl-5 text-mute">{children}</ul>,
          ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-mute">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-4 border-l-2 border-line-strong pl-4 italic text-mute">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-wash px-1.5 py-0.5 font-mono text-[13px] text-ink">{children}</code>
          ),
          hr: () => <hr className="my-6 border-line" />,
        }}
      >
        {content}
      </ReactMarkdown>
  );
}
