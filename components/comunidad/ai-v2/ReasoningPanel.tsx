"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningPanelProps {
  text: string;
  isStreaming: boolean;
}

export function ReasoningPanel({ text, isStreaming }: ReasoningPanelProps) {
  // null = automático: abierto mientras streamea, cerrado al terminar.
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = manualOpen ?? isStreaming;

  // Mientras streama, mantener el scroll pegado abajo (sync de DOM, sin setState).
  useEffect(() => {
    if (isStreaming && open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, isStreaming, open]);

  if (!text && !isStreaming) return null;

  return (
    <div className="my-2 rounded-lg border border-border bg-surface-2/40">
      <button
        onClick={() => setManualOpen(!open)}
        aria-expanded={open}
        aria-controls="reasoning-content"
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
      >
        <Brain className={cn("h-3.5 w-3.5", isStreaming && "text-accent-purple")} />
        {isStreaming ? (
          <span className="flex items-center gap-1.5">
            Pensando
            <span className="inline-flex gap-0.5">
              <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted [animation-delay:120ms]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-text-muted [animation-delay:240ms]" />
            </span>
          </span>
        ) : (
          <span>Razonamiento</span>
        )}
        <ChevronDown
          className={cn(
            "ml-auto h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
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
            <div id="reasoning-content" className="relative">
              <div
                ref={scrollRef}
                className={cn(
                  "overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-text-muted",
                  isStreaming && "h-36"
                )}
              >
                {text || "…"}
              </div>
              {isStreaming && (
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-surface-1 to-transparent" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
