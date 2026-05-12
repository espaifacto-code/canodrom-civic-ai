-- Seed data: Workshop Canodrom — Turismo masivo en Barcelona
-- Ejecutar en Supabase SQL Editor

INSERT INTO public.civic_records (
  issue, area, participant, status, approved,
  avg_social_impact, avg_feasibility, avg_inclusivity, avg_sustainability,
  ethical_issues_count, proposal_count, proposals, scores, ethical_issues
) VALUES

-- 1. Vivienda
(
  'Los alquileres han subido un 40% en los últimos 3 años por el turismo. Los vecinos de toda la vida nos vemos obligados a irnos del barrio.',
  'Vivienda',
  'Participante 1',
  'approved', true,
  8.2, 6.5, 8.8, 7.1, 0, 3,
  '[
    {"title": "Regulación de pisos turísticos", "solution": "Limitar el número de licencias de alquiler turístico por barrio mediante cuotas por zona y densidad residencial.", "implementation_steps": ["Auditoría de licencias existentes", "Definir cuotas máximas por distrito", "Mecanismo de renovación anual con criterios de impacto"], "expected_impact_6m": "Reducción del 20% en nuevas licencias turísticas en zonas saturadas"},
    {"title": "Fondo de alquiler social", "solution": "Crear un fondo municipal financiado con tasas turísticas para subsidiar alquileres de residentes históricos.", "implementation_steps": ["Recaudar tasa de pernoctación turística", "Crear bolsa de vivienda protegida", "Criterios de acceso para residentes de largo plazo"], "expected_impact_6m": "200 familias acceden a alquiler asequible en 6 meses"},
    {"title": "Derecho de tanteo municipal", "solution": "El Ayuntamiento puede comprar pisos en venta antes que inversores turísticos en zonas declaradas de alta tensión.", "implementation_steps": ["Declarar zonas de alta tensión residencial", "Aprobar presupuesto específico", "Crear registro de ofertas de compraventa"], "expected_impact_6m": "50 viviendas rescatadas del mercado turístico"}
  ]'::jsonb,
  '{"feasibility": 6.5, "social_impact": 8.2, "inclusivity": 8.8, "sustainability": 7.1}'::jsonb,
  '[]'::jsonb
),

-- 2. Espacio público
(
  'Las plazas y calles del centro están colapsadas de turistas. No podemos sentarnos en nuestra propia plaza sin ser rodeados de grupos con guía.',
  'Espacio Público',
  'Participante 2',
  'approved', true,
  7.8, 7.2, 7.5, 8.0, 0, 3,
  '[
    {"title": "Zonificación de uso del espacio público", "solution": "Establecer franjas horarias y zonas de uso preferente para residentes en plazas y parques saturados.", "implementation_steps": ["Mapear puntos de saturación turística", "Definir horarios de uso preferente", "Señalización y mediación activa"], "expected_impact_6m": "Reducción del 30% de conflictos de uso en espacios públicos clave"},
    {"title": "Circuitos turísticos alternativos", "solution": "Diseñar rutas turísticas hacia barrios menos saturados con incentivos para operadores.", "implementation_steps": ["Identificar rutas alternativas con patrimonio local", "Acuerdos con agencias de turismo", "App de rutas alternativas con recompensas"], "expected_impact_6m": "Desvío del 15% del flujo turístico hacia zonas alternativas"},
    {"title": "Presupuesto participativo para espacio público", "solution": "Reservar parte del presupuesto de mantenimiento urbano a decisiones de vecinos sobre su espacio.", "implementation_steps": ["Plataforma digital de votación vecinal", "Procesos de co-diseño en plazas clave", "Seguimiento público de ejecución"], "expected_impact_6m": "3 plazas rediseñadas con participación vecinal"}
  ]'::jsonb,
  '{"feasibility": 7.2, "social_impact": 7.8, "inclusivity": 7.5, "sustainability": 8.0}'::jsonb,
  '[]'::jsonb
),

-- 3. Identidad
(
  'Estamos perdiendo el alma del barrio. Los comercios de proximidad cierran y abren tiendas de souvenirs. Ya no me reconozco en mi propio barrio.',
  'Identidad',
  'Participante 3',
  'approved', true,
  9.0, 6.0, 8.5, 7.8, 1, 3,
  '[
    {"title": "Protección del comercio de proximidad", "solution": "Declarar zonas de protección comercial donde se priorice el alquiler a comercio local frente a usos turísticos.", "implementation_steps": ["Inventario de locales comerciales por tipo de uso", "Regulación de cambios de actividad en zonas protegidas", "Subsidios de alquiler para comercio local"], "expected_impact_6m": "Freno al cierre de 40 comercios de proximidad en zonas declaradas"},
    {"title": "Archivo vivo del barrio", "solution": "Proyecto de memoria colectiva digital y física que documente la historia e identidad del barrio con participación vecinal.", "implementation_steps": ["Talleres de memoria con vecinos", "Plataforma digital de archivo participativo", "Instalaciones en espacio público con historia local"], "expected_impact_6m": "500 vecinos participan en la construcción del archivo"},
    {"title": "Fiestas y cultura como resistencia", "solution": "Fortalecer las fiestas populares y la cultura local con financiación pública como contrabalance a la monocultura turística.", "implementation_steps": ["Aumentar presupuesto de cultura de barrio", "Programación permanente de eventos locales", "Formación en oficios tradicionales"], "expected_impact_6m": "30% más de actividad cultural local en el barrio"}
  ]'::jsonb,
  '{"feasibility": 6.0, "social_impact": 9.0, "inclusivity": 8.5, "sustainability": 7.8}'::jsonb,
  '[{"issue": "Riesgo de gentrificación cultural si no se garantiza acceso universal", "severity": "low"}]'::jsonb
),

-- 4. Transporte
(
  'El metro y los buses van imposibles. En las líneas del centro ya no caben más personas. Es un problema de movilidad real para los que vivimos aquí.',
  'Transporte',
  'Participante 4',
  'approved', true,
  7.5, 8.0, 7.0, 8.5, 0, 3,
  '[
    {"title": "Tasas de congestión turística", "solution": "Cobrar una tasa por el uso de transporte público en zonas turísticas saturadas en horarios pico, con exención para residentes.", "implementation_steps": ["Sistema de identificación de residentes en apps de transporte", "Tarifa diferenciada por zonas y horarios", "Reinvertir recaudación en mejora de flota"], "expected_impact_6m": "Reducción del 15% de saturación en líneas turísticas en hora punta"},
    {"title": "Lanzaderas desde periferias turísticas", "solution": "Crear rutas exprés desde hubs periféricos (aeropuerto, estaciones) que eviten el paso por zonas residenciales.", "implementation_steps": ["Diseño de rutas directas a zonas turísticas", "Flota de autobuses dedicados", "Acuerdos con aeropuerto y RENFE"], "expected_impact_6m": "20% de turistas usan rutas periféricas en vez de metro central"},
    {"title": "Plataforma de movilidad compartida local", "solution": "App vecinal de movilidad compartida (bici, patinete, coche) con descuentos para residentes.", "implementation_steps": ["Concurso público para plataforma", "Integración con T-Mobilitat", "Puntos de carga e intercambio en barrios"], "expected_impact_6m": "5.000 viajes locales compartidos en 6 meses"}
  ]'::jsonb,
  '{"feasibility": 8.0, "social_impact": 7.5, "inclusivity": 7.0, "sustainability": 8.5}'::jsonb,
  '[]'::jsonb
),

-- 5. Derecho a la ciudad
(
  'Barcelona se está convirtiendo en un parque temático. Las políticas municipales priorizan al turista frente al residente. Necesitamos recuperar el derecho a la ciudad.',
  'Derecho a la Ciudad',
  'Participante 5',
  'pending', false,
  9.2, 5.5, 9.0, 8.0, 1, 3,
  '[
    {"title": "Carta de derechos del residente", "solution": "Aprobar una carta municipal que establezca los derechos de los residentes frente a los impactos del turismo masivo.", "implementation_steps": ["Proceso participativo de redacción", "Aprobación en pleno municipal", "Mecanismo de denuncia y seguimiento"], "expected_impact_6m": "Marco legal para 20 recursos vecinales contra impactos turísticos"},
    {"title": "Moratoria de nuevos hoteles", "solution": "Declarar una moratoria de 3 años para nuevas licencias hoteleras en zonas de alta saturación turística.", "implementation_steps": ["Definir mapa de zonas saturadas", "Aprobación normativa municipal", "Revisión anual con datos de impacto"], "expected_impact_6m": "0 nuevas licencias hoteleras en zonas saturadas"},
    {"title": "Observatorio ciudadano del turismo", "solution": "Crear un observatorio independiente con vecinos, academia y administración que monitorice el impacto turístico.", "implementation_steps": ["Constitución del observatorio con representación ciudadana", "Panel de indicadores públicos en tiempo real", "Informe anual vinculante para políticas municipales"], "expected_impact_6m": "Primer informe de impacto con 30 indicadores publicado"}
  ]'::jsonb,
  '{"feasibility": 5.5, "social_impact": 9.2, "inclusivity": 9.0, "sustainability": 8.0}'::jsonb,
  '[{"issue": "Posible conflicto con normativa estatal de libertad de empresa", "severity": "medium"}]'::jsonb
),

-- 6. Comercio local
(
  'Mi tienda lleva 25 años en el barrio y el propietario me dobló el alquiler porque quiere poner una tienda de souvenirs. El comercio local está desapareciendo.',
  'Comercio Local',
  'Participante 6',
  'approved', true,
  8.5, 7.0, 8.0, 7.5, 0, 3,
  '[
    {"title": "Registro de locales en riesgo", "solution": "Crear un registro municipal de locales comerciales tradicionales en riesgo de cierre por presión turística.", "implementation_steps": ["Formulario de autoregistro para comerciantes", "Verificación y categorización por riesgo", "Intervención prioritaria en casos urgentes"], "expected_impact_6m": "100 locales registrados y protegidos en fase piloto"},
    {"title": "Mercado local permanente", "solution": "Establecer mercados locales permanentes en zonas turísticas que prioricen productos y artesanía local.", "implementation_steps": ["Identificar espacios municipales disponibles", "Convocatoria para comerciantes locales", "Gestión vecinal del mercado"], "expected_impact_6m": "2 mercados locales operativos con 50 comerciantes"},
    {"title": "Sello Comerç de Barri", "solution": "Certificación municipal para comercios tradicionales que incluya visibilidad en apps turísticas y descuentos fiscales.", "implementation_steps": ["Definir criterios de certificación", "Plataforma digital de visibilidad", "Beneficios fiscales aprobados en presupuesto"], "expected_impact_6m": "200 comercios certificados con visibilidad aumentada un 40%"}
  ]'::jsonb,
  '{"feasibility": 7.0, "social_impact": 8.5, "inclusivity": 8.0, "sustainability": 7.5}'::jsonb,
  '[]'::jsonb
),

-- 7. Ruido
(
  'No puedo dormir. Los grupos de turistas hacen ruido hasta las 4 de la mañana. El ocio nocturno turístico arruina la convivencia vecinal.',
  'Ruido',
  'Participante 7',
  'approved', true,
  7.0, 8.5, 6.5, 7.0, 0, 3,
  '[
    {"title": "Zonas de silencio nocturno", "solution": "Establecer zonas de silencio nocturno (22h-8h) en áreas residenciales con alta actividad turística nocturna.", "implementation_steps": ["Mapear zonas de alta contaminación acústica", "Ordenanza de silencio con sanciones", "Sistema de denuncia ciudadana por app"], "expected_impact_6m": "40% reducción de quejas por ruido nocturno"},
    {"title": "Mediación vecino-turista", "solution": "Programa de mediación comunitaria para gestionar conflictos de convivencia entre residentes y turistas.", "implementation_steps": ["Equipo de mediadores formados", "Protocolo de intervención rápida", "Puntos de atención en zonas conflictivas"], "expected_impact_6m": "300 conflictos mediados satisfactoriamente"},
    {"title": "Reubicación del ocio nocturno", "solution": "Incentivar el traslado de locales de ocio nocturno a polígonos de entretenimiento fuera de zonas residenciales.", "implementation_steps": ["Identificar zonas alternativas aptas", "Incentivos fiscales para traslado", "Moratoria de nuevas licencias en zonas residenciales"], "expected_impact_6m": "10 locales trasladados a zonas alternativas"}
  ]'::jsonb,
  '{"feasibility": 8.5, "social_impact": 7.0, "inclusivity": 6.5, "sustainability": 7.0}'::jsonb,
  '[]'::jsonb
),

-- 8. Limpieza
(
  'La cantidad de residuos que generan los turistas es brutal. Las calles del centro están sucias y hay falta de contenedores. Es un problema ambiental serio.',
  'Limpieza',
  'Participante 8',
  'pending', false,
  6.5, 8.8, 6.0, 9.0, 0, 3,
  '[
    {"title": "Tasa ambiental turística", "solution": "Crear una tasa ambiental por pernoctación turística destinada íntegramente a limpieza y gestión de residuos.", "implementation_steps": ["Cálculo de coste ambiental por turista", "Aprobación de tasa en ordenanza fiscal", "Fondo específico de gestión ambiental"], "expected_impact_6m": "Recaudación de 2M€ para limpieza en zonas saturadas"},
    {"title": "Puntos limpios móviles", "solution": "Desplegar puntos limpios móviles en zonas turísticas durante temporada alta para gestión de residuos especiales.", "implementation_steps": ["Adquirir 10 unidades móviles", "Calendario de despliegue por zonas y temporadas", "Campaña de sensibilización turística"], "expected_impact_6m": "30% reducción de residuos especiales en espacio público"},
    {"title": "App de reporte ciudadano", "solution": "App para que vecinos reporten incidencias de suciedad con geolocalización y seguimiento de resolución.", "implementation_steps": ["Desarrollo de app o integración en app municipal", "Protocolo de respuesta en menos de 24h", "Panel público de incidencias resueltas"], "expected_impact_6m": "1.000 incidencias reportadas y resueltas en 3 meses"}
  ]'::jsonb,
  '{"feasibility": 8.8, "social_impact": 6.5, "inclusivity": 6.0, "sustainability": 9.0}'::jsonb,
  '[]'::jsonb
),

-- 9. Recursos
(
  'El gasto de agua y energía de los hoteles es desproporcionado. En verano hay restricciones para residentes mientras los hoteles tienen piscinas llenas.',
  'Recursos',
  'Participante 9',
  'approved', true,
  7.2, 7.8, 7.0, 9.5, 0, 3,
  '[
    {"title": "Auditoría de consumo hotelero", "solution": "Obligar a hoteles a publicar datos de consumo de agua y energía y establecer límites máximos por plaza.", "implementation_steps": ["Ordenanza de transparencia de consumo", "Registro público de datos", "Sanciones por consumo excesivo"], "expected_impact_6m": "30% reducción del consumo de agua en sector hotelero"},
    {"title": "Energía renovable obligatoria", "solution": "Exigir a nuevos establecimientos turísticos que el 50% de su energía provenga de fuentes renovables.", "implementation_steps": ["Actualizar normativa de licencias", "Incentivos para renovación de instalaciones", "Certificación energética turística"], "expected_impact_6m": "20 establecimientos con energía 100% renovable"},
    {"title": "Tarificación progresiva del agua", "solution": "Aplicar tarifas progresivas de agua que penalicen el consumo excesivo típico de establecimientos turísticos.", "implementation_steps": ["Revisión de tarifas con criterio de sostenibilidad", "Exención para consumo doméstico básico", "Recaudación para infraestructura hídrica"], "expected_impact_6m": "15% reducción del consumo total de agua en zonas turísticas"}
  ]'::jsonb,
  '{"feasibility": 7.8, "social_impact": 7.2, "inclusivity": 7.0, "sustainability": 9.5}'::jsonb,
  '[]'::jsonb
),

-- 10. Trabajo precario
(
  'Los empleos que genera el turismo son precarios, temporales y mal pagados. Necesitamos turismo que genere trabajo digno, no solo camareros de temporada.',
  'Trabajo',
  'Participante 10',
  'pending', false,
  8.0, 6.8, 8.5, 7.2, 1, 3,
  '[
    {"title": "Sello de turismo justo", "solution": "Certificación para establecimientos turísticos que garanticen condiciones laborales dignas: contratos indefinidos, salario justo, horarios razonables.", "implementation_steps": ["Definir estándares mínimos con sindicatos", "Sistema de auditoría independiente", "Visibilidad en plataformas de reservas"], "expected_impact_6m": "50 establecimientos certificados como turismo justo"},
    {"title": "Formación profesional local", "solution": "Programa de formación en hostelería y turismo para residentes del barrio con garantía de inserción laboral.", "implementation_steps": ["Acuerdos con gremios hosteleros", "Cupos de formación en escuelas locales", "Bolsa de trabajo con empresas comprometidas"], "expected_impact_6m": "200 personas formadas con 70% de inserción laboral"},
    {"title": "Cooperativas de servicios turísticos", "solution": "Apoyar la creación de cooperativas de trabajadores que ofrezcan servicios turísticos con mejores condiciones laborales.", "implementation_steps": ["Programa de apoyo a creación de cooperativas", "Acceso preferente a licencias turísticas", "Red de cooperativas de turismo local"], "expected_impact_6m": "5 cooperativas creadas con 100 socios trabajadores"}
  ]'::jsonb,
  '{"feasibility": 6.8, "social_impact": 8.0, "inclusivity": 8.5, "sustainability": 7.2}'::jsonb,
  '[{"issue": "Resistencia de grandes operadores turísticos al modelo cooperativo", "severity": "low"}]'::jsonb
);
