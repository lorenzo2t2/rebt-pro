/* Obras y clientes: agrupa esquemas, documentos, presupuestos y fotos de cada obra, con firma en pantalla y dossier en PDF. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, view, $, $$ } = A;
  const uid = () => 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const list = () => store.get('obras', []);
  const saveList = a => { try { store.set('obras', a); return true; } catch (e) { return false; } };
  const ESTADOS = ['Presupuesto', 'En ejecución', 'Terminada', 'Facturada'];

  /* Reduce una foto a ~900 px y JPEG para no llenar el almacenamiento del dispositivo */
  function reducir(file) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => { const k = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.7)); };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('imagen')); }; img.src = url;
    });
  }
  const kb = () => { try { return Math.round(JSON.stringify(localStorage).length / 1024); } catch (e) { return 0; } };

  route(/^#\/obras$/, () => {
    const a = list().sort((x, y) => y.mod - x.mod);
    view.innerHTML = `<h1>Obras y clientes</h1><p class="lead">Agrupa en una obra sus esquemas, documentos, presupuestos y fotos; recoge la firma del cliente en pantalla y genera el dossier en PDF. Todo se guarda en este dispositivo.</p>
    <div class="row"><button class="btn pri" id="no">Nueva obra</button></div>
    <h2>Mis obras <span class="muted" style="font-size:14px">${a.length}</span></h2>
    ${a.length ? a.map(o => `<div class="dl"><span style="font-size:22px">🏗️</span><b><a href="#/obras/${o.id}" style="color:inherit;text-decoration:none">${esc(o.nombre)}</a><br><span class="muted" style="font-weight:500;font-size:13px">${esc(o.cliente || 'Sin cliente')} · ${esc(o.estado)}</span></b><a class="btn sm pri" href="#/obras/${o.id}">Abrir</a><button class="btn sm" data-del="${o.id}">Borrar</button></div>`).join('') : '<p class="muted">Aún no tienes obras.</p>'}`;
    $('#no').onclick = () => { const o = { id: uid(), nombre: 'Obra nueva', cliente: '', tel: '', dir: '', estado: ESTADOS[0], notas: '', esq: [], docs: [], pres: [], fotos: [], mod: Date.now() }; const l = list(); l.push(o); saveList(l); location.hash = '#/obras/' + o.id; };
    $$('[data-del]').forEach(b => b.onclick = () => { if (confirm('¿Borrar la obra? Se pierden sus fotos y la firma; los esquemas y documentos enlazados no se borran.')) { saveList(list().filter(x => x.id !== b.dataset.del)); A.go(); } });
  });

  route(/^#\/obras\/(o[\w]+)$/, id => {
    const o = list().find(x => x.id === id); if (!o) { view.innerHTML = '<p>No encontrada. <a href="#/obras">Volver</a></p>'; return; }
    const save = () => { o.mod = Date.now(); const l = list(), i = l.findIndex(x => x.id === o.id); if (i >= 0) { l[i] = o; if (!saveList(l)) alert('No hay espacio en el dispositivo. Borra fotos o exporta y elimina obras antiguas.'); } };
    const emp = store.get('perfil', {}) || {};
    const SRC = { esq: ['Esquemas', store.get('esquemas', []), '#/esquemas/'], docs: ['Documentos', store.get('docs', []), '#/crear/'], pres: ['Presupuestos', store.get('presupuestos', []), '#/presupuesto/'] };
    const draw = () => {
      view.innerHTML = `<div class="row noprint" style="margin-bottom:10px"><a class="btn sm" href="#/obras">← Obras</a><span class="sp"></span><button class="btn sm pri" id="pdf">🖨️ Dossier PDF</button></div>
      <div class="noprint"><h1>${esc(o.nombre)}</h1>
      <div class="form"><div><label for="o_n">Nombre de la obra</label><input id="o_n" value="${esc(o.nombre)}"></div><div><label for="o_c">Cliente</label><input id="o_c" value="${esc(o.cliente)}"></div><div><label for="o_t">Teléfono</label><input id="o_t" value="${esc(o.tel)}" inputmode="tel"></div><div><label for="o_d">Dirección</label><input id="o_d" value="${esc(o.dir)}"></div>
      <div><label for="o_e">Estado</label><select id="o_e">${ESTADOS.map(e => `<option ${o.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select></div></div>
      <div><label for="o_no">Notas</label><textarea id="o_no" rows="3" style="width:100%">${esc(o.notas)}</textarea></div>
      ${Object.entries(SRC).map(([k, [t, arr, base]]) => `<h2>${t}</h2>${o[k].map(i => { const x = arr.find(y => y.id === i); return x ? `<div class="dl"><b><a href="${base}${x.id}" style="color:inherit">${esc(x.nombre)}</a></b><button class="btn sm" data-q="${k}:${i}">Quitar</button></div>` : ''; }).join('')}<div class="row"><select data-a="${k}" aria-label="Añadir ${t}" style="flex:1"><option value="">Añadir…</option>${arr.filter(y => !o[k].includes(y.id)).map(y => `<option value="${y.id}">${esc(y.nombre)}</option>`).join('')}</select></div>`).join('')}
      <h2>Fotos <span class="muted" style="font-size:14px">${o.fotos.length}</span></h2>
      <label class="btn" style="cursor:pointer;display:inline-block">📷 Hacer o añadir foto<input id="o_f" type="file" accept="image/*" capture="environment" hidden multiple></label>
      <div class="grid g3" style="margin-top:10px">${o.fotos.map((f, k) => `<div class="card" style="padding:8px"><img src="${f.d}" alt="${esc(f.n || 'Foto de obra')}" style="width:100%;border-radius:8px"><div class="row" style="margin-top:6px"><input data-fn="${k}" value="${esc(f.n || '')}" placeholder="Descripción" style="flex:1"><button class="btn sm" data-fx="${k}" aria-label="Borrar foto">✕</button></div></div>`).join('')}</div>
      <p class="muted mini">Almacenamiento usado en este dispositivo: ${kb()} KB (el límite habitual del navegador ronda los 5 000 KB). Las fotos se reducen a 900 px.</p>
      <h2>Firma del cliente</h2>
      <div class="card"><div class="row"><input id="o_fi" value="${esc(o.firmante || '')}" placeholder="Nombre de quien firma" style="flex:1"></div>
      <canvas id="sg" width="600" height="200" style="width:100%;max-width:600px;height:auto;background:#fff;border-radius:10px;touch-action:none;margin-top:8px;border:1px solid var(--line)"></canvas>
      <div class="row" style="margin-top:8px"><button class="btn sm pri" id="sg_s">Guardar firma</button><button class="btn sm" id="sg_c">Borrar</button></div>
      ${o.firma ? `<p class="muted mini">Firma guardada ${esc(o.firmaFecha || '')}.</p>` : ''}</div></div>
      <div class="dossier">${dossier()}</div>`;
      bind();
    };
    function dossier() {
      const esq = o.esq.map(i => (store.get('esquemas', []).find(x => x.id === i))).filter(Boolean);
      return `<h1>${esc(o.nombre)}</h1><p>${esc(emp.empresa || '')} ${emp.nif ? '· NIF ' + esc(emp.nif) : ''} ${emp.instalador ? '· Instalador: ' + esc(emp.instalador) : ''}</p>
      <p><b>Cliente:</b> ${esc(o.cliente)} ${o.tel ? '· ' + esc(o.tel) : ''}<br><b>Dirección:</b> ${esc(o.dir)}<br><b>Estado:</b> ${esc(o.estado)}</p>${o.notas ? `<p>${esc(o.notas).replace(/\n/g, '<br>')}</p>` : ''}
      ${['docs', 'pres'].map(k => { const [t, arr] = SRC[k]; const it = o[k].map(i => arr.find(y => y.id === i)).filter(Boolean); return it.length ? `<h2>${t}</h2><ul>${it.map(x => `<li>${esc(x.nombre)}</li>`).join('')}</ul>` : ''; }).join('')}
      ${esq.length ? `<h2>Esquemas</h2>${esq.map(m => `<div style="page-break-inside:avoid"><h3>${esc(m.nombre)}</h3><div style="max-width:100%">${window.REBTEsqSVG ? window.REBTEsqSVG(m).replace(/ width="\d+" height="\d+"/, ' style="width:100%;height:auto"') : ''}</div></div>`).join('')}` : ''}
      ${o.fotos.length ? `<h2>Fotos</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${o.fotos.map(f => `<figure style="margin:0;page-break-inside:avoid"><img src="${f.d}" style="width:100%" alt=""><figcaption>${esc(f.n || '')}</figcaption></figure>`).join('')}</div>` : ''}
      ${o.firma ? `<h2>Conformidad del cliente</h2><img src="${o.firma}" alt="Firma" style="max-width:300px;background:#fff"><p>${esc(o.firmante || '')} · ${esc(o.firmaFecha || '')}</p>` : ''}`;
    }
    function bind() {
      [['o_n', 'nombre'], ['o_c', 'cliente'], ['o_t', 'tel'], ['o_d', 'dir'], ['o_no', 'notas']].forEach(([i, k]) => $('#' + i).oninput = e => { o[k] = e.target.value; save(); });
      $('#o_e').onchange = e => { o.estado = e.target.value; save(); };
      $$('[data-a]').forEach(s => s.onchange = () => { if (s.value) { o[s.dataset.a].push(s.value); save(); draw(); } });
      $$('[data-q]').forEach(b => b.onclick = () => { const [k, i] = b.dataset.q.split(':'); o[k] = o[k].filter(x => x !== i); save(); draw(); });
      $('#o_f').onchange = async e => { for (const f of e.target.files) { try { o.fotos.push({ id: uid(), d: await reducir(f), n: '', fecha: Date.now() }); } catch (x) { /* imagen no válida */ } } save(); draw(); };
      $$('[data-fn]').forEach(i => i.oninput = () => { o.fotos[+i.dataset.fn].n = i.value; save(); });
      $$('[data-fx]').forEach(b => b.onclick = () => { o.fotos.splice(+b.dataset.fx, 1); save(); draw(); });
      $('#pdf').onclick = () => { document.title = o.nombre; setTimeout(() => window.print(), 50); };
      /* firma */
      const cv = $('#sg'), x = cv.getContext('2d'); x.lineWidth = 3; x.lineCap = 'round'; x.strokeStyle = '#111'; let dw = false, dirty = false;
      if (o.firma) { const im = new Image(); im.onload = () => x.drawImage(im, 0, 0, cv.width, cv.height); im.src = o.firma; }
      const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
      cv.onpointerdown = e => { dw = true; dirty = true; const p = pt(e); x.beginPath(); x.moveTo(p[0], p[1]); cv.setPointerCapture(e.pointerId); };
      cv.onpointermove = e => { if (!dw) return; const p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); };
      cv.onpointerup = cv.onpointercancel = () => { dw = false; };
      $('#sg_c').onclick = () => { x.clearRect(0, 0, cv.width, cv.height); o.firma = ''; o.firmaFecha = ''; save(); dirty = false; };
      $('#sg_s').onclick = () => { if (!dirty && !o.firma) return; o.firma = cv.toDataURL('image/png'); o.firmante = $('#o_fi').value; o.firmaFecha = new Date().toLocaleDateString('es-ES'); save(); draw(); };
    }
    draw();
  });
});
