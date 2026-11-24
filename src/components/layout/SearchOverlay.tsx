'use client'

import { ArrowRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDeferredValue, useMemo, useState } from 'react'
import { matchesQuery } from '@/lib/catalog/filters'
import { brandName, catalog, priceRange } from '@/lib/catalog/repository'
import { formatPrice } from '@/lib/format'
import { useUI } from '@/lib/ui-store'
import { Overlay } from '@/components/ui/Overlay'
import { ProductImage } from '@/components/product/ProductImage'

const SUGGESTED = ['Pañales talle M', 'Toallitas', 'Crema', 'Biberón', 'Recién nacido']

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen)
  const setSearch = useUI((s) => s.setSearch)
  const router = useRouter()
  const [q, setQ] = useState('')
  const dq = useDeferredValue(q)
  const close = () => {
    setSearch(false)
    setQ('')
  }

  const results = useMemo(() => {
    if (dq.trim().length < 2) return []
    return catalog
      .listProducts()
      .filter((p) => matchesQuery(p, dq))
      .slice(0, 6)
  }, [dq])

  const submit = (term: string) => {
    if (!term.trim()) return
    router.push(`/tienda?q=${encodeURIComponent(term.trim())}`)
    close()
  }

  return (
    <Overlay open={open} onClose={close} label="Buscar productos" side="top" className="rounded-b-[2rem]">
      <div className="container-x pb-8 pt-4 sm:pb-12 sm:pt-6">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            submit(q)
          }}
          className="flex items-center gap-3 border-b-2 border-ink pb-3"
        >
          <Search size={24} className="shrink-0 text-stone" />
          <label htmlFor="site-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Qué estás buscando?"
            autoComplete="off"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent font-display text-[1.75rem] outline-none placeholder:text-stone-light sm:text-[2.5rem]"
          />
          <button type="button" onClick={close} className="icon-btn shrink-0" aria-label="Cerrar búsqueda">
            <X size={22} />
          </button>
        </form>

        {dq.trim().length < 2 ? (
          <div className="pt-6">
            <p className="eyebrow mb-3 text-stone">Búsquedas frecuentes</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => submit(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="pt-8 text-ink-soft">
            No encontramos resultados para “{dq}”. Probá con otra palabra o{' '}
            <Link href="/tienda" onClick={close} className="font-semibold underline">
              mirá todo el catálogo
            </Link>
            .
          </p>
        ) : (
          <div className="pt-6">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/producto/${p.slug}`} onClick={close} className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-sand/60">
                    <ProductImage product={p} className="h-20 w-20 shrink-0 rounded-xl" sizes="80px" />
                    <div className="min-w-0">
                      <p className="eyebrow text-stone">{brandName(p)}</p>
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="text-[0.875rem] text-ink-soft">Desde {formatPrice(priceRange(p).min)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => submit(q)} className="mt-6 inline-flex items-center gap-2 font-semibold hover:underline">
              Ver todos los resultados <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Overlay>
  )
}
