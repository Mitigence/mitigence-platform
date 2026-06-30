import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Delivery Models',
  description: 'Five ways to work with Mitigence â€” from one-time assessments to strategic partnerships.',
}

export default function DeliveryModelsPage() {
  return (
    <PageShell
      title="Delivery Models"
      description="Five engagement models: one-time assessment, project delivery, dedicated specialists, managed operations, and strategic partnership. Each one explained â€” team, timeline, reporting, meetings, workspace, and deliverables â€” so you know exactly what you're entering into."
    />
  )
}
