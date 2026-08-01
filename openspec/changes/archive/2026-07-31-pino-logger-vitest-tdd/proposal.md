# Proposal: Pino Logger + Vitest TDD

## Intent

Replace raw `console.log`/`console.error` with Pino structured logging. Establish Vitest + Supertest as the testing foundation (zero tests today). Every debugging session currently starts from scratch with no observability.

## Scope

### In Scope

| Deliverable | Files |
|---|---|
| Pino logger (JSON file + pino-pretty console dual transport) | `src/shared/logger/` (new module) |
| HTTP logging via pino-http + auth flow manual logging | `app.js`, `server.js`, `auth.controller.js`, `auth.service.js` |
| Vitest config, scripts, global mocks, co-located test files | `vitest.config.ts`, `package.json`, `src/__tests__/setup.js` |
| PINO_LOG_LEVEL in config + barrel export + gitignore entries | `config.js`, `shared/index.js`, `.gitignore` |

### Out of Scope

- CRUD endpoint logging (covered by pino-http automatically)
- Playwright, frontend, seed.js migration, OpenAPI, Winston

## Capabilities

- **logging**: Pino structured logging — app-level + HTTP, log levels, dual transport
- **testing**: Vitest + Supertest — unit/integration, coverage, TDD workflow

No existing specs modified.

## Approach

1. `src/shared/logger/logger.js` — Pino with `pino.transport()` (file + pino-pretty chain); `http-logger.js` — pino-http bound to logger
2. Register `httpLogger` as first middleware in `app.js` (before cors, before json parser)
3. Migrate `console.error(err.stack)` → `logger.error(err)` in error handler
4. Migrate `console.log` → `logger.info` in server.js startup/shutdown
5. Add `logger.info({ event, userId, ... })` in auth controller/service (register, login, refresh, updatePassword)
6. `vitest.config.ts` — ESM, `globals: true`, `setupFiles`, `coverage.provider: 'v8'`
7. `src/__tests__/setup.js` — `vi.mock('pino')` and `vi.mock('pino-http')` so worker threads never fire in tests
8. Tests co-located as `.test.js` next to source files

## Affected Areas

| Area | Impact |
|---|---|
| `src/shared/logger/` | New (2 files + barrel) |
| `src/app.js`, `server.js` | Modified (migrate console → logger) |
| `src/controllers/auth/auth.controller.js`, `src/services/auth/auth.service.js` | Modified (manual logging) |
| `src/shared/config/config.js`, `src/shared/index.js` | Modified (config + barrel) |
| `vitest.config.ts`, `src/__tests__/setup.js` | New |
| `package.json`, `.gitignore` | Modified (deps, scripts, ignores) |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| pino.transport() worker threads fail in tests | Medium | Global mock before any import |
| Middleware ordering breaks req.log | Low | httpLogger first, before cors |
| Log dir missing in Docker | Low | Root .gitignore covers `logs*`; Docker binds data |

## Dependencies

- `pino` ^10, `pino-http` ^11 — runtime
- `pino-pretty` ^13 — devDependencies (excluded in Docker prod via `npm prune --omit=dev`)
- `vitest` ^4, `supertest` ^7 — devDependencies

## Success Criteria

- [ ] `npm run test` (watch), `npm run test:run` (single), `npm run test:coverage` all pass
- [ ] HTTP requests logged to `logs/http.log` with method, url, status, duration
- [ ] Auth events produce structured entries with `event` + `userId` fields
- [ ] pino-pretty absent from Docker production image
