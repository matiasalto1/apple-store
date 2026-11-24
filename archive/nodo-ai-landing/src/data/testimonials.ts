/**
 * Testimonials data model.
 *
 * Today every entry is `kind: 'illustrative'` — a demonstrative scenario,
 * NOT a real customer. When real clients arrive, add entries with
 * `kind: 'real'` and fill `author` (name, photo, company, logo). The
 * component switches automatically: badges/disclaimers disappear and the
 * real identity is shown.
 */
export interface TestimonialAuthor {
  /** Real full name (only for kind: 'real') */
  name?: string
  role: string
  company?: string
  /** Path to a real photo, e.g. /testimonials/ana.jpg */
  photo?: string
  /** Path to the company logo (SVG preferred) */
  logo?: string
}

export interface Testimonial {
  id: string
  kind: 'illustrative' | 'real'
  quote: string
  /** 1–5. For illustrative entries it is shown as part of the demo design */
  rating?: number
  author: TestimonialAuthor
  /** Optional context line, e.g. "Implementación de agentes de atención" */
  context?: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ops',
    kind: 'illustrative',
    rating: 5,
    quote:
      'Lo que antes requería horas de trabajo ahora puede convertirse en un proceso automático que funciona en segundo plano.',
    author: { role: 'Directora de Operaciones' },
    context: 'Escenario: automatización de procesos operativos',
  },
  {
    id: 'ceo',
    kind: 'illustrative',
    rating: 5,
    quote: 'La verdadera transformación no está en usar IA, sino en integrarla correctamente a la operación.',
    author: { role: 'CEO — escenario demostrativo' },
    context: 'Escenario: estrategia de adopción de IA',
  },
  {
    id: 'sales',
    kind: 'illustrative',
    rating: 5,
    quote: 'Pasamos de tener información dispersa a contar con un sistema capaz de ayudarnos a tomar decisiones.',
    author: { role: 'Director Comercial — escenario demostrativo' },
    context: 'Escenario: data intelligence comercial',
  },
]
