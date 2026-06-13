"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Info, Lightbulb, AlertTriangle, Zap, Quote, Copy, Check } from "lucide-react";
import { useState } from "react";
import InteractiveChart from "./InteractiveChart";
import TradingViewWidget from "./TradingViewWidget";
import DOMPurify from "dompurify";

const sanitizeHtml = (html: string): string => {
  return typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
};

/* ─── Lightweight Markdown Parser ─── */

export function applyInlineMarkdown(text: string): string {
  let html = text;
  // Inline code: `code`
  html = html.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[14px] text-slate-900 font-semibold">$1</code>');
  // Inline images: ![alt](url) -> placed before links to prevent matching
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="inline-block my-2 rounded-lg max-w-full h-auto border border-slate-100 shadow-sm" />');
  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-slate-950">$1</strong>');
  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
  // Links: [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#1890FF] font-semibold underline underline-offset-4 hover:text-[#0050b3] transition-colors">$1</a>');
  return html;
}

function parseMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const parsedLines: string[] = [];
  let inList = false;
  let inOrderList = false;
  let inTable = false;
  let inCodeBlock = false;
  let tableAlignments: string[] = [];
  let tableRowIndex = 0; // 0 for header, 1 for separator, 2+ for data

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Code Block Processing
    if (inCodeBlock) {
      if (line.startsWith("```")) {
        inCodeBlock = false;
        parsedLines.push("</code></pre></div></div>");
      } else {
        // Escape HTML tags in raw code
        const escaped = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        parsedLines.push(escaped);
      }
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "plaintext";
      inCodeBlock = true;
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (inTable) { parsedLines.push("</tbody></table></div>"); inTable = false; }
      parsedLines.push(`
        <div class="relative rounded-2xl overflow-hidden mb-6 group">
          <div class="flex items-center justify-between px-5 py-2.5 bg-[#1E293B] border-b border-white/5">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-3 h-3 rounded-full bg-red-400/60" />
                <span class="w-3 h-3 rounded-full bg-amber-400/60" />
                <span class="w-3 h-3 rounded-full bg-emerald-400/60" />
              </div>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-2">${lang}</span>
            </div>
          </div>
          <div class="relative bg-[#0F172A] px-5 py-4 overflow-x-auto">
            <pre class="text-[13px] leading-relaxed"><code class="text-slate-300 font-mono whitespace-pre">`);
      continue;
    }

    // 2. Table Line Processing
    const isTableLine = line.startsWith("|");
    if (isTableLine) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }

      const rawCells = line.split("|");
      // Split and clean cell content
      const cells = rawCells.slice(1, rawCells.length - (rawCells[rawCells.length - 1] === "" ? 1 : 0)).map(c => c.trim());

      if (!inTable) {
        inTable = true;
        tableRowIndex = 0;
        tableAlignments = [];
        parsedLines.push('<div class="overflow-x-auto my-6 border border-slate-200 rounded-xl"><table class="min-w-full divide-y divide-slate-200">');
      }

      const isSeparator = cells.every(c => c.match(/^:?-+:?$/));

      if (isSeparator) {
        tableAlignments = cells.map(c => {
          const left = c.startsWith(":");
          const right = c.endsWith(":");
          if (left && right) return "text-center";
          if (right) return "text-right";
          return "text-left";
        });
        tableRowIndex = 1;
        continue;
      }

      if (tableRowIndex === 0) {
        parsedLines.push('<thead class="bg-slate-50"><tr>');
        cells.forEach((cell) => {
          parsedLines.push(`<th class="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">${applyInlineMarkdown(cell)}</th>`);
        });
        parsedLines.push('</tr></thead><tbody class="bg-white divide-y divide-slate-100">');
        tableRowIndex = 2;
      } else {
        parsedLines.push('<tr class="hover:bg-slate-50/50 transition-colors">');
        cells.forEach((cell, idx) => {
          const align = tableAlignments[idx] || "text-left";
          parsedLines.push(`<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800 ${align} font-serif">${applyInlineMarkdown(cell)}</td>`);
        });
        parsedLines.push('</tr>');
      }
      continue;
    } else {
      if (inTable) {
        parsedLines.push('</tbody></table></div>');
        inTable = false;
        tableAlignments = [];
        tableRowIndex = 0;
      }
    }

    // 3. Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push('<hr class="border-t border-slate-200 my-8" />');
      continue;
    }

    // Skip main poster or ticker metadata declarations if they appear in the content body (e.g. from frontmatter append)
    const skipMatch = line.match(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets|Poster|Thumbnail|Thumbnail_Url|Cover_Poster|Imagen_Compartido|Imagen|Image)\s*:\s*(.+)$/i);
    if (skipMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (inTable) { parsedLines.push("</tbody></table></div>"); inTable = false; }
      continue;
    }

    // 3.5. Images / Secondary Images on their own line
    // Matches standard Markdown image: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((https?:\/\/[^\s\n\)]+)\)$/);
    if (imgMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (inTable) { parsedLines.push("</tbody></table></div>"); inTable = false; }
      const alt = imgMatch[1] || "";
      const src = imgMatch[2];
      parsedLines.push(`
        <figure class="my-8">
          <div class="relative w-full h-auto rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src="${src}" alt="${alt}" class="w-full h-auto object-cover rounded-xl" loading="lazy" />
          </div>
          ${alt ? `<figcaption class="text-center text-xs text-slate-400 mt-3 italic serif-body">${alt}</figcaption>` : ""}
        </figure>
      `);
      continue;
    }

    // Matches simple image format: imagen2: url, image2: url, imagen3: url, etc. with optional caption after url
    const inlineImgMatch = line.match(/^(?:imagen[1-9][0-9]*|image[1-9][0-9]*|imagen_adicional)\s*:\s*(https?:\/\/[^\s\n]+)(?:\s+(.+))?$/i);
    if (inlineImgMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (inTable) { parsedLines.push("</tbody></table></div>"); inTable = false; }
      const src = inlineImgMatch[1];
      const alt = inlineImgMatch[2] || "";
      parsedLines.push(`
        <figure class="my-8">
          <div class="relative w-full h-auto rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src="${src}" alt="${alt}" class="w-full h-auto object-cover rounded-xl" loading="lazy" />
          </div>
          ${alt ? `<figcaption class="text-center text-xs text-slate-400 mt-3 italic serif-body">${alt}</figcaption>` : ""}
        </figure>
      `);
      continue;
    }

    // 4. Headings
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h1 class="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-10 mb-5 leading-tight">${applyInlineMarkdown(h1Match[1])}</h1>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-950 mt-8 mb-4 leading-tight">${applyInlineMarkdown(h2Match[1])}</h2>`);
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-950 mt-6 mb-3 leading-tight">${applyInlineMarkdown(h3Match[1])}</h3>`);
      continue;
    }

    // 5. Blockquotes
    const quoteMatch = line.match(/^&gt;\s*(.+)$/) || line.match(/^>\s*(.+)$/);
    if (quoteMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<blockquote class="border-l-4 border-slate-950 bg-slate-50 pl-5 py-4 pr-6 my-6 font-serif italic text-slate-800 text-lg leading-relaxed">${applyInlineMarkdown(quoteMatch[1])}</blockquote>`);
      continue;
    }

    // 6. Bullet Lists
    const listMatch = line.match(/^[-*+]\s+(.+)$/);
    if (listMatch) {
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (!inList) {
        parsedLines.push('<ul class="list-disc pl-6 space-y-2 mb-5 text-slate-700 font-serif text-base sm:text-[18px]">');
        inList = true;
      }
      parsedLines.push(`<li>${applyInlineMarkdown(listMatch[1])}</li>`);
      continue;
    }

    // 7. Ordered Lists
    const oListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (oListMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (!inOrderList) {
        parsedLines.push('<ol class="list-decimal pl-6 space-y-2 mb-5 text-slate-700 font-serif text-base sm:text-[18px]">');
        inOrderList = true;
      }
      parsedLines.push(`<li>${applyInlineMarkdown(oListMatch[2])}</li>`);
      continue;
    }

    // 8. Empty line (closes lists & tables)
    if (line === "") {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (inTable) { parsedLines.push("</tbody></table></div>"); inTable = false; }
      continue;
    }

    // 9. Regular paragraph line
    if (inList) {
      parsedLines[parsedLines.length - 1] = parsedLines[parsedLines.length - 1].slice(0, -5) + " " + applyInlineMarkdown(line) + "</li>";
    } else if (inOrderList) {
      parsedLines[parsedLines.length - 1] = parsedLines[parsedLines.length - 1].slice(0, -5) + " " + applyInlineMarkdown(line) + "</li>";
    } else {
      parsedLines.push(`<p class="text-slate-850 text-base sm:text-[18px] leading-[1.85] font-serif mb-6">${applyInlineMarkdown(line)}</p>`);
    }
  }

  // Close open lists & tables at the end
  if (inList) parsedLines.push("</ul>");
  if (inOrderList) parsedLines.push("</ol>");
  if (inTable) parsedLines.push("</tbody></table></div>");
  if (inCodeBlock) parsedLines.push("</code></pre></div></div>");

  return parsedLines.join("\n");
}

/* ─── Helper Copy Button ─── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all border-none cursor-pointer"
      title="Copiar código"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ─── Block Subcomponents ─── */

function BlockHeading({ block }: { block: any }) {
  const level = block.level || 2;
  const cls = level === 2
    ? "text-2xl lg:text-3xl font-bold mt-10 mb-4"
    : level === 3
    ? "text-xl lg:text-2xl font-bold mt-8 mb-3"
    : "text-lg font-bold mt-6 mb-2";

  const baseClass = `serif tracking-tight text-slate-950 ${cls}`;
  if (level === 3) return <h3 className={baseClass}>{block.text}</h3>;
  if (level === 4) return <h4 className={baseClass}>{block.text}</h4>;
  return <h2 className={baseClass}>{block.text}</h2>;
}

function BlockParagraph({ block }: { block: any }) {
  let parsedText = block.text || "";
  // Code
  parsedText = parsedText.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[14px] text-slate-900 font-semibold">$1</code>');
  // Bold
  parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Links
  parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#1890FF] font-semibold underline">$1</a>');

  const sanitized = sanitizeHtml(parsedText);

  return (
    <p
      className="text-slate-850 text-[16px] lg:text-[17px] leading-[1.85] serif-body mb-5"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

function BlockCode({ block }: { block: any }) {
  const lang = block.language || "plaintext";
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 group">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#1E293B] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-2">{lang}</span>
        </div>
        {block.filename && (
          <span className="text-[10px] font-mono text-white/30">{block.filename}</span>
        )}
      </div>
      {/* Code */}
      <div className="relative bg-[#0F172A] px-5 py-4 overflow-x-auto">
        <CopyButton text={block.code || ""} />
        <pre className="text-[13px] leading-relaxed">
          <code className="text-slate-300 font-mono whitespace-pre">{block.code || ""}</code>
        </pre>
      </div>
    </div>
  );
}

function BlockImage({ block }: { block: any }) {
  return (
    <figure className="my-8">
      <div className="relative w-full h-auto rounded-xl overflow-hidden border border-slate-100 shadow-sm">
        <img
          src={block.src}
          alt={block.alt || ""}
          className="w-full h-auto object-cover rounded-xl"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-xs text-slate-400 mt-3 italic serif-body">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function BlockQuote({ block }: { block: any }) {
  return (
    <blockquote className="relative my-8 pl-6 border-l-4 border-slate-950 bg-slate-50 rounded-r-xl py-5 pr-6">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200/50" />
      <p className="text-slate-800 text-lg serif-body italic leading-relaxed mb-2">
        "{block.text}"
      </p>
      {block.author && (
        <cite className="text-sm text-slate-500 font-bold not-italic">
          — {block.author}
        </cite>
      )}
    </blockquote>
  );
}

function BlockCallout({ block }: { block: any }) {
  const variants: Record<string, { bg: string; border: string; iconColor: string; textColor: string; icon: any }> = {
    info: { bg: "bg-blue-50/55", border: "border-blue-200/50", iconColor: "text-blue-500", textColor: "text-blue-800", icon: Info },
    tip: { bg: "bg-emerald-50/55", border: "border-emerald-200/50", iconColor: "text-emerald-500", textColor: "text-emerald-800", icon: Lightbulb },
    warning: { bg: "bg-amber-50/55", border: "border-amber-200/50", iconColor: "text-amber-500", textColor: "text-amber-800", icon: AlertTriangle },
    important: { bg: "bg-violet-50/55", border: "border-violet-200/50", iconColor: "text-violet-500", textColor: "text-violet-800", icon: Zap },
  };

  const v = variants[block.variant] || variants.info;
  const Icon = v.icon;
  const sanitized = sanitizeHtml(block.text || "");

  return (
    <div className={`flex gap-3 p-5 rounded-xl ${v.bg} border ${v.border} my-6`}>
      <Icon className={`w-5 h-5 ${v.iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        {block.title && <p className={`text-sm font-bold ${v.textColor} mb-1`}>{block.title}</p>}
        <p className={`text-sm ${v.textColor} leading-relaxed opacity-95`} dangerouslySetInnerHTML={{ __html: sanitized }} />
      </div>
    </div>
  );
}

function BlockList({ block }: { block: any }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag className={`my-5 space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
      {(block.items || []).map((item: string, i: number) => {
        const sanitized = sanitizeHtml(item);
        return (
          <li key={i} className="text-slate-850 text-[16px] serif-body leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitized }} />
        );
      })}
    </Tag>
  );
}

function BlockDivider() {
  return (
    <div className="flex items-center justify-center my-10">
      <div className="flex gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

/* ─── Markdown Blocks Parser (incorporates interactive charts) ─── */

interface ContentBlock {
  type: "html" | "chart" | "ticker";
  content: string;
  chartData?: {
    type: "bar" | "line" | "pie";
    title: string;
    labels: string[];
    data: number[];
    legend?: string;
    yAxis?: string;
    colors?: string[];
  };
  tickers?: string[];
}

function parseMarkdownIntoBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split("\n");
  const blocks: ContentBlock[] = [];
  let currentHtmlLines: string[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 1. Detect TradingView Tickers block
    const isTickerStart = trimmed.match(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets)\s*:\s*(.+)$/i);
    if (isTickerStart) {
      if (currentHtmlLines.length > 0) {
        blocks.push({
          type: "html",
          content: currentHtmlLines.join("\n")
        });
        currentHtmlLines = [];
      }
      
      const rawTickers = isTickerStart[1].split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
      blocks.push({
        type: "ticker",
        content: "",
        tickers: rawTickers
      });
      i++;
      continue;
    }

    // 2. Detect chart block start
    const isChartStart = trimmed.match(/^Grafico de (barra|linea|torta|barras|línea|pastel|dona|donut|circular):/i);
    
    if (isChartStart) {
      // Push accumulated HTML block first
      if (currentHtmlLines.length > 0) {
        blocks.push({
          type: "html",
          content: currentHtmlLines.join("\n")
        });
        currentHtmlLines = [];
      }
      
      const rawType = isChartStart[1].toLowerCase();
      let chartType: "bar" | "line" | "pie" = "bar";
      if (rawType.includes("line")) chartType = "line";
      else if (rawType.includes("torta") || rawType.includes("pastel") || rawType.includes("dona") || rawType.includes("donut") || rawType.includes("circular")) chartType = "pie";
      
      // Parse chart options
      let title = "Gráfico";
      let labels: string[] = [];
      let dataValues: number[] = [];
      let legend = "Valor";
      let yAxis = "";
      let colors: string[] = [];
      
      i++; // move past start line
      
      // Read lines until empty line, end of file, or separator/divider
      while (i < lines.length) {
        const chartLine = lines[i];
        const chartLineTrimmed = chartLine.trim();
        
        if (chartLineTrimmed === "" || chartLineTrimmed === "---" || chartLineTrimmed.match(/^Grafico de /i) || chartLineTrimmed.match(/^(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets)/i)) {
          // stop parsing chart block (don't consume separator/next chart line, let outer loop handle it)
          break;
        }
        
        const titleMatch = chartLineTrimmed.match(/^(?:Titulo|Title|Título)\s*:\s*(.+)$/i);
        const labelsMatch = chartLineTrimmed.match(/^(?:Eje\s*X|EjeX|Labels|Categorías|Categorias)\s*:\s*(.+)$/i);
        const dataMatch = chartLineTrimmed.match(/^(?:Datos|Data|Valores)\s*:\s*(.+)$/i);
        const legendMatch = chartLineTrimmed.match(/^(?:Leyenda|Legend)\s*:\s*(.+)$/i);
        const yAxisMatch = chartLineTrimmed.match(/^(?:Eje\s*Y|EjeY|YAxis)\s*:\s*(.+)$/i);
        const colorsMatch = chartLineTrimmed.match(/^(?:Colores|Color|Colors)\s*:\s*(.+)$/i);
        
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else if (labelsMatch) {
          labels = labelsMatch[1].split(",").map(s => s.trim());
        } else if (dataMatch) {
          const rawData = dataMatch[1].trim();
          // Support two formats:
          // 1) "120, 150, 180" (comma separated numbers)
          // 2) "Ene: 120, Feb: 150" (label-value pairs)
          if (rawData.includes(":")) {
            const pairs = rawData.split(",").map(p => p.trim());
            const parsedLabels: string[] = [];
            const parsedValues: number[] = [];
            pairs.forEach(p => {
              const parts = p.split(":");
              if (parts.length >= 2) {
                parsedLabels.push(parts[0].trim());
                parsedValues.push(parseFloat(parts[1].trim()) || 0);
              }
            });
            if (parsedLabels.length > 0) {
              labels = parsedLabels;
              dataValues = parsedValues;
            }
          } else {
            dataValues = rawData.split(",").map(s => parseFloat(s.trim()) || 0);
          }
        } else if (legendMatch) {
          legend = legendMatch[1].trim();
        } else if (yAxisMatch) {
          yAxis = yAxisMatch[1].trim();
        } else if (colorsMatch) {
          colors = colorsMatch[1].split(",").map(s => s.trim());
        }
        
        i++;
      }
      
      blocks.push({
        type: "chart",
        content: "",
        chartData: {
          type: chartType,
          title,
          labels,
          data: dataValues,
          legend,
          yAxis,
          colors
        }
      });
    } else {
      currentHtmlLines.push(line);
      i++;
    }
  }
  
  if (currentHtmlLines.length > 0) {
    blocks.push({
      type: "html",
      content: currentHtmlLines.join("\n")
    });
  }
  
  return blocks;
}

/* ─── MAIN RENDERER ─── */

export default function ArticleBlockRenderer({ content }: { content: string }) {
  // Try to parse as JSON blocks
  let blocks: any[] | null = null;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) blocks = parsed;
  } catch {
    // Not JSON — treat as Markdown / HTML
  }

  // Fallback to Markdown / HTML render
  if (!blocks) {
    const isMarkdown = content.trim().startsWith("#") || 
      content.includes("\n## ") || 
      content.includes("\n- ") || 
      content.includes("\n* ") || 
      content.includes("---") || 
      content.match(/Grafico de/i) || 
      content.match(/(?:Ticker|Tickers|TradingView|Accion|Acción|Ticket|Tickets):/i) ||
      content.match(/!\[.*?\]\(.*?\)/) ||
      content.match(/(?:imagen[0-9]|image[0-9]|imagen_adicional):/i);
    
    if (!isMarkdown) {
      return (
        <article
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-950 prose-p:text-slate-850 prose-p:leading-[1.85] prose-p:font-serif prose-a:text-[#1890FF] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#0050b3] prose-strong:text-slate-950 prose-img:rounded-xl prose-img:border prose-img:border-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-l-slate-950 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:pl-5 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:font-serif mb-12"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      );
    }

    const subBlocks = parseMarkdownIntoBlocks(content);

    // If there are no chart or ticker blocks, render everything as a single html article to maintain exact layout
    const hasSpecialBlocks = subBlocks.some(b => b.type === "chart" || b.type === "ticker");
    if (!hasSpecialBlocks) {
      const htmlContent = parseMarkdownToHtml(content);
      return (
        <article
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-950 prose-p:text-slate-850 prose-p:leading-[1.85] prose-p:font-serif prose-a:text-[#1890FF] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#0050b3] prose-strong:text-slate-950 prose-img:rounded-xl prose-img:border prose-img:border-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-l-slate-950 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:pl-5 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:font-serif mb-12"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
        />
      );
    }

    return (
      <article className="mb-12">
        {subBlocks.map((b, idx) => {
          if (b.type === "chart") {
            return <InteractiveChart key={`chart-${idx}`} chartData={b.chartData!} />;
          } else if (b.type === "ticker") {
            return <TradingViewWidget key={`ticker-${idx}`} tickers={b.tickers!} />;
          } else {
            const htmlContent = parseMarkdownToHtml(b.content);
            return (
              <div
                key={`html-${idx}`}
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-950 prose-p:text-slate-850 prose-p:leading-[1.85] prose-p:font-serif prose-a:text-[#1890FF] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#0050b3] prose-strong:text-slate-950 prose-img:rounded-xl prose-img:border prose-img:border-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-l-slate-950 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:pl-5 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:font-serif mb-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
              />
            );
          }
        })}
      </article>
    );
  }

  // Render blocks
  return (
    <article className="mb-12">
      {blocks.map((block, i) => {
        const key = `block-${i}`;
        switch (block.type) {
          case "heading":
            return <BlockHeading key={key} block={block} />;
          case "paragraph":
            return <BlockParagraph key={key} block={block} />;
          case "code":
            return <BlockCode key={key} block={block} />;
          case "image":
            return <BlockImage key={key} block={block} />;
          case "quote":
            return <BlockQuote key={key} block={block} />;
          case "callout":
            return <BlockCallout key={key} block={block} />;
          case "list":
            return <BlockList key={key} block={block} />;
          case "divider":
            return <BlockDivider key={key} />;
          case "chart":
            return <InteractiveChart key={key} chartData={block} />;
          case "ticker":
          case "tradingview":
            return <TradingViewWidget key={key} tickers={block.tickers || []} />;
          default:
            return null;
        }
      })}
    </article>
  );
}
