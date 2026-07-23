# Delta for user-profile

## MODIFIED Requirements

### Requirement: Inline Editing

(Previously: edit mode fields did not include avatar_url)

#### Scenario: Enter edit mode

- GIVEN the user is viewing their profile
- WHEN clicking the edit button
- THEN name, email, bio, linkedin_url, website, phone, and avatar_url become editable inputs

#### Scenario: Cancel reverts

- GIVEN the user modified fields in edit mode
- WHEN clicking cancel
- THEN fields revert to original values and the page returns to view mode

### Requirement: Field Validation

(Previously: Invalid URL scenario only covered linkedin_url and website)

#### Scenario: Invalid email

- GIVEN the user is in edit mode
- WHEN the email contains an invalid format
- THEN an inline error appears and the form cannot submit

#### Scenario: Invalid URL

- GIVEN the user is in edit mode
- WHEN linkedin_url, website, or avatar_url has an invalid URL
- THEN an inline error appears and the form cannot submit

#### Scenario: Valid data accepted

- GIVEN the user is in edit mode
- WHEN all fields have valid formats
- THEN no validation errors appear

### Requirement: PATCH /auth/me Endpoint

(Previously: update fields body did not include avatar_url)

| Condition | Body | Response |
|-----------|------|----------|
| Update fields | `{ name, email, bio, linkedin_url, website, phone, avatar_url }` | 200 + user |
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

## ADDED Requirements

### Requirement: Default Avatar on Registration

The system MUST assign a default avatar URL when creating any user. This is enforced at the database level via Prisma `@default`.

#### Scenario: New user gets default avatar

- GIVEN a user registers with valid credentials
- THEN the user's `avatarUrl` is `https://www.svgrepo.com/svg/335455/profile-default`

#### Scenario: Admin creates user gets default avatar

- GIVEN an admin creates a new user via the users endpoint
- THEN the new user's `avatarUrl` is `https://www.svgrepo.com/svg/335455/profile-default`

### Requirement: Avatar Image Rendering

The system MUST render the avatar as an `<img>` in profile view mode with a graceful fallback chain.

#### Scenario: Custom avatar URL displays

- GIVEN the user has set a custom avatar URL
- WHEN viewing their profile
- THEN an `<img>` element renders with the custom URL as `src`

#### Scenario: Default avatar when none set

- GIVEN the user has NOT set a custom avatar
- WHEN viewing their profile
- THEN an `<img>` element renders with the default URL as `src`

#### Scenario: Broken custom URL falls back to default

- GIVEN the user has set a custom avatar URL
- AND the custom URL returns a broken image
- THEN the `<img>` shows the default avatar URL instead

#### Scenario: Both URLs broken shows text fallback

- GIVEN both the custom URL and the default URL fail to load
- THEN a text message indicating "there should be a user image" is displayed

### Requirement: Avatar URL Validation

The system MUST accept a valid URL or an empty string for the avatar_url field.

#### Scenario: Valid URL accepted

- GIVEN the user is in edit mode
- WHEN avatar_url contains a valid URL such as `https://example.com/avatar.jpg`
- THEN no inline error for avatar_url appears and the form can submit

#### Scenario: Empty avatar_url accepted (falls back to default)

- GIVEN the user is in edit mode
- WHEN avatar_url is empty
- THEN no inline error for avatar_url appears, the form submits, and the view mode shows the default avatar

#### Scenario: Invalid avatar_url rejected

- GIVEN the user is in edit mode
- WHEN avatar_url contains an invalid string such as `not-a-url`
- THEN an inline error for avatar_url appears and the form cannot submit
