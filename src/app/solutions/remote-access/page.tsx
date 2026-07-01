import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Zero Trust Access — Mitigence",
  description: "ZTNA for private application access, replacing legacy VPN with identity-verified, least-privilege connectivity for remote and hybrid workforces.",
  alternates: { canonical: "/solutions/remote-access" },
}

export default function SolutionsRemoteAccessPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Zero Trust Access</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          Legacy VPN grants broad network access to anyone who authenticates. ZTNA grants
          access only to the specific application the user needs — verified per session,
          with device posture checked every time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Common challenges</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Legacy VPN with implicit broad-network trust</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />No per-application access control for internal apps</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Inconsistent device posture checks at connection time</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Limited session visibility and no continuous verification</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Third-party and contractor access sprawl</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Business risk</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">A compromised VPN credential is a pass to the entire network. ZTNA limits the blast radius of any single compromised account to a single application — nothing beyond it.</p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">How Mitigence helps</h2>
          <ol className="space-y-3">
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span className="text-zinc-300 text-sm">Current-state assessment — audit VPN architecture, access policies, and trust model</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span className="text-zinc-300 text-sm">ZTNA architecture design — define application segments, identity policies, device posture rules</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span className="text-zinc-300 text-sm">ZTNA deployment — implement private access for internal applications, migrate from VPN</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span className="text-zinc-300 text-sm">Configuration review — validate policies, certificate management, split-tunnel settings</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">5</span><span className="text-zinc-300 text-sm">Operational readiness — access review cycles, third-party governance, session monitoring</span></li>
          </ol>
        </div>

        {/* ZTNA detail */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">ZTNA — Zero Trust Network Access</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            ZTNA replaces legacy remote access with per-application, identity-verified connectivity.
            Users connect to the applications they are authorised for — not the network. Every session
            is verified against identity, device health, and contextual policy before access is granted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Private Access</p>
              <p className="text-zinc-400 text-xs leading-relaxed">Secure access to internal applications — data centre, private cloud, or hybrid — without exposing them to the internet or granting broad VPN network access.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Device Posture</p>
              <p className="text-zinc-400 text-xs leading-relaxed">Access conditional on device compliance — patch level, MDM enrolment, certificate presence — checked continuously, not just at login.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Least Privilege</p>
              <p className="text-zinc-400 text-xs leading-relaxed">Users access only the applications their role requires. Lateral movement beyond that perimeter is structurally prevented.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Third-Party Access</p>
              <p className="text-zinc-400 text-xs leading-relaxed">Grant contractors and vendors scoped, time-limited access to specific applications — no VPN credentials, no network-level trust.</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            ZTNA is not just a technology swap — it requires a rearchitected access model. Mitigence
            handles both: the architecture design and the engineering to get you off legacy VPN without
            disrupting operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement &rarr;
          </Link>
          <Link href="/consultation" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Talk to a specialist
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Solutions', path: '/solutions' },
        { name: 'Zero Trust Access', path: '/solutions/remote-access' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({
        name: 'Zero Trust Access',
        description: 'ZTNA implementation for private application access, replacing legacy VPN with identity-verified, least-privilege connectivity.',
        url: '/solutions/remote-access',
        serviceType: 'Zero Trust Network Access',
      })) }} />
    </main>
  )
}
