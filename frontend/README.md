# KanbanCareer — Frontend

> React 19 SPA for KanbanCareer — job search CRM with Kanban board, metrics, and company management.

## Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI library |
| **TypeScript** | ~6.0 | Type safety (strict mode) |
| **Vite** | 8 | Build tool & dev server |
| **Tailwind CSS** | 4 | Utility-first styling |
| **React Router** | 7 | Client-side routing |
| **Zustand** | 5 | State management |
| **React Hook Form** | 7 | Form handling |
| **Axios** | 1 | HTTP client |
| **react-helmet-async** | 3 | SEO meta tags |
| **React Compiler** | — | Auto-memoization (Babel plugin) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 5173, proxies `/api` to `:3000`) |
| `npm run build` | `tsc -b` (typecheck) → `vite build` (production) |
| `npm run lint` | ESLint flat config |
| `npm run preview` | Preview production build |

## Folder Structure

```
src/
├── App.tsx              # Routes definition (React Router v7)
├── main.tsx             # Entry point (BrowserRouter + HelmetProvider)
├── assets/              # Static assets (images, icons)
├── components/          # Shared presentational components
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom hooks (usePageMeta)
├── interfaces/          # TypeScript interfaces (api, application, auth, layout)
├── layouts/             # Layout components (MainLayout, DashboardLayout)
├── locales/             # i18n translations (es, en) + types
├── pages/               # Route page components (LandingPage, LoginPage, etc.)
├── services/            # API client (Axios instance with interceptors)
└── stores/              # Zustand stores (applicationsStore, i18nStore)
```

## Conventions

- **ESM** (`type: "module"` in `package.json`)
- **TypeScript strict** — `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type`)
- **React Compiler** — no `useMemo`/`useCallback` where auto-memoization suffices
- **Tailwind v4** — `@import "tailwindcss"` in CSS, no `tailwind.config.*`
- **UI text in Spanish**, i18n via Zustand store (`useI18nStore`)
- **SEO** — `usePageMeta` hook for per-page `<title>`, OG, Twitter Cards

> For detailed design system, see [`DESIGN.md`](./DESIGN.md).  
> For agent instructions, see [`AGENTS.md`](./AGENTS.md).  
> For root-level info (Docker, API), see [`../README.md`](../README.md).
