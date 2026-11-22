/* Guía REBT: buscador "¿Qué dice el REBT de…?" + búsqueda en el texto completo del reglamento. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, view, $, $$ } = A;
  const G = window.GUIA || [];
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const strip = h => String(h).replace(/<[^>]+>/g, ' ');
  const BADGE = { rebt: ['REBT', 'itc'], practica: ['Práctica / no REBT', ''], nota: ['Nota', ''] };
  const CATS = [...new Set(G.map(g => g.cat))];

  const st = document.createElement('style');
  st.textContent = `.rq{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--line)}.rq:last-child{border:0}.rq .tag{flex:none;margin-top:2px}.rq.practica{opacity:.9}.rq .src{font-size:12px;color:var(--muted);display:block}.snip{padding:10px 0;border-bottom:1px solid var(--line)}.snip mark{background:var(--warnbg);color:var(--text);border-radius:3px}`;
  document.head.appendChild(st);

  let cat = '', q = '';
  route(/^#\/guia$/, () => {
    view.innerHTML = `<h1>Guía: ¿qué dice el REBT de…?</h1><p class="lead">Escribe un elemento (interruptor, enchufe, cuadro, baño, tierra…) y mira qué exige el reglamento: alturas, distancias, ubicación, y la ITC de donde sale.</p>
    <input id="gq" type="search" placeholder="Ej.: interruptor, contador, cocina, piscina…" value="${esc(q)}" autocomplete="off" aria-label="Buscar elemento">
    <div class="chips" id="gc"><button class="chip ${cat ? '' : 'on'}" data-c="">Todo</button>${CATS.map(c => `<button class="chip ${cat === c ? 'on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <div class="note">Marcado <b>REBT</b>: dato del texto consolidado. <b>Práctica / no REBT</b>: lo suelen exigir normas UNE/CTE o la costumbre, pero el REBT no lo fija.</div>
    <div id="gl"></div>
    <h2>Buscar en el texto completo del REBT</h2><div class="row"><input id="fq" type="search" placeholder="Palabras a buscar en todas las ITC" style="flex:1"><button class="btn pri" id="fb">Buscar</button></div><div id="fr"></div>`;
    const draw = () => {
      const n = norm(q).split(/\s+/).filter(Boolean);
      const list = G.filter(g => (!cat || g.cat === cat) && n.every(w => norm(g.n + ' ' + g.k + ' ' + g.r.map(r => strip(r.t)).join(' ')).includes(w)));
      $('#gl').innerHTML = list.length ? list.map(g => `<details ${n.length || list.length === 1 ? 'open' : ''}><summary>${g.ic} ${esc(g.n)} <span class="tag">${esc(g.cat)}</span></summary><div>${g.r.map(r => { const b = BADGE[r.tipo] || BADGE.nota; return `<div class="rq ${r.tipo}"><span class="tag ${b[1]}">${b[0]}</span><div>${r.t}${r.s ? `<span class="src">${esc(r.s)}</span>` : ''}</div></div>`; }).join('')}</div></details>`).join('') : '<p class="muted">Sin resultados. Prueba con otra palabra o usa la búsqueda en el texto completo.</p>';
    };
    draw();
    $('#gq').oninput = e => { q = e.target.value; draw(); };
    $$('#gc .chip').forEach(b => b.onclick = () => { cat = b.dataset.c; $$('#gc .chip').forEach(x => x.classList.toggle('on', x === b)); draw(); });

    let chunks = null;
    const load = () => chunks ? Promise.resolve(chunks) : fetch('data/rebt.txt').then(r => { if (!r.ok) throw 0; return r.text(); }).then(t => {
      const parts = t.split(/\n(?=\s*(?:ITC-BT-\d{2}\b|INSTRUCCI[ÓO]N T[ÉE]CNICA COMPLEMENTARIA ITC-BT))/); chunks = [];
      parts.forEach(p => { const m = p.match(/ITC-BT-\d{2}/); const lab = m ? m[0] : 'RD 842/2002'; for (let i = 0; i < p.length; i += 900) { const s = p.slice(i, i + 1100); chunks.push({ lab, s, n: norm(s) }); } });
      return chunks;
    });
    const search = () => {
      const w = norm($('#fq').value).split(/\s+/).filter(x => x.length > 1); if (!w.length) return;
      $('#fr').innerHTML = '<p class="muted">Buscando…</p>';
      load().then(ch => {
        const hits = ch.filter(c => w.every(x => c.n.includes(x))).slice(0, 40);
        const re = new RegExp('(' + w.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig');
        $('#fr').innerHTML = hits.length ? `<p class="muted">${hits.length}${hits.length === 40 ? '+' : ''} fragmentos</p>` + hits.map(h => `<div class="snip"><span class="tag itc">${esc(h.lab)}</span> ${esc(h.s.replace(/\s+/g, ' ')).replace(re, '<mark>$1</mark>')}</div>`).join('') : '<p class="muted">Sin coincidencias.</p>';
      }).catch(() => { $('#fr').innerHTML = '<div class="note bad">No se pudo cargar el texto del reglamento (data/rebt.txt).</div>'; });
    };
    $('#fb').onclick = search; $('#fq').onkeydown = e => { if (e.key === 'Enter') search(); };
  });
});
