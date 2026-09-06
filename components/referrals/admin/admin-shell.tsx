"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/referidos/admin", label: "Cola" },
  { href: "/referidos/admin/referidores", label: "Referidores" },
  { href: "/referidos/admin/comisiones", label: "Comisiones" },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/referidos");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/referidos/admin" className="flex items-center gap-2 no-underline">
            <Image
              src="/images/logo.png"
              alt="ProgramBI"
              width={108}
              height={24}
              className="h-6 w-auto object-contain"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
              Admin
            </span>
          </Link>
          <nav className="flex gap-0.5">
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
                    "rounded-lg px-3 py-1.5 text-[13px] no-underline",
                    active ? "bg-ink text-canvas" : "text-mute hover:bg-wash hover:text-ink"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-[12px] text-mute">
            <span className="hidden sm:inline">{email}</span>
            <Link href="/referidos/app" className="no-underline hover:text-ink">
              Panel
            </Link>
            <a href="/api/referrals/admin/export" className="hidden no-underline hover:text-ink sm:inline">
              CSV
            </a>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1 hover:text-ink">
              <LogOut className="size-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
