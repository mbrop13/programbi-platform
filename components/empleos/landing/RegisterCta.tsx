"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * CTA de registro de la bolsa: abre el AuthModal (popup) sin navegar,
 * y tras autenticarse lleva al "paso 2" (perfil laboral). Si el usuario
 * ya tiene sesión, va directo a completar sus datos.
 */
export default function RegisterCta({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  const destinoPasoDos = "/comunidad/empleos";
  // EmpleosTab lee esta clave para abrir directo la sección "Mi perfil laboral"
  const marcarPerfil = () => {
    try {
      sessionStorage.setItem("empleos-section", "perfil");
    } catch {
      /* sessionStorage no disponible */
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick?.();

    let tieneSesion = false;
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      tieneSesion = !!session?.user;
    } catch {
      /* sin sesión */
    }

    if (tieneSesion) {
      // Ya registrado: directo al paso 2 (completar perfil laboral)
      marcarPerfil();
      router.push(destinoPasoDos);
      return;
    }

    // Sin sesión: popup de registro aquí mismo; al terminar, paso 2
    marcarPerfil();
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: { tab: "register", redirectUrl: destinoPasoDos },
      })
    );
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
