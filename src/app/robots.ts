import type { MetadataRoute } from 'next'
import { brand } from '@/config/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/cuenta', '/favoritos', '/api/', '/dev/'] }],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  }
}
