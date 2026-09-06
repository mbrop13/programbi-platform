"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  UserRound,
  BookOpen,
  Menu,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Referrer } from "@/lib/referrals/types";
import { REFERRER_STATUS_LABELS } from "@/lib/referrals/status";
import { CopyLinkButton } from "./copy-link-button";

const NAV = [
  { href: "/referidos/app", label: "Inicio", icon: LayoutDashboard },
  { href: "/referidos/app/referidos", label: "Referidos", icon: Users },
  { href: "/referidos/app/comisiones", label: "Comisiones", icon: Wallet },
  { href: "/referidos/app/recursos", label: "Recursos", icon: BookOpen },
  { href: "/referidos/app/perfil", label: "Perfil", icon: UserRound },
];

export function ReferrerShell({
  referrer,
  email,
  setupPending,
  children,
}: {
  referrer: Referrer | null;
  email: string;
  setupPending?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/referidos");
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 p-3">
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
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] no-underline transition-colors",
              active
                ? "bg-ink text-canvas"
                : "text-mute hover:bg-wash hover:text-ink"
            )}
          >
            <item.icon className="size-4 shrink-0" strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto space-y-0.5 border-t border-line pt-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-mute no-underline hover:bg-wash hover:text-ink"
        >
          <ExternalLink className="size-3.5" strokeWidth={1.8} />
          Sitio ProgramBI
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-mute hover:bg-wash hover:text-ink"
        >
          <LogOut className="size-3.5" strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <aside className="hidden w-[232px] shrink-0 flex-col border-r border-line bg-paper md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-line px-4">
          <Link href="/referidos/app" className="flex items-center gap-2 no-underline">
            <Image
              src="/images/logo.png"
              alt="ProgramBI"
              width={108}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </Link>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
            Referidos
          </span>
        </div>
        {nav}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper px-4">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink hover:bg-wash md:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-ink">
              {referrer ? referrer.name : "Panel de referidos"}
            </p>
            <p className="hidden truncate text-[11px] text-faint sm:block">{email}</p>
          </div>
          {referrer && referrer.status !== "active" ? (
            <span className="hidden rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-mute sm:inline">
              {REFERRER_STATUS_LABELS[referrer.status]}
            </span>
          ) : null}
          {referrer ? <CopyLinkButton code={referrer.referral_code} /> : null}
        </header>

        {open ? (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/30"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            />
            <div className="relative z-10 flex h-full w-72 flex-col bg-paper shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-line px-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Referidos
                </span>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-wash"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </button>
              </div>
              {nav}
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto">
          {setupPending ? (
            <div className="border-b border-line bg-paper px-4 py-3 text-sm text-mute sm:px-6">
              El panel se activa cuando ProgramBI deja lista la base de referidos.
              Si ya tienes cuenta, entra de nuevo en unos minutos.
            </div>
          ) : null}
          <div className="px-4 py-8 sm:px-6 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
