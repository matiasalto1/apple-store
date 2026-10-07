import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import '@/lib/gsap'
import App from './App'

// Hide hero copy until the boot timeline takes over (motion users only).
// The safety net guarantees the copy appears even if the app never mounts.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-boot')
  window.setTimeout(() => document.documentElement.classList.remove('js-boot'), 4000)
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
