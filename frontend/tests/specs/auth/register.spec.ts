import { test, expect, generateEmail, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME } from '../../fixtures'

test.describe('Register', () => {
  let testEmail: string
  let testUserId: number | undefined
  let testAccessToken: string | undefined

  test.afterEach(async ({ request }) => {
    // Cleanup: if we have direct access to the user ID (from API), delete directly
    if (testUserId && testAccessToken) {
      await deleteTestUser(request, testUserId, testAccessToken).catch(() => {})
      return
    }

    // Fallback: attempt to log in via API to get user ID for cleanup
    if (testEmail) {
      const loginRes = await request.post('/api/v1/auth/login', {
        data: { email: testEmail, password: TEST_PASSWORD },
      }).catch(() => null)
      if (loginRes?.ok()) {
        const loginData = (await loginRes.json()) as { accessToken: string; user: { id: number } }
        await deleteTestUser(request, loginData.user.id, loginData.accessToken).catch(() => {})
      }
    }
  })

  test('should register and redirect to dashboard', async ({ page, registerPage, request }) => {
    testEmail = generateEmail()

    await registerPage.goto()
    await registerPage.register(TEST_USER_NAME, testEmail, TEST_PASSWORD)

    // The app auto-logins after register, so it should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')

    // Capture user ID via API for deterministic cleanup
    const loginRes = await request.post('/api/v1/auth/login', {
      data: { email: testEmail, password: TEST_PASSWORD },
    })
    if (loginRes.ok()) {
      const loginData = (await loginRes.json()) as { accessToken: string; user: { id: number } }
      testUserId = loginData.user.id
      testAccessToken = loginData.accessToken
    }
  })
})
