"use client";

import { useState } from "react";
import { useCanvas } from "./CanvasStore";
import { CodeEditor } from "./CodeEditor";
import { CanvasPreview, isPreviewable } from "./CanvasPreview";
import { cn } from "@/lib/utils";

type TabKey = "code" | "preview";

export function CanvasPanel() {
  const { activeFile, closeCanvas, undo, redo, canUndo, canRedo } = useCanvas();
  const [tab, setTab] = useState<TabKey>("code");
  const [editing, setEditing] = useState(false);

  if (!activeFile) return null;

  const language = (activeFile.language ?? "").toLowerCase();
  const previewable = isPreviewable(language);

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
    <div className="flex h-full flex-col bg-white dark:bg-[#1E1E1E] text-stone-850 dark:text-stone-300">
      {/* Header (diseño mockup) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-white shrink-0">
        
        {/* Grupo Izquierdo: Pestañas (Código / Vista Previa) */}
        <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-md border border-gray-200/50">
          {/* Botón activo/inactivo: Código */}
          <button
            onClick={() => {
              setTab("code");
            }}
            className={cn(
              "w-8 h-6 flex justify-center items-center rounded transition-all cursor-pointer border-0 bg-transparent",
              tab === "code"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:bg-gray-200/50"
            )}
            aria-label="Ver Código"
            title="Código"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" className="w-4 h-4">
              <path d="M5.33398 4.33301L1.33398 8.00007L5.33398 11.667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M10.666 4.33301L14.666 8.00007L10.666 11.667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          
          {/* Botón activo/inactivo: Vista Previa */}
          <button
            onClick={() => {
              if (previewable) {
                setTab("preview");
                setEditing(false);
              }
            }}
            disabled={!previewable}
            className={cn(
              "w-8 h-6 flex justify-center items-center rounded transition-all border-0 bg-transparent",
              !previewable
                ? "opacity-30 cursor-not-allowed text-gray-305"
                : tab === "preview"
                ? "bg-white shadow-sm text-gray-900 cursor-pointer"
                : "text-gray-500 hover:bg-gray-200/50 cursor-pointer"
            )}
            aria-label="Vista Previa"
            title="Vista Previa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
            </svg>
          </button>
        </div>

        {/* Grupo Derecho */}
        <div className="flex items-center gap-1.5">
          {/* Botón Descargar */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-md text-xs font-semibold transition-colors cursor-pointer border-0"
            title="Descargar código"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Descargar</span>
          </button>
          
          {/* Botón Editar */}
          <button
            onClick={() => setEditing((e) => !e)}
            disabled={tab !== "code"}
            className={cn(
              "p-1.5 rounded-md transition-colors border-0 bg-transparent",
              tab !== "code"
                ? "text-gray-450 cursor-not-allowed opacity-50"
                : editing
                ? "text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 cursor-pointer"
                : "text-gray-550 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"
            )}
            title="Editar código"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" stroke="currentColor" strokeWidth="1.33">
              <path d="M7.99998 13.3334H14M2 13.3334H3.11636C3.44248 13.3334 3.60554 13.3334 3.75899 13.2966C3.89504 13.2639 4.0251 13.21 4.1444 13.1369C4.27895 13.0545 4.39425 12.9392 4.62486 12.7086L13 4.3334C13.5523 3.78112 13.5523 2.88569 13 2.3334C12.4477 1.78112 11.5523 1.78112 11 2.3334L2.62484 10.7086C2.39424 10.9392 2.27894 11.0545 2.19648 11.189C2.12338 11.3083 2.0695 11.4384 2.03684 11.5744C2 11.7279 2 11.8909 2 12.2171V13.3334Z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          {/* Botón Abrir Externo */}
          <button
            onClick={handleOpenExternal}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border-0 bg-transparent cursor-pointer"
            title="Abrir en ventana externa"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 6L14 2M14 2H10M14 2L8.66667 7.33333M6.66667 3.33333H5.2C4.0799 3.33333 3.51984 3.33333 3.09202 3.55132C2.71569 3.74307 2.40973 4.04903 2.21799 4.42535C2 4.85318 2 5.41323 2 6.53333V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H9.46667C10.5868 14 11.1468 14 11.5746 13.782C11.951 13.5903 12.2569 13.2843 12.4487 12.908C12.6667 12.4802 12.6667 11.9201 12.6667 10.8V9.33333" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          {/* Separador vertical */}
          <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>

          {/* Botón Cerrar */}
          <button
            onClick={closeCanvas}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
            title="Cerrar Canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="relative flex-1 w-full bg-white dark:bg-[#1E1E1E] overflow-hidden min-h-0">
        {tab === "code" ? (
          <CodeEditor editing={editing} />
        ) : (
          <CanvasPreview />
        )}
      </div>
    </div>
  );
}
