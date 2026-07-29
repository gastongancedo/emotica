"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { enviarContacto } from "@/app/actions";
import { ESTADO_INICIAL } from "@/lib/form-estado";
import { TIPOS_EVENTO } from "@/lib/taxonomia";

/**
 * Solo los campos que el formulario necesita.
 *
 * ⚠️ NO recibir el objeto Dj completo: Next serializa las props de los
 * componentes de cliente dentro del HTML de la página, así que pasar el
 * registro entero publicaría el email y el edit_token del DJ en una
 * página pública. Con ese token cualquiera podría editar el perfil.
 */
export interface DjParaContacto {
  id: string;
  nombre_artistico: string;
  instagram: string | null;
}

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-secundario" disabled={pending}>
      {pending ? "Enviando…" : "Enviar propuesta"}
    </button>
  );
}

export function FormContacto({ dj }: { dj: DjParaContacto }) {
  const [estado, formAction] = useActionState(enviarContacto, ESTADO_INICIAL);

  if (estado.ok) {
    return (
      <div className="tarjeta p-6 flex flex-col gap-3">
        <p className="etiqueta text-sync">Propuesta enviada</p>
        <h3 className="titulo text-xl">Le llega a {dj.nombre_artistico}</h3>
        <p className="text-steel text-[14.5px] leading-relaxed">
          Queda registrada en Beatmatch. Si querés adelantarte, escribile
          directo:
        </p>
        <div className="flex flex-wrap gap-2">
          {dj.instagram && (
            <a
              href={`https://instagram.com/${dj.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-borde !py-2 !px-4 !text-[11px]"
            >
              @{dj.instagram}
            </a>
          )}
        </div>
        <p className="font-mono text-[10.5px] text-steel-2 leading-relaxed mt-1">
          El aviso automático por mail al DJ entra en la próxima versión. Por
          ahora lo avisamos a mano.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="tarjeta p-6 flex flex-col gap-5">
      <input type="hidden" name="dj_id" value={dj.id} />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-c">No completar</label>
        <input id="website-c" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <p className="etiqueta text-signal">Contactar</p>
        <h3 className="titulo text-xl mt-2">Contale de tu evento</h3>
      </div>

      {estado.mensaje && (
        <p className="error" role="alert">
          {estado.mensaje}
        </p>
      )}

      <div>
        <label htmlFor="productora_nombre" className="etiqueta-campo">
          Productora o tu nombre *
        </label>
        <input
          id="productora_nombre"
          name="productora_nombre"
          className="campo"
          placeholder="Ej: Vera Producciones"
          aria-invalid={!!estado.errores.productora_nombre}
          required
        />
        {estado.errores.productora_nombre && (
          <p className="error">{estado.errores.productora_nombre}</p>
        )}
      </div>

      <div>
        <label htmlFor="productora_email" className="etiqueta-campo">
          Tu mail *
        </label>
        <input
          id="productora_email"
          name="productora_email"
          type="email"
          className="campo"
          placeholder="vos@productora.com"
          aria-invalid={!!estado.errores.productora_email}
          required
        />
        {estado.errores.productora_email && (
          <p className="error">{estado.errores.productora_email}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha_evento" className="etiqueta-campo">
            Fecha del evento
          </label>
          <input
            id="fecha_evento"
            name="fecha_evento"
            type="date"
            className="campo"
            aria-invalid={!!estado.errores.fecha_evento}
          />
          {estado.errores.fecha_evento && (
            <p className="error">{estado.errores.fecha_evento}</p>
          )}
        </div>

        <div>
          <label htmlFor="tipo_evento" className="etiqueta-campo">
            Tipo
          </label>
          <select id="tipo_evento" name="tipo_evento" className="campo" defaultValue="fiesta">
            {TIPOS_EVENTO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="presupuesto" className="etiqueta-campo">
          Presupuesto
        </label>
        <input
          id="presupuesto"
          name="presupuesto"
          inputMode="numeric"
          className="campo font-mono"
          placeholder="150000"
        />
        <p className="font-mono text-[10.5px] text-steel-2 mt-1.5">
          En pesos. Decirlo de entrada ahorra tres mensajes.
        </p>
      </div>

      <div>
        <label htmlFor="mensaje" className="etiqueta-campo">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          className="campo min-h-28 resize-y"
          placeholder="Dónde es, qué horario, con quién más comparte line-up…"
          maxLength={1000}
          aria-invalid={!!estado.errores.mensaje}
          required
        />
        {estado.errores.mensaje && <p className="error">{estado.errores.mensaje}</p>}
      </div>

      <Enviar />
    </form>
  );
}
