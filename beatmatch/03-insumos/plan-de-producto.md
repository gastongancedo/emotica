# BEATMATCH — Plan de Producto: Web App + Base de Datos

*Documento técnico-funcional — Julio 2026*
*Continúa el doc de modelo de negocio. Acá se define QUÉ construir y CÓMO.*

---

## 1. Definición del producto (Fase 02 en detalle)

**Qué es:** una web app donde productoras buscan y filtran DJs, ven perfiles completos y los contactan. Los DJs gestionan su propio perfil.

**Qué NO es todavía:** no hay pagos, no hay booking formal, no hay reviews. Eso es Fase 03. Resistir la tentación de construirlo ahora.

### Usuarios y sus flujos

**DJ (lado oferta):**
1. Se registra con email → completa perfil → queda publicado.
2. Edita su perfil cuando quiere (nuevo set, cambio de caché, disponibilidad).
3. Recibe notificación por email cuando una productora lo contacta.

**Productora (lado demanda):**
1. Se registra con email → accede al buscador.
2. Filtra por estilo / ciudad / rango de presupuesto / fecha.
3. Ve perfiles → guarda favoritos → envía mensaje de contacto con datos del evento.

**Admin (vos):**
1. Panel para ver registros nuevos, moderar perfiles (aprobar/rechazar/editar), ver métricas básicas.
2. Al inicio esto puede ser directamente el panel de Supabase — no construir admin custom hasta que duela.

---

## 2. Alcance del MVP (qué entra y qué no)

### ✅ Entra

| Feature | Detalle |
|---|---|
| Registro/login | Email + password, o magic link (más simple, sin gestión de contraseñas) |
| Perfil DJ | Nombre artístico, foto, bio corta, estilos (multi-select), ciudad, rango de caché, links (SoundCloud/YouTube embebido, Instagram), rider simple (texto libre) |
| Buscador | Filtros: estilo, ciudad, rango de caché. Resultados en cards con foto, nombre, estilos y caché |
| Página de perfil pública | URL propia por DJ (`beatmatch.ar/dj/nombre`) — sirve además como presskit compartible, incentivo enorme para que el DJ complete su ficha |
| Contacto | Form dentro del perfil: fecha del evento, tipo, presupuesto, mensaje → llega por email al DJ con copia a admin |
| Moderación | Perfil nuevo entra como "pendiente", vos lo aprobás antes de publicarse |

### ❌ NO entra (y por qué)

- **Chat en tiempo real** → el email alcanza para validar. Un chat vacío da sensación de app muerta.
- **Filtro por disponibilidad/calendario** → los DJs no van a mantener un calendario actualizado al inicio. El campo "fecha del evento" en el form de contacto resuelve lo mismo.
- **Pagos** → Fase 03.
- **Reviews** → sin bookings no hay qué reviewar.
- **App móvil nativa** → web responsive alcanza. El uso va a ser 90% mobile, pero mobile *web*.
- **Matching automático** → primero búsqueda manual. El "algoritmo de matching" del pitch se construye cuando haya datos de qué matchea con qué.

---

## 3. Modelo de datos

```
profiles (extiende auth de Supabase)
├── id (uuid, FK a auth.users)
├── role: 'dj' | 'productora' | 'admin'
├── email
├── created_at

djs
├── id (uuid)
├── profile_id (FK → profiles)
├── nombre_artistico
├── slug (para la URL pública, único)
├── bio (text, máx ~400 chars)
├── foto_url
├── ciudad (FK → ciudades)
├── cache_min (int, ARS)
├── cache_max (int, ARS)
├── soundcloud_url / youtube_url / instagram_url
├── rider (text)
├── estado: 'pendiente' | 'publicado' | 'rechazado' | 'pausado'
├── created_at / updated_at

estilos
├── id
├── nombre  (Techno, House, Cachengue, Reggaetón, Cumbia, Disco, Funk, etc.)

dj_estilos (many-to-many)
├── dj_id (FK)
├── estilo_id (FK)

ciudades
├── id
├── nombre / provincia
  (precargar AMBA + capitales; permitir "otra")

productoras
├── id (uuid)
├── profile_id (FK → profiles)
├── nombre
├── ciudad
├── instagram_url (opcional)
├── created_at

contactos            ← la tabla más valiosa del negocio
├── id
├── productora_id (FK)
├── dj_id (FK)
├── fecha_evento (date)
├── tipo_evento ('boliche' | 'fiesta' | 'corporativo' | 'casamiento' | 'otro')
├── presupuesto (int, opcional)
├── mensaje (text)
├── estado: 'enviado' | 'respondido' | 'concretado' | 'caido'  (actualizado a mano al inicio)
├── created_at

favoritos
├── productora_id (FK)
├── dj_id (FK)
```

**Por qué `contactos` es la tabla clave:** ahí vive la métrica norte (contactos que terminan en booking) y los datos para la futura comisión: quién contrata a quién, a qué precio, para qué tipo de evento. Aunque el booking se cierre por WhatsApp, este registro es tu inteligencia de mercado.

---

## 4. Stack recomendado

| Capa | Elección | Por qué |
|---|---|---|
| Frontend + backend | **Next.js 15 (App Router)** | Un solo proyecto, server components para SEO de perfiles públicos (clave: que `beatmatch.ar/dj/fulano` indexe en Google), API routes para lógica |
| Base de datos + auth + storage | **Supabase** | Postgres real, auth con magic links out of the box, storage para fotos, panel admin gratis, Row Level Security para que cada DJ edite solo su perfil. Free tier sobra para el MVP |
| Estilos | **Tailwind CSS** | Rápido, y portás fácil los design tokens actuales (`--signal`, `--sync`, las tres tipografías) |
| Emails transaccionales | **Resend** | Free tier de 3.000 emails/mes, API simple |
| Hosting | **Vercel** | Deploy automático desde GitHub, free tier suficiente |
| Analytics | **Plausible o Umami** | Simple, sin cookies, o Google Analytics si preferís lo conocido |

**Costo mensual del MVP: USD 0** (todo en free tiers) hasta tener tracción real.

**Por qué no Airtable + Softr:** lo evaluamos en el doc anterior como opción no-code, pero dado que manejás Claude Code, el stack Next.js + Supabase te da URL propias por DJ (SEO), control total del diseño (el branding de Beatmatch es fuerte y un template lo licúa) y cero techo cuando llegue la Fase 03. La velocidad de desarrollo con Claude Code compensa la diferencia de esfuerzo.

---

## 5. Arquitectura de páginas

```
/                     Landing (evolución de la actual: mantiene branding,
                      suma CTA "Buscar DJs" y "Crear perfil de DJ")
/djs                  Buscador con filtros (pública, pero contactar requiere login)
/dj/[slug]            Perfil público del DJ (SEO, compartible como presskit)
/registro             Elección de rol → form según DJ o productora
/login                Magic link
/panel                Dashboard según rol:
  /panel/perfil       DJ: editar su ficha
  /panel/contactos    DJ: mensajes recibidos / Productora: mensajes enviados
  /panel/favoritos    Productora: DJs guardados
/admin                Moderación (puede ser el panel de Supabase al inicio)
```

---

## 6. Plan de acción (8 semanas, ritmo side-project)

### Sprint 0 — Preparación (semana 1)
- [ ] Crear repo Git (el proyecto actual no tiene control de versiones — primero esto)
- [ ] Inicializar Next.js + Tailwind, portar design tokens y tipografías de la landing actual
- [ ] Crear proyecto Supabase, definir schema (sección 3), configurar RLS
- [ ] Migrar los datos ya captados por Google Sheets a las tablas nuevas

### Sprint 1 — Identidad y perfiles (semanas 2–3)
- [ ] Auth con magic link + elección de rol
- [ ] CRUD del perfil DJ (form + subida de foto a Supabase Storage)
- [ ] Página pública `/dj/[slug]` con embeds de SoundCloud/YouTube
- [ ] Estado de moderación (pendiente → publicado)
- **Hito:** invitar 5 DJs reales a cargar su perfil y mirar dónde se traban

### Sprint 2 — Búsqueda (semanas 4–5)
- [ ] Página `/djs` con filtros (estilo, ciudad, caché) y cards de resultados
- [ ] Registro de productoras
- [ ] Favoritos
- **Hito:** una productora real encuentra un DJ que no conocía

### Sprint 3 — Contacto y cierre del loop (semanas 6–7)
- [ ] Form de contacto en el perfil → guarda en `contactos` + email vía Resend al DJ (copia a admin)
- [ ] Vista de contactos en el panel de cada rol
- [ ] Emails de onboarding (bienvenida DJ, bienvenida productora)
- **Hito:** primer contacto real DJ ↔ productora a través de la plataforma

### Sprint 4 — Pulido y lanzamiento (semana 8)
- [ ] QA mobile (el 90% del tráfico va a ser celular)
- [ ] SEO básico: metadata por perfil, Open Graph para compartir en Instagram stories/WhatsApp
- [ ] Migrar la landing actual al nuevo proyecto y apuntar el dominio
- [ ] Anuncio a toda la base captada en Fase 01: "el buscador ya está abierto"

### Post-lanzamiento (continuo)
- Seguimiento manual de cada contacto: ¿se concretó? → actualizar `estado` (esto ES el negocio)
- Reclutamiento activo de DJs hasta densidad mínima por estilo/ciudad
- Recién cuando haya ~10 bookings concretados/mes sin intervención → diseñar Fase 03 (pagos + reviews)

---

## 7. Decisiones abiertas (para definir antes del Sprint 0)

1. **Dominio:** ¿`beatmatch.ar`? ¿`.com.ar`? Conviene comprarlo ya.
2. **Estilos musicales:** definir la taxonomía inicial (sugerencia: máx 12–15 opciones + "Otro"; una lista gigante empeora el filtro).
3. **Caché público u oculto:** ¿el rango de caché se muestra en el perfil público o solo a productoras logueadas? Sugerencia: visible solo logueado — incentiva registro y protege al DJ.
4. **¿Se migra la waitlist con aviso?** Los que dejaron datos en Fase 01 deberían recibir un email de "creá tu cuenta" — definir ese flujo.
5. **Nombre del proyecto en producción:** verificar disponibilidad de marca/Instagram handle antes de invertir en SEO.

---

## 8. Riesgos técnicos específicos

| Riesgo | Mitigación |
|---|---|
| Perfiles a medio completar | Barra de "% de perfil completo" + no publicar sin foto y al menos un set |
| Spam en el form de contacto | Rate limit + honeypot; contactar requiere cuenta de productora |
| Fotos pesadas suben lento en mobile | Compresión client-side antes del upload (browser-image-compression) |
| Free tier de Supabase pausa el proyecto por inactividad | Con tráfico real no pasa; cron de ping como seguro |
| Scope creep (querer meter Fase 03 antes de tiempo) | Este documento. Releerlo cuando aparezca la tentación. |
