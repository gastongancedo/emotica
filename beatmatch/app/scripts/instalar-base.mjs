/**
 * Arma la base de datos de Beatmatch en Supabase, de una.
 *
 *   node scripts/instalar-base.mjs "postgresql://postgres:CLAVE@db.xxxx.supabase.co:5432/postgres"
 *
 * La connection string sale de Supabase → Project Settings → Database →
 * Connection string → URI. Si no la pasás como argumento, la busca en
 * DATABASE_URL (también lee .env.local).
 *
 * Qué hace:
 *   1. Aplica supabase/schema.sql completo
 *   2. Comprueba que la anon key NO pueda leer email ni edit_token
 *   3. Deja la base vacía y lista
 *
 * Es seguro correrlo más de una vez: el esquema es idempotente y no borra
 * datos existentes.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* sin .env.local, se usa el argumento o el entorno */
}

const conexion = process.argv[2] || process.env.DATABASE_URL;

if (!conexion) {
  console.error(`
Falta la connection string de Supabase.

  node scripts/instalar-base.mjs "postgresql://postgres:CLAVE@db.xxxx.supabase.co:5432/postgres"

La sacás de: Supabase → tu proyecto → Project Settings → Database →
Connection string → URI. Acordate de reemplazar [YOUR-PASSWORD] por la
contraseña que definiste al crear el proyecto.
`);
  process.exit(1);
}

const paso = (n, t) => console.log(`\n[${n}] ${t}`);
const ok = (t) => console.log(`    OK    ${t}`);
const mal = (t) => console.log(`    FALLA ${t}`);

const cliente = new pg.Client({
  connectionString: conexion,
  // Supabase exige TLS; su certificado lo firma una CA que no siempre
  // está en el store de Node.
  ssl: conexion.includes("localhost") || conexion.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

let fallas = 0;

try {
  paso(1, "Conectando…");
  await cliente.connect();
  const { rows } = await cliente.query("select current_database() as db, version() as v");
  ok(`${rows[0].db} · ${rows[0].v.split(",")[0]}`);

  paso(2, "Aplicando supabase/schema.sql…");
  const sql = await readFile(path.join(process.cwd(), "supabase", "schema.sql"), "utf-8");
  await cliente.query(sql);
  ok("esquema aplicado");

  paso(3, "Comprobando que quedó bien cerrada…");

  // Las columnas privadas no deben estar otorgadas a anon.
  const filtradas = await cliente.query(`
    select column_name from information_schema.column_privileges
    where grantee = 'anon' and table_name = 'djs'
      and column_name in ('email','edit_token')`);
  if (filtradas.rowCount === 0) {
    ok("anon no puede leer email ni edit_token");
  } else {
    mal(`⚠️ EXPUESTO: anon puede leer ${filtradas.rows.map((r) => r.column_name).join(", ")}`);
    fallas++;
  }

  // Los campos públicos sí tienen que estar.
  const publicas = await cliente.query(`
    select count(*)::int as n from information_schema.column_privileges
    where grantee = 'anon' and table_name = 'djs'
      and column_name in ('nombre_artistico','ciudad','estilos')`);
  if (publicas.rows[0].n === 3) ok("anon sí puede leer los campos públicos");
  else { mal("a anon le faltan permisos sobre campos públicos"); fallas++; }

  // RLS activo en las dos tablas.
  const rls = await cliente.query(`
    select relname, relrowsecurity from pg_class
    where relname in ('djs','contactos') and relnamespace = 'public'::regnamespace`);
  const sinRls = rls.rows.filter((r) => !r.relrowsecurity).map((r) => r.relname);
  if (rls.rowCount === 2 && sinRls.length === 0) ok("RLS activo en djs y contactos");
  else { mal(`RLS faltante en: ${sinRls.join(", ") || "tablas no encontradas"}`); fallas++; }

  // contactos no debe tener ningún grant para anon.
  const cont = await cliente.query(`
    select count(*)::int as n from information_schema.table_privileges
    where grantee = 'anon' and table_name = 'contactos'`);
  if (cont.rows[0].n === 0) ok("anon no puede tocar contactos");
  else { mal("⚠️ EXPUESTO: anon tiene permisos sobre contactos"); fallas++; }

  // service_role tiene que poder escribir.
  const sr = await cliente.query(`
    select count(*)::int as n from information_schema.table_privileges
    where grantee = 'service_role' and table_name = 'djs' and privilege_type = 'INSERT'`);
  if (sr.rows[0].n > 0) ok("service_role puede escribir");
  else { mal("service_role no puede escribir: la app no va a poder guardar"); fallas++; }

  paso(4, "Estado de la base");
  const djs = await cliente.query("select count(*)::int as n from public.djs");
  const cs = await cliente.query("select count(*)::int as n from public.contactos");
  ok(`${djs.rows[0].n} perfiles · ${cs.rows[0].n} contactos`);
  if (djs.rows[0].n > 0) {
    console.log("    ⚠️  Hay perfiles cargados. Si son de prueba, borralos desde /admin");
    console.log("        antes de compartir el link: un buscador con DJs inventados");
    console.log("        destruye la confianza de una productora.");
  }
} catch (err) {
  mal(err instanceof Error ? err.message : String(err));
  fallas++;
} finally {
  await cliente.end().catch(() => {});
}

console.log("");
if (fallas === 0) {
  console.log("La base quedó lista.\n");
  console.log("Ahora, en Vercel:");
  console.log("  1. Importar el repo gastongancedo/emotica");
  console.log("  2. Root Directory = beatmatch/app   ← el paso que se olvida");
  console.log("  3. Cargar las variables (Project Settings → API Keys):");
  console.log("       NEXT_PUBLIC_SUPABASE_URL");
  console.log("       NEXT_PUBLIC_SUPABASE_ANON_KEY");
  console.log("       SUPABASE_SERVICE_ROLE_KEY");
  console.log("       ADMIN_KEY                 ← inventala, larga");
  console.log("       NEXT_PUBLIC_SITE_URL      ← la URL que te dé Vercel");
  console.log("\nDetalle completo en DEPLOY.md");
} else {
  console.log(`${fallas} comprobación(es) fallaron. Revisá los mensajes de arriba.`);
}
process.exit(fallas === 0 ? 0 : 1);
