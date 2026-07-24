import { test as base } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'
import { RegisterPage } from '../page-objects/RegisterPage'
import { KanbanBoardPage } from '../page-objects/KanbanBoardPage'
import { ApplicationFormModal } from '../page-objects/ApplicationFormModal'
import { ProfilePage } from '../page-objects/ProfilePage'
import { ApplicationDetailPage } from '../page-objects/ApplicationDetailPage'

interface MyFixtures {
  loginPage: LoginPage
  registerPage: RegisterPage
  kanbanBoardPage: KanbanBoardPage
  applicationFormModal: ApplicationFormModal
  profilePage: ProfilePage
  applicationDetailPage: ApplicationDetailPage
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
  applicationDetailPage: async ({ page }, use) => {
    await use(new ApplicationDetailPage(page))
  },
})

export { expect } from '@playwright/test'

/* Re-export auth helpers */
export { generateEmail, createTestUser, deleteTestUser } from './auth.fixture'

/* Re-export test data factories */
export {
  TEST_PASSWORD,
  TEST_USER_NAME,
  TEST_COMPANY,
  TEST_APPLICATION,
  createTestUserCredentials,
} from '../helpers/test-data'
