"use server";

import { revalidatePath } from "next/cache";

import { claveAdminValida } from "@/lib/admin";
import { db } from "@/lib/db";
import type { EstadoForm } from "@/lib/form-estado";
import type { EstadoContacto, EstadoDj } from "@/lib/types";
import { validarContacto, validarDj } from "@/lib/validar";

function urlSitio(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
}

// ── Alta de perfil de DJ ───────────────────────────────────────────

export async function crearPerfilDj(
  _previo: EstadoForm,
  fd: FormData,
): Promise<EstadoForm> {
  // Trampa para bots: es un campo oculto que una persona nunca completa.
  if (typeof fd.get("website") === "string" && fd.get("website")) {
    return { ok: true, errores: {} };
  }

  const v = validarDj(fd);
  if (!v.ok || !v.datos) return { ok: false, errores: v.errores };

  try {
    const store = await db();
    const dj = await store.crearDj(v.datos);
    revalidatePath("/djs");
    revalidatePath("/admin");
    return {
      ok: true,
      errores: {},
      slug: dj.slug,
      editUrl: `${urlSitio()}/dj/${dj.slug}/editar?token=${dj.edit_token}`,
    };
  } catch (err) {
    return {
      ok: false,
      errores: {},
      mensaje:
        err instanceof Error
          ? `No se pudo guardar: ${err.message}`
          : "No se pudo guardar el perfil.",
    };
  }
}

// ── Edición con token ──────────────────────────────────────────────

export async function editarPerfilDj(
  _previo: EstadoForm,
  fd: FormData,
): Promise<EstadoForm> {
  const id = String(fd.get("dj_id") ?? "");
  const token = String(fd.get("token") ?? "");

  const store = await db();
  const dj = await store.obtenerDjPorId(id);
  if (!dj || dj.edit_token !== token) {
    return {
      ok: false,
      errores: {},
      mensaje: "El link de edición no es válido.",
    };
  }

  const v = validarDj(fd);
  if (!v.ok || !v.datos) return { ok: false, errores: v.errores };

  try {
    await store.actualizarDj(id, v.datos);
    revalidatePath(`/dj/${dj.slug}`);
    revalidatePath("/djs");
    return { ok: true, errores: {}, slug: dj.slug, mensaje: "Perfil actualizado." };
  } catch (err) {
    return {
      ok: false,
      errores: {},
      mensaje: err instanceof Error ? err.message : "No se pudo actualizar.",
    };
  }
}

// ── Contacto de una productora a un DJ ─────────────────────────────

export async function enviarContacto(
  _previo: EstadoForm,
  fd: FormData,
): Promise<EstadoForm> {
  if (typeof fd.get("website") === "string" && fd.get("website")) {
    return { ok: true, errores: {} };
  }

  const djId = String(fd.get("dj_id") ?? "");
  const store = await db();
  const dj = await store.obtenerDjPorId(djId);
  if (!dj || dj.estado !== "publicado") {
    return { ok: false, errores: {}, mensaje: "Ese perfil no está disponible." };
  }

  const v = validarContacto(fd, djId);
  if (!v.ok || !v.datos) return { ok: false, errores: v.errores };

  // Límite simple: 5 mensajes por mail cada 24 h. Sin esto, el formulario
  // público es un canal de spam directo a la casilla de los DJs.
  const hace24h = new Date(Date.now() - 86_400_000).toISOString();
  const recientes = await store.contarContactosRecientes(
    v.datos.productora_email,
    hace24h,
  );
  if (recientes >= 5) {
    return {
      ok: false,
      errores: {},
      mensaje: "Llegaste al límite de mensajes por hoy. Probá mañana.",
    };
  }

  try {
    await store.crearContacto(v.datos);
    revalidatePath("/admin");
    return { ok: true, errores: {} };
  } catch (err) {
    return {
      ok: false,
      errores: {},
      mensaje: err instanceof Error ? err.message : "No se pudo enviar.",
    };
  }
}

// ── Moderación ─────────────────────────────────────────────────────

export async function moderarPerfil(fd: FormData): Promise<void> {
  const clave = String(fd.get("clave") ?? "");
  if (!claveAdminValida(clave)) return;

  const id = String(fd.get("dj_id") ?? "");
  const estado = String(fd.get("estado") ?? "") as EstadoDj;
  if (!["pendiente", "publicado", "rechazado", "pausado"].includes(estado)) return;

  const store = await db();
  await store.cambiarEstadoDj(id, estado);
  revalidatePath("/admin");
  revalidatePath("/djs");
}

export async function marcarContacto(fd: FormData): Promise<void> {
  const clave = String(fd.get("clave") ?? "");
  if (!claveAdminValida(clave)) return;

  const id = String(fd.get("contacto_id") ?? "");
  const estado = String(fd.get("estado") ?? "") as EstadoContacto;
  if (!["enviado", "respondido", "concretado", "caido"].includes(estado)) return;

  const store = await db();
  await store.cambiarEstadoContacto(id, estado);
  revalidatePath("/admin");
}
