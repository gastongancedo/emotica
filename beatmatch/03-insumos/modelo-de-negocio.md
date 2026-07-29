# BEATMATCH — Modelo de Negocio y Desarrollo de Producto

*Documento de trabajo — Julio 2026*

---

## 1. Resumen ejecutivo

Beatmatch es un marketplace que conecta DJs con productoras de eventos en Argentina. El mercado local de booking funciona hoy por Instagram, WhatsApp y boca a boca: sin datos, sin verificación, sin proceso. Los referentes internacionales (Djaayz, AGNT, DJClub.pro) validaron el modelo en Europa y Norteamérica, pero ninguno opera en el mercado rioplatense.

**Tesis:** el primer jugador que digitalice el booking de DJs en Argentina con verificación local, precios en pesos y entendimiento de la escena (boliches, fiestas, eventos corporativos, casamientos) captura un mercado sin competencia directa.

---

## 2. Problema

**Para las productoras:**
- Encontrar DJs depende de contactos personales. Si tu red no llega, no existís.
- No hay forma de comparar: estilo, precio, disponibilidad y calidad se averiguan uno por uno por DM.
- Riesgo alto: no hay reviews, no hay historial, no hay garantía de que el DJ aparezca.
- Presupuestar un evento con música es adivinar.

**Para los DJs:**
- La visibilidad depende 100% del algoritmo de Instagram y de conocer gente.
- DJs emergentes sin red no acceden a fechas aunque tengan nivel.
- Negociar caché sin referencias de mercado los deja en desventaja.
- Gestionar propuestas por WhatsApp es caótico: fechas que se pisan, acuerdos sin registro.

---

## 3. Solución (roadmap de producto)

### Fase 01 — Archivo abierto *(ya en marcha)*
Directorio de DJs + lista de espera de productoras.
- **DJ:** ficha con nombre, estilo, link a set.
- **Productora:** nombre + email en waitlist.
- **Objetivo:** validar demanda de ambos lados y construir la base de datos inicial.
- **Meta sugerida antes de pasar a Fase 02:** 150–300 DJs cargados y 30–50 productoras en waitlist. Con menos oferta, el buscador nace vacío y mata la primera impresión.

### Fase 02 — Buscador y matching
- Filtros: estilo, fecha, presupuesto, ciudad.
- Perfil enriquecido del DJ: bio, fotos, sets embebidos (SoundCloud/YouTube), caché orientativo, rider técnico, disponibilidad.
- Contacto directo productora → DJ dentro de la plataforma.
- **Todavía sin cobrar:** el objetivo es que ocurran los primeros matches y medir cuántos terminan en booking real.

### Fase 03 — Transacción y confianza *(la capa monetizable)*
- Booking dentro de la plataforma: propuesta → aceptación → seña → evento → review.
- Sistema de reviews bidireccional (productora califica al DJ, DJ califica a la productora — esto último no lo hace nadie y es un diferencial real: los DJs también sufren productoras que no pagan).
- Verificación de perfiles ("DJ verificado" / "Productora verificada").
- Pagos vía Mercado Pago (seña retenida hasta el evento = protección para ambos lados).

### Fase 04 — Expansión
- Otros roles: VJs, sonidistas, iluminadores, fotógrafos de eventos.
- Otras plazas: Uruguay, Chile, resto de LATAM hispanohablante.
- Herramientas de gestión para DJs: agenda, contratos, facturación.

---

## 4. Modelo de negocio

### Opción recomendada: modelo mixto escalonado

| Etapa | Quién paga | Qué paga | Referencia de mercado |
|---|---|---|---|
| Fase 1–2 | Nadie | Gratis (construcción de red) | — |
| Fase 3 | Productora | Comisión por booking: **8–10% del caché** | Songlive cobra 6–12% |
| Fase 3+ | DJ (opcional) | Suscripción premium: perfil destacado, estadísticas, badge verificado (~USD 5–10/mes) | Modelo DJClub.pro |
| Fase 4 | Productoras grandes | Plan empresa: búsquedas ilimitadas, cuenta multi-usuario, soporte | Modelo AGNT |

**Por qué comisión y no suscripción como ingreso principal:**
- En Argentina la fricción de pagar suscripciones en un producto nuevo es altísima.
- La comisión alinea incentivos: Beatmatch gana solo si genera bookings reales.
- El cobro se integra naturalmente al flujo de pago (Mercado Pago split payments).

**Regla de oro de marketplaces:** no cobrar antes de tener liquidez (matches ocurriendo solos). Cobrar temprano mata la red.

### Unit economics (hipótesis a validar)

- Caché promedio DJ emergente/medio en AMBA: ARS 150.000–600.000 por fecha (validar con los primeros registros de la Fase 01 — agregar campo "caché orientativo" a la ficha).
- Comisión 10% → ARS 15.000–60.000 por booking.
- Punto de equilibrio operativo (hosting + herramientas + tiempo): bajísimo mientras sea side project. El riesgo no es el costo, es el tiempo.

---

## 5. Mercado

- **AMBA como beachhead:** mayor densidad de eventos, boliches, productoras y DJs del país. No intentar cubrir todo el país al inicio — un marketplace necesita densidad local, no cobertura.
- **Segmentos de demanda (en orden de facilidad de captura):**
  1. Productoras chicas y organizadores de fiestas independientes (dolor máximo, sin agencias).
  2. Bares y boliches con fechas semanales (volumen recurrente).
  3. Eventos corporativos y casamientos (tickets más altos, exigen verificación — llegan en Fase 03).
- **Competencia:** internacional sin presencia local (Djaayz, AGNT), agencias de booking tradicionales (atienden solo el segmento top), Instagram/WhatsApp (el verdadero competidor).

---

## 6. Estrategia de crecimiento (resolver el huevo-gallina)

1. **Ofertar primero.** Cargar la mayor cantidad de DJs posible antes de abrir la búsqueda. Los DJs tienen incentivo natural a sumarse (visibilidad gratis).
2. **Reclutamiento manual:** salir a buscar DJs por Instagram, en eventos, por conocidos. Los primeros 100 perfiles se consiguen a mano, no con ads.
3. **Concierge al inicio de Fase 02:** cuando una productora busque, matchear a mano por WhatsApp si hace falta. Hacer cosas que no escalan para aprender qué pide realmente la demanda.
4. **Contenido como captación:** rankings de estilos, "DJ de la semana", datos del mercado (cachés promedio por estilo — nadie publica eso y es oro para prensa y redes).
5. **Alianzas:** escuelas de DJs, marcas de equipamiento, ciclos de fiestas.

---

## 7. Métricas clave por fase

| Fase | Métrica norte | Secundarias |
|---|---|---|
| 01 | DJs registrados | Productoras en waitlist, tasa de fichas completas |
| 02 | Búsquedas que terminan en contacto | Perfiles vistos por búsqueda, DJs con perfil completo |
| 03 | **Bookings concretados/mes** | GMV (caché total transaccionado), take rate efectivo, % de eventos con review |
| 04 | GMV por plaza | Retención de productoras (repeat booking rate) |

---

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Desintermediación** (se conocen en la plataforma, cierran por WhatsApp) | Aceptarlo al inicio. La retención a largo plazo viene de valor real: seña protegida, reviews, historial, contratos. No de bloquear contactos. |
| Oferta sin demanda (muchos DJs, cero búsquedas) | No abrir Fase 02 hasta tener waitlist de productoras activa y contactada 1 a 1. |
| Calidad dispareja de DJs | Verificación por curaduría en Fase 03; mientras tanto, el link al set es el filtro natural. |
| Contexto macro argentino | Precios en referencia USD con cobro en pesos; comisión variable no sufre inflación como una suscripción fija. |
| Un jugador internacional entra al mercado | La ventaja es velocidad + conocimiento local. Ejecutar rápido la Fase 02. |

---

## 9. Próximos pasos concretos (30–60 días)

1. **Agregar campos a la ficha de DJ actual:** ciudad, caché orientativo (rango), Instagram. Costo casi cero (un ajuste al form + Apps Script) y multiplica el valor de la base para la Fase 02.
2. **Consolidar `index.html` / `beatmatch.html`** en un solo archivo antes de seguir iterando.
3. **Campaña de reclutamiento de DJs:** meta 100 fichas en 30 días (Instagram orgánico + contacto directo).
4. **Entrevistar 10 productoras de la waitlist:** qué buscan, cuánto pagan, cómo contratan hoy. Esto define el buscador de Fase 02 mejor que cualquier supuesto.
5. **Definir stack de Fase 02:** el combo actual (HTML estático + Google Sheets) no soporta búsqueda. Opciones de bajo costo: Airtable + Softr, o migrar a un stack simple (Next.js + Supabase) si lo desarrollás vos.

---

*Referencias de mercado: Djaayz (FR), AGNT (CA/US), DJClub.pro (ES), Songlive (ES).*
