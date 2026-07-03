"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  selectedModel,
  onModelChange,
  placeholder = "Pregúntame lo que necesites...",
  className,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      const text = value || "";
      if (text.trim()) onSubmit();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex items-end gap-2 rounded-3xl border bg-white shadow-lg transition-all",
          "border-zinc-200 focus-within:border-zinc-300 focus-within:shadow-xl focus-within:ring-1 focus-within:ring-zinc-200",
          disabled && "opacity-60"
        )}
      >
        <ModelSelector
          selectedModel={selectedModel}
          onSelect={onModelChange}
          className="shrink-0 pl-2 py-2"
        />

        <div className="w-px h-6 bg-zinc-200 self-center" />

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent py-3.5 px-2 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 max-h-[200px] min-h-[52px] scrollbar-hide"
        />

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex items-center justify-center w-10 h-10 mb-1.5 mr-1.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors shrink-0"
            title="Detener generación"
            aria-label="Detener generación"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!(value || "").trim() || disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 mb-1.5 mr-1.5 rounded-full transition-colors shrink-0",
              (value || "").trim()
                ? "bg-brand-blue text-white hover:bg-brand-blue-dark shadow-md"
                : "bg-zinc-100 text-zinc-400"
            )}
            title="Enviar mensaje"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-zinc-400 mt-2">
        La IA puede cometer errores. Verifica la información importante.
      </p>
    </div>
  );
}
