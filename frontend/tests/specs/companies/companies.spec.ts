import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME, TEST_COMPANY, TEST_APPLICATION } from '../../fixtures'

test.describe('Companies API', () => {
  let testEmail: string
  let accessToken: string
  let userId: number
  let companyId: string

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
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test.describe('Page-level interactions', () => {
    test.beforeEach(async ({ page, loginPage }) => {
      await loginPage.goto()
      await loginPage.login(testEmail, TEST_PASSWORD)
      await page.waitForURL('**/dashboard')
    })

    test('should render company cards in grid layout', async ({ companiesListPage }) => {
      await companiesListPage.goto()
      await expect(companiesListPage.heading).toBeVisible()
      // The seeded company should appear as a card button with an h3
      await expect(companiesListPage.companyCard(TEST_COMPANY.name)).toBeVisible()
    })

    test('should navigate to company detail page on card click', async ({ page, companiesListPage }) => {
      await companiesListPage.goto()
      await companiesListPage.clickCompanyCard(TEST_COMPANY.name)
      await expect(page).toHaveURL(/\/companies\/(.+)/)
    })

    test('should show empty state when no companies exist', async ({ page, loginPage }) => {
      // Create a fresh user that has no companies
      const freshEmail = generateEmail()
      const freshUser = await createTestUser(page.request, 'Fresh User', freshEmail, TEST_PASSWORD)
      try {
        // Login as the fresh user
        await loginPage.goto()
        await loginPage.login(freshEmail, TEST_PASSWORD)
        await page.waitForURL('**/dashboard')

        // Navigate to companies
        await page.goto('/companies')
        await expect(page.locator('text=No hay empresas registradas').or(page.locator('text=No companies registered'))).toBeVisible()
      } finally {
        await deleteTestUser(page.request, freshUser.userId, freshUser.accessToken).catch(() => {})
      }
    })

    test('should show error state and retry button on fetch failure', async ({ page, companiesListPage }) => {
      // Mock a 500 response for the companies list endpoint
      await page.route('**/api/v1/companies', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server error' }),
          })
        } else {
          await route.continue()
        }
      })

      await companiesListPage.goto()
      await expect(companiesListPage.errorMessage).toBeVisible({ timeout: 10000 })
      await expect(companiesListPage.retryButton).toBeVisible()
    })

    test('should open create company modal and submit valid form', async ({ page, companiesDetailPage }) => {
      const mockId = 'mock-created-id-123'
      const mockCompany = {
        id: mockId,
        name: 'Created Company',
        website: 'https://created.com',
        description: null,
        linkedinUrl: null,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      }

      // Mock POST to return the created company and GET to return it in the list
      await page.route('**/api/v1/companies', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(mockCompany) })
        } else {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([mockCompany]) })
        }
      })
      // Mock detail GET so the detail page loads the created company
      await page.route(`**/api/v1/companies/${mockId}`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockCompany) })
      })

      await page.goto('/companies')
      await expect(companiesDetailPage.heading).not.toBeVisible() // still on list page

      // Click FAB to open create modal
      await page.getByRole('button', { name: /nueva empresa|new company/i }).click()

      // Fill the form inside the modal
      await page.locator('#name').fill(mockCompany.name)
      await page.locator('#website').fill(mockCompany.website!)

      // Submit
      await page.getByRole('button', { name: /guardar cambios|save changes/i }).click()

      // The modal closes and navigates to the detail page
      await expect(page).toHaveURL(/\/companies\/(.+)/, { timeout: 10000 })
      await expect(companiesDetailPage.heading).toContainText(mockCompany.name, { timeout: 10000 })
    })

    test('should show validation error on create form with empty name', async ({ page }) => {
      // Navigate to companies page and open modal
      await page.goto('/companies')

      // Click FAB to open modal
      await page.getByRole('button', { name: /nueva empresa|new company/i }).click()

      // Wait for modal to appear
      await expect(page.getByRole('button', { name: /guardar cambios|save changes/i })).toBeVisible()

      // Submit with empty name
      await page.getByRole('button', { name: /guardar cambios|save changes/i }).click()

      // Assert validation error is visible (Zod schema says "El nombre es obligatorio")
      await expect(page.locator('[role="alert"]').filter({ hasText: /obligatorio|required/i })).toBeVisible()

      // Modal should still be open
      await expect(page.getByRole('button', { name: /cancelar|cancel/i })).toBeVisible()
    })

    test('should show server error inside create modal', async ({ page }) => {
      // Mock POST to return a server error
      await page.route('**/api/v1/companies', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Error del servidor' }),
          })
        } else {
          await route.continue()
        }
      })

      await page.goto('/companies')

      // Open modal
      await page.getByRole('button', { name: /nueva empresa|new company/i }).click()
      await expect(page.getByRole('button', { name: /guardar cambios|save changes/i })).toBeVisible()

      // Fill form
      await page.locator('#name').fill('Failing Company')

      // Submit
      await page.getByRole('button', { name: /guardar cambios|save changes/i }).click()

      // Assert server error is shown inside the modal (scoped to form to avoid the page-level error alert)
      await expect(page.locator('form [role="alert"]').filter({ hasText: /error/i })).toBeVisible({ timeout: 10000 })

      // Modal should still be open with cancel button
      await expect(page.getByRole('button', { name: /cancelar|cancel/i })).toBeVisible()
    })

    test('should cancel create modal without creating', async ({ page }) => {
      await page.goto('/companies')

      // Open modal
      await page.getByRole('button', { name: /nueva empresa|new company/i }).click()
      await expect(page.getByRole('button', { name: /guardar cambios|save changes/i })).toBeVisible()

      // Fill form partially
      await page.locator('#name').fill('Will Not Save')

      // Click cancel
      await page.getByRole('button', { name: /cancelar|cancel/i }).click()

      // Modal should be closed — assert the FAB is visible again
      await expect(page.getByRole('button', { name: /nueva empresa|new company/i })).toBeVisible()
    })

    test('should display company info on detail page (view mode)', async ({ companiesDetailPage }) => {
      await companiesDetailPage.goto(companyId)
      await expect(companiesDetailPage.heading).toContainText(TEST_COMPANY.name, { timeout: 10000 })
    })

    test('should toggle to edit mode and show form with pre-filled values', async ({ companiesDetailPage }) => {
      await companiesDetailPage.goto(companyId)
      await expect(companiesDetailPage.heading).toBeVisible({ timeout: 10000 })

      // Click edit button
      await companiesDetailPage.editButton.click()

      // Assert form inputs have the current company values
      await expect(companiesDetailPage.nameInput).toHaveValue(TEST_COMPANY.name)
      await expect(companiesDetailPage.websiteInput).toHaveValue(TEST_COMPANY.website)
    })

    test('should save changes and refetch in edit mode', async ({ request, companiesDetailPage }) => {
      const updatedName = 'Updated Company Name - ' + Date.now()

      await companiesDetailPage.goto(companyId)
      await expect(companiesDetailPage.heading).toBeVisible({ timeout: 10000 })

      // Click edit
      await companiesDetailPage.editButton.click()

      // Modify the name
      await companiesDetailPage.nameInput.clear()
      await companiesDetailPage.nameInput.fill(updatedName)

      // Save
      await companiesDetailPage.saveButton.click()

      // Wait for success message
      await expect(companiesDetailPage.successMessage).toBeVisible({ timeout: 10000 })

      // Verify the new name is displayed in view mode
      await expect(companiesDetailPage.heading).toContainText(updatedName)

      // Restore original name for test isolation
      await request.patch(`/api/v1/companies/${companyId}`, {
        data: { name: TEST_COMPANY.name },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    })

    test('should cancel edit and revert to view mode without changes', async ({ companiesDetailPage }) => {
      await companiesDetailPage.goto(companyId)
      await expect(companiesDetailPage.heading).toContainText(TEST_COMPANY.name, { timeout: 10000 })

      // Click edit
      await companiesDetailPage.editButton.click()

      // Modify the name
      await companiesDetailPage.nameInput.clear()
      await companiesDetailPage.nameInput.fill('Will Not Be Saved')

      // Cancel
      await companiesDetailPage.cancelButton.click()

      // Verify original name is still shown (view mode)
      await expect(companiesDetailPage.heading).toContainText(TEST_COMPANY.name)
    })

    test('should show related applications section on detail page', async ({ request, companiesDetailPage }) => {
      // Seed an application linked to this company
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

      await companiesDetailPage.goto(companyId)
      await expect(companiesDetailPage.heading).toBeVisible({ timeout: 10000 })

      // Assert the related applications section is rendered
      await expect(companiesDetailPage.relatedApplicationsSection).toBeVisible()

      // Assert the seeded application appears in the list
      await expect(companiesDetailPage.page.getByText(TEST_APPLICATION.jobTitle)).toBeVisible()
    })

    test('should show no applications state in related section', async ({ companiesDetailPage }) => {
      // The seeded company has an application created by the previous test (13).
      // To test "no apps" state, restore the scenario by checking that a company
      // without related applications shows the empty state.
      // We use a separate company for this test.
      const isolatedEmail = generateEmail()
      const isolatedUser = await createTestUser(companiesDetailPage.page.request, 'Isolated User', isolatedEmail, TEST_PASSWORD)
      try {
        const compRes = await companiesDetailPage.page.request.post('/api/v1/companies', {
          data: { name: 'Isolated Company', website: 'https://isolated.com' },
          headers: { Authorization: `Bearer ${isolatedUser.accessToken}` },
        })
        const isolatedCompany = (await compRes.json()) as { id: string }

        // Login as the isolated user
        const { LoginPage } = await import('../../page-objects/LoginPage')
        const loginPage = new LoginPage(companiesDetailPage.page)
        await loginPage.goto()
        await loginPage.login(isolatedEmail, TEST_PASSWORD)
        await companiesDetailPage.page.waitForURL('**/dashboard')

        // Navigate to the isolated company detail
        await companiesDetailPage.goto(isolatedCompany.id)
        await expect(companiesDetailPage.heading).toBeVisible({ timeout: 10000 })

        // Assert no related applications message
        await expect(companiesDetailPage.noRelatedApplications).toBeVisible()
      } finally {
        await deleteTestUser(companiesDetailPage.page.request, isolatedUser.userId, isolatedUser.accessToken).catch(() => {})
      }
    })

    test('should show 404 error for non-existent company', async ({ companiesDetailPage }) => {
      await companiesDetailPage.goto('non-existent-id')

      // Should show a not found error message
      await expect(companiesDetailPage.notFoundMessage).toBeVisible({ timeout: 10000 })

      // Should show a back button
      await expect(companiesDetailPage.backButton).toBeVisible()
    })

    test('should prevent stale data on A→B navigation', async ({ page, companiesDetailPage }) => {
      // Create company A
      const companyARes = await page.request.post('/api/v1/companies', {
        data: { name: 'Company A Stale Test', website: 'https://a-stale.com' },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const companyA = (await companyARes.json()) as { id: string }

      // Create company B
      const companyBRes = await page.request.post('/api/v1/companies', {
        data: { name: 'Company B Stale Test', website: 'https://b-stale.com' },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const companyB = (await companyBRes.json()) as { id: string }

      // Navigate to company A
      await companiesDetailPage.goto(companyA.id)
      await expect(companiesDetailPage.heading).toContainText('Company A Stale Test', { timeout: 10000 })

      // Navigate to company B
      await companiesDetailPage.goto(companyB.id)
      await expect(companiesDetailPage.heading).toContainText('Company B Stale Test', { timeout: 10000 })

      // Verify heading does NOT contain company A's name
      await expect(companiesDetailPage.heading).not.toContainText('Company A')
    })

    test('should show loading skeleton during company detail fetch', async ({ page, companiesDetailPage }) => {
      // Intercept the company detail API to add a delay so loading state is visible
      await page.route(/\/api\/v1\/companies\/.+/, async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await companiesDetailPage.goto(companyId)

      // The loading spinner should be visible while data is being fetched
      await expect(companiesDetailPage.loadingSpinner).toBeVisible({ timeout: 3000 })

      // Eventually the company detail should load
      await expect(companiesDetailPage.heading).toContainText(TEST_COMPANY.name, { timeout: 15000 })
    })

    test('should create company and navigate to its detail page', async ({ page, request }) => {
      // Create a company via the API
      const companyRes = await page.request.post('/api/v1/companies', {
        data: { name: 'API Created Company', website: 'https://api-created.com' },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const createdCompany = (await companyRes.json()) as { id: string; name: string }

      // Navigate to its detail page
      await page.goto(`/companies/${createdCompany.id}`)
      await expect(page.locator('h1')).toContainText(createdCompany.name, { timeout: 10000 })
    })

    test('should navigate via sidebar link', async ({ page }) => {
      // Start at dashboard
      await page.goto('/dashboard')
      await page.waitForURL('**/dashboard')

      // Click "Empresas" / "Companies" in the sidebar
      await page.getByRole('link', { name: /empresas|companies/i }).click()
      await expect(page).toHaveURL(/\/companies$/, { timeout: 10000 })

      // Click "Dashboard" in the sidebar to go back
      await page.getByRole('link', { name: /dashboard/i }).click()
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10000 })
    })
  })

  test.describe('GET /companies/:id', () => {
    test('should return 200 for owned company', async ({ request }) => {
      const res = await request.get(`/api/v1/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(body.name).toBe(TEST_COMPANY.name)
    })

    test('should return 404 for non-existent company', async ({ request }) => {
      const res = await request.get('/api/v1/companies/non-existent-id', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      expect(res.status()).toBe(404)
    })

    test('should return 404 for unowned company', async ({ request }) => {
      const otherEmail = generateEmail()
      const otherResult = await createTestUser(request, 'Other User', otherEmail, TEST_PASSWORD)

      const res = await request.get(`/api/v1/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${otherResult.accessToken}` },
      })
      expect(res.status()).toBe(404)

      await deleteTestUser(request, otherResult.userId, otherResult.accessToken).catch(() => {})
    })
  })

  test.describe('PATCH /companies/:id', () => {
    test('should return 200 with updated company', async ({ request }) => {
      const res = await request.patch(`/api/v1/companies/${companyId}`, {
        data: { name: 'Updated Name' },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(body.name).toBe('Updated Name')

      // Restore original name
      await request.patch(`/api/v1/companies/${companyId}`, {
        data: { name: TEST_COMPANY.name },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    })

    test('should return 404 for unowned company', async ({ request }) => {
      const otherEmail = generateEmail()
      const otherResult = await createTestUser(request, 'Other User', otherEmail, TEST_PASSWORD)

      const res = await request.patch(`/api/v1/companies/${companyId}`, {
        data: { name: 'Hacked Name' },
        headers: { Authorization: `Bearer ${otherResult.accessToken}` },
      })
      expect(res.status()).toBe(404)

      await deleteTestUser(request, otherResult.userId, otherResult.accessToken).catch(() => {})
    })

    test('should return 400 for invalid data', async ({ request }) => {
      const res = await request.patch(`/api/v1/companies/${companyId}`, {
        data: { website: 'not-a-url' },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      expect(res.status()).toBe(400)
    })
  })
})
