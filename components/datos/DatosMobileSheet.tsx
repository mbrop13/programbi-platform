"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { href: "/datos/carreras", label: "Carreras y sueldos", exact: true },
  { href: "/datos/inflacion", label: "Inflación (IPC)", exact: false },
  { href: "/datos/desempleo", label: "Desempleo", exact: false },
  { href: "/datos/capacitacion", label: "Capacitación SENCE", exact: false },
] as const;

const MOBILE_HERRAMIENTAS = [
  { href: "/datos/carreras/comparar", label: "Comparar carreras" },
  { href: "/datos/carreras/test", label: "Test por prioridades" },
  { href: "/datos/carreras/retorno", label: "Calculadora de retorno" },
  { href: "/datos/carreras/puntaje-ponderado", label: "Puntaje ponderado PAES" },
] as const;

const enlaceBase =
  "flex min-h-11 items-center rounded-xl px-3 text-[15px] transition-colors";

export function DatosMobileSheet() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  const esActivo = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label="Abrir menú de navegación"
            className="h-11 gap-2 rounded-xl border-[#d1d3d8] bg-white px-3.5 text-[15px] font-semibold text-[#111214] hover:bg-[#eceef1]"
          />
        }
      >
        <Menu className="size-4" aria-hidden="true" />
        <span>Menú</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[310px] border-l border-[#e4e5e8] bg-[#f7f7f8] p-0 text-[#111214] sm:max-w-[330px]"
      >
        <SheetHeader className="border-b border-[#e4e5e8] px-5 py-4 text-left">
          <SheetTitle className="font-display text-lg font-bold text-[#111214]">
            Datos de Chile
          </SheetTitle>
          <SheetDescription className="text-sm text-[#4b5058]">
            Cifras oficiales, explicadas en simple
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Navegación móvil" className="flex flex-col gap-0.5 px-3 py-3">
          {MOBILE_DATOS_LINKS.map(({ href, label, exact }) => {
            const active = esActivo(href, exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  enlaceBase,
                  active
                    ? "bg-[#111214] font-semibold text-white"
                    : "font-medium text-[#2b2d31] hover:bg-[#eceef1]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e4e5e8] px-3 py-3">
          <p className="px-3 pb-1 text-sm font-semibold text-[#4b5058]">Herramientas</p>
          {MOBILE_HERRAMIENTAS.map(({ href, label }) => {
            const active = esActivo(href, false);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  enlaceBase,
                  active
                    ? "bg-[#111214] font-semibold text-white"
                    : "font-medium text-[#2b2d31] hover:bg-[#eceef1]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-1 border-t border-[#e4e5e8] px-3 py-3">
          <Link
            href="/cursos"
            onClick={() => setOpen(false)}
            className={cn(enlaceBase, "font-medium text-[#2b2d31] hover:bg-[#eceef1]")}
          >
            Cursos en vivo
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#111214] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#2b2d31]"
          >
            Iniciar sesión
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
