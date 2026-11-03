import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  
  // 0 signifie que Playwright continue d'exécuter le reste des tests même si l'un d'eux échoue
  maxFailures: 0, 

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
 
  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});