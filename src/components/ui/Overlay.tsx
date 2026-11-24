'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useEscape, useScrollLock } from '@/lib/hooks'
import { cn } from '@/lib/format'

/**
 * Contenedor accesible para drawers y modales: bloquea scroll, cierra con Esc,
 * mueve el foco adentro y lo devuelve al cerrar.
 */
export function Overlay({
  open,
  onClose,
  label,
  side = 'right',
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  side?: 'right' | 'left' | 'center' | 'top'
  className?: string
  children: React.ReactNode
}) {
  useScrollLock(open)
  useEscape(open, onClose)
  const panel = useRef<HTMLDivElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      returnTo.current = document.activeElement as HTMLElement
      const t = window.setTimeout(() => {
        const focusable = panel.current?.querySelector<HTMLElement>('[data-autofocus], input, button, a[href]')
        focusable?.focus({ preventScroll: true })
      }, 60)
      return () => window.clearTimeout(t)
    }
    returnTo.current?.focus?.({ preventScroll: true })
  }, [open])

  // trampa de foco simple
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panel.current) return
    const items = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const variants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
    center: { initial: { opacity: 0, y: 40, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 30, scale: 0.98 } },
  }[side]

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn('fixed inset-0 z-[80]', side === 'center' && 'flex items-end justify-center md:items-center md:p-6')}
          role="presentation"
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent=""
            className={cn(
              'absolute bg-paper shadow-2xl',
              side === 'right' && 'inset-y-0 right-0 flex w-full max-w-[30rem] flex-col',
              side === 'left' && 'inset-y-0 left-0 flex w-full max-w-md flex-col',
              side === 'top' && 'inset-x-0 top-0 max-h-[100dvh] overflow-y-auto',
              side === 'center' &&
                'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] md:max-h-[88vh] md:w-[min(64rem,92vw)] md:rounded-[2rem]',
              className,
            )}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
