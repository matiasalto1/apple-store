import Link from 'next/link'
import { brand } from '@/config/brand'
import { cn } from '@/lib/format'

/**
 * Logo provisorio: monograma + wordmark tipográfico generado desde `brand.name`.
 * Para usar un logo real, reemplazá el <svg> y/o el <span> por <Image src="/brand/logo.svg" … />.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('shrink-0', className)} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="currentColor" />
      <path d="M10.5 18.5a9.5 9.5 0 0 0 19 0" fill="none" stroke="var(--color-paper)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="13.2" r="2.6" fill="var(--color-paper)" />
    </svg>
  )
}

export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn('group inline-flex items-center gap-2.5 py-2', className)}
      aria-label={`${brand.name} — inicio`}
    >
      <LogoMark className="h-8 w-8 text-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[-12deg]" />
      <span className="font-display-italic text-[1.6rem] leading-none tracking-[-0.02em]">{brand.name}</span>
    </Link>
  )
}
