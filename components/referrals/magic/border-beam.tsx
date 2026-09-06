"use client";

import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  duration = 8,
}: {
  className?: string;
  duration?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <span
        className="absolute inset-[-1px] rounded-[inherit] motion-reduce:hidden"
        style={{
          background:
            "conic-gradient(from var(--beam-angle, 0deg), transparent 0%, transparent 70%, rgba(15,122,77,0.85) 85%, transparent 100%)",
          animation: `ref-beam ${duration}s linear infinite`,
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <style>{`
        @property --beam-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes ref-beam {
          to { --beam-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce\\:hidden { display: none !important; }
        }
      `}</style>
    </span>
  );
}
