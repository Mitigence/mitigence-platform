'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
}

const item = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center border-b border-zinc-900 relative overflow-hidden scanline"
    >
      {/* Animated cyber grid + breathing red glow */}
      <div className="absolute inset-0 cyber-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />

      <motion.div
        className="max-w-7xl mx-auto px-6 py-24 w-full relative"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={item} className="flex items-center gap-3 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">
            Systems monitored · Threats engineered out
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
        >
          Cybersecurity Isn&apos;t One Service.
          <br />
          <span className="text-red-600">It&apos;s a Continuously Engineered Journey.</span>
        </motion.h1>

        <motion.p variants={item} className="text-zinc-400 text-xl max-w-2xl mb-10">
          Mitigence helps organizations discover risks, engineer resilient security
          architectures, strengthen operations, and continuously improve cyber resilience
          through expert-led engagements and transparent delivery.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link
            href="/platform/engineer/engagement-studio"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors cyber-glow-hover"
          >
            Build Your Security Program
          </Link>
          <Link
            href="/platform"
            className="border border-zinc-700 hover:border-red-600/60 text-zinc-300 hover:text-white font-medium px-6 py-3 rounded-md transition-colors cyber-glow-hover"
          >
            Explore the Platform
          </Link>
          <Link
            href="/consultation"
            className="text-zinc-500 hover:text-zinc-300 font-medium px-6 py-3 transition-colors"
          >
            Talk to a Security Expert →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
