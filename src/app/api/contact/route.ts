import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactFormData {
  name: string
  email: string
  organization: string
  message: string
  source: 'contact' | 'consultation'
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const body: ContactFormData = await request.json()
    const { name, email, organization, message, source } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['akash.shrivastava5779@gmail.com'],
      replyTo: email,
      subject: source === 'consultation'
        ? `Consultation Request — ${organization || name}`
        : `Contact Form — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}
Source: ${source}

Message:
${message}
      `.trim(),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
