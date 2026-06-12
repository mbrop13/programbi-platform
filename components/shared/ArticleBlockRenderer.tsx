"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Info, Lightbulb, AlertTriangle, Zap, Quote, Copy, Check } from "lucide-react";
import { useState } from "react";

/* ─── Lightweight Markdown Parser ─── */

function parseMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const parsedLines: string[] = [];
  let inList = false;
  let inOrderList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push('<hr class="border-t border-slate-200 my-8" />');
      continue;
    }

    // Headings
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h1 class="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-10 mb-5 leading-tight">${h1Match[1]}</h1>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-950 mt-8 mb-4 leading-tight">${h2Match[1]}</h2>`);
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-950 mt-6 mb-3 leading-tight">${h3Match[1]}</h3>`);
      continue;
    }

    // Blockquotes (handled escaped &gt; or plain >)
    const quoteMatch = line.match(/^&gt;\s*(.+)$/) || line.match(/^>\s*(.+)$/);
    if (quoteMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      parsedLines.push(`<blockquote class="border-l-4 border-slate-950 bg-slate-50 pl-5 py-4 pr-6 my-6 font-serif italic text-slate-800 text-lg leading-relaxed">${quoteMatch[1]}</blockquote>`);
      continue;
    }

    // Bullet Lists
    const listMatch = line.match(/^[-*+]\s+(.+)$/);
    if (listMatch) {
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      if (!inList) {
        parsedLines.push('<ul class="list-disc pl-6 space-y-2 mb-5 text-slate-700 font-serif text-base sm:text-[18px]">');
        inList = true;
      }
      parsedLines.push(`<li>${listMatch[1]}</li>`);
      continue;
    }

    // Ordered Lists
    const oListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (oListMatch) {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (!inOrderList) {
        parsedLines.push('<ol class="list-decimal pl-6 space-y-2 mb-5 text-slate-700 font-serif text-base sm:text-[18px]">');
        inOrderList = true;
      }
      parsedLines.push(`<li>${oListMatch[2]}</li>`);
      continue;
    }

    // Empty line (closes lists)
    if (line === "") {
      if (inList) { parsedLines.push("</ul>"); inList = false; }
      if (inOrderList) { parsedLines.push("</ol>"); inOrderList = false; }
      continue;
    }

    // Regular paragraph line
    if (inList) {
      parsedLines[parsedLines.length - 1] = parsedLines[parsedLines.length - 1].slice(0, -5) + " " + line + "</li>";
    } else if (inOrderList) {
      parsedLines[parsedLines.length - 1] = parsedLines[parsedLines.length - 1].slice(0, -5) + " " + line + "</li>";
    } else {
      parsedLines.push(`<p class="text-slate-850 text-base sm:text-[18px] leading-[1.85] font-serif mb-6">${line}</p>`);
    }
  }

  // Close open lists at the end
  if (inList) parsedLines.push("</ul>");
  if (inOrderList) parsedLines.push("</ol>");

  let parsedHtml = parsedLines.join("\n");

  // Inline formatting: Bold (**text** or __text__)
  parsedHtml = parsedHtml.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>');
  parsedHtml = parsedHtml.replace(/__(.*?)__/g, '<strong class="font-bold text-slate-950">$1</strong>');

  // Inline formatting: Italic (*text* or _text_)
  parsedHtml = parsedHtml.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  parsedHtml = parsedHtml.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  // Inline formatting: Links ([text](url))
  parsedHtml = parsedHtml.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#1890FF] font-semibold underline underline-offset-4 hover:text-[#0050b3] transition-colors">$1</a>');

  return parsedHtml;
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
  // Bold
  parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Links
  parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#1890FF] font-semibold underline">$1</a>');

  return (
    <p
      className="text-slate-850 text-[16px] lg:text-[17px] leading-[1.85] serif-body mb-5"
      dangerouslySetInnerHTML={{ __html: parsedText }}
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
      <div className="relative w-full h-auto rounded-lg overflow-hidden border border-slate-100 shadow-sm">
        <img
          src={block.src}
          alt={block.alt || ""}
          className="w-full h-auto object-cover rounded-lg"
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

  return (
    <div className={`flex gap-3 p-5 rounded-xl ${v.bg} border ${v.border} my-6`}>
      <Icon className={`w-5 h-5 ${v.iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        {block.title && <p className={`text-sm font-bold ${v.textColor} mb-1`}>{block.title}</p>}
        <p className={`text-sm ${v.textColor} leading-relaxed opacity-95`} dangerouslySetInnerHTML={{ __html: block.text || "" }} />
      </div>
    </div>
  );
}

function BlockList({ block }: { block: any }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag className={`my-5 space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
      {(block.items || []).map((item: string, i: number) => (
        <li key={i} className="text-slate-850 text-[16px] serif-body leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
      ))}
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
    const isMarkdown = content.trim().startsWith("#") || content.includes("\n## ") || content.includes("\n- ") || content.includes("\n* ") || content.includes("---");
    const htmlContent = isMarkdown ? parseMarkdownToHtml(content) : content;

    return (
      <article
        className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-950
          prose-p:text-slate-850 prose-p:leading-[1.85] prose-p:font-serif
          prose-a:text-[#1890FF] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#0050b3]
          prose-strong:text-slate-950
          prose-img:rounded-lg prose-img:border prose-img:border-slate-100
          prose-blockquote:border-l-4 prose-blockquote:border-l-slate-950 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:pl-5 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:font-serif
          mb-12"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
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
          default:
            return null;
        }
      })}
    </article>
  );
}
