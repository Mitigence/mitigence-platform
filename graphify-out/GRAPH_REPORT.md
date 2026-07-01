# Graph Report - .  (2026-07-01)

## Corpus Check
- 141 files · ~70,846 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 572 nodes · 662 edges · 60 communities (24 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Homepage & Attack Surface|Homepage & Attack Surface]]
- [[_COMMUNITY_Capability Explorer|Capability Explorer]]
- [[_COMMUNITY_UI Component Library|UI Component Library]]
- [[_COMMUNITY_Knowledge & Solutions Pages|Knowledge & Solutions Pages]]
- [[_COMMUNITY_Layout, Nav & Brand|Layout, Nav & Brand]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Industry Verticals|Industry Verticals]]
- [[_COMMUNITY_Build Log & Bug History|Build Log & Bug History]]
- [[_COMMUNITY_Business Outcome Drivers|Business Outcome Drivers]]
- [[_COMMUNITY_shadcnui Config|shadcn/ui Config]]
- [[_COMMUNITY_Delivery Framework Pages|Delivery Framework Pages]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Platform Module Specs|Platform Module Specs]]
- [[_COMMUNITY_Customer Workspace Preview|Customer Workspace Preview]]
- [[_COMMUNITY_Consultation Form & Flow|Consultation Form & Flow]]
- [[_COMMUNITY_Engineering Studio|Engineering Studio]]
- [[_COMMUNITY_Success Stories|Success Stories]]
- [[_COMMUNITY_Delivery Model Explorer|Delivery Model Explorer]]
- [[_COMMUNITY_Approach Page|Approach Page]]
- [[_COMMUNITY_Contact Page|Contact Page]]
- [[_COMMUNITY_Platform Vision & Design Principles|Platform Vision & Design Principles]]
- [[_COMMUNITY_Solutions Overview|Solutions Overview]]
- [[_COMMUNITY_About Page|About Page]]
- [[_COMMUNITY_Careers Page|Careers Page]]
- [[_COMMUNITY_Lead Capture API|Lead Capture API]]
- [[_COMMUNITY_Company Page|Company Page]]
- [[_COMMUNITY_Engineering Services|Engineering Services]]
- [[_COMMUNITY_Platform Experiences|Platform Experiences]]
- [[_COMMUNITY_Threat Insights|Threat Insights]]
- [[_COMMUNITY_Privacy Policy|Privacy Policy]]
- [[_COMMUNITY_Terms of Service|Terms of Service]]
- [[_COMMUNITY_Claude Permissions Config|Claude Permissions Config]]
- [[_COMMUNITY_Contact Form API|Contact Form API]]
- [[_COMMUNITY_Customer Success Page|Customer Success Page]]
- [[_COMMUNITY_Solutions Data Page|Solutions Data Page]]
- [[_COMMUNITY_Engineering Health Checks|Engineering Health Checks]]
- [[_COMMUNITY_Engineering Integration|Engineering Integration]]
- [[_COMMUNITY_Engineering Optimization|Engineering Optimization]]
- [[_COMMUNITY_Project Timeline|Project Timeline]]
- [[_COMMUNITY_Remote Access Solutions|Remote Access Solutions]]
- [[_COMMUNITY_Configuration Review|Configuration Review]]
- [[_COMMUNITY_Engineering Deployment|Engineering Deployment]]
- [[_COMMUNITY_Operational Readiness|Operational Readiness]]
- [[_COMMUNITY_Continuous Improvement|Continuous Improvement]]
- [[_COMMUNITY_Reports Page|Reports Page]]
- [[_COMMUNITY_Sitemap|Sitemap]]
- [[_COMMUNITY_Endpoints Solutions|Endpoints Solutions]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Bug Log Doc|Bug Log Doc]]
- [[_COMMUNITY_File Map|File Map]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Window Icon|Window Icon]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 40 edges
2. `dependencies` - 16 edges
3. `compilerOptions` - 16 edges
4. `defaultTransition` - 11 edges
5. `useJourneyStore` - 11 edges
6. `14 Frozen Module Definitions` - 11 edges
7. `devDependencies` - 9 edges
8. `Build Log — Mitigence Platform` - 9 edges
9. `KnowledgeTopic()` - 8 edges
10. `IndustryPage()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Logo — White triangle on transparent` --conceptually_related_to--> `Phase 0 Foundation Implementation`  [INFERRED]
  public/vercel.svg → BUILD_LOG.md
- `cn()` --calls--> `clsx`  [INFERRED]
  src/lib/utils.ts → package.json
- `Mitigence Logo (SVG) — Complex brand mark with raster embed` --conceptually_related_to--> `BUG-003 Footer img onError State Update Error`  [INFERRED]
  public/logo.svg → BUG_LOG.md
- `Next.js Wordmark — Black on white` --conceptually_related_to--> `README — Next.js Project Scaffold`  [INFERRED]
  public/next.svg → README.md
- `README — Next.js Project Scaffold` --conceptually_related_to--> `Phase 0 Foundation Implementation Plan`  [INFERRED]
  README.md → docs/superpowers/plans/2026-06-30-phase-0-foundation.md

## Hyperedges (group relationships)
- **Spec + Plan + Build Log form the Session Continuity Protocol** — spec_frozen, plan_phase0, buildlog_mitigence, contentlog_mitigence, buglog_mitigence [EXTRACTED 0.95]
- **Journey Designer → Engagement Studio → Team Builder share Zustand state** — prd_security_journey_designer, prd_engagement_studio, prd_team_builder [EXTRACTED 0.95]
- **Understand / Engineer / Operate form the master IA** — prd_interactive_enterprise_map, prd_engagement_studio, prd_customer_workspace [EXTRACTED 0.90]

## Communities (60 total, 36 thin omitted)

### Community 0 - "Homepage & Attack Surface"
Cohesion: 0.06
Nodes (30): metadata, bullets, failurePoints, HomeSections1(), phases, pillars, stats, capabilities (+22 more)

### Community 1 - "Capability Explorer"
Cohesion: 0.06
Nodes (25): CapabilityExplorer(), metadata, domains, domains, stages, pods, EngagementStudio(), StageId (+17 more)

### Community 2 - "UI Component Library"
Cohesion: 0.08
Nodes (33): cn(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Button() (+25 more)

### Community 3 - "Knowledge & Solutions Pages"
Cohesion: 0.06
Nodes (10): metadata, metadata, metadata, topics, metadata, metadata, KnowledgeTopic(), KnowledgeTopicProps (+2 more)

### Community 4 - "Layout, Nav & Brand"
Cohesion: 0.06
Nodes (21): metadata, nunito, organizationJsonLd, Lead, LeadCaptureBot(), Message, Step, steps (+13 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, class-variance-authority, clsx, framer-motion, geist, lucide-react, next, radix-ui (+25 more)

### Community 6 - "Industry Verticals"
Cohesion: 0.1
Nodes (10): industries, metadata, metadata, metadata, metadata, IndustryPage(), Props, metadata (+2 more)

### Community 7 - "Build Log & Bug History"
Cohesion: 0.1
Nodes (24): Next.js Agent Rules, BUG-001 Tailwind v4 border-border Syntax Error, BUG-002 shadcn/ui Overwrote Brand HSL Tokens, BUG-003 Footer img onError State Update Error, BUG-004 PageShell Children Prop Confusion, Build Log — Mitigence Platform, Phase 0 Foundation Implementation, Phase 1 Core Interactive Modules (+16 more)

### Community 8 - "Business Outcome Drivers"
Cohesion: 0.09
Nodes (22): businessContexts, improve-response-readiness, improve-visibility, increase-resilience, reduce-operational-risk, strengthen-architecture, support-business-growth, environments (+14 more)

### Community 9 - "shadcn/ui Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Delivery Framework Pages"
Cohesion: 0.12
Nodes (8): metadata, metadata, PageShell(), PageShellProps, metadata, metadata, metadata, metadata

### Community 11 - "TypeScript Config"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Platform Module Specs"
Cohesion: 0.18
Nodes (14): Capability Explorer — Module 4, Enterprise Conversion Architecture: 6 Psychological Stages, Customer Workspace — Module 10, Engagement Studio — Module 3, Engineering Studio — Module 5, Interactive Enterprise Map — Module 1, Knowledge Center — Module 11, Delivery Model Explorer — Module 7 (+6 more)

### Community 13 - "Customer Workspace Preview"
Cohesion: 0.18
Nodes (9): CustomerWorkspacePreview(), mockDeliverables, mockMeetings, mockProject, mockRecommendations, mockReports, Tab, TABS (+1 more)

### Community 14 - "Consultation Form & Flow"
Cohesion: 0.29
Nodes (4): ConsultationForm(), FormData, STEPS, metadata

### Community 15 - "Engineering Studio"
Cohesion: 0.33
Nodes (3): phases, EngineeringStudio(), metadata

### Community 17 - "Delivery Model Explorer"
Cohesion: 0.33
Nodes (3): models, DeliveryModelExplorer(), metadata

### Community 18 - "Approach Page"
Cohesion: 0.4
Nodes (3): commitments, metadata, phases

### Community 20 - "Platform Vision & Design Principles"
Cohesion: 0.4
Nodes (5): Design Principles: Professional, Technical, Modern, Structured, Homepage Information Hierarchy (13 sections), Three Platform Pillars: Discover / Design / Deliver, Core Experience Model: Understand / Engineer / Operate, Platform Vision: Cybersecurity Delivery & Engineering Platform

### Community 24 - "Lead Capture API"
Cohesion: 0.67
Nodes (3): LeadData, POST(), row()

## Knowledge Gaps
- **238 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Component Library` to `Layout, Nav & Brand`, `Package Dependencies`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `clsx` connect `Package Dependencies` to `UI Component Library`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage & Attack Surface` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Capability Explorer` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Knowledge & Solutions Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._