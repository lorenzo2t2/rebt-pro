/* REBT Pro - interfaz. Vanilla JS, sin dependencias. Datos en localStorage (nunca sale del dispositivo). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.Calc, T = window.TEMARIO, QS = window.PREGUNTAS;
  const view = $('#view');

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : NaN; };
  const fmt = (x, d = 2) => (x == null || !isFinite(x)) ? '—' : x.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const store = {
    get(k, d) { try { const v = localStorage.getItem('rebt.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('rebt.' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
  };
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return 'q' + (h >>> 0).toString(36); };
  QS.forEach(q => { q.id = hash(q.t); });
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const UNIDADES = Object.fromEntries(T.map(u => [u.id, u]));
  const allFichas = () => T.flatMap(u => u.fichas.map(f => Object.assign({ unidad: u }, f)));

  /* ---------- navegación ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M9 7h6"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h1M12 12h1M16 12h0M8 16h1M12 16h1M16 16h0"/>',
    check: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',
    schema: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 6h5v12H7M12 12h5"/>',
    doc: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    tools: '<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    down: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    palette: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18c1.5 0 2-1 1.5-2.2-.6-1.3.4-2.3 1.7-2.3H17a4 4 0 004-4 9 9 0 00-9-9z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    cable: '<circle cx="12" cy="12" r="4"/><path d="M2 12h6M16 12h6"/>',
    earth: '<path d="M12 3v10M6 13h12M8 17h8M10 21h4"/>',
    house: '<path d="M4 21V9l8-6 8 6v12z"/><path d="M10 21v-6h4v6"/>',
  };
  const ic = n => '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>';
  const NAV = [
    ['#/', 'Inicio', 'home', ''],
    ['#/guia', 'Guía REBT', 'search', 'Consultar'], ['#/temario', 'Temario', 'book', 'Consultar'], ['#/ref', 'Tablas', 'table', 'Consultar'], ['#/docs', 'Documentación', 'file', 'Consultar'],
    ['#/calc', 'Cálculos', 'calc', 'Herramientas'], ['#/esquemas', 'Esquemas', 'schema', 'Herramientas'], ['#/pruebas', 'Pruebas', 'flask', 'Herramientas'], ['#/crear', 'Crear documentos', 'doc', 'Herramientas'], ['#/utiles', 'Utilidades', 'tools', 'Herramientas'],
    ['#/test', 'Examen', 'check', 'Formación'], ['#/acceso', 'Acceso y examen', 'cap', 'Formación'],
    ['#/temas', 'Temas', 'palette', 'Aplicación'], ['#/actualizar', 'Actualizar', 'down', 'Aplicación'], ['#/fuentes', 'Fuentes', 'info', 'Aplicación'],
  ];
  const TAB = ['Inicio', 'Guía REBT', 'Cálculos', 'Esquemas', 'Examen'];
  function renderNav(cur) {
    const on = h => (h === '#/' ? cur === '#/' || cur === '' : cur.startsWith(h)) ? 'on' : '';
    let g = '';
    $('#nav').innerHTML = '<div class="logo"><i>' + ic('bolt') + '</i><div>REBT Pro<small>Herramienta para instaladores BT</small></div></div>' +
      NAV.map(([h, t, i, grp]) => { let x = ''; if (grp !== g) { g = grp; if (grp) x = '<div class="ng">' + grp + '</div>'; } return x + '<a href="' + h + '" class="' + on(h) + '">' + ic(i) + t + '</a>'; }).join('') +
      '<div class="sp"></div><button class="btn sm" id="theme">Cambiar tema</button><div class="mini">Basado en el RD 842/2002 consolidado (BOE). Los datos orientativos no sustituyen al texto oficial.</div>';
    $('#tabbar').innerHTML = NAV.filter(n => TAB.includes(n[1])).map(([h, t, i]) => '<a href="' + h + '" class="' + on(h) + '">' + ic(i) + t.replace('Guía REBT', 'Guía') + '</a>').join('') + '<a href="#/mas" class="' + on('#/mas') + '">' + ic('menu') + 'Más</a>';
    const tb = $('#theme');
    if (tb) tb.onclick = () => {
      const r = document.documentElement; const cur = r.dataset.theme;
      const next = cur === 'light' ? 'dark' : 'light';
      r.dataset.theme = next; store.set('theme', next);
    };
  }
  document.documentElement.dataset.theme = store.get('theme', '') || 'dark'; document.documentElement.dataset.estilo = store.get('estilo', 'futurista');


  /* Quita emojis del contenido: la interfaz usa iconos de línea. */
  const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{2712}\u{2728}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]\s?/gu;
  let limpiando = false;
  const limpiar = root => {
    if (limpiando) return; limpiando = true;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; const lista = [];
    while ((n = w.nextNode())) { if (!n.parentElement || n.parentElement.closest('svg,script,style,textarea')) continue; EMO.lastIndex = 0; if (EMO.test(n.nodeValue)) lista.push(n); }
    lista.forEach(t => { t.nodeValue = t.nodeValue.replace(EMO, ''); });
    limpiando = false;
  };
  new MutationObserver(() => limpiar(view)).observe(view, { childList: true, subtree: true, characterData: true });

  const routes = [];
  const route = (re, fn) => routes.push([re, fn]);
  function go() {
    const h = location.hash || '#/';
    renderNav(h);
    stopTimer();
    for (const [re, fn] of routes) { const m = h.match(re); if (m) { fn(...m.slice(1).map(decodeURIComponent)); window.scrollTo(0, 0); view.focus({ preventScroll: true }); return; } }
    view.innerHTML = '<h1>No encontrado</h1><p><a href="#/">Volver al inicio</a></p>';
  }
  window.addEventListener('hashchange', go);

  /* =====================================================================
     INICIO
     ===================================================================== */
  function progresoTemario() {
    const done = store.get('estudiadas', {});
    const fs = allFichas();
    return { done: fs.filter(f => done[f.id]).length, total: fs.length };
  }
  function statsPreguntas() {
    const st = store.get('stats', {});
    let ok = 0, ko = 0, vistas = 0, dominadas = 0;
    QS.forEach(q => { const s = st[q.id]; if (s) { vistas++; ok += s.ok; ko += s.ko; if (s.box >= 2) dominadas++; } });
    return { ok, ko, vistas, dominadas, total: QS.length, pct: ok + ko ? Math.round(ok / (ok + ko) * 100) : 0 };
  }
  route(/^#\/?$/, () => {
    const p = progresoTemario(), s = statsPreguntas();
    const hist = store.get('simulacros', []);
    const last = hist[hist.length - 1];
    const tile = (h, i, t, d) => `<a class="tile" href="${h}"><div class="ti">${ic(i)}</div><div><b>${t}</b><span>${d}</span></div></a>`;
    view.innerHTML = `
    <div class="top">
      <div><div class="kick">Baja tensión · REBT</div><h1>REBT Pro</h1><p>Herramienta de aprendizaje y utilidades para el instalador: consulta del reglamento, cálculo, esquemas, documentación y práctica.</p>
      <form class="sbox" id="hs" role="search">${ic('search')}<input id="hq" type="search" placeholder="¿Qué dice el REBT de…?" autocomplete="off" aria-label="Buscar en el REBT"></form></div>
      <canvas id="fx3d" aria-hidden="true"></canvas>
    </div>
    <h2>Herramientas</h2>
    <div class="tiles">
      ${tile('#/calc/seccion', 'cable', 'Sección de cables', 'Intensidad, caída de tensión y protección.')}
      ${tile('#/calc/caida', 'pulse', 'Caída de tensión', 'Comprobación por circuito y tramo.')}
      ${tile('#/calc/vivienda', 'house', 'Circuitos de vivienda', 'Electrificación, C1–C13, IGM y diferenciales.')}
      ${tile('#/calc/tierra', 'earth', 'Puesta a tierra', 'Resistencia, electrodos y protección.')}
      ${tile('#/esquemas', 'schema', 'Esquemas unifilares', 'Editor con símbolos y plantillas.')}
      ${tile('#/pruebas', 'flask', 'Pruebas y mediciones', 'Cómo se hace cada ensayo y qué se anota.')}
      ${tile('#/crear', 'doc', 'Crear documentos', 'Memoria, CIE, verificación, presupuesto.')}
      ${tile('#/utiles', 'tools', 'Utilidades', 'Código IP/IK, conversores, tablas rápidas.')}
    </div>
    <h2>Consultar y aprender</h2>
    <div class="tiles">
      ${tile('#/guia', 'search', 'Guía REBT', 'Alturas, distancias y ubicación por elemento.')}
      ${tile('#/temario', 'book', 'Temario', '7 unidades y todas las ITC-BT con datos clave.')}
      ${tile('#/test', 'check', 'Preparar el examen', 'Test por unidad, simulacros y repaso de fallos.')}
      ${tile('#/acceso', 'cap', 'Acceso y examen', 'Vías para obtener la habilitación.')}
      ${tile('#/ref', 'table', 'Tablas', 'Intensidades, tubos y valores de referencia.')}
      ${tile('#/docs', 'file', 'Documentación', 'Flujo de trabajo y listas de comprobación.')}
    </div>
    <h2>Tu actividad</h2>
    <div class="kpis">
      <div><small>Temario revisado</small><strong>${p.done}/${p.total}</strong><div class="bar"><i style="width:${p.total ? p.done / p.total * 100 : 0}%"></i></div></div>
      <div><small>Preguntas vistas</small><strong>${s.vistas}/${s.total}</strong><div class="bar"><i style="width:${s.vistas / s.total * 100}%"></i></div></div>
      <div><small>Aciertos</small><strong>${s.ok + s.ko ? s.pct + ' %' : '—'}</strong><div class="bar"><i style="width:${s.pct}%"></i></div></div>
      <div><small>Último simulacro</small><strong>${last ? fmt(last.nota, 1) + '/10' : '—'}</strong><div class="muted" style="font-size:12px">${last ? new Date(last.fecha).toLocaleDateString('es-ES') + ' · ' + last.n + ' preguntas' : 'Sin simulacros'}</div></div>
    </div>
    <p class="foot">Herramienta de apoyo. El texto oficial del REBT (BOE) y la normativa de tu comunidad autónoma prevalecen siempre. Verifica los resultados antes de ejecutar una instalación real.</p>`;
    if (window.REBTFx) REBTFx.mount($('#fx3d'));
    $('#hs').onsubmit = ev => { ev.preventDefault(); const v = $('#hq').value.trim(); try { sessionStorage.setItem('rebt.gq', v); } catch (x) { } location.hash = '#/guia'; };
  });

  /* =====================================================================
     TEMARIO
     ===================================================================== */
  route(/^#\/temario$/, () => {
    const done = store.get('estudiadas', {});
    const info = window.EXAMEN_INFO;
    view.innerHTML = `<h1>Temario REBT</h1><p class="lead">Organizado según el Apéndice II de la ITC-BT-03 (contenidos mínimos del instalador, categoría básica). Marca cada ficha cuando la domines.</p>
    <details><summary>${esc(info.titulo)}</summary><div class="ficha"><ul>${info.puntos.map(p => `<li>${p}</li>`).join('')}</ul></div></details>
    <div class="row noprint" style="margin:14px 0"><input id="busca" placeholder="Buscar en todo el temario (ej. caída de tensión, IPX4, 30 mA)…" aria-label="Buscar"></div>
    <div id="res"></div>
    ${T.map(u => {
      const n = u.fichas.filter(f => done[f.id]).length;
      return `<h2 style="border-left:5px solid ${u.color};padding-left:10px">${esc(u.titulo)} <span class="muted" style="font-size:14px;font-weight:600">${n}/${u.fichas.length}</span></h2>
      <div class="grid g2">${u.fichas.map(f => `<a class="card" href="#/ficha/${f.id}"><span class="tag itc">${esc(f.itc)}</span>${done[f.id] ? '<span class="tag" style="background:var(--okbg);color:var(--ok)">✓ estudiada</span>' : ''}<h3 style="margin-top:8px">${esc(f.titulo)}</h3></a>`).join('')}</div>`;
    }).join('')}`;
    const b = $('#busca');
    b.oninput = () => {
      const q = b.value.trim().toLowerCase();
      const out = $('#res');
      if (q.length < 2) { out.innerHTML = ''; return; }
      const hits = [];
      allFichas().forEach(f => {
        const txt = [f.titulo, f.itc, ...(f.puntos || []), ...(f.clave || [])].join(' ');
        const plain = txt.replace(/<[^>]+>/g, ' ');
        const i = plain.toLowerCase().indexOf(q);
        if (i >= 0) hits.push({ f, snip: plain.slice(Math.max(0, i - 60), i + 120) });
      });
      out.innerHTML = `<h3>${hits.length} resultado(s)</h3>` + hits.slice(0, 20).map(h => `<a class="card" style="margin:8px 0" href="#/ficha/${h.f.id}"><span class="tag itc">${esc(h.f.itc)}</span><b>${esc(h.f.titulo)}</b><p>…${esc(h.snip)}…</p></a>`).join('');
    };
  });

  route(/^#\/ficha\/([\w-]+)$/, id => {
    const fs = allFichas(); const i = fs.findIndex(f => f.id === id); const f = fs[i];
    if (!f) { view.innerHTML = '<p>Ficha no encontrada</p>'; return; }
    const done = store.get('estudiadas', {});
    const rel = QS.filter(q => q.r && f.itc && f.itc.split(/\s*[\/+]\s*|\s+a\s+/).some(p => /ITC-BT-\d+/.test(p) && q.r.includes(p.replace('ITC-BT-', '').trim()) ));
    view.innerHTML = `<p><a href="#/temario">← Temario</a></p>
    <div class="ficha"><span class="tag itc">${esc(f.itc)}</span><span class="tag" style="color:${f.unidad.color}">${esc(f.unidad.titulo)}</span>
    <h1 style="margin-top:8px">${esc(f.titulo)}</h1>
    <ul>${f.puntos.map(p => `<li>${p}</li>`).join('')}</ul>
    ${f.tabla ? `<div class="tw"><table><thead><tr>${f.tabla.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${f.tabla.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
    ${f.clave && f.clave.length ? `<div class="clave"><b>Para memorizar</b><ul>${f.clave.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    </div>
    <div class="row noprint" style="margin-top:18px">
      <button class="btn pri" id="mark">${done[f.id] ? '✓ Estudiada (desmarcar)' : 'Marcar como estudiada'}</button>
      <a class="btn" href="#/test/practica/${f.unidad.id}">Practicar ${f.unidad.id}</a>
      <span class="sp"></span>
      ${i > 0 ? `<a class="btn" href="#/ficha/${fs[i - 1].id}">← Anterior</a>` : ''}${i < fs.length - 1 ? `<a class="btn" href="#/ficha/${fs[i + 1].id}">Siguiente →</a>` : ''}
    </div>`;
    $('#mark').onclick = () => { const d = store.get('estudiadas', {}); if (d[f.id]) delete d[f.id]; else d[f.id] = 1; store.set('estudiadas', d); go(); };
  });

  /* =====================================================================
     CALCULADORAS
     ===================================================================== */
  const OPT = {
    sis: [['mono', 'Monofásico 230 V'], ['tri', 'Trifásico 400 V']],
    mat: [['Cu', 'Cobre'], ['Al', 'Aluminio (≥ 16 mm²)']],
    aisl: [['PVC', 'PVC (70 ºC)'], ['XLPE', 'XLPE/EPR (90 ºC)']],
    metodo: Object.entries(C.METODOS).map(([k, v]) => [k, v.nombre]),
  };
  const kvs = (items) => `<div class="kv">${items.map(([k, v, cls]) => `<div><b>${k}</b><span class="${cls || ''}">${v}</span></div>`).join('')}</div>`;
  const verdict = (ok, t1, t2) => `<div class="note ${ok ? 'ok' : 'bad'}">${ok ? '✔ ' + t1 : '✖ ' + t2}</div>`;

  const CALCS = [
    { id: 'seccion', t: 'Sección de cables', i: '🔌', d: 'Intensidad admisible (ITC-BT-19) + caída de tensión + protección.',
      f: [
        ['sis', 'Sistema', 'select', OPT.sis, 'mono'], ['P', 'Potencia (W)', 'num', null, 3450], ['cosfi', 'cos φ', 'num', null, 1], ['L', 'Longitud (m)', 'num', null, 20],
        ['mat', 'Conductor', 'select', OPT.mat, 'Cu'], ['aisl', 'Aislamiento', 'select', OPT.aisl, 'PVC'], ['metodo', 'Método de instalación', 'select', OPT.metodo, 'B'],
        ['limite', 'Caída máx. (%)', 'num', null, 3], ['tAmb', 'Temperatura ambiente (ºC)', 'num', null, 40], ['nCirc', 'Circuitos agrupados', 'num', null, 1],
        ['tipo', 'Tipo de carga', 'select', [['1', 'Normal'], ['1.25', 'Motor (×1,25, ITC-BT-47)'], ['1.8', 'Lámparas de descarga (×1,8, ITC-BT-44)']], '1'],
        ['Ib', 'Ib conocida (A) — opcional', 'num', null, ''],
      ],
      run(v) {
        const r = C.calcularSeccion({ sistema: v.sis, P: v.P, cosfi: v.cosfi || 1, L: v.L, mat: v.mat, aisl: v.aisl, metodo: v.metodo, limite: v.limite, tAmb: v.tAmb, nCirc: v.nCirc, factorCarga: +v.tipo, Ib: isNaN(v.Ib) ? null : v.Ib });
        if (!r.solucion) return `<div class="result">${kvs([['Ib', fmt(r.Ib) + ' A']])}<div class="note bad">Ninguna sección normalizada cumple con estos datos (prueba con otro método, mayor sección posible, tubo mayor o menor longitud).</div>${tablaCand(r)}</div>`;
        const s = r.solucion, p = r.proteccion;
        window._ultimoCalc = { tipo: 'Sección', datos: v, r };
        return `<div class="result"><div class="big">${fmt(s.S, 2)} mm² ${v.mat}</div>
        ${kvs([['Ib (corriente de empleo)', fmt(r.Ib) + ' A'], ['Iz (admisible corregida)', fmt(s.Iz) + ' A'], ['I tabla ITC-BT-19', fmt(s.Itab) + ' A'], ['Factor temperatura', fmt(r.kT, 3)], ['Factor agrupamiento', fmt(r.kG, 2)], ['Caída de tensión', fmt(s.dU) + ' V · ' + fmt(s.dUp, 2) + ' %', s.okU ? 'ok' : 'ko']])}
        ${p ? verdict(p.cumpleIbInIz, `Protección: magnetotérmico de ${p.In} A. Ib ≤ In ≤ Iz y I₂ = ${p.I2} A ≤ 1,45·Iz = ${p.limiteI2} A.`, `El calibre ${p.In} A supera Iz: aumenta la sección.`) : ''}
        ${p && p.aviso ? `<div class="note">${p.aviso}</div>` : ''}
        ${v.mat === 'Al' ? '<div class="note">Aluminio: valores estimados (≈ 78 % del cobre). Consulta UNE 20460-5-523 para el valor exacto.</div>' : ''}
        ${tablaCand(r)}
        <div class="row noprint"><button class="btn sm" id="addMem">➕ Añadir a la memoria de cálculos</button></div></div>`;
      },
      after() { const b = $('#addMem'); if (b) b.onclick = () => { const m = store.get('memoria', []); const c = window._ultimoCalc; m.push({ f: new Date().toISOString(), t: 'Sección de cable', d: describeSeccion(c) }); store.set('memoria', m); b.textContent = '✓ Añadido'; }; },
    },
    { id: 'caida', t: 'Caída de tensión', i: '📉', d: 'ΔU de una línea con sección dada, pérdidas y longitud máxima.',
      f: [['sis', 'Sistema', 'select', OPT.sis, 'mono'], ['I', 'Intensidad (A)', 'num', null, 16], ['L', 'Longitud (m)', 'num', null, 25], ['S', 'Sección (mm²)', 'select', C.SECCIONES.map(s => [s, s + ' mm²']), 2.5], ['mat', 'Conductor', 'select', OPT.mat, 'Cu'], ['aisl', 'Aislamiento', 'select', OPT.aisl, 'PVC'], ['cosfi', 'cos φ', 'num', null, 1], ['limite', 'Límite (%)', 'num', null, 3]],
      run(v) {
        const S = +v.S; const r = C.calcularCaida({ sistema: v.sis, I: v.I, L: v.L, S, mat: v.mat, aisl: v.aisl, cosfi: v.cosfi || 1 });
        const Lmax = C.longitudMaxima({ sistema: v.sis, I: v.I, S, mat: v.mat, aisl: v.aisl, cosfi: v.cosfi || 1, limite: v.limite });
        return `<div class="result"><div class="big ${r.dUp <= v.limite ? 'ok' : 'ko'}">${fmt(r.dUp, 2)} %</div>${kvs([['Caída ΔU', fmt(r.dU) + ' V'], ['Resistencia del tramo', fmt(r.R, 4) + ' Ω'], ['Pérdidas por efecto Joule', fmt(r.perdidaW) + ' W'], ['Longitud máx. con ' + v.limite + ' %', fmt(Lmax) + ' m']])}${verdict(r.dUp <= v.limite, 'Cumple el límite de caída de tensión.', 'Supera el límite: aumenta la sección o reduce la longitud.')}
        <p class="muted">Fórmula: ΔU = k·I·L·(R·cosφ + X·senφ), k = 2 (mono) o √3 (trifásico); ρ a la temperatura de servicio (70 ºC PVC / 90 ºC XLPE).</p></div>`;
      } },
    { id: 'ohm', t: 'Ohm, potencia y trifásica', i: '⚡', d: 'Convierte entre P, I, U, R, cos φ, S y Q en mono y trifásico.',
      f: [['sis', 'Sistema', 'select', OPT.sis, 'mono'], ['U', 'Tensión (V)', 'num', null, 230], ['I', 'Intensidad (A)', 'num', null, 16], ['cosfi', 'cos φ', 'num', null, 0.9], ['P', 'Potencia activa P (W) — si se conoce', 'num', null, '']],
      run(v) {
        const k = v.sis === 'tri' ? Math.sqrt(3) : 1; const c = v.cosfi || 1;
        let I = v.I, P = k * v.U * v.I * c;
        if (!isNaN(v.P) && v.P > 0) { I = v.P / (k * v.U * c); P = v.P; }
        const S = k * v.U * I, Q = Math.sqrt(Math.max(0, S * S - P * P));
        return `<div class="result">${kvs([['P activa', fmt(P) + ' W'], ['S aparente', fmt(S) + ' VA'], ['Q reactiva', fmt(Q) + ' VAr'], ['Intensidad', fmt(I) + ' A'], ['R equivalente (U/I)', fmt(v.U / I) + ' Ω'], ['Energía en 1 h', fmt(P / 1000, 3) + ' kWh']])}</div>`;
      } },
    { id: 'vivienda', t: 'Vivienda: circuitos y electrificación', i: '🏠', d: 'Grado de electrificación, circuitos C1–C13, IGM y diferenciales (ITC-BT-25).',
      f: [['sup', 'Superficie útil (m²)', 'num', null, 90], ['pl', 'Puntos de luz', 'num', null, 18], ['tg', 'Tomas de uso general (C2)', 'num', null, 14], ['tb', 'Tomas de baño y cocina (C5)', 'num', null, 5],
        ['cal', 'Calefacción eléctrica', 'check', null, false], ['aire', 'Aire acondicionado', 'check', null, false], ['sec', 'Secadora independiente', 'check', null, false], ['aut', 'Automatización / gestión energía', 'check', null, false], ['ve', 'Recarga de vehículo eléctrico', 'check', null, false], ['elec', 'Muchos electrodomésticos (más de un circuito C3/C4)', 'check', null, false]],
      run(v) {
        const elevada = v.sup > 160 || v.cal || v.aire || v.aut || v.ve || v.elec || v.sec;
        const cs = [['C1', 'Iluminación', '10 A', '1,5 mm²', '16 mm']], c = (a, b, c2, d, e) => cs.push([a, b, c2, d, e]);
        c('C2', 'Tomas generales y frigorífico', '16 A', '2,5 mm²', '20 mm'); c('C3', 'Cocina y horno', '25 A', '6 mm²', '25 mm'); c('C4', 'Lavadora, lavavajillas y termo', '20 A', '4 mm²', '20 mm'); c('C5', 'Baño y auxiliares de cocina', '16 A', '2,5 mm²', '20 mm');
        const adic = [];
        if (v.pl > 30) { c('C6', 'Iluminación adicional (cada 30 puntos de luz)', '10 A', '1,5 mm²', '16 mm'); adic.push('C6'); }
        if (v.tg > 20 || v.sup > 160) { c('C7', 'Tomas de uso general adicional', '16 A', '2,5 mm²', '20 mm'); adic.push('C7'); }
        if (v.cal) c('C8', 'Calefacción eléctrica', '25 A', '6 mm²', '25 mm'); if (v.aire) c('C9', 'Aire acondicionado', '25 A', '6 mm²', '25 mm');
        if (v.sec) c('C10', 'Secadora', '16 A', '2,5 mm²', '20 mm'); if (v.aut) c('C11', 'Automatización', '10 A', '1,5 mm²', '16 mm');
        if (v.tb > 6) c('C12', 'Circuito adicional tipo C5 (más de 6 tomas)', '16 A', '2,5 mm²', '20 mm');
        if (v.ve) c('C13', 'Recarga del vehículo eléctrico (ITC-BT-52)', 'Según ITC-BT-52', '—', '—');
        const dif = Math.ceil(cs.filter(x => x[0] !== 'C13').length / 5) + (v.ve ? 1 : 0);
        const lucesCirc = Math.ceil(v.pl / 30);
        return `<div class="result"><div class="big">${elevada ? 'Electrificación ELEVADA' : 'Electrificación BÁSICA'}</div>${kvs([['Potencia mínima', elevada ? '9200 W' : '5750 W'], ['IGM', elevada ? '40 A' : '25 A'], ['Circuitos', cs.length], ['Diferenciales mín. (30 mA)', dif], ['Circuitos de alumbrado necesarios', lucesCirc]])}
        <div class="tw"><table><thead><tr><th>Circuito</th><th>Uso</th><th>PIA</th><th>Sección</th><th>Tubo</th></tr></thead><tbody>${cs.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table></div>
        <p class="muted">Se instala 1 diferencial (≥ intensidad del IGM) por cada 5 circuitos como mínimo; C13 con diferencial exclusivo. Conductores de cobre y caída de tensión ≤ 3 %.</p></div>`;
      } },
    { id: 'edificio', t: 'Edificio: previsión de cargas y LGA', i: '🏢', d: 'Carga total (ITC-BT-10) con simultaneidad, servicios, locales y garajes; dimensiona la LGA.',
      f: [['nViv', 'Nº de viviendas', 'num', null, 12], ['grado', 'Electrificación', 'select', [['5750', 'Básica 5750 W'], ['9200', 'Elevada 9200 W']], '5750'], ['nocturna', 'Tarifa nocturna (simultaneidad = nº viviendas)', 'check', null, false],
        ['serv', 'Servicios generales (W): ascensor, bombas, alumbrado…', 'num', null, 12000], ['loc', 'Locales/oficinas (m² totales, 1 local)', 'num', null, 120], ['gar', 'Garaje (m²)', 'num', null, 300], ['vent', 'Garaje con ventilación forzada', 'check', null, false],
        ['L', 'Longitud LGA (m)', 'num', null, 25], ['mat', 'Conductor LGA', 'select', OPT.mat, 'Cu'], ['cc', 'Contadores', 'select', [['0.5', 'Totalmente centralizados (0,5 %)'], ['1', 'Centralización parcial (1 %)']], '0.5']],
      run(v) {
        const cs = v.nocturna ? v.nViv : C.coefSimultaneidad(Math.round(v.nViv));
        const viv = cs * +v.grado; const loc = v.loc > 0 ? Math.max(100 * v.loc, 3450) : 0; const gar = v.gar > 0 ? Math.max(C.garajePotencia(v.gar, v.vent), 3450) : 0;
        const tot = viv + v.serv + loc + gar;
        const r = C.calcularSeccion({ sistema: 'tri', P: tot, cosfi: 1, L: v.L, mat: v.mat, aisl: 'XLPE', metodo: 'B', limite: +v.cc, minSeccion: v.mat === 'Cu' ? 10 : 16 });
        const s = r.solucion; const neutro = s ? (s.S <= 10 ? s.S : s.S <= 16 ? 10 : s.S <= 25 ? 16 : s.S <= 35 ? 16 : s.S <= 50 ? 25 : s.S <= 70 ? 35 : s.S <= 95 ? 50 : s.S <= 120 ? 70 : s.S <= 150 ? 70 : s.S <= 185 ? 95 : 120) : null;
        const tubo = s ? ({ 10: 75, 16: 75, 25: 110, 35: 110, 50: 125, 70: 140, 95: 140, 120: 160, 150: 160, 185: 180, 240: 200 })[s.S] : null;
        return `<div class="result"><div class="big">${fmt(tot / 1000, 2)} kW previstos</div>${kvs([['Coef. simultaneidad', fmt(cs, 2)], ['Viviendas', fmt(viv / 1000, 2) + ' kW'], ['Serv. generales', fmt(v.serv / 1000, 2) + ' kW'], ['Locales', fmt(loc / 1000, 2) + ' kW'], ['Garaje', fmt(gar / 1000, 2) + ' kW'], ['Intensidad (400 V trif.)', fmt(r.Ib) + ' A']])}
        ${s ? `<h3>LGA</h3><div class="big">${s.S} mm² ${v.mat}</div>${kvs([['Neutro (tabla ITC-BT-14)', neutro ? neutro + ' mm²' : '—'], ['Tubo Ø ext.', tubo ? tubo + ' mm' : 'ver tabla'], ['Caída', fmt(s.dUp, 3) + ' % (máx. ' + v.cc + ' %)'], ['Iz', fmt(s.Iz) + ' A']])}<div class="note">Método B, XLPE, 3 conductores cargados. Cable 0,6/1 kV, no propagador de incendio y baja emisión de humos. Comprueba también la corriente de cortocircuito y la norma de la distribuidora.</div>` : '<div class="note bad">No hay sección normalizada que cumpla; considera varias líneas.</div>'}</div>`;
      } },
    { id: 'di', t: 'Derivación individual', i: '↕️', d: 'Sección de la DI según ITC-BT-15 (mín. 6 mm² Cu) y caída 0,5 / 1 / 1,5 %.',
      f: [['P', 'Potencia vivienda (W)', 'num', null, 9200], ['sis', 'Sistema', 'select', OPT.sis, 'mono'], ['L', 'Longitud (m)', 'num', null, 18], ['lim', 'Caso de caída', 'select', [['0.5', 'Contadores en más de un lugar (0,5 %)'], ['1', 'Totalmente concentrados (1 %)'], ['1.5', 'Un usuario sin LGA (1,5 %)']], '1'], ['mat', 'Conductor', 'select', OPT.mat, 'Cu'], ['metodo', 'Método', 'select', OPT.metodo, 'B']],
      run(v) {
        const r = C.derivacionIndividual({ P: v.P, sistema: v.sis, L: v.L, mat: v.mat, limite: +v.lim, metodo: v.metodo });
        const s = r.solucion; if (!s) return '<div class="result"><div class="note bad">Sin sección válida.</div></div>';
        const tubo = ({ 6: 32, 10: 32, 16: 32, 25: 40, 35: 40, 50: 50, 70: 63, 95: 63, 120: 75, 150: 75 })[s.S] || '≥ 32';
        return `<div class="result"><div class="big">${s.S} mm² ${v.mat}</div>${kvs([['Ib', fmt(r.Ib) + ' A'], ['Iz', fmt(s.Iz) + ' A'], ['Caída', fmt(s.dUp, 3) + ' % (máx. ' + v.lim + ' %)'], ['Hilo de mando', '1,5 mm² rojo'], ['Tubo Ø mín.', tubo + ' mm']])}<div class="note">Cable 450/750 V (0,6/1 kV si va en bandeja o enterrado), no propagador del incendio y baja emisión de humos. Los tubos deben permitir ampliar la sección un 100 %. Diámetro del tubo indicativo: consulta la tabla de ITC-BT-15.</div></div>`;
      } },
    { id: 'tubos', t: 'Diámetro de tubos', i: '🧵', d: 'Ø exterior mínimo según nº y sección de conductores (ITC-BT-21).',
      f: [['tipo', 'Tipo de canalización', 'select', [['emp', 'Empotrada (tabla 5)'], ['sup', 'Superficie / fija (tabla 2)'], ['aire', 'Al aire (tabla 7, hasta 16 mm²)']], 'emp'], ['S', 'Sección (mm²)', 'select', C.SEC_TUBO.map(s => [s, s + ' mm²']), 2.5], ['n', 'Nº de conductores', 'select', [1, 2, 3, 4, 5].map(n => [n, n]), 3]],
      run(v) {
        const d = C.tubo(+v.S, +v.n, v.tipo); const rows = C.SEC_TUBO.filter(s => C.tubo(s, 1, v.tipo) != null);
        return `<div class="result"><div class="big">${d ? 'Ø ' + d + ' mm' : 'Sin dato (usar sección interior ≥ k × sección de conductores)'}</div>
        <div class="tw"><table><thead><tr><th>mm²</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${rows.map(s => `<tr class="${s == v.S ? 'hit' : ''}"><td><b>${s}</b></td>${[1, 2, 3, 4, 5].map(n => `<td>${C.tubo(s, n, v.tipo) ?? '–'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <p class="muted">Más de 5 conductores o secciones distintas: sección interior del tubo ≥ 2,5× (superficie), 3× (empotrado) o 4× (al aire) la sección ocupada por los conductores.</p></div>`;
      } },
    { id: 'tierra', t: 'Puesta a tierra', i: '⏚', d: 'Resistencia de electrodos, valor máximo según diferencial y terreno (ITC-BT-18).',
      f: [['tipo', 'Electrodo', 'select', [['pica', 'Pica vertical R = ρ/L'], ['cond', 'Conductor enterrado R = 2ρ/L'], ['placa', 'Placa R = 0,8ρ/P']], 'pica'], ['rho', 'Resistividad ρ (Ω·m)', 'num', null, 100], ['L', 'Longitud L (m) / perímetro P (m)', 'num', null, 2], ['n', 'Nº de picas en paralelo (separadas ≥ 2L)', 'num', null, 1], ['UL', 'Tensión de contacto UL', 'select', [['50', '50 V (normal)'], ['24', '24 V (local conductor)']], '50'], ['Idn', 'Sensibilidad diferencial (mA)', 'select', [[30, '30 mA'], [100, '100 mA'], [300, '300 mA'], [500, '500 mA']], 30]],
      run(v) {
        const R = C.resistenciaElectrodo({ tipo: v.tipo, rho: v.rho, L: v.L, P: v.L, n: Math.max(1, Math.round(v.n)) });
        const Rm = C.maxResistenciaTierra({ UL: +v.UL, Idn: v.Idn / 1000 });
        const tab = C.RESISTIVIDAD.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
        return `<div class="result"><div class="big ${R <= Rm ? 'ok' : 'ko'}">${fmt(R)} Ω</div>${kvs([['R máxima (UL/I_Δn)', fmt(Rm, 0) + ' Ω'], ['Tensión de contacto prevista (R·I_Δn)', fmt(R * v.Idn / 1000, 2) + ' V']])}${verdict(R <= Rm, 'La resistencia de tierra es suficiente para esa sensibilidad.', 'Resistencia superior al máximo: añade picas, aumenta longitud o reduce la sensibilidad.')}
        <details><summary>Resistividad típica del terreno (Ω·m)</summary><div class="tw"><table><thead><tr><th>Naturaleza</th><th>ρ (Ω·m)</th></tr></thead><tbody>${tab}</tbody></table></div></details>
        <p class="muted">Electrodos: cobre desnudo ≥ 35 mm² enterrado en el perímetro de cimentación; picas ≥ 2 m (Cu Ø 14 mm, acero galvanizado Ø 25 mm). Tensión de contacto máx.: 24 V (local conductor) / 50 V.</p></div>`;
      } },
    { id: 'cc', t: 'Cortocircuito y protección', i: '💥', d: 'Icc en el origen y aguas abajo, longitud máxima protegida (TN) y energía admisible del cable.',
      f: [['kva', 'Transformador (kVA)', 'num', null, 630], ['ucc', 'Ucc (%)', 'num', null, 4], ['S', 'Sección del cable (mm²)', 'select', C.SECCIONES.map(s => [s, s + ' mm²']), 16], ['L', 'Longitud (m)', 'num', null, 30], ['mat', 'Conductor', 'select', OPT.mat, 'Cu'], ['k', 'Aislamiento', 'select', Object.keys(C.K_TERM).map(k => [k, k + ' (k=' + C.K_TERM[k] + ')']), 'Cu-PVC'],
        ['curva', 'Curva del magnetotérmico', 'select', [['B', 'B (5·In)'], ['C', 'C (10·In)'], ['D', 'D (20·In)']], 'C'], ['In', 'In del magnetotérmico (A)', 'num', null, 16]],
      run(v) {
        const I0 = C.iccTransformador({ kVA: v.kva, ucc: v.ucc }); const S = +v.S;
        const I1 = C.iccAguasAbajo({ IccAmont: I0, S, L: v.L, mat: v.mat });
        const Lm = C.longitudMaxTN({ S, mat: v.mat, curva: v.curva, In: v.In });
        const kk = C.K_TERM[v.k]; const tmax = Math.pow(kk * S / I1, 2);
        const Smin = C.seccionTermica({ Icc: I1, t: 0.1, k: kk });
        return `<div class="result">${kvs([['Icc en bornes del transformador', fmt(I0 / 1000, 2) + ' kA'], ['Icc al final del cable (máx.)', fmt(I1 / 1000, 2) + ' kA'], ['Poder de corte necesario', '≥ ' + fmt(I1 / 1000, 1) + ' kA'], ['Tiempo máx. soportado por el cable', fmt(tmax, 3) + ' s'], ['S mínima térmica (t=0,1 s)', fmt(Smin, 2) + ' mm²'], ['Longitud máx. protegida (TN)', fmt(Lm, 0) + ' m']])}
        ${verdict(v.L <= Lm, 'La línea queda protegida por el disparo magnético en el extremo (esquema TN).', 'El cortocircuito mínimo al final no hace disparar el magnético: reduce la longitud, aumenta la sección o usa curva B.')}
        <p class="muted">Cálculo orientativo por impedancias (c = 1,05). Icc mín. (TN): L<sub>max</sub> = 0,8·U₀·S / [ρ·(1+m)·Ia] con ρ ≈ 1,5·ρ₂₀ y m = S/S<sub>PE</sub> (aquí m = 1). Verifica siempre con datos reales de la distribuidora.</p></div>`;
      } },
    { id: 'motor', t: 'Motores', i: '⚙️', d: 'Intensidad, conductor al 125 %, relación de arranque Ia/In y sección (ITC-BT-47).',
      f: [['P', 'Potencia mecánica (kW)', 'num', null, 7.5], ['sis', 'Sistema', 'select', OPT.sis, 'tri'], ['cosfi', 'cos φ', 'num', null, 0.85], ['rend', 'Rendimiento η', 'num', null, 0.9], ['L', 'Longitud línea (m)', 'num', null, 30], ['aisl', 'Aislamiento', 'select', OPT.aisl, 'PVC'], ['metodo', 'Método', 'select', OPT.metodo, 'B'], ['iaIn', 'Ia/In real del motor', 'num', null, 6]],
      run(v) {
        const m = C.motor({ P_kW: v.P, sistema: v.sis, U: v.sis === 'tri' ? 400 : 230, cosfi: v.cosfi, rend: v.rend, Ia_In: v.iaIn });
        const lim = v.P <= 1.5 ? 4.5 : v.P <= 5 ? 3 : v.P <= 15 ? 2 : 1.5;
        const r = C.calcularSeccion({ sistema: v.sis, Ib: m.Idim, cosfi: v.cosfi, L: v.L, aisl: v.aisl, metodo: v.metodo, limite: 5, mat: 'Cu' });
        return `<div class="result">${kvs([['In (plena carga)', fmt(m.In) + ' A'], ['Conductor a 125 % In', fmt(m.Idim) + ' A'], ['Ia de arranque', fmt(m.Iarranque) + ' A'], ['Pot. absorbida', fmt(m.Pabs) + ' kW']])}
        ${r.solucion ? `<div class="big">${r.solucion.S} mm² Cu</div><p>Caída ${fmt(r.solucion.dUp, 2)} % · Iz ${fmt(r.solucion.Iz)} A</p>` : ''}
        ${verdict(v.iaIn <= lim && v.P >= 0.75 || v.P < 0.75, `Arranque directo permitido (Ia/In ≤ ${lim}).`, `Ia/In = ${v.iaIn} supera el máximo ${lim} para esta potencia: usa estrella-triángulo, arrancador estático o variador.`)}
        <p class="muted">ITC-BT-47: 0,75–1,5 kW → 4,5 · 1,5–5 kW → 3 · 5–15 kW → 2 · &gt; 15 kW → 1,5. Varios motores: 125 % del mayor + suma de los demás.</p></div>`;
      } },
    { id: 'fp', t: 'Compensación del factor de potencia', i: '🔋', d: 'Potencia de condensadores para pasar de cos φ₁ a cos φ₂.',
      f: [['P', 'Potencia activa (kW)', 'num', null, 30], ['c1', 'cos φ actual', 'num', null, 0.75], ['c2', 'cos φ deseado', 'num', null, 0.95], ['U', 'Tensión (V)', 'num', null, 400]],
      run(v) {
        if (v.c2 <= v.c1) return '<div class="result"><div class="note">El cos φ deseado debe ser mayor que el actual.</div></div>';
        const r = C.compensacion({ P_kW: v.P, cosfi1: v.c1, cosfi2: v.c2 }); const I1 = r.S1 * 1000 / (Math.sqrt(3) * v.U), I2 = r.S2 * 1000 / (Math.sqrt(3) * v.U);
        return `<div class="result"><div class="big">${fmt(r.Qc, 1)} kVAr</div>${kvs([['Q inicial', fmt(r.Q1, 1) + ' kVAr'], ['S antes', fmt(r.S1, 1) + ' kVA'], ['S después', fmt(r.S2, 1) + ' kVA'], ['I antes', fmt(I1) + ' A'], ['I después', fmt(I2) + ' A'], ['Reducción de I', fmt((1 - I2 / I1) * 100, 1) + ' %']])}<p class="muted">Qc = P·(tg φ₁ − tg φ₂). Conductores de condensadores ≥ 1,5·In (ITC-BT-48).</p></div>`;
      } },
    { id: 'luz', t: 'Iluminación (método de los lúmenes)', i: '💡', d: 'Número de luminarias para un nivel de iluminancia; eficiencia en W/m².',
      f: [['a', 'Largo (m)', 'num', null, 8], ['b', 'Ancho (m)', 'num', null, 5], ['h', 'Altura de montaje sobre plano de trabajo (m)', 'num', null, 2.2], ['E', 'Iluminancia E (lux)', 'num', null, 500], ['phi', 'Flujo por luminaria (lm)', 'num', null, 4000], ['w', 'Potencia por luminaria (W)', 'num', null, 36], ['Cu', 'Coef. de utilización', 'num', null, 0.6], ['Cm', 'Coef. de mantenimiento', 'num', null, 0.8]],
      run(v) {
        const S = v.a * v.b; const r = C.luminarias({ E: v.E, S, flujoLum: v.phi, Cu: v.Cu, Cm: v.Cm }); const K = C.indiceLocal(v.a, v.b, v.h);
        return `<div class="result"><div class="big">${r.n} luminarias</div>${kvs([['Resultado exacto', fmt(r.exacto)], ['Superficie', fmt(S) + ' m²'], ['Índice del local K', fmt(K)], ['Potencia instalada', fmt(r.n * v.w) + ' W'], ['Densidad', fmt(r.n * v.w / S) + ' W/m²'], ['Eficacia', fmt(v.phi / v.w) + ' lm/W']])}<p class="muted">N = E·S / (Φ·Cu·Cm). En alumbrado de descarga, dimensiona los cables con 1,8 × P (ITC-BT-44). Emergencia: ≥ 1 lux en evacuación (ITC-BT-28).</p></div>`;
      } },
    { id: 'coste', t: 'Energía y coste', i: '💶', d: 'Consumo (kWh) y coste mensual/anual de un receptor.',
      f: [['P', 'Potencia (W)', 'num', null, 2000], ['h', 'Horas/día', 'num', null, 3], ['d', 'Días/mes', 'num', null, 30], ['pr', 'Precio (€/kWh)', 'num', null, 0.18]],
      run(v) { const e = C.energia({ P_kW: v.P / 1000, horas: v.h * v.d, precio: v.pr }); return `<div class="result"><div class="big">${fmt(e.coste)} €/mes</div>${kvs([['Consumo mensual', fmt(e.kWh) + ' kWh'], ['Coste anual', fmt(e.coste * 12) + ' €'], ['Consumo anual', fmt(e.kWh * 12) + ' kWh']])}</div>`; } },
  ];

  function tablaCand(r) {
    return `<details><summary>Ver comparación de secciones</summary><div class="tw"><table><thead><tr><th>mm²</th><th>I tabla</th><th>Iz</th><th>ΔU</th><th>ΔU %</th><th>Iz ≥ Ib</th><th>ΔU ok</th></tr></thead><tbody>${r.candidatas.map(c => `<tr class="${r.solucion && c.S === r.solucion.S ? 'hit' : ''}"><td><b>${c.S}</b></td><td>${c.Itab}</td><td>${c.Iz}</td><td>${c.dU} V</td><td>${c.dUp}</td><td>${c.okI ? '✔' : '✖'}</td><td>${c.okU ? '✔' : '✖'}</td></tr>`).join('')}</tbody></table></div></details>`;
  }
  function describeSeccion(c) {
    const v = c.datos, s = c.r.solucion; return `${v.sis === 'tri' ? 'Trifásico' : 'Monofásico'}, P=${v.P} W, L=${v.L} m, ${v.mat}/${v.aisl}, método ${v.metodo}, ΔU límite ${v.limite} %. Ib=${c.r.Ib} A → sección ${s.S} mm², Iz=${s.Iz} A, ΔU=${s.dUp} %, protección ${c.r.proteccion ? c.r.proteccion.In + ' A' : '—'}.`;
  }

  route(/^#\/calc$/, () => {
    view.innerHTML = `<h1>Calculadoras</h1><p class="lead">Fórmulas del REBT y de la UNE 20460 con comprobación automática de cada criterio. Los resultados son de apoyo al diseño: verifica siempre con la normativa y las normas de la empresa distribuidora.</p>
    <div class="grid g2">${CALCS.map(c => `<a class="card" href="#/calc/${c.id}"><h3>${c.i} ${esc(c.t)}</h3><p>${esc(c.d)}</p></a>`).join('')}
    <a class="card" href="#/calc/memoria"><h3>🗂️ Memoria de cálculos</h3><p>Reúne los cálculos que has guardado y expórtalos a PDF con imprimir.</p></a></div>`;
  });

  route(/^#\/calc\/memoria$/, () => {
    const m = store.get('memoria', []);
    view.innerHTML = `<p><a href="#/calc">← Cálculos</a></p><h1>Memoria de cálculos</h1><p class="lead">Cálculos guardados desde las calculadoras. Usa «Imprimir» para guardar como PDF.</p>
    <div class="row noprint"><button class="btn pri" onclick="print()">🖨️ Imprimir / PDF</button><button class="btn" id="vaciar">Vaciar</button></div>
    ${m.length ? m.map((x, i) => `<div class="card" style="margin:10px 0"><b>${i + 1}. ${esc(x.t)}</b> <span class="muted">${new Date(x.f).toLocaleString('es-ES')}</span><p style="color:var(--text)">${esc(x.d)}</p></div>`).join('') : '<div class="note">Aún no hay cálculos guardados. En «Sección de cables» pulsa «Añadir a la memoria».</div>'}`;
    $('#vaciar').onclick = () => { if (confirm('¿Borrar la memoria de cálculos?')) { store.set('memoria', []); go(); } };
  });

  route(/^#\/calc\/([\w-]+)$/, id => {
    const c = CALCS.find(x => x.id === id); if (!c) { view.innerHTML = '<p>Calculadora no encontrada. <a href="#/calc">Volver</a></p>'; return; }
    const saved = store.get('calc_' + id, {});
    const fieldHtml = ([k, label, type, opts, def]) => {
      const val = saved[k] !== undefined ? saved[k] : def;
      if (type === 'select') return `<div><label for="f_${k}">${label}</label><select id="f_${k}">${opts.map(([v, t]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
      if (type === 'check') return `<div class="check" style="border:0;align-items:center"><input type="checkbox" id="f_${k}" ${val ? 'checked' : ''}><label for="f_${k}" style="margin:0;font-size:14px">${label}</label></div>`;
      return `<div><label for="f_${k}">${label}</label><input id="f_${k}" inputmode="decimal" value="${esc(val)}"></div>`;
    };
    view.innerHTML = `<p><a href="#/calc">← Cálculos</a></p><h1>${c.i} ${esc(c.t)}</h1><p class="lead">${esc(c.d)}</p><div class="form">${c.f.map(fieldHtml).join('')}</div><div id="out"></div>`;
    const read = () => { const v = {}; c.f.forEach(([k, , type]) => { const el = $('#f_' + k); v[k] = type === 'check' ? el.checked : type === 'select' ? el.value : num(el.value); }); return v; };
    const saveable = () => { const s = {}; c.f.forEach(([k, , type]) => { const el = $('#f_' + k); s[k] = type === 'check' ? el.checked : el.value; }); store.set('calc_' + id, s); };
    let tm;
    const compute = () => {
      const v = read(); saveable();
      const missing = c.f.filter(([k, , t, , d]) => t === 'num' && isNaN(v[k]) && d !== '' && k !== 'Ib' && k !== 'P2');
      const out = $('#out');
      if (missing.length) { out.innerHTML = `<div class="note">Introduce un número válido en: ${missing.map(m => esc(m[1])).join(', ')}.</div>`; return; }
      try { out.innerHTML = c.run(v); if (c.after) c.after(); } catch (e) { out.innerHTML = `<div class="note bad">No se pudo calcular: ${esc(e.message)}</div>`; }
    };
    $$('.form input,.form select').forEach(el => { el.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(compute, 120); }); el.addEventListener('change', compute); });
    compute();
  });

  /* =====================================================================
     TEST / EXAMEN
     ===================================================================== */
  let timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  let session = null;

  function bumpStat(q, ok) {
    const st = store.get('stats', {}); const s = st[q.id] || { ok: 0, ko: 0, box: 0 };
    if (ok) { s.ok++; s.box = Math.min(3, s.box + 1); } else { s.ko++; s.box = 0; }
    s.last = Date.now(); st[q.id] = s; store.set('stats', st);
  }
  function prep(q) { const idx = shuffle([0, 1, 2, 3]); return { q, order: idx, correctPos: idx.indexOf(q.c), sel: null }; }

  route(/^#\/test$/, () => {
    const s = statsPreguntas(); const st = store.get('stats', {});
    const fallos = QS.filter(q => st[q.id] && st[q.id].box === 0 && st[q.id].ko > 0).length;
    const hist = store.get('simulacros', []);
    view.innerHTML = `<h1>Preparar el examen</h1><p class="lead">Practica por unidad con explicación inmediata, haz simulacros cronometrados, repasa tus fallos y resuelve problemas de cálculo como en el examen práctico.</p>
    <div class="grid g3">
      <div class="card"><div class="muted">Banco</div><div class="stat">${QS.length}</div><p>preguntas con explicación y referencia a la ITC</p></div>
      <div class="card"><div class="muted">Aciertos</div><div class="stat">${s.ok + s.ko ? s.pct + ' %' : '—'}</div><p>${s.ok} correctas · ${s.ko} falladas</p></div>
      <div class="card"><div class="muted">Dominadas</div><div class="stat">${s.dominadas}</div><p>acertadas 2 veces seguidas o más</p></div>
    </div>
    <h2>Modos</h2>
    <div class="grid g2">
      <a class="card" href="#/test/simulacro"><h3>⏱️ Simulacro de examen</h3><p>Preguntas aleatorias de todo el temario con cronómetro, penalización de fallos y nota sobre 10.</p></a>
      <a class="card" href="#/test/repaso"><h3>🧠 Repaso inteligente</h3><p>Prioriza lo que has fallado o no has visto. ${fallos} pendientes de corregir.</p></a>
      <a class="card" href="#/test/problemas"><h3>🧮 Problemas prácticos</h3><p>Ejercicios de cálculo generados al azar con la solución paso a paso.</p></a>
      <a class="card" href="#/test/stats"><h3>📈 Estadísticas</h3><p>Rendimiento por unidad y historial de simulacros.</p></a>
    </div>
    <h2>Practicar por unidad</h2>
    <div class="grid g2">${T.map(u => { const n = QS.filter(q => q.u === u.id).length; const seen = QS.filter(q => q.u === u.id && st[q.id]).length; return `<a class="card" href="#/test/practica/${u.id}" style="border-left:5px solid ${u.color}"><h3>${esc(u.titulo)}</h3><p>${n} preguntas · ${seen} vistas</p><div class="bar" style="margin-top:8px"><i style="width:${n ? seen / n * 100 : 0}%"></i></div></a>`; }).join('')}
      <a class="card" href="#/test/practica/ALL"><h3>Todas las unidades</h3><p>Todo el banco, en orden aleatorio.</p></a></div>
    ${hist.length ? `<h2>Últimos simulacros</h2><div class="tw"><table><thead><tr><th>Fecha</th><th>Preguntas</th><th>Aciertos</th><th>Nota</th></tr></thead><tbody>${hist.slice(-6).reverse().map(h => `<tr><td>${new Date(h.fecha).toLocaleString('es-ES')}</td><td>${h.n}</td><td>${h.ok}</td><td><b>${fmt(h.nota, 1)}</b>/10</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  });

  route(/^#\/test\/practica\/(\w+)$/, u => {
    let pool = QS.filter(q => u === 'ALL' || q.u === u);
    session = { mode: 'practica', unit: u, qs: shuffle(pool).map(prep), i: 0, ok: 0, ko: 0, done: false };
    renderQ();
  });
  route(/^#\/test\/repaso$/, () => {
    const st = store.get('stats', {});
    const score = q => { const s = st[q.id]; if (!s) return 1; if (s.box === 0 && s.ko > 0) return 0; return 2 + s.box; };
    const pool = shuffle(QS).sort((a, b) => score(a) - score(b)).slice(0, 20);
    session = { mode: 'repaso', qs: pool.map(prep), i: 0, ok: 0, ko: 0 };
    renderQ();
  });
  route(/^#\/test\/simulacro$/, () => {
    view.innerHTML = `<p><a href="#/test">← Examen</a></p><h1>Simulacro de examen</h1><p class="lead">El formato oficial lo marca tu centro examinador; aquí puedes configurarlo.</p>
    <div class="form"><div><label for="sn">Nº de preguntas</label><select id="sn"><option>20</option><option selected>30</option><option>50</option><option value="${QS.length}">Todas (${QS.length})</option></select></div>
    <div><label for="sm">Tiempo (minutos)</label><input id="sm" inputmode="numeric" value="45"></div>
    <div><label for="sp">Fallo resta</label><select id="sp"><option value="0">0 (no penaliza)</option><option value="0.33" selected>1/3 de acierto</option><option value="0.25">1/4 de acierto</option><option value="0.5">1/2 de acierto</option></select></div>
    <div><label for="su">Unidades</label><select id="su"><option value="ALL">Todas</option>${T.map(u => `<option value="${u.id}">${u.id} · ${esc(u.titulo.split('·')[1] || '')}</option>`).join('')}</select></div></div>
    <button class="btn pri" id="go">Comenzar</button>`;
    $('#go').onclick = () => {
      const n = Math.min(+$('#sn').value, QS.length); const mins = Math.max(1, num($('#sm').value) || 45); const pen = +$('#sp').value; const u = $('#su').value;
      const pool = shuffle(QS.filter(q => u === 'ALL' || q.u === u)).slice(0, n);
      session = { mode: 'simulacro', qs: pool.map(prep), i: 0, ok: 0, ko: 0, pen, end: Date.now() + mins * 60000, mins, finished: false };
      renderQ(); startTimer();
    };
  });

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (!session || session.mode !== 'simulacro' || session.finished) { stopTimer(); return; }
      const left = session.end - Date.now(); const el = $('#timer');
      if (el) { const s = Math.max(0, Math.round(left / 1000)); el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); if (s < 60) el.style.color = 'var(--bad)'; }
      if (left <= 0) finishSession(true);
    }, 500);
  }

  function renderQ() {
    const s = session; if (!s) return;
    if (s.i >= s.qs.length) { finishSession(false); return; }
    const p = s.qs[s.i]; const q = p.q; const sim = s.mode === 'simulacro';
    const letters = 'ABCD';
    view.innerHTML = `<div class="row noprint" style="margin-bottom:12px"><a href="#/test" class="btn sm">← Salir</a><span class="tag">${s.i + 1} / ${s.qs.length}</span><span class="tag itc">${esc(q.u)}</span><span class="sp"></span>${sim ? '<span class="timer" id="timer"></span>' : `<span class="tag" style="background:var(--okbg);color:var(--ok)">✔ ${s.ok}</span><span class="tag" style="background:var(--badbg);color:var(--bad)">✖ ${s.ko}</span>`}</div>
    <div class="bar" style="margin-bottom:14px"><i style="width:${s.i / s.qs.length * 100}%"></i></div>
    <div class="q"><h2>${esc(q.t)}</h2><div id="opts">${p.order.map((oi, pos) => `<button class="opt" data-pos="${pos}"><b>${letters[pos]}</b><span>${esc(q.o[oi])}</span></button>`).join('')}</div><div id="fb"></div></div>
    <div class="row" style="margin-top:14px"><span class="sp"></span>${sim ? `<button class="btn" id="skip">Dejar en blanco</button>` : ''}<button class="btn pri" id="next" ${sim ? 'hidden' : 'disabled'}>${s.i === s.qs.length - 1 ? 'Ver resultado' : 'Siguiente →'}</button></div>`;
    if (sim) { const sl = Math.max(0, Math.round((s.end - Date.now()) / 1000)); $('#timer').textContent = String(Math.floor(sl / 60)).padStart(2, '0') + ':' + String(sl % 60).padStart(2, '0'); }
    const advance = () => { s.i++; renderQ(); };
    $$('.opt').forEach(b => b.onclick = () => {
      if (p.sel !== null) return; const pos = +b.dataset.pos; p.sel = pos; const ok = pos === p.correctPos;
      if (ok) s.ok++; else s.ko++; bumpStat(q, ok);
      if (sim) { advance(); return; }
      $$('.opt').forEach(x => { x.disabled = true; if (+x.dataset.pos === p.correctPos) x.classList.add('good'); });
      if (!ok) b.classList.add('wrong');
      $('#fb').innerHTML = `<div class="exp"><b>${ok ? '✔ Correcto.' : '✖ Incorrecto.'}</b> ${esc(q.e)}<br><span class="muted">Ref.: ${esc(q.r)}</span></div>`;
      $('#next').disabled = false; $('#next').focus();
    });
    $('#next').onclick = advance;
    const sk = $('#skip'); if (sk) sk.onclick = () => { p.sel = -1; advance(); };
  }

  function finishSession(timeout) {
    const s = session; if (!s) return; s.finished = true; stopTimer();
    const n = s.qs.length; const blank = s.qs.filter(p => p.sel === null || p.sel === -1).length;
    const ok = s.qs.filter(p => p.sel !== null && p.sel !== -1 && p.sel === p.correctPos).length; const ko = n - ok - blank;
    const nota = s.mode === 'simulacro' ? Math.max(0, (ok - ko * (s.pen || 0)) / n * 10) : ok / n * 10;
    if (s.mode === 'simulacro') { const h = store.get('simulacros', []); h.push({ fecha: Date.now(), n, ok, ko, nota }); store.set('simulacros', h.slice(-30)); }
    const byU = {}; s.qs.forEach(p => { const u = p.q.u; byU[u] = byU[u] || { n: 0, ok: 0 }; byU[u].n++; if (p.sel === p.correctPos) byU[u].ok++; });
    const fails = s.qs.filter(p => p.sel !== p.correctPos);
    view.innerHTML = `<h1>${timeout ? '⏰ Tiempo agotado · ' : ''}Resultado</h1>
    <div class="grid g3"><div class="card"><div class="muted">Nota</div><div class="stat ${nota >= 5 ? '' : 'ko'}" style="color:${nota >= 5 ? 'var(--ok)' : 'var(--bad)'}">${fmt(nota, 1)}/10</div></div>
    <div class="card"><div class="muted">Aciertos</div><div class="stat">${ok}/${n}</div></div><div class="card"><div class="muted">Fallos · en blanco</div><div class="stat">${ko} · ${blank}</div></div></div>
    <h2>Por unidad</h2>${Object.entries(byU).map(([u, v]) => `<div style="margin:8px 0"><b>${u}</b> ${v.ok}/${v.n}<div class="bar"><i style="width:${v.ok / v.n * 100}%"></i></div></div>`).join('')}
    ${fails.length ? `<h2>Repasa tus fallos (${fails.length})</h2>${fails.map(p => `<div class="q" style="margin:10px 0"><b>${esc(p.q.t)}</b><p style="margin:8px 0"><span style="color:var(--ok)">✔ ${esc(p.q.o[p.q.c])}</span>${p.sel >= 0 && p.sel !== null ? `<br><span style="color:var(--bad)">✖ Tu respuesta: ${esc(p.q.o[p.order[p.sel]])}</span>` : '<br><span class="muted">En blanco</span>'}</p><div class="exp">${esc(p.q.e)} <span class="muted">(${esc(p.q.r)})</span></div></div>`).join('')}` : '<div class="note ok">¡Sin fallos!</div>'}
    <div class="row noprint" style="margin-top:16px"><a class="btn pri" href="#/test">Volver</a><a class="btn" href="#/test/${s.mode === 'practica' ? 'practica/' + s.unit : s.mode}">Repetir</a></div>`;
    session = null;
  }

  route(/^#\/test\/stats$/, () => {
    const st = store.get('stats', {}); const hist = store.get('simulacros', []);
    const rows = T.map(u => { const qs = QS.filter(q => q.u === u.id); let ok = 0, ko = 0, seen = 0; qs.forEach(q => { const s = st[q.id]; if (s) { seen++; ok += s.ok; ko += s.ko; } }); return { u, n: qs.length, seen, ok, ko, pct: ok + ko ? Math.round(ok / (ok + ko) * 100) : null }; });
    const weak = rows.filter(r => r.pct !== null).sort((a, b) => a.pct - b.pct)[0];
    view.innerHTML = `<p><a href="#/test">← Examen</a></p><h1>Estadísticas</h1>
    ${weak ? `<div class="note">Tu unidad más débil: <b>${esc(weak.u.titulo)}</b> (${weak.pct} % de aciertos). <a href="#/test/practica/${weak.u.id}">Practicar ahora</a></div>` : '<div class="note">Responde algunas preguntas para ver tu rendimiento.</div>'}
    <div class="tw"><table><thead><tr><th>Unidad</th><th>Vistas</th><th>Aciertos</th><th>Rendimiento</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.u.titulo)}</td><td>${r.seen}/${r.n}</td><td>${r.ok}/${r.ok + r.ko}</td><td style="min-width:140px">${r.pct === null ? '—' : `<b>${r.pct} %</b><div class="bar"><i style="width:${r.pct}%"></i></div>`}</td></tr>`).join('')}</tbody></table></div>
    <h2>Simulacros</h2>${hist.length ? `<div class="tw"><table><thead><tr><th>Fecha</th><th>Preguntas</th><th>Aciertos</th><th>Nota</th></tr></thead><tbody>${hist.slice().reverse().map(h => `<tr><td>${new Date(h.fecha).toLocaleString('es-ES')}</td><td>${h.n}</td><td>${h.ok}</td><td><b>${fmt(h.nota, 1)}</b></td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">Aún no has hecho simulacros.</p>'}
    <div class="row noprint" style="margin-top:18px"><button class="btn" id="reset">Borrar mi progreso</button></div>`;
    $('#reset').onclick = () => { if (confirm('¿Seguro? Se borrarán estadísticas, simulacros y fichas estudiadas.')) { ['stats', 'simulacros', 'estudiadas'].forEach(k => store.set(k, k === 'stats' || k === 'estudiadas' ? {} : [])); go(); } };
  });

  /* ---------- problemas prácticos ---------- */
  const R = (a, b) => a + Math.random() * (b - a);
  const RI = (a, b) => Math.floor(R(a, b + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const GEN = [
    () => { // sección monofásica por caída de tensión
      const P = pick([1500, 2300, 3450, 4600, 5750]), L = pick([8, 12, 15, 20, 25, 30, 40]);
      const r = C.calcularSeccion({ sistema: 'mono', P, L, metodo: 'B', aisl: 'PVC', limite: 3 }); const s = r.solucion.S;
      const opts = distract(s, C.SECCIONES);
      return { t: `Línea monofásica 230 V, cos φ = 1, de ${L} m con una carga de ${P} W. Cobre, aislamiento PVC, en tubo empotrado (método B), temperatura 40 ºC, un solo circuito. Caída de tensión máxima 3 %. ¿Qué sección normalizada mínima se necesita?`, o: opts.map(x => x + ' mm²'), c: opts.indexOf(s), e: `Ib = ${P}/230 = ${fmt(r.Ib)} A. Iz de ${s} mm² (método B, PVC, 2 cond.) = ${fmt(r.solucion.Iz)} A ≥ Ib. Caída = 2·L·I·R = ${fmt(r.solucion.dU)} V = ${fmt(r.solucion.dUp, 2)} % ≤ 3 %. Las secciones menores no cumplen intensidad o caída.` };
    },
    () => { // intensidad trifásica
      const P = pick([5, 7.5, 10, 15, 22, 30]) * 1000, cos = pick([0.8, 0.85, 0.9, 1]);
      const I = P / (Math.sqrt(3) * 400 * cos); const opts = numOpts(I, 1);
      return { t: `Una carga trifásica de ${P / 1000} kW con cos φ = ${cos} se alimenta a 400 V. ¿Qué intensidad por fase consume?`, o: opts.map(x => fmt(x, 1) + ' A'), c: opts.findIndex(x => Math.abs(x - I) < 0.01), e: `I = P/(√3·U·cosφ) = ${P}/(1,732·400·${cos}) = ${fmt(I, 1)} A.` };
    },
    () => { // caída de tensión %
      const I = pick([10, 16, 20, 25]), L = pick([15, 30, 45, 60]), S = pick([2.5, 4, 6, 10]);
      const r = C.calcularCaida({ sistema: 'mono', I, L, S, mat: 'Cu', aisl: 'PVC', cosfi: 1 }); const opts = numOpts(r.dUp, 2);
      return { t: `Línea monofásica de cobre (PVC, 70 ºC) de ${L} m y ${S} mm² con ${I} A, cos φ = 1, 230 V. ¿Qué caída de tensión se produce?`, o: opts.map(x => fmt(x, 2) + ' %'), c: opts.findIndex(x => Math.abs(x - r.dUp) < 0.001), e: `ΔU = 2·L·I·ρ/S = 2·${L}·${I}·${fmt(C.rho('Cu', 70), 5)}/${S} = ${fmt(r.dU)} V → ${fmt(r.dUp, 2)} %.` };
    },
    () => { // resistencia tierra pica
      const rho = pick([50, 100, 150, 200, 300]), L = pick([2, 3, 4]), n = pick([1, 2, 3]);
      const R0 = rho / L / n; const opts = numOpts(R0, 1);
      return { t: `Terreno de resistividad ${rho} Ω·m. Se hincan ${n} pica(s) de ${L} m separadas lo suficiente. ¿Qué resistencia de tierra aproximada se obtiene?`, o: opts.map(x => fmt(x, 1) + ' Ω'), c: opts.findIndex(x => Math.abs(x - R0) < 0.01), e: `R = ρ/L = ${rho}/${L} = ${fmt(rho / L, 1)} Ω por pica; con ${n} en paralelo ≈ ${fmt(R0, 1)} Ω.` };
    },
    () => { // previsión edificio
      const n = pick([6, 10, 14, 20, 24, 30]); const cs = C.coefSimultaneidad(n); const tot = cs * 5750 / 1000; const opts = numOpts(tot, 1);
      return { t: `Edificio de ${n} viviendas de electrificación básica (5750 W), sin tarifa nocturna. ¿Qué potencia prevista corresponde a las viviendas (sin servicios generales)?`, o: opts.map(x => fmt(x, 1) + ' kW'), c: opts.findIndex(x => Math.abs(x - tot) < 0.01), e: `Coeficiente de simultaneidad (n = ${n}) = ${fmt(cs, 1)}. P = ${fmt(cs, 1)} × 5750 W = ${fmt(tot, 1)} kW.` };
    },
    () => { // motor
      const P = pick([3, 4, 5.5, 7.5, 11, 15]); const m = C.motor({ P_kW: P, cosfi: 0.85, rend: 0.9 }); const opts = numOpts(m.Idim, 1);
      return { t: `Motor trifásico de ${P} kW, 400 V, cos φ = 0,85 y η = 0,9. ¿Para qué intensidad se dimensiona el conductor de alimentación (ITC-BT-47)?`, o: opts.map(x => fmt(x, 1) + ' A'), c: opts.findIndex(x => Math.abs(x - m.Idim) < 0.01), e: `In = ${P * 1000}/(√3·400·0,85·0,9) = ${fmt(m.In, 1)} A; el conductor se calcula al 125 %: ${fmt(m.Idim, 1)} A.` };
    },
    () => { // compensación
      const P = pick([20, 30, 50, 80]), c1 = pick([0.7, 0.75, 0.8]), c2 = 0.95; const r = C.compensacion({ P_kW: P, cosfi1: c1, cosfi2: c2 }); const opts = numOpts(r.Qc, 1);
      return { t: `Una instalación consume ${P} kW con cos φ = ${c1}. ¿Qué potencia de condensadores se necesita para llegar a cos φ = ${c2}?`, o: opts.map(x => fmt(x, 1) + ' kVAr'), c: opts.findIndex(x => Math.abs(x - r.Qc) < 0.01), e: `Qc = P·(tg φ₁ − tg φ₂) = ${P}·(${fmt(Math.tan(Math.acos(c1)), 3)} − ${fmt(Math.tan(Math.acos(c2)), 3)}) = ${fmt(r.Qc, 1)} kVAr.` };
    },
    () => { // iluminación
      const a = pick([6, 8, 10]), b = pick([4, 5, 6]), E = pick([300, 500]), phi = pick([3000, 4000, 5000]);
      const n = C.luminarias({ E, S: a * b, flujoLum: phi, Cu: 0.6, Cm: 0.8 }).n; const opts = distract(n, null);
      return { t: `Local de ${a} × ${b} m. Se requieren ${E} lux. Luminarias de ${phi} lm, Cu = 0,6 y Cm = 0,8. ¿Cuántas luminarias hacen falta?`, o: opts.map(String), c: opts.indexOf(n), e: `N = E·S/(Φ·Cu·Cm) = ${E}·${a * b}/(${phi}·0,6·0,8) = ${fmt(E * a * b / (phi * 0.48), 2)} → ${n}.` };
    },
    () => { // cortocircuito: tiempo cable
      const S = pick([2.5, 4, 6, 10, 16]), I = pick([2000, 3000, 4500, 6000]); const t = Math.pow(115 * S / I, 2); const opts = numOpts(t, 3);
      return { t: `Un cable de cobre con aislamiento PVC (k = 115) de ${S} mm² soporta un cortocircuito de ${I} A. ¿Qué tiempo máximo puede mantenerse?`, o: opts.map(x => fmt(x, 3) + ' s'), c: opts.findIndex(x => Math.abs(x - t) < 0.0005), e: `t = (k·S/I)² = (115·${S}/${I})² = ${fmt(t, 3)} s.` };
    },
  ];
  function distract(val, list) {
    let o;
    if (list) { const i = list.indexOf(val); const cands = [list[i - 2], list[i - 1], list[i + 1], list[i + 2]].filter(x => x != null); o = shuffle(cands).slice(0, 3).concat([val]); }
    else o = [val - 2, val - 1, val + 1, val + 2].filter(x => x > 0).slice(0, 3).concat([val]);
    return [...new Set(o)].sort((a, b) => a - b);
  }
  function numOpts(v, d) {
    const k = Math.pow(10, d); const r = x => Math.round(x * k) / k; const set = new Set([r(v)]);
    [0.7, 1.3, 0.5, 1.7, 2, 0.85, 1.15].some(f => { set.add(r(v * f)); return set.size >= 4; });
    return [...set].sort((a, b) => a - b);
  }

  route(/^#\/test\/problemas$/, () => {
    let sc = { ok: 0, n: 0 };
    const nuevo = () => {
      const g = pick(GEN)(); const order = shuffle(g.o.map((t, i) => i)); const cor = order.indexOf(g.c);
      view.innerHTML = `<p class="noprint"><a href="#/test">← Examen</a> <span class="tag">${sc.ok}/${sc.n} correctos</span></p><h1>Problema práctico</h1><div class="q"><h2>${esc(g.t)}</h2><div>${order.map((oi, pos) => `<button class="opt" data-p="${pos}"><b>${'ABCD'[pos]}</b><span>${esc(g.o[oi])}</span></button>`).join('')}</div><div id="fb"></div></div><div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn pri" id="nx" disabled>Otro problema →</button></div>`;
      $$('.opt').forEach(b => b.onclick = () => { const ok = +b.dataset.p === cor; sc.n++; if (ok) sc.ok++; $$('.opt').forEach(x => { x.disabled = true; if (+x.dataset.p === cor) x.classList.add('good'); }); if (!ok) b.classList.add('wrong'); $('#fb').innerHTML = `<div class="exp"><b>${ok ? '✔ Correcto.' : '✖ Incorrecto.'}</b> ${esc(g.e)}</div>`; $('#nx').disabled = false; });
      $('#nx').onclick = nuevo;
    };
    nuevo();
  });

  /* =====================================================================
     DOCUMENTACIÓN
     ===================================================================== */
  route(/^#\/docs$/, () => {
    view.innerHTML = `<h1>Documentación del instalador</h1><p class="lead">Todo lo que genera, comprueba y entrega una empresa instaladora de baja tensión.</p>
    <div class="grid g2">
      <a class="card" href="#/docs/flujo"><h3>🛠️ Qué hace un instalador (paso a paso)</h3><p>Del presupuesto a la puesta en servicio y las inspecciones.</p></a>
      <a class="card" href="#/docs/check"><h3>✅ Check-list de verificación</h3><p>Antes de firmar el CIE: cuadro, cables, tierra, medidas, baños.</p></a>
      <a class="card" href="#/docs/medidas"><h3>📏 Mediciones y equipos</h3><p>Aislamiento, tierra, bucle, diferenciales, luxómetro.</p></a>
      <a class="card" href="#/docs/cie"><h3>📝 Borrador de CIE / MTD</h3><p>Rellena los datos y genera un documento imprimible.</p></a>
      <a class="card" href="#/docs/simbolos"><h3>🔣 Símbolos y glosario</h3><p>Siglas y símbolos habituales en esquemas.</p></a>
    </div>`;
  });
  route(/^#\/docs\/flujo$/, () => {
    view.innerHTML = `<p><a href="#/docs">← Documentación</a></p><h1>Flujo de trabajo del instalador</h1>${window.FLUJO.map(s => `<div class="card" style="margin:10px 0"><h3>${esc(s.t)}</h3><p style="color:var(--text)">${esc(s.d)}</p></div>`).join('')}`;
  });
  route(/^#\/docs\/check$/, () => {
    const chk = store.get('check', {});
    view.innerHTML = `<p><a href="#/docs">← Documentación</a></p><h1>Check-list de verificación</h1><p class="lead">Marca cada punto. Tu progreso se guarda en este dispositivo.</p><div class="row noprint"><button class="btn" id="clr">Reiniciar</button><button class="btn" onclick="print()">🖨️ Imprimir</button></div>
    ${window.CHECK_VERIF.map((g, gi) => `<h2>${esc(g.g)}</h2><div class="card">${g.i.map((it, ii) => { const k = gi + '_' + ii; return `<label class="check" style="font-size:15px;color:var(--text);font-weight:500;margin:0"><input type="checkbox" data-k="${k}" ${chk[k] ? 'checked' : ''}><span>${esc(it)}</span></label>`; }).join('')}</div>`).join('')}`;
    $$('.check input').forEach(i => i.onchange = () => { const c = store.get('check', {}); c[i.dataset.k] = i.checked; store.set('check', c); });
    $('#clr').onclick = () => { store.set('check', {}); go(); };
  });
  route(/^#\/docs\/medidas$/, () => {
    view.innerHTML = `<p><a href="#/docs">← Documentación</a></p><h1>Mediciones y equipos</h1><p class="lead">Parte práctica del examen y de la verificación previa (UNE 20460-6-61). Equipos mínimos de la categoría básica: ITC-BT-03 Apéndice I.</p>
    ${window.MEDIDAS.map(m => `<div class="card" style="margin:10px 0"><h3>${esc(m.n)}</h3><span class="tag">${esc(m.eq)}</span><p style="color:var(--text);margin-top:8px">${esc(m.p)}</p></div>`).join('')}
    <div class="note"><b>Seguridad:</b> las cinco reglas de oro antes de trabajar sin tensión: 1) desconectar, 2) prevenir realimentación (enclavar/etiquetar), 3) verificar ausencia de tensión, 4) poner a tierra y en cortocircuito (si procede), 5) señalizar y delimitar la zona. (RD 614/2001).</div>`;
  });
  route(/^#\/docs\/simbolos$/, () => {
    view.innerHTML = `<p><a href="#/docs">← Documentación</a></p><h1>Símbolos y glosario</h1><h2>Aparamenta</h2><div class="tw"><table><tbody>${window.SIMBOLOS.map(s => `<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td></tr>`).join('')}</tbody></table></div><h2>Glosario</h2><div class="tw"><table><tbody>${window.GLOSARIO.map(s => `<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td></tr>`).join('')}</tbody></table></div>`;
  });
  route(/^#\/docs\/cie$/, () => {
    const F = [['titular', 'Titular'], ['nif', 'NIF/CIF'], ['dir', 'Emplazamiento'], ['uso', 'Uso (vivienda, local, industria…)'], ['pot', 'Potencia prevista (W)'], ['ten', 'Tensión (230 / 400 V)'], ['esq', 'Esquema de distribución (TT, TN, IT)'], ['grado', 'Electrificación (básica/elevada)'], ['igm', 'IGM / ICP (A)'], ['dif', 'Diferencial (A / mA)'], ['circ', 'Nº de circuitos'], ['di', 'Sección derivación individual'], ['tierra', 'Resistencia de tierra (Ω)'], ['aisl', 'Resistencia de aislamiento (MΩ)'], ['emp', 'Empresa instaladora'], ['empn', 'Nº de habilitación'], ['inst', 'Instalador en BT firmante'], ['cat', 'Categoría (IBTB / IBTE)'], ['doc', 'Documentación técnica (Proyecto / MTD)'], ['fecha', 'Fecha']];
    const d = store.get('cie', {});
    view.innerHTML = `<p><a href="#/docs">← Documentación</a></p><h1>Borrador de CIE / MTD</h1><div class="note">Borrador de trabajo. El <b>modelo oficial</b> lo establece cada Comunidad Autónoma (se cumplimenta y registra en su plataforma). Esta hoja resume los datos mínimos que exige la ITC-BT-04 §5.4.</div>
    <div class="form noprint">${F.map(([k, l]) => `<div><label for="c_${k}">${l}</label><input id="c_${k}" value="${esc(d[k] || '')}"></div>`).join('')}</div>
    <div class="row noprint"><button class="btn pri" id="prn">🖨️ Generar documento (imprimir / PDF)</button><button class="btn" id="limp">Limpiar</button></div>
    <div id="doc" class="print-only"></div>`;
    $$('.form input').forEach(i => i.oninput = () => { const v = {}; F.forEach(([k]) => v[k] = $('#c_' + k).value); store.set('cie', v); });
    $('#limp').onclick = () => { store.set('cie', {}); go(); };
    $('#prn').onclick = () => {
      const v = store.get('cie', {});
      $('#doc').innerHTML = `<h1>Certificado de instalación eléctrica en baja tensión — borrador</h1><p>Según ITC-BT-04 del REBT (RD 842/2002).</p><table>${F.map(([k, l]) => `<tr><td><b>${esc(l)}</b></td><td>${esc(v[k] || '')}</td></tr>`).join('')}</table>
      <p>El instalador abajo firmante certifica que la instalación ha sido ejecutada de acuerdo con las prescripciones del Reglamento electrotécnico para baja tensión (RD 842/2002) y, en su caso, con las especificaciones particulares aprobadas a la compañía eléctrica y con el Proyecto o la Memoria Técnica de Diseño.</p><br><br><p>Firma del instalador: ______________________ &nbsp;&nbsp; Sello de la empresa:</p>`;
      document.querySelector('#doc').style.display = 'block'; window.print(); setTimeout(() => { const e = $('#doc'); if (e) e.style.display = ''; }, 500);
    };
  });

  /* =====================================================================
     TABLAS DE REFERENCIA
     ===================================================================== */
  route(/^#\/ref$/, () => {
    const mk = (cols, rows) => `<div class="tw"><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const met = Object.keys(C.METODOS); const mSel = store.get('refMetodo', 'B');
    view.innerHTML = `<h1>Tablas de referencia</h1><p class="lead">Consulta rápida de los valores que más se preguntan.</p>
    <details open><summary>Intensidades admisibles ITC-BT-19 (cobre, 40 ºC al aire)</summary><div>
      <div class="chips" id="mets">${met.map(m => `<button class="chip ${m === mSel ? 'on' : ''}" data-m="${m}">${m}</button>`).join('')}</div><div id="ampt"></div></div></details>
    <details><summary>Colores de los conductores</summary><div>${mk(['Conductor', 'Color'], [['Neutro', 'Azul claro'], ['Protección (PE)', 'Verde-amarillo'], ['Fases', 'Marrón, negro y gris'], ['Hilo de mando (tarifa nocturna)', 'Rojo (1,5 mm²)']])}</div></details>
    <details><summary>Secciones de PE (ITC-BT-19 tabla 2)</summary><div>${mk(['Sección de fase S (mm²)', 'Sección mínima de PE'], [['S ≤ 16', 'S'], ['16 < S ≤ 35', '16 mm²'], ['S > 35', 'S/2']])}</div></details>
    <details><summary>Caídas de tensión máximas</summary><div>${mk(['Tramo', 'Límite'], [['Instalación interior de viviendas', '3 %'], ['Otras: alumbrado / resto', '3 % / 5 %'], ['Transformador propio AT: alumbrado / resto', '4,5 % / 6,5 %'], ['LGA centralizados / parcial', '0,5 % / 1 %'], ['DI: concentrados en más de un lugar / totalmente / único usuario', '0,5 % / 1 % / 1,5 %'], ['Alumbrado exterior', '3 %'], ['Generadores (conexión)', '1,5 %']])}</div></details>
    <details><summary>Circuitos de vivienda (ITC-BT-25)</summary><div>${mk(['Circuito', 'Uso', 'PIA', 'Sección'], [['C1', 'Iluminación', '10 A', '1,5 mm²'], ['C2', 'Tomas generales', '16 A', '2,5 mm²'], ['C3', 'Cocina y horno', '25 A', '6 mm²'], ['C4', 'Lavadora, lavavajillas, termo', '20 A', '4 mm²'], ['C5', 'Baño y cocina', '16 A', '2,5 mm²'], ['C8', 'Calefacción', '25 A', '6 mm²'], ['C9', 'Aire acondicionado', '25 A', '6 mm²'], ['C10', 'Secadora', '16 A', '2,5 mm²'], ['C11', 'Automatización', '10 A', '1,5 mm²']])}</div></details>
    <details><summary>Coeficiente de simultaneidad (ITC-BT-10)</summary><div>${mk(['Nº viviendas', 'Coeficiente'], C.SIMULT.slice(1).map((c, i) => [i + 1, c]).concat([['> 21', '15,3 + (n − 21)·0,5']]))}</div></details>
    <details><summary>Volúmenes del baño (ITC-BT-27)</summary><div>${mk(['Volumen', 'Delimitación', 'IP mínimo'], [['0', 'Interior de bañera/ducha', 'IPX7'], ['1', 'Sobre el vol. 0 hasta 2,25 m', 'IPX4'], ['2', '0,6 m alrededor del vol. 1', 'IPX4'], ['3', '2,4 m más allá del vol. 2', 'IPX1']])}</div></details>
    <details><summary>Resistencia de aislamiento (ITC-BT-19)</summary><div>${mk(['Tensión nominal', 'Ensayo', 'Mínimo'], C.AISLAMIENTO.map(a => [a.un, a.ensayo + ' V', a.minimo + ' MΩ']))}</div></details>
    <details><summary>Resistividad del terreno</summary><div>${mk(['Naturaleza', 'ρ (Ω·m)'], C.RESISTIVIDAD)}</div></details>
    <details><summary>Categorías de sobretensión (230/400 V)</summary><div>${mk(['Categoría', 'Tensión de impulso', 'Equipos'], [['I', '1,5 kV', 'Electrónicos sensibles'], ['II', '2,5 kV', 'Electrodomésticos'], ['III', '4 kV', 'Equipos de instalaciones fijas, cuadros'], ['IV', '6 kV', 'Origen de la instalación, contadores']])}</div></details>
    <details><summary>Plazos e importes</summary><div>${mk(['Concepto', 'Valor'], [['Inspección periódica', '5 años (10 años comunes viviendas > 100 kW)'], ['Condicionada: plazo de corrección', '≤ 6 meses'], ['Comunicar cambios de empresa', '1 mes'], ['Notificar peligro manifiesto', '24 h'], ['Conservar contratos de mantenimiento', '5 años'], ['Seguro RC básica / especialista', '600.000 € / 900.000 €']])}</div></details>`;
    const drawAmp = m => {
      const cols = ['PVC3', 'PVC2', 'XLPE3', 'XLPE2'].filter(k => C.METODOS[m][k]);
      $('#ampt').innerHTML = `<p class="muted">${esc(C.METODOS[m].nombre)}</p>` + mk(['mm²'].concat(cols.map(c => c.replace('PVC', 'PVC ').replace('XLPE', 'XLPE ') + ' cond.')), C.SECCIONES.map(S => [`<b>${S}</b>`].concat(cols.map(k => { const v = C.iAdmisible(m, k.replace(/\d/, ''), +k.slice(-1), S, 'Cu'); return v == null ? '–' : v; }))));
    };
    drawAmp(mSel);
    $$('#mets .chip').forEach(b => b.onclick = () => { store.set('refMetodo', b.dataset.m); $$('#mets .chip').forEach(x => x.classList.toggle('on', x === b)); drawAmp(b.dataset.m); });
  });

  /* =====================================================================
     FUENTES
     ===================================================================== */
  route(/^#\/fuentes$/, () => {
    view.innerHTML = `<h1>Fuentes y avisos</h1><p class="lead">Documentos oficiales usados para elaborar el contenido.</p>
    ${window.FUENTES.map(f => `<div class="card" style="margin:10px 0"><h3><a href="${f.u}" target="_blank" rel="noopener">${esc(f.t)}</a></h3><p>${esc(f.n)}</p></div>`).join('')}
    <h2>Avisos</h2><div class="note">Esta aplicación es una herramienta de aprendizaje, consulta y cálculo. No sustituye al texto oficial del REBT, a las normas UNE ni a las normas particulares de la empresa distribuidora de cada zona. Los valores de intensidades admisibles en aluminio son estimados. Verifica siempre antes de ejecutar una instalación real.</div>
    <div class="note">Tus datos (progreso, notas, borradores) se guardan solo en este navegador y no se envían a ningún servidor.</div>`;
  });

  route(/^#\/mas$/, () => {
    view.innerHTML = `<h1>Más secciones</h1><div class="tiles">${NAV.filter(n => n[1] !== "Inicio" && !TAB.includes(n[1])).map(([h, t, i]) => `<a class="tile" href="${h}"><div class="ti">${ic(i)}</div><div><b>${t}</b></div></a>`).join('')}</div>`;
  });
  const API = { route, store, esc, fmt, num, view, go, $, $$, C };
  (window.REBTExt || []).forEach(fn => { try { fn(API); } catch (e) { console.error(e); } });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
  go();
})();
