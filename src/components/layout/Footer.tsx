'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Nunito } from 'next/font/google'

const nunito = Nunito({ weight: ['700'], subsets: ['latin'], display: 'swap' })

const footerLinks = {
  Platform: [
    { label: 'Enterprise Explorer', href: '/platform/understand/enterprise-explorer' },
    { label: 'Security Journey', href: '/platform/understand/security-journey' },
    { label: 'Compliance Journey', href: '/platform/understand/compliance-journey' },
    { label: 'Engagement Studio', href: '/platform/engineer/engagement-studio' },
    { label: 'Capability Explorer', href: '/platform/engineer/capability-explorer' },
    { label: 'Customer Workspace', href: '/platform/operate/customer-workspace' },
  ],
  Solutions: [
    { label: 'Application Security', href: '/solutions/applications' },
    { label: 'Cloud Security', href: '/solutions/cloud' },
    { label: 'Identity Security', href: '/solutions/identity' },
    { label: 'Security Monitoring', href: '/solutions/monitoring' },
    { label: 'Endpoint Protection', href: '/solutions/endpoints' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Approach', href: '/approach' },
    { label: 'Knowledge Center', href: '/knowledge' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Careers', href: '/careers' },
  ],
  Contact: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Schedule a Consultation', href: '/consultation' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo-icon.webp"
                alt="Mitigence"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className={`${nunito.className} text-white text-xl`} style={{ letterSpacing: '0.01em' }}>Mitigence</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Cybersecurity Delivery & Engineering Platform. Helping organizations understand, engineer, and operate resilient security programs.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-red-600 text-sm font-semibold mb-4">{category}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-zinc-900 mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} Mitigence. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
