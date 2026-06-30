# Mitigence Experience Platform — Frozen Design Spec
**Date:** 2026-06-30
**Status:** FROZEN — No deviations permitted without explicit user approval
**PRD Reference:** /PRD.md
**Builder:** Claude Code (solo, non-technical director)

---

## 0. Project Context

Mitigence is a cybersecurity company building an interactive engagement platform — not a marketing website. The platform positions Mitigence as a Cybersecurity Delivery & Engineering Platform through three core experiences: **Understand → Engineer → Operate**.

The platform is built shell-first: all routes and structure exist from day one, interactive modules are filled in phase by phase. All content is written by a dedicated Content Agent (not placeholders) and filtered through the stopslop skill before entering any file.

**Domain:** mitigence.com (already purchased)
**Hosting:** Vercel (free tier)
**Repository:** GitHub
**Only paid cost:** Domain renewal (~$10–12/year)

---

## 1. Tech Stack (Locked)

| Concern | Decision | Reason |
|---------|----------|--------|
| Framework | Next.js 15 (App Router) | SEO, performance, routing, scales to auth |
| Styling | Tailwind CSS + shadcn/ui | Enterprise components, consistent system |
| Animations | Framer Motion | Reliable, Claude-maintainable |
| Diagrams | Custom SVG + Framer Motion | No Three.js/D3 — unmaintainable solo |
| Session State | Zustand | Simple, cross-module persistence |
| Content | JSON files + MDX | No CMS needed in Phase 1 |
| Hosting | Vercel | Free, auto-deploy from GitHub |
| Email | Resend + React Email | Consultation form, free tier |
| Analytics | Vercel Analytics | Built-in, zero config |

**Brand:** Black (#000000) primary, Red (#DC2626) accent, White (#FFFFFF) surface
**Typography:** To be selected in Phase 0 — enterprise weight, high contrast
**Logo:** Provided by client

---

## 2. Site Structure (55+ Routes)

All routes created as shells in Phase 0. Every page has correct layout and navigation before any module is filled.

```
mitigence.com/
├── /                              ← Homepage (14 experience sections)
├── /platform
│   ├── /platform/understand
│   │   ├── /enterprise-explorer
│   │   ├── /security-journey
│   │   ├── /threat-insights
│   │   ├── /industry-challenges
│   │   └── /knowledge-center
│   ├── /platform/engineer
│   │   ├── /engagement-studio
│   │   ├── /capability-explorer
│   │   ├── /engineering-studio
│   │   ├── /delivery-framework
│   │   ├── /team-builder
│   │   └── /delivery-models
│   └── /platform/operate
│       ├── /customer-workspace
│       ├── /project-timeline
│       ├── /reports
│       ├── /continuous-improvement
│       └── /customer-success
├── /solutions
│   ├── /applications
│   ├── /cloud
│   ├── /identity
│   ├── /network
│   ├── /endpoints
│   ├── /data
│   ├── /remote-access
│   └── /monitoring
├── /engineering
│   ├── /architecture
│   ├── /deployment
│   ├── /integration
│   ├── /configuration-review
│   ├── /health-checks
│   ├── /optimization
│   └── /operational-readiness
├── /industries
│   ├── /financial-services
│   ├── /healthcare
│   ├── /government
│   ├── /education
│   ├── /retail
│   └── /manufacturing
├── /knowledge
│   ├── /cloud
│   ├── /identity
│   ├── /applications
│   ├── /monitoring
│   ├── /network
│   ├── /incident-response
│   ├── /architecture
│   └── /[slug]               ← Individual articles
├── /success-stories
│   └── /[slug]               ← Individual stories
├── /company
│   ├── /about
│   ├── /approach
│   ├── /leadership
│   └── /careers
├── /contact
└── /consultation
```

---

## 3. Navigation Structure

**Global navigation (always visible):**
```
Platform | Solutions | Engineering | Industries | Knowledge | Success Stories | Company | Contact
```

**Mega-menu per section** — reveals on hover, organized by customer intent not internal departments.

**Secondary navigation** — every major section has contextual sub-navigation so users never need to return to homepage.

**No "Products", "Services", or "Resources"** in navigation — these are internal categories, not customer intent.

---

## 4. Module Definitions (14 Modules — Frozen)

### Module 1 — Interactive Enterprise Map
**Route:** Homepage hero section
**PRD:** §3.4, §3.10, Experience Block 1

Animated SVG network of 12 nodes:
- Workforce, Identity, Applications, Cloud, Third Parties, APIs, Data Platform, Email, Endpoints, Network, Remote Access, Security Operations
- Nodes pulse subtly (Framer Motion loop)
- **Hover:** node glows + connections animate + side panel slides in (attack vectors, challenges, capabilities)
- **Click:** full expanded panel (business impact, example engagement, engineering lifecycle, related story, next step CTA)

### Module 2 — Security Journey Designer
**Route:** /platform/understand/security-journey + homepage section
**PRD:** §3.21, Product 2

5-step maturity flow:
- Step 1: Maturity selector (Beginning → Growing → Scaling → Optimizing → Continuous)
- Step 2: Target state selection with animated progression arrow
- Output: Current challenges + Recommended journey roadmap
- State saved to Zustand → pre-populates Module 3

### Module 3 — Engagement Studio
**Route:** /platform/engineer/engagement-studio + homepage section
**PRD:** §3.22, §4.4, §5.5, Product 3

5-stage planning workspace:
- Stage 1: Business context (multi-select cards)
- Stage 2: Objectives / success definition (multi-select cards)
- Stage 3: Environment (visual architecture diagram morphs on selection)
- Stage 4: Scope (drag assets into engagement)
- Stage 5: Timeline (30 days → 12 months)
- Output: Recommended Journey (phases, milestones, deliverables) + Consultation CTA
- Pre-populated from Module 2 Zustand state if available

### Module 4 — Capability Explorer
**Route:** /platform/engineer/capability-explorer + homepage section
**PRD:** §3.24, Product 4

Domain exploration:
- Landing: 8 domain circles (Identity, Cloud, Applications, Monitoring, Network, Endpoints, Data, Remote Access)
- Click domain → smooth transition → domain expands full view
- Inside domain: 5–7 engineering sub-stages, each with methodology animation + deliverables
- Back navigation returns to domain grid without page reload

### Module 5 — Engineering Studio
**Route:** /platform/engineer/engineering-studio
**PRD:** §4.8, Product 5, Experience Block 4

Engineering lifecycle visualization:
- 8 phases on horizontal timeline: Architecture → Planning → Deployment → Integration → Configuration Review → Validation → Operational Readiness → Optimization
- Click stage → full panel: objective, customer inputs, Mitigence activities, deliverables, quality checkpoints, timeline
- Animated SVG diagram per stage

### Module 6 — Team Builder
**Route:** /platform/engineer/team-builder + homepage section
**PRD:** §3.9, §5.6, Product 6

Capability pod assembly:
- 5 pods: Assessment, Engineering, Operations, Incident Response, Architecture
- Each pod expands to show specialist roles inside
- User adds pods to engagement workspace
- Side panel updates dynamically: delivery model, collaboration pattern, duration, deliverables
- Budget + timeline sliders refine recommendation

### Module 7 — Delivery Model Explorer
**Route:** /platform/engineer/delivery-models + homepage section
**PRD:** §3.23, Experience 6

5 delivery model cards:
- One-Time Assessment / Project Delivery / Dedicated Specialists / Managed Operations / Strategic Partnership
- Select model → animation reveals: team, timeline, reports, meetings, workspace, deliverables, support
- Side-by-side comparison view available
- CTA: "This is how I'd like to work with Mitigence"

### Module 8 — Engineering Lifecycle (Homepage)
**Route:** Homepage section (signature animation)
**PRD:** §3.25

Circular animated lifecycle:
- 9 stages: ASSESS → PLAN → DESIGN → ENGINEER → VALIDATE → OPERATE → OPTIMIZE → REVIEW → REPEAT
- Each stage rotates into focus with expand animation
- Shows: deliverables, customer touchpoints, review points, knowledge transfer
- Referenced across all other modules as the Mitigence framework

### Module 9 — Attack Surface Explorer
**Route:** /platform/understand/enterprise-explorer + homepage section
**PRD:** §3.7

Step-through attack path:
- 6 stages: Internet → Email → Identity → Endpoint → Application → Database
- User advances with next/previous controls
- Each stage: attacker's objective, common vectors, defensive controls, Mitigence assistance
- Tone: educational, not fear-based

### Module 10 — Customer Workspace Preview
**Route:** /platform/operate/customer-workspace + homepage section
**PRD:** §3.9, §4.7, §5.7, Product 7

Simulated dashboard (no auth in Phase 1):
- Animated reveal of: projects, reports, milestones, deliverables, meetings, timeline
- Sample progress: Assessment 98% → Engineering Completed → Optimization In Progress
- Activity feed: Engineering Review Completed / Risk Report Updated / Quarterly Review Scheduled
- Interactive report preview: Executive Summary → Risk Heatmap → Affected Assets → Priority Matrix

### Module 11 — Knowledge Center
**Route:** /knowledge/* + homepage section
**PRD:** §4.9, Product 9, Experience 10

Interactive learning hub (not a blog):
- 7 topic selectors: Cloud, Identity, Applications, Monitoring, Network, Incident Response, Architecture
- Topic click → animation → diagram → explanation → Mitigence methodology → related journeys
- Individual article pages with interactive diagrams
- Related links to capability pages, success stories, consultation

### Module 12 — Success Story Explorer
**Route:** /success-stories + /success-stories/[slug]
**PRD:** §5.10, Product 8, Experience 12

Structured engagement narratives (not testimonials):
- Filter by: Industry, Organization Size, Security Objective, Environment, Delivery Model
- Each story: Challenge → Discovery → Assessment → Engineering → Validation → Outcome → Continuous Improvement
- Visual timeline per story — no PDFs, no static cards
- Every story follows identical structure

### Module 13 — Virtual Security Assistant
**Route:** Embedded in all modules (not a floating chatbot)
**PRD:** §3, Product 10, Experience 11

Contextual guidance system:
- Phase 1: pre-scripted hints triggered by user selections
- Phase 2+: Claude API for dynamic responses
- Appears as inline suggestion panel inside each module
- Example: while in Engagement Studio with hybrid environment selected → "Would you like to see a typical engineering roadmap for similar architectures?"
- Never interrupts — always contextual, always optional

### Module 14 — Security Complexity Timeline
**Route:** Homepage section
**PRD:** §3.5

Horizontally scrollable evolution timeline:
- 7 stages: On-Premises → Virtualization → Cloud → Hybrid → Remote Work → Multi-Cloud → Identity-Centric Security
- Each stage expands: new challenges introduced, why traditional approaches became insufficient, operational implications
- Builds empathy before presenting Mitigence solutions

---

## 5. Data Architecture (13 JSON Schemas)

All files live in `/data/`. Created with real content by Content Agent (not placeholders). All content passes stopslop filter before commit.

### `/data/enterprise-map.json`
```json
{
  "nodes": [{
    "id": "string",
    "label": "string",
    "position": { "x": "number", "y": "number" },
    "connections": ["node-id"],
    "hover": {
      "title": "string",
      "challenges": ["string"],
      "capabilities": ["string"]
    },
    "detail": {
      "businessImpact": "string",
      "exampleEngagement": "string",
      "engineeringLifecycle": ["string"],
      "relatedStory": "slug | null",
      "recommendedNextStep": "string",
      "ctaLabel": "string",
      "ctaHref": "string"
    }
  }]
}
```

### `/data/maturity-stages.json`
```json
{
  "stages": [{
    "id": "beginning | growing | scaling | optimizing | continuous",
    "label": "string",
    "description": "string",
    "challenges": ["string"],
    "recommendedJourney": [{
      "phase": "string",
      "description": "string"
    }],
    "relatedCapabilities": ["domain-id"]
  }]
}
```

### `/data/engagement-studio.json`
```json
{
  "businessContexts": [{ "id": "string", "label": "string", "icon": "string" }],
  "objectives": [{ "id": "string", "label": "string", "description": "string" }],
  "environments": [{
    "id": "cloud | hybrid | on-premises | multi-cloud",
    "label": "string",
    "diagramVariant": "string"
  }],
  "scopeItems": [{ "id": "string", "label": "string", "icon": "string" }],
  "timelines": [{ "id": "string", "label": "string", "weeks": "number" }],
  "recommendationRules": [{
    "conditions": { "environment": "string", "objectives": ["string"] },
    "output": {
      "phases": ["string"],
      "milestones": ["string"],
      "deliverables": ["string"]
    }
  }]
}
```

### `/data/capabilities.json`
```json
{
  "domains": [{
    "id": "string",
    "label": "string",
    "icon": "string",
    "description": "string",
    "stages": [{
      "id": "string",
      "label": "string",
      "methodology": "string",
      "animationKey": "string",
      "deliverables": ["string"],
      "relatedEngagements": ["href"]
    }]
  }]
}
```

### `/data/engineering-lifecycle.json`
```json
{
  "stages": [{
    "id": "assess | plan | design | engineer | validate | operate | optimize | review | repeat",
    "label": "string",
    "objective": "string",
    "customerInputs": ["string"],
    "mitigenceActivities": ["string"],
    "deliverables": ["string"],
    "qualityCheckpoints": ["string"],
    "typicalDuration": "string",
    "customerTouchpoints": ["string"],
    "diagramKey": "string"
  }]
}
```

### `/data/team-builder.json`
```json
{
  "pods": [{
    "id": "string",
    "label": "string",
    "description": "string",
    "specialists": [{
      "role": "string",
      "description": "string",
      "level": "string"
    }],
    "engagementImpact": {
      "deliveryModel": "string",
      "collaborationPattern": "string",
      "estimatedDuration": "string",
      "deliverables": ["string"]
    },
    "compatiblePods": ["pod-id"]
  }]
}
```

### `/data/delivery-models.json`
```json
{
  "models": [{
    "id": "string",
    "label": "string",
    "tagline": "string",
    "description": "string",
    "team": "string",
    "timeline": "string",
    "reports": ["string"],
    "meetings": ["string"],
    "deliverables": ["string"],
    "support": "string",
    "bestFor": ["string"],
    "ctaLabel": "string"
  }]
}
```

### `/data/attack-surface.json`
```json
{
  "stages": [{
    "id": "string",
    "label": "string",
    "attackerObjective": "string",
    "commonVectors": ["string"],
    "defensiveControls": ["string"],
    "mitigenceAssistance": ["string"],
    "diagramKey": "string"
  }]
}
```

### `/data/knowledge.json`
```json
{
  "topics": [{
    "id": "string",
    "label": "string",
    "slug": "string",
    "summary": "string",
    "diagramKey": "string",
    "explanation": "string",
    "mitigenceMethodology": "string",
    "relatedJourneys": ["href"],
    "relatedCapabilities": ["href"],
    "articles": ["slug"]
  }]
}
```

### `/data/success-stories.json`
```json
{
  "stories": [{
    "id": "string",
    "slug": "string",
    "title": "string",
    "filters": {
      "industry": "string",
      "orgSize": "string",
      "objective": "string",
      "environment": "string",
      "deliveryModel": "string"
    },
    "timeline": [{
      "phase": "Challenge | Discovery | Assessment | Engineering | Validation | Outcome | Improvement",
      "content": "string",
      "deliverables": ["string"],
      "duration": "string"
    }],
    "outcomes": ["string"],
    "quote": "string | null"
  }]
}
```

### `/data/assistant-hints.json`
```json
{
  "hints": [{
    "id": "string",
    "module": "string",
    "trigger": {
      "type": "selection | scroll | idle | combination",
      "conditions": {}
    },
    "message": "string",
    "ctaLabel": "string | null",
    "ctaAction": "string | null"
  }]
}
```

### `/data/industries.json`
```json
{
  "industries": [{
    "id": "string",
    "label": "string",
    "slug": "string",
    "headline": "string",
    "challenges": ["string"],
    "regulatoryContext": "string",
    "recommendedCapabilities": ["href"],
    "relevantStories": ["slug"]
  }]
}
```

### `/data/solutions.json`
```json
{
  "domains": [{
    "id": "string",
    "label": "string",
    "slug": "string",
    "headline": "string",
    "businessContext": "string",
    "commonChallenges": ["string"],
    "engineeringApproach": "string",
    "lifecycle": ["stage-id"],
    "relatedCapabilities": ["href"],
    "relatedKnowledge": ["slug"]
  }]
}
```

---

## 6. The Build Loop

Every module follows this cycle before advancing to the next:

```
MAKER        → Builds module per spec (Claude Code, isolated worktree)
CONTENT AGENT → Writes real JSON content (Claude agent, cybersecurity expert)
STOPSLOP     → Filters all content for AI writing patterns
REVIEWER     → Checks built module against this frozen spec (/code-review)
CHECKER      → Runs app, checks visual bugs, interactions, console errors (/verify)
RESOLVER     → Fixes all issues found (systematic-debugging skill)
MAKER        → Advances to next task
```

**The loop never advances on incomplete work.**

Parallel execution: Maker builds Module N while Reviewer audits Module N-1.

### Session Continuity Files

Every session reads these files first:
- `BUILD_LOG.md` — completed tasks, decisions made, what's live
- `BUG_LOG.md` — bugs found, status (open/resolved), resolution notes
- `CONTENT_LOG.md` — content written, approved, pending

---

## 7. Requirements Freeze Table (48 PRD Elements)

| # | PRD Element | Module | Phase |
|---|------------|--------|-------|
| 1 | Interactive Enterprise Map (hero) | Module 1 | 1 |
| 2 | Hero headline + CTAs | Homepage | 1 |
| 3 | Navigation + mega-menu | Global | 0 |
| 4 | Why Modern Security Is Different | Module 14 | 1 |
| 5 | Explore Your Digital Enterprise | Module 4 preview | 1 |
| 6 | Discover Your Attack Surface | Module 9 | 2 |
| 7 | Build Your Security Program | Module 2+3 | 1 |
| 8 | Build Your Cybersecurity Team | Module 6 | 2 |
| 9 | Security Engineering Lifecycle (homepage) | Module 8 | 2 |
| 10 | Delivery Models section | Module 7 | 2 |
| 11 | Capability Explorer (homepage preview) | Module 4 | 2 |
| 12 | Customer Workspace Preview | Module 10 | 4 |
| 13 | Success Stories section | Module 12 | 3 |
| 14 | Knowledge Center preview | Module 11 | 3 |
| 15 | Consultation CTA (global) | Global | 0 |
| 16 | Security Journey Designer (full page) | Module 2 | 1 |
| 17 | Engagement Studio (full page) | Module 3 | 1 |
| 18 | Capability Explorer (full page) | Module 4 | 2 |
| 19 | Engineering Studio (full page) | Module 5 | 2 |
| 20 | Team Builder (full page) | Module 6 | 2 |
| 21 | Delivery Model Explorer (full page) | Module 7 | 2 |
| 22 | Attack Surface Explorer (full page) | Module 9 | 2 |
| 23 | Customer Workspace Preview (full page) | Module 10 | 4 |
| 24 | Knowledge Center full | Module 11 | 3 |
| 25 | Success Story Explorer full | Module 12 | 3 |
| 26 | Virtual Security Assistant | Module 13 | 3 |
| 27 | /solutions/* (8 domain pages) | Solutions | 1 |
| 28 | /engineering/* (7 methodology pages) | Engineering | 2 |
| 29 | /industries/* (6 industry pages) | Industries | 3 |
| 30 | /knowledge/* (articles) | Knowledge | 3 |
| 31 | /success-stories/* (story pages) | Stories | 3 |
| 32 | /company/* (about, approach, leadership) | Company | 1 |
| 33 | /contact | Contact | 0 |
| 34 | /consultation (guided workflow) | Consultation | 1 |
| 35 | UNDERSTAND platform page | Platform | 2 |
| 36 | ENGINEER platform page | Platform | 2 |
| 37 | OPERATE platform page | Platform | 4 |
| 38 | Cross-module session state (Zustand) | Global | 0 |
| 39 | Contextual recommendations engine | Global | 1 |
| 40 | Intent-based search | Global | 4 |
| 41 | Mobile responsive optimization | Global | 4 |
| 42 | Accessibility WCAG AA | Global | Continuous |
| 43 | Analytics events | Global | 1 |
| 44 | Black + red design system | Global | 0 |
| 45 | Typography hierarchy | Global | 0 |
| 46 | Motion language (Framer Motion) | Global | 0 |
| 47 | Design tokens | Global | 0 |
| 48 | PRD compliance final review | All | 4 |

---

## 8. Build Order (80 Sessions)

### Phase 0 — Foundation
```
0.1  Initialize Next.js 15 + GitHub + Vercel
0.2  Tailwind config (black/red tokens, typography, spacing)
0.3  shadcn/ui installation + component library
0.4  Framer Motion + animation constants
0.5  Zustand store — global session state schema
0.6  Global layout — Navigation + mega-menu shell
0.7  Footer component
0.8  All 55 page routes as shells
0.9  Resend integration — consultation form
0.10 BUILD_LOG.md + BUG_LOG.md + CONTENT_LOG.md initialized
```

### Phase 1 — Core Experiences (Sessions 1–22)
```
1.1  Homepage layout structure
1.2  Hero section — headline, CTAs, layout
1.3  Module 1 — Enterprise Map SVG base
1.4  Module 1 — Hover interactions
1.5  Module 1 — Click interactions
1.6  Content Agent — enterprise-map.json
1.7  Module 14 — Complexity Timeline
1.8  Content Agent — timeline content
1.9  Module 2 — Journey Designer UI
1.10 Module 2 — Journey output + animation
1.11 Module 2 — Zustand integration
1.12 Content Agent — maturity-stages.json
1.13 Module 3 — Engagement Studio Stage 1+2
1.14 Module 3 — Engagement Studio Stage 3
1.15 Module 3 — Engagement Studio Stage 4+5
1.16 Module 3 — Recommendation output
1.17 Module 3 — Zustand pre-population
1.18 Content Agent — engagement-studio.json
1.19 /solutions/* — 8 domain pages
1.20 /company/* — About, approach
1.21 /consultation — Guided workflow
1.22 Analytics events
```
**Gate: Homepage live. Journey Designer → Engagement Studio works end-to-end.**

### Phase 2 — Depth Modules (Sessions 23–44)
```
2.1  Module 4 — Capability Explorer domain grid
2.2  Module 4 — Domain transition animation
2.3  Module 4 — Sub-stage reveal
2.4  Content Agent — capabilities.json
2.5  Module 5 — Engineering Studio timeline
2.6  Module 5 — Stage panel expand
2.7  Content Agent — engineering-lifecycle.json
2.8  Module 8 — Lifecycle homepage section
2.9  Module 6 — Team Builder pod grid
2.10 Module 6 — Pod expand + specialist reveal
2.11 Module 6 — Side panel dynamic update
2.12 Content Agent — team-builder.json
2.13 Module 7 — Delivery Model cards
2.14 Module 7 — Model animation reveal
2.15 Content Agent — delivery-models.json
2.16 Module 9 — Attack Surface step-through
2.17 Content Agent — attack-surface.json
2.18 /engineering/* — 7 methodology pages
2.19 /platform/understand page
2.20 /platform/engineer page
2.21 Homepage remaining sections wired
2.22 Cross-module state continuity test
```
**Gate: All modules functional. Full user journey end-to-end.**

### Phase 3 — Trust Engine (Sessions 45–58)
```
3.1  Module 11 — Knowledge Center topic selector
3.2  Module 11 — Topic animation + methodology reveal
3.3  Module 11 — Article template
3.4  Content Agent — knowledge.json (7 topics)
3.5  Content Agent — first 5 knowledge articles
3.6  Module 12 — Success Story filter UI
3.7  Module 12 — Story timeline format
3.8  Module 12 — Story detail page
3.9  Content Agent — first 2 success stories
3.10 Module 13 — Assistant hint system
3.11 Module 13 — Contextual triggers
3.12 Content Agent — assistant-hints.json
3.13 /industries/* — 6 industry pages
3.14 Content Agent — industries.json
```
**Gate: Platform is a complete trust engine.**

### Phase 4 — Platform Polish (Sessions 59–80)
```
4.1  Module 10 — Workspace Preview animated reveal
4.2  Module 10 — Sample project dashboard
4.3  Module 10 — Activity feed + report preview
4.4  /platform/operate page
4.5  Intent-based search
4.6  Mobile optimization — all modules
4.7  Performance audit — lazy loading, bundle
4.8  Accessibility audit — WCAG AA
4.9  Cross-browser testing
4.10 SEO — metadata, sitemap, structured data
4.11 PRD compliance review (all 48 requirements)
4.12 Final Reviewer + Checker pass
```
**Gate: mitigence.com is the complete Phase 1 PRD vision.**

---

## 9. Content Strategy

The Content Agent is a parallel role in every build cycle:

**Briefed with:** PRD section + JSON schema + cybersecurity domain context + client inputs
**Outputs:** Real, professional cybersecurity content (not placeholders)
**Filter:** All content passes stopslop before commit
**Escalation:** Pauses and asks client when Mitigence-specific information is needed

**Client provides:**
- Mitigence's specific methodology and approach
- Actual success stories and outcomes (when available)
- Team, leadership, company narrative
- Specific service offerings and differentiators
- Brand tone preferences

**Content Agent handles:**
- Cybersecurity domain knowledge (attack vectors, methodologies, best practices)
- Engineering lifecycle descriptions
- Industry challenge context
- Knowledge Center articles

---

## 10. Design Principles (Non-Negotiable)

From PRD §7 and §12 — applied to every decision:

1. **Explain before selling** — every module educates first
2. **Engineer before marketing** — show methodology, not claims
3. **Outcomes before services** — never list service names
4. **No fear-based messaging** — confidence, not anxiety
5. **No vendor logos** — capabilities, not technologies
6. **Interaction with purpose** — every animation must clarify or guide
7. **Progressive disclosure** — reveal complexity in layers
8. **Accessibility by default** — WCAG AA throughout

---

## 11. Session Continuity Protocol

Every new Claude session begins by reading:
1. This spec document
2. `BUILD_LOG.md` — what's built, what's live
3. `BUG_LOG.md` — open bugs, resolved bugs
4. `CONTENT_LOG.md` — content written and approved

Every session ends by updating the relevant log file.

**No session begins without reading the logs. No session ends without updating them.**

---

*This document is frozen. Changes require explicit user approval and must be logged with reason.*
*Last updated: 2026-06-30*
