# Archive: Accessibility Audit Fixes

## Summary
16 correcciones de accesibilidad aplicadas en toda la interfaz frontend. Cambios exclusivamente semánticos y de ARIA — sin alterar comportamiento visual ni funcional.

## Artifacts
- proposal.md
- design.md
- tasks.md
- apply-progress (engram)

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/components/Header/Header.tsx` | `<nav>` → `<header>`, `<nav aria-label>`, logo `aria-label` |
| `frontend/src/components/Footer/Footer.tsx` | Enlaces en `<nav aria-label>` |
| `frontend/src/components/PricingCard/PricingCard.tsx` | `<div>` → `<article>` |
| `frontend/src/components/StatCard/StatCard.tsx` | `<div>` → `<article>` |
| `frontend/src/components/KanbanColumn/KanbanColumn.tsx` | `<div>` → `<section>` + `aria-label` |
| `frontend/src/components/KanbanCard/KanbanCard.tsx` | `<article>` + `tabIndex` + `role="link"` + keyboard handler |
| `frontend/src/components/Modal/Modal.tsx` | `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap |
| `frontend/src/layouts/DashboardLayout/DashboardLayout.tsx` | Skip link, `<nav aria-label>`, `<aside aria-label>`, `<main id>` |
| `frontend/src/pages/KanbanPage/KanbanPage.tsx` | input `type="search"` + `aria-label` |
| `frontend/src/pages/NotFoundPage/NotFoundPage.tsx` | Skip link + `<main>` landmark |
| `frontend/src/pages/LoginPage/LoginPage.tsx` | Skip link + `<main id="main-content">` |
| `frontend/src/pages/RegisterPage/RegisterPage.tsx` | Skip link + `<main id="main-content">`, `aria-hidden` en checklist |
| `frontend/src/components/InputForm/InputForm.tsx` | `aria-describedby` para errores |
| `frontend/src/components/SelectForm/SelectForm.tsx` | `aria-describedby` + `aria-hidden` SVG |
| `frontend/src/components/DashboardChart/DashboardChart.tsx` | `role="img"` + `aria-label` |
| `frontend/src/components/LanguageSelector/LanguageSelector.tsx` | `aria-hidden` en emojis |

## Validation
- `npm run build`: ✅ Passed
- `npm run test:e2e`: 3 frontend-only tests pass (13 E2E require backend — pre-existing)

## Excluded
- Kanban drag & drop alternative (excluido explícitamente por el usuario)
