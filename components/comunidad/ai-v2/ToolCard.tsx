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

function StateBadge({ state }: { state?: string }) {
  const map: Record<
    string,
    { label: string; icon: typeof Circle; className: string }
  > = {
    "input-streaming": {
      label: "Pendiente",
      icon: Circle,
      className: "text-text-muted",
    },
    "input-available": {
      label: "En curso",
      icon: Clock,
      className: "text-amber-500",
    },
    "output-available": {
      label: "Completado",
      icon: CheckCircle2,
      className: "text-accent-emerald",
    },
    "output-error": {
      label: "Error",
      icon: XCircle,
      className: "text-red-500",
    },
  };
  const cfg = map[state ?? "input-streaming"] ?? map["input-streaming"];
  const Icon = cfg.icon;
  return (
    <span className={cn("flex items-center gap-1 text-[11px] font-medium", cfg.className)}>
      <Icon className={cn("h-3 w-3", state === "input-available" && "animate-pulse")} />
      {cfg.label}
    </span>
  );
}

function WebSearchOutput({ output }: { output: unknown }) {
  if (!output) return null;
  const o = output as {
    error?: string;
    answer?: string;
    results?: { title: string; url: string; content: string }[];
  };
  if (o.error) {
    return <p className="text-[12px] text-red-500">{o.error}</p>;
  }
  const results = o.results ?? [];
  return (
    <div className="space-y-2">
      {o.answer && (
        <p className="text-[12px] leading-relaxed text-text-secondary">{o.answer}</p>
      )}
      {results.length > 0 && (
        <ul className="space-y-1.5">
          {results.slice(0, 5).map((r, i) => (
            <li key={i}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-start gap-1.5 text-[12px]"
              >
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-text-muted group-hover/link:text-brand-blue" />
                <span>
                  <span className="font-medium text-brand-blue hover:underline">
                    {r.title}
                  </span>
                  <span className="ml-1 text-text-faint">— {new URL(r.url).hostname}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ToolCard({ part }: ToolCardProps) {
  const [open, setOpen] = useState(part.state === "input-available");
  const name = humanizeToolName(part.type);
  const isWebSearch = part.type === "tool-webSearch";
  const query = (part.input as { query?: string } | undefined)?.query;

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-border bg-surface-2/30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-surface-2/50"
      >
        {isWebSearch ? (
          <Globe className="h-3.5 w-3.5 text-brand-blue" />
        ) : (
          <Wrench className="h-3.5 w-3.5 text-text-muted" />
        )}
        <span className="text-xs font-medium text-text-secondary">
          {name}
          {query && (
            <span className="ml-1.5 text-text-faint">{`· "${query}"`}</span>
          )}
        </span>
        <span className="ml-auto">
          <StateBadge state={part.state} />
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (part.output || part.errorText || part.state === "input-available") && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-3 py-2">
              {part.errorText && (
                <p className="text-[12px] text-red-500">{part.errorText}</p>
              )}
              {part.output != null &&
                (isWebSearch ? (
                  <WebSearchOutput output={part.output} />
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
