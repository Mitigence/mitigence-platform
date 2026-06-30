# Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the complete Mitigence platform foundation — Next.js 15 project with design system, navigation, all 55+ route shells, global state, animation system, and Vercel deployment — so every subsequent phase builds on a stable, deployed base.

**Architecture:** Shell-first build. All routes exist from day one as minimal pages with correct layout and navigation. The design system (black/red brand, typography, spacing tokens) is configured once and inherited by all future components. Global Zustand store captures cross-module user journey state from the beginning so later phases can read it without refactoring.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Zustand, Resend, Vercel Analytics, Geist font

## Global Constraints

- Framework: Next.js 15.x with App Router — no Pages Router
- Language: TypeScript strict mode — no `any` types
- Styling: Tailwind CSS only — no inline styles, no CSS modules except globals.css
- Components: shadcn/ui for all UI primitives — do not build custom buttons, inputs, dialogs from scratch
- Animations: Framer Motion only — no CSS keyframe animations except Tailwind's built-ins
- State: Zustand with sessionStorage persistence — no useState for cross-module data
- Brand colors: Black `#000000` background, Red `#DC2626` accent, White `#FFFFFF` text
- Font: Geist Sans (body/UI) + Geist Mono (code/labels) via `next/font/google`
- Node.js: 20.x or higher required
- All commits use imperative mood: "feat:", "fix:", "chore:" prefixes
- No placeholder text — every shell page shows the page title and a brief description of what this module will contain
- PRD reference: `docs/superpowers/specs/2026-06-30-mitigence-platform-design.md`

---

## File Map

```
E:\mit\WEBAPP\
├── src/
│   ├── app/
│   │   ├── layout.tsx                          ← Root layout (nav + footer + fonts + metadata)
│   │   ├── page.tsx                            ← Homepage shell
│   │   ├── globals.css                         ← Tailwind directives + CSS variables
│   │   ├── platform/
│   │   │   ├── page.tsx
│   │   │   ├── understand/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── enterprise-explorer/page.tsx
│   │   │   │   ├── security-journey/page.tsx
│   │   │   │   ├── threat-insights/page.tsx
│   │   │   │   ├── industry-challenges/page.tsx
│   │   │   │   └── knowledge-center/page.tsx
│   │   │   ├── engineer/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── engagement-studio/page.tsx
│   │   │   │   ├── capability-explorer/page.tsx
│   │   │   │   ├── engineering-studio/page.tsx
│   │   │   │   ├── delivery-framework/page.tsx
│   │   │   │   ├── team-builder/page.tsx
│   │   │   │   └── delivery-models/page.tsx
│   │   │   └── operate/
│   │   │       ├── page.tsx
│   │   │       ├── customer-workspace/page.tsx
│   │   │       ├── project-timeline/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       ├── continuous-improvement/page.tsx
│   │   │       └── customer-success/page.tsx
│   │   ├── solutions/
│   │   │   ├── page.tsx
│   │   │   ├── applications/page.tsx
│   │   │   ├── cloud/page.tsx
│   │   │   ├── identity/page.tsx
│   │   │   ├── network/page.tsx
│   │   │   ├── endpoints/page.tsx
│   │   │   ├── data/page.tsx
│   │   │   ├── remote-access/page.tsx
│   │   │   └── monitoring/page.tsx
│   │   ├── engineering/
│   │   │   ├── page.tsx
│   │   │   ├── architecture/page.tsx
│   │   │   ├── deployment/page.tsx
│   │   │   ├── integration/page.tsx
│   │   │   ├── configuration-review/page.tsx
│   │   │   ├── health-checks/page.tsx
│   │   │   ├── optimization/page.tsx
│   │   │   └── operational-readiness/page.tsx
│   │   ├── industries/
│   │   │   ├── page.tsx
│   │   │   ├── financial-services/page.tsx
│   │   │   ├── healthcare/page.tsx
│   │   │   ├── government/page.tsx
│   │   │   ├── education/page.tsx
│   │   │   ├── retail/page.tsx
│   │   │   └── manufacturing/page.tsx
│   │   ├── knowledge/
│   │   │   ├── page.tsx
│   │   │   ├── cloud/page.tsx
│   │   │   ├── identity/page.tsx
│   │   │   ├── applications/page.tsx
│   │   │   ├── monitoring/page.tsx
│   │   │   ├── network/page.tsx
│   │   │   ├── incident-response/page.tsx
│   │   │   ├── architecture/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── success-stories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── company/
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── approach/page.tsx
│   │   │   ├── leadership/page.tsx
│   │   │   └── careers/page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── consultation/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts            ← Resend email API route
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx          ← Main nav + mega-menu + mobile nav
│   │   │   ├── Footer.tsx              ← Footer with links + brand
│   │   │   └── PageShell.tsx           ← Common shell wrapper for non-homepage pages
│   │   └── ui/                         ← shadcn/ui auto-generated (do not edit manually)
│   ├── lib/
│   │   ├── store.ts                    ← Zustand journey store
│   │   ├── animations.ts               ← Framer Motion reusable variants
│   │   └── utils.ts                    ← shadcn cn() utility (auto-generated)
│   └── data/
│       └── navigation.ts               ← All nav structure as typed data
├── public/
│   └── logo.svg                        ← Client logo (to be provided)
├── BUILD_LOG.md
├── BUG_LOG.md
├── CONTENT_LOG.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.local`, `.env.example`

**Interfaces:**
- Produces: Running Next.js 15 dev server at `localhost:3000`

- [ ] **Step 1: Verify Node.js version**

```powershell
node --version
```
Expected output: `v20.x.x` or higher. If lower, download Node.js 20 LTS from nodejs.org before continuing.

- [ ] **Step 2: Create Next.js 15 project**

Run in `E:\mit\`:
```powershell
npx create-next-app@latest WEBAPP --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted:
- Would you like to use Turbopack? → **Yes**

- [ ] **Step 3: Verify dev server starts**

```powershell
cd E:\mit\WEBAPP
npm run dev
```
Expected: Server starts at `http://localhost:3000`. Visit in browser — default Next.js page shows. Stop server with `Ctrl+C`.

- [ ] **Step 4: Create environment files**

Create `E:\mit\WEBAPP\.env.local`:
```
RESEND_API_KEY=
```

Create `E:\mit\WEBAPP\.env.example`:
```
RESEND_API_KEY=your_resend_api_key_here
```

- [ ] **Step 5: Update next.config.ts**

Replace contents of `E:\mit\WEBAPP\next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

- [ ] **Step 6: Initialize git repository**

```powershell
git init
git add .
git commit -m "feat: initialize Next.js 15 project with TypeScript and Tailwind"
```

- [ ] **Step 7: Create GitHub repository and push**

```powershell
gh repo create mitigence-platform --private --source=. --remote=origin --push
```

If `gh` is not installed: go to github.com, create a new repository named `mitigence-platform`, then run:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/mitigence-platform.git
git push -u origin main
```

- [ ] **Step 8: Connect to Vercel**

```powershell
npx vercel
```
Follow prompts: link to existing Vercel account, create new project, default settings. Vercel will auto-deploy on every push to main.

Expected: Vercel provides a `.vercel.app` URL. Confirm it loads in browser.

- [ ] **Step 9: Verify build passes**

```powershell
npm run build
```
Expected: Build completes with no errors. `✓ Compiled successfully`

---

## Task 2: Design System

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: CSS variables for black/red brand available across all components
- Consumes: Nothing

- [ ] **Step 1: Replace globals.css**

Replace entire contents of `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 98%;
    --card: 0 0% 4%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 4%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 0%;
    --secondary: 0 0% 9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 9%;
    --muted-foreground: 0 0% 55%;
    --accent: 0 72% 51%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 10%;
    --input: 0 0% 9%;
    --ring: 0 72% 51%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  ::selection {
    @apply bg-red-600 text-white;
  }

  ::-webkit-scrollbar {
    @apply w-1.5;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-zinc-700 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-zinc-600;
  }
}
```

- [ ] **Step 2: Replace tailwind.config.ts**

Replace entire contents of `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Verify build passes**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```powershell
git add src/app/globals.css tailwind.config.ts
git commit -m "feat: configure black/red design system with CSS variables"
```

---

## Task 3: Component Library (shadcn/ui)

**Files:**
- Create: `src/lib/utils.ts`
- Create: `components.json`
- Create: `src/components/ui/button.tsx` (and others via CLI)

**Interfaces:**
- Produces: `cn()` utility, Button, Card, Badge, Separator, Sheet, Dialog, Tabs components
- Consumes: Design system CSS variables from Task 2

- [ ] **Step 1: Initialize shadcn/ui**

```powershell
npx shadcn@latest init
```

When prompted:
- Which style? → **Default**
- Which base color? → **Neutral**
- CSS variables? → **Yes**

This creates `src/lib/utils.ts` and `components.json`.

- [ ] **Step 2: Install required components**

```powershell
npx shadcn@latest add button card badge separator sheet dialog tabs accordion
```

- [ ] **Step 3: Verify components installed**

```powershell
Get-ChildItem src/components/ui
```
Expected: button.tsx, card.tsx, badge.tsx, separator.tsx, sheet.tsx, dialog.tsx, tabs.tsx, accordion.tsx all present.

- [ ] **Step 4: Verify build passes**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```powershell
git add .
git commit -m "feat: add shadcn/ui component library with core components"
```

---

## Task 4: Animation System

**Files:**
- Create: `src/lib/animations.ts`

**Interfaces:**
- Produces: `fadeInUp`, `fadeIn`, `slideInRight`, `scaleIn`, `staggerContainer`, `defaultTransition`, `slowTransition`, `pulseLoop` — all as Framer Motion `Variants` objects
- Consumes: Nothing

- [ ] **Step 1: Install Framer Motion**

```powershell
npm install framer-motion
```

- [ ] **Step 2: Create animation constants**

Create `src/lib/animations.ts`:
```typescript
import type { Variants, Transition } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 48 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 48 },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -48 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -48 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export const pulseLoop: Variants = {
  animate: {
    scale: [1, 1.04, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const defaultTransition: Transition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
}

export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
}

export const megaMenuTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut',
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```powershell
git add src/lib/animations.ts package.json package-lock.json
git commit -m "feat: add Framer Motion with reusable animation variants"
```

---

## Task 5: Global State Store

**Files:**
- Create: `src/lib/store.ts`

**Interfaces:**
- Produces: `useJourneyStore` hook with full user journey state shape
- Consumes: Nothing

- [ ] **Step 1: Install Zustand**

```powershell
npm install zustand
```

- [ ] **Step 2: Create journey store**

Create `src/lib/store.ts`:
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface JourneyState {
  // Security Journey Designer (Module 2)
  currentMaturity: string | null
  targetMaturity: string | null

  // Engagement Studio (Module 3)
  businessContexts: string[]
  objectives: string[]
  environment: string | null
  scopeItems: string[]
  timeline: string | null

  // Enterprise Explorer (Module 1)
  exploredDomains: string[]

  // Team Builder (Module 6)
  selectedPods: string[]

  // Capability Explorer (Module 4)
  exploredCapabilities: string[]
}

interface JourneyActions {
  setCurrentMaturity: (maturity: string) => void
  setTargetMaturity: (maturity: string) => void
  toggleBusinessContext: (id: string) => void
  toggleObjective: (id: string) => void
  setEnvironment: (env: string) => void
  toggleScopeItem: (id: string) => void
  setTimeline: (timeline: string) => void
  addExploredDomain: (domain: string) => void
  togglePod: (podId: string) => void
  addExploredCapability: (capabilityId: string) => void
  reset: () => void
}

const initialState: JourneyState = {
  currentMaturity: null,
  targetMaturity: null,
  businessContexts: [],
  objectives: [],
  environment: null,
  scopeItems: [],
  timeline: null,
  exploredDomains: [],
  selectedPods: [],
  exploredCapabilities: [],
}

export const useJourneyStore = create<JourneyState & JourneyActions>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentMaturity: (maturity) => set({ currentMaturity: maturity }),
      setTargetMaturity: (maturity) => set({ targetMaturity: maturity }),

      toggleBusinessContext: (id) =>
        set((state) => ({
          businessContexts: state.businessContexts.includes(id)
            ? state.businessContexts.filter((c) => c !== id)
            : [...state.businessContexts, id],
        })),

      toggleObjective: (id) =>
        set((state) => ({
          objectives: state.objectives.includes(id)
            ? state.objectives.filter((o) => o !== id)
            : [...state.objectives, id],
        })),

      setEnvironment: (env) => set({ environment: env }),

      toggleScopeItem: (id) =>
        set((state) => ({
          scopeItems: state.scopeItems.includes(id)
            ? state.scopeItems.filter((s) => s !== id)
            : [...state.scopeItems, id],
        })),

      setTimeline: (timeline) => set({ timeline }),

      addExploredDomain: (domain) =>
        set((state) => ({
          exploredDomains: [...new Set([...state.exploredDomains, domain])],
        })),

      togglePod: (podId) =>
        set((state) => ({
          selectedPods: state.selectedPods.includes(podId)
            ? state.selectedPods.filter((p) => p !== podId)
            : [...state.selectedPods, podId],
        })),

      addExploredCapability: (capabilityId) =>
        set((state) => ({
          exploredCapabilities: [
            ...new Set([...state.exploredCapabilities, capabilityId]),
          ],
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'mitigence-journey',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
)
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```powershell
git add src/lib/store.ts package.json package-lock.json
git commit -m "feat: add Zustand journey store with full cross-module state"
```

---

## Task 6: Navigation Data

**Files:**
- Create: `src/data/navigation.ts`

**Interfaces:**
- Produces: `navItems` array typed as `NavItem[]`, `NavItem` and `MegaMenuColumn` types
- Consumes: Nothing (pure data)

- [ ] **Step 1: Create navigation data file**

Create `src/data/navigation.ts`:
```typescript
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
            { label: 'Knowledge Center', href: '/platform/understand/knowledge-center', description: 'Cybersecurity learning hub' },
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
            { label: 'Data Protection', href: '/solutions/data', description: 'Protect sensitive data everywhere' },
            { label: 'Remote Access', href: '/solutions/remote-access', description: 'Secure connectivity for remote teams' },
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
            { label: 'Configuration Review', href: '/engineering/configuration-review', description: 'Validate and optimise configurations' },
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
            { label: 'About Us', href: '/company/about', description: 'Our story and mission' },
            { label: 'Our Approach', href: '/company/approach', description: 'How we deliver cybersecurity' },
            { label: 'Leadership', href: '/company/leadership', description: 'Meet our team' },
            { label: 'Careers', href: '/company/careers', description: 'Join Mitigence' },
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```powershell
git add src/data/navigation.ts
git commit -m "feat: add typed navigation data with full mega-menu structure"
```

---

## Task 7: Navigation Component

**Files:**
- Create: `src/components/layout/Navigation.tsx`

**Interfaces:**
- Consumes: `navItems` from `@/data/navigation`, `fadeIn`, `megaMenuTransition` from `@/lib/animations`
- Produces: `<Navigation />` component — fixed top bar, mega-menu on hover, mobile sheet

- [ ] **Step 1: Create Navigation component**

Create `src/components/layout/Navigation.tsx`:
```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
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
    setMobileOpen(false)
    setActiveMenu(null)
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
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Mitigence"
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback if logo not yet provided
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.insertAdjacentHTML('afterend', '<span class="text-white font-bold text-lg tracking-tight">MITIGENCE</span>')
                }}
              />
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
```

- [ ] **Step 2: Install lucide-react (icons)**

```powershell
npm install lucide-react
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```powershell
git add src/components/layout/Navigation.tsx package.json package-lock.json
git commit -m "feat: add responsive navigation with mega-menu and mobile drawer"
```

---

## Task 8: Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `navItems` from `@/data/navigation`
- Produces: `<Footer />` component

- [ ] **Step 1: Create Footer component**

Create `src/components/layout/Footer.tsx`:
```typescript
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Platform: [
    { label: 'Enterprise Explorer', href: '/platform/understand/enterprise-explorer' },
    { label: 'Security Journey', href: '/platform/understand/security-journey' },
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
    { label: 'About Us', href: '/company/about' },
    { label: 'Our Approach', href: '/company/approach' },
    { label: 'Knowledge Center', href: '/knowledge' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Careers', href: '/company/careers' },
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
            <Link href="/" className="inline-block mb-4">
              <img
                src="/logo.svg"
                alt="Mitigence"
                className="h-8 w-auto"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  t.insertAdjacentHTML('afterend', '<span class="text-white font-bold text-lg">MITIGENCE</span>')
                }}
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Cybersecurity Delivery & Engineering Platform. Helping organizations understand, engineer, and operate resilient security programs.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-white text-sm font-semibold mb-4">{category}</p>
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
            <Link href="/contact" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```powershell
git add src/components/layout/Footer.tsx
git commit -m "feat: add footer with navigation links and brand"
```

---

## Task 9: PageShell Component

**Files:**
- Create: `src/components/layout/PageShell.tsx`

**Interfaces:**
- Produces: `<PageShell title description phase module />` — consistent shell for all non-homepage pages during Phase 0
- Consumes: Nothing

- [ ] **Step 1: Create PageShell component**

Create `src/components/layout/PageShell.tsx`:
```typescript
interface PageShellProps {
  title: string
  description: string
  phase: string
  module?: string
}

export function PageShell({ title, description, phase, module: moduleName }: PageShellProps) {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
              {phase}
            </span>
            {moduleName && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-900">
                {moduleName}
              </span>
            )}
          </div>
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```powershell
git add src/components/layout/PageShell.tsx
git commit -m "feat: add PageShell component for consistent page structure"
```

---

## Task 10: Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `Navigation` from `@/components/layout/Navigation`, `Footer` from `@/components/layout/Footer`
- Produces: Root layout wrapping all pages with nav, footer, fonts, and metadata

- [ ] **Step 1: Replace root layout**

Replace entire contents of `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    template: '%s | Mitigence',
  },
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience through expert-led engagements and transparent delivery.',
  keywords: [
    'cybersecurity',
    'security engineering',
    'managed security',
    'penetration testing',
    'security architecture',
    'cloud security',
    'identity security',
  ],
  authors: [{ name: 'Mitigence' }],
  creator: 'Mitigence',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mitigence.com',
    siteName: 'Mitigence',
    title: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    description:
      'Expert-led cybersecurity engagements, managed operations, and transparent delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitigence — Cybersecurity Delivery & Engineering Platform',
    description:
      'Expert-led cybersecurity engagements, managed operations, and transparent delivery.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        <Navigation />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Install Geist fonts and Vercel Analytics**

```powershell
npm install geist @vercel/analytics
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```powershell
git add src/app/layout.tsx package.json package-lock.json
git commit -m "feat: configure root layout with navigation, footer, fonts, and analytics"
```

---

## Task 11: Homepage Shell

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: Homepage with 14 named section slots (each as a minimal `<section>` with id and label)
- Consumes: `Navigation`, `Footer` from root layout

- [ ] **Step 1: Replace homepage**

Replace entire contents of `src/app/page.tsx`:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cybersecurity Delivery & Engineering Platform',
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* Section 1: Hero — Interactive Enterprise Map */}
      <section id="hero" className="min-h-screen flex items-center border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Phase 1 — Hero + Enterprise Map</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            Cybersecurity Isn't One Service.<br />
            <span className="text-red-600">It's a Continuously Engineered Journey.</span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mb-10">
            Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience through expert-led engagements and transparent delivery.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
              Build Your Security Program
            </a>
            <a href="/platform" className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-6 py-3 rounded-md transition-colors">
              Explore the Platform
            </a>
            <a href="/consultation" className="text-zinc-500 hover:text-zinc-300 font-medium px-6 py-3 transition-colors">
              Talk to a Security Expert →
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Why Modern Security Is Different */}
      <section id="why-security-is-different" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Security Has Become More Connected—and More Complex.</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 14: Security Complexity Timeline</p>
        </div>
      </section>

      {/* Section 3: Explore Your Digital Enterprise */}
      <section id="explore-enterprise" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Every organization is different. Start with what you're protecting.</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 4 Preview: Domain Tiles</p>
        </div>
      </section>

      {/* Section 4: Discover Your Attack Surface */}
      <section id="attack-surface" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Discover Your Attack Surface</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 9: Attack Path Visualization</p>
        </div>
      </section>

      {/* Section 5: Build Your Security Program */}
      <section id="security-program" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Build Your Security Program</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 2 + 3: Journey Designer + Engagement Studio</p>
        </div>
      </section>

      {/* Section 6: Build Your Cybersecurity Team */}
      <section id="team-builder" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Build Your Cybersecurity Team</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 6: Team Builder</p>
        </div>
      </section>

      {/* Section 7: Security Engineering Lifecycle */}
      <section id="engineering-lifecycle" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">The Engineering Lifecycle</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 8: Engineering Lifecycle Animation</p>
        </div>
      </section>

      {/* Section 8: Delivery Models */}
      <section id="delivery-models" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Choose How You'd Like to Work With Us</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 7: Delivery Model Explorer</p>
        </div>
      </section>

      {/* Section 9: Capability Explorer Preview */}
      <section id="capability-explorer" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Explore Security Capabilities</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 4: Capability Explorer</p>
        </div>
      </section>

      {/* Section 10: Customer Workspace Preview */}
      <section id="customer-workspace" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Your Security Journey, Visible at Every Stage</h2>
          <p className="text-zinc-500 text-sm">Phase 4 — Module 10: Customer Workspace Preview</p>
        </div>
      </section>

      {/* Section 11: Success Stories */}
      <section id="success-stories" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Organizations That Chose a Different Path</h2>
          <p className="text-zinc-500 text-sm">Phase 3 — Module 12: Success Story Explorer</p>
        </div>
      </section>

      {/* Section 12: Knowledge Center Preview */}
      <section id="knowledge-center" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">What Would You Like to Understand?</h2>
          <p className="text-zinc-500 text-sm">Phase 3 — Module 11: Knowledge Center</p>
        </div>
      </section>

      {/* Section 13: Consultation CTA */}
      <section id="consultation" className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-8 h-0.5 bg-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Security Journey?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Schedule a strategy session with a Mitigence security specialist. No generic sales pitch — a focused conversation about your environment and objectives.
          </p>
          <a
            href="/consultation"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-md transition-colors text-lg"
          >
            Schedule a Strategy Session
          </a>
        </div>
      </section>

    </main>
  )
}
```

- [ ] **Step 2: Verify build passes**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```powershell
git add src/app/page.tsx
git commit -m "feat: add homepage shell with all 13 section slots"
```

---

## Task 12: All 55 Page Route Shells

**Files:**
- Create: All page.tsx files listed in the file map (excluding homepage — already done)

**Interfaces:**
- Consumes: `PageShell` from `@/components/layout/PageShell`
- Produces: All 55 routes returning valid pages with correct titles and descriptions

Each page follows this exact pattern:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: '[Page Title]',
  description: '[Page description]',
}

export default function [PageName]Page() {
  return (
    <PageShell
      title="[Page Title]"
      description="[What this module will contain when built]"
      phase="[Phase N]"
      module="[Module N — Name]"
    />
  )
}
```

- [ ] **Step 1: Create Platform pages**

Create `src/app/platform/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'The Platform',
  description: 'Understand, Engineer, and Operate your cybersecurity program through the Mitigence Experience Platform.',
}

export default function PlatformPage() {
  return (
    <PageShell
      title="The Mitigence Platform"
      description="Three interconnected experiences — Understand, Engineer, and Operate — that guide organizations from discovery to continuous improvement. Each experience is a product in its own right."
      phase="Phase 2"
    />
  )
}
```

Create `src/app/platform/understand/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Understand',
  description: 'Explore your digital environment, discover threats, and learn about modern security practices.',
}

export default function UnderstandPage() {
  return (
    <PageShell
      title="Understand"
      description="Explore your digital enterprise, discover attack surfaces, identify security priorities, and learn about modern cybersecurity practices — before any sales conversation begins."
      phase="Phase 2"
    />
  )
}
```

Create `src/app/platform/understand/enterprise-explorer/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Enterprise Explorer',
  description: 'Navigate your digital enterprise and discover security considerations for every layer.',
}

export default function EnterpriseExplorerPage() {
  return (
    <PageShell
      title="Enterprise Explorer"
      description="An interactive map of your digital enterprise. Navigate between identity, endpoints, cloud, networks, applications, APIs, data, and remote access to understand common risks and how Mitigence approaches each domain."
      phase="Phase 1"
      module="Module 1 — Interactive Enterprise Map"
    />
  )
}
```

Create `src/app/platform/understand/security-journey/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Journey Designer',
  description: 'Discover where your organization is today and design a roadmap to where you want to be.',
}

export default function SecurityJourneyPage() {
  return (
    <PageShell
      title="Security Journey Designer"
      description="Select your current security maturity level, define where you want to be, and receive a tailored roadmap — from assessment through engineering, operations, and continuous improvement."
      phase="Phase 1"
      module="Module 2 — Security Journey Designer"
    />
  )
}
```

Create `src/app/platform/understand/threat-insights/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Threat Insights',
  description: 'Understand the modern threat landscape and how it applies to your environment.',
}

export default function ThreatInsightsPage() {
  return (
    <PageShell
      title="Threat Insights"
      description="A clear view of the modern threat landscape — attack paths, common vectors, evolving techniques, and how they map to your environment. Education-first, without the fear-based messaging."
      phase="Phase 2"
    />
  )
}
```

Create `src/app/platform/understand/industry-challenges/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Industry Challenges',
  description: 'Security challenges specific to your industry and regulatory environment.',
}

export default function IndustryChallengesPage() {
  return (
    <PageShell
      title="Industry Challenges"
      description="Every industry faces distinct security pressures — regulatory requirements, threat profiles, operational constraints. Explore the specific challenges your sector navigates and how Mitigence addresses them."
      phase="Phase 3"
    />
  )
}
```

Create `src/app/platform/understand/knowledge-center/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'Interactive cybersecurity learning — not a blog, an encyclopedia.',
}

export default function KnowledgeCenterPage() {
  return (
    <PageShell
      title="Knowledge Center"
      description="An interactive learning resource covering cybersecurity domains, methodologies, and engineering practices. Choose a topic — cloud, identity, applications, monitoring, network, incident response, or architecture — and explore through animated explanations and practical guidance."
      phase="Phase 3"
      module="Module 11 — Knowledge Center"
    />
  )
}
```

- [ ] **Step 2: Create Platform / Engineer pages**

Create `src/app/platform/engineer/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engineer',
  description: 'Design your security engagement, assemble specialists, and build the right program for your organization.',
}

export default function EngineerPage() {
  return (
    <PageShell
      title="Engineer"
      description="Design your cybersecurity engagement, configure your scope, assemble specialist teams, and understand exactly how Mitigence delivers. The planning experience that replaces the sales brochure."
      phase="Phase 2"
    />
  )
}
```

Create `src/app/platform/engineer/engagement-studio/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engagement Studio',
  description: 'Design your cybersecurity engagement — objectives, environment, scope, timeline, and recommended journey.',
}

export default function EngagementStudioPage() {
  return (
    <PageShell
      title="Engagement Studio"
      description="Your digital consultant. Define your business context, security objectives, environment, and scope — and receive a structured engagement roadmap with recommended phases, milestones, and deliverables. No PDF. No generic proposal."
      phase="Phase 1"
      module="Module 3 — Engagement Studio"
    />
  )
}
```

Create `src/app/platform/engineer/capability-explorer/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Capability Explorer',
  description: 'Explore Mitigence security capabilities across identity, cloud, applications, monitoring, network, endpoints, data, and remote access.',
}

export default function CapabilityExplorerPage() {
  return (
    <PageShell
      title="Capability Explorer"
      description="Eight security domains. Click any domain to explore the engineering lifecycle inside it — from architecture and assessment through deployment, validation, and optimization. Capabilities, not vendor products."
      phase="Phase 2"
      module="Module 4 — Capability Explorer"
    />
  )
}
```

Create `src/app/platform/engineer/engineering-studio/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engineering Studio',
  description: 'See exactly how Mitigence delivers — the engineering lifecycle from architecture to optimization.',
}

export default function EngineeringStudioPage() {
  return (
    <PageShell
      title="Engineering Studio"
      description="The Mitigence delivery methodology, made visible. Eight engineering phases — architecture, planning, deployment, integration, configuration review, validation, operational readiness, and optimization. Each phase shows what we do, what we deliver, and how we measure success."
      phase="Phase 2"
      module="Module 5 — Engineering Studio"
    />
  )
}
```

Create `src/app/platform/engineer/delivery-framework/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Delivery Framework',
  description: 'The structured framework Mitigence uses to plan, execute, and continuously improve every engagement.',
}

export default function DeliveryFrameworkPage() {
  return (
    <PageShell
      title="Delivery Framework"
      description="Every Mitigence engagement follows a structured delivery framework — from initial assessment through engineering, validation, operations, and continuous improvement. Understand the process before the first conversation."
      phase="Phase 2"
    />
  )
}
```

Create `src/app/platform/engineer/team-builder/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Team Builder',
  description: 'Assemble specialist capability pods and understand how your delivery team is structured.',
}

export default function TeamBuilderPage() {
  return (
    <PageShell
      title="Team Builder"
      description="Cybersecurity is delivered by coordinated expertise, not isolated services. Select capability pods — assessment, engineering, operations, incident response, architecture — and see how your delivery team takes shape, what they do together, and what you can expect."
      phase="Phase 2"
      module="Module 6 — Team Builder"
    />
  )
}
```

Create `src/app/platform/engineer/delivery-models/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Delivery Models',
  description: 'Five ways to work with Mitigence — from one-time assessments to strategic partnerships.',
}

export default function DeliveryModelsPage() {
  return (
    <PageShell
      title="Delivery Models"
      description="Five engagement models: one-time assessment, project delivery, dedicated specialists, managed operations, and strategic partnership. Each one explained — team, timeline, reporting, meetings, workspace, and deliverables — so you know exactly what you're entering into."
      phase="Phase 2"
      module="Module 7 — Delivery Model Explorer"
    />
  )
}
```

- [ ] **Step 3: Create Platform / Operate pages**

Create `src/app/platform/operate/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Operate',
  description: 'See how Mitigence operates alongside your team — projects, reports, reviews, and continuous improvement.',
}

export default function OperatePage() {
  return (
    <PageShell
      title="Operate"
      description="The operational experience of working with Mitigence — project tracking, interactive reports, milestone reviews, and continuous improvement. Transparency at every stage of delivery."
      phase="Phase 4"
    />
  )
}
```

Create `src/app/platform/operate/customer-workspace/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Customer Workspace',
  description: 'Your engagement hub — projects, reports, deliverables, milestones, and collaboration in one place.',
}

export default function CustomerWorkspacePage() {
  return (
    <PageShell
      title="Customer Workspace"
      description="A preview of the Mitigence customer workspace — where projects, reports, deliverables, milestones, recommendations, and team communication come together. This is what working with Mitigence looks like after engagement begins."
      phase="Phase 4"
      module="Module 10 — Customer Workspace Preview"
    />
  )
}
```

Create `src/app/platform/operate/project-timeline/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Project Timeline',
  description: 'Track your security engagement from kickoff to completion and beyond.',
}

export default function ProjectTimelinePage() {
  return (
    <PageShell
      title="Project Timeline"
      description="A structured view of your engagement timeline — kickoff, discovery, assessment, engineering, validation, reporting, and ongoing improvement. Every milestone, every deliverable, every review point visible from day one."
      phase="Phase 4"
    />
  )
}
```

Create `src/app/platform/operate/reports/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Interactive reports — not 100-page PDFs. Executive summaries, risk heatmaps, and actionable recommendations.',
}

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      description="Cybersecurity reports reimagined. Interactive executive summaries, risk heatmaps, affected asset views, priority matrices, and actionable recommendations — consumable online first, exportable second."
      phase="Phase 4"
    />
  )
}
```

Create `src/app/platform/operate/continuous-improvement/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Continuous Improvement',
  description: 'Quarterly reviews, optimization roadmaps, and ongoing security improvement with Mitigence.',
}

export default function ContinuousImprovementPage() {
  return (
    <PageShell
      title="Continuous Improvement"
      description="Security isn't a project — it's a continuous discipline. Quarterly reviews, optimization roadmaps, engineering updates, and long-term partnership that evolves as your organization grows."
      phase="Phase 4"
    />
  )
}
```

Create `src/app/platform/operate/customer-success/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Customer Success',
  description: 'How Mitigence ensures long-term success for every engagement.',
}

export default function CustomerSuccessPage() {
  return (
    <PageShell
      title="Customer Success"
      description="How Mitigence measures and delivers long-term value — from the first engagement through ongoing partnership, maturity growth, and strategic planning."
      phase="Phase 4"
    />
  )
}
```

- [ ] **Step 4: Create Solutions pages**

Create `src/app/solutions/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Security capabilities across eight domains — applications, cloud, identity, network, endpoints, data, remote access, and monitoring.',
}

export default function SolutionsPage() {
  return (
    <PageShell
      title="Security Solutions"
      description="Eight security domains. Each one an engineering discipline — not a product category. Explore how Mitigence approaches application security, cloud security, identity, network, endpoints, data protection, remote access, and security monitoring."
      phase="Phase 1"
    />
  )
}
```

Create the following 8 solution pages using this pattern. Each has its own title and description:

`src/app/solutions/applications/page.tsx`:
- title: "Application Security"
- description: "Securing modern applications from architecture through continuous review. Discovery, assessment, risk analysis, remediation guidance, validation, and ongoing review — not just a one-time test."
- module: "Module 4 — Capability: Applications"

`src/app/solutions/cloud/page.tsx`:
- title: "Cloud Security"
- description: "Engineering-led cloud security across architecture, configuration, workload protection, and identity. Whether you're cloud-first, multi-cloud, or hybrid — Mitigence engineers the controls, not just assesses them."
- module: "Module 4 — Capability: Cloud"

`src/app/solutions/identity/page.tsx`:
- title: "Identity Security"
- description: "Identity is the new perimeter. Mitigence architects, deploys, validates, and continuously optimises identity security controls — from directory hardening and PAM to zero-trust access and conditional policy."
- module: "Module 4 — Capability: Identity"

`src/app/solutions/network/page.tsx`:
- title: "Network Security"
- description: "Infrastructure protection from the ground up. Network architecture review, segmentation, firewall optimisation, traffic analysis, and operational readiness — ensuring your network is both resilient and operationally manageable."
- module: "Module 4 — Capability: Network"

`src/app/solutions/endpoints/page.tsx`:
- title: "Endpoint Protection"
- description: "Every device is a potential entry point. Mitigence engineers endpoint security controls, validates configurations, tests detection capabilities, and ensures your endpoint stack operates at full potential."
- module: "Module 4 — Capability: Endpoints"

`src/app/solutions/data/page.tsx`:
- title: "Data Protection"
- description: "Protecting sensitive data wherever it lives — at rest, in transit, and in use. Data classification, DLP engineering, encryption validation, and ongoing monitoring to ensure your most critical assets remain protected."
- module: "Module 4 — Capability: Data"

`src/app/solutions/remote-access/page.tsx`:
- title: "Secure Remote Access"
- description: "Remote workforces require more than VPNs. Mitigence designs and engineers secure access architectures — zero-trust network access, identity-aware proxies, and session monitoring — built for modern distributed teams."
- module: "Module 4 — Capability: Remote Access"

`src/app/solutions/monitoring/page.tsx`:
- title: "Security Monitoring"
- description: "Visibility, detection, correlation, investigation, and response. Mitigence engineers and optimises your monitoring capability — from log collection and SIEM tuning through use-case development and operational runbooks."
- module: "Module 4 — Capability: Monitoring"

Use the same page structure as above for each:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: '[title]',
  description: '[description]',
}

export default function [Name]Page() {
  return (
    <PageShell
      title="[title]"
      description="[description]"
      phase="Phase 1"
      module="[module]"
    />
  )
}
```

- [ ] **Step 5: Create Engineering pages**

Create `src/app/engineering/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Engineering',
  description: 'How Mitigence engineers cybersecurity — from architecture design through operational readiness and continuous optimization.',
}

export default function EngineeringPage() {
  return (
    <PageShell
      title="Security Engineering"
      description="Engineering is what separates Mitigence from assessment-only firms. Every engagement follows a structured engineering lifecycle — architecture, planning, deployment, integration, configuration review, validation, operational readiness, and optimization."
      phase="Phase 2"
    />
  )
}
```

Create the following 7 engineering pages using the same pattern:

`src/app/engineering/architecture/page.tsx`:
- title: "Security Architecture"
- description: "Architecture decisions made early determine security outcomes for years. Mitigence designs security architecture that is resilient, operationally realistic, and aligned with your business direction — not just compliant with a checklist."
- phase: "Phase 2"

`src/app/engineering/deployment/page.tsx`:
- title: "Security Deployment"
- description: "Implementation done right. Structured deployment methodology covering planning, execution, integration validation, and handover — ensuring controls operate as designed from day one."
- phase: "Phase 2"

`src/app/engineering/integration/page.tsx`:
- title: "Security Integration"
- description: "Security controls don't operate in isolation. Mitigence engineers the connections between systems — ensuring your identity, endpoint, network, cloud, and monitoring layers work as a coherent, integrated capability."
- phase: "Phase 2"

`src/app/engineering/configuration-review/page.tsx`:
- title: "Configuration Review"
- description: "Most security failures stem from misconfiguration, not missing technology. Mitigence reviews configurations across your security stack, identifies operational gaps, and delivers prioritised optimisation recommendations."
- phase: "Phase 2"

`src/app/engineering/health-checks/page.tsx`:
- title: "Health Checks"
- description: "Continuous validation that your security controls are functioning as intended. Scheduled health checks identify configuration drift, operational degradation, and emerging gaps before they become vulnerabilities."
- phase: "Phase 2"

`src/app/engineering/optimization/page.tsx`:
- title: "Security Optimization"
- description: "Security engineering doesn't end at deployment. Mitigence continuously optimises configurations, tunes detection logic, updates policies, and improves operational efficiency as your environment evolves."
- phase: "Phase 2"

`src/app/engineering/operational-readiness/page.tsx`:
- title: "Operational Readiness"
- description: "A security control is only as valuable as the team that operates it. Operational readiness assessments validate that your team has the processes, runbooks, and knowledge to sustain security operations effectively."
- phase: "Phase 2"

- [ ] **Step 6: Create Industries pages**

Create `src/app/industries/page.tsx` and 6 industry pages:

`src/app/industries/page.tsx`:
- title: "Industries"
- description: "Every sector faces distinct security pressures. Explore how Mitigence approaches financial services, healthcare, government, education, retail, and manufacturing — with context-specific challenges and relevant engagement approaches."

`src/app/industries/financial-services/page.tsx`:
- title: "Financial Services Security"
- description: "Regulated, targeted, and operationally complex. Financial services organisations face constant threat actor interest, strict regulatory requirements, and the operational challenge of securing legacy and modern systems simultaneously."

`src/app/industries/healthcare/page.tsx`:
- title: "Healthcare Security"
- description: "Patient safety and data protection are inseparable. Healthcare organisations must secure clinical systems, protect sensitive patient data, meet regulatory obligations, and maintain operational continuity — often with constrained security resources."

`src/app/industries/government/page.tsx`:
- title: "Government Security"
- description: "Public sector organisations operate under heightened threat conditions, strict data handling requirements, and complex procurement environments. Mitigence brings structured delivery and engineering depth to government security programmes."

`src/app/industries/education/page.tsx`:
- title: "Education Security"
- description: "Academic environments are uniquely open by design — which creates security challenges that commercial approaches don't always address. Mitigence understands the balance between accessibility, research freedom, and appropriate security controls."

`src/app/industries/retail/page.tsx`:
- title: "Retail Security"
- description: "Payment data, customer information, supply chain systems, and e-commerce platforms create a broad attack surface. Retail organisations require security engineering that protects customer trust without disrupting the commercial operation."

`src/app/industries/manufacturing/page.tsx`:
- title: "Manufacturing Security"
- description: "OT and IT convergence introduces security risks that traditional approaches weren't designed to address. Mitigence brings expertise in both environments — securing industrial systems without disrupting operational processes."

- [ ] **Step 7: Create Knowledge pages**

Create `src/app/knowledge/page.tsx`:
- title: "Knowledge Center"
- description: "An interactive cybersecurity learning hub. Not a blog — a structured resource covering security domains, engineering methodologies, and practical guidance. Choose a topic and explore through diagrams, explanations, and Mitigence's engineering approach."

Create `src/app/knowledge/[slug]/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Cybersecurity knowledge article from Mitigence.`,
  }
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <PageShell
      title={title}
      description="This knowledge article will contain interactive diagrams, methodology explanations, and practical cybersecurity guidance from the Mitigence engineering team."
      phase="Phase 3"
      module="Module 11 — Knowledge Article"
    />
  )
}
```

Create the 7 topic pages: cloud, identity, applications, monitoring, network, incident-response, architecture — each using PageShell with appropriate title and description following the same pattern used for engineering pages.

- [ ] **Step 8: Create Success Stories pages**

Create `src/app/success-stories/page.tsx`:
- title: "Success Stories"
- description: "Structured engagement narratives — not testimonials. Every story follows the same framework: challenge, discovery, assessment, engineering, validation, outcome, and continuous improvement. Filter by industry, organization size, objective, environment, or delivery model."

Create `src/app/success-stories/[slug]/page.tsx` (same pattern as knowledge/[slug]/page.tsx but with Success Story metadata).

- [ ] **Step 9: Create Company pages**

Create `src/app/company/page.tsx`, `about/page.tsx`, `approach/page.tsx`, `leadership/page.tsx`, `careers/page.tsx` with appropriate titles and descriptions following the same pattern.

`company/page.tsx`: "Mitigence is a Cybersecurity Delivery & Engineering Platform..."
`about/page.tsx`: "Our story, our mission, and what drives us to approach cybersecurity differently..."
`approach/page.tsx`: "The Mitigence delivery philosophy — why we lead with engineering, not marketing..."
`leadership/page.tsx`: "Meet the Mitigence team..."
`careers/page.tsx`: "Join Mitigence — we're looking for engineers who want to make cybersecurity clearer and more effective..."

- [ ] **Step 10: Create Contact and Consultation pages**

Create `src/app/contact/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Mitigence.',
}

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Mitigence"
      description="Get in touch with the Mitigence team. Whether you have a specific security challenge, want to explore an engagement, or simply want to understand how we work — we're here."
      phase="Phase 0"
    />
  )
}
```

Create `src/app/consultation/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Schedule a Consultation',
  description: 'Schedule a strategy session with a Mitigence security specialist.',
}

export default function ConsultationPage() {
  return (
    <PageShell
      title="Schedule a Strategy Session"
      description="A focused conversation about your environment and objectives — not a generic sales pitch. Tell us about your organization and what you're trying to achieve. We'll come prepared."
      phase="Phase 1"
    />
  )
}
```

- [ ] **Step 11: Verify build passes with all routes**

```powershell
npm run build
```
Expected: `✓ Compiled successfully` with all routes listed in output. No TypeScript errors.

- [ ] **Step 12: Commit all pages**

```powershell
git add src/app/
git commit -m "feat: create all 55+ page route shells with consistent layout and metadata"
```

---

## Task 13: Resend Email Integration

**Files:**
- Create: `src/app/api/contact/route.ts`
- Modify: `src/app/consultation/page.tsx`

**Interfaces:**
- Produces: `POST /api/contact` endpoint that sends email via Resend
- Consumes: `RESEND_API_KEY` environment variable

- [ ] **Step 1: Install Resend**

```powershell
npm install resend
```

- [ ] **Step 2: Create API route**

Create `src/app/api/contact/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  organization: string
  message: string
  source: 'contact' | 'consultation'
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, organization, message, source } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['akash.shrivastava5779@gmail.com'],
      replyTo: email,
      subject: source === 'consultation'
        ? `Consultation Request — ${organization || name}`
        : `Contact Form — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}
Source: ${source}

Message:
${message}
      `.trim(),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Add Resend API key to Vercel**

Go to Vercel dashboard → Project Settings → Environment Variables.
Add: `RESEND_API_KEY` = (get from resend.com after creating free account)

Also sign up at resend.com and verify domain `mitigence.com` for sending.

- [ ] **Step 4: Verify build passes**

```powershell
npm run build
```
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```powershell
git add src/app/api/ package.json package-lock.json
git commit -m "feat: add Resend email API route for contact and consultation forms"
```

---

## Task 14: Session Log Files

**Files:**
- Create: `BUILD_LOG.md`, `BUG_LOG.md`, `CONTENT_LOG.md`

**Interfaces:**
- Produces: Three log files that every future Claude session reads at start and updates at end

- [ ] **Step 1: Create BUILD_LOG.md**

Create `E:\mit\WEBAPP\BUILD_LOG.md`:
```markdown
# Build Log — Mitigence Platform

## Instructions
Every Claude session reads this file at the start and appends a new entry at the end.
Format: `[YYYY-MM-DD] Task X.Y — [what was built] — Status: COMPLETE`

## Spec Reference
- Frozen spec: `docs/superpowers/specs/2026-06-30-mitigence-platform-design.md`
- Phase 0 plan: `docs/superpowers/plans/2026-06-30-phase-0-foundation.md`

## Completed Tasks

[2026-06-30] Phase 0 Plan — Foundation implementation plan written — Status: COMPLETE
```

- [ ] **Step 2: Create BUG_LOG.md**

Create `E:\mit\WEBAPP\BUG_LOG.md`:
```markdown
# Bug Log — Mitigence Platform

## Instructions
Every Checker/Resolver session logs bugs here.
Format: `[YYYY-MM-DD] BUG-XXX | Module | Description | Status: OPEN/RESOLVED | Fix: [description]`

## Open Bugs
None.

## Resolved Bugs
None yet.
```

- [ ] **Step 3: Create CONTENT_LOG.md**

Create `E:\mit\WEBAPP\CONTENT_LOG.md`:
```markdown
# Content Log — Mitigence Platform

## Instructions
Content Agent logs all content written here.
Format: `[YYYY-MM-DD] [file] — [what was written] — Status: DRAFT/APPROVED/MERGED`

## Content Status

### JSON Data Files
- [ ] data/enterprise-map.json — 12 nodes (Phase 1, Task 1.6)
- [ ] data/maturity-stages.json — 5 stages (Phase 1, Task 1.12)
- [ ] data/engagement-studio.json — rules + options (Phase 1, Task 1.18)
- [ ] data/capabilities.json — 8 domains × 6 stages (Phase 2, Task 2.4)
- [ ] data/engineering-lifecycle.json — 9 stages (Phase 2, Task 2.7)
- [ ] data/team-builder.json — 5 pods (Phase 2, Task 2.12)
- [ ] data/delivery-models.json — 5 models (Phase 2, Task 2.15)
- [ ] data/attack-surface.json — 6 stages (Phase 2, Task 2.17)
- [ ] data/knowledge.json — 7 topics (Phase 3, Task 3.4)
- [ ] data/success-stories.json — stories (Phase 3, Task 3.9)
- [ ] data/assistant-hints.json — hints (Phase 3, Task 3.12)
- [ ] data/industries.json — 6 industries (Phase 3, Task 3.14)
- [ ] data/solutions.json — 8 domains (Phase 1, Task 1.19)

### MDX Content
- [ ] content/knowledge/ — articles (Phase 3, Tasks 3.4–3.5)
- [ ] content/success-stories/ — stories (Phase 3, Tasks 3.6–3.9)
- [ ] content/company/ — about, approach (Phase 1, Task 1.20)
```

- [ ] **Step 4: Commit**

```powershell
git add BUILD_LOG.md BUG_LOG.md CONTENT_LOG.md
git commit -m "chore: initialize build, bug, and content tracking logs"
```

---

## Task 15: Phase 0 Gate — Final Verification

**Files:**
- No new files

**Interfaces:**
- Gate: All routes return 200, build passes, Vercel deployment is live at mitigence.com (or .vercel.app)

- [ ] **Step 1: Full production build**

```powershell
npm run build
```
Expected output includes:
```
✓ Compiled successfully
Route (app)
┌ ○ /
├ ○ /contact
├ ○ /consultation
├ ○ /company/about
... (all routes listed)
```
All routes should show `○` (static) or `ƒ` (dynamic). No errors.

- [ ] **Step 2: Start production server locally**

```powershell
npm run start
```
Open browser to `http://localhost:3000`. Verify:
- Navigation renders with mega-menu working on hover
- Mobile menu opens and closes
- All nav links navigate without 404
- Footer renders with correct links
- Homepage shows all 13 section slots with red accent bars
- Black background throughout
- No console errors

- [ ] **Step 3: Check 5 key routes in browser**

Visit and confirm each page loads with correct PageShell:
- `http://localhost:3000/platform/engineer/engagement-studio`
- `http://localhost:3000/solutions/cloud`
- `http://localhost:3000/knowledge/identity`
- `http://localhost:3000/success-stories`
- `http://localhost:3000/consultation`

Each should show: red accent bar, correct title, correct description, phase badge, module badge (if applicable).

- [ ] **Step 4: Push to GitHub and verify Vercel deployment**

```powershell
git push origin main
```
Go to Vercel dashboard. Confirm:
- Build triggered automatically
- Build passes
- Live URL accessible

- [ ] **Step 5: Connect custom domain (mitigence.com)**

In Vercel dashboard → Project → Settings → Domains:
1. Add `mitigence.com`
2. Add `www.mitigence.com`
3. Vercel provides 2 DNS records (A record + CNAME)
4. Log into your domain registrar
5. Add the DNS records exactly as shown
6. Wait 15–60 minutes for DNS propagation
7. Vercel dashboard shows domain as "Valid" with green checkmark

- [ ] **Step 6: Update BUILD_LOG.md**

Append to `BUILD_LOG.md`:
```
[2026-06-30] Phase 0 Task 1 — Next.js 15 project initialized + GitHub + Vercel — Status: COMPLETE
[2026-06-30] Phase 0 Task 2 — Design system (black/red CSS variables + Tailwind) — Status: COMPLETE
[2026-06-30] Phase 0 Task 3 — shadcn/ui component library installed — Status: COMPLETE
[2026-06-30] Phase 0 Task 4 — Framer Motion animation constants — Status: COMPLETE
[2026-06-30] Phase 0 Task 5 — Zustand journey store — Status: COMPLETE
[2026-06-30] Phase 0 Task 6 — Navigation data structure — Status: COMPLETE
[2026-06-30] Phase 0 Task 7 — Navigation component (mega-menu + mobile) — Status: COMPLETE
[2026-06-30] Phase 0 Task 8 — Footer component — Status: COMPLETE
[2026-06-30] Phase 0 Task 9 — PageShell component — Status: COMPLETE
[2026-06-30] Phase 0 Task 10 — Root layout (fonts + analytics) — Status: COMPLETE
[2026-06-30] Phase 0 Task 11 — Homepage shell (13 section slots) — Status: COMPLETE
[2026-06-30] Phase 0 Task 12 — All 55+ page route shells — Status: COMPLETE
[2026-06-30] Phase 0 Task 13 — Resend email API route — Status: COMPLETE
[2026-06-30] Phase 0 Task 14 — Build/Bug/Content logs initialized — Status: COMPLETE
[2026-06-30] Phase 0 GATE — mitigence.com live, all routes return 200, build passes — Status: COMPLETE
```

- [ ] **Step 7: Final commit**

```powershell
git add BUILD_LOG.md
git commit -m "chore: Phase 0 complete — all routes live on mitigence.com"
git push origin main
```

**Phase 0 is complete. The platform is live. Every route exists. The design system, navigation, state store, and animation constants are in place. Phase 1 begins next session.**

---

## Self-Review Checklist

**Spec coverage:**
- ✓ Task 1 → PRD requirement 0.1 (Next.js + GitHub + Vercel)
- ✓ Task 2 → PRD requirements 44, 45, 47 (design system, typography, tokens)
- ✓ Task 3 → Global component library
- ✓ Task 4 → PRD requirement 46 (motion language)
- ✓ Task 5 → PRD requirement 38 (cross-module session state)
- ✓ Task 6+7 → PRD requirement 3 (navigation + mega-menu)
- ✓ Task 8 → Footer
- ✓ Task 11 → PRD requirement 2 (hero CTAs, homepage structure)
- ✓ Task 12 → All 55 routes from PRD requirement site structure
- ✓ Task 13 → PRD requirement 15 (consultation CTA + email)
- ✓ Task 14 → Session continuity protocol from spec §11

**No gaps found. All Phase 0 spec requirements covered.**
