# Tasks: Application Detail Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~550 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Backend API — PR 2: Frontend page + i18n — PR 3: E2E tests |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: size-exception (single-pr applied)
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Backend GET /:id endpoint | PR 1 | `curl :3000/api/v1/applications/:id` with token | docker compose up | Revert `routes` + `controller` + `service` |
| 2 | Frontend page + routing + i18n | PR 2 | `npm run build` (frontend/) | `npm run dev` (frontend/) | Revert `App.tsx`, `ApplicationDetailPage/`, `KanbanCard`, locale files |
| 3 | E2E tests | PR 3 | `npx playwright test --grep detail` | docker compose + frontend dev | Revert `tests/` additions |

## Phase 1: Foundation — Backend API

- [x] 1.1 [RED] Write API test: GET /:id returns 200, 404, 401
- [x] 1.2 [GREEN] `ApplicationRepository.findById` add `include: { company }`
- [x] 1.3 [GREEN] Add `ApplicationService.getById(id, userId)` with ownership check (match `update` pattern)
- [x] 1.4 [GREEN] Add `ApplicationController.getById(req, res)` — returns 200 or 404
- [x] 1.5 [GREEN] Register `GET /:id` with `requireAuth` in routes
- [x] 1.6 [REFACTOR] Lint & verify consistency

## Phase 2: Infrastructure — Frontend Wiring

- [x] 2.1 Add `applicationDetail` section to `Translation` interface
- [x] 2.2 Add Spanish translations: all field labels, actions, normalized source/status/category labels
- [x] 2.3 Add English translations for all keys
- [x] 2.4 Add `ApplicationService.getById(id)` + `ApplicationRepository.findById(id)`
- [x] 2.5 Add lazy route `/application/:id` in `App.tsx` under `ProtectedRoute` + `DashboardLayout`
- [x] 2.6 Add barrel exports in `pages/index.ts`
- [x] 2.7 Wrap `KanbanCard` body in `<Link to={/application/${id}}>` — card becomes clickable

## Phase 3: Core — ApplicationDetailPage

- [x] 3.1 Create page with fetch-on-mount, loading state (`LoadingSkeleton`), error state
- [x] 3.2 View mode: display all 9 fields + 2 timestamps via i18n labels
- [x] 3.3 Edit mode: react-hook-form + `InputForm`/`SelectForm`/`TextareaForm` with Zod validation
- [x] 3.4 Wire save to `useApplicationsStore.updateApplication` + success/error feedback
- [x] 3.5 Add "Back to Kanban" button + `PageMeta` for SEO
- [x] 3.6 Add company selector in edit mode via `useCompaniesStore` — company becomes editable
- [x] 3.7 Fix blank options in category/source selects — `screamingSnakeToCamel` for translation key lookup

## Phase 4: E2E Verification

- [x] 4.1 Create `ApplicationDetailPage` page object with selectors, register in fixture
- [x] 4.2 [RED] Test: KanbanCard navigates to detail page
- [x] 4.3 [RED] Test: all fields render in view mode
- [x] 4.4 [RED] Test: edit field and save successfully
- [x] 4.5 [RED] Test: validation blocks invalid data, no PATCH sent
- [x] 4.6 [RED] Test: back to kanban navigation
- [x] 4.7 [RED] Test: loading state (slow intercept)
- [x] 4.8 [RED] Test: error state (mock 500)
- [x] 4.9 [GREEN] Run full suite, fix failures
- [x] 4.10 [REFACTOR] Clean up page object, extract shared helpers
