'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { staggerContainer, staggerItem, slowTransition } from '@/lib/animations'
import knowledgeData from '@/data/knowledge.json'

export function KnowledgeHub() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {knowledgeData.topics.map((topic) => (
        <motion.div key={topic.id} variants={staggerItem} transition={slowTransition}>
          <Link
            href={`/knowledge/${topic.slug}`}
            className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200 h-full"
          >
            <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-4 transition-colors" />
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-500 transition-colors tracking-tight">
              {topic.name}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-4">{topic.tagline}</p>
            <span className="text-red-600 text-sm font-medium">Read guide →</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
