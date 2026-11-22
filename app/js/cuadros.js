/* Cuadros de protección completos (vivienda y local): circuitos, IGA, diferenciales, PIA, sobretensiones,
   cuadro simulado en SVG y lista de materiales. Datos de ITC-BT-25, 10, 19, 23, 28 y 52. Sin precios. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, view, $, $$ } = A;
  const C = window.Calc;
  const PIA = [6, 10, 16, 20, 25, 32, 40, 50, 63], IDS = [25, 40, 63, 80, 100], CAJAS = [12, 18, 24, 36, 48, 72];
  const up = (arr, x) => arr.find(c => c >= x - 1e-9) || arr[arr.length - 1];
  const n0 = (v, d) => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : d; };

  /* ---------- cálculo de un circuito: sección por caída de tensión con In del PIA ---------- */
  function dim(c, sis, L, lim, recalc) {
    const S0 = c.S;
    const r = C.calcularSeccion({ sistema: sis, Ib: c.In, L, minSeccion: c.S, limite: lim, metodo: 'B', aisl: 'PVC', mat: 'Cu', cosfi: 1 });
    c.L = L; c.sis = sis;
    if (r.solucion) { c.S = r.solucion.S; c.dUp = r.solucion.dUp; c.ok = true; } else { c.dUp = null; c.ok = false; }
    c.lim = lim; if ((recalc || c.S !== S0) && C.tubo) c.tubo = C.tubo(c.S, sis === 'tri' ? 5 : 3, 'emp') || c.tubo;
    return c;
  }

  /* ---------- dibujo del cuadro: aparamenta y cableado como en un cuadro real ---------- */
  const MW = 28, ROW = 12, MH = 84, X0 = 30;
  const SH = { C1: 'Luz', C2: 'Tomas', C3: 'Cocina', C4: 'Lavad.', C5: 'Baño', C6: 'Luz+', C7: 'Tomas+', C8: 'Calef.', C9: 'Aire', C10: 'Secad.', C11: 'Domót.', C12: 'Adic.', C12b: 'Adic.', C13: 'VE', AL: 'Luz', EM: 'Emerg.', TC: 'Tomas', CL: 'Clima', OC: 'Otras' };
  const corto = cod => SH[cod] || SH[cod.split('.')[0]] || SH[cod.replace(/\d+$/, '')] || '';
  /* colores de los conductores (ITC-BT-19, 2.2.4): neutro azul claro, protección verde-amarillo, fases marrón / negro / gris */
  const CF = { N: '#4aa3df', L: '#7a4a22', L1: '#7a4a22', L2: '#1a1a1a', L3: '#8c919a' };
  const wire = (pts, col, sw) => { const d = 'M' + pts.map(q => q.join(' ')).join('L'); sw = sw || 2.2; return col === 'PE' ? `<path d="${d}" fill="none" stroke="#3f9d3a" stroke-width="${sw}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f1d31a" stroke-width="${sw}" stroke-dasharray="3 3" stroke-linejoin="round"/>` : `<path d="${d}" fill="none" stroke="${CF[col] || col}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`; };
  const dot = (x, y, col) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${col === 'PE' ? '#3f9d3a' : (CF[col] || col)}" stroke="#fff" stroke-width=".6"/>`;
  const tornillo = (x, y) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#cfd4db" stroke="#6b7280" stroke-width=".8"/><path d="M${x - 2.3} ${y}H${x + 2.3}M${x} ${y - 2.3}V${y + 2.3}" stroke="#6b7280" stroke-width=".7"/>`;
  const borne = (x, y) => `<rect x="${x - 6}" y="${y - 4.6}" width="12" height="9.2" rx="1.2" fill="#2b2e34"/><rect x="${x - 4}" y="${y - 3}" width="8" height="2" fill="#0d0e10"/>${tornillo(x, y + 1)}`;

  function modulo(m, x, ry) {
    const w = m.w * MW, cx = x + w / 2; let o = '';
    const fill = { iga: 'url(#gI)', id: 'url(#gD)', spd: 'url(#gS)', pia: 'url(#gP)' }[m.k] || 'url(#gP)';
    o += `<rect x="${x + 2}" y="${ry + 2}" width="${w - 1.6}" height="${MH}" rx="2.5" fill="rgba(0,0,0,.14)"/><rect x="${x + .8}" y="${ry}" width="${w - 1.6}" height="${MH}" rx="2.5" fill="${fill}" stroke="#6f757e" stroke-width="1"/>`;
    for (let i = 0; i < m.w; i++) { const sx = x + i * MW + MW / 2; o += borne(sx, ry + 7) + borne(sx, ry + MH - 8); }
    o += `<rect x="${x + 3}" y="${ry + 15}" width="${w - 6}" height="${MH - 31}" rx="2" fill="${m.k === 'spd' ? '#c9ced5' : '#fbfbf9'}" stroke="#b8bec6" stroke-width=".7"/>`;
    const T = (tx, ty, sz, t, wt) => `<text x="${tx}" y="${ty}" font-size="${sz}" font-weight="${wt || 700}" text-anchor="middle" fill="#14161a">${esc(t)}</text>`;
    if (m.k === 'pia') {
      const n = m.w;
      o += `<rect x="${x + 5}" y="${ry + 16}" width="${w - 10}" height="3" rx="1" fill="#0b0c0e"/>`;                       /* barra que acopla las palancas: corta fase y neutro a la vez */
      for (let i = 0; i < n; i++) { const lx = x + i * MW + MW / 2; o += `<rect x="${lx - 6}" y="${ry + 19}" width="12" height="23" rx="2.2" fill="#1d2025" stroke="#000"/><rect x="${lx - 4}" y="${ry + 21}" width="8" height="8" rx="1.2" fill="rgba(255,255,255,.2)"/><rect x="${lx - 3}" y="${ry + 43}" width="6" height="3" rx="1" fill="#c0392b"/>`; }
      o += `<text x="${x + 4}" y="${ry + 14}" font-size="5.5" font-weight="700" fill="#2a6fa5">N</text>`;
      o += T(cx, ry + 56, 8, String(m.l1).replace(/\D.*$/, '') + ' A') + `<rect x="${cx - 10}" y="${ry + 60}" width="20" height="6" rx="1" fill="none" stroke="#555" stroke-width=".5"/>` + T(cx, ry + 65, 5, '6000', 600) + T(cx, ry + 72, 4.8, n === 4 ? '400 V~' : '230 V~', 500);
    } else if (m.k === 'iga') {
      o += `<rect x="${x + 6}" y="${ry + 19}" width="${w - 12}" height="24" rx="3" fill="#1d2025" stroke="#000"/><rect x="${x + 6}" y="${ry + 19}" width="${w - 12}" height="6" rx="2" fill="#c0392b"/><path d="M${x + 12} ${ry + 31}H${x + w - 12}" stroke="rgba(255,255,255,.25)"/>`;
      o += T(cx, ry + 52, 8.5, 'IGA') + T(cx, ry + 62, 8.5, String(m.l1).replace(/\D.*$/, '') + ' A') + T(cx, ry + 71, 5, m.l2 + ' · ' + (m.w === 4 ? '400' : '230') + ' V~', 500);
    } else if (m.k === 'id') {
      o += `<rect x="${x + 6}" y="${ry + 18}" width="${w - 12}" height="17" rx="3" fill="#1d2025" stroke="#000"/><rect x="${x + 6}" y="${ry + 18}" width="${w - 12}" height="4" rx="2" fill="#2e8b57"/>`;
      o += `<circle cx="${x + w - 12}" cy="${ry + 43}" r="4.3" fill="#2f7bff" stroke="#17479c"/>` + T(x + w - 12, ry + 45.2, 5, 'T', 800).replace('#14161a', '#fff');
      o += `<text x="${x + 9}" y="${ry + 46}" font-size="8" font-weight="700" fill="#14161a">ID</text>` + T(cx, ry + 57, 8, m.l1) + T(cx, ry + 65, 6.5, m.l2);
    } else if (m.k === 'spd') {
      o += `<rect x="${x + 7}" y="${ry + 19}" width="${w - 14}" height="12" rx="2" fill="#27a05a" stroke="#176b3b"/>` + T(cx, ry + 28, 6, 'OK', 800).replace('#14161a', '#fff') + T(cx, ry + 48, 8.5, 'SPD') + T(cx, ry + 58, 6.5, m.l2 || '', 600) + T(cx, ry + 67, 5, 'Up ≤ 2,5 kV', 500);
    }
    return o;
  }

  function panelSVG(o) {
    const pol = o.sis === 'tri' ? 4 : 2, tri = pol === 4, POL = tri ? ['N', 'L1', 'L2', 'L3'] : ['N', 'L'];
    const Wd = ROW * MW + 2 * X0, cap = ROW - pol, PL = Wd - 12;
    const px = i => X0 + i * MW + MW / 2;                  /* x del polo i de un aparato situado en X0 */
    const lane = i => 8 + i * 5;                            /* carriles de la canaleta izquierda: neutro el más externo */
    const rows = [{ k: 'ent' }];
    o.grupos.forEach(g => {
      rows.push({ k: 'id', g });
      let cur = [], wsum = 0, first = true;
      g.cs.forEach(c => { const cw = c.pol === '3P+N' ? 4 : 2; if (wsum + cw > cap && cur.length) { rows.push({ k: 'pia', g, cs: cur, first }); first = false; cur = []; wsum = 0; } cur.push(c); wsum += cw; });
      if (cur.length) rows.push({ k: 'pia', g, cs: cur, first });
    });
    let y = 44; const geo = [];
    rows.forEach(r => { const h = r.k === 'ent' ? [34, 52] : r.k === 'id' ? [64, 14] : [tri ? 90 : 82, 104]; r.ry = y + h[0]; r.bot = r.ry + MH + h[1]; y = r.bot; geo.push(r); });
    const by = y + 6, Ht = by + 44;
    let wires = '', devs = '', lab = '';
    const plate = (x, w, yy, a, b) => `<rect x="${x + 1}" y="${yy}" width="${w - 2}" height="22" rx="1.5" fill="#fff" stroke="#9aa3ad" stroke-width=".7"/><text x="${x + w / 2}" y="${yy + 10}" font-size="8.5" font-weight="700" text-anchor="middle" fill="#111">${esc(a)}</text>${b ? `<text x="${x + w / 2}" y="${yy + 19}" font-size="6.3" text-anchor="middle" fill="#444">${esc(b)}</text>` : ''}`;
    /* ---- fila de entrada: IGA y SPD (la fase y el neutro pasan por el aparato) ---- */
    const ry0 = geo[0].ry;
    devs += modulo({ k: 'iga', w: pol, l1: o.iga.In + ' A', l2: tri ? '4P' : '2P' }, X0, ry0); lab += plate(X0, pol * MW, ry0 - 30, 'IGA', 'General');
    POL.forEach((pn, i) => { wires += wire([[px(i), 40], [px(i), ry0 + 7]], pn); });
    lab += `<text x="${X0}" y="36" font-size="8" font-weight="700" fill="#222">Entrada: derivación individual, mín. 6 mm² Cu (ITC-BT-15)</text>`;
    const yo = i => ry0 + MH + 8 + i * 6;
    POL.forEach((pn, i) => { wires += wire([[px(i), ry0 + MH - 8], [px(i), yo(i)], [lane(i), yo(i)]], pn) + dot(px(i), ry0 + MH - 8, pn); });
    if (o.spd) {
      const sx0 = X0 + pol * MW;
      devs += modulo({ k: 'spd', w: pol, l1: '', l2: o.spd }, sx0, ry0); lab += plate(sx0, pol * MW, ry0 - 30, 'SPD', 'Sobret.');
      POL.forEach((pn, i) => { const sx = sx0 + i * MW + MW / 2; wires += wire([[px(i), yo(i)], [sx, yo(i)], [sx, ry0 + MH - 8]], pn) + dot(px(i), yo(i), pn); });
      wires += wire([[sx0 + pol * MW - 6, ry0 + MH], [sx0 + pol * MW - 6, ry0 + MH + 34], [PL, ry0 + MH + 34]], 'PE', 2) + dot(PL, ry0 + MH + 34, 'PE');
      lab += `<text x="${sx0 + pol * MW + 6}" y="${ry0 + MH + 31}" font-size="6.5" fill="#333">PE del SPD</text>`;
    }
    let feedMax = ry0 + MH + 8 + 6 * pol;
    /* ---- diferenciales y filas de PIA ---- */
    geo.forEach((r, gi) => {
      if (r.k === 'id') {
        const ry = r.ry; devs += modulo({ k: 'id', w: pol, l1: r.g.idIn + ' A', l2: '30 mA' }, X0, ry);
        lab += plate(X0, pol * MW, ry - 36, r.g.id, r.g.cs.length > 1 ? r.g.cs[0].cod + '–' + r.g.cs[r.g.cs.length - 1].cod : r.g.cs[0].cod);
        POL.forEach((pn, i) => { const fy = ry - 14 - (pol - 1 - i) * 5; wires += wire([[lane(i), fy], [px(i), fy], [px(i), ry + 7]], pn) + dot(lane(i), fy, pn); feedMax = Math.max(feedMax, fy); });
      } else if (r.k === 'pia') {
        const ry = r.ry, xs = X0 + pol * MW, idRow = r.first ? geo[gi - 1] : null;
        const pbY = ry + MH + 20, endY = ry + MH + 52;
        const nY = ry - 8, fY = ph => ry - 8 - (tri ? ph * 5 : 6);   /* neutro en el peine más cercano; fases por encima */
        let xe = xs; r.cs.forEach(c => { xe += (c.pol === '3P+N' ? 4 : 2) * MW; });
        const comb = (xl, yy, col) => `<rect x="${xl}" y="${yy - 2}" width="${xe - xl}" height="4" rx="1" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width=".5"/>`;
        wires += comb(idRow ? px(0) : xs, nY, '#4a90c8');
        (tri ? [1, 2, 3] : [1]).forEach(ph => { wires += comb(idRow ? px(tri ? ph : 1) : xs, fY(ph), tri ? (ph === 1 ? '#a8652b' : ph === 2 ? '#2a2a2a' : '#9aa0a8') : '#c8843a'); });
        if (idRow) POL.forEach((pn, i) => { const yy = pn === 'N' ? nY : fY(tri ? i : 1); wires += wire([[px(i), idRow.ry + MH - 8], [px(i), yy]], pn) + dot(px(i), idRow.ry + MH - 8, pn) + dot(px(i), yy, pn); });
        else lab += `<text x="${X0 + 4}" y="${ry - 26}" font-size="7" fill="#555">continúa el peine de la fila anterior</text>`;
        wires += wire([[X0 + 4, pbY], [PL, pbY]], 'PE', 2) + dot(PL, pbY, 'PE') + `<text x="${X0 + 3}" y="${pbY + 8}" font-size="6.5" fill="#3a7d2e">PE</text>`;
        let x = xs;
        r.cs.forEach(c => {
          const w3 = c.pol === '3P+N', ww = w3 ? 4 : 2, wpx = ww * MW, cx = x + wpx / 2;
          devs += modulo({ k: 'pia', w: ww, l1: c.In + '' }, x, ry);
          lab += plate(x, wpx, ry - (tri ? 62 : 44), c.cod, corto(c.cod));
          const ph = tri ? Math.max(1, +String(c.fase || 'L1').slice(1)) : 1, pc = tri ? POL[ph] : 'L';
          if (w3) {
            for (let k = 0; k < 4; k++) {
              const sx = x + k * MW + MW / 2, pn = POL[k], yy = k === 0 ? nY : fY(k);
              wires += wire([[sx, yy], [sx, ry + 7]], pn) + dot(sx, yy, pn) + wire([[sx, ry + MH - 8], [sx, endY]], pn);
            }
            wires += wire([[x + wpx - 5, pbY], [x + wpx - 5, endY]], 'PE') + dot(x + wpx - 5, pbY, 'PE');
          } else {
            const nx = x + MW / 2, lx = nx + MW;          /* polo izquierdo = neutro, polo derecho = fase: ambos pasan por el PIA */
            wires += wire([[nx, nY], [nx, ry + 7]], 'N') + dot(nx, nY, 'N') + wire([[lx, fY(ph)], [lx, ry + 7]], pc) + dot(lx, fY(ph), pc);
            wires += wire([[nx, ry + MH - 8], [nx, endY]], 'N') + wire([[lx, ry + MH - 8], [lx, endY]], pc) + wire([[cx, pbY], [cx, endY]], 'PE') + dot(cx, pbY, 'PE');
          }
          wires += `<rect x="${x + 4}" y="${endY - 8}" width="${wpx - 8}" height="9" rx="3" fill="#6b7280" stroke="#3f444c" stroke-width=".7"/>`;
          lab += `<text x="${cx}" y="${endY + 10}" font-size="7.5" font-weight="700" text-anchor="middle" fill="#111">${w3 ? 5 : 3}×${String(c.S).replace('.', ',')}</text><text x="${cx}" y="${endY + 18}" font-size="6.3" text-anchor="middle" fill="#444">Ø${c.tubo}</text>`;
          x += wpx;
        });
      }
    });
    /* carriles de la canaleta izquierda (alimentación a cada ID) */
    POL.forEach((pn, i) => { wires = wire([[lane(i), yo(i)], [lane(i), feedMax]], pn) + wires; });
    const duct = `<rect x="4" y="${ry0 + MH - 4}" width="${POL.length * 5 + 8}" height="${feedMax - ry0 - MH + 10}" rx="2" fill="rgba(120,130,145,.18)" stroke="#9aa3ad" stroke-dasharray="2 2"/>`;
    /* tierra de la derivación individual hasta la barra de PE */
    wires += wire([[PL, 40], [PL, by + 2]], 'PE', 2) + `<text x="${PL - 4}" y="48" font-size="6.5" text-anchor="end" fill="#3a7d2e">PE (DI)</text>`;
    const bars = `<rect x="${X0}" y="${by}" width="${Wd - X0 - 8}" height="14" rx="2" fill="#6fae3f" stroke="#4d7a22"/><rect x="${X0}" y="${by + 5}" width="${Wd - X0 - 8}" height="4" fill="#f2d21b"/><text x="${X0 + 5}" y="${by + 10}" font-size="8" font-weight="700" fill="#222">PE</text>` + Array.from({ length: 19 }, (_, k) => `<circle cx="${X0 + 26 + k * 16}" cy="${by + 7}" r="2.4" fill="#cfd4db" stroke="#555" stroke-width=".6"/>`).join('');
    let rails = '';
    geo.forEach(r => { rails += `<rect x="${X0 - 6}" y="${r.ry + MH / 2 - 6}" width="${ROW * MW + 12}" height="12" fill="#bfc6cf" stroke="#8b94a0"/>`; for (let k = 0; k < ROW * 2; k++) rails += `<rect x="${X0 + 3 + k * (MW / 2)}" y="${r.ry + MH / 2 - 1.5}" width="7" height="3" rx="1.5" fill="#8b94a0"/>`; });
    const defs = `<defs><linearGradient id="gP" x1="0" x2="1"><stop offset="0" stop-color="#f7f7f4"/><stop offset=".5" stop-color="#ecece7"/><stop offset="1" stop-color="#dcdcd6"/></linearGradient><linearGradient id="gI" x1="0" x2="1"><stop offset="0" stop-color="#f4eee8"/><stop offset="1" stop-color="#ded5cb"/></linearGradient><linearGradient id="gD" x1="0" x2="1"><stop offset="0" stop-color="#f1f4f9"/><stop offset="1" stop-color="#d7dde7"/></linearGradient><linearGradient id="gS" x1="0" x2="1"><stop offset="0" stop-color="#cfd4db"/><stop offset="1" stop-color="#aab1bb"/></linearGradient></defs>`;
    const caja = `<rect x="2" y="2" width="${Wd - 4}" height="${Ht - 4}" rx="12" fill="#cfd5dc" stroke="#8b94a0" stroke-width="3"/><rect x="9" y="9" width="${Wd - 18}" height="${Ht - 18}" rx="8" fill="#eceff3" stroke="#aab2bd"/><text x="${Wd / 2}" y="24" font-size="10" font-weight="700" text-anchor="middle" fill="#333">${esc(o.titulo || 'Cuadro de mando y protección')}</text>`;
    return `<svg class="pn" viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="Cuadro de mando y protección con el conexionado de los cables" style="width:100%;height:auto;display:block;max-width:640px;margin:0 auto">${defs}${caja}${duct}${rails}${wires}${devs}${lab}${bars}</svg>`;
  }

  /* ---------- agrupar en diferenciales y generar el cuadro ---------- */
  function montar(o) {
    /* o: { cs, sis, iga:{In,pol}, grupos:[{id,nombre,idIn,pol,cs:[]}], spd } */
    const pol = o.sis === 'tri' ? 4 : 2, gr = [];
    const cab = { cap: 'Entrada (desde ICP / derivación individual)', mods: [{ k: 'iga', w: pol, l1: o.iga.In + ' A', l2: pol === 4 ? '4P' : '2P', cap: 'IGA', s: 'General' }] };
    if (o.spd) cab.mods.push({ k: 'spd', w: pol, l1: 'SPD', l2: o.spd, cap: 'SPD', s: 'Sobret.' });
    gr.push(cab);
    o.grupos.forEach(g => {
      const mods = [{ k: 'id', w: pol, l1: g.idIn + ' A', l2: '30 mA · ' + g.tipo, cap: g.id, s: g.cs.map(c => c.cod).join(' ').slice(0, 9) }];
      g.cs.forEach(c => mods.push({ k: 'pia', w: c.pol === '3P+N' ? 4 : 2, l1: c.In + '', l2: 'C' + (c.fase ? ' ' + c.fase : ''), cap: c.cod, s: corto(c.cod) }));
      gr.push({ cap: g.id + ' · ' + g.nombre + ' · diferencial 30 mA', mods });
    });
    const total = gr.reduce((s, g) => s + g.mods.reduce((t, m) => t + m.w, 0), 0);
    const filas = gr.reduce((s, g) => s + Math.ceil(g.mods.reduce((t, m) => t + m.w, 0) / ROW), 0);
    const conReserva = Math.ceil(total * 1.2);
    const ley = '<p class="mini" style="margin:8px 0 0"><b>Colores (ITC-BT-19, 2.2.4):</b> neutro azul claro · protección verde-amarillo · fases marrón, negro y gris. Conductor de protección en cada circuito; el IGA, el diferencial y cada PIA cortan fase y neutro (corte omnipolar, ITC-BT-17).</p>';
    return { svg: panelSVG(o) + ley, total, filas, caja: up(CAJAS, conReserva), conReserva };
  }

  /* ---------- listas ---------- */
  const tabla = (cab, rows) => `<div class="tw"><table><thead><tr>${cab.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((x, i) => `<td>${i === 0 ? '<b>' + x + '</b>' : x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  function materiales(cs, extra) {
    const cable = {}, tubo = {};
    cs.forEach(c => { const m = c.L * 1.25; const k = c.S + (c.sis === 'tri' ? '|5' : '|3'); cable[k] = (cable[k] || 0) + m; const t = c.tubo; if (t) tubo[t] = (tubo[t] || 0) + m; });
    const rows = [];
    Object.keys(cable).sort((a, b) => parseFloat(a) - parseFloat(b)).forEach(k => { const [s, n] = k.split('|'); rows.push(['Cable de cobre', `${s} mm² · ${n} conductores (${n === '5' ? 'L1 L2 L3 N PE' : 'F + N + PE'}), 450/750 V`, fmt(Math.ceil(cable[k]), 0) + ' m']); });
    Object.keys(tubo).sort((a, b) => a - b).forEach(t => rows.push(['Tubo corrugado empotrado', `Ø ${t} mm`, fmt(Math.ceil(tubo[t]), 0) + ' m']));
    return rows.concat(extra);
  }
  const nota = '<p class="muted mini">Metros: longitud al punto más alejado × 1,25 por ramales y bajadas (estimación; sustituye por tu medición). No se incluyen precios: ponlos tú en <a href="#/presupuesto">Presupuestos</a>.</p>';

  /* =====================================================================
     VIVIENDA
     ===================================================================== */
  function circuitosViv(v) {
    /* ITC-BT-25, 2.3.2: C6–C13 solo existen en electrificación elevada (también si hay más de 30 luces, 20 tomas o 6 tomas de baño) */
    const elev = v.sup > 160 || v.cal || v.aire || v.aut || v.ve || v.elec || v.sec || v.pl > 30 || v.tg > 20 || v.tb > 6;
    const cs = [], add = (cod, n, In, S, tubo, extra) => cs.push(Object.assign({ cod, n, In, S, tubo, pol: '1P+N' }, extra || {}));
    const n1 = Math.max(1, Math.ceil(v.pl / 30)), pts = v.pl / n1;
    add('C1', 'Iluminación', 10, 1.5, 16, { luz: Math.ceil(pts) });
    add('C2', 'Tomas generales y frigorífico', 16, 2.5, 20, { tg: Math.min(20, v.tg) });
    add('C3', 'Cocina y horno', 25, 6, 25, { b25: 1 });
    add('C4', 'Lavadora, lavavajillas y termo', 20, 4, 20, { b16c: 3 });
    add('C5', 'Baño y auxiliares de cocina', 16, 2.5, 20, { tb: Math.min(6, v.tb) });
    for (let i = 1; i < n1; i++) add('C6' + (i > 1 ? '.' + i : ''), 'Iluminación adicional', 10, 1.5, 16, { luz: Math.ceil(pts) });
    const n7 = Math.max(Math.ceil(v.tg / 20) - 1, v.sup > 160 ? 1 : 0);
    for (let i = 0; i < n7; i++) add('C7' + (i ? '.' + (i + 1) : ''), 'Tomas generales adicionales', 16, 2.5, 20, { tg: Math.min(20, Math.max(0, v.tg - 20 * (i + 1))) });
    if (v.cal) add('C8', 'Calefacción eléctrica', 25, 6, 25, { cal: 1 });
    if (v.aire) add('C9', 'Aire acondicionado', 25, 6, 25, { aire: 1 });
    if (v.sec) add('C10', 'Secadora', 16, 2.5, 20, { b16: 1 });
    if (v.aut) add('C11', 'Automatización y gestión de energía', 10, 1.5, 16, { aut: 1 });
    if (v.elec) add('C12', 'Adicional tipo C4 (electrodomésticos)', 20, 4, 20, { b16c: 3 });
    if (v.tb > 6) add(v.elec ? 'C12b' : 'C12', 'Adicional tipo C5 (más de 6 tomas)', 16, 2.5, 20, { tb: v.tb - 6 });
    if (v.ve) add('C13', 'Recarga de vehículo eléctrico', v.veIn, v.veIn === 16 ? 2.5 : 6, v.veIn === 16 ? 20 : 25, { ve: 1, excl: true });
    return { elev, cs };
  }
  /* ---------- esquemas editables a partir del cálculo ---------- */
  let ULT = null;
  const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  function bld() {
    const m = { els: [], wires: [] }; let n = 0; const SYM = window.REBTSym || {};
    const add = (t, x, y, label, sub, o) => { const e = Object.assign({ id: 'e' + (++n), t, x, y, rot: 0, label: label == null ? (SYM[t] || {}).l : label, sub: sub || '' }, o || {}); m.els.push(e); return e; };
    const w = (a, b, l) => m.wires.push({ id: 'w' + (++n), a: a.id, b: b.id, label: l || '' });
    return { m, add, w };
  }
  const cajetin = t => ({ titulo: t, titular: '', instalador: (store.get('perfil', {}) || {}).instalador || '', fecha: new Date().toLocaleDateString('es-ES'), plano: '1', escala: 'S/E', hoja: 'A4' });
  const sim = c => (c.luz ? 'lamp' : (c.tg || c.tb || c.b16 || c.b16c) ? 'toma' : 'carga');
  const cab = (D, c) => c.cod + ' · ' + c.In + ' A';
  const secc = c => (c.pol === '3P+N' ? '5×' : '3×') + String(c.S).replace('.', ',') + ' mm²';
  const KIND = {
    uni(D) {
      const { m, add, w } = bld(), tri = D.sis === 'tri', N = D.cs.length, SP = Math.max(70, Math.min(100, Math.floor(1200 / N))), X0 = 90;
      const red = add('red', X0, 50, 'Red', tri ? '3F+N 400 V' : '230 V monofásica'), cgp = add('cgp', X0, 130, 'CGP', 'fusibles'), ct = add('cont', X0, 210, 'Contador'), icp = add('icp', X0, 290, 'ICP', 'según potencia contratada'), igm = add('igm', X0, 370, 'IGA ' + D.iga + ' A', (tri ? '4P' : '2P') + ' · omnipolar');
      const busW = Math.max(200, N * SP + 40), bus = add('bus', X0 - 30 + busW / 2, 440, 'Cuadro general', '', { w: busW });
      w(red, cgp, 'Acometida'); w(cgp, ct, 'LGA'); w(ct, icp, 'DI mín. 6 mm²'); w(icp, igm); w(igm, bus);
      if (D.spd) { const sp = add('spd', X0 + busW + 20, 500, 'SPD', D.spd + ' · ITC-BT-23'), te = add('tierra', X0 + busW + 20, 590, 'PE', ''); w(bus, sp); w(sp, te); }
      let col = 0;
      D.grupos.forEach(g => {
        const xs = g.cs.map((_, k) => X0 + (col + k) * SP + 20); col += g.cs.length;
        const cx = snap((xs[0] + xs[xs.length - 1]) / 2), sw = Math.max(80, g.cs.length * SP - 20);
        const dif = add('dif', cx, 510, g.id + ' · ' + g.idIn + ' A', '30 mA tipo A'), sub = add('bus', cx, 580, '', '', { w: sw });
        w(bus, dif); w(dif, sub);
        g.cs.forEach((c, k) => { const pia = add('pia', xs[k], 640, cab(D, c), c.pol === '3P+N' ? '4P' : (c.fase || '')), ld = add(sim(c), xs[k], 740, c.n, '', { pos: 'b' }); w(sub, pia); w(pia, ld, secc(c)); });
      });
      m.cajetin = cajetin('Esquema unifilar · ' + D.nombre); return m;
    },
    multi(D) {
      const { m, add, w } = bld(), N = D.cs.length, SP = Math.max(80, Math.min(110, Math.floor(1200 / N))), X0 = 120;
      const busW = Math.max(240, N * SP + 40), top = add('bus', X0 - 30 + busW / 2, 60, 'L1 L2 L3 N', '', { w: busW }), ig = add('pia3', X0, 140, 'IGA ' + D.iga + ' A', '4P · omnipolar');
      const bus = add('bus', X0 - 30 + busW / 2, 240, 'Cuadro general', '', { w: busW }); w(top, ig); w(ig, bus);
      if (D.spd) { const sp = add('spd', X0 + busW + 20, 300, 'SPD', D.spd), te = add('tierra', X0 + busW + 20, 390, 'PE', ''); w(bus, sp); w(sp, te); }
      let col = 0;
      D.grupos.forEach(g => {
        const xs = g.cs.map((_, k) => X0 + (col + k) * SP + 20); col += g.cs.length;
        const cx = snap((xs[0] + xs[xs.length - 1]) / 2), sw = Math.max(80, g.cs.length * SP - 20);
        const dif = add('dif4', cx, 320, g.id + ' · ' + g.idIn + ' A', '4P 30 mA tipo A'), sub = add('bus', cx, 390, '', '', { w: sw });
        w(bus, dif); w(dif, sub);
        g.cs.forEach((c, k) => { const t3 = c.pol === '3P+N', pia = add(t3 ? 'pia3' : 'pia', xs[k], 460, cab(D, c), t3 ? '3P+N' : 'N + ' + (c.fase || 'L1')), ld = add(t3 ? 'mot3' : sim(c), xs[k], 560, c.n, '', { pos: 'b' }); w(sub, pia); w(pia, ld, secc(c)); });
      });
      m.cajetin = cajetin('Esquema multifilar · ' + D.nombre); return m;
    },
    inst(D) {
      const { m, add, w } = bld(), N = D.cs.length, SP = Math.max(100, Math.min(130, Math.floor(1300 / N))), X0 = 90;
      const cu = add('cuadro', X0 + Math.floor(N * SP / 2) - 40, 50, 'Cuadro de mando y protección', D.iga + ' A');
      D.cs.forEach((c, k) => {
        const x = X0 + k * SP, pia = add('pia', x, 150, cab(D, c)); w(cu, pia);
        if (c.luz) { const sw = add('sw1', x, 260, 'Interruptores 10 A', '≥ ' + c.luz); const fo = add('foco', x, 360, c.luz + ' puntos de luz', '', { pos: 'b' }); w(pia, sw, secc(c)); w(sw, fo); }
        else if (c.em) { const em = add('emer', x, 280, c.em + ' aparatos de emergencia', '', { pos: 'b' }); w(pia, em, secc(c)); }
        else { const n = c.tg || c.tb || (c.b25 ? 1 : 0) || c.b16c || c.b16 || 1; const b = add(c.b25 || c.cl || c.oc || c.cal || c.aire || c.aut || c.ve ? 'carga' : 'tomap', x, 280, c.n, (c.b25 ? 'Base 25 A 2P+T' : (c.tg || c.tb || c.b16 || c.b16c) ? n + ' bases 16 A 2P+T' : ''), { pos: 'b' }); w(pia, b, secc(c)); }
      });
      m.cajetin = cajetin('Instalación interior · ' + D.nombre); return m;
    },
    tierra(D) {
      const { m, add, w } = bld(), x = 300;
      const pq = add('pqt', x, 70, 'Electrodo / pica', 'ITC-BT-18'), bep = add('bep', x, 190, 'Borne principal de tierra', 'seccionable'), cu = add('cuadro', x, 310, 'Cuadro general', 'barra PE'), eq = add('eqp', x + 200, 190, 'Equipotencial', 'baños y cocina · ITC-BT-27');
      w(pq, bep, 'Conductor de tierra: 16 mm² Cu protegido / 25 mm² Cu sin protección mecánica'); w(bep, cu, 'Línea principal de tierra'); w(bep, eq, 'Conductor equipotencial');
      add('txt', 90, 420, 'Conductores de protección: verde-amarillo, uno por circuito, hasta cada base y masa (ITC-BT-19 y 18). DI: ≥ 6 mm² Cu con conductor de protección (ITC-BT-15).', '', { fs: 12 });
      m.cajetin = cajetin('Puesta a tierra · ' + D.nombre); return m;
    },
  };
  const TIPOQ = { uni: ['cuadro', 'Unifilar'], multi: ['multi', 'Multifilar'], inst: ['viv', 'Instalación'], tierra: ['tierra', 'Puesta a tierra'] };
  function publicar(D) {
    ULT = D; const host = $('#co'); if (!host) return;
    const tri = D.sis === 'tri';
    host.insertAdjacentHTML('beforeend', `<h2>Esquemas editables</h2><p class="muted mini">Se crean con los valores de este cálculo y se abren en el editor de Esquemas para modificarlos e imprimirlos.</p>
      <div class="rnav"><button class="btn pri sm" data-gen="uni">Unifilar del cuadro</button> <button class="btn sm" data-gen="multi" ${tri ? '' : 'disabled title="Solo trifásica"'}>Multifilar${tri ? '' : ' (solo trifásica)'}</button> <button class="btn sm" data-gen="inst">Instalación interior</button> <button class="btn sm" data-gen="tierra">Puesta a tierra</button></div>
      <p class="muted mini">Mando, motores y fotovoltaica no salen de este cálculo: tienen su propia página (Motores, Generación).</p>`);
    host.querySelectorAll('[data-gen]').forEach(b => b.onclick = () => {
      const k = b.dataset.gen, m = KIND[k](ULT), q = TIPOQ[k];
      m.id = uid(); m.tipo = q[0]; m.nombre = q[1] + ' · ' + ULT.nombre; m.mod = Date.now();
      const l = store.get('esquemas', []); l.push(m); store.set('esquemas', l); location.hash = '#/esquemas/' + m.id;
    });
  }
  const snap = v => Math.round(v / 10) * 10;
  const defL = sup => Math.round(Math.sqrt(sup) * 1.4 + 4);

  route(/^#\/cuadro\/vivienda$/, () => {
    const S = store.get('cuadro.viv', {}); const g = (k, d) => (S[k] !== undefined ? S[k] : d);
    const chk = (k, l) => `<div class="check" style="border:0;align-items:center"><input type="checkbox" id="v_${k}" ${g(k, false) ? 'checked' : ''}><label for="v_${k}" style="margin:0;font-size:14px">${l}</label></div>`;
    const inp = (k, l, d) => `<div><label for="v_${k}">${l}</label><input id="v_${k}" inputmode="decimal" value="${esc(g(k, d))}"></div>`;
    view.innerHTML = `<p class="mini"><a href="#/calcular">&larr; Calcular</a></p><h1>Cuadro de vivienda</h1><p class="lead">Calcula los circuitos, el IGA, los diferenciales, las protecciones y los materiales, y dibuja el cuadro de mando y protección completo (ITC-BT-25).</p>
    <div class="form">${inp('sup', 'Superficie útil (m²)', 90)}${inp('pl', 'Puntos de luz', 18)}${inp('tg', 'Tomas de uso general (C2)', 14)}${inp('tb', 'Tomas de baño y cocina (C5)', 5)}
    <div><label for="v_acom">Alimentación del edificio</label><select id="v_acom"><option value="sub" ${g('acom', 'sub') === 'sub' ? 'selected' : ''}>Red subterránea</option><option value="aer" ${g('acom') === 'aer' ? 'selected' : ''}>Línea aérea</option></select></div>
    <div><label for="v_pot">Potencia contratada (W, opcional)</label><input id="v_pot" inputmode="decimal" value="${esc(g('pot', ''))}"></div></div>
    <div class="form">${chk('cal', 'Calefacción eléctrica')}${chk('aire', 'Aire acondicionado')}${chk('sec', 'Secadora independiente')}${chk('aut', 'Automatización / gestión de energía')}${chk('ve', 'Recarga de vehículo eléctrico')}${chk('elec', 'Muchos electrodomésticos (circuito C4 adicional)')}</div>
    <details id="ldet"><summary>Longitudes por circuito (m al punto más alejado)</summary><div class="form" id="lg"></div><p class="muted mini">Por defecto se estima según la superficie. Cámbialas por las reales para comprobar la caída de tensión (máx. 3 %).</p></details>
    <div id="co" aria-live="polite"></div>`;
    let Ls = Object.assign({}, S.Ls || {}), claveL = '';
    const read = () => ({ sup: n0($('#v_sup').value, 0), pl: n0($('#v_pl').value, 0), tg: n0($('#v_tg').value, 0), tb: n0($('#v_tb').value, 0), acom: $('#v_acom').value, pot: n0($('#v_pot').value, 0), cal: $('#v_cal').checked, aire: $('#v_aire').checked, sec: $('#v_sec').checked, aut: $('#v_aut').checked, ve: $('#v_ve').checked, elec: $('#v_elec').checked, veIn: 32 });
    const go = () => {
      const v = read(); store.set('cuadro.viv', Object.assign({}, v, { Ls }));
      if (!(v.sup > 0 && v.pl > 0)) { $('#co').innerHTML = '<p class="muted">Introduce la superficie y los puntos de luz.</p>'; return; }
      const { elev, cs } = circuitosViv(v);
      const clave = cs.map(c => c.cod).join(',') + '|' + Math.round(v.sup);
      if (clave !== claveL) { claveL = clave; $('#lg').innerHTML = cs.map(c => `<div><label for="l_${c.cod}">${c.cod} · ${esc(c.n)}</label><input id="l_${c.cod}" data-c="${c.cod}" inputmode="decimal" value="${esc(Ls[c.cod] != null ? Ls[c.cod] : defL(v.sup))}"></div>`).join(''); $$('#lg input').forEach(i => i.oninput = () => { Ls[i.dataset.c] = n0(i.value, defL(v.sup)); go(); }); }
      cs.forEach(c => dim(c, 'mono', Ls[c.cod] != null ? Ls[c.cod] : defL(v.sup), 3));
      /* potencia, IGA y diferenciales */
      const Pmin = elev ? 9200 : 5750, P = Math.max(Pmin, v.pot || 0);
      const IGAn = Math.max(25, up(PIA, P / 230)), IDn = up(IDS, IGAn);
      const norm = cs.filter(c => !c.excl), ve = cs.filter(c => c.excl);
      const k = Math.ceil(norm.length / 5), por = Math.ceil(norm.length / k), grupos = [];
      for (let i = 0; i < k; i++) { const sl = norm.slice(i * por, (i + 1) * por); if (sl.length) grupos.push({ id: 'D' + (i + 1), nombre: sl.map(c => c.cod).join(' '), idIn: IDn, tipo: 'A', cs: sl }); }
      if (ve.length) grupos.push({ id: 'D' + (grupos.length + 1), nombre: 'C13 recarga VE (exclusivo)', idIn: up(IDS, ve[0].In), tipo: 'A', cs: ve });
      const spd = v.acom === 'aer' ? 'Tipo 2' : '';
      const m = montar({ cs, sis: 'mono', iga: { In: IGAn }, grupos, spd });
      /* materiales */
      const sum = k2 => cs.reduce((s, c) => s + (c[k2] || 0), 0);
      const pias = {}; cs.forEach(c => pias[c.In] = (pias[c.In] || 0) + 1);
      const ex = [];
      ex.push(['IGA', `Interruptor general automático 2P, ${IGAn} A, curva C, corte omnipolar con accionamiento manual, poder de corte ≥ 4.500 A y ≥ Icc del punto (ITC-BT-17, 1.3)`, '1 ud']);
      grupos.forEach(g2 => ex.push(['Diferencial ' + g2.id, `2P, ${g2.idIn} A, 30 mA, clase A`, '1 ud']));
      Object.keys(pias).sort((a, b) => a - b).forEach(i => ex.push(['PIA', `bipolar 2P (fase + neutro), ${i} A, curva C`, pias[i] + ' ud']));
      if (spd) ex.push(['Protector de sobretensiones', 'Transitorias 230 V, 1P+N, nivel de protección inferior a la tensión soportada de los equipos (ITC-BT-23)', '1 ud']);
      ex.push(['Caja de mando y protección', `Envolvente de ${m.caja} módulos (necesitas ${m.total}, con 20 % de reserva ${m.conReserva}), IP 30 e IK07 como mínimo, posición vertical, junto a la puerta de entrada y a 1,4–2 m del suelo, nunca en dormitorios ni baños (ITC-BT-17)`, '1 ud']);
      ex.push(['ICP y caja de ICP', `Interruptor de control de potencia según la potencia contratada, en su caja precintable (ITC-BT-17)`, '1 ud']);
      ex.push(['Borna de tierra', 'Pletina o bornas para unir los conductores de protección en el cuadro', '1 ud']);
      const luz = sum('luz'), tg = sum('tg'), tb = sum('tb');
      ex.push(['Puntos de luz', 'Cajas de techo/pared y portalámparas', fmt(v.pl, 0) + ' ud']);
      ex.push(['Interruptores y conmutadores 10 A', 'Como mínimo uno por punto de luz (los conmutados llevan dos)', '≥ ' + fmt(v.pl, 0) + ' ud']);
      ex.push(['Bases 16 A 2P+T (C2)', 'Tomas de uso general y frigorífico', fmt(tg, 0) + ' ud']);
      if (tb) ex.push(['Bases 16 A 2P+T (C5)', 'Baño y auxiliares de cocina', fmt(tb, 0) + ' ud']);
      ex.push(['Base 25 A 2P+T (C3)', 'Cocina / horno', sum('b25') + ' ud']);
      ex.push(['Bases 16 A (C4)', 'Lavadora, lavavajillas y termo, combinadas con fusible o PIA 16 A', sum('b16c') + ' ud']);
      if (sum('b16')) ex.push(['Base 16 A 2P+T (C10)', 'Secadora', sum('b16') + ' ud']);
      ex.push(['Timbre', 'Pulsador de timbre en el acceso y zumbador o timbre', '1 + 1 ud']);
      ex.push(['Cajas de mecanismo y derivación', 'Una por mecanismo, más las cajas de registro', '—']);
      const mat = materiales(cs, ex);
      const dUmax = Math.max.apply(null, cs.map(c => c.dUp || 0));
      $('#co').innerHTML = `<div class="result"><div class="big">${elev ? 'Electrificación ELEVADA' : 'Electrificación BÁSICA'}</div>
        <div class="kv"><div><b>Potencia mínima</b><span>${fmt(Pmin, 0)} W${v.pot > Pmin ? ' · usas ' + fmt(v.pot, 0) + ' W' : ''}</span></div><div><b>IGA</b><span>${IGAn} A (2P)</span></div><div><b>Diferenciales</b><span>${grupos.length} de 30 mA</span></div><div><b>Circuitos</b><span>${cs.length}</span></div><div><b>Caída máx.</b><span>${fmt(dUmax, 2)} %</span></div></div></div>
      <h2>Cuadro simulado</h2><div class="card">${m.svg}<p class="muted mini">${m.total} módulos en ${m.filas} fila${m.filas > 1 ? 's' : ''} de 12. Cada diferencial protege hasta 5 circuitos (ITC-BT-25). Los módulos reales miden 17,5 mm; el dibujo es esquemático.</p></div>
      <h2>Circuitos</h2>${tabla(['Circuito', 'Uso', 'PIA', 'Cable', 'Tubo', 'L', 'ΔU'], cs.map(c => [c.cod, esc(c.n), c.In + ' A', c.S + ' mm²', 'Ø ' + c.tubo, c.L + ' m', c.ok ? fmt(c.dUp, 2) + ' %' : '✖ no cumple']))}
      <h2>Qué lleva el cuadro</h2><ul>
        <li><b>IGA ${IGAn} A</b> de corte omnipolar, independiente del ICP (ITC-BT-25, apartado 2.1; mínimo 25 A).</li>
        <li><b>${grupos.length} diferencial${grupos.length > 1 ? 'es' : ''} de 30 mA</b> de ${IDn} A o más (intensidad igual o mayor que la del IGA). Uno por cada 5 circuitos como máximo.${ve.length ? ' C13 lleva un diferencial exclusivo de 30 mA clase A (ITC-BT-52).' : ''}</li>
        <li><b>Un PIA bipolar por circuito</b>: corta fase y neutro (corte omnipolar) y protege contra sobrecargas y cortocircuitos (ITC-BT-25, 2.3).</li>
        <li><b>Sobretensiones:</b> ${spd ? 'línea aérea, protección necesaria en el origen (ITC-BT-23, 3.2).' : 'red subterránea: situación natural, no exigida; recomendable si hay equipos sensibles (ITC-BT-23, 3.1).'}</li>${ve.length ? '<li><b>C13:</b> en vivienda unifamiliar; se parte de 32 A como dato editable y la ITC-BT-52 fija la potencia y las bases según el modo de carga. En aparcamientos colectivos se sustituye por los esquemas de la ITC-BT-52.</li>' : ''}</ul>
      <h2>Materiales</h2>${tabla(['Material', 'Detalle', 'Cantidad'], mat)}${nota}
      <p class="muted mini">Sección mínima según tabla 1 de la ITC-BT-25 y caída de tensión ≤ 3 % calculada con la intensidad del PIA (cobre, PVC, tubo empotrado). El poder de corte y la curva dependen de la Icc del punto: confirma con la distribuidora.</p>`;
      publicar({ kind: 'viv', sis: 'mono', iga: IGAn, grupos, spd, cs, elev, nombre: 'Vivienda ' + (elev ? 'elevada' : 'básica') });
    };
    $$('.form input,.form select').forEach(i => { if (!i.closest('#lg')) i.oninput = i.onchange = go; }); go();
  });

  /* =====================================================================
     LOCAL
     ===================================================================== */
  const nom0 = { com: 'Local comercial', pub: 'Local de pública concurrencia', ind: 'Industria o taller' };
  const TIPOS = { com: ['Local comercial u oficina', 100, 3450], pub: ['Local de pública concurrencia', 100, 3450], ind: ['Industria o taller', 125, 10350] };
  route(/^#\/cuadro\/local$/, () => {
    const S = store.get('cuadro.loc', {}); const g = (k, d) => (S[k] !== undefined ? S[k] : d);
    const inp = (k, l, d) => `<div><label for="o_${k}">${l}</label><input id="o_${k}" inputmode="decimal" value="${esc(g(k, d))}"></div>`;
    const sel = (k, l, opts, d) => `<div><label for="o_${k}">${l}</label><select id="o_${k}">${opts.map(([v, t]) => `<option value="${v}" ${String(g(k, d)) === String(v) ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;
    view.innerHTML = `<p class="mini"><a href="#/calcular">&larr; Calcular</a></p><h1>Cuadro de local</h1><p class="lead">Previsión de cargas del local (ITC-BT-10), circuitos, IGA, diferenciales, protecciones, emergencia, sobretensiones y materiales, con el cuadro dibujado.</p>
    <div class="form">${sel('tipo', 'Tipo de local', Object.entries(TIPOS).map(([k, t]) => [k, t[0]]), 'com')}${inp('sup', 'Superficie (m²)', 80)}${inp('pl', 'Plantas', 1)}${sel('sis', 'Alimentación', [['mono', 'Monofásica 230 V'], ['tri', 'Trifásica 400 V']], 'mono')}${sel('acom', 'Red de entrada', [['sub', 'Subterránea'], ['aer', 'Línea aérea']], 'sub')}
    ${inp('pal', 'Potencia de alumbrado (W)', 1200)}${inp('nlum', 'Nº de luminarias', 30)}${inp('ntc', 'Nº de tomas de corriente 16 A', 16)}${inp('pcl', 'Climatización (W)', 3500)}${inp('pes', 'Otras cargas fijas (W): cámaras, hornos…', 0)}${inp('nem', 'Aparatos de emergencia', 4)}${inp('fs', 'Simultaneidad de la carga instalada (0–1)', 0.7)}</div>
    <div class="check" style="border:0;align-items:center"><input type="checkbox" id="o_desc" ${g('desc', false) ? 'checked' : ''}><label for="o_desc" style="margin:0;font-size:14px">Lámparas de descarga (cables al 180 %, ITC-BT-44)</label></div>
    <div id="co" aria-live="polite"></div>`;
    const go = () => {
      const t = TIPOS[$('#o_tipo').value];
      const v = { tipo: $('#o_tipo').value, sup: n0($('#o_sup').value, 0), pl: Math.max(1, n0($('#o_pl').value, 1)), sis: $('#o_sis').value, acom: $('#o_acom').value, pal: n0($('#o_pal').value, 0), nlum: n0($('#o_nlum').value, 0), ntc: n0($('#o_ntc').value, 0), pcl: n0($('#o_pcl').value, 0), pes: n0($('#o_pes').value, 0), nem: n0($('#o_nem').value, 0), fs: Math.min(1, Math.max(0.1, n0($('#o_fs').value, 0.7))), desc: $('#o_desc').checked };
      store.set('cuadro.loc', v);
      if (!(v.sup > 0)) { $('#co').innerHTML = '<p class="muted">Introduce la superficie.</p>'; return; }
      const tri = v.sis === 'tri', sis = tri ? 'tri' : 'mono', U = tri ? 400 : 230, k3 = tri ? Math.sqrt(3) : 1, L0 = Math.round(Math.sqrt(v.sup) * 1.4 + 4);
      const cs = [], add = (cod, n, P, grp, lim, Smin, tipo, extra) => { const monoP = (tipo === 'tri3') ? 'tri' : 'mono'; const Ib = monoP === 'tri' ? P / (Math.sqrt(3) * 400) : P / 230; const In = up(PIA, Ib); cs.push(Object.assign({ cod, n, P, Ib, In, S: Smin, grp, pol: monoP === 'tri' ? '3P+N' : '1P+N', tubo: 20 }, extra || {})); const c = cs[cs.length - 1]; dim(c, monoP, L0, lim, true); if (monoP === 'tri') c.sis = 'tri'; };
      /* alumbrado */
      const pal = v.pal * (v.desc ? 1.8 : 1), nAl = Math.max(v.pal > 0 ? 1 : 0, Math.ceil(pal / 2300));
      for (let i = 0; i < nAl; i++) add('AL' + (i + 1), 'Alumbrado general', pal / nAl, 'AL', 3, 1.5, 'mono', { luz: Math.ceil(v.nlum / nAl) });
      if (v.nem > 0) add('EM', 'Alumbrado de emergencia', 1500, 'EM', 3, 1.5, 'mono', { em: v.nem });
      const nTc = v.ntc > 0 ? Math.ceil(v.ntc / 10) : 0;
      for (let i = 0; i < nTc; i++) add('TC' + (i + 1), 'Tomas de uso general', 3680, 'TC', 5, 2.5, 'mono', { tg: Math.ceil(v.ntc / nTc) });
      if (v.pcl > 0) { const t3 = tri && v.pcl > 5750; add('CL', 'Climatización', v.pcl, 'CL', 5, t3 ? 2.5 : 2.5, t3 ? 'tri3' : 'mono', { cl: 1 }); }
      if (v.pes > 0) { const t3 = tri && v.pes > 5750; add('OC', 'Otras cargas fijas', v.pes, 'CL', 5, 2.5, t3 ? 'tri3' : 'mono', { oc: 1 }); }
      /* fases para los monofásicos en trifásica */
      if (tri) { const ph = [0, 0, 0]; cs.filter(c => c.sis !== 'tri').sort((a, b) => b.Ib - a.Ib).forEach(c => { const i = ph.indexOf(Math.min.apply(null, ph)); ph[i] += c.Ib; c.fase = 'L' + (i + 1); }); }
      /* carga y IGA */
      const Pmin = Math.max(t[1] * v.sup * v.pl, t[2]), Pinst = cs.reduce((s, c) => s + c.P, 0), Pprev = Math.max(Pmin, Pinst * v.fs);
      const Itot = Pprev / (k3 * U), IGAn = up(PIA.concat([80, 100, 125]), Itot), maxPia = Math.max.apply(null, cs.map(c => c.In).concat([0])), IGA = Math.max(IGAn, maxPia), IDn = up(IDS.concat([125]), IGA);
      const nom = { AL: 'Alumbrado', EM: 'Emergencia', TC: 'Tomas', CL: 'Climatización y cargas' }, grupos = [];
      ['AL', 'EM', 'TC', 'CL'].forEach((gk, i) => { const sl = cs.filter(c => c.grp === gk); if (sl.length) grupos.push({ id: 'D' + (grupos.length + 1), nombre: nom[gk], idIn: IDn, tipo: 'A', cs: sl }); });
      const spd = v.acom === 'aer' ? 'Tipo 2' : '';
      const m = montar({ cs, sis, iga: { In: IGA }, grupos, spd });
      const pol = tri ? '4P' : '2P';
      const pias = {}; cs.forEach(c => { const k2 = c.pol + ' ' + c.In; pias[k2] = (pias[k2] || 0) + 1; });
      const ex = [['IGA', `Interruptor general automático ${pol}, ${IGA} A, curva C, corte omnipolar, poder de corte ≥ 4.500 A y ≥ Icc del punto (ITC-BT-17, 1.3)`, '1 ud']];
      grupos.forEach(g2 => ex.push(['Diferencial ' + g2.id, `${pol}, ${g2.idIn} A, 30 mA, clase A (${g2.nombre.toLowerCase()})`, '1 ud']));
      Object.keys(pias).sort().forEach(k2 => ex.push(['PIA', `${k2.split(' ')[0] === '3P+N' ? 'tetrapolar 4P' : 'bipolar 2P (fase + neutro)'}, ${k2.split(' ')[1]} A, curva C`, pias[k2] + ' ud']));
      if (spd) ex.push(['Protector de sobretensiones', `${tri ? '3P+N' : '1P+N'}, transitorias, nivel de protección inferior a la tensión soportada de los equipos (ITC-BT-23)`, '1 ud']);
      ex.push(['Caja de mando y protección', `Envolvente de ${m.caja} módulos (necesitas ${m.total}, con reserva ${m.conReserva}), IP 30 e IK07 como mínimo, lo más próxima posible a una puerta de entrada, a 1 m o más del suelo y no accesible al público (ITC-BT-17)`, '1 ud']);
      ex.push(['Borna de tierra', 'Pletina de tierra y conductor de protección del cuadro', '1 ud']);
      ex.push(['Luminarias', 'Según tu proyecto de iluminación', fmt(v.nlum, 0) + ' ud']);
      if (v.ntc) ex.push(['Bases 16 A 2P+T', 'Tomas de uso general', fmt(v.ntc, 0) + ' ud']);
      if (v.nem) ex.push(['Aparatos autónomos de emergencia', 'Evacuación: 1 lux mínimo en el eje de los pasos, 5 lux en cuadros y medios de protección (ITC-BT-28)', fmt(v.nem, 0) + ' ud']);
      ex.push(['Interruptores y pulsadores', 'Según los puntos de mando de tu distribución', '—']);
      ex.push(['Cajas de mecanismo y derivación', 'Una por mecanismo, más las de registro', '—']);
      const mat = materiales(cs, ex);
      const pc = v.tipo === 'pub';
      const notas = [`<li><b>Previsión de cargas (ITC-BT-10):</b> mínimo ${t[1]} W por m² y planta = ${fmt(t[1] * v.sup * v.pl, 0)} W, con un mínimo por local de ${fmt(t[2], 0)} W a 230 V. Usas <b>${fmt(Pprev, 0)} W</b> (${fmt(Itot, 1)} A) para el IGA.</li>`,
        `<li><b>Caída de tensión (ITC-BT-19):</b> 3 % en alumbrado y 5 % en los demás usos, calculada con la intensidad del PIA.</li>`,
        `<li><b>Sobretensiones:</b> ${spd ? 'línea aérea: protección necesaria en el origen (ITC-BT-23, 3.2).' : 'red subterránea: situación natural, no exigida; recomendable con equipos sensibles (ITC-BT-23, 3.1).'}</li>`,
        pc ? '<li><b>Pública concurrencia (ITC-BT-28):</b> todos los locales de pública concurrencia deben tener alumbrado de emergencia, y las instalaciones y el cuadro deben estudiarse con el proyecto o la memoria técnica que corresponda.</li>' : '',
        v.desc ? '<li>Lámparas de descarga: se ha tomado 1,8 × la potencia para dimensionar los circuitos (ITC-BT-44).</li>' : '',
        '<li><b>Criterio de proyecto, no del REBT:</b> un diferencial por función (alumbrado, emergencia, tomas, climatización) para que un fallo no deje todo sin luz, tomas con 10 por circuito y simultaneidad ' + fmt(v.fs, 2) + '. Cámbialos según tu caso.</li>'].join('');
      $('#co').innerHTML = `<div class="result"><div class="big">${fmt(Pprev / 1000, 2)} kW · IGA ${IGA} A ${pol}</div>
        <div class="kv"><div><b>Carga mínima ITC-BT-10</b><span>${fmt(Pmin, 0)} W</span></div><div><b>Carga instalada</b><span>${fmt(Pinst, 0)} W</span></div><div><b>Intensidad</b><span>${fmt(Itot, 1)} A</span></div><div><b>Diferenciales</b><span>${grupos.length} de 30 mA</span></div><div><b>Circuitos</b><span>${cs.length}</span></div></div></div>
      <h2>Cuadro simulado</h2><div class="card">${m.svg}<p class="muted mini">${m.total} módulos en ${m.filas} fila${m.filas > 1 ? 's' : ''} de 12. ${tri ? 'Los circuitos monofásicos se reparten entre fases: ' + cs.filter(c => c.fase).map(c => c.cod + ' en ' + c.fase).join(', ') + '.' : ''} Dibujo esquemático.</p></div>
      <h2>Circuitos</h2>${tabla(['Circuito', 'Uso', 'PIA', 'Cable', 'Tubo', 'ΔU'], cs.map(c => [c.cod, esc(c.n) + (c.fase ? ' · ' + c.fase : ''), c.pol + ' ' + c.In + ' A', c.S + ' mm²', 'Ø ' + c.tubo, c.ok ? fmt(c.dUp, 2) + ' % (≤ ' + c.lim + ')' : '✖ no cumple']))}
      <h2>Qué lleva el cuadro</h2><ul>${notas}</ul>
      <h2>Materiales</h2>${tabla(['Material', 'Detalle', 'Cantidad'], mat)}${nota}`;
      publicar({ kind: 'loc', sis, iga: IGA, grupos, spd, cs, nombre: nom0[v.tipo] });
    };
    $$('.form input,.form select,#o_desc').forEach(i => i.oninput = i.onchange = go); go();
  });
});
