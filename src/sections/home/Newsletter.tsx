'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { site } from '@/config/site'

type State = { status: 'idle' | 'loading' | 'ok' | 'error'; message?: string }

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>({ status: 'idle' })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string }
      setState(data.ok ? { status: 'ok', message: data.message } : { status: 'error', message: data.message })
    } catch {
      setState({ status: 'error', message: 'No pudimos conectarnos. Probá de nuevo en unos minutos.' })
    }
  }

  return (
    <section aria-labelledby="nl-title" className="container-x pt-24 sm:pt-32">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-accent-soft px-6 py-14 sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:px-20">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow mb-4 text-accent">Newsletter</p>
            <h2 id="nl-title" className="font-display text-headline">
              {site.newsletter.title}
            </h2>
            <p className="mt-5 max-w-md text-ink-soft">{site.newsletter.text}</p>
          </div>
          <form onSubmit={onSubmit} className="w-full" noValidate>
            <label htmlFor="nl-email" className="sr-only">
              Tu email
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[var(--shadow-soft)]">
              <input
                id="nl-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field rounded-full border-transparent sm:min-h-12 sm:shadow-none"
                aria-invalid={state.status === 'error'}
                aria-describedby="nl-status"
                disabled={state.status === 'ok'}
              />
              <button type="submit" className="btn btn-primary shrink-0" disabled={state.status === 'loading' || state.status === 'ok'}>
                {state.status === 'ok' ? (
                  <>
                    <Check size={17} /> Listo
                  </>
                ) : state.status === 'loading' ? (
                  'Enviando…'
                ) : (
                  <>
                    Suscribirme <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
            <p id="nl-status" role="status" className={`mt-3 min-h-6 px-2 text-[0.875rem] ${state.status === 'error' ? 'text-danger' : 'text-ink-soft'}`}>
              {state.message}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
