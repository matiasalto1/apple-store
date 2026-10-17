/**
 * Testimonios reales y verificables.
 *
 * Solo se cargan clientes reales, con autorización por escrito para usar su
 * nombre, cargo, foto y cita. Cada entrada debe poder verificarse desde la
 * página: perfil de LinkedIn de la persona y sitio de la empresa.
 *
 * Mientras la lista esté vacía, la sección muestra el programa de primeros
 * clientes (config/site.ts → pilot) en lugar de testimonios.
 */
export interface TestimonialAuthor {
  /** Nombre y apellido reales */
  name: string
  role: string
  company: string
  /** Foto entregada por la persona, por ejemplo /testimonios/ana.jpg */
  photo?: string
  /** Logo de la empresa (SVG preferido), con permiso de uso */
  logo?: string
  /** Perfil público de la persona, para que un decisor pueda contactarla */
  linkedin: string
  /** Sitio de la empresa */
  companyUrl?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: TestimonialAuthor
  /** Qué se hizo, por ejemplo "Agente de toma de pedidos por WhatsApp" */
  project: string
  /** Resultado medido y confirmado por el cliente, por ejemplo "-70% de pedidos cargados a mano en 8 semanas" */
  result?: string
  /** La persona aceptó atender una llamada de referencia */
  referenceCall?: boolean
  /** Fecha de la autorización firmada (registro interno, no se muestra) */
  consentDate: string
}

export const TESTIMONIALS: Testimonial[] = []
