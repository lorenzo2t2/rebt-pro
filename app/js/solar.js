/* Calculadora de autoconsumo fotovoltaico: potencia, módulos, ahorro y cable de conexión (ITC-BT-40). */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, fmt, view, $, $$ } = A;
  const C = window.Calc;
  const F = [['consumo', 'Consumo anual (kWh)', 4500], ['esp', 'Producción específica (kWh por kWp y año)', 1500], ['cob', 'Cobertura que quieres (%)', 60], ['auto', 'Parte de lo generado que consumes tú (%)', 70], ['wp', 'Potencia por módulo (Wp)', 450], ['sis', 'Conexión (mono / tri)', 'mono'], ['pk', 'Precio de la electricidad (€/kWh)', ''], ['pe', 'Precio de compensación de excedentes (€/kWh)', ''], ['coste', 'Coste de la instalación (€)', ''], ['L', 'Longitud cable AC hasta el cuadro (m)', 15]];
  const eur = n => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
  route(/^#\/fv$/, () => {
    const s = store.get('fv', {});
    view.innerHTML = `<h1>Autoconsumo fotovoltaico</h1><p class="lead">Dimensiona la instalación, estima el ahorro y comprueba el cable de conexión. Los precios los pones tú.</p>
    <div class="form">${F.map(([k, l, d]) => k === 'sis' ? `<div><label for="f_${k}">${l}</label><select id="f_${k}"><option value="mono">Monofásica 230 V</option><option value="tri">Trifásica 400 V</option></select></div>` : `<div><label for="f_${k}">${l}</label><input id="f_${k}" inputmode="decimal" value="${s[k] != null ? s[k] : d}"></div>`).join('')}</div><div id="fo" aria-live="polite"></div>
    <p class="muted mini">La producción específica depende de la provincia, la orientación y la inclinación: usa el dato de tu proyecto o de la herramienta oficial PVGIS. Estimación orientativa, no un estudio de viabilidad.</p>`;
    if (s.sis) $('#f_sis').value = s.sis;
    const go = () => {
      const v = {}; F.forEach(([k]) => { const e = $('#f_' + k); v[k] = k === 'sis' ? e.value : parseFloat(String(e.value).replace(',', '.')) || 0; }); store.set('fv', v);
      if (!(v.consumo > 0 && v.esp > 0 && v.cob > 0 && v.auto > 0)) { $('#fo').innerHTML = '<p class="muted">Introduce valores válidos.</p>'; return; }
      const kwp = v.cob / 100 * v.consumo / (v.esp * v.auto / 100), n = v.wp > 0 ? Math.ceil(kwp * 1000 / v.wp) : 0, real = n * v.wp / 1000;
      const gen = real * v.esp, cons = gen * v.auto / 100, exc = gen - cons;
      const U = v.sis === 'tri' ? 400 : 230, Pac = real, Iac = Pac * 1000 / ((v.sis === 'tri' ? Math.sqrt(3) : 1) * U);
      const sec = C.calcularSeccion({ sistema: v.sis, Ib: Iac * 1.25, L: v.L, aisl: 'XLPE', metodo: 'B', limite: 1.5, mat: 'Cu' });
      const ahorro = cons * v.pk + exc * v.pe;
      $('#fo').innerHTML = `<div class="result"><div class="big">${fmt(real, 2)} kWp · ${n} módulos</div>
      <div class="kv"><div><b>Producción anual</b><span>${fmt(gen, 0)} kWh</span></div><div><b>Autoconsumida</b><span>${fmt(cons, 0)} kWh</span></div><div><b>Excedentes</b><span>${fmt(exc, 0)} kWh</span></div><div><b>Cobertura real</b><span>${fmt(cons / v.consumo * 100, 0)} %</span></div>
      <div><b>Intensidad AC (inversor ≈ ${fmt(Pac, 1)} kW)</b><span>${fmt(Iac)} A</span></div>${sec.solucion ? `<div><b>Cable AC (125 % y ≤ 1,5 %)</b><span>${sec.solucion.S} mm² Cu</span></div>` : ''}
      ${v.pk > 0 ? `<div><b>Ahorro anual estimado</b><span>${eur(ahorro)}</span></div>` : ''}${v.pk > 0 && v.coste > 0 && ahorro > 0 ? `<div><b>Amortización simple</b><span>${fmt(v.coste / ahorro, 1)} años</span></div>` : ''}</div></div>
      <ul><li>La ITC-BT-40 pide cables de conexión para el 125 % de la intensidad máxima del generador y una caída ≤ 1,5 %.</li><li>Hasta 100 kW en baja tensión, en Andalucía se registra en PUES; mira <a href="#/andalucia">Docs Andalucía</a>.</li><li>La potencia AC se ha tomado igual a la de los módulos; ajusta según el inversor elegido.</li></ul>`;
    };
    $$('#view input,#view select').forEach(x => x.oninput = x.onchange = go); go();
  });
});
