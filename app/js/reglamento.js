/* REBT oficial: texto consolidado del BOE (RD 842/2002) navegable por artículos e ITC, con buscador. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, esc, view, $, $$ } = A;
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let DB = null;

  const sentence = s => { s = s.toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); };
  function load() {
    if (DB) return Promise.resolve(DB);
    return fetch('data/rebt.txt').then(r => { if (!r.ok) throw 0; return r.text(); }).then(t => {
      const L = t.split(/\r?\n/), idx = [];
      /* títulos desde el índice (antes de la línea 215) */
      const tit = {};
      for (let i = 100; i < 215; i++) {
        const m = L[i].match(/^\s*ITC-BT-(\d\d)\.\s*(.*)$/); if (!m) continue;
        let s = m[2], j = i + 1;
        while (j < 215 && L[j].trim() && !/^\s*ITC-BT-\d\d\./.test(L[j])) { s += ' ' + L[j].trim(); j++; }
        tit[m[1]] = sentence(s.replace(/(\s*\.){2,}.*$/, '').replace(/\s+\d+\s*$/, '').replace(/\s+/g, ' ').trim().replace(/\.$/, ''));
      }
      /* cabeceras de cada ITC: línea con solo «ITC-BT-NN» */
      let last = 0;
      for (let i = 215; i < L.length; i++) {
        const m = L[i].match(/^\s*ITC-BT-(\d\d)(?:\s{3,}\S.*)?\s*$/);
        if (m && +m[1] === last + 1) { idx.push([m[1], i]); last = +m[1]; }
      }
      const secs = [{ id: 'reglamento', n: '', t: 'Real Decreto y artículos 1 a 29', a: 0, b: idx.length ? idx[0][1] : L.length }];
      idx.forEach(([n, a], k) => secs.push({ id: 'itc' + n, n: 'ITC-BT-' + n, t: tit[n] || '', a, b: k + 1 < idx.length ? idx[k + 1][1] : L.length }));
      DB = { L, secs, nl: null };
      return DB;
    });
  }

  /* convierte las líneas de una sección en bloques legibles */
  function bloques(lines) {
    const out = []; let cur = '';
    const flush = () => { if (cur) out.push(cur); cur = ''; };
    const nuevo = s => /^(\d+(\.\d+)+\.?\s|\d+\.\s+[A-ZÁÉÍÓÚ]|[-•]\s*\S|[a-z]\)\s|Art[íi]culo \d)/.test(s);
    let prevLen = 0;
    lines.forEach(raw => {
      const s = raw.trim();
      if (!s || /^(P[áa]gina \d+|BOLET[ÍI]N OFICIAL DEL ESTADO|LEGISLACI[ÓO]N CONSOLIDADA)$/.test(s)) { flush(); prevLen = 0; return; }
      if (cur && prevLen >= 72 && !nuevo(s)) { cur += (/-$/.test(cur) ? '' : ' ') + s; }
      else { flush(); cur = s; }
      prevLen = s.length;
    });
    flush();
    return out;
  }
  const esHead = b => b.length < 110 && (/^(\d+(\.\d+)*\.?\s+\S|Art[íi]culo \d+\.|ANEXO|Disposici[óo]n )/.test(b) || (b.length < 70 && b === b.toUpperCase() && /[A-ZÁÉÍÓÚ]{3}/.test(b)));
  function html(lines, w) {
    const re = w && w.length ? new RegExp('(' + w.join('|') + ')', 'ig') : null;
    const hl = s => { s = esc(s); return re ? s.replace(re, '<mark>$1</mark>') : s; };
    return bloques(lines).map(b => esHead(b) ? `<h3 class="rh">${hl(b)}</h3>` : `<p>${hl(b)}</p>`).join('');
  }

  const row = (h, a, b) => `<a class="lrow" href="${h}"><span class="l1">${a}</span>${b ? `<span class="l2">${b}</span>` : ''}</a>`;

  route(/^#\/rebt$/, () => {
    view.innerHTML = `<h1>REBT oficial</h1><p class="lead">Texto consolidado del Reglamento electrotécnico para baja tensión (Real Decreto 842/2002), tal como lo publica el BOE. Última modificación incluida: 3 de septiembre de 2025.</p>
    <input id="rq" type="search" placeholder="Buscar un número de ITC, un título o una frase" autocomplete="off" aria-label="Buscar en el REBT">
    <div id="rl"><p class="muted">Cargando el reglamento…</p></div>
    <p class="muted mini">Fuente: BOE-A-2002-18099 (legislación consolidada). El texto oficial vigente es el del BOE; esta copia puede quedar desfasada tras nuevas modificaciones. Las tablas y figuras del original pueden verse peor aquí.</p>`;
    load().then(db => {
      const draw = () => {
        const q = norm($('#rq').value).trim(), w = q.split(/\s+/).filter(x => x.length > 1);
        const lista = db.secs.filter(s => !q || norm(s.n + ' ' + s.t).includes(q) || (/^\d+$/.test(q) && s.n.endsWith(q.padStart(2, '0'))));
        let h = '';
        if (!q) h += `<h2>Reglamento</h2><div class="lrows">${row('#/rebt/reglamento', 'Real Decreto y artículos 1 a 29', 'Objeto, campo de aplicación, instaladores, inspecciones, sanciones')}</div><h2>Instrucciones técnicas complementarias</h2>`;
        else h += `<h2>Instrucciones y artículos</h2>`;
        const itcs = lista.filter(s => s.id !== 'reglamento');
        h += `<div class="lrows">${(q && lista.some(s => s.id === 'reglamento') ? row('#/rebt/reglamento', 'Real Decreto y artículos 1 a 29', '') : '') + itcs.map(s => row('#/rebt/' + s.id, esc(s.n), esc(s.t))).join('') || ''}</div>`;
        if (!lista.length) h += '<p class="muted">Ninguna instrucción coincide.</p>';
        h += '<div id="rt"></div>';
        $('#rl').innerHTML = h;
        if (w.length && q.length >= 3) {
          if (!db.nl) db.nl = db.L.map(x => norm(x));
          const hits = []; const win = 3;
          for (const s of db.secs) {
            for (let i = s.a; i < s.b && hits.length < 60; i++) {
              if (w.every(x => db.nl[i].includes(x)) || (w.length > 1 && w.every(x => (db.nl[i] + ' ' + (db.nl[i + 1] || '') + ' ' + (db.nl[i + 2] || '')).includes(x)) && w.some(x => db.nl[i].includes(x)))) {
                hits.push([s, i]); i += win;
              }
            }
            if (hits.length >= 60) break;
          }
          $('#rt').innerHTML = `<h2>En el texto${hits.length ? ' (' + hits.length + (hits.length >= 60 ? '+' : '') + ')' : ''}</h2>` + (hits.length ? `<div class="lrows">${hits.map(([s, i]) => row('#/rebt/' + s.id + '/' + encodeURIComponent(w.join(' ')), esc(s.n || 'Reglamento'), esc(db.L.slice(i, i + 3).map(x => x.trim()).join(' ').slice(0, 200)))).join('')}</div>` : '<p class="muted">Sin coincidencias.</p>');
        }
      };
      let tm; $('#rq').oninput = () => { clearTimeout(tm); tm = setTimeout(draw, 250); }; draw();
    }).catch(() => { $('#rl').innerHTML = '<div class="note bad">No se pudo cargar el texto del reglamento.</div>'; });
  });

  const leer = (id, q) => {
    view.innerHTML = '<p class="muted">Cargando…</p>';
    load().then(db => {
      const i = db.secs.findIndex(s => s.id === id), s = db.secs[i];
      if (!s) { view.innerHTML = '<h1>No encontrado</h1><p><a href="#/rebt">Volver al REBT</a></p>'; return; }
      const w = q ? norm(q).split(/\s+/).filter(x => x.length > 1) : [];
      const pv = db.secs[i - 1], nx = db.secs[i + 1];
      const nav = `<div class="rnav">${pv ? `<a class="btn sm" href="#/rebt/${pv.id}">&larr; ${esc(pv.n || 'Reglamento')}</a>` : '<span></span>'}<a class="btn sm" href="#/rebt">Índice</a>${nx ? `<a class="btn sm" href="#/rebt/${nx.id}">${esc(nx.n)} &rarr;</a>` : '<span></span>'}</div>`;
      view.innerHTML = `<p class="mini"><a href="#/rebt">&larr; REBT oficial</a></p><h1>${esc(s.n || 'Reglamento')}</h1><p class="lead">${esc(s.t)}</p>
      <input id="rf" type="search" placeholder="Buscar dentro de esta instrucción" value="${esc(q || '')}" autocomplete="off" aria-label="Buscar en esta instrucción">
      ${nav}<div class="rtext" id="rtx"></div>${nav}`;
      const lines = db.L.slice(s.a, s.b);
      const draw = qq => {
        const ww = norm(qq || '').split(/\s+/).filter(x => x.length > 1);
        /* el resaltado compara sin acentos: se aplica sobre el texto original con una expresión tolerante */
        const re = ww.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/a/g, '[aá]').replace(/e/g, '[eé]').replace(/i/g, '[ií]').replace(/o/g, '[oó]').replace(/u/g, '[uúü]').replace(/n/g, '[nñ]'));
        $('#rtx').innerHTML = html(lines, re);
        const m = $('#rtx mark'); if (m) m.scrollIntoView({ block: 'center' });
      };
      draw(q);
      let tm; $('#rf').oninput = e => { clearTimeout(tm); tm = setTimeout(() => draw(e.target.value), 300); };
    }).catch(() => { view.innerHTML = '<div class="note bad">No se pudo cargar el texto del reglamento.</div>'; });
  };
  route(/^#\/rebt\/([^/]+)$/, id => leer(id, ''));
  route(/^#\/rebt\/([^/]+)\/(.+)$/, (id, q) => leer(id, q));
});
