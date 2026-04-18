"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus, Trash2, ChevronDown, ChevronUp, Type, Code2, ImageIcon,
  Quote, AlertCircle, List, Minus, GripVertical, FileJson, FileText, Copy
} from "lucide-react";

const BLOCK_TYPES = [
  { type: "heading", label: "Encabezado", icon: Type, desc: "H2, H3, H4" },
  { type: "paragraph", label: "Párrafo", icon: FileText, desc: "Texto enriquecido" },
  { type: "code", label: "Código", icon: Code2, desc: "Con resaltado de sintaxis" },
  { type: "image", label: "Imagen", icon: ImageIcon, desc: "Con caption" },
  { type: "quote", label: "Cita", icon: Quote, desc: "Blockquote con autor" },
  { type: "callout", label: "Callout", icon: AlertCircle, desc: "Info, tip, warning" },
  { type: "list", label: "Lista", icon: List, desc: "Ordenada o viñetas" },
  { type: "divider", label: "Separador", icon: Minus, desc: "Línea horizontal" },
];

function createDefaultBlock(type: string): any {
  switch (type) {
    case "heading": return { type, text: "", level: 2 };
    case "paragraph": return { type, text: "" };
    case "code": return { type, code: "", language: "sql", filename: "" };
    case "image": return { type, src: "", alt: "", caption: "" };
    case "quote": return { type, text: "", author: "" };
    case "callout": return { type, variant: "info", title: "", text: "" };
    case "list": return { type, ordered: false, items: [""] };
    case "divider": return { type };
    default: return { type: "paragraph", text: "" };
  }
}

interface BlockEditorProps {
  blocks: any[];
  onChange: (blocks: any[]) => void;
}

export default function ArticleBlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAdd, setShowAdd] = useState<number | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const addBlock = (type: string, afterIndex: number) => {
    const newBlock = createDefaultBlock(type);
    const updated = [...blocks];
    updated.splice(afterIndex + 1, 0, newBlock);
    onChange(updated);
    setShowAdd(null);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updates: any) => {
    const updated = blocks.map((b, i) => (i === index ? { ...b, ...updates } : b));
    onChange(updated);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  };

  const duplicateBlock = (index: number) => {
    const updated = [...blocks];
    updated.splice(index + 1, 0, { ...blocks[index] });
    onChange(updated);
  };

  // JSON mode
  const openJsonMode = () => {
    setJsonText(JSON.stringify(blocks, null, 2));
    setJsonMode(true);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        onChange(parsed);
        setJsonMode(false);
      } else {
        alert("El JSON debe ser un array de bloques");
      }
    } catch (err) {
      alert("JSON inválido: " + (err as Error).message);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Contenido (Bloques) *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-medium">{blocks.length} bloques</span>
          <button
            type="button"
            onClick={openJsonMode}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg border-none cursor-pointer transition-colors"
          >
            <FileJson className="w-3 h-3" /> JSON
          </button>
        </div>
      </div>

      {/* JSON Mode */}
      <AnimatePresence>
        {jsonMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <div className="bg-[#0F172A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Editar JSON directamente</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setJsonMode(false)} className="px-3 py-1 text-[10px] font-bold bg-white/10 text-white/60 rounded-lg border-none cursor-pointer hover:bg-white/20 transition-colors">Cancelar</button>
                  <button type="button" onClick={applyJson} className="px-3 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-lg border-none cursor-pointer hover:bg-emerald-600 transition-colors">Aplicar</button>
                </div>
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={16}
                className="w-full px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-[12px] font-mono border border-white/10 focus:outline-none focus:border-white/20 resize-y"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add first block button */}
      {blocks.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-400 mb-3">Sin bloques de contenido</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BLOCK_TYPES.map(bt => (
              <button
                key={bt.type}
                type="button"
                onClick={() => addBlock(bt.type, -1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all"
              >
                <bt.icon className="w-3.5 h-3.5 text-gray-400" />
                {bt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div key={index} className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
            {/* Block header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-50">
              <GripVertical className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-1">
                {BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type}
              </span>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => moveBlock(index, "up")} disabled={index === 0}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-20 border-none cursor-pointer bg-transparent">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-20 border-none cursor-pointer bg-transparent">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => duplicateBlock(index)}
                  className="p-1 rounded text-gray-400 hover:text-blue-500 border-none cursor-pointer bg-transparent">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => removeBlock(index)}
                  className="p-1 rounded text-gray-400 hover:text-red-500 border-none cursor-pointer bg-transparent">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block content editor */}
            <div className="px-3 py-3">
              {block.type === "heading" && (
                <div className="flex gap-2">
                  <select value={block.level || 2} onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs w-16 focus:outline-none">
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                  </select>
                  <input type="text" value={block.text || ""} onChange={(e) => updateBlock(index, { text: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-bold focus:outline-none focus:border-brand-blue/40"
                    placeholder="Título de sección..." />
                </div>
              )}

              {block.type === "paragraph" && (
                <textarea value={block.text || ""} onChange={(e) => updateBlock(index, { text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40 resize-y"
                  placeholder="Texto del párrafo... (soporta HTML inline: <strong>, <em>, <code>, <a>)" />
              )}

              {block.type === "code" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select value={block.language || "sql"} onChange={(e) => updateBlock(index, { language: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none">
                      <option value="sql">SQL</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="dax">DAX</option>
                      <option value="powerquery">Power Query (M)</option>
                      <option value="bash">Bash</option>
                      <option value="json">JSON</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="plaintext">Texto plano</option>
                    </select>
                    <input type="text" value={block.filename || ""} onChange={(e) => updateBlock(index, { filename: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-brand-blue/40"
                      placeholder="Nombre de archivo (opcional)" />
                  </div>
                  <textarea value={block.code || ""} onChange={(e) => updateBlock(index, { code: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#0F172A] text-slate-300 text-[12px] font-mono focus:outline-none focus:border-brand-blue/40 resize-y"
                    placeholder="// Tu código aquí..." spellCheck={false} />
                </div>
              )}

              {block.type === "image" && (
                <div className="space-y-2">
                  <input type="text" value={block.src || ""} onChange={(e) => updateBlock(index, { src: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="URL de la imagen" />
                  <div className="flex gap-2">
                    <input type="text" value={block.alt || ""} onChange={(e) => updateBlock(index, { alt: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-brand-blue/40"
                      placeholder="Alt text" />
                    <input type="text" value={block.caption || ""} onChange={(e) => updateBlock(index, { caption: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-brand-blue/40"
                      placeholder="Caption / descripción" />
                  </div>
                  {block.src && <img src={block.src} alt="" className="w-full max-h-40 object-cover rounded-lg border border-gray-100" />}
                </div>
              )}

              {block.type === "quote" && (
                <div className="space-y-2">
                  <textarea value={block.text || ""} onChange={(e) => updateBlock(index, { text: e.target.value })}
                    rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm italic focus:outline-none focus:border-brand-blue/40 resize-y"
                    placeholder="Texto de la cita..." />
                  <input type="text" value={block.author || ""} onChange={(e) => updateBlock(index, { author: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-brand-blue/40"
                    placeholder="Autor de la cita (opcional)" />
                </div>
              )}

              {block.type === "callout" && (
                <div className="space-y-2">
                  <select value={block.variant || "info"} onChange={(e) => updateBlock(index, { variant: e.target.value })}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none">
                    <option value="info">ℹ️ Info</option>
                    <option value="tip">💡 Tip</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="important">⚡ Important</option>
                  </select>
                  <input type="text" value={block.title || ""} onChange={(e) => updateBlock(index, { title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-bold focus:outline-none focus:border-brand-blue/40"
                    placeholder="Título del callout (opcional)" />
                  <textarea value={block.text || ""} onChange={(e) => updateBlock(index, { text: e.target.value })}
                    rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40 resize-y"
                    placeholder="Texto del callout..." />
                </div>
              )}

              {block.type === "list" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                      <input type="checkbox" checked={block.ordered || false}
                        onChange={(e) => updateBlock(index, { ordered: e.target.checked })}
                        className="rounded" />
                      Numerada
                    </label>
                  </div>
                  {(block.items || []).map((item: string, itemIdx: number) => (
                    <div key={itemIdx} className="flex gap-1">
                      <span className="text-xs text-gray-400 py-1.5 w-5 text-right flex-shrink-0">
                        {block.ordered ? `${itemIdx + 1}.` : "•"}
                      </span>
                      <input type="text" value={item} onChange={(e) => {
                        const newItems = [...(block.items || [])];
                        newItems[itemIdx] = e.target.value;
                        updateBlock(index, { items: newItems });
                      }}
                        className="flex-1 px-2 py-1 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                        placeholder={`Ítem ${itemIdx + 1}`} />
                      <button type="button" onClick={() => {
                        const newItems = (block.items || []).filter((_: any, i: number) => i !== itemIdx);
                        updateBlock(index, { items: newItems });
                      }} className="p-1 rounded text-gray-300 hover:text-red-500 border-none cursor-pointer bg-transparent">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateBlock(index, { items: [...(block.items || []), ""] })}
                    className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:text-blue-700 bg-transparent border-none cursor-pointer">
                    <Plus className="w-3 h-3" /> Agregar ítem
                  </button>
                </div>
              )}

              {block.type === "divider" && (
                <div className="flex items-center justify-center py-1">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Add block after this one */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAdd(showAdd === index ? null : index)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-400 flex items-center justify-center text-xs border-none cursor-pointer transition-all opacity-0 group-hover:opacity-100"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Block type picker */}
            <AnimatePresence>
              {showAdd === index && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-20 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-wrap gap-1 min-w-[280px]"
                >
                  {BLOCK_TYPES.map(bt => (
                    <button key={bt.type} type="button" onClick={() => addBlock(bt.type, index)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold bg-gray-50 hover:bg-brand-blue hover:text-white text-gray-600 rounded-lg border-none cursor-pointer transition-all"
                    >
                      <bt.icon className="w-3 h-3" /> {bt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
