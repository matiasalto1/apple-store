import { Clock, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { brand } from '@/config/brand'
import { site } from '@/config/site'
import { catalog } from '@/lib/catalog/repository'
import { generalMessage, whatsappUrl } from '@/lib/whatsapp'
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { LogoMark } from '@/components/ui/Logo'

const HELP = [
  { label: 'Preguntas frecuentes', href: '/ayuda' },
  { label: 'Envíos', href: '/ayuda/envios' },
  { label: 'Cambios y devoluciones', href: '/ayuda/cambios-y-devoluciones' },
  { label: 'Medios de pago', href: '/ayuda/medios-de-pago' },
  { label: 'Términos y condiciones', href: '/ayuda/terminos' },
  { label: 'Privacidad', href: '/ayuda/privacidad' },
]

export function Footer() {
  const cats = catalog.listCategories().filter((c) => c.id !== 'ofertas')
  const socials = [
    { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: site.social.tiktok, label: 'TikTok', Icon: TikTokIcon },
    { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon },
  ].filter((s) => s.href)

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-paper sm:mt-32">
      <div className="container-x grid gap-12 pb-10 pt-16 sm:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label={`${brand.name} — inicio`}>
            <LogoMark className="h-10 w-10 text-accent-soft [&_path]:stroke-ink [&_circle:last-child]:fill-ink" />
            <span className="font-display-italic text-[2rem] leading-none">{brand.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-paper/65">{brand.tagline} Pañales, higiene y accesorios seleccionados para cada etapa.</p>
          <a
            href={whatsappUrl(generalMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-7 bg-paper text-ink hover:bg-accent-soft"
          >
            <WhatsAppIcon size={18} className="text-whatsapp" /> {site.contact.whatsappDisplay}
          </a>
        </div>

        <nav aria-label="Categorías" className="lg:col-span-2">
          <h2 className="eyebrow mb-4 text-paper/45">Tienda</h2>
          <ul className="space-y-2.5 text-[0.9375rem]">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.slug}`} className="text-paper/80 transition hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/packs" className="text-paper/80 transition hover:text-paper">
                Packs
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ayuda" className="lg:col-span-3">
          <h2 className="eyebrow mb-4 text-paper/45">Ayuda</h2>
          <ul className="space-y-2.5 text-[0.9375rem]">
            {HELP.map((h) => (
              <li key={h.href}>
                <Link href={h.href} className="text-paper/80 transition hover:text-paper">
                  {h.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/marca" className="text-paper/80 transition hover:text-paper">
                Nuestra marca
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="eyebrow mb-4 text-paper/45">Contacto</h2>
          <ul className="space-y-3 text-[0.9375rem] text-paper/80">
            <li className="flex gap-3">
              <Mail size={17} className="mt-1 shrink-0 text-paper/45" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-paper">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={17} className="mt-1 shrink-0 text-paper/45" />
              {site.contact.hours}
            </li>
            <li className="flex gap-3">
              <MapPin size={17} className="mt-1 shrink-0 text-paper/45" />
              {site.contact.location}
            </li>
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-paper/15 transition hover:border-paper/60">
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-5 border-t border-paper/10 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow mb-2.5 text-paper/45">Medios de pago</p>
            <ul className="flex flex-wrap gap-2">
              {site.payments.accepted.map((m) => (
                <li key={m} className="rounded-md border border-paper/15 px-2.5 py-1 text-[0.75rem] text-paper/75">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[0.8125rem] text-paper/45">
            © {new Date().getFullYear()} {brand.name}. Precios en pesos argentinos (ARS), IVA incluido.
          </p>
        </div>
      </div>

      <p aria-hidden="true" className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center font-display-italic text-[24vw] leading-[0.78] text-paper/[0.04]">
        {brand.name}
      </p>
    </footer>
  )
}
