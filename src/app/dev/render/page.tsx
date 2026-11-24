import { notFound } from 'next/navigation'
import { brandName, catalog } from '@/lib/catalog/repository'
import { RenderClient } from './RenderClient'

export const metadata = { robots: { index: false, follow: false } }

/** Solo desarrollo: escenario para `npm run render:products`. */
export default async function RenderPage({ searchParams }: { searchParams: Promise<{ id?: string; mode?: string; elev?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { id, mode, elev } = await searchParams
  if (mode === 'hero') return <RenderClient mode="hero" />
  const product = id ? catalog.getProductById(id) : undefined
  if (!product) return <pre>{catalog.listProducts().map((p) => p.id).join('\n')}</pre>
  return <RenderClient mode="product" visual={product.visual} brandLabel={brandName(product)} elev={elev ? Number(elev) : undefined} />
}
