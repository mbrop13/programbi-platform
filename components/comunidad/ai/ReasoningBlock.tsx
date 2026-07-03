"use client";

import { useState, useEffect } from "react";
import { Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningBlockProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function ReasoningBlock({ content, isStreaming = false, className }: ReasoningBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isStreaming]);

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
      >
        <Brain className="w-4 h-4 text-purple-500" />
        <span className="font-medium">
          {isStreaming ? "Pensando..." : "Razonamiento"}
        </span>
        {isStreaming && (
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        )}
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-auto text-zinc-400 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 border-t border-zinc-200">
          <div
            className={cn(
              "text-xs text-zinc-500 font-mono whitespace-pre-wrap leading-relaxed mt-2",
              isStreaming && "max-h-40 overflow-y-auto pr-1"
            )}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
