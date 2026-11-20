/* eslint-disable @next/next/no-html-link-for-pages -- La navegación estática conserva el consumo inicial del encabezado. */
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { DatosNavLinks } from "./DatosNavLinks";
import { DatosMobileSheet } from "./DatosMobileSheet";
import { DatosToaster } from "./DatosToaster";
import styles from "./DatosRootShell.module.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Enlaces principales del sitio: réplica visual de components/shared/Navbar.tsx
   (referencia de solo lectura; el Navbar cliente no se importa). */
const SITIO_LINKS = [
  { href: "/cursos", label: "Ver Cursos" },
  { href: "/precios", label: "Precios" },
  { href: "/plantillas", label: "Recursos" },
];

const FOOTER_DATOS_LINKS = [
  { href: "/datos", label: "Resumen de Datos" },
  { href: "/datos/carreras", label: "Carreras y sueldos" },
  { href: "/datos/inflacion", label: "Calculadora de inflación (IPC)" },
  { href: "/datos/desempleo", label: "Desempleo en Chile" },
  { href: "/datos/capacitacion", label: "Capacitación SENCE" },
];

export function DatosRootShell({
  children,
  analytics,
}: {
  children: ReactNode;
  analytics?: ReactNode;
}) {
  return (
    <html lang="es-CL" className={`${geist.variable} ${geistMono.variable}`}>
      <body className={styles.body}>
        <a className={styles.skip} href="#contenido-principal">
          Saltar al contenido
        </a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brandGroup}>
              <a href="/" className={styles.logo} aria-label="ProgramBI, inicio">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-nav.webp" alt="ProgramBI" width="136" height="35" />
              </a>
              <span className={styles.divider} aria-hidden="true" />
              <a href="/datos" className={styles.sectionTag}>
                Datos de Chile
              </a>
            </div>

            <nav className={styles.desktopNav} aria-label="Principal">
              {SITIO_LINKS.map(({ href, label }) => (
                <a key={href} className={styles.siteLink} href={href}>
                  {label}
                </a>
              ))}
            </nav>

            <div className={styles.actions}>
              <a className={styles.account} href="/login">
                Iniciar sesión
              </a>
            </div>

            <div className={styles.mobileMenu}>
              <DatosMobileSheet />
            </div>
          </div>
        </header>

        {/* Subnav sticky de /datos: las 5 secciones viven aquí, no en el header.
            DatosNavLinks marca la activa con usePathname. */}
        <nav className={styles.subnav} aria-label="Datos de Chile">
          <div className={styles.subnavInner}>
            <DatosNavLinks />
          </div>
        </nav>

        <main id="contenido-principal" tabIndex={-1} className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <a href="/" aria-label="ProgramBI, inicio">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-nav.webp"
                  alt="ProgramBI"
                  width="136"
                  height="35"
                  loading="lazy"
                />
              </a>
              <p>
                Observatorio abierto de datos públicos de Chile desarrollado por ProgramBI.
                Cifras oficiales explicadas en simple para estudiar, trabajar y tomar mejores
                decisiones.
              </p>
            </div>
            <nav aria-label="Explorar datos">
              <strong>Datos de Chile</strong>
              {FOOTER_DATOS_LINKS.map(({ href, label }) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
            <nav aria-label="Sitio ProgramBI">
              <strong>ProgramBI</strong>
              <a href="/">Inicio</a>
              <a href="/cursos">Cursos en vivo</a>
              <a href="/clase-gratis">Clase gratis</a>
              <a href="/login">Iniciar sesión</a>
              <a href="/privacidad">Privacidad</a>
            </nav>
          </div>
        </footer>

        <DatosToaster />
        {analytics}
      </body>
    </html>
  );
}
