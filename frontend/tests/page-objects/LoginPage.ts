import type { Page } from '@playwright/test'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login')
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator('#email').fill(email)
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.locator('#password').fill(password)
  }

  async submit(): Promise<void> {
    await this.page.locator('button[type="submit"]').click()
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
  }
}
