import type { ReactNode } from "react";
import Link from "next/link";

export default function StatusPage({
  code,
  title,
  description,
  actions,
  links,
}: {
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
  links?: { href: string; label: string }[];
}) {
  return (
    <section className="relative min-h-[calc(100dvh-72px)] bg-canvas">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24">
        <p className="font-mono text-[clamp(4.75rem,16vw,9.5rem)] font-semibold leading-none tracking-tight text-ink">
          {code}
        </p>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-mute">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          {links && links.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-ink no-underline underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
