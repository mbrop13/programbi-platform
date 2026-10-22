"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_COURSE_GROUPS } from "@/lib/data/course-nav";
import { getPais, ISO_CHILE } from "@/config/paises";
import { etiquetaBoton } from "@/config/textos";
import { usePaisRuta } from "@/lib/paises/cliente";
import { rutaLocal } from "@/lib/paises/rutas";
import { COMUNIDAD_PUBLICA } from "@/lib/comunidad/visibilidad";
const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/programbi_capacitaciones/" },
  { name: "LinkedIn", href: "https://cl.linkedin.com/company/programbi" },
  { name: "YouTube", href: "https://www.youtube.com/@ProgramBi" },
  { name: "TikTok", href: "https://www.tiktok.com/@programbi" },
];

const companyLinks = [
  { label: "Ver Cursos", href: "/cursos" },
  { label: "Empresas", href: "/empresas" },
  { label: "Referidos", href: "/referidos" },
  { label: "Bolsa de Trabajo", href: "/empleos" },
  ...(COMUNIDAD_PUBLICA ? [{ label: "Comunidad", href: "/comunidad" }] : []),
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/#faq" },
  { label: "Registrarse", href: "/?auth=register" },
];

export default function Footer({ compact: _compact = false }: { compact?: boolean }) {
  const pais = usePaisRuta();
  const hrefLocal = (href: string) => rutaLocal(pais, href);
  const topCourses = NAV_COURSE_GROUPS.flatMap((g) => g.items).slice(0, 6);

  return (
    <footer className="border-t border-line bg-paper px-4 py-12 sm:px-6 lg:px-8" aria-label="Pie de página">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href={hrefLocal("/")} className="relative block h-8 w-[148px]" aria-label="ProgramBI">
            <Image
              src="/images/logo-nav.webp"
              alt="ProgramBI"
              width={148}
              height={32}
              unoptimized
              className="h-8 w-[148px] object-contain object-left"
            />
          </Link>
          <p className="mt-4 max-w-[28rem] text-sm leading-relaxed text-mute">
            {pais === ISO_CHILE
              ? "Centro de capacitaciones en análisis de datos. Santiago, Chile."
              : "Centro de capacitaciones en análisis de datos."}
          </p>
          {pais !== ISO_CHILE && !getPais(pais).contacto.ciudad.startsWith("[PENDIENTE") ? (
            <p className="mt-2 text-sm text-mute">{getPais(pais).contacto.ciudad}</p>
          ) : null}
        </div>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Sitio">
          {companyLinks.map((item) => (
            <Link key={item.href} href={hrefLocal(item.href)} className="no-underline hover:text-mute">
              {item.label === "Registrarse" ? etiquetaBoton(pais, item.label) : item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Cursos">
          {topCourses.map((course) => (
            <Link key={course.slug} href={hrefLocal(`/cursos/${course.slug}`)} className="no-underline hover:text-mute">
              {course.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-mute">
          {socialLinks.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.name}
            </a>
          ))}
          <a href="mailto:contacto@programbi.cl">contacto@programbi.cl</a>
          <a href="https://wa.me/56935409699">WhatsApp</a>
          <Link href="/privacidad" className="no-underline">
            Privacidad
          </Link>
          <Link href="/terminos" className="no-underline">
            Términos
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1400px] text-xs text-faint">
        ProgramBI SPA · {pais === ISO_CHILE ? "Chile" : getPais(pais).nombre}
      </p>
    </footer>
  );
}
