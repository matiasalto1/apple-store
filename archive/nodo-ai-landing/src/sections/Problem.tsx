import { useRef } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'
import { PROBLEMS } from '@/data/problems'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* Indentation rhythm for the editorial composition (desktop) */
const OFFSETS = ['lg:ml-0', 'lg:ml-[18%]', 'lg:ml-[6%]', 'lg:ml-[26%]', 'lg:ml-[10%]', 'lg:ml-[2%]']

export function Problem() {
  const root = useRef<HTMLElement>(null)
  const sub = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // second statement lights up word by word while scrolling
        const split = SplitText.create(sub.current!, { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: sub.current, start: 'top 85%', end: 'top 45%', scrub: true },
          },
        )

        // problems surface one by one: fracture line draws, text rises out of a mask
        gsap.utils.toArray<HTMLElement>('[data-problem]').forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 86%', once: true } })
          tl.from(row.querySelectorAll('[data-frag]'), { scaleX: 0, duration: 1.2, stagger: 0.08, ease: 'expo.inOut' })
            .from(row.querySelector('[data-p-title]'), { yPercent: 110, duration: 1.1 }, 0.25)
            .from(row.querySelectorAll('[data-p-meta]'), { autoAlpha: 0, y: 10, duration: 1, stagger: 0.08 }, 0.45)
        })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="problema" data-scene="problem" className="relative py-[16vh] lg:py-[22vh]" aria-labelledby="problem-title">
      <div className="container-x grid gap-x-10 lg:grid-cols-12">
        <div className="order-first lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2">
          <div className="lg:sticky lg:top-[14vh]">
            <div data-system-anchor="problem" aria-hidden="true" className="h-[34svh] lg:h-[64vh]" />
            <div className="label-mono mt-6 hidden items-center justify-between border-t border-white/[0.07] pt-4 text-dim lg:flex">
              <span>Estado actual</span>
              <span>
                8 sistemas · <span className="text-mute">0 conexiones</span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <SectionLabel index="01">El problema</SectionLabel>
          <RevealText id="problem-title" className="text-headline mt-8 max-w-[14ch] font-medium">
            Las empresas no necesitan más software.
          </RevealText>
          <p ref={sub} className="text-title mt-6 max-w-[22ch] font-medium text-fg-soft">
            Necesitan sistemas que entiendan cómo trabajan.
          </p>
        </div>

        <ol className="mt-[12vh] lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-[18vh]">
          {PROBLEMS.map((p, i) => (
            <li key={p.title} data-problem className={`group relative py-8 md:py-10 ${OFFSETS[i]}`}>
              {/* fractured connection: segments that never quite meet */}
              <div aria-hidden="true" className="mb-6 flex items-center gap-[6px]">
                <span data-frag className="h-px w-[22%] origin-left bg-white/20" />
                <span data-frag className="h-px w-[9%] origin-left translate-y-[3px] bg-white/12" />
                <span data-frag className="h-px w-[14%] origin-left -translate-y-[2px] bg-white/[0.08]" />
                <span data-frag className="h-1.5 w-1.5 rounded-full border border-white/25" />
              </div>
              <div className="flex items-baseline gap-5 md:gap-8">
                <span data-p-meta className="label-mono w-10 shrink-0 text-dim">
                  P/{String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="overflow-hidden">
                    <span data-p-title className="text-title block font-medium transition-colors duration-500 group-hover:text-signal-soft">
                      {p.title}
                    </span>
                  </h3>
                  <p data-p-meta className="mt-3 max-w-[30rem] text-mute">
                    {p.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
