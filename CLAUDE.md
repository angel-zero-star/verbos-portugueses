# Verbos — Design System

## Stack
- React + Tailwind CSS + shadcn-style components + Framer Motion
- All logic lives in App.js — never touch verb data, game state, or localStorage keys
- shadcn-style components preferred over raw HTML for buttons, inputs, cards, badges

## Visual Direction
Linear-inspired. Dark, precise, confident. **Monotone** — primary colour is reserved for the single main CTA per screen. Everything else uses transparent black/white (secondary) surfaces for a slick, tool-like aesthetic.
Not playful. Not rounded-soft.

## Color Tokens
--brand-bg:        #0A0A0B        /* near-black (light: #FAFAFA) */
--brand-surface:   #111114        /* card backgrounds */
--brand-border:    #1F1F26        /* subtle borders */
--brand-primary:   dark #3B82F6 / light #1D63D3
                                  /* blue — MAIN CTA ONLY (e.g. Começar button, progress bar, big results %)
                                     Dark: 5.5:1 contrast on dark bg; Light: 5.6:1 white text on button */
--brand-secondary: #F0F0F5 (dark) / #0A0A0B (light)
                                  /* near-white in dark mode, near-black in light mode.
                                     Always used WITH opacity (/10, /20, /25) for Linear-like
                                     transparent surfaces: filter toggles, nav active pill,
                                     segmented control, tense badge. Never used solid. */
--brand-accent:    #22C55E        /* green — correct answers */
--brand-danger:    #EF4444        /* red — wrong answers */
--brand-warn:      #F59E0B        /* amber — accent-miss warnings, passado badge */
--brand-muted:     dark #787891 / light #676779
                                  /* muted text, nav inactive — WCAG AA: 4.6:1 dark, 5.5:1 light */
--brand-text:      #F0F0F5        /* primary text */
--brand-text-sub:  dark #89899F / light #6D6D7A
                                  /* secondary text — WCAG AA: 5.8:1 dark, 5.0:1 light */

**Usage discipline:** if you're about to tint something with `primary`, ask: "is this the one main CTA on this screen?" If no, use `secondary/10` bg + `secondary/25` border instead.

## Typography
- Display/headings: `Inter` — weight 700, tight tracking (-0.04em)
- Body/UI: `Inter` — weight 400–500
- Verb display (the big word): weight 700, 2.5–3rem, letter-spacing -0.04em
- Monospaced details (pronouns, tense labels, version): `JetBrains Mono`
- NO serif fonts anywhere

## Spacing & Radius

**4px grid — strictly enforced.**
Every padding, margin, gap, and size value MUST be a multiple of 4px.
Allowed: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, …
Forbidden: 2px, 6px, 10px, 14px (i.e. Tailwind's .5 fractional classes like `py-1.5`, `px-2.5`, `gap-0.5`).
This applies to ALL files — App.js, UI components, index.css, inline styles.
When adding or editing any spacing, double-check no `.5` suffix appears.

- Cards: rounded-lg (12px)
- Buttons: rounded-md (8px), height 36px (sm) / 44px (md) / 48px (lg) / 56px (xl)
- Input: rounded-md, height 48px, border 1px --brand-border, focus ring --brand-primary
- Page padding: 24px mobile, 40px desktop
- Max content width: 480px, centered

## Pronoun labels
- Data keys in ALL_VERBS remain `"ele/ela"` and `"eles(as)/vocês"` — DO NOT rename.
- Display label for `"ele/ela"` → `ele(a)/você` via `PRONOUN_LABELS` map in App.js.
- Always render pronouns via `pLabel(p)` helper — never render the raw key.

## Component Rules

Buttons:
- Primary: bg --brand-primary (blue), text white, hover brightness-90. Reserved for the single main CTA per screen.
- Ghost: bg transparent, border --brand-border, hover bg --brand-surface
- Destructive: border --brand-danger, text --brand-danger

Cards:
- bg --brand-surface, border 1px --brand-border, rounded-lg
- No box shadows — borders only

Input field:
- Default: border --brand-border
- Correct: border --brand-accent (green), bg accent/5
- Wrong: border --brand-danger (red), bg danger/5
- Accent miss: border --brand-warn (amber), bg warn/5

Tense badge:
- Presente: bg secondary/10, text --brand-text, border secondary/25, monospace
- Passado: bg warn/15, text --brand-warn, border warn/30, monospace

Filter toggles (TogglePill):
- Active: bg secondary/10, text --brand-text, border secondary/25
- Inactive: bg transparent, text --brand-text-sub, border --brand-border

Segmented control (SegmentedToggle):
- Container: bg secondary/5, border --brand-border, padding 4px
- Active segment: bg secondary/15, border secondary/25, animated via framer `layoutId`
- Used for Irregular/Regular switch in Settings

Nav bar:
- bg surface/85 with backdrop-blur, border-top --brand-border
- Active pill: bg secondary/10, border secondary/25, icon + label --brand-text (animated via `layoutId="nav-pill"`)
- Inactive: icon + label --brand-muted

Score/results screen:
- Big % number: 88px, weight 700, color --brand-primary (this is one of the few non-CTA uses of primary, as a hero display number)
- Star reveal: stagger each star with 150ms delay, scale from 0 → 1.2 → 1
- Rating label (Fixe!/Óptimo!/Alegria!): 22px, --brand-accent (green), weight 600

## Home screen specifics
- Portuguese flag SVG (`FlagPT`) at the top, ~56px wide, 1px border via shadow
- Headline "Verbos" — 44px display
- Version string (`verbos · v{version}`) shown **only** on the home screen, as a centered footer above the nav bar, mono font, text-sub. Not shown on any other screen.

## Settings screen specifics
- First row: theme toggle (Sun/Moon icon + Theme label + Dark/Light button). This is the ONLY place the theme can be switched.
- Second row: SegmentedToggle for Irregular/Regular
- Then bulk-toggle ghost buttons + verb list with MiniToggle per row

## Animations (Framer Motion)
- Card enter: opacity 0→1 + y 12→0, duration 0.25s, ease easeOut
- Correct feedback: quick scale 1→1.04→1 on the input border
- Wrong feedback: horizontal shake (x: 0,8,-8,6,-6,0), duration 0.4s
- Star reveal: each star staggered 150ms, spring(stiffness:400, damping:15)
- Nav pill + segmented toggle: framer `layoutId` spring(stiffness:400, damping:32)
- Screen transitions: opacity + small y fade, 0.22s — no slides

## Key Behaviours — Never Break
- Audio pronunciation (speak() function) — keep as-is
- Accent detection → amber state on input
- Confetti canvas on 10/10 correct
- Fixe! / Óptimo! / Alegria! rating labels with star counts
- localStorage keys: verbos-history, verbos-config, verbos-filters, verbos-theme
- All verb data in ALL_VERBS array — read only
- 10 cards per session, shuffled
- Enter key = check / next flow
- Pronoun data keys stay `ele/ela` / `eles(as)/vocês`; only display labels change via `pLabel`
