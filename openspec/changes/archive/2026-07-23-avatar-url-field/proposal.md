# Proposal: Avatar URL Field

## Intent

Add avatar support to user profiles — users get a default avatar on registration and can optionally replace it with a custom URL. If the image fails to load, the default is tried first, then a text fallback.

## Scope

### In Scope
- Prisma: change `avatarUrl` from nullable (`String?`) to non-nullable with `@default("https://www.svgrepo.com/svg/335455/profile-default")` + migration
- Frontend: render `<img>` in view mode with `avatarUrl` as `src`
- Frontend fallback chain: `avatarUrl` fails → try default URL → fails → show text "there should be a user image"
- Frontend: `avatarUrl` editable field in profile form (text input, last field)
- Frontend Zod validation: `avatarUrl` must be valid URL or empty
- E2E test covering default avatar, custom URL, fallback behavior
- Frontend `User` interface: `avatarUrl` becomes required (non-optional)

### Out of Scope
- File upload / image picker (deferred)
- Avatar preview or crop
- Gravatar auto-resolution

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `user-profile`: Add avatar URL field + default avatar on registration + image rendering with fallback chain

## Approach

1. Prisma: change `avatarUrl String?` → `avatarUrl String @default("https://www.svgrepo.com/svg/335455/profile-default")`, run migration
2. Frontend: add `avatarUrl` to Zod `profileSchema` (valid URL or empty)
3. Frontend: render `<img>` with `avatarUrl` as `src` + two-step `onError` fallback
4. Frontend: add `avatarUrl` InputForm in edit mode (last field)
5. Frontend: update `User` interface — `avatarUrl` becomes required (`string`, not `string | undefined`)
6. E2E: test default avatar, custom URL save, fallback chain

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modified | `avatarUrl String?` → `avatarUrl String @default(...)` |
| `frontend/src/interfaces/auth/auth.ts` | Modified | `avatarUrl` becomes required (`string`, not `string?`) |
| `frontend/src/models/profileSchema/profileSchema.ts` | Modified | Add `avatarUrl` field |
| `frontend/src/pages/ProfilePage/ProfilePage.tsx` | Modified | Add field to form + image with fallback chain |
| `frontend/src/locales/es/es.ts` | Modified | Add fallback text translation |
| `frontend/src/locales/en/en.ts` | Modified | Add fallback text translation |
| `frontend/src/locales/types/types.ts` | Modified | Add fallback text type |
| `frontend/tests/specs/profile/profile.spec.ts` | Modified | Add avatar URL E2E tests |
| `frontend/tests/page-objects/ProfilePage.ts` | Modified | Add avatar field helpers |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Default SVG URL changes or goes down | Low | Two-step fallback chain ensures graceful degradation — text fallback is last resort |
| Missing translation key | Low | Will add explicit keys for fallback text |

## Rollback Plan

Revert Prisma schema change + revert frontend changes. Rollback migration if needed.

## Dependencies

- External: `https://www.svgrepo.com/svg/335455/profile-default` must be accessible

## Success Criteria

- [ ] New users get default avatar automatically
- [ ] User can replace avatar with custom URL
- [ ] If custom URL fails, default is shown; if default also fails, text fallback appears
- [ ] Invalid URLs show inline validation error
