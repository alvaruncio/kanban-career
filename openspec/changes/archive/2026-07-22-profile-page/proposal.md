# Proposal: Profile Page

## Intent

Users cannot view or edit their profile data (bio, avatar, social links, phone) or change their password. The sidebar already points to `/profile` but the route does not exist. This change builds the full profile page with inline editing.

## Scope

### In Scope
- Prisma migration: add `avatar_url`, `bio`, `linkedin_url`, `website`, `phone` (all optional) to `User`
- Extend `GET /auth/me` to return the new fields
- New `PATCH /auth/me` endpoint (self-update, no URL param) — name, email, profile fields, plus password change with current-password validation
- Profile page (`/profile`) with view/edit toggle — inline fields, not modal
- Password change form inside profile page
- i18n — section `profile` in `es.ts`, `en.ts`, `types.ts`
- Fix Header "Perfil" link: `/dashboard` → `/profile`
- Extend `User` interface with new optional fields

### Out of Scope
- Dashboard stats (belongs in DashboardPage)
- Avatar file upload — uses URL string only
- Registration form changes (new fields remain optional)
- Admin user management (covered by existing `PATCH /users/:id`)

## Capabilities

### New Capabilities
- `user-profile`: View and edit own profile, change password, manage social links and bio

### Modified Capabilities
- None

## Approach

**Backend:** Add optional columns via Prisma migration. Extend `AuthService.me()` select to include new fields. Create `updateProfileSchema` + `updatePasswordSchema` in `schemas/user/user.schema.js` (exists already). New validator `validateUpdateProfile` in `validators/user/user.validator.js`. New service method `AuthService.updateProfile(userId, data)`. New controller `AuthController.updateProfile`. Route: `PATCH /auth/me` with `requireAuth` + validator. For password change, verify `currentPassword` against bcrypt hash, then hash and save `newPassword`.

**Frontend:** New page `ProfilePage/ProfilePage.tsx` under `DashboardLayout` (protected). Toggle state: `isEditing` — when false, render fields as `<p>` text; when true, render `<InputForm>` components. Password section always editable below profile fields. Form with `react-hook-form` + `zodResolver`. i18n keys under `t.profile.*`. Lazy-loaded route in `App.tsx`. New service `ProfileService` (or extend `AuthService` in frontend services layer).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modified | Add 5 optional fields to User model |
| `backend/src/services/auth/auth.service.js` | Modified | Add `updateProfile()`, extend `me()` select |
| `backend/src/controllers/auth/auth.controller.js` | Modified | Add `updateProfile` static method |
| `backend/src/routes/auth/auth.routes.js` | Modified | Add `PATCH /me` route |
| `backend/src/schemas/user/user.schema.js` | Modified | Add `updateProfile` + `updatePassword` schemas |
| `frontend/src/pages/ProfilePage/` | New | Page component |
| `frontend/src/App.tsx` | Modified | Add `/profile` route |
| `frontend/src/components/Header/Header.tsx` | Modified | Fix profile link |
| `frontend/src/interfaces/auth/auth.ts` | Modified | Add new optional fields to `User` |
| `frontend/src/locales/types/types.ts` | Modified | Add `profile` section |
| `frontend/src/locales/es/es.ts` | Modified | Add profile translations |
| `frontend/src/locales/en/en.ts` | Modified | Add profile translations |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Existing `PATCH /users/:id` flow conflict | Low | New `PATCH /auth/me` is a separate route on `authRouter`, no overlap |

## Rollback Plan

1. Revert Prisma migration: `prisma migrate reset` or create a down-migration
2. Revert route addition in `auth.routes.js`
3. Revert frontend files: `App.tsx`, `Header.tsx`, locale files, remove `ProfilePage/` folder

## Dependencies

- Prisma migration requires running `npx prisma migrate dev` against the running DB

## Success Criteria

- [ ] User can view all profile fields on `/profile`
- [ ] User can toggle to edit mode, save changes, and see them reflected
- [ ] User can change password with current-password validation
- [ ] `GET /auth/me` returns all new profile fields
- [ ] Header "Perfil" link navigates to `/profile`, not `/dashboard`
