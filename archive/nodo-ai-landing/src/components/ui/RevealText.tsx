import { useRef, type ReactNode } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'p'
  children: ReactNode
  className?: string
  /** Delay after entering the viewport */
  delay?: number
  /** Start position for ScrollTrigger */
  start?: string
  id?: string
}

/**
 * Headline that reveals line by line through a mask as it enters the viewport.
 * Lines are re-split on resize (SplitText autoSplit).
 */
export function RevealText({ as = 'h2', children, className = '', delay = 0, start = 'top 82%', id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const Tag = as as 'h2'

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const el = ref.current
        if (!el) return
        let tween: gsap.core.Tween | undefined
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'reveal-line',
          autoSplit: true,
          onSplit(self) {
            tween?.kill()
            tween = gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.25,
              stagger: 0.09,
              delay,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start, once: true },
            })
            return tween
          },
        })
        return () => {
          split.revert()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  )
}
