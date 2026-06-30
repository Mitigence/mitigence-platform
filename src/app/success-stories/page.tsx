import type { Metadata } from 'next'
import { SuccessStoryExplorer } from '@/components/success-stories/SuccessStoryExplorer'

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Structured engagement narratives — not testimonials. Real security challenges, real engineering outcomes.',
  alternates: {
    canonical: '/success-stories',
  },
}

export default function SuccessStoriesPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Success Stories</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Structured engagement narratives, not marketing testimonials. Every story follows the
          same framework — challenge, approach, outcomes, and ongoing partnership. Filter by
          industry or objective to find ones relevant to you.
        </p>
        <SuccessStoryExplorer />
      </div>
    </main>
  )
}
