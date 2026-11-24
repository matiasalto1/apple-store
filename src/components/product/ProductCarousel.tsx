'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product } from '@/lib/catalog/types'
import { ProductCard } from './ProductCard'

/** Carrusel nativo con scroll-snap: táctil en mobile, flechas en desktop. */
export function ProductCarousel({ products, label }: { products: Product[]; label: string }) {
  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
  }, [])

  useEffect(() => {
    update()
    const el = track.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const go = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 20) * 2, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={track}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-7 sm:gap-5 sm:scroll-px-7 sm:px-7 xl:-mx-12 xl:scroll-px-12 xl:px-12"
        data-lenis-prevent-wheel=""
      >
        {products.map((p) => (
          <li key={p.id} className="flex w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[31%] xl:w-[23%]">
            <ProductCard product={p} className="w-full" />
          </li>
        ))}
      </ul>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        <button type="button" className="icon-btn h-12 w-12 border border-[var(--line-strong)] disabled:opacity-30" onClick={() => go(-1)} disabled={edges.start} aria-label="Anteriores">
          <ArrowLeft size={18} />
        </button>
        <button type="button" className="icon-btn h-12 w-12 border border-[var(--line-strong)] disabled:opacity-30" onClick={() => go(1)} disabled={edges.end} aria-label="Siguientes">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
