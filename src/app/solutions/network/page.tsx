import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Network Security",
  description: "Segmentation, SWG, CASB, and traffic control. The connective layer between users, cloud services, and the internet — engineered for visibility and least-privilege access.",
  alternates: { canonical: "/solutions/network" },
}

export default function SolutionsNetworkPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Network Security</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          The connective layer between users, cloud services, and the internet.
          Segmentation, Secure Web Gateway, and CASB — controlling what moves, where, and to what.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Common challenges</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Flat networks with limited segmentation</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />No control or visibility over cloud app usage</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Unfiltered internet access across the organisation</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Legacy trust assumptions between network zones</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Slow detection of lateral movement</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Business risk</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">Without segmentation and traffic controls, a single compromised endpoint becomes an open path — to internal systems, cloud apps, and internet destinations alike.</p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">How Mitigence helps</h2>
          <ol className="space-y-3">
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span className="text-zinc-300 text-sm">Architecture review — segmentation model, firewall topology, traffic flows</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span className="text-zinc-300 text-sm">SWG deployment — filter and inspect outbound internet traffic</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span className="text-zinc-300 text-sm">CASB implementation — visibility and control over cloud and SaaS app usage</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span className="text-zinc-300 text-sm">Segmentation engineering — micro-segmentation, firewall policy hardening</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">5</span><span className="text-zinc-300 text-sm">Configuration review — validate firewall rules, ACLs, routing policies</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">6</span><span className="text-zinc-300 text-sm">Operational readiness — anomaly detection thresholds, monitoring integration</span></li>
          </ol>
        </div>

        {/* SWG section */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">SWG — Secure Web Gateway</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            A Secure Web Gateway inspects and filters all outbound internet traffic — blocking
            malicious destinations, enforcing acceptable-use policy, and providing full visibility
            into what users and systems are reaching on the internet.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />URL filtering and category-based access control</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />SSL/TLS inspection for encrypted traffic visibility</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Malware detection and threat intelligence integration</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Data loss controls on outbound web transfers</li>
          </ul>
        </div>

        {/* CASB section */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">CASB — Cloud Access Security Broker</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            CASB sits between users and cloud services — giving you visibility into which cloud
            and SaaS applications are in use, who is using them, and what data is moving through
            them. It enforces policy on cloud app usage that firewalls alone cannot see.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Shadow IT discovery — identify unsanctioned cloud and SaaS usage</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Access control for sanctioned cloud apps — conditional, policy-driven</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Data security — prevent sensitive data being uploaded to unsanctioned services</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Threat protection — detect compromised accounts and anomalous cloud behaviour</li>
          </ul>
          <p className="text-zinc-500 text-sm leading-relaxed mt-4">
            SWG and CASB are often deployed together as part of a broader SSE (Security Service
            Edge) architecture — alongside ZTNA for private application access. Mitigence
            designs and implements these as a cohesive program, not as standalone tools.
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
        { name: 'Network Security', path: '/solutions/network' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({
        name: 'Network Security',
        description: 'Network segmentation, Secure Web Gateway (SWG), and CASB implementation — controlling traffic between users, cloud services, and the internet.',
        url: '/solutions/network',
        serviceType: 'Network Security',
      })) }} />
    </main>
  )
}
