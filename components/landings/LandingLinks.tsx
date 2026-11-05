import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LandingLink } from "@/lib/data/landings-nicho";

export function LandingLinks({ title, links }: { title: string; links: LandingLink[] }) {
  return (
    <nav className="mt-14" aria-label={title}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">{title}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/25"
          >
            <span>
              <span className="block text-sm font-semibold text-ink">{link.label}</span>
              {link.description ? (
                <span className="mt-1 block text-xs leading-relaxed text-mute">
                  {link.description}
                </span>
              ) : null}
            </span>
            <ArrowRight
              size={16}
              strokeWidth={2.4}
              className="mt-0.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}
