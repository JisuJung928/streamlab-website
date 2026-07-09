# STREAM Lab Design System

**STREAM Lab** — *Simulation and Theoretical REsearch with AI for Materials* — is a
university materials-science research lab whose mission is to accelerate materials
discovery by combining theoretical/computational materials modeling with modern AI
techniques, in response to challenges like the climate and energy crises.

This project is the lab's design system: brand tokens, a small component library, and
a homepage UI kit (top nav → brand name → two content slideshows: Recent Publications
and News), ready for a designer or engineer to build the real site from.

## Sources

- **Colors**: Pukyong National University's published Main/Sub brand colors,
  https://www.pknu.ac.kr/main/121 (Pantone Process Blue C + Pantone 281C as the main
  pair; Pantone 873C/877C/428C/277C/217C/461C/568C as sub colors — only a few of the
  sub colors were adopted here as accents; see Visual Foundations). Pantone → hex
  conversions here are practical screen approximations, not certified matches.
- **Content/mission**: https://www.streamlab.re.kr (the lab's own site). Only the
  mission statement was accessible during this build (see Caveats) — no other page
  content, imagery, or component code from this site was available to read.
- **Acronym expansion**: supplied directly by the requester — "Simulation and
  Theoretical REsearch with AI for Materials."
- Per the requester's instruction, no current personal/institutional affiliation
  (PI name, department, university branding) is surfaced anywhere in this system —
  only the STREAM Lab name and mission.

No logo, icon set, or other visual asset files were supplied or reachable. See
Iconography below.

## Index

- `styles.css` — root stylesheet manifest (`@import`s only)
- `base.css` — minimal reset + base element styles
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — design tokens
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/core/` — `Button`, `Badge`, `Card`
- `components/forms/` — `Input`
- `components/navigation/` — `NavBar`, `Footer`
- `components/content/` — `PublicationCard`, `NewsCard`, `Carousel`
- `ui_kits/homepage/` — full homepage recreation (nav, brand hero, two slideshows)
- `SKILL.md` — portable skill file for use in Claude Code

## Intentional additions

No component source (codebase or Figma) was provided, so this is a from-scratch
component set sized to what a small lab site needs — not a full generic UI kit:

- **Button, Badge, Card, Input** — minimal generic primitives any site needs.
- **NavBar, Footer** — required by the brief ("upper navigation bar").
- **PublicationCard, NewsCard, Carousel** — required by the brief ("two slide shows,
  recent publications and news").

Broader primitives (Tabs, Dialog, Toast, Tooltip, Select, Switch, etc.) were
intentionally **not** built — nothing in the brief calls for them yet. Ask if the
real site needs these and they'll be added.

## Content fundamentals

Tone is drawn from the one passage of streamlab.re.kr copy that was reachable:

> "Modern society faces various challenges, including the climate crisis and energy
> crisis. We aim to overcome these challenges by driving materials innovation
> through simulation-based research that integrates theoretical computational
> materials modeling with advanced artificial intelligence techniques."

From this and the acronym:
- **Voice**: first-person plural ("we aim to..."), not second-person — the lab
  describes its own mission rather than addressing "you" the reader. Keep this for
  any new mission/about copy.
- **Register**: formal, academic, declarative sentences. No contractions, no
  exclamation points, no emoji.
- **Framing**: problem → response. Copy opens on a real-world challenge (climate,
  energy) before stating the lab's technical approach (simulation + theory + AI).
  Use this shape for section intros (Research, About).
- **Specificity**: technical terms (theoretical computational materials modeling,
  artificial intelligence techniques) are used directly, not simplified — the
  audience is assumed to be scientifically literate (other researchers, prospective
  grad students/postdocs).
- **Casing**: sentence case for body copy; the brand name "STREAM Lab" and its full
  expansion are the only consistently capitalized/styled terms.
- Only one other line of copy was visible: a recruiting note ("I am currently
  recruiting highly motivated researchers and students...") — first-person singular,
  direct, brief. Not used verbatim here since it's tied to a named PI; the homepage
  news feed includes a de-personalized recruiting item instead ("Recruiting graduate
  students and postdocs").
- No emoji anywhere in source copy — none used in this system.

## Visual foundations

- **Color**: deep navy (`--navy-800`, Pantone 281C) and Process Blue
  (`--blue-600`, Pantone Process Blue C) are the primary pair — navy for large fills
  (nav, footer, hero gradient), Process Blue for interactive/primary actions and
  links. A metallic gold (`--gold-600`, ~Pantone 873C) is the single accent color,
  reserved for one emphasized CTA or a "featured" tag per screen — never for large
  fills. A muted sage (`--sage-600`, ~Pantone 568C) is a secondary tag/badge tint.
  Neutrals are a cool, blue-tinted "fog" gray scale (`--fog-0` → `--fog-900`) rather
  than pure grays, so they sit quietly next to the navy/blue brand pair.
- **Type**: `Space Grotesk` for display/headings (geometric, technical, slightly
  cool — reads as "computational"), `IBM Plex Sans` for body/UI copy (engineered,
  highly legible, an established scientific/technical-publishing face), `IBM Plex
  Mono` for anything data-like — publication venues/years, dates, figures. Using
  monospace for metadata is a deliberate nod to the lab's computational/simulation
  focus. See Fonts caveat below — these are substitutes, not confirmed brand fonts.
- **Spacing**: 4px base scale (`--space-1` … `--space-10`), generous section spacing
  (`--space-8`/`--space-9` between hero/sections) to keep a dense, data-rich academic
  page feeling calm rather than cramped.
- **Backgrounds**: flat colors and one subtle vertical gradient (navy-900 → navy-800)
  behind the hero — no photography, illustration, texture, grain, or pattern fills
  were available or used. If the lab has photography (lab space, simulation
  renders, team), it should replace the flat hero background.
- **Animation**: minimal and functional only — hover lift on cards (`translateY`
  -2px + shadow increase), color transitions on buttons/links, a slide-window
  carousel. No entrance animations, bounces, or decorative looping motion — this is
  an academic/professional site, not a marketing one.
- **Hover states**: buttons darken one step (`--brand-primary-hover` etc.); cards and
  publication/news items lift with a stronger shadow; nav links go from muted white
  to full white; links underline + shift to the hover blue.
- **Press states**: buttons scale to 0.97 on mousedown, no color change beyond an
  even-darker active shade.
- **Borders**: 1px hairlines in `--border-subtle`/`--border-default`, used on cards
  and inputs — no heavy strokes, no colored left-border-accent cards (avoided
  intentionally as an overused pattern — NewsCard's blue left rule is the one
  deliberate exception, used to visually distinguish it from PublicationCard in
  mixed layouts).
- **Shadows**: soft, low-opacity, navy-tinted at the top elevation
  (`--shadow-lg` uses a navy rgba, not pure black) so elevation reads as "brand
  navy ink" rather than generic drop-shadow gray.
- **Corner radii**: `--radius-md` (8px) for buttons/inputs, `--radius-lg` (14px) for
  cards, `--radius-pill` for badges. No sharp/0-radius elements.
- **Cards**: white surface, 1px subtle border, soft shadow, 14px radius, lift on
  hover. No colored accents beyond the one NewsCard exception above.
- **Transparency/blur**: none used — no glassmorphism, no backdrop-filter. Flat,
  opaque surfaces throughout, consistent with the "modern and professional" academic
  brief.
- **Layout**: sticky top nav, centered `1240px` max-width content column, single
  footer. The homepage's fixed structure — nav → brand name → Recent Publications
  slideshow → News slideshow → footer — follows the brief exactly.

## Iconography

No icon font, SVG sprite, or icon set was supplied or reachable from either source.
This system does **not** substitute a generic CDN icon set for now, since the
homepage brief didn't call for icons beyond the carousel's `‹ ›` prev/next
characters (plain text glyphs, not SVG). If the real site needs icons (e.g. for nav,
social links, or research-area tags), the recommendation is **Lucide** (thin,
technical stroke icons that suit the Space Grotesk/Plex pairing) via CDN — flag
this as a substitution once adopted, since it isn't confirmed brand usage.

No emoji or Unicode pictographs are used anywhere in this system, matching the
source copy's tone.

## Fonts — substitution flag

No font files were supplied. `Space Grotesk`, `IBM Plex Sans`, and `IBM Plex Mono`
(all Google Fonts) were substituted as the closest fit for a modern, technical,
academic-research brand. **Please share the lab's actual brand fonts if any exist**
so `tokens/typography.css` can be updated with real `@font-face` files instead of
the Google Fonts `@import`.

## Caveats

- `streamlab.re.kr` could not be fully browsed — only a short mission-statement
  snippet surfaced via search; no publications, news items, people, or images from
  the real site were read. All Publication/News content in the UI kit is
  **placeholder copy** written to match the tone above, not real lab output.
- Pantone → hex conversions for both main and sub colors are approximations sourced
  from public color-reference sites, not an official brand color guide — please
  confirm before print use.
- No logo or brand mark exists in this system — every place a mark would go uses the
  plain-type wordmark "STREAM Lab" instead. Do not generate or approximate a logo.

**Ask**: if you can re-share access to streamlab.re.kr (or a saved copy/screenshots
of it) and the lab's real font files, I'll rebuild the content and type sections
against ground truth. Also let me know if the homepage should include anything
beyond nav → brand → publications → news, and whether the placeholder
publications/news should stay as structural examples or be replaced with real data
now.
