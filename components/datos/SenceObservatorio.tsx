import Link from "next/link";
import data from "@/data/datos-fase3/sence.json";

const number = new Intl.NumberFormat("es-CL");

export function SenceObservatorio() {
  return (
    <article className="mx-auto max-w-6xl px-5 py-12 text-[#171716] sm:px-8">
      <nav aria-label="Ruta de navegación" className="mb-10 text-sm text-neutral-600">
        <Link href="/datos" className="underline">Datos de Chile</Link> / Capacitación
      </nav>
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#006abf]">Datos de Chile · SENCE</p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Capacitación en Chile: franquicia tributaria</h1>
      <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-neutral-600">En resumen</p><p className="mt-3 max-w-3xl text-lg leading-relaxed text-neutral-700">En {data.year}, SENCE registró {number.format(data.national.total)} participaciones en cursos mediante franquicia tributaria; {number.format(data.national.aprobados)} fueron aprobadas. Una persona puede participar en más de un curso y aparecer más de una vez.</p>
      <p className="mt-4 text-sm text-neutral-600">Período: enero–diciembre {data.year} · Fuente: SENCE, Anuario Estadístico, cuadro A.1</p>
      <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Indicadores nacionales">
        <div className="rounded-xl border border-neutral-200 bg-white p-6"><p className="text-sm text-neutral-600">Participaciones registradas</p><p className="mt-2 text-4xl font-bold tabular-nums">{number.format(data.national.total)}</p></div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6"><p className="text-sm text-neutral-600">Participaciones aprobadas</p><p className="mt-2 text-4xl font-bold tabular-nums">{number.format(data.national.aprobados)}</p></div>
      </section>
      <section className="mt-14">
        <h2 className="text-2xl font-bold">Participaciones por región</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">El cuadro reúne las acciones liquidadas mediante franquicia tributaria. Los totales se refieren a participaciones, no a personas únicas ni a todos los programas de capacitación de SENCE.</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm tabular-nums"><caption className="sr-only">Participaciones totales y aprobadas en capacitación por franquicia tributaria, {data.year}</caption><thead className="bg-neutral-100"><tr><th scope="col" className="p-4">Región</th><th scope="col" className="p-4 text-right">Participaciones</th><th scope="col" className="p-4 text-right">Aprobadas</th></tr></thead><tbody>{data.regions.map((row) => <tr key={row.region} className="border-t border-neutral-200"><th scope="row" className="p-4 font-medium">{row.region}</th><td className="p-4 text-right">{number.format(row.total)}</td><td className="p-4 text-right">{number.format(row.aprobados)}</td></tr>)}</tbody></table>
        </div>
      </section>
      <section className="mt-14 max-w-3xl border-t border-neutral-200 pt-8"><h2 className="text-2xl font-bold">Fuente y metodología</h2><p className="mt-4 leading-relaxed text-neutral-700">{data.methodology} La fuente es administrativa y cubre el año calendario; SENCE señala que publica su anuario durante el segundo trimestre de cada año. ProgramBI transformó el cuadro para esta visualización.</p><p className="mt-4"><a className="text-[#006abf] underline" href={data.source}>Descargar el cuadro original XLSX de SENCE</a> · <a className="text-[#006abf] underline" href={data.index}>Consultar el anuario y otros cuadros</a></p><p className="mt-4 text-sm text-neutral-600">La fuente no identifica una licencia de reutilización en el cuadro; consulta sus condiciones antes de redistribuirlo.</p></section>
    </article>
  );
}
