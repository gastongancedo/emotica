import type { Dj } from "@/lib/types";

/**
 * Perfiles de demostración. Son inventados: sirven para que el buscador
 * no nazca vacío mientras se prueba la app, y para poder mostrarla sin
 * haber cargado nada.
 *
 * ⚠️ Antes de salir a testear con gente real, vaciar `data/beatmatch.json`
 * o borrar estos perfiles desde /admin. Un buscador con DJs falsos es
 * exactamente lo que destruye la confianza de una productora.
 */
const BASE = [
  {
    nombre_artistico: "Nadia Ferreyra",
    ciudad: "CABA",
    estilos: ["Techno", "Minimal"],
    bio: "Toco techno hipnótico, sets largos. Residente de un ciclo en Chacarita desde 2023.",
    cache_min: 180_000,
    cache_max: 350_000,
    instagram: "nadiaferreyra.dj",
    set_url: "https://soundcloud.com/discover",
    rider: "2 CDJ-3000 + DJM-900. Monitoreo propio.",
  },
  {
    nombre_artistico: "Bruno Salas",
    ciudad: "Zona Norte (GBA)",
    estilos: ["House", "Disco / Funk"],
    bio: "House con raíz disco. Fiestas, bares y casamientos. Armo el set según la noche.",
    cache_min: 90_000,
    cache_max: 200_000,
    instagram: "brunosalas.set",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
  {
    nombre_artistico: "LUCÍA V",
    ciudad: "La Plata",
    estilos: ["Drum & Bass", "Techno"],
    bio: "Drum & bass y techno rápido. Cinco años tocando en la escena platense.",
    cache_min: 70_000,
    cache_max: 140_000,
    instagram: "luciav.dnb",
    set_url: "https://soundcloud.com/discover",
    rider: "Necesito monitoreo separado, el resto lo adapto.",
  },
  {
    nombre_artistico: "Tomi Reyes",
    ciudad: "CABA",
    estilos: ["Cachengue", "Reggaetón", "Open Format"],
    bio: "Cachengue y open format para fiestas. Leo la pista y voy para donde vaya.",
    cache_min: 60_000,
    cache_max: 150_000,
    instagram: "tomireyes",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
  {
    nombre_artistico: "Camila Ost",
    ciudad: "Córdoba",
    estilos: ["Progressive", "Trance"],
    bio: "Progressive melódico. Vengo de tocar en after y ahora armo sets de apertura.",
    cache_min: 120_000,
    cache_max: 260_000,
    instagram: "camilaost",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
  {
    nombre_artistico: "Fede Quiroga",
    ciudad: "Zona Oeste (GBA)",
    estilos: ["Tech House"],
    bio: "Tech house para boliche. Disponible fines de semana, zona oeste y CABA.",
    cache_min: 80_000,
    cache_max: 170_000,
    instagram: "fedequiroga.dj",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
  {
    nombre_artistico: "Sol Iriarte",
    ciudad: "Mar del Plata",
    estilos: ["House", "Minimal"],
    bio: "Temporada completa en la costa. House cálido, sets de atardecer.",
    cache_min: 100_000,
    cache_max: 220_000,
    instagram: "soliriarte",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
  {
    nombre_artistico: "Mateo Frank",
    ciudad: "Rosario",
    estilos: ["Hip-Hop", "Open Format"],
    bio: "Hip-hop y open format. Eventos corporativos y cumpleaños de 15.",
    cache_min: null,
    cache_max: null,
    instagram: "mateofrank",
    set_url: "https://soundcloud.com/discover",
    rider: null,
  },
];

function slugDe(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DJS_DEMO(): Dj[] {
  const base = Date.parse("2026-07-20T12:00:00.000Z");
  return BASE.map((d, i) => {
    const creado = new Date(base + i * 3_600_000).toISOString();
    return {
      id: `demo-${i + 1}`,
      slug: slugDe(d.nombre_artistico),
      nombre_artistico: d.nombre_artistico,
      email: `demo${i + 1}@beatmatch.test`,
      ciudad: d.ciudad,
      bio: d.bio,
      estilos: d.estilos,
      cache_min: d.cache_min,
      cache_max: d.cache_max,
      instagram: d.instagram,
      set_url: d.set_url,
      foto_url: null,
      rider: d.rider,
      // Uno queda pendiente a propósito, para poder probar /admin.
      estado: i === BASE.length - 1 ? "pendiente" : "publicado",
      edit_token: `demo-token-${i + 1}`,
      created_at: creado,
      updated_at: creado,
    } satisfies Dj;
  });
}

export const ES_PERFIL_DEMO = (id: string) => id.startsWith("demo-");
