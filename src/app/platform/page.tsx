import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'The Platform',
  description: 'Understand, Engineer, and Operate your cybersecurity program through the Mitigence Experience Platform.',
  alternates: { canonical: '/platform' },
}

const experiences = [
  {
    phase: 'Understand',
    description: 'Map your environment, assess your maturity, and identify where your program needs to go.',
    links: [
      { label: 'Enterprise Explorer', href: '/platform/understand/enterprise-explorer', description: 'Explore your digital domain landscape' },
      { label: 'Security Journey Designer', href: '/platform/understand/security-journey', description: 'Assess and map your maturity level' },
    ],
  },
  {
    phase: 'Engineer',
    description: 'Design your engagement, build your team, and understand exactly how Mitigence delivers.',
    links: [
      { label: 'Engagement Studio', href: '/platform/engineer/engagement-studio', description: 'Define scope, objectives, and timeline' },
      { label: 'Team Builder', href: '/platform/engineer/team-builder', description: 'Select specialist pods for your program' },
      { label: 'Capability Explorer', href: '/platform/engineer/capability-explorer', description: 'Explore security capabilities by domain' },
      { label: 'Engineering Studio', href: '/platform/engineer/engineering-studio', description: 'See how we structure delivery' },
      { label: 'Delivery Models', href: '/platform/engineer/delivery-models', description: 'Choose how you engage with Mitigence' },
    ],
  },
  {
    phase: 'Operate',
    description: 'Track progress, review findings, and continuously improve your security program.',
    links: [
      { label: 'Customer Workspace', href: '/platform/operate/customer-workspace', description: 'Your live engagement dashboard' },
      { label: 'Project Timeline', href: '/platform/operate/project-timeline', description: 'Milestones and delivery tracking' },
      { label: 'Reports', href: '/platform/operate/reports', description: 'Findings and remediation reporting' },
      { label: 'Continuous Improvement', href: '/platform/operate/continuous-improvement', description: 'Evolve your program over time' },
    ],
  },
]

export default function PlatformPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">The Mitigence Platform</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-16 leading-relaxed">
          Three interconnected experiences — Understand, Engineer, and Operate — that guide
          organizations from discovery to continuous improvement.
        </p>

        <div className="space-y-16">
          {experiences.map((exp, i) => (
            <div key={exp.phase}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-red-600 tracking-widest">0{i + 1}</span>
                <h2 className="text-2xl font-bold text-white">{exp.phase}</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-6 max-w-xl">{exp.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exp.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-5 transition-colors duration-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-3 transition-colors" />
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-red-400 transition-colors">{link.label}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-wrap gap-4">
          <Link href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Start in Engagement Studio →
          </Link>
          <Link href="/consultation" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Talk to a specialist
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Platform', path: '/platform' },
      ])) }} />
    </main>
  )
}
