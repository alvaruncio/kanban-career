# Design: Playwright E2E in Frontend + CI

## Technical Approach

Integrate Playwright E2E tests into `frontend/` with real backend (Docker Compose) in CI. Page Object Model + Playwright custom fixtures. Chromium only. Unique email per spec via API-based user creation/cleanup. 5 critical paths for first slice.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Test runner | `@playwright/test` standalone | Vitest browser mode, Cypress | Mature E2E tool, built-in webServer, ESM-compatible config, native waitFor |
| Auth strategy (non-auth tests) | `page.request.post()` API login | UI login every test, localStorage injection | Fast setup. API response `Set-Cookie` shares HTTPOnly refresh cookie with browser context. `AuthContext` auto-restores session via `/auth/refresh` |
| Page objects | Playwright custom fixtures via `test.extend<MyFixtures>` | Global helpers, standalone classes | Type-safe injection per test, standard Playwright pattern, no manual instantiation |
| Test data | Unique email `test-${uuid()}@example.com` created in `beforeAll` | Shared user, DB transaction rollback | No parallel conflicts, no DB schema changes, cleanup via `DELETE /users/:id` (self-delete) |
| CI strategy | Dedicated e2e job with `services.postgres` + manual backend start | Docker Compose in frontend job | Faster than Docker Compose in GHA, no compose file dependency, separate job keeps CI parallel |

## Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.52.0"
  }
}
```

Install: `npm install` (postinstall script auto-runs `npx playwright install chromium`). For CI, `npx playwright install --with-deps chromium` runs explicitly with system dependencies.

## Scripts (frontend/package.json)

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:ci": "playwright test --reporter=html,github",
    "test:debug": "playwright test --debug",
    "test:unit": "echo 'No unit tests configured yet'",
    "postinstall": "npx playwright install chromium"
  }
}
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/package.json` | Modify | Add `@playwright/test` devDependency + scripts + postinstall |
| `frontend/playwright.config.ts` | Create | Full config — webServer, Chromium, retries, trace |
| `frontend/tests/fixtures/index.ts` | Create | Custom Playwright fixtures via `test.extend<MyFixtures>` |
| `frontend/tests/fixtures/auth.fixture.ts` | Create | `loginAsNewUser()`, `cleanupUser(userId)`, uuid email generator |
| `frontend/tests/page-objects/LoginPage.ts` | Create | `goto()`, `fillEmail()`, `fillPassword()`, `submit()`, `login(email, pw)` |
| `frontend/tests/page-objects/RegisterPage.ts` | Create | `goto()`, fill methods per field, `register(name, email, pw, confirm)` |
| `frontend/tests/page-objects/KanbanBoardPage.ts` | Create | `isLoaded()`, `getColumnApps(status)`, `dragCard(appId, toStatus)` |
| `frontend/tests/page-objects/ApplicationFormModal.ts` | Create | `isVisible()`, `fillJobTitle()`, `selectCompany()`, `submit()` |
| `frontend/tests/specs/auth/login.spec.ts` | Create | Login happy path + invalid credentials error |
| `frontend/tests/specs/auth/register.spec.ts` | Create | Register happy path + auto-redirect to dashboard |
| `frontend/tests/specs/kanban/kanban-crud.spec.ts` | Create | Create app via UI, drag between columns, verify persistence on reload |
| `frontend/tests/specs/validation/form-validation.spec.ts` | Create | Empty submit → inline errors; invalid email; weak password |
| `frontend/tests/specs/routing/protected-routes.spec.ts` | Create | Visit /dashboard → redirect /login → login → back to /dashboard |
| `.github/workflows/ci.yml` | Modify | Add e2e job with postgres service, backend start, migrations, Playwright install, test run, artifact upload |
| `backend/src/schemas/company/company.schema.js` | Create | Zod schema for company creation |
| `backend/src/validators/company/company.validator.js` | Create | Validation middleware for POST /api/v1/companies |
| `backend/src/repositories/company/company.repository.js` | Modify | Add `create()` method |
| `backend/src/services/company/company.service.js` | Modify | Add `create()` with userId injection from JWT |
| `backend/src/controllers/company/company.controller.js` | Modify | Add `create()` returning 201 |
| `backend/src/routes/company/company.routes.js` | Modify | Add `POST /` route with `requireAuth` + validator |
| `frontend/tests/specs/kanban/kanban-crud.spec.ts` | Modify | Remove `page.evaluate`, add drag-and-drop test |
| `frontend/tests/specs/auth/login.spec.ts` | Modify | Replace `waitForTimeout` with deterministic wait |
| `frontend/tests/specs/validation/form-validation.spec.ts` | Modify | Replace `waitForTimeout` with deterministic waits |
| `openspec/config.yaml` | Modify | Add `strict_tdd: true`, testing section, updated commands |
| `openspec/changes/playwright-e2e/spec/auth-spec.md` | Create | Auth delta spec (login + register requirements) |
| `openspec/changes/playwright-e2e/spec/kanban-crud-spec.md` | Create | Kanban delta spec (create, drag, persist) |
| `openspec/changes/playwright-e2e/spec/form-validation-spec.md` | Create | Form validation delta spec |
| `openspec/changes/playwright-e2e/spec/protected-routes-spec.md` | Create | Protected routes delta spec |

## Folder Structure

```
openspec/changes/playwright-e2e/
├── proposal.md
├── spec/
│   ├── auth-spec.md
│   ├── kanban-crud-spec.md
│   ├── form-validation-spec.md
│   └── protected-routes-spec.md
├── design.md
└── tasks.md

frontend/tests/
├── fixtures/
│   ├── index.ts            # test.extend<MyFixtures> (loginPage, registerPage, kanbanPage)
│   └── auth.fixture.ts     # createTestUser(), deleteTestUser(userId), generateEmail()
├── page-objects/
│   ├── index.ts            # Barrel
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── KanbanBoardPage.ts
│   └── ApplicationFormModal.ts
├── specs/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   ├── kanban/
│   │   └── kanban-crud.spec.ts
│   ├── validation/
│   │   └── form-validation.spec.ts
│   └── routing/
│       └── protected-routes.spec.ts
└── tsconfig.json           # Extends parent tsconfig.app.json, adds @playwright/test types
```

## playwright.config.ts

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Test Data Flow

```
Each spec file (describe scope):
  beforeAll:
    email = `test-${uuid()}@example.com`
    resp = page.request.post('/api/v1/auth/register', { data: { name, email, password, confirmPassword } })
    // resp sets refreshToken cookie in browser context
    user = resp.data.user

  tests: ... (page already has valid session)

  afterAll:
    request.delete(`/api/v1/users/${user.id}`, { headers: { Authorization: `Bearer ${resp.data.accessToken}` }})
```

## Auth Token Strategy

- **Auth flow tests** (login, register): Real UI navigation + form fill + submit. No pre-setup.
- **Other tests** (kanban, validation, routing): API login via `page.request.post()` in `beforeAll`. The HTTPOnly refresh cookie from the response is automatically shared with the browser page context. On `page.goto()`, the `AuthContext` calls `POST /auth/refresh` → new access token → session restored.
- **Access token for API calls** (cleanup): Extract `accessToken` from the register/login API response. Use it in `page.request.delete()` Authorization header for user cleanup.

## CI Changes

Added a dedicated `e2e` job that runs after `frontend` job completes. Uses `services.postgres` for the database (faster than Docker Compose in GHA) and starts the Express backend manually:

```yaml
    e2e:
        runs-on: ubuntu-24.04
        needs: [frontend]
        services:
            postgres:
                image: postgres:16-alpine
                env:
                    POSTGRES_USER: kanbancareer
                    POSTGRES_PASSWORD: kanbancareer
                    POSTGRES_DB: kanbancareer
                ports:
                    - 5432:5432
                options: >-
                    --health-cmd pg_isready
                    --health-interval 10s
                    --health-timeout 5s
                    --health-retries 5

        defaults:
            run:
                working-directory: frontend

        steps:
            - uses: actions/checkout@v7
            - uses: actions/setup-node@v6
              with:
                  node-version: 24.18.0
                  cache: npm
                  cache-dependency-path: frontend/package-lock.json

            - run: npm ci                              # Installs frontend deps + postinstall runs playwright install chromium
            - run: npm ci
              working-directory: backend                # Installs backend deps for Prisma + server

            - run: npx prisma migrate deploy
              working-directory: backend
              env:
                  DATABASE_URL: postgresql://kanbancareer:kanbancareer@localhost:5432/kanbancareer

            - name: Start backend server
              run: |
                  node src/server.js &
                  for i in $(seq 1 20); do
                    curl -s http://localhost:3000/health > /dev/null && echo "Backend ready" && break
                    sleep 2
                  done
              working-directory: backend
              env:
                  DATABASE_URL: postgresql://kanbancareer:kanbancareer@localhost:5432/kanbancareer

            - run: npx playwright install --with-deps chromium   # System deps not covered by postinstall

            - run: npm run test:ci
              env:
                  CI: true
                  DATABASE_URL: postgresql://kanbancareer:kanbancareer@localhost:5432/kanbancareer

            - uses: actions/upload-artifact@v4
              if: always()
              with:
                    name: playwright-report
                    path: frontend/playwright-report/
```

## Testing Strategy

| Test | Precondition | Steps | Assertion |
|------|-------------|-------|-----------|
| Login happy path | Navigate /login | Fill valid email/pw, submit | URL changes to /dashboard, user greeting visible |
| Login invalid | Navigate /login | Fill invalid email/pw, submit | Error alert visible, URL still /login |
| Register happy | Navigate /register | Fill all fields with valid data, submit | URL changes to /dashboard, user greeting visible |
| Kanban CRUD | Logged in | Open modal, create app with company, drag card to INTERVIEW, reload, verify persistence | App appears in APPLIED column, moves to INTERVIEW after drag, persists after reload |
| Form validation | Navigate /register | Submit empty form | Inline error elements visible for required fields |
| Protected route | No session | Navigate /dashboard | Redirect to /login with `?redirect=/dashboard` query param |
| Protected redirect | After login from redirect | Login with valid creds | Redirect back to /dashboard |

## Threat Matrix

N/A — no routing changes, no shell command composition from untrusted input, no VCS/PR automation, no executable-file classification. CI steps use static GitHub Actions syntax; npm scripts are fixed strings.

## Migration / Rollout

No migration required. `npm install` with new dep + `npx playwright install chromium` for local setup. CI picks up automatically on next push.

## Resolved Questions

- [x] Backend `DELETE /api/v1/applications/{id}` — endpoint implemented (repository, service, controller, route). Also added `POST /api/v1/companies` as a prerequisite for kanban test data setup.
- [x] `DATABASE_URL` in CI — hardcoded in ci.yml for now. Deferred to GitHub Secrets when repo is migrated to org account.
- [x] Email verification flow — acknowledged: current app register immediately auto-logs in and redirects to dashboard. Tests verify real behavior. To be updated when email verification is built.
