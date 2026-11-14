"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_COURSE_GROUPS } from "@/lib/data/course-nav";
import { getPais, ISO_CHILE } from "@/config/paises";
import { etiquetaBoton } from "@/config/textos";
import { usePaisRuta } from "@/lib/paises/cliente";
import { rutaLocal } from "@/lib/paises/rutas";
import { COMUNIDAD_PUBLICA } from "@/lib/comunidad/visibilidad";
import { whatsappHref } from "@/lib/whatsapp";
const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/programbi_capacitaciones/" },
  { name: "LinkedIn", href: "https://cl.linkedin.com/company/programbi" },
  { name: "YouTube", href: "https://www.youtube.com/@ProgramBi" },
  { name: "TikTok", href: "https://www.tiktok.com/@programbi" },
];

const companyLinks = [
  { label: "Ver Cursos", href: "/cursos" },
  { label: "Precios", href: "/precios" },
  { label: "Referidos", href: "/referidos" },
  // Una sola entrada a la bolsa: antes el pie repartía /empleos en cuatro
  // anchors (publicar, talento, vacantes) y diluía el enlazado interno.
  { label: "Bolsa de trabajo", href: "/empleos" },
  ...(COMUNIDAD_PUBLICA ? [{ label: "Comunidad", href: "/comunidad" }] : []),
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  // Páginas de apoyo: FAQ corta, glosario y comparativas. No repiten las URLs
  // que ya están arriba; el texto del enlace dice qué hay en cada una.
  { label: "FAQ de cursos y pagos", href: "/faq" },
  { label: "Casos y testimonios de alumnos", href: "/casos" },
  { label: "Glosario de datos", href: "/glosario" },
  { label: "Comparativas de herramientas", href: "/versus" },
  { label: "Registrarse", href: "/?auth=register" },
];

/** Países con hub indexable publicado (/guias o /{pais}/guias). */
const GUIAS_POR_PAIS = new Set([
  "cl",
  "mx",
  "ar",
  "pe",
  "co",
  "uy",
  "bo",
  "cr",
  "do",
  "ec",
  "gt",
  "sv",
  "ve",
]);

/**
 * Fichas que el pie enlaza primero y con anchor descriptivo ("Curso de…").
 * /cursos/power-bi y /cursos/analisis-de-datos reciben 58 enlaces internos
 * frente a 359 de /terminos: estos anchors concentran autoridad en las dos
 * páginas que compiten por «curso power bi» y «curso de análisis de datos».
 */
const CURSOS_PRIORITARIOS = [
  { label: "Curso de Power BI", href: "/cursos/power-bi" },
  { label: "Curso de análisis de datos", href: "/cursos/analisis-de-datos" },
] as const;

const CURSOS_PRIORITARIOS_SLUGS = new Set(["power-bi", "analisis-de-datos"]);

export default function Footer({ compact: _compact = false }: { compact?: boolean }) {
  const pais = usePaisRuta();
  const pathname = usePathname();
  const hrefLocal = (href: string) => rutaLocal(pais, href);
  const topCourses = NAV_COURSE_GROUPS.flatMap((g) => g.items).slice(0, 6);

  // El brochure se muestra como visor de documento a pantalla completa: sin footer.
  const isBrochure = pathname?.endsWith("/brochure") ?? false;
  if (isBrochure) return null;

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
          {pais !== ISO_CHILE && getPais(pais).contacto.ciudad ? (
            <p className="mt-2 text-sm text-mute">{getPais(pais).contacto.ciudad}</p>
          ) : null}
        </div>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Sitio">
          {companyLinks.map((item) => (
            <Link key={item.href} href={hrefLocal(item.href)} className="no-underline hover:text-mute">
              {item.label === "Registrarse" ? etiquetaBoton(pais, item.label) : item.label}
            </Link>
          ))}
          {GUIAS_POR_PAIS.has(pais) ? (
            <Link
              href={pais === ISO_CHILE ? "/guias" : `/${pais}/guias`}
              className="no-underline hover:text-mute"
            >
              Guías prácticas
            </Link>
          ) : null}
        </nav>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Cursos">
          {CURSOS_PRIORITARIOS.map((item) => (
            <Link key={item.href} href={hrefLocal(item.href)} className="no-underline hover:text-mute">
              {item.label}
            </Link>
          ))}
          {topCourses
            .filter((course) => !CURSOS_PRIORITARIOS_SLUGS.has(course.slug))
            .map((course) => (
              <Link
                key={course.slug}
                href={hrefLocal(`/cursos/${course.slug}`)}
                className="no-underline hover:text-mute"
              >
                {course.title}
              </Link>
            ))}
          <Link href={hrefLocal("/cursos/machine-learning")} className="no-underline hover:text-mute">
            Machine Learning
          </Link>
          <Link href={hrefLocal("/cursos/mercado-financiero")} className="no-underline hover:text-mute">
            Mercado financiero
          </Link>
          <Link href={hrefLocal("/empresas")} className="no-underline hover:text-mute">
            Power BI para empresas
          </Link>
        </nav>

        <div className="flex flex-col gap-3 text-sm text-mute">
          {socialLinks.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.name}
            </a>
          ))}
          <a href="mailto:contacto@programbi.cl">contacto@programbi.cl</a>
          <a href={whatsappHref({ page: "/", country: pais, intent: "general" })} target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
