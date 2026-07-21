import type { Page } from '@playwright/test'

export class RegisterPage {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(): Promise<void> {
    await this.page.goto('/register')
  }

  async fillName(name: string): Promise<void> {
    await this.page.locator('#name').fill(name)
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator('#email').fill(email)
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.locator('#password').fill(password)
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.page.locator('#confirmPassword').fill(password)
  }

  async submit(): Promise<void> {
    await this.page.locator('button[type="submit"]').click()
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.fillName(name)
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.fillConfirmPassword(password)
    await this.submit()
  }
}
