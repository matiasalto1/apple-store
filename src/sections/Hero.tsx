import { useEffect, useRef, useState } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'
import { Arrow, MagneticButton } from '@/components/ui/MagneticButton'
import { SYSTEM_EVENTS } from '@/data/hero'
import { onSystemReady, systemState } from '@/three/systemStore'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

const fmt = (d: Date) => d.toLocaleTimeString('es-ES', { hour12: false })

/** Rolling, clearly-simulated event log — the system "breathing". */
function EventTicker() {
  const now = useClock()
  const [cursor, setCursor] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setCursor((c) => c + 1), 2200)
    return () => window.clearInterval(t)
  }, [])
  const rows = [0, 1, 2].map((k) => {
    const i = (cursor + k) % SYSTEM_EVENTS.length
    return { key: cursor + k, ...SYSTEM_EVENTS[i], time: new Date(now.getTime() - (2 - k) * 2200) }
  })
  return (
    <div className="w-[300px]" aria-hidden="true">
      <div className="label-mono mb-3 flex items-center justify-between text-dim">
        <span className="flex items-center gap-2">
          <span className="anim-blink h-1.5 w-1.5 rounded-full bg-signal" /> Actividad del sistema
        </span>
        <span>Simulación</span>
      </div>
      <ul className="space-y-1.5 font-mono text-[11px] leading-snug">
        {rows.map((r, k) => (
          <li
            key={r.key}
            className="flex gap-3 transition-opacity duration-700"
            style={{ opacity: k === 2 ? 1 : k === 1 ? 0.55 : 0.28, animation: k === 2 ? 'ticker-in .7s var(--ease-out-expo)' : undefined }}
          >
            <span className="text-dim">{fmt(r.time)}</span>
            <span className="truncate">
              <span className="text-signal-soft">{r.src}</span> <span className="text-mute">→ {r.msg}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.reduced, () => {
        systemState.boot = 1
        document.documentElement.classList.remove('js-boot')
      })

      mm.add(MQ.motion, () => {
        const split = SplitText.create(title.current!, { type: 'lines', mask: 'lines', linesClass: 'reveal-line' })
        const tl = gsap.timeline({ paused: true })

        // 1–5: the system powers on (core → nodes → connections)
        tl.to(systemState, { boot: 1, duration: 3.2, ease: 'power2.inOut' }, 0)
        // 6: headline through a mask
        tl.set('[data-boot]', { visibility: 'visible' }, 0)
        tl.from(split.lines, { yPercent: 115, duration: 1.4, stagger: 0.1, ease: 'expo.out' }, 1.35)
        tl.from('[data-boot="meta"]', { autoAlpha: 0, y: 8, duration: 1, stagger: 0.08 }, 1.2)
        // 7: subtitle
        tl.from('[data-boot="sub"]', { autoAlpha: 0, y: 18, filter: 'blur(6px)', duration: 1.3 }, 1.95)
        // 8: CTAs
        tl.from('[data-boot="cta"] > *', { autoAlpha: 0, y: 14, duration: 1.1, stagger: 0.09 }, 2.25)
        tl.from('[data-boot="foot"]', { autoAlpha: 0, duration: 1.4 }, 2.6)

        let started = false
        const start = () => {
          if (started) return
          started = true
          document.documentElement.classList.remove('js-boot')
          tl.play()
        }
        const off = onSystemReady(start)
        // never block content if WebGL is slow or unavailable
        const fallback = window.setTimeout(start, 2200)

        // leaving the hero: content drifts up and dissolves
        gsap.to('[data-hero-content]', {
          yPercent: -18,
          autoAlpha: 0,
          filter: 'blur(4px)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 35%', scrub: true },
        })

        return () => {
          off()
          window.clearTimeout(fallback)
          split.revert()
          document.documentElement.classList.remove('js-boot')
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="top"
      data-scene="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16 md:pt-[72px]"
      aria-labelledby="hero-title"
    >
      {/* atmospheric light behind the core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 68% 45%, rgb(255 148 71 / 0.07), transparent 70%), radial-gradient(40% 40% at 70% 50%, rgb(168 212 255 / 0.035), transparent 70%)',
        }}
      />

      {/* The area the 3D system docks into */}
      <div
        data-system-anchor="hero"
        data-cursor="explore"
        aria-hidden="true"
        className="absolute inset-x-0 top-16 h-[46svh] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:w-[64%]"
      />

      <div data-hero-content className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[44svh] lg:justify-center lg:pb-0 lg:pt-0">
        <div className="max-w-[46rem] lg:max-w-[50%]">
          <p data-boot="meta" className="label-mono mb-7 flex items-center gap-3 text-mute">
            <span className="relative flex h-2 w-2">
              <span className="anim-blink absolute inset-0 rounded-full bg-signal" />
            </span>
            Sistemas de IA a medida
          </p>

          <h1
            ref={title}
            id="hero-title"
            data-boot
            className="text-display max-w-[14ch] font-medium text-fg"
          >
            Convertimos procesos complejos en sistemas <span className="text-signal-soft">inteligentes.</span>
          </h1>

          <p data-boot="sub" className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-mute md:text-[1.15rem]">
            Diseñamos e implementamos soluciones de IA que automatizan operaciones, optimizan decisiones y crean nuevas
            oportunidades de crecimiento.
          </p>

          <div data-boot="cta" className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton href="#soluciones" size="lg">
              Descubrir soluciones <Arrow />
            </MagneticButton>
            <MagneticButton href="#demo" size="lg" variant="ghost">
              <PlayGlyph /> Ver cómo funciona
            </MagneticButton>
          </div>
        </div>
      </div>

      <div data-boot="foot" className="container-x relative hidden items-end justify-between pb-8 lg:flex">
        <a href="#problema" className="group label-mono flex items-center gap-3 text-dim transition-colors hover:text-fg">
          <span className="relative block h-9 w-px overflow-hidden bg-white/10">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-signal" />
          </span>
          Desplazar para recorrer el sistema
        </a>
        <EventTicker />
      </div>
    </section>
  )
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="opacity-80">
      <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeOpacity=".5" />
      <path d="M6.5 5.3v5.4L10.8 8z" fill="currentColor" />
    </svg>
  )
}
