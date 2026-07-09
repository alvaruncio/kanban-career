# KanbanCareer Backend — AGENTS

## Technologies

| Technology | Version | Purpose |
|---|---|---|
| **Express** | 5 | HTTP server, routing, middleware |
| **Prisma** | 6.6 | ORM, migrations, type-safe DB access |
| **PostgreSQL** | — | Relational database (via `pg`) |
| **bcrypt** | 5 | Password hashing |
| **cookie-parser** | — | Parse `Cookie` header into `req.cookies` (JSON object) |
| **jsonwebtoken** | — | Sign & verify JWT tokens |
| **Zod** | 4.4 | Schema validation (runtime + TypeScript types) |
| **Node.js** | 18+ | Runtime with native `--watch` flag |
| **ESM** | — | `"type": "module" in `package.json`; use `import`/`export` only |

## Folder Structure

```
backend/
├── server.js              # Entry point — loads env, starts server
├── prisma/
│   └── schema.prisma      # Database schema
└── src/
    ├── app.js             # Express app setup (middleware, routes, error handler)
    ├── controllers/       # HTTP layer — organized by feature
    │   ├── index.js       # Barrel — re-exports all controllers
    │   ├── auth/auth.controller.js
    │   ├── user/user.controller.js
    │   ├── application/application.controller.js
    │   └── company/company.controller.js
    ├── services/          # Business logic & use-case orchestration — organized by feature
    │   ├── index.js       # Barrel — re-exports all services
    │   ├── auth/auth.service.js
    │   ├── user/user.service.js
    │   ├── application/application.service.js
    │   └── company/company.service.js
    ├── repositories/      # Pure data access (Prisma CRUD) — organized by feature
    │   ├── index.js       # Barrel — re-exports all repositories
    │   ├── auth/auth.repository.js
    │   ├── user/user.repository.js
    │   ├── application/application.repository.js
    │   └── company/company.repository.js
    ├── routes/            # Route definitions — organized by feature
    │   ├── index.js       # Imports all routers and mounts under /api/v1
    │   ├── auth/auth.routes.js
    │   ├── user/user.routes.js
    │   ├── application/application.routes.js
    │   └── company/company.routes.js
    ├── middlewares/       # Access control & request flow — organized by feature
    │   ├── index.js       # Barrel — re-exports all middlewares
    │   └── auth/auth.middleware.js
    ├── validators/        # Input data validation — organized by feature
    │   ├── index.js       # Barrel — re-exports all validators
    │   └── user/user.validator.js
    ├── schemas/           # Zod schemas — organized by feature
    │   ├── index.js       # Barrel — re-exports all schemas
    │   └── user/user.schema.js
    └── shared/            # Shared utilities, configs, constants, DTOs
        ├── index.js       # Barrel — re-exports all shared modules
        ├── config/config.js
        ├── constants/constants.js
        ├── prisma/prisma.js
        └── regex/regex.js

docs/
├── openapi.yaml           # OpenAPI 3.1 specification
├── auth-strategy.md       # Dual token auth (access + refresh) specification
├── service-pattern.md     # Service class example
├── controller-pattern.md  # Controller class example
└── route-pattern.md       # Route definition example
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **routes/index.js** | Barrel — imports all feature routers and mounts them under `/api/v1` |
| **\<layer\>/index.js** | Barrel — re-exports all modules from that layer's feature subfolders. Cross-layer imports always go through the barrel, never directly to a feature file. |
| **routes/\<feature\>/\<feature\>.routes.js** | Define HTTP method + path, attach validators + middlewares, call controller methods |
| **controllers/\<feature\>/\<feature\>.controller.js** | Extract/validate input from `req`, call service methods, send `res` |
| **services/\<feature\>/\<feature\>.service.js** | Business logic and use-case orchestration. Coordinates repositories, external services, cache, and third-party APIs. Contains application rules. **Never accesses Prisma directly.** |
| **repositories/\<feature\>/\<feature\>.repository.js** | Pure data access layer. Contains only database queries and persistence operations via Prisma. **No business rules, validations, permissions, or transformations.** |
| **middlewares/\<feature\>/\<feature\>.middleware.js** | Access control & request flow: authentication, authorization, guards, rate limiting, logging |
| **validators/\<feature\>/\<feature\>.validator.js** | Input data validation with **Zod schemas**: type checks, format, constraints on `req.body` / `req.query` / `req.params`. Export a Zod schema + a middleware that runs `schema.safeParse()` and returns 400 on failure. |
| **shared/** | Shared utilities, configs, constants. Each module in its own subfolder (`config/`, `constants/`, `prisma/`, `regex/`). |

### Dependency Flow

Allowed dependency direction:

```
Controllers → Services
Services    → Repositories, Cache, External APIs
Repositories → Prisma
```

**Prohibited:**
- `Controllers → Prisma` ❌
- `Controllers → Repositories` ❌
- `Services → Prisma` ❌
- `Repositories → Services` ❌
- `Repositories → Cache, External APIs` ❌

### validators vs middlewares — Decision Rule

| Layer | Responsibility | Examples |
|---|---|---|
| **validators/** | Validate input data with **Zod schemas** (body, query, params). No business logic or access control. Each validator exports a `z.object({...})` schema plus a middleware that calls `schema.safeParse(req.body)` — if `!result.success`, returns 400 with formatted errors; otherwise assigns `req.body = result.data`. | `user.validator.js`, `auth.validator.js` |
| **middlewares/** | Control access, permissions, and request flow. If its only purpose is to validate data, it belongs in validators. | `auth.middleware.js`, `requireAuth.middleware.js`, `requireAdmin.middleware.js` |

## Authentication Strategy — Dual Token (Access + Refresh)

Authentication strategy using access token (15 min, in-memory) and refresh token (30 days, HTTPOnly cookie). Details, full flow, middleware, and interceptor component at:

➡️ [`docs/auth-strategy.md`](docs/auth-strategy.md)

## Architecture Pattern

Use **classes with static methods** for controllers, services, and repositories. This avoids instantiation overhead and keeps the API stateless.

Each layer is organized **by feature** inside a subdirectory. Examples:

```
src/repositories/auth/auth.repository.js
src/services/auth/auth.service.js
src/controllers/auth/auth.controller.js
src/routes/auth/auth.routes.js
src/middlewares/auth/auth.middleware.js
src/validators/auth/auth.validator.js
```

See concrete examples in:

| Pattern | File |
|---|---|
| **Repository** | [`docs/repository-pattern.md`](docs/repository-pattern.md) |
| **Service** | [`docs/service-pattern.md`](docs/service-pattern.md) |
| **Controller** | [`docs/controller-pattern.md`](docs/controller-pattern.md) |
| **Route** | [`docs/route-pattern.md`](docs/route-pattern.md) |

## Conventions

- **ESM only** — `import` / `export`. No `require` or `module.exports`.
- **Barrel system** — Every layer (`controllers/`, `services/`, `repositories/`, `middlewares/`, `validators/`, `schemas/`, `shared/`) has an `index.js` that re-exports all modules from its feature subfolders. Cross-layer imports always go through the barrel (e.g., `'../../controllers/index.js'`), never directly to a feature file.
- **Static classes** — Services, controllers, and repositories use `static` methods only. Validators export a Zod schema + a middleware function.
- **Zod validation** — All input validation uses Zod schemas. Each validator file exports a `schema` (z.object) and a middleware that runs `schema.safeParse()` on `req.body` / `req.query` / `req.params`. If `!result.success`, return a 400 response with the formatted errors. On success, the parsed (and transformed) result replaces the original input (`req.body = result.data`).
- **Feature-based folders** — Each layer groups files by feature (e.g. `auth/`, `user/`).
- **Naming convention** — Files use `<feature>.<layer>.js` pattern: `user.service.js`, `user.controller.js`, `user.repository.js`, `user.routes.js`, `user.middleware.js`, `user.validator.js`. Classes use `<Feature><Layer>` pattern: `UserRepository`, `AuthService`, `AuthController`.
- **Routes index** — `routes/index.js` is the barrel/entry point that imports and mounts all feature routers under `/api/v1`.
- **Validation in routes** — Validators are attached in the route definition before the controller. The validator middleware calls `schema.safeParse(req.body)` — on success, `req.body` is replaced with `result.data` (parsed and transformed); on failure (`!result.success`), returns a 400 response with the formatted validation errors.
- **Repositories own the DB** — Controllers and services never call Prisma directly. Services call repositories.
- **Service method destructuring** — Service methods that receive full `req.body` must destructure only the fields they need (e.g., `register({ name, email, password })`) to ignore irrelevant fields like `confirmPassword`.
- **Error handling** — Use the centralized error middleware in `app.js`; throw custom errors from services when needed.

## Relevant Skills

When working on the backend, load the appropriate skill from the root `.agents/skills/`:

| Skill | When to use |
|---|---|
| `nodejs-express-server` | Create routes, middleware, JWT auth, Express config |
| `nodejs-backend-patterns` | Layered architecture, custom errors, DI |
| `nodejs-best-practices` | Architecture decisions, async, security, validation |
| `prisma-client-api` | Write CRUD queries, filters, transactions |
| `prisma-cli` | Run migrations, generate client, studio |
| `openapi-spec-generation` | Maintain OpenAPI spec |