import Link from "next/link";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { getMetaCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { fechaCorta, pesos, porcentaje, semestres } from "@/lib/datos/formato";
import {
  filasPreset,
  PRESETS_MAP,
  PRESET_SLUGS,
  resumenPreset,
  type PresetRow,
  type PresetSlug,
} from "@/lib/datos/presets";
import {
  breadcrumbsSchema,
  faqPageSchema,
  itemListSchema,
  MIGAS_BASE,
} from "@/lib/datos/seo-carreras";
import { CtaDatos } from "./CtaDatos";
import { EnResumen } from "./EnResumen";
import { FaqDatos } from "./FaqDatos";
import { FuenteLinea } from "./FuenteLinea";
import { DatosViewTracker } from "./HubCarrerasExtras";
import { MigasDatos } from "./MigasDatos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function TablaPreset({
  filas,
  columnaExtraLabel,
  mostrarTipo = true,
}: {
  filas: PresetRow[];
  columnaExtraLabel: string;
  mostrarTipo?: boolean;
}) {
  if (filas.length === 0) {
    return (
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-6 text-sm text-[#5c5c58]">
        No hay carreras que cumplan este criterio en la edición actual.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-xl border border-[#e2e2dc] bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e2e2dc] bg-[#f7f7f4] text-xs font-semibold text-[#5c5c58]">
              <th className="px-3 py-3 text-center">#</th>
              <th className="px-3 py-3">Carrera</th>
              {mostrarTipo ? <th className="px-3 py-3">Tipo</th> : null}
              <th className="px-3 py-3 text-right">{columnaExtraLabel}</th>
              <th className="px-3 py-3 text-right">Sueldo 4.º año</th>
              <th className="px-3 py-3 text-right">Empleab. 1.º</th>
              <th className="px-3 py-3 text-right">Arancel med.</th>
              <th className="px-3 py-3 text-right">Dur. real</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e2dc]">
            {filas.map((row, idx) => (
              <tr
                key={`${row.slug}-${row.tipo}`}
                className="transition-colors hover:bg-[#f7f7f4]/80"
              >
                <td className="px-3 py-3 text-center text-xs font-semibold text-[#5c5c58] tabular-nums">
                  {idx + 1}
                </td>
                <td className="px-3 py-3">
                  <Link
                    href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                    className="font-semibold text-[#171716] hover:text-[#1890ff] hover:underline"
                  >
                    {row.nombre}
                  </Link>
                  <div className="text-xs text-[#5c5c58]">{row.area}</div>
                </td>
                {mostrarTipo ? (
                  <td className="px-3 py-3">
                    <Badge
                      variant="outline"
                      className="border-[#e2e2dc] bg-[#f7f7f4] text-[11px] font-semibold text-[#171716]"
                    >
                      {TIPO_ETIQUETAS[row.tipo].corto}
                    </Badge>
                  </td>
                ) : null}
                <td className="px-3 py-3 text-right font-bold text-[#1890ff] tabular-nums">
                  {row.textoMetrica}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-[#171716] tabular-nums">
                  {pesos(row.ing4)}
                </td>
                <td className="px-3 py-3 text-right text-[#171716] tabular-nums">
                  {porcentaje(row.emp1)}
                </td>
                <td className="px-3 py-3 text-right text-xs text-[#171716] tabular-nums">
                  {pesos(row.arancel_med)}
                </td>
                <td className="px-3 py-3 text-right text-xs text-[#5c5c58] tabular-nums">
                  {semestres(row.dur_real)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filas.map((row, idx) => (
          <div
            key={`${row.slug}-${row.tipo}`}
            className="rounded-xl border border-[#e2e2dc] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-[#5c5c58] tabular-nums">
                  #{idx + 1} · {TIPO_ETIQUETAS[row.tipo].corto} · {row.area}
                </span>
                <h3 className="text-base font-bold text-[#171716]">
                  <Link
                    href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                    className="hover:text-[#1890ff] hover:underline"
                  >
                    {row.nombre}
                  </Link>
                </h3>
              </div>
              <span className="shrink-0 text-sm font-bold text-[#1890ff] tabular-nums">
                {row.textoMetrica}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-[#5c5c58]">Sueldo 4.º</div>
                <div className="font-semibold text-[#171716] tabular-nums">
                  {pesos(row.ing4)}
                </div>
              </div>
              <div>
                <div className="text-[#5c5c58]">Empleab. 1.º</div>
                <div className="font-semibold text-[#171716] tabular-nums">
                  {porcentaje(row.emp1)}
                </div>
              </div>
              <div>
                <div className="text-[#5c5c58]">Arancel med.</div>
                <div className="font-medium text-[#171716] tabular-nums">
                  {pesos(row.arancel_med)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VistaPreset({ slug }: { slug: PresetSlug }) {
  const def = PRESETS_MAP[slug];
  const meta = getMetaCarreras();
  const esMejorPagadas = slug === "mejor-pagadas";

  const filasU = esMejorPagadas ? filasPreset(slug, "u") : [];
  const filasIp = esMejorPagadas ? filasPreset(slug, "ip") : [];
  const filasCft = esMejorPagadas ? filasPreset(slug, "cft") : [];
  const filasUnicas = esMejorPagadas ? filasU : filasPreset(slug);

  const resumen = resumenPreset(slug, filasUnicas);

  const migas = [
    ...MIGAS_BASE,
    { label: def.tituloCorto, path: `/datos/carreras/${slug}` },
  ];

  const itemsSchema = esMejorPagadas ? [...filasU, ...filasIp, ...filasCft] : filasUnicas;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      itemListSchema(
        def.h1,
        itemsSchema.map((r) => ({ nombre: r.nombre, slug: r.slug, tipo: r.tipo }))
      ),
      faqPageSchema(def.faqs),
      breadcrumbsSchema(migas),
    ],
  };

  const otrosPresets = PRESET_SLUGS.filter((s) => s !== slug);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
      <DatosViewTracker evento="datos_preset_view" params={{ preset: slug }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-4">
        <MigasDatos migas={migas} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-3xl space-y-2.5">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold text-[#1890ff]">
              <span>Edición {meta.edicion}</span>
              <span aria-hidden="true" className="text-[#d4d4ce]">·</span>
              <span className="font-medium text-[#5c5c58]">
                Actualizado el {fechaCorta(meta.fetched_at)}
              </span>
            </div>
            <h1 className="h1-datos text-[#171716]">{def.h1}</h1>
            <p className="text-base leading-relaxed text-[#5c5c58]">{def.descriptionSeo}</p>
          </header>

          <Link
            href={`/datos/carreras${def.queryFiltros}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#1890ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#1890ff] transition-colors hover:bg-[#e9f4ff]"
          >
            <SlidersHorizontal className="size-4" />
            Ajustar filtros
          </Link>
        </div>
      </div>

      <EnResumen
        frases={resumen}
        fuente={`Fuente: www.mifuturo.cl (SIES, Mineduc), edición ${meta.edicion}.`}
      />

      <section aria-label="Tabla de resultados">
        {esMejorPagadas ? (
          <Tabs defaultValue="u" className="space-y-4">
            <TabsList className="bg-[#f3f3f0]">
              <TabsTrigger value="u" className="text-xs font-semibold sm:text-sm">
                Universidades ({filasU.length})
              </TabsTrigger>
              <TabsTrigger value="ip" className="text-xs font-semibold sm:text-sm">
                Institutos Profesionales ({filasIp.length})
              </TabsTrigger>
              <TabsTrigger value="cft" className="text-xs font-semibold sm:text-sm">
                CFT ({filasCft.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="u" keepMounted>
              <TablaPreset
                filas={filasU}
                columnaExtraLabel={def.columnaExtraLabel}
                mostrarTipo={false}
              />
            </TabsContent>
            <TabsContent value="ip" keepMounted>
              <TablaPreset
                filas={filasIp}
                columnaExtraLabel={def.columnaExtraLabel}
                mostrarTipo={false}
              />
            </TabsContent>
            <TabsContent value="cft" keepMounted>
              <TablaPreset
                filas={filasCft}
                columnaExtraLabel={def.columnaExtraLabel}
                mostrarTipo={false}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <TablaPreset filas={filasUnicas} columnaExtraLabel={def.columnaExtraLabel} />
        )}
      </section>

      {/* Metodología 150-250 palabras */}
      <section
        aria-labelledby="metodologia-preset-titulo"
        className="prose-datos rounded-xl border border-[#e2e2dc] bg-white p-6"
      >
        <h2 id="metodologia-preset-titulo" className="h2-datos text-[#171716]">
          Cómo se construye este ranking
        </h2>
        <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#3c3c39]">
          {def.metodologia.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </section>

      {/* Otras vistas */}
      <section aria-labelledby="otras-vistas-titulo" className="space-y-3">
        <h2 id="otras-vistas-titulo" className="text-lg font-bold text-[#171716]">
          Otras vistas del observatorio
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otrosPresets.map((otro) => {
            const p = PRESETS_MAP[otro];
            return (
              <Link
                key={otro}
                href={`/datos/carreras/${otro}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#e2e2dc] bg-white px-4 py-3 text-sm font-semibold text-[#171716] transition-colors hover:border-[#1890ff] hover:text-[#1890ff]"
              >
                <span>{p.tituloCorto}</span>
                <ArrowUpRight className="size-4 shrink-0 text-[#5c5c58]" />
              </Link>
            );
          })}
        </div>
      </section>

      <FaqDatos faqs={def.faqs} />

      <CtaDatos pagina={`/datos/carreras/${slug}`} />

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
