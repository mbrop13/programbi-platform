"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Users,
  Wallet,
  UserRound,
  BookOpen,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Referrer } from "@/lib/referrals/types";
import { REFERRER_STATUS_LABELS } from "@/lib/referrals/status";

const NAV = [
  { href: "/referidos/app", label: "Inicio", icon: LayoutDashboard },
  { href: "/referidos/app/nueva", label: "Nueva intro", icon: Plus },
  { href: "/referidos/app/referidos", label: "Referidos", icon: Users },
  { href: "/referidos/app/comisiones", label: "Comisiones", icon: Wallet },
  { href: "/referidos/app/recursos", label: "Recursos", icon: BookOpen },
  { href: "/referidos/app/perfil", label: "Perfil", icon: UserRound },
];

export function ReferrerShell({
  referrer,
  email,
  children,
}: {
  referrer: Referrer;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/referidos");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active =
          item.href === "/referidos/app"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm no-underline transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Salir
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 border-r border-border md:flex md:flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <Link href="/referidos" className="text-sm font-semibold tracking-tight no-underline">
              ProgramBI
            </Link>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Referidos
            </span>
          </div>
          {nav}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between gap-3 border-b border-border px-4">
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Abrir menú"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <Menu className="size-4" />
              </button>
              <span className="text-sm font-semibold">Referidos</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {referrer.status !== "active" ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
                  {REFERRER_STATUS_LABELS[referrer.status]}
                </span>
              ) : null}
              <Link
                href="/referidos/app/nueva"
                className={cn(buttonVariants({ size: "sm" }), "h-8 px-3 no-underline")}
              >
                <Plus className="size-3.5" />
                Nueva intro
              </Link>
              <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            </div>
          </header>
          {open ? (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/30"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              />
              <div className="relative z-10 flex h-full w-64 flex-col border-r border-border bg-background">
                {nav}
              </div>
            </div>
          ) : null}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
