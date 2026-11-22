/* Motores eléctricos: calculadora, tipos de arranque con esquemas editables, conexionado, averías y comprobaciones.
   Fuente normativa: ITC-BT-47 (texto del REBT incluido en la app). Los valores típicos de arranque son orientativos. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, view, $, $$ } = A;
  const C = window.Calc;
  const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  /* ------------------------------------------------------------ constructor de esquemas (potencia + mando) */
  function build() {
    const m = { els: [], wires: [] }; let n = 0;
    const SYM = window.REBTSym || {};
    const add = (t, x, y, label, sub, o) => { const e = Object.assign({ id: 'e' + (++n), t, x, y, rot: 0, label: label == null ? (SYM[t] || {}).l : label, sub: sub || '' }, o || {}); m.els.push(e); return e; };
    const w = (a, b, l) => m.wires.push({ id: 'w' + (++n), a: a.id, b: b.id, label: l || '' });
    return { m, add, w };
  }
  const perfil = () => (store.get('perfil', {}) || {}).instalador || '';
  const cajetin = t => ({ titulo: t, titular: '', instalador: perfil(), fecha: new Date().toLocaleDateString('es-ES'), plano: '1', escala: 'S/E', hoja: 'A4' });
  const nota = (add, x, y, s) => add('txt', x, y, s, '', { fs: 12 });

  /* Cabecera común de potencia: barra L1 L2 L3 → seccionador → fusibles */
  function cabecera(b, x) {
    const bus = b.add('bus', x, 60, 'L1 L2 L3', '', { w: 160 }), q = b.add('sec3', x, 140, 'Q1', 'Seccionador'), f = b.add('fus3', x, 220, 'F1', 'Fusibles gG / aM');
    b.w(bus, q); b.w(q, f); return f;
  }
  /* Rama de marcha-paro con autoretención: devuelve el nudo inferior */
  function marchaParo(b, x, yTop, busL1) {
    const f2 = b.add('cnc', x, yTop + 70, 'F2', '95-96'), s0 = b.add('pnc', x, yTop + 140, 'S0', 'Paro'), n1 = b.add('nodo', x + 30, yTop + 210, '', '', { w: 120 });
    const s1 = b.add('pna', x, yTop + 270, 'S1', 'Marcha'), k = b.add('cna', x + 60, yTop + 270, 'KM1', '13-14'), n2 = b.add('nodo', x + 30, yTop + 330, '', '', { w: 120 });
    b.w(busL1, f2); b.w(f2, s0); b.w(s0, n1); b.w(n1, s1); b.w(n1, k); b.w(s1, n2); b.w(k, n2); return n2;
  }

  const PLANTILLAS = {
    directo() {
      const b = build(), { add, w } = b; const f = cabecera(b, 200);
      const km = add('con3', 200, 300, 'KM1', 'Contactor'), th = add('term3', 200, 380, 'F2', 'Relé térmico'), mo = add('mot3', 200, 470, 'M1', '3~ 400 V'), pe = add('tierra', 200, 560, 'PE', '');
      w(f, km); w(km, th); w(th, mo); w(mo, pe);
      nota(add, 90, 620, 'Potencia'); nota(add, 520, 30, 'Mando (230 V)');
      const l1 = add('bus', 640, 60, 'L1', '', { w: 260 }), nn = marchaParo(b, 560, 60, l1);
      const bob = add('bob', 590, 450, 'KM1', 'A1-A2'), bn = add('bus', 640, 520, 'N', '', { w: 260 }); w(nn, bob); w(bob, bn);
      const k2 = add('cna', 740, 200, 'KM1', '13-14'), h1 = add('piloto', 740, 300, 'H1', 'Marcha'); w(l1, k2); w(k2, h1); w(h1, bn);
      b.m.cajetin = cajetin('Arranque directo de un motor trifásico'); return b.m;
    },
    inversion() {
      const b = build(), { add, w } = b; const f = cabecera(b, 220);
      const k1 = add('con3', 140, 310, 'KM1', 'Giro derecha'), k2 = add('con3', 300, 310, 'KM2', 'Giro izquierda'), th = add('term3', 220, 410, 'F2', 'Relé térmico'), mo = add('mot3', 220, 500, 'M1', '3~ 400 V'), pe = add('tierra', 220, 590, 'PE', '');
      w(f, k1); w(f, k2, 'L1↔L3 cruzadas'); w(k1, th); w(k2, th); w(th, mo); w(mo, pe);
      nota(add, 90, 650, 'Potencia: KM2 intercambia dos fases para invertir el giro'); nota(add, 480, 30, 'Mando con enclavamiento');
      const l1 = add('bus', 600, 60, 'L1', '', { w: 360 }), f2 = add('cnc', 600, 120, 'F2', '95-96'), s0 = add('pnc', 600, 190, 'S0', 'Paro'), n = add('nodo', 600, 260, '', '', { w: 340 });
      w(l1, f2); w(f2, s0); w(s0, n);
      const bn = add('bus', 600, 600, 'N', '', { w: 360 });
      [[450, 'S1', 'KM1', 'KM2', 'Derecha'], [750, 'S2', 'KM2', 'KM1', 'Izquierda']].forEach(([x, s, ka, kb, t]) => {
        const sa = add('pna', x - 30, 330, s, t), kn = add('cna', x + 30, 330, ka, '13-14'), n2 = add('nodo', x, 390, '', '', { w: 100 }), il = add('cnc', x, 450, kb, '11-12 enclav.'), bo = add('bob', x, 520, ka, 'A1-A2');
        w(n, sa); w(n, kn); w(sa, n2); w(kn, n2); w(n2, il); w(il, bo); w(bo, bn);
      });
      b.m.cajetin = cajetin('Inversión de giro de un motor trifásico'); return b.m;
    },
    yd() {
      const b = build(), { add, w } = b; const f = cabecera(b, 240);
      const k1 = add('con3', 240, 300, 'KM1', 'Línea'), th = add('term3', 240, 380, 'F2', 'Relé térmico'), k3 = add('con3', 120, 470, 'KM3', 'Triángulo'), xm = add('bornas', 240, 540, 'XM', 'U1 V1 W1 / W2 U2 V2'), k2 = add('con3', 390, 540, 'KM2', 'Estrella'), nd = add('nodo', 390, 620, '', 'Punto de estrella', { w: 40 }), mo = add('mot3', 240, 650, 'M1', '3~ 400/690 V'), pe = add('tierra', 240, 730, 'PE', '');
      w(f, k1); w(k1, th); w(th, k3, 'Δ'); w(k3, xm); w(th, xm); w(xm, k2, 'W2 U2 V2'); w(k2, nd); w(xm, mo); w(mo, pe);
      nota(add, 120, 790, 'Potencia: arranque en estrella (KM1+KM2) y paso a triángulo (KM1+KM3)'); nota(add, 560, 30, 'Mando con temporizador KT1');
      const l1 = add('bus', 680, 60, 'L1', '', { w: 420 }), nn = marchaParo(b, 540, 60, l1);
      const n3 = add('nodo', 680, 390, '', '', { w: 340 });
      w(nn, n3);
      const bn = add('bus', 680, 700, 'N', '', { w: 420 });
      const b1 = add('bob', 540, 600, 'KM1', 'Línea'); w(n3, b1); w(b1, bn);
      const t2 = add('cnct', 680, 440, 'KT1', '15-16'), i3 = add('cnc', 680, 500, 'KM3', '11-12'), n4 = add('nodo', 680, 560, '', '', { w: 100 }), b2 = add('bob', 640, 620, 'KM2', 'Estrella'), tt = add('temp', 725, 620, 'KT1', 'Temporizador');
      w(n3, t2); w(t2, i3); w(i3, n4); w(n4, b2); w(n4, tt); w(b2, bn); w(tt, bn);
      const t3 = add('cnat', 820, 440, 'KT1', '17-18'), i2 = add('cnc', 820, 500, 'KM2', '11-12'), b3 = add('bob', 820, 620, 'KM3', 'Triángulo');
      w(n3, t3); w(t3, i2); w(i2, b3); w(b3, bn);
      b.m.cajetin = cajetin('Arranque estrella-triángulo'); return b.m;
    },
    suave() {
      const b = build(), { add, w } = b; const f = cabecera(b, 220);
      const ss = add('sst', 220, 310, 'T1', 'Arrancador estático'), mo = add('mot3', 220, 410, 'M1', '3~ 400 V'), pe = add('tierra', 220, 500, 'PE', '');
      w(f, ss); w(ss, mo); w(mo, pe);
      nota(add, 360, 330, 'Mando: contacto de marcha/paro a las entradas del arrancador'); nota(add, 360, 350, 'Rampa de aceleración y deceleración ajustables'); nota(add, 360, 370, 'Protección de sobrecarga integrada (verifica el ajuste)');
      b.m.cajetin = cajetin('Arranque con arrancador estático'); return b.m;
    },
    variador() {
      const b = build(), { add, w } = b; const f = cabecera(b, 220);
      const vf = add('vfd', 220, 310, 'T1', 'Variador de frecuencia'), mo = add('mot3', 220, 410, 'M1', '3~ 400 V'), pe = add('tierra', 220, 500, 'PE', '');
      w(f, vf); w(vf, mo, 'cable apantallado'); w(mo, pe);
      nota(add, 360, 330, 'Mando: entradas digitales (marcha/paro/sentido), analógica (consigna)'); nota(add, 360, 350, 'Relé de fallo del variador al circuito de señalización'); nota(add, 360, 370, 'Conexión de pantalla del cable a tierra en ambos extremos');
      b.m.cajetin = cajetin('Motor con variador de frecuencia'); return b.m;
    },
  };

  const ARRANQUES = [
    { id: 'directo', n: 'Arranque directo', cuando: 'Motores pequeños o red que lo admite. Es el más simple y el de mayor par.', ia: '4 a 8 veces In (según motor)', par: '100 % del par de arranque', pro: ['Instalación sencilla y barata', 'Par máximo desde el primer instante'], con: ['Pico de corriente alto', 'Sacudida mecánica', 'Limitado por la tabla de la ITC-BT-47 a partir de 0,75 kW'], comp: 'Seccionador, fusibles, contactor, térmico, pulsadores' },
    { id: 'inversion', n: 'Inversión de giro', cuando: 'Cuando el motor debe girar en ambos sentidos (puertas, cintas, grúas).', ia: 'Igual que el directo', par: 'Igual que el directo', pro: ['Se logra permutando dos fases'], con: ['Hay que enclavar KM1 y KM2 eléctricamente para evitar un cortocircuito entre fases', 'La ITC-BT-47 requiere conformidad de la distribuidora para motores con inversión de marcha en red pública'], comp: 'Dos contactores, enclavamiento por contactos NC (y mecánico si es posible)' },
    { id: 'yd', n: 'Estrella-triángulo', cuando: 'Motores de potencia media con arranque en vacío o carga baja. El motor debe poder conectarse en triángulo a la tensión de red (placa 400/690 V en red de 400 V).', ia: 'Un tercio del directo', par: 'Un tercio del directo', pro: ['Reduce el pico de corriente', 'Componentes económicos'], con: ['El par también baja a un tercio', 'Se produce un pico al pasar de estrella a triángulo', 'Necesita seis cables al motor'], comp: 'Tres contactores, temporizador, térmico y seis bornas' },
    { id: 'estat', n: 'Resistencias estatóricas', cuando: 'Arranques escalonados con limitación de tensión; ya poco usado.', ia: 'Proporcional a la tensión reducida', par: 'Proporcional al cuadrado de la tensión reducida', pro: ['Arranque progresivo'], con: ['Pérdidas en las resistencias', 'Requiere un segundo contactor y temporizador'], comp: 'Contactores, resistencias, temporizador' },
    { id: 'auto', n: 'Autotransformador', cuando: 'Motores grandes que necesitan limitar la corriente conservando buen par.', ia: 'Proporcional al cuadrado de la relación de transformación', par: 'Proporcional al cuadrado de la relación de transformación', pro: ['Mejor relación par/corriente que estrella-triángulo'], con: ['Equipo voluminoso y caro'], comp: 'Autotransformador, contactores, temporizador' },
    { id: 'rotor', n: 'Rotor bobinado (reóstato rotórico)', cuando: 'Arranques pesados y gran inercia. Solo con motores de anillos.', ia: 'Baja', par: 'Alto y ajustable', pro: ['Buen par con poca corriente'], con: ['Mantenimiento de anillos y escobillas', 'Los conductores del rotor se dimensionan al 125 % (ITC-BT-47)'], comp: 'Motor de anillos, reóstato, contactores' },
    { id: 'suave', n: 'Arrancador estático (suave)', cuando: 'Para evitar golpes de par en bombas, cintas y ventiladores.', ia: 'Ajustable por rampa o límite de corriente', par: 'Progresivo', pro: ['Arranque y parada suaves', 'Se puede ajustar'], con: ['Los armónicos y el calor exigen ventilación', 'No varía la velocidad en marcha'], comp: 'Arrancador, fusibles ultrarrápidos, a veces contactor de bypass' },
    { id: 'variador', n: 'Variador de frecuencia', cuando: 'Control de velocidad y ahorro energético; arranque con corriente limitada.', ia: 'Normalmente ≤ In', par: 'Controlado', pro: ['Control total de velocidad, par y sentido', 'Ahorro energético en bombas y ventiladores'], con: ['Más caro', 'Compatibilidad electromagnética, cables apantallados', 'Requiere protección diferencial adecuada (tipo B o según fabricante)'], comp: 'Variador, filtro EMC, cable apantallado' },
  ];

  const AVERIAS = [
    ['No arranca y zumba', 'Falta una fase, rodamientos bloqueados, condensador de arranque estropeado (monofásico), tensión muy baja', 'Medir tensión en las tres fases con el motor conectado; girar el eje a mano; comprobar condensador'],
    ['Dispara el relé térmico', 'Sobrecarga mecánica, tensión baja, fase abierta, ajuste del térmico demasiado bajo, arranques frecuentes', 'Medir la intensidad por fase y comparar con la placa; revisar el ajuste del térmico (igual a la In de placa)'],
    ['Salta el magnetotérmico o los fusibles', 'Cortocircuito en cable o bobinado, arranque demasiado exigente, calibre insuficiente', 'Medir aislamiento (megóhmetro) y resistencia de bobinados; revisar calibre y curva'],
    ['Salta el diferencial', 'Fuga a tierra por humedad o bobinado dañado', 'Medir aislamiento fase-tierra con motor desconectado; revisar entradas de humedad en la caja de bornas'],
    ['Calentamiento excesivo', 'Ventilación obstruida, sobrecarga, desequilibrio de tensiones, rodamientos', 'Limpiar rejillas y aspas; medir corrientes por fase; comprobar la temperatura de cojinetes'],
    ['Ruido o vibración', 'Rodamientos, desequilibrio, mala alineación, fase abierta (zumbido)', 'Escuchar y tocar los cojinetes; revisar el acoplamiento; medir corrientes'],
    ['Gira al revés', 'Orden de fases invertido', 'Permutar dos fases en la alimentación (no en la caja de bornas si hay variador con consigna)'],
    ['Corrientes desiguales entre fases', 'Desequilibrio de tensión, mal contacto, bobinado parcialmente en cortocircuito', 'Medir tensión de cada fase, apretar bornas, medir resistencias de bobinado'],
    ['El contactor vibra o no se mantiene', 'Tensión de bobina baja, contacto de autoretención con mal contacto, polvo en el circuito magnético', 'Medir tensión en A1-A2 durante el cierre; limpiar y revisar contactos'],
  ];

  const CHECK = [
    'La tensión de la placa del motor coincide con la de la red (y la conexión en estrella o triángulo es la correcta).',
    'Las bornas están apretadas y los puentes de la caja de bornas están bien puestos.',
    'El motor gira libremente a mano y no hay cuerpos extraños en el ventilador.',
    'Aislamiento medido con megóhmetro (en circuitos hasta 500 V, ensayo a 500 V; el REBT exige como mínimo 0,5 MΩ).',
    'Continuidad del conductor de protección (tierra) hasta la carcasa del motor.',
    'Térmico ajustado a la intensidad nominal de la placa; fusibles o magnetotérmico del calibre calculado.',
    'Enclavamientos, paro de emergencia y finales de carrera probados.',
    'Primer arranque en vacío si es posible: sentido de giro, ruido y vibración.',
    'Con carga: intensidad por fase medida y comparada con la placa; temperaturas razonables.',
  ];

  /* ------------------------------------------------------------ calculadora */
  const NOR = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  function calcular(v) {
    const tri = v.sis === 'tri', U = tri ? 400 : 230;
    const m = C.motor({ P_kW: v.P, sistema: v.sis, U, cosfi: v.cosfi, rend: v.rend, Ia_In: v.iaIn });
    const extra = String(v.otros || '').split(/[,;\s]+/).map(Number).filter(x => x > 0);
    const Idim = extra.length ? C.motoresVarios([m.In, ...extra]) : m.Idim;
    const sec = C.calcularSeccion({ sistema: v.sis, Ib: Idim, cosfi: v.cosfi, L: v.L, aisl: v.aisl, metodo: v.metodo, limite: 5, mat: 'Cu' });
    const lim = v.P < 0.75 ? null : v.P <= 1.5 ? 4.5 : v.P <= 5 ? 3 : v.P <= 15 ? 2 : 1.5;
    const aM = NOR.find(x => x >= m.In), kvar = v.cosfi2 > v.cosfi ? C.compensacion({ P_kW: m.Pabs, cosfi1: v.cosfi, cosfi2: v.cosfi2 }) : null;
    const s = (t, d) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`;
    return `<div class="result"><div class="big">${fmt(m.In)} A</div><p class="muted">Intensidad nominal estimada por fase</p>
      <div class="kv"><div><b>Pot. absorbida</b><span>${fmt(m.Pabs)} kW</span></div><div><b>Corriente de arranque</b><span>${fmt(m.Iarranque)} A</span></div><div><b>Conductor (125 %${extra.length ? ' + resto' : ''})</b><span>${fmt(Idim)} A</span></div>${sec.solucion ? `<div><b>Sección (Cu)</b><span>${sec.solucion.S} mm²</span></div><div><b>Caída de tensión</b><span>${fmt(sec.solucion.dUp, 2)} %</span></div>` : ''}</div>
      ${lim == null ? '' : `<div class="note ${v.iaIn <= lim ? 'ok' : 'bad'}">${v.iaIn <= lim ? '✔' : '✖'} Ia/In = ${v.iaIn} ${v.iaIn <= lim ? 'cumple' : 'supera'} el máximo ${lim} de la ITC-BT-47 para esta potencia${v.iaIn <= lim ? '' : '. Usa estrella-triángulo, arrancador estático o variador.'}</div>`}</div>
      <h3>Aparamenta orientativa</h3><div class="grid g2">
      ${s('Fusibles', aM ? `aM de calibre ≥ ${aM} A (o gG de calibre algo mayor). Selecciona según catálogo y curva de arranque.` : 'La intensidad supera los calibres habituales; consulta catálogo.')}
      ${s('Relé térmico / guardamotor', `Regulable, con ${fmt(m.In)} A dentro del rango; ajustar a la intensidad de placa. Debe cubrir la falta de fase (ITC-BT-47, apdo. 4).`)}
      ${s('Contactor', `Categoría AC-3 con intensidad asignada ≥ ${fmt(m.In)} A.`)}
      ${s('Estrella-triángulo', `Contactores: línea y triángulo ≈ ${fmt(m.In * 0.58)} A (In/√3), estrella ≈ ${fmt(m.In / 3)} A. Corriente de arranque ≈ ${fmt(m.Iarranque / 3)} A. Regla práctica: confirma con catálogo.`)}
      ${kvar ? s('Compensación', `Para pasar de cos φ ${v.cosfi} a ${v.cosfi2}: ≈ ${fmt(kvar.Qc, 1)} kVAr (calculado con la potencia absorbida). En motores se compensa con cuidado para evitar sobretensiones al desconectar: verifica con el fabricante.`) : ''}
      </div>
      <p class="muted mini">Cálculo orientativo. ITC-BT-47: un solo motor, conductor al 125 % de la intensidad a plena carga; varios motores, 125 % del mayor más los demás.</p>`;
  }

  function pCalc() {
    const f = (id, l, v, extra) => `<div><label for="${id}">${l}</label><input id="${id}" ${extra || ''} value="${v}"></div>`;
    $('#mp').innerHTML = `<div class="form">
      ${f('m_P', 'Potencia en el eje (kW)', 7.5, 'type="number" step="0.01" min="0.05"')}
      <div><label for="m_s">Sistema</label><select id="m_s"><option value="tri">Trifásico 400 V</option><option value="mono">Monofásico 230 V</option></select></div>
      ${f('m_c', 'cos φ', 0.85, 'type="number" step="0.01" min="0.3" max="1"')}
      ${f('m_r', 'Rendimiento η', 0.9, 'type="number" step="0.01" min="0.3" max="1"')}
      ${f('m_i', 'Ia/In (placa o catálogo)', 6, 'type="number" step="0.1" min="1"')}
      ${f('m_l', 'Longitud de línea (m)', 30, 'type="number" min="1"')}
      <div><label for="m_a">Aislamiento</label><select id="m_a"><option value="PVC">PVC (70 ºC)</option><option value="XLPE">XLPE (90 ºC)</option></select></div>
      <div><label for="m_m">Método de instalación</label><select id="m_m">${Object.entries(C.METODOS).map(([k, x]) => `<option value="${k}" ${k === 'B' ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select></div>
      ${f('m_o', 'Otros motores: In en A separadas por comas (opcional)', '', 'placeholder="p. ej. 12, 8"')}
      ${f('m_c2', 'cos φ deseado (compensación, opcional)', '', 'type="number" step="0.01" placeholder="0,95"')}</div><div id="mr" aria-live="polite"></div>`;
    const go = () => { const n = id => parseFloat(String($('#' + id).value).replace(',', '.')); const v = { P: n('m_P'), sis: $('#m_s').value, cosfi: n('m_c'), rend: n('m_r'), iaIn: n('m_i'), L: n('m_l'), aisl: $('#m_a').value, metodo: $('#m_m').value, otros: $('#m_o').value, cosfi2: n('m_c2') || 0 };
      $('#mr').innerHTML = v.P > 0 && v.cosfi > 0 && v.rend > 0 ? calcular(v) : '<p class="muted">Introduce valores válidos.</p>'; };
    $$('#mp input,#mp select').forEach(x => x.oninput = x.onchange = go); go();
  }

  /* ------------------------------------------------------------ otras pestañas */
  function pArr() {
    $('#mp').innerHTML = `<p class="muted">Pulsa «Crear esquema» para abrir el esquema completo (potencia y mando) en el editor y modificarlo.</p>` + ARRANQUES.map(a => `<details><summary>${a.n}</summary><div>
      <p>${a.cuando}</p><div class="kv"><div><b>Corriente de arranque</b><span>${a.ia}</span></div><div><b>Par de arranque</b><span>${a.par}</span></div></div>
      <p><b>Ventajas:</b> ${a.pro.join('; ')}.</p><p><b>Inconvenientes:</b> ${a.con.join('; ')}.</p><p><b>Componentes:</b> ${a.comp}.</p>
      ${PLANTILLAS[a.id] ? `<button class="btn pri sm" data-p="${a.id}">Crear esquema editable</button>` : '<p class="muted mini">Sin plantilla propia: puedes dibujarlo con los símbolos de Motores.</p>'}
      <p class="muted mini">Los valores de corriente y par son típicos y orientativos; los reales dependen del motor.</p></div></details>`).join('');
    $$('[data-p]').forEach(b => b.onclick = () => {
      const m = PLANTILLAS[b.dataset.p](); m.id = uid(); m.tipo = 'motor'; m.nombre = ARRANQUES.find(a => a.id === b.dataset.p).n; m.mod = Date.now();
      const l = store.get('esquemas', []); l.push(m); store.set('esquemas', l); location.hash = '#/esquemas/' + m.id;
    });
  }
  function pCon() {
    const br = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--accent)" opacity=".85"/>`;
    const box = (modo) => {
      const top = ['W2', 'U2', 'V2'], bot = ['U1', 'V1', 'W1'], xs = [60, 140, 220];
      const t = (l, x, y) => `<g><circle cx="${x}" cy="${y}" r="10" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><text x="${x}" y="${y + 4}" font-size="10" text-anchor="middle" fill="var(--text)" font-weight="700">${l}</text></g>`;
      const link = modo === 'e' ? br(52, 28, 176, 8) : xs.map(x => br(x - 4, 38, 8, 50)).join('');
      return `<svg viewBox="0 0 280 170" role="img" aria-label="${modo === 'e' ? 'Conexión en estrella' : 'Conexión en triángulo'}" style="max-width:300px;width:100%">${link}${top.map((l, i) => t(l, xs[i], 32)).join('')}${bot.map((l, i) => t(l, xs[i], 92)).join('')}${['L1', 'L2', 'L3'].map((l, i) => `<path d="M${xs[i]} 102V132" stroke="var(--text)" stroke-width="2"/><text x="${xs[i]}" y="150" font-size="12" text-anchor="middle" fill="var(--text)" font-weight="700">${l}</text>`).join('')}</svg>`;
    };
    $('#mp').innerHTML = `<p>La placa de bornas de un motor trifásico tiene seis bornas. Los puentes deciden si los bobinados quedan en <b>estrella</b> o en <b>triángulo</b>.</p>
      <div class="grid g2"><div class="card"><h3>Estrella (Y)</h3>${box('e')}<p>Un puente horizontal une W2, U2 y V2.</p></div><div class="card"><h3>Triángulo (Δ)</h3>${box('d')}<p>Tres puentes verticales: W2-U1, U2-V1, V2-W1.</p></div></div>
      <h3>¿Cuál uso?</h3><div class="card"><p>Mira la placa: el motor indica dos tensiones, por ejemplo 400/690 V. La menor es la que soporta cada bobinado, la mayor la que soporta el motor conectado en estrella.</p>
      <ul><li><b>Placa 230/400 V</b> en red de 400 V: conexión en <b>estrella</b>.</li><li><b>Placa 400/690 V</b> en red de 400 V: conexión en <b>triángulo</b> (y se puede arrancar en estrella-triángulo).</li></ul></div>
      <h3>Sentido de giro</h3><div class="card"><p>Para invertir el giro de un motor trifásico se permutan dos de las tres fases de alimentación.</p></div>
      <p class="muted mini">Disposición habitual de las bornas; comprueba siempre la placa y el esquema del fabricante.</p>`;
  }
  function pAv() {
    $('#mp').innerHTML = `<div class="tw"><table><thead><tr><th>Síntoma</th><th>Causas probables</th><th>Qué comprobar</th></tr></thead><tbody>${AVERIAS.map(a => `<tr><td><b>${a[0]}</b></td><td>${a[1]}</td><td>${a[2]}</td></tr>`).join('')}</tbody></table></div><p class="muted mini">Desconecta y bloquea la alimentación antes de abrir la caja de bornas. Las mediciones con tensión solo las hace personal cualificado.</p>`;
  }
  function pChk() {
    const st = store.get('motor.chk', {});
    $('#mp').innerHTML = `<p>Lista antes del primer arranque. Se guarda en este dispositivo.</p>${CHECK.map((t, i) => `<label class="dl" style="cursor:pointer"><input type="checkbox" data-c="${i}" ${st[i] ? 'checked' : ''}> <span>${t}</span></label>`).join('')}<button class="btn sm" id="mc">Limpiar marcas</button>`;
    $$('[data-c]').forEach(c => c.onchange = () => { const s = store.get('motor.chk', {}); s[c.dataset.c] = c.checked; store.set('motor.chk', s); });
    $('#mc').onclick = () => { store.set('motor.chk', {}); pChk(); };
  }
  function pTest() {
    $('#mp').innerHTML = `<div class="card"><h3>Preguntas sobre motores</h3><p>Preguntas del banco que tratan de la ITC-BT-47: conductores al 125 %, relación Ia/In, protección contra falta de tensión y arranques.</p></div><div class="row" style="margin-top:10px"><a class="btn pri" href="#/test">Ir al examen</a></div>`;
  }

  const TABS = [['calc', 'Calculadora', pCalc], ['arr', 'Arranques', pArr], ['con', 'Conexionado', pCon], ['ave', 'Averías', pAv], ['chk', 'Antes de arrancar', pChk], ['tst', 'Preguntas', pTest]];
  route(/^#\/motores$/, () => {
    const cur = store.get('motor.tab', 'calc');
    view.innerHTML = `<h1>Motores eléctricos</h1><p class="lead">Cálculo de intensidad, conductor y aparamenta; tipos de arranque con esquemas que se abren en el editor; conexionado de la caja de bornas, averías y comprobaciones. Basado en la ITC-BT-47.</p>
      <div class="chips" role="tablist">${TABS.map(([k, t]) => `<button class="chip ${cur === k ? 'on' : ''}" role="tab" data-t="${k}">${t}</button>`).join('')}</div><div id="mp"></div>`;
    const show = k => { store.set('motor.tab', k); $$('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === k)); TABS.find(t => t[0] === k)[2](); };
    $$('[data-t]').forEach(b => b.onclick = () => show(b.dataset.t)); show(cur);
  });
});
