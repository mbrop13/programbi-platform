"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-zinc-800 my-5 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
          title={isCopied ? "Copiado" : "Copiar código"}
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative bg-zinc-950">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            fontSize: "0.8125rem",
            lineHeight: "1.5rem",
            background: "transparent",
          }}
          codeTagProps={{
            className: "font-mono",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
