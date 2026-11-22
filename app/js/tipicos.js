/* Esquemas típicos de cableado de vivienda: se crean como esquema editable. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, view, $, $$ } = A;
  const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  function B() {
    const m = { els: [], wires: [] }; let n = 0; const S = window.REBTSym || {};
    const add = (t, x, y, label, sub, o) => { const e = Object.assign({ id: 'e' + (++n), t, x, y, rot: 0, label: label == null ? (S[t] || {}).l : label, sub: sub || '' }, o || {}); m.els.push(e); return e; };
    const w = (a, b, l) => m.wires.push({ id: 'w' + (++n), a: a.id, b: b.id, label: l || '' });
    return { m, add, w };
  }
  const bar = (add, y, l, x, wd) => add('bus', x || 240, y, l, '', { w: wd || 200 });
  const TIPOS = [
    { id: 'simple', n: 'Punto de luz con interruptor', d: 'Un interruptor gobierna una lámpara. Se interrumpe la fase, nunca el neutro.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)'), i = add('sw1', 240, 140, 'I1', 'Interruptor'), f = add('foco', 240, 240, 'E1', 'Punto de luz'), n = bar(add, 320, 'Neutro (N)'); w(l, i); w(i, f, 'Fase conmutada'); w(f, n); return b.m; } },
    { id: 'conmutada', n: 'Luz conmutada (2 puntos)', d: 'Dos conmutadores gobiernan la misma lámpara; entre ellos van dos hilos viajeros.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)'), c1 = add('sw2', 240, 140, 'C1', 'Conmutador'), c2 = add('sw2', 240, 250, 'C2', 'Conmutador'), f = add('foco', 240, 350, 'E1', 'Punto de luz'), n = bar(add, 430, 'Neutro (N)'); w(l, c1); w(c1, c2, '2 viajeros'); w(c2, f, 'Retorno'); w(f, n); return b.m; } },
    { id: 'cruce', n: 'Luz desde 3 puntos (cruzamiento)', d: 'Dos conmutadores en los extremos y uno o más de cruzamiento en medio.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)'), c1 = add('sw2', 240, 140, 'C1', 'Conmutador'), x = add('swc', 240, 240, 'CR1', 'Cruzamiento'), c2 = add('sw2', 240, 340, 'C2', 'Conmutador'), f = add('foco', 240, 440, 'E1', 'Punto de luz'), n = bar(add, 520, 'Neutro (N)'); w(l, c1); w(c1, x, '2 viajeros'); w(x, c2, '2 viajeros'); w(c2, f, 'Retorno'); w(f, n); return b.m; } },
    { id: 'telerruptor', n: 'Telerruptor con varios pulsadores', d: 'Cualquier pulsador cambia el estado de la luz. La bobina del telerruptor va en el circuito de mando.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)', 340, 360), n = bar(add, 470, 'Neutro (N)', 340, 360);
        const nd = add('nodo', 180, 160, '', '', { w: 140 }), p1 = add('swp', 130, 230, 'P1', 'Pulsador'), p2 = add('swp', 180, 230, 'P2', 'Pulsador'), p3 = add('swp', 230, 230, 'P3', 'Pulsador'), nd2 = add('nodo', 180, 300, '', '', { w: 140 }), kb = add('tel', 180, 380, 'KE1', 'Telerruptor (bobina)');
        const k = add('cna', 440, 160, 'KE1', 'Contacto de potencia'), f = add('foco', 440, 300, 'E1', 'Punto de luz');
        w(l, nd); w(nd, p1); w(nd, p2); w(nd, p3); w(p1, nd2); w(p2, nd2); w(p3, nd2); w(nd2, kb); w(kb, n); w(l, k); w(k, f); w(f, n); return b.m; } },
    { id: 'timbre', n: 'Timbre con transformador', d: 'Un transformador reduce la tensión; el pulsador cierra el circuito del timbre.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)'), t = add('trm', 240, 150, 'T1', '230/12 V'), p = add('swp', 240, 260, 'P1', 'Pulsador'), tb = add('timb', 240, 350, 'TB1', 'Timbre'), n = bar(add, 440, 'Neutro (N)'); w(l, t); w(t, p, 'Secundario 12 V'); w(p, tb); w(tb, n); return b.m; } },
    { id: 'presencia', n: 'Detector de presencia con luz', d: 'El detector se alimenta con fase y neutro y conmuta la fase hacia la luminaria.',
      f() { const b = B(), { add, w } = b; const l = bar(add, 60, 'Fase (L)'), d = add('pir', 240, 150, 'DP1', 'Detector'), f = add('foco', 240, 260, 'E1', 'Luminaria'), n = bar(add, 340, 'Neutro (N)'); w(l, d); w(d, f, 'Fase conmutada'); w(f, n); return b.m; } },
  ];

  route(/^#\/tipicos$/, () => {
    view.innerHTML = `<h1>Esquemas típicos de vivienda</h1><p class="lead">Cableados habituales listos para editar. Se crean en el editor de <a href="#/esquemas">Esquemas</a>, donde puedes cambiar símbolos, etiquetas y añadir tu cuadro.</p>
    <div class="grid g2">${TIPOS.map(t => `<div class="card"><h3>${t.n}</h3><p>${t.d}</p><div class="row" style="margin-top:10px"><button class="btn pri sm" data-t="${t.id}">Crear esquema</button></div></div>`).join('')}</div>
    <p class="muted mini" style="margin-top:14px">Son esquemas funcionales simplificados para entender la conexión; el cableado real (colores, secciones, cajas de derivación) debe cumplir el REBT y las instrucciones de cada mecanismo.</p>`;
    $$('[data-t]').forEach(b => b.onclick = () => {
      const t = TIPOS.find(x => x.id === b.dataset.t), m = t.f(); m.id = uid(); m.tipo = 'viv'; m.nombre = t.n; m.mod = Date.now();
      m.cajetin = { titulo: t.n, titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1', escala: 'S/E', hoja: 'A4' };
      const l = store.get('esquemas', []); l.push(m); store.set('esquemas', l); location.hash = '#/esquemas/' + m.id;
    });
  });
});
