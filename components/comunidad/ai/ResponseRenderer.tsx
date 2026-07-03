"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

interface ResponseRendererProps {
  children: string;
  className?: string;
}

function parseIncompleteMarkdown(text: string): string {
  if (!text || typeof text !== "string") return text;

  let result = text;

  const linkMatch = result.match(/(!?\[)([^\]]*?)$/);
  if (linkMatch) {
    const startIndex = result.lastIndexOf(linkMatch[1]);
    result = result.substring(0, startIndex);
  }

  const boldPairs = (result.match(/\*\*/g) || []).length;
  if (boldPairs % 2 === 1) result = `${result}**`;

  const underscorePairs = (result.match(/__/g) || []).length;
  if (underscorePairs % 2 === 1) result = `${result}__`;

  const tildePairs = (result.match(/~~/g) || []).length;
  if (tildePairs % 2 === 1) result = `${result}~~`;

  return result;
}

export function ResponseRenderer({ children, className }: ResponseRendererProps) {
  const parsed = typeof children === "string" ? parseIncompleteMarkdown(children) : children;

  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none",
        "prose-headings:font-semibold prose-headings:text-zinc-900",
        "prose-p:text-zinc-800 prose-p:leading-7",
        "prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-zinc-900 prose-strong:font-semibold",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="my-3 leading-7 text-zinc-800">{children}</p>,
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-2xl font-semibold text-zinc-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 mb-3 text-xl font-semibold text-zinc-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2.5 text-lg font-semibold text-zinc-900">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-5 mb-2 text-base font-semibold text-zinc-900">{children}</h4>
          ),
          ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1.5 text-zinc-800">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1.5 text-zinc-800">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-zinc-300 pl-4 italic text-zinc-700">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-50 text-zinc-900 font-semibold">{children}</thead>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 border-b border-zinc-200 font-semibold text-zinc-900">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-b border-zinc-100 text-zinc-700">{children}</td>
          ),
          hr: () => <hr className="my-6 border-zinc-200" />,
          code: ({ className: codeClass, children: codeChildren, ...props }) => {
            const match = /language-(\w+)/.exec(codeClass || "");
            const isInline = !codeClass && typeof codeChildren === "string" && !codeChildren.includes("\n");

            if (isInline) {
              return (
                <code
                  className="bg-zinc-100 text-zinc-800 rounded px-1 py-0.5 text-sm font-mono"
                  {...props}
                >
                  {codeChildren}
                </code>
              );
            }

            const code = String(codeChildren).replace(/\n$/, "");
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
