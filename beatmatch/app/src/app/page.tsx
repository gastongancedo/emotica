import Link from "next/link";

import { TarjetaDj } from "@/components/TarjetaDj";
import { db } from "@/lib/db";
import { ESTILOS } from "@/lib/taxonomia";

// Lista perfiles y cuenta estilos: si se prerenderiza, un DJ que se suma
// hoy no aparece hasta el próximo build.
export const dynamic = "force-dynamic";

export default async function Inicio() {
  const store = await db();
  const djs = await store.buscarDjs({});
  const ultimos = djs.slice(0, 6);

  const porEstilo = new Map<string, number>();
  for (const dj of djs) {
    for (const e of dj.estilos) porEstilo.set(e, (porEstilo.get(e) ?? 0) + 1);
  }
  const estilosConGente = ESTILOS.filter((e) => porEstilo.has(e)).slice(0, 8);

  return (
    <>
      <section className="py-16 sm:py-24">
        <p className="etiqueta flex items-center gap-3">
          <span className="w-6 h-px bg-signal" />
          DJs × Productoras de eventos
        </p>

        <h1 className="titulo text-[clamp(38px,8vw,76px)] mt-6 max-w-[16ch]">
          Donde la música
          <br />
          encuentra <span className="text-signal">escenario.</span>
        </h1>

        <p className="mt-7 text-[17px] text-steel leading-relaxed max-w-[58ch]">
          Buscá DJs por estilo, ciudad y presupuesto. Escuchá a qué suenan antes
          de escribirles. Conseguir el DJ correcto deja de depender de a quién
          conocés.
        </p>

        <div className="mt-9 flex flex-wrap gap-3.5">
          <Link href="/djs" className="btn btn-primario">
            Buscar DJs →
          </Link>
          <Link href="/registro" className="btn btn-borde">
            Soy DJ, quiero mi perfil
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <p className="font-mono text-3xl font-semibold tabular-nums text-signal">
              {djs.length}
            </p>
            <p className="etiqueta mt-1">DJs publicados</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-semibold tabular-nums text-sync">
              {new Set(djs.map((d) => d.ciudad)).size}
            </p>
            <p className="etiqueta mt-1">Ciudades</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-semibold tabular-nums">
              {porEstilo.size}
            </p>
            <p className="etiqueta mt-1">Estilos cubiertos</p>
          </div>
        </div>
      </section>

      {estilosConGente.length > 0 && (
        <section className="py-8 border-t border-linea">
          <p className="etiqueta mb-4">Buscar por estilo</p>
          <div className="flex flex-wrap gap-2">
            {estilosConGente.map((e) => (
              <Link
                key={e}
                href={`/djs?estilo=${encodeURIComponent(e)}`}
                className="font-mono text-[11px] tracking-[0.06em] uppercase px-3.5 py-2.5 rounded-sm border border-linea-fuerte text-steel hover:border-sync hover:text-sync transition-colors"
              >
                {e}{" "}
                <span className="text-steel-2 tabular-nums">{porEstilo.get(e)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {ultimos.length > 0 && (
        <section className="py-16 border-t border-linea mt-8">
          <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
            <div>
              <p className="etiqueta">Últimos en sumarse</p>
              <h2 className="titulo text-2xl mt-2">El archivo</h2>
            </div>
            <Link
              href="/djs"
              className="font-mono text-[11.5px] tracking-[0.08em] uppercase text-sync border-b border-sync/40 hover:border-sync pb-0.5"
            >
              Ver todos
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ultimos.map((dj) => (
              <TarjetaDj key={dj.id} dj={dj} />
            ))}
          </div>
        </section>
      )}

      <section className="py-14 border-t border-linea">
        <div className="tarjeta p-8 sm:p-10 flex flex-col gap-4 max-w-[70ch]">
          <p className="etiqueta text-sync">Para DJs</p>
          <h2 className="titulo text-2xl">Tu perfil también es tu presskit</h2>
          <p className="text-steel text-[15.5px] leading-relaxed">
            Cargás tu ficha una vez y te queda un link propio con tu estilo, tu
            caché y tu set. Se lo mandás a quien quieras, dentro y fuera de
            Beatmatch. Es gratis y va a seguir siéndolo mientras estemos
            construyendo el archivo.
          </p>
          <Link href="/registro" className="btn btn-secundario self-start mt-1">
            Crear mi perfil
          </Link>
        </div>
      </section>
    </>
  );
}
