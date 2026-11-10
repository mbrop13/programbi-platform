// Traducción de errores de Supabase Auth a mensajes en español claro.
//
// Lo usan la página /registro y el modal de auth. El `reason` es un código corto
// que viaja a GA4 (registro_step → signup_error) y NUNCA incluye datos
// personales: sirve para saber si la gente choca con "ya registrado", con la
// regla de contraseña o con la red, sin guardar correos.
//
// Sin imports: seguro en cliente y servidor, y sin dependencias de Supabase.

export type AuthErrorReason =
  | "ya_registrado"
  | "email_invalido"
  | "password_corta"
  | "rate_limit"
  | "red"
  | "credenciales"
  | "no_confirmado"
  | "otro";

export interface AuthErrorMensaje {
  mensaje: string;
  reason: AuthErrorReason;
}

/** Mensaje por defecto: el usuario siempre tiene una salida (WhatsApp). */
export const MENSAJE_AUTH_POR_DEFECTO =
  "No pudimos crear tu cuenta. Intenta de nuevo o escríbenos por WhatsApp.";

type Regla = {
  reason: AuthErrorReason;
  mensaje: string;
  test: RegExp;
};

/**
 * Orden importante: "Email rate limit exceeded" debe caer en rate_limit antes
 * que en cualquier regla de email, y "Invalid login credentials" (login) no debe
 * confundirse con "Invalid email".
 */
const REGLAS: Regla[] = [
  {
    reason: "rate_limit",
    mensaje:
      "Hicimos demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.",
    test: /rate limit|too many|over_email_send_rate_limit|only request this after|security purposes|after \d+ seconds|demasiados intentos|demasiadas solicitudes|429/,
  },
  {
    reason: "no_confirmado",
    mensaje:
      "Falta confirmar tu correo. Revisa tu bandeja de entrada (y Spam o Promociones) o pide que te lo reenviemos.",
    test: /email not confirmed|email_not_confirmed|not confirmed|confirm your email|correo no confirmado|confirma tu correo/,
  },
  {
    reason: "ya_registrado",
    mensaje: "Este correo ya está registrado. Inicia sesión.",
    test: /already registered|already been registered|user_already_exists|user already exists|email already|email_exists|already exists|ya (esta|fue) registrad|correo ya registrado/,
  },
  {
    reason: "credenciales",
    mensaje:
      "El correo o la contraseña no coinciden. Revísalos o recupera tu contraseña.",
    test: /invalid login credentials|invalid_credentials|invalid grant|invalid password|credenciales invalidas|usuario o contrasena incorrect/,
  },
  {
    reason: "password_corta",
    mensaje: "La contraseña debe tener al menos 6 caracteres.",
    test: /weak_password|weak password|password.*(at least|too short|too weak|strength|minimum)|password should|contrasena.*(corta|debil|al menos|minimo)|la contrasena debe/,
  },
  {
    reason: "email_invalido",
    mensaje:
      "Ese correo no parece válido. Revísalo (por ejemplo, nombre@empresa.cl).",
    test: /invalid email|invalid_email|email_address_invalid|email address (is )?invalid|email format|invalid format|unable to validate email|correo electronico invalido|correo invalido/,
  },
  {
    reason: "red",
    mensaje:
      "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo en unos segundos.",
    test: /fetch failed|failed to fetch|network|load failed|offline|timeout|timed out|econn|enotfound|socket|no se pudo conectar|error de red|sin conexion/,
  },
  {
    reason: "otro",
    mensaje:
      "El registro está deshabilitado por ahora. Escríbenos por WhatsApp y te ayudamos.",
    test: /signups? not allowed|signups?_disabled|signup.*(disabled|not allowed)|registro.*(deshabilitado|no permitido)/,
  },
];

/** Minúsculas y sin tildes, para que los patrones no dependan del idioma del error. */
function normalizar(raw: string | null | undefined): string {
  const text =
    typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Traduce un mensaje/código de error de Supabase a `{ mensaje, reason }`.
 * Un valor vacío o desconocido devuelve el mensaje por defecto con `reason: "otro"`.
 */
export function mensajeErrorAuth(
  raw: string | null | undefined
): AuthErrorMensaje {
  const texto = normalizar(raw);
  if (!texto) {
    return { mensaje: MENSAJE_AUTH_POR_DEFECTO, reason: "otro" };
  }

  for (const regla of REGLAS) {
    if (regla.test.test(texto)) {
      return { mensaje: regla.mensaje, reason: regla.reason };
    }
  }

  return { mensaje: MENSAJE_AUTH_POR_DEFECTO, reason: "otro" };
}
