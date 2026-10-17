import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '@/config/site'
import { Arrow } from '@/components/ui/MagneticButton'

type Status = 'idle' | 'sent'

const FIELDS = [
  { name: 'nombre', label: 'Nombre', type: 'text', autoComplete: 'given-name', half: true },
  { name: 'apellido', label: 'Apellido', type: 'text', autoComplete: 'family-name', half: true },
  { name: 'telefono', label: 'Número de teléfono', type: 'tel', autoComplete: 'tel', half: true },
  { name: 'email', label: 'Mail', type: 'email', autoComplete: 'email', half: true },
] as const

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-[0.95rem] text-fg placeholder:text-dim ' +
  'transition-colors focus:border-signal/60 focus:outline-none'

/**
 * "Hablar con un especialista" form. Opens from any link to `site.contactHref`.
 * On submit it opens WhatsApp to `site.whatsapp` with the inquiry already
 * written, and also emails a copy to `site.contactEmail` (FormSubmit) if set.
 */
export function ContactDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const open = () => {
      setStatus((s) => (s === 'sent' ? 'idle' : s))
      if (!ref.current?.open) ref.current?.showModal()
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(`a[href="${site.contactHref}"]`)
      if (!a) return
      e.preventDefault()
      open()
    }
    document.addEventListener('click', onClick, true)
    if (location.hash === site.contactHref) open()
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const close = () => ref.current?.close()

  const [waUrl, setWaUrl] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data._honey) return

    const text = [
      `Hola, quiero hablar con un especialista de ${site.name}.`,
      '',
      `Nombre: ${data.nombre} ${data.apellido}`,
      `Teléfono: ${data.telefono}`,
      `Mail: ${data.email}`,
      `Consulta: ${data.consulta}`,
    ].join('\n')
    const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
    setWaUrl(url)
    // Abrir dentro del mismo gesto del usuario para que el navegador no lo bloquee
    window.open(url, '_blank', 'noopener')

    // Copia por mail, si hay un destino configurado
    if (site.contactEmail) {
      fetch(`https://formsubmit.co/ajax/${site.contactEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Nueva consulta de ${data.nombre} ${data.apellido}`, _replyto: data.email, _template: 'table' }),
      }).catch(() => {})
    }

    setStatus('sent')
    form.reset()
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-title"
      onClick={(e) => e.target === ref.current && close()}
      className="m-auto w-[min(36rem,calc(100vw-32px))] rounded-[26px] border border-white/[0.08] bg-ink-850 p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[calc(100svh-32px)] overflow-y-auto p-6 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label-mono text-mute">Contacto</p>
            <h2 id="contact-title" className="mt-3 text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em]">
              Hablar con un especialista
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-mute transition-colors hover:border-white/25 hover:text-fg"
          >
            ✕
          </button>
        </div>

        {status === 'sent' ? (
          <div className="mt-8" role="status">
            <p className="text-[1.05rem] text-fg-soft">
              Abrimos WhatsApp con tu consulta ya escrita. Tocá enviar y te respondemos por ahí.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-6 text-[0.9rem] font-medium text-ink-950"
              >
                Abrir WhatsApp <Arrow />
              </a>
              <button type="button" onClick={close} className="text-[0.9rem] text-mute hover:text-fg">
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <label key={f.name} className="col-span-2 text-[0.85rem] text-mute sm:col-span-1">
                {f.label}
                <input name={f.name} type={f.type} autoComplete={f.autoComplete} required className={inputClass} />
              </label>
            ))}
            <label className="col-span-2 text-[0.85rem] text-mute">
              Contanos brevemente tu consulta
              <textarea name="consulta" required rows={4} maxLength={1000} className={`${inputClass} resize-y`} />
            </label>
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <div className="col-span-2 mt-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-7 text-[0.95rem] font-medium text-ink-950 transition-colors hover:bg-white"
              >
                Enviar por WhatsApp <Arrow />
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
