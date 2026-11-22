/* REBT Pro - motor de cálculo. Funciones puras, sin DOM. (UMD: navegador -> window.Calc, node -> module.exports) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SECCIONES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
  const CALIBRES = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250];

  /* ITC-BT-19 Tabla 1 (cobre, 40 ºC al aire). Índice = SECCIONES. null = no definido.
     Columnas 1..11 del BOE. */
  const COL = {
    1: [11, 15, 20, 25, 34, 45, 59],
    2: [11.5, 16, 21, 27, 37, 49, 64, 77, 94],
    3: [13, 17.5, 23, 30, 40, 54, 70, 86, 103],
    4: [13.5, 18.5, 24, 32, 44, 59, 77, 96, 117, 149, 180, 208, 236, 268, 315, 360],
    5: [15, 21, 27, 36, 50, 66, 84, 104, 125, 160, 194, 225, 260, 297, 350, 404],
    6: [16, 22, 30, 37, 52, 70, 88, 110, 133, 171, 207, 240, 278, 317, 374, 423],
    7: [null, null, null, null, null, null, 96, 119, 145, 188, 230, 267, 310, 354, 419, 484],
    8: [18, 25, 34, 44, 60, 80, 106, 131, 159, 202, 245, 284, 338, 386, 455, 524],
    9: [21, 29, 38, 49, 68, 91, 116, 144, 175, 224, 271, 314, 363, 415, 490, 565],
    10: [24, 33, 45, 57, 76, 105, 123, 154, 188, 244, 296, 348, 404, 464, 552, 640],
    11: [null, null, null, null, null, null, 166, 206, 250, 321, 391, 455, 525, 601, 711, 821],
  };
  /* Método -> {aislamiento+conductores cargados: columna} */
  const METODOS = {
    A:  { PVC3: 2, PVC2: 3, XLPE3: 5, XLPE2: 6, nombre: 'A · Aislados en tubo empotrado en pared aislante' },
    A2: { PVC3: 1, PVC2: 2, XLPE3: 4, XLPE2: 5, nombre: 'A2 · Multiconductor en tubo empotrado en pared aislante' },
    B:  { PVC3: 4, PVC2: 5, XLPE3: 8, XLPE2: 9, nombre: 'B · Aislados en tubo superficial o empotrado en obra' },
    B2: { PVC3: 3, PVC2: 4, XLPE3: 6, XLPE2: 8, nombre: 'B2 · Multiconductor en tubo superficial o empotrado en obra' },
    C:  { PVC3: 5, PVC2: 6, XLPE3: 8, XLPE2: 9, nombre: 'C · Multiconductor directamente sobre pared' },
    E:  { PVC3: 6, PVC2: 8, XLPE3: 9, XLPE2: 10, nombre: 'E · Multiconductor al aire libre (bandeja perforada)' },
    F:  { PVC3: 7, XLPE3: 10, nombre: 'F · Unipolares en contacto al aire' },
    G:  { PVC3: 9, XLPE3: 11, nombre: 'G · Unipolares separados al aire' },
  };
  const AL_FACTOR = 0.78; // orientativo: Al ≈ 78 % del Cu (UNE 20460-5-523). Mínimo 16 mm².

  /* Factores de temperatura UNE 20460-5-523 (ref. 30 ºC) -> re-referidos a 40 ºC */
  const T30 = {
    PVC:  { 10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.0, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50 },
    XLPE: { 10: 1.15, 15: 1.12, 20: 1.08, 25: 1.04, 30: 1.0, 35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82, 55: 0.76, 60: 0.71, 65: 0.65, 70: 0.58, 75: 0.50, 80: 0.41 },
  };
  function factorTemperatura(aisl, tAmb) {
    const t = T30[aisl];
    const ks = Object.keys(t).map(Number).sort((a, b) => a - b);
    let f;
    if (tAmb <= ks[0]) f = t[ks[0]];
    else if (tAmb >= ks[ks.length - 1]) f = t[ks[ks.length - 1]];
    else {
      let lo = ks[0], hi = ks[ks.length - 1];
      for (let i = 0; i < ks.length - 1; i++) if (tAmb >= ks[i] && tAmb <= ks[i + 1]) { lo = ks[i]; hi = ks[i + 1]; break; }
      f = t[lo] + (t[hi] - t[lo]) * (tAmb - lo) / (hi - lo);
    }
    return f / t[40]; // referido a 40 ºC (tabla ITC-BT-19)
  }
  /* Factor de agrupamiento (nº de circuitos agrupados, UNE 20460-5-523 tabla 52-E1) */
  const AGRUP = { 1: 1, 2: 0.8, 3: 0.7, 4: 0.65, 5: 0.6, 6: 0.57, 7: 0.54, 8: 0.52, 9: 0.5, 12: 0.45, 16: 0.41, 20: 0.38 };
  function factorAgrupamiento(n) {
    n = Math.max(1, Math.round(n));
    const ks = Object.keys(AGRUP).map(Number).sort((a, b) => a - b);
    let r = AGRUP[ks[0]];
    for (const k of ks) if (n >= k) r = AGRUP[k];
    return r;
  }

  /* Resistividad y conductividad a temperatura de servicio */
  const RHO20 = { Cu: 0.017241, Al: 0.028264 }; // Ω·mm²/m
  const ALFA = { Cu: 0.00393, Al: 0.00403 };
  function rho(mat, T) { return RHO20[mat] * (1 + ALFA[mat] * (T - 20)); }
  function gamma(mat, T) { return 1 / rho(mat, T); }
  const TMAX = { PVC: 70, XLPE: 90 };

  function iAdmisible(metodo, aisl, nCarga, S, mat) {
    const m = METODOS[metodo];
    const colKey = m[aisl + nCarga];
    if (!colKey) return null;
    const idx = SECCIONES.indexOf(S);
    const v = COL[colKey][idx];
    if (v == null || v === undefined) return null;
    return mat === 'Al' ? Math.floor(v * AL_FACTOR * 10) / 10 : v;
  }

  function intensidad({ sistema, P, U, cosfi = 1, rend = 1 }) {
    if (sistema === 'tri') return P / (Math.sqrt(3) * U * cosfi * rend);
    return P / (U * cosfi * rend);
  }
  function potenciaDesdeI({ sistema, I, U, cosfi = 1 }) {
    return (sistema === 'tri' ? Math.sqrt(3) : 1) * U * I * cosfi;
  }

  /* Caída de tensión (V) para I, L (m), S, material, T, cosφ; X = 0,08 mΩ/m (cables multiconductores) */
  function caidaV({ sistema, I, L, S, mat, T, cosfi = 1, X = 0.08e-3 }) {
    const R = rho(mat, T) / S; // Ω/m
    const sen = Math.sqrt(Math.max(0, 1 - cosfi * cosfi));
    const k = sistema === 'tri' ? Math.sqrt(3) : 2;
    return k * I * L * (R * cosfi + (S >= 50 ? X : 0) * sen);
  }

  function calibreMinimo(Ib) { return CALIBRES.find(c => c >= Ib) || null; }

  /* Cálculo de sección completo. Devuelve objeto con la solución y tabla de candidatas. */
  function calcularSeccion(p) {
    const o = Object.assign({
      sistema: 'mono', U: null, P: 0, cosfi: 1, rend: 1, L: 10, mat: 'Cu', aisl: 'PVC', metodo: 'B',
      tAmb: 40, nCirc: 1, limite: 3, factorCarga: 1, Ib: null, minSeccion: 1.5,
    }, p);
    o.U = o.U || (o.sistema === 'tri' ? 400 : 230);
    const nCarga = o.sistema === 'tri' ? 3 : 2;
    const Ib = (o.Ib != null && o.Ib > 0) ? o.Ib : intensidad(o) * o.factorCarga;
    const kT = factorTemperatura(o.aisl, o.tAmb);
    const kG = factorAgrupamiento(o.nCirc);
    const T = TMAX[o.aisl];
    const Uref = o.sistema === 'tri' ? o.U : o.U; // ΔU% sobre tensión nominal del sistema
    const candidatas = [];
    let sol = null;
    for (const S of SECCIONES) {
      if (S < o.minSeccion) continue;
      if (o.mat === 'Al' && S < 16) continue;
      const Itab = iAdmisible(o.metodo, o.aisl, nCarga, S, o.mat);
      if (Itab == null) continue;
      const Iz = Itab * kT * kG;
      const dU = caidaV({ sistema: o.sistema, I: Ib, L: o.L, S, mat: o.mat, T, cosfi: o.cosfi });
      const dUp = dU / Uref * 100;
      const okI = Iz >= Ib, okU = dUp <= o.limite;
      const c = { S, Itab, Iz: +Iz.toFixed(1), dU: +dU.toFixed(2), dUp: +dUp.toFixed(3), okI, okU };
      candidatas.push(c);
      if (!sol && okI && okU) sol = c;
    }
    let proteccion = null;
    if (sol) {
      // In: ≥ Ib y ≤ Iz (se busca el mayor calibre normalizado ≤ Iz que sea ≥ Ib, el menor ≥ Ib es lo habitual)
      const In = calibreMinimo(Ib);
      proteccion = { In, cumpleIbInIz: In != null && Ib <= In && In <= sol.Iz, I2: In ? +(1.45 * In).toFixed(1) : null, limiteI2: +(1.45 * sol.Iz).toFixed(1) };
      if (In != null && In > sol.Iz) {
        // aumentar sección hasta que Iz >= In
        const mejor = candidatas.find(c => c.okU && c.Iz >= In);
        if (mejor) { sol = mejor; proteccion.cumpleIbInIz = true; proteccion.limiteI2 = +(1.45 * mejor.Iz).toFixed(1); proteccion.aviso = 'Se ha aumentado la sección para que Iz ≥ In.'; }
      }
    }
    return { Ib: +Ib.toFixed(2), kT: +kT.toFixed(3), kG, T, solucion: sol, proteccion, candidatas };
  }

  /* Caída de tensión con sección dada */
  function calcularCaida(p) {
    const o = Object.assign({ sistema: 'mono', U: null, I: 10, L: 10, S: 2.5, mat: 'Cu', aisl: 'PVC', cosfi: 1 }, p);
    o.U = o.U || (o.sistema === 'tri' ? 400 : 230);
    const T = TMAX[o.aisl];
    const dU = caidaV({ sistema: o.sistema, I: o.I, L: o.L, S: o.S, mat: o.mat, T, cosfi: o.cosfi });
    const Rtot = rho(o.mat, T) / o.S * o.L;
    return { dU: +dU.toFixed(3), dUp: +(dU / o.U * 100).toFixed(3), perdidaW: +((o.sistema === 'tri' ? 3 : 2) * o.I * o.I * Rtot).toFixed(1), R: +Rtot.toFixed(4) };
  }
  /* Longitud máxima para una caída dada */
  function longitudMaxima(p) {
    const o = Object.assign({ sistema: 'mono', U: null, I: 10, S: 2.5, mat: 'Cu', aisl: 'PVC', cosfi: 1, limite: 3 }, p);
    o.U = o.U || (o.sistema === 'tri' ? 400 : 230);
    const unit = caidaV({ sistema: o.sistema, I: o.I, L: 1, S: o.S, mat: o.mat, T: TMAX[o.aisl], cosfi: o.cosfi });
    return +(o.limite / 100 * o.U / unit).toFixed(1);
  }

  /* Cortocircuito */
  function iccTransformador({ kVA, ucc = 4, U = 400 }) {
    return kVA * 1000 / (Math.sqrt(3) * U * ucc / 100);
  }
  function iccAguasAbajo({ IccAmont, U = 400, S, L, mat = 'Cu', n = 1 }) {
    // Método de impedancias: Z_total = Z_amont + Z_cable. Valores a 20 ºC para Icc máx.
    const c = 1.05;
    const Zup = c * U / (Math.sqrt(3) * IccAmont);
    const R = rho(mat, 20) / S * L / n, X = 0.08e-3 * L / n;
    const Rup = Zup * 0.2, Xup = Zup * 0.98; // red aguas arriba predominantemente inductiva
    const Rt = Rup + R, Xt = Xup + X;
    const Zt = Math.hypot(Rt, Xt);
    return c * U / (Math.sqrt(3) * Zt);
  }
  const CURVAS = { B: 5, C: 10, D: 20, 'MA': 12 };
  function longitudMaxTN({ U0 = 230, S, mat = 'Cu', curva = 'C', In, Spe = null }) {
    // UNE 20460-4-43 / ITC-BT-24 (TN): Lmax = 0,8·U0·S / (ρ·(1+m)·Ia), ρ = 1,5·ρ20 (aprox. 70 ºC)
    const Ia = CURVAS[curva] * In;
    const m = Spe ? S / Spe : 1;
    const r = 1.5 * (mat === 'Cu' ? 0.018 : 0.029);
    return 0.8 * U0 * S / (r * (1 + m) * Ia);
  }
  function seccionTermica({ Icc, t, k = 115 }) { return Icc * Math.sqrt(t) / k; } // k Cu-PVC 115, Cu-XLPE 143, Al-PVC 76, Al-XLPE 94
  const K_TERM = { 'Cu-PVC': 115, 'Cu-XLPE': 143, 'Al-PVC': 76, 'Al-XLPE': 94 };

  /* Puesta a tierra */
  const RESISTIVIDAD = [
    ['Terrenos pantanosos', '< 30'], ['Limo', '20 – 100'], ['Humus', '10 – 150'], ['Turba húmeda', '5 – 100'],
    ['Arcilla plástica', '50'], ['Margas y arcillas compactas', '100 – 200'], ['Margas del Jurásico', '30 – 40'],
    ['Arena arcillosa', '50 – 500'], ['Arena silícea', '200 – 3000'], ['Suelo pedregoso cubierto de césped', '300 – 500'],
    ['Suelo pedregoso desnudo', '1500 – 3000'], ['Calizas blandas', '100 – 300'], ['Calizas compactas', '1000 – 5000'],
    ['Calizas agrietadas', '500 – 1000'], ['Pizarras', '50 – 300'], ['Roca de mica y cuarzo', '800'],
    ['Granitos y gres alterados', '1500 – 10000'], ['Granitos y gres muy alterados', '100 – 600'],
  ];
  function resistenciaElectrodo({ tipo, rho: r, L = 2, P = 4, n = 1 }) {
    let R;
    if (tipo === 'pica') R = r / L;            // pica vertical
    else if (tipo === 'placa') R = 0.8 * r / P; // P = perímetro de la placa (m)
    else R = 2 * r / L;                          // conductor enterrado horizontal
    return n > 1 ? R / n : R;                    // n picas bien separadas (aprox.)
  }
  function maxResistenciaTierra({ UL = 50, Idn = 0.03 }) { return UL / Idn; }

  /* Previsión de cargas */
  const SIMULT = [null, 1, 2, 3, 3.8, 4.6, 5.4, 6.2, 7, 7.8, 8.5, 9.2, 9.9, 10.6, 11.3, 11.9, 12.5, 13.1, 13.7, 14.3, 14.8, 15.3];
  function coefSimultaneidad(n) { return n <= 21 ? SIMULT[Math.max(1, n)] : 15.3 + (n - 21) * 0.5; }
  function cargaEdificio({ nViv, potViv = 5750, servGen = 0, locales = [], garajeKW = 0 }) {
    const cs = coefSimultaneidad(nViv);
    const viv = potViv * cs;
    const loc = locales.reduce((s, l) => s + Math.max(100 * l.m2 * (l.plantas || 1), 3450), 0);
    const total = viv + servGen + loc + garajeKW;
    return { cs, viviendas: viv, servGen, locales: loc, garaje: garajeKW, total };
  }
  function garajePotencia(m2, ventForzada) { return m2 * (ventForzada ? 20 : 10); } // W, mínimo 3450 W
  const ELECTRIFICACION = { basica: 5750, elevada: 9200 };

  /* Motores */
  function motor({ P_kW, U = 400, cosfi = 0.85, rend = 0.9, sistema = 'tri', Ia_In = 6 }) {
    const In = P_kW * 1000 / ((sistema === 'tri' ? Math.sqrt(3) : 1) * U * cosfi * rend);
    return { In, Idim: In * 1.25, Iarranque: In * Ia_In, Pabs: P_kW / rend };
  }
  function motoresVarios(In_lista) {
    const mx = Math.max(...In_lista);
    return 1.25 * mx + (In_lista.reduce((a, b) => a + b, 0) - mx);
  }

  /* Factor de potencia */
  function compensacion({ P_kW, cosfi1, cosfi2 }) {
    const t1 = Math.tan(Math.acos(cosfi1)), t2 = Math.tan(Math.acos(cosfi2));
    return { Qc: P_kW * (t1 - t2), Q1: P_kW * t1, S1: P_kW / cosfi1, S2: P_kW / cosfi2 };
  }

  /* Iluminación (método de los lúmenes) */
  function luminarias({ E, S, flujoLum, Cu = 0.6, Cm = 0.8 }) {
    const n = E * S / (flujoLum * Cu * Cm);
    return { exacto: n, n: Math.ceil(n) };
  }
  function indiceLocal(a, b, h) { return a * b / (h * (a + b)); }

  /* Potencia/Energía/Coste */
  function energia({ P_kW, horas, precio }) { return { kWh: P_kW * horas, coste: P_kW * horas * precio }; }

  /* Tubos (ITC-BT-21): diámetro externo mínimo según nº y sección de conductores (empotrado / superficie) */
  /* ITC-BT-21: diámetro exterior mínimo (mm) según nº de conductores (1..5). Fuente: BOE consolidado, Tablas 2, 5 y 7. */
  const SEC_TUBO = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const TUBOS_SUP = [[12,12,16,16,20],[12,12,16,16,20],[12,16,20,20,20],[12,16,20,20,25],[16,20,25,32,32],[16,25,32,32,32],[20,32,32,40,40],[25,32,40,40,50],[25,40,50,50,50],[32,40,50,63,63],[32,50,63,63,75],[40,50,63,75,75],[40,63,75,75,null],[50,63,75,null,null],[50,75,null,null,null]];
  const TUBOS_EMP = [[12,12,16,16,20],[12,16,20,20,20],[12,16,20,20,25],[12,16,25,25,25],[16,25,25,32,32],[20,25,32,32,40],[25,32,40,40,50],[25,40,40,50,50],[32,40,50,50,63],[32,50,63,63,63],[40,50,63,75,75],[40,63,75,75,null],[50,63,75,null,null],[50,75,null,null,null],[63,75,null,null,null]];
  const TUBOS_AIRE = [[12,12,16,16,20],[12,16,20,20,20],[12,16,20,20,25],[12,16,25,25,25],[16,25,25,32,32],[20,25,32,32,40]]; // hasta 16 mm²
  const TUBOS = { sup: TUBOS_SUP, emp: TUBOS_EMP, aire: TUBOS_AIRE };
  function tubo(S, n, tipo = 'emp') {
    const i = SEC_TUBO.indexOf(S); const t = TUBOS[tipo];
    if (i < 0 || !t[i]) return null;
    return t[i][Math.min(Math.max(n, 1), 5) - 1];
  }

  /* Derivación individual (ITC-BT-15): sección mínima 6 mm² Cu, neutro etc. Fase/neutro/PE/hilo mando */
  function derivacionIndividual({ P, U = 230, sistema = 'mono', L, mat = 'Cu', aisl = 'XLPE', metodo = 'B', limite = 1.5, tAmb = 40 }) {
    const r = calcularSeccion({ sistema, U, P, L, mat, aisl, metodo, limite, minSeccion: 6, tAmb });
    return r;
  }

  /* Cuarto de baño: volúmenes (ITC-BT-27) - datos de ayuda */
  const IP_BANO = { vol0: 'IPX7', vol1: 'IPX4 (IPX5 en baños públicos con chorros)', vol2: 'IPX4', vol3: 'IPX1 (IPX5 baños públicos con chorros)' };

  /* Aislamiento (ITC-BT-19 §2.9) */
  const AISLAMIENTO = [
    { un: 'MBTS o MBTP', ensayo: 250, minimo: 0.25 },
    { un: '≤ 500 V (excepto MBTS/MBTP)', ensayo: 500, minimo: 0.5 },
    { un: '> 500 V', ensayo: 1000, minimo: 1.0 },
  ];

  return {
    SECCIONES, CALIBRES, COL, METODOS, AL_FACTOR, RESISTIVIDAD, K_TERM, CURVAS, ELECTRIFICACION, AISLAMIENTO, IP_BANO, TUBOS, SEC_TUBO, SIMULT,
    factorTemperatura, factorAgrupamiento, rho, gamma, iAdmisible, intensidad, potenciaDesdeI, caidaV, calibreMinimo,
    calcularSeccion, calcularCaida, longitudMaxima, iccTransformador, iccAguasAbajo, longitudMaxTN, seccionTermica,
    resistenciaElectrodo, maxResistenciaTierra, coefSimultaneidad, cargaEdificio, garajePotencia, motor, motoresVarios,
    compensacion, luminarias, indiceLocal, energia, tubo, derivacionIndividual,
  };
});
