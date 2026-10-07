/**
 * Illustrative impact scenarios. These are NOT customer results:
 * every metric is rendered with an explicit "illustrative" tag.
 */
export interface ImpactMetric {
  key: string
  direction: 'up' | 'down'
  label: string
  /** example value used only to draw the scenario */
  example: number
  unit: string
  note: string
  /** relative bar lengths before / after (0–1) */
  before: number
  after: number
}

export const IMPACT: ImpactMetric[] = [
  { key: 'tareas', direction: 'down', label: 'Tareas repetitivas', example: 60, unit: '%', note: 'Trabajo operativo que puede delegarse a flujos automáticos.', before: 1, after: 0.4 },
  { key: 'respuesta', direction: 'up', label: 'Velocidad de respuesta', example: 10, unit: '×', note: 'Consultas atendidas en segundos en lugar de horas.', before: 0.1, after: 1 },
  { key: 'capacidad', direction: 'up', label: 'Capacidad operativa', example: 2, unit: '×', note: 'Más volumen con el mismo equipo.', before: 0.5, after: 1 },
  { key: 'errores', direction: 'down', label: 'Errores manuales', example: 80, unit: '%', note: 'Menos re-trabajo por datos mal copiados.', before: 1, after: 0.2 },
  { key: 'info', direction: 'up', label: 'Disponibilidad de información', example: 24, unit: '/7', note: 'Datos unificados y accesibles cuando se necesitan.', before: 0.35, after: 1 },
  { key: 'admin', direction: 'down', label: 'Tiempo administrativo', example: 45, unit: '%', note: 'Horas devueltas a trabajo de mayor valor.', before: 1, after: 0.55 },
]
