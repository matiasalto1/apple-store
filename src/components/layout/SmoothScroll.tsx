'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useUI } from '@/lib/ui-store'

/**
 * Smooth scrolling con Lenis, solo en desktop con mouse y sin reduced-motion.
 * En touch se deja el scroll nativo (mejor en iOS).
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()
  const locked = useUI((s) => s.cartOpen || s.menuOpen || s.searchOpen || Boolean(s.quickViewId))

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    const l = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true })
    lenis.current = l
    let raf = 0
    const loop = (time: number) => {
      l.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenis.current = null
    }
  }, [])

  useEffect(() => {
    if (locked) lenis.current?.stop()
    else lenis.current?.start()
  }, [locked])

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
