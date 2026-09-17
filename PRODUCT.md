# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Presenter** (the workshop facilitator) — runs a live 90-minute session, reads guidance at arm's length on a laptop while talking, needs pacing at a glance (two clocks, drift, control points).
- **Audience in the room** — cadets for local government (צוערים לשלטון המקומי), mixed skill (≈47% beginners / 47% experienced), reading a projected screen from 3–10m in a lit room.
- **Participants on their own phones** — follow along in `study` mode: what to do now, steps, copyable prompts, "stuck?", "finished early?".

## Product Purpose

A live-lecture tool, not a self-study site. The screen is an anchor, not a document: the projected slide holds a headline and a short anchor; full explanations live in the presenter drawer and on participants' devices. Each participant picks one municipal case and builds four artifacts on it — prompt, structured document, decision deck, interactive resident page. Success: the room actually builds, on time.

## Positioning

One content source rendered for three audiences at three reading distances (project / glance / read), with a pacing engine that knows each stage's budget and tells the presenter where they stand and what to skip.

## Operating Context

- Lit room, standard projector (confirmed). A darker `hall` theme remains an opt-in.
- Routes: `#/d/:deckId/present/:slug` (presenter), `#/d/:deckId/study/:slug` (participants), `#/d/:deckId/:slug` (plain share link).
- 13 stages, keyboard / swipe navigation, grid overview, QR entry for participants.

## Capabilities and Constraints

- React 19 + Vite, plain CSS with primitive → semantic token layers and `data-distance` type scales.
- Content is data (`content/decks/*/deck.json`); no raw HTML; scenes: hero, concept, compare, prompt-board, activity.
- Hebrew, RTL-first; Latin only for technical strings.
- Fonts self-hosted (runs under a ministry's name; participants' browsers should not call third parties).

## Brand Commitments

- **Must keep:** the Ministry of Interior (משרד הפנים) and Cadets program (צוערים לשלטון המקומי) logos, visible on landing and in the top bar.
- Previous navy palette, Heebo, and the single-accent "orange = your turn" rule are **not** binding (user confirmed, 2026-09-17).
- Register: bold but official (נועז אבל ממלכתי) — confident and colorful, no gimmicks, must read well under a government name.

## Evidence on Hand

- Real deck content: `content/decks/ai-cadets-2026/deck.json`.
- Survey findings and pedagogy: `documentation/PEDAGOGY.md`.
- Logos: `src/assets/brand/`.

## Product Principles

1. The projected screen is an anchor, never a paragraph.
2. Split the room vertically, not by identity: floor → safety net → ceiling, same order every exercise.
3. Presenter information must be readable in ~1.5 seconds while talking.
4. Every surface is one system at a different reading distance.

## Accessibility & Inclusion

Israeli IS 5568 / WCAG AA for a public-sector context; Hebrew screen-reader compatibility; reduced-motion respected.
