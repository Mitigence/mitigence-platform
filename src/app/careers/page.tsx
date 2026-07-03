import type { Metadata } from 'next'
import { breadcrumbJsonLd } from '@/lib/seo'
import { CareerForm } from '@/components/careers/CareerForm'

export const metadata: Metadata = {
  title: 'Careers at Mitigence',
  description: "Join Mitigence — we're looking for engineers who want to make cybersecurity clearer and more effective.",
  alternates: {
    canonical: '/careers',
  },
}

const values = [
  { title: 'Engineering depth', description: 'We do the work, not just the advisory. If you want to stay close to implementation, you will here.' },
  { title: 'Clarity over jargon', description: 'We communicate in plain terms — with clients and with each other. Precision matters more than vocabulary.' },
  { title: 'Outcomes over activity', description: 'Our success is measured by what clients achieve, not by hours billed or slides delivered.' },
  { title: 'Continuous improvement', description: 'We iterate — on our methodologies, our tooling, and our own skills. Stagnation is not in the plan.' },
]

export default function CareersPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Careers at Mitigence</h1>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          We are a small team with high standards. If you are tired of checkbox security and want
          to do the real work — designing, implementing, and validating security programs that
          actually reduce risk — we would like to hear from you.
        </p>

        <div className="rounded-lg border border-red-600/20 bg-red-600/5 p-6 mb-10">
          <p className="text-zinc-300 text-sm leading-relaxed">
            We do not post roles speculatively. If you believe you could contribute to a delivery
            team that takes engineering seriously, send us a message and tell us what you do well.
            We will tell you honestly whether there is a fit.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">What we value</h2>
        <div className="space-y-6 mb-10">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="text-white font-semibold mb-1">{v.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-900 pt-8">
          <h2 className="text-2xl font-bold text-white mb-2">Send a career enquiry</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Tell us about yourself and attach your resume — it goes straight to our hiring team.
          </p>
          <CareerForm />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Careers', path: '/careers' },
      ])) }} />
    </main>
  )
}
