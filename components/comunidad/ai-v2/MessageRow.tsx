"use client";

import { memo, useState } from "react";
import { Bot, Check, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ReasoningPanel } from "./ReasoningPanel";
import { ToolCard } from "./ToolCard";
import type { ChatMessage, ChatPart } from "./types";

interface MessageRowProps {
  message: ChatMessage;
  isStreaming: boolean;
  modelName?: string;
  onRegenerate?: () => void;
  userName?: string;
  userAvatarUrl?: string | null;
}

function isImagePart(p: ChatPart) {
  return p.type === "file" && String(p.mediaType ?? "").startsWith("image/");
}

/** Avatar del usuario: imagen si existe, si no iniciales sobre gradiente de marca. */
function UserAvatar({ name, url }: { name?: string; url?: string | null }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark text-xs font-semibold text-white shadow-sm ring-2 ring-surface-0"
      aria-hidden
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}

/** Convierte markdown a texto plano para TTS (no leer sintaxis cruda). */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " [código] ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function MessageRowBase({
  message,
  isStreaming,
  modelName,
  onRegenerate,
  userName,
  userAvatarUrl,
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
    const utter = new SpeechSynthesisUtterance(toPlainText(text));
    utter.lang = "es-ES";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  // ─── Usuario: burbuja derecha + avatar ───
  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 px-4 py-2 sm:px-6">
        <div className="flex flex-col items-end gap-2 max-w-[85%] sm:max-w-[75%]">
          {imageParts.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {imageParts.map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
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
        <UserAvatar name={userName} url={userAvatarUrl} />
      </div>
    );
  }

  // ─── Asistente: full-width, sin burbuja (documento premium) ───
  return (
    <div className="group flex gap-3 px-4 py-4 sm:px-6">
      {/* Avatar IA */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark shadow-glow-brand"
        aria-hidden
      >
        <Bot className="h-4 w-4 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        {/* Header: nombre modelo */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {modelName ?? "Mentor IA"}
          </span>
        </div>

        {/* Razonamiento */}
        {(reasoningText || reasoningStreaming) && (
          <ReasoningPanel text={reasoningText} isStreaming={reasoningStreaming} />
        )}

        {/* Tool calls */}
        {toolParts.map((p, i) => (
          <ToolCard key={p.toolCallId ?? i} part={p} />
        ))}

        {/* Texto + cursor de streaming único */}
        {text && (
          <div className="relative ml-0">
            <MarkdownRenderer content={text} />
            {showStreamingCursor && <span className="stream-caret" />}
          </div>
        )}

        {/* Imágenes del asistente (raras) */}
        {imageParts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {imageParts.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={p.url}
                alt={p.filename ?? "imagen"}
                className="max-h-64 rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        )}

        {/* Acciones: visibles en hover, foco y táctil */}
        {!isStreaming && text && (
          <div className="touch-visible mt-2.5 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <motion.button
              onClick={handleCopy}
              aria-label={copied ? "Copiado" : "Copiar mensaje"}
              whileHover={{ scale: 1.02, backgroundColor: "var(--color-surface-2)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:text-text-secondary cursor-pointer border-0 bg-transparent"
            >
              {copied ? <Check className="h-3 w-3 text-accent-emerald" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
              {copied ? "Copiado" : "Copiar"}
            </motion.button>
            {typeof window !== "undefined" && window.speechSynthesis && (
              <motion.button
                onClick={handleSpeak}
                aria-label={speaking ? "Detener lectura" : "Escuchar mensaje"}
                whileHover={{ scale: 1.02, backgroundColor: "var(--color-surface-2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:text-text-secondary cursor-pointer border-0 bg-transparent"
              >
                {speaking ? <VolumeX className="h-3 w-3" aria-hidden /> : <Volume2 className="h-3 w-3" aria-hidden />}
                {speaking ? "Detener" : "Escuchar"}
              </motion.button>
            )}
            {onRegenerate && (
              <motion.button
                onClick={onRegenerate}
                aria-label="Regenerar respuesta"
                whileHover={{ scale: 1.02, backgroundColor: "var(--color-surface-2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors duration-150 hover:text-text-secondary cursor-pointer border-0 bg-transparent"
              >
                <RefreshCw className="h-3 w-3" aria-hidden />
                Regenerar
              </motion.button>
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
    prev.modelName === next.modelName &&
    prev.onRegenerate === next.onRegenerate &&
    prev.userName === next.userName &&
    prev.userAvatarUrl === next.userAvatarUrl
  );
});
