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
| **Node.js** | 18+ | Runtime with native `--watch` flag |
| **ESM** | — | `"type": "module"` in `package.json`; use `import`/`export` only |

## Folder Structure

```
backend/
├── server.js              # Entry point — loads env, starts server
├── prisma/
│   └── schema.prisma      # Database schema
    └── src/
    ├── app.js             # Express app setup (middleware, routes, error handler)
    ├── controllers/       # HTTP layer — organized by feature
    │   └── <feature>/
    │       └── <feature>.controller.js
    ├── services/          # Business logic & use-case orchestration — organized by feature
    │   └── <feature>/
    │       └── <feature>.service.js
    ├── repositories/      # Pure data access (Prisma CRUD) — organized by feature
    │   └── <feature>/
    │       └── <feature>.repository.js
    ├── routes/            # Route definitions — organized by feature
    │   ├── index.js       # Imports all routers and mounts under /api/v1
    │   └── <feature>/
    │       └── <feature>.routes.js
    ├── middlewares/       # Access control & request flow — organized by feature
    │   └── <feature>/
    │       └── <feature>.middleware.js
    ├── validators/        # Input data validation — organized by feature
    │   └── <feature>/
    │       └── <feature>.validator.js
    └── shared/            # Shared utilities, configs, constants, DTOs

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
| **routes/index.js** | Imports all feature routers and mounts them under `/api/v1` |
| **routes/\<feature\>/\<feature\>.routes.js** | Define HTTP method + path, attach validators + middlewares, call controller methods |
| **controllers/\<feature\>/\<feature\>.controller.js** | Extract/validate input from `req`, call service methods, send `res` |
| **services/\<feature\>/\<feature\>.service.js** | Business logic and use-case orchestration. Coordinates repositories, external services, cache, and third-party APIs. Contains application rules. **Never accesses Prisma directly.** |
| **repositories/\<feature\>/\<feature\>.repository.js** | Pure data access layer. Contains only database queries and persistence operations via Prisma. **No business rules, validations, permissions, or transformations.** |
| **middlewares/\<feature\>/\<feature\>.middleware.js** | Access control & request flow: authentication, authorization, guards, rate limiting, logging |
| **validators/\<feature\>/\<feature\>.validator.js** | Input data validation only: type checks, format, constraints on `req.body` / `req.query` / `req.params` |
| **shared/** | Constants (e.g. `DEFAULTS`), configs, reusable types/schemas |

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
| **validators/** | Validate input data type and format (body, query, params). No business logic or access control. | `user.validator.js`, `auth.validator.js` |
| **middlewares/** | Control access, permissions, and request flow. If its only purpose is to validate data, it belongs in validators. | `auth.middleware.js`, `requireAuth.middleware.js`, `requireAdmin.middleware.js` |

## Authentication Strategy — Dual Token (Access + Refresh)

Authentication strategy using access token (15 min, in-memory) and refresh token (30 days, HTTPOnly cookie). Details, full flow, middleware, and interceptor component at:

➡️ [`docs/auth-strategy.md`](docs/auth-strategy.md)

## Architecture Pattern

Use **classes with static methods** for both controllers and services. This avoids instantiation overhead and keeps the API stateless.

Each layer is organized **by feature** inside a subdirectory. Examples:

```
src/services/auth/auth.service.js
src/controllers/auth/auth.controller.js
src/routes/auth/auth.routes.js
src/middlewares/auth/auth.middleware.js
src/validators/auth/auth.validator.js
```

See concrete examples in:

| Pattern | File |
|---|---|
| **Service** | [`docs/service-pattern.md`](docs/service-pattern.md) |
| **Controller** | [`docs/controller-pattern.md`](docs/controller-pattern.md) |
| **Route** | [`docs/route-pattern.md`](docs/route-pattern.md) |

## Conventions

- **ESM only** — `import` / `export`. No `require` or `module.exports`.
- **Static classes** — Services, controllers, and repositories use `static` methods only. Validators export middleware functions.
- **Feature-based folders** — Each layer groups files by feature (e.g. `auth/`, `user/`).
- **Naming convention** — Files use `<feature>.<layer>.js` pattern: `user.service.js`, `user.controller.js`, `user.repository.js`, `user.routes.js`, `user.middleware.js`, `user.validator.js`. Classes use `<Feature><Layer>` pattern: `UserRepository`, `AuthService`, `AuthController`.
- **Routes index** — `routes/index.js` is the single entry point that imports and mounts all feature routers under `/api/v1`.
- **Validation in routes** — Validators are attached in the route definition before the controller.
- **Repositories own the DB** — Controllers and services never call Prisma directly. Services call repositories.
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
