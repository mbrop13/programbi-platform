"use client";

import { GuiaTocNav, type GuiaTocItem } from "@/components/guias/GuiaEditorialPrimitives";
import type { ItemIndice } from "@/components/guias/indice";

type Props = { items: ItemIndice[]; sticky?: boolean };

function mapTocItems(items: ItemIndice[]): GuiaTocItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.texto,
    level: item.nivel,
  }));
}

/** Versión escritorio: columna fija que acompaña la lectura. */
export function IndiceGuiaNav({ items, sticky = true }: Props) {
  if (items.length < 3) return null;

  return (
    <div data-testid="indice-guia" className="hidden lg:block">
      <GuiaTocNav items={mapTocItems(items)} sticky={sticky} />
    </div>
  );
}

/** Versión mobile: bloque desplegable arriba del cuerpo. */
export function IndiceGuiaMobile({ items }: Props) {
  if (items.length < 3) return null;

  return (
    <div className="mt-6 lg:hidden">
      <GuiaTocNav items={mapTocItems(items)} />
    </div>
  );
}
