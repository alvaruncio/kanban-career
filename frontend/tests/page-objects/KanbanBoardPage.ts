import type { Page, Locator } from '@playwright/test'
import type { ApplicationStatus } from '../../src/interfaces'

export class KanbanBoardPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/kanban')
  }

  async isLoaded(): Promise<void> {
    await this.page.waitForSelector('[data-column-id]', { timeout: 10000 })
  }

  getColumn(status: ApplicationStatus): Locator {
    return this.page.locator(`[data-column-id="${status}"]`)
  }

  async getColumnApps(status: ApplicationStatus): Promise<Locator[]> {
    const column = this.getColumn(status)
    const cards = column.locator('[data-draggable-id]')
    const count = await cards.count()
    const result: Locator[] = []
    for (let i = 0; i < count; i++) {
      result.push(cards.nth(i))
    }
    return result
  }

  async clickCreateCard(): Promise<void> {
    await this.page.locator('button:has-text("add"), button:has-text("Crear")').first().click()
  }

  async dragCard(appId: string, toStatus: ApplicationStatus): Promise<void> {
    const source = this.page.locator(`[data-draggable-id="${appId}"]`)
    const targetColumn = this.getColumn(toStatus)

    const sourceBox = await source.boundingBox()
    const targetBox = await targetColumn.boundingBox()
    if (!sourceBox || !targetBox) throw new Error('Cannot determine drag element positions')

    const sx = sourceBox.x + sourceBox.width / 2
    const sy = sourceBox.y + sourceBox.height / 2
    const tx = targetBox.x + targetBox.width / 2
    const ty = targetBox.y + targetBox.height / 2

    // @dnd-kit uses pointer events, not native HTML5 drag events.
    // Simulate a pointer-based drag sequence with fine-grained steps.
    await this.page.mouse.move(sx, sy)
    await this.page.mouse.down()
    // Move in small steps so dnd-kit collision detection fires onDragOver
    await this.page.mouse.move(tx, ty, { steps: 20 })
    await this.page.mouse.up()
  }
}
