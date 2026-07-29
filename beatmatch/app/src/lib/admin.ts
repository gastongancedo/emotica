/**
 * Sin ADMIN_KEY en producción no hay acceso a moderación.
 *
 * Antes esto caía al default "beatmatch", así que un deploy sin la
 * variable dejaba el panel abierto con una clave adivinable. Devolver
 * null es "nadie entra", distinto de "entra cualquiera".
 */
export function claveAdmin(): string | null {
  const clave = process.env.ADMIN_KEY;
  if (clave && clave.length > 0) return clave;
  if (process.env.NODE_ENV === "production") return null;
  return "beatmatch"; // solo desarrollo local
}

export function claveAdminValida(recibida: string): boolean {
  const esperada = claveAdmin();
  return esperada !== null && recibida === esperada;
}
