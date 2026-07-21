# SDD Proposal: Playwright E2E in Frontend + CI

## Change ID
`playwright-e2e`

## Intent

**Business Problem**: The KanbanCareer frontend has zero automated testing. Every code change requires manual verification in the browser, leading to regressions slipping to production and slowing down iteration velocity. Users (job seekers managing applications) experience broken workflows when kanban drag-drop, form submissions, or auth flows regress silently.

**Target Users / Situations**:
- Job seekers using the Kanban board to track applications (drag-drop between columns, form submissions, status changes)
- Authenticated users navigating protected routes (login, register, dashboard, settings)
- Future contributors who need confidence that changes don't break existing flows

**Product Outcome**: Automated E2E test suite running in CI on every PR, covering critical user journeys (auth, kanban CRUD, drag-drop, form validation). Regression detection before merge. Confidence to ship faster.

**Current-State Gap**: Zero test infrastructure in frontend. No test runner, no CI test step, no test fixtures, no test data strategy. CI only runs lint + build.

**Implications / Impact**:
- **Positive**: Catch regressions pre-merge; enable confident refactoring; document critical flows as living tests
- **Negative (cost)**: CI time increase (~2-4 min); maintenance burden of E2E tests; flakiness risk with async UI (drag-drop, async API calls)
- **Team impact**: Requires test maintenance discipline; flaky tests erode trust

## Scope

### In Scope (First Slice)
- Playwright installed in `frontend/` with TypeScript config
- `frontend/tests/` directory with page-object/fixture structure
- `webServer` in config starting `npm run dev` (Vite dev server)
- CI job in GitHub Actions running Playwright after frontend build
- **First-slice test coverage (3-5 critical paths)**:
  1. Auth: login → dashboard (happy path)
  2. Auth: register → auto-login → dashboard (no email verification yet)
  3. Kanban: create application → drag between columns → persist on reload
  4. Form validation: required fields, inline errors
  5. Protected route redirect: unauthenticated → login → redirect back

### Out of Scope (Non-Goals)
- Visual regression / screenshot testing
- Cross-browser matrix (Chromium only for first slice)
- Mobile viewport testing
- API mocking / contract testing (MSW) — real backend in CI
- Parallel test sharding / parallelism tuning
- Test reporting dashboard (Allure, Playwright HTML report is sufficient)
- Vitest unit/integration tests (separate concern, complementary)

### First-Slice Boundaries
| In First Slice | Deferred |
|---|---|
| Chromium only | Firefox, WebKit |
| Real backend (docker-compose in CI) | API mocking |
| 5 critical E2E paths | Full regression suite |
| Sequential CI run | Parallel/sharded |
| Page objects + fixtures | Test data factories, seed scripts |

## Approach

**Architecture Pattern**: Page Object Model + Test Fixtures in `frontend/tests/`
- `tests/fixtures/` — test data, auth helpers, page objects
- `tests/e2e/` — spec files organized by feature (auth, kanban, forms)
- `playwright.config.ts` — webServer: `npm run dev`, baseURL: `http://localhost:5173`

**CI Integration** (GitHub Actions):
- Dedicated `e2e` job (separate from frontend) to keep CI parallel
- PostgreSQL via `services.postgres` (not Docker Compose) for faster startup
- Backend Express server started manually via `node src/server.js &` with health check loop
- Frontend dev server started via Playwright's built-in `webServer` config
- Prisma migrations run before tests
- Artifact upload: Playwright HTML report + traces on failure

**Test Data Strategy** (first slice):
- Real backend + real database (docker-compose in CI)
- Test users created via API in `beforeAll` / cleaned in `afterAll`
- No MSW mocking — test real API contracts

**Flakiness Mitigation** (first slice):
- `test.use({ trace: 'on-first-retry' })`
- Explicit waits via `expect(locator).toBeVisible()` / `waitForResponse()`
- No `waitForTimeout` — use locator assertions
- Retry: 1 (CI), 0 (local)

**Tooling Versions** (per frontend AGENTS.md):
- Playwright latest stable (v1.48+)
- TypeScript 6 (frontend uses TS 6)
- Vite 8 dev server via `webServer`

## Product Questions (Blocking Decisions)

### 1. Auth Flow Coverage Priority
**Question**: Which auth flows are *must-have* for first slice vs. deferrable?
- Login (email/password) → dashboard: **assumed mandatory**
- Register → email verification → login: **mandatory or defer?**
- Password reset / forgot password: **defer?**
- OAuth (GitHub, Google): **defer?**

**Why it matters**: Auth flows are brittle (email, tokens, redirects). Each adds CI time and flakiness surface. Need product priority to scope first slice.

### 2. Kanban Drag-Drop: What Counts as "Working"?
**Question**: For the drag-drop test, what's the minimum viable assertion?
- A: Card moves visually in DOM (data-testid position change)
- B: Card moves + API PATCH succeeds + column order persists on reload
- C: Full multi-column reorder + persist + reload verification

**Why it matters**: Drag-drop with @dnd-kit is async and flaky. Option A is fast but low confidence. Option C is high confidence but complex test + more flakiness. Product must define "done".

### 3. Test Data / User Isolation Strategy
**Question**: How should test users be managed in CI?
- A: Unique random email per test run (`test+${uuid}@example.com`), created via API, deleted after
- B: Shared static test user (`e2e-test@example.com`), seeded once, reused
- C: Database snapshot / transaction rollback per test (requires backend support)

**Why it matters**: Option A is safest for parallelism but needs cleanup reliability. Option B is simpler but breaks if tests run in parallel or leave dirty state. Option C needs backend work. Decision affects test reliability and CI complexity.

### 4. CI Environment: Real Backend vs. Mocked API
**Question**: Should CI spin up the full backend (Docker Compose) or use MSW/API mocking?
- Real backend (current plan): Tests real contracts, catches integration bugs, slower (~2-4 min), needs Docker in CI
- MSW mocking: Fast, isolated, but misses backend regressions (schema drift, auth middleware, DB constraints)

**Why it matters**: This is a fundamental architecture decision. Real backend = higher confidence, slower CI. Mocking = fast, but separate contract testing needed. Product must weigh confidence vs. velocity.

### 5. Flakiness Tolerance & Retry Policy
**Question**: What's the acceptable flake rate and retry policy for merge-blocking?
- A: Zero tolerance — flaky test blocks PR until fixed (strict)
- B: 1 retry in CI, mark flaky, track in dashboard, fix within 1 sprint
- C: Allow known-flaky tests (drag-drop) to be non-blocking initially

**Why it matters**: E2E tests *will* flake (network, timing, drag-drop). Policy determines whether flaky tests block merges or are quarantined. Product must decide risk tolerance.

---

## Decision Gaps (Technical — Not Product Questions)
*Implementation decisions resolved during the design phase:*
- [x] Playwright config: Chromium only (single project)
- [x] Test file naming: `*.spec.ts` convention
- [x] Page objects: Playwright custom fixtures via `test.extend<MyFixtures>`
- [x] Trace/video: `trace: 'on-first-retry'`, no video
- [x] CI: dedicated e2e job with services.postgres, Playwright system deps via --with-deps

## OpenSpec Artifact Location
`openspec/changes/playwright-e2e/proposal.md`

## Engram Topic
`sdd/playwright-e2e/proposal`