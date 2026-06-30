import type { Metadata } from 'next'
import { ConsultationForm } from '@/components/consultation/ConsultationForm'

export const metadata: Metadata = {
  title: 'Schedule a Consultation',
  description: 'Schedule a strategy session with a Mitigence security specialist.',
  alternates: {
    canonical: '/consultation',
  },
}

export default function ConsultationPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Schedule a Strategy Session</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          A focused conversation about your environment and objectives — not a generic sales
          pitch. Tell us about your organization and what you&apos;re trying to achieve. We&apos;ll
          come prepared.
        </p>
        <ConsultationForm />
      </div>
    </main>
  )
}
