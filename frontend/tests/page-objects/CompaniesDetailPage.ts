import type { Page, Locator } from '@playwright/test'

export class CompaniesDetailPage {
  constructor(private readonly page: Page) {}

  async goto(id: string): Promise<void> {
    await this.page.goto(`/companies/${id}`)
  }

  get heading(): Locator {
    return this.page.locator('h1')
  }

  get backButton(): Locator {
    return this.page.getByRole('button', { name: /volver a empresas|back to companies/i })
  }

  get editButton(): Locator {
    return this.page.getByRole('button', { name: /editar|edit/i })
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: /guardar cambios|save changes/i })
  }

  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: /cancelar|cancel/i })
  }

  get successMessage(): Locator {
    return this.page.locator('[role="alert"]').filter({ hasText: /guardado|cambios guardados|saved|successfully/i })
  }

  get errorMessage(): Locator {
    return this.page.locator('[role="alert"]').filter({ hasText: /error/i })
  }

  get notFoundMessage(): Locator {
    return this.page
      .locator('text=Compañía no encontrada')
      .or(this.page.locator('text=Página no encontrada'))
      .or(this.page.locator('text=Page not found'))
  }

  get nameInput(): Locator {
    return this.page.locator('#name')
  }

  get websiteInput(): Locator {
    return this.page.locator('#website')
  }

  get linkedinUrlInput(): Locator {
    return this.page.locator('#linkedinUrl')
  }

  get descriptionTextarea(): Locator {
    return this.page.locator('#description')
  }

  get relatedApplicationsSection(): Locator {
    return this.page.locator('h2').filter({ hasText: /candidaturas relacionadas|related applications/i })
  }

  get noRelatedApplications(): Locator {
    return this.page
      .locator('text=No hay candidaturas asociadas')
      .or(this.page.locator('text=No applications found'))
  }

  get loadingSpinner(): Locator {
    return this.page.locator('.animate-spin').first()
  }
}
