/* Editor de esquemas unifilares (SVG). Elementos con símbolos, conexiones automáticas, plantillas y exportación. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, num, view, $, $$ } = A;
  const W = 1400, H = 900, GR = 10;
  const snap = v => Math.round(v / GR) * GR;
  const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  /* ---------------------------------------------------------------- símbolos (coordenadas locales, entrada arriba y salida abajo) */
  const T = (x, y, s) => `<text x="${x}" y="${y}" font-size="${s || 9}" text-anchor="middle" stroke="none" fill="#111" font-family="Arial,sans-serif" font-weight="700">`;
  const BR = '<path d="M0-30V-12M0 30V12M0 12L-10-9"/>';
  const SYM = {
    red: { n: 'Red / acometida', c: 'Origen', l: 'Red 230/400 V', d: () => `<rect x="-28" y="-14" width="56" height="24" fill="#fff"/><path d="M0 10V30"/>${T(0, 2, 11)}RED</text>`, in: [0, -14], out: [0, 30] },
    gen: { n: 'Generador / grupo', c: 'Origen', l: 'G', d: () => `<circle r="16" fill="#fff"/><path d="M0 16V30"/>${T(0, 4, 12)}G~</text>`, in: [0, -16], out: [0, 30] },
    trafo: { n: 'Transformador', c: 'Origen', l: 'T', d: () => `<path d="M0-30V-14M0 14V30"/><circle cy="-6" r="10" fill="#fff"/><circle cy="6" r="10" fill="#fff"/>`, in: [0, -30], out: [0, 30] },
    cgp: { n: 'CGP', c: 'Enlace', l: 'CGP', d: () => `<path d="M0-30V-20M0 20V30"/><rect x="-18" y="-20" width="36" height="40" fill="#fff"/><path d="M-6-10v20M6-10v20"/>`, in: [0, -30], out: [0, 30] },
    cont: { n: 'Contador', c: 'Enlace', l: 'Contador', d: () => `<path d="M0-30V-16M0 16V30"/><circle r="16" fill="#fff"/>${T(0, 3, 9)}kWh</text>`, in: [0, -30], out: [0, 30] },
    icp: { n: 'ICP', c: 'Protección', l: 'ICP', d: () => `${BR}<path d="M-4-17l8 8M4-17l-8 8"/><rect x="-18" y="-4" width="7" height="8" fill="#fff"/>`, in: [0, -30], out: [0, 30] },
    igm: { n: 'Interruptor general (IGM)', c: 'Protección', l: 'IGM', d: () => `${BR}<path d="M-4-17l8 8M4-17l-8 8"/><rect x="-18" y="-4" width="7" height="8" fill="#fff"/>`, in: [0, -30], out: [0, 30] },
    pia: { n: 'Magnetotérmico (PIA)', c: 'Protección', l: 'PIA', d: () => `${BR}<path d="M-4-17l8 8M4-17l-8 8"/>`, in: [0, -30], out: [0, 30] },
    dif: { n: 'Diferencial', c: 'Protección', l: 'ID 30 mA', d: () => `${BR}<path d="M-4-17l8 8M4-17l-8 8"/><circle cx="14" cy="0" r="7" fill="#fff"/><path d="M-5 0H7"/>`, in: [0, -30], out: [0, 30] },
    secc: { n: 'Seccionador / interruptor', c: 'Protección', l: 'Q1', d: () => `${BR}<path d="M-5-12H5"/>`, in: [0, -30], out: [0, 30] },
    fus: { n: 'Fusible', c: 'Protección', l: 'F', d: () => `<path d="M0-30V30"/><rect x="-5" y="-14" width="10" height="28" fill="#fff"/>`, in: [0, -30], out: [0, 30] },
    spd: { n: 'Limitador de sobretensiones', c: 'Protección', l: 'SPD', d: () => `<path d="M0-30V-12M0 12V30"/><rect x="-8" y="-12" width="16" height="24" fill="#fff"/><path d="M-4-4L0 5L4-4"/>`, in: [0, -30], out: [0, 30] },
    cont2: { n: 'Contactor', c: 'Maniobra', l: 'KM1', d: () => `${BR}<path d="M-5-12H5M-10 0H-14"/><rect x="-30" y="-8" width="16" height="16" fill="#fff" stroke-dasharray="3 2"/>`, in: [0, -30], out: [0, 30] },
    term: { n: 'Relé térmico', c: 'Maniobra', l: 'F2', d: () => `<path d="M0-30V-14M0 14V30"/><rect x="-10" y="-14" width="20" height="28" fill="#fff"/><path d="M-6 6l3-12 3 12 3-12 3 12"/>`, in: [0, -30], out: [0, 30] },
    sw: { n: 'Interruptor (mecanismo)', c: 'Maniobra', l: 'Interruptor', d: () => `<path d="M0-30V-6M0 30V6M0 6L-9-8M-12-12l4 3"/>`, in: [0, -30], out: [0, 30] },
    pul: { n: 'Pulsador', c: 'Maniobra', l: 'S1', d: () => `<path d="M0-30V-6M0 30V6M-8 -8H8M0-14V-8"/>`, in: [0, -30], out: [0, 30] },
    motor: { n: 'Motor', c: 'Receptores', l: 'M', d: () => `<path d="M0-30V-18M0 18V30"/><circle r="18" fill="#fff"/>${T(0, 3, 13)}M</text>${T(0, 13, 8)}3~</text>`, in: [0, -30], out: [0, 30] },
    lamp: { n: 'Punto de luz', c: 'Receptores', l: 'Luz', d: () => `<path d="M0-30V-10"/><circle r="10" cy="0" fill="#fff"/><path d="M-7-7L7 7M7-7L-7 7"/>`, in: [0, -30], out: [0, 10] },
    toma: { n: 'Toma de corriente', c: 'Receptores', l: 'Toma', d: () => `<path d="M0-30V-9"/><circle r="9" fill="#fff"/><path d="M-9 0H9M0 0V9"/>`, in: [0, -30], out: [0, 9] },
    carga: { n: 'Receptor genérico', c: 'Receptores', l: 'Carga', d: () => `<path d="M0-30V-12"/><rect x="-18" y="-12" width="36" height="24" fill="#fff"/><path d="M-10 6l4-12 4 12 4-12 4 12"/>`, in: [0, -30], out: [0, 12] },
    evse: { n: 'Punto de recarga VE', c: 'Receptores', l: 'Recarga VE', d: () => `<path d="M0-30V-14"/><rect x="-20" y="-14" width="40" height="28" fill="#fff"/>${T(0, 5, 12)}VE</text>`, in: [0, -30], out: [0, 14] },
    pv: { n: 'Campo fotovoltaico', c: 'Generación', l: 'Campo FV', d: () => `<path d="M0 16V30"/><rect x="-20" y="-16" width="40" height="32" fill="#fff"/><path d="M-20 0H20M0-16V16"/>`, in: [0, -16], out: [0, 30] },
    inv: { n: 'Inversor', c: 'Generación', l: 'Inversor', d: () => `<path d="M0-30V-14M0 14V30"/><rect x="-20" y="-14" width="40" height="28" fill="#fff"/><path d="M-20 14L20-14"/>${T(-9, -4, 9)}=</text>${T(9, 10, 9)}~</text>`, in: [0, -30], out: [0, 30] },
    bat: { n: 'Batería', c: 'Generación', l: 'Batería', d: () => `<path d="M0-30V-6M0 30V6M-10-6H10M-5-1H5M-10 4H10M-5 9H5" transform="translate(0 0)"/>`, in: [0, -30], out: [0, 30] },
    tierra: { n: 'Toma de tierra', c: 'Tierra y otros', l: 'PE', d: () => `<path d="M0-30V0M-12 0H12M-8 6H8M-4 12H4"/>`, in: [0, -30], out: [0, 12] },
    bus: { n: 'Embarrado / barra', c: 'Tierra y otros', l: 'Cuadro', bus: true, d: e => { const w = e.w || 160; return `<path d="M${-w / 2} 0H${w / 2}" stroke-width="4"/>`; }, in: [0, 0], out: [0, 0] },
    txt: { n: 'Texto libre', c: 'Tierra y otros', l: 'Texto', txt: true, d: () => '', in: [0, 0], out: [0, 0] },
  };
  Object.assign(SYM, window.REBTSymExtra || {});
  const TIPOS = window.REBTTipos || {};
  const CATS = [...new Set(Object.values(SYM).map(s => s.c))];

  const PRE = { red: '', gen: 'G', trafo: 'T', cgp: 'CGP', cont: 'CT', icp: 'ICP', igm: 'IGM', pia: 'Q', dif: 'ID', secc: 'Q', fus: 'F', spd: 'SPD', cont2: 'KM', term: 'F', sw: 'I', pul: 'S', motor: 'M', lamp: 'L', toma: 'TC', evse: 'EV', pv: 'PV', inv: 'INV', bat: 'BAT', tierra: 'PE' };
  Object.keys(PRE).forEach(k => { if (SYM[k] && SYM[k].pre == null) SYM[k].pre = PRE[k]; });

  /* ---------------------------------------------------------------- geometría */
  const rotPt = (p, r) => { const a = (r || 0) * Math.PI / 2, c = Math.round(Math.cos(a)), s = Math.round(Math.sin(a)); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
  function term(e, kind, other) {
    const S = SYM[e.t];
    if (S.bus) { const w = e.w || 160; const x = Math.max(e.x - w / 2, Math.min(e.x + w / 2, other ? other.x : e.x)); return [x, e.y]; }
    const p = rotPt(S[kind], e.rot); return [e.x + p[0], e.y + p[1]];
  }
  function wirePts(m, w) {
    const a = m.els.find(e => e.id === w.a), b = m.els.find(e => e.id === w.b); if (!a || !b) return null;
    const p = term(a, 'out', b), q = term(b, 'in', a);
    if (p[0] === q[0] || p[1] === q[1]) return [p, q];
    const my = snap((p[1] + q[1]) / 2); return [p, [p[0], my], [q[0], my], q];
  }
  /* Conexión multifilar: si un extremo es multipolar y el otro también o es un embarrado, se dibujan 3 líneas */
  const tri = (m, w) => { const a = m.els.find(e => e.id === w.a), b = m.els.find(e => e.id === w.b); if (!a || !b) return false; const A = SYM[a.t], B = SYM[b.t]; return !!((A.m3 && (B.m3 || B.bus)) || (B.m3 && A.bus)); };
  const triPts = (pts, o) => { const k = o * 0.3; return pts.map((p, i) => pts.length === 4 && (i === 1 || i === 2) ? [p[0] + o, p[1] + k] : [p[0] + o, p[1]]); };
  const wrap = (s, n) => { const out = []; let cur = ''; String(s).split(/\s+/).forEach(w => { if ((cur + ' ' + w).trim().length > n) { if (cur) out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); return out; };

  /* ---------------------------------------------------------------- render SVG */
  function svgOf(m, sel, forExport) {
    const css = 'stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    let g = '';
    m.wires.forEach(w => {
      const pts = wirePts(m, w); if (!pts) return;
      const d = 'M' + pts.map(p => p.join(' ')).join('L');
      const tri3 = tri(m, w) && pts.length === 2 && pts[0][0] === pts[1][0];
      const extra = tri3 ? [-14, 14].map(o => `<path d="M${triPts(pts, o).map(p => p.join(' ')).join('L')}" stroke="${sel && sel.k === 'w' && sel.id === w.id ? '#d97706' : '#111'}" stroke-width="1.6"/>`).join('') : '';
      const mid = pts.length === 4 ? [(pts[1][0] + pts[2][0]) / 2, pts[1][1]] : [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
      const on = sel && sel.k === 'w' && sel.id === w.id;
      g += `<g data-w="${w.id}"><path fill="none" d="${d}" stroke="${on ? '#d97706' : '#111'}" stroke-width="${on ? 3 : 1.6}"/>${extra}${forExport ? '' : `<path fill="none" d="${d}" stroke="transparent" stroke-width="12" style="cursor:pointer"/>`}${w.label ? `<text x="${mid[0] + 6}" y="${mid[1] - 4}" font-size="9" fill="#444" stroke="none" font-family="Arial,sans-serif" paint-order="stroke">${esc(w.label)}</text>` : ''}</g>`;
    });
    m.els.forEach(e => {
      const S = SYM[e.t]; if (!S) return;
      const on = sel && sel.k === 'e' && sel.id === e.id;
      let lab = '';
      if (S.txt) lab = `<text x="${e.x}" y="${e.y}" font-size="${e.fs || 14}" fill="#111" font-family="Arial,sans-serif" font-weight="700" stroke="none">${esc(e.label || '')}</text>`;
      else if (e.pos === 'b') {
        const lines = wrap(e.label || '', 14).concat(wrap(e.sub || '', 16)); const y0 = e.y + (S.bus ? 16 : 34);
        lab = lines.map((l, i) => `<text x="${e.x}" y="${y0 + i * 11}" font-size="${i < wrap(e.label || '', 14).length ? 10 : 9}" font-weight="${i < wrap(e.label || '', 14).length ? 700 : 400}" text-anchor="middle" fill="#111" stroke="none" font-family="Arial,sans-serif">${esc(l)}</text>`).join('');
      } else {
        const bx = e.x + (S.bus ? (e.w || 160) / 2 + 8 : 24);
        lab = (e.label ? `<text x="${bx}" y="${e.y + (S.bus ? 4 : -2)}" font-size="11" font-weight="700" fill="#111" stroke="none" font-family="Arial,sans-serif">${esc(e.label)}</text>` : '') + (e.sub ? `<text x="${bx}" y="${e.y + 11}" font-size="9" fill="#444" stroke="none" font-family="Arial,sans-serif">${esc(e.sub)}</text>` : '');
      }
      const hit = forExport ? '' : S.txt ? `<rect x="${e.x - 4}" y="${e.y - (e.fs || 14)}" width="${Math.max(30, (e.label || '').length * 8)}" height="${(e.fs || 14) + 6}" fill="transparent"/>` : S.bus ? `<rect x="${e.x - (e.w || 160) / 2}" y="${e.y - 8}" width="${e.w || 160}" height="16" fill="transparent"/>` : `<rect x="${e.x - 26}" y="${e.y - 32}" width="52" height="64" fill="transparent"/>`;
      g += `<g data-e="${e.id}" style="cursor:move">${on ? `<rect x="${e.x - (S.bus ? (e.w || 160) / 2 : 28) - 4}" y="${e.y - (S.bus ? 10 : 34)}" width="${(S.bus ? (e.w || 160) : 56) + 8}" height="${S.bus ? 20 : 68}" fill="rgba(217,119,6,.10)" stroke="#d97706" stroke-dasharray="4 3" stroke-width="1"/>` : ''}<g transform="translate(${e.x} ${e.y}) rotate(${(e.rot || 0) * 90})" ${css}>${S.d(e)}</g>${lab}${hit}</g>`;
    });
    // cajetín
    const c = m.cajetin || {}; const cx = W - 360, cy = H - 90;
    const cj = `<g font-family="Arial,sans-serif" stroke="#111" fill="none"><rect x="${cx}" y="${cy}" width="350" height="80" stroke-width="1.4" fill="#fff"/><path d="M${cx} ${cy + 26}H${cx + 350}M${cx + 230} ${cy + 26}V${cy + 80}M${cx} ${cy + 53}H${cx + 230}" stroke-width=".8"/><g stroke="none" fill="#111"><text x="${cx + 8}" y="${cy + 18}" font-size="13" font-weight="700">${esc(c.titulo || m.nombre || 'Esquema unifilar')}</text><text x="${cx + 8}" y="${cy + 44}" font-size="9">Titular: ${esc(c.titular || '')}</text><text x="${cx + 8}" y="${cy + 71}" font-size="9">Instalador: ${esc(c.instalador || '')}</text><text x="${cx + 238}" y="${cy + 44}" font-size="9">Fecha: ${esc(c.fecha || '')}</text><text x="${cx + 238}" y="${cy + 71}" font-size="9">Plano: ${esc(c.plano || '1')}${c.rev ? ' · Rev. ' + esc(c.rev) : ''}</text><text x="${cx + 238}" y="${cy + 58}" font-size="9">Escala: ${esc(c.escala || 'S/E')} · ${esc(c.hoja || 'A4')}</text></g></g>`;
    return { body: g + cj };
  }
  function exportSVG(m) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${svgOf(m, null, true).body}</svg>`; }

  /* ---------------------------------------------------------------- almacén */
  const list = () => store.get('esquemas', []);
  const saveList = a => store.set('esquemas', a);

  /* ---------------------------------------------------------------- plantillas */
  function builder() {
    const m = { els: [], wires: [] }; let n = 0;
    const add = (t, x, y, label, sub, o) => { const e = Object.assign({ id: 'e' + (++n), t, x, y, rot: 0, label: label == null ? SYM[t].l : label, sub: sub || '' }, o || {}); m.els.push(e); return e; };
    const w = (a, b, l) => { m.wires.push({ id: 'w' + (++n), a: a.id, b: b.id, label: l || '' }); };
    return { m, add, w };
  }
  function genVivienda(o) {
    const { m, add, w } = builder();
    const base = [['C1', 'Iluminación', 10, 1.5, 'lamp'], ['C2', 'Tomas de uso general', 16, 2.5, 'toma'], ['C3', 'Cocina y horno', 25, 6, 'carga'], ['C4', 'Lavadora, lavavajillas y termo', 20, 4, 'carga'], ['C5', 'Baño y auxiliares de cocina', 16, 2.5, 'toma']];
    const extra = { C6: ['C6', 'Alumbrado adicional', 10, 1.5, 'lamp'], C7: ['C7', 'Tomas adicionales', 16, 2.5, 'toma'], C8: ['C8', 'Calefacción', 25, 6, 'carga'], C9: ['C9', 'Aire acondicionado', 25, 6, 'carga'], C10: ['C10', 'Secadora', 16, 2.5, 'carga'], C11: ['C11', 'Automatización', 10, 1.5, 'carga'] };
    let circ = base.slice(); (o.extra || []).forEach(k => { if (extra[k]) circ.push(extra[k]); });
    const N = circ.length, X0 = 90, SP = 100, igmA = o.icp || 25;
    const red = add('red', X0, 50, 'Red', '230 V monofásica');
    const cgp = add('cgp', X0, 130, 'CGP', 'fusibles'); const ct = add('cont', X0, 210, 'Contador'); const icp = add('icp', X0, 290, 'ICP', igmA + ' A'); const igm = add('igm', X0, 370, 'IGM', igmA + ' A');
    const busW = Math.max(200, N * SP + 40), bus = add('bus', X0 - 30 + busW / 2, 440, 'Cuadro general', '', { w: busW });
    w(red, cgp, 'Acometida'); w(cgp, ct, 'LGA'); w(ct, icp, 'DI'); w(icp, igm); w(igm, bus);
    const ng = o.grado === 'elevada' ? Math.max(2, Math.ceil(N / 5)) : Math.max(1, Math.ceil(N / 5)); const sz = Math.ceil(N / ng);
    let i = 0, col = 0;
    for (let g = 0; g < ng && i < N; g++) {
      const cs = circ.slice(i, i + sz); i += sz; const xs = cs.map((_, k) => X0 + (col + k) * SP + 20); col += cs.length;
      const cx = snap((xs[0] + xs[xs.length - 1]) / 2), sw = Math.max(80, cs.length * SP - 20);
      const dif = add('dif', cx, 510, 'ID ' + (o.grado === 'elevada' ? '40' : '40') + ' A', '30 mA tipo A'); const sub = add('bus', cx, 580, '', '', { w: sw });
      w(bus, dif); w(dif, sub);
      cs.forEach((c, k) => {
        const pia = add('pia', xs[k], 640, c[0] + ' · ' + c[2] + ' A', '', {}), ld = add(c[4], xs[k], 740, c[1], '', { pos: 'b' });
        w(sub, pia); w(pia, ld, c[3] + ' mm²');
      });
    }
    m.cajetin = { titulo: o.nombre || 'Esquema unifilar de vivienda', titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1' };
    return m;
  }
  function genMotor() {
    const { m, add, w } = builder(); const x = 300;
    const r = add('red', x, 50, 'Red', '3F+N+PE 400 V'), q = add('secc', x, 130, 'Q1', 'Seccionador'), f = add('fus', x, 210, 'F1', 'gG'), k = add('cont2', x, 290, 'KM1', 'Contactor'), t = add('term', x, 370, 'F2', 'Relé térmico'), mo = add('motor', x, 460, 'M1', 'Motor 3~'), pe = add('tierra', x, 540, 'PE', '');
    w(r, q); w(q, f); w(f, k); w(k, t); w(t, mo, '3×… mm²'); w(mo, pe);
    m.cajetin = { titulo: 'Arranque directo de motor trifásico', titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1' };
    return m;
  }
  function genFV() {
    const { m, add, w } = builder();
    const pv = add('pv', 180, 60, 'Campo FV', '… kWp'), sd = add('secc', 180, 140, 'Seccionador DC'), iv = add('inv', 180, 220, 'Inversor', '… kW'), pia = add('pia', 180, 300, 'PIA', '… A'), df = add('dif', 180, 380, 'ID', '30 mA');
    const red = add('red', 520, 50, 'Red', '230 V'), ct = add('cont', 520, 130, 'Contador'), igm = add('igm', 520, 220, 'IGM', '… A');
    const bus = add('bus', 350, 470, 'Cuadro general', '', { w: 420 }), spd = add('spd', 520, 540, 'SPD', ''), pe = add('tierra', 520, 620, 'PE', '');
    const p2 = add('pia', 260, 540, 'PIA', 'consumo'), ld = add('carga', 260, 630, 'Receptores', '', { pos: 'b' });
    w(pv, sd, 'DC'); w(sd, iv); w(iv, pia, 'AC'); w(pia, df); w(df, bus); w(red, ct); w(ct, igm); w(igm, bus); w(bus, spd); w(spd, pe); w(bus, p2); w(p2, ld);
    m.cajetin = { titulo: 'Autoconsumo fotovoltaico', titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1' };
    return m;
  }
  function genVE() {
    const { m, add, w } = builder(); const x = 240;
    const red = add('red', x, 50, 'Red', ''), ct = add('cont', x, 130, 'Contador'), igm = add('igm', x, 210, 'IGM', '… A'), bus = add('bus', x, 290, 'Cuadro', '', { w: 200 });
    const df = add('dif', x, 360, 'ID', '30 mA tipo A'), pia = add('pia', x, 440, 'PIA', '32 A'), ev = add('evse', x, 530, 'Recarga VE', 'Modo 3, 7,4 kW', { pos: 'r' }), pe = add('tierra', x + 90, 530, 'PE', '');
    w(red, ct); w(ct, igm); w(igm, bus); w(bus, df); w(df, pia); w(pia, ev, '3×6 mm²'); w(ev, pe);
    m.cajetin = { titulo: 'Punto de recarga de vehículo eléctrico', titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1' };
    return m;
  }

  const css = document.createElement('style');
  css.textContent = `.esq{display:grid;grid-template-columns:230px 1fr 250px;gap:12px;align-items:start}
.esq .pal{max-height:calc(100vh - 150px);overflow:auto}.esq .pal h4{margin:10px 0 4px;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.esq .pb{display:flex;gap:8px;align-items:center;width:100%;text-align:left;border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:8px;padding:6px 8px;margin:3px 0;font:inherit;font-size:13px;cursor:pointer;min-height:36px}
.esq .pb:hover{border-color:var(--brand)}.esq .pb svg{flex:none;background:#fff;border-radius:6px}
.esq .cv{background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;touch-action:none;box-shadow:var(--shadow)}
.esq .cv svg{display:block;width:100%;height:auto;max-height:calc(100vh - 190px);user-select:none}
.esq .tools{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.esq .tools .on{background:var(--brand);border-color:var(--brand);color:#111}
.esq .pp{position:sticky;top:12px}
@media (max-width:1100px){.esq{grid-template-columns:1fr}.esq .pal{max-height:none;display:none}.esq.showpal .pal{display:block}.esq .pp{position:static}}
@media print{.esq{display:block}.esq .pal,.esq .pp,.esq .tools{display:none!important}.esq .cv{border:0;box-shadow:none}.esq .cv svg{max-height:none}}`;
  document.head.appendChild(css);

  /* ---------------------------------------------------------------- vistas */
  const icon = t => { const S = SYM[t]; return `<svg width="34" height="34" viewBox="-30 -36 60 72"><g stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round">${S.txt ? '<text x="-14" y="6" font-size="22" font-weight="700" stroke="none" fill="#111">Aa</text>' : S.d({ w: 50 })}</g></svg>`; };
  window.REBTSym = SYM; window.REBTSymIcon = icon; window.REBTEsqSVG = exportSVG;
  route(/^#\/simbolos$/, () => {
    view.innerHTML = `<h1>Simbología</h1><p class="lead">Los símbolos disponibles en el editor de <a href="#/esquemas">Esquemas</a>, con su designación habitual (la letra que se pone en el esquema: KM1, F2, S1…) y para qué sirven. Son representaciones didácticas basadas en la práctica habitual y la serie UNE-EN 60617; para un plano oficial, consulta la norma.</p>
    <input id="ss" type="search" placeholder="Buscar símbolo o designación…" aria-label="Buscar símbolo" style="width:100%;max-width:420px;margin-bottom:10px"><div id="sl"></div>`;
    const draw = () => {
      const q = ($('#ss').value || '').toLowerCase().trim();
      $('#sl').innerHTML = CATS.map(c => { const it = Object.entries(SYM).filter(([, s]) => s.c === c && !s.txt && (!q || (s.n + ' ' + (s.pre || '') + ' ' + (s.u || '')).toLowerCase().includes(q))); return it.length ? `<h2>${c}</h2><div class="tiles" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${it.map(([k, s]) => `<div class="card" style="display:flex;gap:12px;align-items:center"><div style="background:#fff;border-radius:8px;padding:4px;flex:none">${icon(k)}</div><div><b>${s.n}</b>${s.pre ? ` <span class="tag itc">${s.pre}</span>` : ''}${s.u ? `<p>${esc(s.u)}</p>` : ''}</div></div>`).join('')}</div>` : ''; }).join('') || '<p class="muted">Sin resultados.</p>';
    };
    $('#ss').oninput = draw; draw();
  });
  route(/^#\/esquemas$/, () => {
    const a = list().sort((x, y) => y.mod - x.mod);
    view.innerHTML = `<h1>Esquemas</h1><p class="lead">Dibuja cualquier tipo de esquema eléctrico con más de ${Object.keys(SYM).length} símbolos: unifilar, multifilar, mando, instalación de viviendas, motores, tierra y generación. Expórtalos a PDF, PNG o SVG. Consulta todos los símbolos en <a href="#/simbolos">Simbología</a>.</p>
    <h2>Nuevo esquema en blanco, por tipo</h2><div class="tiles">${Object.entries(TIPOS).map(([k, t]) => `<button class="tile" data-t="${k}" style="text-align:left;font:inherit;color:inherit;cursor:pointer"><div class="ti">${t.i}</div><div><b>${t.n}</b><span>${t.d}</span></div></button>`).join('')}</div>
    <h2>Desde una plantilla</h2><div class="grid g2">
    <button class="card" data-n="viv" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><h3>🏠 Vivienda (asistente)</h3><p>Enlace + cuadro con circuitos C1–C11 según el grado de electrificación.</p></button>
    <button class="card" data-n="mot" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><h3>⚙️ Arranque directo de motor (unifilar)</h3><p>Seccionador, fusibles, contactor, relé térmico y motor. Más arranques completos (potencia + mando) en <a href="#/motores">Motores</a>.</p></button>
    <button class="card" data-n="fv" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><h3>☀️ Autoconsumo fotovoltaico</h3><p>Campo FV, inversor, protecciones y conexión al cuadro.</p></button>
    <button class="card" data-n="ve" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><h3>🔌 Recarga de vehículo eléctrico</h3><p>Circuito dedicado con diferencial 30 mA tipo A.</p></button></div>
    <div id="asist" class="card" hidden style="margin-top:14px"><h3>Asistente de vivienda</h3><div class="form"><div><label>Grado</label><select id="a_g"><option value="basica">Básica (C1–C5)</option><option value="elevada">Elevada (≥ 2 diferenciales)</option></select></div><div><label>ICP / IGM (A)</label><select id="a_i"><option>25</option><option>32</option><option>40</option></select></div><div class="full"><label>Circuitos adicionales</label><div class="chips" id="a_x">${['C6', 'C7', 'C8', 'C9', 'C10', 'C11'].map(c => `<button class="chip" data-x="${c}">${c}</button>`).join('')}</div></div></div><button class="btn pri" id="a_ok">Generar esquema</button></div>
    <h2>Mis esquemas <span class="muted" style="font-size:14px">${a.length}</span></h2>
    ${a.length ? a.map(s => `<div class="dl"><span style="font-size:22px">📐</span><b><a href="#/esquemas/${s.id}" style="color:inherit;text-decoration:none">${esc(s.nombre)}</a><br><span class="muted" style="font-weight:500;font-size:13px">${s.els.length} elementos · ${new Date(s.mod).toLocaleString('es-ES')}</span></b><a class="btn sm pri" href="#/esquemas/${s.id}">Abrir</a><button class="btn sm" data-dup="${s.id}">Duplicar</button><button class="btn sm" data-del="${s.id}">Borrar</button></div>`).join('') : '<p class="muted">Aún no tienes esquemas.</p>'}`;
    const create = (m, nombre) => { m.id = uid(); m.nombre = nombre; m.mod = Date.now(); const l = list(); l.push(m); saveList(l); location.hash = '#/esquemas/' + m.id; };
    const sel = new Set();
    $$('#a_x .chip').forEach(b => b.onclick = () => { b.classList.toggle('on'); b.classList.contains('on') ? sel.add(b.dataset.x) : sel.delete(b.dataset.x); });
    $$('[data-n]').forEach(b => b.onclick = () => {
      const k = b.dataset.n;
      if (k === 'viv') { $('#asist').hidden = false; $('#asist').scrollIntoView({ behavior: 'smooth' }); return; }
      if (k === 'mot') create(Object.assign(genMotor(), { tipo: 'motor' }), 'Motor trifásico');
      if (k === 'fv') create(Object.assign(genFV(), { tipo: 'fv' }), 'Autoconsumo FV');
      if (k === 've') create(Object.assign(genVE(), { tipo: 'fv' }), 'Recarga VE');
    });
    $$('[data-t]').forEach(b => b.onclick = () => { const t = TIPOS[b.dataset.t]; create({ tipo: b.dataset.t, els: [], wires: [], cajetin: { titulo: t.n, titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1', escala: 'S/E', hoja: 'A4' } }, t.n + ' (nuevo)'); });
    $('#a_ok').onclick = () => create(Object.assign(genVivienda({ grado: $('#a_g').value, icp: +$('#a_i').value, extra: [...sel] }), { tipo: 'cuadro' }), 'Vivienda ' + ($('#a_g').value === 'elevada' ? 'elevada' : 'básica'));
    $$('[data-del]').forEach(b => b.onclick = () => { if (confirm('¿Borrar este esquema?')) { saveList(list().filter(x => x.id !== b.dataset.del)); A.go(); } });
    $$('[data-dup]').forEach(b => b.onclick = () => { const l = list(), o = l.find(x => x.id === b.dataset.dup), c = JSON.parse(JSON.stringify(o)); c.id = uid(); c.nombre += ' (copia)'; c.mod = Date.now(); l.push(c); saveList(l); A.go(); });
  });

  route(/^#\/esquemas\/(x[\w]+)$/, id => {
    const m = list().find(s => s.id === id); if (!m) { view.innerHTML = '<p>No encontrado. <a href="#/esquemas">Volver</a></p>'; return; }
    m.cajetin = m.cajetin || {};
    let sel = null, mode = 'sel', conn = null, vb = { x: 0, y: 0, w: W, h: H }; const hist = [];
    let saveT;
    const save = () => { m.mod = Date.now(); clearTimeout(saveT); saveT = setTimeout(() => { const l = list(), i = l.findIndex(s => s.id === m.id); if (i >= 0) { l[i] = m; saveList(l); } }, 200); };
    const snapshot = () => { hist.push(JSON.stringify({ els: m.els, wires: m.wires })); if (hist.length > 60) hist.shift(); };
    const undo = () => { const h = hist.pop(); if (!h) return; const o = JSON.parse(h); m.els = o.els; m.wires = o.wires; sel = null; draw(); panel(); save(); };

    view.innerHTML = `<div class="row noprint" style="margin-bottom:10px"><a class="btn sm" href="#/esquemas">← Esquemas</a><input id="nm" value="${esc(m.nombre)}" style="flex:1;min-width:160px;font-weight:700;max-width:340px" aria-label="Nombre"><span class="sp"></span><button class="btn sm" id="pal-t">🧩 Símbolos</button><button class="btn sm" id="u">↶ Deshacer</button><button class="btn sm" id="num" title="Asigna KM1, KM2, F1… según el tipo de símbolo">🔢 Numerar</button><button class="btn sm" id="png">PNG</button><button class="btn sm" id="svg">SVG</button><button class="btn sm pri" id="prn">🖨️ Imprimir / PDF</button></div>
    <div class="esq" id="esq">
      <div class="pal card noprint" id="pal"><input id="psr" type="search" placeholder="Buscar símbolo…" aria-label="Buscar símbolo" style="width:100%;margin-bottom:6px"><div class="chips" style="margin:0 0 6px"><button class="chip on" id="pt1">Del tipo</button><button class="chip" id="pt2">Todos</button></div><div id="pbox"></div></div>
      <div><div class="tools noprint"><button class="btn sm on" data-m="sel">↖ Seleccionar</button><button class="btn sm" data-m="con">🔗 Conectar</button><button class="btn sm" id="zi">＋</button><button class="btn sm" id="zo">－</button><button class="btn sm" id="zf">Ajustar</button><span class="muted" id="hint" style="font-size:13px;align-self:center"></span></div>
      <div class="cv"><svg id="sch" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="gp" width="${GR * 2}" height="${GR * 2}" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#cfd6e3"/></pattern></defs><rect id="bg" width="${W}" height="${H}" fill="#fff"/><rect id="grid" width="${W}" height="${H}" fill="url(#gp)"/><g id="lay"></g></svg></div></div>
      <div class="pp card noprint" id="pp"></div></div>
    <div class="onehand noprint" id="oh" role="toolbar" aria-label="Acciones rápidas"><button id="oh_a" aria-label="Añadir símbolo">＋</button><button id="oh_c" aria-label="Conectar" style="font-size:13px;font-weight:700">Unir</button><button id="oh_r" aria-label="Girar">⟳</button><button id="oh_d" aria-label="Duplicar">⧉</button><button id="oh_x" aria-label="Eliminar" style="font-size:13px;font-weight:700">Borrar</button><button id="oh_u" aria-label="Deshacer">↶</button>
      <div class="pad"><button class="u" id="oh_up" aria-label="Subir">▲</button><button id="oh_l" aria-label="Izquierda">◀</button><button id="oh_dn" aria-label="Bajar">▼</button><button id="oh_rt" aria-label="Derecha">▶</button></div></div>`;
    const svg = $('#sch'), lay = $('#lay');
    let todos = !TIPOS[m.tipo];
    const palette = () => {
      const q = ($('#psr').value || '').toLowerCase().trim(), cats = todos || !TIPOS[m.tipo] ? CATS : TIPOS[m.tipo].cats.filter(c => CATS.includes(c));
      $('#pbox').innerHTML = cats.map(c => { const it = Object.entries(SYM).filter(([, s]) => s.c === c && (!q || (s.n + ' ' + (s.u || '')).toLowerCase().includes(q))); return it.length ? `<h4>${c}</h4>${it.map(([k, s]) => `<button class="pb" data-add="${k}" title="${esc(s.u || '')}">${icon(k)}<span>${s.n}</span></button>`).join('')}` : ''; }).join('') || '<p class="muted mini">Sin resultados.</p>';
      $('#pt1').classList.toggle('on', !todos); $('#pt2').classList.toggle('on', todos);
      $$('[data-add]').forEach(b => b.onclick = () => addSym(b.dataset.add));
    };
    $('#pt1').onclick = () => { todos = false; palette(); }; $('#pt2').onclick = () => { todos = true; palette(); }; $('#psr').oninput = palette;
    const pt = ev => { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y]; };
    const setVB = () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    const draw = () => { const r = svgOf(m, sel); lay.innerHTML = r.body; $('#grid').style.display = 'block'; $('#hint').textContent = mode === 'con' ? (conn ? 'Haz clic en el elemento de destino' : 'Haz clic en el elemento de origen') : ''; $$('[data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === mode)); };
    const sub = (k, v) => `<div class="fld"><label>${k}</label>${v}</div>`;
    const panel = () => {
      const p = $('#pp'); const c = m.cajetin;
      if (sel && sel.k === 'e') {
        const e = m.els.find(x => x.id === sel.id); const S = SYM[e.t];
        p.innerHTML = `<h3>${S.n}</h3>${sub(S.txt ? 'Texto' : 'Nombre', `<input id="p_l" value="${esc(e.label || '')}">`)}${S.txt ? sub('Tamaño', `<input id="p_fs" type="number" min="8" max="40" value="${e.fs || 14}">`) : sub('Detalle (calibre, sección…)', `<input id="p_s" value="${esc(e.sub || '')}">`)}${S.bus ? sub('Ancho', `<input id="p_w" type="number" step="10" min="40" value="${e.w || 160}">`) : ''}${S.txt || S.bus ? '' : sub('Etiqueta', `<select id="p_p"><option value="r" ${e.pos !== 'b' ? 'selected' : ''}>A la derecha</option><option value="b" ${e.pos === 'b' ? 'selected' : ''}>Debajo</option></select>`)}<div class="row">${S.bus || S.txt ? '' : '<button class="btn sm" id="p_r">⟳ Girar</button>'}<button class="btn sm" id="p_d">Duplicar</button><button class="btn sm" id="p_x" style="color:var(--bad)">Eliminar</button></div><p class="muted" style="font-size:12px">Atajos: Supr borra · flechas mueven · R gira · Ctrl+Z deshace.</p>`;
        $('#p_l').oninput = ev => { e.label = ev.target.value; draw(); save(); }; if ($('#p_s')) $('#p_s').oninput = ev => { e.sub = ev.target.value; draw(); save(); };
        if ($('#p_fs')) $('#p_fs').oninput = ev => { e.fs = +ev.target.value || 14; draw(); save(); }; if ($('#p_w')) $('#p_w').oninput = ev => { e.w = Math.max(40, +ev.target.value || 160); draw(); save(); }; if ($('#p_p')) $('#p_p').onchange = ev => { e.pos = ev.target.value; draw(); save(); };
        if ($('#p_r')) $('#p_r').onclick = () => { snapshot(); e.rot = ((e.rot || 0) + 1) % 4; draw(); save(); };
        $('#p_d').onclick = () => { snapshot(); const c2 = Object.assign({}, e, { id: uid(), x: e.x + 20, y: e.y + 20 }); m.els.push(c2); sel = { k: 'e', id: c2.id }; draw(); panel(); save(); };
        $('#p_x').onclick = delSel;
      } else if (sel && sel.k === 'w') {
        const w = m.wires.find(x => x.id === sel.id);
        p.innerHTML = `<h3>Conexión</h3>${sub('Cable / texto', `<input id="p_l" value="${esc(w.label || '')}" placeholder="Ej.: RZ1-K 3×6 mm²">`)}<button class="btn sm" id="p_x" style="color:var(--bad)">Eliminar conexión</button>`;
        $('#p_l').oninput = ev => { w.label = ev.target.value; draw(); save(); }; $('#p_x').onclick = delSel;
      } else {
        p.innerHTML = `<h3>Cajetín</h3>${sub('Título', `<input id="c_t" value="${esc(c.titulo || '')}">`)}${sub('Titular', `<input id="c_ti" value="${esc(c.titular || '')}">`)}${sub('Instalador', `<input id="c_i" value="${esc(c.instalador || '')}">`)}${sub('Fecha', `<input id="c_f" value="${esc(c.fecha || '')}">`)}${sub('Nº de plano', `<input id="c_p" value="${esc(c.plano || '')}">`)}${sub('Revisión', `<input id="c_r" value="${esc(c.rev || '')}" placeholder="A, B, 1…">`)}${sub('Escala', `<input id="c_e" value="${esc(c.escala || '')}" placeholder="S/E, 1:50…">`)}${sub('Hoja al imprimir', `<select id="c_h"><option ${c.hoja !== 'A3' ? 'selected' : ''}>A4</option><option ${c.hoja === 'A3' ? 'selected' : ''}>A3</option></select>`)}<p class="muted" style="font-size:12px">Toca un símbolo para editarlo. Usa «Conectar» y pulsa origen y destino para unirlos.</p>`;
        [['c_t', 'titulo'], ['c_ti', 'titular'], ['c_i', 'instalador'], ['c_f', 'fecha'], ['c_p', 'plano'], ['c_r', 'rev'], ['c_e', 'escala']].forEach(([i, k]) => $('#' + i).oninput = ev => { c[k] = ev.target.value; draw(); save(); });
        $('#c_h').onchange = ev => { c.hoja = ev.target.value; draw(); save(); };
      }
    };
    const delSel = () => { if (!sel) return; snapshot(); if (sel.k === 'e') { m.els = m.els.filter(e => e.id !== sel.id); m.wires = m.wires.filter(w => w.a !== sel.id && w.b !== sel.id); } else m.wires = m.wires.filter(w => w.id !== sel.id); sel = null; draw(); panel(); save(); };
    draw(); panel();

    $('#nm').oninput = e => { m.nombre = e.target.value; save(); };
    /* Barra de una mano: todo al alcance del pulgar, con cruceta para mover el símbolo elegido */
    const selEl = () => (sel && sel.k === 'e' ? m.els.find(x => x.id === sel.id) : null);
    const nudge = (dx, dy) => { const e = selEl(); if (!e) return; snapshot(); e.x += dx; e.y += dy; draw(); save(); };
    $('#oh_a').onclick = () => $('#esq').classList.toggle('showpal');
    $('#oh_c').onclick = () => { mode = mode === 'con' ? 'sel' : 'con'; conn = null; draw(); };
    $('#oh_r').onclick = () => { const e = selEl(); if (!e || SYM[e.t].bus || SYM[e.t].txt) return; snapshot(); e.rot = ((e.rot || 0) + 1) % 4; draw(); save(); };
    $('#oh_d').onclick = () => { const e = selEl(); if (!e) return; snapshot(); const c2 = Object.assign({}, e, { id: uid(), x: e.x + 20, y: e.y + 20 }); m.els.push(c2); sel = { k: 'e', id: c2.id }; draw(); panel(); save(); };
    $('#oh_x').onclick = delSel; $('#oh_u').onclick = undo;
    $('#oh_up').onclick = () => nudge(0, -GR); $('#oh_dn').onclick = () => nudge(0, GR); $('#oh_l').onclick = () => nudge(-GR, 0); $('#oh_rt').onclick = () => nudge(GR, 0);
    $('#u').onclick = undo;
    $('#pal-t').onclick = () => $('#esq').classList.toggle('showpal');
    $$('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; conn = null; draw(); });
    const addSym = k => {
      snapshot(); const S = SYM[k]; const c = [vb.x + vb.w / 2, vb.y + vb.h / 2]; const off = (m.els.length % 6) * 20;
      const e = { id: uid(), t: k, x: snap(c[0] + off - 60), y: snap(c[1] + off - 60), rot: 0, label: S.l, sub: '' }; if (S.bus) e.w = 160; m.els.push(e); sel = { k: 'e', id: e.id }; mode = 'sel'; draw(); panel(); save(); $('#esq').classList.remove('showpal');
    };
    palette();
    const zoom = f => { const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2; vb.w = Math.max(200, Math.min(W * 1.6, vb.w * f)); vb.h = vb.w * H / W; vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2; setVB(); };
    $('#zi').onclick = () => zoom(.8); $('#zo').onclick = () => zoom(1.25); $('#zf').onclick = () => { vb = { x: 0, y: 0, w: W, h: H }; setVB(); };
    svg.addEventListener('wheel', ev => { ev.preventDefault(); const p = pt(ev), f = ev.deltaY > 0 ? 1.1 : .9; const nw = Math.max(200, Math.min(W * 1.6, vb.w * f)), k = nw / vb.w; vb.x = p[0] - (p[0] - vb.x) * k; vb.y = p[1] - (p[1] - vb.y) * k; vb.w = nw; vb.h = nw * H / W; setVB(); }, { passive: false });

    let drag = null; const ptrs = new Map(); let pinch = null;
    svg.addEventListener('pointerdown', ev => {
      ptrs.set(ev.pointerId, [ev.clientX, ev.clientY]);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), vb: Object.assign({}, vb) }; drag = null; return; }
      const ge = ev.target.closest('[data-e]'), gw = ev.target.closest('[data-w]'); const p = pt(ev);
      if (ge) {
        const e = m.els.find(x => x.id === ge.dataset.e);
        if (mode === 'con') {
          if (!conn) { conn = e.id; sel = { k: 'e', id: e.id }; }
          else if (conn !== e.id) { snapshot(); m.wires.push({ id: uid(), a: conn, b: e.id, label: '' }); conn = null; save(); sel = null; }
          draw(); panel(); return;
        }
        sel = { k: 'e', id: e.id }; drag = { t: 'e', e, sx: p[0], sy: p[1], ox: e.x, oy: e.y, moved: false, snap: false }; svg.setPointerCapture(ev.pointerId); draw(); panel();
      } else if (gw) { sel = { k: 'w', id: gw.dataset.w }; draw(); panel(); }
      else { sel = null; conn = null; draw(); panel(); drag = { t: 'p', sx: ev.clientX, sy: ev.clientY, vx: vb.x, vy: vb.y }; svg.setPointerCapture(ev.pointerId); }
    });
    svg.addEventListener('pointermove', ev => {
      if (ptrs.has(ev.pointerId)) ptrs.set(ev.pointerId, [ev.clientX, ev.clientY]);
      if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), k = pinch.d / (d || 1), nw = Math.max(200, Math.min(W * 1.6, pinch.vb.w * k)), cx = pinch.vb.x + pinch.vb.w / 2, cy = pinch.vb.y + pinch.vb.h / 2; vb.w = nw; vb.h = nw * H / W; vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2; setVB(); return; }
      if (!drag) return;
      if (drag.t === 'e') { const p = pt(ev), dx = p[0] - drag.sx, dy = p[1] - drag.sy; if (!drag.moved && Math.hypot(dx, dy) < 4) return; if (!drag.moved) { snapshot(); drag.moved = true; } drag.e.x = snap(drag.ox + dx); drag.e.y = snap(drag.oy + dy); draw(); }
      else { const r = svg.getBoundingClientRect(), k = vb.w / r.width; vb.x = drag.vx - (ev.clientX - drag.sx) * k; vb.y = drag.vy - (ev.clientY - drag.sy) * k; setVB(); }
    });
    const end = ev => { if (ev && ev.pointerId != null) ptrs.delete(ev.pointerId); if (ptrs.size < 2) pinch = null; if (drag && drag.moved) { save(); panel(); } drag = null; };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    window.__esqKey = ev => {
      if (!document.body.contains(svg)) return;
      if (/INPUT|TEXTAREA|SELECT/.test((ev.target || {}).tagName || '')) return;
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(); return; }
      if (!sel || sel.k !== 'e') { if ((ev.key === 'Delete' || ev.key === 'Backspace') && sel) delSel(); return; }
      const e = m.els.find(x => x.id === sel.id); if (!e) return;
      if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); delSel(); }
      else if (ev.key.toLowerCase() === 'r') { snapshot(); e.rot = ((e.rot || 0) + 1) % 4; draw(); save(); }
      else if (ev.key.startsWith('Arrow')) { ev.preventDefault(); snapshot(); const s = ev.shiftKey ? 50 : GR; if (ev.key === 'ArrowUp') e.y -= s; if (ev.key === 'ArrowDown') e.y += s; if (ev.key === 'ArrowLeft') e.x -= s; if (ev.key === 'ArrowRight') e.x += s; draw(); save(); }
    };
    if (!window.__esqBound) { window.__esqBound = true; document.addEventListener('keydown', ev => window.__esqKey && window.__esqKey(ev)); }

    const dl = (name, data, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
    const fname = () => (m.nombre || 'esquema').replace(/[^\w\- ]+/g, '');
    $('#svg').onclick = () => dl(fname() + '.svg', exportSVG(m), 'image/svg+xml');
    $('#png').onclick = () => { const img = new Image(), url = URL.createObjectURL(new Blob([exportSVG(m)], { type: 'image/svg+xml' })); img.onload = () => { const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname() + '.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }); }; img.src = url; };
    $('#prn').onclick = () => {
      sel = null; vb = { x: 0, y: 0, w: W, h: H }; setVB(); draw(); document.title = m.nombre;
      const st = document.createElement('style'); st.textContent = '@page{size:' + (m.cajetin.hoja === 'A3' ? 'A3' : 'A4') + ' landscape;margin:8mm}'; document.head.appendChild(st);
      window.addEventListener('afterprint', () => st.remove(), { once: true }); setTimeout(() => window.print(), 50);
    };
    $('#num').onclick = () => {
      snapshot(); const cnt = {}; let n = 0;
      m.els.slice().sort((a, b) => a.y - b.y || a.x - b.x).forEach(e => {
        const S = SYM[e.t]; if (!S || !S.pre || S.txt || S.bus) return;
        if (e.label && e.label !== S.l && !/^[A-Z]{1,4}\d*$/.test(e.label)) return;
        cnt[S.pre] = (cnt[S.pre] || 0) + 1; e.label = S.pre + cnt[S.pre]; n++;
      });
      draw(); panel(); save(); $('#hint').textContent = n + ' símbolos numerados';
    };
  });
});
