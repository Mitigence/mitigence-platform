import type { Metadata } from 'next'
import { TeamBuilder } from '@/components/team-builder/TeamBuilder'

export const metadata: Metadata = {
  title: 'Team Builder',
  description: 'Assemble specialist capability pods and understand how your delivery team is structured.',
  alternates: {
    canonical: '/platform/engineer/team-builder',
  },
}

export default function TeamBuilderPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Team Builder</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Cybersecurity is delivered by coordinated expertise, not isolated services. Select the
          capability pods your engagement needs — and see how your delivery team takes shape, what
          they deliver, and how they&apos;ll work with you.
        </p>
        <TeamBuilder />
      </div>
    </main>
  )
}
