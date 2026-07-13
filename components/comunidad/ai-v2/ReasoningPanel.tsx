"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningPanelProps {
  text: string;
  isStreaming: boolean;
}

/**
 * Panel de razonamiento interno (DeepSeek-R1 / <think>).
 * Botón redondeado flotante con icono Brain; al pulsar despliega el
 * pensamiento aislado con borde izquierdo azul eléctrico.
 */
export function ReasoningPanel({ text, isStreaming }: ReasoningPanelProps) {
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = manualOpen ?? (isStreaming && !text ? true : isStreaming);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, open]);

  if (!text && !isStreaming) return null;

  const isThinking = isStreaming && !text;

  return (
    <div className="my-2">
      <button
        type="button"
        onClick={() => setManualOpen(!open)}
        aria-expanded={open}
        aria-controls="reasoning-content"
        className={cn(
          "flex h-8 items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition-colors cursor-pointer",
          open
            ? "border-border bg-surface-2 text-text-primary"
            : "border-border bg-surface-0/60 text-text-muted hover:text-text-primary hover:border-brand-blue/40"
        )}
      >
        <Brain
          className={cn("h-3.5 w-3.5 text-brand-blue", isThinking && "animate-pulse")}
          aria-hidden
        />
        <span>{isThinking ? "Pensando…" : "Razonamiento"}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-text-muted transition-transform",
            open && "rotate-90"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              id="reasoning-content"
              className="mt-1.5 max-h-52 overflow-y-auto border-l-2 border-[#1890FF]/30 py-1 pl-3.5 text-[13px] leading-relaxed text-text-muted/80 [scrollbar-width:thin] dark:text-muted-foreground/80"
            >
              <div ref={scrollRef} className="whitespace-pre-wrap">
                {text || "Pensando…"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
