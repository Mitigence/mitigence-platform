import type { Metadata } from 'next'
import { DeliveryModelExplorer } from '@/components/delivery-models/DeliveryModelExplorer'

export const metadata: Metadata = {
  title: 'Delivery Models',
  description: 'Five ways to work with Mitigence — from one-time assessments to strategic partnerships.',
  alternates: {
    canonical: '/platform/engineer/delivery-models',
  },
}

export default function DeliveryModelsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Delivery Models</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Choose how you&apos;d like to work with us. Five engagement models — from a focused
          one-time assessment to an ongoing managed engineering program. Each one explained so you
          know exactly what you&apos;re entering into.
        </p>
        <DeliveryModelExplorer />
      </div>
    </main>
  )
}
