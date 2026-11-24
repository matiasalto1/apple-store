/**
 * The eight business modules orbiting the AI core.
 * `solution` links a module to the solution it "becomes" during scroll.
 */
export interface SystemModule {
  id: string
  label: string
  status: string
  solution?: 'automation' | 'agents' | 'data' | 'integrations'
}

export const MODULES: SystemModule[] = [
  { id: 'crm', label: 'CRM', status: 'CRM conectado', solution: 'integrations' },
  { id: 'ventas', label: 'Ventas', status: 'Automatización ejecutándose', solution: 'automation' },
  { id: 'clientes', label: 'Clientes', status: 'Agente activo' , solution: 'agents' },
  { id: 'datos', label: 'Datos', status: 'Análisis completado', solution: 'data' },
  { id: 'operaciones', label: 'Operaciones', status: 'Flujo sincronizado' },
  { id: 'finanzas', label: 'Finanzas', status: 'Conciliación en curso' },
  { id: 'marketing', label: 'Marketing', status: 'Segmentos actualizados' },
  { id: 'logistica', label: 'Logística', status: 'Rutas optimizadas' },
]

export const moduleIndexFor = (solution: SystemModule['solution']) =>
  MODULES.findIndex((m) => m.solution === solution)
