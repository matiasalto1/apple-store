import { site } from '@/config/site'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`group inline-flex items-center gap-2.5 py-2 ${className}`} aria-label={`${site.name} — inicio`}>
      <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="2.5" />
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="2.5"
          strokeDasharray="22 104"
          className="origin-center transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:rotate-[160deg]"
        />
        <circle cx="32" cy="32" r="6.5" fill="var(--color-signal)" />
        <circle cx="32" cy="12" r="3.6" fill="currentColor" />
        <circle cx="49.3" cy="42" r="3.6" fill="currentColor" />
        <circle cx="14.7" cy="42" r="3.6" fill="currentColor" />
      </svg>
      <span className="text-[1.15rem] font-semibold tracking-[-0.03em]">{site.name.toLowerCase()}</span>
    </a>
  )
}
