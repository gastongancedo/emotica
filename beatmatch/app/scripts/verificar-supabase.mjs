/**
 * Comprueba que la base de Supabase quedó bien armada.
 *
 *   node scripts/verificar-supabase.mjs
 *
 * Lee .env.local. Correlo después de ejecutar supabase/schema.sql y antes
 * de deployar: verifica que las tablas existan y —lo más importante— que
 * la anon key NO pueda leer el email ni el edit_token de los DJs.
 */

import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  console.log("Aviso: no encontré .env.local, uso las variables del entorno.\n");
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const resultados = [];
const anotar = (ok, nombre, detalle = "") =>
  resultados.push({ ok, nombre, detalle });

// ── Variables de entorno ───────────────────────────────────────────

anotar(!!URL, "NEXT_PUBLIC_SUPABASE_URL definida");
anotar(!!ANON, "NEXT_PUBLIC_SUPABASE_ANON_KEY definida");
anotar(!!SERVICE, "SUPABASE_SERVICE_ROLE_KEY definida");

if (!URL || !SERVICE) {
  imprimir();
  console.log(
    "\nFaltan credenciales. Copiá .env.example a .env.local y completalo.",
  );
  process.exit(1);
}

anotar(
  !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  "la service role NO está expuesta como NEXT_PUBLIC_",
  "todo lo que empieza con NEXT_PUBLIC_ viaja al navegador",
);

const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

// ── Tablas ─────────────────────────────────────────────────────────

for (const tabla of ["djs", "contactos"]) {
  const { error } = await admin.from(tabla).select("id", { head: true, count: "exact" });
  anotar(!error, `la tabla "${tabla}" existe`, error?.message ?? "");
}

// ── Vista pública ──────────────────────────────────────────────────

{
  const { error } = await admin.from("djs_publicos").select("id", { head: true });
  anotar(!error, 'la vista "djs_publicos" existe', error?.message ?? "");
}

// ── Lo que importa: qué ve la anon key ─────────────────────────────

if (ANON) {
  const publico = createClient(URL, ANON, { auth: { persistSession: false } });

  // Debe fallar: email no está entre las columnas otorgadas.
  {
    const { error } = await publico.from("djs").select("email").limit(1);
    anotar(
      !!error,
      "la anon key NO puede leer djs.email",
      error ? "" : "⚠️ EXPUESTO: revisá los grants por columna del schema.sql",
    );
  }

  // Debe fallar: con el token cualquiera editaría cualquier perfil.
  {
    const { error } = await publico.from("djs").select("edit_token").limit(1);
    anotar(
      !!error,
      "la anon key NO puede leer djs.edit_token",
      error ? "" : "⚠️ EXPUESTO: cualquiera podría editar cualquier perfil",
    );
  }

  // Debe fallar: hay datos de la productora y presupuestos.
  {
    const { data, error } = await publico.from("contactos").select("id").limit(1);
    anotar(
      !!error || (data ?? []).length === 0,
      "la anon key NO puede leer contactos",
      error || (data ?? []).length === 0 ? "" : "⚠️ EXPUESTO",
    );
  }

  // Debe funcionar: es lo que la app necesita mostrar.
  {
    const { error } = await publico
      .from("djs")
      .select("nombre_artistico, ciudad, estilos")
      .limit(1);
    anotar(!error, "la anon key SÍ puede leer los campos públicos", error?.message ?? "");
  }

  // Debe fallar: las altas pasan por el servidor.
  {
    const { error } = await publico.from("djs").insert({
      slug: `prueba-${Date.now()}`,
      nombre_artistico: "Prueba de permisos",
      email: "no@debe.entrar",
      ciudad: "CABA",
      edit_token: "x",
    });
    anotar(
      !!error,
      "la anon key NO puede insertar perfiles",
      error ? "" : "⚠️ EXPUESTO: se pudo insertar sin pasar por el servidor",
    );
  }
}

imprimir();

function imprimir() {
  console.log("");
  for (const r of resultados) {
    const marca = r.ok ? "  OK  " : " FALLA";
    console.log(`${marca}  ${r.nombre}${r.detalle ? `\n         ${r.detalle}` : ""}`);
  }
  const fallas = resultados.filter((r) => !r.ok);
  console.log(
    `\n${resultados.length - fallas.length}/${resultados.length} comprobaciones pasaron`,
  );
  if (fallas.length) {
    console.log("\nRevisá supabase/schema.sql y volvé a ejecutarlo completo.");
  } else {
    console.log("\nLa base está lista. Ya podés deployar.");
  }
}

process.exit(resultados.some((r) => !r.ok) ? 1 : 0);
