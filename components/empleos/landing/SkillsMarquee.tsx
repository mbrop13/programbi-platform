import { BadgeCheck } from "lucide-react";
import { JOB_SKILLS } from "@/lib/data/job-skills";

/** Doble marquee de skills certificables en direcciones opuestas. */
export default function SkillsMarquee() {
  const loop = [...JOB_SKILLS, ...JOB_SKILLS];
  const chip =
    "inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-base font-semibold text-ink";

  return (
    <section
      aria-label="Skills certificables"
      className="overflow-hidden border-y border-line bg-wash/40 py-14 lg:py-16"
    >
      <p className="px-4 text-center text-sm font-medium text-mute sm:px-6">
        Skills que llegan <span className="font-semibold text-ink">certificadas</span> a cada vacante
      </p>
      <div className="mt-8 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <div className="logo-track" style={{ animationDuration: "60s" }}>
          {loop.map((s, i) => (
            <span key={`${s.id}-a-${i}`} className={`${chip} mx-1.5`}>
              <BadgeCheck size={15} className="text-[#16a34a]" />
              {s.label}
            </span>
          ))}
        </div>
        <div className="logo-track" style={{ animationDuration: "70s", animationDirection: "reverse" }}>
          {[...loop].reverse().map((s, i) => (
            <span key={`${s.id}-b-${i}`} className={`${chip} mx-1.5 opacity-60`}>
              <BadgeCheck size={15} className="text-[#16a34a]/70" />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
