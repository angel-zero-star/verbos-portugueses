# Verbos — Design System

## Stack
- React + Tailwind CSS + shadcn/ui + Framer Motion
- All logic lives in App.js — never touch verb data, game state, or localStorage keys
- shadcn components preferred over raw HTML for buttons, inputs, cards, badges

## Visual Direction
Linear-inspired. Dark, precise, confident.
Not playful. Not rounded-soft. Slick tool aesthetic.

## Color Tokens
--brand-bg:        #0A0A0B        /* near-black */
--brand-surface:   #111114        /* card backgrounds */
--brand-border:    #1F1F26        /* subtle borders */
--brand-primary:   #FF2D6B        /* hot pink — CTA, active states */
--brand-accent:    #F5E03A        /* electric yellow — correct answers, success */
--brand-danger:    #FF6B35        /* orange-red — wrong answers */
--brand-warn:      #F59E0B        /* amber — accent warnings */
--brand-muted:     #3A3A4A        /* muted text, disabled */
--brand-text:      #F0F0F5        /* primary text */
--brand-text-sub:  #5A5A6E        /* secondary text */

## Typography
- Display/headings: `Inter` or `DM Sans` — weight 600, tight tracking (-0.03em)
- Body/UI: `Inter` — weight 400–500
- Verb display (the big word): weight 700, 2.5–3rem, letter-spacing -0.04em
- Monospaced details (pronouns, tense labels): `JetBrains Mono` or `IBM Plex Mono`
- NO serif fonts anywhere

## Spacing & Radius
- Base unit: 4px
- Cards: rounded-xl (12px)
- Buttons: rounded-lg (8px), height 40px
- Input: rounded-lg, height 48px, border 1px --brand-border, focus ring --brand-primary
- Page padding: 24px mobile, 40px desktop
- Max content width: 480px, centered

## Component Rules

Buttons:
- Primary: bg --brand-primary, text white, hover brightness-90
- Ghost: bg transparent, border --brand-border, hover bg --brand-surface
- Destructive: border --brand-danger, text --brand-danger

Cards:
- bg --brand-surface, border 1px --brand-border, rounded-xl
- No box shadows — borders only

Input field:
- Default: border --brand-border
- Correct: border --brand-accent, bg rgba(245,224,58,0.05)
- Wrong: border --brand-danger, bg rgba(255,107,53,0.05)
- Accent miss: border --brand-warn, bg rgba(245,158,11,0.05)

Tense badge:
- Presente: bg rgba(124,106,247,0.15), text --brand-primary, monospace
- Passado: bg rgba(255,77,106,0.12), text --brand-danger, monospace

Nav bar:
- bg --brand-surface, border-top --brand-border
- Active: pill bg rgba(255,45,107,0.20), icon --brand-primary
- Inactive: icon --brand-muted

Score/results screen:
- Big % number: 80px, weight 700, color --brand-primary
- Star reveal: stagger each star with 150ms delay, scale from 0 → 1.2 → 1
- Rating label (Fixe!/Óptimo!/Alegria!): 24px, --brand-accent, weight 600

## Animations (Framer Motion)
- Card enter: opacity 0→1 + y 12→0, duration 0.25s, ease easeOut
- Correct feedback: quick scale 1→1.05→1 on the input border
- Wrong feedback: horizontal shake (x: 0,8,-8,6,-6,0), duration 0.35s
- Star reveal: each star staggered 150ms, spring(stiffness:400, damping:15)
- Screen transitions: opacity fade 0.2s only — no slides

## Key Behaviours — Never Break
- Audio pronunciation (speak() function) — keep as-is
- Accent detection → orange/amber state on input
- Confetti canvas on 10/10 correct
- Fixe! / Óptimo! / Alegria! rating labels with star counts
- localStorage keys: verbos-history, verbos-config, verbos-filters
- All verb data in ALL_VERBS array — read only
- 10 cards per session, shuffled
- Enter key = check / next flow
