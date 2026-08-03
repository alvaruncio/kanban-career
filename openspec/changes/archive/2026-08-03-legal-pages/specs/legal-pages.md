# Legal Pages Specification

## Purpose

Public static Privacy, Terms and Support pages with professional generic legal reference content (English artifacts, user adapts later with advisor) plus a static Support page with FAQ and contact email. Frontend-only: no backend endpoint, no mailer.

## Requirements

### Requirement: Legal routes render publicly without auth or 404

The system MUST render `/privacy`, `/terms` and `/support` as public routes registered in `App.tsx` BEFORE the `*` catch-all. Each page MUST be wrapped in `MainLayout` (Header + Footer visible) and MUST NOT be wrapped in `DashboardLayout` or `ProtectedRoute`. The existing Footer links (`t.footer.privacy|terms|support`) MUST navigate to these routes without hitting `NotFoundPage`.

| Feature | Scenario | Given | When | Then |
|---|---|---|---|---|
| Public routes | No session, no 404 | user opens `/privacy`, `/terms` or `/support` logged out | the page loads | h1 shows, no redirect, no `NotFoundPage` |
| Public routes | Footer navigation | user is on the landing page with Footer visible | user clicks the privacy/terms/support footer link | URL changes to the matching route |
| Public routes | MainLayout shell | user is on `/privacy` | the page renders | Header and Footer visible; content inside `<main id="main-content">` |

### Requirement: All visible text comes from a typed `legal` i18n section

The system MUST add a typed `legal` section to the `Translation` interface in `frontend/src/locales/types/types.ts` following the X.com document model: per page, a `title`, `description`, `effectiveDate` line, an `intro` (heading + bolded `summaryPoints` with `term`/`text`), a `tocTitle`, and 6-8 numbered `chapters` (anchor `id`, numbered title, optional intro paragraphs, optional numbered subsections with body paragraphs, optional bullet `list`), plus the support contact keys (`contactTitle`, `emailLabel`, `contactEmail`, `hoursLabel`, `hoursValue`, `responseLabel`, `responseValue`). `es.ts` and `en.ts` MUST implement the identical shape (shared chapter `id`s as anchors; titles translated) — `tsc -b` enforces parity. All visible strings MUST come from `useI18nStore` keys, including `PageMeta` title/description (no hardcoded text, AGENTS.md rule 9).

| Feature | Scenario | Given | When | Then |
|---|---|---|---|---|
| i18n | Locale switch | user is on `/privacy` with locale `es` | locale switched to `en` via `LanguageSelector` | h1, chapters and page title render in English |
| i18n | Parity compile-enforced | `legal` is added to `Translation` | `npm run build` (`tsc -b`) runs | passes only if `es.ts` and `en.ts` satisfy every `legal` key |

### Requirement: Legal pages render as X.com-style documents with a working TOC

The system MUST render `/privacy`, `/terms` and `/support` as document pages following the X.com privacy-page pattern: `h1` title, `effectiveDate` line under it, description lead, intro heading with bolded summary points, and a numbered table of contents whose anchor links scroll to their chapters. On `lg+` the TOC MUST be a sticky sidebar; below that, an in-page index block at the top of the document. Chapters MUST be numbered sections with optional numbered subsections and bullet lists, plain typographic text (no cards/borders/surface backgrounds — the Support FAQ accordion and Contact card are the only carded elements, kept exactly). Anchor navigation MUST account for the fixed Header (`scroll-mt` offset) and respect `prefers-reduced-motion` (smooth scroll disabled).

| Feature | Scenario | Given | When | Then |
|---|---|---|---|---|
| Document | Effective date + summary | user opens `/privacy` | the page loads | `En vigor: …` (ES) / `Effective date: …` (EN) line visible; intro heading and bolded summary points visible |
| Document | TOC anchors | user is on `/privacy` | user clicks the first TOC link | URL gains `#informacion-que-recopilamos` and the chapter heading is visible; subsection heading `1.1 …` visible |
| Document | No card surfaces | user is on `/privacy` | the document renders | content is plain text (no card wrappers); only Support shows the FAQ accordion and Contact card |
| Document | Reduced motion | user prefers reduced motion | user clicks a TOC link | scroll is instant (global `prefers-reduced-motion` override) |

### Requirement: Support page shows FAQ and Contact section

The system MUST render `/support` with a static FAQ (no backend, no mailer) and a Contact section. The FAQ MUST be a single-open accordion built with native `<details>`/`<summary>` elements grouped by a shared `name` attribute: answers are hidden until their question is clicked, opening one question closes the previously open one, and native keyboard behavior (Enter/Space toggling, focus stays on the trigger) is preserved. No redundant `aria-expanded` (managed natively). The Contact section MUST be a card (the card tokens: `bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm`) placed after the FAQ accordion, with the heading from `legal.support.contactTitle` (`Contacto` ES / `Contact` EN) and three labeled rows (icon + `{label}: {value}`): the email from `emailLabel` + `contactEmail` (`Email de soporte: support@kanbancareer.com` ES / `Support email: support@kanbancareer.com` EN) as a `mailto:` link, the hours from `hoursLabel` + `hoursValue` (`Lunes a viernes de 9:00 a 14:00` ES / `Monday to Friday, 9:00 AM – 2:00 PM` EN), and the response time from `responseLabel` + `responseValue` (`Tiempo de respuesta: en 24–48 horas laborables` ES / `Response time: within 24–48 business hours` EN).

| Feature | Scenario | Given | When | Then |
|---|---|---|---|---|
| Support | Static FAQ + Contact section | user opens `/support` | the page loads | FAQ items are visible; the Contact section shows its title and the email, hours and response-time rows with the values above, the email as a `mailto:` link |
| Support | Accordion behavior | user is on `/support` | the user clicks a FAQ question | its answer becomes visible; opening another question closes the previous one; pressing Enter on a focused question toggles it |

### Requirement: Legal URLs are indexed in the sitemap

The system MUST add `<loc>` entries for `https://kanbancareer.com/privacy`, `/terms` and `/support` to `frontend/public/sitemap.xml`.

| Feature | Scenario | Given | When | Then |
|---|---|---|---|---|
| SEO | Sitemap entries | `frontend/public/sitemap.xml` | the file is inspected | it contains the three legal URLs alongside existing entries |

## TDD Test Specs (RED first — `frontend/tests/specs/legal/legal-pages.spec.ts`)

Written before implementation (strict TDD); uses `test`/`expect` from `../../fixtures`, deterministic waits only (no `waitForTimeout`). All fail today (routes hit the catch-all):

| Test | Key assertions |
|---|---|---|
| `should render the privacy page with its h1 and no 404` | `goto('/privacy')`; h1 visible (ES/EN regex); URL stays `/privacy`; no `NotFoundPage` |
| `should render the terms page with its h1 and no 404` | Same for `/terms` |
| `should render the support page with its h1 and no 404` | Same for `/support` |
| `should show the effective date, intro summary and a working table of contents on legal pages` | `/privacy`; `En vigor:`/`Effective date:` text visible; h2 `Resumen`/`Summary` + bolded summary point visible; `getByRole('navigation', { name: /Índice\|Table of Contents/ })` visible; first chapter link `href="#informacion-que-recopilamos"`; click → URL hash + chapter h2 and subsection h3 `1.1 …` visible (ES); EN pass: h2 `Summary` + nav `Table of Contents` |
| `should navigate to privacy, terms and support from the footer links` | `goto('/')`; click footer link; `waitForURL('**/privacy'\|'/terms'\|'/support')` per link |
| `should show the FAQ and Contact section with email, hours and response time on the support page` | `/support`; FAQ heading visible; Contact heading visible (`Contacto`/`Contact`); contact card shows the email row (`Email de soporte: support@kanbancareer.com`, `mailto:` href), hours row and response-time row (ES + EN pages); EN heading is `Contact` |
| `should reveal answers in the FAQ accordion and close on opening another question` | `/support`; answers hidden until opened; clicking a question reveals its answer; opening another question closes the previous one (single-open); Enter toggles the focused question |
| `should render legal pages inside the MainLayout` | `/privacy`; Header and Footer visible |
| `should disable smooth scroll and still render the legal page with reduced motion` | `emulateMedia({ reducedMotion: 'reduce' })`; h1 + TOC visible; computed `scroll-behavior` is `auto` |
| `should render legal document content as plain text with no card surfaces in the chapters region (scoped to main div.space-y-xl)` | `/privacy` and `/support`; chapters region has zero `bg-surface-container-lowest`; positive control: Support FAQ/Contact cards keep the class outside the region |

## Technical Requirements

- New pages `frontend/src/pages/{PrivacyPage,TermsPage,SupportPage}/`: default exports, `MainLayout`, `PageMeta` (i18n keys), fragment composing the shared `LegalDocument` component (barrel-exported from `components/index.ts`) with `t.legal.<page>` — X.com document layout: h1 + `effectiveDate` + description + intro heading with bolded summary points + numbered TOC (sticky sidebar `lg+`, in-page index on mobile, anchor links to chapter ids) + numbered chapters (`scroll-mt-24` for the fixed `h-16` Header) with optional subsections and bullet lists, all PLAIN TEXT (no card wrappers). Card tokens (`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm`) are used ONLY by the Support FAQ accordion rows and the Support Contact card (passed as `LegalDocument` children, markup kept exactly). Smooth scroll: `html { scroll-behavior: smooth; }` — existing `prefers-reduced-motion` block forces `auto`.
- Barrel `frontend/src/pages/index.ts` MUST re-export the three pages; routes in `App.tsx` BEFORE the `*` route, matching the public `/` pattern.
- Typed `legal` section in `types.ts` + `es.ts` + `en.ts` (document model: `effectiveDate`, `intro.heading`/`summaryPoints`, `tocTitle`, `chapters[]` with `id`/`title`/`intro?`/`subsections?`/`body?`/`list?`); `footer` stays loose-typed (`Record<string, string>`).
- `sitemap.xml`: three new `<url>` entries (monthly changefreq, 0.5 priority).
- Out of scope: backend support endpoint, mailer, cookie banner, GDPR tooling.

## Acceptance Criteria

- [x] `npm run test:e2e` green: `legal-pages.spec.ts` passes (3 h1s, footer navigation, document TOC anchors, support email, MainLayout)
- [x] `npm run build` (`tsc -b`) and `npm run lint` clean — i18n parity enforced
- [x] `/privacy`, `/terms`, `/support` render public content without auth and without 404
- [x] No hardcoded UI text: all strings, including `PageMeta` titles, come from i18n keys in ES + EN
- [x] `sitemap.xml` includes the three legal URLs
