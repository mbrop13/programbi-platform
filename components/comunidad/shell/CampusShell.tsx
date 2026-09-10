"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getUnreadNotificationCount } from "@/lib/supabase/comunidad";
import { useCommunity } from "@/components/comunidad/CommunityProvider";
import {
  CAMPUS_NAV,
  campusTitleFromPath,
  isCampusNavActive,
  isLessonPlayerPath,
} from "./nav";
import { CampusSearch } from "./CampusSearch";
import { MobileTabBar } from "./MobileTabBar";

const NotificationCenter = dynamic(() => import("@/components/comunidad/NotificationCenter"), { ssr: false });
const SubscriptionModal = dynamic(() => import("@/components/comunidad/SubscriptionModal"), { ssr: false });

type CampusUi = {
  openUpgrade: () => void;
  openSearch: () => void;
};

const CampusUiContext = createContext<CampusUi>({
  openUpgrade: () => {},
  openSearch: () => {},
});

export function useCampusUi() {
  return useContext(CampusUiContext);
}

export function CampusShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/comunidad/inicio";
  const hideChrome = isLessonPlayerPath(pathname);
  const { isOrgManager, userProfile } = useCommunity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasActiveLive, setHasActiveLive] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    getUnreadNotificationCount().then(setUnread).catch(() => setUnread(0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const supabase = createClient();
        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const { data } = await supabase
          .from("live_classes")
          .select("id")
          .or(`status.eq.active,and(status.eq.scheduled,scheduled_at.lte.${oneHourFromNow})`)
          .limit(1);
        if (!cancelled) setHasActiveLive(!!data?.length);
      } catch {
        if (!cancelled) setHasActiveLive(false);
      }
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const ui: CampusUi = {
    openUpgrade: () => setUpgradeOpen(true),
    openSearch: () => setSearchOpen(true),
  };

  if (hideChrome) {
    return (
      <CampusUiContext.Provider value={ui}>
        <div className="h-dvh overflow-hidden bg-bg text-foreground flex flex-col">{children}</div>
        <SubscriptionModal
          isOpen={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlanId={userProfile?.subscription_plan}
        />
      </CampusUiContext.Provider>
    );
  }

  return (
    <CampusUiContext.Provider value={ui}>
      <div className="campus-app flex h-dvh overflow-hidden bg-bg text-foreground">
        <aside className="hidden lg:flex w-[232px] shrink-0 flex-col border-r border-border bg-bg">
          <SidebarBrand />
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full h-8 px-2 rounded-md border border-border bg-surface text-[13px] text-muted-foreground flex items-center gap-2 hover:bg-muted"
            >
              <Search className="size-3.5" />
              <span className="flex-1 text-left truncate">Buscar</span>
              <kbd className="text-[10px] text-muted-foreground">⌘K</kbd>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <CampusNavList pathname={pathname} isOrgManager={isOrgManager} hasActiveLive={hasActiveLive} />
          </nav>
          <UserChip
            name={userProfile?.full_name || userProfile?.email || ""}
            plan={userProfile?.subscription_plan}
            onUpgrade={() => setUpgradeOpen(true)}
          />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-black/20" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
            <aside className="relative h-full w-[260px] flex flex-col bg-bg border-r border-border shadow-xl">
              <div className="flex items-center justify-between px-3 h-12 border-b border-border">
                <SidebarBrand compact />
                <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)} aria-label="Cerrar">
                  <X />
                </Button>
              </div>
              <div className="px-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full h-8 px-2 rounded-md border border-border bg-surface text-[13px] text-muted-foreground flex items-center gap-2"
                >
                  <Search className="size-3.5" />
                  Buscar
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                <CampusNavList pathname={pathname} isOrgManager={isOrgManager} hasActiveLive={hasActiveLive} />
              </nav>
              <UserChip
                name={userProfile?.full_name || userProfile?.email || ""}
                plan={userProfile?.subscription_plan}
                onUpgrade={() => setUpgradeOpen(true)}
              />
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-12 shrink-0 border-b border-border bg-bg flex items-center gap-3 px-4">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu />
            </Button>
            <div className="text-sm font-medium text-foreground truncate">{campusTitleFromPath(pathname)}</div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen(true)} aria-label="Buscar" className="hidden sm:inline-flex">
                <Search />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon-sm" onClick={() => setNotifOpen((v) => !v)} aria-label="Notificaciones">
                  <Bell />
                </Button>
                {unread > 0 ? (
                  <span className="absolute top-1 right-1 size-1.5 rounded-full bg-foreground" />
                ) : null}
                <NotificationCenter
                  open={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  onUnreadChange={setUnread}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8">{children}</div>
          </main>
        </div>

        <MobileTabBar pathname={pathname} hasActiveLive={hasActiveLive} isOrgManager={isOrgManager} />
        <CampusSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        <SubscriptionModal
          isOpen={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlanId={userProfile?.subscription_plan}
        />
      </div>
    </CampusUiContext.Provider>
  );
}

function SidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/comunidad/inicio"
      className={cn("flex items-center gap-2.5 px-4", compact ? "h-auto" : "h-12 border-b border-border")}
    >
      <Image src="/logo.png" alt="ProgramBI" width={22} height={22} className="rounded-sm" />
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-none tracking-tight">ProgramBI</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">Campus</div>
      </div>
    </Link>
  );
}

function CampusNavList({
  pathname,
  isOrgManager,
  hasActiveLive,
}: {
  pathname: string;
  isOrgManager: boolean;
  hasActiveLive: boolean;
}) {
  return (
    <div className="space-y-5">
      {CAMPUS_NAV.map((group) => {
        const items = group.items.filter((item) => !item.orgOnly || isOrgManager);
        if (items.length === 0) return null;
        return (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isCampusNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={item.prefetch ?? false}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 h-8 text-[13px] transition-colors",
                      active
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.pingKey === "live" && hasActiveLive ? (
                      <span className={cn("size-1.5 rounded-full bg-rose-500", active && "bg-background")} />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UserChip({
  name,
  plan,
  onUpgrade,
}: {
  name: string;
  plan?: string | null;
  onUpgrade: () => void;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    window.location.replace("/");
  };

  return (
    <div className="px-3 py-3 border-t border-border space-y-1">
      <Link
        href="/comunidad/ajustes"
        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted"
      >
        <span className="size-7 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center shrink-0">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-medium truncate leading-tight">{name || "Cuenta"}</span>
          <span className="block text-[11px] text-muted-foreground truncate">{plan || "Sin plan"}</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={onUpgrade}
        className="w-full flex items-center gap-2 rounded-md px-2 h-8 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent border-0 cursor-pointer"
      >
        Actualizar plan
      </button>
      <button
        type="button"
        onClick={() => {
          void logout();
        }}
        className="w-full flex items-center gap-2 rounded-md px-2 h-8 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent border-0 cursor-pointer"
      >
        <LogOut className="size-3.5" />
        Cerrar sesión
      </button>
    </div>
  );
}
