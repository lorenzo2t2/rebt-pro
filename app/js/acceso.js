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

    <h2>MasterD (MasterD | Davante)</h2>
    <div class="card">
      <p><b>Quién es:</b> hoy la web se presenta como «MasterD | Davante»; el Instituto Tecnológico Davante (antes itmasterd.es) es la marca del grupo para estos cursos. Ninguna página que he leído explica cuándo ni cómo cambió, ni habla de fusión o de un socio certificador concreto.</p>
      <p><b>Dos vías que ofrecen:</b></p>
      <ul><li><b>CIBTB</b> («Certificado en instalaciones de baja tensión, homologado por Industria»): prueba que combina teoría y práctica, hecha en sus aulas homologadas. Según una noticia de 2024 no depende de las convocatorias del Estado.</li>
      <li><b>PEAC</b> (acreditación de competencias): la convocan «los organismos de la Administración Pública» y lleva a certificados de profesionalidad (p. ej. ELEE0109).</li></ul>
      <p><b>Formato:</b> solo la página de ITDavante lo describe: prueba teórico-práctica de 2 partes, con 30 preguntas tipo test del REBT (se puede llevar el reglamento) más cuestiones teórico-prácticas, y una parte práctica de instalación, localización de averías y mediciones. No consta si es idéntica en MasterD.</p>
      <p><b>Requisitos citados:</b> mayor de edad, nacionalidad española o de la UE (o residencia en España) y leer y escribir en castellano.</p>
      <p><b>Quién certifica y corrige: NO está dicho en ninguna página.</b> Hablan de «aulas homologadas» y «empresas que nos avalan» sin nombrar a nadie. Tampoco aparecen ENAC, el organismo emisor, la nota mínima, la duración ni el precio. Hay datos que se contradicen entre páginas (35 o 39 centros, fechas, si el curso es requisito). Pídelo por escrito a MasterD.</p>
      <p><b>Mi inferencia (no confirmada):</b> si el certificado lo emite una entidad acreditada por ENAC, encaja en la vía 5; si es un certificado de profesionalidad, en la vía 2.</p>
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
      <li>${L('https://www.masterd.es/blog/consigue-el-carnet-de-instalador-electricista-homologado-por-industria', 'MasterD · carnet homologado por Industria')}</li>
      <li>${L('https://www.murcia.com/empresas/noticias/2024/09/06-los-cursos-de-masterd-ofrecen-preparacion-especializada-sobre-los-requisitos-para-obtener-el-carnet.asp', 'murcia.com · cursos MasterD (2024)')}</li>
      <li>${L('https://www.itdavante.es/certificados-profesionalidad', 'ITDavante · certificados y carnets')}</li>
      <li>${L('https://www.aprendemas.com/es/blog/orientacion-academica/a-por-el-carnet-de-instalador-electricista-masterd-se-convierte-en-centro-oficial-para-conseguirlo-164830', 'Aprendemas · MasterD, centro oficial (2022)')}</li>
    </ul>
    <p class="mini">Esta información es orientativa y puede cambiar. Lo que vale es lo que publique tu comunidad autónoma.</p>`;
  });
});
