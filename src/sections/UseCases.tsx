import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { USE_CASES } from '@/data/useCases'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'

export function UseCases() {
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const uc = USE_CASES[active]

  // sliding selection pill
  useLayoutEffect(() => {
    const t = tabs.current[active]
    const p = pill.current
    if (!t || !p) return
    p.style.width = `${t.offsetWidth}px`
    p.style.transform = `translateX(${t.offsetLeft}px)`
    const l = list.current
    if (l && l.scrollWidth > l.clientWidth) {
      l.scrollTo({ left: t.offsetLeft - l.clientWidth / 2 + t.offsetWidth / 2, behavior: 'smooth' })
    }
  }, [active])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const tl = gsap.timeline()
      tl.fromTo('[data-uc-before]', { autoAlpha: 0, x: -16, filter: 'blur(8px)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.9 })
        .fromTo('[data-uc-after]', { autoAlpha: 0, x: 16, filter: 'blur(8px)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.9 }, 0.12)
        .fromTo('[data-uc-step]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7 }, 0.25)
        .fromTo('[data-uc-line]', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0.2)
    },
    { scope: stage, dependencies: [active] },
  )

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (active + dir + USE_CASES.length) % USE_CASES.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="casos" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="cases-title">
      <div className="container-x">
        <SectionLabel index="05">Casos de uso</SectionLabel>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <RevealText id="cases-title" className="text-headline max-w-[14ch] font-medium lg:col-span-7">
            Cada área, un sistema que trabaja con ella.
          </RevealText>
          <p className="max-w-[24rem] self-end text-mute lg:col-span-4 lg:col-start-9" data-reveal>
            Seleccioná un área para ver cómo cambia su forma de trabajar.
          </p>
        </div>

        {/* selector */}
        <div
          ref={list}
          role="tablist"
          aria-label="Áreas de negocio"
          onKeyDown={onKey}
          className="relative mt-12 flex gap-1 overflow-x-auto rounded-full border border-white/[0.07] bg-ink-900/60 p-1 [scrollbar-width:none] lg:mt-16 lg:inline-flex"
        >
          <span
            ref={pill}
            aria-hidden="true"
            className="absolute left-0 top-1 bottom-1 rounded-full bg-fg transition-[transform,width] duration-700 ease-[var(--ease-out-expo)]"
          />
          {USE_CASES.map((u, i) => (
            <button
              key={u.key}
              ref={(el) => void (tabs.current[i] = el)}
              role="tab"
              id={`uc-tab-${u.key}`}
              aria-selected={i === active}
              aria-controls="uc-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`label-mono relative z-10 shrink-0 rounded-full px-5 py-3 transition-colors duration-500 ${
                i === active ? 'text-ink-950' : 'text-mute hover:text-fg'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        {/* transforming interface */}
        <div
          ref={stage}
          id="uc-panel"
          role="tabpanel"
          aria-labelledby={`uc-tab-${uc.key}`}
          className="mt-6 grid overflow-hidden rounded-[26px] border border-white/[0.07] lg:grid-cols-[1fr_auto_1.35fr]"
        >
          <div data-uc-before className="relative bg-ink-900/40 p-7 md:p-10">
            <p className="label-mono text-dim">Antes</p>
            <p className="mt-6 max-w-[26rem] text-[1.25rem] leading-snug tracking-[-0.015em] text-mute md:text-[1.45rem]">{uc.before}</p>
            {/* manual work: disconnected fragments */}
            <div aria-hidden="true" className="mt-10 flex flex-wrap gap-2 opacity-70">
              {uc.flow.map((f, k) => (
                <span
                  key={f}
                  className="label-mono rounded-md border border-dashed border-white/15 px-2.5 py-1.5 text-dim"
                  style={{ transform: `translateY(${[0, 6, -3, 4][k] ?? 0}px) rotate(${[-1.5, 1, -0.5, 2][k] ?? 0}deg)` }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="relative flex items-center justify-center border-y border-white/[0.06] bg-ink-950 py-4 lg:border-x lg:border-y-0 lg:px-4 lg:py-0">
            <span className="grid h-10 w-10 rotate-90 place-items-center rounded-full border border-signal/30 text-signal lg:rotate-0">→</span>
          </div>

          <div data-uc-after className="spotlight relative bg-gradient-to-br from-signal/[0.05] via-transparent to-transparent p-7 md:p-10"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
            }}
          >
            <p className="label-mono text-signal">Después</p>
            <p className="mt-6 max-w-[34rem] text-[1.25rem] leading-snug tracking-[-0.015em] text-fg md:text-[1.45rem]">{uc.after}</p>

            {/* connected flow */}
            <div className="relative mt-10">
              <span data-uc-line aria-hidden="true" className="absolute left-2 right-2 top-[7px] hidden h-px origin-left bg-gradient-to-r from-signal/70 via-signal/40 to-signal/10 sm:block" />
              <ol className="relative grid gap-4 sm:grid-cols-4">
                {uc.flow.map((f, k) => (
                  <li key={f} data-uc-step className="flex items-center gap-3 sm:flex-col sm:items-start">
                    <span className="relative h-[15px] w-[15px] shrink-0 rounded-full border border-signal bg-ink-900">
                      <span className="absolute inset-[4px] rounded-full bg-signal" style={{ animation: `blink 2s ${k * 0.3}s infinite` }} />
                    </span>
                    <span className="text-[0.9rem] text-fg-soft">{f}</span>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="mt-10 flex flex-wrap gap-2 border-t border-white/[0.06] pt-6">
              {uc.capabilities.map((c) => (
                <li key={c} data-uc-step className="rounded-full border border-white/10 px-3 py-1.5 text-[0.8rem] text-fg-soft">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
