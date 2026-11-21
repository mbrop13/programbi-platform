"use client";

import { GuiaTocNav, type GuiaTocItem } from "@/components/guias/GuiaEditorialPrimitives";

export interface ItemTocPasoAPaso {
  id: string;
  texto: string;
  nivel: 2 | 3;
}

function mapTocItems(items: ItemTocPasoAPaso[]): GuiaTocItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.texto,
    level: item.nivel,
  }));
}

export function GuiaPasoAPasoTocDesktop({ items }: { items: ItemTocPasoAPaso[] }) {
  if (items.length === 0) return null;

  return (
    <GuiaTocNav
      items={mapTocItems(items)}
      title="En esta guía"
      className="hidden lg:block"
    />
  );
}

export function GuiaPasoAPasoTocMobile({ items }: { items: ItemTocPasoAPaso[] }) {
  if (items.length === 0) return null;

  return (
    <GuiaTocNav
      items={mapTocItems(items)}
      title="En esta guía"
      mobileLabel="En esta guía"
      className="mt-6 lg:hidden"
    />
  );
}
