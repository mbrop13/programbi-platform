"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MOBILE_DATOS_LINKS = [
  { href: "/datos", label: "Resumen de Datos", exact: true },
  { href: "/datos/carreras", label: "Carreras y sueldos", exact: false },
  { href: "/datos/inflacion", label: "Inflación (IPC)", exact: false },
  { href: "/datos/desempleo", label: "Desempleo en Chile", exact: false },
  { href: "/datos/capacitacion", label: "Capacitación SENCE", exact: false },
  { href: "/datos/carreras/comparar", label: "Comparar carreras", exact: false },
  { href: "/datos/carreras/test", label: "Test vocacional", exact: false },
] as const;

export function DatosMobileSheet() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label="Abrir menú de navegación"
            className="gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          />
        }
      >
        <Menu className="size-4" aria-hidden="true" />
        <span>Menú</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] border-l border-slate-200 bg-white p-0 text-slate-900 sm:max-w-[320px]"
      >
        <SheetHeader className="border-b border-slate-100 px-5 py-4 text-left">
          <SheetTitle className="text-sm font-semibold text-slate-900">
            Datos de Chile
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Observatorio abierto de ProgramBI
          </SheetDescription>
        </SheetHeader>

        <nav
          aria-label="Navegación móvil"
          className="flex flex-col gap-1 px-3 py-4"
        >
          {MOBILE_DATOS_LINKS.map(({ href, label, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-slate-200" />

        <div className="flex flex-col gap-2 px-3 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Inicio de ProgramBI
          </Link>
          <Link
            href="/cursos"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Cursos en vivo
          </Link>
          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
