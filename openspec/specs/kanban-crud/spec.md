# Kanban CRUD — Delta Spec

## Change
`playwright-e2e`

## Feature
Kanban board CRUD E2E coverage: create application, drag between columns, and verify persistence

## Scenarios

### SC-01: Create application via "Nueva candidatura" modal
- **Given** the user is logged in with a valid session and has at least one company
- **When** the user navigates to `/kanban`, clicks the create button in the APPLIED column
- **And** fills in the application form (job title, company, category, source, date, description)
- **And** submits the form
- **Then** the modal closes
- **And** a new card appears in the APPLIED column with the submitted job title

### SC-02: Application persists after page reload
- **Given** an application was created in the APPLIED column
- **When** the user reloads the page
- **Then** the application card is still visible in the APPLIED column

### SC-03: Drag card from APPLIED to INTERVIEW column
- **Given** an application card exists in the APPLIED column
- **When** the user drags the card to the INTERVIEW column
- **Then** the card disappears from the APPLIED column
- **And** the card appears in the INTERVIEW column

### SC-04: Drag triggers PATCH API call
- **Given** an application card is dragged to a new column
- **When** the drag operation completes
- **Then** a `PATCH /api/v1/applications/{id}` request is sent with the new status
- **And** the status persists on page reload

## Edge Cases
- Drag-drop uses @dnd-kit custom pointer events, not native HTML5 drag
- Column must exist before dropping (Droppable area)
- Optimistic UI update: card moves immediately, API call is fire-and-forget
