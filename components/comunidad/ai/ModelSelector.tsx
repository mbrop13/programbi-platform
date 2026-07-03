"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Cpu, Zap, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Model {
  id: string;
  name: string;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
}

export const MODELS: Model[] = [
  {
    id: "llama-3-8b",
    name: "Llama 3 8B",
    desc: "Gratuito y veloz",
    badge: "Free",
    badgeColor: "bg-zinc-100 text-zinc-600",
    icon: Cpu,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    desc: "Multimodal y analítico",
    badge: "Flash",
    badgeColor: "bg-amber-100 text-amber-700",
    icon: Zap,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    desc: "Alta precisión y eficiente",
    badge: "Preciso",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: Sparkles,
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    desc: "Máximo nivel de programación",
    badge: "Premium",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: Brain,
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
  className?: string;
  compact?: boolean;
}

export function ModelSelector({ selectedModel, onSelect, className, compact = true }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const CurrentIcon = currentModel.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-transparent hover:border-zinc-200 hover:bg-zinc-50 transition-all",
          compact ? "px-2 py-1.5" : "px-3 py-2"
        )}
      >
        <CurrentIcon className="w-4 h-4 text-brand-blue" />
        {!compact && (
          <span className="text-sm font-medium text-zinc-900 hidden sm:inline">
            {currentModel.name}
          </span>
        )}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-zinc-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl border border-zinc-200 shadow-xl z-50 overflow-hidden">
            <div className="p-1.5">
              {MODELS.map((model) => {
                const Icon = model.icon;
                const isSelected = model.id === selectedModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelect(model.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-zinc-50 text-zinc-900"
                        : "hover:bg-zinc-50 text-zinc-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-brand-blue/10" : "bg-zinc-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isSelected ? "text-brand-blue" : "text-zinc-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{model.name}</span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                            model.badgeColor
                          )}
                        >
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{model.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-blue shrink-0 mr-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
