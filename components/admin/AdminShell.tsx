"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV, adminTitleFromPath, type AdminBadgeKey } from "./nav";

type Badges = Record<AdminBadgeKey, number>;

const EMPTY_BADGES: Badges = { support: 0, members: 0, leads: 0, asesorias: 0 };

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>(EMPTY_BADGES);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function checkUnreads() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: views } = await supabase.from("admin_views").select("*").eq("admin_id", user.id).single();
        const supportLast = views?.support_last_viewed_at || "1970-01-01T00:00:00.000Z";
        const membersLast = views?.members_last_viewed_at || "1970-01-01T00:00:00.000Z";
        const leadsLastStr = localStorage.getItem("admin_leads_last_viewed") || "1970-01-01T00:00:00.000Z";
        const leadsLast =
          views?.leads_last_viewed_at && views.leads_last_viewed_at !== "1970-01-01T00:00:00.000Z"
            ? views.leads_last_viewed_at
            : leadsLastStr;
        const asesoriaLastStr = localStorage.getItem("admin_asesoria_last_viewed") || "1970-01-01T00:00:00.000Z";

        const [
          { count: supportCount },
          { count: membersCount },
          { count: leadsCount },
          { count: asesoriasCount },
        ] = await Promise.all([
          supabase.from("support_tickets").select("*", { count: "exact", head: true }).gt("created_at", supportLast),
          supabase.from("profiles").select("*", { count: "exact", head: true }).gt("created_at", membersLast),
          supabase
            .from("course_leads")
            .select("*", { count: "exact", head: true })
            .not("lead_type", "in", '("asesoria_schedule", "asesoria_b2b", "asesoria_b2c")')
            .gt("created_at", leadsLast),
          supabase
            .from("course_leads")
            .select("*", { count: "exact", head: true })
            .in("lead_type", ["asesoria_schedule", "asesoria_b2b", "asesoria_b2c"])
            .gt("created_at", asesoriaLastStr),
        ]);

        if (!cancelled) {
          setBadges({
            support: supportCount || 0,
            members: membersCount || 0,
            leads: leadsCount || 0,
            asesorias: asesoriasCount || 0,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    checkUnreads();
    window.addEventListener("adminViewsUpdated", checkUnreads);
    return () => {
      cancelled = true;
      window.removeEventListener("adminViewsUpdated", checkUnreads);
    };
  }, []);

  return (
    <div className="admin-app flex h-dvh overflow-hidden bg-bg text-foreground">
      <aside className="hidden lg:flex w-[232px] shrink-0 flex-col border-r border-border bg-bg">
        <SidebarBrand />
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <AdminNavList pathname={pathname} badges={badges} />
        </nav>
        <SidebarFooter />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/20"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[260px] flex flex-col bg-bg border-r border-border shadow-xl">
            <div className="flex items-center justify-between px-3 h-12 border-b border-border">
              <SidebarBrand compact />
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)} aria-label="Cerrar">
                <X />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <AdminNavList pathname={pathname} badges={badges} />
            </nav>
            <SidebarFooter />
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
          <div className="text-sm font-medium text-foreground truncate">{adminTitleFromPath(pathname)}</div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/comunidad/inicio"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Comunidad
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/admin" className={cn("flex items-center gap-2.5 px-4", compact ? "h-auto" : "h-12 border-b border-border")}>
      <Image src="/logo.png" alt="ProgramBI" width={22} height={22} className="rounded-sm" />
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-none tracking-tight">ProgramBI</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">Admin</div>
      </div>
    </Link>
  );
}

function SidebarFooter() {
  return (
    <div className="px-4 py-3 border-t border-border">
      <p className="text-[11px] text-muted-foreground">Panel interno</p>
    </div>
  );
}

function AdminNavList({ pathname, badges }: { pathname: string; badges: Badges }) {
  return (
    <div className="space-y-5">
      {ADMIN_NAV.map((group) => (
        <div key={group.label}>
          <div className="px-2 mb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {group.label}
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(item.href + "/");
              const count = item.badgeKey ? badges[item.badgeKey] : 0;
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
                  {count > 0 ? (
                    <span
                      className={cn(
                        "min-w-5 h-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center",
                        active ? "bg-background/20 text-background" : "bg-foreground text-background"
                      )}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
