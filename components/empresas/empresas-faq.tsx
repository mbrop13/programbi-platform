"use client";

import { useState } from "react";
import { EMPRESAS_FAQS } from "@/lib/data/empresas-faqs";

export function EmpresasFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {EMPRESAS_FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium tracking-tight"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="text-faint" aria-hidden>
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="pb-4 text-sm leading-relaxed text-mute">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
