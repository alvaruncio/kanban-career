# Tasks: Profile Page

## Review Workload Forecast

- Decision needed before apply: Yes (single-pr + >400 lines)
- Chained PRs recommended: Yes (440 > 400)
- Chain strategy: size-exception
- 400-line budget risk: High

## Work Units

**Unit 1: Backend** (~90 lines) — migration, repository, service, controller, route, validator.
**Unit 2: Frontend** (~350 lines) — ProfilePage, service, i18n, header fix, route, E2E tests.

---

## Phase 1: Foundation (Backend)

- [x] **1.1** Prisma migration: add optional fields `avatar_url`, `bio`, `linkedin_url`, `website`, `phone` to User model
- [x] **1.2** Extend Zod schemas in `user.schema.js`: `updateProfileSchema` with new fields + `updatePasswordSchema`
- [x] **1.3** Extend `AuthRepository`: add `static update(id, data)`
- [x] **1.4** Extend `AuthService.me()` select to return new fields
- [x] **1.5** Add `AuthService.updateProfile()` and `AuthService.updatePassword()`
- [x] **1.6** Add `AuthController.updateProfile()` — dispatches to profile update or password change based on body
- [x] **1.7** Add `PATCH /auth/me` route with `requireAuth` + `validateUpdateMe` validator

## Phase 2: Frontend Foundation

- [x] **2.1** Extend `User` interface: add optional `avatarUrl`, `bio`, `linkedinUrl`, `website`, `phone`
- [x] **2.2** Create `ProfileService` with `updateProfile()` and `updatePassword()`
- [x] **2.3** Add i18n translations: `profile` section in `es.ts`, `en.ts`, `types.ts`

## Phase 3: ProfilePage

- [x] **3.1** Create `ProfilePage` in read-only view mode reading from `AuthContext`
- [x] **3.2** Add edit/view toggle — edit button enters edit mode, cancel reverts to original values
- [x] **3.3** Profile edit form with `react-hook-form` + `zodResolver`, validation for email and URLs
- [x] **3.4** Password change section (always editable, independent form): currentPassword, newPassword, confirmNewPassword
- [x] **3.5** Add lazy-loaded route `/profile` under `DashboardLayout` in `App.tsx`
- [x] **3.6** Fix Header: change "Perfil" link from `/dashboard` to `/profile` (desktop + mobile)

## Phase 4: Tests

- [x] **4.1** E2E: Profile display — all fields visible, empty optionals show "Not set"
- [x] **4.2** E2E: Toggle edit mode — inputs appear, cancel reverts to original values
- [x] **4.3** E2E: Field validation — invalid email and invalid URL show inline errors
- [x] **4.4** E2E: Save persists — valid changes sent via PATCH, success notification; network error stays in edit mode
- [x] **4.5** E2E: Password change — success, wrong current password, weak new password, confirmation mismatch
- [x] **4.6** E2E: Header navigation — clicking "Perfil" navigates to `/profile`

## Phase 5: Documentation

- [x] **5.1** Update `backend/docs/openapi.yaml` — add `PATCH /api/v1/auth/me` endpoint with `UpdateProfileRequest` and `UpdatePasswordRequest` schemas, add new `User` fields (`avatarUrl`, `bio`, `linkedinUrl`, `website`, `phone`)

---
