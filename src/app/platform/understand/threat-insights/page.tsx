import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Threat Insights',
  description: 'A clear view of the modern threat landscape — attack paths, common vectors, evolving techniques, and how they map to your environment.',
  alternates: { canonical: '/platform/understand/threat-insights' },
}

const domains = [
  { id: 'identity', label: 'Identity & Access' },
  { id: 'cloud', label: 'Cloud Infrastructure' },
  { id: 'applications', label: 'Applications' },
  { id: 'ransomware', label: 'Ransomware' },
  { id: 'network', label: 'Network Perimeter' },
  { id: 'monitoring', label: 'Monitoring Gaps' },
]

export default function ThreatInsightsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Threat Insights</h1>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          A clear view of the modern threat landscape — attack paths, common vectors, and evolving
          techniques. No vendor hype, no fear-based framing. Just what is actually happening and why it matters.
        </p>

        {/* Quick-jump nav */}
        <div className="flex flex-wrap gap-2 mb-14">
          {domains.map((d) => (
            <a key={d.id} href={`#${d.id}`}
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400 hover:border-red-600/50 hover:text-white transition-colors">
              {d.label}
            </a>
          ))}
        </div>

        {/* ── Identity & Access ─────────────────────────────────────── */}
        <section id="identity" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Identity &amp; Access</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Credential theft and identity abuse are the dominant attack path across every sector.
            According to the{' '}
            <a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">Verizon Data Breach Investigations Report (DBIR) 2024</a>,
            {' '}over 77% of breaches involved compromised credentials. The shift away from
            malware-first intrusion is significant — attackers no longer need to exploit software
            when they can simply log in.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Credential Theft &amp; Phishing</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Phishing remains the primary credential acquisition method. Adversary-in-the-middle (AiTM)
                phishing kits now bypass SMS-based MFA by proxying real sessions in real time. Push
                notification fatigue attacks (MFA bombing) exploit user approval habits by sending
                repeated authentication prompts until the target approves one.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Privilege Escalation &amp; Lateral Movement</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Once inside, attackers escalate to administrative accounts via pass-the-hash, Kerberoasting,
                or over-permissioned service accounts. MITRE ATT&amp;CK documents over 40 techniques
                under Privilege Escalation (TA0004) and Lateral Movement (TA0008) — most exploiting
                standing privilege rather than technical vulnerabilities.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Supply Chain &amp; OAuth Abuse</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Attackers increasingly target OAuth applications and third-party integrations to gain
                persistent access to cloud tenants without credentials. Consent phishing grants malicious
                apps access to Microsoft 365 or Google Workspace data without triggering MFA.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://attack.mitre.org/tactics/TA0006/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Credential Access (TA0006)</a></li>
              <li className="text-xs"><a href="https://attack.mitre.org/tactics/TA0008/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Lateral Movement (TA0008)</a></li>
              <li className="text-xs"><a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">Verizon DBIR 2024</a></li>
              <li className="text-xs"><a href="https://pages.nist.gov/800-63-3/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">NIST SP 800-63 — Digital Identity Guidelines</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/topics/cybersecurity-best-practices/identity-access-management" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA — Identity and Access Management</a></li>
            </ul>
          </div>
          <Link href="/knowledge/identity" className="text-red-600 text-xs font-medium hover:text-red-400">Read our identity security guide →</Link>
        </section>

        {/* ── Cloud Infrastructure ──────────────────────────────────── */}
        <section id="cloud" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Cloud Infrastructure</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Cloud environments have fundamentally shifted the attack surface. The{' '}
            <a href="https://cloudsecurityalliance.org/research/topics/top-threats" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">Cloud Security Alliance Top Threats 2024</a>
            {' '}identifies misconfiguration and inadequate identity as the two leading root causes of
            cloud breaches — both human and process failures, not technical vulnerabilities in cloud
            platforms themselves.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Misconfiguration</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Public S3 buckets, overly permissive security groups, disabled logging, and storage
                accounts accessible from the internet are consistently among the most common findings.
                Configuration drift — where a secure initial state degrades as infrastructure evolves —
                means point-in-time reviews are insufficient. Continuous posture management is required.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Overpermissioned IAM</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Cloud IAM roles and service accounts accumulate permissions over time. A developer role
                with AdministratorAccess or a service account with wildcard S3 permissions creates a
                path from any compromised workload to the entire environment. Least-privilege IAM in
                cloud requires continuous review — it is not a one-time setup task.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Exposed APIs &amp; Secrets in Code</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Hard-coded cloud credentials in source repositories are scraped by automated tools
                within minutes of being pushed. GitHub scans found over 12 million exposed secrets in
                public repositories in 2023. Metadata service abuse (IMDSv1 SSRF) allows workloads to
                retrieve instance credentials without authentication.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://cloudsecurityalliance.org/research/topics/top-threats" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CSA — Top Threats to Cloud Computing 2024</a></li>
              <li className="text-xs"><a href="https://www.cisecurity.org/cis-benchmarks" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CIS Benchmarks — Cloud Foundations (AWS, Azure, GCP)</a></li>
              <li className="text-xs"><a href="https://owasp.org/www-project-cloud-native-application-security-top-10/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">OWASP Cloud Native Application Security Top 10</a></li>
              <li className="text-xs"><a href="https://attack.mitre.org/matrices/enterprise/cloud/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Cloud Matrix</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/news-events/cybersecurity-advisories?f%5B0%5D=advisory_type%3A94" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA Cloud Security Advisories</a></li>
            </ul>
          </div>
          <Link href="/knowledge/cloud" className="text-red-600 text-xs font-medium hover:text-red-400">Read our cloud security guide →</Link>
        </section>

        {/* ── Applications ─────────────────────────────────────────── */}
        <section id="applications" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Applications</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Web and API vulnerabilities remain consistently exploited. The{' '}
            <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">OWASP Top 10</a>
            {' '}has tracked the same core vulnerability classes for over a decade — injection, broken access control,
            and security misconfigurations continue to dominate real-world breaches. The attack surface
            has expanded significantly with the proliferation of public-facing APIs.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Broken Access Control (OWASP A01)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The most prevalent application vulnerability category. Includes horizontal privilege
                escalation (accessing another user's data by changing an ID parameter), missing
                function-level authorization, CORS misconfigurations, and insecure direct object
                references. Often introduced through business logic, not code libraries — and therefore
                not caught by automated scanning alone.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Injection (OWASP A03)</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                SQL injection, command injection, LDAP injection, and NoSQL injection remain exploitable
                in production applications despite being well-understood for 25 years. Server-side
                template injection (SSTI) and XML injection are increasingly targeted in modern stacks.
                The impact is consistently critical — direct database access, remote code execution,
                or authentication bypass.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">API Security</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The{' '}
                <a href="https://owasp.org/www-project-api-security/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">OWASP API Security Top 10</a>
                {' '}covers the most exploited API vulnerabilities: broken object level authorization
                (BOLA/IDOR), broken authentication, excessive data exposure, and lack of rate limiting.
                APIs are frequently deployed with implicit trust assumptions that do not hold when
                exposed to the internet or third-party integrations.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">OWASP Top 10 Web Application Security Risks</a></li>
              <li className="text-xs"><a href="https://owasp.org/www-project-api-security/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">OWASP API Security Top 10</a></li>
              <li className="text-xs"><a href="https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CWE Top 25 Most Dangerous Software Weaknesses (2023)</a></li>
              <li className="text-xs"><a href="https://attack.mitre.org/tactics/TA0001/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Initial Access (TA0001)</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA Known Exploited Vulnerabilities Catalog</a></li>
            </ul>
          </div>
          <Link href="/knowledge/applications" className="text-red-600 text-xs font-medium hover:text-red-400">Read our application security guide →</Link>
        </section>

        {/* ── Ransomware ───────────────────────────────────────────── */}
        <section id="ransomware" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Ransomware &amp; Incident Response</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Ransomware remains one of the highest-impact threat categories. The{' '}
            <a href="https://www.cisa.gov/stopransomware" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">CISA Stop Ransomware</a>
            {' '}resource tracks active ransomware groups and their TTPs. Modern ransomware operations
            conduct double extortion — encrypting files while simultaneously exfiltrating data — and
            operate as Ransomware-as-a-Service (RaaS), lowering the barrier to entry for affiliates.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">How Ransomware Attacks Unfold</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Typical ransomware intrusions follow a predictable sequence: initial access via phishing
                or exposed RDP/VPN, credential theft and privilege escalation, domain reconaissance
                and lateral movement, data exfiltration, then encryption deployment. The average dwell
                time before encryption is 5–10 days — meaning detection during the pre-encryption
                phase is possible, but only with adequate monitoring coverage.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Enabling Weaknesses</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Unpatched systems and exposed remote access services (RDP on port 3389, legacy VPN
                appliances) are the most common initial access vectors. Flat networks without
                segmentation allow unrestricted lateral movement. Poor backup practices — backups on
                the same network, not tested, or not encrypted — determine whether recovery is possible
                without paying the ransom.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">IR Readiness Determines Outcome</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Organizations with tested IR plans and offline backups recover in days. Those without
                spend weeks or months — and often pay the ransom in addition to incident response costs.
                NIST SP 800-61 defines the IR lifecycle: preparation, detection and analysis,
                containment, eradication and recovery, post-incident activity.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://www.cisa.gov/stopransomware" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA #StopRansomware — Active Groups &amp; Advisories</a></li>
              <li className="text-xs"><a href="https://attack.mitre.org/tactics/TA0040/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Impact (TA0040) — Ransomware Techniques</a></li>
              <li className="text-xs"><a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">NIST SP 800-61r2 — Computer Security Incident Handling Guide</a></li>
              <li className="text-xs"><a href="https://www.ic3.gov/Home/AnnualReports" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">FBI IC3 Internet Crime Report</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/resources-tools/resources/ransomware-guide" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA Ransomware Guide (Joint Advisory)</a></li>
            </ul>
          </div>
          <Link href="/knowledge/incident-response" className="text-red-600 text-xs font-medium hover:text-red-400">Read our incident response guide →</Link>
        </section>

        {/* ── Network Perimeter ─────────────────────────────────────── */}
        <section id="network" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Network Perimeter</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            The traditional network perimeter has dissolved. Remote work, cloud infrastructure, and
            SaaS adoption mean that "inside the network" is no longer a meaningful trust boundary.
            The{' '}
            <a href="https://www.cisecurity.org/controls" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">CIS Controls v8</a>
            {' '}places network monitoring and segmentation among the foundational safeguards —
            because without them, every other control becomes harder to enforce.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Flat Networks &amp; Lateral Movement</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                A flat network — one where all systems can reach all other systems — means an attacker
                with access to a single workstation has a direct path to domain controllers, backup
                systems, and production databases. MITRE ATT&amp;CK documents techniques like SMB/Windows
                Admin Shares (T1021.002), Pass the Hash (T1550.002), and Remote Services abuse that
                exploit this lack of segmentation.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Exposed Services &amp; Legacy Protocols</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                RDP, SMBv1, Telnet, and unencrypted management interfaces exposed to the internet are
                consistently targeted. CISA's Known Exploited Vulnerabilities catalog includes dozens
                of critical flaws in perimeter devices — Citrix, Ivanti, Fortinet, Cisco — exploited
                before patches are applied. Perimeter devices themselves have become a primary initial
                access target.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Outbound Traffic &amp; Data Exfiltration</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Most organisations inspect inbound traffic but not outbound. Attackers use DNS tunnelling,
                HTTPS to attacker-controlled infrastructure, and cloud storage services to exfiltrate
                data. SWG (Secure Web Gateway) and CASB (Cloud Access Security Broker) controls address
                this — filtering and inspecting outbound and cloud-bound traffic.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://attack.mitre.org/tactics/TA0008/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK — Lateral Movement (TA0008)</a></li>
              <li className="text-xs"><a href="https://www.cisecurity.org/controls" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CIS Controls v8 — Network Infrastructure Management</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA KEV Catalog — Perimeter Device Vulnerabilities</a></li>
              <li className="text-xs"><a href="https://media.defense.gov/2023/Jun/12/2003233411/-1/-1/0/CSI_NETWORK_SECURITY_BEST_PRACTICES.PDF" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">NSA/CISA — Network Security Best Practices</a></li>
              <li className="text-xs"><a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-41r1.pdf" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">NIST SP 800-41r1 — Guidelines on Firewalls and Firewall Policy</a></li>
            </ul>
          </div>
          <Link href="/knowledge/network" className="text-red-600 text-xs font-medium hover:text-red-400">Read our network security guide →</Link>
        </section>

        {/* ── Security Monitoring Gaps ──────────────────────────────── */}
        <section id="monitoring" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <h2 className="text-white font-bold text-2xl">Security Monitoring Gaps</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Having monitoring tools is not the same as having visibility. The Verizon DBIR 2024 found
            that the median time to breach discovery remains measured in days to weeks — and that
            third parties or external entities discover breaches more often than the victim organisation.
            Monitoring programs fail not because of missing technology, but because of incomplete
            log coverage, untuned detection rules, and alert fatigue.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">MITRE ATT&amp;CK Coverage Gaps</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The{' '}
                <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK framework</a>
                {' '}maps over 400 adversary techniques across 14 tactics. Most organisations have
                detection coverage for a fraction of these. Techniques under Defense Evasion (TA0005),
                Command and Control (TA0011), and Collection (TA0009) are commonly undetected because
                they require specific log sources or correlation logic that generic SIEM rules do not cover.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Log Coverage &amp; Data Quality</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Critical detection signals — Windows event logs (4624, 4648, 4688), DNS query logs,
                process execution events, and cloud audit trails — are frequently not collected, not
                forwarded to the SIEM, or collected without enrichment. Without complete log coverage,
                correlation rules cannot fire regardless of how well they are written.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-white font-semibold text-sm mb-2">Alert Fatigue &amp; False Positives</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Default SIEM rule packs generate high false positive rates when applied to environments
                they were not tuned for. Analysts prioritise speed over accuracy under alert volume
                pressure — and eventually stop investigating alerts that have historically been noise.
                Detection without tuning is infrastructure cost with no security value.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 mb-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-2">Key references</p>
            <ul className="space-y-1.5">
              <li className="text-xs"><a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK Framework — Full Technique Matrix</a></li>
              <li className="text-xs"><a href="https://github.com/mitre-attack/attack-navigator" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">MITRE ATT&amp;CK Navigator — Coverage Visualisation Tool</a></li>
              <li className="text-xs"><a href="https://www.cisa.gov/resources-tools/resources/logging-made-easy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CISA Logging Made Easy — Free SIEM Baseline</a></li>
              <li className="text-xs"><a href="https://www.cisecurity.org/controls/audit-log-management" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">CIS Control 8 — Audit Log Management</a></li>
              <li className="text-xs"><a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-137.pdf" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">NIST SP 800-137 — Information Security Continuous Monitoring</a></li>
            </ul>
          </div>
          <Link href="/knowledge/monitoring" className="text-red-600 text-xs font-medium hover:text-red-400">Read our security monitoring guide →</Link>
        </section>

        {/* CTA */}
        <div className="border-t border-zinc-900 pt-10 flex flex-wrap gap-4">
          <Link href="/platform/understand/security-journey" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Assess your exposure →
          </Link>
          <Link href="/platform/engineer/engagement-studio" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Platform', path: '/platform' },
        { name: 'Threat Insights', path: '/platform/understand/threat-insights' },
      ])) }} />
    </main>
  )
}
