/* Selección y coordinación de protecciones: calibre y curva, poder de corte, magnético en el extremo y selectividad.
   Cálculos orientativos: la selectividad real depende de las tablas del fabricante. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, view, $, $$ } = A;
  const C = window.Calc;
  const num = id => { const n = parseFloat(String($('#' + id).value).replace(',', '.')); return isFinite(n) ? n : NaN; };
  const ok = (b, y, n) => `<div class="note ${b ? 'ok' : 'bad'}">${b ? '✔ ' + y : '✖ ' + n}</div>`;
  const f = (id, l, v, ex) => `<div><label for="${id}">${l}</label><input id="${id}" value="${v}" inputmode="decimal" ${ex || ''}></div>`;
  const CAL = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  const PDC = [1.5, 3, 4.5, 6, 10, 15, 20, 25];
  const CURV = { B: [3, 5], C: [5, 10], D: [10, 20] };

  const T = {
    cal() {
      return { h: `<p>Un magnetotérmico protege el cable contra sobrecarga si cumple <b>Ib ≤ In ≤ Iz</b> y la corriente convencional de funcionamiento ≤ 1,45·Iz.</p>
      <div class="form">${f('p_ib', 'Corriente de empleo Ib (A)', 20)}${f('p_iz', 'Intensidad admisible del cable Iz (A)', 27)}
      <div><label for="p_cu">Curva</label><select id="p_cu"><option>B</option><option selected>C</option><option>D</option></select></div></div><div id="o" aria-live="polite"></div>`,
        run() {
          const Ib = num('p_ib'), Iz = num('p_iz'), cu = $('#p_cu').value; if (!(Ib > 0 && Iz > 0)) return '<p class="muted">Introduce valores válidos.</p>';
          const In = CAL.find(c => c >= Ib), [a, b] = CURV[cu];
          if (!In) return '<p class="muted">Supera los calibres habituales de la lista.</p>';
          return `<div class="result"><div class="big">${In} A · curva ${cu}</div><div class="kv"><div><b>Disparo magnético</b><span>${a * In}–${b * In} A</span></div><div><b>Corriente convencional (1,45·In)</b><span>${fmt(1.45 * In)} A</span></div><div><b>Límite 1,45·Iz</b><span>${fmt(1.45 * Iz)} A</span></div></div>
          ${ok(Ib <= In && In <= Iz, `Ib ≤ In ≤ Iz (${fmt(Ib)} ≤ ${In} ≤ ${fmt(Iz)}).`, In > Iz ? `El calibre ${In} A supera Iz: aumenta la sección del cable o baja el calibre.` : 'Ib supera el calibre.')}</div>
          <p class="muted mini">Curvas B: 3–5·In (cables largos o poca potencia de cortocircuito), C: 5–10·In (uso general), D: 10–20·In (arranques de motores y transformadores).</p>`;
        } };
    },
    pdc() {
      return { h: `<p>El poder de corte debe ser igual o mayor que la corriente de cortocircuito máxima en el punto de instalación.</p>
      <div class="form">${f('p_kva', 'Potencia del transformador (kVA)', 400)}${f('p_ucc', 'Ucc (%)', 4)}${f('p_s', 'Sección del cable hasta el punto (mm²)', 16)}${f('p_l', 'Longitud hasta el punto (m)', 20)}</div><div id="o" aria-live="polite"></div>`,
        run() {
          const kva = num('p_kva'), ucc = num('p_ucc'), S = num('p_s'), L = num('p_l'); if (!(kva > 0 && ucc > 0 && S > 0 && L >= 0)) return '<p class="muted">Introduce valores válidos.</p>';
          const I0 = C.iccTransformador({ kVA: kva, ucc }), I1 = C.iccAguasAbajo({ IccAmont: I0, S, L, mat: 'Cu' }) / 1000, need = PDC.find(x => x >= I1);
          return `<div class="result"><div class="big">Icc ≈ ${fmt(I1, 2)} kA</div><div class="kv"><div><b>Icc en bornas del transformador</b><span>${fmt(I0 / 1000, 2)} kA</span></div><div><b>Poder de corte mínimo</b><span>${need ? need + ' kA' : '> 25 kA'}</span></div></div>
          ${ok(!!need, `Elige un poder de corte de ${need} kA o superior.`, 'Supera los poderes de corte habituales: usa un interruptor automático de caja moldeada.')}</div>
          <p class="muted mini">Valores normalizados 1,5 · 3 · 4,5 · 6 · 10 · 15 · 20 · 25 kA. Método de impedancias simplificado, cortocircuito máximo trifásico. En viviendas se parte de la Icc que indica la distribuidora.</p>`;
        } };
    },
    mag() {
      return { h: `<p>Comprueba que el disparo magnético actúa con el cortocircuito mínimo (fase-neutro o fase-PE) al final de la línea, en un esquema TN.</p>
      <div class="form">${f('p_s', 'Sección de fase (mm²)', 2.5)}${f('p_in', 'Calibre In (A)', 16)}${f('p_l', 'Longitud de la línea (m)', 40)}
      <div><label for="p_cu">Curva</label><select id="p_cu"><option>B</option><option selected>C</option><option>D</option></select></div>
      <div><label for="p_m">Material</label><select id="p_m"><option>Cu</option><option>Al</option></select></div></div><div id="o" aria-live="polite"></div>`,
        run() {
          const S = num('p_s'), In = num('p_in'), L = num('p_l'); if (!(S > 0 && In > 0 && L > 0)) return '<p class="muted">Introduce valores válidos.</p>';
          const Lm = C.longitudMaxTN({ S, In, curva: $('#p_cu').value, mat: $('#p_m').value });
          return `<div class="result"><div class="big">Lmáx ≈ ${fmt(Lm, 0)} m</div>${ok(L <= Lm, 'La línea queda protegida por el disparo magnético.', 'El magnético no garantiza el disparo: reduce la longitud, aumenta la sección o usa curva B.')}</div>
          <p class="muted mini">Lmáx = 0,8·U₀·S / [ρ·(1+m)·Ia], con Ia = k·In según la curva y m = S/S<sub>PE</sub> (aquí 1). Orientativo.</p>`;
        } };
    },
    sel() {
      return { h: `<p>Selectividad: cuando hay una avería, debe disparar solo la protección más cercana. Comprueba dos casos.</p>
      <h3>Diferenciales en cascada</h3><div class="form">${f('p_u', 'Sensibilidad aguas arriba (mA)', 300)}${f('p_d', 'Sensibilidad aguas abajo (mA)', 30)}
      <div><label for="p_r">Aguas arriba</label><select id="p_r"><option value="s">Selectivo (tipo S, retardado)</option><option value="i">Instantáneo</option></select></div></div>
      <h3>Magnetotérmicos o fusibles en cascada</h3><div class="form">${f('p_a', 'Calibre aguas arriba (A)', 40)}${f('p_b', 'Calibre aguas abajo (A)', 16)}
      <div><label for="p_t">Tipo</label><select id="p_t"><option value="gg">Fusibles gG</option><option value="mcb">Magnetotérmicos</option></select></div></div><div id="o" aria-live="polite"></div>`,
        run() {
          const u = num('p_u'), d = num('p_d'), a = num('p_a'), b = num('p_b'), sel = $('#p_r').value === 's', tipo = $('#p_t').value; if (!(u > 0 && d > 0 && a > 0 && b > 0)) return '<p class="muted">Introduce valores válidos.</p>';
          const dif = u >= 3 * d && sel, r = a / b, mc = r >= 1.6;
          return `<div class="result"><h3>Diferenciales</h3>${ok(dif, `Hay selectividad: sensibilidad ${u}/${d} mA (≥ 3×) y el de aguas arriba es retardado.`, !sel ? 'El diferencial de aguas arriba es instantáneo: dispararán a la vez. Usa un tipo S o retardado.' : 'La sensibilidad aguas arriba debe ser al menos 3 veces la de aguas abajo.')}
          <h3>${tipo === 'gg' ? 'Fusibles' : 'Magnetotérmicos'}</h3>${ok(mc, `Relación ${fmt(r, 2)}: cumple la regla práctica (≥ 1,6).`, `Relación ${fmt(r, 2)}: la regla práctica pide al menos 1,6.`)}</div>
          <p class="muted mini">${tipo === 'gg' ? 'Para fusibles gG la selectividad suele cumplirse con una relación de calibres ≥ 1,6.' : 'Con magnetotérmicos la selectividad total depende del modelo, la curva y la corriente de cortocircuito: consulta las tablas de selectividad del fabricante. La relación 1,6 es solo una primera orientación (selectividad parcial).'}</p>`;
        } };
    },
  };

  const TABS = [['cal', 'Calibre y curva'], ['pdc', 'Poder de corte'], ['mag', 'Magnético en el extremo'], ['sel', 'Selectividad']];
  route(/^#\/protecciones$/, () => {
    const cur = store.get('prot.tab', 'cal');
    view.innerHTML = `<h1>Protecciones</h1><p class="lead">Elige el calibre y la curva, comprueba el poder de corte, que el magnético dispare al final de la línea y que las protecciones sean selectivas entre sí. Cálculos orientativos: confirma con el catálogo del fabricante.</p>
    <div class="chips">${TABS.map(([k, t]) => `<button class="chip ${k === cur ? 'on' : ''}" data-t="${k}">${t}</button>`).join('')}</div><div id="pp"></div>`;
    const show = k => {
      store.set('prot.tab', k); $$('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === k));
      const t = T[k](); $('#pp').innerHTML = t.h; const go = () => { $('#o').innerHTML = t.run(); };
      $$('#pp input,#pp select').forEach(x => x.oninput = x.onchange = go); go();
    };
    $$('[data-t]').forEach(b => b.onclick = () => show(b.dataset.t)); show(cur);
  });
});
