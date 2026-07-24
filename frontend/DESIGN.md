---
name: KanbanCareer
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1280px
  gutter: 20px
---

# KanbanCareer Design Language

## Brand & Philosophy

KanbanCareer is a **productivity tool for job seekers** — a workspace, not a social network. The brand is **professional, precise, and human**. It takes inspiration from developer tooling (Linear, Atlassian) in its respect for density and keyboard efficiency, but tempers it with warmth and approachability.

The design language is built on a single conviction: **every pixel must earn its place**. Nothing decorative, nothing accidental. Each component, color, and spacing decision serves legibility, hierarchy, or interaction clarity.

---

## Color System

The palette follows Atlassian Design System's tonal discipline: a **baseline surface** with layered containers that communicate depth through lightness, not shadows.

### Surface Hierarchy (Tonal Layers)

| Level | Token | Usage | Visual |
|-------|-------|-------|--------|
| 0 (Background) | `bg-surface` | Page backdrop | `#f8f9ff` |
| 1 (Container) | `bg-surface-container-lowest` | Cards, modals, inputs | `#ffffff` |
| 1.5 | `bg-surface-container-low` | Section headers, hover states | `#eff4ff` |
| 2 | `bg-surface-container` | Secondary containers, pressed states | `#e5eeff` |
| 2.5 | `bg-surface-container-high` | Active filters, selected tabs | `#dce9ff` |
| 3 | `bg-surface-container-highest` | Dragged items, elevated surfaces | `#d3e4fe` |

**Rule:** Use tonal layers for elevation, not box-shadows. Shadows are reserved for the overlay layer (modals, pickers) where tonal layering alone cannot separate the surface from the page.

### Semantic Colors

- **Primary (Blue)** — `#004ac6`. Actions, active navigation, links, focus rings. Represents trust and career growth. Use as the single interactive accent.
- **Secondary (Green)** — `#006c49`. Positive states, success milestones, "hired" status, metrics.
- **Tertiary (Amber)** — `#784b00`. Interview badges, pending states, highlighted metrics.
- **Error (Red)** — `#ba1a1a`. Destructive actions, errors, rejection states.

**All colors have a container variant** (`-container`) for background fills and an `on-*` variant for text/icon contrast. This is non-negotiable — never use hardcoded Tailwind v3 color utilities (`bg-red-100`, `text-green-700`) in the codebase.

### Contrast & Accessibility

- All `on-*` text colors pass WCAG AA (4.5:1) against their matching background.
- Surface text hierarchy:
  - `text-on-surface` — primary content (headings, values)
  - `text-on-surface-variant` — secondary content (labels, descriptions, metadata)
  - `text-error` — error states
- Focus rings use `ring-primary` with `ring-2` offset. All interactive elements must have a visible focus state.

---

## Typography

A dual-font system pairing **Geist** (headings, labels, data) with **Inter** (body text). This mirrors Atlassian's "display + text" approach where the display face carries brand personality while the body face prioritizes long-form readability.

### Font Roles

| Role | Font | Weight | When |
|------|------|--------|------|
| Display | Geist | 700 | Hero headlines (`display-lg`) |
| Headline | Geist | 600 | Section titles (`headline-lg`, `headline-md`) |
| Body | Inter | 400 | Paragraphs, descriptions |
| Label | Geist | 500–600 | Navigation, buttons, badges, metadata |
| Mono | Geist | 400 | System codes, status identifiers |

### Hierarchy Rules

1. **Headlines are roman** — never italic. `font-style: normal` always. Emphasis is carried through weight, color, or underline, never italic.
2. **Body text uses Inter** — its high x-height and open counters maximize readability in dense job descriptions.
3. **Labels use Geist** — its geometric, slightly monospaced metrics create a "tool-like" feel for navigation, buttons, and metadata.
4. **Tracking by size** — negative tracking on large sizes (`-0.02em` at 48px), tighter on small (`0.02em` at 12px).
5. **No eyebrows** — section headings sit directly above content. Never use numbered/chapter labels above headings unless the content is genuinely sequential.

### Scale

```
display-lg  48/56 Geist 700   -0.02em     → Hero use only
headline-lg 32/40 Geist 600   -0.01em     → Page titles
headline-md 24/32 Geist 600               → Section titles
body-lg     18/28 Inter 400               → Hero subtitle
body-md     16/24 Inter 400               → Default body
body-sm     14/20 Inter 400               → Secondary text
label-md    14/16 Geist 500   +0.01em     → Buttons, nav links
label-sm    12/14 Geist 600   +0.02em     → Badges, metadata
mono-sm     13/18 Geist 400               → System codes
```

---

## Spacing & Layout

### Baseline Grid

The system operates on a **4px baseline** with **8px incremental steps**. This is non-negotiable — all margin, padding, and gap values must land on the 4px grid.

| Token | Pixels | Rem | Usage |
|-------|--------|-----|-------|
| `xs` | 4 | 0.25 | Inner icon spacing, small gaps |
| `sm` | 8 | 0.5 | Tight groupings, chip padding |
| `md` | 16 | 1 | Card padding, section heading margins |
| `lg` | 24 | 1.5 | Section spacing, card gaps |
| `xl` | 32 | 2 | Major section padding |
| `2xl` | 48 | 3 | Hero section padding |

### Container

- Desktop max-width: `1280px` (`max-w-7xl`)
- Gutter: `20px` (`px-gutter`)
- The container centers horizontally with `mx-auto`

### Density by Context

| Context | Density | Principle |
|---------|---------|-----------|
| Landing / Hero | Generous | Spacious margins, big headlines, breathing room |
| Dashboard | Medium | 5-column metric grid, readable charts |
| Kanban board | Dense | 300px fixed columns, compact cards, horizontal scroll |
| Forms | Medium | `gap-md` between fields, clear grouping |
| Lists | Dense | 48px rows, subtle dividers |

---

## Elevation & Depth

Elevation is communicated through **surface container lightness**, not shadows. This is inspired by Atlassian's tonal elevation system.

| Level | Token | Shadow | When |
|-------|-------|--------|------|
| 0 | `bg-surface` | None | Page backdrop |
| 1 | `bg-surface-container-lowest` | None | Default card state |
| 1 (hover) | `bg-surface-container-lowest` | `shadow-sm` | Card hover |
| 2 | `bg-surface-container-low` | None | Section headers, subtle separation |
| 2 + outline | `bg-surface-container-lowest` + `border-outline-variant` | `shadow-sm` | Cards with border distinction |
| Overlay | `bg-surface-container-lowest` | `shadow-md` | Modals, dropdowns, pickers |
| Drag | `bg-surface-container-highest` | `shadow-lg` | Dragged items |

**Anti-patterns:**
- Do not use `shadow-xl`, `shadow-2xl`, or heavy box-shadows. The aesthetic is flat-but-structured, not floating.
- Do not combine tonal elevation with heavy shadows — pick one language.
- Do not use `transition-all` on interactive elements. Always specify the properties that change.

---

## Border Radius System

Radii are **soft but systematic** — rounded enough to feel modern, precise enough to feel intentional.

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 2px | Small indicators, status dots |
| `rounded` / `rounded-md` | 4–6px | Default for most elements |
| `rounded-lg` | 8px | Cards, inputs, buttons, containers |
| `rounded-xl` | 12px | Modals, large containers, dashboard panels |
| `rounded-full` | 9999px | Badges, pills, avatars, dot indicators |

**Rule:** Use `rounded-lg` (8px) as the default radius for interactive elements. This is the "Kanban card radius" — it unifies the feel across cards, inputs, buttons, and dropdowns.

---

## Interaction Patterns

### Transitions

Every interactive element defines exactly which properties animate. **Never use `transition-all`.**

| Element | Transition | Duration | Easing |
|---------|-----------|----------|--------|
| Button bg | `transition-colors` | 150ms | ease-out |
| Button transform | `transition-transform` | 100ms | ease-out |
| Link underline | `transition-colors` | 200ms | ease-out |
| Card shadow | `transition-shadow` | 200ms | ease-out |
| Card border | `transition-colors` | 200ms | ease-out |

### Active State

Buttons use `active:scale-95` for a press-down microinteraction. This is the only transform animation — no bounce, no spring. Pure linear press feedback.

### Focus States

All interactive elements must have a visible focus state:
- Text inputs, selects: `focus:ring-2 focus:ring-primary focus:border-transparent`
- Buttons: `focus-visible:ring-2 focus-visible:ring-primary`
- Links: `focus-visible:ring-2 focus-visible:ring-primary` or native `:focus-visible` outline

### Disabled State

Disabled buttons use `disabled:opacity-50 disabled:cursor-not-allowed`. No other disabled treatment is needed — the opacity reduction is sufficient.

---

## Component Design Rules

### Buttons

| Tier | Classes | When |
|------|---------|------|
| Primary | `bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container` | Main action per view |
| Secondary | `border border-outline-variant text-on-surface-variant hover:bg-surface-container-low` | Alternative actions |
| Tertiary (Ghost) | `text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low` | Subtle actions |

All buttons use `font-label-md text-label-md` for label, `rounded-lg` for radius, and specify `transition-colors` (never `transition-all`).

### Cards

- Default: `bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm`
- Hover: add `hover:shadow-md hover:border-primary`
- Kanban cards: 8px radius, 16px padding, 1px border
- Dashboard stat cards: colored top accent indicator

### Form Inputs

- Height: 48px (3rem) standard
- Padding: 16px horizontal, 12px vertical
- Border: `border border-outline-variant`
- Focus: `focus:ring-2 focus:ring-primary focus:border-transparent`
- Labels: `font-label-md text-label-sm text-on-surface-variant` above the field
- Error: `text-error` for label, `border-error` for input border

### Kanban Board

- Column: 320px min-width, `bg-surface-container-lowest`, `rounded-xl`
- Column header: `bg-surface-container-low`, `rounded-t-xl`, compact
- Card: `bg-surface rounded-lg border border-outline-variant shadow-sm`
- Drag over indicator: `border-primary bg-primary-container/10`
- Scroll areas use the `kanban-scroll` class for thin, styled scrollbars

### Badges / Status Indicators

- `rounded-full` pill shape
- `font-label-sm text-label-sm`
- Semantic colors via design tokens, never raw green/red utilities

---

## Responsive Design

Mobile-first breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

- Navigation collapses to a hamburger menu at `md` breakpoint.
- Dashboard stat grid: 1 col mobile → 2 col tablet → 5 col desktop.
- Kanban board: horizontal scroll container with fixed-width columns.
- Forms: single column mobile, side-by-side at `md` on applicable field groups.

**Never allow clickable text (buttons, nav links, CTAs) to wrap to two lines.** If space is tight, shorten the label or collapse into a menu.

---

## Microinteraction Discipline

| Pattern | Rule |
|---------|------|
| Hover | Color or shadow shift only. No scale changes except `active:scale-95`. |
| Focus | Instant ring appearance (no transition on focus ring). |
| Disabled | `opacity-50` + `cursor-not-allowed`. No color shift. |
| Loading | Skeleton loader for known layout, inline spinner for actions. |
| Toast | Stack at viewport corner, fixed position. `transition-opacity` for enter/exit. |
| Drag | Slight rotation (`rotate-3`), elevated surface, `shadow-lg` on drag overlay. |

---

## Accessibility Requirements

1. **Color contrast** — All text meets WCAG AA (4.5:1) minimum. Surface text hierarchy uses `text-on-surface` for primary, `text-on-surface-variant` for secondary.
2. **Focus visibility** — Every interactive element has a visible `:focus-visible` state. Never remove `outline` without providing a replacement.
3. **Touch targets** — Minimum 44x44px for all interactive elements on mobile.
4. **Reduced motion** — `prefers-reduced-motion` disables all transitions and animations.
5. **Semantic HTML** — Use `<button>` for actions, `<a>` for navigation, `<label>` for form fields.
6. **ARIA** — Use `aria-label`, `aria-expanded`, `role` attributes where native semantics are insufficient.
