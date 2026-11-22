/* Generador de documentos con plantillas (proyecto, MTD, CIE, verificación, presupuesto, mantenimiento).
   Los documentos se guardan solo en este navegador (localStorage). Exportables a PDF (imprimir), HTML y JSON. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, store, esc, fmt, num, view, go, $, $$, C } = A;

  /* ------------------------------------------------------------------ estilos del documento (también para exportar) */
  const PAPER_CSS = `
.paper{background:#fff;color:#111;font:14px/1.5 Georgia,"Times New Roman",serif;padding:38px 44px;max-width:820px;margin:0 auto;box-shadow:0 2px 24px rgba(0,0,0,.18);border-radius:4px}
.paper h1{font:700 24px/1.2 system-ui,Segoe UI,sans-serif;margin:0 0 4px;color:#111;letter-spacing:-.01em}
.paper .sub{font:13px system-ui,Segoe UI,sans-serif;color:#555;margin:0 0 18px}
.paper h2{font:700 15px/1.3 system-ui,Segoe UI,sans-serif;margin:26px 0 8px;padding:5px 10px;background:#f1f3f7;border-left:4px solid #d97706;color:#111;text-transform:none}
.paper h3{font:700 13px system-ui,Segoe UI,sans-serif;margin:14px 0 4px;color:#333}
.paper p{margin:6px 0;white-space:pre-wrap}
.paper dl{display:grid;grid-template-columns:200px 1fr;gap:3px 14px;margin:8px 0}
.paper dt{font:600 12px system-ui,Segoe UI,sans-serif;color:#555}
.paper dd{margin:0;border-bottom:1px dotted #bbb;min-height:18px}
.paper table{width:100%;border-collapse:collapse;font:12px system-ui,Segoe UI,sans-serif;margin:8px 0}
.paper th{background:#eceff4;text-align:left;padding:5px 7px;border:1px solid #c9cfda;color:#111;position:static}
.paper td{padding:4px 7px;border:1px solid #d7dce5;vertical-align:top}
.paper td.r,.paper th.r{text-align:right}
.paper .tot td{font-weight:700;background:#fafbfc}
.paper ul.ck{list-style:none;padding:0;margin:6px 0}
.paper ul.ck li{padding:2px 0 2px 0}
.paper .ph{color:#9aa3b2}
.paper .ok{color:#15803d;font-weight:700}.paper .ko{color:#b91c1c;font-weight:700}
.paper .firmas{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:46px}
.paper .firmas div{border-top:1px solid #111;padding-top:6px;font:12px system-ui,Segoe UI,sans-serif;text-align:center;min-height:90px}
.paper .pie{margin-top:26px;font:11px system-ui,Segoe UI,sans-serif;color:#777;border-top:1px solid #ddd;padding-top:8px}
@media (max-width:640px){.paper{padding:22px 16px}.paper dl{grid-template-columns:1fr}}
`;
  const st = document.createElement('style');
  st.textContent = PAPER_CSS + `
.de-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
.de-head input.nm{flex:1;min-width:180px;font-weight:700;font-size:17px}
.de-body{display:grid;grid-template-columns:minmax(320px,430px) 1fr;gap:22px;align-items:start}
.de-edit{position:sticky;top:14px;max-height:calc(100vh - 28px);overflow:auto;padding-right:4px}
.steps{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.step{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:99px;padding:6px 12px;font-size:13px;font-weight:700;cursor:pointer;min-height:34px;display:flex;gap:6px;align-items:center}
.step.on{background:var(--brand);border-color:var(--brand);color:#111}
.step i{font-style:normal;width:18px;height:18px;border-radius:50%;background:var(--panel2);display:grid;place-items:center;font-size:11px;color:var(--muted)}
.step.on i{background:rgba(0,0,0,.18);color:#111}
.step.done i{background:var(--okbg);color:var(--ok)}
.fld{margin:0 0 12px}.fld .hint{font-size:12px;color:var(--muted);margin-top:3px}
.fld textarea{min-height:92px;resize:vertical}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.fgrid .full{grid-column:1/-1}
.tbl{border:1px solid var(--line);border-radius:12px;overflow:auto;background:var(--panel)}
.tbl table{min-width:520px}.tbl input,.tbl select{min-height:36px;padding:4px 8px;font-size:14px;border-radius:8px}
.tbl td{padding:4px}.tbl th{font-size:12px}
.tbl .calc{font-weight:700;white-space:nowrap;padding:4px 8px}
.rm{border:0;background:transparent;color:var(--bad);font-size:18px;cursor:pointer;min-height:36px;min-width:30px}
.tabsw{display:none;gap:6px;margin-bottom:12px}
.tplcard{display:flex;gap:14px;align-items:flex-start}
.tplcard .ic{font-size:30px;line-height:1}
.dl{display:flex;gap:10px;align-items:center;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel);margin:8px 0;flex-wrap:wrap}
.dl b{flex:1;min-width:160px}
@media (max-width:980px){.de-body{grid-template-columns:1fr}.de-edit{position:static;max-height:none}.tabsw{display:flex}.de-body.pv .de-edit{display:none}.de-body.ed .de-prev{display:none}}
@media print{.de-head,.de-edit,.tabsw,.steps{display:none!important}.de-body{display:block}.paper{box-shadow:none;border-radius:0;padding:0;max-width:none}body{background:#fff}#view{padding:0}}
`;
  document.head.appendChild(st);

  /* ------------------------------------------------------------------ perfil de empresa */
  const PERFIL = [['empresa', 'Empresa instaladora'], ['cif', 'CIF/NIF'], ['habil', 'Nº de habilitación / registro'], ['cat', 'Categoría (IBTB / IBTE)'], ['instalador', 'Instalador en BT firmante'], ['nif_i', 'NIF del instalador'], ['dir_e', 'Dirección de la empresa'], ['tel', 'Teléfono'], ['email', 'Email'], ['seguro', 'Seguro RC (compañía y nº de póliza)']];

  /* ------------------------------------------------------------------ plantillas */
  const f = (k, l, t, o) => Object.assign({ k, l, t: t || 'text' }, o || {});
  const NORMAS = ['Reglamento electrotécnico para baja tensión (RD 842/2002) e ITC-BT-01 a 52', 'Normas UNE de referencia (UNE 20460, UNE-EN 61386, UNE-EN 60898, UNE-EN 61008/61009…)', 'Normas particulares de la empresa distribuidora', 'Código Técnico de la Edificación (DB-SI, DB-SUA) en lo que afecte', 'RD 614/2001 (riesgo eléctrico) y Ley 31/1995 de Prevención de Riesgos Laborales', 'RD 1627/1997 (seguridad y salud en obras de construcción)', 'Normativa autonómica de instalaciones eléctricas'];
  const USO = ['Vivienda unifamiliar', 'Edificio de viviendas', 'Local comercial / oficina', 'Industria / nave', 'Local de pública concurrencia', 'Garaje / aparcamiento', 'Alumbrado exterior', 'Otro'];
  const ESQ = ['TT', 'TN-S', 'TN-C-S', 'IT'];
  const COL_CIRC = [{ k: 'ref', l: 'Circuito', w: 70 }, { k: 'desc', l: 'Descripción', w: 150 }, { k: 'P', l: 'P (W)', t: 'num', w: 80 }, { k: 'L', l: 'L (m)', t: 'num', w: 70 }, { k: 'sis', l: 'Sistema', t: 'sel', o: [['mono', 'Mono'], ['tri', 'Tri']], w: 80 }, { k: 'S', l: 'S (mm²)', t: 'num', w: 80 }, { k: 'In', l: 'PIA (A)', t: 'num', w: 70 }, { k: 'dU', l: 'ΔU (%)', t: 'num', w: 70 }];
  const COL_PRESU = [{ k: 'c', l: 'Concepto', w: 190 }, { k: 'u', l: 'Ud', w: 55 }, { k: 'q', l: 'Cantidad', t: 'num', w: 80 }, { k: 'p', l: 'Precio (€)', t: 'num', w: 90 }, { k: 'imp', l: 'Importe', calc: r => (num(r.q) || 0) * (num(r.p) || 0) }];
  const sec = (id, t, campos, o) => Object.assign({ id, t, campos }, o || {});

  const TPLS = {
    proyecto: {
      t: 'Proyecto de instalación eléctrica de BT', ic: '📐', d: 'Memoria, cálculos, pliego, presupuesto y planos. Para instalaciones que lo exigen (ITC-BT-04 §3).',
      titulo: 'PROYECTO DE INSTALACIÓN ELÉCTRICA DE BAJA TENSIÓN',
      secs: [
        sec('gen', 'Datos generales', [f('titulo', 'Título del proyecto', 'text', { ph: 'Instalación eléctrica de baja tensión de …' }), f('expte', 'Nº de expediente'), f('titular', 'Titular / promotor'), f('nif_t', 'NIF/CIF del titular'), f('dir_t', 'Domicilio del titular'), f('emplaz', 'Emplazamiento de la instalación'), f('mun', 'Municipio y provincia'), f('uso', 'Uso', 'select', { o: USO }), f('sup', 'Superficie (m²)', 'num'), f('autor', 'Técnico autor del proyecto'), f('titulacion', 'Titulación'), f('colegiado', 'Nº de colegiado'), f('fecha', 'Fecha', 'date')]),
        sec('mem', 'Memoria descriptiva', [
          f('objeto', 'Objeto del proyecto', 'area', { def: 'El presente proyecto tiene por objeto definir las características técnicas y justificar el cumplimiento reglamentario de la instalación eléctrica de baja tensión descrita, para su ejecución, legalización y puesta en servicio.' }),
          f('antec', 'Antecedentes', 'area'), f('norma', 'Normativa aplicable', 'lista', { items: NORMAS, def: Object.fromEntries(NORMAS.map((_, i) => [i, true])) }),
          f('desc', 'Descripción del edificio o local', 'area'),
          f('clasif', 'Clasificación del local', 'lista', { items: ['Seco', 'Húmedo', 'Mojado', 'Polvoriento', 'Con riesgo de corrosión', 'Pública concurrencia', 'Riesgo de incendio o explosión', 'Cuarto de baño / ducha (ITC-BT-27)', 'Garaje', 'Piscina / fuente'] }),
          f('tension', 'Tensión de suministro', 'select', { o: ['230 V monofásica', '230/400 V trifásica'] }), f('esq', 'Esquema de distribución', 'select', { o: ESQ, def: 'TT' }),
          f('pinst', 'Potencia instalada (W)', 'num'), f('pprev', 'Potencia prevista (W)', 'num'), f('acom', 'Acometida', 'select', { o: ['Aérea', 'Subterránea', 'Mixta'] }),
          f('enlace', 'Instalación de enlace (CGP, LGA, contadores, DI)', 'area'), f('cuadros', 'Cuadros y protecciones', 'area', { ph: 'ICP, IGM, diferenciales, PIA por circuito, SPD…' }), f('tierra_d', 'Puesta a tierra y equipotencialidad', 'area', { def: 'Anillo de conductor de cobre desnudo de 35 mm² en el perímetro de la cimentación, con picas si es necesario, conforme a ITC-BT-18 e ITC-BT-26.' }), f('especial', 'Instalaciones especiales (emergencia, recarga VE, generación…)', 'area')]),
        sec('calc', 'Cálculos justificativos', [
          f('grado', 'Grado de electrificación (si es vivienda)', 'select', { o: ['No aplica', 'Básica (5750 W)', 'Elevada (9200 W)'] }), f('prev', 'Previsión de cargas', 'area', { ph: 'Detalle según ITC-BT-10: viviendas × coeficiente de simultaneidad, servicios generales, locales, garaje…' }),
          f('circ', 'Circuitos interiores', 'tabla', { cols: COL_CIRC, circ: true }),
          f('lga', 'Línea general de alimentación y derivaciones individuales', 'area', { ph: 'Sección, longitud, caída de tensión (LGA: la fijada por la distribuidora; DI 0,5 / 1 / 1,5 %), tubo…' }),
          f('cc', 'Cortocircuito y poder de corte', 'area'), f('rho', 'Resistividad del terreno (Ω·m)', 'num'), f('elec', 'Electrodo', 'select', { o: ['Conductor enterrado (anillo)', 'Picas', 'Placas', 'Combinado'] }), f('rt', 'Resistencia de tierra estimada (Ω)', 'num'), f('uc', 'Tensión de contacto límite', 'select', { o: ['50 V', '24 V (local conductor)'] })]),
        sec('pliego', 'Pliego de condiciones', [
          f('mat', 'Materiales', 'area', { def: 'Todos los materiales cumplirán las normas UNE aplicables y el REBT, serán de primera calidad y dispondrán del marcado CE. Los conductores serán de cobre, con la tensión asignada y las características de propagación del incendio exigidas por la ITC-BT correspondiente.' }),
          f('ejec', 'Ejecución', 'area', { def: 'La instalación será ejecutada por empresa instaladora autorizada en baja tensión, bajo la dirección de técnico titulado competente cuando se exija proyecto. Se respetarán los colores de conductores, las separaciones con otras canalizaciones y los grados de protección de cada emplazamiento.' }),
          f('pruebas', 'Pruebas y verificaciones', 'area', { def: 'Antes de la puesta en servicio se verificarán, según UNE 20460-6-61: continuidad de conductores de protección, resistencia de aislamiento, rigidez dieléctrica, resistencia de puesta a tierra, disparo de diferenciales y caída de tensión.' }), f('garantia', 'Garantía y mantenimiento', 'area')]),
        sec('presu', 'Presupuesto', [f('part', 'Partidas', 'tabla', { cols: COL_PRESU, presu: true }), f('iva', 'IVA (%)', 'num', { def: 21 })]),
        sec('ssl', 'Seguridad y salud', [f('ssl', 'Medidas de seguridad y salud', 'area', { def: 'Durante la ejecución se aplicarán el RD 1627/1997 y el RD 614/2001: trabajos sin tensión siguiendo las cinco reglas de oro (desconectar, prevenir la realimentación, verificar la ausencia de tensión, poner a tierra y en cortocircuito si procede, señalizar y delimitar la zona), uso de EPI y herramientas aisladas.' })]),
        sec('planos', 'Planos', [f('pl', 'Relación de planos', 'tabla', { cols: [{ k: 'n', l: 'Nº', w: 60 }, { k: 't', l: 'Plano', w: 280 }, { k: 'e', l: 'Escala', w: 80 }], def: [{ n: '1', t: 'Situación y emplazamiento', e: '1/2000' }, { n: '2', t: 'Distribución en planta', e: '1/50' }, { n: '3', t: 'Esquema unifilar', e: 'S/E' }] })]),
      ],
      extras: { calc: d => resumenCirc(d.circ), presu: d => totPresu(d.part, d.iva) },
      firmas: ['El técnico autor del proyecto', 'El titular / promotor'],
    },
    mtd: {
      t: 'Memoria técnica de diseño (MTD)', ic: '📝', d: 'Para instalaciones que no precisan proyecto (ITC-BT-04 §2.2 y §4). Si tu CA exige su impreso oficial, úsalo como borrador.',
      titulo: 'MEMORIA TÉCNICA DE DISEÑO',
      secs: [
        sec('prop', 'Propietario y emplazamiento', [f('titular', 'Titular'), f('nif_t', 'NIF/CIF'), f('dir_t', 'Domicilio del titular'), f('emplaz', 'Emplazamiento de la instalación'), f('mun', 'Municipio y provincia'), f('uso', 'Uso al que se destina', 'select', { o: USO }), f('sup', 'Superficie (m²)', 'num')]),
        sec('aut', 'Quien firma la memoria', [f('empresa', 'Empresa instaladora', 'text', { pf: 'empresa' }), f('cif', 'CIF', 'text', { pf: 'cif' }), f('habil', 'Nº de habilitación', 'text', { pf: 'habil' }), f('cat', 'Categoría', 'text', { pf: 'cat' }), f('instalador', 'Instalador en BT', 'text', { pf: 'instalador' }), f('fecha', 'Fecha', 'date')]),
        sec('tec', 'Características de la instalación', [f('tension', 'Tensión', 'select', { o: ['230 V monofásica', '230/400 V trifásica'] }), f('esq', 'Esquema de distribución', 'select', { o: ESQ, def: 'TT' }), f('grado', 'Electrificación (vivienda)', 'select', { o: ['No aplica', 'Básica (5750 W)', 'Elevada (9200 W)'] }), f('pprev', 'Potencia prevista (W)', 'num'), f('igm', 'IGM / ICP (A)', 'num'), f('dif', 'Diferencial (A / mA)', 'text', { ph: '40 A / 30 mA' }), f('di', 'Derivación individual (sección y longitud)', 'text'), f('clasif', 'Clasificación del local', 'text'), f('memo', 'Pequeña memoria descriptiva', 'area')]),
        sec('rec', 'Relación de receptores', [f('rec', 'Receptores previstos', 'tabla', { cols: [{ k: 'r', l: 'Receptor', w: 200 }, { k: 'n', l: 'Nº', t: 'num', w: 60 }, { k: 'p', l: 'P unit. (W)', t: 'num', w: 90 }, { k: 'tot', l: 'Total (W)', calc: r => (num(r.n) || 0) * (num(r.p) || 0) }] })]),
        sec('circ', 'Circuitos y cálculos', [f('circ', 'Circuitos', 'tabla', { cols: COL_CIRC, circ: true }), f('esquema', 'Esquema unifilar y croquis', 'area', { ph: 'Descripción del esquema unifilar y del trazado (adjuntar plano).' })]),
      ],
      extras: { rec: d => `<p><b>Potencia total de receptores:</b> ${fmt(sumRows(d.rec, r => (num(r.n) || 0) * (num(r.p) || 0)))} W</p>`, circ: d => resumenCirc(d.circ) },
      firmas: ['El instalador / técnico que firma', 'El titular'],
    },
    cie: {
      t: 'Certificado de instalación eléctrica (CIE)', ic: '✅', d: 'Certificado con los datos mínimos de la ITC-BT-04 §5.4. El modelo oficial lo marca cada Comunidad Autónoma.',
      titulo: 'CERTIFICADO DE INSTALACIÓN ELÉCTRICA EN BAJA TENSIÓN',
      secs: [
        sec('tit', 'Titular y emplazamiento', [f('titular', 'Titular'), f('nif_t', 'NIF/CIF'), f('emplaz', 'Emplazamiento'), f('mun', 'Municipio y provincia'), f('uso', 'Uso', 'select', { o: USO })]),
        sec('inst', 'Características principales', [f('tipo', 'Tipo', 'select', { o: ['Nueva instalación', 'Ampliación', 'Modificación'] }), f('pprev', 'Potencia prevista (W)', 'num'), f('tension', 'Tensión', 'select', { o: ['230 V', '230/400 V'] }), f('esq', 'Esquema', 'select', { o: ESQ, def: 'TT' }), f('grado', 'Electrificación', 'select', { o: ['No aplica', 'Básica (5750 W)', 'Elevada (9200 W)'] }), f('igm', 'IGM / ICP (A)', 'num'), f('dif', 'Diferencial', 'text', { ph: '40 A / 30 mA' }), f('ncirc', 'Nº de circuitos', 'num'), f('di', 'Derivación individual', 'text'), f('lga', 'LGA', 'text')]),
        sec('docs', 'Documentación técnica', [f('doc', 'Documentación', 'select', { o: ['Memoria técnica de diseño', 'Proyecto'] }), f('refdoc', 'Referencia / autor / fecha'), f('oca', 'Certificado de inspección inicial (OCA), si procede')]),
        sec('ver', 'Verificaciones realizadas (UNE 20460-6-61)', [f('aisl', 'Resistencia de aislamiento (MΩ)', 'num'), f('rt', 'Resistencia de tierra (Ω)', 'num'), f('cont', 'Continuidad PE (Ω)', 'num'), f('dis', 'Disparo diferencial (mA / ms)', 'text'), f('du', 'Caída de tensión máx. medida (%)', 'num'), f('ck', 'Comprobaciones', 'lista', { items: ['Colores de conductores correctos', 'Secciones según ITC-BT-25 / cálculo', 'Equipotencialidad en baños y cocina', 'Cuadro rotulado y placa del instalador', 'Aparamenta con poder de corte suficiente'] })]),
        sec('emp', 'Empresa instaladora', [f('empresa', 'Empresa instaladora', 'text', { pf: 'empresa' }), f('cif', 'CIF', 'text', { pf: 'cif' }), f('habil', 'Nº de habilitación', 'text', { pf: 'habil' }), f('cat', 'Categoría', 'text', { pf: 'cat' }), f('instalador', 'Instalador en BT que suscribe', 'text', { pf: 'instalador' }), f('nif_i', 'NIF del instalador', 'text', { pf: 'nif_i' }), f('seguro', 'Seguro RC', 'text', { pf: 'seguro' }), f('fecha', 'Fecha', 'date')]),
      ],
      texto: 'El instalador abajo firmante, en representación de la empresa instaladora, CERTIFICA que la instalación descrita ha sido ejecutada de acuerdo con las prescripciones del Reglamento electrotécnico para baja tensión (RD 842/2002) y sus instrucciones técnicas complementarias, con las especificaciones particulares aprobadas a la compañía distribuidora y con el Proyecto o la Memoria Técnica de Diseño indicados, habiéndose realizado las verificaciones previas a la puesta en servicio con resultado satisfactorio.',
      firmas: ['El instalador en baja tensión', 'Sello de la empresa'],
    },
    verif: {
      t: 'Informe de verificación y medidas', ic: '📏', d: 'Registro de mediciones (aislamiento, tierra, bucle, diferenciales) con evaluación automática.',
      titulo: 'INFORME DE VERIFICACIÓN DE LA INSTALACIÓN',
      secs: [
        sec('dat', 'Datos de la instalación', [f('titular', 'Titular'), f('emplaz', 'Emplazamiento'), f('tipo', 'Tipo de verificación', 'select', { o: ['Previa a la puesta en servicio', 'Periódica / mantenimiento', 'Tras reparación'] }), f('fecha', 'Fecha', 'date'), f('tec', 'Verificador', 'text', { pf: 'instalador' })]),
        sec('eq', 'Equipos de medida', [f('eq', 'Instrumentos', 'tabla', { cols: [{ k: 'e', l: 'Equipo', w: 160 }, { k: 'm', l: 'Marca / modelo', w: 140 }, { k: 'n', l: 'Nº serie', w: 100 }, { k: 'c', l: 'Calibración hasta', w: 110 }], def: [{ e: 'Medidor de aislamiento' }, { e: 'Telurómetro' }, { e: 'Medidor de bucle' }, { e: 'Comprobador de diferenciales' }] })]),
        sec('med', 'Mediciones por circuito', [f('med', 'Medidas', 'tabla', { med: true, cols: [{ k: 'c', l: 'Circuito', w: 90 }, { k: 'ai', l: 'Aislam. (MΩ)', t: 'num', w: 95 }, { k: 'pe', l: 'Cont. PE (Ω)', t: 'num', w: 95 }, { k: 'zs', l: 'Bucle Zs (Ω)', t: 'num', w: 95 }, { k: 'dm', l: 'Disparo dif. (mA)', t: 'num', w: 105 }, { k: 'dt', l: 'Tiempo (ms)', t: 'num', w: 90 }, { k: 'ev', l: 'Eval.', calc: r => evalMed(r) }] }), f('rt', 'Resistencia de puesta a tierra (Ω)', 'num'), f('ut', 'Tensión de contacto límite', 'select', { o: ['50 V', '24 V'] }), f('idn', 'Sensibilidad del diferencial (mA)', 'num', { def: 30 })]),
        sec('ck', 'Comprobaciones', window.CHECK_VERIF.map((g, i) => f('ck' + i, g.g, 'lista', { items: g.i }))),
        sec('res', 'Resultado', [f('res', 'Resultado global', 'select', { o: ['Favorable', 'Favorable con observaciones', 'Desfavorable'] }), f('obs', 'Observaciones y defectos detectados', 'area')]),
      ],
      extras: { med: d => resumenTierra(d) },
      firmas: ['El verificador', 'Conforme del titular'],
    },
    presu: {
      t: 'Presupuesto para el cliente', ic: '💶', d: 'Partidas, IVA y condiciones, listo para enviar al cliente.',
      titulo: 'PRESUPUESTO',
      secs: [
        sec('cli', 'Cliente y obra', [f('cliente', 'Cliente'), f('nif_c', 'NIF/CIF'), f('dir_c', 'Dirección del cliente'), f('obra', 'Obra / instalación'), f('num', 'Nº de presupuesto'), f('fecha', 'Fecha', 'date'), f('valid', 'Validez (días)', 'num', { def: 30 })]),
        sec('emp', 'Empresa', PERFIL.slice(0, 7).map(([k, l]) => f(k, l, 'text', { pf: k }))),
        sec('part', 'Partidas', [f('part', 'Partidas', 'tabla', { cols: COL_PRESU, presu: true, def: [{ c: 'Cuadro general de mando y protección', u: 'ud', q: 1, p: '' }, { c: 'Cable H07V-K 1,5 mm²', u: 'm', q: '', p: '' }] }), f('desc', 'Descuento (%)', 'num', { def: 0 }), f('iva', 'IVA (%)', 'num', { def: 21 })]),
        sec('cond', 'Condiciones', [f('pago', 'Forma de pago', 'area', { def: '50 % a la aceptación del presupuesto y 50 % a la finalización de los trabajos.' }), f('conds', 'Condiciones', 'area', { def: 'Incluye mano de obra, materiales y legalización (certificado de instalación). No incluye obra civil, ayudas de albañilería ni tasas de la compañía distribuidora o de la Administración, salvo que se indique. Plazo de ejecución a convenir.' })]),
      ],
      extras: { part: d => totPresu(d.part, d.iva, d.desc) },
      firmas: ['Empresa instaladora', 'Conforme del cliente'],
    },
    mant: {
      t: 'Contrato de mantenimiento', ic: '🛠️', d: 'Mantenimiento de instalaciones eléctricas de BT con periodicidad y tareas (ITC-BT-03).',
      titulo: 'CONTRATO DE MANTENIMIENTO DE INSTALACIÓN ELÉCTRICA',
      secs: [
        sec('par', 'Partes', [f('cliente', 'Cliente / titular'), f('nif_c', 'NIF/CIF'), f('dir_c', 'Domicilio'), f('empresa', 'Empresa instaladora', 'text', { pf: 'empresa' }), f('cif', 'CIF empresa', 'text', { pf: 'cif' }), f('habil', 'Nº de habilitación', 'text', { pf: 'habil' }), f('instalador', 'Instalador responsable', 'text', { pf: 'instalador' })]),
        sec('ins', 'Instalación objeto del contrato', [f('emplaz', 'Emplazamiento'), f('uso', 'Uso', 'select', { o: USO }), f('pot', 'Potencia (W)', 'num'), f('desc', 'Descripción', 'area')]),
        sec('trab', 'Alcance del mantenimiento', [f('per', 'Periodicidad', 'select', { o: ['Anual', 'Semestral', 'Trimestral'] }), f('tareas', 'Tareas', 'lista', { items: ['Inspección visual de cuadros, conductores y mecanismos', 'Comprobación de diferenciales (botón de test y disparo)', 'Medida de la resistencia de puesta a tierra', 'Medida de aislamiento y continuidad', 'Reapriete de conexiones y limpieza de cuadros', 'Comprobación del alumbrado de emergencia', 'Termografía de cuadros (opcional)'], def: { 0: true, 1: true, 2: true, 3: true } }), f('otras', 'Otras tareas', 'area')]),
        sec('eco', 'Duración y precio', [f('inicio', 'Fecha de inicio', 'date'), f('dur', 'Duración (años)', 'num', { def: 1 }), f('precio', 'Precio anual (€, sin IVA)', 'num'), f('iva', 'IVA (%)', 'num', { def: 21 }), f('pago', 'Forma de pago', 'text', { def: 'Anual, por adelantado' })]),
        sec('cl', 'Cláusulas', [f('cl', 'Cláusulas', 'area', { def: '1. La empresa realizará el mantenimiento según la periodicidad pactada y entregará informe tras cada visita.\n2. Las reparaciones y sustituciones de material no incluidas se presupuestarán aparte.\n3. El titular comunicará cualquier anomalía y facilitará el acceso a la instalación.\n4. La empresa conservará copia del contrato a disposición de la Administración durante al menos 5 años tras su finalización (ITC-BT-03).\n5. Cualquier modificación de la instalación deberá comunicarse a la empresa.' })]),
      ],
      extras: { eco: d => { const p = num(d.precio) || 0, iv = num(d.iva); const t = p * (1 + (isNaN(iv) ? 21 : iv) / 100); return p ? `<p><b>Total anual con IVA:</b> ${fmt(t)} €</p>` : ''; } },
      firmas: ['La empresa instaladora', 'El cliente / titular'],
    },
  };

  /* ------------------------------------------------------------------ helpers de cálculo/vista */
  function sumRows(rows, fn) { return (rows || []).reduce((s, r) => s + (fn(r) || 0), 0); }
  function resumenCirc(rows) {
    rows = (rows || []).filter(r => r.ref || r.P);
    if (!rows.length) return '';
    const p = sumRows(rows, r => num(r.P) || 0);
    return `<p><b>Potencia total de circuitos:</b> ${fmt(p)} W · <b>Nº de circuitos:</b> ${rows.length}</p>`;
  }
  function totPresu(rows, iva, desc) {
    const sub = sumRows(rows, r => (num(r.q) || 0) * (num(r.p) || 0)); if (!sub) return '';
    const d = num(desc) || 0, i = isNaN(num(iva)) ? 21 : num(iva); const base = sub * (1 - d / 100), cuota = base * i / 100;
    return `<table><tbody><tr><td>Subtotal</td><td class="r">${fmt(sub)} €</td></tr>${d ? `<tr><td>Descuento (${fmt(d)} %)</td><td class="r">−${fmt(sub - base)} €</td></tr><tr><td>Base imponible</td><td class="r">${fmt(base)} €</td></tr>` : ''}<tr><td>IVA (${fmt(i)} %)</td><td class="r">${fmt(cuota)} €</td></tr><tr class="tot"><td>TOTAL</td><td class="r">${fmt(base + cuota)} €</td></tr></tbody></table>`;
  }
  function evalMed(r) {
    const out = []; const ai = num(r.ai), pe = num(r.pe), dt = num(r.dt);
    if (!isNaN(ai)) out.push(ai >= 0.5 ? '' : 'aislam.');
    if (!isNaN(pe) && pe > 2) out.push('PE');
    if (!isNaN(dt) && dt > 300) out.push('disparo');
    const any = !isNaN(ai) || !isNaN(pe) || !isNaN(dt);
    const bad = out.filter(Boolean);
    return !any ? '' : bad.length ? '✖ ' + bad.join(', ') : '✔';
  }
  function resumenTierra(d) {
    const rt = num(d.rt), idn = num(d.idn) || 30, ul = parseFloat(String(d.ut || '50')); if (isNaN(rt)) return '';
    const max = ul / (idn / 1000); const ok = rt <= max;
    return `<p><b>Resistencia de tierra:</b> ${fmt(rt)} Ω · máxima admisible (${ul} V / ${idn} mA) = ${fmt(max, 0)} Ω → <span class="${ok ? 'ok' : 'ko'}">${ok ? 'CUMPLE' : 'NO CUMPLE'}</span></p>`;
  }
  const ALL_F = t => t.secs.flatMap(s => s.campos);

  /* ------------------------------------------------------------------ almacenamiento */
  const docs = () => store.get('docs', []);
  const saveDocs = a => store.set('docs', a);
  const perfil = () => store.get('perfil', {});
  const uid = () => 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  function defaults(tpl) {
    const d = {}; const p = perfil();
    ALL_F(tpl).forEach(fl => { if (fl.pf && p[fl.pf]) d[fl.k] = p[fl.pf]; else if (fl.def !== undefined) d[fl.k] = JSON.parse(JSON.stringify(fl.def)); if (fl.t === 'tabla' && d[fl.k] === undefined) d[fl.k] = []; if (fl.t === 'lista' && d[fl.k] === undefined) d[fl.k] = {}; });
    return d;
  }
  function nuevo(tipo) {
    const tpl = TPLS[tipo]; const doc = { id: uid(), tipo, nombre: tpl.t, creado: Date.now(), mod: Date.now(), d: defaults(tpl) };
    const a = docs(); a.push(doc); saveDocs(a); return doc;
  }

  /* ------------------------------------------------------------------ renderizado del documento (vista previa) */
  const PH = '<span class="ph">…………</span>';
  function val(fl, v) {
    if (fl.t === 'check') return v ? 'Sí' : 'No';
    if (v === undefined || v === null || v === '') return PH;
    if (fl.t === 'date') { const dt = new Date(v); return isNaN(dt) ? esc(v) : dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); }
    return esc(v);
  }
  function renderTabla(fl, rows) {
    rows = rows || [];
    if (!rows.length) return `<p class="ph">(sin datos)</p>`;
    const cols = fl.cols;
    return `<table><thead><tr>${cols.map(c => `<th class="${c.t === 'num' || c.calc ? 'r' : ''}">${esc(c.l)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => { let v = c.calc ? c.calc(r) : r[c.k]; if (c.calc && typeof v === 'number') v = fmt(v); if (c.t === 'sel' && c.o) { const o = c.o.find(x => x[0] === v); v = o ? o[1] : v; } const cls = c.t === 'num' || (c.calc && typeof c.calc(r) === 'number') ? 'r' : ''; const s = (v === undefined || v === '') ? '' : esc(v); return `<td class="${cls}${s.startsWith('✖') ? ' ko' : s.startsWith('✔') ? ' ok' : ''}">${s}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function renderDoc(doc) {
    const tpl = TPLS[doc.tipo]; const d = doc.d; let n = 0;
    const secs = tpl.secs.map(s => {
      n++;
      const body = s.campos.map(fl => {
        const v = d[fl.k];
        if (fl.t === 'tabla') return `<h3>${esc(fl.l)}</h3>${renderTabla(fl, v)}`;
        if (fl.t === 'lista') return `<h3>${esc(fl.l)}</h3><ul class="ck">${fl.items.map((it, i) => `<li>${v && v[i] ? '☑' : '☐'} ${esc(it)}</li>`).join('')}</ul>`;
        if (fl.t === 'area') return `<h3>${esc(fl.l)}</h3><p>${v ? esc(v) : PH}</p>`;
        return null;
      });
      const simple = s.campos.filter(fl => !['tabla', 'lista', 'area'].includes(fl.t));
      const dl = simple.length ? `<dl>${simple.map(fl => `<dt>${esc(fl.l)}</dt><dd>${val(fl, d[fl.k])}</dd>`).join('')}</dl>` : '';
      const rest = s.campos.map((fl, i) => body[i]).filter(Boolean).join('');
      return `<section><h2>${n}. ${esc(s.t)}</h2>${dl}${rest}${tpl.extras && tpl.extras[s.id] ? tpl.extras[s.id](d) : ''}</section>`;
    }).join('');
    const emp = d.empresa || perfil().empresa;
    return `<div class="paper"><h1>${esc(tpl.titulo)}</h1><div class="sub">${esc(doc.nombre)}${d.fecha ? ' · ' + new Date(d.fecha).toLocaleDateString('es-ES') : ''}</div>${secs}${tpl.texto ? `<h2>Declaración</h2><p>${esc(tpl.texto)}</p>` : ''}<div class="firmas">${tpl.firmas.map(x => `<div>${esc(x)}</div>`).join('')}</div><div class="pie">Documento generado con Elec-LoM${emp ? ' · ' + esc(emp) : ''}. Borrador de trabajo: el contenido debe revisarse y adaptarse al modelo oficial y a la normativa autonómica aplicable.</div></div>`;
  }

  /* ------------------------------------------------------------------ vistas */
  route(/^#\/crear$/, () => {
    const mine = docs().sort((a, b) => b.mod - a.mod); const p = perfil();
    view.innerHTML = `<h1>Documentos</h1><p class="lead">Crea proyectos, memorias, certificados y presupuestos a partir de plantillas. Rellena por pasos, mira la vista previa en directo y exporta a PDF.</p>
    ${p.empresa ? '' : `<div class="note">💡 Guarda primero los <a href="#/crear/perfil"><b>datos de tu empresa</b></a>: se rellenan solos en todos los documentos.</div>`}
    <h2>Nuevo documento</h2>
    <div class="grid g2">${Object.entries(TPLS).map(([k, t]) => `<button class="card tplcard" data-new="${k}" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><span class="ic">${t.ic}</span><div><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></div></button>`).join('')}</div>
    <h2>Mis documentos <span class="muted" style="font-size:14px">${mine.length}</span></h2>
    ${mine.length ? mine.map(m => `<div class="dl"><span style="font-size:22px">${TPLS[m.tipo] ? TPLS[m.tipo].ic : '📄'}</span><b><a href="#/crear/${m.id}" style="color:inherit;text-decoration:none">${esc(m.nombre)}</a><br><span class="muted" style="font-weight:500;font-size:13px">${esc(TPLS[m.tipo] ? TPLS[m.tipo].t : '')} · ${new Date(m.mod).toLocaleString('es-ES')}</span></b><a class="btn sm pri" href="#/crear/${m.id}">Abrir</a><button class="btn sm" data-dup="${m.id}">Duplicar</button><button class="btn sm" data-del="${m.id}">Borrar</button></div>`).join('') : '<p class="muted">Todavía no has creado ningún documento.</p>'}
    <div class="row noprint" style="margin-top:20px"><a class="btn" href="#/crear/perfil">🏢 Datos de mi empresa</a><button class="btn" id="exp">⬇️ Copia de seguridad (JSON)</button><label class="btn" style="margin:0;cursor:pointer">⬆️ Importar<input type="file" id="imp" accept=".json,application/json" hidden></label></div>`;
    $$('[data-new]').forEach(b => b.onclick = () => { const d = nuevo(b.dataset.new); location.hash = '#/crear/' + d.id; });
    $$('[data-del]').forEach(b => b.onclick = () => { if (confirm('¿Borrar este documento?')) { saveDocs(docs().filter(x => x.id !== b.dataset.del)); go(); } });
    $$('[data-dup]').forEach(b => b.onclick = () => { const a = docs(); const o = a.find(x => x.id === b.dataset.dup); const c = JSON.parse(JSON.stringify(o)); c.id = uid(); c.nombre += ' (copia)'; c.mod = Date.now(); a.push(c); saveDocs(a); go(); });
    $('#exp').onclick = () => download('rebt-documentos.json', JSON.stringify({ docs: docs(), perfil: perfil() }, null, 1), 'application/json');
    $('#imp').onchange = e => { const fl = e.target.files[0]; if (!fl) return; fl.text().then(t => { try { const j = JSON.parse(t); if (!Array.isArray(j.docs)) throw new Error('formato'); const a = docs(); j.docs.forEach(x => { if (x && x.tipo && TPLS[x.tipo]) { x.id = uid(); a.push(x); } }); saveDocs(a); if (j.perfil && !perfil().empresa) store.set('perfil', j.perfil); go(); } catch (er) { alert('Archivo no válido.'); } }); };
  });

  route(/^#\/crear\/perfil$/, () => {
    const p = perfil();
    view.innerHTML = `<p><a href="#/crear">← Documentos</a></p><h1>Datos de mi empresa</h1><p class="lead">Se usan para rellenar automáticamente los nuevos documentos. Se guardan solo en este dispositivo.</p>
    <div class="fgrid" style="max-width:720px">${PERFIL.map(([k, l]) => `<div class="fld"><label for="p_${k}">${l}</label><input id="p_${k}" value="${esc(p[k] || '')}"></div>`).join('')}</div><div id="ok" class="note ok" hidden>✔ Guardado</div>`;
    $$('input').forEach(i => i.oninput = () => { const v = {}; PERFIL.forEach(([k]) => v[k] = $('#p_' + k).value); store.set('perfil', v); $('#ok').hidden = false; });
  });

  function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  let cur = 0;
  route(/^#\/crear\/(d[\w]+)$/, id => {
    const all = docs(); const doc = all.find(x => x.id === id);
    if (!doc || !TPLS[doc.tipo]) { view.innerHTML = '<p>Documento no encontrado. <a href="#/crear">Volver</a></p>'; return; }
    const tpl = TPLS[doc.tipo]; cur = Math.min(cur, tpl.secs.length - 1);
    let pend;
    const persist = () => { doc.mod = Date.now(); clearTimeout(pend); pend = setTimeout(() => { const a = docs(); const i = a.findIndex(x => x.id === doc.id); if (i >= 0) { a[i] = doc; saveDocs(a); } }, 250); };
    const complete = s => s.campos.some(fl => { const v = doc.d[fl.k]; return fl.t === 'tabla' ? (v && v.length) : fl.t === 'lista' ? Object.values(v || {}).some(Boolean) : (v !== undefined && v !== ''); });
    const drawPrev = () => { $('#prev').innerHTML = renderDoc(doc); };
    const fieldHTML = fl => {
      const v = doc.d[fl.k]; const full = ['area', 'tabla', 'lista'].includes(fl.t) ? ' full' : '';
      let inner = '';
      if (fl.t === 'area') inner = `<label for="f_${fl.k}">${esc(fl.l)}</label><textarea id="f_${fl.k}" data-k="${fl.k}" placeholder="${esc(fl.ph || '')}">${esc(v || '')}</textarea>`;
      else if (fl.t === 'select') inner = `<label for="f_${fl.k}">${esc(fl.l)}</label><select id="f_${fl.k}" data-k="${fl.k}"><option value="">— elegir —</option>${fl.o.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      else if (fl.t === 'check') inner = `<label class="check" style="border:0"><input type="checkbox" data-k="${fl.k}" ${v ? 'checked' : ''}><span>${esc(fl.l)}</span></label>`;
      else if (fl.t === 'lista') inner = `<label>${esc(fl.l)}</label>${fl.items.map((it, i) => `<label class="check" style="font-size:14px;color:var(--text);font-weight:500;margin:0"><input type="checkbox" data-l="${fl.k}" data-i="${i}" ${v && v[i] ? 'checked' : ''}><span>${esc(it)}</span></label>`).join('')}`;
      else if (fl.t === 'tabla') inner = tablaHTML(fl);
      else inner = `<label for="f_${fl.k}">${esc(fl.l)}</label><input id="f_${fl.k}" data-k="${fl.k}" ${fl.t === 'num' ? 'inputmode="decimal"' : ''} type="${fl.t === 'date' ? 'date' : 'text'}" placeholder="${esc(fl.ph || '')}" value="${esc(v ?? '')}">`;
      return `<div class="fld${full}">${inner}${fl.pf ? '' : ''}</div>`;
    };
    const tablaHTML = fl => {
      const rows = doc.d[fl.k] || [];
      const extra = fl.circ ? `<div class="row" style="margin:8px 0"><button class="btn sm" data-act="viv" data-t="${fl.k}">Cargar circuitos de vivienda (ITC-BT-25)</button><button class="btn sm pri" data-act="calc" data-t="${fl.k}">Calcular sección / caída</button></div>` : '';
      return `<label>${esc(fl.l)}</label>${extra}<div class="tbl"><table><thead><tr>${fl.cols.map(c => `<th>${esc(c.l)}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map((r, ri) => `<tr>${fl.cols.map(c => c.calc ? `<td class="calc">${esc((() => { const x = c.calc(r); return typeof x === 'number' ? fmt(x) : x; })())}</td>` : c.t === 'sel' ? `<td><select data-t="${fl.k}" data-r="${ri}" data-c="${c.k}">${c.o.map(([v, l]) => `<option value="${v}" ${r[c.k] === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td>` : `<td><input style="min-width:${c.w || 80}px" data-t="${fl.k}" data-r="${ri}" data-c="${c.k}" ${c.t === 'num' ? 'inputmode="decimal"' : ''} value="${esc(r[c.k] ?? '')}"></td>`).join('')}<td><button class="rm" data-act="rm" data-t="${fl.k}" data-r="${ri}" aria-label="Quitar fila">×</button></td></tr>`).join('')}</tbody></table></div><button class="btn sm" style="margin-top:8px" data-act="add" data-t="${fl.k}">+ Añadir fila</button>`;
    };
    const drawForm = () => {
      const s = tpl.secs[cur];
      $('#steps').innerHTML = tpl.secs.map((x, i) => `<button class="step ${i === cur ? 'on' : ''} ${complete(x) ? 'done' : ''}" data-s="${i}"><i>${complete(x) ? '✓' : i + 1}</i>${esc(x.t)}</button>`).join('');
      const hasPf = s.campos.some(fl => fl.pf);
      $('#form').innerHTML = `<div class="card"><h3 style="margin-bottom:12px">${cur + 1}. ${esc(s.t)}</h3>${hasPf ? '<div class="row" style="margin-bottom:10px"><button class="btn sm" data-act="pf">Rellenar con mis datos de empresa</button></div>' : ''}<div class="fgrid">${s.campos.map(fieldHTML).join('')}</div><div class="row" style="margin-top:10px"><button class="btn" data-s="${cur - 1}" ${cur === 0 ? 'disabled' : ''}>← Anterior</button><span class="sp"></span><button class="btn pri" data-s="${cur + 1}" ${cur === tpl.secs.length - 1 ? 'disabled' : ''}>Siguiente →</button></div></div>`;
    };
    view.innerHTML = `<div class="de-head noprint"><a href="#/crear" class="btn sm">← Documentos</a><input class="nm" id="nm" value="${esc(doc.nombre)}" aria-label="Nombre del documento"><button class="btn pri" id="prn">🖨️ Imprimir / PDF</button><button class="btn" id="html">⬇️ HTML</button></div>
    <div class="tabsw noprint"><button class="chip on" id="te">✏️ Editar</button><button class="chip" id="tp">👁️ Vista previa</button></div>
    <div class="de-body ed" id="body"><div class="de-edit noprint"><div class="steps" id="steps"></div><div id="form"></div></div><div class="de-prev" id="prev"></div></div>`;
    drawForm(); drawPrev();
    const setTab = t => { $('#body').className = 'de-body ' + t; $('#te').classList.toggle('on', t === 'ed'); $('#tp').classList.toggle('on', t === 'pv'); };
    $('#te').onclick = () => setTab('ed'); $('#tp').onclick = () => setTab('pv');
    $('#nm').oninput = e => { doc.nombre = e.target.value; persist(); drawPrev(); };
    $('#prn').onclick = () => { setTab('ed'); document.title = doc.nombre; setTimeout(() => window.print(), 50); };
    $('#html').onclick = () => download((doc.nombre || 'documento').replace(/[^\w\- ]+/g, '') + '.html', `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(doc.nombre)}</title><style>body{background:#eef0f4;margin:0;padding:24px}${PAPER_CSS}@media print{body{background:#fff;padding:0}.paper{box-shadow:none}}</style></head><body>${renderDoc(doc)}</body></html>`, 'text/html');

    const form = $('#form');
    form.addEventListener('input', e => {
      const t = e.target;
      if (t.dataset.t !== undefined) { const rows = doc.d[t.dataset.t]; rows[+t.dataset.r][t.dataset.c] = t.value; }
      else if (t.dataset.k) { if (t.type === 'checkbox') doc.d[t.dataset.k] = t.checked; else doc.d[t.dataset.k] = t.value; }
      else if (t.dataset.l) { const o = doc.d[t.dataset.l] = doc.d[t.dataset.l] || {}; o[t.dataset.i] = t.checked; }
      else return;
      persist(); drawPrev();
    });
    $('#steps').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { cur = +b.dataset.s; drawForm(); } };
    form.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.s !== undefined) { cur = +b.dataset.s; drawForm(); window.scrollTo(0, 0); return; }
      const act = b.dataset.act; if (!act) return;
      const k = b.dataset.t; const rows = k ? (doc.d[k] = doc.d[k] || []) : null;
      if (act === 'add') rows.push({});
      else if (act === 'rm') rows.splice(+b.dataset.r, 1);
      else if (act === 'pf') { const p = perfil(); tpl.secs[cur].campos.forEach(fl => { if (fl.pf && p[fl.pf]) doc.d[fl.k] = p[fl.pf]; }); }
      else if (act === 'viv') { [['C1', 'Iluminación', 2000, 15, 'mono', 1.5, 10], ['C2', 'Tomas de uso general', 3450, 15, 'mono', 2.5, 16], ['C3', 'Cocina y horno', 5400, 8, 'mono', 6, 25], ['C4', 'Lavadora, lavavajillas y termo', 3450, 10, 'mono', 4, 20], ['C5', 'Baño y auxiliares de cocina', 3450, 12, 'mono', 2.5, 16]].forEach(([ref, desc, P, L, sis, S, In]) => rows.push({ ref, desc, P, L, sis, S, In })); }
      else if (act === 'calc') {
        rows.forEach(r => {
          const P = num(r.P), L = num(r.L); if (isNaN(P) || isNaN(L)) return;
          const sis = r.sis || 'mono'; const U = sis === 'tri' ? 400 : 230; const Ib = P / ((sis === 'tri' ? Math.sqrt(3) : 1) * U);
          let S = num(r.S), In = num(r.In);
          if (isNaN(S)) { const res = C.calcularSeccion({ sistema: sis, P, L, metodo: 'B', aisl: 'PVC', limite: 3 }); if (res.solucion) { S = res.solucion.S; r.S = S; if (isNaN(In) && res.proteccion) { In = res.proteccion.In; r.In = In; } } }
          if (!isNaN(S)) { const iu = !isNaN(In) ? In : Ib; r.dU = +C.calcularCaida({ sistema: sis, I: iu, L, S, mat: 'Cu', aisl: 'PVC' }).dUp.toFixed(2); }
        });
      }
      persist(); drawForm(); drawPrev();
    });
    form.addEventListener('change', e => { if (e.target.dataset.t !== undefined) { drawForm(); } });
  });
});
