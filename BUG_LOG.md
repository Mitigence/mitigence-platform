# Bug Log — Mitigence Platform

## Instructions
Every Checker/Resolver session logs bugs here.
Format: `[YYYY-MM-DD HH:MM] BUG-XXX | Module | Description | Status: OPEN/RESOLVED | Fix: [description]`

## Resolved Bugs

[2026-06-30 19:22] BUG-001 | Design System | Tailwind v4 unknown utility `border-border` in globals.css v3 syntax | Status: RESOLVED
- **Error:** Unknown utility class `border-border` when running `npm run build`
- **Root Cause:** Initial globals.css used Tailwind v3 syntax with incorrect CSS variable references; Tailwind v4 requires HSL function calls
- **Fix:** Rewrote globals.css with proper HSL color variables and corrected the border style on `*` selector
- **Verification:** Build passes with `✓ Compiled successfully`
- **Related Task:** Task 2 (Design System)

[2026-06-30 19:28] BUG-002 | Component Library | shadcn/ui v4 init overwrote custom brand HSL tokens in tailwind.config.ts | Status: RESOLVED
- **Error:** After `npx shadcn@latest init`, tailwind.config.ts lost the custom red accent color (#DC2626) and brand color definitions
- **Root Cause:** shadcn CLI replaced entire tailwind.config.ts with default Neutral base colors, overwriting custom theme extensions
- **Fix:** Manually restored brand color tokens in tailwind.config.ts after shadcn initialization; re-added custom accent (0 72% 51%) and color overrides
- **Prevention:** Keep backup of custom tailwind.config before running shadcn CLI in future
- **Related Task:** Task 3 (Component Library)

[2026-06-30 19:52] BUG-003 | Layout/Navigation | Footer img onError handler causes "state update on unmounted component" error in browser console | Status: RESOLVED
- **Error:** Client-side event handler (img onError) in Footer.tsx, but Footer was originally imported as server component in root layout
- **Root Cause:** Logo fallback handler `(e) => { target.insertAdjacentHTML(...) }` is client-side event, incompatible with server component
- **Fix:** Added 'use client' directive to Footer.tsx to enable client-side event handlers
- **Verification:** No console errors; onError fallback works correctly when logo.svg not provided
- **Related Task:** Task 8 (Footer Component)

[2026-06-30 19:58] BUG-004 | Layout/PageShell | PageShell interface accepted `children` prop but component only renders static shell with no children | Status: RESOLVED
- **Error:** PageShell initially designed as layout wrapper (accepting children), but needed only as static shell for minimal pages
- **Root Cause:** Confusion about PageShell's role; spec required it as a shell component, not a layout wrapper
- **Fix:** Rewrote PageShell to remove children prop; now only accepts title, description, phase, module. Navigation and Footer handled by root layout instead.
- **Verification:** All 55 pages render correctly without trying to pass children to PageShell
- **Related Task:** Task 9 (PageShell Component)

## Open Bugs

None identified as of Phase 0 completion.

## Bug Tracking Format

Each bug entry includes:
- **ID:** BUG-XXX (sequential)
- **Date/Time:** ISO 8601 with 24-hour time
- **Module:** Which component/system affected
- **Description:** One-line summary
- **Status:** OPEN, IN_PROGRESS, or RESOLVED
- **Error:** What broke (console error, visual glitch, build failure)
- **Root Cause:** Why it happened
- **Fix:** What was changed
- **Verification:** How we confirmed the fix works
- **Related Task:** Which task introduced or resolved this

## Severity Levels (for future use)

- **Critical:** Build fails, deployment blocked, user data loss risk
- **High:** Feature broken, cannot proceed with development, workaround exists
- **Medium:** Feature partially broken, user can still work, plan to fix in next session
- **Low:** Minor visual glitch, typo, nice-to-have fix, no user impact

## Statistics

- **Total Bugs:** 4
- **Resolved:** 4
- **Open:** 0
- **Blocked:** 0
- **Phase 0 Success Rate:** 100% (all bugs fixed before completion)
