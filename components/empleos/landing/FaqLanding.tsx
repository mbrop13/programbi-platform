const FAQS = [
  {
    q: "¿Cuánto cuesta?",
    a: "Para candidatos es gratis, siempre. Las empresas publican sin costo durante el lanzamiento; destacar una vacante es opcional y se paga solo si lo necesitas.",
  },
  {
    q: "¿Necesito ser egresado de ProgramBI?",
    a: "No. Cualquier profesional de datos puede crear su perfil y postular. Si aprobaste cursos de ProgramBI, tus certificados se agregan solos y con sello verde.",
  },
  {
    q: "¿Cómo se verifican los certificados?",
    a: "Cada certificado se emite automáticamente al aprobar un curso y queda asociado a tu cuenta. Las empresas ven exactamente qué skill está certificada y cuál solo declarada.",
  },
  {
    q: "¿Cuándo abre oficialmente?",
    a: "Estamos en pre-lanzamiento: las empresas ya pueden registrarse y los candidatos pueden adelantar su perfil hoy. Las primeras vacantes se publican al abrir.",
  },
];

/** FAQ en columna central, tipografía amplia, separadores hairline. */
export default function FaqLanding() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-[820px]">
        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Preguntas, <em className="italic">respondidas</em>
        </h2>
        <div className="mt-12">
          {FAQS.map((f) => (
            <div key={f.q} className="border-t border-line py-7 last:border-b">
              <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{f.q}</h3>
              <p className="mt-2.5 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
