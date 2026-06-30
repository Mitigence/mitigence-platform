'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  slowTransition,
} from '@/lib/animations'

/* ─────────────────────────────────────────
   Shared helpers
───────────────────────────────────────── */

function RedAccentLine() {
  return <div className="w-8 h-0.5 bg-red-600 mb-6" />
}

function useScrollRef() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return { ref, inView }
}

/* ─────────────────────────────────────────
   Section 6 — The Expertise Behind Every Engagement
───────────────────────────────────────── */

const teamRoles = [
  {
    title: 'Security Architects',
    description:
      'Design resilient security programs across cloud, identity, network, and application environments. Architecture that reflects your actual risk profile.',
  },
  {
    title: 'Offensive Security Specialists',
    description:
      'Penetration testers, red team operators, and application security assessors who find what automated tools miss.',
  },
  {
    title: 'Security Operations Engineers',
    description:
      'Detection engineers, SOC builders, and threat hunters who turn monitoring into operational capability.',
  },
  {
    title: 'Security Advisors',
    description:
      'vCISO-level guidance, governance frameworks, security strategy, and board-level advisory for organizations that need executive security leadership.',
  },
]

function TeamBuilderSection() {
  const { ref, inView } = useScrollRef()

  return (
    <section id="team-builder" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <RedAccentLine />
        <h2 className="text-3xl font-bold text-white mb-3">
          The Expertise Behind Every Engagement
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Mitigence brings the right specialists to your program — without the overhead of building
          a full internal team.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {teamRoles.map((role) => (
            <motion.div
              key={role.title}
              variants={staggerItem}
              transition={slowTransition}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-600 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 mb-4" />
              <h3 className="text-white font-semibold text-base mb-2">
                {role.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {role.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <p className="text-zinc-400 max-w-xl">
            Every engagement is staffed with engineers who have done this work — not generalists
            reading from a playbook.
          </p>
          <a
            href="/engineering"
            className="shrink-0 text-red-500 hover:text-red-400 font-medium transition-colors whitespace-nowrap"
          >
            Explore our capabilities →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section 7 — The Engineering Lifecycle
───────────────────────────────────────── */

const lifecycleSteps = [
  {
    number: '01',
    name: 'DISCOVER',
    description: 'Asset inventory, threat modeling, gap analysis, and risk prioritization',
  },
  {
    number: '02',
    name: 'DESIGN',
    description: 'Security architecture, control mapping, and program roadmap creation',
  },
  {
    number: '03',
    name: 'IMPLEMENT',
    description: 'Hands-on engineering, configuration, integration, and hardening',
  },
  {
    number: '04',
    name: 'VALIDATE',
    description: 'Testing, red team exercises, control verification, and health checks',
  },
  {
    number: '05',
    name: 'IMPROVE',
    description: 'Continuous monitoring, optimization cycles, and program evolution',
  },
]

function EngineeringLifecycleSection() {
  const { ref, inView } = useScrollRef()

  return (
    <section
      id="engineering-lifecycle"
      className="border-b border-zinc-900 py-24 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RedAccentLine />
        <h2 className="text-3xl font-bold text-white mb-3">
          The Engineering Lifecycle
        </h2>
        <p className="text-zinc-400 text-lg mb-16 max-w-2xl">
          A structured process that turns security goals into engineered outcomes — from discovery
          through continuous improvement.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="relative flex flex-col gap-0"
        >
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-px bg-red-600/30 hidden sm:block" />

          {lifecycleSteps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              transition={{ ...slowTransition, delay: index * 0.1 }}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              {/* Step number circle */}
              <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-black border border-red-600 items-center justify-center hidden sm:flex">
                <span className="text-red-600 text-xs font-bold">
                  {step.number}
                </span>
              </div>

              {/* Step content */}
              <div className="pt-1 sm:pt-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-red-600 text-xs font-bold tracking-widest sm:hidden">
                    {step.number}
                  </span>
                  <span className="text-white font-bold tracking-wider text-sm uppercase">
                    {step.name}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section 8 — How We Engage (4 Delivery Models)
───────────────────────────────────────── */

const deliveryModels = [
  {
    badge: 'One-Time',
    title: 'Project Engagements',
    description:
      'Fixed-scope engagements for defined security objectives — assessments, implementations, architecture reviews, and validations. Clear milestones, defined deliverables, formal project governance.',
  },
  {
    badge: 'Ongoing',
    title: 'Managed Engineering Programs',
    description:
      'Continuous engineering support with scheduled reviews, health checks, configuration validation, and operational optimization. Strategic advisory included. Recurring engineering cadence.',
  },
  {
    badge: 'Integrated',
    title: 'Embedded Security Engineering',
    description:
      'Mitigence engineers work directly alongside your team — integrated into sprints, pipelines, and operations. Flexible duration, knowledge transfer included, works with your existing staff.',
  },
  {
    badge: 'Executive',
    title: 'Strategic Advisory Programs',
    description:
      'vCISO-level guidance for organizations that need executive security leadership without a full-time hire. Covers governance, board advisory, security strategy, roadmap development, and investment prioritization.',
  },
]

function DeliveryModelsSection() {
  const { ref, inView } = useScrollRef()

  return (
    <section
      id="delivery-models"
      className="border-b border-zinc-900 py-24 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RedAccentLine />
        <h2 className="text-3xl font-bold text-white mb-3">
          Choose How You&apos;d Like to Engage
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Every organization has different needs and buying patterns. Mitigence works within yours.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {deliveryModels.map((model) => (
            <motion.div
              key={model.title}
              variants={staggerItem}
              transition={slowTransition}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors flex flex-col"
            >
              {/* Red top border accent */}
              <div className="h-0.5 bg-red-600 w-full" />

              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block bg-red-600/10 text-red-500 border border-red-600/20 text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded mb-4 self-start">
                  {model.badge}
                </span>
                <h3 className="text-white font-bold text-lg mb-3">
                  {model.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-6">
                  {model.description}
                </p>
                <a
                  href="/platform/engineer/delivery-models"
                  className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                >
                  Learn more →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Section 9 — Capability Explorer
───────────────────────────────────────── */

const capabilities = [
  {
    title: 'Security Assessments',
    description: 'Infrastructure, cloud, application, identity, and endpoint security assessments',
    href: '/solutions/assess',
  },
  {
    title: 'Penetration Testing',
    description: 'External, internal, web, mobile, API, network, and red team exercises',
    href: '/solutions/assess',
  },
  {
    title: 'Security Architecture',
    description: 'Zero Trust design, enterprise security architecture, hybrid infrastructure',
    href: '/solutions/engineer',
  },
  {
    title: 'Security Operations',
    description: 'SOC build, detection engineering, use case development, threat hunting',
    href: '/solutions/operate',
  },
  {
    title: 'Incident Response',
    description: 'IR planning, tabletop exercises, cyber crisis simulation, ransomware readiness',
    href: '/solutions/operate',
  },
  {
    title: 'Security Validation',
    description: 'Control validation, health checks, post-implementation reviews, remediation validation',
    href: '/solutions/validate',
  },
]

function CapabilityExplorerSection() {
  const { ref, inView } = useScrollRef()

  return (
    <section
      id="capability-explorer"
      className="border-b border-zinc-900 py-24 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RedAccentLine />
        <h2 className="text-3xl font-bold text-white mb-3">
          Explore Security Capabilities
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Not every organization needs the same controls. Explore by what matters to your program.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
        >
          {capabilities.map((cap) => (
            <motion.a
              key={cap.title}
              href={cap.href}
              variants={staggerItem}
              transition={slowTransition}
              className="group bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-red-600/50 hover:bg-zinc-900/80 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">
                  {cap.title}
                </h3>
                <span className="text-zinc-600 group-hover:text-red-500 text-sm transition-colors ml-2 shrink-0">
                  →
                </span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {cap.description}
              </p>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          transition={{ ...slowTransition, delay: 0.5 }}
        >
          <a
            href="/solutions"
            className="text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            View all capabilities →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Export: all 4 sections composed
───────────────────────────────────────── */

export default function HomeSections2() {
  return (
    <>
      <TeamBuilderSection />
      <EngineeringLifecycleSection />
      <DeliveryModelsSection />
      <CapabilityExplorerSection />
    </>
  )
}
