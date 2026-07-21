# Form Validation — Delta Spec

## Change
`playwright-e2e`

## Feature
Form validation E2E coverage: inline errors on required fields, invalid email, and weak password

## Scenarios

### SC-01: Empty registration form shows inline errors
- **Given** the user navigates to `/register`
- **When** the user clicks submit without filling any fields
- **Then** the form shows inline validation errors via `[role="alert"]` elements
- **And** at least one error is visible

### SC-02: Invalid email format shows validation error
- **Given** the user navigates to `/register`
- **When** the user fills all fields with valid data except email set to `not-an-email`
- **And** submits the form
- **Then** an inline validation error for the email field is visible

### SC-03: Weak password shows validation error
- **Given** the user navigates to `/register`
- **When** the user fills all fields with valid data except password set to `weak`
- **And** submits the form
- **Then** an inline validation error for the password field is visible

## Test Data
- Validation is Zod-based on the frontend (registerSchema)
- Backend also validates but frontend validation triggers first
- Error elements use `[role="alert"]` rendered by InputForm component
