import { ArrowRight, Calendar, Check, Flame, Target, Video } from "lucide-react";
import LogoSlider from "@/components/marketing/LogoSlider";
import { PRACTICE_UNIT_META } from "@/lib/practice/catalog";
import type { CommunityClass } from "@/lib/comunidad/community-class";
import { CampusCta } from "./campus-cta";
import CommunityCalendar from "./CommunityCalendar";

const LIST_CLP = 49990;
const PROMO_CLP = 29990;

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});
const listLabel = clp.format(LIST_CLP);
const priceLabel = clp.format(PROMO_CLP);

const includes = [
  "1 clase de 2 horas, en vivo, por semana",
  "La clase queda grabada",
  "Practica estilo Duolingo entre clases",
  `Promoción de ${priceLabel} al mes, para siempre`,
];

const classCases = [
  { title: "Informes comerciales", body: "Ventas, margen y qué está moviendo el resultado." },
  { title: "Control de gestión", body: "Indicadores del área y el seguimiento de lo comprometido." },
  { title: "Proyectos", body: "Avance, plazos y dónde se está yendo el trabajo." },
  { title: "Informes financieros", body: "Resultado, costos y la lectura para administrar." },
];

const practicePoints = [
  { icon: Target, title: "Ruta de niveles", body: "Eliges un track y avanzas lección a lección. Lo que sigue se desbloquea cuando terminas lo anterior." },
  { icon: Flame, title: "XP, racha y meta diaria", body: "Ganas XP, mantienes la racha y eliges un ritmo de 5 a 25 minutos." },
  { icon: Check, title: "Feedback al instante", body: "Cada respuesta se corrige en el momento, con la explicación." },
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
    body: "El día de la primera clase en vivo empieza a correr la suscripción de " + priceLabel + ". Ese precio se conserva para siempre.",
  },
  {
    when: "Cada semana",
    title: "Una clase, y queda",
    body: "Una sesión de 2 horas, Clase o Clase avanzada. Si no alcanzas a entrar, queda grabada.",
  },
];

const faqs = [
  {
    q: "¿Cuántas clases hay?",
    a: "Una clase en vivo por semana. Cada clase dura 2 horas y queda grabada.",
  },
  {
    q: "¿Hay clases normales y avanzadas?",
    a: "Hay dos tipos. Clase trabaja informes comerciales, control de gestión, proyectos e informes financieros. Clase avanzada toma ese mismo terreno con Power BI, Python y SQL Server en un nivel más alto. El calendario muestra la fecha de cada una.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `El precio original es ${listLabel} al mes. Por promoción queda en ${priceLabel}, y ese precio se conserva para siempre.`,
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
    a: `Hay un solo plan. El precio original es ${listLabel} al mes y la promoción lo deja en ${priceLabel} para siempre.`,
  },
  {
    q: "¿El precio de promoción sube después?",
    a: `Se conserva para siempre. Quien entra con la promoción sigue pagando ${priceLabel} al mes.`,
  },
  {
    q: "¿Qué se ve en las clases?",
    a: "Casos para decidir en administración: informes comerciales, control de gestión, proyectos e informes financieros, entre otros. Se arman con Power BI, Python y SQL Server.",
  },
  {
    q: "¿Cómo son las clases?",
    a: "Son prácticas y duran 2 horas. En la sesión se trabaja el informe para apoyar la toma de decisiones de equipos administrativos.",
  },
  {
    q: "¿Qué es Practica?",
    a: "Una ruta estilo Duolingo. Eliges Power BI, SQL Server, Python, Excel o Inteligencia Artificial, avanzas por niveles, ganas XP y mantienes una racha.",
  },
];

const btnPrimary =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98] border-0 cursor-pointer";
const btnInline =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98] border-0 cursor-pointer";

export default function CommunityLanding({
  isLoggedIn,
  classes,
}: {
  isLoggedIn: boolean;
  classes: CommunityClass[];
}) {
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
              En vivo · 2 horas · 1 por semana
            </div>

            <h1 className="max-w-[14ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Una clase semanal <em className="italic font-semibold">en vivo</em> que queda grabada
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
              Cada semana hay una clase práctica de 2 horas, en vivo, y queda grabada. Hay clase y clase avanzada. Entre medio sigues con Practica, una ruta estilo Duolingo. Un solo plan: {listLabel} al mes, en promoción {priceLabel} para siempre. La suscripción empieza a correr desde la primera clase.
            </p>

            <ul className="mt-8 space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-ink sm:text-base">
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>

            <a href="#plan" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-mute">
              Ver el plan
              <ArrowRight className="size-4" />
            </a>
          </div>

          <aside className="scroll-mt-28">
            <div className="rounded-[26px] border border-line bg-paper p-5 shadow-[0_20px_60px_rgba(23,23,22,0.06)] sm:p-6 lg:sticky lg:top-[var(--sticky-below-nav,6rem)] lg:transition-[top] lg:duration-300 lg:ease-out motion-reduce:transition-none">
              <p className="text-sm font-medium text-ink">Plan único</p>
              <p className="mt-3 text-sm text-faint">
                <span className="line-through">{listLabel}</span>
                <span className="ml-2 font-semibold text-ink">Promoción</span>
              </p>
              <p className="text-4xl font-bold tracking-tight text-ink">{priceLabel}</p>
              <p className="mt-1 text-sm text-mute">al mes, para siempre</p>

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
                  1 clase de 2 horas por semana
                </li>
                <li className="flex items-center gap-2.5 text-sm text-ink">
                  <Check className="size-4 shrink-0" strokeWidth={2.5} />
                  Queda grabada
                </li>
                <li className="flex items-center gap-2.5 text-sm text-ink">
                  <Target className="size-4 shrink-0" />
                  Practica estilo Duolingo
                </li>
                <li className="flex items-center gap-2.5 text-sm text-ink">
                  <Check className="size-4 shrink-0" strokeWidth={2.5} />
                  {priceLabel} se conserva para siempre
                </li>
              </ul>

              <div className="mt-6">
                <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/inicio" className={btnPrimary}>
                  {isLoggedIn ? "Entrar a la comunidad" : "Crear cuenta"}
                  <ArrowRight className="size-4" />
                </CampusCta>
                <p className="mt-3 text-center text-xs leading-relaxed text-mute">
                  Crear la cuenta no adelanta el cobro. El mes de {priceLabel} parte el día de la primera clase y ese precio se conserva para siempre.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-line bg-wash/40">
        <p className="px-4 pt-8 text-center text-[11px] font-bold uppercase tracking-widest text-mute sm:pt-10">
          Empresas que se han capacitado con nosotros
        </p>
        <LogoSlider className="border-0 bg-transparent" />
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
          {[
            { value: "2 h", label: "cada clase, una por semana" },
            { value: "Grabada", label: "para verla después del vivo" },
            { value: "Practica", label: "ruta estilo Duolingo" },
            { value: priceLabel, label: `al mes para siempre, antes ${listLabel}` },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`px-6 py-10 lg:px-10 lg:py-12 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
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
        <div className="mx-auto max-w-[1400px]">
          <h2 className="max-w-[18ch] text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Clases prácticas para decidir
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
            Para equipos administrativos. Cada clase dura 2 horas: se arma el informe en la sesión con Power BI, Python y SQL Server, para apoyar la toma de decisiones. Hay dos tipos, Clase y Clase avanzada, y la clase queda grabada.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[26px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {classCases.map((item) => (
              <article key={item.title} className="bg-paper p-6">
                <h3 className="text-lg font-bold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-mute">Power BI · Python · SQL Server</p>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[26px] border border-line bg-line sm:grid-cols-2">
            <div className="bg-paper p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">En vivo</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-ink">2 horas</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">Una sesión por semana, de 19:30 a 21:30, hora de Chile. El informe se arma durante la clase.</p>
            </div>
            <div className="bg-paper p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Después</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-ink">Queda grabada</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">La clase no se pierde. La grabación queda para verla cuando puedas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="calendario" className="border-b border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Calendario</p>
          <h2 className="mt-3 max-w-[16ch] text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Las próximas clases
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
            Cada clase dura 2 horas. Acá están las próximas, con su fecha y si es Clase o Clase avanzada. Elige un día para ver el horario.
          </p>
          <div className="mt-10">
            <CommunityCalendar classes={classes} />
          </div>
        </div>
      </section>

      <section id="practica" className="border-b border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Practica</p>
            <h2 className="mt-3 max-w-[16ch] text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Una ruta estilo Duolingo para datos
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
              Entre la clase semanal sigues practicando solo: niveles, XP y racha. Eliges el track y avanzas a tu ritmo.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {practicePoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="rounded-[22px] border border-line bg-paper p-4">
                    <Icon className="size-4" />
                    <h3 className="mt-3 text-sm font-bold text-ink">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{point.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {PRACTICE_UNIT_META.map((track) => (
                <span key={track.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink">
                  <span className="size-2 rounded-full" style={{ backgroundColor: track.accentColor }} />
                  {track.title}
                </span>
              ))}
            </div>
            <CampusCta isLoggedIn={isLoggedIn} href="/comunidad/practicar" className={`${btnInline} mt-8`}>
              Empezar a practicar
              <ArrowRight className="size-4" />
            </CampusCta>
          </div>

          <div className="rounded-[26px] border border-line bg-paper p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Tu ruta</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-ink">SQL Server</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink">
                <Flame className="size-3.5" />
                120 XP
              </span>
            </div>
            <ol className="mt-8 space-y-0">
              {[
                { label: "SELECT básico", state: "Hecho" },
                { label: "WHERE y filtros", state: "Hecho" },
                { label: "JOINs", state: "Ahora" },
                { label: "GROUP BY", state: "Después" },
              ].map((step, index) => (
                <li key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full border text-xs font-bold ${
                        step.state === "Después" ? "border-line bg-canvas text-faint" : "border-ink bg-ink text-canvas"
                      }`}
                    >
                      {step.state === "Hecho" ? <Check className="size-4" strokeWidth={2.5} /> : index + 1}
                    </span>
                    {index < 3 ? <span className="h-8 w-px bg-line" /> : null}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-semibold ${step.state === "Después" ? "text-faint" : "text-ink"}`}>{step.label}</p>
                    <p className="text-xs text-mute">{step.state}</p>
                  </div>
                </li>
              ))}
            </ol>
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

      <section id="plan" className="scroll-mt-28 border-t border-line px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 rounded-[26px] border border-line bg-paper px-6 py-10 sm:px-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Un solo plan. {priceLabel} al mes, para siempre.</h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-mute">
              Precio original {listLabel}. Por promoción queda en {priceLabel} y ese precio se conserva para siempre. La suscripción empieza a correr desde la primera clase.
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
