'use client'

import { useState } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const canSubmit = name.trim() !== '' && emailRegex.test(email) && message.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, organization, message, source: 'contact' }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to send message. Please try again.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-5">
          <span className="text-white text-xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Message sent.</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          We&apos;ve received your message and will get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className="block text-zinc-400 text-xs mb-1.5">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-zinc-400 text-xs mb-1.5">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="organization" className="block text-zinc-400 text-xs mb-1.5">
          Organization
        </label>
        <input
          id="organization"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-zinc-400 text-xs mb-1.5">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm p-4 outline-none focus:border-red-600 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || status === 'submitting'}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
