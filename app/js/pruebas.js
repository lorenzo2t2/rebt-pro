/* Pruebas y verificaciones: cómo se hace cada una, paso a paso (ITC-BT-05, ITC-BT-18, ITC-BT-19, ITC-BT-24 y UNE 20460-6-61). */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, esc, fmt, num, view, $, $$ } = A;

  const SEG = ['Trabaja siempre sin tensión: desconecta, bloquea, verifica ausencia de tensión con un detector bipolar (comprueba antes y después que funciona) y señaliza (cinco reglas de oro, RD 614/2001).', 'Desconecta o retira los receptores sensibles (variadores, fuentes electrónicas, equipos con protección contra sobretensiones) antes de aplicar tensión de ensayo.'];

  const PRUEBAS = [
    {
      id: 'visual', ic: '👁️', n: 'Inspección visual previa', itc: 'ITC-BT-05 · UNE 20460-6-61', cuando: 'Siempre, antes de medir nada.',
      equipo: ['Planos / esquema unifilar', 'Linterna, destornilladores aislados'],
      seg: [],
      pasos: ['Comprueba que el material tiene marcado CE y es el del proyecto o la memoria.', 'Revisa los colores: azul claro neutro, verde-amarillo protección, marrón/negro/gris fases.', 'Verifica secciones, tubos y cajas según el proyecto y las ITC-BT-19, 20 y 21.', 'Comprueba que los PIA, diferenciales y ICP corresponden a los calibres de cada circuito.', 'Revisa conexiones de tierra: bornes, equipotencialidad en baño y cocina, conductor de protección en todos los mecanismos.', 'Comprueba cuadros: rotulación de circuitos, grado IP, tapas, precintos y placa del instalador.'],
      criterio: 'Todo coincide con la documentación técnica y con las ITC aplicables. Cualquier discrepancia se corrige antes de pasar a las medidas.',
      errores: ['Medir antes de revisar y descubrir luego un circuito mal conectado.', 'Mecanismos sin conductor de protección conectado.'],
      reg: 'Informe de verificación → “Comprobaciones”.',
    },
    {
      id: 'continuidad', ic: '🔗', n: 'Continuidad de conductores de protección y equipotencialidad', itc: 'UNE 20460-6-61 · ITC-BT-18 · ITC-BT-26',
      cuando: 'Previa a la puesta en servicio, con la instalación sin tensión.',
      equipo: ['Medidor de continuidad (ohmímetro de baja resistencia) con corriente de ensayo ≥ 200 mA', 'Cables de prueba compensados'],
      seg: SEG.slice(0, 1),
      pasos: ['Anula la resistencia de los cables de prueba (función “null”) uniendo las puntas.', 'Conecta una punta al borne principal de tierra (o al cuadro) y la otra al conductor de protección en el punto más alejado de cada circuito (último enchufe, masa metálica).', 'Mide cada circuito y anota el valor. Repite en las uniones equipotenciales del baño (tuberías, bañera, desagües) y en la cocina.', 'Si el valor es alto o inestable, revisa bornes sueltos o empalmes.'],
      criterio: 'La resistencia debe ser muy baja (del orden de decenas de miliohmios hasta 1–2 Ω según longitud y sección) y estable. No hay valor único en el REBT: debe ser coherente con la sección y longitud del conductor medido.',
      errores: ['No compensar los cables de prueba.', 'Medir con corriente demasiado baja (puede dar buena lectura con una unión defectuosa).'],
      reg: 'Informe de verificación → tabla de mediciones, columna “Cont. PE (Ω)”.',
    },
    {
      id: 'aislamiento', ic: '🧱', n: 'Resistencia de aislamiento', itc: 'ITC-BT-19 §2.9', cuando: 'Antes de energizar y en inspecciones periódicas.',
      equipo: ['Medidor de aislamiento (megóhmetro) con tensión de ensayo seleccionable'],
      seg: SEG,
      pasos: ['Con la instalación desconectada de la red, abre todos los interruptores del cuadro, desconecta receptores y deja cerrados los mecanismos de los circuitos (lámparas fuera).', 'Selecciona la tensión de ensayo según la tensión nominal: 250 V para MBTS/MBTP, 500 V hasta 500 V, 1000 V por encima de 500 V.', 'Mide entre cada conductor activo y tierra, con los conductores activos unidos entre sí si la instalación lo permite. Si no, mide también entre conductores activos.', 'Mantén la tensión hasta que la lectura se estabilice (unos 5–10 s) y anota el valor.', 'Descarga la instalación al terminar (los cables acumulan carga).'],
      criterio: 'Mínimo: 0,25 MΩ (250 V, MBTS/MBTP), 0,5 MΩ (500 V, tensión nominal ≤ 500 V), 1 MΩ (1000 V, tensión nominal > 500 V). En una instalación bien hecha se miden decenas o cientos de MΩ.',
      errores: ['Medir con receptores o lámparas conectados (el valor baja o se dañan).', 'No retirar protecciones contra sobretensiones.', 'Medir con tensión de ensayo equivocada.'],
      reg: 'Informe de verificación → “Aislam. (MΩ)”. Evaluación automática en la herramienta de abajo.',
      herr: 'aisl',
    },
    {
      id: 'rigidez', ic: '⚡', n: 'Rigidez dieléctrica', itc: 'ITC-BT-19 §2.9', cuando: 'Solo cuando se exija (ensayo de recepción); no es habitual en viviendas.',
      equipo: ['Equipo de ensayo dieléctrico (hipot) de tensión alterna a frecuencia industrial'],
      seg: SEG,
      pasos: ['Con la instalación desconectada de la red y de los receptores, aplica la tensión de ensayo entre cada conductor activo y tierra, y entre activos, durante 1 minuto.', 'La tensión de ensayo es 2U + 1000 V a frecuencia industrial, con un mínimo de 1500 V (U = tensión máxima de servicio).', 'Observa que no se produzca descarga ni disrupción.'],
      criterio: 'No debe haber perforación ni contorneamiento. Corriente de fuga durante el ensayo no superior a 1 mA por cada circuito ensayado, para cada nivel de tensión.',
      errores: ['Aplicar la tensión con receptores electrónicos conectados.', 'No señalizar la zona durante el ensayo.'],
      reg: 'Observaciones del informe.',
    },
    {
      id: 'tierra', ic: '🌍', n: 'Resistencia de puesta a tierra', itc: 'ITC-BT-18 · ITC-BT-24 · ITC-BT-26', cuando: 'Siempre en la puesta en servicio y en revisiones; mejor con terreno en condiciones normales de humedad.',
      equipo: ['Telurómetro de 3 o 4 hilos (método de caída de potencial) con dos picas auxiliares', 'o pinza medidora de tierra (en sistemas con varios caminos de retorno)'],
      seg: ['Mide con la línea de tierra desconectada del cuadro solo si el método y el equipo lo permiten con seguridad; nunca abras la tierra con la instalación en tensión sin ayuda de equipos adecuados.'],
      pasos: ['Identifica el electrodo o la barra de medida de la toma de tierra.', 'Clava la pica de corriente (C) a una distancia suficiente del electrodo (típicamente ≥ 20–30 m, o 5 veces la dimensión mayor del electrodo).', 'Clava la pica de potencial (P) en línea, aproximadamente al 62 % de la distancia entre el electrodo y C.', 'Conecta los cables (E–P–C), realiza la medida y repítela con P desplazada ±10 % para comprobar que el resultado es estable (misma resistencia).', 'Anota el valor y las condiciones del terreno (seco, húmedo, lluvia reciente).', 'Verifica que el valor medido cumple R ≤ Uc / IΔn (en esquema TT).'],
      criterio: 'La resistencia debe garantizar que la tensión de contacto no supere 50 V (24 V en locales húmedos o conductores): R ≤ 50 / IΔn. Con diferencial de 30 mA el máximo teórico es 1667 Ω, pero en la práctica se busca un valor mucho menor para tener margen con el terreno seco. Para tomas de tierra de masas de un centro de transformación o de viviendas, consulta además el valor exigido en la ITC-BT-18 y en el proyecto.',
      errores: ['Picas auxiliares demasiado cerca del electrodo (zonas de influencia solapadas).', 'Medir con el terreno helado o muy seco y creer que el valor es el de peor caso.', 'Cables de prueba mal conectados.'],
      reg: 'Informe de verificación → “Resistencia de puesta a tierra (Ω)”. La herramienta de abajo calcula el máximo admisible.',
      herr: 'tierra',
    },
    {
      id: 'bucle', ic: '🔁', n: 'Impedancia del bucle de defecto (Zs)', itc: 'ITC-BT-24 · UNE 20460-4-41', cuando: 'Esquemas TN y, como comprobación, en TT.',
      equipo: ['Medidor de impedancia de bucle (puede ir integrado en el multifunción)'],
      seg: ['Esta medida se hace CON TENSIÓN: usa el equipo certificado y las puntas aisladas.'],
      pasos: ['Conecta el equipo en el último punto de cada circuito: entre fase y conductor de protección (bucle fase-PE) o fase-neutro para impedancia de línea.', 'Selecciona la tensión nominal y el tipo de medida (sin disparo de diferencial si el equipo lo permite).', 'Lee Zs y la corriente de cortocircuito prevista; anota ambos.', 'Compara Zs con el máximo admisible para el PIA del circuito: Zs ≤ U0 / Ia, donde Ia = corriente de disparo magnético (curva B: 5·In, C: 10·In, D: 20·In para el cálculo más desfavorable).'],
      criterio: 'Zs · Ia ≤ U0 (230 V). Así el interruptor magnetotérmico abre dentro del tiempo máximo exigido (TN: 0,4 s para circuitos finales ≤ 32 A a 230 V; 5 s en distribución).',
      errores: ['Medir con diferencial conectado sin función anti-disparo (lo dispara).', 'No sumar la resistencia de los empalmes defectuosos.'],
      reg: 'Informe de verificación → “Bucle Zs (Ω)”. La herramienta de abajo calcula el máximo.',
      herr: 'bucle',
    },
    {
      id: 'diferencial', ic: '🛡️', n: 'Disparo de interruptores diferenciales', itc: 'ITC-BT-24 · UNE-EN 61008 / 61009', cuando: 'En la puesta en servicio y periódicamente (botón de test al menos mensual).',
      equipo: ['Comprobador de diferenciales (RCD tester)'],
      seg: ['Ensayo con tensión. Avisa a los usuarios: se interrumpe el suministro del circuito.'],
      pasos: ['Pulsa el botón de test del diferencial: debe disparar.', 'Conecta el comprobador a una toma del circuito protegido por el diferencial (fase, neutro y PE).', 'Selecciona IΔn (30 mA, 300 mA…) y la forma de onda (tipo AC, A).', 'Ensayo a 0,5 · IΔn: no debe disparar.', 'Ensayo a 1 · IΔn: debe disparar; anota el tiempo (máx. 300 ms para uso general).', 'Ensayo a 5 · IΔn: debe disparar en ≤ 40 ms (para diferenciales de uso general, tipo instantáneo).', 'Opcional: con la rampa, anota la corriente de disparo, que debe estar entre 0,5 y 1 · IΔn.'],
      criterio: 'No dispara a 0,5·IΔn; dispara a IΔn en ≤ 300 ms (instantáneo); a 2·IΔn ≤ 150 ms; a 5·IΔn ≤ 40 ms. Corriente de disparo en rampa entre 0,5·IΔn y IΔn.',
      errores: ['Probar solo con el botón de test (no verifica la puesta a tierra ni el disparo real).', 'Probar un circuito con receptores alimentados (se dañan o falsean la medida).'],
      reg: 'Informe de verificación → “Disparo dif. (mA)” y “Tiempo (ms)”.',
    },
    {
      id: 'contacto', ic: '🔌', n: 'Tensión de contacto', itc: 'ITC-BT-18 · ITC-BT-24', cuando: 'Si el comprobador lo permite, junto con el disparo del diferencial.',
      equipo: ['Comprobador multifunción con medida de tensión de contacto (Uc)'],
      seg: ['Medida con tensión: usa equipo certificado.'],
      pasos: ['Conecta el comprobador a la toma o a la masa que quieres verificar (circuito con PE).', 'Selecciona el diferencial instalado (IΔn).', 'El equipo inyecta una corriente inferior a la de disparo y calcula Uc, la tensión que aparecería en la masa en caso de defecto.', 'Anota el valor y compáralo con el límite.'],
      criterio: 'Uc ≤ 50 V en condiciones normales; ≤ 24 V en locales o emplazamientos conductores o húmedos.',
      errores: ['Confundir la tensión de contacto con la tensión de paso.', 'No indicar el IΔn real al equipo.'],
      reg: 'Observaciones del informe.',
    },
    {
      id: 'caida', ic: '📉', n: 'Caída de tensión en carga', itc: 'ITC-BT-19 · ITC-BT-14 a 17', cuando: 'En instalaciones largas o cuando el proyecto lo exija.',
      equipo: ['Multímetro o analizador de redes', 'Carga conocida (resistencia de carga o consumo real)'],
      seg: ['Medida con tensión: puntas aisladas y categorías de medida adecuadas.'],
      pasos: ['Mide la tensión en el cuadro con la instalación en vacío y anótala (U0).', 'Conecta la carga de ensayo o pon los receptores en marcha y mide de nuevo en el punto más alejado (U1).', 'Calcula ΔU(%) = (U0 − U1) / U0 · 100.', 'Compáralo con los límites de la ITC: 3 % viviendas e interior, 0,5–1,5 % en DI y LGA.'],
      criterio: 'ΔU ≤ límite de cada tramo (ver pestaña Tablas → Caídas de tensión máximas).',
      errores: ['Medir con cargas intermitentes que cambian la lectura.', 'No compensar la tensión de red variable (mide U0 y U1 casi a la vez).'],
      reg: 'Informe de verificación → CIE → “Caída de tensión máx. medida (%)”.',
    },
    {
      id: 'polaridad', ic: '🧭', n: 'Polaridad y secuencia de fases', itc: 'ITC-BT-19 · UNE 20460-6-61', cuando: 'En todas las instalaciones; la secuencia en trifásicas.',
      equipo: ['Comprobador de polaridad (o multímetro)', 'Indicador de secuencia de fases (trifásica)'],
      seg: ['Medida con tensión: precaución con puntas.'],
      pasos: ['Con tensión, comprueba en cada toma y portalámparas que la fase está en el contacto correcto y el neutro en el otro.', 'Verifica que los interruptores unipolares cortan la fase (no el neutro).', 'En trifásica, conecta el indicador de secuencia en la entrada y comprueba el orden L1-L2-L3 (giro correcto de motores).', 'Comprueba tensión fase-neutro (230 V) y fase-fase (400 V).'],
      criterio: 'Fase en el borne correcto, neutro y PE sin inversiones. Secuencia directa en los receptores trifásicos que la exigen.',
      errores: ['Cortar el neutro en lugar de la fase.', 'Cambiar dos fases y hacer girar un motor al revés.'],
      reg: 'Informe de verificación → “Comprobaciones”.',
    },
    {
      id: 'spd', ic: '☁️', n: 'Protección contra sobretensiones y alumbrado de emergencia', itc: 'ITC-BT-23 · ITC-BT-28', cuando: 'Cuando la instalación los incluya.',
      equipo: ['Luxómetro (emergencia)', 'Detector de estado de varistores o indicador del SPD'],
      seg: SEG.slice(0, 1),
      pasos: ['SPD: comprueba que el indicador muestra estado correcto y que su protección asociada está bien calibrada.', 'Emergencia: corta el suministro normal, comprueba que se enciende en el tiempo requerido (≤ 5 s), que dura al menos 1 hora y mide el nivel de iluminación (1 lux en ejes de evacuación, 5 lux en cuadros y puntos de seguridad).', 'Restablece el suministro y comprueba que los equipos de emergencia se recargan.'],
      criterio: 'SPD operativo y correctamente protegido; alumbrado de emergencia con los niveles y tiempos exigidos.',
      errores: ['No probar la autonomía real.', 'No comprobar la protección asociada al SPD.'],
      reg: 'Informe de verificación → “Comprobaciones”.',
    },
  ];

  /* ---- herramientas rápidas ---- */
  const HERR = {
    aisl: () => `<div class="form"><div><label>Tensión de ensayo</label><select id="h_u"><option value="0.25">250 V (MBTS/MBTP) → mín. 0,25 MΩ</option><option value="0.5" selected>500 V (≤ 500 V) → mín. 0,5 MΩ</option><option value="1">1000 V (&gt; 500 V) → mín. 1 MΩ</option></select></div><div><label>Valor medido (MΩ)</label><input id="h_v" inputmode="decimal"></div></div><div id="h_r"></div>`,
    tierra: () => `<div class="form"><div><label>Tensión de contacto límite</label><select id="h_u"><option value="50">50 V</option><option value="24">24 V (local conductor)</option></select></div><div><label>IΔn (mA)</label><input id="h_i" inputmode="decimal" value="30"></div><div><label>Valor medido (Ω)</label><input id="h_v" inputmode="decimal"></div></div><div id="h_r"></div>`,
    bucle: () => `<div class="form"><div><label>Curva del PIA</label><select id="h_c"><option value="5">B (5·In)</option><option value="10" selected>C (10·In)</option><option value="20">D (20·In)</option></select></div><div><label>In (A)</label><input id="h_i" inputmode="decimal" value="16"></div><div><label>U0 (V)</label><input id="h_u" inputmode="decimal" value="230"></div><div><label>Zs medido (Ω)</label><input id="h_v" inputmode="decimal"></div></div><div id="h_r"></div>`,
  };
  function bind(kind) {
    const upd = () => {
      const g = id => num(($('#' + id) || {}).value); const r = $('#h_r'); let html = '';
      const v = g('h_v');
      if (kind === 'aisl') { const m = g('h_u'); if (!isNaN(v)) html = v >= m ? `<div class="note ok">✔ ${fmt(v)} MΩ ≥ ${m} MΩ: CUMPLE</div>` : `<div class="note bad">✖ ${fmt(v)} MΩ &lt; ${m} MΩ: NO CUMPLE. Busca humedad, empalmes o receptores conectados.</div>`; }
      if (kind === 'tierra') { const u = g('h_u'), i = g('h_i'); if (i > 0) { const mx = u / (i / 1000); html = `<div class="result"><div>Resistencia máxima teórica: <b>${fmt(mx, 0)} Ω</b></div>` + (!isNaN(v) ? `<p class="${v <= mx ? 'ok' : 'ko'}" style="font-weight:800">${v <= mx ? '✔ CUMPLE' : '✖ NO CUMPLE'}: ${fmt(v)} Ω</p>` : '') + `<p class="muted">En la práctica se busca un valor muy inferior, para tener margen con el terreno seco.</p></div>`; } }
      if (kind === 'bucle') { const k = g('h_c'), i = g('h_i'), u = g('h_u'); if (k > 0 && i > 0 && u > 0) { const ia = k * i, mx = u / ia; html = `<div class="result"><div>Ia = <b>${fmt(ia, 0)} A</b> → Zs máx = <b>${fmt(mx, 2)} Ω</b></div>` + (!isNaN(v) ? `<p class="${v <= mx ? 'ok' : 'ko'}" style="font-weight:800">${v <= mx ? '✔ CUMPLE' : '✖ NO CUMPLE'}: ${fmt(v, 2)} Ω</p>` : '') + `</div>`; } }
      r.innerHTML = html;
    };
    $$('#herr input,#herr select').forEach(e => e.oninput = upd); upd();
  }

  /* ---- vistas ---- */
  route(/^#\/pruebas$/, () => {
    view.innerHTML = `<h1>Cómo se hace cada prueba</h1><p class="lead">Guía paso a paso de las verificaciones previas a la puesta en servicio y de las inspecciones: qué equipo usar, cómo conectarlo, qué valor debe salir y qué errores evitar. Toca una prueba para abrirla.</p>
    <div class="note">🔒 La mayoría se hacen sin tensión. Aplica siempre las cinco reglas de oro antes de tocar la instalación.</div>
    <div class="grid g2">${PRUEBAS.map(p => `<a class="card" href="#/pruebas/${p.id}"><h3>${p.ic} ${esc(p.n)}</h3><p>${esc(p.itc)}</p></a>`).join('')}</div>
    <h2>Orden recomendado</h2>
    <ol><li>Inspección visual</li><li>Continuidad de PE y equipotencialidad</li><li>Aislamiento</li><li>Polaridad y secuencia de fases</li><li>Resistencia de tierra</li><li>Bucle de defecto (si procede)</li><li>Diferenciales y tensión de contacto</li><li>Caída de tensión y comprobaciones finales</li></ol>
    <p class="muted">Los valores de esta sección están basados en el REBT (ITC-BT-19, ITC-BT-24…) y en UNE 20460-6-61; para el procedimiento exacto de tu equipo de medida consulta su manual.</p>`;
  });

  route(/^#\/pruebas\/([\w]+)$/, id => {
    const i = PRUEBAS.findIndex(p => p.id === id); if (i < 0) { view.innerHTML = '<p>No encontrada. <a href="#/pruebas">Volver</a></p>'; return; }
    const p = PRUEBAS[i]; const prev = PRUEBAS[i - 1], next = PRUEBAS[i + 1];
    const list = (a, cls) => a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="muted">—</p>';
    view.innerHTML = `<p><a href="#/pruebas">← Todas las pruebas</a></p><h1>${p.ic} ${esc(p.n)}</h1><p><span class="tag itc">${esc(p.itc)}</span></p><p class="lead">${esc(p.cuando)}</p>
    ${p.seg.length ? `<div class="note bad"><b>Seguridad:</b><ul style="margin:6px 0 0;padding-left:20px">${p.seg.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
    <h2>Equipo necesario</h2>${list(p.equipo)}
    <h2>Procedimiento</h2><ol class="ficha">${p.pasos.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <div class="clave"><b>Criterio de aceptación.</b> ${esc(p.criterio)}</div>
    ${p.herr ? `<h2>Comprobación rápida</h2><div class="card" id="herr">${HERR[p.herr]()}</div>` : ''}
    <h2>Errores típicos</h2>${list(p.errores)}
    <p class="muted"><b>Dónde se anota:</b> ${esc(p.reg)} <a href="#/crear">Crear informe →</a></p>
    <div class="row" style="margin-top:18px">${prev ? `<a class="btn" href="#/pruebas/${prev.id}">← ${esc(prev.n)}</a>` : ''}<span class="sp"></span>${next ? `<a class="btn pri" href="#/pruebas/${next.id}">${esc(next.n)} →</a>` : ''}</div>`;
    if (p.herr) bind(p.herr);
  });
});
