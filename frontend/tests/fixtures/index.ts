import { test as base } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'
import { RegisterPage } from '../page-objects/RegisterPage'
import { KanbanBoardPage } from '../page-objects/KanbanBoardPage'
import { ApplicationFormModal } from '../page-objects/ApplicationFormModal'
import { ProfilePage } from '../page-objects/ProfilePage'

interface MyFixtures {
  loginPage: LoginPage
  registerPage: RegisterPage
  kanbanBoardPage: KanbanBoardPage
  applicationFormModal: ApplicationFormModal
  profilePage: ProfilePage
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page))
  },
  kanbanBoardPage: async ({ page }, use) => {
    await use(new KanbanBoardPage(page))
  },
  applicationFormModal: async ({ page }, use) => {
    await use(new ApplicationFormModal(page))
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page))
  },
})

export { expect } from '@playwright/test'
export { generateEmail, createTestUser, deleteTestUser } from './auth.fixture'
