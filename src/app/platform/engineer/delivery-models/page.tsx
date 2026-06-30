import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Delivery Models',
  description: 'Five ways to work with Mitigence — from one-time assessments to strategic partnerships.',
  alternates: {
    canonical: '/platform/engineer/delivery-models',
  },
}

export default function DeliveryModelsPage() {
  return (
    <PageShell
      title="Delivery Models"
      description="Five engagement models: one-time assessment, project delivery, dedicated specialists, managed operations, and strategic partnership. Each one explained — team, timeline, reporting, meetings, workspace, and deliverables — so you know exactly what you're entering into."
    />
  )
}
