import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  Contacto,
  Dj,
  EstadoContacto,
  EstadoDj,
  FiltrosBusqueda,
  NuevoContacto,
  NuevoDj,
} from "@/lib/types";
import { generarSlug, nuevoToken, slugUnico, type Store } from "./index";

function cliente(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  // Service role: este cliente solo vive en el servidor y saltea RLS.
  // Nunca debe importarse desde un componente de cliente.
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function alzar(error: { message: string } | null, contexto: string): void {
  if (error) throw new Error(`${contexto}: ${error.message}`);
}

export function crearStoreSupabase(): Store {
  const sb = cliente();

  const disponible = async (slug: string) => {
    const { data, error } = await sb
      .from("djs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    alzar(error, "verificando slug");
    return !data;
  };

  return {
    async buscarDjs(f: FiltrosBusqueda) {
      let q = sb.from("djs").select("*").eq("estado", "publicado");

      if (f.estilo) q = q.contains("estilos", [f.estilo]);
      if (f.ciudad) q = q.eq("ciudad", f.ciudad);
      // Mismo criterio que el adaptador de archivo: los perfiles sin caché
      // cargado no se descartan del filtro por presupuesto.
      if (f.cacheMax != null) q = q.or(`cache_min.is.null,cache_min.lte.${f.cacheMax}`);
      if (f.q) q = q.or(`nombre_artistico.ilike.%${f.q}%,bio.ilike.%${f.q}%`);

      const { data, error } = await q.order("created_at", { ascending: false });
      alzar(error, "buscando DJs");
      return (data ?? []) as Dj[];
    },

    async obtenerDjPorSlug(slug: string) {
      const { data, error } = await sb
        .from("djs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      alzar(error, "obteniendo perfil");
      return (data as Dj) ?? null;
    },

    async obtenerDjPorId(id: string) {
      const { data, error } = await sb
        .from("djs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      alzar(error, "obteniendo perfil");
      return (data as Dj) ?? null;
    },

    async listarDjs(estado?: EstadoDj) {
      let q = sb.from("djs").select("*");
      if (estado) q = q.eq("estado", estado);
      const { data, error } = await q.order("created_at", { ascending: false });
      alzar(error, "listando perfiles");
      return (data ?? []) as Dj[];
    },

    slugDisponible: disponible,

    async crearDj(datos: NuevoDj) {
      const slug = await slugUnico(generarSlug(datos.nombre_artistico), disponible);
      const { data, error } = await sb
        .from("djs")
        .insert({
          ...datos,
          slug,
          estado: "pendiente",
          edit_token: nuevoToken(),
        })
        .select()
        .single();
      alzar(error, "creando perfil");
      return data as Dj;
    },

    async actualizarDj(id: string, datos: Partial<NuevoDj>) {
      const { data, error } = await sb
        .from("djs")
        .update({ ...datos, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      alzar(error, "actualizando perfil");
      return data as Dj;
    },

    async cambiarEstadoDj(id: string, estado: EstadoDj) {
      const { data, error } = await sb
        .from("djs")
        .update({ estado, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      alzar(error, "cambiando estado");
      return data as Dj;
    },

    async crearContacto(datos: NuevoContacto) {
      const { data, error } = await sb
        .from("contactos")
        .insert({ ...datos, estado: "enviado" })
        .select()
        .single();
      alzar(error, "guardando contacto");
      return data as Contacto;
    },

    async listarContactos(djId?: string) {
      let q = sb.from("contactos").select("*");
      if (djId) q = q.eq("dj_id", djId);
      const { data, error } = await q.order("created_at", { ascending: false });
      alzar(error, "listando contactos");
      return (data ?? []) as Contacto[];
    },

    async cambiarEstadoContacto(id: string, estado: EstadoContacto) {
      const { data, error } = await sb
        .from("contactos")
        .update({ estado })
        .eq("id", id)
        .select()
        .single();
      alzar(error, "cambiando estado del contacto");
      return data as Contacto;
    },

    async contarContactosRecientes(email: string, desdeISO: string) {
      const { count, error } = await sb
        .from("contactos")
        .select("id", { count: "exact", head: true })
        .eq("productora_email", email)
        .gte("created_at", desdeISO);
      alzar(error, "contando contactos");
      return count ?? 0;
    },
  };
}
