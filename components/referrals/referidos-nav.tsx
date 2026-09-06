"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReferidosNav({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/referidos" className="flex items-center gap-2 no-underline">
          <Image
            src="/images/logo.png"
            alt="ProgramBI"
            width={120}
            height={28}
            className="h-7 w-auto object-contain dark:invert"
          />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            Referidos
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/empresas"
            className="hidden text-sm text-muted-foreground no-underline hover:text-foreground sm:inline"
          >
            Pack
          </Link>
          <Link
            href="/referidos/terminos"
            className="hidden text-sm text-muted-foreground no-underline hover:text-foreground md:inline"
          >
            Reglas
          </Link>
          <button
            type="button"
            aria-label="Cambiar tema"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </button>
          {!compact ? (
            <>
              <Link
                href="/referidos/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "no-underline")}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/referidos/registro"
                className={cn(buttonVariants({ size: "sm" }), "h-8 px-3 no-underline")}
              >
                Crear cuenta
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
