# KanbanCareer Frontend — AGENTS

## ⚠️ Mandatory

**Before any frontend task, you MUST read this file in full.** This AGENTS.md contains folder structure, architecture patterns, coding conventions, and examples that are mandatory for all frontend work. Violating these rules will result in incorrect code.

> **⚠️ Additionally, before any frontend design/UI task, you MUST read [`DESIGN.md`](./DESIGN.md) — all visual design must follow the design system defined there.**

## Technologies

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI library (React Compiler enabled via Babel plugin) |
| **TypeScript** | ~6.0 | Strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| **Vite** | 8 | Build tool + dev server (Rolldown-based) |
| **Tailwind CSS** | 4 | Utility-first CSS (no `tailwind.config.*`, uses `@import "tailwindcss"`) |
| **React Router** | 7 | Client-side routing with `react-router-dom` |
| **Zustand** | 5 | State management |
| **React Hook Form** | 7 | Forms with `useForm`, `useWatch`, validation |
| **Axios** | 1 | HTTP client with interceptors |
| **react-helmet-async** | 3 | SEO meta tags management |
| **React Compiler** | — | Auto-memoization; do NOT use `useMemo`/`useCallback` where compiler suffices |

## Folder Structure

```
src/
├── App.tsx                # Route definitions (React Router v7)
├── main.tsx               # Entry — wraps App in StrictMode + HelmetProvider + BrowserRouter
├── index.css              # Global styles + Tailwind v4 import
├── App.css                # App-specific styles
├── assets/                # Static assets
├── components/            # Shared presentational components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── KanbanColumn.tsx   # Reusable kanban column (prepared for drag & drop)
│   ├── LanguageSelector.tsx
│   ├── LoadingSkeleton.tsx # Spinner skeleton with i18n text
│   ├── PricingCard.tsx    # Pricing card with `recommended` variant prop
│   ├── PricingSection.tsx
│   └── StatCard.tsx       # Reusable stat card
├── contexts/              # React contexts
│   └── AuthContext.tsx     # Auth provider (access + refresh token)
├── hooks/                 # Custom hooks
│   └── usePageMeta.tsx    # Per-page SEO via <Helmet>
├── interfaces/            # TypeScript interfaces
│   ├── api.ts
│   ├── application.ts
│   ├── auth.ts
│   └── layout.ts
├── layouts/               # Layout components
│   ├── MainLayout.tsx     # Public pages (landing, login, register)
│   └── DashboardLayout.tsx # Protected pages (dashboard, kanban)
├── locales/               # i18n translations
│   ├── types.ts           # Translation interface
│   ├── es.ts              # Spanish translations
│   └── en.ts              # English translations
├── pages/                 # Route page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx  # Lazy loaded
│   ├── KanbanPage.tsx     # Lazy loaded
│   └── NotFoundPage.tsx   # 404 (standalone, no MainLayout)
├── services/              # API client
│   └── api.ts             # Axios instance with JWT interceptors
└── stores/                # Zustand stores
    ├── applicationsStore.ts
    └── i18nStore.ts
```

## Architecture Pattern

- **Component-per-file** — each `.tsx` file exports one component (default export for pages, named export for shared components)
- **Lazy loading** — pages behind auth (`DashboardPage`, `KanbanPage`) use `React.lazy()` + `<Suspense>` with `LoadingSkeleton`
- **Composition over boolean props** — prefer compound components or slot props instead of boolean flags that change rendering
- **Zustand for global state** — stores are flat, use `set()` directly, no slices
- **Axios for HTTP** — single `api.ts` instance with request/response interceptors for JWT handling
- **i18n via Zustand** — `useI18nStore` holds locale and translations; `t.common.*` pattern for shared strings

## Conventions

### Naming
- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities/stores
- **Exports**: named exports for shared components, default exports for pages
- **Interfaces**: `interface`, not `type`, for object shapes; `I` prefix not used

### Code Style
- **ESM only** — `import`/`export`, no `require`
- **`import type`** required for type-only imports (enforced by `verbatimModuleSyntax`)
- **No unused locals/params** — both flags are `true` in tsconfig
- **React Compiler** — trust the compiler for memoization; only use `useMemo`/`useCallback` when the compiler cannot handle the pattern (e.g., stable references passed to third-party libs that rely on referential identity)
- **No `any`** — prefer `unknown` with type guards
- **Minimal comments** — code should be self-documenting

### Styling
- **Tailwind v4 utilities only** — no custom CSS classes unless unavoidable
- **Design tokens** defined in `DESIGN.md` (palette, typography, spacing, rounded, elevation)
- **Dark mode** via Tailwind v4 `@variant dark` or `class` strategy
- **Responsive** — mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)

### Routing
- **React Router v7** — routes defined in `App.tsx`
- **Layout nesting** — public routes under `MainLayout`, protected under `DashboardLayout`
- **404** — catch-all route rendering `NotFoundPage` (standalone, no layout)

### SEO
- **`usePageMeta` hook** — sets `<title>`, OG tags, Twitter Cards per page
- **JSON-LD** — structured data in `index.html` for SoftwareApplication + Organization
- **robots.txt + sitemap.xml** — in `public/`, block private routes

### i18n
- UI text in **Spanish** (primary) and **English** (secondary). **Every component must use `useI18nStore`** — no hardcoded text allowed.
- **`useI18nStore`** — `t.key.subkey` access pattern (e.g., `t.common.loading`)
- **Locale files** — `es.ts`, `en.ts`, `types.ts` (interface `Translation`)

### Performance
- **Lazy loading** for auth-guarded pages
- **`content-visibility: auto`** on scrollable containers with many children (e.g., kanban columns)
- **Arrays/objects as module constants** — extract static config arrays (e.g., `KANBAN_COLUMNS_CONFIG`, `STATS_CONFIG`) outside components to avoid re-creation

## Relevant Skills

When working on frontend tasks, load the appropriate skill from `.agents/skills/`:

| Skill | When to use |
|---|---|
| `vercel-react-best-practices` | Optimize renders, bundle size, data fetching, avoid waterfalls |
| `composition-patterns` / `vercel-composition-patterns` | Refactor components with boolean prop proliferation, compound components |
| `react-hook-form` | Build forms with `useForm`, `useWatch`, validation |
| `tailwind-css-patterns` | Style components with Tailwind v4, responsive design, dark mode |
| `vite` | Configure `vite.config.ts`, plugins, build, dev server proxy |
| `frontend-design` | Visual design of components and pages |
| `typescript-advanced-types` | Complex generics, conditional/mapped types |
| `accessibility` | WCAG audit and improvement |
| `seo` | Meta tags, structured data, sitemaps |
| `i18n-localization` | Translations, locale formatting, multi-language support |
