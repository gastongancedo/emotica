import type { TipoEvento } from "./types";

/**
 * Taxonomía de estilos. La decisión abierta N°2 del plan de producto pedía
 * un máximo de 12–15 opciones: una lista gigante empeora el filtro porque
 * fragmenta la oferta y deja categorías con un solo DJ.
 *
 * Incluye estilos de la escena local (cachengue, cumbia) que las
 * plataformas internacionales no contemplan.
 */
export const ESTILOS = [
  "Techno",
  "House",
  "Tech House",
  "Progressive",
  "Trance",
  "Drum & Bass",
  "Minimal",
  "Cachengue",
  "Reggaetón",
  "Cumbia",
  "Hip-Hop",
  "Disco / Funk",
  "EDM",
  "Open Format",
] as const;

/** AMBA primero: es el beachhead definido en el modelo de negocio. */
export const CIUDADES = [
  "CABA",
  "Zona Norte (GBA)",
  "Zona Oeste (GBA)",
  "Zona Sur (GBA)",
  "La Plata",
  "Mar del Plata",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "Tucumán",
  "Bariloche",
  "Otra",
] as const;

export const TIPOS_EVENTO: { value: TipoEvento; label: string }[] = [
  { value: "boliche", label: "Boliche" },
  { value: "fiesta", label: "Fiesta / evento privado" },
  { value: "bar", label: "Bar / after" },
  { value: "corporativo", label: "Evento corporativo" },
  { value: "casamiento", label: "Casamiento" },
  { value: "otro", label: "Otro" },
];

/**
 * Tramos de caché para el filtro. Son los mismos de la P19 de la encuesta,
 * a propósito: así los datos del buscador y los del estudio descriptivo se
 * pueden cruzar.
 *
 * Se recalibran con lo que salga de las entrevistas. En contexto
 * inflacionario un tramo en pesos sin fecha no significa nada, por eso va
 * la constante de abajo.
 */
export const TRAMOS_CACHE = [
  { value: 100_000, label: "Hasta $100.000" },
  { value: 200_000, label: "Hasta $200.000" },
  { value: 400_000, label: "Hasta $400.000" },
  { value: 700_000, label: "Hasta $700.000" },
  { value: 99_999_999, label: "Sin tope" },
];

/** Mes y año en que se fijaron los tramos. Se muestra junto a los precios. */
export const CACHE_REFERENCIA = "julio 2026";

export function formatearPesos(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

export function rangoCache(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    if (min === max) return formatearPesos(min);
    return `${formatearPesos(min)} – ${formatearPesos(max)}`;
  }
  return formatearPesos((min ?? max) as number);
}
