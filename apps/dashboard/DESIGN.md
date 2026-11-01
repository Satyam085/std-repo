---
name: Admin Console (Manual Page)
description: The admin console set as a Unix manual page: sections, synopsis, aligned figures, one reserved accent.
colors:
  paper: "#ffffff"
  paper-shade: "#f5f5f3"
  rule: "#e2e2de"
  ink: "#111111"
  ink-muted: "#5c5c5c"
  accent: "#0b57d0"
  error: "#c5221f"
typography:
  page-name:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  section-head:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.06em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
  table-head:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.06em"
  prose:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  hint:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  none: "0px"
spacing:
  section: "28px"
  column-gap: "32px"
  head-column: "144px"
  index-column: "192px"
  header: "48px"
components:
  control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "32px"
  control-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  control-primary:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "32px"
  control-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "36px"
  nav-item-active:
    textColor: "{colors.accent}"
    typography: "{typography.data}"
---

# Design System: Admin Console (Manual Page)

## Overview

**Creative North Star: "The man page for your running product"**

The console reads like a page from a Unix manual. Each route is one page with a `NAME`, an optional `SYNOPSIS` that states how the data gets there, and then its own sections (`STATUS`, `EVENTS`, `ACCOUNTS`, `OBJECTS`). A running header and footer frame every page, and the index lists sections by man-section number (`users(5)`, `settings(8)`). It deliberately avoids the stock SaaS admin look: no gray sidebar slab, no KPI card row, no rounded cards. The owner scans, acts, and leaves.

This is the dashboard's own world. The storefront (`apps/web`) has a separate light editorial look and does not inherit these rules.

**Key Characteristics:**

- White paper, near-black ink, and one reserved accent.
- Monospace for data, labels, controls, and section heads. Grotesk for sentences.
- Hairline rules instead of containers, and zero radius everywhere.
- Text controls in brackets (`[ refresh ]`) that invert on hover, like a terminal selection.
- Figures right-aligned against the margin on dotted leaders.

## Colors

### Primary

- **accent** `#0b57d0`: the one accent. Rebrand by changing `--color-primary` in `src/styles.css`.

### Neutral

- **paper** `#ffffff`: page ground.
- **paper-shade** `#f5f5f3`: hover and the open table row. Never a card fill.
- **rule** `#e2e2de`: hairlines between sections and rows.
- **ink** `#111111`: text, the running header and footer rules, the table-head rule, and inverse-video hover.
- **ink-muted** `#5c5c5c`: secondary text. It is 6.7:1 on paper, so use it for anything that must stay readable.
- **error** `#c5221f`: failures only (a binding that didn't answer, validation, rejected uploads).

### Named Rules

**The Reserved Ink Rule.** The accent marks only the current page, links and primary controls, focus, and live state (healthy status dots). Roles, badges, and decoration stay ink.

**The Two Inks Rule.** Hierarchy comes from weight, case, and rules, not from gray fills or extra hues. Red is the only other color, and only for failure.

## Typography

**Data, labels, and controls:** JetBrains Mono. **Prose:** Public Sans. Both load from Google Fonts in `src/styles.css`.

### Hierarchy

- **page-name** (mono 1.5rem/700, tight): the page's H1 inside `NAME`, lowercase like a command.
- **section-head** (mono 0.8125rem/700, uppercase, +0.06em): `NAME`, `SYNOPSIS`, `STATUS` and so on, set in the left head column.
- **data** (mono 0.8125rem): tables, leaders, nav, controls, synopsis lines.
- **table-head** (mono 0.6875rem/500, uppercase, muted) above an ink rule.
- **prose** (sans 1rem, guide copy at 15px with relaxed leading): summaries and explanations, capped near 65–72ch.
- **hint** (sans 0.75rem): field help and status lines.

## Layout

- The running header (48px, ink bottom rule) holds the brand mark plus `NAME(8)`, the manual title, the user, and `[ sign out ]`.
- From `md` up, a 192px index column with a hairline right edge. It is sticky and ends with `SEE ALSO`.
- Each section is a two-column grid: a 144px head column, a 32px gap, then the body. Sections are separated by `rule` hairlines with 28px of vertical padding.
- Content tops out at `max-w-6xl` inside a 90rem frame.
- Below `md`, the index becomes a wrapping row of section links and heads stack above their bodies.
- Below `sm`, secondary table columns (`wideOnly`) hide and their values fold under the first cell as a muted line. A column should never shrink until it wraps one character at a time.

## Elevation & Depth

None. The page is flat paper. Separation comes from rules, and emphasis comes from inverse video. There are no shadows, blur, or glass.

## Shapes

Zero radius on every box, field, and control. The only round shapes are the 8px status dots.

## Components

### Buttons

The bracketed text control: `.ctl`, plus `.ctl-primary` for the page's main action. Brackets come from `::before`/`::after`. Hover and `aria-expanded` invert it (ink ground, paper text; accent ground for primary). Disabled controls drop to muted ink with a not-allowed cursor. Minimum height is 32px, or 44px on coarse pointers.

### Inputs / Fields

`.field`: a mono 13px input with a 1px `rule` border that turns muted on hover. On focus the border goes accent with a 1px outline. Labels sit above the input, or in a 160px label column on settings. Help or error text sits below; an error replaces the hint.

### Navigation

Index entries are `label(n)` in mono. The active entry (`data-status=active`) turns accent and bold, its number included. Hover uses `paper-shade`.

### Leader row (signature)

`label ........ value`: a mono row with a dotted ink/35 leader and a right-aligned, tabular value that can wrap. Each figure (`· 16 ms`) is kept unbroken. Used for binding status.

### Tables

Mono 13px, an uppercase muted head over an ink rule, hairline row dividers, and no zebra striping. Rows that open (users) expand inline beneath themselves on `paper-shade` while the other rows recede to muted ink.

## Do's and Don'ts

### Do:

- **Do** set every new route as a `ManPage` with `NAME`, a truthful `SYNOPSIS` (loader → server function → binding), then its own `Section`s.
- **Do** put real binding data on screen, and say plainly when something is empty.
- **Do** keep page actions as bracketed controls on the NAME row.
- **Do** run every motion on the single constant `--dur` (160ms, expo ease-out). It drops to 0 under reduced motion.

### Don't:

- **Don't** use cards, gray panels, KPI tiles, or rounded corners.
- **Don't** spend the accent on decoration, roles, or badges.
- **Don't** add icon tiles or glyph icons. Words and section heads carry meaning here.
- **Don't** use eyebrow or kicker labels above headings. Section heads sit beside their content, not above titles.
