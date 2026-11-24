'use client'

import { Check, Copy, Lock } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { site } from '@/config/site'
import { computeTotals } from '@/lib/cart/pricing'
import { useCart } from '@/lib/cart/store'
import { brandName } from '@/lib/catalog/repository'
import { cn, formatPrice } from '@/lib/format'
import { useHydrated } from '@/lib/hooks'
import { paymentMethods } from '@/lib/payments/methods'
import type { CheckoutCustomer, CheckoutResult, PaymentMethodId } from '@/lib/payments/types'
import { cartMessage, whatsappUrl } from '@/lib/whatsapp'
import { CartSummary } from '@/components/cart/CartSummary'
import { ProductImage } from '@/components/product/ProductImage'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'

const PROVINCES = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
  'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

type Errors = Partial<Record<keyof CheckoutCustomer, string>>

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.875rem] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function customerLines(c: CheckoutCustomer): string[] {
  return [
    `Nombre: ${c.name}`,
    `Email: ${c.email}`,
    `Teléfono: ${c.phone}`,
    c.delivery === 'pickup' ? 'Entrega: retiro' : `Entrega: ${c.address}, ${c.city}, ${c.province} (CP ${c.postalCode})`,
    ...(c.notes ? [`Notas: ${c.notes}`] : []),
  ]
}

export function CheckoutView() {
  const hydrated = useHydrated()
  const lines = useCart((s) => s.lines)
  const clear = useCart((s) => s.clear)
  const methods = paymentMethods()
  const [method, setMethod] = useState<PaymentMethodId>(methods.find((m) => m.available)?.id ?? 'whatsapp')
  const totals = useMemo(() => computeTotals(hydrated ? lines : [], { method }), [lines, hydrated, method])
  const [c, setC] = useState<CheckoutCustomer>({ name: '', email: '', phone: '', delivery: 'shipping', address: '', city: '', province: '', postalCode: '', notes: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState<Extract<CheckoutResult, { kind: 'instructions' }> | null>(null)
  const [copied, setCopied] = useState('')

  const set = (k: keyof CheckoutCustomer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setC((prev) => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!c.name.trim()) e.name = 'Ingresá tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = 'Ingresá un email válido.'
    if (c.phone.replace(/\D/g, '').length < 8) e.phone = 'Ingresá un teléfono con código de área.'
    if (c.delivery === 'shipping') {
      if (!c.address?.trim()) e.address = 'Ingresá calle y número.'
      if (!c.city?.trim()) e.city = 'Ingresá la localidad.'
      if (!c.province) e.province = 'Elegí la provincia.'
      if (!c.postalCode?.trim()) e.postalCode = 'Ingresá el código postal.'
    }
    return e
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setServerError('')
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`co-${Object.keys(e)[0]}`)?.focus()
      return
    }

    if (method === 'whatsapp') {
      window.open(whatsappUrl(cartMessage(totals, ['Mis datos:', ...customerLines(c)])), '_blank', 'noopener,noreferrer')
      return
    }

    setBusy(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, customer: c, method }),
      })
      const data = (await res.json()) as CheckoutResult
      if (!data.ok) setServerError(data.error)
      else if (data.kind === 'redirect') window.location.assign(data.url)
      else {
        setDone(data)
        clear()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      setServerError('No pudimos conectarnos. Probá de nuevo o coordiná por WhatsApp.')
    } finally {
      setBusy(false)
    }
  }

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied(''), 1600)
    } catch {
      /* el usuario puede copiar manualmente */
    }
  }

  if (!hydrated) return <div className="h-96" />

  if (done) {
    const t = site.payments.transfer
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-ivory p-7 sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-paper">
          <Check size={26} />
        </span>
        <h2 className="mt-6 font-display text-[2.25rem] leading-tight">¡Pedido registrado!</h2>
        <p className="mt-3 text-ink-soft">
          Tu número de pedido es <strong className="text-ink">{done.orderRef}</strong>. Para confirmarlo, transferí{' '}
          <strong className="text-ink">{formatPrice(done.totals.total)}</strong> a esta cuenta y envianos el comprobante.
        </p>
        <dl className="mt-7 divide-y divide-[var(--line)] rounded-2xl bg-white">
          {[
            ['Titular', t.holder],
            ['Banco', t.bank],
            ['CBU', t.cbu],
            ['Alias', t.alias],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="text-[0.875rem] text-stone">{k}</dt>
              <dd className="flex items-center gap-2 font-medium tabular-nums">
                {v}
                {(k === 'CBU' || k === 'Alias') && (
                  <button type="button" className="icon-btn h-9 w-9" onClick={() => copy(k, v)} aria-label={`Copiar ${k}`}>
                    {copied === k ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <WhatsAppButton message={`Hola, envío el comprobante de transferencia del pedido ${done.orderRef} por ${formatPrice(done.totals.total)}.`} className="mt-7 w-full">
          Enviar comprobante por WhatsApp
        </WhatsAppButton>
        <Link href="/" className="btn btn-ghost mt-3 w-full">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (!totals.lines.length)
    return (
      <div className="rounded-[2rem] bg-ivory p-10 text-center">
        <p className="font-display text-[1.75rem]">Tu carrito está vacío.</p>
        <Link href="/tienda" className="btn btn-primary mt-6">
          Ir a la tienda
        </Link>
      </div>
    )

  const err = (k: keyof CheckoutCustomer) => ({
    'aria-invalid': Boolean(errors[k]),
    'aria-describedby': errors[k] ? `co-${k}-error` : undefined,
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="space-y-10 lg:col-span-7">
        <section aria-labelledby="co-contact">
          <h2 id="co-contact" className="mb-5 flex items-center gap-3 font-display text-[1.6rem]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-sans text-[0.875rem] text-paper">1</span> Contacto
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-name" label="Nombre y apellido" error={errors.name} className="sm:col-span-2">
              <input id="co-name" className="field" autoComplete="name" value={c.name} onChange={set('name')} {...err('name')} />
            </Field>
            <Field id="co-email" label="Email" error={errors.email}>
              <input id="co-email" type="email" inputMode="email" className="field" autoComplete="email" value={c.email} onChange={set('email')} {...err('email')} />
            </Field>
            <Field id="co-phone" label="Teléfono / WhatsApp" error={errors.phone}>
              <input id="co-phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="11 2345 6789" value={c.phone} onChange={set('phone')} {...err('phone')} />
            </Field>
          </div>
        </section>

        <section aria-labelledby="co-delivery">
          <h2 id="co-delivery" className="mb-5 flex items-center gap-3 font-display text-[1.6rem]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-sans text-[0.875rem] text-paper">2</span> Entrega
          </h2>
          {site.shipping.pickupEnabled && (
            <div className="mb-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de entrega">
              {(['shipping', 'pickup'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={c.delivery === d}
                  onClick={() => setC({ ...c, delivery: d })}
                  className={cn('rounded-2xl border p-4 text-left font-medium transition', c.delivery === d ? 'border-ink bg-white' : 'border-[var(--line-strong)]')}
                >
                  {d === 'shipping' ? 'Envío a domicilio' : 'Retiro'}
                  {d === 'pickup' && <span className="mt-1 block text-[0.8125rem] font-normal text-stone">{site.shipping.pickupAddress}</span>}
                </button>
              ))}
            </div>
          )}
          {c.delivery === 'shipping' && (
            <div className="grid gap-4 sm:grid-cols-6">
              <Field id="co-address" label="Calle, número, piso y depto." error={errors.address} className="sm:col-span-6">
                <input id="co-address" className="field" autoComplete="street-address" value={c.address} onChange={set('address')} {...err('address')} />
              </Field>
              <Field id="co-city" label="Localidad" error={errors.city} className="sm:col-span-3">
                <input id="co-city" className="field" autoComplete="address-level2" value={c.city} onChange={set('city')} {...err('city')} />
              </Field>
              <Field id="co-postalCode" label="Código postal" error={errors.postalCode} className="sm:col-span-3">
                <input id="co-postalCode" className="field" inputMode="numeric" autoComplete="postal-code" value={c.postalCode} onChange={set('postalCode')} {...err('postalCode')} />
              </Field>
              <Field id="co-province" label="Provincia" error={errors.province} className="sm:col-span-6">
                <select id="co-province" className="field" autoComplete="address-level1" value={c.province} onChange={set('province')} {...err('province')}>
                  <option value="">Elegí una provincia</option>
                  {PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
          <p className="mt-4 text-[0.875rem] text-ink-soft">El costo y el plazo de envío se confirman antes del pago, según tu zona.</p>
          <Field id="co-notes" label="Notas para la entrega (opcional)" className="mt-4">
            <textarea id="co-notes" rows={3} className="field resize-none" value={c.notes} onChange={set('notes')} />
          </Field>
        </section>

        <section aria-labelledby="co-pay">
          <h2 id="co-pay" className="mb-5 flex items-center gap-3 font-display text-[1.6rem]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-sans text-[0.875rem] text-paper">3</span> Pago
          </h2>
          <div className="space-y-3" role="radiogroup" aria-label="Medio de pago">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                disabled={!m.available}
                onClick={() => setMethod(m.id)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-2xl border bg-white p-5 text-left transition disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-60',
                  method === m.id ? 'border-ink shadow-[var(--shadow-soft)]' : 'border-[var(--line-strong)] hover:border-ink/50',
                )}
              >
                <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', method === m.id ? 'border-ink' : 'border-stone-light')}>
                  {method === m.id && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-semibold">
                    {m.label}
                    {!m.available && <span className="rounded-full bg-sand px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-soft">Próximamente</span>}
                  </span>
                  <span className="mt-1 block text-[0.875rem] text-ink-soft">{m.available ? m.description : m.unavailableReason}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-[2rem] bg-ivory p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-[1.6rem]">Tu pedido</h2>
          <ul className="mt-5 max-h-80 divide-y divide-[var(--line)] overflow-y-auto" data-lenis-prevent="">
            {totals.lines.map((l) => (
              <li key={l.key} className="flex items-center gap-4 py-3.5">
                <div className="relative shrink-0">
                  <ProductImage product={l.product} className="h-16 w-16 rounded-xl" sizes="64px" />
                  <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1 text-[0.75rem] font-semibold text-paper">{l.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9375rem] font-medium">
                    {brandName(l.product)} {l.product.name}
                  </p>
                  {l.product.variants.length > 1 && <p className="text-[0.8125rem] text-stone">{l.variant.label}</p>}
                  {!l.available && <p className="text-[0.8125rem] text-danger">Sin stock</p>}
                </div>
                <p className="shrink-0 text-[0.9375rem] tabular-nums">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t hairline pt-5">
            <CartSummary totals={totals} />
          </div>
          {serverError && (
            <p role="alert" className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-[0.875rem] text-danger">
              {serverError}
            </p>
          )}
          <button type="submit" disabled={busy} className={cn('btn mt-6 h-14 w-full text-[1rem]', method === 'whatsapp' ? 'btn-whatsapp' : 'btn-primary')}>
            {busy ? 'Procesando…' : method === 'whatsapp' ? 'Enviar pedido por WhatsApp' : method === 'transfer' ? 'Confirmar y ver datos bancarios' : 'Ir a pagar'}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-[0.8125rem] text-stone">
            <Lock size={14} /> No se realiza ningún cobro hasta que confirmes el pago.
          </p>
        </div>
      </aside>
    </form>
  )
}
