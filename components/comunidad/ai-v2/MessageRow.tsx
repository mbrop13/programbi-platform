"use client";

import { memo, useState } from "react";
import { Bot, Check, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ReasoningPanel } from "./ReasoningPanel";
import { ToolCard } from "./ToolCard";
import type { ChatMessage, ChatPart } from "./types";

interface MessageRowProps {
  message: ChatMessage;
  isStreaming: boolean;
  modelName?: string;
  onRegenerate?: () => void;
}

function isImagePart(p: ChatPart) {
  return p.type === "file" && String(p.mediaType ?? "").startsWith("image/");
}

function MessageRowBase({
  message,
  isStreaming,
  modelName,
  onRegenerate,
}: MessageRowProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const isUser = message.role === "user";

  // Agrupar parts
  let reasoningText = "";
  let reasoningStreaming = false;
  const textChunks: string[] = [];
  const toolParts: ChatPart[] = [];
  const imageParts: ChatPart[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === "reasoning") {
      reasoningText += (reasoningText ? "\n" : "") + (part.text ?? "");
      if (part.state === "streaming") reasoningStreaming = true;
    } else if (part.type === "text") {
      textChunks.push(part.text ?? "");
    } else if (part.type === "tool-webSearch" || part.type?.startsWith("tool-") || part.type === "dynamic-tool") {
      toolParts.push(part);
    } else if (isImagePart(part)) {
      imageParts.push(part);
    }
    // step-start, source-* → ignorados por ahora
  }

  const text = textChunks.join("\n\n");
  const showStreamingCursor = isStreaming && !isUser && (!text || message.parts?.[message.parts.length - 1]?.type === "text");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  // ─── Usuario: burbuja derecha ───
  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2 sm:px-6">
        <div className="flex flex-col items-end gap-2 max-w-[85%] sm:max-w-[75%]">
          {imageParts.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {imageParts.map((p, i) => (
                <img
                  key={i}
                  src={p.url}
                  alt={p.filename ?? "imagen"}
                  className="max-h-48 rounded-2xl border border-border object-cover"
                />
              ))}
            </div>
          )}
          {text && (
            <div className="rounded-3xl rounded-br-lg bg-brand-blue px-4 py-2.5 text-white shadow-premium">
              <div className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">
                {text}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Asistente: full-width, sin burbuja ───
  return (
    <div className="group flex gap-3 px-4 py-4 sm:px-6">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-blue-600 shadow-glow-brand">
        <Bot className="h-4 w-4 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        {/* Header: nombre modelo + timestamp */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {modelName ?? "Mentor IA"}
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[11px] text-text-muted">
              <span className="inline-flex gap-0.5">
                <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted [animation-delay:120ms]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted [animation-delay:240ms]" />
              </span>
            </span>
          )}
        </div>

        {/* Razonamiento */}
        {(reasoningText || reasoningStreaming) && (
          <ReasoningPanel text={reasoningText} isStreaming={reasoningStreaming} />
        )}

        {/* Tool calls */}
        {toolParts.map((p, i) => (
          <ToolCard key={p.toolCallId ?? i} part={p} />
        ))}

        {/* Texto */}
        {text && (
          <div className="relative ml-0">
            <MarkdownRenderer content={text} />
            {showStreamingCursor && (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand-blue align-middle" />
            )}
          </div>
        )}

        {/* Imágenes del asistente (raras) */}
        {imageParts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {imageParts.map((p, i) => (
              <img
                key={i}
                src={p.url}
                alt={p.filename ?? "imagen"}
                className="max-h-64 rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        )}

        {/* Acciones (hover) */}
        {!isStreaming && text && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text-secondary"
              title="Copiar"
            >
              {copied ? <Check className="h-3 w-3 text-accent-emerald" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
            {typeof window !== "undefined" && window.speechSynthesis && (
              <button
                onClick={handleSpeak}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text-secondary"
                title={speaking ? "Detener" : "Escuchar"}
              >
                {speaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                {speaking ? "Detener" : "Escuchar"}
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text-secondary"
                title="Regenerar"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const MessageRow = memo(MessageRowBase, (prev, next) => {
  return (
    prev.message === next.message &&
    prev.isStreaming === next.isStreaming &&
    prev.modelName === next.modelName
  );
});
