import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/specs',

  /* Maximum time one test can run */
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI (single worker) or use 2 locally */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'on-failure' }],
  ],

  /* Shared settings for all the projects below */
  use: {
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    headless: true,
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  /* Firefox is available when `npx playwright install firefox` is run */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
