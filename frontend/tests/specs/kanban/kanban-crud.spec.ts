import { test, expect, generateEmail, createTestUser, deleteTestUser, TEST_PASSWORD, TEST_USER_NAME, TEST_COMPANY, TEST_APPLICATION } from '../../fixtures'

test.describe('Kanban CRUD', () => {
  let testEmail: string
  let accessToken: string
  let userId: number
  let companyId: string

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, TEST_USER_NAME, testEmail, TEST_PASSWORD)
    userId = result.userId
    accessToken = result.accessToken

    // Seed a test company so the UI has a company to select
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

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(testEmail, TEST_PASSWORD)
    await page.waitForURL('**/dashboard')
  })

  test('should create application, display in column, and persist on reload', async ({
    page,
    kanbanBoardPage,
    applicationFormModal,
  }) => {
    const titleSuffix = Date.now()
    const jobTitle = `${TEST_APPLICATION.jobTitle} ${titleSuffix}`

    // Navigate to kanban board
    await page.goto('/kanban')
    await kanbanBoardPage.isLoaded()

    // Open the create card modal
    const createButton = page.locator('button:has-text("add"), button:has-text("Crear")').first()
    await createButton.click()

    // Wait for the modal to appear
    await expect(applicationFormModal.heading).toBeVisible()

    // Fill the application form using the page object
    const today = new Date().toISOString().split('T')[0]
    await applicationFormModal.fillApplicationForm({
      jobTitle,
      companyId,
      category: TEST_APPLICATION.category,
      source: TEST_APPLICATION.source,
      applicationDate: today,
      offerUrl: TEST_APPLICATION.offerUrl,
      jobDescription: TEST_APPLICATION.jobDescription,
    })

    // Submit the form
    await applicationFormModal.submit()

    // Wait for modal to close — the modal disappears when the API call succeeds
    await applicationFormModal.waitForClose()

    // Wait for the card to appear in the APPLIED column by its title
    await expect(page.getByText(jobTitle).first()).toBeVisible({ timeout: 10000 })

    // Reload and verify persistence
    await page.reload()
    await kanbanBoardPage.isLoaded()

    await expect(page.getByText(jobTitle).first()).toBeVisible({ timeout: 10000 })
  })

  test('should drag card from APPLIED to INTERVIEW column', async ({ page, request, kanbanBoardPage }) => {
    const titleSuffix = Date.now()
    const jobTitle = `${TEST_APPLICATION.jobTitle} ${titleSuffix}`
    const today = new Date().toISOString().split('T')[0]

    // Create an application via API so the drag test is self-sufficient
    const appRes = await request.post('/api/v1/applications', {
      data: {
        jobTitle,
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
    const appId = appData.id

    // Navigate to kanban board
    await page.goto('/kanban')
    await kanbanBoardPage.isLoaded()

    // Wait for the specific card we created to appear
    await expect(page.getByText(jobTitle).first()).toBeVisible({ timeout: 15000 })

    // Get the card in APPLIED column
    const appliedCards = await kanbanBoardPage.getColumnApps('APPLIED')
    expect(appliedCards.length).toBeGreaterThan(0)

    // Get the first card's draggable id
    const firstCard = appliedCards[0]
    const draggableId = await firstCard.getAttribute('data-draggable-id')
    expect(draggableId).toBe(appId)

    // Drag the card from APPLIED to INTERVIEW
    await kanbanBoardPage.dragCard(draggableId!, 'INTERVIEW')

    // Wait for the card to appear in the INTERVIEW column — deterministic
    await page.waitForSelector(
      `[data-column-id="INTERVIEW"] [data-draggable-id="${draggableId}"]`,
      { timeout: 5000 },
    )

    // Verify the card is no longer in APPLIED
    const appliedAfter = await kanbanBoardPage.getColumnApps('APPLIED')
    const stillInApplied = await Promise.all(
      appliedAfter.map(async (card) => {
        const id = await card.getAttribute('data-draggable-id')
        return id === draggableId
      })
    )
    expect(stillInApplied.some(Boolean)).toBe(false)

    // Verify the card appears in INTERVIEW
    const interviewCards = await kanbanBoardPage.getColumnApps('INTERVIEW')
    const inInterview = await Promise.all(
      interviewCards.map(async (card) => {
        const id = await card.getAttribute('data-draggable-id')
        return id === draggableId
      })
    )
    expect(inInterview.some(Boolean)).toBe(true)
  })
})
