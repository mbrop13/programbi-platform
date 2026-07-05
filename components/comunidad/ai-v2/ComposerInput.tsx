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
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getModel, getAvailableModels, type ChatModel } from "@/lib/ai/models";
import { useCanvas } from "./canvas/CanvasStore";

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
  canvasModeActive: boolean;
  onCanvasModeChange: (active: boolean) => void;
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

const PLAN_LABELS: Record<string, string> = {
  free: "Plan Gratuito",
  pro: "Plan Pro",
  max: "Plan Max",
  ultra: "Plan Ultra",
};

function formatRemaining(isoDate?: string): string {
  if (!isoDate) return "ya";
  const ms = new Date(isoDate).getTime() - Date.now();
  if (ms <= 0) return "ya";
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return `${h}h ${m}m`;
  return `${Math.round(h / 24)}d`;
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
  canvasModeActive,
  onCanvasModeChange,
}: ComposerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvas = useCanvas();
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
  const [dropdownTab, setDropdownTab] = useState<"models" | "limits">("models");
  const [quotaData, setQuotaData] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);

  const fetchQuota = async () => {
    setQuotaLoading(true);
    try {
      const res = await fetch("/api/ai/quota");
      if (res.ok) {
        const json = await res.json();
        setQuotaData(json);
      }
    } catch {
      // silent
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    if (modelOpen && dropdownTab === "limits" && !quotaData) {
      fetchQuota();
    }
  }, [modelOpen, dropdownTab, quotaData]);

  useEffect(() => {
    if (!modelOpen) {
      setDropdownTab("models");
    }
  }, [modelOpen]);

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
          "rounded-2xl border border-border bg-surface-0/85 shadow-premium backdrop-blur-xl transition-all duration-300 focus-within:border-brand-blue/35 focus-within:shadow-[0_0_20px_rgba(24,144,255,0.06)] focus-within:ring-1 focus-within:ring-brand-blue/30",
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
          className="max-h-64 w-full resize-none bg-transparent px-4 pt-3.5 text-[0.95rem] leading-relaxed text-text-primary outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 focus:border-transparent focus-visible:outline-none placeholder:text-text-faint"
        />

        {/* Barra inferior: adjuntar (izq) + modelo + voz/enviar (der) */}
        <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pt-1">
          {/* Botón "+" con menú de adjuntos (hacia arriba) */}
          <div className="flex items-center gap-0.5">
            <div ref={attachRef} className="relative">
              <motion.button
                ref={attachBtnRef}
                type="button"
                onClick={() => setAttachOpen((o) => !o)}
                disabled={uploading || isStreaming}
                aria-label="Adjuntar archivo"
                aria-expanded={attachOpen}
                aria-haspopup="menu"
                title="Adjuntar"
                whileHover={{ scale: 1.08, backgroundColor: "rgba(15, 23, 42, 0.05)" }}
                whileTap={{ scale: 0.95 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </motion.button>
              <AnimatePresence>
                {attachOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    role="menu"
                    onKeyDown={handleMenuKeyDown("attach")}
                    className="absolute bottom-full left-0 mb-1.5 w-44 overflow-hidden rounded-xl border border-border bg-surface-0 shadow-lift z-20"
                  >
                    <button
                      role="menuitem"
                      onClick={() => triggerFile("image/*")}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer border-0 bg-transparent"
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
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer border-0 bg-transparent"
                    >
                      <FileUp className="h-4 w-4 text-text-muted" aria-hidden />
                      Subir archivo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón Canvas */}
            <motion.button
              type="button"
              onClick={() => onCanvasModeChange(!canvasModeActive)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 shadow-none",
                canvasModeActive
                  ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-800"
              )}
              title="Modo Canvas"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                <path d="M5.33398 4.33301L1.33398 8.00007L5.33398 11.667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10.666 4.33301L14.666 8.00007L10.666 11.667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span>Canvas</span>
            </motion.button>

            {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" aria-hidden />}
          </div>

          {/* Modelo + voz/enviar (der) */}
          <div className="flex items-center gap-1.5">
            {/* Selector de modelo: nombre + badges + flecha, sin icono */}
            <div ref={modelRef} className="relative">
              <motion.button
                ref={modelBtnRef}
                type="button"
                onClick={() => setModelOpen((o) => !o)}
                aria-label="Cambiar modelo"
                aria-expanded={modelOpen}
                aria-haspopup="menu"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(15, 23, 42, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-text-secondary transition-colors cursor-pointer border-0 bg-transparent"
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
              </motion.button>
              <AnimatePresence>
                {modelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    role="menu"
                    onKeyDown={handleMenuKeyDown("model")}
                    className="absolute bottom-full right-0 mb-1.5 w-[340px] overflow-hidden rounded-2xl border border-border bg-surface-0 shadow-lift z-20"
                  >
                    {/* Segmented Controls for Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-lg mx-3 mt-3 mb-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setDropdownTab("models")}
                        className={cn(
                          "flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer border-0 bg-transparent text-gray-500 font-bold",
                          dropdownTab === "models" && "bg-white text-gray-900 shadow-sm"
                        )}
                      >
                        Modelos
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownTab("limits")}
                        className={cn(
                          "flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer border-0 bg-transparent text-gray-500 font-bold",
                          dropdownTab === "limits" && "bg-white text-gray-900 shadow-sm"
                        )}
                      >
                        Límites de Uso
                      </button>
                    </div>

                    <div className="h-px bg-border" />

                    {dropdownTab === "models" ? (
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
                              "flex w-full flex-col items-start gap-1 px-3 py-2 text-left transition-colors hover:bg-surface-2 cursor-pointer border-0 bg-transparent",
                              m.id === modelId ? "bg-surface-2" : ""
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text-primary">{m.label}</span>
                              <CapBadges model={m} />
                              {m.id === modelId && <Check className="h-3.5 w-3.5 text-brand-blue" aria-hidden />}
                            </span>
                            <span className="text-[11px] text-text-muted leading-relaxed">{m.description}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {quotaLoading && !quotaData ? (
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-100 rounded-md animate-pulse w-1/3" />
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                              <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                              <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* plan active title header */}
                            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-border">
                              <span className="text-xs font-bold text-slate-800">
                                {PLAN_LABELS[quotaData?.plan || "free"] ?? "Plan Gratuito"}
                              </span>
                              <span className="text-[10px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {quotaData?.plan === "ultra" ? "10x Cuota" : quotaData?.plan === "max" ? "3x Cuota" : "1x Cuota"}
                              </span>
                            </div>

                            {/* 3 cards grid */}
                            <div className="grid grid-cols-3 gap-2 px-3 py-3">
                              {/* 5 Hour Card */}
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex flex-col justify-between h-[82px]">
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider leading-none">Últ. 5h</span>
                                <div className="mt-1 flex flex-col">
                                  <span className="text-xs font-black text-slate-900 leading-none">{Math.max(0, 100 - (quotaData?.percentages?.five_hour ?? 0))}%</span>
                                  <span className="text-[7px] text-gray-400 mt-1 truncate">
                                    En: {formatRemaining(quotaData?.resetAt)}
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${Math.max(0, 100 - (quotaData?.percentages?.five_hour ?? 0))}%` }} />
                                </div>
                              </div>

                              {/* Weekly Card */}
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex flex-col justify-between h-[82px]">
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider leading-none">Semanal</span>
                                <div className="mt-1 flex flex-col">
                                  <span className="text-xs font-black text-slate-900 leading-none">{Math.max(0, 100 - (quotaData?.percentages?.weekly ?? 0))}%</span>
                                  <span className="text-[7px] text-gray-400 mt-1 truncate">
                                    Restante
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${Math.max(0, 100 - (quotaData?.percentages?.weekly ?? 0))}%` }} />
                                </div>
                              </div>

                              {/* Monthly Card */}
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex flex-col justify-between h-[82px]">
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider leading-none">Mensual</span>
                                <div className="mt-1 flex flex-col">
                                  <span className="text-xs font-black text-slate-900 leading-none">{Math.max(0, 100 - (quotaData?.percentages?.monthly ?? 0))}%</span>
                                  <span className="text-[7px] text-gray-400 mt-1 truncate">
                                    Restante
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                  <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${Math.max(0, 100 - (quotaData?.percentages?.monthly ?? 0))}%` }} />
                                </div>
                              </div>
                            </div>

                            {/* Upgrade CTA button */}
                            {quotaData?.plan !== "ultra" && (
                              <div className="px-3 pb-3">
                                <a
                                  href="/comunidad/planes"
                                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-black rounded-lg transition-all active:scale-[0.98] cursor-pointer border-0 flex items-center justify-center gap-1.5 no-underline shadow-sm"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-400" />
                                  Mejorar Plan
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón dual: micrófono (vacío) / enviar (con texto) / detener (streaming) */}
            {isStreaming ? (
              <motion.button
                onClick={onStop}
                aria-label="Detener respuesta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-text-primary text-surface-0 cursor-pointer border-0"
                title="Detener"
              >
                <Square className="h-4 w-4 fill-current" aria-hidden />
              </motion.button>
            ) : canSend ? (
              <motion.button
                onClick={onSubmit}
                aria-label="Enviar mensaje"
                whileHover={{ scale: 1.05, y: -0.5 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-glow-brand cursor-pointer border-0"
                title="Enviar mensaje"
              >
                <ArrowUp className="h-5 w-5" aria-hidden />
              </motion.button>
            ) : recording ? (
              <motion.button
                onClick={stopVoice}
                aria-label="Detener dictado"
                className="relative flex h-9 w-12 items-center justify-center gap-0.5 rounded-full bg-destructive/15 text-destructive cursor-pointer border-0"
                title="Detener"
                animate={{
                  boxShadow: [
                    "0 0 0 0px rgba(239, 68, 68, 0.2)",
                    "0 0 0 8px rgba(239, 68, 68, 0)",
                    "0 0 0 0px rgba(239, 68, 68, 0.2)"
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            ) : (
              <motion.button
                onClick={startVoice}
                disabled={!voiceSupported}
                aria-label={voiceSupported ? "Dictado por voz" : "Voz no soportada en este navegador"}
                whileHover={voiceSupported ? { scale: 1.05, backgroundColor: "var(--color-surface-3)", color: "var(--color-text-secondary)" } : {}}
                whileTap={voiceSupported ? { scale: 0.95 } : {}}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-muted disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer border-0"
                title={voiceSupported ? "Dictado por voz" : "Voz no soportada en este navegador"}
              >
                <Mic className="h-5 w-5" aria-hidden />
              </motion.button>
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
