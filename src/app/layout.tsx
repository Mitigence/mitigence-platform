import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})
import { Analytics } from '@vercel/analytics/react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { LeadCaptureBot } from '@/components/chatbot/LeadCaptureBot'
import { MatrixBackground } from '@/components/effects/MatrixBackground'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://mitigence.com'),
  title: {
    default: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    template: '%s | Mitigence',
  },
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience through expert-led engagements and transparent delivery.',
  keywords: [
    'cybersecurity',
    'security engineering',
    'managed security',
    'penetration testing',
    'security architecture',
    'cloud security',
    'identity security',
  ],
  authors: [{ name: 'Mitigence' }],
  creator: 'Mitigence',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mitigence.com',
    siteName: 'Mitigence',
    title: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    description:
      'Expert-led cybersecurity engagements, managed operations, and transparent delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    description:
      'Expert-led cybersecurity engagements, managed operations, and transparent delivery.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Mitigence',
  url: 'https://mitigence.com',
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience through expert-led engagements and transparent delivery.',
  email: 'Business@mitigence.com',
  areaServed: 'Worldwide',
  serviceType: [
    'Cybersecurity Consulting',
    'Penetration Testing',
    'Security Architecture',
    'Managed Security Operations',
    'Incident Response',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${nunito.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <MatrixBackground />
        <Navigation />
        {children}
        <Footer />
        <Analytics />
        <LeadCaptureBot />
      </body>
    </html>
  )
}
