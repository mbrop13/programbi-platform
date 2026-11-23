/* eslint-disable @next/next/no-html-link-for-pages -- La navegación estática conserva el consumo inicial del encabezado. */
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { DatosNavLinks } from "./DatosNavLinks";
import { DatosMobileSheet } from "./DatosMobileSheet";
import { DatosToaster } from "./DatosToaster";
import styles from "./DatosRootShell.module.css";

// Figtree: texto y UI. Redondeada y muy legible en tamaños chicos (tablas, filtros).
const figtree = Figtree({
  variable: "--font-datos-sans",
  subsets: ["latin"],
  display: "swap",
});

// Bricolage Grotesque: titulares y cifras grandes. Tono cercano, menos institucional.
const bricolage = Bricolage_Grotesque({
  variable: "--font-datos-display",
  subsets: ["latin"],
  display: "swap",
});

const FOOTER_DATOS_LINKS = [
  { href: "/datos", label: "Resumen de Datos" },
  { href: "/datos/carreras", label: "Carreras y sueldos" },
  { href: "/datos/inflacion", label: "Calculadora de inflación (IPC)" },
  { href: "/datos/desempleo", label: "Desempleo en Chile" },
  { href: "/datos/capacitacion", label: "Capacitación SENCE" },
];

const FOOTER_HERRAMIENTAS = [
  { href: "/datos/carreras/comparar", label: "Comparar carreras" },
  { href: "/datos/carreras/test", label: "Test por prioridades" },
  { href: "/datos/carreras/retorno", label: "Calculadora de retorno" },
  { href: "/datos/carreras/puntaje-ponderado", label: "Puntaje ponderado PAES" },
];

export function DatosRootShell({
  children,
  analytics,
}: {
  children: ReactNode;
  analytics?: ReactNode;
}) {
  return (
    <html lang="es-CL" className={`${figtree.variable} ${bricolage.variable}`}>
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
              <a href="/datos" className={styles.sectionTag}>
                Datos de Chile
              </a>
            </div>

            <nav className={styles.desktopNav} aria-label="Datos de Chile">
              <DatosNavLinks />
            </nav>

            <div className={styles.actions}>
              <a className={styles.subtleLink} href="/cursos">
                Cursos
              </a>
              <a className={styles.account} href="/login">
                Iniciar sesión
              </a>
            </div>

            <div className={styles.mobileMenu}>
              <DatosMobileSheet />
            </div>
          </div>
        </header>

        <main id="contenido-principal" tabIndex={-1} className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <p className={styles.footerLema}>
                Cifras oficiales de Chile, <mark>explicadas en simple</mark>.
              </p>
              <p>
                Observatorio abierto y gratuito de ProgramBI con datos del INE, Mineduc (mifuturo.cl)
                y SENCE. Sin registro, listo para comparar o descargar.
              </p>
              <a href="/" aria-label="ProgramBI, inicio" className={styles.footerLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-nav.webp"
                  alt="ProgramBI"
                  width="136"
                  height="35"
                  loading="lazy"
                />
              </a>
            </div>
            <nav aria-label="Explorar datos">
              <strong>Datos de Chile</strong>
              {FOOTER_DATOS_LINKS.map(({ href, label }) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
            <nav aria-label="Herramientas de carreras">
              <strong>Herramientas</strong>
              {FOOTER_HERRAMIENTAS.map(({ href, label }) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
            <nav aria-label="Sitio ProgramBI">
              <strong>ProgramBI</strong>
              <a href="/">Inicio</a>
              <a href="/cursos">Cursos en vivo</a>
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
