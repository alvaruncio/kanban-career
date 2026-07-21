import { test, expect } from '../../fixtures'

test.describe('Form Validation', () => {
  test('should show inline errors on empty registration form submission', async ({ page, registerPage }) => {
    await registerPage.goto()

    // Submit empty form to trigger validation
    await registerPage.submit()

    // Wait for validation errors to appear — deterministic, no blind timeout
    const errorAlerts = page.locator('form [role="alert"]')
    await expect(errorAlerts.first()).toBeVisible({ timeout: 5000 })

    const count = await errorAlerts.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show error for invalid email format', async ({ page, registerPage }) => {
    await registerPage.goto()

    // Fill fields with valid data except invalid email
    await registerPage.fillName('Test User')
    await registerPage.fillEmail('not-an-email')
    await registerPage.fillPassword('TestPass123!')
    await registerPage.fillConfirmPassword('TestPass123!')

    // Submit to trigger validation
    await registerPage.submit()

    // Wait for the error to appear
    const formErrors = page.locator('form [role="alert"]')
    await expect(formErrors.first()).toBeVisible({ timeout: 5000 })
  })

  test('should show error for weak password', async ({ page, registerPage }) => {
    await registerPage.goto()

    // Fill with valid data except weak password
    await registerPage.fillName('Test User')
    await registerPage.fillEmail('test@example.com')
    await registerPage.fillPassword('weak')
    await registerPage.fillConfirmPassword('weak')

    // Submit to trigger validation
    await registerPage.submit()

    // Wait for the error to appear
    const formErrors = page.locator('form [role="alert"]')
    await expect(formErrors.first()).toBeVisible({ timeout: 5000 })
  })
})
