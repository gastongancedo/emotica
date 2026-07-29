import { CIUDADES, ESTILOS, TIPOS_EVENTO } from "./taxonomia";
import type { NuevoContacto, NuevoDj, TipoEvento } from "./types";

export type Errores = Record<string, string>;

export interface Resultado<T> {
  ok: boolean;
  datos?: T;
  errores: Errores;
}

const texto = (v: FormDataEntryValue | null): string =>
  typeof v === "string" ? v.trim() : "";

function numeroOpcional(v: FormDataEntryValue | null): number | null {
  const s = texto(v).replace(/[.\s$]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

function urlValida(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarDj(fd: FormData): Resultado<NuevoDj> {
  const e: Errores = {};

  const nombre = texto(fd.get("nombre_artistico"));
  if (nombre.length < 2) e.nombre_artistico = "Poné tu nombre artístico.";
  else if (nombre.length > 60) e.nombre_artistico = "Máximo 60 caracteres.";

  const email = texto(fd.get("email")).toLowerCase();
  if (!EMAIL.test(email)) e.email = "Revisá el mail, no parece válido.";

  const ciudad = texto(fd.get("ciudad"));
  if (!CIUDADES.includes(ciudad as (typeof CIUDADES)[number]))
    e.ciudad = "Elegí una ciudad de la lista.";

  const bio = texto(fd.get("bio"));
  if (bio.length > 400) e.bio = "Máximo 400 caracteres.";

  const estilos = fd
    .getAll("estilos")
    .map((v) => texto(v))
    .filter((s) => ESTILOS.includes(s as (typeof ESTILOS)[number]));
  if (estilos.length === 0) e.estilos = "Elegí al menos un estilo.";
  else if (estilos.length > 3) e.estilos = "Máximo 3 estilos.";

  const cache_min = numeroOpcional(fd.get("cache_min"));
  const cache_max = numeroOpcional(fd.get("cache_max"));
  if (cache_min != null && cache_max != null && cache_min > cache_max)
    e.cache_min = "El mínimo no puede ser mayor que el máximo.";

  const set_url_raw = texto(fd.get("set_url"));
  if (!set_url_raw) e.set_url = "Poné el link a un set. Es lo que te presenta.";
  else if (!urlValida(set_url_raw))
    e.set_url = "El link tiene que empezar con https://";

  const instagram = texto(fd.get("instagram")).replace(/^@/, "") || null;
  const rider = texto(fd.get("rider")) || null;

  if (Object.keys(e).length > 0) return { ok: false, errores: e };

  return {
    ok: true,
    errores: {},
    datos: {
      nombre_artistico: nombre,
      email,
      ciudad,
      bio,
      estilos,
      cache_min,
      cache_max,
      instagram,
      set_url: set_url_raw,
      rider,
    },
  };
}

export function validarContacto(
  fd: FormData,
  djId: string,
): Resultado<NuevoContacto> {
  const e: Errores = {};

  const nombre = texto(fd.get("productora_nombre"));
  if (nombre.length < 2) e.productora_nombre = "Decinos quién sos.";

  const email = texto(fd.get("productora_email")).toLowerCase();
  if (!EMAIL.test(email)) e.productora_email = "Revisá el mail de contacto.";

  const mensaje = texto(fd.get("mensaje"));
  if (mensaje.length < 10) e.mensaje = "Contale un poco del evento.";
  else if (mensaje.length > 1000) e.mensaje = "Máximo 1000 caracteres.";

  const tipoRaw = texto(fd.get("tipo_evento"));
  const tipo_evento = (TIPOS_EVENTO.some((t) => t.value === tipoRaw)
    ? tipoRaw
    : "otro") as TipoEvento;

  const fechaRaw = texto(fd.get("fecha_evento"));
  let fecha_evento: string | null = null;
  if (fechaRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaRaw) || Number.isNaN(Date.parse(fechaRaw))) {
      e.fecha_evento = "Fecha inválida.";
    } else {
      fecha_evento = fechaRaw;
    }
  }

  if (Object.keys(e).length > 0) return { ok: false, errores: e };

  return {
    ok: true,
    errores: {},
    datos: {
      dj_id: djId,
      productora_nombre: nombre,
      productora_email: email,
      fecha_evento,
      tipo_evento,
      presupuesto: numeroOpcional(fd.get("presupuesto")),
      mensaje,
    },
  };
}
