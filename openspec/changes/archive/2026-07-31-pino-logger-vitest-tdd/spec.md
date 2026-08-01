# Spec: Pino Logger + Vitest TDD

## Overview

Replace raw `console.log`/`console.error` with Pino structured logging. Establish Vitest + Supertest as the testing foundation with strict TDD (tests first for every feature).

**Change ID:** `pino-logger-vitest-tdd`
**TDD mode:** Strict — all tests MUST be written before implementation code for each feature.
**Framework:** Vitest ^4 + Supertest ^7 (ESM, TypeScript config, `globals: true`)
**Artifact store:** openspec + engram (dual)

---

## 1. Logger Module — `src/shared/logger/`

### 1.1 File Structure

```
src/shared/logger/
  logger.js         # Pino instance with dual transport
  http-logger.js    # pino-http middleware bound to logger
  logger.test.js    # Unit tests for logger config and exports
  http-logger.test.js  # Unit tests for pino-http level mapping
```

Barrel export in `src/shared/index.js` must add `logger` and `httpLogger`.

### 1.2 `logger.js` — Pino Instance

#### Behavioural Spec

| Feature | Scenario | Given | When | Then |
|---------|----------|-------|------|------|
| `PINO_LOG_LEVEL` env var | Custom level set | `PINO_LOG_LEVEL=debug` | module is imported | `logger.level` equals `'debug'` |
| `PINO_LOG_LEVEL` env var | Default level | env var is not set | module is imported | `logger.level` equals `'info'` |
| Dual transport — JSON file | All levels | logger is instantiated | `logger.info('test')` is called | Transport target `pino/file` is configured with `destination: 'logs/app.log'` |
| Dual transport — pretty print | Pretty console (non-prod only) | `NODE_ENV !== 'production'` | logger is instantiated | `pino-pretty` is included in transport targets |
| Dual transport — pretty print suppressed in production | Production guard | `NODE_ENV === 'production'` | logger is instantiated | `pino-pretty` is NOT included in transport targets |

#### Technical Requirements

- Use `pino.transport()` with a `targets` array.
- Two targets in non-production: `pino/file` → `logs/app.log` (level: `'trace'`), `pino-pretty` → stdout (level: `'info'`).
- In production: ONLY the `pino/file` target. Guard with `process.env.NODE_ENV !== 'production'`.
- Read log level from `process.env.PINO_LOG_LEVEL` with fallback to `'info'`.
- Use `pino.destination({ dest: 'logs/app.log', sync: false })` as the file transport options.
- Import via `import pino from 'pino'`.

#### Implementation Skeleton

```js
import pino from 'pino'

const level = process.env.PINO_LOG_LEVEL ?? 'info'
const isProduction = process.env.NODE_ENV === 'production'

const targets = [
  {
    level: 'trace',
    target: 'pino/file',
    options: { destination: 'logs/app.log', sync: false },
  },
]

if (!isProduction) {
  targets.push({
    level: 'info',
    target: 'pino-pretty',
    options: { colorize: true },
  })
}

export const logger = pino(
  { level },
  pino.transport({ targets })
)
```

### 1.3 `http-logger.js` — pino-http Middleware

#### Behavioural Spec

| Feature | Scenario | Given | When | Then |
|---------|----------|-------|------|------|
| pino-http instantiation | Custom log levels | `logger` is available | `httpLogger` is created | `customLogLevel` maps: 500+ → `'error'`, 400+ → `'warn'`, else → `'info'` |
| pino-http instantiation | Logger attached | `logger` is provided | `httpLogger` is created | The `logger` option matches the exported `logger` instance |

#### Technical Requirements

- Import `pinoHttp` from `pino-http`.
- Wrap in an object with `logger` (the app logger) and `customLogLevel` function:

  ```js
  import pinoHttp from 'pino-http'
  import { logger } from './logger.js'

  export const httpLogger = pinoHttp({
    logger,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 500) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    },
  })
  ```

---

## 2. HTTP Logging — `app.js` Modifications

### 2.1 Middleware Ordering

**Critical rule:** `httpLogger` MUST be the **first** Express middleware registered, before `cors()` and before `express.json()`.

#### Behavioural Spec

| Feature | Scenario | Given | When | Then |
|---------|----------|-------|------|------|
| Middleware order | httpLogger is first | `app.js` imports | middleware stack is assembled | `httpLogger` is at position 0 (first registered) |
| Health endpoint | Automatic logging | A `GET /health` request arrives | `httpLogger` processes it | Response has status 200 and a log entry is emitted |
| Root endpoint | Automatic logging | A `GET /` request arrives | `httpLogger` processes it | Response has status 200 and a log entry is emitted |

#### Implementation Changes

```js
// BEFORE cors, BEFORE json parser — FIRST middleware
app.use(httpLogger)

app.use(cors({ ... }))
app.use(express.json())
```

### 2.2 Error Handler — Console Migration

#### Behavioural Spec

| Feature | Scenario | Given | When | Then |
|---------|----------|-------|------|------|
| Error handler logging | Error occurs | An error reaches the error middleware | `req.log.error()` is called | The error is logged via Pino, NOT via `console.error()` |
| Error handler fallback | No `req.log` context | `_req` has no log property (edge case) | Error handler runs | The handler does NOT crash — still returns 500 response |

#### Implementation Changes

Replace:

```js
app.use((err, _req, res, _next) => {
  console.error(err.stack)                        // REMOVE
  return res.status(err.status ?? 500).json({ ... })
})
```

With:

```js
app.use((err, req, res, _next) => {
  req.log?.error?.(err) ?? console.error(err.stack)
  return res.status(err.status ?? 500).json({ ... })
})
```

Note: `_req` → `req` (unused param becomes used); use optional chaining (`req.log?.error?.(err)`) with `console.error` fallback.

---

## 3. Server Logging — `server.js` Modifications

### Behavioural Spec

| Feature | Scenario | Given | When | Then |
|---------|----------|-------|------|------|
| Startup message | Server starts | `app.listen()` callback fires | Server is running | `logger.info()` is called with port number — NOT `console.log()` |
| SIGTERM shutdown | Termination signal | `SIGTERM` is received | Shutdown begins | `logger.info()` is called with signal name — NOT `console.log()` |
| SIGINT shutdown | Ctrl+C | `SIGINT` is received | Shutdown begins | `logger.info()` is called with signal name — NOT `console.log()` |
| Server closed | Server finishes | `server.close()` callback fires | Shutdown completes | `logger.info()` is called with "Server closed" — NOT `console.log()` |

### Implementation Changes

Replace all `console.log()` calls with `logger.info()`:

```js
import { config, logger } from './src/shared/index.js'

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server started')
})

const shutdown = (signal) => {
  logger.info({ signal }, 'Shutdown signal received — closing server')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
}
```

---

## 4. Auth Logging — Controllers and Services

### 4.1 AuthController — Logging Requirements

| Method | Log Location | Event Field | Payload | Prohibited |
|--------|-------------|-------------|---------|------------|
| `register` | Start of method | `'auth:register:start'` | `{ email }` | Never log password |
| `register` | After completion | `'auth:register:complete'` | `{ userId }` | Never log token |
| `login` | Start of method | `'auth:login:attempt'` | `{ email }` | Never log password |

Implementation pattern — inject `req.log` (already available via pino-http):

```js
static async register(req, res) {
  req.log.info({ event: 'auth:register:start', email: req.body.email })
  const result = await AuthService.register(req.body)
  req.log.info({ event: 'auth:register:complete', userId: result.user.id })
  // ... rest unchanged
}

static async login(req, res) {
  const { email, password } = req.body
  req.log.info({ event: 'auth:login:attempt', email })
  // ... rest unchanged
}
```

### 4.2 AuthService — Logging Requirements

`AuthService` is a static class without direct access to `req`. Use the imported `logger` directly from the shared barrel.

| Method | Log Location | Event Field | Payload | Prohibited |
|--------|-------------|-------------|---------|------------|
| `refresh` | Start of method | `'auth:refresh:attempt'` | `{ userId }` (extracted from decoded token) | Never log token |
| `refresh` | After success | `'auth:refresh:success'` | `{ userId }` | Never log token |
| `updatePassword` | After success | `'auth:password:updated'` | `{ userId }` | Never log passwords (current or new) |

Implementation pattern:

```js
import { config, logger } from '../../shared/index.js'

static async refresh(token) {
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    logger.info({ event: 'auth:refresh:attempt', userId: payload.id })
    // ... existing logic ...
    logger.info({ event: 'auth:refresh:success', userId: payload.id })
    return { ... }
  } catch {
    // ... existing error handling ...
  }
}

static async updatePassword(userId, { currentPassword, newPassword }) {
  // ... existing validation logic ...
  const hashedPassword = await bcrypt.hash(newPassword, DEFAULTS.SALT_ROUNDS)
  await AuthRepository.update(userId, { password: hashedPassword })
  logger.info({ event: 'auth:password:updated', userId })
  return { ... }
}
```

### 4.3 Sensitive Data Policy

**ABSOLUTELY NEVER LOG:**
- Plaintext passwords (any variable containing a password before hashing)
- JWT tokens (access or refresh)
- Cookie values
- `req.body` in its entirety from auth endpoints (may contain password)

**Logging `req.body.email` is safe.** Logging `req.body` is NOT safe.

---

## 5. Config — `src/shared/config/config.js` Modifications

### Technical Requirements

Add `logLevel` property to the `config` object:

```js
export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://...',
  logLevel: process.env.PINO_LOG_LEVEL || 'info',   // NEW
}
```

---

## 6. Vitest Infrastructure

### 6.1 `vitest.config.ts` (New)

**Location:** `backend/vitest.config.ts`

| Property | Value |
|----------|-------|
| `test.globals` | `true` |
| `test.environment` | `'node'` |
| `test.setupFiles` | `['./src/__tests__/setup.js']` |
| `test.include` | `['src/**/*.test.js']` |
| `test.coverage.provider` | `'v8'` |
| `test.coverage.reporter` | `['text', 'html', 'lcov']` |
| `test.coverage.include` | `['src/**/*.js']` |
| `test.coverage.exclude` | `['src/__tests__/**', '**/*.test.js']` |

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.js'],
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['src/__tests__/**', '**/*.test.js'],
    },
  },
})
```

### 6.2 `src/__tests__/setup.js` — Global Mocks (New)

**Purpose:** Mock `pino` and `pino-http` at the module level **before any test imports** so that worker threads, file I/O, and transport side effects never execute during tests.

#### Mock Requirements

| Behaviour | Implementation |
|-----------|---------------|
| `pino` default export | Returns a mock logger object with all level methods as `vi.fn()` |
| Mock logger methods | `info`, `warn`, `error`, `debug`, `trace`, `fatal`, `child` — all `vi.fn(() => mockLogger)` for chaining |
| `pino.transport` | Returns a mock stream object `{ write: vi.fn(), on: vi.fn() }` |
| `pino-http` default export | Returns a middleware function `vi.fn((req, res, next) => next())` |
| Middleware function | Attaches `req.log = mockLogger` so controllers can call `req.log.info()` |

```js
import { vi } from 'vitest'

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn(),
  child: vi.fn(() => mockLogger),
  level: 'info',
}

vi.mock('pino', () => {
  const mockPino = vi.fn(() => mockLogger)
  mockPino.transport = vi.fn(() => ({
    write: vi.fn(),
    on: vi.fn(),
  }))
  return { default: mockPino }
})

vi.mock('pino-http', () => {
  const mockPinoHttp = vi.fn(() => {
    const middleware = (req, _res, next) => {
      req.log = mockLogger
      next()
    }
    return middleware
  })
  return { default: mockPinoHttp }
})
```

### 6.3 Test File Convention

| Rule | Value |
|------|-------|
| Location | **Co-located** — `.test.js` file next to the source file in the same folder |
| Naming | `logger.test.js` (next to `logger.js`), `app.test.js` (next to `app.js`) |
| Pattern | `src/shared/logger/logger.test.js`, `src/app.test.js`, `src/controllers/auth/auth.controller.test.js` |

---

## 7. Test Specifications

### 7.1 `src/shared/logger/logger.test.js`

#### Test: "respects PINO_LOG_LEVEL environment variable"

```
Given PINO_LOG_LEVEL is set to 'debug'
 When the logger module is imported
 Then logger.level should be 'debug'
```

**Implementation:**
```js
import { beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => { vi.unstubAllEnvs() })

it('respects PINO_LOG_LEVEL env var', async () => {
  vi.stubEnv('PINO_LOG_LEVEL', 'debug')
  const { logger } = await import('./logger.js')
  expect(logger.level).toBe('debug')
})

it('defaults to info when PINO_LOG_LEVEL is not set', async () => {
  const { logger } = await import('./logger.js')
  expect(logger.level).toBe('info')
})
```

#### Test: "uses pino.transport with dual targets (file + pretty) in development"

```
Given NODE_ENV is 'development' (or unset)
 When pino is called
 Then pino.transport is called with targets array containing 2 entries
 And the first target is 'pino/file'
 And the second target is 'pino-pretty'
```

```js
it('configures dual transport in development', async () => {
  vi.stubEnv('NODE_ENV', 'development')
  const pino = await import('pino')
  await import('./logger.js')
  const defaultExport = pino.default || pino
  expect(defaultExport).toHaveBeenCalled()
  expect(defaultExport.transport).toHaveBeenCalled()
  const transportCall = defaultExport.transport.mock.calls[0][0]
  expect(transportCall.targets).toHaveLength(2)
  expect(transportCall.targets[0].target).toBe('pino/file')
  expect(transportCall.targets[1].target).toBe('pino-pretty')
})
```

#### Test: "skips pino-pretty in production"

```
Given NODE_ENV is 'production'
 When pino is called
 Then pino.transport targets array has only 1 entry (pino/file only)
```

```js
it('skips pino-pretty in production', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  const pino = await import('pino')
  await import('./logger.js')
  const defaultExport = pino.default || pino
  const transportCall = defaultExport.transport.mock.calls[0][0]
  const targets = transportCall.targets
  expect(targets).toHaveLength(1)
  expect(targets[0].target).toBe('pino/file')
  expect(targets.every(t => t.target !== 'pino-pretty')).toBe(true)
})
```

### 7.2 `src/shared/logger/http-logger.test.js`

#### Test: "exports httpLogger as a middleware function"

```
Given httpLogger is imported
 Then it should be a function with arity 3 (req, res, next)
```

#### Test: "uses customLogLevel based on status code"

```
Given a request response has statusCode 500
 When customLogLevel is evaluated
 Then it returns 'error'

Given a request response has statusCode 404
 When customLogLevel is evaluated
 Then it returns 'warn'

Given a request response has statusCode 200
 When customLogLevel is evaluated
 Then it returns 'info'
```

### 7.3 `src/app.test.js`

#### Test: "httpLogger is the first middleware"

```
Given the Express app is created
 When middleware stack is inspected
 Then httpLogger should be registered before cors and json parser
```

#### Test: "GET /health returns 200"

```
Given the Express app is running
 When a GET /health request is made via supertest
 Then response status is 200
 And response body has { status: 'ok' }
 And req.log.info (or appropriate level) was called
```

#### Test: "error handler logs via req.log.error"

```
Given a route throws an error with status 500
 When the error handler processes it
 Then req.log.error should be called with the error
```

#### Test: "error handler returns formatted response"

```
Given a route throws an error
 When the error handler processes it
 Then the response status matches the error status (or 500)
```

### 7.4 `src/server.test.js`

#### Test: "startup calls logger.info instead of console.log"

```
Given server.js is imported
 When app.listen callback fires
 Then logger.info is called with the port
 And console.log is NOT called
```

#### Test: "shutdown calls logger.info on SIGTERM"

```
Given the server is running
 When SIGTERM is emitted
 Then logger.info is called with signal name
 And console.log is NOT called
```

### 7.5 `src/controllers/auth/auth.controller.test.js`

#### Test: "register logs start and completion events"

```
Given a valid registration request
 When AuthController.register is called
 Then req.log.info is called with event 'auth:register:start'
 And req.log.info is called with event 'auth:register:complete'
```

#### Test: "login logs attempt"

```
Given a login request
 When AuthController.login is called
 Then req.log.info is called with event 'auth:login:attempt' and the email
```

#### Test: "does NOT log password or tokens"

```
Given any auth controller method
 Then none of the log calls contain the string 'password', 'token', or the literal password value
```

### 7.6 `src/services/auth/auth.service.test.js`

#### Test: "refresh logs attempt and success"

```
Given a valid refresh token
 When AuthService.refresh is called
 Then logger.info is called with event 'auth:refresh:attempt'
 And logger.info is called with event 'auth:refresh:success'
```

#### Test: "updatePassword logs update without passwords"

```
Given a valid password update
 When AuthService.updatePassword is called
 Then logger.info is called with event 'auth:password:updated'
 And the log payload does NOT contain 'currentPassword' or 'newPassword'
```

### 7.7 `src/shared/logger/logger.test.js` — Barrel Export Test

#### Test: "barrel exports logger and httpLogger"

```
Given the barrel module at src/shared/index.js
 When we import { logger, httpLogger } from it
 Then logger should be defined
 And httpLogger should be a function
```

---

## 8. Package / Script / Ignore Changes

### 8.1 `package.json` — New Dependencies

| Dependency | Version | Type |
|-----------|---------|------|
| `pino` | `^10.0.0` | dependencies |
| `pino-http` | `^11.0.0` | dependencies |
| `pino-pretty` | `^13.0.0` | devDependencies |
| `vitest` | `^4.0.0` | devDependencies |
| `supertest` | `^7.0.0` | devDependencies |

### 8.2 `package.json` — New Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

These are **additive** — existing scripts (`dev`, `start`, `prisma:generate`, `lint`) remain unchanged.

### 8.3 `.gitignore` — New Entries

```gitignore
# Vitest artifacts
.vitest/

# Log files
logs/
```

**Note:** `*.log` is already in `.gitignore` but `logs/` (directory) is not explicit. Add `logs/` and `.vitest/`.

### 8.4 Docker Consideration

`pino-pretty` is a devDependency. In Docker production build, run `npm prune --omit=dev` to exclude it. The Dockerfile (not in scope of this change) must already handle this; no action needed here beyond the devDependencies classification.

---

## 9. Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| AC1 | `npm run test:run` passes all tests | CI / local execution |
| AC2 | `npm run test:coverage` produces text + HTML + lcov reports | Check `.vitest/` and terminal output |
| AC3 | `GET /health` returns 200, logged via pino-http | SuperTest test + log assertion |
| AC4 | Auth `register` produces `auth:register:start` and `auth:register:complete` log events | Test assertion on `req.log.info` mock |
| AC5 | Auth `login` produces `auth:login:attempt` log event with email | Test assertion on `req.log.info` mock |
| AC6 | Auth `refresh` produces `auth:refresh:attempt` and `auth:refresh:success` log events | Test assertion on `logger.info` mock |
| AC7 | Auth `updatePassword` produces `auth:password:updated` log without passwords | Test assertion + sensitive data verification |
| AC8 | No log call contains password or token values | Test assertion |
| AC9 | Server startup uses `logger.info` not `console.log` | Test assertion |
| AC10 | Server shutdown (SIGTERM/SIGINT) uses `logger.info` not `console.log` | Test assertion |
| AC11 | Error handler uses `req.log.error(err)` not `console.error(err.stack)` | Test assertion |
| AC12 | `httpLogger` is the first middleware in the Express stack | Test assertion |
| AC13 | `PINO_LOG_LEVEL` env var controls log level, defaults to `'info'` | Test assertion |
| AC14 | `pino-pretty` is excluded in production | Test assertion |
| AC15 | Mocked pino never creates worker threads or file I/O in tests | Verify no `pino.transport` worker threads spawn |
| AC16 | Mocked pino never touches the filesystem in tests | Verify no `logs/` directory is created during test run |
| AC17 | `config.logLevel` mirrors `PINO_LOG_LEVEL` or defaults to `'info'` | Code review |
| AC18 | Barrel (`src/shared/index.js`) exports `logger` and `httpLogger` | Test assertion |

---

## 10. Dependency Flow Diagram (Modified Files)

```
src/shared/config/config.js
  └── adds `logLevel` property
  └── (no new imports)

src/shared/logger/logger.js           [NEW]
  └── imports: pino
  └── exports: logger

src/shared/logger/http-logger.js       [NEW]
  └── imports: pino-http, ./logger.js
  └── exports: httpLogger

src/shared/index.js                   [MODIFIED]
  └── adds: export { logger, httpLogger } from './logger/logger.js'
  └── adds: export { logger, httpLogger } from './logger/http-logger.js'

src/app.js                            [MODIFIED]
  └── adds: import { httpLogger } from './shared/index.js'
  └── adds: app.use(httpLogger) — FIRST middleware
  └── modifies: error handler — req.log.error(err) instead of console.error

server.js                             [MODIFIED]
  └── adds: logger to import from './src/shared/index.js'
  └── modifies: console.log → logger.info (3 locations)

src/controllers/auth/auth.controller.js  [MODIFIED]
  └── adds: req.log.info() calls (register start, register complete, login attempt)

src/services/auth/auth.service.js        [MODIFIED]
  └── adds: import { logger } from '../../shared/index.js'
  └── adds: logger.info() calls (refresh attempt, refresh success, password updated)

vitest.config.ts                      [NEW]
src/__tests__/setup.js                [NEW]
```

---

## 11. Implementation Order (TDD Sequence)

Strict TDD — each step writes the test BEFORE the implementation:

| Step | Area | Test File | Implementation File |
|------|------|-----------|-------------------|
| 1 | Vitest infrastructure | Setup (no test) | `vitest.config.ts`, `src/__tests__/setup.js` |
| 2 | Logger module — config | `src/shared/logger/logger.test.js` | `src/shared/logger/logger.js` |
| 3 | Logger module — http | `src/shared/logger/http-logger.test.js` | `src/shared/logger/http-logger.js` |
| 4 | Barrel export | (part of logger.test.js) | `src/shared/index.js` (modify) |
| 5 | Config addition | (part of logger.test.js) | `src/shared/config/config.js` (modify) |
| 6 | HTTP logging in app | `src/app.test.js` | `src/app.js` (modify) |
| 7 | Server logging | `src/server.test.js` | `server.js` (modify) |
| 8 | Auth controller logging | `src/controllers/auth/auth.controller.test.js` | `src/controllers/auth/auth.controller.js` (modify) |
| 9 | Auth service logging | `src/services/auth/auth.service.test.js` | `src/services/auth/auth.service.js` (modify) |
| 10 | Package + gitignore | (no test) | `package.json`, `.gitignore` (modify) |
