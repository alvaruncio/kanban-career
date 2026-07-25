# Companies Section Specification

## Purpose

Dedicated company management: backend endpoints for single-company read/update, frontend pages for list/detail/edit, modal creation, sidebar nav with i18n, and E2E coverage.

## Requirements

### R1: GET /companies/:id

The system MUST return a single company by ID for the authenticated user. It MUST verify ownership (`userId` matches JWT) and exclude soft-deleted companies (`deletedAt !== null`). Returns 404 if not found or not owned.

#### Scenario: Happy path — returns owned company
- GIVEN a company owned by the authenticated user with `deletedAt: null`
- WHEN `GET /api/v1/companies/{id}` is called with a valid JWT
- THEN the response status is 200 with the company JSON object

#### Scenario: Not found — returns 404
- GIVEN a non-existent id or a company not owned by the user
- WHEN `GET /api/v1/companies/{id}` is called
- THEN the response status is 404 with `{ error: string }`

#### Scenario: Soft-deleted company excluded
- GIVEN a company with `deletedAt !== null`
- WHEN the owner calls `GET /api/v1/companies/{id}`
- THEN the response status is 404 (treated as not found)

### R2: PATCH /companies/:id

The system MUST update allowed fields (`name`, `website`, `description`, `linkedinUrl`) for an owned, non-deleted company. All fields are optional (partial update). Returns 404 if not found/owned, 400 if Zod validation fails.

#### Scenario: Happy path — updates allowed fields
- GIVEN an owned company
- WHEN `PATCH /api/v1/companies/{id}` is sent with `{ name: "New Name", website: "https://new.com" }`
- THEN the response is 200 with the updated company (other fields unchanged)

#### Scenario: Returns 404 for unowned company
- GIVEN a company owned by another user
- WHEN `PATCH /api/v1/companies/{id}` is called with valid data
- THEN the response is 404

#### Scenario: Returns 400 for invalid data
- GIVEN an owned company
- WHEN `PATCH /api/v1/companies/{id}` is sent with `{ website: "not-a-url" }`
- THEN the response is 400 with validation error details

### R3: Companies List Page (/companies)

The system MUST render a protected page at `/companies` showing all user companies in a responsive card grid. Cards MUST display name (headline-md), website/linkedin links, description (line-clamp-2). Card styling MUST use `bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm` and `hover:shadow-md hover:border-primary`. Empty/loading/error states MUST be handled.

#### Scenario: Renders company cards
- GIVEN the user has 3 companies
- WHEN navigating to `/companies`
- THEN 3 cards are rendered with name, links, and description

#### Scenario: Card navigates to detail page
- GIVEN a company card is rendered
- WHEN clicking the card
- THEN the browser navigates to `/companies/{id}`

#### Scenario: Shows empty state
- GIVEN the user has 0 companies
- WHEN navigating to `/companies`
- THEN an empty state message is shown (uses `t.companies.noCompanies`)

#### Scenario: Shows loading skeleton
- GIVEN the fetch is in progress
- WHEN the page is mounting
- THEN `LoadingSkeleton` (spinner) is visible

#### Scenario: Shows error state
- GIVEN the API returns an error
- WHEN the page loads
- THEN an error message is shown (uses `t.companies.fetchError`)

### R4: Company Detail Page (/companies/:id)

The system MUST render a protected detail page with view/edit toggle. View mode shows company fields, related applications list (fetched separately from `ApplicationService`), timestamps. Edit mode uses react-hook-form + Zod with name (required), website, linkedinUrl, description. Save calls PATCH, refetches, shows success/error messages. Follows `ApplicationDetailPage` pattern.

#### Scenario: View mode shows company fields
- GIVEN an existing company with related applications
- WHEN navigating to `/companies/{id}`
- THEN view mode displays name, website, LinkedIn URL, description, timestamps, and related applications list

#### Scenario: Related app links to application detail
- GIVEN a related application is listed
- WHEN clicking on it
- THEN the browser navigates to `/application/{id}`

#### Scenario: Edit toggle switches to form
- GIVEN the detail page is in view mode
- WHEN clicking "Editar" button
- THEN the view switches to edit form with pre-filled values

#### Scenario: Save updates and refetches
- GIVEN the edit form is open
- WHEN changing the name and clicking "Guardar cambios"
- THEN PATCH is called, success message appears, form returns to view mode with updated name

#### Scenario: Cancel reverts to view
- GIVEN the edit form is open with unsaved changes
- WHEN clicking "Cancelar"
- THEN the form closes and view mode shows original values

#### Scenario: Shows 404 for non-existent company
- GIVEN a non-existent or unowned company id
- WHEN navigating to `/companies/{id}`
- THEN an error message is shown with a "Volver a empresas" link

### R5: Create Company Modal

The system MUST provide a modal overlay from the companies list page. Form uses react-hook-form + Zod with name (required), website, linkedinUrl, description. Calls `POST /companies`. On success, closes modal and refreshes list. On error, shows error inside the modal.

#### Scenario: Opens modal from list page
- GIVEN the companies list page
- WHEN clicking the "Añadir empresa" button
- THEN a modal opens with the create form

#### Scenario: Creates company and refreshes list
- GIVEN the create modal is open
- WHEN filling all fields and submitting
- THEN POST returns 201, modal closes, company list is refreshed with the new company

#### Scenario: Validates required name field
- GIVEN the create modal is open
- WHEN submitting with empty name
- THEN inline validation error is shown, modal stays open, no POST is sent

#### Scenario: Shows server error in modal
- GIVEN the create modal is open
- WHEN submitting and the API returns an error
- THEN the error message is shown inside the modal

#### Scenario: Cancel closes modal
- GIVEN the create modal is open
- WHEN clicking "Cancelar" or pressing Escape
- THEN the modal closes without creating

### R6: Sidebar Navigation

The sidebar MUST use i18n keys `t.nav.*` for all links (dashboard, kanban, applications, companies, profile). Active state: `bg-primary-container text-on-primary-container`. Hover: `hover:bg-surface-container hover:text-on-surface`. Inactive: `text-on-surface-variant`. A left border accent MUST indicate the active link. Icons and spacing MUST follow DESIGN.md (gap-md, p-md, font-label-md).

#### Scenario: All nav labels use i18n
- GIVEN the sidebar is rendered
- THEN labels for Dashboard, Kanban, Applications, Companies, Profile use `t.nav.*` keys (not hardcoded text)

#### Scenario: Active link has left accent
- GIVEN the user is on `/companies`
- THEN the Companies link has a left border accent and `bg-primary-container` styling

#### Scenario: Navigation works
- GIVEN the sidebar is visible
- WHEN clicking any link
- THEN the browser navigates to the corresponding route

### R7: i18n — Companies Section and Nav

The system MUST provide all `t.companies.*` keys in `es.ts` and `en.ts` (title, pageDescription, create, edit, save, cancel, saving, saved, saveError, fetchError, createdAt, updatedAt, backToCompanies, noCompanies, relatedApplications, viewApplication). Nav labels MUST be migrated to `t.nav.*` (dashboard, kanban, applications, companies, profile).

#### Scenario: Nav keys in Translation interface
- GIVEN the `Translation` interface in `types.ts`
- THEN it includes `nav.dashboard`, `nav.kanban`, `nav.applications`, `nav.companies`, `nav.profile`

#### Scenario: Companies keys in locale files
- GIVEN `es.ts` and `en.ts`
- THEN both files contain all `t.companies.*` keys with correct translations

### R8: TDD — Playwright E2E

Spec MUST include `companies.spec.ts` with `CompaniesListPage` and `CompanyDetailPage` page objects. Fixtures MUST include both page objects. Tests MUST cover list display, detail view/edit, create modal flow, sidebar navigation, and error states (API failure, 404).

#### Scenario: List page E2E
- GIVEN authenticated user with seeded companies
- WHEN navigating to `/companies`
- THEN cards are visible with correct content, clicking navigates to detail

#### Scenario: Detail page view/edit E2E
- GIVEN an authenticated user with a seeded company
- WHEN on the detail page, clicking edit, changing name, saving
- THEN the saved name is displayed, success message appears

#### Scenario: Create modal E2E
- GIVEN an authenticated user on the companies list page
- WHEN opening the modal and creating a company
- THEN the modal closes and the new company card appears in the list

#### Scenario: Sidebar navigation E2E
- GIVEN an authenticated user is on `/dashboard`
- WHEN clicking the "Empresas" sidebar link
- THEN the browser navigates to `/companies`

#### Scenario: Error states E2E
- GIVEN an authenticated user
- WHEN the companies API returns 500
- THEN the error message is displayed
- WHEN navigating to a non-existent company detail
- THEN the 404 message is displayed with "Volver a empresas" link
