'use client'

import { useState } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RESUME_BYTES = 3 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx']

export function CareerForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const canSubmit = name.trim() !== '' && emailRegex.test(email) && message.trim() !== ''

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const file = e.target.files?.[0] ?? null
    if (!file) { setResume(null); return }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError('Resume must be a PDF, DOC, or DOCX file.')
      e.target.value = ''
      setResume(null)
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      setError('Resume must be smaller than 3 MB.')
      e.target.value = ''
      setResume(null)
      return
    }
    setResume(file)
  }

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.slice(result.indexOf(',') + 1))
      }
      reader.onerror = () => reject(new Error('Could not read the resume file.'))
      reader.readAsDataURL(file)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setStatus('submitting')
    setError('')
    try {
      const payload: Record<string, unknown> = { name, email, role, message }
      if (resume) {
        payload.resume = { filename: resume.name, contentBase64: await toBase64(resume) }
      }

      const res = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to send enquiry. Please try again.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to send enquiry. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-5">
          <span className="text-white text-xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Enquiry sent.</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Thanks for reaching out. Our team will review your profile and get back to you honestly
          about whether there is a fit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="career-name" className="block text-zinc-400 text-xs mb-1.5">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="career-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="career-email" className="block text-zinc-400 text-xs mb-1.5">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="career-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="career-role" className="block text-zinc-400 text-xs mb-1.5">
          Role or specialty you&apos;re interested in
        </label>
        <input
          id="career-role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Cloud Security Engineer"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors placeholder:text-zinc-600"
        />
      </div>
      <div>
        <label htmlFor="career-message" className="block text-zinc-400 text-xs mb-1.5">
          Tell us what you do well <span className="text-red-600">*</span>
        </label>
        <textarea
          id="career-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm p-4 outline-none focus:border-red-600 transition-colors resize-none"
        />
      </div>
      <div>
        <label htmlFor="career-resume" className="block text-zinc-400 text-xs mb-1.5">
          Resume (PDF, DOC, or DOCX — max 3 MB)
        </label>
        <input
          id="career-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="w-full text-zinc-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:text-zinc-300 file:text-sm file:cursor-pointer hover:file:bg-zinc-800 file:transition-colors"
        />
        {resume && <p className="text-zinc-500 text-xs mt-1.5">Attached: {resume.name}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || status === 'submitting'}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer cyber-glow-hover"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  )
}
