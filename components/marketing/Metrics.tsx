import { courses } from "@/lib/data/courses";

export const stats = [
  { value: "+5.000", label: "Estudiantes formados" },
  // Mismo conteo que la sección «Cursos» de la home, para que las dos cifras no se contradigan.
  { value: String(courses.length), label: "Programas en vivo" },
  { value: "100%", label: "Clases en vivo por Zoom" },
];

export default function Metrics() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-5 lg:px-8 lg:py-6 ${i > 0 ? "border-l border-line" : ""}`}
          >
            <p className="text-xl font-semibold tracking-tight text-ink tabular-nums lg:text-2xl">{s.value}</p>
            <p className="mt-1 text-xs text-mute">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
