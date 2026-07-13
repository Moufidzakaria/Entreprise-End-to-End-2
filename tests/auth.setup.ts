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

   // LA SOLUTION RADICALE : Bloquer les pubs et overlays Google avant qu'ils n'arrivent
   await page.route('**/*', (route) => {
       const url = route.request().url();
       if (
           url.includes('googleads') || 
           url.includes('doubleclick') || 
           url.includes('adservice') ||
           url.includes('fundingchoicesmessages') ||
           url.includes('pagead')
       ) {
           return route.abort(); // Bloque la requête publicitaire
       }
       return route.continue();
   });

   const loginPage = new LoginPage(page); 
   
   // 1. Charger la page de connexion
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl + '/login', { waitUntil: 'domcontentloaded' });
   
   // Un petit temps d'attente pour s'assurer que le DOM est stable sans pub
   await page.waitForTimeout(2000);

   // 2. Charger les identifiants
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // 3. Exécuter le login (le bouton ne sera plus jamais intercepté par une pub !)
   await loginPage.login(email, password);
   
   // 4. Valider la connexion réussie
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // 5. Sauvegarder la session
   await page.context().storageState({ path: authFile });
});