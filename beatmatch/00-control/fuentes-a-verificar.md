# Planilla de verificación de fuentes

*Documento de control interno. NO forma parte de la entrega.*
*Generada el 29/07/2026.*

---

## Por qué existe esta planilla

El relevamiento de fuentes secundarias se hizo con Claude (Anthropic) en una sesión **cuyo acceso web estaba restringido por política de red**. La herramienta pudo ejecutar búsquedas y leer los resúmenes que devuelve el buscador, pero **no pudo abrir ni una sola de las páginas fuente** (todas devolvieron error 403: `indec.gob.ar`, `argentina.gob.ar`, `sinca.gob.ar`, `enacom.gob.ar`, `boletinoficial.gob.ar`, medios y hasta Wikipedia).

Consecuencia práctica: **todo dato marcado `[V-##]` en los borradores es información de segunda mano.** Los resúmenes de buscador son notoriamente imprecisos con cifras, fechas y atribuciones — confunden el año del dato con el de publicación, mezclan fuentes primarias con notas periodísticas que las citan, y a veces atribuyen a un organismo un dato producido por otro.

El anexo de uso de IA del propio trabajo fija el criterio: *"toda referencia sugerida por la IA se verificó abriendo la fuente original antes de incorporarla. Las que no se pudieron verificar se descartaron."* Esta planilla es el instrumento para cumplirlo.

---

## Cómo se usa

Por cada fila:

1. **Abrir la URL candidata.** Si no abre o no existe, buscar el dato en el sitio del organismo.
2. **Confirmar el dato exacto**: cifra, unidad, período de referencia y organismo autor.
3. **Anotar la cita APA completa** en la columna correspondiente.
4. Marcar el estado:
   - ✅ **Verificado** → se usa en el trabajo con su cita
   - ✏️ **Corregido** → el dato existe pero es distinto al del borrador. **Corregir el borrador.**
   - ❌ **No verificable** → **borrar la afirmación del borrador.** No suavizar, no escribir "según diversas fuentes". Borrar.

### Regla de jerarquía de fuentes

Siempre preferir la **fuente primaria** (el informe del organismo) sobre la secundaria (la nota periodística que lo comenta). Si el dato solo aparece en medios y no en el organismo, o se cita al medio explícitamente, o no se usa. Varias filas de abajo tienen como candidata una nota periodística justamente porque fue lo que devolvió el buscador: **hay que remontarse al organismo.**

---

## §4A — PESTEL

### Político / Legal — normativa de espectáculos

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-01 | Régimen de seguridad en locales de baile y espectáculos en vivo, CABA — Ley 5688, Título XIII | `boletinoficial.buenosaires.gob.ar/normativaba` | Que el Título XIII sea efectivamente el que regula esto y que esté vigente. Número de artículo | ☐ | |
| V-02 | Ley Nacional 26.370 — control de admisión y permanencia en espectáculos | `servicios.infoleg.gob.ar/infolegInternet/anexos/140000-144999/140950/norma.htm` | Objeto de la ley y vigencia | ☐ | |
| V-03 | Registro Público de Lugares Bailables (CABA) y sus requisitos de inscripción | `buenosaires.gob.ar/gcia-operativa-asuntos-juridicos/locales-bailables` | Requisitos vigentes: seguro, bomberos, servicio médico, libre deuda | ☐ | |

### Económico

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-04 | IPC mayo 2026: 2,1% mensual · 14,7% acumulado · 33,2% interanual | `indec.gob.ar/uploads/informesdeprensa/ipc_06_26C132AEE4E9.pdf` | **Las tres cifras, una por una.** Es el dato más citado del trabajo y el más fácil de refutar si está mal | ☐ | |
| V-05 | IPC junio 2026: "Recreación y cultura" fue la división de mayor aumento (4,2%) | `indec.gob.ar/uploads/informesdeprensa/ipc_07_26D38930EEA5.pdf` | La cifra y que efectivamente haya sido **la mayor** división del mes | ☐ | |
| V-06 | Las 12 divisiones de la canasta del IPC incluyen "Recreación y cultura" y "Restaurantes y hoteles" | Metodología del IPC, INDEC | Nomenclatura exacta de las divisiones | ☐ | |

> 💡 **Conviene usar el informe de IPC más reciente disponible al momento de la entrega**, no el de mayo/junio. Consignar mes y año en la cita.

### Sociocultural

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-07 | La ENCC es la única encuesta oficial sobre consumos culturales; ediciones 2013, 2017 y 2022 | `sinca.gob.ar/encuestas.aspx` · `argentina.gob.ar/cultura/cultura-en-datos/encuesta-nacional-de-consumos-culturales` | Años de las ediciones y organismo responsable. **Verificar si hay edición posterior a 2022** | ☐ | |
| V-08 | Datos de asistencia a recitales / música en vivo | `datos.cultura.gob.ar/dataset/encuesta-nacional-de-consumos-culturales` | **Dato a buscar, no a confirmar.** Extraer % de población que asistió a recitales o espectáculos musicales y con qué frecuencia | ☐ | |

> ⚠️ **V-08 es el hueco más grande del PESTEL.** Si la ENCC tiene una cifra de asistencia a música en vivo, es el mejor dato disponible para dimensionar el mercado y alimenta §5E (estimación de la demanda). Vale la pena bajar la base de datos abierta y buscarlo.

### Tecnológico

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-09 | 41,2 millones de usuarios de internet en 2025 = 90,1% de la población | `lu17.com/contenido/99232/` **(secundaria)** → buscar la primaria | **⚠️ Atención: probablemente NO sea de ENACOM.** Esta combinación de cifras es típica del informe *Digital 2025 Argentina* de DataReportal/We Are Social. Identificar quién produjo el dato antes de citarlo | ☐ | |
| V-10 | 64,7 millones de líneas móviles = 141% de la población | `indicadores.enacom.gob.ar/files/informes/nacionales/2025/T4/` | Cifra y trimestre de referencia | ☐ | |
| V-11 | 32,2 millones de identidades activas en redes sociales (enero 2025) = 70,3% | Fuente sin identificar | **Casi con seguridad es DataReportal, no un organismo público.** Si es así, citarlo como tal o no usarlo | ☐ | |
| V-12 | Brecha digital: 9,9% de la población sin acceso | Idem V-09 | Confirmar autoría junto con V-09 | ☐ | |
| V-13 | ENACOM publica indicadores trimestrales del mercado TIC | `enacom.gob.ar/institucional/indicadores-del-mercado-tic-del-segundo-trimestre-del-2025_n4789` | Periodicidad y último informe disponible | ☐ | |
| V-14 | Adopción de billeteras virtuales / medios de pago digitales en Argentina | **Sin fuente candidata** | Dato a conseguir. Probar informes del BCRA sobre medios de pago | ☐ | |

> 🚨 **V-09, V-11 y V-12 son las filas de mayor riesgo de toda la planilla.** El dato "90,1% de penetración" circula ampliamente en medios atribuido de forma vaga. Antes de citarlo hay que determinar quién lo produjo. Si la fuente es DataReportal o We Are Social, es una fuente privada legítima **pero hay que citarla como tal**, no atribuirla a ENACOM. Atribuir a un organismo público un dato que no produjo es un error grave en un trabajo académico.

### Legal

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-15 | Nuevo marco de gestión de derechos de autor que redefine el rol de SADAIC y excluye del pago a eventos privados | `argentina.gob.ar/noticias/el-gobierno-nacional-establece-un-nuevo-marco-de-gestion-de-derechos-de-autor-y-redefine-el` | **Número de decreto o resolución y fecha de publicación en el Boletín Oficial.** Citar la norma, no la gacetilla de prensa | ☐ | |
| V-16 | Arancel aplicable a locales bailables sobre venta de entradas | Nomenclador de aranceles SADAIC | Porcentaje vigente y su base de cálculo. **Los porcentajes que devolvió el buscador (16%, 20%, 15%, 10%) son inconsistentes entre sí** — no usar ninguno sin confirmar | ☐ | |
| V-17 | Ley 25.326 de Protección de Datos Personales | InfoLEG | Vigencia y artículos aplicables al registro de bases de datos | ☐ | |
| V-18 | Ley 24.240 de Defensa del Consumidor | InfoLEG | Aplicabilidad a plataformas digitales | ☐ | |

---

## §4B — Porter

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-20 | Existencia y ámbito de operación de Djaayz, AGNT, DJClub.pro y Songlive | Sitios web de cada plataforma | Que existan, en qué países operan, **y que efectivamente no operen en Argentina**. Capturar pantalla con fecha | ☐ | |
| V-21 | No existe plataforma digital de booking de DJs operando en Argentina | Búsqueda propia | **Afirmación negativa: no se puede probar, solo respaldar.** Documentar la búsqueda hecha (términos, fecha) y contrastarla con la pregunta E3-13 de la entrevista al especialista. Redactar como "no se identificaron plataformas…", nunca como "no existen" | ☐ | |

---

## §7 — Estudio técnico (precios de servicios)

Todos requieren entrar a la página de precios del proveedor y **anotar la fecha de consulta**.

| ID | Servicio | Dónde | Estado | Precio verificado + fecha |
|---|---|---|---|---|
| V-22 | Supabase — nivel gratuito y primer plan pago | supabase.com/pricing | ☐ | |
| V-23 | Vercel — nivel Hobby y plan Pro | vercel.com/pricing | ☐ | |
| V-24 | Resend — límite del nivel gratuito | resend.com/pricing | ☐ | |
| V-25 | Dominio `.ar` / `.com.ar` — arancel anual | nic.ar | ☐ | |
| V-26 | Plausible o Umami | plausible.io/#pricing | ☐ | |
| V-27 | Figma — plan educativo | figma.com/education | ☐ | |

---

## §8A — Estructura jurídica

| ID | Dato a verificar | Fuente candidata | Qué confirmar | Estado | Cita APA |
|---|---|---|---|---|---|
| V-19 | Ley 27.349 de Apoyo al Capital Emprendedor — creación de la SAS | `servicios.infoleg.gob.ar/infolegInternet/anexos/270000-274999/273567/texact.htm` | Texto actualizado y vigencia de los artículos sobre SAS | ☐ | |
| V-28 | Requisitos de constitución: instrumento, certificación de firmas, integración del 25% del capital en efectivo | `argentina.gob.ar/justicia/derechofacil/leysimple/sociedad-por-acciones-simplificada-sas` | Requisitos vigentes | ☐ | |
| V-29 | Plazo de inscripción de la SAS | Organismo de contralor de la jurisdicción | Plazo real, no el plazo teórico | ☐ | |
| **V-30** | **Situación de la SAS en CABA ante la IGJ y aranceles vigentes** | **igj.gob.ar** | **🚨 LA MÁS IMPORTANTE DE ESTA SECCIÓN.** Hubo resoluciones generales de la IGJ que modificaron los requisitos para SAS en CABA, con criterios que cambiaron más de una vez. Confirmar el estado actual **antes** de recomendar la figura | ☐ | |
| V-31 | Costo de publicación edictal | boletinoficial.gob.ar | Arancel vigente con fecha | ☐ | |
| V-32 | Inscripción fiscal: CUIT, IVA, Ingresos Brutos | ARCA · AGIP (CABA) o ARBA (PBA) | Trámites y costos según jurisdicción | ☐ | |

> Si el equipo constituye en **Provincia de Buenos Aires** en vez de CABA, V-30 se reemplaza por la Dirección Provincial de Personas Jurídicas (`gba.gob.ar/dppj/sociedades_por_acciones_simplificadas_sas`), con requisitos y aranceles distintos.

---

## Pendientes sin fuente candidata

Datos que el Plan necesita y para los que **no se identificó ninguna fuente**. Antes de gastar tiempo buscándolos, evaluar si conviene reemplazarlos por evidencia primaria del propio trabajo de campo:

| Dato | Sección | Alternativa si no se consigue |
|---|---|---|
| Tamaño del mercado de eventos / vida nocturna en Argentina | §5E estimación de la demanda | Estimar por método bottom-up: cantidad de locales habilitados en CABA × eventos por semana × DJs por evento. **Documentar cada supuesto.** Una estimación propia bien fundada vale más que un número sin fuente |
| Cantidad de DJs activos en Argentina | §5E | Bottom-up desde seguidores de cuentas de la escena, egresados de escuelas de DJ, o line-ups publicados en un período |
| Cachés de referencia del mercado | §6G política de precios | **Evidencia propia: P19 de la encuesta.** Es el aporte original del trabajo y no existe en ninguna fuente pública |
| Cantidad de locales bailables habilitados en CABA | §5E | Registro Público de Lugares Bailables (V-03), si publica el padrón |
| Adopción de billeteras virtuales | §4A tecnológico | Informes del BCRA sobre medios de pago |

> **Observación estratégica:** que estos datos no existan públicamente **no es una debilidad del trabajo, es el hallazgo central del análisis del entorno.** Un mercado sin estadísticas es un mercado sin transparencia — que es exactamente el problema que Beatmatch dice resolver. Escribirlo así convierte una limitación metodológica en un argumento del plan.

---

## Registro de avance

| Bloque | Filas | Verificadas | Responsable | Fecha límite |
|---|---|---|---|---|
| §4A Político/Legal (V-01 a V-03, V-15 a V-18) | 7 | 0 | | |
| §4A Económico (V-04 a V-06) | 3 | 0 | | |
| §4A Sociocultural (V-07, V-08) | 2 | 0 | | |
| §4A Tecnológico (V-09 a V-14) | 6 | 0 | | |
| §4B Porter (V-20, V-21) | 2 | 0 | | |
| §7 Precios de servicios (V-22 a V-27) | 6 | 0 | | |
| §8A Jurídico (V-19, V-28 a V-32) | 6 | 0 | | |
| **Total** | **32** | **0** | | |

**Sugerencia de reparto:** los bloques de precios de servicios (V-22 a V-27) son los más rápidos — media hora en total, y no requieren criterio. Los de mayor riesgo y que conviene que haga quien vaya a escribir la sección son **V-09/V-11/V-12** (atribución del dato de conectividad) y **V-30** (situación de la SAS). Esas dos son las que pueden hacer caer una afirmación entera del trabajo.
