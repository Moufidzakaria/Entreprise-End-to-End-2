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
   
   // Read target URL dynamically from environment or default to automationexercise
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
   
   // Load credentials strictly mapped to the active target architecture
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // Execute login flow
   await loginPage.login(email, password);
   
   // Confirm successful session injection
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // Save validated storage state context
   await page.context().storageState({ path: authFile });
});