/** Static first paint of the hero mockup — no client JS, no webfont. */
export default function HeroPreviewShell() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-8 rounded-[50px] bg-gradient-to-tr from-ink/8 via-ink/0 to-ink/6 blur-3xl" />

      <div className="relative flex h-[min(420px,50vh)] w-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_25px_80px_rgba(23,23,22,0.10)] ring-1 ring-ink/5 sm:h-[min(500px,56vh)] sm:rounded-[26px]">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line bg-canvas px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <i className="size-3 rounded-full bg-[#ff5f57]" />
              <i className="size-3 rounded-full bg-[#febc2e]" />
              <i className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-3 hidden items-center gap-2 text-xs font-medium text-mute sm:flex">
              <span className="font-semibold text-ink">ventas.py</span>
              <span className="text-faint">—</span>
              <span className="text-[11px] text-faint">Python</span>
            </div>
          </div>
          <span className="text-[11px] text-faint">Clase en vivo</span>
        </div>

        <div className="relative min-h-0 flex-1 bg-paper px-4 py-3 text-[11px] leading-[1.7] text-mute sm:text-[12px]">
          <p>
            <span className="text-[#0451a5]">import</span> pandas{" "}
            <span className="text-[#0451a5]">as</span> pd
          </p>
          <p>
            <span className="text-[#0451a5]">import</span> plotly.express{" "}
            <span className="text-[#0451a5]">as</span> px
          </p>
          <p className="mt-3">
            ventas = pd.read_csv(<span className="text-[#a31515]">&quot;ventas.csv&quot;</span>)
          </p>
          <p className="mt-1">mensual = ventas.groupby(<span className="text-[#a31515]">&quot;mes&quot;</span>).sum()</p>
          <p className="mt-1 bg-wash">fig = px.bar(mensual, x=<span className="text-[#a31515]">&quot;mes&quot;</span>, y=<span className="text-[#a31515]">&quot;total&quot;</span>)</p>
          <p>fig.show()</p>
        </div>
      </div>

      <div className="relative mt-3 flex rounded-md bg-canvas">
        <span className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-l-md border-2 border-[rgb(23_23_22_/_0.28)] bg-paper py-2.5 text-sm font-semibold text-ink">
          Python
        </span>
        <span className="flex min-h-12 flex-1 items-center justify-center gap-2 border-2 border-transparent py-2.5 text-sm font-semibold text-mute">
          Power BI
        </span>
        <span className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-r-md border-2 border-transparent py-2.5 text-sm font-semibold text-mute">
          SQL Server
        </span>
      </div>
    </div>
  );
}
