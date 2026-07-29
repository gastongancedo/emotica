import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  Contacto,
  Dj,
  EstadoContacto,
  EstadoDj,
  FiltrosBusqueda,
  NuevoContacto,
  NuevoDj,
} from "@/lib/types";
import {
  aplicaFiltros,
  generarSlug,
  nuevoId,
  nuevoToken,
  slugUnico,
  type Store,
} from "./index";
import { DJS_DEMO } from "./demo";

interface Datos {
  djs: Dj[];
  contactos: Contacto[];
}

const ARCHIVO = path.join(process.cwd(), "data", "beatmatch.json");

/**
 * Las escrituras se encadenan sobre esta promesa para que dos envíos
 * simultáneos no se pisen: sin esto, leer-modificar-escribir sobre el
 * mismo archivo pierde registros.
 */
let cola: Promise<unknown> = Promise.resolve();

function enCola<T>(fn: () => Promise<T>): Promise<T> {
  const siguiente = cola.then(fn, fn);
  cola = siguiente.catch(() => {});
  return siguiente;
}

async function leer(): Promise<Datos> {
  try {
    const crudo = await readFile(ARCHIVO, "utf-8");
    const datos = JSON.parse(crudo) as Datos;
    return { djs: datos.djs ?? [], contactos: datos.contactos ?? [] };
  } catch {
    // Primera corrida: se siembra con los perfiles de demostración para
    // que el buscador no nazca vacío.
    const inicial: Datos = { djs: DJS_DEMO(), contactos: [] };
    await escribir(inicial);
    return inicial;
  }
}

async function escribir(datos: Datos): Promise<void> {
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(datos, null, 2), "utf-8");
}

export function crearStoreArchivo(): Store {
  const disponible = async (slug: string) => {
    const { djs } = await leer();
    return !djs.some((d) => d.slug === slug);
  };

  return {
    async buscarDjs(filtros: FiltrosBusqueda) {
      const { djs } = await leer();
      return djs
        .filter((d) => d.estado === "publicado" && aplicaFiltros(d, filtros))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async obtenerDjPorSlug(slug: string) {
      const { djs } = await leer();
      return djs.find((d) => d.slug === slug) ?? null;
    },

    async obtenerDjPorId(id: string) {
      const { djs } = await leer();
      return djs.find((d) => d.id === id) ?? null;
    },

    async listarDjs(estado?: EstadoDj) {
      const { djs } = await leer();
      return djs
        .filter((d) => (estado ? d.estado === estado : true))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    slugDisponible: disponible,

    async crearDj(datos: NuevoDj) {
      return enCola(async () => {
        const actual = await leer();
        const slug = await slugUnico(
          generarSlug(datos.nombre_artistico),
          async (s) => !actual.djs.some((d) => d.slug === s),
        );
        const ahora = new Date().toISOString();
        const dj: Dj = {
          id: nuevoId(),
          slug,
          ...datos,
          foto_url: null,
          estado: "pendiente",
          edit_token: nuevoToken(),
          created_at: ahora,
          updated_at: ahora,
        };
        actual.djs.push(dj);
        await escribir(actual);
        return dj;
      });
    },

    async actualizarDj(id: string, datos: Partial<NuevoDj>) {
      return enCola(async () => {
        const actual = await leer();
        const i = actual.djs.findIndex((d) => d.id === id);
        if (i === -1) throw new Error("No existe el perfil");
        actual.djs[i] = {
          ...actual.djs[i],
          ...datos,
          updated_at: new Date().toISOString(),
        };
        await escribir(actual);
        return actual.djs[i];
      });
    },

    async cambiarEstadoDj(id: string, estado: EstadoDj) {
      return enCola(async () => {
        const actual = await leer();
        const i = actual.djs.findIndex((d) => d.id === id);
        if (i === -1) throw new Error("No existe el perfil");
        actual.djs[i] = {
          ...actual.djs[i],
          estado,
          updated_at: new Date().toISOString(),
        };
        await escribir(actual);
        return actual.djs[i];
      });
    },

    async crearContacto(datos: NuevoContacto) {
      return enCola(async () => {
        const actual = await leer();
        const contacto: Contacto = {
          id: nuevoId(),
          ...datos,
          estado: "enviado",
          created_at: new Date().toISOString(),
        };
        actual.contactos.push(contacto);
        await escribir(actual);
        return contacto;
      });
    },

    async listarContactos(djId?: string) {
      const { contactos } = await leer();
      return contactos
        .filter((c) => (djId ? c.dj_id === djId : true))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async cambiarEstadoContacto(id: string, estado: EstadoContacto) {
      return enCola(async () => {
        const actual = await leer();
        const i = actual.contactos.findIndex((c) => c.id === id);
        if (i === -1) throw new Error("No existe el contacto");
        actual.contactos[i] = { ...actual.contactos[i], estado };
        await escribir(actual);
        return actual.contactos[i];
      });
    },

    async contarContactosRecientes(email: string, desdeISO: string) {
      const { contactos } = await leer();
      return contactos.filter(
        (c) => c.productora_email === email && c.created_at >= desdeISO,
      ).length;
    },
  };
}
