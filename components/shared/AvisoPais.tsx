"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPais } from "@/config/paises";
import { cambiarPais, esRutaComercial, paisDesdeRuta } from "@/lib/paises/rutas";
import { ISO_CHILE } from "@/config/paises";

const DISMISS_KEY = "pb_pais_aviso";

/**
 * Aviso discreto. No redirige. En local no hay x-vercel-ip-country, así que no aparece.
 */
export default function AvisoPais() {
  const pathname = usePathname() || "/";
  const [sugerido, setSugerido] = useState<string | null>(null);

  useEffect(() => {
    if (!esRutaComercial(pathname)) return;
    let cancelado = false;
    const actual = paisDesdeRuta(pathname) ?? ISO_CHILE;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === actual) return;
    } catch {
      /* ignore */
    }
    fetch("/api/pais-sugerido")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { iso?: string | null } | null) => {
        if (cancelado) return;
        const iso = data?.iso;
        if (!iso || iso === actual) return;
        setSugerido(iso);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [pathname]);

  if (!sugerido) return null;
  const pais = getPais(sugerido);
  const actual = paisDesdeRuta(pathname) ?? ISO_CHILE;

  return (
    <p className="border-b border-line bg-wash px-4 py-2 text-center text-xs text-mute">
      Hay una versión para {pais.nombre}.{" "}
      <Link href={cambiarPais(pathname, sugerido)} className="font-semibold text-ink no-underline">
        Ver {pais.nombre}
      </Link>
      <button
        type="button"
        className="ml-3 underline"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, actual);
          } catch {
            /* ignore */
          }
          setSugerido(null);
        }}
      >
        Cerrar
      </button>
    </p>
  );
}
