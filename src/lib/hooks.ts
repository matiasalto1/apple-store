'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

/** true después del primer render en el cliente (evita diferencias de hidratación con localStorage). */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Bloquea el scroll del body mientras un overlay está abierto. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    document.documentElement.dataset.locked = 'true'
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      delete document.documentElement.dataset.locked
    }
  }, [locked])
}

/** Cierra con Escape. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onEscape()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active, onEscape])
}
