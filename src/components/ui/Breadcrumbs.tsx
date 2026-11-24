import Link from 'next/link'
import { brand } from '@/config/brand'
import { JsonLd } from '@/components/seo/JsonLd'

export interface Crumb {
  label: string
  href: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: 'Inicio', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Migas de pan" className="text-[0.8125rem] text-stone">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-soft">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="link-underline hover:text-ink">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: `${brand.url}${c.href === '/' ? '' : c.href}`,
          })),
        }}
      />
    </>
  )
}
