# Tasks: Companies Section

## Mandatory Rules

### Test Gate — ALL E2E Tests MUST Pass
- After completing every **GREEN** task, run `npm run test:e2e` (or the focused equivalent). All E2E tests MUST pass before moving to the next task.
- After completing every **REFACTOR** task, run `npm run test:e2e` again. All tests MUST still pass. Refactor does NOT break tests.
- If any test fails, stop and fix the implementation before proceeding. No exceptions.
- The final Phase 6 task requires the full `npm run test:e2e -- --grep companies` suite to pass.

### Skills Requirement
- Before implementing ANY task, load the matching skill from `.agents/skills/<name>/SKILL.md` as defined in `AGENTS.md`.
- Backend tasks: load `nodejs-express-server`, `nodejs-backend-patterns`, `prisma-client-api` as applicable.
- Frontend component tasks: load `tailwind-css-patterns`, `react-hook-form` as applicable.
- Frontend test tasks: load `playwright-best-practices` (mandatory for ALL test work).
- i18n tasks: load `i18n-localization`.
- See `AGENTS.md` for the full skill table. Loading the wrong skill or skipping a skill is a violation.

### Orchestrator Review Gate
- At the end of each phase, there is a **REVIEW GATE** task. This task stops execution and waits for the orchestrator (human) to review the code and decide whether to continue.
- The orchestrator will inspect the diff, verify the work, and explicitly approve the next phase.
- Do NOT auto-continue past a REVIEW GATE. The orchestrator must respond first.

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~950 |
| 400-line budget risk | High |
| Chained PRs recommended | No |
| Suggested split | Single PR (size:exception — user pre-authorized) |
| Delivery strategy | single-pr (exception-ok) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Backend endpoints | PR 1 | `npm run lint` (backend) | Docker compose up + health check | Revert routes + repo methods |
| 2 | Frontend data layer | PR 1 | `npm run build` (frontend) | Vite dev server | Revert repo/service/store additions |
| 3 | Frontend pages + i18n | PR 1 | `npm run test:e2e` | Docker + Vite + Playwright | Revert routes + pages + locale keys |
| 4 | E2E tests | PR 1 | `npm run test:e2e -- --grep companies` | Full stack | Revert spec + page objects |

## Phase 1: Backend — Company Endpoints (TDD Cycle)

- [x] **RED-1.1**: Write Playwright E2E test stubs for GET /companies/:id + PATCH /companies/:id (404 on owned, 404 on unowned, 200, 400)
- [x] **GREEN-1.2**: Add `updateCompanySchema` (all fields optional) to `company.schema.js`; export from `schemas/index.js`
- [x] **GREEN-1.3**: Add `validateUpdateCompany` to `company.validator.js`; export from `validators/index.js`
- [x] **GREEN-1.4**: Add `findById(id)` + `update(id, data)` to `CompanyRepository` (with `deletedAt: null` guard)
- [x] **GREEN-1.5**: Add `getById(id, userId)` + `update(id, userId, data)` to `CompanyService` (ownership check, returns null)
- [x] **GREEN-1.6**: Add `getById` + `update` to `CompanyController` (404 on null, uses service response as source of truth)
- [x] **GREEN-1.7**: Add `GET /:id` + `PATCH /:id` routes to `company.routes.js` with `requireAuth` + validators
- [x] **TEST-GATE-1.8**: Run `npm run test:e2e` — ALL E2E tests MUST pass. If any fail, fix and re-run.
- [x] **REFACTOR-1.9**: Verify all backend patterns match existing `ApplicationService` conventions; run lint
- [x] **TEST-GATE-1.10**: Re-run `npm run test:e2e` — all tests MUST still pass after refactor.
- [x] **REVIEW-GATE-1.11**: STOP — orchestrator reviews the backend implementation before proceeding to Phase 2.

## Phase 2: Backend — Application Filter (REFACTOR)

- [x] **2.1**: Refactor `ApplicationRepository.findAllByUserId(userId, filters = {})` — support `filters.companyId` + `filters.month`
- [x] **2.2**: Update `ApplicationService.getAll(userId, filters = {})` to pass filters through
- [x] **TEST-GATE-2.3**: Syntax check + lint pass
- [x] **REVIEW-GATE-2.4**: STOP — orchestrator reviews the filter refactor before proceeding to Phase 3.

## Phase 3: Frontend — Data Layer (TDD Cycle)

- [x] **RED-3.1**: Write E2E test stubs for store actions (getById, updateCompany, createCompany)
- [x] **GREEN-3.2**: Extend `CompaniesState` in `company.ts` with `company`, `getById`, `updateCompany`, `createCompany`, `CreateCompanyDTO`, `UpdateCompanyDTO`
- [x] **GREEN-3.3**: Add `findById`, `update`, `create` to `CompanyRepository` (Axios calls, no optimistic data)
- [x] **GREEN-3.4**: Add `getById`, `update`, `create` to `CompanyService` (delegates to repository)
- [x] **GREEN-3.5**: Implement store actions in `companiesStore.ts` — `getById` resets `company` to null before fetch; `updateCompany` uses backend response; `createCompany` uses POST response; never optimistic
- [x] **GREEN-3.6**: Add `findByCompanyId(companyId)` to `ApplicationRepository`; add `getByCompanyId(companyId)` to `ApplicationService`
- [x] **TEST-GATE-3.7**: Run `npm run build` — PASSED
- [x] **REFACTOR-3.8**: Verify all store actions treat backend as source of truth; run `npm run build`
- [x] **TEST-GATE-3.9**: Re-run `npm run build` — PASSED
- [x] **REVIEW-GATE-3.10**: User approved via orchestrator question gate. Proceed to Phase 4.

## Phase 4: Frontend — Pages & Components (TDD Cycle)

- [x] **RED-4.1**: Write E2E test stubs for CompaniesPage (18 test stubs in companies.spec.ts)
- [x] **GREEN-4.2**: Implement `CompaniesPage.tsx` — card grid (`grid-cols-1 sm:2 lg:3`), loading/empty/error states, floating add button
- [x] **REFACTOR-4.3**: Clean up list page — verify line-clamp-2, hover styles, barrel exports
- [x] **TEST-GATE-4.4**: Run `npm run build` — PASSED
- [x] **RED-4.5**: Write E2E test stubs for CreateCompanyModal
- [x] **GREEN-4.6**: Implement `CreateCompanyModal.tsx` — react-hook-form + Zod, calls `createCompany()`, closes + navigates on success
- [x] **REFACTOR-4.7**: Verify modal follows `ApplicationFormModal` pattern; export from components/index.ts → components/companies/index.ts sub-barrel
- [x] **TEST-GATE-4.8**: Run `npm run build` — PASSED
- [x] **RED-4.9**: Write E2E test stubs for CompanyDetailPage
- [x] **GREEN-4.10**: Implement `CompanyDetailPage.tsx` — view/edit toggle, react-hook-form, PATCH uses backend response, `company` nulled before fetch, loading spinner during fetch, related apps list, ViewField helper
- [x] **REFACTOR-4.11**: Verify detail page follows `ApplicationDetailPage` pattern; loading state prevents stale data flash
- [x] **TEST-GATE-4.12**: Run `npm run build` — PASSED
- [x] **GREEN-4.13**: Add lazy routes in `App.tsx` for `/companies` and `/companies/:id`; update barrel exports in `pages/index.ts`
- [x] **TEST-GATE-4.14**: Run `npm run build` — PASSED
- [x] **REFACTOR-4.15**: Extract `companySchema` to `models/` and `CompanyForm` reusable component — CreateCompanyModal and CompanyDetailPage edit mode now share schema + form
- [x] **REVIEW-GATE-4.15**: Approved via orchestrator question. Proceed to Phase 5.

## Phase 5: Sidebar Navigation & i18n (REFACTOR)

- [x] **5.1**: Add `companies` section + `nav.*` keys to `Translation` interface in `types.ts`
- [x] **5.2**: Add Spanish `companies.*` + `nav.*` translations to `es.ts`
- [x] **5.3**: Add English `companies.*` + `nav.*` translations to `en.ts`
- [x] **5.4**: Refactor `DashboardLayout.tsx` — migrate nav labels to `t.nav.*`, add left border accent on active link (`border-l-4 border-primary`)
- [x] **TEST-GATE-5.5**: Run `npm run build` — PASSED
- [x] **REVIEW-GATE-5.6**: STOP — orchestrator reviews the sidebar and i18n changes before proceeding to Phase 6.

## Phase 6: E2E Tests — Page Objects & Spec

- [x] **6.1**: Create `CompaniesListPage` page object — `goto()`, card grid, empty state, error, FAB, loading
- [x] **6.2**: Create `CompaniesDetailPage` page object — `goto(id)`, view/edit fields, related apps, 404, loading
- [x] **6.3**: Update `fixtures/index.ts` — register both page objects with fixture injection
- [x] **6.4**: Implement all 18 page-level tests in `companies.spec.ts` (card grid, create modal, detail, edit, errors, A→B stale data, loading)
- [x] **TEST-GATE-6.5**: Run `npm run test:e2e -- --grep companies` — **24 passed** (6 API + 18 page-level)
- [x] **REVIEW-GATE-6.6**: STOP — orchestrator does final review of all artifacts.
