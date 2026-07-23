import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME } from '../../fixtures'

test.describe('Protected Routes', () => {
  let testEmail: string
  let accessToken: string
  let userId: number

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, TEST_USER_NAME, testEmail, TEST_PASSWORD)
    userId = result.userId
    accessToken = result.accessToken
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test('should redirect unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard')

    // Should redirect to /login
    await page.waitForURL('**/login', { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('should redirect to dashboard after successful login', async ({ page, loginPage }) => {
    // Start at login page (redirected from dashboard)
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 10000 })

    // Login
    await loginPage.login(testEmail, TEST_PASSWORD)

    // Should end up at dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')
  })
})
