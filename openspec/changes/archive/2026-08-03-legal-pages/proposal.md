# Proposal: Legal Pages (Privacy / Terms / Support)

## Intent

Footer links `/privacy`, `/terms`, `/support` exist with i18n labels but hit the catch-all → `NotFoundPage` (critical mvp-gap). Public SaaS needs legal reference pages + support channel. Static, generic content; user adapts with legal advisor later.

## Scope

### In Scope

| Deliverable | Files |
|---|---|
| PrivacyPage, TermsPage, SupportPage (default exports, MainLayout, PageMeta, static sections, i18n text only) | `frontend/src/pages/{PrivacyPage,TermsPage,SupportPage}/` (new) |
| 3 routes before `*` catch-all + barrel exports | `frontend/src/App.tsx`, `frontend/src/pages/index.ts` |
| Typed `legal` i18n section (titles, descriptions, body sections, lastUpdated, contactEmail) ES + EN | `frontend/src/locales/types/types.ts`, `es/es.ts`, `en/en.ts` |
| E2E spec (RED first): each route renders h1 (no 404), footer links navigate | `frontend/tests/specs/legal/legal-pages.spec.ts` (new) |
| Sitemap entries for legal URLs | `frontend/public/sitemap.xml` |

### Out of Scope

- Backend contact form / mailer / `/api/v1/support` endpoint
- Legal-advised content, cookie banner / GDPR tooling
- Footer `Record<string,string>` tightening, password reset, error boundaries, production Docker

## Capabilities

### New Capabilities

- `legal-pages`: public static Privacy/Terms/Support pages — routing, typed i18n content (ES/EN), PageMeta SEO, E2E coverage

### Modified Capabilities

None.

## Approach

1. RED: `legal-pages.spec.ts` — each route shows its h1 (ES/EN regex), footer links navigate; fails today (404)
2. Typed `legal` section in `types.ts` + `es.ts` + `en.ts` (`tsc -b` enforces parity); footer stays loose-typed
3. Pages mirror LandingPage: `PageMeta` (titles from i18n keys, never hardcoded) + fragment + Tailwind tokens (`max-w-7xl mx-auto px-gutter`, `bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm`); barrel export, `MainLayout` only (never `DashboardLayout` — avoids auth redirect)
4. Routes in `App.tsx` before `*`; sitemap entries
5. GREEN: Playwright passes; `npm run build` + `npm run lint` clean

## Affected Areas

| Area | Impact |
|---|---|
| `frontend/src/pages/{PrivacyPage,TermsPage,SupportPage}/` | New (3 pages) |
| `frontend/src/pages/index.ts`, `frontend/src/App.tsx` | Modified (barrel + 3 routes) |
| `frontend/src/locales/types/types.ts`, `es/es.ts`, `en/en.ts` | Modified (`legal` section) |
| `frontend/tests/specs/legal/legal-pages.spec.ts` | New (E2E, fixtures pattern) |
| `frontend/public/sitemap.xml` | Modified (3 URLs) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 2-language legal body exceeds 400-line budget | High | Forecast ~650-750 lines → chained PRs (below) |
| Body bloat | Med | 6-8 short sections/page; user-replaceable |
| DashboardLayout/auth redirect used | Low | MainLayout only; E2E asserts public access |
| Hardcoded PageMeta titles | Med | Titles from i18n keys |

**Line forecast**: i18n ~250 (types 25 + es 110 + en 110) + pages ~300 + routes/barrel ~15 + spec ~70 + sitemap ~15 ≈ **650-750 — exceeds 400**. Slicing (Feature Branch Chain, PR2 targets PR1):
- PR1 "i18n + RED spec" (~315): typed `legal` section + failing E2E (red until chain merges; build green)
- PR2 "pages + routes + sitemap" (~330): pages, barrel, routes, sitemap → GREEN

Decision needed before apply: Yes | Chained PRs recommended: Yes | 400-line budget risk: High

## Rollback Plan

Revert routes, barrel, page folders, i18n `legal` sections, sitemap. No DB/migrations — plain git revert per slice.

## Dependencies

None. `react-helmet-async`, `react-router-dom`, `useI18nStore`, Playwright present.

## Success Criteria

- [ ] `legal-pages.spec.ts` green: 3 h1s render (no 404), footer links navigate
- [ ] `npm run build` passes (`tsc -b` parity); lint clean
- [ ] No hardcoded UI text; footer links no longer 404
