"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChatMessages } from "@/lib/supabase/ai";

type Msg = { role: "user" | "assistant"; text: string };

export function LessonTutor({
  courseId,
  lessonId,
  courseTitle,
  lessonTitle,
}: {
  courseId: string;
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Soy tu asistente de esta clase. Pregúntame sobre el video, el código o los ejercicios.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChatId = localStorage.getItem(`aula-chat-${courseId}-${lessonId}`);
    if (!savedChatId) return;
    getChatMessages(savedChatId)
      .then((msgs) => {
        if (!msgs?.length) return;
        setMessages(
          msgs.map((m) => {
            const parts = (m.parts || []) as { type: string; text?: string }[];
            const text = parts.filter((p) => p.type === "text").map((p) => p.text || "").join("");
            return { role: m.role as "user" | "assistant", text };
          })
        );
      })
      .catch(() => {});
  }, [courseId, lessonId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const next = [...messages, { role: "user" as const, text: userText }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const savedChatId = localStorage.getItem(`aula-chat-${courseId}-${lessonId}`);
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              id: "context-msg",
              role: "system",
              content: `El usuario está en el curso "${courseTitle}", clase "${lessonTitle}". Responde de forma clara y breve.`,
            },
            ...next.map((msg, i) => ({ id: `msg-${i}`, role: msg.role, content: msg.text })),
          ],
          chatId: savedChatId || null,
          model: "llama-3-8b",
        }),
      });
      if (!response.ok) throw new Error("IA error");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream");
      setMessages((prev) => [...prev, { role: "assistant", text: "" }]);
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue;
          if (line.startsWith("0:")) {
            try {
              aiText += JSON.parse(line.substring(2));
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", text: aiText };
                return copy;
              });
            } catch {
              /* ignore parse */
            }
          }
          if (line.startsWith("2:")) {
            try {
              const metadataList = JSON.parse(line.substring(2));
              const meta = Array.isArray(metadataList) ? metadataList[0] : metadataList;
              if (meta?.chatId) localStorage.setItem(`aula-chat-${courseId}-${lessonId}`, meta.chatId);
            } catch {
              /* ignore */
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "No pude responder ahora. Inténtalo de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[280px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-md bg-foreground text-background px-3 py-2 text-sm"
                : "mr-8 rounded-md bg-muted px-3 py-2 text-sm"
            }
          >
            {m.text}
          </div>
        ))}
        {loading ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
        <div ref={endRef} />
      </div>
      <form
        className="p-3 border-t border-border flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre esta clase…"
          className="flex-1 h-9 rounded-md border border-border bg-bg px-3 text-sm outline-none"
        />
        <Button type="submit" size="icon-sm" disabled={loading || !input.trim()}>
          <Send />
        </Button>
      </form>
    </div>
  );
}
