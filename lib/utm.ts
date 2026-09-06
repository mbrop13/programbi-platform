const STORAGE_KEY = "pb_first_touch_utm";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type PageAttribution = {
  landing_path: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function pick(params: URLSearchParams, key: string): string | undefined {
  const v = params.get(key)?.trim();
  return v ? v.slice(0, 120) : undefined;
}

function fromSearch(search: string, path: string): PageAttribution {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    landing_path: path.slice(0, 256) || "/",
    utm_source: pick(params, "utm_source"),
    utm_medium: pick(params, "utm_medium"),
    utm_campaign: pick(params, "utm_campaign"),
    utm_content: pick(params, "utm_content"),
    utm_term: pick(params, "utm_term"),
  };
}

function hasUtm(a: PageAttribution): boolean {
  return Boolean(a.utm_source || a.utm_medium || a.utm_campaign || a.utm_content || a.utm_term);
}

/** First-touch UTM: se guarda en sessionStorage y sobrevive navegación interna. */
export function captureAndReadAttribution(): PageAttribution {
  if (typeof window === "undefined") return { landing_path: "/" };

  const current = fromSearch(window.location.search, window.location.pathname);

  try {
    if (hasUtm(current)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    }
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as PageAttribution;
      return { ...stored, landing_path: current.landing_path };
    }
  } catch {
    /* sessionStorage puede fallar en iframe / modo estricto */
  }

  return current;
}

export function formatAttributionLine(a: PageAttribution): string {
  const bits = [
    a.landing_path ? `page=${a.landing_path}` : null,
    ...UTM_KEYS.map((k) => (a[k] ? `${k}=${a[k]}` : null)),
  ].filter((v): v is string => Boolean(v));
  return bits.length ? `Atribución: ${bits.join(" | ")}` : "";
}
