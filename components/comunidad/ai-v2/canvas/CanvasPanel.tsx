"use client";

import { useState } from "react";
import {
  Code2,
  Download,
  ExternalLink,
  Eye,
  Pencil,
  Redo2,
  Undo2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvas } from "./CanvasStore";
import { CodeEditor } from "./CodeEditor";
import { CanvasPreview, isPreviewable } from "./CanvasPreview";

type TabKey = "code" | "preview";

/**
 * Panel del Canvas: cabecera con pestañas (Código / Vista Previa) y botones de
 * acción (Deshacer/Rehacer, Descargar, Editar, Abrir Externo, Cerrar), más el
 * cuerpo que conmuta entre el editor y la vista previa en vivo.
 *
 * El contenedor exterior (tarjeta flotante / sheet móvil) lo provee ChatShell;
 * este componente aporta la estructura interna.
 */
export function CanvasPanel() {
  const { activeFile, closeCanvas, undo, redo, canUndo, canRedo } = useCanvas();
  const [tab, setTab] = useState<TabKey>("code");
  const [editing, setEditing] = useState(false);

  const language = (activeFile?.language ?? "").toLowerCase();
  const previewable = isPreviewable(language);

  // El reset de tab/edición al cambiar de archivo se logra remontando el
  // componente vía `key` (ver ChatShell), sin efecto síncrono.
  if (!activeFile) return null;

  const tabs: { key: TabKey; label: string; icon: typeof Code2 }[] = [
    { key: "code", label: "Código", icon: Code2 },
    ...(previewable
      ? [{ key: "preview" as TabKey, label: "Vista Previa", icon: Eye }]
      : []),
  ];

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.key === tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      setTab(next.key);
      if (next.key === "preview") setEditing(false);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      setTab(prev.key);
    }
  };

  const buildBlobUrl = () => {
    const blob = new Blob([activeFile.code], { type: "text/plain;charset=utf-8" });
    return URL.createObjectURL(blob);
  };

  const ensureExtension = (name: string) => {
    if (/\.[a-z0-9]+$/i.test(name)) return name;
    const ext = language === "markdown" ? "md" : language || "txt";
    return `${name}.${ext}`;
  };

  const handleDownload = () => {
    const url = buildBlobUrl();
    const a = document.createElement("a");
    a.href = url;
    a.download = ensureExtension(activeFile.title || "codigo");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOpenExternal = () => {
    const url = buildBlobUrl();
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Cabecera */}
      <div className="flex items-center gap-1 border-b border-border bg-surface-1/60 px-2 py-1.5">
        {/* Pestañas (ARIA tablist) */}
        <div className="flex items-center gap-0.5" role="tablist" aria-label="Vistas del Canvas" onKeyDown={onTabKeyDown}>
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                id={`canvas-tab-${t.key}`}
                aria-selected={active}
                aria-controls="canvas-tabpanel"
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  setTab(t.key);
                  if (t.key === "preview") setEditing(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40",
                  active
                    ? "bg-surface-0 text-text-primary shadow-float"
                    : "text-text-muted hover:bg-surface-2 hover:text-text-secondary"
                )}
              >
                <t.icon className="h-3.5 w-3.5" aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-0.5">
          {tab === "code" && (
            <>
              <ActionButton
                icon={Undo2}
                title="Deshacer"
                onClick={undo}
                disabled={!canUndo}
              />
              <ActionButton
                icon={Redo2}
                title="Rehacer"
                onClick={redo}
                disabled={!canRedo}
              />
            </>
          )}
          <ActionButton icon={Download} title="Descargar" onClick={handleDownload} />
          {tab === "code" && (
            <ActionButton
              icon={Pencil}
              title={editing ? "Ver resaltado" : "Editar"}
              active={editing}
              onClick={() => setEditing((e) => !e)}
            />
          )}
          <ActionButton icon={ExternalLink} title="Abrir en ventana externa" onClick={handleOpenExternal} />
          <ActionButton icon={X} title="Cerrar Canvas" onClick={closeCanvas} />
        </div>
      </div>

      {/* Cuerpo (tabpanel) */}
      <div
        id="canvas-tabpanel"
        role="tabpanel"
        aria-labelledby={`canvas-tab-${tab}`}
        className="relative min-h-0 flex-1"
      >
        {tab === "code" ? (
          <CodeEditor editing={editing} />
        ) : (
          <CanvasPreview />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  onClick,
  active,
  disabled,
}: {
  icon: typeof Code2;
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40",
        active
          ? "bg-brand-blue/10 text-brand-blue"
          : "text-text-muted hover:bg-surface-2 hover:text-text-secondary",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-text-muted"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
