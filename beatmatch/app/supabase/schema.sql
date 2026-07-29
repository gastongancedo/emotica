-- ═══════════════════════════════════════════════════════════════════
-- BEATMATCH — esquema de la Fase 02
-- Pegar entero en el SQL Editor de Supabase y ejecutar.
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── DJs ────────────────────────────────────────────────────────────

create table if not exists public.djs (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nombre_artistico  text not null,
  -- Privado. Nunca se expone por la política de lectura pública.
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
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists djs_updated_at on public.djs;
create trigger djs_updated_at
  before update on public.djs
  for each row execute function public.tocar_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
--
-- La app escribe siempre desde el servidor con la service role, que
-- saltea RLS. Estas políticas existen para que la anon key, que viaja
-- al navegador, no pueda hacer daño si alguien la usa directo.
-- ═══════════════════════════════════════════════════════════════════

alter table public.djs       enable row level security;
alter table public.contactos enable row level security;

-- Cualquiera puede leer los perfiles publicados.
--
-- ⚠️ RLS filtra FILAS, no COLUMNAS: esta política deja ver también
-- `email` y `edit_token` de los perfiles publicados a quien use la
-- anon key. Para exponer datos al navegador hay que consultar la
-- vista `djs_publicos` de abajo, no la tabla.
drop policy if exists "lectura publica de perfiles publicados" on public.djs;
create policy "lectura publica de perfiles publicados"
  on public.djs for select
  using (estado = 'publicado');

-- Nadie escribe con la anon key. Las altas y ediciones pasan por el
-- servidor, que valida y usa la service role.
drop policy if exists "sin escritura anonima en djs" on public.djs;
create policy "sin escritura anonima en djs"
  on public.djs for insert
  with check (false);

-- Los contactos no son públicos: contienen datos de la productora y el
-- presupuesto del evento.
drop policy if exists "sin lectura anonima de contactos" on public.contactos;
create policy "sin lectura anonima de contactos"
  on public.contactos for select
  using (false);

drop policy if exists "sin escritura anonima en contactos" on public.contactos;
create policy "sin escritura anonima en contactos"
  on public.contactos for insert
  with check (false);

-- ── Vista pública ──────────────────────────────────────────────────
-- Esto es lo único que puede tocar el navegador con la anon key.

create or replace view public.djs_publicos
with (security_invoker = true) as
  select
    id, slug, nombre_artistico, ciudad, bio, estilos,
    cache_min, cache_max, instagram, set_url, foto_url, rider,
    created_at
  from public.djs
  where estado = 'publicado';

grant select on public.djs_publicos to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- Comprobación rápida
-- ═══════════════════════════════════════════════════════════════════
-- select count(*) from public.djs;
-- select * from public.djs_publicos limit 5;
