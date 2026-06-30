'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations'

// ─── Section 10: Customer Workspace ──────────────────────────────────────────

const workspaceFeatures = [
  {
    title: 'Live Project Dashboard',
    description:
      'Track milestones, deliverables, and engineering progress in real time.',
  },
  {
    title: 'Findings & Remediation',
    description:
      'Prioritized findings with engineering guidance, not just a PDF report.',
  },
  {
    title: 'Team Communication',
    description:
      'Direct access to your Mitigence engineers — not a ticketing queue.',
  },
  {
    title: 'Improvement Roadmap',
    description:
      'A living roadmap that evolves with your security program.',
  },
]

function CustomerWorkspace() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="customer-workspace" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Security Journey, Visible at Every Stage
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-12">
            No more black boxes. Mitigence gives your team real-time visibility
            into every engagement.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {workspaceFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-zinc-900 rounded-lg p-6 flex flex-col gap-3 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-5 h-0.5 bg-red-600" />
              <h3 className="text-white font-semibold text-base leading-snug">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <p className="text-zinc-600 text-sm italic">
            Coming in Phase 4 — Early access available for active engagements.
          </p>
          <a
            href="/consultation"
            className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Request early access →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 11: Success Stories ─────────────────────────────────────────────

const successStories = [
  {
    industry: 'Financial Services',
    challenge:
      'Gaps in privileged access controls and insufficient detection coverage across a hybrid environment.',
    outcome:
      'PAM implementation, detection rule library built, 40% reduction in alert fatigue.',
    tags: ['Identity', 'Monitoring'],
  },
  {
    industry: 'Healthcare',
    challenge:
      'Legacy systems with unpatched vulnerabilities and no formal incident response process.',
    outcome:
      'Vulnerability program established, IR playbooks deployed, compliance posture improved.',
    tags: ['Endpoints', 'Compliance'],
  },
  {
    industry: 'Technology',
    challenge:
      'Rapid cloud expansion without security architecture review, exposing critical APIs.',
    outcome:
      'Cloud security architecture designed, API gateway hardened, attack surface reduced by 60%.',
    tags: ['Cloud', 'Applications'],
  },
]

function SuccessStories() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="success-stories" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Organizations That Chose a Different Path
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-12">
            Real engagements. Measurable outcomes.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {successStories.map((story) => (
            <motion.div
              key={story.industry}
              variants={staggerItem}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-zinc-900 rounded-lg border border-zinc-800 border-t-2 border-t-red-600 overflow-hidden hover:border-zinc-700 transition-colors flex flex-col"
            >
              <div className="p-6 flex flex-col gap-4 flex-1">
                <span className="text-red-500 text-xs font-semibold uppercase tracking-widest">
                  {story.industry}
                </span>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">
                    Challenge
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {story.challenge}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">
                    Outcome
                  </p>
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {story.outcome}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-zinc-500 text-xs border border-zinc-700 rounded px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a
            href="/success-stories"
            className="text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            View all success stories →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 12: Knowledge Center ────────────────────────────────────────────

const knowledgeResources = [
  {
    label: 'GUIDE',
    title: 'Building a Security Program From Scratch',
    description:
      'A structured approach to understanding your risks, selecting controls, and building a continuous improvement cycle.',
    href: '/knowledge/architecture',
  },
  {
    label: 'FRAMEWORK',
    title: 'The Mitigence Engineering Lifecycle',
    description:
      'How Mitigence approaches security engagements — from discovery to deployment to ongoing improvement.',
    href: '/knowledge/cloud',
  },
  {
    label: 'RESEARCH',
    title: 'Identity Security in 2025: What\'s Actually Working',
    description:
      'Patterns from real engagements: what identity controls are reducing risk and what\'s still failing.',
    href: '/knowledge/identity',
  },
]

function KnowledgeCenter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="knowledge-center" className="border-b border-zinc-900 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Would You Like to Understand?
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-12">
            Practical cybersecurity knowledge from engineers who build security programs.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {knowledgeResources.map((resource) => (
            <motion.a
              key={resource.title}
              href={resource.href}
              variants={staggerItem}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors p-6 flex flex-col gap-4 group"
            >
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded w-fit">
                {resource.label}
              </span>
              <h3 className="text-white font-semibold text-base leading-snug group-hover:text-red-400 transition-colors">
                {resource.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {resource.description}
              </p>
              <span className="text-red-500 text-sm font-medium group-hover:text-red-400 transition-colors">
                Read more →
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={fadeInUp}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a
            href="/knowledge"
            className="text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            Explore the Knowledge Center →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Composite export ─────────────────────────────────────────────────────────

export default function HomeSections3() {
  return (
    <>
      <CustomerWorkspace />
      <SuccessStories />
      <KnowledgeCenter />
    </>
  )
}
