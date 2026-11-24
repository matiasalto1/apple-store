'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { brandName, catalog, priceRange } from '@/lib/catalog/repository'
import { formatPrice } from '@/lib/format'

const Hero3D = dynamic(() => import('@/components/three/Hero3D'), { ssr: false })

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Visual del hero: imagen estática inmediata (LCP) + escena 3D que se monta
 * en tiempo ocioso y aparece con un fundido cuando está lista.
 */
export function HeroVisual({ featuredId }: { featuredId: string }) {
  const reduce = useReducedMotion()
  const [mount3D, setMount3D] = useState(false)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const featured = catalog.getProductById(featuredId)!
  const shown = catalog.getProductById(hovered ?? featuredId) ?? featured

  useEffect(() => {
    if (reduce || !canUseWebGL()) return
    const w = window as Window & { requestIdleCallback?: Window['requestIdleCallback'] }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMount3D(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(() => setMount3D(true), 600)
    return () => window.clearTimeout(t)
  }, [reduce])

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[46rem] lg:aspect-auto lg:h-full lg:max-w-none">
      {/* "sol" de fondo */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[46%] aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle at 50% 40%, #fffaf2 0%, #efe4d3 55%, rgba(236,227,212,0) 72%)' }}
      />

      <div className="absolute inset-0">
        <Image
          src="/products/hero-composition.webp"
          alt="Pañales, toallitas, cremas y biberón sobre un pedestal"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-contain transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}
        />
        {mount3D && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Hero3D onReady={() => setReady(true)} onHover={setHovered} />
          </div>
        )}
      </div>

      {/* Chips flotantes con información real del catálogo */}
      <motion.div
        className="glass absolute left-[2%] top-[10%] hidden rounded-2xl px-4 py-3 sm:block"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="eyebrow text-stone">Pañales</p>
        <p className="mt-0.5 text-[0.9375rem] font-semibold">Talles RN a XXG</p>
      </motion.div>

      <motion.div
        className="absolute bottom-[4%] right-[2%] sm:bottom-[8%]"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={`/producto/${shown.slug}`}
          className="glass group flex items-center gap-3 rounded-2xl py-2.5 pl-4 pr-2.5 transition hover:bg-white/90"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={shown.id}
              className="block"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <span className="eyebrow block text-stone">{brandName(shown)}</span>
              <span className="block text-[0.9375rem] font-semibold">
                {shown.name} <span className="font-normal text-ink-soft">· desde {formatPrice(priceRange(shown).min)}</span>
              </span>
            </motion.span>
          </AnimatePresence>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper transition group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
