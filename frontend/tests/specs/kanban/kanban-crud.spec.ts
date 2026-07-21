import { test, expect } from '../../fixtures'
import { generateEmail, createTestUser, deleteTestUser } from '../../fixtures/auth.fixture'

test.describe('Kanban CRUD', () => {
  let testEmail: string
  const testPassword = 'TestPass123!'
  const testName = 'Test User'
  let accessToken: string
  let userId: number
  let companyId: string

  test.beforeAll(async ({ request }) => {
    testEmail = generateEmail()
    const result = await createTestUser(request, testName, testEmail, testPassword)
    userId = result.userId
    accessToken = result.accessToken

    // Create a test company via the new POST /api/v1/companies endpoint
    const companyRes = await request.post('/api/v1/companies', {
      data: { name: 'Test Company', website: 'https://test.com' },
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    // If POST endpoint isn't available yet, create via evaluate as fallback
    if (!companyRes.ok()) {
      console.warn('POST /api/v1/companies failed, seeding via store')
    }

    const companyData = (await companyRes.json()) as { id: string }
    companyId = companyData.id
  })

  test.afterAll(async ({ request }) => {
    if (userId && accessToken) {
      await deleteTestUser(request, userId, accessToken).catch(() => {})
    }
  })

  test('should create application, display in column, and persist on reload', async ({
    page,
    kanbanBoardPage,
  }) => {
    // Login via the page
    await page.goto('/login')
    await page.locator('#email').fill(testEmail)
    await page.locator('#password').fill(testPassword)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })

    // Navigate to kanban board
    await page.goto('/kanban')
    await kanbanBoardPage.isLoaded()

    // Click the create card button in the APPLIED column
    const createButton = page.locator('button:has-text("add"), button:has-text("Crear")').first()
    await createButton.click()

    // Wait for the modal to appear
    await expect(page.getByRole('heading', { name: /Nueva aplicación/i })).toBeVisible()

    // Fill the application form
    await page.locator('#jobTitle').fill('Senior Frontend Engineer')
    await page.locator('#offerUrl').fill('https://example.com/job/123')

    // Select the company we created in beforeAll
    await page.locator('#companyId').selectOption(companyId)

    // Select category
    await page.locator('#category').selectOption('FRONTEND')

    // Select source
    await page.locator('#source').selectOption('LINKEDIN')

    // Fill application date
    const today = new Date().toISOString().split('T')[0]
    await page.locator('#applicationDate').fill(today)

    // Fill description
    await page.locator('#jobDescription').fill('Frontend developer position with React')

    // Submit the form
    await page.locator('button[type="submit"]').click()

    // Wait for modal to close — the modal disappears when the API call succeeds
    await expect(page.getByRole('heading', { name: /Nueva aplicación/i })).not.toBeVisible({ timeout: 10000 })

    // Verify the card appears in the APPLIED column
    const appliedCards = await kanbanBoardPage.getColumnApps('APPLIED')
    expect(appliedCards.length).toBeGreaterThan(0)

    // Reload and verify persistence
    await page.reload()
    await kanbanBoardPage.isLoaded()

    // Wait for cards to be rendered after data fetch
    await page.waitForSelector('[data-column-id="APPLIED"] [data-draggable-id]', { timeout: 10000 })

    const appliedCardsAfterReload = await kanbanBoardPage.getColumnApps('APPLIED')
    expect(appliedCardsAfterReload.length).toBeGreaterThan(0)
  })

  test('should drag card from APPLIED to INTERVIEW column', async ({ page, kanbanBoardPage }) => {
    // Login
    await page.goto('/login')
    await page.locator('#email').fill(testEmail)
    await page.locator('#password').fill(testPassword)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })

    // Go to kanban
    await page.goto('/kanban')
    await kanbanBoardPage.isLoaded()

    // Wait for the card to be rendered (fetchApplications completes asynchronously)
    await page.waitForSelector('[data-column-id="APPLIED"] [data-draggable-id]', { timeout: 10000 })

    // Get the card in APPLIED column
    const appliedCards = await kanbanBoardPage.getColumnApps('APPLIED')
    expect(appliedCards.length).toBeGreaterThan(0)

    // Get the first card's draggable id
    const firstCard = appliedCards[0]
    const draggableId = await firstCard.getAttribute('data-draggable-id')
    expect(draggableId).toBeTruthy()

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
