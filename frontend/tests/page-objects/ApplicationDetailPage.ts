import type { Page, Locator } from '@playwright/test'

export class ApplicationDetailPage {
  constructor(private readonly page: Page) {}

  async goto(id: string): Promise<void> {
    await this.page.goto(`/application/${id}`)
  }

  get heading(): Locator {
    return this.page.locator('h1')
  }

  get companyName(): Locator {
    // The company name p is a sibling of the flex container holding h1
    return this.page.locator('p.font-body-lg')
  }

  get backToKanbanButton(): Locator {
    return this.page.getByRole('button', { name: /volver al kanban|back to kanban/i }).first()
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
    return this.page.locator('text=Candidatura no encontrada').or(this.page.locator('text=Application not found'))
  }

  get loadingSpinner(): Locator {
    return this.page.locator('.animate-spin')
  }

  get validationError(): Locator {
    return this.page.locator('[role="alert"]').filter({ hasText: /URL no válida|Invalid URL|obligatorio|required/i })
  }

  get fieldLabels(): Locator {
    return this.page.locator('p.font-label-md')
  }

  fieldValue(label: string): Locator {
    return this.page.locator(`p.font-label-md:has-text("${label}") + p.font-body-md`)
  }

  get jobTitleInput(): Locator {
    return this.page.locator('#jobTitle')
  }

  get statusSelect(): Locator {
    return this.page.locator('#status')
  }

  get categorySelect(): Locator {
    return this.page.locator('#category')
  }

  get sourceSelect(): Locator {
    return this.page.locator('#source')
  }

  get offerUrlInput(): Locator {
    return this.page.locator('#offerUrl')
  }

  get applicationDateInput(): Locator {
    return this.page.locator('#applicationDate')
  }

  get jobDescriptionTextarea(): Locator {
    return this.page.locator('#jobDescription')
  }

  get notesTextarea(): Locator {
    return this.page.locator('#notes')
  }
}
