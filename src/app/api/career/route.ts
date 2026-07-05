import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { NOREPLY_EMAIL, HR_EMAIL, BUSINESS_EMAIL } from '@/lib/site-config'

// 3 req / 60s per IP (attachments are heavier than plain enquiries)
const ipMap = new Map<string, { n: number; reset: number }>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  // prune expired entries so the map cannot grow unbounded
  if (ipMap.size > 5000) {
    for (const [k, v] of ipMap) if (now > v.reset) ipMap.delete(k)
  }
  const e = ipMap.get(ip)
  if (!e || now > e.reset) { ipMap.set(ip, { n: 1, reset: now + 60_000 }); return false }
  if (e.n >= 3) return true
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

// 3 MB decoded ≈ 4 MB base64 body — stays under Vercel's 4.5 MB function payload limit
const MAX_RESUME_BYTES = 3 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx'])

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

    const name    = cap(body.name, 100)
    const email   = cap(body.email, 254)
    const role    = cap(body.role, 150)
    const message = cap(body.message, 3000)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Optional resume attachment: { filename, contentBase64 }
    let attachments: { filename: string; content: string }[] | undefined
    if (body.resume) {
      const filename = cap(body.resume.filename, 120)
      const contentBase64 = typeof body.resume.contentBase64 === 'string' ? body.resume.contentBase64 : ''
      const ext = filename.split('.').pop()?.toLowerCase() ?? ''

      if (!filename || !contentBase64) {
        return NextResponse.json({ error: 'Resume file is incomplete.' }, { status: 400 })
      }
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ error: 'Resume must be a PDF, DOC, or DOCX file.' }, { status: 400 })
      }
      if (!/^[A-Za-z0-9+/=]+$/.test(contentBase64)) {
        return NextResponse.json({ error: 'Resume file is corrupted.' }, { status: 400 })
      }
      // base64 → bytes: every 4 chars encode 3 bytes
      const approxBytes = Math.floor(contentBase64.length * 0.75)
      if (approxBytes > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: 'Resume must be smaller than 3 MB.' }, { status: 400 })
      }
      // safe filename: strip path separators and control chars
      const safeName = filename.replace(/[/\\\x00-\x1f\x7f]+/g, '_')
      attachments = [{ filename: safeName, content: contentBase64 }]
    }

    await resend.emails.send({
      from: `Mitigence Platform <${NOREPLY_EMAIL}>`,
      to: [HR_EMAIL],
      cc: [BUSINESS_EMAIL],
      replyTo: email,
      subject: `Career Enquiry — ${line(name)}${role ? ` (${line(role)})` : ''}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Role of interest: ${role || 'Not specified'}`,
        `Resume attached: ${attachments ? 'Yes' : 'No'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      attachments,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Career enquiry error:', error)
    return NextResponse.json({ error: 'Failed to send enquiry. Please try again.' }, { status: 500 })
  }
}
