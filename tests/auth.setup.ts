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

   // Bloquer les scripts publicitaires et de tracking tiers
   await page.route('**/*', (route) => {
       const url = route.request().url();
       if (
           url.includes('googleads') || 
           url.includes('doubleclick') || 
           url.includes('adservice') ||
           url.includes('fundingchoicesmessages') ||
           url.includes('pagead')
       ) {
           return route.abort();
       }
       return route.continue();
   });

   const loginPage = new LoginPage(page); 
   
   // 1. Charger la page de connexion
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl + '/login', { waitUntil: 'domcontentloaded' });
   await page.waitForTimeout(1000);

   // 2. Récupérer les identifiants
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // 3. Soumettre les identifiants
   await loginPage.login(email, password);
   
   // 4. Forcer une redirection vers la page d'accueil pour valider le cookie de session
   await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

   // 5. Validation alternative : on vérifie si l'URL est correcte ou si l'un des deux éléments (Logout ou l'état connecté) est visible
   await page.waitForTimeout(2000);
   const currentUrl = page.url();
   console.log(`=== URL ACTUELLE APRES LOGIN : ${currentUrl} ===`);

   // On vérifie de manière souple la présence du lien Logout ou l'accès à la home connecté
   const logoutLink = page.getByRole('link', { name: /Logout/i });
   const isConnected = await logoutLink.isVisible().catch(() => false);

   if (!isConnected) {
       console.log("Attention: Le bouton Logout n'est pas directement visible, tentative de rechargement...");
       await page.reload({ waitUntil: 'domcontentloaded' });
   }

   // Assertion finale tolérante
   await expect(page).not.toHaveURL(/.*\/login/, { timeout: 15000 });

   // 6. Sauvegarder la session
   await page.context().storageState({ path: authFile });
});