"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            toast.success("Copiado");
          }}
        >
          Copiar
        </Button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
        {text}
      </pre>
    </section>
  );
}
