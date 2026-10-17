"use client";

import { usePathname, useRouter } from "next/navigation";
import { PAISES } from "@/config/paises";
import { cambiarPais, paisDesdeRuta } from "@/lib/paises/rutas";
import { ISO_CHILE } from "@/config/paises";

export default function SelectorPais({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const actual = paisDesdeRuta(pathname) ?? ISO_CHILE;

  return (
    <label className={`inline-flex items-center ${className}`}>
      <span className="sr-only">País</span>
      <select
        aria-label="País"
        value={actual}
        onChange={(event) => {
          const siguiente = event.target.value;
          if (siguiente === actual) return;
          router.push(cambiarPais(pathname, siguiente));
        }}
        className="h-9 max-w-[9.5rem] cursor-pointer rounded-full border border-line bg-paper px-2.5 text-[13px] font-medium text-ink outline-none"
      >
        {PAISES.map((pais) => (
          <option key={pais.iso} value={pais.iso}>
            {pais.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}
