# Protected Routes — Delta Spec

## Change
`playwright-e2e`

## Feature
Protected route redirect E2E coverage: unauthenticated users are redirected to /login

## Scenarios

### SC-01: Unauthenticated user redirected to /login
- **Given** the user has no active session
- **When** the user navigates to `/dashboard`
- **Then** the URL redirects to `/login`

### SC-02: After login, user reaches dashboard
- **Given** the user has no active session and is redirected from `/dashboard` to `/login`
- **When** the user logs in with valid credentials
- **Then** the URL changes to `/dashboard`

## Edge Cases
- The `ProtectedRoute` component wraps `DashboardLayout` in `App.tsx`
- Redirect happens client-side via React Router's `<Navigate>`
- Current implementation does NOT include a `?redirect` query parameter (the spec describes actual behavior, not idealized)
