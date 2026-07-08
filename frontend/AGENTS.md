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
| **React Hook Form** | 7 | Forms with `useForm`, `useWatch`, `Controller`, validation |
| **Zod** | 3 | Schema validation (`@hookform/resolvers` for RHF integration) |
| **Axios** | 1 | HTTP client with interceptors |
| **react-helmet-async** | 3 | SEO meta tags management |
| **React Compiler** | — | Auto-memoization; do NOT use `useMemo`/`useCallback` where compiler suffices |

## Folder Structure

```
src/
├── App.tsx                 # Route definitions (React Router v7)
├── main.tsx                # Entry — wraps App in StrictMode + HelmetProvider + BrowserRouter
├── index.css               # Global styles + Tailwind v4 import
├── App.css                 # App-specific styles
├── assets/                 # Static assets
├── components/             # Each component in its own subfolder
│   ├── index.ts            # Barrel — re-exports all components
│   ├── Footer/             # Named export (default)
│   ├── Header/
│   ├── HeroSection/
│   ├── InputForm/          # Generic typed form input with Controller (named export)
│   ├── KanbanCard/
│   ├── KanbanColumn/
│   ├── LanguageSelector/
│   ├── LoadingSkeleton/
│   ├── PricingCard/
│   ├── PricingSection/
│   ├── PageMeta/           # Per-page SEO via <Helmet> (component, not hook)
│   ├── ProtectedRoute/
│   └── StatCard/
├── contexts/               # React contexts — each in subfolder
│   ├── index.ts            # Barrel
│   └── AuthContext/        # Auth provider (access + refresh token)
├── interfaces/             # TypeScript types/interfaces — each in subfolder
│   ├── index.ts            # Barrel
│   ├── api/
│   ├── application/
│   ├── auth/
│   ├── company/
│   └── layout/
├── layouts/                # Layout components — each in subfolder
│   ├── index.ts            # Barrel
│   ├── MainLayout/         # Public pages (landing, login, register)
│   └── DashboardLayout/    # Protected pages (dashboard, kanban)
├── locales/                # i18n translations — each in subfolder
│   ├── index.ts            # Barrel
│   ├── types/              # Translation interface (tipado explícito por sección)
│   ├── es/                 # Spanish translations
│   └── en/                 # English translations
├── models/                 # Zod schemas — each in subfolder
│   ├── index.ts            # Barrel
│   ├── loginSchema/
│   └── registerSchema/
├── pages/                  # Route page components — each in subfolder
│   ├── index.ts            # Barrel
│   ├── DashboardPage/      # Lazy loaded
│   ├── KanbanPage/         # Lazy loaded
│   ├── LandingPage/
│   ├── LoginPage/
│   ├── NotFoundPage/       # 404 (standalone, no layout)
│   └── RegisterPage/
├── repositories/           # HTTP data access layer — each in subfolder
│   ├── index.ts            # Barrel
│   ├── ApplicationRepository/
│   └── CompanyRepository/
├── services/               # Business logic + Axios config — each in subfolder
│   ├── index.ts            # Barrel
│   ├── api/                # Axios instance with JWT interceptors
│   ├── ApplicationService/
│   └── CompanyService/
└── stores/                 # Zustand stores — each in subfolder
    ├── index.ts            # Barrel
    ├── applicationsStore/
    ├── companiesStore/
    └── i18nStore/
```

## Architecture Pattern

- **Component-per-subfolder** — each `.tsx` or `.ts` module lives in its own subfolder (e.g., `LoginPage/LoginPage.tsx`), with a barrel `index.ts` at the category level that re-exports every module.
- **Barrel system** — every category (`components/`, `pages/`, `services/`, etc.) has an `index.ts` that re-exports all entities. Imports between sibling modules go through the barrel (e.g., `../../components`), never direct to the file.
- **Lazy loading** — pages behind auth (`DashboardPage`, `KanbanPage`) use `React.lazy()` with a **full internal path** (not the barrel) in `App.tsx`: `lazy(() => import('./pages/DashboardPage/DashboardPage'))`. Their barrel re-export exists but is used by siblings, not by App.
- **Composition over boolean props** — prefer compound components or slot props instead of boolean flags that change rendering.
- **Zustand for global state** — stores are flat, use `set()` directly, no slices.
- **Layered data access** — Pages/Stores → Services (business logic) → Repositories (HTTP) → `api.ts` (Axios instance with JWT interceptors).
- **Repositories** — static classes with methods per entity (e.g., `ApplicationRepository.findAll()`). Handle only HTTP calls, no business logic.
- **Services** — static classes that orchestrate repositories and apply business logic (e.g., `ApplicationService.getKanbanApplications()`). Pages and stores call services, never repositories directly.
- **i18n via Zustand** — `useI18nStore` holds locale and translations; `t.key.subkey` access pattern.
- **Forms with Zod** — all forms use `react-hook-form` with `zodResolver` and a pre-defined Zod schema. Inline validation via `register()` with raw `<input>` is deprecated in favor of the generic `<InputForm>` component. Types are inferred with `z.infer<typeof schema>`.
- **Generic InputForm** — `<InputForm<T extends FieldValues>>` accepts `name: Path<T>`, `control: Control<T>`, optional `onFocus`/`onBlur` callbacks. Validation errors come from Zod via `errors.fieldName`.

## Conventions

### Naming
- **Files**: `<PascalCase>.tsx` for components, `<PascalCase>.ts` for services/repositories/models, `camelCase.ts` for utilities/stores.
- **Folders**: `<PascalCase>` matching the module name (e.g., `LoginPage/LoginPage.tsx`).
- **Exports**: named exports for shared components (e.g., `InputForm`, `PageMeta`, `ProtectedRoute`), default exports for pages, named classes for services/repositories.
- **Interfaces**: `interface`, not `type`, for object shapes; `I` prefix not used.
- **Barrels**: each category has `index.ts` that re-exports every entity (value + type separately with `export type` for type-only).

### Code Style
- **ESM only** — `import`/`export`, no `require`.
- **`import type`** required for type-only imports (enforced by `verbatimModuleSyntax`).
- **No unused locals/params** — both flags are `true` in tsconfig.
- **React Compiler** — trust the compiler for memoization; only use `useMemo`/`useCallback` when the compiler cannot handle the pattern.
- **No `any`** — prefer `unknown` with type guards.
- **Minimal comments** — code should be self-documenting.

### Styling
- **Tailwind v4 utilities only** — no custom CSS classes unless unavoidable.
- **Design tokens** defined in `DESIGN.md` (palette, typography, spacing, rounded, elevation).
- **Dark mode** via Tailwind v4 `@variant dark` or `class` strategy.
- **Responsive** — mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).

### Routing
- **React Router v7** — routes defined in `App.tsx`.
- **Layout nesting** — public routes under `MainLayout`, protected under `DashboardLayout`.
- **404** — catch-all route rendering `NotFoundPage` (standalone, no layout).
- **Lazy imports** use full internal path, not barrel: `lazy(() => import('./pages/DashboardPage/DashboardPage'))`.

### SEO
- **`<PageMeta>` component** — sets `<title>`, OG tags, Twitter Cards per page. Import via `{ PageMeta }` from `../../components`. Use as JSX: `<PageMeta title="..." description="..." />`.
- **JSON-LD** — structured data in `index.html` for SoftwareApplication + Organization.
- **robots.txt + sitemap.xml** — in `public/`, block private routes.

### i18n
- UI text in **Spanish** (primary) and **English** (secondary). **Every component must use `useI18nStore`** — no hardcoded text allowed.
- **`useI18nStore`** — `t.key.subkey` access pattern (e.g., `t.common.loading`).
- **Locale files** — `es.ts`, `en.ts`, `types.ts` (interface `Translation` with explicit typed objects per section, not `Record<string, string>`).

### Forms
- **Every form** must use a Zod schema + `zodResolver` + `<InputForm>` for inputs.
- **Schema files** go in `src/models/<name>Schema/<name>Schema.ts` — exported from `src/models/index.ts`.
- **Types** are inferred with `z.infer<typeof schema>` — do NOT duplicate types in `interfaces/`.
- **Custom onFocus/onBlur** for dropdown panels: pass via `<InputForm onFocus={...} onBlur={...}>`.

### Performance
- **Lazy loading** for auth-guarded pages.
- **`content-visibility: auto`** on scrollable containers with many children (e.g., kanban columns).
- **Arrays/objects as module constants** — extract static config arrays outside components to avoid re-creation.

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