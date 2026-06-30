import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Delivery Framework',
  description: 'The structured framework Mitigence uses to plan, execute, and continuously improve every engagement.',
  alternates: {
    canonical: '/platform/engineer/delivery-framework',
  },
}

export default function DeliveryFrameworkPage() {
  return (
    <PageShell
      title="Delivery Framework"
      description="Every Mitigence engagement follows a structured delivery framework — from initial assessment through engineering, validation, operations, and continuous improvement. Understand the process before the first conversation."
    />
  )
}
