import { NextResponse } from 'next/server'

/**
 * Suscripción al newsletter.
 * Conectá tu proveedor (Mailchimp, Brevo, Klaviyo, un webhook de Zapier/Make…)
 * definiendo NEWSLETTER_WEBHOOK_URL en el servidor. Sin esa variable, la API
 * responde con honestidad que todavía no está conectada.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: Request) {
  let email = ''
  try {
    const body = (await req.json()) as { email?: unknown }
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    return NextResponse.json({ ok: false, message: 'Solicitud inválida.' }, { status: 400 })
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, message: 'Revisá que el email esté bien escrito.' }, { status: 422 })
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json(
      { ok: false, message: 'La suscripción todavía no está habilitada. Mientras tanto, escribinos por WhatsApp.' },
      { status: 503 },
    )
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'web', at: new Date().toISOString() }),
    })
    if (!res.ok) throw new Error(String(res.status))
  } catch {
    return NextResponse.json({ ok: false, message: 'No pudimos registrar tu email. Probá más tarde.' }, { status: 502 })
  }
  return NextResponse.json({ ok: true, message: '¡Gracias! Ya estás en la lista.' })
}
