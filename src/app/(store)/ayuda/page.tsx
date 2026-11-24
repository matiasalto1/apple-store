import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'
import { faq, helpPages } from '@/content/help'
import { generalMessage } from '@/lib/whatsapp'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { FaqList } from './FaqList'

export const metadata: Metadata = {
  title: 'Ayuda y preguntas frecuentes',
  description: 'Respuestas sobre talles, pedidos, envíos, cambios y medios de pago. Atención personalizada por WhatsApp.',
  alternates: { canonical: '/ayuda' },
}

export default function HelpPage() {
  return (
    <div className="container-x pt-8 sm:pt-12">
      <Breadcrumbs items={[{ label: 'Ayuda', href: '/ayuda' }]} />
      <div className="mt-6 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="font-display text-display">Ayuda</h1>
          <p className="mt-5 text-ink-soft">¿No encontrás lo que buscás? Una persona te responde.</p>
          <div className="mt-6 space-y-3 text-[0.9375rem]">
            <WhatsAppButton message={generalMessage()}>Escribir por WhatsApp</WhatsAppButton>
            <p className="text-stone">{site.contact.hours}</p>
          </div>
          <nav aria-label="Páginas de ayuda" className="mt-10">
            <ul className="space-y-1">
              {helpPages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/ayuda/${p.slug}`} className="flex min-h-11 items-center justify-between border-b hairline font-medium hover:text-accent">
                    {p.title} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="lg:col-span-8">
          <h2 className="eyebrow mb-4 text-stone">Preguntas frecuentes</h2>
          <FaqList items={faq} />
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </div>
  )
}
