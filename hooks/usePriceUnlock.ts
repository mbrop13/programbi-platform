"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PRICE_UNLOCK_EVENT,
  getSavedLeadInfo,
  isPriceUnlockedClient,
  unlockPricesClient,
  type SavedLeadInfo,
} from "@/lib/pricing-gate";

export type UsePriceUnlock = {
  /** `true` solo después de hidratar y de leer la marca del navegador. */
  unlocked: boolean;
  /** `false` en SSR y en el primer render: el HTML nunca sale con precios. */
  hydrated: boolean;
  /** Desbloquea precios en toda la web y guarda los datos del lead. */
  unlock: (lead?: Partial<SavedLeadInfo> | null) => void;
  /** Contacto del último formulario enviado. */
  savedLead: SavedLeadInfo | null;
};

/**
 * Estado reactivo del gate de precios.
 *
 * Arranca en `false` a propósito: el servidor y el primer render del cliente
 * deben coincidir sin precios. Al montar lee `localStorage`/cookie y se
 * sincroniza con el evento `pb:price-unlocked` (misma pestaña) y con `storage`
 * (otras pestañas), de modo que un formulario enviado en la ficha desbloquea
 * también el catálogo, `/precios` y las landings sin recargar.
 */
export function usePriceUnlock(): UsePriceUnlock {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [savedLead, setSavedLead] = useState<SavedLeadInfo | null>(null);

  useEffect(() => {
    setUnlocked(isPriceUnlockedClient());
    setSavedLead(getSavedLeadInfo());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sync = () => {
      setUnlocked(isPriceUnlockedClient());
      setSavedLead(getSavedLeadInfo());
    };
    window.addEventListener(PRICE_UNLOCK_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PRICE_UNLOCK_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unlock = useCallback((lead?: Partial<SavedLeadInfo> | null) => {
    unlockPricesClient(lead);
    setUnlocked(true);
    setSavedLead(getSavedLeadInfo());
  }, []);

  return { unlocked, hydrated, unlock, savedLead };
}

/** Atajo booleano para tarjetas y tablas que solo necesitan saber si mostrar. */
export function usePricesUnlocked(): boolean {
  return usePriceUnlock().unlocked;
}
