import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME } from '../../fixtures'

test.describe('Profile', () => {
  let testEmail: string
  let accessToken: string
  let userId: number

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, TEST_USER_NAME, testEmail, TEST_PASSWORD)
    userId = result.userId
    accessToken = result.accessToken
  })

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, TEST_PASSWORD)
    await page.waitForURL('**/dashboard')
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test('should display profile fields in view mode: name, email, and "Not set" for empty optionals', async ({ profilePage }) => {
    await profilePage.goto()

    await expect(profilePage.field('Test User')).toBeVisible()
    await expect(profilePage.field(testEmail)).toBeVisible()
    await expect(profilePage.notSetIndicator).toBeVisible()
  })

  test('should toggle edit mode on click and revert changes on cancel', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    await expect(profilePage.fieldInEditMode('nombre')).toBeVisible()
    await expect(profilePage.fieldInEditMode('correo electrónico')).toBeVisible()
    await expect(profilePage.fieldInEditMode('linkedin')).toBeVisible()

    await profilePage.fillField('nombre', 'Modified Name')
    await profilePage.cancelEdit()

    await expect(profilePage.field('Modified Name')).not.toBeVisible()
    await expect(profilePage.field('Test User')).toBeVisible()
  })

  test('should show inline validation errors for invalid email and URL', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    await profilePage.fillField('correo electrónico', 'not-an-email')
    await profilePage.fillField('linkedin', 'not-a-url')
    await profilePage.saveProfile()

    await expect(profilePage.validationError('Email')).toBeVisible()
  })

  test('should save valid profile changes and show success notification', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    const bioText = 'Software developer passionate about clean code'
    await profilePage.fillField('teléfono', '+34600111222')
    await profilePage.fillField('biograf', bioText)
    await profilePage.saveProfile()

    await expect(profilePage.field(bioText)).toBeVisible()
    await expect(profilePage.successNotification).toBeVisible()
  })

  test('should reject weak password with inline validation error', async ({ profilePage }) => {
    await profilePage.goto()

    await profilePage.fillCurrentPassword(TEST_PASSWORD)
    await profilePage.fillNewPassword('weak')
    await profilePage.fillConfirmPassword('weak')
    await profilePage.changePasswordButton.click()

    await expect(profilePage.validationError('mínimo 8 caracteres')).toBeVisible()
  })

  test('should navigate to /profile when clicking Perfil link in header', async ({ profilePage }) => {
    await profilePage.navigateFromHeader()

    expect(profilePage.currentUrl()).toContain('/profile')
  })

  // ── Avatar Tests ────────────────────────────────────

  test('should show default avatar image on profile view', async ({ profilePage, page }) => {
    await page.route(/.*335455.*/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="gray"/></svg>' }))
    const DEFAULT_AVATAR = 'https://www.svgrepo.com/svg/335455/profile-default'
    await profilePage.goto()
    await expect(profilePage.avatarImage(DEFAULT_AVATAR)).toBeVisible()
  })

  test('should show avatar URL input field in edit mode', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()
    await expect(profilePage.avatarUrlField).toBeVisible()
  })

  test('should save custom avatar URL and show it in view mode', async ({ profilePage, page }) => {
    await page.route(/.*335455.*/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="gray"/></svg>' }))
    await page.route(/.*example\.com.*avatar.*/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="red"/></svg>' }))

    await profilePage.goto()
    await profilePage.enterEditMode()

    const customUrl = 'https://example.com/avatar.png'
    await profilePage.fillField('teléfono', '+34600111222')
    await profilePage.fillAvatarUrl(customUrl)
    await profilePage.saveProfile()
    await expect(profilePage.editButton).toBeVisible()

    await expect(profilePage.avatarImage(customUrl)).toBeVisible()
  })

  test('should clear avatar URL and show default avatar', async ({ profilePage, page }) => {
    await page.route(/.*335455.*/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="gray"/></svg>' }))

    const DEFAULT_AVATAR = 'https://www.svgrepo.com/svg/335455/profile-default'
    await profilePage.goto()
    await profilePage.enterEditMode()

    await profilePage.fillField('teléfono', '+34600111222')
    await profilePage.fillAvatarUrl('')
    await profilePage.saveProfile()
    await expect(profilePage.editButton).toBeVisible()

    await expect(profilePage.avatarImage(DEFAULT_AVATAR)).toBeVisible()
  })

  test('should show validation error for invalid avatar URL', async ({ profilePage }) => {
    await profilePage.goto()
    await profilePage.enterEditMode()

    await profilePage.fillAvatarUrl('not-a-url')
    await profilePage.saveProfile()

    await expect(profilePage.avatarValidationError).toBeVisible()
  })
})
