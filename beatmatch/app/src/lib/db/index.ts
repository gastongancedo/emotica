import "server-only";

import type {
  Contacto,
  Dj,
  EstadoContacto,
  EstadoDj,
  FiltrosBusqueda,
  NuevoContacto,
  NuevoDj,
} from "@/lib/types";

/**
 * Contrato del almacén. Hay dos implementaciones:
 *
 *  - `file`     — JSON en disco. Arranca sin configurar nada, para
 *                 desarrollo y para mostrar la app. No sirve en producción:
 *                 en Vercel el filesystem es de solo lectura.
 *  - `supabase` — Postgres real. Se activa sola en cuanto están las
 *                 variables de entorno.
 *
 * La app entera habla con esta interfaz y no sabe cuál está atrás, así que
 * conectar Supabase no toca ni una página.
 */
export interface Store {
  buscarDjs(filtros: FiltrosBusqueda): Promise<Dj[]>;
  obtenerDjPorSlug(slug: string): Promise<Dj | null>;
  obtenerDjPorId(id: string): Promise<Dj | null>;
  crearDj(datos: NuevoDj): Promise<Dj>;
  actualizarDj(id: string, datos: Partial<NuevoDj>): Promise<Dj>;
  cambiarEstadoDj(id: string, estado: EstadoDj): Promise<Dj>;
  listarDjs(estado?: EstadoDj): Promise<Dj[]>;
  slugDisponible(slug: string): Promise<boolean>;

  crearContacto(datos: NuevoContacto): Promise<Contacto>;
  listarContactos(djId?: string): Promise<Contacto[]>;
  cambiarEstadoContacto(id: string, estado: EstadoContacto): Promise<Contacto>;
  contarContactosRecientes(email: string, desdeISO: string): Promise<number>;
}

export type NombreAdaptador = "file" | "supabase";

export function adaptadorConfigurado(): NombreAdaptador {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? "supabase" : "file";
}

/**
 * El adaptador de archivo NO sirve en producción: en Vercel el filesystem
 * es de solo lectura y efímero. Sin este corte la app arrancaría, aceptaría
 * perfiles y los perdería en silencio — que es peor que no arrancar.
 *
 * Se evalúa en cada request, no al importar, para que `next build` no
 * necesite las credenciales.
 */
function verificarAdaptador(cual: NombreAdaptador): void {
  // Override explícito para probar el build de producción en local, donde
  // el filesystem sí se puede escribir. Un deploy nunca lo va a tener
  // seteado por accidente.
  if (process.env.BEATMATCH_ALMACEN === "archivo") return;

  if (cual === "file" && process.env.NODE_ENV === "production") {
    throw new Error(
      "Beatmatch no tiene base de datos configurada y está en producción. " +
        "El almacén de archivo perdería todos los datos porque el filesystem " +
        "es de solo lectura. Definí NEXT_PUBLIC_SUPABASE_URL y " +
        "SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del proyecto.",
    );
  }
}

let cache: Promise<Store> | null = null;

export function db(): Promise<Store> {
  if (!cache) {
    const cual = adaptadorConfigurado();
    verificarAdaptador(cual);
    cache =
      cual === "supabase"
        ? import("./supabase").then((m) => m.crearStoreSupabase())
        : import("./file").then((m) => m.crearStoreArchivo());
  }
  return cache;
}

// ── helpers compartidos por los dos adaptadores ────────────────────────

export function generarSlug(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function slugUnico(
  base: string,
  disponible: (s: string) => Promise<boolean>,
): Promise<string> {
  const raiz = generarSlug(base) || "dj";
  if (await disponible(raiz)) return raiz;
  for (let i = 2; i < 100; i++) {
    const intento = `${raiz}-${i}`;
    if (await disponible(intento)) return intento;
  }
  return `${raiz}-${Date.now().toString(36)}`;
}

export function nuevoId(): string {
  return crypto.randomUUID();
}

export function nuevoToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Filtrado compartido: el adaptador de archivo lo usa tal cual y el de
 *  Supabase replica la misma semántica en SQL. */
export function aplicaFiltros(dj: Dj, f: FiltrosBusqueda): boolean {
  if (f.estilo && !dj.estilos.includes(f.estilo)) return false;
  if (f.ciudad && dj.ciudad !== f.ciudad) return false;
  if (f.cacheMax != null) {
    // Entra si su piso está dentro del presupuesto. Un DJ sin caché
    // cargado no se descarta: se muestra igual, porque excluirlo
    // castigaría justo a los perfiles nuevos que queremos sumar.
    if (dj.cache_min != null && dj.cache_min > f.cacheMax) return false;
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    const heno = [dj.nombre_artistico, dj.bio, dj.ciudad, ...dj.estilos]
      .join(" ")
      .toLowerCase();
    if (!heno.includes(q)) return false;
  }
  return true;
}
