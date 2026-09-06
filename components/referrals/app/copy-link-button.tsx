"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/seo";

export function CopyLinkButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const href = `${SITE_URL}/cursos?ref=${encodeURIComponent(code)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(href);
    setCopied(true);
    toast.success("Link copiado");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="hidden h-9 items-center gap-1.5 rounded-full border border-line bg-canvas px-3 text-[13px] font-medium text-ink hover:bg-wash sm:inline-flex"
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? "Copiado" : "Copiar link"}
    </button>
  );
}
