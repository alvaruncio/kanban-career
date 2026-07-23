import { randomUUID } from 'node:crypto'

export const TEST_PASSWORD = 'TestPass123!'
export const TEST_USER_NAME = 'Test User'

export type TestUserCredentials = {
  name: string
  email: string
  password: string
}

export function generateEmail(): string {
  return `test-${randomUUID()}@example.com`
}

export function createTestUserCredentials(overrides?: Partial<TestUserCredentials>): TestUserCredentials {
  return {
    name: TEST_USER_NAME,
    email: generateEmail(),
    password: TEST_PASSWORD,
    ...overrides,
  }
}

export const TEST_COMPANY = {
  name: 'Test Company',
  website: 'https://test.com',
} as const

export const TEST_PHONE_NUMBER = '+34612345678'

export const TEST_APPLICATION = {
  jobTitle: 'Senior Frontend Engineer',
  offerUrl: 'https://example.com/job/123',
  category: 'FRONTEND',
  source: 'LINKEDIN',
  jobDescription: 'Frontend developer position with React',
} as const
