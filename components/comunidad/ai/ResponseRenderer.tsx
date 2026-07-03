"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ResponseRendererProps {
  children: string;
  className?: string;
}

/**
 * Completa tokens markdown incompletos durante streaming
 * para evitar renderizado parcial de links, bold, italic, etc.
 */
function parseIncompleteMarkdown(text: string): string {
  if (!text || typeof text !== "string") return text;

  let result = text;

  // Links/images incompletos: [...]
  const linkMatch = result.match(/(!?\[)([^\]]*?)$/);
  if (linkMatch) {
    const startIndex = result.lastIndexOf(linkMatch[1]);
    result = result.substring(0, startIndex);
  }

  // Bold incompleto: **
  const boldPairs = (result.match(/\*\*/g) || []).length;
  if (boldPairs % 2 === 1) result = `${result}**`;

  // Italic incompleto: __
  const underscorePairs = (result.match(/__/g) || []).length;
  if (underscorePairs % 2 === 1) result = `${result}__`;

  // Strikethrough incompleto: ~~
  const tildePairs = (result.match(/~~/g) || []).length;
  if (tildePairs % 2 === 1) result = `${result}~~`;

  return result;
}

export function ResponseRenderer({ children, className }: ResponseRendererProps) {
  const parsed = typeof children === "string" ? parseIncompleteMarkdown(children) : children;

  return (
    <div
      className={cn(
        "ai-response prose prose-sm max-w-none",
        "prose-headings:font-display prose-headings:font-semibold prose-headings:text-gray-900",
        "prose-p:leading-relaxed prose-p:text-gray-700",
        "prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline",
        "prose-strong:font-semibold prose-strong:text-gray-900",
        "prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-gray-800",
        "prose-pre:p-0 prose-pre:bg-transparent",
        "prose-blockquote:border-l-brand-blue prose-blockquote:text-gray-600",
        "prose-th:text-left prose-th:font-semibold",
        "prose-td:text-sm",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => (
            <p className="my-3 leading-relaxed text-gray-700">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 font-display font-bold text-2xl text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2.5 font-display font-bold text-xl text-gray-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 font-display font-semibold text-lg text-gray-900">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 font-display font-semibold text-base text-gray-900">{children}</h4>
          ),
          ul: ({ children }) => (
            <ul className="my-3 ml-4 list-disc list-outside space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-4 list-decimal list-outside space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue font-medium hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-brand-blue/30 pl-4 text-gray-600 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100">
              {children}
            </td>
          ),
          hr: () => <hr className="my-6 border-gray-200" />,
          code: ({ className: codeClassName, children, ...props }) => {
            // Detecta si es inline o bloque
            const match = /language-(\w+)/.exec(codeClassName || "");
            const isInline = !codeClassName && typeof children === "string" && !children.includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const code = String(children).replace(/\n$/, "");
            const language = match ? match[1] : "text";

            return <CodeBlock code={code} language={language} />;
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {parsed}
      </ReactMarkdown>
    </div>
  );
}
