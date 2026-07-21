# Tasks: Playwright E2E in Frontend + CI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~470 (4 backend + 13 frontend/test + 1 CI file) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Backend DELETE) -> PR 2 (Frontend infra + CI) -> PR 3 (Test specs) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | DELETE /api/v1/applications/{id} backend endpoint | PR 1 | `curl -X DELETE http://localhost:3000/api/v1/applications/{id}` | Docker Compose (backend + DB) | Revert 4 backend files (routes, controllers, services, repositories) |
| 2 | Frontend test infra + CI pipeline | PR 2 | `npm run test:e2e -- --list` prints config without error | N/A (list mode, no runtime needed) | Revert package.json, playwright.config.ts, tests/tsconfig.json, ci.yml |
| 3 | Test helpers + 5 spec files | PR 3 | `npm run test:e2e` passes with Docker Compose up | Docker Compose + Vite devServer | Revert tests/ directory |

## Phase 1: Backend Prerequisite — DELETE Application Endpoint

- [x] 1.1 Add `deleteById()` to `application.repository.js` (Prisma `delete` where user owns app)
- [x] 1.2 Add `deleteApplication()` to `application.service.js` (auth check + repo call)
- [x] 1.3 Add `delete()` to `application.controller.js` (Zod validation + service call)
- [x] 1.4 Add `DELETE /api/v1/applications/:id` to `application.routes.js` (auth middleware + controller)

## Phase 2: Frontend Test Infrastructure

- [x] 2.1 Add `@playwright/test` devDependency + 4 scripts to `frontend/package.json`
- [x] 2.2 Create `frontend/playwright.config.ts` (webServer, chromium project, retries, trace)
- [x] 2.3 Create `frontend/tests/tsconfig.json` (extends parent, adds playwright test types)

## Phase 3: Test Helpers — Fixtures & Page Objects

- [x] 3.1 Create `frontend/tests/fixtures/auth.fixture.ts` (createTestUser, deleteTestUser, generateEmail)
- [x] 3.2 Create `frontend/tests/fixtures/index.ts` (test.extend<MyFixtures> with page objects + auth)
- [x] 3.3 Create `frontend/tests/page-objects/LoginPage.ts` (goto, fillEmail, fillPassword, submit, login)
- [x] 3.4 Create `frontend/tests/page-objects/RegisterPage.ts` (goto, fill, register with all fields)
- [x] 3.5 Create `frontend/tests/page-objects/KanbanBoardPage.ts` (isLoaded, getColumnApps, dragCard)
- [x] 3.6 Create `frontend/tests/page-objects/ApplicationFormModal.ts` (isVisible, fillJobTitle, selectCompany, submit)

## Phase 4: Test Specs — 5 Critical Paths

- [x] 4.1 Create `frontend/tests/specs/auth/login.spec.ts` (happy path + invalid credentials)
- [x] 4.2 Create `frontend/tests/specs/auth/register.spec.ts` (register -> redirect /login -> login -> dashboard)
- [x] 4.3 Create `frontend/tests/specs/kanban/kanban-crud.spec.ts` (create, drag, edit, verify persists on reload)
- [x] 4.4 Create `frontend/tests/specs/validation/form-validation.spec.ts` (empty submit, invalid email, weak password)
- [x] 4.5 Create `frontend/tests/specs/routing/protected-routes.spec.ts` (redirect /login -> login -> redirect back)

## Phase 5: CI Integration

- [x] 5.1 Add Docker compose up + health check to `.github/workflows/ci.yml` after Build step
- [x] 5.2 Add Prisma migrate deploy step with DATABASE_URL to CI workflow
- [x] 5.3 Add Playwright install --with-deps chromium + test:ci run + report artifact upload

## Phase 6: Post-Verify Corrections

- [x] C1: Fix `private readonly` parameter properties → explicit property declarations in 4 page objects
- [x] C2: Add `POST /api/v1/companies` endpoint (schema + validator + repo + service + controller + route)
- [x] C3: Start backend Express server in CI before Playwright tests
- [x] C4: Add drag & drop test coverage to kanban-crud.spec.ts
- [x] W1: Replace `waitForTimeout` with deterministic waits in 3 spec files

## Phase 7: Local DX Improvements

- [x] 7.1 Add `postinstall` script to auto-install Playwright Chromium after `npm install`
- [x] 7.2 Create `openspec/changes/playwright-e2e/spec/` with 4 delta spec files (auth, kanban-crud, form-validation, protected-routes)
- [x] 7.3 Enable `strict_tdd: true` in `openspec/config.yaml`

## Review Workload (Final)

| Field | Value |
|-------|-------|
| Total changed lines | ~530 (5 backend + 16 frontend/test + 1 CI + 2 config) |
| Actual PR size | Single PR (size:exception approved) |
| Verdict | PASS WITH WARNINGS (verify confirmed)
