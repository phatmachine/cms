---
version: alpha
name: "Delphi"
description: "The Delphi nude dystopian aesthetic blends monochromatic earth tones, brutalist minimalism, and industrial decay. It creates a stark, beautiful world of sand, bone, and concrete.Perfectly captures this style through its vast deserts, huge stone buildings, and quiet, lonely mood we will do the same for anthropomorphism within our theme exploting the dark contrast between natural warm flesh and cold clinical, unemotional, binary, stone like, AI technology .
colors:
  nav-surface: "#fcf5ed"
  surface-base: "#fdf6ee"
  surface-secondary: "#f7f0e8"
  surface-white: "#ffffff"
  action-primary: "#ff5c00"
  text-dark-brown: "#3e2407"
  text-muted: "#94877c"
  text-primary: "#2b180a"
  text-secondary: "#2a2722"
  border-warm: "#e6dccb"
  /* Skin Colors */
--sienna: rgb(123, 78, 65);
--darkslategray: rgb(72, 87, 77);
--rosybrown: rgb(167, 118, 96);
--rosybrown: rgb(176, 136, 113);
--rosybrown: rgb(146, 111, 89);
--silver: rgb(218, 187, 177);
--dimgray: rgb(86, 90, 77);
--rosybrown: rgb(198, 152, 131);
--tan: rgb(202, 172, 146);
--rosybrown: rgb(163, 123, 116);
--sienna: rgb(93, 43, 37);
--saddlebrown: rgb(86, 52, 28);
typography:
  display-heading:
    fontFamily: "Questrial"
    fontSize: "40px"
    fontWeight: "400"
    lineHeight: "48.8px"
    letterSpacing: "-0.8px"
  section-heading:
    fontFamily: "Martina Plantijn Light"
    fontSize: "24px"
    fontWeight: "400"
    lineHeight: "31.68px"
    letterSpacing: "-0.48px"
  card-heading:
    fontFamily: "Martina Plantijn Light"
    fontSize: "20px"
    fontWeight: "400"
    lineHeight: "26.4px"
    letterSpacing: "-0.4px"
  ui-label-medium:
    fontFamily: "Inter"
    fontSize: "15px"
    fontWeight: "500"
    lineHeight: "21px"
  caption-meta:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "15.84px"
    letterSpacing: "-0.2px"
  body-text:
    fontFamily: "Inter"
    fontSize: "13px"
    fontWeight: "400"
    lineHeight: "18.2px"
  body-paragraph:
    fontFamily: "Inter"
    fontSize: "15px"
    fontWeight: "400"
    lineHeight: "21px"
rounded:
  card-radius: "16px"
  button-radius: "12px"
  chip-radius: "10px"
  badge-radius: "20px"
  avatar-circle: "582px"
  pill-full: "99px"
spacing:
  xs: "4px"
  sm: "6px"
  md-sm: "8px"
  md: "12px"
  md-lg: "14px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  4xl: "48px"
  5xl: "64px"
  6xl: "80px"
  7xl: "96px"
  8xl: "120px"
---

## Overview

Delphi uses a warm off-white parchment palette (#fdf6ee, #f7f0e8) as its primary surface, pairing a light-weight serif (Martina Plantijn Light) for editorial headings with Inter for UI labels and body copy. The brand accent is a vivid orange (#ff5c00) used exclusively on primary CTAs. Expert portrait cards are arranged in a masonry-style multi-column grid with large circular/rounded-rectangle crops. Typography features tight negative letter-spacing on display sizes, creating a refined editorial tone. The overall aesthetic is warm, human, and content-forward. positioning AI as approachable expertise.

**Signature traits:**
- Dual typeface system: Pairs Martina Plantijn Light and Inter across the type hierarchy.
- Soft, rounded geometry: Generous corner rounding up to 582px.
- Layered elevation: Depth comes from 4 validated shadow tokens.

## Colors

The palette uses 10 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **surface-background** maps to `surface-base`: Role "background" is grounded by usage context "Primary page and section background — warm parchment tone used across the full viewport".
- **border-border** maps to `border-warm`: Role "border" is grounded by usage context "Subtle warm dividers, card outlines, and separator lines".
- **content-text** maps to `text-primary`: Role "text" is grounded by usage context "Primary heading and body text — deep warm brown".
- **surface-text** maps to `text-dark-brown`: Role "text" is grounded by usage context "Accent text on warm surfaces, used for emphasis".

### Text Scale
- **Action Primary** (#ff5c00): Primary CTA button fill — 'Create your Digital Mind' orange button. Role: text. {authored: rgb(255, 92, 0), space: rgb}
- **Text Dark Brown** (#3e2407): Accent text on warm surfaces, used for emphasis. Role: text. {authored: rgb(62, 36, 7), space: rgb, alpha: 0.05}
- **Text Muted** (#94877c): Subheadings, role/title labels beneath expert names. Role: text. {authored: rgb(148, 135, 124), space: rgb}
- **Text Primary** (#2b180a): Primary heading and body text — deep warm brown. Role: text. {authored: rgb(43, 24, 10), space: rgb, alpha: 0}
- **Text Secondary** (#2a2722): Secondary body text and nav labels — near-black warm tone. Role: text. {authored: rgb(42, 39, 34), space: rgb, alpha: 0.5}

### Interactive
- **Border Warm** (#e6dccb): Subtle warm dividers, card outlines, and separator lines. Role: border. {authored: rgb(230, 220, 203), space: rgb}

### Surface & Shadows
- **Nav Surface** (#fcf5ed): Navigation bar background — very close to surface base, slightly cooler. Role: background. {authored: rgb(252, 245, 237), space: rgb}
- **Surface Base** (#fdf6ee): Primary page and section background — warm parchment tone used across the full viewport. Role: background. {authored: rgb(253, 246, 238), space: rgb}
- **Surface Secondary** (#f7f0e8): Secondary surface / footer background, slightly deeper warm tone. Role: background. {authored: rgb(247, 240, 232), space: rgb}
- **Surface White** (#ffffff): Pure white used on secondary button and card surfaces. Role: background. {authored: rgb(255, 255, 255), space: rgb, alpha: 0.4}

## Typography

Typography uses Martina Plantijn Light, Inter across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes Martina Plantijn Light and Inter for visual contrast. Weight range spans regular, medium. Sizes range from 12px to 40px.

### Font Roles
- **Headline Font**: Martina Plantijn Light
- **Body Font**: Martina Plantijn Light

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero and section display headings — 'Meet a mind. Ask it anything.' | Martina Plantijn Light | 40px | 400 | 48.8px | -0.8px | Martina Plantijn Light | Extracted token |
| Mid-level section headings and card group titles | Martina Plantijn Light | 24px | 400 | 31.68px | -0.48px | Martina Plantijn Light | Extracted token |
| Expert name labels on portrait cards | Martina Plantijn Light | 20px | 400 | 26.4px | -0.4px | Martina Plantijn Light | Extracted token |
| Navigation items, button labels, and UI controls | Inter | 15px | 500 | 21px | normal | Inter, Inter Placeholder, sans-serif | Extracted token |
| Expert role/title labels beneath names (e.g. 'Founder at Gumroad') | Inter | 12px | 400 | 15.84px | -0.2px | Inter, Inter Placeholder, sans-serif | Extracted token |
| Body copy and descriptive paragraph text | Inter | 13px | 400 | 18.2px | normal | Inter, Inter Placeholder, sans-serif | Extracted token |
| Longer descriptive body paragraphs (e.g. hero description text) | Inter | 15px | 400 | 21px | normal | Inter, Inter Placeholder, sans-serif | Extracted token |

## Layout

Responsive system uses 4 breakpoint tier(s): mobile, tablet, desktop, wide.

This system uses a 8px base grid with scale values 4, 6, 8, 12, 14, 16, 20, 24, 32, 48, 64, 80, 96, 120.

### Responsive Strategy
- **mobile (<= 809.98px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **tablet (810-1199.98px)**: Increase spacing and column structure for medium-width viewports.
- **desktop (Unknown)**: Expand layout density and horizontal composition for wide viewports.
- **wide (>= 1920px)**: Stretch composition with generous gutters and wider layout spans.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| xs | 4px | 4 | Extracted spacing token |
| sm | 6px | 6 | Extracted spacing token |
| md-sm | 8px | 8 | Extracted spacing token |
| md | 12px | 12 | Extracted spacing token |
| md-lg | 14px | 14 | Extracted spacing token |
| lg | 16px | 16 | Extracted spacing token |
| xl | 20px | 20 | Extracted spacing token |
| 2xl | 24px | 24 | Extracted spacing token |
| 3xl | 32px | 32 | Extracted spacing token |
| 4xl | 48px | 48 | Extracted spacing token |
| 5xl | 64px | 64 | Extracted spacing token |
| 6xl | 80px | 80 | Extracted spacing token |
| 7xl | 96px | 96 | Extracted spacing token |
| 8xl | 120px | 120 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| CTA Glow | 1 | 0px 0px 8px 0px rgba(255, 92, 0, 0.25) |
| Button Inset Highlight | 4 | inset 0px 0.614545px 8.22098px -0.880542px rgb(255, 153, 0) |
| Card Subtle Border Shadow | 1 | 0px 0px 0.921803px 0px rgba(148, 135, 124, 0.5) |
| Dropdown Shadow | 2 | 0px 0px 0.688607px 0px rgba(0, 0, 0, 0.25) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | backdrop-filter | blur(1.38781px) ; blur(10px) |
| Light | outline-color | rgb(0, 0, 0) ; rgb(42, 39, 34) ; rgb(148, 135, 124) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 0) ; matrix(-1, 0, 0, -1, 732, 6) ; matrix(0.999996, 0, 0, 0.999996, 0, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| Chip Radius | 10px | 10 | Control corner |
| Button Radius | 12px | 12 | Control corner |
| Card Radius | 16px | 16 | Card corner |
| Badge Radius | 20px | 20 | Card corner |
| Pill Full | 99px | 99 | Large surface corner |
| Avatar / Circle | 582px | 582 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| Card Radius | 16px | px |
| Button Radius | 12px | px |
| Chip Radius | 10px | px |
| Badge Radius | 20px | px |
| Avatar / Circle | 582px | px |
| Pill Full | 99px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Dual typeface system, Soft, rounded geometry, Layered elevation without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Breakpoint 1 | <= 809px | (max-width: 809px) and (min-width: 0) |
| Breakpoint 2 | <= 809.98px | (max-width: 809.98px) |
| Tablet | 810-1199px | (max-width: 1199px) and (min-width: 810px) |
| Tablet | 810-1199.98px | (min-width: 810px) and (max-width: 1199.98px) |
| Desktop | >= 1920px | (min-width: 1920px) |
| Breakpoint 6 | Unknown | (prefers-color-scheme: dark) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
