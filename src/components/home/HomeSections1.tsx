'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  slideInLeft,
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
  { value: '68%', label: 'of breaches involve a human element — not just malware' },
  { value: '277 days', label: 'average time to identify and contain a data breach' },
  { value: '$4.88M', label: 'average cost of a data breach globally in 2024' },
]

const bullets = [
  'Engineering, not just advice — we design, implement, and validate',
  'Vendor-neutral by design — no product commissions, no hidden agendas',
  'Lifecycle delivery — from assessment through continuous improvement',
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
            Security Has Become More Connected — and More Complex.
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
// Section 3 — The 5 Pillars
// ---------------------------------------------------------------------------
const pillars = [
  {
    number: '01',
    title: 'Assess',
    description:
      'Understand your risk surface before committing to controls. Infrastructure assessments, penetration testing, architecture reviews, maturity evaluations, and threat modeling.',
    href: '/solutions/assess',
  },
  {
    number: '02',
    title: 'Engineer',
    description:
      'Design and implement security that fits your actual architecture. Vendor-neutral engineering across cloud, identity, network, application, and data security.',
    href: '/solutions/engineer',
  },
  {
    number: '03',
    title: 'Validate',
    description:
      'Test what was built. Verify what was claimed. Fix what is broken. Configuration validation, control testing, health checks, and deployment verification.',
    href: '/solutions/validate',
  },
  {
    number: '04',
    title: 'Operate',
    description:
      'Continuous monitoring, detection engineering, incident readiness, and operational optimization — keeping your program running and improving.',
    href: '/solutions/operate',
  },
  {
    number: '05',
    title: 'Evolve',
    description:
      'Strategic roadmaps, maturity improvement programs, vCISO advisory, and long-term partnerships that grow your security posture over time.',
    href: '/solutions/evolve',
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
            One Platform. Five Outcomes.
          </h2>
          <p className="text-zinc-400 text-base mb-12 max-w-2xl">
            Every Mitigence engagement maps to one or more of these pillars. Start where your
            program needs it most.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={staggerItem}
              transition={slowTransition}
            >
              <Link
                href={pillar.href}
                className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200 h-full"
              >
                <div className="text-xs font-bold text-red-600 tracking-widest mb-3">
                  {pillar.number}
                </div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-red-500 transition-colors tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">{pillar.description}</p>
                <span className="text-red-600 text-sm font-medium">Explore {pillar.title} →</span>
              </Link>
            </motion.div>
          ))}
          {/* Sixth card — CTA */}
          <motion.div variants={staggerItem} transition={slowTransition}>
            <Link
              href="/consultation"
              className="group block bg-red-600/5 border border-red-600/20 hover:bg-red-600/10 hover:border-red-600/40 rounded-lg p-6 transition-colors duration-200 h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-0.5 bg-red-600 mb-6" />
                <h3 className="text-white font-bold text-xl mb-3">
                  Not sure where to start?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Talk to a Mitigence engineer. No sales script — a focused conversation about
                  your environment and objectives.
                </p>
              </div>
              <span className="text-red-500 text-sm font-medium mt-6 block">
                Book a strategy session →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 4 — Why Traditional Security Programs Fail
// ---------------------------------------------------------------------------
const failurePoints = [
  {
    title: 'Fragmented Vendors',
    description:
      'Tools purchased in isolation. No integration, no shared context, no unified program.',
  },
  {
    title: 'Compliance-Only Focus',
    description:
      'Passing audits is not the same as being secure. Checkbox security leaves real gaps uncovered.',
  },
  {
    title: 'Reports Without Engineering',
    description:
      'Assessments that find problems but provide no path to fix them. Findings that sit in a PDF.',
  },
  {
    title: 'Black-Box Delivery',
    description:
      'No visibility into scope, timelines, or progress. You pay and wait — then receive a document.',
  },
]

function AttackSurfaceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="why-programs-fail" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={slowTransition}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Why Most Security Programs Don&apos;t Deliver
          </h2>
          <p className="text-zinc-400 text-base mb-12 max-w-xl">
            The problem is rarely the budget. It&apos;s the approach.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          {failurePoints.map((point, i) => (
            <motion.div
              key={point.title}
              variants={staggerItem}
              transition={{ ...slowTransition, delay: i * 0.08 }}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-6"
            >
              <div className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-3">
                0{i + 1}
              </div>
              <h3 className="text-white font-semibold text-sm mb-3 leading-snug">{point.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.4 }}
        >
          <p className="text-zinc-400 text-sm">
            Mitigence addresses all four. Engineering-led, transparent, and outcome-driven.
          </p>
          <Link
            href="/platform"
            className="text-red-600 hover:text-red-500 text-sm font-medium transition-colors whitespace-nowrap"
          >
            See how we work →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 5 — The Mitigence Approach (5-phase journey)
// ---------------------------------------------------------------------------
const phases = [
  {
    number: '01',
    name: 'ASSESS',
    description: 'Map your environment, evaluate risks, and establish your security baseline.',
  },
  {
    number: '02',
    name: 'ENGINEER',
    description: 'Design and implement controls built for your specific architecture.',
  },
  {
    number: '03',
    name: 'VALIDATE',
    description: 'Test controls, verify configurations, and confirm deployment effectiveness.',
  },
  {
    number: '04',
    name: 'OPERATE',
    description: 'Continuous monitoring, detection engineering, and operational readiness.',
  },
  {
    number: '05',
    name: 'EVOLVE',
    description: 'Strategic roadmaps, maturity programs, and long-term security improvement.',
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
          <h2 className="text-3xl font-bold text-white mb-4">The Mitigence Approach</h2>
          <p className="text-zinc-400 text-base mb-16 max-w-2xl">
            A structured journey from initial assessment to continuous improvement. Every engagement
            follows this framework — tailored to your environment at each stage.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.name}
                variants={staggerItem}
                transition={{ ...slowTransition, delay: i * 0.12 }}
                className="flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-5 text-white font-bold text-sm flex-shrink-0">
                  {phase.number}
                </div>
                <h3 className="text-white font-bold text-base mb-2 tracking-wider">{phase.name}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.7 }}
        >
          <p className="text-zinc-300 text-base">
            Mitigence covers all five stages — together, not in silos.
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
