"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { referralSignupUrl } from "@/lib/referrals/format";

export function CopyLinkButton({
  code,
  always = false,
}: {
  code: string;
  always?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const href = referralSignupUrl(code);

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
      className={
        always
          ? "inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-semibold text-canvas"
          : "hidden h-9 items-center gap-1.5 rounded-full border border-line bg-canvas px-3 text-[13px] font-medium text-ink hover:bg-wash sm:inline-flex"
      }
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? "Copiado" : "Copiar link"}
    </button>
  );
}
