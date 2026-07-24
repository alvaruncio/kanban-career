# Application Detail Specification

## Purpose

Define the backend endpoint and frontend page for viewing and editing a single job application with inline-editable fields, read-only metadata, and bidirectional navigation between the kanban board and the detail view.

## Requirements

### Requirement: GET Application Detail API

The system MUST expose `GET /api/v1/applications/:id` returning the full `ApplicationKanbanDTO` including the company relation (`id`, `name`, `website`).

The endpoint MUST reject with 404 if the application does not exist or its `userId` does not match the authenticated user.

The endpoint MUST reject with 401 if no valid access token is present (handled by existing `requireAuth` middleware).

#### Scenario: Authenticated user fetches own application

- GIVEN an authenticated user who owns an application with id `abc-123`
- WHEN a GET request is sent to `/api/v1/applications/abc-123`
- THEN the response MUST be 200
- AND the body MUST include all application fields plus `company.id`, `company.name`, `company.website`

#### Scenario: Application not found or not owned

- GIVEN an authenticated user
- WHEN a GET request is sent to `/api/v1/applications/nonexistent-id`
- THEN the response MUST be 404

#### Scenario: Unauthenticated request

- GIVEN no valid access token
- WHEN a GET request is sent to `/api/v1/applications/:id`
- THEN the response MUST be 401

### Requirement: Application Detail Page

The frontend MUST render a dedicated detail view at `/application/:id`, wrapped in `ProtectedRoute`.

The page MUST display all 9 editable fields with their current values: `jobTitle`, `company`, `status`, `category`, `source`, `applicationDate`, `offerUrl`, `jobDescription`, `notes`.

The page MUST display `createdAt` and `updatedAt` as read-only timestamps at the bottom.

The page MUST fetch the application from the GET endpoint on mount.

#### Scenario: Happy path — page loads successfully

- GIVEN the user navigates to `/application/abc-123`
- WHEN the GET request succeeds
- THEN the header SHALL show the job title, company name, and a status badge
- AND all 9 editable fields SHALL render with current values
- AND `createdAt` and `updatedAt` SHALL display as read-only

#### Scenario: Loading state

- WHILE the GET request is in flight
- THEN a loading indicator SHALL be visible

#### Scenario: API error on load

- GIVEN the GET request fails
- THEN an error message SHALL be displayed
- AND the form fields SHALL NOT render

### Requirement: Inline Field Editing

The system MUST allow editing each of the 9 editable fields via react-hook-form with Zod validation.

Saving a field MUST send a PATCH request to the existing update endpoint.

#### Scenario: Successful field save

- GIVEN the detail page displays an existing application
- WHEN the user edits a field and triggers save
- THEN a PATCH request SHALL be sent with the updated field
- AND on success the field SHALL show the new value
- AND a brief success indicator SHALL appear

#### Scenario: Validation failure

- GIVEN the user enters an invalid value
- WHEN the form validates the input
- THEN a validation error SHALL display inline
- AND the PATCH request SHALL NOT be sent

#### Scenario: Network error on save

- GIVEN the user edits a field
- WHEN the PATCH request fails
- THEN an error message SHALL display
- AND the field SHALL retain its previous value

### Requirement: Navigation

The system MUST provide bidirectional navigation: KanbanCard → detail page → kanban board.

Each KanbanCard MUST be wrapped in `<Link to={/application/${id}}>`.

The detail page MUST include a "Back to Kanban" button that navigates to `/kanban`.

#### Scenario: Navigate from KanbanCard

- GIVEN the kanban board displays application cards
- WHEN the user clicks a KanbanCard
- THEN the browser navigates to `/application/{card-id}`

#### Scenario: Back to Kanban from detail

- GIVEN the user is on the application detail page
- WHEN the user clicks "Back to Kanban"
- THEN the browser navigates to `/kanban`

### Requirement: Internationalization

All visible text on the detail page MUST use i18n keys via `useI18nStore`.

The following MUST be translated in both Spanish (primary) and English (secondary): page title and subtitle, all 10 field labels, save/cancel button labels, success/error messages, back-to-kanban label, normalized source labels, and status labels.

#### Scenario: Spanish locale

- GIVEN the active locale is Spanish
- WHEN the detail page renders
- THEN all field labels SHALL display in Spanish

#### Scenario: English locale

- GIVEN the active locale is English
- WHEN the detail page renders
- THEN all field labels SHALL display in English