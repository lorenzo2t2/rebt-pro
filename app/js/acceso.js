/* Cómo se accede a instalador BT: vías, academia (MasterD) y qué preguntar. Solo datos con fuente; lo no verificado se dice. */
(window.REBTExt = window.REBTExt || []).push(function (A) {
  'use strict';
  const { route, esc, view } = A;
  const L = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`;
  route(/^#\/acceso$/, () => {
    view.innerHTML = `<h1>Acceso a instalador y examen</h1>
    <p class="lead">Cómo se obtiene hoy la habilitación de instalador en baja tensión, qué papel tiene una academia como MasterD y qué conviene preguntar antes de presentarse. Solo incluyo lo que he podido comprobar en fuentes; lo demás lo marco como pendiente de confirmar.</p>

    <div class="card"><h3>⚠️ Lo más importante</h3>
      <p>Según la <b>Comunidad de Madrid</b>, desde mediados de 2010 <b>ya no se accede a la profesión mediante un examen de la Administración</b>: hay que acreditar una de las vías de abajo. El «examen» actual lo organiza quien certifica o forma, no un tribunal de Industria. <span class="badge">Otras comunidades pueden diferir: confírmalo en la tuya.</span></p></div>

    <h2>Vías para acreditar la cualificación (ITC-BT-03)</h2>
    <p>Idénticas para categoría básica (IBTB) y especialista (IBTE). Según la web de Industria de Madrid:</p>
    <ol>
      <li>Título universitario.</li>
      <li>Título de FP o certificado de profesionalidad del Repertorio Nacional.</li>
      <li>Competencia profesional por experiencia laboral (RD 1224/2009).</li>
      <li>Cualificación reconocida de otro Estado miembro de la UE (RD 581/2017).</li>
      <li>Certificación de una entidad acreditada por ENAC o equivalente (UNE-EN ISO/IEC 17024).</li>
    </ol>
    <p>Además, el instalador debe trabajar dentro de una <b>empresa instaladora de baja tensión habilitada</b>. Básica: atribuciones limitadas a lo del apartado 3.1 de la ITC-BT-03. Especialista: todo el Reglamento.</p>

    <h2>MasterD</h2>
    <div class="card">
      <p><b>Lo que dicen sus fuentes</b> (artículo de Aprendemas, julio de 2022): MasterD se presenta como «centro oficial» / homologado para el carnet de instalador electricista; el alumno puede hacer las pruebas teóricas y prácticas en sus propios centros, además de la vía de examen en la comunidad; el curso incluye tutorías, clases prácticas y simulacros de examen; la certificación habilita para diseñar, realizar, verificar y firmar certificados de instalación en BT, fotovoltaica y recarga de VE; dicen tener 35 centros.</p>
      <p><b>Lo que NO he podido comprobar</b>: qué significa «oficial» legalmente, qué entidad emite el certificado ni quién corrige las pruebas, formato, número de preguntas, nota mínima y precio.</p>
      <p><b>Mi inferencia (no confirmada):</b> encajaría en la vía 5, certificación por entidad acreditada. Pregúntalo antes de dar nada por hecho.</p>
    </div>

    <h2>Qué preguntar a la academia o a la entidad certificadora</h2>
    <ul>
      <li>¿Qué entidad emite el certificado y está <b>acreditada por ENAC</b> (UNE-EN ISO/IEC 17024)?</li>
      <li>¿Lo reconoce <b>mi comunidad autónoma</b> para la habilitación como instalador (categoría básica)?</li>
      <li>Formato de la prueba teórica (tipo test o desarrollo), nº de preguntas, duración y nota mínima.</li>
      <li>Prueba práctica: qué se hace (montaje, medidas, esquemas), con qué material y cuánto dura.</li>
      <li>Temario exacto y normativa aplicable (REBT, ITC-BT, normas UNE).</li>
      <li>Convocatorias, tasas y qué pasa si suspendes (repetición, plazos).</li>
      <li>Documentación que tendrás que presentar después a Industria.</li>
    </ul>

    <h2>Cómo usar esta app para prepararlo</h2>
    <ul>
      <li>Banco de <a href="#/test">Examen</a>: entrenamiento propio sobre el REBT; <b>no son preguntas reales</b> de ninguna entidad.</li>
      <li><a href="#/pruebas">Pruebas</a> y <a href="#/esquemas">Esquemas</a> para la parte práctica.</li>
      <li><a href="#/guia">Guía REBT</a> para localizar el artículo exacto.</li>
    </ul>

    <h2>Fuentes</h2>
    <ul>
      <li>${L('https://www.comunidad.madrid/industria/examenes-carnes-profesionales', 'Comunidad de Madrid · Exámenes y carnés profesionales')} (consultada en nov. 2026)</li>
      <li>${L('https://www.comunidad.madrid/docs/assets/2023/06/28/nota_informativa_pagina_web_rebt_28-06-2023.pdf', 'Madrid · Títulos de FP y certificados válidos, categoría básica (PDF)')}</li>
      <li>${L('https://www.aprendemas.com/es/blog/orientacion-academica/a-por-el-carnet-de-instalador-electricista-masterd-se-convierte-en-centro-oficial-para-conseguirlo-164830', 'Aprendemas · MasterD, centro oficial (2022)')}</li>
    </ul>
    <p class="mini">Esta información es orientativa y puede cambiar. Lo que vale es lo que publique tu comunidad autónoma.</p>`;
  });
});
