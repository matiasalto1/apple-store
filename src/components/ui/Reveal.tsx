'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number; as?: 'div' | 'li' | 'section' }

/** Aparición suave al entrar en viewport. Sin animación con prefers-reduced-motion. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  const reduce = useReducedMotion()
  if (reduce) return <motion.div {...rest}>{children}</motion.div>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Título que se revela línea por línea con máscara. */
export function RevealLines({ lines, className, delay = 0 }: { lines: React.ReactNode[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          {reduce ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1.1, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  )
}
