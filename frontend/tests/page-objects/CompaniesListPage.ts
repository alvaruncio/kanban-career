import type { Page, Locator } from '@playwright/test'

export class CompaniesListPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/companies')
  }

  get heading(): Locator {
    return this.page.locator('h1')
  }

  get companyCards(): Locator {
    // Each card is a <button> element with an <h3> inside
    return this.page.locator('button').filter({ has: this.page.locator('h3') })
  }

  companyCard(name: string): Locator {
    return this.page.locator('button').filter({ hasText: name })
  }

  get emptyState(): Locator {
    return this.page
      .locator('text=No hay empresas registradas')
      .or(this.page.locator('text=No companies registered'))
  }

  get errorMessage(): Locator {
    return this.page.locator('[role="alert"]').filter({ hasText: /error/i })
  }

  get retryButton(): Locator {
    return this.page.getByRole('button', { name: /reintentar|retry/i })
  }

  get fabButton(): Locator {
    return this.page.getByRole('button', { name: /nueva empresa|new company/i })
  }

  async clickCompanyCard(name: string): Promise<void> {
    await this.companyCard(name).click()
  }

  get loadingSkeleton(): Locator {
    return this.page.locator('.animate-spin').first()
  }
}
