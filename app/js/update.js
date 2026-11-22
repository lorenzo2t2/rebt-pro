/* Actualización desde GitHub: compara version.json y descarga solo los archivos que cambian. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, esc, view, $ } = A;
  const DEF_REPO = 'lorenzo2t2/rebt-pro';
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  const repo = () => get('rebt.repo') || DEF_REPO;
  const base = () => `https://raw.githubusercontent.com/${repo()}/main/app/`;
  const okPath = p => /^[A-Za-z0-9_][A-Za-z0-9_.\-\/]*$/.test(p) && p.indexOf('..') < 0;
  const B = window.AndroidBridge;

  async function comprobar() {
    const local = await (await fetch('version.json', { cache: 'no-store' })).json();
    const r = await fetch(base() + 'version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('No se encontró version.json en ' + repo() + ' (HTTP ' + r.status + ')');
    const remote = await r.json();
    const cambios = Object.keys(remote.files || {}).filter(p => okPath(p) && remote.files[p] !== (local.files || {})[p]);
    const apkOk = !remote.minApk || !B || !B.apkCode || Number(B.apkCode()) >= remote.minApk;
    return { local, remote, cambios, apkOk };
  }
  const b64 = blob => new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(String(f.result).split(',')[1] || ''); f.onerror = rej; f.readAsDataURL(blob); });

  async function aplicar(info, log) {
    for (const [i, p] of info.cambios.entries()) {
      log(`Descargando ${i + 1}/${info.cambios.length}: ${p}`);
      const r = await fetch(base() + p + '?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) throw new Error('Error al descargar ' + p);
      B.otaPut(p, await b64(await r.blob()));
    }
    B.otaPut('version.json', btoa(unescape(encodeURIComponent(JSON.stringify(info.remote)))));
    if (!B.otaCommit()) throw new Error('No se pudo guardar la actualización');
  }

  route(/^#\/actualizar$/, () => {
    view.innerHTML = `<h1>Actualizar la app</h1>
    <p class="lead">Comprueba si hay una versión nueva en GitHub y la instala sin tener que reinstalar la APK.</p>
    <div class="card"><div id="uv">Versión instalada: …</div>
      <div class="form" style="margin-top:10px"><div><label>Repositorio de GitHub (usuario/nombre)</label><input id="urepo" value="${esc(repo())}"></div></div>
      <p><button class="btn pri" id="ubtn">Buscar actualización</button></p>
      <div id="ures" class="result"></div></div>
    <p class="mini">Se descargan solo los archivos modificados, desde <code>raw.githubusercontent.com</code>. Los cambios que afecten a la parte nativa de Android (guardar en Descargas, imprimir) requieren instalar la APK nueva desde <a id="urel" target="_blank" rel="noopener">Releases</a>.</p>`;
    fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(v => { $('#uv').innerHTML = 'Versión instalada: <b>' + esc(v.version) + '</b>'; }).catch(() => { });
    const rel = () => { $('#urel').href = `https://github.com/${repo()}/releases/latest`; };
    rel();
    $('#urepo').onchange = () => { const v = $('#urepo').value.trim(); if (/^[\w.\-]+\/[\w.\-]+$/.test(v)) { set('rebt.repo', v); rel(); } };
    $('#ubtn').onclick = async () => {
      const out = $('#ures'); out.textContent = 'Buscando…';
      try {
        const info = await comprobar();
        if (!info.cambios.length && info.remote.version === info.local.version) { out.innerHTML = '✅ Ya tienes la última versión (' + esc(info.local.version) + ').'; return; }
        if (!info.apkOk) { out.innerHTML = `La versión ${esc(info.remote.version)} necesita una APK nueva: <a href="https://github.com/${repo()}/releases/latest" target="_blank" rel="noopener">descárgala aquí</a>.`; return; }
        out.innerHTML = `Hay una versión nueva: <b>${esc(info.remote.version)}</b> (${info.cambios.length} archivos). <p><button class="btn pri" id="ugo">${B && B.otaPut ? 'Instalar ahora' : 'Recargar con lo último'}</button></p><div id="ulog" class="mini"></div>`;
        $('#ugo').onclick = async () => {
          $('#ugo').disabled = true;
          try {
            if (B && B.otaPut) { await aplicar(info, t => { $('#ulog').textContent = t; }); $('#ulog').textContent = 'Listo. Reiniciando…'; set('rebt.ota.last', String(Date.now())); setTimeout(() => location.reload(), 600); }
            else { if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } location.reload(); }
          } catch (e) { $('#ulog').textContent = 'Error: ' + e.message; $('#ugo').disabled = false; }
        };
      } catch (e) { out.textContent = 'No se pudo comprobar: ' + e.message + '. ¿Hay conexión y existe el repositorio público «' + repo() + '»?'; }
    };
  });

  /* Aviso discreto una vez al día (solo en la app Android). */
  if (B && B.otaPut && navigator.onLine) {
    const last = Number(get('rebt.ota.check') || 0);
    if (Date.now() - last > 864e5) {
      set('rebt.ota.check', String(Date.now()));
      comprobar().then(i => {
        if (i.cambios.length && i.apkOk) {
          const d = document.createElement('a');
          d.href = '#/actualizar'; d.textContent = '⬇️ Hay una actualización disponible (' + i.remote.version + ')';
          d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99;background:#2563eb;color:#fff;text-align:center;padding:8px;font-size:14px;text-decoration:none';
          d.onclick = () => d.remove(); document.body.appendChild(d);
        }
      }).catch(() => { });
    }
  }
});
