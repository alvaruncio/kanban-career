# User Profile Specification

## Purpose

Authenticated users MUST view and edit their own profile, manage social links, and change their password from `/profile`.

## Requirements

### Requirement: Profile Display

#### Scenario: All fields visible

- GIVEN the user is authenticated with all fields filled
- WHEN navigating to `/profile`
- THEN name, email, avatar_url, bio, linkedin_url, website, phone, created_at, and role are displayed

#### Scenario: Empty optional fields

- GIVEN the user has NOT set bio, linkedin_url, website, phone, or avatar_url
- WHEN navigating to `/profile`
- THEN each empty field shows a "Not set" indicator

### Requirement: Inline Editing

#### Scenario: Enter edit mode

- GIVEN the user is viewing their profile
- WHEN clicking the edit button
- THEN name, email, bio, linkedin_url, website, and phone become editable inputs

#### Scenario: Cancel reverts

- GIVEN the user modified fields in edit mode
- WHEN clicking cancel
- THEN fields revert to original values and the page returns to view mode

### Requirement: Field Validation

#### Scenario: Invalid email

- GIVEN the user is in edit mode
- WHEN the email contains an invalid format
- THEN an inline error appears and the form cannot submit

#### Scenario: Invalid URL

- GIVEN the user is in edit mode
- WHEN linkedin_url or website has an invalid URL
- THEN an inline error appears and the form cannot submit

#### Scenario: Valid data accepted

- GIVEN the user is in edit mode
- WHEN all fields have valid formats
- THEN no validation errors appear

### Requirement: Save and Cancel

#### Scenario: Save persists

- GIVEN the user is in edit mode with valid changes
- WHEN clicking save
- THEN a PATCH /auth/me is sent and the page shows updated values with success notification

#### Scenario: Network error

- GIVEN the user is in edit mode with valid changes
- WHEN the save request fails
- THEN an error notification is shown and the user remains in edit mode

### Requirement: Password Change

#### Scenario: Success

- GIVEN the user is on the profile page
- WHEN entering correct current password, a new valid password (min 8 chars, uppercase, lowercase, number, symbol), and matching confirmation
- THEN the password is updated with a success notification

#### Scenario: Wrong current password

- GIVEN the user is on the profile page
- WHEN the current password is incorrect
- THEN an error is shown and the password is not changed

#### Scenario: Weak new password

- GIVEN the user is on the profile page
- WHEN the new password does not meet complexity rules
- THEN inline validation describes missing requirements and the password is not changed

#### Scenario: Confirmation mismatch

- GIVEN the user is on the profile page
- WHEN confirmNewPassword does not match newPassword
- THEN an inline error is shown and the password is not changed

### Requirement: PATCH /auth/me Endpoint

| Condition | Body | Response |
|-----------|------|----------|
| Update fields | `{ name, email, bio, linkedin_url, website, phone }` | 200 + user |
| Change password | `{ currentPassword, newPassword, confirmNewPassword }` | 200 + user |
| Zod error | Invalid email, weak password | 400 + errors |
| Wrong current password | `{ currentPassword: "wrong" }` | 401 |
| Unauthenticated | No cookie | 401 |

#### Scenario: Update fields

- GIVEN the user is authenticated
- WHEN PATCH /auth/me includes all optional fields
- THEN all fields are updated and the response returns the user (no password)

#### Scenario: Change password

- GIVEN the user is authenticated
- WHEN PATCH /auth/me includes valid password data
- THEN the password hash is updated and the response returns the user (no password)

### Requirement: Header Navigation

#### Scenario: Perfil link

- GIVEN the user is authenticated
- WHEN clicking "Perfil" in the Header
- THEN the browser navigates to `/profile`
