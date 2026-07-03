import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Threat Insights',
  description: 'A clear view of the modern threat landscape — attack paths, common vectors, evolving techniques, and how they map to your environment.',
  alternates: { canonical: '/platform/understand/threat-insights' },
}

const threats = [
  { domain: 'Identity & Access', description: 'Credential theft, MFA fatigue, privilege escalation, and lateral movement via identity are the leading attack vectors across all sectors.', href: '/knowledge/identity' },
  { domain: 'Cloud Infrastructure', description: 'Misconfigured storage, overpermissioned roles, exposed APIs, and unmonitored workloads create persistent attack surface in cloud environments.', href: '/knowledge/cloud' },
  { domain: 'Applications', description: 'Injection, broken access control, API vulnerabilities, and insecure deserialization remain consistently exploited across web and mobile applications.', href: '/knowledge/applications' },
  { domain: 'Ransomware & Incident Response', description: 'Ransomware actors exploit unpatched systems, poor segmentation, and weak backup practices. Detection and containment capability determines recovery time.', href: '/knowledge/incident-response' },
  { domain: 'Network Perimeter', description: 'Exposed services, legacy protocols, and insufficient segmentation allow attackers to move freely once initial access is achieved.', href: '/knowledge/network' },
  { domain: 'Security Monitoring Gaps', description: 'Low detection coverage, untuned rules, and alert fatigue mean most organizations cannot see attacks in progress — only after the fact.', href: '/knowledge/monitoring' },
]

export default function ThreatInsightsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Threat Insights</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed max-w-2xl">
          A clear view of the modern threat landscape — attack paths, common vectors, and evolving
          techniques mapped to your environment. Education-first, without the fear-based messaging.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {threats.map((t) => (
            <Link key={t.href} href={t.href}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-3 transition-colors" />
              <h2 className="text-white font-semibold mb-2 text-sm group-hover:text-red-400 transition-colors">{t.domain}</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">{t.description}</p>
              <span className="text-red-600 text-xs font-medium mt-3 block">Explore →</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/platform/understand/security-journey" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Assess your exposure →
          </Link>
          <Link href="/platform/engineer/engagement-studio" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement
          </Link>
        </div>
      </div>
    </main>
  )
}
