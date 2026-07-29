import type { Metadata } from "next";

import { crearPerfilDj } from "@/app/actions";
import { FormPerfilDj } from "@/components/FormPerfilDj";

export const metadata: Metadata = {
  title: "Sumar mi perfil",
  description:
    "Cargá tu ficha de DJ en Beatmatch: estilo, ciudad, caché y un set. Te queda un link propio que funciona como presskit.",
};

export default function Registro() {
  return (
    <div className="py-12 max-w-3xl">
      <p className="etiqueta">Registro de DJ</p>
      <h1 className="titulo text-[clamp(30px,5vw,46px)] mt-3">
        Cargá tu ficha
      </h1>
      <p className="mt-5 text-[16px] text-steel leading-relaxed max-w-[60ch]">
        Cinco minutos. Te queda un perfil público con tu propio link, que podés
        mandar como presskit a cualquiera — no hace falta que la otra persona
        use Beatmatch.
      </p>

      <div className="mt-9">
        <FormPerfilDj accion={crearPerfilDj} />
      </div>
    </div>
  );
}
