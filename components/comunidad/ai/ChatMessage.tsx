"use client";

import { Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponseRenderer } from "./ResponseRenderer";
import { ReasoningBlock } from "./ReasoningBlock";
import { MessageActions } from "./MessageActions";

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
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-brand-blue to-blue-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={cn("flex-1 min-w-0", isUser ? "text-right" : "text-left")}>
        {isUser ? (
          // User message: simple bubble
          <div className="inline-block max-w-[85%] bg-brand-blue text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        ) : (
          // Assistant message: rich content
          <div className="max-w-[90%]">
            {/* Reasoning block (if present) */}
            {message.reasoning && (
              <ReasoningBlock
                content={message.reasoning}
                isStreaming={message.isStreaming}
              />
            )}

            {/* Streaming indicator */}
            {message.isStreaming && !message.content && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generando respuesta...</span>
              </div>
            )}

            {/* Main content */}
            {message.content && (
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <ResponseRenderer>{message.content}</ResponseRenderer>
              </div>
            )}

            {/* Actions (only for completed messages) */}
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
  );
}
