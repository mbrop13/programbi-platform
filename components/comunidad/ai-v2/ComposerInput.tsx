"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Brain,
  Check,
  ChevronDown,
  Eye,
  FileUp,
  Image as ImageIcon,
  Loader2,
  Mic,
  Plus,
  Square,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getModel, getAvailableModels, type ChatModel } from "@/lib/ai/models";

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
  modelId: string;
  onSelectModel: (id: string) => void;
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

/** Chips de capacidades del modelo (visión / razona). */
function CapBadges({ model }: { model: ChatModel }) {
  return (
    <span className="flex items-center gap-1">
      {model.vision && (
        <span className="inline-flex items-center gap-0.5 rounded bg-surface-2 px-1 py-0.5 text-[10px] text-text-muted">
          <Eye className="h-2.5 w-2.5" aria-hidden /> Visión
        </span>
      )}
      {model.reasoning && (
        <span className="inline-flex items-center gap-0.5 rounded bg-accent-purple/10 px-1 py-0.5 text-[10px] text-accent-purple">
          <Brain className="h-2.5 w-2.5" aria-hidden /> Razona
        </span>
      )}
      {model.badge && !model.vision && !model.reasoning && (
        <span className="rounded bg-surface-2 px-1 py-0.5 text-[10px] text-text-muted">
          {model.badge}
        </span>
      )}
    </span>
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
  modelId,
  onSelectModel,
  placeholder,
}: ComposerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const attachRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);
  const modelBtnRef = useRef<HTMLButtonElement>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceSupported] = useState(() => getRecognitionCtor() !== null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  // Auto-resize del textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 256) + "px";
  }, [value]);

  // Cerrar popovers al clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) setAttachOpen(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const triggerFile = (accept: string) => {
    setAttachOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  // Escape cierra el popover abierto y devuelve el foco al disparador
  const handleMenuKeyDown =
    (which: "attach" | "model") => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (which === "attach") {
          setAttachOpen(false);
          attachBtnRef.current?.focus();
        } else {
          setModelOpen(false);
          modelBtnRef.current?.focus();
        }
      }
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
  const selectedModel = getModel(modelId);
  const availableModels = getAvailableModels(isPremium);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Contenedor: glow azul suave al responder (streaming) */}
      <div
        className={cn(
          "rounded-2xl border border-border bg-surface-0/85 shadow-premium backdrop-blur-xl transition-shadow",
          isStreaming && "composer-glow"
        )}
      >
        {/* Chips de adjuntos */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
            {attachments.map((a, i) => (
              <span
                key={i}
                className="group flex items-center gap-1.5 rounded-lg bg-surface-2 py-1 pl-1.5 pr-1 text-xs text-text-secondary"
              >
                {a.isImage && a.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} className="h-5 w-5 rounded object-cover" />
                ) : (
                  <ImageIcon className="h-3 w-3 text-text-muted" aria-hidden />
                )}
                <span className="max-w-[120px] truncate">{a.name}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  aria-label={`Quitar ${a.name}`}
                  className="rounded p-0.5 text-text-faint hover:bg-surface-3 hover:text-text-primary"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Área de escritura (arriba) */}
        <label htmlFor="composer-textarea" className="sr-only">
          Mensaje para el mentor IA
        </label>
        <textarea
          ref={textareaRef}
          id="composer-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder ?? "Pregúntale a tu mentor IA o usa el micrófono…"}
          className="max-h-64 w-full resize-none bg-transparent px-4 pt-3.5 text-[0.95rem] leading-relaxed text-text-primary outline-none placeholder:text-text-faint"
        />

        {/* Barra inferior: adjuntar (izq) + modelo + voz/enviar (der) */}
        <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pt-1">
          {/* Botón "+" con menú de adjuntos (hacia arriba) */}
          <div className="flex items-center gap-0.5">
            <div ref={attachRef} className="relative">
              <button
                ref={attachBtnRef}
                type="button"
                onClick={() => setAttachOpen((o) => !o)}
                disabled={uploading || isStreaming}
                aria-label="Adjuntar archivo"
                aria-expanded={attachOpen}
                aria-haspopup="menu"
                title="Adjuntar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </button>
              {attachOpen && (
                <div
                  role="menu"
                  onKeyDown={handleMenuKeyDown("attach")}
                  className="absolute bottom-full left-0 mb-1.5 w-44 overflow-hidden rounded-xl border border-border bg-surface-0/95 shadow-lift backdrop-blur-xl"
                >
                  <button
                    role="menuitem"
                    onClick={() => triggerFile("image/*")}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    <ImageIcon className="h-4 w-4 text-text-muted" aria-hidden />
                    Subir imagen
                  </button>
                  <div className="h-px bg-border" />
                  <button
                    role="menuitem"
                    onClick={() =>
                      triggerFile(
                        ".txt,.csv,.md,.json,.py,.js,.ts,.tsx,.sql,.html,.css,.yaml,.yml,.pdf"
                      )
                    }
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    <FileUp className="h-4 w-4 text-text-muted" aria-hidden />
                    Subir archivo
                  </button>
                </div>
              )}
            </div>
            {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" aria-hidden />}
          </div>

          {/* Modelo + voz/enviar (der) */}
          <div className="flex items-center gap-1.5">
            {/* Selector de modelo: nombre + badges + flecha, sin icono */}
            <div ref={modelRef} className="relative">
              <button
                ref={modelBtnRef}
                type="button"
                onClick={() => setModelOpen((o) => !o)}
                aria-label="Cambiar modelo"
                aria-expanded={modelOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
              >
                {selectedModel.label}
                <CapBadges model={selectedModel} />
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-text-muted transition-transform",
                    modelOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              {modelOpen && (
                <div
                  role="menu"
                  onKeyDown={handleMenuKeyDown("model")}
                  className="absolute bottom-full right-0 mb-1.5 w-72 overflow-hidden rounded-xl border border-border bg-surface-0/95 shadow-lift backdrop-blur-xl"
                >
                  <div className="max-h-80 overflow-y-auto py-1">
                    {availableModels.map((m) => (
                      <button
                        key={m.id}
                        role="menuitem"
                        onClick={() => {
                          onSelectModel(m.id);
                          setModelOpen(false);
                        }}
                        className={cn(
                          "flex w-full flex-col items-start gap-1 px-3 py-2 text-left transition-colors hover:bg-surface-2",
                          m.id === modelId ? "bg-surface-2" : ""
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">{m.label}</span>
                          <CapBadges model={m} />
                          {m.id === modelId && <Check className="h-3.5 w-3.5 text-brand-blue" aria-hidden />}
                        </span>
                        <span className="text-[11px] text-text-muted">{m.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botón dual: micrófono (vacío) / enviar (con texto) / detener (streaming) */}
            {isStreaming ? (
              <button
                onClick={onStop}
                aria-label="Detener respuesta"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-text-primary text-surface-0 transition-opacity hover:opacity-90"
                title="Detener"
              >
                <Square className="h-4 w-4 fill-current" aria-hidden />
              </button>
            ) : canSend ? (
              <button
                onClick={onSubmit}
                aria-label="Enviar mensaje"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-glow-brand transition-all hover:bg-brand-blue-dark"
                title="Enviar mensaje"
              >
                <ArrowUp className="h-5 w-5" aria-hidden />
              </button>
            ) : recording ? (
              <button
                onClick={stopVoice}
                aria-label="Detener dictado"
                className="flex h-9 w-12 items-center justify-center gap-0.5 rounded-full bg-destructive/10 transition-colors hover:bg-destructive/20"
                title="Detener"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-destructive"
                    animate={{ height: [4, 16, 4] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </button>
            ) : (
              <button
                onClick={startVoice}
                disabled={!voiceSupported}
                aria-label={voiceSupported ? "Dictado por voz" : "Voz no soportada en este navegador"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                title={voiceSupported ? "Dictado por voz" : "Voz no soportada en este navegador"}
              >
                <Mic className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>

      <label htmlFor="composer-file" className="sr-only">
        Adjuntar archivos
      </label>
      <input
        ref={fileInputRef}
        id="composer-file"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
