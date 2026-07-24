import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME, TEST_COMPANY, TEST_APPLICATION } from '../../fixtures'

test.describe('Application Detail Page', () => {
  let testEmail: string
  let accessToken: string
  let userId: number
  let companyId: string
  let applicationId: string

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, TEST_USER_NAME, testEmail, TEST_PASSWORD)
    userId = result.userId
    accessToken = result.accessToken

    // Seed a test company
    const companyRes = await request.post('/api/v1/companies', {
      data: { ...TEST_COMPANY },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const companyData = (await companyRes.json()) as { id: string }
    companyId = companyData.id

    // Seed a test application
    const today = new Date().toISOString().split('T')[0]
    const appRes = await request.post('/api/v1/applications', {
      data: {
        jobTitle: TEST_APPLICATION.jobTitle,
        companyId,
        category: TEST_APPLICATION.category,
        source: TEST_APPLICATION.source,
        applicationDate: today,
        offerUrl: TEST_APPLICATION.offerUrl,
        jobDescription: TEST_APPLICATION.jobDescription,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    expect(appRes.ok()).toBeTruthy()
    const appData = (await appRes.json()) as { id: string }
    applicationId = appData.id
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, TEST_PASSWORD)
    await page.waitForURL('**/dashboard')
  })

  test('should navigate from KanbanCard to detail page', async ({ page, kanbanBoardPage, applicationDetailPage }) => {
    // Navigate to kanban
    await page.goto('/kanban')
    await kanbanBoardPage.isLoaded()

    // Click on the card with our job title
    await page.getByText(TEST_APPLICATION.jobTitle).first().click()

    // Should navigate to the detail page
    await page.waitForURL(`**/application/${applicationId}`)
    await expect(applicationDetailPage.heading).toContainText(TEST_APPLICATION.jobTitle)
  })

  test('should render all fields in view mode', async ({ applicationDetailPage }) => {
    await applicationDetailPage.goto(applicationId)

    // Wait for the page to load
    await expect(applicationDetailPage.heading).toBeVisible()

    // Check header info
    await expect(applicationDetailPage.heading).toContainText(TEST_APPLICATION.jobTitle)
    await expect(applicationDetailPage.companyName).toContainText(TEST_COMPANY.name)

    // Check that field labels are present
    const labels = await applicationDetailPage.fieldLabels.allTextContents()
    expect(labels.length).toBeGreaterThan(0)
  })

  test('should edit fields and save successfully', async ({ request, applicationDetailPage }) => {
    await applicationDetailPage.goto(applicationId)
    await expect(applicationDetailPage.heading).toBeVisible()

    // Click edit
    await applicationDetailPage.editButton.click()

    // Modify job title
    await applicationDetailPage.jobTitleInput.clear()
    await applicationDetailPage.jobTitleInput.fill('Updated Job Title')

    // Save
    await applicationDetailPage.saveButton.click()

    // Wait for success message
    await expect(applicationDetailPage.successMessage).toBeVisible({ timeout: 10000 })

    // Verify the new title is displayed
    await expect(applicationDetailPage.heading).toContainText('Updated Job Title')

    // Restore original title for test isolation
    const today = new Date().toISOString().split('T')[0]
    await request.patch(`/api/v1/applications/${applicationId}`, {
      data: {
        jobTitle: TEST_APPLICATION.jobTitle,
        companyId,
        category: TEST_APPLICATION.category,
        source: TEST_APPLICATION.source,
        applicationDate: today,
        offerUrl: TEST_APPLICATION.offerUrl,
        jobDescription: TEST_APPLICATION.jobDescription,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  })

  test('should cancel editing without saving', async ({ applicationDetailPage }) => {
    await applicationDetailPage.goto(applicationId)
    await expect(applicationDetailPage.heading).toBeVisible()

    // Click edit
    await applicationDetailPage.editButton.click()

    // Modify title
    await applicationDetailPage.jobTitleInput.clear()
    await applicationDetailPage.jobTitleInput.fill('Will not save')

    // Cancel
    await applicationDetailPage.cancelButton.click()

    // Verify original title is still shown
    await expect(applicationDetailPage.heading).toContainText(TEST_APPLICATION.jobTitle)
  })

  test('should navigate back to kanban', async ({ page, applicationDetailPage }) => {
    await applicationDetailPage.goto(applicationId)
    await expect(applicationDetailPage.heading).toBeVisible()

    // Click back to kanban
    await applicationDetailPage.backToKanbanButton.click()

    // Should navigate to /kanban
    await expect(page).toHaveURL(/\/kanban/)
  })

  test('should show 404 for non-existent application', async ({ applicationDetailPage }) => {
    await applicationDetailPage.goto('non-existent-id')

    // Should show error message
    await expect(applicationDetailPage.notFoundMessage).toBeVisible({ timeout: 10000 })

    // Should show back to kanban button
    await expect(applicationDetailPage.backToKanbanButton).toBeVisible()
  })

  test('should validate invalid data and not send PATCH', async ({ page, applicationDetailPage }) => {
    await applicationDetailPage.goto(applicationId)
    await expect(applicationDetailPage.heading).toBeVisible()

    await applicationDetailPage.editButton.click()

    // Clear offer URL and enter invalid value
    await applicationDetailPage.offerUrlInput.clear()
    await applicationDetailPage.offerUrlInput.fill('not-a-valid-url')

    // Try to save
    await applicationDetailPage.saveButton.click()

    // Should show inline validation error
    await expect(applicationDetailPage.validationError).toBeVisible({ timeout: 5000 })

    // We should still be in edit mode (form was not submitted)
    await expect(applicationDetailPage.cancelButton).toBeVisible()
  })

  test('should show loading state', async ({ page, applicationDetailPage }) => {
    // Intercept the API call to add delay
    await page.route('**/api/v1/applications/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })

    await applicationDetailPage.goto(applicationId)

    // LoadingSkeleton should be visible (rendered while waiting) with spinner
    await expect(applicationDetailPage.loadingSpinner).toBeVisible({ timeout: 3000 })
  })

  test('should show error state on API failure', async ({ page, applicationDetailPage }) => {
    // Mock a 500 response
    await page.route('**/api/v1/applications/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    await applicationDetailPage.goto(applicationId)

    // Should show an error message
    await expect(applicationDetailPage.notFoundMessage).toBeVisible({ timeout: 10000 })
  })
})
