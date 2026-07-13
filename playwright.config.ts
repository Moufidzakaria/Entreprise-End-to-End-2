import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Charge le fichier .env local s'il existe (pour votre environnement de dev local)
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // Augmenté à 60s pour donner plus de temps à l'authentification en CI
  maxFailures: 1,

  // Exécution en parallèle pour optimiser la vitesse
  fullyParallel: true,

  // Bloque le build sur Azure si un test.only a été oublié
  forbidOnly: !!process.env.CI,

  // Tente de rejouer le test jusqu'à 2 fois en cas de coupure réseau sur le Cloud
  retries: process.env.CI ? 2 : 0,
 
  // Limite à 2 workers sur l'agent cloud pour éviter de saturer l'infrastructure
  workers: process.env.CI ? 2 : undefined,

  // Rapports détaillés et structurés
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }], // Utilisé par PublishTestResults@2
  ],
 
  use: {
    // Récupère l'URL injectée par le pipeline Azure DevOps
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on', // Enregistre la trace complète pour analyser visuellement les échecs
  },

  /* Définition des projets d'exécution */
  projects: [
    // 1. Étape préliminaire : Gère l'authentification globale avant la validation de l'UI
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // 2. Étape principale : Exécute vos tests d'interface
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Utilise la session persistante générée par l'étape setup
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'], // Force l'exécution et la réussite du setup d'abord
    },
  ],
});