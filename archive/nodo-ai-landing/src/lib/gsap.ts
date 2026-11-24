import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1.1 })

/** Shared media conditions for gsap.matchMedia() */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
} as const

export { gsap, ScrollTrigger, SplitText, useGSAP }
