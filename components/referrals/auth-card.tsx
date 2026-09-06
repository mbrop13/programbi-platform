"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validatePassword, isBreachedPassword } from "@/lib/security/password";
import { honeypotStyle } from "@/lib/antibot";
import { persistRegistrationSource } from "@/lib/registration-source";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReferidosNav } from "./referidos-nav";
import { REFERRER_TYPES } from "@/lib/referrals/constants";
import { REFERRER_TYPE_LABELS } from "@/lib/referrals/status";

const NEXT = "/referidos/app";

export function ReferidosLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || NEXT;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Credenciales inválidas."
            : authError.message
        );
        return;
      }
      router.push(next.startsWith("/referidos") ? next : NEXT);
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Entrar al panel" subtitle="Programa de referidos ProgramBI">
      {error ? <ErrorBox>{error}</ErrorBox> : null}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
          />
        </Field>
        <Field label="Contraseña" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 text-muted-foreground"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <Button type="submit" disabled={loading} className="h-10 w-full">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Iniciar sesión"}
        </Button>
      </form>
      <GoogleButton next={next} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/referidos/registro" className="text-foreground underline-offset-4 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}

export function ReferidosRegistro() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "other" as (typeof REFERRER_TYPES)[number],
    password: "",
    confirm: "",
    accepts: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (honeypot.trim()) {
      router.push("/referidos/login");
      return;
    }
    if (Date.now() - loadedAt.current < 2000) {
      setError("Espera un segundo e intenta de nuevo.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const pw = validatePassword(form.password);
    if (!pw.ok) {
      setError(pw.error!);
      return;
    }
    if (!form.accepts) {
      setError("Debes aceptar las reglas del programa.");
      return;
    }
    setLoading(true);
    if (await isBreachedPassword(form.password)) {
      setError("Esta contraseña aparece en filtraciones. Elige otra.");
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      persistRegistrationSource("/referidos/registro");
      const { data, error: signErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            whatsapp: form.phone,
            registration_source: "/referidos/registro",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(NEXT)}&reg_source=${encodeURIComponent("/referidos/registro")}`,
        },
      });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      if (data.session) {
        const res = await fetch("/api/referrals/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            type: form.type,
            acceptsTerms: true,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || "Cuenta creada, pero no se pudo activar el perfil de referidor.");
          return;
        }
        router.push(NEXT);
        router.refresh();
        return;
      }
      setInfo("Revisa tu correo y confirma el email para entrar al panel.");
    } catch {
      setError("No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Crear cuenta de referidor" subtitle="Intros calificadas. 15% al cobro del Pack.">
      {error ? <ErrorBox>{error}</ErrorBox> : null}
      {info ? (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          {info}
        </div>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
        <div style={honeypotStyle} aria-hidden>
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>
        <Field label="Nombre" htmlFor="name">
          <Input
            id="name"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-10"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-10"
          />
        </Field>
        <Field label="WhatsApp" htmlFor="phone">
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+56 9 …"
            className="h-10"
          />
        </Field>
        <Field label="Te conocemos como" htmlFor="type">
          <select
            id="type"
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
          >
            {REFERRER_TYPES.map((t) => (
              <option key={t} value={t}>
                {REFERRER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contraseña" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 text-muted-foreground"
              onClick={() => setShow((s) => !s)}
              aria-label="Mostrar contraseña"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Mín. 12 caracteres, mayúscula, número y símbolo.</p>
        </Field>
        <Field label="Confirmar contraseña" htmlFor="confirm">
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="h-10"
          />
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.accepts}
            onChange={(e) => setForm({ ...form, accepts: e.target.checked })}
          />
          <span>
            Acepto las{" "}
            <Link href="/referidos/terminos" className="underline-offset-4 hover:underline">
              reglas del 15%, clawback 60 días y calificación manual
            </Link>
            .
          </span>
        </label>
        <Button type="submit" disabled={loading} className="h-10 w-full">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Crear cuenta"}
        </Button>
      </form>
      <GoogleButton next={NEXT} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/referidos/login" className="text-foreground underline-offset-4 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleButton({ next }: { next: string }) {
  const [err, setErr] = useState<string | null>(null);
  const go = async () => {
    setErr(null);
    const supabase = createClient();
    persistRegistrationSource("/referidos/registro");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&reg_source=${encodeURIComponent("/referidos")}`,
      },
    });
    if (error) setErr(error.message);
  };
  return (
    <>
      <div className="relative my-6 text-center text-xs text-muted-foreground">
        <span className="bg-card px-2 relative z-10">o</span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
      </div>
      <Button type="button" variant="outline" className="h-10 w-full" onClick={go}>
        Continuar con Google
      </Button>
      {err ? <p className="mt-2 text-center text-xs text-destructive">{err}</p> : null}
    </>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <ReferidosNav compact />
      <div className="mx-auto flex max-w-md flex-col px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {children}
    </div>
  );
}
