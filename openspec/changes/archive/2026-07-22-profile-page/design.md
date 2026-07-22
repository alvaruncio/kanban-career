# Design: Profile Page

## Technical Approach

Single `PATCH /auth/me` endpoint dispatching to profile update or password change based on body content. Frontend `ProfilePage` with view/edit toggle using react-hook-form. All optional User fields (bio, avatar_url, linkedin_url, website, phone) added via Prisma migration and exposed through `GET /auth/me`.

## Architecture Decisions

### Decision: Single PATCH /auth/me vs two endpoints

| Option | Tradeoff |
|--------|----------|
| Single route, validator dispatches by body type | Cleaner API surface, follows existing auth route pattern |
| Split into `PATCH /auth/me` + `PATCH /auth/me/password` | More REST-y but diverges from spec |

**Decision**: Single endpoint. Validator `validateUpdateMe` tries `updateProfileSchema` — if body contains `currentPassword`, validates with `updatePasswordSchema` instead. Sets `req.isPasswordUpdate` flag for controller dispatch.

### Decision: ProfilePage form strategy

| Option | Tradeoff |
|--------|----------|
| Single big form with toggle | Complex validation, tight coupling of profile + password |
| Two separate forms (profile + password) | Simpler per-form state, password always editable as specified |

**Decision**: Two forms. Profile fields use react-hook-form with view/edit toggle. Password section is a separate independent form below, always editable.

### Decision: Update AuthService.me() select vs separate query

| Option | Tradeoff |
|--------|----------|
| Extend me() select to include new fields | Single source of truth, no extra DB call |
| Separate profile query endpoint | More endpoints, auth context needs updating too |

**Decision**: Extend `AuthService.me()` select. `AuthContext` already calls `GET /auth/me` on restore — new fields come for free.

## Data Flow

```
ProfilePage (view mode) → reads user from AuthContext
ProfilePage (edit mode) → ProfileService.updateProfile(data)
  → api.patch('/auth/me', data) → AuthController.updateProfile
  → AuthService.updateProfile(userId, data)
  → AuthRepository.update(id, data) → prisma.user.update()

Password section → ProfileService.updatePassword(data)
  → api.patch('/auth/me', data) → same controller
  → req.isPasswordUpdate → AuthService.updatePassword(userId, data)
  → bcrypt.compare(currentPassword) → bcrypt.hash(newPassword)
  → AuthRepository.update(id, { password: hashed })
```

## File Changes

### Backend

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | Add 5 optional fields to User model |
| `backend/src/repositories/auth/auth.repository.js` | Modify | Add `static update(id, data)` |
| `backend/src/services/auth/auth.service.js` | Modify | Extend `me()` select; add `updateProfile()` and `updatePassword()` |
| `backend/src/controllers/auth/auth.controller.js` | Modify | Add `updateProfile` static method |
| `backend/src/routes/auth/auth.routes.js` | Modify | Add `PATCH /me` route |
| `backend/src/schemas/user/user.schema.js` | Modify | Extend `updateProfileSchema` with bio, avatar_url, linkedin_url, website, phone |
| `backend/src/validators/user/user.validator.js` | Modify | Add `validateUpdateMe` with conditional dispatch |

### Frontend

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/interfaces/auth/auth.ts` | Modify | Add `avatarUrl?`, `bio?`, `linkedinUrl?`, `website?`, `phone?` to User |
| `frontend/src/services/ProfileService/ProfileService.ts` | Create | Static class: `updateProfile()`, `updatePassword()` |
| `frontend/src/services/index.ts` | Modify | Add `ProfileService` export |
| `frontend/src/pages/ProfilePage/ProfilePage.tsx` | Create | Page with view/edit toggle + password section. Uses `useI18nStore`, `react-hook-form`, `zodResolver` |
| `frontend/src/pages/index.ts` | Modify | Add barrel export for `ProfilePage` |
| `frontend/src/App.tsx` | Modify | Add lazy route for `/profile` under `DashboardLayout` |
| `frontend/src/components/Header/Header.tsx` | Modify | Change perfil link `to="/dashboard"` → `to="/profile"` (desktop + mobile) |
| `frontend/src/locales/types/types.ts` | Modify | Add `profile` section to `Translation` |
| `frontend/src/locales/es/es.ts` | Modify | Add profile translations |
| `frontend/src/locales/en/en.ts` | Modify | Add profile translations |

### Tests

| File | Action | Description |
|------|--------|-------------|
| `frontend/tests/specs/profile/profile.spec.ts` | Create | E2E tests covering view, edit validation, save, password change |

## Interfaces / Contracts

**Extend `updateProfileSchema`** (existing `user.schema.js`):
```js
export const updateProfileSchema = z.object({
  name: z.string().trim().min(RULES.NAME.MIN_LENGTH).optional(),
  email: z.email({ pattern: z.regexes.rfc5322Email }).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})
```

**Extended User type** (frontend `interfaces/auth/auth.ts`):
```ts
export interface User {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  avatarUrl?: string
  bio?: string
  linkedinUrl?: string
  website?: string
  phone?: string
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E | Profile display in view mode | Navigate to `/profile` — verify all fields render, empty optionals show "Not set" |
| E2E | Toggle edit mode | Click edit — verify inputs appear with current values, cancel reverts |
| E2E | Profile field validation | Invalid email/URL shows inline error, form cannot submit |
| E2E | Profile save persists | Valid changes → save → PATCH sent → view mode with new values |
| E2E | Network error in edit | Mock 500 via API → error stays in edit mode, message shown |
| E2E | Password change success | Valid current + new → 200 + success notification |
| E2E | Wrong current password | Invalid current → error shown, password unchanged |
| E2E | Password validation | Weak password (no symbol) → inline error |
| E2E | Confirm match | confirmNewPassword ≠ newPassword → inline error |
| E2E | Header link | Click "Perfil" → navigates to `/profile` |

All tests under `frontend/tests/specs/profile/profile.spec.ts` with `test.describe('Profile')`. Use auth fixture for authenticated user setup. Prisma migration tested by running `npx prisma migrate dev` and checking schema.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

1. Run `npx prisma migrate dev --name add_profile_fields` to create migration
2. Backend changes go first (schema + routes)
3. Frontend changes deployed together
4. Rollback: revert migration + restore backend routes + revert frontend files

## Review Budget

Estimated ~440 lines of authored changes (backend ~90 + frontend ~250 + tests ~100). Flags **high risk** for the 400-line PR budget. Recommend splitting into two stacked PRs: (1) backend endpoint + schema migration + `GET /auth/me` extension; (2) frontend ProfilePage + tests + header fix.

## Open Questions

None.
