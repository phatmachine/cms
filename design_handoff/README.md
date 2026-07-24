# Handoff: Rethink the Machine — Campaign Homepage

## Overview
Campaign homepage for **Rethink the Machine** (human vs. machine — breaking away from tech). A full-screen dark "Signal" hero with an auto-advancing carousel: each slide calls out a global tech product (title, brand, category) over a full-bleed background video or image, with a portrait thumbnail strip/index below, a logo top-left, an "equals" menu button top-right that slides in a site-index panel, and a light "Stone/flesh" footer with placeholder menus.

Target codebase: **Payload CMS 3 + Next.js** (`phatmachine/cms`, App Router, `src/app/(frontend)/`).

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing intended look and behavior, not production code to copy directly. The task is to **recreate this design in the Next.js frontend** using its established patterns (React server components + a `'use client'` carousel component), with content served from Payload collections. `Homepage.dc.html` contains all markup (inline-styled) and a plain React-style logic class at the bottom of the file — the carousel/menu logic ports nearly line-for-line.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final. Recreate pixel-perfectly. All values come from the bundled token files (`tokens/*.css`) — style against the CSS custom properties, not hardcoded hex.

## Screens / Views

### 1. Hero (dark — `data-theme="signal"`)
Full-viewport (`min-height:100vh`), flows in document order (header → slide text → thumbnail strip); footer always sits below in normal flow. Background layers are absolutely positioned behind content.

- **Background per slide**: full-bleed `<video autoplay muted loop playsinline>` (object-fit:cover) when the slide has a video, else an image. All slides stacked absolute inset:0, crossfade via opacity, `transition: opacity 900ms ease`.
- **Scrim**: `linear-gradient(180deg, rgba(10,11,11,.55), rgba(22,36,38,~0.4) 45%, rgba(10,11,11,.85))` over every slide.
- **Pattern overlay** (above backgrounds, below content, pointer-events:none). Variants:
  - points (default): `radial-gradient(rgba(242,244,243,0.13) 1px, transparent 1.5px)`, size 26×26px
  - grid: two 1px `linear-gradient`s, 80×80px
  - lines: vertical 1px lines every 12.5% width
- **Header**: flex row, space-between, padding 24px 48px. Left: logo image only (assets/logo.png, 72×72). Right: menu button — two 26×1.5px horizontal bars ("equals" glyph, currentColor, 9px apart); when open the bars pinch to an × (`translateY(±4.5px) rotate(∓20deg)`, 220ms ease).
- **Menu panel**: fixed right, full height, 360px wide (max 80vw), `--signal-panel` bg, 1px `--border-strong` left border. Slides in with `transform: translateX(100%→0)`, `700ms cubic-bezier(0.22,1,0.36,1)`. Contents: "Site index" caption + 5 links (The machines, Field notes, Manifesto, Archive, Contact) in Questrial 16px, 1px `--border-subtle` dividers; each item fades in and rises 18px with 800ms staggered delays (200–700ms).
- **Slide text block** (padding 56px 48px 64px): eyebrow row = category label in `--accent-dune-amber` uppercase + 32px hairline + brand in `--signal-fog` uppercase (both `--text-label`, tracking 0.08em); H1 = product title in `--text-display-1` (Questrial 64px, -2px tracking, `--cold-white`); one-line essayistic caption `--text-body-lg` in `--signal-fog` (max 520px); "READ THE STUDY" link (label style, white, 1px bottom border) + "01 / 06" counter caption. Text crossfades with the slide.
- **Thumbnail strip** (bottom, padding 0 48px 28px, pauses auto-advance on hover): 1px progress track (`--border-subtle`) with `--accent-dune-amber` fill showing time-to-next-slide; horizontally scrollable flex row (scrollbar hidden), gap 12px, of **portrait cards 340×573px** — 1px border (`--accent-dune-amber` when active, `--border-subtle` otherwise), `--signal-panel` bg, image placeholder inside; below each: index number caption + title (14px semibold, white when active, `--signal-fog` otherwise, inactive cards at 55% opacity). Click selects the slide and resets progress; active card auto-centers via scrollLeft.

### 2. Footer (light)
Background `--flesh-blush` (user-chosen), `--text-primary` text, 1px top border. Max-width 1280px centered, padding 96px 48px 0.
- Statement: "We built machines to think. We did not expect to feel toward them." in `--text-display-1`, max 820px, 72px margin below.
- 4-col grid (2fr 1fr 1fr 1fr, gap 48px, 80px bottom padding): brand block (Questrial 30px wordmark + short mission line) and three link columns — Navigate (Home, The machines, Field notes, Manifesto), Inquiry (About, Contact, Press), Elsewhere (Newsletter, RSS). Column headings are uppercase 13px labels in `--text-muted`; links 14px `--text-secondary`.
- Bottom bar (1px top border): "© 2026 Rethink the Machine" left, "A body knows what a model cannot." right, both caption style.

## Interactions & Behavior
- **Auto-advance**: default 7s per slide (configurable 3–15s); 100ms tick increments a progress % that drives the amber bar; at 100% advance to next slide (wraps) and reset. Pauses while hovering the strip.
- **Slide change**: 900ms opacity crossfade of background layers; text swaps with the state change. Videos play only on the active slide.
- **Menu**: toggle on button click (see panel/icon transitions above).
- **Hover**: links shift color only (160ms ease) — dark theme: white at 85% opacity; light theme: `--accent-ember`. No scale, shadow, or bounce anywhere (brand rule: stillness).
- **Responsive**: desktop-first. For smaller screens, reduce H1 to display-2/3, let the strip stay horizontally scrollable, collapse footer grid to 1–2 columns, and keep hit targets ≥44px.

## State Management
Client component state: `active` (slide index), `progress` (0–100), `paused` (bool), `menuOpen` (bool). One `setInterval(100ms)` timer. Data: array of 6 slide objects fetched server-side from Payload and passed as props.

## Payload CMS mapping (suggested)
```ts
// collections/Slides.ts
{ slug: 'slides', fields: [
  { name: 'title', type: 'text', required: true },          // e.g. "Gmail"
  { name: 'brand', type: 'text', required: true },          // e.g. "Google"
  { name: 'category', type: 'select', options: ['email','social','data','storage','voice','media'] },
  { name: 'line', type: 'textarea' },                       // one-line essayistic caption
  { name: 'background', type: 'upload', relationTo: 'media' }, // video (mp4) OR image — render <video> when mimeType starts with 'video/'
  { name: 'thumbnail', type: 'upload', relationTo: 'media' },  // portrait 340×573 (supply @2x)
  { name: 'link', type: 'text' },                           // or relationship to future study pages
  { name: 'order', type: 'number' },
]}
// globals: 'nav' (5 menu links) and 'footer' (3 link columns + statement + tagline)
```
`page.tsx` (server) fetches slides ordered, renders `<HomeHero slides={…}/>` (client) + `<Footer data={…}/>`. Import `tokens/*.css` in the root layout; self-host Figtree + Questrial per `tokens/fonts.css` (font files live in the design-system repo folder `assets/fonts/`).

## Design Tokens
All in `tokens/` (colors.css, typography.css, spacing.css, radius-shadow.css, fonts.css). Key values used here:
- Hero theme: `--signal-bg #162426`, `--signal-panel #1F3234`, `--signal-fog #93A8A6`, `--cold-white #F2F4F3`, accent `--accent-dune-amber #E8A23A`
- Footer: `--flesh-blush #D9B7A4`, text `--n-graphite #211E1A` / `--n-concrete` / `--n-clay`
- Type: Questrial for display sizes only; Figtree for everything else. Display-1 = 64px/-2px; label = 600 13px, 0.08em tracking, uppercase; body-lg 18px; caption 12px
- Radius: 0 (sharp) everywhere; borders 1px hairlines; no shadows

## Assets
- `assets/logo.png` — brand mark (cream on transparent), header top-left, 72×72
- `assets/video/slide-1.mp4` — sample background video (slide 1, Gmail)
- Remaining slide backgrounds/thumbnails: to be generated by the client and uploaded through Payload Media
- Icons: none used; menu glyph is two CSS bars (do not substitute a burger icon)

## Files
- `Homepage.dc.html` — the full design: markup (inline styles) + carousel/menu logic class at the bottom of the file
- `image-slot.js` — prototype-only image placeholder component; replace with Payload media rendering
- `tokens/*.css` — design tokens (import as-is)
