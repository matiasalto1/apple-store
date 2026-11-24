import { site } from '@/config/site'
import { catalogIsDemo } from '@/lib/catalog/repository'

export function AnnouncementBar() {
  if (!site.announcement.enabled) return null
  const text = catalogIsDemo ? site.announcement.demoNotice : site.announcement.message
  return (
    <div className="relative z-[61] bg-ink text-paper">
      <p className="container-x flex h-9 items-center justify-center text-center text-[0.75rem] tracking-[0.02em] text-paper/85">{text}</p>
    </div>
  )
}
