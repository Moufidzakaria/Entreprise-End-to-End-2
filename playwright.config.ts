import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from local .env file safely
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 30000, // 30 seconds per test execution ceiling
  maxFailures: 1,

  // Run test files in parallel for extreme speed
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry twice on CI to handle any network flakiness, 0 retries locally
  retries: process.env.CI ? 2 : 0,
 
  // Limit workers to 2 on cloud infrastructure to prevent resource throttling
  workers: process.env.CI ? 2 : undefined,

  // Highly verbose and structured report outputs
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
 
  // Global settings for target test targets
  use: {
    // Fallback directly to the target environment if process.env.BASE_URL is not provided on the host
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  /* Execution projects for target runtime configurations */
  projects: [
    // 1. Setup Project: Handle global authentication state setup prior to UI validation
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // 2. Core Execution Project: Runs tests with pre-baked context credentials
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Re-use cached session tokens to instantly bypass landing login logic
        storageState: 'playwright/.auth/user.json',
      },
      // Block orchestration dependency to force setup success before execution
      dependencies: ['setup'],
    },
  ],
});