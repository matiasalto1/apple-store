interface Props {
  children?: string
  className?: string
}

/**
 * Honesty marker. Every simulated metric, demo or testimonial on the page
 * carries one so it is never read as a real customer result.
 */
export function IllustrativeTag({ children = 'Escenario ilustrativo', className = '' }: Props) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[0.625rem] text-mute ${className}`}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeDasharray="2 1.6" />
      </svg>
      {children}
    </span>
  )
}
