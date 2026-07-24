# Design: Application Detail Page

## Technical Approach

Add a `GET /:id` backend endpoint returning the full `ApplicationKanbanDTO`, then build a detail page at `/application/:id` with inline editing via react-hook-form + Zod, following the ProfilePage toggle pattern. KanbanCard wraps in `<Link>` for navigation. No new stores, no new DB migrations.

## Architecture Decisions

### Decision: Always fetch from GET /:id on mount (not from store)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Read from Zustand store | Instant render, but stale/direct-navigation fails | Rejected — spec says fetch from endpoint |
| Fetch from GET /:id | 1 extra round-trip, always fresh data, works on direct URL | **Chosen** — same cost as store hydration |

**Rationale**: The store may be empty if user navigates directly to `/application/:id`. The service/repository layers already exist — adding `findById` is 10 lines total.

### Decision: ProfilePage toggle pattern for inline editing

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Per-field inline edit | More complex state, non-standard | Rejected — diverges from codebase |
| Edit/Save toggle (ProfilePage) | Single toggle, full form submit, validated | **Chosen** — proposal says "matching the /profile pattern" |

**Rationale**: Existing ProfilePage pattern is proven, uses the same `react-hook-form` + `InputForm`/`SelectForm`/`TextareaForm` components, and keeps review scope tight.

### Decision: Reuse updateApplication via store

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Direct `api.patch` in page | Skips store, board doesn't update | Rejected — stale Kanban on return |
| Store `updateApplication()` | Board auto-updates, atomic state | **Chosen** — existing method already calls PATCH + set |

**Rationale**: `useApplicationsStore.updateApplication(id, data)` already calls `api.patch` and updates the local `applications` array. Reusing it keeps the Kanban board consistent without re-fetch.

## Data Flow

```
Browser ──→ /application/:id ──→ App.tsx (lazy) ──→ DashboardLayout
                                                       │
                                              ApplicationDetailPage
                                                  │         │
                                           ┌─────┘         └──────┐
                                           ▼                      ▼
                                  ApplicationService        useApplicationsStore
                                   .getById(id)              .updateApplication(id)
                                           │                      │
                                           ▼                      ▼
                                  ApplicationRepository        api.patch()
                                    .findById(id)
                                           │
                                           ▼
                                     api.get()
                                    /applications/:id
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/repositories/application/application.repository.js` | Modify | `findById` adds `include: { company: { select: { id, name, website } } }` |
| `backend/src/services/application/application.service.js` | Modify | Add `getById(id, userId)` with ownership check — same pattern as `update` |
| `backend/src/controllers/application/application.controller.js` | Modify | Add `getById(req, res)` — returns 404 if not found, 200 with data |
| `backend/src/routes/application/application.routes.js` | Modify | Add `GET /:id` with `requireAuth` middleware |
| `frontend/src/pages/ApplicationDetailPage/ApplicationDetailPage.tsx` | Create | Detail page with view/edit toggle, 9 editable fields, 2 read-only timestamps |
| `frontend/src/pages/ApplicationDetailPage/index.ts` | Create | Barrel re-export |
| `frontend/src/pages/index.ts` | Modify | Add barrel export for `ApplicationDetailPage` |
| `frontend/src/App.tsx` | Modify | Add lazy route `/application/:id` under `ProtectedRoute` + `DashboardLayout` |
| `frontend/src/components/KanbanCard/KanbanCard.tsx` | Modify | Wrap card body in `<Link to={/application/${id}}>` — card becomes clickable |
| `frontend/src/services/ApplicationService/ApplicationService.ts` | Modify | Add `getById(id)` static method |
| `frontend/src/repositories/ApplicationRepository/ApplicationRepository.ts` | Modify | Add `findById(id)` static method — `api.get<ApplicationKanbanDTO>(\`/applications/${id}\`)` |
| `frontend/src/locales/types/types.ts` | Modify | Add `applicationDetail` section in `Translation` interface |
| `frontend/src/locales/es/es.ts` | Modify | Spanish translations for `applicationDetail` |
| `frontend/src/locales/en/en.ts` | Modify | English translations for `applicationDetail` |
| `frontend/src/services/index.ts` | Verify | Barrel already re-exports `ApplicationService` — likely no change needed |

## Interfaces / Contracts

Backend `GET /:id` response shape matches existing `ApplicationKanbanDTO`:

```typescript
// No new interfaces — reuses:
interface ApplicationKanbanDTO {
  id: string
  jobTitle: string
  jobDescription: string
  offerUrl: string
  companyId: string
  userId: number
  status: ApplicationStatus
  category: ApplicationCategory
  applicationDate: string
  source: ApplicationSource
  notes?: string | null
  createdAt: string
  updatedAt: string
  company: { id: string; name: string; website?: string | null }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E | Navigate from KanbanCard → detail page | Playwright: click card, assert URL `/application/:id`, assert job title visible |
| E2E | Page loads with all fields | Playwright: GET each editable field value, assert rendered |
| E2E | Edit field and save | Playwright: click edit, modify field, save, assert success + value persisted |
| E2E | Validation blocks invalid data | Playwright: enter invalid URL, assert error message, assert no PATCH sent |
| E2E | Back to Kanban navigation | Playwright: click back button, assert URL `/kanban` |
| E2E | Loading state | Playwright: intercept slow response, assert LoadingSkeleton visible |
| E2E | Error state | Playwright: mock 500, assert error message rendered |

## Threat Matrix

N/A — no shell, subprocess, VCS/PR automation, executable classification, or process integration changes. Standard CRUD feature with React Router navigation (JS-level routing).

## Migration / Rollout

No migration required. No data schema changes. Feature is additive — old code paths remain intact.

## Open Questions

None.
