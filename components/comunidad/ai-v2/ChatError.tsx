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
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-500/20"
          >
            <RefreshCw className="h-3 w-3" />
            Reintentar
          </button>
        )}
        <button
          onClick={onDismiss}
          className="rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-500/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
