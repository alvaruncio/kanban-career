# KanbanCareer Backend — AGENTS

## Technologies

| Technology | Version | Purpose |
|---|---|---|
| **Express** | 5 | HTTP server, routing, middleware |
| **Prisma** | 6.6 | ORM, migrations, type-safe DB access |
| **PostgreSQL** | — | Relational database (via `pg`) |
| **bcrypt** | 5 | Password hashing |
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
    ├── services/          # Business logic — organized by feature
    │   └── <feature>/
    │       └── <feature>.service.js
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
| **services/\<feature\>/\<feature\>.service.js** | All database queries via Prisma, business logic, return transformed data |
| **middlewares/\<feature\>/\<feature\>.middleware.js** | Access control & request flow: authentication, authorization, guards, rate limiting, logging |
| **validators/\<feature\>/\<feature\>.validator.js** | Input data validation only: type checks, format, constraints on `req.body` / `req.query` / `req.params` |
| **shared/** | Constants (e.g. `DEFAULTS`), configs, reusable types/schemas |

### validators vs middlewares — Regla de decisión

| Capa | Responsabilidad | Ejemplos |
|---|---|---|
| **validators/** | Validar tipo y formato de los datos de entrada (body, query, params). No contiene lógica de negocio ni control de acceso. | `user.validator.js`, `auth.validator.js` |
| **middlewares/** | Controlar acceso, permisos y flujo de la request. Si su única función es validar datos, debe ser un validator. | `auth.middleware.js`, `requireAuth.middleware.js`, `requireAdmin.middleware.js` |

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
- **Static classes** — Services and controllers use `static` methods only. Validators export middleware functions.
- **Feature-based folders** — Each layer groups files by feature (e.g. `auth/`, `user/`).
- **Naming convention** — Files use `<feature>.<layer>.js` pattern: `user.service.js`, `user.controller.js`, `user.routes.js`, `user.middleware.js`, `user.validator.js`.
- **Routes index** — `routes/index.js` is the single entry point that imports and mounts all feature routers under `/api/v1`.
- **Validation in routes** — Validators are attached in the route definition before the controller.
- **Services own the DB** — Controllers never call Prisma directly.
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
