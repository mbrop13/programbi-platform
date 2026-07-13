"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageRow } from "./MessageRow";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

interface ChatListProps {
  messages: ChatMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  modelName?: string;
  onRegenerate?: () => void;
  userName?: string;
  userAvatarUrl?: string | null;
}

/** Texto plano ligero de un mensaje de usuario para el preview del timeline. */
function previewText(m: ChatMessage): string {
  const t = (m.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join(" ");
  return t.replace(/```[\s\S]*?```/g, " [código] ").trim();
}

/** Anchos variados para dar ritmo orgánico al timeline (rhythm anti-uniforme). */
const BAR_WIDTHS = ["w-3.5", "w-5", "w-2.5", "w-6", "w-4", "w-7"];

/**
 * Timeline vertical flotante (solo desktop) para navegar entre las preguntas
 * del usuario con scroll suave y destello temporal en la burbuja.
 */
function QuestionsTimeline({ userMessages }: { userMessages: ChatMessage[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [containerHovered, setContainerHovered] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const scrollToQuestion = (msgId: string, idx: number) => {
    setActive(idx);
    const el = document.getElementById(`msg-user-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-blue-500/40", "rounded-3xl", "transition-all", "duration-500");
      window.setTimeout(() => {
        el.classList.remove("ring-4", "ring-blue-500/40", "rounded-3xl", "transition-all", "duration-500");
      }, 1500);
    }
  };

  return (
    <div
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 select-none flex-col items-center gap-3 lg:flex"
      onMouseEnter={() => setContainerHovered(true)}
      onMouseLeave={() => {
        setContainerHovered(false);
        setHovered(null);
      }}
    >
      {/* Flecha arriba */}
      <AnimatePresence>
        {containerHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              const first = userMessages[0];
              if (first) scrollToQuestion(first.id, 0);
            }}
            disabled={active === 0}
            aria-label="Pregunta anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-0 text-text-muted shadow-sm transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronUp className="h-4 w-4" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {userMessages.map((m, idx) => {
        const isActive = active === idx || hovered === idx;
        const widthClass = BAR_WIDTHS[idx % BAR_WIDTHS.length];
        return (
          <div
            key={m.id}
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tarjeta preview flotante */}
            <AnimatePresence>
              {(hovered === idx) && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -12, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute right-8 top-1/2 w-52 -translate-y-1/2 rounded-2xl border border-border bg-surface-0/95 p-3 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-brand-blue" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">
                      Pregunta {idx + 1}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-[11px] font-semibold text-text-secondary">
                    {previewText(m) || "(Mensaje vacío)"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Marcador */}
            <button
              type="button"
              onClick={() => scrollToQuestion(m.id, idx)}
              aria-label={`Ir a la pregunta ${idx + 1}`}
              className={cn(
                "h-6 rounded-full bg-text-muted/70 transition-all duration-300 hover:bg-text-muted",
                widthClass,
                isActive && "w-8 bg-text-primary shadow-[0_0_8px_rgba(0,0,0,0.15)]"
              )}
            />
          </div>
        );
      })}

      {/* Flecha abajo */}
      <AnimatePresence>
        {containerHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              const last = userMessages[userMessages.length - 1];
              if (last) scrollToQuestion(last.id, userMessages.length - 1);
            }}
            disabled={active === userMessages.length - 1}
            aria-label="Pregunta siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-0 text-text-muted shadow-sm transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ChatList({ messages, status, modelName, onRegenerate, userName, userAvatarUrl }: ChatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const [showJump, setShowJump] = useState(false);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isPinned = distFromBottom < 80;
    setPinned(isPinned);
    setShowJump(distFromBottom > 240);
  };

  // Auto-scroll cuando hay cambios y estamos pegados abajo
  useEffect(() => {
    if (pinned && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pinned]);

  const jumpToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setPinned(true);
  };

  const lastMessage = messages[messages.length - 1];
  const lastIsAssistantStreaming =
    lastMessage?.role === "assistant" && (status === "streaming" || status === "submitted");
  const showTypingPlaceholder =
    status === "submitted" &&
    (!lastMessage || lastMessage.role !== "assistant" || (lastMessage.parts ?? []).length === 0);

  const userMessages = messages.filter((m) => m.role === "user");
  const showTimeline = userMessages.length >= 2;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-label="Mensajes de la conversación"
        className="h-full overflow-y-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          [role="log"]::-webkit-scrollbar {
            display: none !important;
          }
        ` }} />
        <div className="mx-auto w-full max-w-3xl pb-40 pt-2">
          {messages.map((m, i) => (
            <MessageRow
              key={m.id ?? i}
              message={m}
              isStreaming={
                lastIsAssistantStreaming && i === messages.length - 1
              }
              modelName={m.role === "assistant" ? modelName : undefined}
              onRegenerate={i === messages.length - 1 && m.role === "assistant" ? onRegenerate : undefined}
              userName={m.role === "user" ? userName : undefined}
              userAvatarUrl={m.role === "user" ? userAvatarUrl : undefined}
            />
          ))}

          {/* Placeholder "escribiendo…" mientras arranca el stream */}
          {showTypingPlaceholder && (
            <div
              className="flex gap-3 px-4 py-4 sm:px-6"
              role="status"
              aria-label="Mentor IA escribiendo"
            >
              <div className="flex items-center gap-1 pt-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline flotante de preguntas (desktop) */}
      {showTimeline && <QuestionsTimeline userMessages={userMessages} />}

      {/* Botón saltar abajo */}
      {showJump && (
        <button
          onClick={jumpToBottom}
          aria-label="Ir al final de la conversación"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-float transition-colors hover:bg-surface-2"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          Ir al final
        </button>
      )}
    </div>
  );
}
