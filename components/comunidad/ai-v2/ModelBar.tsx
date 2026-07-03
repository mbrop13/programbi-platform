"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, Check, ChevronDown, Eye, Star } from "lucide-react";
import { getAvailableModels, getModel, type ChatModel } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

interface ModelBarProps {
  selectedId: string;
  onSelect: (id: string) => void;
  isPremium: boolean;
}

const PINNED_KEY = "programbi_pinned_models";

function loadPinned(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PINNED_KEY) || "[]");
  } catch {
    return [];
  }
}

function CapBadges({ model }: { model: ChatModel }) {
  return (
    <span className="flex items-center gap-1">
      {model.vision && (
        <span className="inline-flex items-center gap-0.5 rounded bg-surface-2 px-1 py-0.5 text-[10px] text-text-muted">
          <Eye className="h-2.5 w-2.5" /> Visión
        </span>
      )}
      {model.reasoning && (
        <span className="inline-flex items-center gap-0.5 rounded bg-accent-purple/10 px-1 py-0.5 text-[10px] text-accent-purple">
          <Brain className="h-2.5 w-2.5" /> Razona
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

export function ModelBar({ selectedId, onSelect, isPremium }: ModelBarProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState<string[]>(() => loadPinned());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = getModel(selectedId);
  const available = getAvailableModels(isPremium);
  const pinnedModels = available.filter((m) => pinned.includes(m.id));
  const restModels = available.filter((m) => !pinned.includes(m.id));

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = pinned.includes(id)
      ? pinned.filter((p) => p !== id)
      : [...pinned, id];
    setPinned(next);
    localStorage.setItem(PINNED_KEY, JSON.stringify(next));
  };

  const renderOption = (m: ChatModel) => (
    <button
      key={m.id}
      onClick={() => {
        onSelect(m.id);
        setOpen(false);
      }}
      className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-surface-2"
    >
      <Star
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          pinned.includes(m.id)
            ? "fill-amber-400 text-amber-400"
            : "text-text-faint hover:text-amber-400"
        )}
        onClick={(e) => togglePin(m.id, e)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{m.label}</span>
          <CapBadges model={m} />
        </div>
        <p className="truncate text-[11px] text-text-muted">{m.description}</p>
      </div>
      {m.id === selectedId && <Check className="h-4 w-4 shrink-0 text-brand-blue" />}
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2"
      >
        <span className="max-w-[140px] truncate">{selected.label}</span>
        <CapBadges model={selected} />
        <ChevronDown className={cn("h-3.5 w-3.5 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-2xl border border-border bg-surface-0/90 shadow-lift backdrop-blur-xl">
          <div className="max-h-80 overflow-y-auto py-1">
            {pinnedModels.length > 0 && (
              <>
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-faint">
                  Fijados
                </div>
                {pinnedModels.map(renderOption)}
                <div className="my-1 border-t border-border" />
              </>
            )}
            {restModels.map(renderOption)}
          </div>
        </div>
      )}
    </div>
  );
}
