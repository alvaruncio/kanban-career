import type { Page, Locator } from '@playwright/test'

export class ProfilePage {
  constructor(private readonly page: Page) {}

  // ── Navigation ─────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/profile')
    await this.page.waitForURL('**/profile', { timeout: 10000 })
  }

  async navigateFromHeader(): Promise<void> {
    await this.page.getByRole('link', { name: /perfil|profile/i }).first().click()
    await this.page.waitForURL('**/profile', { timeout: 10000 })
  }

  // ── Profile fields (view mode) ─────────────────────────

  field(label: string): Locator {
    return this.page.getByText(label)
  }

  get notSetIndicator(): Locator {
    return this.page.getByText(/no establecido|not set/i).first()
  }

  // ── Edit mode ──────────────────────────────────────────

  get editButton(): Locator {
    return this.page.getByRole('button', { name: /editar|edit/i })
  }

  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: /cancelar|cancel/i })
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: /guardar|save/i })
  }

  async enterEditMode(): Promise<void> {
    await this.editButton.click()
  }

  async cancelEdit(): Promise<void> {
    await this.cancelButton.click()
  }

  async saveProfile(): Promise<void> {
    await this.saveButton.click()
  }

  async fillField(label: string, value: string): Promise<void> {
    await this.page.getByLabel(new RegExp(label, 'i')).fill(value)
  }

  fieldInEditMode(label: string): Locator {
    return this.page.getByLabel(new RegExp(label, 'i'))
  }

  validationError(message: string): Locator {
    return this.page.getByText(new RegExp(message, 'i'))
  }

  // ── Password section ───────────────────────────────────

  get changePasswordButton(): Locator {
    return this.page.getByRole('button', { name: /cambiar contraseña|change password/i })
  }

  async fillCurrentPassword(value: string): Promise<void> {
    await this.page.getByLabel(/contraseña actual|current password/i).fill(value)
  }

  async fillNewPassword(value: string): Promise<void> {
    await this.page.getByLabel(/Nueva contraseña|New password/).fill(value)
  }

  async fillConfirmPassword(value: string): Promise<void> {
    await this.page.getByLabel(/Confirmar nueva contraseña|Confirm new password/).fill(value)
  }

  async changePassword(current: string, newPassword: string): Promise<void> {
    await this.fillCurrentPassword(current)
    await this.fillNewPassword(newPassword)
    await this.fillConfirmPassword(newPassword)
    await this.changePasswordButton.click()
  }

  // ── Notifications ──────────────────────────────────────

  get successNotification(): Locator {
    const successText = /actualizado|updated|guardado|saved/i
    return this.page.locator('[role="alert"]').filter({ hasText: successText })
  }

  // ── Avatar ─────────────────────────────────────────────

  get avatarUrlField(): Locator {
    return this.page.getByLabel(/avatar url/i)
  }

  avatarImage(src?: string): Locator {
    if (src) {
      return this.page.locator(`img[src="${src}"]`)
    }
    const fallback = this.page.locator('text=Imagen Usuario').or(this.page.locator('text=User Image'))
    return fallback
  }

  get avatarValidationError(): Locator {
    return this.page.getByText(/URL no válida|Invalid URL/i)
  }

  async fillAvatarUrl(url: string): Promise<void> {
    await this.avatarUrlField.fill(url)
  }

  // ── URL ────────────────────────────────────────────────

  currentUrl(): string {
    return this.page.url()
  }
}
