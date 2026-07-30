"use client";

import { AlertCircle, RefreshCw, X } from "lucide-react";

interface ChatErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export function ChatError({ message, onRetry, onDismiss }: ChatErrorProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <div
        role="alert"
        className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive"
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors hover:bg-destructive/10"
          >
            <RefreshCw className="h-3 w-3" aria-hidden />
            Reintentar
          </button>
        )}
        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso de error"
          className="rounded p-0.5 transition-colors hover:bg-destructive/10"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
