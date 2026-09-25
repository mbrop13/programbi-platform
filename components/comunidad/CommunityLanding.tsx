import { ArrowRight, Calendar, Check, Video } from "lucide-react";
import { CampusCta } from "./campus-cta";

const MONTHLY_CLP = 29990;

const priceLabel = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
}).format(MONTHLY_CLP);

const includes = [
  "1 clase semanal en vivo",
  "La clase queda grabada",
  "La ves después, cuando puedas",
  "Un solo plan, sin otros precios",
];

const moments = [
  {
    when: "Antes",
    title: "Creas tu cuenta",
    body: "Quedas dentro de la comunidad. La suscripción todavía no corre.",
  },
  {
    when: "Primera clase",
    title: "Ahí parte el mes",
    body: "El día de la primera clase en vivo empieza a correr la suscripción de " + priceLabel + ".",
  },
  {
    when: "Cada semana",
    title: "Una clase, y queda",
    body: "Una sesión en vivo. Si no alcanzas a entrar, la grabación queda disponible.",
  },
];

const faqs = [
  {
    q: "¿Cuántas clases hay?",
    a: "Una clase en vivo por semana. Cada clase queda grabada.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `Hay un solo plan: ${priceLabel} al mes.`,
  },
  {
    q: "¿Cuándo empieza a correr la suscripción?",
    a: "Desde la primera clase. Si te unes antes de esa fecha, el mes no corre hasta el día de la primera clase en vivo.",
  },
  {
    q: "¿Qué pasa si no puedo conectarme al vivo?",
    a: "La clase queda grabada. La puedes ver después.",
  },
  {
    q: "¿Hay más de un plan?",
    a: `No. La comunidad tiene un solo plan de ${priceLabel} al mes.`,
  },
];

const btnPrimary =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98] border-0 cursor-pointer";

export default function CommunityLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-canvas text-ink">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="min-w-0 lg:pt-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-xs font-semibold text-mute">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              En vivo · 1 clase por semana
            </div>

            <h1 className="max-w-[14ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Una clase semanal <em className="italic font-semibold">en vivo</em> que queda grabada
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
              La comunidad de ProgramBI tiene un solo plan de {priceLabel} al mes. La suscripción empieza a correr desde la primera clase.
            </p>

            <ul className="mt-8 space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-ink sm:text-base">
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>

            <a href="#membresia" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-mute">
              Ver el plan
              <ArrowRight className="size-4" />
            </a>
          </div>

          <aside id="membresia" className="scroll-mt-28">
            <div className="rounded-[26px] border border-line bg-paper p-5 shadow-[0_20px_60px_rgba(23,23,22,0.06)] sm:p-6 lg:sticky lg:top-[var(--sticky-below-nav,6rem)] lg:transition-[top] lg:duration-300 lg:ease-out motion-reduce:transition-none">
              <p className="text-sm font-medium text-ink">Plan único</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-ink">{priceLabel}</p>
              <p className="mt-1 text-sm text-mute">al mes</p>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-canvas px-3.5 py-3">
                <Calendar className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-semibold">La suscripción empieza a correr desde la primera clase.</span>{" "}
                  <span className="text-mute">Antes de esa fecha el mes no corre.</span>
                </p>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                <li className="flex items-center gap-2.5 text-sm text-ink">
                  <Video className="size-4 shrink-0" />
                  1 clase en vivo por semana
                </li>
                <li className="flex items-center gap-2.5 text-sm text-ink">
                  <Check className="size-4 shrink-0" strokeWidth={2.5} />
                  Queda grabada
                </li>
              </ul>

              <div className="mt-6">
                <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/inicio" className={btnPrimary}>
                  {isLoggedIn ? "Entrar a la comunidad" : "Crear cuenta"}
                  <ArrowRight className="size-4" />
                </CampusCta>
                <p className="mt-3 text-center text-xs leading-relaxed text-mute">
                  Crear la cuenta no adelanta el cobro. El mes de {priceLabel} parte el día de la primera clase.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 sm:grid-cols-3">
          {[
            { value: "1", label: "clase en vivo por semana" },
            { value: "Grabada", label: "para verla después del vivo" },
            { value: priceLabel, label: "un solo plan, al mes" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`px-6 py-10 lg:px-10 lg:py-12 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}
            >
              <p className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">{item.value}</p>
              <p className="mt-1.5 text-sm text-mute">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="max-w-[16ch] text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            La suscripción empieza en la primera clase
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
            No desde el día en que te registras. El mes corre cuando entras a la primera clase en vivo.
          </p>

          <div className="mt-12 grid grid-cols-1 border-y border-line md:grid-cols-3">
            {moments.map((moment, i) => (
              <article
                key={moment.when}
                className={`py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l md:pl-8" : ""}`}
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">{moment.when}</p>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">{moment.title}</h3>
                <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-mute">{moment.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">La clase queda grabada</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mute">
              Entras al vivo una vez por semana. Si ese horario no te acomoda, la misma clase queda grabada para verla después.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[26px] border border-line bg-line sm:grid-cols-2">
            <div className="bg-paper p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">En vivo</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-ink">1 vez por semana</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">Una sesión en vivo. No hay un calendario de varias clases por semana.</p>
            </div>
            <div className="bg-paper p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Después</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-ink">Queda grabada</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">La clase no se pierde. La grabación queda para verla cuando puedas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Preguntas frecuentes</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                  <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                  <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 rounded-[26px] border border-line bg-paper px-6 py-10 sm:px-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Un solo plan. {priceLabel} al mes.</h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-mute">
              1 clase semanal en vivo, que queda grabada. La suscripción empieza a correr desde la primera clase.
            </p>
          </div>
          <div className="w-full max-w-xs shrink-0">
            <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/inicio" className={btnPrimary}>
              {isLoggedIn ? "Entrar a la comunidad" : "Crear cuenta"}
              <ArrowRight className="size-4" />
            </CampusCta>
          </div>
        </div>
      </section>
    </div>
  );
}
