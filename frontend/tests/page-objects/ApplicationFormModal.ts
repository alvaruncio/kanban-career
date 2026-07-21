import type { Page } from '@playwright/test'

export class ApplicationFormModal {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async isVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("Nueva candidatura"), h2:has-text("New Application")').isVisible()
  }

  async fillJobTitle(title: string): Promise<void> {
    await this.page.locator('#jobTitle').fill(title)
  }

  async selectCompany(companyId: string): Promise<void> {
    await this.page.locator('#companyId').selectOption(companyId)
  }

  async fillDescription(desc: string): Promise<void> {
    await this.page.locator('#jobDescription').fill(desc)
  }

  async submit(): Promise<void> {
    await this.page.locator('button[type="submit"]').click()
  }
}
