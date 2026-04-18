"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Info, Lightbulb, AlertTriangle, Zap, Quote, Copy, Check } from "lucide-react";
import { useState } from "react";

/*
  Block Schema:
  {
    type: "heading" | "paragraph" | "code" | "image" | "quote" | "callout" | "list" | "divider",
    ...props
  }
*/

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

function BlockHeading({ block }: { block: any }) {
  const level = block.level || 2;
  const cls = level === 2
    ? "text-2xl lg:text-3xl font-black mt-10 mb-4"
    : level === 3
    ? "text-xl lg:text-2xl font-bold mt-8 mb-3"
    : "text-lg font-bold mt-6 mb-2";

  const baseClass = `serif tracking-tight text-[#0F172A] ${cls}`;
  if (level === 3) return <h3 className={baseClass}>{block.text}</h3>;
  if (level === 4) return <h4 className={baseClass}>{block.text}</h4>;
  return <h2 className={baseClass}>{block.text}</h2>;
}

function BlockParagraph({ block }: { block: any }) {
  return (
    <p
      className="text-gray-600 text-[16px] lg:text-[17px] leading-[1.85] serif-body mb-5"
      dangerouslySetInnerHTML={{ __html: block.text || "" }}
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
      <div className="relative w-full h-auto rounded-xl overflow-hidden shadow-lg">
        <img
          src={block.src}
          alt={block.alt || ""}
          className="w-full h-auto object-cover rounded-xl"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-xs text-gray-400 mt-3 italic serif-body">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function BlockQuote({ block }: { block: any }) {
  return (
    <blockquote className="relative my-8 pl-6 border-l-4 border-[#1890FF] bg-blue-50/50 rounded-r-xl py-5 pr-6">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200/50" />
      <p className="text-gray-700 text-lg serif-body italic leading-relaxed mb-2">
        "{block.text}"
      </p>
      {block.author && (
        <cite className="text-sm text-gray-500 font-bold not-italic">
          — {block.author}
        </cite>
      )}
    </blockquote>
  );
}

function BlockCallout({ block }: { block: any }) {
  const variants: Record<string, { bg: string; border: string; iconColor: string; textColor: string; icon: any }> = {
    info: { bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-500", textColor: "text-blue-800", icon: Info },
    tip: { bg: "bg-emerald-50", border: "border-emerald-200", iconColor: "text-emerald-500", textColor: "text-emerald-800", icon: Lightbulb },
    warning: { bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-500", textColor: "text-amber-800", icon: AlertTriangle },
    important: { bg: "bg-violet-50", border: "border-violet-200", iconColor: "text-violet-500", textColor: "text-violet-800", icon: Zap },
  };

  const v = variants[block.variant] || variants.info;
  const Icon = v.icon;

  return (
    <div className={`flex gap-3 p-5 rounded-xl ${v.bg} border ${v.border} my-6`}>
      <Icon className={`w-5 h-5 ${v.iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        {block.title && <p className={`text-sm font-bold ${v.textColor} mb-1`}>{block.title}</p>}
        <p className={`text-sm ${v.textColor} leading-relaxed opacity-80`} dangerouslySetInnerHTML={{ __html: block.text || "" }} />
      </div>
    </div>
  );
}

function BlockList({ block }: { block: any }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag className={`my-5 space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
      {(block.items || []).map((item: string, i: number) => (
        <li key={i} className="text-gray-600 text-[16px] serif-body leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
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

// ─── MAIN RENDERER ───

export default function ArticleBlockRenderer({ content }: { content: string }) {
  // Try to parse as JSON blocks
  let blocks: any[] | null = null;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) blocks = parsed;
  } catch {
    // Not JSON — treat as HTML
  }

  // Fallback to HTML render
  if (!blocks) {
    return (
      <article
        className="prose prose-lg max-w-none
          prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#0F172A]
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-a:text-[#1890FF] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-img:rounded-2xl prose-img:shadow-md
          prose-blockquote:border-l-[#1890FF] prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
          prose-pre:bg-[#0F172A] prose-pre:rounded-2xl
          mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
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
