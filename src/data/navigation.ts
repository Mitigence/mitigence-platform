export interface NavLink {
  label: string
  href: string
  description?: string
}

export interface MegaMenuColumn {
  title: string
  items: NavLink[]
}

export interface NavItem {
  label: string
  href: string
  megaMenu?: {
    columns: MegaMenuColumn[]
  }
}

export const navItems: NavItem[] = [
  {
    label: 'Platform',
    href: '/platform',
    megaMenu: {
      columns: [
        {
          title: 'Understand',
          items: [
            { label: 'Enterprise Explorer', href: '/platform/understand/enterprise-explorer', description: 'Explore your digital environment' },
            { label: 'Security Journey', href: '/platform/understand/security-journey', description: 'Discover your maturity level' },
            { label: 'Threat Insights', href: '/platform/understand/threat-insights', description: 'Learn about modern threats' },
            { label: 'Industry Challenges', href: '/platform/understand/industry-challenges', description: 'Sector-specific security context' },
          ],
        },
        {
          title: 'Engineer',
          items: [
            { label: 'Engagement Studio', href: '/platform/engineer/engagement-studio', description: 'Design your security engagement' },
            { label: 'Capability Explorer', href: '/platform/engineer/capability-explorer', description: 'Explore security capabilities' },
            { label: 'Engineering Studio', href: '/platform/engineer/engineering-studio', description: 'See how we deliver' },
            { label: 'Team Builder', href: '/platform/engineer/team-builder', description: 'Build your delivery team' },
            { label: 'Delivery Models', href: '/platform/engineer/delivery-models', description: 'How we work together' },
          ],
        },
        {
          title: 'Operate',
          items: [
            { label: 'Customer Workspace', href: '/platform/operate/customer-workspace', description: 'Your engagement hub' },
            { label: 'Project Timeline', href: '/platform/operate/project-timeline', description: 'Track your security journey' },
            { label: 'Reports', href: '/platform/operate/reports', description: 'Interactive reporting' },
            { label: 'Continuous Improvement', href: '/platform/operate/continuous-improvement', description: 'Evolve continuously' },
          ],
        },
      ],
    },
  },
  {
    label: 'Solutions',
    href: '/solutions',
    megaMenu: {
      columns: [
        {
          title: 'Security Domains',
          items: [
            { label: 'Application Security', href: '/solutions/applications', description: 'Secure your applications end-to-end' },
            { label: 'Cloud Security', href: '/solutions/cloud', description: 'Engineering for cloud environments' },
            { label: 'Identity Security', href: '/solutions/identity', description: 'Protect identities and access' },
            { label: 'Network Security', href: '/solutions/network', description: 'Strengthen your network posture' },
          ],
        },
        {
          title: 'More Domains',
          items: [
            { label: 'Endpoint Protection', href: '/solutions/endpoints', description: 'Secure every device and system' },
            { label: 'Data Security', href: '/solutions/data', description: 'Protect sensitive data everywhere' },
            { label: 'Zero Trust Access', href: '/solutions/remote-access', description: 'Identity-verified access for remote teams' },
            { label: 'Security Monitoring', href: '/solutions/monitoring', description: 'Visibility, detection, and response' },
          ],
        },
      ],
    },
  },
  {
    label: 'Engineering',
    href: '/engineering',
    megaMenu: {
      columns: [
        {
          title: 'Engineering Lifecycle',
          items: [
            { label: 'Architecture', href: '/engineering/architecture', description: 'Security architecture design' },
            { label: 'Deployment', href: '/engineering/deployment', description: 'Structured deployment methodology' },
            { label: 'Integration', href: '/engineering/integration', description: 'Connecting security controls' },
            { label: 'Configuration Review', href: '/engineering/configuration-review', description: 'Validate and optimize configurations' },
          ],
        },
        {
          title: 'Validation & Operations',
          items: [
            { label: 'Health Checks', href: '/engineering/health-checks', description: 'Continuous health validation' },
            { label: 'Optimization', href: '/engineering/optimization', description: 'Continuous performance improvement' },
            { label: 'Operational Readiness', href: '/engineering/operational-readiness', description: 'Prepare for sustained operations' },
          ],
        },
      ],
    },
  },
  {
    label: 'Industries',
    href: '/industries',
    megaMenu: {
      columns: [
        {
          title: 'Sectors',
          items: [
            { label: 'Financial Services', href: '/industries/financial-services', description: 'Security for regulated finance' },
            { label: 'Healthcare', href: '/industries/healthcare', description: 'Protecting patient data and systems' },
            { label: 'Government', href: '/industries/government', description: 'Public sector security expertise' },
            { label: 'Education', href: '/industries/education', description: 'Securing academic environments' },
            { label: 'Retail', href: '/industries/retail', description: 'Protecting customer and payment data' },
            { label: 'Manufacturing', href: '/industries/manufacturing', description: 'OT and IT security convergence' },
          ],
        },
      ],
    },
  },
  {
    label: 'Knowledge',
    href: '/knowledge',
    megaMenu: {
      columns: [
        {
          title: 'Security Topics',
          items: [
            { label: 'Cloud Security', href: '/knowledge/cloud', description: 'Cloud architecture and controls' },
            { label: 'Identity & Access', href: '/knowledge/identity', description: 'Identity-centric security' },
            { label: 'Application Security', href: '/knowledge/applications', description: 'Securing modern applications' },
            { label: 'Data Security', href: '/knowledge/data', description: 'Protecting sensitive data' },
            { label: 'Security Monitoring', href: '/knowledge/monitoring', description: 'Detection and response' },
            { label: 'Network Security', href: '/knowledge/network', description: 'Infrastructure protection' },
            { label: 'Incident Response', href: '/knowledge/incident-response', description: 'Preparation and recovery' },
            { label: 'Architecture', href: '/knowledge/architecture', description: 'Security design principles' },
          ],
        },
      ],
    },
  },
  {
    label: 'Success Stories',
    href: '/success-stories',
  },
  {
    label: 'Company',
    href: '/company',
    megaMenu: {
      columns: [
        {
          title: 'About Mitigence',
          items: [
            { label: 'About Us', href: '/about', description: 'Our story and mission' },
            { label: 'Our Approach', href: '/approach', description: 'How we deliver cybersecurity' },
            { label: 'Leadership', href: '/leadership', description: 'Meet our team' },
            { label: 'Careers', href: '/careers', description: 'Join Mitigence' },
          ],
        },
      ],
    },
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]
