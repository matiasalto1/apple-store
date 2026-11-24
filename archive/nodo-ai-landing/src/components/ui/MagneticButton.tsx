import { useRef, type ReactNode, type PointerEvent } from 'react'
import { gsap } from '@/lib/gsap'

type Variant = 'primary' | 'ghost' | 'quiet'

interface Props {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'lg'
  className?: string
  strength?: number
  'aria-label'?: string
}

const base =
  'group spotlight relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] ' +
  'transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ' +
  'active:scale-[0.97] active:duration-100'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_10px_40px_-12px_rgb(255_148_71/0.0)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_14px_50px_-14px_rgb(255_148_71/0.55)]',
  ghost: 'border border-white/12 text-fg hover:border-white/25 hover:bg-white/[0.04]',
  quiet: 'text-fg-soft hover:text-fg',
}

const sizes = { md: 'h-10 px-5 text-[0.875rem]', lg: 'h-13 px-7 text-[0.95rem]' }

/**
 * Button that leans slightly toward the cursor and carries a soft
 * pointer-following light. Degrades to a plain link on touch / reduced motion.
 */
export function MagneticButton({ href, onClick, children, variant = 'primary', size = 'md', className = '', strength = 0.28, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  const canMagnet = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches

  const onMove = (e: PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (!canMagnet()) return
    const dx = x - r.width / 2
    const dy = y - r.height / 2
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.6, ease: 'power3.out' })
    gsap.to(inner.current, { x: dx * strength * 0.35, y: dy * strength * 0.35, duration: 0.6, ease: 'power3.out' })
  }
  const onLeave = () => {
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' })
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <span ref={inner} className="relative inline-flex items-center gap-2">
      {children}
    </span>
  )

  if (href) {
    return (
      <a ref={ref} href={href} onClick={onClick} className={cls} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="hover" aria-label={rest['aria-label']}>
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" onClick={onClick} className={cls} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="hover" aria-label={rest['aria-label']}>
      {content}
    </button>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[3px] ${className}`}
    >
      →
    </span>
  )
}
