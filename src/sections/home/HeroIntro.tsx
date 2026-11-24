'use client'

import { animate, stagger } from 'motion'
import { useEffect, useRef } from 'react'

/**
 * Animación de entrada del hero. El contenido es visible sin JS
 * (SSR); la animación solo se aplica si el usuario acepta movimiento.
 */
export function HeroIntro({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lines = root.querySelectorAll<HTMLElement>('[data-intro-line] > span')
    const items = root.querySelectorAll<HTMLElement>('[data-intro]')
    const a = animate(lines, { y: ['108%', '0%'] }, { duration: 1.2, delay: stagger(0.1, { startDelay: 0.1 }), ease: [0.16, 1, 0.3, 1] })
    const b = animate(
      items,
      { opacity: [0, 1], y: [18, 0], filter: ['blur(6px)', 'blur(0px)'] },
      { duration: 1, delay: stagger(0.08, { startDelay: 0.45 }), ease: [0.16, 1, 0.3, 1] },
    )
    // los estilos iniciales vienen de .js-intro; se retiran cuando la animación ya los controla
    document.documentElement.classList.remove('js-intro')
    return () => {
      a.stop()
      b.stop()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
