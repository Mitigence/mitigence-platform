import type { Metadata } from 'next'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Mitigence collects, uses, and protects information submitted through this website.',
  alternates: {
    canonical: '/privacy',
  },
}

const sections = [
  {
    heading: 'Information We Collect',
    body: 'When you submit a contact form, schedule a consultation, or interact with our chatbot, we collect the information you provide — such as your name, email address, organization, and the details of your inquiry. We do not collect payment or financial information through this website.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use the information you submit to respond to your inquiry, schedule consultations, and follow up about potential engagements. We do not sell, rent, or share your information with third parties for marketing purposes.',
  },
  {
    heading: 'Analytics',
    body: 'This site uses Vercel Analytics to understand aggregate traffic patterns and improve site performance. This analytics service does not use cookies and does not track individuals across other websites.',
  },
  {
    heading: 'Data Retention',
    body: 'Information submitted through contact forms or the chatbot is retained only as long as necessary to respond to your inquiry and maintain a record of business communications.',
  },
  {
    heading: 'Your Rights',
    body: 'You may request access to, correction of, or deletion of any information you have submitted to us by contacting us at the email address below.',
  },
  {
    heading: 'Contact',
    body: 'Questions about this privacy policy can be sent to Business@mitigence.com.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Last updated: January 2026. This policy describes how Mitigence handles information
          submitted through mitigence.com.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-white font-semibold text-lg mb-2">{section.heading}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ])) }} />
    </main>
  )
}
