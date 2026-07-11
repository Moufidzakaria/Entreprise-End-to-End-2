import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
 
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
 
  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    // 1. First Project: Run the authentication setup directly from the file name
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // 2. Main Project: Run tests using the saved storage state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Tell this project to use the cookies/session saved by the setup project
        storageState: 'playwright/.auth/user.json',
      },
      // Ensure that 'setup' runs and succeeds before 'chromium' starts
      dependencies: ['setup'],
    },
  ],
});