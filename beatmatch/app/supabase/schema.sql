-- ═══════════════════════════════════════════════════════════════════
-- BEATMATCH — esquema de la Fase 02
--
-- Pegar entero en el SQL Editor de Supabase y ejecutar. Es idempotente:
-- se puede correr más de una vez sin romper nada.
-- ═══════════════════════════════════════════════════════════════════

-- gen_random_uuid() es núcleo desde PostgreSQL 13, no hace falta pgcrypto.

-- ── DJs ────────────────────────────────────────────────────────────

create table if not exists public.djs (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nombre_artistico  text not null,
  -- Privado. Ver los permisos por columna más abajo.
  email             text not null,
  ciudad            text not null,
  bio               text not null default '',
  estilos           text[] not null default '{}',
  cache_min         integer,
  cache_max         integer,
  instagram         text,
  set_url           text,
  foto_url          text,
  rider             text,
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente','publicado','rechazado','pausado')),
  -- Permite editar el perfil sin cuenta, vía link con token.
  -- Es un secreto: quien lo tiene puede modificar el perfil.
  edit_token        text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint cache_coherente check (
    cache_min is null or cache_max is null or cache_min <= cache_max
  )
);

create index if not exists djs_estado_idx  on public.djs (estado);
create index if not exists djs_ciudad_idx  on public.djs (ciudad);
create index if not exists djs_estilos_idx on public.djs using gin (estilos);
create index if not exists djs_creado_idx  on public.djs (created_at desc);

-- ── Contactos ──────────────────────────────────────────────────────
-- La tabla más valiosa del negocio: acá vive la métrica norte
-- (contactos que terminan en booking) y los datos con los que se
-- fundamenta la comisión de la Fase 03.

create table if not exists public.contactos (
  id                 uuid primary key default gen_random_uuid(),
  dj_id              uuid not null references public.djs(id) on delete cascade,
  productora_nombre  text not null,
  productora_email   text not null,
  fecha_evento       date,
  tipo_evento        text not null default 'otro'
                     check (tipo_evento in ('boliche','fiesta','bar','corporativo','casamiento','otro')),
  presupuesto        integer,
  mensaje            text not null,
  estado             text not null default 'enviado'
                     check (estado in ('enviado','respondido','concretado','caido')),
  created_at         timestamptz not null default now()
);

create index if not exists contactos_dj_idx     on public.contactos (dj_id);
create index if not exists contactos_creado_idx on public.contactos (created_at desc);
create index if not exists contactos_email_idx  on public.contactos (productora_email, created_at desc);

-- ── updated_at automático ──────────────────────────────────────────

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists djs_updated_at on public.djs;
create trigger djs_updated_at
  before update on public.djs
  for each row execute function public.tocar_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- SEGURIDAD
--
-- La app escribe siempre desde el servidor con la service role, que
-- saltea RLS. Todo lo de abajo protege el caso en que alguien use la
-- anon key directamente: es pública, viaja al navegador.
--
-- Punto clave: **RLS filtra FILAS, no COLUMNAS.** Una política de
-- lectura sobre `djs` dejaría ver la fila entera de un perfil
-- publicado, incluidos `email` y `edit_token`. Con el token, cualquiera
-- podría editar cualquier perfil.
--
-- Por eso además de RLS hay permisos por columna: es lo único que
-- impide leer esas dos columnas con la anon key.
-- ═══════════════════════════════════════════════════════════════════

alter table public.djs       enable row level security;
alter table public.contactos enable row level security;

-- ── service_role ───────────────────────────────────────────────────
-- Es el rol con el que escribe la app desde el servidor. Supabase suele
-- otorgarle permisos por defecto, pero se hace explícito: si los
-- defaults cambian o el esquema se aplica en otra instancia, la app
-- tiene que seguir funcionando.

grant all on public.djs       to service_role;
grant all on public.contactos to service_role;

-- ── djs ────────────────────────────────────────────────────────────

-- Se parte de cero y se otorga solo lo público, columna por columna.
revoke all on public.djs from anon, authenticated;

grant select (
  id, slug, nombre_artistico, ciudad, bio, estilos,
  cache_min, cache_max, instagram, set_url, foto_url, rider,
  estado, created_at, updated_at
) on public.djs to anon, authenticated;
-- Quedan fuera a propósito: email, edit_token.

-- Solo filas publicadas.
drop policy if exists "lectura publica de perfiles publicados" on public.djs;
create policy "lectura publica de perfiles publicados"
  on public.djs for select
  to anon, authenticated
  using (estado = 'publicado');

-- Sin políticas de insert/update/delete, RLS las deniega por defecto.
-- Las altas y ediciones pasan por el servidor, que valida y usa la
-- service role.

-- ── contactos ──────────────────────────────────────────────────────
-- Nada es público: hay datos de la productora y el presupuesto del
-- evento. Sin grants y sin políticas, la anon key no puede tocarla.

revoke all on public.contactos from anon, authenticated;

-- ── Vista pública ──────────────────────────────────────────────────
-- Atajo cómodo para consultar desde el navegador. security_invoker
-- hace que los permisos se evalúen como el usuario que consulta, así
-- que hereda los grants por columna y la política de arriba: no es una
-- puerta trasera.

create or replace view public.djs_publicos
with (security_invoker = true) as
  select
    id, slug, nombre_artistico, ciudad, bio, estilos,
    cache_min, cache_max, instagram, set_url, foto_url, rider,
    created_at
  from public.djs
  where estado = 'publicado';

grant select on public.djs_publicos to anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════════════
-- Comprobaciones
-- ═══════════════════════════════════════════════════════════════════

-- 1. Las dos tablas existen y están vacías:
--    select count(*) from public.djs;
--    select count(*) from public.contactos;

-- 2. RLS activo en ambas (rls_enabled debe dar true en las dos):
--    select relname, relrowsecurity as rls_enabled
--    from pg_class
--    where relname in ('djs','contactos');

-- 3. anon NO puede leer email ni edit_token (debe devolver 0 filas):
--    select column_name
--    from information_schema.column_privileges
--    where grantee = 'anon'
--      and table_name = 'djs'
--      and column_name in ('email','edit_token');

-- Para el chequeo completo desde la app:
--    node scripts/verificar-supabase.mjs
