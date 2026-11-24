import { useEffect, useState } from 'react'

/**
 * Drives auto-playing demos: advances 0 → length, holds on the final
 * state, then restarts. Paused while `active` is false.
 */
export function useSequence(length: number, { active, step = 900, hold = 2600, resetKey }: { active: boolean; step?: number; hold?: number; resetKey?: unknown }) {
  const [i, setI] = useState(-1)

  useEffect(() => {
    setI(-1)
  }, [resetKey])

  useEffect(() => {
    if (!active) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setI(length)
      return
    }
    const delay = i >= length ? hold : i < 0 ? 500 : step
    const t = window.setTimeout(() => setI((v) => (v >= length ? -1 : v + 1)), delay)
    return () => window.clearTimeout(t)
  }, [active, i, length, step, hold])

  return i
}
