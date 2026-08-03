# Design: Legal Pages (Privacy / Terms / Support)

## Technical Approach

Three static public pages under `frontend/src/pages/{PrivacyPage,TermsPage,SupportPage}/` render i18n-driven legal content from a new typed `legal` section of the `Translation` interface (ES + EN parity enforced by `tsc -b`), wrapped in `MainLayout`, registered in `App.tsx` before the `*` catch-all, with `PageMeta` SEO from i18n keys and three sitemap entries. E2E spec written RED-first proves no-404 rendering, footer navigation, FAQ + Contact, TOC anchor navigation, and MainLayout shell. User correction #5: all three pages follow the X.com privacy-page document pattern (https://x.com/es/privacy) — effective-date line, intro summary with bolded lead terms, numbered TOC with anchor links (sticky sidebar on `lg+`, in-page index on mobile), numbered chapters with optional subsections and bullet lists, plain typographic text. Shared `LegalDocument` component renders the document; SupportPage composes it with the FAQ accordion and Contact card. Smooth scroll via `html { scroll-behavior: smooth }` (reduced-motion override already present); `scroll-mt-24` offsets the fixed `h-16` Header.

## Architecture Decisions

| Decision | Options | Rationale |
|---|---|---|
| Page composition | Self-contained pages vs shared `LegalDocument` component | User correction #5 (X.com document redesign) grew the per-page markup to ~90 lines (header, intro, TOC × 2 variants, chapters with subsections/lists). Extracted `components/LegalDocument/LegalDocument.tsx` (named export via barrel) — pages compose it like LandingPage composes HeroSection/PricingSection. SupportPage passes the FAQ accordion + Contact card as `children` (rendered in the content column). Supersedes the earlier "self-contained sections.map()" decision. |
| Content presentation | Card blocks vs plain professional text vs X.com document | User correction #4 removed card wrappers (plain text); correction #5 replaced the plain-text block with the X.com document pattern: h1 + `effectiveDate` line (`En vigor: …` / `Effective date: …`) + description lead + intro heading with bolded-lead summary points (`LegalSummaryPoint { term, text }` — structured instead of plain strings so lead terms can be `<strong>` without HTML-in-i18n) + numbered TOC (`tocTitle`, anchor links to chapter `id`s) + numbered chapters `1. …` with optional numbered subsections `1.1 …` and bullet lists. Sticky sidebar TOC on `lg+`, in-page index block on mobile (`lg:hidden`). Content column `max-w-3xl`; chapters `scroll-mt-24` for the fixed `h-16` Header; `html { scroll-behavior: smooth }` (the existing `prefers-reduced-motion` block forces `auto`). The FAQ accordion and the Contact card on Support are the ONLY card/structured elements (kept exactly as implemented). |
| FAQ format | Flat list vs `<details>/<summary>` accordion | User correction (after 9/9 tasks were green): single-open native accordion — shared `name="faq"` for exclusive open, rotating `expand_more` chevron, `grid-template-rows 0fr→1fr` reveal animation. Native keyboard (Enter/Space) and focus preserved, no redundant ARIA. Replaces the original flat-list choice. Kept exactly in correction #5. |
| Route loading | Static barrel import vs `React.lazy` | Public pages follow LandingPage/LoginPage static imports (~3KB, no split win). Auth-guarded pages stay lazy. |
| Locale in E2E | `page.addInitScript(l => localStorage.setItem('locale', l), 'en')` before `goto` vs clicking LanguageSelector | `i18nStore` reads localStorage at module init — addInitScript runs before app JS, deterministic, no `waitForTimeout`. |
| Email rendering | Bare `mailto:` anchor vs dedicated card vs Contact section | User correction: the email card evolved into a full Contact section — one card after the FAQ accordion with heading `contactTitle` (`Contacto` ES / `Contact` EN) and three icon + labeled rows: email (`emailLabel` + `mailto:` anchor on `contactEmail`), hours (`hoursLabel` + `hoursValue`), response time (`responseLabel` + `responseValue`). All visible text from i18n keys, no hardcoding. |

## Data Flow

    App.tsx (route) ──> MainLayout (Header + Footer) ──> PrivacyPage | TermsPage | SupportPage
      │  static barrel import                              ├─ PageMeta (Helmet: t.legal.<page>.title/description)
      │                                                     └─ LegalDocument (content: t.legal.<page>)
      │                                                        ├─ h1 + effectiveDate + description
      │                                                        ├─ intro heading + bolded summary points
      │                                                        ├─ TOC (sticky sidebar lg+ / in-page index mobile)
      │                                                        ├─ chapters.map() → h2 + subsections h3 + bullets
      │                                                        └─ children (Support only: FAQ accordion + Contact card)

## File Changes

| File | Action | Description |
|---|---|---|
| `frontend/src/locales/types/types.ts` | Modify | `LegalSection` (FAQ), `LegalSummaryPoint`, `LegalSubsection`, `LegalChapter`, `LegalPageContent` (title/description/effectiveDate/intro/tocTitle/chapters), `LegalSupportContent` + `legal` key on `Translation` |
| `frontend/src/locales/es/es.ts` | Modify | `legal`: 3 pages × document model (8/8/6 chapters, subsections where content splits, one bullet list) + support faq/faqTitle/contactTitle/emailLabel/contactEmail/hoursLabel/hoursValue/responseLabel/responseValue |
| `frontend/src/locales/en/en.ts` | Modify | Identical shape — `tsc -b` enforces parity; chapter `id`s shared (anchors) |
| `frontend/src/components/LegalDocument/LegalDocument.tsx` | Create | Shared document renderer: header block, intro summary, TOC nav (sticky sidebar + mobile), chapters, children slot |
| `frontend/src/components/index.ts` | Modify | `export { LegalDocument }` |
| `frontend/src/index.css` | Modify | `html { scroll-behavior: smooth; }` (reduced-motion block below overrides to `auto`) |
| `frontend/tests/specs/legal/legal-pages.spec.ts` | Create | RED spec, 8 tests, `test`/`expect` from `../../fixtures` |
| `frontend/src/pages/PrivacyPage/PrivacyPage.tsx` | Modify | Thin: PageMeta + `<LegalDocument content={t.legal.privacy} />` |
| `frontend/src/pages/TermsPage/TermsPage.tsx` | Modify | Thin: same with `t.legal.terms` |
| `frontend/src/pages/SupportPage/SupportPage.tsx` | Modify | Thin: `<LegalDocument>` + FAQ accordion + Contact card as children (markup kept exactly) |
| `frontend/src/pages/index.ts` | Modify | 3 barrel exports |
| `frontend/src/App.tsx` | Modify | 3 static imports + routes before `*`, MainLayout-wrapped |
| `frontend/public/sitemap.xml` | Modify | 3 `<url>` entries (monthly, 0.5) |

## Interfaces / Contracts

```ts
// frontend/src/locales/types/types.ts
export interface LegalSection {
  heading: string
  body: string
}

export interface LegalSummaryPoint {
  term: string
  text: string
}

export interface LegalSubsection {
  title: string
  body: readonly string[]
}

export interface LegalChapter {
  id: string
  title: string
  intro?: readonly string[]
  subsections?: readonly LegalSubsection[]
  body?: readonly string[]
  list?: readonly string[]
}

export interface LegalPageContent {
  title: string
  description: string
  effectiveDate: string
  intro: {
    heading: string
    summaryPoints: readonly LegalSummaryPoint[]
  }
  tocTitle: string
  chapters: readonly LegalChapter[]
}

export interface LegalSupportContent extends LegalPageContent {
  faqTitle: string
  faq: readonly LegalSection[]
  contactTitle: string
  emailLabel: string
  contactEmail: string
  hoursLabel: string
  hoursValue: string
  responseLabel: string
  responseValue: string
}

// added to Translation (after `language`)
legal: {
  privacy: LegalPageContent
  terms: LegalPageContent
  support: LegalSupportContent
}
```

`es.ts`/`en.ts` export objects with identical keys; values differ per language. Chapter `id`s are shared kebab-case slugs used as anchor targets (e.g. `'informacion-que-recopilamos'`) — the same in both locales so TOC hrefs are locale-independent. `effectiveDate` is a localized display string (`'En vigor: 1 de agosto de 2026'` ES / `'Effective date: August 1, 2026'` EN — replaced `lastUpdated` per the X.com pattern); `tocTitle` is `'Índice'` (ES) / `'Table of Contents'` (EN); chapter titles carry their number (`'1. Información que recopilamos'`), subsections their number + title (`'1.1 Datos que nos proporcionas'`). `contactTitle` is `'Contacto'` (ES) / `'Contact'` (EN); `emailLabel` is `'Email de soporte'` (ES) / `'Support email'` (EN); `contactEmail: 'support@kanbancareer.com'` is identical in both; `hoursValue` is `'Lunes a viernes de 9:00 a 14:00'` (ES) / `'Monday to Friday, 9:00 AM – 2:00 PM'` (EN); `responseValue` is `'en 24–48 horas laborables'` (ES) / `'within 24–48 business hours'` (EN). `footer` stays loose-typed (`Record<string, string>`) per spec.

## Component Design (per page)

All three pages share `components/LegalDocument/LegalDocument.tsx` (named export, barrel-re-exported): outer `max-w-7xl mx-auto px-gutter py-xl`; `lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-xl` two-column document layout — sticky sidebar TOC (`<aside className="hidden lg:block">` → `<nav aria-label={tocTitle} className="lg:sticky lg:top-20">` with `<ol>` of `<a href={`#${chapter.id}`}>` links, `font-body-md text-body-md text-on-surface-variant hover:text-primary` + `focus-visible:ring-2 focus-visible:ring-primary`), content column `max-w-3xl`. Header block: `<h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">`, `effectiveDate` (`font-label-sm text-label-sm text-on-surface-variant mb-lg`), `description` lead (`font-body-lg text-body-lg text-on-surface-variant mb-lg`). Intro: `<section aria-labelledby="intro-heading">` h2 `intro.heading` (`font-headline-md text-headline-md text-on-surface mb-md`) + `summaryPoints.map()` → `<p className="font-body-md text-body-md text-on-surface leading-relaxed">` with `<strong className="font-semibold">{term}</strong> {text}`. Mobile in-page TOC: same `<nav>` with `lg:hidden mb-xl`. Chapters: `<div className="space-y-xl">` → `<section id={chapter.id} aria-labelledby={`${chapter.id}-heading`} className="scroll-mt-24">` — h2 `chapter.title`, optional `intro` paragraphs, optional `subsections` (h3 `font-body-lg text-body-lg font-semibold text-on-surface mb-sm` + body paragraphs), optional `body` paragraphs, optional `list` as `<ul className="list-disc pl-md space-y-sm">`. SupportPage composes `<LegalDocument content={t.legal.support}>` and passes as children: FAQ h2 (`faqTitle`) + `faq.map()` → `<details name="faq">` accordion rows (card tokens + `<summary>` trigger + rotating `expand_more` chevron + `grid-rows-[0fr]→[1fr]` reveal animation — kept exactly), and the Contact section: `<section>` with card tokens (kept exactly), h2 `contactTitle`, and a `<ul>` of three labeled rows (icon `material-symbols-outlined` aria-hidden + `{label}: {value}`): email (`emailLabel` + `<a href={`mailto:${contactEmail}`} className="text-primary hover:underline">`), hours (`hoursLabel` + `hoursValue`), response time (`responseLabel` + `responseValue`). 6-8 chapters per page, max.

## Styling

Tailwind v4 tokens only, consistent with the design system: `max-w-7xl mx-auto px-gutter`, `py-xl`, `gap-xl`/`mb-md`/`mb-lg`/`space-y-*` rhythm, `font-headline-lg/headline-md/body-lg/body-md/label-sm` with matching `text-*` utilities, `text-on-surface`/`text-on-surface-variant`, `text-primary hover:underline` for the email link, document measure `max-w-3xl` with `leading-relaxed` body text and `font-semibold` on intro lead terms. Document sections are PLAIN text — no card tokens (`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm`) except the Support FAQ accordion rows and Contact card (kept exactly). TOC links: `hover:text-primary` + `focus-visible:ring-2 focus-visible:ring-primary`. Smooth anchor scrolling via one global rule `html { scroll-behavior: smooth; }` (the existing `prefers-reduced-motion` block forces `scroll-behavior: auto !important`); chapter targets offset the fixed `h-16` Header with `scroll-mt-24`, sidebar sticks at `lg:top-20`. No other new global CSS, no `tailwind.config` changes.

## Testing Strategy

| Layer | What | How |
|---|---|---|
| E2E | h1 + no-404 per route | `goto('/privacy')`; `getByRole('heading', { level: 1 })` matches `/Política de Privacidad\|Privacy Policy/` (404 h1 never matches); URL stays `/privacy`. One pass per locale (es default, `en` via `addInitScript`) |
| E2E | Footer navigation | `goto('/')`; `getByRole('link', { name: /Privacidad\|Privacy/ })` click → `waitForURL('**/privacy')`; per link |
| E2E | Support FAQ + email | h2 `/Preguntas Frecuentes\|FAQ/` visible; `getByText('support@kanbancareer.com')` visible |
| E2E | Document structure + TOC | `/privacy`: `effectiveDate` text visible; h2 `/Resumen\|Summary/` + a bolded summary point visible; `getByRole('navigation', { name: /Índice\|Table of Contents/ })` visible; first chapter link `href="#informacion-que-recopilamos"`; click → URL hash `#informacion-que-recopilamos` + chapter h2 and subsection h3 visible (ES); EN pass: h2 `Summary` + nav `Table of Contents` |
| E2E | MainLayout shell | `/privacy`: `getByRole('banner')` (Header) + `getByRole('contentinfo')` (Footer) visible |

No POM: 6 linear tests, plain `page` from fixtures suffices (POM pays off for repeated complex flows). No unit tests — content is static i18n data. Deterministic waits only (spec already bans `waitForTimeout`).

## PR Slicing Alignment (400-line budget)

| Slice | Content | ~Lines | Green? |
|---|---|---|---|
| PR1 "i18n + RED spec" | `types.ts` (~30) + `es.ts` (~130) + `en.ts` (~130) + `legal-pages.spec.ts` (~65) | ~355 | Build + lint green (spec is Playwright-only; ESLint ignores `tests/`); e2e RED by design |
| PR2 "pages + routes + sitemap" | 3 pages (~95 each) + barrel (3) + `App.tsx` (3) + `sitemap.xml` (~15) | ~330 | All green; chain merge turns PR1's spec GREEN |

`tsc -b` parity forces types + es + en in the same PR — splitting locales across PRs breaks the build. PR1 targets the feature branch, PR2 targets PR1 (Feature Branch Chain). **Superseded (see tasks.md):** the user approved ONE PR with maintainer `size:exception` — no PR boundaries; user corrections #4/#5 applied on top of the single PR.

## SEO

`<PageMeta title={t.legal.<page>.title} description={t.legal.<page>.description} />` per page — titles/descriptions never hardcoded (AGENTS.md rule 9; LandingPage's hardcoded PageMeta is not copied). Sitemap: three `<url>` entries `https://kanbancareer.com/{privacy,terms,support}`, `changefreq monthly`, `priority 0.5` — matching the existing login/register pattern.

## Threat Matrix

N/A — no shell/subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. React Router additions are application code, not routing infrastructure.

## Migration / Rollout

No migration required. Rollback: plain git revert per slice (routes, barrel, page folders, i18n `legal` sections, sitemap).

## Open Questions

None.
