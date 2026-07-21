# Auth — Delta Spec

## Change
`playwright-e2e`

## Feature
Authentication E2E coverage: login and register flows

## Scenarios

### SC-01: Login with valid credentials redirects to dashboard
- **Given** a registered user exists with email `test@example.com` and password `ValidPass1!`
- **When** the user navigates to `/login`, fills in the valid credentials, and submits
- **Then** the URL changes to `/dashboard`
- **And** the dashboard page is visible with the user's greeting

### SC-02: Login with invalid credentials shows error
- **Given** a registered user exists with email `test@example.com`
- **When** the user navigates to `/login`, fills in the wrong password, and submits
- **Then** the URL remains `/login`
- **And** an error alert with `[role="alert"]` is visible

### SC-03: Register with valid data redirects to dashboard
- **Given** a unique email `test-{uuid}@example.com` that does not exist
- **When** the user navigates to `/register`, fills in all required fields, and submits
- **Then** the URL changes to `/dashboard`
- **And** the dashboard page is visible (the app auto-logs in after registration)

### SC-04: Register with existing email shows validation error
- **Given** a user already registered with email `existing@example.com`
- **When** a new registration attempt uses the same email
- **Then** the form shows an inline validation error
- **And** the URL remains `/register`

## Test Data
- Each test run uses a unique email via `test-${uuid()}@example.com`
- Test user is created via API in `beforeAll` and deleted in `afterAll`
