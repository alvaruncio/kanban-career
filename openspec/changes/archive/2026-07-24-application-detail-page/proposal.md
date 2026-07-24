# Proposal: Application Detail Page

## Intent

KanbanCards show a summary (title, company, status badge). Users need to view and edit all application fields without bouncing to a modal. Opening `/application/:id` provides a dedicated one-column detail view inspired by Jira/Trello where every field is editable inline, matching the `/profile` pattern.

## Scope

### In Scope
- New `GET /api/v1/applications/:id` backend endpoint returning full `ApplicationKanbanDTO` (with company relation)
- New `ApplicationDetailPage` at `/application/:id` route (lazy-loaded, under `DashboardLayout`)
- Inline-editable fields: job title, company, status, category, source, application date, offer URL, job description, notes
- Read-only metadata display: created at, updated at
- `KanbanCard` wrapped in `<Link to={/application/${id}}>` for navigation from `/kanban`
- Back to Kanban navigation button
- New i18n keys for page title, field labels, and actions
- PageMeta for SEO

### Out of Scope
- Activity log / audit trail for field changes
- Delete action from detail page (available in Kanban context)
- Drag-and-drop status change on detail page
- Rich text or markdown for job description / notes

## Capabilities

### New Capabilities
- `application-detail`: Application detail view with inline editing, full field display, and navigation from kanban board

### Modified Capabilities
- None

## Approach

**Backend**: Add `findById` to `ApplicationService` (with userId ownership check) → update `ApplicationRepository.findById` to `include: { company: { select: { id, name, website } } }` → add `getById` to `ApplicationController` → register `GET /:id` route in `application.routes.js`.

**Frontend**: Create `pages/ApplicationDetailPage/ApplicationDetailPage.tsx` with Zustand store read for the single application (or fetch on mount). Use react-hook-form + Zod + InputForm for inline editing via existing PATCH endpoint. Wrap `KanbanCard` in `<Link>` from react-router-dom. Add i18n keys for all field labels and page title. Follow DESIGN.md: one-column layout, `bg-surface-container-lowest` card, `rounded-xl` container, `rounded-lg` inputs, property-specific transitions, Geist + Inter typography, 4/8px spacing grid.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/repositories/application/application.repository.js` | Modified | `findById` adds `include: { company }` |
| `backend/src/services/application/application.service.js` | Modified | Add `getById(id, userId)` with ownership check |
| `backend/src/controllers/application/application.controller.js` | Modified | Add `getById` static method |
| `backend/src/routes/application/application.routes.js` | Modified | Add `GET /:id` route |
| `frontend/src/App.tsx` | Modified | Add lazy route for `/application/:id` |
| `frontend/src/pages/ApplicationDetailPage/` | New | Detail page component, barrel export |
| `frontend/src/pages/index.ts` | Modified | Export `ApplicationDetailPage` |
| `frontend/src/components/KanbanCard/KanbanCard.tsx` | Modified | Wrap card body in `<Link>` |
| `frontend/src/locales/types/types.ts` | Modified | Add `applicationDetail` section |
| `frontend/src/locales/es/es.ts` | Modified | Spanish translations |
| `frontend/src/locales/en/en.ts` | Modified | English translations |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `findById` without include breaks existing caller | Low | All callers only check `id`/`userId`, no company access needed for ownership checks |
| Zod schema validation not matching PATCH expectation | Low | Existing `validateUpdateApplication` middleware already handles PATCH body — reuse directly |

## Rollback Plan

1. Revert `frontend/src/App.tsx` route addition.
2. Revert backend route in `application.routes.js`.
3. Revert `KanbanCard` Link wrapper.
4. Delete new `ApplicationDetailPage` folder.
5. No DB migrations involved — zero data risk.

## Dependencies

- None.

## Success Criteria

- [ ] Clicking a KanbanCard navigates to `/application/:id` with correct application data
- [ ] All 9 editable fields render with current values and can be saved via PATCH
- [ ] Created/updated timestamps display correctly (read-only)
- [ ] Back to Kanban button returns to `/kanban` with fresh data
- [ ] Page matches DESIGN.md: tonel elevation, Geist+Inter, property-specific transitions
- [ ] Spanish and English translations present for all labels
