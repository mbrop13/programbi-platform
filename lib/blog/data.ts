import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Lecturas públicas de blog y newsletter a prueba de fallos de Supabase.
 *
 * Las lecturas de artículos lanzan ante fallos temporales: ISR conserva así
 * la última página válida, en lugar de guardar una lista vacía o un noindex.
 * Las categorías (opcionales) sí pueden degradar a una lista vacía.
 *
 * Cada consulta lleva `AbortSignal.timeout` + un tope duro propio para que un
 * cuelgue de red no bloquee el render (causa del 500 intermitente del 9-nov en
 * /blog y /newsletter).
 */

const TIEMPO_MAXIMO_MS = 10_000;

const CAMPOS_LISTA =
  "id, title, slug, excerpt, cover_image, category, tags, author_name, author_avatar, is_featured, reading_time_min, published_at, created_at";

export type ArticuloLista = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author_name?: string | null;
  author_avatar?: string | null;
  is_featured?: boolean | null;
  reading_time_min?: number | null;
  published_at: string;
  created_at: string;
};

export type Articulo = ArticuloLista & {
  content?: string | null;
  updated_at?: string | null;
};

export type CategoriaNewsletter = {
  id?: string;
  name?: string;
  slug?: string;
  parent_id?: string | null;
  sort_order?: number | null;
  subcategories?: CategoriaNewsletter[];
  [clave: string]: unknown;
};

export type ResultadoArticulo =
  | { estado: "ok"; articulo: Articulo }
  | { estado: "no_encontrado" };

const fallosRegistrados = new Set<string>();

function registrarFallo(operacion: string, error: unknown) {
  if (fallosRegistrados.has(operacion)) return;
  fallosRegistrados.add(operacion);
  console.error(
    `[blog] Falló la lectura de Supabase en ${operacion}.`,
    error
  );
}

function conLimiteDeTiempo<T>(consulta: PromiseLike<T>, operacion: string): Promise<T> {
  return new Promise<T>((resolver, rechazar) => {
    const temporizador = setTimeout(() => {
      rechazar(new Error(`${operacion}: Supabase no respondió en ${TIEMPO_MAXIMO_MS} ms`));
    }, TIEMPO_MAXIMO_MS + 500);

    Promise.resolve(consulta).then(
      (valor) => {
        clearTimeout(temporizador);
        resolver(valor);
      },
      (error) => {
        clearTimeout(temporizador);
        rechazar(error);
      }
    );
  });
}

/**
 * El builder de Supabase infiere `unknown` cuando el cliente no está tipado;
 * esta envoltura fija la forma de la respuesta que consumen los helpers.
 */
async function leerConLimite<T extends { error: unknown }>(
  consulta: () => PromiseLike<unknown>,
  operacion: string
): Promise<T> {
  // A fresh builder gives the retry its own AbortSignal. Never retry writes.
  for (let intento = 0; ; intento++) {
    try {
      const resultado = (await conLimiteDeTiempo(consulta(), operacion)) as T;
      if (!resultado.error || intento === 1) return resultado;
    } catch (error) {
      if (intento === 1) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

function senalDeTimeout() {
  return AbortSignal.timeout(TIEMPO_MAXIMO_MS);
}

/**
 * Artículos publicados, del más nuevo al más viejo.
 * Un error interrumpe la regeneración; no sustituye el índice por una lista vacía.
 */
export const getPublishedArticles = cache(
  async (category?: string): Promise<ArticuloLista[]> => {
    try {
      const db = createAdminClient();
      const { data, error } = await leerConLimite<{
        data: ArticuloLista[] | null;
        error: unknown;
      }>(
        () => {
          let consulta = db.from("newsletter_articles").select(CAMPOS_LISTA).eq("status", "published");
          if (category && category !== "all") consulta = consulta.eq("category", category);
          return consulta.order("published_at", { ascending: false }).retry(false).abortSignal(senalDeTimeout());
        },
        "getPublishedArticles"
      );

      if (error) {
        throw new Error("No se pudieron cargar los artículos publicados", { cause: error });
      }

      return (data ?? []) as ArticuloLista[];
    } catch (error) {
      registrarFallo("getPublishedArticles", error);
      throw error;
    }
  }
);

/**
 * Artículo por slug. Solo una lectura correcta sin fila significa «no existe».
 * Un fallo temporal se propaga para conservar el contenido anterior en ISR.
 */
export const getArticuloPorSlug = cache(
  async (slug: string): Promise<ResultadoArticulo> => {
    try {
      const db = createAdminClient();
      const { data, error } = await leerConLimite<{
        data: Articulo | null;
        error: unknown;
      }>(
        () => db
          .from("newsletter_articles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .abortSignal(senalDeTimeout())
          .retry(false)
          .maybeSingle(),
        "getArticleBySlug"
      );

      if (error) {
        throw new Error("No se pudo cargar el artículo", { cause: error });
      }

      if (!data) return { estado: "no_encontrado" };

      return { estado: "ok", articulo: data as Articulo };
    } catch (error) {
      registrarFallo("getArticleBySlug", error);
      throw error;
    }
  }
);

/**
 * Categorías activas de newsletter con sus subcategorías.
 * Devuelve `[]` si Supabase falla; si solo falla la consulta de hijas,
 * devuelve las categorías padre sin subcategorías.
 */
export const getNewsletterCategories = cache(
  async (): Promise<CategoriaNewsletter[]> => {
    try {
      const db = createAdminClient();
      const { data, error } = await leerConLimite<{
        data: CategoriaNewsletter[] | null;
        error: unknown;
      }>(
        () => db
          .from("newsletter_categories")
          .select("*")
          .eq("is_active", true)
          .is("parent_id", null)
          .order("sort_order", { ascending: true })
          .retry(false)
          .abortSignal(senalDeTimeout()),
        "getNewsletterCategories"
      );

      if (error) {
        registrarFallo("getNewsletterCategories", error);
        return [];
      }

      const padres = (data ?? []) as CategoriaNewsletter[];
      const idsPadre = padres
        .map((categoria) => categoria.id)
        .filter((id): id is string => typeof id === "string");

      if (idsPadre.length === 0) {
        return padres.map((categoria) => ({ ...categoria, subcategories: [] }));
      }

      try {
        const { data: hijas, error: errorHijas } = await leerConLimite<{
          data: CategoriaNewsletter[] | null;
          error: unknown;
        }>(
          () => db
            .from("newsletter_categories")
            .select("*")
            .eq("is_active", true)
            .in("parent_id", idsPadre)
            .order("sort_order", { ascending: true })
            .retry(false)
            .abortSignal(senalDeTimeout()),
          "getNewsletterSubcategories"
        );

        if (errorHijas) {
          registrarFallo("getNewsletterSubcategories", errorHijas);
          return padres.map((categoria) => ({ ...categoria, subcategories: [] }));
        }

        const subcategorias = (hijas ?? []) as CategoriaNewsletter[];
        return padres.map((categoria) => ({
          ...categoria,
          subcategories: subcategorias.filter((sub) => sub.parent_id === categoria.id),
        }));
      } catch (error) {
        registrarFallo("getNewsletterSubcategories", error);
        return padres.map((categoria) => ({ ...categoria, subcategories: [] }));
      }
    } catch (error) {
      registrarFallo("getNewsletterCategories", error);
      return [];
    }
  }
);
