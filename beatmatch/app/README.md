# Beatmatch — app web (Fase 02)

Buscador de DJs con perfiles públicos y contacto directo. Es la primera
versión pensada **para salir a testear con gente real**, no la plataforma
completa del plan de producto.

---

## Arrancar

```bash
npm install
npm run dev          # http://localhost:3000
```

**No hace falta configurar nada.** Sin variables de entorno la app guarda
todo en `data/beatmatch.json` y se siembra con 8 perfiles de ejemplo, así
que el buscador no nace vacío. Vas a ver una barra naranja arriba
avisando que está en modo local.

Para entrar a `/admin` la clave por defecto es `beatmatch`.

---

## Qué hace

| Ruta | Qué es |
|---|---|
| `/` | Portada con el archivo y los estilos que ya tienen gente |
| `/djs` | Buscador con filtros de estilo, ciudad y presupuesto. Los filtros van en la URL, así que un resultado se puede compartir |
| `/dj/[slug]` | Perfil público con el set embebido y el formulario de contacto |
| `/dj/[slug]/editar?token=…` | Edición del perfil por el propio DJ |
| `/registro` | Alta de perfil |
| `/admin` | Moderación de perfiles y seguimiento de contactos |

---

## Dos decisiones que se apartan del plan de producto

Las dos apuntan a lo mismo: **poder testear esta semana**. Conviene
revisarlas cuando el test diga algo.

### 1. No hay cuentas ni magic links

El plan preveía registro con enlace mágico. Para el primer test es la
fricción que hace que un DJ no cargue el perfil y que una productora no
escriba.

En su lugar: el DJ carga su ficha y recibe **un link con un token** que
es lo único que permite editarla. La productora contacta sin registrarse.

El costo: si el DJ pierde el link, hay que regenerárselo a mano. Es
asumible con 50 perfiles; no lo es con 500. Cuando el volumen moleste,
ahí entra el enlace mágico.

### 2. No se manda ningún mail

No hay servicio de correo conectado. Los avisos hay que darlos a mano
mirando `/admin`. La app lo dice en pantalla en vez de simular que el
mail salió.

Es lo primero que conviene sumar después del test: `contactos` ya guarda
todo lo necesario.

---

## Poner esto online

Guía paso a paso en **[DEPLOY.md](./DEPLOY.md)**: Supabase primero, Vercel
después, con las variables exactas y la checklist de verificación.

---

## Conectar Supabase

La app habla con una interfaz (`src/lib/db/index.ts`) que tiene dos
implementaciones. **Conectar Supabase no toca ni una página.**

1. Crear un proyecto en Supabase.
2. Pegar `supabase/schema.sql` entero en el SQL Editor y ejecutar.
3. Copiar `.env.example` a `.env.local` y completar:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_KEY=algo-que-no-sea-beatmatch
NEXT_PUBLIC_SITE_URL=https://tu-dominio
```

4. Comprobar que quedó bien cerrada:

```bash
npm run verificar
```

   Verifica que las tablas existan y —lo importante— que la clave pública
   **no pueda leer el mail ni el `edit_token`** de los DJs.

5. Reiniciar. La barra naranja desaparece: ya está usando Postgres.

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` nunca lleva el prefijo `NEXT_PUBLIC_`.**
> Todo lo que empieza con `NEXT_PUBLIC_` viaja al navegador, y esa clave
> saltea todas las políticas de seguridad.

### Sobre las políticas de RLS

Las políticas del `schema.sql` existen por si alguien usa la anon key
directamente. Hay un detalle que decide el diseño: **RLS filtra filas, no
columnas.** Una política de lectura sobre `djs` dejaría ver la fila
entera de un perfil publicado, incluidos `email` y `edit_token` — y con
ese token cualquiera podría editar cualquier perfil.

Por eso el esquema no se apoya solo en RLS: revoca todo sobre `djs` y
después otorga `select` **columna por columna**, dejando `email` y
`edit_token` afuera. Eso es lo único que realmente impide leerlos con la
anon key. `npm run verificar` comprueba exactamente eso.

---

## Probar que sigue funcionando

```bash
rm -f data/beatmatch.json
npm run build
BEATMATCH_ALMACEN=archivo ADMIN_KEY=beatmatch \
  NEXT_PUBLIC_SITE_URL=http://localhost:3211 npx next start -p 3211 &
node tests/flujos.mjs
```

Recorre los 16 casos que importan: filtros, alta, validación del
servidor, moderación, contacto, edición con token y rechazo de token
inválido. Tres verifican que **el perfil público no filtre el mail ni el
token de edición del DJ** — esa fue una fuga real que se encontró
justamente con esta prueba.

> ⚠️ **Corré la prueba contra `next start`, no contra `next dev`.**
>
> El servidor de desarrollo instrumenta las lecturas de disco y mete el
> contenido entero de `data/beatmatch.json` —mails y `edit_token` de todos
> los perfiles— dentro del payload RSC de cualquier página que consulte la
> base. Es un artefacto del modo dev y no ocurre en el build de
> producción (está verificado en los 16 casos), pero implica una regla
> operativa: **nunca expongas un `next dev` a internet.**

`BEATMATCH_ALMACEN=archivo` existe solo para esto: permite el almacén de
archivo en un build de producción local. En un deploy no va nunca — sin
ella, la app se niega a arrancar en producción sin base de datos, en vez
de aceptar perfiles y perderlos.

---

## Antes de salir a testear

- [ ] **Borrar los perfiles de ejemplo.** Un buscador con DJs inventados
      es lo que destruye la confianza de una productora. Vaciá
      `data/beatmatch.json` o rechazalos desde `/admin`.
- [ ] Definir `ADMIN_KEY`. Sin la variable, en producción el panel queda
      **cerrado** en lugar de caer a una clave por defecto adivinable.
- [ ] Poner `NEXT_PUBLIC_SITE_URL` con el dominio real, o los links de
      edición van a salir apuntando a `localhost`.
- [ ] Conectar Supabase. **En Vercel el filesystem es de solo lectura: el
      modo local no funciona en producción**, se pierde todo.
- [ ] Escribir la política de privacidad y enlazarla desde los
      formularios. Hoy la app capta datos personales sin ella — es la
      misma deuda que arrastra la landing de la Fase 01.

---

## Estructura

```
src/
├── app/
│   ├── actions.ts          server actions: alta, edición, contacto, moderación
│   ├── page.tsx            portada
│   ├── djs/                buscador
│   ├── dj/[slug]/          perfil público + edición
│   ├── registro/
│   └── admin/
├── components/             tarjeta de DJ y los dos formularios
└── lib/
    ├── db/
    │   ├── index.ts        interfaz del almacén + selección de adaptador
    │   ├── file.ts         JSON en disco (desarrollo)
    │   ├── supabase.ts     Postgres (producción)
    │   └── demo.ts         perfiles de ejemplo
    ├── taxonomia.ts        estilos, ciudades, tramos de caché
    ├── validar.ts          validación del servidor
    └── types.ts
supabase/schema.sql         tablas, índices, RLS y permisos por columna
scripts/verificar-supabase.mjs  chequea que la base quedó bien cerrada
tests/flujos.mjs            recorrido de los 16 flujos
DEPLOY.md                   guía de Supabase + Vercel
```

Los tramos de caché de `taxonomia.ts` son **los mismos de la P19 de la
encuesta**, a propósito: así los datos que salgan del buscador y los del
estudio descriptivo se pueden cruzar.
