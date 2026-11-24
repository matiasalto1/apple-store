import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { helpPages } from '@/content/help'
import { generalMessage } from '@/lib/whatsapp'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return helpPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = helpPages.find((x) => x.slug === slug)
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/ayuda/${p.slug}` } } : {}
}

export default async function HelpDetail({ params }: Props) {
  const { slug } = await params
  const page = helpPages.find((x) => x.slug === slug)
  if (!page) notFound()
  return (
    <div className="container-x pt-8 sm:pt-12">
      <Breadcrumbs items={[{ label: 'Ayuda', href: '/ayuda' }, { label: page.title, href: `/ayuda/${page.slug}` }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-12">
        <article className="prose-store lg:col-span-8">
          <h1 className="font-display text-display">{page.title}</h1>
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </section>
          ))}
        </article>
        <aside className="lg:col-span-4">
          <div className="rounded-[var(--radius-card)] bg-ivory p-7 lg:sticky lg:top-28">
            <p className="font-display text-[1.5rem] leading-tight">¿Te quedó alguna duda?</p>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">Escribinos y te respondemos personalmente.</p>
            <WhatsAppButton message={generalMessage()} className="mt-5 w-full">
              WhatsApp
            </WhatsAppButton>
            <ul className="mt-6 space-y-1 text-[0.9375rem]">
              {helpPages
                .filter((p) => p.slug !== page.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/ayuda/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/ayuda" className="hover:underline">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
