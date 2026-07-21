import { test, expect } from '../../fixtures'
import { generateEmail, deleteTestUser } from '../../fixtures/auth.fixture'

test.describe('Register', () => {
  let testEmail: string
  const testPassword = 'TestPass123!'
  const testName = 'Test User'

  test.afterEach(async ({ request }) => {
    // Cleanup: after registration, try to get the user ID and delete it
    // The register API returns accessToken + user, try login to get the token for cleanup
    const loginRes = await request.post('/api/v1/auth/login', {
      data: { email: testEmail, password: testPassword },
    })
    if (loginRes.ok()) {
      const loginData = (await loginRes.json()) as { accessToken: string; user: { id: number } }
      await deleteTestUser(request, loginData.user.id, loginData.accessToken).catch(() => {})
    }
  })

  test('should register and redirect to dashboard', async ({ page, registerPage }) => {
    testEmail = generateEmail()

    await registerPage.goto()
    await registerPage.register(testName, testEmail, testPassword)

    // The app auto-logins after register, so it should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')
  })
})
