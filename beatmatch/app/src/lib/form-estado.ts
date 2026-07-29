import type { Errores } from "./validar";

/**
 * Vive fuera de `actions.ts` a propósito: un archivo con "use server" solo
 * puede exportar funciones async, así que el tipo y la constante van acá.
 */
export interface EstadoForm {
  ok: boolean;
  errores: Errores;
  /** Mensaje general, para errores que no son de un campo puntual. */
  mensaje?: string;
  /** Link de edición que se le muestra al DJ una sola vez, al crear. */
  editUrl?: string;
  slug?: string;
}

export const ESTADO_INICIAL: EstadoForm = { ok: false, errores: {} };
