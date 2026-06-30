# KanbanCareer — AGENTS

## ⚠️ Mandatory Workflow

**Before performing any task, you MUST load the corresponding skill first.**

1. Check the tables below to identify which skill matches the task.
2. If the skill is in your `available_skills`, use the `skill` tool to load it.
3. If the skill is NOT in `available_skills`, read it directly from `.agents/skills/<name>/SKILL.md`.
4. If multiple skills are relevant, load all applicable skills before starting the task.
5. Only then proceed with the task.
6. **Do NOT stage, commit, or push** unless the user explicitly asks you to.

Violating this rule will result in incorrect behavior. This instruction is non-negotiable.

> **At the end of each interaction, you MUST list which skills were loaded (or read directly) during the session.**

## Structure

Monorepo with two independent packages — no root `package.json`.

```
backend/   Express 5 + Prisma + PostgreSQL   (ESM)
frontend/  Vite 8 + React 19 + TypeScript 6  (ESM)
```

## Commands

Run all commands from the respective subdirectory (`backend/` or `frontend/`).

| Context | Command | Notes |
|---|---|---|
| root | `docker compose up -d` | Start PostgreSQL + backend |
| root | `docker compose up -d --build` | Rebuild and start (after dep changes) |
| root | `docker compose down -v` | Stop and remove volumes |
| backend | `npm run dev` | Dev server (nodemon), port **3000** (without Docker) |
| backend | `npx prisma migrate dev` | Create and apply migrations (needs Docker db running) |
| backend | `npx prisma generate` | After editing schema |
| backend | `npx prisma studio` | Prisma GUI (needs Docker db running) |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Runs `tsc -b` (typecheck) then `vite build` |
| frontend | `npm run lint` | ESLint flat config |

## Backend

> **⚠️ Before any backend task, you MUST read [`backend/AGENTS.md`](./backend/AGENTS.md) for folder structure, architecture pattern, coding conventions, and examples.**

- ESM (`import` / `export`). `"type": "module"` is set in `package.json`.
- Express **5**, JSON body parser on `app`, health-check at `GET /health`.
- Prisma **6.6**, driver: `pg` (PostgreSQL). Schema file goes in `backend/prisma/schema.prisma`.
- `bcrypt` available for password hashing.

## Frontend

> **⚠️ Before any frontend task, you MUST read [`frontend/AGENTS.md`](./frontend/AGENTS.md) — folder structure, architecture pattern, coding conventions, and examples.**

- ESM (`type: "module"` in `package.json`).
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters` both `true`.
- `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- **React Compiler** enabled via Babel plugin — follow React Compiler rules (no `useMemo`/`useCallback` where auto-memoization suffices).
- **Tailwind v4** — use `@import "tailwindcss"` in CSS, **not** the v3 `@tailwind` directives. No `tailwind.config.*` file.
- **React Router v7** (`react-router-dom`). Routes defined in `App.tsx`.
- **Zustand v5** for state management, **React Hook Form v7** for forms.
- UI text in **Spanish** (primary) and **English** (secondary). **Every component must use `useI18nStore`** — no hardcoded text allowed.

## Skills (`.agents/skills/`)

Skills are auto-discovered by OpenCode when working inside this repo. The agent loads the relevant one on demand.

### General

| Skill | When to use | Location |
|---|---|---|
| `docker-expert` | Docker, Docker Compose, containerization, multi-stage builds | [`SKILL.md`](.agents/skills/docker-expert/SKILL.md) |
| `git-commit` | Git commits with Conventional Commits, staging, commit messages | [`SKILL.md`](.agents/skills/git-commit/SKILL.md) |
| `create-readme` | Generate README.md for the project | [`SKILL.md`](.agents/skills/create-readme/SKILL.md) |
| `boost-prompt` | Interactive prompt refinement: interrogate scope, deliverables, constraints; copies final markdown to clipboard | [`SKILL.md`](.agents/skills/boost-prompt/SKILL.md) |

### For the REST API (backend)

| Skill | When to use | Location |
|---|---|---|
| `nodejs-express-server` | Create routes, middleware, JWT auth, Express server config | [`SKILL.md`](.agents/skills/nodejs-express-server/SKILL.md) |
| `nodejs-backend-patterns` | Layered architecture (controllers/services/repositories), custom errors, DI | [`SKILL.md`](.agents/skills/nodejs-backend-patterns/SKILL.md) |
| `nodejs-best-practices` | Architecture decisions (framework, async, security, validation) | [`SKILL.md`](.agents/skills/nodejs-best-practices/SKILL.md) |
| `prisma-database-setup` | Configure PostgreSQL connection, driver adapters, generate Prisma Client | [`SKILL.md`](.agents/skills/prisma-database-setup/SKILL.md) |
| `prisma-cli` | Run Prisma commands: `init`, `migrate`, `generate`, `studio`, `db push/pull` | [`SKILL.md`](.agents/skills/prisma-cli/SKILL.md) |
| `prisma-client-api` | Write CRUD queries with Prisma Client, filters, transactions, relations | [`SKILL.md`](.agents/skills/prisma-client-api/SKILL.md) |
| `prisma-postgres` | Provision Prisma Postgres (cloud) database | [`SKILL.md`](.agents/skills/prisma-postgres/SKILL.md) |
| `openapi-spec-generation` | Generate and maintain OpenAPI 3.1 specifications, API docs, SDK generation, contract validation | [`SKILL.md`](.agents/skills/openapi-spec-generation/SKILL.md) |

### For the frontend

| Skill | When to use | Location |
|---|---|---|
| `react-best-practices` | Optimize renders, bundle size, data fetching, avoid waterfalls | [`SKILL.md`](.agents/skills/react-best-practices/SKILL.md) |
| `vercel-react-best-practices` | React and Next.js performance optimization guidelines from Vercel Engineering | [`SKILL.md`](.agents/skills/react-best-practices/SKILL.md) |
| `react-hook-form` | Build forms with React Hook Form (`useForm`, `useWatch`, validation) | [`SKILL.md`](.agents/skills/react-hook-form/SKILL.md) |
| `tailwind-css-patterns` | Style components with Tailwind v4, responsive design, dark mode | [`SKILL.md`](.agents/skills/tailwind-css-patterns/SKILL.md) |
| `vite` | Configure `vite.config.ts`, plugins, build, dev server proxy | [`SKILL.md`](.agents/skills/vite/SKILL.md) |
| `composition-patterns` | Compound components, avoid boolean props, composition patterns | [`SKILL.md`](.agents/skills/composition-patterns/SKILL.md) |
| `vercel-composition-patterns` | React composition patterns that scale, compound components, render props | [`SKILL.md`](.agents/skills/composition-patterns/SKILL.md) |
| `frontend-design` | Visual design of components and pages with distinctive identity | [`SKILL.md`](.agents/skills/frontend-design/SKILL.md) |
| `typescript-advanced-types` | Advanced types (generics, conditional, mapped types) | [`SKILL.md`](.agents/skills/typescript-advanced-types/SKILL.md) |
| `accessibility` | WCAG accessibility audit and improvement | [`SKILL.md`](.agents/skills/accessibility/SKILL.md) |
| `seo` | Meta tags, structured data, sitemaps, search optimization | [`SKILL.md`](.agents/skills/seo/SKILL.md) |
| `i18n-localization` | Internationalization (i18n), translations, locale formatting, multi-language support | [`SKILL.md`](.agents/skills/i18n-localization/SKILL.md) |
