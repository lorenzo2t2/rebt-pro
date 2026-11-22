/* Temas: estilo visual (Sobrio / Futurista) y modo (oscuro / claro). Se guarda en este dispositivo. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, view, $, $$ } = A;
  const root = document.documentElement;
  const ESTILOS = [
    { id: 'futurista', t: 'Futurista', d: 'Cristal, profundidad 3D, brillos contenidos y la hélice trifásica animada del inicio.' },
    { id: 'sobrio', t: 'Sobrio', d: 'Plano y limpio: sin efectos ni animaciones, máxima legibilidad y menos consumo de batería.' },
  ];
  const MODOS = [{ id: 'dark', t: 'Oscuro' }, { id: 'light', t: 'Claro' }];
  const preview = (id, modo) => {
    const dk = modo === 'dark';
    const bg = id === 'futurista' ? (dk ? 'radial-gradient(120px 70px at 85% 0,rgba(47,123,255,.35),transparent),#05080f' : 'radial-gradient(120px 70px at 85% 0,rgba(47,123,255,.2),transparent),#eef2f8') : (dk ? '#0c1015' : '#f6f7f9');
    const pn = id === 'futurista' ? (dk ? 'linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.02)),#0d1522' : '#fff') : (dk ? '#141a21' : '#fff');
    const bd = id === 'futurista' ? (dk ? 'rgba(140,175,255,.3)' : 'rgba(30,70,160,.18)') : (dk ? '#27303b' : '#dfe3e9');
    const ac = id === 'futurista' ? 'linear-gradient(135deg,#2f7bff,#38d6ff)' : '#1d4ed8';
    const glow = id === 'futurista' ? 'box-shadow:0 0 14px rgba(56,214,255,.35);' : '';
    const tx = dk ? '#cfd8e6' : '#27324a';
    const blk = `background:${pn};border:1px solid ${bd};border-radius:${id === 'futurista' ? 9 : 6}px;`;
    return `<div style="background:${bg};border-radius:10px;padding:12px;height:124px;display:grid;gap:8px;grid-template-columns:44px 1fr;border:1px solid ${bd}">
      <div style="${blk}display:grid;gap:6px;padding:6px;align-content:start"><i style="height:6px;border-radius:3px;background:${ac};${glow}display:block"></i><i style="height:4px;border-radius:2px;background:${bd};display:block"></i><i style="height:4px;border-radius:2px;background:${bd};display:block"></i><i style="height:4px;border-radius:2px;background:${bd};display:block"></i></div>
      <div style="display:grid;gap:8px;grid-template-rows:34px 1fr">
        <div style="${blk}padding:6px 8px;color:${tx};font:700 11px system-ui">Elec-LoM<i style="float:right;width:34px;height:8px;border-radius:4px;background:${ac};${glow}margin-top:2px"></i></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="${blk}"></div><div style="${blk}${id === 'futurista' ? 'box-shadow:0 0 16px -2px rgba(56,214,255,.4);border-color:#38d6ff;' : ''}"></div></div>
      </div></div>`;
  };

  function aplicar() {
    root.dataset.estilo = store.get('estilo', 'futurista');
    root.dataset.theme = store.get('theme', '') || 'dark';
  }
  aplicar();

  route(/^#\/temas$/, () => {
    const est = store.get('estilo', 'futurista'), modo = root.dataset.theme || 'dark';
    view.innerHTML = `<h1>Temas</h1><p class="lead">Elige el estilo y el modo. El cambio es inmediato y se recuerda en este dispositivo.</p>
    <h2>Estilo</h2>
    <div class="tiles" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${ESTILOS.map(e => `
      <button class="card tema" data-e="${e.id}" aria-pressed="${est === e.id}" style="text-align:left;cursor:pointer;font:inherit;color:inherit">
        ${preview(e.id, modo)}
        <h3 style="margin:12px 0 4px">${e.t} ${est === e.id ? '<span class="tag itc">Activo</span>' : ''}</h3><p>${e.d}</p>
      </button>`).join('')}</div>
    <h2>Modo</h2>
    <div class="chips">${MODOS.map(m => `<button class="chip ${modo === m.id ? 'on' : ''}" data-m="${m.id}">${m.t}</button>`).join('')}</div>
    <p class="mini muted" style="margin-top:18px">El modo claro es útil a pleno sol en obra. El estilo sobrio consume menos batería porque no anima nada.</p>`;
    $$('.tema').forEach(b => b.onclick = () => { store.set('estilo', b.dataset.e); aplicar(); A.go(); });
    $$('[data-m]').forEach(b => b.onclick = () => { store.set('theme', b.dataset.m); aplicar(); A.go(); });
  });
});
