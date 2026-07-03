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
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title={isCopied ? "Copiado" : "Copiar respuesta"}
      >
        {isCopied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-600">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar</span>
          </>
        )}
      </button>

      {/* Regenerate button */}
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Regenerar respuesta"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerar</span>
        </button>
      )}

      {/* Feedback buttons */}
      <button
        onClick={() => handleFeedback("up")}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          feedback === "up"
            ? "text-green-600 bg-green-50"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        )}
        title="Buena respuesta"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => handleFeedback("down")}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          feedback === "down"
            ? "text-red-600 bg-red-50"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        )}
        title="Mala respuesta"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
