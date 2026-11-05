"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import {
  AYUDA_FORMATO_CODIGO,
  codigoDesdeEntrada,
  esCodigoCertificadoValido,
} from "@/lib/certificados/codigo";

/**
 * Formulario de verificación. Acepta el código o una URL completa del
 * certificado pegada desde el portapapeles y navega a la ficha pública.
 */
export default function FormularioVerificacion() {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [error, setError] = useState<string | null>(null);

  function manejarEnvio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const codigo = codigoDesdeEntrada(valor);
    if (!esCodigoCertificadoValido(codigo)) {
      setError(AYUDA_FORMATO_CODIGO);
      return;
    }
    setError(null);
    router.push(`/certificado/${encodeURIComponent(codigo)}`);
  }

  return (
    <form
      onSubmit={manejarEnvio}
      noValidate
      className="mt-8 rounded-2xl border border-line bg-paper p-5 shadow-[0_20px_60px_-50px_rgba(23,23,22,0.5)] sm:p-6"
    >
      <label htmlFor="codigo-certificado" className="block text-sm font-semibold text-ink">
        Código de validación
      </label>
      <p id="codigo-ayuda" className="mt-1 text-xs leading-relaxed text-mute">
        Está impreso al pie del certificado, junto a la fecha de emisión.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="codigo-certificado"
          name="codigo"
          type="text"
          value={valor}
          onChange={(event) => {
            setValor(event.target.value);
            if (error) setError(null);
          }}
          placeholder="PBI-DATA-93K29"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="go"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "codigo-ayuda codigo-error" : "codigo-ayuda"}
          className="h-12 w-full rounded-xl border border-line-strong bg-canvas px-4 font-mono text-base uppercase tracking-wide text-ink outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-faint focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/15 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          Verificar
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {error ? (
        <p id="codigo-error" role="alert" className="mt-3 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
