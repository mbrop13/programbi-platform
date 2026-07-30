"use client";

import { memo, useState } from "react";
import { Check, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ReasoningPanel } from "./ReasoningPanel";
import { ToolCard } from "./ToolCard";
import type { ChatMessage, ChatPart } from "./types";
import { cn } from "@/lib/utils";

interface MessageRowProps {
  message: ChatMessage;
  isStreaming: boolean;
  modelName?: string;
  onRegenerate?: () => void;
  userName?: string;
  userAvatarUrl?: string | null;
}

/** Umbral para mostrar "Ver más / Ver menos" en mensajes de usuario. */
const LONG_MSG_CHARS = 450;
const LONG_MSG_LINES = 5;
const COLLAPSED_HEIGHT = 140;

function isImagePart(p: ChatPart) {
  return p.type === "file" && String(p.mediaType ?? "").startsWith("image/");
}

/**
 * Decodifica etiquetas <think>…</think> embebidas en el contenido final.
 * Devuelve { reasoning, content } separados. Soporta streaming (etiqueta
 * abierta sin cierre) para mostrar el pensamiento en tiempo real.
 */
function decodeThinking(raw: string): { reasoning: string; content: string } {
  if (!raw) return { reasoning: "", content: "" };
  let reasoning = "";
  let content = raw;

  // Etiquetas cerradas: <think>…</think>
  const closed = /<think>([\s\S]*?)<\/think>/g;
  content = content.replace(closed, (_m, inner) => {
    reasoning += (reasoning ? "\n" : "") + String(inner).trim();
    return "";
  });

  // Etiqueta abierta en streaming (sin cierre todavía)
  const open = content.match(/<think>([\s\S]*)$/);
  if (open) {
    reasoning += (reasoning ? "\n" : "") + String(open[1]).trim();
    content = content.replace(/<think>([\s\S]*)$/, "");
  }

  return { reasoning: reasoning.trim(), content: content.trim() };
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

/** Burbuja de usuario con colapso "Ver más / Ver menos". */
function UserBubble({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > LONG_MSG_CHARS || text.split("\n").length > LONG_MSG_LINES;

  return (
    <div className="relative overflow-hidden rounded-3xl rounded-tr-sm bg-secondary px-5 py-3.5 text-text-primary">
      <div
        className={cn(
          "whitespace-pre-wrap break-words text-[15px] leading-relaxed transition-all duration-300",
          isLong && !expanded && "max-h-[140px] overflow-hidden"
        )}
        style={isLong && !expanded ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        {text}
      </div>
      {isLong && !expanded && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-secondary via-secondary/90 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/90 dark:to-transparent" />
      )}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="relative mt-1 text-xs font-semibold text-text-primary/80 hover:opacity-70 cursor-pointer"
        >
          {expanded ? "Ver menos ↑" : "Ver más →"}
        </button>
      )}
    </div>
  );
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

  // Decodificar <think> del texto final (DeepSeek-R1) y combinar con reasoning explícito.
  const joinedText = textChunks.join("\n\n");
  const decoded = decodeThinking(joinedText);
  const finalReasoning = [reasoningText, decoded.reasoning].filter(Boolean).join("\n").trim();
  if (decoded.reasoning && reasoningStreaming) reasoningStreaming = true;
  const text = decoded.content;

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

  // ─── Usuario: burbuja derecha con esquina "bocadillo" ───
  if (isUser) {
    return (
      <motion.div
        id={`msg-user-${message.id}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex scroll-mt-24 justify-end px-4 py-2 sm:px-6"
      >
        <div className="flex max-w-[85%] flex-col items-end gap-2 sm:max-w-[75%]">
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
          {text && <UserBubble text={text} />}
        </div>
      </motion.div>
    );
  }

  // ─── Asistente: full-width, sin burbuja (documento premium) ───
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex gap-3 px-4 py-4 sm:px-6"
    >
      <div className="min-w-0 flex-1">

        {/* Razonamiento (explícito + <think> decodificado) */}
        {(finalReasoning || reasoningStreaming) && (
          <ReasoningPanel text={finalReasoning} isStreaming={reasoningStreaming} />
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
          <div className="touch-visible mt-3 flex flex-wrap items-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <motion.button
              onClick={handleCopy}
              aria-label={copied ? "Copiado" : "Copiar mensaje"}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-sm transition-all duration-150 cursor-pointer hover:bg-surface-2 hover:text-text-primary active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent-emerald" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              <span>{copied ? "Copiado" : "Copiar"}</span>
            </motion.button>
            {typeof window !== "undefined" && window.speechSynthesis && (
              <motion.button
                onClick={handleSpeak}
                aria-label={speaking ? "Detener lectura" : "Escuchar mensaje"}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-sm transition-all duration-150 cursor-pointer hover:bg-surface-2 hover:text-text-primary active:scale-95"
              >
                {speaking ? <VolumeX className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
                <span>{speaking ? "Detener" : "Escuchar"}</span>
              </motion.button>
            )}
            {onRegenerate && (
              <motion.button
                onClick={onRegenerate}
                aria-label="Regenerar respuesta"
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-sm transition-all duration-150 cursor-pointer hover:bg-surface-2 hover:text-text-primary active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                <span>Regenerar</span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
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
