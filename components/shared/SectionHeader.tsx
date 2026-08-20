import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  maxWidth?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
}

const maxWidthMap = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
};

export default function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  align = "center",
  maxWidth = "md",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "text-center mx-auto" : "text-left"} ${maxWidthMap[maxWidth]} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-[#1890FF] font-semibold text-[11px] uppercase tracking-[0.14em] mb-4">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {eyebrow}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight leading-[1.12]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base lg:text-lg text-zinc-500 leading-relaxed ${
            isCenter ? "mx-auto" : ""
          } ${maxWidthMap[maxWidth]}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
