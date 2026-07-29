import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormContacto } from "@/components/FormContacto";
import { db } from "@/lib/db";
import { CACHE_REFERENCIA, rangoCache } from "@/lib/taxonomia";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await db();
  const dj = await store.obtenerDjPorSlug(slug);
  if (!dj || dj.estado !== "publicado") return { title: "Perfil no encontrado" };

  const desc =
    dj.bio ||
    `${dj.estilos.join(", ")} en ${dj.ciudad}. Escuchá su set y contactalo por Beatmatch.`;

  return {
    title: dj.nombre_artistico,
    description: desc,
    openGraph: {
      title: `${dj.nombre_artistico} · Beatmatch`,
      description: desc,
      type: "profile",
    },
  };
}

/** Convierte un link de YouTube o SoundCloud en algo embebible. */
function urlEmbebida(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("soundcloud.com")) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5b26&visual=false`;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function PerfilDj({ params }: Props) {
  const { slug } = await params;
  const store = await db();
  const dj = await store.obtenerDjPorSlug(slug);

  if (!dj) notFound();

  if (dj.estado !== "publicado") {
    return (
      <div className="py-24 flex flex-col items-center text-center gap-4">
        <p className="etiqueta text-signal">
          {dj.estado === "pendiente" ? "En revisión" : "No disponible"}
        </p>
        <h1 className="titulo text-2xl max-w-[26ch]">
          {dj.estado === "pendiente"
            ? "Este perfil todavía no está publicado"
            : "Este perfil no está disponible"}
        </h1>
        <Link href="/djs" className="btn btn-borde mt-2">
          Ver el archivo
        </Link>
      </div>
    );
  }

  const cache = rangoCache(dj.cache_min, dj.cache_max);
  const embebido = dj.set_url ? urlEmbebida(dj.set_url) : null;

  return (
    <div className="py-12">
      <Link
        href="/djs"
        className="font-mono text-[11px] tracking-[0.08em] uppercase text-steel-2 hover:text-texto"
      >
        ← Volver al archivo
      </Link>

      <header className="mt-6 flex flex-col gap-5">
        <div>
          <p className="etiqueta">{dj.ciudad}</p>
          <h1 className="titulo text-[clamp(32px,6vw,58px)] mt-3">
            {dj.nombre_artistico}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {dj.estilos.map((e) => (
            <Link key={e} href={`/djs?estilo=${encodeURIComponent(e)}`} className="chip">
              {e}
            </Link>
          ))}
        </div>

        {dj.bio && (
          <p className="text-[16.5px] text-steel leading-relaxed max-w-[62ch]">
            {dj.bio}
          </p>
        )}
      </header>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-10 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {embebido ? (
            <div className="tarjeta overflow-hidden">
              <iframe
                src={embebido}
                title={`Set de ${dj.nombre_artistico}`}
                className="w-full aspect-video border-0"
                allow="encrypted-media; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : dj.set_url ? (
            <a
              href={dj.set_url}
              target="_blank"
              rel="noopener noreferrer"
              className="tarjeta p-6 flex flex-col gap-2 hover:border-linea-fuerte transition-colors"
            >
              <p className="etiqueta text-sync">Escuchar</p>
              <p className="font-mono text-[13px] break-all">{dj.set_url}</p>
            </a>
          ) : null}

          <dl className="tarjeta divide-y divide-linea">
            <div className="flex justify-between gap-6 p-5">
              <dt className="etiqueta-campo !mb-0">Caché</dt>
              <dd className="font-mono text-[14px] tabular-nums text-right">
                {cache ? (
                  <>
                    {cache}
                    <span className="block text-steel-2 text-[10.5px] mt-1">
                      referencia {CACHE_REFERENCIA}
                    </span>
                  </>
                ) : (
                  <span className="text-steel-2">A convenir</span>
                )}
              </dd>
            </div>

            <div className="flex justify-between gap-6 p-5">
              <dt className="etiqueta-campo !mb-0">Zona</dt>
              <dd className="font-mono text-[14px] text-right">{dj.ciudad}</dd>
            </div>

            {dj.rider && (
              <div className="flex justify-between gap-6 p-5">
                <dt className="etiqueta-campo !mb-0">Rider</dt>
                <dd className="text-[14px] text-steel text-right max-w-[36ch]">
                  {dj.rider}
                </dd>
              </div>
            )}

            {dj.instagram && (
              <div className="flex justify-between gap-6 p-5">
                <dt className="etiqueta-campo !mb-0">Instagram</dt>
                <dd className="text-right">
                  <a
                    href={`https://instagram.com/${dj.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[14px] text-sync hover:underline"
                  >
                    @{dj.instagram}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="lg:sticky lg:top-24">
          <FormContacto
            dj={{
              id: dj.id,
              nombre_artistico: dj.nombre_artistico,
              instagram: dj.instagram,
            }}
          />
        </div>
      </div>
    </div>
  );
}
