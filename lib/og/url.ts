type OgImageParams = {
  kicker?: string;
  title: string;
  description?: string;
  tags?: string[];
  accent?: string;
  path?: string;
};

/** URL de tarjeta OG dinámica (app/og/route.tsx). */
export function ogImageUrl(opts: OgImageParams): string {
  const params = new URLSearchParams();
  params.set("title", opts.title.slice(0, 140));
  if (opts.kicker) params.set("kicker", opts.kicker.slice(0, 80));
  if (opts.description) params.set("description", opts.description.slice(0, 180));
  if (opts.tags?.length) params.set("tags", opts.tags.slice(0, 4).join("|"));
  if (opts.path) params.set("path", opts.path);
  if (opts.accent) params.set("accent", opts.accent);
  return `/og?${params.toString()}`;
}
