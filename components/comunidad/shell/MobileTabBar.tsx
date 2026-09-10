"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAMPUS_MORE_LINKS, MOBILE_TAB_ITEMS, isCampusNavActive, type CampusNavItem } from "./nav";

export function MobileTabBar({
  pathname,
  hasActiveLive,
  isOrgManager,
}: {
  pathname: string;
  hasActiveLive: boolean;
  isOrgManager: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive =
    moreOpen ||
    CAMPUS_MORE_LINKS.some((item) => !item.orgOnly && isCampusNavActive(pathname, item.href)) ||
    (isOrgManager && pathname.startsWith("/comunidad/business"));

  const moreItems = CAMPUS_MORE_LINKS.filter((item) => !item.orgOnly || isOrgManager);

  return (
    <>
      {moreOpen ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <button className="absolute inset-0 bg-black/20" aria-label="Cerrar" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-16 left-3 right-3 rounded-xl border border-border bg-surface shadow-xl p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">Más</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>
            {moreItems.map((item) => (
              <MoreLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClick={() => setMoreOpen(false)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-14 border-t border-border bg-surface/95 flex items-stretch">
        {MOBILE_TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isCampusNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] relative",
                active ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <Icon className="size-4" />
                {item.pingKey === "live" && hasActiveLive ? (
                  <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-rose-500" />
                ) : null}
              </span>
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] bg-transparent border-0 cursor-pointer",
            moreActive ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          <MoreHorizontal className="size-4" />
          Más
        </button>
      </nav>
    </>
  );
}

function MoreLink({
  item,
  pathname,
  onClick,
}: {
  item: CampusNavItem;
  pathname: string;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const active = isCampusNavActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 h-10 text-sm",
        active ? "bg-foreground text-background font-medium" : "text-foreground hover:bg-muted"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  );
}
