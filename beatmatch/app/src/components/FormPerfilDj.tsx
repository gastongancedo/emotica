"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { ESTADO_INICIAL, type EstadoForm } from "@/lib/form-estado";
import { CIUDADES, ESTILOS } from "@/lib/taxonomia";
import type { Dj } from "@/lib/types";

function Enviar({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primario" disabled={pending}>
      {pending ? "Guardando…" : children}
    </button>
  );
}

function Campo({
  id,
  label,
  error,
  ayuda,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="etiqueta-campo">
        {label}
      </label>
      {children}
      {ayuda && !error && (
        <p className="font-mono text-[10.5px] text-steel-2 mt-1.5">{ayuda}</p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormPerfilDj({
  accion,
  dj,
  token,
}: {
  accion: (previo: EstadoForm, fd: FormData) => Promise<EstadoForm>;
  dj?: Dj;
  token?: string;
}) {
  const [estado, formAction] = useActionState(accion, ESTADO_INICIAL);
  const [estilos, setEstilos] = useState<string[]>(dj?.estilos ?? []);
  const [copiado, setCopiado] = useState(false);

  function alternar(e: string) {
    setEstilos((prev) =>
      prev.includes(e)
        ? prev.filter((x) => x !== e)
        : prev.length < 3
          ? [...prev, e]
          : prev,
    );
  }

  // Alta exitosa: se muestra el link de edición una única vez.
  if (estado.ok && estado.editUrl) {
    return (
      <div className="tarjeta p-7 flex flex-col gap-5">
        <div>
          <p className="etiqueta text-sync">Perfil enviado</p>
          <h2 className="titulo text-2xl mt-2">Ya está en la fila</h2>
        </div>
        <p className="text-steel text-[15px] leading-relaxed max-w-[62ch]">
          Lo revisamos y lo publicamos. Suele tardar menos de un día.
        </p>

        <div className="bg-ink-2 border border-linea-fuerte rounded-sm p-4 flex flex-col gap-3">
          <p className="etiqueta-campo !mb-0">
            Guardá este link — es la única forma de editar tu perfil
          </p>
          <code className="font-mono text-[12px] text-sync break-all leading-relaxed">
            {estado.editUrl}
          </code>
          <button
            type="button"
            className="btn btn-borde self-start !py-2 !px-4 !text-[11px]"
            onClick={() => {
              navigator.clipboard?.writeText(estado.editUrl!).then(
                () => setCopiado(true),
                () => setCopiado(false),
              );
            }}
          >
            {copiado ? "Copiado" : "Copiar link"}
          </button>
        </div>

        <p className="font-mono text-[11px] text-steel-2 leading-relaxed">
          No te lo mandamos por mail todavía: el envío de correos entra en la
          próxima versión. Copialo ahora.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {dj && <input type="hidden" name="dj_id" value={dj.id} />}
      {token && <input type="hidden" name="token" value={token} />}
      {estilos.map((e) => (
        <input key={e} type="hidden" name="estilos" value={e} />
      ))}

      {/* Trampa para bots. Invisible para una persona. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">No completar</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {estado.mensaje && (
        <p
          className={`font-mono text-[12px] ${estado.ok ? "text-sync" : "text-signal"}`}
          role="status"
        >
          {estado.mensaje}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <Campo id="nombre_artistico" label="Nombre artístico *" error={estado.errores.nombre_artistico}>
          <input
            id="nombre_artistico"
            name="nombre_artistico"
            className="campo"
            defaultValue={dj?.nombre_artistico}
            placeholder="Cómo te anuncian en el flyer"
            aria-invalid={!!estado.errores.nombre_artistico}
            required
          />
        </Campo>

        <Campo
          id="email"
          label="Tu mail *"
          error={estado.errores.email}
          ayuda="No se muestra en el perfil. Es para avisarte de los contactos."
        >
          <input
            id="email"
            name="email"
            type="email"
            className="campo"
            defaultValue={dj?.email}
            placeholder="vos@mail.com"
            aria-invalid={!!estado.errores.email}
            required
          />
        </Campo>
      </div>

      <Campo id="ciudad" label="Dónde tocás *" error={estado.errores.ciudad}>
        <select
          id="ciudad"
          name="ciudad"
          className="campo"
          defaultValue={dj?.ciudad ?? ""}
          aria-invalid={!!estado.errores.ciudad}
          required
        >
          <option value="" disabled>
            Elegí tu zona
          </option>
          {CIUDADES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Campo>

      <Campo
        id="estilos-grupo"
        label={`Estilos * — ${estilos.length} de 3`}
        error={estado.errores.estilos}
        ayuda="Elegí hasta 3. Menos estilos, mejor te encuentran."
      >
        <div id="estilos-grupo" className="flex flex-wrap gap-2 mt-1">
          {ESTILOS.map((e) => {
            const activo = estilos.includes(e);
            const bloqueado = !activo && estilos.length >= 3;
            return (
              <button
                key={e}
                type="button"
                onClick={() => alternar(e)}
                aria-pressed={activo}
                disabled={bloqueado}
                className={`font-mono text-[11px] tracking-[0.06em] uppercase px-3 py-2 rounded-sm border transition-colors ${
                  activo
                    ? "bg-sync text-ink border-sync font-semibold"
                    : bloqueado
                      ? "border-linea text-steel-2 opacity-40 cursor-not-allowed"
                      : "border-linea-fuerte text-steel hover:border-sync hover:text-sync"
                }`}
              >
                {e}
              </button>
            );
          })}
        </div>
      </Campo>

      <Campo
        id="set_url"
        label="Link a un set *"
        error={estado.errores.set_url}
        ayuda="SoundCloud, YouTube o Mixcloud. Es lo primero que escucha una productora."
      >
        <input
          id="set_url"
          name="set_url"
          type="url"
          className="campo"
          defaultValue={dj?.set_url ?? ""}
          placeholder="https://soundcloud.com/tu-usuario/tu-set"
          aria-invalid={!!estado.errores.set_url}
          required
        />
      </Campo>

      <Campo
        id="bio"
        label="Bio"
        error={estado.errores.bio}
        ayuda="Máximo 400 caracteres. Qué tocás y para qué tipo de noche."
      >
        <textarea
          id="bio"
          name="bio"
          className="campo min-h-24 resize-y"
          defaultValue={dj?.bio}
          maxLength={400}
          placeholder="Techno hipnótico, sets largos. Residente de un ciclo en Chacarita."
        />
      </Campo>

      <div className="grid sm:grid-cols-2 gap-5">
        <Campo
          id="cache_min"
          label="Caché desde"
          error={estado.errores.cache_min}
          ayuda="En pesos. Opcional, pero ayuda a que te contacten por fechas reales."
        >
          <input
            id="cache_min"
            name="cache_min"
            inputMode="numeric"
            className="campo font-mono"
            defaultValue={dj?.cache_min ?? ""}
            placeholder="80000"
          />
        </Campo>

        <Campo id="cache_max" label="Caché hasta" error={estado.errores.cache_max}>
          <input
            id="cache_max"
            name="cache_max"
            inputMode="numeric"
            className="campo font-mono"
            defaultValue={dj?.cache_max ?? ""}
            placeholder="180000"
          />
        </Campo>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Campo id="instagram" label="Instagram" error={estado.errores.instagram}>
          <input
            id="instagram"
            name="instagram"
            className="campo"
            defaultValue={dj?.instagram ?? ""}
            placeholder="tuusuario"
          />
        </Campo>

        <Campo id="rider" label="Rider técnico" ayuda="Qué necesitás para tocar.">
          <input
            id="rider"
            name="rider"
            className="campo"
            defaultValue={dj?.rider ?? ""}
            placeholder="2 CDJ + mixer"
          />
        </Campo>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-linea">
        <div className="pt-5">
          <Enviar>{dj ? "Guardar cambios" : "Enviar mi perfil"}</Enviar>
        </div>
      </div>

      <p className="font-mono text-[10.5px] text-steel-2 leading-relaxed max-w-[64ch]">
        Al enviar aceptás que mostremos tu nombre, ciudad, estilos, bio, caché y
        links en tu perfil público. Tu mail no se publica. Podés pedir que
        borremos todo escribiéndonos.
      </p>
    </form>
  );
}
