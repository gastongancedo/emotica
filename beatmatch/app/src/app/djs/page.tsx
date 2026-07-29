import type { Metadata } from "next";
import Link from "next/link";

import { TarjetaDj } from "@/components/TarjetaDj";
import { db } from "@/lib/db";
import { CIUDADES, ESTILOS, TRAMOS_CACHE } from "@/lib/taxonomia";

export const metadata: Metadata = {
  title: "Buscar DJs",
  description:
    "Filtrá DJs por estilo, ciudad y presupuesto. Escuchá sus sets y contactalos directo.",
};

type Params = Promise<{
  estilo?: string;
  ciudad?: string;
  cache?: string;
  q?: string;
}>;

export default async function Buscador({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;

  const estilo = ESTILOS.includes(sp.estilo as (typeof ESTILOS)[number])
    ? sp.estilo
    : undefined;
  const ciudad = CIUDADES.includes(sp.ciudad as (typeof CIUDADES)[number])
    ? sp.ciudad
    : undefined;
  const cacheMax = sp.cache ? Number(sp.cache) : undefined;
  const q = sp.q?.trim() || undefined;

  const store = await db();
  const resultados = await store.buscarDjs({
    estilo,
    ciudad,
    cacheMax: Number.isFinite(cacheMax) ? cacheMax : undefined,
    q,
  });

  const hayFiltros = Boolean(estilo || ciudad || sp.cache || q);

  return (
    <div className="py-12">
      <p className="etiqueta">Buscador</p>
      <h1 className="titulo text-[clamp(30px,5vw,46px)] mt-3">Encontrá tu DJ</h1>

      <form method="get" className="tarjeta p-5 mt-8 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="q" className="etiqueta-campo">
              Buscar
            </label>
            <input
              id="q"
              name="q"
              className="campo"
              defaultValue={q ?? ""}
              placeholder="Nombre o palabra"
            />
          </div>

          <div>
            <label htmlFor="estilo" className="etiqueta-campo">
              Estilo
            </label>
            <select id="estilo" name="estilo" className="campo" defaultValue={estilo ?? ""}>
              <option value="">Todos</option>
              {ESTILOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ciudad" className="etiqueta-campo">
              Ciudad
            </label>
            <select id="ciudad" name="ciudad" className="campo" defaultValue={ciudad ?? ""}>
              <option value="">Todas</option>
              {CIUDADES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cache" className="etiqueta-campo">
              Presupuesto
            </label>
            <select id="cache" name="cache" className="campo" defaultValue={sp.cache ?? ""}>
              <option value="">Cualquiera</option>
              {TRAMOS_CACHE.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button type="submit" className="btn btn-primario !py-2.5 !px-5 !text-[11.5px]">
            Filtrar
          </button>
          {hayFiltros && (
            <Link
              href="/djs"
              className="font-mono text-[11px] tracking-[0.08em] uppercase text-steel-2 hover:text-texto"
            >
              Limpiar
            </Link>
          )}
          <p className="font-mono text-[11px] text-steel-2 ml-auto tabular-nums">
            {resultados.length}{" "}
            {resultados.length === 1 ? "resultado" : "resultados"}
          </p>
        </div>
      </form>

      {resultados.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {resultados.map((dj) => (
            <TarjetaDj key={dj.id} dj={dj} />
          ))}
        </div>
      ) : (
        <div className="tarjeta p-10 mt-8 text-center flex flex-col items-center gap-4">
          <p className="etiqueta text-signal">Sin resultados</p>
          <h2 className="titulo text-xl max-w-[24ch]">
            {hayFiltros
              ? "Todavía no hay nadie con esos filtros"
              : "El archivo está vacío"}
          </h2>
          <p className="text-steel text-[14.5px] max-w-[48ch] leading-relaxed">
            {hayFiltros
              ? "Probá con menos filtros. El archivo está creciendo y todavía no cubre todas las combinaciones."
              : "Todavía no hay perfiles publicados. Si sos DJ, podés ser el primero."}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {hayFiltros && (
              <Link href="/djs" className="btn btn-borde">
                Ver todos
              </Link>
            )}
            <Link href="/registro" className="btn btn-secundario">
              Sumar mi perfil
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
