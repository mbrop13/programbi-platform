"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Circle,
  Clock,
  ExternalLink,
  Globe,
  CheckCircle2,
  XCircle,
  Wrench,
  Compass,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatPart } from "./types";

interface ToolCardProps {
  part: ChatPart;
}

function humanizeToolName(type: string): string {
  // 'tool-webSearch' → 'Búsqueda web'
  const raw = type.replace(/^tool-/, "");
  if (raw === "webSearch") return "Búsqueda web";
  return raw
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Hostname seguro: no lanza si la URL está malformada. */
function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** Estado de la herramienta → punto de color para el timeline. */
function statusVisual(state?: string): {
  label: string;
  icon: typeof Circle;
  dotClass: string;
  done: boolean;
} {
  switch (state) {
    case "output-available":
      return { label: "Completado", icon: CheckCircle2, dotClass: "bg-text-primary", done: true };
    case "output-error":
      return { label: "Falló", icon: XCircle, dotClass: "bg-destructive", done: true };
    case "input-available":
      return { label: "En curso", icon: Clock, dotClass: "bg-accent-yellow animate-pulse", done: false };
    case "input-streaming":
    default:
      return { label: "Pendiente", icon: Circle, dotClass: "bg-text-muted", done: false };
  }
}

interface WebSearchResult {
  title: string;
  url: string;
  content?: string;
}

function WebSearchBody({
  output,
}: {
  output: {
    error?: string;
    answer?: string;
    results?: WebSearchResult[];
  };
}) {
  const [showAll, setShowAll] = useState(false);
  if (output.error) {
    return <p className="text-[12px] text-destructive">{output.error}</p>;
  }
  const results = output.results ?? [];
  const visible = showAll ? results : results.slice(0, 2);
  const hidden = results.length - visible.length;

  return (
    <div className="space-y-2.5">
      {output.answer && (
        <p className="text-[12px] leading-relaxed text-text-secondary">{output.answer}</p>
      )}
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {visible.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/src flex items-center gap-2 rounded-xl border border-border bg-surface-0 p-2 transition-colors hover:border-brand-blue/35 no-underline"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${safeHostname(r.url)}&sz=32`}
                    alt=""
                    className="h-4 w-4"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-text-primary group-hover/src:text-brand-blue">
                    {r.title}
                  </span>
                  <span className="block truncate text-[10px] text-text-faint">
                    {safeHostname(r.url)}
                  </span>
                </span>
                <ExternalLink className="h-3 w-3 shrink-0 text-text-faint" aria-hidden />
              </a>
            ))}
          </div>
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-[11px] font-semibold text-brand-blue hover:opacity-70 cursor-pointer"
            >
              +{hidden} más
            </button>
          )}
          {showAll && results.length > 2 && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-[11px] font-semibold text-text-muted hover:opacity-70 cursor-pointer"
            >
              Mostrar menos
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function ToolCard({ part }: ToolCardProps) {
  const [open, setOpen] = useState(part.state === "input-available");
  const name = humanizeToolName(part.type);
  const isWebSearch = part.type === "tool-webSearch";
  const query = (part.input as { query?: string } | undefined)?.query;
  const visual = statusVisual(part.state);
  const StatusIcon = visual.icon;

  // Cabecera: icono según estado (Compass | Loader2 | CheckCircle2)
  const HeaderIcon = visual.done ? (isWebSearch ? Globe : Wrench) : Compass;
  const headerSpin = !visual.done && part.state === "input-available";

  const hasBody =
    part.output != null || part.errorText != null || part.state === "input-available";

  return (
    <div className="my-2 overflow-hidden rounded-2xl border border-border bg-surface-0/60 shadow-sm transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md dark:bg-surface-2/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`tool-${part.toolCallId ?? "x"}-body`}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-surface-2/40 cursor-pointer"
      >
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2",
            headerSpin && "text-accent-yellow"
          )}
        >
          {headerSpin ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <HeaderIcon className="h-3.5 w-3.5 text-text-muted" aria-hidden />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-text-primary">
            {visual.done ? `${name} completado` : `Ejecutando ${name.toLowerCase()}…`}
          </span>
          {query && (
            <span className="block truncate text-[11px] text-text-faint">{`"${query}"`}</span>
          )}
        </span>
        {/* Timeline dot + status */}
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full border border-surface-0", visual.dotClass)} />
          <span className="flex items-center gap-1 text-[10px] font-medium text-text-muted">
            <StatusIcon className="h-3 w-3" aria-hidden />
            {visual.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-text-muted transition-transform",
            !open && "-rotate-90"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && hasBody && (
          <motion.div
            id={`tool-${part.toolCallId ?? "x"}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border"
          >
            {/* Timeline vertical mínimo del paso */}
            <div className="ml-4 border-l border-border pl-3">
              <div className="relative py-2">
                <span
                  className={cn(
                    "absolute -left-[17.5px] top-[14px] h-2 w-2 rounded-full border border-surface-0",
                    visual.dotClass
                  )}
                />
                <span className="text-[11px] font-medium text-text-muted">
                  {query ? `Consultando: ${query}` : name}
                </span>
              </div>
            </div>
            <div className="px-3 pb-3">
              {part.errorText && (
                <p className="text-[12px] text-destructive">{part.errorText}</p>
              )}
              {part.output != null &&
                (isWebSearch ? (
                  <WebSearchBody
                    output={part.output as {
                      error?: string;
                      answer?: string;
                      results?: WebSearchResult[];
                    }}
                  />
                ) : (
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-surface-1 p-2 font-mono text-[11px] text-text-secondary">
                    {typeof part.output === "string"
                      ? part.output
                      : JSON.stringify(part.output, null, 2)}
                  </pre>
                ))}
              {part.state === "input-available" && !part.output && (
                <p className="text-[12px] text-text-muted">Ejecutando…</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
