---
name: בונים עם AI — Presentation Platform
description: A live-workshop deck in Quiet Chroma — soft part climates, white rounded cards, Apple-blue actions.
colors:
  amber-tint: '#fbf4e6'
  amber-soft: '#f2e1c2'
  amber-accent: '#c9a562'
  amber-deep: '#725518'
  coral-tint: '#fff1ec'
  coral-soft: '#fedacc'
  coral-accent: '#de977b'
  coral-deep: '#824933'
  sage-tint: '#ecf9ed'
  sage-soft: '#cfecd3'
  sage-accent: '#7ebc8b'
  sage-deep: '#346841'
  lagoon-tint: '#e6f9fa'
  lagoon-soft: '#c1edef'
  lagoon-accent: '#56bdc2'
  lagoon-deep: '#04686c'
  periwinkle-tint: '#f0f4fe'
  periwinkle-soft: '#d8e3fe'
  periwinkle-accent: '#91a9e8'
  periwinkle-deep: '#46588b'
  lavender-tint: '#f7f2ff'
  lavender-soft: '#eadcfc'
  lavender-accent: '#b99cdb'
  lavender-deep: '#664e81'
  rose-tint: '#fff0f2'
  rose-soft: '#ffd7dd'
  rose-accent: '#df919f'
  rose-deep: '#834552'
  apple-blue: '#0071e3'
  apple-blue-hover: '#0077ed'
  error-red: '#d70015'
  card-white: '#ffffff'
  page-grey: '#f5f5f7'
  fill-grey: '#e8e8ed'
  hairline: '#d2d2d7'
  ink: '#1d1d1f'
  ink-secondary: '#6e6e73'
typography:
  display:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: 'clamp(3.8rem, 6.5vw, 6.5rem)'
    fontWeight: 700
    lineHeight: 1.02
  headline:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: 'clamp(3.2rem, 5.2vw, 5.2rem)'
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.75
  subtitle:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 300
    lineHeight: 1.3
  label:
    fontFamily: 'Noto Sans Hebrew, -apple-system, system-ui, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 600
  numeral:
    fontFamily: 'JetBrains Mono, ui-monospace, monospace'
    fontSize: '1rem'
    fontWeight: 400
    fontFeature: "'tnum'"
rounded:
  sm: '10px'
  md: '14px'
  lg: '22px'
  xl: '30px'
  board: '40px'
  pill: '999px'
spacing:
  s-1: '4px'
  s-2: '8px'
  s-3: '12px'
  s-4: '16px'
  s-5: '24px'
  s-6: '32px'
  s-7: '48px'
  s-8: '64px'
components:
  button-primary:
    backgroundColor: '{colors.apple-blue}'
    textColor: '{colors.card-white}'
    rounded: '{rounded.pill}'
    padding: '9px 22px'
    height: '44px'
  button-primary-hover:
    backgroundColor: '{colors.apple-blue-hover}'
  button-secondary:
    backgroundColor: '{colors.fill-grey}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '9px 22px'
    height: '44px'
  icon-button:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '36px'
  part-chip:
    backgroundColor: '{colors.sage-soft}'
    textColor: '{colors.sage-deep}'
    rounded: '{rounded.pill}'
    padding: '2px 12px'
  scene-card:
    backgroundColor: '{colors.card-white}'
    rounded: '{rounded.xl}'
  input-field:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    padding: '8px 12px'
---

# Design System: בונים עם AI — Presentation Platform

## Overview

**Creative North Star: "Quiet Chroma"**

Colour works as a climate here, not an alarm. Every part of the session (פתיחה, יסודות, פרומפטינג, עצירה, בנייה, ארגז הכלים, סיום) lives in its own soft colour climate. All seven climates share the same perceptual lightness and restrained chroma (OKLCH), so no part shouts over another and the eye can rest.

The part's tint fills the ground of the slide. Content sits on a white card with generous, nested corners, lifted a fraction of a millimetre by an ambient shadow. Actions are Apple blue on every part. The structure carries over from the previous system: one colour per part, a card on a ground, and a rail of tabs drawn to scale. Only the intensity and the form language changed.

The system is calm, modern and official, in the register of Apple and Tesla product surfaces. It is spare and luminous, and space does the separating that rules and boxes used to do.

**Key Characteristics:**

- Seven part climates, four steps each: tint, soft, accent, deep.
- White cards with 30px corners on a tinted ground; every corner is continuous and nested.
- One action colour: Apple blue capsules.
- Wide, calm heads in Noto Sans Hebrew 700 at full width. Light 300 subtitles. Mono only for clocks and counts.
- Frosted glass bars (head, stage bar, drawer, nav) and hairline separators.
- Smooth, short motion (160–240ms, standard ease), never bouncy.

## Colors

The palette is seven soft climates, Apple system neutrals, one blue, and one red for errors.

### Primary: the part climates

Each climate has four steps, used the same way everywhere:

- **Tint** (L .968): the slide's ground, why-it-matters notes, the current row in the table of contents.
- **Soft** (L .915): chips, rail tabs, the do-now panel, step numbers, prompt highlights.
- **Accent** (L .74): the single saturated mark — the current rail tab, list dots, progress capsules.
- **Deep** (L .47): the part's colour as text on tint, soft or white (≥6:1).

In part order the climates are: Amber (פתיחה), Coral (יסודות), Sage (פרומפטינג), Lagoon (עצירה), Periwinkle (בנייה), Lavender (ארגז הכלים) and Rose (סיום). The token keys keep their historical names (`--hue-yellow` … `--hue-sienna`); the comment in `tokens/primitive.css` maps them.

### Secondary: action

- **Apple Blue** (#0071e3, hover #0077ed): every primary button, the "next" controls, the copy button, focus rings (at 55%). In the hall theme it becomes #2997ff.

### Tertiary: errors

- **Error Red** (#d70015 on #ffe5e7): failures only — a failed copy, a wrong presenter code, a finished timer.

### Neutral

- **Card White** (#ffffff): scene cards, list groups, inputs.
- **Page Grey** (#f5f5f7): the page, grey wells (prompt sheets, timer, concept cards).
- **Fill Grey** (#e8e8ed): secondary buttons, sunken states.
- **Hairline** (#d2d2d7 / #e5e5ea): separators inside grouped lists and under bars.
- **Ink** (#1d1d1f) and **Secondary** (#6e6e73): text.

### Named Rules

**The Same-Lightness Rule.** All seven climates sit at the same OKLCH lightness per step. A new climate is added by changing hue only, never lightness or chroma.

**The One Blue Rule.** Primary actions are Apple blue on every part. A button never takes its part's colour.

**The Calm Warning Rule.** Running late is coral, never red: there are people watching. Red means wrong.

## Typography

**Display / Body Font:** Noto Sans Hebrew, variable, at full width (with -apple-system and system-ui as fallbacks).
**Numeral Font:** JetBrains Mono, for clocks, counts and minutes only.

**Character:** One calm family throughout. Heads are wide and bold but never condensed. Subtitles are light (300). Numbers speak in a quiet mono.

### Hierarchy

The type scale is set once per viewing distance via `data-distance` (`read` / `glance` / `project`). Components name a step (`--fs-100`…`--fs-800`).

- **Display** (700, `--fs-800`, lh 1.02): hero titles, pre-flight title.
- **Headline** (700, `--fs-700`, capped to its column with `14.5cqi`): the page head in the start column.
- **Title** (600, `--fs-400`–`--fs-500`): concept terms, drawer "next", group titles.
- **Subtitle** (300, `--fs-400`–`--fs-500`): scene subtitles, landing description.
- **Body** (400, `--fs-300`, lh 1.75 at read distance): lists, steps, prompts.
- **Label** (500–600, `--fs-100`–`--fs-200`): chips and tags.
- **Numeral** (JetBrains Mono 400, tabular): timers, counts (`04/13`), minutes (`12′`).

### Named Rules

**The No-Tracking Rule.** Hebrew is never letter-spaced. Emphasis comes from weight and size.

## Layout

- **Projected slide:** the part's tint fills the stage. A white card (radius 30px) sits on it with a 10–24px margin. Inside, `.scene-shell--page` puts the head, subtitle and illustration in a start column, with the body in the wide column. The two are separated by space, not a rule.
- **Rail:** 40px wide on the left edge above 900px, holding 10px capsules proportional to minutes. Below 900px it becomes a horizontal strip of 4px capsules under the head.
- **Chrome insets:** fixed bars are measured (`useChromeInsets`) and published as `--inset-top` / `--inset-bottom`, and `.viewport` ends exactly where they begin. Content never scrolls under a bar.
- **Participant phone:** grey page, a 40rem column, frosted stage bar on top, and a bottom nav of three 48px capsules.
- **Rhythm:** 4px base (`--s-1`…`--s-8`).

## Elevation & Depth

Depth is ambient. Cards float a fraction above their ground, and bars are frosted glass. There are no hard shadows and no ink borders.

### Shadow Vocabulary

- **Card** (`0 1px 2px rgb(0 0 0 / 4%), 0 12px 40px -12px rgb(0 0 0 / 12%)`): the scene card.
- **Soft** (`0 1px 2px rgb(0 0 0 / 4%), 0 4px 16px -4px rgb(0 0 0 / 8%)`): landing doors, list groups, the QR code.
- **Lift** (`0 2px 6px rgb(0 0 0 / 5%), 0 20px 48px -16px rgb(0 0 0 / 18%)`): door hover.
- **Glass** (`background: rgb(251 251 253 / 82%)`, `backdrop-filter: saturate(180%) blur(20px)`): the head, stage bar, drawer, bottom nav and pre-flight action bar.

### Named Rules

**The Ambient Rule.** A shadow is always wide, soft and faint. Structure comes from space and grey wells, never from outlines.

## Shapes

Every corner is continuous and nested: an outer shape's radius always exceeds the radius of what it holds.

- Stage card: 30px (22px on phones).
- Wells and notes: 22px.
- Inputs: 14px.
- Buttons, chips, rail tabs, progress bars: capsules.
- Step numbers, icon buttons, checkboxes, list markers: circles.
- Icons: 1.75px strokes with round caps and joins.

## Components

### Buttons

- **Primary:** blue capsule, white 500 label, 44px minimum height. Hover lightens it; press scales it to 0.98.
- **Secondary:** fill-grey capsule with an ink label. Hover darkens it 7%.
- **Icon button:** a 36px circle, transparent until hover. Plain-mode "next" and the drawer's "next" are filled blue circles.

### Chips

- **Part chip:** a soft-climate capsule with deep text. In the running head it has a 7px accent dot.
- **Tags** (why-it-matters, prompt label, control point): soft capsules above their content, never hanging off an edge.

### Notes and Wells

- **Callout:** a tint card, 22px radius, no border, with an 8px tone dot before the title. Tones: info = periwinkle, success = sage, warning = amber, danger = red, default = the part.
- **Prompt sheet:** a grey well with a tag capsule and the prompt in body text. Highlights are soft-climate spans (0.3em radius).
- **Concept card / table / details:** grey wells with hairline rows.

### Inputs

- **Field:** white with a 1px hairline edge and 14px radius. Focus turns the border blue with a 4px blue focus ring.
- **Checkbox:** a circle that fills blue with a white check.

### Do-Now

A soft-climate panel (30px radius) with a 600-weight imperative. The timebox is a white capsule holding a mono clock and a blue start capsule.

### Navigation

- **Running head:** a frosted glass bar holding both logos, a mode chip, the part chip, the stage, a mono count, and circular icon buttons.
- **Tab rail:** capsules per stage, proportional to minutes, in the part's soft colour, with past stages at 55% opacity. The current stage is a 30px accent capsule carrying its minutes and part name. When the presenter runs late it gets a coral ring.
- **Table of contents:** iOS grouped lists — one white rounded group per part, with the part named in a soft chip beside it.
- **Participant nav:** three capsules ("הקודם", "לפרומפט", and "הבא" in blue).

### Presenter Drawer

A frosted bar holding circular prev/next buttons (next is blue), the count, the part chip, the session clock with a drift capsule (sage when ahead, coral when behind), the timer and "הבא". A 3px accent capsule above the bar shows the stage budget. Opened, the drawer shows three white readout tiles, control-point and recovery notes on tint, and capsule actions.

## Do's and Don'ts

### Do:

- **Do** derive every part colour through `hueStyle()` and the `--sec*` roles (soft, tint, accent, deep).
- **Do** keep primary actions Apple blue on every part.
- **Do** nest radii: card 30, well 22, input 14, capsules for everything interactive.
- **Do** separate with space and grey wells before reaching for a hairline.
- **Do** let fixed bars publish their size through `--inset-top` / `--inset-bottom`.
- **Do** use `--ease-out` at 160–240ms, and keep the reduced-motion fallback.

### Don't:

- **Don't** use full-strength saturated fills or dark ink borders. The accent step is the most saturated a part ever gets.
- **Don't** use red for "late". Coral is late; red is wrong.
- **Don't** add eyebrows or kickers above headings, or labels hanging off card edges.
- **Don't** use hard offset shadows, gradients, glyphs or emoji as icons. Icons come from `src/assets/icons/Icon.tsx`.
- **Don't** letter-space Hebrew, or set Hebrew in mono.
- **Don't** pad content to guess a bar's height.
