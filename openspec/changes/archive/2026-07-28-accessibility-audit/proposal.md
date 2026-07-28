# Accessibility Audit Fixes

## Intent
Corregir los problemas de accesibilidad detectados en la auditoría basada en WCAG 2.2 y los patrones de NameThatUI (ejemplos-ui/). Son cambios exclusivamente semánticos y de ARIA — no se altera el comportamiento visual ni funcional.

## Scope

### In scope
Arreglos semánticos de HTML y ARIA en los siguientes componentes:

1. **Header** — `<nav>` → `<header>` + `<nav>` interno con `aria-label`, `aria-label` en logo link
2. **KanbanCard** — `tabIndex`, `role="link"` y handler de teclado para navegación por click
3. **Modal** — `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap básico
4. **Footer** — enlaces envueltos en `<nav>` con `aria-label`
5. **PricingCard** — `<div>` → `<article>`
6. **StatCard** — `<div>` → `<article>`
7. **KanbanColumn** — `<div>` → `<section>` con `aria-label`
8. **DashboardLayout** — `aria-label` en sidebar, `<nav>` para enlaces
9. **DashboardChart** — `role="img"` + `aria-label` en cada gráfico
10. **InputForm** — `aria-describedby` para asociar error con input
11. **SelectForm** — `aria-describedby` + `aria-hidden` en SVG decorativo
12. **KanbanPage** — input search con `type="search"` y `aria-label`
13. **LanguageSelector** — `aria-hidden` en emojis de banderas
14. **NotFoundPage** — añadir `<main>` landmark
15. **RegisterPage** — `aria-hidden` en iconos de password checklist
16. **LoginPage/RegisterPage/NotFound** — añadir skip links

### Out of scope
- Kanban drag & drop alternative (excluido explícitamente)
- Cambios visuales o funcionales
- Tests nuevos

## Non-goals
- No se añaden funcionalidades nuevas
- No se modifica el diseño visual
- No se toca el backend

## Evidence
- Auditoría completa en conversación con el orquestador
- Validación final: `npm run build` + `npm run test` en frontend
