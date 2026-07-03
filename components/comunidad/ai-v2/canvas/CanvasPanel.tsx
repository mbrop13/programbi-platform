"use client";

import { useState } from "react";
import {
  Code2,
  Download,
  ExternalLink,
  Eye,
  Pencil,
  Share2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvas } from "./CanvasStore";
import { CodeEditor } from "./CodeEditor";
import { CanvasPreview, isPreviewable } from "./CanvasPreview";

/**
 * Panel del Canvas: cabecera con pestañas (Código / Vista Previa) y botones de
 * acción (Compartir, Descargar, Editar, Abrir Externo, Cerrar), más el cuerpo
 * que conmuta entre el editor y la vista previa en vivo.
 *
 * El contenedor exterior (tarjeta flotante / sheet móvil) lo provee ChatShell;
 * este componente aporta la estructura interna.
 */
export function CanvasPanel() {
  const { activeFile, closeCanvas } = useCanvas();
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [editing, setEditing] = useState(false);

  const language = (activeFile?.language ?? "").toLowerCase();
  const previewable = isPreviewable(language);

  // El reset de tab/edición al cambiar de archivo se logra remontando el
  // componente vía `key` (ver ChatShell), sin efecto síncrono.
  if (!activeFile) return null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* noop */
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
        {/* Pestañas */}
        <div className="flex items-center gap-0.5">
          <TabButton
            active={tab === "code"}
            onClick={() => setTab("code")}
            icon={Code2}
            label="Código"
          />
          {previewable && (
            <TabButton
              active={tab === "preview"}
              onClick={() => {
                setTab("preview");
                setEditing(false);
              }}
              icon={Eye}
              label="Vista Previa"
            />
          )}
        </div>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-0.5">
          <ActionButton icon={Share2} title="Compartir" onClick={handleShare} />
          <ActionButton icon={Download} title="Descargar" onClick={handleDownload} />
          {tab === "code" && (
            <ActionButton
              icon={Pencil}
              title={editing ? "Ver resaltado" : "Editar"}
              active={editing}
              onClick={() => setEditing((e) => !e)}
            />
          )}
          <ActionButton icon={ExternalLink} title="Abrir externo" onClick={handleOpenExternal} />
          <ActionButton icon={X} title="Cerrar" onClick={closeCanvas} />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="relative min-h-0 flex-1">
        {tab === "code" ? (
          <CodeEditor editing={editing} />
        ) : (
          <CanvasPreview />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Code2;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-surface-0 text-text-primary shadow-premium"
          : "text-text-muted hover:bg-surface-2 hover:text-text-secondary"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function ActionButton({
  icon: Icon,
  title,
  onClick,
  active,
}: {
  icon: typeof Code2;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-brand-blue/10 text-brand-blue"
          : "text-text-muted hover:bg-surface-2 hover:text-text-secondary"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
