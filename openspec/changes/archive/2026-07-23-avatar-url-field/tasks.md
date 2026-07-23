# Tasks: Avatar URL Field

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~80-120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## TDD Cycle 1: Prisma Default + Migration

### RED
- [x] 1.1 Write E2E test: after registration, user profile shows default avatar `<img>` with `https://www.svgrepo.com/svg/335455/profile-default`

### GREEN
- [x] 1.2 Modify `backend/prisma/schema.prisma`: `avatarUrl String?` → `avatarUrl String @default("https://www.svgrepo.com/svg/335455/profile-default")`
- [x] 1.3 Run Prisma migration: `npx prisma migrate dev --name add-avatar-default`

### REFACTOR
- [x] 1.4 Run full E2E suite — confirm no regressions

## TDD Cycle 2: Frontend Schema + Edit Mode + Translations

### RED
- [x] 2.1 Add `expectAvatarFieldVisible`, `expectAvatarImage`, `fillAvatarUrl` helpers to `ProfilePage` page object
- [x] 2.2 Write E2E test: edit mode shows avatar URL input field

### GREEN
- [x] 2.3 Update `frontend/src/interfaces/auth/auth.ts`: `avatarUrl?: string` → `avatarUrl: string`
- [x] 2.4 Add `avatarUrl: z.url('URL no válida').optional().or(z.literal(''))` to `profileSchema`
- [x] 2.5 Add `avatarUrl: ''` to `defaultValues` and all 3 `reset()` blocks in `ProfilePage`
- [x] 2.6 Add `<InputForm name="avatarUrl">` in edit mode form (last, after phone)
- [x] 2.7 Add `avatarFallbackText: string` to `types.ts`, `'Imagen Usuario'` to `es.ts`, `'User Image'` to `en.ts`

### REFACTOR
- [x] 2.8 Run full E2E suite — confirm no regressions

## TDD Cycle 3: View Mode Image with Fallback Chain

### RED
- [x] 3.1 Write E2E test: save custom avatar URL, view mode shows `<img>` with that src
- [x] 3.2 Write E2E test: clear custom URL, view mode shows default avatar

### GREEN
- [x] 3.3 Add `DEFAULT_AVATAR_URL` constant and `useState` for image error in `ProfilePage`
- [x] 3.4 Add `<img>` at top of view-mode card with fallback chain:
      - src: `user.avatarUrl || DEFAULT_AVATAR_URL`
      - onError: if current src !== DEFAULT_AVATAR_URL, switch src to DEFAULT_AVATAR_URL
      - onError (already on default): hide img, show `t.profile.avatarFallback`

### REFACTOR
- [x] 3.5 Run full E2E suite — verify no regressions

## TDD Cycle 4: Validation Edge Cases

### RED
- [x] 4.1 Write E2E test: invalid avatar URL shows inline validation error
- [x] 4.2 Write E2E test: valid avatar URL saves and persists

### GREEN
- [x] 4.3 Validation already handled by Zod — confirm tests pass

### REFACTOR
- [x] 4.4 Lint, typecheck, final review
