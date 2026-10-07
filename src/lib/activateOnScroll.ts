import { ScrollTrigger } from './gsap'

/** Once the progress line reaches a step it stays active (and deactivates when scrolling back). */
export function activateOnScroll(el: HTMLElement, start = 'top 62%') {
  ScrollTrigger.create({
    trigger: el,
    start,
    onEnter: () => el.classList.add('is-live'),
    onLeaveBack: () => el.classList.remove('is-live'),
  })
}
