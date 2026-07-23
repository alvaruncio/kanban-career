import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME } from '../../fixtures'

test.describe('Login', () => {
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

  test('should login with valid credentials and redirect to dashboard', async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, TEST_PASSWORD)

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
