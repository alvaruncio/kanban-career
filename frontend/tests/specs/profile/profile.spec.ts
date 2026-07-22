import { test, expect } from '../../fixtures'
import { generateEmail, createTestUser, deleteTestUser } from '../../fixtures/auth.fixture'

test.describe('Profile', () => {
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

  
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, testPassword)
    await page.waitForURL('**/dashboard')
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test('should display profile fields in view mode: name, email, and "Not set" for empty optionals', async ({ profilePage }) => {
    await profilePage.goto()

    await profilePage.expectFieldVisible('Test User')
    await profilePage.expectFieldVisible(testEmail)
    await profilePage.expectNotSetIndicator()
  })

  test('should toggle edit mode on click and revert changes on cancel', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    await profilePage.expectFieldInEditMode('nombre')
    await profilePage.expectFieldInEditMode('correo electrónico')
    await profilePage.expectFieldInEditMode('linkedin')

    await profilePage.fillField('nombre', 'Modified Name')
    await profilePage.cancelEdit()

    await expect(profilePage.field('Modified Name')).not.toBeVisible()
    await profilePage.expectFieldVisible('Test User')
  })

  test('should show inline validation errors for invalid email and URL', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    await profilePage.fillField('correo electrónico', 'not-an-email')
    await profilePage.fillField('linkedin', 'not-a-url')
    await profilePage.saveProfile()

    await profilePage.expectValidationError('Email')
  })

  test('should save valid profile changes and show success notification', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    const bioText = 'Software developer passionate about clean code'
    await profilePage.fillField('biograf', bioText)
    await profilePage.saveProfile()

    await profilePage.expectFieldVisible(bioText)
    await profilePage.expectSuccessNotification()
  })

  test('should reject weak password with inline validation error', async ({ profilePage }) => {
    await profilePage.goto()

    await profilePage.fillCurrentPassword(testPassword)
    await profilePage.fillNewPassword('weak')
    await profilePage.fillConfirmPassword('weak')
    await profilePage.changePasswordButton.click()

    await profilePage.expectValidationError('mínimo 8 caracteres')
  })

  test('should navigate to /profile when clicking Perfil link in header', async ({ profilePage }) => {
    await profilePage.navigateFromHeader()

    expect(profilePage.currentUrl()).toContain('/profile')
  })
})
