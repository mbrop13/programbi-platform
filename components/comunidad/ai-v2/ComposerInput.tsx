"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Globe,
  Loader2,
  Mic,
  Paperclip,
  Square,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Attachment {
  url: string;
  name: string;
  mediaType: string;
  size: number;
  isImage: boolean;
  text?: string;
  error?: string;
}

interface ComposerInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isStreaming: boolean;
  isPremium: boolean;
  attachments: Attachment[];
  onAttachmentsChange: (a: Attachment[]) => void;
  webSearch: boolean;
  onWebSearchChange: (v: boolean) => void;
  placeholder?: string;
}

// ─── Tipos mínimos para la Web Speech API (no incluidos en lib.dom) ───
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function Pill({
  icon: Icon,
  active,
  onClick,
  title,
  disabled,
}: {
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-brand-blue/10 text-brand-blue"
          : "text-text-muted hover:bg-surface-2 hover:text-text-secondary",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function ComposerInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  isPremium,
  attachments,
  onAttachmentsChange,
  webSearch,
  onWebSearchChange,
  placeholder,
}: ComposerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceSupported] = useState(() => getRecognitionCtor() !== null);

  // Auto-resize del textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 256) + "px";
  }, [value]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* noop */
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isStreaming && value.trim()) onSubmit();
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/ai/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          onAttachmentsChange([
            ...attachments,
            {
              url: "",
              name: file.name,
              mediaType: file.type,
              size: file.size,
              isImage: false,
              error: data.error || "Error al subir",
            },
          ]);
          continue;
        }
        onAttachmentsChange([...attachments, data]);
      }
    } catch {
      /* noop */
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (idx: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== idx));
  };

  // ─── Voz (Web Speech API) ───
  const startVoice = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    finalTranscriptRef.current = "";
    const rec = new Ctor();
    rec.lang = "es-ES";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      if (finalText) finalTranscriptRef.current += finalText;
      onChange((finalTranscriptRef.current + interimText).trim());
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    try {
      rec.start();
      recognitionRef.current = rec;
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const stopVoice = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    setRecording(false);
  };

  const canSend = value.trim().length > 0 && !uploading;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Contenedor rectangular con bordes levemente redondeados */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-0/85 shadow-premium backdrop-blur-xl transition-shadow focus-within:border-brand-blue/30 focus-within:shadow-float">
        {/* Chips de adjuntos */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
            {attachments.map((a, i) => (
              <span
                key={i}
                className="group flex items-center gap-1.5 rounded-lg bg-surface-2 py-1 pl-1.5 pr-1 text-xs text-text-secondary"
              >
                {a.isImage && a.url ? (
                  <img src={a.url} alt={a.name} className="h-5 w-5 rounded object-cover" />
                ) : (
                  <Paperclip className="h-3 w-3 text-text-muted" />
                )}
                <span className="max-w-[120px] truncate">{a.name}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  className="rounded p-0.5 text-text-faint hover:bg-surface-3 hover:text-text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Área de escritura (arriba) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder ?? "Pregúntale a tu mentor IA o usa el micrófono…"}
          className="max-h-64 w-full resize-none bg-transparent px-4 pt-3.5 text-[0.95rem] leading-relaxed text-text-primary outline-none placeholder:text-text-faint"
        />

        {/* Barra inferior: adjuntar (izq) + voz/enviar (der) */}
        <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pt-1">
          <div className="flex items-center gap-0.5">
            <Pill
              icon={Paperclip}
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo o imagen"
              disabled={uploading || isStreaming}
            />
            {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />}
            {isPremium && (
              <Pill
                icon={Globe}
                active={webSearch}
                onClick={() => onWebSearchChange(!webSearch)}
                title="Búsqueda web en vivo"
              />
            )}
          </div>

          {/* Botón dual: micrófono (vacío) / enviar (con texto) / detener (streaming) */}
          <div className="flex items-center">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-text-primary text-surface-0 transition-opacity hover:opacity-90"
                title="Detener"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : canSend ? (
              <button
                onClick={onSubmit}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-glow-brand transition-all hover:bg-brand-blue-dark"
                title="Enviar mensaje"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            ) : recording ? (
              <button
                onClick={stopVoice}
                className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
                title="Detener"
              >
                <span className="flex h-4 items-end gap-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 rounded-full bg-red-500"
                      animate={{ height: [4, 16, 4] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.12,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Escuchando
              </button>
            ) : (
              <button
                onClick={startVoice}
                disabled={!voiceSupported}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                title={voiceSupported ? "Dictado por voz" : "Voz no soportada en este navegador"}
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-1.5 text-center text-[11px] text-text-faint">
        El mentor IA puede cometer errores. Verifica la información importante.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,.txt,.csv,.md,.json,.py,.js,.ts,.tsx,.sql,.html,.css,.yaml,.yml,.pdf"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
