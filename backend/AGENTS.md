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
    ├── controllers/       # HTTP layer — parse request, delegate to services, send response
    ├── services/          # Business logic — Prisma queries, data transformation
    ├── routes/            # Route definitions — wire endpoints to controllers + middleware
    ├── middlewares/       # Reusable middleware (auth, validation, error handling)
    ├── shared/            # Shared utilities, configs, constants, DTOs

docs/
├── openapi.yaml           # OpenAPI 3.1 specification
├── service-pattern.md     # Service class example
├── controller-pattern.md  # Controller class example
└── route-pattern.md       # Route definition example
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **routes/** | Define HTTP method + path, attach validation middleware, call controller methods |
| **controllers/** | Extract/validate input from `req`, call service methods, send `res` |
| **services/** | All database queries via Prisma, business logic, return transformed data |
| **middlewares/** | Cross-cutting concerns: auth guards, request validation, error formatting |
| **shared/** | Constants (e.g. `DEFAULTS`), configs, reusable types/schemas |

## Architecture Pattern

Use **classes with static methods** for both controllers and services. This avoids instantiation overhead and keeps the API stateless.

See concrete examples in:

| Pattern | File |
|---|---|
| **Service** | [`docs/service-pattern.md`](docs/service-pattern.md) |
| **Controller** | [`docs/controller-pattern.md`](docs/controller-pattern.md) |
| **Route** | [`docs/route-pattern.md`](docs/route-pattern.md) |

## Conventions

- **ESM only** — `import` / `export`. No `require` or `module.exports`.
- **Static classes** — Services and controllers use `static` methods only.
- **Validation in routes** — Middleware validates the request body before it reaches the controller.
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
