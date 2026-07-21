import { randomUUID } from 'node:crypto'
import type { APIRequestContext } from '@playwright/test'

export function generateEmail(): string {
  return `test-${randomUUID()}@example.com`
}

export async function createTestUser(
  request: APIRequestContext,
  name: string,
  email: string,
  password: string,
): Promise<{ userId: number; accessToken: string }> {
  const res = await request.post('/api/v1/auth/register', {
    data: { name, email, password, confirmPassword: password },
  })

  if (!res.ok()) {
    const body = await res.json()
    throw new Error(`Failed to create test user: ${JSON.stringify(body)}`)
  }

  const data = (await res.json()) as { accessToken: string; user: { id: number } }
  return { userId: data.user.id, accessToken: data.accessToken }
}

export async function deleteTestUser(
  request: APIRequestContext,
  userId: number,
  accessToken: string,
): Promise<void> {
  await request.delete(`/api/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
