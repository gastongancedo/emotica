// Recorrido de los 15 flujos que importan, contra un servidor levantado.
//
//   rm -f data/beatmatch.json
//   npm run build && npx next start -p 3211 &
//   node tests/flujos.mjs
//
// La prueba escribe en el almacén: borrá data/beatmatch.json antes de
// correrla o vas a acumular perfiles "Prueba Sonora".
import { chromium } from 'playwright';
const B = 'http://localhost:3211';
// Si el entorno trae su propio Chromium se le pasa la ruta por variable;
// si no, Playwright usa el que descargó.
const exe = process.env.CHROMIUM_PATH;
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();
const log = [];
const ok = (n, c) => log.push(`${c ? 'OK  ' : 'FALLA'} ${n}`);

// 1. Buscador con filtro
await p.goto(`${B}/djs?estilo=Techno`);
await p.waitForLoadState('networkidle');
const nTechno = await p.locator('a[href^="/dj/"]').count();
ok(`filtro estilo=Techno devuelve ${nTechno}`, nTechno === 2);

// 2. Filtro por presupuesto
await p.goto(`${B}/djs?cache=100000`);
const nBarato = await p.locator('a[href^="/dj/"]').count();
ok(`filtro presupuesto<=100k devuelve ${nBarato}`, nBarato >= 1);

// 3. Alta de perfil
await p.goto(`${B}/registro`);
await p.fill('#nombre_artistico', 'Prueba Sonora');
await p.fill('#email', 'prueba@test.com');
await p.selectOption('#ciudad', 'CABA');
await p.click('button[aria-pressed]:has-text("House")');
await p.fill('#set_url', 'https://soundcloud.com/discover');
await p.fill('#bio', 'Perfil creado por la prueba automatica.');
await p.fill('#cache_min', '120000');
await p.click('button[type=submit]');
await p.waitForSelector('text=Ya está en la fila', { timeout: 8000 });
const editUrl = (await p.locator('code', { hasText: '/editar?token=' }).first().innerText()).trim();
ok('alta de perfil crea y muestra link de edicion', editUrl.includes('/editar?token='));

// 4. El perfil nuevo NO aparece publicado todavia
await p.goto(`${B}/djs?q=Prueba`);
const visiblePendiente = await p.locator('a[href^="/dj/"]').count();
ok('perfil pendiente no aparece en el buscador', visiblePendiente === 0);

// 5. Validacion del servidor: pasa el navegador pero no elige estilo
await p.goto(`${B}/registro`);
await p.fill('#nombre_artistico', 'Sin Estilo');
await p.fill('#email', 'sin@estilo.com');
await p.selectOption('#ciudad', 'CABA');
await p.fill('#set_url', 'https://soundcloud.com/discover');
await p.click('button[type=submit]');
await p.waitForSelector('.error', { timeout: 8000 });
const txtErr = await p.locator('.error').first().innerText();
ok(`validacion del servidor rechaza sin estilo: "${txtErr}"`, txtErr.includes('estilo'));
// y no lo guardo
await p.goto(`${B}/admin`);
const fantasma = await p.locator('h3:has-text("Sin Estilo")').count();
ok('el perfil invalido NO se guardo', fantasma === 0);

// 6. Admin: login + publicar
await p.goto(`${B}/admin`);
await p.fill('#clave', 'beatmatch');
await p.click('button[type=submit]');
await p.waitForSelector('text=Esperando revisión', { timeout: 8000 });
const pend = await p.locator('h3:has-text("Prueba Sonora")').count();
ok('el perfil nuevo aparece como pendiente en admin', pend === 1);

const fila = p.locator('div.tarjeta').filter({ hasText: 'Prueba Sonora' }).first();
await fila.locator('button:has-text("Publicar")').click();
await p.waitForTimeout(1200);

// 7. Ya publicado, aparece en el buscador
await p.goto(`${B}/djs?q=Prueba`);
await p.waitForLoadState('networkidle');
const visiblePublicado = await p.locator('a[href^="/dj/"]').count();
ok('tras publicar aparece en el buscador', visiblePublicado === 1);

// 8. Perfil publico + contacto
await p.goto(`${B}/dj/prueba-sonora`);
await p.waitForSelector('h1');
ok('perfil publico carga', (await p.locator('h1').innerText()).toLowerCase().includes('prueba sonora'));
const html = await p.content();
ok('el perfil publico NO expone el mail del DJ', !html.includes('prueba@test.com'));
ok('el perfil publico NO expone el edit_token', !html.includes('editar?token='));

await p.fill('#productora_nombre', 'Vera Producciones');
await p.fill('#productora_email', 'vera@productora.com');
await p.fill('#mensaje', 'Hola, tenemos fecha el 15 en Palermo, buscamos apertura.');
await p.fill('#presupuesto', '200000');
await p.click('button:has-text("Enviar propuesta")');
await p.waitForSelector('text=Propuesta enviada', { timeout: 8000 });
ok('contacto se envia', true);

// 9. El contacto llega al admin
await p.goto(`${B}/admin`);
await p.waitForSelector('text=Contactos recibidos');
const cont = await p.locator('h3:has-text("Vera Producciones")').count();
ok('el contacto aparece en admin', cont === 1);

// 10. Editar con token valido
await p.goto(editUrl.replace('http://localhost:3211', B));
await p.waitForSelector('#nombre_artistico', { timeout: 8000 });
await p.fill('#bio', 'Bio editada con el token.');
await p.click('button:has-text("Guardar cambios")');
await p.waitForTimeout(1200);
await p.goto(`${B}/dj/prueba-sonora`);
ok('edicion con token valido persiste', (await p.content()).includes('Bio editada con el token'));

// 11. Token invalido rechazado
await p.goto(`${B}/dj/prueba-sonora/editar?token=basura`);
ok('token invalido rechazado', (await p.content()).includes('no sirve'));

console.log(log.join('\n'));
const fallas = log.filter(l => l.startsWith('FALLA'));
console.log(`\n${log.length - fallas.length}/${log.length} pasaron`);
await b.close();
process.exit(fallas.length ? 1 : 0);
