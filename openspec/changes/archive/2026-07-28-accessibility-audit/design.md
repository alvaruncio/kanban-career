# Design: Accessibility Audit Fixes

> Proposal: proposal.md

## Approach

No hay cambios de arquitectura ni diseño visual. Todas las correcciones son semánticas y de ARIA, siguiendo los patrones de:

1. **WCAG 2.2** — POUR (Perceivable, Operable, Understandable, Robust)
2. **NameThatUI** — Estructuras HTML semánticas documentadas en `ejemplos-ui/`
   - `<header>` + `<nav aria-label>` para cabeceras (header-navbar.html)
   - `<article>` para tarjetas autónomas (card.html)
   - `<section aria-label>` para grupos de contenido (bento-grid.html, masonry-layout.html)
3. **A11Y Patterns** (del skill de accesibilidad)
   - Skip links
   - Modal focus trap con `role="dialog"` + `aria-modal` + `aria-labelledby`
   - Form labels con `aria-describedby`

## Patrón de skip link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
>
  Saltar al contenido principal
</a>
<main id="main-content">...
```

## Patrón de Modal ARIA

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Título</h2>
  <!-- focus trap: Tab/Shift+Tab ciclan dentro del modal -->
</div>
```

## Patrón de tarjeta clickeable con teclado

```tsx
<article tabIndex={0} role="link" onKeyDown={handleKeyDown}>
```

## Patrón de error con aria-describedby

```tsx
const errorId = `${name}-error`
<input aria-describedby={error ? errorId : undefined} />
{error && <p id={errorId} role="alert">{error.message}</p>}
```

## Riesgos

- Ninguno: cambios puramente de marcado, sin lógica de negocio ni estilos visuales
- Los tests de integración pueden fallar si usan selectores basados en etiquetas HTML (ej: `div.card` → `article.card`) — se ajustarán si ocurre
