export interface UseCase {
  key: string
  label: string
  before: string
  after: string
  flow: string[]
  capabilities: string[]
}

export const USE_CASES: UseCase[] = [
  {
    key: 'ventas',
    label: 'Ventas',
    before: 'El equipo responde manualmente cada consulta y actualiza el CRM cuando puede.',
    after: 'Un agente de IA califica oportunidades, responde preguntas y actualiza el CRM en tiempo real.',
    flow: ['Consulta entrante', 'Calificación', 'Propuesta', 'CRM actualizado'],
    capabilities: ['Calificación de leads', 'Propuestas automáticas', 'Seguimiento programado'],
  },
  {
    key: 'atencion',
    label: 'Atención',
    before: 'Tickets que se acumulan, respuestas repetidas y clientes esperando fuera de horario.',
    after: 'Agentes que resuelven consultas frecuentes 24/7 y escalan a una persona con todo el contexto.',
    flow: ['Mensaje', 'Intención', 'Resolución', 'Escalado si hace falta'],
    capabilities: ['Atención multicanal', 'Base de conocimiento viva', 'Escalado inteligente'],
  },
  {
    key: 'operaciones',
    label: 'Operaciones',
    before: 'Procesos que dependen de planillas, correos y de que alguien recuerde el siguiente paso.',
    after: 'Flujos automatizados que validan, ejecutan y registran cada paso, con alertas ante excepciones.',
    flow: ['Evento', 'Validación', 'Ejecución', 'Registro'],
    capabilities: ['Orquestación de procesos', 'Gestión de excepciones', 'Trazabilidad completa'],
  },
  {
    key: 'finanzas',
    label: 'Finanzas',
    before: 'Conciliaciones manuales, documentos que se cargan a mano y cierres que demoran días.',
    after: 'Extracción automática de documentos, conciliación asistida y alertas sobre desvíos.',
    flow: ['Documento', 'Extracción', 'Conciliación', 'Alerta'],
    capabilities: ['Lectura de facturas', 'Conciliación asistida', 'Detección de anomalías'],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    before: 'Segmentos estáticos, campañas genéricas y reportes que llegan tarde.',
    after: 'Segmentación dinámica basada en comportamiento y contenido adaptado a cada audiencia.',
    flow: ['Datos de clientes', 'Segmentación', 'Contenido', 'Medición'],
    capabilities: ['Segmentos dinámicos', 'Contenido asistido', 'Análisis de campañas'],
  },
  {
    key: 'logistica',
    label: 'Logística',
    before: 'Seguimiento de envíos por teléfono y decisiones reactivas ante cada demora.',
    after: 'Monitoreo continuo, previsión de demoras y reasignación sugerida antes de que el cliente lo note.',
    flow: ['Pedido', 'Planificación', 'Monitoreo', 'Ajuste'],
    capabilities: ['Previsión de demanda', 'Alertas de demora', 'Optimización de rutas'],
  },
]
