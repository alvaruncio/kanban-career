# Tasks: Pino Logger + Vitest TDD

## Mandatory Rules

### TDD Mode — STRICT
- Every task follows: **RED** (write test that fails) → **GREEN** (implement to pass) → **REFACTOR** (clean up).
- Tests are written BEFORE implementation code. No exceptions.
- After each GREEN, run `npx vitest run` to confirm all tests pass before proceeding.

### Skills Requirement
- Before implementing ANY task, load the matching skill from `.agents/skills/<name>/SKILL.md` as defined in `AGENTS.md`.
- Backend tasks: load `nodejs-express-server`, `nodejs-backend-patterns` as applicable.
- Testing tasks: load `vitest` skill (read `.agents/skills/vitest/SKILL.md` + references).
- See `AGENTS.md` for the full skill table.

### Build & Test Gate
- After each phase, run `npx vitest run` to ensure no regressions.
- If any test fails, stop and fix before proceeding.

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr (exception-ok) |

---

## Phase 1: Infrastructure & Logger Module

- [x] **1.1** **Vitest setup** (`vitest.config.ts`, `src/__tests__/setup.js`, `package.json`, `.gitignore`): Config Vitest with globals, node env, setupFiles, coverage v8. Add global `vi.mock('pino')` and `vi.mock('pino-http')`. Add npm scripts (`test`, `test:run`, `test:coverage`). Add `logs/` and `.vitest/` to `.gitignore`. Install deps.
- [x] **1.2** **Logger module** (`src/shared/logger/logger.js` + `logger.test.js`): Write test first, then implement Pino instance with dual transport (file + pretty in dev, JSON stdout in prod). Level configurable via `PINO_LOG_LEVEL`.
- [x] **1.3** **HTTP Logger** (`src/shared/logger/http-logger.js` + `http-logger.test.js`): Write test first, then implement pino-http middleware wrapper with custom log levels (error for 500+, warn for 400+, info otherwise).

## Phase 2: Wiring

- [x] **2.1** **Barrel + Config** (`src/shared/logger/index.js`, `src/shared/index.js`, `src/shared/config/config.js`): Add `logLevel` to config, create logger barrel, export from shared barrel.
- [x] **2.2** **Wire app.js** (`src/app.js`): Add `httpLogger` as first middleware (before cors). Migrate error handler from `console.error(err.stack)` to `req.log?.error({ err }, err.message)`.
- [x] **2.3** **Wire server.js** (`server.js`): Replace `console.log` with `logger.info` in startup (3 locations: startup, SIGTERM, SIGINT).

## Phase 3: Auth Logging (TDD)

- [x] **3.1** **Auth Controller logging** (`src/controllers/auth/auth.controller.js` + `auth.controller.test.js`): Write test first, then add `logger.info()` on register start/complete and login attempt events.
- [x] **3.2** **Auth Service logging** (`src/services/auth/auth.service.js` + `auth.service.test.js`): Write test first, then add `logger.info()` on token refresh attempt/success and password change (per spec §4.2). Login attempt logging lives in the controller per spec §4.1. Never log passwords or tokens.

## Phase 4: Final Verification

- [x] **4.1** Run `npx vitest run` — all tests pass.
- [x] **4.2** Run `npm run test:coverage` — coverage report generated.
- [x] **4.3** Start server with `npm run dev`, hit `GET /health` — confirm logs appear in terminal and `logs/app.log`.
