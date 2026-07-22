import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class ProfilePage {
  private readonly page: Page
  
  constructor(page: Page) {
    this.page = page
  }

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

  async expectFieldVisible(label: string): Promise<void> {
    await expect(this.page.getByText(label)).toBeVisible()
  }

  async expectNotSetIndicator(): Promise<void> {
    await expect(this.page.getByText(/no establecido|not set/i).first()).toBeVisible()
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

  async expectFieldInEditMode(label: string): Promise<void> {
    await expect(this.page.getByLabel(new RegExp(label, 'i'))).toBeVisible()
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(message, 'i'))).toBeVisible()
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

  async expectSuccessNotification(): Promise<void> {
    await expect(this.page.getByRole('alert').first()).toBeVisible()
  }

  // ── URL ────────────────────────────────────────────────

  currentUrl(): string {
    return this.page.url()
  }
}
