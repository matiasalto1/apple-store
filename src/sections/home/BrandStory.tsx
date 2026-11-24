'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { brandStory } from '@/content/brand-story'
import { catalog } from '@/lib/catalog/repository'
import { cn } from '@/lib/format'
import { ProductImage } from '@/components/product/ProductImage'

/** Storytelling con visual fijo (sticky) que cambia según el paso activo. */
export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] })
  const steps = brandStory.steps

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))))
  })

  const product = catalog.getProductById(steps[active].productId)

  return (
    <section aria-labelledby="story-title" className="container-x pt-24 sm:pt-36">
      <p className="eyebrow mb-4 text-accent">{brandStory.eyebrow}</p>
      <h2 id="story-title" className="max-w-4xl font-display text-display">
        {brandStory.title[0]} <em className="font-display-italic text-accent">{brandStory.title[1]}</em>
      </h2>

      <div ref={ref} className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-20">
        {/* Visual sticky (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem]" style={{ background: product?.visual.backdrop }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {product && (
                <motion.div
                  key={product.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -30 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductImage product={product} className="h-full w-full" sizes="45vw" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute bottom-5 left-5 flex gap-1.5">
              {steps.map((s, i) => (
                <span key={s.id} className={cn('h-1.5 rounded-full transition-all duration-500', i === active ? 'w-8 bg-ink' : 'w-1.5 bg-ink/25')} />
              ))}
            </div>
          </div>
        </div>

        <ol className="flex flex-col gap-6 lg:gap-0">
          {steps.map((s, i) => {
            const p = catalog.getProductById(s.productId)
            return (
              <li
                key={s.id}
                className={cn(
                  'rounded-[1.75rem] bg-ivory p-6 transition-opacity duration-700 sm:p-8 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:bg-transparent lg:p-0',
                  i === active ? 'lg:opacity-100' : 'lg:opacity-30',
                )}
              >
                {p && <ProductImage product={p} className="mb-6 aspect-[4/3] rounded-2xl lg:hidden" sizes="90vw" />}
                <p className="eyebrow text-stone">{s.kicker}</p>
                <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05]">{s.title}</h3>
                <p className="mt-4 max-w-md text-[1.0625rem] text-ink-soft">{s.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
