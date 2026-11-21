import { Image as ImageIcon } from "lucide-react";
import type { CapturaGuia } from "@/lib/guias/paso-a-paso-tipos";

export default function CapturaPendiente({ captura }: { captura: CapturaGuia }) {
  return (
    <figure className="my-6" data-capture-id={captura.id}>
      <div
        data-pending-image="true"
        role="img"
        aria-label={captura.alt}
        className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-wash/80 px-6 py-8 text-center"
      >
        <ImageIcon size={24} className="mb-2 text-faint" aria-hidden />
        <p className="max-w-[46ch] text-sm font-medium text-mute">
          Captura pendiente: {captura.caption}
        </p>
      </div>
      <figcaption className="mt-2 px-1 text-xs leading-relaxed text-mute">
        {captura.caption}
      </figcaption>
    </figure>
  );
}
