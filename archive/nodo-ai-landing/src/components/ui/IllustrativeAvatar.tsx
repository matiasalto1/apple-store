/**
 * Abstract, generated avatar for illustrative testimonials.
 * Intentionally NOT a face — it cannot be mistaken for a real person.
 */
export function IllustrativeAvatar({ seed, size = 48 }: { seed: string; size?: number }) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const rot = h % 360
  const nodes = 3 + (h % 3)
  const pts = Array.from({ length: nodes }, (_, i) => {
    const a = (i / nodes) * Math.PI * 2 + (rot * Math.PI) / 180
    return { x: 24 + Math.cos(a) * 13, y: 24 + Math.sin(a) * 13 }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Avatar ilustrativo" className="shrink-0">
      <rect width="48" height="48" rx="24" fill="var(--color-ink-800)" />
      <circle cx="24" cy="24" r="23.5" fill="none" stroke="white" strokeOpacity=".1" />
      {pts.map((p, i) => (
        <line key={i} x1="24" y1="24" x2={p.x} y2={p.y} stroke="white" strokeOpacity=".18" strokeWidth=".8" />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="var(--color-fg)" fillOpacity=".7" />
      ))}
      <circle cx="24" cy="24" r="3.6" fill="var(--color-signal)" />
    </svg>
  )
}
