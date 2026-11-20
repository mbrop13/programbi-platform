"use client";

import { usePathname } from "next/navigation";
import styles from "./DatosRootShell.module.css";

const DATOS_LINKS = [
  { href: "/datos", label: "Resumen", exact: true },
  { href: "/datos/carreras", label: "Carreras", exact: false },
  { href: "/datos/inflacion", label: "Inflación", exact: false },
  { href: "/datos/desempleo", label: "Desempleo", exact: false },
  { href: "/datos/capacitacion", label: "Capacitación", exact: false },
] as const;

export function DatosNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname() ?? "";

  return (
    <>
      {DATOS_LINKS.map(({ href, label, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <a
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={
              mobile
                ? active
                  ? styles.mobileLinkActive
                  : styles.mobileLink
                : active
                  ? styles.navLinkActive
                  : styles.navLink
            }
          >
            {label}
          </a>
        );
      })}
    </>
  );
}
