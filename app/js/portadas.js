/* Portadas alternativas (estilos Control, Consola y Limpia). Solo datos reales de la app. */
(function () {
  'use strict';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ITC = [['ITC-BT-25', 'Viviendas'], ['ITC-BT-19', 'Instalaciones interiores'], ['ITC-BT-18', 'Puesta a tierra'], ['ITC-BT-52', 'Recarga de vehículo eléctrico']];
  const QUICK = [
    ['#/rebt', 'book', 'REBT oficial', 'Texto completo del BOE con buscador.'],
    ['#/calc/seccion', 'cable', 'Sección de cables', 'Intensidad, caída de tensión y protección.'],
    ['#/guia', 'search', 'Guía REBT', 'Alturas, distancias y ubicación.'],
    ['#/esquemas', 'schema', 'Esquemas', 'Dibuja y exporta esquemas.'],
    ['#/presupuesto', 'calc', 'Presupuestos', 'Cubicación y presupuesto.'],
    ['#/obras', 'house', 'Obras y clientes', 'Documentos, fotos y firma.']
  ];
  const pct = (a, b) => (b ? Math.round(a / b * 100) : 0);
  const search = c => `<form class="sbox" id="hs" role="search">${c.ic('search')}<input id="hq" type="search" placeholder="¿Qué dice el REBT de…?" autocomplete="off" aria-label="Buscar en el REBT"></form>`;
  const chips = () => `<div class="pc-chips">${ITC.map(x => `<button type="button" class="pc-chip" data-q="${x[0]}"><b>${x[0]}</b> ${x[1]}</button>`).join('')}</div>`;
  const repaso = c => (c.diarioHecho() ? 'Hecho hoy. Racha: ' : '5 preguntas. Racha: ') + c.rachaDiaria() + ' días';
  const favs = c => {
    const fv = c.store.get('favoritos', []), rc = c.store.get('recientes', []).filter(x => !fv.some(f => f[0] === x[0])).slice(0, 5);
    const ch = (a, i) => a.map(x => `<a class="chip" href="${x[0]}">${i} ${esc(x[1])}</a>`).join('');
    return fv.length || rc.length ? `<div class="chips">${ch(fv, '★')}${ch(rc, '↺')}</div>` : '<p class="muted">Aquí aparecerán las páginas que marques como favoritas y las que abras a menudo.</p>';
  };
  const foot = '<p class="foot">Herramienta de apoyo. El texto oficial del REBT (BOE) y la normativa de tu comunidad autónoma prevalecen siempre. Verifica los resultados antes de ejecutar una instalación real.</p>';

  window.PORTADA = {
    /* A · Control: dos columnas densas, consultas frecuentes y herramientas en filas */
    control(c) {
      const { p, s, last } = c;
      return `<div class="pa">
      <div class="pa-head"><div><h1>Elec-LoM</h1><p class="muted">Consulta del reglamento, cálculo, esquemas y práctica de examen.</p></div>${search(c)}</div>
      ${chips()}
      <div class="pa-cols">
        <div>
          <h2>Estado</h2>
          <div class="pa-kpis">
            <div><small>Temario</small><strong>${p.done}/${p.total}</strong><div class="bar"><i style="width:${pct(p.done, p.total)}%"></i></div></div>
            <div><small>Preguntas vistas</small><strong>${s.vistas}/${s.total}</strong><div class="bar"><i style="width:${pct(s.vistas, s.total)}%"></i></div></div>
            <div><small>Aciertos</small><strong>${s.ok + s.ko ? s.pct + ' %' : '—'}</strong><div class="bar"><i style="width:${s.pct}%"></i></div></div>
            <div><small>Último simulacro</small><strong>${last ? c.fmt(last.nota, 1) + '/10' : '—'}</strong><div class="bar"><i style="width:${last ? last.nota * 10 : 0}%"></i></div></div>
          </div>
          <h2>Herramientas</h2>
          <div class="pa-rows">${QUICK.map(q => `<a href="${q[0]}"><span class="ti">${c.ic(q[1])}</span><b>${q[2]}</b><em>${q[3]}</em><i>›</i></a>`).join('')}</div>
        </div>
        <aside>
          <h2>Repaso</h2>
          <a class="pa-box" href="#/test/diario"><span class="ti">${c.ic('check')}</span><b>Repaso diario</b><em>${repaso(c)}</em></a>
          <h2>Favoritos y recientes</h2>
          <div class="pa-box">${favs(c)}</div>
          <h2>Secciones</h2>
          <div class="pa-rows">${Object.entries(c.HUBS).map(([k, h]) => `<a href="#/${k}"><span class="ti">${c.ic(h.i)}</span><b>${h.t}</b><i>›</i></a>`).join('')}</div>
        </aside>
      </div>${foot}</div>`;
    },
    /* B · Consola: cabecera con panel de estado y módulos con recuento de herramientas */
    consola(c) {
      const { p, s, last } = c;
      return `<div class="pb">
      <div class="pb-hero">
        <div><h1>Elec-LoM</h1><p class="muted">Consola de trabajo para el instalador en baja tensión: reglamento, cálculo, esquemas y documentación.</p>${search(c)}${chips()}</div>
        <dl class="pb-status">
          <div><dt>Reglamento</dt><dd>RD 842/2002</dd></div>
          <div><dt>Tensión de referencia</dt><dd>230 V / 400 V</dd></div>
          <div><dt>Temario</dt><dd>${p.done} de ${p.total}</dd></div>
          <div><dt>Preguntas</dt><dd>${s.vistas} de ${s.total}</dd></div>
          <div><dt>Racha de repaso</dt><dd>${c.rachaDiaria()} días</dd></div>
        </dl>
      </div>
      <div class="pb-gauges">
        <div><span style="--v:${pct(p.done, p.total)}">${pct(p.done, p.total)}<small>%</small></span><b>Temario revisado</b></div>
        <div><span style="--v:${pct(s.vistas, s.total)}">${pct(s.vistas, s.total)}<small>%</small></span><b>Preguntas vistas</b></div>
        <div><span style="--v:${s.pct}">${s.ok + s.ko ? s.pct : '—'}<small>${s.ok + s.ko ? '%' : ''}</small></span><b>Aciertos</b></div>
        <div><span style="--v:${last ? last.nota * 10 : 0}">${last ? c.fmt(last.nota, 1) : '—'}<small>${last ? '/10' : ''}</small></span><b>Último simulacro</b></div>
      </div>
      <h2>Módulos</h2>
      <div class="pb-mods">${Object.entries(c.HUBS).map(([k, h]) => `<a href="#/${k}"><span class="ti">${c.ic(h.i)}</span><b>${h.t}</b><p>${h.d}</p><code>${h.items.length} herramientas</code></a>`).join('')}</div>
      <h2>Acceso rápido</h2>
      <div class="pb-quick">${QUICK.map(q => `<a href="${q[0]}">${c.ic(q[1])}<span>${q[2]}</span></a>`).join('')}<a href="#/test/diario">${c.ic('check')}<span>Repaso diario</span></a></div>
      <h2>Favoritos y recientes</h2>${favs(c)}${foot}</div>`;
    },
    /* C · Limpia: buscador arriba, progreso en una sola tarjeta y tarjetas grandes con descripción */
    limpia(c) {
      const { p, s, last } = c;
      const row = (t, a, v) => `<div class="pc-prog"><div><b>${t}</b><span>${a}</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`;
      return `<div class="pc">
      <div class="pc-bar">${search(c)}</div>
      <h1>Inicio</h1><p class="lead">Todo lo que necesitas para consultar, calcular y practicar.</p>
      <div class="pc-card"><h2>Tu progreso</h2>
        ${row('Temario revisado', p.done + ' de ' + p.total, pct(p.done, p.total))}
        ${row('Preguntas vistas', s.vistas + ' de ' + s.total, pct(s.vistas, s.total))}
        ${row('Aciertos', s.ok + s.ko ? s.pct + ' %' : 'Sin datos', s.pct)}
        ${row('Último simulacro', last ? c.fmt(last.nota, 1) + ' sobre 10' : 'Sin simulacros', last ? last.nota * 10 : 0)}
      </div>
      <h2>Acceso rápido</h2>
      <div class="pc-big">${QUICK.map(q => `<a href="${q[0]}"><span class="ti">${c.ic(q[1])}</span><b>${q[2]}</b><p>${q[3]}</p><u>Abrir</u></a>`).join('')}
        <a href="#/test/diario"><span class="ti">${c.ic('check')}</span><b>Repaso diario</b><p>${repaso(c)}.</p><u>Empezar</u></a></div>
      <h2>Secciones</h2>
      <div class="pc-list">${Object.entries(c.HUBS).map(([k, h]) => `<a href="#/${k}"><span class="ti">${c.ic(h.i)}</span><div><b>${h.t}</b><span>${h.d}</span></div><i>›</i></a>`).join('')}</div>
      <h2>Favoritos y recientes</h2>${favs(c)}${foot}</div>`;
    }
  };
})();
