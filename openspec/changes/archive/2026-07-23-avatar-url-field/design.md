# Design: Avatar URL Field

## Technical Approach

Two changes: (1) Prisma schema sets default avatar URL at DB level, (2) Frontend renders `<img>` with two-step fallback chain. No service-layer changes needed — Prisma `@default` handles new users automatically.

## Architecture Decisions

### Decision: Default at Prisma level, not service level

**Choice**: `avatarUrl String @default("https://www.svgrepo.com/svg/335455/profile-default")` in `schema.prisma`

**Alternatives considered**: Set default in `AuthService.register` and `UserService.create`, set default in constants.js

**Rationale**: Prisma `@default` ensures EVERY user creation path gets the default — even future endpoints or admin scripts. No service code changes needed. Existing column changes from nullable (`String?`) to required (`String`).

### Decision: Default URL known on frontend for fallback

**Choice**: Define `DEFAULT_AVATAR_URL` as a module-level constant in `ProfilePage.tsx`

**Alternatives considered**: Export from shared constants file, hardcode in render

**Rationale**: Only `ProfilePage` needs it for the `onError` fallback. Module constant avoids unnecessary coupling to a shared file.

### Decision: View-mode display — `<img>` with fallback chain

**Choice**: Inline `<img>` with `useState` tracking error state. Two-step fallback:
1. Render `<img src={user.avatarUrl || DEFAULT_AVATAR_URL}>`
2. `onError` → if current src is NOT default, switch to default
3. Second `onError` → if current src IS default, hide img, show text

**Alternatives considered**: Use `ProfileField` with text (rejected), create `AvatarField` component (overkill), use `<object>` fallback (less predictable).

**Rationale**: Simple, reliable, no new component needed.

### Decision: Field order

**Choice**: Avatar image at top of view-mode card. In edit mode, `avatarUrl` InputForm is last.

**Rationale**: Visual hierarchy — profile images go at the top of a profile card. Edit form appends field last to minimize diff.

### Decision: `InputForm` unchanged, `User` interface updated

**Choice**: `InputForm` used as-is. `avatarUrl` becomes required in `User` interface since the DB always provides a value.

**Rationale**: `InputForm` is generic. `avatarUrl: string` (instead of `string | undefined`) reflects the new Prisma schema.

## Data Flow

### Registration flow (Prisma handles default)
```
POST /auth/register → AuthService.register()
  → AuthRepository.create({ name, email, password })
  → Prisma auto-fills avatarUrl with @default value
  → Response includes avatarUrl = default URL
```

### Edit flow (frontend)
```
User types URL → InputForm (Controller) → React Hook Form state
  → Zod validates via profileSchema.avatarUrl
  → handleProfileSubmit → ProfileService.updateProfile(data)
  → PATCH /auth/me → Backend stores avatarUrl
  → refreshUser() → re-render view mode
```

### View flow (frontend) — fallback chain
```
user.avatarUrl || DEFAULT_AVATAR_URL → <img> renders
  ├─ onLoad: image displayed normally
  ├─ onError (current src !== DEFAULT_AVATAR_URL):
  │   → set src to DEFAULT_AVATAR_URL (retry with default)
  │   → if this also onErrors → hide img, show text fallback
  └─ onError (current src === DEFAULT_AVATAR_URL):
      → hide img, show `t.profile.avatarFallbackText` ("Imagen Usuario" / "User Image")
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | `avatarUrl String?` → `avatarUrl String @default(...)` |
| `frontend/src/interfaces/auth/auth.ts` | Modify | `avatarUrl?: string` → `avatarUrl: string` |
| `frontend/src/models/profileSchema/profileSchema.ts` | Modify | Add `avatarUrl: z.url().optional().or(z.literal(''))` |
| `frontend/src/pages/ProfilePage/ProfilePage.tsx` | Modify | Add `avatarUrl` to form + `<img>` with fallback chain |
| `frontend/src/locales/es/es.ts` | Modify | Add `avatarFallbackText: 'Imagen Usuario'` |
| `frontend/src/locales/en/en.ts` | Modify | Add `avatarFallbackText: 'User Image'` |
| `frontend/src/locales/types/types.ts` | Modify | Add `avatarFallbackText: string` |
| `frontend/tests/specs/profile/profile.spec.ts` | Modify | Add avatar E2E tests |
| `frontend/tests/page-objects/ProfilePage.ts` | Modify | Add avatar helpers |

## Interfaces / Contracts

```typescript
// User interface — after change:
export interface User {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  avatarUrl: string        // always populated (Prisma @default)
  bio?: string
  linkedinUrl?: string
  website?: string
  phone?: string
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E | Default avatar visible on profile load | Open profile, verify `<img>` with default src |
| E2E | Save custom URL, see it rendered | Fill avatar field, save, verify `<img>` src updated |
| E2E | Invalid URL validation | Enter bad URL, save, expect validation error |
| E2E | Empty URL accepted (shows default) | Clear field, save, verify default avatar shows |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

Prisma migration needed: `npx prisma migrate dev --name add-avatar-default`. Existing rows with `NULL` will fail if column becomes non-nullable. Need to either:
- Set default for existing rows first, OR
- Make migration add default, backfill NULLs, then make non-nullable

Since this is dev, simplest: drop and recreate, or backfill in a two-step migration.

## Open Questions

None.
