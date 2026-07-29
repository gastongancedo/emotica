import Link from "next/link";

import { CACHE_REFERENCIA, rangoCache } from "@/lib/taxonomia";
import type { Dj } from "@/lib/types";

export function TarjetaDj({ dj }: { dj: Dj }) {
  const cache = rangoCache(dj.cache_min, dj.cache_max);

  return (
    <Link
      href={`/dj/${dj.slug}`}
      className="tarjeta p-5 flex flex-col gap-3.5 hover:border-linea-fuerte transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[17px] leading-tight truncate group-hover:text-signal transition-colors">
            {dj.nombre_artistico}
          </h3>
          <p className="etiqueta mt-1.5">{dj.ciudad}</p>
        </div>
      </div>

      {dj.bio && (
        <p className="text-[14px] text-steel leading-relaxed line-clamp-3">{dj.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {dj.estilos.map((e) => (
          <span key={e} className="chip">
            {e}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-linea">
        {cache ? (
          <p className="font-mono text-[12.5px] text-texto tabular-nums">
            {cache}{" "}
            <span className="text-steel-2 text-[10.5px]">/ {CACHE_REFERENCIA}</span>
          </p>
        ) : (
          <p className="font-mono text-[12.5px] text-steel-2">Caché a convenir</p>
        )}
      </div>
    </Link>
  );
}
