'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations'

// ─── Section 10: Transparent Delivery ────────────────────────────────────────

const workspaceFeatures = [
  {
    title: 'Live Project Dashboard',
    description:
      'Track milestones, deliverables, and engineering progress in real time — not via a quarterly report.',
  },
  {
    title: 'Findings & Remediation',
    description:
      'Prioritized findings with engineering guidance. Not just a PDF — a path to resolution.',
  },
  {
    title: 'Direct Engineer Access',
    description:
      'Direct access to your Mitigence engineers throughout the engagement. Not a ticketing queue.',
  },
  {
    title: 'Living Security Roadmap',
    description:
      'A roadmap that evolves as your program matures — updated at every review cycle.',
  },
]

function CustomerWorkspace() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="transparent-delivery" className="border-b border-zinc-900 py-24 bg-black">
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
            No more black boxes. You see the scope, the timeline, the progress, and the outcomes —
            throughout the entire engagement.
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
          <p className="text-zinc-500 text-sm">
            Transparent delivery is built into every engagement model — not an add-on.
          </p>
          <a
            href="/consultation"
            className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Talk to an engineer →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 11: Outcomes ─────────────────────────────────────────────────────

const outcomeStories = [
  {
    industry: 'Financial Services',
    challenge:
      'Privileged access sprawl across a hybrid environment, with insufficient detection coverage and high alert fatigue.',
    outcome:
      'Identity architecture redesigned, PAM controls implemented, detection rule library built — alert fatigue reduced, coverage extended across hybrid environment.',
    tags: ['Identity', 'Detection Engineering'],
  },
  {
    industry: 'Healthcare',
    challenge:
      'Legacy systems with unpatched vulnerabilities and no formal incident response process, creating compliance and operational risk.',
    outcome:
      'Vulnerability management program established, incident response playbooks deployed, security posture aligned to compliance requirements.',
    tags: ['Vulnerability Management', 'IR Readiness'],
  },
  {
    industry: 'Technology',
    challenge:
      'Rapid cloud expansion without security architecture review — APIs exposed, IAM misconfigured, attack surface growing faster than controls.',
    outcome:
      'Cloud security architecture designed, API security hardened, IAM posture corrected — attack surface systematically reduced.',
    tags: ['Cloud Security', 'Application Security'],
  },
]

function SuccessStories() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="outcomes" className="border-b border-zinc-900 py-24 bg-black">
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
            What Structured Security Engineering Achieves
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-12">
            Representative outcomes from the kind of programs Mitigence is built to deliver.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {outcomeStories.map((story) => (
            <motion.div
              key={story.industry}
              variants={staggerItem}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-zinc-900 rounded-lg border-t-2 border border-zinc-800 border-t-red-600 overflow-hidden hover:border-zinc-700 transition-colors flex flex-col"
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
            href="/consultation"
            className="text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            Discuss your security objectives →
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
      'A structured approach to understanding your risks, selecting the right controls, and building a continuous improvement cycle.',
    href: '/knowledge/security-program',
  },
  {
    label: 'FRAMEWORK',
    title: 'The Mitigence Engineering Lifecycle',
    description:
      'How Mitigence structures security engagements — from discovery through deployment and continuous improvement.',
    href: '/knowledge/engineering-lifecycle',
  },
  {
    label: 'GUIDE',
    title: 'Vendor-Neutral Security Architecture',
    description:
      'How to evaluate, select, and integrate security platforms based on your requirements — not a vendor relationship.',
    href: '/knowledge/vendor-neutral-architecture',
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
            Practical Security Knowledge
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-12">
            Written by engineers who build security programs — not marketing copy.
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
