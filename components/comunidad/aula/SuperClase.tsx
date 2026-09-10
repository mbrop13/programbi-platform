"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLessonNote, saveLessonNote } from "@/lib/supabase/comunidad-ai";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center py-16">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  ),
});

const DEFAULT_CODE: Record<string, string> = {
  python: "# Escribe tu código Python aquí\nprint('¡Hola ProgramBI!')",
  sql: "-- Escribe tu consulta SQL aquí\nSELECT 'Hola ProgramBI' AS mensaje;",
  javascript: "// Escribe tu código JavaScript aquí\nconsole.log('¡Hola ProgramBI!');",
};

export function SuperClase({
  courseId,
  lessonId,
  language,
  onClose,
}: {
  courseId: string;
  lessonId: string;
  language: string;
  onClose: () => void;
}) {
  const [code, setCode] = useState(DEFAULT_CODE[language] || DEFAULT_CODE.python);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLessonNote(courseId, lessonId)
      .then((saved) => {
        if (!cancelled && saved) setCode(saved);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId]);

  useEffect(() => {
    const t = setTimeout(() => {
      saveLessonNote(courseId, lessonId, code).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [code, courseId, lessonId]);

  const execute = async () => {
    setRunning(true);
    setOutput("");
    try {
      const versionMap: Record<string, string> = {
        python: "3.10.0",
        javascript: "18.15.0",
        sql: "3.36.0",
      };
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version: versionMap[language] || "*",
          files: [
            {
              name: `main.${language === "python" ? "py" : language === "javascript" ? "js" : "sql"}`,
              content: code,
            },
          ],
        }),
      });
      const result = await response.json();
      setOutput(result.run?.output || result.compile?.output || "Ejecutado sin salida.");
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Error de ejecución");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      <header className="h-12 border-b border-border flex items-center gap-3 px-4">
        <p className="text-sm font-medium flex-1">Super Clase · {language}</p>
        <Button size="sm" onClick={() => void execute()} disabled={running}>
          {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          Ejecutar
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
          <X />
        </Button>
      </header>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 border-b lg:border-b-0 lg:border-r border-border">
          <Editor
            height="100%"
            language={language === "sql" ? "sql" : language}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-light"
            options={{ minimap: { enabled: false }, fontSize: 13 }}
          />
        </div>
        <pre className="p-4 text-xs overflow-auto bg-surface text-foreground whitespace-pre-wrap">
          {output || "Haz clic en Ejecutar para correr el script…"}
        </pre>
      </div>
    </div>
  );
}
