import type { Metadata } from 'next'
import { EngagementStudio } from '@/components/engagement-studio/EngagementStudio'

export const metadata: Metadata = {
  title: 'Engagement Studio',
  description: 'Design your cybersecurity engagement — objectives, environment, scope, timeline, and recommended journey.',
  alternates: {
    canonical: '/platform/engineer/engagement-studio',
  },
}

export default function EngagementStudioPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Engagement Studio</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Your digital consultant. Define your business context, security objectives, environment,
          and scope — and receive a structured engagement roadmap with recommended phases and
          suggested specialists. No PDF. No generic proposal.
        </p>
        <EngagementStudio />
      </div>
    </main>
  )
}
