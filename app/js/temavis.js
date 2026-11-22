/* Ilustraciones del temario: esquemas SVG propios (sin imágenes externas) para las fichas.
   Solo dibujan datos ya contrastados con el texto del REBT; las cotas son las del reglamento, el dibujo es esquemático.
   Uso: window.TEMVIS(idFicha) devuelve el HTML de la sección "Esquemas" o ''. */
(function () {
  'use strict';
  const W = (w, h, inner, label) => `<svg class="tv" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>${inner}</svg>`;
  const T = (x, y, s, c = 'ts', a = 'middle') => `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
  const B = (x, y, w, h, t, s = '', c = 'tb') => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>` + T(x + w / 2, y + h / 2 + (s ? -2 : 4), t, 'tt') + (s ? T(x + w / 2, y + h / 2 + 12, s) : '');
  const L = (x1, y1, x2, y2, c = 'ln') => `<line class="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const AR = (x1, y1, x2, y2) => `<line class="ln ac" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ar)"/>`;
  const EA = (x, y) => `<path class="ln" d="M${x} ${y}v8M${x - 10} ${y + 8}h20M${x - 6.5} ${y + 12}h13M${x - 3} ${y + 16}h6"/>`;
  const DIM = (x1, y1, x2, y2, t, off = 0) => L(x1, y1, x2, y2, 'dm') + T((x1 + x2) / 2 + off, (y1 + y2) / 2 + 4, t, 'tm');
  const fig = (titulo, svg, nota) => `<figure class="fig"><figcaption><b>${titulo}</b></figcaption>${svg}${nota ? `<p class="fignote">${nota}</p>` : ''}</figure>`;

  const F = {};

  F.itc01 = [fig('Clasificación de las tensiones (ITC-BT-01)', W(690, 210,
    T(8, 62, 'CA', 'tt', 'start') + T(8, 142, 'CC', 'tt', 'start') +
    B(50, 30, 200, 60, 'Muy baja tensión', 'Un ≤ 50 V', 'tb ok') + B(260, 30, 200, 60, 'Tensión usual', '50 < Un ≤ 500 V') + B(470, 30, 200, 60, 'Tensión especial', '500 < Un ≤ 1000 V', 'tb warn') +
    B(50, 110, 200, 60, 'Muy baja tensión', 'Un ≤ 75 V', 'tb ok') + B(260, 110, 200, 60, 'Tensión usual', '75 < Un ≤ 750 V') + B(470, 110, 200, 60, 'Tensión especial', '750 < Un ≤ 1500 V', 'tb warn') +
    T(345, 198, 'Tensiones usuales en CA: 230 V / 400 V (ITC-BT-01). CA: valor eficaz · CC: valor medio aritmético'), 'Escala de tensiones'), '')];

  F.itc04 = [fig('Del encargo a la puesta en servicio (ITC-BT-04 y 05)', W(690, 260,
    B(10, 20, 150, 56, 'Nueva instalación', 'o ampliación') + AR(160, 48, 190, 48) +
    B(190, 20, 160, 56, '¿Grupo y potencia', 'de la tabla 3.1?', 'tb warn') +
    AR(350, 34, 400, 34) + T(375, 28, 'Sí') + B(400, 8, 130, 40, 'PROYECTO', 'técnico titulado') +
    AR(350, 64, 400, 64) + T(375, 82, 'No') + B(400, 56, 130, 40, 'MTD', 'Memoria Técnica de Diseño') +
    AR(530, 28, 560, 90) + AR(530, 76, 560, 90) + B(545, 100, 135, 44, 'Ejecución', 'empresa instaladora BT') +
    AR(612, 144, 612, 170) + B(545, 170, 135, 44, 'Verificaciones', 'previas (ITC-BT-05)') +
    AR(545, 192, 510, 192) + B(330, 170, 180, 44, 'Certificado de instalación', 'lo emite la empresa instaladora') +
    AR(330, 192, 300, 192) + B(120, 170, 180, 44, '¿Inspección inicial?', 'OCA, ITC-BT-05 §4.1', 'tb warn') +
    AR(120, 192, 92, 192) + B(10, 170, 82, 44, 'Cada 5 años', 'periódica') +
    T(345, 245, 'Si encaja en varios grupos se aplica el más exigente. Ampliaciones: proyecto si se supera el 50 % de la potencia del proyecto anterior.'), 'Flujo de documentación'),
    'Esquema del flujo administrativo. Los límites de potencia por grupo están en la ficha (tabla del apartado 3.1).')];

  F.itc10 = [fig('Previsión de cargas de un edificio (ITC-BT-10)', W(690, 230,
    B(10, 20, 150, 56, 'Viviendas', 'n × grado × coef. simultaneidad') + B(10, 90, 150, 56, 'Servicios generales', 'simultaneidad 1') + B(10, 160, 150, 56, 'Locales y oficinas', '100 W/m², mín. 3450 W') +
    B(190, 20, 150, 56, 'Garajes', '10 W/m² natural · 20 W/m² forzada') + B(190, 90, 150, 56, 'Mínimo garaje', '3450 W a 230 V') +
    L(160, 48, 175, 118, 'dm') + L(160, 118, 175, 118, 'dm') + L(160, 188, 175, 118, 'dm') + AR(175, 118, 420, 118) +
    B(420, 80, 250, 76, 'Carga total del edificio', 'suma de todas las partidas', 'tb ok') +
    T(430, 190, 'Vivienda básica ≥ 5750 W · elevada ≥ 9200 W (230 V)', 'tt', 'start') + T(430, 208, 'Ejemplos de coeficiente: 10 viviendas → 8,5 · n > 21 → 15,3 + (n − 21)·0,5', 'ts', 'start'), 'Suma de cargas'), '')];

  F.itc12 = [fig('Instalación de enlace (ITC-BT-12)', W(690, 270,
    [['Red de', 'distribución'], ['Acometida', 'de la distribuidora'], ['CGP', 'fusibles de la LGA'], ['LGA', 'CGP → contadores'], ['Contadores', 'concentración'], ['DI', 'a cada usuario'], ['DGMP', 'ICP · IGM · ID · PIA']].map((p, i) => B(8 + i * 97, 30, 88, 60, p[0], p[1], i >= 2 && i <= 5 ? 'tb ok' : 'tb')).join('') +
    [0, 1, 2, 3, 4, 5].map(i => AR(96 + i * 97, 60, 105 + i * 97, 60)).join('') +
    L(202, 108, 587, 108, 'dm') + T(395, 126, 'Instalación de enlace: CGP → LGA → contadores → derivaciones individuales') +
    T(8, 166, 'Un solo usuario:', 'tt', 'start') +
    B(8, 176, 100, 50, 'Red', '') + AR(108, 201, 128, 201) + B(128, 176, 110, 50, 'Acometida', '') + AR(238, 201, 258, 201) + B(258, 176, 170, 50, 'CPM', 'CGP + contador en una caja', 'tb ok') + AR(428, 201, 448, 201) + B(448, 176, 120, 50, 'DGMP', 'sin LGA ni DI') +
    T(345, 255, 'Con 16 contadores o menos: armario · con más de 16: local de uso exclusivo (ITC-BT-16)'), 'Elementos de la instalación de enlace'), '')];

  F.itc15 = [fig('Derivación individual (ITC-BT-15)', W(690, 250,
    '<circle cx="130" cy="125" r="95" class="tb"/><circle cx="130" cy="125" r="82" fill="none" class="ln dm"/>' +
    '<circle cx="98" cy="98" r="24" fill="#8b5a2b" stroke="var(--text)"/><circle cx="162" cy="98" r="24" fill="#3a8fd8" stroke="var(--text)"/><circle cx="98" cy="154" r="24" fill="#f0d800" stroke="#2e9e3a" stroke-width="5" stroke-dasharray="7 5"/><circle cx="162" cy="154" r="12" fill="#d92b2b" stroke="var(--text)"/>' +
    T(98, 102, '6', 'wt') + T(162, 102, '6', 'wt') + T(98, 158, '6', 'ts') + T(162, 158, '1,5', 'wt') +
    T(130, 238, 'Sección del tubo (esquema)') +
    T(270, 36, '• Fase (marrón, negro o gris), neutro (azul claro)', 'tt', 'start') + T(270, 52, '  y protección (verde-amarillo): 6 mm² Cu como mínimo', 'tt', 'start') +
    T(270, 84, '• Hilo de mando (tarifa nocturna): 1,5 mm², rojo', 'tt', 'start') +
    T(270, 116, '• Tubo: Ø exterior nominal ≥ 32 mm, con holgura', 'tt', 'start') + T(270, 132, '  para ampliar la sección un 100 %', 'tt', 'start') +
    T(270, 156, 'Caída de tensión máxima (según centralización):', 'tt', 'start') +
    B(270, 168, 130, 44, '0,5 %', 'varios lugares') + B(410, 168, 130, 44, '1 %', 'concentrados') + B(550, 168, 130, 44, '1,5 %', 'un usuario sin LGA'), 'Sección de la derivación individual'), '')];

  F.itc16 = [fig('Local de contadores: cotas principales (ITC-BT-16)', W(690, 300,
    '<rect class="tb" x="60" y="40" width="300" height="230" rx="3"/>' + L(40, 270, 380, 270) +
    '<rect x="140" y="90" width="140" height="155" fill="var(--panel)" stroke="var(--accent)" stroke-width="2" rx="4"/>' + T(210, 160, 'Contadores', 'tt') + T(210, 178, 'concentración') +
    DIM(40, 270, 40, 40, '') + T(8, 28, 'Altura mínima del local: 2,30 m', 'tm', 'start') + DIM(110, 270, 110, 245, '', 0) + T(112, 262, '≥ 0,25 m', 'tm', 'start') + DIM(300, 270, 300, 90, '', 0) + T(304, 110, '≤ 1,80 m', 'tm', 'start') +
    T(304, 124, 'lectura', 'ts', 'start') +
    T(400, 70, '• Pasillo libre frente a los contadores: ≥ 1,10 m', 'tt', 'start') + T(400, 100, '• Paredes ocupadas por contadores: ancho ≥ 1,50 m', 'tt', 'start') +
    T(400, 130, '• Suelo de la concentración a ≥ 0,25 m del equipo', 'tt', 'start') + T(400, 160, '• Más de 16 contadores → local de uso exclusivo', 'tt', 'start') + T(400, 190, '• Hasta 16 contadores → armario', 'tt', 'start'), 'Cotas del local de contadores'), 'Dibujo de alzado esquemático, no a escala.')];

  F.itc17 = [fig('Cuadro de mando y protección de la vivienda (ITC-BT-17)', W(690, 290,
    L(30, 260, 330, 260) + '<rect class="tb" x="40" y="60" width="50" height="200"/>' + T(65, 160, 'Puerta', 'ts') + T(65, 174, 'entrada') +
    '<rect x="30" y="60" width="0" height="0"/>' +
    '<rect x="95" y="60" width="235" height="60" fill="var(--warnbg)" stroke="none"/>' + '<rect class="tb ok" x="190" y="78" width="110" height="38" rx="4"/>' + T(245, 101, 'Cuadro', 'tt') +
    DIM(340, 260, 340, 60, '', 0) + T(346, 70, '2 m', 'tm', 'start') + T(346, 124, '1,4 m', 'tm', 'start') + T(346, 214, 'suelo', 'ts', 'start') +
    T(115, 52, 'mandos entre 1,4 y 2 m', 'ts', 'start') + T(115, 276, 'Junto a la puerta de entrada; no en dormitorios ni baños', 'ts', 'start') +
    B(400, 20, 270, 42, 'ICP', 'compartimento independiente y precintable') + AR(535, 62, 535, 76) +
    B(400, 76, 270, 42, 'IGM', 'interruptor general, corte omnipolar') + AR(535, 118, 535, 132) +
    B(400, 132, 270, 42, 'ID', 'diferencial ≤ 30 mA, 1 por cada 5 circuitos') + AR(535, 174, 535, 188) +
    B(400, 188, 270, 42, 'PIA de cada circuito', 'bipolares · poder de corte ≥ 4,5 kA', 'tb ok') +
    T(535, 258, 'Orden desde la derivación individual'), 'Altura y orden de los dispositivos'), '')];

  F.itc25 = [fig('Circuitos de una vivienda con electrificación básica (ITC-BT-25)', W(690, 250,
    [['C1', 'Iluminación', '10 A', '1,5 mm²', 'máx. 30 puntos'], ['C2', 'Tomas generales', '16 A', '2,5 mm²', 'máx. 20 tomas'], ['C3', 'Cocina y horno', '25 A', '6 mm²', 'base 25 A'], ['C4', 'Lavadora, lavavajillas, termo', '20 A', '4 mm²', 'máx. 3 tomas'], ['C5', 'Baño y auxiliares de cocina', '16 A', '2,5 mm²', 'máx. 6 tomas']].map((c, i) =>
      `<rect class="tb" x="${8 + i * 135}" y="14" width="126" height="150" rx="8"/>` + T(71 + i * 135, 40, c[0], 'big') + T(71 + i * 135, 62, c[1].length > 20 ? c[1].slice(0, 18) + '…' : c[1], 'tt') + T(71 + i * 135, 86, 'PIA ' + c[2], 'tt') + T(71 + i * 135, 106, c[3], 'tt') + T(71 + i * 135, 130, c[4], 'ts')).join('') +
    T(345, 192, 'Electrificación elevada: además C6 (otro C1), C7 (otro C2), C8 calefacción, C9 aire acondicionado, C10 secadora, C11 automatización', 'ts') +
    T(345, 212, 'C13: recarga del vehículo eléctrico · Diferencial ≤ 30 mA: al menos 1 por cada 5 circuitos · Conductores de cobre', 'ts') +
    T(345, 232, 'Electrificación básica 5750 W (IGM 25 A) · elevada 9200 W (IGM 40 A)', 'tt'), 'Circuitos C1 a C5'), 'Valores de la ITC-BT-25 (tabla 1).')];

  F.itc27 = [fig('Volúmenes del cuarto de baño (ITC-BT-27) — alzado', W(690, 330,
    '<rect x="175" y="90" width="340" height="210" fill="var(--okbg)" opacity=".5"/>' +
    '<rect x="135" y="140" width="420" height="160" fill="var(--warnbg)" opacity=".0"/>' +
    '<rect x="60" y="20" width="85" height="280" fill="var(--panel2)" opacity=".7"/>' + '<rect x="545" y="20" width="85" height="280" fill="var(--panel2)" opacity=".7"/>' +
    '<rect x="145" y="20" width="400" height="280" fill="none"/>' +
    '<rect x="145" y="60" width="400" height="240" fill="none"/>' +
    '<rect x="120" y="90" width="450" height="210" fill="var(--warnbg)" opacity=".55"/>' + /* V2 (se superpone) */
    '<rect x="170" y="90" width="350" height="210" fill="var(--okbg)"/>' +   /* V1 */
    '<rect x="215" y="250" width="260" height="50" class="tb" rx="8"/>' +  /* bañera */
    T(345, 282, 'Volumen 0: interior de la bañera / plato', 'tt') +
    T(345, 138, 'Volumen 1', 'tt') + T(345, 154, 'sobre el volumen 0 hasta 2,25 m del suelo', 'ts') +
    T(145, 190, 'V2', 'tt') + T(545, 190, 'V2', 'tt') + T(70, 190, 'V3', 'tt') + T(620, 190, 'V3', 'tt') +
    DIM(660, 300, 660, 90, '', 0) + T(664, 200, '2,25 m', 'tm', 'start') +
    DIM(120, 318, 170, 318, '0,6 m') + DIM(20, 318, 120, 318, '2,4 m') +
    T(345, 18, 'Si el techo supera 2,25 m: V2 llega hasta el techo o 3 m (el menor)', 'ts') +
    T(345, 66, 'IP: V0 IPX7 · V1 y V2 IPX4 (IPX5 en baños comunes con chorros)', 'tt'), 'Volúmenes del baño'),
    'Esquema ilustrativo: las dimensiones de la bañera no están normalizadas. V2 = 0,6 m alrededor del V1; V3 = 2,4 m más allá del V2. Los falsos techos y mamparas no se consideran barreras.')];

  F.itc08 = [(() => {
    const panel = (x, ti, sub, src, masa, extra) => `<g transform="translate(${x} 0)">` + T(105, 20, ti, 'big') + T(105, 38, sub) + B(10, 50, 50, 80, 'Fuente', 'CT') + L(60, 70, 150, 70) + T(138, 66, 'L', 'ts') + L(60, 92, 150, 92) + T(138, 88, 'N', 'ts') + B(150, 50, 50, 80, 'Receptor', '') + src + masa + extra + '</g>';
    const pe = '<line x1="60" y1="114" x2="150" y2="114" stroke="#2e9e3a" stroke-width="3" stroke-dasharray="6 4"/>';
    const svg = panel(0, 'TT', 'masas a una tierra propia', EA(35, 130), L(175, 130, 175, 140) + EA(175, 140), '') +
      panel(230, 'TN-S', 'N y PE separados', EA(35, 130), '', pe + T(105, 108, 'PE', 'ts')) +
      panel(460, 'IT', 'fuente aislada o con impedancia', '<rect class="tb" x="22" y="140" width="26" height="14"/>' + L(35, 130, 35, 140) + L(35, 154, 35, 160) + EA(35, 160), L(175, 130, 175, 140) + EA(175, 140), T(35, 174, 'Z', 'ts')) +
      T(345, 212, 'T = conexión directa a tierra · I = aislada · 2.ª letra: masas a tierra (T) o al neutro (N)', 'ts') + T(345, 232, 'Las redes públicas de distribución se tratan como TT para el usuario · TN-C: neutro y protección en un solo conductor (PEN)', 'ts');
    return fig('Esquemas de distribución (ITC-BT-08)', W(690, 245, svg, 'Esquemas TT, TN-S e IT'), '');
  })()];

  F.itc18 = [fig('Elementos de la puesta a tierra (ITC-BT-18 y 26)', W(690, 300,
    '<rect class="tb" x="250" y="40" width="190" height="110" rx="4"/>' + T(345, 70, 'EDIFICIO', 'tt') +
    '<rect class="tb ok" x="285" y="100" width="120" height="34" rx="4"/>' + T(345, 116, 'Borne principal', 'tt') + T(345, 129, 'de tierra', 'ts') +
    L(20, 150, 670, 150) + T(660, 144, 'suelo', 'ts', 'end') +
    '<rect x="235" y="150" width="220" height="50" fill="var(--panel2)" stroke="var(--line)"/>' + T(262, 172, 'cimentación', 'ts', 'start') +
    '<path class="ln" stroke="#8b5a2b" stroke-width="3" d="M240 195H450"/>' + T(345, 217, 'anillo de cobre desnudo en el fondo de la cimentación', 'ts') +
    L(240, 195, 240, 262, 'pc') + L(450, 195, 450, 262, 'pc') + T(240, 280, 'pica', 'ts') + T(450, 280, 'pica', 'ts') +
    L(345, 134, 345, 195, 'dm') + T(352, 182, 'conductor de tierra', 'ts', 'start') +
    L(285, 117, 255, 117) + T(100, 92, 'Conductores de protección', 'tt', 'start') + T(100, 108, 'unen las masas al conductor de tierra', 'ts', 'start') +
    T(470, 70, 'Tensión de contacto máxima:', 'tt', 'start') + T(470, 88, '24 V en local conductor', 'ts', 'start') + T(470, 102, '50 V en los demás casos', 'ts', 'start') +
    T(470, 128, 'Dispositivo desmontable para medir', 'ts', 'start') + T(470, 142, 'la resistencia de la toma', 'ts', 'start') +
    T(470, 196, 'Profundidad de enterramiento', 'tt', 'start') + T(470, 212, 'nunca inferior a 0,50 m', 'ts', 'start'), 'Toma de tierra de un edificio'),
    'Esquema orientativo. Rehabilitación: electrodos en patios de luces o jardines y conexión de un hierro principal por zapata (ITC-BT-26).'),
  fig('Resistencia de un electrodo (ITC-BT-18, tabla 5)', W(690, 190,
    [['Pica vertical', 'R = ρ / L', 'L = longitud de la pica (m)'], ['Conductor enterrado', 'R = 2·ρ / L', 'L = longitud del conductor (m)'], ['Placa enterrada', 'R = 0,8·ρ / P', 'P = perímetro de la placa (m)']].map((e, i) => B(10 + i * 228, 20, 218, 90, e[0], e[1], i === 0 ? 'tb ok' : 'tb')).join('') +
    T(345, 134, 'ρ = resistividad del terreno (Ω·m) · L = longitud de la pica o del conductor (m) · P = perímetro de la placa (m)', 'ts') +
    T(345, 156, 'Ejemplo: pica de 2 m en terreno de 100 Ω·m → R = 100 / 2 = 50 Ω', 'tt'), 'Fórmulas de resistencia'), 'Con un diferencial de 30 mA y UL = 50 V: R máx. = 50 / 0,03 ≈ 1666 Ω (800 Ω con UL = 24 V).')];

  F.itc19 = [fig('Colores de los conductores (ITC-BT-19, 2.2.4)', W(690, 270,
    [['#3a8fd8', 'Neutro', 'azul claro'], ['#f0d800', 'Protección', 'verde-amarillo'], ['#8b5a2b', 'Fase', 'marrón'], ['#222', 'Fase', 'negro'], ['#9a9a9a', 'Fase', 'gris']].map((c, i) =>
      `<rect x="${12 + i * 134}" y="20" width="120" height="26" rx="13" fill="${c[0]}" stroke="var(--text)" stroke-width="1.4"${i === 1 ? ' stroke-dasharray="0"' : ''}/>` + (i === 1 ? '<rect x="' + (12 + 134) + '" y="20" width="60" height="26" rx="13" fill="#2e9e3a" opacity=".85"/>' : '') + T(72 + i * 134, 66, c[1], 'tt') + T(72 + i * 134, 82, c[2])).join('') +
    T(345, 118, 'Sección mínima del conductor de protección (misma materia que las fases) — tabla 2', 'tt') +
    B(10, 132, 215, 60, 'Fase S ≤ 16 mm²', 'PE = S') + B(237, 132, 215, 60, '16 < S ≤ 35 mm²', 'PE = 16 mm²') + B(464, 132, 215, 60, 'S > 35 mm²', 'PE = S / 2') +
    T(345, 224, 'Resistencia de aislamiento: 0,5 MΩ a 500 V (MBTS: 0,25 MΩ a 250 V) · Rigidez dieléctrica 2U + 1000 V (mín. 1500 V) 1 min', 'ts') +
    T(345, 244, 'Caída de tensión máx. desde el origen de la instalación interior: 3 % (viviendas y alumbrado) · 5 % (resto de usos)', 'ts'), 'Colores y secciones'), '')];

  F.itc22 = [fig('Protección contra sobrecargas (ITC-BT-22)', W(690, 200,
    L(30, 100, 660, 100) + [['Ib', 70, 'corriente de', 'empleo'], ['In', 230, 'calibre de la', 'protección'], ['Iz', 390, 'admisible', 'del cable'], ['1,45·Iz', 560, 'límite de', 'I₂']].map(p =>
      `<circle cx="${p[1]}" cy="100" r="6" fill="var(--accent)"/>` + T(p[1], 80, p[0], 'big') + T(p[1], 126, p[2]) + T(p[1], 140, p[3])).join('') +
    T(345, 30, 'Ib ≤ In ≤ Iz', 'big') + T(345, 52, 'La corriente de funcionamiento de la protección cumple I₂ ≤ 1,45 · Iz') +
    T(345, 176, 'Poder de corte ≥ corriente de cortocircuito máxima en el punto de instalación · La protección va en el origen del circuito', 'ts'), 'Condiciones de sobrecarga'),
    'La corriente convencional de funcionamiento I₂ de un magnetotérmico es 1,45·In (UNE-EN 60898).')];

  F.itc23 = [fig('Categorías de sobretensión, instalación a 230/400 V (ITC-BT-23)', W(690, 270,
    [[6, 'IV', 'origen de la instalación', 'contadores, equipos de protección'], [4, 'III', 'instalación fija', 'cuadros, aparamenta, canalizaciones, motores fijos'], [2.5, 'II', 'equipos conectados', 'electrodomésticos, herramientas portátiles'], [1.5, 'I', 'equipos muy sensibles', 'ordenadores, electrónica']].map((c, i) =>
      `<rect x="150" y="${16 + i * 58}" width="${c[0] / 6 * 380}" height="44" rx="6" class="tb${i === 0 ? ' warn' : ''}"/>` + T(30, 44 + i * 58, 'Cat. ' + c[1], 'tt') + T(160 + 0, 36 + i * 58, c[3], 'ts', 'start') + T(160, 52 + i * 58, c[2], 'ts', 'start') + T(150 + c[0] / 6 * 380 + 8, 44 + i * 58, c[0] + ' kV', 'tt', 'start')).join('') +
    T(345, 258, 'Tensión soportada a impulsos 1,2/50 µs', 'ts'), 'Categorías de sobretensión'), '')];

  F.itc24 = [fig('Contacto indirecto en esquema TT (ITC-BT-24 y 18)', W(690, 260,
    B(20, 40, 110, 70, 'Fuente', 'neutro a tierra') + L(130, 70, 400, 70) + T(260, 62, 'fase', 'ts') + L(130, 92, 400, 92) + T(260, 106, 'neutro', 'ts') +
    B(400, 40, 120, 70, 'Receptor', 'masa con defecto', 'tb bad') + '<path class="ln" stroke="var(--bad)" stroke-width="2.4" stroke-dasharray="6 4" d="M400 70L370 70L370 130L460 130L460 110"/>' + T(415, 148, 'defecto', 'ts') +
    L(460, 110, 460, 170) + EA(460, 170) + T(500, 186, 'RA', 'tt', 'start') + EA(75, 110) + T(100, 140, 'RB', 'tt', 'start') +
    L(75, 128, 75, 210, 'dm') + L(460, 190, 460, 210, 'dm') + L(75, 210, 460, 210, 'dm') + T(268, 204, 'la corriente de defecto vuelve por tierra', 'ts') +
    T(545, 70, 'RA · Ia ≤ U', 'big', 'start') + T(545, 92, 'U = 50 V (24 V conductor)', 'ts', 'start') + T(545, 112, 'Ia = corriente que asegura', 'ts', 'start') + T(545, 126, 'el disparo del diferencial', 'ts', 'start') +
    T(345, 245, 'Ejemplo: diferencial 30 mA → RA ≤ 50 V / 0,03 A = 1666 Ω (800 Ω a 24 V)', 'tt'), 'Circuito del defecto'), '')];

  F.itc47 = [fig('Arranque directo: Ia/In máximo según la potencia (ITC-BT-47, tabla 1)', W(690, 260,
    [['0,75–1,5 kW', 4.5], ['1,5–5 kW', 3], ['5–15 kW', 2], ['> 15 kW', 1.5]].map((p, i) =>
      `<rect class="tb${i === 3 ? ' warn' : ''}" x="${40 + i * 160}" y="${200 - p[1] * 36}" width="120" height="${p[1] * 36}" rx="6"/>` + T(100 + i * 160, 220, p[0], 'tt') + T(100 + i * 160, 192 - p[1] * 36 + 24, String(p[1]).replace('.', ','), 'big')).join('') +
    T(345, 20, 'Constante máxima entre la intensidad de arranque y la de plena carga', 'ts') +
    T(345, 248, 'Conductores de un solo motor: 125 % de la intensidad a plena carga · varios motores: 1,25·In del mayor + suma de los demás', 'ts'), 'Relación Ia/In'),
    'Por encima del límite: arrancador estrella-triángulo, arrancador estático o variador.')];

  F.itc09 = [fig('Canalización subterránea de alumbrado exterior (ITC-BT-09)', W(690, 280,
    '<rect x="20" y="40" width="360" height="200" fill="var(--panel2)"/>' + L(20, 40, 380, 40) + T(30, 32, 'nivel del suelo', 'ts', 'start') +
    '<line x1="20" y1="76" x2="380" y2="76" stroke="#d6a800" stroke-width="4" stroke-dasharray="10 5"/>' + T(30, 70, 'cinta de señalización', 'ts', 'start') +
    '<rect x="170" y="150" width="60" height="40" rx="20" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="200" cy="170" r="7" fill="#8b5a2b"/>' + T(200, 214, 'tubo Ø interior ≥ 60 mm', 'tt') +
    L(240, 40, 240, 190, 'dm') + T(246, 118, '≥ 0,4 m (hasta la', 'tm', 'start') + T(246, 130, 'parte inferior del tubo)', 'tm', 'start') +
    T(420, 60, '• Cinta a ≥ 0,10 m del nivel del suelo', 'tt', 'start') + T(420, 84, '  y a 0,25 m por encima del tubo', 'tt', 'start') +
    T(420, 120, '• Conductores de cobre, mínimo 6 mm² en redes', 'tt', 'start') + T(420, 138, '  subterráneas (2,5 mm² dentro de soportes)', 'tt', 'start') +
    T(420, 174, '• Caída de tensión máxima: 3 %', 'tt', 'start') + T(420, 210, '• Empalmes en cajas dentro de los soportes', 'tt', 'start') + T(420, 228, '  a ≥ 0,3 m del suelo, o en arqueta registrable', 'tt', 'start'), 'Zanja de alumbrado'),
    'Cables subterráneos de distribución (ITC-BT-07): profundidad ≥ 0,60 m en acera y ≥ 0,80 m en calzada.')];

  F.itc31 = [fig('Volúmenes de una piscina (ITC-BT-31) — planta', W(690, 298,
    '<rect x="130" y="20" width="430" height="230" rx="10" fill="var(--warnbg)" stroke="var(--line)"/>' +
    '<rect x="190" y="70" width="310" height="130" rx="8" fill="var(--okbg)" stroke="var(--line)"/>' +
    '<rect x="250" y="105" width="190" height="60" rx="6" fill="#3a8fd8" opacity=".55" stroke="var(--accent)" stroke-width="2"/>' +
    T(345, 140, 'Zona 0: interior del recipiente', 'tt') + T(345, 92, 'Zona 1: hasta 2 m del borde y 2,5 m de altura', 'tt') + T(345, 44, 'Zona 2: 1,5 m más allá de la zona 1', 'tt') +
    DIM(190, 235, 250, 235, '2 m', 0) + DIM(130, 262, 190, 262, '1,5 m', 0) +
    T(345, 285, 'En zonas 0 y 1: solo MBTS ≤ 12 V CA (30 V CC), con la fuente fuera de las zonas 0, 1 y 2', 'tt'), 'Zonas de una piscina'),
    'Plano esquemático. Con trampolines o toboganes, la zona 1 incluye 1,5 m alrededor de ellos. Proyecto si P > 5 kW; inspección inicial si P > 10 kW.')];

  F.itc40 = [fig('Tipos de instalación generadora (ITC-BT-40)', W(690, 270,
    T(115, 22, 'Aislada', 'big') + B(10, 36, 90, 46, 'Generador') + AR(100, 59, 130, 59) + B(130, 36, 90, 46, 'Cargas') + T(115, 106, 'sin conexión con la red', 'ts') +
    T(345, 22, 'Asistida', 'big') + B(240, 36, 90, 46, 'Red') + B(240, 100, 90, 46, 'Generador') + AR(330, 59, 360, 78) + AR(330, 123, 360, 100) + B(360, 66, 90, 46, 'Cargas') + T(345, 170, 'el generador soporta la carga si falla la red', 'ts') +
    T(575, 22, 'Interconectada', 'big') + B(470, 36, 90, 46, 'Red') + B(470, 100, 90, 46, 'Generador') + AR(560, 59, 590, 78) + AR(560, 123, 590, 100) + B(590, 66, 90, 46, 'Cargas', 'autoconsumo') + T(575, 170, 'funciona en paralelo con la red', 'ts') +
    T(345, 204, 'Protecciones mínimas: sobreintensidad · mínima tensión (< 0,5 s al 85 %) · sobretensión (< 0,5 s al 110 %)', 'tt') + T(345, 224, 'frecuencia fuera de 49–51 Hz (5 períodos) · interruptor automático de interconexión', 'tt') +
    T(345, 250, 'Cables de conexión para el 125 % de la intensidad máxima del generador · caída de tensión ≤ 1,5 %', 'ts'), 'Aislada, asistida e interconectada'), '')];

  F.itc43 = [fig('Clases de aparatos según su protección (ITC-BT-43)', W(690, 230,
    B(10, 20, 160, 100, 'Clase 0', 'solo aislamiento básico', 'tb bad') + T(90, 144, 'no se admite', 'tt') +
    B(180, 20, 160, 100, 'Clase I', 'masas al conductor de protección') + EA(260, 124) + T(260, 164, 'a tierra', 'ts') +
    B(350, 20, 160, 100, 'Clase II', 'doble aislamiento') + '<rect x="400" y="48" width="60" height="40" class="ln" fill="none"/><rect x="410" y="56" width="40" height="24" class="ln" fill="none"/>' + T(430, 144, 'sin conductor de protección', 'ts') +
    B(520, 20, 160, 100, 'Clase III', 'alimentado a MBTS') + T(600, 144, '≤ 50 V CA / 75 V CC', 'ts') +
    T(345, 205, 'Receptores con lámparas de descarga: compensación obligatoria hasta cos φ ≥ 0,9 · carga prevista 1,8 × la potencia en W (ITC-BT-44)', 'ts'), 'Clases de aparatos'), '')];

  F.electrotecnia = [fig('Triángulos de potencia y de Ohm', W(690, 250,
    '<path class="ln" d="M60 190L260 190L260 70z" fill="var(--panel2)"/><path class="ac" d="M60 190L260 190" stroke-width="3"/>' + T(160, 212, 'P (W)  potencia activa', 'tt') + T(270, 135, 'Q (VAr)', 'tt', 'start') + T(135, 120, 'S (VA)', 'tt', 'end') + T(100, 182, 'φ', 'big') +
    T(160, 236, 'cos φ = P / S', 'big') +
    '<circle cx="480" cy="110" r="70" class="tb"/>' + L(410, 110, 550, 110) + L(480, 110, 480, 180) + T(480, 82, 'U', 'big') + T(445, 150, 'I', 'big') + T(515, 150, 'R', 'big') +
    T(480, 206, 'U = I · R', 'tt') + T(480, 226, 'P = U · I · cos φ', 'ts') +
    T(620, 80, 'Monofásica: I = P / (U·cosφ)', 'ts', 'middle').replace('middle', 'middle') +
    T(620, 150, 'Trifásica: I = P / (√3·U·cosφ)', 'ts'), 'Triángulos'), 'Ejemplo: 10 kW a 400 V con cos φ = 1 → I = 10 000 / (1,732·400) ≈ 14,4 A.')];

  F.aparamenta = [fig('Disparo magnético de los magnetotérmicos (UNE-EN 60898, no es del REBT)', W(690, 190,
    [['B', 3, 5], ['C', 5, 10], ['D', 10, 20]].map((c, i) => T(20, 50 + i * 44, 'Curva ' + c[0], 'tt', 'start') + `<rect class="tb${i === 1 ? ' ok' : ''}" x="${100 + c[1] * 24}" y="${30 + i * 44}" width="${(c[2] - c[1]) * 24}" height="28" rx="5"/>` + T(100 + (c[1] + c[2]) / 2 * 24, 49 + i * 44, c[1] + '–' + c[2] + ' In', 'tt')).join('') +
    L(100, 164, 600, 164) + [0, 5, 10, 15, 20].map(n => L(100 + n * 24, 160, 100 + n * 24, 168) + T(100 + n * 24, 182, n + '·In')).join(''), 'Curvas B, C y D'),
    'B: cargas resistivas largas · C: uso general doméstico/terciario · D: motores y transformadores con picos de arranque (los valores son de la norma UNE, no del REBT).')];


  /* Figuras de las guías técnicas de aplicación del Ministerio de Industria (reproducción con atribución) */
  const GV = 'https://industria.gob.es/Calidad-Industrial/seguridadindustrial/instalacionesindustriales/baja-tension/Paginas/guia-tecnica-aplicacion.aspx';
  const GI = (f, alt, guia) => `<figure class="fig"><img class="gimg" src="img/guias/${f}.png" alt="${alt}" loading="lazy"><p class="fignote">${alt}. Fuente: Ministerio de Industria, <a href="${GV}" target="_blank" rel="noopener">${guia}</a>. Guía no vinculante; reproducción de la figura original.</p></figure>`;
  const G27 = 'Guía técnica BT-27 (ed. sep 2003, rev. 1)', G25 = 'Guía técnica BT-25 (ed. jul 2012, rev. 2)', G08 = 'Guía técnica BT-08 (ed. oct 2005, rev. 1)', G18 = 'Guía técnica BT-18 (ed. oct 2005, rev. 1)', G17 = 'Guía técnica BT-17 (ed. sep 2020, rev. 2)', G19 = 'Guía técnica BT-19 (ed. feb 2009, rev. 2)';
  const ADD = (id, titulo, items) => { (F[id] = F[id] || []).push(`<h4 class="gh">${titulo}</h4>` + items.map(i => GI(i[0], i[1], i[2])).join('')); };
  ADD('itc27', 'Figuras oficiales de los volúmenes (guía del Ministerio)', [
    ['g27-f1-banera', 'Figura 1: bañera (planta y alzado)', G27], ['g27-f2-banera-pared', 'Figura 2: bañera con pared fija', G27], ['g27-f3-ducha', 'Figura 3: ducha', G27],
    ['g27-f4-ducha-pared', 'Figura 4: ducha con pared fija', G27], ['g27-f5-ducha-sin-plato', 'Figura 5: ducha sin plato', G27], ['g27-f6-ducha-difusor-fijo', 'Figura 6: ducha sin plato con pared fija y difusor fijo', G27], ['g27-f7-cabina', 'Figura 7: cabina de ducha prefabricada', G27]]);
  ADD('itc25b', 'Ejemplos de planos con los puntos de utilización (guía del Ministerio)', [
    ['g25-fD-acceso', 'Figura D: acceso a la vivienda y vestíbulo', G25], ['g25-fE-salon', 'Figura E: sala de estar o salón', G25], ['g25-fF-dormitorio', 'Figura F: dormitorio', G25],
    ['g25-fG-cocina', 'Figura G: cocina', G25], ['g25-fH-bano', 'Figura H: baño-aseo', G25], ['g25-fI-pasillo', 'Figura I: pasillo', G25]]);
  ADD('itc08', 'Esquemas oficiales de distribución (guía del Ministerio)', [
    ['g08-f1-tns', 'Figura 1: esquema TN-S', G08], ['g08-f2-tnc', 'Figura 2: esquema TN-C', G08], ['g08-f3-tncs', 'Figura 3: esquema TN-C-S', G08], ['g08-f4-tt', 'Figura 4: esquema TT', G08], ['g08-f5-it', 'Figura 5: esquema IT', G08]]);
  ADD('itc18', 'Figuras oficiales de puesta a tierra (guía del Ministerio)', [
    ['g18-f1-circuito-tierra', 'Figura 1: representación esquemática de un circuito de puesta a tierra', G18], ['g18-fB-tt-defecto', 'Figura B: puestas a tierra en un esquema TT', G18]]);
  ADD('itc17', 'Figuras oficiales del cuadro (guía del Ministerio)', [
    ['g17-fA-envolventes', 'Figura A: posiciones de montaje horizontal y vertical', G17], ['g17-fB-cuadro', 'Figura B: características y ejemplo de instalación del cuadro general de mando y protección', G17]]);
  ADD('itc19', 'Identificación de conductores (guía del Ministerio)', [['g19-colores', 'Colores de los conductores', G19]]);

  window.TEMVIS = function (id) {
    const a = F[id];
    return a && a.length ? `<section class="tvis"><h3>Esquemas y dibujos</h3>${a.join('')}</section>` : '';
  };
})();
