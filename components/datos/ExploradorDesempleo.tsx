"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ExploradorDesempleo.module.css";

const Graficos = dynamic(() => import("./ExploradorGraficos"), {
  ssr: false,
  loading: () => (
    <div className={styles.skeleton} role="status">
      Cargando explorador…
    </div>
  ),
});

export function ExploradorDesempleo({
  territorio,
  nombre,
  version,
  children,
}: {
  territorio: string;
  nombre: string;
  version: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className={styles.explorador}
      ref={ref}
      aria-label="Exploración histórica de desempleo"
      data-revision={version}
    >
      <span id="comparar-regiones" />
      <div className={styles.interactive}>
        {visible ? (
          <Graficos territorio={territorio} nombre={nombre} version={version} />
        ) : (
          <div className={styles.skeleton} aria-hidden="true" />
        )}
      </div>
      <details className={styles.tableDetails}>
        <summary>Ver tabla de datos histórica</summary>
        {children}
      </details>
    </section>
  );
}
