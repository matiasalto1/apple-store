import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site } from '@/config/site'
import { Logo } from '@/components/ui/Logo'
import { Arrow, MagneticButton } from '@/components/ui/MagneticButton'

/**
 * Minimal navbar.
 * - Hides on scroll down, returns on scroll up.
 * - A single indicator glides between links (hover → active section).
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400)
        last = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
          else if (e.boundingClientRect.top > 0) setActive((cur) => (cur === `#${e.target.id}` ? null : cur))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Indicator position
  const target = hovered ?? active
  useLayoutEffect(() => {
    const list = listRef.current
    const ind = indicator.current
    if (!list || !ind) return
    const link = target ? list.querySelector<HTMLAnchorElement>(`a[href="${target}"]`) : null
    if (!link) {
      ind.style.opacity = '0'
      return
    }
    const lr = list.getBoundingClientRect()
    const r = link.getBoundingClientRect()
    ind.style.opacity = '1'
    ind.style.width = `${r.width}px`
    ind.style.transform = `translateX(${r.left - lr.left}px)`
  }, [target])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-out-expo)] ${
        hidden && !open ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 border-b transition-all duration-700 ${
          scrolled ? 'border-white/[0.06] bg-ink-950/70 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      />
      <nav className="container-x flex h-16 items-center justify-between md:h-[72px]" aria-label="Principal">
        <Logo />

        <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          <span
            ref={indicator}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px bg-signal opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)]"
          />
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
                aria-current={active === item.href ? 'true' : undefined}
                className={`block px-4 py-2.5 text-[0.875rem] transition-colors duration-300 ${
                  target === item.href ? 'text-fg' : 'text-mute hover:text-fg'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <MagneticButton href={site.contactHref} variant="ghost" strength={0.2}>
              Hablar con un especialista <Arrow />
            </MagneticButton>
          </span>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 bg-ink-950/96 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="container-x flex flex-col pt-10">
          {site.nav.map((item, i) => (
            <li key={item.href} className="border-b border-white/[0.06]">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-5 text-[2rem] font-medium tracking-[-0.03em]"
                style={{
                  transition: 'transform 0.7s var(--ease-out-expo), opacity 0.7s var(--ease-out-expo)',
                  transitionDelay: open ? `${80 + i * 50}ms` : '0ms',
                  transform: open ? 'none' : 'translateY(16px)',
                  opacity: open ? 1 : 0,
                }}
              >
                {item.label}
                <span className="label-mono text-dim">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="container-x mt-10">
          <MagneticButton href={site.contactHref} size="lg" className="w-full" onClick={() => setOpen(false)}>
            Hablar con un especialista <Arrow />
          </MagneticButton>
        </div>
      </div>
    </header>
  )
}
