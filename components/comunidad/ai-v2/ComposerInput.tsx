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
  voiceActive: boolean;
  onToggleVoice: () => void;
  voiceEnabled: boolean;
  placeholder?: string;
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
        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
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
  voiceActive,
  onToggleVoice,
  voiceEnabled,
  placeholder,
}: ComposerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 256) + "px";
  }, [value]);

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

  const canSend = value.trim().length > 0 && !uploading;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-border bg-surface-0 shadow-sm transition-shadow focus-within:shadow-md">
        {/* Pills de adjuntos */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-border px-2.5 py-2">
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

        {/* Textarea + acciones */}
        <div className="flex items-end gap-1.5 px-2.5 py-2">
          <div className="flex items-center gap-0.5">
            <Pill
              icon={Paperclip}
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo o imagen"
              disabled={uploading || isStreaming}
            />
            {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />}
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder ?? "Pregúntale a tu mentor IA…"}
            className="max-h-64 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] leading-relaxed text-text-primary outline-none placeholder:text-text-faint"
          />

          <div className="flex items-center gap-0.5">
            {isPremium && (
              <Pill
                icon={Globe}
                active={webSearch}
                onClick={() => onWebSearchChange(!webSearch)}
                title="Búsqueda web en vivo"
              />
            )}
            {voiceEnabled && (
              <Pill
                icon={Mic}
                active={voiceActive}
                onClick={onToggleVoice}
                title="Dictado por voz"
              />
            )}

            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-text-primary text-surface-0 transition-opacity hover:opacity-90"
                title="Detener"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!canSend}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                  canSend
                    ? "bg-brand-blue text-white hover:bg-brand-blue-dark"
                    : "bg-surface-2 text-text-faint"
                )}
                title="Enviar"
              >
                <ArrowUp className="h-4 w-4" />
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
