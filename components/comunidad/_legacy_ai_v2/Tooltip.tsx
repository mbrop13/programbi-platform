"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "right" | "left" | "top" | "bottom";
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  className,
}: TooltipProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: position === "top" ? 6 : position === "bottom" ? -6 : "-50%",
              x: position === "left" ? 6 : position === "right" ? -6 : "-50%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: position === "top" || position === "bottom" ? 0 : "-50%",
              x: position === "left" || position === "right" ? 0 : "-50%",
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "absolute z-[9999] whitespace-nowrap bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 text-[11.5px] font-bold px-3.5 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100 dark:border-zinc-800/80 pointer-events-none select-none",
              position === "right" && "left-full ml-3 top-1/2",
              position === "left" && "right-full mr-3 top-1/2",
              position === "top" && "bottom-full mb-3 left-1/2",
              position === "bottom" && "top-full mt-3 left-1/2",
              className
            )}
          >
            {content}
            
            {/* Triangle pointer */}
            <div
              className={cn(
                "absolute w-2 h-2 bg-white dark:bg-zinc-900 border-solid border-neutral-100 dark:border-zinc-800/80 rotate-45",
                position === "right" && "-left-1 top-1/2 -translate-y-1/2 border-b border-l",
                position === "left" && "-right-1 top-1/2 -translate-y-1/2 border-t border-r",
                position === "top" && "-bottom-1 left-1/2 -translate-x-1/2 border-b border-r",
                position === "bottom" && "-top-1 left-1/2 -translate-x-1/2 border-t border-l"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
