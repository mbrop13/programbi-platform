import Link from "@/components/datos/EnlaceNavegacionDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import data from "@/data/datos-fase3/sence.json";

const number = new Intl.NumberFormat("es-CL");
const pct = new Intl.NumberFormat("es-CL", { style: "percent", maximumFractionDigits: 1 });

const MENORES = new Set(["de", "del", "la", "las", "los", "y"]);
function tituloRegion(nombre: string): string {
  return nombre
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && MENORES.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ")
    .replace(/\bO'higgins\b/i, "O'Higgins");
}

const MIGAS = [
  { label: "Inicio", path: "/" },
  { label: "Datos de Chile", path: "/datos" },
  { label: "Capacitación", path: "/datos/capacitacion" },
];

export function SenceObservatorio() {
  const regiones = [...data.regions].sort((a, b) => b.total - a.total);
  const max = regiones[0]?.total ?? 1;
  const tasaNacional = data.national.aprobados / data.national.total;
  const primera = regiones[0];
  const participacionPrimera = primera ? primera.total / data.national.total : null;

  return (
    <article className="mx-auto max-w-[1180px] px-4 pt-6 pb-4 text-foreground sm:px-6 lg:pt-8">
      <MigasDatos migas={MIGAS} />

      <header className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
        <div className="flex flex-col justify-center py-2">
          <p className="text-sm font-semibold text-empleo">Capacitación SENCE · Anuario {data.year}</p>
          <h1 className="h1-datos mt-3">
            ¿Cuánta gente se capacita <span className="marcador">con franquicia SENCE</span>?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Participaciones en cursos pagados por empresas con la franquicia tributaria, región por
            región. Una persona puede tomar más de un curso, así que se cuentan participaciones, no
            personas.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-empleo p-6 text-white sm:p-8">
          <p className="text-sm font-semibold">Participaciones registradas en {data.year}</p>
          <p className="font-display text-[clamp(3rem,7vw,4.75rem)] leading-[0.9] font-extrabold tracking-[-0.045em] tabular-nums">
            {number.format(data.national.total)}
          </p>
          <p className="text-[15px] leading-snug font-medium">
            {number.format(data.national.aprobados)} aprobadas ({pct.format(tasaNacional)}).
          </p>
        </div>
      </header>

      <section aria-labelledby="sence-regiones" className="mt-14">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
          <div>
            <h2 id="sence-regiones" className="h2-datos">
              Participaciones por región
            </h2>
            {primera && participacionPrimera !== null ? (
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {tituloRegion(primera.region)} concentra el{" "}
                <strong className="text-foreground">{pct.format(participacionPrimera)}</strong> de
                las participaciones del país. Ordenado de mayor a menor.
              </p>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-[1.25rem] border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-[15px] tabular-nums">
              <caption className="sr-only">
                Participaciones totales y aprobadas en capacitación por franquicia tributaria, {data.year}
              </caption>
              <thead className="bg-wash text-sm">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Región</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Participaciones</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Aprobadas</th>
                </tr>
              </thead>
              <tbody>
                {regiones.map((row) => (
                  <tr key={row.region} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {tituloRegion(row.region)}
                    </th>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-2.5 rounded-full bg-empleo"
                          style={{ width: `${Math.max(2, (row.total / max) * 100) * 0.6}%` }}
                        />
                        <span>{number.format(row.total)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {number.format(row.aprobados)}
                      <span className="ml-1.5 text-sm text-muted-foreground">
                        {pct.format(row.aprobados / row.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="sence-fuente"
        className="mt-14 rounded-[1.75rem] border border-line bg-white p-6 sm:p-10"
      >
        <div className="grid gap-4 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
          <h2 id="sence-fuente" className="h2-datos">
            Fuente y metodología
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-700">
            <p>
              {data.methodology} La fuente es administrativa y cubre el año calendario (enero a
              diciembre de {data.year}); SENCE publica su anuario durante el segundo trimestre de
              cada año. ProgramBI transformó el cuadro A.1 para esta visualización.
            </p>
            <p className="flex flex-wrap gap-x-5 gap-y-2">
              <a className="font-semibold text-foreground underline decoration-2 underline-offset-4 hover:text-blue-700" href={data.source}>
                Descargar el cuadro original (XLSX)
              </a>
              <a className="font-semibold text-foreground underline decoration-2 underline-offset-4 hover:text-blue-700" href={data.index}>
                Ver el anuario completo
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              La fuente no identifica una licencia de reutilización en el cuadro; consulta sus
              condiciones antes de redistribuirlo.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-10 text-base">
        <Link href="/datos/desempleo" className="font-semibold underline decoration-2 underline-offset-4 hover:text-blue-700">
          Ver también: desempleo por región
        </Link>
      </p>
    </article>
  );
}
