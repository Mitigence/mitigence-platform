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
   Section 6 — Build Your Cybersecurity Team
───────────────────────────────────────── */

const teamRoles = [
  {
    title: 'Security Architects',
    description: 'Design resilient security frameworks across your full stack.',
  },
  {
    title: 'Penetration Testers',
    description: 'Adversarial testing that finds what automated tools miss.',
  },
  {
    title: 'Compliance Engineers',
    description: 'Translate regulatory requirements into operational controls.',
  },
  {
    title: 'Detection Engineers',
    description:
      'Build detection logic tuned to your environment, not generic rulesets.',
  },
]

function TeamBuilderSection() {
  const { ref, inView } = useScrollRef()

  return (
    <section id="team-builder" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <RedAccentLine />
        <h2 className="text-3xl font-bold text-white mb-3">
          Build Your Cybersecurity Team
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          The right expertise, scoped to your environment.
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
            Mitigence brings specialized roles to your program — without the
            overhead of building a full internal team.
          </p>
          <a
            href="/engineering"
            className="shrink-0 text-red-500 hover:text-red-400 font-medium transition-colors whitespace-nowrap"
          >
            Explore engineering roles →
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
    description: 'Asset inventory, threat modeling, gap analysis',
  },
  {
    number: '02',
    name: 'DESIGN',
    description: 'Architecture review, control mapping, roadmap creation',
  },
  {
    number: '03',
    name: 'IMPLEMENT',
    description: 'Hands-on engineering, configuration, integration',
  },
  {
    number: '04',
    name: 'VALIDATE',
    description: 'Testing, red team exercises, control verification',
  },
  {
    number: '05',
    name: 'IMPROVE',
    description: 'Continuous monitoring, retrospectives, program evolution',
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
          A structured process that turns security goals into engineered
          outcomes — from discovery through continuous improvement.
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
              <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-black border border-red-600 flex items-center justify-center hidden sm:flex">
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
   Section 8 — Delivery Models
───────────────────────────────────────── */

const deliveryModels = [
  {
    badge: 'One-time',
    title: 'Project Engagements',
    description:
      'Scoped, time-bound engagements for specific assessments, implementations, or audits. Clear deliverables, defined timelines.',
  },
  {
    badge: 'Monthly',
    title: 'Retainer Programs',
    description:
      'Ongoing security engineering support on a monthly basis. Priority access, recurring deliverables, continuous improvement.',
  },
  {
    badge: 'Ongoing',
    title: 'Embedded Engineering',
    description:
      'Mitigence engineers work alongside your team — integrated into sprints, pipelines, and operations.',
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
          Choose How You&apos;d Like to Work With Us
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Every organization engages differently. Pick the model that fits
          your program.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
    title: 'Application Security',
    description: 'Code review, SAST/DAST, API security, secure SDLC',
    href: '/solutions/applications',
  },
  {
    title: 'Cloud Security',
    description: 'Architecture review, IAM, misconfiguration remediation',
    href: '/solutions/cloud',
  },
  {
    title: 'Identity & Access',
    description: 'MFA, PAM, SSO, directory hardening',
    href: '/solutions/identity',
  },
  {
    title: 'Security Monitoring',
    description: 'SIEM tuning, detection rules, alert triage',
    href: '/solutions/monitoring',
  },
  {
    title: 'Endpoint Protection',
    description: 'EDR configuration, policy hardening, response playbooks',
    href: '/solutions/endpoints',
  },
  {
    title: 'Network Security',
    description: 'Segmentation, firewall review, traffic analysis',
    href: '/solutions/network',
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
          Not every organization needs the same controls. Explore by what
          matters to you.
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
