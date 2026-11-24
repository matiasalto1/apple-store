import localFont from 'next/font/local'

/** Display editorial — Fraunces con eje SOFT (curvas suaves, cálidas). */
export const fraunces = localFont({
  src: [
    { path: '../fonts/fraunces-latin-soft-normal.woff2', style: 'normal', weight: '300 800' },
    { path: '../fonts/fraunces-latin-soft-italic.woff2', style: 'italic', weight: '300 800' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

/** UI / texto — Instrument Sans variable. */
export const instrument = localFont({
  src: [{ path: '../fonts/instrument-sans-latin-wght-normal.woff2', style: 'normal', weight: '400 700' }],
  variable: '--font-instrument',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})
