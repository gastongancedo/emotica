import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { marcarContacto, moderarPerfil } from "@/app/actions";
import { claveAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { formatearPesos, rangoCache } from "@/lib/taxonomia";
import type { Contacto, Dj } from "@/lib/types";

export const metadata: Metadata = {
  title: "Moderación",
  robots: { index: false, follow: false },
};

const COOKIE = "bm_admin";

async function entrar(fd: FormData): Promise<void> {
  "use server";
  const esperada = claveAdmin();
  const clave = String(fd.get("clave") ?? "");
  if (esperada === null || clave !== esperada) return;
  const c = await cookies();
  c.set(COOKIE, clave, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin");
}

async function salir(): Promise<void> {
  "use server";
  const c = await cookies();
  c.delete(COOKIE);
  revalidatePath("/admin");
}

function Pantalla({ children }: { children: React.ReactNode }) {
  return <div className="py-12">{children}</div>;
}

// ── Sin clave configurada ──────────────────────────────────────────

function SinClave() {
  return (
    <Pantalla>
      <div className="max-w-lg">
        <p className="etiqueta text-signal">Panel deshabilitado</p>
        <h1 className="titulo text-3xl mt-3">Falta configurar ADMIN_KEY</h1>
        <p className="text-steel text-[15px] mt-5 leading-relaxed">
          El panel de moderación está cerrado porque no hay clave definida.
          Agregá la variable <code className="font-mono text-sync">ADMIN_KEY</code>{" "}
          en el proyecto y volvé a deployar.
        </p>
        <p className="font-mono text-[11px] text-steel-2 mt-5 leading-relaxed">
          Se cierra a propósito en vez de caer a una clave por defecto: un
          panel con clave adivinable es peor que un panel apagado.
        </p>
      </div>
    </Pantalla>
  );
}

// ── Login ──────────────────────────────────────────────────────────

function Login() {
  return (
    <Pantalla>
      <div className="max-w-sm">
        <p className="etiqueta">Panel interno</p>
        <h1 className="titulo text-3xl mt-3">Moderación</h1>
        <form action={entrar} className="tarjeta p-6 mt-7 flex flex-col gap-4">
          <div>
            <label htmlFor="clave" className="etiqueta-campo">
              Clave
            </label>
            <input
              id="clave"
              name="clave"
              type="password"
              className="campo"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primario">
            Entrar
          </button>
        </form>
        <p className="font-mono text-[10.5px] text-steel-2 mt-4 leading-relaxed">
          La clave sale de la variable <code>ADMIN_KEY</code>.
        </p>
      </div>
    </Pantalla>
  );
}

// ── Fichas ─────────────────────────────────────────────────────────

function FilaDj({ dj, clave }: { dj: Dj; clave: string }) {
  const cache = rangoCache(dj.cache_min, dj.cache_max);
  const acciones: { estado: string; label: string; clase: string }[] =
    dj.estado === "publicado"
      ? [
          { estado: "pausado", label: "Pausar", clase: "btn-borde" },
          { estado: "rechazado", label: "Rechazar", clase: "btn-borde" },
        ]
      : [
          { estado: "publicado", label: "Publicar", clase: "btn-secundario" },
          { estado: "rechazado", label: "Rechazar", clase: "btn-borde" },
        ];

  return (
    <div className="tarjeta p-5 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-bold text-[16px]">{dj.nombre_artistico}</h3>
            <span className={dj.estado === "publicado" ? "chip" : "chip chip-signal"}>
              {dj.estado}
            </span>
          </div>
          <p className="etiqueta mt-1.5">
            {dj.ciudad} · {dj.estilos.join(", ")} ·{" "}
            {cache ?? "caché a convenir"}
          </p>
        </div>
        <Link
          href={`/dj/${dj.slug}`}
          className="font-mono text-[11px] tracking-[0.06em] uppercase text-sync hover:underline shrink-0"
        >
          Ver perfil →
        </Link>
      </div>

      {dj.bio && <p className="text-[14px] text-steel leading-relaxed">{dj.bio}</p>}

      <div className="flex flex-wrap gap-3 items-center text-[12px] font-mono text-steel-2">
        <span>{dj.email}</span>
        {dj.set_url && (
          <a
            href={dj.set_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sync hover:underline truncate max-w-[24ch]"
          >
            set ↗
          </a>
        )}
      </div>

      <div className="flex gap-2.5 flex-wrap pt-3 border-t border-linea">
        {acciones.map((a) => (
          <form key={a.estado} action={moderarPerfil}>
            <input type="hidden" name="clave" value={clave} />
            <input type="hidden" name="dj_id" value={dj.id} />
            <input type="hidden" name="estado" value={a.estado} />
            <button type="submit" className={`btn ${a.clase} !py-2 !px-4 !text-[11px]`}>
              {a.label}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

const ESTADOS_CONTACTO = [
  { estado: "respondido", label: "Respondido" },
  { estado: "concretado", label: "Concretado" },
  { estado: "caido", label: "Caído" },
];

function FilaContacto({
  contacto,
  dj,
  clave,
}: {
  contacto: Contacto;
  dj?: Dj;
  clave: string;
}) {
  return (
    <div className="tarjeta p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-[15px]">
            {contacto.productora_nombre}{" "}
            <span className="text-steel-2 font-normal">→</span>{" "}
            {dj?.nombre_artistico ?? "—"}
          </h3>
          <p className="etiqueta mt-1.5">
            {contacto.tipo_evento}
            {contacto.fecha_evento && ` · ${contacto.fecha_evento}`}
            {contacto.presupuesto != null &&
              ` · ${formatearPesos(contacto.presupuesto)}`}
          </p>
        </div>
        <span
          className={
            contacto.estado === "concretado"
              ? "chip"
              : contacto.estado === "caido"
                ? "chip chip-neutro"
                : "chip chip-signal"
          }
        >
          {contacto.estado}
        </span>
      </div>

      <p className="text-[14px] text-steel leading-relaxed">{contacto.mensaje}</p>
      <p className="font-mono text-[11.5px] text-steel-2">
        {contacto.productora_email}
      </p>

      <div className="flex gap-2.5 flex-wrap pt-3 border-t border-linea">
        {ESTADOS_CONTACTO.map((e) => (
          <form key={e.estado} action={marcarContacto}>
            <input type="hidden" name="clave" value={clave} />
            <input type="hidden" name="contacto_id" value={contacto.id} />
            <input type="hidden" name="estado" value={e.estado} />
            <button
              type="submit"
              className="btn btn-borde !py-2 !px-3.5 !text-[10.5px]"
              disabled={contacto.estado === e.estado}
            >
              {e.label}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────

export default async function Admin() {
  const c = await cookies();
  const esperada = claveAdmin();
  if (esperada === null) return <SinClave />;
  const clave = c.get(COOKIE)?.value;
  if (!clave || clave !== esperada) return <Login />;

  const store = await db();
  const [todos, contactos] = await Promise.all([
    store.listarDjs(),
    store.listarContactos(),
  ]);

  const pendientes = todos.filter((d) => d.estado === "pendiente");
  const resto = todos.filter((d) => d.estado !== "pendiente");
  const porId = new Map(todos.map((d) => [d.id, d]));
  const concretados = contactos.filter((k) => k.estado === "concretado").length;

  return (
    <Pantalla>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="etiqueta">Panel interno</p>
          <h1 className="titulo text-[clamp(28px,5vw,42px)] mt-3">Moderación</h1>
        </div>
        <form action={salir}>
          <button type="submit" className="btn btn-borde !py-2 !px-4 !text-[11px]">
            Salir
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-linea border border-linea rounded-sm mt-8 overflow-hidden">
        {[
          { n: pendientes.length, l: "Pendientes", c: "text-signal" },
          {
            n: todos.filter((d) => d.estado === "publicado").length,
            l: "Publicados",
            c: "text-sync",
          },
          { n: contactos.length, l: "Contactos", c: "" },
          { n: concretados, l: "Concretados", c: "text-sync" },
        ].map((s) => (
          <div key={s.l} className="bg-panel p-4">
            <p className={`font-mono text-2xl font-semibold tabular-nums ${s.c}`}>
              {s.n}
            </p>
            <p className="etiqueta mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="titulo text-xl">Esperando revisión</h2>
        <div className="flex flex-col gap-3 mt-5">
          {pendientes.length > 0 ? (
            pendientes.map((dj) => <FilaDj key={dj.id} dj={dj} clave={clave} />)
          ) : (
            <p className="text-steel text-[14.5px]">
              Nada pendiente. Todo revisado.
            </p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="titulo text-xl">Contactos recibidos</h2>
        <p className="text-steel text-[14.5px] mt-2 max-w-[64ch] leading-relaxed">
          Marcar el estado de cada uno es lo que convierte esta tabla en
          inteligencia de mercado: sin el seguimiento manual no hay forma de
          saber qué proporción de contactos termina en booking, que es el dato
          con el que después se fundamenta la comisión.
        </p>
        <div className="flex flex-col gap-3 mt-5">
          {contactos.length > 0 ? (
            contactos.map((k) => (
              <FilaContacto
                key={k.id}
                contacto={k}
                dj={porId.get(k.dj_id)}
                clave={clave}
              />
            ))
          ) : (
            <p className="text-steel text-[14.5px]">Todavía no llegó ninguno.</p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="titulo text-xl">Resto del archivo</h2>
        <div className="flex flex-col gap-3 mt-5">
          {resto.map((dj) => (
            <FilaDj key={dj.id} dj={dj} clave={clave} />
          ))}
        </div>
      </section>
    </Pantalla>
  );
}
