"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningPanelProps {
  text: string;
  isStreaming: boolean;
}

export function ReasoningPanel({ text, isStreaming }: ReasoningPanelProps) {
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = manualOpen ?? isStreaming;

  useEffect(() => {
    if (isStreaming && open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, isStreaming, open]);

  if (!text && !isStreaming) return null;

  return (
    <div className="my-2 border-0 bg-transparent">
      <button
        onClick={() => setManualOpen(!open)}
        aria-expanded={open}
        aria-controls="reasoning-content"
        className="flex items-center gap-1.5 py-1 text-left text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors border-0 bg-transparent cursor-pointer outline-none"
      >
        <span>Razonamiento</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform text-stone-400",
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
            <div id="reasoning-content" className="relative pl-3 border-l border-stone-200 mt-1">
              <div
                ref={scrollRef}
                className={cn(
                  "overflow-y-auto py-1 text-[12px] leading-relaxed text-stone-500 whitespace-pre-line",
                  isStreaming && "max-h-36"
                )}
              >
                {text || "Pensando..."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
