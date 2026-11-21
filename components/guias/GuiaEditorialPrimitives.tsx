"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { SYNTAX_TOKEN_COLOR, tokenizeCode } from "@/lib/guias/syntax";

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
  className?: string;
}

export function GuiaCodeShell({
  code = "",
  language,
  title,
  tabs,
  defaultTabId,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
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
        "my-6 overflow-hidden rounded-lg border border-[var(--g-code-border)] bg-[var(--g-code-bg)] text-[var(--g-code-ink)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--g-code-border)] bg-[var(--g-code-surface)] px-3.5 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {(title || activeLanguage) && (
            <span className="truncate font-mono text-xs font-medium text-[var(--g-code-muted)]">
              {title ?? activeLanguage?.toUpperCase()}
            </span>
          )}
          {hasTabs && tabs && tabs.length > 1 && (
            <div
              role="tablist"
              aria-labelledby={title ? tablistId : undefined}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--g-code-border)] bg-[var(--g-code-bg)] p-0.5"
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
                      "min-h-[32px] rounded px-2.5 py-1 text-xs font-medium transition-colors",
                      selected
                        ? "bg-[var(--g-code-surface)] text-[var(--g-code-ink)]"
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
            className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--g-code-border)] bg-[var(--g-code-bg)] px-3 text-xs font-medium text-[var(--g-code-ink)] transition-colors hover:border-[var(--g-code-muted)] sm:min-h-[32px]"
          >
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((token, idx) => (
            <span key={idx} style={{ color: SYNTAX_TOKEN_COLOR[token.type] }}>
              {token.value}
            </span>
          ))}
        </code>
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
}

export function GuiaTocNav({
  items,
  title = "En esta guía",
  mobileLabel = "Índice de contenidos",
  className,
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
          className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-2.5 text-left text-sm font-medium text-[var(--g-ink)]"
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
            className="mt-2 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-3"
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
                        "block rounded px-2.5 py-2 text-sm no-underline transition-colors",
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

      {/* Rail sticky en escritorio */}
      <nav aria-label={title} className="hidden lg:sticky lg:top-24 lg:block">
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
      <div className="divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
        {items.map((item, idx) => (
          <details key={item.id ?? `${item.question}-${idx}`} className="group">
            <summary className="flex min-h-[44px] list-none items-center justify-between gap-4 py-3.5 text-left text-base font-medium text-[var(--g-ink)] [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-base font-normal text-[var(--g-subtle)]"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">-</span>
              </span>
            </summary>
            <div className="pb-4 pr-6 text-sm leading-relaxed text-[var(--g-muted)]">
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

export type GuiaEditorialNoteTone = "neutral" | "accent" | "caution";

export interface GuiaEditorialNoteProps {
  label: string;
  children: ReactNode;
  tone?: GuiaEditorialNoteTone;
  className?: string;
}

const NOTE_SURFACE: Record<GuiaEditorialNoteTone, string> = {
  neutral: "border-[var(--g-border)] bg-[var(--g-surface)]",
  accent: "border-[var(--g-border-strong)] bg-[var(--g-accent-soft)]",
  caution: "border-[var(--g-border-strong)] bg-[var(--g-wash)]",
};

const NOTE_LABEL: Record<GuiaEditorialNoteTone, string> = {
  neutral: "text-[var(--g-subtle)]",
  accent: "text-[var(--g-accent)]",
  caution: "text-[var(--g-ink)]",
};

export function GuiaEditorialNote({
  label,
  children,
  tone = "neutral",
  className,
}: GuiaEditorialNoteProps) {
  return (
    <aside
      className={[
        "my-6 rounded-lg border px-4 py-3.5 text-sm leading-relaxed text-[var(--g-muted)]",
        NOTE_SURFACE[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p
        className={[
          "mb-1.5 text-xs font-semibold uppercase tracking-[0.06em]",
          NOTE_LABEL[tone],
        ].join(" ")}
      >
        {label}
      </p>
      <div className="space-y-2 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
