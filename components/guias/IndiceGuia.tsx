/**
 * Índice de la guía: fijo a la izquierda en escritorio y desplegable en mobile.
 * Solo CSS y anclas: sin scroll-spy ni JS, para no tocar el LCP.
 */
type Item = { id: string; texto: string };

function Lista({ items }: { items: Item[] }) {
  return (
    <ol className="space-y-2 border-l border-line pl-4">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="block text-[13px] leading-snug text-mute no-underline transition-colors hover:text-ink"
          >
            {item.texto}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Versión escritorio: columna fija. */
export function IndiceGuiaNav({ items }: { items: Item[] }) {
  if (items.length < 3) return null;

  return (
    <nav
      aria-label="En esta guía"
      data-testid="indice-guia"
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">En esta guía</p>
      <div className="mt-3">
        <Lista items={items} />
      </div>
    </nav>
  );
}

/** Versión mobile: bloque desplegable arriba del cuerpo. */
export function IndiceGuiaMobile({ items }: { items: Item[] }) {
  if (items.length < 3) return null;

  return (
    <details className="mt-6 rounded-2xl border border-line bg-paper px-4 py-3 lg:hidden">
      <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        En esta guía
      </summary>
      <div className="mt-3">
        <Lista items={items} />
      </div>
    </details>
  );
}
