/** Trust strip without vanity counters. No “0+” / métricas no verificadas. */
export default function HomeProof() {
  const items = [
    { label: "Empresas", text: "Factura directa. Pack Adopción, no un curso SENCE." },
    { label: "Chile", text: "Diagnóstico 30 min. WhatsApp +56 9 3540 9699." },
    { label: "Particulares", text: "Cursos Power BI, SQL y Python en vivo por Zoom." },
  ];

  return (
    <section className="border-t border-line px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">{item.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
