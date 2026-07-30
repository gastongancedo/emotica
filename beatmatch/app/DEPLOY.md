# Poner Beatmatch online

Dos servicios, los dos gratis. **El orden importa**: si deployás antes de
tener la base, la app no arranca — y eso es a propósito.

Tiempo real: unos 25 minutos.

---

> **Lo que ya está probado:** el esquema se ejecutó contra un PostgreSQL 16
> real y se verificó que el rol `anon` —el que viaja al navegador— sea
> rechazado al intentar leer `email`, `edit_token`, la tabla completa y
> los contactos, y al intentar insertar, actualizar o borrar. También que
> `service_role` sí pueda escribir, que el trigger de `updated_at` corra y
> que borrar un DJ arrastre sus contactos.

---

## Paso 1 · La base de datos (Supabase)

1. Entrá a [supabase.com](https://supabase.com) → **New project**.
2. Datos del proyecto:
   - **Name**: `beatmatch`
   - **Database Password**: generala y guardala en algún lado. No la vas a
     necesitar para esto, pero perderla es un dolor de cabeza después.
   - **Region**: `South America (São Paulo)` — es la más cercana, y son
     ~150 ms menos en cada consulta que si elegís una de EE.UU.
3. Esperá a que termine de crearse (1–2 min).

### Armar las tablas — un solo comando

**Project Settings** → **Database** → **Connection string** → **URI**.
Copiala y reemplazá `[YOUR-PASSWORD]` por la contraseña del paso 2.

```bash
cd beatmatch/app
npm install
npm run instalar-base -- "postgresql://postgres:TU-CLAVE@db.xxxx.supabase.co:5432/postgres"
```

Aplica el esquema entero y después comprueba que haya quedado bien
cerrado. Tiene que terminar en **"La base quedó lista"**. Es seguro
correrlo más de una vez.

<details>
<summary>Si preferís hacerlo a mano</summary>

Barra izquierda → **SQL Editor** → **New query** → pegá todo
`supabase/schema.sql` → **Run**. Tiene que decir *Success. No rows
returned*.
</details>

### Copiar las credenciales

**Project Settings** (el engranaje) → **API Keys**. Vas a necesitar tres
cosas:

| Dónde | Qué |
|---|---|
| Project URL | `https://xxxxx.supabase.co` |
| `anon` `public` | clave larga que empieza con `eyJ…` |
| `service_role` `secret` | otra clave `eyJ…`, está oculta detrás de *Reveal* |

> 🔴 **La `service_role` saltea todas las reglas de seguridad de la base.**
> Nunca la pegues en un chat, en un issue, ni en el código. Solo va en las
> variables de entorno de Vercel y en tu `.env.local`.

### Comprobar desde afuera

`instalar-base` revisa la base por dentro. Este otro la revisa **como lo
haría un atacante**, usando la clave pública contra la API:

```bash
cp .env.example .env.local     # completá las tres claves
npm run verificar
```

Comprueba que la clave pública **no pueda leer el mail ni el `edit_token`
de los DJs**. Con ese token, cualquiera podría editar el perfil de
cualquiera.

Tienen que pasar las 10 comprobaciones.

---

## Paso 2 · El hosting (Vercel)

1. Entrá a [vercel.com](https://vercel.com) y logueate **con GitHub**.
2. **Add New** → **Project** → importá `gastongancedo/emotica`.
3. ⚠️ **Root Directory**: apretá *Edit* y poné **`beatmatch/app`**.

   Es el paso que se pasa por alto. La app no está en la raíz del repo;
   si lo dejás vacío, Vercel busca un `package.json` que no existe ahí y
   el build falla.

4. **Framework Preset** debería detectar *Next.js* solo.
5. Desplegá **Environment Variables** y cargá estas cinco:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | la Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clave `anon public` |
| `SUPABASE_SERVICE_ROLE_KEY` | la clave `service_role` |
| `ADMIN_KEY` | inventá una larga, no uses `beatmatch` |
| `NEXT_PUBLIC_SITE_URL` | `https://beatmatch.vercel.app` (ajustá al dominio que te dé) |

6. **Deploy**.

### Sobre `ADMIN_KEY`

Es lo único que protege `/admin`, donde se ven los mails de los DJs y los
presupuestos de las productoras. Sin la variable, **el panel queda
cerrado** en vez de caer a una clave por defecto: un panel con clave
adivinable es peor que un panel apagado.

### Sobre `NEXT_PUBLIC_SITE_URL`

Con esto se arman los links de edición que reciben los DJs. Si queda mal,
los links apuntan a `localhost` y el DJ no puede editar nada. Cuando
sepas la URL final, corregila y volvé a deployar.

---

## Paso 3 · Probar que anduvo

En orden, sobre la URL que te dio Vercel:

- [ ] `/` carga y dice **0 DJs publicados** — correcto, la base arranca vacía
- [ ] `/djs` muestra el buscador con el cartel de archivo vacío
- [ ] **No aparece** la barra naranja de "MODO LOCAL". Si aparece, las
      variables de Supabase no llegaron
- [ ] `/registro` — cargá un perfil de prueba con tus datos
- [ ] Guardate el link de edición que te muestra y comprobá que abre
- [ ] `/admin` con tu `ADMIN_KEY` → aparece el perfil como pendiente →
      **Publicar**
- [ ] `/djs` ahora lo muestra
- [ ] Entrá al perfil y mandate una propuesta de contacto a vos mismo
- [ ] Volvé a `/admin` y verificá que el contacto llegó
- [ ] Borrá el perfil de prueba antes de compartir el link

Si algo falla, el error está en Vercel → tu proyecto → **Logs**. Los
mensajes de la app explican qué falta.

---

## Antes de mandarle el link a un DJ real

- [ ] **La base tiene que estar vacía de perfiles inventados.** Si en algún
      momento corriste la app en modo local, esos 8 perfiles de ejemplo
      son solo del archivo local y no llegan a Supabase — pero verificá
      igual en `/admin`. Un buscador con DJs falsos destruye la confianza
      de una productora en el primer minuto.
- [ ] **Política de privacidad.** La app pide nombre, mail, fecha de
      nacimiento y datos económicos. Hoy no hay política publicada ni
      casilla de consentimiento: es la Ley 25.326, y es la misma deuda que
      arrastra la landing de la Fase 01. Es lo que yo pondría primero
      después del deploy.
- [ ] Verificar la marca en INPI y el usuario de Instagram antes de
      difundir el link.

---

## Lo que todavía no hace

- **No manda mails.** Cuando una productora contacta, el DJ no se entera
  solo: hay que mirar `/admin` y avisarle. La app lo dice en pantalla en
  vez de simular que el mail salió. `contactos` ya guarda todo lo
  necesario para automatizarlo con Resend.
- **No hay cuentas.** El DJ edita su perfil con un link con token. Si lo
  pierde, se lo regenerás a mano desde la base. Aguanta con 50 perfiles,
  no con 500.

---

## Costos

| | Plan | Alcanza para |
|---|---|---|
| Supabase | Free | 500 MB de base — miles de perfiles |
| Vercel | Hobby | 100 GB de tráfico al mes |

**USD 0** hasta tener tracción real. El único gasto es el dominio propio
si querés dejar de usar `.vercel.app`: unos USD 10–25 al año en
[nic.ar](https://nic.ar).

> Supabase pausa los proyectos gratuitos tras una semana sin actividad.
> Con tráfico real no pasa; si vas a estar sin moverlo, entrá al panel de
> vez en cuando.
