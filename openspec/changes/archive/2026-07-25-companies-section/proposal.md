# Proposal: Companies Section

## Intent

Users need a dedicated section to manage companies they interact with during their job search. Currently companies are only accessible indirectly via the application form dropdown. A `/companies` section provides CRUD management, company detail with associated applications, and a visual card grid for browsing — reducing data fragmentation and enabling company-level tracking.

## Scope

### In Scope
- **Backend**: `GET /api/v1/companies/:id` (by id, user-owned) and `PATCH /api/v1/companies/:id` endpoints
- **Frontend — Companies list** (`/companies`): card grid, each card shows name, website, LinkedIn URL, description (line-clamp-2)
- **Frontend — Company detail** (`/companies/:id`): view/edit toggle (matching `ApplicationDetailPage`), Zod form with PATCH, related applications list with links to `/kanban`
- **Frontend — Create flow**: modal on listing page, calls `POST /companies`, refreshes list
- **i18n**: `t.companies.*` keys in both Spanish and English
- **TDD**: Playwright E2E spec for list, detail, and create flows (red-green-refactor)

### Out of Scope
- Soft-delete / restore (Companies are soft-deleted via existing `deletedAt`; restore endpoint deferred)
- Pagination on companies list (scope is small for MVP — revisit if >50 companies)
- Bulk actions (select multiple, batch delete)
- Company logo/image upload
- Activity log per company

## Capabilities

### New Capabilities
- `companies-section`: Company list, detail/edit view, and inline creation as a dedicated feature area

### Modified Capabilities
- None

## Approach

**Backend**: Add `findById` and `update` to `CompanyRepository` (with `deletedAt: null` guard). Add `getById` and `update` to `CompanyService` (ownership check, returns `null` on miss). Add `getById` and `update` to `CompanyController`. Add `updateCompanySchema` to schemas. Add `validateUpdateCompany` to validators. Register `GET /:id` and `PATCH /:id` in `company.routes.js`.

**Frontend — Repo/Service/Store**: Add `findById`, `update`, `create` to `CompanyRepository`. Add same to `CompanyService`. Extend `CompaniesState` with `company`, `getById`, `updateCompany`, `createCompany` in the Zustand store.

**Frontend — List page** (`CompaniesPage`): fetch all companies on mount. Render card grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Each card: `bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm` with company info and `line-clamp-2` for description. Floating "Add" button opens create modal.

**Frontend — Detail page** (`CompanyDetailPage`): fetch by id. View mode shows all fields + related applications list. Edit toggle switches to a `react-hook-form` + Zod form. Save calls PATCH, refetches. Follows `ApplicationDetailPage` pattern exactly.

**Frontend — Create modal**: Modal overlay with `react-hook-form` + Zod. Calls `POST /companies`. On success, closes modal and refreshes company list. Same visual style as listing cards + `ApplicationFormModal`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/repositories/company/company.repository.js` | Modified | Add `findById(id)`, `update(id, data)` |
| `backend/src/services/company/company.service.js` | Modified | Add `getById(id, userId)`, `update(id, userId, data)` with ownership checks |
| `backend/src/controllers/company/company.controller.js` | Modified | Add `getById`, `update` static methods |
| `backend/src/schemas/company/company.schema.js` | Modified | Add `updateCompanySchema` (all fields optional) |
| `backend/src/schemas/index.js` | Modified | Export new schema |
| `backend/src/validators/company/company.validator.js` | Modified | Add `validateUpdateCompany` |
| `backend/src/validators/index.js` | Modified | Export new validator |
| `backend/src/routes/company/company.routes.js` | Modified | Add `GET /:id`, `PATCH /:id` routes |
| `frontend/src/interfaces/company/company.ts` | Modified | Extend `CompaniesState` with `company`, `getById`, `updateCompany`, `createCompany` |
| `frontend/src/repositories/CompanyRepository/CompanyRepository.ts` | Modified | Add `findById`, `update`, `create` |
| `frontend/src/services/CompanyService/CompanyService.ts` | Modified | Add `getById`, `update`, `create` |
| `frontend/src/stores/companiesStore/companiesStore.ts` | Modified | Add `getById`, `updateCompany`, `createCompany` actions |
| `frontend/src/pages/CompaniesPage/CompaniesPage.tsx` | New | Card grid list page |
| `frontend/src/pages/CompanyDetailPage/CompanyDetailPage.tsx` | New | Detail/edit page with applications list |
| `frontend/src/components/CreateCompanyModal/CreateCompanyModal.tsx` | New | Modal form for company creation |
| `frontend/src/pages/index.ts` | Modified | Export new pages |
| `frontend/src/App.tsx` | Modified | Add routes `/companies`, `/companies/:id` |
| `frontend/src/locales/types/types.ts` | Modified | Add `companies` section to `Translation` |
| `frontend/src/locales/es/es.ts` | Modified | Spanish `companies` keys |
| `frontend/src/locales/en/en.ts` | Modified | English `companies` keys |
| `frontend/tests/specs/companies/` | New | Playwright E2E spec files |
| `frontend/tests/page-objects/` | New | Page objects for companies flows |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ownership check mismatch (backend) | Low | Follow existing `ApplicationService` guard pattern (returns `null`, controller sends 404) |
| Replacing companies via fetch in detail page | Low | `getById` fetches single company, doesn't replace `companies[]` in store — use separate `company` field in state |
| Modal form validation diverges from backend schema | Low | Reuse `createCompanySchema` Zod shape on frontend; both use Zod 4 |

## Rollback Plan

1. Revert `frontend/src/App.tsx` — remove `/companies` and `/companies/:id` routes.
2. Delete new page folders (`CompaniesPage`, `CompanyDetailPage`, `CreateCompanyModal`).
3. Revert backend route additions in `company.routes.js`.
4. Revert store/service/repository additions.
5. No DB migrations — zero data risk.

## Dependencies

- `POST /api/v1/companies` already exists (no dependency)
- Existing `requireAuth` middleware covers all new endpoints

## Success Criteria

- [ ] `GET /api/v1/companies/:id` returns a single company (404 if not owned by user)
- [ ] `PATCH /api/v1/companies/:id` updates allowed fields and returns updated company
- [ ] `/companies` renders card grid with all user companies, cards truncated at line-clamp-2
- [ ] Clicking a card navigates to `/companies/:id` with company data + related applications
- [ ] Edit toggle switches to form with Zod validation, save calls PATCH and refreshes
- [ ] Create modal opens from listing, submits POST, closes + refreshes list on success
- [ ] All text uses `t.companies.*` i18n keys (both es and en)
- [ ] Playwright E2E tests pass for list, detail, and create flows
