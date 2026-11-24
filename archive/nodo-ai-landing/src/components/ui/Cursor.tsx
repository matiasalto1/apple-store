import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'

/**
 * Minimal custom cursor (desktop only): a dot + a lagging ring.
 * - [data-cursor="hover"] / links / buttons → ring grows slightly
 * - [data-cursor="explore"] → ring shows a tiny "Explorar" hint
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const d = dot.current!
    const r = ring.current!
    const xDot = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' })
    const yDot = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' })
    const xRing = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3.out' })
    const yRing = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3.out' })
    let state = ''

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
      const t = e.target as Element | null
      const explore = t?.closest?.('[data-cursor="explore"]')
      const hover = t?.closest?.('a, button, [role="tab"], [data-cursor="hover"], input, textarea, select, label')
      const next = hover ? 'hover' : explore ? 'explore' : ''
      if (next !== state) {
        state = next
        r.dataset.state = next
        d.dataset.state = next
      }
      r.style.opacity = d.style.opacity = '1'
    }
    const onLeave = () => {
      r.style.opacity = d.style.opacity = '0'
    }
    const onDown = () => r.classList.add('is-down')
    const onUp = () => r.classList.remove('is-down')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span className="cursor-ring__label">Explorar</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
