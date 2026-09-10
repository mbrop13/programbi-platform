import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  BarChart3,
  Briefcase,
  Building,
  Calendar,
  CreditCard,
  Download,
  GraduationCap,
  Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Radio,
  Settings,
  Share2,
  ShoppingCart,
  Sparkles,
  Upload,
  Users,
  Video,
  DollarSign,
  Star,
} from "lucide-react";

export type AdminBadgeKey = "support" | "members" | "leads" | "asesorias";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: AdminBadgeKey;
  prefetch?: boolean;
  external?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Resumen",
    items: [
      { href: "/admin", label: "Estadísticas", icon: BarChart3, prefetch: true },
      { href: "/admin/asistencia", label: "Asistencia", icon: Activity },
      { href: "/admin/soporte", label: "Soporte", icon: MessageSquare, badgeKey: "support" },
    ],
  },
  {
    label: "Personas",
    items: [
      { href: "/admin/miembros", label: "Miembros", icon: Users, badgeKey: "members", prefetch: true },
      { href: "/admin/formularios", label: "Formularios", icon: Mail, badgeKey: "leads", prefetch: true },
      { href: "/admin/empresas", label: "Empresas", icon: Building },
      { href: "/admin/referidos", label: "Referidos", icon: Share2 },
    ],
  },
  {
    label: "Comercial",
    items: [
      { href: "/admin/precios", label: "Precios y promos", icon: DollarSign },
      { href: "/admin/carritos", label: "Carritos", icon: ShoppingCart },
      { href: "/admin/asesorias", label: "Asesorías", icon: Video, badgeKey: "asesorias" },
      { href: "/admin/empleos", label: "Bolsa de trabajo", icon: Briefcase },
    ],
  },
  {
    label: "Campus",
    items: [
      { href: "/admin/cursos", label: "Cursos", icon: GraduationCap },
      { href: "/admin/vivo", label: "Clases en vivo", icon: Radio },
      { href: "/admin/horarios", label: "Horarios", icon: Calendar },
      { href: "/admin/diplomas", label: "Diplomas", icon: Award },
      { href: "/admin/planes", label: "Planes", icon: CreditCard },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/popups", label: "Pop-ups", icon: Megaphone },
      { href: "/comunidad/admin/chatbot", label: "Chatbot IA", icon: Sparkles, external: true },
      { href: "/comunidad/admin/feedback", label: "Encuesta", icon: Star, external: true },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/exportar", label: "Exportar", icon: Download },
      { href: "/admin/importar", label: "Importar", icon: Upload },
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

export const ADMIN_TAB_REDIRECTS: Record<string, string> = {
  overview: "/admin",
  class_tracking: "/admin/asistencia",
  support: "/admin/soporte",
  companies: "/admin/empresas",
  empleos_admin: "/admin/empleos",
  members: "/admin/miembros",
  leads: "/admin/formularios",
  referidos: "/admin/referidos",
  chatbot: "/comunidad/admin/chatbot",
  prices: "/admin/precios",
  cart: "/admin/carritos",
  courses: "/admin/cursos",
  asesorias: "/admin/asesorias",
  live_admin: "/admin/vivo",
  schedules: "/admin/horarios",
  export_csv: "/admin/exportar",
  import: "/admin/importar",
  plans: "/admin/planes",
  popups: "/admin/popups",
  newsletter: "/admin/blog",
  diplomas: "/admin/diplomas",
  settings: "/admin/configuracion",
};

export function adminTitleFromPath(pathname: string): string {
  if (pathname === "/admin") return "Estadísticas";
  for (const group of ADMIN_NAV) {
    const item = group.items.find((i) => i.href === pathname);
    if (item) return item.label;
  }
  return "Admin";
}
