import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  Building2,
  GraduationCap,
  LayoutDashboard,
  Radio,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";

export type CampusNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  prefetch?: boolean;
  external?: boolean;
  pingKey?: "live";
  orgOnly?: boolean;
};

export type CampusNavGroup = {
  label: string;
  items: CampusNavItem[];
};

export const CAMPUS_NAV: CampusNavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/comunidad/inicio", label: "Inicio", icon: LayoutDashboard, prefetch: true },
      { href: "/comunidad/cursos", label: "Cursos", icon: GraduationCap, prefetch: true },
      { href: "/comunidad/live", label: "En Vivo", icon: Radio, pingKey: "live" },
      { href: "/ai", label: "Mentor IA", icon: Sparkles, external: true },
      { href: "/comunidad/practicar", label: "Practica", icon: Target },
    ],
  },
  {
    label: "Personal",
    items: [
      { href: "/comunidad/certificados", label: "Certificados", icon: Award },
      { href: "/comunidad/empleos", label: "Empleos", icon: Briefcase },
    ],
  },
  {
    label: "Gestión",
    items: [{ href: "/comunidad/business", label: "Empresa", icon: Building2, orgOnly: true }],
  },
];

export const CAMPUS_MORE_LINKS: CampusNavItem[] = [
  { href: "/comunidad/empleos", label: "Empleos", icon: Briefcase },
  { href: "/comunidad/certificados", label: "Certificados", icon: Award },
  { href: "/ai", label: "Mentor IA", icon: Sparkles, external: true },
  { href: "/comunidad/ajustes", label: "Ajustes", icon: Settings },
  { href: "/comunidad/business", label: "Empresa", icon: Building2, orgOnly: true },
];

export const MOBILE_TAB_ITEMS: CampusNavItem[] = [
  { href: "/comunidad/inicio", label: "Inicio", icon: LayoutDashboard },
  { href: "/comunidad/cursos", label: "Cursos", icon: GraduationCap },
  { href: "/comunidad/live", label: "Live", icon: Radio, pingKey: "live" },
  { href: "/comunidad/practicar", label: "Practica", icon: Target },
];

export function isLessonPlayerPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "comunidad" && parts[1] === "cursos" && parts.length >= 4;
}

export function campusTitleFromPath(pathname: string): string {
  if (pathname.startsWith("/comunidad/cursos/") && pathname !== "/comunidad/cursos") {
    return "Curso";
  }
  if (pathname.startsWith("/comunidad/ajustes")) return "Ajustes";
  for (const group of CAMPUS_NAV) {
    const item = group.items.find(
      (i) => pathname === i.href || (i.href !== "/comunidad/inicio" && pathname.startsWith(i.href + "/"))
    );
    if (item) return item.label;
  }
  if (pathname.startsWith("/comunidad/inicio")) return "Inicio";
  return "Comunidad";
}

export function isCampusNavActive(pathname: string, href: string): boolean {
  if (href === "/comunidad/inicio") {
    return pathname === "/comunidad/inicio" || pathname === "/comunidad/inicio/";
  }
  if (href === "/comunidad/cursos") {
    return pathname === "/comunidad/cursos" || pathname.startsWith("/comunidad/cursos/");
  }
  if (href === "/ai") {
    return pathname === "/ai" || pathname.startsWith("/ai/");
  }
  return pathname === href || pathname.startsWith(href + "/");
}
