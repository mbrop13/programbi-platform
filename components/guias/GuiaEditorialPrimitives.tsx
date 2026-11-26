"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { SYNTAX_TOKEN_COLOR, tokenizeCode, type SyntaxToken } from "@/lib/guias/syntax";

/* -------------------------------------------------------------------------- */
/* GuiaScope                                                                  */
/* -------------------------------------------------------------------------- */

export interface GuiaScopeProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function GuiaScope({ children, className, id }: GuiaScopeProps) {
  return (
    <div
      id={id}
      className={["guias-scope min-h-screen bg-[var(--g-bg)] text-[var(--g-ink)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaReadingProgress                                                        */
/* -------------------------------------------------------------------------- */

export interface GuiaReadingProgressProps {
  className?: string;
}

export function GuiaReadingProgress({ className }: GuiaReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const onMediaChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    media.addEventListener("change", onMediaChange);

    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      const next = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setProgress(next);
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-40 h-[2.5px] bg-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "h-full w-full origin-left bg-[var(--g-accent)]",
          reducedMotion ? "" : "transition-transform duration-100 ease-out",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaToolVisual & getToolMeta                                               */
/* -------------------------------------------------------------------------- */

export type GuiaToolKey =
  | "powerbi"
  | "excel"
  | "sql"
  | "python"
  | "automate"
  | "chatgpt"
  | "gemini"
  | "ia"
  | "datos";

export interface GuiaToolMeta {
  key: GuiaToolKey;
  label: string;
  accentHex: string;
  softBgClass: string;
  textClass: string;
}

function normalizeToolInput(value?: string): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getToolMeta(tool?: string, course?: string): GuiaToolMeta {
  const normCourse = normalizeToolInput(course);
  const combined = `${normalizeToolInput(tool)} ${normCourse}`.trim();

  if (normCourse === "chatgpt" || (!normCourse && combined.includes("chatgpt"))) {
    return {
      key: "chatgpt",
      label: "ChatGPT",
      accentHex: "#10A37F",
      softBgClass: "bg-[#10A37F]/10 dark:bg-[#10A37F]/15",
      textClass: "text-[#0e8a6b] dark:text-[#34d399]",
    };
  }

  if (normCourse === "gemini" || (!normCourse && combined.includes("gemini"))) {
    return {
      key: "gemini",
      label: "Gemini",
      accentHex: "#4285F4",
      softBgClass: "bg-[#4285F4]/10 dark:bg-[#4285F4]/15",
      textClass: "text-[#2b6cb0] dark:text-[#60a5fa]",
    };
  }

  if (
    combined.includes("power bi") ||
    combined.includes("power-bi") ||
    combined.includes("powerbi") ||
    combined.includes("dax") ||
    combined.includes("power query")
  ) {
    return {
      key: "powerbi",
      label: "Power BI",
      accentHex: "#d97706",
      softBgClass: "bg-amber-500/10 dark:bg-amber-400/15",
      textClass: "text-amber-800 dark:text-amber-300",
    };
  }

  if (
    combined.includes("excel") ||
    combined.includes("sheets") ||
    combined.includes("hojas de calculo") ||
    combined.includes("formulas")
  ) {
    return {
      key: "excel",
      label: combined.includes("sheets") && !combined.includes("excel") ? "Google Sheets" : "Excel",
      accentHex: "#15803d",
      softBgClass: "bg-emerald-600/10 dark:bg-emerald-400/15",
      textClass: "text-emerald-800 dark:text-emerald-300",
    };
  }

  if (
    combined.includes("sql") ||
    combined.includes("postgres") ||
    combined.includes("mysql") ||
    combined.includes("sqlite") ||
    combined.includes("bigquery")
  ) {
    return {
      key: "sql",
      label: "SQL",
      accentHex: "#0b63c5",
      softBgClass: "bg-[#0b63c5]/10 dark:bg-blue-400/15",
      textClass: "text-[#0b63c5] dark:text-blue-300",
    };
  }

  if (
    combined.includes("python") ||
    combined.includes("pandas") ||
    combined.includes("numpy") ||
    combined.includes("jupyter") ||
    combined.includes("colab")
  ) {
    return {
      key: "python",
      label: "Python",
      accentHex: "#0d9488",
      softBgClass: "bg-teal-600/10 dark:bg-teal-400/15",
      textClass: "text-teal-800 dark:text-teal-300",
    };
  }

  if (
    combined.includes("automate") ||
    combined.includes("automatizacion") ||
    combined.includes("flujos") ||
    combined.includes("n8n")
  ) {
    return {
      key: "automate",
      label: "Power Automate",
      accentHex: "#0284c7",
      softBgClass: "bg-sky-600/10 dark:bg-sky-400/15",
      textClass: "text-sky-800 dark:text-sky-300",
    };
  }

  if (
    /\bia\b/.test(combined) ||
    /\bai\b/.test(combined) ||
    combined.includes("claude") ||
    combined.includes("copilot") ||
    combined.includes("chatgpt") ||
    combined.includes("prompt") ||
    combined.includes("llm")
  ) {
    return {
      key: "ia",
      label: "IA aplicada",
      accentHex: "#4f46e5",
      softBgClass: "bg-indigo-600/10 dark:bg-indigo-400/15",
      textClass: "text-indigo-800 dark:text-indigo-300",
    };
  }

  return {
    key: "datos",
    label: "Análisis de Datos",
    accentHex: "#334155",
    softBgClass: "bg-slate-600/10 dark:bg-slate-400/15",
    textClass: "text-slate-700 dark:text-slate-300",
  };
}

export interface GuiaToolVisualProps {
  tool?: string;
  course?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TOOL_SIZE_BOX: Record<NonNullable<GuiaToolVisualProps["size"]>, string> = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
};

const TOOL_SIZE_SVG: Record<NonNullable<GuiaToolVisualProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function ToolGlyph({ toolKey, className }: { toolKey: GuiaToolKey; className: string }) {
  switch (toolKey) {
    case "powerbi":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="4" y="13" width="4" height="7" rx="1" fill="currentColor" opacity="0.45" />
          <rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" opacity="0.72" />
          <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
        </svg>
      );
    case "excel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15M15 9.5v10" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <rect x="4.5" y="5.5" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.35" />
        </svg>
      );
    case "sql":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="6.5" rx="7.5" ry="2.75" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M4.5 6.5v5c0 1.52 3.36 2.75 7.5 2.75s7.5-1.23 7.5-2.75v-5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M4.5 11.5v5.5c0 1.52 3.36 2.75 7.5 2.75s7.5-1.23 7.5-2.75v-5.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
        </svg>
      );
    case "python":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M7.5 10l2.5 2.25L7.5 14.5M12 14.5h4.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "automate":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3.5" y="5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
          <rect x="15" y="5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.75" />
          <rect x="9.25" y="14" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M9 7.75h6M17.75 10.5v2.25a1.5 1.5 0 01-1.5 1.5H14.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "chatgpt":
    case "gemini":
    case "ia":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="6.5" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="17.5" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="12" cy="17" r="2.5" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M8.75 7.5h6.5M7.6 9.5l3.2 5.3M16.4 9.5l-3.2 5.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "datos":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 19.5h16M5.5 15l4.2-4.2 3.3 2.7 5.5-6.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18.5" cy="7" r="1.75" fill="currentColor" />
        </svg>
      );
  }
}

export function GuiaToolVisual({
  tool,
  course,
  size = "md",
  className,
}: GuiaToolVisualProps) {
  const meta = getToolMeta(tool, course);

  return (
    <div
      aria-hidden="true"
      className={[
        "inline-flex shrink-0 items-center justify-center border border-[var(--g-border)]",
        TOOL_SIZE_BOX[size],
        meta.softBgClass,
        meta.textClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ToolGlyph toolKey={meta.key} className={TOOL_SIZE_SVG[size]} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaVisualBadge                                                            */
/* -------------------------------------------------------------------------- */

export type GuiaVisualBadgeTone = "neutral" | "accent" | "ok" | "warn";

export interface GuiaVisualBadgeProps {
  children: ReactNode;
  tone?: GuiaVisualBadgeTone;
  className?: string;
}

const BADGE_TONE_CLASSES: Record<GuiaVisualBadgeTone, string> = {
  neutral: "border-[var(--g-border)] bg-[var(--g-wash)] text-[var(--g-muted)]",
  accent: "border-[var(--g-accent)]/25 bg-[var(--g-accent-soft)] text-[var(--g-accent)]",
  ok: "border-[var(--g-ok)]/25 bg-[var(--g-ok-soft)] text-[var(--g-ok)]",
  warn: "border-[var(--g-warn)]/25 bg-[var(--g-warn-soft)] text-[var(--g-warn)]",
};

export function GuiaVisualBadge({
  children,
  tone = "neutral",
  className,
}: GuiaVisualBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-snug",
        BADGE_TONE_CLASSES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaBreadcrumbs                                                            */
/* -------------------------------------------------------------------------- */

export interface GuiaBreadcrumbItem {
  label: string;
  href?: string;
}

export interface GuiaBreadcrumbsProps {
  items: GuiaBreadcrumbItem[];
  className?: string;
  ariaLabel?: string;
}

export function GuiaBreadcrumbs({
  items,
  className,
  ariaLabel = "Ruta de navegación",
}: GuiaBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--g-subtle)]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden="true" className="select-none text-[var(--g-border-strong)]">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="no-underline transition-colors hover:text-[var(--g-ink)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-[var(--g-ink)]" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaCodeShell                                                              */
/* -------------------------------------------------------------------------- */

export interface GuiaCodeTab {
  id: string;
  label: string;
  code: string;
  language?: string;
}

export interface GuiaCodeShellProps {
  code?: string;
  language?: string;
  title?: string;
  tabs?: GuiaCodeTab[];
  defaultTabId?: string;
  copyLabel?: string;
  copiedLabel?: string;
  showLineNumbers?: boolean;
  className?: string;
}

function splitTokensIntoLines(tokens: SyntaxToken[]): SyntaxToken[][] {
  const lines: SyntaxToken[][] = [[]];
  for (const token of tokens) {
    const parts = token.value.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }
      if (part.length > 0) {
        lines[lines.length - 1].push({ type: token.type, value: part });
      }
    });
  }
  return lines;
}

export function GuiaCodeShell({
  code = "",
  language,
  title,
  tabs,
  defaultTabId,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
  showLineNumbers = false,
  className,
}: GuiaCodeShellProps) {
  const hasTabs = Boolean(tabs && tabs.length > 0);
  const initialTabId = defaultTabId ?? tabs?.[0]?.id ?? "";
  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tablistId = useId();

  const activeTab = hasTabs
    ? tabs?.find((t) => t.id === activeTabId) ?? tabs?.[0]
    : undefined;
  const activeCode = activeTab ? activeTab.code : code;
  const activeLanguage = activeTab?.language ?? language;
  const tokens = tokenizeCode(activeCode, activeLanguage);
  const tokenLines = showLineNumbers ? splitTokensIntoLines(tokens) : null;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={[
        "my-6 overflow-hidden rounded-xl border border-[var(--g-code-border)] bg-[var(--g-code-bg)] text-[var(--g-code-ink)] shadow-[var(--g-card-shadow)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--g-code-border)] bg-[var(--g-code-surface)] px-3.5 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {(title || activeLanguage) && (
            <span
              id={title ? tablistId : undefined}
              className="truncate font-mono text-xs font-semibold tracking-tight text-[var(--g-code-muted)]"
            >
              {title ?? activeLanguage?.toUpperCase()}
            </span>
          )}
          {hasTabs && tabs && tabs.length > 1 && (
            <div
              role="tablist"
              aria-labelledby={title ? tablistId : undefined}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--g-code-border)] bg-[var(--g-code-bg)] p-0.5"
            >
              {tabs.map((tab) => {
                const selected = tab.id === activeTab?.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTabId(tab.id)}
                    className={[
                      "relative min-h-[44px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:min-h-[32px]",
                      selected
                        ? "bg-[var(--g-accent-soft)] text-[var(--g-accent)]"
                        : "text-[var(--g-code-muted)] hover:text-[var(--g-code-ink)]",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="sr-only" aria-live="polite">
            {copied ? copiedLabel : ""}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? copiedLabel : `${copyLabel} fragmento de código`}
            className={[
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors sm:min-h-[32px]",
              copied
                ? "border-[var(--g-ok)]/30 bg-[var(--g-ok-soft)] text-[var(--g-ok)]"
                : "border-[var(--g-code-border)] bg-[var(--g-code-bg)] text-[var(--g-code-ink)] hover:border-[var(--g-border-strong)]",
            ].join(" ")}
          >
            {copied ? (
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path
                  d="M3.5 8.5l3 3 6-6.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M10.5 5.5V4.25A1.25 1.25 0 009.25 3H4.25A1.25 1.25 0 003 4.25v5A1.25 1.25 0 004.25 10.5H5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        {tokenLines ? (
          <code className="block min-w-max">
            {tokenLines.map((lineTokens, lineIdx) => (
              <span key={lineIdx} className="table-row">
                <span
                  aria-hidden="true"
                  className="table-cell select-none pr-4 text-right text-xs text-[var(--g-code-muted)]/60"
                >
                  {lineIdx + 1}
                </span>
                <span className="table-cell">
                  {lineTokens.length > 0 ? (
                    lineTokens.map((token, idx) => (
                      <span key={idx} style={{ color: SYNTAX_TOKEN_COLOR[token.type] }}>
                        {token.value}
                      </span>
                    ))
                  ) : (
                    "\n"
                  )}
                </span>
              </span>
            ))}
          </code>
        ) : (
          <code>
            {tokens.map((token, idx) => (
              <span key={idx} style={{ color: SYNTAX_TOKEN_COLOR[token.type] }}>
                {token.value}
              </span>
            ))}
          </code>
        )}
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaTocNav                                                                 */
/* -------------------------------------------------------------------------- */

export interface GuiaTocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

export interface GuiaTocNavProps {
  items: GuiaTocItem[];
  title?: string;
  mobileLabel?: string;
  className?: string;
  sticky?: boolean;
}

export function GuiaTocNav({
  items,
  title = "En esta guía",
  mobileLabel = "Índice de contenidos",
  className,
  sticky = true,
}: GuiaTocNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === "undefined") return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  if (items.length === 0) return null;

  return (
    <div className={className}>
      {/* Versión móvil colapsable */}
      <div className="lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-2.5 text-left text-sm font-medium text-[var(--g-ink)] shadow-[var(--g-card-shadow)]"
        >
          <span>{mobileLabel}</span>
          <span aria-hidden="true" className="font-mono text-xs text-[var(--g-subtle)]">
            {mobileOpen ? "Cerrar" : "Abrir"}
          </span>
        </button>

        {mobileOpen && (
          <nav
            id={panelId}
            aria-label={title}
            className="mt-2 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-3 shadow-[var(--g-card-shadow)]"
          >
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "block rounded-lg px-2.5 py-2 text-sm no-underline transition-colors",
                        item.level === 3 ? "pl-5 text-xs" : "",
                        isActive
                          ? "bg-[var(--g-accent-soft)] font-semibold text-[var(--g-ink)]"
                          : "text-[var(--g-muted)] hover:text-[var(--g-ink)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Rail en escritorio */}
      <nav
        aria-label={title}
        className={sticky ? "hidden lg:sticky lg:top-24 lg:block" : "hidden lg:block"}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          {title}
        </p>
        <ul className="border-l border-[var(--g-border)]">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={[
                    "-ml-[1px] block border-l-2 py-1.5 pr-2 text-sm no-underline transition-colors",
                    item.level === 3 ? "pl-5 text-xs" : "pl-3.5",
                    isActive
                      ? "border-[var(--g-accent)] font-semibold text-[var(--g-ink)]"
                      : "border-transparent text-[var(--g-muted)] hover:border-[var(--g-border-strong)] hover:text-[var(--g-ink)]",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaFaqList                                                                */
/* -------------------------------------------------------------------------- */

export interface GuiaFaqItem {
  question: string;
  answer: ReactNode;
  id?: string;
}

export interface GuiaFaqListProps {
  items: GuiaFaqItem[];
  heading?: string;
  className?: string;
}

export function GuiaFaqList({ items, heading, className }: GuiaFaqListProps) {
  if (items.length === 0) return null;

  return (
    <section className={className}>
      {heading && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--g-ink)]">
          {heading}
        </h2>
      )}
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <details
            key={item.id ?? `${item.question}-${idx}`}
            className="group rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-4 shadow-[var(--g-card-shadow)] transition-colors hover:border-[var(--g-border-strong)]"
          >
            <summary className="flex min-h-[48px] list-none items-center justify-between gap-4 py-3.5 text-left text-base font-medium text-[var(--g-ink)] [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--g-wash)] text-[var(--g-subtle)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--g-accent-soft)] group-open:text-[var(--g-accent)]"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                  <path
                    d="M8 3.5v9M3.5 8h9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="border-t border-[var(--g-border)] pb-4 pt-3 pr-4 text-sm leading-relaxed text-[var(--g-muted)]">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* GuiaEditorialNote                                                          */
/* -------------------------------------------------------------------------- */

export type GuiaEditorialNoteTone = "neutral" | "accent" | "caution" | "success";

export interface GuiaEditorialNoteProps {
  label: string;
  children: ReactNode;
  tone?: GuiaEditorialNoteTone;
  className?: string;
}

const NOTE_SURFACE: Record<GuiaEditorialNoteTone, string> = {
  neutral: "border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)]",
  accent: "border-[var(--g-accent)]/25 bg-[var(--g-accent-soft)]",
  caution: "border-[var(--g-warn)]/25 bg-[var(--g-warn-soft)]",
  success: "border-[var(--g-ok)]/25 bg-[var(--g-ok-soft)]",
};

const NOTE_LABEL: Record<GuiaEditorialNoteTone, string> = {
  neutral: "text-[var(--g-subtle)]",
  accent: "text-[var(--g-accent)]",
  caution: "text-[var(--g-warn)]",
  success: "text-[var(--g-ok)]",
};

function NoteToneIcon({ tone }: { tone: GuiaEditorialNoteTone }) {
  if (tone === "success") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5.5 8.25l1.75 1.75 3.25-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (tone === "caution") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <path
          d="M8 2.25l6 10.75H2L8 2.25z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.25" r="0.65" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 7.25v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.1" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function GuiaEditorialNote({
  label,
  children,
  tone = "neutral",
  className,
}: GuiaEditorialNoteProps) {
  return (
    <aside
      className={[
        "my-7 rounded-2xl border px-4 py-4 text-[15px] leading-relaxed text-[var(--g-muted)] sm:px-5",
        NOTE_SURFACE[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p
        className={[
          "mb-1.5 flex items-center gap-2 text-sm font-semibold",
          NOTE_LABEL[tone],
        ].join(" ")}
      >
        <NoteToneIcon tone={tone} />
        <span>{label}</span>
      </p>
      <div className="space-y-2 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
