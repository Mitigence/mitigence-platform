import type { Metadata } from 'next'
import { SecurityJourneyDesigner } from '@/components/security-journey/SecurityJourneyDesigner'

export const metadata: Metadata = {
  title: 'Security Journey Designer',
  description: 'Discover where your organization is today and design a roadmap to where you want to be.',
  alternates: {
    canonical: '/platform/understand/security-journey',
  },
}

export default function SecurityJourneyPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Security Journey Designer</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Select your current security maturity level, define where you want to be, and receive a
          tailored roadmap — from assessment through engineering, operations, and continuous
          improvement.
        </p>
        <SecurityJourneyDesigner />
      </div>
    </main>
  )
}
