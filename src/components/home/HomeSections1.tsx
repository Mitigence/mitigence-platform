'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
  slowTransition,
} from '@/lib/animations'

// ---------------------------------------------------------------------------
// Reusable scroll-trigger wrapper
// ---------------------------------------------------------------------------
function InViewSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Section 2 — Why Security Is Different
// ---------------------------------------------------------------------------
const stats = [
  { value: '68%', label: 'of breaches involve a non-malicious human element' },
  { value: '277 days', label: 'average time to identify and contain a data breach' },
  { value: '$3.86M', label: 'average cost of a data breach globally' },
]

const bullets = [
  'Threats evolve faster than annual assessments',
  'Compliance is a floor, not a ceiling',
  "Point solutions don't add up to a security program",
]

function WhySecuritySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="why-security-is-different" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={slowTransition}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-12">
            Security Has Become More Connected—and More Complex.
          </h2>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.value}
              variants={staggerItem}
              transition={slowTransition}
              className="border border-zinc-800 rounded-lg p-8 bg-zinc-950"
            >
              <div className="text-4xl font-bold text-red-600 mb-3 tracking-tight">
                {stat.value}
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.p
            className="text-zinc-300 text-base leading-relaxed"
            variants={slideInLeft}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            transition={{ ...slowTransition, delay: 0.2 }}
          >
            Security can&apos;t be bought off a shelf. It must be engineered to fit your
            environment, your risk profile, and your operational reality. That&apos;s why Mitigence
            builds programs — not just sells products.
          </motion.p>

          <motion.ul
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
          >
            {bullets.map((bullet) => (
              <motion.li
                key={bullet}
                variants={staggerItem}
                transition={slowTransition}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                <span className="text-zinc-300 text-sm leading-relaxed">{bullet}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 3 — Explore Your Digital Enterprise
// ---------------------------------------------------------------------------
const domainCards = [
  {
    title: 'Cloud Infrastructure',
    description: 'Secure your cloud environments across IaaS, PaaS, and SaaS workloads.',
    href: '/solutions/cloud',
  },
  {
    title: 'Applications & APIs',
    description: 'Identify vulnerabilities in code, APIs, and web-facing services.',
    href: '/solutions/applications',
  },
  {
    title: 'Identity & Access',
    description: 'Control who has access to what — and eliminate privilege sprawl.',
    href: '/solutions/identity',
  },
  {
    title: 'Network & Perimeter',
    description: 'Defend your network edge, segmentation, and east-west traffic.',
    href: '/solutions/network',
  },
  {
    title: 'Endpoints & Devices',
    description: 'Protect every device — managed, unmanaged, and remote.',
    href: '/solutions/endpoints',
  },
  {
    title: 'Security Monitoring',
    description: 'Gain visibility across your environment with continuous detection.',
    href: '/solutions/monitoring',
  },
]

function ExploreEnterpriseSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="explore-enterprise" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={slowTransition}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Every organization is different. Start with what you&apos;re protecting.
          </h2>
          <p className="text-zinc-400 text-base mb-12 max-w-2xl">
            Security programs are built around domains — not generic checklists. Choose the area
            most relevant to your environment and see how Mitigence approaches it.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {domainCards.map((card) => (
            <motion.div
              key={card.title}
              variants={staggerItem}
              transition={slowTransition}
            >
              <Link
                href={card.href}
                className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200"
              >
                {/* Icon placeholder */}
                <div className="w-10 h-10 rounded-md bg-red-600/10 border border-red-600/20 mb-5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-red-600/60" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2 group-hover:text-red-500 transition-colors">
                  {card.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">{card.description}</p>
                <span className="text-red-600 text-sm font-medium">Explore →</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 4 — Discover Your Attack Surface
// ---------------------------------------------------------------------------
const threatCategories = [
  {
    title: 'External Attack Surface',
    description: 'Internet-facing assets, exposed services, shadow IT',
  },
  {
    title: 'Identity Risk',
    description: 'Credential exposure, privilege sprawl, MFA gaps',
  },
  {
    title: 'Application Vulnerabilities',
    description: 'Code flaws, misconfigurations, dependency risks',
  },
  {
    title: 'Operational Gaps',
    description: 'Unpatched systems, detection blind spots, response delays',
  },
]

function AttackSurfaceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="attack-surface" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={slowTransition}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Discover Your Attack Surface</h2>
          <p className="text-zinc-400 text-base mb-12 max-w-xl">
            Before you can defend it, you need to see it.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {threatCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              variants={staggerItem}
              transition={{ ...slowTransition, delay: i * 0.08 }}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-6"
            >
              <div className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-3">
                0{i + 1}
              </div>
              <h3 className="text-white font-semibold text-sm mb-3 leading-snug">{cat.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{cat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="flex items-center gap-4"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.4 }}
        >
          <p className="text-zinc-400 text-sm">
            Not sure where to start? Start with what&apos;s exposed.
          </p>
          <Link
            href="/solutions/applications"
            className="text-red-600 hover:text-red-500 text-sm font-medium transition-colors whitespace-nowrap"
          >
            See Application Security →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 5 — Build Your Security Program
// ---------------------------------------------------------------------------
const phases = [
  {
    number: '01',
    name: 'UNDERSTAND',
    description: 'Map your environment, assess your risks, establish your baseline.',
  },
  {
    number: '02',
    name: 'ENGINEER',
    description:
      'Design and implement controls built for your specific architecture.',
  },
  {
    number: '03',
    name: 'OPERATE',
    description:
      'Continuous monitoring, improvement cycles, and transparent delivery.',
  },
]

function SecurityProgramSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="security-program" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={slowTransition}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Build Your Security Program</h2>
          <p className="text-zinc-400 text-base mb-16 max-w-2xl">
            A real security program has three interlocking phases. Most vendors only address one.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-zinc-800 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.name}
                variants={staggerItem}
                transition={{ ...slowTransition, delay: i * 0.15 }}
                className="flex flex-col"
              >
                {/* Number badge */}
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-6 text-white font-bold text-lg flex-shrink-0">
                  {phase.number}
                </div>
                <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                  Phase {phase.number}
                </div>
                <h3 className="text-white font-bold text-xl mb-3 tracking-tight">{phase.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer copy + link */}
        <motion.div
          className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.6 }}
        >
          <p className="text-zinc-300 text-base">
            Mitigence manages all three phases — together, not in silos.
          </p>
          <Link
            href="/platform"
            className="text-red-600 hover:text-red-500 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Explore the Platform →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------
export function HomeSections1() {
  return (
    <>
      <WhySecuritySection />
      <ExploreEnterpriseSection />
      <AttackSurfaceSection />
      <SecurityProgramSection />
    </>
  )
}
