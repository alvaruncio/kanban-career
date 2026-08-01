# Design: Pino Logger + Vitest TDD

## Technical Approach

Drop-in Pino structured logging into the existing Express 5 app and establish Vitest as the testing foundation. Logger is a static shared module (no class — Pino instances are already configurable). Tests are co-located `.test.js` files with global `vi.mock('pino')` / `vi.mock('pino-http')` to prevent worker threads during test runs. All changes follow the existing static-classes + barrel pattern.

## Architecture Decisions

| Decision | Options | Rationale |
|----------|---------|-----------|
| **Logger module shape** | Static instance vs class | Pino instances accept runtime config. No class needed — `export const logger = pino({...})` directly. Follows static pattern precedent. |
| **Test mock strategy** | Global `vi.mock` vs per-test mocking | `pino.transport()` spawns worker threads. Global mock blocks this at module scope before any import. Cleaner than per-test `vi.doMock`. |
| **Dual transport only in dev** | `NODE_ENV !== 'production'` check | File sink + pino-pretty are dev-only; prod gets pure JSON stdout. pino-pretty as devDependency, excluded in Docker via `npm prune --omit=dev`. |
| **Co-located test files** | `.test.js` next to source | Matches Vitest's default include pattern. No separate `__tests__/` mirror dirs. Only `setup.js` lives in `src/__tests__/`. |

## Data Flow

```
HTTP Request
  │
  ▼
httpLogger (first middleware) ──→ sets req.log
  │
  ▼
cors → express.json → routes → auth.controller
  │                                     │
  │                               logger.info({ event: 'register_attempt', email })
  │                                     │
  ▼                                     ▼
auth.service ──→ logger.info({ event: 'login_success', userId })
  │
  ▼
response ──→ httpLogger logs method, url, status, duration
  │
  ▼
error handler ──→ req.log.error({ err }, err.message)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/shared/logger/logger.js` | Create | Pino instance with configurable transport: dev = file + pretty stdout, prod = JSON stdout |
| `src/shared/logger/http-logger.js` | Create | pino-http wrapper with custom levels: error on 5xx, warn on 4xx, info otherwise |
| `src/shared/logger/index.js` | Create | Barrel: `export { logger } from './logger.js'; export { httpLogger } from './http-logger.js'` |
| `src/shared/logger/logger.test.js` | Create | Unit tests for logger instance, level, transport behavior |
| `src/shared/logger/http-logger.test.js` | Create | Unit tests for pino-http level mapping, message overrides |
| `src/controllers/auth/auth.controller.test.js` | Create | Integration tests registering mock to check log calls |
| `src/services/auth/auth.service.test.js` | Create | Unit tests for structured logging on login/refresh/updatePassword |
| `vitest.config.ts` | Create | Vitest config: globals, node env, setupFiles, coverage v8 |
| `src/__tests__/setup.js` | Create | Global `vi.mock('pino')` + `vi.mock('pino-http')` |
| `src/shared/config/config.js` | Modify | Add `logLevel: process.env.PINO_LOG_LEVEL \|\| 'info'` |
| `src/shared/index.js` | Modify | Export `logger` and `httpLogger` from `'./logger/index.js'` |
| `src/app.js` | Modify | `httpLogger` as first middleware; error handler uses `req.log.error` |
| `server.js` | Modify | `console.log` → `logger.info` |
| `src/controllers/auth/auth.controller.js` | Modify | Add `logger.info({ event, email })` on register, login actions |
| `src/services/auth/auth.service.js` | Modify | Add `logger.info({ event, userId })` on login_success, login_failed, token_refresh, password_change |
| `package.json` | Modify | Add pino/pino-http deps; pino-pretty, vitest, supertest devDeps; 3 test scripts |
| `.gitignore` | Modify | Add `logs/`, `.vitest/` |

## Interfaces / Contracts

```js
// src/shared/logger/logger.js
// Single static instance, no class
export const logger = pino({
  level: config.logLevel,
  transport: NODE_ENV === 'production'
    ? undefined  // pure JSON stdout
    : pino.transport({ targets: [...] }) // file + pretty stdout
})

// src/shared/logger/http-logger.js
import pinoHttp from 'pino-http'
export const httpLogger = pinoHttp({ logger, customLogLevel, customSuccessMessage })

// Log event convention for manual logging:
logger.info({ event: 'event_name', userId, email })  // NEVER log passwords or tokens
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `logger.js` creates instance, respects level env var | Mock-free, check `pino` constructor call |
| Unit | `http-logger.js` level mapping: 500→error, 400→warn, 200→info | Test pino-http options pass-through |
| Unit | `auth.service.js` logs login_success, login_failed, password_change | `vi.mock('../../shared/index.js')` -> verify `logger.info` called with event |
| Integration | `auth.controller.js` routes with supertest | Mock auth service responses, verify HTTP status and log calls |
| Config | `config.logLevel` reads `PINO_LOG_LEVEL` | Test default fallback and env overrides |

### Test File Coverage Intent

**logger.test.js**: mock `pino` factory, assert constructor called with level and transport config
**http-logger.test.js**: verify `customLogLevel` returns correct level per status code range; verify message overrides
**auth.service.test.js**: mock the shared barrel's `logger`; assert `logger.info` calls with correct `{ event, userId }` shape for login_success, login_failed, token_refresh, updatePassword
**auth.controller.test.js**: supertest against app with mocked AuthService; assert HTTP status codes AND that logger.info was called for register_attempt / login_attempt

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Logger is additive — existing `console.log` calls are replaced but the app was already functional without them. Docker compose requires no changes (pino-pretty is devDependency, excluded via `npm prune --omit=dev` in production builds).

## Technical Corrections from Tasks Review

### 1. `vi.mock` hoisting — use `vi.hoisted()`

The setup.js defines `mockLogger` as a top-level `const`, but `vi.mock` factories are **hoisted** by Vitest to execute before any `import` statements. A module-scope `const` is not accessible inside the factory.

**Fix:** Use `vi.hoisted()` to define values accessible inside `vi.mock`:

```js
// CORRECT — vi.hoisted runs at the same hoist level as vi.mock
const mockLogger = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(() => mockLogger),
}))

vi.mock('pino', () => {
  const pino = vi.fn(() => mockLogger)
  pino.transport = vi.fn(() => ({}))
  return pino
})
```

### 2. Logger level test — capture `opts.level` in mock

The mock returns `level: 'info'` hardcoded, so a test expecting `logger.level === 'debug'` after setting `PINO_LOG_LEVEL=debug` will always fail.

**Fix:** Make `mockLogger.level` mutable and capture the `opts.level` from the pino constructor call:

```js
let currentLevel = 'info'
const mockLogger = vi.hoisted(() => ({
  level: 'info',  // default, overridden by test
  ...
}))

vi.mock('pino', () => {
  const pino = vi.fn((opts) => {
    currentLevel = opts?.level || 'info'
    return { ...mockLogger, level: currentLevel }
  })
  ...
})
```

## Open Questions

None.
