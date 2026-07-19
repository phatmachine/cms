Newstalgia Minimal (Anti Big Tech)
1. Brand
1.1 Brand story
This product looks and feels like a modern, mainstream SaaS: clean layouts, generous white space, and frictionless flows.

Under the surface, it celebrates lost 80s/90s analogue culture—tapes, VHS, early mobile, arcade typography—as a quiet protest against faceless big tech.

1.2 Brand adjectives
Minimal

Vibrant

Human

Analogue‑inspired

Trustworthy but opinionated

1.3 Voice and tone
Clear, conversational, inclusive

Anti‑big‑tech but not conspiratorial: “pro‑user, pro‑analogue” rather than “rage”

Sprinkle cultural references lightly (“rewind,” “side A,” “signal not noise”) without overloading copy

2. Color
2.1 Palette overview
Base palette is light and neutral to feel mainstream and accessible.

Accents are vibrant, gradient‑friendly colors that nod to neon signage and CRT glows without going full retro.

2.2 Tokens
text
color.bg.app          = #F8FAFC   // Soft, mainstream background
color.bg.surface      = #FFFFFF
color.bg.subtle       = #ECF0F4

color.text.primary    = #111827
color.text.secondary  = #4B5563
color.text.muted      = #9CA3AF
color.text.inverse    = #F9FAFB

color.accent.primary  = #6366F1   // Indigo (trustworthy, mainstream)
color.accent.secondary= #EC4899   // Pink
color.accent.tertiary = #22C55E   // Green

color.accent.analog1  = #FFB300   // Tape label yellow
color.accent.analog2  = #00B4D8   // Cyan glow (CRT)
color.accent.analog3  = #F97316   // Orange (sunset / VHS)

color.border.subtle   = #E5E7EB
color.border.strong   = #CBD5F5

color.state.success   = #16A34A
color.state.warning   = #F59E0B
color.state.error     = #DC2626
2.3 Usage rules
Default backgrounds use bg.app and bg.surface for maximum legibility and broad appeal.

Primary CTAs use accent.primary; secondary CTAs can use accent.secondary.

Analogue accents (accent.analog*) are reserved for campaign sections, nostalgic illustrations, tags, and easter‑egg elements so they remain special.

3. Typography
3.1 Font stack
Primary: clean geometric or neo‑grotesk sans (Google‑friendly)

Example: "Inter", "SF Pro Text", system-ui

Display analogue: a subtle 80s/90s‑inspired display font used sparingly

Example: "Space Grotesk", "Rubik", system-ui with slightly altered tracking

Mono / techno: monospaced for code snippets, system readouts, or “signal” UI

Example: "JetBrains Mono", "Roboto Mono", monospace

3.2 Type scale (desktop)
text
type.display.hero     = 48 / 56, 700, -0.02em
type.h1               = 32 / 40, 700, -0.01em
type.h2               = 24 / 32, 600, -0.01em
type.h3               = 20 / 28, 600, 0em

type.body.lg          = 18 / 28, 400, 0em
type.body.md          = 16 / 24, 400, 0em
type.body.sm          = 14 / 20, 400, 0em

type.label            = 12 / 16, 600, 0.06em, uppercase
type.code             = 13 / 20, 400, 0em, mono
3.3 Typography rules
Main experience: use the primary sans for all headings, body text, buttons, and navigation for a contemporary, mainstream feel.

Display analogue style appears in hero headlines, campaign tags, and special pull‑quotes referencing 80s/90s culture.

Anti big tech headlines can lean bolder and tighter tracking; body remains calm and readable.

4. Spacing & Layout
4.1 Spacing scale
text
space.0   = 0
space.1   = 4
space.2   = 8
space.3   = 12
space.4   = 16
space.5   = 24
space.6   = 32
space.7   = 48
space.8   = 64
space.9   = 80
4.2 Layout rules
Overall layout is minimal and airy: large margins, clear vertical rhythm, generous whitespace.

Use simple, single‑column layouts on mobile and 2–3 column grids on desktop.

Allow a few “analogue” layout quirks in feature sections (e.g., slightly overlapping sticker elements, a rotated cassette image) but keep core flows pristine.

5. Components
5.1 Buttons
Primary button:

Background: color.accent.primary

Text: color.text.inverse

Border radius: 9999px (pill) or 8px

Shadow: subtle soft shadow only on hover

Typography: type.label

Secondary button:

Background: color.bg.surface

Text: color.accent.primary

Border: 1px solid color.border.strong

Analogue / campaign button (limited use):

Background: gradient between accent.analog1 and accent.analog2

Text: color.text.inverse

Used only in special “Join the analogue revival” or campaign CTAs so it feels special.

5.2 Cards
Background: color.bg.surface

Border: 1px solid color.border.subtle

Radius: 16px

Padding: space.5–space.6

Optional analogue detail: small sticker‑style label in accent.analog1 or analog3 with mono text like “SIDE A” or “Signal”.

Keep shadows minimal and soft to maintain mainstream polish.

5.3 Navigation & header
Sticky top nav with transparent background over hero, switching to bg.surface on scroll.

Logo in primary text color; avoid noisy retro effects on the main logo.

One small analogue nod allowed (e.g., a “Now Playing” cassette icon for an audio feature, or a tiny VHS‑style timecode in the corner).

6. Imagery & Analogue Motifs
6.1 Imagery
Primary imagery: modern, clean photography or 3D that feels fresh and tech-forward.

Analogue motifs: cassette tapes, VHS labels, CRT frames, early mobile phones, floppy disks used as small illustrations or background textures, not as the entire UI.

6.2 Iconography
Simple, outline icons with consistent stroke width.

Use analogue icons for specific campaign features (e.g., a tape icon for “Archive,” a floppy for “Download”).

Limited color: mostly monochrome with accent fill or stroke.

7. Motion
7.1 Modern baseline
Short, smooth transitions (150–200ms) for hover, open/close, and scroll reveals.

Easing: cubic-bezier curves that feel natural and premium.

7.2 Analogue interactions
Occasional micro‑interactions:

A 1‑frame “scanline” shimmer when a hero headline appears.

A subtle rewind icon animation when hovering “View history” or “Go back.”

No full‑screen glitch; keep analogue effects subtle so mainstream users don’t feel overwhelmed.

8. Anti–big-tech content styling
8.1 Messaging blocks
For manifesto / campaign sections:

Layout: full‑width section, bg.surface or a very soft gradient using accent.primary at 5–10% opacity.

Typography: type.h2 or type.h3 for headlines, body.lg for copy.

Analogue motif: use a highlighted pull‑quote styled like a printed zine or VHS label (background accent.analog1, mono text, all caps).

8.2 Visual hierarchy
Anti big tech copy should feel like part of the product, not a separate rant.

Keep it visually consistent with the rest of the site: same type scale, spacing, and card structures, with just a bit more analogue color and iconography.

9. Implementation notes
9.1 Tokens
Expose tokens for your stack, for example:

CSS variables: --color-accent-primary, --type-h1-size, etc.

Tailwind: map tokens into theme.colors, fontFamily, fontSize, spacing.

Storybook: show side‑by‑side stories of “Default Minimal” vs “Analogue Campaign” variants of key components.

9.2 Progressive analogue
Default experience: minimal, vibrant, mainstream.

On deeper levels (about, campaign, blog, manifesto), gradually ramp up analogue cues: more accent.analog*, more cassette/VHS illustrations, slightly bolder display type.
