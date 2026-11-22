/* Cubicación y presupuesto: materiales por estancias o sacados de un esquema, mano de obra, IVA y documento imprimible.
   No incluye precios de mercado: cada precio lo pones tú y la app lo recuerda. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, view, $, $$ } = A;
  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const list = () => store.get('presupuestos', []);
  const saveList = a => store.set('presupuestos', a);
  const precios = () => store.get('precios', {});
  const eur = n => (isFinite(n) ? n : 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; };

  /* Catálogo base: descripciones y unidades, sin precio */
  const CAT = ['Magnetotérmico 1P+N 10 A', 'Magnetotérmico 1P+N 16 A', 'Magnetotérmico 1P+N 20 A', 'Magnetotérmico 1P+N 25 A', 'Diferencial 2P 40 A 30 mA tipo A', 'Interruptor general 2P 25 A', 'Limitador de sobretensiones', 'Cuadro empotrar 12 módulos', 'Cable H07V-K 1,5 mm² (m)', 'Cable H07V-K 2,5 mm² (m)', 'Cable H07V-K 4 mm² (m)', 'Cable H07V-K 6 mm² (m)', 'Tubo corrugado M20 (m)', 'Tubo corrugado M25 (m)', 'Caja de registro', 'Interruptor', 'Conmutador', 'Base de enchufe 16 A', 'Base de enchufe 25 A', 'Toma TV', 'Toma RJ45', 'Punto de luz / portalámparas', 'Pica de tierra', 'Cable de tierra 16 mm² (m)', 'Material auxiliar y pequeño material'];
  /* Elementos habituales por estancia: punto de partida editable, no el mínimo reglamentario */
  const ROOMS = {
    'Dormitorio': { luz: 1, int: 1, toma: 3 }, 'Salón': { luz: 2, int: 2, toma: 5, tv: 1, rj: 1 }, 'Cocina': { luz: 2, int: 1, toma: 8, c3: 1 },
    'Baño': { luz: 2, int: 1, toma: 1 }, 'Pasillo': { luz: 2, int: 2, toma: 1 }, 'Terraza': { luz: 1, int: 1, toma: 1 }, 'Garaje': { luz: 2, int: 1, toma: 2 },
  };
  const LAB = { luz: 'Punto de luz / portalámparas', int: 'Interruptor', toma: 'Base de enchufe 16 A', tv: 'Toma TV', rj: 'Toma RJ45', c3: 'Base de enchufe 25 A' };
  /* Equivalencia símbolo → material (cubicación de un esquema) */
  const MAT = { pia: s => 'Magnetotérmico ' + (s || ''), dif: s => 'Diferencial ' + (s || ''), icp: () => 'Interruptor de control de potencia', igm: s => 'Interruptor general ' + (s || ''), secc: () => 'Seccionador / interruptor', fus: () => 'Fusible con base', spd: () => 'Limitador de sobretensiones', cont2: () => 'Contactor', term: () => 'Relé térmico', cna: () => 'Contacto auxiliar', pna: () => 'Pulsador', pnc: () => 'Pulsador', bob: () => 'Bobina de contactor', temp: () => 'Temporizador', piloto: () => 'Piloto de señalización', motor: () => 'Motor (según potencia)', mot3: () => 'Motor trifásico', lamp: () => 'Punto de luz', toma: () => 'Base de enchufe', tomap: () => 'Base de enchufe', sw1: () => 'Interruptor', sw2: () => 'Conmutador', swc: () => 'Conmutador de cruzamiento', foco: () => 'Luminaria', evse: () => 'Punto de recarga VE', inv: () => 'Inversor', pv: () => 'Módulos fotovoltaicos', tierra: () => 'Pica / toma de tierra', sec3: () => 'Seccionador tripolar', con3: () => 'Contactor tripolar', fus3: () => 'Juego de 3 fusibles', term3: () => 'Relé térmico tripolar', vfd: () => 'Variador de frecuencia', sst: () => 'Arrancador estático', gm: () => 'Guardamotor', gm3: () => 'Guardamotor tripolar', pia3: () => 'Magnetotérmico tripolar', cap: () => 'Condensador' };

  function bomEsquema(m) {
    const acc = {};
    m.els.forEach(e => { const f = MAT[e.t]; if (!f) return; const d = f(e.sub || '').trim(); acc[d] = (acc[d] || 0) + 1; });
    const cables = m.wires.filter(w => w.label && /mm/.test(w.label)).map(w => 'Cable ' + w.label);
    cables.forEach(c => { acc[c] = (acc[c] || 0) + 1; });
    return Object.entries(acc).map(([d, q]) => ({ d, u: 'ud', q, p: precios()[d] || 0 }));
  }
  const totals = p => {
    const mat = p.items.reduce((s, i) => s + num(i.q) * num(i.p), 0), mo = num(p.horas) * num(p.tarifa), sub = (mat + mo), mar = sub * num(p.margen) / 100, base = sub + mar, iva = base * num(p.iva) / 100;
    return { mat, mo, sub, mar, base, iva, total: base + iva };
  };

  route(/^#\/presupuesto$/, () => {
    const a = list().sort((x, y) => y.mod - x.mod);
    view.innerHTML = `<h1>Presupuestos y cubicación</h1><p class="lead">Calcula materiales por estancias o desde un esquema, añade mano de obra e IVA y saca un documento para el cliente. Los precios los pones tú; la app los recuerda para la próxima vez.</p>
    <div class="row"><button class="btn pri" id="np">Nuevo presupuesto</button></div>
    <h2>Mis presupuestos <span class="muted" style="font-size:14px">${a.length}</span></h2>
    ${a.length ? a.map(p => `<div class="dl"><span style="font-size:22px">🧾</span><b><a href="#/presupuesto/${p.id}" style="color:inherit;text-decoration:none">${esc(p.nombre)}</a><br><span class="muted" style="font-weight:500;font-size:13px">${esc(p.cliente || 'Sin cliente')} · ${eur(totals(p).total)}</span></b><a class="btn sm pri" href="#/presupuesto/${p.id}">Abrir</a><button class="btn sm" data-del="${p.id}">Borrar</button></div>`).join('') : '<p class="muted">Aún no tienes presupuestos.</p>'}`;
    $('#np').onclick = () => { const p = { id: uid(), nombre: 'Presupuesto nuevo', cliente: '', items: [], horas: 0, tarifa: store.get('tarifa', 35), margen: 0, iva: 21, mod: Date.now() }; const l = list(); l.push(p); saveList(l); location.hash = '#/presupuesto/' + p.id; };
    $$('[data-del]').forEach(b => b.onclick = () => { if (confirm('¿Borrar este presupuesto?')) { saveList(list().filter(x => x.id !== b.dataset.del)); A.go(); } });
  });

  route(/^#\/presupuesto\/(p[\w]+)$/, id => {
    const p = list().find(x => x.id === id); if (!p) { view.innerHTML = '<p>No encontrado. <a href="#/presupuesto">Volver</a></p>'; return; }
    const save = () => { p.mod = Date.now(); const l = list(), i = l.findIndex(x => x.id === p.id); if (i >= 0) { l[i] = p; saveList(l); } };
    const emp = store.get('perfil', {}) || {};
    const esqs = store.get('esquemas', []);
    const draw = () => {
      const t = totals(p);
      view.innerHTML = `<div class="row noprint" style="margin-bottom:10px"><a class="btn sm" href="#/presupuesto">← Presupuestos</a><input id="pn" value="${esc(p.nombre)}" style="flex:1;max-width:320px;font-weight:700" aria-label="Nombre"><span class="sp"></span><button class="btn sm pri" id="pr">🖨️ Imprimir / PDF</button></div>
      <div class="grid g2 noprint"><div class="card"><h3>Estancias</h3><p>Añade las estancias de la vivienda; se calculan los elementos habituales (punto de partida, ajústalos).</p>
        <div class="chips" style="margin-top:8px">${Object.keys(ROOMS).map(r => `<button class="chip" data-r="${r}">+ ${r}</button>`).join('')}</div></div>
        <div class="card"><h3>Desde un esquema</h3><p>Cubica los elementos y cables etiquetados de un esquema.</p>
        <div class="row" style="margin-top:8px"><select id="es" aria-label="Esquema" style="flex:1"><option value="">Elige un esquema…</option>${esqs.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join('')}</select><button class="btn sm" id="ei">Importar</button></div></div></div>
      <div class="form noprint" style="margin-top:12px"><div><label for="pc">Cliente</label><input id="pc" value="${esc(p.cliente || '')}"></div><div><label for="pd">Dirección de la obra</label><input id="pd" value="${esc(p.dir || '')}"></div></div>
      <div class="tw"><table><thead><tr><th>Descripción</th><th style="width:60px">Ud</th><th style="width:80px">Cant.</th><th style="width:100px">Precio</th><th style="width:100px">Importe</th><th class="noprint" style="width:40px"></th></tr></thead><tbody id="tb">${p.items.map((i, k) => `<tr><td><input data-k="${k}" data-f="d" value="${esc(i.d)}" list="catl" style="width:100%"></td><td><input data-k="${k}" data-f="u" value="${esc(i.u)}" style="width:100%"></td><td><input data-k="${k}" data-f="q" value="${esc(i.q)}" inputmode="decimal" style="width:100%"></td><td><input data-k="${k}" data-f="p" value="${esc(i.p)}" inputmode="decimal" style="width:100%"></td><td id="im${k}" style="text-align:right">${eur(num(i.q) * num(i.p))}</td><td class="noprint"><button class="btn sm" data-x="${k}" aria-label="Quitar">✕</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted">Sin partidas. Añade estancias, importa un esquema o añade una línea.</td></tr>'}</tbody></table></div>
      <datalist id="catl">${CAT.map(c => `<option value="${esc(c)}">`).join('')}</datalist>
      <div class="row noprint" style="margin:8px 0"><button class="btn sm" id="al">+ Línea</button></div>
      <div class="form"><div><label for="ph">Horas de mano de obra</label><input id="ph" value="${esc(p.horas)}" inputmode="decimal"></div><div><label for="pt">Tarifa (€/h)</label><input id="pt" value="${esc(p.tarifa)}" inputmode="decimal"></div><div><label for="pm">Margen (%)</label><input id="pm" value="${esc(p.margen)}" inputmode="decimal"></div><div><label for="pi">IVA (%)</label><input id="pi" value="${esc(p.iva)}" inputmode="decimal"></div></div>
      <div class="result" id="tot">${kv(t)}</div>
      <p class="muted mini noprint">El tipo de IVA depende de la obra y del cliente: confírmalo con tu gestor. No se incluyen precios de mercado.</p>
      <div class="paper-only"><p class="mini">${esc(emp.empresa || '')} ${emp.nif ? '· NIF ' + esc(emp.nif) : ''}<br>Presupuesto válido 30 días. Los trabajos se ajustarán al REBT y a la normativa de la Junta de Andalucía.</p></div>`;
      bind();
    };
    const kv = t => `<div class="kv"><div><b>Materiales</b><span>${eur(t.mat)}</span></div><div><b>Mano de obra</b><span>${eur(t.mo)}</span></div><div><b>Margen</b><span>${eur(t.mar)}</span></div><div><b>Base imponible</b><span>${eur(t.base)}</span></div><div><b>IVA</b><span>${eur(t.iva)}</span></div></div><div class="big">${eur(t.total)}</div>`;
    const refresh = () => { $('#tot').innerHTML = kv(totals(p)); p.items.forEach((i, k) => { const c = $('#im' + k); if (c) c.textContent = eur(num(i.q) * num(i.p)); }); };
    const merge = rows => { rows.forEach(r => { const ex = p.items.find(i => i.d === r.d); if (ex) ex.q = num(ex.q) + num(r.q); else p.items.push(Object.assign({ u: 'ud', p: precios()[r.d] || 0 }, r)); }); save(); draw(); };
    function bind() {
      $('#pn').oninput = e => { p.nombre = e.target.value; save(); };
      $('#pc').oninput = e => { p.cliente = e.target.value; save(); }; $('#pd').oninput = e => { p.dir = e.target.value; save(); };
      $$('#tb input').forEach(inp => inp.oninput = () => {
        const it = p.items[+inp.dataset.k]; it[inp.dataset.f] = inp.value;
        if (inp.dataset.f === 'd' && precios()[inp.value] != null && !num(it.p)) { it.p = precios()[inp.value]; const pe = $(`[data-k="${inp.dataset.k}"][data-f="p"]`); if (pe) pe.value = it.p; }
        if (inp.dataset.f === 'p' && it.d) { const pr = precios(); pr[it.d] = num(inp.value); store.set('precios', pr); }
        refresh(); save();
      });
      $$('[data-x]').forEach(b => b.onclick = () => { p.items.splice(+b.dataset.x, 1); save(); draw(); });
      $('#al').onclick = () => { p.items.push({ d: '', u: 'ud', q: 1, p: 0 }); save(); draw(); };
      [['ph', 'horas'], ['pt', 'tarifa'], ['pm', 'margen'], ['pi', 'iva']].forEach(([i, k]) => $('#' + i).oninput = e => { p[k] = e.target.value; if (k === 'tarifa') store.set('tarifa', num(e.target.value)); refresh(); save(); });
      $$('[data-r]').forEach(b => b.onclick = () => { const R = ROOMS[b.dataset.r], rows = Object.entries(R).map(([k, q]) => ({ d: LAB[k], q })); const cab = Object.values(R).reduce((s, x) => s + x, 0); rows.push({ d: 'Cable H07V-K 2,5 mm² (m)', u: 'm', q: cab * 6 }, { d: 'Tubo corrugado M20 (m)', u: 'm', q: cab * 4 }, { d: 'Caja de registro', q: Math.ceil(cab / 2) }); merge(rows); });
      $('#ei').onclick = () => { const m = esqs.find(e => e.id === $('#es').value); if (m) merge(bomEsquema(m)); };
      $('#pr').onclick = () => { document.title = p.nombre; setTimeout(() => window.print(), 50); };
    }
    draw();
  });
  window.REBTBomEsquema = bomEsquema;
});
