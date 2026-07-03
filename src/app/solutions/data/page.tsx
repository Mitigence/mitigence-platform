import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Data Security",
  description: "Data classification, DLP implementation, DSPM, data flow analysis, and policy fine-tuning. Protect your most sensitive asset across cloud and on-prem environments.",
  alternates: { canonical: "/solutions/data" },
}

export default function SolutionsDataPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Data Security</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          Structured and unstructured data — the asset every other control exists to protect.
          Discovery, DLP implementation, DSPM, and continuous policy enforcement.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Common challenges</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Unclear data classification and ownership</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />DLP rules that generate noise instead of signal</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />No DSPM — limited posture visibility across cloud stores</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Overprivileged access to sensitive stores</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />No consistent encryption or retention policy</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Sensitive data crossing boundaries without controls</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Business risk</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">Data exposure is usually the headline outcome of a breach — and the hardest to fully remediate after the fact. Untuned DLP and absent DSPM mean risk you cannot measure.</p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">How Mitigence helps</h2>
          <ol className="space-y-3">
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span className="text-zinc-300 text-sm">Discovery — locate sensitive data across structured and unstructured stores</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span className="text-zinc-300 text-sm">Classification — define labels, handling policies, and ownership</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span className="text-zinc-300 text-sm">Data Flow Analysis — map movement, identify uncontrolled paths</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span className="text-zinc-300 text-sm">DLP Implementation — deploy and configure Data Loss Prevention controls</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">5</span><span className="text-zinc-300 text-sm">DSPM — establish continuous data security posture management</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">6</span><span className="text-zinc-300 text-sm">Access Review — reduce overprivileged access to sensitive stores</span></li>
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">7</span><span className="text-zinc-300 text-sm">Policy Fine-Tuning — optimise rules, reduce false positives, enforce continuously</span></li>
          </ol>
        </div>

        {/* DLP section */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">DLP Implementation</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Data Loss Prevention controls are only as effective as the policies behind them. Mitigence
            designs and implements DLP across endpoint, network, and cloud channels — with policies
            calibrated to your data classification framework rather than vendor defaults.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Endpoint DLP — block exfiltration via USB, print, and local transfer</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Network DLP — inspect and control data in transit</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Cloud DLP — protect data in SaaS and cloud storage environments</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Policy fine-tuning — reduce alert fatigue, improve rule precision over time</li>
          </ul>
        </div>

        {/* DSPM section */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">DSPM — Data Security Posture Management</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            DSPM gives continuous visibility into your data security posture — where sensitive data
            lives, how it is protected, who can access it, and where posture has drifted from policy.
            Unlike point-in-time assessments, DSPM keeps your data risk picture current as
            environments change.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Discover and classify data across cloud, SaaS, and on-prem stores continuously</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Identify misconfigured permissions, exposed buckets, and over-shared data</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Track posture drift and remediate before it becomes a compliance gap</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Feed findings into DLP and access governance workflows</li>
          </ul>
        </div>

        {/* Data Flow Analysis + DFAnalyzer */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-3">Data Flow Analysis</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Most organisations know where their sensitive data is stored. Few know where it goes.
            Data Flow Analysis maps how sensitive data moves — across internal systems, third-party
            services, APIs, and business processes — and identifies flows that violate policy,
            bypass controls, or create unacknowledged exposure.
          </p>
          <ul className="space-y-2 mb-8">
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Map data movement across systems, services, and third parties</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Identify uncontrolled or unmonitored data paths</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Validate flows against classification and handling policies</li>
            <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Surface regulatory exposure before an audit does</li>
          </ul>

          <div className="rounded-lg border border-red-600/30 bg-red-600/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DF</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">Mitigence Product</p>
                <h3 className="text-white font-bold text-lg mb-2">DFAnalyzer</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  Data Flow Analysis has traditionally been a manual, time-intensive process —
                  workshops, interviews, and spreadsheets that go stale the moment something changes.
                  DFAnalyzer automates it.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Continuously maps data flows across your environment without manual effort</li>
                  <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Validates flows in real time against your data security and DLP policies</li>
                  <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Flags policy violations and newly detected flows as they emerge</li>
                  <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Feeds actionable data into DSPM and compliance workflows</li>
                </ul>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  DFAnalyzer complements the full data security program — DLP keeps data in, DSPM
                  keeps posture visible, and DFAnalyzer ensures the policies governing both stay
                  accurate as your environment evolves.
                </p>
              </div>
            </div>
          </div>
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
        { name: 'Data Security', path: '/solutions/data' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({
        name: 'Data Security',
        description: 'Data classification, DLP implementation, DSPM, data flow analysis, and policy fine-tuning — complemented by DFAnalyzer for continuous automated flow validation.',
        url: '/solutions/data',
        serviceType: 'Data Security',
      })) }} />
    </main>
  )
}
