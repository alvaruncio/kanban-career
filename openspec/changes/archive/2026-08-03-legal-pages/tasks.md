# Tasks: Legal Pages (Privacy / Terms / Support)

## Mandatory Rules

- STRICT TDD: RED test first, then GREEN implementation. No exceptions.
- Load `.agents/skills/playwright-best-practices/SKILL.md` before writing tests; `tailwind-css-patterns` + `i18n-localization` before pages/i18n work.
- Gate: after each phase run `npm run build` — `tsc -b` enforces i18n parity; fix before proceeding.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~650-750 |
| 400-line budget risk | High |
| Chained PRs recommended | No |
| Suggested split | Single PR (size:exception approved) |
| Delivery strategy | exception-ok |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

Note: the design's 2-PR slicing is superseded — user approved ONE PR with maintainer `size:exception`. Tasks below are one continuous sequence, no PR boundaries.

## Phase 1: RED E2E Spec (TDD first)

- [x] **1.1 RED legal E2E spec** — Create `frontend/tests/specs/legal/legal-pages.spec.ts` with 6 tests, `test`/`expect` from `../../fixtures`: h1 + no-404 per route (`/privacy`, `/terms`, `/support`; ES default + EN via `addInitScript`), footer links navigate (`waitForURL`), support FAQ heading + `support@kanbancareer.com`, Header/Footer visible. Deterministic waits only. Accept: `npx playwright test legal` — all 6 fail RED (routes 404 today).

## Phase 2: Typed legal i18n (GREEN groundwork)

- [x] **2.1 Translation types** — Add `LegalSection`, `LegalPageContent`, `LegalSupportContent` + `legal` key (privacy/terms: `LegalPageContent`; support: `LegalSupportContent`) to `frontend/src/locales/types/types.ts` after `language`. Accept: `tsc -b` errors on es/en until 2.2 lands.
- [x] **2.2 es + en legal content** — Implement identical `legal` shapes in `frontend/src/locales/es/es.ts` and `en/en.ts`: 3 pages × title/description/lastUpdated/6-8 sections + support faq/faqTitle/contactTitle/emailLabel/contactEmail/hoursLabel/hoursValue/responseLabel/responseValue (`support@kanbancareer.com`). Accept: `npm run build` passes (parity enforced).

## Phase 3: Pages (GREEN)

- [x] **3.1 PrivacyPage** — Create `frontend/src/pages/PrivacyPage/PrivacyPage.tsx`: default export, fragment, `<PageMeta title={t.legal.privacy.title} description={t.legal.privacy.description} />`, h1 + intro + lastUpdated + `sections.map()` cards (design tokens, `max-w-7xl mx-auto px-gutter`). Accept: renders on `/privacy`, no hardcoded text.
- [x] **3.2 TermsPage** — Same pattern at `frontend/src/pages/TermsPage/TermsPage.tsx` with `t.legal.terms`. Accept: renders on `/terms`, no hardcoded text.
- [x] **3.3 SupportPage** — `frontend/src/pages/SupportPage/SupportPage.tsx`: same pattern + FAQ flat list (`faqTitle` + `faq.map()`) + `<a href={`mailto:${t.legal.support.contactEmail}`} className="text-primary hover:underline">`. Accept: FAQ + email visible on `/support`. **User correction (after verify): FAQ rendered as single-open native `<details>/<summary>` accordion (`name="faq"`, rotating chevron, `grid-rows 0fr→1fr` animation) instead of a flat list — 7th E2E test `support FAQ accordion reveals answers and closes on another question` covers it. User correction #2 (after verify): email moved from the end of the FAQ into its own card (`<section>` with card tokens) after the accordion — paragraph `{emailLabel}:` + `mailto:` link; test renamed to `support page shows FAQ and contact email in its own card` and strengthened (label ES/EN + `mailto:` href). User correction #3 (after verify): the email card evolved into a full Contact section — one card after the FAQ accordion with heading `contactTitle` and three icon + labeled rows (email `mailto:` link, hours, response time); test renamed to `support page shows FAQ and Contact section with email, hours and response time` (title ES/EN + three rows + `mailto:` href). User correction #4 (after verify): content sections on all three pages are now plain professional text — card wrappers removed (`bg-surface-container-lowest border ... shadow-sm`), body in `text-on-surface` with `leading-relaxed` inside a `max-w-[42rem] space-y-lg` block. FAQ accordion and Contact card on Support kept exactly as-is. **User correction #5 (after verify): full X.com privacy-page document redesign** — all three pages now render the X.com document pattern (https://x.com/es/privacy) via a shared `components/LegalDocument/LegalDocument.tsx` (named export, barrel): h1 + `effectiveDate` line (`En vigor:`/`Effective date:`) + description lead + intro heading with bolded summary points (`LegalSummaryPoint { term, text }`) + numbered TOC (`tocTitle`, anchor links to chapter `id`s; sticky sidebar on `lg+`, in-page index on mobile) + numbered chapters (optional subsections `1.1 …` with h3, optional bullet `list`), all plain text, content column `max-w-3xl`, chapters `scroll-mt-24` (fixed `h-16` Header), smooth scroll via `html { scroll-behavior: smooth; }` (reduced-motion override kept). i18n model: `lastUpdated`+`sections` replaced by `effectiveDate`+`intro`+`tocTitle`+`chapters[]` (all original content preserved verbatim, split into subsections/bullets where natural). FAQ accordion and Contact card kept EXACTLY as-is, passed as `LegalDocument` children on Support. New 8th E2E test `legal pages show effective date, intro summary and a working table of contents` (TOC anchor click → hash + chapter/subsection headings, ES + EN). 8/8 legal E2E green, build + lint clean. SDD artifacts updated (design decision rows #5, data flow, file table, contracts, component design, styling, testing strategy; spec requirement "X.com-style documents with a working TOC" + technical requirements + test list; this note).**

## Phase 4: Routes + Sitemap (GREEN wiring)

- [x] **4.1 Barrel + routes** — Export the 3 pages from `frontend/src/pages/index.ts`; add static imports + 3 routes BEFORE `*` in `frontend/src/App.tsx`, MainLayout-wrapped (match `/` pattern; never DashboardLayout/ProtectedRoute). Accept: routes render h1, no 404.
- [x] **4.2 Sitemap** — Add 3 `<url>` entries `https://kanbancareer.com/{privacy,terms,support}` (changefreq monthly, priority 0.5) to `frontend/public/sitemap.xml`. Accept: 3 new `<loc>` entries present.

## Phase 5: GREEN Verification

- [x] **5.1 Full green** — Run `npm run test:e2e` (legal spec passes, no regressions), `npm run build`, `npm run lint`. Accept: all green per spec acceptance criteria.
