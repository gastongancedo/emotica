export type EstadoDj = "pendiente" | "publicado" | "rechazado" | "pausado";

export type EstadoContacto = "enviado" | "respondido" | "concretado" | "caido";

export type TipoEvento =
  | "boliche"
  | "fiesta"
  | "corporativo"
  | "casamiento"
  | "bar"
  | "otro";

export interface Dj {
  id: string;
  slug: string;
  nombre_artistico: string;
  /** Privado. Nunca se expone en el perfil público. */
  email: string;
  ciudad: string;
  bio: string;
  estilos: string[];
  cache_min: number | null;
  cache_max: number | null;
  instagram: string | null;
  set_url: string | null;
  foto_url: string | null;
  rider: string | null;
  estado: EstadoDj;
  /** Permite editar el perfil sin cuenta. Nunca se expone en listados. */
  edit_token: string;
  created_at: string;
  updated_at: string;
}

/** Lo que sale al mundo. Sin email ni token. */
export type DjPublico = Omit<Dj, "email" | "edit_token">;

export interface Contacto {
  id: string;
  dj_id: string;
  productora_nombre: string;
  productora_email: string;
  fecha_evento: string | null;
  tipo_evento: TipoEvento;
  presupuesto: number | null;
  mensaje: string;
  estado: EstadoContacto;
  created_at: string;
}

export interface FiltrosBusqueda {
  estilo?: string;
  ciudad?: string;
  cacheMax?: number;
  q?: string;
}

export interface NuevoDj {
  nombre_artistico: string;
  email: string;
  ciudad: string;
  bio: string;
  estilos: string[];
  cache_min: number | null;
  cache_max: number | null;
  instagram: string | null;
  set_url: string | null;
  rider: string | null;
}

export interface NuevoContacto {
  dj_id: string;
  productora_nombre: string;
  productora_email: string;
  fecha_evento: string | null;
  tipo_evento: TipoEvento;
  presupuesto: number | null;
  mensaje: string;
}

export function aPublico(dj: Dj): DjPublico {
  const { email: _email, edit_token: _token, ...resto } = dj;
  return resto;
}
