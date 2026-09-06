"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/referidos/admin", label: "Cola" },
  { href: "/referidos/admin/referidores", label: "Referidores" },
  { href: "/referidos/admin/comisiones", label: "Comisiones" },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/referidos/admin" className="text-sm font-semibold no-underline">
            ProgramBI · Admin referidos
          </Link>
          <nav className="flex gap-1">
            {NAV.map((n) => {
              const active =
                n.href === "/referidos/admin"
                  ? pathname === n.href
                  : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm no-underline",
                    active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{email}</span>
            <Link href="/referidos/app" className="hover:text-foreground">
              Panel referidor
            </Link>
            <a href="/api/referrals/admin/export" className="hover:text-foreground">
              Export CSV
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
