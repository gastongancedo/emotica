import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { editarPerfilDj } from "@/app/actions";
import { FormPerfilDj } from "@/components/FormPerfilDj";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
};

const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "En revisión — todavía no aparece en el buscador",
  publicado: "Publicado y visible en el buscador",
  rechazado: "Rechazado — escribinos si creés que hubo un error",
  pausado: "Pausado — no aparece en el buscador",
};

export default async function EditarPerfil({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;

  const store = await db();
  const dj = await store.obtenerDjPorSlug(slug);
  if (!dj) notFound();

  // El token es lo único que autoriza la edición. Sin cuentas ni
  // contraseñas: para el primer test, pedirle a un DJ que se registre es
  // la fricción que hace que no cargue el perfil.
  if (!token || token !== dj.edit_token) {
    return (
      <div className="py-24 flex flex-col items-center text-center gap-4">
        <p className="etiqueta text-signal">Link inválido</p>
        <h1 className="titulo text-2xl max-w-[28ch]">
          Este link de edición no sirve
        </h1>
        <p className="text-steel text-[15px] max-w-[46ch] leading-relaxed">
          Usá el link completo que te dimos cuando cargaste tu perfil. Si lo
          perdiste, escribinos y te mandamos otro.
        </p>
        <Link href={`/dj/${slug}`} className="btn btn-borde mt-2">
          Ver el perfil
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl">
      <Link
        href={`/dj/${dj.slug}`}
        className="font-mono text-[11px] tracking-[0.08em] uppercase text-steel-2 hover:text-texto"
      >
        ← Ver mi perfil
      </Link>

      <p className="etiqueta mt-6">Editar</p>
      <h1 className="titulo text-[clamp(28px,5vw,42px)] mt-3">
        {dj.nombre_artistico}
      </h1>

      <div className="tarjeta p-4 mt-6 flex items-center gap-3 flex-wrap">
        <span
          className={
            dj.estado === "publicado" ? "chip" : "chip chip-signal"
          }
        >
          {dj.estado}
        </span>
        <p className="font-mono text-[11.5px] text-steel">
          {ETIQUETA_ESTADO[dj.estado]}
        </p>
      </div>

      <div className="mt-8">
        <FormPerfilDj accion={editarPerfilDj} dj={dj} token={token} />
      </div>
    </div>
  );
}
