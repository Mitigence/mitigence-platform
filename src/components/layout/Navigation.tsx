'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Nunito } from 'next/font/google'

const nunito = Nunito({ weight: ['700'], subsets: ['latin'], display: 'swap' })
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { navItems } from '@/data/navigation'
import type { NavItem } from '@/data/navigation'
import { megaMenuTransition } from '@/lib/animations'

export function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false)
      setActiveMenu(null)
    }, 0)
    return () => clearTimeout(id)
  }, [pathname])

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(label)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/98 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/logo-icon.webp"
                alt="Mitigence"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
              <span className={`${nunito.className} text-white text-xl`} style={{ letterSpacing: '0.01em' }}>Mitigence</span>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center">
              {navItems.map((item: NavItem) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.megaMenu ? handleMouseEnter(item.label) : undefined}
                  onMouseLeave={() => item.megaMenu ? handleMouseLeave() : undefined}
                >
                  <Link
                    href={item.href}
                    className={`
                      px-4 py-5 text-sm font-medium transition-colors inline-block
                      ${pathname.startsWith(item.href) && item.href !== '/'
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-white'
                      }
                    `}
                  >
                    {item.label}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {activeMenu === item.label && item.megaMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={megaMenuTransition}
                        className="absolute top-full left-0 pt-1 z-50"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div
                          className={`
                            bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-6
                            ${item.megaMenu.columns.length >= 3 ? 'min-w-[640px]' : 'min-w-[400px]'}
                          `}
                        >
                          <div
                            className={`grid gap-8`}
                            style={{ gridTemplateColumns: `repeat(${item.megaMenu.columns.length}, 1fr)` }}
                          >
                            {item.megaMenu.columns.map((column) => (
                              <div key={column.title}>
                                <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-4">
                                  {column.title}
                                </p>
                                <ul className="space-y-3">
                                  {column.items.map((navLink) => (
                                    <li key={navLink.label}>
                                      <Link
                                        href={navLink.href}
                                        className="group block"
                                      >
                                        <span className="text-zinc-200 text-sm font-medium group-hover:text-white transition-colors">
                                          {navLink.label}
                                        </span>
                                        {navLink.description && (
                                          <span className="block text-zinc-600 text-xs mt-0.5 group-hover:text-zinc-500 transition-colors">
                                            {navLink.description}
                                          </span>
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:block">
              <Link
                href="/consultation"
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                Talk to an Expert
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-zinc-400 hover:text-white transition-colors p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-zinc-950 border-l border-zinc-900 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-900">
                <span className="text-white font-semibold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 space-y-1">
                {navItems.map((item: NavItem) => (
                  <div key={item.label}>
                    {item.megaMenu ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full py-3 text-sm text-zinc-300 hover:text-white transition-colors"
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === item.label ? null : item.label
                            )
                          }
                        >
                          <span className="font-medium">{item.label}</span>
                          <motion.div
                            animate={{ rotate: mobileExpanded === item.label ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <ChevronRight size={16} className="text-zinc-600" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-2 space-y-4">
                                {item.megaMenu.columns.map((column) => (
                                  <div key={column.title}>
                                    <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-2">
                                      {column.title}
                                    </p>
                                    <ul className="space-y-2">
                                      {column.items.map((navLink) => (
                                        <li key={navLink.label}>
                                          <Link
                                            href={navLink.href}
                                            className="text-zinc-400 text-sm hover:text-white transition-colors block py-1"
                                            onClick={() => setMobileOpen(false)}
                                          >
                                            {navLink.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}

                    <div className="border-b border-zinc-900/50" />
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    href="/consultation"
                    className="block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-3 rounded-md text-center transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Talk to an Expert
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
