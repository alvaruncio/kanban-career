import { test, expect } from '../../fixtures'
import { generateEmail, createTestUser } from '../../fixtures/auth.fixture'

test.describe('Login', () => {
  let testEmail: string
  const testPassword = 'TestPass123!'
  let accessToken: string
  let userId: number

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, 'Test User', testEmail, testPassword)
    userId = result.userId
    accessToken = result.accessToken
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await request.delete(`/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => {})
    }
  })

  test('should login with valid credentials and redirect to dashboard', async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, testPassword)

    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('should show error with invalid credentials', async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, 'WrongPassword1!')

    // Wait for the error alert to appear instead of a blind timeout
    const errorAlert = page.locator('[role="alert"]')
    await expect(errorAlert).toBeVisible()
    expect(page.url()).toContain('/login')
  })
})
