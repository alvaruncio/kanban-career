# Tasks: Accessibility Audit Fixes

## Mandatory Rules

### Skills Requirement
- Before implementing ANY task, load the matching skill from `.agents/skills/<name>/SKILL.md` as defined in `AGENTS.md`.
- Frontend tasks: load `accessibility` for ARIA patterns and WCAG 2.2 guidelines.
- Load `frontend-design` and `tailwind-css-patterns` as applicable for styling adjustments.

### Build & Test Gate
- After completing every phase (or at minimum after finishing all phases), run `npm run build` then `npm run test` to ensure no regressions.
- If any build error or test failure occurs, stop and fix before proceeding.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr (exception-ok) |

## Phase 1: Component Semantics (Header, Footer, Cards, Columns)

- [x] **1.1** **Header** (`frontend/src/components/Header/Header.tsx`): Replace `<nav>` root with `<header>`, move navigation links inside `<nav aria-label="Navegación principal">`, add `aria-label="Ir a inicio"` to logo Link
- [x] **1.2** **Footer** (`frontend/src/components/Footer/Footer.tsx`): Wrap footer links in `<nav aria-label="Enlaces del pie de página">`
- [x] **1.3** **PricingCard** (`frontend/src/components/PricingCard/PricingCard.tsx`): Replace `<div>` root with `<article>`
- [x] **1.4** **StatCard** (`frontend/src/components/StatCard/StatCard.tsx`): Replace `<div>` root with `<article>`
- [x] **1.5** **KanbanColumn** (`frontend/src/components/KanbanColumn/KanbanColumn.tsx`): Replace `<div>` root with `<section>` and add `aria-label`

## Phase 2: Keyboard & ARIA (KanbanCard, Modal)

- [x] **2.1** **KanbanCard** (`frontend/src/components/KanbanCard/KanbanCard.tsx`): Add `tabIndex={0}`, `role="link"`, keyboard handler (Enter/Space) for click navigation. Keep existing click+drag distinction logic
- [x] **2.2** **Modal** (`frontend/src/components/Modal/Modal.tsx`): Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title `<h2 id="modal-title">`. Implement focus trap on Tab/Shift+Tab. Save and restore focus on open/close

## Phase 3: Layout & Navigation Semantics

- [x] **3.1** **DashboardLayout** (`frontend/src/layouts/DashboardLayout/DashboardLayout.tsx`): Add `<nav aria-label="Navegación del panel">` wrapping sidebar links, add `aria-label="Menú lateral"` to `<aside>`
- [x] **3.2** **KanbanPage** (`frontend/src/pages/KanbanPage/KanbanPage.tsx`): Change search input `type="text"` → `type="search"`, add `aria-label`
- [x] **3.3** **NotFoundPage** (`frontend/src/pages/NotFoundPage/NotFoundPage.tsx`): Wrap content in `<main>` landmark

## Phase 4: Form Accessibility (InputForm, SelectForm)

- [x] **4.1** **InputForm** (`frontend/src/components/InputForm/InputForm.tsx`): Add `aria-describedby` linking input to error message by generated ID
- [x] **4.2** **SelectForm** (`frontend/src/components/SelectForm/SelectForm.tsx`): Add `aria-describedby` for errors, add `aria-hidden="true"` to decorative chevron SVG

## Phase 5: ARIA Attributes (Charts, LanguageSelector, Register checklist)

- [x] **5.1** **DashboardChart** (`frontend/src/components/DashboardChart/DashboardChart.tsx`): Wrap chart in `<div role="img" aria-label="Gráfico: {title}">` for accessible text alternative
- [x] **5.2** **LanguageSelector** (`frontend/src/components/LanguageSelector/LanguageSelector.tsx`): Add `aria-hidden="true"` to `<span>` wrapping flag emoji
- [x] **5.3** **RegisterPage** (`frontend/src/pages/RegisterPage/RegisterPage.tsx`): Add `aria-hidden="true"` to check/cross icons in password checklist; add `sr-only` text with "Cumplido" / "Pendiente"

## Phase 6: Skip Links

- [x] **6.1** **DashboardLayout** (`frontend/src/layouts/DashboardLayout/DashboardLayout.tsx`): Add skip link before sidebar pointing to `#main-content`
- [x] **6.2** **LoginPage** (`frontend/src/pages/LoginPage/LoginPage.tsx`): Add skip link + `<main id="main-content">` landmark
- [x] **6.3** **RegisterPage** (`frontend/src/pages/RegisterPage/RegisterPage.tsx`): Add skip link + `<main id="main-content">` landmark
- [x] **6.4** **NotFoundPage** (`frontend/src/pages/NotFoundPage/NotFoundPage.tsx`): Add skip link before `<main id="main-content">`

## Phase 7: Build & Test Validation

- [x] **7.1** Run `npm run build` — passes with no errors (TypeScript + Vite)
- [x] **7.2** Run `npm run test:e2e -- --grep companies` — 25/25 tests pass in the companies suite
- [x] **7.3** Run `npm run test:e2e` — All tests pass
