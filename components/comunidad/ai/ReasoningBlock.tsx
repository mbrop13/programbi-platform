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

  // Auto-abrir durante streaming, auto-cerrar al terminar
  useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isStreaming]);

  return (
    <div className={cn("mb-3 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Brain className="w-4 h-4 text-purple-500" />
        <span className="font-medium">
          {isStreaming ? "Pensando..." : "Razonamiento"}
        </span>
        {isStreaming && (
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        )}
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-auto transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 border-t border-gray-200">
          <div
            className={cn(
              "text-xs text-gray-500 font-mono whitespace-pre-wrap leading-relaxed mt-2",
              isStreaming && "max-h-36 overflow-y-auto"
            )}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
