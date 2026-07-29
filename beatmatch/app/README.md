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

4. Reiniciar. La barra naranja desaparece: ya está usando Postgres.

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` nunca lleva el prefijo `NEXT_PUBLIC_`.**
> Todo lo que empieza con `NEXT_PUBLIC_` viaja al navegador, y esa clave
> saltea todas las políticas de seguridad.

### Sobre las políticas de RLS

Las políticas del `schema.sql` existen por si alguien usa la anon key
directamente. Hay un detalle que conviene entender: **RLS filtra filas,
no columnas.** La política de lectura pública deja ver la fila entera de
un perfil publicado, incluidos `email` y `edit_token`.

Por eso el esquema define la vista `djs_publicos`, que es lo único que
debería consultar el navegador. La app no la usa —lee todo desde el
servidor con la service role— pero está ahí para cuando haya consultas
desde el cliente.

---

## Probar que sigue funcionando

```bash
npm run build
npx next start -p 3211 &
node tests/flujos.mjs
```

Recorre los 15 casos que importan: filtros, alta, validación del
servidor, moderación, contacto, edición con token y rechazo de token
inválido. Incluye dos que verifican que **el perfil público no filtre el
mail ni el token de edición del DJ** — esa fue una fuga real que se
encontró justamente con esta prueba.

---

## Antes de salir a testear

- [ ] **Borrar los perfiles de ejemplo.** Un buscador con DJs inventados
      es lo que destruye la confianza de una productora. Vaciá
      `data/beatmatch.json` o rechazalos desde `/admin`.
- [ ] Cambiar `ADMIN_KEY`.
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
supabase/schema.sql         tablas, índices, RLS y vista pública
tests/flujos.mjs            recorrido de los 15 flujos
```

Los tramos de caché de `taxonomia.ts` son **los mismos de la P19 de la
encuesta**, a propósito: así los datos que salgan del buscador y los del
estudio descriptivo se pueden cruzar.
