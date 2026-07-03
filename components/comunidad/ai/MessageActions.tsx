"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  className?: string;
}

export function MessageActions({ content, onRegenerate, className }: MessageActionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(feedback === type ? null : type);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200",
        className
      )}
    >
      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        title={isCopied ? "Copiado" : "Copiar respuesta"}
        aria-label={isCopied ? "Copiado" : "Copiar respuesta"}
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          title="Regenerar respuesta"
          aria-label="Regenerar respuesta"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => handleFeedback("up")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
          feedback === "up"
            ? "text-green-600 bg-green-50"
            : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
        )}
        title="Buena respuesta"
        aria-label="Buena respuesta"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleFeedback("down")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
          feedback === "down"
            ? "text-red-600 bg-red-50"
            : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
        )}
        title="Mala respuesta"
        aria-label="Mala respuesta"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
}
