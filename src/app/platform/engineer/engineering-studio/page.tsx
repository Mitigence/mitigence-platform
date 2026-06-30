import type { Metadata } from 'next'
import { EngineeringStudio } from '@/components/engineering-studio/EngineeringStudio'

export const metadata: Metadata = {
  title: 'Engineering Studio',
  description: 'See exactly how Mitigence delivers — the engineering lifecycle from architecture to optimization.',
  alternates: {
    canonical: '/platform/engineer/engineering-studio',
  },
}

export default function EngineeringStudioPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Engineering Studio</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          The Mitigence delivery methodology, made visible. Nine engineering phases — from initial
          assessment to continuous improvement. Select any phase to see what we do, what we
          deliver, and how we work with you through it.
        </p>
        <EngineeringStudio />
      </div>
    </main>
  )
}
