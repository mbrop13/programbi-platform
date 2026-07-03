"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "./code-block/CodeBlock";
import { cn } from "@/lib/utils";

/**
 * Repara markdown incompleto durante el streaming para evitar parpadeos
 * o renderizado crudo de sintaxis a medio escribir (ej. ``` sin cerrar).
 */
export function parseIncompleteMarkdown(text: string): string {
  if (!text) return "";
  let out = text;

  // 1. Fenced code blocks: número impar de cercas ``` → hay un bloque abierto
  const fenceCount = (out.match(/```+/g) ?? []).length;
  if (fenceCount % 2 !== 0) {
    out += "\n```";
    return out; // dentro de code block, no tocamos el resto
  }

  // 2. Fuera de code blocks: cerrar marcadores inline incompletos
  if ((out.match(/\*\*/g) ?? []).length % 2 !== 0) out += "**";
  if ((out.match(/~~/g) ?? []).length % 2 !== 0) out += "~~";

  // inline backtick (simple, no parte de ```)
  const inlineTicks = (out.match(/(?<!`)`(?!`)/g) ?? []).length;
  if (inlineTicks % 2 !== 0) out += "`";

  // link/imagen incompleto: [ abierto sin ] correspondiente
  const openBracket = out.lastIndexOf("[");
  const closeBracket = out.lastIndexOf("]");
  if (openBracket > closeBracket) {
    out += "]()";
  }

  return out;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function MarkdownRendererBase({ content, className }: MarkdownRendererProps) {
  // Durante el streaming el contenido puede ser markdown incompleto
  const safe = parseIncompleteMarkdown(content);

  return (
    <div
      className={cn(
        "prose-chat max-w-none text-[0.95rem] leading-relaxed text-text-primary",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code blocks e inline code
          code({ className: cls, children, ...props }) {
            const match = /language-(\w+)/.exec(cls || "");
            const text = String(children).replace(/\n$/, "");
            const isBlock = !!match || text.includes("\n");
            if (isBlock) {
              return <CodeBlock code={text} language={match?.[1]} />;
            }
            return (
              <code
                className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-blue-dark dark:text-brand-blue"
                {...props}
              >
                {children}
              </code>
            );
          },
          // El CodeBlock ya provee su contenedor; pre solo envuelve
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p className="my-3 first:mt-0 last:mb-0">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="mt-5 mb-3 text-xl font-bold first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-5 mb-2 text-lg font-bold first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mt-4 mb-2 text-base font-semibold first:mt-0">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="mt-4 mb-1.5 text-sm font-semibold first:mt-0">{children}</h4>;
          },
          ul({ children }) {
            return <ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue underline decoration-brand-blue/40 underline-offset-2 hover:decoration-brand-blue"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-4 border-brand-blue/40 bg-surface-2/40 py-1 pl-4 italic text-text-secondary">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-border bg-surface-2 px-3 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border-b border-border px-3 py-2">{children}</td>;
          },
          hr() {
            return <hr className="my-4 border-border" />;
          },
          strong({ children }) {
            return <strong className="font-semibold text-text-primary">{children}</strong>;
          },
          em({ children }) {
            return <em>{children}</em>;
          },
        }}
      >
        {safe}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownRenderer = memo(MarkdownRendererBase, (prev, next) => {
  return prev.content === next.content && prev.className === next.className;
});
