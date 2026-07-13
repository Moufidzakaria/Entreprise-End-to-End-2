import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
   const dir = path.dirname(authFile);
   if (!fs.existsSync(dir)){
       fs.mkdirSync(dir, { recursive: true });
   }

   const loginPage = new LoginPage(page); 
   
   // 1. Ouvrir la page de connexion
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl + '/login', { waitUntil: 'domcontentloaded' });
   
   // =========================================================================
   // LA SOLUTION : Cliquer sur le consentement des cookies s'il s'affiche
   // =========================================================================
   const consentButton = page.getByRole('button', { name: /Autoriser tout/i });
   if (await consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
       await consentButton.click();
   }
   // =========================================================================

   // 2. Charger les identifiants sécurisés
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // 3. Soumettre les identifiants (Ne sera plus bloqué à la ligne 25/36 !)
   await loginPage.login(email, password);
   
   // 4. Attendre que l'état connecté soit validé
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // 5. Sauvegarder la session globale
   await page.context().storageState({ path: authFile });
});