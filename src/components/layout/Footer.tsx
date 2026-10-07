import { site } from '@/config/site'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-black/60">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <Logo />
          <p className="mt-5 max-w-[22rem] text-[1.05rem] leading-snug tracking-[-0.01em] text-fg-soft">{site.tagline}</p>
        </div>
        <nav className="md:col-span-6 md:justify-self-end" aria-label="Pie de página">
          <ul className="grid grid-cols-2 gap-x-14 gap-y-3 sm:grid-cols-3">
            {site.footerNav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-[0.92rem] text-mute transition-colors hover:text-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-white/[0.05] py-6 text-[0.8rem] text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. Todos los derechos reservados.
        </p>
        <p className="label-mono flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" /> Sistema operativo
        </p>
      </div>
    </footer>
  )
}
