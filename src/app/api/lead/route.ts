import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface LeadData {
  name?: string
  company_role?: string
  industry?: string
  company_size?: string
  challenge?: string
  description?: string
  intent?: string
  email?: string
  phone?: string
  urgency?: string
}

const MAX_LENS: Record<string, number> = {
  name: 100, company_role: 150, industry: 100, company_size: 50,
  challenge: 200, description: 1000, intent: 200, email: 254, phone: 30, urgency: 50,
}

// Simple in-memory rate limiter: 5 req / 60s per IP
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

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function cap(val: string | undefined, key: string): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, MAX_LENS[key] ?? 500)
}

// collapse newlines/control chars for values used in the email subject line
function line(val: string): string {
  return val.replace(/[\x00-\x1f\x7f]+/g, ' ').trim()
}

function row(label: string, value: string | undefined) {
  const val = value?.trim() ? esc(value.trim()) : '<em style="color:#888">Not provided</em>'
  return `
    <tr>
      <td style="padding:10px 16px;font-weight:600;color:#a1a1aa;font-size:13px;white-space:nowrap;border-bottom:1px solid #27272a;width:160px">${esc(label)}</td>
      <td style="padding:10px 16px;color:#f4f4f5;font-size:14px;border-bottom:1px solid #27272a">${val}</td>
    </tr>`
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const body: LeadData = await request.json()

    const name        = cap(body.name, 'name')
    const company_role = cap(body.company_role, 'company_role')
    const industry    = cap(body.industry, 'industry')
    const company_size = cap(body.company_size, 'company_size')
    const challenge   = cap(body.challenge, 'challenge')
    const description = cap(body.description, 'description')
    const intent      = cap(body.intent, 'intent')
    const email       = cap(body.email, 'email')
    const phone       = cap(body.phone, 'phone')
    const urgency     = cap(body.urgency, 'urgency')

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const subject = `New Lead: ${line(name)} from ${line(company_role) || 'Unknown'} — ${line(challenge) || 'General Enquiry'}`
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'UTC', dateStyle: 'full', timeStyle: 'short',
    }) + ' UTC'

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#dc2626;padding:24px 32px;border-radius:12px 12px 0 0">
          <p style="margin:0;color:#fff;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8">Mitigence Platform</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700">New Lead Captured</h1>
        </td></tr>
        <tr><td style="background:#18181b;padding:0;border-radius:0 0 12px 12px;overflow:hidden">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Name', name)}
            ${row('Company & Role', company_role)}
            ${row('Industry', industry)}
            ${row('Company Size', company_size)}
            ${row('Challenge', challenge)}
            ${row('Description', description)}
            ${row('Intent', intent)}
            ${row('Email', email)}
            ${row('Phone', phone)}
            ${row('Urgency', urgency)}
            <tr>
              <td style="padding:10px 16px;font-weight:600;color:#a1a1aa;font-size:13px;white-space:nowrap;width:160px">Submitted at</td>
              <td style="padding:10px 16px;color:#71717a;font-size:13px">${submittedAt}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 0 0;text-align:center">
          <p style="margin:0;color:#52525b;font-size:12px">Mitigence Lead Capture — chatbot widget</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    await resend.emails.send({
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['bussiness@mitigence.com'],
      replyTo: email,
      subject,
      html,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Failed to submit lead. Please try again.' }, { status: 500 })
  }
}
