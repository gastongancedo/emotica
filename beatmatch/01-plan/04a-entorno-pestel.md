# §4A — Análisis del entorno externo (PESTEL)

*Extensión pautada: 2–3 carillas · Beatmatch*

> ## ⚠️ Leer antes de usar este documento
>
> Cada afirmación empírica de este borrador lleva una marca **`[V-##]`**. Esa marca significa: *el dato es plausible y hay una fuente candidata identificada, pero **nadie del equipo abrió todavía la fuente original***.
>
> El relevamiento se hizo con una IA cuyo acceso web estaba restringido: pudo buscar y ver resúmenes de resultados, pero **no pudo abrir ni una sola de las fuentes**. Todo lo que sigue es, por lo tanto, información de segunda mano.
>
> **Procedimiento obligatorio antes de la entrega:**
> 1. Abrir cada fuente de `00-control/fuentes-a-verificar.md`.
> 2. Confirmar el dato exacto, la fecha y la autoría.
> 3. Reemplazar la marca `[V-##]` por la cita APA correspondiente.
> 4. **Lo que no se pueda verificar, se borra.** No se suaviza, no se deja "según diversas fuentes": se borra.
>
> Una cita APA inventada en el cuerpo del trabajo es indistinguible del plagio, y la consigna sanciona con recursada y apercibimiento en el legajo **a todos los integrantes**.

---

## Introducción

El análisis PESTEL releva las fuerzas del macroentorno que Beatmatch no controla pero que condicionan su viabilidad. Se ordena por factor y cada uno cierra con la **implicancia concreta para el negocio**, que es lo que después alimenta la matriz FODA (§4D). Un PESTEL que describe el país sin conectar cada dato con una decisión del plan es descripción, no análisis.

---

## P — Político

**Contexto.** El mercado de eventos y vida nocturna en Argentina está fuertemente condicionado por la regulación municipal y provincial, más que nacional. La política de habilitaciones, controles y horarios de los locales bailables se define a nivel jurisdiccional y cambia con cada gestión.

**Hechos a verificar:**
- En CABA, el régimen de seguridad en locales de baile y espectáculos en vivo está regulado por el **Título XIII de la Ley 5688** (Sistema Integral de Seguridad Pública). `[V-01]`
- La **Ley Nacional 26.370** establece el régimen de habilitación del personal que realiza tareas de control de admisión y permanencia en espectáculos públicos. `[V-02]`
- Existe un **Registro Público de Lugares Bailables** en CABA, cuya inscripción exige póliza de seguro, servicio de bomberos con reválida trimestral, servicio médico de emergencias permanente y libre deuda de infracciones. `[V-03]`

**Implicancia para Beatmatch.** Positiva e indirecta. Beatmatch **no opera locales** ni organiza eventos: intermedia entre personas y empresas. Esto la deja fuera del núcleo más pesado de la regulación de espectáculos, que recae sobre el organizador y el titular del local. La carga regulatoria del sector es, de hecho, un argumento a favor del negocio: cuanto más costoso y riesgoso es producir un evento, más valor tiene reducir el tiempo y la incertidumbre de conseguir el artista. **Riesgo a monitorear:** un endurecimiento de controles sobre la nocturnidad reduce la cantidad de eventos y, con ella, la demanda de bookings.

---

## E — Económico

**Contexto.** El consumo de esparcimiento es de los primeros en ajustarse cuando cae el ingreso disponible, y de los primeros en recuperarse cuando se estabiliza. Para un marketplace que cobra comisión sobre transacciones, el ciclo económico impacta de forma directa sobre el ingreso.

**Hechos a verificar:**
- El IPC de mayo de 2026 registró una variación mensual del **2,1%**, con **14,7% acumulado** en los primeros cinco meses y **33,2% interanual**. `[V-04]`
- En junio de 2026, la división **"Recreación y cultura"** fue la de mayor aumento del IPC (**4,2%**), traccionada por paquetes turísticos. `[V-05]`
- El INDEC clasifica el gasto de los hogares en 12 divisiones, entre ellas "Recreación y cultura" y "Restaurantes y hoteles", que son las que capturan el gasto en salidas nocturnas. `[V-06]`

**Implicancia para Beatmatch.**
1. **Contra la suscripción, a favor de la comisión.** En un contexto de inflación persistente, un abono fijo en pesos se licúa y obliga a renegociar el precio cada pocos meses. Una comisión porcentual sobre el caché se ajusta sola. Esto refuerza la decisión de modelo de ingresos ya tomada en el documento de modelo de negocio.
2. **El caché es un dato perecedero.** Cualquier rango de precios relevado en la encuesta (§5B, P19) debe publicarse con mes y año. Un rango en pesos sin fecha es inservible a los seis meses, y esto condiciona el diseño del producto: el campo "caché" del perfil necesita fecha de última actualización.
3. **Costos operativos dolarizados.** El stack técnico previsto (hosting, base de datos, correo transaccional) se factura en dólares mientras el ingreso es en pesos. Mientras corra en niveles gratuitos el impacto es nulo, pero el modelo financiero (§9) debe contemplar la brecha cuando escale.

---

## S — Sociocultural

**Contexto.** Este es el factor que mejor sostiene la oportunidad del negocio, y también donde el equipo tiene el dato más difícil de conseguir: no existe estadística oficial específica sobre el mercado de booking de DJs en Argentina.

**Hechos a verificar:**
- La **Encuesta Nacional de Consumos Culturales (ENCC)**, del Sistema de Información Cultural de la Argentina (SInCA), es la única fuente oficial sobre hábitos y consumos culturales de la población argentina. Se realizó en 2013, 2017 y 2022. `[V-07]`
- Datos de asistencia a recitales, conciertos y espectáculos de música en vivo. `[V-08]` — *pendiente de extraer de la ENCC*

**Elaboración propia (no requiere fuente, pero sí evidencia del trabajo de campo).** Los hechos socioculturales que sostienen el negocio son de conocimiento de la escena y no están documentados en estadística oficial: la centralidad de Instagram como carta de presentación del artista, la informalidad del acuerdo entre DJ y contratante, y el peso de la red de contactos por sobre el mérito artístico en el acceso a fechas. **Estas afirmaciones se sostienen en el trabajo con las entrevistas de §5A y la encuesta de §5B, no con fuente secundaria.** Ese es precisamente el aporte de investigación propia del trabajo, y conviene señalarlo así: *"no habiendo estadística oficial sobre el mercado de contratación de DJs en Argentina, el equipo relevó evidencia primaria mediante entrevistas y encuesta"*.

**Implicancia para Beatmatch.** La ausencia de datos públicos del mercado es simultáneamente una barrera —dificulta dimensionar la demanda en §5E— y una **oportunidad de posicionamiento**: la estrategia de contenidos del modelo de negocio propone publicar cachés promedio por estilo, un dato que hoy nadie tiene. Beatmatch puede convertirse en la fuente de referencia de un mercado sin estadísticas.

---

## T — Tecnológico

**Contexto.** La viabilidad de un marketplace digital depende de que su público esté efectivamente conectado y acostumbrado a operar online. En Argentina esa condición está ampliamente satisfecha.

**Hechos a verificar:**
- Argentina alcanzó **41,2 millones de usuarios de internet en 2025**, equivalentes al **90,1% de la población**. `[V-09]`
- Las líneas móviles totalizan **64,7 millones**, un **141% de la población**, en su mayoría de banda ancha móvil. `[V-10]`
- En enero de 2025 se registraron **32,2 millones de identidades activas en redes sociales**, un **70,3% de la población**. `[V-11]`
- Persiste una brecha digital: **9,9% de la población sin acceso**, concentrada en zonas rurales y sectores de menores ingresos. `[V-12]`
- ENACOM publica trimestralmente indicadores del mercado TIC. `[V-13]`

**Implicancia para Beatmatch.**
1. **La infraestructura no es una barrera.** Con 90% de penetración y uso masivo de redes, el supuesto de que el público objetivo está online se sostiene. La brecha del 9,9% se concentra en zonas rurales, fuera del beachhead AMBA definido en el modelo de negocio: no afecta al segmento objetivo.
2. **Mobile primero, y en serio.** La relación entre líneas móviles y accesos fijos confirma que el acceso predominante es por celular. Esto valida la decisión del plan de producto de priorizar web responsive y de hacer QA mobile antes del lanzamiento.
3. **Instagram como canal de captación.** La penetración de redes sociales sostiene el plan de reclutamiento manual de DJs por Instagram (§6F).
4. **Medios de pago digitales.** La adopción de billeteras virtuales en Argentina es la condición técnica que hace posible la Fase 03 (seña retenida vía Mercado Pago). `[V-14]` — *dato pendiente de fuente*

---

## E — Ecológico / Ambiental

**Contexto.** Es el factor de menor peso para este negocio, y conviene decirlo en vez de inflarlo. **Un PESTEL que fuerza los seis factores por igual demuestra que no se jerarquizó.**

**Elaboración propia.** Beatmatch es una plataforma digital sin operación física: sin logística, sin producción de bienes, sin residuos. Su huella ambiental directa se limita al consumo energético de la infraestructura de servidores, que es marginal en la escala del MVP y además tercerizada en proveedores de nube.

**Implicancia para Beatmatch.** Marginal en lo operativo, con un ángulo indirecto: la digitalización del proceso de contratación reemplaza traslados y reuniones presenciales de evaluación de artistas. Es un beneficio real pero de magnitud menor, y **no conviene construir posicionamiento de marca sobre él** — sería sostenibilidad de utilería, y en un plan de negocios se nota.

---

## L — Legal

**Contexto.** Tres cuerpos normativos afectan directamente la operación de Beatmatch: derechos de autor, protección de datos personales y relación contractual con los usuarios.

**Hechos a verificar:**
- Durante 2025 se estableció un nuevo marco de gestión de derechos de autor que redefine el rol de **SADAIC**, precisando el alcance del concepto de "ejecución pública" y excluyendo del pago a los eventos privados en espacios privados con acceso restringido. `[V-15]`
- Los locales bailables, donde la música es elemento esencial del servicio, tributan un arancel sobre la venta de entradas. `[V-16]`
- La **Ley 25.326 de Protección de Datos Personales** regula el tratamiento de datos en Argentina. `[V-17]`
- La **Ley 24.240 de Defensa del Consumidor** aplica a las relaciones de consumo en plataformas digitales. `[V-18]`
- La **Ley 27.349 de Apoyo al Capital Emprendedor** crea la figura de la SAS. `[V-19]` — *desarrollado en §8A*

**Implicancia para Beatmatch.**
1. **SADAIC no es un costo de Beatmatch.** La obligación de pago por ejecución pública recae sobre el titular del local o el organizador del evento, no sobre el intermediario que conecta al artista con el contratante. Conviene decirlo explícitamente en el trabajo porque es la primera objeción que va a aparecer en la defensa oral del pitch.
2. **Datos personales: obligación concreta y temprana.** Beatmatch recolecta nombre, fecha de nacimiento, contacto y datos económicos (caché). Esto exige política de privacidad, consentimiento explícito en el formulario y registro de la base ante la autoridad de aplicación. **El formulario actual de la Fase 01 no tiene checkbox de consentimiento ni política de privacidad enlazada** — es una brecha real del producto en vivo, no una hipótesis.
3. **Términos y condiciones y limitación de responsabilidad.** Al intermediar entre partes, hay que definir contractualmente qué responsabilidad asume Beatmatch si un DJ no se presenta o una productora no paga. En Fase 03, con seña retenida, esto deja de ser una cláusula y pasa a ser una obligación operativa.
4. **Situación fiscal de los usuarios.** Buena parte de los DJs emergentes opera informalmente. Cuando Beatmatch intermedie pagos, la formalización deja de ser problema del DJ y pasa a ser condición del sistema. **Es una fricción de adopción que hay que anticipar en el modelo**, y una pregunta que conviene incluir en las entrevistas de §5A.

---

## Síntesis: del PESTEL al FODA

Tabla puente para §4D. Cada fila tiene que poder rastrearse hasta un factor de arriba.

| Factor | Signo | Hallazgo | Va a FODA como |
|---|---|---|---|
| Tecnológico | ➕ | Penetración de internet ~90% y uso mayoritariamente móvil | **Oportunidad** — el supuesto de adopción digital no es una apuesta |
| Sociocultural | ➕ | No existe estadística pública del mercado de booking de DJs | **Oportunidad** — Beatmatch puede ser la fuente de referencia del sector |
| Sociocultural | ➕ | La contratación depende de redes personales cerradas | **Oportunidad** — es el problema que da origen al negocio |
| Económico | ➖ | Inflación persistente | **Amenaza** — mitigada por el modelo de comisión sobre suscripción |
| Económico | ➖ | El esparcimiento es de los primeros consumos que se recortan | **Amenaza** — la demanda es procíclica |
| Legal | ➖ | Obligaciones de protección de datos incumplidas hoy | **Debilidad** — accionable y de bajo costo |
| Legal | ➖ | Informalidad fiscal de la oferta | **Amenaza** — fricción para la Fase 03 |
| Político | ⚪ | Regulación pesada sobre locales, no sobre intermediarios | **Oportunidad** indirecta — la complejidad del sector aumenta el valor de simplificarlo |
| Ambiental | ⚪ | Impacto directo marginal | No se incorpora al FODA |

---

## Nota de redacción para el equipo

Este archivo está escrito como **documento de trabajo**, con marcas de verificación y notas de método. La versión que va al PDF final necesita tres pasadas más:

1. **Verificar y citar.** Reemplazar cada `[V-##]` por su cita APA. Borrar lo no verificable.
2. **Sacar los andamios.** El bloque de advertencia inicial, las marcas y esta misma nota no van en la entrega.
3. **Comprimir a 2–3 carillas.** Este borrador se pasa. Lo que se recorta primero son los "contextos" introductorios de cada factor; lo que se conserva sí o sí son las **implicancias**, que es donde está el análisis propio y donde se juega la nota.
