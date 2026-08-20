const stats = [
  { value: "+5.000", label: "Estudiantes egresados" },
  { value: "+10", label: "Programas activos" },
  { value: "98%", label: "Tasa de satisfacción" },
];

export default function Metrics() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-10 lg:px-10 lg:py-12 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}
          >
            <p className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">{s.value}</p>
            <p className="mt-1.5 text-sm text-mute">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
