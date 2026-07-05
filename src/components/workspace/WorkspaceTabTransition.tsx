'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'

interface WorkspaceTabTransitionProps {
  tabKey: string
  children: React.ReactNode
}

export function WorkspaceTabTransition({ tabKey, children }: WorkspaceTabTransitionProps) {
  return (
    <div className="p-6 min-h-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={tabKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={defaultTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
