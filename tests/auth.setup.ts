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
   
   // 1. Attendre que le réseau soit totalement calme (évite les injections de pub tardives)
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl + '/login', { waitUntil: 'networkidle' });
   
   // 2. Gérer la bannière de cookies Google Consent si elle bloque l'écran
   const consentButton = page.getByRole('button', { name: /Autoriser tout/i });
   if (await consentButton.isVisible({ timeout: 4000 }).catch(() => false)) {
       await consentButton.click();
       // Petite pause pour laisser l'overlay disparaître proprement
       await page.waitForTimeout(1000);
   }
   
   // 3. Charger les identifiants
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // 4. Exécuter le login sur une page désormais stable
   await loginPage.login(email, password);
   
   // 5. Valider la connexion réussie
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // 6. Sauvegarder la session
   await page.context().storageState({ path: authFile });
});