import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMetaCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { anosDesdeSemestres, fechaCorta, pesos, porcentaje } from "@/lib/datos/formato";
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
import { cn } from "@/lib/utils";
import { CtaDatos } from "./CtaDatos";
import { EnResumen } from "./EnResumen";
import { FaqDatos } from "./FaqDatos";
import { FuenteLinea } from "./FuenteLinea";
import { DatosViewTracker } from "./HubCarrerasExtras";
import { MigasDatos } from "./MigasDatos";

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
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="p-6 text-sm text-muted-foreground">
          No hay carreras que cumplan este criterio en la edición actual.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-xs md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground">
              <th className="w-12 px-3 py-3 text-center">#</th>
              <th className="px-3 py-3">Carrera</th>
              {mostrarTipo ? <th className="px-3 py-3">Tipo</th> : null}
              <th className="px-3 py-3 text-right">{columnaExtraLabel}</th>
              <th className="px-3 py-3 text-right">Sueldo 4.º año</th>
              <th className="px-3 py-3 text-right">Empleabilidad</th>
              <th className="px-3 py-3 text-right">Arancel anual</th>
              <th className="px-3 py-3 text-right">Duración real</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {filas.map((row, idx) => (
              <tr
                key={`${row.slug}-${row.tipo}`}
                className="transition-colors hover:bg-muted/35"
              >
                <td className="px-3 py-3.5 text-center text-xs font-medium text-muted-foreground tabular-nums">
                  {idx + 1}
                </td>
                <td className="px-3 py-3.5">
                  <Link
                    href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                    className="font-semibold text-foreground hover:text-blue-700 hover:underline"
                  >
                    {row.nombre}
                  </Link>
                  <div className="text-xs text-muted-foreground">{row.area}</div>
                </td>
                {mostrarTipo ? (
                  <td className="px-3 py-3.5">
                    <Badge
                      variant="secondary"
                      className="h-auto rounded px-1.5 py-0.5 text-[11px] font-medium"
                    >
                      {TIPO_ETIQUETAS[row.tipo].corto}
                    </Badge>
                  </td>
                ) : null}
                <td className="px-3 py-3.5 text-right font-semibold text-blue-700 tabular-nums">
                  {row.textoMetrica}
                </td>
                <td className="px-3 py-3.5 text-right font-semibold text-foreground tabular-nums">
                  {pesos(row.ing4)}
                </td>
                <td className="px-3 py-3.5 text-right text-foreground tabular-nums">
                  {porcentaje(row.emp1)}
                </td>
                <td className="px-3 py-3.5 text-right text-xs text-foreground tabular-nums">
                  {pesos(row.arancel_med)}
                </td>
                <td className="px-3 py-3.5 text-right text-xs text-muted-foreground tabular-nums">
                  {row.dur_real !== null ? anosDesdeSemestres(row.dur_real) : "Sin dato"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filas.map((row, idx) => (
          <Card
            key={`${row.slug}-${row.tipo}`}
            className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    #{idx + 1} · {TIPO_ETIQUETAS[row.tipo].corto} · {row.area}
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold text-foreground">
                    <Link
                      href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                      className="hover:text-blue-700 hover:underline"
                    >
                      {row.nombre}
                    </Link>
                  </h3>
                </div>
                <span className="shrink-0 text-sm font-semibold text-blue-700 tabular-nums">
                  {row.textoMetrica}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/70 pt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Sueldo 4.º</div>
                  <div className="font-semibold text-foreground tabular-nums">
                    {pesos(row.ing4)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Empleo 1.º</div>
                  <div className="font-semibold text-foreground tabular-nums">
                    {porcentaje(row.emp1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Arancel</div>
                  <div className="font-medium text-foreground tabular-nums">
                    {pesos(row.arancel_med)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <DatosViewTracker evento="datos_preset_view" params={{ preset: slug }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-4">
        <MigasDatos migas={migas} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-3xl space-y-2.5">
            <Badge
              variant="secondary"
              className="h-auto rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              Edición {meta.edicion} · Actualizado el {fechaCorta(meta.fetched_at)}
            </Badge>
            <h1 className="h1-datos text-foreground">{def.h1}</h1>
            <p className="text-base leading-relaxed text-muted-foreground">{def.descriptionSeo}</p>
          </header>

          <Link
            href={`/datos/carreras${def.queryFiltros}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 shrink-0 gap-2 rounded-lg bg-card px-3.5 text-xs font-medium"
            )}
          >
            <SlidersHorizontal className="size-3.5 text-blue-700" aria-hidden="true" />
            Personalizar filtros
          </Link>
        </div>
      </div>

      <section aria-label="Tabla de resultados">
        {esMejorPagadas ? (
          <Tabs defaultValue="u" className="space-y-4">
            <TabsList className="h-9 bg-muted p-1">
              <TabsTrigger value="u" className="px-3 text-xs font-medium sm:text-sm">
                Universidades ({filasU.length})
              </TabsTrigger>
              <TabsTrigger value="ip" className="px-3 text-xs font-medium sm:text-sm">
                Institutos (IP) ({filasIp.length})
              </TabsTrigger>
              <TabsTrigger value="cft" className="px-3 text-xs font-medium sm:text-sm">
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

      <EnResumen
        frases={resumen}
        fuente={`Fuente: www.mifuturo.cl (SIES, Mineduc), edición ${meta.edicion}.`}
      />

      <Card
        aria-labelledby="metodologia-preset-titulo"
        className="prose-datos gap-3 rounded-xl border border-border bg-card py-6 shadow-xs ring-0"
      >
        <CardHeader className="px-6 pb-0">
          <CardTitle id="metodologia-preset-titulo" className="text-lg font-semibold text-foreground">
            Cómo se construye este ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-foreground/85">
          {def.metodologia.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </CardContent>
      </Card>

      <section aria-labelledby="otras-vistas-titulo" className="space-y-3">
        <h2 id="otras-vistas-titulo" className="text-base font-semibold text-foreground">
          Otras listas recomendadas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otrosPresets.map((otro) => {
            const p = PRESETS_MAP[otro];
            return (
              <Link
                key={otro}
                href={`/datos/carreras/${otro}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-xs transition-all hover:border-slate-300 hover:text-blue-700"
              >
                <span>{p.tituloCorto}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
