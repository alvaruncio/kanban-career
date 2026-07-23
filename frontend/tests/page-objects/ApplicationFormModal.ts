import type { Page, Locator } from '@playwright/test'

export class ApplicationFormModal {
  constructor(private readonly page: Page) {}

  // ── Visibility ─────────────────────────

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /Nueva aplicación|New Application/i })
  }

  async isVisible(): Promise<boolean> {
    return this.heading.isVisible()
  }

  async waitForClose(timeout = 10000): Promise<void> {
    await this.heading.waitFor({ state: 'hidden', timeout })
  }

  // ── Fields ──────────────────────────────

  async fillJobTitle(title: string): Promise<void> {
    await this.page.locator('#jobTitle').fill(title)
  }

  async fillOfferUrl(url: string): Promise<void> {
    await this.page.locator('#offerUrl').fill(url)
  }

  async selectCompany(companyId: string): Promise<void> {
    await this.page.locator('#companyId').selectOption(companyId)
  }

  async selectCategory(category: string): Promise<void> {
    await this.page.locator('#category').selectOption(category)
  }

  async selectSource(source: string): Promise<void> {
    await this.page.locator('#source').selectOption(source)
  }

  async fillApplicationDate(date: string): Promise<void> {
    await this.page.locator('#applicationDate').fill(date)
  }

  async fillDescription(desc: string): Promise<void> {
    await this.page.locator('#jobDescription').fill(desc)
  }

  // ── Actions ─────────────────────────────

  get submitButton(): Locator {
    return this.page.locator('button[type="submit"]')
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  // ── Composite ───────────────────────────

  async fillApplicationForm(fields: {
    jobTitle: string
    companyId: string
    category?: string
    source?: string
    applicationDate: string
    offerUrl?: string
    jobDescription?: string
  }): Promise<void> {
    await this.fillJobTitle(fields.jobTitle)
    await this.selectCompany(fields.companyId)
    if (fields.offerUrl) await this.fillOfferUrl(fields.offerUrl)
    if (fields.category) await this.selectCategory(fields.category)
    if (fields.source) await this.selectSource(fields.source)
    await this.fillApplicationDate(fields.applicationDate)
    if (fields.jobDescription) await this.fillDescription(fields.jobDescription)
  }
}
