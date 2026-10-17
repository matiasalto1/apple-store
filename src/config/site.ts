/**
 * Global brand + contact configuration.
 * Replace the placeholders below before going live.
 */
export const site = {
  name: 'Nodo',
  tagline: 'Inteligencia artificial aplicada a negocios reales.',
  /** Todo enlace a este ancla abre el formulario de contacto (components/ui/ContactDialog) */
  contactHref: '#consulta',
  /** WhatsApp que recibe las consultas, en formato internacional sin + (54 9 + área + número) */
  whatsapp: '5491158230055',
  /**
   * Opcional: mail que recibe una copia de cada consulta vía FormSubmit.
   * La primera consulta dispara un mail de activación que hay que confirmar.
   */
  contactEmail: '',
  /**
   * Quién está detrás de Nodo. Es lo primero que un decisor va a querer
   * verificar. La tarjeta solo se muestra cuando `name` y `linkedin` están
   * completos. Foto: archivo en /public, por ejemplo '/equipo/matias.jpg'.
   */
  founder: {
    name: '',
    role: 'Fundador',
    photo: '',
    linkedin: '',
    bio: '',
  },
  /**
   * Programa de primeros clientes. Se muestra mientras no haya testimonios
   * reales cargados en data/testimonials.ts. Ajustar cupos y condiciones.
   */
  pilot: {
    slots: 3,
    perks: [
      'Diagnóstico sin costo de un proceso concreto de tu empresa.',
      'Un solo proyecto, con una métrica acordada y medida contra tu línea base.',
      'Condiciones preferenciales para los primeros clientes.',
      'Si el resultado lo merece, contamos el caso con tu nombre, y solo con tu autorización por escrito.',
    ],
  },
  nav: [
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Casos', href: '#casos' },
    { label: 'Nosotros', href: '#nosotros' },
  ],
  footerNav: [
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Casos', href: '#casos' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ],
} as const
