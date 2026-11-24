import { useEffect, useState, type RefObject } from 'react'

/** Lightweight IntersectionObserver hook. `once` keeps it true after first reveal. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = false, margin = '0px', threshold = 0.25 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin: margin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, margin, threshold])
  return inView
}
