"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { Send, Square, Paperclip, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
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
  placeholder = "Escribe un mensaje...",
  className,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-brand-blue/50 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
        {/* Attach button */}
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors shrink-0 mb-0.5"
          title="Adjuntar archivo (próximamente)"
          disabled
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 max-h-[200px] scrollbar-hide"
        />

        {/* Submit/Stop button */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0 mb-0.5 mr-1"
            title="Detener generación"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl transition-colors shrink-0 mb-0.5 mr-1",
              value.trim()
                ? "bg-brand-blue text-white hover:bg-brand-blue-dark shadow-sm"
                : "bg-gray-100 text-gray-400"
            )}
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-gray-400">
          La IA puede cometer errores. Verifica la información importante.
        </p>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="Búsqueda web (próximamente)"
            disabled
          >
            <Globe className="w-3 h-3" />
            <span>Web</span>
          </button>
        </div>
      </div>
    </div>
  );
}
