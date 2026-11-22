/* Documentación que genera un electricista en Andalucía. Solo lo comprobado en textos de la Junta/BOJA; lo demás va marcado. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, esc, view, $, $$ } = A;
  const L = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`;
  const SRC = {
    junta: 'https://www.juntadeandalucia.es/organismos/politicaindustrialyenergia.html',
    boja: 'https://www.juntadeandalucia.es/boja/2015/121/',
  };

  /* Catálogo: id, título, quién lo firma, cuándo, contenido, fuente, estado */
  const DOCS = [
    { g: 'Empresa', t: 'Declaración responsable de empresa instaladora', q: 'Titular o representante de la empresa',
      c: 'Habilitación de la empresa como instaladora de baja tensión (categoría básica o especialista). Se presenta por declaración responsable en el tramitador de la Junta; la empresa queda inscrita en el registro de empresas instaladoras (RIIA). Requiere un instalador con carnet y los medios técnicos, seguro y demás requisitos de la ITC-BT-03.',
      v: 'Procedimiento y registro confirmados en la web de la Junta; no he podido leer la lista exacta de documentos a adjuntar.' },
    { g: 'Antes de la obra', t: 'Proyecto técnico', q: 'Técnico titulado competente',
      c: 'Obligatorio cuando la ITC-BT-04 lo exige por tipo de instalación y potencia. Con proyecto hace falta además certificado de dirección de obra y la instalación se registra en PUES.',
      v: 'Regla confirmada en la FAQ de la Junta (jun. 2022). Umbrales concretos: consulta la tabla de la ITC-BT-04 (apdo. 3.1) en Temario.' },
    { g: 'Antes de la obra', t: 'Memoria técnica de diseño (MTD)', q: 'Empresa instaladora o técnico titulado',
      c: 'Cuando no hace falta proyecto. En Andalucía se usa el modelo oficial de la Resolución de 17-06-2015 (DGIEM, BOJA nº 121 de 24-06-2015). Secciones del modelo: datos del titular, de la instalación, de la empresa o técnico, características generales, instalaciones de enlace, circuitos interiores (G-2), esquema unifilar o diagrama de bloques (H), plano de emplazamiento y croquis de acceso (I) e información adicional de alumbrado exterior (J, solo si aplica el RD 1890/2008: ITC-EA-05 y certificado de verificación inicial).',
      v: 'Estructura leída directamente del PDF oficial.' },
    { g: 'Fin de obra', t: 'Certificado de instalación eléctrica (CIE)', q: 'Instalador de la empresa instaladora',
      c: 'Lo emite la empresa al terminar y verificar. Por TECI lo genera el propio tramitador; por PUES se redacta con el modelo oficial (Resolución 17-06-2015, PDF rellenable de la Consejería). Debe recoger la potencia máxima admisible de toda la instalación: el titular no puede contratar más que esa potencia.',
      v: 'Confirmado en la guía de recarga VE (jun. 2022) y en la resolución.' },
    { g: 'Fin de obra', t: 'Certificado de dirección de obra', q: 'Técnico director',
      c: 'Solo si hubo proyecto. Si la ampliación de una instalación ya registrada en PUES se hace con MTD, se aporta un documento que justifique que no era necesario.',
      v: 'Confirmado en la FAQ de la Junta.' },
    { g: 'Fin de obra', t: 'Certificado de inspección inicial (OCA)', q: 'Organismo de control autorizado',
      c: 'Previo a la puesta en servicio en las instalaciones sujetas (las que requieren proyecto, entre otras). Las que pasan inspección inicial tienen después inspecciones periódicas cada 5 años según la guía de recarga VE.',
      v: 'La lista completa de instalaciones sujetas es la ITC-BT-05; aquí solo cito los casos que aparecen en las guías de la Junta.' },
    { g: 'Fin de obra', t: 'Registro de la instalación en TECI o PUES', q: 'Empresa instaladora (tramitación telemática)',
      c: 'La «legalización» es registrar la comunicación de puesta en servicio. TECI: instalaciones sin proyecto (Orden 24-10-2005). PUES: con proyecto o dirección de obra, y todos los generadores conectados a red.',
      v: 'Confirmado. No he encontrado tasas en las páginas leídas.' },
    { g: 'Después', t: 'Certificado de reparación o mantenimiento', q: 'Instalador de la empresa instaladora',
      c: 'Las meras reparaciones, verificaciones a petición del titular y mantenimiento no se registran en TECI ni PUES y no hay modelo oficial. La empresa certifica al titular: características principales, identificación de empresa e instalador y declaración de que se ejecutó conforme al REBT.',
      v: 'Confirmado en la FAQ y la guía de la Junta.' },
    { g: 'Después', t: 'Boletín / contrato de suministro', q: 'Titular y comercializadora',
      c: 'El CIE registrado es lo que el titular entrega a la comercializadora para contratar o ampliar potencia. El CUPS es el código de cada punto de suministro: un contador independiente con su propia instalación de enlace tiene CUPS propio.',
      v: 'Confirmado en la guía de recarga VE.' },
    { g: 'Casos especiales', t: 'Autoconsumo fotovoltaico', q: 'Empresa instaladora y titular',
      c: 'En baja tensión hasta 100 kW basta el registro en PUES como instalación de generación. Más de 100 kW en BT exige resolución expresa de autorización. Sin excedentes o con excedentes ≤ 15 kW en suelo urbanizado: exentas de depósito de garantía, acceso/conexión y contrato técnico de acceso. Con compensación simplificada, el reparto en colectivo usa coeficientes fijos que suman 1. Inspección inicial por OCA si es local mojado y supera 25 kW.',
      v: 'Del manual de la Junta de julio de 2019: puede haber cambiado desde entonces. Verifica la normativa vigente.' },
    { g: 'Casos especiales', t: 'Punto de recarga de vehículo eléctrico', q: 'Empresa instaladora',
      c: 'ITC-BT-52. Necesitan proyecto: P > 50 kW; exterior con P > 10 kW; cualquiera con modo de carga 4. Si no, MTD con el modelo oficial. CIE separado cuando el punto tiene contador y CUPS propios, o cuando la ampliación consiste solo en puntos de recarga. En una vivienda unifamiliar existente suele bastar un CIE.',
      v: 'Guía de la Junta actualizada el 27-06-2022.' },
    { g: 'Casos especiales', t: 'Alumbrado exterior', q: 'Empresa instaladora',
      c: 'Dentro del ámbito del RD 1890/2008 se añade la información de la ITC-EA-05 y el certificado de verificación inicial firmado por la empresa instaladora (apartado J de la MTD).',
      v: 'Del propio modelo de MTD.' },
    { g: 'Casos especiales', t: 'Instalación temporal (ferias, obras…)', q: 'Empresa instaladora',
      c: 'La FAQ de la Junta tiene una pregunta específica sobre ferias, casetas, circos y similares; el tipo «temporal para obras» y «temporal para locales abiertos» figuran como tipos de certificado en TECI.',
      v: 'No leí la respuesta completa; mírala en la FAQ antes de tramitar.' },
  ];

  function decidir(o) {
    const out = [];
    if (o.tipo === 'gen') {
      out.push(['PUES', 'Los generadores conectados a red se registran siempre en PUES, también los de hasta 10 kW que no necesitan proyecto ni dirección de obra.']);
    } else if (o.proyecto === 'si') {
      out.push(['PUES', 'Con proyecto (o dirección de obra) la nueva instalación se registra en PUES: proyecto + certificado de dirección de obra + CIE (modelo oficial) y, si procede, inspección inicial de OCA.']);
    } else if (o.base === 'pues') {
      out.push(['PUES', 'Si la instalación ya se registró en PUES, las ampliaciones y modificaciones siguen ahí aunque no necesiten proyecto: la MTD sustituye al proyecto y se justifica la no necesidad de dirección de obra.']);
    } else {
      out.push(['TECI', 'Sin proyecto ni dirección de obra: MTD (modelo oficial) + CIE, generado por el propio tramitador TECI.']);
    }
    if (o.tipo === 'rep') out.splice(0, out.length, ['Ninguno', 'Una mera reparación, revisión o mantenimiento no se registra en TECI ni PUES: se entrega al titular un certificado de la empresa instaladora (sin modelo oficial).']);
    return out[0];
  }

  route(/^#\/andalucia$/, () => {
    const grupos = [...new Set(DOCS.map(d => d.g))];
    view.innerHTML = `<h1>Documentación en Andalucía</h1>
    <p class="lead">Todo lo que genera una empresa instaladora de baja tensión, con el trámite de la Junta de Andalucía que corresponde. Cada ficha indica qué parte está <b>confirmada en documentos oficiales</b> y qué no pude comprobar.</p>

    <div class="card"><h3>¿TECI o PUES?</h3>
      <p>Responde y te digo por dónde se registra (regla de la FAQ de la Junta, rev. 30-06-2022).</p>
      <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px">
        <label>Qué haces<br><select id="a-tipo"><option value="nueva">Instalación nueva, ampliación o modificación</option><option value="gen">Generador conectado a red (p. ej. autoconsumo)</option><option value="rep">Reparación, revisión o mantenimiento</option></select></label>
        <label>¿Necesita proyecto o dirección de obra (ITC-BT-04)?<br><select id="a-pry"><option value="no">No</option><option value="si">Sí</option></select></label>
        <label>¿Ya estaba registrada en PUES?<br><select id="a-base"><option value="no">No / no lo sé</option><option value="pues">Sí</option></select></label>
      </div>
      <div class="result" id="a-res" style="margin-top:12px" aria-live="polite"></div>
    </div>

    ${grupos.map(g => `<h2>${esc(g)}</h2>${DOCS.filter(d => d.g === g).map(d => `<details><summary>${esc(d.t)}</summary><div>
      <p><b>Lo firma:</b> ${esc(d.q)}</p><p>${esc(d.c)}</p><p class="mini muted"><b>Fiabilidad:</b> ${esc(d.v)}</p></div></details>`).join('')}`).join('')}

    <h2>Lista de comprobación de una obra típica sin proyecto (TECI)</h2>
    <ol>
      <li>Empresa instaladora habilitada e instalador con carnet.</li>
      <li>MTD con el modelo oficial (o proyecto si la ITC-BT-04 lo pide).</li>
      <li>Ejecución y verificaciones (aislamiento, continuidad, diferenciales, tierra): usa <a href="#/pruebas">Pruebas</a>.</li>
      <li>CIE con la potencia máxima admisible de toda la instalación.</li>
      <li>Registro en TECI o PUES, y entrega de copia al titular.</li>
      <li>Titular contrata con la comercializadora (potencia ≤ la del CIE).</li>
    </ol>

    <h2>Lo que no he podido confirmar</h2>
    <ul>
      <li>Tasas y plazos de cada trámite: no aparecen en las páginas leídas.</li>
      <li>Umbrales completos de proyecto de la ITC-BT-04 y el procedimiento paso a paso de TECI/PUES (la página del procedimiento salía vacía).</li>
      <li>Los textos de autoconsumo son de 2019 y las guías de VE de 2022.</li>
    </ul>

    <h2>Normativa y fuentes</h2>
    <ul>
      <li>Decreto 59/2005 y Decreto 9/2011 (instalaciones eléctricas y puesta en servicio en Andalucía).</li>
      <li>Orden de 24-10-2005 (procedimiento electrónico TECI).</li>
      <li>Resoluciones de 17-06-2015 (modelos oficiales de CIE y MTD, ${L(SRC.boja, 'BOJA nº 121, 24-06-2015')}).</li>
      <li>Resolución de 28-09-2023 (ficha técnica de baja tensión).</li>
      <li>${L(SRC.junta, 'Consejería de Política Industrial y Energía · Junta de Andalucía')}</li>
    </ul>
    <p class="mini">Los modelos oficiales (CIE y MTD) los facilita la Junta y prevalecen sobre cualquier copia. Para redactar presupuestos, mantenimiento y otros documentos propios usa <a href="#/crear">Crear documentos</a>.</p>`;

    const act = () => {
      const [k, t] = decidir({ tipo: $('#a-tipo').value, proyecto: $('#a-pry').value, base: $('#a-base').value });
      $('#a-res').innerHTML = `<b>${esc(k)}</b><p>${esc(t)}</p>`;
    };
    $$('#a-tipo,#a-pry,#a-base').forEach(s => s.onchange = act); act();
  });
});
