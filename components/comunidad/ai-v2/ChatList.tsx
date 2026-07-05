"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { MessageRow } from "./MessageRow";
import type { ChatMessage } from "./types";

interface ChatListProps {
  messages: ChatMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  modelName?: string;
  onRegenerate?: () => void;
  userName?: string;
  userAvatarUrl?: string | null;
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

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-label="Mensajes de la conversación"
        className="h-full overflow-y-auto scroll-smooth"
      >
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
