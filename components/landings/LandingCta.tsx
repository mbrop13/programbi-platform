import Link from "next/link";
import type { LandingLink } from "@/lib/data/landings-nicho";

/**
 * CTA de landing. Los enlaces internos usan next/link; los anclas de la misma
 * página usan <a> para que el navegador haga scroll sin recargar.
 */
export function LandingCta({
  link,
  variant = "primary",
  className = "",
}: {
  link: LandingLink;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  const base =
    "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold no-underline transition-transform active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas hover:opacity-90"
      : variant === "light"
        ? "bg-canvas text-ink hover:opacity-90"
        : "border border-line bg-paper text-ink hover:bg-wash";
  const cls = `${base} ${styles} ${className}`;

  if (link.href.startsWith("#")) {
    return (
      <a href={link.href} className={cls}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}
