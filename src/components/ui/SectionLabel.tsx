interface Props {
  index: string
  children: string
  className?: string
}

/** "02 ── EL PROBLEMA" — the system's chapter marker. */
export function SectionLabel({ index, children, className = '' }: Props) {
  return (
    <p className={`label-mono flex items-center gap-3 text-mute ${className}`} data-reveal="fade">
      <span className="text-signal">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-white/15" />
      <span>{children}</span>
    </p>
  )
}
