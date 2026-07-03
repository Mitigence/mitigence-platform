import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const ALLOWED_SOURCES = new Set(['contact', 'consultation'])

// 5 req / 60s per IP
const ipMap = new Map<string, { n: number; reset: number }>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  // prune expired entries so the map cannot grow unbounded
  if (ipMap.size > 5000) {
    for (const [k, v] of ipMap) if (now > v.reset) ipMap.delete(k)
  }
  const e = ipMap.get(ip)
  if (!e || now > e.reset) { ipMap.set(ip, { n: 1, reset: now + 60_000 }); return false }
  if (e.n >= 5) return true
  e.n++
  return false
}

function cap(val: unknown, max: number): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, max)
}

// collapse newlines/control chars for values used in the email subject line
function line(val: string): string {
  return val.replace(/[\x00-\x1f\x7f]+/g, ' ').trim()
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const body = await request.json()

    const name         = cap(body.name, 100)
    const email        = cap(body.email, 254)
    const organization = cap(body.organization, 150)
    const message      = cap(body.message, 2000)
    const source       = ALLOWED_SOURCES.has(body.source) ? (body.source as string) : 'contact'

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['Business@mitigence.com'],
      replyTo: email,
      subject: source === 'consultation'
        ? `Consultation Request — ${line(organization) || line(name)}`
        : `Contact Form — ${line(name)}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || 'Not provided'}`,
        `Source: ${source}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
