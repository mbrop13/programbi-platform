"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponseRenderer } from "./ResponseRenderer";
import { ReasoningBlock } from "./ReasoningBlock";
import { MessageActions } from "./MessageActions";
import { motion } from "framer-motion";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  className?: string;
}

export function ChatMessage({ message, onRegenerate, className }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group relative py-5",
        isUser ? "bg-zinc-50/50" : "bg-white",
        className
      )}
    >
      <div className={cn("max-w-3xl mx-auto px-4 sm:px-6 flex gap-4", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isUser
                ? "bg-zinc-200 text-zinc-600"
                : "bg-gradient-to-br from-brand-blue to-blue-600 text-white shadow-sm"
            )}
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className={cn("flex-1 min-w-0", isUser ? "pt-0.5 text-right" : "")}>
          {isUser ? (
            <div className="inline-block text-left text-[15px] leading-relaxed text-zinc-900 whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Reasoning block */}
              {message.reasoning && (
                <ReasoningBlock
                  content={message.reasoning}
                  isStreaming={message.isStreaming}
                />
              )}

              {/* Streaming indicator */}
              {message.isStreaming && !message.content && (
                <div className="flex items-center gap-2 h-6">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                  <span className="text-sm text-zinc-400">Generando...</span>
                </div>
              )}

              {/* Main content */}
              {message.content && (
                <div className="text-[15px] leading-7 text-zinc-800">
                  <ResponseRenderer>{message.content}</ResponseRenderer>
                </div>
              )}

              {/* Actions */}
              {!message.isStreaming && message.content && (
                <MessageActions
                  content={message.content}
                  onRegenerate={onRegenerate}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
