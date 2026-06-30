import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Mitigence.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Contact Mitigence</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Get in touch with the Mitigence team. Whether you have a specific security challenge,
          want to explore an engagement, or simply want to understand how we work — we&apos;re
          here.
        </p>
        <ContactForm />
      </div>
    </main>
  )
}
