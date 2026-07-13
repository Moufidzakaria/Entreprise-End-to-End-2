import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  
  // 0 signifie que Playwright continue d'exécuter le reste des tests même si l'un d'eux échoue
  maxFailures: 0, 

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

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
    /* NOTE : Si votre fichier auth.setup.ts n'est pas prêt, vous pouvez commenter 
      le bloc 'setup' et la ligne 'dependencies' ci-dessous pour ne pas bloquer le projet.
    */
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Commentez cette ligne si le fichier user.json n'est pas encore généré par le setup
        // storageState: 'playwright/.auth/user.json', 
      },
      // Commentez cette ligne si vous voulez tester le reste sans attendre le setup
      dependencies: ['setup'], 
    },
  ],
});