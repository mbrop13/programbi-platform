/* eslint-disable @next/next/no-html-link-for-pages -- La navegación estática conserva el consumo inicial del encabezado. */
import type { ReactNode } from "react";
import styles from "./DatosRootShell.module.css";

const datosLinks = [
  { href: "/datos", label: "Datos de Chile" },
  { href: "/datos/desempleo", label: "Desempleo" },
  { href: "/datos/carreras", label: "Carreras" },
  { href: "/datos/capacitacion", label: "Capacitación" },
  { href: "/datos/inflacion", label: "Inflación" },
];

function EnlacesDatos() {
  return datosLinks.map(({ href, label }) => <a key={href} href={href}>{label}</a>);
}

export function DatosRootShell({ children, analytics }: { children: ReactNode; analytics?: ReactNode }) {
  return (
    <html lang="es-CL">
      <body className={styles.body}>
        <a className={styles.skip} href="#contenido-principal">Saltar al contenido</a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <a href="/" className={styles.logo} aria-label="ProgramBI, inicio">
              {/* Local asset avoids delaying the first paint on an image optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-nav.webp" alt="ProgramBI" width="150" height="39" />
            </a>
            <nav className={styles.desktopNav} aria-label="Datos de Chile"><EnlacesDatos /></nav>
            <a className={styles.account} href="/login">Iniciar sesión</a>
            <details className={styles.mobileMenu}>
              <summary>Menú <span aria-hidden="true">☰</span></summary>
              <nav aria-label="Navegación móvil">
                <EnlacesDatos />
                <a href="/">Inicio de ProgramBI</a>
                <a href="/cursos">Cursos</a>
                <a href="/login">Iniciar sesión</a>
              </nav>
            </details>
          </div>
        </header>
        <main id="contenido-principal" tabIndex={-1}>{children}</main>
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <a href="/" aria-label="ProgramBI, inicio">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-nav.webp" alt="ProgramBI" width="148" height="38" loading="lazy" />
              </a>
              <p>Centro de capacitaciones en análisis de datos. Santiago, Chile.</p>
            </div>
            <nav aria-label="Explorar datos"><strong>Datos de Chile</strong><EnlacesDatos /></nav>
            <nav aria-label="Sitio ProgramBI"><strong>ProgramBI</strong><a href="/">Inicio</a><a href="/cursos">Cursos</a><a href="/login">Iniciar sesión</a><a href="/privacidad">Privacidad</a></nav>
          </div>
        </footer>
        {analytics}
      </body>
    </html>
  );
}
