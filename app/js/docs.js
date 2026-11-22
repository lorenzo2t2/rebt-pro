/* Documentación y flujo de trabajo del instalador en baja tensión (ITC-BT-03, 04, 05) */
window.FLUJO = [
  { t: '1. Estudio y presupuesto', d: 'Visita técnica, levantamiento de planos, previsión de cargas (ITC-BT-10), grado de electrificación (ITC-BT-25), tipo de local (húmedo, mojado, pública concurrencia…), decisión Proyecto vs. MTD (ITC-BT-04).' },
  { t: '2. Documentación técnica', d: 'Proyecto (técnico titulado) o Memoria Técnica de Diseño (instalador/técnico, impreso de la Comunidad Autónoma): receptores y potencias, cálculos de LGA/DI/líneas, esquema unifilar, croquis de trazado.' },
  { t: '3. Contrato / solicitud de suministro', d: 'Condiciones de acometida y de enlace con la empresa distribuidora (normas particulares). Derechos de acometida y de extensión.' },
  { t: '4. Ejecución', d: 'Montaje según REBT y normas UNE: canalizaciones (ITC-BT-20/21), cuadros, conductores (colores), puestas a tierra (ITC-BT-18), protección diferencial y magnetotérmica, equipotencialidad en baños. Con dirección de obra si hay proyecto.' },
  { t: '5. Verificaciones previas', d: 'UNE 20460-6-61: continuidad PE, aislamiento, rigidez dieléctrica, resistencia de tierra, bucle de defecto, disparo de diferenciales, caída de tensión, sentido de giro, etc. Anotar resultados.' },
  { t: '6. Inspección inicial (si procede)', d: 'Por Organismo de Control en las instalaciones del apartado 4.1 de ITC-BT-05 (pública concurrencia, piscinas > 10 kW, alumbrado exterior > 5 kW…).' },
  { t: '7. Certificado de Instalación Eléctrica (CIE)', d: 'Lo firma un instalador de la empresa instaladora: características, potencia, identificación de empresa e instalador, declaración de conformidad con REBT. Se entrega al titular y se registra ante la Comunidad Autónoma con el proyecto o MTD.' },
  { t: '8. Puesta en servicio y contratación', d: 'Con el CIE registrado el titular contrata el suministro con la comercializadora; la distribuidora conecta. Se entrega al cliente: esquema unifilar, instrucciones y recomendaciones de mantenimiento.' },
  { t: '9. Mantenimiento e inspecciones periódicas', d: 'Mantenimiento por empresa instaladora (contratos conservados 5 años). Inspecciones periódicas por OCA cada 5 años (10 años zonas comunes de viviendas > 100 kW).' },
];

window.CHECK_VERIF = [
  { g: 'Cuadro y protecciones', i: ['Calibres de PIA coherentes con la sección y Iz del circuito', 'Poder de corte ≥ Icc en cada punto (mín. 4,5 kA en vivienda)', 'Diferenciales de 30 mA (1 por cada 5 circuitos máx.) y su disparo con botón de test', 'ICP / IGM correctos (25 A básica / 40 A elevada)', 'Cuadro identificado (rótulos de circuitos) y esquema unifilar entregado', 'Protección contra sobretensiones (si procede)'] },
  { g: 'Conductores y canalizaciones', i: ['Colores: azul (N), verde-amarillo (PE), marrón/negro/gris (fases)', 'Secciones mínimas de ITC-BT-25 respetadas', 'Tubos con diámetro suficiente (ITC-BT-21) y permiten ampliación', 'Conexiones en cajas o bornes (nunca empalmes sueltos)', 'Distancias a otras canalizaciones (agua, gas, calefacción)', 'Conductores no propagadores del incendio donde se exija'] },
  { g: 'Puesta a tierra y equipotencialidad', i: ['Resistencia de tierra medida con telurómetro (anotar valor)', 'Arqueta / punto de puesta a tierra accesible', 'Continuidad de conductores de protección en todos los circuitos', 'Conexión equipotencial local en baños y cocinas', 'Masas metálicas conectadas (cuadro, tuberías metálicas, estructura)'] },
  { g: 'Medidas eléctricas', i: ['Resistencia de aislamiento ≥ 0,5 MΩ (ensayo a 500 V)', 'Bucle de defecto Zs (esquema TN) / Ra (TT)', 'Tiempo y corriente de disparo de diferenciales', 'Caída de tensión en el punto más alejado (≤ 3 %)', 'Intensidades y reparto entre fases (trifásico)', 'Sentido de giro de motores'] },
  { g: 'Baños y locales especiales', i: ['Volúmenes 0-3 respetados y IP correcto', 'Sin interruptores/tomas en volúmenes prohibidos', 'Locales mojados/húmedos: IP y estanqueidad', 'Garaje: ventilación y clasificación', 'Alumbrado de emergencia si pública concurrencia (≥ 1 lux, 1 h)'] },
  { g: 'Documentación final', i: ['Proyecto o MTD firmados', 'Certificado de Instalación firmado por el instalador', 'Certificado de inspección favorable (si procede)', 'Registro en la Comunidad Autónoma', 'Entrega al cliente de documentación y garantía'] },
];

window.MEDIDAS = [
  { n: 'Resistencia de aislamiento', eq: 'Medidor de aislamiento (megóhmetro)', p: 'Circuito sin tensión y receptores desconectados. Medir entre fases/neutro y entre conductores activos y tierra a 500 V. Valor mínimo: 0,5 MΩ (0,25 MΩ en MBTS con 250 V; 1 MΩ con 1000 V).' },
  { n: 'Continuidad de conductores de protección', eq: 'Medidor de continuidad (≥ 200 mA)', p: 'Comprobar PE desde el cuadro hasta cada masa y punto de toma. Resistencia muy baja (décimas de ohmio).' },
  { n: 'Resistencia de puesta a tierra', eq: 'Telurómetro (método 62 % o pinza)', p: 'Con picas auxiliares de corriente y tensión alineadas. Anotar valor y estado del terreno (el valor es máximo en terreno seco).' },
  { n: 'Impedancia del bucle de defecto', eq: 'Medidor de bucle (Zs)', p: 'En TN: Zs · Ia ≤ U₀ y tiempo de corte según protección. En TT se mide Ra o Rtotal del bucle.' },
  { n: 'Disparo de diferenciales', eq: 'Comprobador de diferenciales', p: 'Disparo a I_Δn en ≤ 300 ms (30 mA: normalmente ≤ 40 ms a 5·I_Δn); no disparo a 0,5·I_Δn.' },
  { n: 'Caída de tensión', eq: 'Multímetro / analizador', p: 'Tensión en origen y en el punto más alejado a plena carga; ΔU ≤ 3 % (viviendas).' },
  { n: 'Intensidades y potencia', eq: 'Pinza amperimétrica / analizador', p: 'Equilibrio de fases, cos φ, comprobación de la potencia prevista.' },
  { n: 'Iluminación de emergencia', eq: 'Luxómetro', p: '≥ 1 lux en eje de pasillos y ≥ 5 lux en equipos de seguridad; autonomía 1 h.' },
];

window.SIMBOLOS = [
  ['Interruptor automático magnetotérmico (PIA)', 'Protección contra sobrecarga y cortocircuito'],
  ['Interruptor diferencial (ID)', 'Corriente diferencial residual; 30 mA protección complementaria'],
  ['Fusible', 'Protección contra sobreintensidades'],
  ['Contactor', 'Maniobra a distancia de potencia'],
  ['Relé térmico', 'Protección contra sobrecarga de motor'],
  ['Seccionador', 'Aislamiento visible del circuito'],
  ['Pulsador / interruptor / conmutador', 'Mando de alumbrado; conmutador de cruce para > 2 puntos'],
  ['Toma de corriente (base)', '16 A 2p+T, 25 A 2p+T (UNE 20315)'],
  ['Punto de luz', 'Lámpara / luminaria'],
  ['M (círculo)', 'Motor, con flecha para trifásico'],
  ['⏚ Tierra', 'Puesta a tierra / conductor de protección'],
];

window.GLOSARIO = [
  ['Ib', 'Corriente de empleo (corriente que circula por el circuito).'],
  ['In', 'Corriente asignada del dispositivo de protección.'],
  ['Iz', 'Corriente admisible del conductor (tras factores de corrección).'],
  ['I₂', 'Corriente convencional de funcionamiento (1,45·In en magnetotérmicos).'],
  ['Icc', 'Corriente de cortocircuito.'],
  ['Ia', 'Corriente que asegura el funcionamiento de la protección en el tiempo exigido.'],
  ['I_Δn', 'Corriente diferencial asignada (sensibilidad) del diferencial.'],
  ['UL', 'Tensión de contacto límite convencional (24 V o 50 V).'],
  ['PIA', 'Pequeño interruptor automático (magnetotérmico).'],
  ['ICP', 'Interruptor de control de potencia.'],
  ['IGM / IGA', 'Interruptor general de mando / automático.'],
  ['CGP / CPM', 'Caja general de protección / caja de protección y medida.'],
  ['LGA / DI', 'Línea general de alimentación / derivación individual.'],
  ['DGMP', 'Dispositivos generales de mando y protección.'],
  ['MBTS / MBTP', 'Muy baja tensión de seguridad / de protección.'],
  ['OCA', 'Organismo de Control Autorizado.'],
  ['CIE', 'Certificado de instalación eléctrica.'],
  ['MTD', 'Memoria técnica de diseño.'],
  ['SAVE', 'Sistema de alimentación del vehículo eléctrico.'],
  ['SPD', 'Dispositivo de protección contra sobretensiones.'],
  ['IP / IK', 'Grado de protección contra sólidos y agua / contra impactos.'],
];

window.EXAMEN_INFO = {
  titulo: 'Cómo es el examen de instalador en baja tensión',
  puntos: [
    'Desde el RD 560/2010 <b>no existe el carné administrativo</b>: el instalador acredita su competencia por una de las 5 vías de la ITC-BT-03 §4. La vía del <b>examen</b> es la certificación de personas por entidad acreditada por ENAC (UNE-EN ISO/IEC 17024), cuyo esquema debe incluir al menos los contenidos del <b>Apéndice II</b> (los que sigue esta app).',
    'Cada entidad certificadora/centro examinador fija el formato exacto (nº de preguntas, tiempo, nota de corte, parte práctica). <b>Pregunta en tu centro</b>: lo habitual es un test teórico (REBT, cálculos, ITC) y una prueba práctica (montaje, verificación, uso de instrumentos).',
    'Para la <b>categoría básica (IBTB)</b> el temario es el de las 7 unidades de esta app. Para <b>especialista (IBTE)</b> se añaden: líneas de distribución (ITC-BT-06/07/11), automatización (ITC-BT-51), riesgo de incendio/explosión (ITC-BT-29), quirófanos (ITC-BT-38) y generadoras ≥ 10 kW (ITC-BT-40).',
    'Suelen permitir calculadora y el texto del REBT; en la parte práctica se juzgan el uso de herramientas y de aparatos de medida (telurómetro, medidor de aislamiento, multímetro, pinza, verificador de diferenciales).',
    'Estrategia: domina primero los <b>números clave</b> (secciones mínimas, caídas de tensión, volúmenes de baño, circuitos de vivienda, plazos), después los <b>cálculos tipo</b>, y por último los casos especiales.',
  ],
};
