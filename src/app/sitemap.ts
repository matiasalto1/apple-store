import type { MetadataRoute } from 'next'
import { brand } from '@/config/brand'
import { helpPages } from '@/content/help'
import { catalog } from '@/lib/catalog/repository'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const u = (path: string) => `${brand.url}${path}`
  return [
    { url: u('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: u('/tienda'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: u('/packs'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/marca'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: u('/ayuda'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...catalog.listCategories().map((c) => ({ url: u(`/categoria/${c.slug}`), lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...catalog.listProducts().map((p) => ({
      url: u(`/producto/${p.slug}`),
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...helpPages.map((h) => ({ url: u(`/ayuda/${h.slug}`), lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]
}
