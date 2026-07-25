# Design: Companies Section

## Technical Approach

Add `GET /:id` and `PATCH /:id` to the existing companies router with ownership guard (same `ApplicationService` pattern). Build two frontend pages — list (`/companies`) and detail (`/companies/:id`) — plus a create modal. Related apps on the detail page fetched via `GET /applications?companyId=X`. Sidebar migrated to i18n with left-border accent on active link.

## Architecture Decisions

### Decision: Ownership guard follows ApplicationService pattern

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Guard in repository | Cleaner service, but deviates from codebase convention | Rejected — all existing services do ownership checks |
| `Service.getById(id, userId)` checks ownership, returns null | Follows convention, 404 handled in controller | **Chosen** — matches `ApplicationService.getById/update` |

### Decision: Related applications via optional `?companyId` param on existing GET /applications

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Filter from store | May not be loaded on companies page | Rejected — unreliable data |
| New backend endpoint + repo method | More code, but always fresh data | **Chosen** — add `companyId` param to existing GET, extend `findAllByUserId` with optional filter |

### Decision: View/edit toggle follows ApplicationDetailPage pattern

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Inline per-field edit | Complex state, non-standard | Rejected |
| Toggle to full form with react-hook-form + Zod | Proven pattern in codebase | **Chosen** — matches ApplicationDetailPage exactly |

## Data Flow

```
Browser ──→ /companies ──→ App.tsx ──→ DashboardLayout ──→ CompaniesPage
                │                                                    │
           CardGrid ──→ Link to /companies/{id}               CreateCompanyModal
                                                                    │
Browser ──→ /companies/:id ──→ CompanyDetailPage              CompanyService.create()
                │                      │                              │
          CompanyService           ApplicationService           CompanyRepository.create()
           .getById(id)            .getByCompanyId(id)                │
                │                      │                         api.post(/companies)
           CompanyRepository      ApplicationRepository
           .findById(id)           .findByCompanyId(id)
                │                      │
          api.get(/companies/:id)  api.get(/applications?companyId=X)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/schemas/company/company.schema.js` | Modify | Add `updateCompanySchema` — same shape as `createCompanySchema` but all fields optional |
| `backend/src/schemas/index.js` | Modify | Export `updateCompanySchema` |
| `backend/src/validators/company/company.validator.js` | Modify | Add `validateUpdateCompany` — same pattern as `validateCreateCompany` |
| `backend/src/validators/index.js` | Modify | Export `validateUpdateCompany` |
| `backend/src/repositories/company/company.repository.js` | Modify | Add `findById(id)`, `update(id, data)` — both with `deletedAt: null` guard |
| `backend/src/services/company/company.service.js` | Modify | Add `getById(id, userId)` returning null if not owned/deleted; `update(id, userId, data)` with same guard |
| `backend/src/controllers/company/company.controller.js` | Modify | Add `getById(req, res)` — 404 if null; `update(req, res)` — 404 if null |
| `backend/src/routes/company/company.routes.js` | Modify | Add `GET /:id` and `PATCH /:id` with `requireAuth` + validators |
| `backend/src/repositories/application/application.repository.js` | Modify | Extend `findAllByUserId` to accept optional `companyId` filter |
| `frontend/src/interfaces/company/company.ts` | Modify | Extend `CompaniesState` with `company`, `getById`, `updateCompany`, `createCompany` |
| `frontend/src/repositories/CompanyRepository/CompanyRepository.ts` | Modify | Add `findById`, `update`, `create` |
| `frontend/src/services/CompanyService/CompanyService.ts` | Modify | Add `getById`, `update`, `create` |
| `frontend/src/stores/companiesStore/companiesStore.ts` | Modify | Add `company` field, `getById`, `updateCompany`, `createCompany` actions |
| `frontend/src/repositories/ApplicationRepository/ApplicationRepository.ts` | Modify | Add `findByCompanyId(companyId)` — calls `api.get('/applications', { params: { companyId } })` |
| `frontend/src/services/ApplicationService/ApplicationService.ts` | Modify | Add `getByCompanyId(companyId)` |
| `frontend/src/pages/CompaniesPage/CompaniesPage.tsx` | Create | Card grid list page with floating add button |
| `frontend/src/pages/CompaniesPage/index.ts` | Create | Barrel re-export |
| `frontend/src/pages/CompanyDetailPage/CompanyDetailPage.tsx` | Create | Detail/edit page + related applications list |
| `frontend/src/pages/CompanyDetailPage/index.ts` | Create | Barrel re-export |
| `frontend/src/pages/index.ts` | Modify | Export both new pages |
| `frontend/src/App.tsx` | Modify | Add lazy routes `/companies` and `/companies/:id` |
| `frontend/src/components/CreateCompanyModal/CreateCompanyModal.tsx` | Create | Modal overlay with react-hook-form + Zod, calls `createCompany()` |
| `frontend/src/components/index.ts` | Modify | Export `CreateCompanyModal` |
| `frontend/src/layouts/DashboardLayout/DashboardLayout.tsx` | Modify | i18n labels via `t.nav.*`, left border accent on active link |
| `frontend/src/locales/types/types.ts` | Modify | Add `companies` section and `nav.*` dashboard/kanban/applications/companies/profile keys |
| `frontend/src/locales/es/es.ts` | Modify | Spanish translations for `companies.*` and `nav.*` |
| `frontend/src/locales/en/en.ts` | Modify | English translations for `companies.*` and `nav.*` |
| `frontend/tests/specs/companies/companies.spec.ts` | Create | E2E spec for list, detail/edit, create modal flows |
| `frontend/tests/page-objects/CompaniesListPage.ts` | Create | POM for companies list page |
| `frontend/tests/page-objects/CompanyDetailPage.ts` | Create | POM for company detail page |
| `frontend/tests/fixtures/index.ts` | Modify | Add `companiesListPage` and `companyDetailPage` fixtures |

## Interfaces / Contracts

```typescript
// CompaniesState extension
interface CompaniesState {
  companies: Company[]
  company: Company | null          // NEW — single company for detail page
  isLoading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
  getById: (id: string) => Promise<void>          // NEW — fetches single company
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>  // NEW
  createCompany: (data: CreateCompanyDTO) => Promise<void>              // NEW
}

// Backend PATCH body — all optional
interface UpdateCompanyDTO {
  name?: string
  website?: string
  linkedinUrl?: string
  description?: string
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E | List page renders cards, empty state, loading, error | Playwright with seed data + API mock |
| E2E | Detail page view mode shows fields | Navigate, assert all fields rendered |
| E2E | Edit fields and save | Click edit, modify, save, assert success + refetch |
| E2E | Create modal flow | Open modal, fill form, submit, assert modal closes + card appears |
| E2E | Sidebar navigation | Click "Empresas" link from dashboard, assert URL `/companies` |
| E2E | 404 state on detail | Navigate to `/companies/non-existent`, assert error + back link |
| E2E | Validation blocks invalid data | Enter invalid URL in form, assert inline error |

## Threat Matrix

N/A — no shell, subprocess, VCS/PR automation, executable classification, or process integration changes. Standard CRUD with React Router navigation.

## Migration / Rollout

No migration required. No DB schema changes. Backend endpoints are additive — existing code paths unchanged.

## Open Questions

- [ ] Confirm `connectedApplications` on the company detail page uses `ApplicationService.getByCompanyId()` (Option B) or whether filtering from the existing store is acceptable for MVP — design assumes Option B for reliability.
