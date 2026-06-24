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

## Brand & Style
The design system is engineered for high-performance productivity, specifically tailored for the complexities of modern job seeking. The brand personality is **organized, efficient, and reliable**, positioning itself as a "workplace for finding work." It avoids the fluff of traditional social media and the dryness of legacy corporate tools.

The visual style is **Corporate / Modern** with a focus on **utility and technical precision**. It draws inspiration from developer-centric tools like Linear, prioritizing information density without sacrificing clarity. The interface relies on a rigorous grid, subtle depth, and purposeful motion to guide the user through their career transition.

## Colors
The palette is rooted in trust and clarity. 

*   **Primary (Professional Blue):** Used for primary actions, active navigation states, and brand-critical touchpoints. It represents stability and career growth.
*   **Success (Success Green):** Reserved for positive milestones—application submitted, interview scheduled, or offer received.
*   **Neutral (Slate & Gray):** A sophisticated range of cool grays forms the UI backbone, defining borders, backgrounds, and secondary text.
*   **Warning/Error:** Standardized amber and rose tones are used sparingly for deadline alerts and application rejections.

The system uses a 10-step tonal scale for each color to ensure accessible contrast ratios in all states.

## Typography
This design system utilizes a dual-font approach to balance technical precision with extreme readability.

*   **Geist** is used for headlines, labels, and technical data. Its geometric construction and monospaced-influenced metrics provide the "tool-like" feel necessary for an efficiency-focused SaaS.
*   **Inter** is utilized for all body copy and descriptions. Its high x-height and exceptional legibility ensure that long-form job descriptions and cover letters are comfortable to read.

Typography follows a strict hierarchy. Use `label-sm` for metadata (e.g., "Posted 2 days ago") and `mono-sm` for system-level status codes or identifiers.

## Layout & Spacing
The layout is built on a **4px baseline grid** and an **8px spacing system** to ensure mathematical consistency. 

*   **Desktop:** 12-column fluid grid with 20px gutters. Content is usually contained within a 1280px max-width container to maintain line length readability.
*   **Dashboard Views:** Uses a sidebar-content split. The sidebar is fixed at 240px, while the content area is fluid.
*   **Kanban Boards:** Columns have a fixed width of 300px with horizontal scrolling for overflow.
*   **Mobile:** 4-column grid with 16px margins. Complex data tables should reflow into card lists.

Spacing should be used to create "groupings" of information—use `md` (16px) for internal card padding and `lg` (24px) for spacing between unrelated sections.

## Elevation & Depth
The design system uses **Tonal Layers** combined with **Low-contrast outlines** to create a structured, flat-but-deep aesthetic.

*   **Surface Level (Level 0):** Used for the main background. Color is a very light gray (#F8FAFC).
*   **Container Level (Level 1):** Cards and main content areas. Pure white (#FFFFFF) with a 1px border (#E2E8F0).
*   **Raised Level (Level 2):** Used for hovered cards or dropdown menus. Includes a soft, diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1)`.
*   **Overlay Level (Level 3):** Modals and dialogs. Higher shadow depth and a 40% opacity neutral-gray backdrop blur to focus user attention.

Avoid heavy drop shadows; the goal is to feel like paper sheets neatly stacked on a desk.

## Shapes
The shape language is **Soft**, providing a modern feel that isn't overly playful. 

*   **Default (rounded):** 0.25rem (4px) for small components like checkboxes and small buttons.
*   **Medium (rounded-lg):** 0.5rem (8px) for standard cards, input fields, and main buttons. This is the primary radius for the "Kanban card" aesthetic.
*   **Large (rounded-xl):** 0.75rem (12px) for larger containers, modals, and featured sections.

Interactive elements should maintain these radii strictly to reinforce the sense of a cohesive, high-quality tool.

## Components
Consistent component behavior is vital for a productivity tool.

*   **Buttons:** Three tiers. Primary (Filled Blue), Secondary (Outlined Gray), and Tertiary (Ghost). Use 8px padding-x and 16px padding-y for standard buttons. 
*   **Input Fields:** Use 1px borders with a subtle blue focus ring. Labels are always persistent above the field in `label-md`. 
*   **Kanban Cards:** 8px corner radius, 16px internal padding. Use a subtle 1px border. Status indicators (dots or chips) should be placed in the top-right corner.
*   **Chips/Tags:** Used for "Remote," "Full-time," or skill sets. Use `label-sm` with a light-gray background and no border.
*   **Data Visualizations:** Use "Success Green" for upward trends and "Professional Blue" for current volume. Graphs should be clean, removing unnecessary axis lines to focus on the data trend.
*   **Lists:** High-density rows (48px height) with subtle bottom dividers for "All Applications" views.