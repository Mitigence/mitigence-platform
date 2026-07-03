'use client'

import { motion } from 'framer-motion'

interface PageShellProps {
  title: string
  description: string
  phase?: string
  module?: string
}

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function PageShell({ title, description, phase, module }: PageShellProps) {
  return (
    <main className="min-h-screen pt-24 bg-black relative overflow-hidden">
      {/* Futuristic backdrop: animated grid + red glow */}
      <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />

      <motion.div
        className="max-w-7xl mx-auto px-6 py-16 relative"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <div className="w-8 h-0.5 bg-red-600 mb-6 cyber-divider" />
        <motion.h1 variants={item} className="text-4xl font-bold text-white mb-4">
          {title}
        </motion.h1>
        <motion.p variants={item} className="text-zinc-400 text-lg max-w-2xl">
          {description}
        </motion.p>
        {(phase || module) && (
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {phase && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                {phase}
              </span>
            )}
            {module && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-red-500 border border-zinc-800">
                {module}
              </span>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
