import Image from 'next/image'
import { site } from '@/config/site'
import { socialPosts } from '@/content/social'
import { catalog } from '@/lib/catalog/repository'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { ProductImage } from '@/components/product/ProductImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/format'

export function Social() {
  if (!site.social.instagram) return null
  const real = socialPosts.length > 0
  const demo = catalog.listProducts().slice(0, 6)
  const tiles = real ? socialPosts.slice(0, 6) : []

  return (
    <section aria-labelledby="social-title" className="container-x pt-24 sm:pt-32">
      <SectionHeading
        id="social-title"
        eyebrow="Comunidad"
        title={[site.social.instagramHandle]}
        text="Novedades, reposiciones y guías prácticas. Seguinos para ver el contenido completo."
        action={
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <InstagramIcon size={18} /> Seguir en Instagram
          </a>
        }
      />
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {real
          ? tiles.map((t) => (
              <li key={t.id}>
                <a href={t.href} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-2xl">
                  <Image src={t.image} alt={t.alt} fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </a>
              </li>
            ))
          : demo.map((p, i) => (
              <li key={p.id} className={cn(i % 2 === 1 && 'lg:translate-y-8')}>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl"
                  aria-label={`Abrir Instagram (${p.name})`}
                >
                  <ProductImage product={p} className="h-full w-full" sizes="(min-width:1024px) 16vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 grid place-items-center bg-ink/0 text-paper opacity-0 transition-all duration-500 group-hover:bg-ink/25 group-hover:opacity-100">
                    <InstagramIcon size={26} />
                  </span>
                </a>
              </li>
            ))}
      </ul>
      {!real && <p className="mt-4 text-[0.75rem] text-stone lg:mt-12">Imágenes ilustrativas hasta conectar las publicaciones reales.</p>}
    </section>
  )
}
