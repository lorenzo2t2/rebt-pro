/* Biblioteca ampliada de símbolos para el editor de esquemas (se carga antes de esquemas.js).
   Trazos inspirados en la simbología UNE-EN 60617; son representaciones didácticas, no copias de la norma.
   Convención: coordenadas locales, entrada arriba (y<0) y salida abajo (y>0). pre = prefijo de designación; u = uso. */
(function () {
  'use strict';
  const T = (x, y, s) => `<text x="${x}" y="${y}" font-size="${s || 9}" text-anchor="middle" stroke="none" fill="#111" font-family="Arial,sans-serif" font-weight="700">`;
  const L = '<path d="M0-30V-8M0 30V8"/>';                 // patillas de un contacto
  const NA = L + '<path d="M0 8L-9-8"/>';                  // contacto abierto
  const NC = L + '<path d="M0 8L-9-8M-9-8H0"/>';           // contacto cerrado
  const LK = (x) => `<path d="M-4 0H${x}" stroke-dasharray="2 2"/>`; // enlace mecánico
  const lead = (a, b) => `<path d="M0${a}V${b}"/>`;
  const P3 = f => [-14, 0, 14].map(x => `<g transform="translate(${x} 0)">${f}</g>`).join('');
  const link3 = y => `<path d="M-14 ${y}H14" stroke-dasharray="2 2"/>`;
  const Q = {};
  const add = (k, n, c, l, pre, u, d, inn, out, extra) => { Q[k] = Object.assign({ n, c, l, pre, u, d, in: inn, out }, extra || {}); };
  const V = [0, -30], O = [0, 30];

  /* ---------------- Mando y señalización ---------------- */
  add('cna', 'Contacto abierto (NA)', 'Mando', 'KM1', 'KM', 'Contacto de cierre. Se cierra al activarse su bobina o mando (bornas 13-14).', () => NA, V, O);
  add('cnc', 'Contacto cerrado (NC)', 'Mando', 'KM1', 'KM', 'Contacto de apertura. Se abre al activarse (bornas 11-12, 95-96 en el térmico).', () => NC, V, O);
  add('cnat', 'Contacto NA temporizado (a la conexión)', 'Mando', 'KT1', 'KT', 'Cierra con retardo tras energizar la bobina del temporizador (bornas 17-18).', () => NA + '<path d="M-6-1A4 4 0 0 0 2-1" fill="none"/>', V, O);
  add('cnct', 'Contacto NC temporizado (a la conexión)', 'Mando', 'KT1', 'KT', 'Abre con retardo tras energizar el temporizador (bornas 15-16).', () => NC + '<path d="M-6-1A4 4 0 0 0 2-1" fill="none"/>', V, O);
  add('pna', 'Pulsador NA (marcha)', 'Mando', 'S1', 'S', 'Pulsador de marcha, normalmente abierto. Por norma suele ser verde.', () => NA + LK(-16) + '<path d="M-16-5V5"/>', V, O);
  add('pnc', 'Pulsador NC (paro)', 'Mando', 'S0', 'S', 'Pulsador de paro, normalmente cerrado. Por norma suele ser rojo.', () => NC + LK(-16) + '<path d="M-16-5V5"/>', V, O);
  add('seta', 'Parada de emergencia (seta)', 'Mando', 'S0', 'S', 'Seta de emergencia con enclavamiento: corta el mando.', () => NC + LK(-14) + '<path d="M-24 0a8 8 0 0 1 16 0z" fill="#fff"/><path d="M-16 0v4"/>', V, O);
  add('sel', 'Selector de 2 posiciones', 'Mando', 'S2', 'S', 'Selector rotativo manual-automático o 0-1.', () => NA + LK(-14) + '<circle cx="-18" cy="0" r="4" fill="#fff"/><path d="M-18 0l5-3"/>', V, O);
  add('fdc', 'Final de carrera', 'Mando', 'B1', 'B', 'Detector de posición con rodillo; actúa al llegar el móvil.', () => NA + LK(-14) + '<circle cx="-18" cy="0" r="4" fill="#fff"/>', V, O);
  add('bob', 'Bobina de contactor', 'Mando', 'KM1', 'KM', 'Bobina (A1-A2). Al recibir tensión cierra los contactos principales y auxiliares del contactor.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/>`, V, O);
  add('rel', 'Relé auxiliar (bobina)', 'Mando', 'KA1', 'KA', 'Bobina de relé auxiliar de mando.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/><path d="M-14-8L14 8"/>`, V, O);
  add('temp', 'Temporizador (bobina)', 'Mando', 'KT1', 'KT', 'Bobina de temporizador (retardo a la conexión): base del arranque estrella-triángulo.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/><path d="M-8-8V8"/>`, V, O);
  add('piloto', 'Piloto luminoso', 'Mando', 'H1', 'H', 'Señalización de estado (marcha, paro, avería).', () => `${lead(-30, -10)}${lead(30, 10)}<circle r="10" fill="#fff"/><path d="M-7-7L7 7M7-7L-7 7"/><path d="M-13-13l-3-3M13-13l3-3"/>`, V, O);
  add('zumb', 'Zumbador / sirena', 'Mando', 'H2', 'H', 'Señal acústica de alarma.', () => `${lead(-30, -10)}<path d="M-10-10H10L10 0A10 10 0 0 1-10 0Z" fill="#fff"/>`, V, [0, 10]);
  add('ev', 'Electroválvula (bobina)', 'Mando', 'Y1', 'Y', 'Bobina de electroválvula o actuador.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/><path d="M-6 4L0-4L6 4Z"/>`, V, O);
  add('ptc', 'Sonda térmica PTC', 'Mando', 'B2', 'B', 'Termistor del bobinado del motor: protege contra sobretemperatura.', () => `${lead(-30, -10)}${lead(30, 10)}<rect x="-10" y="-10" width="20" height="20" fill="#fff"/><path d="M-6 5H-2L5-5" />`, V, O);
  add('nodo', 'Nudo de conexión', 'Mando', '', '', 'Punto donde se unen varias líneas (p. ej. dos contactos en paralelo).', e => `<path d="M${-(e.w || 80) / 2} 0H${(e.w || 80) / 2}" stroke-width="1.6"/>`, [0, 0], [0, 0], { bus: true });

  /* ---------------- Instalación (viviendas y locales) ---------------- */
  const FLG = n => '<path d="M3-3L13-13"/>' + (n > 0 ? '<path d="M13-13l-5 0"/>' : '') + (n > 1 ? '<path d="M-3 3L-13 13"/><path d="M-13 13l5 0"/>' : '') + (n > 2 ? '<path d="M3 3L13 13M3 3l0 0"/>' : '');
  const SWB = n => `${lead(-30, -4)}<circle r="4" fill="#111"/>` + FLG(n);
  add('sw1', 'Interruptor unipolar', 'Instalación', 'I', 'I', 'Enciende y apaga un punto de luz desde un solo lugar.', () => SWB(1), V, [0, 4]);
  add('sw2', 'Conmutador', 'Instalación', 'C', 'C', 'Gobierna un punto de luz desde dos lugares (pareja de conmutadores).', () => SWB(2), V, [0, 4]);
  add('swc', 'Conmutador de cruzamiento', 'Instalación', 'CR', 'CR', 'Se intercala entre dos conmutadores para gobernar desde 3 o más puntos.', () => SWB(3), V, [0, 4]);
  add('swp', 'Pulsador de luz', 'Instalación', 'P', 'P', 'Pulsador de luz; con telerruptor permite múltiples puntos.', () => `${lead(-30, -4)}<circle r="4" fill="#fff"/><path d="M3-3L13-13M13-13l-4-1M13-13l1 4"/>${T(-12, 4, 8)}P</text>`, V, [0, 4]);
  add('reg', 'Regulador de luz', 'Instalación', 'R', 'R', 'Dimmer para regular la intensidad luminosa.', () => SWB(1) + '<path d="M-12 8l8-10v10z" fill="#fff"/>', V, [0, 4]);
  add('tel', 'Telerruptor (bobina)', 'Instalación', 'KE1', 'KE', 'Relé de impulsos: cada pulso de los pulsadores cambia el estado de la luz.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/><path d="M-14 0H14"/>`, V, O);
  add('pir', 'Detector de presencia', 'Instalación', 'DP', 'D', 'Detector de movimiento o presencia para encender luz o alarma.', () => `${lead(-30, -10)}<rect x="-12" y="-10" width="24" height="20" fill="#fff"/><path d="M-6 4a6 6 0 0 1 12 0M-3 4a3 3 0 0 1 6 0"/>`, V, [0, 10]);
  add('tomap', 'Toma de pared (schuko)', 'Instalación', 'TC', 'TC', 'Base de enchufe 16 A con toma de tierra.', () => `${lead(-30, -9)}<circle r="9" fill="#fff"/><path d="M-9 0H9M0 0V9"/>`, V, [0, 9]);
  add('tomas', 'Toma de suelo', 'Instalación', 'TS', 'TS', 'Base de enchufe empotrada en suelo (cajas de suelo).', () => `${lead(-30, -9)}<circle r="9" fill="#fff"/><path d="M-9 0H9M0 0V9"/><path d="M-12-12H12V12H-12Z" stroke-dasharray="3 2"/>`, V, [0, 12]);
  add('tomat', 'Toma de televisión (TV)', 'Instalación', 'TV', 'TV', 'Base de antena/TV.', () => `${lead(-30, -9)}<rect x="-10" y="-9" width="20" height="18" fill="#fff"/>${T(0, 4, 9)}TV</text>`, V, [0, 9]);
  add('tomad', 'Toma de datos (RJ45)', 'Instalación', 'TD', 'TD', 'Base de datos para red.', () => `${lead(-30, -9)}<rect x="-10" y="-9" width="20" height="18" fill="#fff"/>${T(0, 4, 9)}RJ</text>`, V, [0, 9]);
  add('timb', 'Timbre / zumbador de llamada', 'Instalación', 'TB', 'TB', 'Timbre de llamada.', () => `${lead(-30, -8)}<path d="M-10 8A10 12 0 0 1 10 8Z" fill="#fff"/><path d="M-12 8H12"/>`, V, [0, 8]);
  add('foco', 'Foco / aplique', 'Instalación', 'L', 'L', 'Punto de luz fijo (techo o pared).', () => `${lead(-30, -10)}<circle r="10" fill="#fff"/><path d="M-7-7L7 7M7-7L-7 7"/><path d="M-14 0H-10M10 0H14" />`, V, [0, 10]);
  add('fluo', 'Pantalla fluorescente / LED lineal', 'Instalación', 'FL', 'L', 'Luminaria lineal (tubo o panel).', () => `${lead(-30, -6)}<rect x="-6" y="-14" width="12" height="28" fill="#fff"/><path d="M-6 0H6"/>`, V, [0, 14]);
  add('emer', 'Alumbrado de emergencia', 'Instalación', 'AE', 'AE', 'Luminaria de emergencia con batería (ITC-BT-28).', () => `${lead(-30, -10)}<circle r="10" fill="#111"/><path d="M-6-6L6 6M6-6L-6 6" stroke="#fff"/>`, V, [0, 10]);
  add('vent', 'Ventilador / extractor', 'Instalación', 'V', 'V', 'Ventilador o extractor de aire.', () => `${lead(-30, -10)}<circle r="10" fill="#fff"/><path d="M0 0L-7-6M0 0L7-6M0 0V9"/>`, V, [0, 10]);
  add('cdj', 'Caja de derivación', 'Instalación', 'CD', 'CD', 'Caja de registro donde se unen o derivan conductores.', () => `${lead(-30, -8)}<rect x="-10" y="-8" width="20" height="16" fill="#fff"/><path d="M-10-8L10 8M10-8L-10 8"/>`, V, [0, 8]);
  add('cuadro', 'Cuadro de mando y protección', 'Instalación', 'CGMP', 'CGMP', 'Cuadro general de mando y protección de la vivienda o local.', () => `${lead(-30, -14)}<rect x="-14" y="-14" width="28" height="28" fill="#fff"/><path d="M-14 14L14-14"/>`, V, [0, 14]);

  /* ---------------- Protección y medida ---------------- */
  add('sf', 'Seccionador fusible', 'Protección', 'QF1', 'QF', 'Seccionador con fusible incorporado.', () => `${L}<path d="M0 8L-9-8"/><rect x="2" y="-10" width="8" height="20" fill="#fff"/>`, V, O);
  add('gm', 'Guardamotor (magnetotérmico de motor)', 'Protección', 'Q1', 'Q', 'Protege contra cortocircuito y sobrecarga y arranca/para el motor; regulable.', () => `${L}<path d="M0 12L-10-9M-4-17l8 8M4-17l-8 8"/><path d="M-14 0h-6" stroke-dasharray="2 2"/>`, V, O);
  add('rdif', 'Relé diferencial + toroidal', 'Protección', 'RD', 'RD', 'Relé diferencial con transformador toroidal de medida.', () => `${lead(-30, 30)}<circle r="9" fill="#fff"/><path d="M-5 0H5"/><rect x="14" y="-9" width="14" height="18" fill="#fff"/>${T(21, 3, 8)}RD</text>`, V, O);
  add('volt', 'Voltímetro', 'Protección', 'PV', 'P', 'Instrumento de medida de tensión.', () => `${lead(-30, -12)}${lead(30, 12)}<circle r="12" fill="#fff"/>${T(0, 5, 14)}V</text>`, V, O);
  add('amp', 'Amperímetro', 'Protección', 'PA', 'P', 'Instrumento de medida de intensidad.', () => `${lead(-30, -12)}${lead(30, 12)}<circle r="12" fill="#fff"/>${T(0, 5, 14)}A</text>`, V, O);
  add('vat', 'Vatímetro / analizador', 'Protección', 'PW', 'P', 'Medida de potencia o analizador de redes.', () => `${lead(-30, -12)}${lead(30, 12)}<circle r="12" fill="#fff"/>${T(0, 5, 13)}W</text>`, V, O);
  add('tc', 'Transformador de intensidad', 'Protección', 'TI', 'T', 'Reduce la corriente para medida (X/5 A).', () => `${lead(-30, 30)}<circle r="8" fill="#fff"/>`, V, O);
  add('pat', 'Contador trifásico (kWh)', 'Protección', 'CT', 'CT', 'Contador de energía trifásico.', () => `${lead(-30, -16)}${lead(30, 16)}<circle r="16" fill="#fff"/>${T(0, 3, 9)}kWh</text>${T(0, 12, 7)}3~</text>`, V, O);

  /* ---------------- Motores y receptores de fuerza ---------------- */
  add('mot1', 'Motor monofásico', 'Motores', 'M1', 'M', 'Motor de inducción monofásico (con condensador de arranque o marcha).', () => `${lead(-30, -18)}${lead(18, 30)}<circle r="18" fill="#fff"/>${T(0, 3, 13)}M</text>${T(0, 13, 8)}1~</text>`, V, O);
  add('mot2v', 'Motor de 2 velocidades (Dahlander)', 'Motores', 'M1', 'M', 'Motor con polos conmutables; se usa para ventiladores y bombas con dos velocidades.', () => `${lead(-30, -18)}${lead(18, 30)}<circle r="18" fill="#fff"/>${T(0, 3, 13)}M</text>${T(0, 13, 7)}2 vel.</text>`, V, O);
  add('motrb', 'Motor de rotor bobinado (anillos)', 'Motores', 'M1', 'M', 'Motor con anillos rozantes y reóstato rotórico (ITC-BT-47: secundarios al 125 %).', () => `${lead(-30, -18)}${lead(18, 30)}<circle r="18" fill="#fff"/>${T(0, 1, 12)}M</text>${T(0, 11, 7)}3~ ⊚</text>`, V, O);
  add('motcc', 'Motor de corriente continua', 'Motores', 'M1', 'M', 'Motor de corriente continua.', () => `${lead(-30, -18)}${lead(18, 30)}<circle r="18" fill="#fff"/>${T(0, 3, 13)}M</text>${T(0, 13, 8)}=</text>`, V, O);
  add('vfd', 'Variador de frecuencia', 'Motores', 'T1', 'T', 'Convertidor que varía tensión y frecuencia; permite arranque suave, control de velocidad e inversión.', () => `${lead(-30, -14)}${lead(14, 30)}<rect x="-20" y="-14" width="40" height="28" fill="#fff"/><path d="M-20 14L20-14"/>${T(-9, -3, 9)}~</text>${T(9, 10, 9)}~</text>`, V, O, { m3: true });
  add('sst', 'Arrancador estático (suave)', 'Motores', 'T1', 'T', 'Limita la tensión durante el arranque mediante tiristores; rampa de aceleración y deceleración.', () => `${lead(-30, -14)}${lead(14, 30)}<rect x="-20" y="-14" width="40" height="28" fill="#fff"/><path d="M-12 6L-2 6L8-6" />${T(10, 10, 7)}SS</text>`, V, O, { m3: true });
  add('rest', 'Resistencia', 'Motores', 'R1', 'R', 'Resistencia (arranque estatórico, reóstato).', () => `${lead(-30, -12)}${lead(12, 30)}<rect x="-6" y="-12" width="12" height="24" fill="#fff"/>`, V, O);
  add('rvar', 'Reóstato / resistencia variable', 'Motores', 'R1', 'R', 'Resistencia regulable (reóstato de arranque de rotor).', () => `${lead(-30, -12)}${lead(12, 30)}<rect x="-6" y="-12" width="12" height="24" fill="#fff"/><path d="M-12 12L12-12M12-12l-4 0M12-12l0 4"/>`, V, O);
  add('cap', 'Condensador', 'Motores', 'C1', 'C', 'Condensador de arranque/marcha del motor monofásico o de compensación.', () => `${lead(-30, -4)}${lead(4, 30)}<path d="M-12-4H12M-12 4H12"/>`, V, O);
  add('ind', 'Bobina / inductancia', 'Motores', 'L1', 'L', 'Bobina de choque o reactancia.', () => `${lead(-30, -12)}${lead(12, 30)}<path d="M0-12a4 4 0 0 1 0 6a4 4 0 0 1 0 6a4 4 0 0 1 0 6a4 4 0 0 1 0 6" fill="none"/>`, V, O);
  add('atr', 'Autotransformador', 'Motores', 'T1', 'T', 'Reduce la tensión de arranque del motor (arranque por autotransformador).', () => `${lead(-30, -12)}${lead(12, 30)}<circle r="12" fill="#fff"/><path d="M-6 4L6-6M6-6l-4 0M6-6l0 4"/>`, V, O);
  add('trm', 'Transformador de mando', 'Motores', 'T2', 'T', 'Reduce la tensión de red (400 a 24/110/230 V) para el circuito de mando.', () => `${lead(-30, -14)}${lead(14, 30)}<circle cy="-6" r="10" fill="#fff"/><circle cy="6" r="10" fill="#fff"/>`, V, O);
  add('frn', 'Freno electromagnético', 'Motores', 'YB', 'Y', 'Freno de motor: se libera al energizarse.', () => `${lead(-30, -8)}${lead(30, 8)}<rect x="-14" y="-8" width="28" height="16" fill="#fff"/><path d="M-6-4H6M-6 0H6M-6 4H6"/>`, V, O);

  /* ---------------- Multipolares (esquemas multifilares: 3 conductores) ---------------- */
  const m3 = { m3: true };
  add('sec3', 'Seccionador tripolar', 'Multipolares', 'Q1', 'Q', 'Seccionador de 3 polos (L1, L2, L3).', () => P3(NA) + link3(0), V, O, m3);
  add('con3', 'Contactor (contactos principales 3P)', 'Multipolares', 'KM1', 'KM', 'Tres contactos de potencia (1-2, 3-4, 5-6) accionados por la bobina KM.', () => P3(NA) + link3(0), V, O, m3);
  add('pia3', 'Magnetotérmico tripolar', 'Multipolares', 'Q2', 'Q', 'Interruptor automático de 3 polos.', () => P3(NA + '<path d="M-3-16l6 6M3-16l-6 6"/>') + link3(0), V, O, m3);
  add('gm3', 'Guardamotor tripolar', 'Multipolares', 'Q1', 'Q', 'Guardamotor de 3 polos: protege y maniobra el motor.', () => P3(NA + '<path d="M-3-16l6 6M3-16l-6 6"/>') + link3(0) + '<path d="M16 0H24" stroke-dasharray="2 2"/>', V, O, m3);
  add('fus3', 'Fusibles tripolares', 'Multipolares', 'F1', 'F', 'Tres fusibles (gG o aM) en L1, L2, L3.', () => P3('<path d="M0-30V30"/><rect x="-4" y="-12" width="8" height="24" fill="#fff"/>'), V, O, m3);
  add('term3', 'Relé térmico tripolar', 'Multipolares', 'F2', 'F', 'Protección contra sobrecarga con tres elementos bimetálicos (95-96 en mando).', () => P3('<path d="M0-30V-12M0 12V30"/><rect x="-5" y="-12" width="10" height="24" fill="#fff"/><path d="M-3 4l1.5-8 1.5 8 1.5-8"/>'), V, O, m3);
  add('dif4', 'Diferencial tetrapolar', 'Multipolares', 'ID', 'Q', 'Interruptor diferencial de 4 polos (3F+N).', () => [-18, -6, 6, 18].map(x => `<g transform="translate(${x} 0)">${NA}</g>`).join('') + '<path d="M-18 0H18" stroke-dasharray="2 2"/><circle cx="0" cy="14" r="6" fill="#fff"/>', V, O, m3);
  add('mot3', 'Motor trifásico (U1 V1 W1)', 'Multipolares', 'M1', 'M', 'Motor de inducción trifásico con tres bornas de alimentación.', () => P3('<path d="M0-30V-10"/>') + '<circle r="18" fill="#fff"/>' + T(0, 5, 13) + 'M</text>' + T(0, 15, 8) + '3~</text>' + '<path d="M0 18V30"/>', V, O, m3);
  add('bornas', 'Caja de bornas del motor (6)', 'Multipolares', 'XM', 'X', 'Placa de bornas U1 V1 W1 / W2 U2 V2: conexión en estrella (puentes) o en triángulo.', () => `<rect x="-26" y="-12" width="52" height="24" fill="#fff"/>${T(-16, -3, 7)}U1</text>${T(0, -3, 7)}V1</text>${T(16, -3, 7)}W1</text>${T(-16, 9, 7)}W2</text>${T(0, 9, 7)}U2</text>${T(16, 9, 7)}V2</text>${P3('<path d="M0-30V-12"/>')}`, V, [0, 12], m3);

  /* ---------------- Líneas, canalizaciones y tierra ---------------- */
  add('bnd', 'Bandeja portacables', 'Líneas y tierra', 'BP', 'BP', 'Canalización en bandeja perforada.', e => `<path d="M${-(e.w || 120) / 2} -5V5M${(e.w || 120) / 2} -5V5M${-(e.w || 120) / 2} 0H${(e.w || 120) / 2}"/>${Array.from({ length: Math.floor((e.w || 120) / 20) }, (_, i) => `<path d="M${-(e.w || 120) / 2 + 10 + i * 20} -5V5"/>`).join('')}`, [0, 0], [0, 0], { bus: true });
  add('pqt', 'Pica / electrodo de tierra', 'Líneas y tierra', 'PT', 'PT', 'Pica de acero cobrizado clavada en el terreno.', () => `${lead(-30, 6)}<path d="M-12 6H12M0 6V30"/><path d="M-4 24l4 6l4-6"/>`, V, [0, 30]);
  add('bep', 'Borne principal de tierra', 'Líneas y tierra', 'BT', 'BT', 'Punto de unión del conductor de tierra con los de protección y equipotencialidad (ITC-BT-18).', () => `${lead(-30, 0)}<rect x="-14" y="-4" width="28" height="8" fill="#111"/>${lead(4, 30)}`, V, O);
  add('eqp', 'Conexión equipotencial', 'Líneas y tierra', 'EQ', 'EQ', 'Unión equipotencial de masas metálicas (baños: ITC-BT-27).', () => `${lead(-30, 0)}<path d="M-12 0H12"/><circle r="5" fill="#fff"/>`, V, [0, 5]);
  add('bor', 'Borna / regleta', 'Líneas y tierra', 'X1', 'X', 'Borna de conexión de conductores.', () => `${lead(-30, -4)}${lead(4, 30)}<circle r="4" fill="#fff"/>`, V, O);

  window.REBTSymExtra = Q;

  /* Tipos de esquema: qué categorías de símbolos se sugieren primero */
  window.REBTTipos = {
    cuadro: { n: 'Unifilar de cuadro', i: '🧱', d: 'Acometida, protecciones y circuitos de un cuadro.', cats: ['Origen', 'Enlace', 'Protección', 'Maniobra', 'Receptores', 'Generación', 'Tierra y otros'] },
    multi: { n: 'Multifilar de potencia', i: '🔌', d: 'Tres fases dibujadas (L1, L2, L3).', cats: ['Multipolares', 'Origen', 'Motores', 'Líneas y tierra', 'Tierra y otros'] },
    mando: { n: 'Mando y control (circuito de mando)', i: '🕹️', d: 'Pulsadores, bobinas, contactos, temporizadores y señalización.', cats: ['Mando', 'Maniobra', 'Protección', 'Tierra y otros'] },
    viv: { n: 'Instalación de viviendas y locales', i: '🏠', d: 'Luces, interruptores, conmutadores, tomas y puntos de red.', cats: ['Instalación', 'Mando', 'Enlace', 'Protección', 'Receptores', 'Tierra y otros'] },
    motor: { n: 'Motores y arranques', i: '⚙️', d: 'Potencia + mando de motores.', cats: ['Motores', 'Multipolares', 'Mando', 'Maniobra', 'Protección'] },
    tierra: { n: 'Puesta a tierra y equipotencialidad', i: '⏚', d: 'Picas, bornes, líneas principales y equipotenciales.', cats: ['Líneas y tierra', 'Enlace', 'Tierra y otros', 'Instalación'] },
    fv: { n: 'Generación y recarga VE', i: '☀️', d: 'Campo FV, inversor, baterías, recarga.', cats: ['Generación', 'Receptores', 'Protección', 'Enlace', 'Tierra y otros'] },
  };
})();
