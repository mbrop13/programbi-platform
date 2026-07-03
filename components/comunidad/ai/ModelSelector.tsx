"use client";

import { useState } from "react";
import { ChevronDown, Check, Cpu, Zap, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Model {
  id: string;
  name: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  badgeColor: string;
}

export const MODELS: Model[] = [
  {
    id: "llama-3-8b",
    name: "Meta Llama 3 8B",
    desc: "Gratuito y veloz",
    badge: "Free",
    icon: Cpu,
    badgeColor: "bg-gray-100 text-gray-600",
  },
  {
    id: "gemini-1.5-flash",
    name: "Google Gemini 1.5 Flash",
    desc: "Multimodal y analítico",
    badge: "Flash",
    icon: Zap,
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "gpt-4o-mini",
    name: "OpenAI GPT-4o Mini",
    desc: "Alta precisión y eficiente",
    badge: "Precise",
    icon: Sparkles,
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    desc: "Máximo nivel de programación",
    badge: "Premium",
    icon: Brain,
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({ selectedModel, onSelect, className }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const CurrentIcon = currentModel.icon;

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all text-sm"
      >
        <CurrentIcon className="w-4 h-4 text-brand-blue" />
        <span className="font-medium text-gray-900 hidden sm:inline">
          {currentModel.name}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
            <div className="p-2">
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
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-brand-blue/20" : "bg-gray-100"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isSelected ? "text-brand-blue" : "text-gray-500")} />
                    </div>
                    <div className="flex-1 min-w-0">
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
                      <p className="text-xs text-gray-500 mt-0.5">{model.desc}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-blue shrink-0" />
                    )}
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
