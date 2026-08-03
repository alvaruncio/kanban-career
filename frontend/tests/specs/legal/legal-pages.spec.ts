import { test, expect } from '../../fixtures'

test('should render the privacy page with its h1 and no 404', async ({ page, context }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Política de Privacidad|Privacy Policy/)
  await expect(page).toHaveURL(/\/privacy$/)

  const enPage = await context.newPage()
  await enPage.addInitScript((locale) => localStorage.setItem('locale', locale), 'en')
  await enPage.goto('/privacy')
  await expect(enPage.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy')
  await expect(enPage).toHaveURL(/\/privacy$/)
  await enPage.close()
})

test('should render the terms page with its h1 and no 404', async ({ page, context }) => {
  await page.goto('/terms')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Términos del Servicio|Terms of Service/)
  await expect(page).toHaveURL(/\/terms$/)

  const enPage = await context.newPage()
  await enPage.addInitScript((locale) => localStorage.setItem('locale', locale), 'en')
  await enPage.goto('/terms')
  await expect(enPage.getByRole('heading', { level: 1 })).toHaveText('Terms of Service')
  await expect(enPage).toHaveURL(/\/terms$/)
  await enPage.close()
})

test('should render the support page with its h1 and no 404', async ({ page, context }) => {
  await page.goto('/support')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Soporte|Support/)
  await expect(page).toHaveURL(/\/support$/)

  const enPage = await context.newPage()
  await enPage.addInitScript((locale) => localStorage.setItem('locale', locale), 'en')
  await enPage.goto('/support')
  await expect(enPage.getByRole('heading', { level: 1 })).toHaveText('Support')
  await expect(enPage).toHaveURL(/\/support$/)
  await enPage.close()
})

test('should show the effective date, intro summary and a working table of contents on legal pages', async ({ page, context }) => {
  await page.goto('/privacy')

  await expect(page.getByText(/En vigor:|Effective date:/)).toBeVisible()

  await expect(page.getByRole('heading', { level: 2, name: /Resumen|Summary/ })).toBeVisible()
  await expect(page.getByText(/Qué recopilamos|What we collect/)).toBeVisible()

  const toc = page.getByRole('navigation', { name: /Índice|Table of Contents/ })
  await expect(toc).toBeVisible()

  const firstChapterLink = toc.getByRole('link', {
    name: /^1\. Información que recopilamos|^1\. Information we collect$/,
  })
  await expect(firstChapterLink).toHaveAttribute('href', '#informacion-que-recopilamos')
  await firstChapterLink.click()
  await expect(page).toHaveURL(/#informacion-que-recopilamos$/)
  await expect(
    page.getByRole('heading', { level: 2, name: /^1\. Información que recopilamos|^1\. Information we collect$/ }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /^1\.1 Datos que nos proporcionas|^1\.1 Data you provide$/ })).toBeVisible()

  const enPage = await context.newPage()
  await enPage.addInitScript((locale) => localStorage.setItem('locale', locale), 'en')
  await enPage.goto('/privacy')
  await expect(enPage.getByRole('heading', { level: 2, name: 'Summary' })).toBeVisible()
  await expect(enPage.getByRole('navigation', { name: 'Table of Contents' })).toBeVisible()
  await enPage.close()
})

test('should navigate to privacy, terms and support from the footer links', async ({ page }) => {
  const links = [
    { name: /Privacidad|Privacy/, url: '**/privacy', h1: /Política de Privacidad|Privacy Policy/ },
    { name: /Términos|Terms/, url: '**/terms', h1: /Términos del Servicio|Terms of Service/ },
    { name: /Soporte|Support/, url: '**/support', h1: /Soporte|Support/ },
  ]

  for (const link of links) {
    await page.goto('/')
    await page.getByRole('link', { name: link.name }).click()
    await page.waitForURL(link.url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(link.h1)
  }
})

test('should show the FAQ and Contact section with email, hours and response time on the support page', async ({ page, context }) => {
  await page.goto('/support')
  await expect(page.getByRole('heading', { level: 2, name: /Preguntas Frecuentes|FAQ/ })).toBeVisible()

  await expect(page.getByRole('heading', { level: 2, name: /^(Contacto|Contact)$/ })).toBeVisible()

  const contactCard = page.locator('section').filter({ hasText: /Email de soporte|Support email/ })
  await expect(contactCard).toBeVisible()

  const emailLink = contactCard.getByRole('link', { name: 'support@kanbancareer.com' })
  await expect(emailLink).toBeVisible()
  await expect(emailLink).toHaveAttribute('href', 'mailto:support@kanbancareer.com')

  await expect(contactCard).toContainText(/Email de soporte: support@kanbancareer\.com/)
  await expect(contactCard).toContainText(/Horario: Lunes a viernes de 9:00 a 14:00/)
  await expect(contactCard).toContainText(/Tiempo de respuesta: en 24–48 horas laborables/)

  const enPage = await context.newPage()
  await enPage.addInitScript((locale) => localStorage.setItem('locale', locale), 'en')
  await enPage.goto('/support')
  await expect(enPage.getByRole('heading', { level: 2, name: /^(Contacto|Contact)$/ })).toHaveText('Contact')
  const enContactCard = enPage.locator('section').filter({ hasText: 'Support email' })
  await expect(enContactCard).toBeVisible()
  await expect(enContactCard).toContainText(/Support email: support@kanbancareer\.com/)
  await expect(enContactCard).toContainText(/Hours: Monday to Friday, 9:00 AM – 2:00 PM/)
  await expect(enContactCard).toContainText(/Response time: within 24–48 business hours/)
  await enPage.close()
})

test('should reveal answers in the FAQ accordion and close on opening another question', async ({ page }) => {
  await page.goto('/support')

  const firstQuestion = page.locator('summary').filter({ hasText: /KanbanCareer es gratis|Is KanbanCareer free/ })
  const secondQuestion = page.locator('summary').filter({ hasText: /Cómo creo una cuenta|How do I create an account/ })
  const firstAnswer = page.getByText(/Los planes de pago añaden funciones avanzadas/)
  const secondAnswer = page.getByText(/completa el formulario de registro/)

  await expect(firstAnswer).not.toBeVisible()
  await expect(secondAnswer).not.toBeVisible()

  await firstQuestion.click()
  await expect(firstAnswer).toBeVisible()
  await expect(secondAnswer).not.toBeVisible()

  await secondQuestion.click()
  await expect(secondAnswer).toBeVisible()
  await expect(firstAnswer).not.toBeVisible()

  await secondQuestion.click()
  await expect(secondAnswer).not.toBeVisible()

  await secondQuestion.focus()
  await page.keyboard.press('Enter')
  await expect(secondAnswer).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(secondAnswer).not.toBeVisible()
})

test('should render legal pages inside the MainLayout', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.locator('main#main-content')).toBeVisible()
})

test('should disable smooth scroll and still render the legal page with reduced motion', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Política de Privacidad|Privacy Policy/)
  await expect(page.getByRole('navigation', { name: /Índice|Table of Contents/ })).toBeVisible()
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
})

test('should render legal document content as plain text with no card surfaces in the chapters region (scoped to main div.space-y-xl)', async ({ page, context }) => {
  await page.goto('/privacy')
  const chapters = page.locator('main div.space-y-xl')
  await expect(chapters).toBeVisible()
  await expect(chapters.locator('[class*="bg-surface-container-lowest"]')).toHaveCount(0)

  const enPage = await context.newPage()
  await enPage.goto('/support')
  const supportChapters = enPage.locator('main div.space-y-xl')
  await expect(supportChapters).toBeVisible()
  await expect(supportChapters.locator('[class*="bg-surface-container-lowest"]')).toHaveCount(0)
  await expect(enPage.locator('main [class*="bg-surface-container-lowest"]')).not.toHaveCount(0)
  await enPage.close()
})
