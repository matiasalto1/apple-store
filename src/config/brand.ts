/**
 * ─────────────────────────────────────────────────────────────
 *  BRANDING — un solo lugar para reemplazar la identidad.
 * ─────────────────────────────────────────────────────────────
 *  `name` es un NOMBRE PROVISORIO de trabajo. Cambialo acá y se
 *  actualiza en el header, footer, metadata, SEO, WhatsApp y OG.
 *
 *  Colores: la paleta completa vive en `src/app/globals.css`
 *  (bloque @theme). Este archivo solo guarda los valores que
 *  necesitan código JS (3D, Open Graph, theme-color).
 */
export const brand = {
  name: 'Cuna',
  /** Se muestra junto al logo en pantallas grandes y en metadata. */
  descriptor: 'Pañalera',
  tagline: 'Cuidado diario, elegido con calma.',
  /** Dominio de producción, sin barra final. Reemplazar antes de publicar. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tu-dominio.com.ar',
  locale: 'es-AR',
  currency: 'ARS',
  /** true mientras el nombre / logo sean provisorios (agrega aviso en README, no en la web). */
  provisional: true,
  colors: {
    ivory: '#f7f2ea',
    sand: '#ece3d4',
    beige: '#dccdb6',
    stone: '#8b857b',
    ink: '#1e1c1a',
    accent: '#3f5d4f',
    accentSoft: '#dfe7df',
  },
} as const

export type Brand = typeof brand
