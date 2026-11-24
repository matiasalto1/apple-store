import type { SystemModule } from './modules'

export interface Solution {
  key: NonNullable<SystemModule['solution']>
  index: string
  title: string
  summary: string
  description: string
  capabilities: string[]
}

export const SOLUTIONS: Solution[] = [
  {
    key: 'automation',
    index: '01',
    title: 'Automatización inteligente',
    summary: 'Flujos que piensan antes de ejecutar.',
    description:
      'Procesos que hoy dependen de personas copiando datos entre herramientas pasan a ejecutarse solos, con validaciones, excepciones y trazabilidad completa.',
    capabilities: ['Flujos multi-sistema', 'Validación con IA', 'Gestión de excepciones', 'Trazabilidad'],
  },
  {
    key: 'agents',
    index: '02',
    title: 'Agentes de IA',
    summary: 'Agentes que entienden, consultan y actúan.',
    description:
      'Agentes conectados a tus sistemas que atienden consultas, toman decisiones dentro de reglas claras y escalan a una persona cuando corresponde.',
    capabilities: ['Atención 24/7', 'Acceso a sistemas internos', 'Reglas y límites definidos', 'Escalado humano'],
  },
  {
    key: 'data',
    index: '03',
    title: 'Data & Intelligence',
    summary: 'De datos dispersos a decisiones informadas.',
    description:
      'Unificamos tus fuentes de información y construimos modelos que detectan patrones, anticipan escenarios y sugieren la siguiente mejor acción.',
    capabilities: ['Unificación de fuentes', 'Modelos predictivos', 'Alertas inteligentes', 'Consultas en lenguaje natural'],
  },
  {
    key: 'integrations',
    index: '04',
    title: 'Integraciones',
    summary: 'Tu stack actual, ahora conectado.',
    description:
      'Conectamos CRM, ERP, canales de mensajería y herramientas internas para que la información circule sin intervención manual y la IA tenga contexto real.',
    capabilities: ['APIs y webhooks', 'Sincronización bidireccional', 'Sistemas legados', 'Monitoreo continuo'],
  },
]
